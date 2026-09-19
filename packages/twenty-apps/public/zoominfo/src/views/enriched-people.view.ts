import {
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewType,
  defineView,
} from 'twenty-sdk/define';

import {
  ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS,
  ZOOMINFO_VIEW_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: ZOOMINFO_VIEW_UNIVERSAL_IDENTIFIERS.enrichedPeople,
  name: 'Enriched (ZoomInfo)',
  icon: 'IconSparkles',
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: ViewType.TABLE,
  fields: [
    {
      universalIdentifier: 'e722aaa5-417d-48cd-b613-de280c7c3b88',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.name
          .universalIdentifier,
      position: 0,
      isVisible: true,
    },
    {
      universalIdentifier: '21ecb536-ac11-40fd-89b9-4e4d7cf60318',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.emails
          .universalIdentifier,
      position: 1,
      isVisible: true,
    },
    {
      universalIdentifier: '59dd5757-3ea7-4394-bb2d-2bdbbb8fa6e3',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.phones
          .universalIdentifier,
      position: 2,
      isVisible: true,
    },
    {
      universalIdentifier: 'ef806cd8-d7e1-4289-a9f1-dea558d108d8',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.jobTitle
          .universalIdentifier,
      position: 3,
      isVisible: true,
    },
    {
      universalIdentifier: '18df086a-3adf-455c-9b7b-7f0dca76bb47',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.person.zoomInfoJobFunction,
      position: 4,
      isVisible: true,
    },
    {
      universalIdentifier: 'a7021c31-41b7-4775-bd9e-c57b6679c379',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.person.zoomInfoJobDepartment,
      position: 5,
      isVisible: true,
    },
    {
      universalIdentifier: 'ec2ec6a5-9b63-4ef7-ba59-45694e7957eb',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.person.zoomInfoManagementLevel,
      position: 6,
      isVisible: true,
    },
    {
      universalIdentifier: '6876db64-96ee-4bbb-9885-7e4431c18b9f',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.company
          .universalIdentifier,
      position: 7,
      isVisible: true,
    },
    {
      universalIdentifier: 'ea81b053-14c0-4a9f-9a2c-436040df82cb',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.linkedinLink
          .universalIdentifier,
      position: 8,
      isVisible: true,
    },
    {
      universalIdentifier: 'b54c6b0f-962d-4881-a218-7957a151d0a1',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.person.zoomInfoContactAccuracyScore,
      position: 9,
      isVisible: true,
    },
    {
      universalIdentifier: '13e25536-39e0-4137-918d-b1c4e12f7717',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.person.zoomInfoPersonHasMoved,
      position: 10,
      isVisible: true,
    },
    {
      universalIdentifier: '86290632-5d1a-4f4f-8b2c-1ea4ea37f296',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.person.zoomInfoYearsOfExperience,
      position: 11,
      isVisible: true,
    },
    {
      universalIdentifier: '0f975d4a-9193-4ac1-abfc-7ce996fbcf58',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.person.zoomInfoPositionStartDate,
      position: 12,
      isVisible: true,
    },
    {
      universalIdentifier: '9fae6986-a989-4ddd-9472-94c0659fc8aa',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.person.zoomInfoLocation,
      position: 13,
      isVisible: true,
    },
    {
      universalIdentifier: 'e95a2087-7078-4a17-acce-e5560b657f20',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.person.zoomInfoMetroArea,
      position: 14,
      isVisible: true,
    },
    {
      universalIdentifier: 'df6b48f0-2084-418b-b402-46887199a7f2',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.person.zoomInfoWithinEu,
      position: 15,
      isVisible: true,
    },
    {
      universalIdentifier: '90c4fc98-118f-43d6-84ba-88bf638db772',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.person.zoomInfoWithinCalifornia,
      position: 16,
      isVisible: true,
    },
    {
      universalIdentifier: '7112a531-b127-44f8-9a66-761fa3987b29',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.person.zoomInfoWithinCanada,
      position: 17,
      isVisible: true,
    },
    {
      universalIdentifier: '4a51043c-5259-4732-92b6-a457b357c6f4',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.person.zoomInfoValidDate,
      position: 18,
      isVisible: true,
    },
    {
      universalIdentifier: '1efac77b-0b9c-4d40-b244-ed5e383fa0fc',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.person.zoomInfoLastUpdatedDate,
      position: 19,
      isVisible: true,
    },
    {
      universalIdentifier: '98c20041-f89d-487f-9564-6ee29333bf01',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.person.zoomInfoEnrichmentStatus,
      position: 20,
      isVisible: true,
    },
    {
      universalIdentifier: '5df875e9-5ed3-4e8a-9ceb-78c29e7b8bf6',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.person.zoomInfoMatchStatus,
      position: 21,
      isVisible: true,
    },
    {
      universalIdentifier: 'a9677559-7bed-461a-9447-3731156f7589',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.person.zoomInfoLastEnrichedAt,
      position: 22,
      isVisible: true,
    },
    {
      universalIdentifier: '3f476d0b-09ac-4d05-b0dc-aa3b122bf92d',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.person.zoomInfoTechSkills,
      position: 23,
      isVisible: true,
    },
    {
      universalIdentifier: '5906d316-e61d-47bd-aaf6-b15530837d32',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.person.zoomInfoEducation,
      position: 24,
      isVisible: true,
    },
    {
      universalIdentifier: '9e7bb141-8949-40be-b3bd-df9678aacf22',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.person.zoomInfoEmploymentHistory,
      position: 25,
      isVisible: true,
    },
    {
      universalIdentifier: '1ee4abc5-cef0-484e-b28c-9f8d6d2f1df4',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.person.zoomInfoExternalUrls,
      position: 26,
      isVisible: true,
    },
    {
      universalIdentifier: '2577f30b-822d-4e88-b56d-50fcfe503f93',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.person.zoomInfoContactId,
      position: 27,
      isVisible: true,
    },
    {
      universalIdentifier: '70ee4a92-544e-4344-9b31-f4f1ed11f999',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.person.zoomInfoCompanyId,
      position: 28,
      isVisible: true,
    },
    {
      universalIdentifier: '4fe97095-6515-4440-97a2-d5ea6210444f',
      fieldMetadataUniversalIdentifier:
        ZOOMINFO_FIELD_UNIVERSAL_IDENTIFIERS.person.zoomInfoRawPayload,
      position: 29,
      isVisible: true,
    },
  ],
});
