import { Locator, Page } from '@playwright/test';

export class RecordDetailsSection {
  readonly page: Page;
  readonly timelineTab: Locator;
  readonly tasksTab: Locator;
  readonly notesTab: Locator;
  readonly filesTab: Locator;
  readonly emailsTab: Locator;
  readonly calendarTab: Locator;
  readonly favouriteButton: Locator;
  readonly addNewLinkedRecord: Locator;
  readonly addNewNoteButton: Locator;
  readonly addNewTaskButton: Locator;
  readonly moreOptionsButton: Locator;
  readonly deleteObject: Locator;

  constructor(page: Page) {
    this.page = page;
    this.timelineTab = page.getByTestId('tab-timeline');
    this.tasksTab = page.getByTestId('tab-tasks');
    this.notesTab = page.getByTestId('tab-notes');
    this.filesTab = page.getByTestId('tab-files');
    this.emailsTab = page.getByTestId('tab-emails');
    this.calendarTab = page.getByTestId('tab-calendar');
    // this.favouriteButton =
    this.addNewLinkedRecord = page.getByTestId('add-showpage-button');
    this.addNewNoteButton = page.locator('div').filter({ hasText: /^Note$/ }).nth(2);
    this.addNewTaskButton = page.locator('div').filter({ hasText: /^Task$/ }).first();
    this.moreOptionsButton = page.getByTestId('more-showpage-button');
    this.deleteObject = page.getByText('Delete');
  }
}
