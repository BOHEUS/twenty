import { defineObject, FieldType } from 'twenty-sdk/define';

export const NAME_FIELD_UNIVERSAL_IDENTIFIER =
  '40eb8cd5-196f-4f79-bf10-cb07b48211d0';

export default defineObject({
  universalIdentifier: 'a50feafb-dd03-4848-8b17-53bbaed986c3',
  nameSingular: 'test1',
  namePlural: 'test11',
  labelSingular: 'Test 1',
  labelPlural: 'Test 11',
  icon: 'IconBox',
  labelIdentifierFieldMetadataUniversalIdentifier: NAME_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    {
      universalIdentifier: NAME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      description: 'Name of the test1',
      icon: 'IconAbc',
    },
  ],
});
