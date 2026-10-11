import type { SiteData } from "@/lib/site-content";
import { contactKinds } from "@/lib/contact-icons";

export type FieldDef =
  | { name: string; label: string; type: "text" | "url" | "textarea"; placeholder?: string; hint?: string; required?: boolean }
  | { name: string; label: string; type: "select"; options: (site: SiteData) => { value: string; label: string }[]; hint?: string; required?: boolean; allowEmpty?: boolean }
  | { name: string; label: string; type: "image"; folder: string; hint?: string }
  | { name: string; label: string; type: "boolean"; hint?: string }
  | { name: string; label: string; type: "work-images" };

export type SectionKey =
  | "work"
  | "category"
  | "experience"
  | "client"
  | "education"
  | "language"
  | "software"
  | "contact"
  | "shop_link";

export interface SectionDef {
  key: SectionKey;
  label: string;
  singular: string;
  description: string;
  fields: FieldDef[];
  /** Title + subtitle shown in the list. */
  summary: (d: Record<string, unknown>) => { title: string; subtitle?: string; image?: string };
  empty: Record<string, unknown>;
}

const s = (v: unknown) => (typeof v === "string" ? v : "");

export const sections: Record<SectionKey, SectionDef> = {
  work: {
    key: "work",
    label: "Portfolio",
    singular: "karya",
    description: "Karya yang tampil di bagian Portfolio. Gambar otomatis dikompres dan dibuatkan thumbnail.",
    fields: [
      { name: "title", label: "Judul", type: "text", required: true },
      {
        name: "category",
        label: "Kategori",
        type: "select",
        required: true,
        options: (site) => site.categories.map((c) => ({ value: c.id, label: c.id })),
        hint: "Tambah kategori baru di tab Kategori.",
      },
      { name: "client", label: "Klien / organisasi", type: "text", placeholder: "Opsional" },
      { name: "images", label: "Gambar", type: "work-images" },
      { name: "featured", label: "Tampilkan di slideshow hero", type: "boolean", hint: "Muncul di widget “Now viewing”." },
    ],
    summary: (d) => {
      const imgs = (d.images as { thumb?: string; src?: string }[] | undefined) ?? [];
      return { title: s(d.title), subtitle: [s(d.category), s(d.client)].filter(Boolean).join(" · "), image: imgs[0]?.thumb || imgs[0]?.src };
    },
    empty: { title: "", category: "", client: "", images: [], ratio: 1, featured: false },
  },
  category: {
    key: "category",
    label: "Kategori",
    singular: "kategori",
    description: "Filter di bagian Portfolio. Ganti nama kategori juga perlu menyesuaikan kategori di setiap karya.",
    fields: [
      { name: "name", label: "Nama", type: "text", required: true },
      { name: "note", label: "Keterangan", type: "text", placeholder: "Contoh: Commissioned projects" },
    ],
    summary: (d) => ({ title: s(d.name), subtitle: s(d.note) }),
    empty: { name: "", note: "" },
  },
  experience: {
    key: "experience",
    label: "Pengalaman",
    singular: "pengalaman",
    description: "Kartu di bagian Experience.",
    fields: [
      { name: "org", label: "Organisasi", type: "text", required: true },
      { name: "role", label: "Posisi", type: "text", required: true },
      { name: "years", label: "Periode", type: "text", placeholder: "2024–2025", required: true },
      { name: "description", label: "Deskripsi", type: "textarea", placeholder: "Opsional" },
      {
        name: "category",
        label: "Tampilkan preview karya",
        type: "select",
        allowEmpty: true,
        options: (site) => site.categories.map((c) => ({ value: c.id, label: c.id })),
        hint: "Opsional: menampilkan 3 karya dari kategori ini di kartu.",
      },
    ],
    summary: (d) => ({ title: s(d.org), subtitle: [s(d.role), s(d.years)].filter(Boolean).join(" · ") }),
    empty: { org: "", role: "", years: "", description: "", category: "" },
  },
  client: {
    key: "client",
    label: "Klien",
    singular: "klien",
    description: "Daftar “Designed for” di bawah Experience.",
    fields: [{ name: "name", label: "Nama", type: "text", required: true }],
    summary: (d) => ({ title: s(d.name) }),
    empty: { name: "" },
  },
  education: {
    key: "education",
    label: "Pendidikan",
    singular: "pendidikan",
    description: "Riwayat pendidikan. Item paling atas juga tampil di hero.",
    fields: [
      { name: "school", label: "Sekolah / kampus", type: "text", required: true },
      { name: "field", label: "Jurusan", type: "text", required: true },
      { name: "years", label: "Periode", type: "text", placeholder: "2023–Now", required: true },
    ],
    summary: (d) => ({ title: s(d.school), subtitle: [s(d.field), s(d.years)].filter(Boolean).join(" · ") }),
    empty: { school: "", field: "", years: "" },
  },
  language: {
    key: "language",
    label: "Bahasa",
    singular: "bahasa",
    description: "Bahasa yang dikuasai.",
    fields: [{ name: "name", label: "Bahasa", type: "text", required: true }],
    summary: (d) => ({ title: s(d.name) }),
    empty: { name: "" },
  },
  software: {
    key: "software",
    label: "Software",
    singular: "software",
    description: "Aplikasi yang dipakai, lengkap dengan ikon.",
    fields: [
      { name: "name", label: "Nama", type: "text", required: true },
      { name: "icon", label: "Ikon", type: "image", folder: "icons", hint: "Gambar persegi, latar transparan lebih bagus." },
    ],
    summary: (d) => ({ title: s(d.name), image: s(d.icon) }),
    empty: { name: "", icon: "" },
  },
  contact: {
    key: "contact",
    label: "Kontak",
    singular: "kontak",
    description: "Tampil di bagian Contact, tombol sosial di hero, dan halaman shop.",
    fields: [
      { name: "kind", label: "Jenis", type: "select", required: true, options: () => contactKinds },
      { name: "label", label: "Label", type: "text", required: true, placeholder: "WhatsApp" },
      { name: "value", label: "Teks yang ditampilkan", type: "text", required: true, placeholder: "@natalienetania" },
      { name: "href", label: "Link", type: "url", required: true, placeholder: "https://… atau mailto:…" },
    ],
    summary: (d) => ({ title: s(d.label), subtitle: s(d.value) }),
    empty: { kind: "instagram", label: "", value: "", href: "" },
  },
  shop_link: {
    key: "shop_link",
    label: "Link",
    singular: "link",
    description: "Tombol link di halaman shop (seperti link-in-bio).",
    fields: [
      { name: "title", label: "Judul tombol", type: "text", required: true },
      { name: "url", label: "Link", type: "url", required: true, placeholder: "https://… atau /halaman" },
      { name: "description", label: "Keterangan kecil", type: "text", placeholder: "Opsional" },
      {
        name: "kind",
        label: "Ikon",
        type: "select",
        options: () => [{ value: "link", label: "Link" }, ...contactKinds],
      },
    ],
    summary: (d) => ({ title: s(d.title), subtitle: s(d.url) }),
    empty: { title: "", url: "", description: "", kind: "link" },
  },
};

export const landingSections: SectionKey[] = ["work", "category", "experience", "client", "education", "language", "software", "contact"];
