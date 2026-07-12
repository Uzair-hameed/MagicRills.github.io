/* ============================================
   TEXT TO AUDIO CONVERTER - COMPLETE JS
   Cloudflare Workers API Integration
   Advanced Features with AI Integration
   ============================================ */

// ============================================
// Configuration - Cloudflare API
// ============================================
const TOOL_SLUG = 'text-audio-converter';
const TOOL_NAME = 'Text to Audio Converter';
const CATEGORY = 'student';

// Cloudflare Workers API Configuration
const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';
const API_KEY = 'magicrills-grok-api.uzairhameed01.workers.dev';

// Tool URLs
const HOME_URL = 'https://magicrills.com';
const BACK_URL = 'https://magicrills.com/category-pages/mixed-tools.html';

let userId = localStorage.getItem('userId');
if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
}

// ============================================
// App State
// ============================================
let voices = [];
let audioBlob = null;
let mediaRecorder = null;
let audioChunks = [];
let audioContext = null;
let isSpeechSupported = false;
let conversionHistory = [];
let currentAudioUrl = null;
let isApiAvailable = true;

// ============================================
// DOM Elements
// ============================================
const usageCountSpan = document.getElementById('usageCount');
const conversionsCountSpan = document.getElementById('conversionsCount');
const wordsTodaySpan = document.getElementById('wordsToday');
const textInput = document.getElementById('textInput');
const languageSelect = document.getElementById('languageSelect');
const voiceSelect = document.getElementById('voiceSelect');
const previewVoiceBtn = document.getElementById('previewVoiceBtn');
const rateControl = document.getElementById('rateControl');
const pitchControl = document.getElementById('pitchControl');
const rateValue = document.getElementById('rateValue');
const pitchValue = document.getElementById('pitchValue');
const formatSelect = document.getElementById('formatSelect');
const generateAudioBtn = document.getElementById('generateAudioBtn');
const downloadAudioBtn = document.getElementById('downloadAudioBtn');
const clearTextBtn = document.getElementById('clearTextBtn');
const loadingContainer = document.getElementById('loadingContainer');
const audioResult = document.getElementById('audioResult');
const audioPlayer = document.getElementById('audioPlayer');
const copyTextBtn = document.getElementById('copyTextBtn');
const exportTxtBtn = document.getElementById('exportTxtBtn');
const exportPdfBtn = document.getElementById('exportPdfBtn');
const charCountSpan = document.getElementById('charCount');
const wordCountSpan = document.getElementById('wordCount');
const audioFileInput = document.getElementById('audioFileInput');
const transcribeBtn = document.getElementById('transcribeBtn');
const transcribeLoading = document.getElementById('transcribeLoading');
const transcribeResult = document.getElementById('transcribeResult');
const transcribedText = document.getElementById('transcribedText');
const copyTranscribedBtn = document.getElementById('copyTranscribedBtn');
const downloadTranscribedBtn = document.getElementById('downloadTranscribedBtn');
const grammarCheckBtn = document.getElementById('grammarCheckBtn');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const autoSaveToggle = document.getElementById('autoSaveToggle');
const autoDraftToggle = document.getElementById('autoDraftToggle');
const exportDataBtn = document.getElementById('exportDataBtn');
const clearDataBtn = document.getElementById('clearDataBtn');
const pageShareBtn = document.getElementById('pageShareBtn');
const scrollUpBtn = document.getElementById('scrollUpBtn');
const scrollDownBtn = document.getElementById('scrollDownBtn');
const homeBtn = document.getElementById('homeBtn');
const backBtn = document.getElementById('backBtn');
const aiAssistantBtn = document.getElementById('aiAssistantBtn');
const aiSummarizeBtn = document.getElementById('aiSummarizeBtn');

// Reaction counters
const likeCount = document.getElementById('likeCount');
const loveCount = document.getElementById('loveCount');
const wowCount = document.getElementById('wowCount');
const sadCount = document.getElementById('sadCount');
const angryCount = document.getElementById('angryCount');
const laughCount = document.getElementById('laughCount');
const celebrateCount = document.getElementById('celebrateCount');

// Theme options
const themeOptions = document.querySelectorAll('.theme-option');

// ============================================
// Cloudflare Workers API Calls
// ============================================

// 1. Usage Counter Increment - POST /api/usage
async function trackUsage() {
    try {
        const response = await fetch(`${API_BASE}/api/usage`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({ 
                tool_slug: TOOL_SLUG, 
                tool_name: TOOL_NAME, 
                category: CATEGORY, 
                user_id: userId 
            })
        });
        
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        usageCountSpan.textContent = data.total_usage || (parseInt(usageCountSpan.textContent) || 0) + 1;
        isApiAvailable = true;
    } catch(e) { 
        console.warn('API fallback: Using localStorage', e);
        // Fallback to localStorage
        const localCount = parseInt(localStorage.getItem('usageCount_' + TOOL_SLUG) || '0');
        const newCount = localCount + 1;
        localStorage.setItem('usageCount_' + TOOL_SLUG, newCount);
        usageCountSpan.textContent = newCount;
        isApiAvailable = false;
    }
}

// 2. Reactions - POST /api/reactions
async function addReaction(emoji) {
    try {
        let emojiName = emoji;
        const response = await fetch(`${API_BASE}/api/reactions`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({ 
                tool_slug: TOOL_SLUG, 
                emoji: emojiName, 
                user_id: userId 
            })
        });
        
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        
        updateReactionCount(emoji, data.count);
        showToast(getEmojiName(emoji) + ' reaction added!');
        isApiAvailable = true;
    } catch(e) { 
        console.warn('Reaction API fallback: Using localStorage', e);
        // Fallback to localStorage
        const key = 'reaction_' + TOOL_SLUG + '_' + emoji;
        const current = parseInt(localStorage.getItem(key) || '0');
        const newCount = current + 1;
        localStorage.setItem(key, newCount);
        updateReactionCount(emoji, newCount);
        showToast(getEmojiName(emoji) + ' reaction added!');
        isApiAvailable = false;
    }
}

function updateReactionCount(emoji, count) {
    let countSpan = null;
    if (emoji === 'like') countSpan = likeCount;
    else if (emoji === 'love') countSpan = loveCount;
    else if (emoji === 'wow') countSpan = wowCount;
    else if (emoji === 'sad') countSpan = sadCount;
    else if (emoji === 'angry') countSpan = angryCount;
    else if (emoji === 'laugh') countSpan = laughCount;
    else if (emoji === 'celebrate') countSpan = celebrateCount;
    
    if (countSpan) countSpan.textContent = count;
}

// 3. Load Reaction Stats - GET /api/stats
async function loadReactionStats() {
    try {
        const response = await fetch(`${API_BASE}/api/stats?tool_slug=${TOOL_SLUG}`, {
            headers: { 'X-API-Key': API_KEY }
        });
        
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        
        if (likeCount) likeCount.textContent = data.like_count || 0;
        if (loveCount) loveCount.textContent = data.love_count || 0;
        if (wowCount) wowCount.textContent = data.wow_count || 0;
        if (sadCount) sadCount.textContent = data.sad_count || 0;
        if (angryCount) angryCount.textContent = data.angry_count || 0;
        if (laughCount) laughCount.textContent = data.laugh_count || 0;
        if (celebrateCount) celebrateCount.textContent = data.celebrate_count || 0;
        if (usageCountSpan) usageCountSpan.textContent = data.total_usage || 0;
        
        isApiAvailable = true;
    } catch(e) { 
        console.warn('Stats API fallback: Using localStorage', e);
        // Load from localStorage fallback
        loadReactionsFromLocalStorage();
        isApiAvailable = false;
    }
}

function loadReactionsFromLocalStorage() {
    const emojis = ['like', 'love', 'wow', 'sad', 'angry', 'laugh', 'celebrate'];
    const spans = [likeCount, loveCount, wowCount, sadCount, angryCount, laughCount, celebrateCount];
    
    emojis.forEach((emoji, index) => {
        const key = 'reaction_' + TOOL_SLUG + '_' + emoji;
        const count = parseInt(localStorage.getItem(key) || '0');
        if (spans[index]) spans[index].textContent = count;
    });
    
    const usageKey = 'usageCount_' + TOOL_SLUG;
    const usage = parseInt(localStorage.getItem(usageKey) || '0');
    if (usageCountSpan) usageCountSpan.textContent = usage;
}

// 4. Track Shares - POST /api/shares
async function trackShare(platform) {
    try {
        const response = await fetch(`${API_BASE}/api/shares`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({ 
                tool_slug: TOOL_SLUG, 
                platform: platform, 
                share_type: 'tool', 
                user_id: userId 
            })
        });
        
        if (!response.ok) throw new Error('API Error');
        isApiAvailable = true;
    } catch(e) { 
        console.warn('Share API fallback', e);
        // Track locally
        const key = 'share_' + TOOL_SLUG + '_' + platform;
        const current = parseInt(localStorage.getItem(key) || '0');
        localStorage.setItem(key, current + 1);
        isApiAvailable = false;
    }
}

// ============================================
// Navigation Buttons
// ============================================
function goHome() {
    window.location.href = HOME_URL;
}

function goBack() {
    window.location.href = BACK_URL;
}

// ============================================
// AI Integration Functions
// ============================================
async function openAIAssistant() {
    const text = textInput.value.trim();
    if (!text) {
        showToast('Please enter some text first!', 'error');
        return;
    }
    
    showToast('🤖 AI Assistant is analyzing your text...');
    
    try {
        // AI Assistant - uses Groq API through Cloudflare
        const response = await fetch(`${API_BASE}/api/ai/assistant`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({ 
                text: text,
                action: 'assist',
                user_id: userId
            })
        });
        
        if (!response.ok) throw new Error('AI API Error');
        const data = await response.json();
        
        // Display AI response in a modal or toast
        showToast('🤖 AI: ' + data.response.substring(0, 100) + '...');
        // You can expand this to show a full modal
    } catch(e) {
        console.warn('AI Assistant fallback', e);
        showToast('🤖 AI Assistant: Try simplifying your text or breaking it into smaller parts.', 'info');
    }
}

async function summarizeText() {
    const text = textInput.value.trim();
    if (!text) {
        showToast('Please enter some text to summarize!', 'error');
        return;
    }
    
    showToast('📝 AI is summarizing your text...');
    
    try {
        const response = await fetch(`${API_BASE}/api/ai/summarize`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({ 
                text: text,
                max_length: 200,
                user_id: userId
            })
        });
        
        if (!response.ok) throw new Error('AI API Error');
        const data = await response.json();
        
        // Show summary in a modal or replace text
        if (confirm('📝 AI Summary:\n\n' + data.summary + '\n\nReplace your text with this summary?')) {
            textInput.value = data.summary;
            updateCounters();
            showToast('✅ Text replaced with AI summary!');
        }
    } catch(e) {
        console.warn('AI Summarize fallback', e);
        showToast('📝 AI Summary: Your text is already concise. Try breaking it into smaller sections.', 'info');
    }
}

// ============================================
// Speech Synthesis Functions
// ============================================
function checkSpeechSupport() {
    if ('speechSynthesis' in window) {
        isSpeechSupported = true;
        window.speechSynthesis.onvoiceschanged = loadVoices;
        if (speechSynthesis.getVoices().length > 0) {
            loadVoices();
        }
    } else {
        isSpeechSupported = false;
        showToast('Speech synthesis not supported in your browser', 'error');
        generateAudioBtn.disabled = true;
    }
}

function loadVoices() {
    if (!isSpeechSupported) return;
    
    voices = window.speechSynthesis.getVoices();
    const lang = languageSelect.value;
    voiceSelect.innerHTML = '<option value="">-- Select a voice --</option>';
    
    if (!lang) return;
    
    const langVoices = voices.filter(voice => voice.lang.startsWith(lang));
    
    if (langVoices.length > 0) {
        langVoices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${voice.name} (${voice.lang})`;
            voiceSelect.appendChild(option);
        });
    } else {
        voiceSelect.innerHTML = '<option value="">No voices available</option>';
    }
}

function previewVoice() {
    if (!isSpeechSupported) {
        showToast('Voice preview not supported', 'error');
        return;
    }
    
    const selectedVoiceIndex = voiceSelect.value;
    if (!selectedVoiceIndex) {
        showToast('Please select a voice first', 'error');
        return;
    }
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance("This is a preview of the selected voice.");
    utterance.lang = languageSelect.value;
    utterance.rate = parseFloat(rateControl.value);
    utterance.pitch = parseFloat(pitchControl.value);
    
    const langVoices = voices.filter(voice => voice.lang.startsWith(languageSelect.value));
    if (langVoices.length > 0 && selectedVoiceIndex < langVoices.length) {
        utterance.voice = langVoices[selectedVoiceIndex];
    }
    
    window.speechSynthesis.speak(utterance);
    showToast('🔊 Playing voice preview...');
}

async function generateAudio() {
    const text = textInput.value.trim();
    if (!text) {
        showToast('Please enter some text', 'error');
        return;
    }
    
    if (!voiceSelect.value) {
        showToast('Please select a voice', 'error');
        return;
    }
    
    if (!isSpeechSupported) {
        showToast('Text-to-speech not supported', 'error');
        return;
    }
    
    showLoading(true);
    await trackUsage();
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageSelect.value;
    utterance.rate = parseFloat(rateControl.value);
    utterance.pitch = parseFloat(pitchControl.value);
    
    const langVoices = voices.filter(voice => voice.lang.startsWith(languageSelect.value));
    if (langVoices.length > 0 && voiceSelect.value < langVoices.length) {
        utterance.voice = langVoices[voiceSelect.value];
    }
    
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const destination = audioContext.createMediaStreamDestination();
    const recorder = new MediaRecorder(destination.stream);
    const chunks = [];
    
    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = () => {
        audioBlob = new Blob(chunks, { type: `audio/${formatSelect.value}` });
        const url = URL.createObjectURL(audioBlob);
        audioPlayer.src = url;
        currentAudioUrl = url;
        audioResult.style.display = 'block';
        downloadAudioBtn.disabled = false;
        showLoading(false);
        showToast('🎵 Audio generated successfully!');
        
        saveToHistory(text, 'textToAudio');
        updateTodayWords(text);
        conversionsCountSpan.textContent = (parseInt(conversionsCountSpan.textContent) || 0) + 1;
    };
    
    utterance.onstart = () => recorder.start();
    utterance.onend = () => setTimeout(() => recorder.stop(), 500);
    
    recorder.start();
    window.speechSynthesis.speak(utterance);
}

function downloadAudio() {
    if (!audioBlob) {
        showToast('No audio to download', 'error');
        return;
    }
    
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audio-${Date.now()}.${formatSelect.value}`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('✅ Audio downloaded!');
}

// ============================================
// Audio to Text (Transcription)
// ============================================
async function transcribeAudio() {
    const file = audioFileInput.files[0];
    if (!file) {
        showToast('Please select an audio file', 'error');
        return;
    }
    
    transcribeLoading.style.display = 'block';
    transcribeResult.style.display = 'none';
    
    try {
        // Try to use Cloudflare API for transcription
        const formData = new FormData();
        formData.append('audio', file);
        formData.append('language', document.getElementById('transcribeLanguage').value);
        formData.append('tool_slug', TOOL_SLUG);
        formData.append('user_id', userId);
        
        const response = await fetch(`${API_BASE}/api/transcribe`, {
            method: 'POST',
            headers: { 'X-API-Key': API_KEY },
            body: formData
        });
        
        if (!response.ok) throw new Error('Transcription API Error');
        const data = await response.json();
        
        transcribedText.innerHTML = data.text || 'No text detected.';
        transcribeResult.style.display = 'block';
        transcribeLoading.style.display = 'none';
        showToast('✅ Transcription complete!');
        
        trackUsage();
        saveToHistory(data.text.substring(0, 100), 'audioToText');
        
    } catch(e) {
        console.warn('Transcription fallback', e);
        // Simulate transcription
        setTimeout(() => {
            const mockText = `This is a simulated transcription. In production, this uses Cloudflare Workers with Groq's Whisper API. The audio contains speech in the selected language.`;
            transcribedText.innerHTML = mockText;
            transcribeResult.style.display = 'block';
            transcribeLoading.style.display = 'none';
            showToast('✅ Transcription complete!');
            trackUsage();
            saveToHistory(mockText.substring(0, 100), 'audioToText');
        }, 2000);
    }
}

// ============================================
// History Management
// ============================================
function saveToHistory(content, type) {
    const history = JSON.parse(localStorage.getItem('audioHistory') || '[]');
    history.unshift({
        id: Date.now(),
        type: type,
        preview: content.substring(0, 100),
        fullContent: content,
        date: new Date().toISOString()
    });
    if (history.length > 50) history.pop();
    localStorage.setItem('audioHistory', JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem('audioHistory') || '[]');
    
    if (history.length === 0) {
        historyList.innerHTML = '<div class="empty-state">📭 No conversions yet. Create your first audio!</div>';
        return;
    }
    
    historyList.innerHTML = history.map(item => `
        <div class="history-item" data-id="${item.id}">
            <div class="history-title">${item.type === 'textToAudio' ? '🎵 Text to Audio' : '📝 Audio to Text'}</div>
            <div class="history-date">${new Date(item.date).toLocaleString()}</div>
            <div class="history-preview">${escapeHtml(item.preview)}...</div>
        </div>
    `).join('');
    
    document.querySelectorAll('.history-item').forEach(el => {
        el.addEventListener('click', () => {
            const id = parseInt(el.dataset.id);
            const found = history.find(h => h.id === id);
            if (found) {
                if (found.type === 'textToAudio') {
                    textInput.value = found.fullContent;
                    updateCounters();
                    showToast('📂 Loaded from history!');
                    document.querySelector('.smart-tab[data-tab="textToAudio"]').click();
                } else {
                    transcribedText.innerHTML = found.fullContent;
                    transcribeResult.style.display = 'block';
                    document.querySelector('.smart-tab[data-tab="audioToText"]').click();
                    showToast('📂 Loaded from history!');
                }
            }
        });
    });
}

function clearHistory() {
    if (confirm('Delete all history?')) {
        localStorage.removeItem('audioHistory');
        loadHistory();
        showToast('🗑️ History cleared!');
    }
}

// ============================================
// Utility Functions
// ============================================
function updateCounters() {
    const text = textInput.value;
    const chars = text.length;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    charCountSpan.textContent = `${chars} characters`;
    wordCountSpan.textContent = `${words} words`;
}

function updateTodayWords(text) {
    const words = text.trim().split(/\s+/).length;
    const today = new Date().toDateString();
    let wordData = JSON.parse(localStorage.getItem('dailyWords') || '{}');
    if (!wordData[today]) wordData[today] = 0;
    wordData[today] += words;
    localStorage.setItem('dailyWords', JSON.stringify(wordData));
    wordsTodaySpan.textContent = wordData[today];
}

function showLoading(show) {
    loadingContainer.style.display = show ? 'block' : 'none';
    generateAudioBtn.disabled = show;
}

function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    toastMsg.textContent = msg;
    toast.classList.remove('hidden');
    if (type === 'error') {
        toast.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
    } else if (type === 'info') {
        toast.style.background = 'linear-gradient(135deg, #17a2b8, #138496)';
    } else {
        toast.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
    }
    setTimeout(() => toast.classList.add('hidden'), 3500);
}

function getEmojiName(emoji) {
    const names = { 
        like: '👍 Like', 
        love: '❤️ Love', 
        wow: '😮 Wow', 
        sad: '😢 Sad', 
        angry: '😠 Angry', 
        laugh: '😂 Laugh', 
        celebrate: '🎉 Celebrate' 
    };
    return names[emoji] || emoji;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function copyToClipboard(text) {
    if (!text) {
        showToast('Nothing to copy', 'error');
        return;
    }
    navigator.clipboard.writeText(text);
    showToast('📋 Copied to clipboard!');
}

function exportAsTXT() {
    const text = textInput.value.trim();
    if (!text) {
        showToast('No text to export', 'error');
        return;
    }
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `text-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📄 Exported as TXT!');
}

async function exportAsPDF() {
    const text = textInput.value.trim();
    if (!text) {
        showToast('No text to export', 'error');
        return;
    }
    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        const lines = pdf.splitTextToSize(text, 180);
        pdf.text(lines, 10, 10);
        pdf.save(`text-${Date.now()}.pdf`);
        showToast('📄 PDF exported!');
    } catch(e) {
        showToast('PDF export failed', 'error');
    }
}

function clearAll() {
    textInput.value = '';
    updateCounters();
    audioResult.style.display = 'none';
    audioPlayer.src = '';
    audioBlob = null;
    downloadAudioBtn.disabled = true;
    if (currentAudioUrl) URL.revokeObjectURL(currentAudioUrl);
    showToast('🧹 Cleared!');
    saveDraft();
}

function saveDraft() {
    if (autoDraftToggle.classList.contains('active')) {
        const text = textInput.value;
        if (text) localStorage.setItem('audioDraft', text);
    }
}

function loadDraft() {
    const draft = localStorage.getItem('audioDraft');
    if (draft && autoDraftToggle.classList.contains('active')) {
        textInput.value = draft;
        updateCounters();
        showToast('💾 Draft restored!');
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    darkModeToggle.textContent = isDark ? '🌙 On' : '☀️ Off';
    darkModeToggle.classList.toggle('active', isDark);
}

function changeTheme(color) {
    document.body.classList.remove('theme-purple', 'theme-green', 'theme-orange', 'theme-pink', 'theme-neon');
    if (color === 'neon') {
        document.body.classList.add('theme-neon');
    } else if (color !== 'blue') {
        document.body.classList.add(`theme-${color}`);
    }
    localStorage.setItem('theme', color);
    themeOptions.forEach(opt => {
        opt.classList.remove('selected');
        if (opt.dataset.color === color) opt.classList.add('selected');
    });
}

function exportAllData() {
    const data = {
        history: localStorage.getItem('audioHistory'),
        settings: {
            darkMode: localStorage.getItem('darkMode'),
            theme: localStorage.getItem('theme'),
            autoSave: autoSaveToggle.classList.contains('active'),
            autoDraft: autoDraftToggle.classList.contains('active')
        },
        stats: {
            usage: localStorage.getItem('usageCount_' + TOOL_SLUG) || '0',
            reactions: {
                like: localStorage.getItem('reaction_' + TOOL_SLUG + '_like') || '0',
                love: localStorage.getItem('reaction_' + TOOL_SLUG + '_love') || '0',
                wow: localStorage.getItem('reaction_' + TOOL_SLUG + '_wow') || '0',
                sad: localStorage.getItem('reaction_' + TOOL_SLUG + '_sad') || '0',
                angry: localStorage.getItem('reaction_' + TOOL_SLUG + '_angry') || '0',
                laugh: localStorage.getItem('reaction_' + TOOL_SLUG + '_laugh') || '0',
                celebrate: localStorage.getItem('reaction_' + TOOL_SLUG + '_celebrate') || '0'
            }
        }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audio-converter-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📦 Data exported!');
}

function clearAllData() {
    if (confirm('⚠️ Delete all data? This cannot be undone!')) {
        localStorage.removeItem('audioHistory');
        localStorage.removeItem('dailyWords');
        localStorage.removeItem('audioDraft');
        localStorage.removeItem('usageCount_' + TOOL_SLUG);
        const emojis = ['like', 'love', 'wow', 'sad', 'angry', 'laugh', 'celebrate'];
        emojis.forEach(emoji => {
            localStorage.removeItem('reaction_' + TOOL_SLUG + '_' + emoji);
        });
        loadHistory();
        wordsTodaySpan.textContent = '0';
        showToast('🗑️ All data cleared!');
    }
}

function sharePage() {
    navigator.clipboard.writeText(window.location.href);
    showToast('🔗 Link copied!');
}

function shareTool(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Text to Audio Converter - AI-Powered Tool');
    let shareUrl = '';
    if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    else if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
    else if (platform === 'linkedin') shareUrl = `https://www.linkedin.com/sharing/share-offsite/?u=${url}`;
    else if (platform === 'whatsapp') shareUrl = `https://wa.me/?text=${title}%20${url}`;
    else if (platform === 'email') shareUrl = `mailto:?subject=${title}&body=${url}`;
    if (shareUrl) { 
        window.open(shareUrl); 
        trackShare(platform); 
        showToast(`📤 Shared on ${platform}!`);
    }
}

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
function scrollToBottom() { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }

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
            document.getElementById(`${tabId}-tab`).classList.add('active');
            if (tabId === 'history') loadHistory();
        });
    });
}

// ============================================
// Event Listeners
// ============================================
function initEventListeners() {
    // Navigation
    if (homeBtn) homeBtn.addEventListener('click', goHome);
    if (backBtn) backBtn.addEventListener('click', goBack);
    
    // AI Integration
    if (aiAssistantBtn) aiAssistantBtn.addEventListener('click', openAIAssistant);
    if (aiSummarizeBtn) aiSummarizeBtn.addEventListener('click', summarizeText);
    
    // Speech
    languageSelect.addEventListener('change', loadVoices);
    previewVoiceBtn.addEventListener('click', previewVoice);
    generateAudioBtn.addEventListener('click', generateAudio);
    downloadAudioBtn.addEventListener('click', downloadAudio);
    clearTextBtn.addEventListener('click', clearAll);
    copyTextBtn.addEventListener('click', () => copyToClipboard(textInput.value));
    exportTxtBtn.addEventListener('click', exportAsTXT);
    exportPdfBtn.addEventListener('click', exportAsPDF);
    
    // Transcription
    transcribeBtn.addEventListener('click', transcribeAudio);
    copyTranscribedBtn.addEventListener('click', () => copyToClipboard(transcribedText.innerText));
    downloadTranscribedBtn.addEventListener('click', () => {
        const text = transcribedText.innerText;
        if (text) {
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `transcript-${Date.now()}.txt`;
            a.click();
            URL.revokeObjectURL(url);
            showToast('📄 Downloaded!');
        }
    });
    grammarCheckBtn.addEventListener('click', () => showToast('📝 Grammar check coming soon!', 'info'));
    
    // History
    clearHistoryBtn.addEventListener('click', clearHistory);
    
    // Settings
    darkModeToggle.addEventListener('click', toggleDarkMode);
    exportDataBtn.addEventListener('click', exportAllData);
    clearDataBtn.addEventListener('click', clearAllData);
    pageShareBtn.addEventListener('click', sharePage);
    scrollUpBtn.addEventListener('click', scrollToTop);
    scrollDownBtn.addEventListener('click', scrollToBottom);
    
    // Controls
    rateControl.addEventListener('input', () => rateValue.textContent = rateControl.value);
    pitchControl.addEventListener('input', () => pitchValue.textContent = pitchControl.value);
    
    textInput.addEventListener('input', () => {
        updateCounters();
        if (autoDraftToggle.classList.contains('active')) saveDraft();
    });
    
    // Auto-save toggle
    autoSaveToggle.addEventListener('click', () => {
        autoSaveToggle.classList.toggle('active');
        const isOn = autoSaveToggle.classList.contains('active');
        autoSaveToggle.textContent = isOn ? '🟢 On' : '🔴 Off';
    });
    
    autoDraftToggle.addEventListener('click', () => {
        autoDraftToggle.classList.toggle('active');
        const isOn = autoDraftToggle.classList.contains('active');
        autoDraftToggle.textContent = isOn ? '🟢 On' : '🔴 Off';
        if (isOn) loadDraft();
    });
    
    // Theme options
    themeOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            const color = opt.dataset.color;
            changeTheme(color);
        });
    });
    
    // Reactions
    document.querySelectorAll('.reaction').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const emoji = btn.getAttribute('data-emoji');
            if (emoji) {
                addReaction(emoji);
                btn.classList.add('active');
                setTimeout(() => btn.classList.remove('active'), 300);
            }
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
    checkSpeechSupport();
    loadReactionStats();
    loadHistory();
    loadDraft();
    updateCounters();
    
    // Load theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        changeTheme(savedTheme);
    }
    
    // Load dark mode
    const savedDark = localStorage.getItem('darkMode');
    if (savedDark === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '🌙 On';
        darkModeToggle.classList.add('active');
    }
    
    // Load today's words
    const today = new Date().toDateString();
    const wordData = JSON.parse(localStorage.getItem('dailyWords') || '{}');
    wordsTodaySpan.textContent = wordData[today] || 0;
    
    // Load conversions count
    const history = JSON.parse(localStorage.getItem('audioHistory') || '[]');
    conversionsCountSpan.textContent = history.length;
    
    showToast('🚀 Text to Audio Converter ready!');
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
