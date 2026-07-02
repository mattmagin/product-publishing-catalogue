# Product Catalogue Publishing System

_Senior Full Stack Developer_  
Universal Store — Take-Home Challenge

A design and implementation challenge for senior full stack developers joining Universal Store's Digital & Customer Platforms team.

---

## Context

### What you're building and why

Universal Store's product catalogue is the foundation of everything customers see. Right now, visibility is binary — a product is either live or it isn't. The business needs more control: operators want to schedule products to go live automatically at a specific date and time, and they need a clear record of what changed and when so they can audit and troubleshoot.

Your challenge is to design and build a publishing system for the product catalogue that handles both of these capabilities — and to demonstrate how you'd think about a system like this before writing a line of code.

---

## Evaluation

### What we're looking for

At senior level, we care as much about _how you think_ as what you build. This challenge has two phases: a scoping document produced before any coding, and an implementation that demonstrates your design working end to end.

- **Systems thinking** — a coherent domain model with explicit state, valid transitions, and considered edge cases
- **Pragmatic scoping** — clear reasoning about what you're not building, and why
- **Test judgement** — a deliberate choice of what to test and at which layer, not default coverage
- **Communication** — a scoping doc a non-engineer could follow, and a 2nd interview where you can articulate trade-offs clearly

---

## Starting Point

### The product catalogue

Start from the provided minimal product model. How visibility state is represented — and how it changes over time — is part of what you're designing. Extend the model as your design requires.


```ts
// Minimal starting model - extend as your design requires

type Product = {
  id: string;     // e.g. "prod_1"
  title: string;
  price: number;  // AUD
};

// Seed data
id      title                    price
prod_1  Classic White T-Shirt    19.99
prod_2  Blue Denim Jacket        59.99
prod_3  Wireless Earbuds        129.99
prod_4  Notebook (100 pages)      7.99
prod_5  Ceramic Mug              12.50
```


> [!note]
> No persistence layer required — in-memory data that resets on restart is fine.

---

## Phase 1 — Before any code

### Scoping Document

Spend 30–60 minutes producing a design document before you write any code. Include it in your repository as a web page, markdown file, or PDF — whichever you prefer. It's the first thing we'll open in the 2nd interview, and the quality of your thinking here matters as much as the implementation itself.

---

## 01 / High-Level Scope

### The system, in plain language

_This section should avoid implementation detail._

Address each of the following:

- **Capabilities** — what can a user do with this system? Describe the two features without naming classes, endpoints, or data structures
- **Out of scope** — what are you deliberately not building, and why? What would the next version include?
- **Risks and unknowns** — what could go wrong? What assumptions are you making that might not hold?
- **Production signal** — how would you know this system is working correctly once it's live?

---

## 02 / Low-Level Scope

### The design, in detail

_Complete this before touching the code._

#### Domain model

How are products represented in the catalogue? What states can they be in? What transitions between states are valid, and which are not?

What endpoints exist? For each: method, path, request shape, response shape, and the error cases you're explicitly handling.

#### Feature 1 — Scheduled publishing

Operators need to set a product to go live at a specific future date and time, without any manual intervention at that moment. How do time-based state transitions occur? What are the trade-offs in your chosen approach?

#### Feature 2 — Change history

Every change to a product's published state should be recorded so operators can audit and troubleshoot. What does a history record contain? How is it stored and accessed? What events do you capture?

#### Test strategy

What will you test, at what layer, and why those layers specifically? What won't you test and why not?

#### Cuts

What would you build next with another two hours? What would change if this had a real database and a team behind it?

> [!important]
> Your scoping doc will change once you start building — that's expected. Update it to reflect what shifted and why. A doc that shows your reasoning mid-flight is more valuable than one that perfectly matches the finished code.

---

## Phase 2 — Implementation

### Build it

Build a working system that demonstrates your design. Use any language, framework, or tooling you're comfortable with — we're evaluating your thinking, not your familiarity with a specific stack.

---

## 03 / Deliverables

### What we expect

_Core happy paths + the interesting logic_

- [ ] **A data API** that serves products filtered correctly by their current state — customers see only what should be visible to them
- [ ] **Scheduled publishing** that transitions a product's state at the right time without a manual trigger
- [ ] **Change history** that records state transitions and is accessible via the API
- [ ] **A simple UI** for demonstrating the system — something you can share your screen on during the 2nd interview and walk through the moving parts. It doesn't need to be polished
- [ ] **Tests** for the logic you consider most critical — be ready to explain what you didn't test and why
- [ ] **An updated scoping doc** reflecting what changed from your original design and the reasoning behind those changes

#### Not required

- [ ] A polished or production-ready UI
- [ ] Authentication or user management
- [ ] A database or persistent storage
- [ ] Deployment configuration or infrastructure

#### Running locally is fine

You don't need to deploy anywhere — we'll ask you to share your screen during the 2nd interview and run the system on your machine. If you'd like to deploy, Railway and Render are straightforward free options that handle background processes without much configuration.

---

## Submission

### How to submit

| Item        | Requirement                                       |
| ----------- | ------------------------------------------------- |
| Format      | GitHub or a zip archive                           |
| Timing      | At least 2 hours before the 2nd interview         |
| README      | Instructions to run the system locally            |
| Scoping doc | Included in the repo — web page, markdown, or PDF |

---

## 2nd Interview

### What to expect in the 2nd interview

The 2nd interview is approximately 60 minutes. Come prepared to talk about what you _didn't_ build as much as what you did.

#### 10 min — Demo

Walk us through the running system by sharing your screen. Show the state transitions and history in action.

#### 20 min — Design discussion

We'll work through your scoping document together. Expect questions about trade-offs you considered, alternatives you ruled out, and decisions that changed mid-implementation.

#### 30 min — Leadership questions

We'll talk about how you'd evolve this system with real constraints — a database, a growing team, a business that changes its mind. Come ready to discuss how you'd communicate technical trade-offs to non-engineers and lead this kind of work at scale.

---

**Universal Store**  
Questions? Reply to Danielle Perske, your recruitment contact.