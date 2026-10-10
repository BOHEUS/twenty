import { isNonEmptyString } from '@sniptt/guards';

import { buildAddress } from 'src/logic-functions/utils/build-address';
import { buildLinks } from 'src/logic-functions/utils/build-links';
import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { normalizeLinkedinUrl } from 'src/logic-functions/utils/normalize-linkedin-url';
import { toNumericValue } from 'src/logic-functions/utils/to-numeric-value';
import { toText } from 'src/logic-functions/utils/to-text';
import { type DropcontactPersonData } from 'src/types/dropcontact-person-data';
import { type MappedRecord } from 'src/types/mapped-record';
import { pruneUndefined } from 'src/utils/prune-undefined';

export const mapCompany = (personData: DropcontactPersonData): MappedRecord => {
  const standard = pruneUndefined({
    domainName: buildLinks({ url: normalizeDomain(personData.website) }),
    linkedinLink: buildLinks({
      url: normalizeLinkedinUrl(personData.company_linkedin),
    }),
    // The SIRET address comes from the French company registry
    address: isNonEmptyString(personData.siret_address)
      ? buildAddress({
          street1: personData.siret_address,
          postcode: personData.siret_zip,
          city: personData.siret_city,
          country: 'France',
        })
      : undefined,
  });

  const dropcontact = pruneUndefined({
    dropcontactIndustry: toText(personData.industry),
    dropcontactEmployeeRange: toText(personData.nb_employees),
    dropcontactEmployeeCount: toNumericValue(personData.employee_count),
    dropcontactSiren: toText(personData.siren),
    dropcontactSiret: toText(personData.siret),
    dropcontactVat: toText(personData.vat),
    dropcontactNafCode: toText(personData.naf5_code),
    dropcontactNafDescription: toText(personData.naf5_des),
    dropcontactTurnover: toNumericValue(personData.company_turnover),
    dropcontactNetIncome: toNumericValue(personData.company_results),
  });

  return { standard, dropcontact };
};
