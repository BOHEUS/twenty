import { buildRichTextTiptapBackfill } from 'src/database/commands/upgrade-version-command/2-45/utils/build-rich-text-tiptap-backfill.util';

const BLOCKNOTE = JSON.stringify([
  {
    type: 'paragraph',
    props: {},
    content: [{ type: 'text', text: 'Hello', styles: {} }],
    children: [],
  },
]);

describe('buildRichTextTiptapBackfill', () => {
  it('should convert BlockNote and keep an existing markdown', () => {
    expect(
      buildRichTextTiptapBackfill({ blocknote: BLOCKNOTE, markdown: 'Hello' }),
    ).toEqual({
      status: 'converted',
      tiptap: JSON.stringify({
        type: 'doc',
        content: [
          { type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] },
        ],
      }),
      markdown: null,
    });
  });

  it('should fill a missing markdown from the converted document', () => {
    expect(
      buildRichTextTiptapBackfill({ blocknote: BLOCKNOTE, markdown: null }),
    ).toMatchObject({ status: 'converted', markdown: 'Hello' });
  });

  it('should convert markdown-only values', () => {
    expect(
      buildRichTextTiptapBackfill({ blocknote: null, markdown: '# Title' }),
    ).toMatchObject({ status: 'converted', markdown: null });
  });

  it('should report text fallbacks for unknown blocks', () => {
    expect(
      buildRichTextTiptapBackfill({
        blocknote: JSON.stringify([
          { type: 'alert', props: {}, content: 'careful', children: [] },
        ]),
        markdown: 'careful',
      }).status,
    ).toBe('textFallback');
  });

  it('should report empty values', () => {
    expect(
      buildRichTextTiptapBackfill({ blocknote: '', markdown: null }),
    ).toEqual({ status: 'empty' });
  });
});
