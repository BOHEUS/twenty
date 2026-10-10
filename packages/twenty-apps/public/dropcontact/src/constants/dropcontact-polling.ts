// Batches are processed asynchronously. The poll budget leaves room inside the
// 300s function timeout to write results; batches still processing after it
// stay PENDING and are collected by a later run without being resubmitted.
export const DROPCONTACT_POLL_INTERVAL_MS = 15_000;
export const DROPCONTACT_POLL_BUDGET_MS = 210_000;
