# Admin track

Owner: **Mahmoud Abbas** (in progress since 2026-11-22)

Admin users and roles → recruiter activity → company notifications. Each step is one branch from `development` and one PR back into it.

## 1. Admin users and roles — `feat/company-admin-users-api`

Details: [06-admin-users-roles.md](06-admin-users-roles.md)

| Page | Route | Component | Endpoints |
| --- | --- | --- | --- |
| Users list | `/company/users` | `company-admin-users/components/CompanyUsersPage` | GET `company-admins` (paginated) |
| Add / edit user | Dialog on users page | inside `company-admin-users` | POST `company-admins`, POST `company-admins/{id}`, GET `company-admins/{id}` |
| Delete user | Confirm dialog | inside `company-admin-users` | DELETE `company-admins/{id}` |
| Role picker | User form | — | GET `roles` |
| Roles and permissions | `/company/roles-and-permissions` | `company-admin-roles/components/RolesPage` | GET `roles` only. Create / edit is blocked; stays on preview data |
| Invited user first login | `/hiring-manager/create-password` | `auth/components/first-login/CreatePasswordContent` | Backend emails a login + create password link (all roles but hiring manager). Hiring manager magic link: later |

`company-admin-users` is a reference implementation (AGENTS.md); the structure is right, swap preview data for a service + hooks.

## 2. Recruiter activity — `feat/company-recruiter-activity-api`

Details: [07-recruiter-activity.md](07-recruiter-activity.md)

| Page | Route | Component | Endpoints |
| --- | --- | --- | --- |
| Recruiter table | `/company/recruiter-activity` | `company-recruiter-activity/components/RecruiterActivityPage` + `RecruiterActivityTable` | GET `recruiters-stats` (paginated) |
| Job count link | In the table | `RecruiterJobCountLink` | Job management with `admin_id` (GET `jobs?admin_id=&status=`) |

## 3. Company notifications — `feat/company-notifications-api`

Details: [08-company-notifications.md](08-company-notifications.md)

| Part | Where | Endpoints |
| --- | --- | --- |
| Notifications drawer | Company header / `src/features/notifications` | Company `notifications`: list, read, read all, delete |
| Push token | Company login / logout | Company `Auth/Firebase tokens`: store / remove |

Check first whether the company header uses the same drawer as the candidate.

## Role access (logged-in admin)

The company login returns the admin in `data.admin`; `role_value` is saved in the session as `companyRole` (`src/auth.ts`). One map in `features/company/constants/company-role-access.ts` drives:

- the company sidebar (links the role cannot open are hidden),
- `src/proxy.ts` (a direct visit to a page the role cannot open redirects to the role's home page),
- actions: `post-job` (sidebar Post job card), `create-assessment-category` (New category button).

| Page | Recruitment manager | Admin | Recruiter | Branding specialist | Hiring manager |
| --- | --- | --- | --- | --- | --- |
| Company profile | ✓ | ✓ | ✓ | ✓ | |
| Dashboard | ✓ | ✓ | ✓ | | |
| Jobs, post job, job details, candidate profile | ✓ | | ✓ | | |
| Projects, shared projects | ✓ | | ✓ | | ✓ |
| Assessments | ✓ | | ✓ (no new category) | | |
| Assessment results | ✓ | | ✓ | | |
| Talent database | ✓ | | | | |
| Chat | ✓ | | ✓ | | |
| Users, roles and permissions | ✓ | ✓ | | | |
| Recruiter activity | ✓ | ✓ | | | |
| Account settings | ✓ | ✓ | ✓ | ✓ | ✓ |

Home page per role: dashboard (recruitment manager, admin, recruiter), company profile (branding specialist), projects (hiring manager). Unknown role: company profile and account settings only. Session with no role (logged in before this change): full access until the next login.

Read from the static role permissions; to confirm: talent database for recruiters, chat for admins, account settings for every role, view-only limits (recruiter on company profile and dashboard), hiring manager (magic link, later).

## Before coding

Call GET `company-admins`, GET `roles`, GET `recruiters-stats` with the test company account and record the response shapes in the feature files.

## Backend questions

- Roles / permissions create and edit endpoints, and the permission list.
- Which field returns the logged-in admin's permissions (to hide sidebar items)?
