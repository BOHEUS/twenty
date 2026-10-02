import { z } from 'zod';
import { FieldMetadataType } from '../FieldMetadataType';
import { type CompositeType } from '../composite-types/composite-type.interface';

export const richTextCompositeType: CompositeType = {
  type: FieldMetadataType.RICH_TEXT,
  properties: [
    {
      name: 'markdown',
      type: FieldMetadataType.TEXT,
      hidden: false,
      isRequired: false,
    },
    {
      name: 'tiptap',
      description: 'TipTap JSON document, the source of truth for rich text.',
      type: FieldMetadataType.TEXT,
      hidden: false,
      isRequired: false,
    },
  ],
};

// with import only markdown subfield is filled, then tiptap is undefined
export const richTextValueSchema = z.object({
  markdown: z.string().nullable(),
  tiptap: z.string().nullable().optional(),
});

export type RichTextMetadata = z.infer<typeof richTextValueSchema>;
