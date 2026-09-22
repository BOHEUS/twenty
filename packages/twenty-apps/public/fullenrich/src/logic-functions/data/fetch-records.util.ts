import { CoreApiClient } from 'twenty-client-sdk/core';

import { chunk } from 'src/logic-functions/utils/chunk.util';
import { type TwentyCompany, type TwentyPerson } from 'src/logic-functions/types/twenty.types';

const QUERY_PAGE_SIZE = 200;

const ADDRESS_SELECTION = {
  addressStreet1: true,
  addressStreet2: true,
  addressCity: true,
  addressState: true,
  addressPostcode: true,
  addressCountry: true,
};

const PERSON_SELECTION = {
  id: true,
  name: { firstName: true, lastName: true },
  emails: { primaryEmail: true, additionalEmails: true },
  linkedinLink: { primaryLinkLabel: true, primaryLinkUrl: true },
  jobTitle: true,
  phones: {
    primaryPhoneNumber: true,
    primaryPhoneCallingCode: true,
    primaryPhoneCountryCode: true,
    additionalPhones: true,
  },
  companyId: true,
  fullEnrichHeadline: true,
  fullEnrichAbout: true,
  fullEnrichLocation: ADDRESS_SELECTION,
  fullEnrichSkills: true,
  fullEnrichLanguages: true,
  fullEnrichEducations: true,
  fullEnrichSeniority: true,
  fullEnrichJobFunction: true,
  fullEnrichJobSubFunction: true,
  fullEnrichEmploymentHistory: true,
  fullEnrichCurrentRoleStartedAt: true,
  fullEnrichLinkedinConnectionCount: true,
  fullEnrichPersonId: true,
  fullEnrichEnrichedAt: true,
};

const COMPANY_SELECTION = {
  id: true,
  name: true,
  domainName: { primaryLinkLabel: true, primaryLinkUrl: true },
  linkedinLink: { primaryLinkLabel: true, primaryLinkUrl: true },
  address: ADDRESS_SELECTION,
  fullEnrichDescription: true,
  fullEnrichYearFounded: true,
  fullEnrichHeadcount: true,
  fullEnrichHeadcountRange: true,
  fullEnrichCompanyType: true,
  fullEnrichIndustry: true,
  fullEnrichSpecialties: true,
  fullEnrichLogo: { primaryLinkLabel: true, primaryLinkUrl: true },
  fullEnrichOfficeLocations: true,
  fullEnrichLinkedinFollowerCount: true,
  fullEnrichCompanyId: true,
  fullEnrichEnrichedAt: true,
};

const fetchRecordsByIds = async <TRecord>(
  objectNamePlural: 'people' | 'companies',
  selection: object,
  recordIds: string[],
): Promise<TRecord[]> => {
  const uniqueRecordIds = [...new Set(recordIds)];
  if (uniqueRecordIds.length === 0) {
    return [];
  }

  const client = new CoreApiClient();
  const records: TRecord[] = [];

  for (const recordIdsPage of chunk({
    items: uniqueRecordIds,
    size: QUERY_PAGE_SIZE,
  })) {
    const result = await client.query({
      [objectNamePlural]: {
        __args: {
          filter: { id: { in: recordIdsPage } },
          first: recordIdsPage.length,
        },
        edges: { node: selection },
      },
    });

    const edges = result?.[objectNamePlural]?.edges;
    if (!edges) {
      throw new Error(
        `Failed to fetch ${objectNamePlural}: no result for ${recordIdsPage.length} record(s)`,
      );
    }

    records.push(...edges.map((edge: { node: TRecord }) => edge.node));
  }

  return records;
};

export const fetchTwentyPeople = (
  recordIds: string[],
): Promise<TwentyPerson[]> =>
  fetchRecordsByIds<TwentyPerson>('people', PERSON_SELECTION, recordIds);

export const fetchTwentyCompanies = (
  recordIds: string[],
): Promise<TwentyCompany[]> =>
  fetchRecordsByIds<TwentyCompany>('companies', COMPANY_SELECTION, recordIds);

// Deleted or inaccessible ids are simply absent from the response, so callers
// that need a specific record must handle the undefined case
export const fetchTwentyCompany = async (
  recordId: string,
): Promise<TwentyCompany | undefined> =>
  (await fetchTwentyCompanies([recordId]))[0];
