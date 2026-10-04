import { fieldValueCommandMenuItemsSelector } from '@/command-menu-item/states/fieldValueCommandMenuItemsSelector';
import { type FlatCommandMenuItem } from '@/metadata-store/types/FlatCommandMenuItem';
import { objectMetadataItemFamilySelector } from '@/object-metadata/states/objectMetadataItemFamilySelector';
import { useAtomFamilySelectorValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilySelectorValue';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useMemo } from 'react';
import { type FieldMetadataType } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

export const useFieldValueCommandMenuItems = ({
  fieldType,
  objectNameSingular,
}: {
  fieldType: FieldMetadataType;
  objectNameSingular: string | undefined;
}): FlatCommandMenuItem[] => {
  const fieldValueCommandMenuItems = useAtomStateValue(
    fieldValueCommandMenuItemsSelector,
  );

  const objectMetadataItem = useAtomFamilySelectorValue(
    objectMetadataItemFamilySelector,
    {
      objectName: objectNameSingular ?? '',
      objectNameType: 'singular',
    },
  );

  return useMemo(
    () =>
      fieldValueCommandMenuItems.filter(
        (item) =>
          isDefined(item.frontComponentId) &&
          item.availabilityFieldType === fieldType &&
          (!isDefined(item.availabilityObjectMetadataId) ||
            item.availabilityObjectMetadataId === objectMetadataItem?.id),
      ),
    [fieldValueCommandMenuItems, fieldType, objectMetadataItem?.id],
  );
};
