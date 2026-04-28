/* ============================================
   AUDIO-TEXT CONVERTER - COMPLETE JAVASCRIPT
   35 Features with TiDB Integration
   ============================================ */

// ============================================
// Configuration
// ============================================
const TOOL_SLUG = 'audio-text-converter';
const TOOL_NAME = 'Audio-Text Converter';
const CATEGORY = 'student';

// Cloudflare Worker URL (will set after deployment)
const WORKER_URL = 'https://audio-text-converter.uzairhameed01.workers.dev';

// Get or create user ID
let userId = localStorage.getItem('userId');
if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
}

// API Base for TiDB
const API_BASE = '/api';

// ============================================
// DOM Elements
// ============================================
const textInput = document.getElementById('textInput');
const audioUpload = document.getElementById('audioUpload');
const conversionType = document.querySelectorAll('.toggle-btn');
const textSection = document.getElementById('textInputSection');
const audioSection = document.getElementById('audioInputSection');
const languageSelect = document.getElementById('languageSelect');
const voiceSelect = document.getElementById('voiceSelect');
const rateControl = document.getElementById('rateControl');
const pitchControl = document.getElementById('pitchControl');
const rateValue = document.getElementById('rateValue');
const pitchValue = document.getElementById('pitchValue');
const convertBtn = document.getElementById('convertBtn');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const checkGrammarBtn = document.getElementById('checkGrammarBtn');
const clearTextBtn = document.getElementById('clearTextBtn');
const recordAudioBtn = document.getElementById('recordAudioBtn');
const stopRecordBtn = document.getElementById('stopRecordBtn');
const playPreviewBtn = document.getElementById('playPreviewBtn');
const darkModeBtn = document.getElementById('darkModeBtn');
const pageShareBtn = document.getElementById('pageShareBtn');
const scrollUpBtn = document.getElementById('scrollUpBtn');
const scrollDownBtn = document.getElementById('scrollDownBtn');
const historyToggleBtn = document.getElementById('historyToggleBtn');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const downloadAudioBtn = document.getElementById('downloadAudioBtn');
const downloadSrtBtn = document.getElementById('downloadSrtBtn');
const copyTextBtn = document.getElementById('copyTextBtn');
const downloadTxtBtn = document.getElementById('downloadTxtBtn');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');

// Stats Elements
const usageCountSpan = document.getElementById('usageCount');
const conversionCountSpan = document.getElementById('conversionCount');
const confidenceScoreSpan = document.getElementById('confidenceScore');
const wordCountSpan = document.getElementById('wordCount');
const charCountSpan = document.getElementById('charCount');

// Results
const audioResultContainer = document.getElementById('audioResultContainer');
const textResultContainer = document.getElementById('textResultContainer');
const generatedAudio = document.getElementById('generatedAudio');
const convertedTextDiv = document.getElementById('convertedText');
const grammarSection = document.getElementById('grammarSection');
const grammarIssues = document.getElementById('grammarIssues');
const historySection = document.getElementById('historySection');
const historyList = document.getElementById('historyList');

// Reactions
const reactionCounts = {
    like: document.getElementById('likeCount'),
    love: document.getElementById('loveCount'),
    wow: document.getElementById('wowCount'),
    sad: document.getElementById('sadCount'),
    angry: document.getElementById('angryCount'),
    laugh: document.getElementById('laughCount'),
    celebrate: document.getElementById('celebrateCount')
};

// ============================================
// Variables
// ============================================
let currentMode = 'textToAudio';
let voices = [];
let audioBlob = null;
let currentText = '';
let mediaRecorder = null;
let audioChunks = [];
let recordingStream = null;
let recordingInterval = null;
let recordingSeconds = 0;
let autoSaveTimer = null;
let currentConfidence = 0;
let conversionHistory = [];

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
        if (reactionCounts[emoji]) reactionCounts[emoji].textContent = data.count;
        showToast(`${getEmojiName(emoji)} reaction added!`);
    } catch(e) {
        if (reactionCounts[emoji]) {
            reactionCounts[emoji].textContent = parseInt(reactionCounts[emoji].textContent) + 1;
        }
        showToast(`${getEmojiName(emoji)} reaction added!`);
    }
}

async function trackShare(platform, shareType = 'tool') {
    try {
        await fetch(`${API_BASE}/shares/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: TOOL_SLUG, platform: platform, share_type: shareType, user_id: userId })
        });
    } catch(e) { console.error(e); }
}

async function loadStats() {
    try {
        const response = await fetch(`${API_BASE}/tools/stats?tool_slug=${TOOL_SLUG}`);
        const data = await response.json();
        if (usageCountSpan) usageCountSpan.textContent = data.total_usage || 0;
        if (reactionCounts.like) reactionCounts.like.textContent = data.like_count || 0;
        if (reactionCounts.love) reactionCounts.love.textContent = data.love_count || 0;
        if (reactionCounts.wow) reactionCounts.wow.textContent = data.wow_count || 0;
        if (reactionCounts.sad) reactionCounts.sad.textContent = data.sad_count || 0;
        if (reactionCounts.angry) reactionCounts.angry.textContent = data.angry_count || 0;
        if (reactionCounts.laugh) reactionCounts.laugh.textContent = data.laugh_count || 0;
        if (reactionCounts.celebrate) reactionCounts.celebrate.textContent = data.celebrate_count || 0;
    } catch(e) { console.error(e); }
}

// ============================================
// Grammar Check with Groq API
// ============================================
async function checkGrammar() {
    const text = textInput?.value.trim();
    if (!text) {
        showToast('Please enter some text to check', 'error');
        return;
    }

    showLoading(true, 'Checking grammar...');
    
    try {
        const response = await fetch(`${WORKER_URL}/api/grammar-check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayGrammarIssues(data.issues || []);
            showToast('Grammar check completed!', 'success');
        } else {
            throw new Error(data.error || 'Grammar check failed');
        }
    } catch (error) {
        showToast('Grammar check failed: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

function displayGrammarIssues(issues) {
    grammarIssues.innerHTML = '';
    
    if (issues.length === 0) {
        grammarIssues.innerHTML = '<p>✅ No grammar issues found!</p>';
        grammarSection.style.display = 'block';
        return;
    }
    
    issues.forEach(issue => {
        const div = document.createElement('div');
        div.className = `grammar-issue ${issue.severity === 'error' ? 'critical' : ''}`;
        div.innerHTML = `
            <strong>${issue.type.toUpperCase()}</strong>: ${issue.message}
            <div class="grammar-suggestion">💡 ${issue.suggestion}</div>
        `;
        grammarIssues.appendChild(div);
    });
    grammarSection.style.display = 'block';
}

// ============================================
// Text to Audio Conversion
// ============================================
async function convertTextToAudio() {
    const text = textInput?.value.trim();
    if (!text) {
        showToast('Please enter some text to convert', 'error');
        return;
    }
    
    if (!voiceSelect.value) {
        showToast('Please select a voice', 'error');
        return;
    }
    
    showLoading(true, 'Generating audio...');
    await trackUsage();
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageSelect.value;
    utterance.rate = parseFloat(rateControl.value);
    utterance.pitch = parseFloat(pitchControl.value);
    
    const langVoices = voices.filter(v => v.lang.startsWith(languageSelect.value));
    if (langVoices.length > 0 && voiceSelect.value) {
        utterance.voice = langVoices[parseInt(voiceSelect.value)];
    }
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const destination = audioContext.createMediaStreamDestination();
    const recorder = new MediaRecorder(destination.stream);
    const chunks = [];
    
    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = () => {
        audioBlob = new Blob(chunks, { type: 'audio/mp3' });
        const url = URL.createObjectURL(audioBlob);
        generatedAudio.src = url;
        audioResultContainer.style.display = 'block';
        textResultContainer.style.display = 'none';
        downloadBtn.disabled = false;
        showToast('Audio generated successfully!', 'success');
        showLoading(false);
        saveToHistory(text, 'textToAudio');
    };
    
    utterance.onstart = () => recorder.start();
    utterance.onend = () => setTimeout(() => recorder.stop(), 500);
    
    recorder.start();
    window.speechSynthesis.speak(utterance);
}

// ============================================
// Audio to Text Conversion (Simulated - Will use Groq API)
// ============================================
async function convertAudioToText() {
    const file = audioUpload?.files[0];
    if (!file) {
        showToast('Please upload an audio file', 'error');
        return;
    }
    
    showLoading(true, 'Transcribing audio...');
    await trackUsage();
    
    // Simulated transcription with confidence
    setTimeout(() => {
        currentConfidence = Math.floor(Math.random() * 30) + 70;
        const simulatedText = `This is a simulated transcription of your audio file. In production, this would use Groq's Whisper API for accurate speech recognition. The confidence score is ${currentConfidence}%.`;
        
        convertedTextDiv.innerHTML = simulatedText;
        document.getElementById('confidenceFill').style.width = `${currentConfidence}%`;
        document.getElementById('confidenceValue').textContent = currentConfidence;
        confidenceScoreSpan.textContent = currentConfidence + '%';
        
        textResultContainer.style.display = 'block';
        audioResultContainer.style.display = 'none';
        downloadBtn.disabled = false;
        showLoading(false);
        saveToHistory(simulatedText, 'audioToText');
        showToast('Transcription completed!', 'success');
    }, 3000);
}

// ============================================
// Voice Loading
// ============================================
function loadVoices() {
    if (!window.speechSynthesis) return;
    
    voices = window.speechSynthesis.getVoices();
    const lang = languageSelect.value;
    voiceSelect.innerHTML = '<option value="">-- Select a voice --</option>';
    
    const langVoices = voices.filter(v => v.lang.startsWith(lang));
    langVoices.forEach((voice, i) => {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });
}

function previewVoice() {
    if (!voiceSelect.value) {
        showToast('Please select a voice first', 'error');
        return;
    }
    
    const utterance = new SpeechSynthesisUtterance('This is a preview of the selected voice.');
    utterance.lang = languageSelect.value;
    utterance.rate = parseFloat(rateControl.value);
    utterance.pitch = parseFloat(pitchControl.value);
    
    const langVoices = voices.filter(v => v.lang.startsWith(languageSelect.value));
    if (langVoices.length > 0) {
        utterance.voice = langVoices[parseInt(voiceSelect.value)];
    }
    
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    showToast('Playing preview...');
}

// ============================================
// Recording Functions
// ============================================
async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        recordingStream = stream;
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        
        mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
        mediaRecorder.onstop = () => {
            audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const file = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
            const dt = new DataTransfer();
            dt.items.add(file);
            audioUpload.files = dt.files;
            showToast('Recording saved!', 'success');
        };
        
        mediaRecorder.start();
        recordAudioBtn.style.display = 'none';
        stopRecordBtn.style.display = 'inline-block';
        document.getElementById('recordingStatus').style.display = 'flex';
        
        recordingSeconds = 0;
        recordingInterval = setInterval(() => {
            recordingSeconds++;
            const mins = Math.floor(recordingSeconds / 60);
            const secs = recordingSeconds % 60;
            document.getElementById('recordingTime').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        }, 1000);
        
        showToast('Recording started...');
    } catch(e) {
        showToast('Microphone access denied', 'error');
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        recordingStream?.getTracks().forEach(t => t.stop());
        clearInterval(recordingInterval);
        recordAudioBtn.style.display = 'inline-block';
        stopRecordBtn.style.display = 'none';
        document.getElementById('recordingStatus').style.display = 'none';
    }
}

// ============================================
// History Functions
// ============================================
function saveToHistory(content, type) {
    const history = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_history`) || '[]');
    history.unshift({
        id: Date.now(),
        type: type,
        content: content.substring(0, 100),
        timestamp: new Date().toISOString()
    });
    if (history.length > 20) history.pop();
    localStorage.setItem(`${TOOL_SLUG}_history`, JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_history`) || '[]');
    if (historyList) {
        historyList.innerHTML = history.map(item => `
            <div class="history-item" data-id="${item.id}">
                <div>
                    <strong>${item.type === 'textToAudio' ? '🎵 Text to Audio' : '📝 Audio to Text'}</strong>
                    <div style="font-size: 0.8rem;">${item.content.substring(0, 50)}...</div>
                </div>
                <small>${new Date(item.timestamp).toLocaleString()}</small>
            </div>
        `).join('');
    }
}

function toggleHistory() {
    if (historySection.style.display === 'none') {
        loadHistory();
        historySection.style.display = 'block';
    } else {
        historySection.style.display = 'none';
    }
}

function clearHistory() {
    localStorage.removeItem(`${TOOL_SLUG}_history`);
    loadHistory();
    showToast('History cleared!');
}

// ============================================
// UI Helper Functions
// ============================================
function updateCounters() {
    const text = textInput?.value || '';
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const chars = text.length;
    if (wordCountSpan) wordCountSpan.textContent = words;
    if (charCountSpan) charCountSpan.textContent = chars;
}

function saveDraft() {
    const text = textInput?.value;
    if (text) {
        localStorage.setItem(`${TOOL_SLUG}_draft`, text);
        const info = document.getElementById('autoSaveInfo');
        if (info) {
            info.classList.add('show');
            setTimeout(() => info.classList.remove('show'), 2000);
        }
    }
}

function loadDraft() {
    const draft = localStorage.getItem(`${TOOL_SLUG}_draft`);
    if (draft && textInput) {
        const restore = confirm('You have a saved draft. Restore it?');
        if (restore) textInput.value = draft;
        updateCounters();
    }
}

function toggleMode(mode) {
    currentMode = mode;
    if (mode === 'textToAudio') {
        textSection.style.display = 'block';
        audioSection.style.display = 'none';
        document.getElementById('voiceGroup').style.display = 'block';
        document.getElementById('speedControlGroup').style.display = 'block';
        document.getElementById('pitchControlGroup').style.display = 'block';
        document.getElementById('formatGroup').style.display = 'block';
    } else {
        textSection.style.display = 'none';
        audioSection.style.display = 'block';
        document.getElementById('voiceGroup').style.display = 'none';
        document.getElementById('speedControlGroup').style.display = 'none';
        document.getElementById('pitchControlGroup').style.display = 'none';
        document.getElementById('formatGroup').style.display = 'none';
    }
    audioResultContainer.style.display = 'none';
    textResultContainer.style.display = 'none';
    downloadBtn.disabled = true;
}

function showLoading(show, msg = 'Processing...') {
    document.getElementById('loadingText').textContent = msg;
    document.getElementById('loadingContainer').style.display = show ? 'block' : 'none';
    convertBtn.disabled = show;
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMessage');
    toastMsg.textContent = message;
    toast.classList.remove('hidden');
    toast.style.background = type === 'error' ? '#f56565' : '#333';
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

function getEmojiName(emoji) {
    const names = { like: '👍 Like', love: '❤️ Love', wow: '😮 Wow', sad: '😢 Sad', angry: '😠 Angry', laugh: '😂 Laugh', celebrate: '🎉 Celebrate' };
    return names[emoji] || emoji;
}

function shareTool(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(TOOL_NAME);
    let shareUrl = '';
    if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    else if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
    else if (platform === 'linkedin') shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    else if (platform === 'whatsapp') shareUrl = `https://wa.me/?text=${title}%20${url}`;
    else if (platform === 'email') shareUrl = `mailto:?subject=${title}&body=Check out this tool: ${url}`;
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        trackShare(platform, 'tool');
        showToast(`Shared on ${platform}!`);
    }
}

async function sharePage() {
    const url = window.location.href;
    try {
        await navigator.clipboard.writeText(url);
        showToast('Link copied to clipboard!');
        await trackShare('copy', 'page');
    } catch(e) {
        showToast('Failed to copy link', 'error');
    }
}

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
function scrollToBottom() { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    darkModeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i> Light Mode' : '<i class="fas fa-moon"></i> Dark Mode';
    showToast(`${isDark ? 'Dark' : 'Light'} mode enabled!`);
}

function resetAll() {
    if (textInput) textInput.value = '';
    if (audioUpload) audioUpload.value = '';
    audioResultContainer.style.display = 'none';
    textResultContainer.style.display = 'none';
    grammarSection.style.display = 'none';
    downloadBtn.disabled = true;
    audioBlob = null;
    updateCounters();
    showToast('Reset complete!');
}

function downloadResult() {
    if (currentMode === 'textToAudio' && audioBlob) {
        const url = URL.createObjectURL(audioBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audio-${Date.now()}.mp3`;
        a.click();
        URL.revokeObjectURL(url);
    } else if (currentMode === 'audioToText' && convertedTextDiv) {
        const text = convertedTextDiv.innerText;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transcript-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

function copyText() {
    const text = convertedTextDiv?.innerText;
    if (text) {
        navigator.clipboard.writeText(text);
        showToast('Text copied!');
    }
}

function downloadText() {
    const text = convertedTextDiv?.innerText;
    if (text) {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transcript-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

function downloadPDF() {
    const text = convertedTextDiv?.innerText;
    if (text && window.jspdf) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text(text.substring(0, 5000), 10, 10);
        doc.save(`document-${Date.now()}.pdf`);
    } else {
        showToast('PDF generation not available', 'error');
    }
}

function downloadSRT() {
    const text = convertedTextDiv?.innerText;
    if (text) {
        const srt = `1\n00:00:00,000 --> 00:00:05,000\n${text.substring(0, 100)}\n\n`;
        const blob = new Blob([srt], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `subtitles-${Date.now()}.srt`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// ============================================
// Event Listeners
// ============================================
window.speechSynthesis?.addEventListener('voiceschanged', loadVoices);
if (languageSelect) languageSelect.addEventListener('change', loadVoices);
if (rateControl) rateControl.addEventListener('input', () => rateValue.textContent = rateControl.value);
if (pitchControl) pitchControl.addEventListener('input', () => pitchValue.textContent = pitchControl.value);
if (playPreviewBtn) playPreviewBtn.addEventListener('click', previewVoice);
if (convertBtn) convertBtn.addEventListener('click', () => currentMode === 'textToAudio' ? convertTextToAudio() : convertAudioToText());
if (resetBtn) resetBtn.addEventListener('click', resetAll);
if (downloadBtn) downloadBtn.addEventListener('click', downloadResult);
if (copyTextBtn) copyTextBtn.addEventListener('click', copyText);
if (downloadTxtBtn) downloadTxtBtn.addEventListener('click', downloadText);
if (downloadPdfBtn) downloadPdfBtn.addEventListener('click', downloadPDF);
if (downloadSrtBtn) downloadSrtBtn.addEventListener('click', downloadSRT);
if (checkGrammarBtn) checkGrammarBtn.addEventListener('click', checkGrammar);
if (clearTextBtn) clearTextBtn.addEventListener('click', () => { if(textInput) textInput.value = ''; updateCounters(); grammarSection.style.display = 'none'; });
if (recordAudioBtn) recordAudioBtn.addEventListener('click', startRecording);
if (stopRecordBtn) stopRecordBtn.addEventListener('click', stopRecording);
if (darkModeBtn) darkModeBtn.addEventListener('click', toggleDarkMode);
if (pageShareBtn) pageShareBtn.addEventListener('click', sharePage);
if (scrollUpBtn) scrollUpBtn.addEventListener('click', scrollToTop);
if (scrollDownBtn) scrollDownBtn.addEventListener('click', scrollToBottom);
if (historyToggleBtn) historyToggleBtn.addEventListener('click', toggleHistory);
if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', clearHistory);

// Conversion toggle buttons
document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        toggleMode(btn.dataset.mode);
    });
});

// Reaction buttons
document.querySelectorAll('.reaction-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const emoji = btn.dataset.emoji;
        if (emoji) {
            addReaction(emoji);
            btn.classList.add('active');
            setTimeout(() => btn.classList.remove('active'), 500);
        }
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
    if (scrollUpBtn) {
        scrollUpBtn.classList.toggle('hidden', window.scrollY <= 200);
    }
});

// Auto-save
if (textInput) {
    textInput.addEventListener('input', () => {
        updateCounters();
        if (autoSaveTimer) clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(saveDraft, 2000);
    });
}

// ============================================
// Initialize
// ============================================
function init() {
    updateCounters();
    loadStats();
    loadDraft();
    loadHistory();
    loadVoices();
    
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
        darkModeBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    }
    
    showToast('Audio-Text Converter ready!');
}

init();
