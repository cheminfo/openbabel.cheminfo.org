import { spawnSync } from 'node:child_process';

import getBabel from './getBabel.ts';

const BABEL = getBabel();

let formats: string[] | undefined;

/**
 * Every format the binary can read. Asked of it once, then remembered.
 * @returns One line per format, as `obabel -L formats read` writes them.
 */
export default function getInputFormats(): string[] {
  if (!formats) {
    const result = spawnSync(BABEL, ['-L', 'formats', 'read'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      encoding: 'utf8',
    });
    formats = result.stdout.split(/\r?\n/);
  }
  return formats;
}
