import { FieldMetadataType } from 'twenty-shared/types';

export const FIELD_VALUE_COMMAND_MENU_ITEM_FIELD_TYPES = [
  FieldMetadataType.PHONES,
  FieldMetadataType.EMAILS,
  FieldMetadataType.LINKS,
] as const satisfies FieldMetadataType[];
