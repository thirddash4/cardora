import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { card, cardPlaceholder, cardTemplate, team } from "@/db/schema";
import { sampleCard, sampleCards, sampleTemplates } from "@/lib/sample-data";

const hasDatabase = Boolean(process.env.DATABASE_URL);

export async function getTemplates() {
  if (!hasDatabase) return sampleTemplates;

  return db.select().from(cardTemplate).orderBy(cardTemplate.createdAt);
}

export async function getCards() {
  if (!hasDatabase) return sampleCards;

  return db.select().from(card).orderBy(card.createdAt);
}

export async function getCardById(id: string) {
  if (!hasDatabase) return sampleCards.find((c) => c.id === id) ?? null;

  const rows = await db.select().from(card).where(eq(card.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getPublicCard(slug: string) {
  if (!hasDatabase) return sampleCards.find((item) => item.slug === slug) ?? sampleCard;

  const rows = await db.select().from(card).where(eq(card.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getTeams() {
  if (!hasDatabase) {
    return [{ id: "team_carderna", name: "Carderna Studio", slug: "carderna-studio" }];
  }

  return db.select().from(team).orderBy(team.createdAt);
}

export async function getPlaceholders() {
  if (!hasDatabase) {
    return sampleTemplates.flatMap((template) =>
      template.schema.map((field) => ({
        id: `${template.id}_${field.key}`,
        templateId: template.id,
        key: field.key,
        label: field.label,
        type: field.type,
        required: Boolean(field.required),
        helpText: field.required ? "Required placeholder" : "Optional placeholder",
        createdAt: template.createdAt,
      })),
    );
  }

  return db.select().from(cardPlaceholder).orderBy(cardPlaceholder.createdAt);
}
