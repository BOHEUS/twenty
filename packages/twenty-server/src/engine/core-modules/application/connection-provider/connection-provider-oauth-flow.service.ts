import { Injectable, Logger } from '@nestjs/common';

import {
  CONNECTION_SCOPE_BY_LEGACY_VISIBILITY,
  LEGACY_CONNECTION_VISIBILITY_BY_SCOPE,
} from 'twenty-shared/application-runtime';
import { isDefined } from 'twenty-shared/utils';

import { AppConnectionService } from 'src/engine/core-modules/application/connection-provider/app-connection.service';
import { ConnectionProviderExceptionCode } from 'src/engine/core-modules/application/connection-provider/connection-provider-exception-code.enum';
import { type ConnectionProviderEntity } from 'src/engine/core-modules/application/connection-provider/connection-provider.entity';
import { ConnectionProviderException } from 'src/engine/core-modules/application/connection-provider/connection-provider.exception';
import { ConnectionProviderService } from 'src/engine/core-modules/application/connection-provider/connection-provider.service';
import { type TokenExchangeResponse } from 'src/engine/core-modules/application/connection-provider/types/token-exchange-response.type';
import { assertOAuthProvider } from 'src/engine/core-modules/application/connection-provider/utils/assert-oauth-provider.util';
import { buildAppOAuthCallbackUrl } from 'src/engine/core-modules/application/connection-provider/utils/build-callback-url.util';
import { computePkceChallenge } from 'src/engine/core-modules/application/connection-provider/utils/compute-pkce-challenge.util';
import { exchangeCodeForToken } from 'src/engine/core-modules/application/connection-provider/utils/exchange-code-for-token.util';
import { extractEmailFromIdTokenClaims } from 'src/engine/core-modules/application/connection-provider/utils/extract-email-from-id-token-claims.util';
import { generatePkceVerifier } from 'src/engine/core-modules/application/connection-provider/utils/generate-pkce-verifier.util';
import {
  type AppOAuthStateJwtPayload,
  type LegacyAppOAuthStateJwtPayload,
} from 'src/engine/core-modules/auth/types/app-oauth-state-jwt-payload.type';
import { JwtTokenTypeEnum } from 'src/engine/core-modules/auth/types/jwt-token-type.enum';
import { JwtWrapperService } from 'src/engine/core-modules/jwt/services/jwt-wrapper.service';
import { SecureHttpClientService } from 'src/engine/core-modules/secure-http-client/secure-http-client.service';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';
import { type ConnectedAccountScope } from 'src/engine/metadata-modules/connected-account/entities/connected-account.entity';

const STATE_JWT_EXPIRES_IN = '10m';

type AuthorizeArgs = {
  connectionProvider: ConnectionProviderEntity;
  workspaceId: string;
  userId: string;
  userWorkspaceId: string;
  scope: ConnectedAccountScope | null;
  reconnectingConnectedAccountId: string | null;
  redirectLocation: string | null;
};

type CallbackArgs = {
  code: string;
  state: string;
};

type CallbackResult = {
  connectedAccountId: string;
  workspaceId: string;
  applicationId: string;
  redirectLocation: string | null;
};

@Injectable()
export class ConnectionProviderOAuthFlowService {
  private readonly logger = new Logger(ConnectionProviderOAuthFlowService.name);

  constructor(
    private readonly oauthProviderService: ConnectionProviderService,
    private readonly appConnectionService: AppConnectionService,
    private readonly jwtWrapperService: JwtWrapperService,
    private readonly twentyConfigService: TwentyConfigService,
    private readonly secureHttpClientService: SecureHttpClientService,
  ) {}

  async startAuthorizationFlow(
    args: AuthorizeArgs,
  ): Promise<{ authorizationUrl: string }> {
    const { connectionProvider, workspaceId, userId, userWorkspaceId } = args;

    assertOAuthProvider(connectionProvider);

    const scope = await this.appConnectionService.resolveAuthorizedScopeOrThrow(
      {
        connectionProvider,
        workspaceId,
        userWorkspaceId,
        scope: args.scope,
        reconnectingConnectedAccountId: args.reconnectingConnectedAccountId,
      },
    );

    const { clientId } =
      await this.oauthProviderService.getClientCredentials(connectionProvider);

    const { authorizationEndpoint, scopes, authorizationParams, usePkce } =
      connectionProvider.oauthConfig;

    const codeVerifier = usePkce ? generatePkceVerifier() : null;

    const state = await this.signState({
      sub: connectionProvider.id,
      type: JwtTokenTypeEnum.APP_OAUTH_STATE,
      connectionProviderId: connectionProvider.id,
      workspaceId,
      userId,
      userWorkspaceId,
      scope,
      visibility: LEGACY_CONNECTION_VISIBILITY_BY_SCOPE[scope],
      reconnectingConnectedAccountId: args.reconnectingConnectedAccountId,
      redirectLocation: args.redirectLocation,
      codeVerifier,
    });

    const callbackUrl = buildAppOAuthCallbackUrl(this.getServerUrl());

    const authorizationUrl = new URL(authorizationEndpoint);

    authorizationUrl.searchParams.set('client_id', clientId);
    authorizationUrl.searchParams.set('redirect_uri', callbackUrl);
    authorizationUrl.searchParams.set('response_type', 'code');
    authorizationUrl.searchParams.set('scope', scopes.join(' '));
    authorizationUrl.searchParams.set('state', state);

    if (codeVerifier) {
      authorizationUrl.searchParams.set(
        'code_challenge',
        computePkceChallenge(codeVerifier),
      );
      authorizationUrl.searchParams.set('code_challenge_method', 'S256');
    }

    for (const [key, value] of Object.entries(authorizationParams ?? {})) {
      authorizationUrl.searchParams.set(key, value);
    }

    return { authorizationUrl: authorizationUrl.toString() };
  }

  async completeAuthorizationFlow(args: CallbackArgs): Promise<CallbackResult> {
    const statePayload = await this.verifyState(args.state);

    const provider = await this.oauthProviderService.findOneByIdOrThrow({
      id: statePayload.connectionProviderId,
      workspaceId: statePayload.workspaceId,
    });

    assertOAuthProvider(provider);

    // The app may have changed its scope while the member was on the consent screen.
    const scope = await this.appConnectionService.resolveAuthorizedScopeOrThrow(
      {
        connectionProvider: provider,
        workspaceId: statePayload.workspaceId,
        userWorkspaceId: statePayload.userWorkspaceId,
        scope: statePayload.scope,
        reconnectingConnectedAccountId:
          statePayload.reconnectingConnectedAccountId,
      },
    );

    const { clientId, clientSecret } =
      await this.oauthProviderService.getClientCredentials(provider);

    const callbackUrl = buildAppOAuthCallbackUrl(this.getServerUrl());

    let tokenResponse: TokenExchangeResponse;

    try {
      tokenResponse = await exchangeCodeForToken({
        fetchFn: this.secureHttpClientService.createSsrfSafeFetch(),
        tokenEndpoint: provider.oauthConfig.tokenEndpoint,
        clientId,
        clientSecret,
        code: args.code,
        redirectUri: callbackUrl,
        codeVerifier: statePayload.codeVerifier,
        contentType: provider.oauthConfig.tokenRequestContentType,
      });
    } catch (error) {
      this.logger.error(
        `OAuth token exchange failed for provider ${provider.id}: ${(error as Error).message}`,
      );

      throw new ConnectionProviderException(
        (error as Error).message,
        ConnectionProviderExceptionCode.TOKEN_EXCHANGE_FAILED,
      );
    }

    const connectedAccount =
      await this.appConnectionService.saveConnectionOrThrow({
        connectionProvider: provider,
        credentials: {
          accessToken: tokenResponse.accessToken,
          refreshToken: tokenResponse.refreshToken ?? null,
          scopes: tokenResponse.scopes ?? provider.oauthConfig.scopes,
          handleHint: isDefined(tokenResponse.idToken)
            ? extractEmailFromIdTokenClaims(tokenResponse.idToken)
            : null,
        },
        workspaceId: statePayload.workspaceId,
        userId: statePayload.userId,
        userWorkspaceId: statePayload.userWorkspaceId,
        scope,
        reconnectingConnectedAccountId:
          statePayload.reconnectingConnectedAccountId,
      });

    return {
      connectedAccountId: connectedAccount.id,
      workspaceId: statePayload.workspaceId,
      applicationId: provider.applicationId,
      redirectLocation: statePayload.redirectLocation,
    };
  }

  private async signState(payload: AppOAuthStateJwtPayload): Promise<string> {
    return this.jwtWrapperService.signAsyncOrThrow(payload, {
      expiresIn: STATE_JWT_EXPIRES_IN,
    });
  }

  private async verifyState(state: string): Promise<AppOAuthStateJwtPayload> {
    try {
      const verified = (await this.jwtWrapperService.verifyJwtToken(state)) as
        | AppOAuthStateJwtPayload
        | LegacyAppOAuthStateJwtPayload;

      if (verified.type !== JwtTokenTypeEnum.APP_OAUTH_STATE) {
        throw new Error('Wrong JWT type for OAuth state');
      }

      return 'scope' in verified
        ? verified
        : {
            ...verified,
            scope: CONNECTION_SCOPE_BY_LEGACY_VISIBILITY[verified.visibility],
          };
    } catch (error) {
      this.logger.warn(
        `Rejected OAuth state: ${(error as Error).message ?? 'unknown reason'}`,
      );

      throw new ConnectionProviderException(
        'OAuth state signature invalid or expired',
        ConnectionProviderExceptionCode.INVALID_STATE,
      );
    }
  }

  private getServerUrl(): string {
    return this.twentyConfigService.get('SERVER_URL');
  }
}
