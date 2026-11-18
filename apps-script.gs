/**
 * Bhagwan Jewellers billing app: Google Sheet storage.
 * Paste this whole file into Extensions > Apps Script of a new Google Sheet,
 * then Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
 * The app sends all its data here; each section is written to its own tab so you can read it,
 * and the full copy is kept in the "_backup" tab so the app can restore everything.
 */
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    if (body.action !== 'save') return out({ ok: false, error: 'unknown action' });
    var d = body.data || {};
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var lock = LockService.getScriptLock(); lock.waitLock(20000);
    try {
      // 1. full copy, split into chunks (a cell holds max 50,000 characters)
      var json = JSON.stringify(d), chunks = [];
      for (var i = 0; i < json.length; i += 40000) chunks.push([json.substr(i, 40000)]);
      var b = sheet(ss, '_backup'); b.clear();
      b.getRange(1, 1, chunks.length, 1).setValues(chunks);
      b.getRange(1, 2).setValue(new Date());
      // 2. readable tabs
      table(ss, 'Bills', ['Bill No','Date','Customer','Phone','Place','Type','Weight (g)','GST','Amount','Old gold (g)'],
        (d.bills||[]).map(function(x){return [x.no,x.date,x.name,x.phone,x.place||'',x.type,x.wt,round(x.gst),x.total,x.oldWt||0];}));
      table(ss, 'Enquiries', ['Date','Customer','Phone','Place','Metal','Item','Weight (g)','Budget','Estimate','Old value','Balance','Status','Reason','Bill No','Note'],
        (d.enq||[]).map(function(x){return [x.date,x.name,x.phone,x.place||'',x.metal,x.item,x.wt,x.budget||'',round(x.est),round(x.oldVal),x.bal||'',x.status,x.reason||'',x.billNo||'',x.note||''];}));
      table(ss, 'Rates', ['Date','22K','24K','Silver'],
        (d.hist||[]).map(function(x){return [x.date,x.g22,x.g24,x.s];}));
      table(ss, 'Orders', ['Order No','Date','Customer','Phone','Item','Purity','Weight (g)','Karigar','Given to karigar (g)','Delivery date','Status','Note'],
        (d.orders||[]).map(function(x){return [x.no,x.date,x.name,x.phone,x.item,x.pur,x.wt,x.kar,x.kwt,x.due,x.status,x.note||''];}));
      table(ss, 'Stock', ['Tag','Item','Purity','HUID','Gross (g)','Stone (g)','Added','Sold in bill','Note'],
        (d.stock||[]).map(function(x){return [x.tag,x.kind,x.pur,x.huid,x.gross,x.stone,x.added,x.sold||'',x.note||''];}));
      table(ss, 'Schemes', ['Scheme No','Customer','Phone','Monthly','Months','Start','Paid count','Paid total','Closed'],
        (d.schemes||[]).map(function(x){var t=0;(x.inst||[]).forEach(function(i){t+=i.amt;});return [x.no,x.name,x.phone,x.amt,x.months,x.start,(x.inst||[]).length,t,x.closed||''];}));
      var c = d.cust || {};
      table(ss, 'Customers', ['Phone','Birthday','Anniversary'],
        Object.keys(c).map(function(p){return [p,c[p].dob||'',c[p].anniv||''];}));
    } finally { lock.releaseLock(); }
    return out({ ok: true });
  } catch (err) { return out({ ok: false, error: String(err) }); }
}

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var b = ss.getSheetByName('_backup');
  if (!b || b.getLastRow() < 1) return out({ ok: true, data: null });
  var vals = b.getRange(1, 1, b.getLastRow(), 1).getValues();
  var json = vals.map(function(r){return r[0];}).join('');
  return out({ ok: true, data: json ? JSON.parse(json) : null });
}

function sheet(ss, name) { return ss.getSheetByName(name) || ss.insertSheet(name); }
function table(ss, name, head, rows) {
  var s = sheet(ss, name); s.clear();
  s.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight('bold').setBackground('#f6e6c2');
  if (rows.length) s.getRange(2, 1, rows.length, head.length).setValues(rows);
  s.setFrozenRows(1);
}
function round(n) { return n ? Math.round(n * 100) / 100 : 0; }
function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
