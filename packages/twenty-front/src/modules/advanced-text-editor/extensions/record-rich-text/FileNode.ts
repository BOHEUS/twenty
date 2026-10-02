import { FileNodeView } from '@/advanced-text-editor/extensions/record-rich-text/FileNodeView';
import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TIPTAP_NODE_TYPES } from 'twenty-shared/utils';

export const FileNode = Node.create({
  name: TIPTAP_NODE_TYPES.FILE,
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes: () => ({
    url: {
      default: '',
      parseHTML: (element) => element.getAttribute('data-url'),
      renderHTML: (attributes) => ({ 'data-url': attributes.url }),
    },
    name: {
      default: '',
      parseHTML: (element) => element.getAttribute('data-name'),
      renderHTML: (attributes) => ({ 'data-name': attributes.name }),
    },
    fileCategory: {
      default: 'OTHER',
      parseHTML: (element) => element.getAttribute('data-file-category'),
      renderHTML: (attributes) => ({
        'data-file-category': attributes.fileCategory,
      }),
    },
  }),

  parseHTML: () => [{ tag: 'div[data-type="file"]' }],

  renderHTML: ({ node, HTMLAttributes }) => [
    'div',
    mergeAttributes(HTMLAttributes, { 'data-type': 'file' }),
    node.attrs.name,
  ],

  renderText: ({ node }) => node.attrs.name,

  addNodeView: () => ReactNodeViewRenderer(FileNodeView),
});
