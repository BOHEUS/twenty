import gql from 'graphql-tag';
import { type PerformMetadataQueryParams } from 'test/integration/metadata/types/perform-metadata-query.type';

export type UpdateObjectSearchableFieldsFactoryInput = {
  objectMetadataId: string;
  fieldMetadataIds: string[];
};

export const updateObjectSearchableFieldsQueryFactory = ({
  gqlFields = 'id',
  input,
}: PerformMetadataQueryParams<UpdateObjectSearchableFieldsFactoryInput>) => ({
  query: gql`
    mutation UpdateObjectSearchableFields($input: UpdateObjectSearchableFieldsInput!) {
      updateObjectSearchableFields(input: $input) {
        ${gqlFields}
      }
    }
  `,
  variables: {
    input: {
      objectMetadataId: input.objectMetadataId,
      fieldMetadataIds: input.fieldMetadataIds,
    },
  },
});
