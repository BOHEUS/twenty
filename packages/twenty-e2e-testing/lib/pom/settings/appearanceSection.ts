import { Locator, Page, expect } from '@playwright/test';

export class AppearanceSection {
  readonly page: Page;
  readonly lightThemeButton: Locator;
  readonly darkThemeButton: Locator;
  readonly timezoneDropdown: Locator;
  readonly timezoneOption: Locator;
  readonly dateFormatDropdown: Locator;
  readonly dateFormatOption: Locator;
  readonly timeFormatDropdown: Locator;
  readonly timeFormatOption: Locator;

  constructor(page: Page) {
    this.page = page;
    this.lightThemeButton = page.getByText('AaLight');
    this.darkThemeButton = page.getByText('AaDark');
    // add
    this.timezoneDropdown;
    this.dateFormatDropdown;
    this.timeFormatDropdown;
  }
}
