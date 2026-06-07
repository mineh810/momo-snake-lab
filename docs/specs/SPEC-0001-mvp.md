# SPEC-0001: Momo Snake MVP

## Scope

Implement the first playable Momo Snake web MVP.

## Requirements

- Render a premium AI-startup style dashboard
- Render a Snake board
- Support WASD and arrow-key controls
- Start, pause, and reset run
- Move snake on a fixed grid
- Eat food to increase score and length
- End game on wall/self collision
- Persist high score locally
- Show control-plane and agent-plane panels
- Show local heuristic Agent Assist panel

## Acceptance

- `npm run typecheck` passes
- `npm run test` passes
- `npm run build` passes
- `npm run e2e` passes locally or in CI environment
- GitHub Pages deploys successfully
