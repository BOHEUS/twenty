import { getRichTextPreviewLines } from '@/activities/utils/getRichTextPreviewLines';
import { type FieldRichTextValue } from '@/object-record/record-field/ui/types/FieldMetadata';

export const getActivitySummary = (
  activityBody: Partial<FieldRichTextValue> | null | undefined,
): string => getRichTextPreviewLines(activityBody)[0] ?? '';
