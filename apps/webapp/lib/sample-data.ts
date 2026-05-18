import type { Card, CardTemplate } from "@/db/schema";
import { defaultCardTheme } from "@/lib/card-theme";

export const sampleTemplate: CardTemplate = {
  id: "tpl_aurora",
  teamId: "team_cardora",
  name: "Aurora Executive",
  slug: "aurora-executive",
  status: "published",
  description: "A cinematic digital business card template for founders, operators, and premium service teams.",
  theme: {
    primary: defaultCardTheme.accent,
    ink: defaultCardTheme.ink,
    glow: defaultCardTheme.accent,
    surface: defaultCardTheme.surface,
  },
  schema: [
    { key: "name", label: "Full name", type: "text", required: true },
    { key: "role", label: "Role", type: "text", required: true },
    { key: "company", label: "Company", type: "text", required: true },
    { key: "email", label: "Email", type: "email", required: true },
    { key: "phone", label: "Phone", type: "tel" },
    { key: "tagline", label: "Tagline", type: "text" },
    { key: "location", label: "Location", type: "text" },
    { key: "website", label: "Website", type: "url" },
  ],
  createdAt: new Date("2026-05-18T00:00:00.000Z"),
  updatedAt: new Date("2026-05-18T00:00:00.000Z"),
};

export const sampleCard: Card = {
  id: "card_third",
  teamId: "team_cardora",
  templateId: sampleTemplate.id,
  slug: "third",
  title: "Third Cardora",
  values: {
    name: "Third",
    role: "AI Systems Operator",
    company: "Cardora",
    email: "third@cardora.local",
    phone: "+66 00 000 0000",
    tagline: "Digital identity, designed.",
    location: "Bangkok",
    website: "cardora.app",
  },
  theme: {
    ink: defaultCardTheme.ink,
    surface: defaultCardTheme.surface,
    paper: defaultCardTheme.paper,
    accent: defaultCardTheme.accent,
    muted: defaultCardTheme.muted,
    fontDisplay: defaultCardTheme.fontDisplay,
    fontBody: defaultCardTheme.fontBody,
  },
  layout: "aurora",
  createdAt: new Date("2026-05-18T00:00:00.000Z"),
  updatedAt: new Date("2026-05-18T00:00:00.000Z"),
};

export const sampleCardEditorial: Card = {
  id: "card_lumen",
  teamId: "team_cardora",
  templateId: sampleTemplate.id,
  slug: "lumen",
  title: "Lumen Park",
  values: {
    name: "Lumen Park",
    role: "Creative Director",
    company: "Atelier Nord",
    email: "lumen@atelier.nord",
    phone: "+33 1 00 00 00 00",
    tagline: "Light, type, and the spaces between.",
    location: "Paris · Tokyo",
    website: "atelier.nord",
  },
  theme: {
    ink: "#0c0a08",
    surface: "#171411",
    paper: "#f0ebe2",
    accent: "#e6b58a",
    muted: "#7a7066",
    fontDisplay: "instrument-serif",
    fontBody: "geist",
  },
  layout: "editorial",
  createdAt: new Date("2026-05-18T00:00:00.000Z"),
  updatedAt: new Date("2026-05-18T00:00:00.000Z"),
};

export const sampleTemplates = [sampleTemplate];
export const sampleCards = [sampleCard, sampleCardEditorial];
