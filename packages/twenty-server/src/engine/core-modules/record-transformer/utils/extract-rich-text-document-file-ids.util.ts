import { isNonEmptyString } from '@sniptt/guards';
import { FileFolder } from 'twenty-shared/types';
import {
  isDefined,
  type TipTapDocument,
  type TipTapNode,
} from 'twenty-shared/utils';

import { getTipTapNodeFileUrlAttributeName } from 'src/engine/core-modules/record-transformer/utils/get-tiptap-node-file-url-attribute-name.util';
import { extractFileIdFromUrl } from 'src/engine/core-modules/file/files-field/utils/extract-file-id-from-url.util';

const collectFileIds = (node: TipTapNode, fileIds: Set<string>) => {
  const fileUrlAttributeName = getTipTapNodeFileUrlAttributeName(node);
  const url = isDefined(fileUrlAttributeName)
    ? node.attrs?.[fileUrlAttributeName]
    : undefined;

  if (isNonEmptyString(url)) {
    const fileId = extractFileIdFromUrl(url, FileFolder.FilesField);

    if (isDefined(fileId)) {
      fileIds.add(fileId);
    }
  }

  for (const child of node.content ?? []) {
    collectFileIds(child, fileIds);
  }
};

export const extractRichTextDocumentFileIds = (
  document: TipTapDocument,
): string[] => {
  const fileIds = new Set<string>();

  collectFileIds(document, fileIds);

  return [...fileIds];
};
