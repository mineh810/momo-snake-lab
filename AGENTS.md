# AGENTS.md

## Role

You are an implementation agent for Momo Snake Lab. The human owner is the product lead, architect, and final taste judge.

## Plane separation

### Control plane

The control plane defines intent, constraints, review gates, and delivery contracts. It lives in:

- `docs/product/PRD.md`
- `docs/product/TASTE.md`
- `docs/specs/`
- `docs/control/`
- `.github/ISSUE_TEMPLATE/`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/workflows/`

Do not weaken control-plane gates without explicit human approval.

### Agent plane

The agent plane implements scoped tasks from specs and issues. It lives mainly in:

- `app/`
- `components/`
- `game/`
- `lib/`
- `tests/`

Keep implementation changes small, testable, and easy to review.

## Product taste

Momo Snake should feel like a premium AI startup demo, not a retro arcade clone.

Keywords: dark, minimal, technical, calm, premium, agent dashboard, Linear/Vercel/Cursor style.

## Commands

Use npm for this MVP.

- Install: `npm install`
- Dev: `npm run dev`
- Typecheck: `npm run typecheck`
- Unit tests: `npm run test`
- E2E tests: `npm run e2e`
- Build: `npm run build`

## PR rules

Every PR must include:

1. Summary
2. Linked issue/spec
3. Control-plane impact
4. Agent-plane changes
5. Tests run
6. Screenshot or preview note for UI changes
7. Risks and follow-ups

## Architecture rules

- Keep game rules in `game/` as pure TypeScript.
- Keep browser persistence in `lib/storage.ts`.
- Keep React rendering in `components/` and `app/`.
- Do not add backend services, API keys, auth, payment, or databases for MVP v1.
