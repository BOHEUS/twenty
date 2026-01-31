import { useFormContext } from 'react-hook-form';
import type { SettingsDataModelFieldEditFormValues } from '~/pages/settings/data-model/SettingsObjectFieldEdit';
import { SettingsDataModelPreviewFormCard } from '@/settings/data-model/components/SettingsDataModelPreviewFormCard';
import { SettingsDataModelFieldPreviewWidget } from '@/settings/data-model/fields/preview/components/SettingsDataModelFieldPreviewWidget';
import { FieldMetadataType } from 'twenty-shared/types';
import {
  SettingsDataModelFieldLinksForm,
  type SettingsDataModelFieldLinksFormValues,
} from '@/settings/data-model/fields/forms/links/components/SettingsDataModelFieldLinksForm';
import { SettingsDataModelFieldOnClickActionForm } from '@/settings/data-model/fields/forms/components/SettingsDataModelFieldOnClickActionForm';
import { Separator } from '@/settings/components/Separator';
import { SettingsDataModelFieldMaxValuesForm } from '@/settings/data-model/fields/forms/components/SettingsDataModelFieldMaxValuesForm';
import { SettingsDataModelFieldIsUniqueForm } from '@/settings/data-model/fields/forms/components/SettingsDataModelFieldIsUniqueForm';

type SettingsDataModelFieldLinksSettingsFormCardProps = {
  disabled?: boolean;
  existingFieldMetadataId: string;
  objectNameSingular: string;
};

export const SettingsDataModelFieldLinksSettingsFormCard = ({
  disabled,
  existingFieldMetadataId,
  objectNameSingular,
}: SettingsDataModelFieldLinksSettingsFormCardProps) => {
  const { watch } = useFormContext<
    SettingsDataModelFieldLinksFormValues & SettingsDataModelFieldEditFormValues
  >();

  return (
    <SettingsDataModelPreviewFormCard
      preview={
        <SettingsDataModelFieldPreviewWidget
          fieldMetadataItem={{
            type: FieldMetadataType.LINKS,
            label: watch('label'),
            icon: watch('icon'),
            defaultValue: watch('defaultValue'),
            settings: watch('settings'),
          }}
          objectNameSingular={objectNameSingular}
        />
      }
      form={
        <>
          <SettingsDataModelFieldMaxValuesForm
            existingFieldMetadataId={existingFieldMetadataId}
            fieldType={FieldMetadataType.LINKS}
            disabled={disabled}
          />
          <Separator />
          <SettingsDataModelFieldOnClickActionForm
            existingFieldMetadataId={existingFieldMetadataId}
            fieldType={FieldMetadataType.LINKS}
            disabled={disabled}
          />
          <Separator />
          <SettingsDataModelFieldLinksForm
            disabled={disabled}
            existingFieldMetadataId={existingFieldMetadataId}
          />
          <Separator />
          <SettingsDataModelFieldIsUniqueForm
            fieldType={FieldMetadataType.LINKS}
            existingFieldMetadataId={existingFieldMetadataId}
            objectNameSingular={objectNameSingular}
            disabled={disabled}
          />
        </>
      }
    />
  );
};
