import { isString } from '@sniptt/guards';
import { isPlainObject } from '@/utils/typeguard/isPlainObject';

import { RICH_TEXT_DOCUMENT_LIMITS } from './rich-text-document-limits';

// Iterative so arbitrarily nested legacy content cannot overflow the stack.
export const extractPlainText = (value: unknown): string => {
  const texts: string[] = [];
  const pendingValues: unknown[] = [value];
  let visitedCount = 0;

  while (
    pendingValues.length > 0 &&
    visitedCount < RICH_TEXT_DOCUMENT_LIMITS.maxNodeCount
  ) {
    const currentValue = pendingValues.pop();

    visitedCount++;

    if (isString(currentValue)) {
      texts.push(currentValue);
      continue;
    }

    if (Array.isArray(currentValue)) {
      pendingValues.push(...[...currentValue].reverse());
      continue;
    }

    if (!isPlainObject(currentValue)) {
      continue;
    }

    if (isString(currentValue.text)) {
      texts.push(currentValue.text);
    }

    pendingValues.push(currentValue.children, currentValue.content);
  }

  return texts.join(' ').replace(/\s+/g, ' ').trim();
};
