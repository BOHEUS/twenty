import {
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewType,
  defineView,
} from 'twenty-sdk/define';

import {
  DROPCONTACT_FIELD_UNIVERSAL_IDENTIFIERS,
  DROPCONTACT_VIEW_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: DROPCONTACT_VIEW_UNIVERSAL_IDENTIFIERS.enrichedPeople,
  name: 'Enriched (Dropcontact)',
  icon: 'IconSparkles',
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: ViewType.TABLE,
  fields: [
    {
      universalIdentifier: 'c07f0d79-255f-4707-929e-7bca45912a4d',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.name
          .universalIdentifier,
      position: 0,
      isVisible: true,
    },
    {
      universalIdentifier: 'a1486837-a674-461c-a691-d6e49efc8ac6',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.jobTitle
          .universalIdentifier,
      position: 1,
      isVisible: true,
    },
    {
      universalIdentifier: '579c1696-047e-45ed-8e1a-42307627205e',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.company
          .universalIdentifier,
      position: 2,
      isVisible: true,
    },
    {
      universalIdentifier: 'fd8a541a-4142-4755-8f12-3a4b568ec8f3',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.emails
          .universalIdentifier,
      position: 3,
      isVisible: true,
    },
    {
      universalIdentifier: '4643d3e9-4d4d-4f68-98bd-ec0ae3b5dc1c',
      fieldMetadataUniversalIdentifier:
        DROPCONTACT_FIELD_UNIVERSAL_IDENTIFIERS.person
          .dropcontactEmailQualification,
      position: 4,
      isVisible: true,
    },
    {
      universalIdentifier: '4040146e-228c-4174-afb7-ebee447cb99c',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.phones
          .universalIdentifier,
      position: 5,
      isVisible: true,
    },
    {
      universalIdentifier: '4183f3fe-11c4-4732-8893-b64c0b706667',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.linkedinLink
          .universalIdentifier,
      position: 6,
      isVisible: true,
    },
    {
      universalIdentifier: 'cf4044b8-5195-4836-adbd-8e3255e9f98b',
      fieldMetadataUniversalIdentifier:
        DROPCONTACT_FIELD_UNIVERSAL_IDENTIFIERS.person.dropcontactCivility,
      position: 7,
      isVisible: true,
    },
    {
      universalIdentifier: '83d39287-ad47-4c7a-bbee-f1856ed9c960',
      fieldMetadataUniversalIdentifier:
        DROPCONTACT_FIELD_UNIVERSAL_IDENTIFIERS.person.dropcontactJobLevel,
      position: 8,
      isVisible: true,
    },
    {
      universalIdentifier: 'b9acdb78-e360-4d66-87fc-c2d6572edbe4',
      fieldMetadataUniversalIdentifier:
        DROPCONTACT_FIELD_UNIVERSAL_IDENTIFIERS.person.dropcontactJobFunction,
      position: 9,
      isVisible: true,
    },
    {
      universalIdentifier: '4c7a9082-81d7-4f9b-a673-6e61829e86f5',
      fieldMetadataUniversalIdentifier:
        DROPCONTACT_FIELD_UNIVERSAL_IDENTIFIERS.person.dropcontactCountry,
      position: 10,
      isVisible: true,
    },
    {
      universalIdentifier: '0dc2ff9a-99d5-412b-a3e3-58a2180dc255',
      fieldMetadataUniversalIdentifier:
        DROPCONTACT_FIELD_UNIVERSAL_IDENTIFIERS.person
          .dropcontactEnrichmentStatus,
      position: 11,
      isVisible: true,
    },
    {
      universalIdentifier: 'a0ec9deb-d1ae-48e1-9d1e-2021cc4e00ca',
      fieldMetadataUniversalIdentifier:
        DROPCONTACT_FIELD_UNIVERSAL_IDENTIFIERS.person
          .dropcontactLastEnrichedAt,
      position: 12,
      isVisible: true,
    },
    {
      universalIdentifier: 'fd573bf3-7592-440b-9733-faf82d557c17',
      fieldMetadataUniversalIdentifier:
        DROPCONTACT_FIELD_UNIVERSAL_IDENTIFIERS.person.dropcontactRawPayload,
      position: 13,
      isVisible: true,
    },
  ],
});
