# 6. Admin users + roles

Routes: `/company/users`, `/company/roles-and-permissions`. Features: `src/features/company-admin-users` (reference implementation for structure), `src/features/company-admin-roles`.

## Company side

| Part | Today | Endpoint |
| --- | --- | --- |
| Users list | Preview | GET `COMPANY/company-admins` |
| One user | Preview | GET `COMPANY/company-admins/{id}` |
| Add / edit / delete user | Preview | POST / POST `{id}` / DELETE `COMPANY/company-admins` |
| Roles list (for the user form) | Preview | GET `COMPANY/roles` |
| Create / edit roles and permissions | Preview | **Only `roles` list in Bruno** |
| First login of an invited user | Built | `/hiring-manager/create-password` — check endpoint |

## What the candidate sees

Nothing directly. The admin is the sender in chat (`company_admin_id`) and the recruiter on jobs and stats.

## Tasks

1. Wire users CRUD + roles list. Independent of other features; can be done in parallel.
2. Leave roles editing on preview until endpoints exist.

## Backend questions

- Roles / permissions CRUD endpoints and the permission list.
- Does the frontend need to hide sidebar items by permission? Which field returns the current admin's permissions?
