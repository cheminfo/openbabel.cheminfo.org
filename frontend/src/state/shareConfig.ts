/**
 * What one link to this site can say beyond the page it opens.
 *
 * `?embed` drops the chrome so the converter can be framed in a course page;
 * `?hide=` switches parts off by name; `?input=` opens the tool on the way the
 * structure is given. This module is the only place that knows those names — a
 * component asks `isHidden(key)` and never reads the address itself.
 */

import type {
  ShareConfig,
  ShareParamCodec,
  ShareVocabulary,
} from 'react-cheminfo/core';
import { enumParam } from 'react-cheminfo/core';

/** The ways a structure is given to the converter. */
export const INPUT_MODES = ['text', 'draw', 'file'] as const;

export type InputMode = (typeof INPUT_MODES)[number];

/** How the converter opens when a link asks for no other way. */
export const DEFAULT_INPUT_MODE: InputMode = 'text';

/**
 * The vocabulary of this site's links: the parts an embedder can switch off,
 * and the one choice they can preset.
 *
 * Each part is named positively — the dialog shows a ticked box for a part that
 * stays visible — and its description says what switching it off does, for the
 * person building the link rather than for the visitor.
 */
export const SHARE_VOCABULARY = {
  parts: [
    {
      key: 'options',
      label: 'Conversion options',
      description:
        'Hiding it fixes hydrogens, pH and coordinates at whatever the link carries.',
    },
    {
      key: 'help',
      label: 'Help panel',
      description:
        'Hiding it removes the notes on what the options do, for a page that explains them itself.',
    },
    {
      key: 'preview',
      label: 'Structure preview',
      description:
        'Hiding it leaves the converted text alone, without the 2D or 3D drawing of it.',
    },
    {
      key: 'log',
      label: 'OpenBabel log',
      description:
        'Hiding it removes what the converter wrote to stderr; errors still surface on the output.',
      // Inside a host page the log is noise the course did not ask for.
      hiddenByDefault: true,
    },
  ],
  params: {
    input: enumParam(INPUT_MODES, DEFAULT_INPUT_MODE),
  },
} as const satisfies ShareVocabulary<{ input: ShareParamCodec<InputMode> }>;

/** The parts a link can switch off, as `?hide=` names them. */
export type HideKey = (typeof SHARE_VOCABULARY)['parts'][number]['key'];

/** The configuration one link carries, once every value has been read. */
export type OpenBabelShareConfig = ShareConfig<
  (typeof SHARE_VOCABULARY)['params']
>;
