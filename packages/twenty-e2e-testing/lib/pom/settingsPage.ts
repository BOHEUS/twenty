import { Locator, Page } from '@playwright/test';

export class SettingsPage {
  readonly page: Page;
  readonly exitSettingsLink: Locator;
  readonly profileLink: Locator;
  readonly experienceLink: Locator;
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
    this.exitSettingsLink = page.getByRole('button', { name: 'Exit Settings' });
    this.profileLink = page.getByRole('link', { name: 'Profile' });
    this.experienceLink = page.getByRole('link', { name: 'Experience' });
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

  async leaveSettingsPage() {
    await this.exitSettingsLink.click();
  }

  async goToProfileSection() {
    await this.profileLink.click();
  }

  async goToExperienceSection() {
    await this.experienceLink.click();
  }

  async goToAccountsSection() {
    await this.accountsLink.click();
  }

  async goToEmailsSection() {
    await this.emailsLink.click();
  }

  async goToCalendarsSection() {
    await this.calendarsLink.click();
  }

  async goToGeneralSection() {
    await this.generalLink.click();
  }

  async goToMembersSection() {
    await this.membersLink.click();
  }

  async goToDataModelSection() {
    await this.dataModelLink.click();
  }

  async goToDevelopersSection() {
    await this.developersLink.click();
  }

  async goToFunctionsSection() {
    await this.functionsLink.click();
  }

  async goToIntegrationsSection() {
    await this.integrationsLink.click();
  }

  async goToReleasesIntegration() {
    await this.releasesLink.click();
  }

  async logout() {
    await this.logoutLink.click();
  }
}
