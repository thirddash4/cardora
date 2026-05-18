"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Check,
  RotateCcw,
  Save,
  TriangleAlert,
} from "lucide-react";
import { updateCard } from "@/app/admin/actions";
import { CardPreview } from "@/components/card-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Card } from "@/db/schema";
import {
  fontOptions,
  layoutOptions,
  normalizeCardTheme,
  normalizeLayout,
  type CardLayout,
  type CardTheme,
} from "@/lib/card-theme";

type FieldKey =
  | "name"
  | "role"
  | "company"
  | "email"
  | "phone"
  | "tagline"
  | "location"
  | "website";

const fieldDefs: { key: FieldKey; label: string; placeholder: string }[] = [
  { key: "name", label: "Full name", placeholder: "Mia Stratton" },
  { key: "role", label: "Role", placeholder: "Creative Director" },
  { key: "company", label: "Company", placeholder: "Atelier Nord" },
  { key: "email", label: "Email", placeholder: "hello@example.com" },
  { key: "phone", label: "Phone", placeholder: "+33 1 00 00 00 00" },
  { key: "location", label: "Location", placeholder: "Paris" },
  { key: "website", label: "Website", placeholder: "example.com" },
  {
    key: "tagline",
    label: "Tagline",
    placeholder: "Light, type, and the spaces between.",
  },
];

export function CardEditor({
  initialCard,
  hasDatabase,
}: {
  initialCard: Card;
  hasDatabase: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const initialTheme = normalizeCardTheme(initialCard.theme);
  const initialLayout = normalizeLayout(initialCard.layout);

  const [title, setTitle] = useState(initialCard.title);
  const [slug, setSlug] = useState(initialCard.slug);
  const [layout, setLayout] = useState<CardLayout>(initialLayout);
  const [theme, setTheme] = useState<CardTheme>(initialTheme);
  const [values, setValues] = useState<Record<string, string>>({
    ...initialCard.values,
  });

  const liveCard: Card = {
    ...initialCard,
    title,
    slug,
    layout,
    theme: theme as unknown as Record<string, string>,
    values,
  };

  function setField(key: FieldKey, v: string) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  function reset() {
    setTheme(initialTheme);
    setLayout(initialLayout);
    setValues({ ...initialCard.values });
    setTitle(initialCard.title);
    setSlug(initialCard.slug);
  }

  function save() {
    setSaved(false);
    startTransition(async () => {
      await updateCard({
        id: initialCard.id,
        title,
        slug,
        layout,
        values,
        theme: theme as unknown as Record<string, string>,
      });
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 1800);
    });
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
      {/* Left — controls */}
      <aside className="space-y-8">
        <header className="space-y-1">
          <p className="eyebrow eyebrow-accent">customize</p>
          <h1 className="font-display text-4xl italic lowercase tracking-tight">
            {title || "untitled"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Edits update the preview instantly. Save to publish.
          </p>
        </header>

        {!hasDatabase ? (
          <div className="flex items-start gap-3 rounded-md border border-amber-500/30 bg-amber-500/[0.06] p-3 text-xs">
            <TriangleAlert className="size-4 shrink-0 text-amber-400" />
            <p className="text-amber-100/80">
              No <code className="font-mono">DATABASE_URL</code> set — saves are
              a no-op against sample data. Configure Neon in{" "}
              <code className="font-mono">.env.local</code> to persist.
            </p>
          </div>
        ) : null}

        <Group label="Card meta">
          <Field label="Title">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="Slug" hint={`Public at /c/${slug}`}>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          </Field>
        </Group>

        <Group label="Layout">
          <div className="grid gap-2">
            {layoutOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setLayout(opt.value)}
                className={`group rounded-md border p-3 text-left transition-colors ${
                  layout === opt.value
                    ? "border-[var(--accent-color)] bg-[var(--accent-color)]/[0.04]"
                    : "hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-xl italic lowercase">
                    {opt.label}
                  </span>
                  {layout === opt.value ? (
                    <Check className="size-4 text-[var(--accent-color)]" />
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {opt.tagline}
                </p>
              </button>
            ))}
          </div>
        </Group>

        <Group label="Theme">
          <div className="grid grid-cols-2 gap-3">
            <ColorField
              label="Accent"
              value={theme.accent}
              onChange={(v) => setTheme((t) => ({ ...t, accent: v }))}
            />
            <ColorField
              label="Ink"
              value={theme.ink}
              onChange={(v) => setTheme((t) => ({ ...t, ink: v }))}
            />
            <ColorField
              label="Surface"
              value={theme.surface}
              onChange={(v) => setTheme((t) => ({ ...t, surface: v }))}
            />
            <ColorField
              label="Paper"
              value={theme.paper}
              onChange={(v) => setTheme((t) => ({ ...t, paper: v }))}
            />
          </div>

          <Field label="Display font">
            <select
              className="h-10 w-full rounded-md border px-3 text-sm"
              value={theme.fontDisplay}
              onChange={(e) =>
                setTheme((t) => ({
                  ...t,
                  fontDisplay: e.target.value as CardTheme["fontDisplay"],
                }))
              }
            >
              {fontOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Body font">
            <select
              className="h-10 w-full rounded-md border px-3 text-sm"
              value={theme.fontBody}
              onChange={(e) =>
                setTheme((t) => ({
                  ...t,
                  fontBody: e.target.value as CardTheme["fontBody"],
                }))
              }
            >
              {fontOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
        </Group>

        <Group label="Content">
          {fieldDefs.map((f) =>
            f.key === "tagline" ? (
              <Field key={f.key} label={f.label}>
                <Textarea
                  rows={2}
                  value={values[f.key] ?? ""}
                  placeholder={f.placeholder}
                  onChange={(e) => setField(f.key, e.target.value)}
                />
              </Field>
            ) : (
              <Field key={f.key} label={f.label}>
                <Input
                  value={values[f.key] ?? ""}
                  placeholder={f.placeholder}
                  onChange={(e) => setField(f.key, e.target.value)}
                />
              </Field>
            ),
          )}
        </Group>

        <div className="sticky bottom-4 z-10 flex flex-wrap gap-2 rounded-md border bg-[var(--surface-2)]/95 p-2 backdrop-blur">
          <Button onClick={save} disabled={isPending} className="flex-1">
            <Save className="size-4" />
            {isPending ? "Saving..." : saved ? "Saved" : "Save"}
          </Button>
          <Button type="button" variant="outline" onClick={reset}>
            <RotateCcw className="size-4" /> Reset theme
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href={`/c/${slug}`} target="_blank">
              <ArrowUpRight className="size-4" /> Public
            </Link>
          </Button>
        </div>
      </aside>

      {/* Right — live preview */}
      <section className="min-w-0">
        <div className="sticky top-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="eyebrow">Live preview</p>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              /c/{slug}
            </span>
          </div>
          <PreviewFrame>
            <CardPreview card={liveCard} fit />
          </PreviewFrame>
        </div>
      </section>
    </div>
  );
}

function Group({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <p className="eyebrow">{label}</p>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="flex items-center justify-between">
        <span>{label}</span>
        {hint ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {hint}
          </span>
        ) : null}
      </Label>
      {children}
    </div>
  );
}

const PREVIEW_WIDTH = 1280;
const PREVIEW_HEIGHT = 800;

function PreviewFrame({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setScale(Math.min(1, w / PREVIEW_WIDTH));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden rounded-lg border bg-[var(--ink)]"
      style={{ height: PREVIEW_HEIGHT * scale }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: PREVIEW_WIDTH,
          height: PREVIEW_HEIGHT,
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </Label>
      <div className="flex items-center gap-2 rounded-md border p-1.5">
        <input
          aria-label={`${label} color`}
          type="color"
          className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent font-mono text-xs outline-none"
        />
      </div>
    </div>
  );
}
