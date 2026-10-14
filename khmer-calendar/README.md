# ប្រតិទិនខ្មែរ · Khmer Calendar

A bilingual (Khmer / English) calendar that shows Gregorian and Khmer lunar dates together, with Cambodian holidays, Buddhist observances, festivals, and personal events. Plain HTML + ES modules: **no build step, no framework, no database**.

## Quick start

```bash
npm start        # http://localhost:5173   (needs Node 18+)
npm test         # lunar-calendar anchor tests
```

Any static host also works (Netlify, GitHub Pages, Cloudflare Pages, nginx): upload the folder as-is. Open it through a server, not `file://`, because it uses ES modules.

## Features

- Month grid with Gregorian + Khmer lunar date (កើត/រោច, month, full moon) per day; jump to any month, year or date.
- Today card, 30-day upcoming list, category legend (icon + text, never colour alone).
- Khmer ⇄ English switch for the whole UI, remembered between visits.
- Personal events: add, edit, delete, multi-day, search, filter; stored in **this browser only** (not synced).
- Search by name (Khmer/English), date, or lunar month; category filter.
- Export: personal events as CSV, calendar as `.ics` (UTF-8, Khmer-safe), print-friendly page.
- Settings: lunar dates on/off, international days on/off, light/dark/auto theme.

## Structure

```
index.html              page shell
server.mjs              tiny local static server
src/js/app.js           UI + state + exports
src/js/lunar.js         KhmerLunarCalendarService (wraps the vendored library)
src/js/holidays.js      fixed-date holiday data + yearly event assembly
src/js/i18n.js          all Khmer/English text
src/js/storage.js       guarded localStorage (prefs, personal events)
src/css/styles.css      design tokens, layout, print rules
src/vendor/             @thyrith/momentkh 3.0.3 (MIT) + its license
data/official-holidays.json   placeholder for verified yearly announcements
tests/lunar.test.mjs    anchor + continuity tests
```

## Where the dates come from (and their limits)

- **Lunar dates:** `@thyrith/momentkh` (https://github.com/ThyrithSor/momentkh), a community implementation of the Khmer calendar rules. Dates are *not* derived from astronomical moon phases.
- **Lunar observances** (Meak Bochea, Visak Bochea, Pchum Ben, Water Festival, Khmer New Year) are *computed* from the rules (e.g. 15 waxing of Pisakh) and labelled "computed". Pchum Ben and Water Festival show three days; Khmer New Year shows three days from the new-year day.
- **Fixed-date holidays** (e.g. 1 Jan, 7 Jan, 1 May, 9 Nov) use their usual Gregorian date and are labelled "fixed".
- **Official days off are not bundled.** The government announces them each year and they can differ from computed dates (extra days, bridge days). Confirm against the official announcement before relying on any date.
- **Not included** because I could not verify reliable rules: Royal Ploughing Ceremony, Asalha Puja, and other weekly Buddhist holy days.

### Verified so far (see `tests/lunar.test.mjs`)

Visak Bochea 2024-05-22 and 2025-05-11; Meak Bochea 2025-02-12; Pchum Ben 2024 (1–3 Oct) and 2025 (21–23 Sep); Water Festival 2024 (14–16 Nov); Khmer New Year 2026 (14 Apr); and day-sequence continuity for 2024–2026.

**Please cross-check leap-month years** (the library and other Khmer calendars can disagree there; for example I could not confirm Meak Bochea 2026) against an official Cambodian calendar and add more anchors to the test file.

## Updating holiday data

1. Get the year's official announcement from the Royal Government / Ministry of Labour.
2. Record each day in `data/official-holidays.json` with name (km/en), dates, and source URL, keeping previous years untouched.
3. Wiring this file into the UI (to override "computed"/"fixed" labels with "official") is the first roadmap item.

## Security notes

All user text is HTML-escaped before rendering; CSV cells starting with `= + - @` are neutralised; storage access is wrapped in try/catch. There is no backend, so there are no accounts, secrets or SQL.

## Roadmap (not built yet)

Official-holiday loading and verified badges; week and agenda views; PDF export; reminders and recurrence; favourites and countdown cards; backend with accounts and admin role for shared data.

## License

MIT for this project. Vendored library: MIT, see `src/vendor/MOMENTKH-LICENSE`.
