# 6. Admin users + roles

Routes: `/company/users`, `/company/roles-and-permissions`, `/hiring-manager/create-password`. Features: `src/features/company-admin-users` (reference implementation for structure), `src/features/company-admin-roles`, `src/features/auth/components/first-login`.

## Company side

| Part | Today | Endpoint |
| --- | --- | --- |
| Users list + search + role filter | Preview, filtered on the client | GET `COMPANY/company-admins?pagination=on&limit_per_page&page&search&role` |
| One user | Preview | GET `COMPANY/company-admins/{id}` |
| Add / edit / delete user | Preview | POST `company-admins`, POST `company-admins/{id}` (`_method=put`), DELETE `company-admins/{id}` |
| Roles list (table, user form, filter) | Preview | GET `COMPANY/roles` |
| Role permissions modals | Static Figma content (`permissions.data.ts`) | No endpoint. Static by decision |
| First login of an invited user | Every role except hiring manager: the backend emails a link to log in and create a password. Hiring manager: `/hiring-manager/create-password` as a magic link, later | POST `COMPANY/auth/set-password` (needs a bearer token) |

## Response shapes

Recorded on 2026-11-22 against production with the test company (id 69). GET requests only.

### GET `company-admins?pagination=on&limit_per_page=10&page=1`

Laravel paginator, fields at the top level (not under `meta`), same as the other paginated company endpoints.

```json
{
  "message": "success",
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "samira gamal",
      "email": "samiracompany@gmail.com",
      "phone": "4654656",
      "phone_code": "+971",
      "role": "Recruitment manager",
      "display_role": "Recruitment Manager",
      "role_value": "recruitment_manager",
      "company_id": 69,
      "created_at": "11 November 2026 , 11:38AM",
      "updated_at": "11 November 2026 , 11:38AM"
    }
  ],
  "current_page": 1,
  "first_page_url": "…/company-admins?page=1",
  "from": 1,
  "last_page": 1,
  "last_page_url": "…/company-admins?page=1",
  "next_page_url": null,
  "path": "…/company-admins",
  "per_page": 10,
  "prev_page_url": null,
  "to": 1,
  "total": 1
}
```

- `role` is the **translated label** (`ar`: `مدير التوظيف العام`). `role_value` is the role value from `roles` (added by the backend on 2026-11-22).
- `created_at` is already formatted and translated by the server (`ar`: `11 نوفمبر 2026 , 11:38ص`). Show it as is.
- `display_role` is free text, not translated.
- Without `pagination=on` the response is `{ message, code, data: [...], additionalData: null }`.

Query params checked:

| Param | Works | Notes |
| --- | --- | --- |
| `search` | Yes | Matches name and email. Does not match phone or role |
| `role` | Yes | Takes the role **value**. `recruitment_manager` returned the 1 admin, `admin` returned 0 (matches `count` in `roles`) |
| `name` | No | Ignored |

### GET `company-admins/{id}`

```json
{ "data": { /* same item as the list */ }, "message": "Success" }
```

Not found: `{ "data": [], "message": "Record not found" }` (`data` becomes an empty array).

### GET `roles`

```json
{
  "data": [
    { "value": "recruitment_manager", "label": "Recruitment manager", "count": 1 },
    { "value": "admin", "label": "Admin", "count": 0 },
    { "value": "recruiter", "label": "Recruiter", "count": 0 },
    { "value": "branding_specialist", "label": "Branding specialist", "count": 0 },
    { "value": "hiring_manager", "label": "Hiring manager", "count": 0 }
  ],
  "message": "Success"
}
```

`label` follows `Accept-Language`. `count` is the number of admins with that role. No pagination, no ids. `roles/{value}` and `permissions` do not exist (404).

### POST `company-admins` / POST `company-admins/{id}`

`multipart/form-data`: `name`, `email`, `phone`, `phone_code`, `display_role`, `role` (role value from `roles`). Update adds `_method=put`. Response (store and update are the same, recorded by the backend team):

```json
{
  "data": {
    "id": 30,
    "name": "Ibrahim Ahmed",
    "email": "ibrahimahmed1@gmail.com",
    "phone": "512312312",
    "phone_code": "+966",
    "role": "Admin",
    "display_role": "Junior admin manager",
    "role_value": "admin",
    "company_id": 138,
    "created_at": "22 November 2026 , 11:27AM",
    "updated_at": "22 November 2026 , 11:27AM"
  },
  "message": "Created successfully"
}
```

Validation error shape not recorded.

### DELETE `company-admins/{id}`

No body. Response:

```json
{ "data": [], "message": "Deleted successfully" }
```

### POST `auth/set-password` (from Bruno, not called)

`multipart/form-data`: `password`, `password_confirmation`. Sent with a bearer token.

## Mapping to the current UI

| UI field (`CompanyMember`) | API field | Notes |
| --- | --- | --- |
| `id` | `id` | |
| `name` | `name` | |
| `email` | `email` | Form disables it on edit, but update sends it |
| `phone` | `phone_code` + `phone` | Join for the table; split with `parsePhoneWithCode` for the form |
| `date` | `created_at` | Server-formatted |
| `role` | `role` | Translated label, shown in the table |
| — | `role_value` | Form and filter value |
| `displayedRoleName` | `display_role` | |
| — | `company_id`, `updated_at` | Not shown |

| UI field (`CompanyRole`) | API field | Notes |
| --- | --- | --- |
| `id` | — | No id. The table shows `#id`; use the row index instead |
| `key` | `value` | Snake case (`recruitment_manager`); permission data keys are kebab case (`recruitment-manager`) |
| `name` | `label` | |
| `memberCount` | `count` | |

## Gaps

### Frontend (we fix)

1. Paging, search and role filter move to the server. Search needs debounce; changing a filter resets to page 1.
2. Role options come from `roles` (`value`/`label`) instead of the `sampleCompanyRoles` names, in the form and in the filter.
3. Permission modals are keyed by `CompanyRoleKey` in kebab case. Change the keys to the API values.
4. Roles table shows `#{role.id}`; there is no id. Show the row number.
5. Form uses `useState` and a native submit. Move it to React Hook Form + Zod (`createMemberSchema(messages)`) like `candidate-settings/change-password`, with server validation errors shown on the fields.
6. `display_role` is optional in the form today; Bruno always sends it. Confirm whether it is required.
7. `/hiring-manager/create-password` only redirects. It becomes the hiring manager magic link in a later task (see decisions).
8. After add / edit / delete, invalidate both `company-admins` and `roles` (role `count` changes).

### Decisions (2026-11-22)

- **Company owner** is the super admin. The backend will stop returning it in `company-admins`; no actions on it for now.
- **Permissions** stay static (`permissions.data.ts`).
- **Roles** are view only: no create or edit.
- **Role value**: `role_value` is now in every admin item.
- **Invited admin first login**: every role except hiring manager gets an email from the backend with a link to log in and create a password. The hiring manager uses `/hiring-manager/create-password` as a magic link; that flow is a later task.

### Backend questions

1. **Validation.** Rules for store / update (unique email, phone format, `display_role` required) and the error response shape. Can the email change on update?
2. **Logged-in admin.** `auth/profile` returns only `company`, with no current admin, role or permissions. Which field tells the frontend who is logged in and what they may do (to hide sidebar items and actions per role)?

## What the candidate sees

Nothing directly. The admin is the sender in chat (`company_admin_id`) and the recruiter on jobs and stats.

## Tasks

1. Service + types + hooks for `company-admins` (list, one, store, update, delete) and `roles`.
2. Users page: server paging / search / role filter, form on RHF + Zod, delete confirm with pending state.
3. Roles page: list from `roles`, permission modals mapped by role value.
4. Later: hiring manager magic link on `/hiring-manager/create-password` with `set-password`.
