import { Locator, Page } from '@playwright/test';

export class SettingsPage {
  readonly page: Page;
  readonly profileLink: Locator;
  readonly appearanceLink: Locator;
  readonly accountsLink: Locator;
  readonly emailsLink: Locator;
  readonly calendarsLink: Locator;
  readonly generalLink: Locator;
  readonly membersLink: Locator;
  readonly dataModelLink: Locator;
  readonly developersLink: Locator;
  readonly functionsLink: Locator;
  readonly integrationsLink: Locator;
  readonly releasesLink: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.profileLink = page.getByRole('link', { name: 'Profile' });
    this.appearanceLink = page.getByRole('link', { name: 'Appearance' });
    this.accountsLink = page.getByRole('link', { name: 'Accounts' });
    this.emailsLink = page.getByRole('link', { name: 'Emails', exact: true });
    this.calendarsLink = page.getByRole('link', { name: 'Calendars' });
    this.generalLink = page.getByRole('link', { name: 'General' });
    this.membersLink = page.getByRole('link', { name: 'Members' });
    this.dataModelLink = page.getByRole('link', { name: 'Data model' });
    this.developersLink = page.getByRole('link', { name: 'Developers' });
    this.functionsLink = page.getByRole('link', { name: 'Functions' });
    this.integrationsLink = page.getByRole('link', { name: 'Integrations' });
    this.releasesLink = page.getByRole('link', { name: 'Releases' });
    this.logoutLink = page.getByText('Logout');
  }
}