import { type TipTapDocument } from './tiptap-document';

export type RichTextConversionResult = {
  document: TipTapDocument;
  fallbackCount: number;
};
