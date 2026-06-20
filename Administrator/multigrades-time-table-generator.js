// ============================================
// MULTIGRADES TIME TABLE GENERATOR
// Group-Based System with Weekly Subject Rotation
// Updated: Cloudflare Workers API
// ============================================

const TOOL_SLUG = 'multigrades-time-table-generator';
const TOOL_NAME = 'Multigrades Time Table Generator';
const CATEGORY = 'Teacher';

// ============================================
// NEW: Cloudflare Workers API Configuration
// ============================================
const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';
const API_KEY = 'magicrills-grok-api.uzairhameed01.workers.dev';

// ============================================
// LOCAL STORAGE FALLBACK KEYS
// ============================================
const LS_KEYS = {
    USAGE: 'multigrades_usage_count',
    REACTIONS: 'multigrades_reactions',
    SHARES: 'multigrades_shares',
    USER_ID: 'multigrades_user_id'
};

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
    loadToolStats();
    loadReactions();
    incrementUsage();
    initTypewriter();
});

// ============================================
// TYPEWRITER ANIMATION
// ============================================
function initTypewriter() {
    const phrases = [
        '🏫 One Teacher, Two Groups!',
        '📚 Multigrade Made Easy!',
        '👩‍🏫 Smart Classroom Management!',
        '🎯 Weekly Subject Rotation!',
        '🌟 Group-Based Teaching System!'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typewriterElement = document.getElementById('typewriter-text');
    
    if (!typewriterElement) return;
    
    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            // Deleting text
            typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            // Typing text
            typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        
        // Speed control
        let speed = isDeleting ? 50 : 100;
        
        // Check if complete
        if (!isDeleting && charIndex === currentPhrase.length) {
            speed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            speed = 500; // Pause before next
        }
        
        setTimeout(typeEffect, speed);
    }
    
    // Start typewriter
    setTimeout(typeEffect, 1000);
}

// ============================================
// CLOUDFLARE API FUNCTIONS
// ============================================

// 1. Increment Usage Counter
async function incrementUsage() {
    try {
        const response = await fetch(`${API_BASE}/api/usage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({
                tool_slug: TOOL_SLUG,
                tool_name: TOOL_NAME,
                category: CATEGORY,
                user_id: getUserId()
            })
        });
        
        if (!response.ok) throw new Error('API failed');
        const data = await response.json();
        updateUsageDisplay(data.count || 0);
        
    } catch (error) {
        console.warn('API fallback: Using localStorage');
        // Fallback to localStorage
        let count = parseInt(localStorage.getItem(LS_KEYS.USAGE) || '0');
        count++;
        localStorage.setItem(LS_KEYS.USAGE, count.toString());
        updateUsageDisplay(count);
    }
}

// 2. Load Tool Stats
async function loadToolStats() {
    try {
        const response = await fetch(`${API_BASE}/api/stats?tool_slug=${TOOL_SLUG}`, {
            headers: {
                'X-API-Key': API_KEY
            }
        });
        
        if (!response.ok) throw new Error('API failed');
        const data = await response.json();
        
        // Update stats display
        document.getElementById('globalUsageCount').textContent = data.usage || 0;
        document.getElementById('globalReactionCount').textContent = data.reactions || 0;
        document.getElementById('globalShareCount').textContent = data.shares || 0;
        
    } catch (error) {
        console.warn('API fallback: Using localStorage for stats');
        // Fallback to localStorage
        const usage = localStorage.getItem(LS_KEYS.USAGE) || '0';
        document.getElementById('globalUsageCount').textContent = usage;
        
        // Load reactions from localStorage
        const reactions = JSON.parse(localStorage.getItem(LS_KEYS.REACTIONS) || '{}');
        const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);
        document.getElementById('globalReactionCount').textContent = totalReactions;
        
        const shares = parseInt(localStorage.getItem(LS_KEYS.SHARES) || '0');
        document.getElementById('globalShareCount').textContent = shares;
    }
}

// 3. Load Reactions
async function loadReactions() {
    try {
        const response = await fetch(`${API_BASE}/api/reactions?tool_slug=${TOOL_SLUG}`, {
            headers: {
                'X-API-Key': API_KEY
            }
        });
        
        if (!response.ok) throw new Error('API failed');
        const data = await response.json();
        
        // Update reaction counts
        if (data.reactions) {
            for (const [type, count] of Object.entries(data.reactions)) {
                const el = document.getElementById(`reaction-${type}`);
                if (el) el.textContent = count;
            }
        }
        
    } catch (error) {
        console.warn('API fallback: Using localStorage for reactions');
        // Fallback to localStorage
        const reactions = JSON.parse(localStorage.getItem(LS_KEYS.REACTIONS) || '{}');
        for (const [type, count] of Object.entries(reactions)) {
            const el = document.getElementById(`reaction-${type}`);
            if (el) el.textContent = count;
        }
    }
}

// 4. Add Reaction
async function addReaction(emoji, type) {
    try {
        const response = await fetch(`${API_BASE}/api/reactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({
                tool_slug: TOOL_SLUG,
                emoji: emoji,
                reaction_type: type,
                user_id: getUserId()
            })
        });
        
        if (!response.ok) throw new Error('API failed');
        const data = await response.json();
        
        // Update count
        const el = document.getElementById(`reaction-${type}`);
        if (el && data.count !== undefined) {
            el.textContent = data.count;
        }
        
        showToast(`Thanks for your ${emoji} reaction!`, 'success');
        
    } catch (error) {
        console.warn('API fallback: Using localStorage for reaction');
        // Fallback to localStorage
        const reactions = JSON.parse(localStorage.getItem(LS_KEYS.REACTIONS) || '{}');
        reactions[type] = (reactions[type] || 0) + 1;
        localStorage.setItem(LS_KEYS.REACTIONS, JSON.stringify(reactions));
        
        // Update display
        const el = document.getElementById(`reaction-${type}`);
        if (el) el.textContent = reactions[type];
        
        showToast(`Thanks for your ${emoji} reaction! (Saved locally)`, 'success');
    }
}

// 5. Record Share
async function recordShare(platform) {
    try {
        const response = await fetch(`${API_BASE}/api/shares`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({
                tool_slug: TOOL_SLUG,
                platform: platform,
                user_id: getUserId()
            })
        });
        
        if (!response.ok) throw new Error('API failed');
        const data = await response.json();
        
        // Update share count
        document.getElementById('globalShareCount').textContent = data.total_shares || 0;
        
    } catch (error) {
        console.warn('API fallback: Using localStorage for share');
        // Fallback to localStorage
        let shares = parseInt(localStorage.getItem(LS_KEYS.SHARES) || '0');
        shares++;
        localStorage.setItem(LS_KEYS.SHARES, shares.toString());
        document.getElementById('globalShareCount').textContent = shares;
    }
}

// 6. Get User ID
function getUserId() {
    let id = localStorage.getItem(LS_KEYS.USER_ID);
    if (!id) {
        id = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem(LS_KEYS.USER_ID, id);
    }
    return id;
}

// 7. Update Usage Display
function updateUsageDisplay(count) {
    const el = document.getElementById('globalUsageCount');
    if (el) el.textContent = count;
}

// ============================================
// UI HELPERS
// ============================================

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-info-circle';
    const color = type === 'success' ? 'var(--secondary)' : 'var(--primary)';
    toast.style.borderRightColor = color;
    toast.innerHTML = `<i class="fas ${icon}" style="color:${color}"></i> ${message}`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function initializeEventListeners() {
    document.getElementById('teacherCount').addEventListener('change', generateTeacherForms);
    document.getElementById('generateBtn').addEventListener('click', generateTimetable);
    document.getElementById('exportPDFBtn').addEventListener('click', () => exportTimetable('pdf'));
    document.getElementById('exportDOCBtn').addEventListener('click', () => exportTimetable('doc'));
    document.getElementById('exportTXTBtn').addEventListener('click', () => exportTimetable('txt'));
    
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const emoji = btn.dataset.emoji;
            const type = btn.dataset.reaction;
            if (emoji && type) {
                addReaction(emoji, type);
            }
        });
    });
    
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.dataset.platform;
            if (platform) {
                shareTool(platform);
            }
        });
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

// Share Tool Function
async function shareTool(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Multigrades Time Table Generator - Group-Based Teaching System');
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
        whatsapp: `https://wa.me/?text=${title}%20${url}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        email: `mailto:?subject=${title}&body=${url}`
    };
    
    if (platform === 'copy') {
        try {
            await navigator.clipboard.writeText(window.location.href);
            showToast('Link copied to clipboard!', 'success');
        } catch (err) {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = window.location.href;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast('Link copied!', 'success');
        }
    } else if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    
    // Record share
    await recordShare(platform);
}
