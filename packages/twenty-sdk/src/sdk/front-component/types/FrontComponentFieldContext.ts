import { type FieldMetadataType } from 'twenty-shared/types';

export type FrontComponentFieldContext = {
  objectNameSingular: string;
  recordId: string;
  fieldName: string;
  fieldType: `${FieldMetadataType}`;
  /** The whole stored field value (phones, emails or links composite) */
  value: unknown;
  /** The single entry the user clicked, when the command was opened from one (a phone number, an email or a URL) */
  clickedValue?: string;
};
