/* export-pdf.js */
window.exportToPDF = function () {
  if (!window.agendaData) return alert('Generate agenda first!');

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('l', 'mm', 'a4');
  const { dateRange, sessions, dailyData, numDays, breaks, startDate: startDateStr } = window.agendaData;
  const startDate = new Date(startDateStr);

  doc.setFontSize(20);
  doc.text('Training Schedule', 148, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.text(dateRange, 148, 30, { align: 'center' });

  const head = [['Time']];
  for (let d = 1; d <= numDays; d++) {
    const day = new Date(startDate);
    day.setDate(day.getDate() + d - 1);
    const ds = day.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });
    head[0].push(`Day ${d} (${ds})`);
  }

  const body = [];
  const events = [];
  sessions.forEach((s, i) => events.push({ type: 'session', index: i, time: s.start }));
  breaks.forEach(b => events.push({ type: 'break', data: b, time: b.start }));
  events.sort((a, b) => a.time.localeCompare(b.time));

  events.forEach(e => {
    if (e.type === 'session') {
      const i = e.index;
      const row = [`${sessions[i].start} - ${sessions[i].end}`];
      for (let d = 0; d < numDays; d++) {
        const sess = dailyData[d][i];
        row.push(`${sess.title}\n${sess.bullets.join('\n')}\nTrainer: ${sess.trainer}`);
      }
      body.push(row);
    } else {
      const b = e.data;
      const row = [`${b.start} - ${b.end}\n${b.name}`];
      for (let i = 0; i < numDays; i++) row.push(b.name);
      body.push(row);
    }
  });

  doc.autoTable({
    head,
    body,
    startY: 40,
    theme: 'grid',
    headStyles: { fillColor: [78, 107, 240] },
    columnStyles: { 0: { cellWidth: 30 } },
    styles: { fontSize: 10, cellPadding: 3 }
  });

  doc.save('training-agenda.pdf');
};