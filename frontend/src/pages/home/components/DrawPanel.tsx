import { Molecule } from 'openchemlib';
import { useState } from 'react';
import { StructureEditor } from 'react-cheminfo/structure';

import { data, setInputFromMolfile } from '../../../state/data.ts';
import { preferences } from '../../../state/preferences.ts';

/**
 * Structure editor to draw a molecule instead of typing it. When opened, it
 * is initialized from the current input if it is a valid SMILES or molfile.
 * @returns The draw panel component.
 */
export default function DrawPanel() {
  const [initial] = useState(readInitialStructure);
  // Undebounced, so a Convert clicked right after a stroke sees that stroke.
  return (
    <StructureEditor
      style={{ flex: 1 }}
      minHeight={380}
      debounce={0}
      value={initial.value}
      inputFormat={initial.format}
      onChange={(change) => setInputFromMolfile(change.molfile)}
    />
  );
}

interface InitialStructure {
  value: string;
  format: 'molfile' | 'smiles';
}

function readInitialStructure(): InitialStructure {
  const value = data.input.peek();
  const format = preferences.inputFormat.peek();
  try {
    if (format.startsWith('smi')) {
      Molecule.fromSmiles(value);
      return { value, format: 'smiles' };
    }
    if (format.startsWith('mol -- ')) {
      Molecule.fromMolfile(value);
      return { value, format: 'molfile' };
    }
  } catch {
    // not parseable: start with an empty editor
  }
  return { value: '', format: 'smiles' };
}
