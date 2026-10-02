import { convertMarkdownToTipTapDocument } from '../convert-markdown-to-tiptap-document';
import { type TipTapDocument } from '../tiptap-document';
import { tipTapDocumentToMarkdown } from '../tiptap-document-to-markdown';

describe('convertMarkdownToTipTapDocument', () => {
  it('should convert inline formatting', () => {
    expect(
      convertMarkdownToTipTapDocument(
        '**bold** _italic_ ~~strike~~ <u>under</u> `code` [link](https://twenty.com)',
      ),
    ).toEqual({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'bold', marks: [{ type: 'bold' }] },
            { type: 'text', text: ' ' },
            { type: 'text', text: 'italic', marks: [{ type: 'italic' }] },
            { type: 'text', text: ' ' },
            { type: 'text', text: 'strike', marks: [{ type: 'strike' }] },
            { type: 'text', text: ' ' },
            { type: 'text', text: 'under', marks: [{ type: 'underline' }] },
            { type: 'text', text: ' ' },
            { type: 'text', text: 'code', marks: [{ type: 'code' }] },
            { type: 'text', text: ' ' },
            {
              type: 'text',
              text: 'link',
              marks: [{ type: 'link', attrs: { href: 'https://twenty.com' } }],
            },
          ],
        },
      ],
    });
  });

  it('should not create links with dangerous protocols', () => {
    const document = convertMarkdownToTipTapDocument(
      '[x](javascript:alert(1))',
    );

    expect(document.content?.[0]?.content).toEqual([
      { type: 'text', text: '[x](javascript:alert(1))' },
    ]);
  });

  it('should keep raw HTML as text', () => {
    const document = convertMarkdownToTipTapDocument(
      '<script>alert(1)</script>\n\ntext <b>bold</b>',
    );

    expect(document.content).toEqual([
      {
        type: 'paragraph',
        content: [{ type: 'text', text: '<script>alert(1)</script>' }],
      },
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'text ' },
          { type: 'text', text: '<b>' },
          { type: 'text', text: 'bold' },
          { type: 'text', text: '</b>' },
        ],
      },
    ]);
  });

  it('should convert checklists and ordered lists', () => {
    const document = convertMarkdownToTipTapDocument(
      '- [ ] todo\n- [x] done\n\n3. three\n4. four',
    );

    expect(document.content).toEqual([
      {
        type: 'taskList',
        content: [
          {
            type: 'taskItem',
            attrs: { checked: false },
            content: [
              { type: 'paragraph', content: [{ type: 'text', text: 'todo' }] },
            ],
          },
          {
            type: 'taskItem',
            attrs: { checked: true },
            content: [
              { type: 'paragraph', content: [{ type: 'text', text: 'done' }] },
            ],
          },
        ],
      },
      {
        type: 'orderedList',
        attrs: { start: 3 },
        content: [
          {
            type: 'listItem',
            content: [
              { type: 'paragraph', content: [{ type: 'text', text: 'three' }] },
            ],
          },
          {
            type: 'listItem',
            content: [
              { type: 'paragraph', content: [{ type: 'text', text: 'four' }] },
            ],
          },
        ],
      },
    ]);
  });

  it('should split paragraphs around images', () => {
    const document = convertMarkdownToTipTapDocument(
      'before ![alt](https://example.com/a.png "title") after',
    );

    expect(document.content).toEqual([
      { type: 'paragraph', content: [{ type: 'text', text: 'before ' }] },
      {
        type: 'image',
        attrs: { src: 'https://example.com/a.png', alt: 'alt', title: 'title' },
      },
      { type: 'paragraph', content: [{ type: 'text', text: ' after' }] },
    ]);
  });

  it('should convert tables', () => {
    const document = convertMarkdownToTipTapDocument(
      '| a | b |\n| --- | --- |\n| 1 | 2 |',
    );

    expect(document.content?.[0]).toEqual({
      type: 'table',
      content: [
        {
          type: 'tableRow',
          content: ['a', 'b'].map((text) => ({
            type: 'tableHeader',
            content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
          })),
        },
        {
          type: 'tableRow',
          content: ['1', '2'].map((text) => ({
            type: 'tableCell',
            content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
          })),
        },
      ],
    });
  });

  it('should percent-encode link destinations once', () => {
    const document = convertMarkdownToTipTapDocument(
      tipTapDocumentToMarkdown({
        type: 'doc',
        content: [
          {
            type: 'image',
            attrs: { src: 'https://example.com/a b(1).png', alt: '' },
          },
        ],
      }),
    );

    expect(document.content?.[0]?.attrs?.src).toBe(
      'https://example.com/a%20b%281%29.png',
    );
  });

  it('should keep a TipTap document stable through markdown', () => {
    const document: TipTapDocument = {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Agenda' }],
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Price is 5 * 3 ' },
            { type: 'text', text: 'bold', marks: [{ type: 'bold' }] },
            { type: 'hardBreak' },
            { type: 'text', text: 'a`b', marks: [{ type: 'code' }] },
            { type: 'text', text: ' ' },
            {
              type: 'text',
              text: 'link',
              marks: [
                {
                  type: 'link',
                  attrs: { href: 'https://twenty.com/a%28b%29' },
                },
              ],
            },
          ],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'parent' }],
                },
                {
                  type: 'orderedList',
                  attrs: { start: 2 },
                  content: [
                    {
                      type: 'listItem',
                      content: [
                        {
                          type: 'paragraph',
                          content: [{ type: 'text', text: 'child' }],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        { type: 'paragraph', content: [{ type: 'text', text: 'Checklist' }] },
        {
          type: 'taskList',
          content: [
            {
              type: 'taskItem',
              attrs: { checked: true },
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'done' }],
                },
              ],
            },
          ],
        },
        {
          type: 'blockquote',
          content: [
            { type: 'paragraph', content: [{ type: 'text', text: 'quoted' }] },
          ],
        },
        {
          type: 'codeBlock',
          attrs: { language: 'ts' },
          content: [{ type: 'text', text: 'const a = `b`;\n```' }],
        },
        {
          type: 'table',
          content: [
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableHeader',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'a|b' }],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: '1' }],
                    },
                  ],
                },
              ],
            },
          ],
        },
        { type: 'divider' },
        {
          type: 'image',
          attrs: {
            src: 'https://example.com/a%20b.png',
            alt: 'alt',
            title: '',
          },
        },
      ],
    };

    expect(
      convertMarkdownToTipTapDocument(tipTapDocumentToMarkdown(document)),
    ).toEqual(document);
  });
});
