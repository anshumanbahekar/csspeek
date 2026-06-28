# Contributing to CSSpeek

Thanks for your interest in contributing! This document covers everything you need to get started — from filing an issue to submitting your first pull request.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Submitting Changes](#submitting-changes)
- [Coding Standards](#coding-standards)
- [Good First Issues](#good-first-issues)

---

## Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/). Be kind, be constructive, and assume good intent.

---

## Ways to Contribute

- **Bug reports** — Open an issue with steps to reproduce, expected vs actual behaviour, and your browser/OS
- **Feature requests** — Open a discussion first; this keeps work from duplicating
- **Code** — Bug fixes, new features, performance improvements, refactors
- **Documentation** — Typos, clearer explanations, new examples
- **Design** — UI improvements, accessibility fixes, new themes

---

## Development Setup

### Requirements

- Node.js 18+
- npm 9+ or yarn

### Steps

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/csspeek.git
cd csspeek

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
# → http://localhost:5173

# 4. Type-check
npm run type-check

# 5. Lint
npm run lint
```

---

## Project Structure

```
csspeek/
├── src/
│   ├── components/       # React components
│   │   ├── InputPanel.tsx    # HTML / URL input
│   │   ├── Inspector.tsx     # Element & property explorer
│   │   └── SnippetLibrary.tsx# Saved snippets UI
│   ├── hooks/
│   │   ├── useSnippets.ts    # localStorage persistence
│   │   └── useUrlFetcher.ts  # CORS-proxy URL fetching
│   ├── utils/
│   │   └── cssParser.ts      # HTML parsing, CSS extraction
│   ├── types/
│   │   └── index.ts          # Shared TypeScript types
│   ├── styles/
│   │   └── app.css           # All styles (design tokens + components)
│   ├── App.tsx               # Root component & layout
│   └── main.tsx              # Entry point
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Submitting Changes

1. **Open an issue first** for any non-trivial change to agree on direction
2. Fork the repo and create a branch:
   ```bash
   git checkout -b feat/color-swatches
   # or
   git checkout -b fix/url-fetch-timeout
   ```
3. Make your changes; keep commits small and focused
4. Run lint and type-check before pushing:
   ```bash
   npm run lint && npm run type-check
   ```
5. Push your branch and open a Pull Request against `main`
6. Fill in the PR template — describe what changed and why

### PR checklist

- [ ] TypeScript compiles with no errors (`npm run type-check`)
- [ ] ESLint passes with no warnings (`npm run lint`)
- [ ] New components/hooks have JSDoc comments for public functions
- [ ] README or docs updated if needed

---

## Coding Standards

- **TypeScript** — strict mode is on; no `any` without a comment explaining why
- **Components** — one component per file; keep files under ~200 lines where possible
- **CSS** — use the design tokens in `app.css` (the `--` variables); don't add raw hex values outside the `:root` block
- **Hooks** — custom hooks live in `src/hooks/`; pure utilities in `src/utils/`
- **Naming** — `PascalCase` for components and types; `camelCase` for everything else

---

## Good First Issues

Look for issues tagged [`good first issue`](https://github.com/YOUR_USERNAME/csspeek/labels/good%20first%20issue). Some ideas to get started:

- Add a color swatch preview next to `color` and `background` properties
- Add a "copy all" button that copies the full CSS block to clipboard
- Add keyboard shortcut hints to the UI
- Add a confirmation toast when a snippet is saved
- Write a utility to export all snippets as a `.css` file
- Add a dark/light theme toggle

---

Questions? Open a [discussion](https://github.com/YOUR_USERNAME/csspeek/discussions) — happy to help!
