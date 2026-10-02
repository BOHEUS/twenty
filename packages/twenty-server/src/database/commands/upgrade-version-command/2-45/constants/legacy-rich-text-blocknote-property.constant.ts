import { type CompositeProperty, FieldMetadataType } from 'twenty-shared/types';

// The blocknote subfield left the RICH_TEXT composite type, but the 2.45
// commands still read and drop its column.
export const LEGACY_RICH_TEXT_BLOCKNOTE_PROPERTY: CompositeProperty = {
  name: 'blocknote',
  type: FieldMetadataType.TEXT,
  hidden: false,
  isRequired: false,
};
