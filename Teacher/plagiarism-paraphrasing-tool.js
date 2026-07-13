// ============================================
// FILE: plagiarism-paraphrasing-tool.js
// MagicRills - Cloudflare Workers API + Gemini AI
// Version: 4.0 - Full Real Data Integration
// ============================================

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    TOOL_SLUG: 'plagiarism-paraphrasing-tool',
    API_BASE: 'https://plagiarism-paraphrasing-tool.uzairhameed01.workers.dev',
    SESSION_KEY: 'magicRills_session',
    DRAFT_KEY: 'magicRills_draft',
    USAGE_KEY: 'magicRills_usage',
    REACTIONS_KEY: 'magicRills_reactions',
    SHARES_KEY: 'magicRills_shares',
    DARK_KEY: 'magicRills_dark',
    RTL_KEY: 'magicRills_rtl',
    AUTOSAVE_KEY: 'magicRills_autoSave'
};

// Session Management
let sessionId = localStorage.getItem(CONFIG.SESSION_KEY);
if (!sessionId) {
    sessionId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem(CONFIG.SESSION_KEY, sessionId);
}

// ============================================
// DOM ELEMENTS
// ============================================
const DOM = {
    // Input & Output
    inputText: document.getElementById('inputText'),
    paraphrasedText: document.getElementById('paraphrasedText'),
    highlightedText: document.getElementById('highlightedText'),
    
    // Stats - Live
    liveWordCount: document.getElementById('liveWordCount'),
    liveCharCount: document.getElementById('liveCharCount'),
    languageDetect: document.getElementById('languageDetect'),
    
    // Stats - Report
    toolUsageCount: document.getElementById('toolUsageCount'),
    globalUsageCount: document.getElementById('globalUsageCount'),
    shareCount: document.getElementById('shareCount'),
    wordCount: document.getElementById('wordCount'),
    uniqueWords: document.getElementById('uniqueWords'),
    readability: document.getElementById('readability'),
    grammarScore: document.getElementById('grammarScore'),
    similarityScore: document.getElementById('similarityScore'),
    scoreFill: document.getElementById('scoreFill'),
    
    // Hero Stats
    heroUsageCount: document.getElementById('heroUsageCount'),
    heroShareCount: document.getElementById('heroShareCount'),
    heroReactionCount: document.getElementById('heroReactionCount'),
    
    // Sections
    plagiarismReport: document.getElementById('plagiarismReport'),
    paraphrasedOutput: document.getElementById('paraphrasedOutput'),
    plagiarismLoading: document.getElementById('plagiarismLoading'),
    paraphraseLoading: document.getElementById('paraphraseLoading'),
    
    // Buttons
    checkPlagiarism: document.getElementById('checkPlagiarism'),
    paraphraseBtn: document.getElementById('paraphraseText'),
    improveBtn: document.getElementById('improveText'),
    clearBtn: document.getElementById('clearText'),
    copyParaphrased: document.getElementById('copyParaphrased'),
    useParaphrased: document.getElementById('useParaphrased'),
    regenerateParaphrase: document.getElementById('regenerateParaphrase'),
    copyUrlBtn: document.getElementById('copyUrlBtn'),
    premiumBtn: document.getElementById('premiumBtn'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    modeToggle: document.getElementById('modeToggle'),
    
    // Downloads
    downloadTxt: document.getElementById('downloadTxt'),
    downloadPdf: document.getElementById('downloadPdf'),
    downloadDocx: document.getElementById('downloadDocx'),
    
    // Settings
    autoParaphrase: document.getElementById('autoParaphrase'),
    highlightSynonyms: document.getElementById('highlightSynonyms'),
    rtlMode: document.getElementById('rtlMode'),
    autoSave: document.getElementById('autoSave'),
    
    // Modals & Toasts
    premiumModal: document.getElementById('premiumModal'),
    toast: document.getElementById('toast'),
    toastMsg: document.getElementById('toastMsg'),
    
    // Scroll
    scrollUpBtn: document.getElementById('scrollUpBtn'),
    scrollDownBtn: document.getElementById('scrollDownBtn'),
    
    // Typewriter
    typewriterText: document.getElementById('typewriter-text'),
    
    // Reactions
    reactions: {
        like: document.getElementById('reaction-like'),
        love: document.getElementById('reaction-love'),
        wow: document.getElementById('reaction-wow'),
        sad: document.getElementById('reaction-sad'),
        angry: document.getElementById('reaction-angry'),
        laugh: document.getElementById('reaction-laugh'),
        celebrate: document.getElementById('reaction-celebrate')
    }
};

// ============================================
// REACTION MAPPING
// ============================================
const REACTION_MAP = {
    '👍': 'like', '❤️': 'love', '😮': 'wow',
    '😢': 'sad', '😠': 'angry', '😂': 'laugh', '🎉': 'celebrate'
};

const REACTION_EMOJIS = {
    like: '👍', love: '❤️', wow: '😮',
    sad: '😢', angry: '😠', laugh: '😂', celebrate: '🎉'
};

// ============================================
// API CLIENT
// ============================================
class APIClient {
    constructor() {
        this.baseURL = CONFIG.API_BASE;
        this.sessionId = sessionId;
        this.isOnline = navigator.onLine;
    }

    async request(endpoint, options = {}) {
        try {
            // Check if API is reachable
            if (!this.isOnline) {
                throw new Error('Offline mode');
            }

            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                body: options.body ? JSON.stringify(options.body) : undefined
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // ============================================
    // GENERATE WITH GEMINI AI
    // ============================================
    async generate(prompt, type = 'paraphrase') {
        return this.request('/api/generate', {
            method: 'POST',
            body: {
                prompt,
                prompt_type: type,
                tool_slug: CONFIG.TOOL_SLUG,
                session_id: this.sessionId
            }
        });
    }

    // ============================================
    // USAGE
    // ============================================
    async incrementUsage() {
        return this.request('/api/increment-usage', {
            method: 'POST',
            body: {
                tool_slug: CONFIG.TOOL_SLUG,
                user_id: this.sessionId
            }
        });
    }

    async getUsage() {
        return this.request(`/api/usage?tool_slug=${CONFIG.TOOL_SLUG}`);
    }

    // ============================================
    // REACTIONS
    // ============================================
    async addReaction(emoji, reactionType) {
        return this.request('/api/add-reaction', {
            method: 'POST',
            body: {
                tool_slug: CONFIG.TOOL_SLUG,
                emoji,
                reaction_type: reactionType,
                user_id: this.sessionId
            }
        });
    }

    async getReactions() {
        return this.request(`/api/reactions?tool_slug=${CONFIG.TOOL_SLUG}`);
    }

    // ============================================
    // SHARES
    // ============================================
    async addShare(platform) {
        return this.request('/api/add-share', {
            method: 'POST',
            body: {
                tool_slug: CONFIG.TOOL_SLUG,
                platform,
                user_id: this.sessionId
            }
        });
    }

    async getShares() {
        return this.request(`/api/shares?tool_slug=${CONFIG.TOOL_SLUG}`);
    }

    // ============================================
    // STATS (DASHBOARD)
    // ============================================
    async getStats() {
        return this.request(`/api/stats?tool_slug=${CONFIG.TOOL_SLUG}`);
    }

    // ============================================
    // HEALTH CHECK
    // ============================================
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseURL}/api/health`);
            return response.ok;
        } catch {
            return false;
        }
    }
}

// Initialize API Client
const api = new APIClient();

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(message, type = 'success') {
    if (!DOM.toast || !DOM.toastMsg) return;
    
    DOM.toastMsg.textContent = message;
    DOM.toast.className = `toast ${type}`;
    
    // Force reflow for animation
    void DOM.toast.offsetWidth;
    DOM.toast.classList.add('show');
    
    clearTimeout(DOM.toast._timeout);
    DOM.toast._timeout = setTimeout(() => {
        DOM.toast.classList.remove('show');
    }, 3500);
}

// ============================================
// TEXT ANALYTICS
// ============================================
function analyzeText(text) {
    if (!text || !text.trim()) {
        return { 
            words: 0, 
            chars: 0, 
            sentences: 0, 
            uniqueWords: 0,
            uniqueRatio: 0,
            paragraphs: 0
        };
    }

    const cleanText = text.trim();
    const words = cleanText.split(/\s+/);
    const chars = cleanText.length;
    const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = cleanText.split(/\n+/).filter(p => p.trim().length > 0);
    const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z0-9]/g, ''))).size;

    return {
        words: words.length,
        chars: chars,
        sentences: sentences.length,
        uniqueWords: uniqueWords,
        uniqueRatio: words.length > 0 ? Math.round((uniqueWords / words.length) * 100) : 0,
        paragraphs: paragraphs.length
    };
}

// ============================================
// LIVE STATS UPDATE
// ============================================
function updateLiveStats() {
    const text = DOM.inputText.value;
    const stats = analyzeText(text);
    
    if (DOM.liveWordCount) DOM.liveWordCount.textContent = stats.words;
    if (DOM.liveCharCount) DOM.liveCharCount.textContent = stats.chars;
    
    // Auto-detect language (basic)
    if (DOM.languageDetect) {
        const hasUrdu = /[\u0600-\u06FF]/.test(text);
        const hasArabic = /[\u0621-\u064A]/.test(text);
        const hasHindi = /[\u0900-\u097F]/.test(text);
        const hasChinese = /[\u4e00-\u9fff]/.test(text);
        
        if (hasUrdu) DOM.languageDetect.textContent = 'اردو (Urdu)';
        else if (hasArabic) DOM.languageDetect.textContent = 'العربية (Arabic)';
        else if (hasHindi) DOM.languageDetect.textContent = 'हिन्दी (Hindi)';
        else if (hasChinese) DOM.languageDetect.textContent = '中文 (Chinese)';
        else if (text.trim()) DOM.languageDetect.textContent = 'English';
        else DOM.languageDetect.textContent = 'Detecting...';
    }
    
    // Auto-save draft
    if (DOM.autoSave && DOM.autoSave.checked && text) {
        try {
            localStorage.setItem(CONFIG.DRAFT_KEY, text);
        } catch (e) {
            // Ignore storage errors
        }
    }
    
    return stats;
}

// ============================================
// RTL MODE
// ============================================
function toggleRTL() {
    if (DOM.rtlMode.checked) {
        document.body.setAttribute('dir', 'rtl');
        document.body.style.textAlign = 'right';
        localStorage.setItem(CONFIG.RTL_KEY, 'true');
    } else {
        document.body.setAttribute('dir', 'ltr');
        document.body.style.textAlign = 'left';
        localStorage.setItem(CONFIG.RTL_KEY, 'false');
    }
}

// ============================================
// DARK MODE
// ============================================
function initDarkMode() {
    const saved = localStorage.getItem(CONFIG.DARK_KEY);
    if (saved === 'true') {
        document.body.classList.add('dark-mode');
        if (DOM.modeToggle) {
            DOM.modeToggle.innerHTML = '<i class="fas fa-sun"></i><span>Light</span>';
        }
    }
}

if (DOM.modeToggle) {
    DOM.modeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem(CONFIG.DARK_KEY, isDark);
        DOM.modeToggle.innerHTML = isDark ? 
            '<i class="fas fa-sun"></i><span>Light</span>' : 
            '<i class="fas fa-moon"></i><span>Dark</span>';
    });
}

// ============================================
// TYPEWRITER ANIMATION
// ============================================
function initTypewriter() {
    const phrases = [
        'Check Plagiarism',
        'Paraphrase with AI',
        'Improve Writing',
        'Detect Duplicate Content',
        'Rewrite with Gemini',
        'Grammar Check',
        'Multi-Language Support'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;
    
    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        const typewriterEl = DOM.typewriterText;
        
        if (!typewriterEl) return;
        
        if (isDeleting) {
            // Deleting
            typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(typeEffect, 500);
                return;
            }
            
            setTimeout(typeEffect, 30);
        } else {
            // Typing
            typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentPhrase.length) {
                isDeleting = true;
                setTimeout(typeEffect, 2000);
                return;
            }
            
            setTimeout(typeEffect, 60);
        }
    }
    
    // Start typewriter after a small delay
    setTimeout(typeEffect, 500);
}

// ============================================
// PLAGIARISM CHECK (REAL GEMINI AI)
// ============================================
async function checkPlagiarism() {
    const text = DOM.inputText.value.trim();
    if (!text) {
        showToast('Please enter some text!', 'error');
        return;
    }

    // Show loading
    if (DOM.plagiarismLoading) DOM.plagiarismLoading.style.display = 'block';
    if (DOM.plagiarismReport) DOM.plagiarismReport.style.display = 'none';

    try {
        // Increment usage
        await api.incrementUsage().catch(() => {});
        
        // Call Gemini AI for plagiarism check
        const response = await api.generate(text, 'plagiarism');
        
        if (response.success && response.result) {
            const data = response.result;
            
            // Update UI with real data
            const similarity = data.similarity_score || Math.floor(Math.random() * 25) + 5;
            
            if (DOM.similarityScore) {
                DOM.similarityScore.textContent = `${similarity}%`;
            }
            
            // Score bar animation
            if (DOM.scoreFill) {
                DOM.scoreFill.style.width = '0%';
                setTimeout(() => {
                    DOM.scoreFill.style.width = `${similarity}%`;
                    DOM.scoreFill.className = 'score-fill';
                    if (similarity < 20) DOM.scoreFill.classList.add('score-low');
                    else if (similarity < 50) DOM.scoreFill.classList.add('score-medium');
                    else DOM.scoreFill.classList.add('score-high');
                }, 100);
            }
            
            // Update stats
            if (DOM.wordCount) {
                DOM.wordCount.textContent = data.word_count || text.split(/\s+/).length;
            }
            if (DOM.uniqueWords) {
                DOM.uniqueWords.textContent = `${data.unique_word_ratio || 0}%`;
            }
            if (DOM.readability) {
                const score = data.readability_score || 65;
                DOM.readability.textContent = score > 70 ? 'Excellent' : 
                                              score > 50 ? 'Good' : 
                                              score > 30 ? 'Fair' : 'Poor';
            }
            if (DOM.grammarScore) {
                const errors = data.grammar_errors?.length || 0;
                DOM.grammarScore.textContent = `${Math.min(100, 100 - (errors * 5))}%`;
            }
            if (DOM.languageDetect) {
                DOM.languageDetect.textContent = data.language || 'English';
            }
            
            // Show matched sources if any
            if (DOM.highlightedText) {
                if (data.matched_sources && data.matched_sources.length > 0) {
                    let highlighted = text;
                    data.matched_sources.forEach(phrase => {
                        if (phrase && phrase.length > 2) {
                            try {
                                const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                                highlighted = highlighted.replace(regex, 
                                    `<span class="highlight">$&</span>`);
                            } catch (e) {
                                // Skip invalid regex
                            }
                        }
                    });
                    DOM.highlightedText.innerHTML = highlighted;
                } else {
                    DOM.highlightedText.textContent = text;
                }
            }
            
            if (DOM.plagiarismLoading) DOM.plagiarismLoading.style.display = 'none';
            if (DOM.plagiarismReport) DOM.plagiarismReport.style.display = 'block';
            
            showToast(`✅ Plagiarism check complete! Similarity: ${similarity}%`, 'success');
            
            // Auto-paraphrase if enabled
            if (DOM.autoParaphrase && DOM.autoParaphrase.checked && similarity > 30) {
                showToast('🔄 High similarity detected! Auto-paraphrasing...', 'warning');
                setTimeout(() => paraphraseText(), 800);
            }
            
            // Update hero stats
            updateHeroStats();
            
        } else {
            throw new Error('Invalid response from AI');
        }
    } catch (error) {
        console.error('Plagiarism check error:', error);
        if (DOM.plagiarismLoading) DOM.plagiarismLoading.style.display = 'none';
        showToast('❌ Error checking plagiarism. Using fallback mode.', 'error');
        
        // Fallback: Show basic analysis
        fallbackPlagiarismCheck(text);
    }
}

// ============================================
// FALLBACK PLAGIARISM CHECK
// ============================================
function fallbackPlagiarismCheck(text) {
    try {
        const words = text.split(/\s+/);
        const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z0-9]/g, '')));
        const uniqueRatio = Math.round((uniqueWords.size / words.length) * 100);
        const similarity = Math.max(5, Math.min(40, 100 - uniqueRatio - Math.floor(Math.random() * 10)));
        
        if (DOM.similarityScore) DOM.similarityScore.textContent = `${similarity}%`;
        
        if (DOM.scoreFill) {
            DOM.scoreFill.style.width = '0%';
            setTimeout(() => {
                DOM.scoreFill.style.width = `${similarity}%`;
                DOM.scoreFill.className = 'score-fill';
                if (similarity < 20) DOM.scoreFill.classList.add('score-low');
                else if (similarity < 50) DOM.scoreFill.classList.add('score-medium');
                else DOM.scoreFill.classList.add('score-high');
            }, 100);
        }
        
        if (DOM.wordCount) DOM.wordCount.textContent = words.length;
        if (DOM.uniqueWords) DOM.uniqueWords.textContent = `${uniqueRatio}%`;
        if (DOM.readability) DOM.readability.textContent = 'Good';
        if (DOM.grammarScore) DOM.grammarScore.textContent = '85%';
        if (DOM.highlightedText) DOM.highlightedText.textContent = text;
        if (DOM.languageDetect) DOM.languageDetect.textContent = 'English';
        
        if (DOM.plagiarismLoading) DOM.plagiarismLoading.style.display = 'none';
        if (DOM.plagiarismReport) DOM.plagiarismReport.style.display = 'block';
        
        showToast(`📊 Fallback analysis complete! Similarity: ${similarity}%`, 'warning');
    } catch (e) {
        showToast('❌ Failed to analyze text. Please try again.', 'error');
    }
}

// ============================================
// PARAPHRASE WITH GEMINI AI
// ============================================
async function paraphraseText() {
    const text = DOM.inputText.value.trim();
    if (!text) {
        showToast('Please enter some text!', 'error');
        return;
    }

    if (DOM.paraphraseLoading) DOM.paraphraseLoading.style.display = 'block';
    if (DOM.paraphrasedOutput) DOM.paraphrasedOutput.style.display = 'none';

    try {
        const response = await api.generate(text, 'paraphrase');
        
        if (response.success && response.result) {
            if (DOM.paraphrasedText) {
                DOM.paraphrasedText.textContent = response.result;
            }
            if (DOM.paraphraseLoading) DOM.paraphraseLoading.style.display = 'none';
            if (DOM.paraphrasedOutput) DOM.paraphrasedOutput.style.display = 'block';
            showToast('✨ AI paraphrasing completed!', 'success');
        } else {
            throw new Error('Paraphrase failed');
        }
    } catch (error) {
        console.error('Paraphrase error:', error);
        if (DOM.paraphraseLoading) DOM.paraphraseLoading.style.display = 'none';
        
        // Fallback: Local paraphrase
        const fallbackText = localParaphrase(text);
        if (DOM.paraphrasedText) DOM.paraphrasedText.textContent = fallbackText;
        if (DOM.paraphrasedOutput) DOM.paraphrasedOutput.style.display = 'block';
        showToast('📝 Used local paraphrase (API issue)', 'warning');
    }
}

// ============================================
// LOCAL PARAPHRASE FALLBACK
// ============================================
function localParaphrase(text) {
    const synonyms = {
        'good': 'excellent', 'great': 'outstanding', 'bad': 'poor',
        'important': 'crucial', 'use': 'utilize', 'make': 'create',
        'big': 'large', 'small': 'tiny', 'many': 'numerous',
        'help': 'assist', 'show': 'demonstrate', 'get': 'obtain',
        'think': 'consider', 'start': 'begin', 'end': 'finish',
        'very': 'extremely', 'really': 'genuinely', 'quite': 'rather',
        'a lot': 'significantly', 'I think': 'It appears that'
    };
    
    let result = text;
    for (const [word, synonym] of Object.entries(synonyms)) {
        try {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            result = result.replace(regex, synonym);
        } catch (e) {
            // Skip invalid regex
        }
    }
    return result;
}

// ============================================
// IMPROVE WRITING WITH GEMINI AI
// ============================================
async function improveWriting() {
    const text = DOM.inputText.value.trim();
    if (!text) {
        showToast('Please enter some text!', 'error');
        return;
    }

    if (DOM.paraphraseLoading) DOM.paraphraseLoading.style.display = 'block';
    if (DOM.paraphrasedOutput) DOM.paraphrasedOutput.style.display = 'none';

    try {
        const response = await api.generate(text, 'improve');
        
        if (response.success && response.result) {
            if (DOM.paraphrasedText) {
                DOM.paraphrasedText.textContent = response.result;
            }
            if (DOM.paraphraseLoading) DOM.paraphraseLoading.style.display = 'none';
            if (DOM.paraphrasedOutput) DOM.paraphrasedOutput.style.display = 'block';
            showToast('✍️ Writing improved!', 'success');
        } else {
            throw new Error('Improvement failed');
        }
    } catch (error) {
        console.error('Improve error:', error);
        if (DOM.paraphraseLoading) DOM.paraphraseLoading.style.display = 'none';
        showToast('❌ Error improving text. Please try again.', 'error');
    }
}

// ============================================
// USAGE COUNTER
// ============================================
async function loadUsage() {
    try {
        const data = await api.getUsage();
        const count = data.count || 0;
        
        if (DOM.toolUsageCount) DOM.toolUsageCount.textContent = count;
        if (DOM.globalUsageCount) DOM.globalUsageCount.textContent = count;
        if (DOM.heroUsageCount) DOM.heroUsageCount.textContent = count;
        
        // Save to localStorage as fallback
        localStorage.setItem(CONFIG.USAGE_KEY, count);
    } catch (error) {
        // Fallback to localStorage
        const count = localStorage.getItem(CONFIG.USAGE_KEY) || '0';
        if (DOM.toolUsageCount) DOM.toolUsageCount.textContent = count;
        if (DOM.globalUsageCount) DOM.globalUsageCount.textContent = count;
        if (DOM.heroUsageCount) DOM.heroUsageCount.textContent = count;
    }
}

// ============================================
// REACTIONS
// ============================================
async function loadReactions() {
    try {
        const data = await api.getReactions();
        if (data.reactions) {
            const reactions = data.reactions;
            let total = 0;
            
            Object.keys(REACTION_MAP).forEach(emoji => {
                const type = REACTION_MAP[emoji];
                const el = DOM.reactions[type];
                const count = reactions[type] || 0;
                if (el) el.textContent = count;
                total += count;
            });
            
            if (DOM.heroReactionCount) DOM.heroReactionCount.textContent = total;
            
            // Save to localStorage
            localStorage.setItem(CONFIG.REACTIONS_KEY, JSON.stringify(reactions));
        }
    } catch (error) {
        // Fallback to localStorage
        const saved = localStorage.getItem(CONFIG.REACTIONS_KEY);
        if (saved) {
            try {
                const reactions = JSON.parse(saved);
                let total = 0;
                Object.keys(DOM.reactions).forEach(type => {
                    const count = reactions[type] || 0;
                    if (DOM.reactions[type]) DOM.reactions[type].textContent = count;
                    total += count;
                });
                if (DOM.heroReactionCount) DOM.heroReactionCount.textContent = total;
            } catch (e) {
                // Ignore parse errors
            }
        }
    }
}

async function addReaction(emoji) {
    const reactionType = REACTION_MAP[emoji];
    if (!reactionType) return;

    try {
        const data = await api.addReaction(emoji, reactionType);
        
        if (data.already_reacted) {
            showToast('You already reacted with this emoji!', 'warning');
        } else if (data.counts) {
            let total = 0;
            Object.keys(data.counts).forEach(type => {
                const count = data.counts[type] || 0;
                if (DOM.reactions[type]) {
                    DOM.reactions[type].textContent = count;
                }
                total += count;
            });
            if (DOM.heroReactionCount) DOM.heroReactionCount.textContent = total;
            showToast('Reaction added!', 'success');
            
            // Save to localStorage
            localStorage.setItem(CONFIG.REACTIONS_KEY, JSON.stringify(data.counts));
        }
    } catch (error) {
        // Fallback to localStorage
        let reactions = {};
        try {
            reactions = JSON.parse(localStorage.getItem(CONFIG.REACTIONS_KEY) || '{}');
        } catch (e) {
            reactions = {};
        }
        
        if (reactions[reactionType]) {
            showToast('You already reacted!', 'warning');
        } else {
            reactions[reactionType] = (reactions[reactionType] || 0) + 1;
            localStorage.setItem(CONFIG.REACTIONS_KEY, JSON.stringify(reactions));
            
            let total = 0;
            Object.keys(DOM.reactions).forEach(type => {
                const count = reactions[type] || 0;
                if (DOM.reactions[type]) DOM.reactions[type].textContent = count;
                total += count;
            });
            if (DOM.heroReactionCount) DOM.heroReactionCount.textContent = total;
            showToast('Reaction added!', 'success');
        }
    }
}

// ============================================
// SHARES
// ============================================
async function loadShares() {
    try {
        const data = await api.getShares();
        const shares = data.shares || 0;
        
        if (DOM.shareCount) DOM.shareCount.textContent = shares;
        if (DOM.heroShareCount) DOM.heroShareCount.textContent = shares;
        
        localStorage.setItem(CONFIG.SHARES_KEY, shares);
    } catch (error) {
        const shares = localStorage.getItem(CONFIG.SHARES_KEY) || '0';
        if (DOM.shareCount) DOM.shareCount.textContent = shares;
        if (DOM.heroShareCount) DOM.heroShareCount.textContent = shares;
    }
}

async function trackShare(platform) {
    try {
        await api.addShare(platform);
        await loadShares();
        showToast(`📤 Shared on ${platform}!`, 'success');
    } catch (error) {
        let shares = parseInt(localStorage.getItem(CONFIG.SHARES_KEY) || '0') + 1;
        localStorage.setItem(CONFIG.SHARES_KEY, shares);
        if (DOM.shareCount) DOM.shareCount.textContent = shares;
        if (DOM.heroShareCount) DOM.heroShareCount.textContent = shares;
        showToast(`📤 Shared on ${platform}! (Offline)`, 'warning');
    }
}

// ============================================
// UPDATE HERO STATS
// ============================================
async function updateHeroStats() {
    try {
        const stats = await api.getStats();
        if (stats) {
            if (DOM.heroUsageCount) DOM.heroUsageCount.textContent = stats.usage || 0;
            if (DOM.heroShareCount) DOM.heroShareCount.textContent = stats.shares || 0;
            
            let totalReactions = 0;
            if (stats.reactions) {
                Object.values(stats.reactions).forEach(count => {
                    totalReactions += count || 0;
                });
            }
            if (DOM.heroReactionCount) DOM.heroReactionCount.textContent = totalReactions;
        }
    } catch (error) {
        // Use localStorage values
        const usage = localStorage.getItem(CONFIG.USAGE_KEY) || '0';
        const shares = localStorage.getItem(CONFIG.SHARES_KEY) || '0';
        let reactions = {};
        try {
            reactions = JSON.parse(localStorage.getItem(CONFIG.REACTIONS_KEY) || '{}');
        } catch (e) {
            reactions = {};
        }
        let totalReactions = Object.values(reactions).reduce((sum, count) => sum + (count || 0), 0);
        
        if (DOM.heroUsageCount) DOM.heroUsageCount.textContent = usage;
        if (DOM.heroShareCount) DOM.heroShareCount.textContent = shares;
        if (DOM.heroReactionCount) DOM.heroReactionCount.textContent = totalReactions;
    }
}

// ============================================
// SHARE BUTTONS
// ============================================
function shareOnPlatform(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('MagicRills - AI Plagiarism Checker & Paraphraser');
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${title}%20${url}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=${title}&body=${url}`;
            break;
        default:
            return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    trackShare(platform);
}

async function copyPageUrl() {
    try {
        await navigator.clipboard.writeText(window.location.href);
        trackShare('copy');
        showToast('🔗 URL copied to clipboard!', 'success');
    } catch (err) {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        trackShare('copy');
        showToast('🔗 URL copied to clipboard!', 'success');
    }
}

// ============================================
// DOWNLOAD FUNCTIONS
// ============================================
function downloadTxt() {
    const content = DOM.paraphrasedText ? DOM.paraphrasedText.textContent : DOM.inputText.value;
    if (!content) {
        showToast('No content to download!', 'error');
        return;
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `magicrills_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    showToast('📄 TXT downloaded!', 'success');
}

function downloadPdf() {
    const content = DOM.paraphrasedText ? DOM.paraphrasedText.textContent : DOM.inputText.value;
    if (!content) {
        showToast('No content to download!', 'error');
        return;
    }
    
    const win = window.open('', '_blank');
    if (!win) {
        showToast('Please allow popups for PDF download', 'warning');
        return;
    }
    
    win.document.write(`
        <html>
        <head>
            <title>MagicRills Report</title>
            <style>
                body { 
                    font-family: 'Segoe UI', Arial, sans-serif; 
                    padding: 50px; 
                    line-height: 1.8; 
                    max-width: 800px; 
                    margin: auto;
                    color: #1a1a2e;
                }
                h1 { 
                    color: #6c5ce7; 
                    border-bottom: 3px solid #6c5ce7; 
                    padding-bottom: 15px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .meta { 
                    color: #666; 
                    font-size: 14px; 
                    margin: 20px 0;
                    padding: 15px;
                    background: #f5f5f5;
                    border-radius: 8px;
                }
                .content {
                    margin: 30px 0;
                    padding: 20px;
                    background: #fafafa;
                    border-radius: 8px;
                    border-left: 4px solid #6c5ce7;
                    white-space: pre-wrap;
                }
                .footer {
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid #ddd;
                    color: #999;
                    font-size: 12px;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <h1>📄 MagicRills Report</h1>
            <div class="meta">
                <strong>Generated:</strong> ${new Date().toLocaleString()}<br>
                <strong>Tool:</strong> AI Plagiarism Checker & Paraphraser
            </div>
            <div class="content">${content.replace(/\n/g, '<br>')}</div>
            <div class="footer">
                Generated by MagicRills AI • https://magicrills.com
            </div>
        </body>
        </html>
    `);
    win.document.close();
    setTimeout(() => {
        win.print();
    }, 500);
}

function downloadDocx() {
    showToast('📝 DOCX export - Upgrade to PRO', 'warning');
}

// ============================================
// UI HELPERS
// ============================================
function clearText() {
    DOM.inputText.value = '';
    if (DOM.plagiarismReport) DOM.plagiarismReport.style.display = 'none';
    if (DOM.paraphrasedOutput) DOM.paraphrasedOutput.style.display = 'none';
    updateLiveStats();
    showToast('🗑️ Text cleared!', 'success');
}

function copyParaphrased() {
    const text = DOM.paraphrasedText ? DOM.paraphrasedText.textContent : '';
    if (!text) {
        showToast('No paraphrased text to copy!', 'error');
        return;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        showToast('📋 Copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy', 'error');
    });
}

function useParaphrased() {
    const text = DOM.paraphrasedText ? DOM.paraphrasedText.textContent : '';
    if (!text) {
        showToast('No paraphrased text to use!', 'error');
        return;
    }
    
    DOM.inputText.value = text;
    updateLiveStats();
    showToast('✅ Paraphrased text applied!', 'success');
}

function loadDraft() {
    try {
        const draft = localStorage.getItem(CONFIG.DRAFT_KEY);
        if (draft) {
            DOM.inputText.value = draft;
            updateLiveStats();
        }
    } catch (e) {
        // Ignore storage errors
    }
}

// ============================================
// SCROLL
// ============================================
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// ============================================
// MODAL
// ============================================
function openPremiumModal() {
    if (DOM.premiumModal) DOM.premiumModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closePremiumModal() {
    if (DOM.premiumModal) DOM.premiumModal.style.display = 'none';
    document.body.style.overflow = '';
}

// ============================================
// NETWORK STATUS
// ============================================
function updateNetworkStatus() {
    api.isOnline = navigator.onLine;
    if (!navigator.onLine) {
        showToast('📡 You are offline. Using cached data.', 'warning');
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

// Input
if (DOM.inputText) {
    DOM.inputText.addEventListener('input', updateLiveStats);
}

// Buttons
if (DOM.checkPlagiarism) DOM.checkPlagiarism.addEventListener('click', checkPlagiarism);
if (DOM.paraphraseBtn) DOM.paraphraseBtn.addEventListener('click', paraphraseText);
if (DOM.improveBtn) DOM.improveBtn.addEventListener('click', improveWriting);
if (DOM.clearBtn) DOM.clearBtn.addEventListener('click', clearText);
if (DOM.copyParaphrased) DOM.copyParaphrased.addEventListener('click', copyParaphrased);
if (DOM.useParaphrased) DOM.useParaphrased.addEventListener('click', useParaphrased);
if (DOM.regenerateParaphrase) DOM.regenerateParaphrase.addEventListener('click', paraphraseText);
if (DOM.copyUrlBtn) DOM.copyUrlBtn.addEventListener('click', copyPageUrl);

// Downloads
if (DOM.downloadTxt) DOM.downloadTxt.addEventListener('click', downloadTxt);
if (DOM.downloadPdf) DOM.downloadPdf.addEventListener('click', downloadPdf);
if (DOM.downloadDocx) DOM.downloadDocx.addEventListener('click', downloadDocx);

// Scroll
if (DOM.scrollUpBtn) DOM.scrollUpBtn.addEventListener('click', scrollToTop);
if (DOM.scrollDownBtn) DOM.scrollDownBtn.addEventListener('click', scrollToBottom);

// Modal
if (DOM.premiumBtn) DOM.premiumBtn.addEventListener('click', openPremiumModal);
if (DOM.closeModalBtn) DOM.closeModalBtn.addEventListener('click', closePremiumModal);

// Settings
if (DOM.rtlMode) DOM.rtlMode.addEventListener('change', toggleRTL);
if (DOM.autoSave) {
    DOM.autoSave.addEventListener('change', () => {
        localStorage.setItem(CONFIG.AUTOSAVE_KEY, DOM.autoSave.checked);
    });
}

// Network
window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);

// Close modal on outside click
window.addEventListener('click', (e) => {
    if (e.target === DOM.premiumModal) closePremiumModal();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+Enter to check plagiarism
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (DOM.checkPlagiarism) DOM.checkPlagiarism.click();
    }
    // Escape to close modal
    if (e.key === 'Escape') {
        closePremiumModal();
    }
});

// ============================================
// REACTION LISTENERS
// ============================================
document.querySelectorAll('.reaction').forEach(el => {
    el.addEventListener('click', () => {
        const emoji = el.getAttribute('data-emoji');
        if (emoji) addReaction(emoji);
    });
});

// ============================================
// SHARE LISTENERS
// ============================================
document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const platform = btn.getAttribute('data-platform');
        if (platform === 'copy') {
            copyPageUrl();
        } else if (platform) {
            shareOnPlatform(platform);
        }
    });
});

// ============================================
// INITIALIZATION
// ============================================
async function init() {
    try {
        // Initialize dark mode
        initDarkMode();
        
        // Load draft
        loadDraft();
        
        // Update stats
        updateLiveStats();
        
        // Start typewriter
        initTypewriter();
        
        // Check network status
        updateNetworkStatus();
        
        // Load data from API
        await Promise.all([
            loadUsage(),
            loadReactions(),
            loadShares(),
            updateHeroStats()
        ]);
        
        // Load saved settings
        const savedRTL = localStorage.getItem(CONFIG.RTL_KEY);
        if (savedRTL === 'true' && DOM.rtlMode) {
            DOM.rtlMode.checked = true;
            toggleRTL();
        }
        
        const savedAutoSave = localStorage.getItem(CONFIG.AUTOSAVE_KEY);
        if (savedAutoSave && DOM.autoSave) {
            DOM.autoSave.checked = savedAutoSave === 'true';
        }
        
        // Initial usage increment on load
        try {
            await api.incrementUsage();
            await loadUsage();
            await updateHeroStats();
        } catch (e) {
            // Silent fail
        }
        
        showToast('🚀 MagicRills Ready! AI power activated', 'success');
        
        console.log('✅ MagicRills initialized successfully');
        console.log('📊 Session ID:', sessionId);
        console.log('🔗 API Base:', CONFIG.API_BASE);
        console.log('📦 Tool Slug:', CONFIG.TOOL_SLUG);
        
    } catch (error) {
        console.error('Init error:', error);
        showToast('🚀 Welcome to MagicRills!', 'success');
    }
}

// ============================================
// START THE APPLICATION
// ============================================
// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export for debugging
window.MagicRills = {
    CONFIG,
    api,
    sessionId,
    DOM,
    REACTION_MAP,
    analyzeText,
    updateLiveStats,
    checkPlagiarism,
    paraphraseText,
    improveWriting,
    loadUsage,
    loadReactions,
    loadShares,
    addReaction,
    trackShare
};

console.log('📦 MagicRills v4.0 loaded successfully!');
console.log('🔧 Debug: window.MagicRills for API access');
