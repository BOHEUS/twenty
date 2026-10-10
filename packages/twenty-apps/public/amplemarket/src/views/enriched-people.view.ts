import {
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewType,
  defineView,
} from 'twenty-sdk/define';

import {
  AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS,
  AMPLEMARKET_VIEW_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: AMPLEMARKET_VIEW_UNIVERSAL_IDENTIFIERS.enrichedPeople,
  name: 'Enriched (Amplemarket)',
  icon: 'IconSparkles',
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: ViewType.TABLE,
  fields: [
    {
      universalIdentifier: '9105296d-df3d-491d-a119-59436985210d',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.name
          .universalIdentifier,
      position: 0,
      isVisible: true,
    },
    {
      universalIdentifier: '627d4671-7160-4868-9bdb-08d5a9ef69be',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.jobTitle
          .universalIdentifier,
      position: 1,
      isVisible: true,
    },
    {
      universalIdentifier: '8e4d357d-f693-4011-9111-720a4290f52b',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.company
          .universalIdentifier,
      position: 2,
      isVisible: true,
    },
    {
      universalIdentifier: 'ef426a5f-3f35-4d96-9d2d-5aed7bdfa5fa',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.emails
          .universalIdentifier,
      position: 3,
      isVisible: true,
    },
    {
      universalIdentifier: '86dfea7d-f654-4692-8abc-9697197fb652',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.phones
          .universalIdentifier,
      position: 4,
      isVisible: true,
    },
    {
      universalIdentifier: '735f8475-f298-47c9-b2c2-0bb7631338ad',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.linkedinLink
          .universalIdentifier,
      position: 5,
      isVisible: true,
    },
    {
      universalIdentifier: 'f0430ef5-83e9-4355-8457-ff576b118eb9',
      fieldMetadataUniversalIdentifier:
        AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS.person.amplemarketHeadline,
      position: 6,
      isVisible: true,
    },
    {
      universalIdentifier: '2fdd2db1-6eab-4c93-97f9-819daf5200c0',
      fieldMetadataUniversalIdentifier:
        AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS.person.amplemarketLocation,
      position: 7,
      isVisible: true,
    },
    {
      universalIdentifier: 'da7a9e98-cf40-432d-a976-b289a9be4d7e',
      fieldMetadataUniversalIdentifier:
        AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS.person.amplemarketJobStartDate,
      position: 8,
      isVisible: true,
    },
    {
      universalIdentifier: 'ac59521f-9edb-4c01-9114-c9b2005f1a66',
      fieldMetadataUniversalIdentifier:
        AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS.person
          .amplemarketEnrichmentStatus,
      position: 9,
      isVisible: true,
    },
    {
      universalIdentifier: '9843be38-72ed-4a2a-8178-4a7583ed304e',
      fieldMetadataUniversalIdentifier:
        AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS.person
          .amplemarketLastEnrichedAt,
      position: 10,
      isVisible: true,
    },
    {
      universalIdentifier: '62ff61e4-d208-41af-bf0c-8fe08fd5055a',
      fieldMetadataUniversalIdentifier:
        AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS.person.amplemarketExperiences,
      position: 11,
      isVisible: true,
    },
    {
      universalIdentifier: 'd9ec4e53-e09f-443e-8582-75b0927d6a0b',
      fieldMetadataUniversalIdentifier:
        AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS.person.amplemarketEducations,
      position: 12,
      isVisible: true,
    },
    {
      universalIdentifier: '06ee2284-a385-41b2-a885-86dddc993d5c',
      fieldMetadataUniversalIdentifier:
        AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS.person.amplemarketPhoneDetails,
      position: 13,
      isVisible: true,
    },
    {
      universalIdentifier: 'a5a75954-5a0a-42b0-95d0-0340791d5b16',
      fieldMetadataUniversalIdentifier:
        AMPLEMARKET_FIELD_UNIVERSAL_IDENTIFIERS.person.amplemarketRawPayload,
      position: 14,
      isVisible: true,
    },
  ],
});
