import { CoreApiClient } from 'twenty-client-sdk/core';
import { isDefined } from 'twenty-sdk/utils';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { LUSHA_COMPANY_MOCK } from 'src/logic-functions/__mocks__/lusha-company.mock';
import { LUSHA_CONTACT_MOCK } from 'src/logic-functions/__mocks__/lusha-contact.mock';
import { companyEnrichmentAdapter } from 'src/logic-functions/handlers/company-enrichment-adapter';
import { personEnrichmentAdapter } from 'src/logic-functions/handlers/person-enrichment-adapter';
import {
  buildCompanyLushaData,
  buildCompanyStandardData,
} from 'src/logic-functions/utils/build-company-update-data';
import {
  buildPersonLushaData,
  buildPersonStandardData,
} from 'src/logic-functions/utils/build-person-update-data';
import { findOrCreateCompany } from 'src/logic-functions/utils/find-or-create-company';
import { readCompanies } from 'src/logic-functions/utils/read-companies';
import { readPeople } from 'src/logic-functions/utils/read-people';

// Lusha itself is not called: these tests write what the app maps from Lusha's
// documented responses, to prove the server accepts every value it produces.
const RUN_SUFFIX = Date.now().toString(36);
const TEST_DOMAIN = `lusha-integration-${RUN_SUFFIX}.com`;
const ENRICHED_AT = '2026-09-17T10:00:00.000Z';

const LUSHA_COMPANY = { ...LUSHA_COMPANY_MOCK, domain: `www.${TEST_DOMAIN}` };

const LUSHA_CONTACT = {
  ...LUSHA_CONTACT_MOCK,
  emails: [
    {
      email: `orit.${RUN_SUFFIX}@${TEST_DOMAIN}`,
      type: 'work',
      confidence: 'A+',
    },
    { email: `orit.${RUN_SUFFIX}@gmail.com`, type: 'private', confidence: 'B' },
  ],
  company: { ...(LUSHA_CONTACT_MOCK.company as object), domain: TEST_DOMAIN },
};

describe('Lusha field writes', () => {
  const client = new CoreApiClient();
  const createdIds: {
    companyId?: string;
    personId?: string;
    linkedCompanyId?: string;
  } = {};

  beforeAll(async () => {
    const { createCompany } = await client.mutation({
      createCompany: {
        __args: {
          data: { name: 'Lusha', domainName: { primaryLinkUrl: TEST_DOMAIN } },
        },
        id: true,
      },
    });
    const { createPerson } = await client.mutation({
      createPerson: {
        __args: { data: { name: { firstName: 'Orit', lastName: '' } } },
        id: true,
      },
    });

    createdIds.companyId = createCompany?.id;
    createdIds.personId = createPerson?.id;
  });

  afterAll(async () => {
    if (createdIds.personId) {
      await client.mutation({
        destroyPerson: { __args: { id: createdIds.personId }, id: true },
      });
    }

    const companyIds = new Set(
      [createdIds.companyId, createdIds.linkedCompanyId].filter(isDefined),
    );

    for (const companyId of companyIds) {
      await client.mutation({
        destroyCompany: { __args: { id: companyId }, id: true },
      });
    }
  });

  it('should save everything Lusha returns for a company', async () => {
    const companyId = createdIds.companyId as string;

    await companyEnrichmentAdapter.updateRecord({
      client,
      recordId: companyId,
      data: {
        ...buildCompanyStandardData({
          company: {
            id: companyId,
            name: 'Lusha',
            domainName: { primaryLinkUrl: TEST_DOMAIN },
          },
          lushaCompany: LUSHA_COMPANY,
        }),
        ...buildCompanyLushaData({
          lushaCompany: LUSHA_COMPANY,
          enrichedAt: ENRICHED_AT,
        }),
      },
    });

    const { company } = await client.query({
      company: {
        __args: { filter: { id: { eq: companyId } } },
        domainName: { primaryLinkUrl: true },
        address: { addressCity: true, addressPostcode: true },
        lushaId: true,
        lushaEmployeeCount: true,
        lushaRevenueRange: true,
        lushaTechnologies: true,
        lushaSicCodes: true,
        lushaTotalFunding: { amountMicros: true, currencyCode: true },
        lushaLastFundingDate: true,
        lushaXLink: { primaryLinkUrl: true },
        lushaPhones: {
          primaryPhoneNumber: true,
          primaryPhoneCountryCode: true,
          primaryPhoneCallingCode: true,
          additionalPhones: { number: true, callingCode: true },
        },
        lushaLocation: { addressCity: true, addressPostcode: true },
        lushaEnrichmentStatus: true,
        lushaLastEnrichedAt: true,
        lushaRawPayload: true,
      },
    });

    expect(company).toMatchObject({
      domainName: { primaryLinkUrl: TEST_DOMAIN },
      address: { addressCity: 'Boston', addressPostcode: '02199' },
      lushaId: '16303253',
      lushaEmployeeCount: 364,
      lushaRevenueRange: '$10M-$50M',
      lushaTechnologies: ['amazon', 'google analytics'],
      lushaSicCodes: ['7371 - Custom computer programming services'],
      lushaTotalFunding: { currencyCode: 'USD' },
      lushaLastFundingDate: '2021-11-10',
      lushaXLink: { primaryLinkUrl: 'https://x.com/lusha' },
      lushaPhones: {
        primaryPhoneNumber: '6175550142',
        primaryPhoneCountryCode: 'US',
        primaryPhoneCallingCode: '+1',
      },
      lushaLocation: { addressCity: 'Boston', addressPostcode: '02199' },
      lushaEnrichmentStatus: 'ENRICHED',
      lushaRawPayload: expect.objectContaining({ id: '16303253' }),
    });
    expect(Number(company?.lushaTotalFunding?.amountMicros)).toBe(
      245_000_000_000_000,
    );
    expect(company?.lushaPhones?.additionalPhones).toEqual([
      expect.objectContaining({ number: '8004207332', callingCode: '+1' }),
    ]);
    expect(new Date(company?.lushaLastEnrichedAt ?? '').toISOString()).toBe(
      ENRICHED_AT,
    );

    const [storedCompany] = await readCompanies({
      client,
      recordIds: [companyId],
    });

    expect(storedCompany).toMatchObject({
      lushaId: '16303253',
      domainName: { primaryLinkUrl: TEST_DOMAIN },
      address: { addressCity: 'Boston' },
    });
    expect(
      buildCompanyStandardData({
        company: storedCompany,
        lushaCompany: LUSHA_COMPANY,
      }),
    ).toEqual({});
  });

  it('should save everything Lusha returns for a person and link its company', async () => {
    const personId = createdIds.personId as string;
    const companyId = await findOrCreateCompany({
      client,
      contact: LUSHA_CONTACT,
      companyIdByDomain: new Map(),
    });

    createdIds.linkedCompanyId = companyId;

    expect(companyId).toBe(createdIds.companyId);

    await personEnrichmentAdapter.updateRecord({
      client,
      recordId: personId,
      data: {
        ...buildPersonStandardData({
          person: { id: personId, name: { firstName: 'Orit', lastName: '' } },
          contact: LUSHA_CONTACT,
        }),
        companyId,
        ...buildPersonLushaData({
          contact: LUSHA_CONTACT,
          enrichedAt: ENRICHED_AT,
        }),
      },
    });

    const { person } = await client.query({
      person: {
        __args: { filter: { id: { eq: personId } } },
        name: { firstName: true, lastName: true },
        jobTitle: true,
        emails: { primaryEmail: true, additionalEmails: true },
        phones: {
          primaryPhoneNumber: true,
          primaryPhoneCallingCode: true,
          additionalPhones: { number: true, callingCode: true },
        },
        linkedinLink: { primaryLinkUrl: true },
        company: { id: true },
        lushaSeniority: true,
        lushaDepartments: true,
        lushaLocation: {
          addressCity: true,
          addressLat: true,
          addressLng: true,
        },
        lushaEmailConfidence: true,
        lushaDoNotCall: true,
        lushaIsEuContact: true,
        lushaDataUpdatedAt: true,
        lushaPreviousEmployment: true,
        lushaEnrichmentStatus: true,
      },
    });

    expect(person).toMatchObject({
      name: { firstName: 'Orit', lastName: 'Shilvock' },
      jobTitle: 'Vice President of Partnerships',
      emails: {
        primaryEmail: `orit.${RUN_SUFFIX}@${TEST_DOMAIN}`,
        additionalEmails: [`orit.${RUN_SUFFIX}@gmail.com`],
      },
      phones: {
        primaryPhoneNumber: '525550199',
        primaryPhoneCallingCode: '+972',
      },
      linkedinLink: {
        primaryLinkUrl: 'https://www.linkedin.com/in/orit-shilvock-6243bb5',
      },
      company: { id: createdIds.companyId },
      lushaSeniority: 'VICE_PRESIDENT',
      lushaDepartments: ['Business Development'],
      lushaLocation: { addressCity: 'Tel Aviv' },
      lushaEmailConfidence: 'A+',
      lushaDoNotCall: true,
      lushaIsEuContact: false,
      lushaDataUpdatedAt: '2026-04-23',
      lushaEnrichmentStatus: 'ENRICHED',
    });
    expect(person?.lushaLocation?.addressLat).toBeCloseTo(32.0808, 3);
    expect(person?.phones?.additionalPhones).toHaveLength(1);

    const [storedPerson] = await readPeople({
      client,
      recordIds: [personId],
    });

    expect(storedPerson).toMatchObject({
      lushaId: '4389064704',
      emails: { additionalEmails: [`orit.${RUN_SUFFIX}@gmail.com`] },
      phones: {
        primaryPhoneCallingCode: '+972',
        additionalPhones: [expect.objectContaining({ callingCode: '+972' })],
      },
      company: { domainName: { primaryLinkUrl: TEST_DOMAIN } },
    });
    expect(
      buildPersonStandardData({
        person: storedPerson,
        contact: LUSHA_CONTACT,
      }),
    ).toEqual({});
  });
});
