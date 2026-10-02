// Converters and validators share these bounds so a document accepted on
// write can always be converted and rendered without exhausting the stack.
export const RICH_TEXT_DOCUMENT_LIMITS = {
  maxTipTapDepth: 64,
  maxNodeCount: 100_000,
  maxLegacyBlockNestingLevel: 24,
} as const;
