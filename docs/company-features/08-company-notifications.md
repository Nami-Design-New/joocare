# 8. Company notifications

Feature: `src/features/notifications` (header drawer). Candidate side is on the API.

## Company side

Bruno `Company/notifications` has list, mark read, mark all read, delete, and `Company/Auth/Firebase tokens` has store / remove push token. Check whether the company header already uses the same drawer and which endpoints it calls.

## Why last

Notifications report the events from steps 1–5 (new applicant, assessment submitted, new message, hiring manager review). Wire them once those events exist so they can be tested end to end.

## The candidate's side of the same events

| Company action | Candidate notification (expected) |
| --- | --- |
| Changes application status | Status update |
| Assigns assessment | Assessment invitation with link |
| Sends message | New message |
| Shortlists / schedules interview | Interview invitation |

## Backend questions

- List of notification types for both company and candidate, and the payload (link target) for each.
