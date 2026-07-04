// ============================================================
// CONFIGURATION
// ============================================================
const CONFIG = {
    API_BASE: 'https://magicrills-api.uzairhameed01.workers.dev',
    API_KEY: 'magicrills-grok-api.uzairhameed01.workers.dev',
    TOOL_SLUG: 'social-emotional-development-ecce',
    TOOL_NAME: 'Social & Emotional Development Tracker'
};

// ============================================================
// SEL INDICATORS (10 skills)
// ============================================================
const SEL_INDICATORS = [
    "Identifies own emotions",
    "Shows empathy towards peers",
    "Takes turns & shares",
    "Follows classroom rules",
    "Expresses needs verbally",
    "Manages anger/frustration",
    "Makes friends easily",
    "Shows confidence in activities",
    "Respects personal space",
    "Seeks help when needed"
];

// ============================================================
// 7 EMOJIS FOR REACTIONS
// ============================================================
const REACTIONS = [
    { emoji: '👍', name: 'like', label: 'Like' },
    { emoji: '❤️', name: 'love', label: 'Love' },
    { emoji: '😮', name: 'wow', label: 'Wow' },
    { emoji: '😢', name: 'sad', label: 'Sad' },
    { emoji: '😠', name: 'angry', label: 'Angry' },
    { emoji: '😂', name: 'laugh', label: 'Laugh' },
    { emoji: '🎉', name: 'celebrate', label: 'Celebrate' }
];

// ============================================================
// GLOBAL DATA STORAGE
// ============================================================
let students = [];
let currentChecklistData = {};
let stepUsage = { step1: 0, step2: 0, step3: 0, step4: 0, step5: 0 };
let toolReactions = { step1: {}, step2: {}, step3: {}, step4: {}, step5: {} };
let toolShares = { step1: {}, step2: {}, step3: {}, step4: {}, step5: {} };
let currentUser = null;
let lastAnalysis = null;
let hero = null;

// ============================================================
// TYPEWRITER ANIMATION
// ============================================================
const typewriterPhrases = [
    "Track 10 SEL indicators daily 📊",
    "Analyze weekly student progress 📈",
    "AI-powered teacher plans 🤖",
    "Send reports to parents 📱",
    "Build emotional intelligence 🧠",
    "Foster social skills ❤️",
    "Empower every child 🌟"
];

let typewriterIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typewriterEffect() {
    const element = document.getElementById('typewriterText');
    if (!element) return;
    
    const currentPhrase = typewriterPhrases[typewriterIndex];
    
    if (!isDeleting) {
        element.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        
        if (charIndex === currentPhrase.length) {
            isDeleting = true;
            setTimeout(typewriterEffect, 2500);
            return;
        }
        setTimeout(typewriterEffect, 80);
    } else {
        element.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        
        if (charIndex === 0) {
            isDeleting = false;
            typewriterIndex = (typewriterIndex + 1) % typewriterPhrases.length;
            setTimeout(typewriterEffect, 500);
            return;
        }
        setTimeout(typewriterEffect, 40);
    }
}

// ============================================================
// API HELPER FUNCTIONS
// ============================================================
async function callAPI(endpoint, method = 'GET', data = null) {
    const url = `${CONFIG.API_BASE}${endpoint}`;
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': CONFIG.API_KEY
        }
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.warn('API call failed, using localStorage fallback:', error);
        return null;
    }
}

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '';
    switch(type) {
        case 'success': icon = '<i class="fas fa-check-circle"></i>'; break;
        case 'error': icon = '<i class="fas fa-exclamation-circle"></i>'; break;
        case 'info': icon = '<i class="fas fa-info-circle"></i>'; break;
        case 'warning': icon = '<i class="fas fa-exclamation-triangle"></i>'; break;
        default: icon = '<i class="fas fa-bell"></i>';
    }
    
    toast.innerHTML = `${icon}<span>${message}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================================
// USER ID MANAGEMENT
// ============================================================
function getUserId() {
    let userId = localStorage.getItem('sel_user_id');
    if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('sel_user_id', userId);
    }
    return userId;
}

// ============================================================
// STEP NAVIGATION
// ============================================================
function showStep(stepNumber) {
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const targetStep = document.getElementById(`step${stepNumber}`);
    if (targetStep) {
        targetStep.classList.add('active');
    }
    
    document.querySelectorAll('.step-nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.dataset.step) === stepNumber) {
            btn.classList.add('active');
        }
    });
    
    localStorage.setItem('currentStep', stepNumber);
    
    if (stepNumber === 2) {
        const date = document.getElementById("checklistDate").value;
        if (date && students.length > 0) {
            loadChecklistForDate(date);
        }
    }
    
    incrementStepUsage(stepNumber);
}

function incrementStepUsage(stepNumber) {
    const stepKey = `step${stepNumber}`;
    stepUsage[stepKey] = (stepUsage[stepKey] || 0) + 1;
    localStorage.setItem('sel_step_usage', JSON.stringify(stepUsage));
    updateStepUsageDisplay(stepNumber);
    updateHeroStats();
    
    // Send to Cloudflare API
    callAPI('/api/usage', 'POST', {
        tool_slug: CONFIG.TOOL_SLUG,
        step: stepKey,
        user_id: currentUser,
        timestamp: new Date().toISOString()
    });
}

function updateStepUsageDisplay(stepNumber) {
    const countSpan = document.getElementById(`step${stepNumber}UsageCount`);
    if (countSpan) {
        countSpan.textContent = stepUsage[`step${stepNumber}`] || 0;
    }
}

function loadUsageFromStorage() {
    const saved = localStorage.getItem('sel_step_usage');
    if (saved) {
        stepUsage = JSON.parse(saved);
        for (let i = 1; i <= 5; i++) {
            updateStepUsageDisplay(i);
        }
        updateHeroStats();
    }
}

// ============================================================
// HERO STATS
// ============================================================
function updateHeroStats() {
    const totalUsage = Object.values(stepUsage).reduce((a, b) => a + b, 0);
    const totalStudents = students.length;
    const totalShares = Object.values(toolShares).reduce((sum, step) => {
        return sum + Object.values(step).reduce((s, count) => s + count, 0);
    }, 0);
    const totalReactions = Object.values(toolReactions).reduce((sum, step) => {
        return sum + Object.values(step).reduce((s, users) => s + Object.keys(users).length, 0);
    }, 0);
    
    document.getElementById('statUsage').textContent = totalUsage || 0;
    document.getElementById('statStudents').textContent = totalStudents || 0;
    document.getElementById('statShares').textContent = totalShares || 0;
    document.getElementById('statReactions').textContent = totalReactions || 0;
}

// ============================================================
// REACTIONS (7 Emojis)
// ============================================================
function addReaction(stepNumber, reactionName) {
    const userId = getUserId();
    const stepKey = `step${stepNumber}`;
    
    if (!toolReactions[stepKey]) toolReactions[stepKey] = {};
    if (!toolReactions[stepKey][reactionName]) toolReactions[stepKey][reactionName] = {};
    
    if (toolReactions[stepKey][reactionName][userId]) {
        showToast(`You already reacted with ${getReactionEmoji(reactionName)}!`, 'warning');
        return;
    }
    
    toolReactions[stepKey][reactionName][userId] = true;
    localStorage.setItem('sel_tool_reactions', JSON.stringify(toolReactions));
    
    const count = Object.keys(toolReactions[stepKey][reactionName]).length;
    updateReactionDisplay(stepNumber, reactionName, count);
    updateHeroStats();
    showToast(`${getReactionEmoji(reactionName)} Reaction added!`, 'success');
    
    // Send to Cloudflare API
    callAPI('/api/reactions', 'POST', {
        tool_slug: CONFIG.TOOL_SLUG,
        step: stepKey,
        reaction: reactionName,
        user_id: userId
    });
}

function getReactionEmoji(reactionName) {
    const reaction = REACTIONS.find(r => r.name === reactionName);
    return reaction ? reaction.emoji : '👍';
}

function updateReactionDisplay(stepNumber, reactionName, count) {
    const btn = document.querySelector(`#step${stepNumber} .reaction-btn[data-reaction="${reactionName}"]`);
    if (btn) {
        const countSpan = btn.querySelector('.reaction-count');
        if (countSpan) countSpan.textContent = count;
    }
}

function loadReactionsFromStorage() {
    const saved = localStorage.getItem('sel_tool_reactions');
    if (saved) {
        toolReactions = JSON.parse(saved);
        for (let step = 1; step <= 5; step++) {
            const stepKey = `step${step}`;
            if (toolReactions[stepKey]) {
                for (const [reactionName, users] of Object.entries(toolReactions[stepKey])) {
                    updateReactionDisplay(step, reactionName, Object.keys(users).length);
                }
            }
        }
        updateHeroStats();
    }
}

// ============================================================
// SOCIAL MEDIA SHARING
// ============================================================
function shareTool(stepNumber, stepName, platform) {
    const url = window.location.href;
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(`Check out ${stepName} on ${CONFIG.TOOL_NAME}! 🎯`);
    
    let shareUrl = '';
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=${encodedTitle}&body=Check%20out%20this%20tool%3A%20${encodedUrl}`;
            break;
        case 'copy':
            copyToClipboard(url);
            showToast('🔗 Link copied to clipboard!', 'success');
            incrementShareCount(stepNumber, platform);
            return;
        default:
            return;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        incrementShareCount(stepNumber, platform);
        showToast(`📤 Shared ${stepName} on ${platform}!`, 'success');
    }
}

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
    } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}

function incrementShareCount(stepNumber, platform) {
    const stepKey = `step${stepNumber}`;
    if (!toolShares[stepKey]) toolShares[stepKey] = {};
    toolShares[stepKey][platform] = (toolShares[stepKey][platform] || 0) + 1;
    localStorage.setItem('sel_tool_shares', JSON.stringify(toolShares));
    updateHeroStats();
    
    callAPI('/api/shares', 'POST', {
        tool_slug: CONFIG.TOOL_SLUG,
        step: stepKey,
        platform: platform
    });
}

function loadSharesFromStorage() {
    const saved = localStorage.getItem('sel_tool_shares');
    if (saved) {
        toolShares = JSON.parse(saved);
        updateHeroStats();
    }
}

// ============================================================
// PAGE SHARING
// ============================================================
async function shareCurrentPage() {
    const url = window.location.href;
    copyToClipboard(url);
    showToast('🔗 Link copied to clipboard!', 'success');
    incrementPageShareCount();
}

function incrementPageShareCount() {
    let pageShares = parseInt(localStorage.getItem('sel_page_shares') || '0');
    pageShares++;
    localStorage.setItem('sel_page_shares', pageShares);
    updateHeroStats();
    
    callAPI('/api/shares', 'POST', {
        tool_slug: CONFIG.TOOL_SLUG,
        step: 'page',
        platform: 'copy'
    });
}

// ============================================================
// SCROLL BUTTONS
// ============================================================
function setupScrollButtons() {
    const scrollUpBtn = document.getElementById('scrollUpBtn');
    const scrollDownBtn = document.getElementById('scrollDownBtn');
    
    if (scrollUpBtn) {
        scrollUpBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', () => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });
    }
    
    window.addEventListener('scroll', () => {
        if (scrollUpBtn) {
            scrollUpBtn.style.display = window.scrollY > 200 ? 'flex' : 'none';
        }
    });
}

// ============================================================
// STUDENT MANAGEMENT
// ============================================================
function loadStudents() {
    const saved = localStorage.getItem("sel_students");
    if (saved) {
        students = JSON.parse(saved);
    }
    renderStudentList();
    updateHeroStats();
}

function saveStudentsToLocal() {
    localStorage.setItem("sel_students", JSON.stringify(students));
    renderStudentList();
    updateHeroStats();
    
    callAPI('/api/students', 'POST', {
        tool_slug: CONFIG.TOOL_SLUG,
        students: students
    });
}

function renderStudentList() {
    const container = document.getElementById("studentList");
    if (!container) return;
    
    if (students.length === 0) {
        container.innerHTML = "<div class='empty-state'>No students added yet. Add your class above.</div>";
        return;
    }
    
    container.innerHTML = students.map((s, idx) => `
        <div class="student-tag">
            👧 ${escapeHtml(s.name)} | ${s.age} | 📱 ${s.parentWhatsapp}
            <button onclick="removeStudent(${idx})" aria-label="Remove student">❌</button>
        </div>
    `).join("");
}

window.removeStudent = function(idx) {
    if (confirm(`Remove ${students[idx].name}?`)) {
        students.splice(idx, 1);
        saveStudentsToLocal();
        showToast('Student removed successfully', 'info');
    }
};

// Add student
document.getElementById("addStudentBtn")?.addEventListener("click", () => {
    const name = document.getElementById("studentName").value.trim();
    const age = document.getElementById("studentAge").value.trim();
    const whatsapp = document.getElementById("studentParentWhatsapp").value.trim();
    
    if (!name || !age || !whatsapp) {
        showToast("Please fill all fields: Name, Age, Parent WhatsApp", "error");
        return;
    }
    
    if (!/^\d+$/.test(whatsapp)) {
        showToast("WhatsApp number should contain only digits (e.g., 923001234567)", "error");
        return;
    }
    
    students.push({
        id: Date.now() + Math.random(),
        name: name,
        age: age,
        parentWhatsapp: whatsapp
    });
    
    document.getElementById("studentName").value = "";
    document.getElementById("studentAge").value = "";
    document.getElementById("studentParentWhatsapp").value = "";
    
    saveStudentsToLocal();
    showToast(`${name} added successfully!`, "success");
});

document.getElementById("saveAllStudentsBtn")?.addEventListener("click", () => {
    saveStudentsToLocal();
    showToast("All students saved permanently!", "success");
});

document.getElementById("clearAllStudentsBtn")?.addEventListener("click", () => {
    if (confirm("⚠️ This will delete ALL students. Are you sure?")) {
        students = [];
        saveStudentsToLocal();
        showToast("All students cleared.", "info");
    }
});

// ============================================================
// STEP 2: DAILY CHECKLIST
// ============================================================
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function loadChecklistForDate(date) {
    if (!date) {
        date = document.getElementById("checklistDate").value;
    }
    if (!date) return;
    
    const storageKey = `sel_checklist_${date}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
        currentChecklistData = JSON.parse(saved);
    } else {
        currentChecklistData = {};
        students.forEach(s => {
            currentChecklistData[s.id] = {
                present: true,
                scores: new Array(10).fill(0)
            };
        });
    }
    
    renderDailyChecklist();
}

function renderDailyChecklist() {
    const container = document.getElementById("dailyChecklistContainer");
    if (!container) return;
    
    if (students.length === 0) {
        container.innerHTML = "<div class='empty-state'>⚠️ No students found. Please add students in Step 1 first.</div>";
        return;
    }
    
    let html = `<table class="checklist-table">
        <thead>
            <tr><th>Student Name</th><th>Present</th>`;
    for (let i = 1; i <= 10; i++) {
        html += `<th>${i}</th>`;
    }
    html += `</tr>
        </thead>
        <tbody>`;
    
    students.forEach(student => {
        const data = currentChecklistData[student.id] || { present: true, scores: new Array(10).fill(0) };
        html += `<tr>
            <td class="student-name-cell">👧 ${escapeHtml(student.name)}</td>
            <td style="text-align:center"><input type="checkbox" class="attendance-check" data-id="${student.id}" ${data.present ? 'checked' : ''}></td>`;
        
        for (let i = 0; i < 10; i++) {
            const checked = data.scores[i] === 1;
            html += `<td style="text-align:center"><input type="checkbox" class="sel-checkbox" data-id="${student.id}" data-index="${i}" ${checked ? 'checked' : ''}></td>`;
        }
        html += `</tr>`;
    });
    
    html += `</tbody>
    </table>`;
    container.innerHTML = html;
    
    document.querySelectorAll(".attendance-check").forEach(cb => {
        cb.addEventListener("change", (e) => {
            const studentId = parseFloat(e.target.dataset.id);
            if (currentChecklistData[studentId]) {
                currentChecklistData[studentId].present = e.target.checked;
            }
        });
    });
    
    document.querySelectorAll(".sel-checkbox").forEach(cb => {
        cb.addEventListener("change", (e) => {
            const studentId = parseFloat(e.target.dataset.id);
            const idx = parseInt(e.target.dataset.index);
            if (currentChecklistData[studentId]) {
                currentChecklistData[studentId].scores[idx] = e.target.checked ? 1 : 0;
            }
        });
    });
}

document.getElementById("loadChecklistBtn")?.addEventListener("click", () => {
    const date = document.getElementById("checklistDate").value;
    if (!date) {
        showToast("Please select a date first.", "error");
        return;
    }
    if (students.length === 0) {
        showToast("Please add students in Step 1 first.", "error");
        return;
    }
    loadChecklistForDate(date);
    showToast(`Checklist loaded for ${date}`, "success");
});

document.getElementById("downloadChecklistBtn")?.addEventListener("click", () => {
    const date = document.getElementById("checklistDate").value;
    if (!date) {
        showToast("Select a date first.", "error");
        return;
    }
    
    if (students.length === 0) {
        showToast("No students added.", "error");
        return;
    }
    
    const storageKey = `sel_checklist_${date}`;
    localStorage.setItem(storageKey, JSON.stringify(currentChecklistData));
    
    let content = `SEL DAILY CHECKLIST - ${date}\n`;
    content += `========================================\n\n`;
    content += `Total Students: ${students.length}\n`;
    content += `Date: ${date}\n\n`;
    content += `SEL INDICATORS (10):\n`;
    SEL_INDICATORS.forEach((ind, i) => content += `${i+1}. ${ind}\n`);
    content += `\n--- STUDENT DATA ---\n`;
    
    students.forEach(student => {
        const data = currentChecklistData[student.id];
        if (data) {
            const status = data.present ? "Present" : "Absent";
            const scoresStr = data.scores.join("");
            const total = data.scores.reduce((a,b) => a+b, 0);
            content += `${student.name}|${status}|${scoresStr}|Total:${total}/10\n`;
        }
    });
    
    const blob = new Blob([content], {type: "text/plain"});
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `sel_checklist_${date}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    
    showToast(`Checklist saved & downloaded for ${date}`, "success");
});

// ============================================================
// STEP 3: ANALYZE
// ============================================================
function parseChecklistFile(content, fileName) {
    const lines = content.split('\n');
    const dateMatch = fileName.match(/\d{4}-\d{2}-\d{2}/);
    const date = dateMatch ? dateMatch[0] : "unknown";
    
    const studentScores = {};
    
    for (let line of lines) {
        if (line.includes('|') && !line.includes('INDICATORS') && !line.includes('---')) {
            const parts = line.split('|');
            if (parts.length >= 3) {
                let name = parts[0].trim();
                const status = parts[1].trim();
                let scoresStr = parts[2].trim();
                
                if (scoresStr.includes('Total:')) {
                    scoresStr = scoresStr.split('Total:')[0];
                }
                
                const student = students.find(s => s.name.toLowerCase() === name.toLowerCase());
                if (student && scoresStr.length === 10 && /^[01]+$/.test(scoresStr)) {
                    const scores = scoresStr.split('').map(ch => ch === '1' ? 1 : 0);
                    const total = scores.reduce((a,b) => a+b, 0);
                    const percentage = (total / 10) * 100;
                    
                    if (!studentScores[student.id]) {
                        studentScores[student.id] = { dates: [], percentages: [], rawScores: [] };
                    }
                    studentScores[student.id].dates.push(date);
                    studentScores[student.id].percentages.push(percentage);
                    studentScores[student.id].rawScores.push(scores);
                }
            }
        }
    }
    return studentScores;
}

document.getElementById("analyzeBtn")?.addEventListener("click", async () => {
    const files = document.getElementById("fileUpload").files;
    if (!files || files.length === 0) {
        showToast("Please select at least one .txt file", "error");
        return;
    }
    
    if (students.length === 0) {
        showToast("No students in system. Please add students first in Step 1.", "error");
        return;
    }
    
    const allStudentData = {};
    
    for (let file of files) {
        const content = await file.text();
        const parsed = parseChecklistFile(content, file.name);
        for (let studentId in parsed) {
            if (!allStudentData[studentId]) {
                allStudentData[studentId] = { dates: [], percentages: [], allScores: [] };
            }
            allStudentData[studentId].dates.push(...parsed[studentId].dates);
            allStudentData[studentId].percentages.push(...parsed[studentId].percentages);
            allStudentData[studentId].allScores.push(...parsed[studentId].rawScores);
        }
    }
    
    const studentReports = [];
    for (let student of students) {
        const data = allStudentData[student.id];
        if (data && data.percentages.length > 0) {
            const avgPercentage = data.percentages.reduce((a,b) => a+b, 0) / data.percentages.length;
            studentReports.push({
                student: student,
                avgPercentage: avgPercentage,
                totalDays: data.percentages.length,
                percentages: data.percentages,
                allScores: data.allScores
            });
        } else {
            studentReports.push({
                student: student,
                avgPercentage: 0,
                totalDays: 0,
                percentages: [],
                allScores: []
            });
        }
    }
    
    studentReports.sort((a,b) => b.avgPercentage - a.avgPercentage);
    hero = studentReports[0];
    
    let html = `<h3 style="color:#667eea; margin-bottom:15px;">📈 Analysis Complete (${files.length} files processed)</h3>`;
    
    html += `<div class="chart-container"><canvas id="overallChart"></canvas></div>`;
    
    html += `<h4 style="margin: 20px 0 10px;">🎴 Individual Student Performance Cards</h4>`;
    html += `<div class="individual-cards">`;
    studentReports.forEach(report => {
        const isHero = hero && hero.student.id === report.student.id && report.avgPercentage > 0;
        const performanceLevel = report.avgPercentage >= 70 ? '🌟 Excellent' : report.avgPercentage >= 50 ? '👍 Developing' : '⚠️ Needs Support';
        html += `<div class="student-card ${isHero ? 'hero-card' : ''}">
            <h4>${escapeHtml(report.student.name)} ${isHero ? '🏆 HERO' : ''}</h4>
            <p><strong>Age:</strong> ${report.student.age}</p>
            <p><strong>Parent:</strong> ${report.student.parentWhatsapp}</p>
            <div class="percentage">${Math.round(report.avgPercentage)}%</div>
            <p><strong>Days Tracked:</strong> ${report.totalDays}</p>
            <p><strong>Performance:</strong> ${performanceLevel}</p>
        </div>`;
    });
    html += `</div>`;
    
    document.getElementById("analysisResults").innerHTML = html;
    
    const ctx = document.getElementById("overallChart")?.getContext("2d");
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: studentReports.map(r => r.student.name),
                datasets: [{
                    label: 'SEL Average Score (%)',
                    data: studentReports.map(r => Math.round(r.avgPercentage)),
                    backgroundColor: 'rgba(102,126,234,0.7)',
                    borderRadius: 10,
                    borderColor: '#667eea',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Weekly SEL Performance' }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: { display: true, text: 'Percentage (%)' }
                    }
                }
            }
        });
    }
    
    lastAnalysis = studentReports;
    renderParentCards();
    showToast("Analysis complete! Check the reports below.", "success");
    
    // Save to API
    callAPI('/api/analysis', 'POST', {
        tool_slug: CONFIG.TOOL_SLUG,
        students: studentReports.map(r => ({
            name: r.student.name,
            score: Math.round(r.avgPercentage),
            days: r.totalDays
        }))
    });
});

// ============================================================
// STEP 4: SEND TO PARENTS
// ============================================================
function renderParentCards() {
    const container = document.getElementById("parentCardsList");
    if (!lastAnalysis || lastAnalysis.length === 0) {
        container.innerHTML = "<div class='empty-state'>👉 First, complete Step 3 (Analyze Reports) to see parent cards.</div>";
        return;
    }
    
    const weakStudents = lastAnalysis.filter(r => r.avgPercentage < 60);
    
    container.innerHTML = lastAnalysis.map(report => {
        const performanceMsg = report.avgPercentage >= 70 ? "Excellent progress! 🌟" : 
                               report.avgPercentage >= 50 ? "Good, can improve 📈" : 
                               "Needs extra support and practice ⚠️";
        
        const message = `📊 *SEL Weekly Report - ${report.student.name}*\n\n` +
                        `🎯 Overall Score: ${Math.round(report.avgPercentage)}%\n` +
                        `📈 Performance: ${performanceMsg}\n\n` +
                        `✅ *Strengths:* ${report.avgPercentage >= 60 ? 'Good emotional awareness and social skills' : 'Working on basic emotion identification'}\n` +
                        `🎯 *Next Week Focus:* ${report.avgPercentage < 60 ? 'Identifying emotions, sharing, and turn-taking' : 'Building confidence and leadership'}\n\n` +
                        `👩‍🏫 Keep encouraging your child at home! 💪`;
        
        const encodedMsg = encodeURIComponent(message);
        const whatsappLink = `https://wa.me/${report.student.parentWhatsapp}?text=${encodedMsg}`;
        
        return `<div class="parent-item">
            <span><strong>👧 ${escapeHtml(report.student.name)}</strong><br><small>📱 ${report.student.parentWhatsapp}</small></span>
            <span style="font-weight:bold; color:${report.avgPercentage >= 70 ? '#4caf50' : report.avgPercentage >= 50 ? '#ff9800' : '#f44336'}">${Math.round(report.avgPercentage)}%</span>
            <a href="${whatsappLink}" target="_blank" rel="noopener">📲 Send Report</a>
        </div>`;
    }).join("");
    
    container.innerHTML = `<div style="background:#f0f7ff; padding:12px; border-radius:12px; margin-bottom:15px;">
        <strong>📊 Class Summary:</strong> ${lastAnalysis.length} students | 
        ⚠️ Needs Support: ${weakStudents.length}
    </div>` + container.innerHTML;
}

document.getElementById("sendAllToParentsBtn")?.addEventListener("click", () => {
    renderParentCards();
    showToast("Parent report cards are ready! Click 'Send Report' next to each student.", "info");
});

// ============================================================
// STEP 5: TEACHER PLAN WITH AI
// ============================================================
document.getElementById("generateTeacherPlanBtn")?.addEventListener("click", async () => {
    if (!lastAnalysis || lastAnalysis.length === 0) {
        showToast("Please analyze data first (Step 3 - upload files and click Analyze).", "error");
        return;
    }
    
    const weakStudents = lastAnalysis.filter(r => r.avgPercentage < 60);
    const mediumStudents = lastAnalysis.filter(r => r.avgPercentage >= 60 && r.avgPercentage < 80);
    const strongStudents = lastAnalysis.filter(r => r.avgPercentage >= 80);
    
    let html = `<h3 style="color:#667eea;">🎯 AI-Generated Teacher Action Plan</h3>`;
    html += `<div style="display:flex; gap:15px; flex-wrap:wrap; margin-bottom:20px;">
        <div style="background:#ffebee; padding:12px; border-radius:12px; flex:1; text-align:center;">
            <strong>⚠️ Need Support</strong><br>
            <span style="font-size:1.8rem; font-weight:bold; color:#f44336;">${weakStudents.length}</span>
        </div>
        <div style="background:#fff3e0; padding:12px; border-radius:12px; flex:1; text-align:center;">
            <strong>📈 Developing</strong><br>
            <span style="font-size:1.8rem; font-weight:bold; color:#ff9800;">${mediumStudents.length}</span>
        </div>
        <div style="background:#e8f5e9; padding:12px; border-radius:12px; flex:1; text-align:center;">
            <strong>🌟 Strong</strong><br>
            <span style="font-size:1.8rem; font-weight:bold; color:#4caf50;">${strongStudents.length}</span>
        </div>
    </div>`;
    
    // Try to get AI-generated plan from API
    let aiPlan = null;
    try {
        const response = await callAPI('/api/ai-plan', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            weak_students: weakStudents.map(s => ({ name: s.student.name, score: Math.round(s.avgPercentage) })),
            total_students: lastAnalysis.length,
            weak_count: weakStudents.length
        });
        if (response && response.plan) {
            aiPlan = response.plan;
        }
    } catch (error) {
        console.warn('AI plan API failed, using fallback:', error);
    }
    
    if (aiPlan) {
        html += `<div class="ai-generated-plan" style="background:linear-gradient(135deg,#f0f7ff,#e8f0fe);padding:20px;border-radius:16px;margin:15px 0;border:2px solid #667eea;">
            <h4 style="color:#667eea;">🤖 AI-Generated Recommendations</h4>
            <div style="margin-top:10px;">${aiPlan}</div>
        </div>`;
    }
    
    if (weakStudents.length > 0) {
        html += `<h4>📋 Students Who Need Extra Support:</h4><ul style="margin-bottom:20px;">`;
        weakStudents.forEach(s => {
            html += `<li>🔴 <strong>${escapeHtml(s.student.name)}</strong> - ${Math.round(s.avgPercentage)}% - Focus: Emotional regulation, sharing, expressing feelings</li>`;
        });
        html += `</ul>`;
        
        html += `<h4>📚 Recommended Activities for Weak Students:</h4>`;
        html += `<div class="activity-item">🎭 <strong>Emotion Charades:</strong> Act out feelings (happy, sad, angry, scared). Helps identify emotions. Do daily for 10 minutes.</div>`;
        html += `<div class="activity-item">🤝 <strong>Turn-Taking Game:</strong> Use a timer and toys to practice sharing and waiting. Praise when they wait patiently.</div>`;
        html += `<div class="activity-item">🧘 <strong>Calm Down Jar:</strong> Make glitter jars together. Teach: shake when angry, watch settle to calm down.</div>`;
        html += `<div class="activity-item">📖 <strong>Storytime - "The Way I Feel":</strong> Read daily and ask "How would you feel?" after each page.</div>`;
        html += `<div class="activity-item">🎨 <strong>Feelings Faces Art:</strong> Draw different emotions on paper plates. Use during morning circle.</div>`;
        html += `<div class="activity-item">🫂 <strong>Buddy System:</strong> Pair each weak student with a strong student for peer modeling.</div>`;
    } else {
        html += `<div class="activity-item">🎉 <strong>Excellent work!</strong> No weak students identified. Focus on enrichment activities and peer mentoring.</div>`;
    }
    
    html += `<h4 style="margin-top:25px;">📅 Next Week Focus Plan:</h4>`;
    html += `<ul style="margin-bottom:20px;">
        <li>✅ Daily morning circle: "How do you feel today?" - each child shares one emotion</li>
        <li>✅ Use reward chart for kind behaviors (sharing, helping, using words)</li>
        <li>✅ Send weekly progress note to parents via WhatsApp</li>
        <li>✅ Conduct one SEL activity daily (15 minutes)</li>
        <li>✅ Track progress again next week and compare</li>
    </ul>`;
    
    html += `<h4>🎁 Quick SEL Activity Guide (5 minutes each):</h4>`;
    html += `<div class="activity-item"><strong>Monday:</strong> Mirror feelings - children copy teacher's facial expressions</div>`;
    html += `<div class="activity-item"><strong>Tuesday:</strong> "I feel..." sentence completion - each child completes the sentence</div>`;
    html += `<div class="activity-item"><strong>Wednesday:</strong> Kindness circle - each child says one nice thing about a friend</div>`;
    html += `<div class="activity-item"><strong>Thursday:</strong> Breathing exercise - 5 deep breaths together</div>`;
    html += `<div class="activity-item"><strong>Friday:</strong> Celebration - praise all students for their efforts</div>`;
    
    document.getElementById("teacherPlanContainer").innerHTML = html;
    showToast("AI Teacher plan generated successfully!", "success");
    
    // Save to API
    callAPI('/api/teacher-plan', 'POST', {
        tool_slug: CONFIG.TOOL_SLUG,
        weak_count: weakStudents.length,
        total_students: lastAnalysis.length
    });
});

// ============================================================
// REACTION BUTTONS & SHARE ICONS INJECTION
// ============================================================
function addReactionAndShareButtons() {
    for (let step = 1; step <= 5; step++) {
        const stepCard = document.querySelector(`#step${step} .step-card`);
        if (stepCard && !stepCard.querySelector('.reaction-section')) {
            // Reaction section
            const reactionSection = document.createElement('div');
            reactionSection.className = 'reaction-section';
            
            REACTIONS.forEach(reaction => {
                const btn = document.createElement('button');
                btn.className = 'reaction-btn';
                btn.setAttribute('data-reaction', reaction.name);
                btn.innerHTML = `<span class="reaction-emoji">${reaction.emoji}</span><span class="reaction-count">0</span>`;
                btn.onclick = () => addReaction(step, reaction.name);
                reactionSection.appendChild(btn);
            });
            
            // Share section
            const shareSection = document.createElement('div');
            shareSection.className = 'share-icons';
            const stepNames = ['Add Students', 'Daily Checklist', 'Analyze Reports', 'Send to Parents', 'Teacher Plan'];
            shareSection.innerHTML = `
                <a href="#" onclick="shareTool(${step}, '${stepNames[step-1]}', 'facebook')" aria-label="Share on Facebook"><i class="fab fa-facebook-f"></i></a>
                <a href="#" onclick="shareTool(${step}, '${stepNames[step-1]}', 'twitter')" aria-label="Share on Twitter"><i class="fab fa-twitter"></i></a>
                <a href="#" onclick="shareTool(${step}, '${stepNames[step-1]}', 'linkedin')" aria-label="Share on LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                <a href="#" onclick="shareTool(${step}, '${stepNames[step-1]}', 'whatsapp')" aria-label="Share on WhatsApp"><i class="fab fa-whatsapp"></i></a>
                <a href="#" onclick="shareTool(${step}, '${stepNames[step-1]}', 'email')" aria-label="Share via Email"><i class="fas fa-envelope"></i></a>
                <a href="#" onclick="shareTool(${step}, '${stepNames[step-1]}', 'copy')" aria-label="Copy link"><i class="fas fa-copy"></i></a>
            `;
            
            const stepActions = stepCard.querySelector('.step-actions');
            if (stepActions) {
                stepCard.insertBefore(reactionSection, stepActions);
                stepCard.insertBefore(shareSection, stepActions);
            } else {
                stepCard.appendChild(reactionSection);
                stepCard.appendChild(shareSection);
            }
        }
    }
}

// ============================================================
// NAVIGATION SETUP
// ============================================================
function setupNavigation() {
    document.querySelectorAll('.step-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const step = parseInt(btn.dataset.step);
            if (step === 2 && students.length === 0) {
                showToast("Please add at least one student in Step 1 first!", "warning");
                return;
            }
            if (step === 3 && students.length === 0) {
                showToast("Please complete Step 1 and Step 2 first!", "warning");
                return;
            }
            showStep(step);
        });
    });
    
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', () => {
            const nextStep = parseInt(btn.dataset.next);
            showStep(nextStep);
        });
    });
    
    document.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', () => {
            const prevStep = parseInt(btn.dataset.prev);
            showStep(prevStep);
        });
    });
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ============================================================
// LOAD STATS FROM API
// ============================================================
async function loadStatsFromAPI() {
    try {
        const response = await callAPI(`/api/stats?tool_slug=${CONFIG.TOOL_SLUG}`, 'GET');
        if (response) {
            if (response.usage) {
                Object.keys(response.usage).forEach(key => {
                    if (stepUsage[key] !== undefined) {
                        stepUsage[key] = Math.max(stepUsage[key], response.usage[key]);
                    }
                });
                localStorage.setItem('sel_step_usage', JSON.stringify(stepUsage));
                for (let i = 1; i <= 5; i++) {
                    updateStepUsageDisplay(i);
                }
            }
            if (response.reactions) {
                // Merge reactions
                Object.keys(response.reactions).forEach(stepKey => {
                    if (!toolReactions[stepKey]) toolReactions[stepKey] = {};
                    Object.keys(response.reactions[stepKey]).forEach(reactionName => {
                        if (!toolReactions[stepKey][reactionName]) toolReactions[stepKey][reactionName] = {};
                        Object.keys(response.reactions[stepKey][reactionName]).forEach(userId => {
                            toolReactions[stepKey][reactionName][userId] = true;
                        });
                    });
                });
                localStorage.setItem('sel_tool_reactions', JSON.stringify(toolReactions));
                for (let step = 1; step <= 5; step++) {
                    const stepKey = `step${step}`;
                    if (toolReactions[stepKey]) {
                        for (const [reactionName, users] of Object.entries(toolReactions[stepKey])) {
                            updateReactionDisplay(step, reactionName, Object.keys(users).length);
                        }
                    }
                }
            }
            updateHeroStats();
        }
    } catch (error) {
        console.warn('Failed to load stats from API:', error);
    }
}

// ============================================================
// INITIALIZATION
// ============================================================
async function init() {
    currentUser = getUserId();
    loadStudents();
    loadUsageFromStorage();
    loadReactionsFromStorage();
    loadSharesFromStorage();
    
    document.getElementById("checklistDate").value = getTodayDate();
    if (students.length > 0) {
        loadChecklistForDate(getTodayDate());
    }
    
    setupNavigation();
    setupScrollButtons();
    addReactionAndShareButtons();
    
    document.getElementById('pageShareBtn')?.addEventListener('click', shareCurrentPage);
    
    const lastStep = localStorage.getItem('currentStep');
    if (lastStep && parseInt(lastStep) > 1 && students.length > 0) {
        showStep(parseInt(lastStep));
    } else {
        showStep(1);
    }
    
    // Start typewriter
    setTimeout(typewriterEffect, 500);
    
    // Load stats from API
    await loadStatsFromAPI();
    
    showToast("Welcome to SEL Teacher Tool! 🎉", "success");
}

// ============================================================
// START THE APP
// ============================================================
document.addEventListener('DOMContentLoaded', init);
