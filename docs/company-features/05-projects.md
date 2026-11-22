# 5. Projects + hiring manager shared review

Routes: `/company/projects`, `/company/projects/[projectId]`, `/company/shared-projects/[projectId]`, `/hiring-manager/shared-projects/[projectId]`, `/hiring-manager/create-password`. Feature: `src/features/company-projects` (all preview: `project-preview-data.ts`, `shared-review-preview-data.ts`, `candidate-profile-preview-data.ts`).

## Company side

| Part | Today | Endpoint |
| --- | --- | --- |
| Projects list / create / update / delete | Preview | GET / POST / POST `{id}` / DELETE `COMPANY/projects` (store body is only `name`) |
| One project | Preview | GET `COMPANY/projects/{id}` |
| Add candidates to a project | Preview | **Not in Bruno** |
| Shortlist / reject candidate | Preview | **Not in Bruno** |
| Schedule interviews (`schedule-interviews-schema.ts`) | Preview | **Not in Bruno** |
| Share project with hiring manager + review | Preview | **Not in Bruno** |
| Close project | Preview | Check `update project` |

## What the candidate sees

Per the design: being shortlisted and an interview invite (date, time, method, note). Nothing on the candidate side shows this yet. It most likely arrives as a notification and/or an application status — needs a decision with backend and design.

## Tasks

1. Wire projects CRUD now (it is the only part ready).
2. Keep the rest on preview data until the backend endpoints exist; list them in the questions below.

## Backend questions

- Endpoints for: project candidates (add / remove / list), shortlist / reject, schedule interview, share with hiring manager, hiring manager review submit.
- How does the candidate get told about shortlist / interview (notification type, application status)?
