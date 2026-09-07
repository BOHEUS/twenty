import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineUninstallLogicFunction } from 'twenty-sdk/define';
import { kv, type UninstallPayload } from 'twenty-sdk/logic-function';
import { CREATED_DASHBOARD_ID_KEY } from 'src/constants/kv-keys';

// Approach B, part 3: clean up the record the app created.
//
// PageLayoutService.destroy cascades to the dashboards bound to a layout, but
// that path only covers the metadata API. App uninstall tears the layout down
// through the migration orchestrator instead, which does not cascade, so
// without this hook the dashboard survives with a dangling pageLayoutId.
//
// Soft delete rather than destroy on purpose: the dashboard.destroyOne hook
// cascades back into destroying the page layout through the metadata API,
// mid-uninstall, while the migration is about to remove that same layout.
const handler = async (_payload: UninstallPayload): Promise<void> => {
  const dashboardId = await kv.get<string>(CREATED_DASHBOARD_ID_KEY);

  if (dashboardId === null) {
    console.log('No dashboard recorded for this app, nothing to clean up');

    return;
  }

  const client = new CoreApiClient({ runAs: 'application' });

  await client.mutation({
    deleteDashboard: {
      __args: { id: dashboardId },
      id: true,
    },
  } as any);

  await kv.delete(CREATED_DASHBOARD_ID_KEY);

  console.log(`Deleted dashboard ${dashboardId}`);
};

export default defineUninstallLogicFunction({
  universalIdentifier: '90be7509-55fc-474c-9ddb-23d1716c91e9',
  name: 'uninstall',
  description: 'Deletes the Revenue Overview dashboard record.',
  timeoutSeconds: 60,
  handler,
});
