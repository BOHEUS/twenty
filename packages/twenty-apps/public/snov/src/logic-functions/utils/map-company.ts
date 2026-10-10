import { buildAddress } from 'src/logic-functions/utils/build-address';
import { buildLinks } from 'src/logic-functions/utils/build-links';
import { buildPhones } from 'src/logic-functions/utils/build-phones';
import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { toFoundedYear } from 'src/logic-functions/utils/to-founded-year';
import { toStringArray } from 'src/logic-functions/utils/to-string-array';
import { toText } from 'src/logic-functions/utils/to-text';
import { type MappedRecord } from 'src/types/mapped-record';
import { type SnovCompanyData } from 'src/types/snov-company-data';
import { pruneUndefined } from 'src/utils/prune-undefined';

export const mapCompany = (companyData: SnovCompanyData): MappedRecord => {
  const standard = pruneUndefined({
    name: toText(companyData.company_name),
    domainName: buildLinks({ url: normalizeDomain(companyData.website) }),
    address: buildAddress({ city: companyData.city }),
  });

  const snov = pruneUndefined({
    snovIndustry: toText(companyData.industry),
    snovSize: toText(companyData.size),
    snovFoundedYear: toFoundedYear(companyData.founded),
    snovPhone: buildPhones([companyData.hq_phone]),
    snovRelatedDomains: toStringArray(companyData.related_domains),
  });

  return { standard, snov };
};
