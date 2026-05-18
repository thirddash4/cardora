"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Check, ContactRound, Share2 } from "lucide-react";
import { CardPreview } from "@/components/card-preview";
import type { Card } from "@/db/schema";
import { fontFamily, normalizeCardTheme } from "@/lib/card-theme";

export function CardView({ card }: { card: Card }) {
  const theme = normalizeCardTheme(card.theme);
  const [flipped, setFlipped] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");
  const [href, setHref] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") setHref(window.location.href);
  }, []);

  async function share() {
    const data = {
      title: `${card.values.name} · ${card.values.company ?? "Carderna"}`,
      text: card.values.tagline ?? "",
      url: href,
    };

    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share(data);
        return;
      } catch {
        // user dismissed — fall through
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(href);
        setShareState("copied");
        setTimeout(() => setShareState("idle"), 1800);
        return;
      } catch {
        // permission denied — fall through
      }
    }

    try {
      const ta = document.createElement("textarea");
      ta.value = href;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      if (ok) {
        setShareState("copied");
        setTimeout(() => setShareState("idle"), 1800);
        return;
      }
    } catch {
      // ignore
    }

    if (typeof window !== "undefined") window.prompt("Copy this URL:", href);
  }

  return (
    <div
      className="relative isolate min-h-svh w-full"
      style={{ background: theme.ink }}
    >
      {/* Action bar — top right */}
      <div className="absolute right-4 top-4 z-30 flex items-center gap-2 sm:right-6 sm:top-6">
        <a
          href={`/c/${card.slug}/vcard`}
          download
          className="inline-flex h-10 items-center gap-2 rounded-full border bg-white/5 px-3 text-xs font-medium uppercase tracking-[0.18em] backdrop-blur transition-colors hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]"
          style={{ color: theme.paper, borderColor: `${theme.paper}33` }}
          aria-label="Save contact"
        >
          <ContactRound className="size-3.5" />
          <span className="hidden sm:inline font-mono">save</span>
        </a>

        <button
          type="button"
          onClick={share}
          className="inline-flex h-10 items-center gap-2 rounded-full border bg-white/5 px-3 text-xs font-medium uppercase tracking-[0.18em] backdrop-blur transition-colors hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]"
          style={{ color: theme.paper, borderColor: `${theme.paper}33` }}
          aria-label={shareState === "copied" ? "Link copied" : "Share card"}
        >
          {shareState === "copied" ? (
            <Check className="size-3.5" style={{ color: theme.accent }} />
          ) : (
            <Share2 className="size-3.5" />
          )}
          <span className="hidden sm:inline font-mono">
            {shareState === "copied" ? "copied" : "share"}
          </span>
        </button>
      </div>

      {/* Centered card stage — sized so a 4:7 portrait card always fits in one screen on mobile */}
      <div
        className="grid h-svh place-items-center px-4 sm:px-6"
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest("button") || target.closest("a")) return;
          setFlipped((v) => !v);
        }}
      >
        <div
          className="relative mx-auto w-[min(78vw,calc((100svh-11rem)*4/7))] lg:w-full lg:max-w-6xl"
          style={{ perspective: "1800px" }}
        >
          <div
            className="relative w-full transition-transform"
            style={{
              transformStyle: "preserve-3d",
              transitionDuration: "700ms",
              transitionTimingFunction: "cubic-bezier(0.2, 0.7, 0.2, 1)",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front face (its aspect ratio sets the card height; back overlays it) */}
            <div
              className="aspect-[4/7] w-full lg:aspect-auto"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <CardPreview card={card} fit />
            </div>

            {/* Back face */}
            <div
              className="absolute inset-0"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <CardBack card={card} href={href} />
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
    </div>
  );
}

function CardBack({ card, href }: { card: Card; href: string }) {
  const theme = normalizeCardTheme(card.theme);
  const v = card.values;
  const qrValue = href || `https://carderna.com/c/${card.slug}`;

  return (
    <section
      className="relative isolate flex h-full w-full flex-col items-center justify-between overflow-hidden rounded-lg border p-6 sm:p-8 lg:min-h-svh lg:rounded-none lg:border-0 lg:p-16"
      style={{
        background: `linear-gradient(180deg, ${theme.surface}cc, ${theme.ink}66)`,
        borderColor: `${theme.paper}14`,
        color: theme.paper,
        fontFamily: fontFamily(theme.fontBody),
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(60% 50% at 50% 50%, ${theme.accent}1c, transparent 60%)`,
        }}
      />

      <div className="flex w-full flex-col items-center gap-4 text-center">
        <Avatar
          name={v.name}
          src={v.avatar}
          accent={theme.accent}
          ink={theme.ink}
          paper={theme.paper}
        />
        <div className="space-y-1">
          <p className="eyebrow" style={{ color: theme.accent }}>
            scan · save · share
          </p>
          <h2
            className="font-display text-3xl italic lowercase leading-[0.95] tracking-tight sm:text-4xl"
            style={{
              fontFamily: fontFamily(theme.fontDisplay),
              color: theme.paper,
            }}
          >
            {v.name}
          </h2>
          <p
            className="font-mono text-[10px] uppercase tracking-[0.22em]"
            style={{ color: theme.paper, opacity: 0.6 }}
          >
            /c/{card.slug}
          </p>
        </div>
      </div>

      <div
        className="grid place-items-center rounded-md p-3 sm:p-4"
        style={{
          background: theme.paper,
          boxShadow: `0 30px 80px -20px ${theme.accent}40`,
        }}
      >
        {qrValue ? (
          <QRCodeSVG
            value={qrValue}
            size={168}
            level="M"
            marginSize={1}
            bgColor={theme.paper}
            fgColor={theme.ink}
          />
        ) : (
          <div className="h-[168px] w-[168px]" />
        )}
      </div>

      <p
        className="font-mono text-[10px] uppercase tracking-[0.22em]"
        style={{ color: theme.paper, opacity: 0.4 }}
      >
        carderna.com
      </p>
    </section>
  );
}

function Avatar({
  name,
  src,
  accent,
  ink,
  paper,
}: {
  name: string;
  src?: string;
  accent: string;
  ink: string;
  paper: string;
}) {
  const [broken, setBroken] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const initials = (name || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
  const showImage = src && !broken;

  return (
    <div
      className="relative grid place-items-center rounded-full p-[3px]"
      style={{
        background: `conic-gradient(from 180deg, ${accent}, ${accent}80 30%, ${accent}40 55%, ${accent} 100%)`,
        boxShadow: `0 0 60px -10px ${accent}80, inset 0 0 0 1px ${ink}`,
      }}
    >
      <div
        className="relative grid h-20 w-20 place-items-center overflow-hidden rounded-full sm:h-24 sm:w-24"
        style={{ background: ink, border: `2px solid ${ink}` }}
      >
        {/* Initials always rendered as base layer; image (if any) floats on top once loaded */}
        <span
          className="absolute inset-0 grid place-items-center font-display text-2xl italic lowercase sm:text-3xl"
          style={{ color: paper, opacity: 0.85 }}
        >
          {initials || "?"}
        </span>
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt=""
            aria-hidden
            className="relative h-full w-full object-cover transition-opacity"
            style={{ opacity: loaded ? 1 : 0 }}
            draggable={false}
            onLoad={() => setLoaded(true)}
            onError={() => setBroken(true)}
          />
        ) : null}
      </div>
    </div>
  );
}
