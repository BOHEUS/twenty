import { isNonEmptyString } from '@sniptt/guards';
import { type CoreApiClient } from 'twenty-client-sdk/core';
import { isDefined } from 'twenty-sdk/utils';

import { ZoomInfoOperationError } from 'src/logic-functions/errors/zoominfo-operation-error';
import { buildCompanyCreateData } from 'src/logic-functions/utils/build-company-create-data';
import { buildCompanyMatchKeys } from 'src/logic-functions/utils/build-company-match-keys';
import { findCompanyId } from 'src/logic-functions/utils/find-company-id';
import { type CompanyIdByMatchKeyCache } from 'src/types/company-id-by-match-key-cache';
import { type CompanyMatchKeys } from 'src/types/company-match-keys';
import { type ZoomInfoContactCompany } from 'src/types/zoominfo-contact-data';
import { isUniqueViolationError } from 'src/utils/is-unique-violation-error';

type CreateCompanyResult = { createCompany?: { id?: string } };

const findOrCreateUncachedCompanyOrThrow = async ({
  client,
  company,
  companyMatchKeys,
}: {
  client: CoreApiClient;
  company: ZoomInfoContactCompany;
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
        __args: { data: buildCompanyCreateData(company) },
        id: true,
      },
    })) as CreateCompanyResult;

    const createdCompanyId = createCompanyResult.createCompany?.id;

    if (!isDefined(createdCompanyId)) {
      throw new ZoomInfoOperationError(
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

export const findOrCreateCurrentCompanyOrThrow = async ({
  client,
  company,
  companyIdByMatchKeyCache,
}: {
  client: CoreApiClient;
  company: ZoomInfoContactCompany;
  companyIdByMatchKeyCache: CompanyIdByMatchKeyCache;
}): Promise<string | undefined> => {
  const companyMatchKeys = buildCompanyMatchKeys(company);

  const hasAnyCompanyMatchKey =
    isNonEmptyString(companyMatchKeys.zoomInfoCompanyId) ||
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

  const resolvedCompanyId = await findOrCreateUncachedCompanyOrThrow({
    client,
    company,
    companyMatchKeys,
  });

  companyIdByMatchKeyCache.set(companyMatchKeyCacheKey, resolvedCompanyId);

  return resolvedCompanyId;
};
