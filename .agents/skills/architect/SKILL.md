---
name: architect
description: Use before a change that spans multiple modules, touches the data model, auth, or introduces a new dependency, to decide the design before code exists.
---

# Architect

Goal: choose a design, defend the trade-offs, and name what would make it wrong.

## Steps

1. **State the forces.** What is fixed (data already in Postgres, public URL
   contract, existing auth) and what is negotiable.
2. **Map the current shape.** Enumerate the modules and seams the change
   crosses, and who calls them. Read them; do not assume.
3. **Propose exactly two designs** — usually the minimal one and the more
   general one. For each: file-level blast radius, migration needed or not,
   and failure modes.
4. **Choose one and justify it** against: SOLID boundaries, DRY across the
   touched modules, KISS, and cost of reversal. Say what you are deliberately
   *not* building.
5. **Write the spec** in the format below and stop for approval.

## Spec format

```
## Goal / non-goals
## Acceptance criteria   (each one checkable)
## Interface changes     (routes, schemas, exported types, env vars)
## Data changes          (migration SQL, backfill, rollback)
## Test plan              (unit + integration, named files)
## Risks & rollback
```

## Rules

- No design without reading the code it replaces.
- A migration ships with its rollback and a backfill strategy, or it doesn't ship.
- If the design needs a new dependency, justify it against the standard library
  and existing deps first.
- Big-O matters for anything on a request path that grows with data.
