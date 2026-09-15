/**
 * What the visitor is looking at: which page, how the structure is being given,
 * whether a conversion is running, and the configuration the link they opened
 * carries.
 *
 * Session-only: nothing here is persisted. Which page an address names is
 * `router.ts`'s business; the input mode is written back into the address.
 */

import { signal } from '@preact/signals-react';
import {
  isHidden as isPartHidden,
  parseShareConfig,
} from 'react-cheminfo/core';

import type { TabId } from '../routes.ts';

import type { InputMode, OpenBabelShareConfig } from './shareConfig.ts';
import { SHARE_VOCABULARY, shareAddress } from './shareConfig.ts';

const share = signal<OpenBabelShareConfig>(readShareConfig());

/** Ephemeral, cross-component view state. */
export const view = {
  /** The page on screen. */
  tab: signal<TabId>('converter'),
  /** How the structure is being given: typed, drawn, or dropped as a file. */
  inputMode: signal<InputMode>(share.value.params.input),
  /** Whether a conversion is in flight. */
  isConverting: signal(false),
  /**
   * Read once from the address the page opened on, and re-applied to every
   * address the app writes afterwards, so a reload — or a link copied out of
   * the iframe — restores the same configuration.
   */
  share,
};

/**
 * Switch between typing, drawing and dropping the input. The choice travels in
 * the address, rewritten in place, so a link hands someone the converter
 * already on the right tab.
 * @param mode - Input mode to activate.
 */
export function setInputMode(mode: InputMode): void {
  view.inputMode.value = mode;
  view.share.value = {
    ...view.share.value,
    params: { ...view.share.value.params, input: mode },
  };
  const { pathname, search, hash } = globalThis.location;
  globalThis.history.replaceState(
    globalThis.history.state,
    '',
    `${shareAddress(pathname, search, view.share.value)}${hash}`,
  );
}

/**
 * Whether the link the page was opened with switches a part off.
 *
 * Hidden means hidden, not disabled: the value a hidden control carries still
 * applies, so an embedder can preset what a visitor may not change.
 * @param key - The part, as `?hide=` names it.
 * @returns True when the part must not be rendered.
 */
export function isHidden(key: string): boolean {
  return isPartHidden(view.share.value, key);
}

function readShareConfig(): OpenBabelShareConfig {
  const search = globalThis.location?.search ?? '';
  return parseShareConfig(search, SHARE_VOCABULARY);
}
