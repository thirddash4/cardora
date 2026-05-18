import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { nextCookies } from "better-auth/next-js";
import * as schema from "../db/schema";
import { createId, slugify } from "../lib/ids";
import { defaultCardTheme } from "../lib/card-theme";

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME ?? "Cardora Admin";

if (!email || !password) {
  console.error("Missing ADMIN_EMAIL or ADMIN_PASSWORD env vars.");
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("Missing DATABASE_URL.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

const auth = betterAuth({
  appName: "Cardora",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret:
    process.env.BETTER_AUTH_SECRET ?? "cardora-local-development-secret-32",
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: { enabled: true },
  plugins: [nextCookies()],
});

async function main() {
  // Idempotent: skip if user already exists
  const existing = await db
    .select()
    .from(schema.user)
    .where(eq(schema.user.email, email!))
    .limit(1);

  if (existing.length === 0) {
    const result = await auth.api.signUpEmail({
      body: { email: email!, password: password!, name },
    });
    if (!result?.user) {
      throw new Error("Sign-up returned no user");
    }
    console.log(
      `✓ Created admin user ${result.user.email} (${result.user.id})`,
    );
  } else {
    console.log(`= Admin user already exists: ${existing[0].email}`);
  }

  const userRow =
    existing[0] ??
    (
      await db
        .select()
        .from(schema.user)
        .where(eq(schema.user.email, email!))
        .limit(1)
    )[0];

  // Seed default team + add admin as owner
  const teamSlug = "cardora-studio";
  let teamRow = (
    await db
      .select()
      .from(schema.team)
      .where(eq(schema.team.slug, teamSlug))
      .limit(1)
  )[0];

  if (!teamRow) {
    const teamId = createId("team");
    await db
      .insert(schema.team)
      .values({ id: teamId, name: "Cardora Studio", slug: teamSlug });
    teamRow = (
      await db
        .select()
        .from(schema.team)
        .where(eq(schema.team.id, teamId))
        .limit(1)
    )[0];
    console.log(`✓ Created team ${teamRow.name}`);
  } else {
    console.log(`= Team already exists: ${teamRow.name}`);
  }

  const member = await db
    .select()
    .from(schema.teamMember)
    .where(eq(schema.teamMember.userId, userRow.id))
    .limit(1);

  if (member.length === 0) {
    await db.insert(schema.teamMember).values({
      id: createId("tm"),
      teamId: teamRow.id,
      userId: userRow.id,
      role: "owner",
    });
    console.log(`✓ Added admin as owner of ${teamRow.name}`);
  } else {
    console.log(`= Admin already on a team`);
  }

  // Seed a starter template if none exist
  const templates = await db.select().from(schema.cardTemplate).limit(1);
  let templateId: string;
  if (templates.length === 0) {
    templateId = createId("tpl");
    await db.insert(schema.cardTemplate).values({
      id: templateId,
      teamId: teamRow.id,
      name: "Aurora Executive",
      slug: "aurora-executive",
      status: "published",
      description:
        "A cinematic digital business card template for founders, operators, and premium service teams.",
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
    });
    console.log(`✓ Seeded Aurora Executive template`);
  } else {
    templateId = templates[0].id;
    console.log(`= Template already exists`);
  }

  // Seed a demo card if none for this team
  const cards = await db
    .select()
    .from(schema.card)
    .where(eq(schema.card.teamId, teamRow.id))
    .limit(1);
  if (cards.length === 0) {
    await db.insert(schema.card).values({
      id: createId("card"),
      teamId: teamRow.id,
      templateId,
      slug: slugify(name) || "founder",
      title: name,
      values: {
        name,
        role: "Founder",
        company: "Cardora",
        email: email!,
        tagline: "Digital identity, designed.",
        location: "—",
        website: "cardora.app",
      },
      theme: { ...defaultCardTheme },
      layout: "aurora",
    });
    console.log(`✓ Seeded a starter card`);
  } else {
    console.log(`= Card already exists for team`);
  }

  console.log("\nSeed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
