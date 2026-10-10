import type { AxiosInstance } from "axios";
import { findManyRecords } from "src/logic-functions/requests/find-many-records.util";
import { findPageLayouts } from "src/logic-functions/requests/find-page-layouts.util";
import { executeWithRetryAndCheckpoint } from "src/logic-functions/utils/execute-with-retry-and-checkpoint.util";
import { createMetadataEntity } from "src/logic-functions/requests/create-metadata-entity.util";
import { createManyRecords } from "src/logic-functions/requests/create-many-records.util";
import { applyPageLayoutTabsAndWidgets } from "src/logic-functions/utils/apply-page-layout-tabs-and-widgets.util";
import { logger } from "src/logic-functions/utils/logger.util";
import { setObjectCursor } from "src/logic-functions/utils/set-object-cursor.util";
import { stopIfTimeBudgetExceeded } from "src/logic-functions/utils/time-budget.util";
import { migrationState } from "src/logic-functions/utils/migration-state.util";
import { executeWithRetry } from "src/logic-functions/utils/execute-with-retry.util";
import { RecordIdResolution } from "src/logic-functions/utils/record-id-resolution.util";
import { REQUESTS_PER_DASHBOARD, decrementEstimate } from "src/logic-functions/utils/estimate-migration-duration.util";

type SourceDashboard = {
  title: string;
  pageLayoutId: string;
  position: number;
};

// Dashboards keep their source id in the target, so an id already present there means an earlier
// invocation created it along with its page layout. Recreating it would mint a second page
// layout, since createPageLayout always generates a fresh id.
const findExistingTargetPageLayoutIdByDashboardId = async (targetWorkspace: AxiosInstance): Promise<Map<string, string | null>> => {
  const pageLayoutIdByDashboardId = new Map<string, string | null>();
  let after: string | null = null;

  while (true) {
    const page = await executeWithRetry(() => findManyRecords<{ pageLayoutId: string | null }>(targetWorkspace, 'dashboards', 'pageLayoutId', after));
    for (const { node } of page.edges) {
      pageLayoutIdByDashboardId.set(node.id, node.pageLayoutId);
    }
    if (page.pageInfo.hasNextPage === false || page.pageInfo.endCursor === null) {
      return pageLayoutIdByDashboardId;
    }
    after = page.pageInfo.endCursor;
  }
};

export const migrateDashboards = async (
  sourceWorkspace: AxiosInstance,
  targetWorkspace: AxiosInstance,
  targetObjectIdBySourceObjectId: Map<string, string>,
  targetFieldIdBySourceFieldId: Map<string, string>,
  recordIds: RecordIdResolution,
  targetPageLayoutIdBySourcePageLayoutId: Map<string, string>,
  targetViewIdBySourceViewId: Map<string, string>,
) => {
  const sourcePageLayouts = await executeWithRetry(() => findPageLayouts(sourceWorkspace, 'DASHBOARD'));
  const sourcePageLayoutById = new Map(sourcePageLayouts.map((layout) => [layout.id, layout]));
  const existingTargetPageLayoutIdByDashboardId = await findExistingTargetPageLayoutIdByDashboardId(targetWorkspace);

  let createdCount = 0;
  let after: string | null = migrationState.objectRecordsToMigrate.get('dashboards') ?? null;

  while (true) {
    const page = await executeWithRetry(() => findManyRecords<SourceDashboard>(sourceWorkspace, 'dashboards', 'title\npageLayoutId\nposition', after, Math.floor(migrationState.maxRequests / 3)));
    const nodes = page.edges.map((edge) => edge.node);
    for (const dashboard of nodes) {
      const dashboardId = dashboard.id;
      const title = dashboard.title;

      decrementEstimate({ otherRecordCount: REQUESTS_PER_DASHBOARD });

      if (existingTargetPageLayoutIdByDashboardId.has(dashboardId)) {
        const existingTargetPageLayoutId = existingTargetPageLayoutIdByDashboardId.get(dashboardId);
        // Navigation menu items linking to this dashboard's layout resolve through this map.
        if (typeof existingTargetPageLayoutId === 'string') {
          targetPageLayoutIdBySourcePageLayoutId.set(dashboard.pageLayoutId, existingTargetPageLayoutId);
        }
        recordIds.migratedRecordIds.add(dashboardId);
        continue;
      }

      const sourcePageLayout = sourcePageLayoutById.get(dashboard.pageLayoutId);
      if (sourcePageLayout === undefined) {
        logger.warn(`Skipping dashboard "${title}": its page layout was not found`);
        continue;
      }

      try {
        const targetLayoutObjectMetadataId = sourcePageLayout.objectMetadataId !== null
          ? targetObjectIdBySourceObjectId.get(sourcePageLayout.objectMetadataId) ?? null
          : null;

        const createdPageLayout = await executeWithRetryAndCheckpoint(() => createMetadataEntity(targetWorkspace, 'createPageLayout', 'input', 'CreatePageLayoutInput', {
          name: sourcePageLayout.name,
          type: sourcePageLayout.type,
          objectMetadataId: targetLayoutObjectMetadataId,
        }));
        targetPageLayoutIdBySourcePageLayoutId.set(sourcePageLayout.id, createdPageLayout.id);

        await applyPageLayoutTabsAndWidgets(
          targetWorkspace,
          createdPageLayout.id,
          sourcePageLayout.tabs,
          targetObjectIdBySourceObjectId,
          targetFieldIdBySourceFieldId,
          targetViewIdBySourceViewId,
          `dashboard "${title}"`,
        );

        await executeWithRetryAndCheckpoint(() => createManyRecords(targetWorkspace, 'dashboards', [{
          id: dashboardId,
          title,
          pageLayoutId: createdPageLayout.id,
          position: dashboard.position,
        }], new Set()));
        recordIds.migratedRecordIds.add(dashboardId);
        createdCount += 1;
      } catch (error) {
      logger.warn(`Skipping dashboard "${title}": ${error instanceof Error ? error.message : String(error)}`);
    }
  }

    if (page.pageInfo.hasNextPage === false || page.pageInfo.endCursor === null) {
      setObjectCursor('dashboards', null);
      break;
    }
    after = page.pageInfo.endCursor;
    setObjectCursor('dashboards', after);
    if (await stopIfTimeBudgetExceeded()) {
      return false;
    }
  }

  logger.log(`Dashboards: created ${createdCount}`);
  return true;
};