# Dashboards

Two ways to ship a dashboard from a Twenty app, both building the same six widgets.

The SDK can define dashboard *layouts* declaratively. It cannot define dashboard
*records* — the app manifest has no records section — and "a dashboard" in the
Dashboards section of the product is a record of the `dashboard` standard object
carrying a `pageLayoutId`. That gap is what this app is about.

## Approach A: standalone page in the nav

`src/page-layouts/revenue-standalone-page.page-layout.ts` +
`src/navigation-menu-items/revenue-overview.navigation-menu-item.ts`

Fully declarative, no logic functions. A `STANDALONE_PAGE` layout plus a
`PAGE_LAYOUT` navigation menu item gives you a page of charts in the sidebar.

`STANDALONE_PAGE` is not a stylistic choice: a `PAGE_LAYOUT` nav item may only
reference a standalone page. Pointing one at a `DASHBOARD` layout fails app sync
with *"PAGE_LAYOUT navigation menu item must reference a STANDALONE_PAGE page
layout"*.

What you give up: the page does not appear under Dashboards, and because it is
not a record, users cannot favorite or duplicate it.

## Approach B: a real dashboard record

`src/page-layouts/revenue-dashboard.page-layout.ts` (layout) +
`src/logic-functions/post-install.ts` (record) +
`src/logic-functions/uninstall.ts` (cleanup)

Syncing a `DASHBOARD` layout on its own leaves it orphaned: nothing points at it
and nothing can reach it. The post-install function closes the loop.

1. Resolve the layout's row id. It is **not** the manifest's
   `universalIdentifier` — the server generates its own id — so
   `src/logic-functions/resolve-page-layout-id.ts` queries
   `getPageLayouts(pageLayoutType: DASHBOARD)` on the metadata API and matches on
   `universalIdentifier`.
2. Create a `dashboard` record with that `pageLayoutId`. The
   `dashboard.createOne` pre-query hook honours a supplied `pageLayoutId` and
   only auto-creates a throwaway layout when it is omitted.
3. Remember the created id in `kv` so uninstall can clean up.

Post-install also runs on version upgrades, so the handler checks for an
existing dashboard on that layout before creating one.

### Why uninstall soft-deletes

`PageLayoutService.destroy` cascades to the dashboards bound to a layout, but
only on the metadata API path. App uninstall removes the layout through the
migration orchestrator, which does not cascade — without the hook the dashboard
would survive with a dangling `pageLayoutId`.

The hook uses `deleteDashboard` rather than `destroyDashboard` on purpose: the
`dashboard.destroyOne` hook cascades back into destroying the page layout
through the metadata API, mid-uninstall, while the migration is about to remove
that same layout.

## The widgets

`src/page-layouts/build-revenue-widgets.ts` builds one widget set that both
layouts reuse, so the two files differ only by `type`. It covers
`AGGREGATE_CHART`, `BAR_CHART`, `PIE_CHART` and `RECORD_TABLE`.

Chart configuration in a manifest uses the *universal* shape: every relation
field is addressed by universal identifier
(`aggregateFieldMetadataUniversalIdentifier`, not `aggregateFieldMetadataId`).
Values the SDK does not export as enums (`layout`, `primaryAxisOrderBy`,
`axisNameDisplay`, `orderBy`) travel as string literals.

A `RECORD_TABLE` widget needs its own view, and it must be a `*_WIDGET` view
type — plain `TABLE`/`KANBAN`/`CALENDAR` views leak into the record index view
pickers. See `src/views/pipeline-table-widget.view.ts`.

## Running it

```bash
yarn install
yarn twenty remote:add --api-url http://localhost:2020 --as local
yarn twenty dev
```

Approach A appears in the sidebar as "Revenue Overview". Approach B appears
under Dashboards once post-install has run.

The app reads standard objects only (Opportunity, Company), so it works on any
workspace without seeding.
