// ==================== CONFIGURATION ====================
const CONFIG = {
    APP_NAME: 'Math Quiz Challenge',
    VERSION: '5.1.0',
    API_BASE: 'https://magicrills-api.uzairhameed01.workers.dev',
    TOOL_SLUG: 'math-quiz-challenge',
    CATEGORY: 'Quiz-Games',
    QUESTIONS_PER_QUIZ: 35,
    REACTIONS: ['like', 'love', 'wow', 'sad', 'laugh', 'celebrate'],
    REACTION_ICONS: {
        like: '👍', love: '❤️', wow: '😮', sad: '😢', laugh: '😂', celebrate: '🎉'
    }
};

// ==================== TIME & POINTS PER LEVEL ====================
const TIME_LIMITS = { easy: 60, medium: 50, hard: 40 };
const LEVEL_NAMES = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };

// ==================== GLOBAL STATE ====================
let currentState = {
    mode: 'classic',
    level: 'easy',
    questions: [],
    currentQuestion: 0,
    score: 0,
    lives: 3,
    userAnswers: [],
    powerups: { fifty: 3, time: 3, hint: 3, skip: 3 },
    timer: null,
    timeLeft: 60,
    streak: 0,
    weakAreas: {},
    sessionId: null,
    aiGenerated: false,
    timeAttackCount: 0,
    timeAttackScore: 0
};

let userReactions = new Set();
let toolUsageCount = 0;
let progressChart = null;
let whiteboardExpression = '';
let whiteboardResult = '0';
let statsData = { usage: 0, reactions: {}, shares: 0 };

// ==================== CLOUDFLARE API ====================
async function callAPI(endpoint, method = 'GET', body = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-Tool-Slug': CONFIG.TOOL_SLUG
            }
        };
        if (body) options.body = JSON.stringify(body);
        
        const response = await fetch(`${CONFIG.API_BASE}${endpoint}`, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

// ==================== API: INCREMENT USAGE ====================
async function incrementUsage() {
    try {
        const result = await callAPI('/api/usage', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            category: CONFIG.CATEGORY
        });
        if (result && result.success) {
            toolUsageCount = result.usage || 0;
            updateUsageDisplay(toolUsageCount);
            updateHeroStats(toolUsageCount);
            return result;
        }
    } catch (e) {
        console.error('Usage increment failed:', e);
    }
    
    // Fallback: LocalStorage
    let localCount = parseInt(localStorage.getItem('mathQuizUsage') || '0');
    localCount++;
    localStorage.setItem('mathQuizUsage', localCount.toString());
    toolUsageCount = localCount;
    updateUsageDisplay(localCount);
    updateHeroStats(localCount);
}

// ==================== API: GET STATS ====================
async function fetchToolStats() {
    try {
        const result = await callAPI(`/api/stats?tool_slug=${CONFIG.TOOL_SLUG}`);
        if (result && result.success) {
            statsData = result.data || statsData;
            updateStatsDisplay();
            return result;
        }
    } catch (e) {
        console.error('Fetch stats failed:', e);
    }
    
    // Fallback: LocalStorage
    statsData.usage = parseInt(localStorage.getItem('mathQuizUsage') || '0');
    statsData.reactions = JSON.parse(localStorage.getItem('mathQuizReactions') || '{}');
    statsData.shares = parseInt(localStorage.getItem('mathQuizShares') || '0');
    updateStatsDisplay();
}

// ==================== API: REACTIONS ====================
async function addReaction(emoji, isMainPage = true) {
    try {
        const result = await callAPI('/api/reactions', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            emoji: emoji
        });
        if (result && result.success) {
            statsData.reactions = result.reactions || {};
            updateStatsDisplay();
            updateReactionButtons();
            showToast(`${CONFIG.REACTION_ICONS[emoji] || emoji} reaction added!`, 'success');
            return;
        }
    } catch (e) {
        console.error('Reaction failed:', e);
    }
    
    // Fallback: LocalStorage
    const reactions = JSON.parse(localStorage.getItem('mathQuizReactions') || '{}');
    reactions[emoji] = (reactions[emoji] || 0) + 1;
    localStorage.setItem('mathQuizReactions', JSON.stringify(reactions));
    statsData.reactions = reactions;
    updateStatsDisplay();
    updateReactionButtons();
    showToast(`${CONFIG.REACTION_ICONS[emoji] || emoji} reaction added!`, 'success');
}

// ==================== API: SHARES ====================
async function recordShare(platform) {
    try {
        const result = await callAPI('/api/shares', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            platform: platform
        });
        if (result && result.success) {
            statsData.shares = result.shares || 0;
            updateStatsDisplay();
            return;
        }
    } catch (e) {
        console.error('Share record failed:', e);
    }
    
    // Fallback: LocalStorage
    let shares = parseInt(localStorage.getItem('mathQuizShares') || '0');
    shares++;
    localStorage.setItem('mathQuizShares', shares.toString());
    statsData.shares = shares;
    updateStatsDisplay();
}

// ==================== UPDATE UI ====================
function updateUsageDisplay(count) {
    document.querySelectorAll('.stats-badge, #globalUsageCount').forEach(el => {
        if (el) el.textContent = count.toLocaleString();
    });
    document.getElementById('totalPlaysCount').textContent = count.toLocaleString();
}

function updateHeroStats(usage) {
    document.getElementById('heroTotalPlayed').textContent = usage.toLocaleString();
}

function updateStatsDisplay() {
    // Usage
    if (statsData.usage) {
        document.getElementById('totalPlaysCount').textContent = statsData.usage.toLocaleString();
        document.getElementById('globalUsageCount').textContent = statsData.usage.toLocaleString();
    }
    
    // Shares
    if (statsData.shares) {
        // Update share count if displayed
    }
    
    // Reactions
    updateReactionButtons();
}

function updateReactionButtons() {
    const reactions = statsData.reactions || {};
    document.querySelectorAll('.reaction-mini-btn').forEach(btn => {
        const emoji = btn.getAttribute('data-emoji');
        const countSpan = btn.querySelector('.count');
        if (countSpan && reactions[emoji] !== undefined) {
            countSpan.textContent = reactions[emoji];
        }
    });
}

// ==================== MATH QUESTION GENERATOR ====================
const questionTypes = {
    easy: ['addition', 'subtraction', 'multiplication', 'division', 'square', 'squareRoot'],
    medium: ['addition', 'subtraction', 'multiplication', 'division', 'square', 'squareRoot', 'lcm', 'hcf'],
    hard: ['addition', 'subtraction', 'multiplication', 'division', 'square', 'squareRoot', 'lcm', 'hcf', 'percentage', 'fraction', 'algebra']
};

function generateMathQuestion(level, type = null) {
    const types = questionTypes[level];
    const selectedType = type || types[Math.floor(Math.random() * types.length)];
    
    let question = {}, answer = 0, explanation = '', factoid = '';
    
    switch(selectedType) {
        case 'addition':
            let a1 = level === 'easy' ? Math.floor(Math.random() * 50) + 1 : level === 'medium' ? Math.floor(Math.random() * 200) + 50 : Math.floor(Math.random() * 500) + 100;
            let b1 = level === 'easy' ? Math.floor(Math.random() * 50) + 1 : level === 'medium' ? Math.floor(Math.random() * 200) + 50 : Math.floor(Math.random() * 500) + 100;
            question = { text: `${a1} + ${b1} = ?`, type: 'addition' };
            answer = a1 + b1;
            explanation = `Add ${a1} and ${b1}: ${a1} + ${b1} = ${answer}`;
            factoid = `Addition is one of the four basic operations of arithmetic.`;
            break;
        case 'subtraction':
            let a2 = level === 'easy' ? Math.floor(Math.random() * 100) + 20 : level === 'medium' ? Math.floor(Math.random() * 500) + 100 : Math.floor(Math.random() * 1000) + 200;
            let b2 = level === 'easy' ? Math.floor(Math.random() * 20) + 1 : level === 'medium' ? Math.floor(Math.random() * 200) + 50 : Math.floor(Math.random() * 500) + 100;
            if (b2 > a2) [a2, b2] = [b2, a2];
            question = { text: `${a2} - ${b2} = ?`, type: 'subtraction' };
            answer = a2 - b2;
            explanation = `Subtract ${b2} from ${a2}: ${a2} - ${b2} = ${answer}`;
            factoid = `Subtraction is the opposite of addition.`;
            break;
        case 'multiplication':
            let a3 = level === 'easy' ? Math.floor(Math.random() * 10) + 1 : level === 'medium' ? Math.floor(Math.random() * 20) + 5 : Math.floor(Math.random() * 50) + 10;
            let b3 = level === 'easy' ? Math.floor(Math.random() * 10) + 1 : level === 'medium' ? Math.floor(Math.random() * 15) + 5 : Math.floor(Math.random() * 30) + 10;
            question = { text: `${a3} × ${b3} = ?`, type: 'multiplication' };
            answer = a3 * b3;
            explanation = `Multiply ${a3} by ${b3}: ${a3} × ${b3} = ${answer}`;
            factoid = `Multiplication is repeated addition.`;
            break;
        case 'division':
            let a4 = level === 'easy' ? Math.floor(Math.random() * 50) + 10 : level === 'medium' ? Math.floor(Math.random() * 200) + 50 : Math.floor(Math.random() * 500) + 100;
            let b4 = level === 'easy' ? Math.floor(Math.random() * 10) + 1 : level === 'medium' ? Math.floor(Math.random() * 20) + 2 : Math.floor(Math.random() * 30) + 5;
            a4 = a4 * b4;
            question = { text: `${a4} ÷ ${b4} = ?`, type: 'division' };
            answer = a4 / b4;
            explanation = `Divide ${a4} by ${b4}: ${a4} ÷ ${b4} = ${answer}`;
            factoid = `Division is splitting into equal parts.`;
            break;
        case 'square':
            let a5 = level === 'easy' ? Math.floor(Math.random() * 10) + 1 : level === 'medium' ? Math.floor(Math.random() * 15) + 5 : Math.floor(Math.random() * 25) + 5;
            question = { text: `${a5}² = ?`, type: 'square', isInput: true };
            answer = a5 * a5;
            explanation = `Square of ${a5} means ${a5} × ${a5} = ${answer}`;
            factoid = `A square number is the product of a number multiplied by itself.`;
            break;
        case 'squareRoot':
            let a6 = level === 'easy' ? Math.floor(Math.random() * 10) + 1 : level === 'medium' ? Math.floor(Math.random() * 15) + 5 : Math.floor(Math.random() * 20) + 5;
            let sq = a6 * a6;
            question = { text: `√${sq} = ?`, type: 'squareRoot', isInput: true };
            answer = a6;
            explanation = `The square root of ${sq} is ${answer} because ${answer} × ${answer} = ${sq}`;
            factoid = `The square root symbol (√) was first used in the 16th century.`;
            break;
        case 'lcm':
            let a7 = level === 'medium' ? Math.floor(Math.random() * 12) + 4 : Math.floor(Math.random() * 20) + 5;
            let b7 = level === 'medium' ? Math.floor(Math.random() * 12) + 4 : Math.floor(Math.random() * 20) + 5;
            question = { text: `What is the LCM of ${a7} and ${b7}?`, type: 'lcm', isInput: true };
            answer = calculateLCM(a7, b7);
            explanation = `LCM of ${a7} and ${b7} is the smallest number divisible by both: ${answer}`;
            factoid = `LCM stands for Least Common Multiple.`;
            break;
        case 'hcf':
            let a8 = level === 'medium' ? Math.floor(Math.random() * 30) + 10 : Math.floor(Math.random() * 50) + 10;
            let b8 = level === 'medium' ? Math.floor(Math.random() * 30) + 10 : Math.floor(Math.random() * 50) + 10;
            question = { text: `What is the HCF of ${a8} and ${b8}?`, type: 'hcf', isInput: true };
            answer = calculateHCF(a8, b8);
            explanation = `HCF of ${a8} and ${b8} is the largest number that divides both: ${answer}`;
            factoid = `HCF is also known as GCD (Greatest Common Divisor).`;
            break;
        case 'percentage':
            let a9 = level === 'hard' ? Math.floor(Math.random() * 200) + 50 : Math.floor(Math.random() * 100) + 10;
            let pct = [10, 15, 20, 25, 30, 50][Math.floor(Math.random() * 6)];
            question = { text: `What is ${pct}% of ${a9}?`, type: 'percentage', isInput: true };
            answer = (a9 * pct) / 100;
            explanation = `${pct}% of ${a9} = (${pct}/100) × ${a9} = ${answer}`;
            factoid = `Percent means 'per hundred'.`;
            break;
        case 'fraction':
            let num1 = Math.floor(Math.random() * 10) + 1;
            let den1 = Math.floor(Math.random() * 10) + 2;
            let num2 = Math.floor(Math.random() * 10) + 1;
            let den2 = Math.floor(Math.random() * 10) + 2;
            question = { text: `${num1}/${den1} + ${num2}/${den2} = ? (Give answer as decimal)`, type: 'fraction', isInput: true };
            answer = (num1/den1 + num2/den2).toFixed(2);
            explanation = `${num1}/${den1} + ${num2}/${den2} = ${(num1/den1).toFixed(2)} + ${(num2/den2).toFixed(2)} = ${answer}`;
            factoid = `Fractions represent parts of a whole.`;
            break;
        default:
            let a10 = Math.floor(Math.random() * 20) + 1;
            let b10 = Math.floor(Math.random() * 20) + 1;
            question = { text: `${a10} + ${b10} = ?`, type: 'addition' };
            answer = a10 + b10;
            explanation = `Add ${a10} and ${b10}: ${answer}`;
            factoid = `Math is fun!`;
    }
    
    let options = [answer];
    while (options.length < 4) {
        let offset = Math.floor(Math.random() * (Math.max(5, answer / 4))) + 1;
        let opt = typeof answer === 'number' ? answer + (Math.random() > 0.5 ? offset : -offset) : parseFloat(answer) + (Math.random() > 0.5 ? offset : -offset);
        if (typeof opt === 'number' && opt > 0 && !options.includes(opt)) options.push(opt);
    }
    options = shuffleArray(options);
    
    return {
        question: question.text,
        type: selectedType,
        isInput: question.isInput || false,
        options: options.map(String),
        answer: options.indexOf(answer),
        correctValue: answer,
        explanation: explanation,
        factoid: factoid,
        points: 10
    };
}

function calculateLCM(a, b) {
    return (a * b) / calculateHCF(a, b);
}

function calculateHCF(a, b) {
    while (b) { let temp = b; b = a % b; a = temp; }
    return a;
}

function generateQuestions(level, count) {
    const questions = [];
    const types = questionTypes[level];
    
    for (let i = 0; i < count; i++) {
        questions.push(generateMathQuestion(level));
    }
    return questions;
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ==================== AI INTEGRATION (Grok API) ====================
async function callGrokAPI(prompt) {
    try {
        const response = await fetch('https://magicrills-grok-api.uzairhameed01.workers.dev/api/grok/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                prompt: prompt,
                model: 'llama-3.1-8b-instant',
                max_tokens: 6000
            })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Grok API error:', error);
        return null;
    }
}

async function generateAIQuestions() {
    showLoading(`🤖 AI is generating ${CONFIG.QUESTIONS_PER_QUIZ} unique math questions (${LEVEL_NAMES[currentState.level]})...`);
    
    const prompt = `Generate ${CONFIG.QUESTIONS_PER_QUIZ} unique, diverse math questions for ${currentState.level} difficulty level.

Include these types of questions:
- Addition, Subtraction, Multiplication, Division
- Squares and Square Roots
- LCM and HCF (for medium/hard)
- Percentages and Fractions (for hard)

Requirements:
1. Each question must be UNIQUE - no repetition
2. Answers should be integers or simple decimals
3. Provide 4 options for multiple choice
4. Include step-by-step explanation
5. Add interesting math fact

Return JSON format:
{
  "questions": [
    {
      "question": "question text",
      "options": ["opt1", "opt2", "opt3", "opt4"],
      "answer": 0,
      "explanation": "step-by-step solution",
      "factoid": "interesting fact"
    }
  ]
}`;

    const result = await callGrokAPI(prompt);
    
    if (result && result.questions && result.questions.length >= 20) {
        hideLoading();
        currentState.aiGenerated = true;
        showToast('✨ AI generated 35 unique questions!', 'success');
        return result.questions.slice(0, CONFIG.QUESTIONS_PER_QUIZ);
    } else {
        hideLoading();
        showToast('📐 Using local question generator', 'warning');
        return generateQuestions(currentState.level, CONFIG.QUESTIONS_PER_QUIZ);
    }
}

// ==================== UTILITIES ====================
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i> ${message}`;
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

function getEmojiName(emoji) {
    return CONFIG.REACTION_ICONS[emoji] || emoji;
}

// ==================== QUIZ FUNCTIONS ====================
async function startQuiz(level, mode) {
    currentState.level = level;
    currentState.mode = mode;
    currentState.currentQuestion = 0;
    currentState.score = 0;
    currentState.lives = 3;
    currentState.userAnswers = [];
    currentState.powerups = { fifty: 3, time: 3, hint: 3, skip: 3 };
    currentState.weakAreas = {};
    currentState.timeLeft = TIME_LIMITS[level];
    currentState.timeAttackCount = 0;
    currentState.timeAttackScore = 0;
    
    if (mode === 'practice') {
        currentState.timeLeft = 999;
        document.getElementById('quizTimer').style.display = 'none';
    } else {
        document.getElementById('quizTimer').style.display = 'flex';
    }
    
    showLoading('🧮 Generating unique math questions...');
    
    const questions = await generateAIQuestions();
    currentState.questions = questions;
    
    document.getElementById('modeContainer').style.display = 'none';
    document.getElementById('levelsContainer').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';
    document.getElementById('resultsContainer').style.display = 'none';
    
    document.getElementById('quizMode').textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
    document.getElementById('quizLevel').textContent = LEVEL_NAMES[level];
    document.getElementById('totalQuestions').textContent = currentState.questions.length;
    document.getElementById('totalQuestionsCount').textContent = currentState.questions.length;
    document.getElementById('livesCount').textContent = currentState.lives;
    document.getElementById('scoreCount').textContent = currentState.score;
    
    loadQuestion();
    startTimer();
    incrementUsage();
}

function startTimer() {
    if (currentState.timer) clearInterval(currentState.timer);
    if (currentState.mode === 'practice') return;
    
    currentState.timer = setInterval(() => {
        if (currentState.timeLeft <= 0) {
            clearInterval(currentState.timer);
            if (currentState.mode === 'timeattack') {
                endQuiz();
            } else {
                handleTimeout();
            }
        } else {
            currentState.timeLeft--;
            document.getElementById('timerDisplay').textContent = currentState.timeLeft;
            if (currentState.timeLeft <= 5) {
                document.getElementById('timerDisplay').style.color = '#f87171';
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
    document.getElementById('questionType').textContent = q.type?.charAt(0).toUpperCase() + q.type?.slice(1) || 'Math';
    document.getElementById('questionPoints').textContent = `+${q.points || 10} points`;
    document.getElementById('currentQuestionNum').textContent = currentState.currentQuestion + 1;
    document.getElementById('progressFill').style.width = `${((currentState.currentQuestion + 1) / currentState.questions.length) * 100}%`;
    
    const optionsContainer = document.getElementById('optionsList');
    const answerInputArea = document.getElementById('answerInputArea');
    
    if (q.isInput) {
        optionsContainer.style.display = 'none';
        answerInputArea.style.display = 'flex';
        document.getElementById('answerInput').value = '';
        document.getElementById('answerInput').focus();
    } else {
        optionsContainer.style.display = 'flex';
        answerInputArea.style.display = 'none';
        optionsContainer.innerHTML = '';
        q.options.forEach((opt, idx) => {
            const div = document.createElement('div');
            div.className = 'option';
            div.textContent = opt;
            div.onclick = () => selectAnswer(opt, idx);
            optionsContainer.appendChild(div);
        });
    }
    
    document.getElementById('explanationBox').style.display = 'none';
    document.getElementById('nextBtn').disabled = true;
    document.getElementById('prevBtn').disabled = currentState.currentQuestion === 0;
    updatePowerupsDisplay();
}

function selectAnswer(selectedValue, selectedIdx) {
    if (currentState.userAnswers[currentState.currentQuestion] !== undefined) return;
    
    const q = currentState.questions[currentState.currentQuestion];
    const isCorrect = (selectedIdx === q.answer);
    
    processAnswer(isCorrect, q);
    
    const opts = document.querySelectorAll('.option');
    opts.forEach((opt, idx) => {
        if (idx === q.answer) opt.classList.add('correct');
        else if (idx === selectedIdx && !isCorrect) opt.classList.add('incorrect');
        opt.style.pointerEvents = 'none';
    });
}

function submitTypedAnswer() {
    if (currentState.userAnswers[currentState.currentQuestion] !== undefined) return;
    
    const userAnswer = parseFloat(document.getElementById('answerInput').value);
    const q = currentState.questions[currentState.currentQuestion];
    const isCorrect = (userAnswer === q.correctValue);
    
    processAnswer(isCorrect, q);
}

function processAnswer(isCorrect, q) {
    if (isCorrect) {
        currentState.score += (q.points || 10);
        showToast('✅ Correct! Great job!', 'success');
        playSound(true);
        if (currentState.mode === 'timeattack') currentState.timeAttackScore++;
    } else {
        currentState.lives--;
        showToast(`❌ Incorrect! Answer: ${q.correctValue}`, 'error');
        playSound(false);
        trackWeakArea(q.type);
    }
    
    currentState.userAnswers[currentState.currentQuestion] = { selected: isCorrect, correct: isCorrect };
    document.getElementById('livesCount').textContent = currentState.lives;
    document.getElementById('scoreCount').textContent = currentState.score;
    
    document.getElementById('explanationText').textContent = q.explanation;
    document.getElementById('factoidText').textContent = q.factoid || '📐 Mathematics is the language of science!';
    document.getElementById('explanationBox').style.display = 'block';
    document.getElementById('nextBtn').disabled = false;
    
    if (currentState.lives <= 0) setTimeout(() => endQuiz(), 1500);
}

function trackWeakArea(area) {
    if (!currentState.weakAreas[area]) currentState.weakAreas[area] = 0;
    currentState.weakAreas[area]++;
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
    document.getElementById('correctCount').textContent = correctCount;
    document.getElementById('timeLeftDisplay').textContent = currentState.timeLeft;
    document.getElementById('livesLeft').textContent = currentState.lives;
    
    let badge = 'Math Learner 📐';
    if (percentage >= 90) badge = 'Math Wizard 🧙‍♂️🎓';
    else if (percentage >= 75) badge = 'Algebra Master 🌟';
    else if (percentage >= 50) badge = 'Number Ninja ✨';
    document.getElementById('badgeEarned').textContent = badge;
    
    let streak = parseInt(localStorage.getItem('mathStreak') || '0');
    if (percentage >= 60) { streak++; localStorage.setItem('mathStreak', streak); }
    else { streak = 0; localStorage.setItem('mathStreak', '0'); }
    document.getElementById('finalStreak').textContent = streak;
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
        data: { labels: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Current'], datasets: [{ label: 'Your Progress', data: [40, 60, 75, score], borderColor: '#818cf8', backgroundColor: 'rgba(129,140,248,0.1)', fill: true, tension: 0.4 }] },
        options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { labels: { color: '#94a3b8' } } } }
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
            if (toRemove.includes(idx)) opt.style.opacity = '0.3';
        });
        showToast('50/50 used! Two options eliminated.', 'success');
    } else if (type === 'time') {
        if (!isPremium()) { showPremiumModal(); return; }
        currentState.timeLeft += 30;
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

// ==================== WHITEBOARD / CALCULATOR ====================
function showWhiteboard() {
    document.getElementById('whiteboardOverlay').style.display = 'flex';
    whiteboardExpression = '';
    whiteboardResult = '0';
    document.getElementById('whiteboardDisplay').textContent = '0';
}

function closeWhiteboard() {
    document.getElementById('whiteboardOverlay').style.display = 'none';
}

function whiteboardInput(val) {
    if (val === 'clear') {
        whiteboardExpression = '';
        whiteboardResult = '0';
        document.getElementById('whiteboardDisplay').textContent = '0';
    } else if (val === '=') {
        try {
            let expr = whiteboardExpression.replace(/×/g, '*').replace(/÷/g, '/');
            whiteboardResult = eval(expr).toString();
            document.getElementById('whiteboardDisplay').textContent = whiteboardResult;
        } catch(e) {
            document.getElementById('whiteboardDisplay').textContent = 'Error';
        }
    } else {
        if (whiteboardResult !== '0' && !whiteboardExpression) {
            whiteboardExpression = '';
        }
        whiteboardExpression += val;
        document.getElementById('whiteboardDisplay').textContent = whiteboardExpression;
    }
}

// ==================== AUDIO ====================
function readAloud() {
    const q = currentState.questions[currentState.currentQuestion];
    if (!q) return;
    const utterance = new SpeechSynthesisUtterance(q.question);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
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
        confetti.style.width = '8px';
        confetti.style.height = '8px';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 60%)`;
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = '-20px';
        confetti.style.borderRadius = '50%';
        confetti.style.zIndex = '1000';
        confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;
        confetti.style.pointerEvents = 'none';
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
    }
}

function downloadCertificate() {
    const score = document.getElementById('finalScoreValue').textContent;
    const name = prompt('Enter your name for certificate:', 'Student');
    if (!name) return;
    const certContent = `MATH QUIZ CHALLENGE - CERTIFICATE OF ACHIEVEMENT\n\nThis certifies that\n${name}\nhas scored ${score} on the Math Quiz Challenge\nDate: ${new Date().toLocaleDateString()}\n\nPowered by MagicRills`;
    const blob = new Blob([certContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `math-certificate-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Certificate downloaded!', 'success');
}

// ==================== TYPEWRITER EFFECT ====================
function startTypewriter() {
    const phrases = [
        '🧮 Solve 35 AI-generated questions',
        '⚡ 4 exciting game modes',
        '🎯 Track your progress',
        '🏆 Earn badges & certificates',
        '📊 Improve your math skills'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    const element = document.getElementById('typewriterText');
    let isDeleting = false;
    
    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            element.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            setTimeout(() => { isDeleting = true; }, 1500);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }
        
        const speed = isDeleting ? 50 : 100;
        setTimeout(type, speed);
    }
    
    type();
}

// ==================== UI THEMES & NAVIGATION ====================
function setupTheme() {
    const saved = localStorage.getItem('theme') || 'dark';
    if (saved === 'dark') document.body.setAttribute('data-theme', 'dark');
    else document.body.removeAttribute('data-theme');
    
    document.getElementById('themeToggle').onclick = () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            document.getElementById('themeToggle').innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
        }
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

// ==================== BUILD REACTION BUTTONS ====================
function buildReactionButtons() {
    const container = document.getElementById('reactionsBar');
    container.innerHTML = '';
    CONFIG.REACTIONS.forEach(emoji => {
        const btn = document.createElement('button');
        btn.className = 'reaction-mini-btn';
        btn.setAttribute('data-emoji', emoji);
        btn.innerHTML = `${CONFIG.REACTION_ICONS[emoji]} <span class="count">${statsData.reactions[emoji] || 0}</span>`;
        btn.onclick = () => addReaction(emoji, true);
        container.appendChild(btn);
    });
    
    // Results reactions
    const resultsContainer = document.getElementById('resultsReactions');
    resultsContainer.innerHTML = '';
    CONFIG.REACTIONS.forEach(emoji => {
        const btn = document.createElement('button');
        btn.className = 'reaction-emoji';
        btn.setAttribute('data-emoji', emoji);
        btn.innerHTML = `${CONFIG.REACTION_ICONS[emoji]} <span>${statsData.reactions[emoji] || 0}</span>`;
        btn.onclick = () => addReaction(emoji, false);
        resultsContainer.appendChild(btn);
    });
}

// ==================== SHARING ====================
function shareQuiz(platform) {
    const url = window.location.href;
    const score = document.getElementById('finalScoreValue')?.textContent || '0';
    const text = `I scored ${score} on the Math Quiz Challenge! Can you beat my score? 🧮`;
    
    let shareUrl = '';
    switch(platform) {
        case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`; break;
        case 'twitter': shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`; break;
        case 'whatsapp': shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`; break;
        case 'linkedin': shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`; break;
    }
    if (shareUrl) {
        window.open(shareUrl, '_blank');
        recordShare(platform);
        showToast(`Shared on ${platform}!`, 'success');
    }
}

function copyPageUrl() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Link copied to clipboard!', 'success');
        recordShare('copy');
    }).catch(() => {
        // Fallback
        const input = document.createElement('input');
        input.value = window.location.href;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        showToast('Link copied!', 'success');
        recordShare('copy');
    });
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Mode Selection
    document.querySelectorAll('.mode-select-btn').forEach(btn => {
        btn.onclick = () => {
            currentState.mode = btn.closest('.mode-card').getAttribute('data-mode');
            document.getElementById('modeContainer').style.display = 'none';
            document.getElementById('levelsContainer').style.display = 'block';
        };
    });
    
    // Level Selection
    document.querySelectorAll('.level-start-btn').forEach(btn => {
        btn.onclick = () => {
            const level = btn.closest('.level-card').getAttribute('data-level');
            startQuiz(level, currentState.mode);
        };
    });
    
    // Back buttons
    document.getElementById('backToModeBtn').onclick = () => {
        document.getElementById('levelsContainer').style.display = 'none';
        document.getElementById('modeContainer').style.display = 'grid';
    };
    
    document.getElementById('backBtn').onclick = () => {
        window.location.href = 'https://magicrills.com/category-pages/mixed-tools.html';
    };
    
    document.getElementById('homeBtn').onclick = () => {
        window.location.href = 'https://magicrills.com';
    };
    
    // Quiz navigation
    document.getElementById('nextBtn').onclick = nextQuestion;
    document.getElementById('prevBtn').onclick = prevQuestion;
    
    // Powerups
    document.getElementById('fiftyBtn').onclick = () => usePowerup('fifty');
    document.getElementById('timeBtn').onclick = () => usePowerup('time');
    document.getElementById('hintBtn').onclick = () => usePowerup('hint');
    document.getElementById('skipBtn').onclick = () => usePowerup('skip');
    
    // Audio & Whiteboard
    document.getElementById('readAloudBtn').onclick = readAloud;
    document.getElementById('whiteboardBtn').onclick = showWhiteboard;
    document.getElementById('closeWhiteboardBtn').onclick = closeWhiteboard;
    document.getElementById('submitAnswerBtn').onclick = submitTypedAnswer;
    
    // Results actions
    document.getElementById('tryAgainBtn').onclick = () => startQuiz(currentState.level, currentState.mode);
    document.getElementById('changeLevelBtn').onclick = () => {
        document.getElementById('resultsContainer').style.display = 'none';
        document.getElementById('levelsContainer').style.display = 'block';
    };
    document.getElementById('downloadCertBtn').onclick = downloadCertificate;
    document.getElementById('practiceWeakBtn').onclick = () => {
        showToast('🎯 Starting practice for weak areas...', 'info');
        startQuiz(currentState.level, 'practice');
    };
    
    // Whiteboard buttons
    document.querySelectorAll('.wb-btn').forEach(btn => {
        btn.onclick = () => whiteboardInput(btn.getAttribute('data-val') || btn.getAttribute('data-op'));
    });
    
    // Share buttons
    document.querySelectorAll('.share-mini-btn').forEach(btn => {
        if (btn.id === 'copyPageUrlBtn') btn.onclick = copyPageUrl;
        else btn.onclick = () => shareQuiz(btn.getAttribute('data-platform'));
    });
    document.querySelectorAll('.social-icon').forEach(btn => {
        btn.onclick = () => shareQuiz(btn.getAttribute('data-platform'));
    });
    
    // Premium modal
    document.getElementById('closeModalBtn').onclick = closePremiumModal;
    document.getElementById('maybeLaterBtn').onclick = closePremiumModal;
    document.getElementById('upgradeBtn').onclick = () => {
        localStorage.setItem('isPremium', 'true');
        showToast('🎉 Premium activated!', 'success');
        closePremiumModal();
    };
    
    // Stats
    document.getElementById('statsBtn').onclick = () => {
        showToast(`📊 Total plays: ${toolUsageCount}`, 'info');
    };
    document.getElementById('streakBtn').onclick = () => {
        const streak = localStorage.getItem('mathStreak') || '0';
        showToast(`🔥 Current streak: ${streak} days`, 'info');
    };
    
    // Answer input Enter key
    document.getElementById('answerInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitTypedAnswer();
    });
}

// ==================== INITIALIZATION ====================
async function init() {
    console.log(`🚀 ${CONFIG.APP_NAME} v${CONFIG.VERSION} initializing...`);
    
    // Setup theme first
    setupTheme();
    setupScrollButtons();
    
    // Fetch stats
    await fetchToolStats();
    buildReactionButtons();
    
    // Increment usage
    await incrementUsage();
    
    // Load streak
    const savedStreak = localStorage.getItem('mathStreak') || '0';
    document.getElementById('streakCount').textContent = savedStreak;
    
    // Set default user counts
    document.getElementById('totalUsersCount').textContent = '25,000+';
    document.getElementById('totalQuestionsCount').textContent = '10,000+';
    document.getElementById('heroTotalUsers').textContent = '25K+';
    document.getElementById('heroTotalQuestions').textContent = '10K+';
    
    // Start typewriter
    startTypewriter();
    
    // Setup event listeners
    setupEventListeners();
    
    // Show welcome
    setTimeout(() => showToast('🧮 Welcome to Math Quiz Challenge!', 'success'), 500);
    
    console.log(`✅ ${CONFIG.APP_NAME} initialized successfully!`);
}

// Add confetti animation style
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ==================== START ====================
document.addEventListener('DOMContentLoaded', init);
