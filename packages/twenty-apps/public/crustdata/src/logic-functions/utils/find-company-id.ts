import { isNonEmptyString } from '@sniptt/guards';
import { type CoreApiClient } from 'twenty-client-sdk/core';

import { findCompanyIdByFilter } from 'src/logic-functions/utils/find-company-id-by-filter';
import { type CompanyMatchKeys } from 'src/types/company-match-keys';
import { isDefined } from 'src/utils/is-defined';

export const findCompanyId = async ({
  client,
  matchKeys,
}: {
  client: CoreApiClient;
  matchKeys: CompanyMatchKeys;
}): Promise<string | undefined> => {
  if (isNonEmptyString(matchKeys.crustdataId)) {
    const byCrustdataId = await findCompanyIdByFilter({
      client,
      filter: { crustdataCompanyId: { eq: matchKeys.crustdataId } },
    });

    if (isDefined(byCrustdataId)) {
      return byCrustdataId;
    }
  }

  if (isNonEmptyString(matchKeys.website)) {
    const byDomain = await findCompanyIdByFilter({
      client,
      filter: {
        domainName: { primaryLinkUrl: { ilike: `%${matchKeys.website}%` } },
      },
    });

    if (isDefined(byDomain)) {
      return byDomain;
    }
  }

  if (isNonEmptyString(matchKeys.linkedinUrl)) {
    const byLinkedin = await findCompanyIdByFilter({
      client,
      filter: {
        linkedinLink: { primaryLinkUrl: { ilike: `%${matchKeys.linkedinUrl}%` } },
      },
    });

    if (isDefined(byLinkedin)) {
      return byLinkedin;
    }
  }

  if (isNonEmptyString(matchKeys.name)) {
    // A name alone is ambiguous, so only a single hit is trusted.
    return findCompanyIdByFilter({
      client,
      filter: { name: { eq: matchKeys.name } },
      requireUnique: true,
    });
  }

  return undefined;
};
