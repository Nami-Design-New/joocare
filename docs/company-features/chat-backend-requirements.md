# Chat: backend requirements

What the frontend needs from the backend to connect the chat design (company + candidate) to the API.
The design is the source of truth; items below are what the API is missing to match it.

Related: [03-company-chat.md](03-company-chat.md).

## 1. Company routes: done

The company chat routes are live and connected in the frontend (conversations, messages, send, close, reopen).

## 2. Company conversation response

Already returned: `user_id`, `name`, `image`, `unread_count`, `status` (`open` / `closed`), `last_message`.

Still missing:

- `job_title`: which job the conversation is about (shown under the candidate's name).
- `closed_at`: see section 3.

## 3. Closed conversation (both sides)

- `status` (`open` / `closed`) is already returned in the conversations and messages responses.
- The design also shows the close date ("Closed by you · date"). Add **`closed_at`** to the conversations and messages responses on both sides. Until then the frontend shows "Chat closed" without a date.
- `POST messages` on a closed conversation should return a clear error message.

## 4. "Already contacted" warning (company)

The design warns the recruiter when another recruiter in the same company has already talked to the candidate, showing their name and the date. Needed fields:

- `contacted_by: { id, name }`
- `contacted_at`

## 5. Super-admin view (company)

The design has a super-admin view of all the company's conversations, with "Contacted by <recruiter>" under each one.

- Does `company/conversations` return all the company's conversations for a super admin?
- Each conversation needs the recruiter's name.

## 6. Attachments

- The design lets the company send **PDF + images** (max 5 files, 20 MB each). The API only accepts `images[]`.
- Needed: file support (e.g. `files[]`), and each file in the response should have `name`, `size`, `type` and `url`.

## 7. Candidate side

- **Company profile link:** the chat header has "View company profile", but `user/conversations` has no company `id` or `slug`.

## 8. Behaviors to confirm

- **Read status:** after the candidate opened the conversation (`GET user/messages`), the company's message still had `is_read: false`, and `unread_count` does not go down. Either `GET messages` should mark the other side's messages as read, or a mark-read endpoint is needed.
- **Dates:** `created_at` is a ready display string in the request language (`"Today . 01 : 27 pm"`, `"اليوم . 01 : 27 م"`). The frontend shows it as is. The design groups messages under "Today" / "Yesterday" dividers, which needs an ISO date too (e.g. `created_at_iso`).
- **Message order:** confirmed newest first.
- **New conversation:** confirmed, `POST company/messages` with a new `user_id` creates the conversation.

## 9. Later

- **Realtime** (socket / pusher), so new messages show up without a refresh. Until then the frontend calls the endpoints normally.

## In the API but not in the design

The frontend will not build these unless the design adds them:

- Edit / delete message on the candidate side (`PATCH` / `DELETE user/messages/{id}`).
- The `search` parameter on conversations. The design searches locally, so only the loaded page (20 conversations) is searched.
- Pagination for older messages. With no "load more" in the design, only the last 20 messages are shown.
