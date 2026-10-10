import {
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewType,
  defineView,
} from 'twenty-sdk/define';

import {
  SNOV_FIELD_UNIVERSAL_IDENTIFIERS,
  SNOV_VIEW_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: SNOV_VIEW_UNIVERSAL_IDENTIFIERS.enrichedCompanies,
  name: 'Enriched (Snov.io)',
  icon: 'IconSparkles',
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: ViewType.TABLE,
  fields: [
    {
      universalIdentifier: 'e00ecc54-b9e3-40ef-af55-6f17462cfc83',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.name
          .universalIdentifier,
      position: 0,
      isVisible: true,
    },
    {
      universalIdentifier: '222aba2d-f87f-4ec7-a85e-2f24b10d4103',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.domainName
          .universalIdentifier,
      position: 1,
      isVisible: true,
    },
    {
      universalIdentifier: '1536f11d-a673-4644-ab13-35b092de3db0',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.address
          .universalIdentifier,
      position: 2,
      isVisible: true,
    },
    {
      universalIdentifier: 'c9dc2a79-ef65-4e59-bb62-2037762ab143',
      fieldMetadataUniversalIdentifier:
        SNOV_FIELD_UNIVERSAL_IDENTIFIERS.company.snovIndustry,
      position: 3,
      isVisible: true,
    },
    {
      universalIdentifier: 'b61bf9aa-4324-43a6-99d8-327431e41c13',
      fieldMetadataUniversalIdentifier:
        SNOV_FIELD_UNIVERSAL_IDENTIFIERS.company.snovSize,
      position: 4,
      isVisible: true,
    },
    {
      universalIdentifier: '5aff44fe-fb90-48a1-895e-f794083aedb2',
      fieldMetadataUniversalIdentifier:
        SNOV_FIELD_UNIVERSAL_IDENTIFIERS.company.snovFoundedYear,
      position: 5,
      isVisible: true,
    },
    {
      universalIdentifier: '1cd78796-58b8-4287-b57a-1834b598f651',
      fieldMetadataUniversalIdentifier:
        SNOV_FIELD_UNIVERSAL_IDENTIFIERS.company.snovPhone,
      position: 6,
      isVisible: true,
    },
    {
      universalIdentifier: '0aa06d81-fb48-4216-8c1b-2b451dd245eb',
      fieldMetadataUniversalIdentifier:
        SNOV_FIELD_UNIVERSAL_IDENTIFIERS.company.snovRelatedDomains,
      position: 7,
      isVisible: true,
    },
    {
      universalIdentifier: '24c3644d-eac2-4355-8248-6d1b02ce389a',
      fieldMetadataUniversalIdentifier:
        SNOV_FIELD_UNIVERSAL_IDENTIFIERS.company.snovEnrichmentStatus,
      position: 8,
      isVisible: true,
    },
    {
      universalIdentifier: '40c53e14-544a-40da-9a73-ea660bed5c65',
      fieldMetadataUniversalIdentifier:
        SNOV_FIELD_UNIVERSAL_IDENTIFIERS.company.snovLastEnrichedAt,
      position: 9,
      isVisible: true,
    },
    {
      universalIdentifier: '93760e21-6055-4dea-9186-bd4f0730bec3',
      fieldMetadataUniversalIdentifier:
        SNOV_FIELD_UNIVERSAL_IDENTIFIERS.company.snovRawPayload,
      position: 10,
      isVisible: true,
    },
  ],
});
