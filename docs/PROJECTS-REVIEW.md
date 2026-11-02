# Projects — Design Review (Figma vs Code)

Reviewed 2026-11-02 against Figma page "Joocare Platform — Phase 2" (`wLe47UwWPf7BWy7Un84RM3`).
Code: `src/features/company-projects`, routes `/company/projects` and `/company/projects/[projectId]`.

> Method: Figma frames, layer specs and prototype links compared with the component code, then a visual pass on the running site (localhost:3000, employer account, 1440×1024) — see §0.

## 0. Visual check on the running site

Screens captured: projects list, actions menu, share project, share log, project candidates, remove candidate, interview details.

| | Item | Figma | Site |
| --- | --- | --- | --- |
| 🐞 | Remove candidate → Cancel button | "Cancel" | Shows the raw key **`companyPage.projects.cancel`** (Next.js dev overlay also reports "1 Issue") |
| 🐞 | Candidates table at 1440px | All 7 columns fit | **Actions column is clipped** on the right (the red remove button is cut off), so the table scrolls horizontally |
| ⚠️ | Brand green (global) | `#076914` (rgb 7,105,20) on buttons, active sidebar, links | `--primary: rgb(0,107,77)` = `#006B4D` (teal). Affects the whole site; confirm with the designer whether Phase 2 changed the brand color |
| ⚠️ | Header (global) | Home · About · Contact + green **Message** button + notifications + avatar | Home · About · **Jobs** · Contact, no Message button |
| ⚠️ | Sidebar (global) | 300px wide, icons inside rounded tiles, 16px labels | ~240px, plain icons, smaller labels |
| ⚠️ | Pagination (list + candidates) | "Show 1 - 10 from 57" **then** page numbers, both on the left | List: numbers first, then "Show…"; candidates: "Show…" left, numbers right |
| ⚠️ | Interview line in table | "Online interview" | "Online" |
| ⚠️ | Menu label | "Edit name" | "Edit project name" |
| ⚠️ | Card text sizes | See §1 | Visibly smaller than Figma (title, date, Created by, shared line) |
| ⚠️ | Interview details ✕ | Plain ✕ | Square focus ring on open (autofocus) |
| ✅ | Share project, Share log, Interview details, Close/Delete layouts | — | Match Figma |

**Legend:** ✅ Matches · ⚠️ Differs · 🐞 Bug · 🔴 Missing

---

## 1. Projects list — `10086:101678`, actions menu `11531:105758`

| | Item | Figma | Code |
| --- | --- | --- | --- |
| ✅ | Layout | Search + Recruiter filter, 3-column card grid, pagination | Same |
| ✅ | Search placeholder | "Search by project name..." | Same |
| ✅ | Card structure | Folder icon, name, date, ⋯ menu, Created by, initials + "+44 more", share box, Open Project ↗ + share button | Same |
| ✅ | Card box | radius 24, padding 12, gap 16, white, no shadow | Same (code adds a hover shadow and 16px side padding from `sm`) |
| ✅ | Actions menu | Edit name · Close project · Delete project (disabled when shared) | Same |
| ✅ | Closed state | Red "Closed" pill replaces the share button | Same |
| ✅ | Share box | "Shared N× · last <date>" + View log / "Not shared yet" | Same |
| ⚠️ | Card font sizes | Title 18/600 · date 14 · Created by 14 · "+44 more" 14 · shared line 13 | Title 16 · date 12 · Created by 12 · "+44 more" 12 · shared line 12 |
| ⚠️ | Menu font | Menu items 16/600 | Default 14 |
| ⚠️ | ⋯ icon | Dots inside an outlined circle | Plain `Ellipsis` icon |
| ⚠️ | Share icon | "Share / export" icon (arrow out of a box) | `Share2` (three connected dots) |
| 🐞 | "Shared projects can't be deleted" tooltip | Dark tooltip under the menu | Native `title` on a **disabled** item, which has `pointer-events-none`, so the tooltip **never shows** |
| ⚠️ | Recruiter filter options | "All recruiters" + names | Names only (clear by deselecting) |
| ⚠️ | Pagination | "Show 1 - 10 from 57" with 6 cards | `pageSize = 6` (Figma text and card count disagree; confirm with the designer) |
| ⚠️ | Sidebar label | "Project" | "Projects" (probably a Figma typo) |

## 2. Project candidates — `10086:101712`

| | Item | Figma | Code |
| --- | --- | --- | --- |
| ✅ | Header | Project name only | Same |
| ✅ | Filters | Search by candidate name or email + Status | Same |
| ✅ | Columns | # · Name · Nationality · Email · Phone · Assessment · Actions | Same |
| ✅ | Name cell | Avatar, underlined name, status pill (Rejected / Shortlist / Under review), interview date + "Online interview" + View note | Same |
| ✅ | Assessment cell | Passed/Failed + % + View result · Not assigned + "+ Share assessment" | Same |
| ✅ | Action buttons | 4 pills 45×30: green · dark · outline · light red | Same sizes and colors |
| ⚠️ | Table header font | 18/600 | 14 (`[&_th]:!text-sm`) |
| ⚠️ | Status filter options | All statuses · Under review · **Shortlisted** · Rejected | Rejected · Shortlist · Under review (no "All statuses", different order and label) |
| 🔴 | "View all (3)" (candidate with several assessments) | Opens `modal/candidate-assessments` | Missing; only "View result" is shown |

## 3. Prototype links vs site behavior

| Trigger | Figma goes to | Code does | |
| --- | --- | --- | --- |
| ⋯ → Edit name | `modal/edit-project-name` | Edit name modal | ✅ |
| ⋯ → Close project | `modal/close-project-confirmation` | Close modal | ✅ |
| ⋯ → Delete project | `modal/delete-project-confirmation` | Delete modal | ✅ |
| View log | `modal/project-share-log` | Share log modal | ✅ |
| Share button | `modal/share-project` → `project-sent-successfully` | Same | ✅ |
| Hiring manager field | Dropdown open state | Select | ✅ |
| Open Project | `projects/candidates-table` | `/company/projects/[id]` | ✅ |
| View note | `modal/interview-details` | Interview modal | ✅ |
| Remove button | `modal/remove-candidate-from-project` | Remove modal | ✅ |
| **Green button (1st action)** | `employer/inbox/chat-view` (**Message**) | Opens "Share Project Candidate to Hiring Manager", a modal that is **not in Figma** | 🐞 |
| **Dark button (2nd)** | `cv/reference-style/full-data` (full CV overlay) | Placeholder "Sample CV preview" modal | ⚠️ |
| Outline eye (3rd) | No link in Figma | Small "Candidate Profile" modal | ⚠️ ask designer |
| **Candidate name** | `employer/candidate-profile-preview` (full **page**) | Same small profile modal | ⚠️ |
| **+ Share assessment** | `modal/share-assessment/single-candidate` | Opens the share-to-hiring-manager modal | 🐞 |
| View result | `assessment/results/candidate-answers` (Assessments Results) | Hard-coded link `/company/assessments/company-1/company-1-1/external-invitations/1` (right component, wrong section and fixed IDs) | ⚠️ |
| View all (3) | `modal/candidate-assessments` | — | 🔴 |

## 4. Modals

| | Modal | Figma | Notes |
| --- | --- | --- | --- |
| ✅ | Share project `10138:42064` | Title, green round ✕, Hiring Manager select, prefilled message, Submit | Matches |
| ✅ | Project submitted `10138:42216` | Illustration, "What's next?" box, Go to Projects (outline) + Back to Dashboard (filled) | Matches (check the → arrow on "Back to Dashboard") |
| ✅ | Edit project name `11531:108686` | Title, ✕, input, Save Changes | Matches |
| ✅ | Close project `11531:108711` | Warning icon, "Close this project?", Yes, close project / Cancel | Matches |
| ✅ | Share log `11531:110004` | Date sent · Shared by · Sent to (Hiring Manager) | Matches |
| ✅ | Interview details `12221:67303` | Date / Time / Method / Scheduled by + green note box | Matches |
| ⚠️ | Delete project `11531:108730` | Project name **bold** in the description | Plain text |
| 🐞 | Remove candidate `11531:112183` | Name and project **bold**; Remove / Cancel | Plain text; Cancel uses `t('cancel  ')` (trailing spaces), so the key is missing and the button text breaks — `CandidateRemoveModal.tsx` |
| 🔴 | Create project `10086:123881` | Title, project name input, Create | Not built |
| 🔴 | Add candidate to project `10086:123817` | Select projects, "8 Candidates", Add To Selected Projects | Not built |
| 🔴 | Candidate assessments `11531:117890` | List of assessments + Share Another Assessment | Not built |

## 5. Broken links inside Figma (tell the designer)

- Delete item on the cards in `projects/list` (and on cards 2–6 in `actions-menu`) links to **`modal/delete-job-confirmation`** instead of `delete-project-confirmation`.
- `delete-project-confirmation` → Delete goes to **`employer/job-listings/grid`** instead of staying on Projects.
- `project-sent-successfully` → "Go to Projects" goes to the **`actions-menu`** frame instead of `projects/list`.
- `link-candidate-to-project` → one Add button swaps to **`assessment-sent-successfully/a`** instead of `candidate-linked-to-project-successfully`.
- `add-candidate-to-project` → both buttons only close; no success state.
- The eye button in the candidates table has no link.
- Nothing on the Projects list opens `modal/create-project` (it's reached from Pipeline candidates).

---

## Fix list (in order)

- [ ] 🐞 `CandidateRemoveModal.tsx`: `t('cancel  ')` → `t('cancel')` (confirmed on the site)
- [ ] 🐞 Candidates table: make all columns fit at 1440px (Actions column is clipped)
- [ ] ⚠️ Pagination order: "Show X - Y from N" then page numbers, left-aligned, on both pages
- [ ] ⚠️ "Online interview" label · "Edit name" menu label
- [ ] ❓ Confirm with designer: brand green `#076914` vs `#006B4D`, header Message button, sidebar width (global, not Projects-only)
- [ ] 🐞 Green action button → Message (chat), not share to hiring manager
- [ ] 🐞 "+ Share assessment" → share-assessment single-candidate modal
- [ ] 🐞 Make the "Shared projects can't be deleted" tooltip visible (a real Tooltip around the disabled item)
- [ ] ⚠️ Card and menu font sizes (18 / 14 / 13 / 16)
- [ ] ⚠️ Table header 18/600
- [ ] ⚠️ Status filter: All statuses · Under review · Shortlisted · Rejected; Recruiter filter: All recruiters
- [ ] ⚠️ ⋯ icon in a circle + share/export icon
- [ ] ⚠️ Bold names in Delete / Remove descriptions
- [ ] ⚠️ View result → Assessments Results route with real IDs
- [ ] ⚠️ Candidate name → candidate profile page; CV button → full CV preview
- [ ] 🔴 "View all (n)" + Candidate assessments modal
- [ ] 🔴 Create project + Add candidate to project modals
- [ ] 🔌 API integration (everything still reads `constants/project-preview-data.ts`)
