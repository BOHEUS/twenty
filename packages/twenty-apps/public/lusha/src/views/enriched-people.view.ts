import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewSortDirection,
  ViewType,
} from 'twenty-sdk/define';

import {
  LUSHA_FIELD_UNIVERSAL_IDENTIFIERS,
  LUSHA_VIEW_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: LUSHA_VIEW_UNIVERSAL_IDENTIFIERS.people,
  name: 'Enriched with Lusha',
  icon: 'IconTable',
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: ViewType.TABLE,
  fields: [
    {
      universalIdentifier: '89627e75-bfd2-4035-90d4-40193caa0fdd',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.name
          .universalIdentifier,
      position: 0,
      isVisible: true,
    },
    {
      universalIdentifier: 'b19bb273-03ab-4225-9b89-284265bf2540',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.jobTitle
          .universalIdentifier,
      position: 1,
      isVisible: true,
    },
    {
      universalIdentifier: '6a57d6ab-579f-4005-9768-0d25e2c75919',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.company
          .universalIdentifier,
      position: 2,
      isVisible: true,
    },
    {
      universalIdentifier: 'b15da125-79c2-4282-bfd3-3baae7b00f00',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.person.lushaSeniority,
      position: 3,
      isVisible: true,
    },
    {
      universalIdentifier: '7799e400-e444-441c-a5da-eef4f1a8594f',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.person.lushaDepartments,
      position: 4,
      isVisible: true,
    },
    {
      universalIdentifier: '8ce48c22-42f8-4479-91d9-936b23b7ff0b',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.emails
          .universalIdentifier,
      position: 5,
      isVisible: true,
    },
    {
      universalIdentifier: '563a2a10-3480-40a5-bd5f-969e3c31c46d',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.person.lushaEmailConfidence,
      position: 6,
      isVisible: true,
    },
    {
      universalIdentifier: '928cd0eb-5db7-43a9-8603-2cb335005041',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.phones
          .universalIdentifier,
      position: 7,
      isVisible: true,
    },
    {
      universalIdentifier: '5ab20cbb-82ce-4b07-acd4-da6e0a2c94b7',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.person.lushaDoNotCall,
      position: 8,
      isVisible: true,
    },
    {
      universalIdentifier: 'de7aa666-d479-40e2-acc8-ec19b3a9069b',
      fieldMetadataUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.fields.linkedinLink
          .universalIdentifier,
      position: 9,
      isVisible: true,
    },
    {
      universalIdentifier: 'b809cbfe-3ccb-4405-8120-714a5ae24639',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.person.lushaXLink,
      position: 10,
      isVisible: true,
    },
    {
      universalIdentifier: '1d24b010-ffb9-4a55-b3ca-9d77e18c8210',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.person.lushaLocation,
      position: 11,
      isVisible: true,
    },
    {
      universalIdentifier: '3a9c0ff8-5c83-4684-932e-1d5daca419f7',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.person.lushaIsEuContact,
      position: 12,
      isVisible: true,
    },
    {
      universalIdentifier: '2a9e27f6-bf92-4d04-98bb-9b4ca87952ae',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.person.lushaEnrichmentStatus,
      position: 13,
      isVisible: true,
    },
    {
      universalIdentifier: '556d3404-3b38-4c35-aa18-399ed2420cca',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.person.lushaLastEnrichedAt,
      position: 14,
      isVisible: true,
    },
    {
      universalIdentifier: 'f23037e8-2241-4a5b-ba0a-f69881d9da5c',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.person.lushaDataUpdatedAt,
      position: 15,
      isVisible: true,
    },
    {
      universalIdentifier: '868d3466-3012-40f6-a210-5ef49c39063c',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.person.lushaPreviousEmployment,
      position: 16,
      isVisible: true,
    },
    {
      universalIdentifier: '2097f8ed-1de3-42a3-a0eb-cbdf697e352a',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.person.lushaId,
      position: 17,
      isVisible: true,
    },
  ],
  filters: [
    {
      universalIdentifier: '42bebc83-00b1-41e5-83fe-feea74a902ab',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.person.lushaLastEnrichedAt,
      operand: ViewFilterOperand.IS_NOT_EMPTY,
      value: '',
    },
  ],
  sorts: [
    {
      universalIdentifier: '536ab80b-3cbe-4208-8a6f-7d998b9ad5f8',
      fieldMetadataUniversalIdentifier:
        LUSHA_FIELD_UNIVERSAL_IDENTIFIERS.person.lushaLastEnrichedAt,
      direction: ViewSortDirection.DESC,
    },
  ],
});
