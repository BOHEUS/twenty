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

const BLOCKNOTE_BLOCKS = [
  {
    id: 'block-id',
    type: 'paragraph',
    props: { textColor: 'default' },
    content: [{ type: 'text', text: 'Hello', styles: { bold: true } }],
    children: [],
  },
];

describe('transformRichTextValue', () => {
  it('should derive blocknote and markdown from tiptap, ignoring other inputs', () => {
    const result = transformRichTextValue({
      tiptap: JSON.stringify(TIPTAP_DOCUMENT),
      blocknote: JSON.stringify(BLOCKNOTE_BLOCKS),
      markdown: 'stale',
    });

    expect(JSON.parse(result.tiptap ?? '')).toEqual(TIPTAP_DOCUMENT);
    expect(result.markdown).toBe('# Title\n\n- [x] done');
    expect(JSON.parse(result.blocknote ?? '')).toEqual([
      {
        type: 'heading',
        props: { level: 1 },
        content: [{ type: 'text', text: 'Title', styles: {} }],
        children: [],
      },
      {
        type: 'checkListItem',
        props: { checked: true },
        content: [{ type: 'text', text: 'done', styles: {} }],
        children: [],
      },
    ]);
  });

  it('should keep BlockNote input as sent and derive tiptap and markdown', () => {
    const blocknote = JSON.stringify(BLOCKNOTE_BLOCKS);

    const result = transformRichTextValue({ blocknote, markdown: null });

    expect(result.blocknote).toBe(blocknote);
    expect(result.markdown).toBe('**Hello**');
    expect(JSON.parse(result.tiptap ?? '')).toEqual({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello', marks: [{ type: 'bold' }] }],
        },
      ],
    });
  });

  it('should convert legacy TipTap nodes stored in blocknote', () => {
    const result = transformRichTextValue({
      blocknote: JSON.stringify(TIPTAP_DOCUMENT.content),
      markdown: null,
    });

    expect(JSON.parse(result.tiptap ?? '')).toEqual(TIPTAP_DOCUMENT);
    expect(JSON.parse(result.blocknote ?? '')[1].type).toBe('checkListItem');
  });

  it('should derive tiptap and blocknote from markdown-only writes from apps', () => {
    const result = transformRichTextValue({
      markdown: '## Summary\n\n- point',
      blocknote: null,
    });

    expect(result.markdown).toBe('## Summary\n\n- point');
    expect(JSON.parse(result.tiptap ?? '').content[1].type).toBe('bulletList');
    expect(JSON.parse(result.blocknote ?? '')).toEqual([
      {
        type: 'heading',
        props: { level: 2 },
        content: [{ type: 'text', text: 'Summary', styles: {} }],
        children: [],
      },
      {
        type: 'bulletListItem',
        props: {},
        content: [{ type: 'text', text: 'point', styles: {} }],
        children: [],
      },
    ]);
  });

  it('should return empty subfields when nothing is set', () => {
    expect(
      transformRichTextValue({ blocknote: null, markdown: null, tiptap: null }),
    ).toEqual({ blocknote: null, markdown: null, tiptap: null });
  });
});
