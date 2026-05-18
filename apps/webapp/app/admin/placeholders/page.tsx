import { createPlaceholder } from "@/app/admin/actions";
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
import { getPlaceholders, getTemplates } from "@/lib/template-store";

export default async function PlaceholdersPage() {
  const [templates, placeholders] = await Promise.all([
    getTemplates(),
    getPlaceholders(),
  ]);
  const firstTemplate = templates[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_390px]">
      <section className="grid gap-4">
        <div>
          <p className="eyebrow eyebrow-accent">05 · placeholders</p>
          <h1 className="font-display mt-2 text-5xl italic lowercase tracking-tight">
            placeholders
          </h1>
          <p className="mt-3 text-muted-foreground">
            Create reusable fields that templates can require before a public
            card is published.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {placeholders.map((placeholder) => (
            <Card key={placeholder.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>{placeholder.label}</CardTitle>
                    <CardDescription>{placeholder.key}</CardDescription>
                  </div>
                  <Badge>{placeholder.type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {placeholder.required ? "Required" : "Optional"} ·{" "}
                  {placeholder.helpText ?? "No help text"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Create placeholder</CardTitle>
          <CardDescription>
            Attach a placeholder to the first available template.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createPlaceholder} className="grid gap-4">
            <input
              type="hidden"
              name="templateId"
              value={firstTemplate?.id ?? "tpl_aurora"}
            />
            <div className="grid gap-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                name="label"
                placeholder="LinkedIn URL"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="key">Key</Label>
              <Input id="key" name="key" placeholder="linkedin_url" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                name="type"
                placeholder="url"
                defaultValue="text"
                required
              />
            </div>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input name="required" type="checkbox" className="size-4" />
              Required
            </label>
            <Button>Create placeholder</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
