import { isString } from '@sniptt/guards';
import {
  isDefined,
  isPlainObject,
  RECORD_RICH_TEXT_MARK_TYPES,
  RECORD_RICH_TEXT_NODE_TYPES,
  RICH_TEXT_DOCUMENT_LIMITS,
} from 'twenty-shared/utils';

import { type RichTextDocumentViolation } from 'src/engine/api/common/common-args-processors/data-arg-processor/types/rich-text-document-violation.type';
import { hasUnsafeUrlAttribute } from 'src/engine/api/common/common-args-processors/data-arg-processor/utils/has-unsafe-url-attribute.util';

const findMarkViolation = (
  marks: unknown,
): RichTextDocumentViolation | undefined => {
  if (!isDefined(marks)) {
    return undefined;
  }

  if (!Array.isArray(marks)) {
    return 'invalidShape';
  }

  for (const mark of marks) {
    if (!isPlainObject(mark) || !isString(mark.type)) {
      return 'invalidShape';
    }

    if (!RECORD_RICH_TEXT_MARK_TYPES.includes(mark.type)) {
      return 'unsupportedMark';
    }

    if (isDefined(mark.attrs) && !isPlainObject(mark.attrs)) {
      return 'invalidShape';
    }

    if (isPlainObject(mark.attrs) && hasUnsafeUrlAttribute(mark.attrs)) {
      return 'unsafeUrl';
    }
  }

  return undefined;
};

// Iterative so a hostile, deeply nested payload cannot overflow the stack.
export const findTipTapDocumentViolation = (
  document: unknown,
): RichTextDocumentViolation | undefined => {
  if (!isPlainObject(document) || document.type !== 'doc') {
    return 'invalidShape';
  }

  const pendingNodes: { node: unknown; depth: number }[] = [
    { node: document, depth: 1 },
  ];
  let nodeCount = 0;

  while (pendingNodes.length > 0) {
    const pendingNode = pendingNodes.pop();

    if (!isDefined(pendingNode)) {
      break;
    }

    const { node, depth } = pendingNode;

    nodeCount++;

    if (nodeCount > RICH_TEXT_DOCUMENT_LIMITS.maxNodeCount) {
      return 'tooLarge';
    }

    if (depth > RICH_TEXT_DOCUMENT_LIMITS.maxTipTapDepth) {
      return 'tooDeep';
    }

    if (!isPlainObject(node) || !isString(node.type)) {
      return 'invalidShape';
    }

    if (!RECORD_RICH_TEXT_NODE_TYPES.includes(node.type)) {
      return 'unsupportedNode';
    }

    if (isDefined(node.text) && !isString(node.text)) {
      return 'invalidShape';
    }

    if (isDefined(node.attrs) && !isPlainObject(node.attrs)) {
      return 'invalidShape';
    }

    if (isPlainObject(node.attrs) && hasUnsafeUrlAttribute(node.attrs)) {
      return 'unsafeUrl';
    }

    const markViolation = findMarkViolation(node.marks);

    if (isDefined(markViolation)) {
      return markViolation;
    }

    if (!isDefined(node.content)) {
      continue;
    }

    if (!Array.isArray(node.content)) {
      return 'invalidShape';
    }

    for (const child of node.content) {
      pendingNodes.push({ node: child, depth: depth + 1 });
    }
  }

  return undefined;
};
