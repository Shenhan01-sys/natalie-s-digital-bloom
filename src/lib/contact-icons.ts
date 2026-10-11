import { Globe, Instagram, Link2, Linkedin, Mail, MessageCircle, Music2, type LucideIcon } from "lucide-react";
import type { ContactKind } from "@/data/content";

/** Glossy app-style tiles in /public/deco. */
export const contactTile: Partial<Record<ContactKind, string>> = {
  whatsapp: "/deco/whatsapp.webp",
  instagram: "/deco/instagram.webp",
  linkedin: "/deco/linkedin.webp",
  email: "/deco/gmail.webp",
};

/** Line icons for compact rows. */
export const contactIcon: Record<ContactKind | "link", LucideIcon> = {
  whatsapp: MessageCircle,
  instagram: Instagram,
  linkedin: Linkedin,
  email: Mail,
  tiktok: Music2,
  website: Globe,
  link: Link2,
};

export const contactKinds: { value: ContactKind; label: string }[] = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "email", label: "Email" },
  { value: "tiktok", label: "TikTok" },
  { value: "website", label: "Website" },
];

export const isExternal = (href: string) => /^https?:\/\//.test(href);
