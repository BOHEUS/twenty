import { FieldMetadataType, type ObjectRecord } from 'twenty-shared/types';

import { RichTextFieldQueryResultGetterHandler } from 'src/engine/api/common/common-result-getters/handlers/field-handlers/rich-text-field-query-result-getter.handler';
import { type FileUrlService } from 'src/engine/core-modules/file/file-url/file-url.service';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';

const baseRecord: ObjectRecord = {
  id: '1',
  createdAt: '2021-01-01',
  updatedAt: '2021-01-01',
  deletedAt: null,
};

const richTextFieldMetadata = [
  {
    type: FieldMetadataType.RICH_TEXT,
    name: 'bodyV2',
  },
] as FlatFieldMetadata[];

const mockFileUrlService = {
  signFileByIdUrl: jest.fn().mockReturnValue('signed-path'),
} as unknown as FileUrlService;

describe('RichTextFieldQueryResultGetterHandler', () => {
  let handler: RichTextFieldQueryResultGetterHandler;

  beforeEach(() => {
    process.env.SERVER_URL = 'https://my-domain.twenty.com';
    handler = new RichTextFieldQueryResultGetterHandler(mockFileUrlService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.SERVER_URL;
  });

  describe('should return record unchanged', () => {
    it('when no RICH_TEXT field metadata is present', async () => {
      const record = {
        ...baseRecord,
        bodyV2: { tiptap: '{"type":"doc"}', markdown: null },
      };

      const result = await handler.handle(record, 'ws-1', []);

      expect(result).toEqual(record);
    });

    it.each([
      ['tiptap is null', null],
      ['tiptap is not a string', 42],
      ['tiptap is invalid JSON', 'not-json'],
      ['tiptap is not a document', '[{"type":"paragraph"}]'],
    ])('when %s', async (_, tiptap) => {
      const record = {
        ...baseRecord,
        bodyV2: { tiptap, markdown: null },
      };

      const result = await handler.handle(
        record,
        'ws-1',
        richTextFieldMetadata,
      );

      expect(result).toEqual(record);
      expect(mockFileUrlService.signFileByIdUrl).not.toHaveBeenCalled();
    });

    it('when the field value is null', async () => {
      const record = { ...baseRecord, bodyV2: null };

      const result = await handler.handle(
        record,
        'ws-1',
        richTextFieldMetadata,
      );

      expect(result).toEqual(record);
    });
  });

  describe('should handle multiple RICH_TEXT fields', () => {
    it('when only some fields reference workspace files', async () => {
      const fileId = '20202020-0000-4000-8000-000000000002';
      const multiFieldMetadata = [
        { type: FieldMetadataType.RICH_TEXT, name: 'bodyV2' },
        { type: FieldMetadataType.RICH_TEXT, name: 'description' },
      ] as FlatFieldMetadata[];

      const record = {
        ...baseRecord,
        bodyV2: {
          markdown: 'Hello',
          tiptap: JSON.stringify({
            type: 'doc',
            content: [
              { type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] },
            ],
          }),
        },
        description: {
          markdown: null,
          tiptap: JSON.stringify({
            type: 'doc',
            content: [
              {
                type: 'image',
                attrs: {
                  src: `https://my-domain.twenty.com/file/files-field/${fileId}`,
                },
              },
            ],
          }),
        },
      };

      const result = await handler.handle(record, 'ws-1', multiFieldMetadata);

      expect(result.bodyV2).toEqual(record.bodyV2);
      expect(JSON.parse(result.description.tiptap).content[0].attrs.src).toBe(
        'signed-path',
      );
    });
  });

  describe('should sign tiptap file references', () => {
    it('when nested image and file nodes point to workspace files', async () => {
      const fileId = '20202020-0000-4000-8000-000000000001';
      const fileUrl = `https://my-domain.twenty.com/file/files-field/${fileId}`;
      const record = {
        ...baseRecord,
        bodyV2: {
          markdown: null,
          tiptap: JSON.stringify({
            type: 'doc',
            content: [
              {
                type: 'blockquote',
                content: [{ type: 'image', attrs: { src: fileUrl } }],
              },
              { type: 'file', attrs: { url: fileUrl, name: 'a.pdf' } },
              {
                type: 'image',
                attrs: { src: 'https://external.com/image.jpg' },
              },
            ],
          }),
        },
      };

      const result = await handler.handle(
        record,
        'ws-1',
        richTextFieldMetadata,
      );

      expect(JSON.parse(result.bodyV2.tiptap)).toEqual({
        type: 'doc',
        content: [
          {
            type: 'blockquote',
            content: [{ type: 'image', attrs: { src: 'signed-path' } }],
          },
          { type: 'file', attrs: { url: 'signed-path', name: 'a.pdf' } },
          {
            type: 'image',
            attrs: { src: 'https://external.com/image.jpg' },
          },
        ],
      });
      expect(mockFileUrlService.signFileByIdUrl).toHaveBeenCalledTimes(2);
    });
  });
});
