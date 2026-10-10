import { describe, expect, it } from 'vitest';

import { mapPerson } from 'src/logic-functions/utils/map-person';

describe('mapPerson', () => {
  it('maps the person, leaving numbers flagged as wrong out of the phones', () => {
    const { standard, amplemarket } = mapPerson({
      id: 'person-1',
      first_name: 'jane',
      last_name: 'doe',
      email: 'jane@acme.com',
      title: 'CEO',
      linkedin_url: 'https://www.linkedin.com/in/janedoe',
      headline: 'Building anvils',
      gender: 'female',
      current_position_start_date: '2021-03-01T00:00:00Z',
      location_details: {
        city: 'Austin',
        state: 'Texas',
        country: 'United States',
        lat: 30.27,
        long: -97.74,
      },
      phone_numbers: [
        { number: '+15125550199', type: 'office', is_wrong_number: true },
        { number: '+15125550100', type: 'mobile', is_wrong_number: false },
      ],
      experiences: [{ title: 'CEO', company_name: 'Acme' }],
    });

    expect(standard).toMatchObject({
      name: { firstName: 'Jane', lastName: 'Doe' },
      emails: { primaryEmail: 'jane@acme.com' },
      phones: { primaryPhoneNumber: '+15125550100', additionalPhones: null },
      jobTitle: 'CEO',
      linkedinLink: { primaryLinkUrl: 'https://www.linkedin.com/in/janedoe' },
    });
    expect(amplemarket).toMatchObject({
      amplemarketId: 'person-1',
      amplemarketHeadline: 'Building anvils',
      amplemarketGender: 'female',
      amplemarketJobStartDate: '2021-03-01',
      amplemarketLocation: {
        addressCity: 'Austin',
        addressState: 'Texas',
        addressCountry: 'United States',
      },
      amplemarketExperiences: [{ title: 'CEO', company_name: 'Acme' }],
    });
  });
});
