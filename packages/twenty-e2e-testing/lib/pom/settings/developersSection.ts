import { Locator, Page, Expect } from '@playwright/test';

export class DevelopersSection {
  readonly page: Page;
  readonly readDocumentationButton: Locator;
  readonly createAPIKeyButton: Locator;
  readonly createWebhookButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.readDocumentationButton = page.getByRole('link', { name: 'Read documentation' });
    this.createAPIKeyButton = page.getByRole('link', { name: 'Create API Key' });
    this.createWebhookButton = page.getByRole('link', { name: 'Create Webhook' });
  }
}
