import { describe, expect, it } from 'vitest';
import { buildRecordMigrationOrder } from 'src/logic-functions/utils/build-record-migration-order.util';
import { ObjectOpenRecordIn, ObjectType } from 'src/logic-functions/types/find-objects-fields.type';

const buildObject = (nameSingular: string, isSystem: boolean): ObjectType => ({
  applicationId: 'app-1',
  color: 'blue',
  description: '',
  fieldsList: [],
  icon: 'IconBox',
  id: `id-${nameSingular}`,
  isActive: true,
  isLabelSyncedWithName: false,
  isSystem,
  labelIdentifierFieldMetadataId: 'field-name',
  labelPlural: nameSingular,
  labelSingular: nameSingular,
  namePlural: `${nameSingular}s`,
  nameSingular,
  openRecordIn: ObjectOpenRecordIn.SIDE_PANEL,
  universalIdentifier: `u-${nameSingular}`,
});

describe('buildRecordMigrationOrder', () => {
  it('keeps non-system objects and only the allowlisted system objects', () => {
    const order = buildRecordMigrationOrder([
      buildObject('company', false),
      buildObject('noteTarget', true),
      buildObject('taskTarget', true),
      buildObject('callRecording', true),
      buildObject('messageCampaign', true),
      buildObject('messageList', true),
      buildObject('messageListMember', true),
      buildObject('message', true),
      buildObject('calendarEvent', true),
      buildObject('agentChatThread', true),
      buildObject('recordShare', true),
      buildObject('timelineActivity', true),
    ]);

    expect(order.map((object) => object.nameSingular)).toEqual(['company', 'noteTarget', 'taskTarget', 'callRecording', 'messageCampaign', 'messageList', 'messageListMember']);
  });

  it('still leaves out objects migrated by their own stage', () => {
    const order = buildRecordMigrationOrder([buildObject('dashboard', false), buildObject('attachment', true)]);

    expect(order).toEqual([]);
  });
});
