import { describe, expect, it } from 'vitest';

import { ENRICHMENT_STATUS_OPTIONS } from 'src/constants/enrichment-status-options';
import {
  APP_DESCRIPTION,
  APP_DISPLAY_NAME,
  APPLICATION_UNIVERSAL_IDENTIFIER,
  ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS,
  ROCKETREACH_SELECT_OPTION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

const collectUuids = (value: unknown): string[] =>
  typeof value === 'string'
    ? [value]
    : Object.values(value as Record<string, unknown>).flatMap(collectUuids);

describe('application identifiers', () => {
  it('should expose the application metadata constants', () => {
    expect(APP_DISPLAY_NAME).toBeTruthy();
    expect(typeof APP_DESCRIPTION).toBe('string');
    expect(APPLICATION_UNIVERSAL_IDENTIFIER).toMatch(UUID_V4_REGEX);
  });

  it('should use a unique UUID v4 for every entity', () => {
    const uuids = [
      APPLICATION_UNIVERSAL_IDENTIFIER,
      ...collectUuids(ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS),
      ...collectUuids(ROCKETREACH_SELECT_OPTION_UNIVERSAL_IDENTIFIERS),
    ];

    for (const uuid of uuids) {
      expect(uuid).toMatch(UUID_V4_REGEX);
    }
    expect(new Set(uuids).size).toBe(uuids.length);
  });

  it('should have an option id for every enrichment status', () => {
    for (const { key } of ENRICHMENT_STATUS_OPTIONS) {
      expect(
        ROCKETREACH_SELECT_OPTION_UNIVERSAL_IDENTIFIERS.personEnrichmentStatus,
      ).toHaveProperty(key);
      expect(
        ROCKETREACH_SELECT_OPTION_UNIVERSAL_IDENTIFIERS.companyEnrichmentStatus,
      ).toHaveProperty(key);
    }
  });
});
