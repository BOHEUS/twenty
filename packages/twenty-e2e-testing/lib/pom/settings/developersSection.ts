import { Locator, Page, Expect } from '@playwright/test';

export class DevelopersSection {
  readonly page: Page;
  readonly readDocumentationButton: Locator;
  readonly createAPIKeyButton: Locator;
  readonly regenerateAPIKeyButton: Locator;
  readonly nameOfAPIKey: Locator;
  readonly expirationDateAPIKey: Locator;
  readonly createWebhookButton: Locator;
  readonly webhookUrl: Locator;
  readonly webhookDescription: Locator;
  readonly webhookFilterObjectDropdown: Locator;
  readonly webhookFilterActionDropdown: Locator;
  readonly cancelButton: Locator;
  readonly saveButton: Locator;
  readonly deleteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.readDocumentationButton = page.getByRole('link', {
      name: 'Read documentation',
    });
    this.createAPIKeyButton = page.getByRole('link', {
      name: 'Create API Key',
    });
    this.createWebhookButton = page.getByRole('link', {
      name: 'Create Webhook',
    });
    this.nameOfAPIKey = page
      .getByPlaceholder('E.g. backoffice integration')
      .first();
    this.expirationDateAPIKey = page
      .locator('div')
      .filter({ hasText: /^Never$/ })
      .nth(3);
    this.regenerateAPIKeyButton = page.getByRole('button', {
      name: 'Regenerate Key',
    });
    this.webhookUrl = page.getByPlaceholder('URL');
    this.webhookDescription = page.getByPlaceholder('Write a description');
    this.webhookFilterObjectDropdown = page
      .locator('div')
      .filter({ hasText: /^All Objects$/ })
      .nth(3);
    this.webhookFilterActionDropdown = page
      .locator('div')
      .filter({ hasText: /^All Actions$/ })
      .nth(3);
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.deleteButton = page.getByRole('button', { name: 'Delete' });
  }

  async openDocumentation() {
    await this.readDocumentationButton.click();
  }

  async createNewAPIKey() {
    await this.createAPIKeyButton.click();
  }
}
