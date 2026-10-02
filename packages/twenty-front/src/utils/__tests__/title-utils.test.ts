import { i18n } from '@lingui/core';
import { messages as enMessages } from '~/locales/generated/en';
import { getPageTitleFromPath } from '~/utils/title-utils';

i18n.load('en', enMessages);
i18n.activate('en');

describe('title-utils', () => {
  it('should return the correct title for a given path', () => {
    expect(getPageTitleFromPath('/verify', 'Twenty')).toBe('Verify');
    expect(getPageTitleFromPath('/welcome', 'Twenty')).toBe(
      'Sign in or Create an account',
    );
    expect(getPageTitleFromPath('/invite/:workspaceInviteHash', 'Twenty')).toBe(
      'Invite',
    );
    expect(getPageTitleFromPath('/workspace-activation', 'Twenty')).toBe(
      'Create Workspace',
    );
    expect(getPageTitleFromPath('/create/profile', 'Twenty')).toBe(
      'Create Profile',
    );
    expect(
      getPageTitleFromPath('/settings/objects/opportunities', 'Twenty'),
    ).toBe('Data model - Settings');
    expect(getPageTitleFromPath('/settings/profile', 'Twenty')).toBe(
      'Profile - Settings',
    );
    expect(getPageTitleFromPath('/settings/experience', 'Twenty')).toBe(
      'Experience - Settings',
    );
    expect(getPageTitleFromPath('/settings/accounts', 'Twenty')).toBe(
      'Account - Settings',
    );
    expect(getPageTitleFromPath('/settings/accounts/new', 'Twenty')).toBe(
      'Account - Settings',
    );
    expect(getPageTitleFromPath('/settings/accounts/calendars', 'Twenty')).toBe(
      'Account - Settings',
    );
    expect(
      getPageTitleFromPath(
        '/settings/accounts/calendars/:accountUuid',
        'Twenty',
      ),
    ).toBe('Account - Settings');
    expect(getPageTitleFromPath('/settings/accounts/emails', 'Twenty')).toBe(
      'Account - Settings',
    );
    expect(
      getPageTitleFromPath('/settings/accounts/emails/:accountUuid', 'Twenty'),
    ).toBe('Account - Settings');
    expect(getPageTitleFromPath('/settings/billing/plans', 'Twenty')).toBe(
      'Billing - Settings',
    );
    expect(getPageTitleFromPath('/settings/members', 'Twenty')).toBe(
      'Members - Settings',
    );
    expect(getPageTitleFromPath('/settings/general', 'Twenty')).toBe(
      'General - Settings',
    );
    expect(getPageTitleFromPath('/', 'Twenty')).toBe('Twenty');
    expect(getPageTitleFromPath('/random', 'Acme CRM')).toBe('Acme CRM');
  });
});
