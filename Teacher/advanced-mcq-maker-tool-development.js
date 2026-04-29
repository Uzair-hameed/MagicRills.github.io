// ============================================
// ADVANCED MCQ MAKER PRO - CORRECTED JS
// INTEGRATED WITH test-db.js ENDPOINTS
// TiDB | Vercel | Grok API | NO MOCK DATA
// ============================================

// ========== CONFIGURATION ==========
const API_BASE = '/api';
const TOOL_SLUG = 'advanced-mcq-maker';
const USER_ID = localStorage.getItem('mcq_user_id') || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

if (!localStorage.getItem('mcq_user_id')) {
    localStorage.setItem('mcq_user_id', USER_ID);
}

// ========== GLOBAL STATE ==========
let questions = [];
let questionBank = JSON.parse(localStorage.getItem('mcq_question_bank') || '[]');
let currentQuestionId = 1;
let userReactions = JSON.parse(localStorage.getItem('mcq_reactions') || '{}');
let paperConfig = JSON.parse(localStorage.getItem('mcq_paper_config') || '{}');
let currentUserId = USER_ID;
let autoSaveInterval = null;

// ========== DOM ELEMENTS ==========
const loadingOverlay = document.getElementById('loadingOverlay');
const toastContainer = document.getElementById('toastContainer');

// ========== HELPER FUNCTIONS ==========
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function showLoading() {
    loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
}

// ========== REAL API CALLS (test-db.js endpoints) ==========

// USAGE: POST /api/increment-usage
async function incrementUsage() {
    try {
        const response = await fetch(`${API_BASE}/increment-usage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                tool_slug: TOOL_SLUG, 
                user_id: currentUserId 
            })
        });
        const data = await response.json();
        if (data.success) {
            updateUsageDisplay(data.total_usage || 0);
        }
        return data;
    } catch (error) {
        console.error('Usage increment failed:', error);
        let localCount = parseInt(localStorage.getItem('mcq_usage_count') || '0');
        localCount++;
        localStorage.setItem('mcq_usage_count', localCount);
        updateUsageDisplay(localCount);
    }
}

// USAGE: GET /api/usage?tool_slug=...
async function fetchUsage() {
    try {
        const response = await fetch(`${API_BASE}/usage?tool_slug=${TOOL_SLUG}`);
        const data = await response.json();
        if (data.success) {
            updateUsageDisplay(data.count || 0);
        }
        return data;
    } catch (error) {
        let localCount = parseInt(localStorage.getItem('mcq_usage_count') || '0');
        updateUsageDisplay(localCount);
    }
}

function updateUsageDisplay(count) {
    const statUsage = document.getElementById('statUsage');
    const headerUsage = document.getElementById('headerUsage');
    if (statUsage) statUsage.textContent = count;
    if (headerUsage) headerUsage.textContent = count;
}

// REACTIONS: GET /api/reactions?tool_slug=...
async function fetchReactions() {
    try {
        const response = await fetch(`${API_BASE}/reactions?tool_slug=${TOOL_SLUG}`);
        const data = await response.json();
        if (data.success) {
            updateReactionsDisplay(data.reactions || {});
        }
        return data;
    } catch (error) {
        console.error('Failed to fetch reactions:', error);
    }
}

// REACTIONS: POST /api/add-reaction
async function submitReaction(emoji) {
    if (userReactions[emoji]) {
        showToast(`You already reacted with ${emoji}`, 'warning');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/add-reaction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                tool_slug: TOOL_SLUG, 
                emoji: emoji,
                user_id: currentUserId 
            })
        });
        const data = await response.json();
        
        if (data.already_reacted) {
            showToast(`You have already reacted with ${emoji}`, 'warning');
            return;
        }
        
        if (data.success !== false) {
            userReactions[emoji] = true;
            localStorage.setItem('mcq_reactions', JSON.stringify(userReactions));
            updateReactionsDisplay(data.counts || {});
            showToast(`Reacted with ${emoji}`, 'success');
            incrementUsage();
        }
    } catch (error) {
        console.error('Failed to submit reaction:', error);
        showToast('Failed to save reaction', 'error');
    }
}

function updateReactionsDisplay(reactions) {
    // Map reaction types to emojis
    const emojiMap = {
        like: '👍', love: '❤️', wow: '😮', 
        sad: '😢', angry: '😠', laugh: '😂', celebrate: '🎉'
    };
    
    document.querySelectorAll('.reaction').forEach(btn => {
        const emoji = btn.getAttribute('data-emoji');
        let reactionType = '';
        
        if (emoji === '👍') reactionType = 'like';
        else if (emoji === '❤️') reactionType = 'love';
        else if (emoji === '😮') reactionType = 'wow';
        else if (emoji === '😢') reactionType = 'sad';
        else if (emoji === '😠') reactionType = 'angry';
        else if (emoji === '😂') reactionType = 'laugh';
        else if (emoji === '🎉') reactionType = 'celebrate';
        
        const count = reactions[reactionType] || 0;
        const countSpan = btn.querySelector('.reaction-count');
        if (countSpan) countSpan.textContent = count;
    });
    
    const total = Object.values(reactions).reduce((a, b) => a + b, 0);
    const statReactions = document.getElementById('statReactions');
    if (statReactions) statReactions.textContent = total;
}

// SHARES: GET /api/shares?tool_slug=...
async function fetchShares() {
    try {
        const response = await fetch(`${API_BASE}/shares?tool_slug=${TOOL_SLUG}`);
        const data = await response.json();
        if (data.success) {
            updateSharesDisplay(data.shares || 0);
        }
        return data;
    } catch (error) {
        let localShares = parseInt(localStorage.getItem('mcq_shares') || '0');
        updateSharesDisplay(localShares);
    }
}

// SHARES: POST /api/add-share
async function submitShare(platform) {
    try {
        const response = await fetch(`${API_BASE}/add-share`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                tool_slug: TOOL_SLUG, 
                platform: platform,
                user_id: currentUserId 
            })
        });
        const data = await response.json();
        updateSharesDisplayFromAPI();
        showToast(`Shared on ${platform}`, 'success');
        incrementUsage();
    } catch (error) {
        let localShares = parseInt(localStorage.getItem('mcq_shares') || '0');
        localShares++;
        localStorage.setItem('mcq_shares', localShares);
        updateSharesDisplay(localShares);
    }
}

async function updateSharesDisplayFromAPI() {
    try {
        const response = await fetch(`${API_BASE}/shares?tool_slug=${TOOL_SLUG}`);
        const data = await response.json();
        if (data.success) updateSharesDisplay(data.shares || 0);
    } catch(e) {}
}

function updateSharesDisplay(count) {
    const statShares = document.getElementById('statShares');
    if (statShares) statShares.textContent = count;
}

// STATS: GET /api/stats?tool_slug=...
async function fetchStats() {
    try {
        const response = await fetch(`${API_BASE}/stats?tool_slug=${TOOL_SLUG}`);
        const data = await response.json();
        if (data.success) {
            document.getElementById('heroQuestions').textContent = data.totalUsage || questions.length;
            document.getElementById('heroPapers').textContent = data.totalUsage || 0;
            document.getElementById('heroExports').textContent = data.totalShares || 0;
            document.getElementById('totalQuestions').textContent = data.totalUsage || questions.length;
            document.getElementById('totalPapers').textContent = data.totalUsage || 0;
            document.getElementById('totalExportsStat').textContent = data.totalShares || 0;
        }
    } catch (error) {
        document.getElementById('heroQuestions').textContent = questions.length;
        document.getElementById('totalQuestions').textContent = questions.length;
    }
    updateBankSummary();
}

// ========== AI FUNCTIONS (Grok API via test-db.js) ==========

// AI: POST /api/generate-mcqs
async function generateAIQuestions() {
    const topic = document.getElementById('aiTopic').value;
    const grade = document.getElementById('aiGrade').value;
    const count = parseInt(document.getElementById('aiCount').value);
    const difficulty = document.getElementById('aiDifficulty').value;
    
    if (!topic) {
        showToast('Please enter a topic', 'warning');
        return;
    }
    
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/generate-mcqs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                subject: topic,
                topic: topic,
                grade: grade,
                count: count,
                difficulty: difficulty,
                tool_slug: TOOL_SLUG
            })
        });
        const data = await response.json();
        
        if (data.success && data.mcqs) {
            displayAIGeneratedQuestions(data.mcqs);
            showToast(`${data.mcqs.length} questions generated!`, 'success');
            incrementUsage();
        } else {
            showToast('AI generation failed', 'error');
        }
    } catch (error) {
        console.error('AI generation failed:', error);
        showToast('AI generation failed. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

function displayAIGeneratedQuestions(questionsList) {
    const container = document.getElementById('aiGeneratedList');
    if (!container) return;
    
    if (!questionsList.length) {
        container.innerHTML = '<div class="empty-state-sm">No questions generated. Try again.</div>';
        return;
    }
    
    container.innerHTML = questionsList.map((q, idx) => `
        <div class="ai-question">
            <strong>Q${idx + 1}:</strong> ${q.question || q.text}
            <div style="margin-left:20px; margin-top:5px; font-size:0.8rem;">
                ${(q.options || ['A. Option A', 'B. Option B', 'C. Option C', 'D. Option D']).map(opt => `<div>• ${opt}</div>`).join('')}
            </div>
            <div style="margin-top:5px; font-size:0.75rem; color:green;">
                Correct: ${q.correctAnswer || q.correctAnswers?.join(', ') || 'A'}
            </div>
            ${q.explanation ? `<div style="margin-top:5px; font-size:0.7rem; color:gray;">${q.explanation}</div>` : ''}
            <button class="btn btn-primary btn-sm add-ai-question" style="margin-top:8px;" data-question='${JSON.stringify(q)}'>
                <i class="fas fa-plus"></i> Add to Paper
            </button>
        </div>
    `).join('');
    
    document.querySelectorAll('.add-ai-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const q = JSON.parse(btn.getAttribute('data-question'));
            const newQuestion = {
                id: currentQuestionId++,
                text: q.question || q.text,
                options: q.options || ['Option A', 'Option B', 'Option C', 'Option D'],
                correctAnswers: [q.correctAnswer || 'A'],
                type: 'single',
                difficulty: 'medium',
                marks: 1,
                explanation: q.explanation || '',
                createdAt: new Date().toISOString()
            };
            questions.push(newQuestion);
            updateQuestionsList();
            updatePreview();
            showToast('Question added to paper!', 'success');
            autoSaveDraft();
        });
    });
}

// AI: POST /api/generate-slos
async function generateSLOS() {
    const subject = document.getElementById('slosSubject').value;
    const topic = document.getElementById('slosTopic').value;
    const grade = document.getElementById('slosGrade').value;
    
    if (!subject || !topic) {
        showToast('Please enter subject and topic', 'warning');
        return;
    }
    
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/generate-slos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                subject: subject,
                topic: topic,
                grade: grade,
                tool_slug: TOOL_SLUG
            })
        });
        const data = await response.json();
        
        const slosDiv = document.getElementById('slosResult');
        if (data.success && data.slos) {
            slosDiv.innerHTML = `
                <strong>Generated SLOs:</strong>
                <ul style="margin-top:10px; margin-left:20px;">
                    ${data.slos.map(s => `<li>${s}</li>`).join('')}
                </ul>
            `;
            showToast('SLOs generated successfully!', 'success');
        } else {
            slosDiv.innerHTML = `<p>No SLOs generated. Please try again.</p>`;
        }
        incrementUsage();
    } catch (error) {
        console.error('SLO generation failed:', error);
        showToast('SLO generation failed', 'error');
    } finally {
        hideLoading();
    }
}

// ========== SOCIAL SHARING FUNCTIONS ==========
function shareOnFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
    submitShare('facebook');
}

function shareOnTwitter() {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out MCQ Maker Pro!')}&url=${encodeURIComponent(window.location.href)}`, '_blank');
    submitShare('twitter');
}

function shareOnWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, '_blank');
    submitShare('whatsapp');
}

function shareOnLinkedIn() {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
    submitShare('linkedin');
}

async function copyLink() {
    try {
        await navigator.clipboard.writeText(window.location.href);
        submitShare('copy');
        showToast('Link copied to clipboard!', 'success');
    } catch (error) {
        showToast('Failed to copy link', 'error');
    }
}

// ========== QUESTION MANAGEMENT ==========
function initializeOptions() {
    const container = document.getElementById('optionsList');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 2; i++) {
        addOptionInput();
    }
}

function addOptionInput() {
    const container = document.getElementById('optionsList');
    const optionCount = container.children.length;
    if (optionCount >= 6) {
        showToast('Maximum 6 options allowed', 'warning');
        return;
    }
    
    const letter = String.fromCharCode(65 + optionCount);
    const div = document.createElement('div');
    div.className = 'option-item';
    div.innerHTML = `
        <input type="text" placeholder="Option ${letter}" class="option-input">
        <input type="radio" name="correctOption" class="correct-check">
        <button type="button" class="remove-option"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(div);
    
    div.querySelector('.remove-option').addEventListener('click', () => {
        if (container.children.length > 2) div.remove();
        else showToast('Minimum 2 options required', 'warning');
    });
}

function handleQuestionTypeChange(type) {
    const optionsArea = document.getElementById('optionsArea');
    const truefalseArea = document.getElementById('truefalseArea');
    const fillblankArea = document.getElementById('fillblankArea');
    const urduGroup = document.getElementById('urduQuestionGroup');
    
    optionsArea.style.display = (type === 'single' || type === 'multiple') ? 'block' : 'none';
    truefalseArea.style.display = type === 'truefalse' ? 'block' : 'none';
    fillblankArea.style.display = type === 'fillblank' ? 'block' : 'none';
    urduGroup.style.display = document.getElementById('bilingualMode')?.checked ? 'block' : 'none';
    
    const isMultiple = type === 'multiple';
    document.querySelectorAll('.correct-check').forEach(cb => {
        if (isMultiple) {
            cb.type = 'checkbox';
            cb.checked = false;
        } else {
            cb.type = 'radio';
            cb.name = 'correctOption';
        }
    });
}

function addQuestion() {
    const questionText = document.getElementById('questionText').value.trim();
    if (!questionText) {
        showToast('Please enter question text', 'warning');
        return;
    }
    
    const type = document.getElementById('questionType').value;
    let options = [];
    let correctAnswers = [];
    
    if (type === 'single' || type === 'multiple') {
        const optionInputs = document.querySelectorAll('#optionsList .option-input');
        const correctChecks = document.querySelectorAll('#optionsList .correct-check');
        
        optionInputs.forEach((input, idx) => {
            if (input.value.trim()) options.push(input.value.trim());
        });
        
        correctChecks.forEach((check, idx) => {
            if (check.checked) correctAnswers.push(String.fromCharCode(65 + idx));
        });
        
        if (options.length < 2) {
            showToast('Please add at least 2 options', 'warning');
            return;
        }
        if (correctAnswers.length === 0) {
            showToast('Please select correct answer(s)', 'warning');
            return;
        }
        if (type === 'single' && correctAnswers.length > 1) {
            showToast('Single correct can only have one answer', 'warning');
            return;
        }
    } else if (type === 'truefalse') {
        options = ['True', 'False'];
        const selected = document.querySelector('input[name="truefalse"]:checked')?.value;
        correctAnswers = [selected === 'true' ? 'A' : 'B'];
    } else if (type === 'fillblank') {
        const answer = document.getElementById('fillblankAnswer').value.trim();
        if (!answer) {
            showToast('Please enter correct answer', 'warning');
            return;
        }
        correctAnswers = [answer];
    }
    
    const question = {
        id: currentQuestionId++,
        text: questionText,
        textUrdu: document.getElementById('questionTextUrdu')?.value || '',
        options: options,
        correctAnswers: correctAnswers,
        type: type,
        difficulty: document.getElementById('questionDifficulty').value,
        marks: parseInt(document.getElementById('questionMarks').value) || 1,
        explanation: document.getElementById('questionExplanation').value || '',
        createdAt: new Date().toISOString()
    };
    
    questions.push(question);
    updateQuestionsList();
    clearQuestionForm();
    showToast('Question added successfully!', 'success');
    incrementUsage();
    autoSaveDraft();
    updatePreview();
    updateAnalytics();
}

function clearQuestionForm() {
    document.getElementById('questionText').value = '';
    document.getElementById('questionTextUrdu').value = '';
    document.getElementById('questionExplanation').value = '';
    document.getElementById('fillblankAnswer').value = '';
    document.getElementById('questionDifficulty').value = 'medium';
    document.getElementById('questionMarks').value = '1';
    initializeOptions();
    document.getElementById('questionType').value = 'single';
    handleQuestionTypeChange('single');
    
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-type') === 'single') btn.classList.add('active');
    });
}

function updateQuestionsList() {
    const container = document.getElementById('questionsList');
    const countSpan = document.getElementById('questionCount');
    
    if (!questions.length) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-question-circle"></i>
                <p>No questions added yet</p>
                <span>Start by adding questions from the form</span>
            </div>
        `;
        if (countSpan) countSpan.textContent = '(0)';
        return;
    }
    
    if (countSpan) countSpan.textContent = `(${questions.length})`;
    
    container.innerHTML = questions.map((q, idx) => `
        <div class="question-item" data-id="${q.id}" draggable="true">
            <div class="question-header">
                <div class="question-text">
                    <strong>Q${idx + 1}:</strong> ${q.text.substring(0, 80)}${q.text.length > 80 ? '...' : ''}
                    <span style="font-size:0.7rem; margin-left:8px;">
                        ${q.difficulty === 'easy' ? '🟢' : q.difficulty === 'medium' ? '🟡' : '🔴'} ${q.marks} mark${q.marks > 1 ? 's' : ''}
                    </span>
                </div>
                <div class="question-actions">
                    <button class="btn-icon edit-question" data-id="${q.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon delete-question" data-id="${q.id}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>
    `).join('');
    
    attachQuestionEvents();
    enableDragAndDrop();
}

function attachQuestionEvents() {
    document.querySelectorAll('.edit-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'));
            editQuestion(id);
        });
    });
    
    document.querySelectorAll('.delete-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'));
            deleteQuestion(id);
        });
    });
}

function editQuestion(id) {
    const question = questions.find(q => q.id === id);
    if (!question) return;
    
    document.getElementById('questionText').value = question.text;
    document.getElementById('questionTextUrdu').value = question.textUrdu || '';
    document.getElementById('questionExplanation').value = question.explanation || '';
    document.getElementById('questionDifficulty').value = question.difficulty;
    document.getElementById('questionMarks').value = question.marks;
    document.getElementById('questionType').value = question.type;
    handleQuestionTypeChange(question.type);
    
    if (question.type === 'single' || question.type === 'multiple') {
        const container = document.getElementById('optionsList');
        container.innerHTML = '';
        question.options.forEach((opt, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const div = document.createElement('div');
            div.className = 'option-item';
            const isCorrect = question.correctAnswers.includes(letter);
            div.innerHTML = `
                <input type="text" placeholder="Option ${letter}" class="option-input" value="${opt.replace(/"/g, '&quot;')}">
                <input type="${question.type === 'multiple' ? 'checkbox' : 'radio'}" name="correctOption" class="correct-check" ${isCorrect ? 'checked' : ''}>
                <button type="button" class="remove-option"><i class="fas fa-times"></i></button>
            `;
            container.appendChild(div);
            div.querySelector('.remove-option').addEventListener('click', () => div.remove());
        });
    } else if (question.type === 'truefalse') {
        const isTrue = question.correctAnswers[0] === 'A';
        document.querySelector(`input[name="truefalse"][value="${isTrue ? 'true' : 'false'}"]`).checked = true;
    } else if (question.type === 'fillblank') {
        document.getElementById('fillblankAnswer').value = question.correctAnswers[0];
    }
    
    questions = questions.filter(q => q.id !== id);
    updateQuestionsList();
    showToast('Edit the question and click Add Question', 'info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteQuestion(id) {
    if (confirm('Are you sure you want to delete this question?')) {
        questions = questions.filter(q => q.id !== id);
        updateQuestionsList();
        showToast('Question deleted', 'success');
        autoSaveDraft();
        updatePreview();
        updateAnalytics();
    }
}

// ========== DRAG AND DROP ==========
function enableDragAndDrop() {
    const items = document.querySelectorAll('.question-item');
    const container = document.getElementById('questionsList');
    
    items.forEach(item => {
        item.setAttribute('draggable', 'true');
        item.addEventListener('dragstart', (e) => {
            item.classList.add('dragging');
            e.dataTransfer.setData('text/plain', item.getAttribute('data-id'));
        });
        item.addEventListener('dragend', (e) => {
            item.classList.remove('dragging');
        });
    });
    
    if (container) {
        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            const draggingItem = document.querySelector('.question-item.dragging');
            if (!draggingItem) return;
            
            const siblings = [...container.querySelectorAll('.question-item:not(.dragging)')];
            const nextSibling = siblings.find(sibling => {
                const rect = sibling.getBoundingClientRect();
                return e.clientY < rect.top + rect.height / 2;
            });
            
            if (nextSibling) container.insertBefore(draggingItem, nextSibling);
            else container.appendChild(draggingItem);
        });
        
        container.addEventListener('dragend', () => {
            const newOrder = [...container.querySelectorAll('.question-item')].map(item => ({
                id: parseInt(item.getAttribute('data-id'))
            }));
            questions = newOrder.map(order => questions.find(q => q.id === order.id)).filter(Boolean);
            updateQuestionsList();
            autoSaveDraft();
            updatePreview();
        });
    }
}

// ========== AUTO SAVE DRAFT ==========
function autoSaveDraft() {
    const draft = {
        questions: questions,
        config: paperConfig,
        lastSaved: new Date().toISOString()
    };
    localStorage.setItem('mcq_draft', JSON.stringify(draft));
}

function loadDraft() {
    const saved = localStorage.getItem('mcq_draft');
    if (saved) {
        try {
            const draft = JSON.parse(saved);
            if (draft.questions && draft.questions.length) {
                questions = draft.questions;
                currentQuestionId = Math.max(...questions.map(q => q.id), 0) + 1;
                updateQuestionsList();
                showToast('Draft loaded', 'success');
                updatePreview();
            }
            if (draft.config) paperConfig = draft.config;
        } catch(e) { console.error('Failed to load draft'); }
    }
}

// ========== PREVIEW UPDATE ==========
function updatePreview() {
    const container = document.getElementById('paperPreview');
    const title = document.getElementById('paperTitle').value || 'MCQ Paper';
    const instructions = document.getElementById('instructions').value || 'Answer all questions.';
    const includeAnswerKey = document.getElementById('includeAnswerKey')?.checked || true;
    
    if (!questions.length) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-alt"></i>
                <p>No questions to preview</p>
                <span>Add questions to see the paper preview</span>
            </div>
        `;
        return;
    }
    
    let html = `<div style="text-align:center; margin-bottom:30px;"><h1>${title}</h1></div>`;
    html += `<div style="margin-bottom:20px; font-style:italic;">${instructions}</div>`;
    html += `<div class="questions-section">`;
    
    questions.forEach((q, idx) => {
        html += `<div class="preview-question">
            <strong>Q${idx + 1}:</strong> ${q.text}
            <div style="margin-left:20px; margin-top:8px;">`;
        
        if (q.options.length) {
            q.options.forEach((opt, optIdx) => {
                const letter = String.fromCharCode(65 + optIdx);
                html += `<div>${letter}. ${opt}</div>`;
            });
        } else {
            html += `<div>_______________</div>`;
        }
        html += `</div></div>`;
    });
    
    if (includeAnswerKey && questions.length) {
        html += `<div style="margin-top:40px; page-break-before:always;"><h3>Answer Key</h3>`;
        questions.forEach((q, idx) => {
            let answerText = q.correctAnswers.join(', ');
            if (q.options.length && q.correctAnswers[0]) {
                const ansIdx = q.correctAnswers[0].charCodeAt(0) - 65;
                if (q.options[ansIdx]) answerText = `${q.correctAnswers[0]}. ${q.options[ansIdx]}`;
            }
            html += `<div><strong>Q${idx + 1}:</strong> ${answerText}</div>`;
        });
        html += `</div>`;
    }
    
    html += `</div>`;
    container.innerHTML = html;
}

// ========== EXPORT FUNCTIONS ==========
async function exportToPDF() {
    const element = document.getElementById('paperPreview');
    if (!questions.length) {
        showToast('No questions to export', 'warning');
        return;
    }
    
    showLoading();
    try {
        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: `mcq_paper_${Date.now()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        await html2pdf().set(opt).from(element).save();
        showToast('PDF exported successfully!', 'success');
        incrementUsage();
    } catch (error) {
        showToast('PDF export failed', 'error');
    } finally {
        hideLoading();
    }
}

function exportToDOC() {
    if (!questions.length) {
        showToast('No questions to export', 'warning');
        return;
    }
    
    const title = document.getElementById('paperTitle').value || 'MCQ Paper';
    let content = `
        <html>
        <head><meta charset="UTF-8"><title>${title}</title></head>
        <body>
        <h1>${title}</h1>
    `;
    
    questions.forEach((q, idx) => {
        content += `<p><strong>Q${idx + 1}:</strong> ${q.text}</p>`;
        if (q.options.length) {
            q.options.forEach((opt, optIdx) => {
                const letter = String.fromCharCode(65 + optIdx);
                content += `<p style="margin-left:20px;">${letter}. ${opt}</p>`;
            });
        }
        content += `<br>`;
    });
    
    content += `</body></html>`;
    const blob = new Blob([content], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `mcq_paper_${Date.now()}.doc`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('DOC exported successfully!', 'success');
    incrementUsage();
}

function exportToTXT() {
    if (!questions.length) {
        showToast('No questions to export', 'warning');
        return;
    }
    
    let content = '';
    questions.forEach((q, idx) => {
        content += `${idx + 1}. ${q.text}\n`;
        if (q.options.length) {
            q.options.forEach((opt, optIdx) => {
                const letter = String.fromCharCode(65 + optIdx);
                content += `   ${letter}. ${opt}\n`;
            });
        }
        content += `\n`;
    });
    
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `mcq_paper_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('TXT exported successfully!', 'success');
    incrementUsage();
}

// ========== QUESTION BANK ==========
function updateBankSummary() {
    const easy = questionBank.filter(q => q.difficulty === 'easy').length;
    const medium = questionBank.filter(q => q.difficulty === 'medium').length;
    const hard = questionBank.filter(q => q.difficulty === 'hard').length;
    const subjects = [...new Set(questionBank.map(q => q.subject).filter(Boolean))];
    
    const bankEasy = document.getElementById('bankEasy');
    const bankMedium = document.getElementById('bankMedium');
    const bankHard = document.getElementById('bankHard');
    const bankSubjects = document.getElementById('bankSubjects');
    
    if (bankEasy) bankEasy.textContent = easy;
    if (bankMedium) bankMedium.textContent = medium;
    if (bankHard) bankHard.textContent = hard;
    if (bankSubjects) bankSubjects.textContent = subjects.length;
}

function displayBankQuestions() {
    const container = document.getElementById('bankQuestionsList');
    if (!container) return;
    
    const classFilter = document.getElementById('bankClassFilter')?.value || '';
    const subjectFilter = document.getElementById('bankSubjectFilter')?.value || '';
    const difficultyFilter = document.getElementById('bankDifficultyFilter')?.value || '';
    const searchFilter = document.getElementById('bankSearchFilter')?.value.toLowerCase() || '';
    
    let filtered = [...questionBank];
    
    if (classFilter) filtered = filtered.filter(q => q.classLevel === classFilter);
    if (subjectFilter && subjectFilter !== 'All Subjects') filtered = filtered.filter(q => q.subject === subjectFilter);
    if (difficultyFilter) filtered = filtered.filter(q => q.difficulty === difficultyFilter);
    if (searchFilter) filtered = filtered.filter(q => q.text.toLowerCase().includes(searchFilter));
    
    if (!filtered.length) {
        container.innerHTML = `<div class="empty-state-sm">No questions found in bank</div>`;
        return;
    }
    
    container.innerHTML = filtered.map((q, idx) => `
        <div class="bank-question">
            <div class="bank-question-header">
                <div>
                    <input type="checkbox" class="bank-select" data-id="${q.id || q.bankId}">
                    <strong>${q.text.substring(0, 100)}${q.text.length > 100 ? '...' : ''}</strong>
                    <span style="margin-left:8px; font-size:0.7rem;">${q.difficulty === 'easy' ? '🟢 Easy' : q.difficulty === 'medium' ? '🟡 Medium' : '🔴 Hard'}</span>
                </div>
                <div>
                    <button class="btn-icon add-bank-question" data-id="${q.id || q.bankId}" title="Add to paper"><i class="fas fa-plus"></i></button>
                    <button class="btn-icon delete-bank-question" data-id="${q.id || q.bankId}" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.add-bank-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'));
            addFromBankToPaper(id);
        });
    });
    
    document.querySelectorAll('.delete-bank-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'));
            deleteFromBank(id);
        });
    });
}

function saveToBank() {
    if (!questions.length) {
        showToast('No questions to save', 'warning');
        return;
    }
    
    const lastQuestion = questions[questions.length - 1];
    const exists = questionBank.some(q => q.text === lastQuestion.text);
    
    if (exists) {
        showToast('Question already exists in bank', 'warning');
        return;
    }
    
    const classLevel = document.getElementById('classLevel').value;
    const subject = document.getElementById('subject').value;
    
    questionBank.push({
        ...lastQuestion,
        bankId: Date.now(),
        classLevel: classLevel,
        subject: subject
    });
    localStorage.setItem('mcq_question_bank', JSON.stringify(questionBank));
    updateBankSummary();
    displayBankQuestions();
    showToast('Question saved to bank!', 'success');
}

function addFromBankToPaper(id) {
    const question = questionBank.find(q => (q.id === id || q.bankId === id));
    if (question) {
        const newQuestion = {...question, id: currentQuestionId++};
        questions.push(newQuestion);
        updateQuestionsList();
        updatePreview();
        showToast('Question added to paper!', 'success');
        autoSaveDraft();
    }
}

function deleteFromBank(id) {
    if (confirm('Delete this question from bank?')) {
        questionBank = questionBank.filter(q => q.id !== id && q.bankId !== id);
        localStorage.setItem('mcq_question_bank', JSON.stringify(questionBank));
        updateBankSummary();
        displayBankQuestions();
        showToast('Question deleted from bank', 'success');
    }
}

// ========== ANALYTICS ==========
function updateAnalytics() {
    const easy = questions.filter(q => q.difficulty === 'easy').length;
    const medium = questions.filter(q => q.difficulty === 'medium').length;
    const hard = questions.filter(q => q.difficulty === 'hard').length;
    const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 1), 0);
    
    const avgDifficulty = document.getElementById('avgDifficulty');
    const totalMarksEl = document.getElementById('totalMarks');
    const difficultyBreakdown = document.getElementById('difficultyBreakdown');
    
    if (avgDifficulty) avgDifficulty.textContent = easy > medium && easy > hard ? 'Easy' : medium > hard ? 'Medium' : hard > 0 ? 'Hard' : 'N/A';
    if (totalMarksEl) totalMarksEl.textContent = totalMarks;
    if (difficultyBreakdown) difficultyBreakdown.textContent = `E:${easy} M:${medium} H:${hard}`;
    
    if (typeof Chart !== 'undefined') {
        updateCharts(easy, medium, hard);
    }
}

function updateCharts(easy, medium, hard) {
    const diffCtx = document.getElementById('difficultyChart')?.getContext('2d');
    const typeCtx = document.getElementById('typeChart')?.getContext('2d');
    
    if (diffCtx) {
        if (window.difficultyChart) window.difficultyChart.destroy();
        window.difficultyChart = new Chart(diffCtx, {
            type: 'doughnut',
            data: {
                labels: ['Easy', 'Medium', 'Hard'],
                datasets: [{ data: [easy, medium, hard], backgroundColor: ['#10b981', '#f59e0b', '#ef4444'] }]
            },
            options: { responsive: true, maintainAspectRatio: true }
        });
    }
    
    if (typeCtx && questions.length) {
        const types = { single: 0, multiple: 0, truefalse: 0, fillblank: 0 };
        questions.forEach(q => types[q.type]++);
        if (window.typeChart) window.typeChart.destroy();
        window.typeChart = new Chart(typeCtx, {
            type: 'bar',
            data: {
                labels: ['Single', 'Multiple', 'True/False', 'Fill Blank'],
                datasets: [{ data: [types.single, types.multiple, types.truefalse, types.fillblank], backgroundColor: '#6366f1' }]
            },
            options: { responsive: true, maintainAspectRatio: true }
        });
    }
}

// ========== DARK MODE ==========
function initDarkMode() {
    const saved = localStorage.getItem('mcq_dark_mode');
    if (saved === 'dark') {
        document.body.classList.add('dark-mode');
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) toggleBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('mcq_dark_mode', isDark ? 'dark' : 'light');
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) toggleBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i> Light Mode' : '<i class="fas fa-moon"></i> Dark Mode';
    showToast(`${isDark ? 'Dark' : 'Light'} mode activated`, 'info');
}

// ========== SCROLL FUNCTIONS ==========
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// ========== TAB NAVIGATION ==========
function switchTab(tabId) {
    document.querySelectorAll('.tab-pane').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
    
    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.add('active');
    
    const activeNav = document.querySelector(`.nav-link[data-tab="${tabId}"]`);
    if (activeNav) activeNav.classList.add('active');
    
    if (tabId === 'preview') updatePreview();
    if (tabId === 'dashboard') fetchStats();
    if (tabId === 'bank') displayBankQuestions();
    if (tabId === 'analytics') updateAnalytics();
    
    if (window.innerWidth <= 768) document.getElementById('sidebar')?.classList.remove('open');
}

function toggleSidebar() {
    document.getElementById('sidebar')?.classList.toggle('open');
}

// ========== SAVE CONFIGURATION ==========
function saveConfiguration() {
    paperConfig = {
        classLevel: document.getElementById('classLevel').value,
        subject: document.getElementById('subject').value,
        paperTitle: document.getElementById('paperTitle').value,
        chapter: document.getElementById('chapter').value,
        totalQuestions: document.getElementById('totalQuestions').value,
        duration: document.getElementById('duration').value,
        easyCount: document.getElementById('easyCount').value,
        mediumCount: document.getElementById('mediumCount').value,
        hardCount: document.getElementById('hardCount').value,
        instructions: document.getElementById('instructions').value,
        randomizeOptions: document.getElementById('randomizeOptions')?.checked || false,
        includeAnswerKey: document.getElementById('includeAnswerKey')?.checked || true,
        bilingualMode: document.getElementById('bilingualMode')?.checked || false
    };
    localStorage.setItem('mcq_paper_config', JSON.stringify(paperConfig));
    showToast('Configuration saved!', 'success');
}

function loadConfiguration() {
    if (paperConfig) {
        const classLevel = document.getElementById('classLevel');
        const subject = document.getElementById('subject');
        const paperTitle = document.getElementById('paperTitle');
        const chapter = document.getElementById('chapter');
        const totalQuestions = document.getElementById('totalQuestions');
        const duration = document.getElementById('duration');
        const easyCount = document.getElementById('easyCount');
        const mediumCount = document.getElementById('mediumCount');
        const hardCount = document.getElementById('hardCount');
        const instructions = document.getElementById('instructions');
        const randomizeOptions = document.getElementById('randomizeOptions');
        const includeAnswerKey = document.getElementById('includeAnswerKey');
        const bilingualMode = document.getElementById('bilingualMode');
        
        if (classLevel && paperConfig.classLevel) classLevel.value = paperConfig.classLevel;
        if (subject && paperConfig.subject) subject.value = paperConfig.subject;
        if (paperTitle && paperConfig.paperTitle) paperTitle.value = paperConfig.paperTitle;
        if (chapter && paperConfig.chapter) chapter.value = paperConfig.chapter;
        if (totalQuestions && paperConfig.totalQuestions) totalQuestions.value = paperConfig.totalQuestions;
        if (duration && paperConfig.duration) duration.value = paperConfig.duration;
        if (easyCount && paperConfig.easyCount) easyCount.value = paperConfig.easyCount;
        if (mediumCount && paperConfig.mediumCount) mediumCount.value = paperConfig.mediumCount;
        if (hardCount && paperConfig.hardCount) hardCount.value = paperConfig.hardCount;
        if (instructions && paperConfig.instructions) instructions.value = paperConfig.instructions;
        if (randomizeOptions && paperConfig.randomizeOptions) randomizeOptions.checked = paperConfig.randomizeOptions;
        if (includeAnswerKey && paperConfig.includeAnswerKey) includeAnswerKey.checked = paperConfig.includeAnswerKey;
        if (bilingualMode && paperConfig.bilingualMode) bilingualMode.checked = paperConfig.bilingualMode;
    }
}

// ========== INITIALIZATION ==========
function initEventListeners() {
    document.querySelectorAll('.nav-link').forEach(nav => {
        nav.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = nav.getAttribute('data-tab');
            switchTab(tab);
        });
    });
    
    document.getElementById('openSidebar')?.addEventListener('click', toggleSidebar);
    document.getElementById('closeSidebar')?.addEventListener('click', toggleSidebar);
    document.getElementById('themeToggle')?.addEventListener('click', toggleDarkMode);
    document.getElementById('scrollTopBtn')?.addEventListener('click', scrollToTop);
    document.getElementById('scrollBottomBtn')?.addEventListener('click', scrollToBottom);
    
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const type = btn.getAttribute('data-type');
            document.getElementById('questionType').value = type;
            handleQuestionTypeChange(type);
        });
    });
    
    document.getElementById('addOptionBtn')?.addEventListener('click', addOptionInput);
    document.getElementById('addQuestionBtn')?.addEventListener('click', addQuestion);
    document.getElementById('saveToBankBtn')?.addEventListener('click', saveToBank);
    document.getElementById('saveSetupBtn')?.addEventListener('click', saveConfiguration);
    
    document.getElementById('exportPDF')?.addEventListener('click', exportToPDF);
    document.getElementById('exportDOC')?.addEventListener('click', exportToDOC);
    document.getElementById('exportTXT')?.addEventListener('click', exportToTXT);
    document.getElementById('printPaper')?.addEventListener('click', () => window.print());
    document.getElementById('refreshPreview')?.addEventListener('click', updatePreview);
    document.getElementById('refreshData')?.addEventListener('click', () => {
        fetchStats();
        showToast('Data refreshed', 'success');
    });
    
    document.getElementById('generateAIQuestions')?.addEventListener('click', generateAIQuestions);
    document.getElementById('generateSLOS')?.addEventListener('click', generateSLOS);
    
    document.getElementById('clearAllQuestions')?.addEventListener('click', () => {
        if (confirm('Delete all questions?')) {
            questions = [];
            updateQuestionsList();
            updatePreview();
            updateAnalytics();
            showToast('All questions cleared', 'success');
            autoSaveDraft();
        }
    });
    
    document.getElementById('applyBankFilters')?.addEventListener('click', displayBankQuestions);
    document.getElementById('resetBankFilters')?.addEventListener('click', () => {
        const bankClassFilter = document.getElementById('bankClassFilter');
        const bankSubjectFilter = document.getElementById('bankSubjectFilter');
        const bankDifficultyFilter = document.getElementById('bankDifficultyFilter');
        const bankSearchFilter = document.getElementById('bankSearchFilter');
        if (bankClassFilter) bankClassFilter.value = '';
        if (bankSubjectFilter) bankSubjectFilter.value = '';
        if (bankDifficultyFilter) bankDifficultyFilter.value = '';
        if (bankSearchFilter) bankSearchFilter.value = '';
        displayBankQuestions();
    });
    
    document.getElementById('importBankBtn')?.addEventListener('click', () => {
        showToast('Import feature - Upload JSON/CSV file', 'info');
    });
    
    document.getElementById('exportBankBtn')?.addEventListener('click', () => {
        const data = JSON.stringify(questionBank, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `question_bank_${Date.now()}.json`;
        link.click();
        showToast('Bank exported!', 'success');
    });
    
    document.getElementById('addSelectedToPaper')?.addEventListener('click', () => {
        document.querySelectorAll('.bank-select:checked').forEach(cb => {
            const id = parseInt(cb.getAttribute('data-id'));
            addFromBankToPaper(id);
        });
        showToast('Selected questions added to paper', 'success');
    });
    
    document.getElementById('deleteSelectedFromBank')?.addEventListener('click', () => {
        const ids = [...document.querySelectorAll('.bank-select:checked')].map(cb => parseInt(cb.getAttribute('data-id')));
        if (ids.length && confirm(`Delete ${ids.length} question(s)?`)) {
            questionBank = questionBank.filter(q => !ids.includes(q.id) && !ids.includes(q.bankId));
            localStorage.setItem('mcq_question_bank', JSON.stringify(questionBank));
            updateBankSummary();
            displayBankQuestions();
            showToast(`${ids.length} question(s) deleted`, 'success');
        }
    });
    
    document.querySelectorAll('.reaction').forEach(btn => {
        btn.addEventListener('click', () => submitReaction(btn.getAttribute('data-emoji')));
    });
    
    document.querySelectorAll('.share-icon').forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.getAttribute('data-platform');
            if (platform === 'facebook') shareOnFacebook();
            else if (platform === 'twitter') shareOnTwitter();
            else if (platform === 'whatsapp') shareOnWhatsApp();
            else if (platform === 'linkedin') shareOnLinkedIn();
            else if (platform === 'copy') copyLink();
        });
    });
    
    document.getElementById('bilingualMode')?.addEventListener('change', (e) => {
        const urduGroup = document.getElementById('urduQuestionGroup');
        if (urduGroup) urduGroup.style.display = e.target.checked ? 'block' : 'none';
    });
    
    document.querySelectorAll('[data-quick]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = btn.getAttribute('data-quick');
            if (action === 'new') {
                if (confirm('Start a new paper? Unsaved changes will be lost.')) {
                    questions = [];
                    currentQuestionId = 1;
                    updateQuestionsList();
                    updatePreview();
                    updateAnalytics();
                    showToast('New paper started', 'success');
                    autoSaveDraft();
                }
            } else if (action === 'import') {
                showToast('Import feature - Upload JSON/CSV file', 'info');
            }
        });
    });
}

// ========== INIT ==========
async function init() {
    console.log('MCQ Maker Pro Initializing with test-db.js endpoints...');
    
    initDarkMode();
    initEventListeners();
    initializeOptions();
    handleQuestionTypeChange('single');
    loadConfiguration();
    loadDraft();
    
    await Promise.all([
        fetchUsage(),
        fetchReactions(),
        fetchShares(),
        fetchStats()
    ]);
    
    incrementUsage();
    updateQuestionsList();
    updatePreview();
    updateAnalytics();
    updateBankSummary();
    displayBankQuestions();
    
    showToast('MCQ Maker Pro is ready! Connected to TiDB.', 'success');
    
    autoSaveInterval = setInterval(autoSaveDraft, 30000);
}

document.addEventListener('DOMContentLoaded', init);
