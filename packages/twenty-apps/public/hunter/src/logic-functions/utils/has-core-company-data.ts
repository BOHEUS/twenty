import { isNonEmptyArray, isNonEmptyString } from '@sniptt/guards';

import { type HunterCompany } from 'src/types/hunter-company';

// Hunter bills a company enrichment only when it returns the name, a category,
// description or tags, a location or country code, and the company size
export const hasCoreCompanyData = (
  company: HunterCompany | undefined,
): boolean =>
  isNonEmptyString(company?.name) &&
  (isNonEmptyString(company?.category?.industry) ||
    isNonEmptyString(company?.category?.sector) ||
    isNonEmptyString(company?.description) ||
    isNonEmptyArray(company?.tags ?? [])) &&
  (isNonEmptyString(company?.location) ||
    isNonEmptyString(company?.geo?.countryCode)) &&
  isNonEmptyString(company?.metrics?.employees);
