import { describe, expect, it } from 'vitest';

import { COGNISM_PERSON_DATA_MOCK } from 'src/logic-functions/__mocks__/cognism-person-data.mock';
import { mapPerson } from 'src/logic-functions/utils/map-person';

describe('mapPerson', () => {
  it('maps standard fields', () => {
    const { standard } = mapPerson(COGNISM_PERSON_DATA_MOCK);

    expect(standard.name).toEqual({ firstName: 'Jane', lastName: 'Doe' });
    expect(standard.emails).toEqual({
      primaryEmail: 'jane.doe@acme.com',
      additionalEmails: null,
    });
    expect(standard.phones).toMatchObject({
      primaryPhoneNumber: '+441234567890',
      additionalPhones: [
        { number: '+441234567891', countryCode: '', callingCode: '' },
      ],
    });
    expect(standard.jobTitle).toBe('Chief Executive Officer');
    expect(standard.linkedinLink).toMatchObject({
      primaryLinkUrl: 'https://linkedin.com/in/janedoe',
    });
  });

  it('maps identifiers and select fields', () => {
    const { cognism } = mapPerson(COGNISM_PERSON_DATA_MOCK);

    expect(cognism.cognismId).toBe('cognism-contact-1');
    expect(cognism.cognismRedeemId).toBe('redeem-contact-1');
    expect(cognism.cognismManagementLevel).toBe('C_LEVEL');
    expect(cognism.cognismEmailQuality).toBe('VERIFIED');
  });

  it('drops multi-select values outside the known taxonomy', () => {
    const { cognism } = mapPerson(COGNISM_PERSON_DATA_MOCK);

    expect(cognism.cognismJobFunction).toEqual(['SALES', 'MARKETING']);
  });

  it('accepts a single job function returned as a bare string', () => {
    const { cognism } = mapPerson({
      ...COGNISM_PERSON_DATA_MOCK,
      jobFunction: 'Finance',
    });

    expect(cognism.cognismJobFunction).toEqual(['FINANCE']);
  });

  it('dedupes array fields and passes raw json through', () => {
    const { cognism } = mapPerson(COGNISM_PERSON_DATA_MOCK);

    expect(cognism.cognismSkills).toEqual(['leadership', 'strategy']);
    expect(cognism.cognismPreviousAccounts).toEqual([{ name: 'Globex' }]);
    expect(cognism.cognismEducation).toEqual([
      { school: 'Imperial College London' },
    ]);
  });

  it('keeps the phone score and do-not-call flag as raw json', () => {
    const { cognism } = mapPerson(COGNISM_PERSON_DATA_MOCK);

    expect(cognism.cognismPhoneNumbers).toEqual([
      { number: '+441234567890', score: 90, dnc: false },
      { number: '+441234567891', score: 40, dnc: true },
    ]);
  });

  it('normalizes dates and drops empty event arrays', () => {
    const { cognism } = mapPerson(COGNISM_PERSON_DATA_MOCK);

    expect(cognism.cognismPositionStartDate).toBe('2021-06-01T00:00:00.000Z');
    expect(cognism.cognismLastConfirmed).toBe('2026-08-14T00:00:00.000Z');
    expect(cognism.cognismJobJoinEvent).toEqual([{ date: '2021-06-01' }]);
    expect('cognismJobLeaveEvent' in cognism).toBe(false);
  });

  it('stores the country as an address and the GDPR flag as a boolean', () => {
    const { cognism } = mapPerson(COGNISM_PERSON_DATA_MOCK);

    expect(cognism.cognismLocation).toMatchObject({
      addressCountry: 'United Kingdom',
      addressCity: '',
    });
    expect(cognism.cognismPrivacyNotificationSent).toBe(true);
  });

  it('does not map account attributes onto the person', () => {
    const { cognism } = mapPerson(COGNISM_PERSON_DATA_MOCK);

    expect('cognismAccountName' in cognism).toBe(false);
    expect('cognismIndustries' in cognism).toBe(false);
  });
});
