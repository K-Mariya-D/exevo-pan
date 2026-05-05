# Guild Analytics & Statistics System

## Overview
Provide basic analytics and statistics for guild performance based on existing progress data.

Focus on simplicity and correctness rather than heavy precomputation.

---

## Core Requirements

### 1. Guild Average Stats

Calculate:
- Average level
- Average skill values

#### Rules:
- Based on current guild members
- Uses latest available character data
- Supports multiple characters per user

---

### 2. Most Active Members

Identify active members based on recent progress:

#### Metrics:
- Level gain (last 7 / 30 days)
- Skill improvements
- Achievements gained

#### Output:
- Top N members sorted by activity

---

### 3. Vocation Distribution

Provide distribution of character vocations:

- Count per vocation
- Percentage per vocation

Output formatted for frontend charts

---

### 4. Server Comparison

Compare guild stats with server averages:

- Average level
- Skill averages

#### Rules:
- Server data can come from external API or static dataset
- Compute differences (absolute + %)

---

### 5. Weekly Reports

Generate simple weekly reports:

Includes:
- Average stat changes
- Top performers
- New achievements summary
- Activity overview

#### Rules:
- Can be generated on-demand or periodically
- Stored reports are optional

---

## API

### Analytics
- GET /guilds/:id/stats
- GET /guilds/:id/activity
- GET /guilds/:id/vocations
- GET /guilds/:id/comparison

### Reports
- GET /guilds/:id/reports
- GET /guilds/:id/reports/:reportId

---

## Business Rules

- Use only active guild members
- Base calculations on latest progress data
- Ensure consistency with Progress Tracking system
- Avoid complex real-time optimizations

---

## Architecture Guidelines

- No separate aggregation layer required
- No mandatory caching layer
- Compute metrics from existing progress data
- Keep logic inside AnalyticsService only

---

## Implementation Guidelines

- Reuse Progress Tracking data directly
- Keep calculations simple and deterministic
- Avoid N+1 queries where possible
- Optimize only if performance issues appear

---

## Steps for Implementation (for AI agent)

1. Define simple analytics queries
2. Implement average calculations
3. Implement activity scoring (simple formula)
4. Implement vocation distribution
5. Implement server comparison logic
6. Implement report generation (on-demand)
7. Add API endpoints
8. Add validation & formatting