import { useOpenEmailInAppOrFallback } from '@/activities/emails/hooks/useOpenEmailInAppOrFallback';
import { useFieldValueCommandMenuItems } from '@/command-menu-item/hooks/useFieldValueCommandMenuItems';
import { useOpenFieldValueCommandMenuItem } from '@/command-menu-item/hooks/useOpenFieldValueCommandMenuItem';
import { FieldContext } from '@/object-record/record-field/ui/contexts/FieldContext';
import {
  type FieldEmailsValue,
  type FieldLinksValue,
  type FieldPhonesValue,
} from '@/object-record/record-field/ui/types/FieldMetadata';
import { isFieldEmails } from '@/object-record/record-field/ui/types/guards/isFieldEmails';
import { isFieldLinks } from '@/object-record/record-field/ui/types/guards/isFieldLinks';
import { isFieldPhones } from '@/object-record/record-field/ui/types/guards/isFieldPhones';
import { useRecordFieldValue } from '@/object-record/record-store/hooks/useRecordFieldValue';
import { t } from '@lingui/core/macro';
import { useContext } from 'react';
import { FieldMetadataSettingsOnClickAction } from 'twenty-shared/types';
import { ensureAbsoluteUrl, isDefined } from 'twenty-shared/utils';
import {
  IconApps,
  IconArrowUpRight,
  IconCopy,
  IconMail,
  IconPhone,
  useIcons,
} from 'twenty-ui/icon';
import { useCopyToClipboard } from '~/hooks/useCopyToClipboard';

export const useGetSecondaryFieldButton = () => {
  const { fieldDefinition, recordId } = useContext(FieldContext);
  const { copyToClipboard } = useCopyToClipboard();

  const isEmailField = isFieldEmails(fieldDefinition);

  const { openEmail } = useOpenEmailInAppOrFallback({ skip: !isEmailField });

  const fieldValueCommandMenuItems = useFieldValueCommandMenuItems({
    fieldType: fieldDefinition.type,
    objectNameSingular: fieldDefinition.metadata.objectMetadataNameSingular,
  });
  const { openFieldValueCommandMenuItem } = useOpenFieldValueCommandMenuItem();
  const { getIcon } = useIcons();

  const fieldValue = useRecordFieldValue<
    FieldPhonesValue | FieldEmailsValue | FieldLinksValue | undefined
  >(recordId, fieldDefinition.metadata.fieldName, fieldDefinition);

  if (
    (!isFieldPhones(fieldDefinition) &&
      !isFieldLinks(fieldDefinition) &&
      !isEmailField) ||
    !isDefined(fieldValue)
  ) {
    return [];
  }

  const defaultClickAction = isEmailField
    ? FieldMetadataSettingsOnClickAction.OPEN_IN_APP
    : FieldMetadataSettingsOnClickAction.OPEN_LINK;

  const mainActionOnClick =
    fieldDefinition.metadata.settings?.clickAction ?? defaultClickAction;

  const openActionForFieldType = isEmailField
    ? FieldMetadataSettingsOnClickAction.OPEN_IN_APP
    : FieldMetadataSettingsOnClickAction.OPEN_LINK;

  const secondaryActionOnClick =
    mainActionOnClick === FieldMetadataSettingsOnClickAction.COPY
      ? openActionForFieldType
      : FieldMetadataSettingsOnClickAction.COPY;

  let openLinkOnClick: () => void = () => {};
  let copyOnClick: () => void = () => {};

  const [firstFieldValueCommandMenuItem] = fieldValueCommandMenuItems;

  // Without an app providing a command, "open in app" degrades to the plain link.
  let openInAppOnClick: () => void = () => {
    if (isDefined(firstFieldValueCommandMenuItem)) {
      openFieldValueCommandMenuItem({
        item: firstFieldValueCommandMenuItem,
        value: fieldValue,
      });

      return;
    }

    openLinkOnClick();
  };

  if (isFieldPhones(fieldDefinition)) {
    const { primaryPhoneCallingCode = '', primaryPhoneNumber = '' } =
      fieldValue as FieldPhonesValue;
    const phoneNumber = `${primaryPhoneCallingCode}${primaryPhoneNumber}`;
    openLinkOnClick = () => {
      window.open(`tel:${phoneNumber}`, '_blank');
    };
    copyOnClick = () => {
      copyToClipboard(phoneNumber, t`Phone number copied to clipboard`);
    };
  }

  if (isFieldEmails(fieldDefinition)) {
    const email = (fieldValue as FieldEmailsValue).primaryEmail ?? '';
    openLinkOnClick = () => {
      window.open(`mailto:${email}`, '_blank');
    };
    copyOnClick = () => {
      copyToClipboard(email, t`Email copied to clipboard`);
    };
    openInAppOnClick = () => {
      openEmail(email);
    };
  }

  if (isFieldLinks(fieldDefinition)) {
    const url = (fieldValue as FieldLinksValue).primaryLinkUrl ?? '';
    openLinkOnClick = () => {
      window.open(ensureAbsoluteUrl(url), '_blank');
    };
    copyOnClick = () => {
      copyToClipboard(url, t`Link copied to clipboard`);
    };
  }

  const onClickByAction: Record<
    FieldMetadataSettingsOnClickAction,
    () => void
  > = {
    [FieldMetadataSettingsOnClickAction.OPEN_LINK]: openLinkOnClick,
    [FieldMetadataSettingsOnClickAction.COPY]: copyOnClick,
    [FieldMetadataSettingsOnClickAction.OPEN_IN_APP]: openInAppOnClick,
  };

  const iconByAction = {
    [FieldMetadataSettingsOnClickAction.OPEN_LINK]: IconArrowUpRight,
    [FieldMetadataSettingsOnClickAction.COPY]: IconCopy,
    [FieldMetadataSettingsOnClickAction.OPEN_IN_APP]: isEmailField
      ? IconMail
      : isFieldPhones(fieldDefinition)
        ? IconPhone
        : IconApps,
  };

  const ariaLabelByAction = {
    [FieldMetadataSettingsOnClickAction.OPEN_LINK]: t`Open link`,
    [FieldMetadataSettingsOnClickAction.COPY]: t`Copy`,
    [FieldMetadataSettingsOnClickAction.OPEN_IN_APP]: t`Open in app`,
  };

  // For emails OPEN_IN_APP composes a mail, so every item keeps its own button.
  const isFirstItemBoundToOpenInApp =
    !isEmailField &&
    (mainActionOnClick === FieldMetadataSettingsOnClickAction.OPEN_IN_APP ||
      secondaryActionOnClick ===
        FieldMetadataSettingsOnClickAction.OPEN_IN_APP);

  const fieldValueCommandMenuItemButtons = (
    isFirstItemBoundToOpenInApp
      ? fieldValueCommandMenuItems.slice(1)
      : fieldValueCommandMenuItems
  ).map((item) => ({
    onClick: () => openFieldValueCommandMenuItem({ item, value: fieldValue }),
    Icon: getIcon(item.icon, 'IconApps'),
    ariaLabel: item.label,
  }));

  return [
    {
      onClick: onClickByAction[secondaryActionOnClick],
      Icon: iconByAction[secondaryActionOnClick],
      ariaLabel: ariaLabelByAction[secondaryActionOnClick],
    },
    ...fieldValueCommandMenuItemButtons,
  ];
};
