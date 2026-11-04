# Jobs flow — implementation handoff

Build the employer **job management + post job** flow so it matches Figma. This file is the full task list, in order, with the exact Figma copy, the files to change, what to reuse, and a default for every open product question so you never have to stop and guess.

Short checklist of the same items: [EMPLOYER-TODO.md](EMPLOYER-TODO.md) sections 2–5. Tick items there as you finish them.

---

## 0. Before you start

### 0.1 Rules
Read [RULES.md](RULES.md) and follow it on every file. The points that matter most here:
- Folder structure: `src/app` = routes only, `src/features/<name>` = feature code, `src/shared` = code used by 2+ features. `shared` never imports from `features`.
- Feature work stays in `src/features/jobs` (existing feature — keep its structure). Job post components may go in `src/features/jobs/components/post-job/` (already exists), status modals in `src/features/jobs/components/status/`.
- Logic in hooks, requests in `services/` with `apiFetch`, components mostly render. Types in `types/*.types.ts`, constants in `constants/index.ts`, Zod schemas in `validation/*-schema.ts` with the message-factory pattern.
- Design tokens only (`bg-primary`, `bg-primary-bg`, `bg-muted`, `bg-body-bg`, `border-border`, `text-muted-foreground`, `bg-warning`, `text-warning-strong`, `bg-destructive`, `bg-job-type` …). No hex, no `gray-*`/`red-*`, no `[..px]` when a scale class exists. Add a token in `src/app/globals.css` (light + dark) if a colour is really missing.
- No hardcoded text: every label, placeholder, `aria-label`, toast and modal string goes in **both** `messages/en.json` and `messages/ar.json`. Preview/mock **data** values stay plain strings (don't translate them).
- RTL-safe classes only (`ms/me/ps/pe/start/end/text-start/text-end`, `rtl:`). Directional arrow icons need `rtl:rotate-180`.
- Every clickable element shows `cursor-pointer` (global rule already in `globals.css`).
- `EmptyDataState` takes the **translation key** as `title`, not translated text.
- Don't reformat unrelated files. Remove dead code and `console.log` in files you touch.

### 0.2 Figma (read-only, through the Desktop Bridge)
- File **joocare (Copy)**, fileKey `2MqpRGApcnGRWlH5RdUHHo`, page **"02 — Joocare Platform — Phase 2"**.
- Use the **figma-console** MCP: `figma_get_status` (check the connection), `figma_capture_screenshot {nodeId}` (see a frame), `figma_execute` (read text, sizes, hidden layers, prototype links), `figma_get_selection` (what the user selected).
- **Never create, edit, move or delete anything in Figma.**
- Screenshot every frame before you build it, and compare your page with it at the end.
- Dump a frame's text and structure (use a sub-node for tall frames):
  ```js
  const root = await figma.getNodeByIdAsync('NODE_ID'); const out = [];
  const walk = (n, d) => { const pad = '  '.repeat(d);
    if (n.visible === false) { out.push(pad + '[HIDDEN] ' + n.type + ' ' + n.name); return; }
    if (n.type === 'TEXT') out.push(pad + 'T "' + n.characters + '" ' + (typeof n.fontSize === 'number' ? n.fontSize : 'mixed') + 'px');
    else out.push(pad + n.type + ' ' + n.name + ' ' + Math.round(n.width) + 'x' + Math.round(n.height) + (n.reactions && n.reactions.length ? ' [link]' : ''));
    if ('children' in n) n.children.forEach(c => walk(c, d + 1)); };
  walk(root, 0); return out.join('\n');
  ```
- Prototype links (`[link]`): read `node.reactions[].actions[]` → `navigation` + `destinationId`, then `getNodeByIdAsync(destinationId).name` — that tells you which modal/page a button opens.
- Use `getMainComponentAsync()` (not `.mainComponent`) on instances.
- **Hidden layers (`[HIDDEN]`) = don't build.**
- Fonts/sizes in Figma are a guide; map them to the nearest Tailwind scale and existing tokens.

### 0.3 Main Figma nodes

| Area | Node |
|---|---|
| Job listing (admin) | `10086:84376` |
| Job listing (non-admin) | `10527:40433` |
| Job details open / closed / draft / paused | `10086:84578` / `10086:84854` / `10086:85108` / `10086:85362` |
| Screening summary card · Posted by card | `11531:97096` · `11531:102954` |
| Screening questions modal (read-only) | `11661:114959` |
| Pause · Resume · Close confirmations | `10086:88570` · `10086:88587` · `10086:88621` |
| Closed success · Resumed success | `10086:88560` · `10086:88550` |
| Delete job | `10086:88672` |
| Saved as draft · Published | `10086:88528` · `10895:61678` |
| Post job step 1 (assessment ON) · OFF | `10086:87354` · `11531:108027` |
| Assessment container · fit alert · preview sheet · question details | `11073:43278` · `11531:107888` · `11661:118968` · `10527:42699` |
| Step 2 main · empty · template preview · template added | `10086:87426` · `11535:120986` · `11531:116889` · `11531:118333` |
| AI JD Builder coming soon | `11531:110531` |
| Skills selector · Question templates · Templates section | `11073:45434` · `11319:65002` · `10181:44166` |
| Question card closed / expanded | `11073:44432` (variants `10102:63987`, `11073:44433`) |
| Delete question | `11661:97095` |
| Screening question builder (all variants + **rules**) | section `12795:112132`, handoff notes `12795:114262` |
| Step 3 preview · summary card | `10086:87709` · `11531:103262` |
| Tester Q&A (business rules) | `10936:75575` (job creation), `10939:79105` (job questions), `10945:72507` (jobs) |

### 0.4 Already done — don't redo
- Listing: search (`search` param, debounced), Recruiter filter (`recruiter` param), pin icon (local state). URL filters via `src/shared/hooks/useUrlFilters.ts`.
- Step 2 Skills: Recommended Skills + Selected Skills UI (`src/features/jobs/components/post-job/RecommendedSkills.tsx`, `SelectedSkills.tsx`, `hooks/useRecommendedSkills.ts`, `MultiSelectInputField` prop `hideSelectedChips`).
- Pipeline candidates / AI Talent Match / project + assessment modals for candidates — out of scope.

### 0.5 Reuse map (search before you create)
| Need | Reuse |
|---|---|
| Success modals | `src/shared/components/modals/SuccessModal.tsx` (`visual`, `callout`, `primaryAction`, `secondaryAction`, `children`) |
| Confirmations | `src/shared/components/modals/AlertModal.tsx`, `DeleteModal.tsx`, `ModalHeading.tsx` |
| Fields | `InputField`, `SelectInputField`, `MultiSelectInputField`, `TextareaField`, `LabelCheckbox`, `SearchInput` |
| Toggle / accordion / dialog | `src/shared/components/ui/switch.tsx`, `accordion.tsx`, `dialog.tsx` |
| Pagination / empty | `CustomPagination`, `EmptyDataState` |
| Question builder | `src/features/company-assessments/components/create/AssessmentQuestionModal.tsx`, `QuestionChoiceFields.tsx`, `AssessmentQuestionCard.tsx`, `QuestionPreview.tsx`, `hooks/useAssessmentQuestionForm.ts`, `validation/assessment-builder-schema.ts`, `constants/assessment-builder.ts` |
| Assessment picker / preview | `AssignAssessmentModal.tsx` (category → assessment selects), `details/AssessmentSummary.tsx`, `details/AssessmentQuestionsOverview.tsx`, data `constants/assessment-data.ts` (`categorySeeds`, `assessmentSeeds`) |
| Read-only question list | `results/AssessmentAnswersReview.tsx` (accordion) |
| Creator card | `details/AssessmentCreatorCard.tsx` |
| Job header logo box | `src/features/jobs/components/PositionCard.tsx` |
| Lottie | `public/assets/lottie/warning.json`, `delete.json`, `successfully.json` |

### 0.6 Product defaults (use these; each is marked ⚙️ where it applies)
The user can change any of these before you start. Put a one-line code comment where a default stands in for a missing API.

| # | Question | Default to build |
|---|---|---|
| D1 | Which roles see the admin listing | **Don't build role gating** (no permission source exists). Everyone keeps the admin view. |
| D2 | Can a closed job be reopened | **Yes** — show Resume on closed; it calls the existing status update with `open`. Backend errors already show a toast. |
| D3 | Delete for open / paused / closed | **Yes**, as Figma shows. |
| D4 | Menu labels | Verbs: **Edit · Close · Pause · Reactivate · Complete Post · Delete**. Closed menu = **Reactivate · Delete**. Draft menu = **Complete Post · Delete**. |
| D5 | After a status change | Show the success modal, stay on the page, refresh data with query invalidation + `router.refresh()` (remove `window.location.reload()`). No success toast when a success modal shows. "Back to Job Postings" → navigate to `/company/job-management` on the details page, just close on the listing. Pause has no success modal → keep its toast. |
| D6 | Post-job modals | Remove every 3 s auto-redirect. Remove the extra "Save as draft" confirmation. Edit mode keeps its "Job updated successfully" copy but uses the same two-button layout as Published. |
| D7 | Assessment link | Final-frame selects (Library → Category → Assessment + eye). One label for both states: **"Link Assessment to this Job"**. Assessment required when ON. Send `assessment_id` in the step-1 payload (comment: pending backend). Data from preview seeds until the assessments API exists. |
| D8 | Screening questions | Keep questions in the wizard form state and send them with step 2 as `screening_questions` (comment: pending backend). Templates from a static constants list. One-at-a-time preview flow (not batch). Success = toast "Question added successfully". No max count. Input Text: no Required block, answer is a reference only. Mark = positive integer. Type label **"Multi Select"**. |
| D9 | Copy conflicts | Keep **"Job Function"**, keep Specialty as a text input, keep "Add new certification". |
| D10 | Recommended skills source | Existing `/skills` with the selected job title (`watch('title')`, ignore the "other" value). |

### 0.7 How to check your work
- `npx tsc --noEmit 2>&1 | grep "^src/"` → no output. `npx eslint <changed files>` → no new errors.
- Run the app (`npm run dev`, port 3000) and check every screen in **English, Arabic (RTL) and mobile (390px)**, plus no console errors. Playwright is fine.
- Employer login: **ask the user for the test credentials** and pass them only as runtime env vars (`JC_EMAIL`, `JC_PASS`). **Never write credentials into any file.**
- After touching shared modals or the assessments builder, re-check the pages that already use them (Talent Database message modal, assessments builder, candidate apply modal).
- Compare each screen side by side with its Figma screenshot.

---

## 1. Shared foundations (do first)

### 1.1 `AlertModal` — rich confirmation
File: `src/shared/components/modals/AlertModal.tsx`
- Add optional props without breaking existing callers:
  - `children` (rendered between description and buttons),
  - `visual` (replaces the default warning Lottie),
  - `tone: 'default' | 'warning' | 'success' | 'destructive'` (confirm button colour),
  - `confirmIcon` + `confirmIconPosition: 'start' | 'end'`.
- Replace the hardcoded `"Saving..."` with a translation (same fix in `DeleteModal.tsx`).
- Add `cancelLabel` usage where callers pass "Cancel".

### 1.2 Info panel component
New `src/shared/components/modals/ModalInfoPanel.tsx` (used by AlertModal children and SuccessModal):
- Rounded tinted box, round "i" icon, 17px bold heading, list of 3–4 items each with a filled round check icon + 15px text.
- `tone: 'warning' | 'success'` → warning = `bg-warning/10` + `text-warning-strong` icons; success = `bg-primary-bg` + `text-primary`.

### 1.3 `SuccessModal` callout
File: `src/shared/components/modals/SuccessModal.tsx`
- Add `icon?: ReactNode` to `SuccessModalCallout` (52–56px round icon), make the callout title green 18px semibold.
- Add a way to put the outline (secondary) button first (Figma "Published" order) — e.g. `actionsOrder: 'primary-first' | 'secondary-first'`.

### 1.4 `CustomPagination` start layout
File: `src/shared/components/CustomPagination.tsx` (shared — don't change its default look)
- Add props, e.g. `align="start"` and `tone="strong"`: row aligned to start; "Show 1 - 10 from 57" all `text-foreground font-semibold text-sm`; inactive page numbers dark semibold; optional `showLastPage={false}`.

### 1.5 `SelectInputField` hint
Add `hint?: string` like `MultiSelectInputField` (small muted text after the label).

### 1.6 Illustrations
Export from Figma (PNG/SVG) into `public/assets/jobs/`:
- pause (orange briefcase + pause) from `10086:88570`
- resume (green briefcase + play) from `10086:88587`
- close / closed (document with green check) from `10086:88621` / `10086:88560`
- saved / published (document with check + confetti) from `10086:88528` / `10895:61678`
- callout icons: bulb (`10086:88528`), megaphone (`10895:61678`)

If you can't export, use the existing Lottie files and say so.

---

## 2. Job status modals + success modals

### 2.1 One shared component
- Today the same modals are duplicated in `src/features/jobs/components/JobCard.tsx` (~L341–371) and `JobActionButtons.tsx` (~L139–179).
- Create `src/features/jobs/components/status/JobStatusModals.tsx` + hook `src/features/jobs/hooks/useJobStatusActions.ts`. The hook holds `{ action: 'pause' | 'resume' | 'close' | 'delete' | null, success: 'closed' | 'resumed' | null }`, calls `useUpdateCompanyJobStatus` / `useDeleteCompanyJob`, and exposes `open(action)`.
- Use it from **both** the card menu and the details buttons. Delete the duplicated code.
- ⚙️ D5: remove `window.location.reload()` (`JobActionButtons.tsx` ~L39); invalidate `['company-jobs']` and the job details query; `router.refresh()` if the page is server-rendered. Show the success modal instead of the toast for close/resume (move toast control into the hook — `useUpdateCompanyJobStatus.ts` L44–45 toasts on every success today; add an option to skip it).

### 2.2 Pause — `10086:88570`
- Illustration: orange briefcase + pause, tone **warning**.
- Title: **"Pause Applications for This Position?"**
- Body: **"This will temporarily stop new applications from being submitted. The vacancy will no longer appear in search results until it is reactivated."**
- Panel **"While paused:"**
  - No new applications will be accepted
  - The vacancy will not appear in candidate search results
  - Existing applications will remain accessible
  - You can reactivate the vacancy at any time
- Buttons: orange **"Pause Vacancy"** (pause icon before the text) · outline **"Keep Active"** (closes). X closes.
- After success: no success modal; keep the toast; page shows the paused state.
- Replace keys `companyPage.jobs.card.modals.pause.*` (today "Would you like to pause applications for this position?", red "Yes, stop the advertisement", cancel "Back").

### 2.3 Resume — `10086:88587` (from paused and closed)
- Illustration: green briefcase + play, tone **success**.
- Title: **"Resume Applications for This Position?"**
- Body: **"Reactivating this job posting will make it visible to qualified medical professionals and allow new applications to be submitted. The vacancy will become searchable and continue using its previous posting settings."**
- Panel **"Once reactivated:"**
  - New applications will be accepted
  - The vacancy will appear in search results
  - Candidate notifications and visibility will resume
  - Existing applications and workflow data will remain unchanged
- Buttons: green **"Reactivate Vacancy"** (arrow-right after the text) · outline **"Keep Paused"**. For a closed job use **"Cancel"** as the secondary label.
- On success → **Applications Resumed Successfully** (2.6).

### 2.4 Close — `10086:88621`
- Illustration: document with green check, tone **success**.
- Title (already matches): "Has this position been successfully filled?"
- Body (already matches): "Closing this job posting will archive the role and remove it from visibility to medical professionals. Please ensure all relevant applicant details have been saved before proceeding."
- Panel **"Before you close, make sure you have:"**
  - Reviewed all relevant applications
  - Saved important applicant details
  - Completed any ongoing communication
- Buttons: green **"Yes, close the advertisement"** (arrow after) · outline **"Cancel"** (today "Back").
- On success → **Job Posting Closed Successfully** (2.5).

### 2.5 🔴 Closed success — `10086:88560`
- `SuccessModal`, document-with-check visual.
- Title **"Job Posting Closed Successfully"**
- Body **"The announcement has been successfully closed. The role has been archived and is no longer visible to medical professionals."**
- One centred green button **"Back to Job Postings"** (arrow-right). ⚙️ D5 for where it goes. No auto-timeout.

### 2.6 🔴 Resumed success — `10086:88550`
- Green briefcase + play visual.
- Title **"Applications Resumed Successfully"**
- Body **"The announcement has been successfully reposted. Your vacancy is live again, searchable, and open to new applications."**
- Button **"Back to Job Postings"** (arrow). ⚙️ D5.

### 2.7 Delete — `10086:88672`
- Keep `DeleteModal`. Title/body already match. Confirm **"Confirm deletion"** (today "Confirm Deletion"), cancel **"Cancel"** (today "Back"). Redirect after delete already matches.

**Accept:** each modal matches its Figma screenshot in en/ar; both the card menu and the details page open the same modals; no reload; success modals show and close correctly.

---

## 3. Job details page — `10086:84578` / `84854` / `85108` / `85362`
Files: `src/app/[locale]/company/(sidebar-layout)/job/[slug]/page.tsx`, `src/features/jobs/components/JobActionButtons.tsx`, `JobDescriptionCard.tsx`, `JobStatusBadge.tsx`, `JobShareCard.tsx`, `types/jobs.types.ts`.

### 3.1 Actions per status (equal-width pills, 34px high)
| Status | Buttons (in order) |
|---|---|
| Open | **Edit** (green, edit icon → `/company/post-job?editId=`) · **Pause** (orange `bg-warning`, eye-slash) · **Close** (red, check) — today Close is before Pause |
| Paused | **Resume** (green, **no icon** — remove the Play icon) · **Delete** (red, trash) — today Resume only |
| Closed | **Resume** · **Delete** — today nothing (⚙️ D2, D3). Figma says "Deleted" — typo, use "Delete" |
| Draft | **Complete Post** · **Delete** (unchanged) |

- Draft "Complete Post" must open the wizard at **step 2** (Figma links to `employer/post-job/step-2-requirements`). `PostJobForm.tsx` always starts at `currentStep = 0` (~L203): when in complete mode (`jobId` param) start at step index 1.

### 3.2 Right column
- **Share card only when status is open** (today always rendered, page.tsx ~L80–83).

### 3.3 Status bar date
- Format the date like **"21 December 2026 , 4:00AM"** with the active locale (`useFormatter` / `Intl`) — today the raw API string is shown (page.tsx ~L48 → `JobStatusBadge`). Open hides the date (unchanged).

### 3.4 🆕 "Screening questions & assessment attached to this job" card — `11531:97096`
- Inside the Job Description card, under Skills, in all statuses.
- Light-green card (`bg-primary-bg`, `border-primary`, rounded), white 36px rounded icon tile with a document icon.
- Title **"Screening questions & assessment attached to this job"**.
- Row 1: chat icon · bold **"Screening questions"** · muted **"{total} questions · {required} required"** · green underlined **"View questions ›"** → opens 3.5.
- Row 2: check-circle icon · bold **"Assessment"** · muted assessment title (ellipsis) · **"View assessment ›"** → `/company/assessments/{categoryId}/{assessmentId}` (route exists).
- Hide a row when empty; hide the card when both are empty (Figma has no empty state).
- Data: add optional fields to `JobDetails` (`screening_questions?`, `assessment?: { id, title, category_id }`) with a comment "pending backend". Make it a reusable component — step 3 uses it too (section 9).

### 3.5 🆕 Screening Questions modal (read-only) — `11661:114959`
- Title **"Screening Questions ({count})"**, 48px green circular close (X).
- List of cards (white, border, rounded): 40×40 light-green badge **"Q1"…**, 14px question text, " **(Required)**" suffix on required ones, round grey chevron.
- Clicking expands the card **read-only**: question type, options, correct answer. Don't build edit/delete here (hidden in Figma).
- Reuse the accordion pattern from `AssessmentAnswersReview.tsx`. Shared with step 3.

### 3.6 🆕 "Posted by" card — `11531:102954`
- White card, border, rounded, under the screening card, all statuses.
- 44px round light-green avatar with green initials.
- **"Posted by "** + bold name (16px); second line muted 14px **"{role} · {email}"**.
- End side: muted 12px **"Created on"** above **"12 Sep 2026, 10:24 AM"** (locale-formatted).
- Data: optional `created_by?: { name, role, email, image }` on `JobDetails` (pending backend); hide the card when missing. Reuse/extend `AssessmentCreatorCard` or build a small jobs component.

### 3.7 Benefits block
- `JobDescriptionCard.tsx` ~L23–33 has a commented-out "Learn more about our benefits" + Benefits list. There's no API field; treat it as part of the rich-text description → **delete the commented code**.

**Accept:** all 4 status pages match Figma in en/ar/mobile; correct buttons/modals per status.

---

## 4. Job listing — `10086:84376`
Files: `JobManagementSection.tsx`, `JobCard.tsx`, `JobFilter.tsx`, `useJobListingFilters.ts`.

### 4.1 Toolbar
- Status placeholder **"Status"** (today "Filter by status", key `companyPage.jobs.status.placeholder`). Add an **"All statuses"** first option (same pattern as "All recruiters" in `JobRecruiterFilter`) that clears the `status` param.
- ⚙️ D1: no role gating (non-admin frame `10527:40433` hides Recruiter, Post a Job and pin — skip for now, leave a comment).

### 4.2 Card — `10086:84395`
- Container: white, 1px `border-border`, radius 16 (`rounded-2xl`), padding 16, vertical gap 16, **no shadow** (today shadcn `Card` defaults: `rounded-xl py-6 gap-6 shadow-sm`). Grid stays 2 columns gap 16.
- Logo inside a 52×46 `bg-primary-bg` box, radius 12, gap 14 to the text (today a bare image).
- Title 18px semibold, **one line with ellipsis** (today wraps). Second line keeps the company name (Figma layer says "Job Category" — leave a comment). Date line 12px muted, **locale-formatted** "21 December 2026 , 4:00AM" (today raw); hidden on draft.
- Description: 14px `text-muted-foreground`, **2-line clamp** with ellipsis (today a 70-char slice in dark `prose`).
- **Divider** (1px `border-border`) between description and buttons, on every card incl. draft.
- Buttons: two equal pills **34px high**, 14px regular (today `size="pill"` = 52px).
  - "Received Applications" (`bg-secondary`) with the count **bold** after the label (gap 8). Hide the number when missing.
  - "Job Details" (green) with arrow-right.
- **Draft card: no buttons** (today "Job Details" still shows).
- Status bar: full width, **24px high**, radius 12, padding 8, 8px dot + **14px** label, date at the end **10px muted**. Tints: open `primary` on `primary/8`, closed `secondary` on `secondary/8` (today a navy tint in `badge.tsx`), paused `destructive` on `destructive/8`, draft muted on muted. Open hides the date.

### 4.3 ⋯ menu (every status, incl. Closed) — ⚙️ D3, D4
- Items 16px semibold muted with 20px icons; Delete in red.
- Open: **Edit · Close · Pause · Delete**
- Paused: **Edit · Close · Reactivate · Delete**
- Closed: **Reactivate · Delete**
- Draft: **Complete Post · Delete**
- Each opens the shared modals from section 2.

### 4.4 Pagination
- Use the new `CustomPagination` start layout (1.4): start-aligned, "Show 1 - 10 from 57" dark semibold, dark page numbers.
- Delete the unused `src/features/jobs/components/JobsPaginationSection.tsx` (not imported anywhere — check first).

**Accept:** listing matches `10086:84376` in en/ar/mobile; menu per status works; filters still go to the URL and the API.

---

## 5. Post job — shared parts
Files: `src/app/[locale]/company/post-job/page.tsx`, `PostJobForm.tsx`, `JobPostForm.tsx`, `validation/job-post-schema.ts`, `types/job-steps.types.ts`.

### 5.1 Copy + layout
- Step labels: **"Basic Details" · "Requirements & Content" · "Preview"** (keys `companyPage.postJob.steps`, today "Job Details" · "Job Description & Requirements" · "Job Preview").
- Button **"Save as draft"** (today "Save as Draft").
- Wizard card **1020px** max width (today `max-w-7xl`, PostJobForm ~L679).

### 5.2 Saved as draft — `10086:88528` (⚙️ D6)
- "Save as draft" opens this directly — **remove** the AlertModal confirmation (PostJobForm ~L684–693, ~L778–787).
- Visual: document with check + confetti.
- Title **"Saved Successfully!"**
- Body **"The job details have been saved. You can continue editing and publish the posting at any time from Job Management."**
- Callout (bulb icon): **"What’s next?"** — **"You can review, make changes, or publish this job when you’re ready from the Job Management section."**
- Buttons: green **"Go to Job Management"** (arrow) → `/company/job-management` · outline **"Continue Editing"** (closes, stays in the wizard).
- **Remove the 3 s `router.push`** in `handleSaveDraft` (~L353–365).

### 5.3 Published — `10895:61678` (⚙️ D6)
- Visual: document with check + confetti.
- Title **"Congratulations!"** (34px) · subtitle **"Your job has been successfully published."** (19px semibold).
- Body **"Your vacancy is now live and visible to qualified candidates.\nYou can view and manage applications anytime from your dashboard."**
- Callout (megaphone icon): **"Your job is now live"** — **"Candidates can now find and apply for this position."**
- Buttons (outline first): outline **"View Job Posting"** → `/company/job/{id}` · green **"Go to Dashboard"** (arrow) → `/company/dashboard`. The id comes from `resolveJobId()` / `reviewJob.id`.
- X → navigates to `/company/job-management`.
- **Remove the 3 s redirect** in `onSubmitCreateOrComplete` (~L596–610).
- Edit mode (`onSubmitEdit` ~L613–629): keep its "Job updated successfully!" title/description, same buttons, no redirect.

---

## 6. Step 1 — Basic details (`10086:87354`, OFF state `11531:108027`)
File: `JobPostStepOne.tsx` (large file — put new parts in their own components under `components/post-job/`).

### 6.1 Copy fixes
- Specialty placeholder **"ex: Cardiology"** (today "ex: specialty"). Keep it a text input (⚙️ D9).
- Job Category placeholder **"ex: Cardiology"** (today none → falls back to "Select an option").
- Professional License placeholder **"ex: Without Medical license"** (today "ex: DHA License").
- Seniority Level: small muted hint **"(optional)"** after the label (needs 1.5). Arabic "(اختياري)".
- Keep "Job Function" and the custom certification input (⚙️ D9).

### 6.2 🆕 Assessment card (last card, after Availability) — `11073:43278` (⚙️ D7)
- Same grey card style as the other step-1 cards; heading **"Assessment"** (same style as "Availability").
- Row: 18px semibold label **"Link Assessment to this Job"** at the start, `Switch` at the end; clicking the row toggles it.
- ON shows:
  - Full-width select **"Assessment Library"** (placeholder "Select"). Options: "JooCare Library" / "My Assessments" (from `categorySeeds[].source` = `joocare` / `company`).
  - Two columns: **"Assessment Category"** select (filtered by library) · **"Assessment"** select (filtered by category, disabled until a category is picked) + a 52×52 dark round **eye** button (disabled until an assessment is picked) → opens 6.3.
- Exclude paused assessments (`pausedAt`).
- Turning the switch OFF clears the three values (same pattern as the salary toggle, `JobPostStepOne.tsx` ~L571–578).
- Validation: when ON, library/category/assessment are required (factory schema messages, en/ar).
- Form state: add `assessmentEnabled`, `assessmentSource`, `assessmentCategoryId`, `assessmentId` to `step1Schema` + `jobFormDefaults`; send `assessment_id` in `buildStepOnePayload` and `buildUpdatePayload`; hydrate in `mapJobToFormData` from `job.assessment` when present (all with a "pending backend" comment).
- Data: hook `useAssessmentOptions` in jobs reading `@/features/company-assessments/constants/assessment-data` (preview seeds; swap for the API later).

### 6.3 🆕 Assessment Preview sheet — `11661:118968`
- Large dialog (~1076px), grey overlay closes it.
- Header **"Assessment Preview"** + subtitle **"Review the assessment structure, scoring criteria and questions before linking it to this job."** + green round close.
- Card **"Assessment Summary"**: label "Assessment Title", title, description; four tiles **Questions** · **Passing Score** · **Assessment Duration** ("25 Minutes") · **Permitted Attempts**; **"Assessment Structure"** with green type tags ("8 Single Select", "12 Yes / No", "4 Multiple Choice").
- Card **"Questions Overview"**: table `# · Question · Type · Score %` + green eye per row → 6.4; pagination.
- Reuse `AssessmentSummary` + `AssessmentQuestionsOverview`. Add props for the different labels rather than changing the assessment details page copy.

### 6.4 Question Details modal — `10527:42699`
- Reuse `AssessmentQuestionModal` with `readOnly`. Title **"Question Details"** in this context (today "Question Preview" — add a prop), green round close.

### 6.5 🆕 Assessment fit alert — `11531:106582` / `11531:107888`
- When the switch is ON, **Next** opens this before going to step 2. OFF → goes straight to step 2.
- `AlertModal` (warning Lottie). Title **"Is this assessment the right fit for this job?"**
- Body **"Candidates applying for this job will be asked to take “{title}” ({count} questions). Make sure it matches the job’s specialty and seniority level before you continue"**
- Buttons **"Yes, continue"** (dark, wider — runs the existing step-1 save/next) · outline **"Cancel"** (stays, no API call).
- Show on create and complete; in edit mode only if the assessment changed.

---

## 7. Step 2 — Requirements & Content (`10086:87426`)
File: `JobPostStepTwo.tsx` (split new parts into `components/post-job/`).

### 7.1 Collapsible section cards
- Each section is a white card with a 21px title and a chevron in a 36px grey circle (reuse `ui/accordion`):
  1. **Job Description** (open by default)
  2. **Skills** (closed by default)
  3. Grey container titled **"Questions"** (21px grey) holding two cards: **Question Templates** (open) and **Custom Question** (closed; opens automatically once a question exists).
- Prev (outline) / Next (dark) pills below (existing).

### 7.2 Editor toolbar — `CustomEditor.tsx` (CKEditor 5)
- Target order: undo, redo | heading dropdown ("Normal text", headings) | alignment | font colour | bold, italic, underline, strikethrough, inline code, remove format | bulleted list, numbered list | link, image, code block, block quote, horizontal line.
- Add plugins: Heading, Alignment, Underline, Strikethrough, Code, RemoveFormat, CodeBlock, BlockQuote, HorizontalLine. Remove fontSize, fontFamily, fontBackgroundColor, mediaEmbed from the toolbar.
- Editor area in a light grey box (`bg-muted`).

### 7.3 🆕 AI JD Builder (coming soon) — button under the editor, modal `11531:110531`
- Centred green pill **"AI JD Builder"** with a stars icon.
- Modal (700px): X at the top start; 120px round light-green icon; orange badge **"COMING SOON"**; title **"AI JD Builder is coming soon"**; body **"Write and polish job descriptions with AI in seconds. This feature will be available with the Joocare AI plans — you can keep writing your description manually for now"**.
- Buttons **"Got it"** (dark, wider) · outline **"Notify me when it’s live"** — both close; "Notify me" also shows a toast "We’ll let you know when it’s live" (no API).
- Don't build the AI chat panel (`10086:87585`, future).

### 7.4 Skills follow-ups (UI already built)
- Put Skills inside its collapsible card (7.1).
- ⚙️ D10: `JobPostStepTwo.tsx` passes the URL `jobId/editId` as `job_title_id` to `useGetSkills` / `useRecommendedSkills`. Use the form's job title instead: `watch('title')`, skip when it equals the "other" option (`OTHER_OPTION_VALUE` in `PostJobForm.tsx`).
- Keep chip styles as built (Figma: outline chips; clicked chip moves to Selected Skills).

### 7.5 🆕 Question Templates card — `11319:65002`, `10181:44166`
- Helper text (14px): **"Click any template to quickly add a pre-configured screening question."**
- Grey pill chips with a "+" icon, in this order:
  Education, Professional License, Medical License, Years of Experience, Board Certification, Specialty, Hospital Experience, ICU Experience, Emergency Experience, Surgery Experience, Language, English Proficiency, Arabic Proficiency, Availability, Night Shift, Weekend Shift, Relocation, Current Location, Work Authorization, Visa Status, Background Check, Drug Test, Reference Check, Driver's License, Computer Skills, Communication Skills.
- Collapsed: first 11 chips + green **"Show More"**; expanded: all + **"Show Less"**.
- Chip states: added → ✓ icon + green outline; being previewed → dark filled.
- ⚙️ D8: static constant in `constants/index.ts` (`SCREENING_QUESTION_TEMPLATES`) with `{ id, labelKey, question }`. Chip labels are UI text → translate (en/ar). Question text is preview content (plain string). Use the Figma example for Professional License: "Do you hold an active professional license from the Saudi Commission for Health Specialties (SCFHS)?" and write one clear Yes/No question per other template (comment: preview until the templates API).

### 7.6 🆕 Template preview card — `11531:116889`
- Shown above the chips when a chip is clicked.
- Green **"Q"** badge + question text (18px).
- **"Question Type"** with hint **"Templates are Yes / No only"** and a read-only "Yes / No" field.
- **"Choose the correct answer"** — Yes / No toggle (selected = green filled, other = grey).
- Question Requirement (shared with the builder, 8.7): **"Is this question required?"** + **"Candidates must answer required questions to submit"**, pills **Required** (default) / **(Optional)**.
- Buttons outline **"Cancel"** (hides the card) · dark **"Add to questions"** (arrow-right).

### 7.7 After adding — `11531:118333`
- Preview hides; chip shows ✓; question appended at the end of the Custom Question list and highlighted light green for a moment; Custom Question card opens; toast **"Question added successfully"** (⚙️ D8); user stays in place.

### 7.8 🆕 Custom Question card — empty `11535:120986`
- Subtitle **"Create a custom screening question tailored to your hiring needs."**
- Empty state: files icon (100px), **"No screening questions yet"**, **"Pick a ready-made question from Question Templates or create your own custom question."**, **"Screening questions are (Optional) — you can skip this and continue."**
- Full-width dashed green **"+ Custom Question"** button → opens the builder (section 8).
- Next stays enabled with no questions.

### 7.9 🆕 Added questions list — `11073:44432`
- One white card per question (88px): green **"Q1"** badge, one-line text, red round delete (trash), grey round chevron. Templates and custom questions share one list and numbering.
- Expanding a card = inline edit (`11073:44433`): type select, question text, "Answer Options" A–D with delete, "+ Add Option", "Correct Answer", divider, **Cancel** / **Save Changes**. For a template (Yes/No) show the Yes/No answer, not A–D. Reuse the builder form fields from section 8.
- Show a count line **"{count} questions added"** above the list (no "x / 10").
- No pagination.

### 7.10 Delete question — `11661:97095`
- `DeleteModal`: title **"Delete this question?"**, body **"This question will be removed from the job's screening questions and can't be restored"**, **"Confirm deletion"** / **"Cancel"**.
- After delete: renumber Q1…Qn; a template question's chip goes back to "+".

### 7.11 Data + payload (⚙️ D8)
- Add `screeningQuestions` (array) to `step2Schema` + defaults; type in `types/job-steps.types.ts`:
  `{ id, source: 'template' | 'custom', templateId?, type: 'single' | 'multi' | 'yes-no' | 'text', question, mark, options: { id, text }[], correctOptionIds: string[], correctText?, required }`.
- Send as `screening_questions` in the step-2 post and in `buildUpdatePayload`; hydrate from `job.screening_questions` in `mapJobToFormData` when present. Comment: pending backend.
- Logic in a hook `useScreeningQuestions` (add/edit/delete/renumber, template added state).

---

## 8. Screening question builder — section `12795:112132` (read every note in `12795:114262`)

### 8.1 Share, don't copy
- The assessments builder already has most of this (`AssessmentQuestionModal`, `useAssessmentQuestionForm`, `QuestionChoiceFields`, `assessment-builder-schema`, `MAX_QUESTION_OPTIONS = 5`, stable ids).
- Extract the reusable pieces into `src/shared/components/questions/` (options editor, Yes/No toggle, correct-answer cards, requirement toggle) and keep the assessments modal working on top of them.
- The screening modal lives in `src/features/jobs/components/post-job/ScreeningQuestionModal.tsx`. Its schema goes in `src/features/jobs/validation/screening-question-schema.ts`.
- Differences from assessments: "Mark" instead of score % (positive integer, no %, no max), no attachment, an "Input Text" type, Required/Optional, correct answer as cards (not a dropdown), button "Submit".
- **After the change, re-test the assessments create/edit flow.**

### 8.2 Modal shell
- 964px, title **"Create Screening Question"** (28px), 48px green round close (no Cancel button).
- Row 1: question type dropdown + **"Mark"** input (placeholder "Mark").
- Full-width question input (placeholder **"Your Question"**).
- Body per type (below), Question Requirement block, full-width green **"Submit"**.
- Edit reuses the same modal prefilled (title "Edit Screening Question").

### 8.3 Types — dropdown `10173:42802`
- Order: **Single Select · Multi Select · Yes / No · Input Text**. Current type shown green.
- Switching type keeps compatible values (question, mark, options, requirement) — today `changeType` resets them.

### 8.4 Single / Multi Select
- **"Answer Options"** label; rows **A.–E.**: letter, rounded input, red delete icon.
- Default **3** options; min 2 / max 5. **"+ Add Option"** disabled at 5; delete disabled at 2; deleting renumbers A–E and drops that option's correct state.
- Counter **"{count} of 5 options · minimum 2"**.
- Divider, then **"Correct Answer · select one"** (Single, radio cards) or **"Correct Answers · select one or more"** (Multi, checkbox cards): a row of equal pill cards **A, B, C…** matching the options. Keyboard: arrows + Space for radios, Tab + Space for checkboxes, visible focus.

### 8.5 Yes / No
- **"Correct Answer"** with two equal pills **Yes** / **No**, **nothing preselected** (assessments preselect "yes" — don't for screening).

### 8.6 Input Text
- **"Correct Answer"** text input, placeholder **"Your Answer"** (reference answer only, ⚙️ D8). **No** Question Requirement block.

### 8.7 Question Requirement — `11531:115393`
- **"Is this question required?"** (16px bold) + **"Candidates must answer required questions to submit"** (14px muted).
- Two pills **Required** (default, green when selected) / **(Optional)**.
- Shown for Single, Multi, Yes/No.

### 8.8 Validation (factory schema, en/ar messages)
- Trim question and option text; question required; every visible option required; **reject duplicate options** (case-insensitive after trim); Mark positive integer; Single = exactly one correct; Multi = at least one; Yes/No = one; Input Text = non-empty answer.
- Inline red borders + focus the first invalid field.
- Red 14px summary line above Submit:
  - Single: **"Enter a question, a positive mark, 2–5 unique options and one correct answer."**
  - Multi: **"Enter a question, a positive mark, 2–5 unique options and at least one correct answer."**
  - Only the answer missing: **"Choose exactly one correct answer before saving."** / **"Choose at least one correct answer before saving."**
- Don't build the prototype hint "Prototype: click a field to load a complete example."

### 8.9 Submit
- Validate → add/update the question in the form state (7.11) → close → append to the list → toast "Question added successfully" (or "Question updated").
- Ignore the old success modal `10181:43713` and the "Saved" demo variant.

---

## 9. Step 3 — Preview (`10086:87709`)
File: `JobReviewPanel.tsx`.
- Add the **summary card** from 3.4 under Skills (count text "{n} questions"), with **View questions** → modal 3.5 and **View assessment** → opens the assessment preview dialog from 6.3 (not a page change — leaving the wizard loses its state).
- Company logo: use `job.company.image` with the `/assets/new-logo-dot.svg` fallback inside the `PositionCard` logo box (today always the placeholder, ~L585–591).
- Copy: **"Job Description"** (today "Job description"), **"Skills:"**, salary sub-label **"{type} salary"** (e.g. "Yearly salary", today just "Yearly"), "Save as draft". Keep "Job Function" (⚙️ D9).
- Published / Saved modals → section 5.

---

## 10. Out of scope / don't build
- Anything hidden in Figma: AI Talent Match / Ai Filter buttons on cards, edit/delete in read-only question cards, delete-question from the details page, question list pagination.
- Role-based UI (⚙️ D1), External assessments (QA ID4, pending), AI JD Builder chat panel, batch template add (QA ID5), template "Duplicate & edit" / TEMPLATE badge (QA ID12), extra listing filters Assessment/Questions/Date range and Pin-in-menu (QA ID45), Benefits fields.
- Backend work. Where an API field doesn't exist, type it as optional, render only when present, and add a short "pending backend" comment.

## 11. Suggested order + commits
1. Section 1 (foundations) → 2 (status modals) → 3 (details) → 4 (listing)
2. 5 (post-job modals) → 6 (step 1) → 8 (builder, shared) → 7 (step 2) → 9 (step 3)
3. After each section: tsc + eslint + browser check (en / ar / mobile) + tick the items in [EMPLOYER-TODO.md](EMPLOYER-TODO.md).
4. Don't commit or push unless the user asks. When you finish, report what was built, what used a default (⚙️), and anything you couldn't match.
