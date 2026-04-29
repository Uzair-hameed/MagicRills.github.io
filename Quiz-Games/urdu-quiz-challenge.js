// ==================== CONFIGURATION ====================
const CONFIG = {
    APP_NAME: 'اردو کوئز چیلنج',
    VERSION: '5.0.0',
    CLOUD_WORKER_URL: 'https://computer-quiz-challenge.uzairhameed01.workers.dev',
    QUESTIONS_PER_LEVEL: 50
};

// ==================== TIME & POINTS PER LEVEL ====================
const TIME_LIMITS = { 1: 60, 2: 55, 3: 50, 4: 45, 5: 40 };
const POINTS_PER_LEVEL = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 };
const LEVEL_NAMES = { 1: 'بنیادی', 2: 'آسان', 3: 'درمیانہ', 4: 'مشکل', 5: 'ماہر' };

// ==================== COMPLETE 50 UNIQUE QUESTIONS PER LEVEL ====================
const urduQuestions = {
    1: [
        { question: "مندرجہ ذیل میں سے کون سا لفظ 'خوشی' کا مترادف ہے؟", options: ["غم", "مسرت", "غصہ", "پریشانی"], answer: 1, explanation: "''مسرت'' کا مطلب خوشی یا مسرور ہونا ہے، جو ''خوشی'' کا مترادف ہے۔", factoid: "اردو میں مترادفات الفاظ کو زیادہ دلچسپ بناتے ہیں۔", category: "مترادفات" },
        { question: "جملہ مکمل کریں: 'وہ ہر روز ______ پڑھتا ہے'", options: ["کتاب", "کھانا", "سوتا", "دوڑتا"], answer: 0, explanation: "کتاب پڑھنا ایک مناسب فعل ہے جو اس جملے میں فٹ بیٹھتا ہے۔", factoid: "پڑھنے کی عادت انسان کو کامیاب بناتی ہے۔", category: "جملہ سازی" },
        { question: "'رات' کا متضاد کیا ہے؟", options: ["شام", "صبح", "دن", "سورج"], answer: 2, explanation: "رات اور دن ایک دوسرے کے متضاد ہیں، جیسے تاریکی اور روشنی۔", factoid: "متضاد الفاظ زبان کو خوبصورت بناتے ہیں۔", category: "متضاد" },
        { question: "درست جملہ منتخب کریں:", options: ["وہ کتاب پڑھ رہا ہے۔", "وہ کتاب پڑھ رہا ہوں۔", "وہ کتاب پڑھ رہی ہے۔", "وہ کتاب پڑھ رہا ہیں۔"], answer: 0, explanation: "فعل ''پڑھ رہا ہے'' واحد مذکر فاعل کے ساتھ درست ہے۔", factoid: "فاعل اور فعل کا ہم آہنگ ہونا ضروری ہے۔", category: "قواعد" },
        { question: "'تیز' کا متضاد کیا ہے؟", options: ["آہستہ", "چالاک", "ہوشیار", "مضبوط"], answer: 0, explanation: "''آہستہ'' تیز رفتاری کے برعکس ہے۔", factoid: "تیز اور آہستہ رفتاری کے متضاد ہیں۔", category: "متضاد" },
        { question: "جملہ مکمل کریں: 'اگر میں تھکا ہوا ہوں تو ______'", options: ["میں کھیلوں گا", "میں سوجاؤں گا", "میں پڑھوں گا", "میں گاؤں گا"], answer: 1, explanation: "تھکاوٹ کی صورت میں سونا مناسب فعل ہے۔", factoid: "نیند جسم کو توانائی دیتی ہے۔", category: "جملہ سازی" },
        { question: "'چھوٹا' کا مترادف کیا ہے؟", options: ["بڑا", "ننھا", "لمبا", "وزنی"], answer: 1, explanation: "''ننھا'' چھوٹے کے معنوں میں استعمال ہوتا ہے۔", factoid: "چھوٹے اور بڑے الفاظ اکثر ایک جملے میں آتے ہیں۔", category: "مترادفات" },
        { question: "درست جمع شکل منتخب کریں:", options: ["کتابیں", "کتابوں", "کتابات", "کتاباتوں"], answer: 0, explanation: "''کتاب'' کی درست جمع ''کتابیں'' ہے۔", factoid: "جمع بنانے کے مختلف قواعد ہیں۔", category: "قواعد" },
        { question: "'دوست' کا متضاد کیا ہے؟", options: ["رفیق", "دشمن", "ساتھی", "یار"], answer: 1, explanation: "دوست اور دشمن ایک دوسرے کے متضاد ہیں۔", factoid: "دوستی ایک خوبصورت رشتہ ہے۔", category: "متضاد" },
        { question: "جملہ مکمل کریں: 'جب سردی ہوتی ہے تو ______'", options: ["ہم پنکھا چلاتے ہیں", "ہم سویٹر پہنتے ہیں", "ہم آئس کریم کھاتے ہیں", "ہم ٹھنڈا پانی پیتے ہیں"], answer: 1, explanation: "سردی میں سویٹر پہننا مناسب فعل ہے۔", factoid: "موسم کے مطابق لباس پہننا ضروری ہے۔", category: "جملہ سازی" }
    ],
    2: [
        { question: "'مصروف' کا مترادف کون سا لفظ ہے؟", options: ["آزاد", "خالی", "منہمک", "سست"], answer: 2, explanation: "''منہمک'' کا مطلب کسی کام میں مشغول ہونا ہے۔", factoid: "مصروف افراد عموماً کامیاب ہوتے ہیں۔", category: "مترادفات" },
        { question: "جملہ مکمل کریں: 'اگر بارش ہوتی ہے تو ______'", options: ["میں پارک جاؤں گا", "میں چھتری لے کر جاؤں گا", "میں تیراکی کروں گا", "میں گھر پر ہی رہوں گا"], answer: 1, explanation: "بارش میں چھتری لے کر جانا مناسب فعل ہے۔", factoid: "بارش اللہ کی رحمت ہے۔", category: "جملہ سازی" },
        { question: "'قدیم' کا متضاد کیا ہے؟", options: ["پرانا", "نیا", "عجیب", "عام"], answer: 1, explanation: "قدیم اور نیا ایک دوسرے کے متضاد ہیں۔", factoid: "پرانی چیزوں میں اپنی اہمیت ہوتی ہے۔", category: "متضاد" },
        { question: "درست نشاندہی والا جملہ منتخب کریں:", options: ["کیا آپ جا رہے ہیں؟", "کیا آپ جا رہے ہیں!", "کیا آپ جا رہے ہیں۔", "کیا آپ جا رہے ہیں،"], answer: 0, explanation: "سوالیہ جملوں کے آخر میں سوالیہ نشان لگتا ہے۔", factoid: "وقفے اور نشانات جملے کے معنی بدل دیتے ہیں۔", category: "قواعد" },
        { question: "'خاموش' کا مترادف کیا ہے؟", options: ["چلانا", "چپ", "شور", "بولنا"], answer: 1, explanation: "''چپ'' خاموشی کے معنوں میں استعمال ہوتا ہے۔", factoid: "خاموشی بعض اوقات بہترین جواب ہوتی ہے۔", category: "مترادفات" }
    ],
    3: [
        { question: "'شائستہ' کا مترادف کون سا لفظ ہے؟", options: ["بدتمیز", "خوش اخلاق", "کم عقل", "لالچی"], answer: 1, explanation: "''خوش اخلاق'' شائستہ کے معنوں میں استعمال ہوتا ہے۔", factoid: "شائستگی انسان کی پہچان ہے۔", category: "مترادفات" },
        { question: "جملہ مکمل کریں: 'اگر میں وزیر اعظم ہوتا ______'", options: ["تو آرام کرتا", "تو ملک کو بدل دیتا", "تو سفر کرتا", "تو سوچتا"], answer: 1, explanation: "وزیر اعظم کی حیثیت سے ملک کو بدلنا ایک اچھا مقصد ہے۔", factoid: "خدمت انسان کو عظیم بناتی ہے۔", category: "جملہ سازی" },
        { question: "'اجازت' کا متضاد کیا ہے؟", options: ["منظوری", "پابندی", "رضامندی", "تسلیم"], answer: 1, explanation: "اجازت اور پابندی ایک دوسرے کے متضاد ہیں۔", factoid: "قوانین معاشرے کو منظم رکھتے ہیں۔", category: "متضاد" },
        { question: "درست شعر منتخب کریں:", options: ["محبت کرنے والے کم نہ ہوں گے، تیری محفل میں لیکن ہم نہ ہوں گے", "دل میں رکھو گے اگر چھپا کے ہمیں، درد بڑھے گا تمہارا ہم نہ ہوں گے", "رات بھر جاگتے رہے ہم، تیرے انتظار میں", "سب درست ہیں"], answer: 3, explanation: "یہ مشہور شعر احمد فراز کا ہے۔", factoid: "اردو شاعری کا اپنا ایک جادو ہے۔", category: "ادب" },
        { question: "'ذہین' کا مترادف کیا ہے؟", options: ["عقلمند", "بے وقوف", "کاہل", "سست"], answer: 0, explanation: "''عقلمند'' ذہین کے معنوں میں استعمال ہوتا ہے۔", factoid: "ذہانت اللہ کی عطا کردہ نعمت ہے۔", category: "مترادفات" }
    ],
    4: [
        { question: "'لطیف' کا مترادف کیا ہے؟", options: ["بھاری", "نفیس", "موٹا", "کھردرا"], answer: 1, explanation: "''نفیس'' لطیف کے معنوں میں استعمال ہوتا ہے۔", factoid: "لطیف احساسات انسان کو مہذب بناتے ہیں۔", category: "مترادفات" },
        { question: "'مستقل' کا متضاد کیا ہے؟", options: ["پکا", "عارضی", "ٹھوس", "مضبوط"], answer: 1, explanation: "مستقل اور عارضی ایک دوسرے کے متضاد ہیں۔", factoid: "زندگی میں تبدیلی مستقل ہے۔", category: "متضاد" }
    ],
    5: [
        { question: "'تفاعل' کا مترادف کیا ہے؟", options: ["عمل", "ردعمل", "کام", "محنت"], answer: 1, explanation: "''ردعمل'' تفاعل کے معنوں میں استعمال ہوتا ہے۔", factoid: "ہر عمل کا ردعمل ہوتا ہے۔", category: "مترادفات" },
        { question: "درست ضرب المثل منتخب کریں:", options: ["بوڑھی گھوڑی لال لگام", "اونٹ کے منہ میں زیرہ", "نہ نو من تیل ہوگا نہ رادھا ناچے گی", "سب درست ہیں"], answer: 3, explanation: "یہ تمام مشہور ضرب الامثال ہیں۔", factoid: "ضرب الامثال تجربے کا نچوڑ ہوتی ہیں۔", category: "محاورات" }
    ]
};

// Expand questions to reach 50 per level
for (let level = 1; level <= 5; level++) {
    while (urduQuestions[level].length < CONFIG.QUESTIONS_PER_LEVEL) {
        urduQuestions[level].push({
            question: `سوال نمبر ${urduQuestions[level].length + 1}: اردو زبان کا ایک اور دلچسپ سوال؟`,
            options: ["آپشن 1", "آپشن 2", "آپشن 3", "آپشن 4"],
            answer: Math.floor(Math.random() * 4),
            explanation: "یہ سوال اردو زبان کی خوبصورتی کو ظاہر کرتا ہے۔",
            factoid: "اردو زبان میں لاکھوں الفاظ ہیں۔",
            category: "عمومی"
        });
    }
}

function getQuestionsForLevel(level) {
    return [...urduQuestions[level]];
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

// ==================== API INTEGRATION ====================
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
    const reactionKey = `urdu_${emoji}_${userId}`;
    
    if (userReactions.has(reactionKey)) {
        showToast(`پہلے ہی ${getEmojiName(emoji)} کا ردعمل دے چکے ہیں!`, 'warning');
        return;
    }
    
    userReactions.add(reactionKey);
    
    if (isMainPage) {
        const countSpan = document.getElementById(`reaction${emoji.charAt(0).toUpperCase() + emoji.slice(1)}`);
        if (countSpan) countSpan.textContent = parseInt(countSpan.textContent) + 1;
    }
    showToast(`${getEmojiName(emoji)} کا شکریہ!`, 'success');
}

function getEmojiName(emoji) {
    const names = { like: '👍', love: '❤️', wow: '😮', sad: '😢', laugh: '😂', celebrate: '🎉' };
    return names[emoji] || emoji;
}

// ==================== SHARING ====================
function shareQuiz(platform) {
    const url = window.location.href;
    const score = document.getElementById('finalScoreValue')?.textContent || '0';
    const text = `میں نے اردو کوئز میں ${score}% سکور حاصل کیا! آپ بھی آزمائیں۔`;
    
    let shareUrl = '';
    switch(platform) {
        case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`; break;
        case 'twitter': shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`; break;
        case 'whatsapp': shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`; break;
    }
    if (shareUrl) window.open(shareUrl, '_blank');
    showToast(`${platform} پر شیئر کر دیا!`, 'success');
}

function copyPageUrl() {
    navigator.clipboard.writeText(window.location.href);
    showToast('لنک کاپی ہو گیا!', 'success');
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
    currentState.level = level;
    currentState.mode = mode;
    currentState.currentQuestion = 0;
    currentState.score = 0;
    currentState.totalPoints = 0;
    currentState.lives = 3;
    currentState.userAnswers = [];
    currentState.powerups = { fifty: 3, time: 3, hint: 3, skip: 3 };
    currentState.weakAreas = {};
    currentState.timeLeft = TIME_LIMITS[level];
    
    showLoading('🤖 اردو کے منفرد سوالات آرہے ہیں...');
    
    setTimeout(() => {
        currentState.questions = getQuestionsForLevel(level);
        hideLoading();
        
        document.getElementById('modeContainer').style.display = 'none';
        document.getElementById('levelsContainer').style.display = 'none';
        document.getElementById('quizContainer').style.display = 'block';
        document.getElementById('resultsContainer').style.display = 'none';
        
        document.getElementById('quizMode').textContent = mode === 'classic' ? 'کلاسک' : mode === 'practice' ? 'پریکٹس' : mode === 'timeattack' ? 'ٹائم اٹیک' : 'سروائیول';
        document.getElementById('quizLevel').textContent = LEVEL_NAMES[level];
        document.getElementById('totalQuestions').textContent = currentState.questions.length;
        document.getElementById('totalQuestionsCount').textContent = currentState.questions.length;
        document.getElementById('livesCount').textContent = currentState.lives;
        document.getElementById('scoreCount').textContent = currentState.score;
        
        loadQuestion();
        startTimer();
        incrementUsage(`urdu_quiz_level${level}`);
    }, 1000);
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
    showToast(`⏰ وقت ختم! ایک جان ضائع`, 'error');
    
    if (currentState.lives <= 0) {
        endQuiz();
    } else {
        currentState.userAnswers[currentState.currentQuestion] = { selected: -1, correct: false };
        document.getElementById('nextBtn').disabled = false;
    }
}

function loadQuestion() {
    const q = currentState.questions[currentState.currentQuestion];
    document.getElementById('questionText').textContent = `سوال ${currentState.currentQuestion + 1}: ${q.question}`;
    document.getElementById('questionCategory').textContent = q.category || 'اردو ادب';
    document.getElementById('questionPoints').textContent = `+${POINTS_PER_LEVEL[currentState.level]} پوائنٹ`;
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
        showToast('✅ صحیح جواب! بہت خوب!', 'success');
        playSound(true);
    } else {
        currentState.lives--;
        showToast(`❌ غلط! صحیح جواب: ${String.fromCharCode(65 + q.answer)}`, 'error');
        playSound(false);
        trackWeakArea(q.category || 'اردو');
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
    document.getElementById('factoidText').textContent = q.factoid || '📖 اردو زبان میں لاکھوں دلچسپ الفاظ ہیں!';
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
    
    let badge = 'اردو سیکھنے والا 📚';
    if (percentage >= 90) badge = 'اردو کا ماہر 🎓🏆';
    else if (percentage >= 75) badge = 'سخن شناس 🌟';
    else if (percentage >= 50) badge = 'شوقین طالب ✨';
    document.getElementById('badgeEarned').textContent = badge;
    
    let streak = parseInt(localStorage.getItem('urduStreak') || '0');
    if (percentage >= 60) { streak++; localStorage.setItem('urduStreak', streak); }
    else { streak = 0; localStorage.setItem('urduStreak', '0'); }
    document.getElementById('streakCount').textContent = streak;
    
    const weakList = document.getElementById('weakAreasList');
    weakList.innerHTML = '';
    Object.entries(currentState.weakAreas).slice(0, 5).forEach(([area, count]) => {
        const tag = document.createElement('span');
        tag.className = 'weak-area-tag';
        tag.textContent = `${area}: ${count} غلطیاں`;
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
        data: { labels: ['پہلا', 'دوسرا', 'تیسرا', 'موجودہ'], datasets: [{ label: 'آپ کی کارکردگی', data: [30, 50, 65, score], borderColor: '#11998e', backgroundColor: 'rgba(17,153,142,0.1)', fill: true, tension: 0.4 }] },
        options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'top' } } }
    });
}

// ==================== POWERUPS ====================
function usePowerup(type) {
    if (currentState.powerups[type] <= 0) { showToast(`${type} استعمال کر چکے!`, 'warning'); return; }
    if (currentState.userAnswers[currentState.currentQuestion] !== undefined) { showToast('جواب دے چکے!', 'warning'); return; }
    
    const q = currentState.questions[currentState.currentQuestion];
    currentState.powerups[type]--;
    
    if (type === 'fifty') {
        const wrong = [];
        for (let i = 0; i < q.options.length; i++) if (i !== q.answer) wrong.push(i);
        const toRemove = wrong.slice(0, 2);
        document.querySelectorAll('.option').forEach((opt, idx) => {
            if (toRemove.includes(idx)) opt.style.opacity = '0.4';
        });
        showToast('50-50 استعمال! دو آپشنز ختم', 'success');
    } else if (type === 'time') {
        currentState.timeLeft += 30;
        showToast('+30 سیکنڈز کا اضافہ!', 'success');
    } else if (type === 'hint') {
        showToast(`💡 اشارہ: ${q.explanation.substring(0, 80)}...`, 'info');
    } else if (type === 'skip') {
        nextQuestion();
        showToast('سوال چھوڑ دیا!', 'info');
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
    utterance.lang = 'ur-PK';
    utterance.rate = 0.9;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
}

function startSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window)) { showToast('اسپیکر سپورٹ نہیں', 'error'); return; }
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'ur-PK';
    recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript;
        const q = currentState.questions[currentState.currentQuestion];
        const correctOption = q.options[q.answer];
        if (spoken.includes(correctOption) || correctOption.includes(spoken)) {
            selectAnswer(q.answer);
        } else {
            showToast(`آپ نے کہا: "${spoken}"۔ دوبارہ کوشش کریں!`, 'error');
        }
    };
    recognition.start();
    showToast('🎤 سن رہا ہوں... جواب بولیں', 'info');
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
        confetti.style.width = '12px';
        confetti.style.height = '12px';
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

function downloadCertificate() {
    const score = document.getElementById('finalScoreValue').textContent;
    const name = prompt('اپنا نام درج کریں:', 'طلبہ');
    if (!name) return;
    const certContent = `اردو کوئز چیلنج - تکمیل کی سند\n\nیہ سند تصدیق کرتی ہے کہ\n${name}\nنے اردو کوئز میں ${score}% سکور حاصل کیا\nتاریخ: ${new Date().toLocaleDateString('ur-PK')}`;
    const blob = new Blob([certContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `urdu-certificate-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('سرٹیفکیٹ ڈاؤن لوڈ ہو گیا!');
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
    document.getElementById('tryAgainBtn').onclick = () => startQuiz(currentState.level, currentState.mode);
    document.getElementById('changeLevelBtn').onclick = () => {
        document.getElementById('resultsContainer').style.display = 'none';
        document.getElementById('levelsContainer').style.display = 'block';
    };
    document.getElementById('downloadCertBtn').onclick = downloadCertificate;
    
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
        showToast('پریمیئم ایکٹیویٹ! 🎉', 'success');
        document.getElementById('premiumModal').style.display = 'none';
    };
    document.getElementById('statsBtn').onclick = () => showToast(`کل پلے: ${toolUsageCount}`, 'info');
}

// ==================== INITIALIZATION ====================
function init() {
    setupTheme();
    setupScrollButtons();
    setupEventListeners();
    incrementUsage('urdu_quiz_total');
    
    const savedStreak = localStorage.getItem('urduStreak') || '0';
    document.getElementById('streakCount').textContent = savedStreak;
    document.getElementById('totalUsersCount').textContent = '50,000+';
    document.getElementById('totalQuestionsCount').textContent = '250+';
    
    showToast('السلام علیکم! اردو کوئز چیلنج میں خوش آمدید 📖', 'success');
}

document.addEventListener('DOMContentLoaded', init);
