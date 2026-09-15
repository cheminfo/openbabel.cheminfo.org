import { Button, Card, Tab, Tabs, TextArea } from '@blueprintjs/core';
import { useSignals } from '@preact/signals-react/runtime';
import { useState } from 'react';

import { data, loadInputFile, setInput } from '../../../state/data.ts';
import type { InputMode } from '../../../state/shareConfig.ts';
import { setInputMode, view } from '../../../state/view.ts';

import DrawPanel from './DrawPanel.tsx';
import FilePanel from './FilePanel.tsx';
import TextAreaDialog from './TextAreaDialog.tsx';

/**
 * Input card with three tabs: type/paste the structure, draw it, or load a
 * file. Files (e.g. .cdxml from ChemDraw) can also be dropped anywhere on the
 * card.
 * @returns The input panel component.
 */
export default function InputPanel() {
  useSignals();
  return (
    <Card
      className="input-card"
      style={{ display: 'flex', flexDirection: 'column' }}
      onDrop={handleDrop}
      onDragOver={(event) => event.preventDefault()}
    >
      <Tabs
        id="input-mode"
        selectedTabId={view.inputMode.value}
        onChange={(tabId) => setInputMode(tabId as InputMode)}
        renderActiveTabPanelOnly
      >
        <Tab id="text" title="Text input" panel={<TextPanel />} />
        <Tab id="draw" title="Draw a molecule" panel={<DrawPanel />} />
        <Tab id="file" title="Load a file" panel={<FilePanel />} />
      </Tabs>
    </Card>
  );
}

function handleDrop(event: React.DragEvent) {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (!file) return;
  void loadInputFile(file).then(() => setInputMode('file'));
}

function TextPanel() {
  useSignals();
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          icon="maximize"
          text="Expand"
          size="small"
          variant="minimal"
          onClick={() => setIsExpanded(true)}
        />
      </div>
      <TextArea
        fill
        value={data.input.value}
        onChange={(event) => setInput(event.target.value)}
        wrap="off"
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        style={{
          flex: 1,
          minHeight: 380,
          fontFamily: 'monospace',
          fontSize: 12,
          whiteSpace: 'pre',
          overflow: 'auto',
        }}
      />
      <TextAreaDialog
        title="Input"
        isOpen={isExpanded}
        onClose={() => setIsExpanded(false)}
        value={data.input.value}
        onChange={setInput}
      />
    </>
  );
}
