import { buildRichTextFieldValueFromTiptap } from '@/object-record/record-field/ui/utils/buildRichTextFieldValueFromTiptap';

describe('buildRichTextFieldValueFromTiptap', () => {
  it('should derive markdown from the TipTap document', () => {
    const tiptap = JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Hello' }],
        },
      ],
    });

    expect(buildRichTextFieldValueFromTiptap(tiptap)).toEqual({
      tiptap,
      markdown: '## Hello',
    });
  });

  it('should derive an empty markdown from an empty document', () => {
    expect(
      buildRichTextFieldValueFromTiptap('{"type":"doc"}').markdown,
    ).toEqual('');
  });
});
