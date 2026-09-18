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
  universalIdentifier: COGNISM_VIEW_UNIVERSAL_IDENTIFIERS.enrichedPeople,
  name: 'Enriched (Cognism)',
  icon: 'IconSparkles',
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: ViewType.TABLE,
  fields: [
    {
      universalIdentifier: 'bf16efba-ae55-438c-842c-9f26919b4380',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.name
          .universalIdentifier,
      position: 0,
      isVisible: true,
    },
    {
      universalIdentifier: '8dcdd16d-02ff-4b7a-8608-12287401c2e5',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.jobTitle
          .universalIdentifier,
      position: 1,
      isVisible: true,
    },
    {
      universalIdentifier: '2228f188-a5c0-4421-80b5-dbc3029e7a07',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.company
          .universalIdentifier,
      position: 2,
      isVisible: true,
    },
    {
      universalIdentifier: '25f5856d-2bf4-4de0-8dc2-0afb9cf7a7be',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.person.cognismManagementLevel,
      position: 3,
      isVisible: true,
    },
    {
      universalIdentifier: '31b103de-631d-4332-8f52-773ebede8ed9',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.person.cognismJobFunction,
      position: 4,
      isVisible: true,
    },
    {
      universalIdentifier: '91896d30-315e-46d1-8463-1aedf9284521',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.emails
          .universalIdentifier,
      position: 5,
      isVisible: true,
    },
    {
      universalIdentifier: '29c24a5a-5a5a-42ac-8f60-7dcd130ac6bd',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.phones
          .universalIdentifier,
      position: 6,
      isVisible: true,
    },
    {
      universalIdentifier: '30864ce7-72ee-4f9c-ae74-15248d517b92',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.person.cognismEmailQuality,
      position: 7,
      isVisible: true,
    },
    {
      universalIdentifier: 'c394fafe-643c-42d4-8334-02a77b0ad841',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.linkedinLink
          .universalIdentifier,
      position: 8,
      isVisible: true,
    },
    {
      universalIdentifier: '9f7670b7-5bc0-4bd7-85a3-61171b63fb29',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.person.cognismLocation,
      position: 9,
      isVisible: true,
    },
    {
      universalIdentifier: '603fecaf-ae6b-4a0f-bbbd-207097dd5a63',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.person.cognismPositionStartDate,
      position: 10,
      isVisible: true,
    },
    {
      universalIdentifier: '922fa5c6-fca3-458e-bb3a-80824609e264',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.person.cognismSkills,
      position: 11,
      isVisible: true,
    },
    {
      universalIdentifier: 'd12cfabc-e65b-4b77-b903-56fcfa839f14',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.person.cognismEducation,
      position: 12,
      isVisible: true,
    },
    {
      universalIdentifier: '32108129-faf1-480b-a166-e337ebc1bb0f',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.person.cognismPreviousAccounts,
      position: 13,
      isVisible: true,
    },
    {
      universalIdentifier: 'd34090a0-3048-482a-9176-35435050e716',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.person.cognismPhoneNumbers,
      position: 14,
      isVisible: true,
    },
    {
      universalIdentifier: '9f07c3b4-fb85-4168-97a3-573b6943b44a',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.person.cognismJobJoinEvent,
      position: 15,
      isVisible: true,
    },
    {
      universalIdentifier: '1397c274-a17b-47dd-a38a-a1cd0f4fc13f',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.person.cognismJobLeaveEvent,
      position: 16,
      isVisible: true,
    },
    {
      universalIdentifier: '64353457-772c-4430-a118-7710b806e358',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.person
          .cognismPrivacyNotificationSent,
      position: 17,
      isVisible: true,
    },
    {
      universalIdentifier: 'e261063d-9406-4241-8caa-0294cc9dc76a',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.person.cognismEnrichmentStatus,
      position: 18,
      isVisible: true,
    },
    {
      universalIdentifier: '013f2787-44ee-45d9-b6af-4f4bbf6aaee2',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.person.cognismMatchScore,
      position: 19,
      isVisible: true,
    },
    {
      universalIdentifier: '80df35dc-fa97-406b-ae01-3c4de86af7f0',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.person.cognismLastConfirmed,
      position: 20,
      isVisible: true,
    },
    {
      universalIdentifier: '521fb612-7901-44fb-b1d6-bf81b85513e4',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.person.cognismLastEnrichedAt,
      position: 21,
      isVisible: true,
    },
    {
      universalIdentifier: 'f1816f84-7f25-42dd-8860-75866e1c0d46',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.person.cognismId,
      position: 22,
      isVisible: true,
    },
    {
      universalIdentifier: 'a227b62e-ac5b-4764-a7c3-90cb834c9125',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.person.cognismRedeemId,
      position: 23,
      isVisible: true,
    },
    {
      universalIdentifier: '7143a4ce-fa9d-4b2a-9a92-b5b24227f3b1',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields
          .pointOfContactForOpportunities.universalIdentifier,
      position: 24,
      isVisible: true,
    },
    {
      universalIdentifier: '939f3d75-7456-4bfa-9b49-7559844d78fa',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.noteTargets
          .universalIdentifier,
      position: 25,
      isVisible: true,
    },
    {
      universalIdentifier: 'dc7c51aa-82d9-4488-9e37-35d35ed02333',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.taskTargets
          .universalIdentifier,
      position: 26,
      isVisible: true,
    },
    {
      universalIdentifier: 'e9d2e7d7-7a1b-4b81-9bce-7e9dca912761',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.attachments
          .universalIdentifier,
      position: 27,
      isVisible: true,
    },
    {
      universalIdentifier: '674b66fc-29a9-406b-a337-c9298da5feb0',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.timelineActivities
          .universalIdentifier,
      position: 28,
      isVisible: true,
    },
    {
      universalIdentifier: '988c4dfe-8261-43bf-932e-4462b3175d72',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.createdBy
          .universalIdentifier,
      position: 29,
      isVisible: true,
    },
    {
      universalIdentifier: '4a7e9d87-7900-4b6f-a6fa-f24129dae095',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.updatedBy
          .universalIdentifier,
      position: 30,
      isVisible: true,
    },
    {
      universalIdentifier: '4c63f72f-7a34-4b8d-a814-b5f50b2ff7fd',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.createdAt
          .universalIdentifier,
      position: 31,
      isVisible: true,
    },
    {
      universalIdentifier: '331b7b88-e96c-45ab-aa17-1d4a99f8bc66',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.updatedAt
          .universalIdentifier,
      position: 32,
      isVisible: true,
    },
    {
      universalIdentifier: '9c51f6e0-dd1c-40b3-b162-7287f7bd5280',
      fieldMetadataUniversalIdentifier:
        COGNISM_FIELD_UNIVERSAL_IDENTIFIERS.person.cognismRawPayload,
      position: 33,
      isVisible: true,
    },
  ],
});
