# 2. Assessment results

Routes: `/company/assessments-results`, `/company/assessments-results/[assessmentId]/[candidateId]`, `/company/assessments/[categoryId]/[assessmentId]/external-invitations(/[candidateId])`. Feature: `src/features/company-assessments/components/results`.

## Company side

| Part | Today | Endpoint |
| --- | --- | --- |
| Results list (filter by category / assessment) | Preview (uses project and talent preview data) | GET `COMPANY/assessment-results?assessment_category_id&assessment_id` |
| One candidate's result | Preview | GET `COMPANY/assessment-results/{id}` |
| Result notes | Preview | POST / PUT / DELETE `COMPANY/assessment-result-notes` |
| Invite by email (external) | Check | POST `COMPANY/assign-assessment-by-email/{id}` |

## What the candidate sees

- `/candidate/assessment/[id]` already submits; after submit the status is `under_review`, `score` and `is_passed` are `null` (see `docs/job-post-apply-assessment-api-audit.md`).
- On `/candidate/applications` the assessment line should move from **Assessment pending** to **Assessment completed** (or **expired**). Notes are company-only.
- Candidate does not see the score unless the design shows it — confirm in Figma.

## Tasks

1. Call both GET endpoints with the test company (assessment 5, candidate 580 already submitted) and record shapes.
2. Replace preview imports from `company-projects` and `company-talent-database` in the results page with a service + hooks.
3. Wire notes CRUD with invalidation.
4. Wire external invitation by email if not already done.

## Backend questions

- When are `score` / `is_passed` filled (auto-graded or after review)?
- Is there a candidate-facing list of assigned assessments? (`GET USER/assessments` returned 404.)
