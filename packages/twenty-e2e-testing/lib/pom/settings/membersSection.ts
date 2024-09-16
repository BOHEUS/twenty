import { Locator, Page, expect } from '@playwright/test';

export class MembersSection {
  readonly page: Page;
  readonly inviteMembersField: Locator;
  readonly inviteMembersButton: Locator;
  readonly inviteLinkButton: Locator;
  deleteMemberButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inviteMembersField = page.getByPlaceholder(
      'tim@apple.com, jony.ive@apple',
    );
    this.inviteMembersButton = page.getByRole('button', { name: 'Invite' });
    this.inviteLinkButton = page.getByRole('button', { name: 'Copy link' });
  }

  async sendInviteLink(email: string) {
    await this.inviteMembersField.click();
    await this.inviteMembersField.fill(email);
    await this.inviteLinkButton.click();
  }

  async deleteMember(email: string) {
    this.deleteMemberButton = this.page
      .locator('div')
      .filter({ hasText: email })
      .getByRole('button');
    await this.deleteMemberButton.click();
    await expect(this.deleteMemberButton).not.toBeVisible();
  }
}
