import Link from "next/link";
import { ArrowUpRight, Plus, Sparkles } from "lucide-react";
import { createCard } from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCards, getTemplates } from "@/lib/template-store";

export default async function CardsPage() {
  const [cards, templates] = await Promise.all([getCards(), getTemplates()]);
  const firstTemplate = templates[0];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <section className="grid gap-4">
        <div>
          <p className="eyebrow eyebrow-accent">04 · cards</p>
          <h1 className="font-display mt-2 text-5xl italic lowercase tracking-tight">cards</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Every card has its own theme, layout, and public URL. Open one to customize colors, fonts, and content with a
            live preview.
          </p>
        </div>

        <div className="grid gap-3">
          {cards.map((c) => (
            <Card key={c.id} className="group transition-colors hover:border-[var(--accent-color)]/50">
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="size-4 text-[var(--accent-color)]" />
                      {c.title}
                    </CardTitle>
                    <CardDescription>/c/{c.slug}</CardDescription>
                  </div>
                  <Badge>{c.layout}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm">
                    <Link href={`/admin/cards/${c.id}`}>
                      Customize <ArrowUpRight className="size-3.5" />
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/c/${c.slug}`}>View public</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Create card</CardTitle>
          <CardDescription>Spin up a new card from the active template, then customize.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createCard} className="grid gap-4">
            <input type="hidden" name="templateId" value={firstTemplate?.id ?? "tpl_aurora"} />
            <input type="hidden" name="teamId" value="team_cardora" />
            <div className="grid gap-2">
              <Label htmlFor="title">Card title</Label>
              <Input id="title" name="title" placeholder="Mia Stratton" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" placeholder="mia" />
            </div>
            <Button>
              <Plus className="size-4" /> Create card
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
