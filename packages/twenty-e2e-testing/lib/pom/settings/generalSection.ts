import { Locator, Page, expect } from '@playwright/test';

export class generalSection {
  readonly page: Page;
  readonly uploadImage: Locator;
  readonly removeImage: Locator;
  readonly workspaceNameField: Locator;
  readonly supportSwitch: Locator;
  readonly deleteWorkspaceButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.uploadImage = page.getByRole('button', { name: 'Upload' });
    this.removeImage = page.getByRole('button', { name: 'Remove' });
    this.workspaceNameField = page.getByPlaceholder('Apple');
    this.supportSwitch; // add
    this.deleteWorkspaceButton = page.getByRole('button', {
      name: 'Delete workspace',
    });
  }

  async changeWorkspaceName(workspaceName: string) {
    await this.workspaceNameField.clear();
    await this.workspaceNameField.fill(workspaceName);
  }

  async changeSupportSwitchState() {
    await this.supportSwitch.click();
  }

  async deleteWorkSpace() {
    await this.deleteWorkspaceButton.click();
    await expect(this.deleteWorkspaceButton).not.toBeVisible();
  }
}
