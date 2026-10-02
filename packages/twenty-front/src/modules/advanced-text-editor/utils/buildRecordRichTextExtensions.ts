import { RECORD_RICH_TEXT_SLASH_COMMANDS } from '@/advanced-text-editor/constants/RecordRichTextSlashCommands';
import { DividerNode } from '@/advanced-text-editor/extensions/blocks/DividerNode';
import { FileNode } from '@/advanced-text-editor/extensions/record-rich-text/FileNode';
import { RichTextHighlight } from '@/advanced-text-editor/extensions/record-rich-text/RichTextHighlight';
import { RichTextTextColor } from '@/advanced-text-editor/extensions/record-rich-text/RichTextTextColor';
import { DEFAULT_SLASH_COMMANDS } from '@/advanced-text-editor/extensions/slash-command/DefaultSlashCommands';
import { SlashCommand } from '@/advanced-text-editor/extensions/slash-command/SlashCommand';
import { type AdvancedTextEditorExtensionContext } from '@/advanced-text-editor/types/AdvancedTextEditorExtensionContext';
import { buildFullRichTextExtensions } from '@/advanced-text-editor/utils/buildFullRichTextExtensions';
import { MentionSuggestion } from '@/mention/extensions/MentionSuggestion';
import { MentionTag } from '@/mention/extensions/MentionTag';
import { type AnyExtension } from '@tiptap/core';
import { Blockquote } from '@tiptap/extension-blockquote';
import { Code } from '@tiptap/extension-code';
import { CodeBlock } from '@tiptap/extension-code-block';
import { Heading } from '@tiptap/extension-heading';
import { ListKit } from '@tiptap/extension-list';
import { TableKit } from '@tiptap/extension-table';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { isDefined, TIPTAP_NODE_TYPES } from 'twenty-shared/utils';

// Record rich text accepts what notes stored in BlockNote could hold, and
// none of the email-only blocks: the server rejects those for records.
export const buildRecordRichTextExtensions = (
  context: AdvancedTextEditorExtensionContext,
): AnyExtension[] => [
  ...buildFullRichTextExtensions(context).filter(
    (extension) =>
      extension.name !== TIPTAP_NODE_TYPES.HEADING &&
      extension.name !== ListKit.name &&
      extension.name !== SlashCommand.name,
  ),
  ListKit.configure({ taskItem: { nested: true } }),
  Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
  SlashCommand.configure({
    commands: [...DEFAULT_SLASH_COMMANDS, ...RECORD_RICH_TEXT_SLASH_COMMANDS],
  }),
  Blockquote,
  CodeBlock,
  // BlockNote let inline code combine with other styles.
  Code.extend({ excludes: '' }),
  TextStyle,
  RichTextTextColor,
  RichTextHighlight,
  TextAlign.configure({
    types: [TIPTAP_NODE_TYPES.HEADING, TIPTAP_NODE_TYPES.PARAGRAPH],
  }),
  TableKit.configure({ table: { resizable: false } }),
  DividerNode,
  FileNode.configure({
    onFileUpload: context.onFileUpload,
    onFileUploadError: context.onImageUploadError,
  }),
  MentionTag,
  ...(isDefined(context.searchMentionRecords)
    ? [
        MentionSuggestion.configure({
          searchMentionRecords: context.searchMentionRecords,
        }),
      ]
    : []),
];
