export const MEETING_BRIEF_LEAD_TIME_MINUTES = 60;
export const MEETING_BRIEF_CRON_INTERVAL_MINUTES = 5;
// Each brief is a full agent run, so cap the work per run to stay within the timeout;
// leftover attendees are picked up by the next run.
export const MAX_MEETING_BRIEFS_PER_RUN = 5;
export const SEND_MEETING_BRIEFS_TIMEOUT_SECONDS = 300;
// Longer than the timeout so a claim held by a running run is never taken over,
// and long enough that a failing brief is retried only a few times before the meeting.
export const MEETING_BRIEF_RETRY_AFTER_MINUTES = 15;
