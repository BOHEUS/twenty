import { isNonEmptyString } from '@sniptt/guards';

import { type CompanyMatchKeys } from 'src/types/company-match-keys';

export const hasAnyCompanyMatchKey = (matchKeys: CompanyMatchKeys): boolean =>
  isNonEmptyString(matchKeys.zoomInfoCompanyId) ||
  isNonEmptyString(matchKeys.website) ||
  isNonEmptyString(matchKeys.linkedinUrl) ||
  isNonEmptyString(matchKeys.name);
