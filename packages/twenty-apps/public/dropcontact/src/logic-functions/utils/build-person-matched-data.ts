import { type CoreApiClient } from 'twenty-client-sdk/core';

import { findOrCreateCurrentCompany } from 'src/logic-functions/utils/find-or-create-current-company';
import { isEmptyEmails } from 'src/logic-functions/utils/is-empty-emails';
import { isEmptyFullName } from 'src/logic-functions/utils/is-empty-full-name';
import { isEmptyLinks } from 'src/logic-functions/utils/is-empty-links';
import { isEmptyPhones } from 'src/logic-functions/utils/is-empty-phones';
import { isEmptyText } from 'src/logic-functions/utils/is-empty-text';
import { mapPerson } from 'src/logic-functions/utils/map-person';
import { pickWritableStandard } from 'src/logic-functions/utils/pick-writable-standard';
import { updateLinkedCompany } from 'src/logic-functions/utils/update-linked-company';
import { type CompanyIdByMatchKeyCache } from 'src/types/company-id-by-match-key-cache';
import { type DropcontactPersonData } from 'src/types/dropcontact-person-data';
import { type PersonNode } from 'src/types/person-node';
import { isDefined } from 'src/utils/is-defined';
import { pruneUndefined } from 'src/utils/prune-undefined';

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
  outcome,
  enrichedAt,
  companyIdByMatchKeyCache,
  overrideExistingValues,
  shouldPersist,
}: {
  client: CoreApiClient;
  node: PersonNode;
  outcome: { data: DropcontactPersonData };
  enrichedAt: string;
  companyIdByMatchKeyCache: CompanyIdByMatchKeyCache;
  overrideExistingValues: boolean;
  shouldPersist: boolean;
}): Promise<{
  mappedData: Record<string, unknown>;
  persistData: Record<string, unknown>;
}> => {
  const mapped = mapPerson(outcome.data);
  const mappedData = pruneUndefined({
    ...mapped.standard,
    ...mapped.dropcontact,
  });

  if (!shouldPersist) {
    return { mappedData, persistData: {} };
  }

  const writableStandard = pickWritableStandard({
    standard: mapped.standard,
    current: node,
    emptyChecks: PERSON_EMPTY_CHECKS,
    overrideExistingValues,
  });

  const existingCompanyId = node.company?.id ?? undefined;
  const linkedCompanyId = isDefined(existingCompanyId)
    ? undefined
    : await findOrCreateCurrentCompany({
        client,
        personData: outcome.data,
        companyIdByMatchKeyCache,
      });
  const companyId = existingCompanyId ?? linkedCompanyId;

  if (isDefined(companyId)) {
    await updateLinkedCompany({
      client,
      companyId,
      personData: outcome.data,
      enrichedAt,
      overrideExistingValues,
    });
  }

  const persistData = pruneUndefined({
    ...writableStandard,
    ...mapped.dropcontact,
    companyId: linkedCompanyId,
    dropcontactRawPayload: outcome.data,
    dropcontactLastEnrichedAt: enrichedAt,
    dropcontactEnrichmentStatus: 'MATCHED',
    dropcontactRequestId: null,
  });

  return { mappedData, persistData };
};
