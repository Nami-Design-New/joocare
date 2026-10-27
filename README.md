# Joo Care

Next.js (App Router) web app for Joo Care, built with TypeScript, Tailwind CSS v4, shadcn/ui, TanStack Query, React Hook Form + Zod, NextAuth and next-intl (Arabic / English).

- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Coding Rules](#coding-rules)

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy the example file, then fill in the values:

```bash
cp .env.example .env.local
```

`.env.example` lists every required key (API base URLs, NextAuth, Google / LinkedIn OAuth, request logging flags).

> **Important**
>
> - Do NOT commit `.env.local`.
> - Keep secrets private. Never paste them into code, logs or issues.
> - Restart the dev server after changing environment variables.

### 3. Run the app

```bash
npm run dev
```

Then open <http://localhost:3000>.

---

## Scripts

```bash
npm run dev       # Run development server
npm run build     # Create production build
npm run start     # Run production server
npm run preview   # Build, then start the production server
npm run lint      # Run ESLint
npx tsc --noEmit  # Type-check the project
```

There is no test runner configured yet, so there is no `npm test`.


---

## Coding Rules

Everyone who writes code in this project (developers and AI agents) must follow [RULES.md](RULES.md): architecture and folder structure, clean code, component boundaries, design system, API, forms, localization and the finish checklist.
