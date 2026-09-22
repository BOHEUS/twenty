import { afterEach, describe, expect, it } from 'vitest';

import { buildWebhookUrl } from 'src/logic-functions/shared/build-webhook-url';

afterEach(() => {
  delete process.env.TWENTY_FUNCTIONS_URL;
});

describe('buildWebhookUrl', () => {
  it('should point at the route trigger prefix on the functions origin', () => {
    process.env.TWENTY_FUNCTIONS_URL = 'https://acme.twenty.com';

    expect(buildWebhookUrl()).toEqual({
      success: true,
      webhookUrl: 'https://acme.twenty.com/s/fullenrich-webhook',
    });
  });

  it('should not double up the slash on a trailing-slash origin', () => {
    process.env.TWENTY_FUNCTIONS_URL = 'https://acme.twenty.com/';

    expect(buildWebhookUrl()).toEqual({
      success: true,
      webhookUrl: 'https://acme.twenty.com/s/fullenrich-webhook',
    });
  });

  it('should fail when the functions origin is unknown', () => {
    expect(buildWebhookUrl().success).toBe(false);
  });
});
