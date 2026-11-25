# 4. Talent database + pinned candidates

Route: `/company/talent-database`. Feature: `src/features/company-talent-database` (`useTalentDatabase`, `useSearchCandidates`, `candidates-search-service.ts`).

## Company side

| Part | Today | Endpoint |
| --- | --- | --- |
| Search with filters | API (`feat/company-talent-database-api`) | GET `COMPANY/candidates/search` |
| Filter select options | API: shared lookup hooks + the additional info lookups (`useTalentLookups`) | `Company/candidates-search/selects (new)` (21 lookups) |
| Results search box | API | `search` (added by the backend on 2026-11-25: `search=mohammed` → 72 of 2316) |
| Pin / unpin candidate | Local star state | POST `COMPANY/candidates/{id}/pin` (same pin as the job pipeline star) |
| Pinned list | Preview | GET `COMPANY/candidates/pinned` |
| Message selected candidates | API (`useSendCompanyBulkMessage`) | POST `COMPANY/messages/bulk` |
| Candidate profile page (`/company/candidate-profile`) | Preview (project data) | Check `jobs/useCandidateCvProfile` for reuse |

## Response shapes

Recorded on 2026-11-25 against production with the test company. GET requests only.

### GET `candidates/search?pagination=on&limit_per_page=10&page=1`

Laravel paginator, fields at the top level (same as `company-admins`). 2316 candidates with no filters.

```json
{
  "message": "Candidates retrieved successfully.",
  "code": 200,
  "data": [
    {
      "id": 580,
      "name": "Ibrahim Ahmed",
      "image": "https://admin.joocare.cloud/storage/images/….jpg",
      "nationality": { "id": 1, "name": "أفغانستان" },
      "email": "ahmedehab.eng@gmail.com",
      "phone_code": "+20",
      "phone": "1012345675",
      "ai_score": 100,
      "cv": "https://admin.joocare.cloud/storage/images/….pdf",
      "is_pinned": true
    }
  ],
  "current_page": 1,
  "last_page": 1158,
  "per_page": 2,
  "total": 2316
}
```

- `id` is the user id (the same id `candidates/{id}/pin` takes).
- `nationality` follows `Accept-Language`; `null` when not set. `image`, `email`, `phone_code`, `phone`, `cv`, `ai_score` can be `null`.
- `is_pinned` is returned per row, so the star can read it directly.

### Query params

Names from Bruno `search candidates`. Arrays use `name[]`; languages use `languages[i][language]` / `languages[i][proficiency_level]`.

| Form field | Param | Lookup |
| --- | --- | --- |
| Current / previous job title | `job_title_id`, `previous_job_title_id` | `job-titles` |
| Domain | `domain_id` | `domains` |
| Category | `category_id` | `categories` |
| Specialty, subspecialty | `specialty`, `subspecialty` (text) | None. `specialty_id` / `subspecialty_id` exist too, but the design uses text and there is no subspecialties endpoint |
| Total experience, years in role | `experience_id`, `current_role_experience_id` | `experiences` |
| Seniority | `seniority_level_id` | `seniority-levels` (all levels; filter param is `role_category_id`) |
| Education, certification | `education_level_id`, `mandatory_certification_id` | `education-levels`, `mandatory-certifications` |
| Professional license | `professional_license` | Fixed: `with_medical_license` / `without_medical_license` |
| License country / status / verification | `license_country_id`, `license_status`, `license_verification_status` | `countries`, `license-statuses`, `license-verification-statuses` |
| Languages (3 rows) | `languages[i][language]`, `languages[i][proficiency_level]` | `languages`, `language-proficiency-levels` |
| Relocation | `willing_to_relocate` (1 / 0), `relocation_country_ids[]` (only with yes) | `countries` |
| Driving license | `has_driving_license` (1 / 0), `driving_license_country_ids[]` (only with yes) | `countries` |
| Job titles, work locations, industries | `job_title_ids[]`, `preferred_country_ids[]`, `domain_ids[]` | `job-titles`, `countries`, `domains` |
| Nationality, country, city | `nationality_id`, `country_id`, `city_id` | `countries`, `cities?country_id=` |
| Visa, gender, sponsorship, marital status | `visa_status`, `gender`, `sponsorship_requirement`, `marital_status` | Fixed lists (`{ value, label }`) |
| Salary | `current_salary_min/max`, `current_salary_currency_id`, `expected_salary_*` | `currencies` |
| Employers, employment type | `current_employer`, `previous_employer` (text), `employment_type_id` | `employment-types` |
| Keywords | `keywords[]` | None |
| Status, last active, notice period | `job_search_status`, `last_active`, `availability_id` | `job-search-statuses`, `last-active-options`, `availabilities` |

Checked: every param above changes the result. `search` matches the candidate (added 2026-11-25); `name` and `keyword` (no `s`) are ignored. An invalid enum value returns 422 (`The selected gender is invalid.`).

### POST `messages` (send to one candidate)

`multipart/form-data`: `user_id` (candidate user id), `message`, optional `replied_message_id`, `images[]`. Recorded on 2026-11-25 (test messages sent to candidate 580).

```json
{
  "data": {
    "id": 12,
    "message": "Test message from talent database integration",
    "type": "text",
    "files": [],
    "company_admin_id": 28,
    "user_id": "580",
    "sender_type": "company",
    "receiver_type": "user",
    "created_at": "Today . 09 : 13 am",
    "replied_message_id": null,
    "replied_message": null,
    "is_read": false,
    "updated_at": "just now"
  },
  "message": "Created successfully"
}
```

| Case | Response |
| --- | --- |
| Empty `message`, no image | 422 `Message text or at least one image is required` |
| No `user_id` | 422 `The user is required` |
| Unknown `user_id` | 422 `The selected user id is invalid.` |
| `user_ids[]` | 422 `The user is required`: use `messages/bulk` below |
| 5001 characters | Accepted: no server max length (the dialog limits it to 5000) |

### POST `messages/bulk` (send to several candidates)

JSON `{ "user_ids": [1, 2], "message": "…" }` or multipart (`user_ids[]`, `message`). Recorded on 2026-11-25.

```json
{
  "data": {
    "sent_count": 1,
    "skipped_count": 0,
    "skipped_user_ids": [],
    "messages": [{ "id": 18, "message": "Bulk test from talent database", "user_id": 580, "sender_type": "company" }]
  },
  "message": "Success"
}
```

| Case | Response |
| --- | --- |
| One unknown id among valid ones | 422 `The selected user_ids.1 is invalid.`: nothing is sent |
| Empty `user_ids` | 422 `The user ids field is required.` |
| Empty `message` | 422 `The message field is required.` |

`skipped_count` / `skipped_user_ids` are not used by the page for now.

The messages show up in GET `conversations` (company list, now in Bruno: `user_id`, `name`, `job_title`, `image`, `unread_count`, `status`, `last_message`).

## What the candidate sees

- Viewing a profile should count as a visit in `/candidate/profile-insights` (GET `USER/visits`). Confirm with backend that the company profile view records it.
- A message from here appears in `/candidate/chat`.
- Candidate fields from additional info (`USER/profile-details`) are what the company filters on, so both sides use the same lookups.

## Tasks

1. ✔️ Move filtering to the server; filters become query params; drop `filter-candidates.ts`.
2. ✔️ Load selects from the lookup endpoints.
3. Pin: read `is_pinned` from the search row and share the pin hooks with the job pipeline.

## Backend questions

1. **Filters combine with OR, not AND** (re-checked 2026-11-25, still OR). Adding a filter can grow the result: `experience_id=2` → 14, plus `gender=male` → 16; `keywords[]=nurse` → 9, plus `job_title_id=1` → 16. Every filter should narrow the list (AND).
2. Does opening a candidate profile from the company record a visit?
