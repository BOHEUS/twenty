import type { EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import type { TaskWorkspaceEntity } from 'src/modules/task/standard-objects/task.workspace-entity';
import type { PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import type { CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import type { OpportunityWorkspaceEntity } from 'src/modules/opportunity/standard-objects/opportunity.workspace-entity';
import type { CustomWorkspaceEntity } from 'src/engine/twenty-orm/custom.workspace-entity';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import {
  NotificationsWorkspaceEntity
} from 'src/modules/notifications/notifications/standard-objects/notifications.workspace-entity';
import { MessageWorkspaceEntity } from 'src/modules/messaging/common/standard-objects/message.workspace-entity';
import {
  CalendarEventWorkspaceEntity
} from 'src/modules/calendar/common/standard-objects/calendar-event.workspace-entity';
import { AttachmentWorkspaceEntity } from 'src/modules/attachment/standard-objects/attachment.workspace-entity';
import { DashboardWorkspaceEntity } from 'src/modules/dashboard/standard-objects/dashboard.workspace-entity';
import { NoteWorkspaceEntity } from 'src/modules/note/standard-objects/note.workspace-entity';
import {
  WorkspaceMemberWorkspaceEntity
} from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';
import { WorkflowWorkspaceEntity } from 'src/modules/workflow/common/standard-objects/workflow.workspace-entity';
import { WorkflowRunWorkspaceEntity } from 'src/modules/workflow/common/standard-objects/workflow-run.workspace-entity';

// TODO: wouldn't it be just way easier if this was a relation to notification entity with name of other objects notification is related to and array of records UUIDs?
// all notifications will be only related to one type of object either way at the time with no possibility of notification being related to records from 2 or more objects
export class NotificationTargetWorkspaceEntity extends BaseWorkspaceEntity {
  notification: EntityRelation<NotificationsWorkspaceEntity> | null;
  notificationId: string | null;
  targetMessage: EntityRelation<MessageWorkspaceEntity> | null;
  targetMessageId: string | null;
  targetCalendarEvent: EntityRelation<CalendarEventWorkspaceEntity> | null;
  targetCalendarEventId: string | null;
  targetAttachment: EntityRelation<AttachmentWorkspaceEntity> | null;
  targetAttachmentId: string | null;
  targetDashboard: EntityRelation<DashboardWorkspaceEntity> | null;
  targetDashboardId: string | null;
  targetNote: EntityRelation<NoteWorkspaceEntity> | null;
  targetNoteId: EntityRelation<NoteWorkspaceEntity> | null;
  targetTask: EntityRelation<TaskWorkspaceEntity> | null;
  targetTaskId: string | null;
  targetPerson: EntityRelation<PersonWorkspaceEntity> | null;
  targetPersonId: string | null;
  targetCompany: EntityRelation<CompanyWorkspaceEntity> | null;
  targetCompanyId: string | null;
  targetOpportunity: EntityRelation<OpportunityWorkspaceEntity> | null;
  targetOpportunityId: string | null;
  targetWorkspaceMember: EntityRelation<WorkspaceMemberWorkspaceEntity> | null; // TODO: debatable whether it'll have any purpose
  targetWorkspaceMemberId: string | null;
  targetWorkflow: EntityRelation<WorkflowWorkspaceEntity> | null;
  targetWorkflowId: string | null;
  targetWorkflowRun: EntityRelation<WorkflowRunWorkspaceEntity> | null;
  targetWorkflowRunId: EntityRelation<WorkflowRunWorkspaceEntity> | null;
  custom: EntityRelation<CustomWorkspaceEntity>;
}