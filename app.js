/* ─── STATE ──────────────────────────────────────────────── */
var quotes = [];

/* ─── HELPERS ────────────────────────────────────────────── */
function getToday() {
return new Date().toISOString().split(‘T’)[0];
}

function niceDate(dateKey) {
if (!dateKey) return ‘’;
var parts = dateKey.split(’-’);
return parts[2] + ‘/’ + parts[1] + ‘/’ + parts[0];
}

function histDateParts(dateKey) {
if (!dateKey) return { day: ‘–’, mon: ‘—’ };
var parts = dateKey.split(’-’);
var months = [‘Jan’,‘Feb’,‘Mar’,‘Apr’,‘May’,‘Jun’,‘Jul’,‘Aug’,‘Sep’,‘Oct’,‘Nov’,‘Dec’];
return {
day: parts[2],
mon: months[parseInt(parts[1], 10) - 1] || parts[1]
};
}

function escHtml(str) {
return (str || ‘’)
.replace(/&/g, ‘&’)
.replace(/”/g, ‘"’)
.replace(/</g, ‘<’)
.replace(/>/g, ‘>’);
}

/* ─── TIME SELECTS ───────────────────────────────────────── */
function populateTimeSelects() {
var hourIds = [‘startHour’, ‘endHour’];
hourIds.forEach(function(id) {
var sel = document.getElementById(id);
for (var h = 0; h < 24; h++) {
var v = h < 10 ? ‘0’ + h : ‘’ + h;
var opt = document.createElement(‘option’);
opt.value = v;
opt.textContent = v;
sel.appendChild(opt);
}
});

var mins = [‘00’, ‘15’, ‘30’, ‘45’];
var minIds = [‘startMin’, ‘endMin’];
minIds.forEach(function(id) {
var sel = document.getElementById(id);
mins.forEach(function(m) {
var opt = document.createElement(‘option’);
opt.value = m;
opt.textContent = m;
sel.appendChild(opt);
});
});
}

/* ─── QUOTES ─────────────────────────────────────────────── */
function addQuote() {
quotes.push({ num: ‘SQ-’, val: ‘’ });
renderQuotes();
updatePreview();
autoSaveCurrent();
}

function removeQuote(i) {
quotes.splice(i, 1);
renderQuotes();
updatePreview();
autoSaveCurrent();
}

function renderQuotes() {
var container = document.getElementById(‘quotesList’);
var empty = document.getElementById(‘quotesEmpty’);
container.innerHTML = ‘’;

if (quotes.length === 0) {
empty.style.display = ‘block’;
return;
}
empty.style.display = ‘none’;

quotes.forEach(function(q, i) {
var row = document.createElement(‘div’);
row.className = ‘quote-row’;
row.innerHTML =
‘<input type=“text” value=”’ + escHtml(q.num) + ’” placeholder=“SQ-12345” ’ +
‘oninput=“quotes[’ + i + ‘].num=this.value; updatePreview(); autoSaveCurrent()”>’ +
‘<input type=“text” value=”’ + escHtml(q.val) + ’” placeholder=“Value” ’ +
‘oninput=“quotes[’ + i + ‘].val=this.value; updatePreview(); autoSaveCurrent()”>’ +
‘<button class="btn-del" onclick="removeQuote(' + i + ')">✕</button>’;
container.appendChild(row);
});
}

/* ─── PREVIEW ────────────────────────────────────────────── */
function formatPreview() {
var dateInput = document.getElementById(‘date’).value;
var dateStr   = dateInput ? niceDate(dateInput) : ‘Not set’;

var sh = document.getElementById(‘startHour’).value || ‘09’;
var sm = document.getElementById(‘startMin’).value  || ‘00’;
var eh = document.getElementById(‘endHour’).value   || ‘17’;
var em = document.getElementById(‘endMin’).value    || ‘00’;

var sales    = document.getElementById(‘sales’).value    || ‘\u2014’;
var target   = document.getElementById(‘target’).value   || ‘\u2014’;
var footfall = document.getElementById(‘footfall’).value || ‘\u2014’;
var notes    = document.getElementById(‘notes’).value    || ‘\u2014’;
var feedback = document.getElementById(‘feedback’).value || ‘\u2014’;
var aob      = document.getElementById(‘aob’).value      || ‘\u2014’;

var quoteText;
if (quotes.length === 0) {
quoteText = ‘None’;
} else {
quoteText = quotes.map(function(q) {
return ‘Quote ’ + (q.num || ‘SQ-\u2014’) + ‘: \u00A3’ + (q.val || ‘\u2014’);
}).join(’\n’);
}

return ’Date: ’ + dateStr + ‘\n’ +
’Shift: ’ + sh + ‘:’ + sm + ’ - ’ + eh + ‘:’ + em + ‘\n’ +
‘Staff: Jordan\n’ +
‘\n’ +
‘KEY TRADE POINTS:\n’ +
‘Daily Sales: \u00A3’ + sales + ‘\n’ +
‘Daily Target: \u00A3’ + target + ‘\n’ +
’Daily Footfall: ’ + footfall + ‘\n’ +
‘\n’ +
‘NOTES:\n’ + notes + ‘\n’ +
‘\n’ +
‘NEW QUOTES:\n’ + quoteText + ‘\n’ +
‘\n’ +
‘CLIENT FEEDBACK:\n’ + feedback + ‘\n’ +
‘\n’ +
‘AOB (Competitors/ Price Comparisons/ External Factors):\n’ + aob;
}

function updatePreview() {
document.getElementById(‘preview’).textContent = formatPreview();
}

/* ─── DATA COLLECTION ────────────────────────────────────── */
function collectData() {
return {
startHour: document.getElementById(‘startHour’).value,
startMin:  document.getElementById(‘startMin’).value,
endHour:   document.getElementById(‘endHour’).value,
endMin:    document.getElementById(‘endMin’).value,
sales:     document.getElementById(‘sales’).value,
target:    document.getElementById(‘target’).value,
footfall:  document.getElementById(‘footfall’).value,
notes:     document.getElementById(‘notes’).value,
feedback:  document.getElementById(‘feedback’).value,
aob:       document.getElementById(‘aob’).value,
quotes:    JSON.parse(JSON.stringify(quotes))
};
}

function applyData(d) {
document.getElementById(‘startHour’).value = d.startHour || ‘09’;
document.getElementById(‘startMin’).value  = d.startMin  || ‘00’;
document.getElementById(‘endHour’).value   = d.endHour   || ‘17’;
document.getElementById(‘endMin’).value    = d.endMin    || ‘00’;
document.getElementById(‘sales’).value     = d.sales     || ‘’;
document.getElementById(‘target’).value    = d.target    || ‘’;
document.getElementById(‘footfall’).value  = d.footfall  || ‘’;
document.getElementById(‘notes’).value     = d.notes     || ‘’;
document.getElementById(‘feedback’).value  = d.feedback  || ‘’;
document.getElementById(‘aob’).value       = d.aob       || ‘’;
quotes = Array.isArray(d.quotes) ? JSON.parse(JSON.stringify(d.quotes)) : [];
renderQuotes();
}

/* ─── HISTORY ────────────────────────────────────────────── */
function getHistory() {
try { return JSON.parse(localStorage.getItem(‘handoverHistory_v2’) || ‘[]’); }
catch(e) { return []; }
}

function setHistory(history) {
localStorage.setItem(‘handoverHistory_v2’, JSON.stringify(history));
}

function saveToHistory() {
var dateKey = document.getElementById(‘date’).value;
if (!dateKey) return;
var history = getHistory();
history = history.filter(function(item) { return item.date !== dateKey; });
history.push({ date: dateKey, preview: formatPreview(), data: collectData() });
history.sort(function(a, b) { return b.date.localeCompare(a.date); });
setHistory(history);
}

function saveHandover() {
var dateKey = document.getElementById(‘date’).value;
if (!dateKey) { alert(‘Please select a date before saving.’); return; }
saveToHistory();
var btn = document.getElementById(‘saveBtn’);
var orig = btn.innerHTML;
btn.innerHTML = ‘✓ Saved!’;
btn.style.background = ‘#48c78e’;
btn.style.color = ‘#0f0f10’;
setTimeout(function() {
btn.innerHTML = orig;
btn.style.background = ‘’;
btn.style.color = ‘’;
}, 1800);
}

function copyHandover() {
var text = formatPreview();
var btn = document.getElementById(‘copyBtn’);
var orig = btn.innerHTML;
if (navigator.clipboard && navigator.clipboard.writeText) {
navigator.clipboard.writeText(text).then(function() {
btn.innerHTML = ‘✓ Copied!’;
setTimeout(function() { btn.innerHTML = orig; }, 1800);
});
} else {
/* fallback for older browsers */
var ta = document.createElement(‘textarea’);
ta.value = text;
ta.style.position = ‘fixed’;
ta.style.opacity = ‘0’;
document.body.appendChild(ta);
ta.focus();
ta.select();
document.execCommand(‘copy’);
document.body.removeChild(ta);
btn.innerHTML = ‘✓ Copied!’;
setTimeout(function() { btn.innerHTML = orig; }, 1800);
}
}

/* ─── HISTORY MODAL ──────────────────────────────────────── */
function showHistory() {
document.getElementById(‘historyModal’).classList.add(‘open’);
renderHistoryList();
}

function closeHistory() {
document.getElementById(‘historyModal’).classList.remove(‘open’);
}

function handleOverlayClick(e) {
if (e.target === document.getElementById(‘historyModal’)) closeHistory();
}

function renderHistoryList() {
var container = document.getElementById(‘historyList’);
var history = getHistory();
var currentDate = document.getElementById(‘date’).value;

if (history.length === 0) {
container.innerHTML =
‘<div class="empty-state">’ +
‘<div class="empty-icon">📒</div>’ +
‘<div class="empty-text">No saved handovers yet.<br>Hit Save to store today's entry.</div>’ +
‘</div>’;
return;
}

container.innerHTML = ‘’;

history.forEach(function(item) {
var parts = histDateParts(item.date);
var isCurrent = item.date === currentDate;

```
var el = document.createElement('div');
el.className = 'history-item' + (isCurrent ? ' is-current' : '');

var salesLine = '';
var previewLines = (item.preview || '').split('\n');
for (var i = 0; i < previewLines.length; i++) {
  if (previewLines[i].indexOf('Daily Sales:') === 0) {
    salesLine = previewLines[i];
    break;
  }
}

var currentTag = isCurrent ? ' <span class="hist-current-tag">&#9679; current</span>' : '';

el.innerHTML =
  '<div class="hist-date-badge">' +
    '<div class="hist-day">' + parts.day + '</div>' +
    '<div class="hist-mon">' + parts.mon + '</div>' +
  '</div>' +
  '<div class="hist-body">' +
    '<div class="hist-title">' + niceDate(item.date) + currentTag + '</div>' +
    '<div class="hist-preview">' + (salesLine || 'Tap to load') + '</div>' +
  '</div>' +
  '<button class="hist-del" title="Delete" data-date="' + item.date + '">&#128465;</button>';

el.querySelector('.hist-body').addEventListener('click', function() {
  loadFromHistory(item.date);
  closeHistory();
});

el.querySelector('.hist-del').addEventListener('click', function(e) {
  e.stopPropagation();
  deleteHistory(item.date);
});

container.appendChild(el);
```

});
}

function deleteHistory(dateKey) {
if (confirm(’Delete handover for ’ + niceDate(dateKey) + ‘?’)) {
var history = getHistory();
history = history.filter(function(item) { return item.date !== dateKey; });
setHistory(history);
renderHistoryList();
}
}

function loadFromHistory(dateKey) {
var history = getHistory();
var item = null;
for (var i = 0; i < history.length; i++) {
if (history[i].date === dateKey) { item = history[i]; break; }
}
if (!item) return;
document.getElementById(‘date’).value = item.date;
applyData(item.data);
updatePreview();
}

/* ─── NEW DAY ────────────────────────────────────────────── */
function newDay() {
if (confirm(‘Start fresh for a new day? Your current form will be cleared.’)) {
document.getElementById(‘date’).value = getToday();
applyData({
startHour: ‘09’, startMin: ‘00’,
endHour: ‘17’, endMin: ‘00’,
sales: ‘’, target: ‘’, footfall: ‘’,
notes: ‘’, feedback: ‘’, aob: ‘’,
quotes: []
});
updatePreview();
autoSaveCurrent();
}
}

/* ─── AUTO-SAVE DRAFT ────────────────────────────────────── */
function autoSaveCurrent() {
var data = collectData();
data.date = document.getElementById(‘date’).value;
localStorage.setItem(‘handoverDraft_Jordan’, JSON.stringify(data));
}

function loadSaved() {
try {
var saved = localStorage.getItem(‘handoverDraft_Jordan’);
if (saved) {
var data = JSON.parse(saved);
document.getElementById(‘date’).value = data.date || getToday();
applyData(data);
} else {
document.getElementById(‘date’).value = getToday();
document.getElementById(‘startHour’).value = ‘09’;
document.getElementById(‘startMin’).value  = ‘00’;
document.getElementById(‘endHour’).value   = ‘17’;
document.getElementById(‘endMin’).value    = ‘00’;
}
} catch(e) {
document.getElementById(‘date’).value = getToday();
}
}

/* ─── INIT ───────────────────────────────────────────────── */
window.onload = function() {
populateTimeSelects();
loadSaved();
updatePreview();

var inputs = document.querySelectorAll(‘input, textarea, select’);
inputs.forEach(function(el) {
el.addEventListener(‘input’, function() { updatePreview(); autoSaveCurrent(); });
el.addEventListener(‘change’, function() { updatePreview(); autoSaveCurrent(); });
});
};