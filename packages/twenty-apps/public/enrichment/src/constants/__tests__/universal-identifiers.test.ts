import { describe, expect, it } from 'vitest';

import {
  APPLICATION_UNIVERSAL_IDENTIFIER,
  DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
  ENRICHMENT_FIELD_UNIVERSAL_IDENTIFIERS,
  ENRICHMENT_SELECT_OPTION_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

describe('ENRICHMENT_FIELD_UNIVERSAL_IDENTIFIERS', () => {
  it('gives every field its own identifier', () => {
    const identifiers = [
      APPLICATION_UNIVERSAL_IDENTIFIER,
      DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
      ...Object.values(ENRICHMENT_FIELD_UNIVERSAL_IDENTIFIERS.person),
      ...Object.values(ENRICHMENT_FIELD_UNIVERSAL_IDENTIFIERS.company),
      ...Object.values(ENRICHMENT_SELECT_OPTION_UNIVERSAL_IDENTIFIERS).flatMap(
        (optionIdentifiers) => Object.values(optionIdentifiers),
      ),
    ];

    expect(new Set(identifiers).size).toBe(identifiers.length);
  });
});
