export type CardLayout = "aurora" | "editorial";

export type CardTheme = {
  ink: string;
  surface: string;
  paper: string;
  accent: string;
  muted: string;
  fontDisplay: "instrument-serif" | "geist" | "jetbrains-mono";
  fontBody: "instrument-serif" | "geist" | "jetbrains-mono";
};

export const defaultCardTheme: CardTheme = {
  ink: "#07070d",
  surface: "#10101a",
  paper: "#f5f3ec",
  accent: "#d6ff3a",
  muted: "#6b6b7a",
  fontDisplay: "instrument-serif",
  fontBody: "geist",
};

export const layoutOptions: { value: CardLayout; label: string; tagline: string }[] = [
  {
    value: "aurora",
    label: "Aurora",
    tagline: "Luminous glow, lowercase serif. Premium, dreamlike.",
  },
  {
    value: "editorial",
    label: "Editorial",
    tagline: "Brutalist magazine grid, oversized italic. Cultural, sharp.",
  },
];

export const fontOptions = [
  { value: "instrument-serif", label: "Instrument Serif", css: "'Instrument Serif', ui-serif, Georgia, serif" },
  { value: "geist", label: "Geist", css: "'Geist', ui-sans-serif, system-ui, sans-serif" },
  { value: "jetbrains-mono", label: "JetBrains Mono", css: "'JetBrains Mono', ui-monospace, monospace" },
] as const;

export function fontFamily(key: CardTheme["fontDisplay"]): string {
  return fontOptions.find((f) => f.value === key)?.css ?? fontOptions[1].css;
}

export function normalizeCardTheme(raw: unknown): CardTheme {
  if (!raw || typeof raw !== "object") return defaultCardTheme;
  const r = raw as Record<string, unknown>;
  const fontKeys = fontOptions.map((f) => f.value);
  const pickFont = (v: unknown, fallback: CardTheme["fontDisplay"]): CardTheme["fontDisplay"] =>
    typeof v === "string" && (fontKeys as string[]).includes(v) ? (v as CardTheme["fontDisplay"]) : fallback;
  return {
    ink: typeof r.ink === "string" ? r.ink : defaultCardTheme.ink,
    surface: typeof r.surface === "string" ? r.surface : defaultCardTheme.surface,
    paper: typeof r.paper === "string" ? r.paper : defaultCardTheme.paper,
    accent: typeof r.accent === "string" ? r.accent : defaultCardTheme.accent,
    muted: typeof r.muted === "string" ? r.muted : defaultCardTheme.muted,
    fontDisplay: pickFont(r.fontDisplay, defaultCardTheme.fontDisplay),
    fontBody: pickFont(r.fontBody, defaultCardTheme.fontBody),
  };
}

export function normalizeLayout(raw: unknown): CardLayout {
  return raw === "editorial" ? "editorial" : "aurora";
}
