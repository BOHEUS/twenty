import { type CoreApiClient } from 'twenty-client-sdk/core';

import { findOrCreateCurrentCompany } from 'src/logic-functions/utils/find-or-create-current-company';
import { isEmptyEmails } from 'src/logic-functions/utils/is-empty-emails';
import { isEmptyFullName } from 'src/logic-functions/utils/is-empty-full-name';
import { isEmptyLinks } from 'src/logic-functions/utils/is-empty-links';
import { isEmptyPhones } from 'src/logic-functions/utils/is-empty-phones';
import { isEmptyText } from 'src/logic-functions/utils/is-empty-text';
import { mapPerson } from 'src/logic-functions/utils/map-person';
import { pickWritableStandard } from 'src/logic-functions/utils/pick-writable-standard';
import { type CompanyIdByMatchKeyCache } from 'src/types/company-id-by-match-key-cache';
import { type PersonNode } from 'src/types/person-node';
import { type RocketReachPersonData } from 'src/types/rocketreach-person-data';
import { isDefined } from 'src/logic-functions/utils/is-defined';
import { pruneUndefined } from 'src/logic-functions/utils/prune-undefined';

const PERSON_EMPTY_CHECKS = {
  name: isEmptyFullName,
  emails: isEmptyEmails,
  phones: isEmptyPhones,
  jobTitle: isEmptyText,
  linkedinLink: isEmptyLinks,
};

export const buildPersonMatchedData = async ({
  client,
  node,
  data,
  isPending,
  enrichedAt,
  companyIdByMatchKeyCache,
  overrideExistingValues,
  shouldPersist,
}: {
  client: CoreApiClient;
  node: PersonNode;
  data: RocketReachPersonData;
  isPending: boolean;
  enrichedAt: string;
  companyIdByMatchKeyCache: CompanyIdByMatchKeyCache;
  overrideExistingValues: boolean;
  shouldPersist: boolean;
}): Promise<{
  mappedData: Record<string, unknown>;
  persistData: Record<string, unknown>;
}> => {
  const mapped = mapPerson(data);
  const mappedData = pruneUndefined({
    ...mapped.standard,
    ...mapped.rocketReach,
  });

  if (!shouldPersist) {
    return { mappedData, persistData: {} };
  }

  const writableStandard = pickWritableStandard({
    standard: mapped.standard,
    current: node as unknown as Record<string, unknown>,
    emptyChecks: PERSON_EMPTY_CHECKS,
    overrideExistingValues,
  });

  const currentCompanyId = isDefined(node.company?.id)
    ? undefined
    : await findOrCreateCurrentCompany({
        client,
        personData: data,
        companyIdByMatchKeyCache,
      });

  const persistData = pruneUndefined({
    ...writableStandard,
    ...mapped.rocketReach,
    companyId: currentCompanyId,
    rocketReachRawPayload: data,
    rocketReachLastEnrichedAt: enrichedAt,
    rocketReachEnrichmentStatus: isPending ? 'PENDING' : 'MATCHED',
  });

  return { mappedData, persistData };
};
