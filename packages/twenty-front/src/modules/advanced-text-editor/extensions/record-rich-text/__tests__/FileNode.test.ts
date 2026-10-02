import { buildAdvancedTextEditorCoreExtensions } from '@/advanced-text-editor/constants/AdvancedTextEditorCoreExtensions';
import { buildRecordRichTextExtensions } from '@/advanced-text-editor/utils/buildRecordRichTextExtensions';
import { Editor } from '@tiptap/core';

const createEditor = (
  onFileUpload?: (file: File) => Promise<{ url: string }>,
) =>
  new Editor({
    extensions: [
      ...buildAdvancedTextEditorCoreExtensions({ placeholder: undefined }),
      ...buildRecordRichTextExtensions({ onFileUpload }),
    ],
  });

describe('FileNode', () => {
  let clickSpy: jest.SpyInstance;
  const pickedFile = new File(['content'], 'proposal.pdf', {
    type: 'application/pdf',
  });

  beforeEach(() => {
    clickSpy = jest
      .spyOn(HTMLInputElement.prototype, 'click')
      .mockImplementation(function (this: HTMLInputElement) {
        Object.defineProperty(this, 'files', { value: [pickedFile] });
        this.onchange?.(new Event('change'));
      });
  });

  afterEach(() => {
    clickSpy.mockRestore();
  });

  it('should upload the picked file and insert a file block', async () => {
    const onFileUpload = jest
      .fn()
      .mockResolvedValue({ url: 'https://example.com/proposal.pdf' });
    const editor = createEditor(onFileUpload);

    expect(editor.commands.pickAndUploadFile()).toBe(true);

    await new Promise(process.nextTick);

    expect(onFileUpload).toHaveBeenCalledWith(pickedFile);
    expect(editor.getJSON().content).toContainEqual({
      type: 'file',
      attrs: {
        url: 'https://example.com/proposal.pdf',
        name: 'proposal.pdf',
        fileCategory: 'TEXT_DOCUMENT',
      },
    });

    editor.destroy();
  });

  it('should not open the picker when only checking availability', () => {
    const editor = createEditor(jest.fn());

    expect(editor.can().pickAndUploadFile()).toBe(true);
    expect(clickSpy).not.toHaveBeenCalled();

    editor.destroy();
  });

  it('should be unavailable without an upload handler', () => {
    const editor = createEditor();

    expect(editor.can().pickAndUploadFile()).toBe(false);

    editor.destroy();
  });
});
