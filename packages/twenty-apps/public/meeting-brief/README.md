# Meeting brief

Get a short AI brief in your Twenty inbox before each meeting with people from your CRM.

## How it works

- Every 5 minutes, the app looks at synced calendar events starting in the next 60 minutes.
- A meeting gets a brief when at least one attendee is a known CRM person. Each workspace member attending (and not declining) gets their own brief.
- The brief is written by the app's agent, running as that member, so it only uses records they can see. It has two sections: **From your CRM** (facts read from records) and **Suggestions** (AI-generated talking points and questions).
- The brief lands in the member's inbox, in one conversation per meeting, so they can ask follow-up questions there.
- If the meeting is rescheduled, a new brief is sent for the new time. Canceled meetings are skipped.

The app adds a **Meeting brief prepared for** field on calendar event participants (plus a pending timestamp) to remember which start time each member was briefed for.

## Billing

Each brief is one agent run, billed in workspace AI credits. A brief that fails (for example when credits run out) is retried every 15 minutes while the meeting is still ahead, so at most a few attempts per meeting.
