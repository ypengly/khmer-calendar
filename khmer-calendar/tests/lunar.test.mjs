// Anchor tests against widely published dates. Extend with more years from official sources.
import { createRequire } from 'node:module'; import assert from 'node:assert/strict';
globalThis.momentkh = createRequire(import.meta.url)('../src/vendor/momentkh.js');
const { lunarOf, lunarObservances } = await import('../src/js/lunar.js');
const find = (Y, id) => lunarObservances(Y).find(e => e.id === `${id}-${Y}`);
const cases = [['visak',2024,'2024-05-22'],['visak',2025,'2025-05-11'],['meak',2025,'2025-02-12'],
  ['pchum',2024,'2024-10-01'],['water',2024,'2024-11-14'],['newyear',2026,'2026-04-14']];
let n = 0;
for (const [id, Y, start] of cases) { assert.equal(find(Y, id)?.start, start, `${id} ${Y}`); n++; }
const l = lunarOf(2026, 10, 13); assert.equal(l.day, 2); assert.equal(l.monthEn, 'Assoch'); n++;
assert.ok(lunarOf(2025, 5, 11).full, 'Visak 2025 is full moon'); n++;
// Month-boundary continuity: consecutive days must never skip or repeat a lunar day, except month rollover.
let prev = null, bad = 0;
for (let d = new Date(Date.UTC(2024, 0, 1)); d < new Date(Date.UTC(2027, 0, 1)); d.setUTCDate(d.getUTCDate() + 1)) {
  const x = lunarOf(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
  if (prev) { const same = x.monthIndex === prev.monthIndex && x.phase === prev.phase; if (same && x.day !== prev.day + 1) bad++; }
  prev = x;
}
assert.equal(bad, 0, 'lunar day sequence broke'); n++;
console.log(`OK: ${n} checks passed`);
