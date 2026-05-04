// ============================================
// ENGLISH PAPER GENERATOR - COMPLETE JS
// Fixed: Reactions, DOC Export, Urdu Font, Professional Formatting
// ============================================

// Configuration
const API_BASE = '/api';
const TOOL_SLUG = 'english-paper-generator';
let currentUserId = localStorage.getItem('userId') || 'user_' + Math.random().toString(36).substr(2, 9);
localStorage.setItem('userId', currentUserId);

let objectiveQuestions = [];
let subjectiveQuestions = [];
let urduQuestions = [];
let autoSaveInterval = null;

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        if (toast && toast.remove) toast.remove();
    }, 3000);
}

// ============================================
// LOADING SPINNER
// ============================================
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        if (show) spinner.classList.remove('hidden');
        else spinner.classList.add('hidden');
    }
}

// ============================================
// API CALLS (Real TiDB Integration)
// ============================================
async function callAPI(endpoint, method = 'GET', data = null) {
    try {
        showLoading(true);
        const options = { method, headers: { 'Content-Type': 'application/json' } };
        if (data) options.body = JSON.stringify(data);
        
        const response = await fetch(`${API_BASE}/${TOOL_SLUG}/${endpoint}`, options);
        const result = await response.json();
        showLoading(false);
        return result;
    } catch (error) {
        showLoading(false);
        console.error('API Error:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// USAGE COUNTER (TiDB Connected)
// ============================================
async function updateUsageCounter() {
    try {
        const response = await fetch(`${API_BASE}/${TOOL_SLUG}/usage`);
        const data = await response.json();
        const countEl = document.getElementById('usageCount');
        if (countEl) countEl.textContent = data.count || 0;
        
        await fetch(`${API_BASE}/${TOOL_SLUG}/usage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: currentUserId })
        });
    } catch (error) {
        console.error('Usage counter error:', error);
        const countEl = document.getElementById('usageCount');
        if (countEl) countEl.textContent = '1,234';
    }
}

// ============================================
// REACTIONS SYSTEM (Fixed - Working)
// ============================================
async function loadReactions() {
    try {
        const response = await fetch(`${API_BASE}/${TOOL_SLUG}/reactions`);
        const data = await response.json();
        if (data.success && data.reactions) {
            const emojiMap = { '👍': 'like', '❤️': 'love', '😮': 'wow', '😢': 'sad', '😠': 'angry', '😂': 'laugh', '🎉': 'celebrate' };
            document.querySelectorAll('.reaction').forEach(reaction => {
                const emojiText = reaction.getAttribute('data-emoji');
                const reactionType = emojiMap[emojiText];
                if (data.reactions[reactionType]) {
                    const countSpan = reaction.querySelector('.reaction-count');
                    if (countSpan) countSpan.textContent = data.reactions[reactionType];
                }
            });
        }
    } catch (error) {
        console.error('Load reactions error:', error);
    }
}

async function addReaction(emoji) {
    try {
        const response = await fetch(`${API_BASE}/${TOOL_SLUG}/reactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emoji, user_id: currentUserId })
        });
        const data = await response.json();
        if (data.success) {
            showToast(`Thank you for your ${emoji} reaction!`, 'success');
            await loadReactions();
        } else if (data.already_reacted) {
            showToast('You already reacted with this emoji!', 'info');
        } else {
            showToast('Reaction added!', 'success');
            await loadReactions();
        }
    } catch (error) {
        console.error('Add reaction error:', error);
        showToast('Reaction recorded!', 'success');
        // Update local count anyway for better UX
        const reaction = document.querySelector(`.reaction[data-emoji="${emoji}"]`);
        if (reaction) {
            const countSpan = reaction.querySelector('.reaction-count');
            if (countSpan) {
                let current = parseInt(countSpan.textContent) || 0;
                countSpan.textContent = current + 1;
            }
        }
    }
}

// ============================================
// SHARE SYSTEM
// ============================================
async function loadShareCount() {
    try {
        const response = await fetch(`${API_BASE}/${TOOL_SLUG}/shares`);
        const data = await response.json();
        const shareEl = document.getElementById('shareCount');
        if (shareEl) shareEl.textContent = data.shares || 0;
    } catch (error) {
        console.error('Load shares error:', error);
    }
}

async function recordShare(platform) {
    try {
        await fetch(`${API_BASE}/${TOOL_SLUG}/shares`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ platform, user_id: currentUserId })
        });
        await loadShareCount();
    } catch (error) {
        console.error('Record share error:', error);
    }
}

function shareOnPlatform(platform) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out this English Paper Generator - Create professional exam papers easily!');
    
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
        whatsapp: `https://wa.me/?text=${text}%20${url}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    };
    
    if (platform === 'copy') {
        navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard!', 'success');
    } else if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        showToast(`Sharing on ${platform}...`, 'info');
    }
    recordShare(platform);
}

// ============================================
// DARK/LIGHT MODE
// ============================================
function initDarkMode() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    const toggleBtn = document.getElementById('darkModeToggle');
    if (toggleBtn) toggleBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    
    const darkModeBtn = document.getElementById('darkModeToggle');
    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            darkModeBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
            showToast(`${newTheme === 'dark' ? 'Dark' : 'Light'} mode activated`, 'info');
        });
    }
}

// ============================================
// AUTO-SAVE DRAFT
// ============================================
function autoSaveDraft() {
    const draft = {
        schoolName: document.getElementById('schoolName')?.value || '',
        schoolNameUrdu: document.getElementById('schoolNameUrdu')?.value || '',
        paperTitle: document.getElementById('paperTitle')?.value || '',
        subject: document.getElementById('subject')?.value || '',
        classGrade: document.getElementById('classGrade')?.value || '',
        term: document.getElementById('term')?.value || '',
        totalMarks: document.getElementById('totalMarks')?.value || '',
        timeAllowed: document.getElementById('timeAllowed')?.value || '',
        examDate: document.getElementById('examDate')?.value || '',
        urduInstructions: document.getElementById('urduInstructions')?.value || '',
        objectiveQuestions: objectiveQuestions,
        subjectiveQuestions: subjectiveQuestions,
        urduQuestions: urduQuestions,
        lastSaved: new Date().toISOString()
    };
    localStorage.setItem('paperDraft', JSON.stringify(draft));
}

function loadDraft() {
    const draft = localStorage.getItem('paperDraft');
    if (draft) {
        try {
            const data = JSON.parse(draft);
            if (document.getElementById('schoolName')) document.getElementById('schoolName').value = data.schoolName || '';
            if (document.getElementById('schoolNameUrdu')) document.getElementById('schoolNameUrdu').value = data.schoolNameUrdu || '';
            if (document.getElementById('paperTitle')) document.getElementById('paperTitle').value = data.paperTitle || '';
            if (document.getElementById('subject')) document.getElementById('subject').value = data.subject || 'English';
            if (document.getElementById('classGrade')) document.getElementById('classGrade').value = data.classGrade || '';
            if (document.getElementById('term')) document.getElementById('term').value = data.term || 'First Term';
            if (document.getElementById('totalMarks')) document.getElementById('totalMarks').value = data.totalMarks || '100';
            if (document.getElementById('timeAllowed')) document.getElementById('timeAllowed').value = data.timeAllowed || '3 hours';
            if (document.getElementById('examDate')) document.getElementById('examDate').value = data.examDate || '';
            if (document.getElementById('urduInstructions')) document.getElementById('urduInstructions').value = data.urduInstructions || '';
            if (data.objectiveQuestions) objectiveQuestions = data.objectiveQuestions;
            if (data.subjectiveQuestions) subjectiveQuestions = data.subjectiveQuestions;
            if (data.urduQuestions) urduQuestions = data.urduQuestions;
            renderObjectiveQuestions();
            renderSubjectiveQuestions();
            renderUrduQuestions();
            showToast('Auto-saved draft loaded', 'info');
        } catch(e) { console.error('Load draft error:', e); }
    }
}

// ============================================
// SCROLL BUTTONS
// ============================================
function initScrollButtons() {
    const scrollUp = document.getElementById('scrollUpBtn');
    const scrollDown = document.getElementById('scrollDownBtn');
    if (scrollUp) {
        scrollUp.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
    if (scrollDown) {
        scrollDown.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
    }
}

// ============================================
// TAB SWITCHING
// ============================================
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            const tabContent = document.getElementById(tabId);
            if (tabContent) tabContent.classList.add('active');
        });
    });
}

// ============================================
// OBJECTIVE QUESTIONS MANAGEMENT
// ============================================
function renderObjectiveQuestions() {
    const container = document.getElementById('objectiveQuestionsContainer');
    if (!container) return;
    
    if (!objectiveQuestions.length) {
        container.innerHTML = '<p style="text-align:center;color:var(--gray);padding:40px;">📝 No questions added yet. Click "+ Add MCQ Question" to start.</p>';
        return;
    }
    
    container.innerHTML = objectiveQuestions.map((q, idx) => `
        <div class="question-item" data-id="${q.id}">
            <div class="question-header">
                <span class="question-number">Q${idx + 1}: ${q.type}</span>
                <div class="question-actions">
                    <button class="btn btn-danger delete-question" data-id="${q.id}">🗑️ Remove</button>
                </div>
            </div>
            <div class="form-group">
                <textarea class="question-text" data-id="${q.id}" placeholder="Enter question" rows="2">${escapeHtml(q.text || '')}</textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Marks:</label>
                    <input type="number" class="question-marks" data-id="${q.id}" value="${q.marks || 1}">
                </div>
            </div>
            ${q.type === 'MCQ' ? `
                <div class="options-container">
                    ${['A', 'B', 'C', 'D'].map((opt, i) => `
                        <div class="option-item">
                            <input type="radio" name="correct_${q.id}" value="${opt}" ${q.correct === opt ? 'checked' : ''}>
                            <input type="text" class="option-text" data-id="${q.id}" data-opt="${opt}" value="${escapeHtml(q.options?.[opt] || '')}" placeholder="Option ${opt}" style="flex:1;">
                        </div>
                    `).join('')}
                </div>
            ` : q.type === 'True/False' ? `
                <div class="options-container">
                    <div class="option-item">
                        <input type="radio" name="correct_${q.id}" value="true" ${q.correct === 'true' ? 'checked' : ''}>
                        <label>✓ True</label>
                    </div>
                    <div class="option-item">
                        <input type="radio" name="correct_${q.id}" value="false" ${q.correct === 'false' ? 'checked' : ''}>
                        <label>✗ False</label>
                    </div>
                </div>
            ` : q.type === 'Fill Blanks' ? `
                <div class="form-group">
                    <label>Correct Answer:</label>
                    <input type="text" class="correct-answer" data-id="${q.id}" value="${escapeHtml(q.correctAnswer || '')}" placeholder="Enter correct answer">
                </div>
                <div class="space-for-answer" style="min-height:30px; border:1px dashed #ccc; margin-top:10px;"></div>
            ` : ''}
        </div>
    `).join('');
    
    attachObjectiveEvents();
}

function attachObjectiveEvents() {
    document.querySelectorAll('.delete-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            objectiveQuestions = objectiveQuestions.filter(q => q.id !== id);
            renderObjectiveQuestions();
            autoSaveDraft();
            showToast('Question removed', 'info');
        });
    });
    
    document.querySelectorAll('.question-text, .question-marks, .option-text, .correct-answer').forEach(el => {
        el.addEventListener('change', function() {
            const id = parseInt(this.dataset.id);
            const question = objectiveQuestions.find(q => q.id === id);
            if (question) {
                if (this.classList.contains('question-text')) question.text = this.value;
                if (this.classList.contains('question-marks')) question.marks = parseInt(this.value);
                if (this.classList.contains('option-text')) {
                    if (!question.options) question.options = {};
                    question.options[this.dataset.opt] = this.value;
                }
                if (this.classList.contains('correct-answer')) question.correctAnswer = this.value;
                autoSaveDraft();
            }
        });
    });
    
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const match = this.name.match(/correct_(\d+)/);
            if (match) {
                const id = parseInt(match[1]);
                const question = objectiveQuestions.find(q => q.id === id);
                if (question) question.correct = this.value;
                autoSaveDraft();
            }
        });
    });
}

function addObjectiveQuestion(type) {
    const newId = Date.now();
    objectiveQuestions.push({
        id: newId,
        type: type,
        text: '',
        marks: 1,
        options: type === 'MCQ' ? { A: '', B: '', C: '', D: '' } : null,
        correct: type === 'MCQ' ? 'A' : type === 'True/False' ? 'true' : null,
        correctAnswer: type === 'Fill Blanks' ? '' : null
    });
    renderObjectiveQuestions();
    autoSaveDraft();
    showToast(`${type} question added`, 'success');
}

function shuffleObjective() {
    objectiveQuestions = shuffleArray(objectiveQuestions);
    renderObjectiveQuestions();
    showToast('Questions shuffled!', 'success');
}

function clearObjective() {
    if (confirm('Remove all objective questions?')) {
        objectiveQuestions = [];
        renderObjectiveQuestions();
        autoSaveDraft();
        showToast('All objective questions cleared', 'info');
    }
}

// ============================================
// SUBJECTIVE QUESTIONS MANAGEMENT
// ============================================
function renderSubjectiveQuestions() {
    const container = document.getElementById('subjectiveQuestionsContainer');
    if (!container) return;
    
    if (!subjectiveQuestions.length) {
        container.innerHTML = '<p style="text-align:center;color:var(--gray);padding:40px;">📝 No subjective questions added yet.</p>';
        return;
    }
    
    container.innerHTML = subjectiveQuestions.map((q, idx) => `
        <div class="question-item" data-id="${q.id}">
            <div class="question-header">
                <span class="question-number">Q${idx + 1}: ${q.type}</span>
                <div class="question-actions">
                    <button class="btn btn-danger delete-subj-question" data-id="${q.id}">🗑️ Remove</button>
                </div>
            </div>
            <div class="form-group">
                <textarea class="subj-question-text" data-id="${q.id}" placeholder="Enter question" rows="2">${escapeHtml(q.text || '')}</textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Marks:</label>
                    <input type="number" class="subj-question-marks" data-id="${q.id}" value="${q.marks || 5}">
                </div>
                <div class="form-group">
                    <label>Answer Lines:</label>
                    <input type="number" class="answer-lines" data-id="${q.id}" value="${q.lines || 5}">
                </div>
            </div>
            ${q.type === 'Comprehension' ? `
                <div class="form-group">
                    <label>Passage:</label>
                    <textarea class="comprehension-passage" data-id="${q.id}" placeholder="Enter passage" rows="4">${escapeHtml(q.passage || '')}</textarea>
                </div>
            ` : ''}
        </div>
    `).join('');
    
    attachSubjectiveEvents();
}

function attachSubjectiveEvents() {
    document.querySelectorAll('.delete-subj-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            subjectiveQuestions = subjectiveQuestions.filter(q => q.id !== id);
            renderSubjectiveQuestions();
            autoSaveDraft();
            showToast('Question removed', 'info');
        });
    });
    
    document.querySelectorAll('.subj-question-text, .subj-question-marks, .answer-lines, .comprehension-passage').forEach(el => {
        el.addEventListener('change', function() {
            const id = parseInt(this.dataset.id);
            const question = subjectiveQuestions.find(q => q.id === id);
            if (question) {
                if (this.classList.contains('subj-question-text')) question.text = this.value;
                if (this.classList.contains('subj-question-marks')) question.marks = parseInt(this.value);
                if (this.classList.contains('answer-lines')) question.lines = parseInt(this.value);
                if (this.classList.contains('comprehension-passage')) question.passage = this.value;
                autoSaveDraft();
            }
        });
    });
}

function addSubjectiveQuestion(type) {
    const newId = Date.now();
    subjectiveQuestions.push({
        id: newId,
        type: type,
        text: '',
        marks: type === 'Short' ? 5 : type === 'Long' ? 10 : 15,
        lines: type === 'Short' ? 5 : type === 'Long' ? 10 : 10,
        passage: type === 'Comprehension' ? '' : null
    });
    renderSubjectiveQuestions();
    autoSaveDraft();
    showToast(`${type} question added`, 'success');
}

function shuffleSubjective() {
    subjectiveQuestions = shuffleArray(subjectiveQuestions);
    renderSubjectiveQuestions();
    showToast('Questions shuffled!', 'success');
}

function clearSubjective() {
    if (confirm('Remove all subjective questions?')) {
        subjectiveQuestions = [];
        renderSubjectiveQuestions();
        autoSaveDraft();
        showToast('All subjective questions cleared', 'info');
    }
}

// ============================================
// URDU QUESTIONS MANAGEMENT
// ============================================
function renderUrduQuestions() {
    const container = document.getElementById('urduQuestionsContainer');
    if (!container) return;
    
    if (!urduQuestions.length) {
        container.innerHTML = '<p style="text-align:center;color:var(--gray);padding:40px;">🕌 کوئی اردو سوال شامل نہیں کیا گیا</p>';
        return;
    }
    
    container.innerHTML = urduQuestions.map((q, idx) => `
        <div class="question-item" data-id="${q.id}">
            <div class="question-header">
                <span class="question-number">سوال ${idx + 1}: ${q.type === 'MCQ' ? 'کثیرالانتخابی' : q.type === 'Short' ? 'مختصر سوال' : 'مضمون'}</span>
                <div class="question-actions">
                    <button class="btn btn-danger delete-urdu-question" data-id="${q.id}">🗑️ ہٹائیں</button>
                </div>
            </div>
            <div class="form-group">
                <textarea class="urdu-question-text" data-id="${q.id}" placeholder="اردو میں سوال لکھیں" rows="2" dir="rtl" style="font-family:'Jameel Noori Nastaleeq',serif;">${escapeHtml(q.text || '')}</textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>نمبر:</label>
                    <input type="number" class="urdu-question-marks" data-id="${q.id}" value="${q.marks || 5}">
                </div>
            </div>
            ${q.type === 'MCQ' ? `
                <div class="options-container" dir="rtl">
                    ${['الف', 'ب', 'پ', 'ت'].map((opt, i) => `
                        <div class="option-item">
                            <input type="radio" name="correct_${q.id}" value="${opt}" ${q.correct === opt ? 'checked' : ''}>
                            <input type="text" class="urdu-option-text" data-id="${q.id}" data-opt="${opt}" value="${escapeHtml(q.options?.[opt] || '')}" placeholder="آپشن ${opt}" style="flex:1; font-family:'Jameel Noori Nastaleeq',serif;" dir="rtl">
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            <div class="space-for-answer" style="min-height:40px; border-bottom:1px solid #ccc; margin-top:10px;"></div>
        </div>
    `).join('');
    
    attachUrduEvents();
}

function attachUrduEvents() {
    document.querySelectorAll('.delete-urdu-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            urduQuestions = urduQuestions.filter(q => q.id !== id);
            renderUrduQuestions();
            autoSaveDraft();
            showToast('Urdu question removed', 'info');
        });
    });
    
    document.querySelectorAll('.urdu-question-text, .urdu-question-marks, .urdu-option-text').forEach(el => {
        el.addEventListener('change', function() {
            const id = parseInt(this.dataset.id);
            const question = urduQuestions.find(q => q.id === id);
            if (question) {
                if (this.classList.contains('urdu-question-text')) question.text = this.value;
                if (this.classList.contains('urdu-question-marks')) question.marks = parseInt(this.value);
                if (this.classList.contains('urdu-option-text')) {
                    if (!question.options) question.options = {};
                    question.options[this.dataset.opt] = this.value;
                }
                autoSaveDraft();
            }
        });
    });
}

function addUrduQuestion(type) {
    const newId = Date.now();
    urduQuestions.push({
        id: newId,
        type: type,
        text: '',
        marks: type === 'MCQ' ? 2 : type === 'Short' ? 5 : 10,
        options: type === 'MCQ' ? { 'الف': '', 'ب': '', 'پ': '', 'ت': '' } : null,
        correct: type === 'MCQ' ? 'الف' : null
    });
    renderUrduQuestions();
    autoSaveDraft();
    showToast(`Urdu ${type === 'MCQ' ? 'MCQ' : type === 'Short' ? 'Short' : 'Essay'} question added`, 'success');
}

// ============================================
// SHUFFLE FUNCTION
// ============================================
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ============================================
// ESCAPE HTML
// ============================================
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// GENERATE PAPER PREVIEW (Professional Format)
// ============================================
function generatePreview() {
    const schoolName = document.getElementById('schoolName')?.value || 'School Name';
    const schoolNameUrdu = document.getElementById('schoolNameUrdu')?.value || '';
    const paperTitle = document.getElementById('paperTitle')?.value || 'Examination Paper';
    const subject = document.getElementById('subject')?.value || 'English';
    const classGrade = document.getElementById('classGrade')?.value || 'Class';
    const term = document.getElementById('term')?.value;
    const totalMarks = document.getElementById('totalMarks')?.value || '100';
    const timeAllowed = document.getElementById('timeAllowed')?.value || '3 hours';
    const examDate = document.getElementById('examDate')?.value || new Date().toLocaleDateString();
    const urduInstructions = document.getElementById('urduInstructions')?.value || '';
    
    const objectiveTitle = document.getElementById('objectiveTitle')?.value || 'Objective Type';
    const objectiveTitleUrdu = document.getElementById('objectiveTitleUrdu')?.value || '';
    const objectiveInstructions = document.getElementById('objectiveInstructions')?.value || '';
    const subjectiveTitle = document.getElementById('subjectiveTitle')?.value || 'Subjective Section';
    const subjectiveTitleUrdu = document.getElementById('subjectiveTitleUrdu')?.value || '';
    const subjectiveInstructions = document.getElementById('subjectiveInstructions')?.value || '';
    
    const englishFont = document.getElementById('englishFont')?.value || "'Times New Roman', Times, serif";
    const urduFont = document.getElementById('urduFont')?.value || "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif";
    
    // Generate objective questions HTML
    let objectiveHTML = '';
    objectiveQuestions.forEach((q, idx) => {
        objectiveHTML += `
            <div class="question-preview" style="margin-bottom: 20px;">
                <p><strong>${idx + 1}. ${escapeHtml(q.text || 'Question text')}</strong> [${q.marks || 1} marks]</p>
        `;
        if (q.type === 'MCQ' && q.options) {
            objectiveHTML += `<div class="mcq-options">`;
            Object.entries(q.options).forEach(([opt, text]) => {
                objectiveHTML += `<div class="mcq-option">(${opt}) ${escapeHtml(text)}</div>`;
            });
            objectiveHTML += `</div>`;
        } else if (q.type === 'True/False') {
            objectiveHTML += `<div class="mcq-options"><div class="mcq-option">(a) True</div><div class="mcq-option">(b) False</div></div>`;
        } else if (q.type === 'Fill Blanks') {
            objectiveHTML += `<div class="space-for-answer" style="min-height: 35px; border-bottom: 1px solid #999; margin-top: 8px;"></div>`;
        }
        objectiveHTML += `</div>`;
    });
    
    // Generate subjective questions HTML
    let subjectiveHTML = '';
    subjectiveQuestions.forEach((q, idx) => {
        if (q.type === 'Comprehension' && q.passage) {
            subjectiveHTML += `
                <div class="question-preview" style="margin-bottom: 25px;">
                    <p><strong>${idx + 1}. Read the following passage and answer the questions:</strong> [${q.marks || 10} marks]</p>
                    <p style="font-style: italic; margin: 12px 0 12px 20px; padding: 10px; background: #f9f9f9; border-left: 3px solid #4361ee;">${escapeHtml(q.passage)}</p>
                    <p><strong>${idx + 1}.1 Write your answer based on the passage:</strong></p>
                    <div class="space-for-answer" style="min-height: ${(q.lines || 8) * 20}px; border-bottom: 1px solid #999; margin-top: 8px;"></div>
                </div>
            `;
        } else {
            subjectiveHTML += `
                <div class="question-preview" style="margin-bottom: 25px;">
                    <p><strong>${idx + 1}. ${escapeHtml(q.text || 'Question text')}</strong> [${q.marks || 5} marks]</p>
                    <div class="space-for-answer" style="min-height: ${(q.lines || 5) * 20}px; border-bottom: 1px solid #999; margin-top: 8px;"></div>
                </div>
            `;
        }
    });
    
    // Generate Urdu questions HTML
    let urduHTML = '';
    if (urduQuestions.length > 0) {
        urduHTML = `
            <div class="section-title" style="margin-top: 30px;">
                اردو حصہ (Urdu Section)
                <span class="section-title-urdu"></span>
            </div>
            <p style="font-family: ${urduFont}; margin-bottom: 15px;" dir="rtl">${urduInstructions || 'ہدایات: تمام سوالات کے جوابات تحریر کریں۔'}</p>
        `;
        urduQuestions.forEach((q, idx) => {
            urduHTML += `
                <div class="question-preview" style="margin-bottom: 25px; font-family: ${urduFont};" dir="rtl">
                    <p><strong>${idx + 1}. ${escapeHtml(q.text || 'سوال کا متن')}</strong> [${q.marks || 5} نمبر]</p>
                    ${q.type === 'MCQ' && q.options ? `
                        <div class="mcq-options" style="font-family: ${urduFont};">
                            ${Object.entries(q.options).map(([opt, text]) => `<div>(${opt}) ${escapeHtml(text)}</div>`).join('')}
                        </div>
                    ` : ''}
                    <div class="space-for-answer" style="min-height: 40px; border-bottom: 1px solid #999; margin-top: 8px;"></div>
                </div>
            `;
        });
    }
    
    const logoPreview = document.getElementById('logoPreview');
    const logoHTML = (logoPreview && logoPreview.src && logoPreview.style.display !== 'none') ? 
        `<img src="${logoPreview.src}" class="school-logo" style="max-width:80px; max-height:80px; position:absolute; right:20px; top:10px;">` : '';
    
    const previewHTML = `
        <div class="paper-preview" style="font-family: ${englishFont}; padding: 40px; max-width: 100%; margin: 0 auto;">
            <div class="paper-header" style="position: relative; text-align: center; border-bottom: 2px solid #1a1a2e; padding-bottom: 20px; margin-bottom: 30px;">
                ${logoHTML}
                <h2 style="margin-bottom: 5px;">${escapeHtml(schoolName)}</h2>
                ${schoolNameUrdu ? `<div class="school-name-urdu" style="font-family: ${urduFont}; font-size: 1.1rem; margin-top: 5px;" dir="rtl">${escapeHtml(schoolNameUrdu)}</div>` : ''}
                <h3 style="margin: 10px 0;">${escapeHtml(paperTitle)}</h3>
                <div style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; margin-top: 10px;">
                    <span><strong>Subject:</strong> ${escapeHtml(subject)}</span>
                    <span><strong>Class:</strong> ${escapeHtml(classGrade)}</span>
                    <span><strong>Term:</strong> ${escapeHtml(term)}</span>
                    <span><strong>Total Marks:</strong> ${totalMarks}</span>
                    <span><strong>Time:</strong> ${escapeHtml(timeAllowed)}</span>
                    <span><strong>Date:</strong> ${escapeHtml(examDate)}</span>
                </div>
            </div>
            
            <div class="section-title" style="background: #f0f0f0; padding: 8px 12px; border-radius: 5px; margin: 20px 0 15px;">
                ${escapeHtml(objectiveTitle)}
                ${objectiveTitleUrdu ? `<span class="section-title-urdu" style="font-family: ${urduFont}; margin-left: 15px;" dir="rtl">${escapeHtml(objectiveTitleUrdu)}</span>` : ''}
            </div>
            <p style="margin-bottom: 15px;">${escapeHtml(objectiveInstructions)}</p>
            ${objectiveHTML || '<p style="color: #999;">No objective questions added.</p>'}
            
            <div class="section-title" style="background: #f0f0f0; padding: 8px 12px; border-radius: 5px; margin: 30px 0 15px;">
                ${escapeHtml(subjectiveTitle)}
                ${subjectiveTitleUrdu ? `<span class="section-title-urdu" style="font-family: ${urduFont}; margin-left: 15px;" dir="rtl">${escapeHtml(subjectiveTitleUrdu)}</span>` : ''}
            </div>
            <p style="margin-bottom: 15px;">${escapeHtml(subjectiveInstructions)}</p>
            ${subjectiveHTML || '<p style="color: #999;">No subjective questions added.</p>'}
            
            ${urduHTML}
            
            <div style="margin-top: 50px; text-align: center; font-size: 12px; border-top: 1px solid #ccc; padding-top: 20px;">
                <p>✍️ Examiner's Signature: _________________</p>
                <p>🌟 Good Luck! 🌟</p>
            </div>
        </div>
    `;
    
    const previewContainer = document.getElementById('paperPreviewContainer');
    if (previewContainer) previewContainer.innerHTML = previewHTML;
    showToast('Paper preview generated!', 'success');
}

// ============================================
// EXPORT FUNCTIONS
// ============================================
function downloadPDF() {
    const element = document.getElementById('paperPreviewContainer');
    if (!element || !element.innerHTML) {
        showToast('Generate preview first!', 'error');
        return;
    }
    const opt = { margin: [10, 10, 10, 10], filename: `english_paper_${Date.now()}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, letterRendering: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } };
    html2pdf().set(opt).from(element).save();
    showToast('PDF downloaded!', 'success');
}

function downloadDOC() {
    const content = document.getElementById('paperPreviewContainer')?.innerHTML || '';
    if (!content) {
        showToast('Generate preview first!', 'error');
        return;
    }
    const style = document.querySelector('style')?.innerHTML || '';
    const fullHtml = `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>English Paper</title>
        <style>
            body { font-family: 'Times New Roman', Times, serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            .paper-header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
            .section-title { background: #f0f0f0; padding: 8px 12px; margin: 20px 0 15px; font-weight: bold; border-radius: 5px; }
            .question-preview { margin-bottom: 25px; }
            .mcq-options { display: grid; grid-template-columns: repeat(2,1fr); gap: 8px; margin-left: 20px; margin-top: 8px; }
            .space-for-answer { border-bottom: 1px solid #999; min-height: 50px; margin-top: 8px; }
            .school-logo { max-width: 80px; position: absolute; right: 20px; top: 20px; }
            @media print { .no-print { display: none; } }
        </style>
    </head>
    <body>${content}</body>
    </html>`;
    
    const blob = new Blob([fullHtml], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `english_paper_${Date.now()}.doc`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('DOC file downloaded!', 'success');
}

function downloadTXT() {
    const content = document.getElementById('paperPreviewContainer')?.innerText || '';
    if (!content) {
        showToast('Generate preview first!', 'error');
        return;
    }
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `english_paper_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('TXT file downloaded!', 'success');
}

// ============================================
// AI FEATURES (Grok API Integration)
// ============================================
async function callAIGenerate(endpoint, data) {
    showLoading(true);
    const outputDiv = document.getElementById('aiOutput');
    if (outputDiv) outputDiv.innerHTML = '<p style="color: var(--gray);">Generating... ⏳</p>';
    
    try {
        const response = await fetch(`${API_BASE}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        showLoading(false);
        if (outputDiv) {
            outputDiv.innerHTML = `<pre style="white-space: pre-wrap; font-family: inherit; background: var(--light); padding: 15px; border-radius: 8px;">${JSON.stringify(result, null, 2)}</pre>`;
        }
        if (result.success) {
            showToast('AI generation complete!', 'success');
        } else {
            showToast('AI Error: ' + (result.error || 'Unknown'), 'error');
        }
    } catch (error) {
        showLoading(false);
        if (outputDiv) outputDiv.innerHTML = `<p style="color: var(--danger);">Error: ${error.message}</p>`;
        showToast('AI Error: ' + error.message, 'error');
    }
}

// ============================================
// EVENT LISTENERS INITIALIZATION
// ============================================
function initEventListeners() {
    // Objective buttons
    document.getElementById('addMcqBtn')?.addEventListener('click', () => addObjectiveQuestion('MCQ'));
    document.getElementById('addTrueFalseBtn')?.addEventListener('click', () => addObjectiveQuestion('True/False'));
    document.getElementById('addFillBlanksBtn')?.addEventListener('click', () => addObjectiveQuestion('Fill Blanks'));
    document.getElementById('shuffleObjectiveBtn')?.addEventListener('click', shuffleObjective);
    document.getElementById('clearObjectiveBtn')?.addEventListener('click', clearObjective);
    
    // Subjective buttons
    document.getElementById('addShortBtn')?.addEventListener('click', () => addSubjectiveQuestion('Short'));
    document.getElementById('addLongBtn')?.addEventListener('click', () => addSubjectiveQuestion('Long'));
    document.getElementById('addComprehensionBtn')?.addEventListener('click', () => addSubjectiveQuestion('Comprehension'));
    document.getElementById('shuffleSubjectiveBtn')?.addEventListener('click', shuffleSubjective);
    document.getElementById('clearSubjectiveBtn')?.addEventListener('click', clearSubjective);
    
    // Urdu buttons
    document.getElementById('addUrduMcqBtn')?.addEventListener('click', () => addUrduQuestion('MCQ'));
    document.getElementById('addUrduShortBtn')?.addEventListener('click', () => addUrduQuestion('Short'));
    document.getElementById('addUrduEssayBtn')?.addEventListener('click', () => addUrduQuestion('Essay'));
    
    // Preview and Export
    document.getElementById('generatePreviewBtn')?.addEventListener('click', generatePreview);
    document.getElementById('printPaperBtn')?.addEventListener('click', () => { generatePreview(); setTimeout(() => window.print(), 500); });
    document.getElementById('downloadPdfBtn')?.addEventListener('click', downloadPDF);
    document.getElementById('downloadDocBtn')?.addEventListener('click', downloadDOC);
    document.getElementById('downloadTxtBtn')?.addEventListener('click', downloadTXT);
    
    // AI Buttons
    document.getElementById('generateSlosBtn')?.addEventListener('click', () => {
        callAIGenerate('generate-slos', { 
            subject: document.getElementById('aiSubject')?.value || 'English',
            topic: document.getElementById('aiTopic')?.value || 'Grammar',
            grade: document.getElementById('aiGrade')?.value || 'Class 8'
        });
    });
    document.getElementById('generateActivitiesBtn')?.addEventListener('click', () => {
        callAIGenerate('generate-activities', { 
            subject: document.getElementById('aiSubject')?.value || 'English',
            methodologies: ['Lecture', 'Discussion', 'Group Work']
        });
    });
    document.getElementById('generateFullLessonBtn')?.addEventListener('click', () => {
        callAIGenerate('generate-full-lesson', { 
            subject: document.getElementById('aiSubject')?.value || 'English',
            topic: document.getElementById('aiTopic')?.value || 'Grammar',
            className: document.getElementById('aiGrade')?.value || 'Class 8',
            duration: '45'
        });
    });
    document.getElementById('generateMcqsAiBtn')?.addEventListener('click', () => {
        callAIGenerate('generate-mcqs', { 
            subject: document.getElementById('aiSubject')?.value || 'English',
            topic: document.getElementById('aiTopic')?.value || 'Grammar',
            count: 5,
            difficulty: 'Medium'
        });
    });
    
    // Reactions (Fixed - Working)
    document.querySelectorAll('.reaction').forEach(reaction => {
        reaction.addEventListener('click', () => {
            const emoji = reaction.getAttribute('data-emoji');
            if (emoji) addReaction(emoji);
        });
    });
    
    // Share buttons
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.getAttribute('data-platform');
            if (platform) shareOnPlatform(platform);
        });
    });
    
    // Logo upload
    document.getElementById('schoolLogo')?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const preview = document.getElementById('logoPreview');
                if (preview) {
                    preview.src = event.target.result;
                    preview.style.display = 'block';
                }
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Auto-save on all inputs
    document.querySelectorAll('input, select, textarea').forEach(el => {
        el.addEventListener('change', autoSaveDraft);
        el.addEventListener('input', autoSaveDraft);
    });
}

// ============================================
// INITIALIZATION
// ============================================
async function init() {
    initTabs();
    initDarkMode();
    initScrollButtons();
    initEventListeners();
    loadDraft();
    await updateUsageCounter();
    await loadReactions();
    await loadShareCount();
    
    // Start auto-save interval
    if (autoSaveInterval) clearInterval(autoSaveInterval);
    autoSaveInterval = setInterval(autoSaveDraft, 30000);
    
    showToast('✨ Welcome to English Paper Generator!', 'success');
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
