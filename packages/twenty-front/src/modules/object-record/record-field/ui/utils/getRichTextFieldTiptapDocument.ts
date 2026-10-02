import { type FieldRichTextValue } from '@/object-record/record-field/ui/types/FieldMetadata';
import {
  isDefined,
  normalizeRichTextDocument,
  type TipTapDocument,
} from 'twenty-shared/utils';

// Values stored as markdown only, such as application variables written by
// apps, have no tiptap document yet.
export const getRichTextFieldTiptapDocument = (
  fieldValue: Partial<FieldRichTextValue> | null | undefined,
): TipTapDocument | undefined =>
  isDefined(fieldValue)
    ? normalizeRichTextDocument(fieldValue)?.document
    : undefined;
