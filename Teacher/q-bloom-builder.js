// Q Bloom Builder - Main JavaScript Functionality

// Bloom's Taxonomy configuration
const Q_BLOOM_BUILDER_CONFIG = {
    cues: {
        remember: ["what", "who", "when", "where", "define", "list", "name", "identify", "recall", "select", "state", "match", "choose", "find", "how many"],
        understand: ["describe", "explain", "summarize", "compare", "contrast", "interpret", "discuss", "predict", "estimate", "paraphrase", "classify", "translate", "give example"],
        apply: ["use", "solve", "demonstrate", "apply", "calculate", "complete", "illustrate", "show", "sketch", "operate", "practice", "schedule", "use"],
        analyze: ["analyze", "classify", "categorize", "distinguish", "examine", "investigate", "explore", "differentiate", "compare", "contrast", "identify", "organize"],
        evaluate: ["evaluate", "judge", "justify", "defend", "critique", "recommend", "argue", "decide", "rate", "assess", "choose", "prioritize", "verify"],
        create: ["create", "design", "develop", "propose", "invent", "plan", "construct", "formulate", "generate", "write", "produce", "compose", "devise"]
    },
    colors: {
        remember: "#3498db",
        understand: "#2ecc71",
        apply: "#f1c40f",
        analyze: "#e67e22",
        evaluate: "#e74c3c",
        create: "#9b59b6"
    },
    icons: {
        remember: "🧠",
        understand: "💡",
        apply: "⚡",
        analyze: "🔍",
        evaluate: "⭐",
        create: "🎨"
    }
};

// Global state
let Q_BLOOM_BUILDER_STATE = {
    classifiedQuestions: {
        remember: [],
        understand: [],
        apply: [],
        analyze: [],
        evaluate: [],
        create: [],
        unclassified: []
    },
    currentTheme: 'light',
    analysisHistory: []
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeQBloomBuilder();
    setupEventListeners();
    loadSampleQuestions();
});

// Initialize the application
function initializeQBloomBuilder() {
    // Set initial theme
    const savedTheme = localStorage.getItem('q-bloom-builder-theme') || 'light';
    setTheme(savedTheme);
    
    // Initialize character counter
    updateCharacterCount();
    
    // Initialize empty bloom levels
    renderBloomLevelsGrid();
    
    console.log('Q Bloom Builder Initialized 🚀');
}

// Setup event listeners
function setupEventListeners() {
    const questionInput = document.getElementById('questionInput');
    const themeToggle = document.getElementById('themeToggle');
    
    // Input events
    questionInput.addEventListener('input', function() {
        updateCharacterCount();
        updateQuestionCount();
        debounce(autoDetectQuestions, 500)();
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            analyzeQuestions();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            loadSampleQuestions();
        }
        if (e.key === 'Escape') {
            resetAnalysis();
        }
    });
    
    // Animation on scroll
    setupScrollAnimations();
}

// Theme management
function setTheme(theme) {
    Q_BLOOM_BUILDER_STATE.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('q-bloom-builder-theme', theme);
    
    // Update theme button
    const themeBtn = document.getElementById('themeToggle');
    if (theme === 'dark') {
        themeBtn.style.transform = 'rotate(180deg)';
    } else {
        themeBtn.style.transform = 'rotate(0deg)';
    }
}

function toggleTheme() {
    const newTheme = Q_BLOOM_BUILDER_STATE.currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Add animation
    document.documentElement.style.transition = 'all 0.5s ease';
    setTimeout(() => {
        document.documentElement.style.transition = '';
    }, 500);
}

// Character and question counting
function updateCharacterCount() {
    const input = document.getElementById('questionInput');
    const charCount = document.getElementById('charCount');
    charCount.textContent = input.value.length;
    
    // Visual feedback
    if (input.value.length > 1000) {
        charCount.style.color = '#e74c3c';
        charCount.style.fontWeight = 'bold';
    } else if (input.value.length > 500) {
        charCount.style.color = '#f39c12';
    } else {
        charCount.style.color = '';
        charCount.style.fontWeight = '';
    }
}

function updateQuestionCount() {
    const input = document.getElementById('questionInput');
    const questionCount = document.getElementById('questionCount');
    const questions = extractQuestions(input.value);
    questionCount.textContent = questions.length;
}

// Auto-detection of questions
function autoDetectQuestions() {
    const input = document.getElementById('questionInput').value;
    if (input.length > 50) {
        const questions = extractQuestions(input);
        if (questions.length > 0) {
            showAutoDetectNotification(questions.length);
        }
    }
}

function showAutoDetectNotification(count) {
    // Remove existing notification
    const existingNotification = document.querySelector('.auto-detect-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'auto-detect-notification';
    notification.innerHTML = `
        <span>🤖 ${count} questions detected! Ready to analyze.</span>
        <button onclick="analyzeQuestions()">Analyze Now</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--surface-color);
        border: 2px solid var(--primary-color);
        border-radius: 10px;
        padding: 15px;
        box-shadow: var(--shadow);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: fadeInUp 0.5s ease;
    `;
    
    notification.querySelector('button').style.cssText = `
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'fadeInUp 0.5s ease reverse';
            setTimeout(() => notification.remove(), 500);
        }
    }, 5000);
}

// Main analysis function
function analyzeQuestions() {
    const inputText = document.getElementById('questionInput').value.trim();
    
    if (!inputText) {
        showNotification('Please enter some questions to analyze.', 'warning');
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    // Reset previous results
    resetResults();
    
    // Extract questions
    const questions = extractQuestions(inputText);
    
    if (questions.length === 0) {
        showNotification('No valid questions found. Please check your input.', 'error');
        setLoadingState(false);
        return;
    }
    
    // Update total questions count
    document.getElementById('totalQuestions').textContent = questions.length;
    
    // Classify each question with animation delay
    let delay = 0;
    questions.forEach((question, index) => {
        setTimeout(() => {
            const level = classifyQuestion(question);
            if (level) {
                Q_BLOOM_BUILDER_STATE.classifiedQuestions[level].push(question);
                updateLevelCount(level);
                animateQuestionAddition(level, question);
            } else {
                Q_BLOOM_BUILDER_STATE.unclassified.push(question);
            }
            
            // Update progress
            if (index === questions.length - 1) {
                setTimeout(finalizeAnalysis, 300);
            }
        }, delay);
        
        delay += 100; // Stagger animations
    });
    
    // Add to history
    Q_BLOOM_BUILDER_STATE.analysisHistory.push({
        timestamp: new Date().toISOString(),
        totalQuestions: questions.length,
        distribution: { ...Q_BLOOM_BUILDER_STATE.classifiedQuestions }
    });
}

// Extract questions from text
function extractQuestions(text) {
    return text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .filter(line => {
            // Basic question detection
            const hasQuestionMark = line.includes('?');
            const hasQuestionWord = /^(what|who|when|where|why|how|can|could|would|should|is|are|do|does|did)/i.test(line);
            return hasQuestionMark || hasQuestionWord || line.length > 10;
        });
}

// Classify a single question
function classifyQuestion(question) {
    const lowerQuestion = question.toLowerCase();
    
    // Check each Bloom's level for matching cue phrases
    for (const level in Q_BLOOM_BUILDER_CONFIG.cues) {
        for (const cue of Q_BLOOM_BUILDER_CONFIG.cues[level]) {
            const pattern = new RegExp(`\\b${cue}\\b`, 'i');
            if (pattern.test(lowerQuestion)) {
                return level;
            }
        }
    }
    
    return null;
}

// Animation functions
function animateQuestionAddition(level, question) {
    const card = document.querySelector(`.bloom-card.${level}`);
    if (card) {
        card.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            card.style.animation = '';
        }, 500);
    }
}

function setLoadingState(loading) {
    const buttons = document.querySelectorAll('.btn');
    const container = document.querySelector('.q-bloom-builder-container');
    
    if (loading) {
        container.classList.add('loading');
        buttons.forEach(btn => btn.disabled = true);
        showNotification('Analyzing questions...', 'info');
    } else {
        container.classList.remove('loading');
        buttons.forEach(btn => btn.disabled = false);
    }
}

function finalizeAnalysis() {
    // Update all displays
    updateAllDisplays();
    
    // Show completion notification
    const classifiedCount = getClassifiedCount();
    showNotification(`Analysis complete! ${classifiedCount} questions classified.`, 'success');
    
    // Generate AI recommendations
    generateAIRecommendations();
    
    setLoadingState(false);
}

// Update all result displays
function updateAllDisplays() {
    updateStatsGrid();
    updateBloomLevelsDisplay();
    updateVisualization();
    updateSummary();
}

function updateStatsGrid() {
    const levels = ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'];
    levels.forEach(level => {
        const count = Q_BLOOM_BUILDER_STATE.classifiedQuestions[level].length;
        document.getElementById(`${level}Count`).textContent = count;
    });
}

function updateLevelCount(level) {
    const countElement = document.getElementById(`${level}Count`);
    if (countElement) {
        const currentCount = parseInt(countElement.textContent) || 0;
        countElement.textContent = currentCount + 1;
        
        // Add animation
        countElement.style.animation = 'bounce 0.5s ease';
        setTimeout(() => {
            countElement.style.animation = '';
        }, 500);
    }
}

function updateBloomLevelsDisplay() {
    const grid = document.querySelector('.bloom-levels-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    for (const level of ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create']) {
        const questions = Q_BLOOM_BUILDER_STATE.classifiedQuestions[level];
        if (questions.length === 0) continue;
        
        const card = document.createElement('div');
        card.className = `bloom-card ${level} fade-in`;
        card.innerHTML = `
            <h3>${Q_BLOOM_BUILDER_CONFIG.icons[level]} ${capitalizeFirst(level)} (${questions.length})</h3>
            <ul class="questions-list">
                ${questions.map(q => `<li>${q}</li>`).join('')}
            </ul>
        `;
        
        grid.appendChild(card);
    }
    
    // Add animation to cards
    const cards = grid.querySelectorAll('.bloom-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

function updateVisualization() {
    const chartElement = document.getElementById('bloom-chart');
    const legendElement = document.getElementById('chart-legend');
    
    if (!chartElement || !legendElement) return;
    
    chartElement.innerHTML = '';
    legendElement.innerHTML = '';
    
    const totalClassified = getClassifiedCount();
    if (totalClassified === 0) return;
    
    let legendHTML = '';
    
    for (const level of ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create']) {
        const count = Q_BLOOM_BUILDER_STATE.classifiedQuestions[level].length;
        const percentage = totalClassified > 0 ? (count / totalClassified) * 100 : 0;
        
        // Chart segment
        if (percentage > 0) {
            const segment = document.createElement('div');
            segment.className = 'chart-segment';
            segment.style.width = `${percentage}%`;
            segment.style.backgroundColor = Q_BLOOM_BUILDER_CONFIG.colors[level];
            segment.title = `${capitalizeFirst(level)}: ${count} questions (${percentage.toFixed(1)}%)`;
            
            if (percentage >= 8) {
                segment.innerHTML = `
                    <span class="chart-label">${capitalizeFirst(level)}</span>
                    <span class="chart-percentage">${percentage.toFixed(0)}%</span>
                `;
            }
            
            chartElement.appendChild(segment);
        }
        
        // Legend item
        legendHTML += `
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${Q_BLOOM_BUILDER_CONFIG.colors[level]}"></div>
                <span>${capitalizeFirst(level)}: ${count}</span>
            </div>
        `;
    }
    
    legendElement.innerHTML = legendHTML;
}

function updateSummary() {
    const classifiedCount = getClassifiedCount();
    const totalQuestions = parseInt(document.getElementById('totalQuestions').textContent);
    
    document.getElementById('classifiedQuestions').textContent = classifiedCount;
    document.getElementById('highestLevel').textContent = getHighestLevel();
    
    // Update classification rate
    const classificationRate = totalQuestions > 0 ? (classifiedCount / totalQuestions * 100).toFixed(1) : 0;
    
    // Add visual indicator for classification rate
    const classifiedElement = document.getElementById('classifiedQuestions');
    if (classificationRate >= 80) {
        classifiedElement.style.color = '#2ecc71';
    } else if (classificationRate >= 60) {
        classifiedElement.style.color = '#f39c12';
    } else {
        classifiedElement.style.color = '#e74c3c';
    }
}

// Utility functions
function getClassifiedCount() {
    let total = 0;
    for (const level in Q_BLOOM_BUILDER_STATE.classifiedQuestions) {
        if (level !== 'unclassified') {
            total += Q_BLOOM_BUILDER_STATE.classifiedQuestions[level].length;
        }
    }
    return total;
}

function getHighestLevel() {
    const levels = ['create', 'evaluate', 'analyze', 'apply', 'understand', 'remember'];
    for (const level of levels) {
        if (Q_BLOOM_BUILDER_STATE.classifiedQuestions[level].length > 0) {
            return capitalizeFirst(level);
        }
    }
    return '-';
}

function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.q-bloom-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `q-bloom-notification ${type}`;
    notification.textContent = message;
    
    const styles = {
        position: 'fixed',
        top: '80px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '10px',
        color: 'white',
        fontWeight: '600',
        zIndex: '1000',
        animation: 'fadeInUp 0.5s ease',
        boxShadow: 'var(--shadow)',
        maxWidth: '300px'
    };
    
    const typeColors = {
        info: '#3498db',
        success: '#2ecc71',
        warning: '#f39c12',
        error: '#e74c3c'
    };
    
    Object.assign(notification.style, styles);
    notification.style.background = typeColors[type] || typeColors.info;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'fadeInUp 0.5s ease reverse';
            setTimeout(() => notification.remove(), 500);
        }
    }, 5000);
}

// Reset functions
function resetResults() {
    for (const level in Q_BLOOM_BUILDER_STATE.classifiedQuestions) {
        Q_BLOOM_BUILDER_STATE.classifiedQuestions[level] = [];
    }
    
    document.querySelectorAll('.questions-list').forEach(list => {
        list.innerHTML = '';
    });
    
    document.getElementById('bloom-chart').innerHTML = '';
    document.getElementById('chart-legend').innerHTML = '';
    
    updateStatsGrid();
    updateSummary();
}

function resetAnalysis() {
    document.getElementById('questionInput').value = '';
    resetResults();
    updateCharacterCount();
    updateQuestionCount();
    showNotification('Analysis reset successfully.', 'info');
}

// Sample questions
function loadSampleQuestions() {
    const sampleQuestions = [
        "What is the capital of France?",
        "Define the term 'photosynthesis'.",
        "List three main characters from Romeo and Juliet.",
        "Who wrote the Declaration of Independence?",
        "When did World War II end?",
        "Explain how photosynthesis works in plants.",
        "Describe the water cycle in your own words.",
        "Compare and contrast mitosis and meiosis.",
        "Summarize the main themes of 'To Kill a Mockingbird'.",
        "Predict what might happen if global temperatures continue to rise.",
        "Use the Pythagorean theorem to solve for the hypotenuse.",
        "Calculate the area of a circle with radius 5cm.",
        "Demonstrate Newton's third law with an example.",
        "Apply the concept of supply and demand to this scenario.",
        "Solve this quadratic equation: x² + 5x + 6 = 0",
        "Analyze the causes of the French Revolution.",
        "Categorize these animals into vertebrates and invertebrates.",
        "Examine the relationship between these two variables.",
        "Distinguish between facts and opinions in this text.",
        "Investigate the factors affecting enzyme activity.",
        "Evaluate the effectiveness of this marketing campaign.",
        "Justify your answer with evidence from the text.",
        "Critique this author's argument about climate change.",
        "Defend your position on school uniforms.",
        "Judge which solution is more sustainable.",
        "Create a new product that solves an everyday problem.",
        "Design an experiment to test this hypothesis.",
        "Develop a business plan for a startup.",
        "Propose a solution to reduce plastic waste.",
        "Invent a device that helps people with disabilities."
    ];
    
    document.getElementById('questionInput').value = sampleQuestions.join('\n');
    updateCharacterCount();
    updateQuestionCount();
    showNotification('Sample questions loaded! Click "Analyze Questions" to see them in action.', 'success');
}

// Scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.stat-card, .bloom-card, .visualization-section').forEach(el => {
        observer.observe(el);
    });
}

// Initial render of bloom levels grid
function renderBloomLevelsGrid() {
    const grid = document.querySelector('.bloom-levels-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    for (const level of ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create']) {
        const card = document.createElement('div');
        card.className = `bloom-card ${level}`;
        card.innerHTML = `
            <h3>${Q_BLOOM_BUILDER_CONFIG.icons[level]} ${capitalizeFirst(level)}</h3>
            <ul class="questions-list">
                <li style="opacity: 0.7; text-align: center;">No questions yet</li>
            </ul>
        `;
        grid.appendChild(card);
    }
}

// Generate basic AI recommendations
function generateAIRecommendations() {
    const recommendationsElement = document.getElementById('aiRecommendations');
    const contentElement = recommendationsElement.querySelector('.recommendations-content');
    
    const distribution = Q_BLOOM_BUILDER_STATE.classifiedQuestions;
    const total = getClassifiedCount();
    
    if (total === 0) {
        contentElement.innerHTML = '<p>Analyze questions to get AI-powered suggestions.</p>';
        return;
    }
    
    let recommendations = [];
    
    // Analyze distribution and generate recommendations
    const rememberPercent = (distribution.remember.length / total) * 100;
    const createPercent = (distribution.create.length / total) * 100;
    
    if (rememberPercent > 50) {
        recommendations.push("Consider adding more higher-order thinking questions (Analyze, Evaluate, Create) to challenge students.");
    }
    
    if (createPercent < 10) {
        recommendations.push("Try incorporating more 'Create' level questions to foster creativity and innovation.");
    }
    
    if (distribution.analyze.length === 0 && distribution.evaluate.length === 0) {
        recommendations.push("Your questions lack analytical and evaluative components. Add questions that require critical thinking.");
    }
    
    if (recommendations.length === 0) {
        recommendations.push("Great balance! Your questions cover multiple cognitive levels effectively.");
    }
    
    contentElement.innerHTML = `
        <p><strong>Distribution Analysis:</strong></p>
        <ul style="margin-top: 10px;">
            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
        <div style="margin-top: 15px; padding: 10px; background: rgba(71, 118, 230, 0.1); border-radius: 8px;">
            <small>💡 <strong>Tip:</strong> Aim for a balanced distribution across all Bloom's levels for comprehensive learning.</small>
        </div>
    `;
}

// Export functions will be in the next file due to length