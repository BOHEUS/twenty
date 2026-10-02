import { getRichTextFieldTiptapDocument } from '@/object-record/record-field/ui/utils/getRichTextFieldTiptapDocument';
import { type FieldRichTextValue } from '@/object-record/record-field/ui/types/FieldMetadata';
import { extractPlainText } from 'twenty-shared/utils';
import { isNonEmptyString } from '@sniptt/guards';

export const getRichTextPreviewLines = (
  richTextValue: Partial<FieldRichTextValue> | null | undefined,
): string[] =>
  (getRichTextFieldTiptapDocument(richTextValue)?.content ?? [])
    .map(extractPlainText)
    .filter(isNonEmptyString);
