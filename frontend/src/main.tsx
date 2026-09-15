/**
 * Browser entry point: the stylesheets, the React root, and nothing else.
 *
 * Blueprint's CSS is imported here rather than in a component so it is loaded
 * once, before anything renders, and so `index.css` — which imports the
 * family's chrome — always comes last.
 */

import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/select/lib/css/blueprint-select.css';
import './index.css';

import { FocusStyleManager } from '@blueprintjs/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';

// A focus ring on every click makes the editor look broken; on Tab it is the
// only thing telling a keyboard user where they are.
FocusStyleManager.onlyShowFocusOnTabs();

const container = document.querySelector('#root');
if (container === null) {
  throw new Error(
    'openbabel.cheminfo.org cannot start: index.html has no <div id="root"></div> to mount into.',
  );
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
