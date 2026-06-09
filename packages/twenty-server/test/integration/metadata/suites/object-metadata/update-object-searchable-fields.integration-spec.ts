import { createManyOperation } from 'test/integration/graphql/utils/create-many-operation.util';
import { search } from 'test/integration/graphql/utils/search.util';
import { createOneFieldMetadata } from 'test/integration/metadata/suites/field-metadata/utils/create-one-field-metadata.util';
import { deleteOneFieldMetadata } from 'test/integration/metadata/suites/field-metadata/utils/delete-one-field-metadata.util';
import { createOneObjectMetadata } from 'test/integration/metadata/suites/object-metadata/utils/create-one-object-metadata.util';
import { deleteOneObjectMetadata } from 'test/integration/metadata/suites/object-metadata/utils/delete-one-object-metadata.util';
import { findManyObjectMetadata } from 'test/integration/metadata/suites/object-metadata/utils/find-many-object-metadata.util';
import { updateObjectSearchableFields } from 'test/integration/metadata/suites/object-metadata/utils/update-object-searchable-fields.util';
import { updateOneObjectMetadata } from 'test/integration/metadata/suites/object-metadata/utils/update-one-object-metadata.util';
import { jestExpectToBeDefined } from 'test/utils/jest-expect-to-be-defined.util.test';
import { FieldMetadataType } from 'twenty-shared/types';

import { type FieldMetadataDTO } from 'src/engine/metadata-modules/field-metadata/dtos/field-metadata.dto';

// Scaffold for the user-configurable searchable fields feature. Exercises the
// updateObjectSearchableFields mutation (include + exclude) and the delete
// cascade (deleting a field that feeds the search vector must rebuild the
// generated column first instead of failing on the column dependency).
describe('Object searchable fields - updateObjectSearchableFields + delete cascade', () => {
  let testObjectMetadataId: string;
  let searchableTagFieldMetadataId: string;
  let createdRecordId: string;

  const OBJECT_NAME_SINGULAR = 'searchableFieldsTestObject';
  const OBJECT_NAME_PLURAL = 'searchableFieldsTestObjects';
  const TAG_FIELD_NAME = 'searchableTag';
  const RECORD_NAME_VALUE = 'PrimaryNameValue';
  const RECORD_TAG_VALUE = 'UniqueTagValue123';

  type SearchVectorSettings = {
    asExpression?: string;
    generatedType?: string;
    searchFieldMetadataIds?: string[];
  };

  const getSearchVectorSettings = async (): Promise<SearchVectorSettings> => {
    const { objects } = await findManyObjectMetadata({
      expectToFail: false,
      input: {
        filter: { id: { eq: testObjectMetadataId } },
        paging: { first: 1 },
      },
      gqlFields: `
        id
        nameSingular
        fieldsList {
          id
          name
          type
          settings
        }
      `,
    });

    const testObject = objects[0];

    jestExpectToBeDefined(testObject);
    jestExpectToBeDefined(testObject.fieldsList);

    const searchVectorField = testObject.fieldsList.find(
      (field: FieldMetadataDTO) => field.type === FieldMetadataType.TS_VECTOR,
    );

    jestExpectToBeDefined(searchVectorField);
    jestExpectToBeDefined(searchVectorField.settings);

    return searchVectorField.settings as SearchVectorSettings;
  };

  beforeAll(async () => {
    const {
      data: {
        createOneObject: { id: objectMetadataId },
      },
    } = await createOneObjectMetadata({
      expectToFail: false,
      input: {
        nameSingular: OBJECT_NAME_SINGULAR,
        namePlural: OBJECT_NAME_PLURAL,
        labelSingular: 'Searchable Fields Test Object',
        labelPlural: 'Searchable Fields Test Objects',
        icon: 'IconSearch',
        isLabelSyncedWithName: false,
      },
    });

    testObjectMetadataId = objectMetadataId;

    const {
      data: {
        createOneField: { id: fieldMetadataId },
      },
    } = await createOneFieldMetadata({
      expectToFail: false,
      input: {
        name: TAG_FIELD_NAME,
        label: 'Searchable Tag',
        type: FieldMetadataType.TEXT,
        objectMetadataId: testObjectMetadataId,
        isLabelSyncedWithName: false,
      },
      gqlFields: `
        id
        name
        label
      `,
    });

    searchableTagFieldMetadataId = fieldMetadataId;

    const { data } = await createManyOperation({
      objectMetadataSingularName: OBJECT_NAME_SINGULAR,
      objectMetadataPluralName: OBJECT_NAME_PLURAL,
      gqlFields: `id name ${TAG_FIELD_NAME}`,
      data: [
        {
          name: RECORD_NAME_VALUE,
          [TAG_FIELD_NAME]: RECORD_TAG_VALUE,
        },
      ],
      expectToFail: false,
    });

    createdRecordId = data.createdRecords[0].id;
  });

  afterAll(async () => {
    await updateOneObjectMetadata({
      expectToFail: false,
      input: {
        idToUpdate: testObjectMetadataId,
        updatePayload: { isActive: false },
      },
    });
    await deleteOneObjectMetadata({
      expectToFail: false,
      input: { idToDelete: testObjectMetadataId },
    });
  });

  it('does not match a value from a field that is not in the search vector', async () => {
    const searchResult = await search({
      searchInput: RECORD_TAG_VALUE,
      includedObjectNameSingulars: [OBJECT_NAME_SINGULAR],
      limit: 10,
      expectToFail: false,
    });

    expect(searchResult.data.search.edges.length).toBe(0);
  });

  it('adds a field to the search vector and recomputes existing records', async () => {
    const { errors } = await updateObjectSearchableFields({
      expectToFail: false,
      input: {
        objectMetadataId: testObjectMetadataId,
        fieldMetadataIds: [searchableTagFieldMetadataId],
      },
      gqlFields: 'id',
    });

    expect(errors).toBeUndefined();

    const settings = await getSearchVectorSettings();

    expect(settings.searchFieldMetadataIds).toEqual([
      searchableTagFieldMetadataId,
    ]);
    expect(settings.asExpression).toContain(TAG_FIELD_NAME);

    const searchResult = await search({
      searchInput: RECORD_TAG_VALUE,
      includedObjectNameSingulars: [OBJECT_NAME_SINGULAR],
      limit: 10,
      expectToFail: false,
    });

    expect(searchResult.data.search.edges.length).toBe(1);
    expect(searchResult.data.search.edges[0].node.recordId).toBe(
      createdRecordId,
    );
  });

  it('removes a field from the search vector', async () => {
    const { errors } = await updateObjectSearchableFields({
      expectToFail: false,
      input: {
        objectMetadataId: testObjectMetadataId,
        fieldMetadataIds: [],
      },
      gqlFields: 'id',
    });

    expect(errors).toBeUndefined();

    const settings = await getSearchVectorSettings();

    expect(settings.searchFieldMetadataIds).toEqual([]);
    expect(settings.asExpression).not.toContain(TAG_FIELD_NAME);

    const searchResult = await search({
      searchInput: RECORD_TAG_VALUE,
      includedObjectNameSingulars: [OBJECT_NAME_SINGULAR],
      limit: 10,
      expectToFail: false,
    });

    expect(searchResult.data.search.edges.length).toBe(0);
  });

  it('rebuilds the search vector when a searched field is deleted (delete cascade)', async () => {
    // Re-add the field so the deletion has to break the generated-column
    // dependency through the preliminary searchVector rebuild.
    await updateObjectSearchableFields({
      expectToFail: false,
      input: {
        objectMetadataId: testObjectMetadataId,
        fieldMetadataIds: [searchableTagFieldMetadataId],
      },
      gqlFields: 'id',
    });

    const settingsBeforeDelete = await getSearchVectorSettings();

    expect(settingsBeforeDelete.searchFieldMetadataIds).toEqual([
      searchableTagFieldMetadataId,
    ]);

    const { errors } = await deleteOneFieldMetadata({
      expectToFail: false,
      input: { idToDelete: searchableTagFieldMetadataId },
    });

    expect(errors).toBeUndefined();

    const settingsAfterDelete = await getSearchVectorSettings();

    expect(settingsAfterDelete.searchFieldMetadataIds).not.toContain(
      searchableTagFieldMetadataId,
    );
    expect(settingsAfterDelete.asExpression).not.toContain(TAG_FIELD_NAME);

    const searchResult = await search({
      searchInput: RECORD_TAG_VALUE,
      includedObjectNameSingulars: [OBJECT_NAME_SINGULAR],
      limit: 10,
      expectToFail: false,
    });

    expect(searchResult.data.search.edges.length).toBe(0);
  });
});
