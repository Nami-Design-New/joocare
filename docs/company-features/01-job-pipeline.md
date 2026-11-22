# 1. Job pipeline: applicant review

Route: `/company/job/candidates/[slug]` (+ `/filters`). Feature: `src/features/jobs/components/pipeline`.

## Company side

| Part | Today | Endpoint |
| --- | --- | --- |
| Applicants list + filters | API (`useGetApplicationsCandidates`) | GET `COMPANY/applications/{jobId}` |
| Download CV + count | API | POST `COMPANY/increment_downloads/{id}` |
| Screening answers of an applicant | Preview (`CANDIDATE_ANSWERS_PREVIEW`) | Not in Bruno. Check if `applications/{jobId}` items include answers |
| Send message from pipeline | Preview (`previewSendMessage`) | POST `COMPANY/messages` (see [03](03-company-chat.md)) |
| Move applicant (shortlist / reject / hire) | Not built against API | **No endpoint in Bruno** |
| AI talent match tab | Preview | No endpoint |
| Assign assessment to applicant | API (manual assign) | POST `COMPANY/assign-assessment/{id}` |

## What the candidate sees

`/candidate/applications` → `ApplicationStatus.tsx`.

- Today it always shows **Applied** + date.
- The assessment line (`pending` / `completed` / `expired` + "Take assessment" link) is built but commented out, waiting for the applications API to return it.
- Once the company can change an applicant's status, the card should show that status (for example under review, shortlisted, rejected). The design labels need confirming against the Figma file.

## Tasks

1. Call GET `COMPANY/applications/{jobId}` and GET `USER/applications` with test accounts; record the shapes here.
2. Wire screening answers from the real response; delete the preview constant.
3. Wire send message to the company chat mutation.
4. After the backend adds status change: add a mutation hook, invalidate the applicants query, show the status on the candidate card.
5. Un-comment and wire the assessment line in `ApplicationStatus.tsx` when `USER/applications` returns assessment data.

## Backend questions

- Endpoint to change an application's status, and the list of statuses.
- Do `USER/applications` items return the application status and the assigned assessment (id, status, link)?
- Where do the applicant's screening answers come from?
