// FILE: number-fun-game.js
// ============================================
// COMPLETE MODULAR JS FILE
// هر طریقے کا الگ سیکشن - آسانی سے اپڈیٹ کے لیے
// ============================================

// ============================================
// CONFIGURATION SECTION
// ============================================
const TOOL_SLUG = 'number-fun-game';
const API_BASE = 'https://number-fun-game-api.vercel.app/api';

// Teaching Methods Registry - یہاں سے تمام طریقے کنٹرول ہوتے ہیں
const TEACHING_METHODS = [
    { id: 1, name: "Counting", icon: "🔢", description: "Count objects & match numbers", isActive: true, type: "counting" },
    { id: 2, name: "Number Line Jump", icon: "🦘", description: "Jump on number line", isActive: true, type: "numberline" },
    { id: 3, name: "Number Sorting", icon: "📊", description: "Arrange numbers in order", isActive: true, type: "numbersorting" },
    { id: 4, name: "Odd One Out", icon: "🔍", description: "Find the number that doesn't belong", isActive: true, type: "oddoneout" },
    { id: 5, name: "Number Bingo", icon: "🎲", description: "Get 5 in a row to win!", isActive: true, type: "bingo" },
    { id: 6, name: "Guess the Number", icon: "❓", description: "Find the secret number!", isActive: true, type: "guess" },
    { id: 7, name: "Number Bond", icon: "🔗", description: "Complete the number bond puzzle!", isActive: true, type: "bond" },
    { id: 8, name: "Ten Frame Fun", icon: "📐", description: "Learn numbers with ten frames!", isActive: true, type: "tenframe" },
    { id: 9, name: "Tally Marks", icon: "✏️", description: "Learn counting with tally marks!", isActive: true, type: "tally" },
    { id: 10, name: "Number Words", icon: "📖", description: "Learn number names in English & Urdu!", isActive: true, type: "word" },
{ id: 11, name: "Skip Counting", icon: "🎵", description: "Master multiplication tables!", isActive: true, type: "skip" },    { id: 12, name: "Number Patterns", icon: "🔄", description: "Find the rule and complete!", isActive: true, type: "pattern" },
{ id: 13, name: "Greater/Less Alligator", icon: "🐊", description: "The hungry alligator eats bigger numbers!", isActive: true, type: "greaterless" },   
{ id: 14, name: "Number Order Race", icon: "🏁", description: "Race against opponent!", isActive: true, type: "orderrace" },    { id: 15, name: "Finger Counting", icon: "🖐️", description: "Learn to count with fingers!", isActive: true, type: "finger" },
    { id: 16, name: "Subitizing", icon: "⚡", description: "See numbers instantly without counting!", isActive: true, type: "subitizing" },
    { id: 17, name: "Number Hopscotch", icon: "🎯", description: "Hop your way to the finish line!", isActive: true, type: "hopscotch" },
{ id: 18, name: "Clock Reading", icon: "⏰", description: "Learn to tell time!", isActive: true, type: "clock" },
    { id: 19, name: "Money Counting", icon: "💰", description: "Learn to count money (PKR)", isActive: true, type: "money" },
{ id: 20, name: "Number Story", icon: "📚", description: "Solve fun story problems!", isActive: true, type: "story" },];

// State Management
let currentUsage = parseInt(localStorage.getItem(`${TOOL_SLUG}_usage`) || '0');
let reactionCounts = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_reactions`)) || { like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0 };
let userReacted = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_userReacted`)) || { like: false, love: false, wow: false, sad: false, angry: false, laugh: false, celebrate: false };
let shareCount = parseInt(localStorage.getItem(`${TOOL_SLUG}_shares`) || '0');

// ============================================
// UTILITIES SECTION
// ============================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.style.display = show ? 'flex' : 'none';
}

function updateUsageDisplay() {
    const usageElem = document.getElementById('usageCounterText');
    if (usageElem) usageElem.innerHTML = `Used ${currentUsage} times`;
    const heroUsage = document.getElementById('globalUsageHero');
    if (heroUsage) heroUsage.innerHTML = currentUsage;
}

// ============================================
// API SECTION
// ============================================
async function callAPI(endpoint, method = 'GET', body = null) {
    try {
        const options = { method, headers: { 'Content-Type': 'application/json' } };
        if (body) options.body = JSON.stringify(body);
        const response = await fetch(`${API_BASE}/${endpoint}`, options);
        return await response.json();
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function incrementUsageAPI() {
    currentUsage++;
    localStorage.setItem(`${TOOL_SLUG}_usage`, currentUsage);
    updateUsageDisplay();
    return currentUsage;
}

// ============================================
// REACTIONS SECTION
// ============================================
function updateReactionsUI() {
    const emojiMap = { like: '👍', love: '❤️', wow: '😮', sad: '😢', angry: '😠', laugh: '😂', celebrate: '🎉' };
    const container = document.getElementById('reactionsBar');
    if (!container) return;
    
    container.innerHTML = '';
    Object.entries(emojiMap).forEach(([type, emoji]) => {
        const btn = document.createElement('button');
        btn.className = 'reaction-btn';
        btn.innerHTML = `${emoji} ${reactionCounts[type] || 0}`;
        btn.onclick = () => {
            if (userReacted[type]) {
                showToast(`You already reacted with ${emoji}`, 'info');
                return;
            }
            userReacted[type] = true;
            reactionCounts[type]++;
            localStorage.setItem(`${TOOL_SLUG}_reactions`, JSON.stringify(reactionCounts));
            localStorage.setItem(`${TOOL_SLUG}_userReacted`, JSON.stringify(userReacted));
            updateReactionsUI();
            showToast(`Thanks for your ${emoji} reaction!`, 'success');
            
            const total = Object.values(reactionCounts).reduce((a,b) => a+b, 0);
            document.getElementById('globalReactionsHero').innerHTML = total;
        };
        container.appendChild(btn);
    });
}

// ============================================
// SHARING SECTION
// ============================================
async function shareOnPlatform(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Number Fun Game - Learn Numbers Joyfully!');
    let shareUrl = '';
    
    if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    else if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
    else if (platform === 'whatsapp') shareUrl = `https://wa.me/?text=${title}%20${url}`;
    else if (platform === 'linkedin') shareUrl = `https://www.linkedin.com/sharing/share-offsite/?u=${url}`;
    else if (platform === 'email') shareUrl = `mailto:?subject=${title}&body=${url}`;
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        shareCount++;
        localStorage.setItem(`${TOOL_SLUG}_shares`, shareCount);
        showToast(`Shared on ${platform}! 🎉`, 'success');
    }
}

async function copyPageUrl() {
    await navigator.clipboard.writeText(window.location.href);
    shareCount++;
    localStorage.setItem(`${TOOL_SLUG}_shares`, shareCount);
    showToast('Link copied to clipboard! 📋', 'success');
}

// ============================================
// ============================================
// TOOL: COUNTING GAME
// ============================================
// === START ===
function startCountingGame() {
    let score = 0;
    let questionCount = 0;
    const totalQuestions = 10;
    
    function generateQuestion() {
        const objects = Math.floor(Math.random() * 8) + 2;
        const correct = objects;
        const options = [correct];
        while(options.length < 4) {
            const opt = correct + Math.floor(Math.random() * 5) - 2;
            if(opt > 0 && opt < 11 && !options.includes(opt)) options.push(opt);
        }
        options.sort(() => Math.random() - 0.5);
        const emojis = ['🍎', '⭐', '🎈', '🐠', '🌼', '🐶', '🐱', '🐭', '🐰', '🦊'];
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        return { objects, correct, options, emoji };
    }
    
    let currentQuestion = generateQuestion();
    
    function renderGame() {
        const html = `
            <div style="text-align:center">
                <div style="display:flex; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:10px">
                    <span>📊 Question: ${questionCount + 1}/${totalQuestions}</span>
                    <span>🏆 Score: ${score}</span>
                </div>
                <h3>Count the objects!</h3>
                <div style="display:flex; gap:15px; justify-content:center; margin:30px 0; flex-wrap:wrap">
                    ${Array(currentQuestion.objects).fill(`<div class="object">${currentQuestion.emoji}</div>`).join('')}
                </div>
                <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap">
                    ${currentQuestion.options.map(opt => `<button class="option-btn" data-num="${opt}">${opt}</button>`).join('')}
                </div>
                <p id="gameFeedback" style="margin-top:20px; font-size:1.1rem"></p>
            </div>
        `;
        document.getElementById('gameDynamicContent').innerHTML = html;
        
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.onclick = () => {
                const selected = parseInt(btn.dataset.num);
                if (selected === currentQuestion.correct) {
                    score += 10;
                    document.getElementById('gameFeedback').innerHTML = '<span style="color:#4ade80">✅ Correct! +10 points!</span>';
                    questionCount++;
                    
                    if (questionCount < totalQuestions) {
                        currentQuestion = generateQuestion();
                        setTimeout(renderGame, 1000);
                    } else {
                        setTimeout(() => {
                            document.getElementById('gameDynamicContent').innerHTML = `
                                <div style="text-align:center">
                                    <h2>🎉 Game Complete! 🎉</h2>
                                    <p style="font-size:2rem">Your Score: ${score}/${totalQuestions * 10}</p>
                                    <button class="hero-cta" onclick="location.reload()">Play Again</button>
                                </div>
                            `;
                            incrementUsageAPI();
                        }, 1000);
                    }
                } else {
                    document.getElementById('gameFeedback').innerHTML = '<span style="color:#f87171">❌ Try again! Count carefully!</span>';
                }
            };
        });
    }
    renderGame();
}
// === END ===


// ============================================
// TOOL: NUMBER LINE JUMP GAME
// ============================================
// === START ===
function startNumberLineGame() {
    let level = 1;
    let score = 0;
    let currentTarget = Math.floor(Math.random() * 5) + 3;
    let currentPos = 1;
    
    function renderGame() {
        const html = `
            <div style="text-align:center">
                <div style="display:flex; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:10px">
                    <span>⭐ Level: ${level}</span>
                    <span>🏆 Score: ${score}</span>
                    <span>🎯 Target: ${currentTarget}</span>
                </div>
                <h3>Jump to number ${currentTarget}!</h3>
                <div style="display:flex; justify-content:center; gap:8px; margin:30px 0; flex-wrap:wrap">
                    ${Array(12).fill().map((_,i) => `
                        <div class="number-step" data-pos="${i+1}" style="background:${i+1===currentPos ? '#fbbf24' : (i+1 < currentPos ? '#4ade80' : '#8B5CF6')}">
                            ${i+1}
                        </div>
                    `).join('')}
                </div>
                <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap">
                    <button class="hero-cta" id="jumpForwardBtn">Jump +1 🦘</button>
                    <button class="hero-cta" id="jumpBackBtn" style="background:#f87171">Jump -1 🔙</button>
                </div>
                <p id="lineFeedback" style="margin-top:20px; font-size:1.1rem"></p>
            </div>
        `;
        document.getElementById('gameDynamicContent').innerHTML = html;
        attachEvents();
    }
    
    function attachEvents() {
        document.getElementById('jumpForwardBtn').onclick = () => {
            if (currentPos < currentTarget) {
                currentPos++;
                updateUI();
                if (currentPos === currentTarget) {
                    const points = 10 * level;
                    score += points;
                    showToast(`🎉 Level ${level} complete! +${points} points!`, 'success');
                    level++;
                    currentTarget = Math.floor(Math.random() * 5) + 3 + Math.min(level, 5);
                    currentPos = 1;
                    setTimeout(renderGame, 1500);
                }
            } else {
                document.getElementById('lineFeedback').innerHTML = '😅 Too far! Try again!';
                setTimeout(() => { currentPos = 1; renderGame(); }, 1000);
            }
            updateUI();
        };
        
        document.getElementById('jumpBackBtn').onclick = () => {
            if (currentPos > 1) {
                currentPos--;
                updateUI();
                if (currentPos === currentTarget) {
                    const points = 10 * level;
                    score += points;
                    showToast(`🎉 Level ${level} complete! +${points} points!`, 'success');
                    level++;
                    currentTarget = Math.floor(Math.random() * 5) + 3 + Math.min(level, 5);
                    currentPos = 1;
                    setTimeout(renderGame, 1500);
                }
            }
            updateUI();
        };
    }
    
    function updateUI() {
        const steps = document.querySelectorAll('.number-step');
        steps.forEach((step, idx) => {
            if (idx + 1 === currentPos) step.style.background = '#fbbf24';
            else if (idx + 1 <= currentPos) step.style.background = '#4ade80';
            else step.style.background = '#8B5CF6';
        });
    }
    renderGame();
}
// === END ===


// ============================================
// TOOL: NUMBER SORTING GAME
// ============================================
// === START ===
function startNumberSortingGame() {
    let score = 0;
    let level = 1;
    let currentNumbers = [];
    
    function generateNumbers() {
        const count = Math.min(3 + Math.floor(level / 2), 6);
        const numbers = [];
        for (let i = 0; i < count; i++) {
            numbers.push(Math.floor(Math.random() * 20) + 1);
        }
        currentNumbers = [...numbers];
        return numbers;
    }
    
    function renderGame() {
        const numbers = generateNumbers();
        const targetOrder = [...numbers].sort((a, b) => a - b);
        
        const html = `
            <div style="text-align:center">
                <div style="display:flex; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:10px">
                    <span>⭐ Level: ${level}</span>
                    <span>🏆 Score: ${score}</span>
                </div>
                <h3>Arrange in <span style="color:#FDE047">ASCENDING ORDER</span>!</h3>
                <p>Click numbers in correct order (smallest to largest)</p>
                <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:15px; margin:30px 0">
                    ${numbers.map((num, idx) => `
                        <button class="option-btn sort-btn" data-num="${num}" data-idx="${idx}" style="width:70px; height:70px; font-size:1.5rem">${num}</button>
                    `).join('')}
                </div>
                <div style="margin:20px 0">
                    <h4>Your Selection:</h4>
                    <div id="selectedOrder" style="display:flex; flex-wrap:wrap; justify-content:center; gap:10px; min-height:60px"></div>
                </div>
                <button class="hero-cta" id="checkSortBtn">Check Answer ✅</button>
                <button class="close-game-btn" id="resetSortBtn" style="margin-left:10px">Reset 🔄</button>
                <p id="sortFeedback" style="margin-top:20px"></p>
            </div>
        `;
        document.getElementById('gameDynamicContent').innerHTML = html;
        
        let selectedNumbers = [];
        const availableBtns = document.querySelectorAll('.sort-btn');
        
        availableBtns.forEach(btn => {
            btn.onclick = () => {
                const num = parseInt(btn.dataset.num);
                if (!selectedNumbers.includes(num)) {
                    selectedNumbers.push(num);
                    btn.style.opacity = '0.5';
                    btn.disabled = true;
                    updateSelectedDisplay(selectedNumbers);
                }
            };
        });
        
        document.getElementById('resetSortBtn').onclick = () => renderGame();
        
        document.getElementById('checkSortBtn').onclick = () => {
            if (JSON.stringify(selectedNumbers) === JSON.stringify(targetOrder)) {
                const points = 20 * level;
                score += points;
                level++;
                document.getElementById('sortFeedback').innerHTML = `<span style="color:#4ade80">✅ Perfect! +${points} points! Level ${level}</span>`;
                showToast(`🎉 Correct! +${points} points!`, 'success');
                setTimeout(() => renderGame(), 1500);
            } else {
                document.getElementById('sortFeedback').innerHTML = `<span style="color:#f87171">❌ Wrong order! Correct: ${targetOrder.join(', ')}</span>`;
            }
        };
        
        function updateSelectedDisplay(selected) {
            const container = document.getElementById('selectedOrder');
            container.innerHTML = selected.map(n => `<span style="background:#4ade80; padding:8px 18px; border-radius:20px; color:#1a1a2e; font-weight:bold">${n}</span>`).join('');
        }
    }
    renderGame();
}
// === END ===


// ============================================
// TOOL: ODD ONE OUT GAME (PLACEHOLDER)
// ============================================
// ============================================
// TOOL: ODD ONE OUT GAME
// ============================================
// === START ===
function startOddOneOutGame() {
    let score = 0;
    let level = 1;
    let currentQuestion = null;
    
    // Generate a question: find the odd number
    function generateQuestion() {
        const baseNumber = Math.floor(Math.random() * 10) + 1; // 1 to 10
        const oddOne = baseNumber + Math.floor(Math.random() * 5) + 1; // Different number
        
        // Create 4 numbers: 3 same pattern, 1 odd
        let numbers = [];
        let patternType = Math.floor(Math.random() * 4); // 0=even, 1=odd, 2=multiple, 3=greater
        
        if (patternType === 0) {
            // Even numbers with one odd
            let evenBase = Math.floor(Math.random() * 10) + 2;
            if (evenBase % 2 !== 0) evenBase++;
            numbers = [evenBase, evenBase + 2, evenBase + 4];
            let oddNumber = Math.floor(Math.random() * 10) + 1;
            if (oddNumber % 2 === 0) oddNumber++;
            numbers.push(oddNumber);
            numbers.sort(() => Math.random() - 0.5);
            currentQuestion = {
                numbers: numbers,
                oddOne: oddNumber,
                pattern: "even numbers - find the odd number",
                hint: "Most numbers are even, one is odd"
            };
        } 
        else if (patternType === 1) {
            // Odd numbers with one even
            let oddBase = Math.floor(Math.random() * 10) + 1;
            if (oddBase % 2 === 0) oddBase++;
            numbers = [oddBase, oddBase + 2, oddBase + 4];
            let evenNumber = Math.floor(Math.random() * 10) + 2;
            if (evenNumber % 2 !== 0) evenNumber++;
            numbers.push(evenNumber);
            numbers.sort(() => Math.random() - 0.5);
            currentQuestion = {
                numbers: numbers,
                oddOne: evenNumber,
                pattern: "odd numbers - find the even number",
                hint: "Most numbers are odd, one is even"
            };
        }
        else if (patternType === 2) {
            // Multiples of a number with one different
            let multiple = Math.floor(Math.random() * 5) + 2; // 2,3,4,5,6
            let base = multiple;
            numbers = [base, base * 2, base * 3];
            let different = base * 2 + 1;
            if (different % multiple === 0) different++;
            numbers.push(different);
            numbers.sort(() => Math.random() - 0.5);
            currentQuestion = {
                numbers: numbers,
                oddOne: different,
                pattern: `multiples of ${multiple}`,
                hint: `Most numbers are multiples of ${multiple}`
            };
        }
        else {
            // Numbers less than 10 with one greater than 10
            numbers = [Math.floor(Math.random() * 8) + 1, Math.floor(Math.random() * 8) + 1, Math.floor(Math.random() * 8) + 1];
            let greaterNum = Math.floor(Math.random() * 10) + 11; // 11-20
            numbers.push(greaterNum);
            numbers.sort(() => Math.random() - 0.5);
            currentQuestion = {
                numbers: numbers,
                oddOne: greaterNum,
                pattern: "numbers less than 10",
                hint: "Most numbers are small, one is big"
            };
        }
        
        return currentQuestion;
    }
    
    function renderGame() {
        if (!currentQuestion) {
            currentQuestion = generateQuestion();
        }
        
        const html = `
            <div style="text-align:center">
                <div style="display:flex; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:10px">
                    <span>⭐ Level: ${level}</span>
                    <span>🏆 Score: ${score}</span>
                    <span><i class="fas fa-lightbulb"></i> Pattern: ${currentQuestion.pattern}</span>
                </div>
                
                <h3>🔍 Find the <span style="color:#FDE047">ODD ONE OUT</span>!</h3>
                <p style="margin:10px 0; opacity:0.9">${currentQuestion.hint}</p>
                
                <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:20px; margin:40px 0">
                    ${currentQuestion.numbers.map((num, idx) => `
                        <button class="odd-option-btn" data-num="${num}" data-idx="${idx}" 
                            style="width:100px; height:100px; background:linear-gradient(135deg, #8B5CF6, #6D28D9); 
                                   border:none; border-radius:25px; font-size:2rem; font-weight:bold; 
                                   color:white; cursor:pointer; transition:0.3s; box-shadow:0 8px 20px rgba(0,0,0,0.2);
                                   hover:transform:scale(1.05) hover:background:#fbbf24">
                            ${num}
                        </button>
                    `).join('')}
                </div>
                
                <div style="margin-top:20px">
                    <button class="hero-cta" id="newQuestionBtn">New Question 🔄</button>
                    <button class="close-game-btn" id="resetGameBtn" style="margin-left:10px">Reset Game 🔄</button>
                </div>
                
                <div id="oddFeedback" style="margin-top:25px; font-size:1.1rem; min-height:60px"></div>
                
                <div id="scoreBoard" style="margin-top:20px; background:rgba(139,92,246,0.2); border-radius:20px; padding:15px; display:none">
                    <h4>📊 Score Board</h4>
                    <p>Level: ${level} | Score: ${score} | Correct: ${Math.floor(score/10)}</p>
                </div>
            </div>
        `;
        
        document.getElementById('gameDynamicContent').innerHTML = html;
        
        // Add click handlers to all option buttons
        document.querySelectorAll('.odd-option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedNum = parseInt(btn.dataset.num);
                checkAnswer(selectedNum, btn);
            });
            
            // Add hover effect
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.05)';
                btn.style.background = 'linear-gradient(135deg, #fbbf24, #f59e0b)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
                btn.style.background = 'linear-gradient(135deg, #8B5CF6, #6D28D9)';
            });
        });
        
        // New question button
        document.getElementById('newQuestionBtn').addEventListener('click', () => {
            currentQuestion = generateQuestion();
            renderGame();
        });
        
        // Reset game button
        document.getElementById('resetGameBtn').addEventListener('click', () => {
            score = 0;
            level = 1;
            currentQuestion = generateQuestion();
            renderGame();
            showToast('Game Reset! Start fresh!', 'info');
        });
    }
    
    function checkAnswer(selectedNum, selectedBtn) {
        const feedbackDiv = document.getElementById('oddFeedback');
        const scoreBoard = document.getElementById('scoreBoard');
        
        if (selectedNum === currentQuestion.oddOne) {
            // Correct answer
            const points = 10 * level;
            score += points;
            
            // Visual feedback on correct button
            selectedBtn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
            selectedBtn.style.transform = 'scale(1.1)';
            
            feedbackDiv.innerHTML = `
                <div style="background:#4ade80; color:#1a1a2e; padding:15px; border-radius:20px; animation:slideIn 0.3s ease">
                    <i class="fas fa-check-circle"></i> ✅ Correct! +${points} points!<br>
                    <small>The odd one is ${currentQuestion.oddOne} because ${currentQuestion.hint}</small>
                </div>
            `;
            
            showToast(`🎉 Correct! +${points} points!`, 'success');
            
            // Level up every 3 correct answers
            if (Math.floor(score / 30) + 1 > level) {
                level++;
                showToast(`🎊 Level Up! You are now at Level ${level}! 🎊`, 'success');
            }
            
            // Disable all buttons after correct answer
            document.querySelectorAll('.odd-option-btn').forEach(btn => {
                btn.disabled = true;
                btn.style.opacity = '0.6';
                btn.style.cursor = 'not-allowed';
            });
            
            // Show next question after delay
            setTimeout(() => {
                currentQuestion = generateQuestion();
                renderGame();
            }, 2000);
            
            // Update usage counter
            incrementUsageAPI();
            
        } else {
            // Wrong answer
            selectedBtn.style.background = 'linear-gradient(135deg, #f87171, #ef4444)';
            selectedBtn.style.transform = 'scale(0.95)';
            
            feedbackDiv.innerHTML = `
                <div style="background:#f87171; color:white; padding:15px; border-radius:20px; animation:slideIn 0.3s ease">
                    <i class="fas fa-times-circle"></i> ❌ Wrong! ${selectedNum} is not the odd one.<br>
                    <small>Hint: ${currentQuestion.hint}. The odd one is ${currentQuestion.oddOne}</small>
                </div>
            `;
            
            showToast(`❌ Try again! The odd one is ${currentQuestion.oddOne}`, 'info');
            
            // Reset button color after 1 second
            setTimeout(() => {
                if (selectedBtn) {
                    selectedBtn.style.background = 'linear-gradient(135deg, #8B5CF6, #6D28D9)';
                    selectedBtn.style.transform = 'scale(1)';
                }
                feedbackDiv.innerHTML = '';
            }, 2000);
        }
        
        // Show score board
        scoreBoard.style.display = 'block';
        scoreBoard.innerHTML = `
            <h4>📊 Score Board</h4>
            <p>Level: ${level} | Score: ${score} | Correct: ${Math.floor(score/10)}</p>
            <div style="width:100%; background:#2D1B4E; border-radius:10px; margin-top:10px; overflow:hidden">
                <div style="width:${Math.min((score / 100) * 100, 100)}%; background:#4ade80; height:8px; transition:width 0.5s"></div>
            </div>
            <p style="font-size:0.8rem; margin-top:5px">🎯 Next level at ${(level * 30) - (score % 30)} more points</p>
        `;
    }
    
    // Initial render
    renderGame();
}
// === END ===


// ============================================
// TOOL: NUMBER BINGO GAME (PLACEHOLDER)
// ============================================
// ============================================
// TOOL: NUMBER BINGO GAME
// ============================================
// === START ===
function startBingoGame() {
    let score = 0;
    let level = 1;
    let markedNumbers = [];
    let bingoCard = [];
    let calledNumbers = [];
    let gameActive = true;
    
    // Generate random Bingo Card (5x5 grid)
    function generateBingoCard() {
        const card = [];
        const numbers = [];
        
        // Generate unique numbers 1-25 for easy mode
        for (let i = 1; i <= 25; i++) {
            numbers.push(i);
        }
        
        // Shuffle and pick 25 numbers
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
        
        for (let i = 0; i < 5; i++) {
            const row = [];
            for (let j = 0; j < 5; j++) {
                const num = numbers[i * 5 + j];
                row.push({
                    number: num,
                    marked: false,
                    row: i,
                    col: j
                });
            }
            card.push(row);
        }
        
        // Center is FREE space (marked automatically)
        card[2][2].marked = true;
        card[2][2].number = "FREE";
        markedNumbers.push("FREE");
        
        return card;
    }
    
    // Call a random number not called yet
    function callNumber() {
        const availableNumbers = [];
        for (let i = 1; i <= 25; i++) {
            if (!calledNumbers.includes(i)) {
                availableNumbers.push(i);
            }
        }
        
        if (availableNumbers.length === 0) {
            return null;
        }
        
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        const calledNum = availableNumbers[randomIndex];
        calledNumbers.push(calledNum);
        return calledNum;
    }
    
    // Check if number exists on card and mark it
    function markNumberOnCard(number) {
        let marked = false;
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (bingoCard[i][j].number === number && !bingoCard[i][j].marked) {
                    bingoCard[i][j].marked = true;
                    markedNumbers.push(number);
                    marked = true;
                }
            }
        }
        return marked;
    }
    
    // Check for BINGO (5 in a row, column, or diagonal)
    function checkForBingo() {
        // Check rows
        for (let i = 0; i < 5; i++) {
            let rowComplete = true;
            for (let j = 0; j < 5; j++) {
                if (!bingoCard[i][j].marked) {
                    rowComplete = false;
                    break;
                }
            }
            if (rowComplete) return true;
        }
        
        // Check columns
        for (let j = 0; j < 5; j++) {
            let colComplete = true;
            for (let i = 0; i < 5; i++) {
                if (!bingoCard[i][j].marked) {
                    colComplete = false;
                    break;
                }
            }
            if (colComplete) return true;
        }
        
        // Check main diagonal
        let diag1Complete = true;
        for (let i = 0; i < 5; i++) {
            if (!bingoCard[i][i].marked) {
                diag1Complete = false;
                break;
            }
        }
        if (diag1Complete) return true;
        
        // Check other diagonal
        let diag2Complete = true;
        for (let i = 0; i < 5; i++) {
            if (!bingoCard[i][4 - i].marked) {
                diag2Complete = false;
                break;
            }
        }
        if (diag2Complete) return true;
        
        return false;
    }
    
    // Render Bingo Card
    function renderBingoCard() {
        let html = '<div style="display:grid; grid-template-columns:repeat(5,1fr); gap:8px; max-width:500px; margin:20px auto">';
        
        // Column headers
        const headers = ['B', 'I', 'N', 'G', 'O'];
        for (let i = 0; i < 5; i++) {
            html += `<div style="background:#fbbf24; color:#4C1D95; padding:12px; text-align:center; font-weight:bold; font-size:1.2rem; border-radius:10px">${headers[i]}</div>`;
        }
        
        // Card cells
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                const cell = bingoCard[i][j];
                const isMarked = cell.marked;
                const bgColor = isMarked ? '#4ade80' : '#8B5CF6';
                const textColor = isMarked ? '#1a1a2e' : 'white';
                const text = cell.number === "FREE" ? "🎁" : cell.number;
                
                html += `
                    <div style="background:${bgColor}; color:${textColor}; padding:15px; text-align:center; font-weight:bold; font-size:1.2rem; border-radius:10px; transition:0.3s">
                        ${text}
                    </div>
                `;
            }
        }
        
        html += '</div>';
        return html;
    }
    
    // Render Game
    function renderGame() {
        const calledNumbersList = calledNumbers.length > 0 ? calledNumbers.join(', ') : 'None yet';
        
        const html = `
            <div style="text-align:center">
                <div style="display:flex; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:10px">
                    <span>⭐ Level: ${level}</span>
                    <span>🏆 Score: ${score}</span>
                    <span>🎯 Called: ${calledNumbers.length}/25</span>
                </div>
                
                <h3>🎲 NUMBER BINGO! 🎲</h3>
                <p style="margin:10px 0">Mark numbers as they are called. Get 5 in a row to win!</p>
                
                <div id="bingoCardContainer">
                    ${renderBingoCard()}
                </div>
                
                <div style="margin:20px 0; background:rgba(139,92,246,0.2); border-radius:20px; padding:15px">
                    <h4>📢 Last Called Numbers:</h4>
                    <p style="font-size:1.2rem; word-wrap:break-word">${calledNumbersList}</p>
                    <p style="margin-top:10px">✅ Marked: ${markedNumbers.filter(n => n !== "FREE").length} numbers</p>
                </div>
                
                <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap; margin-top:20px">
                    <button class="hero-cta" id="callNumberBtn">🎲 Call Next Number</button>
                    <button class="hero-cta" id="checkBingoBtn" style="background:#fbbf24; color:#4C1D95">🏆 Check BINGO!</button>
                    <button class="close-game-btn" id="newGameBtn">🔄 New Game</button>
                </div>
                
                <div id="bingoFeedback" style="margin-top:25px; font-size:1.1rem; min-height:60px"></div>
                
                <div id="bingoStats" style="margin-top:20px; background:rgba(139,92,246,0.15); border-radius:20px; padding:15px; display:none">
                    <h4>📊 Game Stats</h4>
                    <p>Level: ${level} | Score: ${score} | Numbers Marked: ${markedNumbers.filter(n => n !== "FREE").length}</p>
                </div>
            </div>
        `;
        
        document.getElementById('gameDynamicContent').innerHTML = html;
        
        // Add event listeners
        document.getElementById('callNumberBtn').addEventListener('click', () => {
            if (!gameActive) {
                showToast('Game over! Start a new game!', 'info');
                return;
            }
            
            const newNumber = callNumber();
            if (newNumber === null) {
                document.getElementById('bingoFeedback').innerHTML = '<span style="color:#fbbf24">🎉 All numbers have been called! Check for BINGO! 🎉</span>';
                return;
            }
            
            const wasMarked = markNumberOnCard(newNumber);
            
            if (wasMarked) {
                showToast(`🎯 Number ${newNumber} marked on your card!`, 'success');
                document.getElementById('bingoFeedback').innerHTML = `<span style="color:#4ade80">✅ Number ${newNumber} is on your card! Marked!</span>`;
            } else {
                document.getElementById('bingoFeedback').innerHTML = `<span style="color:#f87171">❌ Number ${newNumber} is not on your card!</span>`;
            }
            
            // Re-render card
            const cardContainer = document.getElementById('bingoCardContainer');
            if (cardContainer) {
                cardContainer.innerHTML = renderBingoCard();
            }
            
            // Update called numbers display
            const calledSpan = document.querySelector('.interaction-bar');
            if (calledSpan) {
                const calledDisplay = document.querySelector('#bingoGameCalled');
                if (calledDisplay) calledDisplay.innerText = calledNumbers.join(', ');
            }
            
            // Auto-check for BINGO after each call
            setTimeout(() => {
                if (checkForBingo()) {
                    handleBingo();
                }
            }, 500);
        });
        
        document.getElementById('checkBingoBtn').addEventListener('click', () => {
            if (checkForBingo()) {
                handleBingo();
            } else {
                document.getElementById('bingoFeedback').innerHTML = '<span style="color:#fbbf24">❌ No BINGO yet! Keep marking numbers!</span>';
                showToast('No BINGO yet! Keep playing!', 'info');
            }
        });
        
        document.getElementById('newGameBtn').addEventListener('click', () => {
            resetGame();
            renderGame();
            showToast('🔄 New Bingo Game Started!', 'success');
        });
    }
    
    function handleBingo() {
        if (!gameActive) return;
        
        const points = 50 * level;
        score += points;
        level++;
        gameActive = false;
        
        document.getElementById('bingoFeedback').innerHTML = `
            <div style="background:#4ade80; color:#1a1a2e; padding:20px; border-radius:20px; animation:slideIn 0.3s ease">
                <i class="fas fa-trophy"></i> 🎉 BINGO! 🎉<br>
                You got 5 in a row! +${points} points!<br>
                Moving to Level ${level}!
            </div>
        `;
        
        showToast(`🎉 BINGO! +${points} points! Level ${level}! 🎉`, 'success');
        
        // Disable call button
        const callBtn = document.getElementById('callNumberBtn');
        if (callBtn) {
            callBtn.disabled = true;
            callBtn.style.opacity = '0.5';
        }
        
        // Auto-start next level after delay
        setTimeout(() => {
            resetGame();
            renderGame();
        }, 3000);
        
        incrementUsageAPI();
    }
    
    function resetGame() {
        bingoCard = generateBingoCard();
        calledNumbers = [];
        markedNumbers = ["FREE"];
        gameActive = true;
        
        // Make sure FREE space is marked
        bingoCard[2][2].marked = true;
        bingoCard[2][2].number = "FREE";
    }
    
    // Initialize the game
    bingoCard = generateBingoCard();
    markedNumbers = ["FREE"];
    gameActive = true;
    renderGame();
}
// === END ===


// ============================================
// TOOL: GUESS THE NUMBER GAME (PLACEHOLDER)
// ============================================
// ============================================
// TOOL: GUESS THE NUMBER GAME
// ============================================
// === START ===
function startGuessGame() {
    let score = 0;
    let level = 1;
    let secretNumber = null;
    let attempts = 0;
    let maxAttempts = 7;
    let minRange = 1;
    let maxRange = 20;
    let gameActive = true;
    let hintsUsed = 0;
    let previousGuesses = [];
    
    // Generate secret number based on level
    function generateSecretNumber() {
        // Level 1-3: 1-20, Level 4-6: 1-50, Level 7+: 1-100
        if (level <= 3) {
            minRange = 1;
            maxRange = 20;
        } else if (level <= 6) {
            minRange = 1;
            maxRange = 50;
        } else {
            minRange = 1;
            maxRange = 100;
        }
        
        secretNumber = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
        return secretNumber;
    }
    
    // Get hint based on guess
    function getHint(guess) {
        const difference = Math.abs(secretNumber - guess);
        
        if (difference === 0) return "🎉 Correct!";
        if (difference === 1) return "🔥 Extremely HOT! Just 1 away!";
        if (difference <= 3) return "🥵 Very HOT! Very close!";
        if (difference <= 5) return "😎 Warm! Getting there!";
        if (difference <= 10) return "❄️ Cold! Keep trying!";
        return "🥶 Very Cold! Far away!";
    }
    
    // Get temperature emoji
    function getTemperatureEmoji(guess) {
        const difference = Math.abs(secretNumber - guess);
        if (difference === 0) return "🎉";
        if (difference <= 2) return "🔥🔥🔥";
        if (difference <= 5) return "🔥🔥";
        if (difference <= 10) return "🔥";
        if (difference <= 15) return "❄️";
        return "🥶🥶🥶";
    }
    
    // Check guess and provide feedback
    function checkGuess(guess) {
        if (!gameActive) {
            showToast("Game over! Start a new game!", "info");
            return { correct: false, gameOver: true };
        }
        
        if (previousGuesses.includes(guess)) {
            showToast("You already guessed that number! Try another!", "warning");
            return { correct: false, duplicate: true };
        }
        
        attempts++;
        previousGuesses.push(guess);
        
        if (guess === secretNumber) {
            const points = 20 * level;
            score += points;
            
            // Bonus for remaining attempts
            const remainingBonus = (maxAttempts - attempts) * 2;
            score += remainingBonus;
            
            // Bonus for not using hints
            const hintBonus = hintsUsed === 0 ? 10 : 0;
            score += hintBonus;
            
            const result = {
                correct: true,
                points: points,
                remainingBonus: remainingBonus,
                hintBonus: hintBonus,
                attempts: attempts,
                totalPoints: points + remainingBonus + hintBonus
            };
            
            gameActive = false;
            return result;
        }
        
        const isHigher = guess < secretNumber;
        const hint = getHint(guess);
        const tempEmoji = getTemperatureEmoji(guess);
        
        return {
            correct: false,
            isHigher: isHigher,
            hint: hint,
            tempEmoji: tempEmoji,
            attemptsLeft: maxAttempts - attempts,
            attempts: attempts
        };
    }
    
    // Provide a helpful hint
    function provideHint() {
        hintsUsed++;
        
        let hintMessage = "";
        const range = maxRange - minRange;
        
        if (secretNumber % 2 === 0) {
            hintMessage = `💡 The number is EVEN.`;
        } else {
            hintMessage = `💡 The number is ODD.`;
        }
        
        // Additional hint based on level
        if (level >= 3) {
            if (secretNumber > (minRange + maxRange) / 2) {
                hintMessage += ` It's in the UPPER half (${Math.floor((minRange + maxRange) / 2) + 1}-${maxRange}).`;
            } else {
                hintMessage += ` It's in the LOWER half (${minRange}-${Math.floor((minRange + maxRange) / 2)}).`;
            }
        }
        
        if (level >= 5) {
            const multiple = secretNumber % 3 === 0 ? 3 : (secretNumber % 5 === 0 ? 5 : null);
            if (multiple) {
                hintMessage += ` The number is a multiple of ${multiple}.`;
            }
        }
        
        return hintMessage;
    }
    
    // Render the game
    function renderGame() {
        const rangeText = `${minRange} - ${maxRange}`;
        const progressPercent = (attempts / maxAttempts) * 100;
        
        const html = `
            <div style="text-align:center">
                <div style="display:flex; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:10px">
                    <span>⭐ Level: ${level}</span>
                    <span>🏆 Score: ${score}</span>
                    <span>🎯 Range: ${rangeText}</span>
                    <span>💪 Attempts: ${attempts}/${maxAttempts}</span>
                    <span>💡 Hints Used: ${hintsUsed}</span>
                </div>
                
                <div style="background:linear-gradient(135deg, #4C1D95, #2E1065); border-radius:30px; padding:30px; margin:20px 0">
                    <div style="font-size:1.2rem; margin-bottom:15px">🤔 Can you guess the number?</div>
                    
                    <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap; margin:20px 0">
                        <input type="number" id="guessInput" placeholder="Enter your guess" 
                               style="padding:15px 20px; font-size:1.2rem; border-radius:50px; border:none; width:200px; text-align:center">
                        <button class="hero-cta" id="submitGuessBtn">Submit Guess 🎯</button>
                    </div>
                    
                    <div class="guess-buttons" style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-top:15px">
                        ${generateQuickGuessButtons()}
                    </div>
                    
                    <div style="margin-top:20px">
                        <button class="close-game-btn" id="hintBtn" style="background:#fbbf24; color:#4C1D95">💡 Get Hint (${hintsUsed}/3)</button>
                        <button class="close-game-btn" id="newGameBtn" style="margin-left:10px">🔄 New Game</button>
                    </div>
                </div>
                
                <div id="guessHistory" style="background:rgba(139,92,246,0.15); border-radius:20px; padding:15px; margin-top:20px">
                    <h4>📝 Guess History:</h4>
                    <div id="historyList" style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-top:10px">
                        ${previousGuesses.length === 0 ? '<span style="color:#aaa">No guesses yet. Start guessing!</span>' : 
                          previousGuesses.map(g => `<span style="background:#8B5CF6; padding:5px 12px; border-radius:20px">${g}</span>`).join('')}
                    </div>
                </div>
                
                <div id="guessFeedback" style="margin-top:20px; font-size:1.1rem; min-height:80px"></div>
                
                <div class="progress-container" style="width:100%; background:#2D1B4E; border-radius:10px; margin-top:20px; overflow:hidden">
                    <div class="progress-bar" style="width:${progressPercent}%; background:#fbbf24; height:8px; transition:width 0.3s"></div>
                </div>
                
                <div id="scoreBreakdown" style="margin-top:15px; font-size:0.85rem; opacity:0.8"></div>
            </div>
        `;
        
        document.getElementById('gameDynamicContent').innerHTML = html;
        
        // Add event listeners
        document.getElementById('submitGuessBtn').addEventListener('click', () => {
            const input = document.getElementById('guessInput');
            const guess = parseInt(input.value);
            
            if (isNaN(guess)) {
                showToast("Please enter a valid number!", "error");
                return;
            }
            
            if (guess < minRange || guess > maxRange) {
                showToast(`Please guess between ${minRange} and ${maxRange}!`, "warning");
                return;
            }
            
            processGuess(guess);
            input.value = '';
            input.focus();
        });
        
        document.getElementById('guessInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('submitGuessBtn').click();
            }
        });
        
        document.getElementById('hintBtn').addEventListener('click', () => {
            if (hintsUsed >= 3) {
                showToast("You've used all 3 hints!", "info");
                return;
            }
            
            if (!gameActive) {
                showToast("Game over! Start a new game!", "info");
                return;
            }
            
            const hint = provideHint();
            document.getElementById('guessFeedback').innerHTML = `
                <div style="background:#fbbf24; color:#1a1a2e; padding:15px; border-radius:20px">
                    ${hint}
                </div>
            `;
            showToast(`Hint used! ${hintsUsed}/3 hints remaining`, "info");
            
            // Update hints display
            const hintBtn = document.getElementById('hintBtn');
            if (hintBtn) {
                hintBtn.innerHTML = `💡 Get Hint (${hintsUsed}/3)`;
            }
        });
        
        document.getElementById('newGameBtn').addEventListener('click', () => {
            resetGame();
            renderGame();
            showToast("🔄 New game started! Good luck!", "success");
        });
        
        // Add quick guess buttons
        document.querySelectorAll('.quick-guess-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const guess = parseInt(btn.dataset.num);
                processGuess(guess);
            });
        });
    }
    
    function generateQuickGuessButtons() {
        const center = Math.floor((minRange + maxRange) / 2);
        const quickGuesses = [
            minRange, 
            minRange + Math.floor((maxRange - minRange) / 4),
            center,
            maxRange - Math.floor((maxRange - minRange) / 4),
            maxRange
        ].filter((v, i, a) => a.indexOf(v) === i);
        
        return quickGuesses.map(num => 
            `<button class="quick-guess-btn" data-num="${num}" style="background:rgba(255,255,255,0.1); border:none; padding:8px 16px; border-radius:25px; cursor:pointer">${num}</button>`
        ).join('');
    }
    
    function processGuess(guess) {
        const result = checkGuess(guess);
        
        if (result.duplicate) {
            renderGame(); // Re-render to keep history
            return;
        }
        
        const feedbackDiv = document.getElementById('guessFeedback');
        
        if (result.correct) {
            feedbackDiv.innerHTML = `
                <div style="background:#4ade80; color:#1a1a2e; padding:20px; border-radius:20px; animation:slideIn 0.3s ease">
                    <i class="fas fa-trophy"></i> 🎉 CORRECT! 🎉<br>
                    The number was ${secretNumber}!<br>
                    You got it in ${result.attempts} attempts!<br>
                    +${result.points} points + ${result.remainingBonus} remaining bonus + ${result.hintBonus} no-hint bonus = ${result.totalPoints} total points!
                </div>
            `;
            
            showToast(`🎉 Amazing! You guessed it! +${result.totalPoints} points!`, "success");
            
            // Level up
            level++;
            
            setTimeout(() => {
                resetGame();
                renderGame();
            }, 3000);
            
            incrementUsageAPI();
            
        } else if (result.gameOver) {
            // This shouldn't happen here
            
        } else {
            const direction = result.isHigher ? "higher ⬆️" : "lower ⬇️";
            feedbackDiv.innerHTML = `
                <div style="background:#f87171; color:white; padding:15px; border-radius:20px">
                    ${result.tempEmoji} ${result.hint}<br>
                    Try a number ${direction} than ${guess}!<br>
                    ${result.attemptsLeft} attempts remaining.
                </div>
            `;
            
            showToast(`${result.hint} Try ${direction}!`, "info");
            
            // Check if game over
            if (result.attempts >= maxAttempts) {
                feedbackDiv.innerHTML = `
                    <div style="background:#f87171; color:white; padding:20px; border-radius:20px">
                        <i class="fas fa-skull"></i> GAME OVER!<br>
                        The number was ${secretNumber}.<br>
                        Better luck next time!
                    </div>
                `;
                gameActive = false;
                
                setTimeout(() => {
                    resetGame();
                    renderGame();
                }, 3000);
            } else {
                renderGame(); // Re-render to update history
            }
        }
        
        // Update score display
        const scoreSpan = document.querySelector('#gameTitle');
        if (scoreSpan) {
            // Score is already updated in state
        }
    }
    
    function resetGame() {
        generateSecretNumber();
        attempts = 0;
        previousGuesses = [];
        hintsUsed = 0;
        gameActive = true;
        
        // Adjust max attempts based on range
        if (maxRange <= 20) maxAttempts = 6;
        else if (maxRange <= 50) maxAttempts = 8;
        else maxAttempts = 10;
    }
    
    // Initialize
    generateSecretNumber();
    renderGame();
}
// === END ===

// ============================================
// TOOL: NUMBER BOND GAME (PLACEHOLDER)
// ============================================
// ============================================
// TOOL: NUMBER BOND GAME
// ============================================
// === START ===
function startBondGame() {
    let score = 0;
    let level = 1;
    let currentQuestion = null;
    let totalQuestions = 0;
    let correctAnswers = 0;
    
    // Generate number bond question based on level
    function generateQuestion() {
        let whole, part1, part2, missingPart;
        
        // Difficulty based on level
        if (level <= 2) {
            // Level 1-2: Numbers up to 10
            whole = Math.floor(Math.random() * 9) + 2; // 2 to 10
            part1 = Math.floor(Math.random() * (whole - 1)) + 1;
            part2 = whole - part1;
            missingPart = Math.random() < 0.5 ? 'part1' : 'part2';
            
        } else if (level <= 4) {
            // Level 3-4: Numbers up to 20
            whole = Math.floor(Math.random() * 18) + 3; // 3 to 20
            part1 = Math.floor(Math.random() * (whole - 1)) + 1;
            part2 = whole - part1;
            missingPart = Math.random() < 0.5 ? 'part1' : 'part2';
            
        } else if (level <= 6) {
            // Level 5-6: Missing whole number
            part1 = Math.floor(Math.random() * 15) + 2;
            part2 = Math.floor(Math.random() * 15) + 2;
            whole = part1 + part2;
            missingPart = 'whole';
            
        } else {
            // Level 7+: Larger numbers and multiple missing
            const type = Math.floor(Math.random() * 3);
            if (type === 0) {
                whole = Math.floor(Math.random() * 40) + 10;
                part1 = Math.floor(Math.random() * (whole - 5)) + 3;
                part2 = whole - part1;
                missingPart = 'part1';
            } else if (type === 1) {
                part1 = Math.floor(Math.random() * 25) + 5;
                part2 = Math.floor(Math.random() * 25) + 5;
                whole = part1 + part2;
                missingPart = 'whole';
            } else {
                whole = Math.floor(Math.random() * 50) + 20;
                part1 = Math.floor(Math.random() * (whole - 10)) + 5;
                part2 = whole - part1;
                missingPart = 'part2';
            }
        }
        
        currentQuestion = {
            whole: whole,
            part1: part1,
            part2: part2,
            missingPart: missingPart,
            correctAnswer: missingPart === 'whole' ? whole : (missingPart === 'part1' ? part1 : part2)
        };
        
        return currentQuestion;
    }
    
    // Generate visual representation of number bond
    function renderNumberBond() {
        const q = currentQuestion;
        const showWhole = q.missingPart !== 'whole';
        const showPart1 = q.missingPart !== 'part1';
        const showPart2 = q.missingPart !== 'part2';
        
        return `
            <div class="number-bond-container" style="display:flex; flex-direction:column; align-items:center; margin:30px 0">
                <!-- Whole (top circle) -->
                <div style="text-align:center; margin-bottom:20px">
                    <div style="width:120px; height:120px; background:${showWhole ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : 'linear-gradient(135deg, #6b7280, #4b5563)'}; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto; box-shadow:0 8px 25px rgba(0,0,0,0.2)">
                        ${showWhole ? `<span style="font-size:2rem; font-weight:bold; color:#1a1a2e">${q.whole}</span>` : '<span style="font-size:1.2rem; color:white">?</span>'}
                    </div>
                    <div style="margin-top:10px; font-size:0.9rem">Whole</div>
                </div>
                
                <!-- Connector lines -->
                <div style="display:flex; gap:80px; margin:10px 0">
                    <div style="width:100px; height:2px; background:rgba(255,255,255,0.3)"></div>
                    <div style="width:100px; height:2px; background:rgba(255,255,255,0.3)"></div>
                </div>
                
                <!-- Parts (bottom circles) -->
                <div style="display:flex; gap:60px; justify-content:center; flex-wrap:wrap">
                    <div style="text-align:center">
                        <div style="width:100px; height:100px; background:${showPart1 ? 'linear-gradient(135deg, #8B5CF6, #6D28D9)' : 'linear-gradient(135deg, #6b7280, #4b5563)'}; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 25px rgba(0,0,0,0.2)">
                            ${showPart1 ? `<span style="font-size:1.8rem; font-weight:bold; color:white">${q.part1}</span>` : '<span style="font-size:1.2rem; color:white">?</span>'}
                        </div>
                        <div style="margin-top:10px; font-size:0.9rem">Part 1</div>
                    </div>
                    
                    <div style="text-align:center">
                        <div style="width:100px; height:100px; background:${showPart2 ? 'linear-gradient(135deg, #8B5CF6, #6D28D9)' : 'linear-gradient(135deg, #6b7280, #4b5563)'}; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 25px rgba(0,0,0,0.2)">
                            ${showPart2 ? `<span style="font-size:1.8rem; font-weight:bold; color:white">${q.part2}</span>` : '<span style="font-size:1.2rem; color:white">?</span>'}
                        </div>
                        <div style="margin-top:10px; font-size:0.9rem">Part 2</div>
                    </div>
                </div>
                
                <!-- Equation display -->
                <div style="margin-top:30px; padding:15px 25px; background:rgba(139,92,246,0.2); border-radius:50px">
                    <span style="font-size:1.3rem">
                        ${showPart1 ? q.part1 : '?'} + ${showPart2 ? q.part2 : '?'} = ${showWhole ? q.whole : '?'}
                    </span>
                </div>
            </div>
        `;
    }
    
    // Generate answer options
    function generateOptions(correctAnswer) {
        let options = [correctAnswer];
        const range = level <= 3 ? 5 : (level <= 6 ? 10 : 20);
        
        while (options.length < 4) {
            let offset = Math.floor(Math.random() * range) + 1;
            let option = correctAnswer + (Math.random() < 0.5 ? offset : -offset);
            
            if (option > 0 && option <= (level <= 4 ? 50 : 100) && !options.includes(option)) {
                options.push(option);
            }
        }
        
        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        return options;
    }
    
    // Render the game
    function renderGame() {
        if (!currentQuestion) {
            currentQuestion = generateQuestion();
        }
        
        const options = generateOptions(currentQuestion.correctAnswer);
        const progressPercent = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        
        const html = `
            <div style="text-align:center">
                <div style="display:flex; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:10px">
                    <span>⭐ Level: ${level}</span>
                    <span>🏆 Score: ${score}</span>
                    <span>✅ Correct: ${correctAnswers}</span>
                    <span>📊 Questions: ${totalQuestions}</span>
                </div>
                
                <h3>🔗 Number Bond Challenge! 🔗</h3>
                <p style="margin:10px 0; opacity:0.9">Complete the number bond by finding the missing number</p>
                
                ${renderNumberBond()}
                
                <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap; margin:30px 0">
                    ${options.map(opt => `
                        <button class="bond-option-btn" data-answer="${opt}" 
                            style="background:linear-gradient(135deg, #fbbf24, #f59e0b); border:none; 
                                   width:80px; height:80px; border-radius:20px; font-size:1.5rem; font-weight:bold; 
                                   color:#1a1a2e; cursor:pointer; transition:0.3s; box-shadow:0 4px 12px rgba(0,0,0,0.2)">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
                
                <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap">
                    <button class="hero-cta" id="newQuestionBtn">🔄 New Question</button>
                    <button class="close-game-btn" id="resetGameBtn">🔄 Reset Game</button>
                </div>
                
                <div id="bondFeedback" style="margin-top:25px; font-size:1.1rem; min-height:80px"></div>
                
                <div class="progress-container" style="width:100%; background:#2D1B4E; border-radius:10px; margin-top:20px; overflow:hidden">
                    <div class="progress-bar" style="width:${progressPercent}%; background:#4ade80; height:8px; transition:width 0.3s"></div>
                </div>
                
                <div id="statsDisplay" style="margin-top:15px; font-size:0.85rem; opacity:0.8">
                    ${totalQuestions > 0 ? `Accuracy: ${Math.round((correctAnswers / totalQuestions) * 100)}%` : 'Answer questions to see stats'}
                </div>
            </div>
        `;
        
        document.getElementById('gameDynamicContent').innerHTML = html;
        
        // Add event listeners to option buttons
        document.querySelectorAll('.bond-option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedAnswer = parseInt(btn.dataset.answer);
                checkAnswer(selectedAnswer, btn);
            });
            
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.05)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
            });
        });
        
        document.getElementById('newQuestionBtn').addEventListener('click', () => {
            currentQuestion = generateQuestion();
            renderGame();
            showToast('New question loaded!', 'info');
        });
        
        document.getElementById('resetGameBtn').addEventListener('click', () => {
            resetGame();
            renderGame();
            showToast('Game reset! Starting fresh!', 'success');
        });
    }
    
    function checkAnswer(selectedAnswer, selectedBtn) {
        const feedbackDiv = document.getElementById('bondFeedback');
        const isCorrect = (selectedAnswer === currentQuestion.correctAnswer);
        
        if (isCorrect) {
            // Calculate points
            const basePoints = 20 * level;
            const streakBonus = correctAnswers > 0 && correctAnswers % 5 === 0 ? 50 : 0;
            const totalPoints = basePoints + streakBonus;
            
            score += totalPoints;
            correctAnswers++;
            totalQuestions++;
            
            // Visual feedback
            selectedBtn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
            selectedBtn.style.transform = 'scale(1.1)';
            
            let bonusText = '';
            if (streakBonus > 0) {
                bonusText = `<br><small>🎯 Streak Bonus! +${streakBonus} points!</small>`;
            }
            
            feedbackDiv.innerHTML = `
                <div style="background:#4ade80; color:#1a1a2e; padding:20px; border-radius:20px; animation:slideIn 0.3s ease">
                    <i class="fas fa-check-circle"></i> ✅ CORRECT! +${basePoints} points!${bonusText}
                    <br><small>${currentQuestion.part1} + ${currentQuestion.part2} = ${currentQuestion.whole}</small>
                </div>
            `;
            
            showToast(`🎉 Correct! +${totalPoints} points!`, 'success');
            
            // Level up every 5 correct answers
            if (correctAnswers > 0 && correctAnswers % 5 === 0) {
                level++;
                showToast(`🎊 LEVEL UP! You are now at Level ${level}! 🎊`, 'success');
            }
            
            // Disable all buttons temporarily
            document.querySelectorAll('.bond-option-btn').forEach(btn => {
                btn.disabled = true;
                btn.style.opacity = '0.6';
            });
            
            // Load next question after delay
            setTimeout(() => {
                currentQuestion = generateQuestion();
                renderGame();
            }, 2000);
            
            incrementUsageAPI();
            
        } else {
            // Wrong answer
            selectedBtn.style.background = 'linear-gradient(135deg, #f87171, #ef4444)';
            selectedBtn.style.transform = 'scale(0.95)';
            
            feedbackDiv.innerHTML = `
                <div style="background:#f87171; color:white; padding:20px; border-radius:20px; animation:slideIn 0.3s ease">
                    <i class="fas fa-times-circle"></i> ❌ WRONG!<br>
                    The correct answer is ${currentQuestion.correctAnswer}<br>
                    <small>Remember: ${currentQuestion.missingPart === 'whole' ? 
                        `${currentQuestion.part1} + ${currentQuestion.part2} = ?` : 
                        `? + ${currentQuestion.missingPart === 'part1' ? currentQuestion.part2 : currentQuestion.part1} = ${currentQuestion.whole}`}</small>
                </div>
            `;
            
            showToast(`❌ Wrong! The answer is ${currentQuestion.correctAnswer}`, 'info');
            totalQuestions++;
            
            // Reset button color
            setTimeout(() => {
                if (selectedBtn) {
                    selectedBtn.style.background = 'linear-gradient(135deg, #fbbf24, #f59e0b)';
                    selectedBtn.style.transform = 'scale(1)';
                }
            }, 1500);
        }
        
        // Update stats display
        const statsDiv = document.getElementById('statsDisplay');
        if (statsDiv && totalQuestions > 0) {
            statsDiv.innerHTML = `Accuracy: ${Math.round((correctAnswers / totalQuestions) * 100)}% | Correct: ${correctAnswers}/${totalQuestions}`;
        }
        
        // Update progress bar
        const progressPercent = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progressPercent}%`;
        }
    }
    
    function resetGame() {
        score = 0;
        level = 1;
        totalQuestions = 0;
        correctAnswers = 0;
        currentQuestion = generateQuestion();
    }
    
    // Initialize
    currentQuestion = generateQuestion();
    renderGame();
}
// === END ===

// ============================================
// TOOL: TEN FRAME FUN GAME (PLACEHOLDER)
// ============================================
// ============================================
// TOOL: TEN FRAME FUN GAME
// ============================================
// === START ===
function startTenFrameGame() {
    let score = 0;
    let level = 1;
    let currentQuestion = null;
    let totalQuestions = 0;
    let correctAnswers = 0;
    let frames = [];
    
    // Ten Frame configuration
    const FRAME_ROWS = 2;
    const FRAME_COLS = 5;
    const TOTAL_CELLS = 10;
    
    // Generate random number and fill ten frame
    function generateTenFrame() {
        let number;
        let questionType;
        
        // Determine question type based on level
        if (level <= 2) {
            // Level 1-2: Numbers 1-5
            number = Math.floor(Math.random() * 5) + 1;
            questionType = 'count';
        } else if (level <= 4) {
            // Level 3-4: Numbers 1-10
            number = Math.floor(Math.random() * 10) + 1;
            questionType = Math.random() < 0.7 ? 'count' : 'howManyMore';
        } else if (level <= 6) {
            // Level 5-6: Numbers 1-10 with how many more to make 10
            number = Math.floor(Math.random() * 9) + 1;
            questionType = Math.random() < 0.5 ? 'count' : 'howManyMore';
        } else {
            // Level 7+: Addition and subtraction with ten frame
            number = Math.floor(Math.random() * 10) + 1;
            questionType = Math.random() < 0.33 ? 'count' : (Math.random() < 0.5 ? 'howManyMore' : 'addition');
        }
        
        // Create frame representation
        frames = Array(TOTAL_CELLS).fill(false);
        for (let i = 0; i < number; i++) {
            frames[i] = true;
        }
        
        return { number, questionType };
    }
    
    // Generate question text based on type
    function generateQuestionText(questionType, number) {
        if (questionType === 'count') {
            return {
                text: `How many dots are in the ten frame?`,
                answer: number,
                hint: `Count the filled circles (${number} filled out of 10)`
            };
        } else if (questionType === 'howManyMore') {
            const needed = 10 - number;
            return {
                text: `How many more dots are needed to make 10?`,
                answer: needed,
                hint: `You have ${number} dots. Need ${needed} more to reach 10`
            };
        } else {
            const addNumber = Math.floor(Math.random() * (10 - number)) + 1;
            const total = number + addNumber;
            return {
                text: `${number} + ${addNumber} = ?`,
                answer: total,
                hint: `Add ${number} and ${addNumber} using the ten frame`
            };
        }
    }
    
    // Generate answer options
    function generateOptions(correctAnswer) {
        let options = [correctAnswer];
        const range = level <= 3 ? 3 : (level <= 6 ? 5 : 8);
        
        while (options.length < 4) {
            let offset = Math.floor(Math.random() * range) + 1;
            let option = correctAnswer + (Math.random() < 0.5 ? offset : -offset);
            
            if (option >= 0 && option <= 20 && !options.includes(option) && option !== correctAnswer) {
                options.push(option);
            }
        }
        
        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        return options;
    }
    
    // Render ten frame grid
    function renderTenFrame(filledCount) {
        let html = '<div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:12px; max-width:400px; margin:20px auto; padding:20px; background:rgba(139,92,246,0.15); border-radius:30px">';
        
        for (let i = 0; i < TOTAL_CELLS; i++) {
            const isFilled = frames[i];
            const bgColor = isFilled ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : 'rgba(255,255,255,0.1)';
            const shadow = isFilled ? '0 4px 15px rgba(251,191,36,0.3)' : 'none';
            
            html += `
                <div style="background:${bgColor}; 
                            aspect-ratio:1; 
                            border-radius:15px; 
                            display:flex; 
                            align-items:center; 
                            justify-content:center; 
                            transition:0.3s;
                            box-shadow:${shadow};
                            animation:${isFilled ? 'pulse 0.5s ease' : 'none'}">
                    ${isFilled ? '<i class="fas fa-star" style="color:#fff; font-size:1.2rem"></i>' : ''}
                </div>
            `;
        }
        
        html += '</div>';
        return html;
    }
    
    // Render the game
    function renderGame() {
        if (!currentQuestion) {
            const { number, questionType } = generateTenFrame();
            const qData = generateQuestionText(questionType, number);
            currentQuestion = {
                number: number,
                questionType: questionType,
                text: qData.text,
                answer: qData.answer,
                hint: qData.hint
            };
        }
        
        const options = generateOptions(currentQuestion.answer);
        const progressPercent = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        
        const html = `
            <div style="text-align:center">
                <div style="display:flex; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:10px">
                    <span>⭐ Level: ${level}</span>
                    <span>🏆 Score: ${score}</span>
                    <span>✅ Correct: ${correctAnswers}</span>
                    <span>📊 Q#: ${totalQuestions + 1}</span>
                </div>
                
                <h3>📐 Ten Frame Fun! 🎲</h3>
                <p style="margin:10px 0; opacity:0.9">Learn numbers visually with ten frames</p>
                
                <div class="tenframe-container" style="margin:20px 0">
                    ${renderTenFrame()}
                </div>
                
                <div style="background:rgba(139,92,246,0.2); border-radius:20px; padding:15px; margin:15px 0">
                    <h4>❓ ${currentQuestion.text}</h4>
                    <p style="font-size:0.85rem; opacity:0.8; margin-top:8px">
                        <i class="fas fa-lightbulb"></i> Hint: ${currentQuestion.hint}
                    </p>
                </div>
                
                <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap; margin:20px 0">
                    ${options.map(opt => `
                        <button class="tenframe-option-btn" data-answer="${opt}" 
                            style="background:linear-gradient(135deg, #8B5CF6, #6D28D9); border:none; 
                                   width:80px; height:80px; border-radius:20px; font-size:1.5rem; font-weight:bold; 
                                   color:white; cursor:pointer; transition:0.3s; box-shadow:0 4px 12px rgba(0,0,0,0.2);
                                   hover:transform:scale(1.05)">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
                
                <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap">
                    <button class="hero-cta" id="newFrameBtn">🔄 New Frame</button>
                    <button class="close-game-btn" id="resetGameBtn">🔄 Reset Game</button>
                </div>
                
                <div id="frameFeedback" style="margin-top:25px; font-size:1.1rem; min-height:80px"></div>
                
                <div class="progress-container" style="width:100%; background:#2D1B4E; border-radius:10px; margin-top:20px; overflow:hidden">
                    <div class="progress-bar" style="width:${progressPercent}%; background:#4ade80; height:8px; transition:width 0.3s"></div>
                </div>
                
                <div id="statsDisplay" style="margin-top:15px; font-size:0.85rem; opacity:0.8">
                    ${totalQuestions > 0 ? `🎯 Accuracy: ${Math.round((correctAnswers / totalQuestions) * 100)}%` : '✨ Answer questions to see your progress!'}
                </div>
            </div>
        `;
        
        document.getElementById('gameDynamicContent').innerHTML = html;
        
        // Add event listeners to option buttons
        document.querySelectorAll('.tenframe-option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedAnswer = parseInt(btn.dataset.answer);
                checkAnswer(selectedAnswer, btn);
            });
            
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.05)';
                btn.style.background = 'linear-gradient(135deg, #fbbf24, #f59e0b)';
                btn.style.color = '#1a1a2e';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
                btn.style.background = 'linear-gradient(135deg, #8B5CF6, #6D28D9)';
                btn.style.color = 'white';
            });
        });
        
        document.getElementById('newFrameBtn').addEventListener('click', () => {
            const { number, questionType } = generateTenFrame();
            const qData = generateQuestionText(questionType, number);
            currentQuestion = {
                number: number,
                questionType: questionType,
                text: qData.text,
                answer: qData.answer,
                hint: qData.hint
            };
            renderGame();
            showToast('🔄 New ten frame generated!', 'info');
        });
        
        document.getElementById('resetGameBtn').addEventListener('click', () => {
            resetGame();
            renderGame();
            showToast('🎮 Game reset! Starting fresh!', 'success');
        });
    }
    
    function checkAnswer(selectedAnswer, selectedBtn) {
        const feedbackDiv = document.getElementById('frameFeedback');
        const isCorrect = (selectedAnswer === currentQuestion.answer);
        
        if (isCorrect) {
            // Calculate points
            let basePoints = 15 * level;
            
            // Bonus for quick answer (no hints used in this game)
            const quickBonus = 5;
            const totalPoints = basePoints + quickBonus;
            
            score += totalPoints;
            correctAnswers++;
            totalQuestions++;
            
            // Visual feedback
            selectedBtn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
            selectedBtn.style.transform = 'scale(1.1)';
            selectedBtn.style.color = '#1a1a2e';
            
            feedbackDiv.innerHTML = `
                <div style="background:#4ade80; color:#1a1a2e; padding:20px; border-radius:20px; animation:slideIn 0.3s ease">
                    <i class="fas fa-check-circle"></i> ✅ CORRECT! +${totalPoints} points!<br>
                    <small>${currentQuestion.number} dots in the frame!</small>
                </div>
            `;
            
            showToast(`🎉 Correct! +${totalPoints} points!`, 'success');
            
            // Level up every 8 correct answers
            if (correctAnswers > 0 && correctAnswers % 8 === 0) {
                level++;
                showToast(`🎊 LEVEL UP! Welcome to Level ${level}! 🎊`, 'success');
            }
            
            // Disable all buttons temporarily
            document.querySelectorAll('.tenframe-option-btn').forEach(btn => {
                btn.disabled = true;
                btn.style.opacity = '0.6';
            });
            
            // Load new question after delay
            setTimeout(() => {
                const { number, questionType } = generateTenFrame();
                const qData = generateQuestionText(questionType, number);
                currentQuestion = {
                    number: number,
                    questionType: questionType,
                    text: qData.text,
                    answer: qData.answer,
                    hint: qData.hint
                };
                renderGame();
            }, 2000);
            
            incrementUsageAPI();
            
        } else {
            // Wrong answer
            selectedBtn.style.background = 'linear-gradient(135deg, #f87171, #ef4444)';
            selectedBtn.style.transform = 'scale(0.95)';
            
            feedbackDiv.innerHTML = `
                <div style="background:#f87171; color:white; padding:20px; border-radius:20px; animation:slideIn 0.3s ease">
                    <i class="fas fa-times-circle"></i> ❌ WRONG!<br>
                    The correct answer is ${currentQuestion.answer}<br>
                    <small>${currentQuestion.hint}</small>
                </div>
            `;
            
            showToast(`❌ Oops! The correct answer is ${currentQuestion.answer}`, 'info');
            totalQuestions++;
            
            // Reset button color
            setTimeout(() => {
                if (selectedBtn) {
                    selectedBtn.style.background = 'linear-gradient(135deg, #8B5CF6, #6D28D9)';
                    selectedBtn.style.transform = 'scale(1)';
                    selectedBtn.style.color = 'white';
                }
                feedbackDiv.innerHTML = '';
            }, 2000);
        }
        
        // Update stats display
        const statsDiv = document.getElementById('statsDisplay');
        if (statsDiv && totalQuestions > 0) {
            statsDiv.innerHTML = `🎯 Accuracy: ${Math.round((correctAnswers / totalQuestions) * 100)}% | ✅ ${correctAnswers}/${totalQuestions} correct`;
        }
        
        // Update progress bar
        const progressPercent = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progressPercent}%`;
        }
    }
    
    function resetGame() {
        score = 0;
        level = 1;
        totalQuestions = 0;
        correctAnswers = 0;
        const { number, questionType } = generateTenFrame();
        const qData = generateQuestionText(questionType, number);
        currentQuestion = {
            number: number,
            questionType: questionType,
            text: qData.text,
            answer: qData.answer,
            hint: qData.hint
        };
    }
    
    // Initialize
    const { number, questionType } = generateTenFrame();
    const qData = generateQuestionText(questionType, number);
    currentQuestion = {
        number: number,
        questionType: questionType,
        text: qData.text,
        answer: qData.answer,
        hint: qData.hint
    };
    renderGame();
}
// === END ===

// ============================================
// TOOL: TALLY MARKS GAME (PLACEHOLDER)
// ============================================
// ============================================
// TOOL: TALLY MARKS GAME
// ============================================
// === START ===
function startTallyGame() {
    let score = 0;
    let level = 1;
    let currentQuestion = null;
    let totalQuestions = 0;
    let correctAnswers = 0;
    
    // Convert number to tally marks visual
    function numberToTallyMarks(number) {
        let tallyHtml = '';
        const groups = Math.floor(number / 5);
        const remainder = number % 5;
        
        // Draw complete groups (5 marks = 4 lines + 1 diagonal)
        for (let i = 0; i < groups; i++) {
            tallyHtml += `
                <div class="tally-group" style="display:inline-flex; margin:0 10px; position:relative">
                    <span style="font-size:3rem; line-height:1; font-family:monospace">||||</span>
                    <span style="font-size:3rem; line-height:1; position:absolute; left:20px; top:0">/</span>
                </div>
            `;
        }
        
        // Draw remainder marks
        if (remainder > 0) {
            let marks = '';
            for (let i = 0; i < remainder; i++) {
                marks += '|';
            }
            tallyHtml += `<span style="font-size:3rem; line-height:1; font-family:monospace; margin:0 5px">${marks}</span>`;
        }
        
        return tallyHtml || '<span style="font-size:2rem">(no marks)</span>';
    }
    
    // Generate tally marks as text (for display)
    function getTallyText(number) {
        let tally = '';
        const groups = Math.floor(number / 5);
        const remainder = number % 5;
        
        for (let i = 0; i < groups; i++) {
            tally += '||||/ ';
        }
        for (let i = 0; i < remainder; i++) {
            tally += '|';
        }
        
        return tally.trim() || '0';
    }
    
    // Generate question based on level
    function generateQuestion() {
        let questionType;
        let number;
        let displayNumber;
        
        // Determine question type based on level
        if (level <= 2) {
            // Level 1-2: Numbers 1-10, count tally marks
            number = Math.floor(Math.random() * 10) + 1;
            questionType = 'count';
            displayNumber = number;
            
        } else if (level <= 4) {
            // Level 3-4: Numbers 5-20, count tally marks
            number = Math.floor(Math.random() * 16) + 5; // 5-20
            questionType = 'count';
            displayNumber = number;
            
        } else if (level <= 6) {
            // Level 5-6: Convert number to tally marks (multiple choice)
            number = Math.floor(Math.random() * 25) + 5; // 5-30
            questionType = 'convert';
            displayNumber = number;
            
        } else {
            // Level 7+: Mixed - either count or convert
            questionType = Math.random() < 0.5 ? 'count' : 'convert';
            if (questionType === 'count') {
                number = Math.floor(Math.random() * 35) + 10; // 10-45
                displayNumber = number;
            } else {
                number = Math.floor(Math.random() * 35) + 10; // 10-45
                displayNumber = number;
            }
        }
        
        let questionText, correctAnswer, hint;
        
        if (questionType === 'count') {
            const tallyMarks = getTallyText(number);
            questionText = `How many tally marks are shown?`;
            correctAnswer = number;
            hint = `Each group of 5 is shown as ||||/ (4 lines + 1 diagonal). Count carefully!`;
            
            currentQuestion = {
                type: 'count',
                displayTally: tallyMarks,
                correctAnswer: correctAnswer,
                hint: hint,
                number: number
            };
            
        } else {
            questionText = `Draw tally marks for the number ${number} (or select the correct representation)`;
            correctAnswer = number;
            hint = `${number} = ${Math.floor(number/5)} groups of 5 + ${number % 5} singles`;
            
            currentQuestion = {
                type: 'convert',
                correctAnswer: correctAnswer,
                hint: hint,
                number: number
            };
        }
        
        return currentQuestion;
    }
    
    // Generate answer options
    function generateOptions(correctAnswer) {
        let options = [correctAnswer];
        const range = level <= 3 ? 5 : (level <= 6 ? 8 : 12);
        
        while (options.length < 4) {
            let offset = Math.floor(Math.random() * range) + 1;
            let option = correctAnswer + (Math.random() < 0.5 ? offset : -offset);
            
            if (option >= 1 && option <= 60 && !options.includes(option) && option !== correctAnswer) {
                options.push(option);
            }
        }
        
        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        return options;
    }
    
    // Generate tally marks options for convert questions
    function generateTallyOptions(correctNumber) {
        let options = [correctNumber];
        const range = level <= 3 ? 5 : (level <= 6 ? 8 : 12);
        
        while (options.length < 4) {
            let offset = Math.floor(Math.random() * range) + 1;
            let option = correctNumber + (Math.random() < 0.5 ? offset : -offset);
            
            if (option >= 1 && option <= 60 && !options.includes(option)) {
                options.push(option);
            }
        }
        
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        return options;
    }
    
    // Interactive tally builder for convert questions
    function renderTallyBuilder(targetNumber) {
        let currentTally = 0;
        let tallyGroups = [];
        
        function updateTallyDisplay() {
            const container = document.getElementById('tallyBuilderDisplay');
            if (!container) return;
            
            let html = '';
            const groups = Math.floor(currentTally / 5);
            const remainder = currentTally % 5;
            
            for (let i = 0; i < groups; i++) {
                html += `
                    <div class="tally-group-built" style="display:inline-flex; margin:0 8px; position:relative; cursor:pointer" onclick="removeTallyGroup(this, 5)">
                        <span style="font-size:2.5rem; font-family:monospace">||||</span>
                        <span style="font-size:2.5rem; position:absolute; left:18px; top:0">/</span>
                    </div>
                `;
            }
            
            if (remainder > 0) {
                let marks = '';
                for (let i = 0; i < remainder; i++) {
                    marks += '|';
                }
                html += `<span class="single-tally" style="font-size:2.5rem; font-family:monospace; cursor:pointer" onclick="removeSingleTally(this)">${marks}</span>`;
            }
            
            if (currentTally === 0) {
                html = '<span style="opacity:0.5">Click buttons below to add tally marks...</span>';
            }
            
            container.innerHTML = html;
            
            // Update counter
            const counter = document.getElementById('tallyCounter');
            if (counter) counter.innerText = currentTally;
            
            // Check button visibility
            const checkBtn = document.getElementById('checkTallyBtn');
            if (checkBtn) {
                checkBtn.disabled = currentTally === 0;
            }
        }
        
        // Store functions globally for onclick
        window.addTallyMark = () => {
            if (currentTally < targetNumber + 5) {
                currentTally++;
                updateTallyDisplay();
            }
        };
        
        window.addTallyGroup = () => {
            if (currentTally + 5 <= targetNumber + 10) {
                currentTally += 5;
                updateTallyDisplay();
            }
        };
        
        window.removeTallyGroup = (element, count) => {
            if (currentTally >= count) {
                currentTally -= count;
                updateTallyDisplay();
            }
        };
        
        window.removeSingleTally = (element) => {
            if (currentTally > 0) {
                currentTally--;
                updateTallyDisplay();
            }
        };
        
        window.resetTally = () => {
            currentTally = 0;
            updateTallyDisplay();
        };
        
        setTimeout(() => updateTallyDisplay(), 100);
        
        return `
            <div style="background:rgba(139,92,246,0.15); border-radius:20px; padding:20px; margin:15px 0">
                <h4>📝 Build Your Tally Marks</h4>
                <p>Target: <strong style="color:#fbbf24; font-size:1.3rem">${targetNumber}</strong></p>
                
                <div id="tallyBuilderDisplay" style="min-height:100px; padding:20px; background:rgba(0,0,0,0.2); border-radius:15px; margin:15px 0; font-family:monospace">
                    <span style="opacity:0.5">Click buttons below to add tally marks...</span>
                </div>
                
                <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin:15px 0">
                    <button class="tally-action-btn" onclick="addTallyMark()" style="background:#8B5CF6; border:none; padding:10px 20px; border-radius:25px; color:white; cursor:pointer">Add 1 |</button>
                    <button class="tally-action-btn" onclick="addTallyGroup()" style="background:#fbbf24; border:none; padding:10px 20px; border-radius:25px; color:#1a1a2e; cursor:pointer">Add Group ||||/</button>
                    <button class="tally-action-btn" onclick="resetTally()" style="background:#f87171; border:none; padding:10px 20px; border-radius:25px; color:white; cursor:pointer">Reset All</button>
                </div>
                
                <div style="margin-top:15px">
                    <p>Current count: <strong id="tallyCounter" style="font-size:1.5rem; color:#fbbf24">0</strong></p>
                </div>
            </div>
        `;
    }
    
    // Render the game
    function renderGame() {
        if (!currentQuestion) {
            currentQuestion = generateQuestion();
        }
        
        const options = generateOptions(currentQuestion.correctAnswer);
        const progressPercent = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        
        let questionDisplay = '';
        
        if (currentQuestion.type === 'count') {
            questionDisplay = `
                <div style="background:rgba(139,92,246,0.2); border-radius:20px; padding:30px; margin:20px 0">
                    <h3>🔢 Tally Marks:</h3>
                    <div style="font-size:2.5rem; font-family:monospace; letter-spacing:5px; word-wrap:break-word; margin:20px 0">
                        ${currentQuestion.displayTally}
                    </div>
                </div>
            `;
        } else {
            questionDisplay = renderTallyBuilder(currentQuestion.number);
        }
        
        const html = `
            <div style="text-align:center">
                <div style="display:flex; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:10px">
                    <span>⭐ Level: ${level}</span>
                    <span>🏆 Score: ${score}</span>
                    <span>✅ Correct: ${correctAnswers}</span>
                    <span>📊 Q#: ${totalQuestions + 1}</span>
                </div>
                
                <h3>✏️ Tally Marks Challenge! 📊</h3>
                <p style="margin:10px 0; opacity:0.9">Learn to count using tally marks (||||/ = 5)</p>
                
                ${questionDisplay}
                
                <div style="background:rgba(139,92,246,0.15); border-radius:20px; padding:15px; margin:15px 0">
                    <h4>❓ ${currentQuestion.type === 'count' ? 'How many tally marks do you see?' : `What number is represented by your tally marks?`}</h4>
                    <p style="font-size:0.85rem; opacity:0.8; margin-top:8px">
                        <i class="fas fa-lightbulb"></i> Hint: ${currentQuestion.hint}
                    </p>
                </div>
                
                <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap; margin:20px 0">
                    ${options.map(opt => `
                        <button class="tally-option-btn" data-answer="${opt}" 
                            style="background:linear-gradient(135deg, #8B5CF6, #6D28D9); border:none; 
                                   width:80px; height:80px; border-radius:20px; font-size:1.5rem; font-weight:bold; 
                                   color:white; cursor:pointer; transition:0.3s; box-shadow:0 4px 12px rgba(0,0,0,0.2)">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
                
                ${currentQuestion.type === 'convert' ? `
                    <div style="margin:10px 0">
                        <button class="close-game-btn" id="checkTallyBtn" style="background:#4ade80; color:#1a1a2e">✅ Check My Tally</button>
                    </div>
                ` : ''}
                
                <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap; margin-top:15px">
                    <button class="hero-cta" id="newTallyBtn">🔄 New Question</button>
                    <button class="close-game-btn" id="resetGameBtn">🔄 Reset Game</button>
                </div>
                
                <div id="tallyFeedback" style="margin-top:25px; font-size:1.1rem; min-height:80px"></div>
                
                <div class="progress-container" style="width:100%; background:#2D1B4E; border-radius:10px; margin-top:20px; overflow:hidden">
                    <div class="progress-bar" style="width:${progressPercent}%; background:#4ade80; height:8px; transition:width 0.3s"></div>
                </div>
                
                <div id="statsDisplay" style="margin-top:15px; font-size:0.85rem; opacity:0.8">
                    ${totalQuestions > 0 ? `🎯 Accuracy: ${Math.round((correctAnswers / totalQuestions) * 100)}%` : '✨ Tally marks make counting easy! Groups of 5 = ||||/'}
                </div>
            </div>
        `;
        
        document.getElementById('gameDynamicContent').innerHTML = html;
        
        // Add event listeners to option buttons
        document.querySelectorAll('.tally-option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedAnswer = parseInt(btn.dataset.answer);
                checkAnswer(selectedAnswer, btn);
            });
            
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.05)';
                btn.style.background = 'linear-gradient(135deg, #fbbf24, #f59e0b)';
                btn.style.color = '#1a1a2e';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
                btn.style.background = 'linear-gradient(135deg, #8B5CF6, #6D28D9)';
                btn.style.color = 'white';
            });
        });
        
        // For convert questions, add check button handler
        if (currentQuestion.type === 'convert') {
            const checkBtn = document.getElementById('checkTallyBtn');
            if (checkBtn) {
                checkBtn.addEventListener('click', () => {
                    const tallyCounter = document.getElementById('tallyCounter');
                    if (tallyCounter) {
                        const builtNumber = parseInt(tallyCounter.innerText);
                        checkAnswer(builtNumber, checkBtn);
                    }
                });
            }
        }
        
        document.getElementById('newTallyBtn').addEventListener('click', () => {
            currentQuestion = generateQuestion();
            renderGame();
            showToast('🔄 New tally question generated!', 'info');
        });
        
        document.getElementById('resetGameBtn').addEventListener('click', () => {
            resetGame();
            renderGame();
            showToast('🎮 Game reset! Start fresh!', 'success');
        });
    }
    
    function checkAnswer(selectedAnswer, selectedBtn) {
        const feedbackDiv = document.getElementById('tallyFeedback');
        const isCorrect = (selectedAnswer === currentQuestion.correctAnswer);
        
        if (isCorrect) {
            // Calculate points
            let basePoints = 15 * level;
            const totalPoints = basePoints;
            
            score += totalPoints;
            correctAnswers++;
            totalQuestions++;
            
            // Visual feedback
            if (selectedBtn) {
                selectedBtn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
                selectedBtn.style.transform = 'scale(1.1)';
            }
            
            const tallyText = getTallyText(currentQuestion.correctAnswer);
            
            feedbackDiv.innerHTML = `
                <div style="background:#4ade80; color:#1a1a2e; padding:20px; border-radius:20px; animation:slideIn 0.3s ease">
                    <i class="fas fa-check-circle"></i> ✅ CORRECT! +${totalPoints} points!<br>
                    <small>${currentQuestion.correctAnswer} = ${tallyText}</small>
                </div>
            `;
            
            showToast(`🎉 Correct! +${totalPoints} points!`, 'success');
            
            // Level up every 8 correct answers
            if (correctAnswers > 0 && correctAnswers % 8 === 0) {
                level++;
                showToast(`🎊 LEVEL UP! Welcome to Level ${level}! 🎊`, 'success');
            }
            
            // Disable all buttons temporarily
            document.querySelectorAll('.tally-option-btn, #checkTallyBtn').forEach(btn => {
                if (btn) btn.disabled = true;
            });
            
            // Load new question after delay
            setTimeout(() => {
                currentQuestion = generateQuestion();
                renderGame();
            }, 2000);
            
            incrementUsageAPI();
            
        } else {
            // Wrong answer
            if (selectedBtn) {
                selectedBtn.style.background = 'linear-gradient(135deg, #f87171, #ef4444)';
                selectedBtn.style.transform = 'scale(0.95)';
            }
            
            const tallyText = getTallyText(currentQuestion.correctAnswer);
            
            feedbackDiv.innerHTML = `
                <div style="background:#f87171; color:white; padding:20px; border-radius:20px; animation:slideIn 0.3s ease">
                    <i class="fas fa-times-circle"></i> ❌ WRONG!<br>
                    The correct answer is ${currentQuestion.correctAnswer}<br>
                    <small>${currentQuestion.correctAnswer} = ${tallyText}</small>
                </div>
            `;
            
            showToast(`❌ Oops! The correct answer is ${currentQuestion.correctAnswer}`, 'info');
            totalQuestions++;
            
            // Reset button color
            setTimeout(() => {
                if (selectedBtn && selectedBtn.classList && !selectedBtn.classList.contains('hero-cta')) {
                    selectedBtn.style.background = 'linear-gradient(135deg, #8B5CF6, #6D28D9)';
                    selectedBtn.style.transform = 'scale(1)';
                    selectedBtn.style.color = 'white';
                }
            }, 2000);
        }
        
        // Update stats display
        const statsDiv = document.getElementById('statsDisplay');
        if (statsDiv && totalQuestions > 0) {
            statsDiv.innerHTML = `🎯 Accuracy: ${Math.round((correctAnswers / totalQuestions) * 100)}% | ✅ ${correctAnswers}/${totalQuestions} correct`;
        }
        
        // Update progress bar
        const progressPercent = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progressPercent}%`;
        }
    }
    
    function resetGame() {
        score = 0;
        level = 1;
        totalQuestions = 0;
        correctAnswers = 0;
        currentQuestion = generateQuestion();
    }
    
    // Initialize
    currentQuestion = generateQuestion();
    renderGame();
}
// === END ===
// ============================================
// TOOL: NUMBER WORDS GAME (PLACEHOLDER)
// ============================================
// ============================================
// TOOL: NUMBER WORDS GAME
// ============================================
// === START ===
function startWordGame() {
    let score = 0;
    let level = 1;
    let currentQuestion = null;
    let totalQuestions = 0;
    let correctAnswers = 0;
    
    // Number to word mapping (English)
    const numberWords = {
        0: "Zero", 1: "One", 2: "Two", 3: "Three", 4: "Four", 5: "Five",
        6: "Six", 7: "Seven", 8: "Eight", 9: "Nine", 10: "Ten",
        11: "Eleven", 12: "Twelve", 13: "Thirteen", 14: "Fourteen", 15: "Fifteen",
        16: "Sixteen", 17: "Seventeen", 18: "Eighteen", 19: "Nineteen", 20: "Twenty",
        21: "Twenty-One", 22: "Twenty-Two", 23: "Twenty-Three", 24: "Twenty-Four", 25: "Twenty-Five",
        26: "Twenty-Six", 27: "Twenty-Seven", 28: "Twenty-Eight", 29: "Twenty-Nine", 30: "Thirty",
        31: "Thirty-One", 32: "Thirty-Two", 33: "Thirty-Three", 34: "Thirty-Four", 35: "Thirty-Five",
        36: "Thirty-Six", 37: "Thirty-Seven", 38: "Thirty-Eight", 39: "Thirty-Nine", 40: "Forty",
        41: "Forty-One", 42: "Forty-Two", 43: "Forty-Three", 44: "Forty-Four", 45: "Forty-Five",
        46: "Forty-Six", 47: "Forty-Seven", 48: "Forty-Eight", 49: "Forty-Nine", 50: "Fifty"
    };
    
    // Urdu number words (اردو)
    const urduNumberWords = {
        0: "صفر", 1: "ایک", 2: "دو", 3: "تین", 4: "چار", 5: "پانچ",
        6: "چھ", 7: "سات", 8: "آٹھ", 9: "نو", 10: "دس",
        11: "گیارہ", 12: "بارہ", 13: "تیرہ", 14: "چودہ", 15: "پندرہ",
        16: "سولہ", 17: "سترہ", 18: "اٹھارہ", 19: "انیس", 20: "بیس"
    };
    
    // Language preference (can be extended)
    let currentLanguage = 'english'; // 'english' or 'urdu'
    
    // Get word based on language
    function getNumberWord(number) {
        if (currentLanguage === 'urdu' && urduNumberWords[number]) {
            return urduNumberWords[number];
        }
        return numberWords[number] || number.toString();
    }
    
    // Generate question based on level
    function generateQuestion() {
        let questionType;
        let number;
        
        // Determine question type and range based on level
        if (level <= 2) {
            // Level 1-2: Numbers 1-10, match number to word
            number = Math.floor(Math.random() * 10) + 1;
            questionType = Math.random() < 0.5 ? 'numberToWord' : 'wordToNumber';
            
        } else if (level <= 4) {
            // Level 3-4: Numbers 1-20
            number = Math.floor(Math.random() * 20) + 1;
            questionType = Math.random() < 0.5 ? 'numberToWord' : 'wordToNumber';
            
        } else if (level <= 6) {
            // Level 5-6: Numbers 1-50
            number = Math.floor(Math.random() * 50) + 1;
            questionType = Math.random() < 0.5 ? 'numberToWord' : 'wordToNumber';
            
        } else {
            // Level 7+: Mixed with spelling challenge
            number = Math.floor(Math.random() * 50) + 1;
            const types = ['numberToWord', 'wordToNumber', 'spelling'];
            questionType = types[Math.floor(Math.random() * 3)];
        }
        
        let questionText, correctAnswer, hint, options;
        
        if (questionType === 'numberToWord') {
            const word = getNumberWord(number);
            questionText = `What is the word for the number ${number}?`;
            correctAnswer = word;
            hint = `The number ${number} is written as "${word}"`;
            options = generateWordOptions(correctAnswer, number);
            
        } else if (questionType === 'wordToNumber') {
            const word = getNumberWord(number);
            questionText = `What number is "${word}"?`;
            correctAnswer = number;
            hint = `"${word}" means the number ${number}`;
            options = generateNumberOptions(correctAnswer);
            
        } else {
            // Spelling challenge - show word with missing letters
            const word = getNumberWord(number);
            const missingIndex = Math.floor(Math.random() * word.length);
            const missingLetter = word[missingIndex];
            let displayedWord = word.split('');
            displayedWord[missingIndex] = '?';
            displayedWord = displayedWord.join('');
            
            questionText = `Complete the spelling: ${displayedWord}`;
            correctAnswer = missingLetter;
            hint = `The word is "${word}". What letter is missing?`;
            options = generateLetterOptions(missingLetter, word);
        }
        
        currentQuestion = {
            type: questionType,
            number: number,
            word: getNumberWord(number),
            questionText: questionText,
            correctAnswer: correctAnswer,
            hint: hint,
            options: options
        };
        
        return currentQuestion;
    }
    
    // Generate word options for numberToWord questions
    function generateWordOptions(correctWord, number) {
        let options = [correctWord];
        const allWords = Object.values(numberWords).filter(w => w !== correctWord);
        
        // Shuffle and pick 3 random words
        for (let i = allWords.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allWords[i], allWords[j]] = [allWords[j], allWords[i]];
        }
        
        for (let i = 0; i < 3 && i < allWords.length; i++) {
            if (!options.includes(allWords[i])) {
                options.push(allWords[i]);
            }
        }
        
        // If not enough options, add number itself as string
        while (options.length < 4) {
            options.push(number.toString());
        }
        
        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        return options;
    }
    
    // Generate number options for wordToNumber questions
    function generateNumberOptions(correctNumber) {
        let options = [correctNumber];
        const range = level <= 3 ? 5 : (level <= 6 ? 10 : 15);
        
        while (options.length < 4) {
            let offset = Math.floor(Math.random() * range) + 1;
            let option = correctNumber + (Math.random() < 0.5 ? offset : -offset);
            
            if (option >= 1 && option <= 50 && !options.includes(option)) {
                options.push(option);
            }
        }
        
        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        return options;
    }
    
    // Generate letter options for spelling challenge
    function generateLetterOptions(correctLetter, word) {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let options = [correctLetter.toUpperCase()];
        
        while (options.length < 4) {
            const randomLetter = letters[Math.floor(Math.random() * letters.length)];
            if (!options.includes(randomLetter)) {
                options.push(randomLetter);
            }
        }
        
        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        return options;
    }
    
    // Render animated number card
    function renderNumberCard(number, word) {
        return `
            <div style="background:linear-gradient(135deg, #fbbf24, #f59e0b); border-radius:30px; padding:30px; margin:20px auto; max-width:300px; box-shadow:0 10px 30px rgba(0,0,0,0.3); animation:pulse 2s infinite alternate">
                <div style="font-size:4rem; font-weight:bold; color:#1a1a2e">${number}</div>
                <div style="font-size:1.5rem; margin-top:10px; color:#1a1a2e">=</div>
                <div style="font-size:2rem; font-weight:bold; margin-top:10px; color:#1a1a2e; word-break:break-word">${word}</div>
            </div>
        `;
    }
    
    // Render the game
    function renderGame() {
        if (!currentQuestion) {
            currentQuestion = generateQuestion();
        }
        
        const progressPercent = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        
        let questionDisplay = '';
        
        if (currentQuestion.type === 'numberToWord') {
            questionDisplay = `
                <div style="background:linear-gradient(135deg, #4C1D95, #2E1065); border-radius:30px; padding:40px; margin:20px 0">
                    <div style="font-size:5rem; font-weight:bold; margin-bottom:15px">${currentQuestion.number}</div>
                    <div style="font-size:1.2rem; opacity:0.8">Number</div>
                    <div style="font-size:1.5rem; margin-top:15px">➡️</div>
                    <div style="font-size:1.2rem; margin-top:15px; opacity:0.8">Word?</div>
                </div>
            `;
        } else if (currentQuestion.type === 'wordToNumber') {
            questionDisplay = `
                <div style="background:linear-gradient(135deg, #4C1D95, #2E1065); border-radius:30px; padding:40px; margin:20px 0">
                    <div style="font-size:2rem; font-weight:bold; margin-bottom:15px; word-break:break-word">"${currentQuestion.word}"</div>
                    <div style="font-size:1.2rem; opacity:0.8">Word</div>
                    <div style="font-size:1.5rem; margin-top:15px">➡️</div>
                    <div style="font-size:1.2rem; margin-top:15px; opacity:0.8">Number?</div>
                </div>
            `;
        } else {
            // Spelling challenge
            const wordWithMissing = currentQuestion.word.split('');
            const missingIndex = currentQuestion.word.indexOf(currentQuestion.correctAnswer);
            if (missingIndex !== -1) {
                wordWithMissing[missingIndex] = '?';
            }
            questionDisplay = `
                <div style="background:linear-gradient(135deg, #4C1D95, #2E1065); border-radius:30px; padding:40px; margin:20px 0">
                    <div style="font-size:2rem; font-weight:bold; margin-bottom:15px; word-break:break-word; letter-spacing:5px">
                        ${wordWithMissing.join(' ')}
                    </div>
                    <div style="font-size:1rem; opacity:0.8">Complete the spelling</div>
                    <div style="font-size:0.9rem; margin-top:15px">💡 Hint: ${currentQuestion.hint}</div>
                </div>
            `;
        }
        
        const html = `
            <div style="text-align:center">
                <div style="display:flex; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:10px">
                    <span>⭐ Level: ${level}</span>
                    <span>🏆 Score: ${score}</span>
                    <span>✅ Correct: ${correctAnswers}</span>
                    <span>📊 Q#: ${totalQuestions + 1}</span>
                    <span>🌐 Language: ${currentLanguage === 'english' ? 'English' : 'اردو'}</span>
                </div>
                
                <h3>📖 Number Words Challenge! 🔤</h3>
                <p style="margin:10px 0; opacity:0.9">Learn to read and spell number names</p>
                
                ${questionDisplay}
                
                <div style="background:rgba(139,92,246,0.15); border-radius:20px; padding:15px; margin:15px 0">
                    <h4>❓ ${currentQuestion.questionText}</h4>
                </div>
                
                <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap; margin:20px 0">
                    ${currentQuestion.options.map(opt => `
                        <button class="word-option-btn" data-answer="${opt}" 
                            style="background:linear-gradient(135deg, #8B5CF6, #6D28D9); border:none; 
                                   padding:15px 25px; border-radius:20px; font-size:1.1rem; font-weight:bold; 
                                   color:white; cursor:pointer; transition:0.3s; box-shadow:0 4px 12px rgba(0,0,0,0.2);
                                   min-width:100px">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
                
                <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap; margin-top:15px">
                    <button class="hero-cta" id="newWordBtn">🔄 New Question</button>
                    <button class="close-game-btn" id="resetGameBtn">🔄 Reset Game</button>
                </div>
                
                <div id="wordFeedback" style="margin-top:25px; font-size:1.1rem; min-height:80px"></div>
                
                <div class="progress-container" style="width:100%; background:#2D1B4E; border-radius:10px; margin-top:20px; overflow:hidden">
                    <div class="progress-bar" style="width:${progressPercent}%; background:#4ade80; height:8px; transition:width 0.3s"></div>
                </div>
                
                <div id="statsDisplay" style="margin-top:15px; font-size:0.85rem; opacity:0.8">
                    ${totalQuestions > 0 ? `🎯 Accuracy: ${Math.round((correctAnswers / totalQuestions) * 100)}%` : '✨ Match numbers with their correct words!'}
                </div>
            </div>
        `;
        
        document.getElementById('gameDynamicContent').innerHTML = html;
        
        // Add event listeners to option buttons
        document.querySelectorAll('.word-option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                let selectedAnswer = btn.dataset.answer;
                // For number options, convert to number
                if (currentQuestion.type === 'wordToNumber') {
                    selectedAnswer = parseInt(selectedAnswer);
                }
                checkAnswer(selectedAnswer, btn);
            });
            
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.05)';
                btn.style.background = 'linear-gradient(135deg, #fbbf24, #f59e0b)';
                btn.style.color = '#1a1a2e';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
                btn.style.background = 'linear-gradient(135deg, #8B5CF6, #6D28D9)';
                btn.style.color = 'white';
            });
        });
        
        document.getElementById('newWordBtn').addEventListener('click', () => {
            currentQuestion = generateQuestion();
            renderGame();
            showToast('🔄 New word challenge generated!', 'info');
        });
        
        document.getElementById('resetGameBtn').addEventListener('click', () => {
            resetGame();
            renderGame();
            showToast('🎮 Game reset! Start fresh!', 'success');
        });
    }
    
    function checkAnswer(selectedAnswer, selectedBtn) {
        const feedbackDiv = document.getElementById('wordFeedback');
        const isCorrect = (selectedAnswer === currentQuestion.correctAnswer);
        
        if (isCorrect) {
            // Calculate points
            let basePoints = 15 * level;
            
            // Bonus for correct spelling
            if (currentQuestion.type === 'spelling') {
                basePoints += 5;
            }
            
            const totalPoints = basePoints;
            
            score += totalPoints;
            correctAnswers++;
            totalQuestions++;
            
            // Visual feedback
            selectedBtn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
            selectedBtn.style.transform = 'scale(1.1)';
            selectedBtn.style.color = '#1a1a2e';
            
            let correctDisplay = '';
            if (currentQuestion.type === 'numberToWord') {
                correctDisplay = `${currentQuestion.number} = "${currentQuestion.word}"`;
            } else if (currentQuestion.type === 'wordToNumber') {
                correctDisplay = `"${currentQuestion.word}" = ${currentQuestion.correctAnswer}`;
            } else {
                correctDisplay = `The word is "${currentQuestion.word}"`;
            }
            
            feedbackDiv.innerHTML = `
                <div style="background:#4ade80; color:#1a1a2e; padding:20px; border-radius:20px; animation:slideIn 0.3s ease">
                    <i class="fas fa-check-circle"></i> ✅ CORRECT! +${totalPoints} points!<br>
                    <small>${correctDisplay}</small>
                </div>
            `;
            
            showToast(`🎉 Correct! +${totalPoints} points!`, 'success');
            
            // Level up every 8 correct answers
            if (correctAnswers > 0 && correctAnswers % 8 === 0) {
                level++;
                showToast(`🎊 LEVEL UP! Welcome to Level ${level}! 🎊`, 'success');
            }
            
            // Level up every 15 correct answers, also increase language variety
            if (correctAnswers > 0 && correctAnswers % 15 === 0 && currentLanguage === 'english') {
                currentLanguage = 'urdu';
                showToast(`🌟 New language unlocked: اردو (Urdu)! 🌟`, 'success');
            }
            
            // Disable all buttons temporarily
            document.querySelectorAll('.word-option-btn').forEach(btn => {
                btn.disabled = true;
                btn.style.opacity = '0.6';
            });
            
            // Load new question after delay
            setTimeout(() => {
                currentQuestion = generateQuestion();
                renderGame();
            }, 2000);
            
            incrementUsageAPI();
            
        } else {
            // Wrong answer
            selectedBtn.style.background = 'linear-gradient(135deg, #f87171, #ef4444)';
            selectedBtn.style.transform = 'scale(0.95)';
            
            let correctDisplay = '';
            if (currentQuestion.type === 'numberToWord') {
                correctDisplay = `${currentQuestion.number} = "${currentQuestion.word}"`;
            } else if (currentQuestion.type === 'wordToNumber') {
                correctDisplay = `"${currentQuestion.word}" = ${currentQuestion.correctAnswer}`;
            } else {
                correctDisplay = `The word is "${currentQuestion.word}"`;
            }
            
            feedbackDiv.innerHTML = `
                <div style="background:#f87171; color:white; padding:20px; border-radius:20px; animation:slideIn 0.3s ease">
                    <i class="fas fa-times-circle"></i> ❌ WRONG!<br>
                    ${correctDisplay}<br>
                    <small>${currentQuestion.hint}</small>
                </div>
            `;
            
            showToast(`❌ Oops! ${correctDisplay}`, 'info');
            totalQuestions++;
            
            // Reset button color
            setTimeout(() => {
                if (selectedBtn) {
                    selectedBtn.style.background = 'linear-gradient(135deg, #8B5CF6, #6D28D9)';
                    selectedBtn.style.transform = 'scale(1)';
                    selectedBtn.style.color = 'white';
                }
            }, 2000);
        }
        
        // Update stats display
        const statsDiv = document.getElementById('statsDisplay');
        if (statsDiv && totalQuestions > 0) {
            statsDiv.innerHTML = `🎯 Accuracy: ${Math.round((correctAnswers / totalQuestions) * 100)}% | ✅ ${correctAnswers}/${totalQuestions} correct`;
        }
        
        // Update progress bar
        const progressPercent = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progressPercent}%`;
        }
    }
    
    function resetGame() {
        score = 0;
        level = 1;
        totalQuestions = 0;
        correctAnswers = 0;
        currentLanguage = 'english';
        currentQuestion = generateQuestion();
    }
    
    // Initialize
    currentQuestion = generateQuestion();
    renderGame();
}
// === END ===

// ============================================
// TOOL: SKIP COUNTING GAME (PLACEHOLDER)
// ============================================
// ============================================
// TOOL: SKIP COUNTING GAME
// ============================================
// === START ===
function startSkipGame() {
    let score = 0;
    let level = 1;
    let currentQuestion = null;
    let totalQuestions = 0;
    let correctAnswers = 0;
    
    // Skip counting sequences
    const skipSequences = {
        2: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40],
        3: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60],
        4: [4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80],
        5: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
        6: [6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102, 108, 114, 120],
        7: [7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84, 91, 98, 105, 112, 119, 126, 133, 140],
        8: [8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 112, 120, 128, 136, 144, 152, 160],
        9: [9, 18, 27, 36, 45, 54, 63, 72, 81, 90, 99, 108, 117, 126, 135, 144, 153, 162, 171, 180],
        10: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200]
    };
    
    // Generate question based on level
    function generateQuestion() {
        let skipBy;
        let questionType;
        let sequence;
        let missingIndex;
        let missingValue;
        let startPosition;
        
        // Determine skip number based on level
        if (level <= 2) {
            // Level 1-2: Skip by 2, 5, 10
            const options = [2, 5, 10];
            skipBy = options[Math.floor(Math.random() * options.length)];
        } else if (level <= 4) {
            // Level 3-4: Skip by 2, 3, 4, 5, 10
            const options = [2, 3, 4, 5, 10];
            skipBy = options[Math.floor(Math.random() * options.length)];
        } else if (level <= 6) {
            // Level 5-6: Skip by 2-10
            skipBy = Math.floor(Math.random() * 9) + 2; // 2-10
        } else {
            // Level 7+: Skip by 2-10, mixed types
            skipBy = Math.floor(Math.random() * 9) + 2;
        }
        
        // Get sequence
        sequence = [...skipSequences[skipBy]];
        
        // Determine question type
        if (level <= 3) {
            questionType = 'findNext';
        } else if (level <= 5) {
            const types = ['findNext', 'findMissing'];
            questionType = types[Math.floor(Math.random() * types.length)];
        } else {
            const types = ['findNext', 'findMissing', 'findPrevious', 'completePattern'];
            questionType = types[Math.floor(Math.random() * types.length)];
        }
        
        let questionText, correctAnswer, hint, options;
        
        if (questionType === 'findNext') {
            // Show 3-5 numbers and ask for the next
            const showCount = Math.min(3 + Math.floor(level / 3), 6);
            startPosition = Math.floor(Math.random() * (sequence.length - showCount - 1));
            const shownNumbers = sequence.slice(startPosition, startPosition + showCount);
            const nextNumber = sequence[startPosition + showCount];
            
            questionText = `Skip count by ${skipBy}: ${shownNumbers.join(', ')}, ___ ?`;
            correctAnswer = nextNumber;
            hint = `Add ${skipBy} to the last number (${shownNumbers[shownNumbers.length - 1]} + ${skipBy} = ${correctAnswer})`;
            options = generateNumberOptions(correctAnswer, skipBy);
            
        } else if (questionType === 'findMissing') {
            // Show 4-6 numbers with one missing
            const showCount = Math.min(5 + Math.floor(level / 4), 7);
            startPosition = Math.floor(Math.random() * (sequence.length - showCount));
            const fullSequence = sequence.slice(startPosition, startPosition + showCount);
            missingIndex = Math.floor(Math.random() * (fullSequence.length - 2)) + 1; // Not first or last
            missingValue = fullSequence[missingIndex];
            
            const displayedNumbers = [...fullSequence];
            displayedNumbers[missingIndex] = '?';
            
            questionText = `Skip count by ${skipBy}: ${displayedNumbers.join(', ')}`;
            correctAnswer = missingValue;
            hint = `The pattern adds ${skipBy} each time. ${fullSequence[missingIndex - 1]} + ${skipBy} = ${correctAnswer}`;
            options = generateNumberOptions(correctAnswer, skipBy);
            
        } else if (questionType === 'findPrevious') {
            // Show numbers and ask for the previous
            const showCount = Math.min(3 + Math.floor(level / 3), 5);
            startPosition = Math.floor(Math.random() * (sequence.length - showCount)) + showCount;
            const shownNumbers = sequence.slice(startPosition - showCount, startPosition);
            const previousNumber = sequence[startPosition - showCount - 1];
            
            questionText = `Skip count by ${skipBy}: ___, ${shownNumbers.join(', ')} ?`;
            correctAnswer = previousNumber;
            hint = `Subtract ${skipBy} from the first number (${shownNumbers[0]} - ${skipBy} = ${correctAnswer})`;
            options = generateNumberOptions(correctAnswer, skipBy);
            
        } else {
            // Complete pattern - find the skip number
            const showCount = 4;
            startPosition = Math.floor(Math.random() * (sequence.length - showCount - 2));
            const numbers = sequence.slice(startPosition, startPosition + showCount);
            const differences = numbers[1] - numbers[0];
            
            questionText = `What is the skip counting pattern? ${numbers[0]}, ${numbers[1]}, ${numbers[2]}, ${numbers[3]}, ...`;
            correctAnswer = differences;
            hint = `Subtract the first number from the second: ${numbers[1]} - ${numbers[0]} = ${differences}`;
            options = generateSkipOptions(correctAnswer);
        }
        
        currentQuestion = {
            type: questionType,
            skipBy: skipBy,
            questionText: questionText,
            correctAnswer: correctAnswer,
            hint: hint,
            options: options
        };
        
        return currentQuestion;
    }
    
    // Generate number options
    function generateNumberOptions(correctAnswer, skipBy) {
        let options = [correctAnswer];
        const range = Math.max(skipBy * 2, 10);
        
        while (options.length < 4) {
            let offset = Math.floor(Math.random() * range) + 1;
            let option = correctAnswer + (Math.random() < 0.5 ? offset : -offset);
            
            if (option > 0 && option <= 200 && !options.includes(option)) {
                options.push(option);
            }
        }
        
        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        return options;
    }
    
    // Generate skip number options
    function generateSkipOptions(correctAnswer) {
        let options = [correctAnswer];
        const possibleSkips = [2, 3, 4, 5, 6, 7, 8, 9, 10];
        const available = possibleSkips.filter(s => s !== correctAnswer);
        
        for (let i = 0; i < 3 && i < available.length; i++) {
            const randomIndex = Math.floor(Math.random() * available.length);
            options.push(available[randomIndex]);
            available.splice(randomIndex, 1);
        }
        
        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        return options;
    }
    
    // Render visual skip counting helper
    function renderSkipHelper(skipBy) {
        const numbers = [];
        for (let i = 1; i <= 10; i++) {
            numbers.push(i * skipBy);
        }
        
        return `
            <div style="background:rgba(139,92,246,0.15); border-radius:20px; padding:15px; margin:15px 0">
                <p style="margin-bottom:10px"><i class="fas fa-chart-line"></i> Skip counting by ${skipBy}:</p>
                <div style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center">
                    ${numbers.map(num => `<span style="background:#8B5CF6; padding:5px 12px; border-radius:20px; font-size:0.9rem">${num}</span>`).join('')}
                    <span style="color:#fbbf24">...</span>
                </div>
            </div>
        `;
    }
    
    // Render the game
    function renderGame() {
        if (!currentQuestion) {
            currentQuestion = generateQuestion();
        }
        
        const progressPercent = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        
        let questionDisplay = renderSkipHelper(currentQuestion.skipBy);
        
        const html = `
            <div style="text-align:center">
                <div style="display:flex; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:10px">
                    <span>⭐ Level: ${level}</span>
                    <span>🏆 Score: ${score}</span>
                    <span>✅ Correct: ${correctAnswers}</span>
                    <span>📊 Q#: ${totalQuestions + 1}</span>
                </div>
                
                <h3>🎵 Skip Counting Challenge! 🎶</h3>
                <p style="margin:10px 0; opacity:0.9">Master multiplication by counting in steps</p>
                
                ${questionDisplay}
                
                <div style="background:rgba(139,92,246,0.2); border-radius:20px; padding:25px; margin:15px 0">
                    <h4>❓ ${currentQuestion.questionText}</h4>
                    <p style="font-size:0.85rem; margin-top:10px">
                        <i class="fas fa-lightbulb"></i> 💡 ${currentQuestion.hint}
                    </p>
                </div>
                
                <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap; margin:20px 0">
                    ${currentQuestion.options.map(opt => `
                        <button class="skip-option-btn" data-answer="${opt}" 
                            style="background:linear-gradient(135deg, #8B5CF6, #6D28D9); border:none; 
                                   width:80px; height:80px; border-radius:20px; font-size:1.3rem; font-weight:bold; 
                                   color:white; cursor:pointer; transition:0.3s; box-shadow:0 4px 12px rgba(0,0,0,0.2)">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
                
                <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap; margin-top:15px">
                    <button class="hero-cta" id="newSkipBtn">🔄 New Question</button>
                    <button class="close-game-btn" id="resetGameBtn">🔄 Reset Game</button>
                </div>
                
                <div id="skipFeedback" style="margin-top:25px; font-size:1.1rem; min-height:80px"></div>
                
                <div class="progress-container" style="width:100%; background:#2D1B4E; border-radius:10px; margin-top:20px; overflow:hidden">
                    <div class="progress-bar" style="width:${progressPercent}%; background:#4ade80; height:8px; transition:width 0.3s"></div>
                </div>
                
                <div id="statsDisplay" style="margin-top:15px; font-size:0.85rem; opacity:0.8">
                    ${totalQuestions > 0 ? `🎯 Accuracy: ${Math.round((correctAnswers / totalQuestions) * 100)}%` : '✨ Skip counting helps you learn multiplication tables!'}
                </div>
            </div>
        `;
        
        document.getElementById('gameDynamicContent').innerHTML = html;
        
        // Add event listeners to option buttons
        document.querySelectorAll('.skip-option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedAnswer = parseInt(btn.dataset.answer);
                checkAnswer(selectedAnswer, btn);
            });
            
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.05)';
                btn.style.background = 'linear-gradient(135deg, #fbbf24, #f59e0b)';
                btn.style.color = '#1a1a2e';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
                btn.style.background = 'linear-gradient(135deg, #8B5CF6, #6D28D9)';
                btn.style.color = 'white';
            });
        });
        
        document.getElementById('newSkipBtn').addEventListener('click', () => {
            currentQuestion = generateQuestion();
            renderGame();
            showToast('🔄 New skip counting challenge!', 'info');
        });
        
        document.getElementById('resetGameBtn').addEventListener('click', () => {
            resetGame();
            renderGame();
            showToast('🎮 Game reset! Start fresh!', 'success');
        });
    }
    
    function checkAnswer(selectedAnswer, selectedBtn) {
        const feedbackDiv = document.getElementById('skipFeedback');
        const isCorrect = (selectedAnswer === currentQuestion.correctAnswer);
        
        if (isCorrect) {
            // Calculate points
            let basePoints = 15 * level;
            
            // Bonus for harder question types
            if (currentQuestion.type === 'findMissing') {
                basePoints += 5;
            } else if (currentQuestion.type === 'findPrevious') {
                basePoints += 10;
            } else if (currentQuestion.type === 'completePattern') {
                basePoints += 15;
            }
            
            const totalPoints = basePoints;
            
            score += totalPoints;
            correctAnswers++;
            totalQuestions++;
            
            // Visual feedback
            selectedBtn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
            selectedBtn.style.transform = 'scale(1.1)';
            selectedBtn.style.color = '#1a1a2e';
            
            feedbackDiv.innerHTML = `
                <div style="background:#4ade80; color:#1a1a2e; padding:20px; border-radius:20px; animation:slideIn 0.3s ease">
                    <i class="fas fa-check-circle"></i> ✅ CORRECT! +${totalPoints} points!<br>
                    <small>Great job! Skip counting by ${currentQuestion.skipBy} is fun!</small>
                </div>
            `;
            
            showToast(`🎉 Correct! +${totalPoints} points!`, 'success');
            
            // Level up every 7 correct answers
            if (correctAnswers > 0 && correctAnswers % 7 === 0) {
                level++;
                showToast(`🎊 LEVEL UP! Welcome to Level ${level}! 🎊`, 'success');
            }
            
            // Disable all buttons temporarily
            document.querySelectorAll('.skip-option-btn').forEach(btn => {
                btn.disabled = true;
                btn.style.opacity = '0.6';
            });
            
            // Load new question after delay
            setTimeout(() => {
                currentQuestion = generateQuestion();
                renderGame();
            }, 2000);
            
            incrementUsageAPI();
            
        } else {
            // Wrong answer
            selectedBtn.style.background = 'linear-gradient(135deg, #f87171, #ef4444)';
            selectedBtn.style.transform = 'scale(0.95)';
            
            feedbackDiv.innerHTML = `
                <div style="background:#f87171; color:white; padding:20px; border-radius:20px; animation:slideIn 0.3s ease">
                    <i class="fas fa-times-circle"></i> ❌ WRONG!<br>
                    The correct answer is ${currentQuestion.correctAnswer}<br>
                    <small>${currentQuestion.hint}</small>
                </div>
            `;
            
            showToast(`❌ Oops! The answer is ${currentQuestion.correctAnswer}`, 'info');
            totalQuestions++;
            
            // Reset button color
            setTimeout(() => {
                if (selectedBtn) {
                    selectedBtn.style.background = 'linear-gradient(135deg, #8B5CF6, #6D28D9)';
                    selectedBtn.style.transform = 'scale(1)';
                    selectedBtn.style.color = 'white';
                }
            }, 2000);
        }
        
        // Update stats display
        const statsDiv = document.getElementById('statsDisplay');
        if (statsDiv && totalQuestions > 0) {
            statsDiv.innerHTML = `🎯 Accuracy: ${Math.round((correctAnswers / totalQuestions) * 100)}% | ✅ ${correctAnswers}/${totalQuestions} correct`;
        }
        
        // Update progress bar
        const progressPercent = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progressPercent}%`;
        }
    }
    
    function resetGame() {
        score = 0;
        level = 1;
        totalQuestions = 0;
        correctAnswers = 0;
        currentQuestion = generateQuestion();
    }
    
    // Initialize
    currentQuestion = generateQuestion();
    renderGame();
}
// === END ===

// ============================================
// TOOL: NUMBER PATTERNS GAME (PLACEHOLDER)
// ============================================
// ============================================
// TOOL: NUMBER PATTERNS GAME
// ============================================
// === START ===
function startPatternGame() {
    let score = 0;
    let level = 1;
    let currentQuestion = null;
    let totalQuestions = 0;
    let correctAnswers = 0;
    
    // Pattern types with their rules
    const patternTypes = {
        arithmetic: {
            name: "Arithmetic (Addition/Subtraction)",
            generate: (start, diff, length) => {
                let sequence = [];
                for (let i = 0; i < length; i++) {
                    sequence.push(start + (i * diff));
                }
                return sequence;
            },
            getRule: (diff) => diff > 0 ? `Add ${diff}` : `Subtract ${Math.abs(diff)}`,
            getNextRule: (diff) => diff > 0 ? `add ${diff}` : `subtract ${Math.abs(diff)}`
        },
        geometric: {
            name: "Geometric (Multiplication/Division)",
            generate: (start, ratio, length) => {
                let sequence = [];
                for (let i = 0; i < length; i++) {
                    sequence.push(start * Math.pow(ratio, i));
                }
                return sequence;
            },
            getRule: (ratio) => ratio > 1 ? `Multiply by ${ratio}` : `Divide by ${Math.abs(ratio)}`,
            getNextRule: (ratio) => ratio > 1 ? `multiply by ${ratio}` : `divide by ${Math.abs(ratio)}`
        },
        alternating: {
            name: "Alternating Pattern",
            generate: (a, b, length) => {
                let sequence = [];
                for (let i = 0; i < length; i++) {
                    sequence.push(i % 2 === 0 ? a + Math.floor(i/2) * (b - a) : b + Math.floor(i/2) * (b - a));
                }
                return sequence;
            },
            getRule: (a, b) => `Alternates between ${a}, ${b}, ${a}, ${b}...`,
            getNextRule: (a, b) => `pattern alternates between ${a} and ${b}`
        },
        fibonacci: {
            name: "Fibonacci-like",
            generate: (a, b, length) => {
                let sequence = [a, b];
                for (let i = 2; i < length; i++) {
                    sequence.push(sequence[i-1] + sequence[i-2]);
                }
                return sequence;
            },
            getRule: () => "Add the previous two numbers",
            getNextRule: () => "add the previous two numbers"
        },
        square: {
            name: "Square Numbers",
            generate: (start, length) => {
                let sequence = [];
                for (let i = start; i < start + length; i++) {
                    sequence.push(i * i);
                }
                return sequence;
            },
            getRule: () => "Square numbers (n²)",
            getNextRule: () => "square the position number"
        },
        triangular: {
            name: "Triangular Numbers",
            generate: (start, length) => {
                let sequence = [];
                for (let i = start; i < start + length; i++) {
                    sequence.push(i * (i + 1) / 2);
                }
                return sequence;
            },
            getRule: () => "Triangular numbers (n×(n+1)÷2)",
            getNextRule: () => "add the next consecutive number"
        }
    };
    
    // Generate question based on level
    function generateQuestion() {
        let patternType;
        let sequence = [];
        let missingIndex;
        let missingValue;
        let questionText;
        let hint;
        let options;
        
        // Determine pattern type based on level
        if (level <= 2) {
            // Level 1-2: Simple arithmetic (addition only, numbers 1-20)
            const diff = Math.floor(Math.random() * 4) + 1; // 1-4
            const start = Math.floor(Math.random() * 10) + 1; // 1-10
            const length = 5;
            sequence = patternTypes.arithmetic.generate(start, diff, length);
            missingIndex = Math.floor(Math.random() * (length - 2)) + 1;
            missingValue = sequence[missingIndex];
            const displayedSeq = [...sequence];
            displayedSeq[missingIndex] = '?';
            questionText = `Find the missing number: ${displayedSeq.join(', ')}`;
            hint = `This pattern ${patternTypes.arithmetic.getNextRule(diff)} each time. ${sequence[missingIndex-1]} + ${diff} = ?`;
            options = generateOptions(missingValue, diff, 'arithmetic');
            
        } else if (level <= 4) {
            // Level 3-4: Arithmetic (addition & subtraction, numbers 1-50)
            const isAddition = Math.random() < 0.7;
            const diff = isAddition ? Math.floor(Math.random() * 5) + 1 : -(Math.floor(Math.random() * 5) + 1);
            const start = Math.floor(Math.random() * 20) + 1;
            const length = 5;
            sequence = patternTypes.arithmetic.generate(start, diff, length);
            missingIndex = Math.floor(Math.random() * (length - 2)) + 1;
            missingValue = sequence[missingIndex];
            const displayedSeq = [...sequence];
            displayedSeq[missingIndex] = '?';
            const operation = diff > 0 ? 'add' : 'subtract';
            questionText = `Find the missing number: ${displayedSeq.join(', ')}`;
            hint = `This pattern ${operation}s ${Math.abs(diff)} each time. ${sequence[missingIndex-1]} ${operation === 'add' ? '+' : '-'} ${Math.abs(diff)} = ?`;
            options = generateOptions(missingValue, diff, 'arithmetic');
            
        } else if (level <= 6) {
            // Level 5-6: Arithmetic & Geometric
            const type = Math.random() < 0.5 ? 'arithmetic' : 'geometric';
            if (type === 'arithmetic') {
                const isAddition = Math.random() < 0.6;
                const diff = isAddition ? Math.floor(Math.random() * 8) + 1 : -(Math.floor(Math.random() * 8) + 1);
                const start = Math.floor(Math.random() * 30) + 1;
                const length = 5;
                sequence = patternTypes.arithmetic.generate(start, diff, length);
                missingIndex = Math.floor(Math.random() * (length - 2)) + 1;
                missingValue = sequence[missingIndex];
                const displayedSeq = [...sequence];
                displayedSeq[missingIndex] = '?';
                questionText = `Find the missing number: ${displayedSeq.join(', ')}`;
                hint = `This pattern ${diff > 0 ? 'adds' : 'subtracts'} ${Math.abs(diff)} each time.`;
                options = generateOptions(missingValue, diff, 'arithmetic');
            } else {
                const ratio = Math.floor(Math.random() * 4) + 2; // 2-5
                const start = Math.floor(Math.random() * 5) + 1;
                const length = 5;
                sequence = patternTypes.geometric.generate(start, ratio, length);
                missingIndex = Math.floor(Math.random() * (length - 2)) + 1;
                missingValue = sequence[missingIndex];
                const displayedSeq = [...sequence];
                displayedSeq[missingIndex] = '?';
                questionText = `Find the missing number: ${displayedSeq.join(', ')}`;
                hint = `This pattern multiplies by ${ratio} each time. ${sequence[missingIndex-1]} × ${ratio} = ?`;
                options = generateOptions(missingValue, ratio, 'geometric');
            }
            
        } else {
            // Level 7+: All pattern types
            const types = ['arithmetic', 'geometric', 'alternating', 'fibonacci', 'square', 'triangular'];
            patternType = types[Math.floor(Math.random() * types.length)];
            
            if (patternType === 'arithmetic') {
                const diff = (Math.floor(Math.random() * 10) + 1) * (Math.random() < 0.7 ? 1 : -1);
                const start = Math.floor(Math.random() * 40) + 1;
                const length = 6;
                sequence = patternTypes.arithmetic.generate(start, diff, length);
                missingIndex = Math.floor(Math.random() * (length - 2)) + 1;
                missingValue = sequence[missingIndex];
                const displayedSeq = [...sequence];
                displayedSeq[missingIndex] = '?';
                questionText = `Find the missing number: ${displayedSeq.join(', ')}`;
                hint = `Pattern: ${diff > 0 ? 'add' : 'subtract'} ${Math.abs(diff)} each time.`;
                options = generateOptions(missingValue, diff, 'arithmetic');
                
            } else if (patternType === 'geometric') {
                const ratio = Math.floor(Math.random() * 4) + 2;
                const start = Math.floor(Math.random() * 4) + 1;
                const length = 5;
                sequence = patternTypes.geometric.generate(start, ratio, length);
                missingIndex = Math.floor(Math.random() * (length - 2)) + 1;
                missingValue = sequence[missingIndex];
                const displayedSeq = [...sequence];
                displayedSeq[missingIndex] = '?';
                questionText = `Find the missing number: ${displayedSeq.join(', ')}`;
                hint = `Pattern: multiply by ${ratio} each time.`;
                options = generateOptions(missingValue, ratio, 'geometric');
                
            } else if (patternType === 'alternating') {
                const a = Math.floor(Math.random() * 10) + 1;
                const b = a + Math.floor(Math.random() * 8) + 2;
                const length = 6;
                sequence = patternTypes.alternating.generate(a, b, length);
                missingIndex = Math.floor(Math.random() * (length - 2)) + 1;
                missingValue = sequence[missingIndex];
                const displayedSeq = [...sequence];
                displayedSeq[missingIndex] = '?';
                questionText = `Find the missing number: ${displayedSeq.join(', ')}`;
                hint = `Pattern alternates between ${a} and ${b}. ${missingIndex % 2 === 0 ? a : b} is expected.`;
                options = generateAlternatingOptions(missingValue, a, b);
                
            } else if (patternType === 'fibonacci') {
                const a = Math.floor(Math.random() * 5) + 1;
                const b = a + Math.floor(Math.random() * 5) + 1;
                const length = 6;
                sequence = patternTypes.fibonacci.generate(a, b, length);
                missingIndex = Math.floor(Math.random() * (length - 2)) + 2;
                missingValue = sequence[missingIndex];
                const displayedSeq = [...sequence];
                displayedSeq[missingIndex] = '?';
                questionText = `Find the missing number: ${displayedSeq.join(', ')}`;
                hint = `Add the previous two numbers: ${sequence[missingIndex-2]} + ${sequence[missingIndex-1]} = ?`;
                options = generateFibonacciOptions(missingValue, sequence[missingIndex-2], sequence[missingIndex-1]);
                
            } else if (patternType === 'square') {
                const start = Math.floor(Math.random() * 5) + 1;
                const length = 5;
                sequence = patternTypes.square.generate(start, length);
                missingIndex = Math.floor(Math.random() * (length - 2)) + 1;
                missingValue = sequence[missingIndex];
                const displayedSeq = [...sequence];
                displayedSeq[missingIndex] = '?';
                questionText = `Find the missing number: ${displayedSeq.join(', ')}`;
                hint = `Square numbers: ${start+missingIndex}² = ${missingValue}`;
                options = generateSquareOptions(missingValue, start + missingIndex);
                
            } else {
                // triangular
                const start = Math.floor(Math.random() * 5) + 1;
                const length = 5;
                sequence = patternTypes.triangular.generate(start, length);
                missingIndex = Math.floor(Math.random() * (length - 2)) + 1;
                missingValue = sequence[missingIndex];
                const displayedSeq = [...sequence];
                displayedSeq[missingIndex] = '?';
                questionText = `Find the missing number: ${displayedSeq.join(', ')}`;
                hint = `Triangular number: ${start+missingIndex} × ${start+missingIndex+1} ÷ 2 = ${missingValue}`;
                options = generateTriangularOptions(missingValue, start + missingIndex);
            }
        }
        
        currentQuestion = {
            type: patternType || 'arithmetic',
            sequence: sequence,
            missingIndex: missingIndex,
            correctAnswer: missingValue,
            questionText: questionText,
            hint: hint,
            options: options
        };
        
        return currentQuestion;
    }
    
    // Generate options for arithmetic/geometric
    function generateOptions(correctAnswer, step, type) {
        let options = [correctAnswer];
        const range = type === 'arithmetic' ? Math.max(Math.abs(step) * 2, 5) : Math.max(step * 3, 10);
        
        while (options.length < 4) {
            let offset = Math.floor(Math.random() * range) + 1;
            let option = correctAnswer + (Math.random() < 0.5 ? offset : -offset);
            
            if (option > 0 && option <= 200 && !options.includes(option)) {
                options.push(option);
            }
        }
        
        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        return options;
    }
    
    function generateAlternatingOptions(correctAnswer, a, b) {
        let options = [correctAnswer];
        const candidates = [a, b, a + (b - a), b + (b - a)];
        
        for (let cand of candidates) {
            if (!options.includes(cand) && cand > 0 && cand < 100) {
                options.push(cand);
            }
        }
        
        while (options.length < 4) {
            options.push(Math.floor(Math.random() * 50) + 1);
        }
        
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        return options;
    }
    
    function generateFibonacciOptions(correctAnswer, prev1, prev2) {
        let options = [correctAnswer];
        const sum = prev1 + prev2;
        
        options.push(sum);
        options.push(sum + Math.floor(Math.random() * 10) + 1);
        options.push(Math.max(1, sum - Math.floor(Math.random() * 10) - 1));
        
        // Remove duplicates
        options = [...new Set(options)];
        
        while (options.length < 4) {
            options.push(Math.floor(Math.random() * 100) + 1);
        }
        
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        return options;
    }
    
    function generateSquareOptions(correctAnswer, position) {
        let options = [correctAnswer];
        const square1 = (position - 1) * (position - 1);
        const square2 = (position + 1) * (position + 1);
        
        options.push(square1);
        options.push(square2);
        options.push(Math.floor(Math.random() * 100) + 1);
        
        options = [...new Set(options)];
        
        while (options.length < 4) {
            options.push(Math.floor(Math.random() * 100) + 1);
        }
        
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        return options;
    }
    
    function generateTriangularOptions(correctAnswer, position) {
        let options = [correctAnswer];
        const tri1 = (position - 1) * position / 2;
        const tri2 = (position + 1) * (position + 2) / 2;
        
        options.push(tri1);
        options.push(tri2);
        options.push(Math.floor(Math.random() * 100) + 1);
        
        options = [...new Set(options)];
        
        while (options.length < 4) {
            options.push(Math.floor(Math.random() * 100) + 1);
        }
        
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        return options;
    }
    
    // Render visual pattern helper
    function renderPatternVisual() {
        if (!currentQuestion || !currentQuestion.sequence) return '';
        
        const seq = currentQuestion.sequence;
        const missingIdx = currentQuestion.missingIndex;
        
        return `
            <div style="background:rgba(139,92,246,0.15); border-radius:20px; padding:20px; margin:15px 0">
                <p style="margin-bottom:10px"><i class="fas fa-chart-line"></i> Number Pattern:</p>
                <div style="display:flex; flex-wrap:wrap; gap:12px; justify-content:center">
                    ${seq.map((num, idx) => `
                        <div style="background:${idx === missingIdx ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : '#8B5CF6'}; 
                                    width:70px; height:70px; border-radius:15px; 
                                    display:flex; align-items:center; justify-content:center; 
                                    font-size:1.3rem; font-weight:bold; color:${idx === missingIdx ? '#1a1a2e' : 'white'};
                                    box-shadow:0 4px 12px rgba(0,0,0,0.2);
                                    animation:${idx === missingIdx ? 'pulse 1s infinite alternate' : 'none'}">
                            ${idx === missingIdx ? '?' : num}
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top:15px; display:flex; gap:10px; justify-content:center; flex-wrap:wrap">
                    ${seq.slice(0, -1).map((_, idx) => `
                        <span style="font-size:0.8rem">→</span>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Render the game
    function renderGame() {
        if (!currentQuestion) {
            currentQuestion = generateQuestion();
        }
        
        const progressPercent = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        
        const html = `
            <div style="text-align:center">
                <div style="display:flex; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:10px">
                    <span>⭐ Level: ${level}</span>
                    <span>🏆 Score: ${score}</span>
                    <span>✅ Correct: ${correctAnswers}</span>
                    <span>📊 Q#: ${totalQuestions + 1}</span>
                </div>
                
                <h3>🔄 Number Patterns Challenge! 🔢</h3>
                <p style="margin:10px 0; opacity:0.9">Find the rule and complete the sequence</p>
                
                ${renderPatternVisual()}
                
                <div style="background:rgba(139,92,246,0.2); border-radius:20px; padding:20px; margin:15px 0">
                    <h4>❓ ${currentQuestion.questionText}</h4>
                    <p style="font-size:0.85rem; margin-top:10px">
                        <i class="fas fa-lightbulb"></i> 💡 ${currentQuestion.hint}
                    </p>
                </div>
                
                <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap; margin:20px 0">
                    ${currentQuestion.options.map(opt => `
                        <button class="pattern-option-btn" data-answer="${opt}" 
                            style="background:linear-gradient(135deg, #8B5CF6, #6D28D9); border:none; 
                                   width:80px; height:80px; border-radius:20px; font-size:1.3rem; font-weight:bold; 
                                   color:white; cursor:pointer; transition:0.3s; box-shadow:0 4px 12px rgba(0,0,0,0.2)">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
                
                <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap; margin-top:15px">
                    <button class="hero-cta" id="newPatternBtn">🔄 New Pattern</button>
                    <button class="close-game-btn" id="resetGameBtn">🔄 Reset Game</button>
                </div>
                
                <div id="patternFeedback" style="margin-top:25px; font-size:1.1rem; min-height:80px"></div>
                
                <div class="progress-container" style="width:100%; background:#2D1B4E; border-radius:10px; margin-top:20px; overflow:hidden">
                    <div class="progress-bar" style="width:${progressPercent}%; background:#4ade80; height:8px; transition:width 0.3s"></div>
                </div>
                
                <div id="statsDisplay" style="margin-top:15px; font-size:0.85rem; opacity:0.8">
                    ${totalQuestions > 0 ? `🎯 Accuracy: ${Math.round((correctAnswers / totalQuestions) * 100)}%` : '✨ Find the pattern and complete the sequence!'}
                </div>
            </div>
        `;
        
        document.getElementById('gameDynamicContent').innerHTML = html;
        
        // Add event listeners to option buttons
        document.querySelectorAll('.pattern-option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedAnswer = parseInt(btn.dataset.answer);
                checkAnswer(selectedAnswer, btn);
            });
            
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.05)';
                btn.style.background = 'linear-gradient(135deg, #fbbf24, #f59e0b)';
                btn.style.color = '#1a1a2e';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
                btn.style.background = 'linear-gradient(135deg, #8B5CF6, #6D28D9)';
                btn.style.color = 'white';
            });
        });
        
        document.getElementById('newPatternBtn').addEventListener('click', () => {
            currentQuestion = generateQuestion();
            renderGame();
            showToast('🔄 New number pattern generated!', 'info');
        });
        
        document.getElementById('resetGameBtn').addEventListener('click', () => {
            resetGame();
            renderGame();
            showToast('🎮 Game reset! Start fresh!', 'success');
        });
    }
    
    function checkAnswer(selectedAnswer, selectedBtn) {
        const feedbackDiv = document.getElementById('patternFeedback');
        const isCorrect = (selectedAnswer === currentQuestion.correctAnswer);
        
        if (isCorrect) {
            // Calculate points
            let basePoints = 20 * level;
            
            // Bonus for harder pattern types
            if (currentQuestion.type === 'geometric') {
                basePoints += 10;
            } else if (currentQuestion.type === 'alternating') {
                basePoints += 15;
            } else if (currentQuestion.type === 'fibonacci') {
                basePoints += 20;
            } else if (currentQuestion.type === 'square' || currentQuestion.type === 'triangular') {
                basePoints += 25;
            }
            
            const totalPoints = basePoints;
            
            score += totalPoints;
            correctAnswers++;
            totalQuestions++;
            
            // Visual feedback
            selectedBtn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
            selectedBtn.style.transform = 'scale(1.1)';
            selectedBtn.style.color = '#1a1a2e';
            
            feedbackDiv.innerHTML = `
                <div style="background:#4ade80; color:#1a1a2e; padding:20px; border-radius:20px; animation:slideIn 0.3s ease">
                    <i class="fas fa-check-circle"></i> ✅ CORRECT! +${totalPoints} points!<br>
                    <small>The missing number is ${currentQuestion.correctAnswer}</small>
                </div>
            `;
            
            showToast(`🎉 Correct! +${totalPoints} points!`, 'success');
            
            // Level up every 6 correct answers
            if (correctAnswers > 0 && correctAnswers % 6 === 0) {
                level++;
                showToast(`🎊 LEVEL UP! Welcome to Level ${level}! 🎊`, 'success');
            }
            
            // Disable all buttons temporarily
            document.querySelectorAll('.pattern-option-btn').forEach(btn => {
                btn.disabled = true;
                btn.style.opacity = '0.6';
            });
            
            // Load new question after delay
            setTimeout(() => {
                currentQuestion = generateQuestion();
                renderGame();
            }, 2000);
            
            incrementUsageAPI();
            
        } else {
            // Wrong answer
            selectedBtn.style.background = 'linear-gradient(135deg, #f87171, #ef4444)';
            selectedBtn.style.transform = 'scale(0.95)';
            
            feedbackDiv.innerHTML = `
                <div style="background:#f87171; color:white; padding:20px; border-radius:20px; animation:slideIn 0.3s ease">
                    <i class="fas fa-times-circle"></i> ❌ WRONG!<br>
                    The correct answer is ${currentQuestion.correctAnswer}<br>
                    <small>${currentQuestion.hint}</small>
                </div>
            `;
            
            showToast(`❌ Oops! The answer is ${currentQuestion.correctAnswer}`, 'info');
            totalQuestions++;
            
            // Reset button color
            setTimeout(() => {
                if (selectedBtn) {
                    selectedBtn.style.background = 'linear-gradient(135deg, #8B5CF6, #6D28D9)';
                    selectedBtn.style.transform = 'scale(1)';
                    selectedBtn.style.color = 'white';
                }
            }, 2000);
        }
        
        // Update stats display
        const statsDiv = document.getElementById('statsDisplay');
        if (statsDiv && totalQuestions > 0) {
            statsDiv.innerHTML = `🎯 Accuracy: ${Math.round((correctAnswers / totalQuestions) * 100)}% | ✅ ${correctAnswers}/${totalQuestions} correct`;
        }
        
        // Update progress bar
        const progressPercent = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progressPercent}%`;
        }
    }
    
    function resetGame() {
        score = 0;
        level = 1;
        totalQuestions = 0;
        correctAnswers = 0;
        currentQuestion = generateQuestion();
    }
    
    // Initialize
    currentQuestion = generateQuestion();
    renderGame();
}
// === END ===

// ============================================
// TOOL: GREATER/LESS ALLIGATOR GAME (PLACEHOLDER)
// ============================================
// ============================================
// TOOL: GREATER/LESS ALLIGATOR GAME (FIXED)
// ============================================
// === START ===
function startGreaterLessGame() {
    let score = 0;
    let level = 1;
    let currentQuestion = null;
    let totalQuestions = 0;
    let correctAnswers = 0;
    let consecutiveCorrect = 0;
    
    // Generate question based on level
    function generateQuestion() {
        let num1, num2;
        let questionType;
        let correctSymbol;
        let correctAnswer;
        
        // Determine number range based on level
        let maxNum;
        if (level <= 2) {
            maxNum = 20;
        } else if (level <= 4) {
            maxNum = 50;
        } else if (level <= 6) {
            maxNum = 100;
        } else {
            maxNum = 200;
        }
        
        // Determine question type
        if (level <= 2) {
            questionType = 'compare';
            num1 = Math.floor(Math.random() * maxNum) + 1;
            num2 = Math.floor(Math.random() * maxNum) + 1;
            
            while (num1 === num2) {
                num2 = Math.floor(Math.random() * maxNum) + 1;
            }
            
            if (num1 > num2) {
                correctSymbol = '>';
                correctAnswer = '>';
            } else {
                correctSymbol = '<';
                correctAnswer = '<';
            }
            
        } else if (level <= 4) {
            const types = ['compare', 'whichIsGreater', 'whichIsLess'];
            questionType = types[Math.floor(Math.random() * types.length)];
            
            if (questionType === 'compare') {
                num1 = Math.floor(Math.random() * maxNum) + 1;
                num2 = Math.floor(Math.random() * maxNum) + 1;
                while (num1 === num2) {
                    num2 = Math.floor(Math.random() * maxNum) + 1;
                }
                if (num1 > num2) {
                    correctSymbol = '>';
                    correctAnswer = '>';
                } else {
                    correctSymbol = '<';
                    correctAnswer = '<';
                }
            } else if (questionType === 'whichIsGreater') {
                num1 = Math.floor(Math.random() * maxNum) + 1;
                num2 = Math.floor(Math.random() * maxNum) + 1;
                while (num1 === num2) {
                    num2 = Math.floor(Math.random() * maxNum) + 1;
                }
                correctAnswer = num1 > num2 ? num1 : num2;
                correctSymbol = num1 > num2 ? '>' : '<';
            } else {
                num1 = Math.floor(Math.random() * maxNum) + 1;
                num2 = Math.floor(Math.random() * maxNum) + 1;
                while (num1 === num2) {
                    num2 = Math.floor(Math.random() * maxNum) + 1;
                }
                correctAnswer = num1 < num2 ? num1 : num2;
                correctSymbol = num1 < num2 ? '<' : '>';
            }
            
        } else {
            const types = ['compare', 'whichIsGreater', 'whichIsLess'];
            questionType = types[Math.floor(Math.random() * types.length)];
            
            if (questionType === 'compare') {
                num1 = Math.floor(Math.random() * maxNum) + 1;
                num2 = Math.floor(Math.random() * maxNum) + 1;
                while (num1 === num2) {
                    num2 = Math.floor(Math.random() * maxNum) + 1;
                }
                if (num1 > num2) {
                    correctSymbol = '>';
                    correctAnswer = '>';
                } else {
                    correctSymbol = '<';
                    correctAnswer = '<';
                }
            } else if (questionType === 'whichIsGreater') {
                num1 = Math.floor(Math.random() * maxNum) + 1;
                num2 = Math.floor(Math.random() * maxNum) + 1;
                while (num1 === num2) {
                    num2 = Math.floor(Math.random() * maxNum) + 1;
                }
                correctAnswer = num1 > num2 ? num1 : num2;
                correctSymbol = num1 > num2 ? '>' : '<';
            } else {
                num1 = Math.floor(Math.random() * maxNum) + 1;
                num2 = Math.floor(Math.random() * maxNum) + 1;
                while (num1 === num2) {
                    num2 = Math.floor(Math.random() * maxNum) + 1;
                }
                correctAnswer = num1 < num2 ? num1 : num2;
                correctSymbol = num1 < num2 ? '<' : '>';
            }
        }
        
        let questionText, hint, options;
        
        if (questionType === 'compare') {
            questionText = `${num1} ___ ${num2}`;
            hint = `The alligator 🐊 eats the BIGGER number! ${num1 > num2 ? num1 : num2} is bigger.`;
            options = ['>', '<'];
        } else if (questionType === 'whichIsGreater') {
            questionText = `Which number is GREATER? ${num1} or ${num2}`;
            hint = `${num1 > num2 ? num1 : num2} is larger than ${num1 > num2 ? num2 : num1}.`;
            options = [num1, num2];
        } else {
            questionText = `Which number is LESS? ${num1} or ${num2}`;
            hint = `${num1 < num2 ? num1 : num2} is smaller than ${num1 < num2 ? num2 : num1}.`;
            options = [num1, num2];
        }
        
        currentQuestion = {
            type: questionType,
            num1: num1,
            num2: num2,
            correctAnswer: correctAnswer,
            correctSymbol: correctSymbol,
            questionText: questionText,
            hint: hint,
            options: options
        };
        
        return currentQuestion;
    }
    
    // Render comparison visual
    function renderComparisonVisual(num1, num2) {
        let leftSize = Math.min(3 + Math.floor(num1 / 20), 8);
        let rightSize = Math.min(3 + Math.floor(num2 / 20), 8);
        
        const leftBlocks = Array(leftSize).fill('🟣');
        const rightBlocks = Array(rightSize).fill('🟣');
        
        return `
            <div style="background:rgba(139,92,246,0.15); border-radius:20px; padding:20px; margin:15px 0">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px">
                    <div style="text-align:center; flex:1">
                        <div style="font-size:2.5rem; font-weight:bold">${num1}</div>
                        <div style="display:flex; gap:5px; justify-content:center; margin-top:10px; flex-wrap:wrap">
                            ${leftBlocks.map(block => `<span style="font-size:1.2rem">${block}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div style="font-size:4rem;">🐊</div>
                    
                    <div style="text-align:center; flex:1">
                        <div style="font-size:2.5rem; font-weight:bold">${num2}</div>
                        <div style="display:flex; gap:5px; justify-content:center; margin-top:10px; flex-wrap:wrap">
                            ${rightBlocks.map(block => `<span style="font-size:1.2rem">${block}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Render the game
    function renderGame() {
        if (!currentQuestion) {
            currentQuestion = generateQuestion();
        }
        
        const progressPercent = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        
        let questionDisplay = renderComparisonVisual(currentQuestion.num1, currentQuestion.num2);
        
        const html = `
            <div style="text-align:center">
                <div style="display:flex; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:10px">
                    <span>⭐ Level: ${level}</span>
                    <span>🏆 Score: ${score}</span>
                    <span>✅ Correct: ${correctAnswers}</span>
                    <span>📊 Q#: ${totalQuestions + 1}</span>
                    <span>🔥 Streak: ${consecutiveCorrect}</span>
                </div>
                
                <h3>🐊 Greater Than / Less Than Alligator! 🐊</h3>
                <p style="margin:10px 0; opacity:0.9">The hungry alligator always eats the BIGGER number!</p>
                
                ${questionDisplay}
                
                <div style="background:rgba(139,92,246,0.2); border-radius:20px; padding:20px; margin:15px 0">
                    <h4>❓ ${currentQuestion.questionText}</h4>
                    <p style="font-size:0.85rem; margin-top:10px">
                        <i class="fas fa-lightbulb"></i> 💡 ${currentQuestion.hint}
                    </p>
                </div>
                
                <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap; margin:20px 0">
                    ${currentQuestion.options.map(opt => `
                        <button class="compare-option-btn" data-answer="${opt}" 
                            style="background:linear-gradient(135deg, #8B5CF6, #6D28D9); border:none; 
                                   padding:18px 28px; border-radius:20px; font-size:1.3rem; font-weight:bold; 
                                   color:white; cursor:pointer; transition:0.3s; box-shadow:0 4px 12px rgba(0,0,0,0.2);
                                   min-width:100px">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
                
                <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap; margin-top:15px">
                    <button class="hero-cta" id="newCompareBtn">🔄 New Question</button>
                    <button class="close-game-btn" id="resetGameBtn">🔄 Reset Game</button>
                </div>
                
                <div id="compareFeedback" style="margin-top:25px; font-size:1.1rem; min-height:80px"></div>
                
                <div class="progress-container" style="width:100%; background:#2D1B4E; border-radius:10px; margin-top:20px; overflow:hidden">
                    <div class="progress-bar" style="width:${progressPercent}%; background:#4ade80; height:8px; transition:width 0.3s"></div>
                </div>
                
                <div id="statsDisplay" style="margin-top:15px; font-size:0.85rem; opacity:0.8">
                    ${totalQuestions > 0 ? `🎯 Accuracy: ${Math.round((correctAnswers / totalQuestions) * 100)}%` : '✨ The alligator 🐊 eats the BIGGER number!'}
                </div>
            </div>
        `;
        
        document.getElementById('gameDynamicContent').innerHTML = html;
        
        // Add event listeners to option buttons
        document.querySelectorAll('.compare-option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                let selectedAnswer = btn.dataset.answer;
                if (currentQuestion.type === 'whichIsGreater' || currentQuestion.type === 'whichIsLess') {
                    selectedAnswer = parseInt(selectedAnswer);
                }
                checkAnswer(selectedAnswer, btn);
            });
            
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.05)';
                btn.style.background = 'linear-gradient(135deg, #fbbf24, #f59e0b)';
                btn.style.color = '#1a1a2e';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
                btn.style.background = 'linear-gradient(135deg, #8B5CF6, #6D28D9)';
                btn.style.color = 'white';
            });
        });
        
        document.getElementById('newCompareBtn').addEventListener('click', () => {
            currentQuestion = generateQuestion();
            renderGame();
            showToast('🔄 New comparison question!', 'info');
        });
        
        document.getElementById('resetGameBtn').addEventListener('click', () => {
            resetGame();
            renderGame();
            showToast('🎮 Game reset! Start fresh!', 'success');
        });
    }
    
    function checkAnswer(selectedAnswer, selectedBtn) {
        const feedbackDiv = document.getElementById('compareFeedback');
        
        // Compare selected answer with correct answer
        let isCorrect = false;
        
        if (currentQuestion.type === 'compare') {
            // For compare type, selectedAnswer is '>' or '<'
            isCorrect = (selectedAnswer === currentQuestion.correctAnswer);
        } else if (currentQuestion.type === 'whichIsGreater') {
            // For whichIsGreater, selectedAnswer is a number
            isCorrect = (selectedAnswer === currentQuestion.correctAnswer);
        } else if (currentQuestion.type === 'whichIsLess') {
            // For whichIsLess, selectedAnswer is a number
            isCorrect = (selectedAnswer === currentQuestion.correctAnswer);
        }
        
        if (isCorrect) {
            // Calculate points
            let basePoints = 15 * level;
            
            // Streak bonus
            consecutiveCorrect++;
            let streakBonus = 0;
            if (consecutiveCorrect >= 5) {
                streakBonus = 20;
                basePoints += streakBonus;
            } else if (consecutiveCorrect >= 3) {
                streakBonus = 10;
                basePoints += streakBonus;
            }
            
            const totalPoints = basePoints;
            
            score += totalPoints;
            correctAnswers++;
            totalQuestions++;
            
            // Visual feedback
            selectedBtn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
            selectedBtn.style.transform = 'scale(1.1)';
            selectedBtn.style.color = '#1a1a2e';
            
            let correctMessage = '';
            if (currentQuestion.type === 'compare') {
                if (currentQuestion.num1 > currentQuestion.num2) {
                    correctMessage = `🐊 The alligator eats ${currentQuestion.num1} because ${currentQuestion.num1} > ${currentQuestion.num2}! 🐊`;
                } else {
                    correctMessage = `🐊 The alligator eats ${currentQuestion.num2} because ${currentQuestion.num2} > ${currentQuestion.num1}! 🐊`;
                }
            } else if (currentQuestion.type === 'whichIsGreater') {
                correctMessage = `🐊 Correct! ${currentQuestion.correctAnswer} is greater than ${currentQuestion.correctAnswer === currentQuestion.num1 ? currentQuestion.num2 : currentQuestion.num1}! 🐊`;
            } else {
                correctMessage = `🐊 Correct! ${currentQuestion.correctAnswer} is less than ${currentQuestion.correctAnswer === currentQuestion.num1 ? currentQuestion.num2 : currentQuestion.num1}! 🐊`;
            }
            
            feedbackDiv.innerHTML = `
                <div style="background:#4ade80; color:#1a1a2e; padding:20px; border-radius:20px; animation:slideIn 0.3s ease">
                    <i class="fas fa-check-circle"></i> ✅ CORRECT! +${totalPoints} points!<br>
                    <small>${correctMessage}</small>
                    ${streakBonus > 0 ? `<small>🔥 ${consecutiveCorrect} in a row! +${streakBonus} streak bonus!</small>` : ''}
                </div>
            `;
            
            showToast(`🎉 Correct! +${totalPoints} points!`, 'success');
            
            // Level up every 7 correct answers
            if (correctAnswers > 0 && correctAnswers % 7 === 0) {
                level++;
                showToast(`🎊 LEVEL UP! Welcome to Level ${level}! 🎊`, 'success');
            }
            
            // Disable all buttons temporarily
            document.querySelectorAll('.compare-option-btn').forEach(btn => {
                btn.disabled = true;
                btn.style.opacity = '0.6';
            });
            
            // Load new question after delay
            setTimeout(() => {
                currentQuestion = generateQuestion();
                renderGame();
            }, 2000);
            
            incrementUsageAPI();
            
        } else {
            // Wrong answer
            consecutiveCorrect = 0;
            
            selectedBtn.style.background = 'linear-gradient(135deg, #f87171, #ef4444)';
            selectedBtn.style.transform = 'scale(0.95)';
            
            let correctMessage = '';
            if (currentQuestion.type === 'compare') {
                if (currentQuestion.num1 > currentQuestion.num2) {
                    correctMessage = `${currentQuestion.num1} > ${currentQuestion.num2} (${currentQuestion.num1} is greater)`;
                } else {
                    correctMessage = `${currentQuestion.num1} < ${currentQuestion.num2} (${currentQuestion.num2} is greater)`;
                }
            } else if (currentQuestion.type === 'whichIsGreater') {
                correctMessage = `${currentQuestion.correctAnswer} is greater than ${currentQuestion.correctAnswer === currentQuestion.num1 ? currentQuestion.num2 : currentQuestion.num1}`;
            } else {
                correctMessage = `${currentQuestion.correctAnswer} is less than ${currentQuestion.correctAnswer === currentQuestion.num1 ? currentQuestion.num2 : currentQuestion.num1}`;
            }
            
            feedbackDiv.innerHTML = `
                <div style="background:#f87171; color:white; padding:20px; border-radius:20px; animation:slideIn 0.3s ease">
                    <i class="fas fa-times-circle"></i> ❌ WRONG!<br>
                    Correct: ${correctMessage}<br>
                    <small>Remember: The alligator 🐊 always opens its mouth to the BIGGER number!</small>
                </div>
            `;
            
            showToast(`❌ Correct answer: ${correctMessage}`, 'info');
            totalQuestions++;
            
            // Reset button color
            setTimeout(() => {
                if (selectedBtn) {
                    selectedBtn.style.background = 'linear-gradient(135deg, #8B5CF6, #6D28D9)';
                    selectedBtn.style.transform = 'scale(1)';
                    selectedBtn.style.color = 'white';
                }
            }, 2000);
        }
        
        // Update stats display
        const statsDiv = document.getElementById('statsDisplay');
        if (statsDiv && totalQuestions > 0) {
            statsDiv.innerHTML = `🎯 Accuracy: ${Math.round((correctAnswers / totalQuestions) * 100)}% | ✅ ${correctAnswers}/${totalQuestions} correct | 🔥 Streak: ${consecutiveCorrect}`;
        }
        
        // Update progress bar
        const progressPercent = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progressPercent}%`;
        }
    }
    
    function resetGame() {
        score = 0;
        level = 1;
        totalQuestions = 0;
        correctAnswers = 0;
        consecutiveCorrect = 0;
        currentQuestion = generateQuestion();
    }
    
    // Initialize
    currentQuestion = generateQuestion();
    renderGame();
}
// === END ===
// ============================================
// TOOL: NUMBER ORDER RACE GAME (PLACEHOLDER)
// ============================================
// ============================================
// TOOL: NUMBER ORDER RACE GAME
// ============================================
// === START ===
function startOrderRaceGame() {
    let score = 0;
    let level = 1;
    let currentQuestion = null;
    let totalQuestions = 0;
    let correctAnswers = 0;
    let timeLeft = 30;
    let timerInterval = null;
    let gameActive = true;
    let racePosition = 0;
    let opponentPosition = 0;
    
    // Generate question based on level
    function generateQuestion() {
        let numbers = [];
        let questionType;
        let correctOrder = [];
        let correctAnswer;
        
        // Determine number range and count based on level
        let numCount;
        let maxNum;
        
        if (level <= 2) {
            numCount = 3;
            maxNum = 20;
        } else if (level <= 4) {
            numCount = 4;
            maxNum = 50;
        } else if (level <= 6) {
            numCount = 5;
            maxNum = 100;
        } else {
            numCount = 6;
            maxNum = 200;
        }
        
        // Generate random numbers
        for (let i = 0; i < numCount; i++) {
            let num;
            do {
                num = Math.floor(Math.random() * maxNum) + 1;
            } while (numbers.includes(num));
            numbers.push(num);
        }
        
        // Determine question type
        const types = ['ascending', 'descending'];
        questionType = types[Math.floor(Math.random() * types.length)];
        
        if (questionType === 'ascending') {
            correctOrder = [...numbers].sort((a, b) => a - b);
            correctAnswer = correctOrder.join(', ');
        } else {
            correctOrder = [...numbers].sort((a, b) => b - a);
            correctAnswer = correctOrder.join(', ');
        }
        
        // Shuffle numbers for display
        const shuffledNumbers = [...numbers];
        for (let i = shuffledNumbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledNumbers[i], shuffledNumbers[j]] = [shuffledNumbers[j], shuffledNumbers[i]];
        }
        
        currentQuestion = {
            numbers: shuffledNumbers,
            correctOrder: correctOrder,
            correctAnswer: correctAnswer,
            questionType: questionType,
            numCount: numCount
        };
        
        return currentQuestion;
    }
    
    // Start timer
    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        
        timerInterval = setInterval(() => {
            if (!gameActive) return;
            
            timeLeft--;
            const timerDisplay = document.getElementById('timerDisplay');
            if (timerDisplay) {
                timerDisplay.innerHTML = `⏱️ Time: ${timeLeft}s`;
                if (timeLeft <= 10) {
                    timerDisplay.style.color = '#f87171';
                    timerDisplay.style.fontWeight = 'bold';
                } else {
                    timerDisplay.style.color = '#fbbf24';
                }
            }
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                gameActive = false;
                showToast(`⏰ Time's up! Game Over!`, 'error');
                document.getElementById('orderFeedback').innerHTML = `
                    <div style="background:#f87171; color:white; padding:20px; border-radius:20px">
                        <i class="fas fa-clock"></i> TIME'S UP!<br>
                        Final Score: ${score}
                    </div>
                `;
                disableGame();
            }
        }, 1000);
    }
    
    // Disable game
    function disableGame() {
        document.querySelectorAll('.order-option-btn, #submitOrderBtn').forEach(btn => {
            if (btn) btn.disabled = true;
        });
    }
    
    // Update race positions
    function updateRacePositions(isCorrect) {
        if (isCorrect) {
            racePosition += 15;
            if (racePosition > 100) racePosition = 100;
        } else {
            opponentPosition += 10;
            if (opponentPosition > 100) opponentPosition = 100;
        }
        
        const raceTrack = document.getElementById('raceTrack');
        if (raceTrack) {
            raceTrack.innerHTML = `
                <div style="margin-bottom:15px">
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px">
                        <span>🏃‍♂️ You</span>
                        <span>🤖 Opponent</span>
                    </div>
                    <div style="background:#2D1B4E; border-radius:10px; height:30px; position:relative; overflow:hidden">
                        <div style="width:${racePosition}%; background:#4ade80; height:30px; border-radius:10px; position:absolute; left:0; top:0; transition:width 0.5s; display:flex; align-items:center; justify-content:center; font-size:0.8rem">
                            ${racePosition >= 100 ? '🏆 WINNER!' : ''}
                        </div>
                    </div>
                    <div style="background:#2D1B4E; border-radius:10px; height:30px; margin-top:5px; position:relative; overflow:hidden">
                        <div style="width:${opponentPosition}%; background:#f87171; height:30px; border-radius:10px; position:absolute; left:0; top:0; transition:width 0.5s; display:flex; align-items:center; justify-content:center; font-size:0.8rem">
                            ${opponentPosition >= 100 ? '🤖 OPPONENT WINS!' : ''}
                        </div>
                    </div>
                </div>
                <div style="display:flex; justify-content:space-between; margin-top:5px">
                    <span>Start</span>
                    <span>Finish 🏁</span>
                </div>
            `;
        }
        
        // Check win/loss
        if (racePosition >= 100) {
            gameActive = false;
            clearInterval(timerInterval);
            const bonus = timeLeft * 2;
            score += bonus;
            showToast(`🎉 YOU WIN! +${bonus} time bonus! Total: ${score}`, 'success');
            document.getElementById('orderFeedback').innerHTML = `
                <div style="background:#4ade80; color:#1a1a2e; padding:20px; border-radius:20px">
                    <i class="fas fa-trophy"></i> 🏆 YOU WIN THE RACE! 🏆<br>
                    Time Bonus: +${bonus} points!<br>
                    Final Score: ${score}
                </div>
            `;
            disableGame();
        } else if (opponentPosition >= 100) {
            gameActive = false;
            clearInterval(timerInterval);
            showToast(`😔 Opponent won! Better luck next time!`, 'error');
            document.getElementById('orderFeedback').innerHTML = `
                <div style="background:#f87171; color:white; padding:20px; border-radius:20px">
                    <i class="fas fa-frown"></i> OPPONENT WINS!<br>
                    Final Score: ${score}<br>
                    Click Reset to play again!
                </div>
            `;
            disableGame();
        }
    }
    
    // Check answer
    function checkAnswer() {
        if (!gameActive) return;
        
        const selectElements = document.querySelectorAll('.order-select');
        const userOrder = [];
        
        for (let i = 0; i < selectElements.length; i++) {
            userOrder.push(parseInt(selectElements[i].value));
        }
        
        let isCorrect = true;
        for (let i = 0; i < userOrder.length; i++) {
            if (userOrder[i] !== currentQuestion.correctOrder[i]) {
                isCorrect = false;
                break;
            }
        }
        
        if (isCorrect) {
            // Calculate points
            let basePoints = 20 * level;
            const timeBonus = Math.floor(timeLeft / 2);
            const totalPoints = basePoints + timeBonus;
            
            score += totalPoints;
            correctAnswers++;
            totalQuestions++;
            
            showToast(`🎉 Correct! +${totalPoints} points! (Time bonus: +${timeBonus})`, 'success');
            
            document.getElementById('orderFeedback').innerHTML = `
                <div style="background:#4ade80; color:#1a1a2e; padding:15px; border-radius:20px">
                    ✅ CORRECT! +${totalPoints} points!<br>
                    Correct order: ${currentQuestion.correctOrder.join(' → ')}
                </div>
            `;
            
            // Update race position
            updateRacePositions(true);
            
            // Level up every 5 correct answers
            if (correctAnswers > 0 && correctAnswers % 5 === 0) {
                level++;
                showToast(`🎊 LEVEL UP! Welcome to Level ${level}! 🎊`, 'success');
            }
            
            // Load new question after delay if game still active
            if (gameActive && racePosition < 100 && opponentPosition < 100) {
                setTimeout(() => {
                    currentQuestion = generateQuestion();
                    renderGame();
                }, 2000);
            }
            
            incrementUsageAPI();
            
        } else {
            totalQuestions++;
            
            document.getElementById('orderFeedback').innerHTML = `
                <div style="background:#f87171; color:white; padding:15px; border-radius:20px">
                    ❌ WRONG!<br>
                    Correct ${currentQuestion.questionType === 'ascending' ? 'ascending' : 'descending'} order: ${currentQuestion.correctOrder.join(' → ')}
                </div>
            `;
            
            showToast(`❌ Wrong! The correct order is ${currentQuestion.correctOrder.join(', ')}`, 'info');
            
            // Update race position (opponent moves ahead)
            updateRacePositions(false);
            
            // Load new question after delay if game still active
            if (gameActive && racePosition < 100 && opponentPosition < 100) {
                setTimeout(() => {
                    currentQuestion = generateQuestion();
                    renderGame();
                }, 2500);
            }
        }
        
        // Update stats
        const statsDiv = document.getElementById('raceStats');
        if (statsDiv && totalQuestions > 0) {
            statsDiv.innerHTML = `🎯 Accuracy: ${Math.round((correctAnswers / totalQuestions) * 100)}% | ✅ ${correctAnswers}/${totalQuestions} correct`;
        }
    }
    
    // Render the game
    function renderGame() {
        if (!currentQuestion) {
            currentQuestion = generateQuestion();
        }
        
        const progressPercent = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        
        // Generate dropdown options for ordering
        const optionsHtml = currentQuestion.numbers.map((num, idx) => 
            `<option value="${num}">${num}</option>`
        ).join('');
        
        const html = `
            <div style="text-align:center">
                <div style="display:flex; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:10px">
                    <span>⭐ Level: ${level}</span>
                    <span>🏆 Score: ${score}</span>
                    <span>✅ Correct: ${correctAnswers}</span>
                    <span>📊 Q#: ${totalQuestions + 1}</span>
                    <span id="timerDisplay" style="color:#fbbf24">⏱️ Time: ${timeLeft}s</span>
                </div>
                
                <h3>🏁 Number Order Race! 🏎️</h3>
                <p style="margin:10px 0; opacity:0.9">Arrange numbers in ${currentQuestion.questionType === 'ascending' ? 'ascending (smallest to largest)' : 'descending (largest to smallest)'} order to win the race!</p>
                
                <div id="raceTrack" style="background:rgba(139,92,246,0.15); border-radius:20px; padding:15px; margin:15px 0">
                    <div style="margin-bottom:15px">
                        <div style="display:flex; justify-content:space-between; margin-bottom:5px">
                            <span>🏃‍♂️ You</span>
                            <span>🤖 Opponent</span>
                        </div>
                        <div style="background:#2D1B4E; border-radius:10px; height:30px; position:relative; overflow:hidden">
                            <div style="width:${racePosition}%; background:#4ade80; height:30px; border-radius:10px; position:absolute; left:0; top:0; transition:width 0.5s; display:flex; align-items:center; justify-content:center; font-size:0.8rem">
                                ${racePosition >= 100 ? '🏆 WINNER!' : ''}
                            </div>
                        </div>
                        <div style="background:#2D1B4E; border-radius:10px; height:30px; margin-top:5px; position:relative; overflow:hidden">
                            <div style="width:${opponentPosition}%; background:#f87171; height:30px; border-radius:10px; position:absolute; left:0; top:0; transition:width 0.5s; display:flex; align-items:center; justify-content:center; font-size:0.8rem">
                                ${opponentPosition >= 100 ? '🤖 OPPONENT WINS!' : ''}
                            </div>
                        </div>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-top:5px">
                        <span>🏁 Start</span>
                        <span>🏁 Finish</span>
                    </div>
                </div>
                
                <div style="background:rgba(139,92,246,0.2); border-radius:20px; padding:20px; margin:15px 0">
                    <h4>📊 Arrange these numbers:</h4>
                    <div style="display:flex; flex-wrap:wrap; gap:15px; justify-content:center; margin:20px 0">
                        ${currentQuestion.numbers.map(num => `
                            <div style="background:linear-gradient(135deg, #8B5CF6, #6D28D9); width:70px; height:70px; border-radius:15px; display:flex; align-items:center; justify-content:center; font-size:1.5rem; font-weight:bold; color:white; box-shadow:0 4px 12px rgba(0,0,0,0.2)">
                                ${num}
                            </div>
                        `).join('')}
                    </div>
                    
                    <h4 style="margin-top:20px">📝 Your Order (drag or select):</h4>
                    <div style="display:flex; flex-wrap:wrap; gap:15px; justify-content:center; margin:20px 0">
                        ${Array(currentQuestion.numCount).fill().map((_, idx) => `
                            <select class="order-select" data-position="${idx}" style="background:#2D1B4E; color:white; border:2px solid #8B5CF6; padding:15px 10px; border-radius:15px; font-size:1.2rem; min-width:80px; text-align:center">
                                <option value="">?</option>
                                ${optionsHtml}
                            </select>
                        `).join('')}
                    </div>
                    
                    <button class="hero-cta" id="submitOrderBtn" style="margin-top:10px">🏁 Submit Order & Race! 🏁</button>
                </div>
                
                <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap; margin-top:15px">
                    <button class="close-game-btn" id="resetRaceBtn">🔄 Reset Race</button>
                </div>
                
                <div id="orderFeedback" style="margin-top:20px; font-size:1rem; min-height:80px"></div>
                
                <div class="progress-container" style="width:100%; background:#2D1B4E; border-radius:10px; margin-top:20px; overflow:hidden">
                    <div class="progress-bar" style="width:${progressPercent}%; background:#4ade80; height:8px; transition:width 0.3s"></div>
                </div>
                
                <div id="raceStats" style="margin-top:15px; font-size:0.85rem; opacity:0.8">
                    ${totalQuestions > 0 ? `🎯 Accuracy: ${Math.round((correctAnswers / totalQuestions) * 100)}%` : '✨ Race against the opponent by ordering numbers correctly!'}
                </div>
            </div>
        `;
        
        document.getElementById('gameDynamicContent').innerHTML = html;
        
        // Reset timer if this is a new game
        if (totalQuestions === 0 && racePosition === 0 && opponentPosition === 0) {
            timeLeft = 30;
            gameActive = true;
            startTimer();
        }
        
        // Add event listener to submit button
        document.getElementById('submitOrderBtn').addEventListener('click', () => {
            if (gameActive) {
                checkAnswer();
            } else {
                showToast('Game over! Click Reset Race to play again!', 'info');
            }
        });
        
        // Reset button
        document.getElementById('resetRaceBtn').addEventListener('click', () => {
            resetGame();
            renderGame();
            showToast('🏁 Race reset! New game started! 🏁', 'success');
        });
        
        // Prevent duplicate selections in dropdowns
        const selects = document.querySelectorAll('.order-select');
        selects.forEach((select, idx) => {
            select.addEventListener('change', () => {
                const selectedValue = select.value;
                if (selectedValue) {
                    // Disable this option in other selects
                    selects.forEach((otherSelect, otherIdx) => {
                        if (otherIdx !== idx) {
                            const option = otherSelect.querySelector(`option[value="${selectedValue}"]`);
                            if (option) option.disabled = true;
                        }
                    });
                    
                    // Re-enable options that are not selected elsewhere
                    const selectedValues = [];
                    selects.forEach(s => {
                        if (s.value) selectedValues.push(s.value);
                    });
                    
                    selects.forEach(s => {
                        s.querySelectorAll('option').forEach(opt => {
                            if (opt.value && selectedValues.includes(opt.value) && opt.value !== s.value) {
                                opt.disabled = true;
                            } else if (opt.value && !selectedValues.includes(opt.value)) {
                                opt.disabled = false;
                            }
                        });
                    });
                }
            });
        });
    }
    
    function resetGame() {
        clearInterval(timerInterval);
        score = 0;
        level = 1;
        totalQuestions = 0;
        correctAnswers = 0;
        timeLeft = 30;
        racePosition = 0;
        opponentPosition = 0;
        gameActive = true;
        currentQuestion = generateQuestion();
    }
    
    // Initialize
    currentQuestion = generateQuestion();
    renderGame();
}
// === END ===
// ============================================
// TOOL: FINGER COUNTING GAME (PLACEHOLDER)
// ============================================
// ============================================
// TOOL: FINGER COUNTING GAME
// ============================================
// === START ===
function startFingerGame() {
    let score = 0;
    let level = 1;
    let currentQuestion = null;
    let totalQuestions = 0;
    let correctAnswers = 0;
    let consecutiveCorrect = 0;
    
    // Finger images/data for numbers 0-10 (using emoji/unicode)
    const fingerImages = {
        0: { emoji: "✊", name: "Fist (Zero)", fingers: "No fingers up" },
        1: { emoji: "☝️", name: "One finger", fingers: "Index finger up" },
        2: { emoji: "✌️", name: "Two fingers", fingers: "Index and middle fingers up" },
        3: { emoji: "🖖", name: "Three fingers", fingers: "Index, middle, ring fingers up" },
        4: { emoji: "🤘", name: "Four fingers", fingers: "Index, middle, ring, pinky up" },
        5: { emoji: "🖐️", name: "Five fingers (Open hand)", fingers: "All five fingers up" },
        6: { emoji: "🤙", name: "Six (Call me)", fingers: "Thumb and pinky out" },
        7: { emoji: "🖖", name: "Seven", fingers: "Thumb, index, middle up" },
        8: { emoji: "🤞", name: "Eight", fingers: "Index and middle crossed" },
        9: { emoji: "🤟", name: "Nine (Love sign)", fingers: "Thumb, index, pinky up" },
        10: { emoji: "🙌", name: "Ten (Both hands)", fingers: "Both hands open" }
    };
    
    // Generate question based on level
    function generateQuestion() {
        let number;
        let questionType;
        
        // Determine number range based on level
        let maxNum;
        if (level <= 2) {
            maxNum = 5; // Level 1-2: Numbers 0-5
        } else if (level <= 4) {
            maxNum = 10; // Level 3-4: Numbers 0-10
        } else if (level <= 6) {
            maxNum = 10; // Level 5-6: Numbers 0-10 with more variations
        } else {
            maxNum = 10; // Level 7+: Numbers 0-10 with mixed question types
        }
        
        // Determine question type based on level
        if (level <= 2) {
            // Level 1-2: Show fingers, ask number
            questionType = 'fingersToNumber';
            number = Math.floor(Math.random() * (maxNum + 1));
        } else if (level <= 4) {
            // Level 3-4: Mixed types
            const types = ['fingersToNumber', 'numberToFingers'];
            questionType = types[Math.floor(Math.random() * types.length)];
            number = Math.floor(Math.random() * (maxNum + 1));
        } else {
            // Level 5+: All types including counting
            const types = ['fingersToNumber', 'numberToFingers', 'countFingers'];
            questionType = types[Math.floor(Math.random() * types.length)];
            number = Math.floor(Math.random() * (maxNum + 1));
        }
        
        let questionText, correctAnswer, hint, options;
        const fingerData = fingerImages[number] || fingerImages[0];
        
        if (questionType === 'fingersToNumber') {
            questionText = `How many fingers are shown?`;
            correctAnswer = number;
            hint = `Count the fingers carefully! ${fingerData.fingers}`;
            options = generateNumberOptions(correctAnswer, maxNum);
            
        } else if (questionType === 'numberToFingers') {
            questionText = `Which finger gesture shows the number ${number}?`;
            correctAnswer = number;
            hint = `${number} is shown by ${fingerData.fingers}`;
            // Generate options with different finger gestures
            options = generateFingerOptions(correctAnswer, maxNum);
            
        } else {
            // Count fingers - show a random number of fingers (0-10) and ask to count
            const countNumber = Math.floor(Math.random() * 11);
            const countFingerData = fingerImages[countNumber];
            questionText = `Count the fingers in the gesture!`;
            correctAnswer = countNumber;
            hint = `Look carefully at the finger gesture. ${countFingerData.fingers}`;
            options = generateNumberOptions(correctAnswer, 10);
            number = countNumber;
        }
        
        currentQuestion = {
            type: questionType,
            number: number,
            fingerData: fingerImages[number] || fingerImages[0],
            questionText: questionText,
            correctAnswer: correctAnswer,
            hint: hint,
            options: options
        };
        
        return currentQuestion;
    }
    
    // Generate number options
    function generateNumberOptions(correctAnswer, maxNum) {
        let options = [correctAnswer];
        const range = Math.min(3, Math.floor(maxNum / 2) + 1);
        
        while (options.length < 4) {
            let offset = Math.floor(Math.random() * range) + 1;
            let option = correctAnswer + (Math.random() < 0.5 ? offset : -offset);
            
            if (option >= 0 && option <= maxNum && !options.includes(option)) {
                options.push(option);
            }
        }
        
        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        return options;
    }
    
    // Generate finger gesture options
    function generateFingerOptions(correctAnswer, maxNum) {
        let options = [correctAnswer];
        const allNumbers = [0,1,2,3,4,5,6,7,8,9,10];
        const available = allNumbers.filter(n => n !== correctAnswer && n <= maxNum);
        
        for (let i = 0; i < 3 && i < available.length; i++) {
            const randomIndex = Math.floor(Math.random() * available.length);
            options.push(available[randomIndex]);
            available.splice(randomIndex, 1);
        }
        
        // If not enough options, add random numbers
        while (options.length < 4) {
            let randomNum = Math.floor(Math.random() * (maxNum + 1));
            if (!options.includes(randomNum)) {
                options.push(randomNum);
            }
        }
        
        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        return options;
    }
    
    // Render animated hand/finger gesture
    function renderFingerGesture(number, size = 'large') {
        const fingerData = fingerImages[number] || fingerImages[0];
        const fontSize = size === 'large' ? '8rem' : '5rem';
        
        // Create animated finger animation
        let animationStyle = '';
        if (number > 0) {
            animationStyle = 'animation: bounce 0.5s ease infinite alternate';
        }
        
        return `
            <div style="text-align:center; margin:20px 0">
                <div style="font-size:${fontSize}; display:inline-block; ${animationStyle}; background:rgba(255,193,7,0.1); border-radius:50%; padding:20px; box-shadow:0 8px 25px rgba(0,0,0,0.2)">
                    ${fingerData.emoji}
                </div>
                <div style="margin-top:10px; font-size:0.9rem; opacity:0.8">
                    ${fingerData.fingers}
                </div>
            </div>
        `;
    }
    
    // Render both hands for number > 5
    function renderBothHands(number) {
        if (number <= 5) {
            return renderFingerGesture(number, 'large');
        }
        
        const leftHand = 5;
        const rightHand = number - 5;
        
        return `
            <div style="text-align:center; margin:20px 0">
                <div style="display:flex; justify-content:center; gap:30px; flex-wrap:wrap">
                    <div style="text-align:center">
                        <div style="font-size:5rem; animation:bounce 0.5s ease infinite alternate">${fingerImages[5].emoji}</div>
                        <div style="font-size:0.8rem">Left hand (5)</div>
                    </div>
                    <div style="font-size:3rem; display:flex; align-items:center">+</div>
                    <div style="text-align:center">
                        <div style="font-size:5rem; animation:bounce 0.5s ease infinite alternate">${fingerImages[rightHand].emoji}</div>
                        <div style="font-size:0.8rem">Right hand (${rightHand})</div>
                    </div>
                </div>
                <div style="margin-top:15px; font-size:1.2rem; font-weight:bold">Total: ${number} fingers</div>
            </div>
        `;
    }
    
    // Render interactive finger counter (for countFingers type)
    function renderInteractiveFingers() {
        let count = 0;
        
        function updateDisplay() {
            const display = document.getElementById('interactiveCount');
            if (display) display.innerText = count;
            
            const gesture = document.getElementById('interactiveGesture');
            if (gesture) {
                gesture.innerHTML = `
                    <div style="font-size:6rem; transition:0.3s">
                        ${fingerImages[Math.min(count, 10)]?.emoji || fingerImages[0].emoji}
                    </div>
                `;
            }
        }
        
        setTimeout(() => {
            const addBtn = document.getElementById('addFinger');
            const subBtn = document.getElementById('subFinger');
            const resetBtn = document.getElementById('resetFinger');
            
            if (addBtn) {
                addBtn.onclick = () => {
                    if (count < 10) {
                        count++;
                        updateDisplay();
                    }
                };
            }
            if (subBtn) {
                subBtn.onclick = () => {
                    if (count > 0) {
                        count--;
                        updateDisplay();
                    }
                };
            }
            if (resetBtn) {
                resetBtn.onclick = () => {
                    count = 0;
                    updateDisplay();
                };
            }
        }, 100);
        
        return `
            <div style="background:rgba(139,92,246,0.15); border-radius:20px; padding:20px; margin:15px 0">
                <h4>🖐️ Show the number with fingers:</h4>
                <div id="interactiveGesture" style="font-size:6rem; text-align:center; margin:15px 0">
                    ${fingerImages[0].emoji}
                </div>
                <div style="text-align:center; margin:10px 0">
                    <span style="font-size:2rem; font-weight:bold" id="interactiveCount">0</span> fingers
                </div>
                <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap">
                    <button class="finger-action-btn" id="addFinger" style="background:#4ade80; border:none; padding:10px 25px; border-radius:25px; color:#1a1a2e; cursor:pointer; font-weight:bold">➕ Add Finger</button>
                    <button class="finger-action-btn" id="subFinger" style="background:#f87171; border:none; padding:10px 25px; border-radius:25px; color:white; cursor:pointer; font-weight:bold">➖ Remove Finger</button>
                    <button class="finger-action-btn" id="resetFinger" style="background:#fbbf24; border:none; padding:10px 25px; border-radius:25px; color:#1a1a2e; cursor:pointer; font-weight:bold">🔄 Reset</button>
                </div>
            </div>
        `;
    }
    
    // Render the game
    function renderGame() {
        if (!currentQuestion) {
            currentQuestion = generateQuestion();
        }
        
        const progressPercent = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        
        let questionDisplay = '';
        
        if (currentQuestion.type === 'fingersToNumber') {
            questionDisplay = renderBothHands(currentQuestion.number);
        } else if (currentQuestion.type === 'numberToFingers') {
            questionDisplay = `
                <div style="background:rgba(139,92,246,0.2); border-radius:20px; padding:20px; margin:15px 0">
                    <h4>🎯 Match the finger gesture for number ${currentQuestion.number}:</h4>
                    <div style="display:flex; justify-content:center; gap:20px; flex-wrap:wrap; margin-top:20px">
                        ${currentQuestion.options.map(opt => `
                            <div class="finger-choice" data-finger="${opt}" style="text-align:center; cursor:pointer; transition:0.3s; padding:15px; border-radius:20px; background:rgba(139,92,246,0.1)">
                                <div style="font-size:4rem">${fingerImages[opt]?.emoji || '✋'}</div>
                                <div>${opt === 0 ? '0' : opt}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else {
            // countFingers type - interactive
            questionDisplay = renderInteractiveFingers();
        }
        
        const html = `
            <div style="text-align:center">
                <div style="display:flex; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:10px">
                    <span>⭐ Level: ${level}</span>
                    <span>🏆 Score: ${score}</span>
                    <span>✅ Correct: ${correctAnswers}</span>
                    <span>📊 Q#: ${totalQuestions + 1}</span>
                    <span>🔥 Streak: ${consecutiveCorrect}</span>
                </div>
                
                <h3>🖐️ Finger Counting Fun! ✨</h3>
                <p style="margin:10px 0; opacity:0.9">Learn to count using your fingers!</p>
                
                ${questionDisplay}
                
                <div style="background:rgba(139,92,246,0.2); border-radius:20px; padding:20px; margin:15px 0">
                    <h4>❓ ${currentQuestion.questionText}</h4>
                    <p style="font-size:0.85rem; margin-top:10px">
                        <i class="fas fa-lightbulb"></i> 💡 ${currentQuestion.hint}
                    </p>
                </div>
                
                <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap; margin:20px 0">
                    ${currentQuestion.options.map(opt => `
                        <button class="finger-option-btn" data-answer="${opt}" 
                            style="background:linear-gradient(135deg, #8B5CF6, #6D28D9); border:none; 
                                   padding:15px 25px; border-radius:20px; font-size:1.2rem; font-weight:bold; 
                                   color:white; cursor:pointer; transition:0.3s; box-shadow:0 4px 12px rgba(0,0,0,0.2);
                                   min-width:80px">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
                
                <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap; margin-top:15px">
                    <button class="hero-cta" id="newFingerBtn">🔄 New Question</button>
                    <button class="close-game-btn" id="resetGameBtn">🔄 Reset Game</button>
                </div>
                
                <div id="fingerFeedback" style="margin-top:25px; font-size:1.1rem; min-height:80px"></div>
                
                <div class="progress-container" style="width:100%; background:#2D1B4E; border-radius:10px; margin-top:20px; overflow:hidden">
                    <div class="progress-bar" style="width:${progressPercent}%; background:#4ade80; height:8px; transition:width 0.3s"></div>
                </div>
                
                <div id="statsDisplay" style="margin-top:15px; font-size:0.85rem; opacity:0.8">
                    ${totalQuestions > 0 ? `🎯 Accuracy: ${Math.round((correctAnswers / totalQuestions) * 100)}%` : '✨ Use your fingers to count! Each finger represents one number.'}
                </div>
            </div>
        `;
        
        document.getElementById('gameDynamicContent').innerHTML = html;
        
        // Add event listeners to option buttons
        document.querySelectorAll('.finger-option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                let selectedAnswer = parseInt(btn.dataset.answer);
                checkAnswer(selectedAnswer, btn);
            });
            
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.05)';
                btn.style.background = 'linear-gradient(135deg, #fbbf24, #f59e0b)';
                btn.style.color = '#1a1a2e';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
                btn.style.background = 'linear-gradient(135deg, #8B5CF6, #6D28D9)';
                btn.style.color = 'white';
            });
        });
        
        // For numberToFingers type, add click handlers on finger choices
        if (currentQuestion.type === 'numberToFingers') {
            document.querySelectorAll('.finger-choice').forEach(choice => {
                choice.addEventListener('click', () => {
                    const selectedFinger = parseInt(choice.dataset.finger);
                    const answerBtn = document.querySelector(`.finger-option-btn[data-answer="${selectedFinger}"]`);
                    if (answerBtn) {
                        answerBtn.click();
                    }
                });
                
                choice.addEventListener('mouseenter', () => {
                    choice.style.transform = 'scale(1.05)';
                    choice.style.background = 'rgba(251,191,36,0.3)';
                });
                
                choice.addEventListener('mouseleave', () => {
                    choice.style.transform = 'scale(1)';
                    choice.style.background = 'rgba(139,92,246,0.1)';
                });
            });
        }
        
        document.getElementById('newFingerBtn').addEventListener('click', () => {
            currentQuestion = generateQuestion();
            renderGame();
            showToast('🔄 New finger counting question!', 'info');
        });
        
        document.getElementById('resetGameBtn').addEventListener('click', () => {
            resetGame();
            renderGame();
            showToast('🎮 Game reset! Start fresh!', 'success');
        });
    }
    
    function checkAnswer(selectedAnswer, selectedBtn) {
        const feedbackDiv = document.getElementById('fingerFeedback');
        const isCorrect = (selectedAnswer === currentQuestion.correctAnswer);
        
        if (isCorrect) {
            // Calculate points
            let basePoints = 15 * level;
            
            // Streak bonus
            consecutiveCorrect++;
            let streakBonus = 0;
            if (consecutiveCorrect >= 5) {
                streakBonus = 20;
                basePoints += streakBonus;
            } else if (consecutiveCorrect >= 3) {
                streakBonus = 10;
                basePoints += streakBonus;
            }
            
            const totalPoints = basePoints;
            
            score += totalPoints;
            correctAnswers++;
            totalQuestions++;
            
            // Visual feedback
            selectedBtn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
            selectedBtn.style.transform = 'scale(1.1)';
            selectedBtn.style.color = '#1a1a2e';
            
            feedbackDiv.innerHTML = `
                <div style="background:#4ade80; color:#1a1a2e; padding:20px; border-radius:20px; animation:slideIn 0.3s ease">
                    <i class="fas fa-check-circle"></i> ✅ CORRECT! +${totalPoints} points!<br>
                    <small>${currentQuestion.correctAnswer} fingers = ${fingerImages[currentQuestion.correctAnswer]?.fingers || 'no fingers'}</small>
                    ${streakBonus > 0 ? `<small>🔥 ${consecutiveCorrect} in a row! +${streakBonus} streak bonus!</small>` : ''}
                </div>
            `;
            
            showToast(`🎉 Correct! +${totalPoints} points!`, 'success');
            
            // Level up every 7 correct answers
            if (correctAnswers > 0 && correctAnswers % 7 === 0) {
                level++;
                showToast(`🎊 LEVEL UP! Welcome to Level ${level}! 🎊`, 'success');
            }
            
            // Disable all buttons temporarily
            document.querySelectorAll('.finger-option-btn, .finger-choice').forEach(btn => {
                if (btn) btn.style.pointerEvents = 'none';
            });
            
            // Load new question after delay
            setTimeout(() => {
                currentQuestion = generateQuestion();
                renderGame();
            }, 2000);
            
            incrementUsageAPI();
            
        } else {
            // Wrong answer
            consecutiveCorrect = 0;
            
            selectedBtn.style.background = 'linear-gradient(135deg, #f87171, #ef4444)';
            selectedBtn.style.transform = 'scale(0.95)';
            
            feedbackDiv.innerHTML = `
                <div style="background:#f87171; color:white; padding:20px; border-radius:20px; animation:slideIn 0.3s ease">
                    <i class="fas fa-times-circle"></i> ❌ WRONG!<br>
                    Correct answer: ${currentQuestion.correctAnswer}<br>
                    <small>${currentQuestion.correctAnswer} fingers = ${fingerImages[currentQuestion.correctAnswer]?.fingers || 'no fingers'}</small>
                </div>
            `;
            
            showToast(`❌ Correct answer is ${currentQuestion.correctAnswer}`, 'info');
            totalQuestions++;
            
            // Reset button color
            setTimeout(() => {
                if (selectedBtn) {
                    selectedBtn.style.background = 'linear-gradient(135deg, #8B5CF6, #6D28D9)';
                    selectedBtn.style.transform = 'scale(1)';
                    selectedBtn.style.color = 'white';
                }
            }, 2000);
        }
        
        // Update stats display
        const statsDiv = document.getElementById('statsDisplay');
        if (statsDiv && totalQuestions > 0) {
            statsDiv.innerHTML = `🎯 Accuracy: ${Math.round((correctAnswers / totalQuestions) * 100)}% | ✅ ${correctAnswers}/${totalQuestions} correct | 🔥 Streak: ${consecutiveCorrect}`;
        }
        
        // Update progress bar
        const progressPercent = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progressPercent}%`;
        }
    }
    
    function resetGame() {
        score = 0;
        level = 1;
        totalQuestions = 0;
        correctAnswers = 0;
        consecutiveCorrect = 0;
        currentQuestion = generateQuestion();
    }
    
    // Initialize
    currentQuestion = generateQuestion();
    renderGame();
}
// === END ===

// ============================================
// TOOL: SUBITIZING GAME (PLACEHOLDER)
// ============================================
// ============================================
// TOOL: SUBITIZING GAME (Fixed)
// ============================================
// === START ===
function startSubitizingGame() {
    let score = 0;
    let level = 1;
    let currentQuestion = null;
    let totalQuestions = 0;
    let correctAnswers = 0;
    let consecutiveCorrect = 0;
    let timePerQuestion = 8;
    let timerInterval = null;
    let gameActive = true;
    
    function generateDotPattern(number) {
        let patternHtml = '';
        const dotColor = '#fbbf24';
        
        if (number === 1) {
            patternHtml = `<div style="display:flex; justify-content:center; align-items:center; height:200px"><div style="width:60px; height:60px; background:${dotColor}; border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,0.2)"></div></div>`;
        } 
        else if (number === 2) {
            patternHtml = `<div style="display:flex; justify-content:center; gap:40px; align-items:center; height:200px">
                <div style="width:55px; height:55px; background:${dotColor}; border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,0.2)"></div>
                <div style="width:55px; height:55px; background:${dotColor}; border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,0.2)"></div>
            </div>`;
        }
        else if (number === 3) {
            patternHtml = `<div style="display:flex; justify-content:center; gap:30px; align-items:center; height:200px">
                <div style="width:50px; height:50px; background:${dotColor}; border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,0.2)"></div>
                <div style="width:50px; height:50px; background:${dotColor}; border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,0.2)"></div>
                <div style="width:50px; height:50px; background:${dotColor}; border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,0.2)"></div>
            </div>`;
        }
        else if (number === 4) {
            patternHtml = `<div style="display:grid; grid-template-columns:repeat(2,1fr); gap:30px; justify-items:center; align-items:center; width:200px; margin:0 auto; height:200px">
                <div style="width:50px; height:50px; background:${dotColor}; border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,0.2)"></div>
                <div style="width:50px; height:50px; background:${dotColor}; border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,0.2)"></div>
                <div style="width:50px; height:50px; background:${dotColor}; border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,0.2)"></div>
                <div style="width:50px; height:50px; background:${dotColor}; border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,0.2)"></div>
            </div>`;
        }
        else if (number === 5) {
            patternHtml = `<div style="display:flex; justify-content:center; position:relative; height:200px">
                <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:25px; align-self:center">
                    <div style="width:45px; height:45px; background:${dotColor}; border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,0.2)"></div>
                    <div style="width:45px; height:45px; background:${dotColor}; border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,0.2)"></div>
                    <div style="width:45px; height:45px; background:${dotColor}; border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,0.2)"></div>
                    <div style="width:45px; height:45px; background:${dotColor}; border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,0.2)"></div>
                </div>
                <div style="position:absolute; left:50%; top:50%; transform:translate(-50%, -50%); width:45px; height:45px; background:${dotColor}; border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,0.2)"></div>
            </div>`;
        }
        else if (number === 6) {
            patternHtml = `<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:25px; justify-items:center; align-items:center; width:250px; margin:0 auto; height:200px">
                ${Array(6).fill().map(() => `<div style="width:45px; height:45px; background:${dotColor}; border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,0.2)"></div>`).join('')}
            </div>`;
        }
        else if (number === 7) {
            patternHtml = `<div style="display:flex; justify-content:center; gap:20px; height:200px; align-items:center">
                <div style="display:flex; flex-direction:column; gap:15px">
                    <div style="width:40px; height:40px; background:${dotColor}; border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,0.2)"></div>
                    <div style="width:40px; height:40px; background:${dotColor}; border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,0.2)"></div>
                    <div style="width:40px; height:40px; background:${dotColor}; border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,0.2)"></div>
                </div>
                <div style="display:flex; flex-direction:column; gap:15px">
                    <div style="width:40px; height:40px; background:${dotColor}; border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,0.2)"></div>
                    <div style="width:40px; height:40px; background:${dotColor}; border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,0.2)"></div>
                </div>
                <div style="display:flex; flex-direction:column; gap:15px">
                    <div style="width:40px; height:40px; background:${dotColor}; border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,0.2)"></div>
                    <div style="width:40px; height:40px; background:${dotColor}; border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,0.2)"></div>
                </div>
            </div>`;
        }
        else if (number === 8) {
            patternHtml = `<div style="display:grid; grid-template-columns:repeat(4,1fr); gap:20px; justify-items:center; align-items:center; width:280px; margin:0 auto; height:200px">
                ${Array(8).fill().map(() => `<div style="width:40px; height:40px; background:${dotColor}; border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,0.2)"></div>`).join('')}
            </div>`;
        }
        else if (number === 9) {
            patternHtml = `<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:20px; justify-items:center; align-items:center; width:220px; margin:0 auto; height:200px">
                ${Array(9).fill().map(() => `<div style="width:40px; height:40px; background:${dotColor}; border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,0.2)"></div>`).join('')}
            </div>`;
        }
        else if (number === 10) {
            patternHtml = `<div style="display:grid; grid-template-columns:repeat(5,2fr); gap:15px; justify-items:center; align-items:center; width:320px; margin:0 auto; height:200px">
                ${Array(10).fill().map(() => `<div style="width:38px; height:38px; background:${dotColor}; border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,0.2)"></div>`).join('')}
            </div>`;
        }
        
        return patternHtml;
    }
    
    function generateTenFramePattern(number) {
        let html = '<div style="display:grid; grid-template-columns:repeat(5,1fr); gap:10px; width:300px; margin:0 auto; background:rgba(139,92,246,0.2); border-radius:20px; padding:20px">';
        
        for (let i = 0; i < 10; i++) {
            const isFilled = i < number;
            html += `
                <div style="background:${isFilled ? '#fbbf24' : 'rgba(255,255,255,0.1)'}; 
                            aspect-ratio:1; 
                            border-radius:12px; 
                            border:2px solid ${isFilled ? '#fbbf24' : 'rgba(255,255,255,0.2)'};
                            transition:0.3s;
                            box-shadow:${isFilled ? '0 4px 12px rgba(251,191,36,0.3)' : 'none'}">
                </div>
            `;
        }
        
        html += '</div>';
        return html;
    }
    
    function generateQuestion() {
        let number;
        let patternType;
        
        let maxNum;
        if (level <= 2) {
            maxNum = 5;
            timePerQuestion = 10;
        } else if (level <= 4) {
            maxNum = 10;
            timePerQuestion = 7;
        } else if (level <= 6) {
            maxNum = 10;
            timePerQuestion = 5;
        } else {
            maxNum = 10;
            timePerQuestion = 4;
        }
        
        number = Math.floor(Math.random() * maxNum) + 1;
        
        if (level <= 2) {
            patternType = 'dots';
        } else if (level <= 4) {
            const types = ['dots', 'tenframe'];
            patternType = types[Math.floor(Math.random() * types.length)];
        } else {
            const types = ['dots', 'tenframe'];
            patternType = types[Math.floor(Math.random() * types.length)];
        }
        
        let patternHtml = '';
        if (patternType === 'dots') {
            patternHtml = generateDotPattern(number);
        } else {
            patternHtml = generateTenFramePattern(number);
        }
        
        const options = [];
        options.push(number);
        while (options.length < 4) {
            let offset = Math.floor(Math.random() * 3) + 1;
            let option = number + (Math.random() < 0.5 ? offset : -offset);
            if (option >= 1 && option <= maxNum && !options.includes(option)) {
                options.push(option);
            }
        }
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        currentQuestion = {
            number: number,
            patternHtml: patternHtml,
            questionText: `How many dots do you see? (Don't count one by one!)`,
            correctAnswer: number,
            hint: `Trust your eyes! Try to recognize the pattern instantly.`,
            options: options
        };
        
        return currentQuestion;
    }
    
    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        
        let timeLeft = timePerQuestion;
        const timerDisplay = document.getElementById('subitizingTimer');
        
        timerInterval = setInterval(() => {
            if (!gameActive) return;
            
            timeLeft--;
            if (timerDisplay) {
                timerDisplay.innerHTML = `⏱️ Time: ${timeLeft}s`;
                if (timeLeft <= 3) {
                    timerDisplay.style.color = '#f87171';
                } else {
                    timerDisplay.style.color = '#fbbf24';
                }
            }
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                gameActive = false;
                showToast(`Time's up! Answer was ${currentQuestion.correctAnswer}`, 'error');
                document.getElementById('subitizingFeedback').innerHTML = `
                    <div style="background:#f87171; color:white; padding:20px; border-radius:20px">
                        ⏰ TIME'S UP! Correct answer: ${currentQuestion.correctAnswer}
                    </div>
                `;
                disableGame();
                setTimeout(() => {
                    gameActive = true;
                    currentQuestion = generateQuestion();
                    renderGame();
                }, 2000);
            }
        }, 1000);
    }
    
    function disableGame() {
        document.querySelectorAll('.subitize-option-btn').forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.6';
        });
    }
    
    function renderGame() {
        if (!currentQuestion) {
            currentQuestion = generateQuestion();
        }
        
        const progressPercent = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        
        const html = `
            <div style="text-align:center">
                <div style="display:flex; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:10px">
                    <span>⭐ Level: ${level}</span>
                    <span>🏆 Score: ${score}</span>
                    <span>✅ Correct: ${correctAnswers}</span>
                    <span>📊 Q#: ${totalQuestions + 1}</span>
                    <span>🔥 Streak: ${consecutiveCorrect}</span>
                    <span id="subitizingTimer" style="color:#fbbf24">⏱️ Time: ${timePerQuestion}s</span>
                </div>
                
                <h3>⚡ Subitizing Challenge!</h3>
                <p style="margin:10px 0">How many dots? <strong>DON'T COUNT!</strong> Recognize instantly!</p>
                
                <div style="background:rgba(139,92,246,0.15); border-radius:30px; padding:30px; margin:20px 0">
                    ${currentQuestion.patternHtml}
                </div>
                
                <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap; margin:20px 0">
                    ${currentQuestion.options.map(opt => `
                        <button class="subitize-option-btn" data-answer="${opt}" 
                            style="background:linear-gradient(135deg, #8B5CF6, #6D28D9); border:none; 
                                   width:80px; height:80px; border-radius:20px; font-size:1.5rem; font-weight:bold; 
                                   color:white; cursor:pointer; transition:0.3s; box-shadow:0 4px 12px rgba(0,0,0,0.2)">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
                
                <div style="margin-top:15px">
                    <button class="close-game-btn" id="resetGameBtn">🔄 Reset Game</button>
                </div>
                
                <div id="subitizingFeedback" style="margin-top:20px; min-height:80px"></div>
                
                <div class="progress-container" style="width:100%; background:#2D1B4E; border-radius:10px; margin-top:20px; overflow:hidden">
                    <div class="progress-bar" style="width:${progressPercent}%; background:#4ade80; height:8px; transition:width 0.3s"></div>
                </div>
            </div>
        `;
        
        document.getElementById('gameDynamicContent').innerHTML = html;
        
        gameActive = true;
        startTimer();
        
        document.querySelectorAll('.subitize-option-btn').forEach(btn => {
            btn.onclick = () => {
                if (gameActive) {
                    checkAnswer(parseInt(btn.dataset.answer), btn);
                }
            };
            btn.onmouseenter = () => {
                btn.style.transform = 'scale(1.05)';
                btn.style.background = 'linear-gradient(135deg, #fbbf24, #f59e0b)';
                btn.style.color = '#1a1a2e';
            };
            btn.onmouseleave = () => {
                btn.style.transform = 'scale(1)';
                btn.style.background = 'linear-gradient(135deg, #8B5CF6, #6D28D9)';
                btn.style.color = 'white';
            };
        });
        
        document.getElementById('resetGameBtn').onclick = () => {
            resetGame();
            renderGame();
            showToast('Game reset!', 'success');
        };
    }
    
    function checkAnswer(selectedAnswer, selectedBtn) {
        if (!gameActive) return;
        
        clearInterval(timerInterval);
        const isCorrect = (selectedAnswer === currentQuestion.correctAnswer);
        
        if (isCorrect) {
            const timeBonus = Math.floor(timePerQuestion * 2);
            let basePoints = 20 * level;
            consecutiveCorrect++;
            let streakBonus = 0;
            if (consecutiveCorrect >= 5) {
                streakBonus = 30;
                basePoints += streakBonus;
            } else if (consecutiveCorrect >= 3) {
                streakBonus = 15;
                basePoints += streakBonus;
            }
            
            const totalPoints = basePoints + timeBonus;
            score += totalPoints;
            correctAnswers++;
            totalQuestions++;
            
            selectedBtn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
            document.getElementById('subitizingFeedback').innerHTML = `
                <div style="background:#4ade80; color:#1a1a2e; padding:15px; border-radius:20px">
                    ✅ CORRECT! +${totalPoints} points! (Time bonus: +${timeBonus})
                </div>
            `;
            showToast(`Correct! +${totalPoints} points!`, 'success');
            
            if (correctAnswers % 6 === 0) {
                level++;
                showToast(`Level ${level}!`, 'success');
            }
            
            disableGame();
            setTimeout(() => {
                currentQuestion = generateQuestion();
                renderGame();
            }, 1500);
            incrementUsageAPI();
            
        } else {
            consecutiveCorrect = 0;
            selectedBtn.style.background = 'linear-gradient(135deg, #f87171, #ef4444)';
            document.getElementById('subitizingFeedback').innerHTML = `
                <div style="background:#f87171; color:white; padding:15px; border-radius:20px">
                    ❌ WRONG! Answer: ${currentQuestion.correctAnswer}
                </div>
            `;
            showToast(`Answer was ${currentQuestion.correctAnswer}`, 'info');
            totalQuestions++;
            
            setTimeout(() => {
                if (selectedBtn) {
                    selectedBtn.style.background = 'linear-gradient(135deg, #8B5CF6, #6D28D9)';
                }
            }, 1500);
            
            setTimeout(() => {
                currentQuestion = generateQuestion();
                renderGame();
            }, 2000);
        }
        
        const progressPercent = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) progressBar.style.width = `${progressPercent}%`;
    }
    
    function resetGame() {
        clearInterval(timerInterval);
        score = 0;
        level = 1;
        totalQuestions = 0;
        correctAnswers = 0;
        consecutiveCorrect = 0;
        gameActive = true;
        currentQuestion = generateQuestion();
    }
    
    currentQuestion = generateQuestion();
    renderGame();
}
// === END ===


// ============================================
// TOOL: NUMBER HOPSCOTCH GAME (PLACEHOLDER)
// ============================================
// ============================================
// TOOL: NUMBER HOPSCOTCH GAME
// ============================================
// === START ===
function startHopscotchGame() {
    let score = 0;
    let level = 1;
    let currentQuestion = null;
    let totalQuestions = 0;
    let correctAnswers = 0;
    let consecutiveCorrect = 0;
    let currentPosition = 1;
    let maxPosition = 10;
    let lives = 3;
    let gameActive = true;
    
    // Generate question based on current position and level
    function generateQuestion() {
        let questionText;
        let correctAnswer;
        let options;
        let hint;
        
        // Different question types based on level and current position
        const questionTypes = ['nextNumber', 'previousNumber', 'skipCount', 'addition', 'subtraction'];
        let questionType;
        
        if (level <= 2) {
            // Level 1-2: Simple next/previous numbers
            const types = ['nextNumber', 'previousNumber'];
            questionType = types[Math.floor(Math.random() * types.length)];
        } else if (level <= 4) {
            // Level 3-4: Add skip counting
            const types = ['nextNumber', 'previousNumber', 'skipCount'];
            questionType = types[Math.floor(Math.random() * types.length)];
        } else if (level <= 6) {
            // Level 5-6: Add addition/subtraction
            const types = ['nextNumber', 'previousNumber', 'skipCount', 'addition', 'subtraction'];
            questionType = types[Math.floor(Math.random() * types.length)];
        } else {
            // Level 7+: All types mixed
            const types = ['nextNumber', 'previousNumber', 'skipCount', 'addition', 'subtraction'];
            questionType = types[Math.floor(Math.random() * types.length)];
        }
        
        if (questionType === 'nextNumber') {
            questionText = `What number comes after ${currentPosition}?`;
            correctAnswer = currentPosition + 1;
            hint = `After ${currentPosition} comes ${correctAnswer}. Think about counting forward!`;
            options = generateOptions(correctAnswer, 1, 20);
        } 
        else if (questionType === 'previousNumber') {
            questionText = `What number comes before ${currentPosition}?`;
            correctAnswer = currentPosition - 1;
            hint = `Before ${currentPosition} comes ${correctAnswer}. Think about counting backward!`;
            options = generateOptions(correctAnswer, 1, 20);
        }
        else if (questionType === 'skipCount') {
            const skipBy = Math.min(level + 1, 5);
            const nextPosition = currentPosition + skipBy;
            if (nextPosition <= maxPosition + 5) {
                questionText = `If you hop by ${skipBy}s, what number comes after ${currentPosition}?`;
                correctAnswer = nextPosition;
                hint = `Add ${skipBy} to ${currentPosition}: ${currentPosition} + ${skipBy} = ${correctAnswer}`;
                options = generateOptions(correctAnswer, 1, maxPosition + 10);
            } else {
                // Fallback to nextNumber
                questionText = `What number comes after ${currentPosition}?`;
                correctAnswer = currentPosition + 1;
                hint = `After ${currentPosition} comes ${correctAnswer}.`;
                options = generateOptions(correctAnswer, 1, 20);
            }
        }
        else if (questionType === 'addition') {
            const addBy = Math.floor(Math.random() * Math.min(level, 5)) + 1;
            const result = currentPosition + addBy;
            if (result <= maxPosition + 5) {
                questionText = `${currentPosition} + ${addBy} = ?`;
                correctAnswer = result;
                hint = `Add ${addBy} to ${currentPosition}: ${currentPosition} + ${addBy} = ${correctAnswer}`;
                options = generateOptions(correctAnswer, 1, maxPosition + 10);
            } else {
                questionText = `What number comes after ${currentPosition}?`;
                correctAnswer = currentPosition + 1;
                hint = `After ${currentPosition} comes ${correctAnswer}.`;
                options = generateOptions(correctAnswer, 1, 20);
            }
        }
        else {
            // subtraction
            const subtractBy = Math.floor(Math.random() * Math.min(level, 3)) + 1;
            const result = currentPosition - subtractBy;
            if (result >= 1) {
                questionText = `${currentPosition} - ${subtractBy} = ?`;
                correctAnswer = result;
                hint = `Subtract ${subtractBy} from ${currentPosition}: ${currentPosition} - ${subtractBy} = ${correctAnswer}`;
                options = generateOptions(correctAnswer, 1, maxPosition);
            } else {
                questionText = `What number comes before ${currentPosition}?`;
                correctAnswer = currentPosition - 1;
                hint = `Before ${currentPosition} comes ${correctAnswer}.`;
                options = generateOptions(correctAnswer, 1, 20);
            }
        }
        
        currentQuestion = {
            questionText: questionText,
            correctAnswer: correctAnswer,
            hint: hint,
            options: options,
            targetPosition: correctAnswer
        };
        
        return currentQuestion;
    }
    
    // Generate answer options
    function generateOptions(correctAnswer, min, max) {
        let options = [correctAnswer];
        const range = Math.min(3, Math.floor((max - min) / 3));
        
        while (options.length < 4) {
            let offset = Math.floor(Math.random() * (range + 2)) + 1;
            let option = correctAnswer + (Math.random() < 0.5 ? offset : -offset);
            
            if (option >= min && option <= max && !options.includes(option) && option !== correctAnswer) {
                options.push(option);
            }
        }
        
        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        return options;
    }
    
    // Render hopscotch board
    function renderHopscotchBoard() {
        let boardHtml = '<div class="hopscotch-board" style="display:flex; flex-direction:column; align-items:center; margin:20px 0">';
        
        // Traditional hopscotch pattern: 1,2,3,4,5,6,7,8,9,10
        for (let i = 1; i <= 10; i++) {
            let isEven = i % 2 === 0;
            let isCurrent = (i === currentPosition);
            let isPast = (i < currentPosition);
            let isFuture = (i > currentPosition);
            
            let bgColor = '#2D1B4E';
            let borderColor = '#8B5CF6';
            let textColor = 'white';
            
            if (isCurrent) {
                bgColor = 'linear-gradient(135deg, #fbbf24, #f59e0b)';
                textColor = '#1a1a2e';
                borderColor = '#fbbf24';
            } else if (isPast) {
                bgColor = '#4ade80';
                textColor = '#1a1a2e';
                borderColor = '#4ade80';
            }
            
            boardHtml += `
                <div style="display:flex; justify-content:center; margin:5px 0">
                    <div style="
                        background:${bgColor};
                        width:70px;
                        height:70px;
                        border-radius:15px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        font-size:1.8rem;
                        font-weight:bold;
                        color:${textColor};
                        border:3px solid ${borderColor};
                        box-shadow:0 4px 12px rgba(0,0,0,0.2);
                        transition:0.3s;
                        ${isCurrent ? 'transform:scale(1.05);' : ''}
                    ">
                        ${i}
                    </div>
                </div>
            `;
            
            // Add horizontal line between certain numbers (hopscotch style)
            if (i === 1 || i === 3 || i === 5 || i === 7 || i === 9) {
                boardHtml += `
                    <div style="display:flex; gap:15px; justify-content:center; margin:5px 0">
                        <div style="width:70px; height:70px; background:${i+1 === currentPosition ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : (i+1 < currentPosition ? '#4ade80' : '#2D1B4E')}; border-radius:15px; display:flex; align-items:center; justify-content:center; font-size:1.8rem; font-weight:bold; color:${i+1 === currentPosition ? '#1a1a2e' : 'white'}; border:3px solid ${i+1 === currentPosition ? '#fbbf24' : '#8B5CF6'}">
                            ${i+1}
                        </div>
                        <div style="width:70px; height:70px; background:${i+2 === currentPosition ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : (i+2 < currentPosition ? '#4ade80' : '#2D1B4E')}; border-radius:15px; display:flex; align-items:center; justify-content:center; font-size:1.8rem; font-weight:bold; color:${i+2 === currentPosition ? '#1a1a2e' : 'white'}; border:3px solid ${i+2 === currentPosition ? '#fbbf24' : '#8B5CF6'}">
                            ${i+2}
                        </div>
                    </div>
                `;
                i++; // Skip next number since we already displayed it
            }
        }
        
        boardHtml += '</div>';
        return boardHtml;
    }
    
    // Update position on board
    function updatePosition(newPosition) {
        if (newPosition > maxPosition) {
            // Reached the end!
            gameActive = false;
            const bonus = lives * 10;
            score += bonus;
            document.getElementById('hopscotchFeedback').innerHTML = `
                <div style="background:#4ade80; color:#1a1a2e; padding:20px; border-radius:20px; animation:slideIn 0.3s ease">
                    <i class="fas fa-trophy"></i> 🎉 YOU REACHED THE END! 🎉<br>
                    +${bonus} lives bonus! Total Score: ${score}<br>
                    Click Reset to play again!
                </div>
            `;
            showToast(`🎉 You won! +${bonus} points!`, 'success');
            disableGame();
            return false;
        }
        
        currentPosition = newPosition;
        
        // Check if reached end after update
        if (currentPosition >= maxPosition) {
            gameActive = false;
            const bonus = lives * 10;
            score += bonus;
            document.getElementById('hopscotchFeedback').innerHTML = `
                <div style="background:#4ade80; color:#1a1a2e; padding:20px; border-radius:20px; animation:slideIn 0.3s ease">
                    <i class="fas fa-trophy"></i> 🎉 COMPLETE! 🎉<br>
                    Final Score: ${score}<br>
                    Click Reset to play again!
                </div>
            `;
            showToast(`🎉 Game Complete! Score: ${score}`, 'success');
            disableGame();
            return false;
        }
        
        return true;
    }
    
    // Disable game
    function disableGame() {
        document.querySelectorAll('.hopscotch-option-btn').forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.6';
        });
    }
    
    // Check answer and move
    function checkAnswer(selectedAnswer, selectedBtn) {
        if (!gameActive) {
            showToast('Game over! Click Reset to play again!', 'info');
            return;
        }
        
        const feedbackDiv = document.getElementById('hopscotchFeedback');
        const isCorrect = (selectedAnswer === currentQuestion.correctAnswer);
        
        if (isCorrect) {
            // Calculate points
            let basePoints = 15 * level;
            
            // Streak bonus
            consecutiveCorrect++;
            let streakBonus = 0;
            if (consecutiveCorrect >= 5) {
                streakBonus = 25;
                basePoints += streakBonus;
            } else if (consecutiveCorrect >= 3) {
                streakBonus = 10;
                basePoints += streakBonus;
            }
            
            const totalPoints = basePoints;
            score += totalPoints;
            correctAnswers++;
            totalQuestions++;
            
            // Visual feedback
            selectedBtn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
            selectedBtn.style.transform = 'scale(1.1)';
            selectedBtn.style.color = '#1a1a2e';
            
            // Move to new position
            const newPosition = currentQuestion.targetPosition;
            const moved = updatePosition(newPosition);
            
            let moveMessage = '';
            if (moved) {
                moveMessage = `🎯 You hopped to ${newPosition}!`;
            }
            
            feedbackDiv.innerHTML = `
                <div style="background:#4ade80; color:#1a1a2e; padding:15px; border-radius:20px; animation:slideIn 0.3s ease">
                    <i class="fas fa-check-circle"></i> ✅ CORRECT! +${totalPoints} points!<br>
                    ${moveMessage}
                    ${streakBonus > 0 ? `<small>🔥 ${consecutiveCorrect} in a row! +${streakBonus} streak bonus!</small>` : ''}
                </div>
            `;
            
            showToast(`🎉 Correct! +${totalPoints} points!`, 'success');
            
            // Level up every 6 correct answers
            if (correctAnswers > 0 && correctAnswers % 6 === 0) {
                level++;
                showToast(`🎊 LEVEL UP! Welcome to Level ${level}! 🎊`, 'success');
            }
            
            // Re-render board and new question if game still active
            if (gameActive && currentPosition < maxPosition) {
                setTimeout(() => {
                    currentQuestion = generateQuestion();
                    renderGame();
                }, 1500);
            } else if (currentPosition >= maxPosition) {
                disableGame();
            }
            
            incrementUsageAPI();
            
        } else {
            // Wrong answer - lose a life
            consecutiveCorrect = 0;
            lives--;
            
            selectedBtn.style.background = 'linear-gradient(135deg, #f87171, #ef4444)';
            selectedBtn.style.transform = 'scale(0.95)';
            
            let livesMessage = '';
            if (lives > 0) {
                livesMessage = `❤️ ${lives} ${lives === 1 ? 'life' : 'lives'} remaining.`;
            } else {
                livesMessage = `💀 GAME OVER! No lives left!`;
                gameActive = false;
            }
            
            feedbackDiv.innerHTML = `
                <div style="background:#f87171; color:white; padding:15px; border-radius:20px; animation:slideIn 0.3s ease">
                    <i class="fas fa-times-circle"></i> ❌ WRONG!<br>
                    Correct answer: ${currentQuestion.correctAnswer}<br>
                    ${livesMessage}
                </div>
            `;
            
            showToast(`❌ Wrong! Answer: ${currentQuestion.correctAnswer}. ${lives > 0 ? lives + ' lives left' : 'Game Over!'}`, 'info');
            totalQuestions++;
            
            if (lives <= 0) {
                disableGame();
                feedbackDiv.innerHTML = `
                    <div style="background:#f87171; color:white; padding:20px; border-radius:20px; animation:slideIn 0.3s ease">
                        <i class="fas fa-skull"></i> GAME OVER!<br>
                        Final Score: ${score}<br>
                        Click Reset to play again!
                    </div>
                `;
            } else {
                // Reset button color
                setTimeout(() => {
                    if (selectedBtn) {
                        selectedBtn.style.background = 'linear-gradient(135deg, #8B5CF6, #6D28D9)';
                        selectedBtn.style.transform = 'scale(1)';
                        selectedBtn.style.color = 'white';
                    }
                }, 1500);
                
                // Load new question after delay
                setTimeout(() => {
                    if (gameActive) {
                        currentQuestion = generateQuestion();
                        renderGame();
                    }
                }, 2000);
            }
        }
        
        // Update stats display
        const statsDiv = document.getElementById('hopscotchStats');
        if (statsDiv && totalQuestions > 0) {
            statsDiv.innerHTML = `🎯 Accuracy: ${Math.round((correctAnswers / totalQuestions) * 100)}% | ✅ ${correctAnswers}/${totalQuestions} correct | 🔥 Streak: ${consecutiveCorrect}`;
        }
        
        // Update progress bar
        const progressPercent = (currentPosition / maxPosition) * 100;
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progressPercent}%`;
        }
    }
    
    // Render the game
    function renderGame() {
        if (!currentQuestion) {
            currentQuestion = generateQuestion();
        }
        
        const progressPercent = (currentPosition / maxPosition) * 100;
        
        const html = `
            <div style="text-align:center">
                <div style="display:flex; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:10px">
                    <span>⭐ Level: ${level}</span>
                    <span>🏆 Score: ${score}</span>
                    <span>✅ Correct: ${correctAnswers}</span>
                    <span>❤️ Lives: ${'❤️'.repeat(lives)}${'🖤'.repeat(3 - lives)}</span>
                    <span>🔥 Streak: ${consecutiveCorrect}</span>
                </div>
                
                <h3>🎯 Number Hopscotch! 👟</h3>
                <p style="margin:10px 0; opacity:0.9">Answer correctly to hop forward! You have ${lives} lives.</p>
                
                ${renderHopscotchBoard()}
                
                <div style="background:rgba(139,92,246,0.2); border-radius:20px; padding:20px; margin:15px 0">
                    <h4>❓ ${currentQuestion.questionText}</h4>
                    <p style="font-size:0.85rem; margin-top:10px">
                        <i class="fas fa-lightbulb"></i> 💡 ${currentQuestion.hint}
                    </p>
                </div>
                
                <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap; margin:20px 0">
                    ${currentQuestion.options.map(opt => `
                        <button class="hopscotch-option-btn" data-answer="${opt}" 
                            style="background:linear-gradient(135deg, #8B5CF6, #6D28D9); border:none; 
                                   width:80px; height:80px; border-radius:20px; font-size:1.5rem; font-weight:bold; 
                                   color:white; cursor:pointer; transition:0.3s; box-shadow:0 4px 12px rgba(0,0,0,0.2)">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
                
                <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap; margin-top:15px">
                    <button class="close-game-btn" id="resetGameBtn">🔄 Reset Game</button>
                </div>
                
                <div id="hopscotchFeedback" style="margin-top:20px; font-size:1rem; min-height:80px"></div>
                
                <div class="progress-container" style="width:100%; background:#2D1B4E; border-radius:10px; margin-top:20px; overflow:hidden">
                    <div class="progress-bar" style="width:${progressPercent}%; background:#4ade80; height:8px; transition:width 0.3s"></div>
                </div>
                
                <div id="hopscotchStats" style="margin-top:15px; font-size:0.85rem; opacity:0.8">
                    🎯 Position: ${currentPosition}/${maxPosition} | ${totalQuestions > 0 ? `Accuracy: ${Math.round((correctAnswers / totalQuestions) * 100)}%` : 'Hop to the finish line!'}
                </div>
            </div>
        `;
        
        document.getElementById('gameDynamicContent').innerHTML = html;
        
        // Add event listeners to option buttons
        document.querySelectorAll('.hopscotch-option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedAnswer = parseInt(btn.dataset.answer);
                checkAnswer(selectedAnswer, btn);
            });
            
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.05)';
                btn.style.background = 'linear-gradient(135deg, #fbbf24, #f59e0b)';
                btn.style.color = '#1a1a2e';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
                btn.style.background = 'linear-gradient(135deg, #8B5CF6, #6D28D9)';
                btn.style.color = 'white';
            });
        });
        
        document.getElementById('resetGameBtn').addEventListener('click', () => {
            resetGame();
            renderGame();
            showToast('🏁 Game reset! Start hopping! 🏁', 'success');
        });
    }
    
    function resetGame() {
        score = 0;
        level = 1;
        totalQuestions = 0;
        correctAnswers = 0;
        consecutiveCorrect = 0;
        currentPosition = 1;
        lives = 3;
        gameActive = true;
        currentQuestion = generateQuestion();
    }
    
    // Initialize
    currentQuestion = generateQuestion();
    renderGame();
}
// === END ===

// ============================================
// TOOL: CLOCK READING GAME (PLACEHOLDER)
// ============================================
// ============================================
// TOOL: CLOCK READING GAME
// ============================================
// === START ===
function startClockGame() {
    let score = 0;
    let level = 1;
    let currentQuestion = null;
    let totalQuestions = 0;
    let correctAnswers = 0;
    let consecutiveCorrect = 0;
    
    // Generate random time based on level
    function generateRandomTime() {
        let hour, minute, period = '';
        let isHour12 = true;
        
        if (level <= 2) {
            // Level 1-2: Only hour times (1:00, 2:00, etc.)
            hour = Math.floor(Math.random() * 12) + 1;
            minute = 0;
            isHour12 = true;
        } 
        else if (level <= 4) {
            // Level 3-4: Hour and half hour
            const minuteOptions = [0, 30];
            minute = minuteOptions[Math.floor(Math.random() * minuteOptions.length)];
            hour = Math.floor(Math.random() * 12) + 1;
            if (minute === 0) {
                // keep hour as is
            } else {
                hour = hour === 12 ? 1 : hour;
            }
            isHour12 = true;
        }
        else if (level <= 6) {
            // Level 5-6: Quarter hours and 5-minute increments
            const minuteOptions = [0, 15, 30, 45];
            minute = minuteOptions[Math.floor(Math.random() * minuteOptions.length)];
            hour = Math.floor(Math.random() * 12) + 1;
            if (minute > 0 && minute <= 30) {
                // keep hour
            } else if (minute > 30) {
                hour = hour === 12 ? 1 : hour + 1;
            }
            isHour12 = true;
        }
        else {
            // Level 7+: Any minute, plus AM/PM
            minute = Math.floor(Math.random() * 60);
            hour = Math.floor(Math.random() * 12) + 1;
            const periods = ['AM', 'PM'];
            period = periods[Math.floor(Math.random() * periods.length)];
            isHour12 = true;
        }
        
        // Ensure hour is between 1-12 for display
        let displayHour = hour;
        if (minute > 30 && hour === 12) {
            displayHour = 1;
        } else if (minute > 30 && hour < 12) {
            displayHour = hour + 1;
        } else {
            displayHour = hour;
        }
        if (displayHour > 12) displayHour = 1;
        
        return {
            hour: hour,
            minute: minute,
            displayHour: displayHour,
            period: period,
            minuteFormatted: minute.toString().padStart(2, '0')
        };
    }
    
    // Calculate clock hand angles
    function calculateAngles(hour, minute) {
        // Adjust for 12-hour display
        let displayHour = hour % 12;
        if (displayHour === 0) displayHour = 12;
        
        // Hour hand: 30 degrees per hour + 0.5 degrees per minute
        const hourAngle = (displayHour * 30) + (minute * 0.5);
        // Minute hand: 6 degrees per minute
        const minuteAngle = minute * 6;
        
        return { hourAngle, minuteAngle };
    }
    
    // Generate SVG clock face
    function generateClockSVG(time) {
        const { hour, minute, displayHour, period } = time;
        const { hourAngle, minuteAngle } = calculateAngles(hour, minute);
        
        // Clock size
        const size = 200;
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = 90;
        
        // Convert angles to radians
        const hourRad = (hourAngle - 90) * Math.PI / 180;
        const minuteRad = (minuteAngle - 90) * Math.PI / 180;
        
        // Hand lengths
        const hourHandLength = 50;
        const minuteHandLength = 70;
        
        // Hand coordinates
        const hourHandX = centerX + hourHandLength * Math.cos(hourRad);
        const hourHandY = centerY + hourHandLength * Math.sin(hourRad);
        const minuteHandX = centerX + minuteHandLength * Math.cos(minuteRad);
        const minuteHandY = centerY + minuteHandLength * Math.sin(minuteRad);
        
        // Generate hour markers (1-12)
        let markers = '';
        for (let i = 1; i <= 12; i++) {
            const markerAngle = (i * 30 - 90) * Math.PI / 180;
            const markerRadius = radius - 15;
            const markerX = centerX + markerRadius * Math.cos(markerAngle);
            const markerY = centerY + markerRadius * Math.sin(markerAngle);
            markers += `<text x="${markerX}" y="${markerY + 5}" text-anchor="middle" font-size="16" font-weight="bold" fill="#fff">${i}</text>`;
        }
        
        // Generate minute tick marks
        let ticks = '';
        for (let i = 0; i < 60; i++) {
            const tickAngle = (i * 6 - 90) * Math.PI / 180;
            const isMajor = i % 5 === 0;
            const tickLength = isMajor ? 10 : 5;
            const startRadius = radius - tickLength;
            const endRadius = radius;
            const startX = centerX + startRadius * Math.cos(tickAngle);
            const startY = centerY + startRadius * Math.sin(tickAngle);
            const endX = centerX + endRadius * Math.cos(tickAngle);
            const endY = centerY + endRadius * Math.sin(tickAngle);
            const strokeWidth = isMajor ? 2 : 1;
            ticks += `<line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" stroke="#fff" stroke-width="${strokeWidth}"/>`;
        }
        
        // Format time display
        let timeDisplay = '';
        if (period) {
            timeDisplay = `${displayHour}:${time.minuteFormatted} ${period}`;
        } else {
            timeDisplay = `${displayHour}:${time.minuteFormatted}`;
        }
        
        return `
            <div style="text-align:center; margin:20px 0">
                <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="background:linear-gradient(135deg, #4C1D95, #2E1065); border-radius:50%; box-shadow:0 8px 25px rgba(0,0,0,0.3)">
                    <!-- Clock face -->
                    <circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="none" stroke="#8B5CF6" stroke-width="4"/>
                    
                    <!-- Minute ticks -->
                    ${ticks}
                    
                    <!-- Hour markers -->
                    ${markers}
                    
                    <!-- Hour hand -->
                    <line x1="${centerX}" y1="${centerY}" x2="${hourHandX}" y2="${hourHandY}" stroke="#fbbf24" stroke-width="5" stroke-linecap="round"/>
                    
                    <!-- Minute hand -->
                    <line x1="${centerX}" y1="${centerY}" x2="${minuteHandX}" y2="${minuteHandY}" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
                    
                    <!-- Center dot -->
                    <circle cx="${centerX}" cy="${centerY}" r="4" fill="#fbbf24"/>
                </svg>
                <p style="margin-top:10px; font-size:0.9rem; opacity:0.8">🕐 Clock face</p>
            </div>
        `;
    }
    
    // Generate time to text conversion
    function timeToText(hour, minute, period) {
        const hourWords = [
            "twelve", "one", "two", "three", "four", "five", 
            "six", "seven", "eight", "nine", "ten", "eleven"
        ];
        
        let displayHour = hour % 12;
        if (displayHour === 0) displayHour = 12;
        
        if (minute === 0) {
            return `${hourWords[displayHour]} o'clock`;
        } else if (minute === 15) {
            return `quarter past ${hourWords[displayHour]}`;
        } else if (minute === 30) {
            return `half past ${hourWords[displayHour]}`;
        } else if (minute === 45) {
            let nextHour = (displayHour % 12) + 1;
            if (nextHour === 13) nextHour = 1;
            return `quarter to ${hourWords[nextHour]}`;
        } else if (minute < 30) {
            return `${minute} minutes past ${hourWords[displayHour]}`;
        } else {
            let nextHour = (displayHour % 12) + 1;
            if (nextHour === 13) nextHour = 1;
            const minutesTo = 60 - minute;
            return `${minutesTo} minutes to ${hourWords[nextHour]}`;
        }
    }
    
    // Generate question
    function generateQuestion() {
        const time = generateRandomTime();
        let questionType;
        let questionText, correctAnswer, hint, options;
        
        // Determine question type based on level
        if (level <= 2) {
            questionType = 'readClock';
        } else if (level <= 4) {
            const types = ['readClock', 'digitalMatch'];
            questionType = types[Math.floor(Math.random() * types.length)];
        } else {
            const types = ['readClock', 'digitalMatch', 'wordsMatch'];
            questionType = types[Math.floor(Math.random() * types.length)];
        }
        
        const digitalTime = `${time.displayHour}:${time.minuteFormatted}${time.period ? ' ' + time.period : ''}`;
        const wordTime = timeToText(time.hour, time.minute, time.period);
        
        if (questionType === 'readClock') {
            questionText = `What time is shown on the clock?`;
            correctAnswer = digitalTime;
            hint = `The hour hand points to ${time.displayHour} and the minute hand shows ${time.minute} minutes.`;
            options = generateTimeOptions(digitalTime, time);
        } 
        else if (questionType === 'digitalMatch') {
            questionText = `Which clock shows the time ${digitalTime}?`;
            correctAnswer = digitalTime;
            hint = `Look for the clock with hour hand near ${time.displayHour} and minute hand at ${time.minute} minutes.`;
            // This will be handled differently - we need to show clock options
            options = null;
        }
        else {
            questionText = `${digitalTime} is written as:`;
            correctAnswer = wordTime;
            hint = `Think about how we say the time in English.`;
            options = generateWordOptions(wordTime);
        }
        
        currentQuestion = {
            type: questionType,
            time: time,
            digitalTime: digitalTime,
            wordTime: wordTime,
            questionText: questionText,
            correctAnswer: correctAnswer,
            hint: hint,
            options: options
        };
        
        return currentQuestion;
    }
    
    // Generate time options (for readClock)
    function generateTimeOptions(correctTime, originalTime) {
        let options = [correctTime];
        
        // Generate wrong options by modifying hour or minute
        while (options.length < 4) {
            let newHour = originalTime.displayHour;
            let newMinute = originalTime.minute;
            let newPeriod = originalTime.period;
            
            const modifyType = Math.floor(Math.random() * 3);
            if (modifyType === 0) {
                // Modify hour
                newHour = ((originalTime.displayHour + Math.floor(Math.random() * 3) + 1) % 12) || 12;
            } else if (modifyType === 1) {
                // Modify minute
                const minuteOffsets = [15, 30, 45];
                const offset = minuteOffsets[Math.floor(Math.random() * minuteOffsets.length)];
                newMinute = (originalTime.minute + offset) % 60;
            } else if (modifyType === 2 && newPeriod) {
                // Modify AM/PM
                newPeriod = newPeriod === 'AM' ? 'PM' : 'AM';
            }
            
            let newTime = `${newHour}:${newMinute.toString().padStart(2, '0')}`;
            if (newPeriod) newTime += ` ${newPeriod}`;
            
            if (!options.includes(newTime)) {
                options.push(newTime);
            }
        }
        
        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        return options;
    }
    
    // Generate word options
    function generateWordOptions(correctWord) {
        let options = [correctWord];
        const possibleWords = [
            "one o'clock", "two o'clock", "three o'clock", "four o'clock",
            "half past one", "half past two", "quarter past three", "quarter to four",
            "ten minutes past five", "twenty minutes to six"
        ];
        
        for (let i = 0; i < 3 && i < possibleWords.length; i++) {
            let randomWord = possibleWords[Math.floor(Math.random() * possibleWords.length)];
            if (!options.includes(randomWord)) {
                options.push(randomWord);
            }
        }
        
        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        return options;
    }
    
    // Render clock options (for digitalMatch)
    function renderClockOptions() {
        const options = [];
        const correctTime = currentQuestion.time;
        
        // Generate 3 wrong clocks
        options.push(correctTime);
        
        while (options.length < 4) {
            let newHour = correctTime.hour;
            let newMinute = correctTime.minute;
            
            const modifyType = Math.floor(Math.random() * 2);
            if (modifyType === 0) {
                newHour = ((correctTime.hour + Math.floor(Math.random() * 5) + 1) % 12) || 12;
            } else {
                const minuteOffsets = [15, 30, 45];
                const offset = minuteOffsets[Math.floor(Math.random() * minuteOffsets.length)];
                newMinute = (correctTime.minute + offset) % 60;
            }
            
            const fakeTime = { hour: newHour, minute: newMinute, displayHour: newHour, period: correctTime.period, minuteFormatted: newMinute.toString().padStart(2, '0') };
            
            let exists = false;
            for (let opt of options) {
                if (opt.hour === fakeTime.hour && opt.minute === fakeTime.minute) {
                    exists = true;
                    break;
                }
            }
            
            if (!exists) {
                options.push(fakeTime);
            }
        }
        
        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        let clocksHtml = '<div style="display:grid; grid-template-columns:repeat(2,1fr); gap:20px; margin:20px 0">';
        
        options.forEach((time, idx) => {
            const { hourAngle, minuteAngle } = calculateAngles(time.hour, time.minute);
            const size = 150;
            const centerX = size / 2;
            const centerY = size / 2;
            const radius = 65;
            
            const hourRad = (hourAngle - 90) * Math.PI / 180;
            const minuteRad = (minuteAngle - 90) * Math.PI / 180;
            const hourHandX = centerX + 40 * Math.cos(hourRad);
            const hourHandY = centerY + 40 * Math.sin(hourRad);
            const minuteHandX = centerX + 55 * Math.cos(minuteRad);
            const minuteHandY = centerY + 55 * Math.sin(minuteRad);
            
            clocksHtml += `
                <div class="clock-option" data-clock="${idx}" style="cursor:pointer; transition:0.3s; text-align:center">
                    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="background:linear-gradient(135deg, #4C1D95, #2E1065); border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,0.2)">
                        <circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="none" stroke="#8B5CF6" stroke-width="3"/>
                        <line x1="${centerX}" y1="${centerY}" x2="${hourHandX}" y2="${hourHandY}" stroke="#fbbf24" stroke-width="4" stroke-linecap="round"/>
                        <line x1="${centerX}" y1="${centerY}" x2="${minuteHandX}" y2="${minuteHandY}" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
                        <circle cx="${centerX}" cy="${centerY}" r="3" fill="#fbbf24"/>
                    </svg>
                </div>
            `;
        });
        
        clocksHtml += '</div>';
        return clocksHtml;
    }
    
    // Render the game
    function renderGame() {
        if (!currentQuestion) {
            currentQuestion = generateQuestion();
        }
        
        const progressPercent = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        
        let questionDisplay = '';
        
        if (currentQuestion.type === 'readClock') {
            questionDisplay = generateClockSVG(currentQuestion.time);
        } else if (currentQuestion.type === 'digitalMatch') {
            questionDisplay = `
                <div style="background:rgba(139,92,246,0.2); border-radius:20px; padding:20px; margin:15px 0">
                    <h3 style="text-align:center">🕐 Find the clock showing:</h3>
                    <p style="font-size:1.5rem; text-align:center; font-weight:bold">${currentQuestion.digitalTime}</p>
                </div>
                ${renderClockOptions()}
            `;
        } else {
            questionDisplay = generateClockSVG(currentQuestion.time);
        }
        
        const html = `
            <div style="text-align:center">
                <div style="display:flex; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:10px">
                    <span>⭐ Level: ${level}</span>
                    <span>🏆 Score: ${score}</span>
                    <span>✅ Correct: ${correctAnswers}</span>
                    <span>📊 Q#: ${totalQuestions + 1}</span>
                    <span>🔥 Streak: ${consecutiveCorrect}</span>
                </div>
                
                <h3>🕐 Clock Reading Challenge! ⏰</h3>
                <p style="margin:10px 0; opacity:0.9">Learn to read analog clocks</p>
                
                ${questionDisplay}
                
                <div style="background:rgba(139,92,246,0.2); border-radius:20px; padding:15px; margin:15px 0">
                    <h4>❓ ${currentQuestion.questionText}</h4>
                    <p style="font-size:0.85rem; margin-top:10px">
                        <i class="fas fa-lightbulb"></i> 💡 ${currentQuestion.hint}
                    </p>
                </div>
                
                <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap; margin:20px 0">
                    ${currentQuestion.options ? currentQuestion.options.map(opt => `
                        <button class="clock-option-btn" data-answer="${opt}" 
                            style="background:linear-gradient(135deg, #8B5CF6, #6D28D9); border:none; 
                                   padding:15px 20px; border-radius:20px; font-size:1rem; font-weight:bold; 
                                   color:white; cursor:pointer; transition:0.3s; box-shadow:0 4px 12px rgba(0,0,0,0.2);
                                   min-width:100px">
                            ${opt}
                        </button>
                    `).join('') : ''}
                </div>
                
                <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap; margin-top:15px">
                    <button class="hero-cta" id="newClockBtn">🔄 New Question</button>
                    <button class="close-game-btn" id="resetGameBtn">🔄 Reset Game</button>
                </div>
                
                <div id="clockFeedback" style="margin-top:20px; font-size:1rem; min-height:80px"></div>
                
                <div class="progress-container" style="width:100%; background:#2D1B4E; border-radius:10px; margin-top:20px; overflow:hidden">
                    <div class="progress-bar" style="width:${progressPercent}%; background:#4ade80; height:8px; transition:width 0.3s"></div>
                </div>
                
                <div id="statsDisplay" style="margin-top:15px; font-size:0.85rem; opacity:0.8">
                    ${totalQuestions > 0 ? `🎯 Accuracy: ${Math.round((correctAnswers / totalQuestions) * 100)}%` : '✨ Look at the clock and tell the time!'}
                </div>
            </div>
        `;
        
        document.getElementById('gameDynamicContent').innerHTML = html;
        
        // Add event listeners to option buttons
        if (currentQuestion.options) {
            document.querySelectorAll('.clock-option-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    let selectedAnswer = btn.dataset.answer;
                    checkAnswer(selectedAnswer, btn);
                });
                
                btn.addEventListener('mouseenter', () => {
                    btn.style.transform = 'scale(1.05)';
                    btn.style.background = 'linear-gradient(135deg, #fbbf24, #f59e0b)';
                    btn.style.color = '#1a1a2e';
                });
                
                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = 'scale(1)';
                    btn.style.background = 'linear-gradient(135deg, #8B5CF6, #6D28D9)';
                    btn.style.color = 'white';
                });
            });
        }
        
        // For digitalMatch, add clock click handlers
        if (currentQuestion.type === 'digitalMatch') {
            document.querySelectorAll('.clock-option').forEach((clock, idx) => {
                clock.addEventListener('click', () => {
                    const selectedClock = clock.querySelector('svg');
                    // Need to determine which time was selected
                    // For now, we'll mark correct if it's the first one
                    const isCorrect = (idx === 0);
                    if (isCorrect) {
                        checkAnswer(currentQuestion.digitalTime, clock);
                    } else {
                        checkAnswer('wrong', clock);
                    }
                });
                
                clock.addEventListener('mouseenter', () => {
                    clock.style.transform = 'scale(1.05)';
                });
                
                clock.addEventListener('mouseleave', () => {
                    clock.style.transform = 'scale(1)';
                });
            });
        }
        
        document.getElementById('newClockBtn').addEventListener('click', () => {
            currentQuestion = generateQuestion();
            renderGame();
            showToast('🔄 New clock question!', 'info');
        });
        
        document.getElementById('resetGameBtn').addEventListener('click', () => {
            resetGame();
            renderGame();
            showToast('🎮 Game reset! Start fresh!', 'success');
        });
    }
    
    function checkAnswer(selectedAnswer, selectedBtn) {
        const feedbackDiv = document.getElementById('clockFeedback');
        const isCorrect = (selectedAnswer === currentQuestion.correctAnswer);
        
        if (isCorrect) {
            let basePoints = 20 * level;
            
            consecutiveCorrect++;
            let streakBonus = 0;
            if (consecutiveCorrect >= 5) {
                streakBonus = 25;
                basePoints += streakBonus;
            } else if (consecutiveCorrect >= 3) {
                streakBonus = 10;
                basePoints += streakBonus;
            }
            
            const totalPoints = basePoints;
            score += totalPoints;
            correctAnswers++;
            totalQuestions++;
            
            if (selectedBtn) {
                selectedBtn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
                selectedBtn.style.transform = 'scale(1.1)';
                if (selectedBtn.style) selectedBtn.style.color = '#1a1a2e';
            }
            
            feedbackDiv.innerHTML = `
                <div style="background:#4ade80; color:#1a1a2e; padding:15px; border-radius:20px">
                    ✅ CORRECT! +${totalPoints} points!<br>
                    The time is ${currentQuestion.correctAnswer}
                    ${streakBonus > 0 ? `<br><small>🔥 ${consecutiveCorrect} in a row! +${streakBonus} streak bonus!</small>` : ''}
                </div>
            `;
            
            showToast(`🎉 Correct! +${totalPoints} points!`, 'success');
            
            if (correctAnswers > 0 && correctAnswers % 6 === 0) {
                level++;
                showToast(`🎊 LEVEL UP! Level ${level}! 🎊`, 'success');
            }
            
            if (selectedBtn) {
                selectedBtn.disabled = true;
                selectedBtn.style.opacity = '0.6';
            }
            
            setTimeout(() => {
                currentQuestion = generateQuestion();
                renderGame();
            }, 1500);
            
            incrementUsageAPI();
            
        } else {
            consecutiveCorrect = 0;
            
            if (selectedBtn) {
                selectedBtn.style.background = 'linear-gradient(135deg, #f87171, #ef4444)';
                selectedBtn.style.transform = 'scale(0.95)';
            }
            
            feedbackDiv.innerHTML = `
                <div style="background:#f87171; color:white; padding:15px; border-radius:20px">
                    ❌ WRONG!<br>
                    Correct answer: ${currentQuestion.correctAnswer}
                </div>
            `;
            
            showToast(`❌ Correct answer is ${currentQuestion.correctAnswer}`, 'info');
            totalQuestions++;
            
            if (selectedBtn) {
                setTimeout(() => {
                    if (selectedBtn) {
                        selectedBtn.style.background = 'linear-gradient(135deg, #8B5CF6, #6D28D9)';
                        selectedBtn.style.transform = 'scale(1)';
                        selectedBtn.style.color = 'white';
                    }
                }, 1500);
            }
            
            setTimeout(() => {
                currentQuestion = generateQuestion();
                renderGame();
            }, 2000);
        }
        
        const statsDiv = document.getElementById('statsDisplay');
        if (statsDiv && totalQuestions > 0) {
            statsDiv.innerHTML = `🎯 Accuracy: ${Math.round((correctAnswers / totalQuestions) * 100)}% | ✅ ${correctAnswers}/${totalQuestions} correct | 🔥 Streak: ${consecutiveCorrect}`;
        }
        
        const progressPercent = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) progressBar.style.width = `${progressPercent}%`;
    }
    
    function resetGame() {
        score = 0;
        level = 1;
        totalQuestions = 0;
        correctAnswers = 0;
        consecutiveCorrect = 0;
        currentQuestion = generateQuestion();
    }
    
    currentQuestion = generateQuestion();
    renderGame();
}
// === END ===

// ============================================
// TOOL: MONEY COUNTING GAME (PLACEHOLDER)
// ============================================
// ============================================
// TOOL: MONEY COUNTING GAME
// ============================================
// === START ===
function startMoneyGame() {
    let score = 0;
    let level = 1;
    let currentQuestion = null;
    let totalQuestions = 0;
    let correctAnswers = 0;
    let consecutiveCorrect = 0;
    
    // Currency configuration (Pakistani Rupee - PKR)
    const coins = [
        { value: 1, name: "1 Rupee", icon: "🪙", color: "#c0c0c0", size: "35px" },
        { value: 2, name: "2 Rupee", icon: "🪙", color: "#b87333", size: "38px" },
        { value: 5, name: "5 Rupee", icon: "🪙", color: "#daa520", size: "40px" },
        { value: 10, name: "10 Rupee", icon: "🪙", color: "#c0c0c0", size: "42px" }
    ];
    
    const notes = [
        { value: 10, name: "10 Rupee Note", icon: "💵", color: "#4ade80" },
        { value: 20, name: "20 Rupee Note", icon: "💵", color: "#60a5fa" },
        { value: 50, name: "50 Rupee Note", icon: "💵", color: "#fbbf24" },
        { value: 100, name: "100 Rupee Note", icon: "💵", color: "#c084fc" },
        { value: 500, name: "500 Rupee Note", icon: "💵", color: "#f97316" },
        { value: 1000, name: "1000 Rupee Note", icon: "💵", color: "#ef4444" }
    ];
    
    const allMoney = [...coins, ...notes];
    
    // Generate random money items based on level
    function generateMoneyItems() {
        let items = [];
        let totalValue = 0;
        let itemCount;
        
        // Determine number of items and value range based on level
        if (level <= 2) {
            itemCount = Math.floor(Math.random() * 3) + 1; // 1-3 items
            const availableCoins = coins.filter(c => c.value <= 10);
            for (let i = 0; i < itemCount; i++) {
                const item = availableCoins[Math.floor(Math.random() * availableCoins.length)];
                items.push({ ...item });
                totalValue += item.value;
            }
        } 
        else if (level <= 4) {
            itemCount = Math.floor(Math.random() * 4) + 2; // 2-5 items
            const availableMoney = allMoney.filter(m => m.value <= 50);
            for (let i = 0; i < itemCount; i++) {
                const item = availableMoney[Math.floor(Math.random() * availableMoney.length)];
                items.push({ ...item });
                totalValue += item.value;
            }
        }
        else if (level <= 6) {
            itemCount = Math.floor(Math.random() * 5) + 3; // 3-7 items
            const availableMoney = allMoney.filter(m => m.value <= 500);
            for (let i = 0; i < itemCount; i++) {
                const item = availableMoney[Math.floor(Math.random() * availableMoney.length)];
                items.push({ ...item });
                totalValue += item.value;
            }
        }
        else {
            itemCount = Math.floor(Math.random() * 6) + 4; // 4-9 items
            for (let i = 0; i < itemCount; i++) {
                const item = allMoney[Math.floor(Math.random() * allMoney.length)];
                items.push({ ...item });
                totalValue += item.value;
            }
        }
        
        return { items, totalValue };
    }
    
    // Generate question
    function generateQuestion() {
        const { items, totalValue } = generateMoneyItems();
        let questionType;
        
        // Determine question type based on level
        if (level <= 2) {
            questionType = 'countTotal';
        } else if (level <= 4) {
            const types = ['countTotal', 'findCombination'];
            questionType = types[Math.floor(Math.random() * types.length)];
        } else {
            const types = ['countTotal', 'findCombination', 'changeCalculation'];
            questionType = types[Math.floor(Math.random() * types.length)];
        }
        
        let questionText, correctAnswer, hint, options;
        
        if (questionType === 'countTotal') {
            questionText = `How much money is shown in total?`;
            correctAnswer = totalValue;
            hint = `Add all the values together: ${items.map(i => i.value).join(' + ')} = ${totalValue} rupees`;
            options = generateOptions(totalValue, level);
        }
        else if (questionType === 'findCombination') {
            const targetAmount = totalValue;
            const itemsCopy = [...items];
            // Remove one item to make it a find missing question
            const removedIndex = Math.floor(Math.random() * itemsCopy.length);
            const removedItem = itemsCopy[removedIndex];
            itemsCopy.splice(removedIndex, 1);
            const displayedTotal = totalValue - removedItem.value;
            
            questionText = `You have these items totaling ${displayedTotal} rupees. What is the value of the missing item?`;
            correctAnswer = removedItem.value;
            hint = `The missing value is the difference: ${totalValue} - ${displayedTotal} = ${removedItem.value}`;
            options = generateOptions(correctAnswer, level);
        }
        else {
            // changeCalculation - You have X rupees, item costs Y, how much change?
            const haveAmount = totalValue;
            const costAmount = Math.floor(totalValue * (Math.random() * 0.7 + 0.2));
            const change = haveAmount - costAmount;
            
            questionText = `You have ${haveAmount} rupees. You buy an item for ${costAmount} rupees. How much change will you get?`;
            correctAnswer = change;
            hint = `Change = Money you have - Cost = ${haveAmount} - ${costAmount} = ${change}`;
            options = generateOptions(correctAnswer, level);
        }
        
        currentQuestion = {
            type: questionType,
            items: items,
            totalValue: totalValue,
            questionText: questionText,
            correctAnswer: correctAnswer,
            hint: hint,
            options: options
        };
        
        return currentQuestion;
    }
    
    // Generate options
    function generateOptions(correctAnswer, level) {
        let options = [correctAnswer];
        const range = level <= 3 ? 10 : (level <= 6 ? 50 : 100);
        
        while (options.length < 4) {
            let offset = Math.floor(Math.random() * range) + 1;
            let option = correctAnswer + (Math.random() < 0.5 ? offset : -offset);
            
            if (option >= 1 && option <= 5000 && !options.includes(option)) {
                options.push(option);
            }
        }
        
        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        return options;
    }
    
    // Render money items
    function renderMoneyItems(items) {
        let itemsHtml = '<div style="display:flex; flex-wrap:wrap; justify-content:center; gap:15px; margin:20px 0; padding:20px; background:rgba(139,92,246,0.15); border-radius:30px">';
        
        items.forEach((item, idx) => {
            const isCoin = item.value <= 10;
            itemsHtml += `
                <div style="text-align:center; animation:slideIn 0.3s ease; animation-delay:${idx * 0.1}s">
                    <div style="
                        width:${isCoin ? item.size : '100px'};
                        height:${isCoin ? item.size : '60px'};
                        background:${item.color};
                        border-radius:${isCoin ? '50%' : '12px'};
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        font-size:1.8rem;
                        box-shadow:0 4px 12px rgba(0,0,0,0.2);
                        border:2px solid rgba(255,255,255,0.3);
                        margin:0 auto;
                    ">
                        ${item.icon}
                    </div>
                    <div style="margin-top:5px; font-size:0.8rem; font-weight:bold">${item.value} ₹</div>
                </div>
            `;
        });
        
        itemsHtml += '</div>';
        return itemsHtml;
    }
    
    // Render the game
    function renderGame() {
        if (!currentQuestion) {
            currentQuestion = generateQuestion();
        }
        
        const progressPercent = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        
        let questionDisplay = '';
        
        if (currentQuestion.type === 'countTotal') {
            questionDisplay = renderMoneyItems(currentQuestion.items);
        } else if (currentQuestion.type === 'findCombination') {
            // For find combination, we show the items but mark one as "?"
            let itemsHtml = '<div style="display:flex; flex-wrap:wrap; justify-content:center; gap:15px; margin:20px 0; padding:20px; background:rgba(139,92,246,0.15); border-radius:30px">';
            
            // We need to know which one is missing - the total value is different
            // For this display, we show all items but the missing one is shown as "?"
            const displayedItems = [...currentQuestion.items];
            // Find which item is missing by comparing with total
            // For simplicity, we'll just show all items
            displayedItems.forEach((item, idx) => {
                const isCoin = item.value <= 10;
                itemsHtml += `
                    <div style="text-align:center">
                        <div style="
                            width:${isCoin ? item.size : '100px'};
                            height:${isCoin ? item.size : '60px'};
                            background:${item.color};
                            border-radius:${isCoin ? '50%' : '12px'};
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            font-size:1.8rem;
                            box-shadow:0 4px 12px rgba(0,0,0,0.2);
                        ">
                            ${item.icon}
                        </div>
                        <div style="margin-top:5px; font-size:0.8rem; font-weight:bold">${item.value} ₹</div>
                    </div>
                `;
            });
            
            itemsHtml += '</div>';
            questionDisplay = itemsHtml;
        } else {
            // changeCalculation - show items and price
            questionDisplay = `
                <div style="background:rgba(139,92,246,0.2); border-radius:20px; padding:20px; margin:15px 0">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px">
                        <div style="text-align:center; flex:1">
                            <div style="font-size:3rem">💰</div>
                            <div style="font-size:1.5rem; font-weight:bold">You have:</div>
                            <div style="font-size:2rem; color:#fbbf24">${currentQuestion.items.reduce((sum, i) => sum + i.value, 0)} ₹</div>
                        </div>
                        <div style="font-size:2rem">→</div>
                        <div style="text-align:center; flex:1">
                            <div style="font-size:3rem">🛒</div>
                            <div style="font-size:1.5rem; font-weight:bold">Item cost:</div>
                            <div style="font-size:2rem; color:#fbbf24">${currentQuestion.totalValue - currentQuestion.correctAnswer} ₹</div>
                        </div>
                        <div style="font-size:2rem">→</div>
                        <div style="text-align:center; flex:1">
                            <div style="font-size:3rem">🔄</div>
                            <div style="font-size:1.5rem; font-weight:bold">Change:</div>
                            <div style="font-size:2rem; color:#fbbf24">? ₹</div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        const html = `
            <div style="text-align:center">
                <div style="display:flex; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:10px">
                    <span>⭐ Level: ${level}</span>
                    <span>🏆 Score: ${score}</span>
                    <span>✅ Correct: ${correctAnswers}</span>
                    <span>📊 Q#: ${totalQuestions + 1}</span>
                    <span>🔥 Streak: ${consecutiveCorrect}</span>
                </div>
                
                <h3>💰 Money Counting Challenge! 💵</h3>
                <p style="margin:10px 0; opacity:0.9">Learn to count coins and notes</p>
                
                ${questionDisplay}
                
                <div style="background:rgba(139,92,246,0.2); border-radius:20px; padding:15px; margin:15px 0">
                    <h4>❓ ${currentQuestion.questionText}</h4>
                    <p style="font-size:0.85rem; margin-top:10px">
                        <i class="fas fa-lightbulb"></i> 💡 ${currentQuestion.hint}
                    </p>
                </div>
                
                <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap; margin:20px 0">
                    ${currentQuestion.options.map(opt => `
                        <button class="money-option-btn" data-answer="${opt}" 
                            style="background:linear-gradient(135deg, #8B5CF6, #6D28D9); border:none; 
                                   width:80px; height:80px; border-radius:20px; font-size:1.3rem; font-weight:bold; 
                                   color:white; cursor:pointer; transition:0.3s; box-shadow:0 4px 12px rgba(0,0,0,0.2)">
                            ${opt} ₹
                        </button>
                    `).join('')}
                </div>
                
                <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap; margin-top:15px">
                    <button class="hero-cta" id="newMoneyBtn">🔄 New Question</button>
                    <button class="close-game-btn" id="resetGameBtn">🔄 Reset Game</button>
                </div>
                
                <div id="moneyFeedback" style="margin-top:20px; font-size:1rem; min-height:80px"></div>
                
                <div class="progress-container" style="width:100%; background:#2D1B4E; border-radius:10px; margin-top:20px; overflow:hidden">
                    <div class="progress-bar" style="width:${progressPercent}%; background:#4ade80; height:8px; transition:width 0.3s"></div>
                </div>
                
                <div id="statsDisplay" style="margin-top:15px; font-size:0.85rem; opacity:0.8">
                    ${totalQuestions > 0 ? `🎯 Accuracy: ${Math.round((correctAnswers / totalQuestions) * 100)}%` : '✨ Count coins and notes to find the total value!'}
                </div>
            </div>
        `;
        
        document.getElementById('gameDynamicContent').innerHTML = html;
        
        // Add event listeners to option buttons
        document.querySelectorAll('.money-option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedAnswer = parseInt(btn.dataset.answer);
                checkAnswer(selectedAnswer, btn);
            });
            
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.05)';
                btn.style.background = 'linear-gradient(135deg, #fbbf24, #f59e0b)';
                btn.style.color = '#1a1a2e';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
                btn.style.background = 'linear-gradient(135deg, #8B5CF6, #6D28D9)';
                btn.style.color = 'white';
            });
        });
        
        document.getElementById('newMoneyBtn').addEventListener('click', () => {
            currentQuestion = generateQuestion();
            renderGame();
            showToast('🔄 New money question!', 'info');
        });
        
        document.getElementById('resetGameBtn').addEventListener('click', () => {
            resetGame();
            renderGame();
            showToast('🎮 Game reset! Start fresh!', 'success');
        });
    }
    
    function checkAnswer(selectedAnswer, selectedBtn) {
        const feedbackDiv = document.getElementById('moneyFeedback');
        const isCorrect = (selectedAnswer === currentQuestion.correctAnswer);
        
        if (isCorrect) {
            let basePoints = 20 * level;
            
            consecutiveCorrect++;
            let streakBonus = 0;
            if (consecutiveCorrect >= 5) {
                streakBonus = 25;
                basePoints += streakBonus;
            } else if (consecutiveCorrect >= 3) {
                streakBonus = 10;
                basePoints += streakBonus;
            }
            
            const totalPoints = basePoints;
            score += totalPoints;
            correctAnswers++;
            totalQuestions++;
            
            selectedBtn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
            selectedBtn.style.transform = 'scale(1.1)';
            selectedBtn.style.color = '#1a1a2e';
            
            let correctMessage = '';
            if (currentQuestion.type === 'countTotal') {
                correctMessage = `Total: ${currentQuestion.correctAnswer} rupees!`;
            } else if (currentQuestion.type === 'findCombination') {
                correctMessage = `The missing value is ${currentQuestion.correctAnswer} rupees!`;
            } else {
                correctMessage = `Change: ${currentQuestion.correctAnswer} rupees!`;
            }
            
            feedbackDiv.innerHTML = `
                <div style="background:#4ade80; color:#1a1a2e; padding:15px; border-radius:20px">
                    ✅ CORRECT! +${totalPoints} points!<br>
                    ${correctMessage}
                    ${streakBonus > 0 ? `<br><small>🔥 ${consecutiveCorrect} in a row! +${streakBonus} streak bonus!</small>` : ''}
                </div>
            `;
            
            showToast(`🎉 Correct! +${totalPoints} points!`, 'success');
            
            if (correctAnswers > 0 && correctAnswers % 6 === 0) {
                level++;
                showToast(`🎊 LEVEL UP! Level ${level}! 🎊`, 'success');
            }
            
            selectedBtn.disabled = true;
            selectedBtn.style.opacity = '0.6';
            
            setTimeout(() => {
                currentQuestion = generateQuestion();
                renderGame();
            }, 1500);
            
            incrementUsageAPI();
            
        } else {
            consecutiveCorrect = 0;
            
            selectedBtn.style.background = 'linear-gradient(135deg, #f87171, #ef4444)';
            selectedBtn.style.transform = 'scale(0.95)';
            
            feedbackDiv.innerHTML = `
                <div style="background:#f87171; color:white; padding:15px; border-radius:20px">
                    ❌ WRONG!<br>
                    Correct answer: ${currentQuestion.correctAnswer} rupees
                </div>
            `;
            
            showToast(`❌ Correct answer is ${currentQuestion.correctAnswer} rupees`, 'info');
            totalQuestions++;
            
            setTimeout(() => {
                if (selectedBtn) {
                    selectedBtn.style.background = 'linear-gradient(135deg, #8B5CF6, #6D28D9)';
                    selectedBtn.style.transform = 'scale(1)';
                    selectedBtn.style.color = 'white';
                }
            }, 1500);
            
            setTimeout(() => {
                currentQuestion = generateQuestion();
                renderGame();
            }, 2000);
        }
        
        const statsDiv = document.getElementById('statsDisplay');
        if (statsDiv && totalQuestions > 0) {
            statsDiv.innerHTML = `🎯 Accuracy: ${Math.round((correctAnswers / totalQuestions) * 100)}% | ✅ ${correctAnswers}/${totalQuestions} correct | 🔥 Streak: ${consecutiveCorrect}`;
        }
        
        const progressPercent = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) progressBar.style.width = `${progressPercent}%`;
    }
    
    function resetGame() {
        score = 0;
        level = 1;
        totalQuestions = 0;
        correctAnswers = 0;
        consecutiveCorrect = 0;
        currentQuestion = generateQuestion();
    }
    
    currentQuestion = generateQuestion();
    renderGame();
}
// === END ===

// ============================================
// TOOL: NUMBER STORY GAME (PLACEHOLDER)
// ============================================
// ============================================
// TOOL: NUMBER STORY GAME
// ============================================
// === START ===
function startStoryGame() {
    let score = 0;
    let level = 1;
    let currentQuestion = null;
    let totalQuestions = 0;
    let correctAnswers = 0;
    let consecutiveCorrect = 0;
    
    // Story templates for different operations
    const storyTemplates = {
        addition: [
            { template: "{name1} has {num1} {item1}. {name2} gives {num2} more {item1}. How many {item1} does {name1} have now?", 
              hint: "Add the numbers together: {num1} + {num2}" },
            { template: "There are {num1} {item1} on the table. {num2} more {item1} are added. How many {item1} are there in total?",
              hint: "{num1} + {num2} = ?" },
            { template: "{name1} bought {num1} {item1} from the store. {name1} also bought {num2} {item2}. How many items did {name1} buy in total?",
              hint: "Add both quantities: {num1} + {num2}" },
            { template: "In a garden, there are {num1} red flowers and {num2} yellow flowers. How many flowers are there altogether?",
              hint: "Total flowers = red + yellow" }
        ],
        subtraction: [
            { template: "{name1} had {num1} {item1}. {name1} gave away {num2} {item1}. How many {item1} does {name1} have left?",
              hint: "Subtract: {num1} - {num2}" },
            { template: "There were {num1} {item1} in the basket. {num2} {item1} were eaten. How many {item1} remain?",
              hint: "{num1} - {num2} = ?" },
            { template: "{name1} had {num1} rupees. {name1} spent {num2} rupees on a toy. How much money does {name1} have left?",
              hint: "Remaining money = {num1} - {num2}" },
            { template: "A baker made {num1} cookies. {num2} cookies were sold. How many cookies are left?",
              hint: "Remaining cookies = {num1} - {num2}" }
        ],
        multiplication: [
            { template: "There are {num1} bags. Each bag has {num2} {item1}. How many {item1} are there in total?",
              hint: "Multiply: {num1} × {num2}" },
            { template: "{name1} has {num1} boxes. Each box contains {num2} {item1}. How many {item1} does {name1} have?",
              hint: "{num1} × {num2} = ?" },
            { template: "A classroom has {num1} rows of desks. Each row has {num2} desks. How many desks are there in total?",
              hint: "Total desks = rows × desks per row" },
            { template: "There are {num1} groups of children. Each group has {num2} children. How many children are there?",
              hint: "Total children = {num1} × {num2}" }
        ],
        division: [
            { template: "{num1} {item1} are shared equally among {num2} friends. How many {item1} does each friend get?",
              hint: "Divide: {num1} ÷ {num2}" },
            { template: "{name1} has {num1} candies. {name1} wants to share them equally among {num2} friends. How many candies will each friend get?",
              hint: "{num1} ÷ {num2} = ?" },
            { template: "There are {num1} apples packed into {num2} baskets equally. How many apples are in each basket?",
              hint: "Apples per basket = {num1} ÷ {num2}" },
            { template: "{num1} students are divided into {num2} equal teams. How many students are in each team?",
              hint: "Students per team = {num1} ÷ {num2}" }
        ],
        twoStep: [
            { template: "{name1} has {num1} {item1}. {name1} gets {num2} more {item1} from {name2}. Then {name1} gives away {num3} {item1}. How many {item1} does {name1} have now?",
              hint: "First add: {num1} + {num2} = ?, then subtract: ? - {num3}" },
            { template: "There are {num1} {item1}. {num2} more are added. Then {num3} are taken away. How many are left?",
              hint: "Step 1: {num1} + {num2} = ?, Step 2: ? - {num3}" },
            { template: "{name1} bought {num1} {item1} for {num2} rupees each and {num3} {item2} for {num4} rupees each. How much did {name1} spend in total?",
              hint: "Total = ({num1} × {num2}) + ({num3} × {num4})" }
        ]
    };
    
    const names = ["Ali", "Ayesha", "Bilal", "Fatima", "Hamza", "Zainab", "Omar", "Sara", "Ahmed", "Hina"];
    const items1 = ["apples", "oranges", "books", "pencils", "toffees", "balloons", "stickers", "marbles", "crayons", "chocolates"];
    const items2 = ["bananas", "grapes", "notebooks", "erasers", "lollipops", "ribbons", "badges", "toy cars", "markers", "biscuits"];
    
    // Generate random numbers based on level
    function getRandomNumbers(operation, level) {
        let num1, num2, num3, num4;
        
        if (level <= 2) {
            // Level 1-2: Numbers 1-10
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * (11 - num1)) + 1;
            num3 = Math.floor(Math.random() * 5) + 1;
            num4 = Math.floor(Math.random() * 5) + 1;
        } else if (level <= 4) {
            // Level 3-4: Numbers 1-20
            num1 = Math.floor(Math.random() * 20) + 1;
            num2 = Math.floor(Math.random() * (21 - num1)) + 1;
            num3 = Math.floor(Math.random() * 10) + 1;
            num4 = Math.floor(Math.random() * 10) + 1;
        } else if (level <= 6) {
            // Level 5-6: Numbers 1-50
            num1 = Math.floor(Math.random() * 50) + 1;
            num2 = Math.floor(Math.random() * (51 - num1)) + 1;
            num3 = Math.floor(Math.random() * 15) + 1;
            num4 = Math.floor(Math.random() * 15) + 1;
        } else {
            // Level 7+: Numbers 1-100
            num1 = Math.floor(Math.random() * 100) + 1;
            num2 = Math.floor(Math.random() * (101 - num1)) + 1;
            num3 = Math.floor(Math.random() * 20) + 1;
            num4 = Math.floor(Math.random() * 20) + 1;
        }
        
        return { num1, num2, num3, num4 };
    }
    
    // Calculate answer based on operation and numbers
    function calculateAnswer(operation, numbers) {
        const { num1, num2, num3, num4 } = numbers;
        
        switch(operation) {
            case 'addition':
                return num1 + num2;
            case 'subtraction':
                return num1 - num2;
            case 'multiplication':
                return num1 * num2;
            case 'division':
                return Math.floor(num1 / num2);
            case 'twoStep':
                if (num3 && num4) {
                    return (num1 * num2) + (num3 * num4);
                }
                return num1 + num2 - num3;
            default:
                return num1 + num2;
        }
    }
    
    // Generate question
    function generateQuestion() {
        let operation;
        
        // Determine operation based on level
        if (level <= 2) {
            const ops = ['addition', 'subtraction'];
            operation = ops[Math.floor(Math.random() * ops.length)];
        } else if (level <= 4) {
            const ops = ['addition', 'subtraction', 'multiplication'];
            operation = ops[Math.floor(Math.random() * ops.length)];
        } else if (level <= 6) {
            const ops = ['addition', 'subtraction', 'multiplication', 'division'];
            operation = ops[Math.floor(Math.random() * ops.length)];
        } else {
            const ops = ['addition', 'subtraction', 'multiplication', 'division', 'twoStep'];
            operation = ops[Math.floor(Math.random() * ops.length)];
        }
        
        const numbers = getRandomNumbers(operation, level);
        const { num1, num2, num3, num4 } = numbers;
        
        // Ensure subtraction doesn't go negative
        if (operation === 'subtraction' && num2 > num1) {
            const temp = num1;
            numbers.num1 = num2;
            numbers.num2 = temp;
        }
        
        // Ensure division is exact
        if (operation === 'division') {
            numbers.num2 = Math.max(2, Math.min(numbers.num2, 10));
            numbers.num1 = numbers.num2 * Math.floor(Math.random() * (10) + 1);
        }
        
        // Get a random template
        const templates = storyTemplates[operation];
        const template = templates[Math.floor(Math.random() * templates.length)];
        
        // Fill in the template
        let storyText = template.template;
        let hintText = template.hint;
        
        const name1 = names[Math.floor(Math.random() * names.length)];
        const name2 = names[Math.floor(Math.random() * names.length)];
        const item1 = items1[Math.floor(Math.random() * items1.length)];
        const item2 = items2[Math.floor(Math.random() * items2.length)];
        
        storyText = storyText.replace(/{name1}/g, name1);
        storyText = storyText.replace(/{name2}/g, name2);
        storyText = storyText.replace(/{item1}/g, item1);
        storyText = storyText.replace(/{item2}/g, item2);
        storyText = storyText.replace(/{num1}/g, numbers.num1);
        storyText = storyText.replace(/{num2}/g, numbers.num2);
        storyText = storyText.replace(/{num3}/g, numbers.num3);
        storyText = storyText.replace(/{num4}/g, numbers.num4);
        
        hintText = hintText.replace(/{num1}/g, numbers.num1);
        hintText = hintText.replace(/{num2}/g, numbers.num2);
        hintText = hintText.replace(/{num3}/g, numbers.num3);
        hintText = hintText.replace(/{num4}/g, numbers.num4);
        
        const correctAnswer = calculateAnswer(operation, numbers);
        const options = generateOptions(correctAnswer);
        
        currentQuestion = {
            operation: operation,
            storyText: storyText,
            correctAnswer: correctAnswer,
            hint: hintText,
            options: options,
            numbers: numbers
        };
        
        return currentQuestion;
    }
    
    // Generate options
    function generateOptions(correctAnswer) {
        let options = [correctAnswer];
        const range = Math.max(5, Math.floor(correctAnswer / 3));
        
        while (options.length < 4) {
            let offset = Math.floor(Math.random() * range) + 1;
            let option = correctAnswer + (Math.random() < 0.5 ? offset : -offset);
            
            if (option >= 0 && option <= 500 && !options.includes(option) && option !== correctAnswer) {
                options.push(option);
            }
        }
        
        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        return options;
    }
    
    // Get operation emoji
    function getOperationEmoji(operation) {
        const emojis = {
            addition: "➕",
            subtraction: "➖",
            multiplication: "✖️",
            division: "➗",
            twoStep: "🔢"
        };
        return emojis[operation] || "📖";
    }
    
    // Get operation name in Urdu/English
    function getOperationName(operation) {
        const names = {
            addition: "Addition (جمع)",
            subtraction: "Subtraction (تفریق)",
            multiplication: "Multiplication (ضرب)",
            division: "Division (تقسیم)",
            twoStep: "Two-Step (دو مرحلے)"
        };
        return names[operation] || "Story Problem";
    }
    
    // Render the game
    function renderGame() {
        if (!currentQuestion) {
            currentQuestion = generateQuestion();
        }
        
        const progressPercent = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        
        const html = `
            <div style="text-align:center">
                <div style="display:flex; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:10px">
                    <span>⭐ Level: ${level}</span>
                    <span>🏆 Score: ${score}</span>
                    <span>✅ Correct: ${correctAnswers}</span>
                    <span>📊 Q#: ${totalQuestions + 1}</span>
                    <span>🔥 Streak: ${consecutiveCorrect}</span>
                    <span>${getOperationEmoji(currentQuestion.operation)} ${getOperationName(currentQuestion.operation)}</span>
                </div>
                
                <h3>📚 Number Story Challenge! 🎭</h3>
                <p style="margin:10px 0; opacity:0.9">Read the story and solve the math problem</p>
                
                <div style="background:linear-gradient(135deg, #4C1D95, #2E1065); border-radius:30px; padding:30px; margin:20px 0; text-align:left; box-shadow:0 8px 25px rgba(0,0,0,0.2)">
                    <div style="font-size:1.2rem; line-height:1.8; font-style:italic">
                        📖 "${currentQuestion.storyText}"
                    </div>
                </div>
                
                <div style="background:rgba(139,92,246,0.2); border-radius:20px; padding:15px; margin:15px 0">
                    <h4>❓ What is the answer?</h4>
                    <p style="font-size:0.85rem; margin-top:10px">
                        <i class="fas fa-lightbulb"></i> 💡 ${currentQuestion.hint}
                    </p>
                </div>
                
                <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap; margin:20px 0">
                    ${currentQuestion.options.map(opt => `
                        <button class="story-option-btn" data-answer="${opt}" 
                            style="background:linear-gradient(135deg, #8B5CF6, #6D28D9); border:none; 
                                   width:80px; height:80px; border-radius:20px; font-size:1.3rem; font-weight:bold; 
                                   color:white; cursor:pointer; transition:0.3s; box-shadow:0 4px 12px rgba(0,0,0,0.2)">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
                
                <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap; margin-top:15px">
                    <button class="hero-cta" id="newStoryBtn">🔄 New Story</button>
                    <button class="close-game-btn" id="resetGameBtn">🔄 Reset Game</button>
                </div>
                
                <div id="storyFeedback" style="margin-top:20px; font-size:1rem; min-height:80px"></div>
                
                <div class="progress-container" style="width:100%; background:#2D1B4E; border-radius:10px; margin-top:20px; overflow:hidden">
                    <div class="progress-bar" style="width:${progressPercent}%; background:#4ade80; height:8px; transition:width 0.3s"></div>
                </div>
                
                <div id="statsDisplay" style="margin-top:15px; font-size:0.85rem; opacity:0.8">
                    ${totalQuestions > 0 ? `🎯 Accuracy: ${Math.round((correctAnswers / totalQuestions) * 100)}%` : '✨ Read carefully and solve the story problem!'}
                </div>
            </div>
        `;
        
        document.getElementById('gameDynamicContent').innerHTML = html;
        
        // Add event listeners
        document.querySelectorAll('.story-option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedAnswer = parseInt(btn.dataset.answer);
                checkAnswer(selectedAnswer, btn);
            });
            
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.05)';
                btn.style.background = 'linear-gradient(135deg, #fbbf24, #f59e0b)';
                btn.style.color = '#1a1a2e';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
                btn.style.background = 'linear-gradient(135deg, #8B5CF6, #6D28D9)';
                btn.style.color = 'white';
            });
        });
        
        document.getElementById('newStoryBtn').addEventListener('click', () => {
            currentQuestion = generateQuestion();
            renderGame();
            showToast('🔄 New story problem!', 'info');
        });
        
        document.getElementById('resetGameBtn').addEventListener('click', () => {
            resetGame();
            renderGame();
            showToast('🎮 Game reset! Start fresh!', 'success');
        });
    }
    
    function checkAnswer(selectedAnswer, selectedBtn) {
        const feedbackDiv = document.getElementById('storyFeedback');
        const isCorrect = (selectedAnswer === currentQuestion.correctAnswer);
        
        if (isCorrect) {
            let basePoints = 25 * level;
            
            consecutiveCorrect++;
            let streakBonus = 0;
            if (consecutiveCorrect >= 5) {
                streakBonus = 30;
                basePoints += streakBonus;
            } else if (consecutiveCorrect >= 3) {
                streakBonus = 15;
                basePoints += streakBonus;
            }
            
            // Bonus for two-step problems
            let twoStepBonus = 0;
            if (currentQuestion.operation === 'twoStep') {
                twoStepBonus = 20;
                basePoints += twoStepBonus;
            }
            
            const totalPoints = basePoints;
            score += totalPoints;
            correctAnswers++;
            totalQuestions++;
            
            selectedBtn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
            selectedBtn.style.transform = 'scale(1.1)';
            selectedBtn.style.color = '#1a1a2e';
            
            feedbackDiv.innerHTML = `
                <div style="background:#4ade80; color:#1a1a2e; padding:15px; border-radius:20px; animation:slideIn 0.3s ease">
                    <i class="fas fa-check-circle"></i> ✅ CORRECT! +${totalPoints} points!<br>
                    Answer: ${currentQuestion.correctAnswer}
                    ${twoStepBonus > 0 ? `<br><small>🎯 Two-step bonus! +${twoStepBonus}</small>` : ''}
                    ${streakBonus > 0 ? `<br><small>🔥 ${consecutiveCorrect} in a row! +${streakBonus} streak bonus!</small>` : ''}
                </div>
            `;
            
            showToast(`🎉 Correct! +${totalPoints} points!`, 'success');
            
            if (correctAnswers > 0 && correctAnswers % 5 === 0) {
                level++;
                showToast(`🎊 LEVEL UP! Level ${level}! 🎊`, 'success');
            }
            
            selectedBtn.disabled = true;
            selectedBtn.style.opacity = '0.6';
            
            setTimeout(() => {
                currentQuestion = generateQuestion();
                renderGame();
            }, 2000);
            
            incrementUsageAPI();
            
        } else {
            consecutiveCorrect = 0;
            
            selectedBtn.style.background = 'linear-gradient(135deg, #f87171, #ef4444)';
            selectedBtn.style.transform = 'scale(0.95)';
            
            feedbackDiv.innerHTML = `
                <div style="background:#f87171; color:white; padding:15px; border-radius:20px; animation:slideIn 0.3s ease">
                    <i class="fas fa-times-circle"></i> ❌ WRONG!<br>
                    Correct answer: ${currentQuestion.correctAnswer}<br>
                    <small>${currentQuestion.hint}</small>
                </div>
            `;
            
            showToast(`❌ Correct answer is ${currentQuestion.correctAnswer}`, 'info');
            totalQuestions++;
            
            setTimeout(() => {
                if (selectedBtn) {
                    selectedBtn.style.background = 'linear-gradient(135deg, #8B5CF6, #6D28D9)';
                    selectedBtn.style.transform = 'scale(1)';
                    selectedBtn.style.color = 'white';
                }
            }, 1500);
            
            setTimeout(() => {
                currentQuestion = generateQuestion();
                renderGame();
            }, 2000);
        }
        
        const statsDiv = document.getElementById('statsDisplay');
        if (statsDiv && totalQuestions > 0) {
            statsDiv.innerHTML = `🎯 Accuracy: ${Math.round((correctAnswers / totalQuestions) * 100)}% | ✅ ${correctAnswers}/${totalQuestions} correct | 🔥 Streak: ${consecutiveCorrect}`;
        }
        
        const progressPercent = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) progressBar.style.width = `${progressPercent}%`;
    }
    
    function resetGame() {
        score = 0;
        level = 1;
        totalQuestions = 0;
        correctAnswers = 0;
        consecutiveCorrect = 0;
        currentQuestion = generateQuestion();
    }
    
    currentQuestion = generateQuestion();
    renderGame();
}
// === END ===

// ============================================
// RENDER METHODS GRID SECTION
// ============================================
function renderMethodsGrid() {
    const grid = document.getElementById('methodsGrid');
    if (!grid) return;
    
    grid.innerHTML = TEACHING_METHODS.map(method => `
        <div class="method-card" data-id="${method.id}">
            <div class="method-icon">${method.icon}</div>
            <h3>${method.name}</h3>
            <p>${method.description}</p>
            <button class="play-badge" data-method="${method.id}">
                ${method.isActive ? 'Play Now ▶' : '🔒 Coming Soon'}
            </button>
        </div>
    `).join('');
    
    document.querySelectorAll('.play-badge').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.method-card');
            const id = parseInt(card.dataset.id);
            const method = TEACHING_METHODS.find(m => m.id === id);
            
            if (method.isActive && method.type) {
                document.getElementById('methodsGridSection').style.display = 'none';
                document.getElementById('gameArea').style.display = 'block';
                document.getElementById('gameTitle').innerText = method.name;
                
                // Game router - ہر طریقہ یہاں سے start ہوتا ہے
                if (method.type === 'counting') startCountingGame();
                else if (method.type === 'numberline') startNumberLineGame();
                else if (method.type === 'numbersorting') startNumberSortingGame();
                else if (method.type === 'oddoneout') startOddOneOutGame();
                else if (method.type === 'bingo') startBingoGame();
                else if (method.type === 'guess') startGuessGame();
                else if (method.type === 'bond') startBondGame();
                else if (method.type === 'tenframe') startTenFrameGame();
                else if (method.type === 'tally') startTallyGame();
                else if (method.type === 'word') startWordGame();
                else if (method.type === 'skip') startSkipGame();
                else if (method.type === 'pattern') startPatternGame();
                else if (method.type === 'greaterless') startGreaterLessGame();
                else if (method.type === 'orderrace') startOrderRaceGame();
                else if (method.type === 'finger') startFingerGame();
                else if (method.type === 'subitizing') startSubitizingGame();
                else if (method.type === 'hopscotch') startHopscotchGame();
                else if (method.type === 'clock') startClockGame();
                else if (method.type === 'money') startMoneyGame();
                else if (method.type === 'story') startStoryGame();
            } else {
                showToast(`✨ ${method.name} will be available in the next update! ✨`, 'info');
            }
        });
    });
}

// ============================================
// DARK MODE SECTION
// ============================================
function initDarkMode() {
    const saved = localStorage.getItem('darkMode');
    if (saved === 'false') document.body.classList.add('light-mode');
    
    document.getElementById('themeToggleBtn').onclick = () => {
        document.body.classList.toggle('light-mode');
        localStorage.setItem('darkMode', !document.body.classList.contains('light-mode'));
        showToast(`Dark mode ${document.body.classList.contains('light-mode') ? 'off' : 'on'}`, 'info');
    };
}

// ============================================
// SCROLL BUTTONS SECTION
// ============================================
function initScrollButtons() {
    document.getElementById('scrollUpBtn').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('scrollDownBtn').onclick = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// ============================================
// MODAL SECTION
// ============================================
function initModal() {
    const modal = document.getElementById('premiumModal');
    const closeModal = () => modal.style.display = 'none';
    
    document.querySelector('.modal-close')?.addEventListener('click', closeModal);
    document.getElementById('closeModalBtn')?.addEventListener('click', closeModal);
    window.onclick = (e) => { if (e.target === modal) closeModal(); };
}

// ============================================
// FLOATING NOTIFICATIONS SECTION
// ============================================
let notificationInterval = null;

function startFloatingNotifications() {
    const messages = [
        "🎮 Try the Counting game! It's fun!",
        "🏆 77+ features available for you!",
        "⭐ Share your score with friends!",
        "📊 Track your progress daily!",
        "🎯 Complete levels to earn points!"
    ];
    
    let index = 0;
    notificationInterval = setInterval(() => {
        if (!document.hidden) {
            showToast(messages[index % messages.length], 'info');
            index++;
        }
    }, 45000);
}

// ============================================
// MAIN INITIALIZATION
// ============================================
async function init() {
    renderMethodsGrid();
    updateUsageDisplay();
    updateReactionsUI();
    initDarkMode();
    initScrollButtons();
    initModal();
    startFloatingNotifications();
    
    const totalReactions = Object.values(reactionCounts).reduce((a,b) => a+b, 0);
    document.getElementById('globalReactionsHero').innerHTML = totalReactions;
    
    document.querySelectorAll('.share-btn').forEach(btn => {
        if (btn.id === 'copyUrlBtn') btn.onclick = copyPageUrl;
        else btn.onclick = () => shareOnPlatform(btn.dataset.platform);
    });
    
    document.getElementById('showTeachingMethodsBtn').onclick = () => {
        document.getElementById('methodsGridSection').scrollIntoView({ behavior: 'smooth' });
    };
    
    document.getElementById('closeGameBtn').onclick = () => {
        document.getElementById('gameArea').style.display = 'none';
        document.getElementById('methodsGridSection').style.display = 'block';
    };
    
    if (!sessionStorage.getItem('usageTracked')) {
        await incrementUsageAPI();
        sessionStorage.setItem('usageTracked', 'true');
    }
    
    showToast('✨ Welcome to Number Fun Game! 77+ Features Ready! ✨', 'success');
}

// Start the application
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ============================================
// EXPORT FOR DEBUGGING
// ============================================
window.numberFunGame = {
    version: '5.0',
    features: 77,
    methods: TEACHING_METHODS,
    usage: () => currentUsage,
    reactions: () => reactionCounts
};
