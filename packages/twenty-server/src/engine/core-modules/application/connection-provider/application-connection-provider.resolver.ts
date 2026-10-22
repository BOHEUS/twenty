import {
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { Mutation, Parent, Query, ResolveField } from '@nestjs/graphql';

import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';
import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { ApplicationExceptionFilter } from 'src/engine/core-modules/application/application-exception-filter';
import { AppConnectionService } from 'src/engine/core-modules/application/connection-provider/app-connection.service';
import { ConnectionProviderService } from 'src/engine/core-modules/application/connection-provider/connection-provider.service';
import { ApplicationConnectionProviderDTO } from 'src/engine/core-modules/application/connection-provider/dtos/application-connection-provider.dto';
import { ConnectAppWithApiKeyInput } from 'src/engine/core-modules/application/connection-provider/dtos/connect-app-with-api-key.input';
import { ConnectionProviderGraphqlApiExceptionInterceptor } from 'src/engine/core-modules/application/connection-provider/interceptors/connection-provider-graphql-api-exception.interceptor';
import { buildPublicAssetLogoUrl } from 'src/engine/core-modules/application/utils/build-public-asset-logo-url.util';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';
import { UserEntity } from 'src/engine/core-modules/user/user.entity';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { ApplicationTargetArg } from 'src/engine/decorators/auth/application-target-arg.decorator';
import { AuthUserWorkspaceId } from 'src/engine/decorators/auth/auth-user-workspace-id.decorator';
import { AuthUser } from 'src/engine/decorators/auth/auth-user.decorator';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { AuthPrincipalGuard } from 'src/engine/guards/auth-principal.guard';
import { ApplicationTargetGuard } from 'src/engine/guards/application-target.guard';
import { PermissionsGraphqlApiExceptionFilter } from 'src/engine/metadata-modules/permissions/utils/permissions-graphql-api-exception.filter';

@UseGuards(
  AuthPrincipalGuard({
    userSession: {
      standard: true,
      impersonated: true,
      playground: true,
      workspaceAgnostic: false,
    },
    apiKey: true,
    oauthClient: true,
    application: true,
  }),
)
@MetadataResolver(() => ApplicationConnectionProviderDTO)
@UseFilters(ApplicationExceptionFilter)
export class ApplicationConnectionProviderResolver {
  constructor(
    private readonly oauthProviderService: ConnectionProviderService,
    private readonly appConnectionService: AppConnectionService,
    private readonly twentyConfigService: TwentyConfigService,
  ) {}

  @Query(() => [ApplicationConnectionProviderDTO])
  @UseGuards(NoPermissionGuard, ApplicationTargetGuard)
  async applicationConnectionProviders(
    @ApplicationTargetArg(
      'applicationId',
      { kind: 'applicationId', requireApplicationRegistrationOwnership: false },
      { type: () => UUIDScalarType },
    )
    applicationId: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<ApplicationConnectionProviderDTO[]> {
    const providers = await this.oauthProviderService.findManyByApplication({
      applicationId,
      workspaceId: workspace.id,
    });

    const credentialsConfiguredByProviderId =
      await this.oauthProviderService.areClientCredentialsConfiguredBatch({
        providers,
        workspaceId: workspace.id,
      });

    return providers.map((provider) => ({
      id: provider.id,
      applicationId: provider.applicationId,
      type: provider.type,
      name: provider.name,
      displayName: provider.displayName,
      scope: provider.scope,
      logo: provider.logo,
      oauth:
        provider.type === 'oauth' && provider.oauthConfig
          ? {
              scopes: provider.oauthConfig.scopes,
              isClientCredentialsConfigured:
                credentialsConfiguredByProviderId.get(provider.id) ?? false,
            }
          : null,
    }));
  }

  // Scope-dependent permissions (APPLICATIONS or CONNECTED_ACCOUNTS) are checked in the service.
  @Mutation(() => Boolean)
  @UseGuards(
    AuthPrincipalGuard({
      userSession: {
        standard: true,
        impersonated: true,
        playground: false,
        workspaceAgnostic: false,
      },
      apiKey: false,
      oauthClient: false,
      application: false,
    }),
    NoPermissionGuard,
    ApplicationTargetGuard,
  )
  @UsePipes(ResolverValidationPipe)
  @UseInterceptors(ConnectionProviderGraphqlApiExceptionInterceptor)
  @UseFilters(PermissionsGraphqlApiExceptionFilter)
  async connectAppWithApiKey(
    @ApplicationTargetArg<ConnectAppWithApiKeyInput>('input', {
      kind: 'applicationId',
      idKey: 'applicationId',
      requireApplicationRegistrationOwnership: false,
    })
    input: ConnectAppWithApiKeyInput,
    @AuthWorkspace() workspace: WorkspaceEntity,
    @AuthUser() user: UserEntity,
    @AuthUserWorkspaceId() userWorkspaceId: string,
  ): Promise<boolean> {
    await this.appConnectionService.connectWithApiKeyOrThrow({
      applicationId: input.applicationId,
      providerName: input.providerName,
      apiKey: input.apiKey,
      workspaceId: workspace.id,
      userId: user.id,
      userWorkspaceId,
      scope: input.scope ?? null,
      reconnectingConnectedAccountId:
        input.reconnectingConnectedAccountId ?? null,
    });

    return true;
  }

  @ResolveField(() => String, { nullable: true })
  logoUrl(
    @Parent()
    connectionProvider: Pick<
      ApplicationConnectionProviderDTO,
      'applicationId' | 'logo'
    >,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): string | null {
    return buildPublicAssetLogoUrl({
      logo: connectionProvider.logo,
      serverUrl: this.twentyConfigService.get('SERVER_URL'),
      workspaceId: workspace.id,
      applicationId: connectionProvider.applicationId,
    });
  }
}
