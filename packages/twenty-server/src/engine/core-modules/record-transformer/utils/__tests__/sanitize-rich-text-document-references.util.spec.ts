import { sanitizeRichTextDocumentReferences } from 'src/engine/core-modules/record-transformer/utils/sanitize-rich-text-document-references.util';

const FILE_ID = '20202020-0000-4000-8000-000000000001';
const FILE_URL = `https://my-domain.twenty.com/file/files-field/${FILE_ID}`;

describe('sanitizeRichTextDocumentReferences', () => {
  it('should strip signed tokens from workspace file references at any depth', () => {
    expect(
      sanitizeRichTextDocumentReferences({
        type: 'doc',
        content: [
          {
            type: 'blockquote',
            content: [
              { type: 'image', attrs: { src: `${FILE_URL}?token=abc` } },
            ],
          },
          { type: 'file', attrs: { url: `${FILE_URL}?token=def`, name: 'a' } },
          {
            type: 'image',
            attrs: { src: 'https://external.com/a.png?size=2' },
          },
        ],
      }),
    ).toEqual({
      type: 'doc',
      content: [
        {
          type: 'blockquote',
          content: [{ type: 'image', attrs: { src: FILE_URL } }],
        },
        { type: 'file', attrs: { url: FILE_URL, name: 'a' } },
        {
          type: 'image',
          attrs: { src: 'https://external.com/a.png?size=2' },
        },
      ],
    });
  });

  it('should keep mention ids and drop stored labels', () => {
    expect(
      sanitizeRichTextDocumentReferences({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'mentionTag',
                attrs: {
                  recordId: 'record-id',
                  objectNameSingular: 'company',
                  label: 'Secret Corp',
                  imageUrl: 'https://example.com/logo.png',
                },
              },
            ],
          },
        ],
      }).content?.[0]?.content?.[0],
    ).toEqual({
      type: 'mentionTag',
      attrs: { recordId: 'record-id', objectNameSingular: 'company' },
    });
  });
});
