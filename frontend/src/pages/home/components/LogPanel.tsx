import { Card, H5 } from '@blueprintjs/core';
import { useSignals } from '@preact/signals-react/runtime';
import { CodeBlock } from 'react-cheminfo/ui';

import { data } from '../../../state/data.ts';

/**
 * OpenBabel log output of the last conversion.
 * @returns The log panel component.
 */
export default function LogPanel() {
  useSignals();
  const log = data.log.value;
  return (
    <Card>
      <H5>Log</H5>
      <CodeBlock
        className="log-block"
        code={log}
        copyable={log !== ''}
        maxHeight={200}
      />
    </Card>
  );
}
