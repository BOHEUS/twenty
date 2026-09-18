import { type CoreApiClient } from 'twenty-client-sdk/core';

import { buildMatchedData } from 'src/logic-functions/utils/build-matched-data';
import { findOrCreateCurrentCompany } from 'src/logic-functions/utils/find-or-create-current-company';
import { isEmptyComposite } from 'src/logic-functions/utils/is-empty-composite';
import { isEmptyText } from 'src/logic-functions/utils/is-empty-text';
import { mapPerson } from 'src/logic-functions/utils/map-person';
import { type CompanyIdByMatchKeyCache } from 'src/logic-functions/types/company-id-by-match-key-cache';
import { type CognismPersonData } from 'src/logic-functions/types/cognism-person-data';
import { type PersonNode } from 'src/logic-functions/types/person-node';
import { isDefined } from 'src/logic-functions/data/is-defined';

const PERSON_EMPTY_CHECKS = {
  name: isEmptyComposite('firstName', 'lastName'),
  emails: isEmptyComposite('primaryEmail'),
  phones: isEmptyComposite('primaryPhoneNumber'),
  jobTitle: isEmptyText,
  linkedinLink: isEmptyComposite('primaryLinkUrl'),
};

export const buildPersonMatchedData = ({
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
  outcome: { matchScore?: number; data: CognismPersonData };
  enrichedAt: string;
  companyIdByMatchKeyCache: CompanyIdByMatchKeyCache;
  overrideExistingValues: boolean;
  shouldPersist: boolean;
}): Promise<{
  mappedData: Record<string, unknown>;
  persistData: Record<string, unknown>;
}> =>
  buildMatchedData({
    node,
    outcome,
    enrichedAt,
    overrideExistingValues,
    shouldPersist,
    map: mapPerson,
    emptyChecks: PERSON_EMPTY_CHECKS,
    buildExtraPersistData: async () => ({
      companyId: isDefined(node.company?.id)
        ? undefined
        : await findOrCreateCurrentCompany({
            client,
            personData: outcome.data,
            companyIdByMatchKeyCache,
          }),
    }),
  });
