// ============================================
// MARKING SCHEME DASHBOARD - CLOUDFLARE WORKERS API
// Full Feature JS | 51+ Features | Reactions | Usage Counter | Smart Guide
// ============================================

// ----------------------------- GLOBALS -----------------------------
const TOOL_NAME = 'Marking Scheme Dashboard';
const TOOL_SLUG = 'marking-scheme-dashboard';
const CATEGORY = 'Teacher';

// Cloudflare Workers API Base
const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';

let currentUserId = localStorage.getItem('marking_tool_user_id');
if (!currentUserId) {
    currentUserId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
    localStorage.setItem('marking_tool_user_id', currentUserId);
}

let usageCount = 0;
let viewsCount = 0;
let sharesCount = 0;
let followersCount = 0;
let reactionsCache = { like: 0, love: 0, wow: 0, sad: 0, laugh: 0, celebrate: 0 };
let userReacted = new Set();
let darkMode = localStorage.getItem('marking_dark') === 'true';
let statsLoaded = false;

// ---------- 51+ Marking Scheme Dataset (Rich + Variation) ----------
const markingData = [
    { type: "Multiple Choice (MCQ)", category: "Objective / Knowledge", marks: "1 each", distribution: "Correct = 1, wrong/spelling/cross = 0", example: "Capital of France?", bloom: "Remember", level: "Knowledge" },
    { type: "True/False", category: "Objective / Recall", marks: "1 each", distribution: "No partial, exact answer required", example: "Earth is flat (T/F)", bloom: "Remember", level: "Knowledge" },
    { type: "Fill-in-the-blank", category: "Objective", marks: "1 each", distribution: "Exact spelling mandatory", example: "Process of making food: ___", bloom: "Remember", level: "Knowledge" },
    { type: "Matching Items", category: "Objective / Comprehension", marks: "1 per match", distribution: "All correct for full mark", example: "Match countries & capitals", bloom: "Understand", level: "Comprehension" },
    { type: "Short Answer (2 marks)", category: "Subjective / Comprehension", marks: "2", distribution: "Main idea 1.5, spelling 0.5", example: "Why do plants need sunlight?", bloom: "Understand", level: "Comprehension" },
    { type: "Short Answer (3 marks)", category: "Subjective", marks: "3", distribution: "Key point 2, grammar 0.5, relevance 0.5", example: "Explain photosynthesis", bloom: "Apply", level: "Application" },
    { type: "Paraphrasing Exercise", category: "Subjective / Writing", marks: "3", distribution: "Meaning 1.5, vocabulary 1, grammar 0.5", example: "Rewrite given sentence", bloom: "Create", level: "Synthesis" },
    { type: "Scenario-based MCQ", category: "Application", marks: "2", distribution: "Correct 1.5, justification 0.5", example: "John's income $3000, savings?", bloom: "Apply", level: "Application" },
    { type: "Problem Solving (Math/Science)", category: "Application", marks: "5", distribution: "Approach 2, steps 2, final 1", example: "Area of triangle (b=10,h=5)", bloom: "Apply", level: "Application" },
    { type: "Case Study Analysis", category: "Application", marks: "10", distribution: "Issues 3, analysis 4, recommendations 2, presentation 1", example: "Business case study", bloom: "Analyze", level: "Analysis" },
    { type: "Data Interpretation", category: "Analytical", marks: "7", distribution: "Data extraction 2, analysis 3, conclusion 2", example: "Sales chart trends", bloom: "Analyze", level: "Analysis" },
    { type: "Critical Thinking Scenario", category: "Critical Thinking", marks: "8", distribution: "Issue id 2, analysis 3, evaluation 2, presentation 1", example: "Car runs out of gas - diagnose", bloom: "Evaluate", level: "Evaluation" },
    { type: "Argumentative Task", category: "Critical Thinking", marks: "10", distribution: "Thesis 2, arguments 4, counter-args 2, structure 2", example: "School uniforms debate", bloom: "Evaluate", level: "Evaluation" },
    { type: "Project-based Assessment", category: "Synthesis", marks: "20", distribution: "Research 5, content 8, creativity 4, presentation 3", example: "Create a model house", bloom: "Create", level: "Synthesis" },
    { type: "Essay (Extended)", category: "Subjective", marks: "15", distribution: "Intro 3, body 8, conclusion 2, coherence 2", example: "Climate change effects", bloom: "Create", level: "Synthesis" },
    { type: "Diagram Labelling", category: "Objective/Visual", marks: "2", distribution: "Each correct label 0.5", example: "Label plant cell", bloom: "Understand", level: "Comprehension" },
    { type: "Flowchart Completion", category: "Analytical", marks: "4", distribution: "Each correct step 1", example: "Complete water cycle chart", bloom: "Analyze", level: "Analysis" },
    { type: "Peer Assessment Rubric", category: "Teacher Guide", marks: "N/A", distribution: "Guidelines for peer marking", example: "Group project rubric", bloom: "Evaluate", level: "Meta" }
];

// Expand to 51+ variations
const fullMarkingList = [];
for (let i = 0; i < 3; i++) {
    markingData.forEach(item => {
        let newItem = { ...item };
        if (i === 1) newItem.type = item.type + " (Advanced)";
        else if (i === 2) newItem.type = item.type + " (Board Pattern)";
        else newItem.type = item.type;
        newItem.marks = item.marks;
        fullMarkingList.push(newItem);
    });
}
const FINAL_ROWS = fullMarkingList.slice(0, 54);

// ----------------------------- Helper Functions -----------------------------
function showToast(msg, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) {
        console.warn('Toast container not found');
        return;
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle';
    toast.innerHTML = `<i class="fas ${icon}"></i> ${msg}`;
    container.appendChild(toast);
    setTimeout(() => {
        if (toast.parentNode) toast.remove();
    }, 3000);
}

// ============================================
// CLOUDFLARE WORKERS API CALLS
// ============================================

async function callCloudflareAPI(endpoint, method = 'GET', body = null) {
    try {
        const url = `${API_BASE}${endpoint}`;
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        if (body) {
            options.body = JSON.stringify(body);
        }
        
        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.warn(`Cloudflare API call failed: ${endpoint}`, error);
        return null;
    }
}

// ============================================
// 1. USAGE COUNTER - POST /api/usage
// ============================================

async function incrementUsage() {
    try {
        const result = await callCloudflareAPI('/api/usage', 'POST', {
            tool_slug: TOOL_SLUG,
            user_id: currentUserId
        });
        
        if (result && result.success) {
            usageCount = result.usage || result.total || 0;
            updateUsageDisplay();
            // Save to localStorage as fallback
            localStorage.setItem(`usage_${TOOL_SLUG}`, usageCount);
            localStorage.setItem(`usage_${TOOL_SLUG}_timestamp`, Date.now());
            return true;
        } else {
            // Fallback: LocalStorage
            usageCount = parseInt(localStorage.getItem(`usage_${TOOL_SLUG}`)) || 0;
            usageCount++;
            localStorage.setItem(`usage_${TOOL_SLUG}`, usageCount);
            updateUsageDisplay();
            return false;
        }
    } catch (error) {
        console.error('Error incrementing usage:', error);
        // Fallback: LocalStorage
        usageCount = parseInt(localStorage.getItem(`usage_${TOOL_SLUG}`)) || 0;
        usageCount++;
        localStorage.setItem(`usage_${TOOL_SLUG}`, usageCount);
        updateUsageDisplay();
        return false;
    }
}

async function fetchUsage() {
    try {
        const result = await callCloudflareAPI(`/api/stats?tool_slug=${TOOL_SLUG}`, 'GET');
        
        if (result && result.success) {
            usageCount = result.usage || result.total_usage || 0;
            viewsCount = result.views || 0;
            sharesCount = result.shares || 0;
            followersCount = result.followers || 0;
            updateUsageDisplay();
            updateStatsDisplay();
            // Save to localStorage
            localStorage.setItem(`usage_${TOOL_SLUG}`, usageCount);
            localStorage.setItem(`views_${TOOL_SLUG}`, viewsCount);
            localStorage.setItem(`shares_${TOOL_SLUG}`, sharesCount);
            localStorage.setItem(`followers_${TOOL_SLUG}`, followersCount);
            statsLoaded = true;
            return true;
        } else {
            // Fallback: LocalStorage
            usageCount = parseInt(localStorage.getItem(`usage_${TOOL_SLUG}`)) || 0;
            viewsCount = parseInt(localStorage.getItem(`views_${TOOL_SLUG}`)) || 0;
            sharesCount = parseInt(localStorage.getItem(`shares_${TOOL_SLUG}`)) || 0;
            followersCount = parseInt(localStorage.getItem(`followers_${TOOL_SLUG}`)) || 0;
            updateUsageDisplay();
            updateStatsDisplay();
            return false;
        }
    } catch (error) {
        console.error('Error fetching usage stats:', error);
        // Fallback: LocalStorage
        usageCount = parseInt(localStorage.getItem(`usage_${TOOL_SLUG}`)) || 0;
        viewsCount = parseInt(localStorage.getItem(`views_${TOOL_SLUG}`)) || 0;
        sharesCount = parseInt(localStorage.getItem(`shares_${TOOL_SLUG}`)) || 0;
        followersCount = parseInt(localStorage.getItem(`followers_${TOOL_SLUG}`)) || 0;
        updateUsageDisplay();
        updateStatsDisplay();
        return false;
    }
}

function updateUsageDisplay() {
    const usageElement = document.getElementById('usageCount');
    if (usageElement) {
        usageElement.innerText = usageCount;
    }
}

function updateStatsDisplay() {
    // Update usage display
    updateUsageDisplay();
    
    // Update views if element exists
    const viewsElement = document.getElementById('viewsCount');
    if (viewsElement) {
        viewsElement.innerText = viewsCount;
    }
    
    // Update shares if element exists
    const sharesElement = document.getElementById('sharesCount');
    if (sharesElement) {
        sharesElement.innerText = sharesCount;
    }
    
    // Update followers if element exists
    const followersElement = document.getElementById('followersCount');
    if (followersElement) {
        followersElement.innerText = followersCount;
    }
}

// ============================================
// 2. REACTIONS - POST /api/reactions
// ============================================

async function fetchReactions() {
    try {
        const result = await callCloudflareAPI(`/api/stats?tool_slug=${TOOL_SLUG}`, 'GET');
        
        if (result && result.success && result.reactions) {
            reactionsCache = result.reactions;
            renderReactionsUI();
            // Save to localStorage
            localStorage.setItem(`reactions_${TOOL_SLUG}`, JSON.stringify(reactionsCache));
            return true;
        } else {
            // Fallback: LocalStorage
            const saved = localStorage.getItem(`reactions_${TOOL_SLUG}`);
            if (saved) {
                reactionsCache = JSON.parse(saved);
            }
            renderReactionsUI();
            return false;
        }
    } catch (error) {
        console.error('Error fetching reactions:', error);
        // Fallback: LocalStorage
        const saved = localStorage.getItem(`reactions_${TOOL_SLUG}`);
        if (saved) {
            reactionsCache = JSON.parse(saved);
        }
        renderReactionsUI();
        return false;
    }
}

async function addReaction(emoji, reactionKey) {
    try {
        const result = await callCloudflareAPI('/api/reactions', 'POST', {
            tool_slug: TOOL_SLUG,
            emoji: emoji,
            reaction_type: reactionKey,
            user_id: currentUserId
        });
        
        if (result && result.success) {
            if (result.already_reacted) {
                showToast(`You already reacted with ${emoji}`, 'info');
                return false;
            }
            if (result.counts) {
                reactionsCache = result.counts;
                renderReactionsUI();
                // Save to localStorage
                localStorage.setItem(`reactions_${TOOL_SLUG}`, JSON.stringify(reactionsCache));
                showToast(`Reaction added: ${emoji}`, 'success');
                return true;
            }
        } else {
            // Fallback: LocalStorage increment
            if (!userReacted.has(reactionKey)) {
                reactionsCache[reactionKey] = (reactionsCache[reactionKey] || 0) + 1;
                userReacted.add(reactionKey);
                renderReactionsUI();
                localStorage.setItem(`reactions_${TOOL_SLUG}`, JSON.stringify(reactionsCache));
                localStorage.setItem(`user_reacted_${TOOL_SLUG}`, JSON.stringify([...userReacted]));
                showToast(`Reaction added: ${emoji} (Local)`, 'success');
                return true;
            } else {
                showToast(`You already reacted with ${emoji}`, 'info');
                return false;
            }
        }
    } catch (error) {
        console.error('Error adding reaction:', error);
        // Fallback: LocalStorage increment
        if (!userReacted.has(reactionKey)) {
            reactionsCache[reactionKey] = (reactionsCache[reactionKey] || 0) + 1;
            userReacted.add(reactionKey);
            renderReactionsUI();
            localStorage.setItem(`reactions_${TOOL_SLUG}`, JSON.stringify(reactionsCache));
            localStorage.setItem(`user_reacted_${TOOL_SLUG}`, JSON.stringify([...userReacted]));
            showToast(`Reaction added: ${emoji} (Local)`, 'success');
            return true;
        } else {
            showToast(`You already reacted with ${emoji}`, 'info');
            return false;
        }
    }
}

function renderReactionsUI() {
    const bar = document.getElementById('reactionsBar');
    if (!bar) return;
    
    const emojis = ['👍', '❤️', '😮', '😢', '😂', '🎉'];
    const keys = ['like', 'love', 'wow', 'sad', 'laugh', 'celebrate'];
    
    bar.innerHTML = emojis.map((emoji, idx) => `
        <div class="reaction-item" data-reaction="${keys[idx]}">
            <span>${emoji}</span>
            <span class="reaction-count">${reactionsCache[keys[idx]] || 0}</span>
        </div>
    `).join('');
    
    // Add click listeners
    document.querySelectorAll('.reaction-item').forEach(el => {
        el.addEventListener('click', function(e) {
            const key = this.dataset.reaction;
            const emojiMap = { like:'👍', love:'❤️', wow:'😮', sad:'😢', laugh:'😂', celebrate:'🎉' };
            addReaction(emojiMap[key], key);
        });
    });
}

// Load saved user reactions from localStorage
function loadUserReactions() {
    const saved = localStorage.getItem(`user_reacted_${TOOL_SLUG}`);
    if (saved) {
        try {
            userReacted = new Set(JSON.parse(saved));
        } catch (e) {
            userReacted = new Set();
        }
    }
}

// ============================================
// 3. SHARES - POST /api/shares
// ============================================

async function shareTool(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Check out this Marking Scheme Dashboard!');
    
    let shareUrl = '';
    if (platform === 'facebook') {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (platform === 'twitter') {
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
    } else if (platform === 'whatsapp') {
        shareUrl = `https://wa.me/?text=${title}%20${url}`;
    } else if (platform === 'linkedin') {
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=450');
    }
    
    // Record share on Cloudflare API
    try {
        const result = await callCloudflareAPI('/api/shares', 'POST', {
            tool_slug: TOOL_SLUG,
            platform: platform,
            user_id: currentUserId
        });
        
        if (result && result.success) {
            sharesCount = result.total_shares || sharesCount + 1;
            updateStatsDisplay();
            showToast(`Shared on ${platform}!`, 'success');
        } else {
            // Fallback: LocalStorage
            sharesCount = parseInt(localStorage.getItem(`shares_${TOOL_SLUG}`)) || 0;
            sharesCount++;
            localStorage.setItem(`shares_${TOOL_SLUG}`, sharesCount);
            updateStatsDisplay();
            showToast(`Shared on ${platform}! (Local)`, 'success');
        }
    } catch (error) {
        console.error('Error recording share:', error);
        // Fallback: LocalStorage
        sharesCount = parseInt(localStorage.getItem(`shares_${TOOL_SLUG}`)) || 0;
        sharesCount++;
        localStorage.setItem(`shares_${TOOL_SLUG}`, sharesCount);
        updateStatsDisplay();
        showToast(`Shared on ${platform}! (Local)`, 'success');
    }
}

function copyPageURL() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        showToast('Link copied to clipboard!', 'success');
        
        // Record copy as share
        callCloudflareAPI('/api/shares', 'POST', {
            tool_slug: TOOL_SLUG,
            platform: 'copy',
            user_id: currentUserId
        }).then(result => {
            if (result && result.success) {
                sharesCount = result.total_shares || sharesCount + 1;
                updateStatsDisplay();
            } else {
                // Fallback: LocalStorage
                sharesCount = parseInt(localStorage.getItem(`shares_${TOOL_SLUG}`)) || 0;
                sharesCount++;
                localStorage.setItem(`shares_${TOOL_SLUG}`, sharesCount);
                updateStatsDisplay();
            }
        }).catch(() => {
            // Fallback: LocalStorage
            sharesCount = parseInt(localStorage.getItem(`shares_${TOOL_SLUG}`)) || 0;
            sharesCount++;
            localStorage.setItem(`shares_${TOOL_SLUG}`, sharesCount);
            updateStatsDisplay();
        });
    }).catch(() => {
        showToast('Failed to copy link. Please copy manually.', 'error');
    });
}

// ============================================
// 4. GET STATS - GET /api/stats?tool_slug=:slug
// ============================================

async function fetchStats() {
    try {
        const result = await callCloudflareAPI(`/api/stats?tool_slug=${TOOL_SLUG}`, 'GET');
        
        if (result && result.success) {
            usageCount = result.usage || result.total_usage || 0;
            viewsCount = result.views || 0;
            sharesCount = result.shares || 0;
            followersCount = result.followers || 0;
            if (result.reactions) {
                reactionsCache = result.reactions;
            }
            updateStatsDisplay();
            renderReactionsUI();
            // Save to localStorage
            localStorage.setItem(`usage_${TOOL_SLUG}`, usageCount);
            localStorage.setItem(`views_${TOOL_SLUG}`, viewsCount);
            localStorage.setItem(`shares_${TOOL_SLUG}`, sharesCount);
            localStorage.setItem(`followers_${TOOL_SLUG}`, followersCount);
            localStorage.setItem(`reactions_${TOOL_SLUG}`, JSON.stringify(reactionsCache));
            statsLoaded = true;
            return true;
        } else {
            loadFromLocalStorage();
            return false;
        }
    } catch (error) {
        console.error('Error fetching stats:', error);
        loadFromLocalStorage();
        return false;
    }
}

function loadFromLocalStorage() {
    usageCount = parseInt(localStorage.getItem(`usage_${TOOL_SLUG}`)) || 0;
    viewsCount = parseInt(localStorage.getItem(`views_${TOOL_SLUG}`)) || 0;
    sharesCount = parseInt(localStorage.getItem(`shares_${TOOL_SLUG}`)) || 0;
    followersCount = parseInt(localStorage.getItem(`followers_${TOOL_SLUG}`)) || 0;
    const savedReactions = localStorage.getItem(`reactions_${TOOL_SLUG}`);
    if (savedReactions) {
        try {
            reactionsCache = JSON.parse(savedReactions);
        } catch (e) {
            reactionsCache = { like: 0, love: 0, wow: 0, sad: 0, laugh: 0, celebrate: 0 };
        }
    }
    updateStatsDisplay();
    renderReactionsUI();
}

// ============================================
// GENERATE TABLE (51+ rows)
// ============================================

function renderTable(filter = 'all') {
    const tbody = document.getElementById('markingTableBody');
    if (!tbody) return;
    
    let filtered = FINAL_ROWS.filter(row => {
        if (filter === 'all') return true;
        if (filter === 'objective') return row.category.toLowerCase().includes('objective');
        if (filter === 'subjective') return row.category.toLowerCase().includes('subjective');
        if (filter === 'application') return row.category.toLowerCase().includes('application') || row.bloom === 'Apply';
        if (filter === 'critical') return row.category.toLowerCase().includes('critical') || row.bloom === 'Evaluate' || row.bloom === 'Analyze';
        return true;
    });
    
    let html = '';
    let lastCat = '';
    
    filtered.forEach((item, idx) => {
        const categoryHeader = item.category.split('/')[0].trim();
        if (lastCat !== categoryHeader) {
            html += `<tr class="category-row"><td colspan="5"><strong>📌 ${categoryHeader} Section</strong></td></tr>`;
            lastCat = categoryHeader;
        }
        html += `<tr>
            <td><i class="fas fa-question-circle"></i> ${item.type}</td>
            <td>${item.category} <span class="bloom-badge" style="background:#e0e7ff;padding:2px 8px;border-radius:20px;font-size:0.7rem;">${item.bloom}</span></td>
            <td>${item.marks}</td>
            <td>${item.distribution}</td>
            <td>${item.example} <button class="guide-tip" data-type="${item.type}" style="margin-left:8px;background:none;border:none;color:var(--primary);cursor:pointer;"><i class="fas fa-lightbulb"></i> Guide</button></td>
        </tr>`;
    });
    
    tbody.innerHTML = html;
    
    // Add guide tip listeners
    document.querySelectorAll('.guide-tip').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const qtype = this.dataset.type;
            const found = FINAL_ROWS.find(r => r.type === qtype);
            if (found) {
                showToast(`Bloom: ${found.bloom} | Distribution: ${found.distribution}`, 'info');
            }
        });
    });
}

// ============================================
// PAPER PATTERN BUILDER
// ============================================

function suggestPattern(totalMarks) {
    const mcqCount = Math.floor(totalMarks * 0.2);
    const shortCount = Math.floor(totalMarks * 0.3 / 2);
    const longCount = Math.floor(totalMarks * 0.5 / 10);
    return `📊 Suggested: ${mcqCount} MCQs (${mcqCount} marks), ${shortCount} Short Qs (${shortCount*2} marks), ${longCount} Long Qs (${longCount*10} marks). Total ~${totalMarks} marks.`;
}

function applyBoardPattern(board) {
    let msg = '';
    if (board === 'fbise') {
        msg = '✅ FBISE Pattern: 20% MCQs, 30% CRQs, 50% ERQs. Partial marking allowed for steps.';
    } else if (board === 'punjab') {
        msg = '✅ Punjab Board: Objective 20%, Subjective 80%. Spelling counts in subjective.';
    } else if (board === 'cambridge') {
        msg = '✅ Cambridge: Emphasis on critical thinking, command words, and rubric-based marking.';
    } else if (board === 'sindh') {
        msg = '✅ Sindh Board: Similar to Punjab with additional focus on practicals.';
    }
    const feedback = document.getElementById('boardFeedback');
    if (feedback) {
        feedback.innerHTML = msg;
    }
    showToast(`Board pattern set: ${board}`, 'success');
}

function updateTimeAdvice() {
    const durationInput = document.getElementById('durationMins');
    if (!durationInput) return;
    const duration = parseInt(durationInput.value) || 120;
    const perMark = (duration / 100).toFixed(1);
    const advice = document.getElementById('timeAdvice');
    if (advice) {
        advice.innerHTML = `⏱️ ~${perMark} minutes per mark (for 100-mark paper). Adjust question count accordingly.`;
    }
}

// ============================================
// DARK MODE
// ============================================

function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('marking_dark', darkMode);
    const icon = document.querySelector('#darkModeBtn i');
    if (icon) {
        icon.className = darkMode ? 'fas fa-sun' : 'fas fa-moon';
    }
    const heroIcon = document.querySelector('#darkModeToggleHero i');
    if (heroIcon) {
        heroIcon.className = darkMode ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// ============================================
// SCROLL BUTTONS
// ============================================

function initScroll() {
    const upBtn = document.getElementById('scrollUpBtn');
    const downBtn = document.getElementById('scrollDownBtn');
    
    if (upBtn) {
        upBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    if (downBtn) {
        downBtn.addEventListener('click', () => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });
    }
}

// ============================================
// TYPEWRITER ANIMATION
// ============================================

function initTypewriter() {
    const element = document.getElementById('typewriterText');
    if (!element) return;
    
    const texts = [
        '📚 Smart Assessment Guide',
        '🎯 51+ Marking Features',
        '📊 Board Pattern Matcher',
        '🧠 Bloom\'s Taxonomy Guide',
        '✨ Partial Marking Expert'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentText = '';
    
    function type() {
        const fullText = texts[textIndex];
        
        if (isDeleting) {
            currentText = fullText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            currentText = fullText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        element.textContent = currentText;
        
        if (!isDeleting && charIndex === fullText.length) {
            isDeleting = true;
            setTimeout(type, 2000);
            return;
        }
        
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(type, 500);
            return;
        }
        
        const speed = isDeleting ? 50 : 100;
        setTimeout(type, speed);
    }
    
    type();
}

// ============================================
// INITIALIZATION
// ============================================

async function init() {
    // Load user reactions from localStorage
    loadUserReactions();
    
    // Fetch all stats from Cloudflare API
    await fetchStats();
    
    // Render table
    renderTable('all');
    
    // Apply dark mode
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
    const icon = document.querySelector('#darkModeBtn i');
    if (icon) {
        icon.className = darkMode ? 'fas fa-sun' : 'fas fa-moon';
    }
    const heroIcon = document.querySelector('#darkModeToggleHero i');
    if (heroIcon) {
        heroIcon.className = darkMode ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    // Increment usage on page load
    await incrementUsage();
    
    // ----- Event Listeners -----
    
    // Dark Mode Toggle
    const darkBtn = document.getElementById('darkModeBtn');
    if (darkBtn) {
        darkBtn.addEventListener('click', toggleDarkMode);
    }
    const heroDarkBtn = document.getElementById('darkModeToggleHero');
    if (heroDarkBtn) {
        heroDarkBtn.addEventListener('click', toggleDarkMode);
    }
    
    // Copy URL
    const copyBtn = document.getElementById('copyUrlBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyPageURL);
    }
    
    // Share Buttons
    document.querySelectorAll('.share-btn').forEach(btn => {
        if (btn.id !== 'copyUrlBtn') {
            btn.addEventListener('click', function() {
                shareTool(this.dataset.platform);
            });
        }
    });
    
    // Generate Pattern
    const genBtn = document.getElementById('generatePatternBtn');
    if (genBtn) {
        genBtn.addEventListener('click', function() {
            const totalInput = document.getElementById('totalMarksInput');
            if (totalInput) {
                const total = parseInt(totalInput.value) || 100;
                const suggestion = suggestPattern(total);
                const patternDiv = document.getElementById('patternSuggestion');
                if (patternDiv) {
                    patternDiv.innerHTML = suggestion;
                }
            }
        });
    }
    
    // Calculate Time
    const calcBtn = document.getElementById('calcTimeBtn');
    if (calcBtn) {
        calcBtn.addEventListener('click', updateTimeAdvice);
    }
    
    // Apply Board Pattern
    const boardBtn = document.getElementById('applyBoardBtn');
    if (boardBtn) {
        boardBtn.addEventListener('click', function() {
            const boardSelect = document.getElementById('boardSelect');
            if (boardSelect) {
                applyBoardPattern(boardSelect.value);
            }
        });
    }
    
    // Filter Buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderTable(this.dataset.filter);
        });
    });
    
    // Scroll to Tool
    const scrollBtn = document.getElementById('scrollToToolBtn');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', function() {
            const main = document.getElementById('mainDashboard');
            if (main) {
                main.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Initialize scroll buttons
    initScroll();
    
    // Initialize typewriter
    initTypewriter();
    
    // Show welcome toast
    showToast(`✨ ${TOOL_NAME} ready — 51+ features loaded`, 'success');
}

// ============================================
// START APPLICATION
// ============================================

document.addEventListener('DOMContentLoaded', init);
