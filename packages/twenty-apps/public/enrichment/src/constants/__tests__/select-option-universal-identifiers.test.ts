import { describe, expect, it } from 'vitest';

import { COMPANY_TYPE_OPTIONS } from 'src/constants/company-type-options';
import { DEPARTMENT_OPTIONS } from 'src/constants/department-options';
import { EMAIL_STATUS_OPTIONS } from 'src/constants/email-status-options';
import { ENRICHMENT_STATUS_OPTIONS } from 'src/constants/enrichment-status-options';
import { FUNDING_STAGE_OPTIONS } from 'src/constants/funding-stage-options';
import { INDUSTRY_OPTIONS } from 'src/constants/industry-options';
import { OPERATING_STATUS_OPTIONS } from 'src/constants/operating-status-options';
import { SENIORITY_OPTIONS } from 'src/constants/seniority-options';
import { SIZE_RANGE_OPTIONS } from 'src/constants/size-range-options';
import { ENRICHMENT_SELECT_OPTION_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';
import { type SelectOption } from 'src/types/select-option';

const OPTIONS_BY_IDENTIFIER_KEY: Record<
  keyof typeof ENRICHMENT_SELECT_OPTION_UNIVERSAL_IDENTIFIERS,
  readonly SelectOption[]
> = {
  personEnrichmentStatus: ENRICHMENT_STATUS_OPTIONS,
  companyEnrichmentStatus: ENRICHMENT_STATUS_OPTIONS,
  seniority: SENIORITY_OPTIONS,
  department: DEPARTMENT_OPTIONS,
  emailStatus: EMAIL_STATUS_OPTIONS,
  industry: INDUSTRY_OPTIONS,
  sizeRange: SIZE_RANGE_OPTIONS,
  companyType: COMPANY_TYPE_OPTIONS,
  fundingStage: FUNDING_STAGE_OPTIONS,
  operatingStatus: OPERATING_STATUS_OPTIONS,
};

describe('ENRICHMENT_SELECT_OPTION_UNIVERSAL_IDENTIFIERS', () => {
  it.each(Object.entries(OPTIONS_BY_IDENTIFIER_KEY))(
    'has exactly one identifier per %s option',
    (identifierKey, options) => {
      const identifiers =
        ENRICHMENT_SELECT_OPTION_UNIVERSAL_IDENTIFIERS[
          identifierKey as keyof typeof ENRICHMENT_SELECT_OPTION_UNIVERSAL_IDENTIFIERS
        ];

      expect(Object.keys(identifiers).sort()).toEqual(
        options.map((option) => option.value).sort(),
      );
    },
  );
});
