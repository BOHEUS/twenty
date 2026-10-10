export const fieldsToOmit = ['id', 'position', 'searchVector', 'timelineActivities', 'attachments', 'noteTargets', 'taskTargets'];
export const objectsToOmit = ['workflow', 'workflowRun', 'workflowVersion', 'workflowAutomatedTrigger', 'timelineActivity'];
export const objectsToOmitFromRecordMigration = ['workspaceMember', 'dashboard', 'attachment'];
// System objects are mostly owned by things that don't carry over to another workspace (mail and
// calendar sync, AI chats, campaigns, record sharing); these ones hold user data that does.
export const systemObjectsToMigrate = ['noteTarget', 'taskTarget', 'callRecording', 'messageList', 'messageListMember', 'messageCampaign'];
export const fieldsToOmitFromRecordMigration = ['createdBy', 'updatedBy', 'deletedAt', 'searchVector', 'timelineActivities', 'attachments', 'noteTargets', 'taskTargets'];
export const sourceAppsToOmit = ['OAUTH_ONLY', 'LOCAL'];