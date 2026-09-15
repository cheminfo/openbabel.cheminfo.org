import { existsSync } from 'node:fs';
import { join } from 'node:path';

import buildApp from './app.ts';
import { DEFAULT_PORT } from './constants.ts';
import { parseTrustProxy } from './utils/parseTrustProxy.ts';

const frontendDist = join(import.meta.dirname, '../../frontend/dist');

const fastify = await buildApp({
  trustProxy: parseTrustProxy(process.env.TRUST_PROXY),
  trackingScript: process.env.TRACKING_SCRIPT,
  frontendRoot: existsSync(frontendDist) ? frontendDist : undefined,
  siteUrl: process.env.SITE_URL,
  logger: true,
});

const port = Number(process.env.PORT) || DEFAULT_PORT;
await fastify.listen({ port, host: process.env.HOST ?? '0.0.0.0' });
