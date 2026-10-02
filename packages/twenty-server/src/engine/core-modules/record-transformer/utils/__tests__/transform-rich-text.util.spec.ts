import { transformRichTextValue } from 'src/engine/core-modules/record-transformer/utils/transform-rich-text.util';

const TIPTAP_DOCUMENT = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'Title' }],
    },
    {
      type: 'taskList',
      content: [
        {
          type: 'taskItem',
          attrs: { checked: true },
          content: [
            { type: 'paragraph', content: [{ type: 'text', text: 'done' }] },
          ],
        },
      ],
    },
  ],
};

describe('transformRichTextValue', () => {
  it('should derive markdown from tiptap, ignoring a stale markdown', () => {
    const result = transformRichTextValue({
      tiptap: JSON.stringify(TIPTAP_DOCUMENT),
      markdown: 'stale',
    });

    expect(result).toEqual({
      tiptap: JSON.stringify(TIPTAP_DOCUMENT),
      markdown: '# Title\n\n- [x] done',
    });
  });

  it('should keep markdown-only writes and parse them into tiptap', () => {
    const result = transformRichTextValue({
      markdown: '## Summary\n\n- point',
    });

    expect(result.markdown).toBe('## Summary\n\n- point');
    expect(JSON.parse(result.tiptap ?? '')).toEqual({
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Summary' }],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'point' }],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it('should clear every subfield when the field is set to null', () => {
    expect(transformRichTextValue(null)).toEqual({
      markdown: null,
      tiptap: null,
    });
  });

  it('should return empty subfields when nothing is set', () => {
    expect(transformRichTextValue({ markdown: null, tiptap: null })).toEqual({
      markdown: null,
      tiptap: null,
    });
  });
});
