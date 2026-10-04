import {
  CommandMenuItemAvailabilityType,
  FieldMetadataType,
} from 'twenty-shared/types';

import { EngineComponentKey } from 'src/engine/metadata-modules/command-menu-item/enums/engine-component-key.enum';
import { validateCommandMenuItemFieldValueAvailability } from 'src/engine/metadata-modules/command-menu-item/utils/validate-command-menu-item-field-value-availability.util';

const NO_EXPRESSIONS = {
  conditionalAvailabilityExpression: null,
  conditionalPinnedExpression: null,
};

describe('validateCommandMenuItemFieldValueAvailability', () => {
  it('accepts a FIELD_VALUE front component command on a phones field', () => {
    expect(
      validateCommandMenuItemFieldValueAvailability({
        availabilityType: CommandMenuItemAvailabilityType.FIELD_VALUE,
        availabilityFieldType: FieldMetadataType.PHONES,
        engineComponentKey: EngineComponentKey.FRONT_COMPONENT_RENDERER,
        ...NO_EXPRESSIONS,
      }),
    ).toEqual([]);
  });

  it('accepts other availability types without a field type', () => {
    expect(
      validateCommandMenuItemFieldValueAvailability({
        availabilityType: CommandMenuItemAvailabilityType.GLOBAL,
        availabilityFieldType: null,
        engineComponentKey: EngineComponentKey.TRIGGER_WORKFLOW_VERSION,
        ...NO_EXPRESSIONS,
      }),
    ).toEqual([]);
  });

  it('rejects a field type on a non FIELD_VALUE command', () => {
    const errors = validateCommandMenuItemFieldValueAvailability({
      availabilityType: CommandMenuItemAvailabilityType.RECORD_SELECTION,
      availabilityFieldType: FieldMetadataType.PHONES,
      engineComponentKey: EngineComponentKey.FRONT_COMPONENT_RENDERER,
      ...NO_EXPRESSIONS,
    });

    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain('FIELD_VALUE');
  });

  it.each([null, FieldMetadataType.TEXT])(
    'rejects FIELD_VALUE with field type %s',
    (availabilityFieldType) => {
      const errors = validateCommandMenuItemFieldValueAvailability({
        availabilityType: CommandMenuItemAvailabilityType.FIELD_VALUE,
        availabilityFieldType,
        engineComponentKey: EngineComponentKey.FRONT_COMPONENT_RENDERER,
        ...NO_EXPRESSIONS,
      });

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain('PHONES, EMAILS, LINKS');
    },
  );

  it('rejects FIELD_VALUE on a non front component engine', () => {
    const errors = validateCommandMenuItemFieldValueAvailability({
      availabilityType: CommandMenuItemAvailabilityType.FIELD_VALUE,
      availabilityFieldType: FieldMetadataType.EMAILS,
      engineComponentKey: EngineComponentKey.TRIGGER_WORKFLOW_VERSION,
      ...NO_EXPRESSIONS,
    });

    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain('front component');
  });

  it('rejects conditional expressions on FIELD_VALUE commands', () => {
    const errors = validateCommandMenuItemFieldValueAvailability({
      availabilityType: CommandMenuItemAvailabilityType.FIELD_VALUE,
      availabilityFieldType: FieldMetadataType.PHONES,
      engineComponentKey: EngineComponentKey.FRONT_COMPONENT_RENDERER,
      conditionalAvailabilityExpression: 'true',
      conditionalPinnedExpression: null,
    });

    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain('conditional expressions');
  });
});
