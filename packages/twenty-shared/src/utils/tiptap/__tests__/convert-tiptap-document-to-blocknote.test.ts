import { convertBlockNoteToTipTapDocument } from '../convert-blocknote-to-tiptap-document';
import { convertTipTapDocumentToBlockNote } from '../convert-tiptap-document-to-blocknote';
import { type TipTapDocument } from '../tiptap-document';

const paragraph = (text: string) => ({
  type: 'paragraph',
  content: [{ type: 'text', text }],
});

describe('convertTipTapDocumentToBlockNote', () => {
  it('should convert marks to BlockNote styles and links', () => {
    const blocks = convertTipTapDocumentToBlockNote({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'styled',
              marks: [
                { type: 'bold' },
                { type: 'code' },
                { type: 'textStyle', attrs: { color: 'red' } },
                { type: 'highlight', attrs: { color: 'blue' } },
              ],
            },
            { type: 'hardBreak' },
            {
              type: 'text',
              text: 'link',
              marks: [{ type: 'link', attrs: { href: 'https://twenty.com' } }],
            },
            { type: 'variableTag', attrs: { variable: '{{trigger.name}}' } },
          ],
        },
      ],
    });

    expect(blocks).toEqual([
      {
        type: 'paragraph',
        props: {},
        content: [
          {
            type: 'text',
            text: 'styled',
            styles: {
              bold: true,
              code: true,
              textColor: 'red',
              backgroundColor: 'blue',
            },
          },
          { type: 'text', text: '\n', styles: {} },
          {
            type: 'link',
            href: 'https://twenty.com',
            content: [{ type: 'text', text: 'link', styles: {} }],
          },
          { type: 'text', text: '{{trigger.name}}', styles: {} },
        ],
        children: [],
      },
    ]);
  });

  it('should separate adjacent ordered lists so BlockNote keeps their start', () => {
    const blocks = convertTipTapDocumentToBlockNote({
      type: 'doc',
      content: [
        {
          type: 'orderedList',
          content: [{ type: 'listItem', content: [paragraph('a')] }],
        },
        {
          type: 'orderedList',
          attrs: { start: 5 },
          content: [{ type: 'listItem', content: [paragraph('b')] }],
        },
      ],
    });

    expect(blocks.map((block) => [block.type, block.props])).toEqual([
      ['numberedListItem', {}],
      ['paragraph', {}],
      ['numberedListItem', { start: 5 }],
    ]);
  });

  it('should flatten email-only containers into their content', () => {
    const blocks = convertTipTapDocumentToBlockNote({
      type: 'doc',
      content: [
        {
          type: 'section',
          content: [
            {
              type: 'columns',
              content: [{ type: 'column', content: [paragraph('inside')] }],
            },
          ],
        },
      ],
    });

    expect(blocks).toEqual([
      {
        type: 'paragraph',
        props: {},
        content: [{ type: 'text', text: 'inside', styles: {} }],
        children: [],
      },
    ]);
  });

  it('should round trip BlockNote content through TipTap', () => {
    const originalBlocks = [
      {
        type: 'heading',
        props: { level: 2 },
        content: [{ type: 'text', text: 'Agenda', styles: { bold: true } }],
        children: [],
      },
      {
        type: 'bulletListItem',
        props: {},
        content: [{ type: 'text', text: 'first', styles: {} }],
        children: [
          {
            type: 'checkListItem',
            props: { checked: true },
            content: [{ type: 'text', text: 'done', styles: {} }],
            children: [],
          },
        ],
      },
      {
        type: 'quote',
        props: {},
        content: [{ type: 'text', text: 'quote', styles: {} }],
        children: [],
      },
      {
        type: 'codeBlock',
        props: { language: 'ts' },
        content: [{ type: 'text', text: 'const a = 1;', styles: {} }],
        children: [],
      },
      {
        type: 'image',
        props: {
          url: 'https://example.com/a.png',
          textAlignment: 'left',
          caption: '',
          name: 'a.png',
          previewWidth: 200,
        },
        children: [],
      },
      {
        type: 'file',
        props: {
          url: 'https://example.com/a.pdf',
          name: 'a.pdf',
          fileCategory: 'OTHER',
        },
        children: [],
      },
      {
        type: 'table',
        props: {},
        content: {
          type: 'tableContent',
          columnWidths: [null, null],
          headerRows: 1,
          rows: [
            {
              cells: ['a', 'b'].map((value) => ({
                type: 'tableCell',
                content: [{ type: 'text', text: value, styles: {} }],
                props: {},
              })),
            },
          ],
        },
        children: [],
      },
    ];

    const { document } = convertBlockNoteToTipTapDocument(originalBlocks);

    expect(convertTipTapDocumentToBlockNote(document)).toEqual(originalBlocks);
  });

  it('should return no blocks for an empty document', () => {
    const emptyDocument: TipTapDocument = { type: 'doc' };

    expect(convertTipTapDocumentToBlockNote(emptyDocument)).toEqual([]);
  });
});
