import { type CoreApiClient } from 'twenty-client-sdk/core';

import { isEmptyAddress } from 'src/logic-functions/utils/is-empty-address';
import { isEmptyLinks } from 'src/logic-functions/utils/is-empty-links';
import { mapCompany } from 'src/logic-functions/utils/map-company';
import { pickWritableStandard } from 'src/logic-functions/utils/pick-writable-standard';
import { readCompanies } from 'src/logic-functions/utils/read-companies';
import { updateCompanyRecord } from 'src/logic-functions/utils/update-company-record';
import { type DropcontactPersonData } from 'src/types/dropcontact-person-data';
import { isDefined } from 'src/utils/is-defined';
import { pruneUndefined } from 'src/utils/prune-undefined';

const COMPANY_EMPTY_CHECKS = {
  domainName: isEmptyLinks,
  linkedinLink: isEmptyLinks,
  address: isEmptyAddress,
};

export const updateLinkedCompany = async ({
  client,
  companyId,
  personData,
  enrichedAt,
  overrideExistingValues,
}: {
  client: CoreApiClient;
  companyId: string;
  personData: DropcontactPersonData;
  enrichedAt: string;
  overrideExistingValues: boolean;
}): Promise<void> => {
  const mapped = mapCompany(personData);

  if (
    Object.keys(mapped.standard).length === 0 &&
    Object.keys(mapped.dropcontact).length === 0
  ) {
    return;
  }

  const [company] = await readCompanies({ client, recordIds: [companyId] });

  if (!isDefined(company)) {
    return;
  }

  await updateCompanyRecord({
    client,
    recordId: companyId,
    data: pruneUndefined({
      ...pickWritableStandard({
        standard: mapped.standard,
        current: company,
        emptyChecks: COMPANY_EMPTY_CHECKS,
        overrideExistingValues,
      }),
      ...mapped.dropcontact,
      dropcontactLastEnrichedAt: enrichedAt,
    }),
  });
};
