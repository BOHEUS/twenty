import { UseGuards, UsePipes } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { type FlatApplication } from 'src/engine/core-modules/application/types/flat-application.type';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { AuthApplication } from 'src/engine/decorators/auth/auth-application.decorator';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { IngestMessagesInput } from 'src/modules/messaging/message-import-manager/dtos/ingest-messages.input';
import { IngestMessagesOutput } from 'src/modules/messaging/message-import-manager/dtos/ingest-messages.output';
import { MessagingIngestService } from 'src/modules/messaging/message-import-manager/services/messaging-ingest.service';

@MetadataResolver()
@UsePipes(ResolverValidationPipe)
@UseGuards(WorkspaceAuthGuard)
export class MessagingIngestResolver {
  constructor(
    private readonly messagingIngestService: MessagingIngestService,
  ) {}

  // Apps hold an APPLICATION_ACCESS token rather than a member session, so the
  // calling application, not a workspace permission, is what scopes this.
  @Mutation(() => IngestMessagesOutput)
  @UseGuards(NoPermissionGuard)
  async ingestMessages(
    @Args('input') input: IngestMessagesInput,
    @AuthApplication() application: FlatApplication,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<IngestMessagesOutput> {
    return this.messagingIngestService.ingestMessages({
      applicationId: application.id,
      input,
      workspaceId: workspace.id,
    });
  }
}
