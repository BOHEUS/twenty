import {
  STANDARD_OBJECTS,
  STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-shared/metadata';
import { v4 } from 'uuid';

import { collectCallStandardUniversalIdentifiers } from 'src/database/commands/upgrade-version-command/2-46/utils/collect-call-standard-universal-identifiers.util';
import { computeTwentyStandardApplicationAllFlatEntityMaps } from 'src/engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant';

describe('collectCallStandardUniversalIdentifiers', () => {
  const { allFlatEntityMaps: standardAllFlatEntityMaps } =
    computeTwentyStandardApplicationAllFlatEntityMaps({
      now: new Date().toISOString(),
      workspaceId: v4(),
      twentyStandardApplicationId: v4(),
    });

  const universalIdentifiers = collectCallStandardUniversalIdentifiers({
    standardAllFlatEntityMaps,
  });

  it('collects the two call objects', () => {
    expect(universalIdentifiers.objectMetadata).toEqual([
      STANDARD_OBJECTS.call.universalIdentifier,
      STANDARD_OBJECTS.callParticipant.universalIdentifier,
    ]);
  });

  it('collects the call fields and the inverse relation fields on other objects', () => {
    expect(universalIdentifiers.fieldMetadata).toEqual(
      expect.arrayContaining([
        STANDARD_OBJECTS.call.fields.title.universalIdentifier,
        STANDARD_OBJECTS.callParticipant.fields.handle.universalIdentifier,
        STANDARD_OBJECTS.company.fields.calls.universalIdentifier,
        STANDARD_OBJECTS.opportunity.fields.calls.universalIdentifier,
        STANDARD_OBJECTS.person.fields.callParticipants.universalIdentifier,
        STANDARD_OBJECTS.workspaceMember.fields.ownedCalls.universalIdentifier,
        STANDARD_OBJECTS.workspaceMember.fields.callParticipants
          .universalIdentifier,
      ]),
    );
    expect(universalIdentifiers.fieldMetadata).not.toContain(
      STANDARD_OBJECTS.person.fields.name.universalIdentifier,
    );
  });

  it('collects every index, the search fields and the views with their fields and groups', () => {
    expect(universalIdentifiers.index).toEqual(
      expect.arrayContaining([
        STANDARD_OBJECTS.call.indexes.applicationIdExternalCallIdUniqueIndex
          .universalIdentifier,
        STANDARD_OBJECTS.callParticipant.indexes.callIdIndex
          .universalIdentifier,
      ]),
    );
    expect(universalIdentifiers.searchFieldMetadata).toHaveLength(2);
    expect(universalIdentifiers.view).toEqual(
      expect.arrayContaining([
        STANDARD_OBJECTS.call.views.allCalls.universalIdentifier,
        STANDARD_OBJECTS.call.views.callRecordPageFields.universalIdentifier,
        STANDARD_OBJECTS.callParticipant.views.allCallParticipants
          .universalIdentifier,
      ]),
    );
    expect(universalIdentifiers.viewField).toContain(
      STANDARD_OBJECTS.call.views.allCalls.viewFields.status
        .universalIdentifier,
    );
    expect(universalIdentifiers.viewFieldGroup).toHaveLength(4);
  });

  it('collects the record page layouts with their tabs and widgets', () => {
    expect(universalIdentifiers.pageLayout).toEqual(
      expect.arrayContaining([
        STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.callRecordPage
          .universalIdentifier,
        STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.callParticipantRecordPage
          .universalIdentifier,
      ]),
    );
    expect(universalIdentifiers.pageLayoutTab).toContain(
      STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.callRecordPage.tabs.timeline
        .universalIdentifier,
    );
    expect(universalIdentifiers.pageLayoutWidget).toContain(
      STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.callRecordPage.tabs.home
        .widgets.fields.universalIdentifier,
    );
  });
});
