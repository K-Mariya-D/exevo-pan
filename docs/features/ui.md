# User Interface (UI) System

## Overview
Frontend for guild management system focused on simplicity, clarity, and modular structure.

---

## Core Pages

### 1. Guild List Page

- Display list of guilds
- Search by name
- Filter by:
  - privacy (OPEN / CLOSED)

#### API:
- GET /guilds

---

### 2. Guild Profile Page (MAIN PAGE)

Central page of the application.

#### Features:
- Guild information (name, members, privacy)
- Members list
- Events list
- Basic statistics:
  - average level
  - activity summary
  - vocation distribution

#### Optional sections (tabs):
- Members
- Events
- Stats
- Management (if authorized)

---

### 3. Member Profile (simplified view)

#### Features:
- Character info
- Level
- Skills
- Achievements
- Basic progress history

#### Note:
- Can be a modal or tab inside Guild Profile

---

### 4. Management (Leader / Officer)

#### Access:
- LEADER
- OFFICER

#### Features:
- Manage members (add/remove/roles)
- Create events
- Basic guild settings

#### Note:
- This is a section inside Guild Profile (not separate page)

---

## UI Architecture

### Structure

/src
  /pages
  /components
  /services
  /hooks

---

### Guidelines

- Keep components reusable and small
- Separate API logic into services
- Use hooks for stateful logic
- Avoid unnecessary abstraction layers

---

## State Management

- Simple local state + API caching if needed
- No complex global state unless required

---

## API Integration

Use service layer:
- guildService
- eventService
- analyticsService

---

## UX Requirements

- Fast navigation between guilds
- Responsive layout
- Loading and error states
- Clear separation of sections

---

## Visualization

Use charts only in:
- Guild Profile (Stats section)

Includes:
- average stats
- activity summary
- vocation distribution

---

## Permissions (IMPORTANT)

- Hide management features for unauthorized users
- Validate roles from backend

---

## Implementation Guidelines

- Prefer composition over large page-level logic
- Avoid duplicated UI logic across pages
- Keep routing minimal and flat
- Use tabs instead of multiple pages where possible

---

## Steps for Implementation (for AI agent)

1. Setup project structure
2. Create routing and base layout
3. Implement Guild List page
4. Implement Guild Profile page (main hub)
5. Add tabs (members/events/stats/management)
6. Implement Member view (modal or tab)
7. Connect API services
8. Add charts for stats section
9. Add loading and error states