# Hiring manager review: backend requirements

What the frontend needs from the backend to connect the hiring manager review page (`/hiring-manager/{projectId}?token=...`) to the API.
The design is the source of truth; items below are what the API is missing to match it.

Related: [05-projects.md](05-projects.md), [hiring-management-backend-pending.md](../hiring-management-backend-pending.md) (section 7).

## Flow

1. A recruiter shares a project: `POST C/projects/{id}/assign-to-hiring-manager` (`assignee_id`, `note`). Connected.
2. The backend emails the hiring manager a link: `https://www.joocare.cloud/{locale}/hiring-manager/{projectId}?token={token}`. This matches the frontend route.
3. The page keeps the token for the tab and calls the `C/hiring-manager/...` endpoints with it as a Bearer token.
4. Design steps: review candidates (Shortlist / Reject each one) → schedule interviews for the shortlisted ones → submit → summary modal.

## Checked on `admin.joocare.cloud` (2026-11-25, project 3)

### `GET C/hiring-manager/projects/{id}`

```json
{
  "id": 3,
  "name": "Pharmacists QA",
  "assigned_by": "Ahmed Ehab",
  "created_at": "25 minutes ago"
}
```

A project that does not exist returns 404.

### `GET C/hiring-manager/projects/{id}/users?status=&pagination=on&limit_per_page=&page=`

Each row: `id`, `user_id`, `name`, `specialty`, `country`, `experience`, `phone`, `phone_code`, `email`, `status` (`under_review`), `status_label`, `cv`. Paginated, `status` filter works.

## Security: blocker

**Decision:** the hiring manager has no access except this review page.

Today the token from the email link also works on regular company endpoints: `GET C/auth/profile` returned the company profile and `GET C/projects/3` returned the full project. Anyone who gets the link (forwarded, leaked) has company access.

Needed:

- The link token only works on `C/hiring-manager/projects/{id}/...`. Every other company endpoint returns 403 for it.
- Only for projects shared with that hiring manager; any other project returns 403/404.

## Missing endpoints

### 1. Candidate decision

Shortlist / Reject one candidate, and move back to "Under review" (clicking the active decision again).

- e.g. `POST C/hiring-manager/projects/{id}/users/{projectUserId}/status` with `status`.
- Status values: `under_review` is confirmed. Are the other two `shortlisted` and `rejected`?

### 2. Interviews

For every shortlisted candidate the design asks for:

- `date` and `time`
- `method`: `online` or `face_to_face`
- Is a meeting link (online) or an address (face to face) needed?

### 3. Submit

Sends the decisions and interviews in one step and returns the counts for the summary modal (`shortlisted`, `rejected`).

- Can the hiring manager open the link again and change decisions after submitting, or is the review locked?
- Does the recruiter get notified (notification / email)?

## Missing fields

- **Candidate `image`:** the review card shows the candidate photo.
- **Share date:** `created_at` is relative ("25 minutes ago"). The design shows "Shared by Ahmed Ehab · {date}"; a date (and ideally ISO) is needed.
- **Total candidates:** taken from the users list `total`. Fine unless the header should count all statuses while a filter is active.
- **`note`:** the note from `assign-to-hiring-manager` is not returned. Is it shown to the hiring manager?

## Token behavior to confirm

- Does the token work for one project or every project shared with this hiring manager?
- When does it expire, and is it single use?
- On an expired / invalid token (401), where should the user go? Today the frontend sends them to the employer login.
- The frontend keeps the token in `sessionStorage` (per tab). Opening the page again without the link in a new tab redirects to login. Is that the expected behavior?
- Decided: the hiring manager only enters through the email link. They have no password and do not use the employer login; the backend should reject a login attempt with their email.
