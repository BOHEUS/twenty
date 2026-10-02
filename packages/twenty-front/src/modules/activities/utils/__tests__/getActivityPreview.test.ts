import { getActivityPreview } from '@/activities/utils/getActivityPreview';

const paragraph = (content: unknown[]) => ({ type: 'paragraph', content });

describe('getActivityPreview', () => {
  it('should return an empty string for empty values', () => {
    expect(getActivityPreview(null)).toEqual('');
    expect(getActivityPreview({ tiptap: null, markdown: null })).toEqual('');
    expect(
      getActivityPreview({ tiptap: '{"type":"doc"}', markdown: '' }),
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

    expect(getActivityPreview({ tiptap, markdown: null })).toEqual(
      'first line\nsecond\nlink',
    );
  });

  it('should fall back to markdown when there is no tiptap document', () => {
    expect(getActivityPreview({ markdown: '# Title' })).toEqual('Title');
  });
});
