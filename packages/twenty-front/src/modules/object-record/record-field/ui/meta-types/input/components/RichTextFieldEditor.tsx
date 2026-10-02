import { type Editor } from '@tiptap/core';
import { FeatureFlagKey } from 'twenty-shared/types';

import { type BLOCK_SCHEMA } from '@/blocknote-editor/blocks/Schema';
import { BlockNoteRichTextFieldEditor } from '@/object-record/record-field/ui/meta-types/input/components/BlockNoteRichTextFieldEditor';
import { TiptapRichTextFieldEditor } from '@/object-record/record-field/ui/meta-types/input/components/TiptapRichTextFieldEditor';
import { type FieldRichTextValue } from '@/object-record/record-field/ui/types/FieldMetadata';
import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';

type RichTextFieldEditorProps = {
  recordId: string;
  objectNameSingular: string;
  fieldName: string;
  onPersistBody?: (body: FieldRichTextValue) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  blockNoteEditorRef?: React.MutableRefObject<
    typeof BLOCK_SCHEMA.BlockNoteEditor | null
  >;
  tiptapEditorRef?: React.MutableRefObject<Editor | null>;
};

export const RichTextFieldEditor = ({
  recordId,
  objectNameSingular,
  fieldName,
  onPersistBody,
  onFocus,
  onBlur,
  blockNoteEditorRef,
  tiptapEditorRef,
}: RichTextFieldEditorProps) => {
  const isTiptapRichTextEditorEnabled = useIsFeatureEnabled(
    FeatureFlagKey.IS_TIPTAP_RICH_TEXT_EDITOR_ENABLED,
  );

  return isTiptapRichTextEditorEnabled ? (
    <TiptapRichTextFieldEditor
      recordId={recordId}
      objectNameSingular={objectNameSingular}
      fieldName={fieldName}
      onPersistBody={onPersistBody}
      onFocus={onFocus}
      onBlur={onBlur}
      editorRef={tiptapEditorRef}
    />
  ) : (
    <BlockNoteRichTextFieldEditor
      recordId={recordId}
      objectNameSingular={objectNameSingular}
      fieldName={fieldName}
      onPersistBody={onPersistBody}
      onFocus={onFocus}
      onBlur={onBlur}
      editorRef={blockNoteEditorRef}
    />
  );
};
