import { DEFAULT_BRAND } from 'twenty-shared/constants';

import { MCP_PROTOCOL_VERSION } from 'src/engine/api/mcp/constants/mcp-protocol-version.const';
import { buildMcpServerCard } from 'src/engine/core-modules/well-known/utils/build-mcp-server-card.util';

describe('buildMcpServerCard', () => {
  it('advertises the streamable-http endpoint on the given host', () => {
    const card = buildMcpServerCard({
      baseUrl: 'https://mycompany.twenty.com',
      version: '1.2.3',
      brand: DEFAULT_BRAND,
    });

    expect(card.remotes).toHaveLength(1);
    expect(card.remotes[0]).toMatchObject({
      type: 'streamable-http',
      url: 'https://mycompany.twenty.com/mcp',
      supportedProtocolVersions: [MCP_PROTOCOL_VERSION],
    });
  });

  it('carries the registry schema, stable identity and passed version', () => {
    const card = buildMcpServerCard({
      baseUrl: 'https://api.twenty.com',
      version: '0.42.0',
      brand: DEFAULT_BRAND,
    });

    expect(card.$schema).toBe(
      'https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json',
    );
    expect(card.name).toBe('com.twenty/twenty');
    expect(card.version).toBe('0.42.0');
    expect(card.repository?.source).toBe('github');
  });

  it('marks the Authorization header optional and secret (OAuth or API key)', () => {
    const card = buildMcpServerCard({
      baseUrl: 'https://mycompany.twenty.com',
      version: '1.0.0',
      brand: DEFAULT_BRAND,
    });

    expect(card.remotes[0].headers).toEqual([
      expect.objectContaining({
        name: 'Authorization',
        isRequired: false,
        isSecret: true,
      }),
    ]);
  });

  it('names, describes and links the card from the brand when white-labeled', () => {
    const card = buildMcpServerCard({
      baseUrl: 'https://crm.acme.test',
      version: '1.0.0',
      brand: {
        ...DEFAULT_BRAND,
        isWhiteLabeled: true,
        name: 'Acme CRM',
        websiteUrl: 'https://www.acme.test',
      },
    });

    expect(card).toMatchObject({
      name: 'test.acme/mcp',
      title: 'Acme CRM',
      websiteUrl: 'https://www.acme.test',
    });
    expect(card.description).toContain('Acme CRM');
    expect(card).not.toHaveProperty('repository');
    expect(JSON.stringify(card)).not.toMatch(/twenty/i);
  });
});
