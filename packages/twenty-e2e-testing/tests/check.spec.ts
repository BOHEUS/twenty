import { test } from '../lib/fixtures/screenshot';
import { MainPage } from '../lib/pom/mainPage';

test('test', async ({ page }) => {
  const main = new MainPage(page);
  await main.hideLeftMenu();
});

test('test2', async ({ page }) => {
  const main = new MainPage(page);
  await main.createNewView();
});