import { isDefined } from '@/utils/validation/isDefined';

import { parseLegacyTipTapBlocks } from './parse-legacy-tiptap-blocks';
import { tipTapDocumentToMarkdown } from './tiptap-document-to-markdown';

export const convertTipTapBlocksToMarkdown = (
  serializedBlocks: string,
): string | undefined => {
  const document = parseLegacyTipTapBlocks(serializedBlocks);

  return isDefined(document) ? tipTapDocumentToMarkdown(document) : undefined;
};
