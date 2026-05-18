import type { Card } from "@/db/schema";
import {
  fontFamily,
  normalizeCardTheme,
  normalizeLayout,
  type CardTheme,
} from "@/lib/card-theme";

export function CardPreview({
  card,
  fit = false,
}: {
  card: Card;
  fit?: boolean;
}) {
  const layout = normalizeLayout(card.layout);
  const theme = normalizeCardTheme(card.theme);

  return layout === "editorial" ? (
    <EditorialCard card={card} theme={theme} fit={fit} />
  ) : (
    <AuroraCard card={card} theme={theme} fit={fit} />
  );
}

function AuroraCard({
  card,
  theme,
  fit,
}: {
  card: Card;
  theme: CardTheme;
  fit: boolean;
}) {
  const v = card.values;
  const accent = theme.accent;
  const heightClass = fit ? "h-full" : "min-h-svh";

  return (
    <section
      className={`relative isolate flex ${heightClass} w-full items-center justify-center overflow-hidden px-6 py-16`}
      style={{
        background: theme.ink,
        color: theme.paper,
        fontFamily: fontFamily(theme.fontBody),
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(60% 50% at 18% 20%, ${accent}24, transparent 60%),
            radial-gradient(50% 40% at 86% 78%, ${theme.accent}14, transparent 60%),
            linear-gradient(180deg, ${theme.ink}, ${theme.surface})`,
        }}
      />

      <div className="grid w-full max-w-6xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div
          className="rise space-y-8 rounded-lg border p-6 sm:p-8 lg:rounded-none lg:border-0 lg:p-0"
          style={{
            borderColor: `${theme.paper}14`,
            background: `linear-gradient(180deg, ${theme.surface}cc, ${theme.ink}66)`,
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: accent, boxShadow: `0 0 16px ${accent}` }}
              />
              <span
                className="eyebrow"
                style={{ color: theme.paper, opacity: 0.6 }}
              >
                {v.company ?? ""}
              </span>
            </div>
            {v.nickname ? (
              <span className="eyebrow" style={{ color: accent }}>
                {v.nickname}
              </span>
            ) : null}
          </div>

          <h1
            className="font-display max-w-full text-balance text-[clamp(48px,11vw,180px)] leading-[0.92] tracking-[-0.035em] [overflow-wrap:break-word] [hyphens:auto]"
            style={{ fontFamily: fontFamily(theme.fontDisplay) }}
          >
            <span className="lowercase italic" style={{ color: theme.paper }}>
              {v.name ?? "your name"}
            </span>
          </h1>

          <div className="space-y-3 pt-2">
            <p className="text-lg" style={{ color: theme.paper }}>
              {v.role}
            </p>
            {v.tagline ? (
              <p
                className="eyebrow"
                style={{ color: theme.paper, opacity: 0.5 }}
              >
                {v.tagline}
              </p>
            ) : null}
          </div>
        </div>

        <div
          className="rise hidden lg:block"
          style={{ animationDelay: "0.15s" }}
        >
          <article
            className="relative aspect-[1.62] w-full overflow-hidden p-7"
            style={{
              background: `linear-gradient(155deg, ${theme.surface} 0%, #000 130%)`,
              border: `1px solid ${accent}40`,
              borderRadius: 4,
              boxShadow: `0 40px 120px -20px ${accent}26, inset 0 1px 0 rgba(255,255,255,0.06)`,
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-32 -left-24 h-72 w-72 rounded-full blur-3xl"
              style={{ background: accent, opacity: 0.25 }}
            />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-start justify-between">
                <span
                  className="eyebrow"
                  style={{ color: theme.paper, opacity: 0.5 }}
                >
                  {v.company ?? ""}
                </span>
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: accent }}
                >
                  /c/{card.slug}
                </span>
              </div>

              <div>
                <p
                  className="font-display text-balance text-3xl lowercase italic leading-[0.95] tracking-tight sm:text-4xl [overflow-wrap:break-word]"
                  style={{
                    fontFamily: fontFamily(theme.fontDisplay),
                    color: theme.paper,
                  }}
                >
                  {v.name}
                </p>
                <p
                  className="mt-2 text-sm"
                  style={{ color: theme.paper, opacity: 0.55 }}
                >
                  {v.role}
                </p>
              </div>

              <ContactRows values={v} accent={accent} paper={theme.paper} />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function EditorialCard({
  card,
  theme,
  fit,
}: {
  card: Card;
  theme: CardTheme;
  fit: boolean;
}) {
  const v = card.values;
  const heightClass = fit ? "h-full" : "min-h-svh";

  return (
    <section
      className={`relative isolate ${heightClass} w-full overflow-x-hidden px-6 py-12`}
      style={{
        background: theme.paper,
        color: theme.ink,
        fontFamily: fontFamily(theme.fontBody),
      }}
    >
      <div
        className="mx-auto grid max-w-7xl gap-y-8"
        style={{ gridTemplateColumns: "repeat(12, minmax(0, 1fr))" }}
      >
        <header
          className="col-span-12 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b pb-4"
          style={{ borderColor: `${theme.ink}1f` }}
        >
          <span
            className="font-mono text-[10px] uppercase tracking-[0.24em] sm:text-[11px] sm:tracking-[0.28em]"
            style={{ color: theme.muted }}
          >
            issue №01 · {v.company}
          </span>
          <span
            className="font-mono text-[10px] uppercase tracking-[0.24em] sm:text-[11px] sm:tracking-[0.28em]"
            style={{ color: theme.muted }}
          >
            cardora · /c/{card.slug}
          </span>
        </header>

        <div className="col-span-12 lg:col-span-8 lg:col-start-1 rise">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.28em]"
            style={{ color: theme.muted }}
          >
            {v.role}
          </p>
          <h1
            className="font-display mt-3 max-w-full text-balance text-[clamp(48px,10vw,160px)] leading-[0.95] tracking-[-0.03em] [overflow-wrap:break-word] [hyphens:auto]"
            style={{
              fontFamily: fontFamily(theme.fontDisplay),
              color: theme.ink,
            }}
          >
            {v.name}
            <span className="italic" style={{ color: theme.accent }}>
              .
            </span>
          </h1>
        </div>

        <aside
          className="col-span-12 lg:col-span-4 lg:col-start-9 lg:row-start-2 lg:pt-12 rise"
          style={{ animationDelay: "0.1s" }}
        >
          <p
            className="font-display text-2xl italic leading-snug"
            style={{
              fontFamily: fontFamily(theme.fontDisplay),
              color: theme.ink,
            }}
          >
            “{v.tagline ?? "An editor's portfolio in a single, public address."}
            ”
          </p>
          <div className="mt-8 grid gap-3 text-sm">
            <Field
              label="Location"
              value={v.location ?? "—"}
              ink={theme.ink}
              muted={theme.muted}
            />
            <Field
              label="Website"
              value={v.website ?? "—"}
              ink={theme.ink}
              muted={theme.muted}
            />
            <Field
              label="Email"
              value={v.email ?? "—"}
              ink={theme.ink}
              muted={theme.muted}
            />
            <Field
              label="Phone"
              value={v.phone ?? "—"}
              ink={theme.ink}
              muted={theme.muted}
            />
          </div>
        </aside>

        <div
          className="col-span-12 mt-4 grid gap-6 border-t pt-8 lg:grid-cols-3"
          style={{ borderColor: `${theme.ink}1f` }}
        >
          <div className="lg:col-span-2">
            <p
              className="font-mono text-[11px] uppercase tracking-[0.28em]"
              style={{ color: theme.muted }}
            >
              About
            </p>
            <p
              className="mt-3 max-w-2xl text-base leading-relaxed"
              style={{ color: theme.ink, opacity: 0.75 }}
            >
              {v.tagline ??
                "A working business card — built in Cardora, published to a public URL, customizable to taste."}
            </p>
          </div>
          <div>
            <p
              className="font-mono text-[11px] uppercase tracking-[0.28em]"
              style={{ color: theme.muted }}
            >
              Contact
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {v.email ? (
                <a
                  className="underline decoration-1 underline-offset-4"
                  href={`mailto:${v.email}`}
                >
                  {v.email}
                </a>
              ) : null}
              {v.phone ? (
                <a
                  className="underline decoration-1 underline-offset-4"
                  href={`tel:${v.phone}`}
                >
                  {v.phone}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactRows({
  values,
  accent,
  paper,
}: {
  values: Record<string, string>;
  accent: string;
  paper: string;
}) {
  const rows = [
    values.email && {
      label: "@",
      value: values.email,
      href: `mailto:${values.email}`,
    },
    values.phone && {
      label: "↘",
      value: values.phone,
      href: `tel:${values.phone}`,
    },
    values.website && {
      label: "↗",
      value: values.website,
      href: `https://${values.website.replace(/^https?:\/\//, "")}`,
    },
  ].filter(Boolean) as { label: string; value: string; href: string }[];

  return (
    <div className="grid gap-1.5">
      {rows.map((row) => (
        <a
          key={row.value}
          href={row.href}
          className="group flex items-center gap-3 text-[13px] transition-colors"
          style={{ color: paper, opacity: 0.7 }}
        >
          <span
            className="grid h-5 w-5 place-items-center font-mono text-[10px]"
            style={{
              color: accent,
              border: `1px solid ${accent}66`,
              borderRadius: 2,
            }}
          >
            {row.label}
          </span>
          <span className="truncate">{row.value}</span>
        </a>
      ))}
    </div>
  );
}

function Field({
  label,
  value,
  ink,
  muted,
}: {
  label: string;
  value: string;
  ink: string;
  muted: string;
}) {
  return (
    <div
      className="grid grid-cols-[88px_1fr] items-baseline gap-3 border-b pb-2"
      style={{ borderColor: `${ink}14` }}
    >
      <span
        className="font-mono text-[10px] uppercase tracking-[0.22em]"
        style={{ color: muted }}
      >
        {label}
      </span>
      <span style={{ color: ink }}>{value}</span>
    </div>
  );
}
