import { CoreApiClient } from 'twenty-client-sdk/core';
import { twentyCompany, twentyPerson } from 'src/logic-functions/shared/types';
import { chunk } from 'src/logic-functions/utils/chunk.util';

// Matches QUERY_MAX_RECORDS on the server: a single page cannot return more
const QUERY_PAGE_SIZE = 200;

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
  headline: true,
  about: true,
  location: {
    addressStreet1: true,
    addressStreet2: true,
    addressCity: true,
    addressState: true,
    addressCountry: true,
    addressZipCode: true,
  },
  skills: true,
  languages: true,
  educations: true,
  seniority: true,
  jobFunction: true,
  jobSubFunction: true,
  employmentHistory: true,
  currentRoleStartedAt: true,
  linkedinConnectionCount: true,
  fullEnrichPersonId: true,
  enrichedAt: true,
};

const COMPANY_SELECTION = {
  id: true,
  name: true,
  domainName: { primaryLinkLabel: true, primaryLinkUrl: true },
  linkedinLink: { primaryLinkLabel: true, primaryLinkUrl: true },
  address: {
    addressStreet1: true,
    addressStreet2: true,
    addressCity: true,
    addressState: true,
    addressCountry: true,
    addressZipCode: true,
  },
  description: true,
  yearFounded: true,
  headcount: true,
  headcountRange: true,
  companyType: true,
  industry: true,
  specialties: true,
  logo: { primaryLinkLabel: true, primaryLinkUrl: true },
  officeLocations: true,
  linkedinFollowerCount: true,
  fullEnrichCompanyId: true,
  enrichedAt: true,
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
): Promise<twentyPerson[]> =>
  fetchRecordsByIds<twentyPerson>('people', PERSON_SELECTION, recordIds);

export const fetchTwentyCompanies = (
  recordIds: string[],
): Promise<twentyCompany[]> =>
  fetchRecordsByIds<twentyCompany>('companies', COMPANY_SELECTION, recordIds);

// Deleted or inaccessible ids are simply absent from the response, so callers
// that need a specific record must handle the undefined case
export const fetchTwentyPerson = async (
  recordId: string,
): Promise<twentyPerson | undefined> =>
  (await fetchTwentyPeople([recordId]))[0];

export const fetchTwentyCompany = async (
  recordId: string,
): Promise<twentyCompany | undefined> =>
  (await fetchTwentyCompanies([recordId]))[0];
