# Claude Code Workshop

A hands-on exercise for learning [Claude Code](https://claude.ai/claude-code) — Anthropic's AI coding assistant for the terminal. The repository uses a React/TypeScript 2048 game as the working codebase so participants can practice real workflows in a familiar context.

## What this is

This repo is a **Claude Code playground**, not a 2048 tutorial. The game is just a vehicle for practicing:

- Giving Claude natural-language instructions to build features
- Using custom slash commands (`/new-component`, `/review-pr`, `/debug-issue`)
- Configuring team standards via `CLAUDE.md` so Claude follows your conventions automatically
- Exploring permissions, hooks, and settings in `.claude/`

## Repository structure

```
.
├── CLAUDE.md                  # Team coding standards Claude reads automatically
├── .claude/
│   ├── settings.json          # Permissions and allowed tools
│   └── commands/              # Custom slash commands
│       ├── new-component.md   # /new-component
│       ├── review-pr.md       # /review-pr
│       └── debug-issue.md     # /debug-issue
└── 2048-react-game/           # React + TypeScript + Vite app (the practice codebase)
    └── src/
        ├── components/        # React components
        ├── hooks/             # Custom React hooks
        ├── utils/             # Pure utility functions
        └── types/             # TypeScript type definitions
```

## Getting started

```bash
cd 2048-react-game
npm install
npm run dev        # http://localhost:3000
```

## Key Claude Code concepts demonstrated

| Concept | Where to look |
|---|---|
| Project instructions | `CLAUDE.md` |
| Custom slash commands | `.claude/commands/*.md` |
| Tool permissions | `.claude/settings.json` |
| Generated feature code | `src/components/`, `src/hooks/` |

## Custom slash commands

| Command | What it does |
|---|---|
| `/new-component <description>` | Scaffolds a typed React component with tests and docs |
| `/review-pr` | Reviews staged or branch changes |
| `/debug-issue <description>` | Investigates and fixes a described bug |

## Development commands

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run test       # Run unit tests (Jest)
npm run lint       # ESLint + Prettier
npm run typecheck  # TypeScript check
```
