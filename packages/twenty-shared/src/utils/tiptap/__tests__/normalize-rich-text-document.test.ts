import { normalizeRichTextDocument } from '../normalize-rich-text-document';

const TIPTAP_DOCUMENT = {
  type: 'doc',
  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'tiptap' }] }],
};

describe('normalizeRichTextDocument', () => {
  it('should prefer the TipTap subfield', () => {
    expect(
      normalizeRichTextDocument({
        tiptap: JSON.stringify(TIPTAP_DOCUMENT),
        blocknote: '[]',
        markdown: 'markdown',
      }),
    ).toEqual({
      document: TIPTAP_DOCUMENT,
      fallbackCount: 0,
      source: 'tiptap',
    });
  });

  it('should convert BlockNote blocks', () => {
    const result = normalizeRichTextDocument({
      blocknote: JSON.stringify([
        {
          type: 'paragraph',
          props: {},
          content: [{ type: 'text', text: 'blocknote', styles: {} }],
          children: [],
        },
      ]),
      markdown: 'ignored',
    });

    expect(result?.source).toBe('blocknote');
    expect(result?.document.content?.[0]?.content?.[0]?.text).toBe('blocknote');
  });

  it('should read TipTap nodes stored in the blocknote subfield', () => {
    const content = [
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              { type: 'paragraph', content: [{ type: 'text', text: 'item' }] },
            ],
          },
        ],
      },
    ];

    expect(
      normalizeRichTextDocument({ blocknote: JSON.stringify(content) }),
    ).toEqual({
      document: { type: 'doc', content },
      fallbackCount: 0,
      source: 'blocknote',
    });
  });

  it('should fall back to markdown, then to unparseable blocknote text', () => {
    expect(
      normalizeRichTextDocument({ tiptap: 'not json', markdown: '**md**' })
        ?.source,
    ).toBe('markdown');

    expect(normalizeRichTextDocument({ blocknote: 'plain text' })).toEqual({
      document: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'plain text' }],
          },
        ],
      },
      fallbackCount: 1,
      source: 'blocknote',
    });
  });

  it('should return null when every subfield is empty', () => {
    expect(
      normalizeRichTextDocument({
        tiptap: null,
        blocknote: '',
        markdown: null,
      }),
    ).toBeNull();
  });

  it('should ignore JSON values that are neither BlockNote nor TipTap', () => {
    expect(normalizeRichTextDocument({ blocknote: '{}' })).toBeNull();
    expect(normalizeRichTextDocument({ blocknote: '""' })).toBeNull();
  });
});
