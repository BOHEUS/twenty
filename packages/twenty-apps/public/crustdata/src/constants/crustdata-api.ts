export const CRUSTDATA_BASE_URL = 'https://api.crustdata.com';

// Crustdata pins breaking changes behind a dated version header; every request must send one.
export const CRUSTDATA_API_VERSION = '2025-11-01';

// Every enrich endpoint caps a single request at 25 identifiers.
export const CRUSTDATA_BATCH_SIZE = 25;

export const CRUSTDATA_PERSON_ENRICH_PATH = '/person/enrich';
export const CRUSTDATA_CONTACT_ENRICH_PATH = '/person/contact/enrich';
export const CRUSTDATA_COMPANY_ENRICH_PATH = '/company/enrich';

// Crustdata allows 15 requests per minute by default and answers 429 with the seconds left in the
// window. A bulk run issues several requests back to back, so it retries rather than failing a
// whole chunk; the ceiling keeps a retry well inside the 300s logic-function timeout.
export const CRUSTDATA_RATE_LIMIT_MAX_RETRIES = 2;
export const CRUSTDATA_RATE_LIMIT_MAX_WAIT_SECONDS = 60;
