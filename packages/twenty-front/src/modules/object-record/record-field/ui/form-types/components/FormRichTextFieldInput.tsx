import { FormAdvancedTextFieldInput } from '@/advanced-text-editor/components/FormAdvancedTextFieldInput';
import { RECORD_RICH_TEXT_EDITOR_PROFILE } from '@/object-record/record-field/ui/form-types/constants/RecordRichTextEditorProfile';
import { type VariablePickerComponent } from '@/object-record/record-field/ui/form-types/types/VariablePickerComponent';
import { type FieldRichTextValue } from '@/object-record/record-field/ui/types/FieldMetadata';
import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';
import { FeatureFlagKey } from 'twenty-shared/types';
import { convertTipTapDocumentToBlockNote } from '@/object-record/record-field/ui/form-types/utils/convertTipTapDocumentToBlockNote';

type FormRichTextFieldInputProps = {
  label?: string;
  error?: string;
  hint?: string;
  defaultValue: FieldRichTextValue | undefined;
  onChange: (value: FieldRichTextValue) => void;
  onBlur?: () => void;
  readonly?: boolean;
  placeholder?: string;
  VariablePicker?: VariablePickerComponent;
};

export const FormRichTextFieldInput = ({
  label,
  error,
  hint,
  defaultValue,
  placeholder,
  onChange,
  readonly,
  VariablePicker,
}: FormRichTextFieldInputProps) => {
  const isTiptapRichTextEditorEnabled = useIsFeatureEnabled(
    FeatureFlagKey.IS_TIPTAP_RICH_TEXT_EDITOR_ENABLED,
  );

  const handleChange = (value: string) => {
    onChange(
      isTiptapRichTextEditorEnabled
        ? { tiptap: value, blocknote: null, markdown: null }
        : {
            // TODO: drop once RICH_TEXT migrates off the legacy BlockNote array contract.
            blocknote: convertTipTapDocumentToBlockNote(value),
            markdown: null,
          },
    );
  };

  return (
    <FormAdvancedTextFieldInput
      label={label}
      error={error}
      hint={hint}
      defaultValue={
        defaultValue?.tiptap ??
        defaultValue?.blocknote ??
        defaultValue?.markdown
      }
      placeholder={placeholder}
      onChange={handleChange}
      readonly={readonly}
      VariablePicker={VariablePicker}
      profile={RECORD_RICH_TEXT_EDITOR_PROFILE}
    />
  );
};
