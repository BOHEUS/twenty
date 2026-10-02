import { convertBlockNoteToTipTapDocument } from '../convert-blocknote-to-tiptap-document';
import { RICH_TEXT_DOCUMENT_LIMITS } from '../rich-text-document-limits';

const DEFAULT_PROPS = {
  backgroundColor: 'default',
  textColor: 'default',
  textAlignment: 'left',
};

const buildBlock = (
  type: string,
  content: unknown,
  props: Record<string, unknown> = {},
  children: unknown[] = [],
) => ({
  id: `${type}-id`,
  type,
  props: { ...DEFAULT_PROPS, ...props },
  content,
  children,
});

const text = (value: string, styles: Record<string, unknown> = {}) => ({
  type: 'text',
  text: value,
  styles,
});

describe('convertBlockNoteToTipTapDocument', () => {
  it('should convert paragraphs with styles, links and mentions', () => {
    const { document, fallbackCount } = convertBlockNoteToTipTapDocument([
      buildBlock('paragraph', [
        text('Hello ', { bold: true }),
        {
          type: 'link',
          href: 'https://twenty.com',
          content: [text('Twenty', { italic: true })],
        },
        {
          type: 'mention',
          props: {
            recordId: 'record-id',
            objectMetadataId: 'object-id',
            objectNameSingular: 'company',
            label: 'Acme',
          },
        },
      ]),
    ]);

    expect(fallbackCount).toBe(0);
    expect(document).toEqual({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Hello ', marks: [{ type: 'bold' }] },
            {
              type: 'text',
              text: 'Twenty',
              marks: [
                { type: 'link', attrs: { href: 'https://twenty.com' } },
                { type: 'italic' },
              ],
            },
            {
              type: 'mentionTag',
              attrs: {
                recordId: 'record-id',
                objectMetadataId: 'object-id',
                objectNameSingular: 'company',
                label: 'Acme',
              },
            },
          ],
        },
      ],
    });
  });

  it('should turn block and inline colors into marks', () => {
    const { document } = convertBlockNoteToTipTapDocument([
      buildBlock('paragraph', [text('red', { backgroundColor: 'yellow' })], {
        textColor: 'red',
      }),
    ]);

    expect(document.content?.[0]?.content?.[0]?.marks).toEqual([
      { type: 'textStyle', attrs: { color: 'red' } },
      { type: 'highlight', attrs: { color: 'yellow' } },
    ]);
  });

  it('should split newlines into hard breaks', () => {
    const { document } = convertBlockNoteToTipTapDocument([
      buildBlock('paragraph', [text('first\nsecond')]),
    ]);

    expect(document.content?.[0]?.content).toEqual([
      { type: 'text', text: 'first' },
      { type: 'hardBreak' },
      { type: 'text', text: 'second' },
    ]);
  });

  it('should nest list children and merge adjacent list items', () => {
    const { document } = convertBlockNoteToTipTapDocument([
      buildBlock('numberedListItem', [text('one')], { start: 3 }, [
        buildBlock('checkListItem', [text('nested')], { checked: true }),
      ]),
      buildBlock('numberedListItem', [text('two')]),
    ]);

    expect(document.content).toEqual([
      {
        type: 'orderedList',
        attrs: { start: 3 },
        content: [
          {
            type: 'listItem',
            content: [
              { type: 'paragraph', content: [{ type: 'text', text: 'one' }] },
              {
                type: 'taskList',
                content: [
                  {
                    type: 'taskItem',
                    attrs: { checked: true },
                    content: [
                      {
                        type: 'paragraph',
                        content: [{ type: 'text', text: 'nested' }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              { type: 'paragraph', content: [{ type: 'text', text: 'two' }] },
            ],
          },
        ],
      },
    ]);
  });

  it('should keep children of non-list blocks as following siblings', () => {
    const { document } = convertBlockNoteToTipTapDocument([
      buildBlock('paragraph', [text('parent')], {}, [
        buildBlock('paragraph', [text('child')]),
      ]),
    ]);

    expect(document.content?.map((node) => node.content?.[0]?.text)).toEqual([
      'parent',
      'child',
    ]);
  });

  it('should convert quotes, code blocks, headings and dividers', () => {
    const { document } = convertBlockNoteToTipTapDocument([
      buildBlock('heading', [text('Title')], { level: 5, isToggleable: true }),
      buildBlock('quote', [text('quoted')]),
      {
        type: 'codeBlock',
        props: { language: 'ts' },
        content: [text('a < b')],
      },
      { type: 'divider', props: {}, children: [] },
    ]);

    expect(document.content).toEqual([
      {
        type: 'heading',
        attrs: { level: 5 },
        content: [{ type: 'text', text: 'Title' }],
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
        content: [{ type: 'text', text: 'a < b' }],
      },
      { type: 'divider' },
    ]);
  });

  it('should convert tables with header rows', () => {
    const cell = (value: string) => ({
      type: 'tableCell',
      content: [text(value)],
      props: { colspan: 1, rowspan: 1 },
    });

    const { document } = convertBlockNoteToTipTapDocument([
      {
        type: 'table',
        props: { textColor: 'default' },
        content: {
          type: 'tableContent',
          headerRows: 1,
          rows: [
            { cells: [cell('a'), cell('b')] },
            { cells: [[text('1')], cell('2')] },
          ],
        },
        children: [],
      },
    ]);

    const [table] = document.content ?? [];

    expect(table?.type).toBe('table');
    expect(
      table?.content?.map((row) =>
        row.content?.map((tableCell) => tableCell.type),
      ),
    ).toEqual([
      ['tableHeader', 'tableHeader'],
      ['tableCell', 'tableCell'],
    ]);
    expect(table?.content?.[1]?.content?.[0]).toEqual({
      type: 'tableCell',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: '1' }] }],
    });
  });

  it('should convert images and file blocks', () => {
    const { document } = convertBlockNoteToTipTapDocument([
      buildBlock('image', undefined, {
        url: 'https://example.com/a.png',
        caption: 'Caption',
        name: 'a.png',
        previewWidth: 320,
        textAlignment: 'center',
      }),
      buildBlock('file', undefined, {
        url: 'https://example.com/a.pdf',
        name: 'a.pdf',
        fileCategory: 'TEXT_DOCUMENT',
      }),
      buildBlock('video', undefined, {
        url: 'https://example.com/a.mp4',
        name: 'a.mp4',
      }),
    ]);

    expect(document.content).toEqual([
      {
        type: 'image',
        attrs: {
          src: 'https://example.com/a.png',
          align: 'center',
          alt: 'Caption',
          title: 'a.png',
          width: 320,
        },
      },
      {
        type: 'file',
        attrs: {
          url: 'https://example.com/a.pdf',
          name: 'a.pdf',
          fileCategory: 'TEXT_DOCUMENT',
        },
      },
      {
        type: 'file',
        attrs: {
          url: 'https://example.com/a.mp4',
          name: 'a.mp4',
          fileCategory: 'VIDEO',
        },
      },
    ]);
  });

  it('should keep the text of unknown blocks and count the fallback', () => {
    const { document, fallbackCount } = convertBlockNoteToTipTapDocument([
      buildBlock('alert', [text('careful')]),
      'not a block',
    ]);

    expect(fallbackCount).toBe(2);
    expect(document.content).toEqual([
      { type: 'paragraph', content: [{ type: 'text', text: 'careful' }] },
      { type: 'paragraph', content: [{ type: 'text', text: 'not a block' }] },
    ]);
  });

  it('should flatten content nested beyond the limit without throwing', () => {
    let deepBlock = buildBlock('bulletListItem', [text('leaf')]);

    for (let level = 0; level < 10_000; level++) {
      deepBlock = buildBlock('bulletListItem', [text(`level ${level}`)], {}, [
        deepBlock,
      ]);
    }

    const { document, fallbackCount } = convertBlockNoteToTipTapDocument([
      deepBlock,
    ]);

    expect(fallbackCount).toBe(1);

    let depth = 0;
    let node = document.content?.[0];

    while (node !== undefined) {
      depth++;
      node = node.content?.find((child) => child.type !== 'text');
    }

    expect(depth).toBeLessThan(RICH_TEXT_DOCUMENT_LIMITS.maxTipTapDepth);
  });

  it('should return an empty document for no blocks', () => {
    expect(convertBlockNoteToTipTapDocument([])).toEqual({
      document: { type: 'doc' },
      fallbackCount: 0,
    });
  });
});
