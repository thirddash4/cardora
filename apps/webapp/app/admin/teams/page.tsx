import { createTeam } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getTeams } from "@/lib/template-store";

export default async function TeamsPage() {
  const teams = await getTeams();

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="grid gap-4">
        <div>
          <p className="eyebrow eyebrow-accent">02 · teams</p>
          <h1 className="font-display mt-2 text-5xl italic lowercase tracking-tight">
            teams
          </h1>
          <p className="mt-3 text-muted-foreground">
            Create a team, then attach card templates and public cards to it.
          </p>
        </div>
        {teams.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>/{item.slug}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Create team</CardTitle>
          <CardDescription>
            When `DATABASE_URL` points at Neon, this form writes to Postgres.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createTeam} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Team name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Carderna Studio"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" placeholder="carderna-studio" />
            </div>
            <Button>Create team</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
