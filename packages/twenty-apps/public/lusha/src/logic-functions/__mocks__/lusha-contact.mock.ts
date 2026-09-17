import { type LushaRecord } from 'src/logic-functions/types/lusha-record.type';

// Shaped after the search-and-enrich example of the Lusha V3 documentation.
export const LUSHA_CONTACT_MOCK: LushaRecord = {
  clientReferenceId: 'person-1',
  id: '4389064704',
  firstName: 'Orit',
  lastName: 'Shilvock',
  fullName: 'Orit Shilvock',
  jobTitle: {
    title: 'Vice President of Partnerships',
    departments: ['Business Development'],
    seniority: 'Vice President',
  },
  location: {
    country: 'Israel',
    countryIso2: 'IL',
    state: 'Tel Aviv District',
    city: 'Tel Aviv',
    continent: 'Asia',
    coordinates: [34.78057098388672, 32.08087921142578],
    isEuContact: false,
  },
  emails: [
    {
      email: 'orit.private@gmail.com',
      type: 'private',
      confidence: 'B',
      updateDate: '2026-04-20',
    },
    {
      email: 'Orit.Shilvock@lusha.com',
      type: 'work',
      confidence: 'A+',
      updateDate: '2026-04-23',
    },
  ],
  phones: [
    {
      number: '+972 3-555-0100',
      type: 'direct',
      doNotCall: true,
      updateDate: '2026-04-23',
    },
    {
      number: '+972 52-555-0199',
      type: 'mobile',
      doNotCall: false,
      updateDate: '2026-04-23',
    },
  ],
  company: {
    id: '16303253',
    name: 'Lusha',
    domain: 'www.lusha.com',
    industry: 'Technology, Information & Media',
  },
  socialLinks: {
    linkedin: 'https://www.linkedin.com/in/orit-shilvock-6243bb5',
    xUrl: 'https://twitter.com/lushaofficial',
  },
  previousEmployment: [
    {
      company: { name: 'Salesforce', domain: 'salesforce.com' },
      jobTitle: { title: 'Partner Manager', seniority: 'Manager' },
    },
  ],
  updateDate: '2026-04-23',
};
