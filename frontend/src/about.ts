/**
 * What this site says about itself on `/about`: one sentence on what it is,
 * what a visitor can do here, the borrowed work it stands on, and where to
 * report a problem.
 *
 * The shape is the family's, and `aboutProblems` checks it — a `what` longer
 * than a sentence, or a `can` list shorter than three, is refused rather than
 * rendered.
 */

import type { AboutContent, CitedWork } from 'react-cheminfo/core';
import { PLATFORM_WORK } from 'react-cheminfo/core';

import { REPOSITORY, SITE_ID } from './routes.ts';

/**
 * The work a reader publishing a structure converted here owes: Open Babel,
 * which does every conversion.
 */
export const CITED_WORKS: readonly CitedWork[] = [
  {
    reference: {
      authors: [
        { given: 'N. M.', family: "O'Boyle" },
        { given: 'M.', family: 'Banck' },
        { given: 'C. A.', family: 'James' },
        { given: 'C.', family: 'Morley' },
        { given: 'T.', family: 'Vandermeersch' },
        { given: 'G. R.', family: 'Hutchison' },
      ],
      title: 'Open Babel: An open chemical toolbox',
      journal: 'Journal of Cheminformatics',
      journalAbbreviation: 'J. Cheminform.',
      year: 2011,
      volume: '3',
      issue: '1',
      firstPage: '33',
      lastPage: '33',
      doi: '10.1186/1758-2946-3-33',
      publisher: 'Springer Nature',
    },
    what: 'Open Babel',
    note: 'Cite it whenever a structure converted on this page reaches a publication.',
  },
];

export const ABOUT: AboutContent = {
  siteId: SITE_ID,
  what: 'A converter between the chemical file formats Open Babel reads and writes.',
  paragraphs: [
    'Open Babel speaks well over a hundred chemical formats, but reaching it normally means installing it and learning its command line. This site puts the same conversion behind a page: give it a structure, pick what you want out, and read the result — with the log the command would have printed, because a conversion that quietly drops a stereocentre is worth seeing.',
    'Everything a click does here, a URL does too: the conversion runs behind a small HTTP API, documented at /docs, that takes the same formats and options. The tool is the API with a face on it, so a script and a browser get the same answer.',
  ],
  can: [
    'Paste, draw or drop a structure and convert it to any format Open Babel writes.',
    'Add or delete hydrogens, protonate at a given pH, and generate 2D or 3D coordinates.',
    'See the converted structure drawn in 2D or turned in 3D before you take it away.',
    'Read the log Open Babel wrote, so a partial or refused conversion says why.',
    'Call the same conversion from a script through the documented HTTP API.',
  ],
  credits: [
    'openbabel',
    'openchemlib',
    'react-ocl',
    'molstar',
    'fastify',
    'react',
    'blueprint',
    'react-cheminfo',
    'vite',
  ],
  cite: [PLATFORM_WORK, ...CITED_WORKS],
  repository: REPOSITORY,
};
