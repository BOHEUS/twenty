import {
  FieldMetadataType,
  type ObjectsPermissions,
  RelationType,
} from 'twenty-shared/types';

import { computeIncludeSelectedFieldsOrThrow } from 'src/engine/api/rest/input-request-parsers/include-parser-utils/compute-include-selected-fields-or-throw.util';
import { RestInputRequestParserException } from 'src/engine/api/rest/input-request-parsers/rest-input-request-parser.exception';
import { createEmptyFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/constant/create-empty-flat-entity-maps.constant';
import { type FlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/flat-entity-maps.type';
import { addFlatEntityToFlatEntityMapsOrThrow } from 'src/engine/metadata-modules/flat-entity/utils/add-flat-entity-to-flat-entity-maps-or-throw.util';
import { getFlatFieldMetadataMock } from 'src/engine/metadata-modules/flat-field-metadata/__mocks__/get-flat-field-metadata.mock';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { getFlatObjectMetadataMock } from 'src/engine/metadata-modules/flat-object-metadata/__mocks__/get-flat-object-metadata.mock';
import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';

const PERSON_ID = 'person-id';
const COMPANY_ID = 'company-id';
const NOTE_ID = 'note-id';

const personName = getFlatFieldMetadataMock({
  id: 'person-name',
  universalIdentifier: 'person-name',
  name: 'name',
  objectMetadataId: PERSON_ID,
  type: FieldMetadataType.TEXT,
});
const personCompany = getFlatFieldMetadataMock({
  id: 'person-company',
  universalIdentifier: 'person-company',
  name: 'company',
  objectMetadataId: PERSON_ID,
  type: FieldMetadataType.RELATION,
  settings: { relationType: RelationType.MANY_TO_ONE },
  relationTargetObjectMetadataId: COMPANY_ID,
});
const companyName = getFlatFieldMetadataMock({
  id: 'company-name',
  universalIdentifier: 'company-name',
  name: 'name',
  objectMetadataId: COMPANY_ID,
  type: FieldMetadataType.TEXT,
});
const companySecret = getFlatFieldMetadataMock({
  id: 'company-secret',
  universalIdentifier: 'company-secret',
  name: 'secret',
  objectMetadataId: COMPANY_ID,
  type: FieldMetadataType.TEXT,
});
const companyPeople = getFlatFieldMetadataMock({
  id: 'company-people',
  universalIdentifier: 'company-people',
  name: 'people',
  objectMetadataId: COMPANY_ID,
  type: FieldMetadataType.RELATION,
  settings: { relationType: RelationType.ONE_TO_MANY },
  relationTargetObjectMetadataId: PERSON_ID,
});
const companyNotes = getFlatFieldMetadataMock({
  id: 'company-notes',
  universalIdentifier: 'company-notes',
  name: 'notes',
  objectMetadataId: COMPANY_ID,
  type: FieldMetadataType.RELATION,
  settings: { relationType: RelationType.ONE_TO_MANY },
  relationTargetObjectMetadataId: NOTE_ID,
});
const noteTitle = getFlatFieldMetadataMock({
  id: 'note-title',
  universalIdentifier: 'note-title',
  name: 'title',
  objectMetadataId: NOTE_ID,
  type: FieldMetadataType.TEXT,
});

const personObject = getFlatObjectMetadataMock({
  universalIdentifier: PERSON_ID,
  id: PERSON_ID,
  nameSingular: 'person',
  fieldIds: [personName.id, personCompany.id],
});
const companyObject = getFlatObjectMetadataMock({
  universalIdentifier: COMPANY_ID,
  id: COMPANY_ID,
  nameSingular: 'company',
  fieldIds: [
    companyName.id,
    companySecret.id,
    companyPeople.id,
    companyNotes.id,
  ],
});
const noteObject = getFlatObjectMetadataMock({
  universalIdentifier: NOTE_ID,
  id: NOTE_ID,
  nameSingular: 'note',
  fieldIds: [noteTitle.id],
});

const buildMaps = <TEntity extends FlatFieldMetadata | FlatObjectMetadata>(
  entities: TEntity[],
) =>
  entities.reduce<FlatEntityMaps<TEntity>>(
    (maps, flatEntity) =>
      addFlatEntityToFlatEntityMapsOrThrow({
        flatEntity,
        flatEntityMaps: maps,
      }),
    createEmptyFlatEntityMaps(),
  );

const flatFieldMetadataMaps = buildMaps([
  personName,
  personCompany,
  companyName,
  companySecret,
  companyPeople,
  companyNotes,
  noteTitle,
]);
const flatObjectMetadataMaps = buildMaps([
  personObject,
  companyObject,
  noteObject,
]);

const buildPermissions = ({
  unreadableObjectIds = [],
  unreadableFieldIds = [],
}: {
  unreadableObjectIds?: string[];
  unreadableFieldIds?: string[];
} = {}): ObjectsPermissions =>
  Object.fromEntries(
    [PERSON_ID, COMPANY_ID, NOTE_ID].map((objectId) => [
      objectId,
      {
        canReadObjectRecords: !unreadableObjectIds.includes(objectId),
        canUpdateObjectRecords: true,
        canSoftDeleteObjectRecords: true,
        canDestroyObjectRecords: true,
        restrictedFields: Object.fromEntries(
          unreadableFieldIds.map((fieldId) => [
            fieldId,
            { canRead: false, canUpdate: false },
          ]),
        ),
        rowLevelPermissionPredicates: [],
        rowLevelPermissionPredicateGroups: [],
      },
    ]),
  );

const compute = (
  includeTree: Parameters<
    typeof computeIncludeSelectedFieldsOrThrow
  >[0]['includeTree'],
  objectsPermissions = buildPermissions(),
) =>
  computeIncludeSelectedFieldsOrThrow({
    includeTree,
    flatObjectMetadata: personObject,
    flatObjectMetadataMaps,
    flatFieldMetadataMaps,
    objectsPermissions,
  });

describe('computeIncludeSelectedFieldsOrThrow', () => {
  it('should return no fields for an empty include tree', () => {
    expect(compute({})).toEqual({});
  });

  it('should select only the requested nested relations', () => {
    expect(compute({ company: { people: {} } })).toEqual({
      company: {
        name: true,
        secret: true,
        notes: true,
        people: { name: true, companyId: true },
      },
    });
  });

  it('should omit fields the role cannot read on included relations', () => {
    expect(
      compute(
        { company: {} },
        buildPermissions({ unreadableFieldIds: [companySecret.id] }),
      ),
    ).toEqual({ company: { name: true, people: true, notes: true } });
  });

  it.each(['unknown', 'constructor', 'toString'])(
    'should throw on unknown relation "%s"',
    (relationFieldName) => {
      expect(() => compute({ [relationFieldName]: {} })).toThrow(
        RestInputRequestParserException,
      );
    },
  );

  it('should throw when the path targets a non-relation field', () => {
    expect(() => compute({ name: {} })).toThrow(
      RestInputRequestParserException,
    );
  });

  it('should throw when the relation field is not readable', () => {
    expect(() =>
      compute(
        { company: { notes: {} } },
        buildPermissions({ unreadableFieldIds: [companyNotes.id] }),
      ),
    ).toThrow(RestInputRequestParserException);
  });

  it('should throw when the nested relation target object is not readable', () => {
    expect(() =>
      compute(
        { company: { notes: {} } },
        buildPermissions({ unreadableObjectIds: [NOTE_ID] }),
      ),
    ).toThrow(RestInputRequestParserException);
  });
});
