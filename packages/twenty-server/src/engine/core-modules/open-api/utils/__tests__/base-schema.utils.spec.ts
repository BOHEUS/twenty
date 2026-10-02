import { DEFAULT_BRAND } from 'twenty-shared/constants';

import { baseSchema } from 'src/engine/core-modules/open-api/utils/base-schema.utils';

const SERVER_URL = 'https://crm.acme.test';

describe('baseSchema', () => {
  it('links to Twenty without white-labeling', () => {
    const schema = baseSchema('core', SERVER_URL, DEFAULT_BRAND);

    expect(schema.info.title).toBe('Twenty Api');
    expect(schema.info.contact).toEqual({ email: 'felix@twenty.com' });
    expect(schema.info.license?.url).toContain('github.com/twentyhq/twenty');
    expect(schema.externalDocs?.url).toBe('https://twenty.com');
  });

  it('uses the brand and drops Twenty links when white-labeled', () => {
    const schema = baseSchema('core', SERVER_URL, {
      ...DEFAULT_BRAND,
      isWhiteLabeled: true,
      name: 'Acme CRM',
      websiteUrl: 'https://acme.test',
      termsUrl: 'https://acme.test/terms',
      supportEmail: 'help@acme.test',
    });

    expect(schema.info).toMatchObject({
      title: 'Acme CRM Api',
      termsOfService: 'https://acme.test/terms',
      contact: { email: 'help@acme.test' },
      license: { name: 'AGPL-3.0' },
    });
    expect(schema.externalDocs?.url).toBe('https://acme.test');
    expect(JSON.stringify(schema)).not.toMatch(/twenty/i);
  });
});
