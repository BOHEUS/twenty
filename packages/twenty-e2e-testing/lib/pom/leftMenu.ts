import { Locator, Page, expect } from '@playwright/test';

export class LeftMenu {
  readonly page: Page;
  readonly activeWorkspace: string;
  readonly workspaceDropdown: Locator;
  readonly workspaceSelect: Locator;
  readonly leftMenu: Locator;
  readonly searchSubTab: Locator;
  readonly settingsTab: Locator;
  readonly peopleTab: Locator;
  readonly companiesTab: Locator;
  readonly opportunitiesTab: Locator;
  readonly opportunitiesTabAll: Locator;
  readonly opportunitiesTabByStage: Locator;
  readonly tasksTab: Locator;
  readonly tasksTabAll: Locator;
  readonly tasksTabByStatus: Locator;
  readonly notesTab: Locator;

  constructor(page: Page) {
    this.page = page;
    //this.workspaceDropdown = page.locator('div').filter({ hasText: /^Apple$/ }).nth(3); // change locator to data-testid
    //this.workspaceSelect = page.getByTestId('tooltip').filter({ hasText: /^Twenty$/ });
    this.leftMenu = page.getByRole('button').first();
    this.searchSubTab = page.getByText('Search');
    this.settingsTab = page.getByRole('link', { name: 'Settings' });
    this.peopleTab = page.getByRole('link', { name: 'People' });
    this.companiesTab = page.getByRole('link', { name: 'Companies' });
    this.opportunitiesTab = page.getByRole('link', { name: 'Opportunities' });
    this.opportunitiesTabAll = page.getByRole('link', { name: 'All', exact: true });
    this.opportunitiesTabByStage = page.getByRole('link', { name: 'By Stage' });
    this.tasksTab = page.getByRole('link', { name: 'Tasks' });
    this.tasksTabAll = page.getByRole('link', { name: 'All tasks' });
    this.tasksTabByStatus = page.getByRole('link', { name: 'Notes' });
    this.notesTab = page.getByRole('link', { name: 'Notes' });
  }
}

export default LeftMenu;
