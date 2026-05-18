import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema";
import { defaultCardTheme } from "../lib/card-theme";

if (!process.env.DATABASE_URL) {
  console.error("Missing DATABASE_URL.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function main() {
  const slug = "third";
  const values = {
    name: "Piyawat Choopraserdchok",
    nickname: "Third",
    role: "CEO",
    company: "357 Enterprise",
    email: "piyawat.ch@357baking.com",
    phone: "+66 63 878 7876",
    tagline: "Operator. Builder. Baking thoughtful systems.",
    location: "Bangkok",
    website: "357baking.com",
  };

  const row = (
    await db.select().from(schema.card).where(eq(schema.card.slug, slug)).limit(1)
  )[0];

  if (!row) {
    console.error(`No /c/${slug} card found.`);
    process.exit(1);
  }

  await db
    .update(schema.card)
    .set({
      title: values.name,
      values,
      theme: { ...defaultCardTheme },
      layout: "aurora",
      updatedAt: new Date(),
    })
    .where(eq(schema.card.id, row.id));

  console.log(`✓ Updated /c/${slug} to`, values.name);
  console.log(`  Role:    ${values.role}`);
  console.log(`  Company: ${values.company}`);
  console.log(`  Email:   ${values.email}`);
  console.log(`  Phone:   ${values.phone}`);

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
