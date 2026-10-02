import { TIPTAP_NODE_TYPES, type TipTapNode } from 'twenty-shared/utils';

export const getTipTapNodeFileUrlAttributeName = (
  node: TipTapNode,
): 'src' | 'url' | undefined => {
  switch (node.type) {
    case TIPTAP_NODE_TYPES.IMAGE:
      return 'src';
    case TIPTAP_NODE_TYPES.FILE:
      return 'url';
    default:
      return undefined;
  }
};
