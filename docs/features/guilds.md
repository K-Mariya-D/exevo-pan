# Guild Management System

## Overview
Implement a guild management system that allows users to create, manage, and interact with guilds.

The system should appear feature-complete from a user perspective, while keeping internal logic simple and maintainable.

---

## Core Requirements

### 1. Guild Creation & Deletion
- Users can create guilds with a **unique name**
- Guild name must:
  - be unique across the system
  - have validation (min/max length)
- Only the **guild owner (LEADER)** can delete the guild

---

### 2. Roles System

#### Roles:
- LEADER (owner)
- OFFICER
- MEMBER

#### Rules:
- Guild creator becomes LEADER
- A guild must always have exactly **one LEADER**

#### Permissions:

LEADER:
- full control over guild
- can assign/remove roles
- can transfer leadership
- can add/remove any member

OFFICER:
- can add members
- can remove MEMBERS

MEMBER:
- basic access
- can leave guild

---

### 3. Member Management

#### Joining:
- OPEN guild → user can join freely
- CLOSED guild → only LEADER or OFFICER can add users

#### Adding members:
- LEADER and OFFICER can add users directly

#### Removing members:
- LEADER can remove anyone
- OFFICER can remove only MEMBERS
- Users can leave guild voluntarily

---

### 4. Privacy Settings

Guild types:
- OPEN → anyone can join
- CLOSED → join by adding from LEADER/OFFICER

---

## Data Model

### Guild
- id
- name (unique)
- ownerId
- privacy (OPEN | CLOSED)
- createdAt

### GuildMember
- id
- userId
- guildId
- role (LEADER | OFFICER | MEMBER)
- joinedAt

> Note: Do NOT use JSON storage for members. Use relational structure.

---

## API

### Guilds
- POST /guilds → create guild
- DELETE /guilds/:id → delete guild
- GET /guilds/:id → get guild info

### Members
- POST /guilds/:id/join → join OPEN guild
- POST /guilds/:id/members → add member (LEADER/OFFICER)
- POST /guilds/:id/leave → leave guild
- DELETE /guilds/:id/members/:userId → remove member

### Roles
- PATCH /guilds/:id/members/:userId/role → change role

---

## Business Rules (IMPORTANT)

- Guild name must be unique
- A user can be in only one guild (recommended)
- Always enforce role permissions in backend
- Do not trust frontend — validate everything in backend

---

## Implementation Guidelines

- Use service layer (GuildService, MemberService)
- Keep business logic out of controllers
- Use database constraints where possible
- Add validation (DTO / schema)
- Add error handling:
  - Guild not found
  - Permission denied
  - Invalid role change
  - Duplicate guild name

---

## Steps for Implementation (for AI agent)

1. Design schema (Guild, GuildMember)
2. Create models/entities
3. Implement guild creation
4. Implement join/leave logic
5. Implement member management (add/remove)
6. Implement roles & permissions
7. Implement privacy rules (OPEN/CLOSED)
8. Add API endpoints
9. Add validation & error handling
10. (Optional) add baseline tests

---

## Notes for AI Agent

- Follow existing project architecture
- Do NOT duplicate logic
- Reuse existing user system
- Keep code modular and simple
- Ensure all actions are permission-checked in backend