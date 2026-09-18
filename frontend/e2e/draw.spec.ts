import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

// The default butoxybenzene plus the ethane a single click draws beside it.
const DRAWN_INCHI =
  'InChI=1S/C10H14O.C2H6/c1-2-3-9-11-10-7-5-4-6-8-10;1-2/h4-8H,2-3,9H2,1H3;1-2H3\n';

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// The editor pulls openchemlib, which a cold Vite dev server compiles first.
test.describe.configure({ timeout: 90_000 });

test('a bond drawn in the editor is the structure that gets converted', async ({
  page,
}) => {
  await page.goto('/?input=draw');
  const toolbar = await editorRect(page, 'toolbar');
  const drawing = await editorRect(page, 'drawing');

  // The single bond is the default tool: a click on empty space adds a C–C.
  // The structure sits in the middle, the help button in the top right corner.
  await page.mouse.click(drawing.x + drawing.width / 2, drawing.y + 80);

  const inputFormat = formatGroup(page, 'Input format');
  await expect(
    inputFormat.getByRole('button', {
      name: 'mol -- MDL MOL format',
      exact: true,
    }),
  ).toBeVisible();

  // Button 5, the single bond, is the sixth down the first column.
  await page.mouse.move(toolbar.x + 12, toolbar.y + 2 + 5 * 21 + 10);
  await expect(page.getByTestId('structure-editor-tooltip')).toContainText(
    'Single bond',
  );

  await formatGroup(page, 'Output format').getByRole('button').click();
  await page.locator('.bp6-popover input').fill('inchi -- InChI format');
  await page
    .getByRole('option', { name: 'inchi InChI format', exact: true })
    .click();
  await page.getByRole('button', { name: 'Convert', exact: true }).click();
  await expect(page.locator('textarea[readonly]')).toHaveValue(DRAWN_INCHI, {
    timeout: 15_000,
  });

  // The text tab holds the molfile the editor handed over.
  await page.getByRole('tab', { name: 'Text input' }).click();
  await expect(page.locator('.input-card textarea')).toHaveValue(
    /^ 13 12 .*V2000$/m,
  );
});

/**
 * The form group of one of the two format pickers, which both read
 * `mol -- MDL MOL format` once a structure is drawn.
 * @param page - The converter page.
 * @param label - The label of the group.
 * @returns The group's locator.
 */
function formatGroup(page: Page, label: string) {
  return page
    .locator('.bp6-form-group')
    .filter({ has: page.getByText(label, { exact: true }) });
}

/**
 * Where one of the editor's canvases is on the page, once it is drawn. Both
 * live in an open shadow root that locators do not pierce reliably.
 * @param page - The converter page.
 * @param canvas - The toolbar, or the drawing area.
 * @returns The canvas's box, in CSS pixels.
 */
async function editorRect(
  page: Page,
  canvas: 'toolbar' | 'drawing',
): Promise<Rect> {
  const handle = await page.waitForFunction(
    (which) => {
      const root = document.querySelector('[data-openchemlib-canvas-editor]');
      const element =
        which === 'toolbar'
          ? root?.shadowRoot?.firstElementChild
          : root?.shadowRoot?.querySelector('canvas[tabindex]');
      if (!(element instanceof HTMLCanvasElement)) return null;
      const { x, y, width, height } = element.getBoundingClientRect();
      return width > 0 && height > 0 ? { x, y, width, height } : null;
    },
    canvas,
    { timeout: 60_000 },
  );
  return (await handle.jsonValue()) as Rect;
}
