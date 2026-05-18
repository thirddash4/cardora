import Link from "next/link";
import { ArrowUpRight, CreditCard, Layers3, Plus, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCards, getTeams, getTemplates } from "@/lib/template-store";

export default async function AdminDashboard() {
  const [teams, templates, cards] = await Promise.all([getTeams(), getTemplates(), getCards()]);

  return (
    <div className="grid gap-10">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b pb-8">
        <div>
          <p className="eyebrow eyebrow-accent">01 · dashboard</p>
          <h1 className="font-display mt-2 text-[clamp(56px,8vw,112px)] italic lowercase leading-[0.9] tracking-[-0.03em]">
            studio
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Manage team workspaces, card templates, placeholders, and published cards.
            Each card has its own theme and layout — fully customizable, live-preview.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/templates">
              <Plus className="size-4" /> New template
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/cards">
              <CreditCard className="size-4" /> Cards
            </Link>
          </Button>
        </div>
      </div>

      <section className="grid gap-px overflow-hidden rounded-lg border md:grid-cols-3">
        <Metric icon={UsersRound} label="Teams" value={teams.length} index="i" />
        <Metric icon={Layers3} label="Templates" value={templates.length} index="ii" />
        <Metric icon={CreditCard} label="Cards" value={cards.length} index="iii" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="font-display text-3xl italic lowercase">recent cards</CardTitle>
                <CardDescription>Open one to customize live.</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/cards">
                  All <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {cards.slice(0, 4).map((c) => (
                <Link
                  key={c.id}
                  href={`/admin/cards/${c.id}`}
                  className="group flex items-center justify-between rounded-md border bg-[var(--surface-2)] px-4 py-3 transition-colors hover:border-[var(--accent-color)]/60"
                >
                  <div>
                    <p className="font-display text-xl italic lowercase">{c.title}</p>
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      /c/{c.slug} · {c.layout}
                    </p>
                  </div>
                  <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-[var(--accent-color)]" />
                </Link>
              ))}
              {cards.length === 0 ? (
                <p className="text-sm text-muted-foreground">No cards yet — create one from the Cards page.</p>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-2xl italic lowercase">public route</CardTitle>
            <CardDescription>Every card ships at /c/[slug].</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Button asChild variant="outline">
                <Link href="/c/third">
                  /c/third <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/c/lumen">
                  /c/lumen <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  index,
}: {
  icon: typeof UsersRound;
  label: string;
  value: string | number;
  index: string;
}) {
  return (
    <div className="bg-[var(--surface)] p-6">
      <div className="flex items-center justify-between">
        <span className="eyebrow">{label}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{index}</span>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <span className="font-display text-6xl italic leading-none tracking-tight">{value}</span>
        <Icon className="size-5 text-[var(--accent-color)]" />
      </div>
    </div>
  );
}
