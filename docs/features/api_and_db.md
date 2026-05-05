# API & Database System

## Overview
Backend API and database layer for guild system using Prisma ORM.

Focus on clean structure, correctness, and maintainability.

---

## Core Requirements

### 1. Prisma Schema

Extend schema to support core entities:

- Guild
- GuildMember
- Event
- Character

---

### Required Models

#### Guild
- id
- name (unique)
- ownerId
- privacy (OPEN | CLOSED)
- createdAt

---

#### GuildMember
- id
- userId
- guildId
- role (LEADER | OFFICER | MEMBER)
- joinedAt

---

#### Event
- id
- guildId
- type
- status
- scheduledAt

---

#### Character
- id
- userId
- externalId
- name

---

## Database Rules

- Use relations (foreign keys)
- Add indexes on:
  - guildId
  - userId
  - externalId
- Enforce unique constraints where needed
- Keep schema normalized

---

## 2. REST API

Implement CRUD for core entities:

- guilds
- members
- events
- characters

Follow REST conventions:
- GET /resource
- POST /resource
- PATCH /resource/:id
- DELETE /resource/:id

---

## Validation

- Validate all inputs (DTO/schema)
- Return proper HTTP status codes:
  - 200 / 201
  - 400 (validation)
  - 403 (permission)
  - 404 (not found)

---

## Permissions

- Enforce role-based access (LEADER / OFFICER / MEMBER)
- Always validate on backend
- Do not rely on frontend checks

---

## Background Tasks (Optional)

Use scheduled jobs only if needed for:

- character sync
- analytics refresh
- cleanup tasks

Note:
- Jobs are optional and should not block core functionality

---

## Performance Guidelines

- Use indexes for frequent queries
- Avoid N+1 queries
- Use batch queries where appropriate
- Optimize only when needed (no premature optimization)

---

## Error Handling

- Centralized error handling
- Clear and consistent error messages
- Do not expose internal system details

---

## Implementation Guidelines

- Keep code modular and maintainable
- Separate API and business logic (services layer)
- Avoid over-engineering architecture layers
- Reuse existing logic across modules

---

## Steps for Implementation (for AI agent)

1. Define Prisma schema
2. Run migrations
3. Implement services
4. Implement CRUD endpoints
5. Add validation layer
6. Add permission checks
7. (Optional) add background jobs
8. Optimize queries if needed
9. Add error handling

---

## Notes for AI Agent

- Keep schema clean and minimal
- Do not introduce unnecessary architecture layers
- Avoid duplicating logic from other systems
- Prioritize simplicity and correctness