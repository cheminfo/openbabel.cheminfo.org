import type { ReactElement } from 'react';
import { AboutPage } from 'react-cheminfo/ui';

import { ABOUT } from '../about.ts';

/**
 * What this site is, what it stands on, and how to report a problem — a routed
 * page rather than a dialog, so it is indexed, linkable and printable.
 * @returns The About page.
 */
export function About(): ReactElement {
  return <AboutPage content={ABOUT} />;
}
