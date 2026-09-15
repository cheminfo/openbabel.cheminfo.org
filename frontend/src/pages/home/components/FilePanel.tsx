import { Icon, Tag } from '@blueprintjs/core';
import { useSignals } from '@preact/signals-react/runtime';
import { useRef, useState } from 'react';

import { data, loadInputFile } from '../../../state/data.ts';
import { preferences } from '../../../state/preferences.ts';

/**
 * Drop zone / file picker to load a structure file (e.g. .cdxml, .mol, .pdb).
 * The input format is selected from the file extension.
 * @returns The file panel component.
 */
export default function FilePanel() {
  useSignals();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileName = data.inputFileName.value;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => fileInputRef.current?.click()}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          fileInputRef.current?.click();
        }
      }}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragOver(false);
        const file = event.dataTransfer.files[0];
        if (file) void loadInputFile(file);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      className={isDragOver ? 'file-drop-zone drag-over' : 'file-drop-zone'}
    >
      <input
        ref={fileInputRef}
        type="file"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void loadInputFile(file);
          event.target.value = '';
        }}
      />
      <Icon icon="cloud-upload" size={40} className="file-drop-icon" />
      <p style={{ margin: 0, fontSize: 16 }}>
        Drop a file here, or click to browse
      </p>
      <p style={{ margin: 0, color: 'var(--text-muted)' }}>
        e.g. .cdxml, .mol, .pdb — the input format is selected from the file
        extension
      </p>
      {fileName && (
        <Tag intent="success" size="large" icon="document">
          {fileName} — format: {preferences.inputFormat.value}
        </Tag>
      )}
    </div>
  );
}
