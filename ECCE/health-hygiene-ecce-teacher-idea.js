/**
 * ============================================================
 * MAGICRILLS.COM - ECCE Health & Hygiene Teacher Tool
 * Cloudflare Workers API Integration + Modern UI
 * ============================================================
 */

// ============ CONSTANTS ============
const INDICATORS = ["HAND_WASH", "TEETH_CLEAN", "UNIFORM", "NAILS", "HAIR", "GERMS", "COUGH", "TISSUE", "FOOD", "WATER"];
const INDICATOR_NAMES = ["🧼 Hand Wash", "🪥 Teeth Clean", "👕 Clean Uniform", "✂️ Nails Trimmed", "💇 Combed Hair", "🧴 Germ Safety", "🤧 Cough Etiquette", "🧻 Tissue Use", "🍎 Healthy Food", "💧 Water Intake"];
const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_COLORS = ['#00e676', '#448aff', '#ffd54f', '#7c4dff', '#ff9100', '#ff4081'];

// ============ API CONFIG ============
const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';
const API_KEY = 'magicrills-grok-api.uzairhameed01.workers.dev';
const TOOL_SLUG = 'health-hygiene-ecce-teacher-tool';
const TOOL_NAME = 'ECCE Health & Hygiene Teacher Tool';

// ============ GLOBAL VARIABLES ============
let students = JSON.parse(localStorage.getItem('hygiene_students')) || [];
let currentDay = 'monday';
let analysisResult = null;
let chartInstance = null;
let currentStep = 1;
let uploadedFiles = {};
let toolStats = { usage: 0, views: 0, shares: 0, reactions: {} };
let reactionCounts = {};
let typewriterInterval = null;
let typewriterPhrases = [
    'Track daily hygiene habits',
    'Monitor hand washing & teeth cleaning',
    'Track uniform & nail hygiene',
    'Analyze weekly student performance',
    'Generate beautiful reports',
    'Share with parents easily'
];

// ============ CLOUDFLARE API FUNCTIONS ============

/**
 * Call Cloudflare Worker API with fallback to localStorage
 */
async function callAPI(endpoint, method = 'GET', body = null) {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
    };
    
    try {
        const options = { method, headers };
        if (body) options.body = JSON.stringify(body);
        
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.warn('API call failed, using localStorage fallback:', error);
        return null;
    }
}

/**
 * Increment usage count for this tool
 */
async function incrementUsage() {
    try {
        const result = await callAPI('/api/usage', 'POST', { tool_slug: TOOL_SLUG });
        if (result && result.success) {
            localStorage.setItem('hygiene_usage_count', result.count);
            updateStatsDisplay();
        }
    } catch (error) {
        // Fallback: increment local count
        let count = parseInt(localStorage.getItem('hygiene_usage_count') || '0');
        count++;
        localStorage.setItem('hygiene_usage_count', count);
        updateStatsDisplay();
    }
}

/**
 * Get tool stats from API
 */
async function fetchToolStats() {
    try {
        const result = await callAPI(`/api/stats?tool_slug=${TOOL_SLUG}`);
        if (result && result.success) {
            toolStats = result.data;
            // Merge with local reactions
            if (toolStats.reactions) {
                reactionCounts = toolStats.reactions;
            }
            updateStatsDisplay();
            updateReactionButtons();
            return result.data;
        }
    } catch (error) {
        console.warn('Fetch stats failed, using localStorage fallback');
    }
    
    // Fallback: load from localStorage
    toolStats.usage = parseInt(localStorage.getItem('hygiene_usage_count') || '0');
    toolStats.views = parseInt(localStorage.getItem('hygiene_views_count') || '0');
    toolStats.shares = parseInt(localStorage.getItem('hygiene_shares_count') || '0');
    reactionCounts = JSON.parse(localStorage.getItem('hygiene_reactions') || '{}');
    updateStatsDisplay();
    updateReactionButtons();
    return toolStats;
}

/**
 * Add or update a reaction
 */
async function addReaction(emoji) {
    try {
        const result = await callAPI('/api/reactions', 'POST', {
            tool_slug: TOOL_SLUG,
            emoji: emoji
        });
        if (result && result.success) {
            reactionCounts = result.reactions;
            localStorage.setItem('hygiene_reactions', JSON.stringify(reactionCounts));
            updateReactionButtons();
            updateStatsDisplay();
            showToast(`✨ Reacted with ${emoji}`, 'success');
        }
    } catch (error) {
        // Fallback: update local
        reactionCounts[emoji] = (reactionCounts[emoji] || 0) + 1;
        localStorage.setItem('hygiene_reactions', JSON.stringify(reactionCounts));
        updateReactionButtons();
        updateStatsDisplay();
        showToast(`✨ Reacted with ${emoji} (local)`, 'success');
    }
}

/**
 * Record a share
 */
async function recordShare(platform) {
    try {
        const result = await callAPI('/api/shares', 'POST', {
            tool_slug: TOOL_SLUG,
            platform: platform
        });
        if (result && result.success) {
            toolStats.shares = result.total_shares || 0;
            localStorage.setItem('hygiene_shares_count', toolStats.shares);
            updateStatsDisplay();
        }
    } catch (error) {
        // Fallback: increment local
        let shares = parseInt(localStorage.getItem('hygiene_shares_count') || '0');
        shares++;
        localStorage.setItem('hygiene_shares_count', shares);
        toolStats.shares = shares;
        updateStatsDisplay();
    }
}

/**
 * Record a page view
 */
async function recordView() {
    // Only record once per session
    if (sessionStorage.getItem('hygiene_view_recorded')) return;
    sessionStorage.setItem('hygiene_view_recorded', 'true');
    
    try {
        // Views are tracked via usage endpoint with view parameter
        const result = await callAPI('/api/usage', 'POST', {
            tool_slug: TOOL_SLUG,
            type: 'view'
        });
        if (result && result.success) {
            localStorage.setItem('hygiene_views_count', result.views || 0);
            updateStatsDisplay();
        }
    } catch (error) {
        // Fallback
        let views = parseInt(localStorage.getItem('hygiene_views_count') || '0');
        views++;
        localStorage.setItem('hygiene_views_count', views);
        updateStatsDisplay();
    }
}

// ============ UI UPDATE FUNCTIONS ============

/**
 * Update stats display in the stats bar
 */
function updateStatsDisplay() {
    const usage = parseInt(localStorage.getItem('hygiene_usage_count') || toolStats.usage || 0);
    const views = parseInt(localStorage.getItem('hygiene_views_count') || toolStats.views || 0);
    const shares = parseInt(localStorage.getItem('hygiene_shares_count') || toolStats.shares || 0);
    const reactions = Object.values(reactionCounts).reduce((a, b) => a + b, 0);
    
    document.getElementById('statUsage').textContent = usage || 0;
    document.getElementById('statViews').textContent = views || 0;
    document.getElementById('statShares').textContent = shares || 0;
    document.getElementById('statFollowers').textContent = reactions || 0;
}

/**
 * Update reaction buttons with counts
 */
function updateReactionButtons() {
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        const emoji = btn.dataset.emoji;
        const count = reactionCounts[emoji] || 0;
        const countSpan = btn.querySelector('.count');
        if (countSpan) countSpan.textContent = count;
    });
}

/**
 * Typewriter animation for hero section
 */
function startTypewriter() {
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const span = document.getElementById('typewriterSpan');
    if (!span) return;
    
    function type() {
        const currentPhrase = typewriterPhrases[phraseIndex];
        if (!isDeleting) {
            span.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentPhrase.length) {
                isDeleting = true;
                setTimeout(type, 2000);
                return;
            }
            setTimeout(type, 80);
        } else {
            span.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % typewriterPhrases.length;
                setTimeout(type, 500);
                return;
            }
            setTimeout(type, 40);
        }
    }
    
    type();
}

// ============ TOAST NOTIFICATIONS ============
function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    toast.innerHTML = `${icons[type] || 'ℹ️'} ${message}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ============ STUDENT MANAGEMENT ============
function updateStudentList() {
    const container = document.getElementById('studentList');
    if (!container) return;
    if (students.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary);">No students added yet. Add your first student above!</p>';
        return;
    }
    container.innerHTML = students.map((s, idx) => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; border-bottom:1px solid rgba(255,255,255,0.05);">
            <span><strong style="color:var(--accent-green);">${s.rollNo}</strong> - ${s.name} <span style="color:var(--text-secondary);font-size:0.85rem;">(${s.class})</span></span>
            <button class="btn-danger" onclick="window.removeStudent(${idx})" style="padding:4px 14px; font-size:12px;">Remove</button>
        </div>
    `).join('');
}

function addStudent() {
    const name = document.getElementById('studentName').value.trim();
    const rollNo = document.getElementById('rollNo').value.trim();
    const classSection = document.getElementById('classSection').value;
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
    const daySelector = document.getElementById('daySelector');
    if (!daySelector) return;
    
    daySelector.innerHTML = DAY_NAMES.map((dayName, idx) => 
        `<button class="day-btn ${currentDay === DAYS[idx] ? 'active' : ''}" onclick="window.setCurrentDay('${DAYS[idx]}')">${dayName}</button>`
    ).join('');
    
    const container = document.getElementById('dailyChecklistTable');
    if (!container) return;
    
    if (students.length === 0) {
        container.innerHTML = '<p style="color:var(--text-secondary);">No students. Please add students in Step 1.</p>';
        return;
    }
    
    const savedData = JSON.parse(localStorage.getItem(`daily_${currentDay}`)) || {};
    
    let html = `<div style="overflow-x:auto;"><table><thead><tr>
        <th>Roll No</th><th>Student Name</th><th>Present?</th>`;
    INDICATOR_NAMES.forEach(name => html += `<th>${name}</th>`);
    html += '</tr></thead><tbody>';
    
    students.forEach(student => {
        const saved = savedData[student.id] || { present: true, indicators: {} };
        html += `<tr>
            <td><strong>${student.rollNo}</strong></td>
            <td>${student.name}</td>
            <td><input type="checkbox" class="present-checkbox" data-id="${student.id}" ${saved.present ? 'checked' : ''} onchange="window.toggleIndicators(${student.id}, this.checked)"></td>`;
        INDICATORS.forEach((ind, idx) => {
            const checked = saved.indicators[ind] ? 'checked' : '';
            html += `<td><input type="checkbox" class="indicator-${student.id}" data-ind="${ind}" ${checked} ${!saved.present ? 'disabled' : ''} onchange="window.saveDailyData()"></td>`;
        });
        html += '</tr>';
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

function setCurrentDay(day) {
    currentDay = day;
    renderDailyChecklist();
}

function toggleIndicators(studentId, isPresent) {
    const checkboxes = document.querySelectorAll(`.indicator-${studentId}`);
    checkboxes.forEach(cb => {
        cb.disabled = !isPresent;
        if (!isPresent) cb.checked = false;
    });
    saveDailyData();
}

function saveDailyData() {
    const dailyData = {};
    students.forEach(student => {
        const presentCheck = document.querySelector(`.present-checkbox[data-id="${student.id}"]`);
        const present = presentCheck ? presentCheck.checked : true;
        const indicators = {};
        INDICATORS.forEach(ind => {
            const cb = document.querySelector(`.indicator-${student.id}[data-ind="${ind}"]`);
            if (cb) indicators[ind] = cb.checked;
            else indicators[ind] = false;
        });
        dailyData[student.id] = { present, indicators };
    });
    localStorage.setItem(`daily_${currentDay}`, JSON.stringify(dailyData));
}

function saveAndDownloadTXT() {
    saveDailyData();
    const dailyData = JSON.parse(localStorage.getItem(`daily_${currentDay}`)) || {};
    const classVal = students[0]?.class || "Morning Class";
    const date = new Date().toISOString().split('T')[0];
    
    let lines = [`DAY=${currentDay}`, `DATE=${date}`, `CLASS=${classVal}`, `TOTAL_STUDENTS=${students.length}`, ``];
    lines.push(`STUDENT,ROLL,PRESENT,${INDICATORS.join(',')}`);
    
    students.forEach(student => {
        const data = dailyData[student.id] || { present: true, indicators: {} };
        const presentStr = data.present ? "YES" : "NO";
        let indicatorValues = INDICATORS.map(ind => data.indicators[ind] ? 1 : 0).join(',');
        if (!data.present) indicatorValues = INDICATORS.map(() => 0).join(',');
        lines.push(`${student.name},${student.rollNo},${presentStr},${indicatorValues}`);
    });
    
    const content = lines.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `hygiene_${currentDay}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast(`✅ Downloaded ${DAY_NAMES[DAYS.indexOf(currentDay)]} checklist!`);
}

// ============ FILE UPLOAD & ANALYSIS ============
function setupFileUpload() {
    const zone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    if (!zone || !fileInput) return;
    
    zone.onclick = () => fileInput.click();
    zone.ondragover = (e) => { e.preventDefault(); zone.classList.add('drag-over'); };
    zone.ondragleave = () => zone.classList.remove('drag-over');
    zone.ondrop = (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    };
    fileInput.onchange = (e) => handleFiles(e.target.files);
}

function handleFiles(files) {
    uploadedFiles = {};
    const filesArray = Array.from(files);
    let processed = 0;
    
    filesArray.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const parsed = parseTXTFile(content);
            if (parsed && parsed.day && DAYS.includes(parsed.day)) {
                uploadedFiles[parsed.day] = parsed;
            } else {
                const lowerName = file.name.toLowerCase();
                for (const day of DAYS) {
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
    const fileData = { day: null, date: null, class: null, totalStudents: 0, records: [] };
    
    for (let i = 0; i < Math.min(lines.length, 5); i++) {
        const line = lines[i].trim();
        if (line.startsWith('DAY=')) fileData.day = line.substring(4).toLowerCase();
        else if (line.startsWith('DATE=')) fileData.date = line.substring(5);
        else if (line.startsWith('CLASS=')) fileData.class = line.substring(6);
        else if (line.startsWith('TOTAL_STUDENTS=')) fileData.totalStudents = parseInt(line.substring(15)) || 0;
    }
    
    const headerIndex = lines.findIndex(l => l.includes('STUDENT') && l.includes('ROLL') && l.includes('PRESENT'));
    if (headerIndex === -1) return null;
    
    for (let i = headerIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(',');
        if (parts.length >= 13) {
            const record = {
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
    const fileList = document.getElementById('uploadedFilesList');
    if (!fileList) return;
    
    const allFound = DAYS.every(day => uploadedFiles[day]);
    let html = '<div style="background:rgba(0,230,118,0.05); padding:15px; border-radius:12px; border:1px solid rgba(0,230,118,0.1);"><strong style="color:var(--text-primary);">📁 Uploaded Files:</strong><br><br>';
    
    for (const day of DAYS) {
        const status = uploadedFiles[day] ? '✅' : '❌';
        const bg = uploadedFiles[day] ? 'rgba(0,230,118,0.15)' : 'rgba(255,23,68,0.1)';
        const color = uploadedFiles[day] ? 'var(--accent-green)' : '#ff1744';
        const count = uploadedFiles[day] ? ` (${uploadedFiles[day].records.length} students)` : '';
        html += `<span class="file-status" style="background:${bg}; color:${color}; border:1px solid ${color}33;">${DAY_NAMES[DAYS.indexOf(day)]}: ${status}${count}</span> `;
    }
    html += '</div>';
    
    if (allFound) {
        html += '<p style="color:var(--accent-green); margin-top:15px; font-weight:600;">✅ All 6 files uploaded! Click Analyze.</p>';
    } else {
        html += '<p style="color:#ff1744; margin-top:15px;">⚠️ Please upload all 6 days.</p>';
    }
    fileList.innerHTML = html;
    
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) analyzeBtn.disabled = !allFound;
}

function analyzeAllFiles() {
    if (!DAYS.every(day => uploadedFiles[day])) {
        showToast('Upload all 6 files first!', 'error');
        return;
    }
    
    const studentMap = new Map();
    for (const day of DAYS) {
        const file = uploadedFiles[day];
        if (file && file.records) {
            file.records.forEach(rec => {
                if (!studentMap.has(rec.rollNo)) {
                    studentMap.set(rec.rollNo, { id: rec.rollNo, name: rec.name, rollNo: rec.rollNo, class: file.class || 'Unknown' });
                }
            });
        }
    }
    
    const studentList = Array.from(studentMap.values());
    const performance = [];
    
    for (const student of studentList) {
        let totalScore = 0;
        const dailyScores = [];
        for (let i = 0; i < DAYS.length; i++) {
            const file = uploadedFiles[DAYS[i]];
            let score = 0;
            const record = file?.records?.find(r => r.rollNo === student.rollNo);
            if (record && record.present) {
                for (const ind of INDICATORS) if (record.indicators[ind]) score++;
            }
            totalScore += score;
            dailyScores.push({ day: DAYS[i], dayName: DAY_NAMES[i], score, color: DAY_COLORS[i] });
        }
        const percentage = Math.round((totalScore / (DAYS.length * INDICATORS.length)) * 100);
        performance.push({ ...student, totalScore, totalPossible: DAYS.length * INDICATORS.length, percentage, dailyScores });
    }
    
    performance.sort((a, b) => b.percentage - a.percentage);
    const hero = performance[0];
    analysisResult = { students: performance, totalStudents: studentList.length, heroOfWeek: hero };
    renderReport();
    document.getElementById('reportCard').style.display = 'block';
    goToStep(3);
    showToast('🎉 Analysis complete! Hero of the week announced!');
}

function renderReport() {
    const hero = analysisResult.heroOfWeek;
    const heroGrade = hero.percentage >= 90 ? '🏆 SUPER HERO' : hero.percentage >= 80 ? '🌟 GOLD HERO' : hero.percentage >= 70 ? '⭐ SILVER HERO' : '💪 BRONZE HERO';
    
    document.getElementById('heroAnnouncement').innerHTML = `
        <div class="hero-announcement">
            <div class="trophy">🏆👑🏆</div>
            <h2>🎉 HERO OF THE WEEK! 🎉</h2>
            <h1 style="font-size:2rem; color:var(--accent-gold);">${hero.name}</h1>
            <p style="color:var(--text-secondary);">Roll No: ${hero.rollNo} | Class: ${hero.class}</p>
            <p style="font-size:1.5rem; color:var(--text-primary);">Score: ${hero.percentage}% - ${heroGrade}</p>
            <div class="trophy">🏆👑🏆</div>
        </div>
    `;
    
    const avg = Math.round(analysisResult.students.reduce((a, b) => a + b.percentage, 0) / analysisResult.totalStudents);
    document.getElementById('statsGrid').innerHTML = `
        <div class="stat-box"><h3>📊 Total Students</h3><h2>${analysisResult.totalStudents}</h2></div>
        <div class="stat-box"><h3>🏆 Average Score</h3><h2>${avg}%</h2></div>
        <div class="stat-box"><h3>⭐ Hero Score</h3><h2>${hero.percentage}%</h2></div>
        <div class="stat-box"><h3>📈 Top Performer</h3><h2>${hero.name}</h2></div>
    `;
    
    const ctx = document.getElementById('attendanceChart').getContext('2d');
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: analysisResult.students.map(s => s.name),
            datasets: [{
                label: 'Hygiene Score (%)',
                data: analysisResult.students.map(s => s.percentage),
                backgroundColor: analysisResult.students.map(s => s.id === hero.id ? '#ffd54f' : '#00e676'),
                borderRadius: 8,
                borderColor: analysisResult.students.map(s => s.id === hero.id ? '#f9a825' : '#00c853'),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: '#f0f4ff' } }
            },
            scales: {
                y: { 
                    max: 100, 
                    title: { display: true, text: 'Percentage (%)', color: '#a8b9d9' },
                    ticks: { color: '#a8b9d9' },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                },
                x: {
                    ticks: { color: '#a8b9d9' },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                }
            }
        }
    });
    
    let cardsHtml = '';
    for (const s of analysisResult.students) {
        const dailyHtml = s.dailyScores.map(d => 
            `<span style="display:inline-block; width:40px; text-align:center; background:${d.color}33; color:${d.color}; margin:2px; padding:4px; border-radius:6px; font-size:11px; border:1px solid ${d.color}55;">${d.dayName.substring(0,3)}<br><strong>${d.score}/10</strong></span>`
        ).join('');
        const isHero = s.id === hero.id;
        cardsHtml += `<div class="student-card ${isHero ? 'hero-card' : ''}" style="background: linear-gradient(135deg, #1a2332, #243044);">
            ${isHero ? '<div class="hero-badge">🏆<br>HERO</div>' : ''}
            <h4 style="color:var(--text-primary);">📋 ${s.name} <span style="color:var(--text-secondary);font-weight:400;">(${s.rollNo})</span></h4>
            <div style="margin:8px 0;">
                <span style="font-size:1.3rem; font-weight:700; color:${s.percentage >= 80 ? 'var(--accent-green)' : s.percentage >= 60 ? 'var(--accent-gold)' : '#ff1744'};">${s.percentage}%</span>
                <span style="background:${s.percentage >= 80 ? 'rgba(0,230,118,0.15)' : s.percentage >= 60 ? 'rgba(255,213,79,0.15)' : 'rgba(255,23,68,0.15)'}; padding:2px 10px; border-radius:20px; font-size:12px; margin-left:8px; border:1px solid ${s.percentage >= 80 ? 'rgba(0,230,118,0.2)' : s.percentage >= 60 ? 'rgba(255,213,79,0.2)' : 'rgba(255,23,68,0.2)'};">${s.percentage >= 90 ? 'A+' : s.percentage >= 80 ? 'A' : s.percentage >= 70 ? 'B' : 'C'}</span>
            </div>
            <div style="margin:10px 0; display:flex; flex-wrap:wrap; gap:3px;">${dailyHtml}</div>
            <div style="color:var(--text-secondary); font-size:0.9rem;">📊 Total: ${s.totalScore}/${s.totalPossible}</div>
        </div>`;
    }
    document.getElementById('studentCardsContainer').innerHTML = cardsHtml;
}

// ============ PARENT SHARE ============
function renderParentShareCards() {
    if (!analysisResult) return;
    const hero = analysisResult.heroOfWeek;
    const container = document.getElementById('parentShareCards');
    if (!container) return;
    
    container.innerHTML = analysisResult.students.map(s => {
        const isHero = s.id === hero.id;
        return `<div class="student-card" style="background: linear-gradient(135deg, #1a2332, #2a1a3e);">
            ${isHero ? '<div class="hero-badge">🏆 HERO</div>' : ''}
            <h4 style="color:var(--text-primary);">👧 ${s.name}</h4>
            <p style="color:var(--text-secondary);">Roll No: ${s.rollNo} | Class: ${s.class}</p>
            <p style="margin:8px 0;">📊 Weekly Score: <strong style="color:${s.percentage >= 80 ? 'var(--accent-green)' : s.percentage >= 60 ? 'var(--accent-gold)' : '#ff1744'};">${s.percentage}%</strong></p>
            <p style="color:var(--text-secondary);">🏅 ${s.percentage >= 80 ? 'Excellent 🌟' : s.percentage >= 60 ? 'Good 👍' : 'Needs Improvement 📖'}</p>
            <div style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap;">
                <input type="text" id="phone-${s.id}" placeholder="WhatsApp No. (e.g., 923001234567)" style="flex:1; padding:10px; border-radius:10px; border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.04); color:var(--text-primary); min-width:150px;">
                <button class="btn-accent" onclick="window.sendWhatsApp(${s.id})" style="padding:10px 20px;">📱 Send</button>
            </div>
        </div>`;
    }).join('');
}

function sendWhatsApp(studentId) {
    const student = analysisResult.students.find(s => s.id == studentId);
    const phone = document.getElementById(`phone-${studentId}`).value.trim();
    if (!phone) {
        showToast('Enter WhatsApp number', 'error');
        return;
    }
    const breakdown = student.dailyScores.map(d => `${d.dayName}: ${d.score}/10`).join('\n');
    const msg = `📋 *Weekly Hygiene Report - ${student.name}*\n\n🏆 Overall Score: ${student.percentage}%\n\n📅 Daily Breakdown:\n${breakdown}\n\n${student.percentage >= 80 ? '🎉 Great job! Keep it up!' : '💪 Keep practicing hygiene at home!'}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    showToast(`📱 Opening WhatsApp for ${student.name}`);
}

// ============ SHARE FUNCTIONS ============
function shareOnPlatform(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('MAGICRILLS.COM - ECCE Health & Hygiene Teacher Tool');
    const text = encodeURIComponent('Check out this amazing tool for teachers to track student hygiene! 🧼📊');
    
    let shareUrl = '';
    switch (platform) {
        case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
        case 'twitter': shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`; break;
        case 'whatsapp': shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`; break;
        case 'linkedin': shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`; break;
        default: return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    recordShare(platform);
    showToast(`📤 Shared on ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`);
}

function copyPageLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('🔗 Link copied to clipboard!');
        recordShare('copy');
    }).catch(() => {
        // Fallback
        const input = document.createElement('input');
        input.value = window.location.href;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        showToast('🔗 Link copied to clipboard!');
        recordShare('copy');
    });
}

// ============ NAVIGATION ============
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
    document.querySelectorAll('.step').forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        if (stepNum < currentStep) step.classList.add('completed');
        else if (stepNum === currentStep) step.classList.add('active');
    });
    if (students.length > 0) document.querySelector('.step:first-child')?.classList.add('completed');
    if (analysisResult) document.querySelectorAll('.step')[2]?.classList.add('completed');
}

function updateNavButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn) prevBtn.classList.toggle('disabled', currentStep === 1);
    if (nextBtn) nextBtn.classList.toggle('disabled', currentStep === 4);
}

// ============ EXPORT FUNCTIONS ============
function exportReportPDF() {
    if (!analysisResult) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.setTextColor(0, 230, 118);
    doc.text('Weekly Hygiene Report', 105, 20, { align: 'center' });
    
    const hero = analysisResult.heroOfWeek;
    doc.setFontSize(16);
    doc.setTextColor(255, 215, 0);
    doc.text(`🏆 HERO: ${hero.name} (${hero.percentage}%)`, 105, 35, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    let y = 55;
    
    for (const s of analysisResult.students) {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFillColor(s.id === hero.id ? 255 : 0, s.id === hero.id ? 215 : 230, s.id === hero.id ? 0 : 118);
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
    
    const data = analysisResult.students.map(s => ({
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
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hygiene Report');
    XLSX.writeFile(wb, 'Hygiene_Report.xlsx');
    showToast('📊 Excel Report Downloaded!');
}

function exportReportDOC() {
    if (!analysisResult) return;
    
    const hero = analysisResult.heroOfWeek;
    const html = `
        <html>
        <head>
            <title>Weekly Hygiene Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; background: #0a0e1a; color: #f0f4ff; }
                h1 { color: #00e676; text-align: center; }
                .hero { background: linear-gradient(135deg, #ffd54f, #f9a825); padding: 20px; text-align: center; border-radius: 10px; margin-bottom: 30px; color: #1a1a2e; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #333; padding: 10px; text-align: left; }
                th { background: #00e676; color: #0a0e1a; }
                tr:nth-child(even) { background: #111827; }
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
                <thead><tr><th>Student Name</th><th>Roll No</th><th>Class</th><th>Weekly Score</th><th>Grade</th></tr></thead>
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
            <p style="margin-top:30px; text-align:center; color:#666;">Generated on: ${new Date().toLocaleString()}</p>
        </body>
        </html>
    `;
    
    const blob = new Blob([html], { type: 'application/msword' });
    const link = document.createElement('a');
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

// ============ SCROLL & UI ============
function setupScrollButtons() {
    const scrollUpBtn = document.getElementById('scrollUpBtn');
    const scrollDownBtn = document.getElementById('scrollDownBtn');
    const homeBtn = document.getElementById('homeBtn');
    const pageShareBtn = document.getElementById('pageShareBtn');
    
    scrollDownBtn?.addEventListener('click', () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    
    scrollUpBtn?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    homeBtn?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        goToStep(1);
        showToast('🏠 Back to Home');
    });
    
    pageShareBtn?.addEventListener('click', copyPageLink);
    
    window.addEventListener('scroll', () => {
        if (scrollUpBtn) {
            scrollUpBtn.style.display = window.scrollY > 200 ? 'flex' : 'none';
        }
    });
}

// ============ INITIALIZATION ============
async function init() {
    // Record view and fetch stats
    await recordView();
    await incrementUsage();
    await fetchToolStats();
    
    // Start typewriter animation
    startTypewriter();
    
    // Setup UI
    updateStudentList();
    updateProgressStepsUI();
    updateNavButtons();
    setupFileUpload();
    setupScrollButtons();
    
    if (students.length > 0) renderDailyChecklist();
    
    // Reaction buttons
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const emoji = btn.dataset.emoji;
            addReaction(emoji);
            btn.classList.add('active');
            setTimeout(() => btn.classList.remove('active'), 500);
        });
    });
    
    // Navigation buttons
    document.getElementById('addStudentBtn')?.addEventListener('click', addStudent);
    document.getElementById('prevBtn')?.addEventListener('click', navigatePrev);
    document.getElementById('nextBtn')?.addEventListener('click', navigateNext);
    document.getElementById('saveTxtBtn')?.addEventListener('click', saveAndDownloadTXT);
    document.getElementById('analyzeBtn')?.addEventListener('click', analyzeAllFiles);
    document.getElementById('exportPdfBtn')?.addEventListener('click', exportReportPDF);
    document.getElementById('exportExcelBtn')?.addEventListener('click', exportReportExcel);
    document.getElementById('exportDocBtn')?.addEventListener('click', exportReportDOC);
    document.getElementById('printBtn')?.addEventListener('click', printReport);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' && currentStep < 4) navigateNext();
        if (e.key === 'ArrowLeft' && currentStep > 1) navigatePrev();
    });
    
    console.log('🚀 MAGICRILLS.COM - ECCE Health & Hygiene Teacher Tool initialized!');
    console.log('📊 Tool Slug:', TOOL_SLUG);
    console.log('👥 Students:', students.length);
}

// ============ GLOBAL EXPOSURE ============
window.removeStudent = removeStudent;
window.setCurrentDay = setCurrentDay;
window.toggleIndicators = toggleIndicators;
window.saveDailyData = saveDailyData;
window.sendWhatsApp = sendWhatsApp;
window.goToStep = goToStep;
window.navigatePrev = navigatePrev;
window.navigateNext = navigateNext;
window.shareOnPlatform = shareOnPlatform;
window.copyPageLink = copyPageLink;
window.addReaction = addReaction;

// ============ START APPLICATION ============
document.addEventListener('DOMContentLoaded', init);
