# Phase 2 — Candidate Design Gaps

Comparison of the Figma **"02 — Joocare Platform — Phase 2"** candidate/guest selection (file `joocare (Copy)`) against the current website on branch `development`.
Every finding was checked against the Figma frames (text, including hidden layers, plus screenshots) and against the code. Hidden Figma layers are treated as out of scope unless they are listed under Questions.

**Classification:** **New** = page or feature doesn't exist · **Update** = page exists but its layout, flow or content differs · **Missing UI** = page exists but a section, element or modal is missing · **Existing** = already built, reuse it

---

## 1. New Pages & Features

### Job Applications implementation update — 2026-11-05

- [x] Saved / Applied navigation inside `/candidate/applications`, based on `10086:83598` and `10086:83623`.
- [x] Applied title search (debounced, kept in `?search=`), View Job action, full-width Applied/date strip and pagination. The search is sent to the applications API as `search`; filtering waits for the backend.
- [x] Saved tab uses the same Job Applications card, without search or pagination. All saved pages are loaded in parallel.
- [x] `/jobs/saved` redirects to `/candidate/applications?tab=saved`; existing menu links remain valid.
- [ ] Assessment status badge on the Applied card (Pending / Completed / Expired + Take Assessment): built in `ApplicationStatus`, hidden until the API returns each application's assessment.
- [ ] Backend: support `search` on `/applications`, and return each application's assessment (status + URL).


| Figma screen | Current website status | Class | Required changes |
|---|---|---|---|
| `candidate/apply-with-questions/step-1-questions`, `step-2-upload-cv` | Applying is a single CV dialog (`src/features/jobs/components/ApplyNowModal.tsx`). Screening questions exist only on the employer side (post-job authoring, `JobScreeningQuestionsModal`). | New | A 2-step "Apply for {job}" wizard with a stepper. **Step 1** shows the employer's numbered questions as Yes/No cards, single choice, multiple choice ("select all that apply") and short answer, with error states and Next. **Step 2** lets the candidate choose the profile CV (radio card + Preview) or "Upload a different CV" (this application only; PDF/Word, max 5 MB), then Back / Submit Application. |
| `modal/leave-application-confirmation` | Not built | New | Opens when the apply wizard is closed: "Leave without applying?" says answers won't be saved and the application won't be submitted, with "Leave without applying" / "Continue applying". |
| `modal/application-submitted-successfully/with-assessment` | Not built (`ApplyNowModal` only opens the plain "submitted" success modal) | New | Success state "Application submitted – assessment required". An info panel reads "Assessment link valid for 72 hours" and shows the email it was sent to plus the sent and expiry times. Actions: "Take Assessment Now" / "Later" (goes to Applied Jobs). |
| `candidate-assessment/introduction` | No candidate-facing assessment route; assessments are employer-only (`src/features/company-assessments`) | New | A standalone page with a minimal header (logo + language). It shows the assessment title, "Sent by {company}", the scope, an "Important Assessment Rules" checklist, stat cards (Time Limit, Total Questions, Max Attempts) and Later / Start Assessment. |
| `candidate-assessment/question`, `final-question` | Not built (the employer `QuestionPreview` is not an answering UI) | New | Question screen: "Question X of N" with a progress bar and % complete, a countdown chip, a question card, single-select options A–D, and Next Question. The last question shows "Submit Assessment". |
| `modal/assessment-submitted-successfully` | Not built | New | "Assessment Submitted Successfully" names the hiring company, with "Go to Applied Jobs" / "Browse more jobs". |
| `candidate-assessment/link-expired` | Not built | New | "This assessment link has expired" (72 hours). Info cards show "Email sent on" and "Link expired on", with Browse Jobs / Go to Applied Jobs. |
| `candidate-assessment/already-taken` (11531:103521) | Not built | New | "You've already taken this assessment". Info cards show Submitted on, Time taken and Status ("Under review by employer"), with Browse Jobs / Go to Applied Jobs. |
| `candidate-assessment/already-taken` (11858:56749, actually "currently unavailable") | Not built (employer can pause via `AssessmentPausedNotice.tsx`) | New | Paused-assessment page: "This assessment is currently unavailable" says {company} paused it and gives a contact email, with "Email the hiring team" / Close. *(See Duplications: a modal version of this also exists.)* |
| `candidate/inbox` | No candidate chat; chat exists only at `/company/chat` | New | Candidate inbox in the sidebar layout. The left list ("Search companies or recruiters…") shows recruiter, company, last message, time and an unread badge. The right pane has the recruiter/company header, day separators, bubbles, attachment card, and a composer with an attach button. |
| `candidate/inbox/chat-closed` | Not built for candidates (employer `ChatClosedNotice` always shows "Reopen Chat") | New | Closed state: red "Conversation closed" pill, list preview, the timeline line "Closed by {company} · {date}", and a read-only notice in place of the composer. **No reopen action.** |
| `candidate/ai-job-match/results` | Not built (AI match exists only for employers: `AiTalentMatchTab.tsx`) | New | "Top Job Matches for You" page. It has an "Edit your preferences" CTA, a match-level legend (Highly Recommended 85–100% … Not Aligned 0–39%), a 2-column grid of job cards with a % badge, a colored level chip and Apply / View Job, and pagination. |
| `candidate/ai-job-match/empty-state` | Not built | New | "Recommended Jobs for You" empty state. It has a "Set Your Preferences" header button, an illustration, a "Set Preferences" CTA and four benefit tiles. |
| `modal/job-preferences/add`, `modal/job-preferences/edit` | Not built (no preferences UI or i18n keys) | New | Preferences modal with: Preferred Domain checkbox cards (4), Job Function radios (Clinical / Non-Clinical / Both), Job Title multi-select, Preferred Companies multi-select (logo chips), Location, Seniority Level multi-select, and a "Show only high-match jobs (80%+)" toggle. **Add** variant: "Add your preferences" with "Save preferences & Find Jobs". **Edit** variant: "Edit your preferences" with "Update Matches". |
| `candidate/cv-match-with-ats/intro` | Not built (only CV upload exists) | New | "CV match with ATS" landing page: "AI-Driven CV Analysis" chip, headline, illustration, three feature rows (ATS Compliance, Skills Gap Analysis, Instant Improvement Tips) and a "CV Analysis" CTA. |
| `candidate/cv-match-with-ats/analyzing` | Not built | New | Loading state: robot illustration with a disabled "CV Analysis" button. |
| `candidate/cv-match-with-ats/results` | Not built | New | Results: the analyzed file card with a large ATS score progress ring (85%), a numbered "Optimization Points" list of five tips, and a "Create CV" button. |
| `modal/cv-analysis-coming-soon` | Not built for candidates | New | "AI CV Analysis & ATS Matching" modal with a COMING SOON badge, a four-item info panel, "Notify Me When Available" and a footnote. |
| `candidate/build-cv/intro`, `cv-exists`, `cv-draft` | Not built (candidates can only upload a CV file) | New | "Smart CV Builder" landing page in the sidebar layout, in three states. **Intro:** "Create Your CV". **CV exists:** "Your CV is ready · last updated" with Show CV / Edit CV. **Draft:** "5 of 10 steps completed · last saved" with Delete Draft / Continue CV. |
| `modal/delete-cv-draft-confirmation` | Not built | New | "Delete your CV draft?" warns that this permanently deletes the draft, with Delete draft / Cancel. |
| `candidate/build-cv/step-1` … `step-10` (incl. `step-7/fresh-graduate`, `step-7/job-title-other`) | Not built. The existing steppers are horizontal with 3 steps. | New | Full-width "Create cv" wizard with no sidebar. A **vertical 10-step stepper** shows completed, active and upcoming states. The footer has Save & Continue Later / Prev / Next; on the last step Next becomes "Preview Cv". The steps are:<br>1. Personal details: photo, name, nationality, year of birth, marital status, country/city, plus languages with proficiency.<br>2. Contact: email, phone with country code, optional LinkedIn.<br>3. Job profile: title, years of experience, specialty, optional subspecialty, plus Professional License and Available Now toggles.<br>4. Professional summary, with a suggested summary (Refresh / Apply).<br>5. Education (repeatable).<br>6. Certificates (repeatable, with image upload).<br>7. Work experience (repeatable): employment type, "Other" job title, a Fresh Graduate toggle that swaps in a profile + strengths view.<br>8. Skills: recommended and selected.<br>9. Research & Publications: toggle, repeatable.<br>10. CPD & Conferences: toggle, repeatable. |
| `cv/reference-style/full-data`, `/Experience`, `/fresh-graduate` (candidate variants with photo) | Candidates can only preview an uploaded PDF (`CVModal.tsx`) | New | Candidate "View CV" of the generated CV. Header with photo, name, title and contacts, then: Summary, Skills, Experience or the fresh-graduate block, Publications, CPD, Key Highlights, Education, Certifications, Languages (dot rating), Additional Info. Actions: Download CV / Edit / Apply. One variant is paginated (Next / Previous Page). |
| `candidate/profile-insights/who-viewed-profile` | Not built | New | Page in the sidebar layout. It has "Search by company name…" + Search, and a list of company cards (logo, name, type, "Viewed your profile on {date}", "View Profile") with pagination. |
| `candidate/profile-settings/full-form`: **Additional Information** tab | Not built. Settings has only Basic Info and Change Password. | New | New settings tab ("Complete your profile to improve your visibility…") with Cancel / Save Changes and 7 cards:<br>1. Qualifications & Expertise.<br>2. Languages (up to 3).<br>3. Mobility: relocation + preferred countries; driving license + issuing countries.<br>4. Career Preferences: designations, work locations, industries, notice period, and job search status cards (Open to Work / Actively Looking / Open to Opportunities), shown as a badge.<br>5. Professional Information: clinical privileges tags.<br>6. Personal Details: nationality, current country/city, visa, gender, sponsorship, marital status.<br>7. Salary: current salary + expected min/max with currency. |
| `candidate/profile-settings/full-form`: profile completion card | Not built (only a yes/no "complete your details" box in the sidebar) | New | A progress ring (e.g. 85%), an encouragement line and a 6-item done/pending checklist that mirrors the Additional Information cards. |
| `candidate/profile-overview/expanded`: Home / Additional Information tabs | Not built (profile page has no tabs) | New | A pill tab switcher above the About card. "Home" holds today's cards. *(The content of "Additional Information" is not designed here; see Questions.)* |

---

## 2. Existing Pages Requiring Updates

| Figma screen | Current website status | Class | Required changes |
|---|---|---|---|
| Candidate dashboard sidebar (all candidate frames) | `src/features/candidate-profile/constants/index.ts` has 4 links: My Profile, Job Applications, Professional Credentials, Profile Settings | Update | Add **CV match with ATS**, **Build Your Professional CV** and **AI Job Match** after Professional Credentials. Add a bottom-pinned group with **View Profile Insights** and **Profile Settings** (moved down). The "complete your details" box does not appear in the design. |
| `homepage/guest` → Why Joocare section | `src/features/home/components/WhyUs.tsx` (two columns, Legacy vs Joocare) | Update | Redesigned as a full-width dark-green "Healthcare Hiring Intelligence" block with a new headline and intro. Legacy cards (red X) and Joocare cards (green check) surround a central circular "Joocare AI ENGINE" diagram, captioned "Workforce Complexity → Hiring Intelligence → Better Hiring Decisions". |
| `registration` | `/auth/candidate/register`, `FormCandidateRegister.tsx` | Update | Figma marks **Upload CV** and **License Title** as *(Optional)*; the site requires both. Figma's phone defaults to +966 (KSA) with placeholder "ex:52 987 6543"; the site uses AE. |
| `reset-password` | `/auth/new-password`, `FormNewPassword.tsx`, shared `PasswordRequirements` | Update | Add a 5th rule, "Different from your previous password", and rename the button from "Send" to **"Confirm"**. |
| `login`, `forgot-password` | Implemented | Update | Copy only. Login subtitle: "Take the next step in your professional career", title "Welcome Back" without "!". Forgot title: "Forgot Password" instead of "Forget Password". |
| `candidate/profile-settings/edit-form` (Basic Info) | `/candidate/settings/basic-info`, `BasicInfoForm.tsx` | Update | Add **Subspecialty** next to Specialty, and **Domain** + **Category** dropdowns. Upload CV is marked *(Optional)* in Figma but required in code. Add a page title + subtitle ("Basic Information" / "Update your personal details…"); the same applies to Change Password ("Keep your account secure…"). |
| `candidate/job-applications/applied` | `/candidate/applications`, `CandidateApplicationsList.tsx` | Update | Add a **Saved / Applied** tab switch and a "Search by job title" input. The card keeps **View Job** and adds a full-width green "Applied · {date}" strip at the bottom; today the code replaces View Job with a pill. |
| `candidate/job-applications/saved` | Saved jobs live at standalone `/jobs/saved`, outside the candidate layout | Update | Saved becomes a **tab inside the candidate dashboard's Job Applications**. Cards show a filled Saved button, Share, View Job and a relative time ("2 hours ago"). No search or pagination is shown. |
| `modal/upload-cv-to-apply` | `ApplyNowModal.tsx` | Update | The existing CV becomes a **selectable radio card**: file name, "Your Joocare profile CV · {size} · Updated {date}", and a separate **Preview** link. |
| `job-details/full`, `job-details/applied-state` | `/jobs/[slug]` reuses the employer `JobDescriptionCard` | Update | The design shows only Description, Skills and About the employer. The **attachments card** (with its link to `/company/assessments`) and the **Posted by** card don't appear for candidates, so hide them on the candidate page. |
| `popup/add-experience`, `modal/edit-experience` | `ExperienceModal.tsx` | Update | Add **Employment Type**, and **Country + City** in the Add frame. Figma draws Job Title as free text; the code uses a lookup with "Other". |
| `popup/add-education`, `popup/edit-education` | `EducationModal.tsx` | Update | The code has a required **GPA** field that is not in the design. Remove it or confirm it stays. |

---

## 3. Missing UI Sections & Components

| Figma screen | Current website status | Class | Required changes |
|---|---|---|---|
| `about-us` → "Our Commitment" | `/about` renders Hero, Core Pillars, Vision, Mission only | Missing UI | A fifth section after Mission: "Our Commitment" eyebrow, "The Joocare Commitment" heading, a paragraph and a two-image collage (laid out like Vision). |
| Candidate logged-in header (`header-section/candidate`, inbox frames) | `HeaderChatLink` renders only for employers (`HeaderActionsButtons.tsx`) | Missing UI | Add a **Message** button/icon with an unread-count badge before the notification bell, linking to the candidate inbox. |
| Footer (all public pages) | `src/shared/components/Footer.tsx` | Missing UI | Add a **"Career Resources"** link under For Candidates. No destination is designed; see Questions. |
| AI **match % badge** (explore-jobs, company-profile, saved, similar jobs, applications, job-details header) | Not shown. The pill is commented out in `candidate/JobDetailsHeader.tsx` and `SimilarJobCard.tsx`; `CandidateJobCard.tsx` has none. | Missing UI | A sparkle + percentage pill at the top-right of every candidate job card and next to the job title in job details. On applied cards it shows as a "Resume Match" label. |
| `explore-jobs/grid`, `explore-jobs/list` → "speciality" filter | The Specialty filter is commented out in `jobs/page.tsx` | Missing UI | Enable the speciality accordion between "By Domain" and "Experience Level". |
| `modal/save-success` | Saving a job is a silent toggle (`useToggleSavedJob.ts`) | Missing UI | A "Saved successfully" confirmation (check + confetti, close only) after saving a job. |
| `candidate/profile-overview` → right info card | `SideContentInfos.tsx` shows Email, Location, Phone, Experience and Age as plain rows | Missing UI | Add rows for Specialty, Subspecialty, Domain, Category, Gender, Religion, Marital Status, Languages Known, Driving License and Issuing Countries, **each with a green icon tile + divider**. Add a **green avatar ring, a status dot and a "Verified" badge**. |
| `candidate/professional-credentials/licenses` → license card | `LicenseCard.tsx` shows one country as plain text | Missing UI | Show "Issued in:" followed by **multiple green country chips**. |
| `cv/reference-style/full-data` (11791:115925): Delete / Update / Download | No candidate CV management | Missing UI | A CV-view action bar with **Delete**, **Update** and **Download** for a saved CV. |

---

## 4. Already Implemented / Reusable Features

No rebuild is needed. These match the design except for the small gaps listed above.

| Figma screen | Where it lives | Class |
|---|---|---|
| `login`, `forgot-password`, auth header ("For Employer" pill, language) | `src/features/auth/components/*`, `AuthHeader.tsx` | Existing |
| `popup/email-verification/step-1` (OTP, 5 digits, resend timer) | `forget-password/OtpModal.tsx` (already used for register, password reset and email update) | Existing |
| `homepage/guest`: Hero + search, popular searches, How It Works, Top Employers, Impact stats, Recent Jobs, Testimonials, FAQ, back-to-top | `src/features/home/components/*` | Existing |
| `header-section/guest`, `header-section/employer` | `src/shared/components/header/*` | Existing |
| `faq`, `contact-us-/version-1` + `version-2` (candidate/employer switch) | `src/features/faq`, `src/features/contact` | Existing |
| `about-us`: Hero, Core Pillars, Vision, Mission | `src/features/about/components/*` | Existing |
| `for-employers-landing-/version-1` | `src/features/forEmployers/*` | Existing |
| `explore-jobs/*` (search, popular searches, filters, salary, 2-column cards, pagination) | `/jobs`, `CandidateJobCard`, `JobsSideBarFilter` | Existing |
| `company-profile` | `/shared-company-profile/[slug]` | Existing |
| `job-details/full` (header, overview, salary/location, education & certifications, share, Similar Jobs) | `/jobs/[slug]` | Existing |
| `job-details/applied-state` ("Already Applied") | `CandidateJobDetailsCardActions.tsx` | Existing |
| `job-details/minimal` (actually the Saved jobs grid) | `/jobs/saved`, `SavedJobsList.tsx` | Existing |
| `modal/login-required-to-save` | `shared/components/modals/LoginAlertModal.tsx` | Existing |
| `modal/application-submitted-successfully` (10086:88709) | `SuccessModal` variant "submitted" | Existing |
| `candidate/profile-overview` main cards: About, Education, Skills, Experience accordion; Hiring Readiness bar; Upload CV / CV file card | `src/features/candidate-profile/components/*` | Existing |
| `popup/add-skills`, `popup/edit-skills`, `popup/edit-about` | `AddSkillsModal`, `EditSkillsModal`, `EditAboutModal` | Existing |
| `professional-credentials/qualifications`, `certificates`, `licenses` pages; `popup/add-qualifications-with-image`, `modal/add-license`, `popup/add-certificates-form` | `src/features/candidate-credentials/*` | Existing |
| `candidate/profile-settings/change-password` (form) | `candidate-settings/.../ChangePasswordForm.tsx` | Existing |
| `toggle` (Professional License switch + License Name) | Compose from `ui/switch.tsx` + `InputField` | Existing |
| `cv/reference-style/full-data` (11791:116227): no photo, watermark, Download only | Employer `CandidateCvModal.tsx` + `candidate-cv/CandidateCvDocument.tsx` | Existing |
| Shared building blocks for the new screens | `SuccessModal`, `AlertModal`, `DeleteModal`, `IllustratedModal`, `ModalInfoPanel`, `CustomPagination`, `SearchInput`, `MultiSelectInputField`, lookup hooks (`useGetSeniorityLevels`, `useGetDomains`, `useGetCategories`, `useGetEducationLevels`), all chat components in `src/features/chat` | Existing |

---

## 5. Potential Duplications

| Figma screen | Overlaps with | Note |
|---|---|---|
| `candidate/inbox`, `inbox/chat-closed` | Employer chat `src/features/chat/*` (list + search, timeline, bubbles, attachment card, composer, closed badge/notice) | Same UI. Share it, parameterized by role; only the copy, the header link target and the closed notice (no reopen) differ. |
| Candidate CV view (`cv/reference-style/*`) | Employer `CandidateCvDocument` / `CandidateCvModal` | Same document. Share one CV renderer and vary only the photo, actions and pagination. |
| `candidate/profile-overview` right info card | Employer `company-projects/.../CandidateProfileSidebar.tsx` (most of the same rows and keys) | Extend or share it rather than building a second card. |
| `candidate/job-applications/saved` tab | Standalone `/jobs/saved` (linked from the header dropdown) | Reuse `SavedJobsList` / `CandidateJobCard`, and decide what happens to `/jobs/saved`. |
| `apply-with-questions/step-2-upload-cv` | CV picker in `modal/upload-cv-to-apply` / `ApplyNowModal` | One shared CV picker for both. |
| `ai-job-match/results` job card | `CandidateJobCard` | Add a variant (match badge + level chip + Apply), not a new card. |
| Build-CV wizard steps 1–3, 5–8 | Settings basic info, profile modals (Education, Experience, Skills, About), credentials (Certificates) | Large field overlap. Decide whether the wizard prefills from and reuses these, or keeps separate CV-only data. |
| Settings **Additional Information** tab | Credentials (Licenses, Certificates); employer `CareerPreferencesSection`, `ClinicalPrivilegesSection`; talent-database mobility and salary filters | The candidate form feeds what employers already display. Reuse the same option lists and labels. |
| `profile-overview/expanded` "Additional Information" tab | Settings "Additional Information" tab | Same name in two places; confirm whether the profile tab is a read-only view of the settings data. |
| `modal/job-preferences/*` | Existing seniority, job-title and country lookups; employer Career Preferences (different fields) | Reuse the lookups. This is not a direct duplicate of Career Preferences. |
| `modal/cv-analysis-coming-soon` | Employer `post-job/AiJdBuilderModal.tsx` (IllustratedModal + Coming Soon + notify) | Same pattern; reuse it. |
| `modal/save-success`, `…/with-assessment`, `leave-application-confirmation`, `delete-cv-draft-confirmation`, `assessment-submitted-successfully` | `SuccessModal` (with callout), `AlertModal`, `DeleteModal` | Build these as variants of the shared modals. |
| `candidate-assessment/already-taken` (11858:56749) vs `modal/candidate-assessment-unavailable (paused)` | Each other | Same "currently unavailable" content as a page and as a modal (the modal is at 10% opacity). Build only one. |
| `Steps-Progress` (Intro & Rules / Questions / Review & Submit) | `AssessmentProgress.tsx`, `complete-account/wizard-progress.tsx` | Reuse the existing horizontal stepper. |
| FAQ accordion (home, faq, for-employers) | 3 separate implementations | Any style change must touch all three, or merge them into one component. |
| Candidate auth screens | Employer auth (shared layouts, `SideContent`, `FormNewPassword`, `PasswordRequirements`, `OtpModal`) | Copy and rule changes here also affect the employer flow and change-password screens. |
| `popup/email-verification/step-2` | `step-1` | The two frames are identical; it is one modal. |
| `group/basic-info` (Basic Info / Business Verification / Change password) | Employer account-settings tabs | Already built for employers; nothing needed on the candidate side. |

--- 

## 6. Decisions (answered 2026-11-05)

The open questions from the Figma review have been answered. **General rule:** where the API isn't ready, build the design with mock data. Mock data is not translated (it will arrive translated from the API); only static UI copy goes in `messages/en.json` and `ar.json`.

**Global / navigation**
1. **Header on candidate pages:** keep the existing behaviour. A logged-in user doesn't see Login / Join Now, and sees the candidate menu as today. The logged-out header in these frames is ignored.
2. **Hidden sidebar items** (Inbox, Compliance, "who review profile ?"): out of scope. The inbox is reached from the header Message icon only.
3. **Breadcrumbs:** `Home > {page name}`.
4. **Footer "Career Resources":** postponed until a page is designed. Not added now.
5. **Candidate chat:** new route `/candidate/inbox` with a thin `CandidateChatPage.tsx`. It reuses the existing `src/features/chat` components (same design as the company chat), with a `role: 'company' | 'candidate'` prop:
   - No close/reopen or admin actions for candidates.
   - A conversation closed by the company is shown **read-only** (closed badge + notice, no Reopen).
   - The header Message link points to the inbox for the current role.
6. **Mobile:** responsive, following the existing site patterns.

**Public pages and auth**

7. **For Employers:** the new section is built as a static design with static data until the API is ready.
8. **About:** add the Commitment section as design only (static/mock data) until the API is ready.
9. **Registration:** follow Figma (labels and side-panel copy as drawn).
10. **"Different from your previous password" rule:** shown on Reset Password and Change Password only.

**Jobs and apply**

11. **Explore jobs:** follow Figma, a 2-column grid only. No list view.
12. **Jobs filters:** keep the existing filters and enable the **Speciality** filter, as drawn in Figma (currently commented out in `jobs/page.tsx`).
13. **Hidden explore-jobs layers** (Complete Your Profile card, Active, date, Resume Match): out of scope. Only the visible match % badge is added.
14. **"Your CV has been saved successfully" modal (11993:77042):** shown after **Save & Continue Later** in the CV Builder.
15. **Attachments and Posted by cards:** hidden on the candidate job-details page.

**Profile and settings**

16. **Profile:** use the **expanded** variant: Home / Additional Information tabs, current card order, Hiring Readiness visible. The profile's Additional Information tab shows the settings Additional Information data read-only.
17. **Experience modal:** Country + City in both Add and Edit. Job Title stays a dropdown with "Other".
18. **Settings tabs:** follow Figma (Basic Info, Change Password, Additional Information).
19. **Certificates / licenses:** follow Figma visually, using mock data until the API returns it:
    - The certificate card shows the image and the country.
    - The license card shows "Issued in" chips.
20. **Additional Information, Certifications / License fields:** follow Figma (design only, mock data).
21. **Hidden settings / applications layers** (sorting, Active, Resume Match %, Current/Previous Job Title, Forget password link): out of scope.
22. **Who viewed profile page:** title **"Profile Insights"**, route `/candidate/profile-insights`.

**AI Job Match, preferences, ATS**

23. **Job Preferences modal:** opened from AI Job Match only:
    - "Add" from the empty state (Set Preferences).
    - "Edit" from the results page.
24. **Preferences Location:** multi-select (several countries). The stray "1–3 Year" text is dropped.
25. **Hidden AI-match card layers** (AI INSIGHT, Missing skill, Improve Match, Applied): out of scope. "Not Aligned" stays in the legend.
26. **ATS:** build **both**:
    - The full flow (intro → analyzing → results, mock data, profile CV, "Create CV" → CV Builder).
    - The **Coming Soon** modal, shown while the feature is gated by a flag.

**CV builder**

27. **Page title:** "Build Your Professional CV". Route `/candidate/build-cv`.
28. **Candidate CV view:** with photo, actions **Download / Edit / Apply**.
    - Apply returns to the job they were applying to, or `/jobs` if there is none.
    - The employer view (Download only, no photo) stays as is; share the CV document component.
29. **Wizard footer:** depends on mode, on every step. A new CV shows **Save & Continue Later**; a draft shows **Delete Draft**.
30. **Placeholder fixes:**
    - Step 4: label "Professional Summary", with a mock suggested summary.
    - Step 6: accepts an image or PDF.
    - Step 8: remove the stray "Responsibilities" label.
    - Step 10: the toggle reads "Do you have CPD or conferences?".
    - Fresh graduate: the prefilled text is editable.
    - Stepper: "Certificates".

**Assessments**

31. **Assessment flow:**
    - **Time:** 72 hours = link validity, and Time Limit = test duration. Values come from the data.
    - **Questions:** single-select only.
    - **Out of scope:** Review & Submit screen and Passing Score.
    - **"Later":** goes to Applied Jobs.
32. **Applied Jobs card:** add a small assessment status badge (Pending / Completed / Expired). Pending also shows a "Take Assessment" link.
