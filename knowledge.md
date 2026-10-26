# Project knowledge

Read by every Freebuff / oh-my-freebuff agent. Keep it short and true.

## What this project is

`asad-portfolio` — a personal portfolio site with a public marketing surface, an
admin area, a CV route, and an AI "ask" assistant backed by persona/brain data in
Postgres. Content is served from the database, not from hardcoded JSX.

## Stack & conventions

- Next.js **16.3.8** (App Router), React **19.2.8**, TypeScript strict.
- Tailwind CSS v4 (`@tailwindcss/postcss`), motion + GSAP for animation.
- Neon PostgreSQL accessed with `pg` (no ORM); migrations are numbered SQL files.
- `better-auth` for admin auth; `zod` v4 for all input validation at boundaries.
- AI SDK v7 (`ai`, `@ai-sdk/google`) for the assistant.
- Vitest 4 for tests (`vitest.config.mts`; evals use `vitest.eval.config.mts`).

> Next.js 16 is newer than most training data. Before writing framework code,
> read the bundled docs in `node_modules/next/dist/docs/`. Do not assume older
> App Router APIs still behave the same way.

## Commands the agents should use

- Install: `npm ci`
- Typecheck: `npm run typecheck`        (`tsc --noEmit`)
- Lint: `npm run lint`                  (`eslint`)
- Test: `npm test`                      (`vitest run`)
- Build: `npm run build`
- **Full gate: `npm run check`**        (typecheck → lint → test → build)
- Migrate: `npm run db:migrate`         (needs `DATABASE_URL`)
- Auth schema: `npm run auth:schema` · Admin user: `npm run admin:create`
- Run locally: `npm run dev`            (port 3000)
- Evals: `npm run eval` · SEO ping: `npm run seo:indexnow`

## Layout

- `src/app` — routes: `(site)` public pages, `admin`, `ask`, `cv`, `d`, `unlock`,
  `api`, plus `llms.txt`, `indexnow.txt`, `og` image generation.
- `src/components` — `site`, `blocks`, `hero`, `chat`, `document`, `shell`, `admin`.
- `src/server` — server-only code split into `access` (authz), `brain` (retrieval),
  `persona` (content). Never import these into a client component.
- `src/lib` — shared helpers and `persona` types.
- `src/content`, `evals`, `migrations`, `scripts` — content seeds, eval suites,
  numbered SQL migrations, one-off Node scripts.

## Gotchas

- No `.env.local` in fresh checkouts/CI images: copy `.env.example` and fill the
  keys. Never commit real secrets; never print them in logs or tool output.
- `AGENTS.md` contains a block that `next dev` regenerates. Do not delete it.
- Migrations are ordered SQL applied by `scripts/db-migrate.mjs` — add a new
  numbered file, never edit an applied one.
- `src/server/**` is server-only: a client import is a build error, not a warning.
- DB-touching tests need a reachable database; if none is configured, report that
  as an unrun check instead of faking it with mocks.

## Definition of done

`npm run check` passes, new behavior has tests, no secrets in the diff, and the
change is described with its rollback path.

## Multi-agent pack

`omf-team` is the default orchestrator; `omf-ultraqa` drives checks to zero
failures. Specialists: researcher, architect, implementer, reviewer, tester,
security-reviewer, debugger, critic, planner, docs-writer. Role skills live in
`.agents/skills/{researcher,architect,reviewer,tester}/SKILL.md`.
