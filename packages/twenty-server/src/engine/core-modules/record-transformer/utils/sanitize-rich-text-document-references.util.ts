import { isNonEmptyString } from '@sniptt/guards';
import { FileFolder } from 'twenty-shared/types';
import {
  isDefined,
  TIPTAP_NODE_TYPES,
  type TipTapDocument,
  type TipTapNode,
} from 'twenty-shared/utils';

import { getTipTapNodeFileUrlAttributeName } from 'src/engine/core-modules/record-transformer/utils/get-tiptap-node-file-url-attribute-name.util';
import { extractFileIdFromUrl } from 'src/engine/core-modules/file/files-field/utils/extract-file-id-from-url.util';

// Signed tokens expire, so stored documents keep the bare file URL and are
// signed again on read.
const stripFileUrlToken = (url: unknown): unknown => {
  if (
    !isNonEmptyString(url) ||
    !isDefined(extractFileIdFromUrl(url, FileFolder.FilesField))
  ) {
    return url;
  }

  const parsedUrl = new URL(url);

  return `${parsedUrl.origin}${parsedUrl.pathname}`;
};

const sanitizeNode = (node: TipTapNode): TipTapNode => {
  const fileUrlAttributeName = getTipTapNodeFileUrlAttributeName(node);

  let attrs = node.attrs;

  if (isDefined(fileUrlAttributeName) && isDefined(attrs)) {
    attrs = {
      ...attrs,
      [fileUrlAttributeName]: stripFileUrlToken(attrs[fileUrlAttributeName]),
    };
  }

  // Mentions keep ids only: labels are resolved by each viewer under their
  // own permissions, so a stored label cannot leak a restricted record.
  if (node.type === TIPTAP_NODE_TYPES.MENTION_TAG && isDefined(attrs)) {
    const { label: _label, imageUrl: _imageUrl, ...mentionAttrs } = attrs;

    attrs = mentionAttrs;
  }

  return {
    ...node,
    ...(isDefined(attrs) ? { attrs } : {}),
    ...(isDefined(node.content)
      ? { content: node.content.map(sanitizeNode) }
      : {}),
  };
};

// Documents are depth-limited on write, so recursion is bounded.
export const sanitizeRichTextDocumentReferences = (
  document: TipTapDocument,
): TipTapDocument => ({
  ...sanitizeNode(document),
  type: document.type,
});
