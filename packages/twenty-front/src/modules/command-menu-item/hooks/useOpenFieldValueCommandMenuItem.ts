import { type FlatCommandMenuItem } from '@/metadata-store/types/FlatCommandMenuItem';
import { FieldContext } from '@/object-record/record-field/ui/contexts/FieldContext';
import { useOpenFrontComponentInSidePanel } from '@/side-panel/hooks/useOpenFrontComponentInSidePanel';
import { useContext } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { useIcons } from 'twenty-ui/icon';

export const useOpenFieldValueCommandMenuItem = () => {
  const { fieldDefinition, recordId } = useContext(FieldContext);
  const { openFrontComponentInSidePanel } = useOpenFrontComponentInSidePanel();
  const { getIcon } = useIcons();

  const openFieldValueCommandMenuItem = ({
    item,
    value,
    clickedValue,
  }: {
    item: FlatCommandMenuItem;
    value: unknown;
    clickedValue?: string;
  }) => {
    const objectNameSingular =
      fieldDefinition.metadata.objectMetadataNameSingular;

    if (!isDefined(item.frontComponentId) || !isDefined(objectNameSingular)) {
      return;
    }

    openFrontComponentInSidePanel({
      frontComponentId: item.frontComponentId,
      pageTitle: item.label,
      pageIcon: getIcon(item.icon, 'IconApps'),
      recordContext: {
        objectNameSingular,
        recordId,
        fieldContext: {
          objectNameSingular,
          recordId,
          fieldName: fieldDefinition.metadata.fieldName,
          fieldType: fieldDefinition.type,
          value,
          clickedValue,
        },
      },
    });
  };

  return { openFieldValueCommandMenuItem };
};
