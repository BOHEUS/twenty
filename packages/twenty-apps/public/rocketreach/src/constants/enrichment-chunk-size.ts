// One RocketReach lookup is one HTTP request, so chunks keep memory and the
// pending-lookup polling window bounded rather than batching an API call.
export const ENRICHMENT_CHUNK_SIZE = 25;
