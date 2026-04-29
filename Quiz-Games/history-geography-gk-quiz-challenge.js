// ==================== CONFIGURATION ====================
const CONFIG = {
    APP_NAME: 'History, Geography & GK Quiz Challenge',
    VERSION: '4.0.0',
    CLOUD_WORKER_URL: 'https://computer-quiz-challenge.uzairhameed01.workers.dev',
    QUESTIONS_PER_QUIZ: 20
};

// ==================== GLOBAL STATE ====================
let currentState = {
    subject: 'history',
    level: 1,
    questions: [],
    currentQuestion: 0,
    score: 0,
    totalPoints: 0,
    lives: 3,
    userAnswers: [],
    powerups: { fifty: 3, time: 3, hint: 3, skip: 3 },
    timer: null,
    timeLeft: 60,
    streak: 0,
    weakAreas: {},
    sessionId: null,
    aiGenerated: false
};

let userReactions = new Set();
let toolUsageCount = 0;
let progressChart = null;

// ==================== TIME LIMITS PER LEVEL ====================
const TIME_LIMITS = { 1: 60, 2: 45, 3: 30 };
const POINTS_PER_LEVEL = { 1: 1, 2: 2, 3: 3 };

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
    showLoading(`🤖 AI is generating ${CONFIG.QUESTIONS_PER_QUIZ} unique ${currentState.subject} questions for Level ${currentState.level}...`);
    
    const subjectNames = { history: 'History', geography: 'Geography', gk: 'General Knowledge' };
    const levelNames = { 1: 'easy', 2: 'average', 3: 'hard' };
    
    let topicHint = '';
    if (currentState.subject === 'history') {
        topicHint = 'Include questions about ancient civilizations, medieval period, world wars, important historical figures, revolutions, and modern history. Make sure questions vary across different time periods and regions.';
    } else if (currentState.subject === 'geography') {
        topicHint = 'Include questions about countries, capitals, rivers, mountains, oceans, climates, natural wonders, population, and physical geography. Cover all continents.';
    } else {
        topicHint = 'Include questions about science, sports, awards, literature, arts, entertainment, technology, current affairs, and world records. Make questions diverse and interesting.';
    }
    
    const prompt = `Generate ${CONFIG.QUESTIONS_PER_QUIZ} unique, diverse multiple choice questions for ${subjectNames[currentState.subject]} at ${levelNames[currentState.level]} difficulty level.

${topicHint}

Requirements:
1. Each question must be completely different from others
2. Cover different subtopics within the subject
3. No repetitive or similar questions
4. All questions must be accurate and educational

For each question provide:
- question: The question text
- options: Array of 4 options (A, B, C, D)
- answer: Index of correct answer (0-3)
- explanation: Detailed explanation (2-3 sentences)
- factoid: Interesting fact related to the question

Return ONLY valid JSON format:
{
  "questions": [
    {
      "question": "text",
      "options": ["A", "B", "C", "D"],
      "answer": 0,
      "explanation": "detailed explanation",
      "factoid": "interesting fact"
    }
  ]
}

Make sure questions are age-appropriate and factually correct.`;

    const result = await callGrokAPI(prompt);
    
    if (result && result.questions && result.questions.length >= 10) {
        hideLoading();
        currentState.aiGenerated = true;
        return result.questions.slice(0, CONFIG.QUESTIONS_PER_QUIZ);
    } else {
        hideLoading();
        showToast('Using high-quality local question bank', 'warning');
        return getLocalQuestions();
    }
}

function getLocalQuestions() {
    const localBanks = {
        history: {
            1: [
                { question: "Which ancient civilization built the Pyramids of Giza?", options: ["Egyptian", "Roman", "Greek", "Mesopotamian"], answer: 0, explanation: "The ancient Egyptians built the Pyramids of Giza as tombs for their pharaohs around 2560 BCE.", factoid: "The Great Pyramid is the only remaining wonder of the ancient world.", points: 1, category: "history" },
                { question: "Who was the first Emperor of China?", options: ["Qin Shi Huang", "Confucius", "Sun Tzu", "Kublai Khan"], answer: 0, explanation: "Qin Shi Huang unified China in 221 BCE and became its first emperor.", factoid: "The Terracotta Army was built to protect him in the afterlife.", points: 1, category: "history" },
                { question: "Which empire was known as 'The Empire on which the sun never sets'?", options: ["British Empire", "Roman Empire", "Ottoman Empire", "Mongol Empire"], answer: 0, explanation: "The British Empire had territories across the globe at its peak.", factoid: "At its height, it controlled nearly 25% of Earth's land surface.", points: 1, category: "history" },
                { question: "Who painted the Mona Lisa?", options: ["Leonardo da Vinci", "Michelangelo", "Raphael", "Van Gogh"], answer: 0, explanation: "Leonardo da Vinci painted the Mona Lisa during the Renaissance period.", factoid: "The painting is displayed at the Louvre Museum in Paris.", points: 1, category: "history" },
                { question: "Which year did World War II end?", options: ["1945", "1944", "1946", "1943"], answer: 0, explanation: "World War II ended in 1945 after the Allied victory.", factoid: "The war resulted in an estimated 70-85 million casualties.", points: 1, category: "history" }
            ],
            2: [
                { question: "Who was the longest-reigning British monarch?", options: ["Queen Elizabeth II", "Queen Victoria", "King George III", "King Henry VIII"], answer: 0, explanation: "Queen Elizabeth II reigned for 70 years, the longest in British history.", factoid: "She became queen at age 25 in 1952.", points: 2, category: "history" },
                { question: "Which ancient wonder was located at Alexandria?", options: ["Lighthouse of Alexandria", "Colossus of Rhodes", "Hanging Gardens", "Temple of Artemis"], answer: 0, explanation: "The Lighthouse of Alexandria was one of the Seven Wonders.", factoid: "It was one of the tallest structures of its time.", points: 2, category: "history" }
            ],
            3: [
                { question: "Who wrote 'The Prince', a political treatise on power?", options: ["Niccolò Machiavelli", "Thomas Hobbes", "John Locke", "Voltaire"], answer: 0, explanation: "Machiavelli wrote 'The Prince' in 1513 as a guide for rulers.", factoid: "The term 'Machiavellian' comes from his philosophies.", points: 3, category: "history" },
                { question: "Which battle is considered the turning point of World War I?", options: ["Battle of Verdun", "Battle of Somme", "Battle of Marne", "Battle of Gallipoli"], answer: 0, explanation: "The Battle of Verdun lasted 10 months and caused massive casualties.", factoid: "It was one of the longest battles in human history.", points: 3, category: "history" }
            ]
        },
        geography: {
            1: [
                { question: "What is the longest river in the world?", options: ["Nile River", "Amazon River", "Yangtze River", "Mississippi River"], answer: 0, explanation: "The Nile River is approximately 6,650 km (4,130 miles) long.", factoid: "The Nile flows through 11 countries in Africa.", points: 1, category: "geography" },
                { question: "Which is the largest desert in the world?", options: ["Sahara Desert", "Gobi Desert", "Arabian Desert", "Antarctic Desert"], answer: 3, explanation: "The Antarctic Desert is the largest, covering 14 million sq km.", factoid: "Deserts are defined by low rainfall, not temperature.", points: 1, category: "geography" },
                { question: "Which country has the largest population?", options: ["China", "India", "USA", "Indonesia"], answer: 0, explanation: "China has over 1.4 billion people, the world's largest.", factoid: "India is expected to surpass China soon.", points: 1, category: "geography" },
                { question: "What is the capital of Japan?", options: ["Tokyo", "Kyoto", "Osaka", "Yokohama"], answer: 0, explanation: "Tokyo has been the capital of Japan since 1868.", factoid: "Tokyo is the world's most populous metropolitan area.", points: 1, category: "geography" }
            ],
            2: [
                { question: "Which country has the most natural lakes?", options: ["Canada", "USA", "Russia", "Brazil"], answer: 0, explanation: "Canada has over 2 million lakes, more than any other country.", factoid: "Great Bear Lake is one of Canada's largest lakes.", points: 2, category: "geography" }
            ],
            3: [
                { question: "What is the deepest point in the ocean?", options: ["Mariana Trench", "Puerto Rico Trench", "Java Trench", "South Sandwich Trench"], answer: 0, explanation: "The Mariana Trench reaches depths of about 11,000 meters.", factoid: "Only three people have ever reached the bottom.", points: 3, category: "geography" }
            ]
        },
        gk: {
            1: [
                { question: "Who wrote the national anthem of Pakistan?", options: ["Hafeez Jullundhri", "Allama Iqbal", "Faiz Ahmed Faiz", "Ahmed Faraz"], answer: 0, explanation: "Hafeez Jullundhri wrote the lyrics of the Pakistani national anthem in 1952.", factoid: "The music was composed by Ahmed G. Chagla.", points: 1, category: "gk" },
                { question: "Which is the national sport of Pakistan?", options: ["Field Hockey", "Cricket", "Squash", "Football"], answer: 0, explanation: "Field Hockey is the national sport of Pakistan.", factoid: "Pakistan has won Olympic gold medals in hockey.", points: 1, category: "gk" }
            ],
            2: [
                { question: "Who won the Nobel Peace Prize in 2014?", options: ["Malala Yousafzai", "Kailash Satyarthi", "Barack Obama", "Mother Teresa"], answer: 0, explanation: "Malala Yousafzai won for her activism for female education.", factoid: "She is the youngest Nobel laureate ever.", points: 2, category: "gk" }
            ],
            3: [
                { question: "What is the chemical symbol for Gold?", options: ["Au", "Ag", "Fe", "Pb"], answer: 0, explanation: "Au comes from the Latin word 'aurum' meaning gold.", factoid: "Gold is one of the least reactive metals.", points: 3, category: "gk" }
            ]
        }
    };
    
    let questions = localBanks[currentState.subject]?.[currentState.level] || localBanks.history[1];
    const expanded = [...questions];
    while (expanded.length < CONFIG.QUESTIONS_PER_QUIZ) {
        expanded.push(...questions);
    }
    return expanded.slice(0, CONFIG.QUESTIONS_PER_QUIZ);
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
    document.querySelectorAll('.stats-badge, #globalUsageCount').forEach(el => {
        if (el) el.textContent = count.toLocaleString();
    });
}

// ==================== REACTIONS ====================
async function addReaction(emoji, isMainPage = true) {
    const userId = localStorage.getItem('userId') || `user_${Date.now()}`;
    localStorage.setItem('userId', userId);
    const reactionKey = `history_gk_${emoji}_${userId}`;
    
    if (userReactions.has(reactionKey)) {
        showToast(`Already reacted with ${getEmojiName(emoji)}!`, 'warning');
        return;
    }
    
    userReactions.add(reactionKey);
    
    if (isMainPage) {
        const countSpan = document.getElementById(`reaction${emoji.charAt(0).toUpperCase() + emoji.slice(1)}`);
        if (countSpan) countSpan.textContent = parseInt(countSpan.textContent) + 1;
    }
    
    showToast(`${getEmojiName(emoji)} reaction added!`, 'success');
}

function getEmojiName(emoji) {
    const names = { like: '👍', love: '❤️', wow: '😮', sad: '😢', laugh: '😂', celebrate: '🎉' };
    return names[emoji] || emoji;
}

// ==================== SHARING ====================
function shareQuiz(platform) {
    const url = window.location.href;
    const score = document.getElementById('finalScoreValue')?.textContent || '0';
    const text = `I scored ${score} on the ${currentState.subject} quiz at Level ${currentState.level}! Try it yourself!`;
    
    let shareUrl = '';
    switch(platform) {
        case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`; break;
        case 'twitter': shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`; break;
        case 'whatsapp': shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`; break;
        case 'linkedin': shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`; break;
        case 'email': shareUrl = `mailto:?subject=Quiz Challenge&body=${encodeURIComponent(text + '\n\n' + url)}`; break;
    }
    if (shareUrl) window.open(shareUrl, '_blank');
    showToast(`Shared on ${platform}!`);
}

function copyPageUrl() {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link copied to clipboard!');
}

// ==================== QUIZ FUNCTIONS ====================
async function startQuiz(subject, level) {
    currentState.subject = subject;
    currentState.level = level;
    currentState.currentQuestion = 0;
    currentState.score = 0;
    currentState.totalPoints = 0;
    currentState.lives = 3;
    currentState.userAnswers = [];
    currentState.powerups = { fifty: 3, time: 3, hint: 3, skip: 3 };
    currentState.weakAreas = {};
    currentState.timeLeft = TIME_LIMITS[level];
    
    showLoading('🤖 AI is generating unique questions...');
    
    const questions = await generateQuestionsFromAI();
    currentState.questions = questions;
    
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('levelsContainer').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';
    document.getElementById('resultsContainer').style.display = 'none';
    
    const subjectNames = { history: 'History', geography: 'Geography', gk: 'General Knowledge' };
    const levelNames = { 1: 'Easy', 2: 'Average', 3: 'Hard' };
    document.getElementById('quizSubject').textContent = subjectNames[subject];
    document.getElementById('quizLevel').textContent = levelNames[level];
    document.getElementById('totalQuestions').textContent = currentState.questions.length;
    document.getElementById('livesCount').textContent = currentState.lives;
    document.getElementById('scoreCount').textContent = currentState.score;
    
    loadQuestion();
    startTimer();
    incrementUsage(`quiz_${subject}_level${level}`);
}

function startTimer() {
    if (currentState.timer) clearInterval(currentState.timer);
    currentState.timer = setInterval(() => {
        if (currentState.timeLeft <= 0) {
            clearInterval(currentState.timer);
            handleTimeout();
        } else {
            currentState.timeLeft--;
            document.getElementById('timerDisplay').textContent = currentState.timeLeft;
            if (currentState.timeLeft <= 5) {
                document.getElementById('timerDisplay').style.color = '#ef4444';
                document.getElementById('timerDisplay').style.animation = 'pulse 0.5s infinite';
            }
        }
    }, 1000);
}

function handleTimeout() {
    if (currentState.userAnswers[currentState.currentQuestion] !== undefined) return;
    currentState.lives--;
    document.getElementById('livesCount').textContent = currentState.lives;
    showToast(`⏰ Time's up! -1 life`, 'error');
    
    if (currentState.lives <= 0) {
        endQuiz();
    } else {
        currentState.userAnswers[currentState.currentQuestion] = { selected: -1, correct: false };
        document.getElementById('nextBtn').disabled = false;
    }
}

function loadQuestion() {
    const q = currentState.questions[currentState.currentQuestion];
    document.getElementById('questionText').textContent = q.question;
    document.getElementById('questionPoints').textContent = `+${POINTS_PER_LEVEL[currentState.level]} point${POINTS_PER_LEVEL[currentState.level] > 1 ? 's' : ''}`;
    document.getElementById('questionCategory').textContent = currentState.subject.charAt(0).toUpperCase() + currentState.subject.slice(1);
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
    document.getElementById('prevBtn').disabled = currentState.currentQuestion === 0;
    updatePowerupsDisplay();
}

function selectAnswer(selectedIdx) {
    if (currentState.userAnswers[currentState.currentQuestion] !== undefined) return;
    
    const q = currentState.questions[currentState.currentQuestion];
    const isCorrect = (selectedIdx === q.answer);
    
    if (isCorrect) {
        currentState.totalPoints += POINTS_PER_LEVEL[currentState.level];
        currentState.score += 10;
        showToast('✅ Correct!', 'success');
        playSound(true);
    } else {
        currentState.lives--;
        showToast(`❌ Incorrect! Correct: ${String.fromCharCode(65 + q.answer)}`, 'error');
        playSound(false);
        trackWeakArea(q.category || currentState.subject);
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
    document.getElementById('factoidText').textContent = q.factoid || '📚 Keep learning! Every quiz makes you smarter.';
    document.getElementById('explanationBox').style.display = 'block';
    document.getElementById('nextBtn').disabled = false;
    
    if (currentState.lives <= 0) setTimeout(() => endQuiz(), 1500);
}

function trackWeakArea(category) {
    if (!currentState.weakAreas[category]) currentState.weakAreas[category] = 0;
    currentState.weakAreas[category]++;
}

function nextQuestion() {
    if (currentState.currentQuestion + 1 < currentState.questions.length) {
        currentState.currentQuestion++;
        loadQuestion();
    } else {
        endQuiz();
    }
}

function prevQuestion() {
    if (currentState.currentQuestion > 0) {
        currentState.currentQuestion--;
        loadQuestion();
    }
}

function endQuiz() {
    if (currentState.timer) clearInterval(currentState.timer);
    
    const percentage = Math.round((currentState.score / (currentState.questions.length * 10)) * 100);
    const correctCount = currentState.userAnswers.filter(a => a && a.correct).length;
    
    document.getElementById('finalScoreValue').textContent = `${percentage}%`;
    
    let badge = 'Knowledge Explorer 📚';
    if (percentage >= 90) badge = 'Master Historian 🎓🏆';
    else if (percentage >= 75) badge = 'Wisdom Seeker 🌟';
    else if (percentage >= 50) badge = 'Curious Learner ✨';
    document.getElementById('badgeEarned').textContent = badge;
    
    let streak = parseInt(localStorage.getItem('historyStreak') || '0');
    if (percentage >= 60) { streak++; localStorage.setItem('historyStreak', streak); }
    else { streak = 0; localStorage.setItem('historyStreak', '0'); }
    document.getElementById('streakCount').textContent = streak;
    
    const weakList = document.getElementById('weakAreasList');
    weakList.innerHTML = '';
    Object.entries(currentState.weakAreas).slice(0, 5).forEach(([area, count]) => {
        const tag = document.createElement('span');
        tag.className = 'weak-area-tag';
        tag.textContent = `${area}: ${count} mistakes`;
        weakList.appendChild(tag);
    });
    
    updateProgressChart(percentage);
    
    document.getElementById('quizContainer').style.display = 'none';
    document.getElementById('resultsContainer').style.display = 'block';
    if (percentage >= 75) createConfetti();
}

function updateProgressChart(score) {
    const ctx = document.getElementById('progressChart')?.getContext('2d');
    if (!ctx) return;
    if (progressChart) progressChart.destroy();
    progressChart = new Chart(ctx, {
        type: 'line',
        data: { labels: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Current'], datasets: [{ label: 'Your Progress', data: [40, 55, 70, score], borderColor: '#8e44ad', backgroundColor: 'rgba(142,68,173,0.1)', fill: true, tension: 0.4 }] },
        options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'top' } } }
    });
}

// ==================== POWERUPS ====================
function usePowerup(type) {
    if (currentState.powerups[type] <= 0) { showToast(`No ${type} left!`, 'warning'); return; }
    if (currentState.userAnswers[currentState.currentQuestion] !== undefined) { showToast('Already answered!', 'warning'); return; }
    
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
        currentState.timeLeft += 30;
        showToast('+30 seconds added!', 'success');
    } else if (type === 'hint') {
        if (!isPremium()) { showPremiumModal(); return; }
        showToast(`💡 Hint: ${q.explanation.substring(0, 80)}...`, 'info');
    } else if (type === 'skip') {
        if (currentState.userAnswers[currentState.currentQuestion] !== undefined) return;
        currentState.userAnswers[currentState.currentQuestion] = { selected: -1, correct: false };
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

// ==================== AUDIO & SPEECH ====================
function readAloud() {
    const q = currentState.questions[currentState.currentQuestion];
    if (!q) return;
    const utterance = new SpeechSynthesisUtterance(q.question);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
}

function startSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window)) { showToast('Speech recognition not supported', 'error'); return; }
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript.toLowerCase();
        const q = currentState.questions[currentState.currentQuestion];
        const correctOption = q.options[q.answer].toLowerCase();
        if (spoken.includes(correctOption) || correctOption.includes(spoken)) {
            selectAnswer(q.answer);
        } else {
            showToast(`You said: "${spoken}". Try again!`, 'error');
        }
    };
    recognition.start();
    showToast('🎤 Listening... Speak your answer', 'info');
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
    } catch(e) {}
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
    document.querySelectorAll('.subject-select-btn').forEach(btn => {
        btn.onclick = (e) => {
            const card = btn.closest('.subject-card');
            const subject = card.getAttribute('data-subject');
            const subjectNames = { history: 'History', geography: 'Geography', gk: 'General Knowledge' };
            document.getElementById('selectedSubjectTitle').textContent = subjectNames[subject];
            currentState.subject = subject;
            document.getElementById('dashboard').style.display = 'none';
            document.getElementById('levelsContainer').style.display = 'block';
        };
    });
    
    document.querySelectorAll('.level-start-btn').forEach(btn => {
        btn.onclick = (e) => {
            const level = parseInt(btn.closest('.level-card').getAttribute('data-level'));
            startQuiz(currentState.subject, level);
        };
    });
    
    document.getElementById('backToDashboardBtn').onclick = () => {
        document.getElementById('levelsContainer').style.display = 'none';
        document.getElementById('dashboard').style.display = 'grid';
    };
    
    document.getElementById('nextBtn').onclick = nextQuestion;
    document.getElementById('prevBtn').onclick = prevQuestion;
    document.getElementById('fiftyBtn').onclick = () => usePowerup('fifty');
    document.getElementById('timeBtn').onclick = () => usePowerup('time');
    document.getElementById('hintBtn').onclick = () => usePowerup('hint');
    document.getElementById('skipBtn').onclick = () => usePowerup('skip');
    document.getElementById('readAloudBtn').onclick = readAloud;
    document.getElementById('speechAnswerBtn').onclick = startSpeechRecognition;
    document.getElementById('tryAgainBtn').onclick = () => startQuiz(currentState.subject, currentState.level);
    document.getElementById('changeLevelBtn').onclick = () => {
        document.getElementById('resultsContainer').style.display = 'none';
        document.getElementById('levelsContainer').style.display = 'block';
    };
    document.getElementById('dashboardReturnBtn').onclick = () => {
        document.getElementById('resultsContainer').style.display = 'none';
        document.getElementById('dashboard').style.display = 'grid';
    };
    
    document.querySelectorAll('.reaction-mini-btn').forEach(btn => {
        btn.onclick = () => addReaction(btn.getAttribute('data-emoji'), true);
    });
    document.querySelectorAll('.share-mini-btn').forEach(btn => {
        if (btn.id === 'copyPageUrlBtn') btn.onclick = copyPageUrl;
        else btn.onclick = () => shareQuiz(btn.getAttribute('data-platform'));
    });
    document.querySelectorAll('.reaction-emoji').forEach(btn => {
        btn.onclick = () => addReaction(btn.getAttribute('data-emoji'), false);
    });
    document.querySelectorAll('.social-icon').forEach(btn => {
        btn.onclick = () => shareQuiz(btn.getAttribute('data-platform'));
    });
    
    document.getElementById('closeModalBtn').onclick = closePremiumModal;
    document.getElementById('maybeLaterBtn').onclick = closePremiumModal;
    document.getElementById('upgradeBtn').onclick = () => {
        localStorage.setItem('isPremium', 'true');
        showToast('Premium activated! 🎉', 'success');
        closePremiumModal();
    };
    document.getElementById('statsBtn').onclick = () => showToast(`Total plays: ${toolUsageCount}`, 'info');
}

// ==================== INITIALIZATION ====================
function init() {
    setupTheme();
    setupScrollButtons();
    setupEventListeners();
    incrementUsage('history_gk_quiz_total');
    
    const savedStreak = localStorage.getItem('historyStreak') || '0';
    document.getElementById('streakCount').textContent = savedStreak;
    document.getElementById('totalUsersCount').textContent = '5,000+';
    document.getElementById('totalQuestionsCount').textContent = '5000+';
    
    showToast('Welcome to History, Geography & GK Quiz Challenge! 🤖 AI generates unique questions each time', 'success');
}

const style = document.createElement('style');
style.textContent = `@keyframes confettiFall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(360deg); opacity: 0; } } @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', init);
