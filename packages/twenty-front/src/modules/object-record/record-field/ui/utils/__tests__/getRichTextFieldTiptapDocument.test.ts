import { getRichTextFieldTiptapDocument } from '@/object-record/record-field/ui/utils/getRichTextFieldTiptapDocument';

describe('getRichTextFieldTiptapDocument', () => {
  it('should prefer the tiptap subfield', () => {
    const document = {
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'new' }] },
      ],
    };

    expect(
      getRichTextFieldTiptapDocument({
        tiptap: JSON.stringify(document),
        markdown: 'old',
      }),
    ).toEqual(document);
  });

  it('should parse markdown-only values', () => {
    expect(getRichTextFieldTiptapDocument({ markdown: 'legacy' })).toEqual({
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'legacy' }] },
      ],
    });
  });

  it('should return undefined for empty values', () => {
    expect(getRichTextFieldTiptapDocument(null)).toBeUndefined();
    expect(getRichTextFieldTiptapDocument({ markdown: null })).toBeUndefined();
  });
});
