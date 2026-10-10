import { describe, expect, it } from 'vitest';

import { mapPerson } from 'src/logic-functions/utils/map-person';

describe('mapPerson', () => {
  it('maps standard fields, mobile phone first', () => {
    const { standard } = mapPerson({
      first_name: 'jane',
      last_name: 'doe',
      email: [
        { email: 'jane.doe@acme.com', qualification: 'nominative@pro' },
        { email: 'jane@gmail.com', qualification: 'nominative@perso' },
      ],
      phone: '+33 1 23 45 67 89',
      mobile_phone: '+33 6 12 34 56 78',
      job: 'Head of Sales',
      linkedin: 'https://www.linkedin.com/in/janedoe',
    });

    expect(standard).toMatchObject({
      name: { firstName: 'Jane', lastName: 'Doe' },
      emails: {
        primaryEmail: 'jane.doe@acme.com',
        additionalEmails: ['jane@gmail.com'],
      },
      phones: { primaryPhoneNumber: '+33 6 12 34 56 78' },
      jobTitle: 'Head of Sales',
      linkedinLink: { primaryLinkUrl: 'https://www.linkedin.com/in/janedoe' },
    });
  });

  it('does not write an email Dropcontact qualified as invalid', () => {
    const { standard, dropcontact } = mapPerson({
      email: [{ email: 'old@acme.com', qualification: 'invalid@pro' }],
    });

    expect(standard.emails).toBeUndefined();
    expect(dropcontact.dropcontactEmailQualification).toBe('invalid@pro');
  });

  it('maps the Dropcontact-only person fields', () => {
    expect(
      mapPerson({
        civility: 'Mrs',
        job_level: 'Senior',
        job_function: 'Sales',
        country: 'FR',
      }).dropcontact,
    ).toEqual({
      dropcontactCivility: 'Mrs',
      dropcontactJobLevel: 'Senior',
      dropcontactJobFunction: 'Sales',
      dropcontactCountry: 'FR',
    });
  });
});
