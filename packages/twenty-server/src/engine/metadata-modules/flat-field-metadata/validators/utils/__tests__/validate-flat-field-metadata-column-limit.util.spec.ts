import { FieldMetadataType, RelationType } from 'twenty-shared/types';

import { FieldMetadataExceptionCode } from 'src/engine/metadata-modules/field-metadata/field-metadata.exception';
import { MAX_COLUMNS_PER_OBJECT } from 'src/engine/metadata-modules/flat-field-metadata/constants/max-columns-per-object.constant';
import { validateFlatFieldMetadataColumnLimit } from 'src/engine/metadata-modules/flat-field-metadata/validators/utils/validate-flat-field-metadata-column-limit.util';
import { type UniversalFlatFieldMetadata } from 'src/engine/workspace-manager/workspace-migration/universal-flat-entity/types/universal-flat-field-metadata.type';

const createField = (
  universalIdentifier: string,
  overrides: Record<string, unknown> = {},
) =>
  ({
    universalIdentifier,
    name: universalIdentifier,
    type: FieldMetadataType.TEXT,
    ...overrides,
  }) as UniversalFlatFieldMetadata;

const callValidator = ({
  existingFields,
  fieldToValidate,
}: {
  existingFields: UniversalFlatFieldMetadata[];
  fieldToValidate: UniversalFlatFieldMetadata;
}) =>
  validateFlatFieldMetadataColumnLimit({
    flatFieldMetadataToValidate: fieldToValidate,
    universalFlatObjectMetadata: {
      fieldUniversalIdentifiers: existingFields.map(
        ({ universalIdentifier }) => universalIdentifier,
      ),
    },
    universalFlatFieldMetadataMaps: {
      byUniversalIdentifier: Object.fromEntries(
        existingFields.map((field) => [field.universalIdentifier, field]),
      ),
    },
  });

const createTextFields = (count: number) =>
  Array.from({ length: count }, (_, index) => createField(`text-${index}`));

describe('validateFlatFieldMetadataColumnLimit', () => {
  it('should accept a field that reaches the limit exactly', () => {
    const errors = callValidator({
      existingFields: createTextFields(MAX_COLUMNS_PER_OBJECT - 1),
      fieldToValidate: createField('new'),
    });

    expect(errors).toEqual([]);
  });

  it('should reject a field that exceeds the limit', () => {
    const errors = callValidator({
      existingFields: createTextFields(MAX_COLUMNS_PER_OBJECT),
      fieldToValidate: createField('new'),
    });

    expect(errors).toHaveLength(1);
    expect(errors[0].code).toBe(
      FieldMetadataExceptionCode.COLUMN_LIMIT_REACHED,
    );
  });

  it('should count every column of a composite field', () => {
    const errors = callValidator({
      existingFields: createTextFields(MAX_COLUMNS_PER_OBJECT - 1),
      fieldToValidate: createField('new', { type: FieldMetadataType.ADDRESS }),
    });

    expect(errors).toHaveLength(1);
  });

  it('should only count many-to-one relations as columns', () => {
    const relationField = (relationType: RelationType) =>
      createField('relation', {
        type: FieldMetadataType.RELATION,
        universalSettings: { relationType },
      });
    const existingFields = createTextFields(MAX_COLUMNS_PER_OBJECT);

    expect(
      callValidator({
        existingFields,
        fieldToValidate: relationField(RelationType.ONE_TO_MANY),
      }),
    ).toEqual([]);
    expect(
      callValidator({
        existingFields,
        fieldToValidate: relationField(RelationType.MANY_TO_ONE),
      }),
    ).toHaveLength(1);
  });
});
