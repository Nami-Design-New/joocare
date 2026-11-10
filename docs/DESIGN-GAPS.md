# Joocare — Design Gaps (Figma vs Code)

The single list of what is still missing from the design. It replaces the old files (`PHASE-2-README.md`, `EMPLOYER-TODO.md`, `PROJECTS-REVIEW.md`, `PHASE_2_CANDIDATE_DESIGN_GAPS.md`).

- **Figma:** `joocare (Copy)` · fileKey `pXrb5w1hMxXttO9NYSbTjG` · page **"02 — Joocare Platform — Phase 2"** (462 top-level nodes; the 265 screens/modals were compared after excluding components, decorations and QA frames).
- **Audit date:** 2026-11-10, branch `development`.
- **Method:** every frame was matched against the routes, components and `messages/*.json`. Items marked "visual check" need a side-by-side comparison in the browser.
- **Code rules:** [RULES.md](RULES.md).

**Legend:** 🔴 Not built · 🟠 Built, but differs from Figma · ❓ Needs a decision before building · 🔌 UI ready, needs API

---

## 1. Remaining design work — Candidate & public pages

| | Item | Figma | Current state | Required |
|---|---|---|---|---|
| 🟠 | **Assessment status on the Applied card** | `candidate/job-applications/applied` 10086:83598 | The block (Pending / Completed / Expired + Take Assessment) is **commented out** in `jobs/components/candidate/ApplicationStatus.tsx` | Enable it and link "Take Assessment" to `/candidate/assessment/{id}`. It completes the apply → "Later" flow. Needs the assessment field from the applications API (mock it until then). |
| 🔴 | **"Saved successfully" modal after saving a job** | `modal/save-success` 10086:91248 | Saving is a silent toggle (`useToggleSavedJob.ts`) | Show the success modal (check + confetti, close only) after saving. |
| 🟠 | **License card: "Issued in" country chips** | `professional-credentials/licenses` 10086:83308 | `LicenseCard.tsx` shows one country as plain text | "Issued in:" followed by several green country chips (mock data until the API returns several countries). |
| 🟠 | **Certificate card: country** | `professional-credentials/certificates` 10086:83360 | The card shows the image only | Add the country under the certificate (decision 19). |
| 🟠 | **Registration** | `registration` 10086:80136 | Upload CV is required; the phone defaults to AE | Upload CV *(Optional)*; phone defaults to +966 (KSA) with placeholder "ex:52 987 6543". License Title is already optional. |
| 🟠 | **Auth copy** | `login` 10086:80084, `forgot-password` 10086:80348 | "Welcome Back!" / "Forget Password" | Title "Welcome Back" (no "!"), subtitle "Take the next step in your professional career", and "Forgot Password". |
| ❓ | **Settings "Additional Information" tab** | `profile-settings/full-form` 11858:56747 | The editable form lives under the profile tabs (`/candidate/profile/additional-info`); Settings has only Basic Info and Change Password | Decision 18 said Settings gets the editable form and the profile tab shows it read-only. Confirm whether the current placement is final. |
| ❓ | **"Services" link in the mobile navigation** | `mobile/candidate-navigation` 10086:84090 | No Services page exists | Ignore, or define the page. |

Built and matching (no action): Home + "Why Joocare" AI Engine, About + Commitment, FAQ, Contact, For Employers, Explore jobs + Specialty filter, Job details (attachments/posted-by hidden for candidates), match % badge, Apply with screening questions, Take assessment (all states), Profile Home (frame 10086:82207), Profile Insights, Job Applications, AI Job Match + preferences, CV match with ATS, Build Your Professional CV, candidate Inbox, Reset password ("Confirm" + previous-password rule), Basic Info (Subspecialty, Domain, Category + page subtitles), Experience modal (Employment Type + Country/City), Education GPA.

---

## 2. Remaining design work — Employer

| | Item | Figma | Current state | Required |
|---|---|---|---|---|
| 🔴 | **Project chips in Pipeline candidates** | `pipeline-candidates/with-actions` 10086:85598 | Missing from the table | Project chips under each candidate + "View all (n)". |
| 🟠 | **Assessment builder: minimum questions** | `assessment/builder-full/empty` 11535:120512 | `MIN_ASSESSMENT_QUESTIONS = 2` | Figma says at least **5** questions before review. |
| 🟠 | **Assessment review header** | `assessment/review` 10597:59525 | "Assessment Review" | "Assessment Validation & Publication" + the "Question X of N" indicator. |
| ❓ | **Screening question "Mark" field** | `modal/edit-question` 12865:108263 (new frame) | Not in the form | Figma shows Mark (score) per question. Confirm before adding. (Input Text is **excluded** — see §4.) |
| ❓ | **Job listings — non-admin layout** | `employer/job-listings/grid-02` 10527:40433 | The listing always shows Recruiter filter, Post a Job and pin | Wider Search + Status only for non-admins. Needs the backend role/permission rule first. |
| 🟠 | **Post job wizard width** | `post-job/step-1…3` | Uses `max-w-7xl` | Recheck against the 1020px Figma card. |
| 🟠 | **Recommended skills** | `post-job/step-2-requirements` 10086:87426 | Selecting a skill removes it from the recommendations | Figma keeps it with a selected (green) state. |
| 🟠 | **Edit online profile copy** | `popup/edit-online-profile` 10086:88688 | Title/placeholders differ | "Edit Online profile" + `ex: linkedin.com/in/username` placeholders. |
| 🟠 | **Unreviewed screens** (visual check) | All employer frames | Implemented | Run a side-by-side visual pass before declaring the employer portal pixel-identical. |

Built and matching (no action): Dashboard + Active Jobs, Job listings (admin), Job details (all statuses) + screening/assessment card + Posted by, job status & success modals, Post job (3 steps, assessment link, templates, AI JD Builder, question builder), Pipeline candidates (tabs, AI Talent Match, CV modal Download + Candidate Answers → screening answers modal 10086:89120, filters, messaging, share assessment, "linked to project" success modal), Projects (list, candidates, all modals incl. Create / Add candidate; card/menu fonts and icons, delete tooltip, 18/600 table header, "Show X - Y from N" pagination, bold names in Delete/Remove, "View result" → Assessments Results), Assessments (categories, builder, review, results, answers, notes, share), Hiring Manager review flow, Admin Roles + all 5 permission modals (incl. Hiring Manager 12191:111970), Members + first login, Recruiter Activity, Talent Database, Chat (all states), Account settings, Company profile.

---

## 3. Open questions (waiting on you / the client)

1. **CV Builder vs profile fields** — CV Builder "Add Experience" has no Country/City (Figma), while the profile modal has them. Keep the CV Builder as Figma? *(Recommended: yes.)*
2. **Settings Additional Information** placement (see §1).
3. **Screening question Mark** field (see §2).
4. **Product decisions still open:** Emergency Hiring · external / standalone assessments · assessment versioning & archive · max-attempts policy · dashboard formulas · Talent Database scope, consent and plans · who can start a chat (voice/files) · assessment auto-submit / resume rules · scoring weights (screening / assessment / AI) · AI JD Builder limits.

---

## 4. Decisions already taken (keep following them)

- Mock data is never translated; only UI labels go in `messages/en.json` / `ar.json`. When an API isn't ready, build the design with mock data.
- **Question types are only Yes/No, Single Select and Multi Select** — Input Text was removed everywhere (screening questions and assessments).
- Assessment link is valid **72 hours**; the timer stops at the time limit or the link expiry, whichever comes first. Route: `/candidate/assessment/{id}` (login required). "Later" goes to Applied Jobs.
- Profile Home follows frame **10086:82207** (Specialty / Subspecialty / Domain / Category rows in the side list; no separate Professional Profile card; pill tabs). Pending profile fields (gender, religion, marital status, languages, driving license, issuing countries, verified) show "-" until the API returns them.
- GPA stays (required) in every Education form, including CV Builder step 5.
- Candidate CV view actions: Download / Edit / Apply. The employer CV view shows the real uploaded CV file from the API.
- CV Builder is design only (data stays on the page).
- Job apply uses preview screening questions while `JOB_APPLY_PREVIEW_ENABLED = true`; set it to `false` once the job details API returns `screening_questions` / `assessment`.
- AI Filter and CV Search modals, the old standalone chat view and its suggested replies are excluded.

---

## 5. API integration pending 🔌

These features run on preview data. Replace the files below with services + TanStack Query when the endpoints exist.

| Feature | Preview data |
|---|---|
| Apply with screening questions | `jobs/constants/apply-preview-data.ts` (+ `JOB_APPLY_PREVIEW_ENABLED`) |
| Take assessment | `candidate-assessment/constants/candidate-assessment-preview-data.ts` |
| Profile Insights | `candidate-profile-insights/constants/profile-insights-preview-data.ts` |
| AI Job Match | `candidate-ai-job-match/constants/ai-job-match-preview-data.ts` |
| CV match with ATS | `candidate-cv-match-ats/constants/cv-match-ats-preview-data.ts` |
| CV Builder | `candidate-cv-builder/constants/cv-builder-preview-data.ts` |
| Additional Information | `candidate-additional-info/constants/additional-info-preview-data.ts` |
| Candidate / company chat | `chat/constants/candidate-chat-preview.ts`, `chat-preview.ts` |
| About — Commitment | `about/constants/commitment-preview-data.ts` |
| Dashboard (new widgets) | `company-dashboard/constants/dashboard-preview.ts`, `active-jobs-preview.ts` |
| Assessments | `company-assessments/constants/assessment-data.ts`, `assessment-detail-data.ts` |
| Projects + Hiring Manager review | `company-projects/constants/project-preview-data.ts`, `shared-review-preview-data.ts`, `candidate-profile-preview-data.ts` |
| Talent Database | `company-talent-database/constants/talent-preview-data.ts` |
| Recruiter Activity | `company-recruiter-activity/constants/recruiter-activity-preview-data.ts` |
| Roles / Members | `company-admin-roles/data/roles.data.ts`, `permissions.data.ts`, `company-admin-users/data/members.data.ts` |

Backend fields the UI already supports when they arrive: job `screening_questions`, `assessment`, `created_by`; application `assessment` (status + link); profile `gender`, `religion`, `marital_status`, `languages`, `driving_license`, `license_countries`, `is_verified`; screening answers on apply (`screening_answers`).
