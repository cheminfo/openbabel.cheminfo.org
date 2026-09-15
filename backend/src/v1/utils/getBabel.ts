import { existsSync } from 'node:fs';

const PATHS = ['/opt/homebrew/bin/obabel', '/usr/bin/obabel'];

/**
 * Where the `obabel` binary is. `BABEL` names it when it sits somewhere else.
 * @returns The path to the binary.
 * @throws {Error} When no binary is found.
 */
export default function getBabel(): string {
  if (process.env.BABEL) return process.env.BABEL;

  for (const path of PATHS) {
    if (existsSync(path)) return path;
  }
  throw new Error('BABEL not found');
}
