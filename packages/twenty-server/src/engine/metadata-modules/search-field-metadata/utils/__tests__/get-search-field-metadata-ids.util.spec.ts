import { FieldMetadataType } from 'twenty-shared/types';

import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import {
  deriveSearchFieldMetadataIdsFromAsExpression,
  getSearchFieldMetadataIdsFromSearchVectorField,
} from 'src/engine/metadata-modules/search-field-metadata/utils/get-search-field-metadata-ids.util';

const buildFlatFieldMetadata = (
  partial: Pick<FlatFieldMetadata, 'id' | 'name' | 'type'>,
): FlatFieldMetadata => partial as FlatFieldMetadata;

const nameField = buildFlatFieldMetadata({
  id: 'name-id',
  name: 'name',
  type: FieldMetadataType.FULL_NAME,
});

const jobTitleField = buildFlatFieldMetadata({
  id: 'job-title-id',
  name: 'jobTitle',
  type: FieldMetadataType.TEXT,
});

const phonesField = buildFlatFieldMetadata({
  id: 'phones-id',
  name: 'phones',
  type: FieldMetadataType.PHONES,
});

const createdByField = buildFlatFieldMetadata({
  id: 'created-by-id',
  name: 'createdBy',
  type: FieldMetadataType.ACTOR,
});

const searchVectorField = buildFlatFieldMetadata({
  id: 'search-vector-id',
  name: 'searchVector',
  type: FieldMetadataType.TS_VECTOR,
}) as FlatFieldMetadata<FieldMetadataType.TS_VECTOR>;

const objectFlatFieldMetadatas = [
  nameField,
  jobTitleField,
  phonesField,
  createdByField,
  searchVectorField,
];

describe('deriveSearchFieldMetadataIdsFromAsExpression', () => {
  it('returns an empty array when asExpression is undefined', () => {
    expect(
      deriveSearchFieldMetadataIdsFromAsExpression({
        asExpression: undefined,
        objectFlatFieldMetadatas,
      }),
    ).toEqual([]);
  });

  it('maps quoted column names back to their field ids', () => {
    const asExpression = `to_tsvector('simple', COALESCE(public.unaccent_immutable("nameFirstName"), '') || ' ' || COALESCE(public.unaccent_immutable("jobTitle"), ''))`;

    expect(
      deriveSearchFieldMetadataIdsFromAsExpression({
        asExpression,
        objectFlatFieldMetadatas,
      }),
    ).toEqual(['name-id', 'job-title-id']);
  });

  it('maps composite column prefixes back to the owning field', () => {
    const asExpression = `to_tsvector('simple', COALESCE("phonesPrimaryPhoneNumber", ''))`;

    expect(
      deriveSearchFieldMetadataIdsFromAsExpression({
        asExpression,
        objectFlatFieldMetadatas,
      }),
    ).toEqual(['phones-id']);
  });

  it('ignores columns that map to non-searchable field types', () => {
    const asExpression = `to_tsvector('simple', COALESCE("createdBySource", ''))`;

    expect(
      deriveSearchFieldMetadataIdsFromAsExpression({
        asExpression,
        objectFlatFieldMetadatas,
      }),
    ).toEqual([]);
  });
});

describe('getSearchFieldMetadataIdsFromSearchVectorField', () => {
  it('returns explicit searchFieldMetadataIds when present', () => {
    const searchVectorWithExplicitIds = {
      ...searchVectorField,
      settings: {
        asExpression: `to_tsvector('simple', COALESCE(public.unaccent_immutable("nameFirstName"), ''))`,
        generatedType: 'STORED',
        searchFieldMetadataIds: ['name-id', 'job-title-id'],
      },
    } as FlatFieldMetadata<FieldMetadataType.TS_VECTOR>;

    expect(
      getSearchFieldMetadataIdsFromSearchVectorField({
        searchVectorFlatFieldMetadata: searchVectorWithExplicitIds,
        objectFlatFieldMetadatas,
      }),
    ).toEqual(['name-id', 'job-title-id']);
  });

  it('falls back to deriving from asExpression when explicit ids are absent', () => {
    const searchVectorWithoutExplicitIds = {
      ...searchVectorField,
      settings: {
        asExpression: `to_tsvector('simple', COALESCE(public.unaccent_immutable("jobTitle"), ''))`,
        generatedType: 'STORED',
      },
    } as FlatFieldMetadata<FieldMetadataType.TS_VECTOR>;

    expect(
      getSearchFieldMetadataIdsFromSearchVectorField({
        searchVectorFlatFieldMetadata: searchVectorWithoutExplicitIds,
        objectFlatFieldMetadatas,
      }),
    ).toEqual(['job-title-id']);
  });
});
