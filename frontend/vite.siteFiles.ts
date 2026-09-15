import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import type { Plugin } from 'vite';

import { ROUTES } from './src/routes.ts';

/**
 * Write the file that describes the site to something other than a browser:
 * the `routes.json` the server titles the page it hands out from, and lists in
 * `sitemap.xml`. It comes from the one route table the app itself reads, so a
 * page added to the site is indexed without anybody remembering to.
 *
 * The sitemap and `robots.txt` are written by the server rather than here,
 * because what they point at is the address the request arrived on.
 * @returns The Vite plugin.
 */
export function siteFiles(): Plugin {
  return {
    name: 'openbabel-site-files',
    apply: 'build',
    writeBundle(options) {
      const directory = options.dir ?? 'dist';
      writeFileSync(
        join(directory, 'routes.json'),
        `${JSON.stringify(
          ROUTES.map((route) => ({
            path: route.path,
            title: route.title,
            description: route.description,
          })),
          null,
          2,
        )}\n`,
      );
    },
  };
}

export { SITE_ID, SITE_URL } from './src/routes.ts';
