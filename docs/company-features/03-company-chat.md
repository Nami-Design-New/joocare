# 3. Company chat

Route: `/company/chat`. Feature: `src/features/chat` (`CompanyChatPage`, `useCompanyChat`).

## Company side

| Part | Today | Endpoint |
| --- | --- | --- |
| Conversation list | Preview (`createChatPreview`) | **No company conversations endpoint in Bruno** |
| Messages with one candidate | Preview | GET `COMPANY/messages?user_id={id}` |
| Send message | Preview | POST `COMPANY/messages` |

## What the candidate sees

`/candidate/chat` is already on the API (`USER/conversations`, `USER/messages?company_admin_id`, POST `USER/messages`). A message the company sends should appear there in the candidate's conversation with that company admin.

## Tasks

1. Reuse the candidate chat structure (`candidate-chat-service.ts`, `candidate-chat-mapper.ts`) for a `company-chat-service.ts` + hooks.
2. Wire messages + send; test end to end with the candidate account open in a second browser.
3. Let pipeline (01) and talent database (04) open the chat with a selected candidate.

## Backend questions

See [chat-backend-requirements.md](chat-backend-requirements.md).
