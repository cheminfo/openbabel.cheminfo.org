/**
 * The whole state of the app, in three buckets: what is on screen, what it is
 * about, and what the visitor chose. Components read the leaves directly —
 * `state.view.tab.value` — and call the actions below; nothing is drilled
 * through props.
 */

import { data } from './data.ts';
import { preferences } from './preferences.ts';
import { view } from './view.ts';

export const state = { view, data, preferences };

export type { InputMode, OpenBabelShareConfig } from './shareConfig.ts';
export { SHARE_VOCABULARY } from './shareConfig.ts';
export {
  loadFormats,
  loadInputFile,
  runConversion,
  setInput,
  setInputFromMolfile,
} from './data.ts';
export { MOLFILE_FORMAT } from './preferences.ts';
export { navigate, router, startRouter } from './router.ts';
export { isHidden, setInputMode } from './view.ts';
