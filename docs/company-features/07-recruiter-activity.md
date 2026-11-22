# 7. Recruiter activity

Route: `/company/recruiter-activity`. Feature: `src/features/company-recruiter-activity` (`recruiter-activity-preview-data.ts`).

## Company side

| Part | Today | Endpoint |
| --- | --- | --- |
| Recruiters table (jobs, applicants, activity per admin) | Preview | GET `COMPANY/recruiters-stats` |
| Job count link → filtered jobs | Preview | Check job management filter by admin (dashboard already uses jobs-by-admin) |
| Dashboard recruiters chart | Check against `docs/company-dashboard-api-plan.md` | Same data |

## What the candidate sees

Nothing. Company-only reporting.

## Tasks

1. Call `recruiters-stats`, record the shape, map it to the table columns.
2. Reuse the dashboard jobs-by-admin hook for the job count link.

## Backend questions

- Which columns in the design have no field in `recruiters-stats`?
