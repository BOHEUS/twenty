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
  universalIdentifier: EXPLORIUM_VIEW_UNIVERSAL_IDENTIFIERS.enrichedPeople,
  name: 'Enriched (Explorium)',
  icon: 'IconSparkles',
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: ViewType.TABLE,
  fields: [
    {
      universalIdentifier: 'a2a7692b-0588-4304-abba-c4b9e1a68a5e',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.name
          .universalIdentifier,
      position: 0,
      isVisible: true,
    },
    {
      universalIdentifier: 'dde1db78-439b-4acd-85ce-c9bb76c5bb40',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.jobTitle
          .universalIdentifier,
      position: 1,
      isVisible: true,
    },
    {
      universalIdentifier: 'a4197ecc-7dc1-4f7a-8c23-7eb103f43cd2',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.company
          .universalIdentifier,
      position: 2,
      isVisible: true,
    },
    {
      universalIdentifier: '87d7f4d9-8d63-4bb2-83e6-42492b532d2b',
      fieldMetadataUniversalIdentifier:
        EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.person.exploriumJobLevels,
      position: 3,
      isVisible: true,
    },
    {
      universalIdentifier: 'a76082ee-87d4-48fb-a296-e92abe68f7dd',
      fieldMetadataUniversalIdentifier:
        EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.person.exploriumJobDepartments,
      position: 4,
      isVisible: true,
    },
    {
      universalIdentifier: 'ce650ddb-76ba-4d5d-a364-d373169309d6',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.emails
          .universalIdentifier,
      position: 5,
      isVisible: true,
    },
    {
      universalIdentifier: 'bf28386a-841c-438f-ac2a-a5945277f3ed',
      fieldMetadataUniversalIdentifier:
        EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.person.exploriumEmailStatus,
      position: 6,
      isVisible: true,
    },
    {
      universalIdentifier: '09f8ce67-469f-4f77-a0be-cddbe08cf90b',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.phones
          .universalIdentifier,
      position: 7,
      isVisible: true,
    },
    {
      universalIdentifier: '141b4e57-15a3-456b-ae39-b5da1a04fa66',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.linkedinLink
          .universalIdentifier,
      position: 8,
      isVisible: true,
    },
    {
      universalIdentifier: '11477b29-74e9-4587-a9bc-ee6122917d12',
      fieldMetadataUniversalIdentifier:
        EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.person.exploriumLocation,
      position: 9,
      isVisible: true,
    },
    {
      universalIdentifier: '0ea18a59-25c0-4f17-8289-2aaf1c025ac1',
      fieldMetadataUniversalIdentifier:
        EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.person.exploriumSkills,
      position: 10,
      isVisible: true,
    },
    {
      universalIdentifier: 'eba9ae79-0c30-4499-ade9-eaec1e4bc3d1',
      fieldMetadataUniversalIdentifier:
        EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.person.exploriumEnrichmentStatus,
      position: 11,
      isVisible: true,
    },
    {
      universalIdentifier: '1d3c94c7-1ae0-481a-bc66-654735f43d00',
      fieldMetadataUniversalIdentifier:
        EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.person.exploriumLastEnrichedAt,
      position: 12,
      isVisible: true,
    },
    {
      universalIdentifier: 'f81e638f-df4f-4e41-b49d-59981e0af2ac',
      fieldMetadataUniversalIdentifier:
        EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.person.exploriumGender,
      position: 13,
      isVisible: true,
    },
    {
      universalIdentifier: '847a191e-e602-4d0d-901f-07c15077f2ad',
      fieldMetadataUniversalIdentifier:
        EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.person.exploriumAgeGroup,
      position: 14,
      isVisible: true,
    },
    {
      universalIdentifier: 'b4a532d7-db88-4809-ac12-dbfac88bc41e',
      fieldMetadataUniversalIdentifier:
        EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.person.exploriumInterests,
      position: 15,
      isVisible: true,
    },
    {
      universalIdentifier: 'db14b373-bda1-41a1-87c9-11ec669c3e2d',
      fieldMetadataUniversalIdentifier:
        EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.person.exploriumExperience,
      position: 16,
      isVisible: true,
    },
    {
      universalIdentifier: '3466d16c-c3ab-4b67-81c9-02e1cf014c37',
      fieldMetadataUniversalIdentifier:
        EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.person.exploriumEducation,
      position: 17,
      isVisible: true,
    },
    {
      universalIdentifier: 'ca34f103-a0c3-4fe7-9953-573872168dbb',
      fieldMetadataUniversalIdentifier:
        EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.person.exploriumLinkedinUrls,
      position: 18,
      isVisible: true,
    },
    {
      universalIdentifier: '95e2f44e-d3c4-4a89-8f86-6c175723b32c',
      fieldMetadataUniversalIdentifier:
        EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.person.exploriumId,
      position: 19,
      isVisible: true,
    },
    {
      universalIdentifier: '0bd4d867-dd02-49a7-a2d1-606b95676479',
      fieldMetadataUniversalIdentifier:
        EXPLORIUM_FIELD_UNIVERSAL_IDENTIFIERS.person.exploriumRawPayload,
      position: 20,
      isVisible: true,
    },
  ],
});
