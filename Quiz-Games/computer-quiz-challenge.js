// ==================== CONFIGURATION ====================
const CONFIG = {
    APP_NAME: 'Computer Quiz Challenge',
    VERSION: '3.0.0',
    CLOUD_WORKER_URL: 'https://advanced-science-quiz-challenge.uzairhameed01.workers.dev',
    DEFAULT_TIMER: 60,
    QUESTIONS_PER_QUIZ: 20,
    SCORE_PER_CORRECT: 100
};

// ==================== GLOBAL STATE ====================
let currentState = {
    level: null,
    questions: [],
    currentQuestion: 0,
    score: 0,
    lives: 3,
    userAnswers: [],
    powerups: { fifty: 3, time: 3, hint: 3, skip: 3 },
    timer: null,
    timeLeft: 60,
    quizId: null,
    sessionId: null,
    hasUsedSkip: false
};

let userReactions = new Set();
let toolUsageCount = 0;
let allBadges = [];
let earnedBadges = [];

// ==================== QUIZ DATA (Local Fallback) ====================
const localQuestions = {
    easy: [
        { question: "What does CPU stand for?", options: ["Central Processing Unit", "Computer Personal Unit", "Central Process Unit", "Computer Processing Unit"], answer: 0, explanation: "CPU stands for Central Processing Unit, which is the primary component of a computer that performs most processing tasks.", factoid: "The CPU is often called the 'brain' of the computer." },
        { question: "Which of these is an input device?", options: ["Monitor", "Printer", "Keyboard", "Speaker"], answer: 2, explanation: "A keyboard is an input device that allows users to enter data into a computer.", factoid: "The first computer keyboard was based on typewriter designs." },
        { question: "What is the main function of RAM?", options: ["Permanent storage", "Temporary storage for running applications", "Graphics processing", "Internet connectivity"], answer: 1, explanation: "RAM (Random Access Memory) provides temporary storage for data and applications currently in use.", factoid: "RAM loses all data when the computer is turned off." },
        { question: "Which port is typically used to connect a mouse or keyboard?", options: ["USB", "HDMI", "Ethernet", "VGA"], answer: 0, explanation: "USB ports are commonly used to connect peripherals like mice and keyboards.", factoid: "USB stands for Universal Serial Bus." },
        { question: "What does SSD stand for in computer storage?", options: ["Super Speed Disk", "Solid State Drive", "System Storage Device", "Serial Storage Disk"], answer: 1, explanation: "SSD stands for Solid State Drive, a type of fast storage device with no moving parts.", factoid: "SSDs are much faster than traditional hard drives (HDDs)." },
        { question: "Which of these is NOT an operating system?", options: ["Windows", "macOS", "Linux", "Chrome"], answer: 3, explanation: "Chrome is a web browser, not an operating system.", factoid: "Android and iOS are mobile operating systems." },
        { question: "What is the binary equivalent of the decimal number 10?", options: ["1010", "1001", "1100", "1110"], answer: 0, explanation: "The binary number 1010 equals 1×8 + 0×4 + 1×2 + 0×1 = 10 in decimal.", factoid: "Binary is the foundation of all modern computing." },
        { question: "Which component connects all other components in a computer?", options: ["CPU", "RAM", "Motherboard", "Power Supply"], answer: 2, explanation: "The motherboard is the main circuit board that connects all components.", factoid: "Motherboards come in different sizes: ATX, Micro-ATX, and Mini-ITX." },
        { question: "What does URL stand for?", options: ["Uniform Resource Locator", "Universal Reference Link", "Uniform Reference Locator", "Universal Resource Locator"], answer: 0, explanation: "URL stands for Uniform Resource Locator, the address of a web resource.", factoid: "Tim Berners-Lee invented the URL in 1989." },
        { question: "Which of these is a cloud storage service?", options: ["Google Drive", "Microsoft Word", "Adobe Photoshop", "VLC Media Player"], answer: 0, explanation: "Google Drive is a cloud storage service for saving files online.", factoid: "Other cloud storage services include Dropbox and OneDrive." },
        { question: "What does 'www' stand for in a website address?", options: ["World Wide Web", "Web World Wide", "World Web Wide", "Wide World Web"], answer: 0, explanation: "WWW stands for World Wide Web, the system of internet servers.", factoid: "The World Wide Web was invented by Tim Berners-Lee in 1989." },
        { question: "Which key is used to delete characters to the right of the cursor?", options: ["Backspace", "Delete", "Enter", "Shift"], answer: 1, explanation: "The Delete key removes characters to the right of the cursor.", factoid: "The Backspace key removes characters to the left." },
        { question: "What is the purpose of a firewall?", options: ["Speed up internet", "Protect against unauthorized access", "Increase storage capacity", "Improve graphics quality"], answer: 1, explanation: "A firewall protects a network by blocking unauthorized access.", factoid: "Firewalls can be hardware or software-based." },
        { question: "Which of these is a programming language?", options: ["HTML", "CSS", "Python", "JPEG"], answer: 2, explanation: "Python is a programming language, while the others are not.", factoid: "Python was named after Monty Python, not the snake." },
        { question: "What does LAN stand for?", options: ["Local Area Network", "Large Access Network", "Linked Area Nodes", "Local Access Nodes"], answer: 0, explanation: "LAN stands for Local Area Network, a network covering a small area.", factoid: "Wi-Fi is the most common wireless LAN technology." },
        { question: "Which device converts digital signals to analog for telephone lines?", options: ["Router", "Switch", "Modem", "Hub"], answer: 2, explanation: "A modem converts signals between digital and analog for communication.", factoid: "Modem stands for Modulator-Demodulator." },
        { question: "What is the primary function of a GPU?", options: ["Sound processing", "Graphics rendering", "Internet connectivity", "File storage"], answer: 1, explanation: "GPU (Graphics Processing Unit) handles graphics rendering.", factoid: "GPUs are also used for cryptocurrency mining and AI." },
        { question: "Which of these is an example of malware?", options: ["Firewall", "Virus", "PDF", "JPEG"], answer: 1, explanation: "A virus is a type of malicious software (malware).", factoid: "Antivirus software helps protect against malware." },
        { question: "What does PDF stand for?", options: ["Portable Document Format", "Personal Data File", "Printed Document File", "Public Data Format"], answer: 0, explanation: "PDF stands for Portable Document Format.", factoid: "Adobe created the PDF format in 1993." },
        { question: "Which command is used to copy text?", options: ["Ctrl+X", "Ctrl+C", "Ctrl+V", "Ctrl+Z"], answer: 1, explanation: "Ctrl+C is the keyboard shortcut for copying text.", factoid: "Ctrl+V is used for paste, Ctrl+X for cut, and Ctrl+Z for undo." }
    ],
    average: [
        { question: "Which feature in Word allows you to automatically correct common typos?", options: ["AutoFormat", "AutoCorrect", "AutoText", "AutoComplete"], answer: 1, explanation: "AutoCorrect automatically fixes common spelling mistakes and typos.", factoid: "You can customize AutoCorrect to add your own shortcuts." },
        { question: "What is the default file extension for PowerPoint presentations?", options: [".docx", ".xlsx", ".pptx", ".txt"], answer: 2, explanation: "PowerPoint presentations typically use the .pptx file extension.", factoid: ".pptx files are actually compressed ZIP archives." },
        { question: "Which communication tool allows real-time text-based conversations?", options: ["Email", "Chat", "Blog", "Forum"], answer: 1, explanation: "Chat applications enable real-time text conversations.", factoid: "IRC was one of the first chat protocols (1988)." },
        { question: "What does CC stand for in email?", options: ["Carbon Copy", "Computer Communication", "Copy Content", "Client Copy"], answer: 0, explanation: "CC stands for Carbon Copy, sending a copy of the email to additional recipients.", factoid: "BCC (Blind Carbon Copy) hides recipients from each other." },
        { question: "Which view in PowerPoint shows thumbnails of all slides?", options: ["Normal view", "Slide Sorter", "Reading View", "Notes Page"], answer: 1, explanation: "Slide Sorter view displays thumbnails of all slides for easy organization.", factoid: "You can drag slides to reorder them in Slide Sorter view." }
    ],
    hard: [
        { question: "What is the time complexity of a binary search algorithm?", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"], answer: 2, explanation: "Binary search has O(log n) complexity as it halves the search space each step.", factoid: "Binary search requires a sorted array to work correctly." },
        { question: "Which number system uses base 16?", options: ["Binary", "Decimal", "Hexadecimal", "Octal"], answer: 2, explanation: "Hexadecimal is base-16, using digits 0-9 and letters A-F.", factoid: "Hexadecimal is commonly used in programming for memory addresses." },
        { question: "What is the binary result of 1101 AND 1011?", options: ["1001", "1111", "1101", "1011"], answer: 0, explanation: "Bitwise AND compares each bit: 1101 AND 1011 = 1001.", factoid: "Bitwise operations are fundamental in low-level programming." }
    ]
};

// Expand questions to reach required count
function expandQuestions(questions) {
    const expanded = [...questions];
    while (expanded.length < CONFIG.QUESTIONS_PER_QUIZ) {
        expanded.push(...questions.slice(0, CONFIG.QUESTIONS_PER_QUIZ - expanded.length));
    }
    return expanded.slice(0, CONFIG.QUESTIONS_PER_QUIZ);
}

// ==================== UTILITY FUNCTIONS ====================
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i> ${message}`;
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

// ==================== TiDB API INTEGRATION ====================
async function incrementUsage(toolSlug) {
    try {
        const response = await fetch(`${CONFIG.CLOUD_WORKER_URL}/api/usage/increment`, {
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
        toolUsageCount++;
        updateUsageDisplay(toolUsageCount);
    }
}

async function getUsageCount(toolSlug) {
    try {
        const response = await fetch(`${CONFIG.CLOUD_WORKER_URL}/api/usage/get?tool_slug=${toolSlug}`);
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
        const response = await fetch(`${CONFIG.CLOUD_WORKER_URL}/api/reactions/add`, {
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
        const response = await fetch(`${CONFIG.CLOUD_WORKER_URL}/api/reactions/get?tool_slug=${toolSlug}`);
        const data = await response.json();
        updateReactionDisplay(data);
        return data;
    } catch (error) {
        console.error('Get reactions failed:', error);
    }
}

async function trackShare(toolSlug, platform) {
    try {
        await fetch(`${CONFIG.CLOUD_WORKER_URL}/api/shares/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: toolSlug, platform: platform })
        });
    } catch (error) {
        console.error('Track share failed:', error);
    }
}

function updateUsageDisplay(count) {
    const usageElements = document.querySelectorAll('.usage-count');
    usageElements.forEach(el => {
        if (el) el.textContent = count.toLocaleString();
    });
    const globalBadge = document.getElementById('globalUsageCount');
    if (globalBadge) globalBadge.textContent = count.toLocaleString();
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

// ==================== GROK API INTEGRATION ====================
async function generateQuestionsFromAI(level) {
    showLoading(`AI is generating ${level} level computer science questions...`);
    
    const prompt = `Generate ${CONFIG.QUESTIONS_PER_QUIZ} multiple choice questions about Computer Science at ${level} difficulty level. Include questions about programming, hardware, software, networking, and IT concepts. For each question, provide: question text, 4 options, correct answer index (0-3), a brief explanation, and an interesting factoid. Format as JSON array.`;
    
    try {
        const response = await fetch(`${CONFIG.CLOUD_WORKER_URL}/api/grok/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, model: 'llama-3.1-8b-instant' })
        });
        
        const data = await response.json();
        hideLoading();
        
        if (data.questions && data.questions.length > 0) {
            return data.questions;
        } else {
            showToast('Using local question bank', 'warning');
            return expandQuestions(localQuestions[level] || localQuestions.easy);
        }
    } catch (error) {
        console.error('AI generation failed:', error);
        hideLoading();
        showToast('Using local question bank', 'warning');
        return expandQuestions(localQuestions[level] || localQuestions.easy);
    }
}

// ==================== QUIZ CORE FUNCTIONS ====================
async function startQuiz(level) {
    currentState = {
        level: level,
        questions: [],
        currentQuestion: 0,
        score: 0,
        lives: 3,
        userAnswers: [],
        powerups: { fifty: 3, time: 3, hint: 3, skip: 3 },
        timer: null,
        timeLeft: CONFIG.DEFAULT_TIMER,
        quizId: `computer_${level}_${Date.now()}`,
        sessionId: localStorage.getItem('sessionId') || `session_${Date.now()}`,
        hasUsedSkip: false
    };
    
    localStorage.setItem('sessionId', currentState.sessionId);
    
    // Track usage
    await incrementUsage(`quiz_computer_${level}`);
    await getUsageCount(`quiz_computer_${level}`);
    
    // Generate questions
    const questions = await generateQuestionsFromAI(level);
    currentState.questions = questions;
    
    // Setup UI
    document.getElementById('levelsContainer').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';
    document.getElementById('resultsContainer').style.display = 'none';
    document.getElementById('badgesContainer').style.display = 'none';
    
    document.getElementById('quizLevel').textContent = level.charAt(0).toUpperCase() + level.slice(1);
    document.getElementById('totalQuestions').textContent = currentState.questions.length;
    document.getElementById('totalQuestionsCount').textContent = currentState.questions.length;
    document.getElementById('livesCount').textContent = currentState.lives;
    document.getElementById('scoreCount').textContent = currentState.score;
    
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
        optionDiv.setAttribute('data-index', index);
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
        currentState.score += CONFIG.SCORE_PER_CORRECT;
        showToast('✅ Correct!', 'success');
    } else {
        currentState.lives--;
        showToast(`❌ Incorrect. Correct answer: ${String.fromCharCode(65 + question.answer)}`, 'error');
    }
    
    currentState.userAnswers[currentState.currentQuestion] = {
        selected: selectedIndex,
        correct: isCorrect,
        correctAnswer: question.answer
    };
    
    // Update displays
    document.getElementById('livesCount').textContent = currentState.lives;
    document.getElementById('scoreCount').textContent = currentState.score;
    
    // Highlight correct/incorrect
    const options = document.querySelectorAll('.option');
    options.forEach((opt, idx) => {
        if (idx === question.answer) {
            opt.classList.add('correct');
        } else if (idx === selectedIndex && !isCorrect) {
            opt.classList.add('incorrect');
        }
        opt.classList.add('disabled');
    });
    
    // Show explanation
    document.getElementById('explanationText').textContent = question.explanation;
    document.getElementById('factoidText').textContent = question.factoid || 'Did you know? Computers use binary language (0s and 1s) to process information!';
    document.getElementById('explanationBox').style.display = 'block';
    
    document.getElementById('nextBtn').disabled = false;
    if (currentState.timer) clearInterval(currentState.timer);
    
    // Check game over
    if (currentState.lives <= 0) {
        setTimeout(() => endQuiz(), 1500);
    }
}

function handleTimeout() {
    const question = currentState.questions[currentState.currentQuestion];
    currentState.userAnswers[currentState.currentQuestion] = {
        selected: -1,
        correct: false,
        correctAnswer: question.answer
    };
    currentState.lives--;
    document.getElementById('livesCount').textContent = currentState.lives;
    
    showToast(`⏰ Time's up! Answer: ${String.fromCharCode(65 + question.answer)}`, 'warning');
    
    const options = document.querySelectorAll('.option');
    options.forEach((opt, idx) => {
        if (idx === question.answer) opt.classList.add('correct');
        opt.classList.add('disabled');
    });
    
    document.getElementById('explanationText').textContent = question.explanation;
    document.getElementById('factoidText').textContent = question.factoid || 'Time management is key in quizzes!';
    document.getElementById('explanationBox').style.display = 'block';
    document.getElementById('nextBtn').disabled = false;
    
    if (currentState.lives <= 0) {
        setTimeout(() => endQuiz(), 1500);
    }
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
    
    const percentage = Math.round((currentState.score / (currentState.questions.length * CONFIG.SCORE_PER_CORRECT)) * 100);
    const timeBonus = Math.floor(currentState.timeLeft / 3);
    const totalScore = currentState.score + timeBonus;
    const correctCount = currentState.userAnswers.filter(a => a && a.correct).length;
    
    document.getElementById('finalScoreValue').textContent = `${percentage}%`;
    document.getElementById('correctCount').textContent = correctCount;
    document.getElementById('timeBonus').textContent = timeBonus;
    document.getElementById('livesLeft').textContent = currentState.lives;
    
    // Determine badge
    let badge = 'Computer Novice 💻';
    if (percentage >= 90) badge = 'Computer Master 🎓';
    else if (percentage >= 75) badge = 'Tech Expert 🚀';
    else if (percentage >= 50) badge = 'Digital Learner 📚';
    document.getElementById('badgeEarned').textContent = badge;
    
    // Update badges
    updateBadges(percentage, correctCount);
    
    // Load reactions
    await getReactions(`quiz_computer_${currentState.level}`);
    
    document.getElementById('quizContainer').style.display = 'none';
    document.getElementById('resultsContainer').style.display = 'block';
    
    // Confetti for good scores
    if (percentage >= 75) {
        animateConfetti();
    }
}

// ==================== BADGES SYSTEM ====================
function updateBadges(percentage, correctCount) {
    allBadges = [
        { id: 'newbie', title: 'Newbie', description: 'Complete your first quiz', icon: '🌱', condition: true, unlocked: true },
        { id: 'level_easy', title: 'Basic Learner', description: 'Complete Easy level', icon: '📘', condition: currentState.level === 'easy', unlocked: currentState.level === 'easy' },
        { id: 'level_average', title: 'Intermediate', description: 'Complete Average level', icon: '📙', condition: currentState.level === 'average', unlocked: currentState.level === 'average' },
        { id: 'level_hard', title: 'Expert', description: 'Complete Hard level', icon: '📕', condition: currentState.level === 'hard', unlocked: currentState.level === 'hard' },
        { id: 'perfect', title: 'Perfectionist', description: 'Score 100%', icon: '🎯', condition: percentage === 100, unlocked: percentage === 100 },
        { id: 'scholar', title: 'Scholar', description: 'Score 90% or above', icon: '🏆', condition: percentage >= 90, unlocked: percentage >= 90 },
        { id: 'speedster', title: 'Speedster', description: 'Finish with time bonus', icon: '⚡', condition: currentState.timeLeft > 10, unlocked: currentState.timeLeft > 10 },
        { id: 'survivor', title: 'Survivor', description: 'Complete with 1 life left', icon: '💪', condition: currentState.lives === 1, unlocked: currentState.lives === 1 },
        { id: 'power_user', title: 'Power User', description: 'Use all power-ups', icon: '🔋', condition: Object.values(currentState.powerups).some(v => v < 3), unlocked: Object.values(currentState.powerups).some(v => v < 3) }
    ];
    
    earnedBadges = allBadges.filter(b => b.unlocked);
}

function showBadgesModal() {
    const badgesGrid = document.getElementById('badgesGrid');
    badgesGrid.innerHTML = '';
    
    allBadges.forEach(badge => {
        const badgeCard = document.createElement('div');
        badgeCard.className = `badge-card ${badge.unlocked ? 'unlocked' : 'locked'}`;
        badgeCard.innerHTML = `
            <div class="badge-icon">${badge.icon}</div>
            <div class="badge-title">${badge.title}</div>
            <div class="badge-desc">${badge.description}</div>
        `;
        badgesGrid.appendChild(badgeCard);
    });
    
    document.getElementById('resultsContainer').style.display = 'none';
    document.getElementById('badgesContainer').style.display = 'block';
}

// ==================== POWERUPS ====================
function usePowerup(type) {
    if (currentState.powerups[type] <= 0) {
        showToast(`No ${type} powerups left!`, 'warning');
        return;
    }
    
    if (currentState.userAnswers[currentState.currentQuestion]) {
        showToast('Already answered this question!', 'warning');
        return;
    }
    
    const question = currentState.questions[currentState.currentQuestion];
    
    switch(type) {
        case 'fifty':
            currentState.powerups[type]--;
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
        case 'time':
            if (!isPremiumUser()) {
                showPremiumModal();
                return;
            }
            currentState.powerups[type]--;
            currentState.timeLeft = Math.min(currentState.timeLeft + 30, CONFIG.DEFAULT_TIMER);
            updateTimerDisplay();
            showToast('+30 seconds added!', 'success');
            break;
        case 'hint':
            if (!isPremiumUser()) {
                showPremiumModal();
                return;
            }
            currentState.powerups[type]--;
            showToast(`💡 Hint: ${question.explanation.substring(0, 100)}...`, 'info');
            break;
        case 'skip':
            if (currentState.hasUsedSkip) {
                showToast('Skip already used this question!', 'warning');
                return;
            }
            currentState.powerups[type]--;
            currentState.hasUsedSkip = true;
            showToast('Question skipped!', 'info');
            nextQuestion();
            break;
    }
    
    updatePowerupsDisplay();
}

function updatePowerupsDisplay() {
    const powerupBtns = document.querySelectorAll('.powerup-btn');
    powerupBtns.forEach(btn => {
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

// ==================== PREMIUM MODAL ====================
function isPremiumUser() {
    return localStorage.getItem('isPremium') === 'true';
}

function showPremiumModal() {
    document.getElementById('premiumModal').style.display = 'flex';
}

function closePremiumModal() {
    document.getElementById('premiumModal').style.display = 'none';
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
    const reactionKey = `computer_${currentState.level}_${emoji}`;
    
    if (userReactions.has(reactionKey)) {
        showToast('You already reacted with this emoji!', 'warning');
        return;
    }
    
    userReactions.add(reactionKey);
    await addReaction(`quiz_computer_${currentState.level}`, emoji);
}

function setupSocialShares() {
    const shareBtns = document.querySelectorAll('.social-icon');
    shareBtns.forEach(btn => {
        btn.onclick = () => shareQuiz(btn.getAttribute('data-platform'));
    });
    
    document.getElementById('copyUrlBtn').onclick = copyQuizUrl;
    document.getElementById('downloadResultsBtn').onclick = downloadResults;
}

function shareQuiz(platform) {
    const url = window.location.href;
    const percentage = document.getElementById('finalScoreValue').textContent;
    const level = currentState.level;
    const text = `I scored ${percentage} on the ${level} level Computer Quiz Challenge! Can you beat my score?`;
    
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
            shareUrl = `mailto:?subject=Computer Quiz Challenge&body=${encodeURIComponent(text + '\n\n' + url)}`;
            break;
    }
    
    if (shareUrl) window.open(shareUrl, '_blank');
    trackShare(`quiz_computer_${currentState.level}`, platform);
    showToast(`Shared on ${platform}!`);
}

function copyQuizUrl() {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link copied to clipboard!');
    trackShare(`quiz_computer_${currentState.level}`, 'copy');
}

function downloadResults() {
    const percentage = document.getElementById('finalScoreValue').textContent;
    const correct = document.getElementById('correctCount').textContent;
    const total = document.getElementById('totalQuestionsCount').textContent;
    const timeBonus = document.getElementById('timeBonus').textContent;
    const livesLeft = document.getElementById('livesLeft').textContent;
    const badge = document.getElementById('badgeEarned').textContent;
    
    const content = `Computer Quiz Challenge Results
================================
Date: ${new Date().toLocaleString()}
Level: ${currentState.level}
Score: ${percentage}
Correct Answers: ${correct}/${total}
Time Bonus: +${timeBonus}
Lives Left: ${livesLeft}
Badge Earned: ${badge}
================================
Thank you for playing!`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `computer-quiz-results-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Results downloaded!');
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

function animateConfetti() {
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '50%';
        confetti.style.zIndex = '1000';
        confetti.style.pointerEvents = 'none';
        confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
    }
}

// Add confetti animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
    }
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
`;
document.head.appendChild(style);

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Level cards
    document.querySelectorAll('.start-btn').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const level = btn.getAttribute('data-level');
            startQuiz(level);
        };
    });
    
    // Powerups
    document.getElementById('fiftyBtn').onclick = () => usePowerup('fifty');
    document.getElementById('timeBtn').onclick = () => usePowerup('time');
    document.getElementById('hintBtn').onclick = () => usePowerup('hint');
    document.getElementById('skipBtn').onclick = () => usePowerup('skip');
    
    // Next button
    document.getElementById('nextBtn').onclick = nextQuestion;
    
    // Try again button
    document.getElementById('tryAgainBtn').onclick = () => {
        document.getElementById('resultsContainer').style.display = 'none';
        document.getElementById('levelsContainer').style.display = 'grid';
        currentState = {};
    };
    
    // View badges button
    document.getElementById('viewBadgesBtn').onclick = () => showBadgesModal();
    document.getElementById('backFromBadgesBtn').onclick = () => {
        document.getElementById('badgesContainer').style.display = 'none';
        document.getElementById('resultsContainer').style.display = 'block';
    };
    
    // Stats button
    document.getElementById('statsBtn').onclick = () => {
        showToast(`Total plays: ${toolUsageCount.toLocaleString()}`, 'info');
    };
    
    // Modal buttons
    document.getElementById('closeModalBtn').onclick = closePremiumModal;
    document.getElementById('maybeLaterBtn').onclick = closePremiumModal;
    document.getElementById('upgradeBtn').onclick = () => {
        localStorage.setItem('isPremium', 'true');
        showToast('Premium activated! 🎉', 'success');
        closePremiumModal();
    };
    
    // Close modal on outside click
    window.onclick = (e) => {
        if (e.target === document.getElementById('premiumModal')) {
            closePremiumModal();
        }
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
    await getUsageCount('quiz_computer_total');
    
    showToast('Welcome to Computer Quiz Challenge! 💻', 'success');
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
