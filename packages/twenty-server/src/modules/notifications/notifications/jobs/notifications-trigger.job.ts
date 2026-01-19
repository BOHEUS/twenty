import { Scope } from '@nestjs/common';

import { FieldActorSource } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import isEmpty from 'lodash.isempty';

import { Processor } from 'src/engine/core-modules/message-queue/decorators/processor.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { WorkflowRunnerWorkspaceService } from 'src/modules/workflow/workflow-runner/workspace-services/workflow-runner.workspace-service';
import { Process } from 'src/engine/core-modules/message-queue/decorators/process.decorator';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import type { WorkflowWorkspaceEntity } from 'src/modules/workflow/common/standard-objects/workflow.workspace-entity';
import {
  WorkflowTriggerException,
  WorkflowTriggerExceptionCode,
} from 'src/modules/workflow/workflow-trigger/exceptions/workflow-trigger.exception';
import {
  WorkflowVersionStatus,
  WorkflowVersionWorkspaceEntity,
} from 'src/modules/workflow/common/standard-objects/workflow-version.workspace-entity';

export type WorkflowTriggerJobData = {
  workspaceId: string;
  workflowId: string;
  payload: object;
};

const DEFAULT_WORKFLOW_NAME = 'Workflow';

@Processor({ queueName: MessageQueue.notificationQueue, scope: Scope.REQUEST })
export class NotificationTriggerJob {
  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    private readonly workflowRunnerWorkspaceService: WorkflowRunnerWorkspaceService,
  ) {}

  @Process(NotificationTriggerJob.name)
  async handle(data: WorkflowTriggerJobData): Promise<void> {
    const authContext = buildSystemAuthContext(data.workspaceId);
    // get workspace member name
    // get action
    // create: "<creator> created new <objectSingularName>"
    // update: "<creator> updated <objectSingularName> <recordName>" add fields?
    // delete: "<creator> deleted <objectSingularName> <recordName>"
    // destroy: "<creator> destroyed <objectSingularName> <recordName>"
    // restore: "<creator> restored <objectSingularName> <recordName>"
    // upsert: ???

    await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      authContext,
      async () => {
        const workflowRepository =
          await this.globalWorkspaceOrmManager.getRepository<WorkflowWorkspaceEntity>(
            data.workspaceId,
            'workflow',
            { shouldBypassPermissionChecks: true },
          );

        const workflow = await workflowRepository.findOneBy({
          id: data.workflowId,
        });

        if (!workflow) {
          throw new WorkflowTriggerException(
            `Workflow ${data.workflowId} not found in workspace ${data.workspaceId}`,
            WorkflowTriggerExceptionCode.NOT_FOUND,
          );
        }

        if (!workflow.lastPublishedVersionId) {
          throw new WorkflowTriggerException(
            `Workflow ${data.workflowId} has no published version in workspace ${data.workspaceId}`,
            WorkflowTriggerExceptionCode.INTERNAL_ERROR,
          );
        }

        const workflowVersionRepository =
          await this.globalWorkspaceOrmManager.getRepository<WorkflowVersionWorkspaceEntity>(
            data.workspaceId,
            'workflowVersion',
            { shouldBypassPermissionChecks: true },
          );

        const workflowVersion = await workflowVersionRepository.findOneBy({
          id: workflow.lastPublishedVersionId,
        });

        if (!workflowVersion) {
          throw new WorkflowTriggerException(
            `Workflow version ${workflow.lastPublishedVersionId} not found in workspace ${data.workspaceId}`,
            WorkflowTriggerExceptionCode.NOT_FOUND,
          );
        }
        if (workflowVersion.status !== WorkflowVersionStatus.ACTIVE) {
          throw new WorkflowTriggerException(
            `Workflow version ${workflowVersion.id} is not active in workspace ${data.workspaceId}`,
            WorkflowTriggerExceptionCode.INTERNAL_ERROR,
          );
        }

        await this.workflowRunnerWorkspaceService.run({
          workspaceId: data.workspaceId,
          workflowVersionId: workflow.lastPublishedVersionId,
          payload: data.payload,
          source: {
            source: FieldActorSource.WORKFLOW,
            name:
              isDefined(workflow.name) && !isEmpty(workflow.name)
                ? workflow.name
                : DEFAULT_WORKFLOW_NAME,
            context: {},
            workspaceMemberId: null,
          },
        });
      },
    );
  }
}
