// study-planner-pomodoro-technique.js
// Complete Study Planner with Pomodoro Timer

// Global Variables
let tasks = JSON.parse(localStorage.getItem('studyTasks')) || [];
let timer;
let timerDuration = 25 * 60; // 25 minutes in seconds
let currentTime = timerDuration;
let isRunning = false;
let isBreak = false;
let completedSessions = 0;
let completedBreaks = 0;
let totalStudyTime = parseInt(localStorage.getItem('totalStudyTime')) || 0;
let completedPomodoros = parseInt(localStorage.getItem('completedPomodoros')) || 0;
let completedTasksCount = parseInt(localStorage.getItem('completedTasks')) || 0;

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const tasksCount = document.getElementById('tasks-count');
const timerDisplay = document.getElementById('timer-display');
const timerType = document.getElementById('timer-type');
const startTimerBtn = document.getElementById('start-timer');
const pauseTimerBtn = document.getElementById('pause-timer');
const resetTimerBtn = document.getElementById('reset-timer');
const progressBar = document.getElementById('progress-bar');
const sessionCount = document.getElementById('session-count');
const breakCount = document.getElementById('break-count');
const completedPomodorosEl = document.getElementById('completed-pomodoros');
const completedTasksEl = document.getElementById('completed-tasks');
const studyTimeEl = document.getElementById('study-time');
const themeToggle = document.getElementById('theme-toggle');
const generatePlanBtn = document.getElementById('generate-plan');
const aiLoading = document.getElementById('ai-loading');
const planSummary = document.getElementById('plan-summary');
const confettiContainer = document.getElementById('confetti-container');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    updateTaskList();
    updateStats();
    updateTimerDisplay();
    setupEventListeners();
    setDefaultDate();
}

function setupEventListeners() {
    taskForm.addEventListener('submit', addTask);
    startTimerBtn.addEventListener('click', startTimer);
    pauseTimerBtn.addEventListener('click', pauseTimer);
    resetTimerBtn.addEventListener('click', resetTimer);
    themeToggle.addEventListener('click', toggleTheme);
    generatePlanBtn.addEventListener('click', generateSmartPlan);
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function setDefaultDate() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('task-deadline').valueAsDate = tomorrow;
}

// Task Management
function addTask(e) {
    e.preventDefault();
    
    const taskName = document.getElementById('task-name').value;
    const taskDeadline = document.getElementById('task-deadline').value;
    const taskEstimate = parseFloat(document.getElementById('task-estimate').value);
    const taskPriority = document.getElementById('task-priority').value;
    const taskNotes = document.getElementById('task-notes').value;
    
    const task = {
        id: Date.now(),
        name: taskName,
        deadline: taskDeadline,
        estimate: taskEstimate,
        priority: taskPriority,
        notes: taskNotes,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.unshift(task);
    saveTasks();
    updateTaskList();
    updateStats();
    taskForm.reset();
    setDefaultDate();
    
    showNotification('Task added successfully!', 'success');
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    updateTaskList();
    updateStats();
    showNotification('Task deleted!', 'info');
}

function toggleTaskComplete(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        if (task.completed) {
            completedTasksCount++;
            showConfetti();
            showNotification('Task completed! Great job! 🎉', 'success');
        } else {
            completedTasksCount = Math.max(0, completedTasksCount - 1);
        }
        saveTasks();
        updateTaskList();
        updateStats();
    }
}

function updateTaskList() {
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <p>No tasks yet. Add your first study task!</p>
            </div>
        `;
        tasksCount.textContent = '0';
        return;
    }
    
    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.priority}-priority ${task.completed ? 'completed' : ''}`;
        
        const daysLeft = calculateDaysLeft(task.deadline);
        const urgencyClass = daysLeft <= 1 ? 'urgent' : daysLeft <= 3 ? 'soon' : 'normal';
        
        taskItem.innerHTML = `
            <div class="task-info">
                <h4>
                    <i class="fas ${task.completed ? 'fa-check-circle success' : 'fa-circle'}"></i>
                    ${task.name}
                </h4>
                <div class="task-meta">
                    <span><i class="fas fa-calendar"></i> ${formatDate(task.deadline)}</span>
                    <span><i class="fas fa-clock"></i> ${task.estimate}h</span>
                    <span class="priority-badge priority-${task.priority}">
                        ${getPriorityIcon(task.priority)} ${task.priority}
                    </span>
                    ${daysLeft >= 0 ? `<span class="urgency-${urgencyClass}"><i class="fas fa-hourglass-half"></i> ${daysLeft}d left</span>` : '<span class="urgent"><i class="fas fa-exclamation-triangle"></i> Overdue!</span>'}
                </div>
                ${task.notes ? `<div class="task-notes"><i class="fas fa-sticky-note"></i> ${task.notes}</div>` : ''}
            </div>
            <div class="task-actions">
                <button class="btn ${task.completed ? 'secondary' : 'success'}" onclick="toggleTaskComplete(${task.id})">
                    <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="btn danger" onclick="deleteTask(${task.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        
        taskList.appendChild(taskItem);
    });
    
    tasksCount.textContent = tasks.filter(t => !t.completed).length;
}

// Timer Functions
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startTimerBtn.disabled = true;
        pauseTimerBtn.disabled = false;
        
        timer = setInterval(() => {
            currentTime--;
            updateTimerDisplay();
            updateProgressBar();
            
            if (currentTime <= 0) {
                clearInterval(timer);
                timerComplete();
            }
        }, 1000);
    }
}

function pauseTimer() {
    if (isRunning) {
        isRunning = false;
        clearInterval(timer);
        startTimerBtn.disabled = false;
        pauseTimerBtn.disabled = true;
    }
}

function resetTimer() {
    pauseTimer();
    isBreak = false;
    currentTime = timerDuration;
    updateTimerDisplay();
    updateProgressBar();
    timerType.innerHTML = '<i class="fas fa-brain"></i> Focus Session';
    document.getElementById('timer-container').classList.remove('break');
}

function timerComplete() {
    if (!isBreak) {
        // Focus session completed
        completedSessions++;
        completedPomodoros++;
        totalStudyTime += 25; // 25 minutes per pomodoro
        
        if (completedSessions % 4 === 0) {
            // Long break after 4 sessions
            currentTime = 15 * 60;
            isBreak = true;
            timerType.innerHTML = '<i class="fas fa-coffee"></i> Long Break';
            showNotification('Great work! Take a 15-minute break! ☕', 'success');
        } else {
            // Short break
            currentTime = 5 * 60;
            isBreak = true;
            timerType.innerHTML = '<i class="fas fa-mug-hot"></i> Short Break';
            showNotification('Session complete! Take a 5-minute break! 🎉', 'success');
        }
        
        completedBreaks++;
    } else {
        // Break completed
        currentTime = timerDuration;
        isBreak = false;
        timerType.innerHTML = '<i class="fas fa-brain"></i> Focus Session';
        showNotification('Break over! Time to focus! 🚀', 'info');
    }
    
    document.getElementById('timer-container').classList.toggle('break', isBreak);
    saveStats();
    updateStats();
    updateTimerDisplay();
    updateProgressBar();
    startTimer(); // Auto-start next session
}

function updateTimerDisplay() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateProgressBar() {
    const totalTime = isBreak ? (completedSessions % 4 === 0 ? 15 * 60 : 5 * 60) : timerDuration;
    const progress = ((totalTime - currentTime) / totalTime) * 100;
    progressBar.style.width = `${progress}%`;
}

// Stats and Utilities
function updateStats() {
    sessionCount.textContent = `Session: ${completedSessions}/4`;
    breakCount.textContent = `Break: ${completedBreaks}/3`;
    completedPomodorosEl.textContent = completedPomodoros;
    completedTasksEl.textContent = completedTasksCount;
    studyTimeEl.textContent = `${Math.floor(totalStudyTime / 60)}h ${totalStudyTime % 60}m`;
}

function saveStats() {
    localStorage.setItem('completedPomodoros', completedPomodoros);
    localStorage.setItem('completedTasks', completedTasksCount);
    localStorage.setItem('totalStudyTime', totalStudyTime);
}

function saveTasks() {
    localStorage.setItem('studyTasks', JSON.stringify(tasks));
}

function calculateDaysLeft(deadline) {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
    });
}

function getPriorityIcon(priority) {
    switch(priority) {
        case 'high': return '🚨';
        case 'medium': return '⚠️';
        case 'low': return '✅';
        default: return '📝';
    }
}

// Theme Management
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Smart Plan Generator
function generateSmartPlan() {
    const incompleteTasks = tasks.filter(t => !t.completed);
    
    if (incompleteTasks.length === 0) {
        showNotification('Add some study tasks first!', 'error');
        return;
    }

    // Show loading
    aiLoading.classList.remove('hidden');
    planSummary.classList.add('hidden');
    generatePlanBtn.disabled = true;
    generatePlanBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

    // Simulate AI processing
    setTimeout(() => {
        const plan = generateLocalPlan(incompleteTasks);
        displayPlan(plan);
        
        aiLoading.classList.add('hidden');
        planSummary.classList.remove('hidden');
        generatePlanBtn.disabled = false;
        generatePlanBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Smart Study Plan';
        
        showNotification('Smart study plan generated! 🎯', 'success');
    }, 2000);
}

function generateLocalPlan(tasks) {
    // Smart task sorting based on priority and deadline
    const sortedTasks = [...tasks].sort((a, b) => {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        const daysLeftA = calculateDaysLeft(a.deadline);
        const daysLeftB = calculateDaysLeft(b.deadline);
        
        const scoreA = priorityWeight[a.priority] * (1 / (daysLeftA + 1));
        const scoreB = priorityWeight[b.priority] * (1 / (daysLeftB + 1));
        
        return scoreB - scoreA;
    });

    let planHTML = `
        <div class="ai-plan-content">
            <div class="plan-header">
                <h3>🎯 Your Smart Study Plan</h3>
                <div class="plan-meta">
                    <span>📅 Generated: ${new Date().toLocaleDateString()}</span>
                    <span>⏰ Total Tasks: ${tasks.length}</span>
                    <span>🎯 Priority Based</span>
                </div>
            </div>
            
            <div class="priority-section">
                <h4>🚀 Recommended Study Order:</h4>
                <ol class="task-priority-list">
    `;
    
    sortedTasks.forEach((task, index) => {
        const pomodoros = Math.ceil(task.estimate * 2);
        const daysLeft = calculateDaysLeft(task.deadline);
        const urgency = daysLeft <= 1 ? '🚨 URGENT' : daysLeft <= 3 ? '⚡ SOON' : '📅 PLANNED';
        
        planHTML += `
            <li class="priority-task priority-${task.priority}">
                <div class="task-main">
                    <strong>${index + 1}. ${task.name}</strong>
                    <span class="urgency-badge">${urgency}</span>
                </div>
                <div class="task-details">
                    <span class="pomodoro-count">⏰ ${pomodoros} Pomodoros (${task.estimate}h)</span>
                    <span class="deadline">📅 ${formatDate(task.deadline)} (${daysLeft}d left)</span>
                    <span class="priority-badge priority-${task.priority}">
                        ${getPriorityIcon(task.priority)} ${task.priority.toUpperCase()} PRIORITY
                    </span>
                </div>
                ${task.notes ? `
                    <div class="task-notes">
                        <i class="fas fa-sticky-note"></i>
                        ${task.notes}
                    </div>
                ` : ''}
            </li>
        `;
    });
    
    planHTML += `
                </ol>
            </div>
            
            <div class="study-strategy">
                <h4>📚 Recommended Study Strategy:</h4>
                <div class="strategy-grid">
                    <div class="strategy-item">
                        <i class="fas fa-brain"></i>
                        <strong>Focus Sessions</strong>
                        <p>25min deep work + 5min breaks</p>
                    </div>
                    <div class="strategy-item">
                        <i class="fas fa-clock"></i>
                        <strong>Time Management</strong>
                        <p>Start with high priority tasks</p>
                    </div>
                    <div class="strategy-item">
                        <i class="fas fa-sync"></i>
                        <strong>Long Breaks</strong>
                        <p>15min break after 4 sessions</p>
                    </div>
                </div>
            </div>
            
            <div class="motivational-tips">
                <h4>💡 Success Tips:</h4>
                <ul>
                    <li>🎯 <strong>Start small</strong> - Begin with 1-2 pomodoros to build momentum</li>
                    <li>💧 <strong>Stay hydrated</strong> - Keep water nearby during study sessions</li>
                    <li>📵 <strong>Minimize distractions</strong> - Turn off notifications during focus time</li>
                    <li>🔄 <strong>Review regularly</strong> - Spend 5min reviewing what you've learned</li>
                    <li>🎉 <strong>Celebrate progress</strong> - Each completed task is an achievement!</li>
                </ul>
            </div>
            
            <div class="plan-footer">
                <p>🌟 <strong>Remember:</strong> Consistency is key! You're building habits for long-term success.</p>
            </div>
        </div>
    `;
    
    return planHTML;
}

function displayPlan(planHTML) {
    planSummary.innerHTML = planHTML;
}

// UI Effects
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showConfetti() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4ecdc4', '#f9c74f'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confettiContainer.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
    }
}