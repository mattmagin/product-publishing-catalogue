# Universal Store Product Publishing Catalogue

## Docs

- [The Brief](docs/THE_BRIEF.md)
- [Scoping Document](docs/SCOPING_DOCUMENT.md)
- [Technical Design Document](docs/TECHNICAL_DESIGN_DOCUMENT.md)

## Prerequisites

Install these before running the app:
- [Docker](https://docs.docker.com/engine/install/) with Docker Compose, with Docker running
- [pnpm](https://pnpm.io)
- [Taskfile](https://taskfile.dev/), so the `task` command is available (optional)

## Run Locally
For a fresh clone, run this once first:
```sh
task setup
```

Then start the app:
```sh
task dev
```

This starts the Rails API, background jobs, PostgreSQL, and the Vite frontend.

Ruby, Rails, and PostgreSQL do not need to be installed locally because Docker runs the backend services.

## Without Taskfile

If you do not have Taskfile installed, run the equivalent commands directly:

```sh
pnpm install
docker compose run --rm api bin/rails db:prepare
docker compose up -d
pnpm frontend:dev
```

## Local URLs

- Frontend (Published Catalogue): `http://localhost:5173`
- Admin Dashboard: `http://localhost:5173/admin` 
   - (hint: click space to swap between the dashboard and published catalogue)
- API: `http://localhost:3000`
- API health check: `http://localhost:3000/up`

## Useful Commands

```sh
task api:test
task frontend:build
task api:logs
task api:stop
```
