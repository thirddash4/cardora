ALTER TABLE "card" ADD COLUMN "theme" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "card" ADD COLUMN "layout" text DEFAULT 'aurora' NOT NULL;