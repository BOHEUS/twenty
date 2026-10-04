import { useFieldValueCommandMenuItems } from '@/command-menu-item/hooks/useFieldValueCommandMenuItems';
import { useOpenFieldValueCommandMenuItem } from '@/command-menu-item/hooks/useOpenFieldValueCommandMenuItem';
import { useLinksFieldDisplay } from '@/object-record/record-field/ui/meta-types/hooks/useLinksFieldDisplay';
import { LinksDisplay } from '@/ui/field/display/components/LinksDisplay';
import { useLingui } from '@lingui/react/macro';
import React from 'react';
import {
  FieldMetadataSettingsOnClickAction,
  FieldMetadataType,
} from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

import { useCopyToClipboard } from '~/hooks/useCopyToClipboard';

export const LinksFieldDisplay = () => {
  const { fieldValue, fieldDefinition } = useLinksFieldDisplay();
  const { copyToClipboard } = useCopyToClipboard();
  const { t } = useLingui();
  const fieldValueCommandMenuItems = useFieldValueCommandMenuItems({
    fieldType: FieldMetadataType.LINKS,
    objectNameSingular: fieldDefinition.metadata.objectMetadataNameSingular,
  });
  const { openFieldValueCommandMenuItem } = useOpenFieldValueCommandMenuItem();

  const onClickAction = fieldDefinition.metadata.settings?.clickAction;

  const handleLinkClick = (
    url: string,
    event: React.MouseEvent<HTMLElement>,
  ) => {
    if (onClickAction === FieldMetadataSettingsOnClickAction.COPY) {
      event.preventDefault();
      copyToClipboard(url, t`Link copied to clipboard`);

      return;
    }

    const [firstFieldValueCommandMenuItem] = fieldValueCommandMenuItems;

    // Falls back to opening the link when no app provides a link command.
    if (
      onClickAction === FieldMetadataSettingsOnClickAction.OPEN_IN_APP &&
      isDefined(firstFieldValueCommandMenuItem)
    ) {
      event.preventDefault();
      openFieldValueCommandMenuItem({
        item: firstFieldValueCommandMenuItem,
        value: fieldValue,
        clickedValue: url,
      });
    }
  };

  return <LinksDisplay value={fieldValue} onLinkClick={handleLinkClick} />;
};
