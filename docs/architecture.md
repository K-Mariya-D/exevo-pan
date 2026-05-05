# Architecture Overview

## System Philosophy

This project follows a **modular monorepo architecture** focused on:
- simplicity
- maintainability
- feature-based structure
- minimal abstraction layers

Avoid overengineering (no unnecessary platforms, pipelines, or infrastructure layers).

---

## Tech Stack

### Frontend
- TypeScript
- React
- Next.js (SSR where needed)

### Backend
- Node.js (service-based architecture)
- Prisma ORM
- PostgreSQL

---

## Monorepo Integration

- Follow existing monorepo structure
- Reuse shared modules and utilities
- Do NOT duplicate logic
- Prefer extending existing services over creating new abstractions
- Keep feature code self-contained where possible

---

## Required Existing Systems (MUST USE)

The system must integrate with existing infrastructure:

- UI design system components
- Tibia data utilities
- Authentication / user system
- Notification system (if available)

Do not reimplement existing functionality.

---

## SSR (Server-Side Rendering)

Use Next.js SSR for public-facing guild pages:

- guild profile pages
- public guild statistics pages

Requirements:
- SEO-friendly rendering
- pre-fetched server data
- no client-only critical rendering for public pages

---

## Database

- Prisma ORM
- PostgreSQL

Guidelines:
- keep schema normalized
- use relations properly
- avoid redundant or duplicated data
- add indexes only for real performance needs

---

## Frontend Integration

- Use existing design system components
- Follow established UI patterns
- Avoid building duplicate UI components
- Prefer composition over new abstractions

---

## Data & Service Layer

- Use simple service modules for business logic
- Keep API controllers thin
- Avoid unnecessary architectural layers (no mandatory repositories or factories)
- External integrations should be isolated in simple service wrappers

---

## Testing Strategy

- Tests cover **core stable functionality only**
- Writing tests for every new feature is NOT required
- Focus on:
  - guild core logic
  - permissions
  - critical flows

- Use existing test framework in monorepo
- Run tests:
  - before major changes
  - before release
  - when modifying core logic

- Tests should not slow down development flow

---

## CI / Validation

- CI validates only core stability tests
- Fail CI only on critical regressions
- No strict testing gates for every feature iteration

---

## Error Handling

- Use centralized error handling where available
- Return consistent API error formats
- Do not expose internal system details
- Handle external service failures gracefully

---

## Localization (i18n)

- All user-facing text must support i18n
- Use translation keys instead of hardcoded strings
- Support languages:
  - EN
  - PT
  - ES
  - PL

---

## SEO Requirements

- Public guild pages must be SEO optimized
- Use Next.js SSR metadata:
  - title
  - description
  - open graph tags
- Ensure crawlable HTML output

---

## Performance Guidelines

- Avoid premature optimization
- Optimize only where needed
- Prevent N+1 queries
- Use indexing only for real bottlenecks
- Prefer simple queries over complex abstraction layers

---

## Core Principles

- Simplicity over abstraction
- Reuse over duplication
- Service-based logic instead of layered architecture
- Incremental complexity only when required