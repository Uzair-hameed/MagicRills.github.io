/* export-docx.js - GUARANTEED WORKING VERSION */
window.exportToDOCX = function () {
    if (!window.agendaData) {
        alert('Please generate an agenda first!');
        return;
    }

    const { dateRange, sessions, dailyData, numDays, breaks, startDate: startDateStr } = window.agendaData;
    const startDate = new Date(startDateStr);

    // Create simple HTML content that Word can open
    let htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' 
              xmlns:w='urn:schemas-microsoft-com:office:word' 
              xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset="utf-8">
            <title>Training Agenda</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { text-align: center; color: #2c3e50; }
                .header { text-align: center; background: #4e6bf0; color: white; padding: 15px; font-size: 18px; font-weight: bold; margin: 20px 0; }
                table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; vertical-align: top; }
                th { background-color: #4e6bf0; color: white; font-weight: bold; }
                .slot1 { background-color: #e3f2fd; }
                .slot2 { background-color: #fff3e0; }
                .break-row td { background-color: #fff8e1; font-style: italic; color: #d35400; font-weight: bold; }
                .session-title { font-weight: bold; color: #4e6bf0; margin-bottom: 5px; }
                .trainer { color: #28a745; font-weight: bold; margin-top: 8px; }
                ul { margin: 5px 0; padding-left: 20px; }
                li { margin-bottom: 3px; }
            </style>
        </head>
        <body>
            <h1>Training Schedule</h1>
            <div class="header">${dateRange}</div>
            <table>
                <thead>
                    <tr>
                        <th>Time</th>
    `;

    // Add day headers
    for (let d = 1; d <= numDays; d++) {
        const day = new Date(startDate);
        day.setDate(day.getDate() + d - 1);
        const ds = day.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });
        htmlContent += `<th>Day ${d}<br><small>${ds}</small></th>`;
    }

    htmlContent += `</tr></thead><tbody>`;

    // Combine sessions and breaks
    const events = [];
    sessions.forEach((s, i) => events.push({ type: 'session', index: i, time: s.start }));
    breaks.forEach(b => events.push({ type: 'break', data: b, time: b.start }));
    events.sort((a, b) => a.time.localeCompare(b.time));

    // Add rows
    events.forEach(event => {
        if (event.type === 'session') {
            const i = event.index;
            const session = sessions[i];
            const rowClass = `slot${(i % 2) + 1}`;
            
            htmlContent += `<tr><td><strong>${session.start} - ${session.end}</strong></td>`;
            
            for (let d = 0; d < numDays; d++) {
                const sess = dailyData[d][i];
                const bullets = sess.bullets.map(b => `<li>${b}</li>`).join('');
                htmlContent += `
                    <td class="${rowClass}">
                        <div class="session-title">${sess.title}</div>
                        <ul>${bullets}</ul>
                        <div class="trainer">${sess.trainer}</div>
                    </td>
                `;
            }
            htmlContent += `</tr>`;
        } else {
            const b = event.data;
            htmlContent += `<tr class="break-row"><td><strong>${b.start} - ${b.end}</strong><br>${b.name}</td>`;
            for (let i = 0; i < numDays; i++) {
                htmlContent += `<td>${b.name}</td>`;
            }
            htmlContent += `</tr>`;
        }
    });

    htmlContent += `</tbody></table></body></html>`;

    // Create and download the file
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'training-agenda.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('Word document downloaded successfully! You can open it in Microsoft Word.');
};