import { FieldMetadataType, RelationType } from 'twenty-shared/types';

import { buildRecordExportColumns } from 'src/engine/core-modules/record-export/utils/build-record-export-columns.util';
import { getFlatFieldMetadataMock } from 'src/engine/metadata-modules/flat-field-metadata/__mocks__/get-flat-field-metadata.mock';

const fieldDefaults = {
  objectMetadataId: 'person',
  universalIdentifier: 'field',
};
const idColumn = { fieldName: 'id', label: 'Id', type: FieldMetadataType.UUID };

describe('buildRecordExportColumns', () => {
  it('keeps Id first and includes it only once', () => {
    expect(buildRecordExportColumns([])).toEqual([idColumn]);
    expect(
      buildRecordExportColumns([
        getFlatFieldMetadataMock({
          ...fieldDefaults,
          type: FieldMetadataType.TEXT,
          name: 'city',
          label: 'City',
        }),
        getFlatFieldMetadataMock({
          ...fieldDefaults,
          type: FieldMetadataType.UUID,
          name: 'id',
          label: 'Record Id',
        }),
      ]),
    ).toEqual([
      idColumn,
      { fieldName: 'city', label: 'City', type: FieldMetadataType.TEXT },
    ]);
  });

  it('expands composite fields in display order and preserves their label', () => {
    expect(
      buildRecordExportColumns([
        getFlatFieldMetadataMock({
          ...fieldDefaults,
          type: FieldMetadataType.FULL_NAME,
          name: 'name',
          label: 'Nom',
        }),
        getFlatFieldMetadataMock({
          ...fieldDefaults,
          type: FieldMetadataType.CURRENCY,
          name: 'salary',
          label: 'Salary',
        }),
      ]),
    ).toEqual([
      idColumn,
      {
        fieldName: 'name',
        label: 'Nom / First Name',
        type: FieldMetadataType.FULL_NAME,
        subFieldName: 'firstName',
      },
      {
        fieldName: 'name',
        label: 'Nom / Last Name',
        type: FieldMetadataType.FULL_NAME,
        subFieldName: 'lastName',
      },
      {
        fieldName: 'salary',
        label: 'Salary / Amount',
        type: FieldMetadataType.CURRENCY,
        subFieldName: 'amountMicros',
      },
      {
        fieldName: 'salary',
        label: 'Salary / Currency',
        type: FieldMetadataType.CURRENCY,
        subFieldName: 'currencyCode',
      },
    ]);
  });

  it('exports the foreign key only for a many-to-one relation', () => {
    expect(
      buildRecordExportColumns([
        getFlatFieldMetadataMock({
          ...fieldDefaults,
          type: FieldMetadataType.RELATION,
          name: 'company',
          label: 'Company',
          settings: { relationType: RelationType.MANY_TO_ONE },
        }),
        getFlatFieldMetadataMock({
          ...fieldDefaults,
          type: FieldMetadataType.RELATION,
          name: 'opportunities',
          label: 'Opportunities',
          settings: { relationType: RelationType.ONE_TO_MANY },
        }),
      ]),
    ).toEqual([
      idColumn,
      {
        fieldName: 'companyId',
        label: 'Company Id',
        type: FieldMetadataType.UUID,
      },
    ]);
  });

  it('exports one labeled foreign key per many-to-one morph relation target', () => {
    expect(
      buildRecordExportColumns(
        [
          getFlatFieldMetadataMock({
            ...fieldDefaults,
            type: FieldMetadataType.MORPH_RELATION,
            name: 'ownerCompany',
            label: 'Owner',
            relationTargetObjectMetadataId: 'company',
            settings: { relationType: RelationType.MANY_TO_ONE },
          }),
          getFlatFieldMetadataMock({
            ...fieldDefaults,
            type: FieldMetadataType.MORPH_RELATION,
            name: 'ownerPerson',
            label: 'Owner',
            relationTargetObjectMetadataId: 'person',
            settings: { relationType: RelationType.MANY_TO_ONE },
          }),
          getFlatFieldMetadataMock({
            ...fieldDefaults,
            type: FieldMetadataType.MORPH_RELATION,
            name: 'targetOpportunities',
            label: 'Targets',
            relationTargetObjectMetadataId: 'opportunity',
            settings: { relationType: RelationType.ONE_TO_MANY },
          }),
        ],
        { company: 'Company', person: 'Person', opportunity: 'Opportunity' },
      ),
    ).toEqual([
      idColumn,
      {
        fieldName: 'ownerCompanyId',
        label: 'Owner Company Id',
        type: FieldMetadataType.UUID,
      },
      {
        fieldName: 'ownerPersonId',
        label: 'Owner Person Id',
        type: FieldMetadataType.UUID,
      },
    ]);
  });
});
