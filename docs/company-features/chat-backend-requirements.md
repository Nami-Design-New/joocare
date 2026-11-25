# Chat: backend requirements

What the frontend needs from the backend to connect the chat design (company + candidate) to the API.
The design is the source of truth; items below are what the API is missing to match it.

Related: [03-company-chat.md](03-company-chat.md).

## Done and connected

Checked on `admin.joocare.cloud` on 2026-11-25:

- Company routes: conversations, messages, send, close, reopen.
- Company conversations: `job_title`, `closed_at`, `contacted_by` (the recruiter who owns the conversation).
- Messages response (company): `contacted_before`, `contacted_by`, `contacted_at` for the "already contacted" warning.
- Candidate conversations: `closed_at`, `company_id` (link to the company profile).
- Read status: `GET messages` now marks the other side's messages as read.
- Message order is newest first. `POST company/messages` with a new `user_id` creates the conversation.

## Still open

### 1. Attachments (`files`)

- `images` was replaced by `files` in every message, and the company send now uses `files[0]`, `files[1]`, ...
- **Needed:** an example response with a file in Postman. The frontend expects each item to have `id`, `name`, `type` (MIME), `size` and `url`.
- **Candidate send:** Postman still uses `images[]` for `POST user/messages`. Is that still right, or should it be `files[n]` like the company?

### 2. Super admin: one row per conversation

The super admin will be a new `super_admin` role (not added yet; the frontend uses `recruitment_manager` until then).
If two recruiters talked to the same candidate, the super admin sees two rows.

- Each company conversation needs `company_admin_id`. `user_id` alone does not identify a conversation.
- `GET messages`, `POST messages`, close and reopen need to target one recruiter's conversation (e.g. a `company_admin_id` parameter next to `user_id`).
- To confirm: can the super admin send messages in, or close, another recruiter's conversation, or only read it?

### 3. Dates

`created_at` is a ready display string in the request language (`"Today . 08 : 07 am"`, `"Yesterday"`). The frontend shows it as is.

- Older messages show only `"Yesterday"`, without the time.
- The design groups messages under "Today" / "Yesterday" dividers, which needs an ISO date too (e.g. `created_at_iso`).
- `closed_at` and `contacted_at` should use the same format as `created_at`.

### 4. Closed conversation

`POST messages` on a closed conversation should return a clear error message.

### 5. Later

- **Realtime** (socket / pusher), so new messages show up without a refresh. Until then the frontend calls the endpoints normally.

## In the API but not in the design

The frontend will not build these unless the design adds them:

- Edit / delete message on the candidate side (`PATCH` / `DELETE user/messages/{id}`).
- The `search` parameter on conversations. The design searches locally, so only the loaded page (20 conversations) is searched.
- Pagination for older messages. With no "load more" in the design, only the last 20 messages are shown.
