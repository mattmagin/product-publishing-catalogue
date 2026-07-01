# ADR 0001: Use a pnpm Workspace Monorepo

## Status

Accepted

## Context

The project will contain two deployable applications for a tech test: a Rails API-only backend microservice and a React TypeScript Vite frontend that will later use Module Federation as a pluggable microfrontend.

The repository currently needs only the monorepo structure. App initialization is intentionally deferred.

## Decision

Use a pnpm workspace monorepo with future applications reserved under `apps/*`:

- `apps/api` for the Rails API-only backend
- `apps/web` for the React TypeScript Vite microfrontend

The root package is private and owns workspace-level scripts that delegate to packages with `pnpm -r --if-present`.

## Consequences

- The repository has one root package manager and lockfile.
- Future app initialization can happen independently inside `apps/api` and `apps/web`.
- The root scripts can be run before package-specific scripts exist.
