/**
 * Every address this site answers, each with the name and the sentence it is
 * indexed under.
 *
 * One table, read by three things that must agree on it: the router, which
 * turns an address into a page; the build, which writes it next to the page as
 * `routes.json` so the server can title what it hands out; and the running app,
 * which retitles the tab after an in-app move. A page missing from here is a
 * page a search engine only ever sees as the converter.
 *
 * The backend's `site.ts` describes the same two pages for a server running
 * with no build beside it — change one and change the other.
 */

import type { RouteMeta, SiteId } from 'react-cheminfo/core';

/** The site, as the header, the share dialog and the served head name it. */
export const SITE_ID: SiteId = 'openbabel';

/** What the site is called in prose, spelled as the address it is. */
export const SITE_NAME = 'openbabel.cheminfo.org';

/** Where the site is served, and what every canonical address is built on. */
export const SITE_URL = 'https://openbabel.cheminfo.org';

/** Where the sources live. */
export const REPOSITORY = 'https://github.com/cheminfo/openbabel.cheminfo.org';

/** The pages, named as the router and the state name them. */
export type TabId = 'converter' | 'about';

/** A routed page: what a crawler is told, plus how the header names it. */
export interface RouteDefinition extends RouteMeta {
  /** The page this address opens. */
  tab: TabId;
  /** How the page is named in the header bar. */
  label: string;
}

const ROUTE_TABLE = [
  {
    path: '/',
    tab: 'converter',
    label: 'Converter',
    title: 'Convert chemical file formats — SMILES, molfile, InChI, CIF, PDB',
    description:
      'Paste, draw or drop a structure and convert it between any pair of formats OpenBabel supports, with hydrogens, pH and 2D or 3D coordinates.',
  },
  {
    path: '/about',
    tab: 'about',
    label: 'About',
    title: 'About — what converts the structures, and under what licence',
    description:
      'What openbabel.cheminfo.org converts your structures with, the borrowed work it stands on, its licence, and where to report a problem.',
  },
] as const satisfies readonly RouteDefinition[];

/** Every address the site answers, the home page first. */
export const ROUTES: readonly RouteDefinition[] = ROUTE_TABLE;

/** The page an address the site does not know opens. */
export const HOME_ROUTE: RouteDefinition = ROUTE_TABLE[0];

/**
 * The page a tab is served at.
 * @param tab - The tab being asked about.
 * @returns Its route, which is the converter for a tab the table does not name.
 */
export function routeForTab(tab: TabId): RouteDefinition {
  for (const route of ROUTES) {
    if (route.tab === tab) return route;
  }
  return HOME_ROUTE;
}
