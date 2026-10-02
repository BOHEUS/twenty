import { type SlashCommandConfig } from '@/advanced-text-editor/extensions/slash-command/types/SlashCommandConfig';
import { msg } from '@lingui/core/macro';
import {
  IconBlockquote,
  IconCode,
  IconFileUpload,
  IconListCheck,
  IconTable,
} from 'twenty-ui/icon';

export const RECORD_RICH_TEXT_SLASH_COMMANDS: SlashCommandConfig[] = [
  {
    id: 'taskList',
    title: msg`Checklist`,
    description: msg`List with checkboxes`,
    icon: IconListCheck,
    keywords: [msg`checklist`, msg`todo`, msg`task`, msg`checkbox`],
    getIsActive: (editor) => editor.isActive('taskList'),
    getIsVisible: (editor) => editor.can().toggleTaskList?.() ?? false,
    getOnSelect: (editor, range) => () =>
      editor.chain().focus().deleteRange(range).toggleTaskList().run(),
  },
  {
    id: 'blockquote',
    title: msg`Quote`,
    description: msg`Quoted text`,
    icon: IconBlockquote,
    keywords: [msg`quote`, msg`blockquote`, msg`citation`],
    getIsActive: (editor) => editor.isActive('blockquote'),
    getIsVisible: (editor) => editor.can().toggleBlockquote?.() ?? false,
    getOnSelect: (editor, range) => () =>
      editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
  },
  {
    id: 'codeBlock',
    title: msg`Code`,
    description: msg`Code block`,
    icon: IconCode,
    keywords: [msg`code`, msg`snippet`, msg`pre`],
    getIsActive: (editor) => editor.isActive('codeBlock'),
    getIsVisible: (editor) => editor.can().toggleCodeBlock?.() ?? false,
    getOnSelect: (editor, range) => () =>
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    id: 'table',
    title: msg`Table`,
    description: msg`Table with a header row`,
    icon: IconTable,
    keywords: [msg`table`, msg`grid`, msg`rows`, msg`columns`],
    getIsActive: (editor) => editor.isActive('table'),
    getIsVisible: (editor) =>
      editor.can().insertTable?.({ rows: 3, cols: 3, withHeaderRow: true }) ??
      false,
    getOnSelect: (editor, range) => () =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run(),
  },
  {
    id: 'file',
    title: msg`File`,
    description: msg`Upload a file`,
    icon: IconFileUpload,
    keywords: [msg`file`, msg`attachment`, msg`upload`, msg`document`],
    getIsActive: () => false,
    getIsVisible: (editor) => editor.can().pickAndUploadFile?.() ?? false,
    getOnSelect: (editor, range) => () =>
      editor.chain().focus().deleteRange(range).pickAndUploadFile().run(),
  },
];
