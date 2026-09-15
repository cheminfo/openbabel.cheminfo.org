import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      include: ['src/**/*.ts'],
      provider: 'v8',
    },
    // Every file here spawns the same external binary, and the conversions are
    // killed after CONVERSION_TIMEOUT_MS. Run the files one after another so a
    // loaded machine cannot make one file's obabel processes time out another's.
    fileParallelism: false,
    snapshotFormat: {
      maxOutputLength: Number.MAX_SAFE_INTEGER,
    },
  },
});
