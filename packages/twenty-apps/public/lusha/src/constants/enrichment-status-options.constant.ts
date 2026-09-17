export const LUSHA_ENRICHMENT_STATUS_OPTIONS = [
  { value: 'ENRICHED', label: 'Enriched', color: 'green', position: 0 },
  { value: 'NOT_FOUND', label: 'Not found', color: 'gray', position: 1 },
  { value: 'ERROR', label: 'Error', color: 'red', position: 2 },
] as const;

export type LushaEnrichmentStatus =
  (typeof LUSHA_ENRICHMENT_STATUS_OPTIONS)[number]['value'];
