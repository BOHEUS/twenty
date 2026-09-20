import { describe, expect, it } from 'vitest';

import { rocketReachPersonDataMock } from 'src/logic-functions/__mocks__/rocketreach-person-data.mock';
import { mapPerson } from 'src/logic-functions/utils/map-person';

describe('mapPerson', () => {
  it('fills the standard person fields', () => {
    const { standard } = mapPerson(rocketReachPersonDataMock);

    expect(standard.name).toEqual({
      firstName: 'Ada',
      lastName: 'Lovelace',
    });
    expect(standard.jobTitle).toBe('Head of Analytical Engines');
    expect(standard.emails).toEqual({
      primaryEmail: 'ada@analytical-engines.com',
      additionalEmails: ['ada@example.com'],
    });
    expect(standard.phones).toMatchObject({
      primaryPhoneNumber: '+442079461111',
      primaryPhoneCountryCode: 'GB',
    });
  });

  it('takes department and seniority from the current role only', () => {
    const { rocketReach } = mapPerson(rocketReachPersonDataMock);

    expect(rocketReach.rocketReachDepartment).toBe('engineering');
    expect(rocketReach.rocketReachSubDepartment).toBe('research');
    expect(rocketReach.rocketReachSeniority).toBe('director');
  });

  it('stores the profile id as text and the birth year as a number', () => {
    const { rocketReach } = mapPerson(rocketReachPersonDataMock);

    expect(rocketReach.rocketReachId).toBe('1234');
    expect(rocketReach.rocketReachBirthYear).toBe(1815);
  });

  it('dedupes skills case-insensitively', () => {
    const { rocketReach } = mapPerson(rocketReachPersonDataMock);

    expect(rocketReach.rocketReachSkills).toEqual([
      'mathematics',
      'programming',
    ]);
  });

  it('builds the location from city, region and country', () => {
    const { rocketReach } = mapPerson(rocketReachPersonDataMock);

    expect(rocketReach.rocketReachLocation).toEqual({
      addressStreet1: '',
      addressStreet2: '',
      addressCity: 'London',
      addressPostcode: '',
      addressState: 'England',
      addressCountry: 'United Kingdom',
      addressLat: 51.5,
      addressLng: -0.12,
    });
  });

  it('omits fields the payload does not carry', () => {
    const { standard, rocketReach } = mapPerson({ id: 1, name: 'Ada Lovelace' });

    expect(standard.emails).toBeUndefined();
    expect(standard.phones).toBeUndefined();
    expect(rocketReach.rocketReachSkills).toBeUndefined();
    expect(rocketReach.rocketReachLocation).toBeUndefined();
  });
});
