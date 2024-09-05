import { Locator, Page, expect } from '@playwright/test';

export class MainPage {
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
  readonly pageName: Locator;
  readonly tableView: Locator;
  readonly tableViewAddView: Locator;
  readonly tableFilter: Locator;
  readonly tableSort: Locator;
  readonly tableOptions: Locator;
  readonly createIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    //this.workspaceDropdown = page.locator('div').filter({ hasText: /^Apple$/ }).nth(3);
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
    this.pageName = page.getByTestId('top-bar-title').getByTestId('tooltip');
    this.tableView = page.getByText('·');
    this.tableViewAddView = page.getByTestId('tooltip').filter({ hasText: /^Add view$/ });
    this.tableFilter = page.getByText('Filter');
    this.tableSort = page.getByText('Sort');
    this.tableOptions = page.getByText('Options');
    this.createIcon = page.getByLabel('Click to select icon (');
  }
}

export default MainPage;
