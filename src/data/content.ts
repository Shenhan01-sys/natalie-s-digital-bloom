// All copy and works below come from Natalie's own portfolio:
// https://natalinetania.my.canva.site/content
// Titles of works are the headlines printed on each design.

export const profile = {
  name: "Natalie Netania Sulistio",
  firstName: "Natalie",
  greeting: "Hi, this is my",
  title: "Portofolio",
  about:
    "A Management student at Duta Wacana Christian University specializing in Human Resources, with a strong passion for graphic design. Recognized for being detail-oriented and communicative, with a proven ability to work professionally both independently and within a team.",
  photo: "/photo-natalie.webp",
  photoAlt: "Portrait of Natalie Netania Sulistio",
  photoSecondary: "/photo-bouquet.webp",
  photoSecondaryAlt: "Natalie holding a pink flower bouquet",
  lastName: "Netania Sulistio",
  tagline: "Human Resources & Graphic Design",
  intro:
    "Management student at Duta Wacana Christian University specializing in Human Resources, with a strong passion for graphic design.",
  aboutLead: "Natalie Netania Sulistio, Management student at Duta Wacana Christian University.",
  experienceNote: "Organisations · 2024–2025",
};

export type Profile = typeof profile;

export interface EducationItem {
  school: string;
  field: string;
  years: string;
}

export const education: EducationItem[] = [
  { school: "Universitas Kristen Duta Wacana", field: "Management Student", years: "2023–Now" },
  { school: "SMA Negeri 2 Yogyakarta", field: "Science", years: "2020–2023" },
];

export const languages: string[] = ["Indonesian", "English"];

export interface SoftwareItem {
  name: string;
  icon: string;
}

export const software: SoftwareItem[] = [
  { name: "Canva", icon: "/deco/canva.webp" },
  { name: "CapCut", icon: "/deco/capcut.webp" },
];

export interface ExperienceItem {
  org: string;
  role: string;
  years: string;
  description?: string;
  /** Portfolio category to preview inside the card. */
  category?: string;
}

export const experience: ExperienceItem[] = [
  {
    org: "Soli Deo Gloria Christian Student Fellowship",
    role: "Design and Documentation Staff",
    years: "2024–2025",
  },
  {
    org: "Chinese Student Association",
    role: "Design and Documentation Staff",
    years: "2024–2025",
    category: "Banner",
  },
];

export const workedWith: string[] = [
  "Chinese Student Association",
  "Komunitas Chinese Indonesia",
  "Soli Deo Gloria Christian Student Fellowship",
  "Monic Bouquet",
  "Eternal Laundry",
];

export type ContactKind = "whatsapp" | "instagram" | "linkedin" | "email" | "tiktok" | "website";

export interface ContactItem {
  kind: ContactKind;
  label: string;
  value: string;
  href: string;
}

export const contacts: ContactItem[] = [
  {
    kind: "whatsapp",
    label: "WhatsApp",
    value: "+62 859-2154-8881",
    href: "https://wa.me/6285921548881",
  },
  {
    kind: "instagram",
    label: "Instagram",
    value: "@natalienetania",
    href: "https://www.instagram.com/natalienetania/",
  },
  {
    kind: "linkedin",
    label: "LinkedIn",
    value: "natalie-netania",
    href: "https://www.linkedin.com/in/natalie-netania",
  },
  {
    kind: "email",
    label: "Email",
    value: "natalienetania2212@gmail.com",
    href: "mailto:natalienetania2212@gmail.com",
  },
];

export type Category = string;

export interface CategoryItem {
  id: string;
  note: string;
}

export const categories: CategoryItem[] = [
  { id: "Banner", note: "Chinese Student Association · Komunitas Chinese Indonesia" },
  { id: "Infographics", note: "Commissioned projects & personal project" },
  { id: "Leaflet", note: "Commissioned projects" },
  { id: "Merchandise & Logo", note: "Chinese Student Association · Komunitas Chinese Indonesia · Eternal Laundry" },
  { id: "Social Media", note: "Soli Deo Gloria · Chinese Student Association · Monic Bouquet" },
  { id: "Christmas Cards", note: "Greeting cards" },
];

export interface Work {
  id: string;
  title: string;
  category: Category;
  client?: string;
  /** One or more images; leaflets carry both sides. */
  images: { src: string; thumb: string; label?: string }[];
  /** Intrinsic ratio of the first image (w / h) so the grid can reserve space. */
  ratio: number;
  /** Cycled by the "now viewing" widget in the hero. */
  featured?: boolean;
}

const img = (name: string, label?: string) => ({
  src: `/works/${name}.webp`,
  thumb: `/works/${name}-sm.webp`,
  label,
});

const rawWorks: Work[] = [
  // Banners
  { id: "imt-2024", title: "Ikatan Mahasiswa Tionghoa UKDW 2024", category: "Banner", client: "Chinese Student Association", images: [img("banner-imt-2024")], ratio: 2.4 },
  { id: "mooncake", title: "Mooncake Festival", category: "Banner", client: "Chinese Student Association", images: [img("banner-mooncake")], ratio: 3 },
  { id: "mooncake-recap", title: "Mooncake Festival Recap", category: "Banner", client: "Chinese Student Association", images: [img("banner-mooncake-recap")], ratio: 3 },
  { id: "kejurda", title: "Kejurda", category: "Banner", client: "Chinese Student Association", images: [img("banner-kejurda")], ratio: 3 },
  { id: "kejurda-recap", title: "Kejurda Recap", category: "Banner", client: "Chinese Student Association", images: [img("banner-kejurda-recap")], ratio: 3 },
  { id: "pancawasena", title: "Pancawasena", category: "Banner", client: "Chinese Student Association", images: [img("banner-pancawasena")], ratio: 3 },

  // Infographics
  { id: "ibu-sehat", title: "Ibu Sehat Bayi Selamat", category: "Infographics", images: [img("info-ibu-sehat")], ratio: 0.707 },
  { id: "kia-spire", title: "KIA Spire", category: "Infographics", images: [img("info-kia-spire")], ratio: 0.709 },
  { id: "imunisasi", title: "Bayi Sehat, Masa Depan Hebat: Ayo Imunisasi!", category: "Infographics", images: [img("info-imunisasi")], ratio: 0.707 },
  { id: "peramalan-umkm", title: "Peramalan UMKM", category: "Infographics", images: [img("info-peramalan-umkm")], ratio: 0.726 },
  { id: "kolesterol", title: "Kenali & Kendalikan Kolesterol, Gula Darah & Asam Urat", category: "Infographics", images: [img("info-kolesterol")], ratio: 0.707 },
  { id: "mi-bawel", title: "Mi Bawel Bayam & Wortel Carbonara", category: "Infographics", images: [img("info-mi-bawel")], ratio: 0.707 },
  { id: "susu-sapi", title: "Susu Sapi & Mini Pond", category: "Infographics", images: [img("info-susu-sapi")], ratio: 0.709 },
  { id: "corona", title: "Corona Virus", category: "Infographics", images: [img("info-corona")], ratio: 0.707 },

  // Leaflets (two sides each)
  { id: "leaflet-kehamilan", title: "Ibu Sehat, Bayi Selamat: Kenali Tanda Bahayanya", category: "Leaflet", images: [img("leaflet-kehamilan-1", "Side A"), img("leaflet-kehamilan-2", "Side B")], ratio: 1.414 },
  { id: "leaflet-imunisasi", title: "Imunisasi: Hadiah Pertama untuk Masa Depan Anak", category: "Leaflet", images: [img("leaflet-imunisasi-1", "Side A"), img("leaflet-imunisasi-2", "Side B")], ratio: 1.414 },
  { id: "leaflet-susu", title: "Dua Inovasi Desa: Mini Pond & Susu Sapi", category: "Leaflet", images: [img("leaflet-susu-1", "Side A"), img("leaflet-susu-2", "Side B")], ratio: 1.414 },

  // Merchandise & logo
  { id: "kci-logo", title: "Komunitas Chinese Indonesia Logo", category: "Merchandise & Logo", client: "Komunitas Chinese Indonesia", images: [img("merch-kci-logo", "Maroon"), img("merch-kci-logo-dark", "Black")], ratio: 1.414 },
  { id: "eternal-laundry", title: "Eternal Laundry Logo", category: "Merchandise & Logo", client: "Eternal Laundry", images: [img("merch-eternal-laundry")], ratio: 1 },
  { id: "kci-tee", title: "KCI T-Shirt", category: "Merchandise & Logo", client: "Komunitas Chinese Indonesia", images: [img("merch-kci-tee-maroon", "Maroon"), img("merch-kci-tee-black", "Black"), img("merch-kci-tee", "Red & black")], ratio: 1.415 },
  { id: "tee-white", title: "T-Shirt White Edition", category: "Merchandise & Logo", client: "Chinese Student Association", images: [img("merch-tee-white")], ratio: 1.415 },
  { id: "tee-black", title: "T-Shirt Black Edition", category: "Merchandise & Logo", client: "Chinese Student Association", images: [img("merch-tee-black")], ratio: 1.415 },
  { id: "keychain", title: "Key Chain", category: "Merchandise & Logo", client: "Chinese Student Association", images: [img("merch-keychain")], ratio: 1.415 },

  // Social media
  { id: "monic-bouquet", title: "Monic Bouquet Instagram", category: "Social Media", client: "Monic Bouquet", images: [img("social-monic-bouquet")], ratio: 1.665 },

  // Christmas cards
  { id: "xmas-red", title: "Merry Christmas Card", category: "Christmas Cards", images: [img("card-xmas-red")], ratio: 0.571 },
  { id: "xmas-navy", title: "Merry Christmas Card", category: "Christmas Cards", images: [img("card-xmas-navy")], ratio: 0.571 },
  { id: "xmas-santa", title: "I Wish You a Merry Christmas", category: "Christmas Cards", images: [img("card-xmas-santa")], ratio: 0.571 },
];

const featuredIds = ["ibu-sehat", "imt-2024", "kci-tee", "monic-bouquet", "kia-spire", "eternal-laundry"];

export const works: Work[] = rawWorks.map((w) => ({ ...w, featured: featuredIds.includes(w.id) }));

export interface ShopLink {
  title: string;
  url: string;
  description?: string;
  kind?: ContactKind | "link";
}

export interface BankAccount {
  bank: string;
  number: string;
  holder: string;
}

export interface ShopSettings {
  title: string;
  bio: string;
  avatar: string;
  banks: BankAccount[];
  qris: string;
  instructions: string;
  whatsapp: string;
}

export const shopSettings: ShopSettings = {
  title: "Natalie's Design Shop",
  bio: "Template Canva & desain digital siap pakai.",
  avatar: "/photo-natalie.webp",
  banks: [],
  qris: "",
  instructions:
    "Transfer sesuai nominal, lalu upload bukti pembayaran. Link template akan muncul di halaman pesananmu setelah pembayaran dikonfirmasi.",
  whatsapp: "6285921548881",
};

export const shopLinks: ShopLink[] = [
  { title: "Lihat portfolio saya", url: "/", kind: "link" },
  { title: "Instagram", url: "https://www.instagram.com/natalienetania/", kind: "instagram" },
  { title: "Chat via WhatsApp", url: "https://wa.me/6285921548881", kind: "whatsapp" },
];

export interface SiteContent {
  profile: Profile;
  education: EducationItem[];
  languages: string[];
  software: SoftwareItem[];
  experience: ExperienceItem[];
  clients: string[];
  contacts: ContactItem[];
  categories: CategoryItem[];
  works: Work[];
}

export const defaultContent: SiteContent = {
  profile,
  education,
  languages,
  software,
  experience,
  clients: workedWith,
  contacts,
  categories,
  works,
};
