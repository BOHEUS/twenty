import {
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewType,
  defineView,
} from 'twenty-sdk/define';

import {
  COGNISM_FIELD_UNIVERSAL_IDENTIFIERS,
  COGNISM_VIEW_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: COGNISM_VIEW_UNIVERSAL_IDENTIFIERS.enrichedCompanies,
  name: 'Enriched (Cognism)',
  icon: 'IconSparkles',
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: ViewType.TABLE,
  fields: [
    {
      universalIdentifier: '7a02f729-7317-4e23-a846-7e583f0e50f1',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.name
          .universalIdentifier,
      position: 0,
      isVisible: true,
    },
    {
      universalIdentifier: '8d84d010-6f12-4019-8ef6-85fb356822e9',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.domainName
          .universalIdentifier,
      position: 1,
      isVisible: true,
    },
    {
      universalIdentifier: 'cfc27e88-5d16-45e7-8ebb-a5bef29b5bc5',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.linkedinLink
          .universalIdentifier,
      position: 2,
      isVisible: true,
    },
    {
      universalIdentifier: '6050bf4e-0f2f-4308-b730-fa3b3790839d',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.company.cognismIndustries,
      position: 3,
      isVisible: true,
    },
    {
      universalIdentifier: '0be04fea-9aa7-468a-abe3-c3bb51558377',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.company.cognismCompanyType,
      position: 4,
      isVisible: true,
    },
    {
      universalIdentifier: 'b4a0d764-9c2a-4cd3-bc6d-a5ca564f28e9',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.company.cognismSizeRange,
      position: 5,
      isVisible: true,
    },
    {
      universalIdentifier: '788e2044-d757-42c3-a63e-7f7cc256030a',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.company.cognismHeadcount,
      position: 6,
      isVisible: true,
    },
    {
      universalIdentifier: 'cfe3dcff-9425-43c3-8851-7495253ad8ae',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.annualRevenue
          .universalIdentifier,
      position: 7,
      isVisible: true,
    },
    {
      universalIdentifier: 'bcad5c55-5bbe-4983-a502-594a8281f09c',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.address
          .universalIdentifier,
      position: 8,
      isVisible: true,
    },
    {
      universalIdentifier: 'ea7c908e-8d94-48a7-814f-ab2952427cd3',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.company.cognismFoundedYear,
      position: 9,
      isVisible: true,
    },
    {
      universalIdentifier: 'cc663d93-6413-4087-844e-4a73a3ee6c2c',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.company.cognismOfficePhones,
      position: 10,
      isVisible: true,
    },
    {
      universalIdentifier: '71f5e762-d294-43cd-b77b-bad81eddeaa6',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.company.cognismTechnologies,
      position: 11,
      isVisible: true,
    },
    {
      universalIdentifier: '0010d810-1f52-4a46-bda1-3094eaf6f202',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.company.cognismShortDescription,
      position: 12,
      isVisible: true,
    },
    {
      universalIdentifier: 'd7e75029-3201-4a2a-ae86-00a01e645fb2',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.company.cognismDescription,
      position: 13,
      isVisible: true,
    },
    {
      universalIdentifier: '62d0e3ae-ecc3-4cb3-9ddb-da438da41e4f',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.company.cognismNaics,
      position: 14,
      isVisible: true,
    },
    {
      universalIdentifier: '5538677a-7e77-4b44-bad1-54445b57d3e9',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.company.cognismSic,
      position: 15,
      isVisible: true,
    },
    {
      universalIdentifier: '8fbf8225-ddfd-479b-9525-7ee29283ef72',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.company.cognismLocations,
      position: 16,
      isVisible: true,
    },
    {
      universalIdentifier: 'aa1bcbb3-619d-4cb3-b64d-c03fe4cec968',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.company.cognismHiringEvent,
      position: 17,
      isVisible: true,
    },
    {
      universalIdentifier: 'b52d49ec-1a2a-4ec4-9f45-e8084429eba7',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.company.cognismEnrichmentStatus,
      position: 18,
      isVisible: true,
    },
    {
      universalIdentifier: '9e2989b0-812c-4587-93b7-7067ca0bd9f3',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.company.cognismMatchScore,
      position: 19,
      isVisible: true,
    },
    {
      universalIdentifier: 'c3346307-67a3-45c6-8fb6-5f9db187be27',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.company.cognismLastConfirmed,
      position: 20,
      isVisible: true,
    },
    {
      universalIdentifier: 'dea7fcb5-600a-4e21-92da-988531736898',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.company.cognismLastEnrichedAt,
      position: 21,
      isVisible: true,
    },
    {
      universalIdentifier: 'f333dcc2-b4ab-41fe-95c4-af9d5783937f',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.company.cognismId,
      position: 22,
      isVisible: true,
    },
    {
      universalIdentifier: '442592f0-a17a-422c-b887-a43cdfbbf76c',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.company.cognismRedeemId,
      position: 23,
      isVisible: true,
    },
    {
      universalIdentifier: '73b1f5ff-03e1-43df-baff-aa910075d678',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.accountOwner
          .universalIdentifier,
      position: 24,
      isVisible: true,
    },
    {
      universalIdentifier: '5af555f8-4510-42e4-bd01-00da1a925f37',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.people
          .universalIdentifier,
      position: 25,
      isVisible: true,
    },
    {
      universalIdentifier: 'b20f1250-088f-45c2-8365-4e705e4396fa',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.opportunities
          .universalIdentifier,
      position: 26,
      isVisible: true,
    },
    {
      universalIdentifier: '42f4154c-9e83-4871-baf7-4d8f753664b9',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.noteTargets
          .universalIdentifier,
      position: 27,
      isVisible: true,
    },
    {
      universalIdentifier: 'b273bbab-e255-4de6-85bc-b41cf087af6d',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.taskTargets
          .universalIdentifier,
      position: 28,
      isVisible: true,
    },
    {
      universalIdentifier: '0dfacee9-f9f1-4234-9509-c190b21ab68e',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.attachments
          .universalIdentifier,
      position: 29,
      isVisible: true,
    },
    {
      universalIdentifier: '13b4e927-5249-4902-aa52-8111f427b1c3',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.timelineActivities
          .universalIdentifier,
      position: 30,
      isVisible: true,
    },
    {
      universalIdentifier: '034f7d92-847d-4157-9413-4077521020ad',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.createdBy
          .universalIdentifier,
      position: 31,
      isVisible: true,
    },
    {
      universalIdentifier: '740377f3-dd9d-4c87-a79b-e67ebeabf872',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.updatedBy
          .universalIdentifier,
      position: 32,
      isVisible: true,
    },
    {
      universalIdentifier: '51ab8b0d-03b1-4730-8a75-a0094f67dced',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.createdAt
          .universalIdentifier,
      position: 33,
      isVisible: true,
    },
    {
      universalIdentifier: 'dc5e00bb-fac9-437d-8107-68d9f0a31129',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields.updatedAt
          .universalIdentifier,
      position: 34,
      isVisible: true,
    },
    {
      universalIdentifier: '63b797c6-7a63-403d-9ac4-5d0e94ece54b',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.company.cognismRawPayload,
      position: 35,
      isVisible: true,
    },
  ],
});
