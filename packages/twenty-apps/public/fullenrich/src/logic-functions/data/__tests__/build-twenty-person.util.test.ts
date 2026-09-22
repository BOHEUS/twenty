import { describe, expect, it } from 'vitest';

import { buildTwentyPerson } from 'src/logic-functions/data/build-twenty-person.util';

const ENRICHED_AT = '2026-09-22T10:00:00.000Z';

describe('buildTwentyPerson', () => {
  it('should map the documented profile payload', () => {
    const person = buildTwentyPerson({
      enrichedAt: ENRICHED_AT,
      profile: {
        id: '746e4816-19c8-54d8-b558-65a5a52cc85c',
        first_name: 'John',
        last_name: 'Snow',
        headline: 'Head of Sales Operations',
        description: 'Sales operations leader.',
        location: {
          country: 'United States',
          city: 'San Francisco',
          region: 'California',
        },
        social_profiles: {
          professional_network: {
            url: 'https://www.linkedin.com/in/john-doe',
            handle: 'john-doe',
            connection_count: 500,
          },
        },
        skills: ['Sales Operations'],
        employment: {
          current: {
            title: 'Head of Sales Operations',
            seniority: 'Head',
            start_at: '2022-03-15T00:00:00Z',
            job_functions: [{ function: 'Sales', sub_function: 'Sales Ops' }],
            is_current: true,
          },
        },
      },
    });

    expect(person).toMatchObject({
      name: { firstName: 'John', lastName: 'Snow' },
      jobTitle: 'Head of Sales Operations',
      fullEnrichHeadline: 'Head of Sales Operations',
      fullEnrichAbout: 'Sales operations leader.',
      fullEnrichSeniority: 'HEAD',
      fullEnrichJobFunction: 'Sales',
      fullEnrichJobSubFunction: 'Sales Ops',
      fullEnrichCurrentRoleStartedAt: '2022-03-15T00:00:00Z',
      fullEnrichLinkedinConnectionCount: 500,
      fullEnrichPersonId: '746e4816-19c8-54d8-b558-65a5a52cc85c',
      fullEnrichEnrichedAt: ENRICHED_AT,
    });
    expect(person.fullEnrichLocation).toEqual({
      addressStreet1: '',
      addressStreet2: '',
      addressCity: 'San Francisco',
      addressState: 'California',
      addressPostcode: '',
      addressCountry: 'United States',
    });
  });

  it('should not write emails or phones when the enrichment found none', () => {
    const person = buildTwentyPerson({
      enrichedAt: ENRICHED_AT,
      contactInfo: { work_emails: [], phones: [] },
    });

    expect(person).not.toHaveProperty('emails');
    expect(person).not.toHaveProperty('phones');
  });

  it('should only record the enrichment timestamp when nothing came back', () => {
    expect(buildTwentyPerson({ enrichedAt: ENRICHED_AT })).toEqual({
      fullEnrichEnrichedAt: ENRICHED_AT,
    });
  });
});
