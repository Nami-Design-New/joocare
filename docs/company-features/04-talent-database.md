# 4. Talent database + pinned candidates

Route: `/company/talent-database`. Feature: `src/features/company-talent-database` (`useTalentDatabasePreview`, `talent-preview-data.ts`).

## Company side

| Part | Today | Endpoint |
| --- | --- | --- |
| Search with filters | Preview, filtered on the client (`utils/filter-candidates.ts`) | GET `COMPANY/candidates/search` (languages, gender, ... as query params) |
| Filter select options | Constants | `Company/candidates-search/selects (new)` (21 lookups) |
| Pin / unpin candidate | Preview | POST `COMPANY/candidates/{id}/pin` |
| Pinned list | Preview | GET `COMPANY/candidates/pinned` |
| Message candidate | Preview dialog | POST `COMPANY/messages` (see [03](03-company-chat.md)) |
| Candidate profile page (`/company/candidate-profile`) | Preview (project data) | Check `jobs/useCandidateCvProfile` for reuse |

## What the candidate sees

- Viewing a profile should count as a visit in `/candidate/profile-insights` (GET `USER/visits`). Confirm with backend that the company profile view records it.
- A message from here appears in `/candidate/chat`.
- Candidate fields from additional info (`USER/profile-details`) are what the company filters on, so both sides must use the same lookups.

## Tasks

1. Move filtering to the server; filters become query params; drop `filter-candidates.ts`.
2. Load selects from the lookup endpoints (`useInfiniteLookup` where lists are long).
3. Pin mutation with invalidation of both search and pinned queries.

## Backend questions

- Does opening a candidate profile from the company record a visit?
- Response shape of `candidates/search` (check against the table columns).
