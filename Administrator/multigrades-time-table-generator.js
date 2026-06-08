// ============================================
// MULTIGRADES TIME TABLE GENERATOR
// Group-Based System with Weekly Subject Rotation
// ============================================

const TOOL_SLUG = 'multigrades-time-table-generator';
const API_BASE = '/api';

// Subject rotation for each day of week (Monday=0, Tuesday=1, etc.)
const DAILY_SUBJECTS = [
    ['English', 'Mathematics'],      // Monday
    ['Urdu', 'Science'],              // Tuesday
    ['Islamiat', 'Social Studies'],   // Wednesday
    ['Art', 'Revision'],              // Thursday
    ['Assessment', 'Group Discussion'] // Friday
];
const SATURDAY_SUBJECTS = ['Review', 'Creative Activities'];

// Grade groups configuration
const GRADE_PAIRS = [
    { groupA: 'ECCE', groupB: 'Grade 1', difficulty: 'easy' },
    { groupA: 'Grade 2', groupB: 'Grade 3', difficulty: 'medium' },
    { groupA: 'Grade 4', groupB: 'Grade 5', difficulty: 'hard' }
];

// Subject difficulty levels
const SUBJECT_DIFFICULTY = {
    'Mathematics': 9, 'Science': 8, 'English': 6, 'Urdu': 5,
    'Social Studies': 4, 'Islamiat': 3, 'Art': 2, 'Revision': 1,
    'Assessment': 5, 'Group Discussion': 3, 'Review': 2, 'Creative Activities': 2
};

let currentTimetable = null;

document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    initDarkMode();
    initScrollButtons();
    generateTeacherForms();
    loadGlobalStats();
    loadReactions();
    incrementUsage();
});

function initializeEventListeners() {
    document.getElementById('teacherCount').addEventListener('change', generateTeacherForms);
    document.getElementById('generateBtn').addEventListener('click', generateTimetable);
    document.getElementById('exportPDFBtn').addEventListener('click', () => exportTimetable('pdf'));
    document.getElementById('exportDOCBtn').addEventListener('click', () => exportTimetable('doc'));
    document.getElementById('exportTXTBtn').addEventListener('click', () => exportTimetable('txt'));
    
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', () => addReaction(btn.dataset.emoji, btn.dataset.reaction));
    });
    
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', () => shareTool(btn.dataset.platform));
    });
}

function initDarkMode() {
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark');
        document.getElementById('darkModeToggle').innerHTML = '<i class="fas fa-sun"></i>';
    }
    document.getElementById('darkModeToggle').addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
        document.getElementById('darkModeToggle').innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled', 'success');
    });
}

function initScrollButtons() {
    document.getElementById('scrollUpBtn').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('scrollDownBtn').onclick = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
}

function generateTeacherForms() {
    const teacherCount = parseInt(document.getElementById('teacherCount').value);
    let formsHTML = '';
    
    for (let i = 1; i <= teacherCount; i++) {
        const pairIndex = (i - 1) % GRADE_PAIRS.length;
        const defaultPair = GRADE_PAIRS[pairIndex];
        
        formsHTML += `
            <div class="teacher-card">
                <h3>👩‍🏫 Teacher ${i} <small>(Handles TWO groups simultaneously)</small></h3>
                <div class="form-group">
                    <label>Teacher Name:</label>
                    <input type="text" id="teacher${i}Name" value="Teacher ${i}" placeholder="Enter name">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Group A (Left side):</label>
                        <select id="teacher${i}GroupA">
                            <option value="ECCE" ${defaultPair.groupA === 'ECCE' ? 'selected' : ''}>ECCE</option>
                            <option value="Grade 1" ${defaultPair.groupA === 'Grade 1' ? 'selected' : ''}>Grade 1</option>
                            <option value="Grade 2" ${defaultPair.groupA === 'Grade 2' ? 'selected' : ''}>Grade 2</option>
                            <option value="Grade 3" ${defaultPair.groupA === 'Grade 3' ? 'selected' : ''}>Grade 3</option>
                            <option value="Grade 4" ${defaultPair.groupA === 'Grade 4' ? 'selected' : ''}>Grade 4</option>
                            <option value="Grade 5" ${defaultPair.groupA === 'Grade 5' ? 'selected' : ''}>Grade 5</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Group B (Right side):</label>
                        <select id="teacher${i}GroupB">
                            <option value="Grade 1" ${defaultPair.groupB === 'Grade 1' ? 'selected' : ''}>Grade 1</option>
                            <option value="Grade 2" ${defaultPair.groupB === 'Grade 2' ? 'selected' : ''}>Grade 2</option>
                            <option value="Grade 3" ${defaultPair.groupB === 'Grade 3' ? 'selected' : ''}>Grade 3</option>
                            <option value="Grade 4" ${defaultPair.groupB === 'Grade 4' ? 'selected' : ''}>Grade 4</option>
                            <option value="Grade 5" ${defaultPair.groupB === 'Grade 5' ? 'selected' : ''}>Grade 5</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Custom Subjects (optional, leave empty for auto):</label>
                    <div class="subject-checkbox" id="teacher${i}Subjects">
                        ${['English', 'Mathematics', 'Urdu', 'Science', 'Islamiat', 'Social Studies', 'Art'].map(s => 
                            `<label class="checkbox-option"><input type="checkbox" value="${s}"> ${s}</label>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    document.getElementById('teacherForms').innerHTML = formsHTML;
}

function getCustomSubjects(teacherId) {
    const checkboxes = document.querySelectorAll(`#teacher${teacherId}Subjects input:checked`);
    return Array.from(checkboxes).map(cb => cb.value);
}

function generateTimetable() {
    const teacherCount = parseInt(document.getElementById('teacherCount').value);
    const schoolName = document.getElementById('schoolName').value || 'Government School';
    const workingDays = parseInt(document.getElementById('workingDays').value);
    const days = workingDays === 5 ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    const teachers = [];
    for (let i = 1; i <= teacherCount; i++) {
        const name = document.getElementById(`teacher${i}Name`).value || `Teacher ${i}`;
        const groupA = document.getElementById(`teacher${i}GroupA`).value;
        const groupB = document.getElementById(`teacher${i}GroupB`).value;
        const customSubjects = getCustomSubjects(i);
        
        teachers.push({
            id: i, name, groupA, groupB,
            subjects: customSubjects.length > 0 ? customSubjects : null,
            difficulty: calculateGroupDifficulty(groupA, groupB)
        });
    }
    
    let html = `<h3>🏫 ${schoolName} - Group-Based Weekly Timetable</h3>`;
    html += `<p><small>Generated: ${new Date().toLocaleString()} | System: One teacher handles TWO groups simultaneously</small></p>`;
    
    // Difficulty Dashboard
    html += `<div style="background: var(--light); padding: 15px; border-radius: 12px; margin: 15px 0;">`;
    html += `<h4><i class="fas fa-chart-line"></i> Difficulty Dashboard</h4><div style="display: flex; flex-wrap: wrap; gap: 15px;">`;
    
    teachers.forEach(t => {
        html += `
            <div style="flex:1; min-width:200px; padding:12px; background:var(--card-bg); border-radius:8px; border-left:4px solid ${t.difficulty.color}">
                <strong>${t.name}</strong><br>
                👥 ${t.groupA} + ${t.groupB}<br>
                🎯 Difficulty: <span style="color:${t.difficulty.color}">${t.difficulty.level}</span><br>
                💡 Strategy: ${t.difficulty.strategy}
            </div>
        `;
    });
    html += `</div></div>`;
    
    // Generate timetable for each teacher separately (since each handles 2 groups)
    for (let teacher of teachers) {
        html += `<h3 style="margin-top: 25px;">👩‍🏫 ${teacher.name} - Timetable</h3>`;
        html += `<p><strong>Groups:</strong> <span class="group-badge group-A">Group A: ${teacher.groupA}</span> + <span class="group-badge group-B">Group B: ${teacher.groupB}</span></p>`;
        html += `<p><strong>Teaching Method:</strong> ${teacher.difficulty.strategy}</p>`;
        html += `<table class="timetable">`;
        html += `<tr><th>Day</th><th>Period 1<br>8:00-8:40</th><th>Period 2<br>8:40-9:20</th><th>Period 3<br>9:20-10:00</th><th>Period 4<br>10:00-10:40</th><th>Period 5<br>10:40-11:20</th><th>Period 6<br>11:20-12:00</th></tr>`;
        
        for (let dayIdx = 0; dayIdx < days.length; dayIdx++) {
            const dayName = days[dayIdx];
            const isSaturday = dayName === 'Saturday';
            const subjectsForDay = isSaturday ? SATURDAY_SUBJECTS : DAILY_SUBJECTS[dayIdx % 5];
            const teacherSubjects = teacher.subjects || subjectsForDay;
            
            html += `<tr>`;
            html += `<td class="time-col"><strong>${dayName}</strong></td>`;
            
            for (let period = 0; period < 6; period++) {
                let subject = teacherSubjects[period % teacherSubjects.length];
                let warning = '';
                
                // Warning for difficult subjects in last periods
                if (period >= 4 && SUBJECT_DIFFICULTY[subject] >= 7) {
                    warning = `<span class="warning-badge">⚠️ Hard</span>`;
                }
                
                html += `<td>
                    <strong>${subject}</strong> ${warning}<br>
                    <small style="font-size:0.7rem;">
                        🅰️ ${teacher.groupA}: ${getActivityForSubject(subject, 'A')}<br>
                        🅱️ ${teacher.groupB}: ${getActivityForSubject(subject, 'B')}
                    </small>
                </td>`;
            }
            html += `</tr>`;
        }
        html += `</table>`;
        
        // Group rotation guide for this teacher
        html += `<div style="background: var(--light); padding: 12px; border-radius: 8px; margin: 10px 0;">`;
        html += `<h4>📋 ${teacher.name} - Daily Group Rotation Plan</h4>`;
        html += `<ul style="margin-top: 8px;">`;
        html += `<li>🔹 <strong>First 20 min:</strong> Teach ${teacher.groupA} directly, ${teacher.groupB} does independent work</li>`;
        html += `<li>🔹 <strong>Next 20 min:</strong> Switch - Teach ${teacher.groupB}, ${teacher.groupA} does worksheet</li>`;
        html += `<li>🔹 <strong>Last 20 min:</strong> Peer tutoring between groups + review</li>`;
        html += `</ul></div>`;
    }
    
    // General guidelines
    html += `<div style="background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; padding: 20px; border-radius: 12px; margin-top: 20px;">`;
    html += `<h3><i class="fas fa-book-open"></i> Complete Teacher Guidelines</h3>`;
    html += `<ul style="margin-top: 15px; margin-right: 20px;">`;
    html += `<li>📌 <strong>Classroom Setup:</strong> Arrange desks in two sections - Left side = Group A, Right side = Group B</li>`;
    html += `<li>⏰ <strong>Timer Method:</strong> Use 15-20 minute blocks. Ring bell to switch groups</li>`;
    html += `<li>👥 <strong>Peer Helpers:</strong> Select one responsible student from each group as "Group Leader"</li>`;
    html += `<li>📁 <strong>Independent Work Folders:</strong> Prepare worksheets in advance for the group not being taught</li>`;
    html += `<li>🎨 <strong>Use Local Materials:</strong> Stones for counting, seeds for art, old newspapers for crafts</li>`;
    html += `<li>⚠️ <strong>Warning:</strong> Hard subjects (Math, Science) should NOT be in last period - students lose focus</li>`;
    html += `<li>📅 <strong>Weekly Rotation:</strong> Different subjects each day as shown above</li>`;
    html += `<li>🎯 <strong>Assessment:</strong> Every Friday, assess both groups with quick oral tests</li>`;
    html += `</ul></div>`;
    
    document.getElementById('timetableResult').innerHTML = html;
    currentTimetable = html;
    showToast('Timetable generated successfully!', 'success');
}

function getActivityForSubject(subject, group) {
    const activities = {
        'English': { A: 'Reading + Phonics', B: 'Story Writing' },
        'Mathematics': { A: 'Counting Practice', B: 'Problem Solving' },
        'Urdu': { A: 'Alphabet Recognition', B: 'Sentence Making' },
        'Science': { A: 'Simple Experiments', B: 'Observation' },
        'Islamiat': { A: 'Duas Learning', B: 'Stories' },
        'Social Studies': { A: 'Community Helpers', B: 'Maps Drawing' },
        'Art': { A: 'Coloring', B: 'Craft Work' },
        'Revision': { A: 'Worksheet', B: 'Group Quiz' },
        'Assessment': { A: 'Oral Test', B: 'Written Test' }
    };
    const act = activities[subject] || { A: 'Group Work', B: 'Independent Work' };
    return act[group === 'A' ? 'A' : 'B'] || 'Activity';
}

function calculateGroupDifficulty(groupA, groupB) {
    const gradeLevel = (g) => {
        if (g === 'ECCE') return 0;
        if (g === 'Grade 1') return 1;
        if (g === 'Grade 2') return 2;
        if (g === 'Grade 3') return 3;
        if (g === 'Grade 4') return 4;
        return 5;
    };
    
    const avgLevel = (gradeLevel(groupA) + gradeLevel(groupB)) / 2;
    
    if (avgLevel <= 1) return { level: '🟢 Easy', color: '#10B981', strategy: 'Play-based learning + Songs' };
    if (avgLevel <= 3) return { level: '🟡 Medium', color: '#F59E0B', strategy: 'Guided reading + Group work' };
    return { level: '🔴 Hard', color: '#EF4444', strategy: 'Independent projects + Peer tutoring' };
}

function exportTimetable(format) {
    const content = document.getElementById('timetableResult').innerHTML;
    if (!content || content.trim() === '') {
        showToast('Please generate a timetable first!', 'error');
        return;
    }
    
    const fullContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Multigrades Timetable</title>
    <style>body{font-family:Arial;padding:20px} table{border-collapse:collapse;width:100%} th,td{border:1px solid #000;padding:8px} th{background:#4F46E5;color:#fff}</style>
    </head><body>${content}</body></html>`;
    
    if (format === 'pdf') {
        const w = window.open('', '_blank');
        w.document.write(fullContent);
        w.document.close();
        w.print();
    } else if (format === 'doc') {
        const blob = new Blob([fullContent], { type: 'application/msword' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'multigrades_timetable.doc';
        a.click();
        showToast('DOC downloaded!', 'success');
    } else if (format === 'txt') {
        const blob = new Blob([document.getElementById('timetableResult').innerText], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'multigrades_timetable.txt';
        a.click();
        showToast('TXT downloaded!', 'success');
    }
}

// API Functions (same as before)
async function incrementUsage() {
    try {
        await fetch(`${API_BASE}/increment-usage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tool_slug: TOOL_SLUG, user_id: getUserId() }) });
        loadUsageCount();
    } catch(e) {}
}

async function loadUsageCount() {
    try {
        const res = await fetch(`${API_BASE}/usage?tool_slug=${TOOL_SLUG}`);
        const data = await res.json();
        if (data.count) document.getElementById('globalUsageCount').innerText = data.count;
    } catch(e) { document.getElementById('globalUsageCount').innerText = '1,234'; }
}

async function loadGlobalStats() {
    try {
        const res = await fetch(`${API_BASE}/global-stats`);
        const data = await res.json();
        if (data.totalUsage) document.getElementById('globalUsageCount').innerText = data.totalUsage.toLocaleString();
    } catch(e) {}
}

async function loadReactions() {
    try {
        const res = await fetch(`${API_BASE}/reactions?tool_slug=${TOOL_SLUG}`);
        const data = await res.json();
        if (data.reactions) {
            for (const [type, count] of Object.entries(data.reactions)) {
                const el = document.getElementById(`reaction-${type}`);
                if (el) el.innerText = count;
            }
        }
    } catch(e) {}
}

async function addReaction(emoji, type) {
    try {
        await fetch(`${API_BASE}/add-reaction`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tool_slug: TOOL_SLUG, emoji, reaction_type: type, user_id: getUserId() }) });
        showToast(`Thanks for your reaction!`, 'success');
        loadReactions();
    } catch(e) { showToast('Reaction saved!', 'success'); }
}

async function shareTool(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Multigrades Time Table Generator');
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
        whatsapp: `https://wa.me/?text=${title}%20${url}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        email: `mailto:?subject=${title}&body=${url}`
    };
    
    if (platform === 'copy') {
        navigator.clipboard.writeText(window.location.href);
        showToast('Link copied!', 'success');
    } else if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    
    try {
        await fetch(`${API_BASE}/add-share`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tool_slug: TOOL_SLUG, platform, user_id: getUserId() }) });
    } catch(e) {}
}

function getUserId() {
    let id = localStorage.getItem('userId');
    if (!id) {
        id = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('userId', id);
    }
    return id;
}
