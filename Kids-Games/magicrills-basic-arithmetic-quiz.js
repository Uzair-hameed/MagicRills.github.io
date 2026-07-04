// ============================================================
// MAGICRILLS BASIC ARITHMETIC QUIZ - CLOUDFLARE API VERSION
// ============================================================

// ========== CONFIGURATION ==========
const CONFIG = {
    API_BASE: 'https://magicrills-api.uzairhameed01.workers.dev',
    API_KEY: 'magicrills-grok-api.uzairhameed01.workers.dev',
    TOOL_SLUG: 'basic-arithmetic-quiz',
    VERSION: '2.0.0'
};

// ========== GAME STATE ==========
const state = {
    currentLevel: null,
    score: 0,
    correct: 0,
    wrong: 0,
    streak: 0,
    lives: 3,
    timeLeft: 60,
    timerInterval: null,
    currentQuestion: null,
    usedQuestions: [],
    gameActive: false,
    power5050Used: false,
    selectedChar: localStorage.getItem('selectedChar') || '🤖',
    musicEnabled: localStorage.getItem('musicEnabled') !== 'false',
    bgMusic: null,
    stats: {
        usage: 0,
        views: 0,
        shares: 0,
        reactions: { like: 0, love: 0, wow: 0, sad: 0, laugh: 0, celebrate: 0 }
    },
    isApiAvailable: true
};

// ========== DOM ELEMENTS ==========
const DOM = {};

function initDOM() {
    DOM.levelPanel = document.getElementById('levelPanel');
    DOM.quizPanel = document.getElementById('quizPanel');
    DOM.gameoverPanel = document.getElementById('gameoverPanel');
    DOM.questionText = document.getElementById('questionText');
    DOM.optionsDiv = document.getElementById('optionsDiv');
    DOM.scoreSpan = document.getElementById('scoreVal');
    DOM.streakSpan = document.getElementById('streakVal');
    DOM.livesSpan = document.getElementById('livesVal');
    DOM.correctSpan = document.getElementById('correctVal');
    DOM.timerSpan = document.getElementById('timerSec');
    DOM.finalScoreSpan = document.getElementById('finalScore');
    DOM.nextBtn = document.getElementById('nextBtn');
    DOM.restartBtn = document.getElementById('restartBtn');
    DOM.feedbackMsg = document.getElementById('feedbackMsg');
    DOM.progressFill = document.getElementById('progressFill');
    DOM.mascot = document.getElementById('mascot');
    DOM.usageCount = document.getElementById('usageCount');
    DOM.viewsCount = document.getElementById('viewsCount');
    DOM.sharesCount = document.getElementById('sharesCount');
    DOM.reactionsDiv = document.getElementById('reactionsDiv');
}

// ========== CLOUDFLARE API FUNCTIONS ==========
async function callAPI(endpoint, method = 'POST', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': CONFIG.API_KEY,
                'X-Tool-Slug': CONFIG.TOOL_SLUG
            }
        };
        if (data) options.body = JSON.stringify(data);

        const response = await fetch(`${CONFIG.API_BASE}${endpoint}`, options);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.warn('API call failed, using localStorage fallback:', error);
        state.isApiAvailable = false;
        return null;
    }
}

// ========== USAGE COUNTER ==========
async function incrementUsage() {
    try {
        // Get current usage from localStorage
        let usage = parseInt(localStorage.getItem('magic_usage') || '0');
        usage++;
        localStorage.setItem('magic_usage', usage);
        state.stats.usage = usage;
        if (DOM.usageCount) DOM.usageCount.innerText = usage;

        // Try API call
        const result = await callAPI('/api/usage', 'POST', { 
            tool_slug: CONFIG.TOOL_SLUG,
            increment: 1 
        });
        
        if (result && result.success) {
            state.stats.usage = result.usage || usage;
            if (DOM.usageCount) DOM.usageCount.innerText = state.stats.usage;
        }
        return state.stats.usage;
    } catch (error) {
        console.warn('Usage increment failed, using localStorage:', error);
        return state.stats.usage;
    }
}

// ========== REACTIONS ==========
async function addReaction(emoji) {
    const emojiMap = {
        '👍': 'like', '❤️': 'love', '😮': 'wow', 
        '😢': 'sad', '😂': 'laugh', '🎉': 'celebrate'
    };
    const key = emojiMap[emoji];
    if (!key) return;

    try {
        // Update localStorage
        const reactions = JSON.parse(localStorage.getItem('magic_reactions') || '{"like":0,"love":0,"wow":0,"sad":0,"laugh":0,"celebrate":0}');
        reactions[key] = (reactions[key] || 0) + 1;
        localStorage.setItem('magic_reactions', JSON.stringify(reactions));
        state.stats.reactions = reactions;
        updateReactionsUI();

        // Try API call
        await callAPI('/api/reactions', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            reaction_type: key
        });
    } catch (error) {
        console.warn('Reaction API failed, using localStorage:', error);
    }
}

function updateReactionsUI() {
    const reactions = state.stats.reactions;
    const emojiMap = { like: 'like', love: 'love', wow: 'wow', sad: 'sad', laugh: 'laugh', celebrate: 'celebrate' };
    Object.keys(emojiMap).forEach(key => {
        const el = document.getElementById(`${key}Count`);
        if (el) el.innerText = reactions[key] || 0;
    });
}

// ========== SHARES ==========
async function recordShare(platform) {
    try {
        // Update localStorage
        let shares = parseInt(localStorage.getItem('magic_shares') || '0');
        shares++;
        localStorage.setItem('magic_shares', shares);
        state.stats.shares = shares;
        if (DOM.sharesCount) DOM.sharesCount.innerText = shares;

        // Try API call
        await callAPI('/api/shares', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            platform: platform
        });
    } catch (error) {
        console.warn('Share API failed, using localStorage:', error);
    }
}

// ========== GET STATS ==========
async function fetchStats() {
    try {
        const result = await callAPI(`/api/stats?tool_slug=${CONFIG.TOOL_SLUG}`, 'GET');
        if (result && result.success) {
            state.stats = result.data || state.stats;
            updateStatsUI();
        }
    } catch (error) {
        console.warn('Stats fetch failed, using localStorage:', error);
        loadLocalStats();
    }
}

function loadLocalStats() {
    state.stats.usage = parseInt(localStorage.getItem('magic_usage') || '0');
    state.stats.reactions = JSON.parse(localStorage.getItem('magic_reactions') || '{"like":0,"love":0,"wow":0,"sad":0,"laugh":0,"celebrate":0}');
    state.stats.shares = parseInt(localStorage.getItem('magic_shares') || '0');
    updateStatsUI();
}

function updateStatsUI() {
    if (DOM.usageCount) DOM.usageCount.innerText = state.stats.usage || 0;
    if (DOM.sharesCount) DOM.sharesCount.innerText = state.stats.shares || 0;
    updateReactionsUI();
}

// ========== HELPER FUNCTIONS ==========
function showToast(msg, duration = 2500) {
    let t = document.createElement('div');
    t.className = 'toast';
    t.innerText = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), duration);
}

function playSound(type) {
    try {
        let audio = new Audio();
        if (type === 'correct') audio.src = 'https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3';
        else if (type === 'wrong') audio.src = 'https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3';
        else audio.src = 'https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-explosion-2759.mp3';
        audio.volume = 0.4;
        audio.play().catch(e => {});
    } catch (e) {}
}

function confettiEffect() {
    if (typeof confetti === 'function') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } else {
        for (let i = 0; i < 30; i++) {
            let p = document.createElement('div');
            p.style.cssText = `
                position: fixed; left: ${Math.random() * 100}%; top: 50%;
                width: 8px; height: 8px; background: hsl(${Math.random() * 360}, 100%, 50%);
                border-radius: 50%; pointer-events: none; z-index: 999;
                animation: confettiFall ${1 + Math.random()}s linear forwards;
            `;
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 1500);
        }
    }
}

// ========== QUESTION GENERATION ==========
function getRand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generateQuestion() {
    let minDigit = 1, maxDigit = 9;
    if (state.currentLevel === 'easy') { minDigit = 1; maxDigit = 9; }
    else if (state.currentLevel === 'average') { minDigit = 10; maxDigit = 99; }
    else if (state.currentLevel === 'hard') { minDigit = 100; maxDigit = 999; }
    else if (state.currentLevel === 'professional') { minDigit = 1000; maxDigit = 9999; }

    const ops = ['+', '-', '×', '÷'];
    const op = ops[Math.floor(Math.random() * 4)];
    let num1 = getRand(minDigit, maxDigit);
    let num2 = getRand(minDigit, maxDigit);
    let answer, qText;

    if (op === '+') { answer = num1 + num2; qText = `${num1} + ${num2}`; }
    else if (op === '-') {
        if (num2 > num1) [num1, num2] = [num2, num1];
        answer = num1 - num2;
        qText = `${num1} - ${num2}`;
    }
    else if (op === '×') { answer = num1 * num2; qText = `${num1} × ${num2}`; }
    else {
        if (num2 === 0) num2 = 1;
        answer = Math.floor(num1 / num2);
        qText = `${num1} ÷ ${num2}`;
    }

    const key = `${qText}=${answer}`;
    if (state.usedQuestions.includes(key) && state.usedQuestions.length < 300) return generateQuestion();
    state.usedQuestions.push(key);
    if (state.usedQuestions.length > 500) state.usedQuestions.shift();

    let options = [answer];
    while (options.length < 4) {
        let offset = getRand(-Math.floor(maxDigit / 2), Math.floor(maxDigit / 2));
        let cand = answer + offset;
        if (cand > 0 && !options.includes(cand)) options.push(cand);
    }
    for (let i = options.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }
    return { text: qText + ' = ?', answer, options };
}

// ========== GAME FUNCTIONS ==========
function loadQuestion() {
    if (!state.gameActive) return;
    state.power5050Used = false;
    state.currentQuestion = generateQuestion();
    DOM.questionText.innerText = state.currentQuestion.text;
    DOM.optionsDiv.innerHTML = '';
    state.currentQuestion.options.forEach(opt => {
        let btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(opt);
        DOM.optionsDiv.appendChild(btn);
    });
    DOM.nextBtn.disabled = true;
    DOM.feedbackMsg.innerHTML = '';
    let progress = ((60 - state.timeLeft) / 60) * 100;
    DOM.progressFill.style.width = Math.min(100, progress) + '%';
}

function checkAnswer(selected) {
    if (!state.gameActive) return;
    clearInterval(state.timerInterval);
    let isCorrect = (selected == state.currentQuestion.answer);
    
    if (isCorrect) {
        let bonus = 0;
        if (state.streak >= 10) bonus = 25;
        else if (state.streak >= 5) bonus = 15;
        else if (state.streak >= 3) bonus = 5;
        state.score += 10 + bonus;
        state.correct++;
        state.streak++;
        
        if (state.streak === 3) showToast('🔥 3 in a row! +5 bonus');
        if (state.streak === 5) showToast('⭐ 5 in a row! +15 bonus');
        if (state.streak === 10) { showToast('🏆 MEGA STREAK! +25 bonus'); confettiEffect(); }
        
        DOM.feedbackMsg.innerHTML = `✅ Correct! +${10 + bonus} points`;
        DOM.feedbackMsg.style.color = '#48bb78';
        playSound('correct');
        DOM.mascot.style.transform = 'scale(1.3)';
        setTimeout(() => DOM.mascot.style.transform = '', 300);
        confettiEffect();
    } else {
        state.wrong++;
        state.streak = 0;
        state.lives--;
        DOM.feedbackMsg.innerHTML = `❌ Wrong! Answer: ${state.currentQuestion.answer}`;
        DOM.feedbackMsg.style.color = '#f56565';
        playSound('wrong');
        if (state.lives <= 0) { endGame(); return; }
        showToast(`❤️ Lives left: ${state.lives}`);
    }
    
    DOM.scoreSpan.innerText = state.score;
    DOM.correctSpan.innerText = state.correct;
    DOM.streakSpan.innerText = state.streak;
    DOM.livesSpan.innerText = state.lives;
    
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = true;
        if (parseInt(btn.innerText) === state.currentQuestion.answer) btn.style.background = '#48bb78';
        if (!isCorrect && parseInt(btn.innerText) === selected) btn.style.background = '#f56565';
    });
    DOM.nextBtn.disabled = false;
}

function nextQuestionHandler() {
    startTimer();
    loadQuestion();
}

function startTimer() {
    if (state.timerInterval) clearInterval(state.timerInterval);
    state.timerInterval = setInterval(() => {
        if (!state.gameActive) return;
        state.timeLeft--;
        DOM.timerSpan.innerText = state.timeLeft;
        let progress = ((60 - state.timeLeft) / 60) * 100;
        DOM.progressFill.style.width = Math.min(100, progress) + '%';
        if (state.timeLeft <= 0) {
            clearInterval(state.timerInterval);
            endGame();
        }
    }, 1000);
}

function endGame() {
    state.gameActive = false;
    clearInterval(state.timerInterval);
    DOM.quizPanel.style.display = 'none';
    DOM.gameoverPanel.style.display = 'block';
    DOM.finalScoreSpan.innerText = state.score;
    
    let badgesHtml = '';
    if (state.score >= 50) badgesHtml += '<div class="badge">🥉 Bronze</div>';
    if (state.score >= 100) badgesHtml += '<div class="badge">🥈 Silver</div>';
    if (state.score >= 200) badgesHtml += '<div class="badge">🥇 Gold</div>';
    if (state.score >= 500) badgesHtml += '<div class="badge">💎 Diamond</div>';
    if (state.score >= 1000) badgesHtml += '<div class="badge">👑 Legend</div>';
    if (badgesHtml === '') badgesHtml = '<div>Keep playing for badges!</div>';
    document.getElementById('badgesDiv').innerHTML = badgesHtml;
    playSound('gameover');
}

function startGame(level) {
    state.currentLevel = level;
    state.score = 0;
    state.correct = 0;
    state.wrong = 0;
    state.streak = 0;
    state.lives = 3;
    state.timeLeft = 60;
    state.usedQuestions = [];
    state.gameActive = true;
    state.power5050Used = false;
    
    DOM.scoreSpan.innerText = state.score;
    DOM.correctSpan.innerText = state.correct;
    DOM.streakSpan.innerText = state.streak;
    DOM.livesSpan.innerText = state.lives;
    DOM.timerSpan.innerText = state.timeLeft;
    DOM.progressFill.style.width = '0%';
    
    DOM.levelPanel.style.display = 'none';
    DOM.quizPanel.style.display = 'block';
    DOM.gameoverPanel.style.display = 'none';
    
    startTimer();
    loadQuestion();
    incrementUsage();
}

function resetToLevel() {
    state.gameActive = false;
    clearInterval(state.timerInterval);
    DOM.levelPanel.style.display = 'block';
    DOM.quizPanel.style.display = 'none';
    DOM.gameoverPanel.style.display = 'none';
}

// ========== POWER UPS ==========
function initPowerups() {
    document.getElementById('powerTime').onclick = () => {
        if (state.gameActive) { state.timeLeft += 5; DOM.timerSpan.innerText = state.timeLeft; showToast('⏰ +5 seconds!'); }
    };
    document.getElementById('power5050').onclick = () => {
        if (state.gameActive && !state.power5050Used) {
            let btns = document.querySelectorAll('.option-btn');
            let wrongBtns = Array.from(btns).filter(b => parseInt(b.innerText) !== state.currentQuestion.answer);
            for (let i = 0; i < 2 && wrongBtns.length > 1; i++) {
                let rem = wrongBtns.pop();
                rem.style.display = 'none';
            }
            state.power5050Used = true;
            showToast('🎯 50-50 used!');
        }
    };
    document.getElementById('powerLife').onclick = () => {
        if (state.gameActive && state.lives < 5) { state.lives++; DOM.livesSpan.innerText = state.lives; showToast(`❤️ +1 Life (${state.lives})`); }
    };
}

// ========== VOICE COMMAND ==========
function initVoice() {
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.onresult = (event) => {
            let spoken = event.results[0][0].transcript;
            let num = parseInt(spoken.match(/\d+/)?.[0]);
            if (num && state.currentQuestion && state.gameActive && DOM.nextBtn.disabled === false) {
                checkAnswer(num);
            } else {
                showToast(`🗣 You said: "${spoken}"`);
            }
        };
        document.getElementById('voiceBtn').onclick = () => recognition.start();
    } else {
        document.getElementById('voiceBtn').style.display = 'none';
    }
}

// ========== MUSIC ==========
function toggleMusic() {
    state.musicEnabled = !state.musicEnabled;
    localStorage.setItem('musicEnabled', state.musicEnabled);
    if (state.musicEnabled && !state.bgMusic) {
        state.bgMusic = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-game-level-music-689.mp3');
        state.bgMusic.loop = true;
        state.bgMusic.volume = 0.2;
        state.bgMusic.play().catch(e => {});
    } else if (state.bgMusic) {
        state.bgMusic.pause();
        state.bgMusic = null;
    }
    document.getElementById('musicToggle').innerText = state.musicEnabled ? '🎵 On' : '🔇 Off';
}

// ========== DARK MODE ==========
function toggleDark() {
    let dark = document.documentElement.getAttribute('data-theme') !== 'dark';
    if (dark) document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('darkMode', dark);
}

// ========== CHARACTER SELECTION ==========
function initCharacters() {
    document.querySelectorAll('.char').forEach(el => {
        if (el.getAttribute('data-char') === state.selectedChar) el.classList.add('selected');
        el.onclick = () => {
            state.selectedChar = el.getAttribute('data-char');
            localStorage.setItem('selectedChar', state.selectedChar);
            document.querySelectorAll('.char').forEach(c => c.classList.remove('selected'));
            el.classList.add('selected');
            DOM.mascot.innerText = state.selectedChar;
            showToast(`${state.selectedChar} is ready!`);
        };
    });
    DOM.mascot.innerText = state.selectedChar;
}

// ========== REACTIONS SETUP ==========
function initReactions() {
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.onclick = () => {
            const emoji = btn.getAttribute('data-emoji');
            addReaction(emoji);
            // Visual feedback
            btn.style.transform = 'scale(1.3)';
            setTimeout(() => btn.style.transform = '', 300);
        };
    });
    loadLocalStats();
}

// ========== SHARE SETUP ==========
function initShares() {
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.onclick = () => {
            let plat = btn.getAttribute('data-platform');
            let url = encodeURIComponent(window.location.href);
            let text = encodeURIComponent('🎯 Magicrills Basic Arithmetic Quiz - Test your math skills!');
            let shareUrl = '';
            
            if (plat === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            else if (plat === 'twitter') shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
            else if (plat === 'whatsapp') shareUrl = `https://wa.me/?text=${text} ${url}`;
            else if (plat === 'linkedin') shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            else if (plat === 'copy') {
                navigator.clipboard.writeText(window.location.href);
                showToast('📋 URL copied!');
                recordShare('copy');
                return;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
                recordShare(plat);
            }
        };
    });
}

// ========== KEYBOARD SHORTCUTS ==========
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !DOM.nextBtn.disabled) {
            DOM.nextBtn.click();
        }
        if (e.key >= '1' && e.key <= '4') {
            const btns = document.querySelectorAll('.option-btn');
            if (btns[e.key - 1] && !btns[e.key - 1].disabled) {
                btns[e.key - 1].click();
            }
        }
        if (e.key === 'r' || e.key === 'R') {
            if (DOM.gameoverPanel.style.display === 'block') {
                DOM.restartBtn.click();
            }
        }
    });
}

// ========== TYPEWRITER EFFECT FOR HERO ==========
function initTypewriter() {
    const element = document.getElementById('typewriterText');
    if (!element) return;
    
    const phrases = [
        '🧮 Master Math Skills!',
        '🌟 Fun Learning Games!',
        '🎯 Boost Your Brain!',
        '📚 Learn & Play!',
        '🏆 Become a Math Champion!'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let speed = 80;
    
    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            element.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            speed = 40;
        } else {
            element.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            speed = 80;
        }
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            speed = 500;
        }
        
        setTimeout(typeEffect, speed);
    }
    
    typeEffect();
}

// ========== STATS COUNTER ANIMATION ==========
function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(el => {
        const target = parseInt(el.getAttribute('data-target') || '0');
        if (target === 0) return;
        let current = 0;
        const increment = Math.ceil(target / 30);
        const interval = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(interval);
            }
            el.textContent = current;
        }, 50);
    });
}

// ========== CONFETTI STYLES ==========
function addConfettiStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confettiFall {
            0% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
            100% { opacity: 0; transform: translateY(100vh) rotate(720deg) scale(0.5); }
        }
    `;
    document.head.appendChild(style);
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize DOM
    initDOM();
    
    // Add confetti styles
    addConfettiStyles();
    
    // Load stats
    await fetchStats();
    
    // Increment view
    let views = parseInt(localStorage.getItem('magic_views') || '0');
    views++;
    localStorage.setItem('magic_views', views);
    if (DOM.viewsCount) DOM.viewsCount.innerText = views;
    await callAPI('/api/views', 'POST', { tool_slug: CONFIG.TOOL_SLUG });
    
    // Initialize components
    initCharacters();
    initReactions();
    initShares();
    initPowerups();
    initVoice();
    initKeyboardShortcuts();
    initTypewriter();
    
    // Dark mode
    if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    document.getElementById('darkToggle').onclick = toggleDark;
    
    // Music
    document.getElementById('musicToggle').onclick = toggleMusic;
    if (state.musicEnabled) {
        setTimeout(() => toggleMusic(), 500);
    }
    
    // Level buttons
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.onclick = () => startGame(btn.getAttribute('data-level'));
    });
    
    // Next and Restart
    DOM.nextBtn.onclick = nextQuestionHandler;
    DOM.restartBtn.onclick = resetToLevel;
    
    // Load confetti library
    let script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1';
    document.head.appendChild(script);
    
    // Animate stats
    setTimeout(animateCounters, 500);
    
    // Welcome toast
    setTimeout(() => {
        showToast(`✨ Welcome ${state.selectedChar}! Click or speak your answer ✨`);
    }, 1000);
    
    console.log(`🎯 Magicrills ${CONFIG.TOOL_SLUG} v${CONFIG.VERSION} loaded successfully!`);
});

// ========== EXPOSE API FOR CONSOLE DEBUGGING ==========
window.__magicrills = {
    state: state,
    CONFIG: CONFIG,
    callAPI: callAPI,
    incrementUsage: incrementUsage,
    addReaction: addReaction,
    recordShare: recordShare,
    fetchStats: fetchStats,
    startGame: startGame,
    resetToLevel: resetToLevel
};
