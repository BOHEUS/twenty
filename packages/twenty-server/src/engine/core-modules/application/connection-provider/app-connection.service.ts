import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { msg } from '@lingui/core/macro';
import { IsNull, Repository } from 'typeorm';

import { type IdentifiedAccount } from 'twenty-shared/application';
import { ConnectedAccountProvider } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

import { AppConnectionAccessService } from 'src/engine/core-modules/application/connection-provider/app-connection-access.service';
import { ConnectionProviderExceptionCode } from 'src/engine/core-modules/application/connection-provider/connection-provider-exception-code.enum';
import { ConnectionProviderLifecycleHookService } from 'src/engine/core-modules/application/connection-provider/connection-provider-lifecycle-hook.service';
import { type ConnectionProviderEntity } from 'src/engine/core-modules/application/connection-provider/connection-provider.entity';
import { ConnectionProviderException } from 'src/engine/core-modules/application/connection-provider/connection-provider.exception';
import { ConnectionProviderService } from 'src/engine/core-modules/application/connection-provider/connection-provider.service';
import { assertConnectionScopeAllowedByProviderOrThrow } from 'src/engine/core-modules/application/connection-provider/utils/assert-connection-scope-allowed-by-provider-or-throw.util';
import {
  plaintextStringSchema,
  type PlaintextString,
} from 'src/engine/core-modules/secret-encryption/branded-strings/plaintext-string.type';
import { UserEntity } from 'src/engine/core-modules/user/user.entity';
import {
  ConnectedAccountEntity,
  type ConnectedAccountScope,
} from 'src/engine/metadata-modules/connected-account/entities/connected-account.entity';
import { ConnectedAccountTokenEncryptionService } from 'src/engine/metadata-modules/connected-account/services/connected-account-token-encryption.service';
import { buildConnectedAccountUsableByCallerWhere } from 'src/engine/metadata-modules/connected-account/utils/build-connected-account-usable-by-caller-where.util';

type ConnectionRequestArgs = {
  connectionProvider: ConnectionProviderEntity;
  workspaceId: string;
  userWorkspaceId: string;
  scope: ConnectedAccountScope | null;
  reconnectingConnectedAccountId: string | null;
};

type ConnectionCredentials = {
  accessToken: PlaintextString;
  refreshToken: PlaintextString | null;
  scopes: string[] | null;
  // Used as the handle when identifyAccount does not provide one.
  handleHint: string | null;
};

type SaveConnectionArgs = {
  connectionProvider: ConnectionProviderEntity;
  credentials: ConnectionCredentials;
  workspaceId: string;
  userId: string;
  userWorkspaceId: string;
  scope: ConnectedAccountScope;
  reconnectingConnectedAccountId: string | null;
};

@Injectable()
export class AppConnectionService {
  constructor(
    private readonly connectedAccountTokenEncryptionService: ConnectedAccountTokenEncryptionService,
    private readonly connectionProviderLifecycleHookService: ConnectionProviderLifecycleHookService,
    private readonly appConnectionAccessService: AppConnectionAccessService,
    private readonly connectionProviderService: ConnectionProviderService,
    @InjectRepository(ConnectedAccountEntity)
    private readonly connectedAccountRepository: Repository<ConnectedAccountEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async resolveAuthorizedScopeOrThrow({
    connectionProvider,
    workspaceId,
    userWorkspaceId,
    scope: requestedScope,
    reconnectingConnectedAccountId,
  }: ConnectionRequestArgs): Promise<ConnectedAccountScope> {
    const reconnectTarget = await this.findReconnectTargetOrThrow({
      connectionProviderId: connectionProvider.id,
      workspaceId,
      userWorkspaceId,
      reconnectingConnectedAccountId,
    });

    const scope =
      requestedScope ?? reconnectTarget?.scope ?? connectionProvider.scope;

    assertConnectionScopeAllowedByProviderOrThrow({
      connectionProvider,
      scope,
      reconnectTarget,
    });

    await this.validateCallerCanManageRequestedConnection({
      workspaceId,
      userWorkspaceId,
      scope,
      reconnectTarget,
    });

    return scope;
  }

  async saveConnectionOrThrow({
    connectionProvider,
    credentials,
    workspaceId,
    userId,
    userWorkspaceId,
    scope,
    reconnectingConnectedAccountId,
  }: SaveConnectionArgs): Promise<ConnectedAccountEntity> {
    const identifiedAccount =
      await this.connectionProviderLifecycleHookService.runIdentifyAccount({
        provider: connectionProvider,
        workspaceId,
        accessToken: credentials.accessToken,
      });

    const connectedAccount = await this.persistConnectedAccount({
      connectionProvider,
      credentials,
      identifiedAccount,
      workspaceId,
      userId,
      userWorkspaceId,
      scope,
      reconnectingConnectedAccountId,
    });

    await this.connectionProviderLifecycleHookService.dispatchOnConnect({
      provider: connectionProvider,
      workspaceId,
      connectedAccountId: connectedAccount.id,
    });

    return connectedAccount;
  }

  async connectWithApiKeyOrThrow({
    applicationId,
    providerName,
    apiKey,
    workspaceId,
    userId,
    userWorkspaceId,
    scope: requestedScope,
    reconnectingConnectedAccountId,
  }: Omit<ConnectionRequestArgs, 'connectionProvider'> & {
    applicationId: string;
    providerName: string;
    apiKey: string;
    userId: string;
  }): Promise<ConnectedAccountEntity> {
    const connectionProvider =
      await this.connectionProviderService.findOneByApplicationAndName({
        applicationId,
        name: providerName,
        workspaceId,
      });

    if (!isDefined(connectionProvider)) {
      throw new ConnectionProviderException(
        `Connection provider "${providerName}" not found for application ${applicationId}`,
        ConnectionProviderExceptionCode.CONNECTION_PROVIDER_NOT_FOUND,
      );
    }

    const providerDisplayName = connectionProvider.displayName;

    if (connectionProvider.type !== 'apiKey') {
      throw new ConnectionProviderException(
        `Connection provider "${connectionProvider.name}" (id ${connectionProvider.id}) does not accept API keys`,
        ConnectionProviderExceptionCode.INVALID_REQUEST,
        {
          userFriendlyMessage: msg`${providerDisplayName} does not accept API keys.`,
        },
      );
    }

    const parsedApiKey = plaintextStringSchema.min(1).safeParse(apiKey.trim());

    if (!parsedApiKey.success) {
      throw new ConnectionProviderException(
        'API key must not be empty',
        ConnectionProviderExceptionCode.INVALID_REQUEST,
        { userFriendlyMessage: msg`Enter an API key.` },
      );
    }

    const scope = await this.resolveAuthorizedScopeOrThrow({
      connectionProvider,
      workspaceId,
      userWorkspaceId,
      scope: requestedScope,
      reconnectingConnectedAccountId,
    });

    try {
      return await this.saveConnectionOrThrow({
        connectionProvider,
        credentials: {
          accessToken: parsedApiKey.data,
          refreshToken: null,
          scopes: null,
          handleHint: null,
        },
        workspaceId,
        userId,
        userWorkspaceId,
        scope,
        reconnectingConnectedAccountId,
      });
    } catch (error) {
      if (
        error instanceof ConnectionProviderException &&
        error.code ===
          ConnectionProviderExceptionCode.IDENTIFY_ACCOUNT_LOGIC_FUNCTION_FAILED
      ) {
        throw new ConnectionProviderException(
          error.message,
          ConnectionProviderExceptionCode.API_KEY_REJECTED,
          {
            userFriendlyMessage: msg`${providerDisplayName} rejected this API key.`,
          },
        );
      }

      throw error;
    }
  }

  private async validateCallerCanManageRequestedConnection({
    workspaceId,
    userWorkspaceId,
    scope,
    reconnectTarget,
  }: {
    workspaceId: string;
    userWorkspaceId: string;
    scope: ConnectedAccountScope;
    reconnectTarget: ConnectedAccountEntity | null;
  }): Promise<void> {
    if (scope === 'WORKSPACE' || reconnectTarget?.scope === 'WORKSPACE') {
      await this.appConnectionAccessService.validateCallerCanManageConnection({
        isWorkspaceShared: true,
        workspaceId,
        userWorkspaceId,
      });
    }

    if (scope === 'USER') {
      await this.appConnectionAccessService.validateCallerCanManageConnection({
        isWorkspaceShared: false,
        workspaceId,
        userWorkspaceId,
      });
    }
  }

  private async findReconnectTargetOrThrow({
    connectionProviderId,
    workspaceId,
    userWorkspaceId,
    reconnectingConnectedAccountId,
  }: {
    connectionProviderId: string;
    workspaceId: string;
    userWorkspaceId: string;
    reconnectingConnectedAccountId: string | null;
  }): Promise<ConnectedAccountEntity | null> {
    if (!isDefined(reconnectingConnectedAccountId)) {
      return null;
    }

    const reconnectTarget = await this.connectedAccountRepository.findOne({
      where: buildConnectedAccountUsableByCallerWhere({
        baseWhere: {
          id: reconnectingConnectedAccountId,
          workspaceId,
          connectionProviderId,
        },
        userWorkspaceId,
      }),
    });

    if (!isDefined(reconnectTarget)) {
      throw new ConnectionProviderException(
        `Cannot reconnect connectedAccount ${reconnectingConnectedAccountId}: not found in this workspace for the requested provider, or not usable by this member.`,
        ConnectionProviderExceptionCode.FORBIDDEN,
      );
    }

    return reconnectTarget;
  }

  private async resolveConnectedAccountHandle({
    handleHint,
    userId,
  }: {
    handleHint: string | null;
    userId: string;
  }): Promise<string> {
    if (isDefined(handleHint)) {
      return handleHint;
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

  private async persistConnectedAccount({
    connectionProvider,
    credentials,
    identifiedAccount,
    workspaceId,
    userId,
    userWorkspaceId,
    scope,
    reconnectingConnectedAccountId,
  }: SaveConnectionArgs & {
    identifiedAccount: IdentifiedAccount | null;
  }): Promise<ConnectedAccountEntity> {
    const { encryptedAccessToken, encryptedRefreshToken } =
      this.connectedAccountTokenEncryptionService.encryptTokenPair({
        accessToken: credentials.accessToken,
        refreshToken: credentials.refreshToken,
        workspaceId,
      });

    const handle =
      identifiedAccount?.handle ??
      (await this.resolveConnectedAccountHandle({
        handleHint: credentials.handleHint,
        userId,
      }));

    const sharedFields = {
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      scopes: credentials.scopes,
      lastCredentialsRefreshedAt: new Date(),
      authFailedAt: null,
      authFailedReason: null,
      scope,
      handle,
      externalAccountId: identifiedAccount?.externalAccountId ?? null,
    };

    if (isDefined(reconnectingConnectedAccountId)) {
      const reconnectTarget = {
        id: reconnectingConnectedAccountId,
        workspaceId,
      };

      // Compared and written in one statement so overlapping reconnects cannot pin different accounts.
      const updateResult = await this.connectedAccountRepository.update(
        isDefined(identifiedAccount)
          ? [
              { ...reconnectTarget, externalAccountId: IsNull() },
              {
                ...reconnectTarget,
                externalAccountId: identifiedAccount.externalAccountId,
              },
            ]
          : reconnectTarget,
        { ...sharedFields, userWorkspaceId },
      );

      const connectedAccount =
        await this.connectedAccountRepository.findOneByOrFail(reconnectTarget);

      if (updateResult.affected === 0 && isDefined(identifiedAccount)) {
        const authorizedAccountHandle =
          identifiedAccount.handle ?? identifiedAccount.externalAccountId;

        throw new ConnectionProviderException(
          `You authorized ${authorizedAccountHandle}, but this connection belongs to ${connectedAccount.handle}. Reconnect with ${connectedAccount.handle}, or add a new connection for ${authorizedAccountHandle}.`,
          ConnectionProviderExceptionCode.RECONNECT_ACCOUNT_MISMATCH,
        );
      }

      return connectedAccount;
    }

    const existingCount = await this.connectedAccountRepository.count({
      where: { connectionProviderId: connectionProvider.id, workspaceId },
    });

    const name = `${connectionProvider.displayName} #${existingCount + 1}`;

    const created = this.connectedAccountRepository.create({
      ...sharedFields,
      name,
      scope,
      provider: ConnectedAccountProvider.APP,
      workspaceId,
      applicationId: connectionProvider.applicationId,
      connectionProviderId: connectionProvider.id,
      userWorkspaceId,
    });

    return this.connectedAccountRepository.save(created);
  }
}
