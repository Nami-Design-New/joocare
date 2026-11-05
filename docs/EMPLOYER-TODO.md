# Employer — Phase 2 TODO

Checklist of what is missing on the Employer side compared to Figma. Tick `[x]` as items are done.
Logic and details: [PHASE-2-README.md](PHASE-2-README.md) · Figma: `2MqpRGApcnGRWlH5RdUHHo` (page "Joocare Platform — Phase 2").

**Legend:** 🔴 Not built · 🟠 Built, incomplete · 🔌 UI ready, needs API

Last source/Figma inventory audit: 2026-11-05. Checked = implemented UI; API work and unresolved references are listed separately. Existing user scope decisions take precedence over older QA notes.

---

## 1. Dashboard 🔌 - design ready - `10086:90549`
- [x] Recruitment Overview header + five month/year selectors
- [x] Previous-month comparison UI on Total Applications, Brand Reach and Talent Intake
- [x] Recent Activity statistic card (not a feed in the selected frame)
- [x] Time to Fill (average days + 30-day limit meter)
- [x] Employer Brand Reach (unique profile viewers)
- [x] Critical Hiring Alerts (three of five design examples + Show more link)
- [x] Jobs Posted by Recruiter (ranked horizontal bars + View all recruiters)
- [x] Jobs Overview layout + Figma table and pagination styling
- [x] Active Jobs detail page — `10086:90913`: four statistics, three-row table and weekly activity chart. Route `/company/dashboard/active-jobs`, opened by Critical Hiring Alerts > Show more. Design fixtures only; API integration pending.
- [x] Reports & Data Export banner (Coming soon; disabled Export Report)
- [x] Widget descriptions/tooltips, empty/loading/error presentation, Arabic/English and mobile layouts
- AI Match is hidden in the selected Figma frame and is intentionally excluded.
- [ ] Connect the new monthly metrics, comparisons, hiring alerts and recruiter chart to API after their contracts/definitions are supplied. No new KPI calculations or new API endpoints were introduced.

User confirmed: new sections are design only. Existing stats, categories and job listings keep their API integration. Added comparisons and new analytics currently use Figma fixture values. Month controls are local UI state; they do not filter the existing endpoints yet. The three new monthly preview widgets show an empty state outside the available sample month (Sep 2026).
Route: `/en/company/dashboard`. Full Figma data preview: `/en/company/dashboard?preview=design` (disables dashboard/job requests for this visual preview).
Original Figma icons: `public/assets/company-dashboard/`. Website fonts and the existing app shell are reused.

## Jobs flow — remaining decisions / API work

Implementation audited against the current source on 2026-11-05. The old “today” descriptions have been removed where the corresponding UI now exists. Checked items below mean implemented UI, not a new pixel-by-pixel browser audit.

- [ ] Role-based job listing: define the backend role/permissions that select admin vs non-admin UI. The current listing always renders Recruiter filter, Post a Job and pin.
- [ ] Verify backend permissions/contracts for resume from Closed and delete by status. The action UI and confirmation/success modals already exist.
- [ ] Confirm assessment linkage, screening question persistence/edit hydration, and recommended-skills contracts with real API data.
- [ ] Resolve frame/handoff differences before extending the question builder: Mark, Input Text, inline correct-answer pills, and inline edit vs read-only preview + Edit.
- [ ] Confirm job card second line: the source renders company name; the old audit proposed job category.
- [ ] Confirm Benefits scope: no dedicated benefits UI is rendered in the current job description component.

**Scope:** preserve user decisions and final screens. Do not count older QA proposals or hidden layers as missing design automatically. AI Filter and CV Search modals are excluded by user instruction. The old standalone Chat view and suggested replies are excluded. AI JD Builder has an implemented panel selected by `AI_JD_BUILDER_MODE = 'panel'`; a Coming Soon modal also exists. Do not describe that panel as missing.

## 2. Job listings 🟠 — `10086:84376` (admin), `10527:40433` (non-admin)

Code: `JobManagementSection`, `JobCard`, `JobFilter`, `JobRecruiterFilter`, `useJobListingFilters`.

- [x] Search by job title and Recruiter filter; filter state is wired to query parameters.
- [x] Status selector includes a way back to all statuses.
- [x] Pin UI — local state; API persistence/sorting remains pending.
- [x] Card: rounded-2xl border, padding/gap 16, logo tile, truncated title, formatted date, clamped description, divider and 34px action buttons.
- [x] Draft cards hide the normal job-details/application action buttons.
- [x] Status bar and status-specific action menu; shared status actions/modals are reused.
- [ ] Non-admin layout: wider Search + Status only; hide Recruiter filter, Post a Job and pin.
- [ ] Confirm company-name vs job-category subtitle against the chosen frame.
- [ ] Recheck pagination against Figma; the shared pagination supports alignment/tone options, but this listing's callsite needs a fresh visual comparison.
- [ ] API/permissions verification for role visibility, pin persistence and allowed status actions.

## 3. Job details 🟠 — `10086:84578` open · `84854` closed · `85108` draft · `85362` paused

Code: `job/[slug]/page.tsx`, `JobActionButtons`, `JobDescriptionCard`, `JobAttachmentsCard`, `JobScreeningQuestionsModal`, `JobPostedByCard`.

- [x] Open action order: Edit · Pause · Close.
- [x] Paused and Closed expose Resume + Delete; backend permission/transition verification remains pending.
- [x] Share card is rendered only for Open jobs.
- [x] Screening questions & attached assessment card under Skills — `11531:97096`; rows depend on supplied job data.
- [x] Read-only screening questions modal — `11661:114959`.
- [x] Posted by card — `11531:102954`; rendered when `created_by` is supplied.
- [ ] Verify Draft Complete Post resume-step behavior against the intended first incomplete step.
- [ ] Confirm dedicated Benefits UI vs benefits inside rich-text job description.
- [ ] Verify actual API values for screening questions, linked assessment and job creator.

## 4. Job status & success modals 🔌 — UI implemented

Code: `status/JobStatusModals.tsx`, `useJobStatusActions`, shared `IllustratedModal` and `ModalInfoPanel`.

- [x] Shared rich confirmation layout used by job cards and job details.
- [x] Pause confirmation + warning information panel — `10086:88570`.
- [x] Resume confirmation + information panel — `10086:88587`.
- [x] Close confirmation + information panel — `10086:88621`.
- [x] Job Posting Closed Successfully modal — `10086:88560`.
- [x] Applications Resumed Successfully modal — `10086:88550`.
- [x] Delete confirmation — `10086:88672`.
- [x] Explicit Back to Job Postings actions; translated modal copy exists.
- [ ] Verify backend allowed transitions and delete permissions; this is API/role work, not missing modal design.

## 5. Post job 🟠

Code: `PostJobForm`, `JobPostStepOne/Two`, `JobReviewPanel`, `components/post-job/`.

**All steps / results**

- [x] Labels Basic Details · Requirements & Content · Preview; Save as draft copy.
- [x] Saved Successfully modal with What's next panel and Continue Editing — `10086:88528`.
- [x] Published modal with View Job Posting / Go to Dashboard and live-job callout — `10895:61678`.
- [x] Result modals use explicit actions; the current result modal component has no 3-second auto-redirect.
- [x] Custom question form stops submit propagation; adding a question is separate from publishing the job.
- [ ] Wizard width: normal branch still uses `max-w-7xl`; recheck against the 1020px Figma card before declaring exact layout complete.

**Step 1 — Basic details** — `10086:87354`, `11531:108027`

- [x] Assessment switch + Library → Category → Assessment selectors and preview action.
- [x] Assessment Preview dialog — `11661:118968`; question preview component exists.
- [x] Assessment fit confirmation on Next — `11531:106582`.
- [ ] Recheck remaining field labels/placeholders and optional hints against the selected frame.
- [ ] Verify assessment payload/edit hydration and filtering against the API contract.

**Step 2 — Requirements & Content** — `10086:87426`

- [x] Collapsible Job Description / Skills cards and Questions group.
- [x] Editor toolbar includes heading, alignment, underline, strikethrough, code, remove format, code block, quote and horizontal line.
- [x] AI JD Builder button, panel and alternate Coming Soon modal exist; panel is the currently selected mode.
- [x] Recommended Skills + Selected Skills count/removal UI.
- [x] Question Templates chips, Show More / Show Less and added/previewed states.
- [x] Template preview, correct Yes/No answer and Required/Optional selection — `11531:116889`.
- [x] Added question state and toast — `11531:118333`.
- [x] Custom Question empty state — `11535:120986`; questions remain optional.
- [x] Numbered question list, expand/collapse, read-only preview and edit modal.
- [x] Delete confirmation + question renumbering; count summary exists.
- [ ] Recommendations still remove a selected item from the visible recommendations; compare with the intended selected-green state.
- [ ] Recommended-skills source and screening-question persistence need backend contract verification.

**Screening question builder** — section `12795:112132`, handoff `12795:114262`

- [x] Create/edit modal, question input, options, requirement selection and full-width Submit.
- [x] Single Select, Multi Select and Yes / No.
- [x] Option limits, stable option ids, add/remove and correct-answer validation.
- [x] Empty/duplicate option validation, answer errors and summary feedback.
- [ ] Mark field and Input Text type are absent from the current form/schema; confirm this handoff scope before implementing.
- [ ] Current correct answers use Select / MultiSelect fields; handoff describes inline radio/checkbox pill cards. Resolve which reference applies.
- [ ] Current editing uses a modal with an expanded read-only card; resolve the conflicting inline-edit reference.
- [ ] API persistence/retry behavior and full question payload need verification.

**Step 3 — Preview** — `10086:87709`

- [x] Screening questions / assessment attachment summary with preview actions under Skills.
- [x] Published result modal and explicit navigation actions.
- [ ] Recheck company-logo binding and remaining review copy against Figma.

## 6. Pipeline candidates 🟠 — `10086:85598`, `12388:106758`

- [x] Job header (title · company · type).
- [x] Pipeline Candidates / AI Talent Match tabs — `11661:115970`, `10086:86250`; AI Talent Match uses preview data.
- [x] Candidate count + Quick Message (n) and message dialog — delivery is preview only.
- [x] Email, AI Match Score and Assessment status columns; optional API fields supported.
- [x] Assessment states and Share assessment UI.
- [ ] Project chips under each candidate + View all (n) — present in `10086:85598`, absent from the current table.
- [x] Create Project action/modal and Link to Project modal — preview only.
- [x] Added by attribution when supplied by the API.
- [x] Filters page + applied filters — `11531:111386`, `11531:113387`.
- [x] Candidate name navigates to the existing profile page; eye opens CV preview.
- [ ] Candidate Answers / screening answers screen — `10086:89120`.
- [x] Candidate assessments modal — `11531:117890`.
- [x] Send message to selected — `11531:118106`; message success — `11661:97171`.
- [x] Share assessment (single) modal — `11531:116724`.
- [ ] Linked to Project success modal in this flow — `11661:97159`; `useCandidateProjectActions` currently shows a toast.
- [ ] API completion: AI match, favorites, project creation/linking, assessment invitations, message delivery and filter/optional-field verification.

The Link Candidate to Job modal `11531:114326` and linked-to-job/project success dialogs already exist in Assessment Results (`CandidateLinkDialog`, `AssessmentResultsPage`). They must not be listed as globally missing or rebuilt. Confirm any additional Pipeline entry point before reusing them there.

## 7. Projects 🔌 — UI implemented with preview data

- [x] Project card — `11531:105811`.
- [x] Search + Recruiter selector; recruiter can also arrive through the URL.
- [x] Shared N× · last date and +N more on cards.
- [x] Candidate name → profile, PDF → CV download, eye → CV modal — `10086:86891`, `11791:116227`.
- [x] Create project modal — `10086:123881`.
- [x] Add candidate to project modal — `10086:123817`.
- [x] Project action, sharing and share-log dialogs exist.
- [ ] API: project list/details/candidates/actions.
- [ ] Confirm Created date-range filter and internal note when adding a candidate against the intended final frame. They are absent from the current UI, but must not be counted as confirmed final-screen omissions solely from older QA notes.

## 8. Assessments 🟠 / 🔌

**Implemented UI**

- [x] Joocare and company category libraries, category search/filter and source labels.
- [x] Assessment cards with created-on / paused presentation.
- [x] Builder configuration, question list, add/edit/delete and empty state.
- [x] Yes / No, Single Choice and Multiple Choice question types.
- [x] Review summary, question table and question previews.
- [x] Assessment assignment, candidate/email picker, external invitation list and sent-success UI.
- [x] Results selection/table, filters, Link to Job / Project dialogs and both success states.
- [x] Candidate answers review with Started / Submitted / Duration metadata.
- [x] Notes with author, date, edit/delete and Edited indicator.

**Confirmed remaining differences**

- [ ] Builder empty-state rule: Figma `11535:120512` says at least 5 questions; `MIN_ASSESSMENT_QUESTIONS` is currently 2.
- [ ] Review header: Figma `10597:59525` says Assessment Validation & Publication; current translation says Assessment Review.
- [ ] Review Question X of N indicator from Figma is absent from the current builder header.

**Needs reference / product confirmation**

The following older checklist items are not all present in the final screens inspected. Keep them separate from confirmed missing design:

- [ ] Tabs vs separate Library sections; Region / Domain filters; linked-job and Invited / Started / Completed counters.
- [ ] Input Text type, editable Maximum Attempts, templates, autosave / Last saved.
- [ ] Sharing summary / +N more and external invitation attempt/date fields.
- [ ] Remaining results filters, feedback Internal/Draft/Sent states, earned/max scoring and sidebar count.
- [ ] Verify any requested edit-success toast and optional-question scoring behavior.
- [ ] API integration for categories, assessments, builder persistence, invitations, results and notes.

The final empty-state frame explicitly lists only Yes / No, Single Choice and Multiple Choice; do not automatically treat Input Text as a missing final-screen requirement.

## 9. Hiring Manager review 🔌

Standalone role flow: `/hiring-manager/create-password` → `/hiring-manager/shared-projects/[projectId]`. It is separate from the company dashboard. The old company shared-project route is not the intended entry point.

- [x] Shared candidates review — `10164:39865`.
- [x] Schedule interviews — `12163:105704`.
- [x] Decisions submitted modal — `11661:116783`.
- [x] Separate Create Password page with validation.
- [ ] API: invitation/password setup, shared project, decisions and interviews; current flow uses preview data.

## 10. Admin Roles 🔌

- [x] Roles/permissions UI and member list with add/edit dialogs exist.
- [x] First login Create your password + rules — `11531:118182`; standalone `/hiring-manager/create-password`.
- [x] Password changed modal — `11661:97135`; shared existing success modal/asset.
- [x] Real-time Create/New Password checklist — `11531:118200`; positioned after confirmation, validates only the new password, preserves red input/checklist error styling. Current/Confirm fields and login do not display this checklist.
- [ ] Roles/permissions API.
- [ ] Members API and actual email invitation.
- [ ] Confirm Verified/Invited/Pending/Deactivated statuses, Account Owner badge and Deactivate instead of Delete against the required reference. Current members UI uses Delete and has no status column; these were older QA scope, not established by the inspected members frame alone.

## 11. Recruiter Activity 🔌 — `10086:86774`
- [x] Route `/company/recruiter-activity` + Recruiter filter (in URL)
- [x] Table: Name (+ Deleted badge) · Open / Closed / Draft jobs · Projects — local preview data
- [x] Clicking a count opens Jobs (`?status=&recruiter=`) / Projects (`?recruiter=`) pre-filtered
- [ ] API (recruiter activity counts + recruiters list); jobs `recruiter` param currently sends the name, should become an id
- Not in this frame (older scope): Screening progress · AI match

## 12. Talent Database / CV Search 🔌
- [x] Route `/company/talent-database`
- [x] Search filter sections (Occupational · Experience · Licensing · Languages · Mobility), collapsible — `10086:87237`, `11531:95756`
- [x] Results + download list (local preview data) — `10086:87021`, `10086:90396`
- [x] Candidate profile preview, reusing the existing read-only profile — `10086:86891`
- [x] Eye icon opens the selected candidate's CV modal; candidate name links to the profile page
- [x] Send Message to Selected: recipient removal + message validation — `11531:118106`
- [x] Message success: existing `SuccessModal` + existing Lottie, dynamic recipient count — `11661:97171`
- [ ] API integration, real message delivery, and finalized Talent Database scope / consent / plans (QA 56)

User scope update: AI Filter modal and CV Search modal are excluded. Messaging and search currently run as UI previews; no messages are delivered.

## 13. Chat 🟢 (design complete)
- [x] Conversation list + active chat window - `10086:86069`
- [x] Menu open / chat closed / image & reply - `11531:118930`, `11535:119505`, `11535:120111`
- [x] Already contacted alert + empty conversation - `11535:122389`
- [x] Super Admin view: recruiter attribution, send, close and reopen - `11535:122801`
- [x] Original Figma photos/icons, desktop + mobile list/conversation navigation, Arabic/English UI. Candidate names, job titles and message data are not translated.
- [ ] API integration: conversation list/history, real message delivery, attachment storage/downloads, unread updates, and server role/permission checks.

Code: `src/features/chat`; route: `/en/company/chat`.
Design previews: `?scenario=image-and-reply&conversation=emily`, `?scenario=already-contacted&conversation=emily`, `?scenario=closed&conversation=emily`, `?view=super-admin`.
These parameters only select local design fixtures; they do not grant permissions or send messages. The original PDF file is not provided in Figma; its download action shows a preview notice. User-selected attachments can be previewed/downloaded locally.
User decisions: name = Chat; preserve current header/sidebar; old standalone `10086:85956` and its suggested replies are excluded; use the final seven screens instead of QA58 additions.

## 14. Minor copy / final visual review

- [ ] Recheck Edit online profile title/placeholders against `10086:88688`; current social form and translated placeholders already exist.
- [ ] Run a dedicated visual comparison for untouched company screens before claiming the whole employer portal is pixel-identical. This documentation audit checked source implementation and selected Figma frames; it does not certify every existing screen.

---

**Waiting on a product decision (don't build yet):** Emergency Hiring · External assessments · Versioning / Archive · Standalone assessments · Dashboard formulas · Talent DB scope and consent · Who can start a chat
