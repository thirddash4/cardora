import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema";
import { createId, slugify } from "../lib/ids";
import { defaultCardTheme } from "../lib/card-theme";

if (!process.env.DATABASE_URL) {
  console.error("Missing DATABASE_URL.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

const team357 = "357 Enterprise";
const teamSlug = "cardora-studio"; // keep existing team

const members = [
  {
    slug: "third",
    nickname: "Third",
    name: "Piyawat Choopraserdchok",
    role: "CEO",
    phone: "+66 63 878 7876",
    email: "piyawat.ch@357baking.com",
    avatar: "/avatars/third.jpg",
  },
  {
    slug: "save",
    nickname: "Save",
    name: "Thanawat Choopraserdchok",
    role: "Founder",
    phone: "+66 80 514 9456",
    email: "thanawat.ch@357baking.com",
  },
  {
    slug: "nui",
    nickname: "Nui",
    name: "Rungnapa Jorasa",
    role: "Senior Operations Manager",
    phone: "+66 98 261 3736",
    email: "rungnapa.j@357baking.com",
  },
  {
    slug: "geaw",
    nickname: "Geaw",
    name: "Janyaporn Jannoi",
    role: "Executive Assistant",
    phone: "+66 98 958 5535",
    email: "janyaporn@357baking.com",
  },
];

async function main() {
  const teamRow = (
    await db.select().from(schema.team).where(eq(schema.team.slug, teamSlug)).limit(1)
  )[0];
  if (!teamRow) {
    console.error(`No team with slug ${teamSlug}.`);
    process.exit(1);
  }

  const template = (
    await db.select().from(schema.cardTemplate).limit(1)
  )[0];
  if (!template) {
    console.error("No template found. Run the admin seed first.");
    process.exit(1);
  }

  for (const m of members) {
    const slug = slugify(m.slug);
    const values: Record<string, string> = {
      name: m.name,
      nickname: m.nickname,
      role: m.role,
      company: team357,
      email: m.email,
      phone: m.phone,
      website: "357baking.com",
    };
    if (m.avatar) values.avatar = m.avatar;

    const existing = (
      await db.select().from(schema.card).where(eq(schema.card.slug, slug)).limit(1)
    )[0];

    if (existing) {
      await db
        .update(schema.card)
        .set({
          title: m.name,
          values,
          theme: { ...defaultCardTheme },
          layout: "aurora",
          updatedAt: new Date(),
        })
        .where(eq(schema.card.id, existing.id));
      console.log(`= Updated /c/${slug}  (${m.name})`);
    } else {
      await db.insert(schema.card).values({
        id: createId("card"),
        teamId: teamRow.id,
        templateId: template.id,
        slug,
        title: m.name,
        values,
        theme: { ...defaultCardTheme },
        layout: "aurora",
      });
      console.log(`✓ Created /c/${slug}  (${m.name})`);
    }
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
