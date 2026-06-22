// ============================================
// TIME TABLE GENERATOR - MAIN JAVASCRIPT
// Cloudflare Workers API Integration | Full Features
// Version: 3.0 - Advanced Professional Edition
// ============================================

// ============================================
// CONFIGURATION
// ============================================
const TOOL_SLUG = 'time-table-generator';
const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';
const API_KEY = 'magicrills-grok-api.uzairhameed01.workers.dev';

let currentUserId = localStorage.getItem('userId') || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
localStorage.setItem('userId', currentUserId);

// LocalStorage Fallback Keys
const LS_KEYS = {
    USAGE: `tt_usage_${TOOL_SLUG}`,
    REACTIONS: `tt_reactions_${TOOL_SLUG}`,
    SHARES: `tt_shares_${TOOL_SLUG}`,
    STATS: `tt_stats_${TOOL_SLUG}`
};

// Days and Periods
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = ['8:20-9:00', '9:00-9:40', '9:40-10:20', '10:20-11:00', '11:30-12:10', '12:10-12:50', '12:50-1:30'];

// Provincial Curriculum Data
const PROVINCE_DATA = {
    sindh: {
        name: 'Sindh',
        subjects: [
            { name: 'Sindhi/Urdu (MT)', periods: 6, teachers: ['Ms. Fatima', 'Mr. Ahmed'] },
            { name: 'English', periods: 6, teachers: ['Ms. Sarah', 'Mr. David'] },
            { name: 'Mathematics', periods: 6, teachers: ['Mr. Ali', 'Ms. Zainab'] },
            { name: 'Islamiyat & Nazra Quran', periods: 4, teachers: ['Mr. Hussain', 'Ms. Ayesha'] },
            { name: 'General Science', periods: 6, teachers: ['Mr. Khalid', 'Ms. Rabia'] },
            { name: 'Salees Urdu/Asan Sindhi (NMT)', periods: 3, teachers: ['Ms. Nadia', 'Mr. Bilal'] },
            { name: 'Social Studies', periods: 4, teachers: ['Mr. Tariq', 'Ms. Samina'] },
            { name: 'Computer Education', periods: 2, teachers: ['Mr. Zeeshan', 'Ms. Kiran'] },
            { name: 'Arabic/Drawing/Home Eco/Agriculture', periods: 2, teachers: ['Ms. Hina', 'Mr. Faisal'] },
            { name: 'Physical Education', periods: 1, teachers: ['Mr. Sports'] },
            { name: 'Library/Reading/Speaking', periods: 1, teachers: ['Ms. Librarian'] }
        ]
    },
    punjab: {
        name: 'Punjab',
        subjects: [
            { name: 'Urdu (MT)', periods: 6, teachers: ['Ms. Fatima', 'Mr. Ahmed'] },
            { name: 'English', periods: 6, teachers: ['Ms. Sarah', 'Mr. David'] },
            { name: 'Mathematics', periods: 6, teachers: ['Mr. Ali', 'Ms. Zainab'] },
            { name: 'Islamiyat', periods: 4, teachers: ['Mr. Hussain', 'Ms. Ayesha'] },
            { name: 'General Science', periods: 6, teachers: ['Mr. Khalid', 'Ms. Rabia'] },
            { name: 'Punjabi/Saraiki (NMT)', periods: 3, teachers: ['Ms. Nadia', 'Mr. Bilal'] },
            { name: 'Social Studies', periods: 4, teachers: ['Mr. Tariq', 'Ms. Samina'] },
            { name: 'Computer Science', periods: 2, teachers: ['Mr. Zeeshan', 'Ms. Kiran'] },
            { name: 'Arabic/Arts/Home Economics', periods: 2, teachers: ['Ms. Hina', 'Mr. Faisal'] },
            { name: 'Physical Education', periods: 1, teachers: ['Mr. Sports'] },
            { name: 'Library/Reading', periods: 1, teachers: ['Ms. Librarian'] }
        ]
    },
    khyber: {
        name: 'Khyber Pakhtunkhwa',
        subjects: [
            { name: 'Urdu/Pashto (MT)', periods: 6, teachers: ['Ms. Fatima', 'Mr. Ahmed'] },
            { name: 'English', periods: 6, teachers: ['Ms. Sarah', 'Mr. David'] },
            { name: 'Mathematics', periods: 6, teachers: ['Mr. Ali', 'Ms. Zainab'] },
            { name: 'Islamiyat & Mutala e Quran', periods: 4, teachers: ['Mr. Hussain', 'Ms. Ayesha'] },
            { name: 'General Science', periods: 6, teachers: ['Mr. Khalid', 'Ms. Rabia'] },
            { name: 'Pashto/Hindko (NMT)', periods: 3, teachers: ['Ms. Nadia', 'Mr. Bilal'] },
            { name: 'Social Studies', periods: 4, teachers: ['Mr. Tariq', 'Ms. Samina'] },
            { name: 'Computer Education', periods: 2, teachers: ['Mr. Zeeshan', 'Ms. Kiran'] },
            { name: 'Drawing/Home Economics/Arabic', periods: 2, teachers: ['Ms. Hina', 'Mr. Faisal'] },
            { name: 'Physical Education', periods: 1, teachers: ['Mr. Sports'] },
            { name: 'Library/Reading', periods: 1, teachers: ['Ms. Librarian'] }
        ]
    },
    balochistan: {
        name: 'Balochistan',
        subjects: [
            { name: 'Urdu/Balochi/Brahvi (MT)', periods: 6, teachers: ['Ms. Fatima', 'Mr. Ahmed'] },
            { name: 'English', periods: 6, teachers: ['Ms. Sarah', 'Mr. David'] },
            { name: 'Mathematics', periods: 6, teachers: ['Mr. Ali', 'Ms. Zainab'] },
            { name: 'Islamiyat', periods: 4, teachers: ['Mr. Hussain', 'Ms. Ayesha'] },
            { name: 'General Science', periods: 6, teachers: ['Mr. Khalid', 'Ms. Rabia'] },
            { name: 'Balochi/Brahvi (NMT)', periods: 3, teachers: ['Ms. Nadia', 'Mr. Bilal'] },
            { name: 'Social Studies', periods: 4, teachers: ['Mr. Tariq', 'Ms. Samina'] },
            { name: 'Computer Education', periods: 2, teachers: ['Mr. Zeeshan', 'Ms. Kiran'] },
            { name: 'Arabic/Drawing/Agriculture', periods: 2, teachers: ['Ms. Hina', 'Mr. Faisal'] },
            { name: 'Physical Education', periods: 1, teachers: ['Mr. Sports'] },
            { name: 'Library/Reading', periods: 1, teachers: ['Ms. Librarian'] }
        ]
    }
};

// Global State
let currentTimetableData = null;
let currentTeachers = [];
let currentSubjectAssignments = {};
let isApiAvailable = true;
let statsData = {
    usage: 0,
    views: 0,
    shares: 0,
    followers: 0
};

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
    provinceSelect: document.getElementById('provinceSelect'),
    classSelect: document.getElementById('classSelect'),
    mediumSelect: document.getElementById('mediumSelect'),
    teacherAssignment: document.getElementById('teacherAssignment'),
    generateBtn: document.getElementById('generateBtn'),
    resetBtn: document.getElementById('resetBtn'),
    darkModeToggle: document.getElementById('darkModeToggle'),
    scrollUpBtn: document.getElementById('scrollUpBtn'),
    scrollDownBtn: document.getElementById('scrollDownBtn'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    toastNotification: document.getElementById('toastNotification'),
    toastMessage: document.getElementById('toastMessage'),
    premiumModal: document.getElementById('premiumModal'),
    masterTimetable: document.getElementById('masterTimetable'),
    classwiseTimetable: document.getElementById('classwiseTimetable'),
    teacherwiseTimetable: document.getElementById('teacherwiseTimetable'),
    subjectwiseTimetable: document.getElementById('subjectwiseTimetable'),
    freetimeTimetable: document.getElementById('freetimeTimetable'),
    classwiseSelect: document.getElementById('classwiseSelect'),
    teacherwiseSelect: document.getElementById('teacherwiseSelect'),
    subjectwiseSelect: document.getElementById('subjectwiseSelect'),
    toolUsageCount: document.getElementById('toolUsageCount'),
    globalUsageCount: document.getElementById('globalUsageCount'),
    globalReactionCount: document.getElementById('globalReactionCount'),
    globalShareCount: document.getElementById('globalShareCount'),
    typewriterText: document.getElementById('typewriterText')
};

// ============================================
// TYPEWRITER ANIMATION
// ============================================
const typewriterPhrases = [
    'Generate Smart Timetables for Grades VI-VIII',
    'Based on Official Curricula of All Provinces',
    'Sindh • Punjab • Khyber Pakhtunkhwa • Balochistan',
    'AI-Powered Teacher Assignment System',
    'Smart Scheduling with Zero Conflicts',
    'Real-time Stats & Analytics Dashboard'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typewriterTimeout;

function typewriterEffect() {
    const currentPhrase = typewriterPhrases[phraseIndex];
    const typeSpeed = isDeleting ? 30 : 60;
    
    if (!isDeleting && charIndex <= currentPhrase.length) {
        elements.typewriterText.textContent = currentPhrase.substring(0, charIndex);
        charIndex++;
        typewriterTimeout = setTimeout(typewriterEffect, typeSpeed);
    } else if (!isDeleting && charIndex > currentPhrase.length) {
        isDeleting = true;
        typewriterTimeout = setTimeout(typewriterEffect, 2000);
    } else if (isDeleting && charIndex >= 0) {
        elements.typewriterText.textContent = currentPhrase.substring(0, charIndex);
        charIndex--;
        typewriterTimeout = setTimeout(typewriterEffect, typeSpeed);
    } else if (isDeleting && charIndex < 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % typewriterPhrases.length;
        charIndex = 0;
        typewriterTimeout = setTimeout(typewriterEffect, 500);
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function showToast(message, duration = 3000) {
    elements.toastMessage.textContent = message;
    elements.toastNotification.classList.add('show');
    clearTimeout(elements.toastTimeout);
    elements.toastTimeout = setTimeout(() => {
        elements.toastNotification.classList.remove('show');
    }, duration);
}

function showLoading() {
    elements.loadingSpinner.classList.add('active');
}

function hideLoading() {
    elements.loadingSpinner.classList.remove('active');
}

function showPremiumModal() {
    elements.premiumModal.classList.add('active');
}

function hidePremiumModal() {
    elements.premiumModal.classList.remove('active');
}

// Dark Mode Toggle (Always Dark)
function initDarkMode() {
    document.body.classList.add('dark-mode');
    elements.darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    localStorage.setItem('darkMode', 'enabled');
}

function toggleDarkMode() {
    // Always keep dark mode
    showToast('✨ Dark Mode is always active for premium experience');
}

// Scroll Functions
function scrollUp() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollDown() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// ============================================
// CLOUDFLARE WORKERS API CALLS
// ============================================
async function callAPI(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            }
        };
        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const result = await response.json();
        isApiAvailable = true;
        return result;
    } catch (error) {
        console.warn('API Call Failed - Using LocalStorage Fallback:', error.message);
        isApiAvailable = false;
        return { success: false, error: error.message, fallback: true };
    }
}

// ============================================
// USAGE COUNTER
// ============================================
async function incrementUsage() {
    try {
        const result = await callAPI('/api/usage', 'POST', {
            tool_slug: TOOL_SLUG,
            user_id: currentUserId
        });
        
        if (result.success) {
            const count = result.total_usage || 0;
            elements.toolUsageCount.textContent = count;
            localStorage.setItem(LS_KEYS.USAGE, count);
            await fetchStats();
            return result;
        } else {
            // Fallback: LocalStorage increment
            let localCount = parseInt(localStorage.getItem(LS_KEYS.USAGE)) || 0;
            localCount++;
            localStorage.setItem(LS_KEYS.USAGE, localCount);
            elements.toolUsageCount.textContent = localCount;
            return { success: true, total_usage: localCount, fallback: true };
        }
    } catch (error) {
        console.error('Usage increment error:', error);
        // Fallback
        let localCount = parseInt(localStorage.getItem(LS_KEYS.USAGE)) || 0;
        localCount++;
        localStorage.setItem(LS_KEYS.USAGE, localCount);
        elements.toolUsageCount.textContent = localCount;
        return { success: true, total_usage: localCount, fallback: true };
    }
}

async function getUsageCount() {
    try {
        const result = await callAPI(`/api/usage?tool_slug=${TOOL_SLUG}`, 'GET');
        if (result.success) {
            const count = result.count || result.total_usage || 0;
            elements.toolUsageCount.textContent = count;
            localStorage.setItem(LS_KEYS.USAGE, count);
        } else {
            // Fallback
            const localCount = parseInt(localStorage.getItem(LS_KEYS.USAGE)) || 0;
            elements.toolUsageCount.textContent = localCount;
        }
    } catch (error) {
        console.error('Get usage error:', error);
        const localCount = parseInt(localStorage.getItem(LS_KEYS.USAGE)) || 0;
        elements.toolUsageCount.textContent = localCount;
    }
}

// ============================================
// REACTIONS (7 Types: 👍 ❤️ 😮 😢 😂 🎉)
// ============================================
const REACTION_EMOJIS = {
    like: '👍',
    love: '❤️',
    wow: '😮',
    sad: '😢',
    laugh: '😂',
    celebrate: '🎉'
};

const REACTION_KEYS = ['like', 'love', 'wow', 'sad', 'laugh', 'celebrate'];

async function addReaction(reactionType) {
    if (!REACTION_KEYS.includes(reactionType)) {
        console.warn('Invalid reaction type:', reactionType);
        return;
    }

    try {
        const result = await callAPI('/api/reactions', 'POST', {
            tool_slug: TOOL_SLUG,
            emoji: REACTION_EMOJIS[reactionType],
            reaction_type: reactionType,
            user_id: currentUserId
        });
        
        if (result.success) {
            showToast(`💫 Thank you for your ${reactionType} reaction!`);
            await fetchReactions();
            await fetchStats();
        } else if (result.already_reacted) {
            showToast('✨ You already reacted with this emoji!');
        } else {
            // Fallback: Update local
            updateLocalReaction(reactionType);
        }
        return result;
    } catch (error) {
        console.error('Add reaction error:', error);
        updateLocalReaction(reactionType);
    }
}

function updateLocalReaction(reactionType) {
    const reactions = JSON.parse(localStorage.getItem(LS_KEYS.REACTIONS) || '{}');
    reactions[reactionType] = (reactions[reactionType] || 0) + 1;
    localStorage.setItem(LS_KEYS.REACTIONS, JSON.stringify(reactions));
    updateReactionUI(reactions);
    showToast('💫 Reaction saved locally!');
}

async function fetchReactions() {
    try {
        const result = await callAPI(`/api/reactions?tool_slug=${TOOL_SLUG}`, 'GET');
        if (result.success && result.reactions) {
            localStorage.setItem(LS_KEYS.REACTIONS, JSON.stringify(result.reactions));
            updateReactionUI(result.reactions);
            
            const total = Object.values(result.reactions).reduce((a, b) => a + b, 0);
            if (elements.globalReactionCount) elements.globalReactionCount.textContent = total;
        } else {
            // Fallback
            const reactions = JSON.parse(localStorage.getItem(LS_KEYS.REACTIONS) || '{}');
            updateReactionUI(reactions);
        }
    } catch (error) {
        console.error('Fetch reactions error:', error);
        const reactions = JSON.parse(localStorage.getItem(LS_KEYS.REACTIONS) || '{}');
        updateReactionUI(reactions);
    }
}

function updateReactionUI(reactions) {
    REACTION_KEYS.forEach(key => {
        const countEl = document.getElementById(`${key}Count`);
        if (countEl) {
            countEl.textContent = reactions[key] || 0;
        }
    });
}

// ============================================
// SHARES
// ============================================
async function addShare(platform) {
    try {
        const result = await callAPI('/api/shares', 'POST', {
            tool_slug: TOOL_SLUG,
            platform: platform,
            user_id: currentUserId
        });
        
        if (result.success) {
            showToast(`📤 Shared on ${platform}!`);
            await fetchShares();
            await fetchStats();
        } else {
            // Fallback
            updateLocalShare(platform);
        }
        return result;
    } catch (error) {
        console.error('Add share error:', error);
        updateLocalShare(platform);
    }
}

function updateLocalShare(platform) {
    const shares = JSON.parse(localStorage.getItem(LS_KEYS.SHARES) || '{"total": 0}');
    shares.total = (shares.total || 0) + 1;
    if (shares[platform]) {
        shares[platform] = (shares[platform] || 0) + 1;
    } else {
        shares[platform] = 1;
    }
    localStorage.setItem(LS_KEYS.SHARES, JSON.stringify(shares));
    if (elements.globalShareCount) elements.globalShareCount.textContent = shares.total;
    showToast(`📤 Shared on ${platform} (saved locally)`);
}

async function fetchShares() {
    try {
        const result = await callAPI(`/api/shares?tool_slug=${TOOL_SLUG}`, 'GET');
        if (result.success) {
            const total = result.shares || 0;
            if (elements.globalShareCount) elements.globalShareCount.textContent = total;
            localStorage.setItem(LS_KEYS.SHARES, JSON.stringify({ total }));
        } else {
            // Fallback
            const shares = JSON.parse(localStorage.getItem(LS_KEYS.SHARES) || '{"total": 0}');
            if (elements.globalShareCount) elements.globalShareCount.textContent = shares.total || 0;
        }
    } catch (error) {
        console.error('Fetch shares error:', error);
        const shares = JSON.parse(localStorage.getItem(LS_KEYS.SHARES) || '{"total": 0}');
        if (elements.globalShareCount) elements.globalShareCount.textContent = shares.total || 0;
    }
}

// ============================================
// STATS (Usage, Views, Shares, Followers)
// ============================================
async function fetchStats() {
    try {
        const result = await callAPI(`/api/stats?tool_slug=${TOOL_SLUG}`, 'GET');
        if (result.success) {
            statsData = {
                usage: result.usage || 0,
                views: result.views || 0,
                shares: result.shares || 0,
                followers: result.followers || 0
            };
            localStorage.setItem(LS_KEYS.STATS, JSON.stringify(statsData));
            updateStatsUI();
        } else {
            // Fallback
            const saved = JSON.parse(localStorage.getItem(LS_KEYS.STATS) || '{"usage":0,"views":0,"shares":0,"followers":0}');
            statsData = saved;
            updateStatsUI();
        }
    } catch (error) {
        console.error('Fetch stats error:', error);
        const saved = JSON.parse(localStorage.getItem(LS_KEYS.STATS) || '{"usage":0,"views":0,"shares":0,"followers":0}');
        statsData = saved;
        updateStatsUI();
    }
}

function updateStatsUI() {
    if (elements.globalUsageCount) elements.globalUsageCount.textContent = statsData.usage || 0;
    if (elements.globalShareCount) elements.globalShareCount.textContent = statsData.shares || 0;
    if (elements.toolUsageCount) elements.toolUsageCount.textContent = statsData.usage || 0;
    
    // Update followers and views if elements exist
    const viewsEl = document.getElementById('globalViewsCount');
    const followersEl = document.getElementById('globalFollowersCount');
    if (viewsEl) viewsEl.textContent = statsData.views || 0;
    if (followersEl) followersEl.textContent = statsData.followers || 0;
}

// ============================================
// HEALTH CHECK
// ============================================
async function healthCheck() {
    try {
        const result = await callAPI('/api/health', 'GET');
        console.log('API Health:', result);
        isApiAvailable = result.success;
        return isApiAvailable;
    } catch (error) {
        console.warn('Health check failed - using fallback mode:', error.message);
        isApiAvailable = false;
        return false;
    }
}

// ============================================
// TIMETABLE GENERATION LOGIC
// ============================================
function getRandomTeacher(teachers) {
    if (!teachers || teachers.length === 0) return 'TBA';
    return teachers[Math.floor(Math.random() * teachers.length)];
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateTimetable() {
    const province = elements.provinceSelect.value;
    const className = elements.classSelect.value;
    const medium = elements.mediumSelect.value;
    const assignmentMode = elements.teacherAssignment.value;
    
    const provinceData = PROVINCE_DATA[province];
    if (!provinceData) return;
    
    let subjects = [...provinceData.subjects];
    subjects = shuffleArray([...subjects]);
    
    let subjectPool = [];
    subjects.forEach(subj => {
        for (let i = 0; i < subj.periods; i++) {
            subjectPool.push({
                name: subj.name,
                teacher: getRandomTeacher(subj.teachers)
            });
        }
    });
    
    subjectPool = shuffleArray(subjectPool);
    
    const timetable = [];
    const teacherSchedule = {};
    const subjectSchedule = {};
    
    DAYS.forEach(day => {
        const daySchedule = [];
        for (let periodIdx = 0; periodIdx < PERIODS.length; periodIdx++) {
            if (day === 'Wednesday' && periodIdx === 3) {
                daySchedule.push({
                    subject: 'BREAK',
                    teacher: '-',
                    isBreak: true,
                    isFree: false
                });
                continue;
            }
            
            if (subjectPool.length === 0) {
                daySchedule.push({
                    subject: 'Study Hall',
                    teacher: 'TBA',
                    isBreak: false,
                    isFree: false
                });
                continue;
            }
            
            const randomIndex = Math.floor(Math.random() * subjectPool.length);
            const slot = subjectPool[randomIndex];
            
            daySchedule.push({
                subject: slot.name,
                teacher: slot.teacher,
                period: PERIODS[periodIdx],
                day: day,
                isBreak: false,
                isFree: false
            });
            
            if (!teacherSchedule[slot.teacher]) teacherSchedule[slot.teacher] = [];
            teacherSchedule[slot.teacher].push({
                day: day,
                period: PERIODS[periodIdx],
                subject: slot.name,
                class: className
            });
            
            if (!subjectSchedule[slot.name]) subjectSchedule[slot.name] = [];
            subjectSchedule[slot.name].push({
                day: day,
                period: PERIODS[periodIdx],
                teacher: slot.teacher,
                class: className
            });
            
            subjectPool.splice(randomIndex, 1);
        }
        timetable.push({ day, periods: daySchedule });
    });
    
    currentTimetableData = {
        province,
        className,
        medium,
        timetable,
        teacherSchedule,
        subjectSchedule,
        allTeachers: Object.keys(teacherSchedule),
        generatedAt: new Date().toISOString()
    };
    
    identifyFreePeriods();
    return currentTimetableData;
}

function identifyFreePeriods() {
    if (!currentTimetableData) return;
    
    const teacherFreePeriods = {};
    const allTeachers = currentTimetableData.allTeachers;
    
    allTeachers.forEach(teacher => {
        const busySlots = currentTimetableData.teacherSchedule[teacher] || [];
        const busySet = new Set(busySlots.map(s => `${s.day}_${s.period}`));
        
        const freeSlots = [];
        DAYS.forEach(day => {
            PERIODS.forEach(period => {
                if (!busySet.has(`${day}_${period}`)) {
                    freeSlots.push({ day, period });
                }
            });
        });
        teacherFreePeriods[teacher] = freeSlots;
    });
    
    currentTimetableData.teacherFreePeriods = teacherFreePeriods;
}

// ============================================
// RENDER FUNCTIONS
// ============================================
function renderMasterTimetable() {
    if (!currentTimetableData) return;
    
    let html = '<table class="timetable-table">';
    html += '<caption>📅 Master Timetable - ' + currentTimetableData.className + ' (' + PROVINCE_DATA[currentTimetableData.province].name + ')</caption>';
    html += '<thead><tr><th>Day / Period</th>';
    PERIODS.forEach(p => html += `<th>${p}</th>`);
    html += '</tr></thead><tbody>';
    
    currentTimetableData.timetable.forEach(dayData => {
        html += `<tr><th>${dayData.day}</th>`;
        dayData.periods.forEach(period => {
            if (period.isBreak) {
                html += `<td class="break-period">☕ BREAK</td>`;
            } else {
                html += `<td>${period.subject}<br><small>${period.teacher}</small></td>`;
            }
        });
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    elements.masterTimetable.innerHTML = html;
}

function renderClasswiseTimetable() {
    if (!currentTimetableData) return;
    
    const selectedClass = elements.classwiseSelect.value;
    
    let html = '<table class="timetable-table">';
    html += `<caption>📚 Class ${selectedClass} Timetable</caption>`;
    html += '<thead><tr><th>Day / Period</th>';
    PERIODS.forEach(p => html += `<th>${p}</th>`);
    html += '</tr></thead><tbody>';
    
    currentTimetableData.timetable.forEach(dayData => {
        html += `<tr><th>${dayData.day}</th>`;
        dayData.periods.forEach(period => {
            if (period.isBreak) {
                html += `<td class="break-period">☕ BREAK</td>`;
            } else {
                html += `<td>${period.subject}<br><small>${period.teacher}</small></td>`;
            }
        });
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    elements.classwiseTimetable.innerHTML = html;
}

function renderTeacherwiseTimetable() {
    if (!currentTimetableData) return;
    
    const selectedTeacher = elements.teacherwiseSelect.value;
    if (!selectedTeacher) return;
    
    const schedule = currentTimetableData.teacherSchedule[selectedTeacher] || [];
    const freePeriods = currentTimetableData.teacherFreePeriods?.[selectedTeacher] || [];
    
    let html = `<div class="teacher-card"><h4><i class="fas fa-chalkboard-user"></i> ${selectedTeacher}</h4>`;
    html += '<table class="timetable-table">';
    html += '<thead><tr><th>Day</th><th>Period</th><th>Subject</th><th>Class</th></tr></thead><tbody>';
    
    schedule.forEach(slot => {
        html += `<tr><td>${slot.day}</td><td>${slot.period}</td><td>${slot.subject}</td><td>${slot.class}</td></tr>`;
    });
    
    html += '</tbody></table>';
    
    html += '<h5 style="margin-top: 20px;"><i class="fas fa-coffee"></i> Free Periods</h5>';
    html += '<table class="timetable-table">';
    html += '<thead><tr><th>Day</th><th>Period</th></tr></thead><tbody>';
    
    if (freePeriods.length === 0) {
        html += '<tr><td colspan="2">🎯 No free periods (fully scheduled)</td></tr>';
    } else {
        freePeriods.forEach(fp => {
            html += `<tr><td>${fp.day}</td><td>${fp.period}</td></tr>`;
        });
    }
    
    html += '</tbody></table></div>';
    elements.teacherwiseTimetable.innerHTML = html;
}

function renderSubjectwiseTimetable() {
    if (!currentTimetableData) return;
    
    const selectedSubject = elements.subjectwiseSelect.value;
    if (!selectedSubject) return;
    
    const schedule = currentTimetableData.subjectSchedule[selectedSubject] || [];
    
    let html = `<div class="teacher-card"><h4><i class="fas fa-book"></i> ${selectedSubject}</h4>`;
    html += '<table class="timetable-table">';
    html += '<thead><tr><th>Day</th><th>Period</th><th>Teacher</th><th>Class</th></tr></thead><tbody>';
    
    schedule.forEach(slot => {
        html += `<tr><td>${slot.day}</td><td>${slot.period}</td><td>${slot.teacher}</td><td>${slot.class}</td></tr>`;
    });
    
    html += '</tbody></table></div>';
    elements.subjectwiseTimetable.innerHTML = html;
}

function renderFreetimeTimetable() {
    if (!currentTimetableData) return;
    
    const freePeriods = currentTimetableData.teacherFreePeriods || {};
    const teachers = Object.keys(freePeriods);
    
    let html = '<table class="timetable-table">';
    html += '<caption>🕐 Teacher Free Periods Overview</caption>';
    html += '<thead><tr><th>Teacher</th><th>Free Periods Count</th><th>Free Slots</th></tr></thead><tbody>';
    
    teachers.forEach(teacher => {
        const free = freePeriods[teacher];
        html += `<tr>
            <td>${teacher}</td>
            <td><span class="free-badge">${free.length}</span></td>
            <td>${free.map(f => `${f.day} ${f.period}`).join(', ') || 'None'}</td>
        </tr>`;
    });
    
    html += '</tbody></table>';
    elements.freetimeTimetable.innerHTML = html;
}

function updateTeacherSelect() {
    if (!currentTimetableData) return;
    
    let options = '<option value="">👨‍🏫 Select Teacher</option>';
    currentTimetableData.allTeachers.forEach(teacher => {
        options += `<option value="${teacher}">${teacher}</option>`;
    });
    elements.teacherwiseSelect.innerHTML = options;
}

function updateSubjectSelect() {
    if (!currentTimetableData) return;
    
    const provinceData = PROVINCE_DATA[currentTimetableData.province];
    let options = '<option value="">📖 Select Subject</option>';
    provinceData.subjects.forEach(subj => {
        options += `<option value="${subj.name}">${subj.name}</option>`;
    });
    elements.subjectwiseSelect.innerHTML = options;
}

// ============================================
// EXPORT FUNCTIONS
// ============================================
function exportToPDF() {
    const printContent = elements.masterTimetable.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Time Table - ${currentTimetableData?.className || 'VI-VIII'}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; direction: ltr; background: white; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
                th { background: #0ea5e9; color: white; }
                .break-period { background: #fef3c7; }
                caption { font-size: 1.2em; font-weight: bold; margin-bottom: 10px; }
            </style>
        </head>
        <body>${printContent}</body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
    addShare('pdf_export');
}

function exportToDOC() {
    const content = elements.masterTimetable.innerHTML;
    const style = `
        <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid black; padding: 8px; text-align: center; }
            th { background: #0ea5e9; color: white; }
            .break-period { background: #fef3c7; }
        </style>
    `;
    const fullHtml = `<html><head><meta charset="UTF-8">${style}</head><body>${content}</body></html>`;
    const blob = new Blob([fullHtml], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `timetable_${currentTimetableData?.className || 'VI-VIII'}.doc`;
    link.click();
    URL.revokeObjectURL(link.href);
    addShare('doc_export');
    showToast('📄 DOC file downloaded!');
}

function exportToTXT() {
    let textContent = '📅 TIME TABLE GENERATOR\n';
    textContent += '='.repeat(60) + '\n\n';
    
    if (currentTimetableData) {
        textContent += `Class: ${currentTimetableData.className}\n`;
        textContent += `Province: ${PROVINCE_DATA[currentTimetableData.province]?.name}\n`;
        textContent += `Generated: ${currentTimetableData.generatedAt}\n\n`;
        
        currentTimetableData.timetable.forEach(dayData => {
            textContent += `\n${dayData.day}\n`;
            textContent += '-'.repeat(50) + '\n';
            dayData.periods.forEach((period, idx) => {
                if (period.isBreak) {
                    textContent += `${PERIODS[idx]}: ☕ BREAK\n`;
                } else {
                    textContent += `${PERIODS[idx]}: ${period.subject} (${period.teacher})\n`;
                }
            });
        });
    }
    
    const blob = new Blob([textContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `timetable_${currentTimetableData?.className || 'VI-VIII'}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('📄 TXT file downloaded!');
}

// ============================================
// SHARE HANDLERS
// ============================================
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
    addShare('facebook');
}

function shareOnTwitter() {
    const text = encodeURIComponent('📅 Check out this amazing Time Table Generator for Grades VI-VIII! 🎓');
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400');
    addShare('twitter');
}

function shareOnWhatsApp() {
    const text = encodeURIComponent(`📅 Time Table Generator - Check it out: ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    addShare('whatsapp');
}

function shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=500');
    addShare('linkedin');
}

function shareByEmail() {
    const subject = encodeURIComponent('📅 Time Table Generator for School');
    const body = encodeURIComponent(`Check out this amazing tool: ${window.location.href}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    addShare('email');
}

function copyPageURL() {
    navigator.clipboard.writeText(window.location.href);
    showToast('📋 URL copied to clipboard!');
    addShare('copy_url');
}

// ============================================
// EVENT LISTENERS
// ============================================
function initEventListeners() {
    elements.generateBtn.addEventListener('click', async () => {
        showLoading();
        await new Promise(resolve => setTimeout(resolve, 500));
        generateTimetable();
        renderMasterTimetable();
        renderClasswiseTimetable();
        updateTeacherSelect();
        updateSubjectSelect();
        if (elements.teacherwiseSelect.value) renderTeacherwiseTimetable();
        if (elements.subjectwiseSelect.value) renderSubjectwiseTimetable();
        renderFreetimeTimetable();
        hideLoading();
        showToast('✨ Timetable generated successfully!');
        await incrementUsage();
    });
    
    elements.resetBtn.addEventListener('click', () => {
        elements.provinceSelect.value = 'sindh';
        elements.classSelect.value = 'VI';
        elements.mediumSelect.value = 'urdu';
        elements.teacherAssignment.value = 'auto';
        showToast('🔄 Settings reset to default');
    });
    
    elements.classwiseSelect.addEventListener('change', renderClasswiseTimetable);
    elements.teacherwiseSelect.addEventListener('change', renderTeacherwiseTimetable);
    elements.subjectwiseSelect.addEventListener('change', renderSubjectwiseTimetable);
    
    // Reactions - 7 types only
    document.querySelectorAll('.reaction').forEach(el => {
        el.addEventListener('click', () => {
            const reaction = el.dataset.reaction;
            if (reaction && REACTION_KEYS.includes(reaction)) {
                addReaction(reaction);
                // Visual feedback
                el.classList.add('active');
                setTimeout(() => el.classList.remove('active'), 500);
            }
        });
    });
    
    // Share buttons
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.dataset.platform;
            switch(platform) {
                case 'facebook': shareOnFacebook(); break;
                case 'twitter': shareOnTwitter(); break;
                case 'whatsapp': shareOnWhatsApp(); break;
                case 'linkedin': shareOnLinkedIn(); break;
                case 'email': shareByEmail(); break;
                case 'copy': copyPageURL(); break;
                default: addShare(platform);
            }
        });
    });
    
    // Export buttons
    document.querySelectorAll('.export-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.export;
            switch(type) {
                case 'pdf': exportToPDF(); break;
                case 'doc': exportToDOC(); break;
                case 'txt': exportToTXT(); break;
            }
        });
    });
    
    // Dark mode - always dark
    elements.darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // Scroll buttons
    elements.scrollUpBtn.addEventListener('click', scrollUp);
    elements.scrollDownBtn.addEventListener('click', scrollDown);
    
    // Premium modal
    document.querySelectorAll('.premium-close-btn, .premium-modal-close').forEach(btn => {
        btn.addEventListener('click', hidePremiumModal);
    });
    
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const tabId = btn.dataset.tab;
            if (tabId === 'master') document.getElementById('masterTab').classList.add('active');
            else if (tabId === 'classwise') document.getElementById('classwiseTab').classList.add('active');
            else if (tabId === 'teacherwise') document.getElementById('teacherwiseTab').classList.add('active');
            else if (tabId === 'subjectwise') document.getElementById('subjectwiseTab').classList.add('active');
            else if (tabId === 'freetime') document.getElementById('freetimeTab').classList.add('active');
        });
    });
}

// ============================================
// INITIALIZATION
// ============================================
async function init() {
    console.log('🚀 Initializing Time Table Generator v3.0...');
    
    // Dark mode always on
    initDarkMode();
    initEventListeners();
    
    // Start typewriter animation
    typewriterEffect();
    
    // Check API health
    await healthCheck();
    
    // Load all data
    await getUsageCount();
    await fetchReactions();
    await fetchShares();
    await fetchStats();
    
    // Generate initial timetable
    generateTimetable();
    renderMasterTimetable();
    renderClasswiseTimetable();
    updateTeacherSelect();
    updateSubjectSelect();
    renderFreetimeTimetable();
    
    // Auto-increment usage on load
    await incrementUsage();
    
    console.log('✅ Initialization complete!');
    console.log(`📊 API Status: ${isApiAvailable ? 'Connected' : 'Offline (Fallback Mode)'}`);
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
