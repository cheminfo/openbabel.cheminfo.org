import type { FastifyTyped } from '../types.ts';

import { FormatListSchema } from './utils/formatSchemas.ts';
import formatsToJSON from './utils/formatsToJSON.ts';
import getOutputFormats from './utils/getOutputFormats.ts';

/**
 * Register the route listing every format the service can write.
 * @param fastify - The Fastify instance to register routes on.
 */
export default function outputFormats(fastify: FastifyTyped): void {
  fastify.route({
    url: '/v1/outputFormats',
    method: ['GET', 'POST'],
    schema: {
      tags: ['formats'],
      summary: 'List of output formats',
      description: 'Get the list of all the allowed output formats',
      response: { 200: FormatListSchema },
    },
    handler: () => ({ result: formatsToJSON(getOutputFormats()), log: '' }),
  });
}
