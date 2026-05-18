"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Check, Maximize2, RotateCw, Share2, X } from "lucide-react";
import { CardPreview } from "@/components/card-preview";
import type { Card } from "@/db/schema";
import { fontFamily, normalizeCardTheme } from "@/lib/card-theme";

export function CardView({ card }: { card: Card }) {
  const theme = normalizeCardTheme(card.theme);
  const [flipped, setFlipped] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");
  const [href, setHref] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") setHref(window.location.href);
  }, []);

  useEffect(() => {
    // Exit fullscreen with Escape
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen]);

  async function share() {
    const data = {
      title: `${card.values.name} · ${card.values.company ?? "Cardora"}`,
      text: card.values.tagline ?? "",
      url: href,
    };

    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share(data);
        return;
      } catch {
        // user dismissed — fall through to clipboard
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(href);
      setShareState("copied");
      setTimeout(() => setShareState("idle"), 1800);
    }
  }

  return (
    <div
      data-fullscreen={fullscreen || undefined}
      className="relative isolate min-h-svh w-full data-[fullscreen]:fixed data-[fullscreen]:inset-0 data-[fullscreen]:z-50 data-[fullscreen]:overflow-hidden data-[fullscreen]:bg-black"
      style={{ background: theme.ink }}
    >
      {/* Action bar — top right */}
      <div
        className={`absolute right-4 top-4 z-30 flex items-center gap-2 sm:right-6 sm:top-6 ${
          fullscreen ? "z-[60]" : ""
        }`}
      >
        <button
          type="button"
          onClick={() => setFlipped((v) => !v)}
          className="group inline-flex h-10 items-center gap-2 rounded-full border bg-white/5 px-3 text-xs font-medium uppercase tracking-[0.18em] backdrop-blur transition-colors hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]"
          style={{ color: theme.paper, borderColor: `${theme.paper}33` }}
          aria-label="Flip card"
        >
          <RotateCw className="size-3.5" />
          <span className="hidden sm:inline font-mono">{flipped ? "front" : "qr"}</span>
        </button>

        <button
          type="button"
          onClick={share}
          className="group inline-flex h-10 items-center gap-2 rounded-full border bg-white/5 px-3 text-xs font-medium uppercase tracking-[0.18em] backdrop-blur transition-colors hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]"
          style={{ color: theme.paper, borderColor: `${theme.paper}33` }}
          aria-label="Share card"
        >
          {shareState === "copied" ? <Check className="size-3.5 text-[var(--accent-color)]" /> : <Share2 className="size-3.5" />}
          <span className="hidden sm:inline font-mono">{shareState === "copied" ? "copied" : "share"}</span>
        </button>

        <button
          type="button"
          onClick={() => setFullscreen((v) => !v)}
          className="group inline-flex h-10 items-center justify-center gap-2 rounded-full border bg-white/5 px-3 text-xs font-medium uppercase tracking-[0.18em] backdrop-blur transition-colors hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]"
          style={{ color: theme.paper, borderColor: `${theme.paper}33` }}
          aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {fullscreen ? <X className="size-3.5" /> : <Maximize2 className="size-3.5" />}
          <span className="hidden sm:inline font-mono">{fullscreen ? "exit" : "rotate"}</span>
        </button>
      </div>

      {/* Card flip stage */}
      <div
        className={`grid place-items-center ${
          fullscreen ? "h-svh w-svw" : "min-h-svh"
        }`}
        onClick={(e) => {
          // Only flip when clicking the empty stage / card, not the action bar
          const target = e.target as HTMLElement;
          if (target.closest("button") || target.closest("a")) return;
          setFlipped((v) => !v);
        }}
      >
        <div
          className={`flip-stage relative w-full ${
            fullscreen ? "fullscreen-rotate" : ""
          }`}
          style={{
            perspective: "1800px",
          }}
        >
          <div
            className="flip-inner relative w-full transition-transform"
            style={{
              transformStyle: "preserve-3d",
              transitionDuration: "700ms",
              transitionTimingFunction: "cubic-bezier(0.2, 0.7, 0.2, 1)",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front face */}
            <div
              className="flip-face"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <CardPreview card={card} fit={fullscreen} />
            </div>

            {/* Back face */}
            <div
              className="flip-face absolute inset-0"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <CardBack card={card} href={href} fit={fullscreen} />
            </div>
          </div>
        </div>
      </div>

      <p
        className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.28em] opacity-50"
        style={{ color: theme.paper }}
      >
        tap to {flipped ? "flip back" : "see qr"}
      </p>

      <style jsx>{`
        @media (max-width: 768px) {
          .fullscreen-rotate .flip-inner {
            transform-origin: center center;
            /* Rotate the card 90deg to landscape orientation when phone is portrait */
          }
          .fullscreen-rotate {
            transform: rotate(90deg);
            width: 100svh;
            height: 100svw;
            max-width: 100svh;
          }
        }
        .fullscreen-rotate {
          padding: 0;
        }
      `}</style>
    </div>
  );
}

function CardBack({ card, href, fit }: { card: Card; href: string; fit: boolean }) {
  const theme = normalizeCardTheme(card.theme);
  const v = card.values;
  const heightClass = fit ? "h-full" : "min-h-svh";

  // Encode either the URL or a quick vCard string. URL is more universal.
  const qrValue = href || `https://cardora.app/c/${card.slug}`;

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
          background: `radial-gradient(60% 50% at 50% 50%, ${theme.accent}1c, transparent 60%), linear-gradient(180deg, ${theme.ink}, ${theme.surface})`,
        }}
      />

      <div className="grid w-full max-w-2xl place-items-center gap-10 text-center">
        <div className="space-y-2">
          <p className="eyebrow" style={{ color: theme.accent }}>
            scan · save · share
          </p>
          <h2
            className="font-display text-4xl italic lowercase tracking-tight sm:text-5xl"
            style={{ fontFamily: fontFamily(theme.fontDisplay), color: theme.paper }}
          >
            {v.name}
          </h2>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: theme.paper, opacity: 0.6 }}>
            /c/{card.slug}
          </p>
        </div>

        <div
          className="grid place-items-center rounded-md p-5"
          style={{
            background: theme.paper,
            boxShadow: `0 30px 80px -20px ${theme.accent}40`,
          }}
        >
          {qrValue ? (
            <QRCodeSVG
              value={qrValue}
              size={224}
              level="M"
              marginSize={1}
              bgColor={theme.paper}
              fgColor={theme.ink}
            />
          ) : (
            <div className="h-[224px] w-[224px]" />
          )}
        </div>

        <div className="grid w-full max-w-md gap-1 text-sm" style={{ color: theme.paper }}>
          {v.email ? (
            <a className="truncate underline decoration-1 underline-offset-4 hover:opacity-100" style={{ opacity: 0.8 }} href={`mailto:${v.email}`}>
              {v.email}
            </a>
          ) : null}
          {v.phone ? (
            <a className="truncate underline decoration-1 underline-offset-4" style={{ opacity: 0.8 }} href={`tel:${v.phone.replace(/[^+\d]/g, "")}`}>
              {v.phone}
            </a>
          ) : null}
          {v.website ? (
            <a
              className="truncate underline decoration-1 underline-offset-4"
              style={{ opacity: 0.8 }}
              href={`https://${v.website.replace(/^https?:\/\//, "")}`}
            >
              {v.website}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
