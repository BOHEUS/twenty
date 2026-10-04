import {
  CommandMenuItemAvailabilityType,
  type CommandMenuItemFieldsFragment,
} from '~/generated-metadata/graphql';

export const isFieldValueCommandMenuItem = (
  item: Pick<CommandMenuItemFieldsFragment, 'availabilityType'>,
): boolean =>
  item.availabilityType === CommandMenuItemAvailabilityType.FIELD_VALUE;
