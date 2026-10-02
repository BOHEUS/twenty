import { getFileType } from '@/activities/files/utils/getFileType';
import { type UploadedFile } from '@/advanced-text-editor/types/UploadedFile';
import { FileNodeView } from '@/advanced-text-editor/extensions/record-rich-text/FileNodeView';
import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { isDefined, TIPTAP_NODE_TYPES } from 'twenty-shared/utils';

type FileNodeOptions = {
  onFileUpload?: (file: File) => Promise<UploadedFile>;
  onFileUploadError?: (error: Error, file: File) => void;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    file: {
      pickAndUploadFile: () => ReturnType;
    };
  }
}

const pickFile = (onPick: (file: File) => void) => {
  const input = document.createElement('input');

  input.type = 'file';
  input.onchange = () => {
    const [file] = Array.from(input.files ?? []);

    if (isDefined(file)) {
      onPick(file);
    }
  };
  input.click();
};

export const FileNode = Node.create<FileNodeOptions>({
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

  addOptions: () => ({
    onFileUpload: undefined,
    onFileUploadError: undefined,
  }),

  addCommands() {
    return {
      pickAndUploadFile:
        () =>
        ({ editor, dispatch }) => {
          const { onFileUpload, onFileUploadError } = this.options;

          if (!isDefined(onFileUpload)) {
            return false;
          }

          // can() checks run without dispatch and must not open the picker.
          if (!isDefined(dispatch)) {
            return true;
          }

          pickFile(async (file) => {
            try {
              const { url } = await onFileUpload(file);

              editor
                .chain()
                .focus()
                .insertContent({
                  type: TIPTAP_NODE_TYPES.FILE,
                  attrs: {
                    url,
                    name: file.name,
                    fileCategory: getFileType(file.name),
                  },
                })
                .run();
            } catch (error) {
              onFileUploadError?.(
                error instanceof Error ? error : new Error(String(error)),
                file,
              );
            }
          });

          return true;
        },
    };
  },

  addNodeView: () => ReactNodeViewRenderer(FileNodeView),
});
