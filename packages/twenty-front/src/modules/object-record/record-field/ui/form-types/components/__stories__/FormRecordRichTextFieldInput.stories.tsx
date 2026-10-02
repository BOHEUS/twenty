import { FormRecordRichTextFieldInput } from '@/object-record/record-field/ui/form-types/components/FormRecordRichTextFieldInput';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { ComponentDecorator } from 'twenty-ui/testing';
import { MemoryRouterDecorator } from '~/testing/decorators/MemoryRouterDecorator';
import { ObjectMetadataItemsDecorator } from '~/testing/decorators/ObjectMetadataItemsDecorator';
import { ToastDecorator } from '~/testing/decorators/ToastDecorator';
import { graphqlMocks } from '~/testing/graphqlMocks';

const TIPTAP_PARAGRAPH = JSON.stringify({
  type: 'doc',
  content: [
    { type: 'paragraph', content: [{ type: 'text', text: 'Rich Text' }] },
  ],
});

const TIPTAP_BULLET_LIST = JSON.stringify({
  type: 'doc',
  content: [
    {
      type: 'bulletList',
      content: ['First item', 'Second item'].map((text) => ({
        type: 'listItem',
        content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
      })),
    },
  ],
});

const meta: Meta<typeof FormRecordRichTextFieldInput> = {
  title: 'UI/Data/Field/Form/Input/FormRecordRichTextFieldInput',
  component: FormRecordRichTextFieldInput,
  decorators: [
    ObjectMetadataItemsDecorator,
    ToastDecorator,
    MemoryRouterDecorator,
    ComponentDecorator,
  ],
  parameters: {
    msw: graphqlMocks,
  },
};

export default meta;

type Story = StoryObj<typeof FormRecordRichTextFieldInput>;

export const Default: Story = {
  args: {
    placeholder: 'Rich Text field...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Rich Text',
    placeholder: 'Rich Text field...',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Rich Text');
  },
};

export const WithBulletList: Story = {
  args: {
    defaultValue: { tiptap: TIPTAP_BULLET_LIST, markdown: null },
    onChange: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('First item');
    await canvas.findByText('Second item');
  },
};

export const WritesTiptapDocument: Story = {
  args: {
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const editor = await waitFor(() => {
      const editorElement = canvasElement.querySelector('.ProseMirror');

      expect(editorElement).toBeVisible();

      return editorElement;
    });

    if (!editor) {
      throw new Error('Editor element not found');
    }

    await userEvent.click(editor);
    await userEvent.keyboard('Hello');

    await waitFor(() => {
      expect(args.onChange).toHaveBeenCalled();
    });

    expect(args.onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        tiptap: expect.stringContaining('Hello'),
        markdown: 'Hello',
      }),
    );
  },
};

export const KeepsContentAcrossFullScreen: Story = {
  args: {
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);

    const editor = await waitFor(() => {
      const editorElement = canvasElement.querySelector('.ProseMirror');

      expect(editorElement).toBeVisible();

      return editorElement;
    });

    if (!editor) {
      throw new Error('Editor element not found');
    }

    await userEvent.click(editor);
    await userEvent.keyboard('Hello');

    await userEvent.click(
      await canvas.findByRole('button', { name: 'Expand to full screen' }),
    );

    await page.findByText('Text Editor');
    expect(await page.findByText('Hello')).toBeVisible();

    await userEvent.keyboard(' world');

    await userEvent.click(
      await page.findByRole('button', { name: 'Close page' }),
    );

    expect(await canvas.findByText('Hello world')).toBeVisible();
    expect(page.queryByText('Text Editor')).not.toBeInTheDocument();
    expect(args.onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        tiptap: expect.stringContaining('Hello world'),
      }),
    );
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: { tiptap: TIPTAP_PARAGRAPH, markdown: null },
    readonly: true,
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const editor = await waitFor(() => {
      const editorElement = canvasElement.querySelector('.ProseMirror');

      expect(editorElement).toBeVisible();

      return editorElement;
    });

    if (!editor) {
      throw new Error('Editor element not found');
    }

    const defaultValue = await canvas.findByText('Rich Text');

    await userEvent.type(editor, 'Hello');

    expect(args.onChange).not.toHaveBeenCalled();
    expect(defaultValue).toBeVisible();
  },
};
