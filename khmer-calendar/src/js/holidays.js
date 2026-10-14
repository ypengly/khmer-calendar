// Holiday data. FIXED = Gregorian-fixed observances (confirm against each year's official announcement).
// Official sub-decree dates are NOT bundled: add them to data/official-holidays.json with a source URL (see README).
import { lunarObservances } from './lunar.js';
const p = n => String(n).padStart(2, '0');
export const FIXED = [
  [1,1,'public','ទិវាចូលឆ្នាំសកល','International New Year'],[1,7,'public','ទិវាជ័យជម្នះលើរបបប្រល័យពូជសាសន៍','Victory over Genocide Day'],
  [3,8,'public','ទិវានារីអន្តរជាតិ',"International Women's Day"],[5,1,'public','ទិវាពលកម្មអន្តរជាតិ','International Labour Day'],
  [5,14,'public','ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្មព្រះមហាក្សត្រ',"King's Birthday"],[6,18,'public','ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្មសម្តេចព្រះមហាក្សត្រី',"Queen Mother's Birthday"],
  [9,24,'public','ទិវាប្រកាសរដ្ឋធម្មនុញ្ញ','Constitution Day'],[10,15,'public','ទិវាគោរពព្រះវិញ្ញាណក្ខន្ធព្រះបរមរតនកោដ្ឋ',"Commemoration Day of the King's Father"],
  [10,29,'public','ព្រះរាជពិធីគ្រងព្រះបរមរាជសម្បត្តិ','Coronation Day'],[11,9,'public','ពិធីបុណ្យឯករាជ្យជាតិ','Independence Day'],
  [6,1,'international','ទិវាកុមារអន្តរជាតិ',"International Children's Day"],[6,5,'international','ទិវាបរិស្ថានពិភពលោក','World Environment Day'],
  [8,12,'international','ទិវាយុវជនអន្តរជាតិ','International Youth Day'],[9,21,'international','ទិវាសន្តិភាពអន្តរជាតិ','International Day of Peace'],
  [12,10,'international','ទិវាសិទ្ធិមនុស្សអន្តរជាតិ','Human Rights Day']];
/** All built-in events of a Gregorian year: {id,cat,km,en,start,end,status,rule?}. */
export function eventsForYear(Y) {
  const f = FIXED.map(([m, d, cat, km, en]) => ({ id: `fx-${m}-${d}-${Y}`, cat, km, en, start: `${Y}-${p(m)}-${p(d)}`, end: `${Y}-${p(m)}-${p(d)}`, status: 'fixed' }));
  return [...f, ...lunarObservances(Y)];
}
