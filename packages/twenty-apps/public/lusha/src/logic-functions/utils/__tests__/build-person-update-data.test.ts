import { describe, expect, it } from 'vitest';

import { LUSHA_CONTACT_MOCK } from 'src/logic-functions/__mocks__/lusha-contact.mock';
import {
  buildPersonLushaData,
  buildPersonStandardData,
} from 'src/logic-functions/utils/build-person-update-data';

describe('buildPersonStandardData', () => {
  it('should fill an empty person from the Lusha contact', () => {
    expect(
      buildPersonStandardData({
        person: { id: 'person-1' },
        contact: LUSHA_CONTACT_MOCK,
      }),
    ).toEqual({
      name: { firstName: 'Orit', lastName: 'Shilvock' },
      jobTitle: 'Vice President of Partnerships',
      linkedinLink: {
        primaryLinkUrl: 'https://www.linkedin.com/in/orit-shilvock-6243bb5',
        primaryLinkLabel: '',
        secondaryLinks: null,
      },
      emails: {
        primaryEmail: 'orit.shilvock@lusha.com',
        additionalEmails: ['orit.private@gmail.com'],
      },
      phones: {
        primaryPhoneNumber: '+972 52-555-0199',
        primaryPhoneCountryCode: '',
        primaryPhoneCallingCode: '',
        additionalPhones: [
          { number: '+972 3-555-0100', countryCode: '', callingCode: '' },
        ],
      },
    });
  });

  it('should leave the values a person already has', () => {
    expect(
      buildPersonStandardData({
        person: {
          id: 'person-1',
          name: { firstName: 'Orit', lastName: '' },
          jobTitle: 'Head of Partnerships',
          linkedinLink: {
            primaryLinkUrl: 'linkedin.com/in/orit-shilvock-6243bb5/',
          },
        },
        contact: {
          ...LUSHA_CONTACT_MOCK,
          emails: [],
          phones: [],
        },
      }),
    ).toEqual({ name: { firstName: 'Orit', lastName: 'Shilvock' } });
  });
});

describe('buildPersonLushaData', () => {
  it('should map the Lusha contact onto the Lusha fields', () => {
    expect(
      buildPersonLushaData({
        contact: LUSHA_CONTACT_MOCK,
        enrichedAt: '2026-09-17T10:00:00.000Z',
      }),
    ).toEqual({
      lushaId: '4389064704',
      lushaSeniority: 'VICE_PRESIDENT',
      lushaDepartments: ['Business Development'],
      lushaLocation: {
        addressStreet1: '',
        addressStreet2: '',
        addressCity: 'Tel Aviv',
        addressState: 'Tel Aviv District',
        addressPostcode: '',
        addressCountry: 'Israel',
        addressLat: 32.08087921142578,
        addressLng: 34.78057098388672,
      },
      lushaXLink: {
        primaryLinkUrl: 'https://twitter.com/lushaofficial',
        primaryLinkLabel: '',
        secondaryLinks: null,
      },
      lushaPreviousEmployment: LUSHA_CONTACT_MOCK.previousEmployment,
      lushaEmailConfidence: 'A+',
      lushaDoNotCall: true,
      lushaIsEuContact: false,
      lushaDataUpdatedAt: '2026-04-23',
      lushaLastEnrichedAt: '2026-09-17T10:00:00.000Z',
      lushaEnrichmentStatus: 'ENRICHED',
      lushaRawPayload: LUSHA_CONTACT_MOCK,
    });
  });

  it('should leave out what Lusha did not reveal', () => {
    const lushaData = buildPersonLushaData({
      contact: {
        id: '4389064704',
        jobTitle: { seniority: 'Galactic Overlord' },
      },
      enrichedAt: '2026-09-17T10:00:00.000Z',
    });

    expect(Object.keys(lushaData)).toEqual([
      'lushaId',
      'lushaLastEnrichedAt',
      'lushaEnrichmentStatus',
      'lushaRawPayload',
    ]);
  });
});
