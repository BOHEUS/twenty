import { describe, expect, it } from 'vitest';

import { mapContact } from 'src/logic-functions/utils/map-contact';

describe('mapContact', () => {
  it('unwraps the { value, source } shape of alternate emails and phones', () => {
    const { standard } = mapContact({
      email: 'ada@example.com',
      emailAlt: [{ value: 'ada.lovelace@example.com', source: 'WEB' }],
      supplementalEmail: 'ada@personal.example',
      phone: '+15550000001',
      directPhoneAlt: [{ value: '+15550000002', source: 'WEB' }],
    });

    expect(standard.emails).toEqual({
      primaryEmail: 'ada@example.com',
      additionalEmails: ['ada.lovelace@example.com', 'ada@personal.example'],
    });
    expect(standard.phones).toMatchObject({
      primaryPhoneNumber: '+15550000001',
      additionalPhones: [
        { number: '+15550000002', countryCode: '', callingCode: '' },
      ],
    });
  });

  it('splits the job function object into function and department', () => {
    const { zoomInfo } = mapContact({
      jobFunction: { name: 'Engineering', department: 'Product' },
    });

    expect(zoomInfo.zoomInfoJobFunction).toBe('Engineering');
    expect(zoomInfo.zoomInfoJobDepartment).toBe('Product');
  });

  it('parses the accuracy score returned as a string', () => {
    const { zoomInfo } = mapContact({ contactAccuracyScore: '95' });

    expect(zoomInfo.zoomInfoContactAccuracyScore).toBe(95);
  });

  it('takes LinkedIn out of externalUrls', () => {
    const { standard } = mapContact({
      externalUrls: [
        { type: 'BLOG', url: 'https://example.com/blog' },
        { type: 'LINKED_IN', url: 'https://www.linkedin.com/in/ada' },
      ],
    });

    expect(standard.linkedinLink).toMatchObject({
      primaryLinkUrl: 'linkedin.com/in/ada',
    });
  });

  it('stringifies the numeric company id', () => {
    const { zoomInfo } = mapContact({ company: { id: 346572700 } });

    expect(zoomInfo.zoomInfoCompanyId).toBe('346572700');
  });
});
