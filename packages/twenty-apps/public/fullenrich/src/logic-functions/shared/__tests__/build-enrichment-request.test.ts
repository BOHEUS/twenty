import { describe, expect, it } from 'vitest';

import { type FullEnrichEnrichField } from 'src/constants/application-variables';
import { buildEnrichmentRequestContact } from 'src/logic-functions/shared/build-enrichment-request';
import { type TwentyCompany, type TwentyPerson } from 'src/logic-functions/types/twenty.types';

const buildPerson = (overrides: Partial<TwentyPerson> = {}): TwentyPerson =>
  ({
    id: '20202020-0000-4000-8000-000000000001',
    name: { firstName: 'John', lastName: 'Snow' },
    linkedinLink: { primaryLinkLabel: '', primaryLinkUrl: '' },
    companyId: null,
    ...overrides,
  }) as TwentyPerson;

const buildCompany = (overrides: Partial<TwentyCompany> = {}): TwentyCompany =>
  ({
    id: '20202020-0000-4000-8000-000000000002',
    name: 'Example Inc',
    domainName: { primaryLinkLabel: '', primaryLinkUrl: 'example.com' },
    ...overrides,
  }) as TwentyCompany;

const ENRICH_FIELDS: FullEnrichEnrichField[] = ['contact.work_emails'];

describe('buildEnrichmentRequestContact', () => {
  it('should send a bare domain when Twenty holds a full URL', () => {
    const contact = buildEnrichmentRequestContact({
      enrichFields: ENRICH_FIELDS,
      person: buildPerson({ companyId: '20202020-0000-4000-8000-000000000002' }),
      company: buildCompany({
        domainName: {
          primaryLinkLabel: '',
          primaryLinkUrl: 'https://www.example.com/about',
        },
      }),
    });

    expect(contact).toMatchObject({
      first_name: 'John',
      last_name: 'Snow',
      domain: 'example.com',
      company_name: 'Example Inc',
    });
  });

  it('should pass the record ids through as custom properties', () => {
    const contact = buildEnrichmentRequestContact({
      enrichFields: ENRICH_FIELDS,
      person: buildPerson({ companyId: '20202020-0000-4000-8000-000000000002' }),
      company: buildCompany(),
    });

    expect(contact?.custom).toEqual({
      personId: '20202020-0000-4000-8000-000000000001',
      companyId: '20202020-0000-4000-8000-000000000002',
    });
  });

  it('should leave the company id out when the person has no company', () => {
    const contact = buildEnrichmentRequestContact({
      enrichFields: ENRICH_FIELDS,
      person: buildPerson({
        linkedinLink: {
          primaryLinkLabel: '',
          primaryLinkUrl: 'https://www.linkedin.com/in/john-snow',
        },
      }),
    });

    expect(contact?.custom).toEqual({
      personId: '20202020-0000-4000-8000-000000000001',
    });
  });

  it('should match on the professional network URL alone', () => {
    const contact = buildEnrichmentRequestContact({
      enrichFields: ENRICH_FIELDS,
      person: buildPerson({
        name: { firstName: '', lastName: '' },
        linkedinLink: {
          primaryLinkLabel: '',
          primaryLinkUrl: 'https://www.linkedin.com/in/john-snow',
        },
      }),
    });

    expect(contact).toMatchObject({
      linkedin_url: 'https://www.linkedin.com/in/john-snow',
    });
    expect(contact).not.toHaveProperty('first_name');
  });

  it('should refuse a person FullEnrich cannot match', () => {
    expect(
      buildEnrichmentRequestContact({
        person: buildPerson(),
        enrichFields: ENRICH_FIELDS,
      }),
    ).toBeUndefined();
    expect(
      buildEnrichmentRequestContact({
        enrichFields: ENRICH_FIELDS,
        person: buildPerson({ name: { firstName: 'John', lastName: '' } }),
        company: buildCompany(),
      }),
    ).toBeUndefined();
  });

  it('should ask only for the enrich fields it was given', () => {
    const contact = buildEnrichmentRequestContact({
      person: buildPerson(),
      company: buildCompany(),
      enrichFields: ['contact.work_emails', 'contact.phones'],
    });

    expect(contact?.enrich_fields).toEqual([
      'contact.work_emails',
      'contact.phones',
    ]);
  });
});
