/* ============================================
   CLASSROOM WEEKLY ROSTER GENERATOR - COMPLETE JS
   Cloudflare Workers API Integration
   Dark Space Theme with Neon Effects
   Full AI Integration with Groq
   ============================================ */

// ============================================
// Configuration - Cloudflare Workers API
// ============================================
const TOOL_SLUG = 'classroom-roster-generator';
const TOOL_NAME = 'Classroom Weekly Roster Generator';
const CATEGORY = 'teacher';
const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';
const API_KEY = 'magicrills-grok-api.uzairhameed01.workers.dev';

let userId = localStorage.getItem('userId');
if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
}

// Data Structures
let students = [];
let currentRoster = {
    week: 1,
    grade: 5,
    startDate: '',
    days: {},
    notes: '',
    events: [],
    holidays: []
};
let savedRosters = [];
let dutyCounts = {};
let toolStats = {
    usage: 0,
    views: 0,
    shares: 0,
    followers: 0
};

// Days of week
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const dayColors = {
    Monday: 'var(--monday)',
    Tuesday: 'var(--tuesday)',
    Wednesday: 'var(--wednesday)',
    Thursday: 'var(--thursday)',
    Friday: 'var(--friday)'
};

// ============================================
// DOM Elements
// ============================================
const usageCountSpan = document.getElementById('usageCount');
const viewsCountSpan = document.getElementById('viewsCount');
const sharesCountSpan = document.getElementById('sharesCount');
const followersCountSpan = document.getElementById('followersCount');
const studentCountSpan = document.getElementById('studentCount');
const rosterCountSpan = document.getElementById('rosterCount');
const gradeSelect = document.getElementById('gradeSelect');
const classSize = document.getElementById('classSize');
const weekSelect = document.getElementById('weekSelect');
const startDate = document.getElementById('startDate');
const teacherNotes = document.getElementById('teacherNotes');
const weeklySchedule = document.getElementById('weeklySchedule');
const studentsList = document.getElementById('studentsList');
const historyList = document.getElementById('historyList');
const dutyStats = document.getElementById('dutyStats');
const loadingOverlay = document.getElementById('loadingOverlay');
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');

// Typewriter elements
const typewriterText = document.getElementById('typewriterText');

// Navigation buttons
const homeBtn = document.getElementById('homeBtn');
const backBtn = document.getElementById('backBtn');

// Buttons
const aiGenerateBtn = document.getElementById('aiGenerateBtn');
const smartRosterBtn = document.getElementById('smartRosterBtn');
const balanceDutiesBtn = document.getElementById('balanceDutiesBtn');
const rotateDutiesBtn = document.getElementById('rotateDutiesBtn');
const saveRosterBtn = document.getElementById('saveRosterBtn');
const downloadWordBtn = document.getElementById('downloadWordBtn');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');
const downloadExcelBtn = document.getElementById('downloadExcelBtn');
const printRosterBtn = document.getElementById('printRosterBtn');
const resetRosterBtn = document.getElementById('resetRosterBtn');
const addStudentBtn = document.getElementById('addStudentBtn');
const bulkAddBtn = document.getElementById('bulkAddBtn');
const aiSuggestStudentsBtn = document.getElementById('aiSuggestStudentsBtn');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const autoSaveToggle = document.getElementById('autoSaveToggle');
const aiSuggestToggle = document.getElementById('aiSuggestToggle');
const dutiesPerDay = document.getElementById('dutiesPerDay');
const exportDataBtn = document.getElementById('exportDataBtn');
const importDataBtn = document.getElementById('importDataBtn');
const importFile = document.getElementById('importFile');
const pageShareBtn = document.getElementById('pageShareBtn');
const scrollUpBtn = document.getElementById('scrollUpBtn');
const scrollDownBtn = document.getElementById('scrollDownBtn');
const addHolidayBtn = document.getElementById('addHolidayBtn');
const addEventBtn = document.getElementById('addEventBtn');
const applySuggestionBtn = document.getElementById('applySuggestionBtn');
const dismissSuggestionBtn = document.getElementById('dismissSuggestionBtn');

// AI Suggestion Bar
const aiSuggestionBar = document.getElementById('aiSuggestionBar');
const aiSuggestionText = document.getElementById('aiSuggestionText');

// ============================================
// Cloudflare Workers API Calls
// ============================================

// 1. Track Usage - Increment Counter
async function trackUsage() {
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
                user_id: userId
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            updateUsageDisplay(data.count || 0);
        }
        return true;
    } catch(e) {
        console.error('Usage tracking failed:', e);
        // Fallback: LocalStorage
        const localCount = parseInt(localStorage.getItem('tool_usage_' + TOOL_SLUG) || '0') + 1;
        localStorage.setItem('tool_usage_' + TOOL_SLUG, localCount);
        updateUsageDisplay(localCount);
        return false;
    }
}

// 2. Add/Get Reactions
async function addReaction(emoji) {
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
                user_id: userId
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            updateReactionDisplay(emoji, data.count);
            showToast(getEmojiName(emoji) + ' reaction added! ✨');
        }
        return true;
    } catch(e) {
        console.error('Reaction failed:', e);
        // Fallback: LocalStorage
        const key = 'reaction_' + TOOL_SLUG + '_' + emoji;
        const count = parseInt(localStorage.getItem(key) || '0') + 1;
        localStorage.setItem(key, count);
        updateReactionDisplay(emoji, count);
        showToast(getEmojiName(emoji) + ' reaction added! ✨');
        return false;
    }
}

// 3. Record Shares
async function trackShare(platform) {
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
                share_type: 'tool',
                user_id: userId
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            updateSharesDisplay(data.count || 0);
        }
        return true;
    } catch(e) {
        console.error('Share tracking failed:', e);
        // Fallback: LocalStorage
        const shareCount = parseInt(localStorage.getItem('shares_' + TOOL_SLUG) || '0') + 1;
        localStorage.setItem('shares_' + TOOL_SLUG, shareCount);
        updateSharesDisplay(shareCount);
        return false;
    }
}

// 4. Get Tool Stats
async function loadStats() {
    try {
        const response = await fetch(`${API_BASE}/api/stats?tool_slug=${TOOL_SLUG}`, {
            headers: {
                'X-API-Key': API_KEY
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Update dashboard stats
            updateUsageDisplay(data.total_usage || 0);
            updateViewsDisplay(data.total_views || 0);
            updateSharesDisplay(data.total_shares || 0);
            updateFollowersDisplay(data.total_followers || 0);
            
            // Update reactions
            const emojis = ['like', 'love', 'wow', 'sad', 'angry', 'laugh', 'celebrate'];
            emojis.forEach(e => {
                const count = data[e + '_count'] || 0;
                updateReactionDisplay(e, count);
            });
        }
        return true;
    } catch(e) {
        console.error('Stats load failed:', e);
        // Fallback: Load from LocalStorage
        loadStatsFromLocal();
        return false;
    }
}

// ============================================
// Stats Display Update Functions
// ============================================
function updateUsageDisplay(count) {
    if (usageCountSpan) usageCountSpan.textContent = count;
    localStorage.setItem('usage_' + TOOL_SLUG, count);
}

function updateViewsDisplay(count) {
    if (viewsCountSpan) viewsCountSpan.textContent = count;
    localStorage.setItem('views_' + TOOL_SLUG, count);
}

function updateSharesDisplay(count) {
    if (sharesCountSpan) sharesCountSpan.textContent = count;
    localStorage.setItem('shares_' + TOOL_SLUG, count);
}

function updateFollowersDisplay(count) {
    if (followersCountSpan) followersCountSpan.textContent = count;
    localStorage.setItem('followers_' + TOOL_SLUG, count);
}

function updateReactionDisplay(emoji, count) {
    const span = document.getElementById(emoji + 'Count');
    if (span) span.textContent = count;
    localStorage.setItem('reaction_' + TOOL_SLUG + '_' + emoji, count);
}

function loadStatsFromLocal() {
    const usage = parseInt(localStorage.getItem('usage_' + TOOL_SLUG) || '0');
    const views = parseInt(localStorage.getItem('views_' + TOOL_SLUG) || '0');
    const shares = parseInt(localStorage.getItem('shares_' + TOOL_SLUG) || '0');
    const followers = parseInt(localStorage.getItem('followers_' + TOOL_SLUG) || '0');
    
    updateUsageDisplay(usage);
    updateViewsDisplay(views);
    updateSharesDisplay(shares);
    updateFollowersDisplay(followers);
}

// ============================================
// AI Functions with Groq API
// ============================================
async function generateStudentNames() {
    const size = parseInt(classSize.value);
    const grade = gradeSelect.value;
    
    showLoading(true, '🤖 AI is generating student names...');
    
    try {
        const response = await fetch(`${API_BASE}/api/generate-students`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({
                grade: grade,
                count: size,
                tool_slug: TOOL_SLUG
            })
        });
        
        const data = await response.json();
        
        if (data.success && data.students) {
            students = data.students.map((name, index) => ({
                id: Date.now() + index,
                name: name,
                dutyCount: 0
            }));
            saveStudentsToLocal();
            renderStudentsList();
            updateStudentCount();
            showToast(`🎓 ${students.length} students generated!`);
            
            if (aiSuggestToggle && aiSuggestToggle.classList.contains('active')) {
                showAISuggestion(`✨ Generated ${students.length} student names for Grade ${grade}. Ready to create roster!`);
            }
        } else {
            generateMockStudents();
        }
    } catch(error) {
        console.error('AI generation failed:', error);
        generateMockStudents();
    }
    
    showLoading(false);
}

function generateMockStudents() {
    const size = parseInt(classSize.value);
    const firstNames = ['Ahmad', 'Sarah', 'Omar', 'Fatima', 'Ali', 'Zainab', 'Hassan', 'Ayesha', 
                       'Bilal', 'Mariam', 'Usman', 'Sana', 'Hamza', 'Kinza', 'Saad', 'Iqra', 
                       'Rayan', 'Hira', 'Shahzaib', 'Laiba', 'Muhammad', 'Aisha', 'Ibrahim', 'Maryam'];
    students = [];
    for (let i = 0; i < size; i++) {
        students.push({
            id: Date.now() + i,
            name: firstNames[i % firstNames.length] + (i >= firstNames.length ? ' ' + (Math.floor(i / firstNames.length) + 1) : ''),
            dutyCount: 0
        });
    }
    saveStudentsToLocal();
    renderStudentsList();
    updateStudentCount();
    showToast(`🎓 ${students.length} students ready!`);
}

async function smartRosterGenerator() {
    if (students.length === 0) {
        showToast('⚠️ Please generate student names first!', 'error');
        return;
    }
    
    showLoading(true, '🤖 AI is creating smart roster...');
    await trackUsage();
    
    const dutiesPerDayCount = parseInt(dutiesPerDay.value);
    
    // Reset duty counts
    students.forEach(s => s.dutyCount = 0);
    
    try {
        // Try AI-powered roster generation
        const response = await fetch(`${API_BASE}/api/generate-roster`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({
                students: students,
                days: days,
                duties_per_day: dutiesPerDayCount,
                tool_slug: TOOL_SLUG
            })
        });
        
        const data = await response.json();
        
        if (data.success && data.roster) {
            currentRoster.days = data.roster;
            renderRoster();
            updateDutyStats();
            saveToLocalStorage();
            showToast('✨ Smart roster generated by AI!');
            showLoading(false);
            return;
        }
    } catch(e) {
        console.error('AI roster generation failed, using fallback:', e);
    }
    
    // Fallback: Balanced roster generation
    const shuffled = [...students];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    let studentIndex = 0;
    const totalDuties = days.length * dutiesPerDayCount;
    
    for (let day of days) {
        currentRoster.days[day] = [];
        for (let i = 0; i < dutiesPerDayCount; i++) {
            const student = shuffled[studentIndex % shuffled.length];
            currentRoster.days[day].push({
                dutyNumber: i + 1,
                studentId: student.id,
                studentName: student.name
            });
            const s = students.find(st => st.id === student.id);
            if (s) s.dutyCount++;
            studentIndex++;
        }
    }
    
    renderRoster();
    updateDutyStats();
    saveToLocalStorage();
    showToast('✨ Smart roster generated!');
    showLoading(false);
}

function balanceDuties() {
    if (students.length === 0) {
        showToast('⚠️ No students available!', 'error');
        return;
    }
    
    const dutiesPerDayCount = parseInt(dutiesPerDay.value);
    const totalDuties = days.length * dutiesPerDayCount;
    const targetPerStudent = Math.floor(totalDuties / students.length);
    
    // Reset and reassign
    students.forEach(s => s.dutyCount = 0);
    
    // Create duty pool
    let dutyPool = [];
    for (let day of days) {
        for (let i = 0; i < dutiesPerDayCount; i++) {
            dutyPool.push({ day: day, dutyNumber: i + 1 });
        }
    }
    
    // Shuffle duty pool
    for (let i = dutyPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [dutyPool[i], dutyPool[j]] = [dutyPool[j], dutyPool[i]];
    }
    
    // Assign duties
    let studentIndex = 0;
    for (let duty of dutyPool) {
        const student = students[studentIndex % students.length];
        if (!currentRoster.days[duty.day]) currentRoster.days[duty.day] = [];
        currentRoster.days[duty.day][duty.dutyNumber - 1] = {
            dutyNumber: duty.dutyNumber,
            studentId: student.id,
            studentName: student.name
        };
        student.dutyCount++;
        studentIndex++;
    }
    
    renderRoster();
    updateDutyStats();
    showToast('⚖️ Duties balanced!');
}

function rotateDuties() {
    if (students.length === 0) {
        showToast('⚠️ No students available!', 'error');
        return;
    }
    
    // Simple rotation: move each duty to next student
    for (let day of days) {
        if (currentRoster.days[day]) {
            const duties = [...currentRoster.days[day]];
            for (let i = 0; i < duties.length; i++) {
                const currentStudent = students.find(s => s.id === duties[i].studentId);
                const currentIndex = students.findIndex(s => s.id === duties[i].studentId);
                const nextStudent = students[(currentIndex + 1) % students.length];
                if (nextStudent) {
                    currentRoster.days[day][i].studentId = nextStudent.id;
                    currentRoster.days[day][i].studentName = nextStudent.name;
                }
            }
        }
    }
    
    // Reset and recount duty counts
    students.forEach(s => s.dutyCount = 0);
    for (let day of days) {
        if (currentRoster.days[day]) {
            for (let duty of currentRoster.days[day]) {
                const student = students.find(s => s.id === duty.studentId);
                if (student) student.dutyCount++;
            }
        }
    }
    
    renderRoster();
    updateDutyStats();
    showToast('🔄 Duties rotated!');
}

// ============================================
// Typewriter Animation
// ============================================
function initTypewriter() {
    if (!typewriterText) return;
    
    const phrases = [
        '✨ AI-Powered Duty Roster Generator',
        '📚 Smart Classroom Management Tool',
        '🎯 Balanced Weekly Duty Schedules',
        '🤖 Intelligent Student Name Suggestions',
        '📊 Real-time Duty Statistics',
        '🌟 Create Perfect Rosters in Seconds'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentText = '';
    
    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            currentText = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            currentText = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        
        typewriterText.textContent = currentText;
        typewriterText.style.borderRight = '2px solid var(--neon-cyan)';
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }
        
        setTimeout(type, typeSpeed);
    }
    
    setTimeout(type, 1000);
}

// ============================================
// Render Functions
// ============================================
function renderRoster() {
    const dutiesPerDayCount = parseInt(dutiesPerDay.value);
    let html = '';
    
    for (let day of days) {
        const duties = currentRoster.days[day] || [];
        const hasHoliday = currentRoster.holidays?.includes(day);
        const hasEvent = currentRoster.events?.find(e => e.day === day);
        
        html += `
            <div class="day-card neon-border" style="background: ${dayColors[day]}15">
                <div class="day-header" style="background: ${dayColors[day]}">
                    <i class="fas fa-calendar-day"></i> ${day}
                    ${hasHoliday ? '<span class="holiday-marker">🎉 Holiday</span>' : ''}
                    ${hasEvent ? `<span class="event-marker">📌 ${hasEvent.title}</span>` : ''}
                </div>
                <div class="day-content">
        `;
        
        for (let i = 0; i < dutiesPerDayCount; i++) {
            const duty = duties[i] || { dutyNumber: i + 1, studentId: null, studentName: '' };
            html += `
                <div class="duty-row glass-effect">
                    <div class="duty-number neon-text">${duty.dutyNumber}</div>
                    <select class="duty-select neon-input" data-day="${day}" data-duty="${i}">
                        <option value="">-- Select Student --</option>
                        ${students.map(s => `<option value="${s.id}" ${duty.studentId === s.id ? 'selected' : ''}>${escapeHtml(s.name)}</option>`).join('')}
                    </select>
                </div>
            `;
        }
        
        html += `</div></div>`;
    }
    
    weeklySchedule.innerHTML = html;
    
    // Add event listeners to selects
    document.querySelectorAll('.duty-select').forEach(select => {
        select.addEventListener('change', (e) => {
            const day = select.dataset.day;
            const dutyIndex = parseInt(select.dataset.duty);
            const studentId = parseInt(select.value);
            const student = students.find(s => s.id === studentId);
            
            if (!currentRoster.days[day]) currentRoster.days[day] = [];
            currentRoster.days[day][dutyIndex] = {
                dutyNumber: dutyIndex + 1,
                studentId: studentId,
                studentName: student ? student.name : ''
            };
            
            saveToLocalStorage();
            updateDutyStats();
        });
    });
}

function renderStudentsList() {
    if (!studentsList) return;
    
    if (students.length === 0) {
        studentsList.innerHTML = `
            <div class="empty-state glass-effect">
                <i class="fas fa-users" style="font-size: 3rem; color: var(--neon-cyan);"></i>
                <p>No students added yet. Use AI Generate or Add Student button.</p>
            </div>
        `;
        return;
    }
    
    studentsList.innerHTML = students.map(student => `
        <div class="student-item glass-effect neon-border" data-id="${student.id}">
            <div>
                <div class="student-name"><i class="fas fa-user-graduate neon-text"></i> ${escapeHtml(student.name)}</div>
                <div class="student-duties">📊 Duties: ${student.dutyCount || 0} times</div>
            </div>
            <button class="delete-student neon-btn" data-id="${student.id}"><i class="fas fa-trash-alt"></i></button>
        </div>
    `).join('');
    
    document.querySelectorAll('.delete-student').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            students = students.filter(s => s.id !== id);
            saveStudentsToLocal();
            renderStudentsList();
            updateStudentCount();
            renderRoster();
            showToast('🗑️ Student removed');
        });
    });
}

function updateDutyStats() {
    if (!dutyStats) return;
    
    const sorted = [...students].sort((a, b) => (b.dutyCount || 0) - (a.dutyCount || 0));
    dutyStats.innerHTML = `
        <h4><i class="fas fa-chart-bar neon-text"></i> Duty Statistics</h4>
        <div class="duty-stats-grid">
            ${sorted.map(s => `
                <div class="duty-stat-item glass-effect">
                    <span><i class="fas fa-user"></i> ${escapeHtml(s.name)}</span>
                    <span><strong class="neon-text">${s.dutyCount || 0}</strong> duties</span>
                </div>
            `).join('')}
        </div>
    `;
}

function updateStudentCount() {
    if (studentCountSpan) studentCountSpan.textContent = students.length;
}

// ============================================
// Save/Load Functions
// ============================================
function saveRoster() {
    if (students.length === 0) {
        showToast('⚠️ No students to save!', 'error');
        return;
    }
    
    const roster = {
        id: Date.now(),
        grade: gradeSelect.value,
        week: weekSelect.value,
        startDate: startDate.value,
        days: currentRoster.days,
        notes: teacherNotes.value,
        students: students,
        timestamp: new Date().toISOString()
    };
    
    const saved = JSON.parse(localStorage.getItem('savedRosters') || '[]');
    saved.unshift(roster);
    if (saved.length > 20) saved.pop();
    localStorage.setItem('savedRosters', JSON.stringify(saved));
    
    renderHistory();
    updateRosterCount();
    showToast('💾 Roster saved successfully!');
}

function loadRoster(roster) {
    gradeSelect.value = roster.grade;
    weekSelect.value = roster.week;
    startDate.value = roster.startDate;
    teacherNotes.value = roster.notes || '';
    currentRoster.days = roster.days || {};
    students = roster.students || [];
    
    saveStudentsToLocal();
    renderStudentsList();
    renderRoster();
    updateStudentCount();
    updateDutyStats();
    showToast('📂 Roster loaded!');
}

function renderHistory() {
    const saved = JSON.parse(localStorage.getItem('savedRosters') || '[]');
    
    if (!historyList) return;
    
    if (saved.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state glass-effect">
                <i class="fas fa-history" style="font-size: 3rem; color: var(--neon-cyan);"></i>
                <p>No saved rosters yet. Create and save your first roster!</p>
            </div>
        `;
        return;
    }
    
    historyList.innerHTML = saved.map(item => `
        <div class="history-item glass-effect neon-border" data-id="${item.id}">
            <div class="history-title"><i class="fas fa-calendar-alt neon-text"></i> Grade ${item.grade} - Week ${item.week}</div>
            <div class="history-date">${new Date(item.timestamp).toLocaleString()}</div>
            <div class="history-preview">${item.notes ? item.notes.substring(0, 50) : '📝 No notes'}</div>
        </div>
    `).join('');
    
    document.querySelectorAll('.history-item').forEach(el => {
        el.addEventListener('click', () => {
            const id = parseInt(el.dataset.id);
            const found = saved.find(r => r.id === id);
            if (found) loadRoster(found);
        });
    });
}

function updateRosterCount() {
    const saved = JSON.parse(localStorage.getItem('savedRosters') || '[]');
    if (rosterCountSpan) rosterCountSpan.textContent = saved.length;
}

function saveToLocalStorage() {
    localStorage.setItem('classroomStudents', JSON.stringify(students));
    localStorage.setItem('classroomRoster', JSON.stringify(currentRoster));
}

function saveStudentsToLocal() {
    localStorage.setItem('classroomStudents', JSON.stringify(students));
}

function loadFromLocalStorage() {
    const savedStudents = localStorage.getItem('classroomStudents');
    if (savedStudents) {
        students = JSON.parse(savedStudents);
        renderStudentsList();
        updateStudentCount();
    }
    
    const savedRoster = localStorage.getItem('classroomRoster');
    if (savedRoster) {
        currentRoster = JSON.parse(savedRoster);
        renderRoster();
    }
}

// ============================================
// Export Functions
// ============================================
function downloadAsWord() {
    const grade = gradeSelect.value;
    const htmlContent = generatePrintHTML();
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Weekly_Roster_Grade_${grade}_Week_${weekSelect.value}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📄 Downloaded as Word!');
}

async function downloadAsPDF() {
    showLoading(true, '📄 Generating PDF...');
    try {
        const element = document.getElementById('weeklySchedule');
        const canvas = await html2canvas(element, { scale: 2, backgroundColor: null });
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('l', 'mm', 'a4');
        const imgWidth = 280;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save(`Roster_Grade_${gradeSelect.value}.pdf`);
        showToast('📄 PDF downloaded!');
    } catch(e) { 
        showToast('PDF generation failed', 'error'); 
    }
    showLoading(false);
}

function downloadAsExcel() {
    const dutiesPerDayCount = parseInt(dutiesPerDay.value);
    const data = [['Day', 'Duty 1', 'Duty 2', 'Duty 3', 'Duty 4', 'Duty 5', 'Duty 6']];
    
    for (let day of days) {
        const duties = currentRoster.days[day] || [];
        const row = [day];
        for (let i = 0; i < dutiesPerDayCount; i++) {
            row.push(duties[i]?.studentName || 'TBD');
        }
        data.push(row);
    }
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Weekly Roster');
    XLSX.writeFile(wb, `Roster_Grade_${gradeSelect.value}.xlsx`);
    showToast('📊 Downloaded as Excel!');
}

function printRoster() {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(generatePrintHTML());
    printWindow.document.close();
    printWindow.print();
}

function generatePrintHTML() {
    const dutiesPerDayCount = parseInt(dutiesPerDay.value);
    let tableRows = '';
    
    for (let day of days) {
        const duties = currentRoster.days[day] || [];
        let dutyCells = '';
        for (let i = 0; i < dutiesPerDayCount; i++) {
            dutyCells += `<td>${duties[i]?.studentName || '—'}</td>`;
        }
        tableRows += `<tr><td style="background:${dayColors[day]};font-weight:bold;color:white;">${day}</td>${dutyCells}</tr>`;
    }
    
    return `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><title>Weekly Classroom Roster</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 40px; background: #0a0a1a; color: #fff; }
            h1 { color: #00f0ff; text-align: center; text-shadow: 0 0 20px rgba(0,240,255,0.3); }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #1a1a3a; padding: 12px; text-align: left; }
            th { background: #00f0ff; color: #0a0a1a; }
            td { background: #0a0a1a; }
            .notes { margin-top: 30px; padding: 20px; background: #0a0a1a; border: 1px solid #00f0ff; border-radius: 8px; }
        </style>
        </head>
        <body>
            <h1>🏫 Classroom Weekly Roster</h1>
            <h2 style="color: #00f0ff;">Grade ${gradeSelect.value} - Week ${weekSelect.value}</h2>
            <table>
                <tr><th>Day</th>${Array(dutiesPerDayCount).fill().map((_,i) => `<th>Duty ${i+1}</th>`).join('')}</tr>
                ${tableRows}
            </table>
            <div class="notes"><strong>📝 Notes:</strong><br>${teacherNotes.value || 'No notes'}</div>
            <p style="margin-top: 30px; text-align: center; color: #666;">Generated by Classroom Roster Tool 🚀</p>
        </body>
        </html>
    `;
}

// ============================================
// Helper Functions
// ============================================
function showToast(msg, type = 'success') {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.classList.remove('hidden');
    toast.style.background = type === 'error' ? 'linear-gradient(135deg, #ff0040, #ff0066)' : 'linear-gradient(135deg, #00f0ff, #00ff88)';
    toast.style.boxShadow = type === 'error' ? '0 0 30px rgba(255,0,64,0.3)' : '0 0 30px rgba(0,240,255,0.3)';
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

function showLoading(show, msg = 'Processing...') {
    if (!loadingOverlay) return;
    if (show) {
        loadingOverlay.querySelector('p').textContent = msg;
        loadingOverlay.classList.remove('hidden');
    } else {
        loadingOverlay.classList.add('hidden');
    }
}

function showAISuggestion(text) {
    if (!aiSuggestionBar) return;
    aiSuggestionText.textContent = text;
    aiSuggestionBar.style.display = 'flex';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getEmojiName(emoji) {
    const names = { 
        like: '👍 Like', 
        love: '❤️ Love', 
        wow: '😮 Wow', 
        sad: '😢 Sad', 
        angry: '😠 Angry', 
        laugh: '😂 Laugh', 
        celebrate: '🎉 Celebrate' 
    };
    return names[emoji] || emoji;
}

function resetRoster() {
    if (confirm('⚠️ Reset everything? This will clear all duty assignments.')) {
        currentRoster.days = {};
        teacherNotes.value = '';
        renderRoster();
        showToast('🔄 Roster reset!');
    }
}

function addHoliday() {
    const day = prompt('Enter day for holiday (Monday-Friday):');
    if (day && days.includes(day)) {
        if (!currentRoster.holidays) currentRoster.holidays = [];
        if (!currentRoster.holidays.includes(day)) {
            currentRoster.holidays.push(day);
            renderRoster();
            showToast(`🎉 Holiday marked on ${day}!`);
        }
    }
}

function addEvent() {
    const day = prompt('Enter day (Monday-Friday):');
    const title = prompt('Enter event title:');
    if (day && title && days.includes(day)) {
        if (!currentRoster.events) currentRoster.events = [];
        currentRoster.events.push({ day: day, title: title });
        renderRoster();
        showToast(`📌 Event added on ${day}!`);
    }
}

function addStudent() {
    const name = prompt('Enter student name:');
    if (name) {
        students.push({
            id: Date.now(),
            name: name,
            dutyCount: 0
        });
        saveStudentsToLocal();
        renderStudentsList();
        updateStudentCount();
        showToast('👨‍🎓 Student added!');
    }
}

function bulkAdd() {
    const names = prompt('Enter student names separated by commas:');
    if (names) {
        const nameList = names.split(',').map(n => n.trim()).filter(n => n);
        nameList.forEach(name => {
            students.push({
                id: Date.now() + Math.random(),
                name: name,
                dutyCount: 0
            });
        });
        saveStudentsToLocal();
        renderStudentsList();
        updateStudentCount();
        showToast(`👨‍🎓 ${nameList.length} students added!`);
    }
}

function clearHistory() {
    if (confirm('Delete all saved rosters?')) {
        localStorage.removeItem('savedRosters');
        renderHistory();
        updateRosterCount();
        showToast('🗑️ History cleared!');
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    if (darkModeToggle) {
        darkModeToggle.textContent = isDark ? '🌙 On' : '☀️ Off';
        darkModeToggle.classList.toggle('active', isDark);
    }
    showToast(isDark ? '🌙 Dark mode enabled' : '☀️ Light mode enabled');
}

function changeTheme(colorTheme) {
    document.body.classList.remove('theme-vibrant', 'theme-professional', 'theme-rainbow');
    if (colorTheme !== 'pastel') {
        document.body.classList.add(`theme-${colorTheme}`);
    }
    localStorage.setItem('themeColor', colorTheme);
    
    document.querySelectorAll('.color-option').forEach(opt => {
        opt.classList.remove('selected');
        if (opt.dataset.color === colorTheme) opt.classList.add('selected');
    });
    showToast(`🎨 ${colorTheme} theme applied!`);
}

function exportData() {
    const data = {
        students: students,
        savedRosters: localStorage.getItem('savedRosters'),
        settings: {
            darkMode: localStorage.getItem('darkMode'),
            themeColor: localStorage.getItem('themeColor')
        }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roster-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('💾 Data exported!');
}

function importData() {
    importFile.click();
}

if (importFile) {
    importFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                if (data.students) students = data.students;
                if (data.savedRosters) localStorage.setItem('savedRosters', data.savedRosters);
                if (data.settings?.darkMode === 'true') toggleDarkMode();
                if (data.settings?.themeColor) changeTheme(data.settings.themeColor);
                saveStudentsToLocal();
                renderStudentsList();
                renderHistory();
                updateRosterCount();
                updateStudentCount();
                showToast('📂 Data imported!');
            } catch(err) { showToast('Invalid file', 'error'); }
        };
        reader.readAsText(file);
        importFile.value = '';
    });
}

function sharePage() {
    navigator.clipboard.writeText(window.location.href);
    showToast('🔗 Link copied!');
}

function shareTool(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Classroom Weekly Roster Generator - AI-Powered Duty Scheduler');
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook': 
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter': 
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            break;
        case 'linkedin': 
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?u=${url}`;
            break;
        case 'whatsapp': 
            shareUrl = `https://wa.me/?text=${title}%20${url}`;
            break;
        case 'email': 
            shareUrl = `mailto:?subject=${title}&body=${url}`;
            break;
    }
    
    if (shareUrl) { 
        window.open(shareUrl, '_blank');
        trackShare(platform); 
        showToast(`📤 Shared on ${platform}!`);
    }
}

// Navigation
function goHome() {
    window.location.href = 'https://magicrills.com';
}

function goBack() {
    window.location.href = 'https://magicrills.com/category-pages/mixed-tools.html';
}

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
function scrollToBottom() { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }

// ============================================
// Tabs
// ============================================
function initTabs() {
    document.querySelectorAll('.smart-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            document.querySelectorAll('.smart-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const activePanel = document.getElementById(`${tabId}-tab`);
            if (activePanel) activePanel.classList.add('active');
            
            if (tabId === 'history') renderHistory();
            if (tabId === 'students') renderStudentsList();
            if (tabId === 'roster') renderRoster();
        });
    });
}

// ============================================
// Event Listeners
// ============================================
function initEventListeners() {
    // Navigation
    homeBtn?.addEventListener('click', goHome);
    backBtn?.addEventListener('click', goBack);
    
    // AI Buttons
    aiGenerateBtn?.addEventListener('click', generateStudentNames);
    smartRosterBtn?.addEventListener('click', smartRosterGenerator);
    balanceDutiesBtn?.addEventListener('click', balanceDuties);
    rotateDutiesBtn?.addEventListener('click', rotateDuties);
    
    // Save/Export
    saveRosterBtn?.addEventListener('click', saveRoster);
    downloadWordBtn?.addEventListener('click', downloadAsWord);
    downloadPdfBtn?.addEventListener('click', downloadAsPDF);
    downloadExcelBtn?.addEventListener('click', downloadAsExcel);
    printRosterBtn?.addEventListener('click', printRoster);
    resetRosterBtn?.addEventListener('click', resetRoster);
    
    // Students
    addStudentBtn?.addEventListener('click', addStudent);
    bulkAddBtn?.addEventListener('click', bulkAdd);
    aiSuggestStudentsBtn?.addEventListener('click', generateStudentNames);
    
    // History
    clearHistoryBtn?.addEventListener('click', clearHistory);
    
    // Settings
    darkModeToggle?.addEventListener('click', toggleDarkMode);
    exportDataBtn?.addEventListener('click', exportData);
    importDataBtn?.addEventListener('click', importData);
    pageShareBtn?.addEventListener('click', sharePage);
    
    // Scroll
    scrollUpBtn?.addEventListener('click', scrollToTop);
    scrollDownBtn?.addEventListener('click', scrollToBottom);
    
    // Notes & Events
    addHolidayBtn?.addEventListener('click', addHoliday);
    addEventBtn?.addEventListener('click', addEvent);
    applySuggestionBtn?.addEventListener('click', () => { aiSuggestionBar.style.display = 'none'; });
    dismissSuggestionBtn?.addEventListener('click', () => { aiSuggestionBar.style.display = 'none'; });
    
    // Theme color options
    document.querySelectorAll('.color-option').forEach(opt => {
        opt.addEventListener('click', () => {
            const theme = opt.dataset.color;
            changeTheme(theme);
        });
    });
    
    // Auto-save on input
    teacherNotes?.addEventListener('input', () => { saveToLocalStorage(); });
    gradeSelect?.addEventListener('change', () => { saveToLocalStorage(); });
    weekSelect?.addEventListener('change', () => { saveToLocalStorage(); });
    startDate?.addEventListener('change', () => { saveToLocalStorage(); });
    dutiesPerDay?.addEventListener('change', () => { renderRoster(); });
    
    // Reactions - All 7 working
    document.querySelectorAll('.reaction').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const emoji = btn.getAttribute('data-emoji');
            if (emoji) {
                addReaction(emoji);
                btn.classList.add('active');
                setTimeout(() => btn.classList.remove('active'), 300);
            }
        });
    });
    
    // Social share buttons
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.dataset.platform;
            if (platform) shareTool(platform);
        });
    });
    
    // Scroll button visibility
    window.addEventListener('scroll', () => {
        if (scrollUpBtn) scrollUpBtn.classList.toggle('hidden', window.scrollY <= 200);
    });
}

// ============================================
// Initialize
// ============================================
async function init() {
    initTabs();
    initEventListeners();
    initTypewriter();
    
    // Load stats from API
    await loadStats();
    
    // Track usage on load
    await trackUsage();
    
    // Load data from localStorage
    loadFromLocalStorage();
    renderHistory();
    updateRosterCount();
    updateStudentCount();
    
    // Set default start date
    if (startDate && !startDate.value) {
        const today = new Date();
        const monday = new Date(today);
        const day = today.getDay();
        const diff = (day === 0 ? -6 : 1 - day);
        monday.setDate(today.getDate() + diff);
        startDate.value = monday.toISOString().split('T')[0];
    }
    
    // Load dark mode preference
    const savedDark = localStorage.getItem('darkMode');
    if (savedDark === 'true') {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.textContent = '🌙 On';
            darkModeToggle.classList.add('active');
        }
    }
    
    // Load theme preference
    const savedTheme = localStorage.getItem('themeColor');
    if (savedTheme && savedTheme !== 'pastel') {
        changeTheme(savedTheme);
    }
    
    showToast('🚀 Roster Generator ready!');
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
