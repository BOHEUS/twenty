import { Body, UseGuards, UseInterceptors, UseFilters } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';

import { PermissionFlagType } from 'twenty-shared/constants';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';
import { type FlatApplication } from 'src/engine/core-modules/application/types/flat-application.type';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { AuthApplication } from 'src/engine/decorators/auth/auth-application.decorator';
import { AuthUserWorkspaceId } from 'src/engine/decorators/auth/auth-user-workspace-id.decorator';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { AllowSuspendedWorkspace } from 'src/engine/decorators/auth/allow-suspended-workspace.decorator';
import { CustomPermissionGuard } from 'src/engine/guards/custom-permission.guard';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { SettingsPermissionGuard } from 'src/engine/guards/settings-permission.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { ConnectedAccountMetadataService } from 'src/engine/metadata-modules/connected-account/connected-account-metadata.service';
import { ApplicationConnectedAccountDTO } from 'src/engine/metadata-modules/connected-account/dtos/application-connected-account.dto';
import { ConnectedAccountPublicDTO } from 'src/engine/metadata-modules/connected-account/dtos/connected-account-public.dto';
import { ConnectedAccountDTO } from 'src/engine/metadata-modules/connected-account/dtos/connected-account.dto';
import { ConnectedAccountGraphqlApiExceptionInterceptor } from 'src/engine/metadata-modules/connected-account/interceptors/connected-account-graphql-api-exception.interceptor';
import { buildPublicConnectedAccount } from 'src/engine/metadata-modules/connected-account/utils/build-public-connected-account.util';
import { AuthGraphqlApiExceptionFilter } from 'src/engine/core-modules/auth/filters/auth-graphql-api-exception.filter';
import { ConnectedAccountProvider } from "twenty-shared/types";
import {
  CreateWorkspaceConnectedAccountInput
} from "src/engine/metadata-modules/connected-account/dtos/create-workspace-connected-account.input";
import {
  UpdateWorkspaceConnectedAccountInput
} from "src/engine/metadata-modules/connected-account/dtos/update-workspace-connected-account.input";

@UseGuards(WorkspaceAuthGuard)
@UseInterceptors(ConnectedAccountGraphqlApiExceptionInterceptor)
@MetadataResolver(() => ConnectedAccountDTO)
@UseFilters(AuthGraphqlApiExceptionFilter)
export class ConnectedAccountResolver {
  constructor(
    private readonly connectedAccountMetadataService: ConnectedAccountMetadataService,
  ) {}

  @Query(() => [ConnectedAccountPublicDTO])
  @UseGuards(NoPermissionGuard)
  @AllowSuspendedWorkspace()
  async myConnectedAccounts(
    @AuthWorkspace() workspace: WorkspaceEntity,
    @AuthUserWorkspaceId() userWorkspaceId: string,
  ): Promise<ConnectedAccountPublicDTO[]> {
    const accounts =
      await this.connectedAccountMetadataService.findUsableByCaller({
        userWorkspaceId,
        workspaceId: workspace.id,
      });

    return accounts.map((account) => buildPublicConnectedAccount(account));
  }

  @Query(() => [ApplicationConnectedAccountDTO])
  @UseGuards(SettingsPermissionGuard(PermissionFlagType.APPLICATIONS))
  async applicationConnectedAccounts(
    @Args('applicationId', { type: () => UUIDScalarType })
    applicationId: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
    @AuthUserWorkspaceId() userWorkspaceId: string,
  ): Promise<ApplicationConnectedAccountDTO[]> {
    const accounts =
      await this.connectedAccountMetadataService.findApplicationConnectedAccountsUsableByCaller(
        {
          applicationId,
          workspaceId: workspace.id,
          userWorkspaceId,
        },
      );

    return accounts.map((account) => ({
      ...buildPublicConnectedAccount(account),
      isOwnedByCurrentUser: account.userWorkspaceId === userWorkspaceId,
    }));
  }

  @Query(() => [ConnectedAccountDTO])
  @UseGuards(NoPermissionGuard)
  async getWorkspaceConnectedAccounts(
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<ConnectedAccountDTO[]> {
    return await this.connectedAccountMetadataService.findWorkspaceConnectedAccounts(
      {
        workspaceId: workspace.id,
      },
    );
  }

  @Mutation(() => ConnectedAccountDTO)
  @UseGuards(NoPermissionGuard)
  async createWorkspaceConnectedAccount(
    @Args('applicationId', {type: () => UUIDScalarType}) applicationId: string,
    @AuthWorkspace() { id: workspaceId }: WorkspaceEntity,
    @Body() input: CreateWorkspaceConnectedAccountInput
  ) {
    return await this.connectedAccountMetadataService.create({
      workspaceId,
      handle: input.handle,
      provider: ConnectedAccountProvider.APP,
      handleAliases: input.aliases,
      applicationId,
    })
  }

  @Mutation(() => ConnectedAccountDTO)
  @UseGuards(NoPermissionGuard)
  async updateWorkspaceConnectedAccount(
    @Args('id', { type: () => UUIDScalarType }) id: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
    @Body() input: UpdateWorkspaceConnectedAccountInput,
  ): Promise<ConnectedAccountDTO> {
    return await this.connectedAccountMetadataService.update({
      id: id,
      workspaceId: workspace.id,
      data: {
        handleAliases: input.aliases,
      }
    });
  }

  @Mutation(() => ConnectedAccountPublicDTO)
  @UseGuards(CustomPermissionGuard)
  async deleteConnectedAccount(
    @Args('id', { type: () => UUIDScalarType }) id: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
    @AuthUserWorkspaceId() userWorkspaceId: string,
    @AuthApplication({ allowUndefined: true }) application?: FlatApplication,
  ): Promise<ConnectedAccountPublicDTO> {
    await this.connectedAccountMetadataService.verifyAdministrableByCaller({
      id,
      userWorkspaceId,
      workspaceId: workspace.id,
      applicationId: application?.id,
    });

    const deleted = await this.connectedAccountMetadataService.delete({
      id,
      workspaceId: workspace.id,
    });

    return buildPublicConnectedAccount(deleted);
  }
}
