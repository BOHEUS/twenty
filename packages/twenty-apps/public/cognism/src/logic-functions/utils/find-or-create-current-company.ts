import { isNonEmptyString } from '@sniptt/guards';
import { type CoreApiClient } from 'twenty-client-sdk/core';

import { CognismOperationError } from 'src/logic-functions/errors/cognism-operation-error';
import { buildCompanyCreateData } from 'src/logic-functions/utils/build-company-create-data';
import { buildCompanyMatchKeys } from 'src/logic-functions/utils/build-company-match-keys';
import { findCompanyId } from 'src/logic-functions/utils/find-company-id';
import { type CompanyIdByMatchKeyCache } from 'src/logic-functions/types/company-id-by-match-key-cache';
import { type CompanyMatchKeys } from 'src/logic-functions/types/company-match-keys';
import { type CognismPersonData } from 'src/logic-functions/types/cognism-person-data';
import { isDefined } from 'src/logic-functions/data/is-defined';
import { isUniqueViolationError } from 'src/logic-functions/data/is-unique-violation-error';

type CreateCompanyResult = { createCompany?: { id?: string } };

const findOrCreateUncachedCompany = async ({
  client,
  companyMatchKeys,
}: {
  client: CoreApiClient;
  companyMatchKeys: CompanyMatchKeys;
}): Promise<string | undefined> => {
  const existingCompanyId = await findCompanyId({
    client,
    matchKeys: companyMatchKeys,
  });
  if (isDefined(existingCompanyId)) {
    return existingCompanyId;
  }

  const canCreateNewCompany =
    isNonEmptyString(companyMatchKeys.name) ||
    isNonEmptyString(companyMatchKeys.website);

  if (!canCreateNewCompany) {
    return undefined;
  }

  try {
    const createCompanyResult = (await client.mutation({
      createCompany: {
        __args: { data: buildCompanyCreateData(companyMatchKeys) },
        id: true,
      },
    })) as CreateCompanyResult;

    const createdCompanyId = createCompanyResult.createCompany?.id;

    if (!isDefined(createdCompanyId)) {
      throw new CognismOperationError(
        'Failed to create company: no id returned.',
      );
    }

    return createdCompanyId;
  } catch (createCompanyError) {
    if (!isUniqueViolationError(createCompanyError)) {
      throw createCompanyError;
    }

    const raceWinnerCompanyId = await findCompanyId({
      client,
      matchKeys: companyMatchKeys,
    });
    if (isDefined(raceWinnerCompanyId)) {
      return raceWinnerCompanyId;
    }

    throw createCompanyError;
  }
};

export const findOrCreateCurrentCompany = async ({
  client,
  personData,
  companyIdByMatchKeyCache,
}: {
  client: CoreApiClient;
  personData: CognismPersonData;
  companyIdByMatchKeyCache: CompanyIdByMatchKeyCache;
}): Promise<string | undefined> => {
  const companyMatchKeys = buildCompanyMatchKeys(personData);

  const hasAnyCompanyMatchKey =
    isNonEmptyString(companyMatchKeys.cognismId) ||
    isNonEmptyString(companyMatchKeys.website) ||
    isNonEmptyString(companyMatchKeys.linkedinUrl) ||
    isNonEmptyString(companyMatchKeys.name);

  if (!hasAnyCompanyMatchKey) {
    return undefined;
  }

  const companyMatchKeyCacheKey = JSON.stringify(companyMatchKeys);
  if (companyIdByMatchKeyCache.has(companyMatchKeyCacheKey)) {
    return companyIdByMatchKeyCache.get(companyMatchKeyCacheKey);
  }

  const resolvedCompanyId = await findOrCreateUncachedCompany({
    client,
    companyMatchKeys,
  });

  companyIdByMatchKeyCache.set(companyMatchKeyCacheKey, resolvedCompanyId);

  return resolvedCompanyId;
};
