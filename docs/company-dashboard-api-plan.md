# Company dashboard: API plan

Route: `/[locale]/company/dashboard` (for example `http://localhost:3000/en/company/dashboard`).
Page: `src/app/[locale]/company/(sidebar-layout)/dashboard/page.tsx` → `features/company-dashboard/components/CompanyDashboardPage.tsx`.

Sources: Bruno collection `joocare`, folder `Company/Dashboard` (3 requests). The response shapes below come from calling the endpoints with a test company account on 2026-11-22. Bruno has no saved response examples.

Paths: `COMPANY` = `/api/company` (`getCompanyApiUrl()`). Every request sends `Authorization: Bearer <session token>` and `Accept-Language: <locale>`.

## 1. Current state

| Widget on the page      | Data today                                                                             |
| ----------------------- | -------------------------------------------------------------------------------------- |
| Active jobs card        | API `active_jobs`                                                                      |
| Total applications card | API value, but it reads the old flat field. The growth (`+12`) is design data          |
| Latest activity card    | Reads `applications_latest_activity`, which the API no longer returns. Shows "no data" |
| Time to fill            | Design data (`14 days`). The month select only toggles an empty state                  |
| Brand reach             | Design data (`5.2K`, `+12.5%`)                                                         |
| Talent intake           | Reads `cvs_downloaded`, which the API no longer returns. The change % is design data   |
| Category pie            | API `categories_percentage`                                                            |
| Hiring alerts           | Design data                                                                            |
| Active jobs table       | API `my-jobs`, already wired                                                           |
| Recruiters chart        | Design data                                                                            |

- The month options are fixed to Dec 2026 and the 11 months before it.
- Every select starts on `2026-09` (`DASHBOARD_DESIGN_PERIOD`).
- None of the selected months is sent to the API.

`CompanyDashboardApi` in `index.type.ts` describes an older flat response. It needs to be replaced.

## 2. Endpoints

### 2.1 GET `COMPANY/dashboard`

| Query param          | In Bruno                 | Format    | Drives               |
| -------------------- | ------------------------ | --------- | -------------------- |
| `applications_month` | yes                      | `YYYY-MM` | `total_applications` |
| `duration_month`     | yes                      | `YYYY-MM` | `job_duration`       |
| `cv_downloads_month` | yes                      | `YYYY-MM` | `cv_downloads`       |
| `visits_month`       | **no**, found by testing | `YYYY-MM` | `user_visits`        |

- A missing or invalid month falls back to the current month. No error is returned.
- Each block repeats the month it used in `filter_month`.
- `filter_month_label` and `previous_month_label` come back translated by `Accept-Language`: `Nov 2026` in English, `نوفمبر 2026` in Arabic.

```json
{
  "data": {
    "active_jobs": 2,
    "recent_activity": { "count_today": 0, "last_activity_at": null },
    "total_applications": {
      "filter_month": "2026-11",
      "filter_month_label": "Nov 2026",
      "previous_month_label": "Oct 2026",
      "value": 0,
      "previous": 0,
      "growth_rate": 0
    },
    "job_duration": {
      "filter_month": "2026-11",
      "filter_month_label": "Nov 2026",
      "previous_month_label": "Oct 2026",
      "average_hours": 0,
      "average_days": 0,
      "closed_jobs_count": 0
    },
    "cv_downloads": {
      "filter_month": "2026-11",
      "filter_month_label": "Nov 2026",
      "previous_month_label": "Oct 2026",
      "value": 0,
      "previous": 0,
      "growth_rate": 0
    },
    "user_visits": {
      "filter_month": "2026-11",
      "filter_month_label": "Nov 2026",
      "previous_month_label": "Oct 2026",
      "value": 8,
      "previous": 18,
      "growth_rate": -55.56
    },
    "stale_jobs": { "total": 0, "has_more": false, "jobs": [] },
    "categories_percentage": [
      {
        "category_id": 2,
        "category_title": "Nursing",
        "count": 12,
        "percentage": 34.29
      }
    ]
  },
  "message": "Success"
}
```

- `growth_rate` is a percentage that can be negative (`-55.56`).
- `categories_percentage[].percentage` values add up to 100.

### 2.2 GET `COMPANY/dashboard/jobs-by-admin`

| Query param      | Format                                   |
| ---------------- | ---------------------------------------- |
| `month`          | `YYYY-MM`                                |
| `pagination`     | `on` (paginated) or left out (full list) |
| `limit_per_page` | number                                   |
| `page`           | number                                   |

Paginated (`pagination=on`):

```json
{
  "message": "Success",
  "code": 200,
  "data": [{ "admin_id": 1, "admin_name": "samira gamal", "jobs_count": 2 }],
  "current_page": 1,
  "first_page_url": "…?page=1",
  "from": 1,
  "last_page": 1,
  "last_page_url": "…?page=1",
  "next_page_url": null,
  "path": "…/dashboard/jobs-by-admin",
  "per_page": 10,
  "prev_page_url": null,
  "to": 1,
  "total": 1
}
```

Without `pagination`, the response is `{ message, code, data: [...], additionalData: null }`. Admins with no jobs that month are still listed, with `jobs_count: 0`.

### 2.3 GET `COMPANY/my-jobs`

Params: `pagination=on`, `limit_per_page`, `page`. This one is already wired in `useGetCompanyTableJobs`.

```json
{
  "message": "success",
  "code": 200,
  "data": [
    {
      "id": 325,
      "title": null,
      "job_title_id": 416,
      "job_title": {
        "id": 416,
        "title": "Registered Nurse, Intensive Care Unit (ICU)",
        "created_at": "23 April 2026, 9:50 AM",
        "updated_at": "23 April 2026, 9:50 AM"
      },
      "applications_count": 0,
      "views_num": 6,
      "created_at": "17 November 2026"
    },
    {
      "id": 324,
      "title": "TEST - General Support Assistant",
      "job_title_id": null,
      "job_title": null,
      "applications_count": 0,
      "views_num": 11,
      "created_at": "17 November 2026"
    }
  ],
  "current_page": 1,
  "last_page": 1,
  "next_page_url": null,
  "per_page": 10,
  "total": 2
}
```

- Either `title` or `job_title` is set, never both. The current type marks `job_title_id` and `job_title` as always present, which is wrong.
- `created_at` comes back as display text (`"17 November 2026"`), not an ISO date. `formatDashboardDate` passes it to `new Date(...)`, so the result depends on the browser's parser.

## 3. Types

These replace `CompanyDashboardApi`, `DashboardCategory` and `CompanyJob` in `features/company-dashboard/index.type.ts`. The feature already keeps its types in that file, so they stay there.

```ts
export type DashboardMonthFilter = {
  filter_month: string; // YYYY-MM
  filter_month_label: string;
  previous_month_label: string;
};

export type DashboardMonthlyMetric = DashboardMonthFilter & {
  value: number;
  previous: number;
  growth_rate: number; // percent, can be negative
};

export type DashboardJobDuration = DashboardMonthFilter & {
  average_hours: number;
  average_days: number;
  closed_jobs_count: number;
};

export type DashboardRecentActivity = {
  count_today: number;
  last_activity_at: string | null; // format unconfirmed (gap G2)
};

// Item shape unconfirmed: the test account has no stale jobs (gap G1).
export type DashboardStaleJob = {
  id: number;
  title: string;
  created_at: string;
  open_days: number;
};

export type DashboardStaleJobs = {
  total: number;
  has_more: boolean;
  jobs: DashboardStaleJob[];
};

export type DashboardCategory = {
  category_id: number;
  category_title: string;
  count: number;
  percentage: number;
};

export type CompanyDashboard = {
  active_jobs: number;
  recent_activity: DashboardRecentActivity;
  total_applications: DashboardMonthlyMetric;
  job_duration: DashboardJobDuration;
  cv_downloads: DashboardMonthlyMetric;
  user_visits: DashboardMonthlyMetric;
  stale_jobs: DashboardStaleJobs;
  categories_percentage: DashboardCategory[];
};

export type DashboardMonths = {
  applications: string;
  duration: string;
  cvDownloads: string;
  visits: string;
};

export type DashboardAdminJobs = {
  admin_id: number;
  admin_name: string;
  jobs_count: number;
};

export type CompanyJob = {
  id: number;
  title: string | null;
  job_title_id: number | null;
  job_title: { id: number; title: string } | null;
  applications_count: number;
  views_num: number;
  created_at: string;
};

export type DashboardPage<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};
```

`DashboardPage<T>` replaces `DashboardJobsPage`, so the jobs table and the recruiters chart can share it.

## 4. Widget → data map

| Widget             | Period param               | Fields used                                                                   |
| ------------------ | -------------------------- | ----------------------------------------------------------------------------- |
| Active jobs        | none                       | `active_jobs`                                                                 |
| Total applications | `applications_month`       | `total_applications.value`, `growth_rate`, `previous_month_label`             |
| Latest activity    | none                       | `recent_activity.count_today`, `last_activity_at`                             |
| Time to fill       | `duration_month`           | `job_duration.average_days` (meter), `closed_jobs_count` (empty state when 0) |
| Brand reach        | `visits_month`             | `user_visits.value`, `growth_rate`, `previous_month_label`                    |
| Talent intake      | `cv_downloads_month`       | `cv_downloads.value`, `growth_rate`, `previous_month_label`                   |
| Category pie       | none                       | `categories_percentage`                                                       |
| Hiring alerts      | none                       | `stale_jobs.total`, `has_more`, `jobs`                                        |
| Active jobs table  | page                       | `my-jobs`                                                                     |
| Recruiters chart   | `month` on `jobs-by-admin` | `admin_name`, `jobs_count`, `total`                                           |

## 5. Approach to getting the data

### 5.1 Services (`services/`)

All requests move out of hooks and into `services/`. Today the `my-jobs` request sits inside `useGetCompanyTableJobs`; it moves too.

- `company-dashboard-service.ts`
  - `getCompanyDashboardService({ token, locale, months })`
  - Builds `URLSearchParams` from `months` (`applications_month`, `duration_month`, `cv_downloads_month`, `visits_month`).
  - Throws when `!result.ok`.
- `company-dashboard-jobs-service.ts`
  - `getCompanyJobsService({ token, locale, page })` for `my-jobs`.
  - `getJobsByAdminService({ token, locale, month, page })` for `dashboard/jobs-by-admin`.
  - Both read the pagination fields at the top level with one small parser that checks the values (`unknown` → `DashboardPage<T>`), and pass in a fallback page and page size.

### 5.2 Query hooks (`hooks/`, one per query)

| Hook                     | Query key                                                             | Notes                                        |
| ------------------------ | --------------------------------------------------------------------- | -------------------------------------------- |
| `useGetCompanyDashboard` | `['company-dashboard', locale, accountId, months]`                    | `placeholderData: keepPreviousData`          |
| `useGetCompanyTableJobs` | `['company-jobs-table', locale, accountId, page]`                     | already exists; only switches to the service |
| `useGetJobsByAdmin`      | `['company-dashboard-jobs-by-admin', locale, accountId, month, page]` | `placeholderData: keepPreviousData`          |

- `useDownloadCandidateCv` already invalidates `['company-dashboard']`. The new key keeps that prefix, so this keeps working.
- The recruiters key also starts with `company-dashboard`, so the same call refreshes it.

### 5.3 One request with per-card loading

All four month selects feed the same `dashboard` request, so changing one month fetches the whole object again. To keep the other cards from flashing:

1. `useCompanyDashboard` holds one `months` state (`DashboardMonths`). It also holds the recruiters month separately, because that select calls its own endpoint.
2. `keepPreviousData` keeps the last response on screen while the new one loads.
3. A card is loading only when the month it shows differs from the one you picked: `data.total_applications.filter_month !== months.applications`. Each block repeats its month, so nothing else needs tracking.
4. Cards with no period (active jobs, activity, categories, alerts) show a skeleton only on the first load.

### 5.4 Period options

- Build the last 12 months from **today**, not from a fixed 2026 date.
- Every select starts on the current month (`YYYY-MM`).
- Option labels stay local (`Intl.DateTimeFormat`), because the options exist before any response arrives.
- The "vs <month>" text uses the API's `previous_month_label`.
- `previousDashboardPeriod` and `DASHBOARD_DESIGN_PERIOD` stop being used outside the design preview.

### 5.5 Formatting

- Growth: the sign comes from `growth_rate`, using `+` / `−` plus a success or danger token. Don't hard-code `+`.
- Time to fill: show `average_days`. When `closed_jobs_count === 0`, show the "no data for this period" state instead of `0 days`.
- Hiring alerts: show the first jobs from `stale_jobs.jobs`, use `stale_jobs.total` for the count, and show "show more" only when `has_more` is true.
- Recruiters: scale the bars to the highest `jobs_count` on the page instead of a fixed `40`. Hide admins with `jobs_count: 0`, or show the empty state when every count is 0.

### 5.6 Design preview

`?preview=design` keeps working through `constants/dashboard-preview.ts`. Those fixtures will be rewritten in the new `CompanyDashboard` shape. Outside preview mode, no fixture values are read.

### 5.7 Files touched

- `index.type.ts`
- `services/company-dashboard-service.ts`, plus a new `services/company-dashboard-jobs-service.ts`
- `hooks/useGetCompanyDashboard.tsx`, `useCompanyDashboard.ts`, `useGetCompanyTableJobs.tsx`, plus a new `useGetJobsByAdmin.ts`
- `components/CompanyDashboardPage.tsx`, `DashboardHiringAlerts.tsx`, `DashboardRecruitersChart.tsx`, `DashboardTimeToFill.tsx`, `DashboardMetricChange.tsx`
- `constants/dashboard-preview.ts`, `utils/dashboard-format.ts`
- `messages/en.json`, `messages/ar.json` (new empty/period strings only)

## 6. Gaps: missing data and params

### 6.1 Backend (answers 2026-11-22)

| #   | Gap                                                                                                                                                                                       | Status / decision                                                                                                                                                                                                                                                                                                                                          |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G1  | **Hiring alerts = `stale_jobs`** (confirmed). The `jobs[]` item shape is still unknown because the test account returns `[]`. We need the id, title, published date and days open.        | **Open.** Wire `total` / `has_more` now and show the empty state when `total === 0`. Map the item fields once a stale job exists.                                                                                                                                                                                                                          |
| G2  | **`recent_activity.last_activity_at` format** (always `null` on the test account). It feeds the **Recent Activity** card, the third card in the top row, under the number: "2 hours ago". | **Open.** Needed: an ISO 8601 timestamp with timezone, e.g. `2026-11-22T10:15:00+03:00`. The app turns it into "2 hours ago" / "منذ ساعتين" with `Intl.RelativeTimeFormat`. Or the server sends a ready localized string, as with G7. Also, the card description says "Applicants in the last 7 days" but the API gives `count_today`: confirm the period. |
| G3  | `visits_month`                                                                                                                                                                            | **Confirmed.** Works as tested. Add it to Bruno.                                                                                                                                                                                                                                                                                                           |
| G4  | No month for `categories_percentage`, `active_jobs`, `stale_jobs`                                                                                                                         | **Confirmed.** No select for these.                                                                                                                                                                                                                                                                                                                        |
| G5  | What `user_visits.value` counts                                                                                                                                                           | **Answered: counted visits.** Confirm whether the "Unique profile viewers" label stays.                                                                                                                                                                                                                                                                    |
| G6  | What `cv_downloads` counts                                                                                                                                                                | **Decided:** show the count as it is ("CVs downloaded").                                                                                                                                                                                                                                                                                                   |
| G7  | `my-jobs` `created_at` is display text                                                                                                                                                    | **Decided: the server is authoritative.** Show the string as it comes. Don't parse it with `new Date()`.                                                                                                                                                                                                                                                   |
| G8  | `job_duration`: what counts as "closed"                                                                                                                                                   | **Open.** Show `average_days` as returned; empty state when `closed_jobs_count === 0`.                                                                                                                                                                                                                                                                     |
| G9  | `jobs-by-admin` order and 0 rows                                                                                                                                                          | **Confirmed.** Use the server order.                                                                                                                                                                                                                                                                                                                       |
| G10 | Active Jobs page endpoints                                                                                                                                                                | **Resolved.** Uses `COMPANY/statistics/overview` and `COMPANY/statistics/jobs` (section 8).                                                                                                                                                                                                                                                                |
| G11 | Reports banner                                                                                                                                                                            | **Decided:** stays static.                                                                                                                                                                                                                                                                                                                                 |

### 6.2 Frontend (fixed by this plan)

| #   | Gap                                                                                                                                           | Fix                                                                                 |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| F1  | Month selects don't send anything to the API                                                                                                  | Send the 4 dashboard month params plus `jobs-by-admin?month` (§5.3)                 |
| F2  | Period list fixed to 2026, default `2026-09`                                                                                                  | Build it from today; default to the current month (§5.4)                            |
| F3  | Old response type (`cvs_downloaded`, `applications_latest_activity`)                                                                          | New `CompanyDashboard` type (§3)                                                    |
| F4  | Growth values come from design data and always start with `+`                                                                                 | Use the API `growth_rate` with its sign (§5.5)                                      |
| F5  | Time to fill, brand reach, recruiters and alerts read fixtures                                                                                | Wire them to the API (alerts after G1)                                              |
| F6  | The `my-jobs` request lives inside a hook; `CompanyJob` types `job_title` as never null; `ActiveJobRow` parses `created_at` with `new Date()` | Move it to a service; make `job_title` nullable; show `created_at` as returned (G7) |
| F7  | The recruiters bar scale is fixed to `40`                                                                                                     | Scale to the highest count                                                          |

## 7. Order of work

1. Types and services: `dashboard` with months, `jobs-by-admin`, and the `my-jobs` move.
2. `useCompanyDashboard`: months state, period options from today, `keepPreviousData`, per-card loading.
3. Wire the stat cards (applications, activity) and the analytics cards (time to fill, reach, intake).
4. Recruiters chart on `jobs-by-admin`.
5. Hiring alerts on `stale_jobs` (after G1). Until then, show the empty state when `total === 0`.
6. Rewrite the preview fixtures in the new shape.
7. Translations, then `npm run lint` and `npx tsc --noEmit`.

## 8. Active Jobs page (`/[locale]/company/dashboard/active-jobs`)

Opened from **Show more** in the hiring alerts card, or directly by URL. `?preview=design` shows the design data.

### GET `COMPANY/statistics/overview`

No params. Day names come from the server in both languages.

```json
{
  "data": {
    "total_applications": 0,
    "total_jobs": 35,
    "active_jobs": 2,
    "total_views": 17,
    "jobs_per_day": [
      { "day": 1, "name_en": "Sunday", "name_ar": "الأحد", "jobs_count": 0 }
    ]
  },
  "message": "Success"
}
```

### GET `COMPANY/statistics/jobs`

Params: `pagination=on`, `limit_per_page`, `page`. It's a Laravel paginator, like `my-jobs`. `title` is already resolved, and `created_at` is display text from the server.

```json
{
  "data": [
    {
      "id": 325,
      "title": "Registered Nurse, Intensive Care Unit (ICU)",
      "views_num": 6,
      "applications_count": 0,
      "created_at": "17 November 2026, 10:49 AM"
    }
  ],
  "current_page": 1,
  "last_page": 4,
  "per_page": 10,
  "total": 35
}
```

### Widget → data

| Widget                                                        | Source                                                           |
| ------------------------------------------------------------- | ---------------------------------------------------------------- |
| Total jobs / Active jobs / Total applicants / Total job views | `total_jobs`, `active_jobs`, `total_applications`, `total_views` |
| Jobs table (paginated)                                        | `statistics/jobs`                                                |
| Weekly activity chart                                         | `jobs_per_day[].jobs_count`, labelled with `name_en` / `name_ar` |

`ActiveJobsTable` is now presentational. It takes a `DashboardJobsTableState` from `useDashboardJobs` (dashboard, `my-jobs`) or from `useActiveJobsPage` (`statistics/jobs`).
