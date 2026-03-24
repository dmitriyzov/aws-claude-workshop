# Implementation: Score History Sidebar

**Mode**: default | **Date**: 2026-03-24 | **Status**: Complete

## 1. Changes (6 files, +182 -150 lines, 8 tests)

**Created**:
- `src/components/ScoreHistorySidebar.tsx` — persistent sidebar component (props: `entries`, `onClear`)
- `src/components/ScoreHistorySidebar.test.tsx` — 8 tests covering all acceptance criteria
- `src/test-setup.ts` — vitest + @testing-library/jest-dom setup

**Modified**:
- `vite.config.ts` — added vitest config block (jsdom, globals, setup file); switched to `vitest/config` import to fix TS types
- `package.json` — added `test` and `typecheck` scripts; vitest + testing-library deps installed
- `src/components/Game.tsx` — removed leaderboard popup state/button; added `ScoreHistorySidebar` in two-column `app-layout` wrapper
- `src/components/index.ts` — replaced `LeaderboardPopup` exports with `ScoreHistorySidebar`
- `src/App.css` — replaced leaderboard popup/button CSS with sidebar styles; added `.app-layout` flex layout; updated responsive breakpoint
- `tsconfig.app.json` — added `vitest/globals` to types

**Deleted**:
- `src/components/LeaderboardPopup.tsx`
- `src/components/LeaderboardPopup.test.tsx`

## 2. Quality (Tests 8/8 | Typecheck clean | Lint clean)

**Tests**: 8 unit tests in `ScoreHistorySidebar.test.tsx` — entries list, empty state, clear button, first-entry highlight, no clear button when empty, rank numbers, dates. All pass.

**Typecheck**: `tsc -b` clean — zero errors.

**Lint**: `eslint .` clean — zero warnings.

## 3. Decisions

**`vitest/config` import**: Used `defineConfig` from `vitest/config` instead of `vite` to expose the `test` config key to TypeScript. Adding `/// <reference types="vitest" />` is an alternative but the import approach is cleaner.

**`useLeaderboard` unchanged**: Data model (top 10 sorted by score) reused as-is. Renaming the hook would add churn with no user-facing value.

**`flex-wrap: wrap` on `.app-layout`**: Sidebar wraps naturally below the game board on widths where the two-column layout would be too cramped, before the explicit 600px breakpoint triggers full-width stacking.

## 4. Handoff

**Run**: `/epcc-commit` when ready
**Blockers**: None
**TODOs**: None — all acceptance criteria met
