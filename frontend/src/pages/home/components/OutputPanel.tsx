import { Button, ButtonGroup, Card, H5, TextArea } from '@blueprintjs/core';
import { useSignals } from '@preact/signals-react/runtime';
import { useState } from 'react';
import { downloadText, sanitizeFileName } from 'react-cheminfo/core';
import { CopyButton, useIsHidden } from 'react-cheminfo/ui';

import { formatExtension } from '../../../api/openbabel.ts';
import { data } from '../../../state/data.ts';
import { preferences } from '../../../state/preferences.ts';

import TextAreaDialog from './TextAreaDialog.tsx';
import OutputPreview from './preview/OutputPreview.tsx';
import { getPreviewCapability } from './preview/previewFormats.ts';

/**
 * Read-only view of the conversion result with expand and download buttons.
 * @returns The output panel component.
 */
export default function OutputPanel() {
  useSignals();
  const [isExpanded, setIsExpanded] = useState(false);
  const [mode, setMode] = useState<'text' | 'preview'>('text');
  const isHidden = useIsHidden();
  const output = data.output.value;
  const outputFormat = preferences.outputFormat.value;
  // A link that switches the preview off must not mount the 3D canvas at all,
  // so the capability itself is withdrawn rather than only the panel.
  const canPreview =
    !isHidden('preview') &&
    Boolean(output) &&
    getPreviewCapability(outputFormat) !== null;
  const showPreview = mode === 'preview' && canPreview;

  function handleDownload() {
    downloadText(
      output,
      sanitizeFileName(`structure.${formatExtension(outputFormat)}`),
    );
  }

  return (
    <Card style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div className="output-header">
        <H5 style={{ margin: 0 }}>Output</H5>
        <div className="output-header-actions">
          <ButtonGroup>
            <Button
              active={mode === 'text'}
              text="Text"
              onClick={() => setMode('text')}
            />
            <Button
              active={mode === 'preview'}
              text="Preview"
              disabled={!canPreview}
              onClick={() => setMode('preview')}
            />
          </ButtonGroup>
          <CopyButton
            content={output}
            label="Copy"
            title="Copy the output"
            disabled={!output}
          />
          <Button
            icon="maximize"
            text="Expand"
            disabled={!output}
            onClick={() => setIsExpanded(true)}
          />
          <Button
            icon="download"
            text="Download"
            disabled={!output}
            onClick={handleDownload}
          />
        </div>
      </div>
      <TextAreaDialog
        title="Output"
        isOpen={isExpanded}
        onClose={() => setIsExpanded(false)}
        value={output}
      />
      {showPreview ? (
        <OutputPreview output={output} outputFormat={outputFormat} />
      ) : (
        <TextArea
          fill
          readOnly
          value={output}
          wrap="off"
          spellCheck={false}
          style={{
            flex: 1,
            minHeight: 200,
            fontFamily: 'monospace',
            fontSize: 12,
            whiteSpace: 'pre',
            overflow: 'auto',
          }}
        />
      )}
    </Card>
  );
}
