/* ============================================
   AUTO TRANSLATION TOOL - COMPLETE JAVASCRIPT
   35 Features with TiDB Integration & Groq AI
   ============================================ */

// ============================================
// Configuration
// ============================================
const TOOL_SLUG = 'auto-translation-tool';
const TOOL_NAME = 'Auto Translation Tool';
const CATEGORY = 'student';
const WORKER_URL = 'https://auto-translation-tool.uzairhameed01.workers.dev';
const API_BASE = '/api';

let userId = localStorage.getItem('userId');
if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
}

// Translation History
let translationHistory = [];
let favorites = [];
let currentTranslation = '';
let currentSourceText = '';

// Language names for display
const languageNames = {
    auto: 'Auto Detect',
    en: 'English',
    ur: 'Urdu',
    hi: 'Hindi',
    ar: 'Arabic',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    tr: 'Turkish',
    fa: 'Persian',
    zh: 'Chinese',
    ru: 'Russian',
    bn: 'Bengali'
};

// Pronunciation mapping for common languages
const pronunciationMap = {
    ur: 'ur-PK',
    en: 'en-US',
    hi: 'hi-IN',
    ar: 'ar-SA',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    tr: 'tr-TR',
    fa: 'fa-IR',
    zh: 'zh-CN',
    ru: 'ru-RU',
    bn: 'bn-BD'
};

// ============================================
// DOM Elements
// ============================================
const usageCountSpan = document.getElementById('usageCount');
const translationCountSpan = document.getElementById('translationCount');
const sourceText = document.getElementById('sourceText');
const targetText = document.getElementById('targetText');
const fromLang = document.getElementById('fromLang');
const toLang = document.getElementById('toLang');
const charCounter = document.getElementById('charCounter');
const translateBtn = document.getElementById('translateBtn');
const translateLoader = document.getElementById('translateLoader');
const copyBtn = document.getElementById('copyBtn');
const speakSourceBtn = document.getElementById('speakSourceBtn');
const speakTargetBtn = document.getElementById('speakTargetBtn');
const clearInputBtn = document.getElementById('clearInputBtn');
const micBtn = document.getElementById('micBtn');
const swapBtn = document.getElementById('swapBtn');
const downloadTxtBtn = document.getElementById('downloadTxtBtn');
const favoriteBtn = document.getElementById('favoriteBtn');
const pronunciationBox = document.getElementById('pronunciationBox');
const pronunciationText = document.getElementById('pronunciationText');
const transliterationText = document.getElementById('transliterationText');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const clearFavoritesBtn = document.getElementById('clearFavoritesBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const pronunciationToggle = document.getElementById('pronunciationToggle');
const transliterationToggle = document.getElementById('transliterationToggle');
const exportDataBtn = document.getElementById('exportDataBtn');
const importDataBtn = document.getElementById('importDataBtn');
const importFile = document.getElementById('importFile');
const pageShareBtn = document.getElementById('pageShareBtn');
const scrollUpBtn = document.getElementById('scrollUpBtn');
const scrollDownBtn = document.getElementById('scrollDownBtn');
const detectedLangDiv = document.getElementById('detectedLang');
const detectedLangName = document.getElementById('detectedLangName');

// ============================================
// TiDB API Calls
// ============================================
async function trackUsage() {
    try {
        await fetch(`${API_BASE}/usage/increment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: TOOL_SLUG, tool_name: TOOL_NAME, category: CATEGORY, user_id: userId })
        });
        usageCountSpan.textContent = (parseInt(usageCountSpan.textContent) || 0) + 1;
    } catch(e) { console.error(e); }
}

async function addReaction(emoji) {
    try {
        const response = await fetch(`${API_BASE}/reactions/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: TOOL_SLUG, emoji: emoji, user_id: userId })
        });
        const data = await response.json();
        const span = document.getElementById(`${emoji}Count`);
        if (span) span.textContent = data.count;
        showToast(getEmojiName(emoji) + ' reaction!');
    } catch(e) { console.error(e); }
}

async function trackShare(platform) {
    try {
        await fetch(`${API_BASE}/shares/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: TOOL_SLUG, platform: platform, share_type: 'tool', user_id: userId })
        });
    } catch(e) { console.error(e); }
}

async function loadStats() {
    try {
        const response = await fetch(`${API_BASE}/tools/stats?tool_slug=${TOOL_SLUG}`);
        const data = await response.json();
        usageCountSpan.textContent = data.total_usage || 0;
        const emojis = ['like', 'love', 'wow', 'sad', 'angry', 'laugh', 'celebrate'];
        emojis.forEach(e => {
            const span = document.getElementById(`${e}Count`);
            if (span) span.textContent = data[`${e}_count`] || 0;
        });
    } catch(e) { console.error(e); }
}

// ============================================
// Translation Functions
// ============================================
async function translateText() {
    const text = sourceText.value.trim();
    if (!text) {
        showToast('Please enter text to translate', 'error');
        return;
    }
    
    const from = fromLang.value;
    const to = toLang.value;
    
    translateLoader.style.display = 'inline-block';
    translateBtn.disabled = true;
    targetText.innerHTML = '<span style="opacity:0.7;">Translating...</span>';
    
    try {
        // Use Google Translate API (free, reliable)
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url);
        const data = await response.json();
        const translated = data[0].map(item => item[0]).join('');
        
        currentTranslation = translated;
        currentSourceText = text;
        targetText.innerHTML = translated;
        
        // Track usage
        await trackUsage();
        
        // Save to history
        saveToHistory(text, translated, from, to);
        
        // Show pronunciation if available
        if (pronunciationToggle.classList.contains('active')) {
            showPronunciation(to, translated);
        }
        
        showToast('Translation completed!');
        
    } catch (error) {
        console.error('Translation error:', error);
        targetText.innerHTML = '<span style="color:var(--danger);">Translation failed. Please try again.</span>';
        showToast('Translation failed', 'error');
    } finally {
        translateLoader.style.display = 'none';
        translateBtn.disabled = false;
    }
}

// ============================================
// Auto Language Detection
// ============================================
async function detectLanguage(text) {
    if (fromLang.value !== 'auto') return;
    if (!text || text.length < 3) return;
    
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text.substring(0, 100))}`;
        const response = await fetch(url);
        const data = await response.json();
        const detected = data[2];
        
        if (detected && detected[0] && detected[0][0]) {
            const langCode = detected[0][0];
            const langName = languageNames[langCode] || langCode;
            detectedLangName.textContent = langName;
            detectedLangDiv.style.display = 'block';
        }
    } catch(e) { console.error('Language detection failed:', e); }
}

// ============================================
// Pronunciation & Transliteration
// ============================================
function showPronunciation(langCode, text) {
    if (!pronunciationToggle.classList.contains('active')) return;
    
    pronunciationBox.style.display = 'block';
    
    // Get the voice locale
    const voiceLocale = pronunciationMap[langCode] || 'en-US';
    
    // Simple pronunciation guide (text-to-speech friendly)
    pronunciationText.innerHTML = `<i class="fas fa-play-circle"></i> <span onclick="speakText('${text.replace(/'/g, "\\'")}', '${voiceLocale}')" style="cursor:pointer;color:var(--primary);">Click to listen</span>`;
    
    // Transliteration (for Urdu, Hindi, Arabic)
    if (transliterationToggle.classList.contains('active') && (langCode === 'ur' || langCode === 'hi' || langCode === 'ar')) {
        showTransliteration(text, langCode);
    } else if (transliterationToggle.classList.contains('active')) {
        transliterationText.innerHTML = text;
    }
}

function showTransliteration(text, langCode) {
    // Simple transliteration for demonstration
    // In production, you would use a proper transliteration API
    let transliterated = text;
    
    if (langCode === 'ur') {
        transliterated = text.replace(/[^\x00-\x7F]/g, (match) => {
            const map = { 'ا': 'a', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ٹ': 't', 'ث': 's', 'ج': 'j', 'چ': 'ch', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ڈ': 'd', 'ذ': 'z', 'ر': 'r', 'ڑ': 'r', 'ز': 'z', 'ژ': 'zh', 'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'z', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ک': 'k', 'گ': 'g', 'ل': 'l', 'م': 'm', 'ن': 'n', 'و': 'o', 'ہ': 'h', 'ء': '', 'ی': 'y', 'ے': 'e' };
            return map[match] || match;
        });
    }
    
    transliterationText.innerHTML = transliterated;
}

function speakText(text, locale = 'en-US') {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = locale;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    } else {
        showToast('Text-to-speech not supported', 'error');
    }
}

// ============================================
// Voice Input (Microphone)
// ============================================
function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showToast('Voice input not supported in this browser', 'error');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = fromLang.value === 'ur' ? 'ur-PK' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => {
        micBtn.style.color = 'var(--danger)';
        showToast('Listening... Speak now');
    };
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        sourceText.value = transcript;
        updateCharCount();
        showToast('Voice input captured!');
        micBtn.style.color = '';
    };
    
    recognition.onerror = (event) => {
        showToast('Voice input error: ' + event.error, 'error');
        micBtn.style.color = '';
    };
    
    recognition.onend = () => {
        micBtn.style.color = '';
    };
    
    recognition.start();
}

// ============================================
// History & Favorites Functions
// ============================================
function saveToHistory(original, translated, from, to) {
    const history = JSON.parse(localStorage.getItem('translationHistory') || '[]');
    history.unshift({
        id: Date.now(),
        original: original.substring(0, 200),
        translated: translated.substring(0, 200),
        fullOriginal: original,
        fullTranslated: translated,
        from: from,
        to: to,
        date: new Date().toISOString()
    });
    if (history.length > 50) history.pop();
    localStorage.setItem('translationHistory', JSON.stringify(history));
    loadHistory();
    updateTranslationCount();
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem('translationHistory') || '[]');
    const container = document.getElementById('historyList');
    
    if (!container) return;
    
    if (history.length === 0) {
        container.innerHTML = '<div class="empty-state">No translations yet. Start translating!</div>';
        return;
    }
    
    container.innerHTML = history.map(item => `
        <div class="history-item" data-id="${item.id}">
            <div class="history-item-title">${escapeHtml(item.original)}</div>
            <div class="history-item-date">${languageNames[item.from] || item.from} → ${languageNames[item.to] || item.to} | ${new Date(item.date).toLocaleString()}</div>
            <div class="history-preview">${escapeHtml(item.translated)}</div>
        </div>
    `).join('');
    
    document.querySelectorAll('.history-item').forEach(el => {
        el.addEventListener('click', () => {
            const id = parseInt(el.dataset.id);
            const found = history.find(h => h.id === id);
            if (found) {
                sourceText.value = found.fullOriginal;
                targetText.innerHTML = found.fullTranslated;
                currentTranslation = found.fullTranslated;
                currentSourceText = found.fullOriginal;
                updateCharCount();
                showToast('Loaded from history!');
                document.querySelector('.smart-tab[data-tab="translate"]').click();
            }
        });
    });
}

function loadFavorites() {
    const favoritesList = JSON.parse(localStorage.getItem('translationFavorites') || '[]');
    const container = document.getElementById('favoritesList');
    
    if (!container) return;
    
    if (favoritesList.length === 0) {
        container.innerHTML = '<div class="empty-state">No favorites yet. Save translations you love!</div>';
        return;
    }
    
    container.innerHTML = favoritesList.map(item => `
        <div class="history-item" data-id="${item.id}">
            <div class="history-item-title">${escapeHtml(item.original)}</div>
            <div class="history-item-date">${languageNames[item.from] || item.from} → ${languageNames[item.to] || item.to}</div>
            <div class="history-preview">${escapeHtml(item.translated)}</div>
            <button class="remove-favorite" data-id="${item.id}" style="position:absolute;right:15px;top:15px;background:none;border:none;color:var(--danger);cursor:pointer;">×</button>
        </div>
    `).join('');
    
    document.querySelectorAll('.history-item').forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-favorite')) return;
            const id = parseInt(el.dataset.id);
            const found = favoritesList.find(f => f.id === id);
            if (found) {
                sourceText.value = found.fullOriginal;
                targetText.innerHTML = found.fullTranslated;
                updateCharCount();
                showToast('Loaded from favorites!');
                document.querySelector('.smart-tab[data-tab="translate"]').click();
            }
        });
    });
    
    document.querySelectorAll('.remove-favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            let favs = JSON.parse(localStorage.getItem('translationFavorites') || '[]');
            favs = favs.filter(f => f.id !== id);
            localStorage.setItem('translationFavorites', JSON.stringify(favs));
            loadFavorites();
            showToast('Removed from favorites');
        });
    });
}

function saveToFavorites() {
    if (!currentTranslation || !currentSourceText) {
        showToast('No translation to save', 'error');
        return;
    }
    
    const favoritesList = JSON.parse(localStorage.getItem('translationFavorites') || '[]');
    const exists = favoritesList.some(f => f.fullOriginal === currentSourceText && f.fullTranslated === currentTranslation);
    
    if (exists) {
        showToast('Already in favorites', 'warning');
        return;
    }
    
    favoritesList.unshift({
        id: Date.now(),
        original: currentSourceText.substring(0, 100),
        translated: currentTranslation.substring(0, 100),
        fullOriginal: currentSourceText,
        fullTranslated: currentTranslation,
        from: fromLang.value,
        to: toLang.value,
        date: new Date().toISOString()
    });
    
    localStorage.setItem('translationFavorites', JSON.stringify(favoritesList));
    loadFavorites();
    showToast('Saved to favorites!');
}

function clearHistory() {
    if (confirm('Delete all translation history?')) {
        localStorage.removeItem('translationHistory');
        loadHistory();
        updateTranslationCount();
        showToast('History cleared!');
    }
}

function clearFavorites() {
    if (confirm('Delete all favorites?')) {
        localStorage.removeItem('translationFavorites');
        loadFavorites();
        showToast('Favorites cleared!');
    }
}

function updateTranslationCount() {
    const history = JSON.parse(localStorage.getItem('translationHistory') || '[]');
    translationCountSpan.textContent = history.length;
}

// ============================================
// Helper Functions
// ============================================
function updateCharCount() {
    const count = sourceText.value.length;
    charCounter.textContent = count + ' characters';
    
    // Auto-detect language
    if (fromLang.value === 'auto' && count > 5) {
        detectLanguage(sourceText.value);
    } else {
        detectedLangDiv.style.display = 'none';
    }
}

function copyToClipboard() {
    if (!currentTranslation) {
        showToast('Nothing to copy', 'error');
        return;
    }
    navigator.clipboard.writeText(currentTranslation);
    showToast('Copied to clipboard!');
}

function swapLanguages() {
    const fromVal = fromLang.value;
    const toVal = toLang.value;
    fromLang.value = toVal;
    toLang.value = fromVal;
    
    // Also swap the text
    const sourceVal = sourceText.value;
    const targetVal = targetText.innerHTML;
    if (sourceVal && targetVal && targetVal !== 'Translation will appear here...') {
        sourceText.value = targetVal;
        targetText.innerHTML = sourceVal;
        currentSourceText = targetVal;
        currentTranslation = sourceVal;
        updateCharCount();
    }
    
    showToast('Languages swapped!');
}

function downloadAsTXT() {
    if (!currentTranslation) {
        showToast('No translation to download', 'error');
        return;
    }
    const content = `Original (${languageNames[fromLang.value]}):\n${currentSourceText}\n\nTranslation (${languageNames[toLang.value]}):\n${currentTranslation}\n\nDate: ${new Date().toLocaleString()}\nTool: Auto Translation Tool`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translation-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded as TXT!');
}

function speakSource() {
    const text = sourceText.value;
    if (!text) {
        showToast('No text to speak', 'error');
        return;
    }
    const locale = pronunciationMap[fromLang.value] || 'en-US';
    speakText(text, locale);
}

function speakTarget() {
    if (!currentTranslation) {
        showToast('No translation to speak', 'error');
        return;
    }
    const locale = pronunciationMap[toLang.value] || 'en-US';
    speakText(currentTranslation, locale);
}

function clearInput() {
    sourceText.value = '';
    targetText.innerHTML = 'Translation will appear here...';
    currentTranslation = '';
    currentSourceText = '';
    updateCharCount();
    detectedLangDiv.style.display = 'none';
    pronunciationBox.style.display = 'none';
    showToast('Cleared!');
}

function exportData() {
    const data = {
        history: localStorage.getItem('translationHistory'),
        favorites: localStorage.getItem('translationFavorites'),
        settings: {
            darkMode: localStorage.getItem('darkMode'),
            pronunciation: localStorage.getItem('pronunciationEnabled'),
            transliteration: localStorage.getItem('transliterationEnabled')
        }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translation-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported!');
}

function importData() {
    importFile.click();
}

if (importFile) {
    importFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                if (data.history) localStorage.setItem('translationHistory', data.history);
                if (data.favorites) localStorage.setItem('translationFavorites', data.favorites);
                if (data.settings?.darkMode === 'true') toggleDarkMode();
                loadHistory();
                loadFavorites();
                updateTranslationCount();
                showToast('Data imported!');
            } catch(err) { showToast('Invalid file', 'error'); }
        };
        reader.readAsText(file);
        importFile.value = '';
    });
}

function sharePage() {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link copied!');
}

function shareTool(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Auto Translation Tool');
    let shareUrl = '';
    if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    else if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
    else if (platform === 'linkedin') shareUrl = `https://www.linkedin.com/sharing/share-offsite/?u=${url}`;
    else if (platform === 'whatsapp') shareUrl = `https://wa.me/?text=${title}%20${url}`;
    else if (platform === 'email') shareUrl = `mailto:?subject=${title}&body=${url}`;
    if (shareUrl) { window.open(shareUrl); trackShare(platform); showToast(`Shared on ${platform}!`); }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    if (darkModeToggle) {
        darkModeToggle.textContent = isDark ? 'On' : 'Off';
        darkModeToggle.classList.toggle('active', isDark);
    }
    showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled');
}

function togglePronunciation() {
    pronunciationToggle.classList.toggle('active');
    const isOn = pronunciationToggle.classList.contains('active');
    localStorage.setItem('pronunciationEnabled', isOn);
    if (!isOn) pronunciationBox.style.display = 'none';
    else if (currentTranslation) showPronunciation(toLang.value, currentTranslation);
    showToast(isOn ? 'Pronunciation on' : 'Pronunciation off');
}

function toggleTransliteration() {
    transliterationToggle.classList.toggle('active');
    const isOn = transliterationToggle.classList.contains('active');
    localStorage.setItem('transliterationEnabled', isOn);
    if (!isOn && pronunciationBox) {
        const transItem = pronunciationBox.querySelector('.pronunciation-item:last-child');
        if (transItem) transItem.style.display = 'none';
    } else if (isOn && currentTranslation) {
        showTransliteration(currentTranslation, toLang.value);
    }
    showToast(isOn ? 'Transliteration on' : 'Transliteration off');
}

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
function scrollToBottom() { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }

function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.classList.remove('hidden');
    toast.style.background = type === 'error' ? '#ef4444' : '#333';
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

function getEmojiName(emoji) {
    const names = { like: '👍 Like', love: '❤️ Love', wow: '😮 Wow', sad: '😢 Sad', angry: '😠 Angry', laugh: '😂 Laugh', celebrate: '🎉 Celebrate' };
    return names[emoji] || emoji;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// Tabs
// ============================================
function initTabs() {
    document.querySelectorAll('.smart-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            document.querySelectorAll('.smart-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const activePanel = document.getElementById(`${tabId}-tab`);
            if (activePanel) activePanel.classList.add('active');
            
            if (tabId === 'history') loadHistory();
            if (tabId === 'favorites') loadFavorites();
        });
    });
}

// ============================================
// Event Listeners
// ============================================
function initEventListeners() {
    translateBtn.addEventListener('click', translateText);
    copyBtn.addEventListener('click', copyToClipboard);
    speakSourceBtn.addEventListener('click', speakSource);
    speakTargetBtn.addEventListener('click', speakTarget);
    clearInputBtn.addEventListener('click', clearInput);
    micBtn.addEventListener('click', startVoiceInput);
    swapBtn.addEventListener('click', swapLanguages);
    downloadTxtBtn.addEventListener('click', downloadAsTXT);
    favoriteBtn.addEventListener('click', saveToFavorites);
    clearHistoryBtn.addEventListener('click', clearHistory);
    clearFavoritesBtn.addEventListener('click', clearFavorites);
    darkModeToggle.addEventListener('click', toggleDarkMode);
    pronunciationToggle.addEventListener('click', togglePronunciation);
    transliterationToggle.addEventListener('click', toggleTransliteration);
    exportDataBtn.addEventListener('click', exportData);
    importDataBtn.addEventListener('click', importData);
    pageShareBtn.addEventListener('click', sharePage);
    scrollUpBtn.addEventListener('click', scrollToTop);
    scrollDownBtn.addEventListener('click', scrollToBottom);
    
    sourceText.addEventListener('input', updateCharCount);
    
    // Reactions
    document.querySelectorAll('.reaction').forEach(btn => {
        btn.addEventListener('click', () => {
            const emoji = btn.dataset.emoji;
            if (emoji) addReaction(emoji);
        });
    });
    
    // Social share buttons
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.dataset.platform;
            if (platform) shareTool(platform);
        });
    });
    
    // Scroll button visibility
    window.addEventListener('scroll', () => {
        if (scrollUpBtn) scrollUpBtn.classList.toggle('hidden', window.scrollY <= 200);
    });
}

// ============================================
// Initialize
// ============================================
function init() {
    initTabs();
    initEventListeners();
    loadStats();
    loadHistory();
    loadFavorites();
    updateTranslationCount();
    
    const savedDark = localStorage.getItem('darkMode');
    if (savedDark === 'true') {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.textContent = 'On';
            darkModeToggle.classList.add('active');
        }
    }
    
    const savedPron = localStorage.getItem('pronunciationEnabled');
    if (savedPron === 'false') {
        pronunciationToggle.classList.remove('active');
    }
    
    const savedTrans = localStorage.getItem('transliterationEnabled');
    if (savedTrans === 'false') {
        transliterationToggle.classList.remove('active');
    }
    
    targetText.innerHTML = 'Translation will appear here...';
    showToast('Translation Tool ready!');
}

init();
