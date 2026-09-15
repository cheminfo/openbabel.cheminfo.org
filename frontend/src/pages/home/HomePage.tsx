import { useEffect } from 'react';
import { PagePart } from 'react-cheminfo/ui';

import { loadFormats } from '../../state/data.ts';

import HelpPanel from './components/HelpPanel.tsx';
import InputPanel from './components/InputPanel.tsx';
import LogPanel from './components/LogPanel.tsx';
import OptionsPanel from './components/OptionsPanel.tsx';
import OutputPanel from './components/OutputPanel.tsx';

/**
 * The converter: the structure going in, the options applied to it, and what
 * comes out. Each column beside the input is a part a shared link may switch
 * off, so a course page can frame the converter alone.
 * @returns The converter page.
 */
export default function HomePage() {
  useEffect(() => {
    void loadFormats();
  }, []);

  return (
    <div className="converter-grid">
      <InputPanel />
      <div className="converter-column">
        <PagePart part="options">
          <OptionsPanel />
        </PagePart>
        <PagePart part="help">
          <HelpPanel />
        </PagePart>
      </div>
      <div className="converter-column">
        <OutputPanel />
        <PagePart part="log">
          <LogPanel />
        </PagePart>
      </div>
    </div>
  );
}
