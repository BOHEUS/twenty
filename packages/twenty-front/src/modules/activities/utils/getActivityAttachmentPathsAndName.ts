import { isNonEmptyString } from '@sniptt/guards';
import {
  isDefined,
  parseTipTapJsonDocument,
  TIPTAP_NODE_TYPES,
  type TipTapNode,
} from 'twenty-shared/utils';

export type AttachmentInfo = {
  path: string;
  name: string;
};

const collectAttachments = (node: TipTapNode): AttachmentInfo[] => {
  const path =
    node.type === TIPTAP_NODE_TYPES.IMAGE
      ? node.attrs?.src
      : node.type === TIPTAP_NODE_TYPES.FILE
        ? node.attrs?.url
        : undefined;
  const name =
    node.type === TIPTAP_NODE_TYPES.IMAGE
      ? node.attrs?.title
      : node.attrs?.name;

  return [
    ...(isNonEmptyString(path)
      ? [{ path, name: isNonEmptyString(name) ? name : '' }]
      : []),
    ...(node.content ?? []).flatMap(collectAttachments),
  ];
};

export const getActivityAttachmentPathsAndName = (
  serializedTipTapDocument: string,
): AttachmentInfo[] => {
  const document = parseTipTapJsonDocument(serializedTipTapDocument);

  return isDefined(document) ? collectAttachments(document) : [];
};
