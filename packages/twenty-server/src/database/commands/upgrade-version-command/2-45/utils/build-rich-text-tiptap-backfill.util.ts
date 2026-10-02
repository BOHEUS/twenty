import { isNonEmptyString } from '@sniptt/guards';
import {
  isDefined,
  normalizeRichTextDocument,
  tipTapDocumentToMarkdown,
} from 'twenty-shared/utils';

export type RichTextTiptapBackfill =
  | { status: 'empty' }
  | {
      status: 'converted' | 'textFallback';
      tiptap: string;
      markdown: string | null;
    };

// markdown is only filled when missing, so down can restore the previous
// state by clearing tiptap alone.
export const buildRichTextTiptapBackfill = ({
  blocknote,
  markdown,
}: {
  blocknote: string | null;
  markdown: string | null;
}): RichTextTiptapBackfill => {
  const normalizedDocument = normalizeRichTextDocument({ blocknote, markdown });

  if (!isDefined(normalizedDocument)) {
    return { status: 'empty' };
  }

  const { document, fallbackCount } = normalizedDocument;

  return {
    status: fallbackCount > 0 ? 'textFallback' : 'converted',
    tiptap: JSON.stringify(document),
    markdown: isNonEmptyString(markdown)
      ? null
      : tipTapDocumentToMarkdown(document),
  };
};
