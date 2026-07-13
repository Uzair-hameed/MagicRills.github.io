// ============================================
// DIFFERENTIATED INSTRUCTION IDEA GENERATOR
// Cloudflare Workers API Integration
// Full Dark Space Theme | AI-Powered
// ============================================

// ============================================
// CONFIGURATION
// ============================================
const TOOL_SLUG = 'differentiated-instruction-idea';
const TOOL_NAME = 'Differentiated Instruction Idea Generator';
const CATEGORY = 'Teacher';

// Cloudflare Workers API Configuration
const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';
const API_KEY = 'magicrills-grok-api.uzairhameed01.workers.dev';

// ============================================
// USER IDENTIFICATION
// ============================================
let userId = localStorage.getItem('user_id');
if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('user_id', userId);
}

// ============================================
// STATE MANAGEMENT
// ============================================
let currentLessonData = null;
let userReactions = new Set();
let currentReactionCounts = { like: 0, love: 0, wow: 0, sad: 0, laugh: 0, celebrate: 0 };
let shareCount = 0;
let usageCount = 0;
let toolStats = null;
let isApiAvailable = true;

// ============================================
// LOCALSTORAGE FALLBACK FUNCTIONS
// ============================================
function getLocalData(key, defaultValue) {
    try {
        const data = localStorage.getItem(`${TOOL_SLUG}_${key}`);
        return data ? JSON.parse(data) : defaultValue;
    } catch {
        return defaultValue;
    }
}

function setLocalData(key, value) {
    try {
        localStorage.setItem(`${TOOL_SLUG}_${key}`, JSON.stringify(value));
    } catch (e) {
        console.warn('LocalStorage write failed:', e);
    }
}

// ============================================
// API CALLS WITH FALLBACK
// ============================================
async function apiCall(endpoint, method = 'GET', data = null) {
    const url = `${API_BASE}${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': API_KEY,
        },
    };
    if (data) options.body = JSON.stringify(data);
    
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.warn('API call failed, using fallback:', error);
        isApiAvailable = false;
        return null;
    }
}

// ============================================
// USAGE COUNTER
// ============================================
async function incrementUsage() {
    try {
        const result = await apiCall('/api/usage', 'POST', {
            tool_slug: TOOL_SLUG,
            user_id: userId,
            action: 'use'
        });
        if (result && result.count !== undefined) {
            usageCount = result.count;
            setLocalData('usage', usageCount);
            updateUsageDisplay();
            return usageCount;
        }
    } catch (e) {
        console.warn('Usage API failed, using fallback');
    }
    
    // Fallback: LocalStorage
    usageCount = getLocalData('usage', 0) + 1;
    setLocalData('usage', usageCount);
    updateUsageDisplay();
    return usageCount;
}

function updateUsageDisplay() {
    const el = document.getElementById('usage-count');
    if (el) el.textContent = usageCount || getLocalData('usage', 0);
}

// ============================================
// REACTIONS API
// ============================================
async function addReaction(emoji) {
    const emojiMap = { '👍': 'like', '❤️': 'love', '😮': 'wow', '😢': 'sad', '😂': 'laugh', '🎉': 'celebrate' };
    const reactionType = emojiMap[emoji];
    
    if (userReactions.has(emoji)) {
        showToast(`You already reacted with ${emoji}`, 'warning');
        return false;
    }
    
    try {
        const result = await apiCall('/api/reactions', 'POST', {
            tool_slug: TOOL_SLUG,
            user_id: userId,
            emoji: emoji,
            type: reactionType,
            action: 'add'
        });
        
        if (result && result.counts) {
            currentReactionCounts = result.counts;
            setLocalData('reactions', currentReactionCounts);
        }
    } catch (e) {
        console.warn('Reaction API failed, using fallback');
        // Fallback: LocalStorage
        currentReactionCounts[reactionType] = (currentReactionCounts[reactionType] || 0) + 1;
        setLocalData('reactions', currentReactionCounts);
    }
    
    userReactions.add(emoji);
    setLocalData('user_reactions', Array.from(userReactions));
    loadReactions();
    showToast(`Thanks for your feedback! ${emoji}`, 'success');
    return true;
}

async function loadReactionsFromAPI() {
    try {
        const result = await apiCall(`/api/reactions?tool_slug=${TOOL_SLUG}`, 'GET');
        if (result && result.counts) {
            currentReactionCounts = result.counts;
            setLocalData('reactions', currentReactionCounts);
        }
    } catch (e) {
        console.warn('Load reactions API failed, using fallback');
        currentReactionCounts = getLocalData('reactions', { like: 0, love: 0, wow: 0, sad: 0, laugh: 0, celebrate: 0 });
    }
    loadReactions();
}

function loadReactions() {
    const emojiMap = { '👍': 'like', '❤️': 'love', '😮': 'wow', '😢': 'sad', '😂': 'laugh', '🎉': 'celebrate' };
    const savedReactions = getLocalData('user_reactions', []);
    userReactions = new Set(savedReactions);
    
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        const emoji = btn.dataset.emoji;
        const reactionType = emojiMap[emoji];
        const countSpan = btn.querySelector('.reaction-count');
        countSpan.textContent = currentReactionCounts[reactionType] || 0;
        if (userReactions.has(emoji)) btn.classList.add('reacted');
    });
}

// ============================================
// SHARES API
// ============================================
async function recordShare(platform) {
    try {
        const result = await apiCall('/api/shares', 'POST', {
            tool_slug: TOOL_SLUG,
            user_id: userId,
            platform: platform,
            action: 'share'
        });
        if (result && result.count !== undefined) {
            shareCount = result.count;
            setLocalData('shares', shareCount);
            updateShareDisplay();
            return shareCount;
        }
    } catch (e) {
        console.warn('Share API failed, using fallback');
    }
    
    // Fallback
    shareCount = getLocalData('shares', 0) + 1;
    setLocalData('shares', shareCount);
    updateShareDisplay();
    return shareCount;
}

function updateShareDisplay() {
    const el = document.getElementById('share-count');
    if (el) el.textContent = shareCount || getLocalData('shares', 0);
}

// ============================================
// STATS API
// ============================================
async function loadStats() {
    try {
        const result = await apiCall(`/api/stats?tool_slug=${TOOL_SLUG}`, 'GET');
        if (result) {
            toolStats = result;
            updateStatsDisplay(result);
            return result;
        }
    } catch (e) {
        console.warn('Stats API failed, using fallback');
        // Use local data for stats
        toolStats = {
            usage: getLocalData('usage', 0),
            shares: getLocalData('shares', 0),
            reactions: getLocalData('reactions', {})
        };
        updateStatsDisplay(toolStats);
        return toolStats;
    }
}

function updateStatsDisplay(stats) {
    const statsContainer = document.getElementById('stats-container');
    if (!statsContainer) return;
    
    const totalReactions = Object.values(stats.reactions || {}).reduce((a, b) => a + b, 0);
    
    statsContainer.innerHTML = `
        <div class="stat-card">
            <i class="fas fa-eye"></i>
            <span class="stat-value">${stats.usage || 0}</span>
            <span class="stat-label">Views</span>
        </div>
        <div class="stat-card">
            <i class="fas fa-share-alt"></i>
            <span class="stat-value">${stats.shares || 0}</span>
            <span class="stat-label">Shares</span>
        </div>
        <div class="stat-card">
            <i class="fas fa-heart"></i>
            <span class="stat-value">${totalReactions}</span>
            <span class="stat-label">Reactions</span>
        </div>
        <div class="stat-card">
            <i class="fas fa-users"></i>
            <span class="stat-value">${stats.followers || 0}</span>
            <span class="stat-label">Followers</span>
        </div>
    `;
}

// ============================================
// SHARE FUNCTION (with API integration)
// ============================================
async function shareLesson(platform) {
    const url = window.location.href;
    const subject = document.getElementById('subject')?.value || 'my lesson';
    const text = `Check out these differentiated activities for ${subject}!`;
    
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    
    if (platform === 'copy') {
        try {
            await navigator.clipboard.writeText(url);
            showToast('Link copied to clipboard!', 'success');
        } catch {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = url;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast('Link copied to clipboard!', 'success');
        }
    } else if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    
    await recordShare(platform);
}

// ============================================
// TOAST SYSTEM
// ============================================
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// LOADING SPINNER
// ============================================
function showLoading(show) {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) spinner.style.display = show ? 'flex' : 'none';
}

// ============================================
// THEME MANAGEMENT
// ============================================
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        const moon = document.querySelector('#theme-toggle-btn .fa-moon');
        const sun = document.querySelector('#theme-toggle-btn .fa-sun');
        if (moon) moon.style.display = 'none';
        if (sun) sun.style.display = 'inline-block';
    }
}

function toggleTheme() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const moon = document.querySelector('#theme-toggle-btn .fa-moon');
    const sun = document.querySelector('#theme-toggle-btn .fa-sun');
    
    if (isDark) {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        if (moon) moon.style.display = 'inline-block';
        if (sun) sun.style.display = 'none';
        showToast('Light mode activated', 'info');
    } else {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        if (moon) moon.style.display = 'none';
        if (sun) sun.style.display = 'inline-block';
        showToast('Dark mode activated', 'info');
    }
}

// ============================================
// TYPEWRITER ANIMATION
// ============================================
function initTypewriter() {
    const elements = document.querySelectorAll('.typewriter-text');
    if (!elements.length) return;
    
    elements.forEach((el, index) => {
        const texts = el.dataset.texts ? JSON.parse(el.dataset.texts) : ['Differentiated Instruction', 'Lesson Planning', 'Student Success'];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function type() {
            const currentText = texts[textIndex];
            if (isDeleting) {
                el.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                el.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(type, 2000);
                return;
            }
            
            if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(type, 500);
                return;
            }
            
            setTimeout(type, isDeleting ? 50 : 100);
        }
        
        setTimeout(type, index * 500);
    });
}

// ============================================
// NAVIGATION
// ============================================
function setupNavigation() {
    const homeBtn = document.getElementById('home-btn');
    const backBtn = document.getElementById('back-btn');
    
    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            window.location.href = 'https://magicrills.com';
        });
    }
    
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'https://magicrills.com/category-pages/mixed-tools.html';
        });
    }
}

// ============================================
// SCROLL BUTTONS
// ============================================
function setupScrollButtons() {
    const scrollUp = document.getElementById('scroll-up');
    const scrollDown = document.getElementById('scroll-down');
    
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
// GENERATE LESSON CONTENT
// ============================================
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
    const container = document.getElementById('slos-list');
    if (!container) return;
    container.innerHTML = slos.map(slo => `
        <div class="slo-item"><i class="fas fa-check-circle"></i><span>${slo}</span></div>
    `).join('');
}

function displayActivities(activities) {
    const beginner = document.getElementById('beginner-activities');
    const intermediate = document.getElementById('intermediate-activities');
    const advanced = document.getElementById('advanced-activities');
    
    if (beginner) {
        beginner.innerHTML = activities.beginner.map(a => `
            <div class="activity-item"><strong>${a.title}</strong><em>${a.detail}</em></div>
        `).join('');
    }
    if (intermediate) {
        intermediate.innerHTML = activities.intermediate.map(a => `
            <div class="activity-item"><strong>${a.title}</strong><em>${a.detail}</em></div>
        `).join('');
    }
    if (advanced) {
        advanced.innerHTML = activities.advanced.map(a => `
            <div class="activity-item"><strong>${a.title}</strong><em>${a.detail}</em></div>
        `).join('');
    }
}

function displayLessonPlan(plan) {
    const container = document.getElementById('full-lesson-plan');
    if (container) container.innerHTML = plan;
}

// ============================================
// AUTO-SAVE DRAFT
// ============================================
function autoSaveDraft() {
    const draft = {
        subject: document.getElementById('subject')?.value || '',
        grade: document.getElementById('grade')?.value || '6-8',
        duration: document.getElementById('duration')?.value || '45',
        beginnerLevel: document.getElementById('beginner-level')?.value || 'basic',
        intermediateLevel: document.getElementById('intermediate-level')?.value || 'proficient',
        advancedLevel: document.getElementById('advanced-level')?.value || 'exemplary',
        methodology: document.getElementById('methodology')?.value || 'inquiry-based',
        classSize: document.getElementById('class-size')?.value || '25',
        timestamp: Date.now()
    };
    setLocalData('draft', draft);
    
    const status = document.getElementById('auto-save-status');
    if (status) {
        status.textContent = 'Draft saved';
        setTimeout(() => {
            if (status) status.textContent = 'Draft auto-saved';
        }, 2000);
    }
}

function loadDraft() {
    const draft = getLocalData('draft', null);
    if (draft) {
        const fields = {
            subject: draft.subject || '',
            grade: draft.grade || '6-8',
            duration: draft.duration || '45',
            'beginner-level': draft.beginnerLevel || 'basic',
            'intermediate-level': draft.intermediateLevel || 'proficient',
            'advanced-level': draft.advancedLevel || 'exemplary',
            methodology: draft.methodology || 'inquiry-based',
            'class-size': draft.classSize || '25'
        };
        Object.entries(fields).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.value = value;
        });
    }
}

// ============================================
// GENERATE LESSON (MAIN FUNCTION)
// ============================================
async function generateLesson() {
    const subject = document.getElementById('subject')?.value.trim();
    if (!subject) {
        showToast('Please enter a subject/topic', 'error');
        document.getElementById('subject')?.focus();
        return false;
    }
    
    showLoading(true);
    
    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Increment usage via API
    await incrementUsage();
    
    const slos = generateSLOs(subject);
    const activities = generateActivities(subject);
    const lessonPlan = generateLessonPlan(
        subject,
        document.getElementById('grade')?.value || '6-8',
        document.getElementById('duration')?.value || '45',
        document.getElementById('methodology')?.value || 'inquiry-based'
    );
    
    const topicResult = document.getElementById('topic-result');
    if (topicResult) topicResult.textContent = subject;
    
    displaySLOs(slos);
    displayActivities(activities);
    displayLessonPlan(lessonPlan);
    
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) {
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    currentLessonData = { subject, slos, activities, lessonPlan };
    showToast('Lesson generated successfully! 🎉', 'success');
    showLoading(false);
    return true;
}

// ============================================
// EXPORT FUNCTIONS
// ============================================
function exportToPDF() {
    const subject = document.getElementById('subject')?.value || 'Lesson';
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        showToast('Please allow popups for PDF export', 'error');
        return;
    }
    printWindow.document.write(`
        <html><head><title>Lesson Plan - ${subject}</title>
        <style>
            body{font-family:Arial;padding:30px;max-width:800px;margin:auto}
            h1{color:#4361ee;border-bottom:2px solid #4361ee;padding-bottom:10px}
            h2{color:#3a0ca3;margin-top:25px}
            h3{color:#6c757d;margin-top:20px}
            ul{line-height:1.8}
            .card{margin:15px 0;padding:15px;border-left:4px solid #4361ee;background:#f8f9fa}
        </style>
        </head>
        <body>
            <h1>Differentiated Lesson Plan: ${subject}</h1>
            <p>Grade: ${document.getElementById('grade')?.value || 'N/A'} | Duration: ${document.getElementById('duration')?.value || 'N/A'} min</p>
            <hr>
            ${document.getElementById('full-lesson-plan')?.innerHTML || ''}
            <hr>
            <h2>Differentiated Activities</h2>
            <h3>Beginner Level</h3>
            ${document.getElementById('beginner-activities')?.innerHTML || ''}
            <h3>Intermediate Level</h3>
            ${document.getElementById('intermediate-activities')?.innerHTML || ''}
            <h3>Advanced Level</h3>
            ${document.getElementById('advanced-activities')?.innerHTML || ''}
        </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
    showToast('PDF ready for printing', 'success');
}

function exportToWord() {
    const subject = document.getElementById('subject')?.value || 'Lesson';
    const content = `<html><head><meta charset="UTF-8"><title>Lesson Plan</title></head>
        <body>
            <h1>Differentiated Lesson Plan: ${subject}</h1>
            <p>Grade: ${document.getElementById('grade')?.value || 'N/A'} | Duration: ${document.getElementById('duration')?.value || 'N/A'} min</p>
            ${document.getElementById('full-lesson-plan')?.innerHTML || ''}
            <h2>Differentiated Activities</h2>
            <h3>Beginner</h3>${document.getElementById('beginner-activities')?.innerHTML || ''}
            <h3>Intermediate</h3>${document.getElementById('intermediate-activities')?.innerHTML || ''}
            <h3>Advanced</h3>${document.getElementById('advanced-activities')?.innerHTML || ''}
        </body></html>`;
    const blob = new Blob([content], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Lesson_Plan_${(subject || 'lesson').replace(/\s/g, '_')}.doc`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('Word document downloaded', 'success');
}

function exportToTXT() {
    const subject = document.getElementById('subject')?.value || 'Lesson';
    const content = `DIFFERENTIATED LESSON PLAN\nSubject: ${subject}\nGrade: ${document.getElementById('grade')?.value || 'N/A'}\n\nLESSON CONTENT:\n${document.getElementById('full-lesson-plan')?.innerText || ''}\n\nACTIVITIES:\n${document.getElementById('beginner-activities')?.innerText || ''}\n${document.getElementById('intermediate-activities')?.innerText || ''}\n${document.getElementById('advanced-activities')?.innerText || ''}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Lesson_Plan_${(subject || 'lesson').replace(/\s/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('Text file downloaded', 'success');
}

// ============================================
// RESET FORM
// ============================================
function resetForm() {
    const fields = ['subject', 'grade', 'duration', 'beginner-level', 'intermediate-level', 'advanced-level', 'methodology', 'class-size'];
    const defaults = {
        subject: '',
        grade: '6-8',
        duration: '45',
        'beginner-level': 'basic',
        'intermediate-level': 'proficient',
        'advanced-level': 'exemplary',
        methodology: 'inquiry-based',
        'class-size': '25'
    };
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = defaults[id] || '';
    });
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) resultsSection.style.display = 'none';
    localStorage.removeItem(`${TOOL_SLUG}_draft`);
    document.getElementById('subject')?.focus();
    showToast('Form reset', 'info');
}

// ============================================
// EVENT LISTENERS
// ============================================
function initEventListeners() {
    // Theme toggle
    document.getElementById('theme-toggle-btn')?.addEventListener('click', toggleTheme);
    
    // Scroll buttons
    setupScrollButtons();
    
    // Navigation
    setupNavigation();
    
    // Generate button
    document.getElementById('generate-btn')?.addEventListener('click', generateLesson);
    
    // Reset button
    document.getElementById('reset-btn')?.addEventListener('click', resetForm);
    
    // New ideas button
    document.getElementById('new-ideas-btn')?.addEventListener('click', generateLesson);
    
    // Export buttons
    document.getElementById('export-pdf')?.addEventListener('click', exportToPDF);
    document.getElementById('export-word')?.addEventListener('click', exportToWord);
    document.getElementById('export-txt')?.addEventListener('click', exportToTXT);
    
    // Auto-save on input
    const autoSaveFields = ['subject', 'grade', 'duration', 'methodology', 'class-size', 'beginner-level', 'intermediate-level', 'advanced-level'];
    autoSaveFields.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', autoSaveDraft);
            el.addEventListener('change', autoSaveDraft);
        }
    });
    
    // Reactions
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', () => addReaction(btn.dataset.emoji));
    });
    
    // Share buttons
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', () => shareLesson(btn.dataset.platform));
    });
}

// ============================================
// INITIALIZATION
// ============================================
async function init() {
    // Theme
    initTheme();
    
    // Typewriter
    initTypewriter();
    
    // Event listeners
    initEventListeners();
    
    // Load data from API with fallback
    await loadStats();
    await loadReactionsFromAPI();
    
    // Load usage
    usageCount = getLocalData('usage', 0);
    updateUsageDisplay();
    
    // Load shares
    shareCount = getLocalData('shares', 0);
    updateShareDisplay();
    
    // Load draft
    loadDraft();
    
    // Check if API is available
    if (!isApiAvailable) {
        showToast('Working in offline mode - data saved locally', 'info');
    } else {
        showToast('Welcome! Enter a subject to get started. 🚀', 'info');
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
