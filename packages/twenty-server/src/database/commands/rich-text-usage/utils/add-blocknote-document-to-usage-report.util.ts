import { isNonEmptyString, isString } from '@sniptt/guards';
import { isPlainObject } from 'twenty-shared/utils';

import { type RichTextUsageReport } from 'src/database/commands/rich-text-usage/types/rich-text-usage-report.type';

const increment = (counts: Record<string, number>, key: string) => {
  counts[key] = (counts[key] ?? 0) + 1;
};

const countInlineContent = (
  content: unknown,
  report: RichTextUsageReport,
): void => {
  if (!Array.isArray(content)) {
    return;
  }

  for (const item of content) {
    if (!isPlainObject(item) || !isString(item.type)) {
      continue;
    }

    increment(report.inlineTypes, item.type);

    if (isPlainObject(item.styles)) {
      for (const [style, value] of Object.entries(item.styles)) {
        if (value !== false && value !== 'default') {
          increment(report.styles, style);
        }
      }
    }

    if (item.type === 'link') {
      countInlineContent(item.content, report);
    }
  }
};

// Iterative so deeply nested legacy content cannot overflow the stack.
export const addBlockNoteDocumentToUsageReport = (
  serializedBlocks: string | null,
  report: RichTextUsageReport,
): void => {
  if (!isNonEmptyString(serializedBlocks)) {
    return;
  }

  let blocks: unknown;

  try {
    blocks = JSON.parse(serializedBlocks);
  } catch {
    report.unparseableCount++;

    return;
  }

  if (!Array.isArray(blocks)) {
    report.unparseableCount++;

    return;
  }

  report.documentCount++;

  const pendingBlocks = blocks.map((block) => ({ block, nestingLevel: 0 }));

  while (pendingBlocks.length > 0) {
    const pendingBlock = pendingBlocks.pop();

    if (!isPlainObject(pendingBlock?.block)) {
      continue;
    }

    const { block, nestingLevel } = pendingBlock;

    report.maxNestingLevel = Math.max(report.maxNestingLevel, nestingLevel);

    if (isString(block.type)) {
      increment(report.blockTypes, block.type);
    }

    if (isPlainObject(block.props)) {
      for (const prop of ['textColor', 'backgroundColor', 'textAlignment']) {
        const value = block.props[prop];

        if (isString(value) && value !== 'default' && value !== 'left') {
          increment(report.styles, `block.${prop}`);
        }
      }

      if (block.props.isToggleable === true) {
        increment(report.styles, 'block.isToggleable');
      }
    }

    countInlineContent(block.content, report);

    if (Array.isArray(block.children)) {
      pendingBlocks.push(
        ...block.children.map((child) => ({
          block: child,
          nestingLevel: nestingLevel + 1,
        })),
      );
    }
  }
};
