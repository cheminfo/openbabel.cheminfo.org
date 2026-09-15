import { spawnSync } from 'node:child_process';

import getBabel from './getBabel.ts';

const BABEL = getBabel();

let formats: string[] | undefined;

/**
 * Every format the binary can write. Asked of it once, then remembered.
 * @returns One line per format, as `obabel -L formats write` writes them.
 */
export default function getOutputFormats(): string[] {
  if (!formats) {
    const result = spawnSync(BABEL, ['-L', 'formats', 'write'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      encoding: 'utf8',
    });
    formats = result.stdout.split(/\r?\n/);
  }
  return formats;
}
