import {
  definePageLayout,
  PageLayoutTabLayoutMode,
  PageLayoutType,
} from 'twenty-sdk/define';
import { buildRevenueWidgets } from 'src/page-layouts/build-revenue-widgets';
import { REVENUE_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER } from 'src/constants/revenue-dashboard';

// Approach B, part 1: the layout half of a real dashboard.
// The manifest has no records section, so syncing this alone leaves an
// unreachable layout. src/logic-functions/post-install.ts creates the dashboard
// record that binds it into the Dashboards section.
export default definePageLayout({
  universalIdentifier: REVENUE_DASHBOARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  name: 'Revenue Overview Layout',
  type: PageLayoutType.DASHBOARD,
  tabs: [
    {
      universalIdentifier: '392fc86e-2c35-45d7-8c60-885c0a3a43bf',
      title: 'Overview',
      position: 0,
      icon: 'IconChartBar',
      layoutMode: PageLayoutTabLayoutMode.GRID,
      widgets: buildRevenueWidgets({
        pipelineValue: '00d27aa5-9c35-4705-9851-5dc0a3a43a43',
        openDealCount: 'ecb13b8a-637e-4d3b-94e0-cc5e1d0e7e37',
        companyCount: 'acf0f269-7e47-4c38-a65a-a199bd0830a1',
        pipelineByStage: '7bc299b2-6c5f-4b31-bfd8-182d7e8b35c3',
        companiesByAccountOwner: '14356de6-f8e0-4cab-a47a-5b7a57748380',
        pipelineTable: '04aac5bc-337d-42ce-9f54-76ef03398e12',
      }),
    },
  ],
});
