import {
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewType,
  defineView,
} from 'twenty-sdk/define';

import {
  EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS,
  EXPLORIUM_VIEW_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: EXPLORIUM_VIEW_UNIVERSAL_IDENTIFIERS.enrichedCompanies,
  name: 'Enriched (Explorium)',
  icon: 'IconSparkles',
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: ViewType.TABLE,
  fields: [
    {
      universalIdentifier: '0a21f14b-9e9e-44d1-8256-0023b722103d',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.name
          .universalIdentifier,
      position: 0,
      isVisible: true,
    },
    {
      universalIdentifier: '2109b540-63e2-430e-8cb4-734303301173',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.domainName
          .universalIdentifier,
      position: 1,
      isVisible: true,
    },
    {
      universalIdentifier: 'f11e4773-0ba5-41b7-bf59-16e56f970f01',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.linkedinLink
          .universalIdentifier,
      position: 2,
      isVisible: true,
    },
    {
      universalIdentifier: '0fe2c16a-7e05-435e-abab-23dc32feaef2',
      fieldMetadataUniversalIdentifier:
        EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.company.exploriumIndustry,
      position: 3,
      isVisible: true,
    },
    {
      universalIdentifier: '52f6079e-2a55-4e5b-a474-7779b4fabd3f',
      fieldMetadataUniversalIdentifier:
        EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.company.exploriumEmployeeRange,
      position: 4,
      isVisible: true,
    },
    {
      universalIdentifier: 'f42ed53d-5516-4d23-8adc-f979c31f091e',
      fieldMetadataUniversalIdentifier:
        EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.company.exploriumRevenueRange,
      position: 5,
      isVisible: true,
    },
    {
      universalIdentifier: '746df219-ea0b-41be-914c-9d0a72e7b7b4',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.address
          .universalIdentifier,
      position: 6,
      isVisible: true,
    },
    {
      universalIdentifier: '8d661846-73f3-43f5-a80b-a49294ba2e05',
      fieldMetadataUniversalIdentifier:
        EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.company.exploriumDescription,
      position: 7,
      isVisible: true,
    },
    {
      universalIdentifier: '45e64388-2535-4835-b231-33026326f568',
      fieldMetadataUniversalIdentifier:
        EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.company.exploriumTicker,
      position: 8,
      isVisible: true,
    },
    {
      universalIdentifier: '461ddb42-dcc9-461f-9ca7-ce42b91e8137',
      fieldMetadataUniversalIdentifier:
        EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.company.exploriumNaics,
      position: 9,
      isVisible: true,
    },
    {
      universalIdentifier: '6f7629af-3a21-487b-8ad2-09e9595c03a0',
      fieldMetadataUniversalIdentifier:
        EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.company.exploriumNaicsDescription,
      position: 10,
      isVisible: true,
    },
    {
      universalIdentifier: '1a043257-b4b1-47da-9e37-674db1cc289c',
      fieldMetadataUniversalIdentifier:
        EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.company.exploriumSic,
      position: 11,
      isVisible: true,
    },
    {
      universalIdentifier: '998bca7b-ec60-4072-92de-ce961ca35c83',
      fieldMetadataUniversalIdentifier:
        EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.company.exploriumSicDescription,
      position: 12,
      isVisible: true,
    },
    {
      universalIdentifier: '50e8f7a2-4533-4fe0-9bb0-346068c05f29',
      fieldMetadataUniversalIdentifier:
        EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.company.exploriumEnrichmentStatus,
      position: 13,
      isVisible: true,
    },
    {
      universalIdentifier: '399e9a3b-1f3c-4c4f-a061-e65a185c4ca4',
      fieldMetadataUniversalIdentifier:
        EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.company.exploriumLastEnrichedAt,
      position: 14,
      isVisible: true,
    },
    {
      universalIdentifier: '183fc7e1-703b-480b-a19f-4a1cb1d6b1b6',
      fieldMetadataUniversalIdentifier:
        EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.company
          .exploriumLocationsDistribution,
      position: 15,
      isVisible: true,
    },
    {
      universalIdentifier: 'bd3cca47-518b-4be8-8f01-5ec9cea0771f',
      fieldMetadataUniversalIdentifier:
        EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.company.exploriumId,
      position: 16,
      isVisible: true,
    },
    {
      universalIdentifier: '6108ad77-e742-4fb2-b3f3-0f1aae6508b9',
      fieldMetadataUniversalIdentifier:
        EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.company.exploriumRawPayload,
      position: 17,
      isVisible: true,
    },
  ],
});
