export type RichTextDocumentViolation =
  | 'invalidShape'
  | 'unsupportedNode'
  | 'unsupportedMark'
  | 'unsafeUrl'
  | 'tooDeep'
  | 'tooLarge';
