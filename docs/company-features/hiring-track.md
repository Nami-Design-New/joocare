# Hiring track

Owner: **unassigned**

Assessment results → company chat → talent database. Each step is one branch from `development` and one PR back into it.

## 1. Assessment results — `feat/company-assessment-results-api`

Details: [02-assessment-results.md](02-assessment-results.md)

| Page | Route | Component | Endpoints |
| --- | --- | --- | --- |
| Results list | `/company/assessments-results` | `company-assessments/components/results/AssessmentResultsPage` | GET `assessment-results` (category, assessment filters) |
| One candidate's result | `/company/assessments-results/[assessmentId]/[candidateId]` | `results/CandidateAssessmentPage` | GET `assessment-results/{id}`, `assessment-result-notes` CRUD |
| External invitations list | `/company/assessments/[categoryId]/[assessmentId]/external-invitations` | `assessments/ExternalInvitationsPage` | POST `assign-assessment-by-email/{id}` (list endpoint to check) |
| External candidate's result | `.../external-invitations/[candidateId]` | `results/CandidateAssessmentPage` | Same as one candidate's result |

Candidate side: nothing new. `/candidate/assessment/[id]` already submits. Test data: assessment 5, candidate 580.

## 2. Company chat — `feat/company-chat-api`

Details: [03-company-chat.md](03-company-chat.md)

| Page | Route | Component | Endpoints |
| --- | --- | --- | --- |
| Chat | `/company/chat` | `chat/components/CompanyChatPage` + `useCompanyChat` | GET `messages?user_id=`, POST `messages` |
| Send message from applicants list | `/company/job/candidates/[slug]` | `jobs/components/pipeline/PipelineCandidatesTab` (`previewSendMessage`) | POST `messages` |

Candidate side: test with `/candidate/chat` (already on the API).
Blocked: company conversation list endpoint.

## 3. Talent database — `feat/company-talent-database-api`

Details: [04-talent-database.md](04-talent-database.md)

| Page | Route | Component | Endpoints |
| --- | --- | --- | --- |
| Talent search | `/company/talent-database` | `company-talent-database/components/TalentDatabasePage` | GET `candidates/search`, lookups in `candidates-search/selects` |
| Pin / pinned | Same page | `TalentCandidatesTable` | POST `candidates/{id}/pin`, GET `candidates/pinned` |
| Message candidate | Dialog | `TalentMessageDialog` | POST `messages` (from step 2) |
| Candidate profile | `/company/candidate-profile` | `company-projects/components/candidate-profile/ProjectCandidateProfilePage` | Check reuse of `jobs/useCandidateCvProfile` |

Candidate side: a profile view should show in `/candidate/profile-insights` (confirm with backend).

## Backend questions

- When are `score` / `is_passed` filled on an assessment result?
- Company conversation list endpoint.
- Does a company profile view record a candidate visit?
