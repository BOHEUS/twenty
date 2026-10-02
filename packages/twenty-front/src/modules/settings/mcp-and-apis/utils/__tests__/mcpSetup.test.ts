import {
  buildClaudeInstallLink,
  buildCursorInstallLink,
  buildGooseInstallLink,
  buildLmStudioInstallLink,
  buildMcpConfig,
  buildMcpServer,
  buildMcpServerUrl,
  buildReplitInstallLink,
  buildRemoteMcpServerConfig,
  buildVsCodeInstallLink,
  isHttpsUrl,
} from '@/settings/mcp-and-apis/utils/mcpSetup';

const mcpServerUrl = 'https://api.twenty.com/mcp';
const mcpServer = buildMcpServer({
  serverBaseUrl: 'https://api.twenty.com',
  brandName: 'Twenty',
});

const decodeBase64JsonParam = (link: string, paramName: string) => {
  const params = new URLSearchParams(link.split('?')[1]);
  const encodedValue = params.get(paramName);

  if (encodedValue === null) {
    throw new Error(`Missing ${paramName} param`);
  }

  return JSON.parse(Buffer.from(encodedValue, 'base64').toString('utf-8'));
};

describe('buildMcpServerUrl', () => {
  it('appends /mcp after trimming trailing slashes', () => {
    expect(buildMcpServerUrl('https://api.twenty.com///')).toBe(mcpServerUrl);
  });
});

describe('isHttpsUrl', () => {
  it('returns true only for valid HTTPS urls', () => {
    expect(isHttpsUrl(mcpServerUrl)).toBe(true);
    expect(isHttpsUrl('http://api.twenty.com/mcp')).toBe(false);
    expect(isHttpsUrl('not a url')).toBe(false);
  });
});

describe('buildMcpServer', () => {
  it('derives the server identity from the brand name', () => {
    expect(
      buildMcpServer({
        serverBaseUrl: 'https://crm.acme.test/',
        brandName: 'Acme CRM',
      }),
    ).toEqual({
      url: 'https://crm.acme.test/mcp',
      name: 'acme-crm',
      displayName: 'Acme CRM',
    });
  });
});

describe('buildMcpConfig', () => {
  it('builds the remote MCP JSON config', () => {
    expect(JSON.parse(buildMcpConfig(mcpServer))).toEqual({
      mcpServers: {
        twenty: {
          url: mcpServerUrl,
          headers: {
            Authorization: 'Bearer <YOUR_API_KEY>',
          },
        },
      },
    });
  });
});

describe('buildRemoteMcpServerConfig', () => {
  it('builds the common remote server config', () => {
    expect(buildRemoteMcpServerConfig(mcpServerUrl)).toEqual({
      url: mcpServerUrl,
      headers: {
        Authorization: 'Bearer <YOUR_API_KEY>',
      },
    });
  });
});

describe('buildClaudeInstallLink', () => {
  it('builds a Claude custom connector link', () => {
    const link = buildClaudeInstallLink(mcpServer);
    const params = new URL(link).searchParams;

    expect(link.startsWith('https://claude.ai/customize/connectors?')).toBe(
      true,
    );
    expect(params.get('modal')).toBe('add-custom-connector');
    expect(params.get('connectorName')).toBe('Twenty');
    expect(params.get('connectorUrl')).toBe(mcpServerUrl);
  });
});

describe('buildCursorInstallLink', () => {
  it('base64-encodes the remote MCP config', () => {
    const link = buildCursorInstallLink(mcpServer);

    expect(link.startsWith('https://cursor.com/en/install-mcp?')).toBe(true);
    expect(new URLSearchParams(link.split('?')[1]).get('name')).toBe('twenty');
    expect(decodeBase64JsonParam(link, 'config')).toEqual(
      buildRemoteMcpServerConfig(mcpServerUrl),
    );
  });
});

describe('buildVsCodeInstallLink', () => {
  it('URI-encodes the VS Code MCP install payload', () => {
    const payload = JSON.parse(
      decodeURIComponent(
        buildVsCodeInstallLink(mcpServer).replace('vscode:mcp/install?', ''),
      ),
    );

    expect(payload).toEqual({
      name: 'twenty',
      type: 'http',
      url: mcpServerUrl,
      headers: {
        Authorization: 'Bearer <YOUR_API_KEY>',
      },
    });
  });
});

describe('buildGooseInstallLink', () => {
  it('builds a Goose streamable HTTP extension link', () => {
    const link = buildGooseInstallLink(mcpServer);
    const params = new URLSearchParams(link.split('?')[1]);

    expect(link.startsWith('goose://extension?')).toBe(true);
    expect(params.get('type')).toBe('streamable_http');
    expect(params.get('id')).toBe('twenty');
    expect(params.get('name')).toBe('Twenty');
    expect(params.get('url')).toBe(mcpServerUrl);
    expect(params.get('header')).toBe('Authorization=Bearer <YOUR_API_KEY>');
  });
});

describe('buildReplitInstallLink', () => {
  it('base64-encodes the Replit MCP payload', () => {
    const link = buildReplitInstallLink(mcpServer);

    expect(link.startsWith('https://replit.com/integrations?')).toBe(true);
    expect(decodeBase64JsonParam(link, 'mcp')).toEqual({
      displayName: 'Twenty',
      baseUrl: mcpServerUrl,
      headers: [
        {
          key: 'Authorization',
          value: 'Bearer <YOUR_API_KEY>',
        },
      ],
    });
  });
});

describe('buildLmStudioInstallLink', () => {
  it('base64-encodes the remote MCP config', () => {
    const link = buildLmStudioInstallLink(mcpServer);

    expect(link.startsWith('lmstudio://add_mcp?')).toBe(true);
    expect(new URLSearchParams(link.split('?')[1]).get('name')).toBe('twenty');
    expect(decodeBase64JsonParam(link, 'config')).toEqual(
      buildRemoteMcpServerConfig(mcpServerUrl),
    );
  });
});
