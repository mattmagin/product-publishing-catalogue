## 1. Overview

### Problem
- The current product catalogue only supports products being either visible or not visible. There is no way to schedule a product to go live at a future date and time.
- This creates operational overhead because staff must manually publish products at the exact time they should go live, including outside normal working hours.
- There is no audit trail recording what publication-related changes were made, when they happened, or what triggered them. This makes incident investigation harder when product visibility is wrong.

### Proposed Solution
- Extend the product publishing system so staff can schedule products to be published at a future time.
- Store products, scheduled publish times, and publication events in PostgreSQL behind a Rails API.
- Expose a React-based admin UI for managing product publication.
- Expose a simple catalogue view that demonstrates which products are currently visible to customers.
- Process scheduled publishes using a recurring Rails background job that checks for due schedules and applies the same publication transition rules used by manual actions.
- Record publication-related changes in an append-only audit trail.

### Key Design Goals
- Make publication state easy for operators to see, understand, and manage.
- Support scheduled publishing without requiring manual action at the required publish time.
- Keep publication rules centralised so manual and scheduled transitions behave consistently.
- Provide a clear, append-only audit trail for publication-related changes.
- Keep the implementation focused on the publishing workflow rather than broader ecommerce catalogue management.

### Assumptions and Constraints
- The audit trail records publication-related changes only. It is not intended to be a full product versioning system.
- PostgreSQL is used even though persistence was optional in the brief, because it makes scheduled state and audit history durable across restarts and better reflects a real catalogue system.
- Authentication and user management are out of scope. The audit model still includes `triggered_by` and nullable `user_id` fields so attribution can be added without reshaping the event table.
- The UI only needs to be functional enough to demonstrate the workflow.
- Deployment and production infrastructure are out of scope; the system only needs to run locally.
- The product model is intentionally small and includes only the fields needed to demonstrate publishing. `sku` is included as a stable product identifier and `image_url` is included for the demo, while richer catalogue concerns such as variants, inventory, sizes, and media management are out of scope.
- Only one active scheduled publish is supported per product.

## 2. System Architecture

### Technology Stack

| Technology      | Purpose                      | Why chosen |
| --------------- | ---------------------------- | ---------- |
| `Ruby on Rails` | Backend API and domain logic | Fits CRUD-style APIs, background jobs, validations, and transactional domain operations well |
| `PostgreSQL`    | Persistent data storage      | Durable relational storage for products, timestamps, and append-only audit events |
| `React`         | Frontend UI                  | Good fit for admin workflows and the customer catalogue demo |
| `TypeScript`    | Frontend type safety         | Improves confidence in API and UI contracts |
| `Vite`          | Frontend tooling             | Fast local development with minimal setup |
| `Chakra UI`     | UI components and layout     | Speeds up building a usable, accessible admin UI |
| `Zustand`       | Client-side state management | Lightweight enough for a small app without introducing unnecessary framework complexity |
| `Ky`            | HTTP client                  | Small wrapper around `fetch` with clean error handling |

## 3. API Models

### Product
The catalogue is centred around a `Product` model. Products store the core catalogue facts and the timestamp that makes a product customer-visible. Scheduled publish intent is stored separately in `ProductSchedule`.

| Field                  | Type     | Notes                                      |
| ---------------------- | -------- | ------------------------------------------ |
| `id`                   | integer  | Primary key                                |
| `sku`                  | string   | Required unique product identifier         |
| `title`                | string   | Product title                              |
| `price`                | decimal  | AUD price                                  |
| `image_url`            | string   | Simple product image URL for demo purposes |
| `published_at`         | datetime | Set when the product becomes visible       |
| `created_at`           | datetime | Rails-managed timestamp                    |
| `updated_at`           | datetime | Rails-managed timestamp                    |

#### Product Validations and Scopes
- `sku`, `title`, `price`, and `image_url` are required.
- `sku` is unique.
- `price` must be non-negative.
- `Product.draft`, `Product.scheduled`, and `Product.published` scopes expose the same operator-facing states used by the UI.
- `scheduled_publish_at` is exposed as a computed value from the pending publish schedule. It is not stored on the `products` table.

#### Derived Publication States
- The product does not persist a separate `status` enum column.
- Publication state is derived from `published_at` and any pending publish schedule.

Why:
- `published_at` and pending `ProductSchedule` rows are the source facts needed to answer the main questions: is the product visible now, and is there a future publish planned?
- A stored `status` would duplicate those facts and create another value that could drift out of sync.
- Deriving state prevents invalid combinations such as `status = published` with `published_at = nil`.
- The state rules are small enough that deriving them is clearer than maintaining an extra lifecycle column.

Trade-offs:
- Queries and serializers need to apply derivation logic rather than filtering directly by a stored enum.
- If the lifecycle grows to include approval workflows, embargoes, campaign states, or multiple scheduled actions, a dedicated state machine or explicit status column may become justified.
- For this scope, consistency on writes is more important than the convenience of direct status queries.

| Derived State | Customer Visible | Rule |
| ------------- | ---------------- | ---- |
| `draft`       | No               | `published_at` is `nil` and no pending publish schedule exists |
| `scheduled`   | No               | `published_at` is `nil` and a pending publish schedule exists |
| `published`   | Yes              | `published_at` is present |

##### Status Transitions

Although publication state is derived from timestamps rather than stored in a `status` column, the system still enforces valid operator-facing transitions.

| From        | To          | Trigger                    | Field Changes                                                   | Notes                                 |
| ----------- | ----------- | -------------------------- | --------------------------------------------------------------- | ------------------------------------- |
| `draft`     | `published` | Manual publish             | Set `published_at = Time.current`; cancel any pending publish schedule | Product becomes immediately visible   |
| `draft`     | `scheduled` | Schedule future publish    | Create a pending `ProductSchedule` with `action = publish` and future `scheduled_at` | Product remains hidden until due      |
| `scheduled` | `published` | Scheduler executes publish | Set `published_at = Time.current`; mark the schedule `executed` | Automatic transition when due         |
| `scheduled` | `draft`     | Cancel scheduled publish   | Mark the pending schedule `cancelled`                           | Product remains unpublished           |
| `published` | `draft`     | Manual unpublish           | Clear `published_at`                                            | Product is removed from customer view |
| `published` | `scheduled` | Schedule future publish    | Not supported                                                   | Published products are already live   |

#### Model Implementation Note
- The initial design stored `scheduled_publish_at` directly on `products`.
- The implementation moved scheduled intent into a separate `ProductSchedule` model.
- This keeps product visibility facts separate from scheduling workflow facts, gives each schedule its own lifecycle, and preserves cancelled or executed schedule records for troubleshooting.
- The API can still expose `scheduled_publish_at` as a computed convenience field so the UI does not need to understand the schedule table.

### ProductSchedule
`ProductSchedule` represents a scheduled publication action for a product. In this version it only supports scheduled publishing, but the model shape leaves room for scheduled unpublishing later.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | integer | Primary key |
| `product_id` | integer | Foreign key to `products` |
| `action` | enum/text | Currently only `publish` |
| `status` | enum/text | `pending`, `executed`, or `cancelled` |
| `scheduled_at` | datetime | When the action should be applied |
| `executed_at` | datetime | Set when the schedule is successfully executed |
| `created_by_id` | integer | Operator attribution for who created the schedule |
| `created_at` | datetime | Rails-managed timestamp |
| `updated_at` | datetime | Rails-managed timestamp |

#### Schedule Rules
- `action` must be one of the supported actions. This version only supports `publish`.
- `status` must be `pending`, `executed`, or `cancelled`.
- `scheduled_at` is required and must be in the future when the schedule is created.
- A product can only have one pending schedule for the same action.
- A product must not already be published when a publish schedule is created.
- Past `scheduled_at` values are allowed after creation so an executed schedule can retain its original due time.

#### Relationships

| Relationship | Description |
| --- | --- |
| `Product has_many :product_schedules` | A product can have multiple historical schedule records |
| `ProductSchedule belongs_to :product` | Each schedule belongs to a product |

#### Notes
- Pending schedules drive the derived `scheduled` product state.
- Executed and cancelled schedules are retained instead of deleted. This gives operators a clearer trail of what was planned, what ran, and what was cancelled.
- A partial unique index prevents duplicate pending schedules for the same product and action at the database level.

### ProductPublicationEvent
`ProductPublicationEvent` stores an append-only history of publication-related changes to a product. Every time a product's publication state changes, including scheduling, a row is added to this table.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | integer | Primary key |
| `product_id` | integer | Foreign key to `products` |
| `event_type` | enum/text | Type of publication event |
| `from_state` | text | Derived state before the change, captured at event time |
| `to_state` | text | Derived state after the change, captured at event time |
| `triggered_by` | enum/text | Source of the event: `user` or `system` |
| `user_id` | integer | Nullable operator attribution for user-triggered events |
| `occurred_at` | datetime | When the event occurred |
| `created_at` | datetime | Rails-managed timestamp for when the event was created |
| `updated_at` | datetime | Rails-managed timestamp; retained by Rails but not used for business meaning |

#### Event Types

| Event Type           | Description                                  |
| -------------------- | -------------------------------------------- |
| `publish_scheduled`  | A future publish time was set                |
| `schedule_cancelled` | A scheduled publish was cancelled            |
| `published`          | Product became visible                       |
| `unpublished`        | Product was manually removed from visibility |

#### Relationships

| Relationship                           | Description                              |
| -------------------------------------- | ---------------------------------------- |
| `Product has_many :publication_events` | Each product can have many event records |
| `PublicationEvent belongs_to :product` | Each event relates to a single product   |

#### Notes
- `ProductPublicationEvent` is intended to be append-only and is not updated as part of the normal workflow. The MVP documents this rule in the model but does not enforce it with database triggers.
- The model is purpose-built for publication audit history rather than generic product versioning.
- A generic auditing/versioning tool would capture more data, but it would also add noise and make the operator-facing history harder to read.
- `from_state` and `to_state` store the derived operator-facing state as it was interpreted when the event was recorded.
- Keeping `from_state` and `to_state` means:
  - the audit event describes what changed at the time it changed;
  - the historical event preserves its original interpretation if derivation rules change later;
  - history reads are simpler because they do not need to reconstruct past state from current product data.
- `triggered_by` captures whether the change came from a user action or the scheduler.
- User-triggered events require `user_id`; system-triggered events do not.
- `occurred_at` defaults to the current time when not provided.
- The initial design included a flexible `metadata` JSON field, but the implementation removed it from the MVP. The current event fields are enough to explain publication transitions, and avoiding metadata keeps the audit shape easier to validate and present in the UI.

## 4. API Contract

### Endpoint Summary

| Method   | Path                               | Purpose                                          |
| -------- | ---------------------------------- | ------------------------------------------------ |
| `GET`    | `/products`                        | Return products, optionally filtered by status   |
| `GET`    | `/products/:id`                    | Return a single product                          |
| `POST`   | `/products/:id/publish`            | Publish a product immediately                    |
| `POST`   | `/products/:id/unpublish`          | Unpublish a product immediately                  |
| `POST`   | `/products/:id/publish_later`      | Schedule a future publish                        |
| `DELETE` | `/products/:id/publish_later`      | Cancel a scheduled publish                       |
| `GET`    | `/publication_events`              | Return publication history, optionally filtered by product |

#### Endpoint Design Notes
- Publishing operations use explicit action endpoints rather than relying only on generic product updates.
- This makes the allowed transitions visible in the API contract and gives each action a clear validation path, error response, and audit event.
- A generic `PATCH /products/:id` would be flexible, but it would make it easier to create invalid timestamp combinations or bypass publication-specific history.
- For this exercise, explicit action endpoints are the better fit because publication changes are domain actions, not ordinary field edits.

### `GET /products`
Returns products. Passing `status=published` returns the customer-visible catalogue view; omitting `status` returns all products for the admin workflow.

#### Request Shape
- No request body.
- Optional `status` query parameter filters products by `draft`, `scheduled`, or `published`.

#### Response Shape
```json
[
  {
    "id": 1,
    "title": "Classic White T-Shirt",
    "price": "19.99",
    "image_url": "https://example.com/product.jpg",
    "published_at": null,
    "scheduled_publish_at": "2026-07-05T00:00:00Z",
    "status": "scheduled"
  }
]
```

#### Explicitly Handled Cases

| Scenario | Response |
| --- | --- |
| Matching products exist | `200 OK` with products |
| No products match | `200 OK` with `[]` |

### `GET /products/:id`
Returns a single product.

#### Request Shape
- No request body.

#### Response Shape
```json
{
  "id": 1,
  "title": "Classic White T-Shirt",
  "price": "19.99",
  "status": "draft",
  "published_at": null,
  "scheduled_publish_at": null
}
```

#### Explicitly Handled Errors

| Scenario | Response |
| --- | --- |
| Product does not exist | `404 Not Found` |

### `POST /products/:id/publish`
Publishes a product immediately.

#### Request Shape
- No request body.

#### Response Shape
```json
{
  "id": 1,
  "title": "Classic White T-Shirt",
  "price": "19.99",
  "status": "published",
  "published_at": "2026-07-02T09:15:00Z",
  "scheduled_publish_at": null
}
```

#### Explicitly Handled Errors

| Scenario | Response |
| --- | --- |
| Product does not exist | `404 Not Found` |
| Product is already published | `409 Conflict` |

### `POST /products/:id/unpublish`
Unpublishes a product immediately.

#### Request Shape
- No request body.

#### Response Shape
```json
{
  "id": 1,
  "title": "Classic White T-Shirt",
  "price": "19.99",
  "status": "draft",
  "published_at": null,
  "scheduled_publish_at": null
}
```

#### Explicitly Handled Errors

| Scenario | Response |
| --- | --- |
| Product does not exist | `404 Not Found` |
| Product is not currently published | `409 Conflict` |

### `POST /products/:id/publish_later`
Creates a scheduled publish time for an unpublished product.

#### Request Shape
```json
{
  "scheduled_at": "2026-07-05T00:00:00Z"
}
```

#### Response Shape
```json
{
  "id": 1,
  "title": "Classic White T-Shirt",
  "price": "19.99",
  "status": "scheduled",
  "published_at": null,
  "scheduled_publish_at": "2026-07-05T00:00:00Z"
}
```

#### Explicitly Handled Errors

| Scenario | Response |
| --- | --- |
| Product does not exist | `404 Not Found` |
| `scheduled_at` missing or malformed | `422 Unprocessable Entity` |
| `scheduled_at` is in the past | `422 Unprocessable Entity` |
| Product already has a pending publish schedule | `422 Unprocessable Entity` |
| Product is already published | `409 Conflict` |

#### Notes
- The implementation creates a `ProductSchedule` row rather than writing a schedule timestamp directly to `products`.
- The implementation rejects a second pending publish schedule instead of replacing the existing one. This keeps schedule history explicit and avoids silently changing an operator's previous scheduling decision.
- Creating a schedule records a `publish_scheduled` event.

### `DELETE /products/:id/publish_later`
Cancels an existing scheduled publish.

#### Request Shape
- No request body.

#### Response Shape
```json
{
  "id": 1,
  "title": "Classic White T-Shirt",
  "price": "19.99",
  "status": "draft",
  "published_at": null,
  "scheduled_publish_at": null
}
```

#### Explicitly Handled Errors

| Scenario | Response |
| --- | --- |
| Product does not exist | `404 Not Found` |
| Product is not currently scheduled | `409 Conflict` |

### `GET /publication_events`
Returns publication history in reverse chronological order. Passing `product_id` filters the history to a single product.

#### Request Shape
- No request body.
- Optional `product_id` query parameter filters events to a single product.

#### Response Shape
```json
[
  {
    "id": 3,
    "product_id": 1,
    "event_type": "published",
    "from_state": "scheduled",
    "to_state": "published",
    "triggered_by": "system",
    "user_id": null,
    "occurred_at": "2026-07-05T00:00:01Z"
  }
]
```

#### Explicitly Handled Cases

| Scenario | Response |
| --- | --- |
| Product has publication events | `200 OK` with events |
| Product has no publication events | `200 OK` with `[]` |

## Scheduled Events
- Use `ExecuteDueProductSchedulesJob`, scheduled through Rails/Solid Queue recurring tasks.
- In development and production, the job is configured to run every minute.
- The job loads pending `ProductSchedule` rows where `scheduled_at <= Time.current`.
- Each due schedule is processed independently so a failure on one row does not stop later due schedules from being attempted.
- This keeps scheduling concerns separate from request handling and fits naturally into a Rails application.

Why:
- A recurring job is enough for this scope because publishing does not need second-level precision.
- Solid Queue gives the local demo a persisted queue and recurring task runner without introducing another scheduling system.
- Processing schedule rows instead of product rows keeps the job aligned with the `ProductSchedule` lifecycle.
- It is simpler to reason about than one-off scheduled jobs that must be created, cancelled, and recovered individually.
- It avoids coupling request handling to a long-running timer process.
- It makes missed schedules recoverable: if the app is down at the scheduled time, the next successful job run can still publish due schedules.

Trade-offs:
- Publishes happen on the next one-minute run, not exactly at the scheduled second.
- The system needs operational confidence that Solid Queue and the recurring task process are running.
- A production system with high volume or strict timing guarantees may need a more robust queue, scheduler, locking strategy, and monitoring.

### Scheduled Publish Flow
1. An operator schedules a product by calling `POST /products/:id/publish_later`.
2. The API validates that the product exists, is not published, does not already have a pending publish schedule, and has a future `scheduled_at`.
3. A pending `ProductSchedule` is created.
4. A `publish_scheduled` event is recorded.
5. The recurring job checks for pending schedules whose `scheduled_at` is due.
6. For each due schedule, the job locks the product, reloads the schedule, and confirms the schedule is still pending.
7. If the product can still be published, the job sets `published_at`, marks the schedule `executed`, sets `executed_at`, and records a `published` event with `triggered_by = system`.
8. If the product is already published, the job marks the stale schedule `cancelled` and records a system `schedule_cancelled` event instead of retrying it forever.

### Time Handling
- API timestamps use ISO 8601.
- Persisted timestamps are stored in UTC.
- UI display can convert timestamps to the operator's local timezone.
- The backend remains the source of truth for whether a schedule is valid and due.

### Idempotency and Duplicate Execution
- The scheduled publish job only selects pending schedules whose `scheduled_at` is due.
- The job locks the product before applying a due schedule.
- The schedule is reloaded inside the lock and skipped if it is no longer pending.
- Executing a schedule marks it `executed` so the same schedule is not repeatedly processed.
- Manual publish cancels any pending publish schedule, so a later scheduler run cannot re-publish the same product.
- The implementation has enough locking for the local MVP and low-concurrency demo. A production version may still add a schedule-level claim step if multiple queue workers process due schedules in parallel.

### Failure Modes and Limitations
- A recurring job runs every minute, so scheduled publishes occur on the next run rather than exactly at the scheduled second.
- If a schedule row raises an exception, the job logs the failure and continues processing other due schedules.
- If a schedule can no longer be legally applied because the product is already published, the schedule is cancelled and a system cancellation event is recorded.
- If the application is down at the scheduled time, products publish when the job next runs after recovery.
- This version does not model partial failure notifications or retry dashboards.

### Scheduled Events Implementation Note
- The initial design described the scheduler as checking products with a due `scheduled_publish_at`.
- The implementation now checks due `ProductSchedule` records instead.
- This changed because schedules now have their own lifecycle (`pending`, `executed`, `cancelled`) and can be retained for troubleshooting after they run or are cancelled.

## 5. Data Flow and Key Scenarios

**Publish Now**
1. Operator chooses to publish a product immediately.
2. API validates that the product exists and is not already published.
3. API sets `published_at`.
4. API clears any scheduled publish time.
5. API records a `published` event.
6. Customer catalogue includes the product.

**Schedule Publish**
1. Operator chooses a future publish time.
2. API validates the input and product state.
3. API creates a pending `ProductSchedule`.
4. API records a `publish_scheduled` event.
5. Customer catalogue continues to hide the product until the schedule is processed.

**Scheduled Time Is Reached**
1. Recurring job finds due unpublished products.
2. Job publishes each product using the same service as manual publishing.
3. Job marks the due schedule as `executed`.
4. Job records a `published` event with `triggered_by = system`.

**Cancel Scheduled Publish**
1. Operator cancels a scheduled publish.
2. API validates that the product is currently scheduled.
3. API marks the pending schedule as `cancelled`.
4. API records a `schedule_cancelled` event.

**Fetch Customer Catalogue**
1. Customer catalogue calls `GET /products`.
2. API returns products with `published_at` present.
3. The catalogue does not live-update automatically; users see changes when the page refreshes or the app refetches data.

**View Product History**
1. Operator opens a product's publication history.
2. UI calls `GET /publication_events?product_id=:id`.
3. API returns publication events in reverse chronological order.

## 6. Test Strategy

### Model-Level Tests
- Derived product status for draft, scheduled, and published products.
- `scheduled_publish_at` computed from a pending publish schedule.
- Product scopes used by the UI and catalogue filters.
- Schedule lifecycle rules that protect the workflow:
  - only pending schedules make a product scheduled;
  - duplicate pending publish schedules are rejected;
  - a new schedule is allowed after the previous one is cancelled or executed;
  - scheduled publish times must be in the future on create;
  - executed schedules can retain their original past due time.
- Publication event attribution rules:
  - user-triggered events require a user;
  - system-triggered events do not;
  - `occurred_at` defaults when omitted.

These tests sit close to the domain logic because derived state, schedule eligibility, and audit attribution are the highest-risk model behaviours. They intentionally avoid exhaustively testing Rails presence validations, enum inclusion declarations, and associations.

### Scheduled Job Tests
- Due pending schedules publish the product, mark the schedule `executed`, set `executed_at`, and record a system `published` event.
- Future schedules remain pending.
- Due schedules that are no longer legal are cancelled and recorded as system cancellations.
- A failing schedule row does not stop later due schedules from being processed.

The scheduled job gets richer coverage than ordinary model validations because it owns the time-based behaviour, idempotency, and failure isolation that operators would rely on during a launch.

### Integration/API Tests
- Product listing exposes derived status and schedule fields needed by the UI.
- Customer catalogue filtering returns only published products in the expected order.
- Publish, unpublish, schedule, and cancel workflows return successful responses and create the expected product, schedule, and audit side effects.
- High-risk invalid transitions return conflicts, including publishing an already-published product, scheduling a non-draft product, duplicate pending schedules, past schedule times, and cancelling when no pending schedule exists.
- Publication history returns events newest-first and supports filtering by product.

These tests prove that the API exposes the domain rules correctly and records the side effects that operators need for audit and troubleshooting. They are scenario-based rather than a branch-by-branch controller coverage pass.

### Not Tested
- Authentication and authorization, because user management is out of scope.
- Plain Rails validation and association declarations, except where they protect a publishing rule.
- Generic `404` handling for every endpoint, because `ActiveRecord::RecordNotFound` is handled centrally and the publishing risk is in state transitions rather than route plumbing.
- Production queueing behaviour, because the local implementation only needs to demonstrate the workflow.
- Browser-level visual polish, because the UI is a demo surface rather than a production design-system implementation.
- Frontend component tests, because the frontend is a demonstration surface and the critical risk is backend state and audit correctness.
- Full ecommerce product behaviour such as sale pricing, sizes, variants, or inventory.
- High-concurrency scheduler execution, because the local demo assumes a single worker. The design notes where locking would be added for production.

## 7. Cuts and Simplifications (Out of Scope)
- Scheduled unpublishing was cut from the initial scope to keep the implementation focused on the requested scheduled publishing workflow.
- Product groups and campaign-style publishing were deferred.
- Bulk publishing and bulk scheduling are out of scope.
- Authentication and user management are out of scope.
- The UI does not need to be polished beyond demonstrating the workflow.
- The customer catalogue does not live-update automatically when a scheduled publish is processed.
- Broader ecommerce fields such as sale price, sizes, variants, and inventory are out of scope.
- A microfrontend architecture is not required for the current version.
- The local demo assumes low concurrency.

## 8. Path to Production

### Next Steps
- **Next 2 Hours**
  - Add filtering to the global publication history view so operators can narrow recent activity by product or event type.
  - Tighten transactional boundaries around publication transitions so product changes and audit events commit together.
  - Improve the admin UI affordances around cancelling scheduled publishes and explaining when a product already has a pending schedule.

- **Next Day**
  - Add scheduled unpublishing using the same transition and event model.
  - Add bulk selection for common operator workflows.
  - Add clearer empty, loading, and error states in the admin UI.

### Path to Production
- Add authentication, authorization, and real user attribution.
- Add database-level constraints and indexes for publication state queries and event lookups.
- Add row locking or a claiming mechanism for due scheduled publishes if multiple workers can run.
- Add observability for scheduled publish execution, failures, and lag between scheduled time and actual publish time.
- Move API routes under an `/api` namespace.
- Replace the simple recurring job with a more robust queueing or scheduling setup if volume, reliability, or timing requirements justify it.
- Add production deployment infrastructure.

## 9. Changes From Initial Plan

### What Changed
- The initial plan considered a simple polling service for scheduled jobs.
- The design now uses a recurring Rails background job that calls the same publishing logic used by manual publishing.
- The initial plan considered storing `status` as an enum in the database.
- The design now derives state from `published_at` and pending `ProductSchedule` rows.
- The initial plan stored `scheduled_publish_at` on `products`.
- The implementation now stores scheduled publish intent in `ProductSchedule`.
- The initial plan included flexible event `metadata`.
- The implementation removed `metadata` from the MVP event table.

### Why It Changed
- Deriving status avoids inconsistency between `status`, `published_at`, and pending schedules.
- It reduces the number of ways the data can become invalid.
- It keeps the persisted model close to the source facts:
  - is it published now?
  - is there a scheduled publish?
- Moving schedules into `ProductSchedule` preserves the lifecycle of scheduled work instead of overwriting a timestamp on the product row.
- Removing event `metadata` keeps the MVP audit record explicit and easier to validate; the current fields are enough to support the demo and interview discussion.
- A recurring Rails job is a pragmatic fit for this version because it is easy to run locally, recoverable after downtime, and accurate enough for scheduled product publishing.

### Trade-Offs
- Deriving status favours write consistency over direct status queries.
- Storing status explicitly would make some queries simpler and could become useful if the lifecycle grows.
- A recurring job favours operational simplicity over exact execution timing.
- One-off scheduled jobs could provide more precise scheduling, but they introduce extra lifecycle concerns around rescheduling, cancellation, persistence, and recovery.
- The chosen approach keeps the implementation focused on the core assessment requirements while leaving clear extension points for production hardening.
