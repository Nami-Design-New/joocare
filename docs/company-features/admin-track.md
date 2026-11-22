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
| Job count link | In the table | `RecruiterJobCountLink` | Reuse dashboard `useGetJobsByAdmin` |

## 3. Company notifications — `feat/company-notifications-api`

Details: [08-company-notifications.md](08-company-notifications.md)

| Part | Where | Endpoints |
| --- | --- | --- |
| Notifications drawer | Company header / `src/features/notifications` | Company `notifications`: list, read, read all, delete |
| Push token | Company login / logout | Company `Auth/Firebase tokens`: store / remove |

Check first whether the company header uses the same drawer as the candidate.

## Before coding

Call GET `company-admins`, GET `roles`, GET `recruiters-stats` with the test company account and record the response shapes in the feature files.

## Backend questions

- Roles / permissions create and edit endpoints, and the permission list.
- Which field returns the logged-in admin's permissions (to hide sidebar items)?
