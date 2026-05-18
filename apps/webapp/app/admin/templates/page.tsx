import { createTemplate } from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { getTemplates } from "@/lib/template-store";

export default async function TemplatesPage() {
  const templates = await getTemplates();

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_390px]">
      <section className="grid gap-4">
        <div>
          <p className="eyebrow eyebrow-accent">03 · templates</p>
          <h1 className="font-display mt-2 text-5xl italic lowercase tracking-tight">
            templates
          </h1>
          <p className="mt-3 text-muted-foreground">
            Manage reusable card templates and their placeholder schema before
            publishing public cards.
          </p>
        </div>

        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </div>
                <Badge>{template.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {template.schema.map((field) => (
                  <div
                    key={field.key}
                    className="rounded-md border bg-muted/40 p-3"
                  >
                    <p className="text-sm font-medium">{field.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {field.key} · {field.type}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Create template</CardTitle>
          <CardDescription>
            New templates start with a safe placeholder schema for names, roles,
            companies, and email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createTemplate} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Template name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Founder Noir"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" placeholder="founder-noir" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Premium card for executive teams."
                required
              />
            </div>
            <input type="hidden" name="status" value="draft" />
            <Button>Create template</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
