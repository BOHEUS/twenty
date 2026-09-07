import { CoreApiClient } from 'twenty-client-sdk/core';
import { definePostInstallLogicFunction } from 'twenty-sdk/define';
import { kv, type InstallPayload } from 'twenty-sdk/logic-function';
import {
  REVENUE_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  REVENUE_DASHBOARD_TITLE,
} from 'src/constants/revenue-dashboard';
import { CREATED_DASHBOARD_ID_KEY } from 'src/constants/kv-keys';
import { resolveDashboardPageLayoutId } from 'src/logic-functions/resolve-page-layout-id';

// Approach B, part 2: bind the DASHBOARD page layout to a dashboard record.
//
// `dashboard` is an ordinary standard object and the app manifest has no
// records section, so this is the only way an app can land a dashboard in the
// Dashboards section. The dashboard.createOne pre-query hook honours a supplied
// pageLayoutId and only auto-creates a throwaway layout when it is omitted.
const handler = async (payload: InstallPayload): Promise<void> => {
  const client = new CoreApiClient({ runAs: 'application' });

  const pageLayoutId = await resolveDashboardPageLayoutId(
    REVENUE_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  );

  if (pageLayoutId === null) {
    throw new Error(
      `Page layout ${REVENUE_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER} not found. Did the manifest sync run?`,
    );
  }

  // Post-install also runs on every version upgrade, so this must not stack a
  // second dashboard on top of the one already bound to the layout.
  const existing = (await client.query({
    dashboards: {
      __args: { filter: { pageLayoutId: { eq: pageLayoutId } }, first: 1 },
      edges: { node: { id: true } },
    },
  } as any)) as any;

  const existingDashboardId = existing.dashboards.edges[0]?.node?.id;

  if (existingDashboardId !== undefined) {
    await kv.set(CREATED_DASHBOARD_ID_KEY, existingDashboardId);

    console.log(
      `Dashboard ${existingDashboardId} already bound to page layout ${pageLayoutId}, skipping (upgrade from ${payload.previousVersion ?? 'none'})`,
    );

    return;
  }

  const created = (await client.mutation({
    createDashboard: {
      __args: { data: { title: REVENUE_DASHBOARD_TITLE, pageLayoutId } },
      id: true,
    },
  } as any)) as any;

  const createdDashboardId = created.createDashboard.id;

  await kv.set(CREATED_DASHBOARD_ID_KEY, createdDashboardId);

  console.log(
    `Created dashboard ${createdDashboardId} on page layout ${pageLayoutId}`,
  );
};

export default definePostInstallLogicFunction({
  universalIdentifier: '5831ab7f-575c-4aae-b498-89ea4e43707a',
  name: 'post-install',
  description: 'Creates the Revenue Overview dashboard record.',
  timeoutSeconds: 60,
  handler,
});
