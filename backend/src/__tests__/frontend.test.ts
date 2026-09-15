import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterAll, beforeAll, expect, test } from 'vitest';

import buildApp from '../app.ts';

const TRACKING = '<script defer src="https://example.org/count.js"></script>';
const SITE_URL = 'https://openbabel.cheminfo.org';

let app: Awaited<ReturnType<typeof buildApp>>;

beforeAll(async () => {
  const root = mkdtempSync(join(tmpdir(), 'openbabel-frontend-'));
  writeFileSync(
    join(root, 'index.html'),
    '<!doctype html><html><head><!--cheminfo:head--></head><body><div id="root"></div><!--cheminfo:body--></body></html>',
  );
  writeFileSync(
    join(root, 'routes.json'),
    JSON.stringify([
      { path: '/', title: 'Converter', description: 'Convert a structure.' },
      { path: '/about', title: 'About', description: 'What it is built on.' },
    ]),
  );
  app = await buildApp({
    frontendRoot: root,
    siteUrl: SITE_URL,
    trackingScript: TRACKING,
  });
});

afterAll(async () => {
  await app.close();
});

test('the converter is served at the root, titled and canonicalised', async () => {
  const response = await app.inject({ method: 'GET', url: '/' });
  expect(response.statusCode).toBe(200);
  expect(response.body).toContain(
    '<title>Converter — openbabel.cheminfo.org</title>',
  );
  expect(response.body).toContain(
    `<link rel="canonical" href="${SITE_URL}/" />`,
  );
});

test('each routed address carries its own head', async () => {
  const response = await app.inject({ method: 'GET', url: '/about' });
  expect(response.statusCode).toBe(200);
  expect(response.body).toContain(
    '<title>About — openbabel.cheminfo.org</title>',
  );
  expect(response.body).toContain(
    `<link rel="canonical" href="${SITE_URL}/about" />`,
  );
});

test('an address the site does not know is served as the converter', async () => {
  const response = await app.inject({ method: 'GET', url: '/no-such-page' });
  expect(response.statusCode).toBe(200);
  expect(response.body).toContain(
    `<link rel="canonical" href="${SITE_URL}/" />`,
  );
});

test('an unknown API address is a 404 rather than a page', async () => {
  const response = await app.inject({ method: 'GET', url: '/v1/nope' });
  expect(response.statusCode).toBe(404);
  expect(response.json()).toStrictEqual({ error: 'Not found' });
});

test('the tracking snippet is injected once, verbatim', async () => {
  const response = await app.inject({ method: 'GET', url: '/' });
  expect(response.body.split(TRACKING)).toHaveLength(2);
});

test('a crawler without JavaScript is given the index of the site', async () => {
  const response = await app.inject({ method: 'GET', url: '/' });
  expect(response.body).toContain('<noscript>');
  expect(response.body).toContain('href="./about"');
});

test('robots.txt keeps the endpoints out and names the sitemap', async () => {
  const response = await app.inject({ method: 'GET', url: '/robots.txt' });
  expect(response.statusCode).toBe(200);
  expect(response.body).toBe(
    [
      'User-agent: *',
      'Allow: /',
      '# The conversion API is not a page.',
      'Disallow: /v1/',
      '# Nor is its documentation.',
      'Disallow: /docs',
      '',
      `Sitemap: ${SITE_URL}/sitemap.xml`,
      '',
    ].join('\n'),
  );
});

test('the sitemap lists every routed address', async () => {
  const response = await app.inject({ method: 'GET', url: '/sitemap.xml' });
  expect(response.statusCode).toBe(200);
  expect(response.body).toContain(`<loc>${SITE_URL}/</loc>`);
  expect(response.body).toContain(`<loc>${SITE_URL}/about</loc>`);
});
