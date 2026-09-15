import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { siteById } from 'react-cheminfo/core';

import { ABOUT } from '../src/about.ts';
import { ROUTES, SITE_ID } from '../src/routes.ts';

const ETHANOL_INCHI = 'InChI=1S/C2H6O/c1-2-3/h3H,2H2,1H3\n';

// The About page is headed by the site's wordmark, as its record spells it.
const { name } = siteById(SITE_ID);
const WORDMARK = `${name.lead}${name.dot ? '.' : ''}${name.alt}`;

async function convertEthanolToInchi(page: Page) {
  await page.locator('.input-card textarea').fill('CCO');

  await page
    .getByRole('button', { name: 'mol -- MDL MOL format', exact: true })
    .click();
  await page.locator('.bp6-popover input').fill('inchi -- InChI format');
  await page
    .getByRole('option', { name: 'inchi InChI format', exact: true })
    .click();

  await page.getByRole('button', { name: 'Convert', exact: true }).click();
  await expect(page.locator('textarea[readonly]')).toHaveValue(ETHANOL_INCHI);
}

function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (error) => {
    errors.push(`pageerror: ${error.message}`);
  });
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(`console.error: ${message.text()}`);
    }
  });
  return errors;
}

test('the converter at / turns an ethanol SMILES into its InChI', async ({
  page,
}) => {
  await page.goto('/');

  await expect(page.getByTestId('page-converter')).toBeVisible();
  await convertEthanolToInchi(page);
});

test('/about names the site, offers Cite and keeps the footer', async ({
  page,
}) => {
  await page.goto('/about');

  const main = page.getByRole('main');
  await expect(main.getByRole('heading', { level: 1 })).toHaveText(WORDMARK);
  await expect(main.getByText(ABOUT.what, { exact: true })).toBeVisible();
  await expect(
    main.getByRole('heading', { name: 'How to cite', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('banner').getByRole('button', { name: 'Cite', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
});

for (const query of ['?embed', '?embed=1']) {
  test(`/${query} drops the header and footer and the converter still converts`, async ({
    page,
  }) => {
    await page.goto(`/${query}`);

    await expect(page.getByTestId('page-converter')).toBeVisible();
    await expect(page.getByRole('banner')).toHaveCount(0);
    await expect(page.getByRole('contentinfo')).toHaveCount(0);
    await convertEthanolToInchi(page);
  });
}

for (const route of ROUTES) {
  test(`${route.path} loads with no page error and no console error`, async ({
    page,
  }) => {
    const errors = collectErrors(page);

    await page.goto(route.path);
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByTestId(`page-${route.tab}`)).toBeVisible();
    await page.waitForLoadState('networkidle');

    expect(errors).toStrictEqual([]);
  });
}

test('an unknown address falls back to the converter', async ({ page }) => {
  await page.goto('/no-such-page');

  await expect(page.getByTestId('page-converter')).toBeVisible();
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Convert', exact: true }),
  ).toBeVisible();
});
