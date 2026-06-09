import { type FieldMetadataType } from 'twenty-shared/types';
import { isDefined, isSearchableFieldType } from 'twenty-shared/utils';

import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { SEARCH_VECTOR_FIELD } from 'src/engine/metadata-modules/search-field-metadata/constants/search-vector-field.constants';

const QUOTED_COLUMN_NAME_REGEX = /"([^"]+)"/g;

// Fallback used for objects whose searchVector field predates the configurable
// searchable fields feature: recover the included field ids from the generated
// asExpression by matching quoted column names back to fields. Exact name match
// wins; otherwise the longest field-name prefix wins (composite columns such as
// "namePrimaryPhoneNumber" map back to the "name" field).
export const deriveSearchFieldMetadataIdsFromAsExpression = ({
  asExpression,
  objectFlatFieldMetadatas,
}: {
  asExpression: string | undefined;
  objectFlatFieldMetadatas: FlatFieldMetadata[];
}): string[] => {
  if (!isDefined(asExpression)) {
    return [];
  }

  const columnNames = [
    ...new Set(
      Array.from(
        asExpression.matchAll(QUOTED_COLUMN_NAME_REGEX),
        (match) => match[1],
      ),
    ),
  ];

  const candidateFields = objectFlatFieldMetadatas
    .filter(
      (flatFieldMetadata) =>
        flatFieldMetadata.name !== SEARCH_VECTOR_FIELD.name &&
        isSearchableFieldType(flatFieldMetadata.type),
    )
    .sort((a, b) => b.name.length - a.name.length);

  const includedFieldIds: string[] = [];
  const seenFieldIds = new Set<string>();

  for (const columnName of columnNames) {
    const matchingField = candidateFields.find(
      (flatFieldMetadata) =>
        columnName === flatFieldMetadata.name ||
        columnName.startsWith(flatFieldMetadata.name),
    );

    if (isDefined(matchingField) && !seenFieldIds.has(matchingField.id)) {
      seenFieldIds.add(matchingField.id);
      includedFieldIds.push(matchingField.id);
    }
  }

  return includedFieldIds;
};

// Source of truth accessor: explicit searchFieldMetadataIds when present,
// otherwise derived from asExpression for not-yet-migrated objects.
export const getSearchFieldMetadataIdsFromSearchVectorField = ({
  searchVectorFlatFieldMetadata,
  objectFlatFieldMetadatas,
}: {
  searchVectorFlatFieldMetadata: FlatFieldMetadata<FieldMetadataType.TS_VECTOR>;
  objectFlatFieldMetadatas: FlatFieldMetadata[];
}): string[] => {
  const explicitSearchFieldMetadataIds =
    searchVectorFlatFieldMetadata.settings?.searchFieldMetadataIds;

  if (isDefined(explicitSearchFieldMetadataIds)) {
    return explicitSearchFieldMetadataIds;
  }

  return deriveSearchFieldMetadataIdsFromAsExpression({
    asExpression: searchVectorFlatFieldMetadata.settings?.asExpression,
    objectFlatFieldMetadatas,
  });
};
