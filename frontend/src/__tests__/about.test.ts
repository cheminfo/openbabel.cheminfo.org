import { aboutProblems } from 'react-cheminfo/core';
import { expect, test } from 'vitest';

import { ABOUT } from '../about.ts';

test('the About record is one the family will render', () => {
  expect(aboutProblems(ABOUT)).toStrictEqual([]);
});

test('Open Babel is credited, because it does the conversion', () => {
  expect(ABOUT.credits).toContain('openbabel');
});
