import { isPlainObject, RICH_TEXT_DOCUMENT_LIMITS } from 'twenty-shared/utils';

import { type RichTextDocumentViolation } from 'src/engine/api/common/common-args-processors/data-arg-processor/types/rich-text-document-violation.type';
import { hasUnsafeUrlAttribute } from 'src/engine/api/common/common-args-processors/data-arg-processor/utils/has-unsafe-url-attribute.util';

// BlockNote is the deprecated input format, so only safety is enforced:
// size, and every URL-bearing key anywhere in the payload.
export const findBlockNoteDocumentViolation = (
  blocks: unknown,
): RichTextDocumentViolation | undefined => {
  if (!Array.isArray(blocks)) {
    return 'invalidShape';
  }

  const pendingValues: unknown[] = [blocks];
  let valueCount = 0;

  while (pendingValues.length > 0) {
    const value = pendingValues.pop();

    valueCount++;

    if (valueCount > RICH_TEXT_DOCUMENT_LIMITS.maxNodeCount) {
      return 'tooLarge';
    }

    if (Array.isArray(value)) {
      pendingValues.push(...value);
      continue;
    }

    if (!isPlainObject(value)) {
      continue;
    }

    if (hasUnsafeUrlAttribute(value)) {
      return 'unsafeUrl';
    }

    pendingValues.push(
      ...Object.values(value).filter(
        (child) => Array.isArray(child) || isPlainObject(child),
      ),
    );
  }

  return undefined;
};
