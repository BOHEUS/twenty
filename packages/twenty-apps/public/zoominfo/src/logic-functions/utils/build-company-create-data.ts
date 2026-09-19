import { buildLinks } from 'src/logic-functions/utils/build-links';
import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { pickLinkedinUrl } from 'src/logic-functions/utils/pick-linkedin-url';
import { toIdentifierText } from 'src/logic-functions/utils/to-identifier-text';
import { toNumberLike } from 'src/logic-functions/utils/to-number-like';
import { toStringArray } from 'src/logic-functions/utils/to-string-array';
import { toText } from 'src/logic-functions/utils/to-text';
import { type ZoomInfoContactCompany } from 'src/types/zoominfo-contact-data';
import { pruneUndefined } from 'src/utils/prune-undefined';

export const buildCompanyCreateData = (
  company: ZoomInfoContactCompany,
): Record<string, unknown> =>
  pruneUndefined<unknown>({
    name: toText(company.name),
    domainName: buildLinks({ url: normalizeDomain(company.website) }),
    linkedinLink: buildLinks({ url: pickLinkedinUrl(company.socialMediaUrls) }),
    zoomInfoCompanyId: toIdentifierText(company.id),
    zoomInfoEmployeeCount: toNumberLike(company.employeeCount),
    zoomInfoIndustries: toStringArray(company.industries),
  });
