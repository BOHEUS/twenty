import { useFieldValueCommandMenuItems } from '@/command-menu-item/hooks/useFieldValueCommandMenuItems';
import { useOpenFieldValueCommandMenuItem } from '@/command-menu-item/hooks/useOpenFieldValueCommandMenuItem';
import { useFieldFocus } from '@/object-record/record-field/ui/hooks/useFieldFocus';
import { usePhonesFieldDisplay } from '@/object-record/record-field/ui/meta-types/hooks/usePhonesFieldDisplay';
import { PhonesDisplay } from '@/ui/field/display/components/PhonesDisplay';
import { useLingui } from '@lingui/react/macro';
import React from 'react';
import {
  FieldMetadataSettingsOnClickAction,
  FieldMetadataType,
} from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { useCopyToClipboard } from '~/hooks/useCopyToClipboard';

export const PhonesFieldDisplay = () => {
  const { fieldValue, fieldDefinition } = usePhonesFieldDisplay();
  const { copyToClipboard } = useCopyToClipboard();
  const { isFocused } = useFieldFocus();
  const fieldValueCommandMenuItems = useFieldValueCommandMenuItems({
    fieldType: FieldMetadataType.PHONES,
    objectNameSingular: fieldDefinition.metadata.objectMetadataNameSingular,
  });
  const { openFieldValueCommandMenuItem } = useOpenFieldValueCommandMenuItem();

  const { t } = useLingui();

  const onClickAction = fieldDefinition.metadata.settings?.clickAction;

  const handleClick = async (
    phoneNumber: string,
    event: React.MouseEvent<HTMLElement>,
  ) => {
    if (onClickAction === FieldMetadataSettingsOnClickAction.COPY) {
      event.preventDefault();
      copyToClipboard(phoneNumber, t`Phone number copied to clipboard`);

      return;
    }

    const [firstFieldValueCommandMenuItem] = fieldValueCommandMenuItems;

    // Falls back to the tel: link when no app provides a phone command.
    if (
      onClickAction === FieldMetadataSettingsOnClickAction.OPEN_IN_APP &&
      isDefined(firstFieldValueCommandMenuItem)
    ) {
      event.preventDefault();
      openFieldValueCommandMenuItem({
        item: firstFieldValueCommandMenuItem,
        value: fieldValue,
        clickedValue: phoneNumber,
      });
    }
  };

  return (
    <PhonesDisplay
      value={fieldValue}
      isFocused={isFocused}
      onPhoneNumberClick={handleClick}
    />
  );
};
