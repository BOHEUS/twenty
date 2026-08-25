import { UseGuards, UsePipes } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';

import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';
import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { ApplicationConnectionProviderDTO } from 'src/engine/core-modules/application/connection-provider/dtos/application-connection-provider.dto';
import { ConnectApiKeyConnectionProviderInput } from 'src/engine/core-modules/application/connection-provider/dtos/connect-api-key-connection-provider.input';
import { ConnectionProviderApiKeyFlowService } from 'src/engine/core-modules/application/connection-provider/connection-provider-api-key-flow.service';
import { ConnectionProviderService } from 'src/engine/core-modules/application/connection-provider/connection-provider.service';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { UserEntity } from 'src/engine/core-modules/user/user.entity';
import { AuthUser } from 'src/engine/decorators/auth/auth-user.decorator';
import { AuthUserWorkspaceId } from 'src/engine/decorators/auth/auth-user-workspace-id.decorator';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';

@UseGuards(WorkspaceAuthGuard)
@UsePipes(ResolverValidationPipe)
@MetadataResolver(() => ApplicationConnectionProviderDTO)
export class ApplicationConnectionProviderResolver {
  constructor(
    private readonly oauthProviderService: ConnectionProviderService,
    private readonly connectionProviderApiKeyFlowService: ConnectionProviderApiKeyFlowService,
  ) {}

  @Query(() => [ApplicationConnectionProviderDTO])
  @UseGuards(NoPermissionGuard)
  async applicationConnectionProviders(
    @Args('applicationId', { type: () => UUIDScalarType })
    applicationId: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<ApplicationConnectionProviderDTO[]> {
    const providers = await this.oauthProviderService.findManyByApplication({
      applicationId,
      workspaceId: workspace.id,
    });

    const credentialsConfiguredByProviderId =
      await this.oauthProviderService.areClientCredentialsConfiguredBatch(
        providers,
      );

    return providers.map((provider) => ({
      id: provider.id,
      applicationId: provider.applicationId,
      type: provider.type,
      name: provider.name,
      displayName: provider.displayName,
      oauth:
        provider.type === 'oauth' && provider.oauthConfig
          ? {
              scopes: provider.oauthConfig.scopes,
              isClientCredentialsConfigured:
                credentialsConfiguredByProviderId.get(provider.id) ?? false,
            }
          : null,
      apiKey:
        provider.type === 'apiKey' && provider.apiKeyConfig
          ? provider.apiKeyConfig
          : null,
    }));
  }

  // An api-key provider has no redirect to bounce through, so connecting is a
  // plain mutation rather than the browser round trip OAuth needs.
  @Mutation(() => Boolean)
  @UseGuards(NoPermissionGuard)
  async connectApiKeyConnectionProvider(
    @Args('input') input: ConnectApiKeyConnectionProviderInput,
    @AuthWorkspace() workspace: WorkspaceEntity,
    @AuthUser() user: UserEntity,
    @AuthUserWorkspaceId() userWorkspaceId: string,
  ): Promise<boolean> {
    await this.connectionProviderApiKeyFlowService.connect({
      connectionProviderId: input.connectionProviderId,
      fieldValues: input.fieldValues,
      visibility: input.visibility ?? 'user',
      workspaceId: workspace.id,
      userId: user.id,
      userWorkspaceId,
    });

    return true;
  }
}
