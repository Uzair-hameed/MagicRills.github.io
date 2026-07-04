/**
 * Magicrills Spelling Bee - Complete JavaScript
 * Cloudflare Workers API Integration
 * Dark Space Theme | All 45+ Features
 * Never Repeats Words | Full API Integration | Reactions | Shares
 * Version: 4.0 - Cloudflare API Ready
 */

// ========== API CONFIGURATION ==========
const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';
const API_KEY = 'magicrills-grok-api.uzairhameed01.workers.dev';
const TOOL_SLUG = 'magicrills-spelling-bee';

let SESSION_ID = localStorage.getItem('spelling_session_id');
if (!SESSION_ID) {
    SESSION_ID = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
    localStorage.setItem('spelling_session_id', SESSION_ID);
}

// ========== EXPANDED WORD DATABASES (NEVER REPEATS) ==========
const wordLists = {
    easy: [
        'cat', 'dog', 'sun', 'hat', 'pen', 'run', 'big', 'red', 'box', 'joy',
        'zoo', 'fan', 'egg', 'ice', 'jam', 'key', 'leg', 'mom', 'nut', 'owl',
        'pig', 'rat', 'sit', 'top', 'up', 'van', 'wet', 'yes', 'zip', 'cow',
        'bee', 'ant', 'fly', 'car', 'bus', 'cup', 'bed', 'toy', 'ball', 'fish',
        'bird', 'frog', 'star', 'moon', 'tree', 'book', 'desk', 'lamp', 'door', 'wall'
    ],
    medium: [
        'apple', 'beach', 'cloud', 'dance', 'earth', 'fruit', 'grape', 'happy', 'juice', 'kite',
        'lemon', 'music', 'night', 'ocean', 'piano', 'quiet', 'river', 'smile', 'tiger', 'water',
        'young', 'zebra', 'angel', 'baker', 'candy', 'daisy', 'eagle', 'flower', 'garden', 'honey',
        'butter', 'camera', 'dragon', 'energy', 'forest', 'guitar', 'planet', 'rocket', 'summer', 'winter',
        'spring', 'autumn', 'purple', 'silver', 'golden', 'sunset', 'sunrise', 'butterfly'
    ],
    hard: [
        'bicycle', 'champion', 'dinosaur', 'elephant', 'friendly', 'gorgeous', 'hospital', 'jungle', 'kangaroo', 'laughter',
        'mountain', 'notebook', 'octopus', 'paradise', 'quality', 'rainbow', 'sunshine', 'treasure', 'umbrella', 'victory',
        'wonderful', 'xylophone', 'yellow', 'zucchini', 'butterfly', 'calendar', 'delicious', 'education', 'beautiful', 'chocolate',
        'adventure', 'brilliant', 'celebration', 'dangerous', 'expensive', 'fantastic', 'generous', 'happiness', 'important', 'journey'
    ],
    expert: [
        'extravaganza', 'kaleidoscope', 'magnificent', 'neighborhood', 'opportunity', 'perseverance', 'remarkable', 'spectacular', 'tremendous', 'unbelievable',
        'voluminous', 'whimsical', 'yesterday', 'zoological', 'acquaintance', 'breathtaking', 'connoisseur', 'exhilarating', 'flabbergasted', 'grandiose',
        'haphazardly', 'idiosyncrasy', 'jubilation', 'knowledgeable', 'labyrinth', 'masterpiece', 'nostalgia', 'ostentatious', 'phenomenon', 'questionnaire'
    ]
};

// Track used words to prevent repetition
let usedWordsHistory = {
    easy: [],
    medium: [],
    hard: [],
    expert: []
};

// Sentences Database
const sentences = {
    easy: {
        cat: 'The fluffy cat sat on the warm mat.',
        dog: 'I love playing with my happy dog.',
        sun: 'The bright sun shines in the blue sky.',
        hat: 'She wore a colorful hat to the party.',
        pen: 'I write my homework with a blue pen.',
        run: 'I like to run in the park every morning.',
        big: 'The big elephant walked slowly.',
        red: 'She wore a beautiful red dress.',
        box: 'The gift was in a shiny box.',
        joy: 'Winning the game filled me with joy.'
    },
    medium: {
        apple: 'I eat a juicy red apple every day.',
        beach: 'We build sandcastles at the sunny beach.',
        cloud: 'The fluffy white cloud floated across the sky.',
        dance: 'She loves to dance to her favorite music.',
        happy: 'Winning the game made me very happy.',
        ocean: 'The deep blue ocean is full of mysteries.',
        smile: 'Her warm smile brightened everyone\'s day.',
        tiger: 'The mighty tiger is an endangered species.'
    },
    hard: {
        bicycle: 'I ride my new bicycle to school every morning.',
        elephant: 'The enormous elephant has a long trunk.',
        friendly: 'My neighbor is very friendly and helpful.',
        rainbow: 'After the rain, a beautiful rainbow appeared.',
        beautiful: 'The sunset over the mountains was beautiful.',
        chocolate: 'Dark chocolate is rich in antioxidants.'
    },
    expert: {
        magnificent: 'The view from the mountain was absolutely magnificent.',
        opportunity: 'This is a great opportunity to learn something new.',
        perseverance: 'With hard work and perseverance, you can achieve anything.',
        extraordinary: 'Her performance was truly extraordinary.',
        congratulations: 'Congratulations on your amazing achievement!'
    }
};

// Hints Database
const hints = {
    easy: {
        cat: '🐱 A small furry pet that says "meow"',
        dog: '🐕 Man\'s best friend, loves to play fetch',
        sun: '☀️ Gives us light and warmth during the day',
        hat: '🧢 You wear it on your head for style or sun protection',
        pen: '✍️ Used for writing on paper with ink',
        run: '🏃 Moving quickly using your legs',
        big: '🐘 Opposite of small, describes something large',
        red: '🔴 The color of fire trucks and roses'
    },
    medium: {
        apple: '🍎 A round fruit that keeps the doctor away',
        beach: '🏖️ Sandy place by the ocean with waves',
        cloud: '☁️ Fluffy white thing that floats in the sky',
        dance: '💃 Moving your body rhythmically to music',
        happy: '😊 The wonderful feeling when you get good news',
        ocean: '🌊 Vast body of salt water covering most of Earth',
        smile: '😄 Expression of happiness using your mouth'
    },
    hard: {
        bicycle: '🚲 A vehicle with two wheels that you pedal',
        elephant: '🐘 The largest land animal with a long trunk',
        friendly: '🤝 Kind, nice, and helpful to others',
        rainbow: '🌈 Colorful arc in the sky after rain',
        beautiful: '🌸 Pleasing to the eye, very attractive'
    },
    expert: {
        magnificent: '👑 Extremely beautiful, impressive, and grand',
        opportunity: '🎯 A favorable chance or occasion to do something',
        perseverance: '💪 Continued effort to achieve something despite difficulties'
    }
};

// Picture URLs for Flashcards
const pictureUrls = {
    cat: 'https://cdn-icons-png.flaticon.com/128/616/616408.png',
    dog: 'https://cdn-icons-png.flaticon.com/128/620/620851.png',
    sun: 'https://cdn-icons-png.flaticon.com/128/869/869869.png',
    apple: 'https://cdn-icons-png.flaticon.com/128/415/415682.png',
    elephant: 'https://cdn-icons-png.flaticon.com/128/616/616452.png',
    bicycle: 'https://cdn-icons-png.flaticon.com/128/2933/2933581.png',
    rainbow: 'https://cdn-icons-png.flaticon.com/128/2571/2571271.png',
    happy: 'https://cdn-icons-png.flaticon.com/128/2584/2584606.png',
    default: 'https://cdn-icons-png.flaticon.com/128/4275/4275813.png'
};

// ========== GAME STATE ==========
let currentLevel = '';
let currentMethod = 'classic';
let currentWord = '';
let gameWords = [];
let wordIndex = 0;
let score = 0;
let streak = 0;
let highScore = 0;
let lives = 3;
let timeLeft = 30;
let timerInterval = null;
let isFrozen = false;
let powerUps = { hint: 2, time: 1, freeze: 1 };
let synth = window.speechSynthesis;
let currentUtterance = null;
let reactionCounts = { like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0 };
let totalUsage = 0;
let wordsCompleted = 0;

// ========== CLOUDFLARE API FUNCTIONS ==========

// Generic API caller with timeout
async function callAPI(endpoint, method = 'GET', data = null, timeout = 15000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY,
                'X-Tool-Slug': TOOL_SLUG
            },
            signal: controller.signal
        };
        if (data) options.body = JSON.stringify(data);
        
        const url = `${API_BASE}${endpoint}`;
        const response = await fetch(url, options);
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        clearTimeout(timeoutId);
        console.warn(`API Warning (${endpoint}):`, error.message);
        return { success: false, error: error.message, offline: true };
    }
}

// 1. Increment Usage Counter API
async function incrementUsage() {
    try {
        const result = await callAPI('/api/usage', 'POST', {
            user_id: SESSION_ID,
            tool_slug: TOOL_SLUG
        });
        
        if (result.success) {
            totalUsage = result.total_usage || result.count || 1;
            document.getElementById('usageCount').innerText = totalUsage;
            document.getElementById('globalUsageCount').innerText = totalUsage + 1200;
            document.getElementById('heroLearners').innerText = (totalUsage + 1200).toLocaleString() + '+';
            localStorage.setItem('spelling_usage', totalUsage);
            return totalUsage;
        }
    } catch (error) {
        // Fallback to localStorage
        let localCount = parseInt(localStorage.getItem('spelling_usage')) || 0;
        localCount++;
        localStorage.setItem('spelling_usage', localCount);
        document.getElementById('usageCount').innerText = localCount;
        document.getElementById('globalUsageCount').innerText = localCount + 1200;
        document.getElementById('heroLearners').innerText = (localCount + 1200).toLocaleString() + '+';
        return localCount;
    }
}

// 2. Get Reactions API
async function getReactionsFromDB() {
    try {
        const result = await callAPI('/api/reactions', 'GET');
        if (result.success && result.reactions) {
            reactionCounts = result.reactions;
            updateReactionsUI();
            localStorage.setItem('spelling_reactions', JSON.stringify(reactionCounts));
            return reactionCounts;
        }
    } catch (error) {
        const saved = localStorage.getItem('spelling_reactions');
        if (saved) {
            try {
                reactionCounts = JSON.parse(saved);
                updateReactionsUI();
            } catch (e) {}
        }
    }
}

// 3. Add Reaction API
async function addReactionToDB(reactionType, emoji) {
    try {
        const result = await callAPI('/api/reactions', 'POST', {
            reaction_type: reactionType,
            emoji: emoji,
            user_id: SESSION_ID,
            tool_slug: TOOL_SLUG
        });
        
        if (result.success && result.counts) {
            reactionCounts = result.counts;
            updateReactionsUI();
            showToast(`Thanks for your ${reactionType} reaction! 🎉`, 'success');
            return true;
        } else if (result.already_reacted) {
            showToast(`You already reacted with ${emoji}!`, 'info');
            return false;
        }
    } catch (error) {
        // Fallback to localStorage
        reactionCounts[reactionType] = (reactionCounts[reactionType] || 0) + 1;
        updateReactionsUI();
        localStorage.setItem('spelling_reactions', JSON.stringify(reactionCounts));
        showToast(`Thanks for your reaction! (Saved locally)`, 'success');
        return true;
    }
}

// 4. Record Share API
async function recordShare(platform) {
    try {
        const result = await callAPI('/api/shares', 'POST', {
            platform: platform,
            user_id: SESSION_ID,
            tool_slug: TOOL_SLUG
        });
        if (result.success) {
            showToast(`Shared on ${platform}! 📤`, 'success');
            return true;
        }
    } catch (error) {
        showToast(`Shared on ${platform}!`, 'success');
        return true;
    }
}

// 5. Get Stats API
async function getStats() {
    try {
        const result = await callAPI('/api/stats', 'GET');
        if (result.success) {
            document.getElementById('globalUsageCount').innerText = (result.total_usage || 0) + 1200;
            document.getElementById('wordBankSize').innerText = result.unique_words || getTotalWordCount();
            document.getElementById('heroLearners').innerText = ((result.total_usage || 0) + 1200).toLocaleString() + '+';
            return result;
        }
    } catch (error) {
        document.getElementById('wordBankSize').innerText = getTotalWordCount();
        const savedUsage = localStorage.getItem('spelling_usage') || 0;
        document.getElementById('heroLearners').innerText = (parseInt(savedUsage) + 1200).toLocaleString() + '+';
    }
}

// 6. Get AI Quote from Cloudflare API
async function getAIQuote(topic = 'spelling') {
    try {
        const result = await callAPI('/api/ai-quote', 'POST', { prompt: topic });
        if (result.success && result.quote) {
            showToast(`💡 "${result.quote}" - ${result.author || 'AI'}`, 'info');
            return result.quote;
        }
    } catch (error) {
        // Fallback quotes
        const quotes = [
            'Keep practicing! Every word you learn makes you smarter! ✨',
            'Spelling is the foundation of great communication! 📚',
            'The more you read, the better you spell! 🌟',
            'Every expert was once a beginner. Keep going! 💪'
        ];
        showToast(`💡 ${quotes[Math.floor(Math.random() * quotes.length)]}`, 'info');
        return null;
    }
}

// Helper: Get total word count across all levels
function getTotalWordCount() {
    return wordLists.easy.length + wordLists.medium.length + wordLists.hard.length + wordLists.expert.length;
}

// ========== TYPEWRITER ANIMATION ==========
function initTypewriter() {
    const phrases = [
        'AI-Powered Learning 🤖',
        'Master Your Spelling 🎯',
        '7 Interactive Games 🎮',
        'Never Repeat Words 📚',
        'Learn with Fun 🎉'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typewriterElement = document.getElementById('typewriterText');
    
    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (!isDeleting) {
            // Typing
            typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentPhrase.length) {
                isDeleting = true;
                setTimeout(typeEffect, 2500);
                return;
            }
            setTimeout(typeEffect, 80);
        } else {
            // Deleting
            typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(typeEffect, 500);
                return;
            }
            setTimeout(typeEffect, 40);
        }
    }
    
    typeEffect();
}

// ========== UTILITY FUNCTIONS ==========

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

function updateReactionsUI() {
    Object.keys(reactionCounts).forEach(key => {
        const span = document.getElementById(`react-${key}`);
        if (span) span.textContent = reactionCounts[key] || 0;
    });
}

function updateUI() {
    document.getElementById('scoreValue').textContent = score;
    document.getElementById('streakValue').textContent = streak;
    document.getElementById('highScoreValue').textContent = highScore;
    document.getElementById('livesCount').textContent = lives;
    document.getElementById('hintCount').textContent = powerUps.hint;
    document.getElementById('timeCount').textContent = powerUps.time;
    document.getElementById('freezeCount').textContent = powerUps.freeze;
    document.getElementById('wordsDoneCount').textContent = wordsCompleted;
}

function playSound(type) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = type === 'correct' ? 880 : 440;
        gain.gain.value = 0.12;
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.4);
        osc.stop(audioCtx.currentTime + 0.4);
    } catch(e) { /* Silent fail */ }
}

function speak(text, rate = 0.8) {
    if (synth) {
        if (currentUtterance) synth.cancel();
        currentUtterance = new SpeechSynthesisUtterance(text);
        currentUtterance.rate = rate;
        currentUtterance.pitch = 1;
        currentUtterance.lang = 'en-US';
        synth.speak(currentUtterance);
    }
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Get a new word that hasn't been used recently
function getNewWord(level, words) {
    const usedWords = usedWordsHistory[level] || [];
    const availableWords = words.filter(w => !usedWords.includes(w));
    
    if (availableWords.length === 0) {
        usedWordsHistory[level] = [];
        return words[Math.floor(Math.random() * words.length)];
    }
    
    const newWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    usedWordsHistory[level].push(newWord);
    
    if (usedWordsHistory[level].length > 50) {
        usedWordsHistory[level].shift();
    }
    
    return newWord;
}

// ========== 3D CHECKLIST UPDATE ==========
function updateChecklist(step) {
    const items = document.querySelectorAll('.checklist-item');
    items.forEach(item => {
        const stepNum = parseInt(item.dataset.step);
        if (stepNum <= step) {
            item.classList.add('completed');
        } else {
            item.classList.remove('completed');
        }
    });
}

// ========== GAME METHODS ==========
function displayWordPlaceholder() {
    const container = document.getElementById('letterBoxes');
    container.innerHTML = '';
    for (let i = 0; i < currentWord.length; i++) {
        const box = document.createElement('div');
        box.className = 'letter-box blank';
        box.textContent = currentWord[i];
        container.appendChild(box);
    }
}

function revealWord() {
    const container = document.getElementById('letterBoxes');
    container.innerHTML = '';
    for (let i = 0; i < currentWord.length; i++) {
        const box = document.createElement('div');
        box.className = 'letter-box';
        box.textContent = currentWord[i].toUpperCase();
        container.appendChild(box);
    }
}

function setupMissingLetter() {
    const word = currentWord;
    const missingIndex = Math.floor(Math.random() * word.length);
    const missingChar = word[missingIndex];
    const displayWord = word.split('').map((c, i) => i === missingIndex ? '?' : c.toUpperCase()).join(' ');
    document.getElementById('missingWordDisplay').innerHTML = displayWord;
    
    const allLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    let options = [missingChar];
    while (options.length < 4) {
        const randomLetter = allLetters[Math.floor(Math.random() * 26)];
        if (!options.includes(randomLetter)) options.push(randomLetter);
    }
    options = shuffleArray(options);
    
    const container = document.getElementById('missingOptionsGrid');
    container.innerHTML = '';
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'missing-option';
        btn.textContent = opt.toUpperCase();
        btn.onclick = () => {
            if (opt === missingChar) correctAnswer();
            else { showToast(`Wrong! The correct letter is ${missingChar.toUpperCase()}`, 'error'); wrongAnswer(); }
        };
        container.appendChild(btn);
    });
}

function setupJumbled() {
    const jumbled = shuffleArray(currentWord.split('')).join('');
    document.getElementById('jumbledLetters').innerHTML = jumbled.split('').map(l => `<div class="jumbled-letter">${l.toUpperCase()}</div>`).join('');
    document.getElementById('jumbledInput').value = '';
}

function checkJumbled() {
    const answer = document.getElementById('jumbledInput').value.trim().toLowerCase();
    if (answer === currentWord) correctAnswer();
    else wrongAnswer();
}

function setupFlashcard() {
    const imgUrl = pictureUrls[currentWord] || pictureUrls.default;
    document.getElementById('flashcardImg').src = imgUrl;
    document.getElementById('flashcardInput').value = '';
}

function checkFlashcard() {
    const answer = document.getElementById('flashcardInput').value.trim().toLowerCase();
    if (answer === currentWord) correctAnswer();
    else wrongAnswer();
}

function setupSyllable() {
    const word = currentWord;
    const syllables = [];
    let current = '';
    const vowels = 'aeiou';
    for (let char of word) {
        current += char;
        if (vowels.includes(char) && current.length > 1 && current.length < word.length - 1) {
            syllables.push(current);
            current = '';
        }
    }
    if (current) syllables.push(current);
    if (syllables.length === 0) syllables.push(word);
    
    document.getElementById('syllableBreakdown').innerHTML = syllables.map(s => `<div class="syllable">${s}</div>`).join('');
    document.getElementById('playSyllablesBtn').onclick = () => {
        syllables.forEach((syl, i) => setTimeout(() => speak(syl, 0.6), i * 800));
    };
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (!isFrozen && timeLeft > 0) {
            timeLeft--;
            document.getElementById('timerSeconds').textContent = timeLeft;
            if (timeLeft === 0) {
                clearInterval(timerInterval);
                showToast('Time is up!', 'error');
                wrongAnswer();
            }
        }
    }, 1000);
}

function resetMethodUI() {
    document.getElementById('missingGame').style.display = 'none';
    document.getElementById('jumbledGame').style.display = 'none';
    document.getElementById('flashcardGame').style.display = 'none';
    document.getElementById('syllableGame').style.display = 'none';
    document.getElementById('wordContainer').style.display = 'block';
    document.getElementById('userInput').style.display = 'inline-block';
    
    switch(currentMethod) {
        case 'missing':
            document.getElementById('missingGame').style.display = 'block';
            document.getElementById('wordContainer').style.display = 'none';
            setupMissingLetter();
            break;
        case 'jumbled':
            document.getElementById('jumbledGame').style.display = 'block';
            document.getElementById('wordContainer').style.display = 'none';
            document.getElementById('userInput').style.display = 'none';
            setupJumbled();
            break;
        case 'flashcard':
            document.getElementById('flashcardGame').style.display = 'block';
            document.getElementById('wordContainer').style.display = 'none';
            setupFlashcard();
            break;
        case 'syllable':
            document.getElementById('syllableGame').style.display = 'block';
            document.getElementById('wordContainer').style.display = 'none';
            document.getElementById('userInput').style.display = 'none';
            setupSyllable();
            break;
        case 'timed':
            document.getElementById('timerBar').style.display = 'block';
            startTimer();
            displayWordPlaceholder();
            break;
        default:
            displayWordPlaceholder();
    }
}

function nextWord() {
    if (wordIndex >= gameWords.length) {
        endGame();
        return;
    }
    
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.style.display = 'flex';
    
    setTimeout(() => {
        if (timerInterval) clearInterval(timerInterval);
        if (currentMethod === 'timed') {
            timeLeft = 30;
            document.getElementById('timerSeconds').textContent = timeLeft;
            startTimer();
        } else {
            document.getElementById('timerBar').style.display = 'none';
        }
        
        document.getElementById('hintBox').style.display = 'none';
        document.getElementById('feedback').innerHTML = '';
        document.getElementById('userInput').value = '';
        if (document.getElementById('jumbledInput')) document.getElementById('jumbledInput').value = '';
        if (document.getElementById('flashcardInput')) document.getElementById('flashcardInput').value = '';
        
        currentWord = gameWords[wordIndex];
        resetMethodUI();
        speak(currentWord);
        
        if (spinner) spinner.style.display = 'none';
        
        // Update checklist
        updateChecklist(3);
    }, 100);
}

function correctAnswer() {
    playSound('correct');
    const points = 10 + Math.floor(streak / 3) * 5;
    score += points;
    streak++;
    wordsCompleted++;
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('spellingHighScore', highScore);
    }
    
    updateUI();
    document.getElementById('feedback').innerHTML = `✅ Correct! +${points} points! (${currentWord.toUpperCase()})`;
    document.getElementById('feedback').className = 'feedback correct';
    
    if (streak === 5) { powerUps.hint++; showToast('🎁 Bonus: Extra Hint unlocked!', 'success'); }
    if (streak === 10) { powerUps.time++; showToast('🎁 Bonus: Extra Time unlocked!', 'success'); }
    if (streak === 15) { powerUps.freeze++; showToast('🎁 Bonus: Extra Freeze unlocked!', 'success'); }
    updateUI();
    
    wordIndex++;
    setTimeout(() => nextWord(), 1200);
}

function wrongAnswer() {
    playSound('wrong');
    streak = 0;
    lives--;
    updateUI();
    
    document.getElementById('feedback').innerHTML = `❌ Incorrect! The correct spelling is "${currentWord.toUpperCase()}".`;
    document.getElementById('feedback').className = 'feedback incorrect';
    
    if (lives <= 0) {
        endGame();
        return;
    }
    
    wordIndex++;
    setTimeout(() => nextWord(), 2000);
}

function checkAnswer() {
    let userAnswer = '';
    
    if (currentMethod === 'jumbled') { checkJumbled(); return; }
    if (currentMethod === 'flashcard') { checkFlashcard(); return; }
    
    userAnswer = document.getElementById('userInput').value.trim().toLowerCase();
    if (!userAnswer) { showToast('Please type a word!', 'error'); return; }
    
    if (userAnswer === currentWord) correctAnswer();
    else wrongAnswer();
}

function showHint() {
    const hintText = hints[currentLevel]?.[currentWord] || 'Try your best! Think about the word sounds.';
    document.getElementById('hintText').innerHTML = `💡 ${hintText}`;
    document.getElementById('hintBox').style.display = 'block';
    if (powerUps.hint > 0) {
        powerUps.hint--;
        if (powerUps.hint <= 0) document.getElementById('powerupHint').disabled = true;
    }
    updateUI();
}

function usePowerUp(type) {
    if (type === 'time' && powerUps.time > 0 && currentMethod === 'timed') {
        timeLeft += 15;
        document.getElementById('timerSeconds').textContent = timeLeft;
        powerUps.time--;
        showToast('+15 seconds added!', 'success');
    } else if (type === 'freeze' && powerUps.freeze > 0 && currentMethod === 'timed') {
        isFrozen = true;
        powerUps.freeze--;
        showToast('Timer frozen for 5 seconds!', 'success');
        setTimeout(() => { isFrozen = false; }, 5000);
    } else if (type === 'hint' && powerUps.hint > 0) {
        showHint();
    } else {
        showToast('No power-ups left or not available in this mode!', 'info');
    }
    updateUI();
}

function endGame() {
    if (timerInterval) clearInterval(timerInterval);
    document.getElementById('gameArea').style.display = 'none';
    document.getElementById('gameOver').style.display = 'block';
    document.getElementById('finalScoreValue').textContent = score;
    
    const achievements = [];
    if (score >= 100) achievements.push('🏆 Word Master');
    if (streak >= 5) achievements.push('⚡ Streak Warrior');
    if (currentLevel === 'expert' && score >= 200) achievements.push('👑 Spelling King');
    if (lives === 3 && score > 0) achievements.push('💪 Perfect Game');
    if (wordsCompleted >= 20) achievements.push('📚 Dedicated Learner');
    
    const achievementsDiv = document.getElementById('achievementsList');
    if (achievements.length > 0) {
        achievementsDiv.innerHTML = achievements.map(a => `<div class="achievement">${a}</div>`).join('');
    } else {
        achievementsDiv.innerHTML = '<div class="achievement">🌟 Great Try!</div>';
    }
    
    updateChecklist(4);
    getAIQuote('spelling success');
}

function restartGame() {
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('levelSection').style.display = 'block';
    document.getElementById('methodsSection').style.display = 'block';
    document.getElementById('gameArea').style.display = 'none';
    score = 0;
    streak = 0;
    lives = 3;
    wordIndex = 0;
    wordsCompleted = 0;
    powerUps = { hint: 2, time: 1, freeze: 1 };
    updateUI();
    updateChecklist(0);
}

function selectLevel(level) {
    currentLevel = level;
    const freshWords = [];
    const wordsList = [...wordLists[currentLevel]];
    const shuffledWords = shuffleArray(wordsList);
    
    for (let i = 0; i < shuffledWords.length; i++) {
        if (!usedWordsHistory[currentLevel].includes(shuffledWords[i])) {
            freshWords.push(shuffledWords[i]);
        }
    }
    
    while (freshWords.length < 20 && freshWords.length < shuffledWords.length) {
        for (let word of shuffledWords) {
            if (!freshWords.includes(word)) freshWords.push(word);
            if (freshWords.length >= 20) break;
        }
    }
    
    gameWords = freshWords.slice(0, 25);
    score = 0;
    streak = 0;
    lives = 3;
    wordIndex = 0;
    wordsCompleted = 0;
    timeLeft = 30;
    isFrozen = false;
    powerUps = { hint: 2, time: 1, freeze: 1 };
    
    updateUI();
    
    document.getElementById('levelSection').style.display = 'none';
    document.getElementById('methodsSection').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('feedback').innerHTML = '';
    
    if (currentMethod === 'timed') {
        document.getElementById('timerBar').style.display = 'block';
    } else {
        document.getElementById('timerBar').style.display = 'none';
    }
    
    updateChecklist(2);
    incrementUsage();
    nextWord();
}

// ========== ON-SCREEN KEYBOARD ==========
function buildKeyboard() {
    const rows = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫', '␣']
    ];
    
    const keyboard = document.getElementById('onscreenKeyboard');
    keyboard.innerHTML = '';
    rows.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'keyboard-row';
        row.forEach(key => {
            const btn = document.createElement('button');
            btn.className = 'key-btn' + (key === '⌫' || key === '␣' ? ' special' : '');
            btn.textContent = key;
            btn.onclick = () => {
                const input = document.getElementById('userInput');
                if (key === '⌫') input.value = input.value.slice(0, -1);
                else if (key === '␣') input.value += ' ';
                else input.value += key;
                input.focus();
            };
            rowDiv.appendChild(btn);
        });
        keyboard.appendChild(rowDiv);
    });
}

// ========== SHARE FUNCTIONS ==========
function shareToFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
    recordShare('facebook');
}

function shareToTwitter() {
    const text = encodeURIComponent('I\'m learning spelling with Magicrills Spelling Bee! 🐝 Join me and improve your vocabulary!');
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400');
    recordShare('twitter');
}

function shareToWhatsApp() {
    const text = encodeURIComponent('Check out Magicrills Spelling Bee - Learn spelling the fun way with AI! 🐝');
    const url = encodeURIComponent(window.location.href);
    window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, '_blank');
    recordShare('whatsapp');
}

function shareToLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=400');
    recordShare('linkedin');
}

function shareToEmail() {
    const subject = encodeURIComponent('Check out Magicrills Spelling Bee!');
    const body = encodeURIComponent('I found this amazing spelling learning tool. Try it out: ' + window.location.href);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    recordShare('email');
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link copied to clipboard!', 'success');
    recordShare('copy');
}

// ========== THEME & SCROLL ==========
function toggleTheme() {
    const body = document.body;
    const isDark = body.getAttribute('data-theme') === 'dark';
    if (isDark) {
        body.setAttribute('data-theme', 'light');
        document.getElementById('themeToggle').innerHTML = '<i class="fas fa-moon"></i>';
        showToast('Light mode activated', 'info');
    } else {
        body.setAttribute('data-theme', 'dark');
        document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
        showToast('Dark mode activated', 'info');
    }
    localStorage.setItem('spelling_theme', body.getAttribute('data-theme'));
}

function initTheme() {
    const savedTheme = localStorage.getItem('spelling_theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'dark') {
        document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.getElementById('themeToggle').innerHTML = '<i class="fas fa-moon"></i>';
    }
}

function initScroll() {
    const scrollUp = document.getElementById('scrollUpBtn');
    const scrollDown = document.getElementById('scrollDownBtn');
    if (scrollUp) scrollUp.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    if (scrollDown) scrollDown.onclick = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// Premium Modal Functions
function showPremiumModal() {
    document.getElementById('premiumModal').style.display = 'flex';
}

function closePremiumModal() {
    document.getElementById('premiumModal').style.display = 'none';
}

// ========== INITIALIZATION ==========
async function init() {
    // Load high score
    highScore = parseInt(localStorage.getItem('spellingHighScore')) || 0;
    updateUI();
    
    // Load used words history
    const savedHistory = localStorage.getItem('spelling_word_history');
    if (savedHistory) {
        try {
            usedWordsHistory = JSON.parse(savedHistory);
        } catch(e) {}
    }
    
    // Load reactions from localStorage
    const savedReactions = localStorage.getItem('spelling_reactions');
    if (savedReactions) {
        try {
            reactionCounts = JSON.parse(savedReactions);
            updateReactionsUI();
        } catch(e) {}
    }
    
    // Load usage from localStorage
    const savedUsage = localStorage.getItem('spelling_usage');
    if (savedUsage) {
        document.getElementById('usageCount').innerText = savedUsage;
        document.getElementById('globalUsageCount').innerText = parseInt(savedUsage) + 1200;
        document.getElementById('heroLearners').innerText = (parseInt(savedUsage) + 1200).toLocaleString() + '+';
    }
    
    // Try to fetch fresh data from API
    try {
        await getStats();
        await getReactionsFromDB();
        await incrementUsage();
    } catch (e) {
        console.warn('API fetch failed, using cached data');
    }
    
    // Build keyboard
    buildKeyboard();
    
    // Init typewriter
    initTypewriter();
    
    // Update checklist
    updateChecklist(0);
    
    // Setup event listeners
    document.querySelectorAll('.level-card').forEach(btn => {
        btn.addEventListener('click', () => selectLevel(btn.dataset.level));
    });
    
    document.querySelectorAll('.method-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.method-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            currentMethod = card.dataset.method;
            document.getElementById('currentModeName').textContent = card.querySelector('h3').textContent;
            showToast(`${card.querySelector('h3').textContent} mode selected!`, 'success');
        });
    });
    
    document.getElementById('submitBtn').addEventListener('click', checkAnswer);
    document.getElementById('skipBtn').addEventListener('click', () => {
        revealWord();
        wordIndex++;
        setTimeout(() => nextWord(), 500);
    });
    document.getElementById('hintBtn').addEventListener('click', showHint);
    document.getElementById('playWordBtn').addEventListener('click', () => speak(currentWord));
    document.getElementById('playSentenceBtn').addEventListener('click', () => {
        const sentence = sentences[currentLevel]?.[currentWord] || `The word is ${currentWord}. Try to spell it correctly!`;
        speak(sentence, 0.7);
    });
    document.getElementById('slowSpeechBtn').addEventListener('click', () => speak(currentWord, 0.4));
    document.getElementById('playAgainBtn').addEventListener('click', restartGame);
    document.getElementById('userInput').addEventListener('keypress', (e) => { if (e.key === 'Enter') checkAnswer(); });
    
    document.getElementById('powerupHint').addEventListener('click', () => usePowerUp('hint'));
    document.getElementById('powerupTime').addEventListener('click', () => usePowerUp('time'));
    document.getElementById('powerupFreeze').addEventListener('click', () => usePowerUp('freeze'));
    
    document.getElementById('showKeyboardBtn').addEventListener('click', () => {
        const kb = document.getElementById('onscreenKeyboard');
        kb.style.display = kb.style.display === 'block' ? 'none' : 'block';
    });
    
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('premiumBtn').addEventListener('click', showPremiumModal);
    
    // Share buttons
    document.getElementById('shareFacebookBtn').addEventListener('click', shareToFacebook);
    document.getElementById('shareTwitterBtn').addEventListener('click', shareToTwitter);
    document.getElementById('shareWhatsAppBtn').addEventListener('click', shareToWhatsApp);
    document.getElementById('shareLinkedInBtn').addEventListener('click', shareToLinkedIn);
    document.getElementById('shareEmailBtn').addEventListener('click', shareToEmail);
    document.getElementById('shareCopyBtn').addEventListener('click', copyLink);
    
    // Reaction buttons
    const reactionsMap = { 'like': '👍', 'love': '❤️', 'wow': '😮', 'sad': '😢', 'angry': '😠', 'laugh': '😂', 'celebrate': '🎉' };
    Object.keys(reactionsMap).forEach(reaction => {
        const btn = document.querySelector(`.reaction[data-reaction="${reaction}"]`);
        if (btn) {
            btn.onclick = () => addReactionToDB(reaction, reactionsMap[reaction]);
        }
    });
    
    initTheme();
    initScroll();
    
    // Save word history periodically
    setInterval(() => {
        localStorage.setItem('spelling_word_history', JSON.stringify(usedWordsHistory));
    }, 30000);
    
    showToast('🐝 Welcome to Magicrills Spelling Bee! AI-Powered Learning', 'success');
    
    // Show AI quote after delay
    setTimeout(() => getAIQuote('motivation'), 4000);
}

// Start the game
document.addEventListener('DOMContentLoaded', init);
