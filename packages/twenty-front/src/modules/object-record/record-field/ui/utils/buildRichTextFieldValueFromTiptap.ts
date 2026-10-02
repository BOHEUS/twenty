import { type FieldRichTextValue } from '@/object-record/record-field/ui/types/FieldMetadata';
import {
  convertTipTapDocumentToBlockNote,
  isDefined,
  parseTipTapJsonDocument,
} from 'twenty-shared/utils';

// The server derives the same blocknote value on write; deriving it here
// keeps previews that still read blocknote right before the refetch.
export const buildRichTextFieldValueFromTiptap = (
  tiptap: string,
): FieldRichTextValue => {
  const document = parseTipTapJsonDocument(tiptap);

  return {
    tiptap,
    blocknote: isDefined(document)
      ? JSON.stringify(convertTipTapDocumentToBlockNote(document))
      : null,
    markdown: null,
  };
};
