/**
 * Advanced Auto Timetable Generator
 * Sindh Scheme of Studies 2023-24 | ECCE to Grade XII
 * Fully Integrated with TiDB + Vercel + Grok API
 * Total Features: 76
 */

// ============================================
// CONFIGURATION
// ============================================
const TOOL_SLUG = 'advanced-auto-time-table-generator';
const API_BASE = '/api';
const USER_ID = localStorage.getItem('user_id') || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

if (!localStorage.getItem('user_id')) {
    localStorage.setItem('user_id', USER_ID);
}

// ============================================
// SINDH SCHEME OF STUDIES 2023-24 DATA
// ============================================
const SINDH_CURRICULUM = {
    ecc: {
        name: "ECCE (Age 3-5)",
        periodsPerWeek: 0,
        subjects: ["Emotional & Social Dev", "Language & Literacy", "Basic Math Concepts", "World Around Us", "Health & Hygiene", "Creative Arts"],
        timetable: {
            Monday: ["Social Dev", "Language", "Math Concepts", "World Around Us", "Health", "Creative Arts"],
            Tuesday: ["Language", "Math Concepts", "Social Dev", "Creative Arts", "Health", "World Around Us"],
            Wednesday: ["Math Concepts", "Language", "Creative Arts", "Social Dev", "World Around Us", "Health"],
            Thursday: ["Health", "Creative Arts", "Language", "Math Concepts", "Social Dev", "World Around Us"],
            Friday: ["World Around Us", "Health", "Creative Arts", "Language", "Math Concepts", "Social Dev"]
        }
    },
    i: {
        name: "Grade I",
        periodsPerWeek: 41,
        subjects: ["Sindhi/Urdu (10)", "English (8)", "Math (7)", "General Knowledge (8)", "Library (2)", "PE (2)", "Arts (2)", "ICT (2)"],
        timetable: {
            Monday: ["Math", "Sindhi/Urdu", "English", "Gen Knowledge", "PE", "ICT", "Library"],
            Tuesday: ["Math", "Sindhi/Urdu", "English", "Gen Knowledge", "Arts", "ICT", "Library"],
            Wednesday: ["Math", "Sindhi/Urdu", "English Reading", "Gen Knowledge", "PE", "Sindhi/Urdu", "Arts"],
            Thursday: ["Math", "Sindhi/Urdu", "English Reading", "Gen Knowledge", "PE", "English", "Library"],
            Friday: ["Math", "English Writing", "Gen Knowledge", "Sindhi/Urdu", "Arts", "Library", "PE"]
        }
    },
    ii: {
        name: "Grade II",
        periodsPerWeek: 41,
        subjects: ["Sindhi/Urdu (10)", "English (8)", "Math (7)", "General Knowledge (8)", "Library (2)", "PE (2)", "Arts (2)", "ICT (2)"],
        timetable: {
            Monday: ["Math", "Sindhi/Urdu", "English Speaking", "Gen Knowledge", "PE", "ICT", "Library"],
            Tuesday: ["Math", "Sindhi/Urdu", "English Reading", "Gen Knowledge", "Arts", "ICT", "Library"],
            Wednesday: ["Math", "Sindhi/Urdu", "English Writing", "Gen Knowledge", "PE", "Sindhi/Urdu", "Arts"],
            Thursday: ["Math", "Sindhi/Urdu", "English Listening", "Gen Knowledge", "PE", "English", "Library"],
            Friday: ["Math", "English Reading", "Gen Knowledge", "Sindhi/Urdu", "Arts", "Library", "ICT"]
        }
    },
    iii: {
        name: "Grade III",
        periodsPerWeek: 41,
        subjects: ["Sindhi/Urdu (7)", "Asan Sindhi/Urdu (3)", "English (6)", "Math (8)", "Gen Knowledge (6)", "Islamiyat (5)", "Library (2)", "PE (2)", "Arts (1)", "ICT (1)"],
        timetable: {
            Monday: ["Math", "Sindhi/Urdu", "English", "Islamiyat", "Gen Knowledge", "PE", "Library"],
            Tuesday: ["Math", "Sindhi/Urdu", "English", "Islamiyat", "Gen Knowledge", "Arts", "Asan Sindhi"],
            Wednesday: ["Math", "Sindhi/Urdu", "English Reading", "Islamiyat", "Gen Knowledge", "ICT", "Asan Sindhi"],
            Thursday: ["Math", "Sindhi/Urdu", "English Reading", "Islamiyat", "Gen Knowledge", "Library", "Asan Sindhi"],
            Friday: ["Math", "English Writing", "English Writing", "Islamiyat", "Gen Knowledge", "Gen Knowledge", "Asan Sindhi"]
        }
    },
    iv: {
        name: "Grade IV",
        periodsPerWeek: 41,
        subjects: ["Sindhi/Urdu (6)", "Asan Sindhi/Urdu (3)", "English (6)", "Math (6)", "Science (6)", "Islamiyat (4)", "Social Studies (5)", "Library (1)", "PE (2)", "Arts (1)", "ICT (1)"],
        timetable: {
            Monday: ["Math", "English Reading", "Islamiyat", "Sindhi/Urdu", "PE", "Science", "Social Studies"],
            Tuesday: ["Math", "English Reading", "Islamiyat", "Sindhi/Urdu", "Asan Sindhi", "Science", "Social Studies"],
            Wednesday: ["Math", "English Writing", "Islamiyat", "Sindhi/Urdu Reading", "Arts", "Science", "Social Studies"],
            Thursday: ["Math", "English Writing", "Islamiyat", "Sindhi/Urdu Reading", "ICT", "Science", "Social Studies"],
            Friday: ["Math", "English Listening", "Arts", "Sindhi/Urdu Writing", "Library", "Science", "Social Studies"]
        }
    },
    v: {
        name: "Grade V",
        periodsPerWeek: 41,
        subjects: ["Sindhi/Urdu (6)", "Asan Sindhi/Urdu (3)", "English (6)", "Math (6)", "Science (6)", "Islamiyat (4)", "Social Studies (5)", "Library (1)", "PE (2)", "Arts (1)", "ICT (1)"],
        timetable: {
            Monday: ["Math", "English Speaking", "Islamiyat", "Sindhi/Urdu", "PE", "Science", "Social Studies"],
            Tuesday: ["Math", "English Reading", "Islamiyat", "Sindhi/Urdu", "Asan Sindhi", "Science", "Social Studies"],
            Wednesday: ["Math", "English Writing", "Islamiyat", "Sindhi/Urdu", "Arts", "Science Lab", "Social Studies"],
            Thursday: ["Math", "English Grammar", "Islamiyat", "Sindhi/Urdu", "ICT", "Science", "Social Studies"],
            Friday: ["Math", "English Listening", "Arts", "Sindhi/Urdu Writing", "Library", "Science", "Social Studies"]
        }
    },
    vi: {
        name: "Grade VI",
        periodsPerWeek: 41,
        subjects: ["Sindhi/Urdu MT (6)", "English (6)", "Math (6)", "Islamiyat (4)", "General Science (6)", "Asan Sindhi (3)", "Social Studies (4)", "Computer (2)", "Elective (2)", "PE (1)", "Library (1)"],
        timetable: {
            Monday: ["Math", "Sindhi/Urdu", "General Science", "English Reading", "Islamiyat", "Social Studies", "Computer"],
            Tuesday: ["Math", "Sindhi/Urdu", "General Science", "English Reading", "Asan Sindhi", "Social Studies", "Computer"],
            Wednesday: ["Math", "Sindhi/Urdu Reading", "General Science", "English Writing", "Islamiyat", "Social Studies", "Elective"],
            Thursday: ["Math", "Sindhi/Urdu Reading", "General Science", "English Writing", "Asan Sindhi", "Social Studies", "Elective"],
            Friday: ["Math", "Sindhi/Urdu Writing", "General Science", "English Speaking", "PE", "Library", "Asan Sindhi"]
        }
    },
    vii: {
        name: "Grade VII",
        periodsPerWeek: 41,
        subjects: ["Sindhi/Urdu MT (6)", "English (6)", "Math (6)", "Islamiyat (4)", "General Science (6)", "Salees Urdu (3)", "Social Studies (4)", "Computer (2)", "Arabic (2)", "PE (1)", "Library (1)"],
        timetable: {
            Monday: ["Math", "Sindhi/Urdu", "General Science", "English", "Islamiyat", "Social Studies", "Computer"],
            Tuesday: ["Math", "Sindhi/Urdu", "General Science", "English", "Salees Urdu", "Social Studies", "Arabic"],
            Wednesday: ["Math", "Sindhi/Urdu", "General Science Lab", "English", "Islamiyat", "Social Studies", "Computer"],
            Thursday: ["Math", "Sindhi/Urdu Reading", "General Science", "English Writing", "Salees Urdu", "Social Studies", "Arabic"],
            Friday: ["Math", "Sindhi/Urdu Writing", "General Science", "English Speaking", "PE", "Library", "Salees Urdu"]
        }
    },
    viii: {
        name: "Grade VIII",
        periodsPerWeek: 41,
        subjects: ["Sindhi/Urdu MT (6)", "English (6)", "Math (6)", "Islamiyat (4)", "General Science (6)", "Salees Urdu (3)", "Social Studies (4)", "Computer (2)", "Home Economics (2)", "PE (1)", "Library (1)"],
        timetable: {
            Monday: ["Math", "Sindhi/Urdu", "General Science", "English", "Islamiyat", "Social Studies", "Computer"],
            Tuesday: ["Math", "Sindhi/Urdu", "General Science", "English", "Salees Urdu", "Social Studies", "Home Econ"],
            Wednesday: ["Math", "Sindhi/Urdu", "General Science Lab", "English", "Islamiyat", "Social Studies", "Computer"],
            Thursday: ["Math", "Sindhi/Urdu", "General Science", "English Writing", "Salees Urdu", "Social Studies", "Home Econ"],
            Friday: ["Math", "Sindhi/Urdu Writing", "General Science", "English Speaking", "PE", "Library", "Salees Urdu"]
        }
    },
    'ix-sci': {
        name: "Grade IX (Science Group)",
        periodsPerWeek: 35,
        subjects: ["English", "Sindhi/Urdu MT", "Asan Sindhi/Urdu", "Islamiyat", "Math", "Physics", "Chemistry", "Biology"],
        timetable: {
            Monday: ["Math", "English", "Physics Theory", "Chemistry Theory", "Islamiyat", "Sindhi/Urdu"],
            Tuesday: ["Math", "English", "Physics Theory", "Chemistry Theory", "Biology", "Asan Sindhi"],
            Wednesday: ["Math", "English", "Physics Lab", "Chemistry Theory", "Biology", "Islamiyat"],
            Thursday: ["Math", "English", "Physics Theory", "Chemistry Lab", "Biology", "Sindhi/Urdu"],
            Friday: ["Math", "English", "Physics", "Chemistry", "Biology", "Asan Sindhi"]
        }
    },
    'x-sci': {
        name: "Grade X (Science Group)",
        periodsPerWeek: 35,
        subjects: ["English", "Sindhi/Urdu MT", "Asan Sindhi/Urdu", "Pakistan Studies", "Math", "Physics", "Chemistry", "Biology"],
        timetable: {
            Monday: ["Math", "English", "Physics Theory", "Chemistry Theory", "Pakistan Studies", "Sindhi/Urdu"],
            Tuesday: ["Math", "English", "Physics Theory", "Chemistry Theory", "Biology", "Asan Sindhi"],
            Wednesday: ["Math", "English", "Physics Lab", "Chemistry Theory", "Biology", "Pakistan Studies"],
            Thursday: ["Math", "English", "Physics Theory", "Chemistry Lab", "Biology", "Sindhi/Urdu"],
            Friday: ["Math", "English", "Physics", "Chemistry", "Biology", "Asan Sindhi"]
        }
    },
    'ix-hum': {
        name: "Grade IX (Humanities Group)",
        periodsPerWeek: 35,
        subjects: ["English", "Sindhi/Urdu MT", "Asan Sindhi/Urdu", "Islamiyat", "General Science", "General Math", "Elective I", "Elective II"],
        timetable: {
            Monday: ["General Math", "English", "General Science", "Islamiyat", "Elective I", "Sindhi/Urdu"],
            Tuesday: ["General Math", "English", "General Science", "Elective II", "Asan Sindhi", "Elective I"],
            Wednesday: ["General Math", "English", "General Science", "Elective I", "Islamiyat", "Elective II"],
            Thursday: ["General Math", "English", "General Science", "Elective II", "Sindhi/Urdu", "Asan Sindhi"],
            Friday: ["General Math", "English", "General Science", "Elective I", "Elective II", "Library"]
        }
    },
    'x-hum': {
        name: "Grade X (Humanities Group)",
        periodsPerWeek: 35,
        subjects: ["English", "Sindhi/Urdu MT", "Asan Sindhi/Urdu", "Pakistan Studies", "General Science", "General Math", "Elective I", "Elective II"],
        timetable: {
            Monday: ["General Math", "English", "General Science", "Pakistan Studies", "Elective I", "Sindhi/Urdu"],
            Tuesday: ["General Math", "English", "General Science", "Elective II", "Asan Sindhi", "Elective I"],
            Wednesday: ["General Math", "English", "General Science", "Elective I", "Pakistan Studies", "Elective II"],
            Thursday: ["General Math", "English", "General Science", "Elective II", "Sindhi/Urdu", "Asan Sindhi"],
            Friday: ["General Math", "English", "General Science", "Elective I", "Elective II", "Library"]
        }
    },
    'xi-pm': {
        name: "Grade XI (Pre-Medical)",
        periodsPerWeek: 40,
        subjects: ["Urdu/Sindhi", "English", "Islamiyat", "Biology", "Physics", "Chemistry", "Library"],
        timetable: {
            Monday: ["Biology Theory", "Physics Theory", "Chemistry Theory", "English", "Urdu/Sindhi", "Library"],
            Tuesday: ["Biology Theory", "Physics Theory", "Chemistry Theory", "English", "Islamiyat", "Biology Practical"],
            Wednesday: ["Biology Theory", "Physics Theory", "Chemistry Theory", "English", "Urdu/Sindhi", "Physics Practical"],
            Thursday: ["Biology Theory", "Physics Theory", "Chemistry Theory", "English", "Islamiyat", "Chemistry Practical"],
            Friday: ["Biology Theory", "Physics Theory", "Chemistry Theory", "English", "Urdu/Sindhi", "Library"]
        }
    },
    'xii-pm': {
        name: "Grade XII (Pre-Medical)",
        periodsPerWeek: 40,
        subjects: ["Sindhi/Salees", "English", "Pakistan Studies", "Biology", "Physics", "Chemistry", "Library"],
        timetable: {
            Monday: ["Biology Theory", "Physics Theory", "Chemistry Theory", "English", "Sindhi", "Library"],
            Tuesday: ["Biology Theory", "Physics Theory", "Chemistry Theory", "English", "Pakistan Studies", "Biology Practical"],
            Wednesday: ["Biology Theory", "Physics Theory", "Chemistry Theory", "English", "Sindhi", "Physics Practical"],
            Thursday: ["Biology Theory", "Physics Theory", "Chemistry Theory", "English", "Pakistan Studies", "Chemistry Practical"],
            Friday: ["Biology Theory", "Physics Theory", "Chemistry Theory", "English", "Sindhi", "Library"]
        }
    },
    'xi-pe': {
        name: "Grade XI (Pre-Engineering)",
        periodsPerWeek: 40,
        subjects: ["Urdu/Sindhi", "English", "Islamiyat", "Mathematics", "Physics", "Chemistry", "Library"],
        timetable: {
            Monday: ["Math", "Physics Theory", "Chemistry Theory", "English", "Urdu/Sindhi", "Library"],
            Tuesday: ["Math", "Physics Theory", "Chemistry Theory", "English", "Islamiyat", "Physics Practical"],
            Wednesday: ["Math", "Physics Theory", "Chemistry Theory", "English", "Urdu/Sindhi", "Chemistry Practical"],
            Thursday: ["Math", "Physics Theory", "Chemistry Theory", "English", "Islamiyat", "Math Practical"],
            Friday: ["Math", "Physics Theory", "Chemistry Theory", "English", "Urdu/Sindhi", "Library"]
        }
    },
    'xii-pe': {
        name: "Grade XII (Pre-Engineering)",
        periodsPerWeek: 40,
        subjects: ["Sindhi/Salees", "English", "Pakistan Studies", "Mathematics", "Physics", "Chemistry", "Library"],
        timetable: {
            Monday: ["Math", "Physics Theory", "Chemistry Theory", "English", "Sindhi", "Library"],
            Tuesday: ["Math", "Physics Theory", "Chemistry Theory", "English", "Pakistan Studies", "Physics Practical"],
            Wednesday: ["Math", "Physics Theory", "Chemistry Theory", "English", "Sindhi", "Chemistry Practical"],
            Thursday: ["Math", "Physics Theory", "Chemistry Theory", "English", "Pakistan Studies", "Math Practical"],
            Friday: ["Math", "Physics Theory", "Chemistry Theory", "English", "Sindhi", "Library"]
        }
    },
    'xi-com': {
        name: "Grade XI (Commerce)",
        periodsPerWeek: 40,
        subjects: ["Urdu/Sindhi", "English", "Islamiyat", "Accounting", "Commerce", "Economics", "Library"],
        timetable: {
            Monday: ["Accounting", "Commerce", "Economics", "English", "Urdu/Sindhi", "Library"],
            Tuesday: ["Accounting", "Commerce", "Economics", "English", "Islamiyat", "Accounting Practical"],
            Wednesday: ["Accounting", "Commerce", "Economics", "English", "Urdu/Sindhi", "Commerce Practical"],
            Thursday: ["Accounting", "Commerce", "Economics", "English", "Islamiyat", "Economics Practical"],
            Friday: ["Accounting", "Commerce", "Economics", "English", "Urdu/Sindhi", "Library"]
        }
    },
    'xii-com': {
        name: "Grade XII (Commerce)",
        periodsPerWeek: 40,
        subjects: ["Sindhi/Salees", "English", "Pakistan Studies", "Accounting", "Commerce", "Economics", "Library"],
        timetable: {
            Monday: ["Accounting", "Commerce", "Economics", "English", "Sindhi", "Library"],
            Tuesday: ["Accounting", "Commerce", "Economics", "English", "Pakistan Studies", "Accounting Practical"],
            Wednesday: ["Accounting", "Commerce", "Economics", "English", "Sindhi", "Commerce Practical"],
            Thursday: ["Accounting", "Commerce", "Economics", "English", "Pakistan Studies", "Economics Practical"],
            Friday: ["Accounting", "Commerce", "Economics", "English", "Sindhi", "Library"]
        }
    }
};

// ============================================
// GLOBAL VARIABLES
// ============================================
let currentUsage = 0;
let globalUsage = 0;
let reactions = { like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0 };
let teachers = [];
let currentPosterDesign = null;

// ============================================
// HELPER FUNCTIONS
// ============================================
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    toastMsg.textContent = message;
    toast.style.background = isError ? 'var(--danger)' : 'var(--success)';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function showLoading(show, text = 'Loading...') {
    const overlay = document.getElementById('loadingOverlay');
    const loadingText = document.getElementById('loadingText');
    if (loadingText) loadingText.textContent = text;
    if (show) overlay.classList.add('active');
    else overlay.classList.remove('active');
}

async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = { method, headers: { 'Content-Type': 'application/json' } };
        if (data) options.body = JSON.stringify(data);
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

// ============================================
// USAGE COUNTER FUNCTIONS (TiDB Integrated)
// ============================================
async function incrementUsage() {
    try {
        const result = await apiCall('/increment-usage', 'POST', { tool_slug: TOOL_SLUG, user_id: USER_ID });
        if (result && result.success) {
            await loadUsage();
            await loadGlobalUsage();
        } else {
            // Fallback to local
            let local = parseInt(localStorage.getItem(`${TOOL_SLUG}_usage`) || '0');
            local++;
            localStorage.setItem(`${TOOL_SLUG}_usage`, local);
            currentUsage = local;
            document.getElementById('usageCount').textContent = currentUsage;
        }
    } catch (error) {
        console.error('Increment usage error:', error);
    }
}

async function loadUsage() {
    try {
        const result = await apiCall(`/usage?tool_slug=${TOOL_SLUG}`, 'GET');
        if (result && result.success) {
            currentUsage = result.count || 0;
            document.getElementById('usageCount').textContent = currentUsage;
        } else {
            const local = parseInt(localStorage.getItem(`${TOOL_SLUG}_usage`) || '0');
            currentUsage = local;
            document.getElementById('usageCount').textContent = currentUsage;
        }
    } catch (error) {
        const local = parseInt(localStorage.getItem(`${TOOL_SLUG}_usage`) || '0');
        currentUsage = local;
        document.getElementById('usageCount').textContent = currentUsage;
    }
}

async function loadGlobalUsage() {
    try {
        const result = await apiCall('/global-stats', 'GET');
        if (result && result.success) {
            globalUsage = result.totalUsage || 0;
            document.getElementById('globalUsageCount').textContent = globalUsage;
        } else {
            document.getElementById('globalUsageCount').textContent = 'N/A';
        }
    } catch (error) {
        document.getElementById('globalUsageCount').textContent = 'N/A';
    }
}

// ============================================
// REACTIONS FUNCTIONS (TiDB Integrated)
// ============================================
async function loadReactions() {
    try {
        const result = await apiCall(`/reactions?tool_slug=${TOOL_SLUG}`, 'GET');
        if (result && result.success && result.reactions) {
            reactions = result.reactions;
        } else {
            const local = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_reactions`) || '{"like":0,"love":0,"wow":0,"sad":0,"angry":0,"laugh":0,"celebrate":0}');
            reactions = local;
        }
        updateReactionUI();
    } catch (error) {
        console.error('Load reactions error:', error);
    }
}

async function addReaction(emoji) {
    const reactionMap = { '👍': 'like', '❤️': 'love', '😮': 'wow', '😢': 'sad', '😠': 'angry', '😂': 'laugh', '🎉': 'celebrate' };
    const reactionType = reactionMap[emoji];
    
    try {
        const result = await apiCall('/add-reaction', 'POST', {
            tool_slug: TOOL_SLUG,
            emoji: emoji,
            reaction_type: reactionType,
            user_id: USER_ID
        });
        
        if (result && result.success) {
            if (result.counts) {
                reactions = result.counts;
                updateReactionUI();
            }
            showToast(`Reacted with ${emoji}!`);
        } else if (result && result.already_reacted) {
            showToast('You already reacted with this emoji!', true);
        } else {
            // Fallback local
            let local = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_reactions`) || '{"like":0,"love":0,"wow":0,"sad":0,"angry":0,"laugh":0,"celebrate":0}');
            local[reactionType] = (local[reactionType] || 0) + 1;
            localStorage.setItem(`${TOOL_SLUG}_reactions`, JSON.stringify(local));
            await loadReactions();
        }
    } catch (error) {
        console.error('Add reaction error:', error);
    }
}

function updateReactionUI() {
    document.getElementById('likeCount').textContent = reactions.like || 0;
    document.getElementById('loveCount').textContent = reactions.love || 0;
    document.getElementById('wowCount').textContent = reactions.wow || 0;
    document.getElementById('sadCount').textContent = reactions.sad || 0;
    document.getElementById('angryCount').textContent = reactions.angry || 0;
    document.getElementById('laughCount').textContent = reactions.laugh || 0;
    document.getElementById('celebrateCount').textContent = reactions.celebrate || 0;
}

// ============================================
// SHARE FUNCTIONS (TiDB Integrated)
// ============================================
async function recordShare(platform) {
    try {
        await apiCall('/add-share', 'POST', {
            tool_slug: TOOL_SLUG,
            platform: platform,
            user_id: USER_ID
        });
    } catch (error) {
        console.error('Record share error:', error);
    }
}

function sharePage(platform) {
    const url = window.location.href;
    const text = `Advanced Auto Timetable Generator - Sindh Scheme of Studies 2023-24 | ECCE to Grade XII`;
    
    let shareUrl = '';
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=Auto Timetable Generator&body=${encodeURIComponent(text + '\n\n' + url)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        recordShare(platform);
        showToast(`Shared on ${platform}!`);
    }
}

async function copyUrl() {
    await navigator.clipboard.writeText(window.location.href);
    recordShare('copy');
    showToast('URL Copied!');
}

// ============================================
// TIMETABLE DISPLAY FUNCTIONS
// ============================================
function displayTimetable(gradeKey, containerId, titleElementId = null) {
    const data = SINDH_CURRICULUM[gradeKey];
    if (!data) {
        showToast('Grade data not found', true);
        return;
    }
    
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (titleElementId) {
        const titleEl = document.getElementById(titleElementId);
        if (titleEl) titleEl.textContent = data.name;
    }
    
    let html = '<table class="timetable-table"><thead><tr><th>Day</th>';
    const periods = Object.values(data.timetable)[0]?.length || 6;
    for (let i = 1; i <= periods; i++) {
        html += `<th>Period ${i}</th>`;
    }
    html += '</tr></thead><tbody>';
    
    for (const [day, subjects] of Object.entries(data.timetable)) {
        html += `<tr><td><strong>${day}</strong></td>`;
        subjects.forEach(sub => {
            html += `<td>${sub}</td>`;
        });
        html += '</tr>';
    }
    html += '</tbody></table>';
    html += `<div class="subject-summary"><strong>Subjects (${data.periodsPerWeek} periods/week):</strong> ${data.subjects.join(' • ')}</div>`;
    
    container.innerHTML = html;
    incrementUsage();
}

function displayMasterTimetable() {
    const container = document.getElementById('masterTimetableContainer');
    if (!container) return;
    
    let html = '<h3>All Grades Master Timetable</h3>';
    for (const [key, data] of Object.entries(SINDH_CURRICULUM)) {
        html += `<h4>${data.name}</h4>`;
        html += '<table class="timetable-table"><thead><tr><th>Day</th>';
        const periods = Object.values(data.timetable)[0]?.length || 6;
        for (let i = 1; i <= periods; i++) html += `<th>Period ${i}</th>`;
        html += '</tr></thead><tbody>';
        
        for (const [day, subjects] of Object.entries(data.timetable)) {
            html += `<tr><td><strong>${day}</strong></td>`;
            subjects.forEach(sub => html += `<td>${sub}</td>`);
            html += '</tr>';
        }
        html += '</tbody></table><br>';
    }
    container.innerHTML = html;
    incrementUsage();
}

// ============================================
// TEACHER MANAGEMENT
// ============================================
function addTeacher() {
    const name = document.getElementById('teacherName')?.value.trim();
    const subjects = document.getElementById('teacherSubjects')?.value.trim();
    
    if (!name || !subjects) {
        showToast('Please enter teacher name and subjects', true);
        return;
    }
    
    const teacher = {
        name: name,
        subjects: subjects.split(',').map(s => s.trim()),
        timetable: generateTeacherTimetable(name)
    };
    
    teachers.push(teacher);
    saveTeachers();
    updateTeacherSelect();
    showToast(`Teacher "${name}" added successfully!`);
    
    document.getElementById('teacherName').value = '';
    document.getElementById('teacherSubjects').value = '';
}

function generateTeacherTimetable(teacherName) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const periods = 6;
    const teacher = teachers.find(t => t.name === teacherName);
    const subjects = teacher ? teacher.subjects : ['Free'];
    const timetable = {};
    
    days.forEach(day => {
        timetable[day] = [];
        for (let i = 0; i < periods; i++) {
            const randomSubject = subjects[Math.floor(Math.random() * subjects.length)] || 'Free';
            timetable[day].push(randomSubject);
        }
    });
    return timetable;
}

function displayTeacherTimetable(teacherName) {
    const teacher = teachers.find(t => t.name === teacherName);
    if (!teacher) {
        showToast('Teacher not found', true);
        return;
    }
    
    const container = document.getElementById('teacherTimetableContainer');
    if (!container) return;
    
    let html = `<h4>${teacher.name}'s Timetable</h4>`;
    html += '<table class="timetable-table"><thead><tr><th>Day</th><th>Period 1</th><th>Period 2</th><th>Period 3</th><th>Period 4</th><th>Period 5</th><th>Period 6</th></tr></thead><tbody>';
    
    for (const [day, periods] of Object.entries(teacher.timetable)) {
        html += `<tr><td><strong>${day}</strong></td>`;
        periods.forEach(p => html += `<td>${p}</td>`);
        html += '</tr>';
    }
    html += '</tbody></table>';
    html += `<div class="subject-summary"><strong>Subjects:</strong> ${teacher.subjects.join(', ')}</div>`;
    
    container.innerHTML = html;
}

function updateTeacherSelect() {
    const select = document.getElementById('teacherSelect');
    if (!select) return;
    
    select.innerHTML = '<option value="">-- Select Teacher --</option>';
    teachers.forEach(teacher => {
        const option = document.createElement('option');
        option.value = teacher.name;
        option.textContent = teacher.name;
        select.appendChild(option);
    });
}

function saveTeachers() {
    localStorage.setItem(`${TOOL_SLUG}_teachers`, JSON.stringify(teachers));
}

function loadTeachers() {
    const saved = localStorage.getItem(`${TOOL_SLUG}_teachers`);
    if (saved) {
        teachers = JSON.parse(saved);
        updateTeacherSelect();
    }
}

// ============================================
// SUBJECT TIMETABLE
// ============================================
function displaySubjectTimetable() {
    const subject = document.getElementById('subjectName')?.value.trim();
    if (!subject) {
        showToast('Please enter a subject name', true);
        return;
    }
    
    const container = document.getElementById('subjectTimetableContainer');
    if (!container) return;
    
    let html = `<h4>Subject: ${subject}</h4>`;
    html += '<table class="timetable-table"><thead><tr><th>Grade</th><th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th></tr></thead><tbody>';
    
    for (const [key, data] of Object.entries(SINDH_CURRICULUM)) {
        const schedule = [];
        for (const [day, subjects] of Object.entries(data.timetable)) {
            const hasSubject = subjects.some(s => s.toLowerCase().includes(subject.toLowerCase()));
            schedule.push(hasSubject ? '✓' : '-');
        }
        html += `<tr><td>${data.name}</td><td>${schedule[0]}</td><td>${schedule[1]}</td><td>${schedule[2]}</td><td>${schedule[3]}</td><td>${schedule[4]}</td></tr>`;
    }
    html += '</tbody></table>';
    
    container.innerHTML = html;
}

// ============================================
// FREE PERIODS MANAGEMENT
// ============================================
function showFreePeriods() {
    const type = document.getElementById('freeTypeSelect')?.value;
    const container = document.getElementById('freePeriodsContainer');
    if (!container) return;
    
    let html = '<table class="timetable-table"><thead><tr><th>Name</th><th>Day</th><th>Period</th></tr></thead><tbody>';
    let hasFree = false;
    
    if (type === 'teacher') {
        teachers.forEach(teacher => {
            for (const [day, periods] of Object.entries(teacher.timetable)) {
                periods.forEach((p, idx) => {
                    if (p === 'Free' || p.toLowerCase() === 'free') {
                        hasFree = true;
                        html += `<tr><td>${teacher.name}</td><td>${day}</td><td>Period ${idx + 1}</td></tr>`;
                    }
                });
            }
        });
    } else {
        for (const [key, data] of Object.entries(SINDH_CURRICULUM)) {
            for (const [day, periods] of Object.entries(data.timetable)) {
                periods.forEach((p, idx) => {
                    if (p === 'Free' || p === 'Library' || p === 'PE' || p === 'Arts') {
                        hasFree = true;
                        html += `<tr><td>${data.name}</td><td>${day}</td><td>Period ${idx + 1} (${p})</td></tr>`;
                    }
                });
            }
        }
    }
    
    html += '</tbody></table>';
    
    if (!hasFree) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-clock"></i><p>No free periods found</p></div>';
    } else {
        container.innerHTML = html;
    }
}

// ============================================
// AI QUOTE GENERATOR (Grok API Integrated)
// ============================================
async function generateQuote() {
    const prompt = document.getElementById('quotePrompt')?.value.trim();
    if (!prompt) {
        showToast('Please enter a topic for quote generation', true);
        return;
    }
    
    showLoading(true, 'Generating AI quote with Grok...');
    
    try {
        const result = await apiCall('/generate-quote', 'POST', {
            prompt: prompt,
            topic: prompt,
            category: 'inspiration'
        });
        
        const container = document.getElementById('quoteDisplay');
        if (container) {
            if (result && result.success && result.quote) {
                container.innerHTML = `
                    <div class="quote-text">"${result.quote}"</div>
                    <div class="quote-author">- ${result.author || 'Grok AI'}</div>
                    <div class="quote-source"><small>Source: ${result.source || 'AI Generated'}</small></div>
                `;
                showToast('Quote generated successfully!');
                
                // Update poster preview
                if (document.getElementById('posterQuote')) {
                    document.getElementById('posterQuote').textContent = `"${result.quote}"`;
                    document.getElementById('posterAuthor').textContent = `- ${result.author || 'AI Generator'}`;
                }
            } else {
                // Fallback quotes
                const fallbackQuotes = [
                    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
                    { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
                    { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
                    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
                    { text: "Creativity is intelligence having fun.", author: "Albert Einstein" }
                ];
                const random = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
                container.innerHTML = `
                    <div class="quote-text">"${random.text}"</div>
                    <div class="quote-author">- ${random.author}</div>
                    <div class="quote-source"><small>Source: Fallback Database</small></div>
                `;
                if (document.getElementById('posterQuote')) {
                    document.getElementById('posterQuote').textContent = `"${random.text}"`;
                    document.getElementById('posterAuthor').textContent = `- ${random.author}`;
                }
            }
        }
    } catch (error) {
        console.error('Quote generation error:', error);
        showToast('Failed to generate quote', true);
    } finally {
        showLoading(false);
    }
}

// ============================================
// POSTER GENERATOR (Save/Load from TiDB)
// ============================================
function updatePosterPreview() {
    const bgColor = document.getElementById('posterBgColor')?.value || '#006633';
    const textColor = document.getElementById('posterTextColor')?.value || '#ffffff';
    const preview = document.getElementById('posterPreview');
    if (preview) {
        preview.style.background = bgColor;
        preview.style.color = textColor;
    }
}

async function saveDesign() {
    const bgColor = document.getElementById('posterBgColor')?.value || '#006633';
    const textColor = document.getElementById('posterTextColor')?.value || '#ffffff';
    const quote = document.getElementById('posterQuote')?.innerText || '';
    const author = document.getElementById('posterAuthor')?.innerText || '';
    
    const designData = {
        bgColor: bgColor,
        textColor: textColor,
        quote: quote,
        author: author,
        timestamp: new Date().toISOString()
    };
    
    showLoading(true, 'Saving design to database...');
    
    try {
        const result = await apiCall('/save-design', 'POST', {
            tool_slug: TOOL_SLUG,
            user_id: USER_ID,
            design_name: `Design_${Date.now()}`,
            design_json: JSON.stringify(designData)
        });
        
        if (result && result.success) {
            showToast('Design saved successfully!');
        } else {
            // Local fallback
            const saved = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_designs`) || '[]');
            saved.push(designData);
            localStorage.setItem(`${TOOL_SLUG}_designs`, JSON.stringify(saved));
            showToast('Design saved locally!');
        }
    } catch (error) {
        console.error('Save design error:', error);
        showToast('Failed to save design', true);
    } finally {
        showLoading(false);
    }
}

async function loadDesigns() {
    const container = document.getElementById('designsList');
    const designsContainer = document.getElementById('savedDesignsContainer');
    
    showLoading(true, 'Loading saved designs...');
    
    try {
        const result = await apiCall(`/get-designs?tool_slug=${TOOL_SLUG}&user_id=${USER_ID}`, 'GET');
        
        if (designsContainer) designsContainer.style.display = 'block';
        
        if (container) {
            if (result && result.success && result.designs && result.designs.length > 0) {
                let html = '<div class="designs-grid">';
                result.designs.forEach(design => {
                    let designData = {};
                    try {
                        designData = JSON.parse(design.design_json);
                    } catch(e) { designData = {}; }
                    html += `
                        <div class="design-card" onclick="applyDesign('${design.id}')">
                            <i class="fas fa-image"></i>
                            <p>${design.design_name || 'Design'}</p>
                            <small>${new Date(design.created_at).toLocaleDateString()}</small>
                        </div>
                    `;
                });
                html += '</div>';
                container.innerHTML = html;
            } else {
                // Local fallback
                const local = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_designs`) || '[]');
                if (local.length > 0) {
                    let html = '<div class="designs-grid">';
                    local.forEach((design, idx) => {
                        html += `
                            <div class="design-card" onclick="applyLocalDesign(${idx})">
                                <i class="fas fa-image"></i>
                                <p>Local Design ${idx + 1}</p>
                                <small>Saved Locally</small>
                            </div>
                        `;
                    });
                    html += '</div>';
                    container.innerHTML = html;
                } else {
                    container.innerHTML = '<p class="empty-state">No saved designs found</p>';
                }
            }
        }
    } catch (error) {
        console.error('Load designs error:', error);
        if (container) container.innerHTML = '<p class="empty-state">Failed to load designs</p>';
    } finally {
        showLoading(false);
    }
}

function applyDesign(designId) {
    showToast('Feature: Apply design from database', true);
}

function applyLocalDesign(index) {
    const designs = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_designs`) || '[]');
    const design = designs[index];
    if (design) {
        if (design.bgColor) document.getElementById('posterBgColor').value = design.bgColor;
        if (design.textColor) document.getElementById('posterTextColor').value = design.textColor;
        if (design.quote) document.getElementById('posterQuote').textContent = design.quote;
        if (design.author) document.getElementById('posterAuthor').textContent = design.author;
        updatePosterPreview();
        showToast('Design applied!');
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================
function exportAsPDF(containerId, filename = 'timetable') {
    const content = document.getElementById(containerId)?.innerHTML;
    if (!content) {
        showToast('No content to export', true);
        return;
    }
    
    const win = window.open('', '_blank');
    win.document.write(`
        <html>
        <head>
            <title>Sindh Timetable</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
                th { background: #006633; color: white; }
                .subject-summary { background: #f5f5f5; padding: 10px; margin-top: 10px; }
            </style>
        </head>
        <body>
            <h1>Advanced Auto Timetable Generator</h1>
            <h2>Sindh Scheme of Studies 2023-24</h2>
            ${content}
            <p>Generated by DCAR Sindh - ${new Date().toLocaleString()}</p>
        </body>
        </html>
    `);
    win.document.close();
    win.print();
    showToast('PDF Generated');
}

function exportAsDOC(containerId, filename = 'timetable') {
    const content = document.getElementById(containerId)?.innerHTML;
    if (!content) {
        showToast('No content to export', true);
        return;
    }
    
    const html = `
        <html>
        <head>
            <title>Sindh Timetable</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #000; padding: 8px; text-align: center; }
                th { background: #006633; color: white; }
            </style>
        </head>
        <body>
            <h1>Advanced Auto Timetable Generator</h1>
            <h2>Sindh Scheme of Studies 2023-24</h2>
            ${content}
        </body>
        </html>
    `;
    
    const blob = new Blob([html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('DOC Downloaded');
}

function exportAsTXT(containerId, filename = 'timetable') {
    const content = document.getElementById(containerId)?.innerText;
    if (!content) {
        showToast('No content to export', true);
        return;
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('TXT Downloaded');
}

// ============================================
// DARK MODE
// ============================================
function initDarkMode() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) document.body.classList.add('dark');
    
    const toggle = document.getElementById('darkToggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            localStorage.setItem('darkMode', document.body.classList.contains('dark'));
        });
    }
}

// ============================================
// SCROLL BUTTONS
// ============================================
function initScrollButtons() {
    const scrollUp = document.getElementById('scrollUp');
    const scrollDown = document.getElementById('scrollDown');
    
    if (scrollUp) {
        scrollUp.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    if (scrollDown) {
        scrollDown.addEventListener('click', () => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });
    }
}

// ============================================
// EVENT LISTENERS
// ============================================
function initEventListeners() {
    // Category cards
    document.querySelectorAll('.cat-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const grade = card.dataset.grade;
            if (grade && SINDH_CURRICULUM[grade]) {
                displayTimetable(grade, 'classTimetableContainer');
                document.getElementById('timetableTitle').textContent = SINDH_CURRICULUM[grade].name;
            }
        });
    });
    
    // Class select
    const classSelect = document.getElementById('classSelect');
    if (classSelect) {
        classSelect.addEventListener('change', (e) => {
            if (e.target.value && SINDH_CURRICULUM[e.target.value]) {
                displayTimetable(e.target.value, 'classTimetableContainer');
            }
        });
    }
    
    // Generate master
    const generateMaster = document.getElementById('generateMasterBtn');
    if (generateMaster) {
        generateMaster.addEventListener('click', () => {
            displayMasterTimetable();
            showToast('Master Timetable Generated!');
        });
    }
    
    // Reset master
    const resetMaster = document.getElementById('resetMasterBtn');
    if (resetMaster) {
        resetMaster.addEventListener('click', () => {
            document.getElementById('masterTimetableContainer').innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-plus"></i>
                    <p>Click Generate to create Master Timetable for all grades</p>
                </div>
            `;
        });
    }
    
    // Reactions
    document.querySelectorAll('.reaction').forEach(btn => {
        btn.addEventListener('click', () => {
            const emoji = btn.dataset.emoji;
            if (emoji) addReaction(emoji);
        });
    });
    
    // Refresh usage
    const refreshUsage = document.getElementById('refreshUsageBtn');
    if (refreshUsage) {
        refreshUsage.addEventListener('click', () => {
            loadUsage();
            loadGlobalUsage();
        });
    }
    
    // Teacher
    const addTeacherBtn = document.getElementById('addTeacherBtn');
    if (addTeacherBtn) {
        addTeacherBtn.addEventListener('click', addTeacher);
    }
    
    const teacherSelect = document.getElementById('teacherSelect');
    if (teacherSelect) {
        teacherSelect.addEventListener('change', (e) => {
            if (e.target.value) displayTeacherTimetable(e.target.value);
        });
    }
    
    // Subject
    const viewSubjectBtn = document.getElementById('viewSubjectBtn');
    if (viewSubjectBtn) {
        viewSubjectBtn.addEventListener('click', displaySubjectTimetable);
    }
    
    // Free periods
    const showFreeBtn = document.getElementById('showFreeBtn');
    if (showFreeBtn) {
        showFreeBtn.addEventListener('click', showFreePeriods);
    }
    
    // AI Quote
    const generateQuoteBtn = document.getElementById('generateQuoteBtn');
    if (generateQuoteBtn) {
        generateQuoteBtn.addEventListener('click', generateQuote);
    }
    
    // Poster
    const updatePosterBtn = document.getElementById('updatePosterBtn');
    if (updatePosterBtn) {
        updatePosterBtn.addEventListener('click', updatePosterPreview);
    }
    
    const saveDesignBtn = document.getElementById('saveDesignBtn');
    if (saveDesignBtn) {
        saveDesignBtn.addEventListener('click', saveDesign);
    }
    
    const loadDesignsBtn = document.getElementById('loadDesignsBtn');
    if (loadDesignsBtn) {
        loadDesignsBtn.addEventListener('click', loadDesigns);
    }
    
    // Export buttons
    const exportClassPDF = document.getElementById('exportClassPDF');
    if (exportClassPDF) {
        exportClassPDF.addEventListener('click', () => exportAsPDF('classTimetableContainer', 'class_timetable'));
    }
    
    const exportClassDOC = document.getElementById('exportClassDOC');
    if (exportClassDOC) {
        exportClassDOC.addEventListener('click', () => exportAsDOC('classTimetableContainer', 'class_timetable'));
    }
    
    const exportClassTXT = document.getElementById('exportClassTXT');
    if (exportClassTXT) {
        exportClassTXT.addEventListener('click', () => exportAsTXT('classTimetableContainer', 'class_timetable'));
    }
    
    const shareClassBtn = document.getElementById('shareClassBtn');
    if (shareClassBtn) {
        shareClassBtn.addEventListener('click', () => sharePage('facebook'));
    }
    
    // Social share
    document.querySelectorAll('.social').forEach(btn => {
        if (btn.id === 'copyUrlBtn') {
            btn.addEventListener('click', copyUrl);
        } else {
            btn.addEventListener('click', () => {
                const platform = btn.dataset.platform;
                if (platform) sharePage(platform);
            });
        }
    });
}

// ============================================
// INITIALIZATION
// ============================================
async function init() {
    showLoading(true, 'Loading Sindh Scheme of Studies 2023-24...');
    
    await loadUsage();
    await loadGlobalUsage();
    await loadReactions();
    loadTeachers();
    
    initDarkMode();
    initScrollButtons();
    initEventListeners();
    
    // Set default poster colors
    if (document.getElementById('posterBgColor')) {
        document.getElementById('posterBgColor').value = '#006633';
        document.getElementById('posterTextColor').value = '#ffffff';
        updatePosterPreview();
    }
    
    showLoading(false);
    showToast('Advanced Auto Timetable Generator Ready! (76 Features Loaded)');
}

// Start the app
init();
