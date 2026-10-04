import { FieldMetadataType } from '@/types';

export const FIELD_VALUE_COMMAND_MENU_ITEM_FIELD_TYPES = [
  FieldMetadataType.PHONES,
  FieldMetadataType.EMAILS,
  FieldMetadataType.LINKS,
] as const satisfies FieldMetadataType[];

export type FieldValueCommandMenuItemFieldType =
  (typeof FIELD_VALUE_COMMAND_MENU_ITEM_FIELD_TYPES)[number];
