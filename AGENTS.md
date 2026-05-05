# AGENTS.md

## Project Overview
Monorepo for exevo-pan — guild management system with backend and frontend (Next.js + Prisma + React).

The system follows a **modular monorepo architecture** with simple service-based backend logic and shared frontend design system.

---

## Core Principles

- Use existing architecture and patterns
- Do NOT duplicate logic
- Prefer simplicity over abstraction
- Keep code modular and readable
- Use strict TypeScript typing
- Validate all inputs
- Follow existing design system

---

## Global Requirements

Before implementing any feature:

### 1. Understand context
Read relevant documentation:
- /docs/architecture.md
- /docs/standards.md
- relevant /docs/features/* file

---

### 2. Follow project rules

- Use TypeScript (strict mode)
- Use existing UI components
- Use Prisma + PostgreSQL for data layer
- Use Next.js SSR where required
- Ensure responsive UI
- Ensure SEO for public pages
- Ensure i18n for user-facing text

---

### 3. Required quality rules

- Validate all inputs (backend + frontend where applicable)
- Handle errors consistently
- Keep services small and focused
- Avoid unnecessary abstraction layers
- Reuse existing utilities and services

---

### 4. Do NOT

- Do not duplicate existing logic
- Do not hardcode UI strings
- Do not introduce new architecture layers without need
- Do not overengineer caching, jobs, or infrastructure
- Do not ignore performance in obvious hotspots

---

## Coding Guidelines

- Use service-based structure for business logic
- Keep controllers thin
- Keep functions small and readable
- Prefer composition over abstraction layers
- Reuse existing modules instead of creating new ones

---

## Testing Guidelines

Testing is used for **core stability only**, not as a development workflow requirement.

### Scope

- Tests cover only baseline critical functionality:
  - guild management
  - event system
  - permissions logic

- Testing for new features is optional

---

### When to use tests

- Before modifying core logic
- When fixing regressions
- Before release of major changes

---

### Rules

- Do NOT require tests for every feature iteration
- Do NOT remove or ignore failing baseline tests
- Fix implementation first when tests fail
- Adjust tests only if they are incorrect

---

## Important Constraints

- NEVER break existing baseline functionality
- ALWAYS validate changes against system behavior
- Ensure changes integrate with existing monorepo structure

---

## Development Flow

1. Read relevant documentation
2. Understand existing implementation
3. Implement feature in minimal necessary scope
4. Ensure integration with existing system
5. Validate core functionality manually or via baseline tests (if relevant)