# Universal Store Product Publishing Catalogue

This repository is a pnpm workspace monorepo for a tech test.

## Workspace Layout

```text
apps/
  api/  # Future Rails API-only backend microservice
  frontend/  # React TypeScript Vite Module Federation remote
```

The backend is a Rails API-only app. The frontend is a Vite React app exposed as a Module Federation remote.

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

## Backend API

The backend API lives in `apps/api`. It is a Rails API-only app backed by PostgreSQL.

Docker Compose owns the development runtime, so Ruby, Rails, and PostgreSQL do not need to be installed on the host.

```sh
pnpm api:build
pnpm api:setup
pnpm api:dev
```

The API is available at `http://localhost:3000`. Rails exposes its default health check at `http://localhost:3000/up`.

Useful commands:

```sh
pnpm api:test
pnpm api:console
pnpm api:shell
```

The API container bind-mounts `apps/api`, so Rails development code changes are picked up without rebuilding the image. Rebuild the image after changing the Gemfile.

## Frontend Microfrontend

The frontend microfrontend lives in `apps/frontend`. It can run standalone during development and exposes a Module Federation remote for a future host shell.

```sh
pnpm frontend:dev
pnpm frontend:build
pnpm frontend:preview
pnpm frontend:lint
```

Standalone development URL:

```text
http://localhost:5173
```

Module Federation contract:

```text
Remote name: product_publishing_frontend
Exposed modules: ./App, ./App2
Manifest URL: http://localhost:5173/mf-manifest.json
Remote entry URL: http://localhost:5173/remoteEntry.js
```
