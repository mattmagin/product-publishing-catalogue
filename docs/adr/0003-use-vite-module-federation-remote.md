# ADR 0003: Use Vite Module Federation Remote

## Status

Accepted

## Context

The frontend needs to be a pluggable microfrontend for a tech test while still being easy to run as a standalone Vite app during development.

The scaffolded frontend app lives in `apps/frontend` and uses React, TypeScript, and Vite.

## Decision

Configure `apps/frontend` as a Module Federation remote using `@module-federation/vite`.

Expose the React app component as `./App` from the remote named `product_publishing_frontend`. Generate the Module Federation manifest so a future host can consume the remote from `http://localhost:5173/mf-manifest.json` during local development.

## Consequences

- The frontend can run standalone with Vite HMR.
- A future host shell can consume the exposed React component.
- React and React DOM are shared as singleton dependencies.
- No host shell is added yet.
