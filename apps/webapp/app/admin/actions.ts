"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { card, cardPlaceholder, cardTemplate, team } from "@/db/schema";
import { createId, slugify } from "@/lib/ids";
import { defaultCardTheme } from "@/lib/card-theme";

const hasDatabase = Boolean(process.env.DATABASE_URL);

const teamSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).optional(),
});

const templateSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(12),
  slug: z.string().min(2).optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

const placeholderSchema = z.object({
  templateId: z.string().min(2),
  key: z.string().min(2),
  label: z.string().min(2),
  type: z.string().min(2),
  required: z.boolean().default(false),
});

const cardSchema = z.object({
  id: z.string().min(2),
  title: z.string().min(2),
  slug: z.string().min(2),
  layout: z.enum(["aurora", "editorial"]).default("aurora"),
  values: z.record(z.string(), z.string()),
  theme: z.record(z.string(), z.string()),
});

export async function createTeam(formData: FormData) {
  const input = teamSchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
  });
  const slug = slugify(input.slug ?? input.name);

  if (hasDatabase) {
    await db.insert(team).values({
      id: createId("team"),
      name: input.name,
      slug,
    });
  }

  revalidatePath("/admin/teams");
}

export async function createTemplate(formData: FormData) {
  const input = templateSchema.parse({
    name: formData.get("name"),
    description: formData.get("description"),
    slug: formData.get("slug") || undefined,
    status: formData.get("status") || "draft",
  });
  const slug = slugify(input.slug ?? input.name);

  if (hasDatabase) {
    await db.insert(cardTemplate).values({
      id: createId("tpl"),
      name: input.name,
      slug,
      status: input.status,
      description: input.description,
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
      ],
    });
  }

  revalidatePath("/admin/templates");
}

export async function createPlaceholder(formData: FormData) {
  const input = placeholderSchema.parse({
    templateId: formData.get("templateId"),
    key: slugify(String(formData.get("key") ?? "")).replaceAll("-", "_"),
    label: formData.get("label"),
    type: formData.get("type"),
    required: formData.get("required") === "on",
  });

  if (hasDatabase) {
    await db.insert(cardPlaceholder).values({
      id: createId("ph"),
      templateId: input.templateId,
      key: input.key,
      label: input.label,
      type: input.type,
      required: input.required,
    });
  }

  revalidatePath("/admin/placeholders");
}

export async function updateCard(payload: unknown) {
  const input = cardSchema.parse(payload);

  if (hasDatabase) {
    await db
      .update(card)
      .set({
        title: input.title,
        slug: slugify(input.slug),
        layout: input.layout,
        values: input.values,
        theme: input.theme,
        updatedAt: new Date(),
      })
      .where(eq(card.id, input.id));
  }

  revalidatePath("/admin/cards");
  revalidatePath(`/admin/cards/${input.id}`);
  revalidatePath(`/c/${input.slug}`);

  return { ok: true, slug: slugify(input.slug) };
}

export async function createCard(formData: FormData) {
  const title = String(formData.get("title") ?? "Untitled");
  const slug = slugify(String(formData.get("slug") || title));

  if (hasDatabase) {
    const templateIdFromForm = String(formData.get("templateId") ?? "").trim();
    const teamIdFromForm = String(formData.get("teamId") ?? "").trim();

    const templateId =
      templateIdFromForm ||
      (await db.select().from(cardTemplate).limit(1))[0]?.id;
    const teamId =
      teamIdFromForm || (await db.select().from(team).limit(1))[0]?.id;

    if (!templateId)
      throw new Error("No template available. Create one first.");
    if (!teamId) throw new Error("No team available. Create one first.");

    await db.insert(card).values({
      id: createId("card"),
      teamId,
      templateId,
      slug,
      title,
      values: {
        name: title,
        role: "—",
        company: "—",
        email: "hello@carderna.app",
      },
      theme: { ...defaultCardTheme },
      layout: "aurora",
    });
  }

  revalidatePath("/admin/cards");
}
