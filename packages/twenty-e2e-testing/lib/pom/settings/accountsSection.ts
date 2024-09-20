import { Locator, Page, expect } from '@playwright/test';

export class AccountsSection {
  readonly page: Page;
  readonly addAccountButton: Locator;
  accountMoreOptions: Locator;
  readonly deleteAccountButton: Locator;
  readonly addBlocklistField: Locator;
  readonly addBlocklistButton: Locator;
  removeFromBlocklistButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addAccountButton = page.getByRole('button', { name: 'Add account' });
    this.deleteAccountButton = page.getByText('Remove account');
    this.addBlocklistField = page.getByPlaceholder(
      'eddy@gmail.com, @apple.com',
    );
    this.addBlocklistButton = page.getByRole('button', {
      name: 'Add to blocklist',
    });
  }

  async deleteAccount(email: string) {
    this.accountMoreOptions = this.page
      .locator('div')
      .filter({ hasText: email }); // needs fixing
    await this.accountMoreOptions.click();
    await this.deleteAccountButton.click();
  }

  async addToBlockList(domain: string) {
    await this.addBlocklistField.click();
    await this.addBlocklistField.fill(domain);
    await this.addBlocklistButton.click();
  }

  async removeFromBlocklist(domain: string) {
    this.removeFromBlocklistButton = this.page
      .locator('div')
      .filter({ hasText: domain })
      .getByRole('button'); // needs fixing
    await this.removeFromBlocklistButton.click();
  }
}
