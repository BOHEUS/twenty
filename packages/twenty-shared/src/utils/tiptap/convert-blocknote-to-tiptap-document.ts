import { isString, isNumber } from '@sniptt/guards';
import { isPlainObject } from '@/utils/typeguard/isPlainObject';
import { isDefined } from '@/utils/validation/isDefined';

import { BLOCKNOTE_LIST_ITEM_TYPE_TO_TIPTAP_LIST_TYPE } from './blocknote-list-item-type-to-tiptap-list-type';
import { extractPlainText } from './extract-plain-text';
import { type RichTextConversionResult } from './rich-text-conversion-result';
import { RICH_TEXT_DOCUMENT_LIMITS } from './rich-text-document-limits';
import { TIPTAP_MARK_TYPES, type TipTapMark } from './tiptap-mark-types';
import { type TipTapNode } from './tiptap-node';
import { TIPTAP_NODE_TYPES } from './tiptap-node-types';

type ConversionContext = {
  fallbackCount: number;
};

const BLOCKNOTE_BOOLEAN_STYLES = [
  TIPTAP_MARK_TYPES.BOLD,
  TIPTAP_MARK_TYPES.ITALIC,
  TIPTAP_MARK_TYPES.UNDERLINE,
  TIPTAP_MARK_TYPES.STRIKE,
  TIPTAP_MARK_TYPES.CODE,
] as const;

const BLOCKNOTE_FILE_BLOCK_CATEGORIES: Record<string, string> = {
  video: 'VIDEO',
  audio: 'AUDIO',
};

const isBlockNoteListItemType = (
  type: unknown,
): type is keyof typeof BLOCKNOTE_LIST_ITEM_TYPE_TO_TIPTAP_LIST_TYPE =>
  isString(type) &&
  Object.prototype.hasOwnProperty.call(
    BLOCKNOTE_LIST_ITEM_TYPE_TO_TIPTAP_LIST_TYPE,
    type,
  );

const isListNodeType = (type: string) =>
  Object.values(BLOCKNOTE_LIST_ITEM_TYPE_TO_TIPTAP_LIST_TYPE).some(
    (listType) => listType === type,
  );

const getColor = (value: unknown): string | undefined =>
  isString(value) && value !== '' && value !== 'default' ? value : undefined;

const buildColorMarks = (source: Record<string, unknown>): TipTapMark[] => {
  const textColor = getColor(source.textColor);
  const backgroundColor = getColor(source.backgroundColor);

  return [
    ...(isDefined(textColor)
      ? [{ type: TIPTAP_MARK_TYPES.TEXT_STYLE, attrs: { color: textColor } }]
      : []),
    ...(isDefined(backgroundColor)
      ? [
          {
            type: TIPTAP_MARK_TYPES.HIGHLIGHT,
            attrs: { color: backgroundColor },
          },
        ]
      : []),
  ];
};

const buildStyleMarks = (styles: unknown): TipTapMark[] => {
  if (!isPlainObject(styles)) {
    return [];
  }

  return [
    ...BLOCKNOTE_BOOLEAN_STYLES.filter((style) => styles[style] === true).map(
      (type) => ({ type }),
    ),
    ...buildColorMarks(styles),
  ];
};

const mergeMarks = (
  outerMarks: TipTapMark[],
  innerMarks: TipTapMark[],
): TipTapMark[] => [
  ...outerMarks.filter(
    (outerMark) =>
      !innerMarks.some((innerMark) => innerMark.type === outerMark.type),
  ),
  ...innerMarks,
];

const buildTextNodes = (text: string, marks: TipTapMark[]): TipTapNode[] =>
  text.split('\n').flatMap((line, index) => [
    ...(index > 0 ? [{ type: TIPTAP_NODE_TYPES.HARD_BREAK }] : []),
    ...(line === ''
      ? []
      : [
          {
            type: TIPTAP_NODE_TYPES.TEXT,
            text: line,
            ...(marks.length > 0 ? { marks } : {}),
          },
        ]),
  ]);

const convertInlineContent = (
  content: unknown,
  marks: TipTapMark[],
  context: ConversionContext,
): TipTapNode[] => {
  if (isString(content)) {
    return buildTextNodes(content, marks);
  }

  if (!Array.isArray(content)) {
    return [];
  }

  return content.flatMap((item): TipTapNode[] => {
    if (!isPlainObject(item)) {
      return isString(item) ? buildTextNodes(item, marks) : [];
    }

    if (item.type === 'text' && isString(item.text)) {
      return buildTextNodes(
        item.text,
        mergeMarks(marks, buildStyleMarks(item.styles)),
      );
    }

    if (item.type === 'link' && isString(item.href)) {
      return convertInlineContent(
        item.content,
        mergeMarks(marks, [
          { type: TIPTAP_MARK_TYPES.LINK, attrs: { href: item.href } },
        ]),
        context,
      );
    }

    if (item.type === 'mention' && isPlainObject(item.props)) {
      return [
        {
          type: TIPTAP_NODE_TYPES.MENTION_TAG,
          attrs: {
            recordId: item.props.recordId ?? '',
            objectMetadataId: item.props.objectMetadataId ?? '',
            objectNameSingular: item.props.objectNameSingular ?? '',
            label: item.props.label ?? '',
          },
        },
      ];
    }

    context.fallbackCount++;

    return buildTextNodes(extractPlainText(item), marks);
  });
};

const buildTextBlock = (
  type: string,
  attrs: Record<string, unknown> | undefined,
  content: TipTapNode[],
): TipTapNode => ({
  type,
  ...(isDefined(attrs) && Object.keys(attrs).length > 0 ? { attrs } : {}),
  ...(content.length > 0 ? { content } : {}),
});

const getTextAlignAttrs = (
  props: Record<string, unknown>,
): Record<string, unknown> =>
  isString(props.textAlignment) && props.textAlignment !== 'left'
    ? { textAlign: props.textAlignment }
    : {};

const buildFallbackParagraphs = (
  value: unknown,
  context: ConversionContext,
): TipTapNode[] => {
  context.fallbackCount++;

  const text = extractPlainText(value);

  return text === ''
    ? []
    : [
        buildTextBlock(TIPTAP_NODE_TYPES.PARAGRAPH, undefined, [
          { type: TIPTAP_NODE_TYPES.TEXT, text },
        ]),
      ];
};

const convertTableCell = (
  cell: unknown,
  cellType: string,
  marks: TipTapMark[],
  context: ConversionContext,
): TipTapNode => {
  const cellContent =
    isPlainObject(cell) && cell.type === 'tableCell' ? cell.content : cell;

  return {
    type: cellType,
    content: [
      buildTextBlock(
        TIPTAP_NODE_TYPES.PARAGRAPH,
        undefined,
        convertInlineContent(cellContent, marks, context),
      ),
    ],
  };
};

const convertTable = (
  content: unknown,
  marks: TipTapMark[],
  context: ConversionContext,
): TipTapNode[] => {
  if (!isPlainObject(content) || !Array.isArray(content.rows)) {
    return buildFallbackParagraphs(content, context);
  }

  const headerRowCount = isNumber(content.headerRows) ? content.headerRows : 0;

  const rows = content.rows.flatMap((row, rowIndex): TipTapNode[] =>
    isPlainObject(row) && Array.isArray(row.cells)
      ? [
          {
            type: TIPTAP_NODE_TYPES.TABLE_ROW,
            content: row.cells.map((cell) =>
              convertTableCell(
                cell,
                rowIndex < headerRowCount
                  ? TIPTAP_NODE_TYPES.TABLE_HEADER
                  : TIPTAP_NODE_TYPES.TABLE_CELL,
                marks,
                context,
              ),
            ),
          },
        ]
      : [],
  );

  return rows.length > 0
    ? [{ type: TIPTAP_NODE_TYPES.TABLE, content: rows }]
    : [];
};

const convertBlockContent = (
  block: Record<string, unknown>,
  props: Record<string, unknown>,
  childNodes: TipTapNode[],
  context: ConversionContext,
): TipTapNode[] => {
  const blockMarks = buildColorMarks(props);
  const inlineContent = convertInlineContent(
    block.content,
    blockMarks,
    context,
  );

  if (isBlockNoteListItemType(block.type)) {
    const listType = BLOCKNOTE_LIST_ITEM_TYPE_TO_TIPTAP_LIST_TYPE[block.type];
    const isTask = block.type === 'checkListItem';
    const start =
      block.type === 'numberedListItem' &&
      isNumber(props.start) &&
      props.start !== 1
        ? props.start
        : undefined;

    return [
      {
        type: listType,
        ...(isDefined(start) ? { attrs: { start } } : {}),
        content: [
          {
            type: isTask
              ? TIPTAP_NODE_TYPES.TASK_ITEM
              : TIPTAP_NODE_TYPES.LIST_ITEM,
            ...(isTask ? { attrs: { checked: props.checked === true } } : {}),
            content: [
              buildTextBlock(
                TIPTAP_NODE_TYPES.PARAGRAPH,
                undefined,
                inlineContent,
              ),
              ...childNodes,
            ],
          },
        ],
      },
    ];
  }

  switch (block.type) {
    case 'paragraph':
      return [
        buildTextBlock(
          TIPTAP_NODE_TYPES.PARAGRAPH,
          getTextAlignAttrs(props),
          inlineContent,
        ),
        ...childNodes,
      ];
    case 'heading': {
      const level = isNumber(props.level)
        ? Math.min(Math.max(Math.round(props.level), 1), 6)
        : 1;

      return [
        buildTextBlock(
          TIPTAP_NODE_TYPES.HEADING,
          { level, ...getTextAlignAttrs(props) },
          inlineContent,
        ),
        ...childNodes,
      ];
    }
    case 'quote':
      return [
        {
          type: TIPTAP_NODE_TYPES.BLOCKQUOTE,
          content: [
            buildTextBlock(
              TIPTAP_NODE_TYPES.PARAGRAPH,
              undefined,
              inlineContent,
            ),
          ],
        },
        ...childNodes,
      ];
    case 'codeBlock': {
      const code = Array.isArray(block.content)
        ? block.content
            .map((item) =>
              isPlainObject(item) && isString(item.text) ? item.text : '',
            )
            .join('')
        : '';

      return [
        {
          type: TIPTAP_NODE_TYPES.CODE_BLOCK,
          attrs: {
            language: isString(props.language) ? props.language : null,
          },
          ...(code === ''
            ? {}
            : { content: [{ type: TIPTAP_NODE_TYPES.TEXT, text: code }] }),
        },
        ...childNodes,
      ];
    }
    case 'table':
      return [
        ...convertTable(block.content, blockMarks, context),
        ...childNodes,
      ];
    case 'image':
      return [
        {
          type: TIPTAP_NODE_TYPES.IMAGE,
          attrs: {
            src: isString(props.url) ? props.url : '',
            align: isString(props.textAlignment) ? props.textAlignment : 'left',
            alt: isString(props.caption) ? props.caption : '',
            title: isString(props.name) ? props.name : '',
            width: isNumber(props.previewWidth) ? props.previewWidth : null,
          },
        },
        ...childNodes,
      ];
    case 'file':
    case 'video':
    case 'audio':
      return [
        {
          type: TIPTAP_NODE_TYPES.FILE,
          attrs: {
            url: isString(props.url) ? props.url : '',
            name: isString(props.name) ? props.name : '',
            fileCategory: isString(props.fileCategory)
              ? props.fileCategory
              : (BLOCKNOTE_FILE_BLOCK_CATEGORIES[block.type] ?? 'OTHER'),
          },
        },
        ...childNodes,
      ];
    case 'divider':
      return [{ type: TIPTAP_NODE_TYPES.DIVIDER }, ...childNodes];
    default:
      return [
        ...buildFallbackParagraphs(block.content, context),
        ...childNodes,
      ];
  }
};

const mergeAdjacentLists = (nodes: TipTapNode[]): TipTapNode[] =>
  nodes.reduce<TipTapNode[]>((mergedNodes, node) => {
    const previousNode = mergedNodes[mergedNodes.length - 1];

    // Mirrors BlockNote, which ignores the start of a numbered item that
    // follows another one.
    if (
      isDefined(previousNode) &&
      isListNodeType(node.type) &&
      previousNode.type === node.type
    ) {
      mergedNodes[mergedNodes.length - 1] = {
        ...previousNode,
        content: [...(previousNode.content ?? []), ...(node.content ?? [])],
      };
    } else {
      mergedNodes.push(node);
    }

    return mergedNodes;
  }, []);

const convertBlocks = (
  blocks: unknown[],
  nestingLevel: number,
  context: ConversionContext,
): TipTapNode[] =>
  mergeAdjacentLists(
    blocks.flatMap((block): TipTapNode[] => {
      if (!isPlainObject(block)) {
        return buildFallbackParagraphs(block, context);
      }

      if (
        nestingLevel >= RICH_TEXT_DOCUMENT_LIMITS.maxLegacyBlockNestingLevel
      ) {
        return buildFallbackParagraphs(block, context);
      }

      const props = isPlainObject(block.props) ? block.props : {};
      const childNodes = Array.isArray(block.children)
        ? convertBlocks(block.children, nestingLevel + 1, context)
        : [];

      return convertBlockContent(block, props, childNodes, context);
    }),
  );

export const convertBlockNoteToTipTapDocument = (
  blocks: unknown[],
): RichTextConversionResult => {
  const context: ConversionContext = { fallbackCount: 0 };
  const content = convertBlocks(blocks, 0, context);

  return {
    document: {
      type: TIPTAP_NODE_TYPES.DOCUMENT,
      ...(content.length > 0 ? { content } : {}),
    },
    fallbackCount: context.fallbackCount,
  };
};
