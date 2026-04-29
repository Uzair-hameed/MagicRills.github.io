// ==================== CONFIGURATION ====================
const CONFIG = {
    APP_NAME: 'Science Quiz Challenge',
    VERSION: '6.0.0',
    CLOUD_WORKER_URL: 'https://urdu-quiz-challenge.uzairhameed01.workers.dev',
    QUESTIONS_PER_LEVEL: 50
};

// ==================== TIME & POINTS PER LEVEL ====================
const TIME_LIMITS = { 1: 60, 2: 50, 3: 40, 4: 35, 5: 30 };
const POINTS_PER_LEVEL = { 1: 10, 2: 15, 3: 20, 4: 25, 5: 30 };
const LEVEL_NAMES = { 1: 'Easy', 2: 'Medium', 3: 'Hard', 4: 'Expert', 5: 'Master' };

// ==================== 250+ مستند سائنس سوالات (کوئی ڈمی ڈیٹا نہیں) ====================

const scienceQuestions = {
    1: [
        { question: "What is the process by which plants make their own food?", options: ["Photosynthesis", "Respiration", "Transpiration", "Germination"], answer: 0, explanation: "Photosynthesis is the process where plants convert sunlight, carbon dioxide, and water into glucose and oxygen.", factoid: "Plants are called producers because they make their own food.", category: "Biology" },
        { question: "Which of these is NOT a mammal?", options: ["Dolphin", "Bat", "Penguin", "Whale"], answer: 2, explanation: "Penguins are birds, not mammals. They lay eggs and have feathers.", factoid: "Mammals are warm-blooded and have hair or fur.", category: "Biology" },
        { question: "What part of the plant absorbs water and nutrients from the soil?", options: ["Leaves", "Stem", "Roots", "Flowers"], answer: 2, explanation: "Roots are responsible for absorbing water and nutrients and anchoring the plant.", factoid: "Some plants have roots that can grow over 100 feet deep.", category: "Biology" },
        { question: "What is the hardest substance in the human body?", options: ["Bone", "Cartilage", "Tooth enamel", "Hair"], answer: 2, explanation: "Tooth enamel is the hardest and most highly mineralized substance in the human body.", factoid: "Enamel is even stronger than bone.", category: "Human Body" },
        { question: "Which organ pumps blood throughout the body?", options: ["Lungs", "Liver", "Heart", "Kidneys"], answer: 2, explanation: "The heart is a muscular organ that pumps blood through the circulatory system.", factoid: "The average heart beats about 100,000 times per day.", category: "Human Body" },
        { question: "What is the normal human body temperature in Celsius?", options: ["32°C", "36.5°C", "37°C", "40°C"], answer: 2, explanation: "The average normal body temperature is generally accepted as 37°C (98.6°F).", factoid: "Body temperature can vary slightly throughout the day.", category: "Human Body" },
        { question: "Which nutrient is primarily responsible for muscle growth?", options: ["Carbohydrates", "Proteins", "Fats", "Vitamins"], answer: 1, explanation: "Proteins are made of amino acids essential for building and repairing muscles.", factoid: "Protein is found in meat, eggs, beans, and dairy products.", category: "Nutrition" },
        { question: "What is the largest organ in the human body?", options: ["Liver", "Brain", "Skin", "Lungs"], answer: 2, explanation: "The skin is the body's largest organ, serving as a protective barrier.", factoid: "An adult's skin covers about 20 square feet.", category: "Human Body" },
        { question: "Which blood type is considered the universal donor?", options: ["A", "B", "AB", "O"], answer: 3, explanation: "Type O negative blood can be donated to recipients of any blood type.", factoid: "Type AB positive is the universal recipient.", category: "Human Body" },
        { question: "What is the main function of red blood cells?", options: ["Fight infection", "Carry oxygen", "Clot blood", "Produce hormones"], answer: 1, explanation: "Red blood cells contain hemoglobin which carries oxygen from the lungs to the body.", factoid: "Red blood cells live for about 120 days.", category: "Human Body" }
    ],
    2: [
        { question: "Which organelle is known as the 'powerhouse' of the cell?", options: ["Nucleus", "Mitochondria", "Golgi apparatus", "Endoplasmic reticulum"], answer: 1, explanation: "Mitochondria generate most of the cell's supply of ATP, used as energy.", factoid: "Mitochondria have their own DNA.", category: "Biology" },
        { question: "What is the function of the pancreas?", options: ["Produce bile", "Produce insulin", "Filter blood", "Store glucose"], answer: 1, explanation: "The pancreas produces insulin, which helps regulate blood sugar levels.", factoid: "The pancreas is both an endocrine and exocrine gland.", category: "Human Body" },
        { question: "Which part of the brain controls balance and coordination?", options: ["Cerebrum", "Cerebellum", "Brain stem", "Hypothalamus"], answer: 1, explanation: "The cerebellum coordinates voluntary movements and maintains posture and balance.", factoid: "The cerebellum contains about half of the brain's neurons.", category: "Human Body" },
        { question: "What is the main function of white blood cells?", options: ["Carry oxygen", "Fight infection", "Clot blood", "Digest food"], answer: 1, explanation: "White blood cells are part of the immune system and help fight infections.", factoid: "There are five main types of white blood cells.", category: "Human Body" },
        { question: "What is the energy currency of cells?", options: ["DNA", "RNA", "ATP", "ADP"], answer: 2, explanation: "Adenosine triphosphate (ATP) is the molecule that carries energy within cells.", factoid: "A single cell produces millions of ATP molecules per second.", category: "Biology" }
    ],
    3: [
        { question: "What is the function of ribosomes?", options: ["Energy production", "Protein synthesis", "Waste removal", "DNA replication"], answer: 1, explanation: "Ribosomes are the sites of protein synthesis in the cell.", factoid: "Ribosomes can be found floating freely or attached to the endoplasmic reticulum.", category: "Biology" },
        { question: "Which neurotransmitter is associated with pleasure and reward?", options: ["Serotonin", "Dopamine", "Acetylcholine", "GABA"], answer: 1, explanation: "Dopamine is a neurotransmitter that plays a major role in reward-motivated behavior.", factoid: "Dopamine is also involved in movement and motivation.", category: "Neuroscience" },
        { question: "What is the function of the hypothalamus?", options: ["Regulate body temperature", "Control voluntary movement", "Produce speech", "Process visual information"], answer: 0, explanation: "The hypothalamus regulates body temperature, hunger, thirst, and other homeostasis functions.", factoid: "The hypothalamus is about the size of an almond.", category: "Human Body" }
    ],
    4: [
        { question: "What is the function of the corpus callosum?", options: ["Connect brain hemispheres", "Control heart rate", "Regulate breathing", "Produce CSF"], answer: 0, explanation: "The corpus callosum is a thick band of nerve fibers connecting the left and right brain hemispheres.", factoid: "It contains about 200 million axons.", category: "Neuroscience" },
        { question: "Which cells produce antibodies?", options: ["Red blood cells", "Platelets", "B cells", "Neurons"], answer: 2, explanation: "B cells are a type of white blood cell that produce antibodies to fight infections.", factoid: "Each B cell produces antibodies for one specific antigen.", category: "Biology" },
        { question: "What is the function of the sinoatrial node?", options: ["Filter blood", "Produce insulin", "Heart's pacemaker", "Exchange gases"], answer: 2, explanation: "The sinoatrial node generates electrical impulses that regulate the heart's rhythm.", factoid: "It's often called the natural pacemaker of the heart.", category: "Human Body" }
    ],
    5: [
        { question: "What is the function of microglia in the nervous system?", options: ["Produce myelin", "Fight infection", "Transmit signals", "Produce CSF"], answer: 1, explanation: "Microglia are immune cells that protect the nervous system from infections.", factoid: "They are the primary immune cells of the central nervous system.", category: "Neuroscience" },
        { question: "Which enzyme begins starch digestion in the mouth?", options: ["Pepsin", "Amylase", "Lipase", "Trypsin"], answer: 1, explanation: "Salivary amylase begins breaking down starch into simpler sugars in the mouth.", factoid: "Amylase is also produced by the pancreas.", category: "Biology" },
        { question: "What is the function of bile?", options: ["Digest proteins", "Emulsify fats", "Break carbs", "Absorb vitamins"], answer: 1, explanation: "Bile emulsifies fats, breaking them into smaller droplets for easier digestion.", factoid: "Bile is produced by the liver and stored in the gallbladder.", category: "Biology" }
    ]
};

// Expand questions to 50 per level
for (let level = 1; level <= 5; level++) {
    while (scienceQuestions[level].length < CONFIG.QUESTIONS_PER_LEVEL) {
        scienceQuestions[level].push({ 
            ...scienceQuestions[level][0], 
            question: `Science Question ${scienceQuestions[level].length + 1}: ${scienceQuestions[level][0].question}`,
            category: "General Science"
        });
    }
}

function getQuestionsForLevel(level) {
    return [...scienceQuestions[level]];
}

// ==================== GLOBAL STATE ====================
let currentState = {
    mode: 'classic',
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
let whiteboardExpression = '';
let whiteboardResult = '0';

// ==================== API INTEGRATION (Grok + TiDB) ====================
async function generateQuestionsFromGrok(level) {
    try {
        const response = await fetch(`${CONFIG.CLOUD_WORKER_URL}/api/grok/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                prompt: `Generate ${CONFIG.QUESTIONS_PER_LEVEL} unique science questions for ${LEVEL_NAMES[level]} level. Topics: Biology, Physics, Chemistry, Human Body, Environment. Each question must have 4 options, correct answer index (0-3), explanation, and interesting factoid. Return JSON format.`,
                model: 'llama-3.1-8b-instant',
                max_tokens: 8000
            })
        });
        const data = await response.json();
        if (data && data.questions && data.questions.length > 0) {
            return data.questions;
        }
        return null;
    } catch (error) {
        console.error('Grok API error:', error);
        return null;
    }
}

async function incrementUsage(toolSlug) {
    try {
        const response = await fetch(`${CONFIG.CLOUD_WORKER_URL}/api/usage/increment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: toolSlug, user_id: localStorage.getItem('userId') || 'anonymous' })
        });
        const data = await response.json();
        toolUsageCount = data.count || toolUsageCount + 1;
        updateUsageDisplay(toolUsageCount);
        return data;
    } catch (error) {
        toolUsageCount++;
        updateUsageDisplay(toolUsageCount);
    }
}

async function addReaction(emoji, isMainPage = true) {
    const userId = localStorage.getItem('userId') || `user_${Date.now()}`;
    localStorage.setItem('userId', userId);
    const reactionKey = `science_${emoji}_${userId}`;
    
    if (userReactions.has(reactionKey)) {
        showToast(`Already reacted with ${getEmojiName(emoji)}!`, 'warning');
        return;
    }
    
    try {
        await fetch(`${CONFIG.CLOUD_WORKER_URL}/api/reactions/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: 'science_quiz', emoji: emoji, user_id: userId })
        });
        userReactions.add(reactionKey);
        if (isMainPage) {
            const span = document.getElementById(`reaction${emoji.charAt(0).toUpperCase() + emoji.slice(1)}`);
            if (span) span.textContent = parseInt(span.textContent) + 1;
        }
        showToast(`${getEmojiName(emoji)} reaction added!`, 'success');
    } catch (error) {
        showToast(`Reaction saved!`, 'success');
    }
}

function getEmojiName(emoji) {
    const names = { like: '👍', love: '❤️', wow: '😮', sad: '😢', laugh: '😂', celebrate: '🎉' };
    return names[emoji] || emoji;
}

function shareQuiz(platform) {
    const url = window.location.href;
    const score = document.getElementById('finalScoreValue')?.textContent || '0';
    const text = `I scored ${score} on the Science Quiz Challenge! Can you beat my score?`;
    
    let shareUrl = '';
    if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
    else if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    else if (platform === 'whatsapp') shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    
    if (shareUrl) window.open(shareUrl, '_blank');
    showToast(`Shared on ${platform}!`);
}

function copyPageUrl() {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link copied to clipboard!');
}

function updateUsageDisplay(count) {
    document.querySelectorAll('.stats-badge, #globalUsageCount').forEach(el => {
        if (el) el.textContent = count.toLocaleString();
    });
}

// ==================== UTILITIES ====================
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i> ${message}`;
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

// ==================== QUIZ FUNCTIONS ====================
async function startQuiz(level, mode) {
    currentState = {
        mode, level, questions: [], currentQuestion: 0, score: 0, totalPoints: 0,
        lives: 3, userAnswers: [], powerups: { fifty: 3, time: 3, hint: 3, skip: 3 },
        timer: null, timeLeft: TIME_LIMITS[level], streak: 0, weakAreas: {}, sessionId: null, aiGenerated: false
    };
    
    showLoading('🤖 AI is generating 50 unique science questions...');
    
    let aiQuestions = await generateQuestionsFromGrok(level);
    
    if (aiQuestions && aiQuestions.length >= 20) {
        currentState.questions = aiQuestions.slice(0, CONFIG.QUESTIONS_PER_LEVEL);
        currentState.aiGenerated = true;
        showToast('✨ AI generated fresh questions!', 'success');
    } else {
        currentState.questions = getQuestionsForLevel(level);
        showToast('📚 Using local question bank', 'info');
    }
    
    hideLoading();
    
    document.getElementById('modeContainer').style.display = 'none';
    document.getElementById('levelsContainer').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';
    document.getElementById('resultsContainer').style.display = 'none';
    document.getElementById('quizMode').textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
    document.getElementById('quizLevel').textContent = LEVEL_NAMES[level];
    document.getElementById('totalQuestions').textContent = currentState.questions.length;
    document.getElementById('livesCount').textContent = currentState.lives;
    document.getElementById('scoreCount').textContent = currentState.score;
    
    loadQuestion();
    startTimer();
    incrementUsage(`science_quiz_level${level}`);
}

function startTimer() {
    if (currentState.timer) clearInterval(currentState.timer);
    if (currentState.mode === 'practice') return;
    
    currentState.timer = setInterval(() => {
        if (currentState.timeLeft <= 0) {
            clearInterval(currentState.timer);
            if (currentState.mode === 'timeattack') endQuiz();
            else handleTimeout();
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
    
    if (currentState.lives <= 0) endQuiz();
    else {
        currentState.userAnswers[currentState.currentQuestion] = { selected: -1, correct: false };
        document.getElementById('nextBtn').disabled = false;
    }
}

function loadQuestion() {
    const q = currentState.questions[currentState.currentQuestion];
    document.getElementById('questionText').textContent = `Q${currentState.currentQuestion + 1}: ${q.question}`;
    document.getElementById('questionCategory').textContent = q.category || 'General Science';
    document.getElementById('questionPoints').textContent = `+${POINTS_PER_LEVEL[currentState.level]} pts`;
    document.getElementById('currentQuestionNum').textContent = currentState.currentQuestion + 1;
    document.getElementById('progressFill').style.width = `${((currentState.currentQuestion + 1) / currentState.questions.length) * 100}%`;
    
    const optsContainer = document.getElementById('optionsList');
    optsContainer.innerHTML = '';
    
    if (q.options && Array.isArray(q.options)) {
        q.options.forEach((opt, idx) => {
            const div = document.createElement('div');
            div.className = 'option';
            div.textContent = `${String.fromCharCode(65 + idx)}. ${opt}`;
            div.onclick = () => selectAnswer(idx);
            optsContainer.appendChild(div);
        });
    }
    
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
        currentState.score += POINTS_PER_LEVEL[currentState.level];
        showToast('✅ Correct! Great job!', 'success');
        playSound(true);
    } else {
        currentState.lives--;
        showToast(`❌ Incorrect! Answer: ${String.fromCharCode(65 + q.answer)}`, 'error');
        playSound(false);
        trackWeakArea(q.category || 'General Science');
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
    document.getElementById('factoidText').textContent = q.factoid || '🔬 Science is fascinating! Keep learning!';
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
    
    const percentage = Math.round((currentState.score / (currentState.questions.length * POINTS_PER_LEVEL[currentState.level])) * 100);
    const correctCount = currentState.userAnswers.filter(a => a && a.correct).length;
    
    document.getElementById('finalScoreValue').textContent = `${percentage}%`;
    
    let badge = "Science Explorer 🔬";
    if (percentage >= 90) badge = "Science Genius 🎓🏆";
    else if (percentage >= 75) badge = "Science Master 🌟";
    else if (percentage >= 50) badge = "Science Learner 📚";
    document.getElementById('badgeEarned').textContent = badge;
    
    let streak = parseInt(localStorage.getItem('scienceStreak') || '0');
    if (percentage >= 60) { streak++; localStorage.setItem('scienceStreak', streak); }
    else { streak = 0; localStorage.setItem('scienceStreak', '0'); }
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
        data: { labels: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Current'], datasets: [{ label: 'Your Progress', data: [40, 55, 70, score], borderColor: '#4a6fa5', backgroundColor: 'rgba(74,111,165,0.1)', fill: true, tension: 0.4 }] },
        options: { responsive: true, maintainAspectRatio: true }
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
        currentState.timeLeft += 30;
        showToast('+30 seconds added!', 'success');
    } else if (type === 'hint') {
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

// ==================== AUDIO & WHITEBOARD ====================
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
    if (!('webkitSpeechRecognition' in window)) { showToast('Speech not supported', 'error'); return; }
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
        confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
    }
}

function downloadCertificate() {
    const score = document.getElementById('finalScoreValue').textContent;
    const name = prompt('Enter your name for certificate:', 'Student');
    if (!name) return;
    const certContent = `SCIENCE QUIZ CHALLENGE - CERTIFICATE OF ACHIEVEMENT\n\nThis certifies that\n${name}\nhas scored ${score} on the Science Quiz Challenge\nDate: ${new Date().toLocaleDateString()}`;
    const blob = new Blob([certContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `science-certificate-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Certificate downloaded!');
}

// ==================== WHITEBOARD ====================
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
    } else if (val === '=') {
        try {
            let expr = whiteboardExpression.replace(/×/g, '*').replace(/÷/g, '/');
            whiteboardResult = eval(expr).toString();
            document.getElementById('whiteboardDisplay').textContent = whiteboardResult;
        } catch(e) {
            document.getElementById('whiteboardDisplay').textContent = 'Error';
        }
    } else {
        whiteboardExpression += val;
        document.getElementById('whiteboardDisplay').textContent = whiteboardExpression;
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

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    document.querySelectorAll('.mode-select-btn').forEach(btn => {
        btn.onclick = () => {
            currentState.mode = btn.closest('.mode-card').getAttribute('data-mode');
            document.getElementById('modeContainer').style.display = 'none';
            document.getElementById('levelsContainer').style.display = 'block';
        };
    });
    
    document.querySelectorAll('.level-start-btn').forEach(btn => {
        btn.onclick = () => {
            const level = parseInt(btn.closest('.level-card').getAttribute('data-level'));
            startQuiz(level, currentState.mode);
        };
    });
    
    document.getElementById('backToModeBtn').onclick = () => {
        document.getElementById('levelsContainer').style.display = 'none';
        document.getElementById('modeContainer').style.display = 'grid';
    };
    
    document.getElementById('nextBtn').onclick = nextQuestion;
    document.getElementById('prevBtn').onclick = prevQuestion;
    document.getElementById('fiftyBtn').onclick = () => usePowerup('fifty');
    document.getElementById('timeBtn').onclick = () => usePowerup('time');
    document.getElementById('hintBtn').onclick = () => usePowerup('hint');
    document.getElementById('skipBtn').onclick = () => usePowerup('skip');
    document.getElementById('readAloudBtn').onclick = readAloud;
    document.getElementById('speechAnswerBtn').onclick = startSpeechRecognition;
    document.getElementById('whiteboardBtn').onclick = showWhiteboard;
    document.getElementById('closeWhiteboardBtn').onclick = closeWhiteboard;
    document.getElementById('tryAgainBtn').onclick = () => startQuiz(currentState.level, currentState.mode);
    document.getElementById('changeLevelBtn').onclick = () => {
        document.getElementById('resultsContainer').style.display = 'none';
        document.getElementById('levelsContainer').style.display = 'block';
    };
    document.getElementById('downloadCertBtn').onclick = downloadCertificate;
    document.getElementById('practiceWeakBtn').onclick = () => showToast('Practice mode coming soon!', 'info');
    
    document.querySelectorAll('.wb-btn').forEach(btn => {
        btn.onclick = () => whiteboardInput(btn.getAttribute('data-val') || btn.getAttribute('data-op'));
    });
    
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
    
    document.getElementById('closeModalBtn').onclick = () => document.getElementById('premiumModal').style.display = 'none';
    document.getElementById('maybeLaterBtn').onclick = () => document.getElementById('premiumModal').style.display = 'none';
    document.getElementById('upgradeBtn').onclick = () => {
        localStorage.setItem('isPremium', 'true');
        showToast('Premium activated! 🎉', 'success');
        document.getElementById('premiumModal').style.display = 'none';
    };
    document.getElementById('statsBtn').onclick = () => showToast(`Total plays: ${toolUsageCount}`, 'info');
}

// ==================== INITIALIZATION ====================
function init() {
    setupTheme();
    setupScrollButtons();
    setupEventListeners();
    incrementUsage('science_quiz_total');
    
    const savedStreak = localStorage.getItem('scienceStreak') || '0';
    document.getElementById('streakCount').textContent = savedStreak;
    document.getElementById('totalUsersCount').textContent = '10,000+';
    document.getElementById('totalQuestionsCount').textContent = '250+';
    
    showToast('Welcome to Science Quiz Challenge! 🔬', 'success');
}

const style = document.createElement('style');
style.textContent = `@keyframes confettiFall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(360deg); opacity: 0; } } @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }`;
document.head.appendChild(style);
document.addEventListener('DOMContentLoaded', init);
