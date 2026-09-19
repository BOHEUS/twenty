import { isNonEmptyArray } from '@sniptt/guards';
import { type CoreApiClient } from 'twenty-client-sdk/core';

import { buildCompanyMatchKeys } from 'src/logic-functions/utils/build-company-match-keys';
import { hasAnyCompanyMatchKey } from 'src/logic-functions/utils/has-any-company-match-key';
import { readCompaniesByMatchKeys } from 'src/logic-functions/utils/read-companies-by-match-keys';
import {
  buildCompanyLookupIndex,
  resolveCompanyIdFromLookup,
} from 'src/logic-functions/utils/resolve-company-id-from-lookup';
import { type CompanyIdByMatchKeyCache } from 'src/types/company-id-by-match-key-cache';
import { type ZoomInfoContactCompany } from 'src/types/zoominfo-contact-data';
import { isDefined } from 'twenty-sdk/utils';

// Resolves a whole chunk's employers in one query. Companies that are still
// missing are left uncached so the per-record path can create them.
export const preloadCompanyIdsByMatchKey = async ({
  client,
  companies,
  companyIdByMatchKeyCache,
}: {
  client: CoreApiClient;
  companies: ZoomInfoContactCompany[];
  companyIdByMatchKeyCache: CompanyIdByMatchKeyCache;
}): Promise<void> => {
  const matchKeysList = companies
    .map(buildCompanyMatchKeys)
    .filter(
      (matchKeys) =>
        hasAnyCompanyMatchKey(matchKeys) &&
        !companyIdByMatchKeyCache.has(JSON.stringify(matchKeys)),
    );

  if (!isNonEmptyArray(matchKeysList)) {
    return;
  }

  const index = buildCompanyLookupIndex(
    await readCompaniesByMatchKeys({ client, matchKeysList }),
  );

  for (const matchKeys of matchKeysList) {
    const companyId = resolveCompanyIdFromLookup({ matchKeys, index });

    if (isDefined(companyId)) {
      companyIdByMatchKeyCache.set(JSON.stringify(matchKeys), companyId);
    }
  }
};
