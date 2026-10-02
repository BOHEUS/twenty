// RICH_TEXT variables are stored as a rich text object; markdown alone is
// enough because Twenty derives the editor formats from it.
export const serializeRichTextMarkdown = (markdown: string): string =>
  JSON.stringify({
    markdown: markdown === '' ? null : markdown,
  });
