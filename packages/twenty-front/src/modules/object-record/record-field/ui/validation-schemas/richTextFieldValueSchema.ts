import { z } from 'zod';

import { type FieldRichTextValue } from '@/object-record/record-field/ui/types/FieldMetadata';

export const richTextFieldValueSchema = z.object({
  markdown: z.string().nullable(),
  tiptap: z.string().nullable().optional(),
}) satisfies z.ZodType<FieldRichTextValue>;
