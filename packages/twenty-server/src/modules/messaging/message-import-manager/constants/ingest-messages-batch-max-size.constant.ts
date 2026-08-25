// The whole batch is saved in one transaction, so this bounds how long that
// transaction holds its locks rather than any provider-side limit.
export const INGEST_MESSAGES_BATCH_MAX_SIZE = 100;
