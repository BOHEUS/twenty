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
  universalIdentifier: HUNTER_VIEW_UNIVERSAL_IDENTIFIERS.enrichedPeople,
  name: 'Enriched (Hunter)',
  icon: 'IconSparkles',
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: ViewType.TABLE,
  fields: [
    {
      universalIdentifier: '901a8cd2-ec1f-4a02-94b1-64d874d0dec7',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.name
          .universalIdentifier,
      position: 0,
      isVisible: true,
    },
    {
      universalIdentifier: '3d712054-416d-4cd3-9267-1d037b2b5b16',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.jobTitle
          .universalIdentifier,
      position: 1,
      isVisible: true,
    },
    {
      universalIdentifier: 'b36941d0-c938-4ef5-b652-47b17d391258',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.company
          .universalIdentifier,
      position: 2,
      isVisible: true,
    },
    {
      universalIdentifier: '0afefaf7-e845-4409-a906-78fb92cd6a25',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.emails
          .universalIdentifier,
      position: 3,
      isVisible: true,
    },
    {
      universalIdentifier: '6925f801-622a-4828-85d2-91be25be6d96',
      fieldMetadataUniversalIdentifier:
        HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.person.hunterFoundEmail,
      position: 4,
      isVisible: true,
    },
    {
      universalIdentifier: '07498819-f7d0-4d4d-8204-f7b42a6bb1d5',
      fieldMetadataUniversalIdentifier:
        HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.person.hunterEmailStatus,
      position: 5,
      isVisible: true,
    },
    {
      universalIdentifier: '9e5a6238-cae7-4fce-8e40-226a371efc92',
      fieldMetadataUniversalIdentifier:
        HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.person.hunterEmailScore,
      position: 6,
      isVisible: true,
    },
    {
      universalIdentifier: '313ab83f-494e-4c00-8a61-9dca12c5e6b7',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.phones
          .universalIdentifier,
      position: 7,
      isVisible: true,
    },
    {
      universalIdentifier: '27a39653-eeb9-4461-8361-b9f80b67d63b',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.linkedinLink
          .universalIdentifier,
      position: 8,
      isVisible: true,
    },
    {
      universalIdentifier: '891c3743-f2a0-4139-82f1-3306606ec909',
      fieldMetadataUniversalIdentifier:
        HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.person.hunterLocation,
      position: 9,
      isVisible: true,
    },
    {
      universalIdentifier: '5c34786d-8f2c-4a75-8bfb-0ffc883e9dc5',
      fieldMetadataUniversalIdentifier:
        HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.person.hunterRole,
      position: 10,
      isVisible: true,
    },
    {
      universalIdentifier: '8e807607-074a-4446-b5d1-bda612b49bb2',
      fieldMetadataUniversalIdentifier:
        HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.person.hunterSeniority,
      position: 11,
      isVisible: true,
    },
    {
      universalIdentifier: '39a98bc1-3b5c-4a8b-b11b-119da2979d24',
      fieldMetadataUniversalIdentifier:
        HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.person.hunterXLink,
      position: 12,
      isVisible: true,
    },
    {
      universalIdentifier: '3224e757-df1c-498b-87a7-d9c0b0af882f',
      fieldMetadataUniversalIdentifier:
        HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.person.hunterGithubLink,
      position: 13,
      isVisible: true,
    },
    {
      universalIdentifier: '278bbe88-dc93-4fe9-a7a9-f0ab225e21c8',
      fieldMetadataUniversalIdentifier:
        HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.person.hunterEnrichmentStatus,
      position: 14,
      isVisible: true,
    },
    {
      universalIdentifier: '391f7b81-c042-4032-b26a-a2fb1a606246',
      fieldMetadataUniversalIdentifier:
        HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.person.hunterLastEnrichedAt,
      position: 15,
      isVisible: true,
    },
    {
      universalIdentifier: '75aaf7b8-71e2-44cf-b2c5-c8aece020ce1',
      fieldMetadataUniversalIdentifier:
        HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.person.hunterBio,
      position: 16,
      isVisible: true,
    },
    {
      universalIdentifier: 'e35f4fb8-8a15-48c3-9228-fb3f895abe1e',
      fieldMetadataUniversalIdentifier:
        HUNTER_FIELD_UNIVERSAL_IDENTIFIERS.person.hunterRawPayload,
      position: 17,
      isVisible: true,
    },
  ],
});
