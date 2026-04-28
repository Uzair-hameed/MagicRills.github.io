/* ============================================
   SPEECH-TO-NOTES CONVERTER - COMPLETE JS
   37 Features with AI Integration & TiDB
   ============================================ */

// ============================================
// Configuration
// ============================================
const TOOL_SLUG = 'speech-to-notes-converter';
const TOOL_NAME = 'Speech-to-Notes Converter';
const CATEGORY = 'student';
const WORKER_URL = 'https://speech-to-notes-converter.uzairhameed01.workers.dev';
const API_BASE = '/api';

let userId = localStorage.getItem('userId');
if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
}

// Data
let savedNotes = [];
let currentTranscription = '';
let currentSummary = '';
let currentKeyPoints = [];
let currentGrammarFixed = '';

// Speech Recognition
let recognition = null;
let isRecording = false;

// ============================================
// DOM Elements
// ============================================
const usageCountSpan = document.getElementById('usageCount');
const notesCountSpan = document.getElementById('notesCount');
const timeSavedSpan = document.getElementById('timeSaved');
const transcriptionText = document.getElementById('transcriptionText');
const wordCounter = document.getElementById('wordCounter');
const charCounter = document.getElementById('charCounter');
const recordingStatus = document.getElementById('recordingStatus');
const waveAnimation = document.getElementById('waveAnimation');
const startRecordBtn = document.getElementById('startRecordBtn');
const stopRecordBtn = document.getElementById('stopRecordBtn');
const clearBtn = document.getElementById('clearBtn');
const summarizeBtn = document.getElementById('summarizeBtn');
const keyPointsBtn = document.getElementById('keyPointsBtn');
const bulletPointsBtn = document.getElementById('bulletPointsBtn');
const grammarFixBtn = document.getElementById('grammarFixBtn');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const exportTxtBtn = document.getElementById('exportTxtBtn');
const exportPdfBtn = document.getElementById('exportPdfBtn');
const exportDocBtn = document.getElementById('exportDocBtn');
const printBtn = document.getElementById('printBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const autoStopToggle = document.getElementById('autoStopToggle');
const autoPunctuationToggle = document.getElementById('autoPunctuationToggle');
const autoSaveToggle = document.getElementById('autoSaveToggle');
const languageSelect = document.getElementById('languageSelect');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const exportDataBtn = document.getElementById('exportDataBtn');
const importDataBtn = document.getElementById('importDataBtn');
const importFile = document.getElementById('importFile');
const pageShareBtn = document.getElementById('pageShareBtn');
const scrollUpBtn = document.getElementById('scrollUpBtn');
const scrollDownBtn = document.getElementById('scrollDownBtn');
const aiLoading = document.getElementById('aiLoading');
const resultsSection = document.getElementById('resultsSection');
const summaryTextDiv = document.getElementById('summaryText');
const keypointsList = document.getElementById('keypointsList');
const grammarTextDiv = document.getElementById('grammarText');
const grammarSuggestionsDiv = document.getElementById('grammarSuggestions');
const historyList = document.getElementById('historyList');
const copyTranscriptionBtn = document.getElementById('copyTranscriptionBtn');
const copySummaryBtn = document.getElementById('copySummaryBtn');
const copyKeypointsBtn = document.getElementById('copyKeypointsBtn');
const applyGrammarBtn = document.getElementById('applyGrammarBtn');
const grammarCheckBtn = document.getElementById('grammarCheckBtn');

// Studio Elements
const flashcardBtn = document.getElementById('flashcardBtn');
const quizBtn = document.getElementById('quizBtn');
const studyGuideBtn = document.getElementById('studyGuideBtn');
const simplifyBtn = document.getElementById('simplifyBtn');
const studioResult = document.getElementById('studioResult');
const studioResultTitle = document.getElementById('studioResultTitle');
const studioContent = document.getElementById('studioContent');
const copyStudioResult = document.getElementById('copyStudioResult');

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
// Speech Recognition
// ============================================
function initSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showToast('Speech recognition not supported in this browser. Please use Chrome or Edge.', 'error');
        startRecordBtn.disabled = true;
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = languageSelect.value;
    
    recognition.onstart = () => {
        isRecording = true;
        recordingStatus.innerHTML = '<i class="fas fa-circle"></i> Recording... Speak now!';
        recordingStatus.className = 'status-recording';
        waveAnimation.style.display = 'flex';
        startRecordBtn.disabled = true;
        stopRecordBtn.disabled = false;
    };
    
    recognition.onerror = (event) => {
        console.error('Recognition error:', event.error);
        showToast(`Error: ${event.error}`, 'error');
        stopRecording();
    };
    
    recognition.onend = () => {
        if (isRecording) {
            if (autoStopToggle.classList.contains('active')) {
                stopRecording();
            } else {
                recognition.start();
            }
        }
    };
    
    recognition.onresult = (event) => {
        let interim = '';
        let final = '';
        
        for (let i = 0; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                final += event.results[i][0].transcript;
            } else {
                interim += event.results[i][0].transcript;
            }
        }
        
        if (final) {
            currentTranscription = final;
            transcriptionText.value = final;
            updateCounters();
        } else if (interim) {
            transcriptionText.value = interim;
        }
    };
}

function startRecording() {
    if (recognition) {
        trackUsage();
        recognition.lang = languageSelect.value;
        recognition.start();
    } else {
        initSpeechRecognition();
        if (recognition) recognition.start();
    }
}

function stopRecording() {
    if (recognition) {
        isRecording = false;
        recognition.stop();
        recordingStatus.innerHTML = '<i class="fas fa-circle"></i> Ready to record';
        recordingStatus.className = 'status-idle';
        waveAnimation.style.display = 'none';
        startRecordBtn.disabled = false;
        stopRecordBtn.disabled = true;
        showToast('Recording stopped!');
    }
}

// ============================================
// AI Functions
// ============================================
async function summarizeText() {
    const text = transcriptionText.value.trim();
    if (!text) {
        showToast('No text to summarize', 'error');
        return;
    }
    
    showAIProgress(true, 'AI is summarizing...');
    
    try {
        const response = await fetch(`${WORKER_URL}/api/summarize`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text })
        });
        const data = await response.json();
        
        if (data.success) {
            currentSummary = data.summary;
            summaryTextDiv.innerHTML = data.summary;
            showResults();
            showToast('Summary generated!');
        } else {
            throw new Error(data.error);
        }
    } catch(error) {
        showToast('Summarization failed: ' + error.message, 'error');
        summaryTextDiv.innerHTML = 'Unable to generate summary. Please try again.';
        showResults();
    }
    
    showAIProgress(false);
}

async function extractKeyPoints() {
    const text = transcriptionText.value.trim();
    if (!text) {
        showToast('No text to analyze', 'error');
        return;
    }
    
    showAIProgress(true, 'AI is extracting key points...');
    
    try {
        const response = await fetch(`${WORKER_URL}/api/key-points`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text })
        });
        const data = await response.json();
        
        if (data.success && data.points) {
            currentKeyPoints = data.points;
            keypointsList.innerHTML = data.points.map(p => `<li>${p}</li>`).join('');
            showResults();
            showToast('Key points extracted!');
        } else {
            throw new Error(data.error);
        }
    } catch(error) {
        showToast('Key points extraction failed', 'error');
        keypointsList.innerHTML = '<li>Unable to extract key points. Please try again.</li>';
        showResults();
    }
    
    showAIProgress(false);
}

async function fixGrammar() {
    const text = transcriptionText.value.trim();
    if (!text) {
        showToast('No text to check', 'error');
        return;
    }
    
    showAIProgress(true, 'AI is checking grammar...');
    
    try {
        const response = await fetch(`${WORKER_URL}/api/grammar-check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text })
        });
        const data = await response.json();
        
        if (data.success) {
            currentGrammarFixed = data.correctedText;
            grammarTextDiv.innerHTML = data.correctedText;
            
            if (data.suggestions && data.suggestions.length > 0) {
                grammarSuggestionsDiv.innerHTML = data.suggestions.map(s => `<div>💡 ${s}</div>`).join('');
            } else {
                grammarSuggestionsDiv.innerHTML = '<div>No grammar issues found!</div>';
            }
            showResults();
            showToast('Grammar check complete!');
        } else {
            throw new Error(data.error);
        }
    } catch(error) {
        showToast('Grammar check failed', 'error');
        grammarTextDiv.innerHTML = 'Unable to check grammar. Please try again.';
        showResults();
    }
    
    showAIProgress(false);
}

function convertToBulletPoints() {
    const text = transcriptionText.value.trim();
    if (!text) {
        showToast('No text to convert', 'error');
        return;
    }
    
    // Simple bullet point conversion
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const bullets = sentences.map(s => `• ${s.trim()}`).join('\n\n');
    summaryTextDiv.innerHTML = bullets;
    currentSummary = bullets;
    showResults();
    showToast('Converted to bullet points!');
}

async function applyGrammarFixes() {
    if (currentGrammarFixed) {
        transcriptionText.value = currentGrammarFixed;
        updateCounters();
        showToast('Grammar fixes applied!');
    }
}

async function generateFlashcards() {
    const text = transcriptionText.value.trim();
    if (!text) {
        showToast('No text to generate flashcards', 'error');
        return;
    }
    
    showAIProgress(true, 'Generating flashcards...');
    
    try {
        const response = await fetch(`${WORKER_URL}/api/flashcards`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text })
        });
        const data = await response.json();
        
        if (data.success && data.flashcards) {
            studioResultTitle.innerHTML = '<i class="fas fa-layer-group"></i> Flashcards';
            studioContent.innerHTML = data.flashcards.map((card, i) => `
                <div class="flashcard" style="margin-bottom:15px;padding:12px;background:var(--light);border-radius:8px;">
                    <strong>Q${i+1}:</strong> ${card.question}<br>
                    <strong>A:</strong> ${card.answer}
                </div>
            `).join('');
            studioResult.style.display = 'block';
            showToast('Flashcards generated!');
        }
    } catch(error) {
        showToast('Flashcard generation failed', 'error');
    }
    
    showAIProgress(false);
}

// ============================================
// UI Helper Functions
// ============================================
function updateCounters() {
    const text = transcriptionText.value;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const chars = text.length;
    wordCounter.textContent = words + ' words';
    charCounter.textContent = chars + ' chars';
}

function showAIProgress(show, message = 'Processing...') {
    if (show) {
        aiLoading.querySelector('p').textContent = message;
        aiLoading.style.display = 'block';
        resultsSection.style.display = 'none';
    } else {
        aiLoading.style.display = 'none';
    }
}

function showResults() {
    resultsSection.style.display = 'block';
}

function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.classList.remove('hidden');
    toast.style.background = type === 'error' ? '#ef4444' : '#333';
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
}

function saveNote() {
    const text = transcriptionText.value.trim();
    if (!text) {
        showToast('No content to save', 'error');
        return;
    }
    
    const note = {
        id: Date.now(),
        title: text.substring(0, 50) + '...',
        content: text,
        summary: currentSummary,
        date: new Date().toISOString()
    };
    
    savedNotes = JSON.parse(localStorage.getItem('speechNotes') || '[]');
    savedNotes.unshift(note);
    if (savedNotes.length > 50) savedNotes.pop();
    localStorage.setItem('speechNotes', JSON.stringify(savedNotes));
    
    loadHistory();
    notesCountSpan.textContent = savedNotes.length;
    showToast('Note saved!');
}

function loadHistory() {
    savedNotes = JSON.parse(localStorage.getItem('speechNotes') || '[]');
    
    if (!historyList) return;
    
    if (savedNotes.length === 0) {
        historyList.innerHTML = '<div class="empty-state">No saved notes yet. Record and save your first note!</div>';
        return;
    }
    
    historyList.innerHTML = savedNotes.map(note => `
        <div class="history-item" data-id="${note.id}">
            <div class="history-title">${escapeHtml(note.title)}</div>
            <div class="history-date">${new Date(note.date).toLocaleString()}</div>
            <div class="history-preview">${escapeHtml(note.content.substring(0, 100))}...</div>
        </div>
    `).join('');
    
    document.querySelectorAll('.history-item').forEach(el => {
        el.addEventListener('click', () => {
            const id = parseInt(el.dataset.id);
            const found = savedNotes.find(n => n.id === id);
            if (found) {
                transcriptionText.value = found.content;
                updateCounters();
                if (found.summary) {
                    summaryTextDiv.innerHTML = found.summary;
                    showResults();
                }
                showToast('Note loaded!');
                document.querySelector('.smart-tab[data-tab="record"]').click();
            }
        });
    });
}

function clearHistory() {
    if (confirm('Delete all saved notes?')) {
        localStorage.removeItem('speechNotes');
        loadHistory();
        notesCountSpan.textContent = 0;
        showToast('History cleared!');
    }
}

function exportAsTXT() {
    const text = transcriptionText.value.trim();
    if (!text) {
        showToast('No content to export', 'error');
        return;
    }
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded as TXT!');
}

async function exportAsPDF() {
    const text = transcriptionText.value.trim();
    if (!text) {
        showToast('No content to export', 'error');
        return;
    }
    showAIProgress(true, 'Creating PDF...');
    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        const lines = pdf.splitTextToSize(text, 180);
        pdf.text(lines, 10, 10);
        pdf.save(`notes-${Date.now()}.pdf`);
        showToast('PDF downloaded!');
    } catch(e) { showToast('PDF generation failed', 'error'); }
    showAIProgress(false);
}

function exportAsDOC() {
    const text = transcriptionText.value.trim();
    if (!text) return;
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Lecture Notes</title></head><body><pre>${text}</pre></body></html>`;
    const blob = new Blob([html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-${Date.now()}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded as DOC!');
}

function printNotes() {
    const text = transcriptionText.value.trim();
    if (!text) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Lecture Notes</title><style>body{font-family:Arial;padding:40px;}</style></head><body><pre>${text}</pre></body></html>`);
    printWindow.document.close();
    printWindow.print();
}

function clearAll() {
    transcriptionText.value = '';
    summaryTextDiv.innerHTML = '';
    keypointsList.innerHTML = '';
    grammarTextDiv.innerHTML = '';
    grammarSuggestionsDiv.innerHTML = '';
    resultsSection.style.display = 'none';
    updateCounters();
    showToast('Cleared!');
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    darkModeToggle.textContent = isDark ? 'On' : 'Off';
    darkModeToggle.classList.toggle('active', isDark);
}

function autoSaveDraft() {
    if (autoSaveToggle.classList.contains('active')) {
        const text = transcriptionText.value;
        if (text) {
            localStorage.setItem('speechDraft', text);
        }
    }
}

function loadDraft() {
    const draft = localStorage.getItem('speechDraft');
    if (draft) {
        transcriptionText.value = draft;
        updateCounters();
        showToast('Draft restored!');
    }
}

function exportData() {
    const data = {
        notes: localStorage.getItem('speechNotes'),
        settings: {
            darkMode: localStorage.getItem('darkMode'),
            autoPunctuation: localStorage.getItem('autoPunctuation')
        }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `speech-notes-data-${Date.now()}.json`;
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
                if (data.notes) localStorage.setItem('speechNotes', data.notes);
                if (data.settings?.darkMode === 'true') toggleDarkMode();
                loadHistory();
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
    const title = encodeURIComponent('Speech-to-Notes Converter');
    let shareUrl = '';
    if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    else if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
    else if (platform === 'linkedin') shareUrl = `https://www.linkedin.com/sharing/share-offsite/?u=${url}`;
    else if (platform === 'whatsapp') shareUrl = `https://wa.me/?text=${title}%20${url}`;
    else if (platform === 'email') shareUrl = `mailto:?subject=${title}&body=${url}`;
    if (shareUrl) { window.open(shareUrl); trackShare(platform); showToast(`Shared on ${platform}!`); }
}

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
function scrollToBottom() { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }

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
// Result Tabs
// ============================================
function initResultTabs() {
    document.querySelectorAll('.result-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const resultId = tab.dataset.result;
            document.querySelectorAll('.result-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.result-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`${resultId}Result`).classList.add('active');
        });
    });
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
        });
    });
}

// ============================================
// Event Listeners
// ============================================
function initEventListeners() {
    startRecordBtn?.addEventListener('click', startRecording);
    stopRecordBtn?.addEventListener('click', stopRecording);
    clearBtn?.addEventListener('click', clearAll);
    summarizeBtn?.addEventListener('click', summarizeText);
    keyPointsBtn?.addEventListener('click', extractKeyPoints);
    bulletPointsBtn?.addEventListener('click', convertToBulletPoints);
    grammarFixBtn?.addEventListener('click', fixGrammar);
    saveNoteBtn?.addEventListener('click', saveNote);
    exportTxtBtn?.addEventListener('click', exportAsTXT);
    exportPdfBtn?.addEventListener('click', exportAsPDF);
    exportDocBtn?.addEventListener('click', exportAsDOC);
    printBtn?.addEventListener('click', printNotes);
    darkModeToggle?.addEventListener('click', toggleDarkMode);
    clearHistoryBtn?.addEventListener('click', clearHistory);
    exportDataBtn?.addEventListener('click', exportData);
    importDataBtn?.addEventListener('click', importData);
    pageShareBtn?.addEventListener('click', sharePage);
    scrollUpBtn?.addEventListener('click', scrollToTop);
    scrollDownBtn?.addEventListener('click', scrollToBottom);
    copyTranscriptionBtn?.addEventListener('click', () => copyToClipboard(transcriptionText.value));
    copySummaryBtn?.addEventListener('click', () => copyToClipboard(currentSummary));
    copyKeypointsBtn?.addEventListener('click', () => copyToClipboard(currentKeyPoints.join('\n')));
    applyGrammarBtn?.addEventListener('click', applyGrammarFixes);
    grammarCheckBtn?.addEventListener('click', fixGrammar);
    languageSelect?.addEventListener('change', () => {
        if (recognition) recognition.lang = languageSelect.value;
    });
    
    // Auto-save on input
    transcriptionText?.addEventListener('input', () => {
        updateCounters();
        if (autoSaveToggle.classList.contains('active')) autoSaveDraft();
    });
    
    // Studio buttons
    flashcardBtn?.addEventListener('click', generateFlashcards);
    quizBtn?.addEventListener('click', () => showToast('Quiz generation coming soon!', 'warning'));
    studyGuideBtn?.addEventListener('click', () => showToast('Study guide coming soon!', 'warning'));
    simplifyBtn?.addEventListener('click', () => showToast('Simplify text coming soon!', 'warning'));
    copyStudioResult?.addEventListener('click', () => copyToClipboard(studioContent.innerText));
    
    // Reactions
    document.querySelectorAll('.reaction').forEach(btn => {
        btn.addEventListener('click', () => {
            const emoji = btn.dataset.emoji;
            if (emoji) addReaction(emoji);
        });
    });
    
    // Social share
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
    initResultTabs();
    initEventListeners();
    initSpeechRecognition();
    loadStats();
    loadHistory();
    loadDraft();
    
    const savedDark = localStorage.getItem('darkMode');
    if (savedDark === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = 'On';
        darkModeToggle.classList.add('active');
    }
    
    savedNotes = JSON.parse(localStorage.getItem('speechNotes') || '[]');
    notesCountSpan.textContent = savedNotes.length;
    
    // Calculate time saved (mock)
    timeSavedSpan.textContent = Math.floor(Math.random() * 50) + 10;
    
    showToast('Speech-to-Notes ready!');
}

init();
