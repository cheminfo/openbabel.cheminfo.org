import { expect, test } from 'vitest';

import getInputFormats from '../getInputFormats.js';

test('should return an array of output formats', () => {
  const result = getInputFormats();
  expect(result).toBeInstanceOf(Array);
  expect(result.length).toBeGreaterThan(20);
});
