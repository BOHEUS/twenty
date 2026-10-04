import { msg, t } from '@lingui/core/macro';
import { isNonEmptyString, isObject } from '@sniptt/guards';
import { isDefined } from 'twenty-shared/utils';

import { LogicFunctionExceptionCode } from 'src/engine/metadata-modules/logic-function/logic-function.exception';
import { type UniversalFlatLogicFunction } from 'src/engine/workspace-manager/workspace-migration/universal-flat-entity/types/universal-flat-logic-function.type';
import { type FlatEntityValidationError } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-builder/builders/types/failed-flat-entity-validation.type';

const SIGNATURE_ALGORITHMS = new Set(['sha1', 'sha256', 'sha512']);
const SIGNATURE_ENCODINGS = new Set(['hex', 'base64']);

const buildError = (
  message: string,
): FlatEntityValidationError<LogicFunctionExceptionCode> => ({
  code: LogicFunctionExceptionCode.INVALID_LOGIC_FUNCTION_INPUT,
  message,
  userFriendlyMessage: msg`Server route request authentication settings are invalid`,
});

const isOptionalNonEmptyString = (value: unknown): boolean =>
  !isDefined(value) || isNonEmptyString(value);

export const validateLogicFunctionRequestAuthentication = ({
  serverRouteTriggerSettings,
}: Partial<
  Pick<UniversalFlatLogicFunction, 'serverRouteTriggerSettings'>
>): FlatEntityValidationError<LogicFunctionExceptionCode>[] => {
  const authentication = serverRouteTriggerSettings?.requestAuthentication;

  if (!isDefined(authentication)) {
    return [];
  }

  if (!isObject(authentication)) {
    return [buildError(t`requestAuthentication must be an object`)];
  }

  const errors: FlatEntityValidationError<LogicFunctionExceptionCode>[] = [];

  if (!isNonEmptyString(authentication.secretServerVariableName)) {
    errors.push(
      buildError(
        t`requestAuthentication.secretServerVariableName must name a server variable`,
      ),
    );
  }

  switch (authentication.type) {
    case 'HMAC_SIGNATURE':
      if (!isNonEmptyString(authentication.headerName)) {
        errors.push(
          buildError(t`requestAuthentication.headerName is required`),
        );
      }

      if (
        isDefined(authentication.algorithm) &&
        !SIGNATURE_ALGORITHMS.has(authentication.algorithm)
      ) {
        errors.push(
          buildError(
            t`requestAuthentication.algorithm must be sha1, sha256 or sha512`,
          ),
        );
      }

      if (
        isDefined(authentication.encoding) &&
        !SIGNATURE_ENCODINGS.has(authentication.encoding)
      ) {
        errors.push(
          buildError(t`requestAuthentication.encoding must be hex or base64`),
        );
      }

      if (!isOptionalNonEmptyString(authentication.signaturePrefix)) {
        errors.push(
          buildError(
            t`requestAuthentication.signaturePrefix must be a non-empty string`,
          ),
        );
      }
      break;
    case 'HEADER_TOKEN':
      if (!isNonEmptyString(authentication.headerName)) {
        errors.push(
          buildError(t`requestAuthentication.headerName is required`),
        );
      }

      if (!isOptionalNonEmptyString(authentication.tokenPrefix)) {
        errors.push(
          buildError(
            t`requestAuthentication.tokenPrefix must be a non-empty string`,
          ),
        );
      }
      break;
    case 'QUERY_TOKEN':
      if (!isNonEmptyString(authentication.parameterName)) {
        errors.push(
          buildError(t`requestAuthentication.parameterName is required`),
        );
      }
      break;
    default:
      errors.push(
        buildError(
          t`requestAuthentication.type must be HMAC_SIGNATURE, HEADER_TOKEN or QUERY_TOKEN`,
        ),
      );
  }

  return errors;
};
