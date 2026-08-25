import { type StoredApiKeyConnectionProviderConfig } from 'twenty-shared/application';
import { isDefined } from 'twenty-shared/utils';

import { ConnectionProviderEntity } from 'src/engine/core-modules/application/connection-provider/connection-provider.entity';
import { ConnectionProviderExceptionCode } from 'src/engine/core-modules/application/connection-provider/connection-provider-exception-code.enum';
import { ConnectionProviderException } from 'src/engine/core-modules/application/connection-provider/connection-provider.exception';

export type ApiKeyConnectionProvider = ConnectionProviderEntity & {
  type: 'apiKey';
  apiKeyConfig: StoredApiKeyConnectionProviderConfig;
};

export function assertApiKeyProvider(
  provider: ConnectionProviderEntity,
): asserts provider is ApiKeyConnectionProvider {
  if (provider.type !== 'apiKey' || !isDefined(provider.apiKeyConfig)) {
    throw new ConnectionProviderException(
      `Connection provider "${provider.name}" (id ${provider.id}) is not apiKey-typed or has no apiKeyConfig`,
      ConnectionProviderExceptionCode.INVALID_REQUEST,
    );
  }
}
