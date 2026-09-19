const TRUTHY_VALUES = new Set(['true', '1', 'yes', 'on']);

export const isContactEnrichmentEnabled = (): boolean =>
  TRUTHY_VALUES.has(
    (process.env.CRUSTDATA_CONTACT_ENRICHMENT_ENABLED ?? '')
      .trim()
      .toLowerCase(),
  );
