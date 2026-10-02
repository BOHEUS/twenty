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
        blocknote: '[]',
        markdown: 'old',
      }),
    ).toEqual(document);
  });

  it('should convert values written before the backfill', () => {
    expect(
      getRichTextFieldTiptapDocument({
        blocknote: JSON.stringify([
          {
            type: 'paragraph',
            props: {},
            content: [{ type: 'text', text: 'legacy', styles: {} }],
            children: [],
          },
        ]),
        markdown: null,
      }),
    ).toEqual({
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'legacy' }] },
      ],
    });
  });

  it('should return undefined for empty values', () => {
    expect(getRichTextFieldTiptapDocument(null)).toBeUndefined();
    expect(
      getRichTextFieldTiptapDocument({ blocknote: null, markdown: null }),
    ).toBeUndefined();
  });
});
