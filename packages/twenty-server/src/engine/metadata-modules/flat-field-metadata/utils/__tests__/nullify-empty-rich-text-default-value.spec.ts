import { nullifyEmptyRichTextDefaultValue } from '../nullify-empty-rich-text-default-value.util';

describe('nullifyEmptyRichTextDefaultValue', () => {
  it('returns null when every subfield is null-equivalent', () => {
    expect(
      nullifyEmptyRichTextDefaultValue({ markdown: '', tiptap: "''" }),
    ).toBeNull();
  });

  it('returns normalized object when tiptap has a value', () => {
    expect(
      nullifyEmptyRichTextDefaultValue({
        tiptap: '{"type":"doc"}',
        markdown: "''",
      }),
    ).toEqual({ tiptap: '{"type":"doc"}', markdown: null });
  });

  it('ignores the removed blocknote subfield in stored defaults', () => {
    expect(
      nullifyEmptyRichTextDefaultValue({ blocknote: '[]', markdown: null }),
    ).toBeNull();
  });
});
