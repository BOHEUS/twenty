import { BlockNoteFormRecordRichTextFieldInput } from '@/object-record/record-field/ui/form-types/components/BlockNoteFormRecordRichTextFieldInput';
import { TiptapFormRecordRichTextFieldInput } from '@/object-record/record-field/ui/form-types/components/TiptapFormRecordRichTextFieldInput';
import { type FieldRichTextValue } from '@/object-record/record-field/ui/types/FieldMetadata';
import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';
import { FeatureFlagKey } from 'twenty-shared/types';

type FormRecordRichTextFieldInputProps = {
  label?: string;
  defaultValue: FieldRichTextValue | undefined;
  onChange: (value: FieldRichTextValue) => void;
  readonly?: boolean;
  placeholder?: string;
};

export const FormRecordRichTextFieldInput = ({
  label,
  defaultValue,
  onChange,
  readonly,
  placeholder,
}: FormRecordRichTextFieldInputProps) => {
  const isTiptapRichTextEditorEnabled = useIsFeatureEnabled(
    FeatureFlagKey.IS_TIPTAP_RICH_TEXT_EDITOR_ENABLED,
  );

  return isTiptapRichTextEditorEnabled ? (
    <TiptapFormRecordRichTextFieldInput
      label={label}
      defaultValue={defaultValue}
      onChange={onChange}
      readonly={readonly}
      placeholder={placeholder}
    />
  ) : (
    <BlockNoteFormRecordRichTextFieldInput
      label={label}
      defaultValue={defaultValue}
      onChange={onChange}
      readonly={readonly}
      placeholder={placeholder}
    />
  );
};
