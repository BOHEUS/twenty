import { Locator, Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly loginWithGoogleButton: Locator;
  readonly loginWithEmailButton: Locator;
  readonly termsOfServiceLink: Locator;
  readonly privacyPolicyLink: Locator;
  readonly emailField: Locator;
  readonly continueButton: Locator;
  readonly forgotPasswordButton: Locator;
  readonly forgotPasswordSentStatus: Locator;
  readonly passwordField: Locator;
  readonly revealPasswordButton: Locator;
  readonly signInButton: Locator;
  readonly uploadImageButton: Locator;
  readonly deleteImageButton: Locator;
  readonly workspaceNameField: Locator;
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly syncEverythingWithGoogleRadio: Locator;
  readonly syncSubjectAndMetadataWithGoogleRadio: Locator;
  readonly syncMetadataWithGoogleRadio: Locator;
  readonly syncWithGoogleButton: Locator;
  readonly noSyncButton: Locator;
  readonly inviteLinkField1: Locator;
  readonly inviteLinkField2: Locator;
  readonly inviteLinkField3: Locator;
  readonly copyInviteLink: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginWithGoogleButton = page.getByRole('button', { name: 'Continue with Google' });
    this.loginWithEmailButton;
    this.termsOfServiceLink = page.getByRole('link', { name: 'Terms of Service' });
    this.privacyPolicyLink = page.getByRole('link', { name: 'Privacy Policy' });
    this.emailField = page.getByPlaceholder('Email');
    this.continueButton = page.getByRole('button', { name: 'Continue', exact: true });
    this.forgotPasswordButton = page.getByText('Forgot your password?');
    this.forgotPasswordSentStatus = page.getByRole('status');
    this.passwordField = page.getByPlaceholder('Password');
    this.revealPasswordButton = page.getByTestId('reveal-password-button').getByRole('img');
    this.signInButton = page.getByRole('button', { name: 'Sign up' });
    this.uploadImageButton = page.getByRole('button', { name: 'Upload' });
    this.deleteImageButton = page.getByRole('button', { name: 'Remove' });
    this.workspaceNameField = page.getByPlaceholder('Apple');
    this.firstNameField = page.getByPlaceholder('Tim');
    this.lastNameField = page.getByPlaceholder('Cook');
    this.syncEverythingWithGoogleRadio = page.getByTestId('input-radio').first();
    this.syncSubjectAndMetadataWithGoogleRadio = page.getByTestId('input-radio').nth(1);
    this.syncMetadataWithGoogleRadio = page.getByTestId('input-radio').nth(2);
    this.syncWithGoogleButton = page.getByRole('button', { name: 'Sync with Google' });
    this.noSyncButton = page.getByText('Continue without sync');
    this.inviteLinkField1 = page.getByPlaceholder('tim@apple.dev');
    this.inviteLinkField2 = page.getByPlaceholder('craig@apple.dev');
    this.inviteLinkField3 = page.getByPlaceholder('mike@apple.dev');
    this.copyInviteLink = page.getByRole('button', { name: 'Copy invitation link' });
    this.finishButton = page.getByRole('button', { name: 'Finish' });
  }
}