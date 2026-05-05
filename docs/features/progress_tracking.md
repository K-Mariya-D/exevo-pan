# Member Progress Tracking System

## Overview
Track guild members' character progress including level, skills, and achievements, with basic comparison and history tracking.

---

## Core Requirements

### 1. Character Data Import (Char Bazaar)

#### Source:
- External service: Char Bazaar

#### Requirements:
- Import character data linked to a user
- Support manual sync on demand

#### Data:
- Character name
- Level
- Skills
- Achievements

#### Notes:
- System should be extensible for future sources
- Handle API errors gracefully
- Prevent duplicate characters (by externalId)

---

### 2. Progress Tracking

Track character progress:

- Level
- Skills
- Achievements

#### Rules:
- One user may have multiple characters
- Progress is tracked per character
- Guild progress is derived from member characters

---

### 3. History Tracking (simplified)

- Store periodic snapshots of character progress
- Keep history for last 30 days
- Old records are cleaned automatically (or ignored on query)

Tracked fields:
- Level
- Skills
- Achievements

---

### 4. Progress Comparison

Enable basic comparison between guild members:

- Compare:
  - Level
  - Skill values
  - Achievement count

- Simple leaderboards:
  - Highest level
  - Fastest growth (last 30 days)

---

## Data Model

### Character
- id
- userId
- name
- externalId
- createdAt

### CharacterSnapshot
- id
- characterId
- level
- skills (json or relational simplified)
- achievementsCount
- createdAt

---

## API

### Import
- POST /characters/import
- POST /characters/sync/:id

### Progress
- GET /characters/:id
- GET /guilds/:id/progress

### History
- GET /characters/:id/history

### Comparison
- GET /guilds/:id/leaderboard

---

## Business Rules

- Prevent duplicate characters (externalId unique)
- Ensure character belongs to user
- Only guild members included in guild stats
- History is limited to recent snapshots (30 days window)
- Always derive leaderboard from snapshots (no pre-aggregation required)

---

## Integration (Char Bazaar)

- Create service: `CharBazaarService`
- Responsibilities:
  - fetch character data
  - map external → internal format
  - handle errors

- No complex retry/caching logic required for MVP

---

## Implementation Guidelines

- Use single service layer:
  - CharacterService

- Separate:
  - import logic
  - progress logic

- Use scheduled job (optional):
  - periodic sync
  - cleanup old snapshots

---

## Steps for Implementation (for AI agent)

1. Design character schema
2. Implement import from Char Bazaar
3. Store character snapshot
4. Implement update/sync logic
5. Store history snapshots
6. Implement guild progress aggregation
7. Implement comparison endpoints
8. Add API endpoints
9. Add validation & error handling

---

## Notes for AI Agent

- Keep architecture simple and modular
- Do not over-separate services
- External API logic must stay isolated
- Optimize only if performance issues appear