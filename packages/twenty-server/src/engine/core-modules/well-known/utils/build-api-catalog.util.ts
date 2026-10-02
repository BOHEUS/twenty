import { DOCUMENTATION_BASE_URL } from 'twenty-shared/constants';
import { ApiPath } from 'twenty-shared/types';

// Doc paths only exist on Twenty's documentation, so a custom docs site gets its root.
const getDocsPageUrl = (docsUrl: string, path: string) =>
  docsUrl === DOCUMENTATION_BASE_URL ? `${docsUrl}${path}` : docsUrl;

// Points at each host's live OpenAPI, generated per workspace with its custom objects.
export const buildApiCatalog = ({
  baseUrl,
  docsUrl,
}: {
  baseUrl: string;
  docsUrl: string;
}) => {
  const apiDocsUrl = getDocsPageUrl(docsUrl, '/developers/extend/api');
  const mcpDocsUrl = getDocsPageUrl(docsUrl, '/user-guide/ai/capabilities/mcp');

  return {
    linkset: [
      {
        anchor: `${baseUrl}/${ApiPath.Rest}`,
        'service-desc': [
          {
            href: `${baseUrl}/${ApiPath.Rest}/open-api/core`,
            type: 'application/json',
          },
        ],
        'service-doc': [{ href: apiDocsUrl, type: 'text/html' }],
        'service-meta': [
          {
            href: `${baseUrl}/${ApiPath.WellKnown}/oauth-protected-resource`,
            type: 'application/json',
          },
        ],
      },
      {
        anchor: `${baseUrl}/${ApiPath.Rest}/metadata`,
        'service-desc': [
          {
            href: `${baseUrl}/${ApiPath.Rest}/open-api/metadata`,
            type: 'application/json',
          },
        ],
        'service-doc': [{ href: apiDocsUrl, type: 'text/html' }],
      },
      {
        anchor: `${baseUrl}/${ApiPath.GraphQL}`,
        'service-doc': [{ href: apiDocsUrl, type: 'text/html' }],
      },
      {
        anchor: `${baseUrl}/${ApiPath.Mcp}`,
        'service-desc': [
          {
            href: `${baseUrl}/${ApiPath.WellKnown}/mcp/server-card.json`,
            type: 'application/json',
          },
        ],
        'service-doc': [{ href: mcpDocsUrl, type: 'text/html' }],
      },
    ],
  };
};
