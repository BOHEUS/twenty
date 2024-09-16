import { Locator, Page, expect } from '@playwright/test';

export class DataModelSection {
  readonly page: Page;
  readonly addObjectButton: Locator;
  readonly newObjectIcon: Locator;
  readonly newObjectSingular: Locator;
  readonly newObjectPlural: Locator;
  readonly newObjectDescription: Locator;
  readonly addFieldButton: Locator;
  readonly cancelButton: Locator;
  readonly saveButton: Locator; // before more details pull newest changes from repo

  constructor(page: Page) {
    this.page = page;
    this.addObjectButton = page.getByRole('button', { name: 'Add object' });
    this.newObjectIcon = page.getByLabel('Click to select icon (');
    this.newObjectSingular = page.getByPlaceholder('Listing', { exact: true });
    this.newObjectPlural = page.getByPlaceholder('Listings');
    this.newObjectDescription = page.getByPlaceholder('Write a description');
    this.addFieldButton = page.getByRole('button', { name: 'Add field' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }
}
