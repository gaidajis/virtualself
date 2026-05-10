import test from 'node:test';
import assert from 'node:assert';
import { isClusterVisible } from './dataFilter.ts';
import type { ContextType } from '../types';

test('isClusterVisible - WORK context', () => {
  assert.strictEqual(isClusterVisible('expertise', 'WORK'), true);
  assert.strictEqual(isClusterVisible('timeline', 'WORK'), true);
  assert.strictEqual(isClusterVisible('places', 'WORK'), true);
  assert.strictEqual(isClusterVisible('genealogy', 'WORK'), false);
  assert.strictEqual(isClusterVisible('music', 'WORK'), false);
});

test('isClusterVisible - DATING context', () => {
  assert.strictEqual(isClusterVisible('genealogy', 'DATING'), true);
  assert.strictEqual(isClusterVisible('music', 'DATING'), true);
  assert.strictEqual(isClusterVisible('places', 'DATING'), true);
  assert.strictEqual(isClusterVisible('expertise', 'DATING'), false);
  assert.strictEqual(isClusterVisible('timeline', 'DATING'), false);
});

test('isClusterVisible - PUBLIC context', () => {
  assert.strictEqual(isClusterVisible('expertise', 'PUBLIC'), true);
  assert.strictEqual(isClusterVisible('places', 'PUBLIC'), true);
  assert.strictEqual(isClusterVisible('timeline', 'PUBLIC'), true);
  assert.strictEqual(isClusterVisible('genealogy', 'PUBLIC'), false);
  assert.strictEqual(isClusterVisible('music', 'PUBLIC'), false);
});

test('isClusterVisible - PRIVATE context', () => {
  assert.strictEqual(isClusterVisible('any_cluster', 'PRIVATE'), true);
  assert.strictEqual(isClusterVisible('music', 'PRIVATE'), true);
  assert.strictEqual(isClusterVisible('expertise', 'PRIVATE'), true);
});

test('isClusterVisible - default/other contexts', () => {
  // @ts-ignore - testing default case for unexpected context types
  assert.strictEqual(isClusterVisible('music', 'FAMILY' as any), true);
  // @ts-ignore
  assert.strictEqual(isClusterVisible('any', 'UNKNOWN' as any), true);
});
