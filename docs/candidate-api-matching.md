# Candidate side: backend endpoints vs app

Sources: Bruno collection `joocare` (`User/` and `General/`, last commit 2026-11-16) and the app on `development`.
Paths: `USER` = `/api/user`, `BASE` = `/api`.

The Bruno collection has no response examples. Response shapes in section 6 come from calling the GET endpoints with a test candidate account on 2026-11-17.

## 1. Wired and matching

| Area | Endpoints |
|---|---|
| Auth | login, social-login, logout, forgot-password, verify-otp, reset-password, email/verify, email/confirm, change-password |
| Profile | GET auth/profile, user-bio, auth/update-cv, auth/delete-cv, auth/delete-image |
| Profile sections | user-educations CRUD, user-experiences CRUD, user-skills (list, suggested, add, remove) |
| Credentials | qualifications CRUD, certifications CRUD, user-licenses CRUD |
| Jobs | GET jobs (+ filters), GET jobs/{id}, save/unsave POST jobs/{id}, GET saved-jobs, GET applications |
| Companies | GET companies/{id}, GET companies/{id}/jobs |
| Notifications | list, mark read, mark all read |

## 2. Wired but the request does not match Bruno

| Screen | App sends | Bruno expects | Status |
|---|---|---|---|
| Apply (job details) | FormData `job_id`, `cv`, `screening_answers` (JSON string) | `job_id`, `answers[] {question_id, answer_ids[]}`, `cv` | Fixed on `fix/candidate-api-alignment` (not committed): sends `answers[i][question_id]` / `answers[i][answer_ids][]`, and `JOB_APPLY_PREVIEW_ENABLED = false`. Questions still need backend (Q-B1) |
| Basic info (settings) | `subspecialty_title`, `domain_id`, `category_id` | `subspecialty_id`, `specialty_title`, `experience_title` | Connected (Q-B4 answered) |
| Register | `license` (uploaded path), JSON body | `license_image` and `cv` as files, multipart | Waiting on Q-B5 |
| Education | adds `gpa` | no `gpa` | Waiting on Q-B6 |
| Experience | adds `country_id`, `city_id` | not in Bruno | Waiting on Q-B6 |

## 3. New flows in the app that have matching endpoints

These screens are built in the app but run on sample data. The endpoints exist in Bruno.

| Flow in the app | Matching endpoints | Ready? |
|---|---|---|
| Additional info `/candidate/profile/additional-info` | GET/POST `USER/profile-details` + 19 new lookups (genders, languages, language-proficiency-levels, marital-statuses, visa-statuses, sponsorship-requirements, job-search-statuses, license-statuses, license-verification-statuses, ...) | Yes. Response confirmed. Nationality uses `/countries` (decided 2026-11-17). Professional license is not sent on save for now (Q-B19) |
| Build CV `/candidate/build-cv` + 10-step wizard | GET `USER/cv`, GET `USER/cv/progress`, POST `USER/cv/step-one` ... `step-ten`, POST `USER/cv/upload-cv` | Mostly. No PDF download / delete draft (Q-B9), no nationality / sub-specialty lookups (Q-B8) |
| AI job match `/candidate/ai-job-match` | GET/POST `USER/preferences`, GET `USER/preferences/jobs` | Yes. Preferred companies list stays static until a companies lookup exists (Q-B8) |
| Profile insights `/candidate/profile-insights` | GET `USER/visits` | Yes. Item shape unknown, test account has no visits (Q-B10) |
| Assessment `/candidate/assessment/[id]` | GET `USER/assessments/{id}`, GET `.../start`, POST `.../answer` | Partly. Screen can be wired, but nothing links the candidate to it (Q-B1, Q-B2) |
| Chat `/candidate/chat` | GET/POST `USER/messages` | Partly. Text with one company admin only; no conversation list, attachments or closed state (Q-B11) |
| Notifications (header drawer) | DELETE `USER/notifications/{id}`, POST `USER/store-token`, POST `USER/remove-token` | Yes. Delete + push token on login/logout |

## 4. Flows with no endpoint

| Flow | Needed |
|---|---|
| CV match ATS `/candidate/cv-match-ats` | Upload/analyze CV and return score + optimization points (Q-B12) |

## 5. Endpoints no screen uses yet

| Endpoint | Note |
|---|---|
| GET `USER/my-skills` | Looks like a duplicate of `user-skills` (Q-B13) |
| GET `USER/home` | Candidate home content; the app uses `BASE/home` (Q-B13) |
| GET `USER/auth/update-profile/form-data` | Lookup lists for the basic info form (Q-F1) |

## 6. What the GET endpoints actually return

Only read-only GET requests were called. Skipped because they change data: `assessments/{id}/start`, `notifications/{id}`, `read-all/notifications`.

- **Job details `GET USER/jobs/{id}`** (all 41 jobs): no `screening_questions`, `assessment`, `skills`, `mandatory_certifications`, `created_by`. Returns `education_levels`, `professional_license`, `availability`, `role_category`, `seniority_level`.
- **Applications `GET USER/applications`:** `{id, user_id, job_id, job, cv, created_at}`. No application status, no assessment status.
- **Profile `GET USER/auth/profile`:** has `specialty_id`, `specialty_title`, `experience_id`, `experience_title`, `job_title_id`, `title`, `licenses`, `certifications`, `qualifications`, `educations`, `experiences` (responsibilities as `{id, description}`), `skills`, `hiring_readiness_score`, `missing_score_items`. No `subspecialty_*`, `domain_id`, `category_id`.
- **`GET USER/auth/update-profile/form-data`:** `jobTitles`, `countries`, `cities`, `specialties`, `experiences`, titles as `{en, ar}` objects.
- **`GET USER/profile-details`:** grouped: `occupational`, `qualifications`, `languages`, `mobility`, `career_preferences`, `clinical_privileges`, `personal_details`, `salary`. Save takes flat fields, so the form needs a mapper both ways.
- **New selects:** `{data: [{value, label}]}`, no pagination.
- **`GET USER/preferences`, `GET USER/preferences/jobs`, `GET USER/cv`:** 404 with `data: []` when nothing is saved yet. Treat as empty state.
- **`GET USER/cv/progress`:** `{current_step, completed_steps[], steps: {"1": {completed, missing[]}, ...}}`.
- **`GET USER/visits`, `GET USER/messages`:** Laravel pagination, no records on the test account.
- **Missing lookups:** `/nationalities`, `/sub-specialties`, `/companies` return 404.

- **`POST USER/profile-details`** (tested 2026-11-17 with the test candidate, then restored):
  - Updates only the fields it receives; fields not sent keep their value (total `experience_id` and `domain_id` are safe).
  - An empty value clears a field: `gender=` for single values and `relocation_country_ids=` (no `[]`) for lists. `relocation_country_ids[]=` (empty item) is rejected.
  - Returns the saved details in the same shape as the GET.
  - Bruno's example proficiency `advanced` is invalid; valid levels are `basic`, `intermediate`, `fluent`, `native`.
  - `license` comes back as `{id, number, country, status, verification_status}`; languages as `{language: {value, label}, proficiency_level: {value, label}}`; clinical privileges as `{id, title}`; salaries as `"5000.00"`.

## 7. Open questions

### Backend team

| # | Question | Blocks |
|---|---|---|
| Q-B1 | Candidate `GET jobs/{id}` returns no `screening_questions`, `assessment`, `skills` or `mandatory_certifications`, although employers set them when posting. Can you add them? For questions we need `id`, `question`, `type`, `required` and options with `id`. | Apply questions, assessment link, job details cards |
| Q-B2 | `GET applications` has no application status and no assessment status (pending / completed / expired + assessment id). Will it be added? | Applications status block, link to assessment |
| Q-B3 | For yes/no questions, what goes in `answer_ids[]`: option ids, or `yes` / `no`? | Apply submit |
| Q-B4 | **Answered (2026-11-18).** `GET auth/profile` returns `subspecialty_title` and `domain` / `category` as `{id, title}` objects (`domain_id` / `category_id` come back `null`, so the frontend reads the object id). Basic info sends `subspecialty_title`, `domain_id` and `category_id` to `POST auth/update-profile`. | Basic info form, profile side panel |
| Q-B5 | Register: does it accept `cv` and `license_image` as uploaded paths (`images/...`) like other endpoints, or only as files? Is the field `license` or `license_image`? | Register |
| Q-B6 | Should education accept `gpa`, and experience accept `country_id` / `city_id`? The app sends them today. | Education, experience modals |
| Q-B7 | Is it intended that `preferences`, `preferences/jobs` and `cv` return 404 when empty? A 200 with empty data would be easier. | AI job match, Build CV |
| Q-B8 | Can you add lookups for sub-specialties and companies (for preferred companies)? Nationality: decided to use `/countries`, so `nationality_id` is a country ID; please confirm the backend accepts that. | Additional info, Build CV, AI job match |
| Q-B9 | Build CV: is there an endpoint to download the generated CV as PDF and to delete a draft? | Build CV landing |
| Q-B10 | What does one item in `GET visits` look like, and does it support `search` by company name? | Profile insights |
| Q-B11 | Chat: is there an endpoint for the conversation list, attachments, and closing a conversation? What is `company_admin_id` and where does the candidate get it? | Chat |
| Q-B12 | Is there or will there be an endpoint for CV match ATS? | CV match ATS |
| Q-B13 | Are `my-skills` vs `user-skills`, `qualifications` vs `user-educations`, and `USER/home` vs `BASE/home` duplicates? Which should the app use? | Cleanup |
| Q-B14 | Languages are display names in CV step 1 but codes (`ar`/`en`) in `profile-details`; responsibilities are objects in CV step 7 but strings in `user-experiences`. Which format is correct? | Build CV, Additional info |
| Q-B15 | `assessments/{id}/start`, `notifications/{id}` (mark read) and `read-all/notifications` change data over GET. Can they become POST? | Assessment, notifications |
| Q-B16 | In Bruno, `email/confirm` uses the company token, and `verify-otp` / `reset-password` send a bearer token before login. Are these needed? | Auth (Bruno cleanup) |
| Q-B17 | **Answered (2026-11-18).** Additional info sends the Basic info category as `category_id` to `GET seniority-levels`. On 2026-11-18 admin.joocare.cloud still returned all 25 levels for every `category_id`; confirm the filter is deployed. | Additional info seniority filtering |
| Q-B18 | How should custom certifications be saved alongside `mandatory_certification_ids[]`? | Additional info custom certifications |
| Q-B19 | **Answered (2026-11-18).** The professional license is a choice from `GET /primary-licenses` (`{ id, title }`, search and pagination). Additional info sends `primary_license_id` to `POST USER/profile-details` (replacing `license_number`), and the response returns `qualifications.license.primary_license` as `{ id, title }`. | Additional info professional license |
| Q-B20 | How should multiple sponsorship requirements be submitted and returned? Bruno documents one `sponsorship_requirement`. | Additional info sponsorship multi-select |
| Q-B21 | License country is now a multi-select in the design. How should several countries be submitted and returned? Bruno documents one `license_country_id`. The field also has an "Other" choice that sends a free-text country name: which field should carry it? | Additional info license country |
| Q-B22 | Does `GET /primary-licenses` search by country as well as license name? (Titles include the country, e.g. "DHA (Dubai Health Authority) - Dubai, UAE".) | Additional info professional license search |
| Q-B23 | **Religion (agreed; endpoint not deployed yet).** Agreed with backend (2026-11-18): `GET /religions` returns `{ id, title }` items with `search` and pagination (`pagination=on`, `limit_per_page`, `page`), like `/countries`; `POST USER/profile-details` accepts `religion_id` (empty clears); `GET USER/profile-details` returns `personal_details.religion` as `{ id, title }` or `null`. Field name `religion_id` and the `{ id, title }` response confirmed by backend. | Additional info personal details, profile side panel |

### Product / design

| # | Question | Blocks |
|---|---|---|
| Q-P1 | Until the backend sends screening questions and assessments, is it OK that apply goes straight to the CV step with no questions? | Apply |
| Q-P2 | Chat design has a conversation list, attachments and closed state. Ship text-only first, or wait for the full backend? | Chat |
| Q-P3 | CV match ATS has no backend. Hide it, show "coming soon", or keep the preview? | CV match ATS |
| Q-P4 | Should sub-specialty, domain and category stay on the basic info form? | Basic info |

### Frontend (us)

| # | Question | Blocks |
|---|---|---|
| Q-F1 | Use `auth/update-profile/form-data` for the basic info dropdowns instead of separate lookup calls? | Basic info |
| Q-F2 | Push notifications: send the FCM token on login and remove it on logout. Confirm the VAPID key setup per environment. | Notifications |

## 8. Implementation plan

### Scope and working approach

- In scope: candidate profile and settings, notifications, AI match preferences, CV builder, profile insights, chat and CV match ATS, subject to the decisions below.
- Out of scope: job applications, assessments and job listings, including AI match job results. Keep the findings above for reference; they are not implementation tasks in this plan.
- Before each feature, fetch and fast-forward `development` from `origin/development`, then create its feature branch from that updated `development`. Use one focused PR per branch. Branch names below are proposals unless already created.
- The current `fix/candidate-api-alignment` branch has uncommitted changes, including application changes and a separate `package.json` edit. Preserve them; do not carry them into feature branches without reviewing ownership and scope. Preserve this untracked document when switching branches.
- The API observations above are a dated baseline, not a guarantee of current behavior. Recheck each relevant contract and existing implementation before editing. Do not use sample values as real user data.
- Follow `docs/RULES.md`: inspect the nearest implementation and shared components, keep API calls in services and queries/mutations in hooks, use translated English and Arabic text, and handle loading, empty, error and pending states. Run `npm run lint` and `npx tsc --noEmit` as appropriate, report pre-existing failures, and manually verify the relevant flow in both locales when feasible. Do not commit unless requested.

### 1. Additional info — first

**Branch:** `feat/candidate-additional-info-api`  
**Endpoints:** GET/POST `USER/profile-details` and supported lookup endpoints.

- Inspect the existing form, schema and preview data, and verify current response and save contracts.
- Map the grouped response into form values and form values back to the flat request. Preserve fields the user did not edit where the API contract requires it.
- Connect lookups and save with query invalidation; replace preview data for supported fields. Handle initial data, validation, save errors and pending state.
- Verify loading an existing profile, editing and saving, reloading persisted values, and empty/error states. Cover mapping with focused tests if needed.
- **Decided:** nationality uses `/countries`; the professional license is not sent on save until Q-B19 is answered.
- **Open:** Q-B14 language format. Do not invent lookup data or silently discard unsupported fields; confirm behavior with backend/product.

### 2. Notifications

**Branch:** `feat/candidate-notifications`  
**Endpoints:** notification list/read/delete; `USER/store-token`, `USER/remove-token`.

- Inspect existing notification service, delete hook and drawer before adding anything. Wire deletion only if it is not already complete, and invalidate/update the list after success.
- Verify delete success and failure, unread counts, empty and loading states. Confirm Q-B15 on state-changing GETs with backend.
- Treat push registration as a separate deliverable within this feature: check existing Firebase setup, permission handling and token lifecycle. Confirm VAPID/environment configuration (Q-F2) before enabling; verify login, logout and denied permissions without blocking normal use.

### 3. AI job match preferences

**Branch:** `feat/candidate-match-preferences-api`  
**Endpoints:** GET/POST `USER/preferences`.

- Inspect the existing form and API contract; map and save supported preferences, invalidate after save, and treat the documented empty 404 as empty only when its response confirms that case.
- Verify first use, edit, save, reload and errors. Resolve preferred company lookup with backend (Q-B8); do not present static companies as real API data.
- Job recommendations and result cards are outside scope; leave their implementation unchanged.

### 4. Build CV

**Branch:** `feat/candidate-cv-builder-api`  
**Endpoints:** GET `USER/cv`, `USER/cv/progress`, POST steps 1–10 and `USER/cv/upload-cv`.

- Inventory each step's current fields and request shape against Bruno and the live read response. Implement step by step using existing shared fields and hooks, preserving saved progress and treating the documented empty 404 correctly.
- Verify each step's validation, save and resume, navigation, upload, failures and final persisted data. Confirm language and responsibility formats (Q-B14).
- **Open:** nationality/sub-specialty lookups (Q-B8) and PDF download/delete draft (Q-B9). Do not imply these are supported until confirmed.

### 5. Profile insights

**Branch:** `feat/candidate-profile-insights-api`  
**Endpoint:** GET `USER/visits`.

- Confirm a populated visit response and search/pagination behavior with backend (Q-B10); the prior test account had no records.
- Map actual records and connect pagination/search only where supported. Verify populated, empty, loading and error states. Do not invent a visit schema.

### 6. Candidate profile and account contract fixes

**Branches:** `fix/candidate-basic-info-api`, `fix/candidate-registration-api`, `fix/candidate-education-experience-api`.

- Basic info: reconcile returned and submitted fields, and investigate the form-data endpoint (Q-B4, Q-F1). Ask product whether the disputed fields should remain (Q-P4).
- Registration: confirm file versus uploaded-path contract and license field name (Q-B5), then verify registration with appropriate test data.
- Education and experience: confirm GPA and location fields (Q-B6), then verify create/edit/reload without losing supported values.
- Keep each fix on its own branch and validate translations, request errors and persistence. Do not remove fields or change contracts based on assumptions.

### 7. Chat

**Branch:** `feat/candidate-chat-api`  
**Endpoints:** GET/POST `USER/messages`.

- Confirm conversation discovery, `company_admin_id`, attachments and closed state with backend (Q-B11), and agree the text-only scope with product (Q-P2).
- Once resolved, connect the agreed flow and verify message loading, sending, empty and failure states. Avoid linking chat to excluded job flows as part of this plan.

### 8. CV match ATS

**Branch:** `feat/candidate-cv-match-ats`.

- Blocked pending the API contract (Q-B12) and product decision on the interim UI (Q-P3). Once available, define upload, results, errors and privacy expectations, then implement and verify the agreed flow.

### Decisions to obtain

- **Backend:** Q-B4–Q-B11 and Q-B14–Q-B15, plus Q-B12 for ATS. Ask for example responses with sensitive data removed where a populated example is missing.
- **Product/design:** Q-P2–Q-P4 and the treatment of unavailable lookups and unsupported CV actions.
- **Frontend/infrastructure:** Q-F1–Q-F2, including push configuration. No external messages have been sent.
