import { buildBaseManifest } from 'test/integration/metadata/suites/application/utils/build-base-manifest.util';
import { cleanupApplicationAndAppRegistration } from 'test/integration/metadata/suites/application/utils/cleanup-application-and-app-registration.util';
import { setupApplicationForSync } from 'test/integration/metadata/suites/application/utils/setup-application-for-sync.util';
import { syncApplication } from 'test/integration/metadata/suites/application/utils/sync-application.util';
import { findViews } from 'test/integration/metadata/suites/view/utils/find-views.util';
import {
  type Manifest,
  type ViewSortManifest,
} from 'twenty-shared/application';
import { STANDARD_OBJECTS } from 'twenty-shared/metadata';
import { ViewSortDirection, ViewType } from 'twenty-shared/types';
import { v4 as uuidv4 } from 'uuid';

const APP_ID = uuidv4();
const APP_ROLE_ID = uuidv4();
const PERSON_VIEW_ID = uuidv4();

const JOB_TITLE_SORT: ViewSortManifest = {
  universalIdentifier: uuidv4(),
  fieldMetadataUniversalIdentifier:
    STANDARD_OBJECTS.person.fields.jobTitle.universalIdentifier,
  direction: ViewSortDirection.ASC,
};

const COMPANY_SORT: ViewSortManifest = {
  universalIdentifier: uuidv4(),
  fieldMetadataUniversalIdentifier:
    STANDARD_OBJECTS.person.fields.company.universalIdentifier,
  direction: ViewSortDirection.DESC,
};

const buildManifest = (sorts: ViewSortManifest[]): Manifest =>
  buildBaseManifest({
    appId: APP_ID,
    roleId: APP_ROLE_ID,
    overrides: {
      views: [
        {
          universalIdentifier: PERSON_VIEW_ID,
          name: 'People with ordered sorts',
          objectUniversalIdentifier:
            STANDARD_OBJECTS.person.universalIdentifier,
          type: ViewType.TABLE,
          icon: 'IconTable',
          sorts,
        },
      ],
    },
  });

type ViewWithSorts = {
  universalIdentifier: string;
  viewSorts: { id: string; direction: ViewSortDirection }[];
};

const findViewSorts = async () => {
  const { data } = await findViews<ViewWithSorts>({
    expectToFail: false,
    gqlFields: `
      universalIdentifier
      viewSorts {
        id
        direction
      }
    `,
  });

  return data.getViews.find(
    (view) => view.universalIdentifier === PERSON_VIEW_ID,
  )?.viewSorts;
};

describe('Sync application with a view that has several sorts', () => {
  beforeAll(async () => {
    await setupApplicationForSync({
      applicationUniversalIdentifier: APP_ID,
      name: 'View sort order app',
      description: 'App shipping a view with several sorts',
      sourcePath: 'test-view-sort-order-app',
    });
  }, 60000);

  afterAll(async () => {
    await cleanupApplicationAndAppRegistration({
      applicationUniversalIdentifier: APP_ID,
    });
  });

  it('follows the order of the sorts list and its reordering on the next sync', async () => {
    const { errors: firstSyncErrors } = await syncApplication({
      manifest: buildManifest([JOB_TITLE_SORT, COMPANY_SORT]),
      expectToFail: false,
    });

    expect(firstSyncErrors).toBeUndefined();

    const viewSortsBeforeReorder = await findViewSorts();

    expect(viewSortsBeforeReorder?.map(({ direction }) => direction)).toEqual([
      ViewSortDirection.ASC,
      ViewSortDirection.DESC,
    ]);

    const { errors: secondSyncErrors } = await syncApplication({
      manifest: buildManifest([COMPANY_SORT, JOB_TITLE_SORT]),
      expectToFail: false,
    });

    expect(secondSyncErrors).toBeUndefined();

    const viewSortsAfterReorder = await findViewSorts();

    expect(viewSortsAfterReorder?.map(({ id }) => id)).toEqual(
      [...(viewSortsBeforeReorder ?? [])].reverse().map(({ id }) => id),
    );
  }, 60000);
});
