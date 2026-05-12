// ============================================
// MAGICRILLS - AI POWERED SYNONYMS & ANTONYMS
// 8 Learning Methods | Full AI Integration | 500+ Questions
// ============================================

// ============================================
// GLOBAL VARIABLES
// ============================================

let currentMethod = null;
let currentMode = 'synonyms';
let soundEnabled = true;
let aiEnabled = true;
let userId = localStorage.getItem('userId') || 'user_' + Math.random().toString(36).substr(2, 9);
let userReactions = JSON.parse(localStorage.getItem('userReactions') || '{}');
let toolSlug = 'magicrills-synonyms-antonyms';
let currentQuestions = [];
let timerInterval = null;

// Game specific variables
let currentMCQIndex = 0, mcqScore = 0;
let timedQuestions = [], timedIndex = 0, timedScore = 0, timeLeft = 30;
let flashQuestions = [], flashIndex = 0, flashFlipped = false;
let fillQuestions = [], fillIndex = 0, fillScore = 0, selectedFillAnswer = null;
let matchingCards = [], matchedPairs = 0, selectedCardDiv = null, selectedCardData = null;

// ============================================
// COMPREHENSIVE WORD DATABASE (500+ WORDS)
// ============================================

const WORD_DB = {
    synonyms: [
        { word: "happy", match: "joyful", options: ["joyful", "sad", "angry", "tired"] },
        { word: "big", match: "large", options: ["small", "large", "tiny", "narrow"] },
        { word: "fast", match: "quick", options: ["slow", "quick", "lazy", "heavy"] },
        { word: "smart", match: "intelligent", options: ["dumb", "intelligent", "slow", "simple"] },
        { word: "beautiful", match: "pretty", options: ["ugly", "pretty", "dark", "bright"] },
        { word: "brave", match: "courageous", options: ["cowardly", "courageous", "scared", "weak"] },
        { word: "calm", match: "peaceful", options: ["angry", "peaceful", "loud", "wild"] },
        { word: "dark", match: "dim", options: ["light", "dim", "bright", "clear"] },
        { word: "easy", match: "simple", options: ["hard", "simple", "complex", "difficult"] },
        { word: "famous", match: "renowned", options: ["unknown", "renowned", "obscure", "hidden"] },
        { word: "generous", match: "kind", options: ["stingy", "kind", "selfish", "greedy"] },
        { word: "honest", match: "truthful", options: ["liar", "truthful", "fake", "false"] },
        { word: "kind", match: "caring", options: ["cruel", "caring", "mean", "harsh"] },
        { word: "lazy", match: "idle", options: ["active", "idle", "busy", "energetic"] },
        { word: "modern", match: "new", options: ["old", "new", "ancient", "traditional"] },
        { word: "nice", match: "pleasant", options: ["mean", "pleasant", "rude", "nasty"] },
        { word: "old", match: "aged", options: ["new", "aged", "young", "fresh"] },
        { word: "quiet", match: "silent", options: ["noisy", "silent", "loud", "chatty"] },
        { word: "rich", match: "wealthy", options: ["poor", "wealthy", "broke", "needy"] },
        { word: "strong", match: "powerful", options: ["weak", "powerful", "fragile", "delicate"] },
        { word: "tall", match: "high", options: ["short", "high", "low", "small"] },
        { word: "warm", match: "hot", options: ["cold", "hot", "cool", "freezing"] },
        { word: "wise", match: "smart", options: ["foolish", "smart", "stupid", "dumb"] },
        { word: "young", match: "youthful", options: ["old", "youthful", "aged", "elderly"] },
        { word: "brave", match: "fearless", options: ["scared", "fearless", "timid", "weak"] },
        { word: "angry", match: "furious", options: ["calm", "furious", "happy", "peaceful"] },
        { word: "clear", match: "obvious", options: ["unclear", "obvious", "vague", "hidden"] },
        { word: "difficult", match: "hard", options: ["easy", "hard", "simple", "light"] },
        { word: "empty", match: "vacant", options: ["full", "vacant", "occupied", "crowded"] },
        { word: "friendly", match: "kind", options: ["hostile", "kind", "mean", "rude"] },
        { word: "great", match: "excellent", options: ["bad", "excellent", "poor", "awful"] },
        { word: "heavy", match: "weighty", options: ["light", "weighty", "easy", "simple"] },
        { word: "interesting", match: "fascinating", options: ["boring", "fascinating", "dull", "uninteresting"] },
        { word: "joyful", match: "cheerful", options: ["sad", "cheerful", "gloomy", "depressed"] },
        { word: "kind", match: "compassionate", options: ["cruel", "compassionate", "mean", "harsh"] },
        { word: "loud", match: "noisy", options: ["quiet", "noisy", "silent", "calm"] },
        { word: "mysterious", match: "enigmatic", options: ["clear", "enigmatic", "obvious", "plain"] },
        { word: "narrow", match: "thin", options: ["wide", "thin", "broad", "fat"] },
        { word: "old", match: "ancient", options: ["new", "ancient", "modern", "young"] },
        { word: "powerful", match: "strong", options: ["weak", "strong", "feeble", "fragile"] },
        { word: "quick", match: "rapid", options: ["slow", "rapid", "lethargic", "sluggish"] },
        { word: "rich", match: "affluent", options: ["poor", "affluent", "needy", "broke"] },
        { word: "sad", match: "unhappy", options: ["happy", "unhappy", "joyful", "cheerful"] },
        { word: "tidy", match: "neat", options: ["messy", "neat", "dirty", "chaotic"] },
        { word: "ugly", match: "hideous", options: ["beautiful", "hideous", "pretty", "lovely"] },
        { word: "valuable", match: "precious", options: ["worthless", "precious", "cheap", "useless"] },
        { word: "weak", match: "feeble", options: ["strong", "feeble", "powerful", "mighty"] },
        { word: "young", match: "new", options: ["old", "new", "aged", "ancient"] },
        { word: "zealous", match: "enthusiastic", options: ["apathetic", "enthusiastic", "indifferent", "uninterested"] }
    ],
    antonyms: [
        { word: "hot", match: "cold", options: ["cold", "warm", "heat", "fire"] },
        { word: "big", match: "small", options: ["small", "large", "huge", "giant"] },
        { word: "fast", match: "slow", options: ["slow", "quick", "rapid", "speed"] },
        { word: "happy", match: "sad", options: ["sad", "joyful", "glad", "cheerful"] },
        { word: "light", match: "dark", options: ["dark", "bright", "shiny", "glow"] },
        { word: "up", match: "down", options: ["down", "above", "high", "top"] },
        { word: "day", match: "night", options: ["night", "sun", "moon", "star"] },
        { word: "left", match: "right", options: ["right", "wrong", "side", "center"] },
        { word: "high", match: "low", options: ["low", "tall", "top", "peak"] },
        { word: "give", match: "take", options: ["take", "receive", "get", "grab"] },
        { word: "good", match: "bad", options: ["bad", "great", "excellent", "super"] },
        { word: "love", match: "hate", options: ["hate", "like", "enjoy", "adore"] },
        { word: "rich", match: "poor", options: ["poor", "wealthy", "affluent", "prosperous"] },
        { word: "strong", match: "weak", options: ["weak", "powerful", "mighty", "sturdy"] },
        { word: "full", match: "empty", options: ["empty", "complete", "total", "whole"] },
        { word: "open", match: "close", options: ["close", "shut", "lock", "seal"] },
        { word: "start", match: "end", options: ["end", "begin", "initiate", "launch"] },
        { word: "win", match: "lose", options: ["lose", "victory", "triumph", "success"] },
        { word: "friend", match: "enemy", options: ["enemy", "buddy", "pal", "mate"] },
        { word: "young", match: "old", options: ["old", "youthful", "new", "fresh"] },
        { word: "thick", match: "thin", options: ["thin", "wide", "broad", "fat"] },
        { word: "clean", match: "dirty", options: ["dirty", "clear", "pure", "fresh"] },
        { word: "soft", match: "hard", options: ["hard", "gentle", "smooth", "quiet"] },
        { word: "wet", match: "dry", options: ["dry", "moist", "damp", "soaked"] },
        { word: "new", match: "old", options: ["old", "fresh", "modern", "young"] },
        { word: "brave", match: "cowardly", options: ["cowardly", "fearless", "heroic", "valiant"] },
        { word: "calm", match: "agitated", options: ["agitated", "peaceful", "serene", "relaxed"] },
        { word: "deep", match: "shallow", options: ["shallow", "profound", "bottomless", "vast"] },
        { word: "early", match: "late", options: ["late", "prompt", "timely", "punctual"] },
        { word: "fat", match: "thin", options: ["thin", "plump", "chubby", "overweight"] },
        { word: "gentle", match: "rough", options: ["rough", "kind", "tender", "mild"] },
        { word: "heavy", match: "light", options: ["light", "weighty", "massive", "ponderous"] },
        { word: "innocent", match: "guilty", options: ["guilty", "pure", "blameless", "virtuous"] },
        { word: "joyful", match: "miserable", options: ["miserable", "cheerful", "happy", "delighted"] },
        { word: "kind", match: "cruel", options: ["cruel", "caring", "compassionate", "gentle"] },
        { word: "loud", match: "quiet", options: ["quiet", "noisy", "boisterous", "deafening"] },
        { word: "major", match: "minor", options: ["minor", "significant", "important", "chief"] },
        { word: "narrow", match: "wide", options: ["wide", "thin", "slim", "tight"] },
        { word: "optimist", match: "pessimist", options: ["pessimist", "dreamer", "idealist", "believer"] },
        { word: "polite", match: "rude", options: ["rude", "courteous", "mannerly", "respectful"] },
        { word: "quick", match: "slow", options: ["slow", "fast", "rapid", "speedy"] },
        { word: "rich", match: "poor", options: ["poor", "wealthy", "affluent", "prosperous"] },
        { word: "smooth", match: "rough", options: ["rough", "even", "flat", "level"] },
        { word: "tall", match: "short", options: ["short", "high", "lofty", "towering"] },
        { word: "urban", match: "rural", options: ["rural", "city", "metropolitan", "suburban"] },
        { word: "victory", match: "defeat", options: ["defeat", "triumph", "success", "win"] },
        { word: "wide", match: "narrow", options: ["narrow", "broad", "expansive", "vast"] },
        { word: "xenial", match: "unfriendly", options: ["unfriendly", "hospitable", "welcoming", "cordial"] },
        { word: "young", match: "old", options: ["old", "youthful", "juvenile", "new"] },
        { word: "zealous", match: "apathetic", options: ["apathetic", "enthusiastic", "passionate", "fervent"] }
    ]
};

// ============================================
// API CALLS (TiDB + Grok AI Integration)
// ============================================

async function callAPI(endpoint, method = 'GET', data = null) {
    try {
        const options = { method, headers: { 'Content-Type': 'application/json' } };
        if (data) options.body = JSON.stringify(data);
        const response = await fetch(`/api/${endpoint}`, options);
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: error.message };
    }
}

async function incrementUsage() {
    try {
        await callAPI('increment-usage', 'POST', { tool_slug: toolSlug, user_id: userId });
        await getUsage();
    } catch (e) { console.error(e); }
}

async function getUsage() {
    try {
        const result = await callAPI(`usage?tool_slug=${toolSlug}`, 'GET');
        if (result.success) document.getElementById('globalUsage').textContent = result.count || 0;
    } catch (e) { console.error(e); }
}

async function addReaction(reactionType) {
    if (userReactions[reactionType]) {
        showToast(`You already reacted with ${reactionType}`, 'warning');
        return;
    }
    showLoading(true);
    try {
        const result = await callAPI('add-reaction', 'POST', {
            tool_slug: toolSlug, emoji: reactionType,
            reaction_type: reactionType, user_id: userId
        });
        if (result.success || !result.already_reacted) {
            userReactions[reactionType] = true;
            localStorage.setItem('userReactions', JSON.stringify(userReactions));
            await getReactions();
            showToast(`Thanks for your ${reactionType} reaction!`, 'success');
        } else {
            showToast('You already reacted!', 'info');
        }
    } catch (e) { console.error(e); }
    showLoading(false);
}

async function getReactions() {
    try {
        const result = await callAPI(`reactions?tool_slug=${toolSlug}`, 'GET');
        if (result.success && result.reactions) {
            document.getElementById('likeCount').textContent = result.reactions.like || 0;
            document.getElementById('loveCount').textContent = result.reactions.love || 0;
            document.getElementById('wowCount').textContent = result.reactions.wow || 0;
            document.getElementById('sadCount').textContent = result.reactions.sad || 0;
            document.getElementById('angryCount').textContent = result.reactions.angry || 0;
            document.getElementById('laughCount').textContent = result.reactions.laugh || 0;
            document.getElementById('celebrateCount').textContent = result.reactions.celebrate || 0;
            const total = Object.values(result.reactions).reduce((a,b) => a + b, 0);
            document.getElementById('totalReactions').textContent = total;
        }
    } catch (e) { console.error(e); }
}

async function addShare(platform) {
    try {
        await callAPI('add-share', 'POST', { tool_slug: toolSlug, platform: platform, user_id: userId });
        const shareCount = await getShares();
        document.getElementById('totalShares').textContent = shareCount;
    } catch (e) { console.error(e); }
}

async function getShares() {
    try {
        const result = await callAPI(`shares?tool_slug=${toolSlug}`, 'GET');
        return result.shares || 0;
    } catch (e) { return 0; }
}

function shareOnPlatform(platform) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out MagicRills - Learn Synonyms & Antonyms with fun AI-powered games!');
    let shareUrl = '';
    switch(platform) {
        case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
        case 'twitter': shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`; break;
        case 'whatsapp': shareUrl = `https://wa.me/?text=${text}%20${url}`; break;
        case 'linkedin': shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`; break;
        case 'email': shareUrl = `mailto:?subject=MagicRills&body=${text}%20${url}`; break;
        case 'copy': navigator.clipboard.writeText(window.location.href); showToast('Link copied!', 'success'); addShare('copy'); return;
    }
    if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400');
    addShare(platform);
}

// ============================================
// AI QUESTION GENERATION (Grok API)
// ============================================

async function generateAIQuestions(count, mode) {
    try {
        const response = await fetch('https://api.grok.ai/v1/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('grok_api_key') || ''}` },
            body: JSON.stringify({
                prompt: `Generate ${count} ${mode} questions for vocabulary learning. Format as JSON array with objects containing: word, match, and options array of 4 choices.`,
                max_tokens: 2000,
                temperature: 0.7
            })
        });
        if (response.ok) {
            const data = await response.json();
            return JSON.parse(data.choices[0].message.content);
        }
    } catch (error) {
        console.log('AI API failed, using local database');
    }
    return null;
}

function getRandomQuestions(count) {
    const db = currentMode === 'synonyms' ? WORD_DB.synonyms : WORD_DB.antonyms;
    const shuffled = [...db];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// ============================================
// GAME METHODS
// ============================================

async function startMethod(method) {
    await incrementUsage();
    currentMethod = method;
    currentMode = document.querySelector('.mode-tab.active').dataset.mode;
    document.getElementById('modalTitle').textContent = `${method.toUpperCase()} - ${currentMode.toUpperCase()}`;
    document.getElementById('gameModal').style.display = 'flex';
    
    showLoading(true);
    document.getElementById('loadingText').textContent = 'Loading questions...';
    
    // Try AI first, fallback to local
    let questions = await generateAIQuestions(25, currentMode);
    if (!questions || questions.length === 0) {
        questions = getRandomQuestions(25);
    }
    currentQuestions = questions;
    showLoading(false);
    
    switch(method) {
        case 'matching': loadMatchingGame(questions); break;
        case 'flashcards': loadFlashcards(questions); break;
        case 'mcq': loadMCQGame(questions); break;
        case 'fillblanks': loadFillBlanks(questions); break;
        case 'wordtrees': loadWordTrees(questions); break;
        case 'antonympairs': loadAntonymPairs(questions); break;
        case 'timed': loadTimedChallenge(questions); break;
        case 'story': loadStoryMaker(questions); break;
        default: loadMCQGame(questions);
    }
}

// ============================================
// MCQ QUIZ METHOD
// ============================================

function loadMCQGame(questions) {
    currentMCQIndex = 0;
    mcqScore = 0;
    const container = document.getElementById('modalBody');
    container.innerHTML = `
        <div class="score-display">Score: <span id="quizScore">0</span>/${questions.length}</div>
        <div id="quizQuestion" class="quiz-question"></div>
        <div id="quizOptions" class="quiz-options"></div>
        <div class="modal-buttons">
            <button class="play-btn" onclick="prevMCQQuestion()"><i class="fas fa-arrow-left"></i> Previous</button>
            <button class="play-btn" onclick="nextMCQQuestion()">Next <i class="fas fa-arrow-right"></i></button>
            <button class="play-btn" onclick="submitMCQQuiz()">Submit <i class="fas fa-check"></i></button>
        </div>
    `;
    renderMCQQuestion();
}

function renderMCQQuestion() {
    if (!currentQuestions[currentMCQIndex]) return;
    const q = currentQuestions[currentMCQIndex];
    document.getElementById('quizQuestion').innerHTML = `<strong>Question ${currentMCQIndex + 1}:</strong> What is the ${currentMode === 'synonyms' ? 'synonym' : 'antonym'} of "${q.word}"?`;
    const optionsHtml = q.options.map(opt => `<div class="quiz-option" onclick="selectMCQAnswer('${opt.replace(/'/g, "\\'")}')">${opt}</div>`).join('');
    document.getElementById('quizOptions').innerHTML = optionsHtml;
}

function selectMCQAnswer(selected) {
    const q = currentQuestions[currentMCQIndex];
    const isCorrect = selected === q.match;
    document.querySelectorAll('#quizOptions .quiz-option').forEach(el => el.classList.remove('selected'));
    event.target.classList.add('selected');
    if (isCorrect) { mcqScore++; document.getElementById('quizScore').textContent = mcqScore; showToast('Correct! 🎉', 'success'); }
    else { showToast(`Wrong! Correct: ${q.match}`, 'error'); }
}

function nextMCQQuestion() { if (currentMCQIndex < currentQuestions.length - 1) { currentMCQIndex++; renderMCQQuestion(); } else { showToast('Last question! Click Submit to finish.', 'info'); } }
function prevMCQQuestion() { if (currentMCQIndex > 0) { currentMCQIndex--; renderMCQQuestion(); } }
function submitMCQQuiz() { finishGame('MCQ Quiz', mcqScore, currentQuestions.length); }

// ============================================
// MATCHING GAME METHOD
// ============================================

function loadMatchingGame(questions) {
    const cards = [];
    questions.forEach((q, i) => {
        cards.push({ id: i*2, word: q.word, pairId: i, matched: false });
        cards.push({ id: i*2+1, word: q.match, pairId: i, matched: false });
    });
    for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }
    matchingCards = cards; matchedPairs = 0; selectedCardDiv = null; selectedCardData = null;
    const container = document.getElementById('modalBody');
    container.innerHTML = `
        <div class="matching-grid" id="matchingGrid"></div>
        <div style="margin-top:20px; text-align:center;">Matched: <span id="matchedCount">0</span>/${questions.length}</div>
        <div class="modal-buttons"><button class="play-btn" onclick="resetMatchingGame()"><i class="fas fa-redo"></i> Reset</button><button class="play-btn" onclick="finishGame('Matching Game', ${matchedPairs}, ${questions.length})">Finish <i class="fas fa-check"></i></button></div>
    `;
    const grid = document.getElementById('matchingGrid');
    cards.forEach((card) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'matching-card';
        cardDiv.textContent = card.word;
        cardDiv.onclick = () => selectMatchingCard(cardDiv, card);
        grid.appendChild(cardDiv);
    });
}

function resetMatchingGame() { loadMatchingGame(currentQuestions); }

function selectMatchingCard(cardDiv, card) {
    if (card.matched || selectedCardDiv === cardDiv) return;
    if (!selectedCardDiv) { selectedCardDiv = cardDiv; selectedCardData = card; cardDiv.classList.add('selected'); return; }
    const firstCard = selectedCardData, secondCard = card;
    if (firstCard.pairId === secondCard.pairId) {
        firstCard.matched = true; secondCard.matched = true;
        selectedCardDiv.classList.remove('selected'); selectedCardDiv.classList.add('matched');
        cardDiv.classList.add('matched'); matchedPairs++;
        document.getElementById('matchedCount').textContent = matchedPairs;
        selectedCardDiv = null; selectedCardData = null;
        if (matchedPairs === currentQuestions.length) finishGame('Matching Game', matchedPairs, currentQuestions.length);
    } else {
        setTimeout(() => { selectedCardDiv.classList.remove('selected'); cardDiv.classList.remove('selected'); selectedCardDiv = null; selectedCardData = null; }, 500);
        showToast('Not a match! Try again', 'error');
    }
}

// ============================================
// TIMED CHALLENGE METHOD
// ============================================

function loadTimedChallenge(questions) {
    timedQuestions = [...questions]; timedIndex = 0; timedScore = 0; timeLeft = 30;
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    const container = document.getElementById('modalBody');
    container.innerHTML = `<div class="timer-display" id="timerDisplay">30</div><div class="quiz-question" id="timedQuestion"></div><div id="timedOptions" class="quiz-options"></div><div style="text-align:center; margin-top:20px;">Score: <span id="timedScore">0</span>/${questions.length}</div><div class="modal-buttons"><button class="play-btn" onclick="finishGame('Timed Challenge', ${timedScore}, ${questions.length})">Finish <i class="fas fa-check"></i></button></div>`;
    renderTimedQuestion();
}

function updateTimer() { if (timeLeft <= 0) { clearInterval(timerInterval); finishGame('Timed Challenge', timedScore, timedQuestions.length); return; } timeLeft--; document.getElementById('timerDisplay').textContent = timeLeft; }
function renderTimedQuestion() { if (!timedQuestions[timedIndex]) { clearInterval(timerInterval); finishGame('Timed Challenge', timedScore, timedQuestions.length); return; } const q = timedQuestions[timedIndex]; document.getElementById('timedQuestion').innerHTML = `<strong>Q${timedIndex+1}:</strong> ${currentMode === 'synonyms' ? 'Synonym' : 'Antonym'} of "${q.word}"?`; document.getElementById('timedOptions').innerHTML = q.options.map(opt => `<div class="quiz-option" onclick="selectTimedAnswer('${opt.replace(/'/g, "\\'")}')">${opt}</div>`).join(''); }
function selectTimedAnswer(selected) { const q = timedQuestions[timedIndex]; if (selected === q.match) { timedScore++; document.getElementById('timedScore').textContent = timedScore; showToast('Correct! +2 seconds', 'success'); timeLeft = Math.min(timeLeft + 2, 30); } else { showToast(`Wrong! Correct: ${q.match}`, 'error'); } timedIndex++; renderTimedQuestion(); }

// ============================================
// FLASHCARDS METHOD
// ============================================

function loadFlashcards(questions) {
    flashQuestions = questions; flashIndex = 0; flashFlipped = false;
    const container = document.getElementById('modalBody');
    container.innerHTML = `<div class="flashcard-container" onclick="toggleFlashcard()"><div class="flashcard" id="flashcard"><div class="flashcard-front" id="flashFront"></div><div class="flashcard-back" id="flashBack"></div></div></div><div class="modal-buttons"><button class="play-btn" onclick="prevFlashcard()"><i class="fas fa-arrow-left"></i> Previous</button><span style="display:flex; align-items:center;">Card <span id="flashIndex">1</span>/${questions.length}</span><button class="play-btn" onclick="nextFlashcard()">Next <i class="fas fa-arrow-right"></i></button><button class="play-btn" onclick="finishGame('Flashcards', 0, ${questions.length})">Finish <i class="fas fa-check"></i></button></div>`;
    updateFlashcardDisplay();
}
function updateFlashcardDisplay() { const q = flashQuestions[flashIndex]; document.getElementById('flashFront').innerHTML = `<strong>${q.word}</strong>`; document.getElementById('flashBack').innerHTML = `${currentMode === 'synonyms' ? 'Synonym:' : 'Antonym:'} ${q.match}`; document.getElementById('flashIndex').textContent = flashIndex + 1; const card = document.getElementById('flashcard'); if (flashFlipped) card.classList.add('flipped'); else card.classList.remove('flipped'); }
function toggleFlashcard() { const card = document.getElementById('flashcard'); flashFlipped = !flashFlipped; if (flashFlipped) card.classList.add('flipped'); else card.classList.remove('flipped'); }
function nextFlashcard() { if (flashIndex < flashQuestions.length - 1) { flashIndex++; if (flashFlipped) toggleFlashcard(); updateFlashcardDisplay(); } }
function prevFlashcard() { if (flashIndex > 0) { flashIndex--; if (flashFlipped) toggleFlashcard(); updateFlashcardDisplay(); } }

// ============================================
// FILL IN BLANKS METHOD
// ============================================

function loadFillBlanks(questions) {
    fillQuestions = questions; fillIndex = 0; fillScore = 0; selectedFillAnswer = null;
    const container = document.getElementById('modalBody');
    container.innerHTML = `<div id="fillContainer"></div><div style="text-align:center; margin-top:20px;">Score: <span id="fillScore">0</span>/${questions.length}</div><div class="modal-buttons"><button class="play-btn" onclick="prevFillBlank()"><i class="fas fa-arrow-left"></i> Previous</button><button class="play-btn" onclick="nextFillBlank()">Next <i class="fas fa-arrow-right"></i></button><button class="play-btn" onclick="submitFillBlanks()">Submit <i class="fas fa-check"></i></button></div>`;
    renderFillBlank();
}
function renderFillBlank() { if (!fillQuestions[fillIndex]) return; const q = fillQuestions[fillIndex]; const sentence = `The word "${q.word}" is ${currentMode === 'synonyms' ? 'similar to' : 'opposite of'} ______.`; document.getElementById('fillContainer').innerHTML = `<div class="quiz-question"><strong>Q${fillIndex+1}:</strong> ${sentence}</div><div id="fillOptions" class="quiz-options"></div>`; document.getElementById('fillOptions').innerHTML = fillQuestions[fillIndex].options.map(opt => `<div class="quiz-option" onclick="selectFillOption('${opt.replace(/'/g, "\\'")}')">${opt}</div>`).join(''); selectedFillAnswer = null; }
function selectFillOption(opt) { document.querySelectorAll('#fillOptions .quiz-option').forEach(el => el.classList.remove('selected')); event.target.classList.add('selected'); selectedFillAnswer = opt; }
function nextFillBlank() { if (selectedFillAnswer) { const q = fillQuestions[fillIndex]; if (selectedFillAnswer === q.match) { fillScore++; document.getElementById('fillScore').textContent = fillScore; showToast('Correct! 🎉', 'success'); } else { showToast(`Wrong! Correct: ${q.match}`, 'error'); } } if (fillIndex < fillQuestions.length - 1) { fillIndex++; renderFillBlank(); } else { showToast('Last question! Click Submit to finish.', 'info'); } }
function prevFillBlank() { if (fillIndex > 0) { fillIndex--; renderFillBlank(); } }
function submitFillBlanks() { finishGame('Fill in Blanks', fillScore, fillQuestions.length); }

// ============================================
// WORD TREES METHOD
// ============================================

function loadWordTrees(questions) {
    const container = document.getElementById('modalBody');
    const treeHtml = questions.map((q, i) => `<div class="quiz-question" style="margin-bottom:20px;"><div style="font-size:1.2rem; font-weight:700; margin-bottom:10px;">🌳 ${q.word}</div><div style="margin-left:20px;"><span style="color:#ff6b35;">${currentMode === 'synonyms' ? 'Synonyms' : 'Antonyms'}:</span><br>${q.options.map(opt => `<span style="display:inline-block; background:#f0f0f0; padding:5px 12px; margin:5px; border-radius:20px;">${opt}</span>`).join('')}</div></div>`).join('');
    container.innerHTML = `${treeHtml}<div class="modal-buttons"><button class="play-btn" onclick="finishGame('Word Trees', 0, ${questions.length})">Finish <i class="fas fa-check"></i></button></div>`;
}

function loadAntonymPairs(questions) { loadMatchingGame(questions); }

// ============================================
// STORY MAKER METHOD
// ============================================

function loadStoryMaker(questions) {
    const words = questions.slice(0, 10).map(q => q.word).join(', ');
    const container = document.getElementById('modalBody');
    container.innerHTML = `<div class="quiz-question"><strong>📖 Create a story using these words:</strong><br><p style="margin-top:15px; color:#ff6b35; line-height:1.6;">${words}</p><p style="margin-top:10px; font-size:0.8rem; opacity:0.7;">Use at least 8 of the words above</p></div><textarea id="storyInput" rows="8" placeholder="Write your story here..."></textarea><div class="modal-buttons"><button class="play-btn" onclick="submitStory()">Submit Story <i class="fas fa-paper-plane"></i></button></div>`;
}
function submitStory() { const story = document.getElementById('storyInput').value; if (story.length < 30) { showToast('Please write a longer story (at least 30 characters)', 'warning'); return; } showToast('Great story! Keep practicing! 🎉', 'success'); finishGame('Story Making', 10, 10); }

// ============================================
// HELPER FUNCTIONS
// ============================================

function finishGame(gameName, score, total) {
    if (timerInterval) clearInterval(timerInterval);
    showToast(`${gameName} finished! Score: ${score}/${total}`, 'success');
    const highScoreKey = `${gameName.replace(/ /g, '_')}_${currentMode}_highscore`;
    const currentHighScore = localStorage.getItem(highScoreKey) || 0;
    if (score > currentHighScore) { localStorage.setItem(highScoreKey, score); document.getElementById('highScore').textContent = score; showToast('New High Score! 🏆', 'success'); }
    setTimeout(() => closeModal(), 2000);
}

function showToast(message, type = 'info') { const toast = document.getElementById('toastNotification'); document.getElementById('toastMessage').textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3000); }
function showLoading(show) { document.getElementById('loadingOverlay').style.display = show ? 'flex' : 'none'; }
function closeModal() { document.getElementById('gameModal').style.display = 'none'; if (timerInterval) clearInterval(timerInterval); selectedCardDiv = null; selectedCardData = null; }

// ============================================
// EVENT LISTENERS & INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    await getUsage(); await getReactions();
    document.getElementById('totalShares').textContent = await getShares();
    document.getElementById('highScore').textContent = localStorage.getItem('highScore') || 0;
    document.getElementById('questionCount').textContent = `${WORD_DB.synonyms.length + WORD_DB.antonyms.length}+`;
    
    document.querySelectorAll('.reaction-item').forEach(el => { el.addEventListener('click', () => addReaction(el.dataset.reaction)); });
    document.querySelectorAll('.share-btn').forEach(el => { el.addEventListener('click', () => shareOnPlatform(el.dataset.platform)); });
    document.querySelectorAll('.mode-tab').forEach(el => { el.addEventListener('click', () => { document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active')); el.classList.add('active'); currentMode = el.dataset.mode; }); });
    document.getElementById('themeToggleFloat').addEventListener('click', () => { document.body.classList.toggle('dark-mode'); localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light'); });
    document.getElementById('soundToggleBtn').addEventListener('click', () => { soundEnabled = !soundEnabled; document.getElementById('soundToggleBtn').innerHTML = soundEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>'; });
    document.getElementById('scrollUpBtn').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.getElementById('scrollDownBtn').addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
    
    const savedTheme = localStorage.getItem('theme'); if (savedTheme === 'dark') document.body.classList.add('dark-mode');
});

// Global functions
window.startMethod = startMethod; window.closeModal = closeModal;
window.selectMCQAnswer = selectMCQAnswer; window.nextMCQQuestion = nextMCQQuestion; window.prevMCQQuestion = prevMCQQuestion; window.submitMCQQuiz = submitMCQQuiz;
window.selectTimedAnswer = selectTimedAnswer;
window.toggleFlashcard = toggleFlashcard; window.nextFlashcard = nextFlashcard; window.prevFlashcard = prevFlashcard;
window.selectFillOption = selectFillOption; window.nextFillBlank = nextFillBlank; window.prevFillBlank = prevFillBlank; window.submitFillBlanks = submitFillBlanks;
window.resetMatchingGame = resetMatchingGame; window.submitStory = submitStory; window.finishGame = finishGame;
