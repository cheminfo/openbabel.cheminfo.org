import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { RouteMeta } from 'react-cheminfo/core';

import { FALLBACK_ROUTES } from '../site.ts';

/**
 * Every address the frontend routes itself, each with the title and the
 * description it is indexed under. The frontend build writes them next to the
 * page, because the app's own route table is the one thing that knows them.
 * @param root - Where the built frontend is.
 * @returns The routes, the home page first, or the pages that always exist
 * when no build has written them.
 */
export function readRoutes(root: string): RouteMeta[] {
  try {
    const parsed: unknown = JSON.parse(
      readFileSync(join(root, 'routes.json'), 'utf8'),
    );
    if (Array.isArray(parsed) && parsed.every(isRouteMeta)) return parsed;
  } catch {
    // No build, or a file we did not write: the pages below always exist.
  }
  return [...FALLBACK_ROUTES];
}

function isRouteMeta(value: unknown): value is RouteMeta {
  if (typeof value !== 'object' || value === null) return false;
  const route = value as Record<string, unknown>;
  return (
    typeof route.path === 'string' &&
    route.path.startsWith('/') &&
    typeof route.title === 'string' &&
    typeof route.description === 'string'
  );
}
