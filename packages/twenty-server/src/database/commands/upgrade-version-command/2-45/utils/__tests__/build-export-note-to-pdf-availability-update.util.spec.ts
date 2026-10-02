import { isDefined } from 'twenty-shared/utils';

import { buildExportNoteToPdfAvailabilityUpdate } from 'src/database/commands/upgrade-version-command/2-45/utils/build-export-note-to-pdf-availability-update.util';
import { type FlatCommandMenuItem } from 'src/engine/metadata-modules/flat-command-menu-item/types/flat-command-menu-item.type';
import { computeTwentyStandardApplicationAllFlatEntityMaps } from 'src/engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant';

const NOW = '2026-10-03T12:00:00.000Z';
const EXPORT_NOTE_TO_PDF_UNIVERSAL_IDENTIFIER =
  '86c8f3aa-9276-4c16-8cff-e295e34fbaf0';
const PREVIOUS_EXPRESSION =
  'pageType == "RECORD_PAGE" and (objectMetadataItem.nameSingular == "note" or objectMetadataItem.nameSingular == "task") and someNonEmptyString(selectedRecords, "bodyV2.blocknote")';

const { allFlatEntityMaps } = computeTwentyStandardApplicationAllFlatEntityMaps(
  {
    now: '2026-09-30T12:00:00.000Z',
    workspaceId: '20202020-1111-4111-8111-111111111111',
    twentyStandardApplicationId: '20202020-2222-4222-8222-222222222222',
  },
);

const standardExportNoteToPdf =
  allFlatEntityMaps.flatCommandMenuItemMaps.byUniversalIdentifier[
    EXPORT_NOTE_TO_PDF_UNIVERSAL_IDENTIFIER
  ];

const buildMaps = (
  conditionalAvailabilityExpression: string,
): Record<string, FlatCommandMenuItem> => {
  if (!isDefined(standardExportNoteToPdf)) {
    throw new Error('Export to PDF command menu item not found');
  }

  return {
    [EXPORT_NOTE_TO_PDF_UNIVERSAL_IDENTIFIER]: {
      ...standardExportNoteToPdf,
      conditionalAvailabilityExpression,
    },
  };
};

describe('buildExportNoteToPdfAvailabilityUpdate', () => {
  it('should move a stored blocknote condition to the standard markdown one, and back', () => {
    const [updated] = buildExportNoteToPdfAvailabilityUpdate({
      flatCommandMenuItemsByUniversalIdentifier: buildMaps(PREVIOUS_EXPRESSION),
      now: NOW,
      direction: 'up',
    });

    expect(updated?.conditionalAvailabilityExpression).toBe(
      standardExportNoteToPdf?.conditionalAvailabilityExpression,
    );
    expect(updated?.updatedAt).toBe(NOW);

    const [reverted] = buildExportNoteToPdfAvailabilityUpdate({
      flatCommandMenuItemsByUniversalIdentifier: buildMaps(
        updated?.conditionalAvailabilityExpression ?? '',
      ),
      now: NOW,
      direction: 'down',
    });

    expect(reverted?.conditionalAvailabilityExpression).toBe(
      PREVIOUS_EXPRESSION,
    );
  });

  it('should leave a customized condition untouched', () => {
    expect(
      buildExportNoteToPdfAvailabilityUpdate({
        flatCommandMenuItemsByUniversalIdentifier: buildMaps('true'),
        now: NOW,
        direction: 'up',
      }),
    ).toEqual([]);
  });
});
