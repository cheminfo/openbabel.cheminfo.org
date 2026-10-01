import {
  Button,
  Card,
  FormGroup,
  H5,
  SegmentedControl,
} from '@blueprintjs/core';
import { useSignals } from '@preact/signals-react/runtime';
import { NumberInput } from 'react-cheminfo/ui';

import { data, runConversion } from '../../../state/data.ts';
import type { Coordinates, Hydrogens } from '../../../state/preferences.ts';
import { preferences } from '../../../state/preferences.ts';
import { view } from '../../../state/view.ts';

import FormatSelect from './FormatSelect.tsx';

/**
 * Conversion options: formats, coordinates, hydrogens, pH and the convert button.
 * @returns The options panel component.
 */
export default function OptionsPanel() {
  useSignals();
  const formats = data.formats.value;
  return (
    <Card>
      <H5>Options</H5>
      <FormGroup label="Input format">
        <FormatSelect
          formats={formats ? formats.input : null}
          value={preferences.inputFormat.value}
          onChange={(text) => {
            preferences.inputFormat.value = text;
          }}
        />
      </FormGroup>
      <FormGroup label="Output format">
        <FormatSelect
          formats={formats ? formats.output : null}
          value={preferences.outputFormat.value}
          onChange={(text) => {
            preferences.outputFormat.value = text;
          }}
        />
      </FormGroup>
      <FormGroup
        label="Generate coordinates"
        helperText="Generate 2D or 3D coordinates before converting"
      >
        <SegmentedControl
          fill
          value={preferences.coordinates.value}
          onValueChange={(value) => {
            preferences.coordinates.value = value as Coordinates;
          }}
          options={[
            { label: 'None', value: '' },
            { label: '2D', value: '2D' },
            { label: '3D', value: '3D' },
          ]}
        />
      </FormGroup>
      <FormGroup label="Add / delete hydrogens">
        <SegmentedControl
          fill
          value={preferences.hydrogens.value}
          onValueChange={(value) => {
            preferences.hydrogens.value = value as Hydrogens;
          }}
          options={[
            { label: 'No change', value: '' },
            { label: 'Add', value: 'Add' },
            { label: 'Delete', value: 'Delete' },
          ]}
        />
      </FormGroup>
      <FormGroup
        label="pH to add hydrogens"
        helperText="pH at which the molecule should be protonated, leave empty for no change"
      >
        <NumberInput
          allowEmpty
          fill
          step={0.1}
          min={0}
          max={14}
          value={
            preferences.ph.value === ''
              ? undefined
              : Number(preferences.ph.value)
          }
          ariaLabel="pH to add hydrogens at"
          onChange={(value) => {
            preferences.ph.value = value === undefined ? '' : String(value);
          }}
        />
      </FormGroup>
      <Button
        fill
        intent="primary"
        text="Convert"
        loading={view.isConverting.value}
        disabled={!formats}
        onClick={() => void runConversion()}
      />
    </Card>
  );
}
