import { expect, test } from 'vitest';

import getOutputFormats from '../getOutputFormats.js';

test('should return an array of output formats', () => {
  const result = getOutputFormats();
  expect(result).toBeInstanceOf(Array);
  expect(result.length).toBeGreaterThan(20);
});
