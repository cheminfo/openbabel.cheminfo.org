import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

const logHeading = (page: Page) =>
  page.getByRole('heading', { name: 'Log', exact: true });

test('the converter is at the root, under the family header', async ({
  page,
}) => {
  await page.goto('/');

  await expect(page.getByTestId('page-converter')).toBeVisible();
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
});

test('About is a routed page saying what the tool is built on', async ({
  page,
}) => {
  await page.goto('/about');

  await expect(page.getByTestId('page-about')).toBeVisible();
  await expect(
    page.getByText('Open Babel', { exact: false }).first(),
  ).toBeVisible();
  // The licence of the borrowed work is the point of crediting it.
  await expect(page.getByText('GPL-2.0', { exact: false })).toBeVisible();
});

test('the header moves between the pages without a reload', async ({
  page,
}) => {
  await page.goto('/');

  // The bar's About entry is named by its title rather than by its text, and
  // the footer links About too, so the header's own link is the one addressed.
  await page.getByRole('banner').locator('a[href="/about"]').click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByTestId('page-about')).toBeVisible();
});

test('an embedded link drops the chrome a host page already carries', async ({
  page,
}) => {
  await page.goto('/?embed');

  await expect(page.getByTestId('page-converter')).toBeVisible();
  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.getByRole('contentinfo')).toHaveCount(0);
});

test('a link can switch a panel off by name', async ({ page }) => {
  await page.goto('/');
  await expect(logHeading(page)).toBeVisible();

  await page.goto('/?hide=log');
  await expect(page.getByTestId('page-converter')).toBeVisible();
  await expect(logHeading(page)).toHaveCount(0);
});

test('a link opens the converter on the input mode it names', async ({
  page,
}) => {
  await page.goto('/?input=file');

  await expect(
    page.getByText('Drop a file here, or click to browse'),
  ).toBeVisible();
});
