// ==================== CONFIGURATION ====================
const CONFIG = {
    APP_NAME: 'Advanced Science Quiz',
    VERSION: '3.0.0',
    CLOUD_WORKER_URL: 'https://your-worker.workers.dev/api', // Replace with your actual worker URL
    GROQ_API_ENDPOINT: 'https://api.groq.com/openai/v1/chat/completions',
    TIDB_API_ENDPOINT: '/api', // Your TiDB API endpoint
    DEFAULT_TIMER: 60,
    QUESTIONS_PER_QUIZ: 20
};

// ==================== GLOBAL STATE ====================
let currentState = {
    subject: null,
    level: null,
    questions: [],
    currentQuestion: 0,
    score: 0,
    userAnswers: [],
    powerups: { hint: 3, fifty: 3, skip: 3 },
    timer: null,
    timeLeft: 60,
    quizId: null,
    sessionId: null
};

let userReactions = new Set();
let toolUsageCount = 0;

// ==================== UTILITY FUNCTIONS ====================
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function showLoading(message = 'Processing...') {
    const overlay = document.getElementById('loadingOverlay');
    document.getElementById('loadingMessage').textContent = message;
    overlay.style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function formatTime(seconds) {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
}

// ==================== TiDB API INTEGRATION ====================
async function incrementUsage(toolSlug) {
    try {
        const response = await fetch(`${CONFIG.TIDB_API_ENDPOINT}/usage/increment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                tool_slug: toolSlug, 
                user_id: localStorage.getItem('userId') || 'anonymous' 
            })
        });
        const data = await response.json();
        updateUsageDisplay(data.count);
        return data;
    } catch (error) {
        console.error('Usage increment failed:', error);
        // Fallback to local increment
        toolUsageCount++;
        updateUsageDisplay(toolUsageCount);
    }
}

async function getUsageCount(toolSlug) {
    try {
        const response = await fetch(`${CONFIG.TIDB_API_ENDPOINT}/usage/get?tool_slug=${toolSlug}`);
        const data = await response.json();
        toolUsageCount = data.count || 0;
        updateUsageDisplay(toolUsageCount);
        return data;
    } catch (error) {
        console.error('Get usage failed:', error);
        return { count: toolUsageCount };
    }
}

async function addReaction(toolSlug, emoji) {
    const userId = localStorage.getItem('userId') || `user_${Date.now()}`;
    localStorage.setItem('userId', userId);
    
    try {
        const response = await fetch(`${CONFIG.TIDB_API_ENDPOINT}/reactions/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: toolSlug, emoji: emoji, user_id: userId })
        });
        const data = await response.json();
        updateReactionDisplay(data.counts);
        showToast(`${getEmojiName(emoji)} reaction added!`);
        return data;
    } catch (error) {
        console.error('Add reaction failed:', error);
        showToast('Reaction saved locally', 'warning');
    }
}

async function getReactions(toolSlug) {
    try {
        const response = await fetch(`${CONFIG.TIDB_API_ENDPOINT}/reactions/get?tool_slug=${toolSlug}`);
        const data = await response.json();
        updateReactionDisplay(data);
        return data;
    } catch (error) {
        console.error('Get reactions failed:', error);
    }
}

async function trackShare(toolSlug, platform) {
    try {
        const response = await fetch(`${CONFIG.TIDB_API_ENDPOINT}/shares/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: toolSlug, platform: platform })
        });
        return await response.json();
    } catch (error) {
        console.error('Track share failed:', error);
    }
}

function updateUsageDisplay(count) {
    const usageElements = document.querySelectorAll('.usage-count');
    usageElements.forEach(el => {
        if (el) el.textContent = count.toLocaleString();
    });
}

function updateReactionDisplay(counts) {
    const reactionButtons = document.querySelectorAll('.reaction-emoji');
    reactionButtons.forEach(btn => {
        const emoji = btn.getAttribute('data-emoji');
        const countSpan = btn.querySelector('.reaction-count');
        if (countSpan && counts[emoji] !== undefined) {
            countSpan.textContent = counts[emoji];
        }
    });
}

function getEmojiName(emoji) {
    const names = { like: '👍', love: '❤️', wow: '😮', sad: '😢', angry: '😠', laugh: '😂', celebrate: '🎉' };
    return names[emoji] || emoji;
}

// ==================== GROQ API INTEGRATION (via Cloudflare Worker) ====================
async function generateQuestionsFromAI(subject, level) {
    showLoading(`AI is generating ${level} level ${subject} questions...`);
    
    const prompt = `Generate ${CONFIG.QUESTIONS_PER_QUIZ} multiple choice questions about ${subject} at ${level} difficulty level. 
    For each question, provide:
    1. The question text
    2. 4 options (A, B, C, D)
    3. The correct answer index (0-3)
    4. A brief explanation
    5. An interesting factoid
    
    Format as JSON array.`;
    
    try {
        const response = await fetch(`${CONFIG.CLOUD_WORKER_URL}/grok/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, model: 'llama-3.1-8b-instant' })
        });
        
        const data = await response.json();
        hideLoading();
        
        if (data.questions && data.questions.length > 0) {
            return data.questions;
        } else {
            // Fallback to local questions
            return getLocalQuestions(subject, level);
        }
    } catch (error) {
        console.error('AI generation failed:', error);
        hideLoading();
        showToast('Using local question bank', 'warning');
        return getLocalQuestions(subject, level);
    }
}

async function getAIHint(question, explanation) {
    try {
        const response = await fetch(`${CONFIG.CLOUD_WORKER_URL}/grok/hint`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question, explanation })
        });
        const data = await response.json();
        return data.hint || explanation.substring(0, 100) + '...';
    } catch (error) {
        return explanation.substring(0, 100) + '...';
    }
}

// ==================== LOCAL FALLBACK QUESTIONS ====================
function getLocalQuestions(subject, level) {
    const localDB = {
        chemistry: {
            easy: [
                { question: "Which of the following is a physical change?", options: ["Burning wood", "Melting ice", "Cooking an egg", "Rusting iron"], answer: 1, explanation: "Melting ice only changes state, not chemical composition.", factoid: "Physical changes are usually reversible." },
                { question: "What is the chemical symbol for Gold?", options: ["Go", "Gd", "Au", "Ag"], answer: 2, explanation: "Au comes from Latin 'aurum'.", factoid: "Gold is one of the least reactive metals." }
            ],
            average: [
                { question: "What type of bond involves sharing of electrons?", options: ["Ionic", "Covalent", "Metallic", "Hydrogen"], answer: 1, explanation: "Covalent bonds share electron pairs.", factoid: "Water molecules use polar covalent bonds." }
            ],
            hard: [
                { question: "What is the pH of a 0.001 M HCl solution?", options: ["1", "2", "3", "4"], answer: 2, explanation: "pH = -log[H+] = -log(0.001) = 3", factoid: "Strong acids completely dissociate in water." }
            ]
        },
        biology: {
            easy: [
                { question: "Which organ pumps blood throughout the body?", options: ["Brain", "Liver", "Heart", "Lungs"], answer: 2, explanation: "The heart is a muscular pump.", factoid: "Heart beats about 100,000 times daily." }
            ],
            average: [
                { question: "What is the function of mitochondria?", options: ["Protein synthesis", "Energy production", "Waste removal", "Cell division"], answer: 1, explanation: "Mitochondria are the powerhouses of the cell.", factoid: "Mitochondria have their own DNA." }
            ],
            hard: [
                { question: "Which cells produce antibodies?", options: ["T cells", "B cells", "Red blood cells", "Platelets"], answer: 1, explanation: "B lymphocytes produce antibodies.", factoid: "Each B cell makes one specific antibody type." }
            ]
        },
        physics: {
            easy: [
                { question: "What is the SI unit of force?", options: ["Joule", "Watt", "Newton", "Pascal"], answer: 2, explanation: "Newton (N) measures force.", factoid: "1N ≈ weight of a small apple." }
            ],
            average: [
                { question: "Which law explains rocket propulsion?", options: ["First law", "Second law", "Third law", "Gravity"], answer: 2, explanation: "Action-reaction principle.", factoid: "Spacecraft use gravity slingshots." }
            ],
            hard: [
                { question: "What is the speed of light in vacuum?", options: ["3×10⁶ m/s", "3×10⁷ m/s", "3×10⁸ m/s", "3×10⁹ m/s"], answer: 2, explanation: "Light speed is constant at ~300,000 km/s.", factoid: "Nothing can travel faster than light." }
            ]
        }
    };
    
    let questions = localDB[subject]?.[level] || localDB.chemistry.easy;
    // Duplicate to reach required count
    while (questions.length < CONFIG.QUESTIONS_PER_QUIZ) {
        questions = [...questions, ...questions];
    }
    return questions.slice(0, CONFIG.QUESTIONS_PER_QUIZ);
}

// ==================== QUIZ CORE FUNCTIONS ====================
async function startQuiz(subject, level) {
    currentState = {
        subject, level,
        questions: [],
        currentQuestion: 0,
        score: 0,
        userAnswers: [],
        powerups: { hint: 3, fifty: 3, skip: 3 },
        timer: null,
        timeLeft: CONFIG.DEFAULT_TIMER,
        quizId: `${subject}_${level}_${Date.now()}`,
        sessionId: localStorage.getItem('sessionId') || `session_${Date.now()}`
    };
    
    localStorage.setItem('sessionId', currentState.sessionId);
    
    // Track usage
    await incrementUsage(`quiz_${subject}`);
    await getUsageCount(`quiz_${subject}`);
    await getReactions(`quiz_${subject}`);
    
    // Generate questions
    const questions = await generateQuestionsFromAI(subject, level);
    currentState.questions = questions;
    
    // Hide subjects, show quiz
    document.getElementById('subjectsContainer').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';
    document.getElementById('resultsContainer').style.display = 'none';
    
    document.getElementById('quizSubject').textContent = subject.charAt(0).toUpperCase() + subject.slice(1);
    document.getElementById('quizLevel').textContent = level.charAt(0).toUpperCase() + level.slice(1);
    document.getElementById('totalQuestions').textContent = currentState.questions.length;
    
    loadQuestion();
}

function loadQuestion() {
    if (currentState.timer) clearInterval(currentState.timer);
    currentState.timeLeft = CONFIG.DEFAULT_TIMER;
    updateTimerDisplay();
    currentState.timer = setInterval(() => {
        currentState.timeLeft--;
        updateTimerDisplay();
        if (currentState.timeLeft <= 0) {
            clearInterval(currentState.timer);
            handleTimeout();
        }
    }, 1000);
    
    const question = currentState.questions[currentState.currentQuestion];
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('currentQuestionNum').textContent = currentState.currentQuestion + 1;
    document.getElementById('progressFill').style.width = `${((currentState.currentQuestion + 1) / currentState.questions.length) * 100}%`;
    
    const optionsContainer = document.getElementById('optionsList');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
        optionDiv.onclick = () => selectAnswer(index);
        optionsContainer.appendChild(optionDiv);
    });
    
    document.getElementById('explanationBox').style.display = 'none';
    document.getElementById('nextBtn').disabled = true;
    updatePowerupsDisplay();
}

function selectAnswer(selectedIndex) {
    if (currentState.userAnswers[currentState.currentQuestion]) return;
    
    const question = currentState.questions[currentState.currentQuestion];
    const isCorrect = (selectedIndex === question.answer);
    
    if (isCorrect) {
        currentState.score++;
        showToast('✅ Correct!', 'success');
    } else {
        showToast(`❌ Incorrect. Correct answer: ${String.fromCharCode(65 + question.answer)}`, 'error');
    }
    
    currentState.userAnswers[currentState.currentQuestion] = {
        selected: selectedIndex,
        correct: isCorrect,
        correctAnswer: question.answer
    };
    
    // Highlight correct/incorrect
    const options = document.querySelectorAll('.option');
    options.forEach((opt, idx) => {
        if (idx === question.answer) {
            opt.classList.add('correct');
        } else if (idx === selectedIndex && !isCorrect) {
            opt.classList.add('incorrect');
        }
        opt.style.pointerEvents = 'none';
    });
    
    // Show explanation
    document.getElementById('explanationText').textContent = question.explanation;
    document.getElementById('factoidText').textContent = question.factoid;
    document.getElementById('explanationBox').style.display = 'block';
    
    document.getElementById('nextBtn').disabled = false;
    if (currentState.timer) clearInterval(currentState.timer);
}

function handleTimeout() {
    const question = currentState.questions[currentState.currentQuestion];
    currentState.userAnswers[currentState.currentQuestion] = {
        selected: -1,
        correct: false,
        correctAnswer: question.answer
    };
    
    showToast(`⏰ Time's up! Answer: ${String.fromCharCode(65 + question.answer)}`, 'warning');
    
    const options = document.querySelectorAll('.option');
    options.forEach((opt, idx) => {
        if (idx === question.answer) opt.classList.add('correct');
        opt.style.pointerEvents = 'none';
    });
    
    document.getElementById('explanationText').textContent = question.explanation;
    document.getElementById('factoidText').textContent = question.factoid;
    document.getElementById('explanationBox').style.display = 'block';
    document.getElementById('nextBtn').disabled = false;
}

function nextQuestion() {
    if (currentState.currentQuestion + 1 < currentState.questions.length) {
        currentState.currentQuestion++;
        loadQuestion();
    } else {
        endQuiz();
    }
}

async function endQuiz() {
    if (currentState.timer) clearInterval(currentState.timer);
    
    const percentage = Math.round((currentState.score / currentState.questions.length) * 100);
    document.getElementById('finalScoreValue').textContent = `${percentage}%`;
    
    let badge = 'Science Explorer';
    if (percentage >= 90) badge = 'Science Genius 🧠';
    else if (percentage >= 75) badge = 'Science Master 🎓';
    else if (percentage >= 50) badge = 'Science Learner 📚';
    document.getElementById('badgeEarned').textContent = badge;
    
    document.getElementById('quizContainer').style.display = 'none';
    document.getElementById('resultsContainer').style.display = 'block';
    
    // Load reactions for this quiz
    await getReactions(`quiz_${currentState.subject}`);
}

function usePowerup(type) {
    if (currentState.powerups[type] <= 0) {
        showToast(`No ${type} powerups left!`, 'warning');
        return;
    }
    
    if (currentState.userAnswers[currentState.currentQuestion]) {
        showToast('Already answered this question!', 'warning');
        return;
    }
    
    currentState.powerups[type]--;
    updatePowerupsDisplay();
    
    const question = currentState.questions[currentState.currentQuestion];
    
    switch(type) {
        case 'hint':
            getAIHint(question.question, question.explanation).then(hint => {
                showToast(`💡 Hint: ${hint}`, 'info');
            });
            break;
        case 'fifty':
            const wrongOptions = [];
            for (let i = 0; i < question.options.length; i++) {
                if (i !== question.answer) wrongOptions.push(i);
            }
            const toRemove = wrongOptions.slice(0, 2);
            const options = document.querySelectorAll('.option');
            options.forEach((opt, idx) => {
                if (toRemove.includes(idx)) {
                    opt.style.opacity = '0.4';
                    opt.style.pointerEvents = 'none';
                }
            });
            showToast('50/50 used! Two options eliminated.', 'success');
            break;
        case 'skip':
            showToast('Question skipped!', 'info');
            nextQuestion();
            break;
    }
}

function updatePowerupsDisplay() {
    document.querySelectorAll('.powerup-btn').forEach(btn => {
        const type = btn.getAttribute('data-powerup');
        const countSpan = btn.querySelector('.powerup-count');
        if (countSpan && currentState.powerups[type] !== undefined) {
            countSpan.textContent = currentState.powerups[type];
            if (currentState.powerups[type] === 0) btn.disabled = true;
        }
    });
}

function updateTimerDisplay() {
    const timerEl = document.getElementById('timerDisplay');
    if (timerEl) timerEl.textContent = currentState.timeLeft;
    if (currentState.timeLeft <= 10) {
        timerEl.style.color = '#ef4444';
        timerEl.style.animation = 'pulse 0.5s infinite';
    } else {
        timerEl.style.color = '';
        timerEl.style.animation = '';
    }
}

// ==================== REACTIONS & SHARING ====================
function setupReactions() {
    const reactionBtns = document.querySelectorAll('.reaction-emoji');
    reactionBtns.forEach(btn => {
        btn.removeEventListener('click', handleReactionClick);
        btn.addEventListener('click', handleReactionClick);
    });
}

async function handleReactionClick(e) {
    const btn = e.currentTarget;
    const emoji = btn.getAttribute('data-emoji');
    const reactionKey = `${currentState.subject}_${currentState.level}_${emoji}`;
    
    if (userReactions.has(reactionKey)) {
        showToast('You already reacted with this emoji!', 'warning');
        return;
    }
    
    userReactions.add(reactionKey);
    await addReaction(`quiz_${currentState.subject}_${currentState.level}`, emoji);
}

function setupSocialShares() {
    const shareBtns = document.querySelectorAll('.social-icon');
    shareBtns.forEach(btn => {
        btn.onclick = () => shareQuiz(btn.getAttribute('data-platform'));
    });
    
    document.getElementById('copyUrlBtn').onclick = copyQuizUrl;
}

function shareQuiz(platform) {
    const url = window.location.href;
    const text = `I scored ${document.getElementById('finalScoreValue').textContent} on the ${currentState.subject} quiz! Try it yourself!`;
    
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
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=Science Quiz Challenge&body=${encodeURIComponent(text + '\n\n' + url)}`;
            break;
    }
    
    if (shareUrl) window.open(shareUrl, '_blank');
    trackShare(`quiz_${currentState.subject}`, platform);
    showToast(`Shared on ${platform}!`);
}

function copyQuizUrl() {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link copied to clipboard!');
    trackShare(`quiz_${currentState.subject}`, 'copy');
}

// ==================== UI THEMES & SCROLL ====================
function setupTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        document.querySelector('#themeToggle i').className = 'fas fa-sun';
    }
    
    document.getElementById('themeToggle').onclick = () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            document.querySelector('#themeToggle i').className = 'fas fa-moon';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            document.querySelector('#themeToggle i').className = 'fas fa-sun';
        }
    };
}

function setupScrollButtons() {
    const scrollUp = document.getElementById('scrollUpBtn');
    const scrollDown = document.getElementById('scrollDownBtn');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            scrollUp.style.display = 'flex';
        } else {
            scrollUp.style.display = 'none';
        }
    });
    
    scrollUp.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    scrollDown.onclick = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Subject cards with level buttons
    document.querySelectorAll('.subject-card').forEach(card => {
        const levelBtns = card.querySelectorAll('.level-btn');
        levelBtns.forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const subject = card.getAttribute('data-subject');
                const level = btn.getAttribute('data-level');
                startQuiz(subject, level);
            };
        });
    });
    
    // Powerups
    document.getElementById('hintBtn').onclick = () => usePowerup('hint');
    document.getElementById('fiftyBtn').onclick = () => usePowerup('fifty');
    document.getElementById('skipBtn').onclick = () => usePowerup('skip');
    
    // Next button
    document.getElementById('nextBtn').onclick = nextQuestion;
    
    // Try again button
    document.getElementById('tryAgainBtn').onclick = () => {
        document.getElementById('resultsContainer').style.display = 'none';
        document.getElementById('subjectsContainer').style.display = 'grid';
    };
    
    // Stats button
    document.getElementById('statsBtn').onclick = () => {
        showToast(`Total plays: ${toolUsageCount.toLocaleString()}`, 'info');
    };
}

// ==================== INITIALIZATION ====================
async function init() {
    console.log(`${CONFIG.APP_NAME} v${CONFIG.VERSION} initialized`);
    
    setupTheme();
    setupScrollButtons();
    setupReactions();
    setupSocialShares();
    setupEventListeners();
    
    // Load initial stats
    await getUsageCount('quiz_total');
    
    showToast('Welcome to Advanced Science Quiz! 🧪', 'success');
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
