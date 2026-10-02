import { type RichTextConversionResult } from './rich-text-conversion-result';

export type NormalizedRichTextDocument = RichTextConversionResult & {
  source: 'tiptap' | 'blocknote' | 'markdown';
};
