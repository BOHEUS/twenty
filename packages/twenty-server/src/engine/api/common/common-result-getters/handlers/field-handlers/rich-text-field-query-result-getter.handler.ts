import { isNonEmptyString } from '@sniptt/guards';
import {
  FieldMetadataType,
  FileFolder,
  type ObjectRecord,
} from 'twenty-shared/types';
import {
  isDefined,
  isPlainObject,
  parseTipTapJsonDocument,
  TIPTAP_NODE_TYPES,
  type TipTapNode,
} from 'twenty-shared/utils';

import { type QueryResultGetterHandlerInterface } from 'src/engine/api/graphql/workspace-query-runner/factories/query-result-getters/interfaces/query-result-getter-handler.interface';

import { type FileUrlService } from 'src/engine/core-modules/file/file-url/file-url.service';
import { extractFileIdFromUrl } from 'src/engine/core-modules/file/files-field/utils/extract-file-id-from-url.util';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';

// oxlint-disable-next-line typescript/no-explicit-any
type RichTextBlock = Record<string, any>;

const parseBlocknoteJsonSafely = (
  blocknoteJson: string,
): RichTextBlock[] | null => {
  try {
    const parsed = JSON.parse(blocknoteJson);

    if (!Array.isArray(parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

export class RichTextFieldQueryResultGetterHandler implements QueryResultGetterHandlerInterface {
  constructor(private readonly fileUrlService: FileUrlService) {}

  async handle(
    record: ObjectRecord,
    workspaceId: string,
    flatFieldMetadata: FlatFieldMetadata[],
  ): Promise<ObjectRecord> {
    const richTextFields = flatFieldMetadata.filter(
      (field) => field.type === FieldMetadataType.RICH_TEXT,
    );

    if (richTextFields.length === 0) {
      return record;
    }

    for (const field of richTextFields) {
      const fieldValue = record[field.name];

      if (!isPlainObject(fieldValue)) {
        continue;
      }

      record[field.name] = {
        ...fieldValue,
        ...(await this.signBlocknoteValue(fieldValue?.blocknote, workspaceId)),
        ...(await this.signTipTapValue(fieldValue?.tiptap, workspaceId)),
      };
    }

    return record;
  }

  private async signBlocknoteValue(
    blocknoteJson: unknown,
    workspaceId: string,
  ): Promise<{ blocknote?: string }> {
    if (!isNonEmptyString(blocknoteJson)) {
      return {};
    }

    const blocknoteBlocks = parseBlocknoteJsonSafely(blocknoteJson);

    if (!isDefined(blocknoteBlocks)) {
      return {};
    }

    const signedBlocks = await this.signBlocknoteImageUrls(
      blocknoteBlocks,
      workspaceId,
    );

    return { blocknote: JSON.stringify(signedBlocks) };
  }

  private async signTipTapValue(
    tiptapJson: unknown,
    workspaceId: string,
  ): Promise<{ tiptap?: string }> {
    if (!isNonEmptyString(tiptapJson)) {
      return {};
    }

    const document = parseTipTapJsonDocument(tiptapJson);

    if (!isDefined(document)) {
      return {};
    }

    return {
      tiptap: JSON.stringify(await this.signTipTapNode(document, workspaceId)),
    };
  }

  private async signFileUrl(
    url: unknown,
    workspaceId: string,
  ): Promise<string | undefined> {
    if (!isNonEmptyString(url)) {
      return undefined;
    }

    const fileId = extractFileIdFromUrl(url, FileFolder.FilesField);

    if (!isDefined(fileId)) {
      return undefined;
    }

    return this.fileUrlService.signFileByIdUrl({
      fileId,
      workspaceId,
      fileFolder: FileFolder.FilesField,
    });
  }

  // Documents are depth-limited on write, so recursion is bounded.
  signTipTapNode = async (
    node: TipTapNode,
    workspaceId: string,
  ): Promise<TipTapNode> => {
    const urlAttributeName =
      node.type === TIPTAP_NODE_TYPES.IMAGE
        ? 'src'
        : node.type === TIPTAP_NODE_TYPES.FILE
          ? 'url'
          : undefined;

    const signedUrl = isDefined(urlAttributeName)
      ? await this.signFileUrl(node.attrs?.[urlAttributeName], workspaceId)
      : undefined;

    const signedContent = isDefined(node.content)
      ? await Promise.all(
          node.content.map((child) => this.signTipTapNode(child, workspaceId)),
        )
      : undefined;

    return {
      ...node,
      ...(isDefined(signedUrl) && isDefined(urlAttributeName)
        ? { attrs: { ...node.attrs, [urlAttributeName]: signedUrl } }
        : {}),
      ...(isDefined(signedContent) ? { content: signedContent } : {}),
    };
  };

  signBlocknoteImageUrls = async (
    blocknoteBlocks: RichTextBlock[],
    workspaceId: string,
  ): Promise<RichTextBlock[]> => {
    return Promise.all(
      blocknoteBlocks.map(async (block: RichTextBlock) => {
        const url = await this.signFileUrl(block.props?.url, workspaceId);

        if (!isDefined(url)) {
          return block;
        }

        return {
          ...block,
          props: {
            ...block.props,
            url,
          },
        };
      }),
    );
  };
}
