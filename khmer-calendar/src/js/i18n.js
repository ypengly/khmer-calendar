// Centralised translations. Missing keys fall back to English.
export const MONTHS = { km: ['មករា','កុម្ភៈ','មីនា','មេសា','ឧសភា','មិថុនា','កក្កដា','សីហា','កញ្ញា','តុលា','វិច្ឆិកា','ធ្នូ'], en: ['January','February','March','April','May','June','July','August','September','October','November','December'] };
export const WEEKDAYS = { km: ['អាទិត្យ','ច័ន្ទ','អង្គារ','ពុធ','ព្រហស្បតិ៍','សុក្រ','សៅរ៍'], en: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'] };
const S = {
 en: { app:'Khmer Calendar', today:'Back to today', prev:'Previous month', next:'Next month', print:'Print', none:'No events', on:'Events on', noLunar:'verify', full:'Full moon',
  cat_public:'Public holiday (fixed date)', cat_buddhist:'Buddhist observance', cat_festival:'Khmer festival', cat_international:'International', cat_personal:'Personal', all:'All',
  st_fixed:'Fixed Gregorian date — confirm with the annual official announcement', st_computed:'Computed from lunar rules — official days off may differ; confirm with the announcement',
  tk:'Title (Khmer)', te:'Title (English)', ds:'Start date', de:'End date (optional)', add:'Add event', save:'Save', edit:'Edit', del:'Delete', cancel:'Cancel', err:'Enter a title and a valid date (end must not be before start)', search:'Search name, date or lunar month…',
  csv:'Export personal CSV', ics:'Export .ics', lang:'Language', showLunar:'Show Khmer lunar dates', showIntl:'Show international days', theme:'Theme', auto:'Auto', light:'Light', dark:'Dark',
  upcoming:'Next 30 days', countdown:'Countdown', days:'days', rule:'Rule', local:'Personal events are saved in this browser only and do not sync across devices.', dataNote:'Official holiday dates are not bundled. Fixed-date and lunar-computed days must be confirmed against the government announcement.', confirmDel:'Delete this event?', unverified:'Not officially verified' },
 km: { app:'ប្រតិទិនខ្មែរ', today:'ត្រឡប់ទៅថ្ងៃនេះ', prev:'ខែមុន', next:'ខែបន្ទាប់', print:'បោះពុម្ព', none:'គ្មានព្រឹត្តិការណ៍', on:'ព្រឹត្តិការណ៍ថ្ងៃ', noLunar:'ផ្ទៀងផ្ទាត់', full:'ពេញបូណ៌មី',
  cat_public:'ថ្ងៃឈប់សម្រាក (កាលបរិច្ឆេទថេរ)', cat_buddhist:'ពិធីព្រះពុទ្ធសាសនា', cat_festival:'បុណ្យប្រពៃណីខ្មែរ', cat_international:'អន្តរជាតិ', cat_personal:'ផ្ទាល់ខ្លួន', all:'ទាំងអស់',
  st_fixed:'កាលបរិច្ឆេទថេរតាមសកល — សូមផ្ទៀងផ្ទាត់ជាមួយសេចក្តីប្រកាសផ្លូវការប្រចាំឆ្នាំ', st_computed:'គណនាតាមច្បាប់ចន្ទគតិ — ថ្ងៃឈប់ផ្លូវការអាចខុសគ្នា សូមផ្ទៀងផ្ទាត់ជាមួយសេចក្តីប្រកាស',
  tk:'ចំណងជើង (ខ្មែរ)', te:'ចំណងជើង (English)', ds:'ថ្ងៃចាប់ផ្តើម', de:'ថ្ងៃបញ្ចប់ (ស្រេចចិត្ត)', add:'បន្ថែមព្រឹត្តិការណ៍', save:'រក្សាទុក', edit:'កែ', del:'លុប', cancel:'បោះបង់', err:'សូមបញ្ចូលចំណងជើង និងកាលបរិច្ឆេទត្រឹមត្រូវ (ថ្ងៃបញ្ចប់មិនមុនថ្ងៃចាប់ផ្តើម)', search:'ស្វែងរកឈ្មោះ កាលបរិច្ឆេទ ឬខែចន្ទគតិ…',
  csv:'នាំចេញ CSV ផ្ទាល់ខ្លួន', ics:'នាំចេញ .ics', lang:'ភាសា', showLunar:'បង្ហាញថ្ងៃចន្ទគតិខ្មែរ', showIntl:'បង្ហាញទិវាអន្តរជាតិ', theme:'រចនាប័ទ្ម', auto:'ស្វ័យប្រវត្តិ', light:'ភ្លឺ', dark:'ងងឹត',
  upcoming:'៣០ថ្ងៃខាងមុខ', countdown:'រាប់ថយក្រោយ', days:'ថ្ងៃ', rule:'ច្បាប់', local:'ព្រឹត្តិការណ៍ផ្ទាល់ខ្លួនរក្សាទុកក្នុងកម្មវិធីរុករកនេះប៉ុណ្ណោះ មិនធ្វើសមកាលកម្មទៅឧបករណ៍ផ្សេងទេ។', dataNote:'កាលបរិច្ឆេទឈប់សម្រាកផ្លូវការមិនបានបញ្ចូលទេ។ សូមផ្ទៀងផ្ទាត់ជាមួយសេចក្តីប្រកាសរបស់រាជរដ្ឋាភិបាល។', confirmDel:'លុបព្រឹត្តិការណ៍នេះ?', unverified:'មិនទាន់ផ្ទៀងផ្ទាត់ជាផ្លូវការ' } };
export const t = (lang, k) => (S[lang] && S[lang][k]) || S.en[k] || k;
