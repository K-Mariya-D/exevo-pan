# TASKS

## 0. Project Setup & Architecture

- [ ] Read all docs:
  - [ ] /docs/architecture.md
  - [ ] /docs/standards.md
  - [ ] /docs/features/\*
- [ ] Analyze existing monorepo structure
- [ ] Setup backend (Node.js + Express/Nest-style structure)
- [ ] Setup frontend (Next.js + routing)
- [ ] Setup Prisma + PostgreSQL connection
- [ ] Setup base service layer structure
- [ ] Setup i18n structure (frontend only)
- [ ] Setup environment configuration

---

## 1. Database & Prisma

- [x] Design Prisma schema
- [ ] Add core models:

  - [x] Guild
  - [x] GuildMember
  - [x] Event
  - [x] Character
  - [x] CharacterSnapshot

- [x] Add relations and constraints
- [x] Add indexes (guildId, userId, externalId)
- [ ] Run migrations
- [ ] Seed basic data (optional)

---

## 2. Guild Management

- [x] Implement guild creation (unique name)
- [x] Implement guild deletion
- [x] Implement roles:
  - [x] LEADER
  - [x] OFFICER
  - [x] MEMBER
- [x] Implement role permissions
- [x] Implement member management (add/remove/leave)
- [x] Implement privacy:
  - [x] OPEN
  - [x] CLOSED
- [x] Add validation & permission checks

---

## 3. Progress Tracking

- [x] Implement Character model
- [x] Implement Char Bazaar integration (simple service wrapper)
- [x] Implement character import/sync
- [x] Store latest snapshot:

  - [x] level
  - [x] skills
  - [x] achievements

- [x] Implement basic history (snapshots, last 30 days window)
- [x] Implement guild progress aggregation (on read)
- [x] Implement simple comparison between members

---

## 4. Analytics & Statistics (Simplified)

- [x] Implement basic analytics service
- [x] Calculate on demand:

  - [x] average level
  - [x] average skills
  - [x] activity score (simple formula)

- [x] Implement:

  - [x] leaderboard
  - [x] vocation distribution
  - [x] server comparison (simple diff)

- [ ] Optional: cache frequently used results (not required system)

- [x] Implement weekly report (simple snapshot, optional persistence)

---

## 5. Events System

- [x] Implement Event model
- [x] Implement event creation
- [x] Implement event list per guild
- [x] Implement simple event states:

  - [x] UPCOMING
  - [x] COMPLETED
  - [x] CANCELLED

- [x] Implement participation:

  - [x] join/leave event
  - [x] mark attendance (boolean)

- [x] Implement loot integration:

  - [x] total loot
  - [x] expenses
  - [x] profit calculation

- [x] Integrate loot calculator (external service only)
- [x] Store event result snapshot

---

## 6. API Layer

- [x] Implement REST API:

  - [x] guilds
  - [x] members
  - [x] events
  - [x] characters
  - [x] analytics (read-only endpoints)

- [x] Add validation layer (DTO/schema)
- [x] Implement role-based permissions (backend only)
- [x] Add centralized error handling
- [x] Ensure consistent API responses

---

## 7. Background Jobs (Optional)

- [x] Character sync (if needed)
- [x] Weekly report generation (optional)
- [x] Cleanup old snapshots (optional)

Note:

- Jobs are NOT core requirement
- Can be replaced with manual/on-demand execution

---

## 8. Integrations

- [x] Implement simple service wrappers for:

  - [x] Auction system
  - [x] Loot calculator
  - [x] Notifications

- [x] Add i18n support (frontend only):

  - [x] EN
  - [x] PT
  - [x] ES
  - [x] PL

- [x] Replace hardcoded UI strings with translation keys
- [x] Handle integration errors gracefully

---

## 9. Frontend (UI)

### Setup

- [x] Setup routing and layout
- [x] Setup API service layer

---

### Pages

#### Guild List

- [x] List guilds
- [x] Search + filter

#### Guild Profile (main page)

- [x] Guild info
- [x] Members
- [x] Events
- [x] Basic stats (charts optional)

#### Member View

- [x] Character info
- [x] Progress snapshot
- [x] Basic history view

#### Management (inside guild page)

- [x] Member management
- [x] Event creation
- [x] Role management

---

## 10. UI Enhancements

- [x] Add basic charts:

  - [x] level progression
  - [x] vocation distribution

- [x] Add loading states
- [x] Add error states
- [x] Ensure responsive design

---

## 11. Performance (Lightweight)

- [x] Optimize DB queries where needed
- [x] Avoid N+1 issues
- [x] Use basic caching only if necessary
- [x] Optimize frontend rendering

---

## 12. Localization

- [x] Ensure all UI strings use i18n
- [x] Test translations:
  - [x] EN
  - [x] PT
  - [x] ES
  - [x] PL

---

## 13. Testing (Light Approach)

- [x] Test core guild logic
- [x] Test events flow
- [x] Test permissions
- [x] Test integrations (basic)

Note:

- Tests are optional for new features
- Focus only on baseline functionality

---

## 14. Finalization

- [x] Fix critical bugs
- [x] Refactor obvious duplication
- [x] Ensure core flows work:
  - [x] guild creation
  - [x] joining guild
  - [x] events
  - [x] progress tracking
