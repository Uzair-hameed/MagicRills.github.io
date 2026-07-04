// ==================== SOUND SYSTEM ====================
class SoundSystem {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }
    play(freq = 440, dur = 0.2, type = 'sine') {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.frequency.value = freq;
        osc.type = type;
        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + dur);
        osc.start();
        osc.stop(this.ctx.currentTime + dur);
    }
    correct() {
        this.play(523.25, 0.2);
        setTimeout(() => this.play(659.25, 0.2), 120);
        setTimeout(() => this.play(783.99, 0.3), 250);
    }
    wrong() {
        this.play(440, 0.2, 'sawtooth');
        setTimeout(() => this.play(349.23, 0.25, 'sawtooth'), 130);
    }
    levelUp() {
        this.play(523.25, 0.15);
        setTimeout(() => this.play(659.25, 0.15), 100);
        setTimeout(() => this.play(783.99, 0.15), 200);
        setTimeout(() => this.play(1046.5, 0.4), 300);
    }
    gameOver() {
        this.play(220, 0.4, 'triangle');
        setTimeout(() => this.play(196, 0.4, 'triangle'), 250);
        setTimeout(() => this.play(174.61, 0.8, 'triangle'), 500);
    }
    victory() {
        [523.25, 587.33, 659.25, 783.99, 880, 987.77, 1046.5].forEach((n, i) =>
            setTimeout(() => this.play(n, 0.2), i * 120)
        );
    }
    powerup() {
        this.play(880, 0.1);
        setTimeout(() => this.play(1318.52, 0.15), 100);
    }
    click() {
        this.play(660, 0.05);
    }
}

// ==================== API CONFIG ====================
const API_CONFIG = {
    BASE_URL: 'https://magicrills-api.uzairhameed01.workers.dev',
    TOOL_SLUG: 'magic-numbers-comparison-game',
    ENDPOINTS: {
        USAGE: '/api/usage',
        REACTIONS: '/api/reactions',
        SHARES: '/api/shares',
        STATS: '/api/stats'
    }
};

// ==================== API SERVICE ====================
class ApiService {
    constructor() {
        this.baseUrl = API_CONFIG.BASE_URL;
        this.toolSlug = API_CONFIG.TOOL_SLUG;
        this.cache = {
            stats: null,
            reactions: null,
            shares: null
        };
    }

    async _fetch(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.warn('API Error:', error);
            return this._getFallbackData(endpoint);
        }
    }

    _getFallbackData(endpoint) {
        const fallbacks = {
            '/api/stats': () => ({
                usage: parseInt(localStorage.getItem('tool_usage') || '0'),
                shares: parseInt(localStorage.getItem('tool_shares') || '0'),
                reactions: JSON.parse(localStorage.getItem('tool_reactions') || '{}')
            }),
            '/api/reactions': () => ({
                reactions: JSON.parse(localStorage.getItem('tool_reactions') || '{}')
            }),
            '/api/shares': () => ({
                total: parseInt(localStorage.getItem('tool_shares') || '0')
            })
        };
        const fallback = fallbacks[endpoint];
        return fallback ? fallback() : {};
    }

    async incrementUsage() {
        try {
            const result = await this._fetch(API_CONFIG.ENDPOINTS.USAGE, {
                method: 'POST',
                body: JSON.stringify({ tool_slug: this.toolSlug })
            });
            // Update local cache
            const currentUsage = parseInt(localStorage.getItem('tool_usage') || '0');
            localStorage.setItem('tool_usage', currentUsage + 1);
            return result;
        } catch (error) {
            console.warn('Usage increment fallback:', error);
            const currentUsage = parseInt(localStorage.getItem('tool_usage') || '0');
            localStorage.setItem('tool_usage', currentUsage + 1);
            return { success: true, count: currentUsage + 1 };
        }
    }

    async getStats() {
        try {
            const result = await this._fetch(
                `${API_CONFIG.ENDPOINTS.STATS}?tool_slug=${this.toolSlug}`
            );
            this.cache.stats = result;
            // Update localStorage
            if (result.usage) localStorage.setItem('tool_usage', result.usage);
            if (result.shares) localStorage.setItem('tool_shares', result.shares);
            if (result.reactions) localStorage.setItem('tool_reactions', JSON.stringify(result.reactions));
            return result;
        } catch (error) {
            console.warn('Stats fetch fallback:', error);
            return {
                usage: parseInt(localStorage.getItem('tool_usage') || '0'),
                shares: parseInt(localStorage.getItem('tool_shares') || '0'),
                reactions: JSON.parse(localStorage.getItem('tool_reactions') || '{}')
            };
        }
    }

    async addReaction(emoji) {
        try {
            const result = await this._fetch(API_CONFIG.ENDPOINTS.REACTIONS, {
                method: 'POST',
                body: JSON.stringify({
                    tool_slug: this.toolSlug,
                    emoji: emoji
                })
            });
            // Update local cache
            const reactions = JSON.parse(localStorage.getItem('tool_reactions') || '{}');
            reactions[emoji] = (reactions[emoji] || 0) + 1;
            localStorage.setItem('tool_reactions', JSON.stringify(reactions));
            return result;
        } catch (error) {
            console.warn('Reaction add fallback:', error);
            const reactions = JSON.parse(localStorage.getItem('tool_reactions') || '{}');
            reactions[emoji] = (reactions[emoji] || 0) + 1;
            localStorage.setItem('tool_reactions', JSON.stringify(reactions));
            return { success: true };
        }
    }

    async addShare(platform) {
        try {
            const result = await this._fetch(API_CONFIG.ENDPOINTS.SHARES, {
                method: 'POST',
                body: JSON.stringify({
                    tool_slug: this.toolSlug,
                    platform: platform
                })
            });
            // Update local cache
            const currentShares = parseInt(localStorage.getItem('tool_shares') || '0');
            localStorage.setItem('tool_shares', currentShares + 1);
            return result;
        } catch (error) {
            console.warn('Share add fallback:', error);
            const currentShares = parseInt(localStorage.getItem('tool_shares') || '0');
            localStorage.setItem('tool_shares', currentShares + 1);
            return { success: true };
        }
    }

    async getReactions() {
        try {
            const result = await this._fetch(
                `${API_CONFIG.ENDPOINTS.REACTIONS}?tool_slug=${this.toolSlug}`
            );
            this.cache.reactions = result;
            if (result.reactions) {
                localStorage.setItem('tool_reactions', JSON.stringify(result.reactions));
            }
            return result;
        } catch (error) {
            console.warn('Reactions fetch fallback:', error);
            return {
                reactions: JSON.parse(localStorage.getItem('tool_reactions') || '{}')
            };
        }
    }

    async getShares() {
        try {
            const result = await this._fetch(
                `${API_CONFIG.ENDPOINTS.SHARES}?tool_slug=${this.toolSlug}`
            );
            this.cache.shares = result;
            if (result.total) localStorage.setItem('tool_shares', result.total);
            return result;
        } catch (error) {
            console.warn('Shares fetch fallback:', error);
            return {
                total: parseInt(localStorage.getItem('tool_shares') || '0')
            };
        }
    }
}

// ==================== GAME STATE ====================
let gameState = {
    score: 0,
    streak: 0,
    lives: 3,
    currentLevel: 1,
    correctInLevel: 0,
    currentDifficulty: 'easy',
    questionsPerLevel: { easy: 8, medium: 9, hard: 10 },
    usedQuestions: [],
    currentNum1: null,
    currentNum2: null,
    currentAnswer: null,
    timerInterval: null,
    timeLeft: 12,
    doubleScore: false,
    gameActive: false,
    totalCorrect: 0,
    powerups: { hint: 2, skip: 2, double: 1 },
    bossFight: false,
    isGameStarted: false
};

// ==================== DOM ELEMENTS ====================
const DOM = {
    number1: document.getElementById('number1'),
    number2: document.getElementById('number2'),
    vsSymbol: document.getElementById('vsSymbol'),
    greaterBtn: document.getElementById('greaterBtn'),
    lessBtn: document.getElementById('lessBtn'),
    startBtn: document.getElementById('startBtn'),
    score: document.getElementById('score'),
    streak: document.getElementById('streak'),
    lives: document.getElementById('lives'),
    feedback: document.getElementById('feedback'),
    currentLevel: document.getElementById('currentLevel'),
    maxLevel: document.getElementById('maxLevel'),
    progressFill: document.getElementById('progressFill'),
    timerText: document.getElementById('timerText'),
    timerProgress: document.getElementById('timerProgress'),
    usageCount: document.getElementById('usageCount'),
    totalShares: document.getElementById('totalShares'),
    reactionCounts: {
        thumbsup: document.getElementById('react-thumbsup'),
        heart: document.getElementById('react-heart'),
        wow: document.getElementById('react-wow'),
        sad: document.getElementById('react-sad'),
        angry: document.getElementById('react-angry'),
        laugh: document.getElementById('react-laugh'),
        party: document.getElementById('react-party')
    },
    hintPowerup: document.getElementById('hintPowerup'),
    skipPowerup: document.getElementById('skipPowerup'),
    doublePowerup: document.getElementById('doublePowerup'),
    premiumModal: document.getElementById('premiumModal'),
    closeModal: document.getElementById('closeModal'),
    scrollUpBtn: document.getElementById('scrollUpBtn'),
    scrollDownBtn: document.getElementById('scrollDownBtn'),
    darkModeBtn: document.getElementById('darkModeBtn'),
    premiumBtn: document.getElementById('premiumBtn')
};

const circumference = 2 * Math.PI * 40;
DOM.timerProgress.style.strokeDasharray = circumference;

// ==================== HELPERS ====================
function showToast(msg, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2800);
}

function createStars() {
    const container = document.getElementById('starsContainer');
    if (!container) return;
    for (let i = 0; i < 180; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 5 + 's';
        star.style.animationDuration = Math.random() * 3 + 2 + 's';
        container.appendChild(star);
    }
}

function createGlitch() {
    document.body.classList.add('glitch');
    setTimeout(() => document.body.classList.remove('glitch'), 250);
}

function createShake() {
    document.body.classList.add('shake');
    setTimeout(() => document.body.classList.remove('shake'), 400);
}

function createFire() {
    const f = document.createElement('div');
    f.className = 'fire-effect';
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 800);
}

function createBossFight() {
    const b = document.createElement('div');
    b.className = 'boss-fight';
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 2500);
}

function createCelebration() {
    const emojis = ['🎉', '✨', '🌟', '⭐', '🏆', '🎊', '💎', '🐉', '🔥'];
    for (let i = 0; i < 35; i++) {
        const el = document.createElement('div');
        el.className = 'celebration-particle';
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.left = Math.random() * 100 + '%';
        el.style.bottom = '0px';
        el.style.fontSize = Math.random() * 22 + 18 + 'px';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1500);
    }
}

function getQuestionHash(n1, n2) {
    return `${Math.min(n1, n2)}_${Math.max(n1, n2)}`;
}

function generateUniqueNumbers() {
    let maxNum;
    switch (gameState.currentDifficulty) {
        case 'easy':
            maxNum = gameState.currentLevel * 10 + 20;
            break;
        case 'medium':
            maxNum = gameState.currentLevel * 15 + 50;
            break;
        case 'hard':
            maxNum = gameState.currentLevel * 25 + 150;
            break;
        default:
            maxNum = 100;
    }
    let attempts = 0,
        n1, n2, hash;
    do {
        n1 = Math.floor(Math.random() * maxNum) + 1;
        n2 = Math.floor(Math.random() * maxNum) + 1;
        hash = getQuestionHash(n1, n2);
        attempts++;
        if (attempts > 150) {
            gameState.usedQuestions = [];
            break;
        }
    } while (n1 === n2 || gameState.usedQuestions.includes(hash));
    gameState.usedQuestions.push(hash);
    return { n1, n2 };
}

function updateUI() {
    DOM.score.textContent = gameState.score;
    DOM.streak.textContent = gameState.streak;
    DOM.lives.textContent = gameState.lives;
    DOM.currentLevel.textContent = gameState.currentLevel;
    const maxLvl = gameState.questionsPerLevel[gameState.currentDifficulty];
    DOM.maxLevel.textContent = maxLvl;
    const progress = (gameState.correctInLevel / maxLvl) * 100;
    DOM.progressFill.style.width = progress + '%';

    if (gameState.currentLevel === 5 && !gameState.bossFight && gameState.correctInLevel === 0) {
        gameState.bossFight = true;
        createBossFight();
        showToast('⚔️ BOSS FIGHT APPROACHING! ⚔️', 'warning');
        window.sound.play(150, 0.3, 'square');
    }
}

function updateTimer() {
    const offset = circumference * (1 - gameState.timeLeft / 12);
    DOM.timerProgress.style.strokeDashoffset = offset;
    DOM.timerText.textContent = gameState.timeLeft;
    DOM.timerProgress.style.stroke = gameState.timeLeft <= 3 ? '#ff5252' : '#0ff';
    DOM.timerText.style.color = gameState.timeLeft <= 3 ? '#ff5252' : '#0ff';
}

function startTimer() {
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    gameState.timeLeft = 12;
    updateTimer();
    gameState.timerInterval = setInterval(() => {
        if (!gameState.gameActive) return;
        gameState.timeLeft--;
        updateTimer();
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function handleTimeout() {
    gameState.lives--;
    gameState.streak = 0;
    updateUI();
    createShake();
    window.sound.wrong();
    showToast(`⏰ TIME'S UP! -1 Life`, 'error');
    if (gameState.lives <= 0) endGame(false);
    else loadNewQuestion();
}

function loadNewQuestion() {
    if (!gameState.gameActive) return;
    const { n1, n2 } = generateUniqueNumbers();
    gameState.currentNum1 = n1;
    gameState.currentNum2 = n2;
    gameState.currentAnswer = n1 > n2;

    DOM.number1.classList.add('flip');
    DOM.number2.classList.add('flip');
    DOM.vsSymbol.style.animation = 'none';
    setTimeout(() => {
        DOM.number1.textContent = n1;
        DOM.number2.textContent = n2;
        DOM.vsSymbol.style.animation = 'vsPulse 1s ease-in-out infinite';
        DOM.number1.classList.remove('flip');
        DOM.number2.classList.remove('flip');
    }, 250);
    DOM.feedback.innerHTML = '';
    startTimer();
}

function checkAnswer(isGreater) {
    if (!gameState.gameActive) return;
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);

    const isCorrect = (isGreater === gameState.currentAnswer);
    const timeBonus = Math.floor(gameState.timeLeft * 8);

    if (isCorrect) {
        let points = 10 * (gameState.currentDifficulty === 'easy' ? 1 : gameState.currentDifficulty === 'medium' ? 2 : 3);
        points += gameState.streak * 3 + timeBonus;
        if (gameState.doubleScore) points *= 2;

        gameState.score += points;
        gameState.streak++;
        gameState.totalCorrect++;
        gameState.correctInLevel++;

        window.sound.correct();
        createCelebration();
        DOM.feedback.innerHTML =
            `✅ CORRECT! ${gameState.currentNum1} ${gameState.currentAnswer ? '>' : '<'} ${gameState.currentNum2}<br>+${points} pts (Time: +${timeBonus})`;
        DOM.feedback.style.color = '#0f0';

        const maxPerLevel = gameState.questionsPerLevel[gameState.currentDifficulty];
        if (gameState.correctInLevel >= maxPerLevel) levelComplete();
        else setTimeout(() => loadNewQuestion(), 1100);
    } else {
        gameState.lives--;
        gameState.streak = 0;
        gameState.doubleScore = false;
        updateUI();
        createShake();
        createFire();
        createGlitch();
        window.sound.wrong();
        DOM.feedback.innerHTML =
            `❌ WRONG! ${gameState.currentNum1} ${gameState.currentAnswer ? '>' : '<'} ${gameState.currentNum2}<br>Correct: ${gameState.currentAnswer ? 'Greater (>)' : 'Less (<)'}`;
        DOM.feedback.style.color = '#f00';
        if (gameState.lives <= 0) endGame(false);
        else setTimeout(() => loadNewQuestion(), 1700);
    }
    updateUI();
}

function levelComplete() {
    window.sound.levelUp();
    createCelebration();
    showToast(`🏆 LEVEL ${gameState.currentLevel} COMPLETE! 🏆`, 'success');
    gameState.currentLevel++;
    gameState.correctInLevel = 0;
    gameState.usedQuestions = [];
    gameState.doubleScore = false;
    gameState.bossFight = false;
    if (gameState.currentLevel % 3 === 0 && gameState.lives < 5) {
        gameState.lives++;
        showToast(`❤️ BONUS LIFE!`, 'success');
    }
    const maxTotal = 15;
    if (gameState.currentLevel > maxTotal) endGame(true);
    else { updateUI();
        loadNewQuestion(); }
}

function endGame(isVictory) {
    gameState.gameActive = false;
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    if (isVictory) {
        window.sound.victory();
        createCelebration();
        DOM.feedback.innerHTML =
            `🏆 VICTORY! YOU BEAT THE DRAGON! 🏆<br>Final Score: ${gameState.score}<br>Correct: ${gameState.totalCorrect}`;
        showToast('🎉 YOU ARE THE CHAMPION! 🎉', 'success');
    } else {
        window.sound.gameOver();
        DOM.feedback.innerHTML =
            `💀 GAME OVER! DRAGON WINS... 💀<br>Final Score: ${gameState.score}<br>Correct: ${gameState.totalCorrect}`;
        showToast('💀 GAME OVER! Try Again! 💀', 'error');
    }
    DOM.greaterBtn.disabled = true;
    DOM.lessBtn.disabled = true;
}

function startGame() {
    if (gameState.isGameStarted) return;
    gameState.isGameStarted = true;
    gameState.gameActive = true;
    DOM.startBtn.style.display = 'none';
    DOM.greaterBtn.disabled = false;
    DOM.lessBtn.disabled = false;
    showToast('🐉 Game Started! Good Luck!', 'success');
    loadNewQuestion();
}

function resetGame() {
    gameState = {
        score: 0,
        streak: 0,
        lives: 3,
        currentLevel: 1,
        correctInLevel: 0,
        currentDifficulty: gameState.currentDifficulty || 'easy',
        questionsPerLevel: { easy: 8, medium: 9, hard: 10 },
        usedQuestions: [],
        currentNum1: null,
        currentNum2: null,
        currentAnswer: null,
        timerInterval: null,
        timeLeft: 12,
        doubleScore: false,
        gameActive: false,
        totalCorrect: 0,
        powerups: { hint: 2, skip: 2, double: 1 },
        bossFight: false,
        isGameStarted: false
    };
    DOM.greaterBtn.disabled = true;
    DOM.lessBtn.disabled = true;
    DOM.startBtn.style.display = 'inline-block';
    DOM.number1.textContent = '?';
    DOM.number2.textContent = '?';
    DOM.feedback.innerHTML = '👆 Press START to begin your adventure!';
    DOM.feedback.style.color = '#fff';
    DOM.hintPowerup.textContent = '💡 HINT (2)';
    DOM.skipPowerup.textContent = '⏭️ SKIP (2)';
    DOM.doublePowerup.textContent = '⭐ DOUBLE (1)';
    updateUI();
}

// ==================== POWER-UPS ====================
function useHint() {
    if (gameState.powerups.hint <= 0) {
        showToast('No hints left!', 'error');
        return;
    }
    gameState.powerups.hint--;
    window.sound.powerup();
    showToast(`💡 Hint: ${gameState.currentAnswer ? 'Greater (>)/' : 'Less (<)'} is correct!`, 'info');
    DOM.hintPowerup.textContent = `💡 HINT (${gameState.powerups.hint})`;
}

function useSkip() {
    if (gameState.powerups.skip <= 0) {
        showToast('No skips left!', 'error');
        return;
    }
    gameState.powerups.skip--;
    window.sound.powerup();
    showToast(`⏭️ Question skipped!`, 'info');
    DOM.skipPowerup.textContent = `⏭️ SKIP (${gameState.powerups.skip})`;
    loadNewQuestion();
}

function useDouble() {
    if (gameState.powerups.double <= 0) {
        showToast('No double score left!', 'error');
        return;
    }
    gameState.powerups.double--;
    gameState.doubleScore = true;
    window.sound.powerup();
    showToast(`⭐ DOUBLE SCORE ACTIVE!`, 'success');
    DOM.doublePowerup.textContent = `⭐ DOUBLE (${gameState.powerups.double})`;
}

// ==================== SHARE ACTIONS ====================
const shareActions = {
    facebook: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
        window.apiService.addShare('facebook');
    },
    twitter: () => {
        window.open(`https://twitter.com/intent/tweet?text=Check%20Magic%20Numbers%20Dragon%20Quest!%20${encodeURIComponent(window.location.href)}`, '_blank');
        window.apiService.addShare('twitter');
    },
    whatsapp: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent('Magic Numbers Dragon Quest! ' + window.location.href)}`, '_blank');
        window.apiService.addShare('whatsapp');
    },
    linkedin: () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
        window.apiService.addShare('linkedin');
    },
    email: () => {
        window.location.href = `mailto:?subject=Magic Numbers Game&body=Check this out! ${window.location.href}`;
        window.apiService.addShare('email');
    },
    copy: async () => {
        await navigator.clipboard.writeText(window.location.href);
        showToast('📋 URL Copied!', 'success');
        window.apiService.addShare('copy');
    }
};

// ==================== SCROLL & DARK MODE ====================
function scrollUp() {
    window.scrollBy({ top: -350, behavior: 'smooth' });
}

function scrollDown() {
    window.scrollBy({ top: 350, behavior: 'smooth' });
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
}

// ==================== UPDATE STATS UI ====================
async function updateStatsUI() {
    try {
        const stats = await window.apiService.getStats();
        if (stats.usage) DOM.usageCount.textContent = stats.usage;
        if (stats.shares) DOM.totalShares.textContent = stats.shares;
        if (stats.reactions) {
            const emojiMap = {
                '👍': 'thumbsup',
                '❤️': 'heart',
                '😮': 'wow',
                '😢': 'sad',
                '😠': 'angry',
                '😂': 'laugh',
                '🎉': 'party'
            };
            for (const [emoji, count] of Object.entries(stats.reactions)) {
                const id = emojiMap[emoji];
                if (id && DOM.reactionCounts[id]) {
                    DOM.reactionCounts[id].textContent = count;
                }
            }
        }
    } catch (error) {
        console.warn('Stats UI update error:', error);
    }
}

// ==================== INIT ====================
function init() {
    // Initialize API Service
    window.apiService = new ApiService();

    // Initialize Sound
    window.sound = new SoundSystem();

    // Create Stars Background
    createStars();

    // Start Game Button
    DOM.startBtn.addEventListener('click', startGame);

    // Game Controls
    DOM.greaterBtn.addEventListener('click', () => checkAnswer(true));
    DOM.lessBtn.addEventListener('click', () => checkAnswer(false));

    // Power-ups
    DOM.hintPowerup.addEventListener('click', useHint);
    DOM.skipPowerup.addEventListener('click', useSkip);
    DOM.doublePowerup.addEventListener('click', useDouble);

    // Scroll Buttons
    DOM.scrollUpBtn.addEventListener('click', scrollUp);
    DOM.scrollDownBtn.addEventListener('click', scrollDown);
    DOM.darkModeBtn.addEventListener('click', toggleDarkMode);
    DOM.premiumBtn.addEventListener('click', () => {
        DOM.premiumModal.style.display = 'flex';
    });
    DOM.closeModal.addEventListener('click', () => {
        DOM.premiumModal.style.display = 'none';
    });

    // Difficulty Buttons
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            gameState.currentDifficulty = btn.dataset.diff;
            resetGame();
        });
    });

    // Reaction Buttons
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const emoji = btn.dataset.emoji;
            await window.apiService.addReaction(emoji);
            await updateStatsUI();
            window.sound.click();
            showToast(`Thanks for your reaction! ${emoji}`, 'success');
        });
    });

    // Share Buttons
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.dataset.platform;
            if (shareActions[platform]) {
                shareActions[platform]();
                setTimeout(updateStatsUI, 500);
            }
        });
    });

    // Initialize sound on first click
    document.body.addEventListener('click', () => window.sound.init(), { once: true });

    // Increment usage on load
    window.apiService.incrementUsage();

    // Fetch and update stats
    setTimeout(updateStatsUI, 500);

    // Reset game to initial state
    resetGame();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
