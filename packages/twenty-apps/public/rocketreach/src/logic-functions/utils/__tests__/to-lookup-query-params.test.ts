import { describe, expect, it } from 'vitest';

import { toLookupQueryParams } from 'src/logic-functions/utils/to-lookup-query-params';
import { type RevealSettings } from 'src/types/reveal-settings';

const revealSettings: RevealSettings = {
  professionalEmail: true,
  personalEmail: false,
  phone: true,
  detailedPersonEnrichment: true,
  healthcareEnrichment: false,
};

describe('toLookupQueryParams', () => {
  it('always sends every reveal flag', () => {
    expect(toLookupQueryParams({ params: { profileId: 7 }, revealSettings }))
      .toEqual({
        id: '7',
        reveal_professional_email: 'true',
        reveal_personal_email: 'false',
        reveal_phone: 'true',
        reveal_detailed_person_enrichment: 'true',
        reveal_healthcare_enrichment: 'false',
      });
  });

  it('looks up by profile id alone when one is known', () => {
    const queryParams = toLookupQueryParams({
      params: { profileId: 7, email: 'ada@example.com' },
      revealSettings,
    });

    expect(queryParams.id).toBe('7');
    expect(queryParams.email).toBeUndefined();
  });

  it('sends a name only when it is paired with an employer', () => {
    expect(
      toLookupQueryParams({
        params: { name: 'Ada Lovelace' },
        revealSettings,
      }).name,
    ).toBeUndefined();

    expect(
      toLookupQueryParams({
        params: {
          name: 'Ada Lovelace',
          currentEmployer: 'Analytical Engines Ltd',
          title: 'Head of Analytical Engines',
        },
        revealSettings,
      }),
    ).toMatchObject({
      name: 'Ada Lovelace',
      current_employer: 'Analytical Engines Ltd',
      title: 'Head of Analytical Engines',
    });
  });
});
