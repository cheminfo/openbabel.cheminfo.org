import { Type } from '@sinclair/typebox';

/** One entry of the two format lists, as a response schema. */
export const FormatEntrySchema = Type.Object({
  name: Type.String({ description: 'Short identifier, e.g. `smi`.' }),
  description: Type.String({
    description: 'What the format is called, e.g. `SMILES format`.',
  }),
  text: Type.String({
    description: 'The label convert takes, e.g. `smi -- SMILES format`.',
  }),
});

/** What a format list route answers with. */
export const FormatListSchema = Type.Object({
  result: Type.Array(FormatEntrySchema),
  log: Type.String(),
});
