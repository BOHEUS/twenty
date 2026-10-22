import { msg, t } from '@lingui/core/macro';
import { isNonEmptyString } from '@sniptt/guards';
import { type StoredOAuthConnectionProviderConfig } from 'twenty-shared/application';
import { isDefined } from 'twenty-shared/utils';

import { ConnectionProviderExceptionCode } from 'src/engine/core-modules/application/connection-provider/connection-provider-exception-code.enum';
import { type FlatEntityValidationError } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-builder/builders/types/failed-flat-entity-validation.type';
import { type UniversalFlatConnectionProvider } from 'src/engine/workspace-manager/workspace-migration/universal-flat-entity/types/universal-flat-connection-provider.type';

const REQUIRED_OAUTH_CONFIG_KEYS = [
  'authorizationEndpoint',
  'tokenEndpoint',
  'clientIdVariable',
  'clientSecretVariable',
] as const satisfies readonly (keyof StoredOAuthConnectionProviderConfig)[];

export const validateConnectionProviderTypeConfig = ({
  type,
  oauthConfig,
  identifyAccountLogicFunctionUniversalIdentifier,
}: Pick<
  UniversalFlatConnectionProvider,
  'type' | 'oauthConfig' | 'identifyAccountLogicFunctionUniversalIdentifier'
>): FlatEntityValidationError<ConnectionProviderExceptionCode>[] => {
  switch (type) {
    case 'oauth': {
      if (!isDefined(oauthConfig)) {
        return [
          {
            code: ConnectionProviderExceptionCode.INVALID_CONNECTION_PROVIDER_INPUT,
            message: t`Connection provider with type 'oauth' is missing oauthConfig`,
            userFriendlyMessage: msg`OAuth connection provider is missing its oauth config block`,
          },
        ];
      }

      return REQUIRED_OAUTH_CONFIG_KEYS.filter(
        (label) => !isNonEmptyString(oauthConfig[label]),
      ).map((label) => ({
        code: ConnectionProviderExceptionCode.INVALID_CONNECTION_PROVIDER_INPUT,
        message: t`Connection provider oauthConfig.${label} is required`,
        userFriendlyMessage: msg`OAuth ${label} is required`,
      }));
    }
    case 'apiKey': {
      const errors: FlatEntityValidationError<ConnectionProviderExceptionCode>[] =
        [];

      if (isDefined(oauthConfig)) {
        errors.push({
          code: ConnectionProviderExceptionCode.INVALID_CONNECTION_PROVIDER_INPUT,
          message: t`Connection provider with type 'apiKey' must not have an oauthConfig`,
          userFriendlyMessage: msg`API key connection provider must not declare an oauth config block`,
        });
      }

      if (!isDefined(identifyAccountLogicFunctionUniversalIdentifier)) {
        errors.push({
          code: ConnectionProviderExceptionCode.INVALID_CONNECTION_PROVIDER_INPUT,
          message: t`Connection provider with type 'apiKey' requires an identifyAccount logic function`,
          userFriendlyMessage: msg`API key connection provider must declare an identifyAccount logic function`,
        });
      }

      return errors;
    }
    default:
      return [
        {
          code: ConnectionProviderExceptionCode.INVALID_CONNECTION_PROVIDER_INPUT,
          message: t`Connection provider type "${type}" is invalid`,
          userFriendlyMessage: msg`This connection provider type is not supported.`,
        },
      ];
  }
};
