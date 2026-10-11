import { MEDIA_BUCKET, PROOF_BUCKET, supabase } from "./supabase";

const loadImage = (file: Blob) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("File ini bukan gambar yang bisa dibaca"));
    };
    img.src = url;
  });

/** Downscale to `max` px on the long edge and re-encode as WebP. */
async function toWebp(img: HTMLImageElement, max: number, quality = 0.85) {
  const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.round(img.naturalWidth * scale);
  const h = Math.round(img.naturalHeight * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", quality));
  if (!blob) throw new Error("Gambar gagal diproses");
  return blob;
}

const publicUrl = (path: string) => supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;

async function put(path: string, blob: Blob) {
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, blob, {
    contentType: "image/webp",
    cacheControl: "31536000",
  });
  if (error) throw error;
  return publicUrl(path);
}

export interface UploadedImage {
  src: string;
  thumb: string;
  ratio: number;
}

/** Uploads a full-size and a thumbnail WebP to the public media bucket. */
export async function uploadImage(file: File, folder: string): Promise<UploadedImage> {
  if (file.size > 25 * 1024 * 1024) throw new Error("Ukuran gambar lebih dari 25 MB");
  const img = await loadImage(file);
  const id = crypto.randomUUID();
  const [full, small] = await Promise.all([toWebp(img, 2000), toWebp(img, 720, 0.8)]);
  const [src, thumb] = await Promise.all([put(`${folder}/${id}.webp`, full), put(`${folder}/${id}-sm.webp`, small)]);
  return { src, thumb, ratio: Math.round((img.naturalWidth / img.naturalHeight) * 1000) / 1000 };
}

const proofExt: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

/** Buyer-side: uploads the transfer receipt to the private proofs bucket. */
export async function uploadProof(file: File): Promise<string> {
  const ext = proofExt[file.type];
  if (!ext) throw new Error("Upload file JPG, PNG, WebP atau PDF");
  if (file.size > 5 * 1024 * 1024) throw new Error("Ukuran file maksimal 5 MB");
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(PROOF_BUCKET).upload(path, file, { contentType: file.type });
  if (error) throw error;
  return path;
}

export async function proofUrl(path: string) {
  const { data, error } = await supabase.storage.from(PROOF_BUCKET).createSignedUrl(path, 60 * 10);
  if (error) throw error;
  return data.signedUrl;
}
