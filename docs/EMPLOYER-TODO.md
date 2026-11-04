# Employer — Phase 2 TODO

Checklist of what is missing on the Employer side compared to Figma. Tick `[x]` as items are done.
Logic and details: [PHASE-2-README.md](PHASE-2-README.md) · Figma: `2MqpRGApcnGRWlH5RdUHHo` (page "Joocare Platform — Phase 2").

**Legend:** 🔴 Not built · 🟠 Built, incomplete · 🔌 UI ready, needs API

---

## 1. Dashboard 🟠 — `10086:90549`
- [ ] Recruitment Overview header + period selector (Sep 2026)
- [ ] "vs last month" comparison on cards
- [ ] Recent Activity feed
- [ ] Time to Fill (avg days + 30-day limit)
- [ ] Employer Brand Reach (unique profile viewers)
- [ ] Critical Hiring Alerts (jobs open > 30 days + Show more)
- [ ] Jobs Posted by Recruiter
- [ ] AI Match column in Jobs overview
- [ ] Reports & Data Export (Coming soon)
- [ ] Tooltip + empty state for every widget

## Jobs flow — decisions needed before building
Reviewed against Figma on 2026-11-03 (job listing, job details × 4 statuses, status/success modals, post job steps 1–3, screening question builder, QA Batch 01/02/08). Each item below lists what Figma shows, what the code does today, and what to reuse.

1. **Roles** — which roles get the "admin" listing (Recruiter filter, pin, Post a Job) vs the non-admin one (`10527:40433`), and where the current member's role/permissions come from. Figma contradicts itself: the Recruiter role has "Job Posting: Access" but grid-02 hides Post a Job.
2. **Closed jobs** — can a closed job be reopened (closed → open)? Figma shows **Resume** on closed details. Backend must confirm. The closed / draft ⋯ menus in Figma (`Edit · Complete · Paused · Delete`) look copy-pasted.
3. **Delete** — allowed for open / paused / closed jobs (today only drafts)? Allowed for non-admins?
4. **Menu labels** — Figma uses state words ("Closed", "Paused", "Reactivate", "Complete"); code uses verbs ("Close", "Pause", "Resume", "Complete Post").
5. **After a status change** — the prototype jumps to the details page after 2.5 s and "Back to Job Postings" only closes. Decide: navigate to `/company/job-management`, stay, or go to details? Remove the toast when the success modal shows? Replace `window.location.reload()` (it kills the modal).
6. **Post-job success modals** — drop the 3 s auto-redirect (Figma has explicit buttons)? Keep or drop the extra "Save as draft" confirmation (Figma opens the saved modal directly)? What does edit mode show (Figma has no edit variant)?
7. **Assessment link (step 1)** — picker pattern: final frames use selects (Library → Category → Assessment + eye); QA ID1 shows a source-labelled card list. Toggle label: "Link Assessment to this Job" (off) vs "Assign Assessment to This Job" (on). Required when ON? Backend field name (`assessment_id`?) and how it comes back for edit.
8. **Screening questions** — backend contract (templates list, job questions CRUD or a `questions` array in step 2), template source (API vs static), per-question save vs save with step 2, max per job (QA: undecided → don't enforce), success feedback (QA ID7 approves a toast; the modal `10181:43713` is the older version), Input Text: Required/Optional or not, how a text answer is matched, Mark integer or decimal, label "Multi Select" vs "Multiple Choice", batch template add (QA ID5) vs one-at-a-time preview (frames).
9. **Copy conflicts** — "Role Category" (Figma) vs "Job Function" (code, looks intentional). Specialty text input vs dropdown (frames disagree). Keep the extra "Add new certification" input (not in Figma)?
10. **Recommended skills** source — job-title endpoint or a dedicated suggestions API.

**Hidden in Figma (don't build):** AI Talent Match / Ai Filter buttons on job cards · edit/delete buttons inside the read-only screening question cards · delete-question from the details page · External assessments (QA ID4, pending) · AI JD Builder chat panel (`10086:87585`, future) · prototype-only "click a field to load a complete example" hint · question list pagination (component variant only) · "View Applicants" (not in these frames).

## 2. Job listings 🟠 — `10086:84376` (admin), `10527:40433` (non-admin)
Code: `JobManagementSection`, `JobCard`, `JobFilter`, `JobRecruiterFilter`, `useJobListingFilters`.

**Toolbar**
- [x] Search by job title — sent as `search` (debounced) 🔌
- [x] Recruiter filter — sent as `recruiter` 🔌 (recruiters list from API)
- [ ] Non-admin view: toolbar = Search (wider) + Status only; hide Recruiter filter, Post a Job button and the card pin — today everyone sees all of it (no permission check in jobs) · M · ⚠️ decision 1
- [ ] Status placeholder "Status" (today "Filter by status") + a way back to all statuses (Figma draws none — add "All statuses" like recruiters?) · S
- [ ] Pagination: row aligned to start, "Show 1 - 10 from 57" all dark semibold, inactive page numbers dark, no last page after "…" — `CustomPagination` is centred/muted today; it's shared (FAQ…), so add props instead of changing it globally · S
- Older scope from QA ID45, not in final frames: Assessment / Questions / Date range filters, Pin inside the ⋯ menu — confirm before building

**Card** (`10086:84395`)
- [x] Pin icon — local state only 🔌 (needs API to persist / sort)
- [ ] Container: radius 16, padding 16, gap 16, 1px `border-border`, no shadow — today shadcn `Card` defaults (rounded-xl, py-6, gap-6, shadow-sm) · S
- [ ] Logo in a 52×46 `bg-primary-bg` box, radius 12 (today bare image) · S — reuse the box from `PositionCard`
- [ ] Title 1 line + ellipsis; 2nd line is the **job category** in Figma (today company name — confirm); date "21 December 2026 , 4:00AM" formatted by locale (today raw API string) · S
- [ ] Description 14px `text-muted-foreground`, 2-line clamp with "…" (today 70-char slice, dark prose) · S
- [ ] Divider above the buttons (all cards incl. Draft) · S
- [ ] Buttons 34px high, 14px regular (today `size="pill"` = 52px); count **bold** after "Received Applications" (non-admin frame shows it, admin hides it — show for everyone?) · S
- [ ] Draft card: no buttons at all (today "Job Details" still shows) · S
- [ ] Status bar 24px, 14px label, 10px date at the end; tints: open `primary`, closed `secondary`/8%, paused `destructive`/8%, draft muted (closed uses a navy tint today) · S
- [ ] ⋯ menu on **every** status (today hidden on Closed) · M · ⚠️ decisions 2–4
  - Open: Edit · Close → close modal · Pause → pause modal · Delete → delete modal (today: Edit · Pause · Close, no Delete)
  - Paused: Edit · Close · Reactivate → resume modal · Delete (today: Resume only)
  - Closed / Draft: Figma `Edit · Complete · Paused · Delete`, only Delete is linked (today Draft: Complete Post · Delete; Closed: nothing)
  - Items 16px semibold muted with 20px icons, Delete red
  - Reuse: same handlers as `JobActionButtons`; the modals are duplicated today in `JobCard` and `JobActionButtons` → move them into one shared job-status component

## 3. Job details 🟠 — `10086:84578` open · `84854` closed · `85108` draft · `85362` paused
Code: `job/[slug]/page.tsx`, `JobActionButtons`, `JobDescriptionCard`, `JobStatusBadge`, `JobShareCard`.

**Actions per status**
- [ ] Open: order **Edit · Pause · Close** (today Edit · Close · Pause); Pause button orange (`warning`) · S
- [ ] Paused: **Resume** (no icon) + **Delete** (today Resume only) · S
- [ ] Closed: **Resume** + **Delete** (today no buttons) · S · ⚠️ decision 2 (Figma label "Deleted" is a typo → keep "Delete")
- [ ] Draft "Complete Post" opens the wizard at **step 2** (today always step 1, `PostJobForm` `currentStep = 0`) — or resume at the first incomplete step? · S
- [ ] Share card only on **open** (today always shown) · S
- [ ] Status bar date "21 December 2026 , 4:00AM", locale-aware (today raw string) · S

**New content**
- [ ] "Screening questions & assessment attached to this job" card under Skills, all statuses — `11531:97096` · M 🔌
  - Light-green card, white 36px icon tile
  - Row 1: "Screening questions" · "5 questions · 3 required" · "View questions ›" → screening questions modal
  - Row 2: "Assessment" · assessment title · "View assessment ›" → `/company/assessments/{categoryId}/{assessmentId}` (route exists)
  - No empty state in Figma → proposed: hide a row when empty, hide the card when both are empty
  - API: job details must return questions (+ required flag) and the linked assessment (id, title, categoryId)
- [ ] "Screening Questions (N)" modal, read-only — `11661:114959` · M
  - Green circle close; cards with a "Q1…" badge, text, " (Required)" suffix on required ones, chevron
  - Expanded state in Figma reuses the editable card → build read-only (type, options, correct answer) — confirm
  - Reuse: `AssessmentQuestionsOverview` / accordion pattern from `AssessmentAnswersReview`
- [ ] "Posted by" card — `11531:102954` · S 🔌
  - 44px avatar with initials, "Posted by **Sara Al-Harbi**", "Senior Recruiter · email", right side "Created on" + "12 Sep 2026, 10:24 AM"
  - API: job creator (name, role, email, avatar) — not in `JobDetails` today
  - Reuse: `AssessmentCreatorCard` (add email + date)
- [ ] "Learn more about our benefits" + Benefits list — commented out in `JobDescriptionCard`; no API field. Probably part of the rich-text description → confirm, then delete the commented code · S

## 4. Job status & success modals 🟠
Today all three confirmations use `AlertModal` (generic warning Lottie, title + description only) and success is a toast + page reload.

- [ ] Shared rich confirmation layout — one job-status modal used by both `JobCard` and `JobActionButtons` · M
  - 230px illustration (export from Figma), 28–30px title, 17px muted body
  - Info panel: round "i", heading, 3–4 items with filled check icons
  - Buttons side by side: filled primary (with icon) + outline secondary; tone orange for pause, green for resume/close
  - Reuse: extend `AlertModal` with `children` (like `SuccessModal`) + tone/visual/confirm icon. Also fix its hardcoded "Saving..." (same in `DeleteModal`)
- [ ] **Pause** — `10086:88570` · S
  - Title "Pause Applications for This Position?"
  - Body "This will temporarily stop new applications from being submitted. The vacancy will no longer appear in search results until it is reactivated."
  - Panel "While paused:" — No new applications will be accepted · The vacancy will not appear in candidate search results · Existing applications will remain accessible · You can reactivate the vacancy at any time
  - Buttons: orange "Pause Vacancy" (pause icon) · "Keep Active". No success modal (goes to paused details)
  - Today: different copy, red confirm "Yes, stop the advertisement", cancel "Back"
- [ ] **Resume** — `10086:88587` (from paused **and** closed) · S
  - Title "Resume Applications for This Position?"
  - Body "Reactivating this job posting will make it visible to qualified medical professionals and allow new applications to be submitted. The vacancy will become searchable and continue using its previous posting settings."
  - Panel "Once reactivated:" — New applications will be accepted · The vacancy will appear in search results · Candidate notifications and visibility will resume · Existing applications and workflow data will remain unchanged
  - Buttons: "Reactivate Vacancy" (arrow) · "Keep Paused" (odd wording for a closed job — confirm)
- [ ] **Close** — `10086:88621` · S
  - Title and body already match
  - Add panel "Before you close, make sure you have:" — Reviewed all relevant applications · Saved important applicant details · Completed any ongoing communication
  - Buttons: "Yes, close the advertisement" (arrow) · "Cancel" (today "Back"); document-with-check illustration
- [ ] 🔴 **Success: Job Posting Closed Successfully** — `10086:88560` · S
  - "The announcement has been successfully closed. The role has been archived and is no longer visible to medical professionals."
  - Button "Back to Job Postings" (arrow) · ⚠️ decision 5
  - Reuse: `SuccessModal` with `visual` + `primaryAction`
- [ ] 🔴 **Success: Applications Resumed Successfully** — `10086:88550` · S
  - "The announcement has been successfully reposted. Your vacancy is live again, searchable, and open to new applications."
  - Button "Back to Job Postings"
- [ ] **Delete** — `10086:88672` · S — copy only: confirm "Confirm deletion" (today "Confirm Deletion"), cancel "Cancel" (today "Back"). Redirect already matches
- [ ] Translations en + ar for all of the above (new keys for panels, items, success modals and button labels) · S

## 5. Post job
Code: `post-job/page.tsx`, `PostJobForm`, `JobPostStepOne/Two`, `JobReviewPanel`, `validation/job-post-schema.ts`, `types/job-steps.types.ts`.

**All steps**
- [ ] Step labels "Basic Details" · "Requirements & Content" · "Preview" (today "Job Details" · "Job Description & Requirements" · "Job Preview"); button "Save as draft" (today "Save as Draft") · S
- [ ] Wizard card 1020px wide (today `max-w-7xl` = 1280px) · S
- [ ] **Saved Successfully!** modal — `10086:88528` · M
  - Opens directly from "Save as draft" (today an AlertModal confirmation first — ⚠️ decision 6)
  - "The job details have been saved. You can continue editing and publish the posting at any time from Job Management."
  - Callout with bulb icon: "What's next?" — "You can review, make changes, or publish this job when you're ready from the Job Management section."
  - Buttons: "Go to Job Management" (arrow) · "Continue Editing" (closes, stays in the wizard)
  - Remove the 3 s auto-redirect (it breaks Continue Editing)
  - Reuse: `SuccessModal` (`callout` + actions) — add an icon slot and a green 18px title to its callout

**Step 1 — Basic details** (`10086:87354`, off state `11531:108027`)
- [ ] **Assessment** card (last card, after Availability) — `11073:43278` · M · ⚠️ decision 7
  - Switch row; OFF "Link Assessment to this Job" hides the fields
  - ON shows: "Assessment Library" select · "Assessment Category" select · "Assessment" select + 52px dark eye button
  - Proposed rules (not drawn): category filtered by library, assessment disabled until a category is picked, eye disabled until an assessment is picked, exclude paused assessments, turning OFF clears the selection (like the salary toggle)
  - Reuse: `ui/switch`; selects pattern from `AssignAssessmentModal` (category → assessment, filtered by `categoryId`); data `categorySeeds` / `assessmentSeeds` until the assessments API exists
  - Schema/payload/edit hydration: add assessment keys to `step1Schema`, `JobStepOnePayload`, `buildStepOnePayload`, `buildUpdatePayload`, `mapJobToFormData`
- [ ] **Assessment Preview** sheet from the eye button — `11661:118968` · M
  - Header "Assessment Preview" + "Review the assessment structure, scoring criteria and questions before linking it to this job."
  - Summary: title, description; tiles Questions · Passing Score · Assessment Duration · Permitted Attempts; "Assessment Structure" type tags
  - "Questions Overview" table (# · Question · Type · Score % · eye) + pagination
  - Reuse: `AssessmentSummary` + `AssessmentQuestionsOverview` in a dialog (labels differ: "Score" vs "Passing Score", "Allowed Question Types" vs "Assessment Structure")
- [ ] Question Details modal from a preview row — `10527:42699` · S — title "Question Details" (today "Question Preview"), green circle close. Reuse: `AssessmentQuestionModal` read-only
- [ ] **Assessment fit alert** on Next when an assessment is linked — `11531:106582` / `11531:107888` · S
  - "Is this assessment the right fit for this job?"
  - "Candidates applying for this job will be asked to take “{title}” ({count} questions). Make sure it matches the job's specialty and seniority level before you continue"
  - Buttons "Yes, continue" (→ step 2) · "Cancel" (stays); not shown when the toggle is OFF
  - Reuse: `AlertModal`. Only on create, or also complete/edit?
- [ ] Field copy · S
  - Specialty placeholder "ex: Cardiology" (text vs dropdown ⚠️ decision 9)
  - Job Category placeholder "ex: Cardiology" (today none)
  - Professional License placeholder "ex: Without Medical license" (today "ex: DHA License")
  - Seniority Level "(optional)" hint next to the label (Figma text says "option") — `SelectInputField` needs a `hint` prop
  - "Role Category" vs "Job Function" ⚠️ decision 9; extra "Add new certification" input not in Figma ⚠️ decision 9

**Step 2 — Requirements & Content** (`10086:87426`)
- [ ] Sections as collapsible cards (21px title + chevron in a 36px grey circle) · M
  - "Job Description" (open), "Skills" (closed by default), grey "Questions" group with "Question Templates" and "Custom Question"
  - Custom Question opens automatically once a question exists
  - Reuse: `ui/accordion`
- [ ] Editor toolbar per Figma — `CustomEditor` (CKEditor) · S
  - Add: heading dropdown, alignment, underline, strikethrough, inline code, remove format, code block, quote, horizontal line
  - Remove: font size / family / background colour, media embed
- [ ] "AI JD Builder" button under the editor + **coming soon** modal — `11531:110531` · S
  - "COMING SOON" badge, "AI JD Builder is coming soon"
  - "Write and polish job descriptions with AI in seconds. This feature will be available with the Joocare AI plans — you can keep writing your description manually for now"
  - Buttons "Got it" · "Notify me when it's live" (only closes in the prototype — API or toast?)
- [x] Skills: Recommended Skills + Selected Skills (count, ✕ remove) — UI done on the current data; selected chips no longer inside the field 🔌
- [ ] Skills follow-ups · S
  - Wrap in the collapsible card
  - Recommendations pass the URL `jobId/editId` as `job_title_id` (old behaviour kept) → should be `watch('title')`; in create mode there's no id at all
  - Figma turns a clicked recommendation green instead of removing it
  - Real recommended endpoint 🔌
- [ ] **Question Templates** card — `11319:65002` / `10181:44166` · M · ⚠️ decision 8
  - Helper "Click any template to quickly add a pre-configured screening question."
  - 26 chips with + : Education, Professional License, Medical License, Years of Experience, Board Certification, Specialty, Hospital Experience, ICU Experience, Emergency Experience, Surgery Experience, Language, English Proficiency, Arabic Proficiency, Availability, Night Shift, Weekend Shift, Relocation, Current Location, Work Authorization, Visa Status, Background Check, Drug Test, Reference Check, Driver's License, Computer Skills, Communication Skills
  - First 11 + "Show More" / all + "Show Less"; added templates show ✓ + green outline; the one being previewed is dark
  - Same chip pattern as Recommended Skills
- [ ] **Template preview** card — `11531:116889` · M
  - Q badge + question text
  - "Question Type" read-only "Yes / No" (hint "Templates are Yes / No only")
  - "Choose the correct answer" Yes / No toggle
  - Question Requirement: "Is this question required?" + "Candidates must answer required questions to submit", Required (default) / (Optional)
  - Buttons "Cancel" · "Add to questions" (arrow)
- [ ] After adding — `11531:118333` · S — chip gets ✓, question appended (highlighted light green) in Custom Question, toast "Question added successfully" (QA ID7), user stays in place
- [ ] **Custom Question** empty state — `11535:120986` · S
  - Subtitle "Create a custom screening question tailored to your hiring needs."
  - "No screening questions yet" · "Pick a ready-made question from Question Templates or create your own custom question." · "Screening questions are (Optional) — you can skip this and continue."
  - Dashed green "+ Custom Question" button opens the builder; Next stays enabled (questions are optional)
- [ ] Added questions list · M
  - Card per question: "Q1" badge, text, red delete, chevron
  - Template + custom share one list and numbering
  - Expanded = inline edit (type, text, options, correct answer, Cancel / Save Changes) — `11073:44433`; QA ID9 says a read view with Edit → confirm
  - Reuse: `AssessmentQuestionCard`
- [ ] Delete question modal — `11661:97095` · S
  - "Delete this question?" · "This question will be removed from the job's screening questions and can't be restored" · "Confirm deletion" / "Cancel"
  - Renumber after delete; a template chip goes back to +
  - Reuse: `DeleteModal`
- [ ] Count/summary "3 questions added" — no "3 / 10" until a max is defined (QA ID6/8) · S
- [ ] Data model + API: step 2 payload/schema/edit hydration for questions — today `JobStepTwoPayload = { description, skills }` · L 🔌
- QA ID5 batch selection ("4 selected • Add Selected") and ID12 "Duplicate & edit" / TEMPLATE label: approved on the QA board, not in the frames → ⚠️ decision 8

**Screening question builder** — section `12795:112132` (rules in "Developer handoff" `12795:114262`)
- [ ] Modal "Create Screening Question" (964px, green circle close, no Cancel) · L
  - Row: type dropdown + "Mark" (positive number, no %, no max)
  - "Your Question" input
  - Body per type
  - Question Requirement block (Single / Multi / Yes-No only)
  - Full-width "Submit"
  - Reuse: generalise the assessments builder (`AssessmentQuestionModal`, `useAssessmentQuestionForm`, `QuestionChoiceFields`, `assessment-builder-schema`) and move it to `shared` — don't copy it. It differs: score % 1–100, attachment, dropdown correct answer, no Input Text, no Required
- [ ] Types: Single Select · Multi Select · Yes / No · Input Text — current type green; switching keeps compatible values (today resets) · S
- [ ] Options A–E: default 3, min 2 / max 5, delete renumbers and drops the correct state, counter "3 of 5 options · minimum 2", stable ids · M — mostly already in `QuestionChoiceFields`
- [ ] Correct answer as inline pill cards (radio for Single "Correct Answer · select one", checkboxes for Multi "Correct Answers · select one or more"), keyboard accessible · M
- [ ] Yes / No: nothing preselected (assessments preselect "yes") · S
- [ ] Input Text: "Correct Answer" text input "Your Answer", no Required block · M
- [ ] Validation · M
  - Trim, non-empty question/options, reject duplicate options, positive Mark, one correct answer for Single / at least one for Multi; inline errors + focus first invalid
  - Summary line above Submit: "Enter a question, a positive mark, 2–5 unique options and one correct answer." (Multi: "…at least one correct answer.")
  - Answer-only errors: "Choose exactly one correct answer before saving." / "Choose at least one correct answer before saving."
- [ ] Submit: persist `{ type, question, mark, options: [{ id, text }], correctOptionIds, required }` → close → append to the list; retryable inline error on failure · M 🔌
- [ ] Edit reopens the same modal prefilled (title for edit not designed) · S

**Step 3 — Preview** (`10086:87709`)
- [ ] Screening questions & assessment summary card under Skills (same as job details, "5 questions") + View questions modal + View assessment link — `11531:103262` · M 🔌. Leaving the wizard for the assessment page loses its state → new tab or modal?
- [ ] Company logo in the header (today always `/assets/new-logo-dot.svg`; `job.company.image` exists) · S
- [ ] Copy: "Job Description", "Skills:", "Role category", "Yearly salary" (type + "salary"), "Save as draft" · S
- [ ] **Published** modal — `10895:61678` · M
  - "Congratulations!" · "Your job has been successfully published."
  - "Your vacancy is now live and visible to qualified candidates. You can view and manage applications anytime from your dashboard."
  - Callout with megaphone icon: "Your job is now live" · "Candidates can now find and apply for this position."
  - Buttons: outline "View Job Posting" → `/company/job/{id}` · primary "Go to Dashboard" (arrow) → `/company/dashboard`
  - X → Job Management; no auto-redirect (today 3 s redirect, title/description only)
  - Outline button comes first, opposite of the `SuccessModal` default order

## 6. Pipeline candidates 🟠 — `10086:85598`, `12388:106758`
- [x] Job header (title · company · type)
- [x] Pipeline Candidates / AI Talent Match tabs — `11661:115970`, `10086:86250` — AI Talent Match uses preview data 🔌
- [x] Candidate count + Quick Message (n) — message dialog ready; delivery is preview only 🔌
- [x] Columns: Email · AI Match Score · Assessment status — optional API fields supported; backend data still required 🔌
- [x] Assessment states: Passed % · Failed · View result · In grace period (Due) · Time expired – not taken · Not assigned + Share assessment — UI ready 🔌
- [ ] Project chips + "View all (n)"
- [x] Create Project action + modal — UI preview; needs API 🔌
- [x] "Added by …" — displayed when supplied by the API
- [x] Filters page + applied filters — `11531:111386`, `11531:113387` — URL/API params wired; backend behavior needs verification 🔌
- [x] Candidate name links to the existing candidate profile page (`candidateId=talent-5&source=talent-database`) — user scope: page navigation
- [ ] 🔴 Screening answers + summary scores — `10086:89120`
- [ ] 🔴 Modal: link to job — `11531:114326`
- [x] Modal: link to project — `11531:116277` — UI preview; needs API 🔌
- [x] Modal: candidate assessments — `11531:117890`
- [x] Modal: send message to selected — `11531:118106` — UI preview; no delivery 🔌
- [x] Modal: share assessment (single) — `11531:116724` — UI preview; needs API 🔌
- [ ] 🔴 Success modal: linked to job — `11661:97147`
- [ ] 🔴 Success modal: linked to project — `11661:97159` — currently a toast
- [x] Success modal: message sent — `11661:97171` — UI preview 🔌
- [ ] API completion: AI Talent Match, favorite persistence, project creation/linking, assessment invitations, message delivery, and verification of pipeline filters/optional fields with real job data

## 7. Projects 🔌
- [x] Project card per Figma — `11531:105811`
- [x] Candidate name → profile page · PDF icon downloads CV · eye icon opens CV modal — `10086:86891`, `11791:116227`
- [ ] API (list, details, candidates, all actions)
- [ ] Recruiter + Created date range filters — `10086:101678`
- [ ] "Shared N× · last <date>" + "+N more"
- [x] Create project modal — `10086:123881` — reusable candidate action UI ready; needs API 🔌
- [x] Add candidate to project modal — `10086:123817` — reusable candidate action UI ready; needs API 🔌
- [ ] Internal note when adding a candidate

## 8. Assessments 🔌
**Categories / list**
- [ ] API
- [ ] Library / My Assessments tabs + source label
- [ ] New search + Region and Domain filters — `10115:40214`
- [ ] "created on" + paused copy ("New attempts and sharing are disabled") — `10086:122857`
- [ ] Linked jobs count + Invited / Started / Completed

**Builder**
- [ ] Text Input question type (code has only 3 types)
- [ ] Maximum attempts (default 1)
- [ ] Empty state + "at least 5 questions" rule — `11535:120512`
- [ ] Add from templates
- [ ] Autosave + "Last saved"
- [ ] "Assessment updated successfully" toast on edit
- [ ] Review: "Assessment Validation & Publication" + "Question X of N" — `10597:59525`

**Sharing / invitations**
- [ ] External sends: Maximum Attempts + invite date & time — `11535:125280`
- [ ] Share modal: Registered / External / Total summary + "+N more" — `11377:44663`
- [ ] Candidates dropdown + add email — `11377:44885`, `11535:120917`

**Results**
- [ ] API + full filters (Job, Assessment, Status, Score, Date, Has feedback)
- [ ] Started / Submitted / Duration — `10649:67688`
- [ ] Skipped optional questions score 0
- [ ] Notes with count + author + "Edited"
- [ ] Feedback: Internal note / Draft / Sent (no star rating)
- [ ] Score as `earned / max`
- [ ] Sidebar counter

## 9. Hiring Manager review 🔌 — route `/company/shared-projects/[projectId]`
- [x] Shared candidates review ("Shared with you by … · submit your decisions") — `10164:39865`
- [x] Schedule interviews — `12163:105704`
- [x] Decisions submitted modal — `11661:116783`
- [ ] API (shared project, decisions, interviews) — runs on local preview data today

## 10. Admin Roles 🔌
- [ ] Roles API (permissions come from the backend)
- [ ] Members API + email invite
- [ ] Statuses: Verified / Invited · Pending / Deactivated + Account Owner badge
- [ ] Deactivate instead of Delete
- [x] First login: Create your password + rules — `11531:118182` — standalone hiring-manager UI at `/hiring-manager/create-password`, then `/hiring-manager/shared-projects/[projectId]`; invitation/password setup API is deferred
- [x] Password changed modal — `11661:97135` — shared success modal after successful change/reset, then returns to the existing destination
- [x] Real-time password requirements — `11531:118200` — standalone checklist appears after confirmation, tracks only Create/New Password, updates in real time, and enforces 8+ characters, uppercase/lowercase, number, and special character across registration/change/reset; login remains unchanged

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

## 13. Inbox / Chat 🔴
- [ ] Inbox list + chat view — `10086:86069`, `10086:85956`
- [ ] Menu open / chat closed / image & reply — `11531:118930`, `11535:119505`, `11535:120111`
- [ ] Already contacted alert — `11535:122389`
- [ ] Super admin view — `11535:122801`

## 14. Minor copy
- [ ] Edit online profile: title + placeholders `ex: linkedin.com/in/username` — `10086:88688`

---

**Waiting on a product decision (don't build yet):** Emergency Hiring · External assessments · Versioning / Archive · Standalone assessments · Dashboard formulas · Talent DB scope and consent · Who can start a chat
