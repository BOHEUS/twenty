export type RichTextUsageReport = {
  documentCount: number;
  unparseableCount: number;
  maxNestingLevel: number;
  blockTypes: Record<string, number>;
  inlineTypes: Record<string, number>;
  styles: Record<string, number>;
};
