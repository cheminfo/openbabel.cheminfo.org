import { afterEach, expect, test, vi } from 'vitest';

import runBabel from '../runBabel.js';

// linear alkane whose --gen3D takes a few seconds, used to occupy a slot
const SLOW_SMILES = 'C'.repeat(200);

afterEach(() => {
  vi.unstubAllEnvs();
});

test('converts SMILES to InChI', async () => {
  const { stdout, stderr } = await runBabel(['-ismi', '-oinchi'], 'c1ccccc1');
  expect(stdout).toBe('InChI=1S/C6H6/c1-2-4-6-5-3-1/h1-6H\n');
  expect(stderr).toContain('1 molecule converted');
});

test('completes more conversions than the parallel limit', async () => {
  const results = await Promise.all(
    Array.from({ length: 6 }, () => runBabel(['-ismi', '-ocan'], 'CCO')),
  );
  expect(results).toHaveLength(6);
  for (const { stdout } of results) {
    expect(stdout).toBe('CCO\t\n');
  }
});

test('kills a conversion exceeding the timeout', async () => {
  vi.stubEnv('CONVERSION_TIMEOUT_MS', '300');
  const { stdout, stderr } = await runBabel(
    ['-ismi', '-osdf', '--gen3D'],
    SLOW_SMILES,
  );
  expect(stdout).toBe('');
  expect(stderr).toContain(
    'Conversion killed after exceeding the 300 ms timeout (SIGKILL)',
  );
});

test('rejects with a 503 error when the queue is full', async () => {
  vi.stubEnv('MAX_PARALLEL_CONVERSIONS', '1');
  vi.stubEnv('MAX_QUEUED_CONVERSIONS', '0');
  vi.stubEnv('CONVERSION_TIMEOUT_MS', '2000');
  const slow = runBabel(['-ismi', '-osdf', '--gen3D'], SLOW_SMILES);
  await expect(runBabel(['-ismi', '-oinchi'], 'C')).rejects.toMatchObject({
    message: 'Too many conversions in progress, please retry later',
    statusCode: 503,
  });
  await slow;
});
