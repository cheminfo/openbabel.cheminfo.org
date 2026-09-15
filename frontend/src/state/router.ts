/**
 * Routing by path, through the History API.
 *
 * ```
 * /            the converter
 * /about       what it is built on, and its licence
 * ```
 *
 * A `#` never reaches the server and is dropped by half the tools that pass
 * links around, so every address here is a real path the server answers a page
 * for. The string ↔ route mapping itself is `createTabRouter`; this module only
 * says where the address is read and what happens when it changes.
 *
 * `adoptLegacyHash` keeps the addresses the site handed out before it routed by
 * path — `#draw`, `#file` — landing on the converter rather than nowhere.
 */

import { effect } from '@preact/signals-react';
import { createTabRouter, startDocumentMeta } from 'react-cheminfo/core';

import type { TabId } from '../routes.ts';
import { ROUTES, SITE_ID, SITE_URL } from '../routes.ts';

import { shareAddress } from './shareConfig.ts';
import { view } from './view.ts';

/** The one place that knows how this site's addresses are written. */
export const router = createTabRouter<TabId>({
  tabs: ROUTES.map((route) => ({ id: route.tab, path: route.path })),
  home: 'converter',
  mode: 'path',
  adoptLegacyHash: true,
});

/**
 * The address of the page on screen, without the query string: what the
 * canonical link and the title are looked up under.
 * @returns The path, e.g. `/about`.
 */
export function currentPath(): string {
  return router.format({ tab: view.tab.value });
}

/**
 * Move to a page, carrying the share configuration and the tool inputs the
 * address already holds, so an embed stays configured across clicks.
 * @param tab - The page to open.
 */
export function navigate(tab: TabId): void {
  const address = shareAddress(
    router.format({ tab }),
    globalThis.location.search,
    view.share.value,
  );
  globalThis.history.pushState(null, '', address);
  view.tab.value = tab;
}

/**
 * Point the view at the address the browser is showing.
 *
 * An address the site does not know opens the converter, as the server's own
 * fallback does, rather than showing nothing.
 */
export function applyCurrentAddress(): void {
  const { pathname, search } = globalThis.location;
  view.tab.value = router.parse(`${pathname}${search}`).tab;
}

/**
 * Follow the browser's own navigation, and keep the tab title and the canonical
 * link in step with the page on screen.
 * @returns The function that stops both.
 */
export function startRouter(): () => void {
  applyCurrentAddress();

  globalThis.addEventListener('popstate', applyCurrentAddress);
  const stopTitling = startDocumentMeta({
    site: SITE_ID,
    routes: ROUTES,
    origin: SITE_URL,
    url: currentPath,
    follow: effect,
  });

  return () => {
    stopTitling();
    globalThis.removeEventListener('popstate', applyCurrentAddress);
  };
}
