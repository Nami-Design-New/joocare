# Request Caching and Duplication Audit

## Scope

This document summarizes the request duplication, caching, locale navigation, and `429 Too Many Attempts` issues identified in the Next.js App Router application.

The audit focuses on:

- repeated backend requests
- duplicated server fetches
- locale switching behavior
- settings loading
- job details rendering and metadata
- Firebase foreground notification setup
- public vs authenticated caching boundaries

The app uses:

- Next.js App Router
- locale-prefixed routes such as `/en` and `/ar`
- NextAuth
- Redux
- server and client components
- middleware-based locale handling

## Original Symptoms

### Repeated API calls

The application repeatedly called endpoints such as:

- `/api/setting`
- `/api/user/jobs`
- public job details endpoints used by `/[locale]/jobs/[slug]`

### 429 responses

Repeated calls caused backend rate limiting, especially around:

- `/[locale]/jobs/[slug]`
- `generateMetadata` for job details
- locale switching between Arabic and English

### Full refresh-like behavior on locale switch

Even when users changed language normally, route trees re-executed and several server-side requests ran again.

### Repeated notification setup

`HeaderActionsButtons` remounted frequently and logged notification setup repeatedly, which made debugging harder and suggested duplicate Firebase work.

## Root Causes

### Settings were fetched from too many places

`settingService` was originally called from multiple pages and components, including nested UI surfaces.

Impact:

- unnecessary load on `/api/setting`
- repeated work during route navigation
- additional work during Fast Refresh in development

### Locale switcher forced a refresh

The language toggle used:

```ts
router.replace(...)
router.refresh()
```

`router.refresh()` forced the server tree to refetch after locale navigation.

Impact:

- server component data re-executed
- public routes refetched even when URL change alone was enough
- request counts increased after locale change

### Public job details were not treated as public cached data

The job details service used dynamic `no-store` behavior for public job pages.

Impact:

- duplicate requests for the same slug and locale
- metadata path could fail with `429`
- page load stability degraded during locale switches

### Metadata and page render fetched the same data independently

`generateMetadata` and page render both requested job details.

Impact:

- two calls for the same job in the same request lifecycle
- higher chance of backend throttling
- unstable metadata behavior

### Notification effects ran on remount

The Firebase foreground listener was already guarded at module level, but `HeaderActionsButtons` still logged subscription and permission flow activity on each remount.

Impact:

- noisy logs
- confusion during debugging
- repeated permission request attempts at component lifecycle level

### Auth-sensitive routes prevented full static classification

Some routes still rely on runtime auth and session access, for example:

- `getServerSession(...)`
- `getNextAuthToken()`

Impact:

- build output shows those routes as dynamic (`ƒ`)
- route-level ISR is not achieved for some pages
- internal fetches can still be cached even if route classification remains dynamic

## Fixes Implemented

### Centralized settings fetching

Settings are now fetched only at the highest locale layout:

- `src/app/[locale]/layout.tsx`

Current behavior:

- `settingService(locale)` is called once in the locale layout
- settings are passed into providers as initial state
- Redux hydrates settings for client components
- nested components no longer call the settings service directly

Result:

- removed duplicate `/api/setting` callers
- settings became a single source of truth

### Settings service made cacheable and locale-aware

`settingService` was updated to:

- remain server-side
- require `locale`
- use `cache()`
- use `cache: "force-cache"`
- return `data?.data?.[0] ?? null`
- throw a clear error on failed response

Result:

- public global settings are cached safely
- same-locale settings calls can be shared

### Added in-flight dedupe

A global in-flight dedupe helper was added:

- `src/shared/lib/in-flight-dedupe.ts`

It prevents identical concurrent server requests from hitting the backend twice.

Used for:

- settings requests
- jobs listing requests

Result:

- reduced overlapping duplicate requests
- especially useful during dev re-execution and concurrent render paths

### Locale switch no longer forces refresh

The language toggle now uses:

```ts
router.replace(href, { locale: nextLocale });
```

and no longer calls `router.refresh()`.

Result:

- locale switching remains client navigation
- current path and query are preserved
- avoids unnecessary extra server refresh

### Public job details split from authenticated job details

The job details service was refactored into two paths.

Public cached path:

- cacheable
- uses `force-cache`
- uses `next: { revalidate: 300 }`

Authenticated path:

- remains `no-store`
- preserves token-aware behavior

Result:

- public job content can use ISR semantics
- authenticated state remains dynamic and correct

### Shared cached fetch between page and metadata

`/[locale]/jobs/[slug]` now uses a shared cached function for public job detail data.

Both:

- `generateMetadata`
- page render

use the same cached public fetch.

Result:

- prevents metadata/page duplication for the same slug and locale
- significantly lowers repeated public job-detail calls

### Safer metadata fallback

`generateMetadata` for job details now catches failures and returns fallback metadata instead of crashing the page path.

Result:

- metadata no longer destabilizes the page during backend throttling
- `429` in the metadata path is contained

### Firebase foreground listener stays single-attach

The Firebase foreground listener keeps a module-level guard, so the real listener is attached once.

Additionally, `HeaderActionsButtons` was cleaned up to:

- reduce noisy subscription logs
- avoid repeated permission-request behavior after auth load in the same browser session

Result:

- behavior unchanged
- logs better reflect real duplicate work vs harmless remounts

## Current Route Rendering Reality

### Build output still shows many public routes as `ƒ`

Examples include:

- `/[locale]`
- `/[locale]/about`
- `/[locale]/jobs/[slug]`

This does not automatically mean caching is broken.

### Why this happens

A route can still be marked dynamic if any request-time logic exists in its render tree, such as:

- auth or session checks
- request-bound helpers
- cookie or header dependent logic

### Important distinction

There are two different concerns:

#### Route classification

What Next prints in build output:

- `ƒ` dynamic
- `○` static

#### Fetch caching behavior

Whether internal backend requests use:

- `force-cache`
- `revalidate`
- `no-store`

A route can be `ƒ` and still internally avoid hammering the backend for public data.

## Remaining Constraints

### `/[locale]/jobs/[slug]` is still partly dynamic

Why:

- the page still checks session
- authenticated users need values such as `is_saved` and `is_applied`
- this requires runtime branching

Consequence:

- the route is not fully static at the route level, even though the public data path is cacheable

### Clean future option

If full ISR classification is required for `/jobs/[slug]`, split the page into:

#### Server-rendered public content

- title
- description
- company
- salary
- location
- job metadata

#### Client-side authenticated state

- saved status
- applied status
- save and apply actions

That would let the page itself become static or ISR while user-specific decoration hydrates later on the client.

### Dev mode can still re-execute work

Fast Refresh and development rendering may still run layout, page, and metadata logic more than once.

Consequence:

- some duplicate-looking calls in development are unavoidable

This is different from the original problem:

- before: many duplicated application-level callers
- now: mostly framework and dev re-execution behavior

## Public vs Dynamic Rules Going Forward

### Safe to cache or ISR

Use `revalidate` or `next: { revalidate }` for:

- settings
- home content
- about content
- FAQ content
- public employer content
- privacy and terms content
- public job details

### Must remain dynamic

Keep `no-store` or request-time rendering for:

- candidate dashboard, profile, and settings flows
- company dashboard, profile, and job management flows
- saved jobs
- notification data
- any endpoint depending on auth token or session
- `/api/user/jobs`
- `/api/company/auth/profile`

## Files Most Relevant to This Audit

### Settings

- [src/app/[locale]/layout.tsx](/c:/joocare/src/app/[locale]/layout.tsx)
- [src/shared/services/settings-services.ts](/c:/joocare/src/shared/services/settings-services.ts)
- [src/shared/providers/MainProviders.tsx](/c:/joocare/src/shared/providers/MainProviders.tsx)
- [src/features/settings/store/settings-slice.ts](/c:/joocare/src/features/settings/store/settings-slice.ts)

### Dedupe

- [src/shared/lib/in-flight-dedupe.ts](/c:/joocare/src/shared/lib/in-flight-dedupe.ts)
- [src/shared/lib/request-logging.ts](/c:/joocare/src/shared/lib/request-logging.ts)

### Locale switch

- [src/shared/components/LanguageToggle.tsx](/c:/joocare/src/shared/components/LanguageToggle.tsx)

### Job details caching

- [src/features/jobs/services/job-details-service.ts](/c:/joocare/src/features/jobs/services/job-details-service.ts)
- [src/app/[locale]/(shared-layout)/jobs/[slug]/page.tsx](/c:/joocare/src/app/[locale]/(shared-layout)/jobs/[slug]/page.tsx)

### Notifications

- [src/shared/components/header/HeaderActionsButtons.tsx](/c:/joocare/src/shared/components/header/HeaderActionsButtons.tsx)
- [src/shared/util/firebase-notifications.ts](/c:/joocare/src/shared/util/firebase-notifications.ts)
- [src/shared/hooks/requestNotificationPermission.ts](/c:/joocare/src/shared/hooks/requestNotificationPermission.ts)

## Current Outcome

### Improved

- `429` frequency reduced
- settings duplication removed at application level
- locale switching no longer forces an extra refresh
- public job metadata is safer
- duplicate request pressure is lower
- notification logging is less misleading

### Still true

- some routes remain dynamic in build output
- dev Fast Refresh can still re-execute code
- `/jobs/[slug]` is not fully route-static because of auth-sensitive behavior

## Recommended Next Step

If the goal is to fully stabilize `/[locale]/jobs/[slug]` and potentially convert it to real ISR or static route output, the next refactor should be:

### Split public and user-specific concerns

Server cached:

- public job details payload
- metadata
- SEO image selection
- employer details

Client dynamic:

- saved state
- applied state
- save and apply button logic

That is the cleanest architectural boundary for this app.

## Executive Summary

The major request duplication issues were caused by:

- settings fetched from multiple layers
- forced locale refresh
- duplicated page and metadata job-detail fetches
- noisy remount-side effects in the header

These were addressed with:

- top-level settings fetch and Redux hydration
- in-flight dedupe
- removal of `router.refresh()` from locale switching
- cached public job-detail fetch shared between page and metadata
- safer metadata fallback
- quieter notification setup behavior

The remaining dynamic route classification is now mostly architectural, not accidental.
