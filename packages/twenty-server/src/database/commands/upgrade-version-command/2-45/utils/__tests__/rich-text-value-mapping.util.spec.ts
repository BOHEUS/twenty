import { addTiptapToRichTextValue } from 'src/database/commands/upgrade-version-command/2-45/utils/add-tiptap-to-rich-text-value.util';
import { mapRecordCrudRichTextFields } from 'src/database/commands/upgrade-version-command/2-45/utils/map-record-crud-rich-text-fields.util';
import { removeTiptapFromRichTextValue } from 'src/database/commands/upgrade-version-command/2-45/utils/remove-tiptap-from-rich-text-value.util';

const PARAGRAPH_DOCUMENT = {
  type: 'doc',
  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hi' }] }],
};

describe('addTiptapToRichTextValue', () => {
  it('should add tiptap and keep the stored subfields', () => {
    const value = {
      blocknote: JSON.stringify([
        {
          type: 'paragraph',
          props: {},
          content: [{ type: 'text', text: 'Hi', styles: {} }],
          children: [],
        },
      ]),
      markdown: 'Hi',
    };

    expect(addTiptapToRichTextValue(value)).toEqual({
      value: { ...value, tiptap: JSON.stringify(PARAGRAPH_DOCUMENT) },
      hasChanged: true,
    });
  });

  it('should keep workflow variables stored as TipTap nodes in blocknote', () => {
    const content = [
      {
        type: 'paragraph',
        content: [{ type: 'variableTag', attrs: { variable: '{{a.b}}' } }],
      },
    ];

    const { value } = addTiptapToRichTextValue({
      blocknote: JSON.stringify(content),
      markdown: null,
    });

    expect(JSON.parse((value as { tiptap: string }).tiptap)).toEqual({
      type: 'doc',
      content,
    });
  });

  it('should leave values that already have tiptap, are empty or are not objects', () => {
    for (const value of [
      { blocknote: '[]', markdown: null, tiptap: '{"type":"doc"}' },
      { blocknote: null, markdown: null },
      'plain text',
      null,
    ]) {
      expect(addTiptapToRichTextValue(value)).toEqual({
        value,
        hasChanged: false,
      });
    }
  });
});

describe('mapRecordCrudRichTextFields', () => {
  it('should add tiptap to rich text fields of record steps only', () => {
    const steps = [
      {
        type: 'CREATE_RECORD',
        settings: {
          input: {
            objectName: 'note',
            objectRecord: {
              title: 'Title',
              bodyV2: { blocknote: null, markdown: 'Hi' },
            },
          },
        },
      },
      { type: 'CODE', settings: { input: {} } },
    ];

    const { value, hasChanged } = mapRecordCrudRichTextFields({
      steps,
      richTextFieldNamesByObjectName: { note: ['bodyV2'] },
      mapValue: addTiptapToRichTextValue,
    });

    expect(hasChanged).toBe(true);
    expect(value[0].settings.input.objectRecord).toEqual({
      title: 'Title',
      bodyV2: {
        blocknote: null,
        markdown: 'Hi',
        tiptap: JSON.stringify(PARAGRAPH_DOCUMENT),
      },
    });
    expect(value[1]).toBe(steps[1]);
  });
});

describe('removeTiptapFromRichTextValue', () => {
  it('should restore the value as it was before the backfill', () => {
    const value = { blocknote: null, markdown: 'Hi' };
    const { value: backfilledValue } = addTiptapToRichTextValue(value);

    expect(removeTiptapFromRichTextValue(backfilledValue)).toEqual({
      value,
      hasChanged: true,
    });
    expect(removeTiptapFromRichTextValue(value)).toEqual({
      value,
      hasChanged: false,
    });
  });
});
