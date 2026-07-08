// ==================== CONFIGURATION ====================
const CONFIG = {
    APP_NAME: 'Advanced Science Quiz',
    VERSION: '4.0.0',
    API_BASE: 'https://magicrills-api.uzairhameed01.workers.dev',
    API_KEY: 'magicrills-grok-api.uzairhameed01.workers.dev',
    GROQ_API_ENDPOINT: 'https://api.groq.com/openai/v1/chat/completions',
    DEFAULT_TIMER: 60,
    QUESTIONS_PER_QUIZ: 20,
    TOOL_SLUG: 'advanced-science-quiz',
    TOOL_NAME: 'Advanced Science Quiz Challenge',
    CATEGORY: 'Quiz-Games'
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
let toolStats = {
    usage: 0,
    views: 0,
    shares: 0,
    reactions: {}
};

// ==================== UTILITY FUNCTIONS ====================
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
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

function getUserId() {
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        localStorage.setItem('userId', userId);
    }
    return userId;
}

function getSessionId() {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = `session_${Date.now()}`;
        localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
}

// ==================== CLOUDFLARE API INTEGRATION ====================
async function apiCall(endpoint, method = 'POST', data = null) {
    const url = `${CONFIG.API_BASE}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        'X-API-Key': CONFIG.API_KEY
    };

    try {
        const response = await fetch(url, {
            method,
            headers,
            body: data ? JSON.stringify(data) : null
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error (${response.status}): ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        return null;
    }
}

// ==================== USAGE COUNTER ====================
async function incrementUsage() {
    try {
        const result = await apiCall('/api/usage', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            tool_name: CONFIG.TOOL_NAME,
            category: CONFIG.CATEGORY,
            user_id: getUserId()
        });

        if (result && result.success) {
            toolStats.usage = result.count || 0;
            updateUsageDisplay(toolStats.usage);
            updateHeroStats();
            return result;
        }
    } catch (error) {
        console.error('Usage increment failed:', error);
    }

    // Fallback: LocalStorage
    let localCount = parseInt(localStorage.getItem(`${CONFIG.TOOL_SLUG}_usage`) || '0');
    localCount++;
    localStorage.setItem(`${CONFIG.TOOL_SLUG}_usage`, localCount.toString());
    toolStats.usage = localCount;
    updateUsageDisplay(localCount);
    updateHeroStats();
    return { success: true, count: localCount };
}

async function getUsageCount() {
    try {
        const result = await apiCall(`/api/stats?tool_slug=${CONFIG.TOOL_SLUG}`, 'GET');
        if (result && result.success) {
            toolStats.usage = result.usage || 0;
            toolStats.views = result.views || 0;
            toolStats.shares = result.shares || 0;
            toolStats.reactions = result.reactions || {};
            updateUsageDisplay(toolStats.usage);
            updateHeroStats();
            updateReactionDisplay(toolStats.reactions);
            return result;
        }
    } catch (error) {
        console.error('Get stats failed:', error);
    }

    // Fallback: LocalStorage
    toolStats.usage = parseInt(localStorage.getItem(`${CONFIG.TOOL_SLUG}_usage`) || '0');
    toolStats.views = parseInt(localStorage.getItem(`${CONFIG.TOOL_SLUG}_views`) || '0');
    toolStats.shares = parseInt(localStorage.getItem(`${CONFIG.TOOL_SLUG}_shares`) || '0');
    const reactionsStr = localStorage.getItem(`${CONFIG.TOOL_SLUG}_reactions`);
    toolStats.reactions = reactionsStr ? JSON.parse(reactionsStr) : {};
    updateUsageDisplay(toolStats.usage);
    updateHeroStats();
    updateReactionDisplay(toolStats.reactions);
}

function updateUsageDisplay(count) {
    const elements = document.querySelectorAll('.usage-count');
    elements.forEach(el => {
        if (el) el.textContent = count.toLocaleString();
    });
    const badge = document.getElementById('globalUsageCount');
    if (badge) badge.textContent = count.toLocaleString();
}

function updateHeroStats() {
    const usageEl = document.getElementById('heroUsage');
    const sharesEl = document.getElementById('heroShares');
    const reactionsEl = document.getElementById('heroReactions');

    if (usageEl) usageEl.textContent = toolStats.usage.toLocaleString();
    if (sharesEl) sharesEl.textContent = toolStats.shares.toLocaleString();
    
    const totalReactions = Object.values(toolStats.reactions).reduce((a, b) => a + b, 0);
    if (reactionsEl) reactionsEl.textContent = totalReactions.toLocaleString();
}

// ==================== REACTIONS ====================
async function addReaction(emoji) {
    const userId = getUserId();
    const reactionKey = `${CONFIG.TOOL_SLUG}_${emoji}`;

    if (userReactions.has(reactionKey)) {
        showToast(`You already reacted with ${emoji}!`, 'warning');
        return;
    }

    try {
        const result = await apiCall('/api/reactions', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            emoji: emoji,
            user_id: userId
        });

        if (result && result.success) {
            userReactions.add(reactionKey);
            toolStats.reactions = result.counts || {};
            updateReactionDisplay(toolStats.reactions);
            updateHeroStats();
            showToast(`${getEmojiName(emoji)} reaction added!`, 'success');
            return result;
        }
    } catch (error) {
        console.error('Add reaction failed:', error);
    }

    // Fallback: LocalStorage
    let reactions = JSON.parse(localStorage.getItem(`${CONFIG.TOOL_SLUG}_reactions`) || '{}');
    reactions[emoji] = (reactions[emoji] || 0) + 1;
    localStorage.setItem(`${CONFIG.TOOL_SLUG}_reactions`, JSON.stringify(reactions));
    userReactions.add(reactionKey);
    toolStats.reactions = reactions;
    updateReactionDisplay(reactions);
    updateHeroStats();
    showToast(`${getEmojiName(emoji)} reaction added (local)!`, 'success');
}

async function getReactions() {
    try {
        const result = await apiCall(`/api/stats?tool_slug=${CONFIG.TOOL_SLUG}`, 'GET');
        if (result && result.success) {
            toolStats.reactions = result.reactions || {};
            updateReactionDisplay(toolStats.reactions);
            updateHeroStats();
            return result;
        }
    } catch (error) {
        console.error('Get reactions failed:', error);
    }

    // Fallback: LocalStorage
    const reactionsStr = localStorage.getItem(`${CONFIG.TOOL_SLUG}_reactions`);
    toolStats.reactions = reactionsStr ? JSON.parse(reactionsStr) : {};
    updateReactionDisplay(toolStats.reactions);
    updateHeroStats();
}

function updateReactionDisplay(counts) {
    const buttons = document.querySelectorAll('.reaction-emoji');
    buttons.forEach(btn => {
        const emoji = btn.getAttribute('data-emoji');
        const countSpan = btn.querySelector('.reaction-count');
        if (countSpan && counts && counts[emoji] !== undefined) {
            countSpan.textContent = counts[emoji];
        }
    });
}

function getEmojiName(emoji) {
    const names = { like: '👍', love: '❤️', wow: '😮', sad: '😢', laugh: '😂', celebrate: '🎉' };
    return names[emoji] || emoji;
}

// ==================== SHARES ====================
async function trackShare(platform) {
    try {
        const result = await apiCall('/api/shares', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            platform: platform,
            user_id: getUserId()
        });

        if (result && result.success) {
            toolStats.shares = result.count || 0;
            updateHeroStats();
            return result;
        }
    } catch (error) {
        console.error('Track share failed:', error);
    }

    // Fallback: LocalStorage
    let shares = parseInt(localStorage.getItem(`${CONFIG.TOOL_SLUG}_shares`) || '0');
    shares++;
    localStorage.setItem(`${CONFIG.TOOL_SLUG}_shares`, shares.toString());
    toolStats.shares = shares;
    updateHeroStats();
}

// ==================== GROQ API INTEGRATION ====================
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
        // Try Cloudflare Worker first
        const response = await fetch(`${CONFIG.API_BASE}/api/grok/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': CONFIG.API_KEY
            },
            body: JSON.stringify({ prompt, model: 'llama-3.1-8b-instant' })
        });

        if (response.ok) {
            const data = await response.json();
            hideLoading();
            if (data.questions && data.questions.length > 0) {
                return data.questions;
            }
        }
    } catch (error) {
        console.error('AI generation via worker failed:', error);
    }

    // Fallback: Local questions
    hideLoading();
    showToast('Using local question bank', 'warning');
    return getLocalQuestions(subject, level);
}

// ==================== LOCAL FALLBACK QUESTIONS ====================
function getLocalQuestions(subject, level) {
    const localDB = {
        chemistry: {
            easy: [
                { question: "Which of the following is a physical change?", options: ["Burning wood", "Melting ice", "Cooking an egg", "Rusting iron"], answer: 1, explanation: "Melting ice only changes state, not chemical composition.", factoid: "Physical changes are usually reversible." },
                { question: "What is the chemical symbol for Gold?", options: ["Go", "Gd", "Au", "Ag"], answer: 2, explanation: "Au comes from Latin 'aurum'.", factoid: "Gold is one of the least reactive metals." },
                { question: "What is H2O?", options: ["Salt", "Water", "Sugar", "Alcohol"], answer: 1, explanation: "H2O is the chemical formula for water.", factoid: "Water covers about 71% of Earth's surface." },
                { question: "Which element is essential for respiration?", options: ["Nitrogen", "Carbon", "Oxygen", "Hydrogen"], answer: 2, explanation: "Oxygen is required for cellular respiration.", factoid: "Oxygen makes up about 21% of Earth's atmosphere." }
            ],
            average: [
                { question: "What type of bond involves sharing of electrons?", options: ["Ionic", "Covalent", "Metallic", "Hydrogen"], answer: 1, explanation: "Covalent bonds share electron pairs.", factoid: "Water molecules use polar covalent bonds." },
                { question: "What is the pH of pure water?", options: ["5", "6", "7", "8"], answer: 2, explanation: "Pure water has a neutral pH of 7.", factoid: "pH scale ranges from 0 to 14." }
            ],
            hard: [
                { question: "What is the pH of a 0.001 M HCl solution?", options: ["1", "2", "3", "4"], answer: 2, explanation: "pH = -log[H+] = -log(0.001) = 3", factoid: "Strong acids completely dissociate in water." }
            ]
        },
        biology: {
            easy: [
                { question: "Which organ pumps blood throughout the body?", options: ["Brain", "Liver", "Heart", "Lungs"], answer: 2, explanation: "The heart is a muscular pump.", factoid: "Heart beats about 100,000 times daily." },
                { question: "What is the basic unit of life?", options: ["Atom", "Molecule", "Cell", "Organ"], answer: 2, explanation: "Cells are the basic unit of life.", factoid: "The human body has over 37 trillion cells." }
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
        sessionId: getSessionId()
    };

    // Track usage
    await incrementUsage();
    await getReactions();

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

    const options = document.querySelectorAll('.option');
    options.forEach((opt, idx) => {
        if (idx === question.answer) {
            opt.classList.add('correct');
        } else if (idx === selectedIndex && !isCorrect) {
            opt.classList.add('incorrect');
        }
        opt.style.pointerEvents = 'none';
    });

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

    let badge = 'Science Explorer 🧪';
    if (percentage >= 90) badge = 'Science Genius 🧠';
    else if (percentage >= 75) badge = 'Science Master 🎓';
    else if (percentage >= 50) badge = 'Science Learner 📚';
    document.getElementById('badgeEarned').textContent = badge;

    document.getElementById('quizContainer').style.display = 'none';
    document.getElementById('resultsContainer').style.display = 'block';

    // Load reactions for this quiz
    await getReactions();
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
            showToast(`💡 Hint: ${question.explanation.substring(0, 80)}...`, 'info');
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
                    opt.style.opacity = '0.3';
                    opt.style.pointerEvents = 'none';
                    opt.style.textDecoration = 'line-through';
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
    await addReaction(emoji);
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
    const text = `I scored ${document.getElementById('finalScoreValue').textContent} on the ${currentState.subject} quiz! Try it yourself! 🧪`;

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
    trackShare(platform);
    showToast(`Shared on ${platform}!`, 'success');
}

function copyQuizUrl() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Link copied to clipboard!', 'success');
        trackShare('copy');
    }).catch(() => {
        showToast('Failed to copy link', 'error');
    });
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

// ==================== HERO CANVAS ANIMATION ====================
function setupHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    const ctx = canvas.getContext('2d');
    const size = 280;
    let particles = [];

    const colors = ['#667eea', '#764ba2', '#38ef7d', '#f5576c', '#f59e0b', '#3b82f6'];

    class Particle {
        constructor() {
            this.x = Math.random() * size;
            this.y = Math.random() * size;
            this.radius = Math.random() * 4 + 2;
            this.dx = (Math.random() - 0.5) * 2;
            this.dy = (Math.random() - 0.5) * 2;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 20;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        update() {
            this.x += this.dx;
            this.y += this.dy;

            if (this.x < 0 || this.x > size) this.dx *= -1;
            if (this.y < 0 || this.y > size) this.dy *= -1;
        }
    }

    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, size, size);
        ctx.fillStyle = 'rgba(10, 10, 26, 0.5)';
        ctx.fillRect(0, 0, size, size);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 80) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(102, 126, 234, ${1 - dist / 80})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

// ==================== TYPEWRITER ANIMATION ====================
function setupTypewriter() {
    const phrases = [
        '🧪 Test your Chemistry knowledge',
        '🧬 Explore Biology concepts',
        '⚡ Master Physics principles',
        '🎯 AI-generated questions',
        '📊 Track your progress',
        '🏆 Earn badges & rewards'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const element = document.getElementById('typewriter-text');

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
        currentState = {
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
        userReactions = new Set();
    };

    // Stats button
    document.getElementById('statsBtn').onclick = () => {
        const totalReactions = Object.values(toolStats.reactions).reduce((a, b) => a + b, 0);
        showToast(
            `📊 Usage: ${toolStats.usage.toLocaleString()} | Shares: ${toolStats.shares.toLocaleString()} | Reactions: ${totalReactions.toLocaleString()}`,
            'info'
        );
    };
}

// ==================== INITIALIZATION ====================
async function init() {
    console.log(`${CONFIG.APP_NAME} v${CONFIG.VERSION} initialized`);
    console.log(`Tool Slug: ${CONFIG.TOOL_SLUG}`);
    console.log(`API Base: ${CONFIG.API_BASE}`);

    setupTheme();
    setupScrollButtons();
    setupReactions();
    setupSocialShares();
    setupEventListeners();
    setupHeroCanvas();
    setupTypewriter();

    // Load initial stats
    await getUsageCount();

    showToast('Welcome to Advanced Science Quiz! 🧪', 'success');
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
