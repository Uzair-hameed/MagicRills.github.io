// ============ CONSTANTS ============
const INDICATORS = ["HAND_WASH", "TEETH_CLEAN", "UNIFORM", "NAILS", "HAIR", "GERMS", "COUGH", "TISSUE", "FOOD", "WATER"];
const INDICATOR_NAMES = ["🧼 Hand Wash", "🪥 Teeth Clean", "👕 Clean Uniform", "✂️ Nails Trimmed", "💇 Combed Hair", "🧴 Germ Safety", "🤧 Cough Etiquette", "🧻 Tissue Use", "🍎 Healthy Food", "💧 Water Intake"];
const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_COLORS = ['#2ecc71', '#3498db', '#f1c40f', '#9b59b6', '#e67e22', '#e74c3c'];

// ============ GLOBAL VARIABLES ============
let students = JSON.parse(localStorage.getItem('hygiene_students')) || [];
let currentDay = 'monday';
let analysisResult = null;
let chartInstance = null;
let currentStep = 1;
let uploadedFiles = {};

// ============ HELPER FUNCTIONS ============
function showToast(message, type = 'success') {
    let toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.background = type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3';
    toast.innerHTML = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function goToStep(step) {
    if (step === 2 && students.length === 0) { 
        showToast('Please add at least one student first!', 'error'); 
        return; 
    }
    if (step === 3 && !analysisResult) { 
        document.getElementById('reportCard').style.display = 'none';
    }
    if (step === 4 && !analysisResult) { 
        showToast('Please upload and analyze files first in Step 3!', 'error'); 
        return; 
    }
    
    currentStep = step;
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(`section${step}`).classList.add('active');
    updateProgressStepsUI();
    updateNavButtons();
    
    if (step === 2) renderDailyChecklist();
    if (step === 3) renderUploadStatus();
    if (step === 4 && analysisResult) renderParentShareCards();
}

function navigatePrev() { if (currentStep > 1) goToStep(currentStep - 1); }
function navigateNext() { if (currentStep < 4) goToStep(currentStep + 1); }

function updateProgressStepsUI() {
    let steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        let stepNum = index + 1;
        step.classList.remove('active', 'completed');
        if (stepNum < currentStep) step.classList.add('completed');
        else if (stepNum === currentStep) step.classList.add('active');
    });
    if (students.length > 0) document.querySelector('.step:first-child').classList.add('completed');
    if (analysisResult) document.querySelectorAll('.step')[2].classList.add('completed');
}

function updateNavButtons() {
    let prevBtn = document.getElementById('prevBtn');
    let nextBtn = document.getElementById('nextBtn');
    prevBtn.classList.toggle('disabled', currentStep === 1);
    nextBtn.classList.toggle('disabled', currentStep === 4);
}

// ============ STUDENT MANAGEMENT ============
function updateStudentList() {
    let container = document.getElementById('studentList');
    if (students.length === 0) {
        container.innerHTML = '<p style="color:#999;">No students added yet.</p>';
        return;
    }
    container.innerHTML = students.map((s, idx) => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid #eee;">
            <span><strong>${s.rollNo}</strong> - ${s.name} (${s.class})</span>
            <button class="btn-danger" onclick="removeStudent(${idx})" style="padding:5px 12px;">Remove</button>
        </div>
    `).join('');
}

function addStudent() {
    let name = document.getElementById('studentName').value.trim();
    let rollNo = document.getElementById('rollNo').value.trim();
    let classSection = document.getElementById('classSection').value;
    if (!name || !rollNo) { 
        showToast('Please enter name and roll number', 'error'); 
        return; 
    }
    students.push({ id: Date.now(), name, rollNo, class: classSection });
    localStorage.setItem('hygiene_students', JSON.stringify(students));
    document.getElementById('studentName').value = '';
    document.getElementById('rollNo').value = '';
    updateStudentList();
    updateProgressStepsUI();
    showToast(`✅ Student ${name} added successfully!`);
}

function removeStudent(index) {
    if (confirm('Remove this student?')) {
        students.splice(index, 1);
        localStorage.setItem('hygiene_students', JSON.stringify(students));
        updateStudentList();
        showToast('Student removed');
    }
}

// ============ DAILY CHECKLIST ============
function renderDailyChecklist() {
    let daySelector = document.getElementById('daySelector');
    daySelector.innerHTML = DAY_NAMES.map((dayName, idx) => 
        `<button class="day-btn ${currentDay === DAYS[idx] ? 'active' : ''}" onclick="setCurrentDay('${DAYS[idx]}')">${dayName}</button>`
    ).join('');
    
    if (students.length === 0) {
        document.getElementById('dailyChecklistTable').innerHTML = '<p>No students. Please add students in Step 1.</p>';
        return;
    }
    
    let savedData = JSON.parse(localStorage.getItem(`daily_${currentDay}`)) || {};
    
    let html = '<table><thead><tr><th>Roll No</th><th>Student Name</th><th>Present?</th>';
    INDICATOR_NAMES.forEach(name => html += `<th>${name}</th>`);
    html += '</thead><tbody>';
    
    students.forEach(student => {
        let saved = savedData[student.id] || { present: true, indicators: {} };
        html += `<tr>
            <td>${student.rollNo}</td>
            <td>${student.name}</td>
            <td><input type="checkbox" class="present-checkbox" data-id="${student.id}" ${saved.present ? 'checked' : ''} onchange="toggleIndicators(${student.id}, this.checked)"></td>`;
        INDICATORS.forEach((ind, idx) => {
            let checked = saved.indicators[ind] ? 'checked' : '';
            html += `<td><input type="checkbox" class="indicator-${student.id}" data-ind="${ind}" ${checked} ${!saved.present ? 'disabled' : ''} onchange="saveDailyData()"></td>`;
        });
        html += '</tr>';
    });
    html += '</tbody></table>';
    document.getElementById('dailyChecklistTable').innerHTML = html;
}

function setCurrentDay(day) {
    currentDay = day;
    renderDailyChecklist();
}

function toggleIndicators(studentId, isPresent) {
    let checkboxes = document.querySelectorAll(`.indicator-${studentId}`);
    checkboxes.forEach(cb => {
        cb.disabled = !isPresent;
        if (!isPresent) cb.checked = false;
    });
    saveDailyData();
}

function saveDailyData() {
    let dailyData = {};
    students.forEach(student => {
        let presentCheck = document.querySelector(`.present-checkbox[data-id="${student.id}"]`);
        let present = presentCheck ? presentCheck.checked : true;
        let indicators = {};
        INDICATORS.forEach(ind => {
            let cb = document.querySelector(`.indicator-${student.id}[data-ind="${ind}"]`);
            if (cb) indicators[ind] = cb.checked;
            else indicators[ind] = false;
        });
        dailyData[student.id] = { present, indicators };
    });
    localStorage.setItem(`daily_${currentDay}`, JSON.stringify(dailyData));
}

function saveAndDownloadTXT() {
    saveDailyData();
    let dailyData = JSON.parse(localStorage.getItem(`daily_${currentDay}`)) || {};
    let classVal = students[0]?.class || "Morning Class";
    let date = new Date().toISOString().split('T')[0];
    
    let lines = [`DAY=${currentDay}`, `DATE=${date}`, `CLASS=${classVal}`, `TOTAL_STUDENTS=${students.length}`, ``];
    lines.push(`STUDENT,ROLL,PRESENT,${INDICATORS.join(',')}`);
    
    students.forEach(student => {
        let data = dailyData[student.id] || { present: true, indicators: {} };
        let presentStr = data.present ? "YES" : "NO";
        let indicatorValues = INDICATORS.map(ind => data.indicators[ind] ? 1 : 0).join(',');
        if (!data.present) indicatorValues = INDICATORS.map(() => 0).join(',');
        lines.push(`${student.name},${student.rollNo},${presentStr},${indicatorValues}`);
    });
    
    let content = lines.join('\n');
    let blob = new Blob([content], { type: 'text/plain' });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `hygiene_${currentDay}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast(`✅ Downloaded ${DAY_NAMES[DAYS.indexOf(currentDay)]} checklist!`);
}

// ============ FILE UPLOAD & ANALYSIS ============
function setupFileUpload() {
    let zone = document.getElementById('uploadZone');
    let fileInput = document.getElementById('fileInput');
    if (zone) {
        zone.onclick = () => fileInput.click();
        zone.ondragover = (e) => { e.preventDefault(); zone.classList.add('drag-over'); };
        zone.ondragleave = () => zone.classList.remove('drag-over');
        zone.ondrop = (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            handleFiles(e.dataTransfer.files);
        };
    }
    if (fileInput) fileInput.onchange = (e) => handleFiles(e.target.files);
}

function handleFiles(files) {
    uploadedFiles = {};
    let filesArray = Array.from(files);
    let processed = 0;
    filesArray.forEach(file => {
        let reader = new FileReader();
        reader.onload = (e) => {
            let content = e.target.result;
            let parsed = parseTXTFile(content);
            if (parsed && parsed.day && DAYS.includes(parsed.day)) {
                uploadedFiles[parsed.day] = parsed;
            } else {
                let lowerName = file.name.toLowerCase();
                for (let day of DAYS) {
                    if (lowerName.includes(day)) {
                        parsed.day = day;
                        uploadedFiles[day] = parsed;
                        break;
                    }
                }
            }
            processed++;
            if (processed === filesArray.length) renderUploadStatus();
        };
        reader.readAsText(file);
    });
}

function parseTXTFile(content) {
    const lines = content.split(/\r?\n/);
    let fileData = { day: null, date: null, class: null, totalStudents: 0, records: [] };
    for (let i = 0; i < Math.min(lines.length, 5); i++) {
        let line = lines[i].trim();
        if (line.startsWith('DAY=')) fileData.day = line.substring(4).toLowerCase();
        else if (line.startsWith('DATE=')) fileData.date = line.substring(5);
        else if (line.startsWith('CLASS=')) fileData.class = line.substring(6);
        else if (line.startsWith('TOTAL_STUDENTS=')) fileData.totalStudents = parseInt(line.substring(15)) || 0;
    }
    let headerIndex = lines.findIndex(l => l.includes('STUDENT') && l.includes('ROLL') && l.includes('PRESENT'));
    if (headerIndex === -1) return null;
    for (let i = headerIndex + 1; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) continue;
        let parts = line.split(',');
        if (parts.length >= 13) {
            let record = {
                name: parts[0].trim(),
                rollNo: parts[1].trim(),
                present: parts[2].trim().toUpperCase() === 'YES',
                indicators: {}
            };
            for (let j = 0; j < INDICATORS.length; j++) {
                record.indicators[INDICATORS[j]] = parseInt(parts[3 + j]) === 1;
            }
            fileData.records.push(record);
        }
    }
    return fileData;
}

function renderUploadStatus() {
    let fileList = document.getElementById('uploadedFilesList');
    if (!fileList) return;
    let allFound = DAYS.every(day => uploadedFiles[day]);
    let html = '<div style="background:#e8f5e9; padding:15px; border-radius:8px;"><strong>📁 Uploaded Files:</strong><br><br>';
    for (let day of DAYS) {
        let status = uploadedFiles[day] ? '✅' : '❌';
        let bg = uploadedFiles[day] ? '#4CAF50' : '#f44336';
        let count = uploadedFiles[day] ? ` (${uploadedFiles[day].records.length} students)` : '';
        html += `<span class="file-status" style="background:${bg}; color:white;">${DAY_NAMES[DAYS.indexOf(day)]}: ${status}${count}</span> `;
    }
    html += '</div>';
    if (allFound) html += '<p style="color:green; margin-top:15px;">✅ All 6 files uploaded! Click Analyze.</p>';
    else html += '<p style="color:red;">⚠️ Please upload all 6 days.</p>';
    fileList.innerHTML = html;
    let analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) analyzeBtn.disabled = !allFound;
}

function analyzeAllFiles() {
    if (!DAYS.every(day => uploadedFiles[day])) { 
        showToast('Upload all 6 files first!', 'error'); 
        return; 
    }
    
    let studentMap = new Map();
    for (let day of DAYS) {
        let file = uploadedFiles[day];
        if (file && file.records) {
            file.records.forEach(rec => {
                if (!studentMap.has(rec.rollNo)) {
                    studentMap.set(rec.rollNo, { id: rec.rollNo, name: rec.name, rollNo: rec.rollNo, class: file.class || 'Unknown' });
                }
            });
        }
    }
    
    let studentList = Array.from(studentMap.values());
    let performance = [];
    
    for (let student of studentList) {
        let totalScore = 0;
        let dailyScores = [];
        for (let i = 0; i < DAYS.length; i++) {
            let file = uploadedFiles[DAYS[i]];
            let score = 0;
            let record = file?.records?.find(r => r.rollNo === student.rollNo);
            if (record && record.present) {
                for (let ind of INDICATORS) if (record.indicators[ind]) score++;
            }
            totalScore += score;
            dailyScores.push({ day: DAYS[i], dayName: DAY_NAMES[i], score, color: DAY_COLORS[i] });
        }
        let percentage = Math.round((totalScore / (DAYS.length * INDICATORS.length)) * 100);
        performance.push({ ...student, totalScore, totalPossible: DAYS.length * INDICATORS.length, percentage, dailyScores });
    }
    
    performance.sort((a,b) => b.percentage - a.percentage);
    let hero = performance[0];
    analysisResult = { students: performance, totalStudents: studentList.length, heroOfWeek: hero };
    renderReport();
    document.getElementById('reportCard').style.display = 'block';
    goToStep(3);
    showToast('🎉 Analysis complete! Hero of the week announced!');
}

function renderReport() {
    let hero = analysisResult.heroOfWeek;
    let heroGrade = hero.percentage >= 90 ? '🏆 SUPER HERO' : hero.percentage >= 80 ? '🌟 GOLD HERO' : hero.percentage >= 70 ? '⭐ SILVER HERO' : '💪 BRONZE HERO';
    
    document.getElementById('heroAnnouncement').innerHTML = `
        <div class="hero-announcement">
            <div class="trophy">🏆👑🏆</div>
            <h2>🎉 HERO OF THE WEEK! 🎉</h2>
            <h1 style="font-size:2rem;">${hero.name}</h1>
            <p>Roll No: ${hero.rollNo} | Class: ${hero.class}</p>
            <p style="font-size:1.5rem;">Score: ${hero.percentage}% - ${heroGrade}</p>
            <div class="trophy">🏆👑🏆</div>
        </div>
    `;
    
    let avg = Math.round(analysisResult.students.reduce((a,b)=>a+b.percentage,0)/analysisResult.totalStudents);
    document.getElementById('statsGrid').innerHTML = `
        <div class="stat-box"><h3>📊 Total Students</h3><h2>${analysisResult.totalStudents}</h2></div>
        <div class="stat-box"><h3>🏆 Average Score</h3><h2>${avg}%</h2></div>
        <div class="stat-box"><h3>⭐ Hero Score</h3><h2>${hero.percentage}%</h2></div>
        <div class="stat-box"><h3>📈 Top Performer</h3><h2>${hero.name}</h2></div>
    `;
    
    let ctx = document.getElementById('attendanceChart').getContext('2d');
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: { 
            labels: analysisResult.students.map(s=>s.name), 
            datasets: [{ 
                label: 'Hygiene Score (%)', 
                data: analysisResult.students.map(s=>s.percentage), 
                backgroundColor: analysisResult.students.map(s=>s.id===hero.id?'#FFD700':'#4CAF50'), 
                borderRadius: 10 
            }] 
        },
        options: { 
            responsive: true, 
            scales: { y: { max: 100, title: { display: true, text: 'Percentage (%)' } } } 
        }
    });
    
    let cardsHtml = '';
    for (let s of analysisResult.students) {
        let dailyHtml = s.dailyScores.map(d => `<span style="display:inline-block; width:45px; text-align:center; background:${d.color}; color:white; margin:2px; padding:3px; border-radius:5px;">${d.dayName.substring(0,3)}<br>${d.score}/10</span>`).join('');
        let isHero = s.id === hero.id;
        cardsHtml += `<div class="student-card ${isHero ? 'hero-card' : ''}" style="background: linear-gradient(135deg, ${DAY_COLORS[0]}, ${DAY_COLORS[5]});">
            ${isHero ? '<div class="hero-badge">🏆<br>HERO</div>' : ''}
            <h4>📋 ${s.name} (${s.rollNo})</h4>
            <div class="score">${s.percentage}% <span style="background:${s.percentage>=80?'#4CAF50':s.percentage>=60?'#FFC107':'#f44336'}; padding:2px 8px; border-radius:20px;">${s.percentage>=90?'A+':s.percentage>=80?'A':s.percentage>=70?'B':'C'}</span></div>
            <div style="margin:10px 0;">${dailyHtml}</div>
            <div>📊 Score: ${s.totalScore}/${s.totalPossible}</div>
        </div>`;
    }
    document.getElementById('studentCardsContainer').innerHTML = cardsHtml;
}

// ============ PARENT SHARE ============
function renderParentShareCards() {
    if (!analysisResult) return;
    let hero = analysisResult.heroOfWeek;
    let container = document.getElementById('parentShareCards');
    container.innerHTML = analysisResult.students.map(s => {
        let isHero = s.id === hero.id;
        return `<div class="student-card" style="background: linear-gradient(135deg, #667eea, #764ba2);">
            ${isHero ? '<div class="hero-badge">🏆 HERO</div>' : ''}
            <h4>👧 ${s.name}</h4>
            <p>Roll No: ${s.rollNo} | Class: ${s.class}</p>
            <p>📊 Weekly Score: <strong>${s.percentage}%</strong></p>
            <p>🏅 ${s.percentage >= 80 ? 'Excellent 🌟' : s.percentage >= 60 ? 'Good 👍' : 'Needs Improvement 📖'}</p>
            <div style="margin-top:10px; display:flex; gap:5px; flex-wrap:wrap;">
                <input type="text" id="phone-${s.id}" placeholder="WhatsApp No. (e.g., 923001234567)" style="flex:1; padding:8px; border-radius:8px; border:none;">
                <button class="btn-accent" onclick="sendWhatsApp(${s.id})">📱 Send</button>
            </div>
        </div>`;
    }).join('');
}

function sendWhatsApp(studentId) {
    let student = analysisResult.students.find(s => s.id == studentId);
    let phone = document.getElementById(`phone-${studentId}`).value.trim();
    if (!phone) { 
        showToast('Enter WhatsApp number', 'error'); 
        return; 
    }
    let breakdown = student.dailyScores.map(d => `${d.dayName}: ${d.score}/10`).join('\n');
    let msg = `📋 *Weekly Hygiene Report - ${student.name}*\n\n🏆 Overall Score: ${student.percentage}%\n\n📅 Daily Breakdown:\n${breakdown}\n\n${student.percentage>=80?'🎉 Great job! Keep it up!':'💪 Keep practicing hygiene at home!'}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    showToast(`📱 Opening WhatsApp for ${student.name}`);
}

// ============ EXPORT FUNCTIONS ============
function exportReportPDF() {
    if (!analysisResult) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setTextColor(76, 175, 80);
    doc.text('Weekly Hygiene Report', 105, 20, { align: 'center' });
    
    let hero = analysisResult.heroOfWeek;
    doc.setFontSize(14);
    doc.setTextColor(255, 215, 0);
    doc.text(`🏆 HERO: ${hero.name} (${hero.percentage}%)`, 105, 35, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    let y = 55;
    
    for (let s of analysisResult.students) {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFillColor(s.id === hero.id ? 255 : 52, s.id === hero.id ? 215 : 152, s.id === hero.id ? 0 : 219);
        doc.rect(14, y - 5, 180, 25, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text(`${s.name} (${s.rollNo})${s.id === hero.id ? ' - HERO!' : ''}`, 20, y);
        doc.setTextColor(0, 0, 0);
        doc.text(`Score: ${s.percentage}%`, 20, y + 10);
        y += 30;
    }
    
    doc.save('Hygiene_Report.pdf');
    showToast('📄 PDF Report Downloaded!');
}

function exportReportExcel() {
    if (!analysisResult) return;
    
    let data = analysisResult.students.map(s => ({
        'Student Name': s.name,
        'Roll Number': s.rollNo,
        'Class': s.class,
        'Weekly Score (%)': s.percentage,
        'Monday Score': s.dailyScores[0]?.score || 0,
        'Tuesday Score': s.dailyScores[1]?.score || 0,
        'Wednesday Score': s.dailyScores[2]?.score || 0,
        'Thursday Score': s.dailyScores[3]?.score || 0,
        'Friday Score': s.dailyScores[4]?.score || 0,
        'Saturday Score': s.dailyScores[5]?.score || 0,
        'Total Score': s.totalScore,
        'Grade': s.percentage >= 90 ? 'A+' : s.percentage >= 80 ? 'A' : s.percentage >= 70 ? 'B' : 'C'
    }));
    
    let ws = XLSX.utils.json_to_sheet(data);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hygiene Report');
    XLSX.writeFile(wb, 'Hygiene_Report.xlsx');
    showToast('📊 Excel Report Downloaded!');
}

function exportReportDOC() {
    if (!analysisResult) return;
    
    let hero = analysisResult.heroOfWeek;
    let html = `
        <html>
        <head>
            <title>Weekly Hygiene Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                h1 { color: #4CAF50; text-align: center; }
                .hero { background: gold; padding: 20px; text-align: center; border-radius: 10px; margin-bottom: 30px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                th { background: #4CAF50; color: white; }
                .score-high { background: #4CAF50; color: white; }
            </style>
        </head>
        <body>
            <h1>📋 Weekly Hygiene Report</h1>
            <div class="hero">
                <h2>🏆 HERO OF THE WEEK 🏆</h2>
                <h3>${hero.name} (${hero.rollNo})</h3>
                <p>Score: ${hero.percentage}%</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Roll No</th>
                        <th>Class</th>
                        <th>Weekly Score</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    ${analysisResult.students.map(s => `
                        <tr>
                            <td>${s.name}</td>
                            <td>${s.rollNo}</td>
                            <td>${s.class}</td>
                            <td>${s.percentage}%</td>
                            <td>${s.percentage >= 90 ? 'A+' : s.percentage >= 80 ? 'A' : s.percentage >= 70 ? 'B' : 'C'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <p style="margin-top: 30px; text-align: center;">Generated on: ${new Date().toLocaleString()}</p>
        </body>
        </html>
    `;
    
    let blob = new Blob([html], { type: 'application/msword' });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Hygiene_Report.doc';
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('📝 DOC Report Downloaded!');
}

function printReport() { 
    window.print();
    showToast('🖨️ Sending to printer...');
}

// ============ SCROLL & SHARE ============
function setupScrollButtons() {
    const scrollUpBtn = document.getElementById('scrollUpBtn');
    const scrollDownBtn = document.getElementById('scrollDownBtn');
    const homeBtn = document.getElementById('homeBtn');
    const pageShareBtn = document.getElementById('pageShareBtn');
    
    scrollDownBtn?.addEventListener('click', () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        showToast('📜 Scrolling to bottom');
    });
    
    scrollUpBtn?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast('📜 Scrolling to top');
    });
    
    homeBtn?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        goToStep(1);
        showToast('🏠 Back to Home');
    });
    
    pageShareBtn?.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href);
        showToast('🔗 Link copied to clipboard!');
        
        let shareCount = localStorage.getItem('page_share_count') || 0;
        shareCount = parseInt(shareCount) + 1;
        localStorage.setItem('page_share_count', shareCount);
    });
    
    window.addEventListener('scroll', () => {
        if (scrollUpBtn) {
            scrollUpBtn.style.display = window.scrollY > 200 ? 'flex' : 'none';
        }
    });
}

// ============ INITIALIZATION ============
function init() {
    updateStudentList();
    updateProgressStepsUI();
    updateNavButtons();
    setupFileUpload();
    setupScrollButtons();
    
    if (students.length > 0) renderDailyChecklist();
    
    // Event Listeners
    document.getElementById('addStudentBtn')?.addEventListener('click', addStudent);
    document.getElementById('prevBtn')?.addEventListener('click', navigatePrev);
    document.getElementById('nextBtn')?.addEventListener('click', navigateNext);
    document.getElementById('saveTxtBtn')?.addEventListener('click', saveAndDownloadTXT);
    document.getElementById('analyzeBtn')?.addEventListener('click', analyzeAllFiles);
    document.getElementById('exportPdfBtn')?.addEventListener('click', exportReportPDF);
    document.getElementById('exportExcelBtn')?.addEventListener('click', exportReportExcel);
    document.getElementById('exportDocBtn')?.addEventListener('click', exportReportDOC);
    document.getElementById('printBtn')?.addEventListener('click', printReport);
}

// Make functions global for HTML onclick
window.removeStudent = removeStudent;
window.setCurrentDay = setCurrentDay;
window.toggleIndicators = toggleIndicators;
window.saveDailyData = saveDailyData;
window.sendWhatsApp = sendWhatsApp;

// Start the app
init();
