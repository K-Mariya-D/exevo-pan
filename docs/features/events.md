# Guild Events System

## Overview
System for managing guild events (hunts and raids), tracking participation and basic loot distribution.

---

## Core Requirements

### 1. Event Creation & Scheduling

#### Event types:
- HUNT
- RAID

#### Features:
- Create event
- Schedule date/time
- Add description and location
- Assign organizer (LEADER or OFFICER)

#### Rules:
- Only LEADER or OFFICER can create events
- Event must have scheduled time
- Event status:
  - UPCOMING
  - COMPLETED
  - CANCELLED

---

### 2. Participation Tracking

#### Features:
- Join event
- Leave event
- Mark attendance (simple boolean or flag)

#### Rules:
- Only guild members can participate
- Each user can join once per event
- Organizer can update attendance

---

### 3. Loot & Rewards

#### Features:
- Store total loot value for event
- Store optional expenses
- Calculate profit (loot - expenses)

#### Loot distribution:
- Use existing loot calculator module
- Store final result as snapshot per event

---

### 4. Event History

Store completed events with:
- participants
- attendance
- loot result (summary)
- basic statistics

---

## Data Model

### Event
- id
- guildId
- type (HUNT | RAID)
- title
- description
- scheduledAt
- status
- createdBy
- createdAt

---

### EventParticipant
- id
- eventId
- userId
- characterId (optional)
- attended (boolean)

---

### EventResult
- id
- eventId
- totalLoot
- expenses
- profit
- distribution (json snapshot)

---

## API

### Events
- POST /events
- GET /events/:id
- GET /guilds/:id/events
- PATCH /events/:id
- DELETE /events/:id

### Participation
- POST /events/:id/join
- POST /events/:id/leave
- PATCH /events/:id/attendance/:userId

### Loot
- POST /events/:id/loot
- POST /events/:id/distribute

---

## Business Rules

- Only guild members can join events
- Each participant is unique per event
- Loot distribution only after event is COMPLETED
- Attendance is used for eligibility
- Validate guild membership on all actions

---

## Integration (Loot Calculator)

- Use existing loot calculator service
- Create simple adapter:
  - prepare participants
  - call calculator
  - store result snapshot

---

## Architecture Guidelines

Use services:

- EventService
- LootService

Responsibilities:

### EventService
- event lifecycle
- participant management

### LootService
- profit calculation
- integration with loot calculator
- storing results

---

## Event Lifecycle

- UPCOMING → created
- COMPLETED → finished event
- CANCELLED → aborted event

---

## Implementation Guidelines

- Keep logic simple and transactional where needed
- Avoid duplicate participant entries
- Ensure data consistency
- Do not over-model participation states
- Keep loot distribution as a snapshot, not a system

---

## Steps for Implementation (for AI agent)

1. Design event schema
2. Implement event creation
3. Implement participation system
4. Implement attendance tracking
5. Implement loot calculation integration
6. Store event results
7. Implement event history API
8. Add validation & permissions