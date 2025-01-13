import { Locator, Page } from '@playwright/test';

export class StripePage {
  private readonly cardInformationInput: Locator;
  private readonly expirationDateInput: Locator;
  private readonly cvcInput: Locator;
  private readonly cardholderNameInput: Locator;
  private readonly countrySelect: Locator;
  private readonly businessPurchaseCheckbox: Locator;
  private readonly startTrialButton: Locator;
  private readonly cancelSubscriptionButton: Locator;
  private readonly confirmCancelSubscriptionButton: Locator;
  private readonly cancellationNoReasonButton: Locator;
  private readonly renewSubscriptionButton: Locator;
  private readonly returnToTwentyLink: Locator;

  constructor(public readonly page: Page) {
    this.page = page;
    this.cardInformationInput = page.getByPlaceholder('1234 1234 1234 1234');
    this.expirationDateInput = page.getByPlaceholder('MM / YY');
    this.cvcInput = page.getByPlaceholder('CVC');
    this.cardholderNameInput = page.getByPlaceholder('Full name on card');
    this.countrySelect = page.getByLabel('Country or region');
    this.businessPurchaseCheckbox = page.getByLabel(
      "I'm purchasing as a business",
    );
    this.startTrialButton = page.getByTestId('hosted-payment-submit-button');
    this.cancelSubscriptionButton = page.locator(
      'a[data-test="cancel-subscription"]',
    );
    this.confirmCancelSubscriptionButton = page.getByTestId('confirm');
    this.cancellationNoReasonButton = page.getByTestId(
      'cancellation_reason_cancel',
    );
    this.renewSubscriptionButton = page.locator(
      'a[data-test="renew-subscription"]',
    );
    this.returnToTwentyLink = page.getByTestId('return-to-business-link');
  }

  async fillCardInformation(input: string) {
    await this.cardInformationInput.fill(input);
  }

  // date must be 4 numbers with no spaces or slash, e.g. 01 / 01 => 0101
  async fillExpirationDate(input: string) {
    await this.expirationDateInput.fill(input);
  }

  async fillCVC(input: string) {
    await this.cvcInput.fill(input);
  }

  async fillCardholderName(input: string) {
    await this.cardholderNameInput.fill(input);
  }

  // full name must be provided
  async selectCountry(country: string) {
    await this.countrySelect.selectOption(country);
  }

  async clickBusinessPurchaseCheckbox() {
    await this.businessPurchaseCheckbox.click();
  }

  async clickStartTrialButton() {
    await this.startTrialButton.click();
  }

  async clickCancelSubscriptionButton() {
    await this.cancelSubscriptionButton.click();
  }

  async clickConfirmCancelSubscriptionButton() {
    await this.confirmCancelSubscriptionButton.click();
  }

  async clickCancellationNoReasonButton() {
    await this.cancellationNoReasonButton.click();
  }

  async clickRenewSubscriptionButton() {
    await this.renewSubscriptionButton.click();
  }

  async clickReturnToTwentyLink() {
    await this.returnToTwentyLink.click();
  }
}
