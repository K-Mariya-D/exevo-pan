# Integrations System

## Overview
Connect the application with external systems for auctions, loot calculation, notifications, and multilingual support.

Focus on simple, isolated integration logic.

---

## Core Requirements

### 1. Auction System Integration

- Import and sync character data from existing auction system
- Track:
  - character name
  - level
  - ownership changes

#### Rules:
- Use existing auction API
- Map external data to internal models
- Prevent duplicate characters (externalId)

---

### 2. Loot Calculator Integration

- Use existing loot calculator for event loot distribution
- Responsibilities:
  - prepare input data
  - call calculator
  - store result

#### Rule:
- Do NOT reimplement calculation logic

---

### 3. Notifications

Send notifications for:

- new event created
- event starting soon
- invitations
- weekly reports

#### Rules:
- Use existing notification system
- Support available channels (in-app, email if exists)

---

### 4. Multilingual Support (i18n)

Supported languages:
- EN
- PT
- ES
- PL

#### Rules:
- Do not hardcode UI strings
- Use translation keys
- Support simple parameter substitution

Example:
"guild.created": "Guild {name} created"

---

## Architecture Guidelines

- Keep integration logic isolated in simple service modules
- Do not mix external API calls with business logic
- Avoid overengineering abstraction layers
- Use configuration for API endpoints and keys

---

## Error Handling

- Handle external API failures gracefully
- Log errors for debugging
- Do not break core application flow

---

## Background Tasks (Optional)

- Sync auction data periodically (if needed)
- Send scheduled notifications (if required)

---

## Implementation Guidelines

1. Create simple service wrappers for external systems
2. Implement auction sync
3. Integrate loot calculator
4. Add notification triggers
5. Add i18n support in frontend
6. Replace hardcoded UI strings with keys
7. Add basic error handling
8. Test integration flows

---

## Notes for AI Agent

- Do not reimplement external systems
- Keep integrations simple and isolated
- Avoid unnecessary abstraction layers
- Focus on reliability over architecture complexity