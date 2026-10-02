import { isNonEmptyString } from '@sniptt/guards';
import {
  type RichTextMetadata,
  richTextValueSchema,
} from 'twenty-shared/types';
import {
  convertTipTapDocumentToBlockNote,
  isDefined,
  normalizeRichTextDocument,
  parseLegacyTipTapBlocks,
  tipTapDocumentToMarkdown,
} from 'twenty-shared/utils';

// Until the blocknote subfield is removed, every write stores all three
// formats so readers on either editor see the same content. A TipTap input
// wins; a genuine BlockNote input is kept as sent so the BlockNote editor
// does not see its own blocks rewritten.
export const transformRichTextValue = (
  // oxlint-disable-next-line typescript/no-explicit-any
  richTextValue: any,
): RichTextMetadata => {
  const parsedValue = isNonEmptyString(richTextValue)
    ? richTextValueSchema.parse(richTextValue)
    : richTextValue;

  const normalizedDocument = normalizeRichTextDocument(parsedValue);

  if (!isDefined(normalizedDocument)) {
    return { blocknote: null, markdown: null, tiptap: null };
  }

  const { document, source } = normalizedDocument;

  const isGenuineBlockNoteInput =
    source === 'blocknote' &&
    !isDefined(parseLegacyTipTapBlocks(parsedValue.blocknote));

  return {
    tiptap: JSON.stringify(document),
    blocknote: isGenuineBlockNoteInput
      ? parsedValue.blocknote
      : JSON.stringify(convertTipTapDocumentToBlockNote(document)),
    markdown:
      source === 'markdown'
        ? parsedValue.markdown
        : tipTapDocumentToMarkdown(document),
  };
};
