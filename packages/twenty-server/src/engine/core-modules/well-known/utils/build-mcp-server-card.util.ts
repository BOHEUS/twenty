import { type Brand } from 'twenty-shared/types';

import { MCP_PROTOCOL_VERSION } from 'src/engine/api/mcp/constants/mcp-protocol-version.const';

type BuildMcpServerCardArgs = {
  baseUrl: string;
  version: string;
  brand: Brand;
};

// The registry names servers by reverse domain, so a white-labeled card is namespaced by its own website.
const getServerName = (brand: Brand): string => {
  if (!brand.isWhiteLabeled) {
    return 'com.twenty/twenty';
  }

  const reversedHostname = new URL(brand.websiteUrl).hostname
    .replace(/^www\./, '')
    .split('.')
    .reverse()
    .join('.');

  return `${reversedHostname}/mcp`;
};

export const buildMcpServerCard = ({
  baseUrl,
  version,
  brand,
}: BuildMcpServerCardArgs) => {
  const productName = brand.isWhiteLabeled ? brand.name : 'Twenty CRM';

  return {
    $schema:
      'https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json',
    name: getServerName(brand),
    version,
    title: productName,
    description: `Read and write your ${productName} data - companies, people, opportunities, tasks, notes and any custom objects - from AI assistants. Tools are discovered at runtime and scoped to the authenticated workspace.`,
    websiteUrl: brand.websiteUrl,
    ...(!brand.isWhiteLabeled && {
      repository: {
        url: 'https://github.com/twentyhq/twenty',
        source: 'github',
      },
    }),
    remotes: [
      {
        type: 'streamable-http',
        url: `${baseUrl}/mcp`,
        supportedProtocolVersions: [MCP_PROTOCOL_VERSION],
        headers: [
          {
            name: 'Authorization',
            description:
              "Optional. Bearer <api-key> for static API-key auth. Omit to use OAuth 2.1, auto-discovered from this host's /.well-known/oauth-protected-resource and /.well-known/oauth-authorization-server.",
            isRequired: false,
            isSecret: true,
          },
        ],
      },
    ],
  };
};
