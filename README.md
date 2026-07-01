# Universal Store Product Publishing Catalogue

This repository is a pnpm workspace monorepo for a tech test.

## Workspace Layout

```text
apps/
  api/  # Future Rails API-only backend microservice
  web/  # Future React TypeScript Vite microfrontend
```

The app directories are placeholders for now. Rails, Vite, React, TypeScript, and Module Federation will be initialized later.

## Commands

```sh
pnpm install
pnpm dev
pnpm build
pnpm test
pnpm lint
pnpm typecheck
```

The root scripts use `--if-present`, so they are safe to run before the app packages define their own scripts.
