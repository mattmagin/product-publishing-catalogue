# ADR 0002: Use Rails API With Docker Compose PostgreSQL

## Status

Accepted

## Context

The backend needs to support a job tech test with a conventional API surface, database persistence, migrations, tests, and a development setup that does not depend on host Ruby being installed.

The alternative was a smaller pure Ruby service, but that would require more hand-rolled HTTP, database, validation, testing, and project structure decisions.

## Decision

Initialize `apps/api` as a Rails API-only application using PostgreSQL.

Use Docker Compose for local development. Compose owns both the Rails API container and PostgreSQL database. The API service bind-mounts `apps/api` so Rails development reloads application code without rebuilding the container.

Keep the generated Rails production Dockerfile intact and add a separate `Dockerfile.dev` for the local development runtime.

## Consequences

- Contributors can run the backend without installing Ruby, Bundler, Rails, or PostgreSQL locally.
- Rails conventions provide the default structure for migrations, tests, routing, controllers, and Active Record.
- Gemfile changes require rebuilding the API image.
- PostgreSQL data persists in a named Docker volume.
