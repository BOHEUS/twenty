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
  universalIdentifier: SNOV_VIEW_UNIVERSAL_IDENTIFIERS.enrichedPeople,
  name: 'Enriched (Snov.io)',
  icon: 'IconSparkles',
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: ViewType.TABLE,
  fields: [
    {
      universalIdentifier: 'e9f7a63f-a803-4c33-a3db-21139f4ba5d4',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.name
          .universalIdentifier,
      position: 0,
      isVisible: true,
    },
    {
      universalIdentifier: '49feb442-36a4-48a6-825c-cc7d0b0d7cf0',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.jobTitle
          .universalIdentifier,
      position: 1,
      isVisible: true,
    },
    {
      universalIdentifier: 'ad2bab0f-0c26-4f43-b925-72107a0b0217',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.company
          .universalIdentifier,
      position: 2,
      isVisible: true,
    },
    {
      universalIdentifier: '524f137b-045e-4e3b-9516-94b8ac8aab39',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.emails
          .universalIdentifier,
      position: 3,
      isVisible: true,
    },
    {
      universalIdentifier: '9296f745-cf32-4ba9-8902-0983972ede88',
      fieldMetadataUniversalIdentifier:
        SNOV_FIELD_UNIVERSAL_IDENTIFIERS.person.snovFoundEmail,
      position: 4,
      isVisible: true,
    },
    {
      universalIdentifier: '6fde745f-3e9a-4b73-bb02-fa23fc146e58',
      fieldMetadataUniversalIdentifier:
        SNOV_FIELD_UNIVERSAL_IDENTIFIERS.person.snovEmailStatus,
      position: 5,
      isVisible: true,
    },
    {
      universalIdentifier: '1146f9d7-2610-44f3-9fdd-02dda0f08e6f',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.linkedinLink
          .universalIdentifier,
      position: 6,
      isVisible: true,
    },
    {
      universalIdentifier: '0a1d9c36-0b62-4a55-8e6e-4aae9c9436e6',
      fieldMetadataUniversalIdentifier:
        SNOV_FIELD_UNIVERSAL_IDENTIFIERS.person.snovLocation,
      position: 7,
      isVisible: true,
    },
    {
      universalIdentifier: '9522a894-b16b-4222-99bf-e2bfd80af4c6',
      fieldMetadataUniversalIdentifier:
        SNOV_FIELD_UNIVERSAL_IDENTIFIERS.person.snovIndustry,
      position: 8,
      isVisible: true,
    },
    {
      universalIdentifier: '5d778531-b3ba-4ad1-b6fd-38b90902826a',
      fieldMetadataUniversalIdentifier:
        SNOV_FIELD_UNIVERSAL_IDENTIFIERS.person.snovJobStartDate,
      position: 9,
      isVisible: true,
    },
    {
      universalIdentifier: '13bb9251-2f71-4818-ae17-dcca8aeef335',
      fieldMetadataUniversalIdentifier:
        SNOV_FIELD_UNIVERSAL_IDENTIFIERS.person.snovSkills,
      position: 10,
      isVisible: true,
    },
    {
      universalIdentifier: 'e75d11ce-0453-4cfa-ba20-8e21e7de3b50',
      fieldMetadataUniversalIdentifier:
        SNOV_FIELD_UNIVERSAL_IDENTIFIERS.person.snovEnrichmentStatus,
      position: 11,
      isVisible: true,
    },
    {
      universalIdentifier: 'b19c9c7d-116f-49ff-ab18-efd41cc4357d',
      fieldMetadataUniversalIdentifier:
        SNOV_FIELD_UNIVERSAL_IDENTIFIERS.person.snovLastEnrichedAt,
      position: 12,
      isVisible: true,
    },
    {
      universalIdentifier: '742947ff-1da6-4b06-a088-31cdbec0792d',
      fieldMetadataUniversalIdentifier:
        SNOV_FIELD_UNIVERSAL_IDENTIFIERS.person.snovPreviousJobs,
      position: 13,
      isVisible: true,
    },
    {
      universalIdentifier: '6c4a04be-e0f2-4b3b-80a9-702f7b905139',
      fieldMetadataUniversalIdentifier:
        SNOV_FIELD_UNIVERSAL_IDENTIFIERS.person.snovSocialProfiles,
      position: 14,
      isVisible: true,
    },
    {
      universalIdentifier: '832919ad-093f-42ff-b202-9278549254ff',
      fieldMetadataUniversalIdentifier:
        SNOV_FIELD_UNIVERSAL_IDENTIFIERS.person.snovId,
      position: 15,
      isVisible: true,
    },
    {
      universalIdentifier: '14ff6baa-ea39-4703-af7d-aaca056638f0',
      fieldMetadataUniversalIdentifier:
        SNOV_FIELD_UNIVERSAL_IDENTIFIERS.person.snovRawPayload,
      position: 16,
      isVisible: true,
    },
  ],
});
