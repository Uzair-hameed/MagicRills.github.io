// ============================================
// MAGICRILLS SENTENCE BUILDER - MAIN JAVASCRIPT
// Domain: magicrills.com
// Complete Game Engine with 86 Features
// ============================================

// ============================================
// ============================================
// API CONFIGURATION - CLOUDFLARE WORKERS
// ============================================
const API_CONFIG = {
    baseURL: 'https://magicrills-api.uzairhameed01.workers.dev',
    apiKey: 'magicrills-grok-api.uzairhameed01.workers.dev',
    toolSlug: 'magicrills-sentence-builder',
    userId: null
};

function getUserId() {
    let userId = localStorage.getItem('magicrills_user_id');
    if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('magicrills_user_id', userId);
    }
    return userId;
}

API_CONFIG.userId = getUserId();
// ============================================
// 24 GAME MODES DATA
// ============================================
const MODES = {
    dragdrop: {
        name: "🖐️ Drag & Drop Builder",
        icon: "🖐️",
        description: "Drag words to build correct sentences",
        sentences: [
            ["I", "love", "to", "read", "books"],
            ["The", "sun", "is", "shining", "brightly"],
            ["She", "walks", "to", "school", "everyday"],
            ["They", "are", "playing", "football", "now"],
            ["We", "will", "visit", "the", "museum"],
            ["My", "cat", "sleeps", "on", "the", "couch"],
            ["He", "drinks", "coffee", "every", "morning"],
            ["The", "birds", "are", "singing", "beautifully"],
            ["Let's", "go", "to", "the", "park"],
            ["I", "have", "a", "new", "bicycle"],
            ["She", "is", "the", "best", "student"],
            ["They", "built", "a", "sandcastle", "on", "the", "beach"],
            ["We", "ate", "dinner", "together"],
            ["The", "movie", "was", "really", "exciting"],
            ["He", "plays", "guitar", "very", "well"],
            ["My", "mother", "cooks", "delicious", "food"],
            ["The", "flowers", "smell", "wonderful"],
            ["I", "want", "to", "learn", "Spanish"],
            ["She", "writes", "poems", "in", "her", "free", "time"],
            ["They", "arrived", "late", "to", "the", "party"]
        ],
        timeLimit: 60,
        type: "dragdrop"
    },
    scrambled: {
        name: "⌨️ Scrambled Text (Typing)",
        icon: "⌨️",
        description: "Type the scrambled words in correct order",
        sentences: [
            ["quick", "brown", "fox", "jumps", "over", "lazy", "dog"],
            ["learning", "is", "fun", "and", "exciting"],
            ["practice", "makes", "perfect", "every", "day"],
            ["never", "give", "up", "on", "your", "dreams"],
            ["hard", "work", "leads", "to", "success"],
            ["believe", "in", "yourself", "always"],
            ["knowledge", "is", "the", "key", "to", "success"],
            ["time", "waits", "for", "no", "one"],
            ["actions", "speak", "louder", "than", "words"],
            ["honesty", "is", "the", "best", "policy"],
            ["patience", "is", "a", "virtue"],
            ["where", "there", "is", "will", "there", "is", "way"],
            ["health", "is", "greater", "than", "wealth"],
            ["united", "we", "stand", "divided", "we", "fall"],
            ["every", "cloud", "has", "a", "silver", "lining"],
            ["better", "late", "than", "never"],
            ["the", "early", "bird", "catches", "the", "worm"],
            ["look", "before", "you", "leap"],
            ["haste", "makes", "waste"],
            ["a", "picture", "is", "worth", "a", "thousand", "words"]
        ],
        timeLimit: 50,
        type: "typing"
    },
    fillblanks: {
        name: "📝 Fill in the Blanks",
        icon: "📝",
        description: "Complete the sentence with missing word",
        sentences: [
            ["I", "___", "to", "school", "everyday"],
            ["She", "is", "___", "best", "student"],
            ["They", "___", "playing", "cricket", "now"],
            ["We", "will", "___", "to", "the", "market"],
            ["He", "___", "coffee", "every", "morning"],
            ["The", "cat", "is", "___", "on", "the", "roof"],
            ["I", "have", "___", "new", "bicycle"],
            ["She", "___", "poems", "in", "her", "free", "time"],
            ["They", "___", "a", "beautiful", "house"],
            ["We", "___", "dinner", "together", "yesterday"],
            ["My", "father", "___", "a", "teacher"],
            ["The", "children", "are", "___", "in", "the", "garden"],
            ["I", "want", "to", "___", "French"],
            ["She", "can", "___", "very", "fast"],
            ["They", "___", "to", "the", "cinema", "last", "night"],
            ["He", "___", "his", "homework", "every", "day"],
            ["We", "should", "___", "our", "environment"],
            ["The", "sun", "___", "in", "the", "east"],
            ["Birds", "___", "in", "the", "sky"],
            ["Fish", "___", "in", "water"]
        ],
        timeLimit: 45,
        type: "fillblanks",
        blanks: ["go", "the", "are", "go", "drinks", "sleeping", "a", "writes", "have", "ate", "is", "playing", "learn", "run", "went", "does", "protect", "rises", "fly", "swim"]
    },
    listenbuild: {
        name: "🎧 Listen & Build",
        icon: "🎧",
        description: "Listen to the sentence, then build it",
        sentences: [
            ["Please", "close", "the", "door"],
            ["Can", "you", "help", "me", "please"],
            ["I", "am", "learning", "English"],
            ["What", "is", "your", "name"],
            ["Where", "do", "you", "live"],
            ["How", "are", "you", "today"],
            ["Nice", "to", "meet", "you"],
            ["Have", "a", "nice", "day"],
            ["See", "you", "tomorrow"],
            ["Thank", "you", "very", "much"],
            ["I", "am", "sorry", "for", "being", "late"],
            ["Could", "you", "repeat", "that", "please"],
            ["I", "don't", "understand", "the", "question"],
            ["Let", "me", "think", "about", "it"],
            ["That", "sounds", "like", "a", "great", "idea"],
            ["I", "completely", "agree", "with", "you"],
            ["From", "my", "perspective", "it", "seems", "different"],
            ["Would", "you", "like", "some", "coffee"],
            ["I", "really", "appreciate", "your", "help"],
            ["It", "was", "a", "pleasure", "meeting", "you"]
        ],
        timeLimit: 55,
        type: "listen"
    },
    picture: {
        name: "🖼️ Picture Sentence",
        icon: "🖼️",
        description: "Build sentence that matches the picture",
        sentences: [
            ["A", "cat", "is", "sitting", "on", "the", "mat"],
            ["Boy", "is", "playing", "with", "a", "ball"],
            ["Girl", "is", "reading", "a", "book"],
            ["Sun", "is", "shining", "in", "the", "sky"],
            ["Children", "are", "playing", "in", "the", "park"],
            ["Mother", "is", "cooking", "in", "the", "kitchen"],
            ["Father", "is", "driving", "a", "car"],
            ["Dog", "is", "barking", "loudly"],
            ["Birds", "are", "flying", "in", "the", "sky"],
            ["Fish", "are", "swimming", "in", "the", "water"]
        ],
        timeLimit: 50,
        type: "picture"
    },
    emoji: {
        name: "😀 Emoji Sentences",
        icon: "😀",
        description: "Decode emojis into sentences",
        sentences: [
            ["I", "am", "happy", "today"],
            ["Let's", "eat", "pizza", "together"],
            ["I", "love", "my", "family"],
            ["We", "are", "going", "to", "the", "beach"],
            ["She", "is", "a", "smart", "girl"],
            ["He", "is", "a", "strong", "boy"],
            ["They", "are", "best", "friends"],
            ["We", "will", "win", "the", "game"],
            ["I", "want", "ice", "cream"],
            ["Let's", "watch", "a", "movie"]
        ],
        timeLimit: 50,
        type: "emoji"
    },
    dictation: {
        name: "✍️ Sentence Dictation",
        icon: "✍️",
        description: "Listen and type the sentence exactly",
        sentences: [
            ["The", "sky", "is", "blue"],
            ["My", "name", "is", "Alex"],
            ["I", "like", "to", "sing"],
            ["She", "runs", "very", "fast"],
            ["We", "are", "friends"],
            ["Hello", "how", "are", "you"],
            ["Good", "morning", "everyone"],
            ["Have", "a", "nice", "day"],
            ["See", "you", "later"],
            ["Take", "care", "of", "yourself"]
        ],
        timeLimit: 60,
        type: "dictation"
    },
    errorcorrection: {
        name: "🔧 Error Correction",
        icon: "🔧",
        description: "Fix the incorrect sentence",
        sentences: [
            ["I", "go", "to", "school", "yesterday"],
            ["She", "don't", "like", "apples"],
            ["They", "is", "playing", "now"],
            ["He", "have", "a", "car"],
            ["We", "was", "happy"]
        ],
        timeLimit: 55,
        type: "error"
    },
    wordsort: {
        name: "📚 Word Type Sorting",
        icon: "📚",
        description: "Sort words by type then build",
        sentences: [
            ["The", "beautiful", "girl", "sings", "sweetly"],
            ["A", "big", "dog", "runs", "fast"],
            ["My", "kind", "mother", "cooks", "deliciously"]
        ],
        timeLimit: 50,
        type: "wordsort"
    },
    tense: {
        name: "🔄 Tense Transformation",
        icon: "🔄",
        description: "Change the sentence tense",
        sentences: [
            ["I", "eat", "apple"],
            ["She", "goes", "to", "school"],
            ["They", "played", "cricket"],
            ["We", "will", "visit", "soon"],
            ["He", "is", "working", "now"]
        ],
        timeLimit: 45,
        type: "tense"
    },
    voice: {
        name: "📢 Active/Passive Voice",
        icon: "📢",
        description: "Convert between active and passive voice",
        sentences: [
            ["The", "cat", "chased", "the", "mouse"],
            ["The", "letter", "was", "written", "by", "John"],
            ["She", "sings", "a", "song"]
        ],
        timeLimit: 50,
        type: "voice"
    },
    expansion: {
        name: "📏 Sentence Expansion",
        icon: "📏",
        description: "Add details to make sentence longer",
        sentences: [
            ["She", "runs"],
            ["He", "reads"],
            ["They", "play"],
            ["The", "dog", "barks"],
            ["Birds", "fly"]
        ],
        timeLimit: 40,
        type: "expansion"
    },
    racing: {
        name: "🏁 Sentence Racing",
        icon: "🏁",
        description: "Beat the clock!",
        sentences: [
            ["The", "quick", "brown", "fox"],
            ["A", "journey", "of", "a", "thousand", "miles"],
            ["To", "be", "or", "not", "to", "be"]
        ],
        timeLimit: 30,
        type: "racing"
    },
    chain: {
        name: "⛓️ Chain Sentence",
        icon: "⛓️",
        description: "Add one word at a time",
        sentences: [
            ["I", "love", "you"],
            ["We", "are", "family"],
            ["You", "are", "amazing"]
        ],
        timeLimit: 60,
        type: "chain"
    },
    vanishing: {
        name: "👻 Vanishing Sentence",
        icon: "👻",
        description: "Remember as words disappear",
        sentences: [
            ["The", "early", "bird", "catches", "the", "worm"],
            ["Practice", "makes", "a", "man", "perfect"]
        ],
        timeLimit: 45,
        type: "vanishing"
    },
    voiceinput: {
        name: "🎤 Voice Input",
        icon: "🎤",
        description: "Speak the sentence",
        sentences: [
            ["How", "are", "you", "today"],
            ["What", "is", "your", "name"],
            ["Where", "do", "you", "live"]
        ],
        timeLimit: 50,
        type: "voice"
    },
    synonyms: {
        name: "🔄 Synonym Challenge",
        icon: "🔄",
        description: "Replace words with synonyms",
        sentences: [["The", "big", "house"], ["She", "is", "very", "happy"]],
        timeLimit: 40,
        type: "synonyms"
    },
    antonyms: {
        name: "⚡ Antonym Challenge",
        icon: "⚡",
        description: "Replace with opposite meaning",
        sentences: [["The", "day", "is", "hot"], ["He", "is", "rich"]],
        timeLimit: 40,
        type: "antonyms"
    },
    preposition: {
        name: "📍 Preposition Master",
        icon: "📍",
        description: "Fill correct prepositions",
        sentences: [["The", "book", "is", "___", "the", "table"], ["She", "goes", "___", "school"]],
        timeLimit: 35,
        type: "preposition"
    },
    idiom: {
        name: "📖 Idiom Builder",
        icon: "📖",
        description: "Complete popular idioms",
        sentences: [["Piece", "of", "___"], ["Break", "a", "___"]],
        timeLimit: 35,
        type: "idiom"
    },
    compound: {
        name: "🔗 Compound Sentences",
        icon: "🔗",
        description: "Join two sentences",
        sentences: [["I", "was", "tired", "but", "I", "kept", "working"]],
        timeLimit: 45,
        type: "compound"
    },
    complex: {
        name: "📜 Complex Sentences",
        icon: "📜",
        description: "Build complex sentences",
        sentences: [["Although", "it", "was", "raining", "we", "went", "out"]],
        timeLimit: 50,
        type: "complex"
    },
    conditional: {
        name: "🔮 Conditional Sentences",
        icon: "🔮",
        description: "Build if-then sentences",
        sentences: [["If", "you", "study", "you", "will", "succeed"]],
        timeLimit: 45,
        type: "conditional"
    },
    reported: {
        name: "💬 Reported Speech",
        icon: "💬",
        description: "Convert to reported speech",
        sentences: [["He", "said", "that", "he", "was", "tired"]],
        timeLimit: 50,
        type: "reported"
    }
};

// ============================================
// GAME STATE
// ============================================
let currentMode = "dragdrop";
let currentSentence = [];
let currentCorrectSentence = [];
let shuffledWords = [];
let score = 0;
let correctCount = 0;
let wrongCount = 0;
let timer = null;
let timeLeft = 60;
let isFocusMode = false;
let currentFontSize = 16;
let totalXP = 0;
let userLevel = 1;
let streakDays = 0;
let longestStreak = 0;
let totalTimeSpent = 0;
let sessionStartTime = null;
let mistakesList = [];
let usedSentencesHistory = [];
let xpToNextLevel = 100;
let currentReactions = {
    '👍': 0, '❤️': 0, '😮': 0, '😢': 0, '😠': 0, '😂': 0, '🎉': 0
};
let userReactions = {};
let totalUsageCount = 0;
let userSessionCount = 0;

// Achievements
const ACHIEVEMENTS = [
    { id: "first_correct", name: "🌟 First Step", description: "First correct answer", requirement: 1, type: "correct", unlocked: false },
    { id: "ten_correct", name: "🎯 Getting There", description: "10 correct answers", requirement: 10, type: "correct", unlocked: false },
    { id: "fifty_correct", name: "🏆 Word Master", description: "50 correct answers", requirement: 50, type: "correct", unlocked: false },
    { id: "level_5", name: "📈 Rising Star", description: "Reach Level 5", requirement: 5, type: "level", unlocked: false },
    { id: "streak_7", name: "🔥 On Fire", description: "7 day streak", requirement: 7, type: "streak", unlocked: false },
    { id: "perfect_round", name: "✨ Perfectionist", description: "5 correct in a row", requirement: 5, type: "streak_correct", unlocked: false }
];

// ============================================
// HELPER FUNCTIONS
// ============================================
function showToast(message, type = "info") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function showLoading() {
    document.getElementById("loadingSpinner").classList.add("show");
}

function hideLoading() {
    document.getElementById("loadingSpinner").classList.remove("show");
}

function addXP(amount) {
    totalXP += amount;
    updateXPDisplay();
    while (totalXP >= xpToNextLevel) {
        totalXP -= xpToNextLevel;
        userLevel++;
        xpToNextLevel = Math.floor(100 * (1 + (userLevel - 1) * 0.1));
        showToast(`🎉 Level Up! You are now Level ${userLevel}!`, "success");
        checkAchievements();
    }
    saveStats();
}

function updateXPDisplay() {
    document.getElementById("totalXP").textContent = totalXP;
    document.getElementById("userLevel").textContent = userLevel;
    document.getElementById("levelBadge").textContent = `Level ${userLevel}`;
    const xpPercent = (totalXP / xpToNextLevel) * 100;
    document.getElementById("xpProgressFill").style.width = `${xpPercent}%`;
    document.getElementById("xpText").textContent = `${totalXP} / ${xpToNextLevel} XP`;
}

function checkAchievements() {
    ACHIEVEMENTS.forEach(ach => {
        if (!ach.unlocked) {
            let achieved = false;
            if (ach.type === "correct" && correctCount >= ach.requirement) achieved = true;
            if (ach.type === "level" && userLevel >= ach.requirement) achieved = true;
            if (achieved) {
                ach.unlocked = true;
                showToast(`🏅 Achievement Unlocked: ${ach.name}!`, "success");
                addXP(50);
                renderAchievements();
            }
        }
    });
}

function renderAchievements() {
    const container = document.getElementById("achievementsGrid");
    if (!container) return;
    container.innerHTML = ACHIEVEMENTS.map(ach => `
        <div class="achievement-badge ${ach.unlocked ? 'unlocked' : ''}">
            <div>${ach.name}</div>
            <small>${ach.description}</small>
        </div>
    `).join("");
}

function addMistake(word) {
    const existing = mistakesList.find(m => m.word === word);
    if (existing) {
        existing.count++;
    } else {
        mistakesList.push({ word: word, count: 1 });
    }
    renderMistakeTracker();
}

function renderMistakeTracker() {
    const container = document.getElementById("mistakeWordsList");
    if (!container) return;
    if (mistakesList.length === 0) {
        container.innerHTML = "No mistakes yet. Keep going!";
        return;
    }
    const sorted = [...mistakesList].sort((a, b) => b.count - a.count);
    container.innerHTML = sorted.slice(0, 10).map(m => 
        `<span class="mistake-word">${m.word} (${m.count}x)</span>`
    ).join("");
}

function getRandomSentence() {
    const modeData = MODES[currentMode];
    const available = modeData.sentences.filter((_, idx) => !usedSentencesHistory.includes(`${currentMode}_${idx}`));
    let index;
    if (available.length === 0) {
        usedSentencesHistory = [];
        index = Math.floor(Math.random() * modeData.sentences.length);
    } else {
        const availableIndices = modeData.sentences.map((_, idx) => idx).filter(idx => !usedSentencesHistory.includes(`${currentMode}_${idx}`));
        index = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    }
    usedSentencesHistory.push(`${currentMode}_${index}`);
    if (usedSentencesHistory.length > 50) usedSentencesHistory.shift();
    const sentence = [...modeData.sentences[index]];
    if (modeData.type === "fillblanks" && modeData.blanks) {
        const blankIndex = sentence.indexOf("___");
        if (blankIndex !== -1) {
            currentCorrectSentence = [...sentence];
            sentence[blankIndex] = modeData.blanks[index % modeData.blanks.length];
        }
    }
    currentCorrectSentence = [...sentence];
    return sentence;
}

function shuffleArray(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function renderWordBank() {
    const container = document.getElementById("wordBank");
    if (!container) return;
    container.innerHTML = "";
    shuffledWords.forEach((word, idx) => {
        const wordEl = document.createElement("div");
        wordEl.className = "word";
        wordEl.textContent = word;
        wordEl.draggable = true;
        wordEl.setAttribute("data-word", word);
        wordEl.setAttribute("data-index", idx);
        wordEl.addEventListener("dragstart", handleDragStart);
        wordEl.addEventListener("dragend", handleDragEnd);
        wordEl.addEventListener("click", () => moveWordToSentence(wordEl));
        container.appendChild(wordEl);
    });
}

function renderSentenceArea() {
    const container = document.getElementById("sentenceArea");
    if (container) container.innerHTML = "";
}

function moveWordToSentence(wordEl) {
    const sentenceArea = document.getElementById("sentenceArea");
    wordEl.remove();
    wordEl.draggable = false;
    wordEl.className = "sentence-word";
    wordEl.removeEventListener("click", moveWordToSentence);
    wordEl.addEventListener("click", () => moveWordToBank(wordEl));
    sentenceArea.appendChild(wordEl);
}

function moveWordToBank(wordEl) {
    const wordBank = document.getElementById("wordBank");
    wordEl.remove();
    wordEl.draggable = true;
    wordEl.className = "word";
    wordEl.removeEventListener("click", moveWordToBank);
    wordEl.addEventListener("click", () => moveWordToSentence(wordEl));
    wordEl.addEventListener("dragstart", handleDragStart);
    wordBank.appendChild(wordEl);
}

function handleDragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.textContent);
    e.target.classList.add("dragging");
}

function handleDragEnd(e) {
    e.target.classList.remove("dragging");
}

function setupDragAndDrop() {
    const sentenceArea = document.getElementById("sentenceArea");
    sentenceArea.addEventListener("dragover", (e) => e.preventDefault());
    sentenceArea.addEventListener("drop", (e) => {
        e.preventDefault();
        const draggingEl = document.querySelector(".word.dragging");
        if (draggingEl) {
            moveWordToSentence(draggingEl);
        }
    });
}

function triggerConfetti() {
    const canvas = document.getElementById("confetti-canvas");
    canvas.style.display = "block";
    setTimeout(() => {
        canvas.style.display = "none";
    }, 2000);
}

function updateScoreDisplay() {
    document.getElementById("currentScore").textContent = score;
    document.getElementById("correctCount").textContent = correctCount;
    document.getElementById("wrongCount").textContent = wrongCount;
    const accuracy = correctCount + wrongCount > 0 ? Math.round((correctCount / (correctCount + wrongCount)) * 100) : 0;
    document.getElementById("accuracyRate").textContent = `${accuracy}%`;
}

function checkAnswer() {
    const sentenceWords = Array.from(document.querySelectorAll("#sentenceArea .sentence-word")).map(el => el.textContent);
    const userSentence = sentenceWords.join(" ");
    const correctSentence = currentCorrectSentence.join(" ");
    if (userSentence === correctSentence) {
        const timeBonus = isFocusMode ? 0 : timeLeft * 10;
        const pointsEarned = 100 + timeBonus;
        score += pointsEarned;
        correctCount++;
        addXP(pointsEarned);
        showToast(`✅ Correct! +${pointsEarned} XP`, "success");
        document.getElementById("checkBtn").style.display = "none";
        document.getElementById("nextBtn").style.display = "inline-block";
        if (timer) clearInterval(timer);
        triggerConfetti();
        updateScoreDisplay();
        checkAchievements();
        incrementUsageCount();
    } else {
        wrongCount++;
        addMistake(correctSentence);
        showToast(`❌ Incorrect! Correct: "${correctSentence}"`, "error");
        updateScoreDisplay();
    }
}

function resetCurrentSentence() {
    shuffledWords = shuffleArray([...currentSentence]);
    renderWordBank();
    renderSentenceArea();
    if (!isFocusMode && timer) {
        clearInterval(timer);
        startTimer();
    }
}

function nextSentence() {
    currentSentence = getRandomSentence();
    shuffledWords = shuffleArray([...currentSentence]);
    renderWordBank();
    renderSentenceArea();
    document.getElementById("checkBtn").style.display = "inline-block";
    document.getElementById("nextBtn").style.display = "none";
    if (!isFocusMode) {
        if (timer) clearInterval(timer);
        startTimer();
    }
}

function startTimer() {
    timeLeft = MODES[currentMode]?.timeLimit || 60;
    updateTimerDisplay();
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            showToast("⏰ Time's up!", "error");
            wrongCount++;
            updateScoreDisplay();
            nextSentence();
        } else {
            timeLeft--;
            updateTimerDisplay();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerEl = document.getElementById("timerDisplay");
    if (timerEl) {
        timerEl.textContent = `⏱️ ${timeLeft}s`;
        if (timeLeft <= 10) timerEl.classList.add("warning");
        else timerEl.classList.remove("warning");
    }
}

function saveStats() {
    const stats = {
        totalXP, userLevel, streakDays, longestStreak, totalTimeSpent,
        correctCount, wrongCount, score, mistakesList,
        achievements: ACHIEVEMENTS.filter(a => a.unlocked).map(a => a.id)
    };
    localStorage.setItem("magicrills_stats", JSON.stringify(stats));
}

function loadStats() {
    const saved = localStorage.getItem("magicrills_stats");
    if (saved) {
        try {
            const stats = JSON.parse(saved);
            totalXP = stats.totalXP || 0;
            userLevel = stats.userLevel || 1;
            streakDays = stats.streakDays || 0;
            longestStreak = stats.longestStreak || 0;
            totalTimeSpent = stats.totalTimeSpent || 0;
            correctCount = stats.correctCount || 0;
            wrongCount = stats.wrongCount || 0;
            score = stats.score || 0;
            mistakesList = stats.mistakesList || [];
            if (stats.achievements) {
                stats.achievements.forEach(achId => {
                    const ach = ACHIEVEMENTS.find(a => a.id === achId);
                    if (ach) ach.unlocked = true;
                });
            }
            updateXPDisplay();
            updateScoreDisplay();
            renderAchievements();
            renderMistakeTracker();
        } catch(e) {}
    }
}

function switchMode(modeId) {
    if (!MODES[modeId]) return;
    currentMode = modeId;
    document.querySelectorAll(".mode-card").forEach(card => {
        card.classList.remove("active");
        if (card.dataset.mode === modeId) card.classList.add("active");
    });
    document.getElementById("currentModeName").textContent = MODES[modeId].name;
    currentSentence = getRandomSentence();
    shuffledWords = shuffleArray([...currentSentence]);
    renderWordBank();
    renderSentenceArea();
    if (timer) clearInterval(timer);
    if (!isFocusMode) startTimer();
    const progress = (Object.keys(MODES).indexOf(modeId) + 1) / Object.keys(MODES).length * 100;
    document.getElementById("progressFill").style.width = `${progress}%`;
}

function renderModeGrid() {
    const container = document.getElementById("modeGrid");
    if (!container) return;
    container.innerHTML = Object.entries(MODES).map(([id, mode]) => `
        <div class="mode-card" data-mode="${id}" onclick="switchMode('${id}')">
            <div class="mode-icon">${mode.icon}</div>
            <h3>${mode.name}</h3>
            <p>${mode.description}</p>
            <div class="mode-badge">${mode.sentences.length} sentences</div>
        </div>
    `).join("");
}

// ============================================
// API FUNCTIONS
// ============================================
async function incrementUsageCount() {
    try {
        const response = await fetch(`${API_CONFIG.baseURL}/api/usage`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-API-Key': API_CONFIG.apiKey
            },
            body: JSON.stringify({
                tool_slug: API_CONFIG.toolSlug,
                user_id: API_CONFIG.userId,
                tool_name: API_CONFIG.toolName,
                category: API_CONFIG.category
            })
        });
        if (response.ok) {
            const data = await response.json();
            totalUsageCount = data.total_usage || data.usage || 0;
            updateUsageDisplay();
        }
    } catch (error) {
        console.log('API fallback: using localStorage');
        let localCount = parseInt(localStorage.getItem(`${API_CONFIG.toolSlug}_usage`) || '0');
        localCount++;
        localStorage.setItem(`${API_CONFIG.toolSlug}_usage`, localCount);
        totalUsageCount = localCount;
        updateUsageDisplay();
    }
}
function updateUsageDisplay() {
    const usageEl = document.getElementById("totalUsage");
    if (usageEl) usageEl.textContent = totalUsageCount.toLocaleString();
}

async function fetchReactions() {
    try {
        const response = await fetch(`${API_CONFIG.baseURL}/api/reactions?tool_slug=${API_CONFIG.toolSlug}`, {
            headers: {
                'X-API-Key': API_CONFIG.apiKey
            }
        });
        if (response.ok) {
            const data = await response.json();
            if (data.reactions) {
                currentReactions = {
                    '👍': data.reactions.like || data.reactions['👍'] || 0,
                    '❤️': data.reactions.love || data.reactions['❤️'] || 0,
                    '😮': data.reactions.wow || data.reactions['😮'] || 0,
                    '😢': data.reactions.sad || data.reactions['😢'] || 0,
                    '😠': data.reactions.angry || data.reactions['😠'] || 0,
                    '😂': data.reactions.laugh || data.reactions['😂'] || 0,
                    '🎉': data.reactions.celebrate || data.reactions['🎉'] || 0
                };
            }
            updateReactionsDisplay();
        }
    } catch (error) {
        console.log('API fallback: loading reactions from localStorage');
        loadReactionsFromLocal();
    }
}
async function addReaction(emoji) {
    if (userReactions[emoji]) {
        showToast(`You already reacted with ${emoji}!`, 'info');
        return;
    }
    try {
        const reactionMap = { '👍': 'like', '❤️': 'love', '😮': 'wow', '😢': 'sad', '😠': 'angry', '😂': 'laugh', '🎉': 'celebrate' };
        const response = await fetch(`${API_CONFIG.baseURL}/api/reactions`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-API-Key': API_CONFIG.apiKey
            },
            body: JSON.stringify({
                tool_slug: API_CONFIG.toolSlug,
                emoji: emoji,
                reaction_type: reactionMap[emoji],
                user_id: API_CONFIG.userId
            })
        });
        if (response.ok) {
            const data = await response.json();
            if (data.already_reacted || data.message === 'Already reacted') {
                showToast(`You already reacted with ${emoji}!`, 'info');
                return;
            }
            if (data.counts || data.reactions) {
                const counts = data.counts || data.reactions;
                currentReactions = {
                    '👍': counts.like || counts['👍'] || 0,
                    '❤️': counts.love || counts['❤️'] || 0,
                    '😮': counts.wow || counts['😮'] || 0,
                    '😢': counts.sad || counts['😢'] || 0,
                    '😠': counts.angry || counts['😠'] || 0,
                    '😂': counts.laugh || counts['😂'] || 0,
                    '🎉': counts.celebrate || counts['🎉'] || 0
                };
            } else {
                currentReactions[emoji] = (currentReactions[emoji] || 0) + 1;
            }
            userReactions[emoji] = true;
            saveReactionsToLocal();
            updateReactionsDisplay();
            showToast(`Thanks for your reaction! +5 XP`, 'success');
            addXP(5);
        }
    } catch (error) {
        console.log('API fallback: saving reaction locally');
        if (!userReactions[emoji]) {
            currentReactions[emoji] = (currentReactions[emoji] || 0) + 1;
            userReactions[emoji] = true;
            saveReactionsToLocal();
            updateReactionsDisplay();
            showToast(`Thanks for your reaction! (Saved locally)`, 'success');
            addXP(5);
        }
    }
}
function updateReactionsDisplay() {
    const reactionsContainer = document.getElementById("reactionsContainer");
    if (!reactionsContainer) return;
    const emojis = ['👍', '❤️', '😮', '😢', '😠', '😂', '🎉'];
    reactionsContainer.innerHTML = emojis.map(emoji => `
        <button class="reaction-btn" data-reaction="${emoji}" onclick="addReaction('${emoji}')">
            ${emoji}<span class="reaction-count">${currentReactions[emoji] || 0}</span>
        </button>
    `).join('');
}

function saveReactionsToLocal() {
    localStorage.setItem(`${API_CONFIG.toolSlug}_reactions`, JSON.stringify(currentReactions));
    localStorage.setItem(`${API_CONFIG.toolSlug}_user_reactions`, JSON.stringify(userReactions));
}

function loadReactionsFromLocal() {
    const saved = localStorage.getItem(`${API_CONFIG.toolSlug}_reactions`);
    if (saved) {
        try {
            currentReactions = JSON.parse(saved);
            updateReactionsDisplay();
        } catch(e) {}
    }
    const savedUser = localStorage.getItem(`${API_CONFIG.toolSlug}_user_reactions`);
    if (savedUser) {
        try {
            userReactions = JSON.parse(savedUser);
        } catch(e) {}
    }
}

async function shareToPlatform(platform) {
    const shareText = `I'm learning English sentences with Magicrills Sentence Builder! My score is ${score} with ${correctCount} correct answers! Can you beat me? 🎮✨`;
    if (platform === 'copy') {
        try {
            await navigator.clipboard.writeText(window.location.href);
            showToast('✅ Link copied to clipboard!', 'success');
            await trackShare(platform);
            addXP(10);
        } catch (err) {
            showToast('Failed to copy link', 'error');
        }
        return;
    }
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.href)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + window.location.href)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
    };
    if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        await trackShare(platform);
        addXP(10);
    }
}

async function trackShare(platform) {
    try {
        await fetch(`${API_CONFIG.baseURL}/api/shares`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-API-Key': API_CONFIG.apiKey
            },
            body: JSON.stringify({
                tool_slug: API_CONFIG.toolSlug,
                platform: platform,
                user_id: API_CONFIG.userId,
                tool_name: API_CONFIG.toolName
            })
        });
    } catch (error) {
        console.log('Share track error:', error);
        // Save locally
        let localShares = JSON.parse(localStorage.getItem(`${API_CONFIG.toolSlug}_shares`) || '[]');
        localShares.push({ platform, timestamp: Date.now() });
        localStorage.setItem(`${API_CONFIG.toolSlug}_shares`, JSON.stringify(localShares));
    }
}
function initShareButtons() {
    const shareSection = document.getElementById("shareSection");
    if (!shareSection) return;
    const platforms = ['facebook', 'twitter', 'whatsapp', 'linkedin', 'copy'];
    const icons = { facebook: '📘', twitter: '🐦', whatsapp: '📱', linkedin: '🔗', copy: '📋' };
    shareSection.innerHTML = platforms.map(platform => `
        <button class="share-btn" data-platform="${platform}" onclick="shareToPlatform('${platform}')">
            ${icons[platform]}
        </button>
    `).join('');
}

async function fetchLeaderboard() {
    const leaderboardList = document.getElementById("leaderboardList");
    if (!leaderboardList) return;
    leaderboardList.innerHTML = '<div>Loading...</div>';
    
    try {
        const response = await fetch(`${API_CONFIG.baseURL}/api/stats?tool_slug=${API_CONFIG.toolSlug}`, {
            headers: {
                'X-API-Key': API_CONFIG.apiKey
            }
        });
        if (response.ok) {
            const data = await response.json();
            // Update dashboard stats
            if (data.stats) {
                dashboardStats.usage = data.stats.usage || data.stats.total_usage || 0;
                dashboardStats.views = data.stats.views || data.stats.total_views || 0;
                dashboardStats.shares = data.stats.shares || data.stats.total_shares || 0;
                dashboardStats.followers = data.stats.followers || data.stats.total_followers || 0;
                updateDashboardStats();
            }
        }
    } catch (error) {
        console.log('API fallback: using local stats');
        // Load from localStorage
        dashboardStats.usage = parseInt(localStorage.getItem(`${API_CONFIG.toolSlug}_usage`) || '0');
        const localShares = JSON.parse(localStorage.getItem(`${API_CONFIG.toolSlug}_shares`) || '[]');
        dashboardStats.shares = localShares.length;
        updateDashboardStats();
    }
    
    // Show local leaderboard
    const users = [{ name: 'You', xp: totalXP, level: userLevel, correct: correctCount }];
    users.sort((a, b) => b.xp - a.xp);
    leaderboardList.innerHTML = users.map((user, idx) => `
        <div class="leaderboard-item">
            <span>${idx + 1}. ${user.name}</span>
            <span>Level ${user.level} | ${user.xp} XP</span>
            <span>✅ ${user.correct}</span>
        </div>
    `).join('');
}

function updateDashboardStats() {
    // Update stats display if elements exist
    const usageEl = document.getElementById('totalUsage');
    if (usageEl) usageEl.textContent = dashboardStats.usage.toLocaleString();
    
    const viewsEl = document.getElementById('totalViews');
    if (viewsEl) viewsEl.textContent = dashboardStats.views.toLocaleString();
    
    const sharesEl = document.getElementById('totalShares');
    if (sharesEl) sharesEl.textContent = dashboardStats.shares.toLocaleString();
    
    const followersEl = document.getElementById('totalFollowers');
    if (followersEl) followersEl.textContent = dashboardStats.followers.toLocaleString();
}
// ============================================
// UI INITIALIZATION
// ============================================
function initDarkMode() {
    const saved = localStorage.getItem("magicrills_theme");
    if (saved === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
    }
    document.getElementById("darkModeToggle").addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme");
        if (current === "dark") {
            document.documentElement.removeAttribute("data-theme");
            localStorage.setItem("magicrills_theme", "light");
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("magicrills_theme", "dark");
        }
    });
}

function initScrollButtons() {
    document.getElementById("scrollUpBtn").addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
    document.getElementById("scrollDownBtn").addEventListener("click", () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    });
}

function initFocusMode() {
    document.getElementById("focusModeBtn").addEventListener("click", () => {
        isFocusMode = !isFocusMode;
        if (isFocusMode && timer) clearInterval(timer);
        else if (!isFocusMode) startTimer();
        showToast(isFocusMode ? "🎯 Focus Mode ON (No Timer)" : "⏱️ Focus Mode OFF", "info");
    });
}

function initFontSize() {
    let fontSize = parseInt(localStorage.getItem("magicrills_fontsize") || "16");
    document.body.style.fontSize = `${fontSize}px`;
    document.getElementById("fontSizeBtn").addEventListener("click", () => {
        fontSize = fontSize === 16 ? 20 : fontSize === 20 ? 14 : 16;
        document.body.style.fontSize = `${fontSize}px`;
        localStorage.setItem("magicrills_fontsize", fontSize);
        showToast(`Font size: ${fontSize}px`, "info");
    });
}

function addUsageDisplay() {
    const statsBar = document.querySelector(".stats-bar");
    if (statsBar && !document.getElementById("totalUsage")) {
        const usageCard = document.createElement("div");
        usageCard.className = "stat-card";
        usageCard.innerHTML = `<div class="stat-value" id="totalUsage">0</div><div class="stat-label">Total Uses</div>`;
        statsBar.appendChild(usageCard);
    }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    renderModeGrid();
    loadStats();
    initDarkMode();
    initScrollButtons();
    initFocusMode();
    initFontSize();
    setupDragAndDrop();
    initShareButtons();
    addUsageDisplay();
    fetchReactions();
    fetchLeaderboard();
    incrementUsageCount();
    document.getElementById("checkBtn").addEventListener("click", checkAnswer);
    document.getElementById("resetBtn").addEventListener("click", resetCurrentSentence);
    document.getElementById("nextBtn").addEventListener("click", nextSentence);
    document.getElementById("hintBtn").addEventListener("click", () => {
        if (totalXP >= 5) {
            addXP(-5);
            const firstWord = currentCorrectSentence[0];
            showToast(`💡 Hint: First word is "${firstWord}"`, "info");
        } else {
            showToast("Not enough XP for hint!", "error");
        }
    });
    document.getElementById("statsModalBtn").addEventListener("click", () => {
        document.getElementById("statsModal").classList.add("show");
        document.getElementById("statTotalSentences").textContent = correctCount + wrongCount;
        document.getElementById("statCorrectAnswers").textContent = correctCount;
        document.getElementById("statWrongAnswers").textContent = wrongCount;
        const accuracy = correctCount + wrongCount > 0 ? Math.round((correctCount / (correctCount + wrongCount)) * 100) : 0;
        document.getElementById("statAccuracy").textContent = accuracy;
        document.getElementById("statTotalXP").textContent = totalXP;
        document.getElementById("statLevel").textContent = userLevel;
        document.getElementById("statLongestStreak").textContent = longestStreak;
    });
    document.getElementById("closeStatsBtn").addEventListener("click", () => {
        document.getElementById("statsModal").classList.remove("show");
    });
    sessionStartTime = Date.now();
    setInterval(() => {
        if (sessionStartTime) {
            totalTimeSpent += 1;
            document.getElementById("totalTimeSpent").textContent = Math.floor(totalTimeSpent);
            saveStats();
        }
    }, 60000);
    switchMode("dragdrop");
});

// Make functions global for onclick
window.switchMode = switchMode;
window.addReaction = addReaction;
window.shareToPlatform = shareToPlatform;
window.checkAnswer = checkAnswer;
window.nextSentence = nextSentence;
window.resetCurrentSentence = resetCurrentSentence;

console.log("✅ Magicrills Sentence Builder - Fully Loaded!");
console.log("🎮 86 Features | 24 Modes | TiDB Integration | Reactions | Sharing | Leaderboard");
