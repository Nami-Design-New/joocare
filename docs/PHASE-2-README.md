# Joocare — Phase 2 (Figma ↔ Code Status)

الملف ده مرجع واحد لـ Phase 2: المنتج بيعمل إيه (اللوجيك)، إيه اللي اتعمل في الكود، وإيه اللي لسه — عشان نبني **feature by feature**.

- **Figma:** `joocare (Copy)` → page **"Joocare Platform — Phase 2"** — fileKey `wLe47UwWPf7BWy7Un84RM3`
- لفتح أي Frame: `https://www.figma.com/design/wLe47UwWPf7BWy7Un84RM3/?node-id=<id بعد ما تبدل : بـ ->`
- **مصدر اللوجيك:** Frame `Joocare tester questions and answers` (IDs 1–69) + `QA Batch 01 … 11` (Before/After) + `QA 12 — Pending Product Decisions`.
- **قواعد الكود:** [RULES.md](RULES.md) — أي feature جديدة لازم تمشي عليها.
- آخر تحديث للحالة: 2026-11-02 (على `development` @ `7215b70`).

> الحالة هنا متاخدة من قراءة الكود (routes + features + هل فيه API ولا Mock data)، مش من تشغيل التطبيق أو تيست.

---

## 1. Legend

| Status | المعنى |
| --- | --- |
| ✅ Done | الـ UI موجود ومربوط بالـ API |
| 🟡 UI only (mock) | الـ UI موجود لكن شغال على `constants/` أو `data/` محلية — محتاج API + تطبيق ملاحظات الـ QA |
| 🟠 Partial | موجود بس ناقص أجزاء من تصميم Phase 2 |
| 🔴 Not started | مفيش Route ولا Feature |
| ⏸ Pending decision | محتاج قرار Product/Client قبل التنفيذ (شوف [§6](#6-pending-product--client-decisions)) |

---

## 2. فهم المنتج (Product Logic)

Joocare منصة توظيف طبية (Healthcare / Life sciences) فيها 3 أنواع مستخدمين:

| User | الوصف | Layout في الكود |
| --- | --- | --- |
| **Guest** | يتصفح الصفحة الرئيسية والوظائف والشركات | `app/[locale]/(shared-layout)` |
| **Candidate** | دكتور/ممرض/صيدلي… يبني Profile، يقدّم على وظائف، يمتحن Assessments، يستخدم أدوات AI | `(shared-layout)/candidate/*` |
| **Employer (Company)** | شركة/مستشفى بفريق Members وRoles، تنشر وظائف، تفرز مرشحين، تعمل Projects وAssessments | `company/(sidebar-layout)/*` |

### 2.1 الـ Employer Sidebar (Information Architecture)

نفس الأسماء لازم تتكرر في الـ Sidebar والـ Header dropdown والـ Breadcrumbs (QA ID 16).

```text
WORKSPACE        Company Profile · Dashboard
MANAGE TALENT    Hiring Management ▸ Jobs · Projects · Assessments · Assessments Results
                 Talent Database
ADMINISTRATION   Admin Roles ▸ Users · Roles & Permissions
MORE             Recruiter Activity · Account Settings
CTA              "Build your next team" → Post a Job
```

موجود في [features/company/constants/index.ts](../src/features/company/constants/index.ts). **`/company/talent-database` متاحة كـ UI preview؛ `/company/recruiter-activity` لسه 404.**

### 2.2 الـ Flow الأساسي (Hiring loop)

```text
Company: Post Job (3 steps) ──► Job published ──► Candidates apply
   │  Step 1: details + Link Assessment (اختياري)
   │  Step 2: description + skills + Screening questions + AI JD builder
   │  Step 3: preview (Added / Not added summaries)
   ▼
Candidate: Apply ──► CV ──► Screening questions ──► Review & Submit
   │  لو Assessment "Required for application" → الطلب Incomplete + زر Start assessment
   │  لو "Invited by recruiter" → الطلب Submitted والدعوة تيجي بعدين
   ▼
Company: Pipeline candidates (AI match · answers · assessment status)
   ├─► Share assessment (فرد / مجموعة / Project / Email خارجي)
   ├─► Add to Project (Shortlist / Interview / Accepted / Rejected + notes)
   ├─► Message (Inbox)
   ▼
Assessment Results ──► Review answers ──► Internal note / Feedback ──► Mark as reviewed
```

### 2.3 Assessments — اللوجيك

- **مصدرين:** `JooCare Library` (من الـ Admin، Read-only للشركة) و`My Assessments` (اللي الشركة عملتها). عند الاختيار نوضح مصدر كل Assessment بـ Label، وView موحد بتبويبين + Search واحد + Filters (Source, Category, Status, Type, Created by, Date). (IDs 1, 17, 19)
- **Categories:** الشركة تعمل Create/Edit لـ Categories بتاعتها؛ Category مستخدمة متتمسحش (Archive أو نقل الاختبارات الأول). Categories الـ Admin Read-only. (ID 18)
- **Builder 3 خطوات:** (1) Configuration: title, description, pass score %, duration, **Maximum attempts (default 1)** → (2) Questions → (3) Review & Settings. Autosave Draft لكل خطوة + حالة "Last saved"، ونشر بـ Request نهائية. (IDs 20–23, 29)
- **أنواع الأسئلة الـ 4:** `Single Select`, `Multi Select`, `Yes / No`, `Text Input`. لكل سؤال: نص، Options (2–5 فريدة)، Correct answer(s)، Mark/Score موجب، Required/Optional، Attachment اختياري (صورة زي ECG). Empty state فيها `Create question` و`Add from templates`. (IDs 21, 22 + Frame "Screening Question · Interactive handoff")
- **Preview للعرض فقط** (مفيش Delete)، Edit/Delete جوه الـ Builder قبل النشر بس. (ID 32)
- **Versioning:** Assessment اتستخدم ميتعدلش — أي تعديل يعمل Version جديدة، والنتائج القديمة مربوطة بالـ Version القديمة. (IDs 24, 26) ⏸
- **Delete:** Assessment مستخدم أو متبعتله دعوات = Archive/Deactivate مش Delete. (ID 27) ⏸
- **Pause / Unpause:** Assessment ممكن يتوقف (frames `questions-list/paused`, `question-details/paused`, modals pause/unpause)، والمرشح يشوف `candidate-assessment-unavailable (paused)`.
- **Toasts بدل Success screens** للأكشنز الصغيرة؛ رسالة Edit = `Assessment updated successfully` مش "Created". (IDs 6, 30)
- **Details page:** Linked jobs count (clickable) + Invited / Started / Completed. (IDs 33, 36)

### 2.4 Assessment Sharing & Results

- **Primary flow للإرسال من Job applicants** (فلترة → اختيار → Send assessment)، وShare جوه الـ Assessment للدعوات المباشرة أو من Job/Project. بعد الإرسال: Toast + Status + In-app notification + Email. (ID 42)
- **Invite by email:** Validation للصيغة والتكرار، وجدول Invitations بحالات `Invited · Registered · Not started · In progress · Completed · Expired`. نصين: "عنده حساب → هيلاقيه في حسابه" / "معندوش → يعمل حساب وبعدها يظهر". (IDs 43, 44)
- **Statuses:** `Invited · Not started · In progress · Submitted · Review pending · Reviewed · Expired` + `In grace period (Due …)` + `Absent (Time expired – not taken)` + `Not assigned`.
- **Results list:** قائمة شاملة (مش لازم تختار وظيفة الأول) بفلاتر: Job, Assessment, Candidate/email, Invitation status, Result status, Score range, Date range, Has feedback. الصف: مرشح أو email، الوظيفة أو `No linked job`، الاختبار، الحالة، الدرجة، Started/Submitted at، حالة الـ Feedback. Pagination. (ID 37)
- **Candidate result:** Summary grid (التاريخ + الوقت + Timezone، الـ Assessment + Version + Job). (ID 38)
- **Answers review:** لكل سؤال رقمه ونوعه، كل الاختيارات، اختيار المرشح، الإجابة الصحيحة (ألوان + رموز)، والدرجة `earned / max` مش من 10 ثابتة. Text = إجابة المرشح + Model answer + AI similarity + مراجعة بشرية. (ID 41)
- **Feedback:** 3 حالات منفصلة: `Internal Note` (المرشح مش بيشوفها) / `Feedback Draft` / `Sent Feedback` (سجل ثابت؛ التصحيح بـ Addendum). **مفيش Star rating.** رسالة التأكيد بتقول القناة الفعلية. (IDs 39, 40)

### 2.5 Post Job — اللوجيك الجديد في Phase 2

- **Step 1 – Link Assessment:** Toggle `Link Assessment to this Job` → `Choose an Assessment` (All sources / JooCare Library / My Assessments + Category). View فقط (أيقونة Eye، من غير Edit/Delete). Frames: `assessment-fit-alert`, `assessment-off`. External assessment ⏸ (ID 4).
- **Step 2 – Skills:** `Selected Skills · N` منفصلة عن `AI Suggested Skills` (مفيش إضافة تلقائية). (ID 3)
- **Step 2 – Screening questions:** Question Templates (Category = فلتر، Template = سؤال جاهز بـ Preview)، **Multi-select + `Add Selected`**، تعديل Template = Duplicate نسخة للوظيفة بـ Label `Customized`، Summary ثابت `Added questions · N` (من غير `N/10` لحد ما الحد يتحدد)، كروت Expandable (النوع، الإجابة، الـ score، Edit/Delete)، Sections Collapsible. (IDs 5–12)
- **Step 2 – AI JD Builder:** Draft قابل للتعديل، Your input / Professional Insights / Apply to draft / Refresh + Loading & Error. في التصميم الحالي frame `ai-jd-builder-coming-soon` ⏸ (ID 2).
- **Step 3 – Preview:** Sections Job details / Skills / Screening questions (بالعدد) / Assessment (اسم، نوع، مدة، إلزامي؟)، واللي مش مضاف يظهر `Not added` مع لينك Edit. (IDs 9, 10)
- Modals: `job-screening-questions`, `job-published-successfully`, `delete-question-confirmation`.

### 2.6 Jobs / Pipeline Candidates

- **Jobs list filters:** Status, Has screening questions, Has assessment, Recruiter, Date range. Pin جوه الـ actions menu. (ID 45)
- **Job details:** Sections للـ Assessment والأسئلة، `Created by / Owner recruiter` + آخر تعديل. تعديل الأسئلة بعد النشر يطبق على المتقدمين الجداد بس ⏸ (ID 46).
- **Pipeline candidates table:** Name, Email, **AI Match Score**, CV & Message, **Assessment (Passed / Failed / View result / Share assessment…)**, Project chips (`project-1`, `project-2`)، تبويب `AI Talent Match`، `Quick Message`، Filters page + filters applied، Profile popup. الهاتف والجنسية مش في الجدول افتراضيًا. Download CV جوه View profile/Actions. (ID 47)
- **Candidate answers:** Tab/زر `Screening answers` منفصل عن الـ CV: إجابة المرشح + المتوقعة + الدرجة، و Summary: Screening score (Correct/Incorrect/Needs review) · Assessment score · AI CV match — **من غير Total واحد**. (ID 48)
- Modals: `link-candidate-to-job`, `link-candidate-to-project`, `share-assessment/single-candidate`, `candidate-assessments`, `send-message-to-selected-candidates`, + success modals.

### 2.7 Projects

- List بـ Search + Recruiter + Created date range، Actions menu: Rename, Close, Delete (للفاضي فقط)، Share (دعوة عضو شركة بصلاحية View/Edit — مش مشاركة عامة)، Share log. (ID 49)
- Project candidates: Source job, Stage, Assessment status, Owner, Added date, Notes. تغيير الحالة من Action واضح + Audit log ومن غير ما يغير Application status. Remove from project، المرشح يتضاف لأكتر من Project. إرسال Assessment لمرشحي Project. (ID 50)
- Modals: `create-project`, `add-candidate-to-project`, `edit-project-name`, `close/delete-project-confirmation`, `share-project` (+ hiring-manager dropdown), `project-share-log`, `remove-candidate-from-project`, `interview-details`, `project-sent-successfully`.

### 2.8 Admin Roles / Members / Recruiter Activity

- **Roles:** Role name (key داخلي) + Display name، الصلاحيات مجموعات (Hiring Management, Projects, Assessments, Assessments Results…) من الـ Backend. Roles افتراضية: Admin, Recruitment Manager, Recruiter, Hiring Manager, Branding Specialist. حذف Role ممنوع لو عليه Members. (ID 53)
- **Members:** مفيش Password من الـ Admin — Invite بالإيميل → Verify → `member-first-login/change-password` → `password-changed-successfully`. Statuses: Verified / Invited · Pending verification / Deactivated. Badge `Account Owner`. Search بالاسم/الإيميل + Filter بالـ Role/status. Deactivate مش Delete. (ID 54)
- **Recruiter Activity:** نشاط كل Recruiter: Jobs posted (by status، clickable → Jobs مفلترة)، Projects created ≠ Projects participating. (ID 55)

### 2.9 Dashboard (Employer)

Widgets في `employer/dashboard/full`: Active Job Listings · Total Applications (vs الشهر اللي فات) · Recent Activity · Time to Fill (avg days، 30-day limit) · Employer Brand Reach (Unique profile viewers) · Talent Intake (CVs downloaded) · Category Breakdown (donut) · Critical Hiring Alerts (وظائف مفتوحة > 30 يوم) · Jobs Overview (Title, Views, Applicants) · Reports & Data Export (**Coming soon**). كل Widget لازم Tooltip + فترة + Empty state. المعادلات ⏸ (ID 51).

### 2.10 Talent Database / CV Search

قاعدة مرشحين قابلة للبحث حسب Consent (مش كل الحسابات). Filters مجمعة في Sections قابلة للقفل: Occupational details (Current/Previous title, Domain, Category, Specialty, Subspecialty) · Experience & Seniority · Qualifications & Licensing (Education, Certifications, License country/status, Verification) · Languages + Proficiency · Mobility (Relocation, Preferred work countries). نفس Table pattern بتاع Applied candidates + Source + Consent. Frames: `talent-database-search` (4 نسخ)، `collapsed-sections`، `cv-search/results`، `cv-search-full`، `results-download-list`، `modal/ai-filter`. النطاق ⏸ (ID 56).

### 2.11 Inbox / Chat

- **Employer:** Chat مربوط بـ Job/Application بـ Label، Actions: View profile, View application, Mute, Archive/Close, Report. Frames: `inbox`, `chat-view`, `chat-menu-open`, `chat-closed`, `image-and-reply`, `already-contacted-alert`, `super-admin-view`. (ID 58)
- **Candidate:** Messages في الـ Navigation بـ Unread badge، سياق الشركة/الوظيفة، Suggested replies قابلة للتعديل. Frames: `candidate/inbox`, `candidate/inbox/chat-closed`. (ID 68)
- مين يبدأ الشات + Voice/files ⏸.

### 2.12 Candidate — Phase 2

- **Apply with questions:** Profile/CV → Application questions → Review & Submit. مفيش Timer، زر أساسي واحد لكل خطوة، Required يمنع Next، Optional يتعمله Skip. بعد Submit: لو Assessment إلزامي → `Incomplete` + `Start assessment`. Frames: `apply-with-questions/step-1-questions`, `step-2-upload-cv`, `leave-application-confirmation`, `application-submitted-successfully/with-assessment`. (ID 59)
- **Take assessment:** `introduction` → `question` (Steps-Progress + navigator) → `final-question`، Autosave + استكمال نفس المحاولة، Offline/Reconnecting، Warning آخر 5 دقايق، `Complete by <date/time/timezone>` بدل "72h". States: `link-expired`, `already-taken`, `unavailable (paused)`, `assessment-submitted-successfully`. بعد الإرسال `Submitted / Review Pending` بس (مفيش Accepted/Rejected). (IDs 60–62)
- **Candidate navigation الجديد:** My Profile · Job Applications · Professional Credentials · Profile Settings · CV match with ATS · Build Your Professional CV · AI Job Match · Inbox · Compliance · View Profile Insights.
- **Profile Settings full form:** Personal details, Job preferences, Mobility & Availability, Languages، Required vs (Optional)، Single vs Multi select، Profile completeness checklist، Consent للظهور في Talent Database. (ID 63)
- **CV match with ATS:** `intro` → اختيار المصدر (Uploaded CV / JooCare CV / Upload new) + تحليل عام أو لوظيفة محددة → `analyzing` → `results` → Enhance: Original vs Suggested، قبول/رفض لكل اقتراح، والأصل يفضل موجود. Modal `cv-analysis-coming-soon`. (IDs 64, 65)
- **Profile Insights (Who viewed):** صف لكل شركة (Total views + Last viewed + Source)، Search بالاسم، أرقام آخر 30 يوم. (ID 66)
- **AI Job Match:** Match levels: Highly Recommended 85–100 · Recommended 70–84 · Worth Reviewing 55–69 · Limited 40–54 · Not Aligned 0–39. كارت: النسبة، AI Insight، Missing skill، Improve Match، Apply، View Job، Applied state. `Edit your preferences` modal (Domain, Job function, Job title, Preferred companies, Location, Seniority, "Show only high-match ≥80%"). States: `results`, `empty-state`, `first-time-empty`. (ID 67)
- **Build Your Professional CV:** `intro` / `cv-exists` / `cv-draft` → 10 Steps: Personal details · Contact info · Job profile · Professional summary (AI + Regenerate + history) · Education · Certificate · Work experience (+ fresh-graduate, job-title-other, Currently working) · Skills · Research & publications · CPD & conferences → Templates popup (professional / classic / alternate / phase-2) → Preview. Autosave + Save & continue later، والـ Sections الفاضية متظهرش في الـ Preview. Modal `delete-cv-draft-confirmation`. (ID 69)

---

## 3. الحالة — Employer side

| # | Feature | Route / Code | Status | الناقص من Phase 2 | Figma frames (أهمها) |
| --- | --- | --- | --- | --- | --- |
| E1 | Auth employer (login, register, verify, forgot/reset) | `auth/(…)/employer/*`, `features/auth` | ✅ | — | `login-/employer-version` 10086:84219, `registration-/employer-version` 10086:84274 |
| E2 | Complete account / Business verification | `company/complete-account`, `features/complete-account` | ✅ | — | `account-settings/business-verification` 10086:88005 |
| E3 | Account settings (basic info, verification, password) | `company/account-settings/*`, `features/accout-settings` | ✅ | — | 10086:88132, 10086:88279 |
| E4 | Company profile | `company/company-profile`, `features/company-profile` | ✅ | — | `employer/company-profile` 10086:88409 |
| E5 | Sidebar (new IA) | `features/company/components/company-sidebar` | ✅ | Recruiter Activity بتودي 404؛ Talent DB متاحة كـ UI preview | `Sidebar-New` 10688:61903 |
| E6 | Dashboard | `company/dashboard`, `features/company-dashboard` | 🟠 | Recent activity, Time to fill, Brand reach, Talent intake, Critical hiring alerts, Jobs overview, Export (coming soon), tooltips/empty states | `dashboard/full` 10086:90549, `dashboard/active-jobs` 10086:90913 |
| E7 | Job management list + status (open/closed/draft/paused) | `company/job-management`, `company/job/[slug]`, `features/jobs` | 🟠 | Filters: has assessment / has questions / recruiter / date range؛ Pin؛ Sections الـ Assessment والأسئلة في Job details؛ Created by | `job-listings/grid-02` 10527:40433, `job-details/*-status` |
| E8 | Post job 3 steps (basic) | `company/post-job`, `features/jobs/components/PostJobForm.tsx` | ✅ | — | 10086:87354, 10086:87426, 10086:87709 |
| E9 | **Post job — Link Assessment (Step 1)** | — | 🔴 | كله | `step-1-basic-details/assessment-fit-alert` 11531:106582, `assessment-off` 11531:108027, `Component / Link Assessment to Job` 10169:40903 |
| E10 | **Post job — Screening questions + Templates (Step 2)** | — | 🔴 | Templates multi-select، Create question (4 types)، Requirement toggle، Added summary، Expandable cards، Duplicate/Customized | `step-2-requirements/questions-empty` 11535:120986, `template-question-preview` 11531:116889, `template-question-added` 11531:118333, `Screening Question · Interactive handoff` 12795:112132 |
| E11 | Post job — AI suggested skills + AI JD Builder | — | 🔴 / ⏸ | Selected vs AI Suggested skills؛ JD builder = Coming soon | `step-2-with-ai-builder` 10086:87505, `ai-jd-builder-coming-soon` 11531:110082 |
| E12 | Post job — Preview summaries (Step 3) | `JobReviewPanel.tsx` | 🟠 | Screening questions + Assessment summaries + Not added + Edit links | `step-3-preview` 10086:87709 |
| E13 | Pipeline candidates (job applicants) | `company/job/candidates/[slug]`, `ApplicantsClient` | 🟠 | AI match score، Assessment column، Project chips، AI Talent Match tab، Quick message، Filters page، Profile popup، bulk actions (share assessment / link to project / link to job / send message) | `pipeline-candidates/with-actions` 10086:85598 + `/filter-page`, `/filters-applied`, `/profile-popup`, `/ai-talent-match`, `Comment fixes 20-10` 12388:106758 |
| E14 | Candidate screening answers | — | 🔴 | View answers + Summary scores | `candidate-answers/version-1` 10086:89120, `screening-answer-review/question-1..6` |
| E15 | Projects list + details + modals | `company/projects`, `features/company-projects` | 🟡 | API؛ `create-project` و`add-candidate-to-project` modals؛ فلتر التاريخ؛ notes عند الإضافة | `projects/list` 10086:101678, `projects/candidates-table` 10086:101712, `list/actions-menu` 11531:105758 |
| E16 | Assessments — categories / list / details / pause | `company/assessments/*`, `features/company-assessments` | 🟡 | API؛ تبويبات Library vs My Assessments + Source label؛ Filters الموحدة؛ Linked jobs count؛ Archive؛ Versioning ⏸ | `assessment/categories` 10115:40214, `questions-list` 10086:122857, `question-details` 10086:122918, `/paused` 11535:124007 |
| E17 | Assessment builder (create/edit) | `assessments/[categoryId]/create` | 🟡 | API؛ نوع **Text Input** (الكود فيه `yes-no / single / multiple` بس)؛ **Maximum attempts** في الـ form؛ Add from templates؛ Autosave + "Last saved"؛ Edit toast | `builder-step-1` 10123:40775, `builder-full` 10123:40870, `builder-full/empty` 11535:120512, `review-and-settings` 10123:41059 |
| E18 | External invitations / Share assessment | `assessments/[…]/external-invitations` | 🟡 | API؛ Share modal variants (add email, candidates dropdown, single candidate)؛ statuses الكاملة | `assessment/external-sends` 11535:125280, `modal/share-assessment` 11377:44663 |
| E19 | Assessment results + candidate result | `company/assessments-results/*` | 🟡 | API؛ Filters الكاملة؛ Feedback (Internal note / Draft / Sent)؛ Answers review بـ `earned/max`؛ Sidebar counter | `assessment/results` 10649:64454, `results/candidate-answers` 10649:67688, `results/select-assessment-first` 11531:112634, `assessment/review/sheet` 11661:118968, `assessment-candidate-review/a` 10164:39865 |
| E20 | Roles & permissions | `company/roles-and-permissions`, `features/company-admin-roles` | 🟡 | API (الصلاحيات من الـ Backend)؛ Role name vs Display name | `admin-roles/roles` 10645:59173, 5 permission modals (11869:80049 …) |
| E21 | Users / Members | `company/users`, `features/company-admin-users` | 🟡 | API؛ Invite flow + statuses؛ Deactivate؛ Account Owner badge | `admin-roles/members` 10086:86573, `add-new-team-member` 10086:89090, `edit-team-member` 10086:89185 |
| E22 | Member first login (change password) | — | 🔴 | كله | `member-first-login/change-password` 11531:118182, `modal/password-changed-successfully` 11661:97135 |
| E23 | **Recruiter Activity** | — (route مش موجودة) | 🔴 | كله | `employer/recruiters` 10086:86774 |
| E24 | **Talent Database / CV Search** | `company/talent-database`, `features/company-talent-database` | 🟡 / ⏸ | UI preview: collapsible search filters, results, download list, reused candidate profile, selected-candidate messaging + existing success modal/Lottie. Pending: API, real delivery, scope/consent/plans. AI Filter and CV Search modals excluded by user. | `talent-database-search` 10086:87237, 11531:95756, `cv-search/results` 10086:87021, `results-download-list` 10086:90396, `employer/candidate-profile-preview` 10086:86891, `send-message-to-selected-candidates` 11531:118106, `message-sent-successfully` 11661:97171 |
| E25 | **Employer Inbox / Chat** | — | 🔴 / ⏸ | كله | `employer/inbox` 10086:86069, `chat-view` 10086:85956, + 5 states |
| E26 | Notifications drawer | `shared/components/header`, `features/notifications` | ✅ | أنواع إشعارات Phase 2 (assessment invite, feedback…) لما الـ API يجهز | `notification-drawer` 10086:89215 |
| E27 | Emergency Hiring | — | ⏸ | متتعملش لحد ما تتعرف | `section-label/emergency-hiring` |

## 4. الحالة — Candidate / Public side

| # | Feature | Route / Code | Status | الناقص من Phase 2 | Figma frames |
| --- | --- | --- | --- | --- | --- |
| C1 | Home, About, FAQ, Contact, For employers, Privacy, Terms | `(shared-layout)/*` | ✅ | — | `homepage/guest` 10086:69820 … |
| C2 | Auth candidate + email verification | `auth/(…)/candidate/*` | ✅ | — | `login` 10086:80084, `registration` 10086:80136 |
| C3 | Explore jobs + job details + saved | `jobs`, `jobs/[slug]`, `jobs/saved` | ✅ | — | `explore-jobs/grid` 10086:81365, `job-details/*` |
| C4 | Shared company profile | `shared-company-profile/[slug]` | ✅ | — | `company-profile` 10086:81407 |
| C5 | Candidate profile (about, education, experience, skills, CV) | `candidate/profile`, `features/candidate-profile` | 🟠 | Layout الـ `profile-overview/expanded` الجديد (Mobility & Availability, Languages…) | 10086:82207, 12009:79118 |
| C6 | Professional credentials | `candidate/credentials/*` | ✅ | — | 10086:82315, 10086:83308, 10086:83360 |
| C7 | Job applications | `candidate/applications` | 🟠 | حالة `Incomplete` + `Start assessment` + دعوات الـ Assessment في تفاصيل الطلب | `job-applications/applied` 10086:83598 |
| C8 | Profile settings | `candidate/settings/*` | 🟠 | الـ full form (personal details, preferences, mobility, languages, completeness, consent) | `profile-settings/full-form` 11858:56747, `/multi-select-open` 11531:104107 |
| C9 | Candidate navigation الجديد | `shared/components/header` | 🟠 | لينكات ATS / Build CV / AI Job Match / Inbox / Insights | `mobile/candidate-navigation` 10086:84090 |
| C10 | **Apply with screening questions** | `ApplyNowModal.tsx` (CV بس) | 🔴 | Questions step + review + leave confirm + submitted with assessment | `apply-with-questions/step-1-questions` 10086:89140, `step-2-upload-cv` 11531:96784, 11531:102920 |
| C11 | **Take assessment** | — | 🔴 | intro, questions (4 types), final, expired, already taken, paused, submitted | `candidate-assessment/introduction` 10654:63961, `/question` 10654:64173, `/final-question` 10654:64378, `/link-expired` 11531:103295, `/already-taken` 11531:103521 |
| C12 | **AI Job Match + preferences** | — | 🔴 | كله | `ai-job-match/results` 10086:82414, `/empty-state` 11524:46039, `/first-time-empty` 11531:108942, `modal/job-preferences/add` 11519:45844, `/edit` 10086:101550 |
| C13 | **Profile Insights (who viewed)** | — | 🔴 | كله | `profile-insights/who-viewed-profile` 10086:82368 |
| C14 | **CV match with ATS** | — | 🔴 | كله | `cv-match-with-ats/intro` 10086:102048, `/analyzing` 10086:83244, `/results` 10086:83261, `modal/cv-analysis-coming-soon` 11531:118041 |
| C15 | **Build Your Professional CV** | — | 🔴 | intro + 10 steps + templates + preview + draft | `build-cv/intro` 10086:83222, `cv-exists` 12222:68693, `cv-draft` 12222:68720, steps 10086:82947 … 12221:58318, `popup/-cv/*`, `cv/reference-style/*` |
| C16 | **Candidate Inbox / Chat** | — | 🔴 / ⏸ | كله | `candidate/inbox` 10086:82768, `/chat-closed` 11535:121802 |

---

## 5. خطة التنفيذ المقترحة (Feature by Feature)

الترتيب مبني على الـ dependencies: الـ Assessment لازم يبقى حقيقي قبل ما نربطه بالوظيفة، والوظيفة قبل التقديم، والتقديم قبل الـ Pipeline والنتائج.

| Order | Feature | يعتمد على | ملاحظات |
| --- | --- | --- | --- |
| 1 | **E16 + E17** Assessments API integration + Text Input type + Max attempts + Library/My tabs | Backend endpoints | تحويل `constants/assessment-*.ts` لـ `services/` + TanStack Query حسب RULES |
| 2 | **E9** Post job — Link Assessment | 1 | |
| 3 | **E10** Post job — Screening questions + Templates | — | reuse مكونات الـ question من الـ builder (نفس الـ 4 types + Requirement) |
| 4 | **E11 (skills) + E12** AI suggested skills + Preview summaries | 2, 3 | JD Builder يفضل Coming soon |
| 5 | **C10** Apply with screening questions | 3 | |
| 6 | **C11 + C7** Take assessment + Incomplete state في Applications | 1, 2, 5 | |
| 7 | **E13 + E14** Pipeline candidates upgrade + Screening answers | 5, 6 | |
| 8 | **E18 + E19** Share assessment + Results + Feedback (API) | 1, 6 | |
| 9 | **E15** Projects API + create/add modals | 7 | |
| 10 | **E20 + E21 + E22** Roles, Members API + invite + first login | Backend | |
| 11 | **E7** Jobs filters + Job details sections | 2, 3 | |
| 12 | **E6** Dashboard widgets الكاملة | Backend formulas ⏸ | |
| 13 | **E23** Recruiter Activity | 10 | |
| 14 | **C8 + C5 + C9** Profile settings full form + profile layout + navigation | — | مطلوب قبل Talent DB و AI Match |
| 15 | **E24** Talent Database / CV Search | 14 + قرار Consent ⏸ | |
| 16 | **C15** Build Your Professional CV | 14 | |
| 17 | **C14** CV match with ATS | 16 | |
| 18 | **C12 + C13** AI Job Match + Profile Insights | 14 | |
| 19 | **E25 + C16** Inbox / Chat | قرار ⏸ + real-time (Firebase موجود في المشروع) | |

**لكل Feature (Definition of Done):**

1. افتح الـ Frames من الجدول + اقرا الـ QA ID المرتبط في §2.
2. اتبع [RULES.md](RULES.md): `features/<name>/{components,hooks,services,types,validation,constants}`، `apiFetch`، React Hook Form + Zod، ترجمة `messages/ar.json` و`en.json`.
3. Reuse من `shared/components` (DataTable, modals, form fields) قبل ما تعمل جديد.
4. Loading / Empty / Error states + RTL.
5. `npm run lint` و`npx tsc --noEmit`.
6. حدّث الـ Status في الجدول هنا.

---

## 6. Pending Product / Client Decisions

متتنفذش قبل ما تتحسم — اعمل الـ UI بالاتجاه المقترح وسيب الـ rule configurable أو Placeholder.

| QA ID | الموضوع | الاتجاه المقترح حاليًا |
| --- | --- | --- |
| 2 | AI JD Builder (file types، dynamic prompt، daily limit) | Coming soon |
| 4 | External assessments مربوطة بالوظيفة | مش Feature مؤكدة |
| 7 | الحد الأقصى لأسئلة الوظيفة + ملكية الـ Templates | نعرض العدد الحالي بس |
| 13, 20, 23 | سياسة Maximum attempts (الحد، التعديل بعد الإرسال) | Default 1، نعرض القيمة المحفوظة |
| 18 | حذف/أرشفة Category مستخدمة | منع الحذف |
| 26 | قواعد الـ Versioning | `Create new version` entry point |
| 27 | Archive + مصير الدعوات القائمة | Archive بدل Delete |
| 34 | Standalone assessments (من غير وظيفة) | Concept عليه Label Pending |
| 35 | Mandatory on application vs Recruiter-invited (الافتراضي؟ الاتنين مع بعض؟) | ندعم الاتنين كـ setting |
| 39 | قناة الـ Feedback (Email / Platform) | Sent Feedback سجل مقروء |
| 41 | Partial scoring + اعتماد تصحيح الـ AI | مراجعة بشرية |
| 42, 44, 62 | دعوة وظيفة تعمل Application تلقائي ولا Confirm؟ Guest access؟ | Confirm صريح |
| 45, 46 | إخفاء/قفل الوظيفة وأثره على الدعوات؛ تعديل الأسئلة بأثر رجعي | الجديد يطبق على المتقدمين الجداد |
| 48 | أوزان التقييم (Screening / Assessment / AI) | من غير Total |
| 49, 50 | تعدد الـ Projects + صلاحيات | — |
| 51 | معادلات الـ Dashboard + Talent Intake | نعرض الأرقام المصدرية + empty states |
| 56 | نطاق Talent Database + Consent + Plans | — |
| 57 | Emergency Hiring | Undefined — متتعملش |
| 58, 68 | مين يبدأ الشات، Voice/files، Close | Shell + Archive |
| 60, 61 | المؤقت يبدأ إمتى، Resume، Auto-submit، Pass يغير الـ stage تلقائي؟ | يدوي |
| 63 | الحقول الإلزامية في الـ Profile + Consent | Completeness checklist |
| 64–67 | موديل الـ AI، thresholds، Quick Apply | نوضح المصدر والأسباب |
| 69 | عدد CV templates، سياسة الصورة، حدود Regenerate | — |

---

## 7. Employer design review — Figma vs Code (2026-11-02)

الطريقة: كل النصوص اللي في كل Employer frame في Figma (≈ 200 frame) اتقارنت بالكود و`messages/*.json`، وبعدين الفروق اتراجعت يدوي عشان نشيل الـ sample data (أسماء، تواريخ، أرقام). **مفيش مقارنة بصرية للـ UI شغال** (محتاج Login + Backend)، فالـ spacing والألوان محتاجين مراجعة يدوية.

### 7.1 مطابق للتصميم تقريبًا (الفرق placeholders أو sample data بس)

Account settings (basic info, business verification, change password) · Company profile + about popup · Employer verification popups · Roles & Permissions + الـ 5 permission modals · Members table + add/edit/remove member · Projects list + actions menu + candidates table + edit name / close / delete / share / share log / remove candidate / interview details · Assessment categories CRUD modals · Builder step 1 + review & settings · Question details (+ paused) · Results + select-assessment-first · Answer review (question 1–6) · Assessment sent / created / leave / delete-question modals.

> الحاجات دي UI جاهزة، بس Projects وAssessments وRoles وUsers لسه على mock data (§8 تحت).

### 7.2 موجود بس مختلف عن Phase 2

| Screen | Figma | الفرق |
| --- | --- | --- |
| Dashboard | `dashboard/full` 10086:90549 | الكود فيه 4 cards (Active postings, Applications, Latest activity, Talent intake) + Category donut + Active jobs table. **ناقص:** Recruitment Overview header + فترة (Sep 2026)، مقارنة "vs الشهر اللي فات"، Recent Activity feed، Time to Fill، Employer Brand Reach، Critical Hiring Alerts، Jobs Posted by Recruiter، عمود AI Match في Jobs overview، Reports & Data Export (Coming soon) |
| Job listings | `job-listings/grid` 10086:84376, `grid-02` 10527:40433 | ناقص: Search by job title، فلتر Recruiter (All recruiters)، Domain filter، أزرار `AI Talent Match` و`Ai Filter` و`View Applicants` على الكارت |
| Job details (open/closed/draft/paused) | 10086:84578 … | ناقص: Section **"Screening questions & assessment attached to this job"** (5 questions · 3 required + اسم الـ Assessment) وكارت **Posted by** (اسم الـ Recruiter، الإيميل، التاريخ) |
| Job status modals | `pause-applications` 10086:88570, `resume-applications` 10086:88587, `close-position` 10086:88621 | الكود فيه النسخة القديمة (سؤال + وصف). Phase 2: عنوان جديد + قايمة نقاط ("While paused: …", "Once reactivated: …", "Before you close, make sure you have: …") + أزرار `Pause Vacancy / Keep Active`, `Reactivate Vacancy / Keep Paused` |
| Job success modals | `job-closed-successfully` 10086:88560, `job-reposted-successfully` 10086:88550, `job-published-successfully` 10895:61678 | مش موجودين |
| Post job step 2 | `step-2-requirements` 10086:87426 | الـ Editor والـ Skills موجودين؛ ناقص: Question Templates (Board Certification, Hospital Experience, … Custom Question)، AI JD Builder |
| Post job step 3 | `step-3-preview` 10086:87709 | ناقص: Section الأسئلة والـ Assessment |
| Pipeline candidates | `pipeline-candidates/with-actions` 10086:85598, `Comment fixes 20-10` 12388:106758 | الكود: جدول بسيط (View + Download CV) + فلتر License/Country. **ناقص:** Job header (title + company + type)، تبويبات Pipeline / AI Talent Match، `Quick Message (n)`، عدد المرشحين، أعمدة Email / AI Match Score / Assessment status (Passed 86%، Failed، In grace period · Due، Time expired – not taken، Not assigned + Share assessment)، Project chips + Create Project، "Added by"، Filters page + filters applied، Profile popup |
| Assessments categories / list | `assessment/categories` 10115:40214, `questions-list` 10086:122857 | ناقص: Search placeholder الجديد، فلتر Region (Middle East & Africa, Europe…) وDomain، "created on"، نص الـ paused ("New attempts and sharing are disabled") |
| Builder questions (empty) | `builder-full/empty` 11535:120512 | ناقص: نص الـ empty state وقاعدة **"at least 5 questions before review"**، نوع Text Input |
| Assessment review | `assessment/review` 10597:59525 | العنوان والوصف ("Assessment Validation & Publication")، "Question 3 of 24"، Assessment Structure |
| External sends | `assessment/external-sends` 11535:125280 | ناقص: Maximum Attempts في الـ summary، عنوان "… – Related Candidates"، تاريخ + وقت لكل دعوة |
| Candidate answers result | `results/candidate-answers` 10649:67688 | ناقص: Started / Submitted / Duration (22m 14s)، "2 (Optional) skipped, scored 0"، Notes بعدد + الكاتب + Edited، "Page 1 of 4 · click to expand" |
| Share assessment | `modal/share-assessment` 11377:44663 | ناقص: Summary "Registered: 3 • External: 2 • Total: 5"، chips "+1 more" |
| Projects list | `projects/list` 10086:101678 | ناقص: فلتر Recruiter، "Shared 2× · last <date>"، "+N more" |
| Online profile popup | `popup/edit-online-profile` 10086:88688 | العنوان "Edit Online profile" والـ placeholders (`ex: linkedin.com/in/username` …) |

### 7.3 مش موجود في الكود خالص

| Screen | Figma |
| --- | --- |
| **Hiring Manager review** للمرشحين المشاركين ("Shared with you by … · 27 candidates … submit your decisions") + Schedule interviews + `decisions-submitted-successfully` | `assessment-candidate-review/a` 10164:39865, `/b-schedule-interviews` 12163:105704, 11661:116783 |
| Post job: Link Assessment، Screening questions، Templates، AI skills، JD builder | §3 E9–E11 |
| Create Screening Question (4 types، 2–5 options، Required/Optional) | `container/create-screening-question/single-select` 11073:44002, 12795:112132 |
| Candidate screening answers + Summary | `candidate-answers/version-1` 10086:89120 |
| AI Talent Match table | `ai-talent-match/table` 10086:86250 |
| Modals: create project، add candidate to project، link candidate to job / project، candidate assessments، send message to selected، message sent، question added | 10086:123881, 10086:123817, 11531:114326, 11531:116277, 11531:117890, 11531:118106 |
| Member first login (Create your password + rules) | 11531:118182 |
| Recruiter Activity (Open/Closed/Draft jobs، Screening progress، AI match، Projects) | `employer/recruiters` 10086:86774 |
| Talent Database / CV Search / AI filter / Candidate profile preview | §3 E24 |
| Inbox / Chat (7 states) | §3 E25 |

---

## 8. Mock data اللي لازم تتشال عند ربط الـ API

| Feature | الملفات |
| --- | --- |
| company-assessments | `constants/assessment-data.ts`, `assessment-detail-data.ts`, `assessment-answers.ts`, `assessment-results.ts`, `assessment-invitations.ts` |
| company-projects | `constants/project-preview-data.ts` (+ hooks `useCompanyProjectsPreview`, `useProjectCandidatesPreview`) |
| company-talent-database | `constants/talent-preview-data.ts`, `hooks/useTalentDatabasePreview.ts` (search and messaging are local previews; message success does not represent delivery) |
| company-admin-roles | `data/roles.data.ts`, `data/permissions.data.ts` |
| company-admin-users | `data/members.data.ts` |
