import { describe, expect, it } from 'vitest';

import { COMPANY_TYPE_OPTIONS } from 'src/constants/company-type-options';
import { EMAIL_QUALITY_OPTIONS } from 'src/constants/email-quality-options';
import { ENRICHMENT_STATUS_OPTIONS } from 'src/constants/enrichment-status-options';
import { JOB_FUNCTION_OPTIONS } from 'src/constants/job-function-options';
import { MANAGEMENT_LEVEL_OPTIONS } from 'src/constants/management-level-options';
import { SIZE_RANGE_OPTIONS } from 'src/constants/size-range-options';
import {
  APPLICATION_UNIVERSAL_IDENTIFIER,
  COGNISM_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIERS,
  COGNISM_FIELD_UNIVERSAL_IDENTIFIERS,
  COGNISM_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS,
  COGNISM_LOGIC_FUNCTION_CONSTANTS,
  COGNISM_SELECT_OPTION_UNIVERSAL_IDENTIFIERS,
  COGNISM_VIEW_UNIVERSAL_IDENTIFIERS,
  DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';
import { type SelectOptionMeta } from 'src/logic-functions/types/select-option-meta';
import { normalizeEnumValue } from 'src/logic-functions/data/normalize-enum-value';

import companyEnrichmentStatusField from 'src/fields/company/cognism-enrichment-status.field';
import companySizeRangeField from 'src/fields/company/cognism-size-range.field';
import companyTypeField from 'src/fields/company/cognism-company-type.field';
import personEmailQualityField from 'src/fields/person/cognism-email-quality.field';
import personEnrichmentStatusField from 'src/fields/person/cognism-enrichment-status.field';
import personJobFunctionField from 'src/fields/person/cognism-job-function.field';
import personManagementLevelField from 'src/fields/person/cognism-management-level.field';

type FieldOption = { id?: string; value: string };

const fieldOptions = (field: unknown): FieldOption[] =>
  (field as { config?: { options?: FieldOption[] } }).config?.options ?? [];

const selectFieldCases: {
  name: string;
  field: unknown;
  options: readonly SelectOptionMeta[];
}[] = [
  { name: 'person.cognismManagementLevel', field: personManagementLevelField, options: MANAGEMENT_LEVEL_OPTIONS },
  { name: 'person.cognismJobFunction', field: personJobFunctionField, options: JOB_FUNCTION_OPTIONS },
  { name: 'person.cognismEmailQuality', field: personEmailQualityField, options: EMAIL_QUALITY_OPTIONS },
  { name: 'person.cognismEnrichmentStatus', field: personEnrichmentStatusField, options: ENRICHMENT_STATUS_OPTIONS },
  { name: 'company.cognismCompanyType', field: companyTypeField, options: COMPANY_TYPE_OPTIONS },
  { name: 'company.cognismSizeRange', field: companySizeRangeField, options: SIZE_RANGE_OPTIONS },
  { name: 'company.cognismEnrichmentStatus', field: companyEnrichmentStatusField, options: ENRICHMENT_STATUS_OPTIONS },
];

describe.each(selectFieldCases)('$name options', ({ field, options }) => {
  it('resolves a universalIdentifier for every option', () => {
    expect(fieldOptions(field).every((option) => Boolean(option.id))).toBe(true);
  });

  it('exposes exactly the values from its source constant', () => {
    expect(fieldOptions(field).map((option) => option.value)).toEqual(
      options.map((option) => option.value),
    );
  });

  it('uses option values that are normalizeEnumValue fixed points', () => {
    for (const option of fieldOptions(field)) {
      expect(normalizeEnumValue(option.value)).toBe(option.value);
    }
  });

  it('has option ids that are unique within the field', () => {
    const ids = fieldOptions(field).map((option) => option.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('select fields collectively', () => {
  it('never reuses an option id across two different fields', () => {
    const everyOptionId = selectFieldCases
      .filter(({ options }) => options !== ENRICHMENT_STATUS_OPTIONS)
      .flatMap(({ field }) => fieldOptions(field).map((option) => option.id));

    expect(new Set(everyOptionId).size).toBe(everyOptionId.length);
  });

  it('gives the Person and Company enrichment status fields their own option ids', () => {
    const personIds = fieldOptions(personEnrichmentStatusField).map(
      (option) => option.id,
    );
    const companyIds = fieldOptions(companyEnrichmentStatusField).map(
      (option) => option.id,
    );

    expect(personIds.some((id) => companyIds.includes(id))).toBe(false);
  });
});

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

const hasUniversalIdentifier = (
  value: object,
): value is { universalIdentifier: string } =>
  'universalIdentifier' in value &&
  typeof (value as { universalIdentifier: unknown }).universalIdentifier ===
    'string';

const collectUuids = (value: unknown): string[] => {
  if (typeof value === 'string') {
    return [value];
  }
  if (value !== null && typeof value === 'object') {
    if (!Array.isArray(value) && hasUniversalIdentifier(value)) {
      return [value.universalIdentifier];
    }
    return Object.values(value).flatMap(collectUuids);
  }
  return [];
};

describe('universal-identifier registry', () => {
  const registryUuids = collectUuids([
    APPLICATION_UNIVERSAL_IDENTIFIER,
    DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
    COGNISM_LOGIC_FUNCTION_CONSTANTS,
    COGNISM_FIELD_UNIVERSAL_IDENTIFIERS,
    COGNISM_VIEW_UNIVERSAL_IDENTIFIERS,
    COGNISM_FRONT_COMPONENT_UNIVERSAL_IDENTIFIERS,
    COGNISM_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIERS,
    COGNISM_SELECT_OPTION_UNIVERSAL_IDENTIFIERS,
  ]);

  it('contains only valid v4 UUIDs', () => {
    expect(registryUuids.filter((uuid) => !UUID_V4_REGEX.test(uuid))).toEqual(
      [],
    );
  });

  it('contains no duplicate UUIDs across the whole registry', () => {
    expect(new Set(registryUuids).size).toBe(registryUuids.length);
  });
});
