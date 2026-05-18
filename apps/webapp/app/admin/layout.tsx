import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  Braces,
  CreditCard,
  LayoutDashboard,
  Layers3,
  UsersRound,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const navItems = [
  {
    href: "/admin" as const,
    icon: LayoutDashboard,
    label: "Dashboard",
    index: "01",
  },
  {
    href: "/admin/teams" as const,
    icon: UsersRound,
    label: "Teams",
    index: "02",
  },
  {
    href: "/admin/templates" as const,
    icon: Layers3,
    label: "Templates",
    index: "03",
  },
  {
    href: "/admin/cards" as const,
    icon: CreditCard,
    label: "Cards",
    index: "04",
  },
  {
    href: "/admin/placeholders" as const,
    icon: Braces,
    label: "Placeholders",
    index: "05",
  },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api
    .getSession({
      headers: await headers(),
    })
    .catch(() => null);

  if (!session) redirect("/sign-in");

  return (
    <main className="relative min-h-svh">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-[var(--surface)]/70 p-6 backdrop-blur-xl md:flex md:flex-col">
        <Link href="/admin" className="flex items-baseline gap-2">
          <span className="font-display text-3xl italic lowercase tracking-tight">
            cardora
          </span>
          <span
            className="h-1.5 w-1.5 translate-y-[-2px] rounded-full"
            style={{
              background: "var(--accent-color)",
              boxShadow: "0 0 10px var(--accent-color)",
            }}
          />
        </Link>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          studio · v0.1
        </p>

        <nav className="mt-10 grid gap-0.5">
          {navItems.map(({ href, icon: Icon, label, index }) => (
            <Button
              key={href}
              asChild
              variant="ghost"
              className="h-10 justify-start px-2 text-sm font-normal"
            >
              <Link
                href={href}
                className="group flex w-full items-center gap-3"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground group-hover:text-[var(--accent-color)]">
                  {index}
                </span>
                <Icon className="size-4 text-muted-foreground group-hover:text-foreground" />
                <span>{label}</span>
              </Link>
            </Button>
          ))}
        </nav>

        <div className="mt-auto pt-6">
          <div className="rounded-md border bg-[var(--surface-2)] p-3">
            <p className="eyebrow eyebrow-accent">tip</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Open <span className="font-mono text-foreground">Cards</span> to
              live-customize a card's theme and layout.
            </p>
          </div>
        </div>
      </aside>

      <section className="md:pl-64">
        <div className="border-b bg-[var(--surface)]/80 px-5 py-4 backdrop-blur md:hidden">
          <Link
            href="/admin"
            className="font-display text-2xl italic lowercase"
          >
            cardora
          </Link>
        </div>
        <div className="mx-auto w-full max-w-6xl px-6 py-10">{children}</div>
      </section>
    </main>
  );
}
