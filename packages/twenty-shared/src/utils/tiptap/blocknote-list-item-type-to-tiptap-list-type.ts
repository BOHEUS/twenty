import { TIPTAP_NODE_TYPES } from './tiptap-node-types';

// TipTap has no toggle list, so toggle items keep their text as bullets.
export const BLOCKNOTE_LIST_ITEM_TYPE_TO_TIPTAP_LIST_TYPE = {
  bulletListItem: TIPTAP_NODE_TYPES.BULLET_LIST,
  toggleListItem: TIPTAP_NODE_TYPES.BULLET_LIST,
  numberedListItem: TIPTAP_NODE_TYPES.ORDERED_LIST,
  checkListItem: TIPTAP_NODE_TYPES.TASK_LIST,
} as const;
