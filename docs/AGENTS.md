# Agent Instructions: Joo Care

These instructions apply to every AI agent working in this repository.

## Before writing or editing code

1. **Read the [Coding Rules in RULES.md](RULES.md) first.** They are mandatory.
2. **Read the closest similar implementation** (same feature, or a feature with the same kind of page, form, table or dialog) and follow its structure.
3. **Search before you create.** Check `src/shared` (`components/ui`, `components/common`, `components/modals`, `hooks`, `lib`) and the current feature for something you can reuse.
4. **Old violations are not patterns to copy.** If existing code breaks a rule, write new code the right way and don't spread the old pattern.

## Core rules (summary)

- **Structure:** `src/app` = routing and thin pages; `src/features/<kebab-name>/{components,hooks,services,actions,validation,types,constants,utils,store}` = domain code (create only what you need); `src/shared` = code used by more than one feature. In existing features, keep their current structure. Don't move or rename folders unless asked.
- **Components:** one responsibility each. Split out parts with their own behavior or repeated markup. Keep components reusable through props. Keep requests and logic in `services/` and `hooks/`, not in JSX.
- **Layering:** `app` → `features` → `shared`. `shared` never imports from `features`.
- **Design system:** shared UI components and variants, tokens from `src/app/globals.css`, `cn()`. No hex colors, no `gray-*` / `red-500` (use `text-destructive` for errors), no parallel styles.
- **Data:** `apiFetch` + `api-endpoints` helpers (no raw `fetch`, no direct `process.env` URLs). Every query or mutation goes in its own hook in `hooks/`. Query keys look like `['resource', locale, ...filters]`. Invalidate after mutations.
- **Forms:** React Hook Form + Zod (`zodResolver`, or `typedZodResolver` for `.default()` / `z.coerce`). Schemas use the `createXSchema(messages)` factory with translated messages. Use the shared fields in `src/shared/components` (`InputField`, `SelectInputField`, ...).
- **Reference implementations:** `company-admin-users` (page + hook + presentational children) and `candidate-settings/change-password` (form + schema + mutation hook). Don't copy the very large components (`JobPostStepOne`, `BasicInfoForm`).
- **i18n:** no hardcoded text (including placeholders, aria labels and toasts). Add keys to both `messages/en.json` and `messages/ar.json`. Use `@/i18n/navigation`, not `next/link` / `next/navigation`. Use RTL-safe logical classes (`ms-`, `pe-`, `start-`, `text-start`).
- **No debug leftovers:** no `console.log`, no commented-out code, no `copy` files.
- **TypeScript:** typed props and data. No `any`. Use `unknown` and narrow it at boundaries.
- **Scope:** change only what the task needs. Don't refactor unrelated code, change tool configs or add dependencies without being asked.

## Finish checklist

Before reporting a task as done, confirm:

- [ ] Structure and naming follow the RULES.md rules.
- [ ] Types are explicit, with no `any`.
- [ ] Translations were added in both `en.json` and `ar.json`.
- [ ] Loading, empty, error and pending UI states are handled.
- [ ] Verification was run as fits the change: `npm run lint`, `npx tsc --noEmit` (there is no `npm test`). Report any pre-existing failures or checks that couldn't run.

## Note

These rules guide the work. Automated checks only enforce what the current Prettier, ESLint and TypeScript configs cover. Everything else depends on following this file and RULES.md.
