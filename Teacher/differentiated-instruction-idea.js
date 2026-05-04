// ============================================
// FULLY FUNCTIONAL JAVASCRIPT - NO API DEPENDENCIES
// All data stored in localStorage
// ============================================

const TOOL_SLUG = 'differentiated-instruction-idea';

// User ID
let userId = localStorage.getItem('user_id');
if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('user_id', userId);
}

// State
let currentLessonData = null;
let userReactions = new Set();
let currentReactionCounts = { like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0 };
let shareCount = 0;

// Load saved data
const savedReactions = localStorage.getItem(`user_reactions_${TOOL_SLUG}_${userId}`);
if (savedReactions) userReactions = new Set(JSON.parse(savedReactions));

const savedReactionCounts = localStorage.getItem(`${TOOL_SLUG}_reactions`);
if (savedReactionCounts) currentReactionCounts = JSON.parse(savedReactionCounts);

const savedShareCount = localStorage.getItem(`${TOOL_SLUG}_shares`);
if (savedShareCount) shareCount = parseInt(savedShareCount);

// DOM Elements
const elements = {
    loadingSpinner: document.getElementById('loading-spinner'),
    toastContainer: document.getElementById('toast-container'),
    themeToggle: document.getElementById('theme-toggle-btn'),
    scrollUp: document.getElementById('scroll-up'),
    scrollDown: document.getElementById('scroll-down'),
    usageCount: document.getElementById('usage-count'),
    generateBtn: document.getElementById('generate-btn'),
    resetBtn: document.getElementById('reset-btn'),
    newIdeasBtn: document.getElementById('new-ideas-btn'),
    resultsSection: document.getElementById('results-section'),
    topicResult: document.getElementById('topic-result'),
    subject: document.getElementById('subject'),
    grade: document.getElementById('grade'),
    duration: document.getElementById('duration'),
    beginnerLevel: document.getElementById('beginner-level'),
    intermediateLevel: document.getElementById('intermediate-level'),
    advancedLevel: document.getElementById('advanced-level'),
    methodology: document.getElementById('methodology'),
    classSize: document.getElementById('class-size'),
    beginnerActivities: document.getElementById('beginner-activities'),
    intermediateActivities: document.getElementById('intermediate-activities'),
    advancedActivities: document.getElementById('advanced-activities'),
    slosList: document.getElementById('slos-list'),
    fullLessonPlan: document.getElementById('full-lesson-plan'),
    exportPdf: document.getElementById('export-pdf'),
    exportWord: document.getElementById('export-word'),
    exportTxt: document.getElementById('export-txt'),
    shareCountSpan: document.getElementById('share-count'),
    autoSaveStatus: document.getElementById('auto-save-status')
};

// Toast
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i><span>${message}</span>`;
    elements.toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Loading
function showLoading(show) {
    elements.loadingSpinner.style.display = show ? 'flex' : 'none';
}

// Usage Counter
function updateUsageCounter(increment = false) {
    let count = parseInt(localStorage.getItem(`${TOOL_SLUG}_usage`) || '0');
    if (increment) {
        count++;
        localStorage.setItem(`${TOOL_SLUG}_usage`, count);
    }
    elements.usageCount.textContent = count;
    return count;
}

// Reactions
function loadReactions() {
    const emojiMap = { '👍': 'like', '❤️': 'love', '😮': 'wow', '😢': 'sad', '😠': 'angry', '😂': 'laugh', '🎉': 'celebrate' };
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        const emoji = btn.dataset.emoji;
        const reactionType = emojiMap[emoji];
        const countSpan = btn.querySelector('.reaction-count');
        countSpan.textContent = currentReactionCounts[reactionType] || 0;
        if (userReactions.has(emoji)) btn.classList.add('reacted');
    });
}

function saveReactionCounts() {
    localStorage.setItem(`${TOOL_SLUG}_reactions`, JSON.stringify(currentReactionCounts));
}

function addReaction(emoji) {
    const emojiMap = { '👍': 'like', '❤️': 'love', '😮': 'wow', '😢': 'sad', '😠': 'angry', '😂': 'laugh', '🎉': 'celebrate' };
    const reactionType = emojiMap[emoji];
    
    if (userReactions.has(emoji)) {
        showToast(`You already reacted with ${emoji}`, 'warning');
        return false;
    }
    
    currentReactionCounts[reactionType] = (currentReactionCounts[reactionType] || 0) + 1;
    userReactions.add(emoji);
    localStorage.setItem(`user_reactions_${TOOL_SLUG}_${userId}`, JSON.stringify(Array.from(userReactions)));
    saveReactionCounts();
    loadReactions();
    showToast(`Thanks for your feedback! ${emoji}`, 'success');
    return true;
}

// Share System
function updateShareCount() {
    elements.shareCountSpan.textContent = shareCount;
}

function saveShareCount() {
    localStorage.setItem(`${TOOL_SLUG}_shares`, shareCount);
}

async function recordShare(platform) {
    shareCount++;
    saveShareCount();
    updateShareCount();
}

async function shareLesson(platform) {
    const url = window.location.href;
    const subject = elements.subject.value || 'my lesson';
    const text = `Check out these differentiated activities for ${subject}!`;
    
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    
    if (platform === 'copy') {
        await navigator.clipboard.writeText(url);
        showToast('Link copied to clipboard!', 'success');
    } else if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    await recordShare(platform);
}

// Theme
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        document.querySelector('#theme-toggle-btn .fa-moon').style.display = 'none';
        document.querySelector('#theme-toggle-btn .fa-sun').style.display = 'inline-block';
    }
}

function toggleTheme() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    if (isDark) {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        document.querySelector('#theme-toggle-btn .fa-moon').style.display = 'inline-block';
        document.querySelector('#theme-toggle-btn .fa-sun').style.display = 'none';
        showToast('Light mode activated', 'info');
    } else {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        document.querySelector('#theme-toggle-btn .fa-moon').style.display = 'none';
        document.querySelector('#theme-toggle-btn .fa-sun').style.display = 'inline-block';
        showToast('Dark mode activated', 'info');
    }
}

// Scroll
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
function scrollToBottom() { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }

// Auto-Save
function autoSaveDraft() {
    const draft = {
        subject: elements.subject.value,
        grade: elements.grade.value,
        duration: elements.duration.value,
        beginnerLevel: elements.beginnerLevel.value,
        intermediateLevel: elements.intermediateLevel.value,
        advancedLevel: elements.advancedLevel.value,
        methodology: elements.methodology.value,
        classSize: elements.classSize.value,
        timestamp: Date.now()
    };
    localStorage.setItem(`${TOOL_SLUG}_draft`, JSON.stringify(draft));
    if (elements.autoSaveStatus) {
        elements.autoSaveStatus.textContent = 'Draft saved';
        setTimeout(() => {
            if (elements.autoSaveStatus) elements.autoSaveStatus.textContent = 'Draft auto-saved';
        }, 2000);
    }
}

function loadDraft() {
    const draft = localStorage.getItem(`${TOOL_SLUG}_draft`);
    if (draft) {
        const data = JSON.parse(draft);
        if (elements.subject) elements.subject.value = data.subject || '';
        if (elements.grade) elements.grade.value = data.grade || '6-8';
        if (elements.duration) elements.duration.value = data.duration || '45';
        if (elements.beginnerLevel) elements.beginnerLevel.value = data.beginnerLevel || 'basic';
        if (elements.intermediateLevel) elements.intermediateLevel.value = data.intermediateLevel || 'proficient';
        if (elements.advancedLevel) elements.advancedLevel.value = data.advancedLevel || 'exemplary';
        if (elements.methodology) elements.methodology.value = data.methodology || 'inquiry-based';
        if (elements.classSize) elements.classSize.value = data.classSize || '25';
    }
}

// Generate Content
function generateSLOs(subject) {
    return [
        `Demonstrate understanding of key ${subject} concepts and terminology`,
        `Apply ${subject} knowledge to solve real-world problems`,
        `Analyze and evaluate different aspects of ${subject}`,
        `Create innovative solutions using ${subject} principles`,
        `Communicate ${subject} ideas effectively in written and oral form`,
        `Collaborate with peers to explore ${subject} in depth`
    ];
}

function generateActivities(subject) {
    return {
        beginner: [
            { title: `🧩 Hands-On Manipulative Activity for ${subject}`, detail: `Students use concrete materials to understand basic ${subject} concepts with visual supports and sentence starters.` },
            { title: `🎯 ${subject} Matching Game`, detail: `Match key terms with definitions/images. Includes word bank and scaffolded support.` },
            { title: `📊 Visual Flowchart of ${subject}`, detail: `Break down ${subject} into simple, sequential steps with graphic organizers.` },
            { title: `✏️ Fill-in-the-Blanks ${subject} Worksheet`, detail: `Guided practice with word bank and teacher support.` }
        ],
        intermediate: [
            { title: `🔍 Guided Inquiry: Exploring ${subject}`, detail: `Students investigate ${subject} through structured questions and peer discussion.` },
            { title: `📋 ${subject} Case Study Analysis`, detail: `Analyze real-world examples of ${subject} with guided prompts.` },
            { title: `👥 Collaborative ${subject} Investigation`, detail: `Groups become experts on different ${subject} aspects and teach peers.` },
            { title: `💡 ${subject} Problem-Solving Challenge`, detail: `Apply ${subject} knowledge to solve authentic problems.` }
        ],
        advanced: [
            { title: `🚀 Open-Ended ${subject} Research Project`, detail: `Students formulate research questions and conduct independent investigation.` },
            { title: `🎭 ${subject} Debate & Socratic Seminar`, detail: `Argue different perspectives on complex ${subject} issues with evidence.` },
            { title: `🌍 Real-World ${subject} Innovation Challenge`, detail: `Apply ${subject} to solve authentic problems and prototype solutions.` },
            { title: `🔗 ${subject} Cross-Curricular Connection`, detail: `Connect ${subject} to other disciplines and create interdisciplinary projects.` }
        ]
    };
}

function generateLessonPlan(subject, grade, duration, methodology) {
    const durationNum = parseInt(duration) || 45;
    return `
        <h4><i class="fas fa-bullseye"></i> Learning Objectives</h4>
        <ul>
            <li>Students will be able to explain key concepts of ${subject}</li>
            <li>Students will apply ${subject} knowledge to solve problems</li>
            <li>Students will evaluate and create using ${subject} principles</li>
        </ul>
        <h4><i class="fas fa-tools"></i> Materials Needed</h4>
        <ul>
            <li>Visual aids and manipulatives for ${subject}</li>
            <li>Differentiated worksheets for 3 skill levels</li>
            <li>Technology resources (videos, interactive simulations)</li>
            <li>Group discussion prompts and graphic organizers</li>
        </ul>
        <h4><i class="fas fa-clock"></i> Lesson Structure (${durationNum} minutes)</h4>
        <ul>
            <li><strong>Opening (5-10 min):</strong> Hook and activate prior knowledge about ${subject}</li>
            <li><strong>Direct Instruction (10-15 min):</strong> Introduce ${subject} using ${methodology}</li>
            <li><strong>Guided Practice (15-20 min):</strong> Differentiated activities by skill level</li>
            <li><strong>Independent/Group Work (15-20 min):</strong> Collaborative learning tasks</li>
            <li><strong>Closure (5-10 min):</strong> Exit ticket and reflection</li>
        </ul>
        <h4><i class="fas fa-clipboard-list"></i> Assessment Strategies</h4>
        <ul>
            <li><strong>Formative:</strong> Observation, questioning, exit tickets</li>
            <li><strong>Summative:</strong> Differentiated project or assessment</li>
            <li><strong>Self-assessment:</strong> Student reflection rubric</li>
        </ul>
        <h4><i class="fas fa-universal-access"></i> Differentiation Strategies</h4>
        <ul>
            <li><strong>Beginner:</strong> Visual supports, sentence starters, peer assistance</li>
            <li><strong>Intermediate:</strong> Guided questions, collaborative learning, choice boards</li>
            <li><strong>Advanced:</strong> Open-ended tasks, cross-curricular connections, mentoring roles</li>
        </ul>
    `;
}

function displaySLOs(slos) {
    elements.slosList.innerHTML = slos.map(slo => `
        <div class="slo-item"><i class="fas fa-check-circle"></i><span>${slo}</span></div>
    `).join('');
}

function displayActivities(activities) {
    elements.beginnerActivities.innerHTML = activities.beginner.map(a => `
        <div class="activity-item"><strong>${a.title}</strong><em>${a.detail}</em></div>
    `).join('');
    elements.intermediateActivities.innerHTML = activities.intermediate.map(a => `
        <div class="activity-item"><strong>${a.title}</strong><em>${a.detail}</em></div>
    `).join('');
    elements.advancedActivities.innerHTML = activities.advanced.map(a => `
        <div class="activity-item"><strong>${a.title}</strong><em>${a.detail}</em></div>
    `).join('');
}

function displayLessonPlan(plan) {
    elements.fullLessonPlan.innerHTML = plan;
}

async function generateLesson() {
    const subject = elements.subject.value.trim();
    if (!subject) {
        showToast('Please enter a subject/topic', 'error');
        elements.subject.focus();
        return false;
    }
    
    showLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    updateUsageCounter(true);
    
    const slos = generateSLOs(subject);
    const activities = generateActivities(subject);
    const lessonPlan = generateLessonPlan(subject, elements.grade.value, elements.duration.value, elements.methodology.value);
    
    elements.topicResult.textContent = subject;
    displaySLOs(slos);
    displayActivities(activities);
    displayLessonPlan(lessonPlan);
    
    elements.resultsSection.style.display = 'block';
    elements.resultsSection.scrollIntoView({ behavior: 'smooth' });
    
    currentLessonData = { subject, slos, activities, lessonPlan };
    showToast('Lesson generated successfully!', 'success');
    showLoading(false);
    return true;
}

// Export Functions
function exportToPDF() {
    if (!currentLessonData && elements.resultsSection.style.display !== 'block') {
        showToast('Generate a lesson first', 'error');
        return;
    }
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html><head><title>Lesson Plan - ${elements.subject.value}</title>
        <style>body{font-family:Arial;padding:20px}h1{color:#4361ee}</style></head>
        <body><h1>Differentiated Lesson Plan: ${elements.subject.value}</h1>
        <p>Grade: ${elements.grade.value} | Duration: ${elements.duration.value} min</p>
        <hr>${elements.fullLessonPlan.innerHTML}<hr>
        <h2>Differentiated Activities</h2>
        <h3>Beginner Level</h3>${elements.beginnerActivities.innerHTML}
        <h3>Intermediate Level</h3>${elements.intermediateActivities.innerHTML}
        <h3>Advanced Level</h3>${elements.advancedActivities.innerHTML}
        </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
    showToast('PDF ready for printing', 'success');
}

function exportToWord() {
    if (!currentLessonData && elements.resultsSection.style.display !== 'block') {
        showToast('Generate a lesson first', 'error');
        return;
    }
    const content = `<html><head><meta charset="UTF-8"><title>Lesson Plan</title></head>
        <body><h1>Differentiated Lesson Plan: ${elements.subject.value}</h1>
        ${elements.fullLessonPlan.innerHTML}
        <h2>Differentiated Activities</h2>
        <h3>Beginner</h3>${elements.beginnerActivities.innerHTML}
        <h3>Intermediate</h3>${elements.intermediateActivities.innerHTML}
        <h3>Advanced</h3>${elements.advancedActivities.innerHTML}
        </body></html>`;
    const blob = new Blob([content], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Lesson_Plan_${(elements.subject.value || 'lesson').replace(/\s/g, '_')}.doc`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('Word document downloaded', 'success');
}

function exportToTXT() {
    if (!currentLessonData && elements.resultsSection.style.display !== 'block') {
        showToast('Generate a lesson first', 'error');
        return;
    }
    const content = `DIFFERENTIATED LESSON PLAN\nSubject: ${elements.subject.value}\nGrade: ${elements.grade.value}\n\nLESSON CONTENT:\n${elements.fullLessonPlan.innerText}\n\nACTIVITIES:\n${elements.beginnerActivities.innerText}\n${elements.intermediateActivities.innerText}\n${elements.advancedActivities.innerText}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Lesson_Plan_${(elements.subject.value || 'lesson').replace(/\s/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('Text file downloaded', 'success');
}

function resetForm() {
    elements.subject.value = '';
    elements.grade.value = '6-8';
    elements.duration.value = '45';
    elements.beginnerLevel.value = 'basic';
    elements.intermediateLevel.value = 'proficient';
    elements.advancedLevel.value = 'exemplary';
    elements.methodology.value = 'inquiry-based';
    elements.classSize.value = '25';
    elements.resultsSection.style.display = 'none';
    localStorage.removeItem(`${TOOL_SLUG}_draft`);
    elements.subject.focus();
    showToast('Form reset', 'info');
}

// Event Listeners
function initEventListeners() {
    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.scrollUp.addEventListener('click', scrollToTop);
    elements.scrollDown.addEventListener('click', scrollToBottom);
    elements.generateBtn.addEventListener('click', generateLesson);
    elements.resetBtn.addEventListener('click', resetForm);
    if (elements.newIdeasBtn) elements.newIdeasBtn.addEventListener('click', generateLesson);
    elements.exportPdf.addEventListener('click', exportToPDF);
    elements.exportWord.addEventListener('click', exportToWord);
    elements.exportTxt.addEventListener('click', exportToTXT);
    
    elements.subject.addEventListener('input', autoSaveDraft);
    elements.grade.addEventListener('change', autoSaveDraft);
    elements.duration.addEventListener('change', autoSaveDraft);
    elements.methodology.addEventListener('change', autoSaveDraft);
    elements.classSize.addEventListener('input', autoSaveDraft);
    elements.beginnerLevel.addEventListener('change', autoSaveDraft);
    elements.intermediateLevel.addEventListener('change', autoSaveDraft);
    elements.advancedLevel.addEventListener('change', autoSaveDraft);
    
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', () => addReaction(btn.dataset.emoji));
    });
    
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', () => shareLesson(btn.dataset.platform));
    });
}

// Initialize
function init() {
    initTheme();
    initEventListeners();
    updateUsageCounter(false);
    loadReactions();
    updateShareCount();
    loadDraft();
    showToast('Welcome! Enter a subject to get started. Everything works offline!', 'info');
}

init();
