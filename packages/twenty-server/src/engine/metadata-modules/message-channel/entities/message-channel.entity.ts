import { registerEnumType } from '@nestjs/graphql';

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from 'typeorm';

import {
  MessageChannelContactAutoCreationPolicy,
  MessageChannelPendingGroupEmailsAction,
  MessageChannelSyncStage,
  MessageChannelSyncStatus,
  MessageChannelType,
  MessageChannelVisibility,
  MessageFolderImportPolicy,
  type MessageHandleKind,
  WebhookSubscriptionStatus,
} from 'twenty-shared/types';

import { WasIntroducedInUpgrade } from 'src/engine/core-modules/upgrade/decorators/was-introduced-in-upgrade.decorator';
import { ConnectedAccountEntity } from 'src/engine/metadata-modules/connected-account/entities/connected-account.entity';
import { type MessageFolderEntity } from 'src/engine/metadata-modules/message-folder/entities/message-folder.entity';
import { WorkspaceRelatedEntity } from 'src/engine/workspace-manager/types/workspace-related-entity';

registerEnumType(MessageChannelVisibility, {
  name: 'MessageChannelVisibility',
});
registerEnumType(MessageChannelSyncStatus, {
  name: 'MessageChannelSyncStatus',
});
registerEnumType(MessageChannelSyncStage, {
  name: 'MessageChannelSyncStage',
});
registerEnumType(MessageChannelType, { name: 'MessageChannelType' });
registerEnumType(MessageChannelContactAutoCreationPolicy, {
  name: 'MessageChannelContactAutoCreationPolicy',
});
registerEnumType(MessageFolderImportPolicy, {
  name: 'MessageFolderImportPolicy',
});
registerEnumType(MessageChannelPendingGroupEmailsAction, {
  name: 'MessageChannelPendingGroupEmailsAction',
});

@Entity({ name: 'messageChannel', schema: 'core' })
@Index('IDX_MESSAGE_CHANNEL_WORKSPACE_ID_SYNC_ENABLED_SYNC_STAGE', [
  'workspaceId',
  'isSyncEnabled',
  'syncStage',
])
@Index(
  'IDX_MESSAGE_CHANNEL_WEBHOOK_SUBSCRIPTION_EXTERNAL_ID',
  ['webhookSubscriptionExternalId'],
  { where: '"webhookSubscriptionExternalId" IS NOT NULL' },
)
@Index('IDX_MESSAGE_CHANNEL_EXTERNAL_CHANNEL_ID', ['externalChannelId'], {
  where: '"externalChannelId" IS NOT NULL',
})
export class MessageChannelEntity extends WorkspaceRelatedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: MessageChannelVisibility,
    nullable: false,
  })
  visibility: MessageChannelVisibility;

  @Column({ type: 'varchar', nullable: false })
  handle: string;

  // What kind of identifier every handle on this channel is. Only chat channels
  // set it; an email channel's handles are addresses by construction.
  @Column({ type: 'varchar', nullable: true })
  @WasIntroducedInUpgrade({
    upgradeCommandName:
      '2.34.0_AddAppConnectionAndChatColumnsFastInstanceCommand_1787706420000',
  })
  handleKind: MessageHandleKind | null;

  @Column({ type: 'varchar', nullable: true })
  displayName: string | null;

  @Column({
    type: 'enum',
    enum: MessageChannelType,
    nullable: false,
  })
  type: MessageChannelType;

  @Column({ type: 'boolean', nullable: false, default: true })
  isContactAutoCreationEnabled: boolean;

  @Column({
    type: 'enum',
    enum: MessageChannelContactAutoCreationPolicy,
    nullable: false,
    default: MessageChannelContactAutoCreationPolicy.SENT,
  })
  contactAutoCreationPolicy: MessageChannelContactAutoCreationPolicy;

  @Column({
    type: 'enum',
    enum: MessageFolderImportPolicy,
    nullable: false,
    default: MessageFolderImportPolicy.ALL_FOLDERS,
  })
  messageFolderImportPolicy: MessageFolderImportPolicy;

  @Column({ type: 'boolean', nullable: false, default: true })
  excludeNonProfessionalEmails: boolean;

  @Column({ type: 'boolean', nullable: false, default: true })
  excludeGroupEmails: boolean;

  @Column({
    type: 'enum',
    enum: MessageChannelPendingGroupEmailsAction,
    nullable: false,
  })
  pendingGroupEmailsAction: MessageChannelPendingGroupEmailsAction;

  @Column({ type: 'boolean', nullable: false, default: true })
  isSyncEnabled: boolean;

  @Column({ type: 'varchar', nullable: true })
  syncCursor: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  syncedAt: Date | null;

  @Column({
    type: 'enum',
    enum: MessageChannelSyncStatus,
    nullable: false,
    default: MessageChannelSyncStatus.NOT_SYNCED,
  })
  syncStatus: MessageChannelSyncStatus;

  @Column({
    type: 'enum',
    enum: MessageChannelSyncStage,
    nullable: false,
  })
  syncStage: MessageChannelSyncStage;

  @Column({ type: 'timestamptz', nullable: true })
  syncStageStartedAt: Date | null;

  @Column({ type: 'integer', nullable: false, default: 0 })
  throttleFailureCount: number;

  @Column({ type: 'timestamptz', nullable: true })
  throttleRetryAfter: Date | null;

  @Column({ type: 'varchar', nullable: true })
  webhookSubscriptionExternalId: string | null;

  @Column({ type: 'varchar', nullable: true })
  webhookSubscriptionClientState: string | null;

  @Column({
    type: 'enum',
    enum: WebhookSubscriptionStatus,
    nullable: true,
  })
  webhookSubscriptionStatus: WebhookSubscriptionStatus | null;

  @Column({ type: 'timestamptz', nullable: true })
  webhookSubscriptionExpiresAt: Date | null;

  // The provider's own id for this channel (a WhatsApp phone_number_id, a bot
  // id). One connected account fronts many of them, and the inbound webhook
  // resolver looks a channel up by it on every event.
  @Column({ type: 'varchar', nullable: true })
  externalChannelId: string | null;

  @Column({ type: 'uuid', nullable: false })
  connectedAccountId: string;

  @ManyToOne(
    () => ConnectedAccountEntity,
    (connectedAccount) => connectedAccount.messageChannels,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'connectedAccountId' })
  connectedAccount: Relation<ConnectedAccountEntity>;

  @OneToMany(
    'MessageFolderEntity',
    (messageFolder: MessageFolderEntity) => messageFolder.messageChannel,
  )
  messageFolders: Relation<MessageFolderEntity[]>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
