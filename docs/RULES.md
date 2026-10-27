# Coding Rules

These rules apply to every change, whether it is written by a developer or by an AI agent (Codex, Claude, ...). The goal is a codebase that looks like it was written by one person: same structure, same patterns, clean and reusable components.

When a rule conflicts with old code, **follow the rule for new code** and leave old code alone unless you are already working on it. Existing violations are not patterns to copy.

## 1. Architecture and Folder Structure

```text
src/
  app/        # Routing, layouts and page composition only
  features/   # One folder per business domain
  shared/     # Code used by more than one feature
  i18n/       # next-intl routing, request config, localized navigation
messages/     # ar.json / en.json translations
docs/         # Technical notes (e.g. request-caching-audit.md)
```

### `src/app`

- Owns routing (`src/app/[locale]/...`), layouts, metadata and page composition.
- Keep `page.tsx` / `layout.tsx` thin: fetch what the route needs and render feature components. Feature details (forms, tables, dialogs, business logic) live in `src/features`.

### `src/features`

Each business domain owns its components, logic, requests and types. New features use this layout. **Create only the folders you need:**

```text
features/<feature-name>/
  components/   # UI components of this feature
  hooks/        # React hooks (queries, mutations, page/form logic)
  services/     # API request functions (use apiFetch)
  actions/      # Server actions
  validation/   # Zod schemas
  types/        # TypeScript types for this feature
  constants/    # Static values, options, query keys
  utils/        # Pure helper functions
  store/        # Redux slice, only if the feature needs shared client state
```

- Feature folder names are `kebab-case` (e.g. `company-admin-users`).
- When editing an **existing** feature, keep its current structure and names. Do not create a parallel structure or duplicate files next to the old ones.
- Moving or renaming old folders (e.g. `accout-settings`, `schema` vs `validation`, `lib` vs `utils`, `ui` vs `components`) is a separate task, not part of a feature change.

### `src/shared`

Code that is used by more than one feature. Check here before you build something new.

| Folder | What lives there |
| --- | --- |
| `components/ui` | shadcn/ui primitives: `button`, `dialog`, `sheet`, `drawer`, `input`, `select`, `combobox`, `table`, `pagination`, `skeleton`, ... |
| `components/` (root) | Form fields: `InputField`, `TextareaField`, `SelectInputField`, `MultiSelectInputField`, `PhoneInputCode`, `YearPicker`, `LabelCheckbox`, `FilepondUpload`, `StoredFilepondUpload`. States: `EmptyDataState`, `HttpStatusState`, `RouteErrorFallback`. Other: `CustomPagination`, `Breadcrumb`, `LanguageToggle`, `PdfViewer` |
| `components/common` | `DataTable`, `CountPageHeader` |
| `components/modals` | `AlertModal`, `DeleteModal`, `SuccessModal`, `LoginAlertModal`, `ModalHeading` |
| `components/header`, `components/sidebar-nav` | App shell |
| `hooks` | Lookup hooks (`useGetCountries`, `useGetSkills`, ...), `useInfiniteLookup`, `useUploadImage` |
| `lib` | `fetch-manager.ts` (`apiFetch`), `api-endpoints.ts`, `http-error.ts`, `typed-zod-resolver.ts`, `utils.ts` (`cn`) |
| `services` | Shared API calls (uploads, settings, job titles) |
| `providers` | Redux, TanStack Query and NextAuth providers |
| `types` | Global / API types |

Only move something into `shared` when a second feature actually needs it.

**Dependency direction:** `app` → `features` → `shared`. Code in `shared` must never import from `features`. If shared code needs feature logic, pass it in through props, or move that logic into `shared`.

### Imports

- There are no barrel (`index.ts` re-export) files. Import the file directly.
- Inside a feature, use relative imports (`../hooks/useX`). Use `@/features/<name>/...` when importing from another feature, and `@/shared/...` for shared code.
- If two features start importing the same thing from each other, move it to `shared` in a separate task.

### Reference implementations

Copy these patterns, not the older code:

| Need | Look at |
| --- | --- |
| Page with table, filters, pagination and dialogs (logic in one hook, presentational children) | `features/company-admin-users`: `CompanyUsersPage` + `useCompanyMembers` + `MembersTable` + `CompanyMemberDialogs` |
| Form + validation + mutation | `features/candidate-settings`: `change-password/ChangePasswordForm.tsx` + `hooks/useChangePassword.tsx` + `validation/change-password-schema.ts` |
| Server-rendered page with mapped API data | `features/candidate-profile/services/profile-service.ts` (API types mapped to a view model) |

Avoid copying very large "do everything" components such as `jobs/components/JobPostStepOne.tsx` or `candidate-settings/components/basic-info/BasicInfoForm.tsx`. They are examples of what to split.

## 2. Clean Code and Component Boundaries

- **One responsibility per component.** Extract a part into its own component when it has its own behavior, is repeated, or makes the parent hard to read. Example: a page component renders a header, a table and dialogs, and each of them is a separate component.
- **Small private helpers** may stay in the same file when they are only used by that component and stay simple.
- **Search before you create.** Look in `src/shared` and in the current feature for an existing component, hook or helper first.
- **Reusable within the right scope.** Design components to be reused (props instead of hardcoded data), but don't push everything into `shared` or build generic abstractions nobody needs yet.
- **Keep logic out of JSX.** Requests go in `services/`, React Query and form or page logic go in `hooks/`, and components mostly render. See `company-admin-users` (`useCompanyMembers` + `CompanyMemberDialogs`) for the pattern.
- **Readable code:** clear names, early returns, short focused functions, no magic values (put them in `constants/`).
- **Remove dead code** when you touch a file: unused imports, commented-out code, and duplicate "copy" files (e.g. `update-business-verification-service copy.ts`).
- **No fixed line limit.** Split by responsibility and complexity, not by line count.

## 3. Project Standards

### Design system

- Use the shared UI components and their existing variants (`cva`) before writing custom markup.
- Use the colors, spacing, radius and fonts defined as tokens in `src/app/globals.css` (e.g. `bg-primary`, `text-secondary`, `text-muted-foreground`, `bg-body-bg`, `border-border`). Don't hardcode hex colors (`bg-[#...]`), don't use raw palette classes (`gray-*`, `red-500`), and don't create parallel visual styles. If a color from the design is missing, add it as a token in `globals.css` first.
- Error text uses `text-destructive`, not `text-red-500`.
- Use the existing layout classes (`layout-shell`, `layout-content`, `layout-container`) for page width and padding.
- Merge class names with `cn()` from `@/shared/lib/utils`.
- Icons come from `lucide-react` unless the design provides a custom asset.

### TypeScript

- Type every component's props and every API payload or response.
- Avoid `any` and unjustified type assertions (`as X`). Use `unknown` at external boundaries (API responses, `catch` errors, storage) and narrow or validate it.
- Prefer `type` over `interface`. Name props `<Component>Props` (e.g. `type MembersTableProps = { ... }`).
- Shared types go in the feature's `types/<domain>.types.ts`, not inside service or component files. Global types go in `src/shared/types`.
- Keep the API shape (snake_case) separate from the UI shape (camelCase view model) when they differ, and map between them in the service.

### Naming

| Thing | Convention | Example |
| --- | --- | --- |
| Components | `PascalCase.tsx`, `export default function X` | `CompanyMemberDialogs.tsx` |
| Hooks | `useX.ts` (`.tsx` only if it returns JSX) | `useCompanyMembers.ts` |
| Services | `kebab-case-service.ts` | `upload-image-service.ts` |
| Server actions | `<domain>-actions.ts` | `license-actions.ts` |
| Zod schemas | `<name>-schema.ts` | `change-password-schema.ts` |
| Types | `<domain>.types.ts` | `member.types.ts` |
| Constants | `constants/index.ts` | |
| New folders | `kebab-case` | `company-admin-roles/` |

In existing folders, follow the local file pattern. Spell names correctly, because typos in file names spread through imports.

### Server vs client components

- Components are Server Components by default. Keep them that way when they don't need interactivity.
- Add `'use client'` only when the component needs state, effects, event handlers or browser APIs, and put it as low in the tree as possible.

### API requests

- Use `apiFetch` from `@/shared/lib/fetch-manager` and the URL builders in `@/shared/lib/api-endpoints` (`getBaseApiUrl`, `getUserApiUrl`, `getCompanyApiUrl`, ...). Don't call raw `fetch`, don't read `process.env.NEXT_PUBLIC_BASE_*` directly, and don't create new fetch or axios wrappers.
- `apiFetch` never throws. It returns `{ ok, data, statusCode, message }`. Services check `ok` and throw on failure:

  ```ts
  const { ok, data, message } = await apiFetch(`${getUserApiUrl()}/user-educations`, {
    method: 'POST',
    locale,
    token,
    body,
  });
  if (!ok) throw new Error(message || 'Failed to add education.');
  return data;
  ```

- Server-side page services throw `createHttpStatusError(...)` from `@/shared/lib/http-error` so that the route can render the right status state.
- Map API responses into UI-friendly data in services or hooks, not inside JSX.
- **Client services + TanStack Query** are the default. Use **server actions** (`actions/`, `'use server'`) only when a server-rendered page needs `revalidatePath`, or when the token must come from the server session.

### State

- **Server data on the client:** TanStack Query.
- **UI state** (open dialog, active tab, input value): local `useState`.
- **Shared client state:** Redux, only where it matches the existing pattern.
- App settings are fetched once in `app/[locale]/layout.tsx` and hydrated into Redux. Read them with `useAppSelector((s) => s.settings.data)`, and never fetch settings again in nested components.
- Don't store the same data in more than one place (e.g. copying query data into Redux or local state).

### Caching and requests

- Query keys are kebab-case arrays that start with the resource and then include the locale and every filter or param: `['company-jobs', locale, page, status]`. If a key is used in more than one place, export it from the hook or from `constants/`.
- Wrap each query or mutation in its own hook in `hooks/` (`useGetX`, `useUpdateX`). Components don't call `useQuery` or services directly.
- New lookup or dropdown hooks use `useInfiniteLookup` from `@/shared/hooks/useInfiniteLookup`. Don't copy-paste another infinite-query hook.
- Public data (home, about, FAQ, legal pages, public job details) may be cached with `next: { revalidate: 300 }`. Anything that depends on the logged-in user stays `cache: 'no-store'` and must never be cached as public data.
- When `generateMetadata` and the page need the same data, share one `cache()`-wrapped fetch.
- After a mutation, invalidate or update the related queries instead of reloading the page.
- Avoid duplicate requests and unnecessary `router.refresh()` calls.
- Background and lessons learned: [docs/request-caching-audit.md](docs/request-caching-audit.md).

### Forms

- Use React Hook Form + Zod with `zodResolver`. Use `typedZodResolver` from `@/shared/lib/typed-zod-resolver` when the schema uses `.default()` or `z.coerce`.
- Use the shared field components (`InputField`, `TextareaField`, `SelectInputField`, `PhoneInputCode`, ...). Register text inputs with `{...register('x')}`, and wrap selects, phone and file inputs in `<Controller>`. Show errors through the field's `error` prop, not ad-hoc `<span className="text-red-500">`.
- Schemas go in `validation/<name>-schema.ts` and use the message-factory pattern, so messages are translated:

  ```ts
  export const createChangePasswordSchema = (messages: ChangePasswordMessages) =>
    z.object({ currentPassword: z.string().min(1, messages.currentPasswordRequired) });
  export type TChangePasswordSchema = z.infer<ReturnType<typeof createChangePasswordSchema>>;

  // In the component:
  const schema = useMemo(() => createChangePasswordSchema({ currentPasswordRequired: t('...') }), [t]);
  ```

- Reset a form when a dialog opens by giving the form component a `key` (as in `CompanyMemberDialogs`), not with a `useEffect`.
- Sensitive operations must also be validated and permission-checked on the server.

### Localization (Arabic / English)

- No hardcoded user-facing text. This includes placeholders, `aria-label`s, toast messages, and labels passed to shared modals. Don't write `locale === 'ar' ? '...' : '...'` copy in code.
- Add every new key to **both** `messages/en.json` and `messages/ar.json`, under the feature's page namespace (e.g. `companyPage.usersManagement.*`), with kebab-case leaf keys. Prefer a scoped hook: `useTranslations('companyPage.usersManagement')`.
- Use `Link`, `useRouter`, `usePathname` and `redirect` from `@/i18n/navigation`, not from `next/link` or `next/navigation`.
- Make layouts RTL-safe: use logical classes (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `text-start`, `text-end`) and the `rtl:` variant instead of `ml-*`, `mr-*`, `left-*`, `right-*` or `locale === 'ar'` class ternaries.
- Format dates and numbers based on the active locale.

### UX

- Every data view handles **loading, empty and error** states.
- Buttons show a **pending** state during mutations and prevent double submit.
- Support mobile, keyboard navigation and accessible labels (`label`, `aria-*`).
- Use `sonner` toasts for success and error feedback. Show the toast in the mutation hook (`onSuccess` / `onError`), not in both the hook and the component, and use translated fallback messages.
- For empty and error states, use the shared `EmptyDataState` and `HttpStatusState` components.

### Maintenance and security

- Follow the existing Prettier config (single quotes, Tailwind class sorting) and ESLint config. Format the files you change. Much of the older code isn't formatted yet, so don't reformat unrelated files in the same change. Don't change tool configs as part of a feature.
- Reuse the installed libraries. Don't add a new dependency when an existing one already does the job.
- Never log tokens, secrets or personal data. Remove `console.log` before committing (ESLint doesn't catch it).
- Secrets and environment-specific values (keys, hosts, URLs) come from env variables, not from hardcoded strings.

## 4. Before You Finish

- [ ] Files are in the right place (`app` / `features/<name>/...` / `shared`) and follow the naming rules.
- [ ] Each component has one clear responsibility, and existing components were reused.
- [ ] No `any`, no hardcoded colors, no hardcoded text.
- [ ] New translation keys exist in both `en.json` and `ar.json`.
- [ ] Loading, empty, error and pending states are handled.
- [ ] Query keys and cache invalidation are correct.
- [ ] `npm run lint` and `npx tsc --noEmit` pass for the files you changed (if something fails outside your change, mention it).
- [ ] UI changes were checked in **Arabic and English** and on **mobile**.
