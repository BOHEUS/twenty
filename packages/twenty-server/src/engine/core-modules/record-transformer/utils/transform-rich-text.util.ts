import { isNonEmptyString } from '@sniptt/guards';
import {
  type RichTextMetadata,
  richTextValueSchema,
} from 'twenty-shared/types';
import {
  isDefined,
  normalizeRichTextDocument,
  tipTapDocumentToMarkdown,
} from 'twenty-shared/utils';

import { sanitizeRichTextDocumentReferences } from 'src/engine/core-modules/record-transformer/utils/sanitize-rich-text-document-references.util';

// tiptap is the source of truth; markdown is regenerated on every write
// because search, AI tools and workflows read it. A markdown-only input is
// kept as sent and parsed into tiptap.
export const transformRichTextValue = (
  // oxlint-disable-next-line typescript/no-explicit-any
  richTextValue: any,
): RichTextMetadata => {
  const parsedValue = isNonEmptyString(richTextValue)
    ? richTextValueSchema.parse(richTextValue)
    : richTextValue;

  const normalizedDocument = isDefined(parsedValue)
    ? normalizeRichTextDocument({
        tiptap: parsedValue.tiptap,
        markdown: parsedValue.markdown,
      })
    : null;

  if (!isDefined(normalizedDocument)) {
    return { markdown: null, tiptap: null };
  }

  const document = sanitizeRichTextDocumentReferences(
    normalizedDocument.document,
  );

  return {
    tiptap: JSON.stringify(document),
    markdown:
      normalizedDocument.source === 'markdown'
        ? parsedValue.markdown
        : tipTapDocumentToMarkdown(document),
  };
};
