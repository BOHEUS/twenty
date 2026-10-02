import { buildAdvancedTextEditorCoreExtensions } from '@/advanced-text-editor/constants/AdvancedTextEditorCoreExtensions';
import { buildRecordRichTextExtensions } from '@/advanced-text-editor/utils/buildRecordRichTextExtensions';
import { getSchema } from '@tiptap/core';
import {
  convertBlockNoteToTipTapDocument,
  RECORD_RICH_TEXT_MARK_TYPES,
  RECORD_RICH_TEXT_NODE_TYPES,
  TIPTAP_NODE_TYPES,
} from 'twenty-shared/utils';

const getRecordRichTextSchema = (
  context: Parameters<typeof buildRecordRichTextExtensions>[0] = {},
) =>
  getSchema([
    ...buildAdvancedTextEditorCoreExtensions({ placeholder: undefined }),
    ...buildRecordRichTextExtensions(context),
  ]);

const text = (value: string, styles: Record<string, unknown> = {}) => ({
  type: 'text',
  text: value,
  styles,
});

describe('buildRecordRichTextExtensions', () => {
  it('should cover every node and mark the server accepts for records', () => {
    const schema = getRecordRichTextSchema();

    // Workflow forms add the variable tag on top of the record preset.
    expect(Object.keys(schema.nodes)).toEqual(
      expect.arrayContaining(
        RECORD_RICH_TEXT_NODE_TYPES.filter(
          (nodeType) => nodeType !== TIPTAP_NODE_TYPES.VARIABLE_TAG,
        ),
      ),
    );
    expect(Object.keys(schema.marks)).toEqual(
      expect.arrayContaining(RECORD_RICH_TEXT_MARK_TYPES),
    );
  });

  it('should not include email-only blocks', () => {
    const schema = getRecordRichTextSchema();

    for (const nodeType of ['html', 'section', 'columns', 'button']) {
      expect(schema.nodes[nodeType]).toBeUndefined();
    }
  });

  it('should only add the mention menu when records can be searched', () => {
    const extensionNames = (
      context: Parameters<typeof buildRecordRichTextExtensions>[0],
    ) => buildRecordRichTextExtensions(context).map(({ name }) => name);

    expect(extensionNames({})).not.toContain('mention-suggestion');
    expect(extensionNames({ searchMentionRecords: async () => [] })).toContain(
      'mention-suggestion',
    );
  });

  it('should load a converted BlockNote note without losing content', () => {
    const { document } = convertBlockNoteToTipTapDocument([
      {
        type: 'heading',
        props: { level: 4, textAlignment: 'center' },
        content: [text('Agenda', { bold: true, textColor: 'red' })],
        children: [],
      },
      {
        type: 'checkListItem',
        props: { checked: true },
        content: [text('done', { code: true, backgroundColor: 'yellow' })],
        children: [
          {
            type: 'numberedListItem',
            props: {},
            content: [
              {
                type: 'link',
                href: 'https://twenty.com',
                content: [text('link')],
              },
              {
                type: 'mention',
                props: {
                  recordId: 'record-id',
                  objectNameSingular: 'company',
                  label: 'Acme',
                },
              },
            ],
            children: [],
          },
        ],
      },
      { type: 'quote', props: {}, content: [text('quoted')], children: [] },
      {
        type: 'codeBlock',
        props: { language: 'ts' },
        content: [text('const a = 1;')],
        children: [],
      },
      {
        type: 'table',
        props: {},
        content: {
          type: 'tableContent',
          headerRows: 1,
          rows: [
            { cells: [[text('a')], [text('b')]] },
            { cells: [[text('1')], [text('2')]] },
          ],
        },
        children: [],
      },
      {
        type: 'image',
        props: { url: 'https://example.com/a.png', caption: '', name: 'a.png' },
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
      { type: 'divider', props: {}, children: [] },
    ]);

    const schema = getRecordRichTextSchema();
    const node = schema.nodeFromJSON(document);

    expect(() => node.check()).not.toThrow();
    expect(node.textContent).toContain('Agenda');
    expect(node.textContent).toContain('const a = 1;');

    const nodeTypes = new Set<string>();
    const markTypes = new Set<string>();

    node.descendants((descendant) => {
      nodeTypes.add(descendant.type.name);
      descendant.marks.forEach((mark) => markTypes.add(mark.type.name));
    });

    expect([...nodeTypes]).toEqual(
      expect.arrayContaining([
        'heading',
        'taskList',
        'orderedList',
        'mentionTag',
        'blockquote',
        'codeBlock',
        'table',
        'tableHeader',
        'image',
        'file',
        'divider',
      ]),
    );
    expect([...markTypes]).toEqual(
      expect.arrayContaining([
        'bold',
        'code',
        'textStyle',
        'highlight',
        'link',
      ]),
    );
  });
});
