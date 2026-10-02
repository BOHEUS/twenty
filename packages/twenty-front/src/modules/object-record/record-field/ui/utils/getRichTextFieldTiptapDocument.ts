import { type FieldRichTextValue } from '@/object-record/record-field/ui/types/FieldMetadata';
import {
  isDefined,
  normalizeRichTextDocument,
  type TipTapDocument,
} from 'twenty-shared/utils';

// Values written before the tiptap backfill only hold blocknote or markdown.
export const getRichTextFieldTiptapDocument = (
  fieldValue: Partial<FieldRichTextValue> | null | undefined,
): TipTapDocument | undefined =>
  isDefined(fieldValue)
    ? normalizeRichTextDocument(fieldValue)?.document
    : undefined;
