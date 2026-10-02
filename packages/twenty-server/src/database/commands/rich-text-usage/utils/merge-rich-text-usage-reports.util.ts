import { type RichTextUsageReport } from 'src/database/commands/rich-text-usage/types/rich-text-usage-report.type';

const mergeCounts = (
  target: Record<string, number>,
  source: Record<string, number>,
) => {
  for (const [key, count] of Object.entries(source)) {
    target[key] = (target[key] ?? 0) + count;
  }
};

export const mergeRichTextUsageReports = (
  target: RichTextUsageReport,
  source: RichTextUsageReport,
): void => {
  target.documentCount += source.documentCount;
  target.unparseableCount += source.unparseableCount;
  target.maxNestingLevel = Math.max(
    target.maxNestingLevel,
    source.maxNestingLevel,
  );
  mergeCounts(target.blockTypes, source.blockTypes);
  mergeCounts(target.inlineTypes, source.inlineTypes);
  mergeCounts(target.styles, source.styles);
};
