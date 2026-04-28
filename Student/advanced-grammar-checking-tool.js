/* ============================================
   ADVANCED GRAMMAR CHECKING TOOL - COMPLETE JS
   This file connects to Cloudflare Worker with Groq API
   ============================================ */

// ============================================
// Configuration
// ============================================
const TOOL_SLUG = 'advanced-grammar-checking-tool';
const TOOL_NAME = 'Advanced Grammar Checking Tool';
const CATEGORY = 'student';

// Cloudflare Worker URL - یہاں آپ کا worker API call کرے گا
// یہ وہی URL ہے جو آپ کے worker کو point کر رہی ہے
const WORKER_URL = 'https://advanced-grammar-checking-tool.uzairhameed01.workers.dev';

// Get or create user ID
let userId = localStorage.getItem('userId');
if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
}

// API Base URL for TiDB (آپ کا existing backend)
const API_BASE = '/api';

// ============================================
// DOM Elements
// ============================================
const textInput = document.getElementById('textInput');
const checkBtn = document.getElementById('checkBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const downloadTxtBtn = document.getElementById('downloadTxtBtn');
const shareResultsBtn = document.getElementById('shareResultsBtn');
const darkModeBtn = document.getElementById('darkModeBtn');
const listenBtn = document.getElementById('listenBtn');
const pageShareBtn = document.getElementById('pageShareBtn');
const scrollUpBtn = document.getElementById('scrollUpBtn');
const scrollDownBtn = document.getElementById('scrollDownBtn');
const resultsDiv = document.getElementById('results');
const issuesListDiv = document.getElementById('issuesList');
const summaryDiv = document.getElementById('summaryDiv');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const loadingOverlay = document.getElementById('loadingOverlay');
const autoSaveInfo = document.getElementById('autoSaveInfo');

// Counters
const wordCountSpan = document.getElementById('wordCount');
const charCountSpan = document.getElementById('charCount');
const issueCountSpan = document.getElementById('issueCount');
const scoreValueSpan = document.getElementById('scoreValue');
const scoreValueDisplay = document.getElementById('scoreValueDisplay');
const readabilityScoreSpan = document.getElementById('readabilityScore');
const usageCountSpan = document.getElementById('usageCount');

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
let currentResults = null;
let autoSaveTimer = null;

// ============================================
// API Calls (TiDB Integration - Your Existing APIs)
// ============================================

// Track usage when tool is used
async function trackUsage() {
    try {
        const response = await fetch(`${API_BASE}/usage/increment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tool_slug: TOOL_SLUG,
                tool_name: TOOL_NAME,
                category: CATEGORY,
                user_id: userId
            })
        });
        const data = await response.json();
        if (usageCountSpan) {
            usageCountSpan.textContent = data.count || (parseInt(usageCountSpan.textContent) + 1);
        }
        return data;
    } catch (error) {
        console.error('Usage tracking failed:', error);
        if (usageCountSpan) {
            const current = parseInt(usageCountSpan.textContent) || 0;
            usageCountSpan.textContent = current + 1;
        }
    }
}

// Add reaction
async function addReaction(emoji) {
    try {
        const response = await fetch(`${API_BASE}/reactions/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tool_slug: TOOL_SLUG,
                emoji: emoji,
                user_id: userId
            })
        });
        const data = await response.json();
        if (reactionCounts[emoji]) {
            reactionCounts[emoji].textContent = data.count;
        }
        showToast(`${getEmojiName(emoji)} reaction added!`);
        return data;
    } catch (error) {
        console.error('Reaction failed:', error);
        if (reactionCounts[emoji]) {
            const current = parseInt(reactionCounts[emoji].textContent) || 0;
            reactionCounts[emoji].textContent = current + 1;
        }
        showToast(`${getEmojiName(emoji)} reaction added!`);
    }
}

// Track share
async function trackShare(platform, shareType = 'tool') {
    try {
        await fetch(`${API_BASE}/shares/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tool_slug: TOOL_SLUG,
                platform: platform,
                share_type: shareType,
                user_id: userId
            })
        });
    } catch (error) {
        console.error('Share tracking failed:', error);
    }
}

// Load initial stats
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
        
    } catch (error) {
        console.error('Load stats failed:', error);
    }
}

// ============================================
// Grammar Check Function (Calls Cloudflare Worker)
// ============================================
async function checkGrammar() {
    const text = textInput.value.trim();
    
    if (text === '') {
        showToast('Please enter some text to check', 'error');
        return;
    }
    
    if (text.length > 5000) {
        showToast('Text exceeds 5000 character limit', 'error');
        return;
    }
    
    // Show loading
    loadingOverlay.classList.remove('hidden');
    checkBtn.disabled = true;
    
    // Increment usage count
    await trackUsage();
    
    try {
        // 🔥 IMPORTANT: Call your Cloudflare Worker - یہاں API key worker میں ہے
        const response = await fetch(`${WORKER_URL}/api/grammar-check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text })
        });
        
        const data = await response.json();
        currentResults = data;
        
        // Display results
        displayResults(data);
        
        // Auto-save draft
        saveDraft();
        
        showToast('Grammar check completed!', 'success');
        
    } catch (error) {
        console.error('Grammar check failed:', error);
        showToast('Grammar check failed. Please try again.', 'error');
        if (issuesListDiv) {
            issuesListDiv.innerHTML = `<div class="error-message">❌ Error: ${error.message}. Please make sure the worker is running.</div>`;
        }
    } finally {
        loadingOverlay.classList.add('hidden');
        checkBtn.disabled = false;
    }
}

function displayResults(data) {
    resultsDiv.classList.remove('hidden');
    
    // Update score displays
    const score = data.score || 85;
    if (scoreValueSpan) scoreValueSpan.textContent = score + '%';
    if (scoreValueDisplay) scoreValueDisplay.textContent = score + '%';
    
    // Update readability
    if (readabilityScoreSpan) {
        if (score >= 90) readabilityScoreSpan.textContent = 'Excellent';
        else if (score >= 70) readabilityScoreSpan.textContent = 'Good';
        else if (score >= 50) readabilityScoreSpan.textContent = 'Fair';
        else readabilityScoreSpan.textContent = 'Needs Work';
    }
    
    // Update issue count
    const issueCount = data.issues?.length || 0;
    if (issueCountSpan) issueCountSpan.textContent = issueCount;
    
    // Display issues
    displayIssues(data.issues || []);
    
    // Display summary
    if (summaryDiv) {
        summaryDiv.innerHTML = `<strong>📊 Summary:</strong> ${data.summary || 'Your text has been analyzed successfully.'}`;
    }
    
    // Score label
    const scoreLabel = document.getElementById('scoreLabel');
    if (scoreLabel) {
        if (score >= 90) scoreLabel.textContent = 'Excellent! Your writing is very good.';
        else if (score >= 70) scoreLabel.textContent = 'Good! Just a few improvements needed.';
        else if (score >= 50) scoreLabel.textContent = 'Fair. Some issues need attention.';
        else scoreLabel.textContent = 'Needs improvement. Review the suggestions below.';
    }
}

function displayIssues(issues) {
    if (!issuesListDiv) return;
    
    if (issues.length === 0) {
        issuesListDiv.innerHTML = '<div style="padding: 20px; text-align: center; background: #d4edda; border-radius: 12px; color: #155724;">✅ No issues found! Your text looks great.</div>';
        return;
    }
    
    let html = '';
    issues.forEach(issue => {
        let severityClass = '';
        if (issue.severity === 'error') severityClass = '';
        else if (issue.severity === 'warning') severityClass = 'warning';
        else severityClass = 'info';
        
        html += `
            <div class="issue-item ${severityClass}">
                <div class="issue-type">${(issue.type || 'grammar').toUpperCase()} ${issue.severity || 'info'}</div>
                <div>${issue.message || 'Issue found in your text'}</div>
                <div class="issue-suggestion">💡 ${issue.suggestion || 'Review this part carefully'}</div>
            </div>
        `;
    });
    issuesListDiv.innerHTML = html;
}

// ============================================
// Helper Functions
// ============================================
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

function showToast(message, type = 'success') {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    toast.style.background = type === 'error' ? '#f56565' : '#333';
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// ============================================
// Copy Function
// ============================================
async function copyCorrectedText() {
    const text = textInput.value;
    if (!text) {
        showToast('Nothing to copy', 'error');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(text);
        showToast('Text copied to clipboard!');
    } catch (error) {
        showToast('Failed to copy text', 'error');
    }
}

// ============================================
// Download Functions
// ============================================
function downloadAsTXT() {
    const text = textInput.value;
    if (!text) {
        showToast('Nothing to download', 'error');
        return;
    }
    
    const report = generateReport(text);
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grammar-report-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Report downloaded as TXT!');
}

function generateReport(text) {
    const score = document.getElementById('scoreValue')?.textContent || 'N/A';
    return `GRAMMAR CHECK REPORT
Generated: ${new Date().toLocaleString()}
Tool: Advanced Grammar Checking Tool

ORIGINAL TEXT:
${text}

SCORE: ${score}

ISSUES FOUND:
${currentResults?.issues?.map(i => `- [${i.type}] ${i.message}\n  Suggestion: ${i.suggestion}`).join('\n\n') || 'No issues found'}

SUMMARY: ${currentResults?.summary || 'Analysis completed successfully'}

--- End of Report ---`;
}

// ============================================
// Share Functions
// ============================================
function shareTool(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Advanced Grammar Checking Tool');
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${title}%20${url}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=${title}&body=Check out this tool: ${url}`;
            break;
    }
    
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
    } catch (error) {
        showToast('Failed to copy link', 'error');
    }
}

function shareResults() {
    const text = textInput.value;
    if (!text) {
        showToast('No text to share', 'error');
        return;
    }
    
    if (navigator.share) {
        navigator.share({
            title: 'Grammar Check Results',
            text: `My grammar score: ${document.getElementById('scoreValue')?.textContent || 'N/A'}`,
            url: window.location.href
        }).then(() => showToast('Shared successfully!'))
          .catch(() => showToast('Share cancelled'));
    } else {
        sharePage();
    }
}

// ============================================
// Theme Functions
// ============================================
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    darkModeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i> Light Mode' : '<i class="fas fa-moon"></i> Dark Mode';
    showToast(`${isDark ? 'Dark' : 'Light'} mode enabled!`);
}

function listenToText() {
    const text = textInput.value;
    if (!text) {
        showToast('No text to read', 'error');
        return;
    }
    
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
        showToast('Listening to text...');
    } else {
        showToast('Text-to-speech not supported', 'error');
    }
}

// ============================================
// Auto-Save Functions
// ============================================
function saveDraft() {
    const text = textInput.value;
    if (text) {
        localStorage.setItem(`${TOOL_SLUG}_draft`, text);
        localStorage.setItem(`${TOOL_SLUG}_draft_time`, Date.now());
        autoSaveInfo.classList.add('show');
        setTimeout(() => {
            autoSaveInfo.classList.remove('show');
        }, 2000);
    }
}

function loadDraft() {
    const draft = localStorage.getItem(`${TOOL_SLUG}_draft`);
    const draftTime = localStorage.getItem(`${TOOL_SLUG}_draft_time`);
    
    if (draft && draftTime) {
        const timeAgo = Math.round((Date.now() - parseInt(draftTime)) / 60000);
        if (timeAgo < 1440) {
            const restore = confirm(`You have a saved draft from ${timeAgo} minutes ago. Restore it?`);
            if (restore) {
                textInput.value = draft;
                updateCounters();
                showToast('Draft restored!');
            }
        }
    }
}

// ============================================
// Counter Functions
// ============================================
function updateCounters() {
    const text = textInput.value;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const chars = text.length;
    
    if (wordCountSpan) wordCountSpan.textContent = words;
    if (charCountSpan) charCountSpan.textContent = chars;
    
    // Character limit warning
    const charWarning = document.getElementById('charWarning');
    if (chars > 4500 && charWarning) {
        charWarning.classList.remove('hidden');
        if (chars > 5000) {
            textInput.value = text.substring(0, 5000);
            updateCounters();
            showToast('Character limit reached (5000 max)', 'error');
        }
    } else if (charWarning) {
        charWarning.classList.add('hidden');
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
// Event Listeners
// ============================================
if (textInput) {
    textInput.addEventListener('input', () => {
        updateCounters();
        if (autoSaveTimer) clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(() => saveDraft(), 3000);
    });
}

if (checkBtn) checkBtn.addEventListener('click', checkGrammar);
if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        textInput.value = '';
        updateCounters();
        if (resultsDiv) resultsDiv.classList.add('hidden');
        showToast('Text cleared!');
    });
}
if (copyBtn) copyBtn.addEventListener('click', copyCorrectedText);
if (downloadTxtBtn) downloadTxtBtn.addEventListener('click', downloadAsTXT);
if (shareResultsBtn) shareResultsBtn.addEventListener('click', shareResults);
if (darkModeBtn) darkModeBtn.addEventListener('click', toggleDarkMode);
if (listenBtn) listenBtn.addEventListener('click', listenToText);
if (pageShareBtn) pageShareBtn.addEventListener('click', sharePage);
if (scrollUpBtn) scrollUpBtn.addEventListener('click', scrollToTop);
if (scrollDownBtn) scrollDownBtn.addEventListener('click', scrollToBottom);

// Reaction buttons
document.querySelectorAll('.reaction-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const emoji = btn.getAttribute('data-emoji');
        if (emoji) {
            addReaction(emoji);
            btn.classList.add('active');
            setTimeout(() => btn.classList.remove('active'), 500);
        }
    });
});

// Social share buttons
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const platform = btn.getAttribute('data-emoji');
        if (platform) {
            shareTool(platform);
        }
    });
});

// Scroll button visibility
window.addEventListener('scroll', () => {
    if (scrollUpBtn) {
        if (window.scrollY > 200) {
            scrollUpBtn.classList.remove('hidden');
        } else {
            scrollUpBtn.classList.add('hidden');
        }
    }
});

// Check for dark mode preference
const savedDarkMode = localStorage.getItem('darkMode');
if (savedDarkMode === 'true') {
    document.body.classList.add('dark-mode');
    if (darkModeBtn) darkModeBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
}

// ============================================
// Initialize
// ============================================
function init() {
    updateCounters();
    loadStats();
    loadDraft();
    showToast('Grammar Checker ready!');
}

init();
