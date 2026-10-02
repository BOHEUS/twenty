import { isDefined } from '@/utils/validation/isDefined';
import { isNonEmptyString } from '@sniptt/guards';

import { convertBlockNoteToTipTapDocument } from './convert-blocknote-to-tiptap-document';
import { convertMarkdownToTipTapDocument } from './convert-markdown-to-tiptap-document';
import { type NormalizedRichTextDocument } from './normalized-rich-text-document';
import { parseLegacyTipTapBlocks } from './parse-legacy-tiptap-blocks';
import { parseTipTapJsonDocument } from './parse-tiptap-json-document';
import { type RichTextConversionResult } from './rich-text-conversion-result';

type RichTextDocumentInput = {
  tiptap?: string | null;
  blocknote?: string | null;
  markdown?: string | null;
};

const parseJson = (value: string): unknown => {
  try {
    return JSON.parse(value) ?? undefined;
  } catch {
    return undefined;
  }
};

const normalizeBlockNoteValue = (
  blocknote: string,
): RichTextConversionResult | undefined => {
  const legacyTipTapDocument = parseLegacyTipTapBlocks(blocknote);

  if (isDefined(legacyTipTapDocument)) {
    return { document: legacyTipTapDocument, fallbackCount: 0 };
  }

  const blocks = parseJson(blocknote);

  return Array.isArray(blocks)
    ? convertBlockNoteToTipTapDocument(blocks)
    : undefined;
};

// Picks the richest stored representation: the TipTap subfield, then the
// legacy BlockNote value, then markdown.
export const normalizeRichTextDocument = ({
  tiptap,
  blocknote,
  markdown,
}: RichTextDocumentInput): NormalizedRichTextDocument | null => {
  if (isNonEmptyString(tiptap)) {
    const document = parseTipTapJsonDocument(tiptap);

    if (isDefined(document)) {
      return { document, fallbackCount: 0, source: 'tiptap' };
    }
  }

  if (isNonEmptyString(blocknote)) {
    const result = normalizeBlockNoteValue(blocknote);

    if (isDefined(result)) {
      return { ...result, source: 'blocknote' };
    }
  }

  if (isNonEmptyString(markdown)) {
    return {
      document: convertMarkdownToTipTapDocument(markdown),
      fallbackCount: 0,
      source: 'markdown',
    };
  }

  // Legacy values that are not JSON were served as plain text, so keep them
  // as text. JSON of any other shape holds no displayable content.
  if (isNonEmptyString(blocknote) && !isDefined(parseJson(blocknote))) {
    return {
      document: convertMarkdownToTipTapDocument(blocknote),
      fallbackCount: 1,
      source: 'blocknote',
    };
  }

  return null;
};
