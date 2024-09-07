import { Locator, Page, expect } from '@playwright/test';

export class MembersSection {
  readonly page: Page;
  readonly inviteMembersField: Locator;
  readonly inviteMembersButton: Locator;
  readonly inviteLinkButton: Locator;
  readonly deleteMemberButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inviteMembersField = page.getByPlaceholder('tim@apple.com, jony.ive@apple');
    this.inviteMembersButton = page.getByRole('button', { name: 'Invite' });
    this.inviteLinkButton = page.getByRole('button', { name: 'Copy link' });
    this.deleteMemberButton = page.locator('div').filter({ hasText: /^PPhil Shilerphil\.schiler@apple\.dev$/ }).getByRole('button'); // fixing
  }
}