import { describe, expect, it } from 'vitest';

import { crustdataPersonDataMock } from 'src/logic-functions/__mocks__/crustdata-person-data.mock';
import { mapPerson } from 'src/logic-functions/utils/map-person';

describe('mapPerson', () => {
  it('maps the standard Person fields', () => {
    const { standard } = mapPerson(crustdataPersonDataMock);

    expect(standard.name).toEqual({ firstName: 'Ada', lastName: 'Lovelace' });
    expect(standard.jobTitle).toBe('Principal Engineer');
    expect(standard.linkedinLink).toMatchObject({
      primaryLinkUrl: 'https://www.linkedin.com/in/adalovelace',
    });
  });

  it('puts the business email first and keeps the personal one as additional', () => {
    const { standard } = mapPerson(crustdataPersonDataMock);

    expect(standard.emails).toEqual({
      primaryEmail: 'ada@analyticalengines.com',
      additionalEmails: ['ada@example.com'],
    });
  });

  it('splits the calling code off the E.164 phone number', () => {
    const { standard } = mapPerson(crustdataPersonDataMock);

    expect(standard.phones).toMatchObject({
      primaryPhoneNumber: '2071234567',
      primaryPhoneCallingCode: '+44',
    });
  });

  it('maps the custom fields from their documented paths', () => {
    const { crustdata } = mapPerson(crustdataPersonDataMock);

    expect(crustdata).toMatchObject({
      crustdataPersonId: '78123',
      crustdataHeadline: 'Building analytical engines',
      crustdataDepartment: 'Engineering',
      crustdataSubDepartment: 'Software Engineering',
      crustdataNormalizedTitle: 'Principal Software Engineer',
      crustdataAuthenticityVerdict: 'CLEARLY_GENUINE',
      crustdataAuthenticityTier: 0,
      crustdataConnections: 4312,
      crustdataEmailStatus: 'DELIVERABLE',
      crustdataSkills: ['Mathematics', 'Algorithms'],
      crustdataCurrentJobStartDate: '2023-04-01',
    });
  });

  it('reads years of experience from the raw figure, not the band', () => {
    const { crustdata } = mapPerson(crustdataPersonDataMock);

    expect(crustdata.crustdataYearsOfExperience).toBe(14);
  });

  it('builds the X link from the handle', () => {
    const { crustdata } = mapPerson(crustdataPersonDataMock);

    expect(crustdata.crustdataXLink).toMatchObject({
      primaryLinkUrl: 'https://x.com/adalovelace',
    });
  });

  it('omits contact fields when contact enrichment did not run', () => {
    const { standard, crustdata } = mapPerson({
      ...crustdataPersonDataMock,
      contact: undefined,
    });

    expect(standard.emails).toBeUndefined();
    expect(standard.phones).toBeUndefined();
    expect(crustdata.crustdataEmailStatus).toBeUndefined();
  });

  it('returns no keys for an empty payload', () => {
    const { standard, crustdata } = mapPerson({});

    expect(standard).toEqual({});
    expect(crustdata).toEqual({});
  });
});
