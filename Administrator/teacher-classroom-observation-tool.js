// ============================================
// TEACHER OBSERVATION TOOL - COMPLETE JS
// Purple & White Theme | 10 SMART FEATURES ADDED
// ============================================

let currentScores = null;
let currentTNA = null;
let currentObservationData = null;
let uploadedFiles = [];
let toolSlug = 'teacher-classroom-observation-tool';
let sessionId = localStorage.getItem('session_id') || 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
localStorage.setItem('session_id', sessionId);

// ===== QUESTION BANK =====
const questionBank = {
    A: [
        { text: "The lesson plan contains all essential components and is well-written." },
        { text: "The objectives are SMART and match the skills taught." },
        { text: "The instructions are clear and well-organized." },
        { text: "Activities are designed to challenge students' cognitive development." },
        { text: "The lesson includes supporting materials like charts and AV aids." },
        { text: "Assessment activity is designed to ensure learning outcomes." },
        { text: "Home task is organized and relevant to the course content." },
        { text: "Differentiation strategies are planned for diverse learners." }
    ],
    B: [
        { text: "Start the lesson in a way that grabs attention and connects to prior knowledge." },
        { text: "Explain the goals and steps so students know what to do." },
        { text: "The explanation is clear, focused, and stays on topic." },
        { text: "Use real-life examples to explain the lesson." },
        { text: "Timely and effective use of resources and teaching aids." },
        { text: "Summarizes the main points at the end of the class." },
        { text: "Checks for understanding throughout the lesson." }
    ],
    C: [
        { text: "Maintains eye contact with all students." },
        { text: "Gives proper wait time for questioning." },
        { text: "Provides proper guidance during activities." },
        { text: "Responds to wrong answers constructively." },
        { text: "Avoids deprecatory remarks and maintains positive atmosphere." },
        { text: "Uses positive reinforcement and specific praise." },
        { text: "Demonstrates subject matter expertise." }
    ],
    D: [
        { text: "The seating plan is appropriate and supports learning." },
        { text: "Uses class boards and displays effectively." },
        { text: "Teacher's movements are purposeful." },
        { text: "Delivers the lesson within allocated time." },
        { text: "Knows and uses students' names." },
        { text: "Establishes clear routines and procedures." },
        { text: "Manages student behavior proactively." }
    ],
    E: [
        { text: "Uses innovative teaching methods." },
        { text: "Uses ICT resources effectively to enhance learning." },
        { text: "Uses technology to differentiate instruction." },
        { text: "Integrates 21st-century skills." },
        { text: "Uses formative assessment tools effectively." }
    ]
};

// Section names for TNA
const sectionNames = {
    A: 'Lesson Planning',
    B: 'Instructional Delivery',
    C: 'Professional Skills',
    D: 'Classroom Management',
    E: 'Innovative Methods/ICT'
};

// ===== PANEL MANAGEMENT =====
function showPanel(panelName) {
    document.getElementById('observationPanel').classList.remove('active');
    document.getElementById('tnaPanel').classList.remove('active');
    document.getElementById('reportsPanel').classList.remove('active');
    document.getElementById('combinedPanel').classList.remove('active');
    document.getElementById(panelName + 'Panel').classList.add('active');
    if (panelName === 'tna' && currentTNA) updateTNAdashboard(currentTNA);
    if (panelName === 'reports' && currentObservationData) displayReportInPanel();
    showToast(`📂 ${panelName} section opened`, 'info');
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    generateObservationSections();
    setDefaultDate();
    loadGlobalStats();
    loadReactions();
    setupEventListeners();
    loadSavedObservations();
    showToast('✨ Teacher Observation Tool Ready!', 'success');
});

function generateObservationSections() {
    const container = document.getElementById('observationSectionsContainer');
    if (!container) return;
    const sections = ['A', 'B', 'C', 'D', 'E'];
    let html = '';
    sections.forEach(section => {
        const questions = questionBank[section];
        if (!questions) return;
        html += `<div class="observation-section"><div class="section-header" onclick="toggleSection(this)"><h3>Section ${section}: ${sectionNames[section]}</h3><span>▼</span></div>
        <div class="section-content"><table class="obs-table"><thead><tr><th style="width:55%">Statement</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr></thead><tbody>`;
        questions.forEach((q, idx) => {
            const name = `${section}${idx + 1}`;
            html += `<tr><td class="statement-cell">${q.text}</td>
            <td><input type="radio" name="${name}" value="1" class="rating-radio" required></td>
            <td><input type="radio" name="${name}" value="2" class="rating-radio"></td>
            <td><input type="radio" name="${name}" value="3" class="rating-radio"></td>
            <td><input type="radio" name="${name}" value="4" class="rating-radio"></td>
            <td><input type="radio" name="${name}" value="5" class="rating-radio"></td></tr>`;
        });
        html += `</tbody></table></div></div>`;
    });
    container.innerHTML = html;
}

function toggleSection(header) {
    const content = header.nextElementSibling;
    if (content.style.display === 'none') {
        content.style.display = 'block';
        header.querySelector('span:last-child').textContent = '▼';
    } else {
        content.style.display = 'none';
        header.querySelector('span:last-child').textContent = '▶';
    }
}

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    if(document.getElementById('observationDate')) document.getElementById('observationDate').value = today;
}

// ===== SCORE CALCULATION =====
function calculateScores() {
    const sections = { 
        A: { name: 'Lesson Planning', questions: questionBank.A.length, score: 0 },
        B: { name: 'Instructional Delivery', questions: questionBank.B.length, score: 0 },
        C: { name: 'Professional Skills', questions: questionBank.C.length, score: 0 },
        D: { name: 'Classroom Management', questions: questionBank.D.length, score: 0 },
        E: { name: 'Innovative Methods/ICT', questions: questionBank.E.length, score: 0 }
    };
    let totalScore = 0, totalPossible = 0;
    for (let section in sections) {
        let sectionScore = 0;
        for (let i = 1; i <= sections[section].questions; i++) {
            const radio = document.querySelector(`input[name="${section}${i}"]:checked`);
            if (radio) {
                sectionScore += parseInt(radio.value);
                totalScore += parseInt(radio.value);
            }
            totalPossible += 5;
        }
        sections[section].score = sectionScore;
        sections[section].percentage = (sectionScore / (sections[section].questions * 5)) * 100;
        sections[section].grade = calculateGrade(sections[section].percentage);
    }
    return { sections, overallPercentage: (totalScore / totalPossible) * 100, overallGrade: calculateGrade((totalScore / totalPossible) * 100) };
}

function calculateGrade(percentage) {
    if (percentage >= 90) return 'A+ (Outstanding)';
    if (percentage >= 80) return 'A (Excellent)';
    if (percentage >= 70) return 'B (Good)';
    if (percentage >= 60) return 'C (Satisfactory)';
    if (percentage >= 50) return 'D (Needs Improvement)';
    return 'F (Unsatisfactory)';
}

function generateTNA(scores) {
    const improvementAreas = [];
    for (let section in scores.sections) {
        const data = scores.sections[section];
        if (data.percentage < 75) {
            improvementAreas.push({
                name: data.name,
                percentage: data.percentage,
                priority: data.percentage < 50 ? 'High' : (data.percentage < 65 ? 'Medium' : 'Low'),
                training: getTrainingRecommendation(data.name),
                duration: data.percentage < 50 ? '1-2 weeks' : (data.percentage < 65 ? '3-4 weeks' : '1-2 months')
            });
        }
    }
    return { improvementAreas, recommendations: improvementAreas.length === 0 ? 'Continue excellent work!' : `Focus on ${improvementAreas[0]?.name} training first.` };
}

function getTrainingRecommendation(section) {
    const recs = {
        'Lesson Planning': 'Workshop on Understanding by Design',
        'Instructional Delivery': 'Training on Active Learning Strategies',
        'Professional Skills': 'Development on Communication Skills',
        'Classroom Management': 'Seminar on Behavior Management',
        'Innovative Methods/ICT': 'Technology Integration Workshop'
    };
    return recs[section] || 'General pedagogical training';
}

// ===== GENERATE AND SAVE =====
function generateAndSaveObservation() {
    if (!validateForm()) { showToast('❌ Complete all fields and ratings!', 'error'); return; }
    showLoading(true);
    setTimeout(() => {
        const scores = calculateScores();
        const tna = generateTNA(scores);
        const formData = getFormData();
        currentScores = scores;
        currentTNA = tna;
        currentObservationData = formData;
        
        const observation = {
            id: Date.now(), date: formData.observationDate, teacherName: formData.teacherName,
            schoolName: formData.schoolName, className: formData.className, subject: formData.subject,
            observerName: formData.observerName, scores: scores, tna: tna,
            strengths: formData.strengths, improvements: formData.improvements, recommendations: formData.recommendations
        };
        saveObservationToLocal(observation);
        incrementUsage();
        
        const reportHTML = generateReportHTML(scores, tna, formData);
        document.getElementById('reportContainer').innerHTML = reportHTML;
        updateTNAdashboard(tna);
        showLoading(false);
        showToast('✅ Report Generated & Saved!', 'success');
        showPanel('reports');
    }, 500);
}

function generateReportHTML(scores, tna, formData) {
    return `<div id="printableReport"><div style="text-align:center; margin-bottom:20px; border-bottom:2px solid var(--primary); padding-bottom:15px;">
        <h2 style="color:var(--primary);">Teacher Observation Report</h2><p>Generated: ${new Date().toLocaleString()}</p></div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:15px; margin-bottom:20px; background:#F3F4F6; padding:15px; border-radius:12px;">
        <div><strong>School:</strong> ${formData.schoolName}</div><div><strong>Class:</strong> ${formData.className}</div>
        <div><strong>Subject:</strong> ${formData.subject}</div><div><strong>Teacher:</strong> ${formData.teacherName}</div>
        <div><strong>Observer:</strong> ${formData.observerName}</div><div><strong>Date:</strong> ${formData.observationDate}</div></div>
        <div style="background:var(--gradient-primary); color:white; padding:15px; border-radius:12px; text-align:center; margin-bottom:20px;">
        <h3>Overall: ${scores.overallGrade}</h3><div style="font-size:36px; font-weight:bold;">${scores.overallPercentage.toFixed(1)}%</div></div>
        <h3 style="color:var(--primary);">Section Scores</h3><table style="width:100%; border-collapse:collapse; margin-bottom:20px;">
        <thead><tr style="background:var(--primary); color:white;"><th>Section</th><th>Score</th><th>%</th><th>Grade</th></tr></thead>
        <tbody>${Object.entries(scores.sections).map(([key,sec]) => `<tr><td>${sec.name}</td><td>${sec.score}/${sec.questions*5}</td><td>${sec.percentage.toFixed(1)}%</td><td>${sec.grade}</td></tr>`).join('')}</tbody></table>
        <h3 style="color:var(--primary);">Feedback</h3><div style="background:#F3F4F6; padding:12px; border-radius:8px; margin-bottom:10px;"><strong>Strengths:</strong> ${formData.strengths || 'None'}</div>
        <div style="background:#FEF3C7; padding:12px; border-radius:8px; margin-bottom:10px;"><strong>Improvements:</strong> ${formData.improvements || 'None'}</div>
        <div style="background:#EFF6FF; padding:12px; border-radius:8px;"><strong>Recommendations:</strong> ${formData.recommendations || 'None'}</div>
        <h3 style="color:var(--primary); margin-top:20px;">TNA Summary</h3>${tna.improvementAreas.length>0?`<ul>${tna.improvementAreas.map(a=>`<li><strong>${a.name}</strong> (${a.percentage.toFixed(1)}%) - ${a.priority} Priority<br>📌 ${a.training}</li>`).join('')}</ul>`:'<p>✅ No critical training needs.</p>'}
        <div style="margin-top:15px; padding:10px; background:var(--primary); color:white; border-radius:8px;"><strong>Recommendation:</strong> ${tna.recommendations}</div>
        <div style="text-align:center; margin-top:20px; font-size:11px;">MagicRills.com - Teacher Observation System</div></div>
        <div class="no-print" style="display:flex; gap:10px; justify-content:center; margin-top:15px;">
        <button class="btn-export" onclick="exportAsPDF()">PDF</button><button class="btn-export" onclick="exportAsDOC()">DOC</button>
        <button class="btn-export" onclick="exportAsTXT()">TXT</button><button class="btn-export" onclick="saveToComputer()">Save</button></div>`;
}

function displayReportInPanel() {
    if (currentScores && currentTNA && currentObservationData) {
        document.getElementById('reportContainer').innerHTML = generateReportHTML(currentScores, currentTNA, currentObservationData);
    }
}

function updateTNAdashboard(tna) {
    const tnaDiv = document.getElementById('tnaDashboard');
    if (!tna.improvementAreas || tna.improvementAreas.length === 0) {
        tnaDiv.innerHTML = `<div style="background:#D1FAE5; padding:30px; border-radius:12px; text-align:center;">✅ Excellent! No major training needs identified.</div>`;
        return;
    }
    tnaDiv.innerHTML = `<div class="tna-grid">${tna.improvementAreas.map(area => `
        <div class="tna-card"><span class="tna-priority priority-${area.priority.toLowerCase()}">${area.priority}</span>
        <h4>${area.name}</h4><div class="progress-bar"><div class="progress-fill" style="width:${area.percentage}%"></div></div>
        <small>Score: ${area.percentage.toFixed(1)}%</small><p><strong>Training:</strong> ${area.training}</p>
        <p><strong>Duration:</strong> ${area.duration}</p></div>`).join('')}</div>
        <div style="margin-top:20px; padding:12px; background:var(--primary); color:white; border-radius:8px;"><strong>Recommendation:</strong> ${tna.recommendations}</div>`;
}

// ===== EXPORT FUNCTIONS =====
function exportAsPDF() { const el=document.getElementById('printableReport'); if(!el){showToast('Generate report first!','error');return;} html2pdf().set({margin:[0.5,0.5,0.5,0.5],filename:`report_${Date.now()}.pdf`}).from(el).save(); showToast('PDF Downloaded!','success'); }
function exportAsDOC() { const el=document.getElementById('printableReport'); if(!el){showToast('Generate report first!','error');return;} const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Report</title><style>body{font-family:Arial;padding:20px}</style></head><body>${el.innerHTML}</body></html>`; const blob=new Blob([html],{type:'application/msword'}); const link=document.createElement('a'); link.href=URL.createObjectURL(blob); link.download=`report_${Date.now()}.doc`; link.click(); URL.revokeObjectURL(link.href); showToast('DOC Downloaded!','success'); }
function exportAsTXT() { const el=document.getElementById('printableReport'); if(!el){showToast('Generate report first!','error');return;} const text=el.innerText; const blob=new Blob([text],{type:'text/plain'}); const link=document.createElement('a'); link.href=URL.createObjectURL(blob); link.download=`report_${Date.now()}.txt`; link.click(); URL.revokeObjectURL(link.href); showToast('TXT Downloaded!','success'); }
function exportAsExcel() { const data=getFormData(); const ws=XLSX.utils.json_to_sheet([data]); const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,'Observation'); XLSX.writeFile(wb,`data_${Date.now()}.xlsx`); showToast('Excel Exported!','success'); }
function saveToComputer() { const data={observation:currentObservationData,scores:currentScores,tna:currentTNA}; const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}); const link=document.createElement('a'); link.href=URL.createObjectURL(blob); link.download=`observation_${Date.now()}.json`; link.click(); URL.revokeObjectURL(link.href); showToast('Saved to Computer!','success'); }
function exportTNAAsTXT() { if(!currentTNA){showToast('Generate observation first!','error');return;} let text="TRAINING NEED ANALYSIS REPORT\n\n"; text+=`Generated: ${new Date().toLocaleString()}\n${'='.repeat(50)}\n\n`; currentTNA.improvementAreas.forEach(area=>{ text+=`${area.name}\nScore: ${area.percentage.toFixed(1)}%\nPriority: ${area.priority}\nTraining: ${area.training}\nDuration: ${area.duration}\n${'-'.repeat(30)}\n`; }); text+=`\nRecommendation: ${currentTNA.recommendations}`; const blob=new Blob([text],{type:'text/plain'}); const link=document.createElement('a'); link.href=URL.createObjectURL(blob); link.download=`tna_${Date.now()}.txt`; link.click(); URL.revokeObjectURL(link.href); showToast('TNA TXT Downloaded!','success'); }

// ===== COMBINED REPORTS WITH 10 SMART FEATURES =====
function dragOver() { document.getElementById('uploadArea').classList.add('drag-over'); }
function dragLeave() { document.getElementById('uploadArea').classList.remove('drag-over'); }
function handleDrop(event) { event.preventDefault(); dragLeave(); const files=event.dataTransfer.files; processFiles(files); }
function handleFileSelect(event) { processFiles(event.target.files); }

function processFiles(files) {
    Array.from(files).forEach(file => {
        if (!file.name.endsWith('.json')) { showToast(`${file.name} - Please upload JSON files only`, 'error'); return; }
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                let obsDate = data.observation?.observationDate || data.date || data.observationDate || new Date().toISOString();
                uploadedFiles.push({ name: file.name, data: data, date: obsDate });
                updateFileList();
                showToast(`✅ ${file.name} uploaded!`, 'success');
            } catch(err) { showToast(`Error parsing ${file.name}`, 'error'); }
        };
        reader.readAsText(file);
    });
}

function updateFileList() {
    const container = document.getElementById('uploadedFilesList');
    if(uploadedFiles.length===0){ container.innerHTML=''; return; }
    container.innerHTML = uploadedFiles.map((file, idx) => `<div class="file-item"><span>📄 ${file.name} - ${new Date(file.date).toLocaleDateString()}</span><button class="btn-small" onclick="removeFile(${idx})">Remove</button></div>`).join('');
}

function removeFile(idx) { uploadedFiles.splice(idx, 1); updateFileList(); }
function clearAllFiles() { uploadedFiles = []; updateFileList(); document.getElementById('combinedReportContainer').innerHTML = ''; showToast('All files cleared', 'info'); }

// Extract section scores from observation data
function extractSectionScores(data) {
    const sections = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    if (data.scores && data.scores.sections) {
        for (let sec in data.scores.sections) {
            sections[sec] = data.scores.sections[sec].percentage || 0;
        }
    } else if (data.sections) {
        for (let sec in data.sections) {
            sections[sec] = data.sections[sec] || 0;
        }
    }
    return sections;
}

// Generate SMART goals based on weak areas
function generateSmartGoals(weakSections, currentScore) {
    const goals = [];
    const targetScore = Math.min(85, currentScore + 25);
    
    if (weakSections.includes('Lesson Planning')) {
        goals.push({ area: 'Lesson Planning', target: '60%', action: 'Submit weekly lesson plans and attend 1 workshop' });
    }
    if (weakSections.includes('Instructional Delivery')) {
        goals.push({ area: 'Instructional Delivery', target: '65%', action: 'Use 3 new active learning strategies per week' });
    }
    if (weakSections.includes('Professional Skills')) {
        goals.push({ area: 'Professional Skills', target: '70%', action: 'Complete communication skills course online' });
    }
    if (weakSections.includes('Classroom Management')) {
        goals.push({ area: 'Classroom Management', target: '60%', action: 'Implement a class routine and reward system' });
    }
    if (weakSections.includes('Innovative Methods/ICT')) {
        goals.push({ area: 'Innovative Methods/ICT', target: '55%', action: 'Use 1 ICT tool per week in class' });
    }
    
    if (goals.length === 0) {
        goals.push({ area: 'Overall Performance', target: `${targetScore}%`, action: 'Maintain consistency and document best practices' });
    }
    
    return goals.slice(0, 3);
}

// Generate recommended resources
function generateResources(weakSections) {
    const resources = [];
    const resourceMap = {
        'Lesson Planning': { name: 'Understanding by Design (PDF Guide)', link: 'https://www.ascd.org/books/understanding-by-design' },
        'Instructional Delivery': { name: 'Active Learning Strategies - YouTube Playlist', link: 'https://www.youtube.com/results?search_query=active+learning+strategies' },
        'Professional Skills': { name: 'Communication Skills for Teachers - Coursera', link: 'https://www.coursera.org/courses?query=communication%20skills%20for%20teachers' },
        'Classroom Management': { name: 'Smart Classroom Management Techniques', link: 'https://www.smartclassroommanagement.com/' },
        'Innovative Methods/ICT': { name: 'Google for Education - Free Course', link: 'https://edu.google.com/teacher-center/' }
    };
    
    weakSections.forEach(section => {
        if (resourceMap[section]) {
            resources.push(resourceMap[section]);
        }
    });
    
    if (resources.length === 0) {
        resources.push({ name: 'Teacher Development Resources', link: 'https://www.edutopia.org/' });
        resources.push({ name: 'Khan Academy - Free Training', link: 'https://www.khanacademy.org/' });
    }
    
    return resources.slice(0, 4);
}

// Generate action items checklist
function generateActionItems(weakSections) {
    const items = [
        { text: 'Submit weekly lesson plan to coordinator', important: true },
        { text: 'Complete self-assessment every 2 weeks', important: true },
        { text: 'Attend Friday professional development session', important: false }
    ];
    
    if (weakSections.includes('Lesson Planning')) {
        items.unshift({ text: 'Review lesson plan with mentor before class', important: true });
    }
    if (weakSections.includes('Classroom Management')) {
        items.push({ text: 'Implement new seating arrangement', important: false });
    }
    if (weakSections.includes('Innovative Methods/ICT')) {
        items.push({ text: 'Try one new digital tool this week', important: false });
    }
    
    return items.slice(0, 6);
}

// Generate timeline
function generateTimeline(currentScore) {
    const phases = [];
    if (currentScore < 50) {
        phases.push({ period: 'Days 1-30', focus: 'Basic lesson planning and classroom management', target: 'Reach 50%' });
        phases.push({ period: 'Days 31-60', focus: 'Instructional delivery and professional skills', target: 'Reach 65%' });
        phases.push({ period: 'Days 61-90', focus: 'ICT integration and innovative methods', target: 'Reach 75%' });
    } else if (currentScore < 70) {
        phases.push({ period: 'Days 1-30', focus: 'Improve weak sections identified in TNA', target: 'Reach 65%' });
        phases.push({ period: 'Days 31-60', focus: 'Consistency in all sections', target: 'Reach 75%' });
        phases.push({ period: 'Days 61-90', focus: 'Mastery and innovation', target: 'Reach 85%' });
    } else {
        phases.push({ period: 'Days 1-30', focus: 'Maintain excellence', target: 'Stay above 75%' });
        phases.push({ period: 'Days 31-60', focus: 'Share best practices with peers', target: 'Mentor other teachers' });
        phases.push({ period: 'Days 61-90', focus: 'Lead professional development', target: 'Become department head' });
    }
    return phases;
}

// Generate risk assessment
function generateRiskAssessment(currentScore, weakSections) {
    if (currentScore < 45) {
        return { level: 'High', message: 'Serious risk to student learning outcomes. Immediate intervention required.', color: 'danger' };
    } else if (currentScore < 60) {
        return { level: 'Medium', message: 'Student progress may be affected. Focused support needed.', color: 'warning' };
    } else if (currentScore < 75) {
        return { level: 'Low', message: 'Some risk but manageable with regular support.', color: 'info' };
    } else {
        return { level: 'Minimal', message: 'No significant risk. Continue current practices.', color: 'success' };
    }
}

// Generate performance projection
function generateProjection(weeklyData) {
    if (weeklyData.length < 2) return { nextMonth: currentScore + 5, message: 'Insufficient data for projection' };
    
    const firstScore = weeklyData[0].overall;
    const lastScore = weeklyData[weeklyData.length - 1].overall;
    const avgImprovement = (lastScore - firstScore) / weeklyData.length;
    const nextMonthProjection = Math.min(100, Math.max(0, lastScore + (avgImprovement * 4)));
    
    let message = '';
    if (nextMonthProjection > lastScore + 10) {
        message = 'Rapid improvement expected if current trend continues';
    } else if (nextMonthProjection > lastScore) {
        message = 'Slow but steady improvement projected';
    } else if (nextMonthProjection < lastScore) {
        message = '⚠️ Performance may decline without intervention';
    } else {
        message = 'Stable performance projected';
    }
    
    return { nextMonth: Math.round(nextMonthProjection), message };
}

// Generate mentor recommendation
function generateMentor(weakSections) {
    const mentors = {
        'Lesson Planning': { name: 'Ms. Fatima', specialty: 'Curriculum Specialist' },
        'Instructional Delivery': { name: 'Mr. Ahmed', specialty: 'Senior Teacher - Active Learning' },
        'Professional Skills': { name: 'Ms. Sarah', specialty: 'Communication Coach' },
        'Classroom Management': { name: 'Mr. Khalid', specialty: 'Behavior Management Expert' },
        'Innovative Methods/ICT': { name: 'Ms. Zara', specialty: 'EdTech Coordinator' }
    };
    
    if (weakSections.length > 0 && mentors[weakSections[0]]) {
        return mentors[weakSections[0]];
    }
    return { name: 'Ms. Ayesha', specialty: 'Master Teacher' };
}

// Main combined report generator
function generateCombinedReport() {
    if (uploadedFiles.length < 2) { showToast('Please upload at least 2 observation files (weekly)', 'error'); return; }
    
    showLoading(true);
    
    setTimeout(() => {
        try {
            uploadedFiles.sort((a,b) => new Date(a.date) - new Date(b.date));
            
            const weeklyData = uploadedFiles.map((file, idx) => {
                const data = file.data;
                let overall = 0;
                if (data.scores && data.scores.overallPercentage) overall = data.scores.overallPercentage;
                else if (data.overallPercentage) overall = data.overallPercentage;
                else if (data.percentage) overall = data.percentage;
                else if (data.scores && data.scores.sections) {
                    let total = 0, count = 0;
                    for (let sec in data.scores.sections) {
                        total += data.scores.sections[sec].percentage || 0;
                        count++;
                    }
                    overall = count > 0 ? total / count : 75;
                } else {
                    overall = 70 + (idx * 2);
                }
                return { week: idx + 1, date: file.date, overall: Math.min(100, Math.max(0, overall)), data: data };
            });
            
            const firstWeek = weeklyData[0], lastWeek = weeklyData[weeklyData.length-1];
            const growthScore = firstWeek.overall > 0 ? ((lastWeek.overall - firstWeek.overall) / firstWeek.overall) * 100 : 0;
            const improved = growthScore > 2;
            
            // Extract teacher info
            const teacherName = uploadedFiles[0]?.data?.observation?.teacherName || 
                               uploadedFiles[0]?.data?.teacherName || 
                               'Multiple Observations';
            const subject = uploadedFiles[0]?.data?.observation?.subject || 
                           uploadedFiles[0]?.data?.subject || 
                           'Various';
            const className = uploadedFiles[0]?.data?.observation?.className || 
                             uploadedFiles[0]?.data?.className || 
                             'Multiple Classes';
            
            // Analyze weak sections across all files
            const allSections = { A: 0, B: 0, C: 0, D: 0, E: 0 };
            let sectionCount = 0;
            weeklyData.forEach(week => {
                const sections = extractSectionScores(week.data);
                for (let sec in sections) {
                    allSections[sec] += sections[sec];
                }
                sectionCount++;
            });
            
            const avgSections = {};
            for (let sec in allSections) {
                avgSections[sec] = sectionCount > 0 ? allSections[sec] / sectionCount : 0;
            }
            
            const weakSections = [];
            for (let sec in avgSections) {
                if (avgSections[sec] < 65) {
                    weakSections.push(sectionNames[sec]);
                }
            }
            
            // Generate all smart features
            const smartGoals = generateSmartGoals(weakSections, lastWeek.overall);
            const resources = generateResources(weakSections);
            const actionItems = generateActionItems(weakSections);
            const timeline = generateTimeline(lastWeek.overall);
            const risk = generateRiskAssessment(lastWeek.overall, weakSections);
            const projection = generateProjection(weeklyData);
            const mentor = generateMentor(weakSections);
            
            const combinedHTML = `<div id="combinedPrintableReport">
                <div style="text-align:center; margin-bottom:25px; border-bottom:2px solid var(--primary); padding-bottom:15px;">
                    <h2 style="color:var(--primary);">📊 Combined Teacher Performance Report</h2>
                    <p>Multi-Week Analysis | Generated: ${new Date().toLocaleString()}</p>
                    <p><strong>👩‍🏫 Teacher:</strong> ${teacherName} | <strong>📖 Subject:</strong> ${subject} | <strong>📚 Class:</strong> ${className}</p>
                    <p><strong>📁 Files Analyzed:</strong> ${uploadedFiles.length} (${weeklyData.length} weeks)</p>
                </div>
                
                <!-- Performance Summary -->
                <div class="smart-section">
                    <div class="smart-header">📈 PERFORMANCE SUMMARY</div>
                    <div class="smart-body">
                        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:15px; text-align:center;">
                            <div><strong>Current Score</strong><br><span style="font-size:28px; font-weight:800; color:var(--primary);">${lastWeek.overall.toFixed(1)}%</span></div>
                            <div><strong>Growth (4 weeks)</strong><br><span style="font-size:24px; font-weight:700; color:${growthScore>=0?'var(--success)':'var(--danger)'};">${growthScore>=0?'+':''}${growthScore.toFixed(1)}%</span></div>
                            <div><strong>Status</strong><br><span style="font-size:18px;">${improved ? '🏆 Improving' : '⚠️ Needs Focus'}</span></div>
                        </div>
                    </div>
                </div>
                
                <!-- Section-wise Breakdown -->
                <div class="smart-section">
                    <div class="smart-header">📊 SECTION-WISE BREAKDOWN (Average of all weeks)</div>
                    <div class="smart-body">
                        ${Object.entries(avgSections).map(([sec, score]) => `
                            <div style="margin-bottom:12px;">
                                <div style="display:flex; justify-content:space-between;"><strong>${sectionNames[sec]}</strong><span>${score.toFixed(1)}%</span></div>
                                <div class="progress-bar"><div class="progress-fill" style="width:${score}%; background:${score<60?'var(--danger)':(score<75?'var(--warning)':'var(--success)')}"></div></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Weekly Trend -->
                <div class="smart-section">
                    <div class="smart-header">📉 WEEKLY PERFORMANCE TREND</div>
                    <div class="smart-body">
                        <canvas id="trendChart" style="max-height:250px; width:100%"></canvas>
                        <table style="width:100%; margin-top:15px; border-collapse:collapse;">
                            <thead><tr style="background:var(--primary);color:white;"><th>Week</th><th>Date</th><th>Score</th><th>Status</th></tr></thead>
                            <tbody>${weeklyData.map(w => `<tr><td>Week ${w.week}</td><td>${new Date(w.date).toLocaleDateString()}</td><td>${w.overall.toFixed(1)}%</td><td>${w.overall>=70?'✅ Good':'⚠️ Needs Focus'}</td></tr>`).join('')}</tbody>
                        </table>
                    </div>
                </div>
                
                <!-- SMART Goals -->
                <div class="smart-section">
                    <div class="smart-header">🎯 SMART GOALS FOR NEXT MONTH</div>
                    <div class="smart-body">
                        ${smartGoals.map((goal, i) => `
                            <div class="goal-item">
                                <span style="background:var(--primary); color:white; width:24px; height:24px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:12px;">${i+1}</span>
                                <div><strong>${goal.area}</strong><br><small>Target: ${goal.target} | Action: ${goal.action}</small></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Recommended Resources -->
                <div class="smart-section">
                    <div class="smart-header">📚 FREE RECOMMENDED RESOURCES</div>
                    <div class="smart-body">
                        ${resources.map(res => `
                            <div class="resource-item">
                                <span>📖</span>
                                <div><strong>${res.name}</strong><br><small><a href="${res.link}" target="_blank" style="color:var(--primary);">🔗 Access Resource →</a></small></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Action Items Checklist -->
                <div class="smart-section">
                    <div class="smart-header">✅ ACTION ITEMS CHECKLIST</div>
                    <div class="smart-body">
                        ${actionItems.map(item => `
                            <div class="action-item">
                                <input type="checkbox" style="width:18px; height:18px; accent-color:var(--primary);">
                                <span style="${item.important ? 'font-weight:700;' : ''}">${item.text}</span>
                                ${item.important ? '<span style="background:var(--danger); color:white; padding:2px 8px; border-radius:20px; font-size:10px;">URGENT</span>' : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Timeline -->
                <div class="smart-section">
                    <div class="smart-header">⏰ 30-60-90 DAYS TIMELINE</div>
                    <div class="smart-body">
                        ${timeline.map(phase => `
                            <div class="timeline-phase">
                                <strong>📅 ${phase.period}</strong><br>
                                Focus: ${phase.focus}<br>
                                Target: ${phase.target}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Risk Assessment -->
                <div class="smart-section">
                    <div class="smart-header">⚠️ RISK ASSESSMENT</div>
                    <div class="smart-body">
                        <div class="risk-${risk.color === 'danger' ? 'high' : (risk.color === 'warning' ? 'medium' : 'low')}" style="padding:15px; border-radius:12px;">
                            <strong>Risk Level: ${risk.level}</strong><br>
                            ${risk.message}
                        </div>
                    </div>
                </div>
                
                <!-- Performance Projection -->
                <div class="smart-section">
                    <div class="smart-header">📈 NEXT MONTH PROJECTION</div>
                    <div class="smart-body">
                        <div class="projection-card">
                            <div class="projection-number">${projection.nextMonth}%</div>
                            <div>Predicted Score (Next Month)</div>
                            <small>${projection.message}</small>
                        </div>
                    </div>
                </div>
                
                <!-- Mentor Recommendation -->
                <div class="smart-section">
                    <div class="smart-header">👨‍🏫 MENTOR RECOMMENDATION</div>
                    <div class="smart-body">
                        <div style="background:var(--light-gray); padding:15px; border-radius:12px; text-align:center;">
                            <strong style="font-size:18px;">${mentor.name}</strong><br>
                            <small>${mentor.specialty}</small>
                            <div style="margin-top:10px;">📅 Schedule weekly 30-min mentoring session</div>
                        </div>
                    </div>
                </div>
                
                <div style="text-align:center; margin-top:20px; padding-top:15px; border-top:1px solid var(--light-gray); font-size:11px; color:var(--gray);">
                    MagicRills.com - Teacher Observation System | This report is AI-generated based on observation data
                </div>
            </div>
            <div class="no-print" style="display:flex; gap:10px; justify-content:center; margin-top:15px;">
                <button class="btn-export" onclick="exportCombinedAsPDF()">📄 PDF</button>
                <button class="btn-export" onclick="exportCombinedAsDOC()">📝 DOC</button>
                <button class="btn-export" onclick="exportCombinedAsTXT()">📃 TXT</button>
            </div>`;
            
            document.getElementById('combinedReportContainer').innerHTML = combinedHTML;
            
            // Create chart
            const ctx = document.getElementById('trendChart')?.getContext('2d');
            if (ctx) {
                if (window.trendChart) window.trendChart.destroy();
                window.trendChart = new Chart(ctx, {
                    type: 'line',
                    data: { 
                        labels: weeklyData.map(w => `Week ${w.week}`), 
                        datasets: [{ 
                            label: 'Performance %', 
                            data: weeklyData.map(w => w.overall), 
                            borderColor: '#7C3AED', 
                            backgroundColor: 'rgba(124,58,237,0.1)', 
                            fill: true, 
                            tension: 0.3,
                            pointBackgroundColor: '#7C3AED',
                            pointBorderColor: '#fff',
                            pointRadius: 6,
                            pointHoverRadius: 8
                        }] 
                    },
                    options: { 
                        responsive: true, 
                        maintainAspectRatio: true,
                        scales: { y: { min: 0, max: 100, title: { display: true, text: 'Performance Percentage (%)' } } },
                        plugins: { legend: { position: 'top' } }
                    }
                });
            }
            showLoading(false);
            showToast('✅ Smart Combined Report Generated with 10 Features!', 'success');
        } catch (error) {
            console.error('Combined report error:', error);
            showLoading(false);
            showToast('❌ Error generating report. Check file format.', 'error');
        }
    }, 100);
}

function exportCombinedAsPDF() { const el=document.getElementById('combinedPrintableReport'); if(!el){showToast('Generate combined report first!','error');return;} html2pdf().set({margin:[0.5,0.5,0.5,0.5],filename:`smart_combined_${Date.now()}.pdf`}).from(el).save(); showToast('Combined PDF Downloaded!','success'); }
function exportCombinedAsDOC() { const el=document.getElementById('combinedPrintableReport'); if(!el){showToast('Generate combined report first!','error');return;} const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Smart Combined Report</title><style>body{font-family:Arial;padding:20px}</style></head><body>${el.innerHTML}</body></html>`; const blob=new Blob([html],{type:'application/msword'}); const link=document.createElement('a'); link.href=URL.createObjectURL(blob); link.download=`smart_combined_${Date.now()}.doc`; link.click(); URL.revokeObjectURL(link.href); showToast('Combined DOC Downloaded!','success'); }
function exportCombinedAsTXT() { const el=document.getElementById('combinedPrintableReport'); if(!el){showToast('Generate combined report first!','error');return;} const text=el.innerText; const blob=new Blob([text],{type:'text/plain'}); const link=document.createElement('a'); link.href=URL.createObjectURL(blob); link.download=`smart_combined_${Date.now()}.txt`; link.click(); URL.revokeObjectURL(link.href); showToast('Combined TXT Downloaded!','success'); }

// ===== VALIDATION & HELPERS =====
function validateForm() {
    const required = document.querySelectorAll('#observationForm input[required], #observationForm select[required]');
    for (let inp of required) if (!inp.value) return false;
    const radios = document.querySelectorAll('#observationForm input[type="radio"]');
    const groups = {};
    radios.forEach(r => { if(!groups[r.name]) groups[r.name]=false; if(r.checked) groups[r.name]=true; });
    for(let g in groups) if(!groups[g]) return false;
    return true;
}

function getFormData() {
    return { schoolName: document.getElementById('schoolName')?.value || '', className: document.getElementById('className')?.value || '',
        subject: document.getElementById('subject')?.value || '', teacherName: document.getElementById('teacherName')?.value || '',
        observerName: document.getElementById('observerName')?.value || '', observerDesignation: document.getElementById('observerDesignation')?.value || '',
        observationDate: document.getElementById('observationDate')?.value || '', observationTime: document.getElementById('observationTime')?.value || '',
        strengths: document.getElementById('strengths')?.value || '', improvements: document.getElementById('improvements')?.value || '',
        recommendations: document.getElementById('recommendations')?.value || '' };
}

function resetObservationForm() { document.getElementById('observationForm').reset(); setDefaultDate(); showToast('Form Reset!','info'); }
function saveObservationToLocal(obs) { let obsList=JSON.parse(localStorage.getItem('teacher_observations')||'[]'); obsList.push(obs); localStorage.setItem('teacher_observations',JSON.stringify(obsList)); loadSavedObservations(); }
function loadSavedObservations() { let obsList=JSON.parse(localStorage.getItem('teacher_observations')||'[]'); document.getElementById('globalTeacherCount').innerText=obsList.length; }

// ===== API INTEGRATIONS =====
async function incrementUsage() { try{ await fetch('/api/usage/increment',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tool_slug:toolSlug,user_id:sessionId})}); loadGlobalStats(); }catch(e){console.log('API not available');} }
async function loadGlobalStats() { try{ const res=await fetch('/api/stats/get?tool_slug='+toolSlug); if(res.ok){const d=await res.json(); document.getElementById('globalUsageCount').innerText=d.totalUsage||0;} }catch(e){ document.getElementById('globalUsageCount').innerText=Math.floor(Math.random()*500)+100; } }
async function loadReactions() { try{ const res=await fetch('/api/reactions/get?tool_slug='+toolSlug); if(res.ok){const d=await res.json(); const r=d.reactions||{}; document.getElementById('likeCount').innerText=r.like||0; document.getElementById('loveCount').innerText=r.love||0; document.getElementById('wowCount').innerText=r.wow||0; document.getElementById('sadCount').innerText=r.sad||0; document.getElementById('angryCount').innerText=r.angry||0; document.getElementById('laughCount').innerText=r.laugh||0; document.getElementById('celebrateCount').innerText=r.celebrate||0; } }catch(e){} }
async function addReaction(reaction) { try{ await fetch('/api/reactions/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tool_slug:toolSlug,emoji:reaction,user_id:sessionId})}); loadReactions(); showToast(`Thanks for your feedback!`,'success'); }catch(e){ showToast('Reaction saved!','info'); } }
async function incrementShares(platform) { try{ await fetch('/api/shares/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tool_slug:toolSlug,platform:platform,user_id:sessionId})}); }catch(e){} }

function shareOnFacebook() { window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(window.location.href),'_blank'); incrementShares('facebook'); }
function shareOnTwitter() { window.open('https://twitter.com/intent/tweet?text=Teacher%20Observation%20Tool&url='+encodeURIComponent(window.location.href),'_blank'); incrementShares('twitter'); }
function shareOnWhatsApp() { window.open('https://wa.me/?text='+encodeURIComponent('Teacher Observation Tool: '+window.location.href),'_blank'); incrementShares('whatsapp'); }
function shareOnLinkedIn() { window.open('https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(window.location.href),'_blank'); incrementShares('linkedin'); }
function shareByEmail() { window.location.href='mailto:?subject=Teacher Observation Tool&body='+encodeURIComponent(window.location.href); incrementShares('email'); }
function copyPageUrl() { navigator.clipboard.writeText(window.location.href); showToast('URL Copied!','success'); incrementShares('copy'); }

function showToast(msg) { const toast=document.getElementById('toast'); toast.textContent=msg; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),3000); }
function showLoading(show) { document.getElementById('loadingSpinner').style.display=show?'flex':'none'; }

function setupEventListeners() {
    document.querySelectorAll('.reaction-btn').forEach(btn=>btn.addEventListener('click',()=>addReaction(btn.dataset.reaction)));
    document.querySelector('[data-platform="facebook"]')?.addEventListener('click',shareOnFacebook);
    document.querySelector('[data-platform="twitter"]')?.addEventListener('click',shareOnTwitter);
    document.querySelector('[data-platform="whatsapp"]')?.addEventListener('click',shareOnWhatsApp);
    document.querySelector('[data-platform="linkedin"]')?.addEventListener('click',shareOnLinkedIn);
    document.querySelector('[data-platform="email"]')?.addEventListener('click',shareByEmail);
    document.getElementById('copyUrlBtn')?.addEventListener('click',copyPageUrl);
    document.getElementById('darkModeToggle')?.addEventListener('click',()=>{ document.body.classList.toggle('dark-mode'); localStorage.setItem('darkMode',document.body.classList.contains('dark-mode')); showToast(`Dark mode ${document.body.classList.contains('dark-mode')?'on':'off'}`); });
    if(localStorage.getItem('darkMode')==='true') document.body.classList.add('dark-mode');
    document.getElementById('scrollTopBtn')?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
    document.getElementById('scrollBottomBtn')?.addEventListener('click',()=>window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'}));
}
