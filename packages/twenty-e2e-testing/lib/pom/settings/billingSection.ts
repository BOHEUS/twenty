import { Locator, Page } from '@playwright/test';

export class BillingSection {
  private readonly viewBillingDetailsButton: Locator;
  private readonly switchBillingSubscriptionButton: Locator;
  private readonly cancelBillingSubscriptionButton: Locator;

  constructor(public readonly page: Page) {
    this.page = page;
    this.viewBillingDetailsButton = page.getByRole('button', {
      name: 'View billing details',
    });
    this.switchBillingSubscriptionButton = page.getByRole('button', {
      name: 'Switch to yearly',
    });
    this.cancelBillingSubscriptionButton = page.getByRole('button', {
      name: 'Cancel Plan',
    });
  }

  async viewBillingDetails() {
    await this.viewBillingDetailsButton.click();
  }

  async switchBillingSubscription() {
    await this.switchBillingSubscriptionButton.click();
  }

  async cancelBillingSubscription() {
    await this.cancelBillingSubscriptionButton.click();
  }
}
