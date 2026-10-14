// Khmer lunar service: thin wrapper over the vendored @thyrith/momentkh (MIT).
// All lunar dates come from that library; nothing is approximated from moon phases.
const mk = globalThis.momentkh;
export const WAXING = 0, WANING = 1;
const M = mk.MonthIndex;

/** Khmer lunar info for a Gregorian date, or null when the library cannot convert it. */
export function lunarOf(y, m, d) {
  try {
    const k = mk.fromGregorian(y, m, d).khmer;
    return { day: k.day, phase: k.moonPhase, monthIndex: k.monthIndex, beYear: k.beYear,
      monthKm: k.monthName, monthEn: M[k.monthIndex], phaseKm: k.moonPhaseName,
      animalKm: k.animalYearName, full: k.day === 15 && k.moonPhase === WAXING };
  } catch { return null; }
}
const iso = g => `${g.year}-${String(g.month).padStart(2, '0')}-${String(g.day).padStart(2, '0')}`;
export const addDays = (s, n) => { const [y, m, d] = s.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10); };

/** Lunar-rule observances for Gregorian year Y. BE year = Y+543 up to Pisakh, Y+544 afterwards. */
export function lunarObservances(Y) {
  const at = (d, p, mi, be) => { try { return iso(mk.fromKhmer(d, p, mi, be)); } catch { return null; } };
  const out = [];
  const add = (id, cat, km, en, start, days, rule) => { if (start) out.push({ id: `${id}-${Y}`, cat, km, en, start, end: addDays(start, days - 1), rule, status: 'computed' }); };
  add('meak', 'buddhist', 'មាឃបូជា', 'Meak Bochea', at(15, WAXING, M.Meak, Y + 543), 1, '15 waxing, Meak');
  add('visak', 'buddhist', 'វិសាខបូជា', 'Visak Bochea', at(15, WAXING, M.Pisakh, Y + 543), 1, '15 waxing, Pisakh');
  const pc = at(15, WANING, M.Phatrabot, Y + 544); add('pchum', 'festival', 'បុណ្យភ្ជុំបិណ្ឌ', 'Pchum Ben', pc && addDays(pc, -1), 3, '14–15 waning Phatrabot + 1 waxing Assoch');
  const wf = at(15, WAXING, M.Kadeuk, Y + 544); add('water', 'festival', 'បុណ្យអុំទូក', 'Water Festival', wf && addDays(wf, -1), 3, '14–15 waxing Kadeuk + 1 waning');
  try { add('newyear', 'festival', 'បុណ្យចូលឆ្នាំថ្មី', 'Khmer New Year', iso(mk.getNewYear(Y)), 3, 'Moha Songkran day + 2 days'); } catch {}
  return out;
}
