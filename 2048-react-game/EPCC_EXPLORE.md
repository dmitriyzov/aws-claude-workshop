# Exploration: 2048 React Game

**Date**: 2026-03-24 | **Scope**: Medium | **Status**: Complete

## 1. Foundation

**Tech stack**: TypeScript 5.9 (strict), React 19, Vite 8, ESLint 9
**Architecture**: React SPA — thin App shell, single Game feature with co-located components/hooks/utils
**Entry point**: `src/main.tsx` → `src/App.tsx` → `src/components/Game.tsx`

**Structure**:
- `src/types/game.ts` — shared type definitions
- `src/utils/gameLogic.ts` — pure functions (board manipulation, move logic)
- `src/hooks/useGame.ts` — game state + keyboard input
- `src/hooks/useLeaderboard.ts` — localStorage persistence
- `src/components/` — Game, Board, Tile, LeaderboardPopup + barrel `index.ts`
- `src/App.css` — all styles (single CSS file, BEM-ish class names)

**CLAUDE.md requirements** (from `/workshop/CLAUDE.md`):
- `npm run test` — run unit tests with Jest (NOTE: see gap below)
- `npm run typecheck` — run TS compiler check after changes
- TypeScript strict mode, Airbnb style, Prettier
- Arrow functions for components and utilities
- MUST include error handling in async functions
- MUST write unit tests for new components and utilities
- Always update docs when adding new features
- Dev server on port 3000, allow `*.cloudfront.net`

## 2. Patterns

**Component pattern**: Named arrow-function exports, props interfaces defined inline (except `LeaderboardPopupProps` which is exported). Example: `src/components/Tile.tsx:5`

**Custom hooks**: Logic extracted from components into dedicated hooks:
- `useGame` (`src/hooks/useGame.ts`) — state + keyboard listener via `useEffect`
- `useLeaderboard` (`src/hooks/useLeaderboard.ts`) — localStorage read/write with try/catch

**Pure utility functions**: All board logic in `src/utils/gameLogic.ts` — no side effects, returns new arrays. Move algorithm uses rotation trick: rotate board, apply `moveLeft`, rotate back.

**Type imports**: `import type { ... }` used consistently for type-only imports.

**Barrel export**: `src/components/index.ts` re-exports all components.

**Testing pattern**: Vitest + `@testing-library/react` — only `LeaderboardPopup.test.tsx` exists. Tests use `vi.fn()`, `beforeEach(vi.clearAllMocks)`, `render/screen/fireEvent`.

**Error handling**: localStorage operations wrapped in try/catch (`useLeaderboard.ts:8-14`, `:16-21`).

## 3. Constraints

**Critical gap — test infrastructure missing**: `package.json` has no `test` script and no `vitest`/`@testing-library/react` in dependencies. The existing test file (`LeaderboardPopup.test.tsx`) cannot run. `npm run test` will fail. Any new test work requires adding vitest + testing-library deps and a test script.

**TypeScript strict flags**:
- `strict: true`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- `verbatimModuleSyntax` — requires `import type` for type-only imports

**No mobile/touch support**: `useGame.ts` only binds `keydown` for arrow keys — no swipe gestures implemented.

**No tile animation**: Tiles re-render in-place; no CSS transitions for sliding movement (only a generic `transition: all 0.15s ease-in-out` on `.tile`).

**Styling**: Single `App.css` file (~440 lines). Tile colors defined per value (2–4096). Responsive breakpoint at 600px.

**Board size**: Hardcoded `BOARD_SIZE = 4` in `gameLogic.ts:3`.

**Win condition**: First tile reaching 2048 triggers `won: true` but game continues (player can keep going).

## 4. Reusability

**Game logic utilities** (`src/utils/gameLogic.ts`) are fully pure and independently testable:
- `createEmptyBoard`, `addRandomTile`, `move`, `canMove`, `hasWon`, `initializeGame`

**LeaderboardPopup** is fully controlled (props-only, no internal data fetching) — easy to test or reuse.

**useLeaderboard** stores top 10 scores sorted descending under key `2048-leaderboard` in localStorage.

## 5. Handoff

**For PLAN/CODE**:
- Adding test infrastructure is a prerequisite for any feature requiring tests
- Required packages: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`
- Required `package.json` additions: `"test": "vitest"` script, `vitest.config.ts` or inline vite config
- Follow existing `LeaderboardPopup.test.tsx` as the test pattern
- All new components need corresponding `.test.tsx` files

**For CODE — commands to use**:
- `npm run build` — typecheck + build
- `npm run typecheck` — TS check only (via `tsc -b`)
- `npm run lint` — ESLint

**Gaps**:
- No `vitest.config.ts` exists — test runner setup needed before tests can run
- No `@testing-library/jest-dom` setup file for matchers like `toBeInTheDocument`
- `useGame` has no dedicated tests
- `gameLogic.ts` has no dedicated tests (good candidate for pure function unit tests)
