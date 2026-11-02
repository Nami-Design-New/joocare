# Employer — Phase 2 TODO

Checklist of what is missing on the Employer side compared to Figma. Tick `[x]` as items are done.
Logic and details: [PHASE-2-README.md](PHASE-2-README.md) · Figma: `wLe47UwWPf7BWy7Un84RM3` (page "Joocare Platform — Phase 2").

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

## 2. Job listings 🟠 — `10086:84376`, `10527:40433`
- [ ] Search by job title
- [ ] Recruiter, Domain and Date range filters
- [ ] Has assessment / Has screening questions filters
- [ ] Card buttons: AI Talent Match · Ai Filter · View Applicants
- [ ] Pin from the actions menu

## 3. Job details 🟠 — `10086:84578` (+ closed / draft / paused)
- [ ] "Screening questions & assessment attached to this job" section (question count · required + assessment name)
- [ ] Posted by card (recruiter · email · date)

## 4. Job status modals 🟠
- [ ] Pause — new copy + "While paused" bullets + `Pause Vacancy / Keep Active` — `10086:88570`
- [ ] Resume — "Once reactivated" bullets + `Reactivate Vacancy / Keep Paused` — `10086:88587`
- [ ] Close — "Before you close, make sure you have" bullets — `10086:88621`
- [ ] 🔴 Success: Job closed — `10086:88560`
- [ ] 🔴 Success: Applications resumed — `10086:88550`
- [ ] 🔴 Success: Job published — `10895:61678`

## 5. Post job
**Step 1** 🔴
- [ ] "Link Assessment to this Job" toggle — `11531:108027`
- [ ] Choose an Assessment (All sources / JooCare Library / My Assessments + Category) — `10169:40903`
- [ ] Assessment fit alert — `11531:106582`
- [ ] View assessment (view only) — `10527:42699`

**Step 2** 🔴
- [ ] Selected Skills vs AI Suggested Skills — `11073:45434`
- [ ] Question Templates (multi-select + Add Selected) — `11319:65002`, `10181:44166`
- [ ] Create Screening Question: Single / Multi / Yes-No / Text, 2–5 options, Mark, Required/Optional — `12795:112132`
- [ ] Added questions summary + expandable cards (Edit / Delete) — `11531:118333`
- [ ] Empty state — `11535:120986`
- [ ] Template preview — `11531:116889`
- [ ] Duplicating a template adds a "Customized" label
- [ ] AI JD Builder (Coming soon) — `11531:110082`
- [ ] "Question added" toast instead of a success modal

**Step 3** 🟠
- [ ] Screening questions + Assessment sections (Added / Not added + Edit link) — `10086:87709`
- [ ] Job screening questions modal — `11661:114959`

## 6. Pipeline candidates 🟠 (biggest gap) — `10086:85598`, `12388:106758`
- [ ] Job header (title · company · type)
- [ ] Pipeline Candidates / AI Talent Match tabs — `11661:115970`, `10086:86250`
- [ ] Candidate count + Quick Message (n)
- [ ] Columns: Email · AI Match Score · Assessment status
- [ ] Assessment states: Passed % · Failed · View result · In grace period (Due) · Time expired – not taken · Not assigned + Share assessment
- [ ] Project chips + Create Project + "View all (n)"
- [ ] "Added by …"
- [ ] Filters page + applied filters — `11531:111386`, `11531:113387`
- [ ] Profile popup — `11531:114589`
- [ ] 🔴 Screening answers + summary scores — `10086:89120`
- [ ] 🔴 Modals: link to job `11531:114326` · link to project `11531:116277` · candidate assessments `11531:117890` · send message to selected `11531:118106` · share assessment (single) `11531:116724`
- [ ] 🔴 Success: linked to job / linked to project / message sent — `11661:97147`, `11661:97159`, `11661:97171`

## 7. Projects 🔌
- [ ] API (list, details, candidates, all actions)
- [ ] Recruiter + Created date range filters — `10086:101678`
- [ ] "Shared N× · last <date>" + "+N more"
- [ ] 🔴 Create project modal — `10086:123881`
- [ ] 🔴 Add candidate to project modal — `10086:123817`
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

## 9. Hiring Manager review 🔴 (new)
- [ ] Shared candidates review ("Shared with you by … · submit your decisions") — `10164:39865`
- [ ] Schedule interviews — `12163:105704`
- [ ] Decisions submitted modal — `11661:116783`

## 10. Admin Roles 🔌
- [ ] Roles API (permissions come from the backend)
- [ ] Members API + email invite
- [ ] Statuses: Verified / Invited · Pending / Deactivated + Account Owner badge
- [ ] Deactivate instead of Delete
- [ ] 🔴 First login: Create your password + rules — `11531:118182`
- [ ] 🔴 Password changed modal — `11661:97135`

## 11. Recruiter Activity 🔴 — `10086:86774`
- [ ] Route `/company/recruiter-activity` (sidebar link is a 404 today)
- [ ] Table: Open / Closed / Draft jobs · Screening progress · AI match · Projects
- [ ] Clicking a count opens filtered Jobs / Projects

## 12. Talent Database / CV Search 🔌
- [x] Route `/company/talent-database`
- [x] Search filter sections (Occupational · Experience · Licensing · Languages · Mobility), collapsible — `10086:87237`, `11531:95756`
- [x] Results + download list (local preview data) — `10086:87021`, `10086:90396`
- [x] Candidate profile preview, reusing the existing read-only profile — `10086:86891`
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
