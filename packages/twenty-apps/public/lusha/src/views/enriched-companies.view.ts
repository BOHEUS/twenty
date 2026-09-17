import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';

import {
  LUSHA_FIELD_UNIVERSAL_IDENTIFIERS,
  LUSHA_VIEW_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: LUSHA_VIEW_UNIVERSAL_IDENTIFIERS.companies,
  name: 'Enriched with Lusha',
  icon: 'IconTable',
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: ViewType.TABLE,
  fields: [
    {
      universalIdentifier: '21aff67c-a71f-4491-b61c-faa5c9bcd8bd',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.name
          .universalIdentifier,
      position: 0,
      isVisible: true,
    },
    {
      universalIdentifier: 'b84a4e72-9bb9-4109-a1fa-0a84faca1061',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.domainName
          .universalIdentifier,
      position: 1,
      isVisible: true,
    },
    {
      universalIdentifier: '69284390-b08c-4c2f-98f7-c6a63e167126',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.company.lushaIndustry,
      position: 2,
      isVisible: true,
    },
    {
      universalIdentifier: '1a0508dc-3d6e-4744-bf12-a783445729bc',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.company.lushaSubIndustry,
      position: 3,
      isVisible: true,
    },
    {
      universalIdentifier: '141a0870-0f83-4bf1-93a6-480400904ba2',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.company.lushaEmployeeCount,
      position: 4,
      isVisible: true,
    },
    {
      universalIdentifier: '4a01ba74-5fce-41a6-9db9-c7b19039d6a0',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.company.lushaRevenueRange,
      position: 5,
      isVisible: true,
    },
    {
      universalIdentifier: '1da430b6-8154-473f-816e-5dd9192b260d',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.company.lushaFoundedYear,
      position: 6,
      isVisible: true,
    },
    {
      universalIdentifier: 'c8225a6b-4ea3-42ae-a877-14b3300460b5',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.company.lushaCompanyType,
      position: 7,
      isVisible: true,
    },
    {
      universalIdentifier: '876e8eba-a691-4ccd-9ee4-02b7efe7662a',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.company.lushaTotalFunding,
      position: 8,
      isVisible: true,
    },
    {
      universalIdentifier: '2c59e8da-4d8f-4e48-80ee-2d77cd2e8772',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.company.lushaLastFundingType,
      position: 9,
      isVisible: true,
    },
    {
      universalIdentifier: '100c46a4-2dbf-4372-9d8c-6976415727ba',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.company.lushaLastFundingDate,
      position: 10,
      isVisible: true,
    },
    {
      universalIdentifier: 'c80deb22-d13d-414e-8113-4a279de5da0f',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.company.lushaTechnologies,
      position: 11,
      isVisible: true,
    },
    {
      universalIdentifier: '257828d7-9dab-451e-ac37-adbd5a1e325e',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.linkedinLink
          .universalIdentifier,
      position: 12,
      isVisible: true,
    },
    {
      universalIdentifier: 'a462222f-5ab5-4f39-948e-981aaa7956b3',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.company.lushaLinkedinFollowers,
      position: 13,
      isVisible: true,
    },
    {
      universalIdentifier: '98833e0e-9276-4683-aa9c-25abe147b19c',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.company.lushaLocation,
      position: 14,
      isVisible: true,
    },
    {
      universalIdentifier: 'c557a83e-aa0c-4e1f-a14f-cd5569fb1186',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.company.lushaPhones,
      position: 15,
      isVisible: true,
    },
    {
      universalIdentifier: '61b49301-0777-4e05-a8ab-604b29e1b13d',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.company.lushaEnrichmentStatus,
      position: 16,
      isVisible: true,
    },
    {
      universalIdentifier: 'ebbb8682-dea7-438f-a42b-aec5af7e5572',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.company.lushaLastEnrichedAt,
      position: 17,
      isVisible: true,
    },
    {
      universalIdentifier: '9adcff44-ec57-43d5-8d41-f79ecf1806d7',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.company.lushaId,
      position: 18,
      isVisible: true,
    },
  ],
  filters: [
    {
      universalIdentifier: '1759636d-53ce-47ec-9934-f80a1177de8e',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.company.lushaLastEnrichedAt,
      operand: ViewFilterOperand.IS_NOT_EMPTY,
      value: '',
    },
  ],
  sorts: [
    {
      universalIdentifier: 'f1502911-d1e2-4cb4-a212-80047bacb2f6',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.company.lushaLastEnrichedAt,
      direction: ViewSortDirection.DESC,
    },
  ],
});
