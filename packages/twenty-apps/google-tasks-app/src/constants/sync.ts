export const GOOGLE_TASKS_CONNECTION_PROVIDER_NAME = 'google-tasks';

export const GOOGLE_TASKS_BASE_API_URL = 'https://tasks.googleapis.com';

// Google's own per-page ceiling for tasks.list; the default of 20 would cost
// five times the round trips.
export const GOOGLE_TASKS_PAGE_SIZE = 100;

// Matches QUERY_MAX_RECORDS on the server, which caps how many records a
// single mutation may affect.
export const TASKS_BATCH_SIZE = 200;

// Matches MAX_JOBS_PER_ENQUEUE on the server.
export const MAX_JOBS_PER_ENQUEUE = 200;

// updateTasks applies one payload to a filter, so per-task edits need one call
// each; this bounds how many are in flight at once.
export const UPDATE_CONCURRENCY = 10;
