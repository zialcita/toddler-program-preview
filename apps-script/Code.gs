/**
 * The Toddler Program — website submissions backend (Google Apps Script web app)
 * Site: https://thetoddlerprogram.org (preview: zialcita.github.io/toddler-program-preview)
 *
 * Script properties (Project Settings > Script properties):
 *   SPREADSHEET_ID  – target spreadsheet (a native Google Sheet, NOT the .xlsx)
 *   PRINT_KEY       – long random secret; required for the doGet print view
 *   GHL_ENABLED     – "false". KEEP FALSE: the TTP GoHighLevel sub-account is
 *                     currently BLOCKED by the agency plan limit.
 *   GHL_WEBHOOK_URL – optional GHL inbound webhook URL, used only if GHL_ENABLED=true
 *
 * Only ever touches the tabs 'Online Applications' and 'Tour Requests'.
 * Never reads or writes any other tab (e.g. Becky's existing applicant rows).
 */
var APP_TAB = 'Online Applications';
var TOUR_TAB = 'Tour Requests';
var MAXLEN = 2000;

// Opt-in columns (added 2026-10-30) are appended at the end so existing columns don't shift.
// Field order mirrors 'THE TODDLER PROGRAM APPLICATION FORM 2027-2028'.
var APP_FIELDS = [
  ['schoolYear','School year'],
  ['childLegalName',"Child's full legal name"],['childBirthDate','Birth date'],['childGender','Gender'],['homePhone','Home phone'],
  ['homeAddress','Home address'],['city','City'],['zip','Zip code'],
  ['parent1Name','Parent/legal guardian 1 name'],['parent1Cell','P1 cell phone'],['parent1Occupation','P1 occupation'],['parent1Employer','P1 employer'],['parent1BusinessPhone','P1 business phone'],['parent1Email','P1 email'],
  ['parent2Name','Parent/legal guardian 2 name'],['parent2Cell','P2 cell phone'],['parent2Occupation','P2 occupation'],['parent2Employer','P2 employer'],['parent2BusinessPhone','P2 business phone'],['parent2Email','P2 email'],
  ['siblingsAttended','Siblings attended TTP?'],['siblingsDate','Sibling date'],['livesWith','Child lives with'],['heardAbout','How did you hear about TTP?'],
  ['privateKindergarten','Applying to private school for K?'],['volunteer','Willing to volunteer?'],
  ['healthNeeds','Special health needs/concerns'],['allergies','Known allergies'],['illnessPlan','Plan for care when ill'],
  ['wakeTime','Wake-up time'],['sleepTime','Bedtime'],['naps','Naps during day?'],['napLength','Nap length'],
  ['pottyTrained','Potty trained?'],['urinationWords','Words for urination'],['bowelRegular','Bowel movements regular?'],['bowelWords','Words for bowel movement'],
  ['personality',"Child's personality"],
  ['emergency1Name','Emergency 1 name'],['emergency1Address','Emergency 1 address'],['emergency1Phone','Emergency 1 phone'],['emergency1Relationship','Emergency 1 relationship'],
  ['emergency2Name','Emergency 2 name'],['emergency2Address','Emergency 2 address'],['emergency2Phone','Emergency 2 phone'],['emergency2Relationship','Emergency 2 relationship'],
  ['q1','Q1 Philosophy in child care / ECE'],['q2','Q2 How TTP can support your philosophy'],['q3','Q3 Family activities'],['q4','Q4 Discipline / re-direct'],['q5','Q5 What appeals about TTP'],['q6','Q6 Goals for your child'],
  ['paymentMethod','Payment method'],['feeWaiverRequested','Fee waiver requested'],
  ['consent','Consent'],
  ['marketingOptIn','News/event updates opt-in'],['smsOptIn','Text message opt-in']
];
var APP_REQUIRED = ['childLegalName','childBirthDate','homeAddress','city','zip','parent1Name','parent1Cell','parent1Email','siblingsAttended','livesWith','privateKindergarten','volunteer','emergency1Name','emergency1Relationship','emergency1Phone','paymentMethod','consent'];
var TOUR_FIELDS = [['name','Parent name'],['email','Email'],['phone','Phone'],['childAge',"Child's age"],['date','Preferred date'],['time','Preferred time'],['notes','Notes'],['marketingOptIn','News/event updates opt-in'],['smsOptIn','Text message opt-in']];
var TOUR_REQUIRED = ['name','email','phone','childAge','date','time'];

function props_(){ return PropertiesService.getScriptProperties(); }
function json_(o){ return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function clean_(v){ v = String(v == null ? '' : v).slice(0, MAXLEN); return /^[=+\-@]/.test(v) ? "'" + v : v; } // formula-injection guard
function appHeaders_(){ return ['Timestamp','ID','Status','Fee status'].concat(APP_FIELDS.map(function(f){return f[1];})); }
function tourHeaders_(){ return ['Timestamp','ID','Status'].concat(TOUR_FIELDS.map(function(f){return f[1];})); }

function sheet_(name, headers){
  var ss = SpreadsheetApp.openById(props_().getProperty('SPREADSHEET_ID'));
  var sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(headers); sh.setFrozenRows(1); sh.getRange(1,1,1,headers.length).setFontWeight('bold'); }
  else if (sh.getLastColumn() < headers.length) { // add new header cells (e.g. opt-in columns) to an existing tab
    var have = sh.getLastColumn();
    sh.getRange(1, have + 1, 1, headers.length - have).setValues([headers.slice(have)]).setFontWeight('bold');
  }
  return sh;
}

function doPost(e){
  var lock = LockService.getScriptLock();
  try {
    var d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (d.website) return json_({ok:true}); // honeypot: silently drop bots
    var started = Number(d.startedAt||0), age = Date.now() - started;
    if (started && (age < 5000 || age > 86400000)) return json_({ok:false, error:'expired, please reload the page'});
    var isTour = d.type === 'tour';
    var fields = isTour ? TOUR_FIELDS : APP_FIELDS, req = isTour ? TOUR_REQUIRED : APP_REQUIRED;
    var missing = req.filter(function(k){ return !String(d[k]||'').trim(); });
    if (missing.length) return json_({ok:false, error:'missing: ' + missing.join(', ')});
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d[isTour ? 'email' : 'parent1Email'])) return json_({ok:false, error:'invalid email'});

    var id = (isTour ? 'TR-' : 'APP-') + Utilities.formatDate(new Date(), 'Pacific/Honolulu', 'yyyyMMdd') + '-' + Utilities.getUuid().slice(0,6).toUpperCase();
    var vals = fields.map(function(f){ return clean_(d[f[0]]); });
    var row = isTour ? [new Date(), id, 'Pending review'].concat(vals)
                     : [new Date(), id, 'Pending review', 'Unpaid'].concat(vals);
    lock.waitLock(10000);
    sheet_(isTour ? TOUR_TAB : APP_TAB, isTour ? tourHeaders_() : appHeaders_()).appendRow(row);
    lock.releaseLock();
    try { forwardToGhl_(isTour ? 'tour' : 'application', id, d); } catch (err) { console.warn('GHL forward skipped: ' + err); }
    return json_({ok:true, id:id});
  } catch (err) {
    console.error(err);
    return json_({ok:false, error:'server error'});
  }
}

/** GET
 *  ?action=slots              -> {slots:[]}  (site falls back to tour-slots.json)
 *  ?id=APP-...&key=PRINT_KEY  -> print-friendly single application with a Print button
 */
function doGet(e){
  var p = (e && e.parameter) || {};
  if (p.action === 'slots') return json_({slots:[]});
  var key = props_().getProperty('PRINT_KEY');
  if (!key || p.key !== key) return HtmlService.createHtmlOutput('<p>Not authorized.</p>');
  if (!p.id) return HtmlService.createHtmlOutput('<p>Missing id.</p>');
  var sh = SpreadsheetApp.openById(props_().getProperty('SPREADSHEET_ID')).getSheetByName(APP_TAB);
  if (!sh) return HtmlService.createHtmlOutput('<p>No applications yet.</p>');
  var vals = sh.getDataRange().getDisplayValues(), rec = null;
  for (var i = 1; i < vals.length; i++) if (vals[i][1] === p.id) { rec = vals[i]; break; }
  if (!rec) return HtmlService.createHtmlOutput('<p>Application not found.</p>');
  var t = HtmlService.createTemplateFromFile('Print');
  t.head = vals[0]; t.rec = rec; t.id = p.id;
  return t.evaluate().setTitle('Application ' + p.id);
}

/** GHL lead mirror — DISABLED (GHL_ENABLED=false).
 *  The TTP GHL sub-account is blocked by the agency plan limit. Flip GHL_ENABLED to
 *  "true" and set GHL_WEBHOOK_URL only once that is resolved and Becky approves.
 *  Sends contact basics only, never child, health or questionnaire fields. */
function forwardToGhl_(type, id, d){
  if (String(props_().getProperty('GHL_ENABLED')).toLowerCase() !== 'true') return;
  var url = props_().getProperty('GHL_WEBHOOK_URL'); if (!url) return;
  var payload = type === 'tour'
    ? {source:'website-tour', submissionId:id, name:d.name, email:d.email, phone:d.phone, tags:['ttp-tour-request']}
    : {source:'website-application', submissionId:id, name:d.parent1Name, email:d.parent1Email, phone:d.parent1Cell, tags:['ttp-application']};
  UrlFetchApp.fetch(url, {method:'post', contentType:'application/json', payload:JSON.stringify(payload), muteHttpExceptions:true});
}

/** Optional: run once from the editor to create the two tabs and default properties. */
function setup(){
  sheet_(APP_TAB, appHeaders_());
  sheet_(TOUR_TAB, tourHeaders_());
  if (!props_().getProperty('GHL_ENABLED')) props_().setProperty('GHL_ENABLED','false');
}
