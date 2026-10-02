import { buildRichTextFieldValueFromTiptap } from '@/object-record/record-field/ui/utils/buildRichTextFieldValueFromTiptap';

describe('buildRichTextFieldValueFromTiptap', () => {
  it('should derive the BlockNote value from the TipTap document', () => {
    const tiptap = JSON.stringify({
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] },
      ],
    });

    expect(buildRichTextFieldValueFromTiptap(tiptap)).toEqual({
      tiptap,
      blocknote: JSON.stringify([
        {
          type: 'paragraph',
          props: {},
          content: [{ type: 'text', text: 'Hello', styles: {} }],
          children: [],
        },
      ]),
      markdown: null,
    });
  });

  it('should leave blocknote empty when the document is invalid', () => {
    expect(buildRichTextFieldValueFromTiptap('not json')).toEqual({
      tiptap: 'not json',
      blocknote: null,
      markdown: null,
    });
  });
});
