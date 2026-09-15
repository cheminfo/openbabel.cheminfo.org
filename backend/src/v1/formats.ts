import { Type } from '@sinclair/typebox';

import type { FastifyTyped } from '../types.ts';

import { FormatEntrySchema } from './utils/formatSchemas.ts';
import formatsToJSON from './utils/formatsToJSON.ts';
import getInputFormats from './utils/getInputFormats.ts';
import getOutputFormats from './utils/getOutputFormats.ts';

/**
 * Register the route listing what the service reads and what it writes.
 * @param fastify - The Fastify instance to register routes on.
 */
export default function formats(fastify: FastifyTyped): void {
  fastify.get(
    '/v1/formats',
    {
      schema: {
        tags: ['formats'],
        summary: 'List of input and output formats',
        description: 'Get the list of all the allowed input and output formats',
        response: {
          200: Type.Object({
            result: Type.Object({
              input: Type.Array(FormatEntrySchema),
              output: Type.Array(FormatEntrySchema),
            }),
            logs: Type.String(),
          }),
        },
      },
    },
    () => ({
      result: {
        input: formatsToJSON(getInputFormats()),
        output: formatsToJSON(getOutputFormats()),
      },
      logs: '',
    }),
  );
}
