import { expect, test } from 'vitest';

import { injectTrackingScript } from '../injectTrackingScript.ts';

const PAGE = '<html><head><title>x</title></head><body></body></html>';
const SNIPPET = '<script defer src="https://example.org/count.js"></script>';

test('the snippet goes at the end of the head, verbatim', () => {
  expect(injectTrackingScript(PAGE, SNIPPET)).toBe(
    `<html><head><title>x</title>${SNIPPET}\n</head><body></body></html>`,
  );
});

test('a deployment that measures nothing serves the page it was given', () => {
  expect(injectTrackingScript(PAGE)).toBe(PAGE);
  expect(injectTrackingScript(PAGE, ' '.repeat(3))).toBe(PAGE);
});

test('a page already carrying the snippet is left alone', () => {
  const once = injectTrackingScript(PAGE, SNIPPET);
  expect(injectTrackingScript(once, SNIPPET)).toBe(once);
});
