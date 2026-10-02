import { isString, isNumber } from '@sniptt/guards';
import { isDefined } from '@/utils/validation/isDefined';

import { type BlockNoteBlock } from './blocknote-block';
import { extractPlainText } from './extract-plain-text';
import { RICH_TEXT_DOCUMENT_LIMITS } from './rich-text-document-limits';
import { type TipTapDocument } from './tiptap-document';
import { TIPTAP_MARK_TYPES } from './tiptap-mark-types';
import { type TipTapNode } from './tiptap-node';
import { TIPTAP_NODE_TYPES } from './tiptap-node-types';

type BlockNoteInlineContent = Record<string, unknown>;

const TIPTAP_LIST_TYPE_TO_BLOCKNOTE_LIST_ITEM_TYPE: Record<string, string> = {
  [TIPTAP_NODE_TYPES.BULLET_LIST]: 'bulletListItem',
  [TIPTAP_NODE_TYPES.ORDERED_LIST]: 'numberedListItem',
  [TIPTAP_NODE_TYPES.TASK_LIST]: 'checkListItem',
};

const BOOLEAN_STYLE_MARK_TYPES: string[] = [
  TIPTAP_MARK_TYPES.BOLD,
  TIPTAP_MARK_TYPES.ITALIC,
  TIPTAP_MARK_TYPES.UNDERLINE,
  TIPTAP_MARK_TYPES.STRIKE,
  TIPTAP_MARK_TYPES.CODE,
];

const buildStyles = (node: TipTapNode): Record<string, unknown> =>
  Object.fromEntries(
    (node.marks ?? []).flatMap((mark): [string, unknown][] => {
      if (BOOLEAN_STYLE_MARK_TYPES.includes(mark.type)) {
        return [[mark.type, true]];
      }

      const color =
        isDefined(mark.attrs) && 'color' in mark.attrs
          ? mark.attrs.color
          : undefined;

      if (!isString(color)) {
        return [];
      }

      if (mark.type === TIPTAP_MARK_TYPES.TEXT_STYLE) {
        return [['textColor', color]];
      }

      return mark.type === TIPTAP_MARK_TYPES.HIGHLIGHT
        ? [['backgroundColor', color]]
        : [];
    }),
  );

const buildText = (text: string): BlockNoteInlineContent => ({
  type: 'text',
  text,
  styles: {},
});

const convertInlineNode = (node: TipTapNode): BlockNoteInlineContent[] => {
  switch (node.type) {
    case TIPTAP_NODE_TYPES.TEXT: {
      const text = {
        type: 'text',
        text: node.text ?? '',
        styles: buildStyles(node),
      };
      const href = node.marks?.find(
        (mark) => mark.type === TIPTAP_MARK_TYPES.LINK,
      )?.attrs?.href;

      return [isString(href) ? { type: 'link', href, content: [text] } : text];
    }
    case TIPTAP_NODE_TYPES.HARD_BREAK:
      return [buildText('\n')];
    case TIPTAP_NODE_TYPES.VARIABLE_TAG:
      return isString(node.attrs?.variable)
        ? [buildText(node.attrs.variable)]
        : [];
    case TIPTAP_NODE_TYPES.MENTION_TAG:
      return [
        {
          type: 'mention',
          props: {
            recordId: node.attrs?.recordId ?? '',
            objectMetadataId: node.attrs?.objectMetadataId ?? '',
            objectNameSingular: node.attrs?.objectNameSingular ?? '',
            label: node.attrs?.label ?? '',
          },
        },
      ];
    default: {
      const text = extractPlainText(node);

      return text === '' ? [] : [buildText(text)];
    }
  }
};

const convertInlineNodes = (nodes: TipTapNode[]): BlockNoteInlineContent[] =>
  nodes.flatMap(convertInlineNode);

const convertBlockInlineContent = (nodes: TipTapNode[]) =>
  nodes.flatMap((node, index) => [
    ...(index > 0 ? [buildText('\n')] : []),
    ...convertInlineNodes(node.content ?? []),
  ]);

const getTextAlignmentProps = (node: TipTapNode): Record<string, unknown> =>
  isString(node.attrs?.textAlign)
    ? { textAlignment: node.attrs.textAlign }
    : {};

const buildBlock = (
  type: string,
  props: Record<string, unknown>,
  content?: unknown,
  children: BlockNoteBlock[] = [],
): BlockNoteBlock => ({
  type,
  props,
  ...(isDefined(content) ? { content } : {}),
  children,
});

const convertListItems = (
  listNode: TipTapNode,
  previousNode: TipTapNode | undefined,
  depth: number,
): BlockNoteBlock[] => {
  const listItemType =
    TIPTAP_LIST_TYPE_TO_BLOCKNOTE_LIST_ITEM_TYPE[listNode.type] ??
    'bulletListItem';
  const start = listNode.attrs?.start;

  // BlockNote numbers a numbered item after another one as its continuation
  // and ignores its start, so only a block in between keeps two adjacent
  // ordered lists apart.
  const separator =
    listNode.type === TIPTAP_NODE_TYPES.ORDERED_LIST &&
    previousNode?.type === TIPTAP_NODE_TYPES.ORDERED_LIST
      ? [buildBlock('paragraph', {}, [])]
      : [];

  const items = (listNode.content ?? []).map((item, index) => {
    const [firstChild, ...otherChildren] = item.content ?? [];
    const hasLeadingParagraph =
      firstChild?.type === TIPTAP_NODE_TYPES.PARAGRAPH;

    const props =
      listNode.type === TIPTAP_NODE_TYPES.TASK_LIST
        ? { checked: item.attrs?.checked === true }
        : index === 0 && isNumber(start) && start !== 1
          ? { start }
          : {};

    return buildBlock(
      listItemType,
      props,
      hasLeadingParagraph ? convertInlineNodes(firstChild.content ?? []) : [],
      convertBlocks(
        hasLeadingParagraph ? otherChildren : (item.content ?? []),
        depth + 1,
      ),
    );
  });

  return [...separator, ...items];
};

const convertTable = (tableNode: TipTapNode): BlockNoteBlock => {
  const rows = tableNode.content ?? [];
  const headerRowCount = rows.findIndex(
    (row) =>
      !(row.content ?? []).every(
        (cell) => cell.type === TIPTAP_NODE_TYPES.TABLE_HEADER,
      ),
  );
  const columnCount = Math.max(
    0,
    ...rows.map((row) => row.content?.length ?? 0),
  );

  return buildBlock(
    'table',
    {},
    {
      type: 'tableContent',
      columnWidths: Array.from({ length: columnCount }, () => null),
      headerRows: headerRowCount === -1 ? rows.length : headerRowCount,
      rows: rows.map((row) => ({
        cells: (row.content ?? []).map((cell) => ({
          type: 'tableCell',
          content: convertBlockInlineContent(cell.content ?? []),
          props: {},
        })),
      })),
    },
  );
};

const convertBlock = (
  node: TipTapNode,
  previousNode: TipTapNode | undefined,
  depth: number,
): BlockNoteBlock[] => {
  if (depth >= RICH_TEXT_DOCUMENT_LIMITS.maxTipTapDepth) {
    const text = extractPlainText(node);

    return text === '' ? [] : [buildBlock('paragraph', {}, [buildText(text)])];
  }

  switch (node.type) {
    case TIPTAP_NODE_TYPES.PARAGRAPH:
      return [
        buildBlock(
          'paragraph',
          getTextAlignmentProps(node),
          convertInlineNodes(node.content ?? []),
        ),
      ];
    case TIPTAP_NODE_TYPES.HEADING:
      return [
        buildBlock(
          'heading',
          {
            level: isNumber(node.attrs?.level) ? node.attrs.level : 1,
            ...getTextAlignmentProps(node),
          },
          convertInlineNodes(node.content ?? []),
        ),
      ];
    case TIPTAP_NODE_TYPES.BULLET_LIST:
    case TIPTAP_NODE_TYPES.ORDERED_LIST:
    case TIPTAP_NODE_TYPES.TASK_LIST:
      return convertListItems(node, previousNode, depth);
    case TIPTAP_NODE_TYPES.BLOCKQUOTE:
      return (node.content ?? []).flatMap((child, index, children) =>
        child.type === TIPTAP_NODE_TYPES.PARAGRAPH ||
        child.type === TIPTAP_NODE_TYPES.HEADING
          ? [buildBlock('quote', {}, convertInlineNodes(child.content ?? []))]
          : convertBlock(child, children[index - 1], depth + 1),
      );
    case TIPTAP_NODE_TYPES.CODE_BLOCK:
      return [
        buildBlock(
          'codeBlock',
          {
            language: isString(node.attrs?.language)
              ? node.attrs.language
              : 'text',
          },
          [buildText(extractPlainText(node.content ?? []))],
        ),
      ];
    case TIPTAP_NODE_TYPES.TABLE:
      return [convertTable(node)];
    case TIPTAP_NODE_TYPES.IMAGE:
      return [
        buildBlock('image', {
          url: node.attrs?.src ?? '',
          textAlignment: node.attrs?.align ?? 'left',
          caption: node.attrs?.alt ?? '',
          name: node.attrs?.title ?? '',
          ...(isNumber(node.attrs?.width)
            ? { previewWidth: node.attrs.width }
            : {}),
        }),
      ];
    case TIPTAP_NODE_TYPES.FILE:
      return [
        buildBlock('file', {
          url: node.attrs?.url ?? '',
          name: node.attrs?.name ?? '',
          fileCategory: node.attrs?.fileCategory ?? 'OTHER',
        }),
      ];
    case TIPTAP_NODE_TYPES.DIVIDER:
      return [buildBlock('divider', {})];
    default: {
      if (isDefined(node.content) && node.content.length > 0) {
        return convertBlocks(node.content, depth + 1);
      }

      const text = extractPlainText(node);

      return text === ''
        ? []
        : [buildBlock('paragraph', {}, [buildText(text)])];
    }
  }
};

const convertBlocks = (nodes: TipTapNode[], depth: number): BlockNoteBlock[] =>
  nodes.flatMap((node, index) => convertBlock(node, nodes[index - 1], depth));

export const convertTipTapDocumentToBlockNote = (
  document: TipTapDocument,
): BlockNoteBlock[] => convertBlocks(document.content ?? [], 1);
