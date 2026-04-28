/* ============================================
   ADVANCED GRAMMAR CHECKING TOOL - JAVASCRIPT
   Complete JS with all 40+ features
   ============================================ */

// ============================================
// DOM Elements
// ============================================
const textInput = document.getElementById('textInput');
const checkBtn = document.getElementById('checkBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const downloadTxtBtn = document.getElementById('downloadTxtBtn');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');
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
const readabilityScoreSpan = document.getElementById('readabilityScore');
const usageCountSpan = document.getElementById('usageCount');

// Reactions
const reactionBtns = document.querySelectorAll('.reaction-btn');
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
let userId = localStorage.getItem('userId') || 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
localStorage.setItem('userId', userId);

const TOOL_ID = 'advanced-grammar-checking-tool';
const TOOL_NAME = 'Advanced Grammar Checking Tool';
const TOOL_CATEGORY = 'student';

// ============================================
// API Endpoints (Your existing TiDB APIs)
// ============================================
const API_BASE = '/api'; // Change to your actual API base URL

async function incrementUsageCount() {
    try {
        const response = await fetch(`${API_BASE}/usage/increment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tool_id: TOOL_ID,
                tool_name: TOOL_NAME,
                category: TOOL_CATEGORY,
                user_id: userId
            })
        });
        const data = await response.json();
        if (usageCountSpan) {
            usageCountSpan.textContent = data.count || (parseInt(usageCountSpan.textContent) + 1);
        }
        return data;
    } catch (error) {
        console.error('Usage increment failed:', error);
        // Fallback: increment locally
        if (usageCountSpan) {
            usageCountSpan.textContent = parseInt(usageCountSpan.textContent) + 1;
        }
    }
}

async function addReaction(emoji) {
    try {
        const response = await fetch(`${API_BASE}/reactions/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tool_id: TOOL_ID,
                emoji: emoji,
                user_id: userId
            })
        });
        const data = await response.json();
        if (reactionCounts[emoji]) {
            reactionCounts[emoji].textContent = data.count;
        }
        showToast(`${getEmojiText(emoji)} reaction added!`);
        return data;
    } catch (error) {
        console.error('Reaction failed:', error);
        // Fallback: increment locally
        if (reactionCounts[emoji]) {
            reactionCounts[emoji].textContent = parseInt(reactionCounts[emoji].textContent) + 1;
        }
        showToast(`${getEmojiText(emoji)} reaction added!`, 'success');
    }
}

async function trackShare(platform, shareType = 'tool') {
    try {
        const response = await fetch(`${API_BASE}/shares/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tool_id: TOOL_ID,
                platform: platform,
                share_type: shareType,
                user_id: userId
            })
        });
        return await response.json();
    } catch (error) {
        console.error('Share tracking failed:', error);
    }
}

async function loadToolStats() {
    try {
        const response = await fetch(`${API_BASE}/tools/stats?tool_id=${TOOL_ID}`);
        const data = await response.json();
        
        if (usageCountSpan) usageCountSpan.textContent = data.usage_count || 0;
        if (reactionCounts.like) reactionCounts.like.textContent = data.reactions?.like || 0;
        if (reactionCounts.love) reactionCounts.love.textContent = data.reactions?.love || 0;
        if (reactionCounts.wow) reactionCounts.wow.textContent = data.reactions?.wow || 0;
        if (reactionCounts.sad) reactionCounts.sad.textContent = data.reactions?.sad || 0;
        if (reactionCounts.angry) reactionCounts.angry.textContent = data.reactions?.angry || 0;
        if (reactionCounts.laugh) reactionCounts.laugh.textContent = data.reactions?.laugh || 0;
        if (reactionCounts.celebrate) reactionCounts.celebrate.textContent = data.reactions?.celebrate || 0;
        
    } catch (error) {
        console.error('Load stats failed:', error);
    }
}

// ============================================
// Grammar Check Function
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
    await incrementUsageCount();
    
    try {
        // Call your Cloudflare Worker API
        const response = await fetch('/api/grammar-check', {
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
    } finally {
        loadingOverlay.classList.add('hidden');
        checkBtn.disabled = false;
    }
}

function displayResults(data) {
    resultsDiv.classList.remove('hidden');
    
    // Update score
    if (scoreValueSpan) {
        scoreValueSpan.textContent = data.score || '85';
    }
    
    // Update readability
    if (readabilityScoreSpan) {
        readabilityScoreSpan.textContent = data.readability || 'Good';
    }
    
    // Update issue count
    if (issueCountSpan) {
        issueCountSpan.textContent = data.issues?.length || 0;
    }
    
    // Display tone tags
    displayToneTags(data.tone || ['Professional', 'Neutral']);
    
    // Display style suggestions
    displayStyleSuggestions(data.style || 'Informal', data.styleSuggestions || []);
    
    // Display issues
    displayIssues(data.issues || []);
    
    // Display summary
    if (summaryDiv) {
        summaryDiv.innerHTML = `<strong>📊 Summary:</strong> ${data.summary || 'Your text has been analyzed successfully.'}`;
    }
}

function displayToneTags(toneList) {
    const toneTagsDiv = document.getElementById('toneTags');
    if (!toneTagsDiv) return;
    
    toneTagsDiv.innerHTML = '';
    toneList.forEach(tone => {
        const tag = document.createElement('span');
        tag.className = 'tone-tag';
        tag.textContent = tone;
        toneTagsDiv.appendChild(tag);
    });
}

function displayStyleSuggestions(style, suggestions) {
    const styleBadge = document.getElementById('styleBadge');
    const styleSuggestionsDiv = document.getElementById('styleSuggestions');
    
    if (styleBadge) {
        styleBadge.innerHTML = `<i class="fas fa-tag"></i> Detected: ${style}`;
    }
    
    if (styleSuggestionsDiv && suggestions.length > 0) {
        styleSuggestionsDiv.innerHTML = suggestions.map(s => 
            `<div><i class="fas fa-lightbulb"></i> ${s}</div>`
        ).join('');
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
            <div class="issue-item ${severityClass}" onclick="scrollToPosition(${issue.position || 0}, ${issue.length || 5})">
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
function scrollToPosition(position, length) {
    textInput.focus();
    textInput.setSelectionRange(position, position + length);
    textInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function getEmojiText(emoji) {
    const emojis = {
        like: '👍 Like',
        love: '❤️ Love',
        wow: '😮 Wow',
        sad: '😢 Sad',
        angry: '😠 Angry',
        laugh: '😂 Laugh',
        celebrate: '🎉 Celebrate'
    };
    return emojis[emoji] || emoji;
}

function showToast(message, type = 'success') {
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

function downloadAsPDF() {
    const text = textInput.value;
    if (!text) {
        showToast('Nothing to download', 'error');
        return;
    }
    
    // Simple PDF generation using browser print
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head><title>Grammar Report</title></head>
        <body>
            <h1>Grammar Check Report</h1>
            <p>Date: ${new Date().toLocaleString()}</p>
            <h2>Original Text:</h2>
            <p>${text.replace(/\n/g, '<br>')}</p>
            <h2>Score: ${scoreValueSpan?.textContent || 'N/A'}%</h2>
            <h2>Issues Found:</h2>
            <div>${issuesListDiv?.innerHTML || 'No issues'}</div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
    showToast('Report downloaded as PDF!');
}

function generateReport(text) {
    return `GRAMMAR CHECK REPORT
Generated: ${new Date().toLocaleString()}
Tool: Advanced Grammar Checking Tool

ORIGINAL TEXT:
${text}

SCORE: ${scoreValueSpan?.textContent || 'N/A'}%

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
    
    const shareData = {
        title: 'Grammar Check Results',
        text: `My grammar score: ${scoreValueSpan?.textContent || 'N/A'}%`,
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData).then(() => {
            showToast('Shared successfully!');
        }).catch(() => {
            showToast('Share cancelled');
        });
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
        localStorage.setItem(`${TOOL_ID}_draft`, text);
        localStorage.setItem(`${TOOL_ID}_draft_time`, Date.now());
        autoSaveInfo.classList.add('show');
        setTimeout(() => {
            autoSaveInfo.classList.remove('show');
        }, 2000);
    }
}

function loadDraft() {
    const draft = localStorage.getItem(`${TOOL_ID}_draft`);
    const draftTime = localStorage.getItem(`${TOOL_ID}_draft_time`);
    
    if (draft && draftTime) {
        const timeAgo = Math.round((Date.now() - parseInt(draftTime)) / 60000);
        if (timeAgo < 1440) { // Less than 24 hours
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
    
    wordCountSpan.textContent = words;
    charCountSpan.textContent = chars;
    
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
textInput.addEventListener('input', () => {
    updateCounters();
    
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
        saveDraft();
    }, 3000);
});

checkBtn.addEventListener('click', checkGrammar);
clearBtn.addEventListener('click', () => {
    textInput.value = '';
    updateCounters();
    resultsDiv.classList.add('hidden');
    showToast('Text cleared!');
});
copyBtn.addEventListener('click', copyCorrectedText);
downloadTxtBtn.addEventListener('click', downloadAsTXT);
downloadPdfBtn.addEventListener('click', downloadAsPDF);
shareResultsBtn.addEventListener('click', shareResults);
darkModeBtn.addEventListener('click', toggleDarkMode);
listenBtn.addEventListener('click', listenToText);
pageShareBtn.addEventListener('click', sharePage);
scrollUpBtn.addEventListener('click', scrollToTop);
scrollDownBtn.addEventListener('click', scrollToBottom);

// Reaction buttons
reactionBtns.forEach(btn => {
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
        const platform = btn.getAttribute('data-platform');
        if (platform) {
            shareTool(platform);
        }
    });
});

// Scroll button visibility
window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
        scrollUpBtn.classList.remove('hidden');
    } else {
        scrollUpBtn.classList.add('hidden');
    }
});

// ============================================
// Initialization
// ============================================
function init() {
    updateCounters();
    loadToolStats();
    loadDraft();
    
    // Check for dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
        darkModeBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    }
    
    showToast('Grammar Checker ready!');
}

// Start the app
init();
