import { Locator, Page, expect } from '@playwright/test';

export class CalendarSection {
  readonly page: Page;
  readonly eventVisibilityEverythingOption: Locator;
  readonly eventVisibilityMetadataOption: Locator;
  readonly contactAutoCreation: Locator;

  constructor(page: Page) {
    this.page = page;
    this.eventVisibilityEverythingOption = page.getByTestId('input-radio').first();
    this.eventVisibilityMetadataOption = page.getByTestId('input-radio').nth(1);
    this.contactAutoCreation = page.locator('.css-xrqgly');
  }
}
