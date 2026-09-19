import { type CrustdataPersonData } from 'src/types/crustdata-person-data';

// Shaped after the documented /person/enrich and /person/contact/enrich responses.
export const crustdataPersonDataMock: CrustdataPersonData = {
  crustdata_person_id: 78123,
  updated_at: '2026-08-14T09:12:00Z',
  basic_profile: {
    name: 'Ada Lovelace',
    first_name: 'Ada',
    last_name: 'Lovelace',
    headline: 'Building analytical engines',
    summary: 'Mathematician and writer.',
    current_title: 'Principal Engineer',
    languages: ['English', 'French'],
    profile_picture_permalink: 'https://cdn.crustdata.com/ada.jpg',
    normalized_title: {
      matched_title: 'Principal Software Engineer',
      department: 'Engineering',
      sub_department: 'Software Engineering',
    },
    location: { city: 'London', state: 'England', country: 'United Kingdom' },
  },
  professional_network: {
    pronoun: 'she/her',
    connections: 4312,
    followers: 9021,
  },
  social_handles: {
    professional_network_identifier: {
      profile_url: 'https://www.linkedin.com/in/adalovelace',
    },
    dev_platform_identifier: { profile_url: 'https://github.com/adalovelace' },
    twitter_identifier: { slug: 'adalovelace' },
  },
  experience: {
    employment_details: {
      current: [
        {
          name: 'Analytical Engines',
          title: 'Principal Engineer',
          company_website_domain: 'analyticalengines.com',
          company_professional_network_url:
            'https://www.linkedin.com/company/analytical-engines',
          crustdata_company_id: 9911,
          start_date: '2023-04-01',
        },
      ],
      past: [{ name: 'Difference Engine Co', title: 'Engineer' }],
    },
    years_of_experience: 'More than 10 years',
    years_of_experience_raw: 14,
  },
  education: { schools: [{ school: 'University of London' }] },
  skills: { professional_network_skills: ['Mathematics', 'Algorithms'] },
  certifications: [{ name: 'Certified Engine Operator' }],
  honors: [{ title: 'Pioneer Award' }],
  dev_platform_profiles: [{ profile_url: 'https://github.com/adalovelace' }],
  assessment: { authenticity: { verdict: 'clearly_genuine', tier: 0 } },
  contact: {
    business_emails: [{ email: 'ada@analyticalengines.com', status: 'deliverable' }],
    personal_emails: [{ email: 'ada@example.com', status: 'catch_all' }],
    phone_numbers: ['+442071234567'],
    websites: ['https://ada.example'],
  },
};
