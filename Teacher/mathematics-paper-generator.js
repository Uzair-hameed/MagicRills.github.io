// ============================================
// MATHEMATICS PAPER GENERATOR - COMPLETE JS
// Cloudflare Workers API Integration
// All 55+ Features Included
// ============================================

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    API_BASE: 'https://magicrills-api.uzairhameed01.workers.dev',
    API_KEY: 'magicrills-grok-api.uzairhameed01.workers.dev',
    TOOL_SLUG: 'mathematics-paper-generator',
    TOOL_NAME: 'Mathematics Paper Generator',
    CATEGORY: 'Teacher'
};

// ============================================
// GLOBAL VARIABLES
// ============================================
let objectiveQuestions = [];
let subjectiveQuestions = [];
let currentUserId = null;
let userReactions = new Set();
let toolStats = {
    usage: 0,
    views: 0,
    shares: 0,
    followers: 0
};

// DOM Elements
const elements = {};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    initializeElements();
    generateUserId();
    await loadInitialData();
    setupEventListeners();
    setupAutoSave();
    loadDarkModePreference();
    loadDraftFromStorage();
    renderQuestionsList();
    updateTotalMarks();
    incrementUsage(); // Tool load par usage +1
    renderDashboardStats();
});

// Initialize DOM references
function initializeElements() {
    const ids = [
        'loading-spinner', 'toast-container', 'usage-count', 'paper-name',
        'grade-level', 'subject', 'school-name', 'time-duration', 'total-marks',
        'instructions', 'questions-list', 'paper-preview', 'template-name',
        'templates-list', 'add-question-btn', 'clear-all-questions',
        'export-pdf', 'export-doc', 'export-txt', 'save-template',
        'generate-slos', 'generate-activities', 'generate-lesson',
        'ai-subject', 'ai-topic', 'ai-grade', 'activity-subject',
        'activity-methods', 'lesson-subject', 'lesson-topic',
        'lesson-class', 'lesson-duration', 'slos-result',
        'activities-result', 'lesson-result', 'share-count',
        'stats-usage', 'stats-views', 'stats-shares', 'stats-followers',
        'home-btn', 'back-btn'
    ];
    
    ids.forEach(id => {
        elements[id] = document.getElementById(id);
    });
}

// Generate unique user ID
function generateUserId() {
    let userId = localStorage.getItem('math_paper_user_id');
    if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('math_paper_user_id', userId);
    }
    currentUserId = userId;
}

// ============================================
// CLOUDFLARE WORKERS API CALLS
// ============================================
async function apiCall(endpoint, method = 'GET', body = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': CONFIG.API_KEY
            }
        };
        if (body) {
            options.body = JSON.stringify(body);
        }
        
        const response = await fetch(`${CONFIG.API_BASE}${endpoint}`, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        return { success: false, error: error.message };
    }
}

// ============================================
// TOOL STATS & USAGE
// ============================================
async function loadInitialData() {
    await Promise.all([
        loadToolStats(),
        loadReactions(),
        loadShareCount()
    ]);
}

async function loadToolStats() {
    try {
        const data = await apiCall(`/api/stats?tool_slug=${CONFIG.TOOL_SLUG}`);
        if (data.success) {
            toolStats = data.stats || toolStats;
            renderDashboardStats();
        } else {
            // Fallback to localStorage
            loadStatsFromLocal();
        }
    } catch (error) {
        console.error('Error loading stats:', error);
        loadStatsFromLocal();
    }
}

function loadStatsFromLocal() {
    const saved = localStorage.getItem(`math_paper_stats_${CONFIG.TOOL_SLUG}`);
    if (saved) {
        try {
            toolStats = JSON.parse(saved);
            renderDashboardStats();
        } catch(e) {}
    }
}

function renderDashboardStats() {
    if (elements['stats-usage']) elements['stats-usage'].textContent = toolStats.usage || 0;
    if (elements['stats-views']) elements['stats-views'].textContent = toolStats.views || 0;
    if (elements['stats-shares']) elements['stats-shares'].textContent = toolStats.shares || 0;
    if (elements['stats-followers']) elements['stats-followers'].textContent = toolStats.followers || 0;
    if (elements['usage-count']) elements['usage-count'].textContent = toolStats.usage || 0;
}

async function incrementUsage() {
    try {
        const data = await apiCall('/api/usage', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            user_id: currentUserId
        });
        if (data.success) {
            toolStats.usage = data.total_usage || toolStats.usage + 1;
            renderDashboardStats();
            saveStatsToLocal();
        } else {
            // Fallback: increment locally
            toolStats.usage = (toolStats.usage || 0) + 1;
            renderDashboardStats();
            saveStatsToLocal();
        }
    } catch (error) {
        console.error('Error incrementing usage:', error);
        // Fallback: increment locally
        toolStats.usage = (toolStats.usage || 0) + 1;
        renderDashboardStats();
        saveStatsToLocal();
    }
}

function saveStatsToLocal() {
    localStorage.setItem(`math_paper_stats_${CONFIG.TOOL_SLUG}`, JSON.stringify(toolStats));
}

// ============================================
// REACTIONS SYSTEM - COLORFUL THEME
// ============================================
async function loadReactions() {
    try {
        const data = await apiCall(`/api/reactions?tool_slug=${CONFIG.TOOL_SLUG}`);
        if (data.success && data.reactions) {
            updateReactionCounts(data.reactions);
        } else {
            loadReactionsFromLocal();
        }
    } catch (error) {
        console.error('Error loading reactions:', error);
        loadReactionsFromLocal();
    }
}

function loadReactionsFromLocal() {
    const saved = localStorage.getItem(`math_paper_reactions_${CONFIG.TOOL_SLUG}`);
    if (saved) {
        try {
            const reactions = JSON.parse(saved);
            updateReactionCounts(reactions);
        } catch(e) {}
    }
}

function updateReactionCounts(reactions) {
    const reactionMap = {
        'like': '👍', 'love': '❤️', 'wow': '😮',
        'sad': '😢', 'angry': '😠', 'laugh': '😂', 'celebrate': '🎉'
    };
    
    for (const [type, count] of Object.entries(reactions)) {
        const emoji = reactionMap[type];
        if (emoji) {
            const btn = document.querySelector(`.reaction-btn[data-emoji="${emoji}"]`);
            if (btn) {
                const countSpan = btn.querySelector('.reaction-count');
                if (countSpan) {
                    countSpan.textContent = count || 0;
                }
            }
        }
    }
    
    localStorage.setItem(`math_paper_reactions_${CONFIG.TOOL_SLUG}`, JSON.stringify(reactions));
}

async function addReaction(emoji) {
    const emojiToType = {
        '👍': 'like', '❤️': 'love', '😮': 'wow',
        '😢': 'sad', '😠': 'angry', '😂': 'laugh', '🎉': 'celebrate'
    };
    
    const reactionType = emojiToType[emoji];
    if (!reactionType) return;
    
    const reactionKey = `${currentUserId}_${reactionType}`;
    if (userReactions.has(reactionKey)) {
        showToast(`You already reacted with ${emoji}!`, 'info');
        return;
    }
    
    try {
        const data = await apiCall('/api/reactions', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            emoji: emoji,
            user_id: currentUserId
        });
        
        if (data.already_reacted) {
            showToast(`You already reacted with ${emoji}!`, 'info');
        } else if (data.success !== false) {
            userReactions.add(reactionKey);
            showToast(`Thanks for your reaction! ❤️`, 'success');
            if (data.counts) {
                updateReactionCounts(data.counts);
            } else {
                await loadReactions();
            }
        } else {
            updateReactionLocally(reactionType);
        }
    } catch (error) {
        console.error('Error adding reaction:', error);
        updateReactionLocally(reactionType);
        showToast(`Reacted with ${emoji} (saved locally)`, 'success');
    }
}

function updateReactionLocally(reactionType) {
    const reactions = JSON.parse(localStorage.getItem(`math_paper_reactions_${CONFIG.TOOL_SLUG}`) || '{}');
    reactions[reactionType] = (reactions[reactionType] || 0) + 1;
    updateReactionCounts(reactions);
    userReactions.add(`${currentUserId}_${reactionType}`);
}

// ============================================
// SHARE SYSTEM
// ============================================
async function loadShareCount() {
    try {
        const data = await apiCall(`/api/shares?tool_slug=${CONFIG.TOOL_SLUG}`);
        if (data.success && elements['share-count']) {
            toolStats.shares = data.shares || 0;
            elements['share-count'].innerHTML = `<i class="fas fa-chart-simple"></i> ${data.shares || 0} shares`;
            renderDashboardStats();
        }
    } catch (error) {
        console.error('Error loading shares:', error);
        const localShares = parseInt(localStorage.getItem(`math_paper_shares_${CONFIG.TOOL_SLUG}`) || '0');
        if (elements['share-count']) {
            elements['share-count'].innerHTML = `<i class="fas fa-chart-simple"></i> ${localShares} shares`;
        }
    }
}

async function recordShare(platform) {
    try {
        const data = await apiCall('/api/shares', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            platform: platform,
            user_id: currentUserId
        });
        if (data.success !== false) {
            toolStats.shares = data.shares || toolStats.shares + 1;
            renderDashboardStats();
            saveStatsToLocal();
            await loadShareCount();
        }
    } catch (error) {
        console.error('Error recording share:', error);
        let localShares = parseInt(localStorage.getItem(`math_paper_shares_${CONFIG.TOOL_SLUG}`) || '0');
        localShares++;
        localStorage.setItem(`math_paper_shares_${CONFIG.TOOL_SLUG}`, localShares);
        if (elements['share-count']) {
            elements['share-count'].innerHTML = `<i class="fas fa-chart-simple"></i> ${localShares} shares`;
        }
        toolStats.shares = localShares;
        renderDashboardStats();
        saveStatsToLocal();
    }
}

function shareOnPlatform(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Mathematics Paper Generator - Create Custom Math Papers for Your Classroom!');
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${title}%20${url}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            break;
        case 'copy':
            navigator.clipboard.writeText(window.location.href).then(() => {
                showToast('Link copied to clipboard!', 'success');
                recordShare(platform);
            }).catch(() => {
                showToast('Failed to copy link', 'error');
            });
            return;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        recordShare(platform);
        showToast(`Shared on ${platform}!`, 'success');
    }
}

// ============================================
// AI FEATURES (Grok API Integration)
// ============================================
async function generateSLOs() {
    const subject = document.getElementById('ai-subject')?.value;
    const topic = document.getElementById('ai-topic')?.value;
    const grade = document.getElementById('ai-grade')?.value;
    
    if (!subject && !topic) {
        showToast('Please enter subject or topic', 'error');
        return;
    }
    
    showLoading(true);
    try {
        const data = await apiCall('/api/ai/generate-slos', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            subject, topic, grade
        });
        
        if (data.success && data.slos) {
            const resultDiv = document.getElementById('slos-result');
            if (resultDiv) {
                resultDiv.innerHTML = '<strong>📚 Student Learning Outcomes:</strong><ul>' + 
                    data.slos.map(slo => `<li>${escapeHtml(slo)}</li>`).join('') + '</ul>';
            }
            showToast('SLOs generated successfully!', 'success');
        } else {
            showToast('Failed to generate SLOs', 'error');
        }
    } catch (error) {
        console.error('Error generating SLOs:', error);
        showToast('Failed to generate SLOs', 'error');
    } finally {
        showLoading(false);
    }
}

async function generateActivities() {
    const subject = document.getElementById('activity-subject')?.value;
    const methods = document.getElementById('activity-methods')?.value;
    
    if (!subject) {
        showToast('Please enter subject', 'error');
        return;
    }
    
    showLoading(true);
    try {
        const data = await apiCall('/api/ai/generate-activities', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            subject,
            methodologies: methods ? methods.split(',').map(m => m.trim()) : ['interactive']
        });
        
        if (data.success && data.activities) {
            const resultDiv = document.getElementById('activities-result');
            if (resultDiv) {
                resultDiv.innerHTML = '<strong>🎯 Learning Activities:</strong><ul>' + 
                    data.activities.map(activity => `<li>${escapeHtml(activity)}</li>`).join('') + '</ul>';
            }
            showToast('Activities generated!', 'success');
        } else {
            showToast('Failed to generate activities', 'error');
        }
    } catch (error) {
        console.error('Error generating activities:', error);
        showToast('Failed to generate activities', 'error');
    } finally {
        showLoading(false);
    }
}

async function generateLessonPlan() {
    const subject = document.getElementById('lesson-subject')?.value;
    const topic = document.getElementById('lesson-topic')?.value;
    const className = document.getElementById('lesson-class')?.value;
    const duration = document.getElementById('lesson-duration')?.value;
    
    if (!subject) {
        showToast('Please enter subject', 'error');
        return;
    }
    
    showLoading(true);
    try {
        const data = await apiCall('/api/ai/generate-full-lesson', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            subject, topic, className, duration: duration || '45'
        });
        
        if (data.success) {
            const resultDiv = document.getElementById('lesson-result');
            if (resultDiv) {
                resultDiv.innerHTML = `
                    <strong>📖 Lesson Plan</strong><br><br>
                    <strong>SLOs:</strong><ul>${(data.slos || []).map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul>
                    <strong>Activities:</strong><ul>${(data.activities || []).map(a => `<li>${escapeHtml(a)}</li>`).join('')}</ul>
                    <strong>Resources:</strong><ul>${(data.resources || []).map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
                    <strong>Methodology:</strong> ${escapeHtml(data.methodologyNotes || 'Interactive learning')}<br>
                    <strong>Homework:</strong> ${escapeHtml(data.hometask || 'Practice questions')}
                `;
            }
            showToast('Lesson plan generated!', 'success');
        } else {
            showToast('Failed to generate lesson plan', 'error');
        }
    } catch (error) {
        console.error('Error generating lesson plan:', error);
        showToast('Failed to generate lesson plan', 'error');
    } finally {
        showLoading(false);
    }
}

// ============================================
// QUESTION MANAGEMENT
// ============================================
function addQuestion() {
    const activeForm = document.querySelector('.question-form.active');
    if (!activeForm) return;
    
    let question = null;
    const id = activeForm.id;
    
    if (id === 'mcq-form') {
        const text = document.getElementById('mcq-text')?.value;
        if (!text) { showToast('Please enter question text', 'error'); return; }
        question = {
            type: 'mcq',
            text: text,
            options: {
                A: document.getElementById('mcq-a')?.value || '',
                B: document.getElementById('mcq-b')?.value || '',
                C: document.getElementById('mcq-c')?.value || '',
                D: document.getElementById('mcq-d')?.value || ''
            },
            answer: document.getElementById('mcq-answer')?.value || 'A',
            marks: parseInt(document.getElementById('mcq-marks')?.value) || 1
        };
        objectiveQuestions.push(question);
    } 
    else if (id === 'truefalse-form') {
        const text = document.getElementById('tf-text')?.value;
        if (!text) { showToast('Please enter statement', 'error'); return; }
        question = {
            type: 'truefalse',
            text: text,
            answer: document.getElementById('tf-answer')?.value || 'True',
            marks: parseInt(document.getElementById('tf-marks')?.value) || 1
        };
        objectiveQuestions.push(question);
    }
    else if (id === 'fillblank-form') {
        const text = document.getElementById('fb-text')?.value;
        if (!text) { showToast('Please enter sentence', 'error'); return; }
        question = {
            type: 'fillblank',
            text: text,
            answer: document.getElementById('fb-answer')?.value || '',
            marks: parseInt(document.getElementById('fb-marks')?.value) || 1
        };
        objectiveQuestions.push(question);
    }
    else if (id === 'shortanswer-form') {
        const text = document.getElementById('sa-text')?.value;
        if (!text) { showToast('Please enter question', 'error'); return; }
        question = {
            type: 'shortanswer',
            text: text,
            marks: parseInt(document.getElementById('sa-marks')?.value) || 2
        };
        objectiveQuestions.push(question);
    }
    else if (id === 'subjective-form') {
        const text = document.getElementById('subj-text')?.value;
        if (!text) { showToast('Please enter question', 'error'); return; }
        question = {
            type: 'subjective',
            text: text,
            difficulty: document.getElementById('subj-difficulty')?.value || 'Medium',
            marks: parseInt(document.getElementById('subj-marks')?.value) || 5
        };
        subjectiveQuestions.push(question);
    }
    
    if (question) {
        clearQuestionForms();
        renderQuestionsList();
        updateTotalMarks();
        saveDraftToStorage();
        generatePaperPreview();
        showToast('Question added successfully!', 'success');
    }
}

function clearQuestionForms() {
    const textFields = ['mcq-text', 'tf-text', 'fb-text', 'sa-text', 'subj-text'];
    textFields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    
    const optionFields = ['mcq-a', 'mcq-b', 'mcq-c', 'mcq-d'];
    optionFields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
}

function renderQuestionsList() {
    const container = elements['questions-list'];
    if (!container) return;
    
    if (objectiveQuestions.length === 0 && subjectiveQuestions.length === 0) {
        container.innerHTML = '<p class="empty-message">No questions added yet. Use the form above to add questions.</p>';
        return;
    }
    
    let html = '';
    let qNum = 1;
    
    objectiveQuestions.forEach((q, idx) => {
        html += `
            <div class="question-item">
                <div class="question-header">
                    <span class="question-type-badge">${getQuestionTypeName(q.type)}</span>
                    <button class="delete-question" data-type="objective" data-idx="${idx}"><i class="fas fa-trash"></i> Delete</button>
                </div>
                <p><strong>Q${qNum}.</strong> ${escapeHtml(q.text)}</p>
                ${q.type === 'mcq' ? `<p><strong>Options:</strong> A) ${escapeHtml(q.options.A)} | B) ${escapeHtml(q.options.B)} | C) ${escapeHtml(q.options.C)} | D) ${escapeHtml(q.options.D)}</p>` : ''}
                <p><strong>Marks:</strong> ${q.marks}</p>
            </div>
        `;
        qNum++;
    });
    
    subjectiveQuestions.forEach((q, idx) => {
        html += `
            <div class="question-item">
                <div class="question-header">
                    <span class="question-type-badge">Subjective (${q.difficulty})</span>
                    <button class="delete-question" data-type="subjective" data-idx="${idx}"><i class="fas fa-trash"></i> Delete</button>
                </div>
                <p><strong>Q${qNum}.</strong> ${renderMathPreview(q.text)}</p>
                <p><strong>Marks:</strong> ${q.marks}</p>
            </div>
        `;
        qNum++;
    });
    
    container.innerHTML = html;
    
    container.querySelectorAll('.delete-question').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = btn.dataset.type;
            const idx = parseInt(btn.dataset.idx);
            if (type === 'objective') {
                objectiveQuestions.splice(idx, 1);
            } else {
                subjectiveQuestions.splice(idx, 1);
            }
            renderQuestionsList();
            updateTotalMarks();
            saveDraftToStorage();
            generatePaperPreview();
            showToast('Question deleted', 'info');
        });
    });
}

function getQuestionTypeName(type) {
    const names = {
        mcq: 'Multiple Choice',
        truefalse: 'True/False',
        fillblank: 'Fill in Blank',
        shortanswer: 'Short Answer',
        subjective: 'Subjective'
    };
    return names[type] || type;
}

function renderMathPreview(text) {
    if (!text) return '';
    const parts = text.split(/(\$[^$]+\$)/g);
    let result = '';
    parts.forEach(part => {
        if (part.startsWith('$') && part.endsWith('$')) {
            const latex = part.substring(1, part.length - 1);
            try {
                result += katex.renderToString(latex, { throwOnError: false });
            } catch(e) {
                result += part;
            }
        } else {
            result += escapeHtml(part);
        }
    });
    return result;
}

function updateTotalMarks() {
    let total = 0;
    objectiveQuestions.forEach(q => total += (q.marks || 0));
    subjectiveQuestions.forEach(q => total += (q.marks || 0));
    const totalMarksInput = document.getElementById('total-marks');
    if (totalMarksInput) totalMarksInput.value = total;
}

// ============================================
// PAPER PREVIEW & EXPORT
// ============================================
function generatePaperPreview() {
    const container = elements['paper-preview'];
    if (!container) return;
    
    const paperName = document.getElementById('paper-name')?.value || 'Mathematics Paper';
    const gradeLevel = document.getElementById('grade-level')?.value || 'Grade Level';
    const subject = document.getElementById('subject')?.value || 'Mathematics';
    const schoolName = document.getElementById('school-name')?.value || 'School Name';
    const timeDuration = document.getElementById('time-duration')?.value || '60';
    const instructions = document.getElementById('instructions')?.value || 'Read all questions carefully.';
    const totalMarks = document.getElementById('total-marks')?.value || '0';
    
    let html = `
        <div class="paper-header">
            <h1 class="paper-title">${escapeHtml(paperName)}</h1>
            <p><strong>School:</strong> ${escapeHtml(schoolName)}</p>
            <p><strong>Subject:</strong> ${escapeHtml(subject)} | <strong>Grade:</strong> ${escapeHtml(gradeLevel)}</p>
            <p><strong>Time:</strong> ${timeDuration} minutes | <strong>Total Marks:</strong> ${totalMarks}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="instructions">
            <p><strong>Instructions:</strong> ${escapeHtml(instructions)}</p>
        </div>
    `;
    
    if (objectiveQuestions.length > 0) {
        html += `<h2 style="color: var(--neon-pink); margin-top: 30px;">Section A: Objective Questions</h2>`;
        objectiveQuestions.forEach((q, idx) => {
            html += `<div class="question-preview">`;
            html += `<p><strong>${idx + 1}.</strong> ${escapeHtml(q.text)}</p>`;
            if (q.type === 'mcq' && q.options) {
                html += `<p>☐ A) ${escapeHtml(q.options.A)}<br>☐ B) ${escapeHtml(q.options.B)}<br>☐ C) ${escapeHtml(q.options.C)}<br>☐ D) ${escapeHtml(q.options.D)}</p>`;
            } else if (q.type === 'truefalse') {
                html += `<p>☐ True &nbsp;&nbsp;&nbsp; ☐ False</p>`;
            } else if (q.type === 'fillblank') {
                html += `<p>Answer: _______________</p>`;
            } else if (q.type === 'shortanswer') {
                html += `<p>Answer: _________________________________</p>`;
            }
            html += `<p><strong>[${q.marks} marks]</strong></p></div>`;
        });
    }
    
    if (subjectiveQuestions.length > 0) {
        html += `<h2 style="color: var(--neon-pink); margin-top: 30px;">Section B: Subjective Questions</h2>`;
        subjectiveQuestions.forEach((q, idx) => {
            html += `<div class="question-preview">`;
            html += `<p><strong>${objectiveQuestions.length + idx + 1}.</strong> ${renderMathPreview(q.text)}</p>`;
            html += `<p><strong>[${q.marks} marks]</strong></p>`;
            html += `<p>Space for answer: _________________________________</p>`;
            html += `</div>`;
        });
    }
    
    container.innerHTML = html;
}

async function exportToPDF() {
    showLoading(true);
    try {
        const element = elements['paper-preview'];
        if (!element) return;
        
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
        
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= 297;
        }
        
        doc.save(`${document.getElementById('paper-name')?.value || 'mathematics_paper'}.pdf`);
        showToast('PDF exported successfully!', 'success');
    } catch (error) {
        console.error('PDF export error:', error);
        showToast('Failed to export PDF', 'error');
    } finally {
        showLoading(false);
    }
}

function exportToDOC() {
    const content = elements['paper-preview']?.innerHTML || '';
    const style = `
        <style>
            body { font-family: 'Times New Roman', serif; margin: 40px; }
            .paper-header { text-align: center; margin-bottom: 30px; }
            .paper-title { color: #ff6b9d; }
            .question-preview { margin-bottom: 20px; padding: 10px; background: #f9f9f9; border-radius: 10px; }
        </style>
    `;
    const fullHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8">${style}</head><body>${content}</body></html>`;
    const blob = new Blob([fullHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${document.getElementById('paper-name')?.value || 'mathematics_paper'}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('DOC file downloaded!', 'success');
}

function exportToTXT() {
    let text = '';
    text += `Paper: ${document.getElementById('paper-name')?.value || 'Mathematics Paper'}\n`;
    text += `Subject: ${document.getElementById('subject')?.value || 'Mathematics'}\n`;
    text += `Grade: ${document.getElementById('grade-level')?.value || 'Grade Level'}\n`;
    text += `School: ${document.getElementById('school-name')?.value || 'School Name'}\n`;
    text += `Time: ${document.getElementById('time-duration')?.value || '60'} minutes\n`;
    text += `Instructions: ${document.getElementById('instructions')?.value || 'No instructions'}\n`;
    text += `\n${'='.repeat(50)}\n\n`;
    
    if (objectiveQuestions.length > 0) {
        text += `SECTION A: OBJECTIVE QUESTIONS\n\n`;
        objectiveQuestions.forEach((q, idx) => {
            text += `${idx + 1}. ${q.text}\n`;
            if (q.type === 'mcq' && q.options) {
                text += `   A) ${q.options.A}\n   B) ${q.options.B}\n   C) ${q.options.C}\n   D) ${q.options.D}\n`;
            }
            text += `   [${q.marks} marks]\n\n`;
        });
    }
    
    if (subjectiveQuestions.length > 0) {
        text += `SECTION B: SUBJECTIVE QUESTIONS\n\n`;
        subjectiveQuestions.forEach((q, idx) => {
            text += `${objectiveQuestions.length + idx + 1}. ${q.text.replace(/\$/g, '')}\n`;
            text += `   [${q.marks} marks]\n\n`;
        });
    }
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${document.getElementById('paper-name')?.value || 'mathematics_paper'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('TXT file downloaded!', 'success');
}

// ============================================
// TEMPLATES (LocalStorage)
// ============================================
function saveCurrentTemplate() {
    const templateName = document.getElementById('template-name')?.value;
    if (!templateName) {
        showToast('Please enter template name', 'error');
        return;
    }
    
    const template = {
        paperName: document.getElementById('paper-name')?.value || '',
        gradeLevel: document.getElementById('grade-level')?.value || '',
        subject: document.getElementById('subject')?.value || 'Mathematics',
        schoolName: document.getElementById('school-name')?.value || '',
        timeDuration: document.getElementById('time-duration')?.value || '',
        instructions: document.getElementById('instructions')?.value || '',
        objectiveQuestions: JSON.parse(JSON.stringify(objectiveQuestions)),
        subjectiveQuestions: JSON.parse(JSON.stringify(subjectiveQuestions)),
        createdAt: new Date().toISOString()
    };
    
    let templates = JSON.parse(localStorage.getItem('math_paper_templates') || '{}');
    templates[templateName] = template;
    localStorage.setItem('math_paper_templates', JSON.stringify(templates));
    loadTemplates();
    showToast(`Template "${templateName}" saved!`, 'success');
}

function loadTemplates() {
    const container = elements['templates-list'];
    if (!container) return;
    
    const templates = JSON.parse(localStorage.getItem('math_paper_templates') || '{}');
    
    if (Object.keys(templates).length === 0) {
        container.innerHTML = '<p class="empty-message">No saved templates yet. Create your first template!</p>';
        return;
    }
    
    let html = '';
    for (const [name, template] of Object.entries(templates)) {
        html += `
            <div class="template-item">
                <span class="template-name"><i class="fas fa-file-alt"></i> ${escapeHtml(name)}</span>
                <div class="template-actions">
                    <button class="load-template-btn" data-name="${escapeHtml(name)}"><i class="fas fa-upload"></i> Load</button>
                    <button class="delete-template-btn" data-name="${escapeHtml(name)}" style="background:#dc3545;color:white;"><i class="fas fa-trash"></i> Delete</button>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
    
    container.querySelectorAll('.load-template-btn').forEach(btn => {
        btn.addEventListener('click', () => loadTemplate(btn.dataset.name));
    });
    container.querySelectorAll('.delete-template-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteTemplate(btn.dataset.name));
    });
}

function loadTemplate(name) {
    const templates = JSON.parse(localStorage.getItem('math_paper_templates') || '{}');
    const template = templates[name];
    if (!template) return;
    
    document.getElementById('paper-name').value = template.paperName || '';
    document.getElementById('grade-level').value = template.gradeLevel || '';
    document.getElementById('subject').value = template.subject || 'Mathematics';
    document.getElementById('school-name').value = template.schoolName || '';
    document.getElementById('time-duration').value = template.timeDuration || '';
    document.getElementById('instructions').value = template.instructions || '';
    
    objectiveQuestions = template.objectiveQuestions || [];
    subjectiveQuestions = template.subjectiveQuestions || [];
    
    renderQuestionsList();
    updateTotalMarks();
    generatePaperPreview();
    saveDraftToStorage();
    showToast(`Template "${name}" loaded successfully!`, 'success');
}

function deleteTemplate(name) {
    let templates = JSON.parse(localStorage.getItem('math_paper_templates') || '{}');
    delete templates[name];
    localStorage.setItem('math_paper_templates', JSON.stringify(templates));
    loadTemplates();
    showToast(`Template "${name}" deleted`, 'info');
}

// ============================================
// AUTO-SAVE DRAFT
// ============================================
function saveDraftToStorage() {
    const draft = {
        paperName: document.getElementById('paper-name')?.value || '',
        gradeLevel: document.getElementById('grade-level')?.value || '',
        subject: document.getElementById('subject')?.value || 'Mathematics',
        schoolName: document.getElementById('school-name')?.value || '',
        timeDuration: document.getElementById('time-duration')?.value || '',
        instructions: document.getElementById('instructions')?.value || '',
        objectiveQuestions: JSON.parse(JSON.stringify(objectiveQuestions)),
        subjectiveQuestions: JSON.parse(JSON.stringify(subjectiveQuestions)),
        timestamp: Date.now()
    };
    localStorage.setItem('math_paper_draft', JSON.stringify(draft));
}

function loadDraftFromStorage() {
    const draft = localStorage.getItem('math_paper_draft');
    if (!draft) return;
    
    try {
        const data = JSON.parse(draft);
        if (data.timestamp && (Date.now() - data.timestamp) < 86400000) {
            document.getElementById('paper-name').value = data.paperName || '';
            document.getElementById('grade-level').value = data.gradeLevel || '';
            document.getElementById('subject').value = data.subject || 'Mathematics';
            document.getElementById('school-name').value = data.schoolName || '';
            document.getElementById('time-duration').value = data.timeDuration || '';
            document.getElementById('instructions').value = data.instructions || '';
            objectiveQuestions = data.objectiveQuestions || [];
            subjectiveQuestions = data.subjectiveQuestions || [];
            renderQuestionsList();
            updateTotalMarks();
            generatePaperPreview();
            showToast('Draft restored from auto-save', 'info');
        }
    } catch(e) {
        console.error('Error loading draft:', e);
    }
}

function setupAutoSave() {
    const inputs = ['paper-name', 'grade-level', 'subject', 'school-name', 'time-duration', 'instructions'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', () => saveDraftToStorage());
    });
    
    setInterval(() => {
        saveDraftToStorage();
    }, 30000);
}

function clearAll() {
    if (confirm('Are you sure you want to clear all questions?')) {
        objectiveQuestions = [];
        subjectiveQuestions = [];
        renderQuestionsList();
        updateTotalMarks();
        generatePaperPreview();
        saveDraftToStorage();
        showToast('All questions cleared', 'success');
    }
}

// ============================================
// DARK MODE
// ============================================
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('math_paper_dark_mode', isDark);
    
    const moonIcon = document.querySelector('.dark-mode-toggle .fa-moon');
    const sunIcon = document.querySelector('.dark-mode-toggle .fa-sun');
    if (moonIcon && sunIcon) {
        moonIcon.classList.toggle('hidden', isDark);
        sunIcon.classList.toggle('hidden', !isDark);
    }
    
    generatePaperPreview();
}

function loadDarkModePreference() {
    const isDark = localStorage.getItem('math_paper_dark_mode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        const moonIcon = document.querySelector('.dark-mode-toggle .fa-moon');
        const sunIcon = document.querySelector('.dark-mode-toggle .fa-sun');
        if (moonIcon && sunIcon) {
            moonIcon.classList.add('hidden');
            sunIcon.classList.remove('hidden');
        }
    }
}

// ============================================
// UI HELPERS
// ============================================
function showLoading(show) {
    const spinner = elements['loading-spinner'];
    if (spinner) {
        spinner.classList.toggle('hidden', !show);
    }
}

function showToast(message, type = 'info') {
    const container = elements['toast-container'];
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${escapeHtml(message)}</span>
    `;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// ============================================
// NAVIGATION
// ============================================
function goHome() {
    window.location.href = 'https://magicrills.com';
}

function goBack() {
    window.location.href = 'https://magicrills.com/category-pages/mixed-tools.html';
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            const tabId = btn.dataset.tab;
            document.getElementById(tabId)?.classList.add('active');
            if (tabId === 'preview-tab') generatePaperPreview();
        });
    });
    
    // Question type switching
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.question-form').forEach(form => form.classList.remove('active'));
            const type = btn.dataset.type;
            document.getElementById(`${type}-form`)?.classList.add('active');
        });
    });
    
    // Buttons
    if (elements['add-question-btn']) elements['add-question-btn'].addEventListener('click', addQuestion);
    if (elements['clear-all-questions']) elements['clear-all-questions'].addEventListener('click', clearAll);
    if (elements['export-pdf']) elements['export-pdf'].addEventListener('click', exportToPDF);
    if (elements['export-doc']) elements['export-doc'].addEventListener('click', exportToDOC);
    if (elements['export-txt']) elements['export-txt'].addEventListener('click', exportToTXT);
    if (elements['save-template']) elements['save-template'].addEventListener('click', saveCurrentTemplate);
    
    // AI buttons
    if (elements['generate-slos']) elements['generate-slos'].addEventListener('click', generateSLOs);
    if (elements['generate-activities']) elements['generate-activities'].addEventListener('click', generateActivities);
    if (elements['generate-lesson']) elements['generate-lesson'].addEventListener('click', generateLessonPlan);
    
    // Reactions
    const reactionBtns = document.querySelectorAll('.reaction-btn');
    reactionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const emoji = btn.dataset.emoji;
            if (emoji) addReaction(emoji);
        });
    });
    
    // Share buttons
    const shareBtns = document.querySelectorAll('.share-btn');
    shareBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = btn.dataset.platform;
            if (platform) shareOnPlatform(platform);
        });
    });
    
    // Scroll buttons
    const scrollUpBtn = document.getElementById('scroll-up');
    const scrollDownBtn = document.getElementById('scroll-down');
    if (scrollUpBtn) scrollUpBtn.addEventListener('click', scrollToTop);
    if (scrollDownBtn) scrollDownBtn.addEventListener('click', scrollToBottom);
    
    // Dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // Navigation buttons
    if (elements['home-btn']) elements['home-btn'].addEventListener('click', goHome);
    if (elements['back-btn']) elements['back-btn'].addEventListener('click', goBack);
    
    // Update preview on input
    const previewInputs = ['paper-name', 'grade-level', 'subject', 'school-name', 'time-duration', 'instructions'];
    previewInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', () => generatePaperPreview());
    });
}

// Add slideOut animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
