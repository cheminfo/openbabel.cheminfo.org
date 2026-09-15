import { buildShareUrl, parseShareConfig } from 'react-cheminfo/core';
import { expect, test } from 'vitest';

import { SHARE_VOCABULARY } from '../state/shareConfig.ts';

test('a bare address opens the converter on the typed input, nothing hidden', () => {
  const config = parseShareConfig('', SHARE_VOCABULARY);
  expect(config.embed).toBe(false);
  expect(config.hidden).toStrictEqual([]);
  expect(config.params.input).toBe('text');
});

test('a link can open the drawing tab and frame the tool', () => {
  const config = parseShareConfig('?embed&input=draw', SHARE_VOCABULARY);
  expect(config.embed).toBe(true);
  expect(config.params.input).toBe('draw');
});

test('an input the tool does not know falls back to typing', () => {
  expect(
    parseShareConfig('?input=carrier-pigeon', SHARE_VOCABULARY).params.input,
  ).toBe('text');
});

test('hidden parts survive a round trip through a shared link', () => {
  const url = buildShareUrl({
    base: 'https://openbabel.cheminfo.org/',
    config: { embed: true, hidden: ['log', 'help'], params: { input: 'file' } },
    vocabulary: SHARE_VOCABULARY,
  });
  const config = parseShareConfig(new URL(url).search, SHARE_VOCABULARY);
  expect(config.embed).toBe(true);
  expect(config.hidden.toSorted()).toStrictEqual(['help', 'log']);
  expect(config.params.input).toBe('file');
});
