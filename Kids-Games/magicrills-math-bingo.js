// ============================================================
// MAGICRILLS MATH BINGO - Cloudflare Workers API Integration
// ============================================================

// ===== CONFIGURATION =====
const CONFIG = {
    TOOL_SLUG: 'magicrills-math-bingo',
    TOOL_NAME: 'MagicRills Math Bingo',
    CATEGORY: 'Kids-Games',
    API_BASE: 'https://magicrills-api.uzairhameed01.workers.dev',
    API_KEY: 'magicrills-grok-api.uzairhameed01.workers.dev'
};

// ===== STATE =====
let state = {
    score: 0,
    bingos: 0,
    streak: 0,
    usageCount: 0,
    currentCard: [],
    markedState: [],
    currentQuestion: null,
    currentAnswer: null,
    questionHistory: [],
    userId: 'user_' + Math.random().toString(36).substr(2, 9),
    reactions: { like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0 },
    shares: 0,
    views: 0,
    followers: 0,
    checklist: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    checklistMax: { 1: 5, 2: 1, 3: 10, 4: 100, 5: 4 }
};

// ===== DOM REFS =====
const $ = id => document.getElementById(id);
const dom = {
    loading: $('loadingOverlay'),
    score: $('score'),
    bingos: $('bingos'),
    streak: $('streak'),
    usageCount: $('usageCount'),
    heroUsage: $('heroUsage'),
    heroGames: $('heroGames'),
    heroBingos: $('heroBingos'),
    questionText: $('questionText'),
    answerInput: $('answerInput'),
    submitBtn: $('submitBtn'),
    nextBtn: $('nextBtn'),
    newGameBtn: $('newGameBtn'),
    levelSelect: $('levelSelect'),
    bingoGrid: $('bingoGrid'),
    reactionsRow: $('reactionsRow'),
    shareButtons: $('shareButtons'),
    shareCount: $('shareCount'),
    viewCount: $('viewCount'),
    followerCount: $('followerCount'),
    progressDisplay: $('progressDisplay'),
    checklistGrid: $('checklistGrid'),
    bingoCelebration: $('bingoCelebration'),
    closeCelebration: $('closeCelebration'),
    toastContainer: $('toastContainer'),
    heroStartBtn: $('heroStartBtn'),
    powerup: $('powerup'),
    typewriterText: $('typewriterText')
};

// ============================================================
// 1. CLOUDFLARE API FUNCTIONS
// ============================================================

async function callAPI(endpoint, method = 'POST', data = null) {
    const url = `${CONFIG.API_BASE}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        'X-API-Key': CONFIG.API_KEY
    };
    const options = { method, headers };
    if (data) options.body = JSON.stringify(data);

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            console.warn(`API call failed: ${response.status}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.warn('API error:', error.message);
        return null;
    }
}

// --- Usage Counter ---
async function incrementUsage() {
    const result = await callAPI('/api/usage', 'POST', {
        tool_slug: CONFIG.TOOL_SLUG,
        user_id: state.userId
    });
    if (result) {
        state.usageCount = result.usage || state.usageCount;
        updateUsageDisplay();
        saveToLocal();
    } else {
        // Fallback: increment locally
        state.usageCount++;
        updateUsageDisplay();
        saveToLocal();
    }
}

// --- Reactions ---
async function addReaction(type) {
    const result = await callAPI('/api/reactions', 'POST', {
        tool_slug: CONFIG.TOOL_SLUG,
        reaction_type: type,
        user_id: state.userId
    });
    if (result) {
        state.reactions = result.reactions || state.reactions;
        renderReactions();
        saveToLocal();
    } else {
        // Fallback: increment locally
        state.reactions[type] = (state.reactions[type] || 0) + 1;
        renderReactions();
        saveToLocal();
    }
}

// --- Shares ---
async function recordShare(platform) {
    const result = await callAPI('/api/shares', 'POST', {
        tool_slug: CONFIG.TOOL_SLUG,
        platform: platform,
        user_id: state.userId
    });
    if (result) {
        state.shares = result.shares || state.shares;
        updateSocialStats();
        saveToLocal();
    } else {
        state.shares++;
        updateSocialStats();
        saveToLocal();
    }
}

// --- Stats ---
async function fetchStats() {
    const result = await callAPI(`/api/stats?tool_slug=${CONFIG.TOOL_SLUG}`, 'GET');
    if (result) {
        state.usageCount = result.usage || state.usageCount;
        state.shares = result.shares || state.shares;
        state.views = result.views || state.views;
        state.followers = result.followers || state.followers;
        if (result.reactions) {
            Object.assign(state.reactions, result.reactions);
        }
        updateAllDisplays();
        saveToLocal();
    }
}

// ============================================================
// 2. LOCAL STORAGE FALLBACK
// ============================================================

function saveToLocal() {
    try {
        const data = {
            score: state.score,
            bingos: state.bingos,
            streak: state.streak,
            usageCount: state.usageCount,
            reactions: state.reactions,
            shares: state.shares,
            views: state.views,
            followers: state.followers,
            checklist: state.checklist
        };
        localStorage.setItem(`${CONFIG.TOOL_SLUG}_data`, JSON.stringify(data));
    } catch (e) { /* ignore */ }
}

function loadFromLocal() {
    try {
        const raw = localStorage.getItem(`${CONFIG.TOOL_SLUG}_data`);
        if (!raw) return false;
        const data = JSON.parse(raw);
        state.score = data.score || 0;
        state.bingos = data.bingos || 0;
        state.streak = data.streak || 0;
        state.usageCount = data.usageCount || 0;
        if (data.reactions) Object.assign(state.reactions, data.reactions);
        state.shares = data.shares || 0;
        state.views = data.views || 0;
        state.followers = data.followers || 0;
        if (data.checklist) Object.assign(state.checklist, data.checklist);
        return true;
    } catch (e) { return false; }
}

// ============================================================
// 3. TYPEWRITER ANIMATION
// ============================================================

const typewriterPhrases = [
    'Solve equations like a pro! 🧠',
    'Mark your card and win! 🎯',
    'Learn math the fun way! 📚',
    'AI-powered learning! 🤖',
    'Get BINGO and earn points! 🏆',
    'Challenge your brain! 💪',
    'Math is magic! ✨',
    'Level up your skills! 🚀'
];

let typewriterIndex = 0;
let typewriterCharIndex = 0;
let typewriterIsDeleting = false;

function typewriterEffect() {
    const currentPhrase = typewriterPhrases[typewriterIndex];
    const displayText = typewriterIsDeleting
        ? currentPhrase.substring(0, typewriterCharIndex - 1)
        : currentPhrase.substring(0, typewriterCharIndex + 1);

    dom.typewriterText.textContent = displayText;

    if (!typewriterIsDeleting && typewriterCharIndex === currentPhrase.length) {
        typewriterIsDeleting = true;
        setTimeout(typewriterEffect, 2000);
        return;
    }

    if (typewriterIsDeleting && typewriterCharIndex === 0) {
        typewriterIsDeleting = false;
        typewriterIndex = (typewriterIndex + 1) % typewriterPhrases.length;
        setTimeout(typewriterEffect, 500);
        return;
    }

    const speed = typewriterIsDeleting ? 30 : 60;
    typewriterCharIndex += typewriterIsDeleting ? -1 : 1;
    setTimeout(typewriterEffect, speed);
}

// ============================================================
// 4. SPACE BACKGROUND GENERATOR
// ============================================================

function generateStars() {
    const container = document.getElementById('starsContainer');
    for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = (1 + Math.random() * 2) + 'px';
        star.style.height = star.style.width;
        star.style.setProperty('--duration', (2 + Math.random() * 4) + 's');
        star.style.animationDelay = Math.random() * 4 + 's';
        star.style.opacity = 0.3 + Math.random() * 0.7;
        container.appendChild(star);
    }
}
generateStars();

// ============================================================
// 5. MATH BINGO ENGINE
// ============================================================

// Question Types
const questionTypes = ['equation', 'operator', 'complete', 'word', 'estimate', 'missing', 'compare', 'pattern'];

function generateQuestion(level) {
    let available = [...questionTypes];
    if (state.questionHistory.length > 0) {
        available = available.filter(t => t !== state.questionHistory[state.questionHistory.length - 1]);
    }
    const type = available[Math.floor(Math.random() * available.length)];
    state.questionHistory.push(type);
    if (state.questionHistory.length > 20) state.questionHistory.shift();

    let min = -20, max = 50;
    if (level === 'easy') { min = 1; max = 25; }
    else if (level === 'average') { min = 1; max = 50; }
    else if (level === 'hard') { min = -30; max = 70; }
    else { min = -50; max = 100; }

    let a, b, c, answer, text;

    switch (type) {
        case 'equation': {
            const op = ['+', '-', '*', '/'][Math.floor(Math.random() * 4)];
            a = Math.floor(Math.random() * (max - min + 1)) + min;
            b = Math.floor(Math.random() * (max - min + 1)) + min;
            if (op === '/') { b = Math.max(1, b); a = b * (Math.floor(Math.random() * 10) + 1); answer = a / b; }
            else if (op === '*') answer = a * b;
            else if (op === '+') answer = a + b;
            else answer = a - b;
            text = `${a} ${op} ${b} = ?`;
            break;
        }
        case 'operator': {
            a = Math.floor(Math.random() * 50) + 1;
            b = Math.floor(Math.random() * 50) + 1;
            const result = Math.random() > 0.5 ? a + b : a - b;
            text = `${a} ? ${b} = ${result}`;
            answer = result === a + b ? '+' : '-';
            break;
        }
        case 'complete': {
            a = Math.floor(Math.random() * 50) + 1;
            const target = a + Math.floor(Math.random() * 30) + 1;
            text = `${a} + ___ = ${target}`;
            answer = target - a;
            break;
        }
        case 'word': {
            const items = ['apples', 'coins', 'stars', 'gems', 'points'];
            const item = items[Math.floor(Math.random() * items.length)];
            const num1 = Math.floor(Math.random() * 30) + 5;
            const num2 = Math.floor(Math.random() * 15) + 1;
            text = `You have ${num1} ${item}. Give ${num2} away. How many left?`;
            answer = num1 - num2;
            break;
        }
        case 'estimate': {
            a = Math.floor(Math.random() * 90) + 10;
            b = Math.floor(Math.random() * 90) + 10;
            text = `Estimate: ${a} + ${b} ≈ ?`;
            answer = Math.round((a + b) / 10) * 10;
            break;
        }
        case 'missing': {
            const start = Math.floor(Math.random() * 20) + 1;
            const diff = Math.floor(Math.random() * 5) + 1;
            text = `${start}, ${start + diff}, __, ${start + diff * 3}`;
            answer = start + diff * 2;
            break;
        }
        case 'compare': {
            a = Math.floor(Math.random() * 100);
            b = Math.floor(Math.random() * 100);
            text = `${a} ___ ${b}`;
            answer = a < b ? '<' : (a > b ? '>' : '=');
            break;
        }
        default: {
            text = `5 + 3 = ?`;
            answer = 8;
        }
    }
    return { text, answer: typeof answer === 'number' ? Math.round(answer * 100) / 100 : answer, type };
}

function generateCard() {
    const level = dom.levelSelect.value;
    let min = 1, max = 25;
    if (level === 'average') { min = 1; max = 50; }
    else if (level === 'hard') { min = -20; max = 50; }
    else if (level === 'professional') { min = -50; max = 100; }

    const numbers = new Set();
    while (numbers.size < 24) {
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        numbers.add(num);
    }
    const nums = Array.from(numbers);
    const card = [...nums.slice(0, 12), 'FREE', ...nums.slice(12)];
    return card;
}

function renderCard() {
    const grid = dom.bingoGrid;
    grid.innerHTML = '';
    let markedCount = 0;
    for (let i = 0; i < 25; i++) {
        const tile = document.createElement('div');
        tile.className = 'bingo-tile';
        if (state.currentCard[i] === 'FREE') tile.classList.add('free');
        if (state.markedState[i]) {
            tile.classList.add('marked');
            markedCount++;
        }
        tile.innerHTML = `<span class="tile-number">${state.currentCard[i] === 'FREE' ? '⭐' : state.currentCard[i]}</span>`;
        tile.onclick = () => handleTileClick(i);
        grid.appendChild(tile);
    }
    dom.progressDisplay.textContent = `${markedCount}/25`;
    updateChecklist();
}

function handleTileClick(index) {
    if (state.markedState[index]) return;
    if (state.currentCard[index] === 'FREE') {
        state.markedState[index] = true;
        renderCard();
        playSound('mark');
        checkBingo();
    } else {
        showToast('🔓 Solve the question first!', '#ff6b00');
    }
}

function loadNewQuestion() {
    const level = dom.levelSelect.value;
    state.currentQuestion = generateQuestion(level);
    state.currentAnswer = state.currentQuestion.answer;
    dom.questionText.textContent = `❓ ${state.currentQuestion.text}`;
    dom.answerInput.value = '';
    dom.answerInput.focus();
}

function submitAnswer() {
    const userVal = dom.answerInput.value.trim();
    if (!userVal) {
        showToast('📝 Enter your answer!', '#ff4444');
        return;
    }

    let isCorrect = false;
    const correctAns = state.currentAnswer;
    if (typeof correctAns === 'number') {
        if (parseFloat(userVal) === correctAns) isCorrect = true;
    } else {
        if (userVal.toLowerCase() === correctAns.toString().toLowerCase()) isCorrect = true;
    }

    if (isCorrect) {
        playSound('correct');
        const added = 10 + Math.floor(state.streak / 2);
        state.score += added;
        state.streak++;
        updateScoreDisplay();
        showToast(`✅ CORRECT! +${added} POINTS`, '#00ff88');

        // Try to mark matching number
        const numVal = parseFloat(userVal);
        if (!isNaN(numVal)) {
            let markedAny = false;
            for (let i = 0; i < state.currentCard.length; i++) {
                if (!state.markedState[i] && state.currentCard[i] !== 'FREE' && parseFloat(state.currentCard[i]) === numVal) {
                    state.markedState[i] = true;
                    renderCard();
                    playSound('mark');
                    markedAny = true;
                    checkBingo();
                    break;
                }
            }
            if (!markedAny) showToast('⚡ Correct! Number not on card.', '#ffaa00');
        } else {
            showToast('⚡ Correct answer!', '#00ff88');
        }
        loadNewQuestion();
        saveToLocal();
    } else {
        playSound('wrong');
        state.streak = 0;
        state.score = Math.max(0, state.score - 5);
        updateScoreDisplay();
        showToast(`❌ Wrong! Answer: ${correctAns}`, '#ff4444');
        dom.answerInput.value = '';
        dom.answerInput.focus();
        saveToLocal();
    }
}

function checkBingo() {
    // Rows
    for (let i = 0; i < 5; i++) {
        let rowWin = true;
        for (let j = 0; j < 5; j++) if (!state.markedState[i * 5 + j]) rowWin = false;
        if (rowWin) return triggerBingo();
    }
    // Columns
    for (let i = 0; i < 5; i++) {
        let colWin = true;
        for (let j = 0; j < 5; j++) if (!state.markedState[i + j * 5]) colWin = false;
        if (colWin) return triggerBingo();
    }
    // Diagonals
    let diag1 = true, diag2 = true;
    for (let i = 0; i < 5; i++) {
        if (!state.markedState[i * 6]) diag1 = false;
        if (!state.markedState[4 + i * 4]) diag2 = false;
    }
    if (diag1 || diag2) return triggerBingo();
}

function triggerBingo() {
    playSound('bingo');
    state.bingos++;
    state.score += 50;
    state.streak += 5;
    updateScoreDisplay();
    dom.bingoCelebration.style.display = 'flex';
    for (let i = 0; i < 50; i++) createConfetti();
    saveToLocal();
}

function createConfetti() {
    const conf = document.createElement('div');
    conf.style.position = 'fixed';
    conf.style.left = Math.random() * 100 + '%';
    conf.style.top = '-10px';
    conf.style.width = (6 + Math.random() * 8) + 'px';
    conf.style.height = conf.style.width;
    conf.style.background = `hsl(${Math.random() * 360}, 100%, 60%)`;
    conf.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    conf.style.zIndex = '999';
    conf.style.pointerEvents = 'none';
    document.body.appendChild(conf);
    let pos = 0;
    const interval = setInterval(() => {
        pos += 3 + Math.random() * 4;
        conf.style.top = pos + 'px';
        conf.style.left = (parseFloat(conf.style.left) + (Math.random() - 0.5) * 2) + '%';
        if (pos > window.innerHeight + 50) {
            clearInterval(interval);
            conf.remove();
        }
    }, 20);
    setTimeout(() => { clearInterval(interval); conf.remove(); }, 3000);
}

// ============================================================
// 6. CHECKLIST SYSTEM
// ============================================================

function updateChecklist() {
    const marked = state.markedState.filter(m => m).length;
    state.checklist[1] = Math.min(state.checklist[1] + (state.checklist[1] < state.checklistMax[1] ? 1 : 0), state.checklistMax[1]);
    state.checklist[2] = state.bingos > 0 ? 1 : 0;
    state.checklist[3] = Math.min(state.streak, state.checklistMax[3]);
    state.checklist[4] = Math.min(state.score, state.checklistMax[4]);
    
    const levelsDone = ['easy', 'average', 'hard', 'professional'];
    let mastered = 0;
    for (const lvl of levelsDone) {
        if (state.score > 50) mastered++;
    }
    state.checklist[5] = Math.min(mastered, state.checklistMax[5]);

    const items = dom.checklistGrid.querySelectorAll('.checklist-item');
    items.forEach(item => {
        const id = parseInt(item.dataset.check);
        const current = state.checklist[id] || 0;
        const max = state.checklistMax[id];
        const progress = item.querySelector('.checklist-progress');
        const icon = item.querySelector('.checklist-icon');
        progress.textContent = `${current}/${max}`;
        if (current >= max) {
            item.classList.add('completed');
            icon.textContent = '✅';
        } else {
            item.classList.remove('completed');
            icon.textContent = '⬜';
        }
    });
    saveToLocal();
}

// ============================================================
// 7. REACTIONS
// ============================================================

const reactionEmojis = {
    like: '👍',
    love: '❤️',
    wow: '😮',
    sad: '😢',
    angry: '😠',
    laugh: '😂',
    celebrate: '🎉'
};

function renderReactions() {
    const row = dom.reactionsRow;
    row.innerHTML = Object.keys(reactionEmojis).map(r => `
        <div class="reaction-item ${r}" data-reaction="${r}">
            <span class="reaction-emoji">${reactionEmojis[r]}</span>
            <span class="reaction-count" id="count-${r}">${state.reactions[r] || 0}</span>
        </div>
    `).join('');

    row.querySelectorAll('.reaction-item').forEach(el => {
        el.onclick = async () => {
            const type = el.dataset.reaction;
            await addReaction(type);
        };
    });
}

// ============================================================
// 8. SHARE BUTTONS
// ============================================================

function renderShares() {
    const platforms = [
        { key: 'Facebook', icon: '📘' },
        { key: 'Twitter', icon: '🐦' },
        { key: 'WhatsApp', icon: '💬' },
        { key: 'LinkedIn', icon: '💼' },
        { key: 'Copy', icon: '🔗' }
    ];
    const container = dom.shareButtons;
    container.innerHTML = platforms.map(p => `
        <div class="share-icon" data-platform="${p.key}">${p.icon}</div>
    `).join('');

    container.querySelectorAll('.share-icon').forEach(el => {
        el.onclick = async () => {
            const platform = el.dataset.platform;
            if (platform === 'Copy') {
                await navigator.clipboard.writeText(window.location.href);
                showToast('📋 URL Copied!', '#00ff88');
            } else {
                const url = encodeURIComponent(window.location.href);
                const shareUrls = {
                    Facebook: `https://facebook.com/sharer/sharer.php?u=${url}`,
                    Twitter: `https://twitter.com/intent/tweet?url=${url}&text=Check%20out%20this%20awesome%20Math%20Bingo%20game!`,
                    WhatsApp: `https://wa.me/?text=${url}`,
                    LinkedIn: `https://linkedin.com/sharing/share-offsite/?url=${url}`
                };
                window.open(shareUrls[platform], '_blank');
            }
            await recordShare(platform);
        };
    });
}

// ============================================================
// 9. SOUND SYSTEM
// ============================================================

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        gain.gain.value = 0.2;

        if (type === 'correct') {
            osc.frequency.value = 880;
            gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.5);
        } else if (type === 'wrong') {
            osc.frequency.value = 440;
            gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.3);
        } else if (type === 'bingo') {
            osc.frequency.value = 1318.52;
            gain.gain.value = 0.4;
            setTimeout(() => { osc.frequency.value = 1046.5; }, 100);
            setTimeout(() => { osc.frequency.value = 1318.52; }, 200);
            gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.6);
        } else if (type === 'mark') {
            osc.frequency.value = 659.25;
            gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.2);
        }
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) { /* audio not available */ }
}

// ============================================================
// 10. UI HELPERS
// ============================================================

function showToast(message, color = '#00d4ff') {
    const container = dom.toastContainer;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.background = color;
    toast.style.color = '#fff';
    toast.style.boxShadow = `0 0 30px ${color}40`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

function updateScoreDisplay() {
    dom.score.textContent = state.score;
    dom.bingos.textContent = state.bingos;
    dom.streak.textContent = state.streak;
    dom.usageCount.textContent = state.usageCount;
    dom.heroUsage.textContent = state.usageCount;
    dom.heroGames.textContent = state.bingos + Math.floor(state.score / 10);
    dom.heroBingos.textContent = state.bingos;
}

function updateUsageDisplay() {
    dom.usageCount.textContent = state.usageCount;
    dom.heroUsage.textContent = state.usageCount;
}

function updateSocialStats() {
    dom.shareCount.textContent = `📤 ${state.shares || 0} Shares`;
    dom.viewCount.textContent = `👁️ ${state.views || 0} Views`;
    dom.followerCount.textContent = `👥 ${state.followers || 0} Followers`;
}

function updateAllDisplays() {
    updateScoreDisplay();
    updateSocialStats();
    renderReactions();
}

// ============================================================
// 11. NEW GAME
// ============================================================

function newGame() {
    state.currentCard = generateCard();
    state.markedState = new Array(25).fill(false);
    state.markedState[12] = true; // FREE is pre-marked
    renderCard();
    loadNewQuestion();
    dom.answerInput.disabled = false;
    state.usageCount++;
    updateScoreDisplay();
    saveToLocal();
    playSound('mark');
    showToast('🎮 New Game Started!', '#00d4ff');
}

// ============================================================
// 12. INITIALIZATION
// ============================================================

async function init() {
    // Load from local first
    loadFromLocal();

    // Fetch stats from API
    await fetchStats();

    // Start game
    newGame();

    // Render UI
    renderReactions();
    renderShares();
    updateAllDisplays();
    updateChecklist();

    // Start typewriter
    typewriterEffect();

    // Hide loading
    setTimeout(() => {
        dom.loading.classList.add('hidden');
    }, 500);

    // Unlock audio context
    document.body.addEventListener('click', () => {
        if (audioCtx.state === 'suspended') audioCtx.resume();
    });

    // Increment usage on load
    await incrementUsage();
}

// ============================================================
// 13. EVENT LISTENERS
// ============================================================

dom.submitBtn.addEventListener('click', submitAnswer);
dom.nextBtn.addEventListener('click', () => {
    loadNewQuestion();
    playSound('wrong');
    showToast('⏩ Skipped', '#888');
});
dom.newGameBtn.addEventListener('click', newGame);
dom.levelSelect.addEventListener('change', newGame);
dom.answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') submitAnswer();
});
dom.closeCelebration.addEventListener('click', () => {
    dom.bingoCelebration.style.display = 'none';
});
dom.heroStartBtn.addEventListener('click', () => {
    dom.heroStartBtn.scrollIntoView({ behavior: 'smooth' });
});
dom.powerup.addEventListener('click', () => {
    state.score += 25;
    updateScoreDisplay();
    playSound('correct');
    showToast('⚡ POWER-UP! +25 POINTS ⚡', '#ffea00');
    saveToLocal();
});

// ============================================================
// 14. START APP
// ============================================================

document.addEventListener('DOMContentLoaded', init);

console.log(`🚀 ${CONFIG.TOOL_NAME} loaded successfully!`);
console.log(`📊 Tool Slug: ${CONFIG.TOOL_SLUG}`);
console.log(`👤 User ID: ${state.userId}`);
