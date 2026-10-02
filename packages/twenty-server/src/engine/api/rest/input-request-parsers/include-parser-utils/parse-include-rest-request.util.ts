import { isDefined } from 'twenty-shared/utils';

import { STANDARD_ERROR_MESSAGE } from 'src/engine/api/common/common-query-runners/errors/standard-error-message.constant';
import { MAX_INCLUDE_DEPTH } from 'src/engine/api/rest/input-request-parsers/constants/max-include-depth.constant';
import {
  RestInputRequestParserException,
  RestInputRequestParserExceptionCode,
} from 'src/engine/api/rest/input-request-parsers/rest-input-request-parser.exception';
import { type RelationIncludeTree } from 'src/engine/api/rest/input-request-parsers/types/relation-include-tree.type';
import { type AuthenticatedRequest } from 'src/engine/api/rest/types/authenticated-request.type';

const RELATION_FIELD_NAME_PATTERN = /^[a-zA-Z][a-zA-Z0-9]*$/;

export const parseIncludeRestRequest = (
  request: AuthenticatedRequest,
): RelationIncludeTree => {
  const includeQuery = request.query.include;

  if (!isDefined(includeQuery)) return {};

  if (typeof includeQuery !== 'string') {
    throw new RestInputRequestParserException(
      `'include' parameter invalid. Expected a comma-separated list of relation paths, ex: include=company.people,pointOfContact`,
      RestInputRequestParserExceptionCode.INVALID_INCLUDE_QUERY_PARAM,
      { userFriendlyMessage: STANDARD_ERROR_MESSAGE },
    );
  }

  const includeTree: RelationIncludeTree = {};

  for (const relationPath of includeQuery.split(',')) {
    const relationFieldNames = relationPath.trim().split('.');

    if (
      relationFieldNames.length > MAX_INCLUDE_DEPTH ||
      !relationFieldNames.every((relationFieldName) =>
        RELATION_FIELD_NAME_PATTERN.test(relationFieldName),
      )
    ) {
      throw new RestInputRequestParserException(
        `'include=${includeQuery}' parameter invalid. Each relation path must contain 1 to ${MAX_INCLUDE_DEPTH} relation names separated by dots, ex: include=company.people,pointOfContact`,
        RestInputRequestParserExceptionCode.INVALID_INCLUDE_QUERY_PARAM,
        { userFriendlyMessage: STANDARD_ERROR_MESSAGE },
      );
    }

    let currentLevel = includeTree;

    for (const relationFieldName of relationFieldNames) {
      if (
        !Object.prototype.hasOwnProperty.call(currentLevel, relationFieldName)
      ) {
        currentLevel[relationFieldName] = {};
      }

      currentLevel = currentLevel[relationFieldName];
    }
  }

  return includeTree;
};
