import { Type } from '@sinclair/typebox';

import type { FastifyTyped } from '../types.ts';

import getInputFormats from './utils/getInputFormats.ts';
import getOutputFormats from './utils/getOutputFormats.ts';
import runBabel from './utils/runBabel.ts';

// Every field is optional here because the same route takes its parameters
// either as a query string or as a multipart body, and a body carries none of
// them in the query. What is actually required is checked in the handler, so a
// POST is not refused for a query string it was never going to send.
const ConvertParamsSchema = Type.Object({
  input: Type.Optional(
    Type.String({ description: 'The structure to convert.' }),
  ),
  inputFormat: Type.Optional(
    Type.String({
      description: 'Input format',
      enum: getInputFormats(),
    }),
  ),
  outputFormat: Type.Optional(
    Type.String({
      description: 'Output format',
      enum: getOutputFormats(),
    }),
  ),
  hydrogens: Type.Optional(
    Type.String({
      description:
        'Specify if hydrogens should not be touched (leave empty), deleted or added',
      enum: ['', 'Delete', 'Add'],
    }),
  ),
  coordinates: Type.Optional(
    Type.String({
      description:
        'Specify if 3D coordinates should not be touched (leave empty), calculate for 2D or 3D',
      enum: ['', '2D', '3D'],
    }),
  ),
  ph: Type.Optional(
    Type.String({
      description:
        'pH at which the molecule should be protonated, leave empty for no change',
    }),
  ),
});

/**
 * Register the conversion route.
 * @param fastify - The Fastify instance to register routes on.
 */
export default function convert(fastify: FastifyTyped): void {
  fastify.route({
    url: '/v1/convert',
    method: ['GET', 'POST'],
    schema: {
      tags: ['convert'],
      summary: 'Convert chemical file formats',
      description:
        'Convert between various chemical file formats using OpenBabel',
      consumes: ['multipart/form-data'],
      querystring: ConvertParamsSchema,
      response: {
        200: Type.Object({
          result: Type.String({ description: 'The converted structure.' }),
          log: Type.String({ description: 'What OpenBabel wrote to stderr.' }),
        }),
        400: Type.Object({ error: Type.String() }),
      },
    },
    handler: async (request, reply) => {
      const params = readParams(request.body ?? request.query);
      if (!params.inputFormat || !params.outputFormat) {
        return reply
          .code(400)
          .send({ error: 'inputFormat and outputFormat are required' });
      }

      const flags: string[] = [];
      if (params.hydrogens === 'Delete') flags.push('-d');
      if (params.hydrogens === 'Add') flags.push('-h');
      if (params.ph) flags.push(`-p ${params.ph}`);
      if (params.coordinates === '2D') flags.push('--gen2D');
      if (params.coordinates === '3D') flags.push('--gen3D');
      flags.push(
        `-i${params.inputFormat.replace(/ .*/, '')}`,
        `-o${params.outputFormat.replace(/ .*/, '')}`,
      );

      try {
        const { stdout, stderr } = await runBabel(flags, params.input);
        return { result: stdout, log: stderr };
      } catch (error) {
        if (hasStatusCode(error)) throw error;
        return { result: '', log: String(error) };
      }
    },
  });
}

interface ConvertParams {
  input?: string;
  inputFormat?: string;
  outputFormat?: string;
  hydrogens?: string;
  coordinates?: string;
  ph?: string;
}

/**
 * The conversion parameters, however they arrived. A multipart body attaches
 * each field as an object carrying its `value`, where a query string carries
 * the string itself, so both are read back to plain strings here.
 * @param source - The request body or its query string.
 * @returns The parameters, as strings.
 */
function readParams(source: unknown): ConvertParams {
  const fields = (source ?? {}) as Record<string, unknown>;
  const params: Record<string, string> = {};
  for (const [key, field] of Object.entries(fields)) {
    const value =
      typeof field === 'object' && field !== null && 'value' in field
        ? field.value
        : field;
    if (typeof value === 'string') params[key] = value;
  }
  return params;
}

function hasStatusCode(error: unknown): error is { statusCode: number } {
  return typeof error === 'object' && error !== null && 'statusCode' in error;
}
