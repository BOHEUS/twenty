import { callAmplemarket } from 'src/logic-functions/utils/call-amplemarket';
import { runAmplemarketLookups } from 'src/logic-functions/utils/run-amplemarket-lookups';
import { type AmplemarketCompany } from 'src/types/amplemarket-company';
import { type AmplemarketCompanyMatchParams } from 'src/types/amplemarket-company-match-params';
import { type AmplemarketEnrichResult } from 'src/types/amplemarket-enrich-result';
import { pruneUndefined } from 'src/utils/prune-undefined';

const lookupAmplemarketCompany = async ({
  params,
  deadline,
}: {
  params: AmplemarketCompanyMatchParams;
  deadline: number;
}): Promise<AmplemarketEnrichResult<AmplemarketCompany>> => {
  const response = await callAmplemarket({
    path: '/companies/find',
    query: pruneUndefined({
      domain: params.domain,
      linkedin_url: params.linkedinUrl,
    }),
    deadline,
  });

  if (response.status === 'error') {
    return {
      outcome: 'error',
      httpStatus: response.httpStatus,
      message: response.message,
    };
  }

  // The response body is untyped JSON; fields are read defensively by the mappers
  return response.status === 'found'
    ? { outcome: 'matched', data: response.json as AmplemarketCompany }
    : { outcome: 'not_found' };
};

// Amplemarket lists no credit cost for company enrichment, so nothing is billed
export const enrichCompanies = (
  params: AmplemarketCompanyMatchParams[],
  { deadline }: { deadline: number },
): Promise<AmplemarketEnrichResult<AmplemarketCompany>[]> =>
  runAmplemarketLookups({
    params,
    deadline,
    lookup: (entry) => lookupAmplemarketCompany({ params: entry, deadline }),
  });
