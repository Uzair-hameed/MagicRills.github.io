// ============================================
// MCQ MAKER PRO - CLOUDFLARE WORKERS API
// Complete JavaScript with Neon Theme & AI
// ============================================

// ========== CONFIGURATION ==========
const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';
const API_KEY = 'magicrills-grok-api.uzairhameed01.workers.dev';
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
let isOffline = false;
let usageCount = 0;
let shareCount = 0;

// ========== DOM ELEMENTS ==========
const loadingOverlay = document.getElementById('loadingOverlay');
const toastContainer = document.getElementById('toastContainer');

// ========== HELPER FUNCTIONS ==========
function showToast(message, type = 'info') {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-triangle',
        warning: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

function showLoading() {
    loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
}

function getApiHeaders() {
    return {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
        'X-Tool-Slug': TOOL_SLUG,
        'X-User-ID': currentUserId
    };
}

// ========== CLOUDFLARE WORKERS API CALLS ==========

// 1. POST /api/usage - Usage Counter Increment
async function incrementUsage() {
    try {
        const response = await fetch(`${API_BASE}/api/usage`, {
            method: 'POST',
            headers: getApiHeaders(),
            body: JSON.stringify({ 
                tool_slug: TOOL_SLUG, 
                user_id: currentUserId 
            })
        });
        const data = await response.json();
        if (data.success) {
            usageCount = data.total_usage || 0;
            updateUsageDisplay(usageCount);
            localStorage.setItem('mcq_usage_count', usageCount);
        } else {
            // Fallback to localStorage
            usageCount = parseInt(localStorage.getItem('mcq_usage_count') || '0') + 1;
            localStorage.setItem('mcq_usage_count', usageCount);
            updateUsageDisplay(usageCount);
        }
        return data;
    } catch (error) {
        console.warn('API offline, using localStorage fallback:', error);
        isOffline = true;
        usageCount = parseInt(localStorage.getItem('mcq_usage_count') || '0') + 1;
        localStorage.setItem('mcq_usage_count', usageCount);
        updateUsageDisplay(usageCount);
    }
}

// 2. GET /api/usage - Fetch Usage
async function fetchUsage() {
    try {
        const response = await fetch(`${API_BASE}/api/usage?tool_slug=${TOOL_SLUG}`);
        const data = await response.json();
        if (data.success) {
            usageCount = data.count || 0;
            updateUsageDisplay(usageCount);
            localStorage.setItem('mcq_usage_count', usageCount);
        }
        return data;
    } catch (error) {
        console.warn('API offline, using localStorage fallback:', error);
        isOffline = true;
        usageCount = parseInt(localStorage.getItem('mcq_usage_count') || '0');
        updateUsageDisplay(usageCount);
    }
}

function updateUsageDisplay(count) {
    const statUsage = document.getElementById('statUsage');
    const headerUsage = document.getElementById('headerUsage');
    if (statUsage) statUsage.textContent = count || 0;
    if (headerUsage) headerUsage.textContent = count || 0;
}

// 3. POST /api/reactions - Add Reaction
async function submitReaction(emoji) {
    if (userReactions[emoji]) {
        showToast(`You already reacted with ${emoji}`, 'warning');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/api/reactions`, {
            method: 'POST',
            headers: getApiHeaders(),
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
            showToast(`Reacted with ${emoji} 🎉`, 'success');
            incrementUsage();
        }
    } catch (error) {
        console.warn('API offline, using localStorage fallback:', error);
        isOffline = true;
        userReactions[emoji] = true;
        localStorage.setItem('mcq_reactions', JSON.stringify(userReactions));
        
        // Update local counts
        const counts = JSON.parse(localStorage.getItem('mcq_reaction_counts') || '{}');
        const emojiMap = { '👍': 'like', '❤️': 'love', '😮': 'wow', '😢': 'sad', '😂': 'laugh', '🎉': 'celebrate' };
        const key = emojiMap[emoji] || emoji;
        counts[key] = (counts[key] || 0) + 1;
        localStorage.setItem('mcq_reaction_counts', JSON.stringify(counts));
        updateReactionsDisplay(counts);
        showToast(`Reacted with ${emoji} (offline)`, 'success');
    }
}

// 4. GET /api/reactions - Fetch Reactions
async function fetchReactions() {
    try {
        const response = await fetch(`${API_BASE}/api/reactions?tool_slug=${TOOL_SLUG}`);
        const data = await response.json();
        if (data.success) {
            updateReactionsDisplay(data.reactions || {});
            localStorage.setItem('mcq_reaction_counts', JSON.stringify(data.reactions || {}));
        }
        return data;
    } catch (error) {
        console.warn('API offline, using localStorage fallback:', error);
        isOffline = true;
        const counts = JSON.parse(localStorage.getItem('mcq_reaction_counts') || '{}');
        updateReactionsDisplay(counts);
    }
}

function updateReactionsDisplay(reactions) {
    const emojiMap = {
        like: '👍', love: '❤️', wow: '😮', 
        sad: '😢', laugh: '😂', celebrate: '🎉'
    };
    
    document.querySelectorAll('.reaction').forEach(btn => {
        const emoji = btn.getAttribute('data-emoji');
        let reactionType = '';
        if (emoji === '👍') reactionType = 'like';
        else if (emoji === '❤️') reactionType = 'love';
        else if (emoji === '😮') reactionType = 'wow';
        else if (emoji === '😢') reactionType = 'sad';
        else if (emoji === '😂') reactionType = 'laugh';
        else if (emoji === '🎉') reactionType = 'celebrate';
        
        const count = reactions[reactionType] || 0;
        const countSpan = btn.querySelector('.reaction-count');
        if (countSpan) countSpan.textContent = count;
    });
    
    const total = Object.values(reactions).reduce((a, b) => a + b, 0);
    const statReactions = document.getElementById('statReactions');
    if (statReactions) statReactions.textContent = total || 0;
}

// 5. POST /api/shares - Record Share
async function submitShare(platform) {
    try {
        const response = await fetch(`${API_BASE}/api/shares`, {
            method: 'POST',
            headers: getApiHeaders(),
            body: JSON.stringify({ 
                tool_slug: TOOL_SLUG, 
                platform: platform,
                user_id: currentUserId 
            })
        });
        const data = await response.json();
        if (data.success) {
            shareCount = data.total_shares || 0;
            updateSharesDisplay(shareCount);
            localStorage.setItem('mcq_shares', shareCount);
            showToast(`Shared on ${platform} 🎉`, 'success');
            incrementUsage();
        }
        return data;
    } catch (error) {
        console.warn('API offline, using localStorage fallback:', error);
        isOffline = true;
        shareCount = parseInt(localStorage.getItem('mcq_shares') || '0') + 1;
        localStorage.setItem('mcq_shares', shareCount);
        updateSharesDisplay(shareCount);
        showToast(`Shared on ${platform} (offline)`, 'success');
    }
}

// 6. GET /api/shares - Fetch Shares
async function fetchShares() {
    try {
        const response = await fetch(`${API_BASE}/api/shares?tool_slug=${TOOL_SLUG}`);
        const data = await response.json();
        if (data.success) {
            shareCount = data.shares || 0;
            updateSharesDisplay(shareCount);
            localStorage.setItem('mcq_shares', shareCount);
        }
        return data;
    } catch (error) {
        console.warn('API offline, using localStorage fallback:', error);
        isOffline = true;
        shareCount = parseInt(localStorage.getItem('mcq_shares') || '0');
        updateSharesDisplay(shareCount);
    }
}

function updateSharesDisplay(count) {
    const statShares = document.getElementById('statShares');
    if (statShares) statShares.textContent = count || 0;
}

// 7. GET /api/stats - Get Tool Stats
async function fetchStats() {
    try {
        const response = await fetch(`${API_BASE}/api/stats?tool_slug=${TOOL_SLUG}`);
        const data = await response.json();
        if (data.success) {
            const stats = data.stats || {};
            document.getElementById('heroQuestions').textContent = stats.total_questions || questions.length;
            document.getElementById('heroPapers').textContent = stats.total_papers || 0;
            document.getElementById('heroExports').textContent = stats.total_exports || 0;
            document.getElementById('totalQuestions').textContent = stats.total_questions || questions.length;
            document.getElementById('totalPapers').textContent = stats.total_papers || 0;
            document.getElementById('totalExportsStat').textContent = stats.total_exports || 0;
            document.getElementById('aiGenerations').textContent = stats.ai_generations || 0;
            
            // Store in localStorage
            localStorage.setItem('mcq_stats', JSON.stringify(stats));
        }
        return data;
    } catch (error) {
        console.warn('API offline, using localStorage fallback:', error);
        isOffline = true;
        const stats = JSON.parse(localStorage.getItem('mcq_stats') || '{}');
        document.getElementById('heroQuestions').textContent = stats.total_questions || questions.length;
        document.getElementById('heroPapers').textContent = stats.total_papers || 0;
        document.getElementById('heroExports').textContent = stats.total_exports || 0;
        document.getElementById('totalQuestions').textContent = stats.total_questions || questions.length;
        document.getElementById('totalPapers').textContent = stats.total_papers || 0;
        document.getElementById('totalExportsStat').textContent = stats.total_exports || 0;
        document.getElementById('aiGenerations').textContent = stats.ai_generations || 0;
    }
    updateBankSummary();
}

// ========== SOCIAL SHARING FUNCTIONS ==========
function shareOnFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
    submitShare('facebook');
}

function shareOnTwitter() {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('📝 Check out MCQ Maker Pro - AI-powered question generator! Create professional MCQ papers for free!')}&url=${encodeURIComponent(window.location.href)}`, '_blank');
    submitShare('twitter');
}

function shareOnWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent('📝 MCQ Maker Pro - Create professional MCQ papers with AI! ' + window.location.href)}`, '_blank');
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
        showToast('Link copied to clipboard! 📋', 'success');
    } catch (error) {
        showToast('Failed to copy link', 'error');
    }
}

// ========== AI FUNCTIONS ==========

// AI: Generate MCQs via Cloudflare Worker
async function generateAIQuestions() {
    const topic = document.getElementById('aiTopic').value.trim();
    const grade = document.getElementById('aiGrade').value;
    const count = parseInt(document.getElementById('aiCount').value) || 5;
    const difficulty = document.getElementById('aiDifficulty').value;
    
    if (!topic) {
        showToast('Please enter a topic', 'warning');
        document.getElementById('aiTopic').focus();
        return;
    }
    
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/api/generate-mcqs`, {
            method: 'POST',
            headers: getApiHeaders(),
            body: JSON.stringify({ 
                subject: topic,
                topic: topic,
                grade: grade,
                count: count,
                difficulty: difficulty,
                tool_slug: TOOL_SLUG
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.mcqs && data.mcqs.length > 0) {
            displayAIGeneratedQuestions(data.mcqs);
            showToast(`${data.mcqs.length} questions generated! 🤖`, 'success');
            
            // Update AI generations count
            const aiGen = parseInt(localStorage.getItem('mcq_ai_generations') || '0') + data.mcqs.length;
            localStorage.setItem('mcq_ai_generations', aiGen);
            document.getElementById('aiGenerations').textContent = aiGen;
            
            incrementUsage();
        } else {
            // Fallback: Generate mock questions if API fails
            const fallbackQuestions = generateFallbackQuestions(topic, count);
            displayAIGeneratedQuestions(fallbackQuestions);
            showToast(`${fallbackQuestions.length} questions generated (offline mode)`, 'info');
        }
    } catch (error) {
        console.error('AI generation failed:', error);
        // Fallback: Generate mock questions
        const fallbackQuestions = generateFallbackQuestions(topic, count);
        displayAIGeneratedQuestions(fallbackQuestions);
        showToast(`${fallbackQuestions.length} questions generated (offline mode)`, 'info');
    } finally {
        hideLoading();
    }
}

// Fallback: Generate mock questions
function generateFallbackQuestions(topic, count) {
    const questions = [];
    const templates = [
        { q: `What is the definition of ${topic}?`, options: ['Option A', 'Option B', 'Option C', 'Option D'], correct: 'A' },
        { q: `Which of the following is true about ${topic}?`, options: ['Option A', 'Option B', 'Option C', 'Option D'], correct: 'B' },
        { q: `Explain the concept of ${topic} in simple terms.`, options: ['Option A', 'Option B', 'Option C', 'Option D'], correct: 'C' },
        { q: `What are the key principles of ${topic}?`, options: ['Option A', 'Option B', 'Option C', 'Option D'], correct: 'D' },
        { q: `How does ${topic} apply in real life?`, options: ['Option A', 'Option B', 'Option C', 'Option D'], correct: 'A' }
    ];
    
    for (let i = 0; i < Math.min(count, 10); i++) {
        const tpl = templates[i % templates.length];
        questions.push({
            question: `${tpl.q} (Q${i + 1})`,
            options: tpl.options.map((opt, idx) => `${String.fromCharCode(65 + idx)}. ${opt}`),
            correctAnswer: tpl.correct,
            explanation: `This is the correct answer for question ${i + 1}.`
        });
    }
    return questions;
}

function displayAIGeneratedQuestions(questionsList) {
    const container = document.getElementById('aiGeneratedList');
    if (!container) return;
    
    if (!questionsList || !questionsList.length) {
        container.innerHTML = '<div class="empty-state-sm">No questions generated. Try again.</div>';
        return;
    }
    
    container.innerHTML = questionsList.map((q, idx) => `
        <div class="ai-question">
            <strong>Q${idx + 1}:</strong> ${q.question || q.text || 'Question'}
            <div style="margin-left:20px; margin-top:5px; font-size:0.8rem; color: var(--text-secondary);">
                ${(q.options || ['A. Option A', 'B. Option B', 'C. Option C', 'D. Option D']).map(opt => `<div>• ${opt}</div>`).join('')}
            </div>
            <div style="margin-top:5px; font-size:0.75rem; color: var(--neon-green);">
                ✅ Correct: ${q.correctAnswer || q.correctAnswers?.join(', ') || 'A'}
            </div>
            ${q.explanation ? `<div style="margin-top:5px; font-size:0.7rem; color: var(--text-secondary);">💡 ${q.explanation}</div>` : ''}
            <button class="btn btn-primary btn-sm add-ai-question" style="margin-top:8px;" data-question='${JSON.stringify(q)}'>
                <i class="fas fa-plus"></i> Add to Paper
            </button>
        </div>
    `).join('');
    
    // Attach events for AI questions
    document.querySelectorAll('.add-ai-question').forEach(btn => {
        btn.addEventListener('click', () => {
            try {
                const q = JSON.parse(btn.getAttribute('data-question'));
                const newQuestion = {
                    id: currentQuestionId++,
                    text: q.question || q.text || 'Question',
                    options: q.options || ['Option A', 'Option B', 'Option C', 'Option D'],
                    correctAnswers: [q.correctAnswer || 'A'],
                    type: 'single',
                    difficulty: 'medium',
                    marks: 1,
                    explanation: q.explanation || '',
                    createdAt: new Date().toISOString(),
                    source: 'AI'
                };
                questions.push(newQuestion);
                updateQuestionsList();
                updatePreview();
                showToast('Question added to paper! 📝', 'success');
                autoSaveDraft();
            } catch (e) {
                showToast('Failed to add question', 'error');
            }
        });
    });
}

// AI: Generate SLOs
async function generateSLOS() {
    const subject = document.getElementById('slosSubject').value.trim();
    const topic = document.getElementById('slosTopic').value.trim();
    const grade = document.getElementById('slosGrade').value.trim();
    
    if (!subject || !topic) {
        showToast('Please enter subject and topic', 'warning');
        return;
    }
    
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/api/generate-slos`, {
            method: 'POST',
            headers: getApiHeaders(),
            body: JSON.stringify({ 
                subject: subject,
                topic: topic,
                grade: grade,
                tool_slug: TOOL_SLUG
            })
        });
        
        const data = await response.json();
        const slosDiv = document.getElementById('slosResult');
        
        if (data.success && data.slos && data.slos.length > 0) {
            slosDiv.innerHTML = `
                <strong>📚 Generated SLOs:</strong>
                <ul style="margin-top:10px; margin-left:20px; color: var(--text-secondary);">
                    ${data.slos.map(s => `<li style="margin-bottom:6px;">${s}</li>`).join('')}
                </ul>
            `;
            showToast('SLOs generated successfully! 🎓', 'success');
        } else {
            // Fallback: Generate mock SLOs
            const fallbackSlos = [
                `Understand the basic concepts of ${topic}`,
                `Apply ${topic} principles to solve problems`,
                `Analyze and evaluate ${topic} in real-world scenarios`,
                `Create solutions using ${topic} knowledge`
            ];
            slosDiv.innerHTML = `
                <strong>📚 Generated SLOs (offline):</strong>
                <ul style="margin-top:10px; margin-left:20px; color: var(--text-secondary);">
                    ${fallbackSlos.map(s => `<li style="margin-bottom:6px;">${s}</li>`).join('')}
                </ul>
            `;
            showToast('SLOs generated (offline mode)', 'info');
        }
        incrementUsage();
    } catch (error) {
        console.error('SLO generation failed:', error);
        const fallbackSlos = [
            `Understand the basic concepts of ${topic}`,
            `Apply ${topic} principles to solve problems`,
            `Analyze and evaluate ${topic} in real-world scenarios`
        ];
        const slosDiv = document.getElementById('slosResult');
        slosDiv.innerHTML = `
            <strong>📚 Generated SLOs (offline):</strong>
            <ul style="margin-top:10px; margin-left:20px; color: var(--text-secondary);">
                ${fallbackSlos.map(s => `<li style="margin-bottom:6px;">${s}</li>`).join('')}
            </ul>
        `;
        showToast('SLOs generated (offline mode)', 'info');
    } finally {
        hideLoading();
    }
}

// ========== AI INSIGHTS ==========
function generateAIInsights() {
    const container = document.getElementById('aiInsights');
    if (!container) return;
    
    if (questions.length === 0) {
        container.innerHTML = `
            <div class="insight-item" style="border-left-color: var(--neon-orange);">
                💡 Add some questions to get AI insights about your paper.
            </div>
        `;
        return;
    }
    
    const easy = questions.filter(q => q.difficulty === 'easy').length;
    const medium = questions.filter(q => q.difficulty === 'medium').length;
    const hard = questions.filter(q => q.difficulty === 'hard').length;
    const total = questions.length;
    
    const insights = [];
    
    // Difficulty balance
    if (easy > total * 0.6) {
        insights.push('🟢 Your paper has many easy questions. Consider adding more medium and hard questions for balance.');
    } else if (hard > total * 0.5) {
        insights.push('🔴 Your paper is very challenging. Consider adding some easy questions for accessibility.');
    } else if (easy > 0 && medium > 0 && hard > 0) {
        insights.push('✅ Great balance! Your paper has a mix of easy, medium, and hard questions.');
    }
    
    // Question count
    if (total < 5) {
        insights.push('📝 Add more questions for a comprehensive paper. Aim for at least 10 questions.');
    } else if (total >= 10 && total <= 20) {
        insights.push('📊 Good question count! This paper is well-sized for most assessments.');
    } else if (total > 20) {
        insights.push('📚 You have many questions. Consider splitting into multiple papers if needed.');
    }
    
    // AI suggestion
    if (total > 0) {
        const avgDifficulty = easy > medium && easy > hard ? 'Easy' : medium > hard ? 'Medium' : 'Hard';
        insights.push(`🤖 AI Suggestion: Your paper is predominantly ${avgDifficulty}. Consider adding questions from other difficulty levels.`);
    }
    
    container.innerHTML = insights.map(insight => `
        <div class="insight-item">${insight}</div>
    `).join('');
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
        document.getElementById('questionText').focus();
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
            document.getElementById('fillblankAnswer').focus();
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
    showToast('Question added successfully! ✅', 'success');
    incrementUsage();
    autoSaveDraft();
    updatePreview();
    updateAnalytics();
    generateAIInsights();
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
                        ${q.source === 'AI' ? ' 🤖' : ''}
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
    showToast('Edit the question and click Add Question ✏️', 'info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteQuestion(id) {
    if (confirm('Are you sure you want to delete this question?')) {
        questions = questions.filter(q => q.id !== id);
        updateQuestionsList();
        showToast('Question deleted 🗑️', 'success');
        autoSaveDraft();
        updatePreview();
        updateAnalytics();
        generateAIInsights();
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
                showToast('Draft loaded 📂', 'success');
                updatePreview();
                updateAnalytics();
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
    
    let html = `<div style="text-align:center; margin-bottom:30px;"><h1 style="color: var(--neon-primary);">${title}</h1></div>`;
    html += `<div style="margin-bottom:20px; font-style:italic; color: var(--text-secondary);">${instructions}</div>`;
    html += `<div class="questions-section">`;
    
    questions.forEach((q, idx) => {
        html += `<div class="preview-question">
            <strong style="color: var(--neon-primary);">Q${idx + 1}:</strong> ${q.text}
            <div style="margin-left:20px; margin-top:8px; color: var(--text-secondary);">`;
        
        if (q.options && q.options.length) {
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
        html += `<div style="margin-top:40px; page-break-before:always; border-top: 2px solid var(--neon-primary); padding-top: 20px;">
            <h3 style="color: var(--neon-primary);">📝 Answer Key</h3>`;
        questions.forEach((q, idx) => {
            let answerText = q.correctAnswers.join(', ');
            if (q.options && q.options.length && q.correctAnswers[0]) {
                const ansIdx = q.correctAnswers[0].charCodeAt(0) - 65;
                if (q.options[ansIdx]) answerText = `${q.correctAnswers[0]}. ${q.options[ansIdx]}`;
            }
            html += `<div style="margin:4px 0;"><strong>Q${idx + 1}:</strong> ${answerText}</div>`;
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
        // Ensure element has proper styles for PDF
        element.style.padding = '2rem';
        element.style.background = '#ffffff';
        element.style.color = '#1a1a2e';
        
        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: `mcq_paper_${Date.now()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        await html2pdf().set(opt).from(element).save();
        showToast('PDF exported successfully! 📄', 'success');
        incrementUsage();
        
        // Reset styles
        element.style.padding = '';
        element.style.background = '';
        element.style.color = '';
    } catch (error) {
        console.error('PDF export failed:', error);
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
        <head><meta charset="UTF-8"><title>${title}</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { text-align: center; color: #4a4a8a; }
            .q { margin: 15px 0; padding: 10px; border-bottom: 1px solid #eee; }
            .options { margin-left: 20px; }
        </style>
        </head>
        <body>
        <h1>${title}</h1>
        <p><em>${document.getElementById('instructions').value || ''}</em></p>
    `;
    
    questions.forEach((q, idx) => {
        content += `<div class="q">
            <strong>Q${idx + 1}:</strong> ${q.text}<br>
            <div class="options">`;
        if (q.options && q.options.length) {
            q.options.forEach((opt, optIdx) => {
                const letter = String.fromCharCode(65 + optIdx);
                content += `${letter}. ${opt}<br>`;
            });
        }
        content += `</div></div>`;
    });
    
    // Answer key
    if (document.getElementById('includeAnswerKey')?.checked) {
        content += `<hr><h3>Answer Key</h3>`;
        questions.forEach((q, idx) => {
            let answerText = q.correctAnswers.join(', ');
            if (q.options && q.options.length && q.correctAnswers[0]) {
                const ansIdx = q.correctAnswers[0].charCodeAt(0) - 65;
                if (q.options[ansIdx]) answerText = `${q.correctAnswers[0]}. ${q.options[ansIdx]}`;
            }
            content += `<div><strong>Q${idx + 1}:</strong> ${answerText}</div>`;
        });
    }
    
    content += `</body></html>`;
    const blob = new Blob([content], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `mcq_paper_${Date.now()}.doc`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('DOC exported successfully! 📝', 'success');
    incrementUsage();
}

function exportToTXT() {
    if (!questions.length) {
        showToast('No questions to export', 'warning');
        return;
    }
    
    const title = document.getElementById('paperTitle').value || 'MCQ Paper';
    let content = `${title}\n${'='.repeat(title.length)}\n\n`;
    content += `${document.getElementById('instructions').value || ''}\n\n`;
    
    questions.forEach((q, idx) => {
        content += `${idx + 1}. ${q.text}\n`;
        if (q.options && q.options.length) {
            q.options.forEach((opt, optIdx) => {
                const letter = String.fromCharCode(65 + optIdx);
                content += `   ${letter}. ${opt}\n`;
            });
        }
        content += `\n`;
    });
    
    if (document.getElementById('includeAnswerKey')?.checked) {
        content += `\n${'='.repeat(30)}\nANSWER KEY\n${'='.repeat(30)}\n`;
        questions.forEach((q, idx) => {
            let answerText = q.correctAnswers.join(', ');
            if (q.options && q.options.length && q.correctAnswers[0]) {
                const ansIdx = q.correctAnswers[0].charCodeAt(0) - 65;
                if (q.options[ansIdx]) answerText = `${q.correctAnswers[0]}. ${q.options[ansIdx]}`;
            }
            content += `Q${idx + 1}: ${answerText}\n`;
        });
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `mcq_paper_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('TXT exported successfully! 📄', 'success');
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
        container.innerHTML = `<div class="empty-state-sm">📭 No questions found in bank</div>`;
        return;
    }
    
    container.innerHTML = filtered.map((q, idx) => `
        <div class="bank-question">
            <div class="bank-question-header">
                <div>
                    <input type="checkbox" class="bank-select" data-id="${q.id || q.bankId}">
                    <strong>${q.text.substring(0, 100)}${q.text.length > 100 ? '...' : ''}</strong>
                    <span style="margin-left:8px; font-size:0.7rem;">${q.difficulty === 'easy' ? '🟢 Easy' : q.difficulty === 'medium' ? '🟡 Medium' : '🔴 Hard'}</span>
                    ${q.source === 'AI' ? ' 🤖' : ''}
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
    showToast('Question saved to bank! 📚', 'success');
}

function addFromBankToPaper(id) {
    const question = questionBank.find(q => (q.id === id || q.bankId === id));
    if (question) {
        const newQuestion = {...question, id: currentQuestionId++};
        questions.push(newQuestion);
        updateQuestionsList();
        updatePreview();
        showToast('Question added to paper! 📝', 'success');
        autoSaveDraft();
        updateAnalytics();
        generateAIInsights();
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
    const trendCtx = document.getElementById('trendChart')?.getContext('2d');
    
    // Difficulty Chart
    if (diffCtx) {
        if (window.difficultyChart) window.difficultyChart.destroy();
        window.difficultyChart = new Chart(diffCtx, {
            type: 'doughnut',
            data: {
                labels: ['Easy', 'Medium', 'Hard'],
                datasets: [{ 
                    data: [easy, medium, hard], 
                    backgroundColor: ['#00ff88', '#ffd700', '#ff0044'],
                    borderColor: ['#0a0e1a', '#0a0e1a', '#0a0e1a'],
                    borderWidth: 2
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: true,
                plugins: {
                    legend: { labels: { color: '#e8f0ff' } }
                }
            }
        });
    }
    
    // Type Chart
    if (typeCtx && questions.length) {
        const types = { single: 0, multiple: 0, truefalse: 0, fillblank: 0 };
        questions.forEach(q => types[q.type]++);
        if (window.typeChart) window.typeChart.destroy();
        window.typeChart = new Chart(typeCtx, {
            type: 'bar',
            data: {
                labels: ['Single', 'Multiple', 'True/False', 'Fill Blank'],
                datasets: [{ 
                    data: [types.single, types.multiple, types.truefalse, types.fillblank], 
                    backgroundColor: ['#00f5ff', '#ff6bff', '#ffd700', '#00ff88'],
                    borderRadius: 8
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { ticks: { color: '#8899bb' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                    x: { ticks: { color: '#8899bb' }, grid: { display: false } }
                }
            }
        });
    }
    
    // Trend Chart
    if (trendCtx) {
        const usageData = JSON.parse(localStorage.getItem('mcq_usage_history') || '[]');
        const labels = usageData.length > 0 ? usageData.map((_, i) => `Day ${i + 1}`) : ['Today'];
        const data = usageData.length > 0 ? usageData : [questions.length || 1];
        
        if (window.trendChart) window.trendChart.destroy();
        window.trendChart = new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{ 
                    data: data, 
                    borderColor: '#00f5ff',
                    backgroundColor: 'rgba(0, 245, 255, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#00f5ff',
                    pointBorderColor: '#0a0e1a'
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { 
                        ticks: { color: '#8899bb' }, 
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        beginAtZero: true
                    },
                    x: { 
                        ticks: { color: '#8899bb' }, 
                        grid: { display: false }
                    }
                }
            }
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
    showToast(`${isDark ? '🌙 Dark' : '☀️ Light'} mode activated`, 'info');
}

// ========== TYPEWRITER EFFECT ==========
function initTypewriter() {
    const phrases = [
        'Create professional MCQ papers in minutes 🚀',
        'AI-powered question generation 🤖',
        'Export to PDF, DOC, or TXT 📄',
        'Share with students and colleagues 👥',
        'Track analytics and insights 📊'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typewriterElement = document.querySelector('.typewriter');
    
    if (!typewriterElement) return;
    
    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let speed = isDeleting ? 30 : 60;
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            speed = 500;
        }
        
        setTimeout(typeEffect, speed);
    }
    
    typeEffect();
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
    if (tabId === 'dashboard') { fetchStats(); generateAIInsights(); }
    if (tabId === 'bank') displayBankQuestions();
    if (tabId === 'analytics') updateAnalytics();
    
    if (window.innerWidth <= 768) document.getElementById('sidebar')?.classList.remove('open');
    
    // Update checklist
    updateChecklist(tabId);
}

function toggleSidebar() {
    document.getElementById('sidebar')?.classList.toggle('open');
}

// ========== CHECKLIST ==========
function updateChecklist(currentTab) {
    const items = document.querySelectorAll('.check-item');
    const tabMap = {
        'setup': 1,
        'questions': 2,
        'ai': 3,
        'preview': 4
    };
    
    const step = tabMap[currentTab] || 0;
    
    items.forEach((item, index) => {
        const itemStep = parseInt(item.getAttribute('data-step'));
        if (itemStep <= step) {
            item.classList.add('completed');
        } else {
            item.classList.remove('completed');
        }
    });
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
    showToast('Configuration saved! 💾', 'success');
}

function loadConfiguration() {
    if (paperConfig) {
        const fields = {
            classLevel: 'classLevel',
            subject: 'subject',
            paperTitle: 'paperTitle',
            chapter: 'chapter',
            totalQuestions: 'totalQuestions',
            duration: 'duration',
            easyCount: 'easyCount',
            mediumCount: 'mediumCount',
            hardCount: 'hardCount',
            instructions: 'instructions'
        };
        
        Object.keys(fields).forEach(key => {
            const el = document.getElementById(fields[key]);
            if (el && paperConfig[key] !== undefined) el.value = paperConfig[key];
        });
        
        const checkboxes = {
            randomizeOptions: 'randomizeOptions',
            includeAnswerKey: 'includeAnswerKey',
            bilingualMode: 'bilingualMode'
        };
        
        Object.keys(checkboxes).forEach(key => {
            const el = document.getElementById(checkboxes[key]);
            if (el && paperConfig[key] !== undefined) el.checked = paperConfig[key];
        });
    }
}

// ========== NAVIGATION ==========
function goHome() {
    window.location.href = 'https://magicrills.com';
}

function goBack() {
    window.location.href = 'https://magicrills.com/category-pages/mixed-tools.html';
}

// ========== INITIALIZATION ==========
function initEventListeners() {
    // Tab Navigation
    document.querySelectorAll('.nav-link').forEach(nav => {
        nav.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = nav.getAttribute('data-tab');
            switchTab(tab);
        });
    });
    
    // Tab links in cards
    document.querySelectorAll('[data-tab-link]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = link.getAttribute('data-tab-link');
            switchTab(tab);
        });
    });
    
    // Sidebar Toggle
    document.getElementById('openSidebar')?.addEventListener('click', toggleSidebar);
    document.getElementById('closeSidebar')?.addEventListener('click', toggleSidebar);
    
    // Theme Toggle
    document.getElementById('themeToggle')?.addEventListener('click', toggleDarkMode);
    
    // Scroll Controls
    document.getElementById('scrollTopBtn')?.addEventListener('click', scrollToTop);
    document.getElementById('scrollBottomBtn')?.addEventListener('click', scrollToBottom);
    
    // Navigation Buttons
    document.getElementById('goHomeBtn')?.addEventListener('click', goHome);
    document.getElementById('goBackBtn')?.addEventListener('click', goBack);
    
    // Question Type Buttons
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const type = btn.getAttribute('data-type');
            document.getElementById('questionType').value = type;
            handleQuestionTypeChange(type);
        });
    });
    
    // Add Option
    document.getElementById('addOptionBtn')?.addEventListener('click', addOptionInput);
    
    // Add Question
    document.getElementById('addQuestionBtn')?.addEventListener('click', addQuestion);
    
    // Save to Bank
    document.getElementById('saveToBankBtn')?.addEventListener('click', saveToBank);
    
    // Save Configuration
    document.getElementById('saveSetupBtn')?.addEventListener('click', saveConfiguration);
    
    // Reset Configuration
    document.getElementById('resetSetupBtn')?.addEventListener('click', () => {
        document.querySelectorAll('#setup .form-control').forEach(el => {
            if (el.tagName === 'SELECT') el.value = '';
            else if (el.type === 'text' || el.type === 'number' || el.tagName === 'TEXTAREA') el.value = '';
        });
        document.querySelectorAll('#setup .checkbox-label input').forEach(el => el.checked = false);
        showToast('Configuration reset', 'info');
    });
    
    // Export Buttons
    document.getElementById('exportPDF')?.addEventListener('click', exportToPDF);
    document.getElementById('exportDOC')?.addEventListener('click', exportToDOC);
    document.getElementById('exportTXT')?.addEventListener('click', exportToTXT);
    document.getElementById('printPaper')?.addEventListener('click', () => window.print());
    
    // Refresh Preview
    document.getElementById('refreshPreview')?.addEventListener('click', updatePreview);
    
    // Refresh Data
    document.getElementById('refreshData')?.addEventListener('click', () => {
        fetchStats();
        fetchReactions();
        fetchShares();
        fetchUsage();
        showToast('Data refreshed 🔄', 'success');
    });
    
    // AI Generation
    document.getElementById('generateAIQuestions')?.addEventListener('click', generateAIQuestions);
    document.getElementById('generateSLOS')?.addEventListener('click', generateSLOS);
    
    // AI Insights
    document.getElementById('analyzeNow')?.addEventListener('click', generateAIInsights);
    
    // Clear All Questions
    document.getElementById('clearAllQuestions')?.addEventListener('click', () => {
        if (confirm('Delete all questions?')) {
            questions = [];
            updateQuestionsList();
            updatePreview();
            updateAnalytics();
            generateAIInsights();
            showToast('All questions cleared 🗑️', 'success');
            autoSaveDraft();
        }
    });
    
    // Bank Filters
    document.getElementById('applyBankFilters')?.addEventListener('click', displayBankQuestions);
    document.getElementById('resetBankFilters')?.addEventListener('click', () => {
        ['bankClassFilter', 'bankSubjectFilter', 'bankDifficultyFilter'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        const search = document.getElementById('bankSearchFilter');
        if (search) search.value = '';
        displayBankQuestions();
    });
    
    // Select All in Bank
    document.getElementById('selectAllBank')?.addEventListener('change', (e) => {
        document.querySelectorAll('.bank-select').forEach(cb => cb.checked = e.target.checked);
    });
    
    // Add Selected to Paper
    document.getElementById('addSelectedToPaper')?.addEventListener('click', () => {
        const selected = document.querySelectorAll('.bank-select:checked');
        if (!selected.length) {
            showToast('Select at least one question', 'warning');
            return;
        }
        selected.forEach(cb => {
            const id = parseInt(cb.getAttribute('data-id'));
            addFromBankToPaper(id);
        });
        showToast(`${selected.length} question(s) added to paper 📝`, 'success');
    });
    
    // Delete Selected from Bank
    document.getElementById('deleteSelectedFromBank')?.addEventListener('click', () => {
        const ids = [...document.querySelectorAll('.bank-select:checked')].map(cb => parseInt(cb.getAttribute('data-id')));
        if (ids.length && confirm(`Delete ${ids.length} question(s) from bank?`)) {
            questionBank = questionBank.filter(q => !ids.includes(q.id) && !ids.includes(q.bankId));
            localStorage.setItem('mcq_question_bank', JSON.stringify(questionBank));
            updateBankSummary();
            displayBankQuestions();
            showToast(`${ids.length} question(s) deleted from bank 🗑️`, 'success');
        }
    });
    
    // Import/Export Bank
    document.getElementById('importBankBtn')?.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    try {
                        const data = JSON.parse(ev.target.result);
                        if (Array.isArray(data)) {
                            questionBank = data;
                            localStorage.setItem('mcq_question_bank', JSON.stringify(questionBank));
                            updateBankSummary();
                            displayBankQuestions();
                            showToast(`Imported ${data.length} questions 📥`, 'success');
                        }
                    } catch (err) {
                        showToast('Invalid file format', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    });
    
    document.getElementById('exportBankBtn')?.addEventListener('click', () => {
        const data = JSON.stringify(questionBank, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `question_bank_${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(link.href);
        showToast('Bank exported 📤', 'success');
    });
    
    // Reactions
    document.querySelectorAll('.reaction').forEach(btn => {
        btn.addEventListener('click', () => submitReaction(btn.getAttribute('data-emoji')));
    });
    
    // Share Buttons
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
    
    // Bilingual Mode Toggle
    document.getElementById('bilingualMode')?.addEventListener('change', (e) => {
        const urduGroup = document.getElementById('urduQuestionGroup');
        if (urduGroup) urduGroup.style.display = e.target.checked ? 'block' : 'none';
    });
    
    // Quick Action Buttons
    document.querySelectorAll('[data-quick]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = btn.getAttribute('data-quick');
            if (action === 'new') {
                if (questions.length && !confirm('Start a new paper? Unsaved changes will be lost.')) return;
                questions = [];
                currentQuestionId = 1;
                updateQuestionsList();
                updatePreview();
                updateAnalytics();
                generateAIInsights();
                showToast('New paper started 📄', 'success');
                autoSaveDraft();
            } else if (action === 'import') {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json,.csv';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                            try {
                                const data = JSON.parse(ev.target.result);
                                if (Array.isArray(data)) {
                                    data.forEach(q => {
                                        q.id = currentQuestionId++;
                                        questions.push(q);
                                    });
                                    updateQuestionsList();
                                    updatePreview();
                                    updateAnalytics();
                                    showToast(`Imported ${data.length} questions 📥`, 'success');
                                    autoSaveDraft();
                                }
                            } catch (err) {
                                showToast('Invalid file format', 'error');
                            }
                        };
                        reader.readAsText(file);
                    }
                };
                input.click();
            }
        });
    });
    
    // View All Activity
    document.getElementById('viewAllActivity')?.addEventListener('click', () => {
        showToast('📊 All activity will be shown here', 'info');
    });
    
    // Enter key for AI generate
    document.getElementById('aiTopic')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') generateAIQuestions();
    });
}

// ========== ACTIVITY LOG ==========
function updateActivityLog() {
    const container = document.getElementById('recentActivity');
    if (!container) return;
    
    const activities = JSON.parse(localStorage.getItem('mcq_activity') || '[]');
    
    if (!activities.length) {
        container.innerHTML = '<div class="empty-state-sm">No recent activity</div>';
        return;
    }
    
    const recent = activities.slice(-5).reverse();
    container.innerHTML = recent.map(act => `
        <div class="activity-item">
            <div class="activity-icon"><i class="fas ${act.icon || 'fa-circle'}"></i></div>
            <div class="activity-detail">
                <div class="activity-title">${act.message}</div>
                <div class="activity-time">${act.time || 'Just now'}</div>
            </div>
        </div>
    `).join('');
}

function logActivity(message, icon = 'fa-circle') {
    const activities = JSON.parse(localStorage.getItem('mcq_activity') || '[]');
    activities.push({
        message: message,
        icon: icon,
        time: new Date().toLocaleString()
    });
    localStorage.setItem('mcq_activity', JSON.stringify(activities));
    updateActivityLog();
}

// ========== AUTO SAVE USAGE HISTORY ==========
function updateUsageHistory() {
    const history = JSON.parse(localStorage.getItem('mcq_usage_history') || '[]');
    history.push(questions.length || 1);
    if (history.length > 30) history.shift();
    localStorage.setItem('mcq_usage_history', JSON.stringify(history));
}

// ========== INIT ==========
async function init() {
    console.log('🚀 MCQ Maker Pro Initializing...');
    console.log('📡 API Base:', API_BASE);
    console.log('🔑 API Key:', API_KEY);
    console.log('📌 Tool Slug:', TOOL_SLUG);
    console.log('👤 User ID:', currentUserId);
    
    // Initialize
    initDarkMode();
    initEventListeners();
    initTypewriter();
    initializeOptions();
    handleQuestionTypeChange('single');
    loadConfiguration();
    loadDraft();
    
    // Load data from API
    await Promise.all([
        fetchUsage(),
        fetchReactions(),
        fetchShares(),
        fetchStats()
    ]);
    
    // Increment usage on load
    await incrementUsage();
    
    // Update UI
    updateQuestionsList();
    updatePreview();
    updateAnalytics();
    updateBankSummary();
    displayBankQuestions();
    updateActivityLog();
    generateAIInsights();
    updateChecklist('dashboard');
    updateUsageHistory();
    
    // Log activity
    logActivity('Tool loaded successfully', 'fa-rocket');
    
    // Show welcome toast
    const userGreeting = document.getElementById('userGreeting');
    if (userGreeting) {
        const hour = new Date().getHours();
        let greeting = 'Educator';
        if (hour < 12) greeting = '🌅 Good Morning';
        else if (hour < 17) greeting = '☀️ Good Afternoon';
        else greeting = '🌙 Good Evening';
        userGreeting.textContent = greeting;
    }
    
    showToast('🎯 MCQ Maker Pro is ready! Connected to Cloudflare Workers API.', 'success');
    
    // Auto-save every 30 seconds
    autoSaveInterval = setInterval(autoSaveDraft, 30000);
    
    // Auto-refresh stats every 60 seconds
    setInterval(() => {
        if (!isOffline) {
            fetchStats();
            fetchReactions();
            fetchShares();
        }
    }, 60000);
    
    console.log('✅ MCQ Maker Pro initialized successfully!');
}

// Handle offline/online events
window.addEventListener('online', () => {
    isOffline = false;
    showToast('🔄 Back online! Syncing data...', 'success');
    fetchStats();
    fetchReactions();
    fetchShares();
    fetchUsage();
});

window.addEventListener('offline', () => {
    isOffline = true;
    showToast('⚠️ You are offline. Using local storage.', 'warning');
});

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);

// Export for debugging
window.__mcq = {
    API_BASE,
    API_KEY,
    TOOL_SLUG,
    USER_ID,
    questions,
    questionBank,
    paperConfig,
    incrementUsage,
    fetchStats,
    generateAIQuestions,
    exportToPDF
};
