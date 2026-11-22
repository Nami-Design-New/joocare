# Company features: work order and candidate impact

Checked on `development` at `9b4033d` (2026-11-22). Sources:

- Screens already built from the Figma design (`src/app/[locale]/company/**`). The Figma file `pXrb5w1hMxXttO9NYSbTjG` could not be opened from the tool account (no access), so the built screens stand in for the design.
- Bruno collection `joocare` (`Company/` and `User/` folders).

## 1. The hiring journey in the design

The company sidebar follows one journey. Each step produces something the candidate sees.

```text
Company                                   Candidate sees
-------                                   --------------
Register → Complete account → Profile ──► Public company page, "About employer" on jobs
Post job (+ questions, + assessment)  ──► Job in /jobs, apply form with screening questions
Pipeline: review applicants           ──► /candidate/applications status (Applied → ...)
Assign assessment                     ──► "Take assessment" link + /candidate/assessment/[id]
Assessment results + notes            ──► Assessment status on the application card
Chat with candidate                   ──► /candidate/chat conversation
Talent database (search, pin, message)──► Profile visit in /candidate/profile-insights, chat
Projects (shortlist, hiring manager)  ──► Interview / shortlist result (needs backend)
Dashboard, recruiter activity          (company only, no candidate output)
Admin users + roles                    (company only, controls who does the above)
```

## 2. Current state

| Area | Data today |
| --- | --- |
| Auth, complete account, account settings, company profile | API |
| Dashboard + active jobs | API (merged in #196) |
| Job management + post job (3 steps) | API |
| Assessment library (categories, assessments, questions) | API |
| Manual assessment assignment | API |
| Candidate takes assessment | API |
| Candidate chat | API |
| Job pipeline (`/company/job/candidates/[slug]`) | Applicants list from API. Screening answers, send message and status actions are preview |
| Assessment results (`/company/assessments-results`) | Preview |
| Company chat (`/company/chat`) | Preview |
| Talent database | Preview |
| Projects + shared review (hiring manager) | Preview |
| Admin users + roles | Preview |
| Recruiter activity | Preview |

## 3. Work order

Pick the next feature by what the candidate gets out of it, then by what is ready in Bruno.

| # | Feature | File | Why this position |
| --- | --- | --- | --- |
| 1 | Job pipeline: applicant review | [01-job-pipeline.md](01-job-pipeline.md) | Closes the apply loop. Without it the candidate only ever sees "Applied" |
| 2 | Assessment results | [02-assessment-results.md](02-assessment-results.md) | Assignment and taking already work; results are the missing end of that flow |
| 3 | Company chat | [03-company-chat.md](03-company-chat.md) | Candidate side is done; company side is the other half of the same conversation |
| 4 | Talent database + pin | [04-talent-database.md](04-talent-database.md) | Endpoints exist; feeds projects and chat |
| 5 | Projects + hiring manager review | [05-projects.md](05-projects.md) | Depends on talent database / pipeline candidates; most backend gaps |
| 6 | Admin users + roles | [06-admin-users-roles.md](06-admin-users-roles.md) | Independent. Can run in parallel with any step |
| 7 | Recruiter activity | [07-recruiter-activity.md](07-recruiter-activity.md) | Needs admins to exist to be meaningful |
| 8 | Company notifications | [08-company-notifications.md](08-company-notifications.md) | Cross-cutting; easier once the events above exist |

## 4. Tracks and owners

| Track | Features | Owner | Plan |
| --- | --- | --- | --- |
| Hiring | Assessment results → company chat → talent database | Unassigned | [hiring-track.md](hiring-track.md) |
| Admin | Admin users + roles → recruiter activity → company notifications | **Mahmoud Abbas** | [admin-track.md](admin-track.md) |

Pipeline status changes and project candidate flows wait on the backend (see files 01 and 05).

## 5. Rules for each feature

- Branch from an up-to-date `development`: `feat/<feature>-api`. PR back into `development`.
- Before wiring, call the GET endpoints with a test account and record the real response shape in the feature file (Bruno has no response examples).
- Replace preview constants with a `services/` function + one hook per query/mutation (`['resource', locale, ...filters]` keys, invalidate after mutations).
- Keep loading, empty, error and pending states. Add `en.json` and `ar.json` keys together.
- When the backend is missing something, write it under "Backend questions" in the feature file instead of faking data.
