import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema";

if (!process.env.DATABASE_URL) {
  console.error("Missing DATABASE_URL.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

const renames: Array<{ from: string; to: string }> = [
  { from: "save", to: "thanawat.c" },
  { from: "nui", to: "rungnapa.j" },
  { from: "geaw", to: "janyaporn.j" },
];

async function main() {
  for (const r of renames) {
    const result = await db
      .update(schema.card)
      .set({ slug: r.to, updatedAt: new Date() })
      .where(eq(schema.card.slug, r.from))
      .returning();
    if (result.length > 0) {
      console.log(`✓ /c/${r.from} → /c/${r.to}`);
    } else {
      console.log(`= No card found at /c/${r.from}`);
    }
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
