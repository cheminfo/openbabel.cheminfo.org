import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

const COUNTS_LINE = ' 11 11  0  0  0  0  0  0  0  0999 V2000';
const LOG = '1 molecule converted\n';
const WEBGL_ERROR = '3D preview requires WebGL, which is not available here.';

// Denies WebGL in the page, so the viewer reports it whatever the browser can
// do. Injected as source because it patches a prototype method.
const DENY_WEBGL = `{
  const getContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (id, ...rest) {
    return String(id).startsWith('webgl')
      ? null
      : getContext.call(this, id, ...rest);
  };
}`;

const helpTip = (page: Page) =>
  page.getByText('Tip: you can also add or remove hydrogens');
const inputTextArea = (page: Page) => page.locator('.input-card textarea');
const outputTextArea = (page: Page) => page.locator('textarea[readonly]');
const logBlock = (page: Page) => page.locator('.log-block pre');
const logCopyButton = (page: Page) => page.locator('.log-block button');
const copyButton = (page: Page) =>
  page.getByRole('button', { name: 'Copy', exact: true });

function userSelect(locator: Locator) {
  return locator.evaluate(
    (element) => window.getComputedStyle(element).userSelect,
  );
}

function clipboardText(page: Page) {
  return page.evaluate(() => navigator.clipboard.readText());
}

/**
 * Convert the default SMILES with 2D coordinates, the one conversion whose log
 * is a single line and whose counts line is fixed.
 * @param page - The page the converter is open in.
 */
async function convertWith2D(page: Page) {
  await page.getByRole('radio', { name: '2D', exact: true }).click();
  await page.getByRole('button', { name: 'Convert' }).click();
  await expect(outputTextArea(page)).toHaveValue(/0999 V2000/);
}

test('the tool is not selectable, but what is typed into it is', async ({
  page,
}) => {
  await page.goto('/');

  await expect(helpTip(page)).toBeVisible();
  expect(await userSelect(helpTip(page))).toBe('none');

  await helpTip(page).dblclick();
  expect(await page.evaluate(() => window.getSelection()?.toString())).toBe('');

  expect(await userSelect(inputTextArea(page))).toBe('text');
});

test('the output is copied by the button beside Download', async ({ page }) => {
  await page.goto('/');
  await convertWith2D(page);

  const molfile = await outputTextArea(page).inputValue();
  expect(molfile.split('\n', 4)[3]).toBe(COUNTS_LINE);

  await expect(copyButton(page)).toHaveAttribute('title', 'Copy the output');
  await copyButton(page).click();
  await expect(copyButton(page)).toHaveText('Copied');
  await expect(copyButton(page)).toHaveClass(/bp6-intent-success/);

  expect(await clipboardText(page)).toBe(molfile);
});

test('the log stays selectable and its corner button copies it', async ({
  page,
}) => {
  await page.goto('/');
  await convertWith2D(page);

  await expect(logBlock(page)).toHaveText('1 molecule converted');
  expect(await logBlock(page).textContent()).toBe(LOG);
  expect(await userSelect(logBlock(page))).toBe('text');

  await logBlock(page).click({ clickCount: 3 });
  expect(
    await page.evaluate(() => window.getSelection()?.toString().trimEnd()),
  ).toBe('1 molecule converted');

  await logCopyButton(page).click();
  await expect(logCopyButton(page)).toHaveClass(/bp6-intent-success/);
  expect(await clipboardText(page)).toBe(LOG);
});

test('the 3D viewer error stays selectable', async ({ page }) => {
  await page.addInitScript({ content: DENY_WEBGL });
  await page.goto('/');
  await page.getByRole('button', { name: 'Convert' }).click();
  await expect(outputTextArea(page)).toHaveValue(/V2000/);

  await page.getByRole('button', { name: 'Preview', exact: true }).click();
  await page.getByRole('button', { name: '3D', exact: true }).click();

  const error = page.locator('.molstar-error');
  await expect(error).toHaveText(WEBGL_ERROR);
  expect(await userSelect(error)).toBe('text');

  await error.click({ clickCount: 3 });
  expect(await page.evaluate(() => window.getSelection()?.toString())).toBe(
    WEBGL_ERROR,
  );
});

test('nothing offers a copy before the first conversion', async ({ page }) => {
  await page.goto('/');

  await expect(logBlock(page)).toHaveText('');
  await expect(logCopyButton(page)).toHaveCount(0);
  await expect(copyButton(page)).toBeDisabled();
});
