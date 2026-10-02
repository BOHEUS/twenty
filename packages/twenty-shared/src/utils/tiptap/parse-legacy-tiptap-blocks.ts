import { isDefined } from '@/utils/validation';

import { isTipTapDocument, isTipTapNode } from './parse-tiptap-json-document';
import { type TipTapDocument } from './tiptap-document';
import { type TipTapNode } from './tiptap-node';
import { TIPTAP_NODE_TYPES } from './tiptap-node-types';

const TIPTAP_ONLY_NODE_TYPES: string[] = [
  TIPTAP_NODE_TYPES.DOCUMENT,
  TIPTAP_NODE_TYPES.BULLET_LIST,
  TIPTAP_NODE_TYPES.ORDERED_LIST,
  TIPTAP_NODE_TYPES.LIST_ITEM,
  TIPTAP_NODE_TYPES.TASK_LIST,
  TIPTAP_NODE_TYPES.TASK_ITEM,
  TIPTAP_NODE_TYPES.SECTION,
  TIPTAP_NODE_TYPES.COLUMNS,
  TIPTAP_NODE_TYPES.COLUMN,
  TIPTAP_NODE_TYPES.BUTTON,
  TIPTAP_NODE_TYPES.DIVIDER,
  TIPTAP_NODE_TYPES.HTML,
  TIPTAP_NODE_TYPES.HARD_BREAK,
  TIPTAP_NODE_TYPES.VARIABLE_TAG,
  TIPTAP_NODE_TYPES.MENTION_TAG,
  TIPTAP_NODE_TYPES.SKILL_TAG,
];

const containsTipTapOnlyContent = (node: TipTapNode): boolean =>
  TIPTAP_ONLY_NODE_TYPES.includes(node.type) ||
  isDefined(node.attrs) ||
  isDefined(node.marks) ||
  (node.content ?? []).some(containsTipTapOnlyContent);

// Workflow rich text inputs used to store TipTap nodes in the blocknote
// subfield. A bare paragraph is valid in both formats, so only content that
// BlockNote cannot express identifies TipTap.
export const parseLegacyTipTapBlocks = (
  serializedBlocks: string,
): TipTapDocument | undefined => {
  let parsedBlocks: unknown;

  try {
    parsedBlocks = JSON.parse(serializedBlocks);
  } catch {
    return undefined;
  }

  const nodes = Array.isArray(parsedBlocks) ? parsedBlocks : [parsedBlocks];

  if (!nodes.every(isTipTapNode) || !nodes.some(containsTipTapOnlyContent)) {
    return undefined;
  }

  const [firstNode] = nodes;

  return nodes.length === 1 && isTipTapDocument(firstNode)
    ? firstNode
    : { type: TIPTAP_NODE_TYPES.DOCUMENT, content: nodes };
};
