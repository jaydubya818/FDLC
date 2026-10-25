import assert from 'node:assert/strict';
import test from 'node:test';
import { batchCount } from '../src/batches.mjs';

test('counts complete batches', () => assert.equal(batchCount(12, 4), 3));
test('no items require no batches', () => assert.equal(batchCount(0, 4), 0));
test('rejects invalid capacity', () => assert.throws(() => batchCount(3, 0), RangeError));
