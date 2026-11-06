import test from 'node:test';
import assert from 'node:assert/strict';
import { handle } from '../src/api.mjs';

test('AC-1: GET /sum returns the sum, including negative and zero inputs', async () => {
  for (const [a, b, sum] of [[2, 3, 5], [-2, 3, 1], [0, 0, 0]]) {
    const response = handle(new Request(`https://fixture.invalid/sum?a=${a}&b=${b}`));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { sum });
  }
});
test('AC-2: invalid or missing input returns 400', () => {
  for (const query of ['a=x&b=3', 'a=2', 'a=&b=3', 'a=Infinity&b=3']) assert.equal(handle(new Request(`https://fixture.invalid/sum?${query}`)).status, 400);
});
test('AC-3: unknown path returns 404', () => {
  assert.equal(handle(new Request('https://fixture.invalid/unknown')).status, 404);
});
