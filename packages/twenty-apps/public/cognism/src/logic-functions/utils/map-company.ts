import { isArray } from '@sniptt/guards';

import { COMPANY_TYPE_OPTIONS } from 'src/constants/company-type-options';
import { buildAddress } from 'src/logic-functions/utils/build-address';
import { buildAllowedValues } from 'src/logic-functions/utils/build-allowed-values';
import { buildCurrencyFromUsd } from 'src/logic-functions/utils/build-currency-from-usd';
import { buildLinks } from 'src/logic-functions/utils/build-links';
import { buildPhones } from 'src/logic-functions/utils/build-phones';
import { buildSizeRange } from 'src/logic-functions/utils/build-size-range';
import { normalizeDomain } from 'src/logic-functions/utils/normalize-domain';
import { normalizeLinkedinUrl } from 'src/logic-functions/utils/normalize-linkedin-url';
import { pickHeadquarters } from 'src/logic-functions/utils/pick-headquarters';
import { pickSelect } from 'src/logic-functions/utils/pick-select';
import { toDate } from 'src/logic-functions/utils/to-date';
import { toJsonArray } from 'src/logic-functions/utils/to-json-array';
import { toNumber } from 'src/logic-functions/utils/to-number';
import { toStringArray } from 'src/logic-functions/utils/to-string-array';
import { toText } from 'src/logic-functions/utils/to-text';
import { type CognismCompanyData } from 'src/logic-functions/types/cognism-company-data';
import { type MappedRecord } from 'src/logic-functions/types/mapped-record';
import { pruneUndefined } from 'src/logic-functions/data/prune-undefined';

const COMPANY_TYPE_VALUES = buildAllowedValues(COMPANY_TYPE_OPTIONS);

export const mapCompany = (companyData: CognismCompanyData): MappedRecord => {
  const headquarters = pickHeadquarters(companyData.locations);
  const officePhoneNumbers = isArray(companyData.officePhoneNumbers)
    ? companyData.officePhoneNumbers
    : [];

  const standard = pruneUndefined({
    name: toText(companyData.name),
    domainName: buildLinks({
      url: normalizeDomain(companyData.domain ?? companyData.website),
    }),
    linkedinLink: buildLinks({
      url: normalizeLinkedinUrl(companyData.linkedinUrl),
    }),
    annualRevenue: buildCurrencyFromUsd(companyData.revenue),
    address: buildAddress({
      street1: headquarters?.street,
      city: headquarters?.city,
      state: headquarters?.state,
      postcode: headquarters?.zip,
      country: headquarters?.country,
    }),
  });

  const cognism = pruneUndefined({
    cognismId: toText(companyData.id),
    cognismRedeemId: toText(companyData.redeemId),

    cognismCompanyType: pickSelect({
      raw: companyData.type,
      allowedValues: COMPANY_TYPE_VALUES,
    }),
    cognismSizeRange: buildSizeRange({
      sizeFrom: companyData.sizeFrom,
      sizeTo: companyData.sizeTo,
    }),

    cognismDescription: toText(companyData.description),
    cognismShortDescription: toText(companyData.shortDescription),

    cognismFoundedYear: toNumber(companyData.founded),
    cognismHeadcount: toNumber(companyData.headcount),

    cognismIndustries: toStringArray(companyData.industries),
    cognismTechnologies: toStringArray(companyData.technologies),

    cognismLocations: toJsonArray(companyData.locations),
    cognismNaics: toJsonArray(companyData.naics),
    cognismSic: toJsonArray(companyData.sic),
    cognismHiringEvent: toJsonArray(companyData.hiringEvent),

    cognismOfficePhones: buildPhones(
      officePhoneNumbers.map((phoneNumber) => phoneNumber?.number),
    ),

    cognismLastConfirmed: toDate(companyData.lastConfirmed),
  });

  return { standard, cognism };
};
