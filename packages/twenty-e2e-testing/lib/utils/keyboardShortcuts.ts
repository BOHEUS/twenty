import { Page } from '@playwright/test';

const MAC = process.platform === 'darwin';

const keyDownCtrlOrMeta = async (page: Page) => {
  if (MAC) {
    await page.keyboard.down('Meta');
  } else {
    await page.keyboard.down('Control');
  }
};

const keyUpCtrlOrMeta = async (page: Page) => {
  if (MAC) {
    await page.keyboard.up('Meta');
  } else {
    await page.keyboard.up('Control');
  }
};

export const withCtrlOrMeta = async (page: Page, fn: () => Promise<void>) => {
  await keyDownCtrlOrMeta(page);
  await fn();
  await keyUpCtrlOrMeta(page);
};

export const pressEnter = async (page: Page) => {
  await page.keyboard.press('Enter', { delay: 50 });
};

export const pressTab = async (page: Page) => {
  await page.keyboard.press('Tab', { delay: 50 });
};

export const pressShiftTab = async (page: Page) => {
  await page.keyboard.down('Shift');
  await page.keyboard.press('Tab', { delay: 50 });
  await page.keyboard.up('Shift');
};

export const pressShiftEnter = async (page: Page) => {
  await page.keyboard.down('Shift');
  await page.keyboard.press('Enter', { delay: 50 });
  await page.keyboard.up('Shift');
};

export const selectAllByKeyboard = async (page: Page) => {
  await keyDownCtrlOrMeta(page);
  await page.keyboard.press('a', { delay: 50 });
  await keyUpCtrlOrMeta(page);
};

export const copyByKeyboard = async (page: Page) => {
  await keyDownCtrlOrMeta(page);
  await page.keyboard.press('c', { delay: 50 });
  await keyUpCtrlOrMeta(page);
};

export const cutByKeyboard = async (page: Page) => {
  await keyDownCtrlOrMeta(page);
  await page.keyboard.press('x', { delay: 50 });
  await keyUpCtrlOrMeta(page);
};

export const pasteByKeyboard = async (page: Page) => {
  await keyDownCtrlOrMeta(page);
  await page.keyboard.press('v', { delay: 50 });
  await keyUpCtrlOrMeta(page);
};

export const companiesShortcut = async (page: Page) => {
  await page.keyboard.press('g', { delay: 50 });
  await page.keyboard.press('c');
};

export const notesShortcut = async (page: Page) => {
  await page.keyboard.press('g', { delay: 50 });
  await page.keyboard.press('n');
};

export const opportunitiesShortcut = async (page: Page) => {
  await page.keyboard.press('g', { delay: 50 });
  await page.keyboard.press('o');
};

export const peopleShortcut = async (page: Page) => {
  await page.keyboard.press('g', { delay: 50 });
  await page.keyboard.press('p');
};

export const rocketsShortcut = async (page: Page) => {
  await page.keyboard.press('g', { delay: 50 });
  await page.keyboard.press('r');
};

export const tasksShortcut = async (page: Page) => {
  await page.keyboard.press('g', { delay: 50 });
  await page.keyboard.press('t');
};

export const workflowsShortcut = async (page: Page) => {
  await page.keyboard.press('g', { delay: 50 });
  await page.keyboard.press('w');
};

export const settingsShortcut = async (page: Page) => {
  await page.keyboard.press('g', { delay: 50 });
  await page.keyboard.press('s');
};

export const customShortcut = async (page: Page, shortcut: string) => {
  await page.keyboard.press('g', { delay: 50 });
  await page.keyboard.press(shortcut);
};
