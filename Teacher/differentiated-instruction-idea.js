// ============================================
// API Configuration - Using provided test-db.js endpoints
// Tool Slug: differentiated-instruction-idea
// ============================================

const API_BASE = '/api';
const TOOL_SLUG = 'differentiated-instruction-idea';

// User ID Management
let userId = localStorage.getItem('user_id');
if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('user_id', userId);
}

// State Management
let currentLessonData = null;
let userReactions = new Set();
let currentReactionCounts = {};

// Load user's previous reactions from localStorage
const userReactionsKey = `user_reactions_${TOOL_SLUG}_${userId}`;
const savedReactions = localStorage.getItem(userReactionsKey);
if (savedReactions) {
    userReactions = new Set(JSON.parse(savedReactions));
}

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
    shareCount: document.getElementById('share-count'),
    autoSaveStatus: document.getElementById('auto-save-status')
};

// ============================================
// Toast Notifications
// ============================================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    elements.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// Loading Spinner
// ============================================
function showLoading(show) {
    elements.loadingSpinner.style.display = show ? 'flex' : 'none';
}

// ============================================
// API Calls - Using test-db.js endpoints
// ============================================

async function apiCall(endpoint, method = 'GET', body = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        if (body) {
            options.body = JSON.stringify(body);
        }
        
        // Build URL based on endpoint pattern
        let url;
        if (endpoint === 'generate-slos' || endpoint === 'generate-activities' || endpoint === 'generate-full-lesson') {
            url = `${API_BASE}/${endpoint}`;
        } else if (endpoint === 'usage' || endpoint === 'reactions' || endpoint === 'shares' || endpoint === 'stats') {
            url = `${API_BASE}/${TOOL_SLUG}/${endpoint}`;
        } else {
            url = `${API_BASE}/${TOOL_SLUG}/${endpoint}`;
        }
        
        console.log(`API Call: ${method} ${url}`, body);
        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`API Response:`, data);
        return data;
    } catch (error) {
        console.error('API Error:', error);
        showToast(`API Error: ${error.message}`, 'error');
        throw error;
    }
}

// ============================================
// Usage Counter - TiDB Integration
// ============================================

async function updateUsageCounter(increment = false) {
    try {
        if (increment) {
            await apiCall('usage', 'POST', { user_id: userId, tool_slug: TOOL_SLUG });
        }
        
        const data = await apiCall('usage', 'GET');
        const count = data.count || 0;
        elements.usageCount.textContent = count;
        return count;
    } catch (error) {
        console.error('Usage counter error:', error);
        // Fallback to localStorage
        let count = parseInt(localStorage.getItem(`${TOOL_SLUG}_usage`) || '0');
        if (increment) {
            count++;
            localStorage.setItem(`${TOOL_SLUG}_usage`, count);
        }
        elements.usageCount.textContent = count;
        return count;
    }
}

// ============================================
// Reactions System - TiDB Integration
// ============================================

async function loadReactions() {
    try {
        const data = await apiCall('reactions', 'GET');
        currentReactionCounts = data.reactions || {};
        
        // Update UI with reaction counts
        document.querySelectorAll('.reaction-btn').forEach(btn => {
            const emoji = btn.dataset.emoji;
            const emojiMap = { '👍': 'like', '❤️': 'love', '😮': 'wow', '😢': 'sad', '😠': 'angry', '😂': 'laugh', '🎉': 'celebrate' };
            const reactionType = emojiMap[emoji] || emoji;
            const countSpan = btn.querySelector('.reaction-count');
            countSpan.textContent = currentReactionCounts[reactionType] || 0;
            
            // Check if user already reacted
            if (userReactions.has(emoji)) {
                btn.classList.add('reacted');
            }
        });
    } catch (error) {
        console.error('Load reactions error:', error);
    }
}

async function addReaction(emoji) {
    // Check if user already reacted with this emoji
    if (userReactions.has(emoji)) {
        showToast(`You already reacted with ${emoji}`, 'warning');
        return false;
    }
    
    showLoading(true);
    try {
        const data = await apiCall('reactions', 'POST', { 
            emoji: emoji, 
            user_id: userId,
            tool_slug: TOOL_SLUG 
        });
        
        // Update local state
        userReactions.add(emoji);
        localStorage.setItem(userReactionsKey, JSON.stringify(Array.from(userReactions)));
        
        // Update counts from response
        if (data.counts) {
            currentReactionCounts = data.counts;
        }
        
        // Refresh UI
        await loadReactions();
        showToast(`Thanks for your feedback!`, 'success');
        return true;
    } catch (error) {
        console.error('Add reaction error:', error);
        showToast('Failed to save reaction. Please try again.', 'error');
        return false;
    } finally {
        showLoading(false);
    }
}

// ============================================
// Share System - TiDB Integration
// ============================================

async function updateShareCount() {
    try {
        const data = await apiCall('shares', 'GET');
        const count = data.shares || 0;
        elements.shareCount.textContent = count;
        return count;
    } catch (error) {
        console.error('Share count error:', error);
        let count = parseInt(localStorage.getItem(`${TOOL_SLUG}_shares`) || '0');
        elements.shareCount.textContent = count;
        return count;
    }
}

async function recordShare(platform) {
    try {
        await apiCall('shares', 'POST', { 
            platform: platform, 
            user_id: userId,
            tool_slug: TOOL_SLUG 
        });
        await updateShareCount();
    } catch (error) {
        console.error('Record share error:', error);
        let count = parseInt(localStorage.getItem(`${TOOL_SLUG}_shares`) || '0') + 1;
        localStorage.setItem(`${TOOL_SLUG}_shares`, count);
        elements.shareCount.textContent = count;
    }
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

// ============================================
// Dark/Light Mode - localStorage
// ============================================

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        const moonIcon = document.querySelector('#theme-toggle-btn .fa-moon');
        const sunIcon = document.querySelector('#theme-toggle-btn .fa-sun');
        if (moonIcon) moonIcon.style.display = 'none';
        if (sunIcon) sunIcon.style.display = 'inline-block';
    }
}

function toggleTheme() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const moonIcon = document.querySelector('#theme-toggle-btn .fa-moon');
    const sunIcon = document.querySelector('#theme-toggle-btn .fa-sun');
    
    if (isDark) {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        if (moonIcon) moonIcon.style.display = 'inline-block';
        if (sunIcon) sunIcon.style.display = 'none';
        showToast('Light mode activated', 'info');
    } else {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        if (moonIcon) moonIcon.style.display = 'none';
        if (sunIcon) sunIcon.style.display = 'inline-block';
        showToast('Dark mode activated', 'info');
    }
}

// ============================================
// Scroll Functions
// ============================================

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// ============================================
// Auto-Save Draft - localStorage
// ============================================

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
        showToast('Draft loaded', 'info');
    }
}

// ============================================
// AI Generation - Grok API via test-db.js
// ============================================

async function generateLesson() {
    const subject = elements.subject.value.trim();
    if (!subject) {
        showToast('Please enter a subject/topic', 'error');
        elements.subject.focus();
        return false;
    }
    
    showLoading(true);
    
    try {
        // Update usage counter in TiDB
        await updateUsageCounter(true);
        
        // Get AI-generated SLOs from Grok API
        const slosData = await apiCall('generate-slos', 'POST', {
            subject: subject,
            topic: subject,
            grade: elements.grade.value
        });
        
        // Get AI-generated differentiated activities
        const activitiesData = await apiCall('generate-differentiated', 'POST', {
            subject: subject,
            topic: subject,
            studentLevels: {
                beginner: elements.beginnerLevel.value,
                intermediate: elements.intermediateLevel.value,
                advanced: elements.advancedLevel.value
            }
        });
        
        // Get AI-generated full lesson plan
        const lessonData = await apiCall('generate-full-lesson', 'POST', {
            subject: subject,
            topic: subject,
            className: elements.grade.value,
            duration: elements.duration.value
        });
        
        // Display results
        elements.topicResult.textContent = subject;
        
        // Display SLOs
        displaySLOs(slosData.slos || generateFallbackSLOs(subject));
        
        // Display activities
        displayActivities(activitiesData.ideas || generateFallbackActivities(subject));
        
        // Display lesson plan
        displayLessonPlan(lessonData, subject, elements.grade.value, elements.duration.value);
        
        elements.resultsSection.style.display = 'block';
        elements.resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        currentLessonData = { subject, activities: activitiesData.ideas, slos: slosData.slos, lessonPlan: lessonData };
        showToast('Lesson generated successfully using Grok API!', 'success');
        return true;
    } catch (error) {
        console.error('Generation error:', error);
        showToast('Using fallback generation (API issue)', 'warning');
        
        // Fallback generation
        elements.topicResult.textContent = subject;
        displaySLOs(generateFallbackSLOs(subject));
        displayActivities(generateFallbackActivities(subject));
        displayFallbackLessonPlan(subject, elements.grade.value, elements.duration.value);
        
        elements.resultsSection.style.display = 'block';
        elements.resultsSection.scrollIntoView({ behavior: 'smooth' });
        return true;
    } finally {
        showLoading(false);
    }
}

function generateFallbackSLOs(subject) {
    return [
        `Demonstrate understanding of key ${subject} concepts and terminology`,
        `Apply ${subject} knowledge to solve real-world problems`,
        `Analyze and evaluate different aspects of ${subject}`,
        `Create innovative solutions using ${subject} principles`,
        `Communicate ${subject} ideas effectively in written and oral form`,
        `Collaborate with peers to explore ${subject} in depth`
    ];
}

function generateFallbackActivities(subject) {
    return {
        belowGrade: [
            `Hands-on manipulative activity for ${subject} with visual supports`,
            `Matching game pairing key ${subject} terms with simple definitions`,
            `Fill-in-the-blank worksheet with word bank for ${subject} concepts`,
            `Step-by-step guided practice with teacher support`
        ],
        atGrade: [
            `Collaborative ${subject} investigation with guided questions`,
            `Case study analysis applying ${subject} to real scenarios`,
            `Group discussion and peer teaching on ${subject} topics`,
            `Problem-solving activity with multiple solution paths`
        ],
        aboveGrade: [
            `Open-ended research project on advanced ${subject} concepts`,
            `Critical analysis and debate on ${subject} issues`,
            `Design thinking challenge using ${subject} knowledge`,
            `Mentorship opportunity teaching ${subject} to peers`
        ]
    };
}

function displaySLOs(slos) {
    if (!elements.slosList) return;
    
    if (Array.isArray(slos)) {
        elements.slosList.innerHTML = slos.map(slo => `
            <div class="slo-item">
                <i class="fas fa-check-circle"></i>
                <span>${slo}</span>
            </div>
        `).join('');
    } else {
        elements.slosList.innerHTML = '<div class="slo-item"><i class="fas fa-info-circle"></i><span>SLOs will appear here after generation</span></div>';
    }
}

function displayActivities(activities) {
    // Beginner activities (below grade)
    const beginnerList = activities.belowGrade || activities.beginner || [];
    elements.beginnerActivities.innerHTML = beginnerList.map(activity => `
        <div class="activity-item">
            <strong><i class="fas fa-seedling"></i> ${typeof activity === 'string' ? activity : activity.title || activity}</strong>
            <em>${typeof activity === 'string' ? 'Scaffolded support with visual aids and sentence starters' : (activity.detail || 'Differentiated for beginner learners')}</em>
        </div>
    `).join('');
    
    // Intermediate activities (at grade)
    const intermediateList = activities.atGrade || activities.intermediate || [];
    elements.intermediateActivities.innerHTML = intermediateList.map(activity => `
        <div class="activity-item">
            <strong><i class="fas fa-tree"></i> ${typeof activity === 'string' ? activity : activity.title || activity}</strong>
            <em>${typeof activity === 'string' ? 'Collaborative learning with guided inquiry' : (activity.detail || 'Designed for grade-level proficiency')}</em>
        </div>
    `).join('');
    
    // Advanced activities (above grade)
    const advancedList = activities.aboveGrade || activities.advanced || [];
    elements.advancedActivities.innerHTML = advancedList.map(activity => `
        <div class="activity-item">
            <strong><i class="fas fa-mountain"></i> ${typeof activity === 'string' ? activity : activity.title || activity}</strong>
            <em>${typeof activity === 'string' ? 'Extension activities with critical thinking focus' : (activity.detail || 'Challenging tasks for advanced learners')}</em>
        </div>
    `).join('');
}

function displayLessonPlan(lessonData, subject, grade, duration) {
    const durationNum = parseInt(duration) || 45;
    
    elements.fullLessonPlan.innerHTML = `
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
            <li><strong>Direct Instruction (10-15 min):</strong> Introduce ${subject} concepts</li>
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
            <li><strong>Beginner (Below Grade):</strong> Visual supports, sentence starters, peer assistance, modified worksheets</li>
            <li><strong>Intermediate (At Grade):</strong> Guided questions, collaborative learning, choice boards, standard worksheets</li>
            <li><strong>Advanced (Above Grade):</strong> Open-ended tasks, cross-curricular connections, mentoring roles, extension projects</li>
        </ul>
        
        <h4><i class="fas fa-home"></i> Homework/Extension</h4>
        <ul>
            <li>Complete ${subject} practice problems at appropriate level</li>
            <li>Research a real-world application of ${subject}</li>
            <li>Prepare one question about ${subject} for next class</li>
        </ul>
    `;
}

function displayFallbackLessonPlan(subject, grade, duration) {
    const durationNum = parseInt(duration) || 45;
    
    elements.fullLessonPlan.innerHTML = `
        <h4><i class="fas fa-bullseye"></i> Learning Objectives</h4>
        <ul>
            <li>Students will understand fundamental ${subject} concepts</li>
            <li>Students will apply ${subject} knowledge to solve problems</li>
        </ul>
        
        <h4><i class="fas fa-clock"></i> Lesson Structure (${durationNum} minutes)</h4>
        <ul>
            <li><strong>Opening (5 min):</strong> Introduction to ${subject}</li>
            <li><strong>Main Activity (${durationNum - 15} min):</strong> Differentiated ${subject} tasks</li>
            <li><strong>Assessment (10 min):</strong> Exit ticket and review</li>
        </ul>
        
        <h4><i class="fas fa-universal-access"></i> Differentiation</h4>
        <ul>
            <li>Beginner: Scaffolded support and visual aids</li>
            <li>Intermediate: Grade-level activities with guidance</li>
            <li>Advanced: Extension challenges and independent research</li>
        </ul>
    `;
}

// ============================================
// Export Functions
// ============================================

function exportToPDF() {
    if (!currentLessonData && elements.resultsSection.style.display !== 'block') {
        showToast('Generate a lesson first', 'error');
        return;
    }
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Lesson Plan - ${elements.subject.value || 'Differentiated Instruction'}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #4361ee; }
                h2 { color: #3a0ca3; margin-top: 20px; }
                h3 { color: #6cbf6c; }
                .activity { margin: 10px 0; padding: 10px; border-left: 3px solid #4361ee; }
                @media print { body { padding: 0; } }
            </style>
        </head>
        <body>
            <h1>Differentiated Lesson Plan: ${elements.subject.value || 'Lesson'}</h1>
            <p>Grade: ${elements.grade.value} | Duration: ${elements.duration.value} min</p>
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <hr>
            ${elements.fullLessonPlan ? elements.fullLessonPlan.innerHTML : ''}
            <hr>
            <h2>Differentiated Activities</h2>
            <h3>Beginner Level (Below Grade)</h3>
            ${elements.beginnerActivities ? elements.beginnerActivities.innerHTML : ''}
            <h3>Intermediate Level (At Grade)</h3>
            ${elements.intermediateActivities ? elements.intermediateActivities.innerHTML : ''}
            <h3>Advanced Level (Above Grade)</h3>
            ${elements.advancedActivities ? elements.advancedActivities.innerHTML : ''}
        </body>
        </html>
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
    
    const content = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
        <head>
            <meta charset="UTF-8">
            <title>Lesson Plan - ${elements.subject.value || 'Differentiated Instruction'}</title>
        </head>
        <body>
            <h1>Differentiated Lesson Plan: ${elements.subject.value || 'Lesson'}</h1>
            <p>Grade: ${elements.grade.value} | Duration: ${elements.duration.value} min</p>
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <hr>
            ${elements.fullLessonPlan ? elements.fullLessonPlan.innerHTML : ''}
            <hr>
            <h2>Differentiated Activities</h2>
            <h3>Beginner Level</h3>
            ${elements.beginnerActivities ? elements.beginnerActivities.innerHTML : ''}
            <h3>Intermediate Level</h3>
            ${elements.intermediateActivities ? elements.intermediateActivities.innerHTML : ''}
            <h3>Advanced Level</h3>
            ${elements.advancedActivities ? elements.advancedActivities.innerHTML : ''}
        </body>
        </html>
    `;
    
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
    
    const content = `
DIFFERENTIATED LESSON PLAN
==========================
Subject: ${elements.subject.value || 'Not specified'}
Grade: ${elements.grade.value}
Duration: ${elements.duration.value} minutes
Generated: ${new Date().toLocaleString()}

LESSON CONTENT:
${elements.fullLessonPlan ? (elements.fullLessonPlan.innerText || elements.fullLessonPlan.textContent) : ''}

DIFFERENTIATED ACTIVITIES:

BEGINNER LEVEL (Below Grade):
${elements.beginnerActivities ? (elements.beginnerActivities.innerText || elements.beginnerActivities.textContent) : ''}

INTERMEDIATE LEVEL (At Grade):
${elements.intermediateActivities ? (elements.intermediateActivities.innerText || elements.intermediateActivities.textContent) : ''}

ADVANCED LEVEL (Above Grade):
${elements.advancedActivities ? (elements.advancedActivities.innerText || elements.advancedActivities.textContent) : ''}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Lesson_Plan_${(elements.subject.value || 'lesson').replace(/\s/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('Text file downloaded', 'success');
}

// ============================================
// Reset Function
// ============================================

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

// ============================================
// Event Listeners
// ============================================

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
    
    // Auto-save on input
    elements.subject.addEventListener('input', autoSaveDraft);
    elements.grade.addEventListener('change', autoSaveDraft);
    elements.duration.addEventListener('change', autoSaveDraft);
    elements.methodology.addEventListener('change', autoSaveDraft);
    elements.classSize.addEventListener('input', autoSaveDraft);
    elements.beginnerLevel.addEventListener('change', autoSaveDraft);
    elements.intermediateLevel.addEventListener('change', autoSaveDraft);
    elements.advancedLevel.addEventListener('change', autoSaveDraft);
    
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
// Initialize App
// ============================================

async function init() {
    initTheme();
    initEventListeners();
    await updateUsageCounter(false);
    await loadReactions();
    await updateShareCount();
    loadDraft();
    showToast('Welcome! Enter a subject to get started. Connected to TiDB & Grok API.', 'info');
}

// Start the app
init();
