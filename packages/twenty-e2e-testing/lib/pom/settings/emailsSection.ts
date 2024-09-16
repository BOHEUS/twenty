import { Locator, Page, expect } from '@playwright/test';

export class EmailsSection {
  readonly page: Page;
  readonly visibilityEverythingRadio: Locator;
  readonly visibilitySubjectRadio: Locator;
  readonly visibilityMetadataRadio: Locator;
  readonly autoCreationReceivedRadio: Locator;
  readonly autoCreationSentRadio: Locator;
  readonly autoCreationNoneRadio: Locator;

  constructor(page: Page) {
    this.page = page;
    this.visibilityEverythingRadio = page
      .locator('input[name="message-visibility"]')
      .first();
    this.visibilitySubjectRadio = page
      .locator('input[name="message-visibility"]')
      .nth(1);
    this.visibilityMetadataRadio = page
      .locator('input[name="message-visibility"]')
      .nth(2);
    this.autoCreationReceivedRadio = page
      .locator('input[name="message-auto-creation"]')
      .first();
    this.autoCreationSentRadio = page
      .locator('input[name="message-auto-creation"]')
      .nth(1);
    this.autoCreationNoneRadio = page
      .locator('input[name="message-auto-creation"]')
      .nth(2);
  }
}
