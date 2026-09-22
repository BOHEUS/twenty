import { afterEach, describe, expect, it } from 'vitest';

import {
  FULLENRICH_ADMIN_API_KEY_SERVER_VARIABLE,
  FULLENRICH_API_KEY_VARIABLE,
  FULLENRICH_DATA_REQUIREMENTS_VARIABLE,
} from 'src/constants/application-variables';
import {
  getFullEnrichApiKey,
  getSelectedEnrichFields,
} from 'src/logic-functions/shared/get-application-variables';

afterEach(() => {
  delete process.env[FULLENRICH_API_KEY_VARIABLE];
  delete process.env[FULLENRICH_ADMIN_API_KEY_SERVER_VARIABLE];
  delete process.env[FULLENRICH_DATA_REQUIREMENTS_VARIABLE];
});

describe('getFullEnrichApiKey', () => {
  it("should use the workspace's own key", () => {
    process.env[FULLENRICH_API_KEY_VARIABLE] = ' workspace-key ';

    expect(getFullEnrichApiKey()).toEqual({
      success: true,
      apiKey: 'workspace-key',
    });
  });

  it('should prefer the workspace key over the instance key', () => {
    process.env[FULLENRICH_API_KEY_VARIABLE] = 'workspace-key';
    process.env[FULLENRICH_ADMIN_API_KEY_SERVER_VARIABLE] = 'instance-key';

    expect(getFullEnrichApiKey()).toEqual({
      success: true,
      apiKey: 'workspace-key',
    });
  });

  it.each([
    ['unset', undefined],
    ['empty', ''],
    ['blank', '   '],
  ])(
    'should fall back to the instance key when the workspace key is %s',
    (_label, workspaceKey) => {
      if (workspaceKey !== undefined) {
        process.env[FULLENRICH_API_KEY_VARIABLE] = workspaceKey;
      }
      process.env[FULLENRICH_ADMIN_API_KEY_SERVER_VARIABLE] = ' instance-key ';

      expect(getFullEnrichApiKey()).toEqual({
        success: true,
        apiKey: 'instance-key',
      });
    },
  );

  it('should fail when neither key is set', () => {
    expect(getFullEnrichApiKey().success).toBe(false);

    process.env[FULLENRICH_API_KEY_VARIABLE] = '   ';
    process.env[FULLENRICH_ADMIN_API_KEY_SERVER_VARIABLE] = '';

    const result = getFullEnrichApiKey();

    expect(result.success).toBe(false);
    expect(result.success === false && result.error).toContain(
      FULLENRICH_ADMIN_API_KEY_SERVER_VARIABLE,
    );
  });
});

describe('getSelectedEnrichFields', () => {
  it('should read a multi-select variable stored as a JSON array', () => {
    process.env[FULLENRICH_DATA_REQUIREMENTS_VARIABLE] = JSON.stringify([
      'contact.work_emails',
      'contact.phones',
    ]);

    expect(getSelectedEnrichFields()).toEqual([
      'contact.work_emails',
      'contact.phones',
    ]);
  });

  it('should accept a comma-separated value', () => {
    process.env[FULLENRICH_DATA_REQUIREMENTS_VARIABLE] =
      'contact.work_emails, contact.personal_emails';

    expect(getSelectedEnrichFields()).toEqual([
      'contact.work_emails',
      'contact.personal_emails',
    ]);
  });

  it('should drop unknown fields and never return an empty selection', () => {
    process.env[FULLENRICH_DATA_REQUIREMENTS_VARIABLE] = JSON.stringify([
      'contact.made_up',
    ]);

    expect(getSelectedEnrichFields()).toEqual(['contact.work_emails']);

    delete process.env[FULLENRICH_DATA_REQUIREMENTS_VARIABLE];

    expect(getSelectedEnrichFields()).toEqual(['contact.work_emails']);
  });
});
