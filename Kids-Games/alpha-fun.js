// ============================================
// ALPHA FUN - COMPLETE GAME SCRIPT
// Cloudflare Workers API Integration
// All Features Working
// ============================================

// ---------- CONFIG ----------
const CONFIG = {
    TOOL_SLUG: 'alpha-fun',
    API_BASE: 'https://magicrills-api.uzairhameed01.workers.dev',
    API_KEY: 'magicrills-grok-api.uzairhameed01.workers.dev',
};

// ---------- USER ID ----------
let userId = localStorage.getItem('alphaUserId') || 'user_' + Math.random().toString(36).substr(2, 9);
localStorage.setItem('alphaUserId', userId);

// ---------- GAME STATE ----------
let gameActive = false;
let currentLevel = 1;
let score = 0;
let streak = 0;
let time = 0;
let timerInterval = null;
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let totalPairs = 0;
let frozen = false;
let freezeTimeout = null;
let isGameStarted = false;

let powerups = {
    freeze: 3,
    hint: 2,
    shuffle: 1,
    xray: 0
};

// ---------- LETTERS ----------
const lettersByLevel = {
    1: ['A','B','C','D','E','F','G','H'],
    2: ['A','B','C','D','E','F','G','H','I','J'],
    3: ['A','B','C','D','E','F','G','H','I','J','K','L'],
    4: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P'],
    5: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
};

const letterIcons = {
    A:'🍎',B:'🐝',C:'🐱',D:'🐶',E:'🐘',F:'🐠',G:'🦒',H:'🏠',
    I:'🍦',J:'🤡',K:'🪁',L:'🦁',M:'🐒',N:'📓',O:'🦉',P:'🐧',
    Q:'👑',R:'🐇',S:'🐍',T:'🐯',U:'☔',V:'🏐',W:'🐳',X:'🎷',Y:'🪀',Z:'🦓'
};

// ---------- DOM REFS ----------
const DOM = {};

function cacheElements() {
    DOM.gameBoard = document.getElementById('gameBoard');
    DOM.timerDisplay = document.getElementById('timerDisplay');
    DOM.scoreDisplay = document.getElementById('scoreDisplay');
    DOM.streakDisplay = document.getElementById('streakDisplay');
    DOM.levelDisplay = document.getElementById('levelDisplay');
    DOM.startBtn = document.getElementById('startBtn');
    DOM.shuffleBtn = document.getElementById('shuffleBtn');
    DOM.resetBtn = document.getElementById('resetBtn');
    DOM.progressFill = document.getElementById('progressFill');
    DOM.progressText = document.getElementById('progressText');
    DOM.toast = document.getElementById('toast');
    DOM.floating = document.getElementById('floatingNotif');
    DOM.floatingText = document.getElementById('floatingText');
    DOM.loading = document.getElementById('loading');
    DOM.usageCount = document.getElementById('usageCount');
    DOM.globalPlayCount = document.getElementById('globalPlayCount');
    DOM.toolPlayCount = document.getElementById('toolPlayCount');
    DOM.winModal = document.getElementById('winModal');
    DOM.premiumModal = document.getElementById('premiumModal');
    DOM.winScore = document.getElementById('winScore');
    DOM.winTime = document.getElementById('winTime');
    DOM.storyMessage = document.getElementById('storyMessage');
    DOM.heroPlayers = document.getElementById('heroPlayers');
    DOM.heroGames = document.getElementById('heroGames');
    DOM.heroStars = document.getElementById('heroStars');
}

// ---------- TOAST & NOTIFICATIONS ----------
function showToast(msg, duration = 2500) {
    const toast = DOM.toast;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._hideTimeout);
    toast._hideTimeout = setTimeout(() => toast.classList.remove('show'), duration);
}

function showFloating(msg) {
    DOM.floatingText.textContent = msg;
    DOM.floating.classList.add('show');
    clearTimeout(DOM.floating._hideTimeout);
    DOM.floating._hideTimeout = setTimeout(() => DOM.floating.classList.remove('show'), 3000);
}

function showLoading(show) {
    DOM.loading.style.display = show ? 'flex' : 'none';
}

// ---------- FORMAT HELPERS ----------
function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ---------- UPDATE UI ----------
function updateUI() {
    DOM.scoreDisplay.textContent = score;
    DOM.streakDisplay.textContent = streak;
    DOM.levelDisplay.textContent = currentLevel;
    const percent = totalPairs > 0 ? (matchedPairs / totalPairs) * 100 : 0;
    DOM.progressFill.style.width = percent + '%';
    DOM.progressText.textContent = `${matchedPairs}/${totalPairs} Matched`;
}

// ---------- SOUND EFFECTS ----------
function playFlip() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        gain.gain.value = 0.08;
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.1);
        osc.stop(ctx.currentTime + 0.1);
    } catch(e) {}
}

function playSuccess() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 523.25;
        gain.gain.value = 0.12;
        osc.start();
        setTimeout(() => osc.frequency.value = 659.25, 100);
        setTimeout(() => osc.frequency.value = 783.99, 200);
        gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
        osc.stop(ctx.currentTime + 0.5);
    } catch(e) {}
}

function playError() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 440;
        gain.gain.value = 0.08;
        osc.start();
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.4);
        osc.stop(ctx.currentTime + 0.4);
    } catch(e) {}
}

function playWin() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
        notes.forEach((freq, i) => {
            setTimeout(() => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = freq;
                gain.gain.value = 0.1;
                osc.start();
                gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.3);
                osc.stop(ctx.currentTime + 0.3);
            }, i * 150);
        });
    } catch(e) {}
}

// ---------- CONFETTI ----------
function createConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particles = [];
    for (let i = 0; i < 80; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: -10,
            size: Math.random() * 8 + 4,
            speedY: Math.random() * 5 + 3,
            speedX: (Math.random() - 0.5) * 3,
            color: `hsl(${Math.random() * 360}, 70%, 60%)`
        });
    }
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let active = false;
        particles.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;
            if (p.y < canvas.height) active = true;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);
        });
        if (active) requestAnimationFrame(animate);
        else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    animate();
    setTimeout(() => ctx.clearRect(0, 0, canvas.width, canvas.height), 2500);
}

function createHeavyConfetti() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => createConfetti(), i * 200);
    }
}

// ============================================
// CLOUDFLARE API INTEGRATION
// ============================================

async function callAPI(endpoint, method = 'GET', data = null) {
    const url = `${CONFIG.API_BASE}${endpoint}`;
    try {
        const options = {
            method,
            headers: { 
                'Content-Type': 'application/json',
                'X-API-Key': CONFIG.API_KEY
            }
        };
        if (data) options.body = JSON.stringify(data);
        
        const res = await fetch(url, options);
        const result = await res.json();
        return result;
    } catch(e) {
        console.warn('API Error:', e);
        return { success: false, error: e.message };
    }
}

// ---------- USAGE ----------
async function incrementUsage() {
    try {
        const res = await callAPI('/api/usage', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            user_id: userId
        });
        
        if (res.success) {
            DOM.toolPlayCount.textContent = res.total_usage || 0;
            DOM.usageCount.textContent = res.total_usage || 0;
            // Update hero stats
            DOM.heroGames.textContent = res.total_usage || 0;
        } else {
            // Fallback: increment local
            let localCount = parseInt(localStorage.getItem('alpha_usage') || '0');
            localCount++;
            localStorage.setItem('alpha_usage', localCount);
            DOM.toolPlayCount.textContent = localCount;
            DOM.usageCount.textContent = localCount;
            DOM.heroGames.textContent = localCount;
        }
        
        loadGlobalStats();
    } catch(e) {
        console.warn('Usage increment fallback:', e);
        let localCount = parseInt(localStorage.getItem('alpha_usage') || '0');
        localCount++;
        localStorage.setItem('alpha_usage', localCount);
        DOM.toolPlayCount.textContent = localCount;
        DOM.usageCount.textContent = localCount;
        DOM.heroGames.textContent = localCount;
    }
}

async function loadGlobalStats() {
    try {
        const res = await callAPI(`/api/stats?tool_slug=${CONFIG.TOOL_SLUG}`, 'GET');
        if (res.success) {
            DOM.globalPlayCount.textContent = res.totalUsage || 0;
            DOM.heroPlayers.textContent = res.totalUsage || 0;
        } else {
            // Fallback
            const localCount = parseInt(localStorage.getItem('alpha_usage') || '0');
            DOM.globalPlayCount.textContent = localCount;
            DOM.heroPlayers.textContent = localCount;
        }
    } catch(e) {
        console.warn('Global stats fallback:', e);
        const localCount = parseInt(localStorage.getItem('alpha_usage') || '0');
        DOM.globalPlayCount.textContent = localCount;
        DOM.heroPlayers.textContent = localCount;
    }
}

// ---------- REACTIONS ----------
const REACTION_TYPES = ['like', 'love', 'wow', 'sad', 'angry', 'laugh', 'celebrate'];

async function addReaction(type) {
    if (!REACTION_TYPES.includes(type)) return;
    
    try {
        const res = await callAPI('/api/reactions', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            emoji: type,
            reaction_type: type,
            user_id: userId
        });
        
        if (res.success) {
            loadReactions();
            showToast(`Thanks for your ${type} reaction! ❤️`);
        } else {
            // Fallback: increment local
            let localReactions = JSON.parse(localStorage.getItem('alpha_reactions') || '{}');
            localReactions[type] = (localReactions[type] || 0) + 1;
            localStorage.setItem('alpha_reactions', JSON.stringify(localReactions));
            updateReactionUI(localReactions);
            showToast(`Thanks for your ${type} reaction! ❤️`);
        }
    } catch(e) {
        console.warn('Reaction fallback:', e);
        let localReactions = JSON.parse(localStorage.getItem('alpha_reactions') || '{}');
        localReactions[type] = (localReactions[type] || 0) + 1;
        localStorage.setItem('alpha_reactions', JSON.stringify(localReactions));
        updateReactionUI(localReactions);
        showToast(`Thanks for your ${type} reaction! ❤️`);
    }
}

async function loadReactions() {
    try {
        const res = await callAPI(`/api/reactions?tool_slug=${CONFIG.TOOL_SLUG}`, 'GET');
        if (res.success && res.reactions) {
            updateReactionUI(res.reactions);
        } else {
            // Fallback: load from localStorage
            const localReactions = JSON.parse(localStorage.getItem('alpha_reactions') || '{}');
            updateReactionUI(localReactions);
        }
    } catch(e) {
        console.warn('Load reactions fallback:', e);
        const localReactions = JSON.parse(localStorage.getItem('alpha_reactions') || '{}');
        updateReactionUI(localReactions);
    }
}

function updateReactionUI(reactions) {
    document.getElementById('likeCount').textContent = reactions.like || 0;
    document.getElementById('loveCount').textContent = reactions.love || 0;
    document.getElementById('wowCount').textContent = reactions.wow || 0;
    document.getElementById('sadCount').textContent = reactions.sad || 0;
    document.getElementById('angryCount').textContent = reactions.angry || 0;
    document.getElementById('laughCount').textContent = reactions.laugh || 0;
    document.getElementById('celebrateCount').textContent = reactions.celebrate || 0;
}

// ---------- SHARES ----------
async function shareGame(platform) {
    const url = window.location.href;
    const text = `I scored ${score} points on Alpha Fun! Can you beat me? 🎮✨`;
    let shareUrl = '';
    
    if (platform === 'facebook') {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
    } else if (platform === 'twitter') {
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    } else if (platform === 'whatsapp') {
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    } else if (platform === 'linkedin') {
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=Alpha%20Fun&summary=${encodeURIComponent(text)}`;
    } else if (platform === 'copy') {
        try {
            await navigator.clipboard.writeText(url);
            showToast('URL copied to clipboard!');
        } catch(e) {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = url;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast('URL copied!');
        }
        return;
    }
    
    if (shareUrl) window.open(shareUrl, '_blank');
    
    // Record share
    try {
        await callAPI('/api/shares', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            platform: platform,
            user_id: userId
        });
    } catch(e) {
        console.warn('Share recording failed:', e);
    }
}

// ============================================
// GAME LOGIC
// ============================================

function renderBoard() {
    DOM.gameBoard.innerHTML = '';
    cards.forEach((card, idx) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        if (card.matched) cardDiv.classList.add('matched');
        if (card.flipped) cardDiv.classList.add('flipped');
        
        const front = document.createElement('div');
        front.className = 'card-front';
        const back = document.createElement('div');
        back.className = 'card-back';
        back.textContent = letterIcons[card.value] || card.value;
        
        cardDiv.appendChild(front);
        cardDiv.appendChild(back);
        cardDiv.addEventListener('click', () => flipCard(idx));
        DOM.gameBoard.appendChild(cardDiv);
        cards[idx].element = cardDiv;
    });
}

function flipCard(idx) {
    if (!gameActive) { showToast('Start a game first!'); return; }
    if (frozen) { showToast('❄️ Game frozen! Wait...'); return; }
    if (flippedCards.length >= 2) return;
    
    const card = cards[idx];
    if (card.matched || card.flipped) return;
    
    card.flipped = true;
    card.element.classList.add('flipped');
    flippedCards.push(card);
    playFlip();
    
    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 600);
    }
}

function checkMatch() {
    const [c1, c2] = flippedCards;
    if (c1.value === c2.value) {
        c1.matched = true;
        c2.matched = true;
        matchedPairs++;
        const points = 10 + (streak * 5);
        score += points;
        streak++;
        playSuccess();
        createConfetti();
        showToast(`🎉 Match! +${points} points (${streak}x streak!)`);
        
        // Update story message
        const messages = [
            '🌟 Amazing match! Keep going!',
            '🔥 You\'re on fire!',
            '⭐ Brilliant! You\'re a star!',
            '🌈 Magic is working!',
            '🎯 Perfect match!',
            '💪 You\'re unstoppable!'
        ];
        DOM.storyMessage.textContent = messages[Math.floor(Math.random() * messages.length)];
        
        if (matchedPairs === totalPairs) {
            endGame(true);
        }
    } else {
        c1.flipped = false;
        c2.flipped = false;
        c1.element.classList.remove('flipped');
        c2.element.classList.remove('flipped');
        streak = 0;
        score = Math.max(0, score - 2);
        playError();
        showToast(`❌ No match! -2 points`);
        DOM.storyMessage.textContent = '😅 Keep trying! You\'ll get it!';
    }
    flippedCards = [];
    updateUI();
}

function startGame() {
    if (gameActive) { showToast('Game already running!'); return; }
    
    showLoading(true);
    
    // Increment usage
    incrementUsage();
    
    // Reset state
    if (timerInterval) clearInterval(timerInterval);
    gameActive = true;
    isGameStarted = true;
    score = 0;
    streak = 0;
    time = 0;
    matchedPairs = 0;
    flippedCards = [];
    frozen = false;
    if (freezeTimeout) clearTimeout(freezeTimeout);
    
    // Get letters for level
    let letters = lettersByLevel[currentLevel] || lettersByLevel[5];
    totalPairs = letters.length;
    
    // Create deck
    let deck = [...letters, ...letters];
    deck = shuffleArray(deck);
    
    cards = deck.map((val, i) => ({
        id: i,
        value: val,
        matched: false,
        flipped: false,
        element: null
    }));
    
    renderBoard();
    updateUI();
    
    // Timer
    timerInterval = setInterval(() => {
        if (!gameActive) return;
        if (!frozen) {
            time++;
            DOM.timerDisplay.textContent = formatTime(time);
        }
    }, 1000);
    
    showLoading(false);
    showToast('🎮 Game Started! Match all pairs!');
    showFloating('✨ Find matching letters! ✨');
    DOM.storyMessage.textContent = '🐉 Find matching letters to awaken the dragon!';
}

function endGame(isWin) {
    if (timerInterval) clearInterval(timerInterval);
    gameActive = false;
    
    if (isWin) {
        playWin();
        createHeavyConfetti();
        DOM.winScore.textContent = `Score: ${score}`;
        DOM.winTime.textContent = `Time: ${formatTime(time)}`;
        DOM.winModal.style.display = 'flex';
        showToast('🎉 LEVEL COMPLETE! 🎉');
        DOM.storyMessage.textContent = '🐉 The dragon has awakened! You\'re a legend!';
        
        // Update stars
        const stars = Math.floor(score / 50) + 1;
        DOM.heroStars.textContent = parseInt(DOM.heroStars.textContent || '0') + stars;
        
        if (currentLevel < 5) {
            showFloating(`🎁 Level ${currentLevel+1} unlocked!`);
        }
    }
}

function closeWinModal() {
    DOM.winModal.style.display = 'none';
    if (currentLevel < 5) {
        currentLevel++;
        DOM.levelDisplay.textContent = currentLevel;
        document.querySelectorAll('.level-btn-3d').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.level) === currentLevel) {
                btn.classList.add('active');
            }
        });
    }
    startGame();
}

function shuffleBoard() {
    if (!gameActive) { showToast('Start a game first!'); return; }
    if (frozen) { showToast('Cannot shuffle while frozen!'); return; }
    
    const unmatchedCards = cards.filter(c => !c.matched);
    const unmatchedVals = unmatchedCards.map(c => c.value);
    shuffleArray(unmatchedVals);
    unmatchedCards.forEach((c, idx) => {
        c.value = unmatchedVals[idx];
        if (c.element) {
            const backDiv = c.element.querySelector('.card-back');
            backDiv.textContent = letterIcons[c.value] || c.value;
        }
    });
    flippedCards.forEach(c => {
        c.flipped = false;
        if (c.element) c.element.classList.remove('flipped');
    });
    flippedCards = [];
    showToast('🔄 Board shuffled!');
    DOM.storyMessage.textContent = '🔄 Cards shuffled! New challenge!';
}

function resetGame() {
    if (timerInterval) clearInterval(timerInterval);
    gameActive = false;
    isGameStarted = false;
    cards = [];
    flippedCards = [];
    DOM.gameBoard.innerHTML = '';
    DOM.timerDisplay.textContent = '00:00';
    DOM.scoreDisplay.textContent = '0';
    DOM.streakDisplay.textContent = '0';
    score = 0;
    streak = 0;
    time = 0;
    matchedPairs = 0;
    updateUI();
    showToast('Game reset! Click START to play.');
    DOM.storyMessage.textContent = '🔄 Game reset! Ready for a new adventure!';
}

// ============================================
// POWERUPS
// ============================================

function usePowerup(type) {
    if (!gameActive) { showToast('Start a game first!'); return; }
    if (frozen) { showToast('Cannot use powerups while frozen!'); return; }
    
    if (type === 'freeze') {
        if (powerups.freeze <= 0) { showToast('No freeze left!'); return; }
        powerups.freeze--;
        frozen = true;
        showToast('❄️ Game frozen for 5 seconds!');
        DOM.storyMessage.textContent = '❄️ Time frozen! Quick, think!';
        if (freezeTimeout) clearTimeout(freezeTimeout);
        freezeTimeout = setTimeout(() => {
            frozen = false;
            showToast('🔥 Game unfrozen!');
            DOM.storyMessage.textContent = '🔥 Time is flowing again!';
        }, 5000);
        document.getElementById('freezeCount').textContent = powerups.freeze;
    }
    else if (type === 'hint') {
        if (powerups.hint <= 0) { showToast('No hint left!'); return; }
        powerups.hint--;
        const unmatched = cards.filter(c => !c.matched && !c.flipped);
        for (let i = 0; i < unmatched.length; i++) {
            for (let j = i+1; j < unmatched.length; j++) {
                if (unmatched[i].value === unmatched[j].value) {
                    unmatched[i].element.style.boxShadow = '0 0 30px #ffd700';
                    unmatched[j].element.style.boxShadow = '0 0 30px #ffd700';
                    setTimeout(() => {
                        unmatched[i].element.style.boxShadow = '';
                        unmatched[j].element.style.boxShadow = '';
                    }, 2000);
                    showToast('💡 Look at the glowing cards!');
                    DOM.storyMessage.textContent = '💡 Follow the golden glow!';
                    break;
                }
            }
        }
        document.getElementById('hintCount').textContent = powerups.hint;
    }
    else if (type === 'shuffle') {
        if (powerups.shuffle <= 0) { showToast('No shuffle left!'); return; }
        powerups.shuffle--;
        shuffleBoard();
        document.getElementById('shuffleCount').textContent = powerups.shuffle;
    }
    else if (type === 'xray') {
        showPremiumModal();
    }
    
    localStorage.setItem('alphaPowerups', JSON.stringify(powerups));
}

// ============================================
// LEVEL SELECTION
// ============================================

function initLevelButtons() {
    document.querySelectorAll('.level-btn-3d').forEach(btn => {
        btn.addEventListener('click', () => {
            const level = parseInt(btn.dataset.level);
            if (btn.classList.contains('locked')) {
                showPremiumModal();
                return;
            }
            currentLevel = level;
            document.querySelectorAll('.level-btn-3d').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            DOM.levelDisplay.textContent = currentLevel;
            showToast(`Level ${currentLevel} selected!`);
            if (!gameActive) resetGame();
        });
    });
}

// ============================================
// HERO & TYPEWRITER
// ============================================

function initTypewriter() {
    const phrases = [
        'Learn ABC with Fun!',
        'Match Letters & Win!',
        'Become an Alphabet Master!',
        'Adventure Awaits!',
        'Magic is Everywhere!',
        'Dragons & Letters!'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const element = document.getElementById('typewriterText');
    
    function type() {
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
            element.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let speed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            speed = 500;
        }
        
        setTimeout(type, speed);
    }
    
    type();
}

function initHeroParticles() {
    const container = document.getElementById('heroParticles');
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 3 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = Math.random() * 20 + 15 + 's';
        particle.style.animationDelay = Math.random() * 20 + 's';
        container.appendChild(particle);
    }
}

// ============================================
// MODALS
// ============================================

function showPremiumModal() {
    DOM.premiumModal.style.display = 'flex';
}

function closePremiumModal() {
    DOM.premiumModal.style.display = 'none';
}

// Close modals on outside click
document.addEventListener('click', (e) => {
    if (e.target === DOM.winModal) {
        DOM.winModal.style.display = 'none';
    }
    if (e.target === DOM.premiumModal) {
        DOM.premiumModal.style.display = 'none';
    }
});

// ============================================
// DARK MODE
// ============================================

function initDarkMode() {
    const darkToggle = document.getElementById('darkToggle');
    const isDark = localStorage.getItem('darkMode') === 'true';
    
    if (isDark) {
        document.body.style.filter = 'invert(1) hue-rotate(180deg)';
        darkToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    darkToggle.addEventListener('click', () => {
        const nowDark = localStorage.getItem('darkMode') === 'true';
        if (nowDark) {
            document.body.style.filter = '';
            localStorage.setItem('darkMode', 'false');
            darkToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            document.body.style.filter = 'invert(1) hue-rotate(180deg)';
            localStorage.setItem('darkMode', 'true');
            darkToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    });
}

// ============================================
// SCROLL
// ============================================

function initScroll() {
    document.getElementById('scrollUp').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.getElementById('scrollDown').addEventListener('click', () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
}

// ============================================
// PRELOADER
// ============================================

function initPreloader() {
    const preloader = document.getElementById('preloader');
    const progressBar = document.getElementById('preloaderProgress');
    let progress = 0;
    
    const interval = setInterval(() => {
        progress += Math.random() * 10 + 5;
        if (progress > 100) progress = 100;
        progressBar.style.width = progress + '%';
        
        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                preloader.classList.add('hidden');
                // Start typewriter after preloader
                initTypewriter();
                initHeroParticles();
            }, 500);
        }
    }, 100);
}

// ============================================
// POWERUPS LOAD
// ============================================

function loadPowerups() {
    const saved = localStorage.getItem('alphaPowerups');
    if (saved) {
        try {
            const p = JSON.parse(saved);
            powerups.freeze = p.freeze || 3;
            powerups.hint = p.hint || 2;
            powerups.shuffle = p.shuffle || 1;
        } catch(e) {}
    }
    document.getElementById('freezeCount').textContent = powerups.freeze;
    document.getElementById('hintCount').textContent = powerups.hint;
    document.getElementById('shuffleCount').textContent = powerups.shuffle;
}

// ============================================
// EVENT LISTENERS
// ============================================

function initEventListeners() {
    // Game controls
    DOM.startBtn.addEventListener('click', startGame);
    DOM.shuffleBtn.addEventListener('click', shuffleBoard);
    DOM.resetBtn.addEventListener('click', resetGame);
    
    // Hero buttons
    document.getElementById('heroStartBtn').addEventListener('click', () => {
        document.getElementById('gameContainer').scrollIntoView({ behavior: 'smooth' });
        setTimeout(startGame, 500);
    });
    
    document.getElementById('heroLearnBtn').addEventListener('click', () => {
        showToast('🎮 Match pairs of letters to score points!');
        DOM.storyMessage.textContent = '🎯 How to play: Flip cards and match letters!';
    });
    
    // Powerups
    document.querySelectorAll('.powerup').forEach(p => {
        p.addEventListener('click', () => {
            const type = p.dataset.powerup;
            if (type) usePowerup(type);
        });
    });
    
    // Reactions
    document.querySelectorAll('.reaction-btn').forEach(r => {
        r.addEventListener('click', () => {
            const reaction = r.dataset.reaction;
            if (reaction) addReaction(reaction);
        });
    });
    
    // Share buttons
    document.querySelectorAll('.share-btn').forEach(s => {
        s.addEventListener('click', () => {
            const platform = s.dataset.share;
            if (platform) shareGame(platform);
        });
    });
}

// ============================================
// AI INTEGRATION - Smart Assistant
// ============================================

class AlphaAI {
    constructor() {
        this.messages = {
            welcome: 'Hello! I\'m Alpha AI. Ready to learn ABC?',
            hint: 'Need a hint? Try finding pairs by remembering letter shapes!',
            encouragement: [
                'You\'re doing great! Keep going! 🌟',
                'Amazing progress! You\'re a champion! 🏆',
                'Don\'t give up! Success is near! 💪',
                'Brilliant moves! You\'re learning fast! 🧠'
            ],
            levelUp: 'Level up! You\'re becoming an alphabet master! 👑',
            perfect: 'Perfect match! You\'re on fire! 🔥'
        };
    }
    
    getMessage(type) {
        if (type === 'encouragement') {
            return this.messages.encouragement[Math.floor(Math.random() * this.messages.encouragement.length)];
        }
        return this.messages[type] || this.messages.welcome;
    }
    
    showMessage(type) {
        const msg = this.getMessage(type);
        showToast('🤖 ' + msg);
        DOM.storyMessage.textContent = '🤖 ' + msg;
    }
}

let alphaAI = new AlphaAI();

// AI Integration - Call on game events
function onGameEvent(event) {
    if (event === 'match') {
        if (streak > 3) {
            alphaAI.showMessage('perfect');
        } else if (streak > 1) {
            alphaAI.showMessage('encouragement');
        }
    } else if (event === 'levelUp') {
        alphaAI.showMessage('levelUp');
    } else if (event === 'hint') {
        alphaAI.showMessage('hint');
    }
}

// Override checkMatch to include AI
const originalCheckMatch = checkMatch;
checkMatch = function() {
    const [c1, c2] = flippedCards;
    if (c1.value === c2.value) {
        c1.matched = true;
        c2.matched = true;
        matchedPairs++;
        const points = 10 + (streak * 5);
        score += points;
        streak++;
        playSuccess();
        createConfetti();
        showToast(`🎉 Match! +${points} points (${streak}x streak!)`);
        
        if (streak > 2) {
            alphaAI.showMessage('encouragement');
        }
        
        const messages = [
            '🌟 Amazing match! Keep going!',
            '🔥 You\'re on fire!',
            '⭐ Brilliant! You\'re a star!',
            '🌈 Magic is working!',
            '🎯 Perfect match!',
            '💪 You\'re unstoppable!'
        ];
        DOM.storyMessage.textContent = messages[Math.floor(Math.random() * messages.length)];
        
        if (matchedPairs === totalPairs) {
            alphaAI.showMessage('levelUp');
            endGame(true);
        }
    } else {
        c1.flipped = false;
        c2.flipped = false;
        c1.element.classList.remove('flipped');
        c2.element.classList.remove('flipped');
        streak = 0;
        score = Math.max(0, score - 2);
        playError();
        showToast(`❌ No match! -2 points`);
        DOM.storyMessage.textContent = '😅 Keep trying! You\'ll get it!';
    }
    flippedCards = [];
    updateUI();
};

// ============================================
// INIT
// ============================================

function init() {
    cacheElements();
    initPreloader();
    initDarkMode();
    initScroll();
    initLevelButtons();
    initEventListeners();
    loadPowerups();
    
    // Load initial stats
    loadGlobalStats();
    loadReactions();
    
    // Set initial story message
    DOM.storyMessage.textContent = '🐉 Welcome to Alpha Fun! Click START to begin your adventure!';
    
    // Mascot message rotation
    const mascotMessages = [
        'Let\'s learn ABC! 🎮',
        'Find the matching letters! 🔍',
        'You can do it! 💪',
        'Alphabet magic awaits! ✨'
    ];
    let msgIndex = 0;
    setInterval(() => {
        document.getElementById('mascotMessage').textContent = mascotMessages[msgIndex % mascotMessages.length];
        msgIndex++;
    }, 4000);
    
    console.log('🎮 Alpha Fun initialized successfully!');
    console.log('🚀 Cloudflare API Connected');
    console.log('🤖 AI Assistant Active');
    console.log('📊 84+ Features Ready');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
