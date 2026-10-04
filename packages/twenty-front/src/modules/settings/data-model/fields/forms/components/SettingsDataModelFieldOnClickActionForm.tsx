import { Controller, useFormContext } from 'react-hook-form';

import { useFieldValueCommandMenuItems } from '@/command-menu-item/hooks/useFieldValueCommandMenuItems';
import { useFieldMetadataItemById } from '@/object-metadata/hooks/useFieldMetadataItemById';
import { SettingsOptionCardContentSelect } from '@/settings/components/SettingsOptions/SettingsOptionCardContentSelect';
import { getSettingsDataModelFieldOnClickActionDescription } from '@/settings/data-model/fields/forms/utils/getSettingsDataModelFieldOnClickActionDescription';
import { type SettingsDataModelFieldOnClickActionFormValues } from '@/settings/data-model/fields/forms/utils/settingsDataModelFieldOnClickActionSchema';
import { Select } from '@/ui/input/components/Select';
import { useLingui } from '@lingui/react/macro';
import {
  type FieldMetadataMultiItemSettings,
  FieldMetadataSettingsOnClickAction,
  FieldMetadataType,
} from 'twenty-shared/types';
import { IconClick } from 'twenty-ui/icon';

type SettingsDataModelFieldOnClickActionFormProps = {
  disabled?: boolean;
  existingFieldMetadataId: string;
  fieldType:
    | FieldMetadataType.PHONES
    | FieldMetadataType.EMAILS
    | FieldMetadataType.LINKS;
};

export const SettingsDataModelFieldOnClickActionForm = ({
  disabled,
  existingFieldMetadataId,
  fieldType,
}: SettingsDataModelFieldOnClickActionFormProps) => {
  const { t } = useLingui();
  const { control } =
    useFormContext<SettingsDataModelFieldOnClickActionFormValues>();

  const { fieldMetadataItem, objectMetadataItem } = useFieldMetadataItemById(
    existingFieldMetadataId,
  );

  const isEmailField = fieldType === FieldMetadataType.EMAILS;

  const fieldValueCommandMenuItems = useFieldValueCommandMenuItems({
    fieldType,
    objectNameSingular: objectMetadataItem?.nameSingular,
  });

  const existingSettings =
    (fieldMetadataItem?.settings as FieldMetadataMultiItemSettings) ?? {};

  // Keep the saved choice selectable after the providing app is uninstalled.
  const canOpenInApp =
    isEmailField ||
    fieldValueCommandMenuItems.length > 0 ||
    existingSettings.clickAction ===
      FieldMetadataSettingsOnClickAction.OPEN_IN_APP;

  const defaultClickAction = isEmailField
    ? FieldMetadataSettingsOnClickAction.OPEN_IN_APP
    : FieldMetadataSettingsOnClickAction.OPEN_LINK;

  const options = [
    ...(canOpenInApp
      ? [
          {
            label: t`Open in app`,
            value: FieldMetadataSettingsOnClickAction.OPEN_IN_APP,
          },
        ]
      : []),
    {
      label: t`Open as link`,
      value: FieldMetadataSettingsOnClickAction.OPEN_LINK,
    },
    {
      label: t`Copy to clipboard`,
      value: FieldMetadataSettingsOnClickAction.COPY,
    },
  ];

  const description =
    getSettingsDataModelFieldOnClickActionDescription(fieldType);

  return (
    <Controller
      name="settings"
      control={control}
      defaultValue={{
        ...existingSettings,
        clickAction: existingSettings.clickAction ?? defaultClickAction,
      }}
      render={({ field: { value, onChange } }) => {
        const currentSettings =
          (value as FieldMetadataMultiItemSettings | undefined) ?? {};

        const clickAction = currentSettings.clickAction ?? defaultClickAction;

        return (
          <SettingsOptionCardContentSelect
            Icon={IconClick}
            title={t`Action on click`}
            description={description}
            disabled={disabled}
          >
            <Select<FieldMetadataSettingsOnClickAction>
              dropdownWidth={180}
              value={clickAction}
              onChange={(newValue) =>
                onChange({
                  ...currentSettings,
                  clickAction: newValue,
                })
              }
              disabled={disabled}
              dropdownId="field-click-behavior-select"
              options={options}
              selectSizeVariant="small"
              withSearchInput={false}
            />
          </SettingsOptionCardContentSelect>
        );
      }}
    />
  );
};
