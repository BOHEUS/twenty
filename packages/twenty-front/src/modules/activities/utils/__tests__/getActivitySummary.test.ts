import { getActivitySummary } from '@/activities/utils/getActivitySummary';

const paragraph = (content: unknown[]) => ({ type: 'paragraph', content });

describe('getActivitySummary', () => {
  it('should return an empty string for empty values', () => {
    expect(getActivitySummary(null)).toEqual('');
    expect(getActivitySummary({ tiptap: null, markdown: null })).toEqual('');
    expect(
      getActivitySummary({ tiptap: '{"type":"doc"}', markdown: '' }),
    ).toEqual('');
  });

  it('should read the tiptap document, skipping empty blocks', () => {
    const tiptap = JSON.stringify({
      type: 'doc',
      content: [
        { type: 'paragraph' },
        paragraph([
          { type: 'text', text: 'first ' },
          { type: 'text', text: 'line', marks: [{ type: 'bold' }] },
        ]),
        paragraph([{ type: 'text', text: 'second' }]),
        paragraph([
          {
            type: 'text',
            text: 'link',
            marks: [{ type: 'link', attrs: { href: 'https://twenty.com' } }],
          },
        ]),
      ],
    });

    expect(getActivitySummary({ tiptap, markdown: null })).toEqual(
      'first line',
    );
  });

  it('should fall back to markdown when there is no tiptap document', () => {
    expect(getActivitySummary({ markdown: '# Title' })).toEqual('Title');
  });
});
