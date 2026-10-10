import {
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewType,
  defineView,
} from 'twenty-sdk/define';

import {
  AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS,
  AMPLEMARKET_VIEW_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: AMPLEMARKET_VIEW_UNIVERSAL_IDENTIFIERS.enrichedCompanies,
  name: 'Enriched (Amplemarket)',
  icon: 'IconSparkles',
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: ViewType.TABLE,
  fields: [
    {
      universalIdentifier: 'd9098097-b59b-4351-8b6c-828231efd7e7',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.name
          .universalIdentifier,
      position: 0,
      isVisible: true,
    },
    {
      universalIdentifier: '58f0e986-1810-43e2-b123-eed1ebe41fc2',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.domainName
          .universalIdentifier,
      position: 1,
      isVisible: true,
    },
    {
      universalIdentifier: '7470402b-2974-47ed-831c-5c4736bdbae8',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.linkedinLink
          .universalIdentifier,
      position: 2,
      isVisible: true,
    },
    {
      universalIdentifier: '24eea711-2339-4442-80f4-eff024c60cc4',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.address
          .universalIdentifier,
      position: 3,
      isVisible: true,
    },
    {
      universalIdentifier: '4e886269-39ff-41ef-ab6a-a82858177640',
      fieldMetadataUniversalIdentifier:
        AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS.company.amplemarketIndustry,
      position: 4,
      isVisible: true,
    },
    {
      universalIdentifier: '02be22ab-eb0c-42ec-879a-1e53ed87a01b',
      fieldMetadataUniversalIdentifier:
        AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS.company.amplemarketSize,
      position: 5,
      isVisible: true,
    },
    {
      universalIdentifier: '063b1ea5-770d-4632-9e5d-e33a81dbffd9',
      fieldMetadataUniversalIdentifier:
        AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS.company
          .amplemarketEmployeeCount,
      position: 6,
      isVisible: true,
    },
    {
      universalIdentifier: '29b6db71-f8a1-4c40-9c93-c36af5c0bc88',
      fieldMetadataUniversalIdentifier:
        AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS.company
          .amplemarketEstimatedRevenue,
      position: 7,
      isVisible: true,
    },
    {
      universalIdentifier: 'c5c7c423-dfba-4695-8a82-d323dee545fb',
      fieldMetadataUniversalIdentifier:
        AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS.company
          .amplemarketLatestFundingStage,
      position: 8,
      isVisible: true,
    },
    {
      universalIdentifier: '6b51c374-0d3a-4a9b-9ad4-017487cd1687',
      fieldMetadataUniversalIdentifier:
        AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS.company.amplemarketFoundedYear,
      position: 9,
      isVisible: true,
    },
    {
      universalIdentifier: 'e53e1f86-f211-4191-b9c2-4c9271cc160c',
      fieldMetadataUniversalIdentifier:
        AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS.company.amplemarketTechnologies,
      position: 10,
      isVisible: true,
    },
    {
      universalIdentifier: 'f8da0c90-51a9-4f28-b34a-607a5290a11f',
      fieldMetadataUniversalIdentifier:
        AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS.company
          .amplemarketEnrichmentStatus,
      position: 11,
      isVisible: true,
    },
    {
      universalIdentifier: '9ad685bd-d0be-4867-a1bb-4ee8edd84a3f',
      fieldMetadataUniversalIdentifier:
        AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS.company
          .amplemarketLastEnrichedAt,
      position: 12,
      isVisible: true,
    },
    {
      universalIdentifier: '830a569e-8522-4b09-b28c-599bf2e6987c',
      fieldMetadataUniversalIdentifier:
        AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS.company.amplemarketOverview,
      position: 13,
      isVisible: true,
    },
    {
      universalIdentifier: '60c7fad1-f219-449d-8614-d3790b665b26',
      fieldMetadataUniversalIdentifier:
        AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS.company.amplemarketRawPayload,
      position: 14,
      isVisible: true,
    },
  ],
});
