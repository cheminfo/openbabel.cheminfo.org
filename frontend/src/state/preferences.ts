/**
 * What the visitor chose and expects to find again: the two formats and the
 * three conversion options.
 *
 * Stored under the family's versioned bucket, which merges what is stored into
 * the defaults field by field — so a preference added later lands as its
 * default on a visitor who stored the older shape — and never throws at a
 * browser with storage switched off or full.
 */

import { effect, signal } from '@preact/signals-react';
import { persistBucket } from 'react-cheminfo/core';

export type Coordinates = '' | '2D' | '3D';
export type Hydrogens = '' | 'Add' | 'Delete';

/** The format a drawn structure is handed to the converter as. */
export const MOLFILE_FORMAT = 'mol -- MDL MOL format';

interface StoredPreferences {
  inputFormat: string;
  outputFormat: string;
  coordinates: Coordinates;
  hydrogens: Hydrogens;
  ph: string;
}

const bucket = persistBucket<StoredPreferences>({
  key: 'openbabel:preferences',
  defaults: {
    inputFormat: 'smi -- SMILES format',
    outputFormat: MOLFILE_FORMAT,
    coordinates: '',
    hydrogens: '',
    ph: '',
  },
});

const stored = bucket.read().value;

export const preferences = {
  inputFormat: signal(stored.inputFormat),
  outputFormat: signal(stored.outputFormat),
  coordinates: signal<Coordinates>(stored.coordinates),
  hydrogens: signal<Hydrogens>(stored.hydrogens),
  ph: signal(stored.ph),
};

effect(() => {
  bucket.write({
    inputFormat: preferences.inputFormat.value,
    outputFormat: preferences.outputFormat.value,
    coordinates: preferences.coordinates.value,
    hydrogens: preferences.hydrogens.value,
    ph: preferences.ph.value,
  });
});
