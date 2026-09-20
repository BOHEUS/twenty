// A person lookup answers "progress" while RocketReach is still searching.
// check_status is not one of the operations RocketReach lists a credit cost
// for, so a bounded poll finishes most lookups inside the function timeout;
// the rest stay PENDING for a later run.
export const LOOKUP_POLL_INTERVAL_MS = 3_000;
export const LOOKUP_POLL_MAX_ATTEMPTS = 8;
export const CHECK_STATUS_BATCH_SIZE = 100;
