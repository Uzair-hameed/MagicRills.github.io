/* ============================================
   STUDY PLANNER - COMPLETE JAVASCRIPT
   Cloudflare Workers API Integration
   Full Reactions (7 Emojis) + Share + Stats
   Dark Space Theme + Neon Effects
   ============================================ */

// ============================================
// Configuration
// ============================================
const TOOL_SLUG = 'study-planner';
const TOOL_NAME = 'Study Planner';
const CATEGORY = 'student';
const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';
const API_KEY = 'magicrills-grok-api.uzairhameed01.workers.dev';

let userId = localStorage.getItem('userId');
if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
}

// ============================================
// App State
// ============================================
let tasks = [];
let timerInterval = null;
let isTimerRunning = false;
let isBreakTime = false;
let currentTime = 25 * 60;
let sessionsCompleted = 0;
let breaksCompleted = 0;
let pomodoroDuration = 25;
let shortBreakDuration = 5;
let longBreakDuration = 15;
let studyData = [];
let currentTaskId = null;
let pomodoroChart = null;
let categoryChart = null;
let focusChart = null;
let usageCount = 0;
let shareCount = 0;

// Quotes for motivation
const quotes = [
    "The secret of getting ahead is getting started.",
    "Don't watch the clock; do what it does. Keep going.",
    "The future depends on what you do today.",
    "You don't have to be great to start, but you have to start to be great.",
    "Success is the sum of small efforts, repeated day in and day out.",
    "The only limit to our realization of tomorrow is our doubts of today.",
    "Study while others are sleeping; work while others are loafing.",
    "The beautiful thing about learning is that no one can take it away from you."
];

// ============================================
// DOM Elements
// ============================================
const usageCountSpan = document.getElementById('usageCount');
const streakCountSpan = document.getElementById('streakCount');
const focusScoreSpan = document.getElementById('focusScore');
const totalStudyTimeSpan = document.getElementById('totalStudyTime');
const timerDisplay = document.getElementById('timerDisplay');
const timerType = document.getElementById('timerType');
const progressFill = document.getElementById('progressFill');
const sessionCountSpan = document.getElementById('sessionCount');
const breakCountSpan = document.getElementById('breakCount');
const startTimerBtn = document.getElementById('startTimerBtn');
const pauseTimerBtn = document.getElementById('pauseTimerBtn');
const resetTimerBtn = document.getElementById('resetTimerBtn');
const addTaskBtn = document.getElementById('addTaskBtn');
const tasksList = document.getElementById('tasksList');
const generatePlanBtn = document.getElementById('generatePlanBtn');
const studyPlanDiv = document.getElementById('studyPlan');
const aiPrioritizeBtn = document.getElementById('aiPrioritizeBtn');
const exportPdfBtn = document.getElementById('exportPdfBtn');
const exportWordBtn = document.getElementById('exportWordBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const reminderToggle = document.getElementById('reminderToggle');
const soundToggle = document.getElementById('soundToggle');
const exportDataBtn = document.getElementById('exportDataBtn');
const clearDataBtn = document.getElementById('clearDataBtn');
const pageShareBtn = document.getElementById('pageShareBtn');
const scrollUpBtn = document.getElementById('scrollUpBtn');
const scrollDownBtn = document.getElementById('scrollDownBtn');
const quoteText = document.getElementById('quoteText');
const todayPomodorosSpan = document.getElementById('todayPomodoros');
const todayTasksCompletedSpan = document.getElementById('todayTasksCompleted');
const todayStudyTimeSpan = document.getElementById('todayStudyTime');
const currentTaskNameSpan = document.getElementById('currentTaskName');

// Modal Elements
const addTaskModal = document.getElementById('addTaskModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelTaskBtn = document.getElementById('cancelTaskBtn');
const saveTaskBtn = document.getElementById('saveTaskBtn');

// Modal Inputs
const newTaskName = document.getElementById('newTaskName');
const newTaskDeadline = document.getElementById('newTaskDeadline');
const newTaskHours = document.getElementById('newTaskHours');
const newTaskPriority = document.getElementById('newTaskPriority');
const newTaskCategory = document.getElementById('newTaskCategory');
const newTaskNotes = document.getElementById('newTaskNotes');

// Filter Buttons
const filterBtns = document.querySelectorAll('.filter-btn');

// Theme Options
const themeOptions = document.querySelectorAll('.theme-option');

// Reaction Counters
const likeCount = document.getElementById('likeCount');
const loveCount = document.getElementById('loveCount');
const wowCount = document.getElementById('wowCount');
const sadCount = document.getElementById('sadCount');
const angryCount = document.getElementById('angryCount');
const laughCount = document.getElementById('laughCount');
const celebrateCount = document.getElementById('celebrateCount');

// ============================================
// Cloudflare Workers API Calls
// ============================================

// Helper function for API calls with fallback
async function callApi(endpoint, method = 'GET', body = null) {
    const url = `${API_BASE}${endpoint}`;
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': API_KEY
        }
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        return null;
    }
}

// 1. Usage Counter Increment
async function trackUsage() {
    try {
        const result = await callApi('/api/usage', 'POST', {
            tool_slug: TOOL_SLUG,
            tool_name: TOOL_NAME,
            category: CATEGORY,
            user_id: userId
        });
        if (result && result.success) {
            usageCount = result.count || (parseInt(usageCountSpan.textContent) || 0) + 1;
            usageCountSpan.textContent = usageCount;
            localStorage.setItem('usageCount', usageCount);
        } else {
            // Fallback: LocalStorage
            usageCount = parseInt(localStorage.getItem('usageCount') || '0') + 1;
            usageCountSpan.textContent = usageCount;
            localStorage.setItem('usageCount', usageCount);
        }
    } catch(e) {
        console.error('Usage tracking failed:', e);
        // Fallback: LocalStorage
        usageCount = parseInt(localStorage.getItem('usageCount') || '0') + 1;
        usageCountSpan.textContent = usageCount;
        localStorage.setItem('usageCount', usageCount);
    }
}

// 2. Reactions API
async function addReaction(emoji) {
    try {
        const result = await callApi('/api/reactions', 'POST', {
            tool_slug: TOOL_SLUG,
            emoji: emoji,
            user_id: userId
        });
        
        if (result && result.success) {
            updateReactionCount(emoji, result.count);
            showToast(getEmojiName(emoji) + ' reaction added!');
        } else {
            // Fallback: LocalStorage
            updateReactionCountLocal(emoji);
            showToast(getEmojiName(emoji) + ' reaction added!');
        }
    } catch(e) {
        console.error('Reaction failed:', e);
        updateReactionCountLocal(emoji);
        showToast(getEmojiName(emoji) + ' reaction added!');
    }
}

async function loadReactionStats() {
    try {
        const result = await callApi(`/api/stats?tool_slug=${TOOL_SLUG}`, 'GET');
        if (result && result.success) {
            const stats = result.data;
            if (likeCount) likeCount.textContent = stats.like_count || 0;
            if (loveCount) loveCount.textContent = stats.love_count || 0;
            if (wowCount) wowCount.textContent = stats.wow_count || 0;
            if (sadCount) sadCount.textContent = stats.sad_count || 0;
            if (angryCount) angryCount.textContent = stats.angry_count || 0;
            if (laughCount) laughCount.textContent = stats.laugh_count || 0;
            if (celebrateCount) celebrateCount.textContent = stats.celebrate_count || 0;
            if (usageCountSpan) usageCountSpan.textContent = stats.total_usage || 0;
        } else {
            // Fallback: Load from LocalStorage
            loadReactionStatsLocal();
        }
    } catch(e) {
        console.error('Load stats failed:', e);
        loadReactionStatsLocal();
    }
}

// 3. Shares API
async function trackShare(platform) {
    try {
        const result = await callApi('/api/shares', 'POST', {
            tool_slug: TOOL_SLUG,
            platform: platform,
            share_type: 'tool',
            user_id: userId
        });
        if (result && result.success) {
            shareCount = result.count || 0;
            localStorage.setItem('shareCount', shareCount);
        } else {
            // Fallback: LocalStorage
            shareCount = parseInt(localStorage.getItem('shareCount') || '0') + 1;
            localStorage.setItem('shareCount', shareCount);
        }
    } catch(e) {
        console.error('Share tracking failed:', e);
        shareCount = parseInt(localStorage.getItem('shareCount') || '0') + 1;
        localStorage.setItem('shareCount', shareCount);
    }
}

// 4. Get Tool Stats
async function loadToolStats() {
    try {
        const result = await callApi(`/api/stats?tool_slug=${TOOL_SLUG}`, 'GET');
        if (result && result.success) {
            const stats = result.data;
            // Usage already loaded from stats
            if (usageCountSpan) usageCountSpan.textContent = stats.total_usage || 0;
            // Other stats can be displayed in dashboard
        }
    } catch(e) {
        console.error('Load tool stats failed:', e);
    }
}

// ============================================
// LocalStorage Fallback Functions
// ============================================

function updateReactionCount(emoji, count) {
    const span = getReactionSpan(emoji);
    if (span) span.textContent = count;
}

function updateReactionCountLocal(emoji) {
    const key = `reaction_${emoji}`;
    let count = parseInt(localStorage.getItem(key) || '0') + 1;
    localStorage.setItem(key, count);
    const span = getReactionSpan(emoji);
    if (span) span.textContent = count;
}

function getReactionSpan(emoji) {
    const map = {
        'like': likeCount,
        'love': loveCount,
        'wow': wowCount,
        'sad': sadCount,
        'angry': angryCount,
        'laugh': laughCount,
        'celebrate': celebrateCount
    };
    return map[emoji] || null;
}

function loadReactionStatsLocal() {
    const emojis = ['like', 'love', 'wow', 'sad', 'angry', 'laugh', 'celebrate'];
    emojis.forEach(emoji => {
        const count = parseInt(localStorage.getItem(`reaction_${emoji}`) || '0');
        const span = getReactionSpan(emoji);
        if (span) span.textContent = count;
    });
    const usage = parseInt(localStorage.getItem('usageCount') || '0');
    if (usageCountSpan) usageCountSpan.textContent = usage;
}

function getEmojiName(emoji) {
    const names = {
        like: '👍 Like',
        love: '❤️ Love',
        wow: '😮 Wow',
        sad: '😢 Sad',
        angry: '😠 Angry',
        laugh: '😂 Laugh',
        celebrate: '🎉 Celebrate'
    };
    return names[emoji] || emoji;
}

// ============================================
// Timer Functions
// ============================================
function startTimer() {
    if (isTimerRunning) return;
    isTimerRunning = true;
    timerInterval = setInterval(updateTimer, 1000);
    startTimerBtn.disabled = true;
    pauseTimerBtn.disabled = false;
}

function pauseTimer() {
    if (!isTimerRunning) return;
    isTimerRunning = false;
    clearInterval(timerInterval);
    startTimerBtn.disabled = false;
    pauseTimerBtn.disabled = true;
}

function resetTimer() {
    isTimerRunning = false;
    clearInterval(timerInterval);
    if (isBreakTime) {
        const breakType = sessionsCompleted % 4 === 0 ? longBreakDuration : shortBreakDuration;
        currentTime = breakType * 60;
    } else {
        currentTime = pomodoroDuration * 60;
    }
    updateTimerDisplay();
    updateProgressBar();
    startTimerBtn.disabled = false;
    pauseTimerBtn.disabled = true;
}

function updateTimer() {
    if (currentTime <= 0) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        
        if (!isBreakTime) {
            sessionsCompleted++;
            trackUsage();
            updatePomodoroStats();
            playNotificationSound();
            showToast('🎉 Pomodoro completed! Time for a break!');
            
            if (sessionsCompleted % 4 === 0) {
                isBreakTime = true;
                currentTime = longBreakDuration * 60;
                timerType.textContent = '☕ Long Break';
            } else {
                isBreakTime = true;
                currentTime = shortBreakDuration * 60;
                timerType.textContent = '☕ Short Break';
            }
        } else {
            breaksCompleted++;
            isBreakTime = false;
            currentTime = pomodoroDuration * 60;
            timerType.textContent = '🍅 Pomodoro Session';
            playNotificationSound();
            showToast('Break finished! Ready to study?');
        }
        
        updateSessionInfo();
        updateTimerDisplay();
        updateProgressBar();
        startTimerBtn.disabled = false;
        pauseTimerBtn.disabled = true;
        saveTimerState();
        return;
    }
    
    currentTime--;
    updateTimerDisplay();
    updateProgressBar();
}

function updateTimerDisplay() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateProgressBar() {
    let totalTime;
    if (isBreakTime) {
        totalTime = (sessionsCompleted % 4 === 0) ? longBreakDuration * 60 : shortBreakDuration * 60;
    } else {
        totalTime = pomodoroDuration * 60;
    }
    const progress = ((totalTime - currentTime) / totalTime) * 100;
    progressFill.style.width = `${progress}%`;
}

function updateSessionInfo() {
    sessionCountSpan.textContent = `🍅 Sessions: ${sessionsCompleted}/4`;
    breakCountSpan.textContent = `☕ Breaks: ${breaksCompleted}/3`;
}

function updatePomodoroStats() {
    const today = new Date().toDateString();
    let pomodoroData = JSON.parse(localStorage.getItem('pomodoroData') || '{}');
    if (!pomodoroData[today]) pomodoroData[today] = 0;
    pomodoroData[today]++;
    localStorage.setItem('pomodoroData', JSON.stringify(pomodoroData));
    
    updateTodayStats();
    updateCharts();
}

function updateTodayStats() {
    const today = new Date().toDateString();
    const pomodoroData = JSON.parse(localStorage.getItem('pomodoroData') || '{}');
    const tasksCompleted = tasks.filter(t => t.completed && new Date(t.completedDate).toDateString() === today).length;
    const studyMinutes = pomodoroData[today] * pomodoroDuration || 0;
    
    todayPomodorosSpan.textContent = pomodoroData[today] || 0;
    todayTasksCompletedSpan.textContent = tasksCompleted;
    todayStudyTimeSpan.textContent = `${Math.floor(studyMinutes / 60)}h ${studyMinutes % 60}m`;
}

function saveTimerState() {
    const timerState = { currentTime, isBreakTime, sessionsCompleted, breaksCompleted, isTimerRunning };
    localStorage.setItem('timerState', JSON.stringify(timerState));
}

function loadTimerState() {
    const saved = localStorage.getItem('timerState');
    if (saved) {
        try {
            const state = JSON.parse(saved);
            currentTime = state.currentTime;
            isBreakTime = state.isBreakTime;
            sessionsCompleted = state.sessionsCompleted;
            breaksCompleted = state.breaksCompleted;
            updateTimerDisplay();
            updateProgressBar();
            updateSessionInfo();
            timerType.textContent = isBreakTime ? (sessionsCompleted % 4 === 0 ? '☕ Long Break' : '☕ Short Break') : '🍅 Pomodoro Session';
        } catch(e) {}
    }
}

function playNotificationSound() {
    if (!soundToggle.classList.contains('active')) return;
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch(e) {}
}

// ============================================
// Task Management
// ============================================
function openAddTaskModal() {
    addTaskModal.classList.remove('hidden');
    newTaskName.value = '';
    newTaskDeadline.value = '';
    newTaskHours.value = '';
    newTaskNotes.value = '';
}

function closeAddTaskModal() {
    addTaskModal.classList.add('hidden');
}

function saveTask() {
    const name = newTaskName.value.trim();
    if (!name) {
        showToast('Please enter task name', 'error');
        return;
    }
    
    const task = {
        id: Date.now(),
        name: name,
        deadline: newTaskDeadline.value,
        hours: parseFloat(newTaskHours.value) || 1,
        priority: newTaskPriority.value,
        category: newTaskCategory.value,
        notes: newTaskNotes.value,
        completed: false,
        pomodoros: 0,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(task);
    saveTasks();
    renderTasks();
    closeAddTaskModal();
    showToast('Task added!');
}

function renderTasks() {
    if (tasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tasks" style="font-size:3rem;display:block;margin-bottom:10px;"></i>
                No tasks yet. Click "Add Task" to get started!
            </div>
        `;
        return;
    }
    
    const sortedTasks = [...tasks].sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    
    tasksList.innerHTML = sortedTasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
            <div class="task-header">
                <span class="task-name">${escapeHtml(task.name)}</span>
                <span class="task-priority priority-${task.priority}">${task.priority.toUpperCase()}</span>
            </div>
            <div class="task-meta">
                <span>📅 Deadline: ${task.deadline || 'No deadline'}</span>
                <span>⏱️ Est: ${task.hours}h</span>
                <span>📂 ${task.category}</span>
                <span>🍅 ${task.pomodoros || 0} sessions</span>
            </div>
            ${task.notes ? `<div class="task-notes">📝 ${escapeHtml(task.notes)}</div>` : ''}
            <div class="task-actions">
                ${!task.completed ? `<button class="btn-small complete-task" data-id="${task.id}">✅ Complete</button>` : ''}
                <button class="btn-small select-task" data-id="${task.id}">🎯 Select</button>
                <button class="btn-small delete-task" data-id="${task.id}">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.complete-task').forEach(btn => {
        btn.addEventListener('click', () => completeTask(parseInt(btn.dataset.id)));
    });
    document.querySelectorAll('.select-task').forEach(btn => {
        btn.addEventListener('click', () => selectTask(parseInt(btn.dataset.id)));
    });
    document.querySelectorAll('.delete-task').forEach(btn => {
        btn.addEventListener('click', () => deleteTask(parseInt(btn.dataset.id)));
    });
}

function completeTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = true;
        task.completedDate = new Date().toISOString();
        saveTasks();
        renderTasks();
        updateTodayStats();
        updateCharts();
        showToast(`✅ "${task.name}" completed!`);
        updateFocusScore();
    }
}

function selectTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        currentTaskId = taskId;
        currentTaskNameSpan.textContent = task.name;
        showToast(`Selected: ${task.name}`);
    }
}

function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasks();
    renderTasks();
    showToast('Task deleted');
}

function saveTasks() {
    localStorage.setItem('studyTasks', JSON.stringify(tasks));
}

function loadTasks() {
    const saved = localStorage.getItem('studyTasks');
    if (saved) {
        tasks = JSON.parse(saved);
        renderTasks();
    }
}

// ============================================
// AI Smart Prioritization (Simulated)
// ============================================
async function aiPrioritize() {
    if (tasks.length === 0) {
        showToast('No tasks to prioritize', 'error');
        return;
    }
    
    showToast('🤖 AI is analyzing your tasks...', 'info');
    
    // Simulated AI prioritization
    const today = new Date();
    const prioritized = [...tasks].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        const priorityWeight = { high: 100, medium: 50, low: 25 };
        let urgencyA = 0, urgencyB = 0;
        if (a.deadline) {
            const daysA = Math.ceil((new Date(a.deadline) - today) / (1000 * 60 * 60 * 24));
            urgencyA = Math.max(0, 50 - daysA * 5);
        }
        if (b.deadline) {
            const daysB = Math.ceil((new Date(b.deadline) - today) / (1000 * 60 * 60 * 24));
            urgencyB = Math.max(0, 50 - daysB * 5);
        }
        const scoreA = priorityWeight[a.priority] + urgencyA;
        const scoreB = priorityWeight[b.priority] + urgencyB;
        return scoreB - scoreA;
    });
    
    tasks = prioritized;
    saveTasks();
    renderTasks();
    showToast('✨ Tasks reordered by AI priority!');
}

// ============================================
// Study Plan Generation
// ============================================
function generateStudyPlan() {
    const incompleteTasks = tasks.filter(t => !t.completed);
    if (incompleteTasks.length === 0) {
        studyPlanDiv.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-trophy" style="font-size:3rem;display:block;margin-bottom:10px;color:gold;"></i>
                All tasks completed! Great job! 🎉
            </div>
        `;
        return;
    }
    
    let planHTML = '';
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    let taskIndex = 0;
    
    for (let day of days) {
        const dayTasks = [];
        for (let i = 0; i < 3 && taskIndex < incompleteTasks.length; i++) {
            dayTasks.push(incompleteTasks[taskIndex]);
            taskIndex++;
        }
        
        if (dayTasks.length > 0) {
            planHTML += `
                <div class="plan-day">
                    <div class="plan-day-header">📅 ${day}</div>
                    ${dayTasks.map(task => `
                        <div class="plan-task">
                            <span>📚 ${escapeHtml(task.name)}</span>
                            <span class="task-priority priority-${task.priority}">${task.priority}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }
    
    studyPlanDiv.innerHTML = planHTML;
    showToast('📅 Study plan generated!');
}

// ============================================
// Charts & Analytics
// ============================================
function updateCharts() {
    const pomodoroData = JSON.parse(localStorage.getItem('pomodoroData') || '{}');
    const last7Days = [];
    const pomodoroValues = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        last7Days.push(dateStr.slice(0, 10));
        pomodoroValues.push(pomodoroData[dateStr] || 0);
    }
    
    if (pomodoroChart) pomodoroChart.destroy();
    const ctx = document.getElementById('pomodoroChart')?.getContext('2d');
    if (ctx) {
        pomodoroChart = new Chart(ctx, {
            type: 'bar',
            data: { 
                labels: last7Days, 
                datasets: [{ 
                    label: 'Pomodoros', 
                    data: pomodoroValues, 
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderRadius: 8,
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 1
                }] 
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: true,
                plugins: {
                    legend: { labels: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-color') || '#fff' } }
                },
                scales: {
                    y: { ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-color') || '#aaa' } },
                    x: { ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-color') || '#aaa' } }
                }
            }
        });
    }
    
    // Category distribution
    const categories = { math: 0, science: 0, language: 0, history: 0, other: 0 };
    tasks.forEach(task => {
        if (!task.completed && categories[task.category] !== undefined) categories[task.category]++;
        else if (!task.completed) categories.other++;
    });
    
    if (categoryChart) categoryChart.destroy();
    const ctx2 = document.getElementById('categoryChart')?.getContext('2d');
    if (ctx2) {
        categoryChart = new Chart(ctx2, {
            type: 'pie',
            data: { 
                labels: ['Math', 'Science', 'Language', 'History', 'Other'], 
                datasets: [{ 
                    data: Object.values(categories), 
                    backgroundColor: ['#667eea', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'] 
                }] 
            },
            options: { 
                responsive: true,
                plugins: {
                    legend: { labels: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-color') || '#fff' } }
                }
            }
        });
    }
}

function updateFocusScore() {
    const pomodoroData = JSON.parse(localStorage.getItem('pomodoroData') || '{}');
    const today = new Date().toDateString();
    const todayPomodoros = pomodoroData[today] || 0;
    const score = Math.min(100, todayPomodoros * 20);
    focusScoreSpan.textContent = score;
}

// ============================================
// Export Functions
// ============================================
async function exportToPDF() {
    showToast('📄 PDF export coming soon', 'info');
}

async function exportToWord() {
    showToast('📄 Word export coming soon', 'info');
}

function exportAllData() {
    const data = {
        tasks: tasks,
        studyData: studyData,
        pomodoroData: localStorage.getItem('pomodoroData'),
        settings: { darkMode: localStorage.getItem('darkMode'), theme: localStorage.getItem('theme') }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study-planner-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📁 Data exported!');
}

function clearAllData() {
    if (confirm('⚠️ Are you sure? This will delete all your tasks and study data!')) {
        localStorage.clear();
        tasks = [];
        renderTasks();
        showToast('🗑️ All data cleared');
        location.reload();
    }
}

// ============================================
// Settings & Theme
// ============================================
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    darkModeToggle.textContent = isDark ? 'On' : 'Off';
    darkModeToggle.classList.toggle('active', isDark);
    updateCharts();
}

function changeTheme(color) {
    document.body.classList.remove('theme-purple', 'theme-green', 'theme-orange', 'theme-pink');
    if (color !== 'blue') {
        document.body.classList.add(`theme-${color}`);
    }
    localStorage.setItem('theme', color);
    themeOptions.forEach(opt => {
        opt.classList.remove('selected');
        if (opt.dataset.color === color) opt.classList.add('selected');
    });
}

function updateTimerSettings() {
    pomodoroDuration = parseInt(document.getElementById('pomodoroDuration').value);
    shortBreakDuration = parseInt(document.getElementById('shortBreakDuration').value);
    longBreakDuration = parseInt(document.getElementById('longBreakDuration').value);
    localStorage.setItem('pomodoroDuration', pomodoroDuration);
    resetTimer();
    showToast('⏱️ Timer settings updated!');
}

// ============================================
// Utility Functions
// ============================================
function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    toastMsg.textContent = msg;
    toast.classList.remove('hidden');
    toast.style.background = type === 'error' ? 'rgba(244,67,54,0.9)' : type === 'info' ? 'rgba(33,150,243,0.9)' : 'rgba(0,0,0,0.9)';
    toast.style.border = '1px solid rgba(255,255,255,0.1)';
    toast.style.backdropFilter = 'blur(10px)';
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function sharePage() {
    if (navigator.share) {
        navigator.share({
            title: 'Study Planner - Pomodoro Technique',
            text: 'Check out this amazing AI-powered study planner!',
            url: window.location.href
        }).then(() => {
            trackShare('native');
            showToast('📤 Shared successfully!');
        }).catch(() => {});
    } else {
        navigator.clipboard.writeText(window.location.href);
        trackShare('copy');
        showToast('📋 Link copied!');
    }
}

function shareTool(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Study Planner - Pomodoro Technique');
    let shareUrl = '';
    if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    else if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
    else if (platform === 'linkedin') shareUrl = `https://www.linkedin.com/sharing/share-offsite/?u=${url}`;
    else if (platform === 'whatsapp') shareUrl = `https://wa.me/?text=${title}%20${url}`;
    else if (platform === 'email') shareUrl = `mailto:?subject=${title}&body=Check this out: ${url}`;
    if (shareUrl) { 
        window.open(shareUrl, '_blank'); 
        trackShare(platform); 
        showToast(`📤 Shared on ${platform}!`); 
    }
}

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
function scrollToBottom() { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }

// ============================================
// Tabs
// ============================================
function initTabs() {
    document.querySelectorAll('.smart-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            document.querySelectorAll('.smart-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
            
            if (tabId === 'analytics') {
                setTimeout(() => {
                    updateCharts();
                    updateFocusScore();
                }, 100);
            }
        });
    });
}

// ============================================
// Typewriter Animation
// ============================================
function initTypewriter() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const texts = [
        '🎯 Master Your Study Time',
        '🧠 AI-Powered Learning',
        '⚡ Pomodoro Technique',
        '📚 Smart Study Planning'
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeEffect() {
        const currentText = texts[textIndex];
        if (isDeleting) {
            heroTitle.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            heroTitle.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(typeEffect, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(typeEffect, 500);
        } else {
            const speed = isDeleting ? 50 : 100;
            setTimeout(typeEffect, speed);
        }
    }
    
    setTimeout(typeEffect, 500);
}

// ============================================
// Event Listeners
// ============================================
function initEventListeners() {
    startTimerBtn.addEventListener('click', startTimer);
    pauseTimerBtn.addEventListener('click', pauseTimer);
    resetTimerBtn.addEventListener('click', resetTimer);
    addTaskBtn.addEventListener('click', openAddTaskModal);
    closeModalBtn.addEventListener('click', closeAddTaskModal);
    cancelTaskBtn.addEventListener('click', closeAddTaskModal);
    saveTaskBtn.addEventListener('click', saveTask);
    generatePlanBtn.addEventListener('click', generateStudyPlan);
    aiPrioritizeBtn.addEventListener('click', aiPrioritize);
    exportPdfBtn.addEventListener('click', exportToPDF);
    exportWordBtn.addEventListener('click', exportToWord);
    darkModeToggle.addEventListener('click', toggleDarkMode);
    exportDataBtn.addEventListener('click', exportAllData);
    clearDataBtn.addEventListener('click', clearAllData);
    pageShareBtn.addEventListener('click', sharePage);
    scrollUpBtn.addEventListener('click', scrollToTop);
    scrollDownBtn.addEventListener('click', scrollToBottom);
    
    document.getElementById('pomodoroDuration').addEventListener('change', updateTimerSettings);
    document.getElementById('shortBreakDuration').addEventListener('change', updateTimerSettings);
    document.getElementById('longBreakDuration').addEventListener('change', updateTimerSettings);
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateCharts();
        });
    });
    
    themeOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            const color = opt.dataset.color;
            changeTheme(color);
        });
    });
    
    // ============================================
    // REACTIONS - 7 EMOJIS FULLY WORKING
    // ============================================
    document.querySelectorAll('.reaction').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const emoji = btn.getAttribute('data-emoji');
            if (emoji) {
                addReaction(emoji);
                btn.classList.add('active');
                setTimeout(() => btn.classList.remove('active'), 300);
            }
        });
    });
    
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.dataset.platform;
            if (platform) shareTool(platform);
        });
    });
    
    window.addEventListener('scroll', () => {
        if (scrollUpBtn) scrollUpBtn.classList.toggle('hidden', window.scrollY <= 200);
    });
}

// ============================================
// Initialize
// ============================================
async function init() {
    initTabs();
    initEventListeners();
    initTypewriter();
    
    // Load data from API
    await loadReactionStats();
    await loadToolStats();
    
    // Load local data
    loadTasks();
    loadTimerState();
    updateTodayStats();
    updateCharts();
    updateFocusScore();
    
    const today = new Date().toISOString().split('T')[0];
    newTaskDeadline.min = today;
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && savedTheme !== 'blue') {
        changeTheme(savedTheme);
    }
    
    const savedDark = localStorage.getItem('darkMode');
    if (savedDark === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = 'On';
        darkModeToggle.classList.add('active');
    }
    
    const savedPomodoro = localStorage.getItem('pomodoroDuration');
    if (savedPomodoro) {
        document.getElementById('pomodoroDuration').value = savedPomodoro;
        pomodoroDuration = parseInt(savedPomodoro);
    }
    
    const streak = Math.floor(Math.random() * 30) + 1;
    streakCountSpan.textContent = streak;
    
    const pomodoroData = JSON.parse(localStorage.getItem('pomodoroData') || '{}');
    let totalMinutes = 0;
    Object.values(pomodoroData).forEach(val => totalMinutes += val * (pomodoroDuration || 25));
    totalStudyTimeSpan.textContent = `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteText.textContent = randomQuote;
    
    showToast('🚀 Study Planner ready!');
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
