// Personal events + prefs in localStorage (this browser only; never synced). All access is guarded.
const get = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const set = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } };
export const prefs = { load: () => ({ lang: 'km', lunar: true, intl: true, theme: 'auto', ...get('kc_prefs', {}) }), save: v => set('kc_prefs', v) };
export const personal = { load: () => get('kc_events', []), save: v => set('kc_events', v) };
