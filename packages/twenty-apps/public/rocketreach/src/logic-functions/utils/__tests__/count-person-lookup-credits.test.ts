import { describe, expect, it } from 'vitest';

import { countPersonLookupCredits } from 'src/logic-functions/utils/count-person-lookup-credits';

describe('countPersonLookupCredits', () => {
  it('counts the documented cost of the default reveals', () => {
    expect(
      countPersonLookupCredits({
        professionalEmail: true,
        detailedPersonEnrichment: true,
        personalEmail: false,
        phone: false,
        healthcareEnrichment: false,
      }),
    ).toBe(3);
  });

  it('adds personal email, phone and healthcare when they are on', () => {
    expect(
      countPersonLookupCredits({
        professionalEmail: true,
        detailedPersonEnrichment: true,
        personalEmail: true,
        phone: true,
        healthcareEnrichment: true,
      }),
    ).toBe(13);
  });
});
