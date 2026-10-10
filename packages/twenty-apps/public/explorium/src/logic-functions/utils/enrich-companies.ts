import { enrichExploriumEntities } from 'src/logic-functions/utils/enrich-explorium-entities';
import { matchExploriumEntities } from 'src/logic-functions/utils/match-explorium-entities';
import { resolveExploriumIds } from 'src/logic-functions/utils/resolve-explorium-ids';
import { type ExploriumCompanyData } from 'src/types/explorium-company-data';
import { type ExploriumEnrichResult } from 'src/types/explorium-enrich-result';
import { type ExploriumBusinessMatchInput } from 'src/types/explorium-match-inputs';
import { type ExploriumMatchParams } from 'src/types/explorium-match-params';
import { isDefined } from 'src/utils/is-defined';

const RESOURCE_CONTEXT = 'explorium/company';

export const enrichCompanies = async (
  params: ExploriumMatchParams<ExploriumBusinessMatchInput>[],
): Promise<ExploriumEnrichResult<ExploriumCompanyData>[]> => {
  const matchResults = await resolveExploriumIds({
    params,
    match: (matchInputs) =>
      matchExploriumEntities({
        path: '/businesses/match',
        inputsKey: 'businesses_to_match',
        matchesKey: 'matched_businesses',
        idKey: 'business_id',
        inputs: matchInputs,
        resourceContext: RESOURCE_CONTEXT,
      }),
  });

  const businessIds = Array.from(
    new Set(
      matchResults.flatMap((matchResult) =>
        matchResult.outcome === 'matched' ? [matchResult.id] : [],
      ),
    ),
  );

  const firmographics = await enrichExploriumEntities({
    path: '/businesses/firmographics/enrich',
    idsKey: 'business_ids',
    idKey: 'business_id',
    ids: businessIds,
    resourceContext: RESOURCE_CONTEXT,
  });

  return matchResults.map(
    (matchResult): ExploriumEnrichResult<ExploriumCompanyData> => {
      if (matchResult.outcome !== 'matched') {
        return matchResult;
      }

      if (!firmographics.ok) {
        return {
          outcome: 'error',
          httpStatus: firmographics.httpStatus,
          message: firmographics.message,
        };
      }

      const companyData = firmographics.dataById.get(matchResult.id);

      if (!isDefined(companyData)) {
        return { outcome: 'not_found' };
      }

      return {
        outcome: 'matched',
        data: {
          ...companyData,
          business_id: matchResult.id,
        } as ExploriumCompanyData,
      };
    },
  );
};
