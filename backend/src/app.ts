import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import type { FastifyReply, FastifyRequest } from 'fastify';
import Fastify from 'fastify';
import {
  PAGE_BODY_MARKER,
  fill,
  injectPageMeta,
  noscriptIndex,
  robotsTxt,
  sitemapXml,
  structuredDataScript,
} from 'react-cheminfo/core';

import healthRoutes from './routes/health.ts';
import { NOSCRIPT_ROUTES, SITE, WHAT_IT_DOES } from './site.ts';
import type { FastifyTyped } from './types.ts';
import { injectTrackingScript } from './utils/injectTrackingScript.ts';
import { readRoutes } from './utils/routes.ts';
import v1 from './v1/v1.ts';

export interface BuildAppOptions {
  /**
   * The reverse proxies whose `X-Forwarded-For` is believed.
   * @default false
   */
  trustProxy?: boolean | string;
  /**
   * Analytics snippet injected at the end of the served page's `<head>`.
   * @default undefined
   */
  trackingScript?: string;
  /**
   * Directory holding the built frontend. When absent, no page is served.
   * @default undefined
   */
  frontendRoot?: string;
  /**
   * Where the site is served from, e.g. `https://openbabel.cheminfo.org`,
   * written into the canonical and social addresses of every page. Unset
   * derives it from the request, which is only right when `trustProxy` names
   * the proxy.
   * @default undefined
   */
  siteUrl?: string;
  /**
   * Whether Fastify logs requests.
   * @default false
   */
  logger?: boolean;
}

/**
 * Build and configure the Fastify application.
 * @param options - Deployment-dependent settings, all optional so tests can
 * build a bare API instance.
 * @returns Configured Fastify instance.
 */
export default async function buildApp(options: BuildAppOptions = {}) {
  const {
    trustProxy = false,
    trackingScript,
    frontendRoot,
    siteUrl,
    logger = false,
  } = options;

  const fastify: FastifyTyped = Fastify({
    logger,
    trustProxy,
  }).withTypeProvider<TypeBoxTypeProvider>();

  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'openbabel.cheminfo.org',
        description: WHAT_IT_DOES,
        version: '1.0.0',
      },
    },
  });
  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: { docExpansion: 'full', deepLinking: false },
  });

  await fastify.register(cors, { origin: '*', maxAge: 86_400 });
  await fastify.register(multipart, { attachFieldsToBody: true });

  await fastify.register(healthRoutes);
  await fastify.register(v1);

  if (frontendRoot) {
    registerFrontend(fastify, frontendRoot, { trackingScript, siteUrl });
  }

  await fastify.ready();
  return fastify;
}

function registerFrontend(
  fastify: FastifyTyped,
  root: string,
  options: { trackingScript?: string; siteUrl?: string },
): void {
  // The built page is a template: the crawl path is the same on every address,
  // so it is written once here, and the head is written per request below.
  const index = fill(
    injectTrackingScript(
      readFileSync(join(root, 'index.html'), 'utf8'),
      options.trackingScript,
    ),
    PAGE_BODY_MARKER,
    noscriptIndex({
      site: SITE,
      routes: NOSCRIPT_ROUTES,
      heading: 'openbabel.cheminfo.org — chemical file format converter',
      intro:
        'Convert a structure between any pair of the formats OpenBabel reads and writes. The converter itself needs JavaScript; the conversion API does not.',
      hrefs: 'relative',
      ecosystem: { taglines: false },
    }),
  );

  const routes = readRoutes(root);
  const originOf = (request: FastifyRequest) =>
    options.siteUrl ?? `${request.protocol}://${request.host}`;

  const sendIndex = (request: FastifyRequest, reply: FastifyReply) => {
    const served = { site: SITE, routes, origin: originOf(request) };
    const page = injectPageMeta(index, { ...served, url: request.url });
    return reply
      .type('text/html; charset=utf-8')
      .send(
        page.replace(
          '</head>',
          `${structuredDataScript({ ...served, description: WHAT_IT_DOES, operatingSystem: 'Any' })}\n</head>`,
        ),
      );
  };

  void fastify.register(fastifyStatic, { root, index: false });

  // `@fastify/static` answers a bare directory with 403 rather than falling
  // through, so the site's own root would never reach the handler below.
  fastify.get('/', { schema: { hide: true } }, sendIndex);
  fastify.get('/index.html', { schema: { hide: true } }, sendIndex);

  fastify.get('/sitemap.xml', { schema: { hide: true } }, (request, reply) =>
    reply
      .type('application/xml; charset=utf-8')
      .send(sitemapXml({ site: SITE, routes, origin: originOf(request) })),
  );

  // Written here rather than kept in `public/` because what it points at moves
  // with the address the site is served at. The API and its documentation are
  // endpoints rather than pages, so they are the only things kept out.
  fastify.get('/robots.txt', { schema: { hide: true } }, (request, reply) =>
    reply.type('text/plain; charset=utf-8').send(
      robotsTxt({ site: SITE, routes, origin: originOf(request) }, [
        { path: '/v1/', comment: 'The conversion API is not a page.' },
        { path: '/docs', comment: 'Nor is its documentation.' },
      ]),
    ),
  );

  fastify.setNotFoundHandler((request, reply) => {
    if (request.method !== 'GET' || request.url.startsWith('/v1/')) {
      return reply.code(404).send({ error: 'Not found' });
    }
    return sendIndex(request, reply);
  });
}
