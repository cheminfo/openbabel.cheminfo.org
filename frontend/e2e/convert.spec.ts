import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

const aspirin = readFileSync(
  join(
    import.meta.dirname,
    '../../backend/src/v1/__tests__/data/aspirin.cdxml',
  ),
).toString();

async function dropAspirin(page: Page, target: string) {
  const dataTransfer = await page.evaluateHandle((content: string) => {
    const transfer = new DataTransfer();
    transfer.items.add(
      new File([content], 'aspirin.cdxml', { type: 'text/xml' }),
    );
    return transfer;
  }, aspirin);
  await page.dispatchEvent(target, 'drop', { dataTransfer });
}

test('converts a dropped aspirin.cdxml file to molfile', async ({ page }) => {
  await page.goto('/?input=file');

  await expect(
    page.getByText('Drop a file here, or click to browse'),
  ).toBeVisible();
  await dropAspirin(page, '.file-drop-zone');

  // The file is loaded and the input format is detected from the extension.
  await expect(
    page.getByText('aspirin.cdxml — format: cdxml -- ChemDraw CDXML format'),
  ).toBeVisible();
  await expect(
    page.getByRole('button', {
      name: 'cdxml -- ChemDraw CDXML format',
      exact: true,
    }),
  ).toBeVisible();

  // Convert calls the API; the default output format is molfile.
  await page.getByRole('button', { name: 'Convert' }).click();
  const output = page.locator('textarea[readonly]');
  await expect(output).toHaveValue(
    / 13 13 {2}0 {2}0 {2}0 {2}0 {2}0 {2}0 {2}0 {2}0999 V2000/,
  );
  await expect(output).toHaveValue(/M {2}END/);

  // The Expand button shows the result in a large dialog.
  await page.getByRole('button', { name: 'Expand' }).click();
  await expect(page.getByRole('dialog').locator('textarea')).toHaveValue(
    /0999 V2000/,
  );
});

test('dropping a file anywhere on the input card loads it', async ({
  page,
}) => {
  await page.goto('/');

  await page.locator('.input-card').waitFor();
  await dropAspirin(page, '.input-card');

  // The card switches to the file tab and confirms the loaded file.
  await expect(
    page.getByText('aspirin.cdxml — format: cdxml -- ChemDraw CDXML format'),
  ).toBeVisible();
});
