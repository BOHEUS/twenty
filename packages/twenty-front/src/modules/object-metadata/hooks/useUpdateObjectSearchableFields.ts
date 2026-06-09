import { useMutation } from '@apollo/client/react';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { CrudOperationType } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

import { useMetadataErrorHandler } from '@/metadata-error-handler/hooks/useMetadataErrorHandler';
import { useUpdateMetadataStoreDraft } from '@/metadata-store/hooks/useUpdateMetadataStoreDraft';
import { type FlatFieldMetadataItem } from '@/metadata-store/types/FlatFieldMetadataItem';
import { UPDATE_OBJECT_SEARCHABLE_FIELDS } from '@/object-metadata/graphql/mutations';

type UpdateObjectSearchableFieldsResponse = {
  updateObjectSearchableFields: {
    id: string;
    fieldsList: Pick<FlatFieldMetadataItem, 'id' | 'settings'>[];
  };
};

type UpdateObjectSearchableFieldsVariables = {
  input: {
    objectMetadataId: string;
    fieldMetadataIds: string[];
  };
};

export const useUpdateObjectSearchableFields = () => {
  const [updateObjectSearchableFieldsMutation, { loading }] = useMutation<
    UpdateObjectSearchableFieldsResponse,
    UpdateObjectSearchableFieldsVariables
  >(UPDATE_OBJECT_SEARCHABLE_FIELDS);

  const { handleMetadataError } = useMetadataErrorHandler();
  const { updateInDraft, applyChanges } = useUpdateMetadataStoreDraft();

  const updateObjectSearchableFields = async ({
    objectMetadataId,
    fieldMetadataIds,
  }: {
    objectMetadataId: string;
    fieldMetadataIds: string[];
  }) => {
    try {
      const response = await updateObjectSearchableFieldsMutation({
        variables: {
          input: {
            objectMetadataId,
            fieldMetadataIds,
          },
        },
      });

      const updatedFields =
        response.data?.updateObjectSearchableFields.fieldsList;

      if (isDefined(updatedFields)) {
        updateInDraft(
          'fieldMetadataItems',
          updatedFields.map(
            ({ id, settings }) => ({ id, settings }) as FlatFieldMetadataItem,
          ),
        );
        applyChanges();
      }

      return { status: 'successful' as const, response };
    } catch (error) {
      if (CombinedGraphQLErrors.is(error)) {
        handleMetadataError(error, {
          primaryMetadataName: 'objectMetadata',
          operationType: CrudOperationType.UPDATE,
        });
      }

      return { status: 'failed' as const, error };
    }
  };

  return { updateObjectSearchableFields, loading };
};
