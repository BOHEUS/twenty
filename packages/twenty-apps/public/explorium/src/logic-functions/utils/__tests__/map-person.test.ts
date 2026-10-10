import { describe, expect, it } from 'vitest';

import { EXPLORIUM_PERSON_DATA_MOCK } from 'src/logic-functions/__mocks__/explorium-person-data.mock';
import { mapPerson } from 'src/logic-functions/utils/map-person';

describe('mapPerson', () => {
  it('maps standard fields', () => {
    const { standard } = mapPerson(EXPLORIUM_PERSON_DATA_MOCK);

    expect(standard.name).toEqual({ firstName: 'Jane', lastName: 'Doe' });
    expect(standard.jobTitle).toBe('Head of Marketing');
    expect(standard.emails).toEqual({
      primaryEmail: 'jane.doe@acme.com',
      additionalEmails: null,
    });
    expect(standard.linkedinLink).toMatchObject({
      primaryLinkUrl: 'https://www.linkedin.com/in/janedoe',
    });
  });

  it('does not write a professional email Explorium marks as invalid', () => {
    const { standard, explorium } = mapPerson({
      ...EXPLORIUM_PERSON_DATA_MOCK,
      professional_email_status: 'invalid',
    });

    expect(standard.emails).toBeUndefined();
    expect(explorium.exploriumEmailStatus).toBe('INVALID');
  });

  it('puts the mobile phone first and dedupes the phone numbers list', () => {
    const { standard } = mapPerson(EXPLORIUM_PERSON_DATA_MOCK);

    expect(standard.phones).toMatchObject({
      primaryPhoneNumber: '+15125550100',
      additionalPhones: [
        { number: '+15125550199', countryCode: '', callingCode: '' },
      ],
    });
  });

  it('maps job levels and departments with the main value first, dropping unknowns', () => {
    const { explorium } = mapPerson(EXPLORIUM_PERSON_DATA_MOCK);

    expect(explorium.exploriumJobLevels).toEqual(['DIRECTOR']);
    expect(explorium.exploriumJobDepartments).toEqual(['MARKETING', 'SALES']);
  });

  it('maps profile selects, arrays, json and location', () => {
    const { explorium } = mapPerson(EXPLORIUM_PERSON_DATA_MOCK);

    expect(explorium).toMatchObject({
      exploriumId: 'ee936e451b50c70e068e1b54e106cb89173198c4',
      exploriumGender: 'FEMALE',
      exploriumAgeGroup: '35-44',
      exploriumEmailStatus: 'CATCH_ALL',
      exploriumSkills: ['seo', 'branding'],
      exploriumInterests: ['hiking'],
      exploriumEducation: [{ institution_name: 'UT Austin' }],
      exploriumLocation: {
        addressCity: 'austin',
        addressState: 'texas',
        addressCountry: 'united states',
      },
    });
    expect(explorium.exploriumLinkedinUrls).toHaveLength(2);
  });

  it('omits fields Explorium did not return', () => {
    const { standard, explorium } = mapPerson({ prospect_id: 'p1' });

    expect(standard).toEqual({});
    expect(explorium).toEqual({ exploriumId: 'p1' });
  });
});
