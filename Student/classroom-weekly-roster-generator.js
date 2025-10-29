document.addEventListener('DOMContentLoaded', () => {
    const logoUpload = document.getElementById('logo-upload');
    const schoolLogo = document.getElementById('school-logo');
    const schoolName = document.getElementById('school-name');
    const gradeSelect = document.getElementById('grade-select');
    const studentInputs = document.querySelectorAll('.student-name');
    const dutyInputs = document.querySelectorAll('.duty-names input');
    const aiBtn = document.getElementById('ai-generate');
    const saveBtn = document.getElementById('save-template');
    const loadBtn = document.getElementById('load-template');
    const printBtn = document.getElementById('print-preview');
    const docxBtn = document.getElementById('export-docx');
    const pdfBtn = document.getElementById('export-pdf');
    const rosterOutput = document.getElementById('roster-output');
    const infoText = document.getElementById('info-text');
    const themeToggle = document.getElementById('theme-toggle');

    let rosterData = {};
    let dutyNames = ['Board Cleaner', 'Floor Sweeper', 'Chair Arranger', 'Trash Monitor'];
    const dayColors = {
        monday: '#FF6B6B', tuesday: '#4ECDC4', wednesday: '#45B7D1',
        thursday: '#96CEB4', friday: '#FECA57'
    };

    // Logo Upload
    logoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => schoolLogo.src = ev.target.result;
            reader.readAsDataURL(file);
        }
    });

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        themeToggle.textContent = document.body.classList.contains('dark') ? 'Light Mode' : 'Dark Mode';
    });

    // Duty Names
    dutyInputs.forEach((input, i) => {
        input.value = dutyNames[i];
        input.addEventListener('input', () => dutyNames[i] = input.value.trim() || `Duty ${i + 1}`);
    });

    // AI Generate
    aiBtn.addEventListener('click', () => {
        const grade = gradeSelect.value;
        if (!grade) return alert('Please select a grade!');
        const students = Array.from(studentInputs).map(i => i.value.trim()).filter(Boolean);
        if (students.length < 5) return alert('Enter at least 5 students!');
        rosterData = generateRoster(students);
        renderRoster(rosterData);
    });

    function generateRoster(students) {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        const shuffled = [...students].sort(() => Math.random() - 0.5);
        const roster = {};
        let idx = 0;
        days.forEach(day => {
            roster[day] = [];
            for (let i = 0; i < 4; i++) {
                roster[day].push(shuffled[idx % shuffled.length]);
                idx++;
            }
        });
        return roster;
    }

    function renderRoster(data) {
        rosterOutput.innerHTML = '';
        const dayNames = { monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday' };
        Object.entries(data).forEach(([day, duties]) => {
            const div = document.createElement('div');
            div.className = `day ${day}`;
            div.innerHTML = `<div class="day-header">${dayNames[day]}</div>` +
                duties.map((name, i) => `<div class="duty"><strong>${dutyNames[i]}:</strong> ${name}</div>`).join('');
            rosterOutput.appendChild(div);
        });
    }

    // Save Template
    saveBtn.addEventListener('click', () => {
        const template = {
            schoolName: schoolName.value,
            logo: schoolLogo.src,
            grade: gradeSelect.value,
            students: Array.from(studentInputs).map(i => i.value),
            duties: dutyNames,
            notes: infoText.value
        };
        localStorage.setItem('rosterTemplate', JSON.stringify(template));
        alert('Template saved successfully!');
    });

    // Load Template
    loadBtn.addEventListener('click', () => {
        const saved = localStorage.getItem('rosterTemplate');
        if (!saved) return alert('No saved template found!');
        const t = JSON.parse(saved);
        schoolName.value = t.schoolName || '';
        schoolLogo.src = t.logo || 'https://via.placeholder.com/80/5F27CD/FFFFFF?text=Logo';
        gradeSelect.value = t.grade || '';
        t.students.forEach((n, i) => { if (studentInputs[i]) studentInputs[i].value = n; });
        t.duties.forEach((d, i) => { if (dutyInputs[i]) { dutyInputs[i].value = d; dutyNames[i] = d; } });
        infoText.value = t.notes || '';
        alert('Template loaded successfully!');
    });

    // Print
    printBtn.addEventListener('click', () => window.print());

    // DOCX Export
    docxBtn.addEventListener('click', async () => {
        if (!rosterData || !Object.keys(rosterData).length) return alert('Generate roster first!');
        const { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, ImageRun } = docx;

        const logoBase64 = schoolLogo.src.startsWith('data:') ? schoolLogo.src : null;

        const rows = [
            new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: "Day", bold: true })] }), ...dutyNames.map(d => new TableCell({ children: [new Paragraph({ text: d, bold: true })] }))] }),
            ...Object.entries(rosterData).map(([day, duties]) => 
                new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: day.charAt(0).toUpperCase() + day.slice(1), bold: true })] }), ...duties.map(n => new TableCell({ children: [new Paragraph(n)] }))] })
            )
        ];

        const children = [
            new Paragraph({ text: schoolName.value || "WEEKLY ROSTER", heading: "Heading1", alignment: "center" }),
            new Paragraph({ text: gradeSelect.value.toUpperCase(), alignment: "center" }),
            new Paragraph(" "),
            new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } }),
            new Paragraph(" "),
            new Paragraph({ text: "Notes:", bold: true }),
            new Paragraph(infoText.value || "None")
        ];

        if (logoBase64) {
            children.unshift(new Paragraph({
                children: [new ImageRun({ data: logoBase64.split(',')[1], transformation: { width: 80, height: 80 } })],
                alignment: "center"
            }));
        }

        const doc = new Document({ sections: [{ children }] });
        const blob = await Packer.toBlob(doc);
        saveAs(blob, `Roster_${gradeSelect.value || 'Weekly'}.docx`);
    });

    // PDF Export - Colorful + Logo
    pdfBtn.addEventListener('click', () => {
        if (!rosterData || !Object.keys(rosterData).length) return alert('Generate roster first!');
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Logo
        if (schoolLogo.src && schoolLogo.src.startsWith('data:')) {
            doc.addImage(schoolLogo.src, 'PNG', 15, 10, 25, 25);
        }

        // Header
        doc.setFontSize(22);
        doc.setTextColor(95, 39, 205);
        doc.text(schoolName.value || "WEEKLY ROSTER", pageWidth / 2, 25, { align: 'center' });

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text(gradeSelect.value.toUpperCase(), pageWidth / 2, 35, { align: 'center' });

        let y = 50;
        const dayNames = { monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday' };

        Object.entries(rosterData).forEach(([day, duties]) => {
            const color = dayColors[day];
            const rgb = hexToRgb(color);
            doc.setFillColor(rgb.r, rgb.g, rgb.b);
            doc.rect(15, y - 5, pageWidth - 30, 10, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text(dayNames[day], 20, y + 2);

            doc.setTextColor(0, 0, 0);
            doc.setFont(undefined, 'normal');
            doc.setFontSize(11);
            duties.forEach((d, i) => {
                doc.text(`${dutyNames[i]}: ${d}`, 20, y + 15 + i * 7);
            });
            y += 45;
        });

        doc.setFontSize(12);
        doc.text("Notes:", 15, y);
        doc.setFontSize(10);
        doc.text(infoText.value || "None", 15, y + 8, { maxWidth: pageWidth - 30 });

        doc.save(`Roster_${gradeSelect.value || 'Weekly'}.pdf`);
    });

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
    }
});