export const LUSHA_API_BASE_URL = 'https://api.lusha.com/v3';

// Lusha rejects search-and-enrich requests carrying more than 100 records.
export const LUSHA_BATCH_SIZE = 100;

export const LUSHA_REQUEST_TIMEOUT_MILLISECONDS = 60_000;

// Lusha asks clients to back off and retry on 429 and 5xx responses.
export const LUSHA_RETRY_DELAYS_MILLISECONDS = [1_000, 3_000];
