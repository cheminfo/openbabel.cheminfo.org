import { expect, test } from 'vitest';

import { parseTrustProxy } from '../parseTrustProxy.ts';

test('nothing proxying the service is the default', () => {
  expect(parseTrustProxy()).toBe(false);
  expect(parseTrustProxy('')).toBe(false);
  expect(parseTrustProxy('  ')).toBe(false);
  expect(parseTrustProxy('false')).toBe(false);
});

test('true believes any peer', () => {
  expect(parseTrustProxy('true')).toBe(true);
});

test('an address, a range or a list is handed to Fastify as written', () => {
  expect(parseTrustProxy('192.168.1.5')).toBe('192.168.1.5');
  expect(parseTrustProxy('10.0.0.0/8')).toBe('10.0.0.0/8');
  expect(parseTrustProxy(' 10.0.0.0/8, 192.168.1.5 ')).toBe(
    '10.0.0.0/8, 192.168.1.5',
  );
});

// Fastify cannot validate the immediate peer from a hop count, so it trusts
// nothing at all; passing one through would silently disable the setting.
test('a hop count is not read as a number', () => {
  expect(parseTrustProxy('2')).toBe('2');
});
