import { t, MONTHS, WEEKDAYS } from './i18n.js';
import { lunarOf, lunarObservances, addDays } from './lunar.js';
import { eventsForYear } from './holidays.js';
import { prefs, personal } from './storage.js';
const $ = id => document.getElementById(id), p2 = n => String(n).padStart(2, '0');
const iso = d => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const parse = s => { const [y, m, d] = s.split('-').map(Number); return { y, m, d }; };
const validDate = s => /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s + 'T00:00:00Z'));
let P = prefs.load(), mine = personal.load(), todayKey = iso(new Date()), sel = todayKey;
let view = new Date(+todayKey.slice(0, 4), +todayKey.slice(5, 7) - 1, 1), cache = {};
const L = () => P.lang, T = k => t(L(), k), nm = e => (L() === 'km' ? e.km : e.en) || e.km || e.en;
const yearEvents = Y => (cache[Y] ||= eventsForYear(Y));
function allEvents(Y) {
  return [...yearEvents(Y), ...mine.map(e => ({ ...e, cat: 'personal', status: 'personal', end: e.end || e.start }))]
    .filter(e => (P.intl || e.cat !== 'international'));
}
const onDay = key => { const Y = +key.slice(0, 4); return [...allEvents(Y - 1), ...allEvents(Y), ...allEvents(Y + 1)].filter(e => e.start <= key && key <= e.end)
  .filter((e, i, a) => a.findIndex(x => x.id === e.id) === i); };
function lunarText(key, short) {
  const { y, m, d } = parse(key), l = lunarOf(y, m, d); if (!l) return T('noLunar');
  if (L() === 'km') return `${l.full ? T('full') : l.day + l.phaseKm} ${short ? '' : 'ខែ' + l.monthKm}`.trim();
  return `${l.day}${l.phase ? ' waning' : ' waxing'}${short ? '' : ', ' + l.monthEn}${l.full ? ' (' + T('full') + ')' : ''}`;
}
const longDate = key => { const { y, m, d } = parse(key); return `${d} ${MONTHS[L()][m - 1]} ${y}`; };
const wdName = key => { const { y, m, d } = parse(key); return WEEKDAYS[L()][new Date(y, m - 1, d).getDay()]; };
const range = e => e.start === e.end ? longDate(e.start) : `${longDate(e.start)} – ${longDate(e.end)}`;
const li = (e, extra = '') => `<li><span><span class="tag c-${e.cat}">${esc(T('cat_' + e.cat))}</span> <strong>${esc(nm(e))}</strong><small>${range(e)}${e.status === 'fixed' || e.status === 'computed' ? ' · ' + esc(T('st_' + e.status)) : ''}${e.rule ? ' · ' + T('rule') + ': ' + esc(e.rule) : ''}${e.loc ? ' · ' + esc(e.loc) : ''}</small></span>${extra}</li>`;
const persBtns = e => e.cat === 'personal' ? `<span class="row"><button data-edit="${e.id}">${T('edit')}</button><button data-del="${e.id}">${T('del')}</button></span>` : '';

function render() {
  document.documentElement.lang = L(); document.title = T('app');
  $('lk').setAttribute('aria-pressed', L() === 'km'); $('le').setAttribute('aria-pressed', L() === 'en');
  $('theme').innerHTML = ['auto', 'light', 'dark'].map(v => `<option value="${v}" ${P.theme === v ? 'selected' : ''}>${T(v)}</option>`).join('');
  if (P.theme === 'auto') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = P.theme;
  $('tDate').textContent = `${wdName(todayKey)} ${longDate(todayKey)}`; $('tLun').textContent = P.lunar ? lunarText(todayKey) : '';
  const te = onDay(todayKey); $('tEv').innerHTML = te.length ? te.map(e => `<div><span class="tag c-${e.cat}">${esc(nm(e))}</span></div>`).join('') : `<div class="mut">${T('none')}</div>`;
  $('goToday').textContent = T('today'); $('prev').setAttribute('aria-label', T('prev')); $('next').setAttribute('aria-label', T('next'));
  $('printBtn').textContent = T('print'); $('lLun').textContent = T('showLunar'); $('lInt').textContent = T('showIntl'); $('oLun').checked = P.lunar; $('oInt').checked = P.intl;
  $('mSel').innerHTML = MONTHS[L()].map((m, i) => `<option value="${i}" ${i === view.getMonth() ? 'selected' : ''}>${m}</option>`).join(''); $('ySel').value = view.getFullYear();
  $('wds').innerHTML = WEEKDAYS[L()].map(w => `<div class="wd">${w}</div>`).join('');
  const first = new Date(view.getFullYear(), view.getMonth(), 1), st = new Date(first); st.setDate(1 - first.getDay()); let h = '';
  for (let i = 0; i < 42; i++) { const d = new Date(st); d.setDate(st.getDate() + i); const key = iso(d), ev = onDay(key);
    const c = ['day']; if (d.getMonth() !== view.getMonth()) c.push('out'); if (key === todayKey) c.push('today'); if (key === sel) c.push('sel');
    h += `<button class="${c.join(' ')}" data-k="${key}" aria-label="${esc(longDate(key) + (P.lunar ? ', ' + lunarText(key) : '') + (ev.length ? ', ' + ev.map(nm).join(', ') : ''))}"><span class="n">${d.getDate()}</span>${P.lunar ? `<span class="lun">${esc(lunarText(key, true))}</span>` : ''}${ev.slice(0, 2).map(e => `<span class="tag c-${e.cat}">${esc(nm(e))}</span>`).join('')}${ev.length > 2 ? `<span class="tag c-personal">+${ev.length - 2}</span>` : ''}${ev.length ? `<span class="dot c-${ev[0].cat}">●${ev.length}</span>` : ''}</button>`; }
  $('days').innerHTML = h;
  $('legend').innerHTML = ['public', 'buddhist', 'festival', 'international', 'personal'].map(c => `<span class="tag c-${c}">${esc(T('cat_' + c))}</span>`).join('');
  $('selTitle').textContent = `${T('on')} ${longDate(sel)}${P.lunar ? ' · ' + lunarText(sel) : ''}`;
  const se = onDay(sel); $('selList').innerHTML = se.length ? se.map(e => li(e, persBtns(e))).join('') : `<li class="mut">${T('none')}</li>`;
  $('lTk').textContent = T('tk'); $('lTe').textContent = T('te'); $('lDs').textContent = T('ds'); $('lDe').textContent = T('de');
  $('evSave').textContent = $('evId').value ? T('save') : T('add'); $('evCancel').textContent = T('cancel'); $('local').textContent = T('local'); $('dataNote').textContent = T('dataNote');
  if (!$('evId').value) $('evS').value = sel;
  $('upT').textContent = T('upcoming'); const up = []; for (let i = 0; i < 30; i++) { const k = addDays(todayKey, i); onDay(k).forEach(e => { if (e.start === k) up.push({ e, k, i }); }); }
  $('upList').innerHTML = up.length ? up.map(({ e, k, i }) => li(e, `<span class="tag c-${e.cat}">${i === 0 ? T('today') : i + ' ' + T('days')}</span>`)).join('') : `<li class="mut">${T('none')}</li>`;
  $('q').placeholder = T('search'); $('csv').textContent = T('csv'); $('ics').textContent = T('ics');
  const f = $('flt').value || 'all'; $('flt').innerHTML = ['all', 'public', 'buddhist', 'festival', 'international', 'personal'].map(v => `<option value="${v}">${v === 'all' ? T('all') : T('cat_' + v)}</option>`).join(''); $('flt').value = f;
  search();
}
function search() {
  const q = $('q').value.trim().toLowerCase(), f = $('flt').value, Y = view.getFullYear();
  const l = e => { const { y, m, d } = parse(e.start), x = lunarOf(y, m, d); return x ? `${x.monthKm} ${x.monthEn} ${x.day}` : ''; };
  const r = allEvents(Y).filter(e => (f === 'all' || e.cat === f) && (!q || `${e.km} ${e.en} ${e.start} ${e.end} ${longDate(e.start)} ${l(e)}`.toLowerCase().includes(q))).sort((a, b) => a.start < b.start ? -1 : 1);
  $('res').innerHTML = r.length ? r.map(e => li(e, `<button data-k="${e.start}">${longDate(e.start)}</button>`)).join('') : `<li class="mut">${T('none')}</li>`;
}
const go = key => { sel = key; const { y, m } = parse(key); view = new Date(y, m - 1, 1); render(); };
function download(name, type, text) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['\uFEFF' + text], { type })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); }
const csvQ = s => { s = String(s ?? ''); if (/^[=+\-@]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; };
const icsEsc = s => String(s ?? '').replace(/[\\;,]/g, '\\$&').replace(/\n/g, '\\n');
document.addEventListener('click', ev => { const b = ev.target.closest('button'); if (!b) return;
  if (b.dataset.k) go(b.dataset.k);
  if (b.dataset.del && confirm(T('confirmDel'))) { mine = mine.filter(e => e.id !== b.dataset.del); personal.save(mine); render(); }
  if (b.dataset.edit) { const e = mine.find(x => x.id === b.dataset.edit); if (e) { $('evId').value = e.id; $('evKm').value = e.km; $('evEn').value = e.en; $('evS').value = e.start; $('evE').value = e.end || ''; $('evCancel').hidden = false; $('evSave').textContent = T('save'); $('evKm').focus(); } } });
$('lk').onclick = () => { P.lang = 'km'; prefs.save(P); render(); }; $('le').onclick = () => { P.lang = 'en'; prefs.save(P); render(); };
$('theme').onchange = e => { P.theme = e.target.value; prefs.save(P); render(); };
$('oLun').onchange = e => { P.lunar = e.target.checked; prefs.save(P); render(); }; $('oInt').onchange = e => { P.intl = e.target.checked; prefs.save(P); render(); };
$('prev').onclick = () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); render(); }; $('next').onclick = () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); render(); };
$('goToday').onclick = () => go(todayKey); $('printBtn').onclick = () => window.print();
$('mSel').onchange = e => { view = new Date(view.getFullYear(), +e.target.value, 1); render(); };
$('ySel').onchange = e => { const y = +e.target.value; if (y >= 1900 && y <= 2100) { view = new Date(y, view.getMonth(), 1); render(); } };
$('jump').onchange = e => { if (validDate(e.target.value)) go(e.target.value); };
$('q').oninput = search; $('flt').onchange = search;
function resetForm() { $('evf').reset(); $('evId').value = ''; $('evCancel').hidden = true; $('msg').textContent = ''; }
$('evCancel').onclick = () => { resetForm(); render(); };
$('evf').onsubmit = ev => { ev.preventDefault(); const km = $('evKm').value.trim(), en = $('evEn').value.trim(), s = $('evS').value, e = $('evE').value || s;
  if ((!km && !en) || !validDate(s) || !validDate(e) || e < s) { $('msg').textContent = T('err'); return; }
  const id = $('evId').value || String(Date.now()), rec = { id, km, en, start: s, end: e };
  mine = $('evId').value ? mine.map(x => x.id === id ? rec : x) : [...mine, rec]; personal.save(mine); resetForm(); go(s); };
$('csv').onclick = () => download('khmer-calendar-events.csv', 'text/csv;charset=utf-8', ['start,end,title_km,title_en'].concat(mine.map(e => [e.start, e.end, csvQ(e.km), csvQ(e.en)].join(','))).join('\r\n'));
$('ics').onclick = () => { const Y = view.getFullYear(), ev = allEvents(Y);
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//khmer-calendar//EN', 'CALSCALE:GREGORIAN'];
  ev.forEach(e => lines.push('BEGIN:VEVENT', `UID:${e.id}@khmer-calendar`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`, `DTSTART;VALUE=DATE:${e.start.replace(/-/g, '')}`, `DTEND;VALUE=DATE:${addDays(e.end, 1).replace(/-/g, '')}`, `SUMMARY:${icsEsc(nm(e))}`, ...(e.status === 'computed' || e.status === 'fixed' ? [`DESCRIPTION:${icsEsc(T('unverified'))}`] : []), 'END:VEVENT'));
  lines.push('END:VCALENDAR'); download(`khmer-calendar-${Y}.ics`, 'text/calendar;charset=utf-8', lines.join('\r\n')); };
render();
