import { type CoreApiClient } from 'twenty-client-sdk/core';
import { isDefined } from 'twenty-sdk/utils';

import { findOrCreateCurrentCompanyOrThrow } from 'src/logic-functions/utils/find-or-create-current-company-or-throw';
import { isEmptyEmails } from 'src/logic-functions/utils/is-empty-emails';
import { isEmptyFullName } from 'src/logic-functions/utils/is-empty-full-name';
import { isEmptyLinks } from 'src/logic-functions/utils/is-empty-links';
import { isEmptyPhones } from 'src/logic-functions/utils/is-empty-phones';
import { isEmptyText } from 'src/logic-functions/utils/is-empty-text';
import { mapContact } from 'src/logic-functions/utils/map-contact';
import { pickWritableStandard } from 'src/logic-functions/utils/pick-writable-standard';
import { type CompanyIdByMatchKeyCache } from 'src/types/company-id-by-match-key-cache';
import { type PersonNode } from 'src/types/person-node';
import { type ZoomInfoContactData } from 'src/types/zoominfo-contact-data';
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
  outcome: { matchStatus: string; data: ZoomInfoContactData };
  enrichedAt: string;
  companyIdByMatchKeyCache: CompanyIdByMatchKeyCache;
  overrideExistingValues: boolean;
  shouldPersist: boolean;
}): Promise<{
  mappedData: Record<string, unknown>;
  persistData: Record<string, unknown>;
}> => {
  const mapped = mapContact(outcome.data);
  const mappedData = pruneUndefined({ ...mapped.standard, ...mapped.zoomInfo });

  if (!shouldPersist) {
    return { mappedData, persistData: {} };
  }

  const writableStandard = pickWritableStandard({
    standard: mapped.standard,
    current: node,
    emptyChecks: PERSON_EMPTY_CHECKS,
    overrideExistingValues,
  });

  const currentCompanyId =
    isDefined(node.company?.id) || !isDefined(outcome.data.company)
      ? undefined
      : await findOrCreateCurrentCompanyOrThrow({
          client,
          company: outcome.data.company,
          companyIdByMatchKeyCache,
        });

  const persistData = pruneUndefined({
    ...writableStandard,
    ...mapped.zoomInfo,
    companyId: currentCompanyId,
    zoomInfoRawPayload: outcome.data,
    zoomInfoLastEnrichedAt: enrichedAt,
    zoomInfoMatchStatus: outcome.matchStatus,
    zoomInfoEnrichmentStatus: 'MATCHED',
  });

  return { mappedData, persistData };
};
