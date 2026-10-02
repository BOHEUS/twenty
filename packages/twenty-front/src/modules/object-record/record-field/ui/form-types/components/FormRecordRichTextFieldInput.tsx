import { FormAdvancedTextFieldInput } from '@/advanced-text-editor/components/FormAdvancedTextFieldInput';
import { buildRichTextFieldValueFromTiptap } from '@/object-record/record-field/ui/utils/buildRichTextFieldValueFromTiptap';
import { getRichTextFieldTiptapDocument } from '@/object-record/record-field/ui/utils/getRichTextFieldTiptapDocument';
import { RECORD_RICH_TEXT_FORM_FIELD_EDITOR_PROFILE } from '@/object-record/record-field/ui/form-types/constants/RecordRichTextFormFieldEditorProfile';
import { type FieldRichTextValue } from '@/object-record/record-field/ui/types/FieldMetadata';
import { useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { isDefined } from 'twenty-shared/utils';

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
  const { t } = useLingui();

  const [serializedDefaultDocument] = useState(() => {
    const document = getRichTextFieldTiptapDocument(defaultValue);

    return isDefined(document) ? JSON.stringify(document) : null;
  });

  const handleChange = (tiptap: string) => {
    onChange(buildRichTextFieldValueFromTiptap(tiptap));
  };

  return (
    <FormAdvancedTextFieldInput
      label={label}
      defaultValue={serializedDefaultDocument}
      placeholder={placeholder ?? t`Type '/' for commands`}
      onChange={handleChange}
      readonly={readonly}
      profile={RECORD_RICH_TEXT_FORM_FIELD_EDITOR_PROFILE}
    />
  );
};
