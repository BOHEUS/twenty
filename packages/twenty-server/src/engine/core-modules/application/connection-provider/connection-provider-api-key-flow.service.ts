import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { isNonEmptyString } from '@sniptt/guards';
import { ConnectedAccountProvider } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { Repository } from 'typeorm';

import { ConnectionProviderExceptionCode } from 'src/engine/core-modules/application/connection-provider/connection-provider-exception-code.enum';
import { type PlaintextString } from 'src/engine/core-modules/secret-encryption/branded-strings/plaintext-string.type';
import { ConnectionProviderLifecycleHookService } from 'src/engine/core-modules/application/connection-provider/connection-provider-lifecycle-hook.service';
import { ConnectionProviderException } from 'src/engine/core-modules/application/connection-provider/connection-provider.exception';
import { ConnectionProviderService } from 'src/engine/core-modules/application/connection-provider/connection-provider.service';
import { assertApiKeyProvider } from 'src/engine/core-modules/application/connection-provider/utils/assert-api-key-provider.util';
import { UserEntity } from 'src/engine/core-modules/user/user.entity';
import { ConnectedAccountEntity } from 'src/engine/metadata-modules/connected-account/entities/connected-account.entity';
import { ConnectedAccountTokenEncryptionService } from 'src/engine/metadata-modules/connected-account/services/connected-account-token-encryption.service';

type ConnectArgs = {
  connectionProviderId: string;
  fieldValues: { key: string; value: string }[];
  visibility: 'user' | 'workspace';
  workspaceId: string;
  userId: string;
  userWorkspaceId: string;
};

@Injectable()
export class ConnectionProviderApiKeyFlowService {
  constructor(
    private readonly connectionProviderService: ConnectionProviderService,
    private readonly connectedAccountTokenEncryptionService: ConnectedAccountTokenEncryptionService,
    private readonly connectionProviderLifecycleHookService: ConnectionProviderLifecycleHookService,
    @InjectRepository(ConnectedAccountEntity)
    private readonly connectedAccountRepository: Repository<ConnectedAccountEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async connect(args: ConnectArgs): Promise<ConnectedAccountEntity> {
    const provider = await this.connectionProviderService.findOneByIdOrThrow(
      args.connectionProviderId,
    );

    assertApiKeyProvider(provider);

    const { apiKeyConfig } = provider;

    const valueByKey = new Map(
      args.fieldValues.map(({ key, value }) => [key, value]),
    );

    const declaredKeys = new Set(apiKeyConfig.fields.map((field) => field.key));

    for (const key of valueByKey.keys()) {
      if (!declaredKeys.has(key)) {
        throw new ConnectionProviderException(
          `Connection provider "${provider.name}" does not declare a field named "${key}"`,
          ConnectionProviderExceptionCode.INVALID_REQUEST,
        );
      }
    }

    for (const field of apiKeyConfig.fields) {
      if (field.isRequired && !isNonEmptyString(valueByKey.get(field.key))) {
        throw new ConnectionProviderException(
          `Connection provider "${provider.name}" requires a value for "${field.key}"`,
          ConnectionProviderExceptionCode.INVALID_REQUEST,
        );
      }
    }

    const token = valueByKey.get(apiKeyConfig.tokenFieldKey);

    if (!isNonEmptyString(token)) {
      throw new ConnectionProviderException(
        `Connection provider "${provider.name}" requires a value for "${apiKeyConfig.tokenFieldKey}"`,
        ConnectionProviderExceptionCode.INVALID_REQUEST,
      );
    }

    // Only the token field is ever encrypted, so nothing else may be a secret.
    const apiKeyParameters = Object.fromEntries(
      apiKeyConfig.fields
        .filter(
          (field) =>
            field.key !== apiKeyConfig.tokenFieldKey &&
            isNonEmptyString(valueByKey.get(field.key)),
        )
        .map((field) => [field.key, valueByKey.get(field.key) as string]),
    );

    const handle = await this.resolveHandle({
      handleFieldValue: isDefined(apiKeyConfig.handleFieldKey)
        ? valueByKey.get(apiKeyConfig.handleFieldKey)
        : undefined,
      userId: args.userId,
    });

    const existingCount = await this.connectedAccountRepository.count({
      where: {
        connectionProviderId: provider.id,
        workspaceId: args.workspaceId,
      },
    });

    const created = this.connectedAccountRepository.create({
      accessToken: this.connectedAccountTokenEncryptionService.encrypt({
        plaintext: token as PlaintextString,
        workspaceId: args.workspaceId,
      }),
      apiKeyParameters:
        Object.keys(apiKeyParameters).length > 0 ? apiKeyParameters : null,
      lastCredentialsRefreshedAt: new Date(),
      authFailedAt: null,
      handle,
      name: `${provider.displayName} #${existingCount + 1}`,
      visibility: args.visibility,
      provider: ConnectedAccountProvider.APP,
      workspaceId: args.workspaceId,
      applicationId: provider.applicationId,
      connectionProviderId: provider.id,
      userWorkspaceId: args.userWorkspaceId,
    });

    const connectedAccount =
      await this.connectedAccountRepository.save(created);

    await this.connectionProviderLifecycleHookService.dispatchOnConnect({
      provider,
      workspaceId: args.workspaceId,
      connectedAccountId: connectedAccount.id,
    });

    return connectedAccount;
  }

  private async resolveHandle({
    handleFieldValue,
    userId,
  }: {
    handleFieldValue: string | undefined;
    userId: string;
  }): Promise<string> {
    if (isNonEmptyString(handleFieldValue)) {
      return handleFieldValue;
    }

    const user = await this.userRepository.findOneBy({ id: userId });

    if (!isDefined(user)) {
      throw new ConnectionProviderException(
        'User not found',
        ConnectionProviderExceptionCode.INVALID_STATE,
      );
    }

    return user.email;
  }
}
