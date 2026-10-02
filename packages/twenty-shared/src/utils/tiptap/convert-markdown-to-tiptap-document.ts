import MarkdownIt from 'markdown-it';

import { isDefined } from '@/utils/validation/isDefined';

import { type TipTapDocument } from './tiptap-document';
import { TIPTAP_MARK_TYPES, type TipTapMark } from './tiptap-mark-types';
import { type TipTapNode } from './tiptap-node';
import { TIPTAP_NODE_TYPES } from './tiptap-node-types';

// Raw HTML is parsed only to recover the underline tags our markdown
// serializer emits; any other tag is kept as literal text.
const markdownParser = new MarkdownIt('default', {
  html: true,
  linkify: false,
});

type Token = ReturnType<MarkdownIt['parse']>[number];

const TASK_ITEM_PREFIX_PATTERN = /^\[( |x|X)\] /;

const OPENING_TOKEN_NODE_TYPES: Record<string, string> = {
  paragraph_open: TIPTAP_NODE_TYPES.PARAGRAPH,
  blockquote_open: TIPTAP_NODE_TYPES.BLOCKQUOTE,
  bullet_list_open: TIPTAP_NODE_TYPES.BULLET_LIST,
  list_item_open: TIPTAP_NODE_TYPES.LIST_ITEM,
  table_open: TIPTAP_NODE_TYPES.TABLE,
  tr_open: TIPTAP_NODE_TYPES.TABLE_ROW,
};

const INLINE_MARK_TOKEN_TYPES: Record<string, TipTapMark['type']> = {
  strong: TIPTAP_MARK_TYPES.BOLD,
  em: TIPTAP_MARK_TYPES.ITALIC,
  s: TIPTAP_MARK_TYPES.STRIKE,
};

const appendChild = (parent: TipTapNode, child: TipTapNode) => {
  parent.content = [...(parent.content ?? []), child];
};

const buildTextNode = (text: string, marks: TipTapMark[]): TipTapNode => ({
  type: TIPTAP_NODE_TYPES.TEXT,
  text,
  ...(marks.length > 0 ? { marks: [...marks] } : {}),
});

const convertInlineTokens = (tokens: Token[]): TipTapNode[] => {
  const nodes: TipTapNode[] = [];
  let activeMarks: TipTapMark[] = [];

  const addMark = (mark: TipTapMark) => {
    activeMarks = [...activeMarks, mark];
  };

  const removeMark = (markType: TipTapMark['type']) => {
    const index = activeMarks.map((mark) => mark.type).lastIndexOf(markType);

    activeMarks = activeMarks.filter((_, markIndex) => markIndex !== index);
  };

  const appendText = (text: string, marks: TipTapMark[] = activeMarks) => {
    if (text !== '') {
      nodes.push(buildTextNode(text, marks));
    }
  };

  for (const token of tokens) {
    const markTokenType = token.type.replace(/_(open|close)$/, '');
    const inlineMarkType = INLINE_MARK_TOKEN_TYPES[markTokenType];

    if (isDefined(inlineMarkType)) {
      if (token.nesting === 1) {
        addMark({ type: inlineMarkType });
      } else {
        removeMark(inlineMarkType);
      }
      continue;
    }

    switch (token.type) {
      case 'text':
        appendText(token.content);
        break;
      case 'code_inline':
        appendText(token.content, [
          ...activeMarks,
          { type: TIPTAP_MARK_TYPES.CODE },
        ]);
        break;
      case 'softbreak':
      case 'hardbreak':
        nodes.push({ type: TIPTAP_NODE_TYPES.HARD_BREAK });
        break;
      case 'link_open':
        addMark({
          type: TIPTAP_MARK_TYPES.LINK,
          attrs: { href: token.attrGet('href') ?? '' },
        });
        break;
      case 'link_close':
        removeMark(TIPTAP_MARK_TYPES.LINK);
        break;
      case 'image':
        nodes.push({
          type: TIPTAP_NODE_TYPES.IMAGE,
          attrs: {
            src: token.attrGet('src') ?? '',
            alt: token.content,
            title: token.attrGet('title') ?? '',
          },
        });
        break;
      case 'html_inline': {
        const tag = token.content.trim().toLowerCase();

        if (tag === '<u>') {
          addMark({ type: TIPTAP_MARK_TYPES.UNDERLINE });
        } else if (tag === '</u>') {
          removeMark(TIPTAP_MARK_TYPES.UNDERLINE);
        } else if (/^<br\s*\/?>$/.test(tag)) {
          nodes.push({ type: TIPTAP_NODE_TYPES.HARD_BREAK });
        } else {
          appendText(token.content);
        }
        break;
      }
      default:
        appendText(token.content);
    }
  }

  return nodes;
};

// TipTap images are block nodes, so markdown images split their paragraph.
const splitTextBlockAroundImages = (node: TipTapNode): TipTapNode[] => {
  if (
    !(node.content ?? []).some(
      (child) => child.type === TIPTAP_NODE_TYPES.IMAGE,
    )
  ) {
    return [node];
  }

  const blocks: TipTapNode[] = [];
  let pendingInlineNodes: TipTapNode[] = [];

  const flushPendingInlineNodes = () => {
    const hasText = pendingInlineNodes.some(
      (child) =>
        child.type !== TIPTAP_NODE_TYPES.HARD_BREAK &&
        child.text?.trim() !== '',
    );

    if (hasText) {
      blocks.push({ ...node, content: pendingInlineNodes });
    }

    pendingInlineNodes = [];
  };

  for (const child of node.content ?? []) {
    if (child.type === TIPTAP_NODE_TYPES.IMAGE) {
      flushPendingInlineNodes();
      blocks.push(child);
    } else {
      pendingInlineNodes.push(child);
    }
  }

  flushPendingInlineNodes();

  return blocks;
};

const getFirstTextNode = (listItem: TipTapNode): TipTapNode | undefined =>
  listItem.content?.[0]?.content?.[0];

const convertListItemToTaskItem = (item: TipTapNode): TipTapNode => {
  const [firstBlock, ...otherBlocks] = item.content ?? [];
  const [firstInlineNode, ...otherInlineNodes] = firstBlock?.content ?? [];
  const firstText = firstInlineNode?.text ?? '';
  const remainingText = firstText.replace(TASK_ITEM_PREFIX_PATTERN, '');
  const inlineNodes: TipTapNode[] = [
    ...(isDefined(firstInlineNode) && remainingText !== ''
      ? [{ ...firstInlineNode, text: remainingText }]
      : []),
    ...otherInlineNodes,
  ];
  const firstParagraph: TipTapNode = {
    type: TIPTAP_NODE_TYPES.PARAGRAPH,
    ...(inlineNodes.length > 0 ? { content: inlineNodes } : {}),
  };

  return {
    type: TIPTAP_NODE_TYPES.TASK_ITEM,
    attrs: { checked: /^\[(x|X)\]/.test(firstText) },
    content: [firstParagraph, ...otherBlocks],
  };
};

const convertBulletListToTaskListIfChecklist = (
  list: TipTapNode,
): TipTapNode => {
  const items = list.content ?? [];
  const isChecklist =
    items.length > 0 &&
    items.every((item) =>
      TASK_ITEM_PREFIX_PATTERN.test(getFirstTextNode(item)?.text ?? ''),
    );

  if (!isChecklist) {
    return list;
  }

  return {
    type: TIPTAP_NODE_TYPES.TASK_LIST,
    content: items.map(convertListItemToTaskItem),
  };
};

const finalizeNode = (node: TipTapNode): TipTapNode[] => {
  if (
    node.type === TIPTAP_NODE_TYPES.PARAGRAPH ||
    node.type === TIPTAP_NODE_TYPES.HEADING
  ) {
    return splitTextBlockAroundImages(node);
  }

  if (node.type === TIPTAP_NODE_TYPES.BULLET_LIST) {
    return [convertBulletListToTaskListIfChecklist(node)];
  }

  return [node];
};

const buildOpeningNode = (token: Token): TipTapNode | undefined => {
  const nodeType = OPENING_TOKEN_NODE_TYPES[token.type];

  if (isDefined(nodeType)) {
    return { type: nodeType };
  }

  switch (token.type) {
    case 'heading_open':
      return {
        type: TIPTAP_NODE_TYPES.HEADING,
        attrs: { level: Number(token.tag.slice(1)) },
      };
    case 'ordered_list_open': {
      const start = Number(token.attrGet('start') ?? 1);

      return {
        type: TIPTAP_NODE_TYPES.ORDERED_LIST,
        ...(start !== 1 ? { attrs: { start } } : {}),
      };
    }
    case 'th_open':
    case 'td_open':
      return {
        type:
          token.type === 'th_open'
            ? TIPTAP_NODE_TYPES.TABLE_HEADER
            : TIPTAP_NODE_TYPES.TABLE_CELL,
      };
    default:
      return undefined;
  }
};

const isTableCellType = (type: string) =>
  type === TIPTAP_NODE_TYPES.TABLE_HEADER ||
  type === TIPTAP_NODE_TYPES.TABLE_CELL;

export const convertMarkdownToTipTapDocument = (
  markdown: string,
): TipTapDocument => {
  const document: TipTapDocument = { type: TIPTAP_NODE_TYPES.DOCUMENT };
  const openNodes: TipTapNode[] = [document];
  // Wrapper tokens such as thead open no node, so closing tokens only pop
  // what their opening token pushed.
  const openTokenPushedNode: boolean[] = [];
  const currentNode = () => openNodes[openNodes.length - 1] ?? document;

  for (const token of markdownParser.parse(markdown, {})) {
    if (token.nesting === 1) {
      const openingNode = buildOpeningNode(token);

      openTokenPushedNode.push(isDefined(openingNode));

      if (isDefined(openingNode)) {
        openNodes.push(openingNode);
      }
      continue;
    }

    if (token.nesting === -1) {
      const closedNode =
        openTokenPushedNode.pop() === true ? openNodes.pop() : undefined;

      if (isDefined(closedNode)) {
        finalizeNode(closedNode).forEach((node) =>
          appendChild(currentNode(), node),
        );
      }
      continue;
    }

    switch (token.type) {
      case 'inline': {
        const inlineNodes = convertInlineTokens(token.children ?? []);
        const parent = currentNode();

        if (isTableCellType(parent.type)) {
          appendChild(parent, {
            type: TIPTAP_NODE_TYPES.PARAGRAPH,
            ...(inlineNodes.length > 0 ? { content: inlineNodes } : {}),
          });
        } else {
          inlineNodes.forEach((node) => appendChild(parent, node));
        }
        break;
      }
      case 'fence':
      case 'code_block': {
        const code = token.content.replace(/\n$/, '');
        const language = token.info.trim();

        appendChild(currentNode(), {
          type: TIPTAP_NODE_TYPES.CODE_BLOCK,
          attrs: { language: language === '' ? null : language },
          ...(code === ''
            ? {}
            : { content: [{ type: TIPTAP_NODE_TYPES.TEXT, text: code }] }),
        });
        break;
      }
      case 'hr':
        appendChild(currentNode(), { type: TIPTAP_NODE_TYPES.DIVIDER });
        break;
      case 'html_block': {
        const text = token.content.trim();

        if (text !== '') {
          appendChild(currentNode(), {
            type: TIPTAP_NODE_TYPES.PARAGRAPH,
            content: [{ type: TIPTAP_NODE_TYPES.TEXT, text }],
          });
        }
        break;
      }
    }
  }

  return document;
};
