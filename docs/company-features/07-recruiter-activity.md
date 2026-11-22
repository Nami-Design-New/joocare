# 7. Recruiter activity

Route: `/company/recruiter-activity`. Feature: `src/features/company-recruiter-activity` (`recruiter-activity-preview-data.ts`).

## Company side

| Part | Today | Endpoint |
| --- | --- | --- |
| Recruiters table (open / closed / draft jobs, projects per recruiter) | Preview | GET `COMPANY/recruiters-stats?pagination=on&limit_per_page&page` |
| Recruiter filter (dropdown above the table) | Preview, filtered on the client | **No filter param** on `recruiters-stats` |
| Job count link → job management filtered by recruiter and status | Links with the recruiter **name** (`?recruiter=<name>&status=`) | GET `COMPANY/jobs?admin_id={id}&status=` works |
| Projects count link → projects filtered by recruiter | Links with the recruiter name | Projects are still preview (hiring track); no recruiter filter checked |
| "Deleted" badge on a recruiter | API | `is_deleted` on each row (local backend, 2026-11-22) |
| Dashboard recruiters chart | API (`dashboard/jobs-by-admin`) | Not part of this page |

## Response shapes

Recorded on 2026-11-22 against production with the test company (id 69). GET requests only.

### GET `recruiters-stats?pagination=on&limit_per_page=10&page=1`

Laravel paginator, fields at the top level, same as `company-admins`.

```json
{
  "message": "Success",
  "code": 200,
  "data": [
    {
      "id": 36,
      "name": "Mahmoud  Recruiter",
      "is_deleted": false,
      "open_jobs": 0,
      "closed_jobs": 0,
      "draft_jobs": 0,
      "projects": 0
    }
  ],
  "current_page": 1,
  "first_page_url": "…/recruiters-stats?page=1",
  "from": 1,
  "last_page": 1,
  "last_page_url": "…/recruiters-stats?page=1",
  "next_page_url": null,
  "path": "…/recruiters-stats",
  "per_page": 10,
  "prev_page_url": null,
  "to": 1,
  "total": 1
}
```

- `id` is the company admin id (same id as in `company-admins`).
- Only admins with role `recruiter` are returned. The company has 3 admins (recruiter 36, admin 32, recruitment manager 1); only 36 is listed.
- Nothing is translated (`name` is free text).
- `is_deleted` was added by the backend on 2026-11-22 (seen on the local server, not yet on production). The frontend treats a missing value as `false`.
- Without `pagination=on`: `{ message, code, data: [...], additionalData: null }`, all recruiters at once.
- Query params checked, all **ignored**: `search`, `name`, `role`, `id`, `admin_id`, `company_admin_id`, `recruiter_id`.

### GET `jobs?admin_id={id}&status=…` (job management list)

Each job has `admin` (the company admin who posted it, same object as a `company-admins` item) or `admin: null`.

| Param | Works | Notes |
| --- | --- | --- |
| `admin_id` | Yes | `admin_id=1` → 3 jobs, `admin_id=36` → 0, `admin_id=999` → 0 |
| `recruiter`, `recruiter_id`, `company_admin_id` | No | Ignored (returns all 36 jobs) |
| `status` | Yes | `open`, `closed`, `draft`, `all`; combines with `admin_id` |

33 of the 36 test jobs have `admin: null` (posted before admins existed, or by the company account).

## Mapping to the current UI

| UI field (`RecruiterActivity`) | API field | Notes |
| --- | --- | --- |
| `id` | `id` | Number in the API; the UI uses a string slug today |
| `name` | `name` | |
| `jobs.open` | `open_jobs` | |
| `jobs.closed` | `closed_jobs` | |
| `jobs.draft` | `draft_jobs` | |
| `projects` | `projects` | |
| `isDeleted` | `is_deleted` | Missing → `false` |

## Gaps

### Frontend (we fix)

1. Table rows, total and paging come from `recruiters-stats`; remove `recruiter-activity-preview-data.ts` (it also imports project preview data from another feature).
2. Job count links use the recruiter **id**: `/company/job-management?recruiter={id}&status=…`.
3. Job management (`features/jobs`) sends the recruiter as `admin_id` instead of `recruiter`, and its recruiter filter options come from the API instead of `RECRUITER_FILTER_PREVIEW`. Options: `company-admins` (every admin can post jobs) — see decision below.
4. The "Deleted" badge reads `is_deleted`.
5. Loading, error and empty states on the page (empty today only).

### Decisions (2026-11-22)

1. **Recruiter filter**: the page sends `admin_id` to `recruiters-stats`; the backend adds support for it. Dropdown options come from `recruiters-stats` without paging.
2. **Projects link**: show the count and keep the link to `/company/projects`.
3. **Job management recruiter options**: only recruiters, exactly what `recruiters-stats` returns. Job management sends the selected id as `admin_id`.
4. **Deleted badge**: shown from `is_deleted`, which the backend added.

### Backend questions

1. Should `recruiters-stats` include every admin who can post jobs (admin, recruitment manager) or only role `recruiter`?
2. Add `admin_id` to `recruiters-stats` (the frontend already sends it).
3. Jobs with `admin: null`: which recruiter do they count for, if any?

## What the candidate sees

Nothing. Company-only reporting.

## Tasks

1. Service + types + `useGetRecruitersStats` hook (`['recruiters-stats', locale, page]`).
2. Page: API rows, paging, loading / error / empty states.
3. Job count link with the recruiter id; job management sends `admin_id` and loads recruiter options from the API.
4. Recruiter filter (`admin_id`) and deleted badge (`is_deleted`).
