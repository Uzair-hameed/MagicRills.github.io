/* ============================================
   ADVANCED GRAMMAR CHECKING TOOL - COMPLETE JS
   Grok API Integration (via Cloudflare Worker)
   ============================================ */

// ============================================
// Configuration
// ============================================
const TOOL_SLUG = 'advanced-grammar-checking-tool';
const TOOL_NAME = 'Advanced Grammar Checking Tool';
const WORKER_URL = 'https://advanced-grammar-checking-tool.uzairhameed01.workers.dev';

let userId = localStorage.getItem('userId');
if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
}

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
const neonModeBtn = document.getElementById('neonModeBtn');
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
const applyBtn = document.getElementById('applySuggestionsBtn');

const wordCountSpan = document.getElementById('wordCount');
const charCountSpan = document.getElementById('charCount');
const issueCountSpan = document.getElementById('issueCount');
const scoreValueSpan = document.getElementById('scoreValue');
const scoreValueDisplay = document.getElementById('scoreValueDisplay');
const scoreGraphBar = document.getElementById('scoreGraphBar');
const usageCountSpan = document.getElementById('usageCount');
const viewsCountSpan = document.getElementById('viewsCount');
const sharesCountSpan = document.getElementById('sharesCount');
const followersCountSpan = document.getElementById('followersCount');

const reactionCounts = {
    like: document.getElementById('likeCount'),
    love: document.getElementById('loveCount'),
    wow: document.getElementById('wowCount'),
    sad: document.getElementById('sadCount'),
    angry: document.getElementById('angryCount'),
    laugh: document.getElementById('laughCount'),
    celebrate: document.getElementById('celebrateCount')
};

let currentResults = null;
let autoSaveTimer = null;
let isChecking = false;

// ============================================
// Typewriter Animation
// ============================================
const typewriterTexts = [
    'Check your grammar instantly...',
    'AI-powered with Grok...',
    'Professional writing assistant...',
    'Real-time grammar analysis...'
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterElement = document.getElementById('typewriterText');

function typewriterEffect() {
    const currentText = typewriterTexts[textIndex];
    
    if (isDeleting) {
        typewriterElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let speed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentText.length) {
        speed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typewriterTexts.length;
        speed = 500;
    }
    
    setTimeout(typewriterEffect, speed);
}

setTimeout(typewriterEffect, 1000);

// ============================================
// LOCAL STORAGE STATS
// ============================================
function trackUsage() {
    let localUsage = parseInt(localStorage.getItem(`${TOOL_SLUG}_usage`)) || 0;
    localUsage++;
    localStorage.setItem(`${TOOL_SLUG}_usage`, localUsage);
    if (usageCountSpan) usageCountSpan.textContent = localUsage;
    return localUsage;
}

function addReaction(emoji) {
    const key = `${TOOL_SLUG}_reaction_${emoji}`;
    let count = parseInt(localStorage.getItem(key)) || 0;
    count++;
    localStorage.setItem(key, count);
    if (reactionCounts[emoji]) {
        reactionCounts[emoji].textContent = count;
    }
    showToast(`${getEmojiName(emoji)} reaction added! 🎉`, 'success');
    return count;
}

function trackShare(platform, shareType = 'tool') {
    let localShares = parseInt(localStorage.getItem(`${TOOL_SLUG}_shares`)) || 0;
    localShares++;
    localStorage.setItem(`${TOOL_SLUG}_shares`, localShares);
    if (sharesCountSpan) sharesCountSpan.textContent = localShares;
    return localShares;
}

function loadStats() {
    const usage = parseInt(localStorage.getItem(`${TOOL_SLUG}_usage`)) || 0;
    const views = parseInt(localStorage.getItem(`${TOOL_SLUG}_views`)) || 0;
    const shares = parseInt(localStorage.getItem(`${TOOL_SLUG}_shares`)) || 0;
    const followers = parseInt(localStorage.getItem(`${TOOL_SLUG}_followers`)) || 0;
    
    if (usageCountSpan) usageCountSpan.textContent = usage;
    if (viewsCountSpan) viewsCountSpan.textContent = views;
    if (sharesCountSpan) sharesCountSpan.textContent = shares;
    if (followersCountSpan) followersCountSpan.textContent = followers;
    
    const emojis = ['like', 'love', 'wow', 'sad', 'angry', 'laugh', 'celebrate'];
    emojis.forEach(emoji => {
        const count = parseInt(localStorage.getItem(`${TOOL_SLUG}_reaction_${emoji}`)) || 0;
        if (reactionCounts[emoji]) {
            reactionCounts[emoji].textContent = count;
        }
    });
}

function trackView() {
    let views = parseInt(localStorage.getItem(`${TOOL_SLUG}_views`)) || 0;
    views++;
    localStorage.setItem(`${TOOL_SLUG}_views`, views);
    if (viewsCountSpan) viewsCountSpan.textContent = views;
}

// ============================================
// 🔥 MAIN GRAMMAR CHECK - GROK API
// ============================================
async function checkGrammar() {
    const text = textInput.value.trim();
    
    if (text === '') {
        showToast('Please enter some text to check ✍️', 'error');
        return;
    }
    
    if (text.length > 5000) {
        showToast('Text exceeds 5000 character limit ⚠️', 'error');
        return;
    }
    
    if (isChecking) return;
    isChecking = true;
    
    loadingOverlay.classList.remove('hidden');
    checkBtn.disabled = true;
    checkBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing with Grok AI...';
    
    trackUsage();
    
    try {
        // 🚀 CALL GROK API VIA WORKER
        const response = await fetch(`${WORKER_URL}/api/grammar-check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                text: text,
                tool_slug: TOOL_SLUG,
                user_id: userId
            })
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success === false) {
            throw new Error(data.error || 'API returned error');
        }
        
        // ✅ Store API results
        currentResults = {
            score: data.score || 85,
            issues: data.issues || [],
            summary: data.summary || 'Analysis complete',
            fullCorrection: data.fullCorrection || text
        };
        
        displayResults(currentResults);
        showToast('Grammar check completed with Grok AI! ✅', 'success');
        
    } catch (error) {
        console.error('❌ Grok API Error:', error);
        showToast('Grok API Error. Using offline mode. 🔄', 'warning');
        
        // 🔄 FALLBACK: Use comprehensive client-side check
        const fallbackResults = comprehensiveGrammarCheck(text);
        currentResults = fallbackResults;
        displayResults(fallbackResults);
        
    } finally {
        loadingOverlay.classList.add('hidden');
        checkBtn.disabled = false;
        checkBtn.innerHTML = '<i class="fas fa-magic"></i> Check Grammar';
        isChecking = false;
        saveDraft();
    }
}

// ============================================
// 📊 DISPLAY RESULTS
// ============================================
function displayResults(data) {
    resultsDiv.classList.remove('hidden');
    
    const score = data.score || 85;
    if (scoreValueSpan) scoreValueSpan.textContent = score + '%';
    if (scoreValueDisplay) scoreValueDisplay.textContent = score + '%';
    if (scoreGraphBar) {
        scoreGraphBar.style.width = score + '%';
    }
    
    const issueCount = data.issues?.length || 0;
    if (issueCountSpan) issueCountSpan.textContent = issueCount;
    
    displayIssues(data.issues || [], data.fullCorrection);
    
    if (summaryDiv) {
        summaryDiv.innerHTML = `<strong>📊 Summary:</strong> ${data.summary || 'Your text has been analyzed successfully.'}`;
    }
    
    const scoreLabel = document.getElementById('scoreLabel');
    if (scoreLabel) {
        if (score >= 90) scoreLabel.textContent = '🌟 Excellent! Your writing is very good.';
        else if (score >= 75) scoreLabel.textContent = '👍 Good! Just a few improvements needed.';
        else if (score >= 60) scoreLabel.textContent = '📖 Fair. Some issues need attention.';
        else scoreLabel.textContent = '🔧 Needs improvement. Review the suggestions below.';
    }
}

// ============================================
// 🎨 DISPLAY ISSUES WITH HIGHLIGHTS
// ============================================
function displayIssues(issues, fullCorrection) {
    if (!issuesListDiv) return;
    
    if (!issues || issues.length === 0) {
        issuesListDiv.innerHTML = `
            <div style="padding: 15px; text-align: center; background: rgba(72, 187, 120, 0.15); border-radius: 10px; border: 1px solid #48bb78; color: #48bb78;">
                <i class="fas fa-check-circle" style="font-size: 1.3rem;"></i>
                <p style="margin-top: 5px;">✅ No issues found! Your text looks great.</p>
            </div>
        `;
        return;
    }
    
    const originalText = textInput.value;
    
    // Highlight errors in original text
    let highlightedText = highlightErrors(originalText, issues);
    
    let html = '';
    
    // ============================================
    // ORIGINAL TEXT WITH HIGHLIGHTS
    // ============================================
    html += `
        <div style="padding: 14px 16px; background: rgba(245, 101, 101, 0.05); border: 1px solid #f56565; border-radius: 10px; margin-bottom: 14px;">
            <div style="color: #f56565; font-weight: 600; font-size: 0.8rem; margin-bottom: 4px;">🔴 Original Text (errors highlighted)</div>
            <div style="color: var(--text-primary); font-size: 0.95rem; line-height: 1.8; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 6px; white-space: pre-wrap; word-break: break-word;">
                ${highlightedText}
            </div>
        </div>
    `;
    
    // ============================================
    // CORRECTED SENTENCE
    // ============================================
    if (fullCorrection && fullCorrection !== originalText) {
        html += `
            <div style="padding: 14px 16px; background: rgba(105, 240, 174, 0.08); border: 1px solid #69f0ae; border-radius: 10px; margin-bottom: 14px;">
                <div style="color: #69f0ae; font-weight: 600; font-size: 0.8rem; margin-bottom: 4px;">✅ Corrected Sentence</div>
                <div style="color: var(--text-primary); font-size: 0.95rem; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 6px; white-space: pre-wrap; word-break: break-word;">
                    ${escapeHtml(fullCorrection)}
                </div>
            </div>
        `;
    }
    
    // ============================================
    // ISSUES LIST - Grouped
    // ============================================
    const grouped = { error: [], warning: [], info: [] };
    issues.forEach(issue => {
        const severity = issue.severity || 'info';
        if (grouped[severity]) grouped[severity].push(issue);
        else grouped.info.push(issue);
    });
    
    // Errors
    if (grouped.error.length > 0) {
        html += `<div style="margin: 10px 0 6px; color: #f56565; font-weight: 700; font-size: 0.9rem;">🔴 ERRORS (${grouped.error.length})</div>`;
        grouped.error.forEach((issue, i) => {
            html += createDetailedIssueHTML(issue, i, 'error');
        });
    }
    
    // Warnings
    if (grouped.warning.length > 0) {
        html += `<div style="margin: 12px 0 6px; color: #ed8936; font-weight: 700; font-size: 0.9rem;">🟡 WARNINGS (${grouped.warning.length})</div>`;
        grouped.warning.forEach((issue, i) => {
            html += createDetailedIssueHTML(issue, i, 'warning');
        });
    }
    
    // Suggestions
    if (grouped.info.length > 0) {
        html += `<div style="margin: 12px 0 6px; color: #4299e1; font-weight: 700; font-size: 0.9rem;">🔵 SUGGESTIONS (${grouped.info.length})</div>`;
        grouped.info.forEach((issue, i) => {
            html += createDetailedIssueHTML(issue, i, 'info');
        });
    }
    
    issuesListDiv.innerHTML = html;
}

// ============================================
// 🔍 HIGHLIGHT ERRORS
// ============================================
function highlightErrors(text, issues) {
    let highlighted = text;
    
    const errorContexts = issues.filter(i => i.context && i.context.length > 0);
    errorContexts.sort((a, b) => (b.context || '').length - (a.context || '').length);
    
    errorContexts.forEach(issue => {
        const context = issue.context || '';
        if (context && highlighted.includes(context)) {
            const severity = issue.severity || 'info';
            const colors = {
                error: '#f56565',
                warning: '#ed8936',
                info: '#4299e1'
            };
            const color = colors[severity] || '#4299e1';
            
            const highlightedSpan = `<span style="background: ${color}33; color: ${color}; padding: 2px 6px; border-radius: 4px; border-bottom: 2px solid ${color}; font-weight: 700; text-decoration: underline wavy ${color};">${escapeHtml(context)}</span>`;
            highlighted = highlighted.replace(context, highlightedSpan);
        }
    });
    
    return highlighted;
}

// ============================================
// 🎯 CREATE DETAILED ISSUE HTML
// ============================================
function createDetailedIssueHTML(issue, index, severity) {
    const colors = {
        error: { border: '#f56565', icon: '🔴', bg: 'rgba(245, 101, 101, 0.08)', text: '#f56565' },
        warning: { border: '#ed8936', icon: '🟡', bg: 'rgba(237, 137, 54, 0.08)', text: '#ed8936' },
        info: { border: '#4299e1', icon: '🔵', bg: 'rgba(66, 153, 225, 0.08)', text: '#4299e1' }
    };
    const color = colors[severity] || colors.info;
    
    let issueType = (issue.type || 'grammar').toUpperCase();
    let wrongText = issue.context || '';
    let correctText = issue.correction || '';
    
    return `
        <div class="issue-item ${severity === 'error' ? '' : severity}" 
             style="border-left-color: ${color.border}; background: ${color.bg}; border-left-width: 4px; border-left-style: solid; padding: 12px 16px; margin-bottom: 8px; border-radius: 8px;">
            
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 5px;">
                <div class="issue-type" style="color: ${color.border}; font-weight: 700; font-size: 0.8rem;">
                    ${color.icon} ${issueType}
                    <span style="color: ${color.border}; font-weight: normal; font-size: 0.7rem; background: ${color.border}22; padding: 1px 8px; border-radius: 12px;">${severity}</span>
                </div>
                <span style="font-size: 0.7rem; color: var(--text-muted);">#${index + 1}</span>
            </div>
            
            <div class="issue-message" style="font-size: 0.9rem; color: var(--text-primary); margin: 4px 0 3px 0;">
                ${escapeHtml(issue.message || 'Issue found')}
            </div>
            
            ${wrongText ? `
                <div style="margin: 4px 0; padding: 4px 10px; background: rgba(245, 101, 101, 0.1); border-left: 3px solid #f56565; border-radius: 4px;">
                    <span style="color: #f56565; font-weight: 600; font-size: 0.75rem;">❌ Wrong:</span>
                    <span style="color: var(--text-primary); font-size: 0.85rem; font-weight: 600;">"${escapeHtml(wrongText)}"</span>
                </div>
            ` : ''}
            
            ${correctText && correctText !== wrongText ? `
                <div style="margin: 4px 0; padding: 4px 10px; background: rgba(105, 240, 174, 0.1); border-left: 3px solid #69f0ae; border-radius: 4px;">
                    <span style="color: #69f0ae; font-weight: 600; font-size: 0.75rem;">✅ Correct:</span>
                    <span style="color: #69f0ae; font-size: 0.85rem; font-weight: 600;">"${escapeHtml(correctText)}"</span>
                </div>
            ` : ''}
            
            <div class="issue-suggestion" style="margin-top: 4px; padding: 4px 8px; background: rgba(105, 240, 174, 0.05); border-radius: 4px; color: var(--text-secondary); font-size: 0.85rem;">
                💡 ${escapeHtml(issue.suggestion || 'Review this part')}
            </div>
        </div>
    `;
}

// ============================================
// 🆘 COMPREHENSIVE GRAMMAR CHECK - FALLBACK
// ============================================
function comprehensiveGrammarCheck(text) {
    const issues = [];
    let fullCorrection = text;
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    
    // Subject-Verb Agreement
    const verbPairs = [
        { base: 'do', third: 'does', plural: 'do' },
        { base: 'go', third: 'goes', plural: 'go' },
        { base: 'have', third: 'has', plural: 'have' },
        { base: 'say', third: 'says', plural: 'say' },
        { base: 'make', third: 'makes', plural: 'make' },
        { base: 'take', third: 'takes', plural: 'take' },
        { base: 'come', third: 'comes', plural: 'come' },
        { base: 'see', third: 'sees', plural: 'see' },
        { base: 'know', third: 'knows', plural: 'know' },
        { base: 'get', third: 'gets', plural: 'get' },
        { base: 'give', third: 'gives', plural: 'give' },
        { base: 'find', third: 'finds', plural: 'find' },
        { base: 'think', third: 'thinks', plural: 'think' },
        { base: 'tell', third: 'tells', plural: 'tell' },
        { base: 'show', third: 'shows', plural: 'show' },
        { base: 'try', third: 'tries', plural: 'try' },
        { base: 'keep', third: 'keeps', plural: 'keep' },
        { base: 'leave', third: 'leaves', plural: 'leave' },
        { base: 'call', third: 'calls', plural: 'call' },
        { base: 'ask', third: 'asks', plural: 'ask' },
        { base: 'help', third: 'helps', plural: 'help' },
        { base: 'talk', third: 'talks', plural: 'talk' },
        { base: 'use', third: 'uses', plural: 'use' },
        { base: 'want', third: 'wants', plural: 'want' },
        { base: 'look', third: 'looks', plural: 'look' },
        { base: 'work', third: 'works', plural: 'work' },
        { base: 'play', third: 'plays', plural: 'play' },
        { base: 'run', third: 'runs', plural: 'run' },
        { base: 'move', third: 'moves', plural: 'move' },
        { base: 'like', third: 'likes', plural: 'like' },
        { base: 'live', third: 'lives', plural: 'live' },
        { base: 'believe', third: 'believes', plural: 'believe' },
        { base: 'hold', third: 'holds', plural: 'hold' },
        { base: 'bring', third: 'brings', plural: 'bring' },
        { base: 'write', third: 'writes', plural: 'write' },
        { base: 'read', third: 'reads', plural: 'read' },
        { base: 'understand', third: 'understands', plural: 'understand' },
        { base: 'remember', third: 'remembers', plural: 'remember' },
        { base: 'consider', third: 'considers', plural: 'consider' },
        { base: 'continue', third: 'continues', plural: 'continue' },
        { base: 'decide', third: 'decides', plural: 'decide' },
        { base: 'expect', third: 'expects', plural: 'expect' },
        { base: 'feel', third: 'feels', plural: 'feel' },
        { base: 'follow', third: 'follows', plural: 'follow' },
        { base: 'happen', third: 'happens', plural: 'happen' },
        { base: 'include', third: 'includes', plural: 'include' },
        { base: 'learn', third: 'learns', plural: 'learn' },
        { base: 'offer', third: 'offers', plural: 'offer' },
        { base: 'provide', third: 'provides', plural: 'provide' },
        { base: 'reach', third: 'reaches', plural: 'reach' },
        { base: 'remain', third: 'remains', plural: 'remain' },
        { base: 'seem', third: 'seems', plural: 'seem' },
        { base: 'serve', third: 'serves', plural: 'serve' },
        { base: 'stand', third: 'stands', plural: 'stand' },
        { base: 'stay', third: 'stays', plural: 'stay' },
        { base: 'turn', third: 'turns', plural: 'turn' },
        { base: 'walk', third: 'walks', plural: 'walk' },
        { base: 'eat', third: 'eats', plural: 'eat' },
        { base: 'drink', third: 'drinks', plural: 'drink' },
        { base: 'sleep', third: 'sleeps', plural: 'sleep' },
        { base: 'study', third: 'studies', plural: 'study' },
        { base: 'teach', third: 'teaches', plural: 'teach' },
        { base: 'meet', third: 'meets', plural: 'meet' }
    ];
    
    const thirdPersonSubjects = ['he', 'she', 'it', 'this', 'that', 'everyone', 'someone', 'anyone', 'no one', 'each', 'either', 'neither'];
    const pluralSubjects = ['they', 'we', 'you', 'these', 'those', 'both', 'few', 'many', 'several'];
    
    sentences.forEach(sentence => {
        let sentenceCorrection = sentence;
        const lowerSentence = sentence.toLowerCase();
        
        verbPairs.forEach(pair => {
            // I + third person verb
            const patternI = new RegExp(`\\bi\\s+${pair.third}\\b`, 'gi');
            if (patternI.test(lowerSentence)) {
                const match = sentence.match(new RegExp(`\\bi\\s+${pair.third}\\b`, 'gi'));
                if (match) {
                    const wrongPhrase = match[0];
                    const correctPhrase = `I ${pair.plural}`;
                    const correction = sentence.replace(wrongPhrase, correctPhrase);
                    
                    issues.push({
                        type: 'grammar',
                        severity: 'error',
                        message: `"I" should use "${pair.plural}" not "${pair.third}"`,
                        suggestion: `Use "${pair.plural}" with "I"`,
                        context: wrongPhrase,
                        correction: correctPhrase,
                        fullCorrection: correction
                    });
                    sentenceCorrection = correction;
                }
            }
            
            // Third person + base verb
            thirdPersonSubjects.forEach(subject => {
                const pattern = new RegExp(`\\b${subject}\\s+${pair.base}\\b`, 'gi');
                if (pattern.test(lowerSentence)) {
                    const match = sentence.match(new RegExp(`\\b${subject}\\s+${pair.base}\\b`, 'gi'));
                    if (match) {
                        const wrongPhrase = match[0];
                        const correctPhrase = `${subject} ${pair.third}`;
                        const correction = sentence.replace(wrongPhrase, correctPhrase);
                        
                        issues.push({
                            type: 'grammar',
                            severity: 'error',
                            message: `"${subject}" should use "${pair.third}" not "${pair.base}"`,
                            suggestion: `Use "${pair.third}" with "${subject}"`,
                            context: wrongPhrase,
                            correction: correctPhrase,
                            fullCorrection: correction
                        });
                        sentenceCorrection = correction;
                    }
                }
            });
            
            // Plural + third person verb
            pluralSubjects.forEach(subject => {
                const pattern = new RegExp(`\\b${subject}\\s+${pair.third}\\b`, 'gi');
                if (pattern.test(lowerSentence)) {
                    const match = sentence.match(new RegExp(`\\b${subject}\\s+${pair.third}\\b`, 'gi'));
                    if (match) {
                        const wrongPhrase = match[0];
                        const correctPhrase = `${subject} ${pair.plural}`;
                        const correction = sentence.replace(wrongPhrase, correctPhrase);
                        
                        issues.push({
                            type: 'grammar',
                            severity: 'error',
                            message: `"${subject}" should use "${pair.plural}" not "${pair.third}"`,
                            suggestion: `Use "${pair.plural}" with "${subject}"`,
                            context: wrongPhrase,
                            correction: correctPhrase,
                            fullCorrection: correction
                        });
                        sentenceCorrection = correction;
                    }
                }
            });
        });
        
        if (sentenceCorrection !== sentence) {
            fullCorrection = fullCorrection.replace(sentence, sentenceCorrection);
        }
    });
    
    // Modal verb check (must met → must meet)
    const modalVerbs = ['can', 'could', 'will', 'would', 'shall', 'should', 'may', 'might', 'must'];
    modalVerbs.forEach(modal => {
        const pattern = new RegExp(`\\b${modal}\\s+([a-z]+ed)\\b`, 'gi');
        const match = fullCorrection.match(pattern);
        if (match) {
            const wrongPhrase = match[0];
            const verb = wrongPhrase.split(' ')[1];
            const baseForm = verb.replace(/ed$/, '');
            const correctPhrase = `${modal} ${baseForm}`;
            const correction = fullCorrection.replace(wrongPhrase, correctPhrase);
            
            issues.push({
                type: 'grammar',
                severity: 'error',
                message: `Modal verb error: "${wrongPhrase}" should be "${correctPhrase}"`,
                suggestion: `Use base form after modal verbs`,
                context: wrongPhrase,
                correction: correctPhrase,
                fullCorrection: correction
            });
            fullCorrection = correction;
        }
    });
    
    // Spelling errors
    const spellingErrors = [
        { wrong: /\bApplicent\b/gi, correct: 'Applicants' },
        { wrong: /\badmision\b/gi, correct: 'admission' },
        { wrong: /\bDeploma\b/gi, correct: 'Diploma' },
        { wrong: /\bEducationel\b/gi, correct: 'Educational' },
        { wrong: /\bno\b(?!t\b)/gi, correct: 'know' },
        { wrong: /\brecieve\b/gi, correct: 'receive' },
        { wrong: /\bwierd\b/gi, correct: 'weird' },
        { wrong: /\bacheive\b/gi, correct: 'achieve' },
        { wrong: /\bbeleive\b/gi, correct: 'believe' },
        { wrong: /\bseperate\b/gi, correct: 'separate' },
        { wrong: /\bdefinately\b/gi, correct: 'definitely' },
        { wrong: /\boccured\b/gi, correct: 'occurred' },
        { wrong: /\bprefered\b/gi, correct: 'preferred' },
        { wrong: /\brefered\b/gi, correct: 'referred' },
        { wrong: /\btransfered\b/gi, correct: 'transferred' },
        { wrong: /\buntill\b/gi, correct: 'until' },
        { wrong: /\balot\b/gi, correct: 'a lot' },
        { wrong: /\bsupposably\b/gi, correct: 'supposedly' },
        { wrong: /\bprolly\b/gi, correct: 'probably' },
        { wrong: /\bteh\b/gi, correct: 'the' },
        { wrong: /\badn\b/gi, correct: 'and' },
        { wrong: /\bthier\b/gi, correct: 'their' },
        { wrong: /\bwuold\b/gi, correct: 'would' },
        { wrong: /\bcoudl\b/gi, correct: 'could' },
        { wrong: /\bshoudl\b/gi, correct: 'should' }
    ];
    
    spellingErrors.forEach(error => {
        const match = text.match(error.wrong);
        if (match) {
            const wrongPhrase = match[0];
            const correctPhrase = error.correct;
            const correction = fullCorrection.replace(new RegExp(wrongPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), correctPhrase);
            
            const existing = issues.find(i => i.context === wrongPhrase && i.type === 'spelling');
            if (!existing) {
                issues.push({
                    type: 'spelling',
                    severity: 'error',
                    message: `Spelling error: "${wrongPhrase}" should be "${correctPhrase}"`,
                    suggestion: `Use "${correctPhrase}" instead of "${wrongPhrase}"`,
                    context: wrongPhrase,
                    correction: correctPhrase,
                    fullCorrection: correction
                });
                fullCorrection = correction;
            }
        }
    });
    
    // Capitalization
    if (fullCorrection.match(/\bi\b/)) {
        const correction = fullCorrection.replace(/\bi\b/g, 'I');
        issues.push({
            type: 'capitalization',
            severity: 'warning',
            message: '"i" should be capitalized to "I"',
            suggestion: 'Always capitalize "I" when referring to yourself',
            context: 'i',
            correction: 'I',
            fullCorrection: correction
        });
        fullCorrection = correction;
    }
    
    if (fullCorrection.match(/^[a-z]/)) {
        const correction = fullCorrection.charAt(0).toUpperCase() + fullCorrection.slice(1);
        issues.push({
            type: 'capitalization',
            severity: 'warning',
            message: 'Sentence should start with a capital letter',
            suggestion: 'Capitalize the first letter',
            context: fullCorrection.charAt(0),
            correction: fullCorrection.charAt(0).toUpperCase(),
            fullCorrection: correction
        });
        fullCorrection = correction;
    }
    
    // Punctuation
    if (!fullCorrection.match(/[.!?]\s*$/)) {
        const correction = fullCorrection.trim() + '.';
        issues.push({
            type: 'punctuation',
            severity: 'warning',
            message: 'Missing ending punctuation',
            suggestion: 'Add a period (.) at the end',
            context: fullCorrection.trim(),
            correction: correction,
            fullCorrection: correction
        });
        fullCorrection = correction;
    }
    
    // Calculate score
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;
    const infoCount = issues.filter(i => i.severity === 'info').length;
    
    let score = 100;
    score -= errorCount * 8;
    score -= warningCount * 4;
    score -= infoCount * 2;
    score = Math.max(20, Math.min(100, score));
    
    let summary = '';
    if (errorCount === 0 && warningCount === 0 && infoCount === 0) {
        summary = '🌟 Excellent! No issues found in your text.';
    } else if (errorCount === 0 && warningCount === 0) {
        summary = `📝 Good! ${infoCount} suggestion(s) to improve your writing.`;
    } else if (errorCount === 0) {
        summary = `👍 Good! ${warningCount} warning(s) and ${infoCount} suggestion(s) found.`;
    } else if (errorCount < 3) {
        summary = `📖 Fair. ${errorCount} error(s), ${warningCount} warning(s), and ${infoCount} suggestion(s) found.`;
    } else {
        summary = `🔧 Needs improvement. ${errorCount} error(s), ${warningCount} warning(s), and ${infoCount} suggestion(s) found.`;
    }
    
    return {
        score: score,
        issues: issues,
        summary: summary,
        fullCorrection: fullCorrection,
        stats: { errors: errorCount, warnings: warningCount, suggestions: infoCount }
    };
}

// ============================================
// APPLY SUGGESTIONS
// ============================================
function applySuggestions() {
    const text = textInput.value;
    if (!text) { showToast('No text to correct 📝', 'error'); return; }
    
    if (!currentResults || !currentResults.issues) {
        showToast('Please run grammar check first 🔄', 'warning');
        return;
    }
    
    const corrected = currentResults.fullCorrection || text;
    
    if (corrected && corrected !== text) {
        textInput.value = corrected;
        updateCounters();
        showToast('Suggestions applied! ✅', 'success');
        setTimeout(checkGrammar, 500);
    } else {
        showToast('No corrections to apply ✨', 'info');
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function getEmojiName(emoji) {
    const names = {
        like: '👍 Like', love: '❤️ Love', wow: '😮 Wow',
        sad: '😢 Sad', angry: '😠 Angry', laugh: '😂 Laugh', celebrate: '🎉 Celebrate'
    };
    return names[emoji] || emoji;
}

function showToast(message, type = 'success') {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    
    const colors = {
        success: 'linear-gradient(135deg, #48bb78, #38a169)',
        error: 'linear-gradient(135deg, #f56565, #e53e3e)',
        info: 'linear-gradient(135deg, #4299e1, #3182ce)',
        warning: 'linear-gradient(135deg, #ed8936, #dd6b20)'
    };
    toast.style.background = colors[type] || colors.success;
    
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// COPY FUNCTION
// ============================================
async function copyCorrectedText() {
    const text = textInput.value;
    if (!text) { showToast('Nothing to copy 📋', 'error'); return; }
    try {
        await navigator.clipboard.writeText(text);
        showToast('Text copied to clipboard! 📋', 'success');
    } catch (error) {
        textInput.select();
        document.execCommand('copy');
        showToast('Text copied to clipboard! 📋', 'success');
    }
}

// ============================================
// DOWNLOAD FUNCTION
// ============================================
function downloadAsTXT() {
    const text = textInput.value;
    if (!text) { showToast('Nothing to download 📄', 'error'); return; }
    
    const score = document.getElementById('scoreValue')?.textContent || 'N/A';
    const date = new Date().toLocaleString();
    
    let issuesText = '';
    if (currentResults?.issues) {
        currentResults.issues.forEach(i => {
            issuesText += `  - [${i.type}] ${i.message}\n`;
            if (i.context) issuesText += `    Wrong: "${i.context}"\n`;
            if (i.correction) issuesText += `    Correct: "${i.correction}"\n`;
            issuesText += `    Suggestion: ${i.suggestion}\n\n`;
        });
    }
    
    const fullCorrection = currentResults?.fullCorrection || text;
    
    const report = `═══════════════════════════════════════
   GRAMMAR CHECK REPORT
═══════════════════════════════════════

📅 Date: ${date}
📊 Score: ${score}
🤖 AI: Grok 2.0

───────────────────────────────────────
📝 ORIGINAL TEXT:
───────────────────────────────────────
${text}

───────────────────────────────────────
✅ CORRECTED TEXT:
───────────────────────────────────────
${fullCorrection}

───────────────────────────────────────
🔍 ISSUES FOUND:
───────────────────────────────────────
${issuesText || '  No issues found'}

───────────────────────────────────────
📋 SUMMARY:
───────────────────────────────────────
${currentResults?.summary || 'Analysis complete'}

═══════════════════════════════════════`;
    
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grammar-report-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Report downloaded! 📄', 'success');
}

// ============================================
// SHARE FUNCTIONS
// ============================================
function shareTool(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Advanced Grammar Checking Tool');
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
        case 'twitter': shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`; break;
        case 'linkedin': shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`; break;
        case 'whatsapp': shareUrl = `https://wa.me/?text=${title}%20${url}`; break;
        case 'copy': navigator.clipboard.writeText(window.location.href); showToast('Link copied! 🔗', 'success'); return;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=500');
        trackShare(platform, 'tool');
        showToast(`Shared on ${platform}! 🚀`, 'success');
    }
}

function shareResults() {
    const text = textInput.value;
    if (!text) { showToast('No text to share 📝', 'error'); return; }
    const score = document.getElementById('scoreValue')?.textContent || 'N/A';
    const shareText = `📝 My grammar score is ${score}! Check your writing:`;
    
    if (navigator.share) {
        navigator.share({ title: 'Grammar Check Results', text: shareText, url: window.location.href })
            .then(() => showToast('Shared! 🎉', 'success'))
            .catch(() => {});
    } else {
        navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
        showToast('Results copied! 📋', 'success');
    }
}

// ============================================
// THEME FUNCTIONS
// ============================================
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    darkModeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i> Light' : '<i class="fas fa-moon"></i> Dark';
}

function toggleNeonMode() {
    document.body.classList.toggle('neon-mode');
    localStorage.setItem('neonMode', document.body.classList.contains('neon-mode'));
    showToast(document.body.classList.contains('neon-mode') ? '💜 Neon activated!' : '✨ Neon off!', 'info');
}

function listenToText() {
    const text = textInput.value;
    if (!text) { showToast('No text to read 🔊', 'error'); return; }
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
        showToast('🔊 Reading...', 'info');
    } else {
        showToast('TTS not supported ⚠️', 'error');
    }
}

// ============================================
// AUTO-SAVE
// ============================================
function saveDraft() {
    const text = textInput.value;
    if (text) {
        localStorage.setItem(`${TOOL_SLUG}_draft`, text);
        localStorage.setItem(`${TOOL_SLUG}_draft_time`, Date.now().toString());
        autoSaveInfo.classList.add('show');
        setTimeout(() => autoSaveInfo.classList.remove('show'), 2000);
    }
}

function loadDraft() {
    const draft = localStorage.getItem(`${TOOL_SLUG}_draft`);
    const draftTime = localStorage.getItem(`${TOOL_SLUG}_draft_time`);
    if (draft && draftTime) {
        const timeAgo = Math.round((Date.now() - parseInt(draftTime)) / 60000);
        if (timeAgo < 1440 && draft.length > 10) {
            if (confirm(`📝 Restore draft from ${timeAgo} min ago?`)) {
                textInput.value = draft;
                updateCounters();
                showToast('Draft restored! 📝', 'success');
            }
        }
    }
}

// ============================================
// COUNTERS
// ============================================
function updateCounters() {
    const text = textInput.value;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const chars = text.length;
    
    if (wordCountSpan) wordCountSpan.textContent = words;
    if (charCountSpan) charCountSpan.textContent = chars;
    
    const charWarning = document.getElementById('charWarning');
    if (chars > 4500 && charWarning) {
        charWarning.classList.remove('hidden');
        if (chars > 5000) {
            textInput.value = text.substring(0, 5000);
            updateCounters();
            showToast('5000 char limit reached ⚠️', 'error');
        }
    } else if (charWarning) {
        charWarning.classList.add('hidden');
    }
}

// ============================================
// SCROLL
// ============================================
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
function scrollToBottom() { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        checkGrammar();
    }
    if (e.key === 'Escape') {
        textInput.value = '';
        updateCounters();
        resultsDiv.classList.add('hidden');
        showToast('Cleared! 🗑️', 'info');
    }
});

// ============================================
// EVENT LISTENERS
// ============================================
textInput.addEventListener('input', () => {
    updateCounters();
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(saveDraft, 3000);
});

checkBtn.addEventListener('click', checkGrammar);
clearBtn.addEventListener('click', () => {
    textInput.value = '';
    updateCounters();
    resultsDiv.classList.add('hidden');
    showToast('Cleared! 🗑️', 'info');
});
copyBtn.addEventListener('click', copyCorrectedText);
downloadTxtBtn.addEventListener('click', downloadAsTXT);
shareResultsBtn.addEventListener('click', shareResults);
darkModeBtn.addEventListener('click', toggleDarkMode);
listenBtn.addEventListener('click', listenToText);
if (neonModeBtn) neonModeBtn.addEventListener('click', toggleNeonMode);
pageShareBtn.addEventListener('click', () => shareTool('copy'));
scrollUpBtn.addEventListener('click', scrollToTop);
scrollDownBtn.addEventListener('click', scrollToBottom);

if (applyBtn) applyBtn.addEventListener('click', applySuggestions);

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

document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const platform = btn.getAttribute('data-platform');
        if (platform) shareTool(platform);
    });
});

window.addEventListener('scroll', () => {
    if (scrollUpBtn) {
        scrollUpBtn.classList.toggle('hidden', window.scrollY <= 200);
    }
});

// ============================================
// INIT
// ============================================
async function init() {
    console.log('🚀 Grammar Checker Ready');
    console.log('🤖 Using Grok API');
    console.log(`🌐 Worker: ${WORKER_URL}`);
    
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        if (darkModeBtn) darkModeBtn.innerHTML = '<i class="fas fa-sun"></i> Light';
    }
    if (localStorage.getItem('neonMode') === 'true') {
        document.body.classList.add('neon-mode');
    }
    
    updateCounters();
    loadStats();
    loadDraft();
    trackView();
    
    setTimeout(() => showToast('✨ Ready! Type text and click Check with Grok AI.', 'info'), 500);
}

init();
