import Link from "next/link";
import { ArrowRight, ArrowUpRight, LayoutDashboard, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="relative isolate min-h-svh overflow-hidden px-6 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 14% 8%, rgba(214,255,58,0.10), transparent 60%), radial-gradient(50% 40% at 92% 96%, rgba(230,181,138,0.06), transparent 60%)",
        }}
      />

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-3xl italic lowercase tracking-tight">cardora</span>
          <span
            className="h-1.5 w-1.5 translate-y-[-2px] rounded-full"
            style={{ background: "var(--accent-color)", boxShadow: "0 0 10px var(--accent-color)" }}
          />
        </Link>
        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/c/third">
              <ScanLine className="size-4" /> /c/third
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin">
              <LayoutDashboard className="size-4" /> Studio
            </Link>
          </Button>
        </nav>
      </header>

      <section className="mx-auto mt-20 grid w-full max-w-7xl gap-y-14" style={{ gridTemplateColumns: "repeat(12, minmax(0,1fr))" }}>
        <div className="col-span-12 rise">
          <p className="eyebrow eyebrow-accent">digital business cards · 2026</p>
        </div>

        <h1
          className="col-span-12 font-display rise text-[clamp(72px,14vw,220px)] leading-[0.84] tracking-[-0.045em]"
          style={{ animationDelay: "0.05s" }}
        >
          <span className="lowercase italic">a card</span>
          <br />
          <span className="lowercase italic" style={{ color: "var(--accent-color)" }}>
            worth carrying.
          </span>
        </h1>

        <p
          className="col-span-12 md:col-span-7 rise text-lg leading-relaxed text-muted-foreground"
          style={{ animationDelay: "0.12s" }}
        >
          Cardora is a team workspace for building stunning, customizable digital business cards.
          Pick a layout, choose your accent, write your tagline — publish to a public URL anyone can scan.
        </p>

        <div className="col-span-12 md:col-span-5 md:col-start-8 flex flex-wrap items-end gap-3 rise" style={{ animationDelay: "0.18s" }}>
          <Button asChild size="lg">
            <Link href="/admin/cards">
              Open studio <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/c/third">
              See a card <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto mt-28 grid w-full max-w-7xl gap-px overflow-hidden rounded-lg border md:grid-cols-3">
        {[
          ["i", "Live preview", "Edit colors, fonts, and content — the card redraws in real time as you type."],
          ["ii", "Layouts that lead", "Aurora glow or editorial brutalism. Two strong directions, infinitely tunable."],
          ["iii", "Public by URL", "Every card is /c/[slug]. Drop it in an email signature, a QR, a print."],
        ].map(([n, title, desc]) => (
          <article key={n as string} className="bg-[var(--surface)] p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{n}</p>
            <h2 className="font-display mt-4 text-3xl italic lowercase tracking-tight">{title}</h2>
            <p className="mt-3 text-sm text-muted-foreground">{desc}</p>
          </article>
        ))}
      </section>

      <footer className="mx-auto mt-20 flex w-full max-w-7xl items-center justify-between border-t pt-6 text-xs text-muted-foreground">
        <span className="font-mono uppercase tracking-[0.22em]">cardora · 2026</span>
        <span className="font-mono uppercase tracking-[0.22em]">made dark, made yours</span>
      </footer>
    </main>
  );
}
