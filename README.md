# Carderna

Carderna is a Turbo/npm workspace for a digital business card product.

- `apps/marketing`: Astro-only marketing site.
- `apps/webapp`: Next.js app with Turbopack dev server, Better Auth login, shadcn-style admin UI, Neon/Postgres schema, and public card pages at `/c/[card-slug]`.

## Development

```bash
npm install
npm run dev
```

The webapp runs on Next's default port `3000`; the Astro marketing app is configured for port `4321`.

## Database and Auth

Copy `.env.example` to `.env.local` or configure the same values in your deployment environment.

```bash
npm run db:generate --workspace @carderna/webapp
npm run db:migrate --workspace @carderna/webapp
```

`DATABASE_URL` should be a Neon PostgreSQL connection string. Without it, admin list pages fall back to seeded demo data so the UI can build locally.

## Verification

```bash
npm run typecheck
npm run build
```
