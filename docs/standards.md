# Development Standards

## Type Safety

- All code must be fully typed (TypeScript)
- Do NOT use `any`
- Prefer strict and explicit types for:
  - API responses
  - database models
  - service layer logic

---

## Validation & Error Handling

- Validate all inputs on backend
- Use schema/DTO validation where applicable
- Ensure consistent error handling across API
- Return clear and meaningful error messages
- Do not expose internal system details

---

## API Standards

- Follow REST conventions
- Use correct HTTP methods and status codes
- Maintain consistent response structure across endpoints

---

## UI / UX Standards

### Responsiveness
- UI must be responsive
- Must support mobile and desktop layouts

### Design System
- Use existing UI components
- Do not create duplicate UI patterns
- Maintain visual consistency across pages

---

## SEO Requirements

For public guild pages:

- Use Next.js SSR
- Ensure proper meta tags:
  - title
  - description
  - open graph tags
- Ensure pages are crawlable and fast-loading

---

## Localization (i18n)

- All user-facing text must use translation system
- Supported languages:
  - EN
  - PT
  - ES
  - PL

### Rules:
- Do NOT hardcode strings in UI
- Use translation keys
- Support dynamic values (e.g. "guild.created": "Guild {name} created")

---

## Performance Guidelines

- Optimize API calls where necessary
- Avoid unnecessary frontend re-renders
- Use caching only when it provides clear benefit
- Prefer simple solutions over premature optimization

---

## Code Quality

- Keep code modular and readable
- Avoid duplication
- Follow existing project structure
- Prefer clarity over abstraction
- Keep services focused and small

---

## Testing Guidelines

Testing is used for **stability of core logic**, not as a development workflow requirement.

### Scope

- Tests cover only critical baseline functionality:
  - guild management
  - events
  - core permissions logic

- Testing new features is optional

---

### When to run tests

- Before major changes to core logic
- Before release
- When debugging regressions

---

### Rules

- Do NOT rely on tests as a step-by-step development gate
- Do NOT delete failing tests unless they are incorrect
- Fix implementation first when possible
- Tests must remain deterministic

---

### Types of tests

- Unit tests → core logic
- Integration tests → critical flows
- UI tests → optional (only for important flows)

---

## Regression Safety

- Core (baseline) functionality must remain stable
- If baseline tests fail:
  - fix implementation first
  - adjust tests only if they are incorrect