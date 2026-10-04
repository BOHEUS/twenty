import { type CommandMenuItemConfig } from '@/sdk/define/command-menu-items/command-menu-item-config';
import { type DefineEntity } from '@/sdk/define/common/types/define-entity.type';
import { createValidationResult } from '@/sdk/define/common/utils/create-validation-result';
import { FIELD_VALUE_COMMAND_MENU_ITEM_FIELD_TYPES } from 'twenty-shared/application';

export const defineCommandMenuItem: DefineEntity<CommandMenuItemConfig> = (
  config,
) => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!config.universalIdentifier) {
    errors.push('CommandMenuItem must have a universalIdentifier');
  }

  if (!config.label) {
    errors.push('CommandMenuItem must have a label');
  }

  if (!config.frontComponentUniversalIdentifier) {
    errors.push(
      'CommandMenuItem must have a frontComponentUniversalIdentifier (the universalIdentifier of the front component this command opens)',
    );
  }

  if (config.availabilityType === 'FIELD_VALUE') {
    if (
      !config.availabilityFieldType ||
      !(
        FIELD_VALUE_COMMAND_MENU_ITEM_FIELD_TYPES as readonly string[]
      ).includes(config.availabilityFieldType)
    ) {
      errors.push(
        `CommandMenuItem with availabilityType FIELD_VALUE must set availabilityFieldType to one of ${FIELD_VALUE_COMMAND_MENU_ITEM_FIELD_TYPES.join(', ')}`,
      );
    }
  } else if (config.availabilityFieldType) {
    errors.push(
      'CommandMenuItem availabilityFieldType is only allowed with availabilityType FIELD_VALUE',
    );
  }

  if (config.icon) {
    warnings.push(
      'CommandMenuItem icon will be ignored in favor of application icon, you should remove it',
    );
  }

  return createValidationResult({ config, errors, warnings });
};
