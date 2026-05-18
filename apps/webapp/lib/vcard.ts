import type { Card } from "@/db/schema";

// Split "Piyawat Choopraserdchok" → { given: "Piyawat", family: "Choopraserdchok" }
function splitName(full: string): { given: string; family: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 0) return { given: "", family: "" };
  if (parts.length === 1) return { given: parts[0], family: "" };
  const family = parts[parts.length - 1];
  const given = parts.slice(0, -1).join(" ");
  return { given, family };
}

// vCard 3.0 line-folding + escaping per RFC 6350 (close enough for 3.0)
function escape(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function digitsOnly(phone: string): string {
  // Keep leading +, strip everything else
  const withPlus = phone.startsWith("+");
  const digits = phone.replace(/[^\d]/g, "");
  return withPlus ? `+${digits}` : digits;
}

export function buildVCard(card: Card, origin: string): string {
  const v = card.values;
  const fullName = v.name ?? "";
  const { given, family } = splitName(fullName);

  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escape(family)};${escape(given)};;;`,
    `FN:${escape(fullName)}`,
  ];

  if (v.nickname) lines.push(`NICKNAME:${escape(v.nickname)}`);
  if (v.company) lines.push(`ORG:${escape(v.company)}`);
  if (v.role) lines.push(`TITLE:${escape(v.role)}`);
  if (v.email) lines.push(`EMAIL;TYPE=WORK,INTERNET:${escape(v.email)}`);
  if (v.phone) {
    const tel = digitsOnly(v.phone);
    lines.push(`TEL;TYPE=CELL,VOICE:${tel}`);
  }
  if (v.website) {
    const website = v.website.startsWith("http")
      ? v.website
      : `https://${v.website}`;
    lines.push(`URL:${escape(website)}`);
  }
  if (v.location) lines.push(`ADR;TYPE=WORK:;;${escape(v.location)};;;;`);
  if (v.tagline) lines.push(`NOTE:${escape(v.tagline)}`);
  if (v.avatar && origin) {
    const photoUrl = v.avatar.startsWith("http")
      ? v.avatar
      : `${origin.replace(/\/$/, "")}${v.avatar}`;
    lines.push(`PHOTO;VALUE=URI:${escape(photoUrl)}`);
  }
  if (card.slug && origin) {
    lines.push(`URL;TYPE=PROFILE:${escape(`${origin.replace(/\/$/, "")}/c/${card.slug}`)}`);
  }
  lines.push(`REV:${new Date().toISOString()}`);
  lines.push("END:VCARD");

  // vCard requires CRLF line endings
  return lines.join("\r\n") + "\r\n";
}

export function vcardFileName(card: Card): string {
  const base = (card.values.name ?? card.slug ?? "contact")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  return `${base || "contact"}.vcf`;
}
