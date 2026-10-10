import { type CoreApiClient } from 'twenty-client-sdk/core';

import { EMPLOYER_COMPANY_EMPTY_CHECKS } from 'src/logic-functions/utils/company-empty-checks';
import { mapCompany } from 'src/logic-functions/utils/map-company';
import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { pickWritableStandard } from 'src/logic-functions/utils/pick-writable-standard';
import { readCompanies } from 'src/logic-functions/utils/read-companies';
import { updateCompanyRecord } from 'src/logic-functions/utils/update-company-record';
import { type AmplemarketCompany } from 'src/types/amplemarket-company';
import { isDefined } from 'src/utils/is-defined';
import { pruneUndefined } from 'src/utils/prune-undefined';

export const updateLinkedCompany = async ({
  client,
  companyId,
  company,
  enrichedAt,
  overrideExistingValues,
}: {
  client: CoreApiClient;
  companyId: string;
  company: AmplemarketCompany;
  enrichedAt: string;
  overrideExistingValues: boolean;
}): Promise<void> => {
  const [currentCompany] = await readCompanies({
    client,
    recordIds: [companyId],
  });

  if (!isDefined(currentCompany)) {
    return;
  }

  const currentDomain = normalizeDomain(
    currentCompany.domainName?.primaryLinkUrl,
  );

  // Amplemarket may place the person at a different employer than the company
  // they are linked to; that company's data must not overwrite this one
  if (
    isDefined(currentDomain) &&
    currentDomain !== normalizeDomain(company.website)
  ) {
    return;
  }

  const mapped = mapCompany(company);

  await updateCompanyRecord({
    client,
    recordId: companyId,
    data: pruneUndefined({
      ...pickWritableStandard({
        standard: mapped.standard,
        current: currentCompany,
        emptyChecks: EMPLOYER_COMPANY_EMPTY_CHECKS,
        overrideExistingValues,
      }),
      ...mapped.amplemarket,
      amplemarketLastEnrichedAt: enrichedAt,
    }),
  });
};
