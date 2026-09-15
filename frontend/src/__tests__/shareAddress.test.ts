import { parseShareConfig } from 'react-cheminfo/core';
import { expect, test } from 'vitest';

import { SHARE_VOCABULARY, shareAddress } from '../state/shareConfig.ts';

test('the default input mode leaves the address a plain path', () => {
  const config = parseShareConfig('', SHARE_VOCABULARY);
  expect(shareAddress('/', '?input=draw', config)).toBe('/');
});

test('a chosen input mode is written after the keys the address already carries', () => {
  const config = parseShareConfig('?embed&hide=log', SHARE_VOCABULARY);
  expect(
    shareAddress('/', '?embed&hide=log&seed=7', {
      ...config,
      params: { input: 'draw' },
    }),
  ).toBe('/?seed=7&embed=1&hide=log&input=draw');
});
