// ==================== CONFIGURATION ====================
const CONFIG = {
    APP_NAME: 'English Language Quiz Challenge',
    VERSION: '3.0.0',
    CLOUD_WORKER_URL: 'https://computer-quiz-challenge.uzairhameed01.workers.dev',
    DEFAULT_TIMER: 35,
    QUESTIONS_PER_QUIZ: 35
};

// ==================== GLOBAL STATE ====================
let currentState = {
    mode: 'classic',
    difficulty: 'easy',
    selectedCategories: ['grammar', 'sentence', 'synonyms', 'antonyms'],
    questions: [],
    currentQuestion: 0,
    score: 0,
    lives: 3,
    userAnswers: [],
    powerups: { fifty: 3, time: 3, hint: 3, skip: 3 },
    timer: null,
    timeLeft: 35,
    streak: 0,
    weakAreas: {},
    sessionId: null
};

let userReactions = new Set();
let toolUsageCount = 0;
let progressChart = null;
let currentSpeechRecognition = null;

// ==================== API INTEGRATION ====================
async function callGrokAPI(prompt) {
    try {
        const response = await fetch(`${CONFIG.CLOUD_WORKER_URL}/api/grok/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                prompt: prompt,
                model: 'llama-3.1-8b-instant',
                max_tokens: 4000
            })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Grok API error:', error);
        return null;
    }
}

async function generateQuestionsFromAI() {
    showLoading(`🤖 AI is generating ${CONFIG.QUESTIONS_PER_QUIZ} English questions from Grok API...`);
    
    const categoriesList = currentState.selectedCategories.join(', ');
    const prompt = `Generate ${CONFIG.QUESTIONS_PER_QUIZ} unique multiple choice questions for English language learning.
    
Difficulty: ${currentState.difficulty}
Categories: ${categoriesList}

For each question, provide:
1. question: The question text
2. options: Array of 4 options (A, B, C, D)
3. answer: Index of correct answer (0-3)
4. explanation: Detailed explanation of why the answer is correct
5. factoid: An interesting fact about English grammar or vocabulary

Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "question": "What is the synonym of 'happy'?",
      "options": ["Joyful", "Sad", "Angry", "Tired"],
      "answer": 0,
      "explanation": "Joyful means feeling great happiness.",
      "factoid": "The word 'happy' comes from the Old English word 'hap' meaning luck or chance."
    }
  ]
}

Make sure questions are educational, accurate, and appropriate for ${currentState.difficulty} level.`;

    const result = await callGrokAPI(prompt);
    
    if (result && result.questions && result.questions.length >= 20) {
        hideLoading();
        return result.questions.slice(0, CONFIG.QUESTIONS_PER_QUIZ);
    } else {
        hideLoading();
        showToast('Using local question bank', 'warning');
        return getLocalQuestions();
    }
}

function getLocalQuestions() {
    const localBank = {
        grammar: [
            { question: "Which word is a noun in: 'The quick brown fox jumps'?", options: ["quick", "brown", "fox", "jumps"], answer: 2, explanation: "'Fox' is a noun - a person, place, or thing.", factoid: "Nouns can be subjects or objects in sentences." },
            { question: "Choose the correct sentence:", options: ["She don't like apples.", "She doesn't like apples.", "She not like apples.", "She didn't liked apples."], answer: 1, explanation: "With 'she', we use 'doesn't' (does not).", factoid: "Third person singular subjects take 'does'." },
            { question: "Identify the preposition: 'The book is on the table.'", options: ["book", "is", "on", "table"], answer: 2, explanation: "'On' shows the relationship between the book and table.", factoid: "Prepositions indicate position, time, or direction." },
            { question: "Which is correct: '___ you like ice cream?'", options: ["Does", "Do", "Is", "Are"], answer: 1, explanation: "With 'you', we use 'do' as the helping verb.", factoid: "'Do' is used with I, you, we, they." },
            { question: "What is the past tense of 'go'?", options: ["Goed", "Went", "Gone", "Going"], answer: 1, explanation: "'Went' is the irregular past tense of 'go'.", factoid: "Irregular verbs don't follow standard rules." }
        ],
        synonyms: [
            { question: "What is the synonym of 'happy'?", options: ["Joyful", "Sad", "Angry", "Tired"], answer: 0, explanation: "Joyful means very happy.", factoid: "Synonyms are words with similar meanings." },
            { question: "What is the synonym of 'big'?", options: ["Small", "Tiny", "Large", "Little"], answer: 2, explanation: "Large means big in size.", factoid: "Synonyms help make writing more interesting." },
            { question: "What is the synonym of 'fast'?", options: ["Slow", "Quick", "Lazy", "Calm"], answer: 1, explanation: "Quick means moving fast.", factoid: "Using synonyms avoids repetition." },
            { question: "What is the synonym of 'smart'?", options: ["Dumb", "Intelligent", "Slow", "Silly"], answer: 1, explanation: "Intelligent means smart.", factoid: "Thesaurus helps find synonyms." },
            { question: "What is the synonym of 'beautiful'?", options: ["Ugly", "Pretty", "Awful", "Bad"], answer: 1, explanation: "Pretty means attractive.", factoid: "Beautiful has many synonyms." }
        ],
        antonyms: [
            { question: "What is the antonym of 'hot'?", options: ["Warm", "Cold", "Spicy", "Boiling"], answer: 1, explanation: "Cold is the opposite of hot.", factoid: "Antonyms are opposite words." },
            { question: "What is the antonym of 'happy'?", options: ["Joyful", "Sad", "Cheerful", "Glad"], answer: 1, explanation: "Sad is the opposite of happy.", factoid: "Antonyms help express contrast." },
            { question: "What is the antonym of 'rich'?", options: ["Wealthy", "Poor", "Affluent", "Prosperous"], answer: 1, explanation: "Poor is the opposite of rich.", factoid: "Many words have direct opposites." },
            { question: "What is the antonym of 'early'?", options: ["Late", "Soon", "Quick", "Fast"], answer: 0, explanation: "Late is the opposite of early.", factoid: "Time-related words often have antonyms." },
            { question: "What is the antonym of 'strong'?", options: ["Powerful", "Weak", "Mighty", "Sturdy"], answer: 1, explanation: "Weak is the opposite of strong.", factoid: "Antonyms are useful in comparisons." }
        ],
        sentence: [
            { question: "Complete: 'If it rains, we ___ cancel the picnic.'", options: ["will", "would", "shall", "should"], answer: 0, explanation: "First conditional uses 'will'.", factoid: "First conditional describes real possibilities." },
            { question: "Complete: 'She ___ to school every day.'", options: ["go", "goes", "going", "went"], answer: 1, explanation: "Third person singular takes 'goes'.", factoid: "Present simple for routines." },
            { question: "Complete: 'They ___ playing football now.'", options: ["is", "am", "are", "was"], answer: 2, explanation: "Plural subject 'they' takes 'are'.", factoid: "Present continuous for now." },
            { question: "Complete: 'I ___ a doctor when I grow up.'", options: ["want be", "want to be", "wanting be", "wants to be"], answer: 1, explanation: "'Want to' + base verb.", factoid: "Infinitive follows 'want'." },
            { question: "Complete: 'She ___ her homework yesterday.'", options: ["do", "does", "did", "done"], answer: 2, explanation: "Past tense 'did' for yesterday.", factoid: "Past simple for completed actions." }
        ]
    };
    
    let allQuestions = [];
    for (const cat of currentState.selectedCategories) {
        if (localBank[cat]) {
            allQuestions.push(...localBank[cat]);
        } else if (cat === 'word') {
            allQuestions.push(...localBank.synonyms);
        } else if (cat === 'punctuation' || cat === 'verbs' || cat === 'nouns' || cat === 'voice' || cat === 'narration') {
            allQuestions.push(...localBank.grammar);
        }
    }
    
    if (allQuestions.length === 0) {
        allQuestions = localBank.grammar;
    }
    
    while (allQuestions.length < CONFIG.QUESTIONS_PER_QUIZ) {
        allQuestions.push(...allQuestions);
    }
    
    return allQuestions.slice(0, CONFIG.QUESTIONS_PER_QUIZ);
}

// ==================== UTILITIES ====================
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function showLoading(message) {
    const overlay = document.getElementById('loadingOverlay');
    document.getElementById('loadingMessage').textContent = message;
    overlay.style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

async function incrementUsage(toolSlug) {
    try {
        const response = await fetch(`${CONFIG.CLOUD_WORKER_URL}/api/usage/increment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: toolSlug, user_id: localStorage.getItem('userId') || 'anonymous' })
        });
        const data = await response.json();
        updateUsageDisplay(data.count);
        return data;
    } catch (error) {
        toolUsageCount++;
        updateUsageDisplay(toolUsageCount);
    }
}

function updateUsageDisplay(count) {
    const elements = document.querySelectorAll('#globalUsageCount, .stats-badge');
    elements.forEach(el => { if (el) el.textContent = count.toLocaleString(); });
}

// ==================== REACTIONS ====================
async function addReaction(emoji) {
    const userId = localStorage.getItem('userId') || `user_${Date.now()}`;
    localStorage.setItem('userId', userId);
    const reactionKey = `english_quiz_${emoji}_${userId}`;
    
    if (userReactions.has(reactionKey)) {
        showToast(`You already reacted with ${getEmojiName(emoji)}!`, 'warning');
        return;
    }
    
    userReactions.add(reactionKey);
    
    // Update UI
    const countSpan = document.getElementById(`reaction${emoji.charAt(0).toUpperCase() + emoji.slice(1)}`);
    if (countSpan) {
        const currentCount = parseInt(countSpan.textContent) || 0;
        countSpan.textContent = currentCount + 1;
    }
    
    showToast(`${getEmojiName(emoji)} reaction added!`, 'success');
}

function getEmojiName(emoji) {
    const names = { like: '👍', love: '❤️', wow: '😮', sad: '😢', angry: '😠', laugh: '😂', celebrate: '🎉' };
    return names[emoji] || emoji;
}

// ==================== SHARING ====================
function shareQuiz(platform) {
    const url = window.location.href;
    const text = `I'm learning English on this quiz! Join me at English Quiz Challenge!`;
    
    let shareUrl = '';
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
            break;
    }
    
    if (shareUrl) window.open(shareUrl, '_blank');
    showToast(`Shared on ${platform}!`);
}

function copyPageUrl() {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link copied to clipboard!');
}

// ==================== QUIZ FUNCTIONS ====================
async function startQuiz() {
    showLoading('Loading questions...');
    
    currentState.currentQuestion = 0;
    currentState.score = 0;
    currentState.lives = 3;
    currentState.userAnswers = [];
    currentState.powerups = { fifty: 3, time: 3, hint: 3, skip: 3 };
    currentState.weakAreas = {};
    
    const questions = await generateQuestionsFromAI();
    currentState.questions = questions;
    
    document.getElementById('setupContainer').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';
    document.getElementById('resultsContainer').style.display = 'none';
    document.getElementById('quizMode').textContent = currentState.mode.charAt(0).toUpperCase() + currentState.mode.slice(1);
    document.getElementById('quizLevel').textContent = currentState.difficulty.charAt(0).toUpperCase() + currentState.difficulty.slice(1);
    document.getElementById('totalQuestions').textContent = currentState.questions.length;
    document.getElementById('livesCount').textContent = currentState.lives;
    document.getElementById('scoreCount').textContent = currentState.score;
    
    loadQuestion();
    incrementUsage(`english_quiz_${currentState.mode}`);
}

function loadQuestion() {
    if (currentState.timer) clearInterval(currentState.timer);
    
    if (currentState.mode !== 'practice') {
        currentState.timeLeft = CONFIG.DEFAULT_TIMER;
        updateTimerDisplay();
        currentState.timer = setInterval(() => {
            currentState.timeLeft--;
            updateTimerDisplay();
            if (currentState.timeLeft <= 0) handleTimeout();
        }, 1000);
    }
    
    const q = currentState.questions[currentState.currentQuestion];
    document.getElementById('questionText').textContent = q.question;
    document.getElementById('currentQuestionNum').textContent = currentState.currentQuestion + 1;
    document.getElementById('progressFill').style.width = `${((currentState.currentQuestion + 1) / currentState.questions.length) * 100}%`;
    
    const optsContainer = document.getElementById('optionsList');
    optsContainer.innerHTML = '';
    q.options.forEach((opt, idx) => {
        const div = document.createElement('div');
        div.className = 'option';
        div.textContent = `${String.fromCharCode(65 + idx)}. ${opt}`;
        div.onclick = () => selectAnswer(idx);
        optsContainer.appendChild(div);
    });
    
    document.getElementById('explanationBox').style.display = 'none';
    document.getElementById('nextBtn').disabled = true;
    updatePowerupsDisplay();
}

function selectAnswer(selectedIdx) {
    if (currentState.userAnswers[currentState.currentQuestion]) return;
    
    const q = currentState.questions[currentState.currentQuestion];
    const isCorrect = (selectedIdx === q.answer);
    
    if (isCorrect) {
        currentState.score += 10;
        showToast('✅ Correct!', 'success');
        playSound(true);
    } else {
        currentState.lives--;
        showToast(`❌ Incorrect. Answer: ${String.fromCharCode(65 + q.answer)}`, 'error');
        playSound(false);
        trackWeakArea(q.category || 'general');
    }
    
    currentState.userAnswers[currentState.currentQuestion] = { selected: selectedIdx, correct: isCorrect };
    document.getElementById('livesCount').textContent = currentState.lives;
    document.getElementById('scoreCount').textContent = currentState.score;
    
    const opts = document.querySelectorAll('.option');
    opts.forEach((opt, idx) => {
        if (idx === q.answer) opt.classList.add('correct');
        else if (idx === selectedIdx && !isCorrect) opt.classList.add('incorrect');
        opt.style.pointerEvents = 'none';
    });
    
    document.getElementById('explanationText').textContent = q.explanation;
    document.getElementById('factoidText').textContent = q.factoid || '💡 Tip: Practice daily to improve your English!';
    document.getElementById('translationText').textContent = getUrduTranslation(q.question);
    document.getElementById('explanationBox').style.display = 'block';
    document.getElementById('nextBtn').disabled = false;
    
    if (currentState.timer) clearInterval(currentState.timer);
    
    if (currentState.lives <= 0) setTimeout(() => endQuiz(), 1500);
}

function getUrduTranslation(text) {
    const translations = {
        'happy': 'خوش', 'beautiful': 'خوبصورت', 'smart': 'ذہین',
        'big': 'بڑا', 'fast': 'تیز', 'cold': 'ٹھنڈا',
        'noun': 'اسم', 'verb': 'فعل', 'sentence': 'جملہ'
    };
    for (const [word, urdu] of Object.entries(translations)) {
        if (text.toLowerCase().includes(word)) return `🇵🇰 اردو: ${urdu}`;
    }
    return '🇵🇰 Tap for Urdu translation';
}

function trackWeakArea(category) {
    if (!currentState.weakAreas[category]) currentState.weakAreas[category] = 0;
    currentState.weakAreas[category]++;
}

function handleTimeout() {
    const q = currentState.questions[currentState.currentQuestion];
    currentState.userAnswers[currentState.currentQuestion] = { selected: -1, correct: false };
    currentState.lives--;
    document.getElementById('livesCount').textContent = currentState.lives;
    showToast(`⏰ Time's up! Answer: ${String.fromCharCode(65 + q.answer)}`, 'warning');
    
    const opts = document.querySelectorAll('.option');
    opts.forEach((opt, idx) => { if (idx === q.answer) opt.classList.add('correct'); });
    document.getElementById('explanationBox').style.display = 'block';
    document.getElementById('nextBtn').disabled = false;
    
    if (currentState.lives <= 0) setTimeout(() => endQuiz(), 1500);
}

function nextQuestion() {
    if (currentState.currentQuestion + 1 < currentState.questions.length) {
        currentState.currentQuestion++;
        loadQuestion();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    if (currentState.timer) clearInterval(currentState.timer);
    
    const percentage = Math.round((currentState.score / (currentState.questions.length * 10)) * 100);
    const correctCount = currentState.userAnswers.filter(a => a && a.correct).length;
    
    document.getElementById('finalScoreValue').textContent = `${percentage}%`;
    
    let badge = 'English Learner 📖';
    if (percentage >= 90) badge = 'English Master 🎓🏆';
    else if (percentage >= 75) badge = 'Language Expert 🌟';
    else if (percentage >= 50) badge = 'Word Wizard ✨';
    document.getElementById('badgeEarned').textContent = badge;
    
    // Update streak
    let streak = parseInt(localStorage.getItem('englishStreak') || '0');
    if (percentage >= 60) { streak++; localStorage.setItem('englishStreak', streak); }
    else { streak = 0; localStorage.setItem('englishStreak', '0'); }
    document.getElementById('streakCount').textContent = streak;
    
    // Show weak areas
    const weakList = document.getElementById('weakAreasList');
    weakList.innerHTML = '';
    const sorted = Object.entries(currentState.weakAreas).sort((a, b) => b[1] - a[1]);
    sorted.slice(0, 5).forEach(([area, count]) => {
        const tag = document.createElement('span');
        tag.className = 'weak-area-tag';
        tag.textContent = `${area}: ${count} mistakes`;
        weakList.appendChild(tag);
    });
    
    // Update chart
    updateProgressChart(percentage);
    
    document.getElementById('quizContainer').style.display = 'none';
    document.getElementById('resultsContainer').style.display = 'block';
    
    if (percentage >= 75) createConfetti();
}

function updateProgressChart(score) {
    const ctx = document.getElementById('progressChart').getContext('2d');
    if (progressChart) progressChart.destroy();
    progressChart = new Chart(ctx, {
        type: 'line',
        data: { labels: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Current'], datasets: [{ label: 'Your Progress', data: [35, 55, 70, score], borderColor: '#4361ee', backgroundColor: 'rgba(67,97,238,0.1)', fill: true, tension: 0.4 }] },
        options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'top' } } }
    });
}

// ==================== POWERUPS ====================
function usePowerup(type) {
    if (currentState.powerups[type] <= 0) { showToast(`No ${type} left!`, 'warning'); return; }
    if (currentState.userAnswers[currentState.currentQuestion]) { showToast('Already answered!', 'warning'); return; }
    
    const q = currentState.questions[currentState.currentQuestion];
    currentState.powerups[type]--;
    
    if (type === 'fifty') {
        const wrong = [];
        for (let i = 0; i < q.options.length; i++) if (i !== q.answer) wrong.push(i);
        const toRemove = wrong.slice(0, 2);
        document.querySelectorAll('.option').forEach((opt, idx) => {
            if (toRemove.includes(idx)) opt.style.opacity = '0.4';
        });
        showToast('50/50 used! Two options eliminated.', 'success');
    } else if (type === 'time') {
        if (!isPremium()) { showPremiumModal(); return; }
        currentState.timeLeft = Math.min(currentState.timeLeft + 30, CONFIG.DEFAULT_TIMER + 30);
        updateTimerDisplay();
        showToast('+30 seconds added!', 'success');
    } else if (type === 'hint') {
        if (!isPremium()) { showPremiumModal(); return; }
        showToast(`💡 Hint: ${q.explanation.substring(0, 100)}...`, 'info');
    } else if (type === 'skip') {
        nextQuestion();
        showToast('Question skipped!', 'info');
    }
    updatePowerupsDisplay();
}

function updatePowerupsDisplay() {
    document.querySelectorAll('.powerup-btn').forEach(btn => {
        const type = btn.getAttribute('data-powerup');
        const span = btn.querySelector('.powerup-count');
        if (span && currentState.powerups[type] !== undefined) {
            span.textContent = currentState.powerups[type];
            if (currentState.powerups[type] === 0) btn.disabled = true;
        }
    });
}

function updateTimerDisplay() {
    const timerEl = document.getElementById('timerDisplay');
    if (timerEl) timerEl.textContent = currentState.timeLeft;
    if (currentState.timeLeft <= 5) timerEl.style.color = '#ef4444';
}

// ==================== AUDIO & SPEECH ====================
function readAloud() {
    if (!currentState.questions[currentState.currentQuestion]) return;
    const q = currentState.questions[currentState.currentQuestion];
    const utterance = new SpeechSynthesisUtterance(q.question);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
}

function startSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window)) { showToast('Speech recognition not supported in this browser', 'error'); return; }
    
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => showToast('🎤 Listening... Speak your answer', 'info');
    recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript.toLowerCase();
        const q = currentState.questions[currentState.currentQuestion];
        const correctOption = q.options[q.answer].toLowerCase();
        
        if (spoken.includes(correctOption) || correctOption.includes(spoken)) {
            selectAnswer(q.answer);
            showToast('✅ Correct answer recognized!', 'success');
        } else {
            showToast(`You said: "${spoken}". Try again!`, 'error');
        }
    };
    recognition.onerror = () => showToast('Speech recognition error. Please try again.', 'error');
    recognition.start();
}

function playSound(isCorrect) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.frequency.value = isCorrect ? 880 : 440;
        gainNode.gain.value = 0.15;
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.5);
        oscillator.stop(audioCtx.currentTime + 0.5);
    } catch(e) { console.log('Audio not supported'); }
}

function createConfetti() {
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = '-20px';
        confetti.style.borderRadius = '50%';
        confetti.style.zIndex = '1000';
        confetti.style.pointerEvents = 'none';
        confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
    }
}

// ==================== UI THEMES & SCROLL ====================
function setupTheme() {
    const saved = localStorage.getItem('theme') || 'light';
    if (saved === 'dark') document.body.setAttribute('data-theme', 'dark');
    document.getElementById('themeToggle').onclick = () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        if (isDark) { document.body.removeAttribute('data-theme'); localStorage.setItem('theme', 'light'); }
        else { document.body.setAttribute('data-theme', 'dark'); localStorage.setItem('theme', 'dark'); }
    };
}

function setupScrollButtons() {
    const up = document.getElementById('scrollUpBtn'), down = document.getElementById('scrollDownBtn');
    window.addEventListener('scroll', () => up.style.display = window.scrollY > 200 ? 'flex' : 'none');
    up.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    down.onclick = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function isPremium() { return localStorage.getItem('isPremium') === 'true'; }
function showPremiumModal() { document.getElementById('premiumModal').style.display = 'flex'; }
function closePremiumModal() { document.getElementById('premiumModal').style.display = 'none'; }

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Mode selection
    document.querySelectorAll('.mode-select-btn').forEach(btn => {
        btn.onclick = (e) => {
            currentState.mode = btn.closest('.mode-card').getAttribute('data-mode');
            document.getElementById('modeContainer').style.display = 'none';
            document.getElementById('setupContainer').style.display = 'block';
        };
    });
    
    // Difficulty
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentState.difficulty = btn.getAttribute('data-diff');
        };
    });
    
    // Categories
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.onclick = () => {
            btn.classList.toggle('active');
            currentState.selectedCategories = Array.from(document.querySelectorAll('.category-btn.active')).map(b => b.getAttribute('data-cat'));
        };
    });
    
    // Start quiz
    document.getElementById('startQuizBtn').onclick = startQuiz;
    document.getElementById('nextBtn').onclick = nextQuestion;
    
    // Powerups
    document.getElementById('fiftyBtn').onclick = () => usePowerup('fifty');
    document.getElementById('timeBtn').onclick = () => usePowerup('time');
    document.getElementById('hintBtn').onclick = () => usePowerup('hint');
    document.getElementById('skipBtn').onclick = () => usePowerup('skip');
    
    // Results buttons
    document.getElementById('tryAgainBtn').onclick = () => {
        document.getElementById('resultsContainer').style.display = 'none';
        document.getElementById('setupContainer').style.display = 'block';
    };
    document.getElementById('changeModeBtn').onclick = () => {
        document.getElementById('resultsContainer').style.display = 'none';
        document.getElementById('modeContainer').style.display = 'grid';
    };
    document.getElementById('practiceWeakBtn').onclick = () => {
        showToast('Practice mode coming soon!', 'info');
    };
    
    // Audio
    document.getElementById('readAloudBtn').onclick = readAloud;
    document.getElementById('speechAnswerBtn').onclick = startSpeechRecognition;
    
    // Share buttons
    document.querySelectorAll('.share-mini-btn').forEach(btn => {
        btn.onclick = () => {
            const platform = btn.getAttribute('data-platform');
            if (platform) shareQuiz(platform);
            else if (btn.id === 'copyPageUrlBtn') copyPageUrl();
        };
    });
    
    // Reaction buttons
    document.querySelectorAll('.reaction-mini-btn').forEach(btn => {
        btn.onclick = () => addReaction(btn.getAttribute('data-emoji'));
    });
    
    // Modal
    document.getElementById('closeModalBtn').onclick = closePremiumModal;
    document.getElementById('maybeLaterBtn').onclick = closePremiumModal;
    document.getElementById('upgradeBtn').onclick = () => {
        localStorage.setItem('isPremium', 'true');
        showToast('Premium activated! 🎉', 'success');
        closePremiumModal();
    };
    
    // Stats button
    document.getElementById('statsBtn').onclick = () => showToast(`Total plays: ${toolUsageCount}`, 'info');
}

// ==================== INITIALIZATION ====================
function init() {
    setupTheme();
    setupScrollButtons();
    setupEventListeners();
    incrementUsage('english_quiz_total');
    
    const savedStreak = localStorage.getItem('englishStreak') || '0';
    document.getElementById('streakCount').textContent = savedStreak;
    document.getElementById('totalQuestionsCount').textContent = '10,000+';
    document.getElementById('totalUsersCount').textContent = '1,234';
    
    showToast('Welcome to English Quiz Challenge! 📖 AI generates 35 fresh questions each time', 'success');
}

// Add confetti animation CSS
const style = document.createElement('style');
style.textContent = `@keyframes confettiFall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(360deg); opacity: 0; } }`;
document.head.appendChild(style);

// Start the app
document.addEventListener('DOMContentLoaded', init);
