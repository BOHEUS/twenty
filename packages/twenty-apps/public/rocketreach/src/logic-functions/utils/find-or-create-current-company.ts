import { isNonEmptyString } from '@sniptt/guards';
import { type CoreApiClient } from 'twenty-client-sdk/core';

import { RocketReachOperationError } from 'src/logic-functions/errors/rocketreach-operation-error';
import { buildCompanyCreateData } from 'src/logic-functions/utils/build-company-create-data';
import { buildCompanyMatchKeys } from 'src/logic-functions/utils/build-company-match-keys';
import { findCompanyId } from 'src/logic-functions/utils/find-company-id';
import { type CompanyIdByMatchKeyCache } from 'src/types/company-id-by-match-key-cache';
import { type CompanyMatchKeys } from 'src/types/company-match-keys';
import { type RocketReachPersonData } from 'src/types/rocketreach-person-data';
import { isDefined } from 'src/logic-functions/utils/is-defined';
import { isUniqueViolationError } from 'src/logic-functions/utils/is-unique-violation-error';

type CreateCompanyResult = { createCompany?: { id?: string } };

const findOrCreateUncachedCompany = async ({
  client,
  personData,
  companyMatchKeys,
}: {
  client: CoreApiClient;
  personData: RocketReachPersonData;
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
    isNonEmptyString(companyMatchKeys.domain);

  if (!canCreateNewCompany) {
    return undefined;
  }

  try {
    const createCompanyResult = (await client.mutation({
      createCompany: {
        __args: { data: buildCompanyCreateData(personData) },
        id: true,
      },
    })) as CreateCompanyResult;

    const createdCompanyId = createCompanyResult.createCompany?.id;

    if (!isDefined(createdCompanyId)) {
      throw new RocketReachOperationError(
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
  personData: RocketReachPersonData;
  companyIdByMatchKeyCache: CompanyIdByMatchKeyCache;
}): Promise<string | undefined> => {
  const companyMatchKeys = buildCompanyMatchKeys(personData);

  if (Object.keys(companyMatchKeys).length === 0) {
    return undefined;
  }

  const companyMatchKeyCacheKey = JSON.stringify(companyMatchKeys);
  if (companyIdByMatchKeyCache.has(companyMatchKeyCacheKey)) {
    return companyIdByMatchKeyCache.get(companyMatchKeyCacheKey);
  }

  const resolvedCompanyId = await findOrCreateUncachedCompany({
    client,
    personData,
    companyMatchKeys,
  });

  companyIdByMatchKeyCache.set(companyMatchKeyCacheKey, resolvedCompanyId);

  return resolvedCompanyId;
};
