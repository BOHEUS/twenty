import {
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewType,
  defineView,
} from 'twenty-sdk/define';

import {
  HUNTER_FIELD_UNIVERSAL_IDENTIFIERS,
  HUNTER_VIEW_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: HUNTER_VIEW_UNIVERSAL_IDENTIFIERS.enrichedCompanies,
  name: 'Enriched (Hunter)',
  icon: 'IconSparkles',
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: ViewType.TABLE,
  fields: [
    {
      universalIdentifier: '468964a4-724b-467c-8fa0-8b09846d64fa',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.name
          .universalIdentifier,
      position: 0,
      isVisible: true,
    },
    {
      universalIdentifier: '0f6ee240-cf7a-4237-8b9f-469c1564ea2c',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.domainName
          .universalIdentifier,
      position: 1,
      isVisible: true,
    },
    {
      universalIdentifier: '43629d85-7f0e-4271-9624-92fb65357800',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.linkedinLink
          .universalIdentifier,
      position: 2,
      isVisible: true,
    },
    {
      universalIdentifier: '49669bcc-408e-45f8-b932-998ac7e243b1',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.address
          .universalIdentifier,
      position: 3,
      isVisible: true,
    },
    {
      universalIdentifier: '38ced9dd-78e5-4593-8c52-4ad0715b2523',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.annualRevenue
          .universalIdentifier,
      position: 4,
      isVisible: true,
    },
    {
      universalIdentifier: 'dff0da60-03ac-4a4a-90a8-7b6bffca3f08',
      fieldMetadataUniversalIdentifier:
        HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.company.hunterIndustry,
      position: 5,
      isVisible: true,
    },
    {
      universalIdentifier: '9f3f7a39-7c36-48f6-8e68-bca101e7e18a',
      fieldMetadataUniversalIdentifier:
        HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.company.hunterEmployeeRange,
      position: 6,
      isVisible: true,
    },
    {
      universalIdentifier: 'df81a30a-7f0d-487b-88fb-5b52821d8d23',
      fieldMetadataUniversalIdentifier:
        HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.company.hunterEmployeeCount,
      position: 7,
      isVisible: true,
    },
    {
      universalIdentifier: '00bf6450-2ad1-49b1-9251-7c9391a8d32e',
      fieldMetadataUniversalIdentifier:
        HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.company.hunterEstimatedRevenue,
      position: 8,
      isVisible: true,
    },
    {
      universalIdentifier: 'd65dca32-e399-4667-9769-41ee5fe867b4',
      fieldMetadataUniversalIdentifier:
        HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.company.hunterTotalFunding,
      position: 9,
      isVisible: true,
    },
    {
      universalIdentifier: 'b8cee4ca-d367-4653-8aec-bde60325bc3c',
      fieldMetadataUniversalIdentifier:
        HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.company.hunterFoundedYear,
      position: 10,
      isVisible: true,
    },
    {
      universalIdentifier: '53a0a42f-c4e5-4313-aa0e-3e83157a7965',
      fieldMetadataUniversalIdentifier:
        HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.company.hunterTech,
      position: 11,
      isVisible: true,
    },
    {
      universalIdentifier: 'eac66e17-f52d-46f1-ade8-6a02425fe265',
      fieldMetadataUniversalIdentifier:
        HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.company.hunterPhone,
      position: 12,
      isVisible: true,
    },
    {
      universalIdentifier: '837dfcef-2873-457e-9f4b-8086c6745455',
      fieldMetadataUniversalIdentifier:
        HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.company.hunterEnrichmentStatus,
      position: 13,
      isVisible: true,
    },
    {
      universalIdentifier: '3aabc949-a828-4873-a3f8-019c03775c77',
      fieldMetadataUniversalIdentifier:
        HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.company.hunterLastEnrichedAt,
      position: 14,
      isVisible: true,
    },
    {
      universalIdentifier: '11d835ac-aff3-45e7-bac5-bdf91294ec79',
      fieldMetadataUniversalIdentifier:
        HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.company.hunterDescription,
      position: 15,
      isVisible: true,
    },
    {
      universalIdentifier: 'd6202118-cfa0-4ba2-849c-57c43a87ff4b',
      fieldMetadataUniversalIdentifier:
        HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.company.hunterRawPayload,
      position: 16,
      isVisible: true,
    },
  ],
});
