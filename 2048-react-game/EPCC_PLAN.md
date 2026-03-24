# Plan: Score History Sidebar

**Created**: 2026-03-24 | **Effort**: ~4.5h | **Complexity**: Medium

## 1. Objective

**Goal**: Replace the existing leaderboard popup with a persistent sidebar panel that shows score history alongside the game board.

**Why**: A visible history panel gives players immediate feedback on their progress without navigating to a modal. The popup requires an extra click and hides the board.

**Success**:
- Score history sidebar is always visible to the right of the game board
- Scores are recorded automatically when each game ends (same as current behavior)
- Sidebar stacks below the board on mobile (<768px)
- Existing `LeaderboardPopup` and its trigger button are removed
- All new components have passing tests

---

## 2. Approach

**From EPCC_EXPLORE.md patterns to follow**:
- Named arrow-function exports for components
- Props interface defined inline in component file
- `import type { ... }` for type-only imports
- Error handling (try/catch) on all localStorage access
- New component → new `.test.tsx` file alongside it

**Data model**: Reuse existing `useLeaderboard` hook and `LeaderboardEntry` type unchanged — they already store top-10 scores sorted descending. No data layer changes needed.

**Layout change**: `Game.tsx` gets a two-column flex wrapper. Left column = current game UI. Right column = `ScoreHistorySidebar`. At ≤768px both columns stack vertically (sidebar below board).

**Removals**: `LeaderboardPopup.tsx`, its test file, its barrel export, and the "Leaderboard" button + state in `Game.tsx`.

**Trade-off**: Reuse `useLeaderboard` vs rename to `useScoreHistory`
→ **Reuse** — the hook name is an internal detail; renaming adds churn with no user benefit. Document in the component that it drives the sidebar.

---

## 3. Tasks

### Phase 1: Test Infrastructure (~1h)
1. **Install test deps** (0.25h) — `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom` | Deps: None | Risk: L
2. **Configure vitest** (0.5h) — Add `test` script to `package.json`, create `src/test-setup.ts` (jest-dom matchers), add `test` config block to `vite.config.ts` pointing at setup file | Deps: Task 1 | Risk: M (first-time vitest config with jsdom)
3. **Verify existing test passes** (0.25h) — Run `npm run test` and confirm `LeaderboardPopup.test.tsx` passes | Deps: Task 2 | Risk: L

### Phase 2: ScoreHistorySidebar Component (~1.5h)
4. **Create `ScoreHistorySidebar.tsx`** (0.75h) — Displays ranked list of `LeaderboardEntry[]`; props: `{ entries, onClear }`. Shows empty state when no scores. Highlights rank-1 entry. | Deps: Task 3 | Risk: L
5. **Write `ScoreHistorySidebar.test.tsx`** (0.75h) — Cover: renders entries, empty state, clear button calls onClear, first entry highlighted, no clear button when empty | Deps: Task 4 | Risk: L

### Phase 3: Layout & Integration (~1.5h)
6. **Update `Game.tsx`** (0.75h) — Remove `leaderboardOpen` state, `LeaderboardPopup` import, "Leaderboard" button. Add `ScoreHistorySidebar` in a two-column wrapper div. | Deps: Task 4 | Risk: L
7. **Update `App.css`** (0.5h) — Add `.app-layout` (flex row, gap), `.sidebar` styles (width ~260px, scrollable). Add `@media (max-width: 768px)` to stack sidebar below board. Remove old leaderboard popup/backdrop/button CSS. | Deps: Task 6 | Risk: L
8. **Update barrel export** (0.25h) — Remove `LeaderboardPopup` exports from `components/index.ts`, add `ScoreHistorySidebar` | Deps: Task 6 | Risk: L

### Phase 4: Cleanup & Validation (~0.5h)
9. **Delete `LeaderboardPopup.tsx` and `LeaderboardPopup.test.tsx`** (0.1h) — After confirming no remaining imports | Deps: Task 8 | Risk: L
10. **Typecheck + lint** (0.25h) — `npm run typecheck && npm run lint` | Deps: All | Risk: L
11. **Run full test suite** (0.15h) — `npm run test` — all tests pass | Deps: All | Risk: L

**Total**: ~4.5h

---

## 4. Quality Strategy

**Tests** (using Vitest + @testing-library/react, following `LeaderboardPopup.test.tsx` as the pattern):
- `ScoreHistorySidebar.test.tsx` — 6-8 cases covering: renders entries list, renders empty state, onClear called on button click, no clear button when empty, first entry has highlight class, score formatted with `toLocaleString()`
- Existing `LeaderboardPopup.test.tsx` is deleted along with the component

**Validation** (acceptance criteria):
- Sidebar visible alongside board without any button click
- Score automatically saved at game over (unchanged behavior via `useLeaderboard`)
- Sidebar scrolls if >10 entries (CSS `overflow-y: auto`)
- Stacks below board on mobile (≤768px)
- `npm run typecheck` passes with no errors
- `npm run test` passes with no failures

---

## 5. Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Vitest config requires non-trivial setup (jsdom, setup file path) | M | Follow official vitest + @testing-library/react docs; check existing test imports for hints |
| Layout breaks on narrow desktop widths (500-768px range) | M | Test at 600px; use `flex-wrap: wrap` so sidebar wraps gracefully before the 768px breakpoint |
| `noUnusedLocals` TS flag fails if leaderboard state not cleaned up in Game.tsx | L | Remove `leaderboardOpen` state and all related imports before running typecheck |

**Assumptions**:
- Score history keeps top-10 sorted-by-score semantics (existing `useLeaderboard` unchanged)
- No rename of `useLeaderboard` — internal detail
- `LeaderboardEntry` type in `types/game.ts` is sufficient as-is (id, score, date)

**Out of scope**:
- Touch/swipe input for the game
- Tile slide animations
- Persistent score history beyond top 10 (unlimited history log)
- Player names or other metadata on entries
