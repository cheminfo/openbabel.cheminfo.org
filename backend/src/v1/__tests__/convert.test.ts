import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterAll, beforeAll, expect, test } from 'vitest';

import buildApp from '../../app.ts';
import getBabel from '../utils/getBabel.ts';

const aspirin = readFileSync(
  join(import.meta.dirname, 'data/aspirin.cdxml'),
).toString();

// Open Babel 3.2 is the first release that reads ChemDraw's current CDXML with
// its bond orders intact; under 3.1.1 aspirin comes back as a radical with no
// aromatic ring. The image ships 3.2, so the chemistry below is what the
// service returns; a machine on an older binary skips it rather than pin the
// wrong answer.
const readsCdxml = babelReadsCdxml();

function babelReadsCdxml(): boolean {
  const version = spawnSync(getBabel(), ['-V'], { encoding: 'utf8' }).stdout;
  const match = /Open Babel (?<major>\d+)\.(?<minor>\d+)/.exec(version ?? '');
  if (!match?.groups) return false;
  const major = Number(match.groups.major);
  const minor = Number(match.groups.minor);
  return major > 3 || (major === 3 && minor >= 2);
}

let app: Awaited<ReturnType<typeof buildApp>>;
let baseUrl: string;

beforeAll(async () => {
  app = await buildApp();
  baseUrl = await app.listen({ port: 0, host: '127.0.0.1' });
});

afterAll(async () => {
  await app.close();
});

async function convert(outputFormat: string) {
  const formData = new FormData();
  formData.append('input', aspirin);
  formData.append('inputFormat', 'cdxml -- ChemDraw CDXML format');
  formData.append('outputFormat', outputFormat);
  const response = await fetch(`${baseUrl}/v1/convert`, {
    method: 'POST',
    body: formData,
  });
  expect(response.status).toBe(200);
  return (await response.json()) as { result: string; log: string };
}

test.skipIf(!readsCdxml)(
  'converts aspirin.cdxml to canonical SMILES',
  async () => {
    const body = await convert('can -- Canonical SMILES format');
    expect(body.result).toBe('CC(=O)Oc1ccccc1C(=O)O\t11\n');
    expect(body.log).toContain('1 molecule converted');
  },
);

test('converts aspirin.cdxml to molfile', async () => {
  const body = await convert('mol -- MDL MOL format');
  expect(body.result).toContain(' 13 13  0  0  0  0  0  0  0  0999 V2000');
  expect(body.result).toContain('M  END');
  expect(body.log).toContain('1 molecule converted');
});
