import { getDocumentationUrl } from '@/support/utils/getDocumentationUrl';

export const getAppDevelopmentDocumentationUrls = (docsUrl: string) => ({
  gettingStartedUrl: getDocumentationUrl({
    docsUrl,
    path: '/developers/extend/apps/getting-started',
  }),
  buildingAppsUrl: getDocumentationUrl({
    docsUrl,
    path: '/developers/extend/apps/building',
  }),
});
