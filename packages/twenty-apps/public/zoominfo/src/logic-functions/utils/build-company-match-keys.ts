import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { pickLinkedinUrl } from 'src/logic-functions/utils/pick-linkedin-url';
import { toIdentifierText } from 'src/logic-functions/utils/to-identifier-text';
import { toText } from 'src/logic-functions/utils/to-text';
import { type CompanyMatchKeys } from 'src/types/company-match-keys';
import { type ZoomInfoContactCompany } from 'src/types/zoominfo-contact-data';
import { pruneUndefined } from 'src/utils/prune-undefined';

export const buildCompanyMatchKeys = (
  company: ZoomInfoContactCompany,
): CompanyMatchKeys =>
  pruneUndefined({
    zoomInfoCompanyId: toIdentifierText(company.id),
    website: normalizeDomain(company.website),
    linkedinUrl: pickLinkedinUrl(company.socialMediaUrls),
    name: toText(company.name),
  });
