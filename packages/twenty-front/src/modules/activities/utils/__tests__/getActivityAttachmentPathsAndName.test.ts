import { getActivityAttachmentPathsAndName } from '@/activities/utils/getActivityAttachmentPathsAndName';

describe('getActivityAttachmentPathsAndName', () => {
  it('should return the image and file paths and names from the document', () => {
    const activityBody = JSON.stringify({
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'test' }] },
        {
          type: 'image',
          attrs: {
            src: 'https://example.com/files/image/image.jpg?queryParam=value',
            title: 'image',
          },
        },
        {
          type: 'blockquote',
          content: [
            {
              type: 'file',
              attrs: {
                url: 'https://example.com/files/file/file.pdf?queryParam=value',
                name: 'file',
              },
            },
          ],
        },
      ],
    });
    const res = getActivityAttachmentPathsAndName(activityBody);

    expect(res).toEqual([
      {
        path: 'https://example.com/files/image/image.jpg?queryParam=value',
        name: 'image',
      },
      {
        path: 'https://example.com/files/file/file.pdf?queryParam=value',
        name: 'file',
      },
    ]);
  });
});
