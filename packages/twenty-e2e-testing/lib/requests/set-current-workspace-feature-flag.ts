import { type Page } from '@playwright/test';

import { postBackendGraphQL } from './post-backend-graphql';

export const setCurrentWorkspaceFeatureFlag = async ({
  page,
  featureFlag,
  value,
}: {
  page: Page;
  featureFlag: string;
  value: boolean;
}) => {
  const { body: currentUserBody } = await postBackendGraphQL<{
    currentUser: { currentWorkspace: { id: string } };
  }>({
    page,
    endpoint: 'metadata',
    data: { query: '{ currentUser { currentWorkspace { id } } }' },
  });

  const workspaceId = currentUserBody.data?.currentUser.currentWorkspace.id;

  const { body } = await postBackendGraphQL<{
    updateWorkspaceFeatureFlag: boolean;
  }>({
    page,
    endpoint: 'admin-panel',
    data: {
      query: `mutation UpdateWorkspaceFeatureFlag($workspaceId: UUID!, $featureFlag: String!, $value: Boolean!) {
        updateWorkspaceFeatureFlag(workspaceId: $workspaceId, featureFlag: $featureFlag, value: $value)
      }`,
      variables: { workspaceId, featureFlag, value },
    },
  });

  if (body.data?.updateWorkspaceFeatureFlag !== true) {
    throw new Error(
      `Could not set ${featureFlag}: ${JSON.stringify(body.errors)}`,
    );
  }
};
