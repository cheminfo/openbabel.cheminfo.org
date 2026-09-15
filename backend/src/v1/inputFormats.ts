import type { FastifyTyped } from '../types.ts';

import { FormatListSchema } from './utils/formatSchemas.ts';
import formatsToJSON from './utils/formatsToJSON.ts';
import getInputFormats from './utils/getInputFormats.ts';

/**
 * Register the route listing every format the service can read.
 * @param fastify - The Fastify instance to register routes on.
 */
export default function inputFormats(fastify: FastifyTyped): void {
  fastify.route({
    url: '/v1/inputFormats',
    method: ['GET', 'POST'],
    schema: {
      tags: ['formats'],
      summary: 'List of input formats',
      description: 'Get the list of all the allowed input formats',
      response: { 200: FormatListSchema },
    },
    handler: () => ({ result: formatsToJSON(getInputFormats()), log: '' }),
  });
}
