import type { FastifyTyped } from '../types.ts';

import convert from './convert.ts';
import formats from './formats.ts';
import inputFormats from './inputFormats.ts';
import outputFormats from './outputFormats.ts';

/**
 * Register every route of the conversion API.
 * @param fastify - The Fastify instance to register routes on.
 */
export default async function v1(fastify: FastifyTyped) {
  convert(fastify);
  inputFormats(fastify);
  outputFormats(fastify);
  formats(fastify);
}
