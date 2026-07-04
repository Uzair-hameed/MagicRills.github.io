// ============================================
// MAGICRILLS COUNTING GAME - MAIN SCRIPT
// Cloudflare Workers API Integration
// ============================================

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    TOOL_NAME: 'Magicrills Counting Game',
    TOOL_SLUG: 'magicrills-counting-game',
    CATEGORY: 'Kids-Games',
    API_BASE: 'https://magicrills-api.uzairhameed01.workers.dev',
    TOTAL_QUESTIONS: 10
};

// ============================================
// USER ID (LocalStorage)
// ============================================
let userId = localStorage.getItem('userId');
if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 16) + '_' + Date.now();
    localStorage.setItem('userId', userId);
}

// ============================================
// GAME STATE
// ============================================
const state = {
    currentLevel: 'easy',
    score: 0,
    questionsDone: 0,
    soundEnabled: true,
    currentAnswer: 0,
    completedLevels: {
        easy: false,
        average: false,
        hard: false,
        professional: false
    }
};

// ============================================
// DOM REFS
// ============================================
const DOM = {
    loadingSpinner: document.getElementById('loadingSpinner'),
    toast: document.getElementById('toast'),
    gameArea: document.getElementById('gameArea'),
    score: document.getElementById('score'),
    progressBar: document.getElementById('progressBar'),
    questionsLeft: document.getElementById('questionsLeft'),
    usageCount: document.getElementById('usageCount'),
    uniqueUsers: document.getElementById('uniqueUsers'),
    heroUsage: document.getElementById('heroUsage'),
    heroUsers: document.getElementById('heroUsers'),
    heroShares: document.getElementById('heroShares'),
    dashUsage: document.getElementById('dashUsage'),
    dashUsers: document.getElementById('dashUsers'),
    dashShares: document.getElementById('dashShares'),
    dashReactions: document.getElementById('dashReactions'),
    typewriter: document.getElementById('typewriter'),
    darkModeBtn: document.getElementById('darkModeBtn'),
    soundBtn: document.getElementById('soundBtn'),
    heroCta: document.getElementById('heroCta')
};

// ============================================
// TYPEWRITER ANIMATION
// ============================================
const typewriterTexts = [
    'Learn Counting with Fun! 🎈',
    'Balloon Pop Adventure! 🎈',
    'Number Search Challenge! 🔢',
    'Puzzle Time! 🧩',
    'AI Stories for Kids! 📖',
    'Math is Magic! ✨'
];

let typewriterIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typewriterEffect() {
    const currentText = typewriterTexts[typewriterIndex];
    
    if (!isDeleting) {
        DOM.typewriter.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        
        if (charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(typewriterEffect, 2000);
            return;
        }
    } else {
        DOM.typewriter.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        
        if (charIndex === 0) {
            isDeleting = false;
            typewriterIndex = (typewriterIndex + 1) % typewriterTexts.length;
            setTimeout(typewriterEffect, 500);
            return;
        }
    }
    
    setTimeout(typewriterEffect, isDeleting ? 40 : 80);
}

// Start typewriter on load
setTimeout(typewriterEffect, 500);

// ============================================
// API FUNCTIONS
// ============================================
async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-Tool-Slug': CONFIG.TOOL_SLUG
            }
        };
        if (data) options.body = JSON.stringify(data);
        
        const response = await fetch(`${CONFIG.API_BASE}${endpoint}`, options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.warn('API Error:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// USAGE COUNTER
// ============================================
async function recordUsage() {
    try {
        const result = await apiCall('/api/usage', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            user_id: userId
        });
        
        if (result.success) {
            updateUsageUI(result.totalUsage || 0, result.uniqueUsers || 0);
            return result;
        }
    } catch (error) {
        console.warn('Usage record failed, using localStorage');
    }
    
    // Fallback: LocalStorage
    let localUsage = parseInt(localStorage.getItem('localUsage')) || 0;
    localUsage++;
    localStorage.setItem('localUsage', localUsage);
    const localUsers = parseInt(localStorage.getItem('localUsers')) || 1;
    updateUsageUI(localUsage, localUsers);
}

async function loadUsageStats() {
    try {
        const result = await apiCall(`/api/stats?tool_slug=${CONFIG.TOOL_SLUG}`, 'GET');
        if (result.success) {
            updateUsageUI(result.totalUsage || 0, result.uniqueUsers || 0);
            updateDashboardStats(result);
        }
    } catch (error) {
        console.warn('Stats load failed, using localStorage');
        const localUsage = parseInt(localStorage.getItem('localUsage')) || 1247;
        const localUsers = parseInt(localStorage.getItem('localUsers')) || 89;
        updateUsageUI(localUsage, localUsers);
    }
}

function updateUsageUI(usage, users) {
    const formatted = usage.toLocaleString();
    DOM.usageCount.textContent = formatted;
    DOM.uniqueUsers.textContent = users.toLocaleString();
    DOM.heroUsage.textContent = formatted;
    DOM.heroUsers.textContent = users.toLocaleString();
    DOM.dashUsage.textContent = formatted;
    DOM.dashUsers.textContent = users.toLocaleString();
}

function updateDashboardStats(stats) {
    if (stats.totalShares) {
        DOM.heroShares.textContent = stats.totalShares.toLocaleString();
        DOM.dashShares.textContent = stats.totalShares.toLocaleString();
    }
    if (stats.totalReactions) {
        DOM.dashReactions.textContent = stats.totalReactions.toLocaleString();
    }
}

// ============================================
// REACTIONS
// ============================================
const REACTION_EMOJIS = ['👍', '❤️', '😮', '😢', '😂', '🎉'];
const REACTION_IDS = ['like', 'love', 'wow', 'sad', 'laugh', 'celebrate'];

async function loadReactions() {
    try {
        const result = await apiCall(`/api/reactions?tool_slug=${CONFIG.TOOL_SLUG}`, 'GET');
        if (result.success && result.reactions) {
            REACTION_IDS.forEach(id => {
                const el = document.getElementById(`react-${id}`);
                if (el) el.textContent = result.reactions[id] || 0;
            });
            updateDashboardReactions(result.reactions);
        }
    } catch (error) {
        console.warn('Reactions load failed');
    }
}

function updateDashboardReactions(reactions) {
    const total = Object.values(reactions).reduce((a, b) => a + b, 0);
    DOM.dashReactions.textContent = total.toLocaleString();
}

async function addReaction(emoji) {
    const emojiMap = {
        '👍': 'like', '❤️': 'love', '😮': 'wow',
        '😢': 'sad', '😂': 'laugh', '🎉': 'celebrate'
    };
    const reactionType = emojiMap[emoji];
    
    try {
        const result = await apiCall('/api/reactions', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            emoji: emoji,
            reaction_type: reactionType,
            user_id: userId
        });
        
        if (result.success) {
            showToast(`Thanks for ${emoji}! 🎉`);
            loadReactions();
        } else if (result.alreadyReacted) {
            showToast(`You already reacted with ${emoji}!`, true);
        }
    } catch (error) {
        // Local fallback
        const el = document.getElementById(`react-${reactionType}`);
        if (el) {
            el.textContent = parseInt(el.textContent) + 1;
        }
        showToast(`${emoji} (local mode)`, true);
    }
}

// ============================================
// SHARES
// ============================================
async function recordShare(platform) {
    try {
        const result = await apiCall('/api/shares', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            platform: platform,
            user_id: userId
        });
        if (result.success) {
            showToast(`Shared on ${platform}! 🎉`);
            loadUsageStats();
        }
    } catch (error) {
        showToast(`Shared on ${platform} (local)`, true);
    }
}

// ============================================
// AI STORY
// ============================================
async function getAIStory() {
    const fallbackStories = [
        { text: "🐶 Sara has 5 dogs at home. She gets 3 more puppies. How many dogs total?", answer: 8 },
        { text: "🍎 There are 12 apples. Mom takes 4 apples. How many remain?", answer: 8 },
        { text: "🚗 7 red cars, 5 blue cars, 2 green cars. Total cars?", answer: 14 },
        { text: "🐟 Aquarium has 15 goldfish. 6 swim away. How many left?", answer: 9 },
        { text: "📚 Ali read 9 books in Jan and 7 in Feb. Total books?", answer: 16 }
    ];
    
    try {
        // Try to get AI story via API
        const result = await apiCall('/api/generate-quote', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            prompt: 'Create a short fun counting story for kids with numbers between 1-20',
            category: 'education'
        });
        
        if (result.success && result.quote) {
            const numbers = result.quote.match(/\d+/g);
            const answer = numbers ? parseInt(numbers[numbers.length - 1]) : 10;
            return { text: result.quote, answer: answer };
        }
    } catch (error) {
        console.warn('AI story failed, using fallback');
    }
    
    return fallbackStories[Math.floor(Math.random() * fallbackStories.length)];
}

// ============================================
// GAME FUNCTIONS
// ============================================
function playSound(type) {
    if (!state.soundEnabled) return;
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        if (type === 'correct') {
            osc.frequency.value = 880;
            gain.gain.value = 0.3;
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.3);
            osc.stop(ctx.currentTime + 0.3);
        } else if (type === 'incorrect') {
            osc.frequency.value = 440;
            gain.gain.value = 0.3;
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
            osc.stop(ctx.currentTime + 0.5);
        }
    } catch (e) {}
}

function showToast(msg, isError = false) {
    const toast = DOM.toast;
    toast.textContent = msg;
    toast.className = 'toast' + (isError ? ' error' : '');
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove('show'), 2500);
}

function showLoading(show) {
    DOM.loadingSpinner.classList.toggle('active', show);
}

function updateUI() {
    DOM.score.textContent = state.score;
    const left = CONFIG.TOTAL_QUESTIONS - state.questionsDone;
    DOM.questionsLeft.textContent = left;
    const progress = (state.questionsDone / CONFIG.TOTAL_QUESTIONS) * 100;
    DOM.progressBar.style.width = Math.min(progress, 100) + '%';
}

function showFeedback(isCorrect) {
    const gameArea = DOM.gameArea;
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'feedback';
    
    if (isCorrect) {
        feedbackDiv.innerHTML = '🎉👏 CORRECT! Well done! 🎉👏<br>🏆 +10 points! 🏆';
        feedbackDiv.classList.add('correct');
        playSound('correct');
        state.score += 10;
        showToast('🎉 Correct! Great job!');
    } else {
        feedbackDiv.innerHTML = `👎❌ Oops! The correct answer was ${state.currentAnswer}. Try next! 👎❌`;
        feedbackDiv.classList.add('incorrect');
        playSound('incorrect');
        showToast('❌ Wrong answer!', true);
    }
    
    updateUI();
    gameArea.appendChild(feedbackDiv);
    
    setTimeout(() => {
        state.questionsDone++;
        if (state.questionsDone >= CONFIG.TOTAL_QUESTIONS) {
            endGame();
        } else {
            loadNextQuestion();
        }
    }, 2000);
}

function endGame() {
    const gameArea = DOM.gameArea;
    const level = state.currentLevel;
    state.completedLevels[level] = true;
    updateChecklist();
    
    gameArea.innerHTML = `
        <div style="text-align:center; padding:40px 20px;">
            <div style="font-size:80px;">🏆🎉🏆</div>
            <h2 style="font-family: 'Comic Neue', cursive; margin: 20px 0;">Game Complete!</h2>
            <p style="font-size:2rem; margin:15px; font-weight:700;">Final Score: ${state.score}</p>
            <p style="color: var(--text-muted);">You're a counting master!</p>
            <button class="btn-submit" id="restartBtn" style="margin-top:20px;">🔄 Play Again</button>
        </div>
    `;
    
    document.getElementById('restartBtn')?.addEventListener('click', () => {
        state.score = 0;
        state.questionsDone = 0;
        updateUI();
        loadNextQuestion();
    });
}

// ============================================
// LEVEL 1: BALLOON POP
// ============================================
function loadEasyQuestion() {
    const colors = ['#ff4444', '#44ff44', '#4444ff', '#ffff44', '#ff44ff', '#44ffff'];
    const colorNames = ['Red', 'Green', 'Blue', 'Yellow', 'Pink', 'Cyan'];
    const targetColorIdx = Math.floor(Math.random() * colors.length);
    const targetColor = colors[targetColorIdx];
    const targetColorName = colorNames[targetColorIdx];
    
    const totalBalloons = 25 + Math.floor(Math.random() * 20);
    let targetCount = 0;
    
    const gameArea = DOM.gameArea;
    gameArea.innerHTML = `
        <div style="text-align:center;">
            <h2 style="font-family: 'Comic Neue', cursive;">🎈 Balloon Pop Counting 🎈</h2>
            <p style="font-size:1.2rem; margin:15px 0;">
                Count the <span style="color:${targetColor}; font-weight:bold; font-size:1.8rem;">${targetColorName}</span> balloons!
            </p>
            <div class="balloons-grid" id="balloonsGrid"></div>
            <div class="answer-section">
                <input type="number" id="userAnswer" class="answer-input" placeholder="Enter count">
                <button class="btn-submit" id="submitAnswer">Submit Answer</button>
            </div>
        </div>
    `;
    
    const grid = document.getElementById('balloonsGrid');
    for (let i = 0; i < totalBalloons; i++) {
        const isTarget = Math.random() < 0.3;
        if (isTarget) targetCount++;
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.background = `radial-gradient(circle at 30% 30%, ${isTarget ? targetColor : colors[Math.floor(Math.random() * colors.length)]}, ${isTarget ? targetColor + 'dd' : '#ccccccdd'})`;
        grid.appendChild(balloon);
    }
    state.currentAnswer = targetCount;
    
    document.getElementById('submitAnswer').addEventListener('click', () => {
        const userAns = parseInt(document.getElementById('userAnswer').value);
        if (isNaN(userAns)) { showToast('Please type a number!', true); return; }
        showFeedback(userAns === state.currentAnswer);
    });
    document.getElementById('userAnswer')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') document.getElementById('submitAnswer').click();
    });
}

// ============================================
// LEVEL 2: NUMBER SEARCH
// ============================================
function loadAverageQuestion() {
    const targetNumber = Math.floor(Math.random() * 50) + 1;
    const totalNumbers = 40;
    let targetCount = 0;
    const numbers = [];
    
    for (let i = 0; i < totalNumbers; i++) {
        let num;
        if (Math.random() < 0.25) {
            num = targetNumber;
            targetCount++;
        } else {
            num = Math.floor(Math.random() * 50) + 1;
            while (num === targetNumber) num = Math.floor(Math.random() * 50) + 1;
        }
        numbers.push(num);
    }
    state.currentAnswer = targetCount;
    
    const gameArea = DOM.gameArea;
    gameArea.innerHTML = `
        <div style="text-align:center;">
            <h2 style="font-family: 'Comic Neue', cursive;">🔍 Number Search 🔍</h2>
            <div class="target-number">
                Find this number: <span>${targetNumber}</span>
            </div>
            <p>Count how many times <strong>${targetNumber}</strong> appears below!</p>
            <div class="number-grid" id="numberGrid"></div>
            <div class="answer-section">
                <input type="number" id="userAnswer" class="answer-input" placeholder="How many ${targetNumber}?">
                <button class="btn-submit" id="submitAnswer">Submit Answer</button>
            </div>
        </div>
    `;
    
    const grid = document.getElementById('numberGrid');
    numbers.forEach(num => {
        const card = document.createElement('div');
        card.className = 'number-card';
        card.textContent = num;
        grid.appendChild(card);
    });
    
    document.getElementById('submitAnswer').addEventListener('click', () => {
        const userAns = parseInt(document.getElementById('userAnswer').value);
        if (isNaN(userAns)) { showToast('Type a number!', true); return; }
        showFeedback(userAns === state.currentAnswer);
    });
}

// ============================================
// LEVEL 3: NUMBER PUZZLE
// ============================================
function loadHardQuestion() {
    const ranges = [
        { start: 1, end: 10 },
        { start: 11, end: 20 },
        { start: 5, end: 14 },
        { start: 15, end: 25 }
    ];
    const range = ranges[Math.floor(Math.random() * ranges.length)];
    const numbers = [];
    for (let i = range.start; i <= range.end; i++) numbers.push(i);
    
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    
    state.currentAnswer = range.end - range.start + 1;
    let arranged = [];
    let remaining = [...numbers];
    
    const gameArea = DOM.gameArea;
    gameArea.innerHTML = `
        <div style="text-align:center;">
            <h2 style="font-family: 'Comic Neue', cursive;">🧩 Number Puzzle 🧩</h2>
            <p>Arrange numbers in <strong>ASCENDING order</strong>!</p>
            <div class="puzzle-numbers" id="sourceNumbers"></div>
            <div class="puzzle-slots" id="slots"></div>
            <div class="answer-section">
                <button class="btn-submit" id="checkOrder">Check My Order</button>
            </div>
        </div>
    `;
    
    function render() {
        const sourceDiv = document.getElementById('sourceNumbers');
        const slotsDiv = document.getElementById('slots');
        sourceDiv.innerHTML = '';
        slotsDiv.innerHTML = '';
        
        remaining.forEach(num => {
            const btn = document.createElement('div');
            btn.className = 'puzzle-number';
            btn.textContent = num;
            btn.onclick = () => {
                const idx = remaining.indexOf(num);
                if (idx !== -1) {
                    remaining.splice(idx, 1);
                    arranged.push(num);
                    render();
                }
            };
            sourceDiv.appendChild(btn);
        });
        
        arranged.forEach((num, idx) => {
            const slot = document.createElement('div');
            slot.className = 'puzzle-slot';
            slot.textContent = num;
            slot.onclick = () => {
                const idxArr = arranged.indexOf(num);
                if (idxArr !== -1) {
                    arranged.splice(idxArr, 1);
                    remaining.push(num);
                    remaining.sort((a,b) => a-b);
                    render();
                }
            };
            slotsDiv.appendChild(slot);
        });
        
        for (let i = arranged.length; i < state.currentAnswer; i++) {
            const emptySlot = document.createElement('div');
            emptySlot.className = 'puzzle-slot';
            emptySlot.textContent = '?';
            slotsDiv.appendChild(emptySlot);
        }
    }
    
    render();
    
    document.getElementById('checkOrder').addEventListener('click', () => {
        let isCorrect = (arranged.length === state.currentAnswer);
        for (let i = 0; i < arranged.length - 1; i++) {
            if (arranged[i] > arranged[i+1]) isCorrect = false;
        }
        showFeedback(isCorrect);
    });
}

// ============================================
// LEVEL 4: STORY COUNTING (AI)
// ============================================
async function loadProfessionalQuestion() {
    showLoading(true);
    const story = await getAIStory();
    state.currentAnswer = story.answer;
    showLoading(false);
    
    const gameArea = DOM.gameArea;
    gameArea.innerHTML = `
        <div style="text-align:center;">
            <h2 style="font-family: 'Comic Neue', cursive;">📖 Story Counting (AI Powered) 📖</h2>
            <div class="story-box">
                <p style="font-size:1.2rem; line-height:1.8;">${story.text}</p>
            </div>
            <p style="font-size:1.1rem;">How many objects are in this story?</p>
            <div class="answer-section">
                <input type="number" id="userAnswer" class="answer-input" placeholder="Enter number">
                <button class="btn-submit" id="submitAnswer">Submit Answer</button>
            </div>
        </div>
    `;
    
    document.getElementById('submitAnswer').addEventListener('click', () => {
        const userAns = parseInt(document.getElementById('userAnswer').value);
        if (isNaN(userAns)) { showToast('Type a number!', true); return; }
        showFeedback(userAns === state.currentAnswer);
    });
}

// ============================================
// LOAD NEXT QUESTION
// ============================================
async function loadNextQuestion() {
    showLoading(true);
    await new Promise(r => setTimeout(r, 150));
    
    switch (state.currentLevel) {
        case 'easy': loadEasyQuestion(); break;
        case 'average': loadAverageQuestion(); break;
        case 'hard': loadHardQuestion(); break;
        case 'professional': await loadProfessionalQuestion(); break;
    }
    
    updateUI();
    showLoading(false);
}

// ============================================
// START GAME
// ============================================
async function startGame(level) {
    state.currentLevel = level;
    state.score = 0;
    state.questionsDone = 0;
    
    document.querySelectorAll('.level-card').forEach(card => {
        card.classList.remove('active');
        if (card.dataset.level === level) card.classList.add('active');
    });
    
    updateUI();
    await recordUsage();
    await loadNextQuestion();
    
    // Scroll to game area
    DOM.gameArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================
// SHARE FUNCTION
// ============================================
function shareOn(platform) {
    const url = window.location.href;
    const text = "🎈 Check out Magicrills Counting Game! Learn to count with fun! 🎈";
    
    const shareUrls = {
        facebook: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        email: `mailto:?subject=Magicrills Counting Game&body=${encodeURIComponent(text + '\n' + url)}`
    };
    
    if (platform === 'copy') {
        navigator.clipboard.writeText(url).then(() => {
            showToast('📋 Link copied!');
        }).catch(() => {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = url;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast('📋 Link copied!');
        });
        return;
    }
    
    window.open(shareUrls[platform], '_blank');
    recordShare(platform);
}

// ============================================
// CHECKLIST UPDATE
// ============================================
function updateChecklist() {
    document.querySelectorAll('.checklist-item').forEach(item => {
        const level = item.dataset.level;
        if (state.completedLevels[level]) {
            item.classList.add('completed');
            item.querySelector('.checklist-status').textContent = '✅';
        }
    });
}

// ============================================
// EVENT LISTENERS
// ============================================

// Level Cards
document.querySelectorAll('.level-card').forEach(card => {
    card.addEventListener('click', () => startGame(card.dataset.level));
});

// Reactions
document.querySelectorAll('.reaction').forEach(react => {
    react.addEventListener('click', () => addReaction(react.dataset.emoji));
});

// Share Buttons
document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', () => shareOn(btn.dataset.platform));
});

// Dark Mode
DOM.darkModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    DOM.darkModeBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// Sound
DOM.soundBtn.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    DOM.soundBtn.textContent = state.soundEnabled ? '🔊' : '🔇';
});

// Scroll Buttons
document.getElementById('scrollUp').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
document.getElementById('scrollDown').addEventListener('click', () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
});

// Hero CTA
DOM.heroCta.addEventListener('click', () => {
    document.getElementById('levelsGrid').scrollIntoView({ behavior: 'smooth' });
});

// ============================================
// INIT
// ============================================
async function init() {
    showLoading(true);
    
    // Load stats
    await loadUsageStats();
    await loadReactions();
    
    // Start game
    await startGame('easy');
    
    // Update checklist
    updateChecklist();
    
    showLoading(false);
    
    console.log(`🎈 ${CONFIG.TOOL_NAME} loaded successfully!`);
    console.log(`📊 Tool Slug: ${CONFIG.TOOL_SLUG}`);
    console.log(`📂 Category: ${CONFIG.CATEGORY}`);
    console.log(`👤 User ID: ${userId}`);
}

// Start the app
init();

// ============================================
// SERVICE WORKER REGISTRATION (Optional)
// ============================================
if ('serviceWorker' in navigator) {
    // Register service worker for offline support
    // navigator.serviceWorker.register('/sw.js');
}

// ============================================
// EXPOSE FOR DEBUGGING
// ============================================
window.__magicrills = {
    config: CONFIG,
    state: state,
    userId: userId,
    apiCall: apiCall,
    startGame: startGame,
    shareOn: shareOn,
    addReaction: addReaction,
    loadReactions: loadReactions,
    loadUsageStats: loadUsageStats
};

console.log('🚀 Magicrills Counting Game is ready!');
console.log('💡 Type window.__magicrills for debug info');
