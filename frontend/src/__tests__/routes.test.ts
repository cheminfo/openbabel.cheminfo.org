import { assertRoutes, pageMetaFor } from 'react-cheminfo/core';
import { expect, test } from 'vitest';

import { HOME_ROUTE, ROUTES, routeForTab } from '../routes.ts';

test('the route table is one the family will index', () => {
  expect(() => {
    assertRoutes(ROUTES);
  }).not.toThrow();
});

test('the converter is the home page', () => {
  expect(HOME_ROUTE.path).toBe('/');
  expect(HOME_ROUTE.tab).toBe('converter');
});

test('every page is reachable by its tab', () => {
  expect(routeForTab('about').path).toBe('/about');
  expect(routeForTab('converter').path).toBe('/');
});

test('an address the site does not know is indexed as the converter', () => {
  expect(pageMetaFor(ROUTES, '/no-such-page').path).toBe('/');
});
