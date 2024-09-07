import { Locator, Page } from '@playwright/test';

export class ProfileSection {
  readonly page: Page;
  readonly uploadImage: Locator;
  readonly removeImage: Locator;
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly emailField: Locator;
  readonly changePasswordButton: Locator;
  readonly deleteAccountButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.uploadImage = page.getByRole('button', { name: 'Upload' });
    this.removeImage = page.getByRole('button', { name: 'Remove' });
    this.firstNameField = page.getByPlaceholder('Tim');
    this.lastNameField = page.getByPlaceholder('Cook');
    this.emailField = page.getByRole('textbox').nth(2);
    this.changePasswordButton = page.getByRole('button', { name: 'Change Password' });
    this.deleteAccountButton = page.getByRole('button', { name: 'Delete account' });
  }
}
