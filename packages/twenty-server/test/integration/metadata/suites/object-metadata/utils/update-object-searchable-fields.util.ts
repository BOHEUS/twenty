import { makeMetadataAPIRequest } from 'test/integration/metadata/suites/utils/make-metadata-api-request.util';
import {
  type UpdateObjectSearchableFieldsFactoryInput,
  updateObjectSearchableFieldsQueryFactory,
} from 'test/integration/metadata/suites/object-metadata/utils/update-object-searchable-fields-query-factory.util';
import { type CommonResponseBody } from 'test/integration/metadata/types/common-response-body.type';
import { type PerformMetadataQueryParams } from 'test/integration/metadata/types/perform-metadata-query.type';
import { warnIfErrorButNotExpectedToFail } from 'test/integration/metadata/utils/warn-if-error-but-not-expected-to-fail.util';
import { warnIfNoErrorButExpectedToFail } from 'test/integration/metadata/utils/warn-if-no-error-but-expected-to-fail.util';

import { type ObjectMetadataDTO } from 'src/engine/metadata-modules/object-metadata/dtos/object-metadata.dto';

export const updateObjectSearchableFields = async ({
  input,
  gqlFields,
  expectToFail,
}: PerformMetadataQueryParams<UpdateObjectSearchableFieldsFactoryInput>): CommonResponseBody<{
  updateObjectSearchableFields: ObjectMetadataDTO;
}> => {
  const graphqlOperation = updateObjectSearchableFieldsQueryFactory({
    input,
    gqlFields,
  });

  const response = await makeMetadataAPIRequest(graphqlOperation);

  if (expectToFail === true) {
    warnIfNoErrorButExpectedToFail({
      response,
      errorMessage:
        'Object searchable fields update should have failed but did not',
    });
  }

  if (expectToFail === false) {
    warnIfErrorButNotExpectedToFail({
      response,
      errorMessage: 'Object searchable fields update has failed but should not',
    });
  }

  return { data: response.body.data, errors: response.body.errors };
};
