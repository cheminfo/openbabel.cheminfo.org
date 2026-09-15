import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { siteFiles } from './vite.siteFiles.ts';

// Derived from the project creation date (2022-08-08): 2·08·08 gives 20808.
// The dev server sits one port above the backend so a single value drives both.
const backendPort = Number(process.env.PORT ?? 20_808);
const devServerPort = Number(process.env.VITE_PORT ?? backendPort + 1);

export default defineConfig({
  plugins: [react(), siteFiles()],
  build: {
    target: 'esnext',
  },
  server: {
    port: devServerPort,
    // Fail loudly instead of drifting to the next free port, which would leave
    // the proxy target, the dev script and the README disagreeing.
    strictPort: true,
    proxy: {
      '/v1': `http://localhost:${backendPort}`,
      '/docs': `http://localhost:${backendPort}`,
    },
  },
  preview: {
    port: devServerPort,
    strictPort: true,
  },
});
