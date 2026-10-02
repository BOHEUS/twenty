import { extractRichTextDocumentFileIds } from 'src/engine/core-modules/record-transformer/utils/extract-rich-text-document-file-ids.util';

describe('extractRichTextDocumentFileIds', () => {
  it('should collect unique workspace file ids from images and files', () => {
    const firstFileId = '20202020-0000-4000-8000-000000000001';
    const secondFileId = '20202020-0000-4000-8000-000000000002';
    const fileUrl = (fileId: string) =>
      `https://my-domain.twenty.com/file/files-field/${fileId}`;

    expect(
      extractRichTextDocumentFileIds({
        type: 'doc',
        content: [
          { type: 'image', attrs: { src: fileUrl(firstFileId) } },
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [
                  { type: 'file', attrs: { url: fileUrl(secondFileId) } },
                  { type: 'image', attrs: { src: fileUrl(firstFileId) } },
                ],
              },
            ],
          },
          { type: 'image', attrs: { src: 'https://external.com/a.png' } },
        ],
      }),
    ).toEqual([firstFileId, secondFileId]);
  });
});
