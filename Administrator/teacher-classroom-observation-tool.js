// ============================================
// TEACHER OBSERVATION TOOL - CLOUDFLARE API
// Dark Space Theme | MagicRills.com
// Version: 4.0
// ============================================

let currentScores = null;
let currentTNA = null;
let currentObservationData = null;
let uploadedFiles = [];
let toolSlug = 'teacher-classroom-observation-tool';

// ===== SESSION MANAGEMENT =====
let sessionId = localStorage.getItem('session_id') || 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
localStorage.setItem('session_id', sessionId);

// ===== CLOUDFLARE API CONFIG =====
const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';
const API_KEY = 'magicrills-grok-api.uzairhameed01.workers.dev';

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

const sectionNames = {
    A: 'Lesson Planning',
    B: 'Instructional Delivery',
    C: 'Professional Skills',
    D: 'Classroom Management',
    E: 'Innovative Methods/ICT'
};

// ============================================
// TYPEWRITER ANIMATION
// ============================================
const typewriterPhrases = [
    'Empowering educators with AI-driven insights',
    'Real-time classroom observation & analytics',
    'Smart TNA & professional development tracking',
    'Data-driven teacher evaluation system',
    'Transforming education with technology'
];

let typewriterIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typewriterTimeout;

function typewriterEffect() {
    const textElement = document.getElementById('typewriterText');
    if (!textElement) return;
    
    const currentPhrase = typewriterPhrases[typewriterIndex];
    
    if (!isDeleting) {
        textElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        
        if (charIndex === currentPhrase.length) {
            isDeleting = true;
            typewriterTimeout = setTimeout(typewriterEffect, 2000);
            return;
        }
    } else {
        textElement.textContent = currentPhrase.substring(0, charIndex);
        charIndex--;
        
        if (charIndex === 0) {
            isDeleting = false;
            typewriterIndex = (typewriterIndex + 1) % typewriterPhrases.length;
            typewriterTimeout = setTimeout(typewriterEffect, 500);
            return;
        }
    }
    
    const delay = isDeleting ? 30 : 60;
    typewriterTimeout = setTimeout(typewriterEffect, delay);
}

// ============================================
// PARTICLES
// ============================================
function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;
    
    for (let i = 0; i < 25; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 6 + 3;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        const colors = ['rgba(139,92,246,0.2)', 'rgba(6,182,212,0.15)', 'rgba(244,114,182,0.15)', 'rgba(167,139,250,0.15)'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        container.appendChild(particle);
    }
}

// ============================================
// PANEL MANAGEMENT
// ============================================
function showPanel(panelName) {
    document.getElementById('observationPanel').classList.remove('active');
    document.getElementById('tnaPanel').classList.remove('active');
    document.getElementById('reportsPanel').classList.remove('active');
    document.getElementById('combinedPanel').classList.remove('active');
    document.getElementById(panelName + 'Panel').classList.add('active');
    if (panelName === 'tna' && currentTNA) updateTNAdashboard(currentTNA);
    if (panelName === 'reports' && currentObservationData) displayReportInPanel();
    showToast('📂 ' + panelName + ' section opened', 'info');
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    generateObservationSections();
    setDefaultDate();
    loadGlobalStats();
    loadReactions();
    loadSharesFromLocal();
    setupEventListeners();
    loadSavedObservations();
    createParticles();
    
    // Start typewriter
    setTimeout(typewriterEffect, 500);
    
    showToast('✨ Teacher Observation Tool Ready!', 'success');
    
    // Footer year
    document.getElementById('footerYear').textContent = new Date().getFullYear();
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

// ============================================
// SCORE CALCULATION
// ============================================
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

// ============================================
// GENERATE AND SAVE
// ============================================
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
    return `<div id="printableReport"><div style="text-align:center; margin-bottom:20px; border-bottom:1px solid var(--border-glass); padding-bottom:15px;">
        <h2 style="color:var(--primary-light);">📋 Teacher Observation Report</h2><p style="color:var(--text-muted);">Generated: ${new Date().toLocaleString()}</p></div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:15px; margin-bottom:20px; background:var(--bg-glass); padding:15px; border-radius:12px; border:1px solid var(--border-glass);">
        <div><strong>School:</strong> ${formData.schoolName}</div><div><strong>Class:</strong> ${formData.className}</div>
        <div><strong>Subject:</strong> ${formData.subject}</div><div><strong>Teacher:</strong> ${formData.teacherName}</div>
        <div><strong>Observer:</strong> ${formData.observerName}</div><div><strong>Date:</strong> ${formData.observationDate}</div></div>
        <div style="background:linear-gradient(135deg,rgba(139,92,246,0.15),rgba(6,182,212,0.1)); border:1px solid var(--border-glass); padding:20px; border-radius:12px; text-align:center; margin-bottom:20px;">
        <h3 style="color:var(--text-primary);">Overall Grade: ${scores.overallGrade}</h3><div style="font-size:36px; font-weight:900; background:linear-gradient(135deg,var(--primary-light),var(--secondary)); -webkit-background-clip:text; background-clip:text; color:transparent;">${scores.overallPercentage.toFixed(1)}%</div></div>
        <h3 style="color:var(--primary-light);">📊 Section Scores</h3><table style="width:100%; border-collapse:collapse; margin-bottom:20px; border:1px solid var(--border-glass);">
        <thead><tr style="background:var(--bg-glass);"><th style="padding:10px;text-align:left;">Section</th><th style="padding:10px;text-align:center;">Score</th><th style="padding:10px;text-align:center;">%</th><th style="padding:10px;text-align:center;">Grade</th></tr></thead>
        <tbody>${Object.entries(scores.sections).map(([key,sec]) => `<tr><td style="padding:8px 10px;border-bottom:1px solid var(--border-glass);">${sec.name}</td><td style="padding:8px 10px;text-align:center;border-bottom:1px solid var(--border-glass);">${sec.score}/${sec.questions*5}</td><td style="padding:8px 10px;text-align:center;border-bottom:1px solid var(--border-glass);">${sec.percentage.toFixed(1)}%</td><td style="padding:8px 10px;text-align:center;border-bottom:1px solid var(--border-glass);">${sec.grade}</td></tr>`).join('')}</tbody></table>
        <h3 style="color:var(--primary-light);">💬 Feedback</h3><div style="background:var(--bg-glass); padding:12px; border-radius:8px; margin-bottom:10px; border:1px solid var(--border-glass);"><strong>⭐ Strengths:</strong> ${formData.strengths || 'None'}</div>
        <div style="background:rgba(245,158,11,0.05); padding:12px; border-radius:8px; margin-bottom:10px; border:1px solid rgba(245,158,11,0.2);"><strong>⚠️ Improvements:</strong> ${formData.improvements || 'None'}</div>
        <div style="background:rgba(139,92,246,0.05); padding:12px; border-radius:8px; border:1px solid var(--border-glass);"><strong>💡 Recommendations:</strong> ${formData.recommendations || 'None'}</div>
        <h3 style="color:var(--primary-light); margin-top:20px;">📈 TNA Summary</h3>${tna.improvementAreas.length>0?`<ul style="list-style:none;padding:0;">${tna.improvementAreas.map(a=>`<li style="padding:10px;background:var(--bg-glass);border-radius:8px;margin-bottom:8px;border:1px solid var(--border-glass);"><strong>${a.name}</strong> (${a.percentage.toFixed(1)}%) - <span style="color:${a.priority==='High'?'#EF4444':(a.priority==='Medium'?'#F59E0B':'#10B981')};">${a.priority}</span> Priority<br>📌 ${a.training}</li>`).join('')}</ul>`:'<p style="color:var(--text-muted);">✅ No critical training needs identified.</p>'}
        <div style="margin-top:15px; padding:12px; background:linear-gradient(135deg,rgba(139,92,246,0.15),rgba(6,182,212,0.1)); border:1px solid var(--border-glass); border-radius:8px;"><strong>📌 Recommendation:</strong> ${tna.recommendations}</div>
        <div style="text-align:center; margin-top:20px; font-size:11px; color:var(--text-muted);">MagicRills.com · Teacher Observation System</div></div>
        <div class="no-print" style="display:flex; gap:10px; justify-content:center; margin-top:15px; flex-wrap:wrap;">
        <button class="btn-export" onclick="exportAsPDF()">📄 PDF</button>
        <button class="btn-export" onclick="exportAsDOC()">📝 DOC</button>
        <button class="btn-export" onclick="exportAsTXT()">📃 TXT</button>
        <button class="btn-export" onclick="saveToComputer()">💾 Save</button></div>`;
}

function displayReportInPanel() {
    if (currentScores && currentTNA && currentObservationData) {
        document.getElementById('reportContainer').innerHTML = generateReportHTML(currentScores, currentTNA, currentObservationData);
    }
}

function updateTNAdashboard(tna) {
    const tnaDiv = document.getElementById('tnaDashboard');
    if (!tna.improvementAreas || tna.improvementAreas.length === 0) {
        tnaDiv.innerHTML = `<div style="background:rgba(16,185,129,0.1); padding:30px; border-radius:12px; text-align:center; border:1px solid rgba(16,185,129,0.2);">✅ Excellent! No major training needs identified.</div>`;
        return;
    }
    tnaDiv.innerHTML = `<div class="tna-grid">${tna.improvementAreas.map(area => `
        <div class="tna-card"><span class="tna-priority priority-${area.priority.toLowerCase()}">${area.priority}</span>
        <h4>${area.name}</h4><div class="progress-bar"><div class="progress-fill" style="width:${area.percentage}%"></div></div>
        <small style="color:var(--text-muted);">Score: ${area.percentage.toFixed(1)}%</small><p style="margin-top:8px;"><strong>Training:</strong> ${area.training}</p>
        <p style="color:var(--text-muted);font-size:0.85rem;"><strong>Duration:</strong> ${area.duration}</p></div>`).join('')}</div>
        <div style="margin-top:20px; padding:12px; background:linear-gradient(135deg,rgba(139,92,246,0.15),rgba(6,182,212,0.1)); border-radius:8px; border:1px solid var(--border-glass);"><strong>📌 Recommendation:</strong> ${tna.recommendations}</div>`;
}

// ============================================
// EXPORT FUNCTIONS
// ============================================
function exportAsPDF() { const el=document.getElementById('printableReport'); if(!el){showToast('Generate report first!','error');return;} html2pdf().set({margin:[0.5,0.5,0.5,0.5],filename:`report_${Date.now()}.pdf`}).from(el).save(); showToast('PDF Downloaded!','success'); }
function exportAsDOC() { const el=document.getElementById('printableReport'); if(!el){showToast('Generate report first!','error');return;} const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Report</title><style>body{font-family:Arial;padding:20px}</style></head><body>${el.innerHTML}</body></html>`; const blob=new Blob([html],{type:'application/msword'}); const link=document.createElement('a'); link.href=URL.createObjectURL(blob); link.download=`report_${Date.now()}.doc`; link.click(); URL.revokeObjectURL(link.href); showToast('DOC Downloaded!','success'); }
function exportAsTXT() { const el=document.getElementById('printableReport'); if(!el){showToast('Generate report first!','error');return;} const text=el.innerText; const blob=new Blob([text],{type:'text/plain'}); const link=document.createElement('a'); link.href=URL.createObjectURL(blob); link.download=`report_${Date.now()}.txt`; link.click(); URL.revokeObjectURL(link.href); showToast('TXT Downloaded!','success'); }
function exportAsExcel() { const data=getFormData(); const ws=XLSX.utils.json_to_sheet([data]); const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,'Observation'); XLSX.writeFile(wb,`data_${Date.now()}.xlsx`); showToast('Excel Exported!','success'); }
function saveToComputer() { const data={observation:currentObservationData,scores:currentScores,tna:currentTNA}; const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}); const link=document.createElement('a'); link.href=URL.createObjectURL(blob); link.download=`observation_${Date.now()}.json`; link.click(); URL.revokeObjectURL(link.href); showToast('Saved to Computer!','success'); }
function exportTNAAsTXT() { if(!currentTNA){showToast('Generate observation first!','error');return;} let text="TRAINING NEED ANALYSIS REPORT\n\n"; text+=`Generated: ${new Date().toLocaleString()}\n${'='.repeat(50)}\n\n`; currentTNA.improvementAreas.forEach(area=>{ text+=`${area.name}\nScore: ${area.percentage.toFixed(1)}%\nPriority: ${area.priority}\nTraining: ${area.training}\nDuration: ${area.duration}\n${'-'.repeat(30)}\n`; }); text+=`\nRecommendation: ${currentTNA.recommendations}`; const blob=new Blob([text],{type:'text/plain'}); const link=document.createElement('a'); link.href=URL.createObjectURL(blob); link.download=`tna_${Date.now()}.txt`; link.click(); URL.revokeObjectURL(link.href); showToast('TNA TXT Downloaded!','success'); }

// ============================================
// COMBINED REPORTS
// ============================================
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

function generateProjection(weeklyData) {
    if (weeklyData.length < 2) return { nextMonth: 75, message: 'Insufficient data for projection' };
    
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
            
            const teacherName = uploadedFiles[0]?.data?.observation?.teacherName || 
                               uploadedFiles[0]?.data?.teacherName || 
                               'Multiple Observations';
            const subject = uploadedFiles[0]?.data?.observation?.subject || 
                           uploadedFiles[0]?.data?.subject || 
                           'Various';
            const className = uploadedFiles[0]?.data?.observation?.className || 
                             uploadedFiles[0]?.data?.className || 
                             'Multiple Classes';
            
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
            
            const smartGoals = generateSmartGoals(weakSections, lastWeek.overall);
            const resources = generateResources(weakSections);
            const actionItems = generateActionItems(weakSections);
            const timeline = generateTimeline(lastWeek.overall);
            const risk = generateRiskAssessment(lastWeek.overall, weakSections);
            const projection = generateProjection(weeklyData);
            const mentor = generateMentor(weakSections);
            
            const combinedHTML = `<div id="combinedPrintableReport">
                <div style="text-align:center; margin-bottom:25px; border-bottom:1px solid var(--border-glass); padding-bottom:15px;">
                    <h2 style="color:var(--primary-light);">📊 Combined Teacher Performance Report</h2>
                    <p style="color:var(--text-muted);">Multi-Week Analysis | Generated: ${new Date().toLocaleString()}</p>
                    <p><strong>👩‍🏫 Teacher:</strong> ${teacherName} | <strong>📖 Subject:</strong> ${subject} | <strong>📚 Class:</strong> ${className}</p>
                    <p style="color:var(--text-muted);font-size:0.85rem;"><strong>📁 Files Analyzed:</strong> ${uploadedFiles.length} (${weeklyData.length} weeks)</p>
                </div>
                
                <div class="smart-section">
                    <div class="smart-header">📈 PERFORMANCE SUMMARY</div>
                    <div class="smart-body">
                        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:15px; text-align:center;">
                            <div><strong>Current Score</strong><br><span style="font-size:28px; font-weight:900; background:linear-gradient(135deg,var(--primary-light),var(--secondary)); -webkit-background-clip:text; background-clip:text; color:transparent;">${lastWeek.overall.toFixed(1)}%</span></div>
                            <div><strong>Growth</strong><br><span style="font-size:24px; font-weight:700; color:${growthScore>=0?'#10B981':'#EF4444'};">${growthScore>=0?'+':''}${growthScore.toFixed(1)}%</span></div>
                            <div><strong>Status</strong><br><span style="font-size:18px;">${improved ? '🏆 Improving' : '⚠️ Needs Focus'}</span></div>
                        </div>
                    </div>
                </div>
                
                <div class="smart-section">
                    <div class="smart-header">📊 SECTION-WISE BREAKDOWN (Average of all weeks)</div>
                    <div class="smart-body">
                        ${Object.entries(avgSections).map(([sec, score]) => `
                            <div style="margin-bottom:12px;">
                                <div style="display:flex; justify-content:space-between;"><strong>${sectionNames[sec]}</strong><span>${score.toFixed(1)}%</span></div>
                                <div class="progress-bar"><div class="progress-fill" style="width:${score}%; background:${score<60?'#EF4444':(score<75?'#F59E0B':'linear-gradient(90deg,var(--primary),var(--secondary))')}"></div></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="smart-section">
                    <div class="smart-header">📉 WEEKLY PERFORMANCE TREND</div>
                    <div class="smart-body">
                        <canvas id="trendChart" style="max-height:250px; width:100%; background:var(--bg-glass); border-radius:8px;"></canvas>
                        <table style="width:100%; margin-top:15px; border-collapse:collapse; border:1px solid var(--border-glass);">
                            <thead><tr style="background:var(--bg-glass);"><th style="padding:8px;">Week</th><th style="padding:8px;">Date</th><th style="padding:8px;">Score</th><th style="padding:8px;">Status</th></tr></thead>
                            <tbody>${weeklyData.map(w => `<tr><td style="padding:6px 8px;border-bottom:1px solid var(--border-glass);text-align:center;">Week ${w.week}</td><td style="padding:6px 8px;border-bottom:1px solid var(--border-glass);text-align:center;">${new Date(w.date).toLocaleDateString()}</td><td style="padding:6px 8px;border-bottom:1px solid var(--border-glass);text-align:center;">${w.overall.toFixed(1)}%</td><td style="padding:6px 8px;border-bottom:1px solid var(--border-glass);text-align:center;">${w.overall>=70?'✅ Good':'⚠️ Needs Focus'}</td></tr>`).join('')}</tbody>
                        </table>
                    </div>
                </div>
                
                <div class="smart-section">
                    <div class="smart-header">🎯 SMART GOALS FOR NEXT MONTH</div>
                    <div class="smart-body">
                        ${smartGoals.map((goal, i) => `
                            <div class="goal-item">
                                <span style="background:linear-gradient(135deg,var(--primary),var(--secondary)); color:white; width:28px; height:28px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0;">${i+1}</span>
                                <div><strong>${goal.area}</strong><br><small style="color:var(--text-muted);">Target: ${goal.target} | Action: ${goal.action}</small></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="smart-section">
                    <div class="smart-header">📚 FREE RECOMMENDED RESOURCES</div>
                    <div class="smart-body">
                        ${resources.map(res => `
                            <div class="resource-item">
                                <span style="font-size:1.2rem;">📖</span>
                                <div><strong>${res.name}</strong><br><small><a href="${res.link}" target="_blank" style="color:var(--primary-light);">🔗 Access Resource →</a></small></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="smart-section">
                    <div class="smart-header">✅ ACTION ITEMS CHECKLIST</div>
                    <div class="smart-body">
                        ${actionItems.map(item => `
                            <div class="action-item">
                                <input type="checkbox" style="width:20px; height:20px; accent-color:var(--primary); flex-shrink:0;">
                                <span style="${item.important ? 'font-weight:700;' : ''}">${item.text}</span>
                                ${item.important ? '<span style="background:rgba(239,68,68,0.15); color:#EF4444; padding:2px 10px; border-radius:20px; font-size:10px; font-weight:600; border:1px solid rgba(239,68,68,0.2);">URGENT</span>' : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="smart-section">
                    <div class="smart-header">⏰ 30-60-90 DAYS TIMELINE</div>
                    <div class="smart-body">
                        ${timeline.map(phase => `
                            <div class="timeline-phase">
                                <strong>📅 ${phase.period}</strong><br>
                                Focus: ${phase.focus}<br>
                                <span style="color:var(--text-muted);font-size:0.9rem;">Target: ${phase.target}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="smart-section">
                    <div class="smart-header">⚠️ RISK ASSESSMENT</div>
                    <div class="smart-body">
                        <div class="risk-${risk.color === 'danger' ? 'high' : (risk.color === 'warning' ? 'medium' : 'low')}" style="padding:15px; border-radius:12px;">
                            <strong>Risk Level: ${risk.level}</strong><br>
                            ${risk.message}
                        </div>
                    </div>
                </div>
                
                <div class="smart-section">
                    <div class="smart-header">📈 NEXT MONTH PROJECTION</div>
                    <div class="smart-body">
                        <div class="projection-card">
                            <div class="projection-number">${projection.nextMonth}%</div>
                            <div style="color:var(--text-secondary);">Predicted Score (Next Month)</div>
                            <small style="color:var(--text-muted);">${projection.message}</small>
                        </div>
                    </div>
                </div>
                
                <div class="smart-section">
                    <div class="smart-header">👨‍🏫 MENTOR RECOMMENDATION</div>
                    <div class="smart-body">
                        <div style="background:var(--bg-glass); padding:15px; border-radius:12px; text-align:center; border:1px solid var(--border-glass);">
                            <strong style="font-size:18px; color:var(--primary-light);">${mentor.name}</strong><br>
                            <small style="color:var(--text-muted);">${mentor.specialty}</small>
                            <div style="margin-top:10px; color:var(--text-secondary);">📅 Schedule weekly 30-min mentoring session</div>
                        </div>
                    </div>
                </div>
                
                <div style="text-align:center; margin-top:20px; padding-top:15px; border-top:1px solid var(--border-glass); font-size:11px; color:var(--text-muted);">
                    MagicRills.com · Teacher Observation System · AI-Generated Report
                </div>
            </div>
            <div class="no-print" style="display:flex; gap:10px; justify-content:center; margin-top:15px; flex-wrap:wrap;">
                <button class="btn-export" onclick="exportCombinedAsPDF()">📄 PDF</button>
                <button class="btn-export" onclick="exportCombinedAsDOC()">📝 DOC</button>
                <button class="btn-export" onclick="exportCombinedAsTXT()">📃 TXT</button>
            </div>`;
            
            document.getElementById('combinedReportContainer').innerHTML = combinedHTML;
            
            const ctx = document.getElementById('trendChart')?.getContext('2d');
            if (ctx) {
                if (window.trendChart) window.trendChart.destroy();
                const gradient = ctx.createLinearGradient(0, 0, 0, 250);
                gradient.addColorStop(0, 'rgba(139,92,246,0.3)');
                gradient.addColorStop(1, 'rgba(139,92,246,0.0)');
                window.trendChart = new Chart(ctx, {
                    type: 'line',
                    data: { 
                        labels: weeklyData.map(w => `Week ${w.week}`), 
                        datasets: [{ 
                            label: 'Performance %', 
                            data: weeklyData.map(w => w.overall), 
                            borderColor: '#8B5CF6', 
                            backgroundColor: gradient, 
                            fill: true, 
                            tension: 0.3,
                            pointBackgroundColor: '#8B5CF6',
                            pointBorderColor: '#fff',
                            pointRadius: 6,
                            pointHoverRadius: 8
                        }] 
                    },
                    options: { 
                        responsive: true, 
                        maintainAspectRatio: true,
                        plugins: {
                            legend: { 
                                labels: { color: '#9CA3AF' }
                            }
                        },
                        scales: { 
                            y: { 
                                min: 0, 
                                max: 100, 
                                title: { display: true, text: 'Performance %', color: '#9CA3AF' },
                                ticks: { color: '#6B7280' },
                                grid: { color: 'rgba(255,255,255,0.05)' }
                            },
                            x: {
                                ticks: { color: '#6B7280' },
                                grid: { color: 'rgba(255,255,255,0.05)' }
                            }
                        }
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

// ============================================
// VALIDATION & HELPERS
// ============================================
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

// ============================================
// CLOUDFLARE API INTEGRATIONS
// ============================================

// ===== INCREMENT USAGE =====
async function incrementUsage() {
    try {
        const response = await fetch(`${API_BASE}/api/usage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify({
                tool_slug: toolSlug,
                session_id: sessionId
            })
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Usage incremented:', data);
        } else {
            console.warn('API usage increment failed, using localStorage fallback');
            incrementUsageLocal();
        }
        loadGlobalStats();
    } catch (error) {
        console.warn('API call failed, using localStorage fallback:', error);
        incrementUsageLocal();
        loadGlobalStats();
    }
}

function incrementUsageLocal() {
    let localUsage = parseInt(localStorage.getItem(`usage_${toolSlug}`) || '0');
    localUsage++;
    localStorage.setItem(`usage_${toolSlug}`, localUsage.toString());
    updateLocalStats();
}

function updateLocalStats() {
    const usage = parseInt(localStorage.getItem(`usage_${toolSlug}`) || '0');
    const obsList = JSON.parse(localStorage.getItem('teacher_observations') || '[]');
    document.getElementById('globalUsageCount').innerText = usage || obsList.length || 0;
}

// ===== LOAD GLOBAL STATS =====
async function loadGlobalStats() {
    try {
        const response = await fetch(`${API_BASE}/api/stats?tool_slug=${toolSlug}`, {
            headers: { 'x-api-key': API_KEY }
        });
        if (response.ok) {
            const data = await response.json();
            document.getElementById('globalUsageCount').innerText = data.usage || 0;
            document.getElementById('globalReactionCount').innerText = data.totalReactions || 0;
            document.getElementById('globalShareCount').innerText = data.totalShares || 0;
            // Save to localStorage as fallback
            localStorage.setItem(`stats_${toolSlug}`, JSON.stringify(data));
        } else {
            useLocalStats();
        }
    } catch (error) {
        console.warn('API stats failed, using localStorage:', error);
        useLocalStats();
    }
}

function useLocalStats() {
    const stats = JSON.parse(localStorage.getItem(`stats_${toolSlug}`) || '{}');
    document.getElementById('globalUsageCount').innerText = stats.usage || localStorage.getItem(`usage_${toolSlug}`) || 0;
    document.getElementById('globalReactionCount').innerText = stats.totalReactions || 0;
    document.getElementById('globalShareCount').innerText = stats.totalShares || 0;
}

// ===== LOAD REACTIONS =====
async function loadReactions() {
    try {
        const response = await fetch(`${API_BASE}/api/reactions?tool_slug=${toolSlug}`, {
            headers: { 'x-api-key': API_KEY }
        });
        if (response.ok) {
            const data = await response.json();
            const reactions = data.reactions || {};
            document.getElementById('likeCount').innerText = reactions.like || 0;
            document.getElementById('loveCount').innerText = reactions.love || 0;
            document.getElementById('wowCount').innerText = reactions.wow || 0;
            document.getElementById('sadCount').innerText = reactions.sad || 0;
            document.getElementById('angryCount').innerText = reactions.angry || 0;
            document.getElementById('laughCount').innerText = reactions.laugh || 0;
            document.getElementById('celebrateCount').innerText = reactions.celebrate || 0;
            // Save to localStorage
            localStorage.setItem(`reactions_${toolSlug}`, JSON.stringify(reactions));
        } else {
            useLocalReactions();
        }
    } catch (error) {
        console.warn('API reactions failed, using localStorage:', error);
        useLocalReactions();
    }
}

function useLocalReactions() {
    const reactions = JSON.parse(localStorage.getItem(`reactions_${toolSlug}`) || '{}');
    document.getElementById('likeCount').innerText = reactions.like || 0;
    document.getElementById('loveCount').innerText = reactions.love || 0;
    document.getElementById('wowCount').innerText = reactions.wow || 0;
    document.getElementById('sadCount').innerText = reactions.sad || 0;
    document.getElementById('angryCount').innerText = reactions.angry || 0;
    document.getElementById('laughCount').innerText = reactions.laugh || 0;
    document.getElementById('celebrateCount').innerText = reactions.celebrate || 0;
}

// ===== ADD REACTION =====
async function addReaction(reaction) {
    const currentCount = parseInt(document.getElementById(reaction + 'Count')?.innerText || '0');
    document.getElementById(reaction + 'Count').innerText = currentCount + 1;
    
    try {
        const response = await fetch(`${API_BASE}/api/reactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify({
                tool_slug: toolSlug,
                emoji: reaction,
                session_id: sessionId
            })
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Reaction added:', data);
            // Update counts from server response
            if (data.reactions) {
                updateReactionCounts(data.reactions);
            }
            showToast(`👍 Thanks for your feedback!`, 'success');
        } else {
            // Save locally if API fails
            saveReactionLocal(reaction);
            showToast(`👍 Reaction saved locally!`, 'info');
        }
    } catch (error) {
        console.warn('API reaction failed, using localStorage:', error);
        saveReactionLocal(reaction);
        showToast(`👍 Reaction saved locally!`, 'info');
    }
}

function saveReactionLocal(reaction) {
    const reactions = JSON.parse(localStorage.getItem(`reactions_${toolSlug}`) || '{}');
    reactions[reaction] = (reactions[reaction] || 0) + 1;
    localStorage.setItem(`reactions_${toolSlug}`, JSON.stringify(reactions));
    updateReactionCounts(reactions);
}

function updateReactionCounts(reactions) {
    document.getElementById('likeCount').innerText = reactions.like || 0;
    document.getElementById('loveCount').innerText = reactions.love || 0;
    document.getElementById('wowCount').innerText = reactions.wow || 0;
    document.getElementById('sadCount').innerText = reactions.sad || 0;
    document.getElementById('angryCount').innerText = reactions.angry || 0;
    document.getElementById('laughCount').innerText = reactions.laugh || 0;
    document.getElementById('celebrateCount').innerText = reactions.celebrate || 0;
}

// ===== INCREMENT SHARES =====
async function incrementShares(platform) {
    try {
        const response = await fetch(`${API_BASE}/api/shares`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify({
                tool_slug: toolSlug,
                platform: platform,
                session_id: sessionId
            })
        });
        if (response.ok) {
            console.log('Share recorded:', platform);
        } else {
            saveShareLocal(platform);
        }
    } catch (error) {
        console.warn('API share failed, using localStorage:', error);
        saveShareLocal(platform);
    }
}

function saveShareLocal(platform) {
    const shares = JSON.parse(localStorage.getItem(`shares_${toolSlug}`) || '[]');
    shares.push({ platform, time: Date.now() });
    localStorage.setItem(`shares_${toolSlug}`, JSON.stringify(shares));
}

function loadSharesFromLocal() {
    const shares = JSON.parse(localStorage.getItem(`shares_${toolSlug}`) || '[]');
    document.getElementById('globalShareCount').innerText = shares.length || 0;
}

// ============================================
// SHARE FUNCTIONS
// ============================================
function shareOnFacebook() { 
    window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(window.location.href),'_blank'); 
    incrementShares('facebook'); 
}
function shareOnTwitter() { 
    window.open('https://twitter.com/intent/tweet?text=Teacher%20Observation%20Tool&url='+encodeURIComponent(window.location.href),'_blank'); 
    incrementShares('twitter'); 
}
function shareOnWhatsApp() { 
    window.open('https://wa.me/?text='+encodeURIComponent('Teacher Observation Tool: '+window.location.href),'_blank'); 
    incrementShares('whatsapp'); 
}
function shareOnLinkedIn() { 
    window.open('https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(window.location.href),'_blank'); 
    incrementShares('linkedin'); 
}
function shareByEmail() { 
    window.location.href='mailto:?subject=Teacher Observation Tool&body='+encodeURIComponent(window.location.href); 
    incrementShares('email'); 
}
function copyPageUrl() { 
    navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('📋 URL Copied!', 'success');
        incrementShares('copy');
    }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = window.location.href;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('📋 URL Copied!', 'success');
        incrementShares('copy');
    });
}

// ============================================
// UI HELPERS
// ============================================
function showToast(msg, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.style.borderColor = type === 'error' ? '#EF4444' : type === 'success' ? '#10B981' : 'var(--border-glass)';
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove('show'), 3500);
}

function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (!spinner) return;
    if (show) {
        spinner.classList.add('active');
    } else {
        spinner.classList.remove('active');
    }
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Reactions
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const reaction = btn.dataset.reaction;
            if (reaction) addReaction(reaction);
        });
    });
    
    // Share buttons
    document.querySelector('[data-platform="facebook"]')?.addEventListener('click', shareOnFacebook);
    document.querySelector('[data-platform="twitter"]')?.addEventListener('click', shareOnTwitter);
    document.querySelector('[data-platform="whatsapp"]')?.addEventListener('click', shareOnWhatsApp);
    document.querySelector('[data-platform="linkedin"]')?.addEventListener('click', shareOnLinkedIn);
    document.querySelector('[data-platform="email"]')?.addEventListener('click', shareByEmail);
    document.getElementById('copyUrlBtn')?.addEventListener('click', copyPageUrl);
    
    // Dark mode toggle
    const darkToggle = document.getElementById('darkModeToggle');
    if (darkToggle) {
        darkToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDark);
            darkToggle.textContent = isDark ? '☀️ Light' : '🌙 Dark';
            showToast(`Theme: ${isDark ? 'Dark' : 'Light'}`, 'info');
        });
        // Check saved preference
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            darkToggle.textContent = '☀️ Light';
        } else {
            // Default dark mode
            document.body.classList.add('dark-mode');
            darkToggle.textContent = '☀️ Light';
            localStorage.setItem('darkMode', 'true');
        }
    }
    
    // Scroll buttons
    document.getElementById('scrollTopBtn')?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.getElementById('scrollBottomBtn')?.addEventListener('click', () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
}

// ============================================
// EXPOSE GLOBALLY
// ============================================
window.showPanel = showPanel;
window.generateAndSaveObservation = generateAndSaveObservation;
window.resetObservationForm = resetObservationForm;
window.exportAsPDF = exportAsPDF;
window.exportAsDOC = exportAsDOC;
window.exportAsTXT = exportAsTXT;
window.exportAsExcel = exportAsExcel;
window.saveToComputer = saveToComputer;
window.exportTNAAsTXT = exportTNAAsTXT;
window.dragOver = dragOver;
window.dragLeave = dragLeave;
window.handleDrop = handleDrop;
window.handleFileSelect = handleFileSelect;
window.removeFile = removeFile;
window.clearAllFiles = clearAllFiles;
window.generateCombinedReport = generateCombinedReport;
window.exportCombinedAsPDF = exportCombinedAsPDF;
window.exportCombinedAsDOC = exportCombinedAsDOC;
window.exportCombinedAsTXT = exportCombinedAsTXT;
window.toggleSection = toggleSection;
window.addReaction = addReaction;
window.shareOnFacebook = shareOnFacebook;
window.shareOnTwitter = shareOnTwitter;
window.shareOnWhatsApp = shareOnWhatsApp;
window.shareOnLinkedIn = shareOnLinkedIn;
window.shareByEmail = shareByEmail;
window.copyPageUrl = copyPageUrl;
window.showToast = showToast;
window.showLoading = showLoading;

console.log('🚀 Teacher Observation Tool v4.0 loaded!');
console.log('📊 Tool Slug:', toolSlug);
console.log('🔑 Session ID:', sessionId);
console.log('🌐 API Base:', API_BASE);
