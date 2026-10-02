import { type RichTextUsageReport } from 'src/database/commands/rich-text-usage/types/rich-text-usage-report.type';

export const createEmptyRichTextUsageReport = (): RichTextUsageReport => ({
  documentCount: 0,
  unparseableCount: 0,
  maxNestingLevel: 0,
  blockTypes: {},
  inlineTypes: {},
  styles: {},
});
