# TASKS

## 0. Project Setup & Architecture

- [ ] Read all docs:
  - [ ] /docs/architecture.md
  - [ ] /docs/standards.md
  - [ ] /docs/features/*
- [ ] Analyze existing monorepo structure
- [ ] Setup backend (Node.js + Express/Nest-style structure)
- [ ] Setup frontend (Next.js + routing)
- [ ] Setup Prisma + PostgreSQL connection
- [ ] Setup base service layer structure
- [ ] Setup i18n structure (frontend only)
- [ ] Setup environment configuration

---

## 1. Database & Prisma

- [ ] Design Prisma schema
- [ ] Add core models:
  - [ ] Guild
  - [ ] GuildMember
  - [ ] Event
  - [ ] Character
  - [ ] CharacterSnapshot

- [ ] Add relations and constraints
- [ ] Add indexes (guildId, userId, externalId)
- [ ] Run migrations
- [ ] Seed basic data (optional)

---

## 2. Guild Management

- [ ] Implement guild creation (unique name)
- [ ] Implement guild deletion
- [ ] Implement roles:
  - [ ] LEADER
  - [ ] OFFICER
  - [ ] MEMBER
- [ ] Implement role permissions
- [ ] Implement member management (add/remove/leave)
- [ ] Implement privacy:
  - [ ] OPEN
  - [ ] CLOSED
- [ ] Add validation & permission checks

---

## 3. Progress Tracking

- [ ] Implement Character model
- [ ] Implement Char Bazaar integration (simple service wrapper)
- [ ] Implement character import/sync
- [ ] Store latest snapshot:
  - [ ] level
  - [ ] skills
  - [ ] achievements

- [ ] Implement basic history (snapshots, last 30 days window)
- [ ] Implement guild progress aggregation (on read)
- [ ] Implement simple comparison between members

---

## 4. Analytics & Statistics (Simplified)

- [ ] Implement basic analytics service
- [ ] Calculate on demand:
  - [ ] average level
  - [ ] average skills
  - [ ] activity score (simple formula)

- [ ] Implement:
  - [ ] leaderboard
  - [ ] vocation distribution
  - [ ] server comparison (simple diff)

- [ ] Optional: cache frequently used results (not required system)

- [ ] Implement weekly report (simple snapshot, optional persistence)

---

## 5. Events System

- [ ] Implement Event model
- [ ] Implement event creation
- [ ] Implement event list per guild
- [ ] Implement simple event states:
  - [ ] UPCOMING
  - [ ] COMPLETED
  - [ ] CANCELLED

- [ ] Implement participation:
  - [ ] join/leave event
  - [ ] mark attendance (boolean)

- [ ] Implement loot integration:
  - [ ] total loot
  - [ ] expenses
  - [ ] profit calculation

- [ ] Integrate loot calculator (external service only)
- [ ] Store event result snapshot

---

## 6. API Layer

- [ ] Implement REST API:
  - [ ] guilds
  - [ ] members
  - [ ] events
  - [ ] characters
  - [ ] analytics (read-only endpoints)

- [ ] Add validation layer (DTO/schema)
- [ ] Implement role-based permissions (backend only)
- [ ] Add centralized error handling
- [ ] Ensure consistent API responses

---

## 7. Background Jobs (Optional)

- [ ] Character sync (if needed)
- [ ] Weekly report generation (optional)
- [ ] Cleanup old snapshots (optional)

Note:
- Jobs are NOT core requirement
- Can be replaced with manual/on-demand execution

---

## 8. Integrations

- [ ] Implement simple service wrappers for:
  - [ ] Auction system
  - [ ] Loot calculator
  - [ ] Notifications

- [ ] Add i18n support (frontend only):
  - [ ] EN
  - [ ] PT
  - [ ] ES
  - [ ] PL

- [ ] Replace hardcoded UI strings with translation keys
- [ ] Handle integration errors gracefully

---

## 9. Frontend (UI)

### Setup
- [ ] Setup routing and layout
- [ ] Setup API service layer

---

### Pages

#### Guild List
- [ ] List guilds
- [ ] Search + filter

#### Guild Profile (main page)
- [ ] Guild info
- [ ] Members
- [ ] Events
- [ ] Basic stats (charts optional)

#### Member View
- [ ] Character info
- [ ] Progress snapshot
- [ ] Basic history view

#### Management (inside guild page)
- [ ] Member management
- [ ] Event creation
- [ ] Role management

---

## 10. UI Enhancements

- [ ] Add basic charts:
  - [ ] level progression
  - [ ] vocation distribution

- [ ] Add loading states
- [ ] Add error states
- [ ] Ensure responsive design

---

## 11. Performance (Lightweight)

- [ ] Optimize DB queries where needed
- [ ] Avoid N+1 issues
- [ ] Use basic caching only if necessary
- [ ] Optimize frontend rendering

---

## 12. Localization

- [ ] Ensure all UI strings use i18n
- [ ] Test translations:
  - [ ] EN
  - [ ] PT
  - [ ] ES
  - [ ] PL

---

## 13. Testing (Light Approach)

- [ ] Test core guild logic
- [ ] Test events flow
- [ ] Test permissions
- [ ] Test integrations (basic)

Note:
- Tests are optional for new features
- Focus only on baseline functionality

---

## 14. Finalization

- [ ] Fix critical bugs
- [ ] Refactor obvious duplication
- [ ] Ensure core flows work:
  - [ ] guild creation
  - [ ] joining guild
  - [ ] events
  - [ ] progress tracking