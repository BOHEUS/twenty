import { Controller, useFormContext } from 'react-hook-form';

import { useFieldMetadataItemById } from '@/object-metadata/hooks/useFieldMetadataItemById';
import { SettingsOptionCardContentSelect } from '@/settings/components/SettingsOptions/SettingsOptionCardContentSelect';
import { t } from '@lingui/core/macro';
import { IconWorld } from 'twenty-ui/display';
import { Toggle } from 'twenty-ui/input';

export type SettingsDataModelFieldLinksFormValues = {
  onlyDomainNameAllowed: boolean;
};

type SettingsDataModelFieldIsUniqueFormProps = {
  existingFieldMetadataId: string;
  disabled?: boolean;
};

export const SettingsDataModelFieldLinksForm = ({
  existingFieldMetadataId,
  disabled,
}: SettingsDataModelFieldIsUniqueFormProps) => {
  const { control } = useFormContext<SettingsDataModelFieldLinksFormValues>();

  const { fieldMetadataItem } = useFieldMetadataItemById(
    existingFieldMetadataId,
  );

  return (
    <Controller
      name="onlyDomainNameAllowed"
      defaultValue={fieldMetadataItem?.isUnique || false}
      control={control}
      render={({ field: { onChange, value } }) => {
        const isUnique = value ?? false;

        return (
          <>
            <SettingsOptionCardContentSelect
              Icon={IconWorld}
              title={t`Domain name`}
              description={t`Only allow user to store a naked domain name`}
            >
              <Toggle
                toggleSize="small"
                value={isUnique}
                onChange={(value) => onChange(value)}
                disabled={disabled}
              />
            </SettingsOptionCardContentSelect>
          </>
        );
      }}
    />
  );
};
