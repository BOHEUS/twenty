import {
  definePageLayout,
  PageLayoutTabLayoutMode,
  PageLayoutType,
} from 'twenty-sdk/define';
import { buildRevenueWidgets } from 'src/page-layouts/build-revenue-widgets';

export const REVENUE_STANDALONE_PAGE_UNIVERSAL_IDENTIFIER =
  'efd1b2cd-3a7c-4ae9-9b10-c2a67f17c582';

// Approach A: a dashboard-looking page reachable from the nav.
// STANDALONE_PAGE is the only layout type a PAGE_LAYOUT navigation menu item is
// allowed to point at, so this is the fully declarative path. It renders the
// same widgets as the DASHBOARD layout, but it does not appear under Dashboards
// and it is not a record, so it cannot be favorited or duplicated by users.
export default definePageLayout({
  universalIdentifier: REVENUE_STANDALONE_PAGE_UNIVERSAL_IDENTIFIER,
  name: 'Revenue Overview',
  type: PageLayoutType.STANDALONE_PAGE,
  tabs: [
    {
      universalIdentifier: 'e97c8070-3963-467f-819b-f0495aa9ec2b',
      title: 'Overview',
      position: 0,
      icon: 'IconChartBar',
      layoutMode: PageLayoutTabLayoutMode.GRID,
      widgets: buildRevenueWidgets({
        pipelineValue: '186aecfd-08ad-4a51-8c33-dbbeb6bb4f54',
        openDealCount: 'f22154aa-21bf-4ea3-9100-8c5e47f57a1d',
        companyCount: '951ba605-8bf5-4df3-8099-6723917f5603',
        pipelineByStage: 'aafdb69d-ff06-4316-b92b-9b15d28ea9fd',
        companiesByAccountOwner: 'fa3a3b3e-23b2-41ea-b857-64728ec15492',
        pipelineTable: 'faf6a6df-3cb4-46ba-8b13-4edc77b822d6',
      }),
    },
  ],
});
