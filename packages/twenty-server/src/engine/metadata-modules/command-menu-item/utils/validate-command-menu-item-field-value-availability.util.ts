import { msg, t } from '@lingui/core/macro';
import {
  CommandMenuItemAvailabilityType,
  type FieldMetadataType,
} from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

import { CommandMenuItemExceptionCode } from 'src/engine/metadata-modules/command-menu-item/command-menu-item.exception';
import { FIELD_VALUE_COMMAND_MENU_ITEM_FIELD_TYPES } from 'src/engine/metadata-modules/command-menu-item/constants/field-value-command-menu-item-field-types.constant';
import { EngineComponentKey } from 'src/engine/metadata-modules/command-menu-item/enums/engine-component-key.enum';
import { type FlatEntityValidationError } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-builder/builders/types/failed-flat-entity-validation.type';

export const validateCommandMenuItemFieldValueAvailability = ({
  availabilityType,
  availabilityFieldType,
  engineComponentKey,
  conditionalAvailabilityExpression,
  conditionalPinnedExpression,
}: {
  availabilityType: CommandMenuItemAvailabilityType;
  availabilityFieldType: FieldMetadataType | null;
  engineComponentKey: EngineComponentKey | null;
  conditionalAvailabilityExpression: string | null;
  conditionalPinnedExpression: string | null;
}): FlatEntityValidationError[] => {
  if (availabilityType !== CommandMenuItemAvailabilityType.FIELD_VALUE) {
    return isDefined(availabilityFieldType)
      ? [
          {
            code: CommandMenuItemExceptionCode.INVALID_COMMAND_MENU_ITEM_INPUT,
            message: t`availabilityFieldType is only allowed with the FIELD_VALUE availability type`,
            userFriendlyMessage: msg`Field type is only allowed for field value commands`,
          },
        ]
      : [];
  }

  const errors: FlatEntityValidationError[] = [];

  if (
    !isDefined(availabilityFieldType) ||
    !FIELD_VALUE_COMMAND_MENU_ITEM_FIELD_TYPES.includes(
      availabilityFieldType as (typeof FIELD_VALUE_COMMAND_MENU_ITEM_FIELD_TYPES)[number],
    )
  ) {
    errors.push({
      code: CommandMenuItemExceptionCode.INVALID_COMMAND_MENU_ITEM_INPUT,
      message: t`FIELD_VALUE commands require availabilityFieldType to be one of ${FIELD_VALUE_COMMAND_MENU_ITEM_FIELD_TYPES.join(', ')}`,
      userFriendlyMessage: msg`Field value commands require a supported field type`,
    });
  }

  if (engineComponentKey !== EngineComponentKey.FRONT_COMPONENT_RENDERER) {
    errors.push({
      code: CommandMenuItemExceptionCode.INVALID_COMMAND_MENU_ITEM_INPUT,
      message: t`FIELD_VALUE commands must render a front component`,
      userFriendlyMessage: msg`Field value commands must render a front component`,
    });
  }

  // Field buttons have no command menu context to evaluate expressions against.
  if (
    isDefined(conditionalAvailabilityExpression) ||
    isDefined(conditionalPinnedExpression)
  ) {
    errors.push({
      code: CommandMenuItemExceptionCode.INVALID_COMMAND_MENU_ITEM_INPUT,
      message: t`FIELD_VALUE commands do not support conditional expressions`,
      userFriendlyMessage: msg`Field value commands do not support conditional expressions`,
    });
  }

  return errors;
};
