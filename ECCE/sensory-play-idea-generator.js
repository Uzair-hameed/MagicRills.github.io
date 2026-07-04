// ============================================================
// SENSORY PLAY TRACKER - CLOUDFLARE WORKERS API
// Complete rewrite with Cloudflare Workers API integration
// ============================================================

// ============================================================
// CONFIGURATION
// ============================================================

const CONFIG = {
    API_BASE: 'https://magicrills-api.uzairhameed01.workers.dev',
    API_KEY: 'magicrills-grok-api.uzairhameed01.workers.dev',
    TOOL_SLUG: 'sensory-play-tracker',
    TOOL_NAME: 'Sensory Play Tracker',
    STORAGE_KEYS: {
        STUDENTS: 'sensory_students',
        CLASS_NAME: 'sensory_class_name',
        CHECKLISTS: 'sensory_checklists',
        TOTAL_USAGE: 'sensory_total_usage',
        REACTIONS: 'sensory_reactions',
        SHARE_COUNT: 'sensory_share_count'
    }
};

// ============================================================
// API HELPER FUNCTIONS
// ============================================================

/**
 * Make API request to Cloudflare Workers
 */
async function apiRequest(endpoint, method = 'GET', data = null) {
    try {
        const url = `${CONFIG.API_BASE}${endpoint}`;
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': CONFIG.API_KEY
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.warn('API request failed, using localStorage fallback:', error);
        return null;
    }
}

/**
 * Record tool usage
 */
async function recordUsage() {
    try {
        const result = await apiRequest('/api/usage', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            tool_name: CONFIG.TOOL_NAME
        });
        
        if (result && result.success) {
            return result.data || { count: getLocalUsage() };
        }
    } catch (error) {
        console.warn('Usage recording failed, using localStorage:', error);
    }
    
    // Fallback: localStorage
    return { count: incrementLocalUsage() };
}

/**
 * Get tool stats
 */
async function getStats() {
    try {
        const result = await apiRequest(`/api/stats?tool_slug=${CONFIG.TOOL_SLUG}`, 'GET');
        
        if (result && result.success) {
            return result.data || {};
        }
    } catch (error) {
        console.warn('Stats fetch failed, using localStorage:', error);
    }
    
    // Fallback: localStorage
    return {
        usage: getLocalUsage(),
        views: getLocalViews(),
        shares: getLocalShares(),
        reactions: getLocalReactions()
    };
}

/**
 * Record a reaction
 */
async function recordReaction(reactionType) {
    try {
        const result = await apiRequest('/api/reactions', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            reaction: reactionType
        });
        
        if (result && result.success) {
            return result.data || {};
        }
    } catch (error) {
        console.warn('Reaction recording failed, using localStorage:', error);
    }
    
    // Fallback: localStorage
    return incrementLocalReaction(reactionType);
}

/**
 * Record a share
 */
async function recordShare(platform) {
    try {
        const result = await apiRequest('/api/shares', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            platform: platform
        });
        
        if (result && result.success) {
            return result.data || {};
        }
    } catch (error) {
        console.warn('Share recording failed, using localStorage:', error);
    }
    
    // Fallback: localStorage
    return incrementLocalShares();
}

// ============================================================
// LOCAL STORAGE FALLBACK FUNCTIONS
// ============================================================

function getLocalUsage() {
    return parseInt(localStorage.getItem(CONFIG.STORAGE_KEYS.TOTAL_USAGE) || '0');
}

function incrementLocalUsage() {
    let count = getLocalUsage() + 1;
    localStorage.setItem(CONFIG.STORAGE_KEYS.TOTAL_USAGE, count);
    return count;
}

function getLocalViews() {
    return parseInt(localStorage.getItem('sensory_views') || '0');
}

function incrementLocalViews() {
    let count = getLocalViews() + 1;
    localStorage.setItem('sensory_views', count);
    return count;
}

function getLocalShares() {
    return parseInt(localStorage.getItem(CONFIG.STORAGE_KEYS.SHARE_COUNT) || '0');
}

function incrementLocalShares() {
    let count = getLocalShares() + 1;
    localStorage.setItem(CONFIG.STORAGE_KEYS.SHARE_COUNT, count);
    return count;
}

function getLocalReactions() {
    try {
        return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.REACTIONS) || '{}');
    } catch {
        return {};
    }
}

function incrementLocalReaction(reactionType) {
    const reactions = getLocalReactions();
    reactions[reactionType] = (reactions[reactionType] || 0) + 1;
    localStorage.setItem(CONFIG.STORAGE_KEYS.REACTIONS, JSON.stringify(reactions));
    return reactions;
}

// ============================================================
// DATA STRUCTURES
// ============================================================

const SENSORY_SKILLS = [
    { id: "S1", name: "Touch Discrimination", indicator: "Differentiates soft/hard/rough textures" },
    { id: "S2", name: "Visual Discrimination", indicator: "Differentiates colors and shapes" },
    { id: "S3", name: "Auditory Discrimination", indicator: "Differentiates loud/soft sounds" },
    { id: "S4", name: "Smell Recognition", indicator: "Recognizes familiar smells (lemon, cinnamon)" },
    { id: "S5", name: "Taste Recognition", indicator: "Differentiates sweet/sour/salty (edible play)" },
    { id: "S6", name: "Temperature Sense", indicator: "Differentiates hot/cold" },
    { id: "S7", name: "Weight Sense", indicator: "Differentiates heavy/light" },
    { id: "S8", name: "Proprioception", indicator: "Controls own strength (doesn't press too hard)" },
    { id: "S9", name: "Vestibular Sense", indicator: "Maintains balance while swinging/spinning" },
    { id: "S10", name: "Multi-sensory Integration", indicator: "Uses 2+ senses simultaneously" }
];

const ACADEMIC_SKILLS = [
    { id: "A1", name: "Color Recognition", indicator: "Identifies red, yellow, blue, green" },
    { id: "A2", name: "Counting (1-10)", indicator: "Counts objects from 1 to 10" },
    { id: "A3", name: "Alphabet (A-F)", indicator: "Recognizes at least 6 letters" },
    { id: "A4", name: "Shape Recognition", indicator: "Identifies circle, square, triangle" },
    { id: "A5", name: "Name Recognition", indicator: "Recognizes own written name" },
    { id: "A6", name: "Number Recognition (1-5)", indicator: "Recognizes written numbers 1-5" },
    { id: "A7", name: "Matching", indicator: "Matches two identical pictures" },
    { id: "A8", name: "Sequencing", indicator: "Arranges small to big" },
    { id: "A9", name: "Opposites", indicator: "Understands big/small, inside/outside" },
    { id: "A10", name: "Following Instructions", indicator: "Follows 2-step instructions" }
];

const ALL_SKILLS = [...SENSORY_SKILLS, ...ACADEMIC_SKILLS];

// ============================================================
// ACTIVITY BANK
// ============================================================

const ACTIVITY_BANK = {
    "S1": { activities: ["Texture Walk - Walk on different surfaces", "Mystery Box - Guess objects by touch", "Fabric Match - Match similar textures"], materials: "Fabrics, sandpaper, cotton, sponges", homeTip: "Use different clothes (jeans, silk, towel) at home" },
    "S2": { activities: ["Color Sorting - Sort colored objects", "Pattern Match - Complete the pattern", "I Spy - Find objects of specific color"], materials: "Colored blocks, beads, papers", homeTip: "Ask child to find red/yellow/blue things at home" },
    "S3": { activities: ["Sound Shakers - Guess the sound", "Animal Sounds - Match sound to animal", "Loud/Soft Game - Respond to volume changes"], materials: "Shakers, bells, drums", homeTip: "Play 'What sound is this?' with household items" },
    "S4": { activities: ["Smell Jars - Identify different smells", "Nature Walk - Smell flowers and leaves", "Spice Exploration - Smell kitchen spices"], materials: "Lemon, cinnamon, vanilla, coffee", homeTip: "Let them smell fruits before eating" },
    "S5": { activities: ["Taste Test - Sweet/sour/salty identification", "Blind Taste - Guess with eyes closed", "Food Pairing - Match tastes to foods"], materials: "Sugar, lemon, salt, apple", homeTip: "Talk about tastes during meals" },
    "S6": { activities: ["Hot/Cold Water Play", "Ice Cube Exploration", "Warm/Cold Pack Sorting"], materials: "Water, ice cubes, warm pack", homeTip: "Let them feel warm/cold food safely" },
    "S7": { activities: ["Heavy/Light Boxes - Lift and compare", "Balance Scale - Compare weights", "Fill the Container - Feel weight changes"], materials: "Containers, rice, beans, cotton", homeTip: "Compare full vs empty water bottles" },
    "S8": { activities: ["Play Dough Press - Different pressure levels", "Bottle Cap Twist - Open/close various lids", "Scoop and Transfer - Use different forces"], materials: "Play dough, bottles, scoops", homeTip: "Let them knead dough or open jars" },
    "S9": { activities: ["Balance Beam - Walk on line", "Spinning Game - Spin and stop", "Rocking Chair - Gentle rocking"], materials: "Tape for line, chair", homeTip: "Play gentle swinging games" },
    "S10": { activities: ["Sensory Bin Exploration", "Music and Movement", "Art with Music"], materials: "Sensory bin, music player", homeTip: "Combine listening with touching activities" },
    "A1": { activities: ["Color Hunt - Find colors in room", "Color Sorting - Sort objects by color", "Color Match - Match colored cards"], materials: "Colored cards, toys", homeTip: "Name colors of fruits and vegetables" },
    "A2": { activities: ["Count the Objects", "Number Song - Sing counting rhymes", "Finger Counting"], materials: "Counters, blocks", homeTip: "Count stairs, spoons, fruits daily" },
    "A3": { activities: ["Sand Tray Writing - Write letters in sand", "Letter Hunt - Find A,B,C in classroom", "Letter Song - Sing alphabet song"], materials: "Sand tray, letter cards", homeTip: "Write letters on flour/semolina" },
    "A4": { activities: ["Shape Sorting - Sort by shape", "Shape Hunt - Find shapes in room", "Play Dough Shapes - Make shapes"], materials: "Shape blocks, play dough", homeTip: "Point to round/square things at home" },
    "A5": { activities: ["Name Card Match - Match name to picture", "Name Tracing - Trace own name", "Name Puzzle - Arrange name letters"], materials: "Name cards, sand tray", homeTip: "Display child's name on their things" },
    "A6": { activities: ["Number Match - Match number to quantity", "Number Hunt - Find numbers 1-5", "Dot to Dot - Connect numbers"], materials: "Number cards, counters", homeTip: "Point to house/phone numbers" },
    "A7": { activities: ["Memory Match - Match pairs", "Object to Picture Match", "Same/Different Game"], materials: "Matching cards, objects", homeTip: "Match socks or shoes at home" },
    "A8": { activities: ["Size Sort - Small to big", "Story Sequence - Arrange picture order", "Number Line - Arrange numbers"], materials: "Size varied objects, picture cards", homeTip: "Arrange spoons by size" },
    "A9": { activities: ["Opposite Cards - Match opposites", "Inside/Outside Game", "Big/Small Sort"], materials: "Opposite cards, boxes", homeTip: "Use 'in/out', 'up/down' in daily talk" },
    "A10": { activities: ["Two-Step Commands - First X then Y", "Simon Says Game", "Obstacle Course with steps"], materials: "None", homeTip: "Give simple two-step instructions at home" }
};

// ============================================================
// GLOBAL VARIABLES
// ============================================================

let students = [];
let currentChecklistData = {};
let analysisData = null;
let classChart = null;
let skillsChart = null;
let currentReactions = {};

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================

function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let icon = "ℹ️";
    if (type === "success") icon = "✅";
    if (type === "error") icon = "❌";
    if (type === "warning") icon = "⚠️";
    
    toast.innerHTML = `${icon} ${message}`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(100%)";
        toast.style.transition = "all 0.3s ease";
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ============================================================
// STATS & DASHBOARD
// ============================================================

async function updateDashboard() {
    try {
        const stats = await getStats();
        
        document.getElementById('statUsage').textContent = stats.usage || 0;
        document.getElementById('statViews').textContent = stats.views || 0;
        document.getElementById('statShares').textContent = stats.shares || 0;
        document.getElementById('statReactions').textContent = stats.reactions ? 
            Object.values(stats.reactions).reduce((a,b) => a + b, 0) : 0;
        
        // Update reactions UI
        if (stats.reactions) {
            currentReactions = stats.reactions;
            Object.keys(stats.reactions).forEach(key => {
                const el = document.getElementById(`reaction-${key}`);
                if (el) el.textContent = stats.reactions[key];
            });
        }
        
        // Update total usage in footer
        document.getElementById('totalUsageCount').textContent = stats.usage || 0;
        
    } catch (error) {
        console.warn('Dashboard update failed:', error);
        // Load from localStorage
        loadLocalStats();
    }
}

function loadLocalStats() {
    const usage = getLocalUsage();
    const views = getLocalViews();
    const shares = getLocalShares();
    const reactions = getLocalReactions();
    
    document.getElementById('statUsage').textContent = usage;
    document.getElementById('statViews').textContent = views;
    document.getElementById('statShares').textContent = shares;
    document.getElementById('statReactions').textContent = Object.values(reactions).reduce((a,b) => a+b, 0);
    document.getElementById('totalUsageCount').textContent = usage;
    
    Object.keys(reactions).forEach(key => {
        const el = document.getElementById(`reaction-${key}`);
        if (el) el.textContent = reactions[key];
    });
}

// ============================================================
// REACTIONS
// ============================================================

async function handleReaction(reactionType) {
    try {
        const result = await recordReaction(reactionType);
        
        if (result && result.reactions) {
            currentReactions = result.reactions;
            Object.keys(result.reactions).forEach(key => {
                const el = document.getElementById(`reaction-${key}`);
                if (el) el.textContent = result.reactions[key];
            });
            // Update total reactions
            const total = Object.values(result.reactions).reduce((a,b) => a+b, 0);
            document.getElementById('statReactions').textContent = total;
            showToast(`You reacted with ${getReactionEmoji(reactionType)}`, "success");
        }
    } catch (error) {
        console.warn('Reaction failed:', error);
        // Local fallback
        const reactions = incrementLocalReaction(reactionType);
        const el = document.getElementById(`reaction-${reactionType}`);
        if (el) el.textContent = reactions[reactionType] || 0;
        const total = Object.values(reactions).reduce((a,b) => a+b, 0);
        document.getElementById('statReactions').textContent = total;
        showToast(`You reacted with ${getReactionEmoji(reactionType)} (saved locally)`, "info");
    }
}

function getReactionEmoji(type) {
    const map = {
        'like': '👍', 'love': '❤️', 'wow': '😮', 
        'sad': '😢', 'laugh': '😂', 'celebrate': '🎉', 'think': '🤔'
    };
    return map[type] || '👍';
}

// ============================================================
// SHARE FUNCTIONS
// ============================================================

async function handleShare(platform) {
    const url = window.location.href;
    const text = `Check out this amazing Sensory Play Tracker for ECCE teachers! 🧠`;
    
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            break;
        case 'whatsapp':
            shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
        case 'copy':
            try {
                await navigator.clipboard.writeText(url);
                showToast('Link copied to clipboard!', 'success');
                await recordShare('copy');
                await updateDashboard();
                return;
            } catch {
                // Fallback
                const textarea = document.createElement('textarea');
                textarea.value = url;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                showToast('Link copied to clipboard!', 'success');
                await recordShare('copy');
                await updateDashboard();
                return;
            }
        default:
            return;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=500');
        await recordShare(platform);
        await updateDashboard();
        showToast(`Shared on ${platform}!`, 'success');
    }
}

// ============================================================
// SCROLL BUTTONS
// ============================================================

function setupScrollButtons() {
    const scrollUpBtn = document.getElementById("scrollUpBtn");
    const scrollDownBtn = document.getElementById("scrollDownBtn");
    
    if (!scrollUpBtn || !scrollDownBtn) return;
    
    window.addEventListener("scroll", () => {
        if (window.scrollY > 200) {
            scrollUpBtn.classList.add("show");
        } else {
            scrollUpBtn.classList.remove("show");
        }
    });
    
    scrollUpBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
    
    scrollDownBtn.addEventListener("click", () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    });
}

// ============================================================
// TAB MANAGEMENT
// ============================================================

function setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });
}

// ============================================================
// TAB 1: STUDENT PROFILES
// ============================================================

function loadStudents() {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.STUDENTS);
    if (saved) {
        students = JSON.parse(saved);
    }
    renderStudentsList();
}

function saveStudents() {
    localStorage.setItem(CONFIG.STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    renderStudentsList();
}

function renderStudentsList() {
    const container = document.getElementById('studentsList');
    if (!container) return;
    
    if (students.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:var(--text-muted);">No students added yet. Add your first student above.</p>';
        return;
    }
    
    container.innerHTML = students.map(student => `
        <div class="student-card">
            <div class="student-info">
                <h4>${escapeHtml(student.name)}</h4>
                <p>Roll No: ${student.rollNo} | WhatsApp: ${student.whatsapp}</p>
            </div>
            <div class="student-actions">
                <button class="icon-btn edit" onclick="editStudent('${student.id}')" aria-label="Edit student">✏️</button>
                <button class="icon-btn delete" onclick="deleteStudent('${student.id}')" aria-label="Delete student">🗑️</button>
            </div>
        </div>
    `).join('');
}

function addStudent() {
    const name = document.getElementById('studentName').value.trim();
    const rollNo = document.getElementById('studentRollNo').value.trim();
    const whatsapp = document.getElementById('studentWhatsapp').value.trim();
    
    if (!name || !rollNo) {
        showToast("Please enter student name and roll number", "error");
        return;
    }
    
    const newStudent = {
        id: Date.now().toString(),
        name: name,
        rollNo: rollNo,
        whatsapp: whatsapp || 'Not provided'
    };
    
    students.push(newStudent);
    saveStudents();
    
    document.getElementById('studentName').value = '';
    document.getElementById('studentRollNo').value = '';
    document.getElementById('studentWhatsapp').value = '';
    
    showToast(`Student ${name} added successfully!`, "success");
}

function editStudent(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;
    
    const newName = prompt('Edit Student Name:', student.name);
    const newRollNo = prompt('Edit Roll Number:', student.rollNo);
    const newWhatsapp = prompt('Edit WhatsApp Number:', student.whatsapp);
    
    if (newName) student.name = newName;
    if (newRollNo) student.rollNo = newRollNo;
    if (newWhatsapp) student.whatsapp = newWhatsapp;
    
    saveStudents();
    showToast("Student updated successfully!", "success");
}

function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        students = students.filter(s => s.id !== id);
        saveStudents();
        showToast("Student deleted successfully!", "success");
    }
}

function saveClassName() {
    const className = document.getElementById('className').value;
    localStorage.setItem(CONFIG.STORAGE_KEYS.CLASS_NAME, className);
    showToast("Class name saved!", "success");
}

function exportStudents() {
    const data = {
        students: students,
        className: localStorage.getItem(CONFIG.STORAGE_KEYS.CLASS_NAME)
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sensory_students_backup.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast("Students exported successfully!", "success");
}

function importStudents() {
    document.getElementById('importFileInput').click();
}

// ============================================================
// TAB 2: DAILY CHECKLIST
// ============================================================

function loadChecklistForDate() {
    const date = document.getElementById('checklistDate').value;
    if (!date) return;
    
    const saved = localStorage.getItem(`${CONFIG.STORAGE_KEYS.CHECKLISTS}_${date}`);
    if (saved) {
        currentChecklistData = JSON.parse(saved);
    } else {
        currentChecklistData = {};
        students.forEach(student => {
            currentChecklistData[student.id] = {
                present: true,
                skills: {}
            };
            ALL_SKILLS.forEach(skill => {
                currentChecklistData[student.id].skills[skill.id] = 0;
            });
        });
    }
    
    renderChecklistUI();
}

function renderChecklistUI() {
    const container = document.getElementById('checklistContainer');
    if (!container) return;
    
    if (students.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:var(--text-muted);">No students found. Please add students in Tab 1 first.</p>';
        return;
    }
    
    container.innerHTML = students.map(student => {
        const data = currentChecklistData[student.id] || { present: true, skills: {} };
        
        return `
            <div class="checklist-student">
                <div class="checklist-header">
                    <h4>${escapeHtml(student.name)} (Roll: ${student.rollNo})</h4>
                    <div class="attendance-badge">
                        <label>
                            <input type="checkbox" class="attendance-check" data-id="${student.id}" ${data.present ? 'checked' : ''}>
                            ✅ Present
                        </label>
                    </div>
                </div>
                <div class="skills-grid">
                    ${ALL_SKILLS.map(skill => `
                        <div class="skill-item">
                            <span class="skill-name" title="${skill.indicator}">${skill.id}: ${skill.name}</span>
                            <div class="skill-buttons">
                                <button class="skill-btn yes ${data.skills[skill.id] === 1 ? 'active-yes' : ''}" data-student="${student.id}" data-skill="${skill.id}" data-value="1">✓ 1</button>
                                <button class="skill-btn no ${data.skills[skill.id] === 0 ? 'active-no' : ''}" data-student="${student.id}" data-skill="${skill.id}" data-value="0">✗ 0</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
    
    // Event listeners
    document.querySelectorAll('.attendance-check').forEach(cb => {
        cb.addEventListener('change', (e) => {
            const studentId = e.target.dataset.id;
            if (currentChecklistData[studentId]) {
                currentChecklistData[studentId].present = e.target.checked;
            }
        });
    });
    
    document.querySelectorAll('.skill-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const studentId = btn.dataset.student;
            const skillId = btn.dataset.skill;
            const value = parseInt(btn.dataset.value);
            
            if (currentChecklistData[studentId]) {
                currentChecklistData[studentId].skills[skillId] = value;
            }
            
            const parent = btn.parentElement;
            parent.querySelectorAll('.skill-btn').forEach(b => {
                b.classList.remove('active-yes', 'active-no');
            });
            btn.classList.add(value === 1 ? 'active-yes' : 'active-no');
        });
    });
}

function saveChecklist() {
    const date = document.getElementById('checklistDate').value;
    if (!date) {
        showToast("Please select a date", "error");
        return;
    }
    
    localStorage.setItem(`${CONFIG.STORAGE_KEYS.CHECKLISTS}_${date}`, JSON.stringify(currentChecklistData));
    showToast(`Checklist saved for ${date}!`, "success");
}

function exportToTxt() {
    const date = document.getElementById('checklistDate').value;
    if (!date) {
        showToast("Please select a date", "error");
        return;
    }
    
    let content = `SENSORY PLAY CHECKLIST\n`;
    content += `Date: ${date}\n`;
    content += `Class: ${localStorage.getItem(CONFIG.STORAGE_KEYS.CLASS_NAME) || 'Not set'}\n`;
    content += `Total Students: ${students.length}\n`;
    content += `Present Students: ${Object.values(currentChecklistData).filter(d => d.present).length}\n`;
    content += `\n${'='.repeat(60)}\n\n`;
    
    students.forEach(student => {
        const data = currentChecklistData[student.id];
        if (!data) return;
        
        content += `Student: ${student.name} (${student.rollNo})\n`;
        content += `Attendance: ${data.present ? 'PRESENT' : 'ABSENT'}\n`;
        
        if (data.present) {
            SENSORY_SKILLS.forEach(skill => {
                const val = data.skills[skill.id] || 0;
                content += `  ${skill.id}: ${skill.name} → ${val}\n`;
            });
            ACADEMIC_SKILLS.forEach(skill => {
                const val = data.skills[skill.id] || 0;
                content += `  ${skill.id}: ${skill.name} → ${val}\n`;
            });
        }
        content += `\n${'-'.repeat(40)}\n\n`;
    });
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sensory_checklist_${date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported successfully!", "success");
}

// ============================================================
// TAB 3: ANALYSIS
// ============================================================

function analyzeFiles(files) {
    showToast("Analyzing files...", "info");
    
    const filePromises = Array.from(files).map(file => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve({ name: file.name, content: e.target.result });
            reader.readAsText(file);
        });
    });
    
    Promise.all(filePromises).then(results => {
        const weeklyData = {};
        let totalDays = 0;
        
        results.forEach(result => {
            const lines = result.content.split('\n');
            let currentStudent = null;
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                
                if (line.startsWith('Student:')) {
                    const match = line.match(/Student: (.+?) \(/);
                    if (match) {
                        const studentName = match[1];
                        const student = students.find(s => s.name === studentName);
                        if (student) {
                            currentStudent = student.id;
                            if (!weeklyData[currentStudent]) {
                                weeklyData[currentStudent] = {
                                    student: student,
                                    daysCount: 0,
                                    sensoryScores: {},
                                    academicScores: {}
                                };
                                ALL_SKILLS.forEach(s => {
                                    weeklyData[currentStudent].sensoryScores[s.id] = 0;
                                    weeklyData[currentStudent].academicScores[s.id] = 0;
                                });
                            }
                            weeklyData[currentStudent].daysCount++;
                            totalDays++;
                        }
                    }
                }
                
                if ((line.match(/S[0-9]+:/) || line.match(/A[0-9]+:/)) && currentStudent) {
                    const skillMatch = line.match(/(S[0-9]+|A[0-9]+):.+?→ ([01])/);
                    if (skillMatch) {
                        const skillId = skillMatch[1];
                        const value = parseInt(skillMatch[2]);
                        if (weeklyData[currentStudent]) {
                            if (skillId.startsWith('S')) {
                                weeklyData[currentStudent].sensoryScores[skillId] += value;
                            } else {
                                weeklyData[currentStudent].academicScores[skillId] += value;
                            }
                        }
                    }
                }
            }
        });
        
        // Calculate percentages
        const days = results.length || 1;
        Object.keys(weeklyData).forEach(studentId => {
            const data = weeklyData[studentId];
            Object.keys(data.sensoryScores).forEach(skillId => {
                data.sensoryScores[skillId] = Math.round((data.sensoryScores[skillId] / days) * 100);
            });
            Object.keys(data.academicScores).forEach(skillId => {
                data.academicScores[skillId] = Math.round((data.academicScores[skillId] / days) * 100);
            });
        });
        
        analysisData = weeklyData;
        renderAnalysisReports(weeklyData, days);
        showToast("Analysis complete!", "success");
    });
}

function renderAnalysisReports(data, totalDays) {
    const summaryDiv = document.getElementById('analysisSummary');
    const reportsDiv = document.getElementById('individualReports');
    const heroDiv = document.getElementById('heroOfWeek');
    
    if (!summaryDiv || !reportsDiv || !heroDiv) return;
    
    const studentScores = Object.values(data).map(d => ({
        name: d.student.name,
        sensoryAvg: Object.values(d.sensoryScores).reduce((a,b) => a+b, 0) / SENSORY_SKILLS.length,
        academicAvg: Object.values(d.academicScores).reduce((a,b) => a+b, 0) / ACADEMIC_SKILLS.length,
        totalAvg: (Object.values(d.sensoryScores).reduce((a,b) => a+b, 0) + Object.values(d.academicScores).reduce((a,b) => a+b, 0)) / (SENSORY_SKILLS.length + ACADEMIC_SKILLS.length)
    }));
    
    const classAvg = studentScores.reduce((a,b) => a + b.totalAvg, 0) / (studentScores.length || 1);
    
    summaryDiv.innerHTML = `
        <div class="report-card">
            <h3>📊 Weekly Summary</h3>
            <p>Total Days Analyzed: ${totalDays}</p>
            <p>Total Students: ${Object.keys(data).length}</p>
            <p>Class Average Score: ${classAvg.toFixed(1)}%</p>
            <p>Top Performing Student: ${studentScores.sort((a,b) => b.totalAvg - a.totalAvg)[0]?.name || 'N/A'}</p>
        </div>
    `;
    
    // Charts
    const classLabels = studentScores.map(s => s.name);
    const classScores = studentScores.map(s => s.totalAvg);
    
    if (classChart) classChart.destroy();
    if (skillsChart) skillsChart.destroy();
    
    const ctx1 = document.getElementById('classChart')?.getContext('2d');
    if (ctx1) {
        classChart = new Chart(ctx1, {
            type: 'bar',
            data: { 
                labels: classLabels.length ? classLabels : ['No Data'], 
                datasets: [{ 
                    label: 'Overall Score %', 
                    data: classLabels.length ? classScores : [0], 
                    backgroundColor: '#FF6B00',
                    borderRadius: 6
                }] 
            },
            options: { 
                responsive: true, 
                scales: { y: { max: 100, beginAtZero: true } },
                plugins: {
                    legend: { labels: { color: '#B0B0C8' } }
                }
            }
        });
    }
    
    // Skill chart
    const skillAverages = {};
    ALL_SKILLS.forEach(skill => {
        let total = 0;
        let count = 0;
        Object.values(data).forEach(studentData => {
            if (skill.id.startsWith('S')) {
                total += studentData.sensoryScores[skill.id] || 0;
            } else {
                total += studentData.academicScores[skill.id] || 0;
            }
            count++;
        });
        skillAverages[skill.id] = count > 0 ? total / count : 0;
    });
    
    const ctx2 = document.getElementById('skillsChart')?.getContext('2d');
    if (ctx2) {
        skillsChart = new Chart(ctx2, {
            type: 'radar',
            data: { 
                labels: ALL_SKILLS.map(s => `${s.id}`), 
                datasets: [{ 
                    label: 'Class Average %', 
                    data: ALL_SKILLS.map(s => skillAverages[s.id] || 0), 
                    backgroundColor: 'rgba(255,107,0,0.2)', 
                    borderColor: '#FF6B00',
                    pointBackgroundColor: '#FF6B00'
                }] 
            },
            options: { 
                responsive: true, 
                scales: { r: { max: 100, beginAtZero: true } },
                plugins: {
                    legend: { labels: { color: '#B0B0C8' } }
                }
            }
        });
    }
    
    // Individual Reports
    reportsDiv.innerHTML = Object.values(data).map(studentData => {
        const weakSkills = [];
        
        ALL_SKILLS.forEach(skill => {
            const score = skill.id.startsWith('S') ? studentData.sensoryScores[skill.id] : studentData.academicScores[skill.id];
            if (score < 60) {
                weakSkills.push({ skill, score });
            }
        });
        
        weakSkills.sort((a,b) => a.score - b.score);
        const topWeak = weakSkills.slice(0, 3);
        
        return `
            <div class="report-card">
                <h3>📄 ${escapeHtml(studentData.student.name)} (Roll: ${studentData.student.rollNo})</h3>
                <p><strong>Sensory Skills Average:</strong> ${(Object.values(studentData.sensoryScores).reduce((a,b)=>a+b,0)/SENSORY_SKILLS.length).toFixed(1)}%</p>
                <p><strong>Academic Skills Average:</strong> ${(Object.values(studentData.academicScores).reduce((a,b)=>a+b,0)/ACADEMIC_SKILLS.length).toFixed(1)}%</p>
                <p><strong>Overall Score:</strong> ${((Object.values(studentData.sensoryScores).reduce((a,b)=>a+b,0) + Object.values(studentData.academicScores).reduce((a,b)=>a+b,0)) / (SENSORY_SKILLS.length + ACADEMIC_SKILLS.length)).toFixed(1)}%</p>
                
                ${topWeak.length > 0 ? `
                    <div class="weak-skills">
                        <strong>⚠️ Weak Skills (Need Improvement):</strong>
                        ${topWeak.map(w => `<div>${w.skill.id}: ${w.skill.name} - ${w.score}%</div>`).join('')}
                    </div>
                    <div class="next-focus">
                        <strong>🎯 Next Week Focus:</strong>
                        ${topWeak.map(w => `<div>➜ ${w.skill.id}: ${w.skill.name} - ${ACTIVITY_BANK[w.skill.id]?.activities[0] || 'Practice at home'}</div>`).join('')}
                    </div>
                ` : '<div class="next-focus"><strong>🎉 Excellent! All skills above 60%</strong></div>'}
                
                ${Object.entries(studentData.sensoryScores).slice(0,5).map(([id, score]) => `
                    <div class="skill-progress">
                        <span>${id}: ${SENSORY_SKILLS.find(s=>s.id===id)?.name || id}</span>
                        <div class="progress-bar"><div class="progress-fill" style="width:${score}%"></div></div>
                    </div>
                `).join('')}
                
                ${Object.entries(studentData.academicScores).slice(0,5).map(([id, score]) => `
                    <div class="skill-progress">
                        <span>${id}: ${ACADEMIC_SKILLS.find(s=>s.id===id)?.name || id}</span>
                        <div class="progress-bar"><div class="progress-fill" style="width:${score}%"></div></div>
                    </div>
                `).join('')}
            </div>
        `;
    }).join('');
    
    // Hero
    const hero = studentScores.sort((a,b) => b.totalAvg - a.totalAvg)[0];
    if (hero) {
        heroDiv.innerHTML = `
            <div style="background:linear-gradient(135deg,rgba(255,107,0,0.15),rgba(108,92,231,0.15));border-radius:24px;padding:30px 40px;text-align:center;border:1px solid rgba(255,107,0,0.2);">
                <h2 style="font-size:2rem;font-weight:800;background:linear-gradient(135deg,#FF6B00,#FF4500);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">🏆 Hero of the Week 🏆</h2>
                <h3 style="font-size:1.5rem;color:white;margin:8px 0;">⭐ ${escapeHtml(hero.name)} ⭐</h3>
                <p style="color:var(--text-secondary);">Sensory: ${hero.sensoryAvg.toFixed(1)}% | Academic: ${hero.academicAvg.toFixed(1)}% | Overall: ${hero.totalAvg.toFixed(1)}%</p>
                <p style="color:var(--text-secondary);">🎉 Congratulations! Keep up the great work! 🎉</p>
            </div>
        `;
    }
    
    generateTeacherActionPlan(data);
}

function generateTeacherActionPlan(data) {
    const skillWeakCount = {};
    ALL_SKILLS.forEach(skill => { skillWeakCount[skill.id] = 0; });
    
    Object.values(data).forEach(studentData => {
        ALL_SKILLS.forEach(skill => {
            const score = skill.id.startsWith('S') ? studentData.sensoryScores[skill.id] : studentData.academicScores[skill.id];
            if (score < 60) skillWeakCount[skill.id]++;
        });
    });
    
    const topClassWeak = ALL_SKILLS.filter(skill => skillWeakCount[skill.id] > 0)
        .sort((a,b) => skillWeakCount[b.id] - skillWeakCount[a.id])
        .slice(0, 4);
    
    const actionContainer = document.getElementById('actionPlanContainer');
    if (!actionContainer) return;
    
    if (topClassWeak.length === 0) {
        actionContainer.innerHTML = `
            <div class="report-card">
                <h3>👩‍🏫 Teacher Action Plan</h3>
                <p>🎉 All skills are above 60%! Great job!</p>
                <p>Continue with enrichment activities and maintain the momentum.</p>
            </div>
        `;
        return;
    }
    
    actionContainer.innerHTML = `
        <div class="report-card">
            <h3>👩‍🏫 Teacher Action Plan - Next Week</h3>
            <p>Based on analysis of ${Object.keys(data).length} students</p>
            
            <h4 style="margin-top:15px;">🎯 Class Priority Skills:</h4>
            ${topClassWeak.map(skill => `
                <div class="activity-item">
                    <strong>${skill.id}: ${skill.name}</strong>
                    <p>📌 ${skill.indicator}</p>
                    <p>🎲 Activities: ${ACTIVITY_BANK[skill.id]?.activities.join(' | ') || 'Use sensory play activities'}</p>
                    <p>🧰 Materials: ${ACTIVITY_BANK[skill.id]?.materials || 'Common classroom items'}</p>
                    <p>🏠 Home Tip: ${ACTIVITY_BANK[skill.id]?.homeTip || 'Practice with everyday objects'}</p>
                </div>
            `).join('')}
            
            <h4 style="margin-top:15px;">📅 Daily Focus Schedule:</h4>
            ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, i) => `
                <div class="activity-item">
                    <strong>${day}:</strong> ${topClassWeak[i]?.id || 'Review'} - ${topClassWeak[i]?.name || 'All skills'}
                </div>
            `).join('')}
        </div>
    `;
}

// ============================================================
// TAB 4: PARENTS
// ============================================================

function renderParentList() {
    const container = document.getElementById('parentList');
    if (!container) return;
    
    if (!analysisData) {
        container.innerHTML = '<p style="text-align:center; color:var(--text-muted);">Please analyze data in Tab 3 first.</p>';
        return;
    }
    
    container.innerHTML = Object.values(analysisData).map(studentData => {
        const sensoryAvg = Object.values(studentData.sensoryScores).reduce((a,b)=>a+b,0) / SENSORY_SKILLS.length;
        const academicAvg = Object.values(studentData.academicScores).reduce((a,b)=>a+b,0) / ACADEMIC_SKILLS.length;
        const overall = (sensoryAvg + academicAvg) / 2;
        
        const weakSkills = [];
        ALL_SKILLS.forEach(skill => {
            const score = skill.id.startsWith('S') ? studentData.sensoryScores[skill.id] : studentData.academicScores[skill.id];
            if (score < 60) weakSkills.push(`${skill.id}: ${skill.name}`);
        });
        
        const message = `Hello! Here is ${studentData.student.name}'s weekly report:\n\nOverall: ${overall.toFixed(1)}%\nSensory: ${sensoryAvg.toFixed(1)}%\nAcademic: ${academicAvg.toFixed(1)}%\n\nWeak areas: ${weakSkills.slice(0,3).join(', ') || 'None! Great job!'}\n\nNext week focus: ${weakSkills.slice(0,3).map(s => s.split(':')[0]).join(', ') || 'Maintain current level'}\n\n- Sensory Play Tracker`;
        
        const whatsappUrl = studentData.student.whatsapp !== 'Not provided' 
            ? `https://wa.me/${studentData.student.whatsapp}?text=${encodeURIComponent(message)}`
            : '#';
        
        return `
            <div class="parent-item">
                <div>
                    <strong>${escapeHtml(studentData.student.name)}</strong><br>
                    <small>${studentData.student.whatsapp}</small>
                </div>
                ${studentData.student.whatsapp !== 'Not provided' 
                    ? `<a href="${whatsappUrl}" target="_blank" class="btn btn-outline" style="padding:8px 15px;">📱 Send</a>`
                    : '<span style="color:var(--text-muted);">No WhatsApp</span>'}
            </div>
        `;
    }).join('');
}

function sendToAllParents() {
    if (!analysisData) {
        showToast("Please analyze data in Tab 3 first.", "error");
        return;
    }
    
    let count = 0;
    Object.values(analysisData).forEach(studentData => {
        if (studentData.student.whatsapp !== 'Not provided') {
            const sensoryAvg = Object.values(studentData.sensoryScores).reduce((a,b)=>a+b,0) / SENSORY_SKILLS.length;
            const academicAvg = Object.values(studentData.academicScores).reduce((a,b)=>a+b,0) / ACADEMIC_SKILLS.length;
            const overall = (sensoryAvg + academicAvg) / 2;
            
            const message = `Hello! Here is ${studentData.student.name}'s weekly report:\n\nOverall: ${overall.toFixed(1)}%\nSensory: ${sensoryAvg.toFixed(1)}%\nAcademic: ${academicAvg.toFixed(1)}%\n\n- Sensory Play Tracker`;
            const url = `https://wa.me/${studentData.student.whatsapp}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
            count++;
        }
    });
    
    showToast(`Opened WhatsApp for ${count} parents.`, "success");
}

// ============================================================
// UTILITIES
// ============================================================

function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function printActionPlan() {
    const content = document.getElementById('actionPlanContainer')?.innerHTML;
    if (!content) {
        showToast("No action plan to print", "error");
        return;
    }
    
    const win = window.open('', '_blank');
    if (!win) return;
    
    win.document.write(`
        <html>
            <head>
                <title>Teacher Action Plan</title>
                <style>
                    body{font-family:Arial,sans-serif;padding:30px;background:#f5f5f5;color:#333;}
                    .report-card{background:white;border-radius:12px;padding:24px;margin-bottom:16px;box-shadow:0 2px 10px rgba(0,0,0,0.1);}
                    .activity-item{background:#f9f9f9;padding:12px 16px;margin:8px 0;border-radius:8px;border-left:4px solid #FF6B00;}
                    h3{color:#FF6B00;}
                    h4{margin-top:20px;color:#333;}
                    p{margin:4px 0;}
                    strong{color:#FF6B00;}
                </style>
            </head>
            <body>
                <h1>📋 Teacher Action Plan</h1>
                ${content}
                <p style="margin-top:30px;color:#999;text-align:center;">Generated by Sensory Play Tracker</p>
            </body>
        </html>
    `);
    win.document.close();
    setTimeout(() => win.print(), 500);
    showToast("Opening print dialog...", "info");
}

// ============================================================
// RESET ANALYSIS
// ============================================================

function resetAnalysis() {
    analysisData = null;
    document.getElementById('analysisSummary').innerHTML = '';
    document.getElementById('individualReports').innerHTML = '';
    document.getElementById('heroOfWeek').innerHTML = '';
    document.getElementById('actionPlanContainer').innerHTML = '';
    if (classChart) { classChart.destroy(); classChart = null; }
    if (skillsChart) { skillsChart.destroy(); skillsChart = null; }
    showToast("Analysis cleared!", "info");
}

// ============================================================
// EVENT LISTENERS
// ============================================================

function setupEventListeners() {
    // Add Student
    document.getElementById('addStudentBtn')?.addEventListener('click', addStudent);
    
    // Save Class
    document.getElementById('saveClassBtn')?.addEventListener('click', saveClassName);
    
    // Export/Import
    document.getElementById('exportStudentsBtn')?.addEventListener('click', exportStudents);
    document.getElementById('importStudentsBtn')?.addEventListener('click', importStudents);
    document.getElementById('importFileInput')?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (data.students) students = data.students;
                if (data.className) document.getElementById('className').value = data.className;
                saveStudents();
                showToast("Import successful!", "success");
            } catch (err) {
                showToast("Invalid file format", "error");
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    });
    
    // Checklist
    document.getElementById('loadChecklistBtn')?.addEventListener('click', loadChecklistForDate);
    document.getElementById('saveChecklistBtn')?.addEventListener('click', saveChecklist);
    document.getElementById('exportTxtBtn')?.addEventListener('click', exportToTxt);
    
    // Analysis
    document.getElementById('analyzeBtn')?.addEventListener('click', () => {
        const files = document.getElementById('fileUpload').files;
        if (files.length === 0) {
            showToast("Please select TXT files to analyze", "error");
            return;
        }
        analyzeFiles(files);
    });
    document.getElementById('resetAnalysisBtn')?.addEventListener('click', resetAnalysis);
    
    // Parents
    document.getElementById('sendAllBtn')?.addEventListener('click', sendToAllParents);
    
    // Action Plan
    document.getElementById('printActionPlanBtn')?.addEventListener('click', printActionPlan);
    
    // Reactions
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const reaction = btn.dataset.reaction;
            if (reaction) handleReaction(reaction);
        });
    });
    
    // Share
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.dataset.share;
            if (platform) handleShare(platform);
        });
    });
    
    // Page Share
    document.getElementById('sharePageBtn')?.addEventListener('click', () => {
        handleShare('copy');
    });
}

// ============================================================
// INITIALIZATION
// ============================================================

async function init() {
    try {
        // Load students
        loadStudents();
        
        // Load class name
        const savedClass = localStorage.getItem(CONFIG.STORAGE_KEYS.CLASS_NAME);
        if (savedClass) {
            document.getElementById('className').value = savedClass;
        }
        
        // Set default date
        const dateInput = document.getElementById('checklistDate');
        if (dateInput) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }
        
        // Load checklist
        loadChecklistForDate();
        
        // Setup UI
        setupScrollButtons();
        setupTabs();
        setupEventListeners();
        
        // Record usage and update stats
        await recordUsage();
        await updateDashboard();
        
        // Render parent list if analysis exists
        renderParentList();
        
        showToast("Welcome to Sensory Play Tracker! 🧠", "success");
        
    } catch (error) {
        console.error('Initialization error:', error);
        showToast("Error loading app. Please refresh.", "error");
    }
}

// ============================================================
// START APP
// ============================================================

// Make functions globally accessible
window.addStudent = addStudent;
window.editStudent = editStudent;
window.deleteStudent = deleteStudent;
window.handleReaction = handleReaction;
window.handleShare = handleShare;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
