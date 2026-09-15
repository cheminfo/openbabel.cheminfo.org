/**
 * What this server answers for: the site of the family it belongs to, the
 * pages it routes, and the prose each one is indexed under.
 *
 * The frontend build writes the same table next to the page as `routes.json`
 * and it is what the server normally reads; this is what a server running with
 * no build beside it falls back to, so the two must say the same thing.
 */

import type { NoscriptRoute, RouteMeta, SiteId } from 'react-cheminfo/core';

/** The site of the family this server answers for. */
export const SITE: SiteId = 'openbabel';

/** What the tool does, in the words a search result is read in. */
export const WHAT_IT_DOES =
  'Convert a chemical structure between any pair of the formats OpenBabel reads and writes, in the browser or from a URL.';

const CONVERTER: RouteMeta = {
  path: '/',
  title: 'Convert chemical file formats — SMILES, molfile, InChI, CIF, PDB',
  description:
    'Paste, draw or drop a structure and convert it between any pair of formats OpenBabel supports, with hydrogens, pH and 2D or 3D coordinates.',
};

const ABOUT: RouteMeta = {
  path: '/about',
  title: 'About — what converts the structures, and under what licence',
  description:
    'What openbabel.cheminfo.org converts your structures with, the borrowed work it stands on, its licence, and where to report a problem.',
};

/** The pages the server describes on its own, with no build beside it. */
export const FALLBACK_ROUTES: readonly RouteMeta[] = [CONVERTER, ABOUT];

/**
 * The pages the crawl path lists. It is a menu rather than the route table:
 * the conversion API is a page a reader with no JavaScript can still use.
 */
export const NOSCRIPT_ROUTES: readonly NoscriptRoute[] = [
  {
    ...CONVERTER,
    short: 'Converter',
    note: 'paste a structure and take away another format',
  },
  {
    ...ABOUT,
    short: 'About',
    note: 'what it is built on, and its licence',
  },
  {
    path: '/docs',
    title: 'API documentation',
    description: WHAT_IT_DOES,
  },
];
