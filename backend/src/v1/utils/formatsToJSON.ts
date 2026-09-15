export interface FormatEntry {
  /** Short format identifier, e.g. `smi`. */
  name: string;
  /** What the format is called, e.g. `SMILES format`. */
  description: string;
  /** The label the convert endpoint takes, e.g. `smi -- SMILES format`. */
  text: string;
}

/**
 * Split the lines `obabel -L formats` prints into named entries.
 * @param formats - One line per format, as the binary writes them.
 * @returns The same formats, each split into its identifier and its name.
 */
export default function formatsToJSON(
  formats: readonly string[],
): FormatEntry[] {
  return formats.map((format) => {
    const parts = format.split(' -- ');
    return {
      name: parts[0] ?? '',
      description: parts[1] ?? '',
      text: format,
    };
  });
}
