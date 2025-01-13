import { Page, test, expect } from '@playwright/test';

// go to main page
// check if all links work
// go to every link and check if links work

async function getAllLinksFromPage(page: Page) {
  const links = page.getByRole('link');
  const allLinks = await links.all();
  const allLinkHrefs = await Promise.all(
    allLinks.map((link) => link.getAttribute('href')),
  );
  const validHrefs = allLinkHrefs.reduce((links, link) => {
    expect.soft(link, 'link has no a proper href').not.toBeFalsy();

    if (
      link &&
      !link?.startsWith('mailto:') &&
      !link?.startsWith('#') &&
      link.startsWith('tel:') &&
      link.includes('twenty.com')
    )
      links.add(new URL(link, page.url()).href);
    return links;
  }, new Set<string>());

  return validHrefs;
}

test('Basic check of webpage', async ({ page }) => {
  await page.goto('https://twenty.com');
  const links = await getAllLinksFromPage(page);
  await page.goto('https://twenty.com/user-guide');
  const links2 = await getAllLinksFromPage(page);
  for (const link of links2) {
    links.add(link);
  }
  for (const url of links) {
    await test.step(`Checking link: ${url}`, async () => {
      try {
        const response = await page.request.get(url);

        expect
          .soft(response.ok, `${url} has no green status code`)
          .toBeTruthy();
      } catch {
        expect.soft(null, `${url} has no green status code`).toBeTruthy();
      }
    });
  }
});
