import { COMPANY_ENRICH_FIELDS } from 'src/constants/company-enrich-fields';
import { CRUSTDATA_COMPANY_ENRICH_PATH } from 'src/constants/crustdata-api';
import { dedupeIdentifiers } from 'src/logic-functions/utils/dedupe-identifiers';
import { enrichIdentifiers } from 'src/logic-functions/utils/enrich-identifiers';
import { type CompanyEnrichParams } from 'src/types/company-enrich-params';
import { type CrustdataCompanyData } from 'src/types/crustdata-company-data';
import { type CrustdataEnrichResult } from 'src/types/crustdata-enrich-result';

export type CompanyEnrichBatchResult = {
  results: CrustdataEnrichResult<CrustdataCompanyData>[];
  creditsUsed: number;
};

type IdentifierType = CompanyEnrichParams['identifierType'];

const MISSING_RESULT: CrustdataEnrichResult<CrustdataCompanyData> = {
  outcome: 'error',
  httpStatus: 0,
  message: 'Crustdata returned no result for this company.',
};

const groupByIdentifierType = (
  params: CompanyEnrichParams[],
): Map<IdentifierType, string[]> => {
  const identifiersByType = new Map<IdentifierType, string[]>();

  for (const entry of params) {
    const identifiers = identifiersByType.get(entry.identifierType) ?? [];

    identifiers.push(entry.identifier);
    identifiersByType.set(entry.identifierType, identifiers);
  }

  return new Map(
    Array.from(identifiersByType, ([identifierType, identifiers]) => [
      identifierType,
      dedupeIdentifiers(identifiers),
    ]),
  );
};

const toIdentifierValues = ({
  identifierType,
  identifiers,
}: {
  identifierType: IdentifierType;
  identifiers: string[];
}): unknown[] =>
  identifierType === 'crustdata_company_ids'
    ? identifiers.map((identifier) => Number.parseInt(identifier, 10))
    : identifiers;

// Company enrich takes exactly one identifier type per request, so a mixed batch becomes one
// request per type. They are independent, so they go out together.
export const enrichCompanies = async (
  params: CompanyEnrichParams[],
): Promise<CompanyEnrichBatchResult> => {
  const batches = await Promise.all(
    Array.from(groupByIdentifierType(params), async ([identifierType, identifiers]) => {
      return {
        identifierType,
        batch: await enrichIdentifiers<CrustdataCompanyData>({
          path: CRUSTDATA_COMPANY_ENRICH_PATH,
          body: {
            [identifierType]: toIdentifierValues({ identifierType, identifiers }),
            fields: [...COMPANY_ENRICH_FIELDS],
          },
          identifiers,
          dataKey: 'company_data',
        }),
      };
    }),
  );

  const resultByTypeAndIdentifier = new Map<
    string,
    CrustdataEnrichResult<CrustdataCompanyData>
  >();
  let creditsUsed = 0;

  for (const { identifierType, batch } of batches) {
    creditsUsed += batch.creditsUsed;

    for (const [identifier, result] of batch.resultByIdentifier) {
      resultByTypeAndIdentifier.set(`${identifierType}:${identifier}`, result);
    }
  }

  const results = params.map(
    (entry) =>
      resultByTypeAndIdentifier.get(
        `${entry.identifierType}:${entry.identifier.toLowerCase()}`,
      ) ?? MISSING_RESULT,
  );

  return { results, creditsUsed };
};
