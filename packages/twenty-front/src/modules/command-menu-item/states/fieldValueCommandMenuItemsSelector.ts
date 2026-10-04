import { isFieldValueCommandMenuItem } from '@/command-menu-item/utils/isFieldValueCommandMenuItem';
import { metadataStoreState } from '@/metadata-store/states/metadataStoreState';
import { type FlatCommandMenuItem } from '@/metadata-store/types/FlatCommandMenuItem';
import { createAtomSelector } from '@/ui/utilities/state/jotai/utils/createAtomSelector';

export const fieldValueCommandMenuItemsSelector = createAtomSelector<
  FlatCommandMenuItem[]
>({
  key: 'fieldValueCommandMenuItemsSelector',
  get: ({ get }) => {
    const commandMenuItems = get(metadataStoreState, 'commandMenuItems')
      .current as FlatCommandMenuItem[];

    return commandMenuItems
      .filter((item) => item.isActive && isFieldValueCommandMenuItem(item))
      .sort(
        (firstItem, secondItem) => firstItem.position - secondItem.position,
      );
  },
});
