import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { and, eq } from "drizzle-orm";
import * as schema from "../db/schema";
import { defaultCardTheme } from "../lib/card-theme";

if (!process.env.DATABASE_URL) {
  console.error("Missing DATABASE_URL.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function main() {
  // 1) Revert Third card to original seed state
  const thirdSlug = "third";
  const adminEmail = process.env.ADMIN_EMAIL ?? "thirddash4@gmail.com";
  const adminName = process.env.ADMIN_NAME ?? "Third";

  const thirdCard = (
    await db.select().from(schema.card).where(eq(schema.card.slug, thirdSlug)).limit(1)
  )[0];

  if (thirdCard) {
    await db
      .update(schema.card)
      .set({
        title: adminName,
        layout: "aurora",
        theme: { ...defaultCardTheme },
        values: {
          name: adminName,
          role: "Founder",
          company: "Carderna",
          email: adminEmail,
          tagline: "Digital identity, designed.",
          location: "—",
          website: "carderna.app",
        },
        updatedAt: new Date(),
      })
      .where(eq(schema.card.id, thirdCard.id));
    console.log(`✓ Reverted /c/third to seed state`);
  } else {
    console.log(`= No /c/third card found`);
  }

  // 2) Delete the Mia Stratton card
  const miaDel = await db.delete(schema.card).where(eq(schema.card.slug, "mia")).returning();
  console.log(`${miaDel.length ? "✓" : "="} Deleted /c/mia card (${miaDel.length})`);

  // 3) Delete the Atelier Nord team (also cascades team_member rows)
  const atelierDel = await db
    .delete(schema.team)
    .where(eq(schema.team.slug, "atelier-nord"))
    .returning();
  console.log(`${atelierDel.length ? "✓" : "="} Deleted Atelier Nord team (${atelierDel.length})`);

  // 4) Delete the Editorial Noir template (only if no cards reference it)
  const editorialNoir = (
    await db
      .select()
      .from(schema.cardTemplate)
      .where(eq(schema.cardTemplate.slug, "editorial-noir"))
      .limit(1)
  )[0];

  if (editorialNoir) {
    const refs = await db
      .select()
      .from(schema.card)
      .where(eq(schema.card.templateId, editorialNoir.id))
      .limit(1);
    if (refs.length === 0) {
      await db.delete(schema.cardTemplate).where(eq(schema.cardTemplate.id, editorialNoir.id));
      console.log(`✓ Deleted Editorial Noir template`);
    } else {
      console.log(`! Skipped Editorial Noir delete — ${refs.length} card(s) reference it`);
    }
  } else {
    console.log(`= No Editorial Noir template found`);
  }

  // 5) Show final state
  const teams = await db.select().from(schema.team);
  const templates = await db.select().from(schema.cardTemplate);
  const cards = await db.select().from(schema.card);
  console.log(
    `\nFinal state: ${teams.length} team(s), ${templates.length} template(s), ${cards.length} card(s)`,
  );
  console.log(`Teams:`, teams.map((t) => t.slug).join(", "));
  console.log(`Templates:`, templates.map((t) => t.slug).join(", "));
  console.log(`Cards:`, cards.map((c) => `${c.slug} (${c.layout})`).join(", "));

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
