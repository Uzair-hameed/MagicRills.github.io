/* quick-training-agenda-maker-script.js */
let breakCounter = 0;
let breaks = [];

document.addEventListener('DOMContentLoaded', () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  document.getElementById('start-date').value = tomorrow.toISOString().split('T')[0];
  const nextWeek = new Date(tomorrow);
  nextWeek.setDate(nextWeek.getDate() + 6);
  document.getElementById('end-date').value = nextWeek.toISOString().split('T')[0];

  document.getElementById('generate-form').onclick = generateCustomizationForm;
  document.getElementById('back-to-start').onclick = () => switchSection('input-form');
  document.getElementById('regenerate').onclick = () => switchSection('input-form');
  document.getElementById('generate-agenda').onclick = generateAgenda;
  document.getElementById('export-pdf').onclick = window.exportToPDF;
  document.getElementById('export-docx').onclick = window.exportToDOCX;
  document.getElementById('email-agenda').onclick = emailAgenda;
  document.getElementById('copy-agenda').onclick = copyAgenda;
  document.getElementById('print-agenda').onclick = () => window.print();

  document.getElementById('add-tea-break').onclick = () => addBreak('Tea Break', '10:30', '10:45');
  document.getElementById('add-lunch-break').onclick = () => addBreak('Lunch Break', '13:00', '14:00');

  // Dark Mode
  const darkModeBtn = document.getElementById('toggle-dark-mode');
  darkModeBtn.onclick = () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    darkModeBtn.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  };
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    darkModeBtn.textContent = 'Light Mode';
  }
});

function switchSection(id) {
  document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
  setTimeout(() => document.getElementById(id).classList.add('active'), 100);
}

function addBreak(name, start, end) {
  breakCounter++;
  const html = `
    <div class="break-item" data-id="${breakCounter}">
      <h4>${name}</h4>
      <div class="input-group"><label>Start:</label><input type="time" class="break-start" value="${start}"></div>
      <div class="input-group"><label>End:</label><input type="time" class="break-end" value="${end}"></div>
      <button type="button" class="btn-secondary" onclick="removeBreak(${breakCounter})">Remove</button>
    </div>`;
  document.getElementById('days-container').insertAdjacentHTML('beforeend', html);
  breaks.push({ id: breakCounter, name, start, end });
}
window.removeBreak = id => {
  document.querySelector(`[data-id="${id}"]`).remove();
  breaks = breaks.filter(b => b.id !== id);
};

/* === Form & Agenda Generation === */
function generateCustomizationForm() {
  const numSessions = +document.getElementById('num-slots').value;
  const startDateStr = document.getElementById('start-date').value;
  const endDateStr = document.getElementById('end-date').value;

  if (!startDateStr || !endDateStr || !numSessions) return alert('Please fill all fields.');
  const startDate = new Date(startDateStr), endDate = new Date(endDateStr);
  if (endDate < startDate) return alert('End date must be after start date.');
  const numDays = Math.floor((endDate - startDate) / 86400000) + 1;
  if (numDays > 30 || numDays < 1) return alert('1–30 days only.');

  document.getElementById('slots-container').innerHTML = '';
  document.getElementById('days-container').innerHTML = '';

  for (let i = 1; i <= numSessions; i++) {
    const start = i === 1 ? '09:00' : i === 2 ? '11:30' : '14:00';
    const end   = i === 1 ? '11:00' : i === 2 ? '13:00' : '15:30';
    document.getElementById('slots-container').innerHTML += `
      <div class="custom-slot">
        <h4>Session ${i}</h4>
        <div class="input-group"><label>Start:</label><input type="time" id="session-start-${i}" value="${start}"></div>
        <div class="input-group"><label>End:</label><input type="time" id="session-end-${i}" value="${end}"></div>
      </div>`;
  }

  for (let d = 1; d <= numDays; d++) {
    const day = new Date(startDate); day.setDate(day.getDate() + d - 1);
    const dateStr = day.toLocaleDateString('en-GB', { weekday:'short', day:'2-digit', month:'short' });
    let html = `<div class="day-column"><h3>Day ${d} (${dateStr})</h3>`;
    for (let s = 1; s <= numSessions; s++) {
      html += `
        <div class="session-block">
          <h4>Session ${s}</h4>
          <div class="input-group"><label>Title:</label><input type="text" id="title-d${d}-s${s}" value="Session ${s}"></div>
          <div class="input-group"><label>Bullets:</label><input type="text" id="bullets-d${d}-s${s}" value="Topic 1, Topic 2"></div>
          <div class="input-group"><label>Trainer:</label><input type="text" id="trainer-d${d}-s${s}" value="Uzair Hameed"></div>
        </div>`;
    }
    html += `</div>`;
    document.getElementById('days-container').innerHTML += html;
  }
  switchSection('custom-form');
}

function generateAgenda() {
  const numSessions = +document.getElementById('num-slots').value;
  const startDateStr = document.getElementById('start-date').value;
  const endDateStr = document.getElementById('end-date').value;
  const startDate = new Date(startDateStr), endDate = new Date(endDateStr);
  const numDays = Math.floor((endDate - startDate) / 86400000) + 1;

  const sessions = [];
  for (let i = 1; i <= numSessions; i++) {
    sessions.push({
      start: document.getElementById(`session-start-${i}`).value,
      end: document.getElementById(`session-end-${i}`).value
    });
  }

  const dailyData = [];
  for (let d = 1; d <= numDays; d++) {
    const day = [];
    for (let s = 1; s <= numSessions; s++) {
      const title = document.getElementById(`title-d${d}-s${s}`).value;
      const bullets = document.getElementById(`bullets-d${d}-s${s}`).value.split(',').map(b => b.trim()).filter(b => b);
      const trainer = document.getElementById(`trainer-d${d}-s${s}`).value;
      day.push({ title, bullets, trainer });
    }
    dailyData.push(day);
  }

  breaks.forEach(b => {
    const el = document.querySelector(`[data-id="${b.id}"]`);
    if (el) {
      b.start = el.querySelector('.break-start').value;
      b.end = el.querySelector('.break-end').value;
    }
  });

  const dateRange = `${startDate.toLocaleDateString('en-GB')} - ${endDate.toLocaleDateString('en-GB')}`;
  let html = `<div class="calendar-header">Training Schedule: ${dateRange}</div><table><thead><tr><th>Time</th>`;
  for (let d = 1; d <= numDays; d++) {
    const day = new Date(startDate); day.setDate(day.getDate() + d - 1);
    const ds = day.toLocaleDateString('en-GB', { weekday:'short', day:'2-digit', month:'short' });
    html += `<th>Day ${d}<br><small>${ds}</small></th>`;
  }
  html += `</tr></thead><tbody>`;

  const events = [];
  sessions.forEach((s,i) => events.push({type:'session',index:i,time:s.start}));
  breaks.forEach(b => events.push({type:'break',data:b,time:b.start}));
  events.sort((a,b) => a.time.localeCompare(b.time));

  events.forEach(e => {
    if (e.type === 'session') {
      const s = e.index;
      const cls = `slot${(s%2)+1}`;
      html += `<tr><td><strong>${sessions[s].start} - ${sessions[s].end}</strong></td>`;
      for (let d = 0; d < numDays; d++) {
        const sess = dailyData[d][s];
        const bullets = sess.bullets.map(b => `<li>${b}</li>`).join('');
        html += `<td class="${cls}"><div class="session-title">${sess.title}</div><ul>${bullets}</ul><div class="trainer">${sess.trainer}</div></td>`;
      }
      html += `</tr>`;
    } else {
      const b = e.data;
      html += `<tr class="break-row"><td><strong>${b.start} - ${b.end}</strong><br>${b.name}</td>`;
      for (let i = 0; i < numDays; i++) html += `<td class="break-row">${b.name}</td>`;
      html += `</tr>`;
    }
  });
  html += `</tbody></table>`;

  document.getElementById('agenda-preview').innerHTML = html;
  window.agendaData = { sessions, dailyData, startDate: startDateStr, numDays, breaks, dateRange, html };
  switchSection('agenda-container');
}

/* === Email & Copy === */
function emailAgenda() {
  const { dateRange, html } = window.agendaData;
  const subject = encodeURIComponent(`Training Agenda: ${dateRange}`);
  const body = encodeURIComponent(`Hello,\n\nPlease find the training agenda below:\n\n${html.replace(/<\/?[^>]+>/g, '').replace(/\n/g, '%0A')}\n\n---\nGenerated with Quick Training Agenda Maker`);
  window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, '_blank');
}

function copyAgenda() {
  const preview = document.getElementById('agenda-preview');
  const range = document.createRange();
  range.selectNode(preview);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  try {
    document.execCommand('copy');
    alert('Agenda copied to clipboard!');
  } catch (err) {
    alert('Copy failed. Try manually.');
  }
  selection.removeAllRanges();
}