import test from 'node:test';
import assert from 'node:assert';
import { cn } from './utils.ts';

test('cn utility - standard classes', () => {
  assert.strictEqual(cn('a', 'b', 'c'), 'a b c');
});

test('cn utility - conditional classes', () => {
  assert.strictEqual(cn('a', true && 'b', false && 'c'), 'a b');
});

test('cn utility - tailwind conflicts', () => {
  assert.strictEqual(cn('bg-red-500', 'bg-blue-500'), 'bg-blue-500');
  assert.strictEqual(cn('px-2 py-1', 'p-4'), 'p-4');
});

test('cn utility - arrays and objects', () => {
  assert.strictEqual(cn(['a', 'b'], { c: true, d: false }), 'a b c');
});

test('cn utility - ignores undefined/null/empty', () => {
  assert.strictEqual(cn('a', undefined, null, '', 'b'), 'a b');
});
