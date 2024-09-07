import { Locator, Page, expect } from '@playwright/test';

export class AccountsSection {
  readonly page: Page;
  readonly addAccountButton: Locator;
  readonly accountMoreOptions: Locator;
  readonly deleteAccountButton: Locator;
  readonly addBlocklistField: Locator;
  readonly addBlocklistButton: Locator;
  readonly removeFromBlocklistButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addAccountButton = page.getByRole('button', { name: 'Add account' });
    this.accountMoreOptions = page.locator('div').filter({ hasText: /^tim@apple\.dev$/ }); // needs fixing
    this.deleteAccountButton = page.getByText('Remove account');
    this.addBlocklistField = page.getByPlaceholder('eddy@gmail.com, @apple.com');
    this.addBlocklistButton = page.getByRole('button', { name: 'Add to blocklist' });
    this.removeFromBlocklistButton = page.locator('div').filter({ hasText: /^@a\.bSep 6, 2024$/ }).getByRole('button'); // needs fixing
  }
}
