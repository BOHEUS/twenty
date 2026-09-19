import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewType,
} from 'twenty-sdk/define';

import {
  CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS,
  CRUSTDATA_VIEW_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: CRUSTDATA_VIEW_UNIVERSAL_IDENTIFIERS.enrichedPeople,
  name: 'Enriched (Crustdata)',
  icon: 'IconSparkles',
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: ViewType.TABLE,
  fields: [
    {
      universalIdentifier: '6465fd64-095d-44ae-b945-2b508a365fbd',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.name.universalIdentifier,
      position: 0,
      isVisible: true,
    },
    {
      universalIdentifier: 'ae8cf7e7-7a95-4eb8-802a-e730d87da187',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.jobTitle.universalIdentifier,
      position: 1,
      isVisible: true,
    },
    {
      universalIdentifier: 'ae996a3e-ba4e-4589-b6c5-6807b226341d',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.company.universalIdentifier,
      position: 2,
      isVisible: true,
    },
    {
      universalIdentifier: '1b408f4a-50c6-43f7-abb6-a5ab961b9137',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataDepartment,
      position: 3,
      isVisible: true,
    },
    {
      universalIdentifier: '4b795ccf-e90e-481c-9005-73148fce724d',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataSubDepartment,
      position: 4,
      isVisible: true,
    },
    {
      universalIdentifier: '65a6193c-b006-46b5-8215-071d07edbad7',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataNormalizedTitle,
      position: 5,
      isVisible: true,
    },
    {
      universalIdentifier: 'a60c4194-113d-44a8-b5f9-622ea4125a95',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.emails.universalIdentifier,
      position: 6,
      isVisible: true,
    },
    {
      universalIdentifier: '2fcad909-833d-4d7e-be2f-e987477bade6',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.phones.universalIdentifier,
      position: 7,
      isVisible: true,
    },
    {
      universalIdentifier: '51ea4e2c-14c5-43d6-9435-e9c0eb12d192',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.linkedinLink.universalIdentifier,
      position: 8,
      isVisible: true,
    },
    {
      universalIdentifier: '9ae31352-1d0f-4b5a-b46d-5f6002057622',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataEmailStatus,
      position: 9,
      isVisible: true,
    },
    {
      universalIdentifier: 'd946d236-e816-43e9-ad03-20823f3760b3',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataHeadline,
      position: 10,
      isVisible: true,
    },
    {
      universalIdentifier: 'c8a7a52c-f568-45fc-96a9-f977e8b79642',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataLocation,
      position: 11,
      isVisible: true,
    },
    {
      universalIdentifier: '6111e780-2eef-4412-a016-04e67f4b554b',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataYearsOfExperience,
      position: 12,
      isVisible: true,
    },
    {
      universalIdentifier: 'b2f66165-8ae3-466e-9589-3bb4d51e7e68',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataCurrentJobStartDate,
      position: 13,
      isVisible: true,
    },
    {
      universalIdentifier: '43f075cd-908d-4fba-b5af-5e8bfac70d15',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataSkills,
      position: 14,
      isVisible: true,
    },
    {
      universalIdentifier: 'fbfb9887-e2d3-4bc1-a4cc-45b2099edc81',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataEducation,
      position: 15,
      isVisible: true,
    },
    {
      universalIdentifier: 'a7fe427e-5446-4d3c-9923-f63fa338bb81',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataEnrichmentStatus,
      position: 16,
      isVisible: true,
    },
    {
      universalIdentifier: 'd1c30b99-57d7-4b6a-916e-1cb7252bbc2d',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataLastEnrichedAt,
      position: 17,
      isVisible: true,
    },
    {
      universalIdentifier: '9d87ee58-6d72-46f5-a153-107c7e490cfc',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataMatchConfidence,
      position: 18,
      isVisible: true,
    },
    {
      universalIdentifier: '2e476d2f-c623-45da-9bd3-0760741a0b89',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataAuthenticityVerdict,
      position: 19,
      isVisible: true,
    },
    {
      universalIdentifier: '149ec247-2b88-4461-939e-d7528036fc43',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataAuthenticityTier,
      position: 20,
      isVisible: true,
    },
    {
      universalIdentifier: 'fdc973a8-2b88-4e99-af50-408efd472d08',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataConnections,
      position: 21,
      isVisible: true,
    },
    {
      universalIdentifier: '7cab3b18-5f28-4ecf-b0e5-c44bff65707b',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataFollowers,
      position: 22,
      isVisible: true,
    },
    {
      universalIdentifier: 'fcf508dc-3ab6-419b-b09c-4a52a49b16de',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataXLink,
      position: 23,
      isVisible: true,
    },
    {
      universalIdentifier: '8429f02f-fa2d-4bc5-9d5c-cecdec0eb93b',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataGithubLink,
      position: 24,
      isVisible: true,
    },
    {
      universalIdentifier: '944763cd-8e30-4a34-b99e-db9315cddc78',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataDevPlatformProfiles,
      position: 25,
      isVisible: true,
    },
    {
      universalIdentifier: 'b594785a-f901-4952-b007-082a66eec465',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataSummary,
      position: 26,
      isVisible: true,
    },
    {
      universalIdentifier: '7aa87f27-dcff-4ebb-91bd-f6dbb27bcdad',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataLanguages,
      position: 27,
      isVisible: true,
    },
    {
      universalIdentifier: 'bf80ccd6-4ce9-44af-ace7-7eb15eb2d471',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataPronoun,
      position: 28,
      isVisible: true,
    },
    {
      universalIdentifier: '17c7b993-af93-48ea-acbd-d5ae5a1a4d22',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataWebsites,
      position: 29,
      isVisible: true,
    },
    {
      universalIdentifier: 'd5ed13c1-92ec-4548-b018-5279c780d6bd',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataPastEmployment,
      position: 30,
      isVisible: true,
    },
    {
      universalIdentifier: '9017a2ee-689f-4fb7-a492-20e0fe60280b',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataCertifications,
      position: 31,
      isVisible: true,
    },
    {
      universalIdentifier: 'ade6229e-aec4-431d-b787-1aee52c143f2',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataHonors,
      position: 32,
      isVisible: true,
    },
    {
      universalIdentifier: '81e185c9-5e47-44bf-b3c8-32e180f6317c',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataProfileUpdatedAt,
      position: 33,
      isVisible: true,
    },
    {
      universalIdentifier: '9b847698-641b-4a41-80f8-e773385e4fa6',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataPersonId,
      position: 34,
      isVisible: true,
    },
    {
      universalIdentifier: 'eee24df7-4201-4e5c-a9b7-d4660de58a09',
      fieldMetadataUniversalIdentifier:
        CRUSTDATA_FIELD_UNIVERSAL_IDENTIFIERS.person.crustdataRawPayload,
      position: 35,
      isVisible: true,
    },
  ],
});
