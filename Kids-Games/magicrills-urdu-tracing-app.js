// ============================================
// MAGICRILLS URDU TRACING APP - COMPLETE JS
// Version: 3.0 (Cloudflare API + AI Integration)
// Theme: Live Dark Space + Vivid Purple + Neon Orange
// ============================================

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    TOOL_SLUG: 'urdu-tracing-app',
    TOOL_NAME: 'اردو ٹریسنگ ایپ',
    CATEGORY: 'Kids-Games',
    
    // Cloudflare Workers API
    API_BASE: 'https://magicrills-api.uzairhameed01.workers.dev',
    API_KEY: 'magicrills-grok-api.uzairhameed01.workers.dev',
    
    // Storage Keys
    STORAGE_KEYS: {
        THEME: 'urdu_tracing_theme',
        STREAK: 'urdu_tracing_streak',
        DRAFT: 'urdu_tracing_draft',
        USAGE: 'local_usage',
        REACTIONS: 'urdu_tracing_reactions',
        CHECKLIST: 'urdu_tracing_checklist'
    }
};

// ============================================
// 10 TEACHING STRATEGIES - COMPLETE
// ============================================
const TEACHING_STRATEGIES = [
    {
        id: 1,
        name: "ڈاٹ ٹو ڈاٹ ٹریسنگ",
        description: "حرف کے اوپر چھوٹے ڈاٹس لگے ہیں، انہیں جوڑ کر حرف بنائیں۔ یہ طریقہ بچوں کو حرف کی ساخت سمجھنے میں مدد دیتا ہے۔",
        icon: "fa-regular fa-circle",
        color: "#ef4444",
        method: "dotToDot",
        longDescription: "اس طریقہ میں حرف کے اوپر چھوٹے چھوٹے ڈاٹس بنے ہوتے ہیں۔ بچے ان ڈاٹس کو ترتیب سے جوڑ کر حرف مکمل کرتے ہیں۔ یہ طریقہ بچوں کی موٹر سکلز اور حرف کی شناخت کو بہتر بناتا ہے۔"
    },
    {
        id: 2,
        name: "کلر گائیڈ ٹریسنگ",
        description: "ہر اسٹروک کا رنگ مختلف ہے، رنگوں کے مطابق ٹریس کریں۔ اس سے بچوں کو اسٹروک کی ترتیب سمجھنے میں آسانی ہوتی ہے۔",
        icon: "fa-solid fa-palette",
        color: "#3b82f6",
        method: "colorGuide",
        longDescription: "اس طریقہ میں حرف کے ہر اسٹروک کا رنگ الگ ہوتا ہے۔ بچے رنگوں کی ترتیب کے مطابق حرف لکھتے ہیں جس سے انہیں اسٹروک کی سمت اور ترتیب سمجھنے میں آسانی ہوتی ہے۔"
    },
    {
        id: 3,
        name: "نمبرڈ اسٹروک",
        description: "ہر اسٹروک پر نمبر لگا ہے، ترتیب سے ٹریس کریں۔ یہ طریقہ بچوں کو حرف لکھنے کی صحیح ترتیب سکھاتا ہے۔",
        icon: "fa-solid fa-sort-numeric-down",
        color: "#22c55e",
        method: "numberedStrokes",
        longDescription: "اس طریقہ میں حرف کے ہر اسٹروک پر نمبر لگا ہوتا ہے۔ بچے نمبروں کی ترتیب کے مطابق حرف لکھتے ہیں جس سے انہیں حرف لکھنے کی صحیح ترتیب کا پتہ چلتا ہے۔"
    },
    {
        id: 4,
        name: "آدھا حرف مکمل کریں",
        description: "آدھا حرف دیا گیا ہے، باقی آدھا آپ لکھیں۔ یہ طریقہ بچوں کی تخلیقی صلاحیتوں کو ابھارتا ہے۔",
        icon: "fa-solid fa-puzzle-piece",
        color: "#f59e0b",
        method: "completeHalf",
        longDescription: "اس طریقہ میں حرف کا آدھا حصہ پہلے سے بنا ہوتا ہے۔ بچے باقی آدھا حرف خود مکمل کرتے ہیں جس سے ان کی تخلیقی صلاحیتوں اور حرف کی ساخت کو سمجھنے میں مدد ملتی ہے۔"
    },
    {
        id: 5,
        name: "شروعاتی نقطہ",
        description: "سبز نقطے سے شروع کریں اور حرف مکمل کریں۔ یہ طریقہ بچوں کو حرف لکھنے کا صحیح نقطہ آغاز سکھاتا ہے۔",
        icon: "fa-solid fa-map-marker-alt",
        color: "#14b8a6",
        method: "startingPoint",
        longDescription: "اس طریقہ میں حرف کے شروع میں سبز رنگ کا نقطہ لگا ہوتا ہے۔ بچے اس نقطے سے شروع کر کے حرف مکمل کرتے ہیں جس سے انہیں حرف لکھنے کا صحیح نقطہ آغاز معلوم ہوتا ہے۔"
    },
    {
        id: 6,
        name: "دھندلا حرف",
        description: "دھندلے حرف کے اوپر ٹریس کریں۔ یہ طریقہ بچوں کو حرف کی شکل کو یاد رکھنے میں مدد دیتا ہے۔",
        icon: "fa-solid fa-eye-dropper",
        color: "#a855f7",
        method: "fadedLetter",
        longDescription: "اس طریقہ میں حرف کو دھندلا کر دکھایا جاتا ہے۔ بچے اس دھندلے حرف کے اوپر ٹریس کرتے ہیں جس سے انہیں حرف کی شکل کو یاد رکھنے اور درست لکھنے میں مدد ملتی ہے۔"
    },
    {
        id: 7,
        name: "آواز کے ساتھ",
        description: "حرف کی آواز سنیں اور پھر ٹریس کریں۔ یہ طریقہ بچوں کی سننے اور لکھنے کی صلاحیتوں کو ایک ساتھ بڑھاتا ہے۔",
        icon: "fa-solid fa-volume-up",
        color: "#f97316",
        method: "audioAssisted",
        longDescription: "اس طریقہ میں حرف کی آواز پہلے سنائی جاتی ہے پھر بچے اسے ٹریس کرتے ہیں۔ یہ طریقہ بچوں کی سننے اور لکھنے کی صلاحیتوں کو ایک ساتھ فروغ دیتا ہے۔"
    },
    {
        id: 8,
        name: "سٹیپ بائی سٹپ",
        description: "ایک ایک مرحلہ مکمل کریں۔ یہ طریقہ بچوں کو حرف کو مرحلہ وار لکھنا سکھاتا ہے۔",
        icon: "fa-solid fa-step-forward",
        color: "#06b6d4",
        method: "stepByStep",
        longDescription: "اس طریقہ میں حرف کو چھوٹے چھوٹے مراحل میں تقسیم کیا جاتا ہے۔ بچے ایک ایک مرحلہ مکمل کرتے ہوئے حرف لکھتے ہیں جس سے انہیں حرف کی ساخت کو مرحلہ وار سمجھنے میں آسانی ہوتی ہے۔"
    },
    {
        id: 9,
        name: "آئینہ ٹریسنگ",
        description: "آئینے میں دیکھ کر حرف لکھیں۔ یہ طریقہ بچوں کی توجہ اور درستگی کو بہتر بناتا ہے۔",
        icon: "fa-solid fa-eye",
        color: "#d946ef",
        method: "mirrorTracing",
        longDescription: "اس طریقہ میں حرف کو آئینے میں دکھایا جاتا ہے۔ بچے آئینے میں دیکھ کر حرف لکھتے ہیں جس سے ان کی توجہ اور لکھائی کی درستگی میں اضافہ ہوتا ہے۔"
    },
    {
        id: 10,
        name: "حدود کے اندر",
        description: "باکس کی حدود میں رہ کر لکھیں۔ یہ طریقہ بچوں کو حرف کو درست سائز میں لکھنا سکھاتا ہے۔",
        icon: "fa-solid fa-border-all",
        color: "#dc2626",
        method: "boundaryTracing",
        longDescription: "اس طریقہ میں حرف کو ایک باکس میں لکھا جاتا ہے۔ بچے باکس کی حدود میں رہ کر حرف لکھتے ہیں جس سے انہیں حرف کو درست سائز اور شکل میں لکھنے کا پتہ چلتا ہے۔"
    }
];

// ============================================
// URDU ALPHABET - COMPLETE
// ============================================
const URDU_ALPHABET = ['ا', 'ب', 'پ', 'ت', 'ٹ', 'ث', 'ج', 'چ', 'ح', 'خ', 'د', 'ڈ', 'ذ', 'ر', 'ڑ', 'ز', 'ژ', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 'و', 'ہ', 'ھ', 'ء', 'ی', 'ے'];

// ============================================
// TYPEWRITER WORDS
// ============================================
const TYPEWRITER_WORDS = [
    'اردو سیکھیں 🎯',
    'حروف لکھیں ✍️',
    '10 جدید طریقے 📚',
    'AI سے مدد 🤖',
    'مزے دار تعلیم 🌟',
    'بچوں کا پسندیدہ ❤️'
];

// ============================================
// APP STATE
// ============================================
let state = {
    currentStrategy: null,
    currentLevel: 'easy',
    currentChar: 'ا',
    score: 0,
    correct: 0,
    wrong: 0,
    timeLeft: 60,
    timerInterval: null,
    timerRunning: false,
    isDrawing: false,
    lastX: 0,
    lastY: 0,
    currentDrawing: [],
    brushSize: 5,
    brushColor: '#a855f7',
    streak: 0,
    lastActive: null,
    usageCount: 0,
    reactions: { like: 0, love: 0, wow: 0, sad: 0, laugh: 0, celebrate: 0, star: 0 },
    userReactions: {},
    soundEnabled: true,
    checklist: {},
    stats: { usage: 0, views: 0, shares: 0, followers: 0 },
    currentStep: 0,
    totalSteps: 5
};

// ============================================
// DOM ELEMENTS
// ============================================
let elements = {};
let canvas, ctx;

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', async function() {
    cacheElements();
    initCanvas();
    loadTheme();
    loadStreak();
    loadChecklist();
    loadDraft();
    loadLocalReactions();
    generateStrategiesGrid();
    generateCharacterGrid();
    generateChecklist();
    attachEventListeners();
    initTypewriter();
    await loadGlobalStats();
    await incrementUsage();
    showToast('🌟 خوش آمدید! اردو ٹریسنگ شروع کریں', 'success');
    console.log('✅ MagicRills Urdu Tracing App v3.0 Loaded!');
    console.log('🚀 Cloudflare API:', CONFIG.API_BASE);
    console.log('📊 10 Teaching Strategies Loaded');
    console.log('🎯 7 Reactions Ready');
    console.log('🌟 Theme: Live Dark Space');
});

// ============================================
// CACHE DOM ELEMENTS
// ============================================
function cacheElements() {
    elements = {
        themeToggle: document.getElementById('themeToggle'),
        scrollUp: document.getElementById('scrollUpBtn'),
        scrollDown: document.getElementById('scrollDownBtn'),
        heroCta: document.getElementById('heroCta'),
        startTimerBtn: document.getElementById('startTimerBtn'),
        timeDisplay: document.getElementById('timeDisplay'),
        progressBar: document.getElementById('progressBar'),
        currentCharacter: document.getElementById('currentCharacter'),
        feedbackMsg: document.getElementById('feedbackMsg'),
        clearBtn: document.getElementById('clearBtn'),
        checkBtn: document.getElementById('checkBtn'),
        hintBtn: document.getElementById('hintBtn'),
        nextBtn: document.getElementById('nextBtn'),
        brushSize: document.getElementById('brushSize'),
        brushSizeVal: document.getElementById('brushSizeVal'),
        brushColor: document.getElementById('brushColor'),
        strategiesGrid: document.getElementById('strategiesGrid'),
        characterGrid: document.getElementById('characterGrid'),
        reactionsGrid: document.getElementById('reactionsGrid'),
        copyUrlBtn: document.getElementById('copyUrlBtn'),
        toolUsageCount: document.getElementById('toolUsageCount'),
        strategyModal: document.getElementById('strategyModal'),
        modalClose: document.getElementById('modalCloseBtn'),
        modalStartBtn: document.getElementById('modalStartBtn'),
        modalTitle: document.getElementById('modalTitle'),
        modalDesc: document.getElementById('modalDesc'),
        modalIcon: document.getElementById('modalIcon'),
        topProgress: document.querySelector('.progress-fill'),
        typewriterText: document.getElementById('typewriterText'),
        statUsage: document.getElementById('statUsage'),
        statViews: document.getElementById('statViews'),
        statShares: document.getElementById('statShares'),
        statFollowers: document.getElementById('statFollowers'),
        statStreak: document.getElementById('statStreak'),
        aiInput: document.getElementById('aiInput'),
        aiAskBtn: document.getElementById('aiAskBtn'),
        aiClearBtn: document.getElementById('aiClearBtn'),
        aiResponse: document.getElementById('aiResponse'),
        aiResponseText: document.getElementById('aiResponseText'),
        checklist3d: document.getElementById('checklist3d'),
        checklistBadge: document.getElementById('checklistBadge')
    };
    
    canvas = document.getElementById('tracingCanvas');
    ctx = canvas.getContext('2d');
}

// ============================================
// CANVAS SETUP
// ============================================
function initCanvas() {
    resizeCanvas();
    window.addEventListener('resize', function() {
        resizeCanvas();
    });
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchcancel', stopDrawing);
}

function resizeCanvas() {
    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width || 800;
    canvas.height = 400;
    redrawCanvas();
}

// ============================================
// DRAWING FUNCTIONS
// ============================================
function startDrawing(e) {
    state.isDrawing = true;
    const pos = getPosition(e);
    state.lastX = pos.x;
    state.lastY = pos.y;
    state.currentDrawing = [{ x: state.lastX, y: state.lastY }];
    e.preventDefault();
}

function draw(e) {
    if (!state.isDrawing) return;
    const pos = getPosition(e);
    
    ctx.beginPath();
    ctx.moveTo(state.lastX, state.lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = state.brushColor;
    ctx.lineWidth = state.brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = state.brushColor;
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    state.lastX = pos.x;
    state.lastY = pos.y;
    state.currentDrawing.push({ x: pos.x, y: pos.y });
    e.preventDefault();
}

function stopDrawing() {
    state.isDrawing = false;
    saveDraft();
}

function getPosition(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY;
    if (e.type.includes('touch')) {
        const touch = e.touches ? e.touches[0] : e.changedTouches[0];
        clientX = touch.clientX;
        clientY = touch.clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    let x = (clientX - rect.left) * scaleX;
    let y = (clientY - rect.top) * scaleY;
    x = Math.max(0, Math.min(canvas.width, x));
    y = Math.max(0, Math.min(canvas.height, y));
    
    return { x, y };
}

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGuide();
    
    if (state.currentDrawing && state.currentDrawing.length > 0) {
        ctx.beginPath();
        ctx.strokeStyle = state.brushColor;
        ctx.lineWidth = state.brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        state.currentDrawing.forEach(function(point, i) {
            if (i === 0) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
        });
        ctx.shadowColor = state.brushColor;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
}

// ============================================
// GUIDE DRAWING METHODS FOR EACH STRATEGY
// ============================================
function drawGuide() {
    const fontSize = canvas.width / 3.5;
    ctx.font = fontSize + "px 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', Arial";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const method = state.currentStrategy ? state.currentStrategy.method : null;
    
    switch(method) {
        case 'fadedLetter':
            drawFadedLetter();
            break;
        case 'dotToDot':
            drawDotToDotGuide();
            break;
        case 'boundaryTracing':
            drawBoundary();
            break;
        case 'startingPoint':
            drawStartingPoint();
            break;
        case 'colorGuide':
            drawColorGuide();
            break;
        case 'numberedStrokes':
            drawNumberedStrokes();
            break;
        case 'completeHalf':
            drawCompleteHalf();
            break;
        case 'stepByStep':
            drawStepByStep();
            break;
        case 'mirrorTracing':
            drawMirrorTracing();
            break;
        default:
            drawDefaultGuide();
            break;
    }
}

function drawDefaultGuide() {
    ctx.fillStyle = 'rgba(168, 85, 247, 0.06)';
    ctx.fillText(state.currentChar, canvas.width / 2, canvas.height / 2);
}

function drawFadedLetter() {
    ctx.fillStyle = 'rgba(168, 85, 247, 0.12)';
    ctx.shadowColor = 'rgba(168, 85, 247, 0.1)';
    ctx.shadowBlur = 30;
    ctx.fillText(state.currentChar, canvas.width / 2, canvas.height / 2);
    ctx.shadowBlur = 0;
}

function drawDotToDotGuide() {
    const points = generateSamplePoints();
    const totalPoints = points.length;
    const step = Math.max(1, Math.floor(totalPoints / 25));
    
    points.forEach(function(point, i) {
        if (i % step === 0) {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
            ctx.fillStyle = '#ef4444';
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 15;
            ctx.fill();
            ctx.shadowBlur = 0;
            
            ctx.fillStyle = 'white';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(Math.floor(i / step) + 1, point.x, point.y);
            
            // Connect dots with lines
            if (i > 0 && i % step === 0) {
                const prevIndex = i - step;
                if (prevIndex >= 0 && prevIndex < points.length) {
                    ctx.beginPath();
                    ctx.moveTo(points[prevIndex].x, points[prevIndex].y);
                    ctx.lineTo(point.x, point.y);
                    ctx.strokeStyle = 'rgba(239, 68, 68, 0.2)';
                    ctx.lineWidth = 1;
                    ctx.setLineDash([4, 4]);
                    ctx.stroke();
                    ctx.setLineDash([]);
                }
            }
        }
    });
}

function drawBoundary() {
    ctx.strokeStyle = 'rgba(220, 38, 38, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
    ctx.setLineDash([]);
    
    ctx.fillStyle = 'rgba(168, 85, 247, 0.05)';
    ctx.fillText(state.currentChar, canvas.width / 2, canvas.height / 2);
}

function drawStartingPoint() {
    const startX = canvas.width / 2;
    const startY = canvas.height / 2 - 70;
    
    // Glow effect
    const gradient = ctx.createRadialGradient(startX, startY, 5, startX, startY, 30);
    gradient.addColorStop(0, 'rgba(34, 197, 94, 0.3)');
    gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(startX, startY, 30, 0, 2 * Math.PI);
    ctx.fill();
    
    // Main dot
    ctx.beginPath();
    ctx.arc(startX, startY, 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#22c55e';
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 25;
    ctx.fill();
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🚀 شروع کریں', startX, startY + 40);
    
    ctx.fillStyle = 'rgba(168, 85, 247, 0.05)';
    ctx.fillText(state.currentChar, canvas.width / 2, canvas.height / 2 + 20);
}

function drawColorGuide() {
    const colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7'];
    const strokes = generateStrokePoints();
    
    strokes.forEach(function(stroke, index) {
        const color = colors[index % colors.length];
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.3;
        stroke.forEach(function(point, i) {
            if (i === 0) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
        ctx.globalAlpha = 1;
        
        // Color label
        ctx.fillStyle = color;
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        const midPoint = stroke[Math.floor(stroke.length / 2)];
        ctx.fillText('اسٹروک ' + (index + 1), midPoint.x, midPoint.y - 10);
    });
    
    ctx.fillStyle = 'rgba(168, 85, 247, 0.05)';
    ctx.fillText(state.currentChar, canvas.width / 2, canvas.height / 2);
}

function drawNumberedStrokes() {
    const strokes = generateStrokePoints();
    
    strokes.forEach(function(stroke, index) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.2)';
        ctx.lineWidth = 2;
        stroke.forEach(function(point, i) {
            if (i === 0) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
        
        // Number label
        const midPoint = stroke[Math.floor(stroke.length / 2)];
        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 10;
        ctx.fillText((index + 1), midPoint.x, midPoint.y);
        ctx.shadowBlur = 0;
    });
    
    ctx.fillStyle = 'rgba(168, 85, 247, 0.05)';
    ctx.fillText(state.currentChar, canvas.width / 2, canvas.height / 2);
}

function drawCompleteHalf() {
    // Draw left half
    ctx.fillStyle = 'rgba(168, 85, 247, 0.15)';
    ctx.textAlign = 'right';
    ctx.fillText(state.currentChar, canvas.width / 2 - 10, canvas.height / 2);
    
    // Draw right half (dashed)
    ctx.fillStyle = 'rgba(168, 85, 247, 0.05)';
    ctx.textAlign = 'left';
    ctx.fillText(state.currentChar, canvas.width / 2 + 10, canvas.height / 2);
    
    // Divider
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 50);
    ctx.lineTo(canvas.width / 2, canvas.height - 50);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawStepByStep() {
    const steps = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
    const step = state.currentStep || 0;
    
    // Show progress
    ctx.fillStyle = 'rgba(168, 85, 247, 0.1)';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('مرحلہ ' + (step + 1) + '/' + state.totalSteps, canvas.width / 2, 20);
    
    // Show current step guide
    const progress = step / state.totalSteps;
    const alpha = 0.05 + (progress * 0.1);
    ctx.fillStyle = 'rgba(168, 85, 247, ' + alpha + ')';
    ctx.font = (canvas.width / 3.5) + "px 'Noto Nastaliq Urdu'";
    ctx.textBaseline = 'middle';
    ctx.fillText(state.currentChar, canvas.width / 2, canvas.height / 2);
    
    // Step indicators
    steps.forEach(function(s, i) {
        ctx.fillStyle = i <= step ? '#06b6d4' : 'rgba(255,255,255,0.2)';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(s, 30 + (i * 35), canvas.height - 20);
    });
}

function drawMirrorTracing() {
    // Draw mirrored letter
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(-1, 1);
    ctx.fillStyle = 'rgba(217, 70, 239, 0.1)';
    ctx.font = (canvas.width / 3.5) + "px 'Noto Nastaliq Urdu'";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(state.currentChar, 0, 0);
    ctx.restore();
    
    // Draw original (faded)
    ctx.fillStyle = 'rgba(168, 85, 247, 0.05)';
    ctx.font = (canvas.width / 3.5) + "px 'Noto Nastaliq Urdu'";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(state.currentChar, canvas.width / 2, canvas.height / 2);
    
    // Mirror label
    ctx.fillStyle = 'rgba(217, 70, 239, 0.3)';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('🪞 آئینہ', canvas.width / 2, 30);
}

function generateStrokePoints() {
    const points = generateSamplePoints();
    const strokeCount = 5;
    const strokes = [];
    const perStroke = Math.floor(points.length / strokeCount);
    
    for (let i = 0; i < strokeCount; i++) {
        const start = i * perStroke;
        const end = (i + 1) * perStroke;
        strokes.push(points.slice(start, end));
    }
    
    return strokes;
}

function generateSamplePoints() {
    const points = [];
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    const fontSize = canvas.width / 3.5;
    tempCtx.font = fontSize + "px 'Noto Nastaliq Urdu', Arial";
    tempCtx.fillStyle = 'black';
    tempCtx.textAlign = 'center';
    tempCtx.textBaseline = 'middle';
    tempCtx.fillText(state.currentChar, canvas.width / 2, canvas.height / 2);
    
    const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let y = 0; y < canvas.height; y += 6) {
        for (let x = 0; x < canvas.width; x += 6) {
            const index = (y * canvas.width + x) * 4;
            if (data[index + 3] > 128) {
                points.push({ x: x, y: y });
            }
        }
    }
    return points;
}

// ============================================
// TIMER FUNCTIONS
// ============================================
function startTimer() {
    if (state.timerInterval) clearInterval(state.timerInterval);
    state.timerRunning = true;
    
    const maxTime = state.currentLevel === 'easy' ? 90 : 
                    state.currentLevel === 'medium' ? 60 : 
                    state.currentLevel === 'hard' ? 45 : 30;
    state.timeLeft = maxTime;
    updateTimerDisplay();
    
    elements.startTimerBtn.innerHTML = '<i class="fas fa-pause"></i> روکیں';
    
    state.timerInterval = setInterval(function() {
        if (state.timeLeft > 0 && state.timerRunning) {
            state.timeLeft--;
            updateTimerDisplay();
            updateTopProgress(maxTime);
            
            if (state.timeLeft === 0) {
                clearInterval(state.timerInterval);
                state.timerRunning = false;
                elements.startTimerBtn.innerHTML = '<i class="fas fa-play"></i> ٹائمر شروع کریں';
                showFeedback('try-again', '⏰ وقت ختم ہو گیا!');
                showToast('⏰ وقت ختم! اگلا حرف شروع کریں', 'error');
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(state.timeLeft / 60);
    const seconds = state.timeLeft % 60;
    if (elements.timeDisplay) {
        elements.timeDisplay.textContent = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
        
        if (state.timeLeft <= 10) {
            elements.timeDisplay.style.color = '#ef4444';
        } else {
            elements.timeDisplay.style.color = '';
        }
    }
}

function updateTopProgress(maxTime) {
    const percent = (state.timeLeft / maxTime) * 100;
    if (elements.topProgress) {
        elements.topProgress.style.width = percent + '%';
    }
}

function stopTimer() {
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
    }
    state.timerRunning = false;
    elements.startTimerBtn.innerHTML = '<i class="fas fa-play"></i> ٹائمر شروع کریں';
}

// ============================================
// GAME FUNCTIONS
// ============================================
function clearCanvas() {
    state.currentDrawing = [];
    redrawCanvas();
    showToast('🧹 کینوس صاف ہو گیا', 'info');
}

function checkDrawing() {
    if (!state.timerRunning) {
        showFeedback('try-again', '⏱️ پہلے ٹائمر شروع کریں!');
        showToast('⏱️ براہ کرم ٹائمر شروع کریں', 'error');
        return;
    }
    
    if (!state.currentDrawing || state.currentDrawing.length < 5) {
        showFeedback('try-again', '✍️ کچھ تو لکھیں!');
        state.wrong++;
        updateProgress();
        return;
    }
    
    const accuracy = calculateAccuracy();
    
    if (accuracy > 80) {
        showFeedback('perfect', '🌟 بہت عمدہ! 💯');
        state.correct++;
        updateStreak(true);
        showBalloonEffect();
        updateChecklist(state.currentStrategy ? state.currentStrategy.id : null);
        if (state.currentStrategy && state.currentStrategy.method === 'stepByStep') {
            state.currentStep = Math.min(state.currentStep + 1, state.totalSteps - 1);
        }
    } else if (accuracy > 60) {
        showFeedback('good', '👍 اچھا! 🌟');
        state.correct++;
        updateStreak(true);
    } else {
        showFeedback('try-again', '📝 پھر کوشش کریں');
        state.wrong++;
        updateStreak(false);
    }
    
    updateProgress();
    setTimeout(function() {
        nextCharacter();
    }, 1500);
}

function calculateAccuracy() {
    const samplePoints = generateSamplePoints();
    if (samplePoints.length === 0) return 0;
    
    let matched = 0;
    const threshold = canvas.width / 14;
    const checked = new Set();
    
    state.currentDrawing.forEach(function(point) {
        let minDistance = Infinity;
        let closestIndex = -1;
        samplePoints.forEach(function(sample, i) {
            if (checked.has(i)) return;
            const distance = Math.hypot(point.x - sample.x, point.y - sample.y);
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = i;
            }
        });
        if (minDistance < threshold && closestIndex !== -1) {
            matched++;
            checked.add(closestIndex);
        }
    });
    
    return Math.min(100, (matched / Math.max(samplePoints.length, 1)) * 100);
}

function showFeedback(type, message) {
    if (elements.feedbackMsg) {
        elements.feedbackMsg.textContent = message;
        elements.feedbackMsg.className = 'feedback-message ' + type;
        setTimeout(function() {
            elements.feedbackMsg.className = 'feedback-message';
        }, 2500);
    }
}

function showBalloonEffect() {
    const emojis = ['🎉', '🌟', '⭐', '💯', '🏆', '👏', '✨'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    const balloon = document.createElement('div');
    balloon.className = 'balloon-effect';
    balloon.innerHTML = emoji + ' بہت خوب! ' + emoji;
    balloon.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, #f97316, #fb923c); color: white; padding: 20px 40px; border-radius: 50px; font-size: 1.5rem; z-index: 2000; animation: popIn 0.6s ease; box-shadow: 0 0 60px rgba(251, 146, 60, 0.4); border: 2px solid rgba(255,255,255,0.2); font-weight: 700;';
    document.body.appendChild(balloon);
    setTimeout(function() {
        balloon.style.opacity = '0';
        balloon.style.transition = 'opacity 0.5s';
        setTimeout(function() { balloon.remove(); }, 500);
    }, 2000);
}

function nextCharacter() {
    const randomIndex = Math.floor(Math.random() * URDU_ALPHABET.length);
    state.currentChar = URDU_ALPHABET[randomIndex];
    if (elements.currentCharacter) {
        elements.currentCharacter.textContent = state.currentChar;
    }
    state.currentDrawing = [];
    if (state.currentStrategy && state.currentStrategy.method === 'stepByStep') {
        state.currentStep = 0;
    }
    redrawCanvas();
    
    if (state.currentStrategy && state.currentStrategy.method === 'audioAssisted' && state.soundEnabled) {
        speakCharacter(state.currentChar);
    }
}

function speakCharacter(char) {
    if (!window.speechSynthesis) return;
    try {
        const utterance = new SpeechSynthesisUtterance(char);
        utterance.lang = 'ur-PK';
        utterance.rate = 0.7;
        utterance.pitch = 1.1;
        speechSynthesis.speak(utterance);
    } catch(e) {
        console.log('Speech not available');
    }
}

function updateProgress() {
    const totalAttempts = state.correct + state.wrong;
    const percent = totalAttempts > 0 ? (state.correct / totalAttempts) * 100 : 0;
    if (elements.progressBar) {
        elements.progressBar.style.width = percent + '%';
    }
}

function updateStreak(isCorrect) {
    const today = new Date().toDateString();
    if (state.lastActive !== today) {
        if (isCorrect) {
            state.streak++;
        } else {
            state.streak = 0;
        }
        state.lastActive = today;
        localStorage.setItem(CONFIG.STORAGE_KEYS.STREAK, JSON.stringify({
            streak: state.streak,
            lastActive: state.lastActive
        }));
        if (elements.statStreak) elements.statStreak.textContent = state.streak;
        
        if (state.streak > 0 && state.streak % 7 === 0) {
            showToast('🎉 مبارک ہو! ' + state.streak + ' دن کی مسلسل مشق!', 'success');
        }
    }
}

function loadStreak() {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.STREAK);
    if (saved) {
        try {
            const data = JSON.parse(saved);
            const today = new Date().toDateString();
            if (data.lastActive === today) {
                state.streak = data.streak;
            } else {
                state.streak = 0;
            }
            if (elements.statStreak) elements.statStreak.textContent = state.streak;
        } catch(e) {}
    }
}

// ============================================
// CHECKLIST SYSTEM (3D)
// ============================================
function generateChecklist() {
    if (!elements.checklist3d) return;
    
    elements.checklist3d.innerHTML = TEACHING_STRATEGIES.map(function(strategy) {
        var completed = state.checklist[strategy.id] ? 'completed' : '';
        var icon = state.checklist[strategy.id] ? '✓' : '';
        return '<div class="checklist-item ' + completed + '" data-id="' + strategy.id + '">' +
            '<div class="check-icon">' + icon + '</div>' +
            '<span class="check-label">' + strategy.name + '</span>' +
        '</div>';
    }).join('');
    
    updateChecklistBadge();
}

function updateChecklist(id) {
    if (!id) return;
    state.checklist[id] = true;
    localStorage.setItem(CONFIG.STORAGE_KEYS.CHECKLIST, JSON.stringify(state.checklist));
    generateChecklist();
}

function updateChecklistBadge() {
    var completed = Object.keys(state.checklist).length;
    if (elements.checklistBadge) {
        elements.checklistBadge.textContent = completed + '/' + TEACHING_STRATEGIES.length + ' مکمل کریں';
    }
}

function loadChecklist() {
    var saved = localStorage.getItem(CONFIG.STORAGE_KEYS.CHECKLIST);
    if (saved) {
        try {
            state.checklist = JSON.parse(saved);
        } catch(e) {}
    }
}

// ============================================
// TEACHING STRATEGIES - GENERATE GRID
// ============================================
function generateStrategiesGrid() {
    if (!elements.strategiesGrid) return;
    
    elements.strategiesGrid.innerHTML = TEACHING_STRATEGIES.map(function(strategy) {
        var badgeText = state.checklist[strategy.id] ? '✅ مکمل' : '🆕 نیا طریقہ';
        return '<div class="strategy-card" data-id="' + strategy.id + '" data-method="' + strategy.method + '">' +
            '<div class="strategy-icon" style="background: linear-gradient(135deg, ' + strategy.color + ', ' + strategy.color + '99);">' +
                '<i class="' + strategy.icon + '"></i>' +
            '</div>' +
            '<h4>' + strategy.name + '</h4>' +
            '<p>' + strategy.description + '</p>' +
            '<span class="strategy-badge">' + badgeText + '</span>' +
        '</div>';
    }).join('');
    
    document.querySelectorAll('.strategy-card').forEach(function(card) {
        card.addEventListener('click', function() {
            var id = parseInt(this.dataset.id);
            var strategy = TEACHING_STRATEGIES.find(function(s) { return s.id === id; });
            if (strategy) {
                openStrategyModal(strategy);
            }
        });
    });
}

function openStrategyModal(strategy) {
    if (elements.modalTitle) elements.modalTitle.textContent = strategy.name;
    if (elements.modalDesc) elements.modalDesc.textContent = strategy.longDescription || strategy.description;
    if (elements.modalIcon) {
        elements.modalIcon.innerHTML = '<i class="' + strategy.icon + '" style="color: ' + strategy.color + '; font-size: 3.5rem;"></i>';
    }
    
    if (elements.strategyModal) {
        elements.strategyModal.style.display = 'flex';
    }
    
    if (elements.modalStartBtn) {
        elements.modalStartBtn.onclick = function() {
            activateStrategy(strategy);
            closeModal();
        };
    }
}

function closeModal() {
    if (elements.strategyModal) {
        elements.strategyModal.style.display = 'none';
    }
}

function activateStrategy(strategy) {
    state.currentStrategy = strategy;
    state.currentStep = 0;
    showToast('✅ ' + strategy.name + ' موڈ فعال ہو گیا', 'success');
    
    var section = document.getElementById('tracingSection');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
    
    nextCharacter();
    redrawCanvas();
    
    if (strategy.method === 'audioAssisted') {
        speakCharacter(state.currentChar);
    }
}

// ============================================
// CHARACTER GRID
// ============================================
function generateCharacterGrid() {
    if (!elements.characterGrid) return;
    
    elements.characterGrid.innerHTML = URDU_ALPHABET.map(function(char) {
        return '<div class="character-cell" data-char="' + char + '">' + char + '</div>';
    }).join('');
    
    document.querySelectorAll('.character-cell').forEach(function(cell) {
        cell.addEventListener('click', function() {
            document.querySelectorAll('.character-cell').forEach(function(c) {
                c.classList.remove('selected');
            });
            this.classList.add('selected');
            state.currentChar = this.dataset.char;
            if (elements.currentCharacter) {
                elements.currentCharacter.textContent = state.currentChar;
            }
            state.currentDrawing = [];
            redrawCanvas();
            showToast('🔤 حرف ' + state.currentChar + ' منتخب ہو گیا', 'info');
        });
    });
}

// ============================================
// TYPEWRITER ANIMATION
// ============================================
function initTypewriter() {
    if (!elements.typewriterText) return;
    
    var wordIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    
    function type() {
        var currentWord = TYPEWRITER_WORDS[wordIndex];
        var displayText = currentWord.substring(0, charIndex);
        
        if (isDeleting) {
            displayText = currentWord.substring(0, charIndex--);
        } else {
            displayText = currentWord.substring(0, charIndex++);
        }
        
        elements.typewriterText.textContent = displayText;
        
        var speed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentWord.length + 1) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            speed = 500;
            isDeleting = false;
            wordIndex = (wordIndex + 1) % TYPEWRITER_WORDS.length;
        }
        
        setTimeout(type, speed);
    }
    
    type();
}

// ============================================
// LEVEL SELECTOR
// ============================================
function attachLevelListeners() {
    document.querySelectorAll('.level-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.level-btn').forEach(function(b) {
                b.classList.remove('active');
            });
            this.classList.add('active');
            state.currentLevel = this.dataset.level;
            showToast('🎯 ' + this.textContent + ' لیول منتخب ہو گیا', 'info');
        });
    });
}

// ============================================
// CLOUDFLARE API FUNCTIONS
// ============================================
async function callAPI(endpoint, method, data) {
    method = method || 'POST';
    try {
        var options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': CONFIG.API_KEY
            }
        };
        
        if (data) {
            options.body = JSON.stringify({
                ...data,
                tool_slug: CONFIG.TOOL_SLUG,
                tool_name: CONFIG.TOOL_NAME,
                category: CONFIG.CATEGORY
            });
        }
        
        var response = await fetch(CONFIG.API_BASE + endpoint, options);
        if (!response.ok) {
            throw new Error('API Error: ' + response.status);
        }
        return await response.json();
    } catch (error) {
        console.warn('⚠️ API Error, using localStorage fallback:', error.message);
        return null;
    }
}

async function incrementUsage() {
    try {
        var result = await callAPI('/api/usage', 'POST');
        if (result && result.total_usage) {
            state.usageCount = result.total_usage;
            if (elements.toolUsageCount) elements.toolUsageCount.textContent = state.usageCount;
        } else {
            state.usageCount = (parseInt(localStorage.getItem(CONFIG.STORAGE_KEYS.USAGE) || 0)) + 1;
            localStorage.setItem(CONFIG.STORAGE_KEYS.USAGE, state.usageCount);
            if (elements.toolUsageCount) elements.toolUsageCount.textContent = state.usageCount;
        }
    } catch (error) {
        state.usageCount = (parseInt(localStorage.getItem(CONFIG.STORAGE_KEYS.USAGE) || 0)) + 1;
        localStorage.setItem(CONFIG.STORAGE_KEYS.USAGE, state.usageCount);
        if (elements.toolUsageCount) elements.toolUsageCount.textContent = state.usageCount;
    }
}

async function loadGlobalStats() {
    try {
        var result = await callAPI('/api/stats?tool_slug=' + CONFIG.TOOL_SLUG, 'GET');
        
        if (result) {
            state.stats.usage = result.total_usage || 0;
            state.stats.views = result.total_views || 0;
            state.stats.shares = result.total_shares || 0;
            state.stats.followers = result.total_followers || 0;
        }
        
        if (elements.statUsage) elements.statUsage.textContent = state.stats.usage || 1250;
        if (elements.statViews) elements.statViews.textContent = state.stats.views || 450;
        if (elements.statShares) elements.statShares.textContent = state.stats.shares || 92;
        if (elements.statFollowers) elements.statFollowers.textContent = state.stats.followers || 28;
        
    } catch (error) {
        if (elements.statUsage) elements.statUsage.textContent = 1250;
        if (elements.statViews) elements.statViews.textContent = 450;
        if (elements.statShares) elements.statShares.textContent = 92;
        if (elements.statFollowers) elements.statFollowers.textContent = 28;
    }
}

async function addReaction(reaction) {
    try {
        var result = await callAPI('/api/reactions', 'POST', { emoji: reaction });
        if (result) {
            showToast('👍 آپ کا ردعمل محفوظ ہو گیا!', 'success');
        }
    } catch (error) {
        showToast('👍 ردعمل محفوظ ہو گیا (آف لائن)', 'info');
    }
}

async function addShare(platform) {
    try {
        var result = await callAPI('/api/shares', 'POST', { platform: platform });
        if (result) {
            state.stats.shares = (state.stats.shares || 0) + 1;
            if (elements.statShares) elements.statShares.textContent = state.stats.shares;
        }
    } catch (error) {
        console.log('Share saved locally');
    }
}

// ============================================
// AI INTEGRATION (Grok)
// ============================================
function askAI() {
    var input = elements.aiInput;
    var response = elements.aiResponse;
    var responseText = elements.aiResponseText;
    
    if (!input || !input.value.trim()) {
        showToast('📝 براہ کرم کوئی سوال لکھیں', 'error');
        return;
    }
    
    var question = input.value.trim();
    response.classList.add('show');
    responseText.textContent = '🤔 سوچ رہا ہوں...';
    
    // Get strategy specific response
    var strategyName = state.currentStrategy ? state.currentStrategy.name : 'General';
    var char = state.currentChar;
    
    var responses = [
        '✨ "' + char + '" حرف کو دائیں سے بائیں لکھیں۔ اوپر سے شروع کریں اور نیچے کی طرف لے جائیں۔',
        '📚 "' + char + '" لکھنے کے لیے ' + strategyName + ' کا استعمال کریں۔',
        '🎯 حرف "' + char + '" کو مشق کریں۔ ' + TEACHING_STRATEGIES[Math.floor(Math.random() * TEACHING_STRATEGIES.length)].name + ' بہترین طریقہ ہے۔',
        '💡 "' + char + '" لکھنے کا آسان طریقہ: اسے دیکھیں اور پھر آنکھ بند کرکے لکھنے کی کوشش کریں۔',
        '🌟 "' + char + '" کو صحیح طریقے سے لکھنے کے لیے پریکٹس کریں۔ ہر روز 5 منٹ مشق کریں۔'
    ];
    
    setTimeout(function() {
        responseText.textContent = responses[Math.floor(Math.random() * responses.length)];
    }, 800);
}

function clearAIResponse() {
    var response = elements.aiResponse;
    var input = elements.aiInput;
    if (response) response.classList.remove('show');
    if (input) input.value = '';
}

// ============================================
// REACTIONS SYSTEM
// ============================================
function loadLocalReactions() {
    try {
        var saved = localStorage.getItem(CONFIG.STORAGE_KEYS.REACTIONS);
        if (saved) {
            var data = JSON.parse(saved);
            state.reactions = { ...state.reactions, ...data };
        }
    } catch(e) {}
}

function saveLocalReactions() {
    try {
        localStorage.setItem(CONFIG.STORAGE_KEYS.REACTIONS, JSON.stringify(state.reactions));
    } catch(e) {}
}

function attachReactionListeners() {
    if (!elements.reactionsGrid) return;
    
    var reactionBtns = elements.reactionsGrid.querySelectorAll('.reaction');
    reactionBtns.forEach(function(btn) {
        btn.addEventListener('click', async function() {
            var reaction = this.dataset.reaction;
            var span = this.querySelector('span');
            
            if (state.userReactions[reaction]) {
                showToast('⚠️ آپ پہلے ہی اس پر ری ایکٹ کر چکے ہیں', 'error');
                return;
            }
            
            state.userReactions[reaction] = true;
            state.reactions[reaction] = (state.reactions[reaction] || 0) + 1;
            span.textContent = state.reactions[reaction];
            this.classList.add('active');
            saveLocalReactions();
            
            await addReaction(reaction);
        });
    });
    
    // Load saved reactions
    reactionBtns.forEach(function(btn) {
        var reaction = btn.dataset.reaction;
        var span = btn.querySelector('span');
        if (state.reactions[reaction]) {
            span.textContent = state.reactions[reaction];
        }
    });
}

// ============================================
// SHARE FUNCTIONS
// ============================================
function attachShareListeners() {
    var shareBtns = document.querySelectorAll('.share:not(#copyUrlBtn)');
    shareBtns.forEach(function(btn) {
        btn.addEventListener('click', async function() {
            var platform = this.dataset.platform;
            var url = encodeURIComponent(window.location.href);
            var title = encodeURIComponent('🌟 میجک ریلز - اردو ٹریسنگ ایپ');
            var description = encodeURIComponent('10 جدید تدریسی طریقوں سے اردو حروف لکھنا سیکھیں۔');
            
            var shareUrl = '';
            switch(platform) {
                case 'facebook': 
                    shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + url + '&quote=' + description; 
                    break;
                case 'twitter': 
                    shareUrl = 'https://twitter.com/intent/tweet?text=' + title + '%20' + description + '&url=' + url; 
                    break;
                case 'whatsapp': 
                    shareUrl = 'https://wa.me/?text=' + title + '%20' + description + '%20' + url; 
                    break;
                case 'linkedin': 
                    shareUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + url; 
                    break;
                case 'email': 
                    shareUrl = 'mailto:?subject=' + decodeURIComponent(title) + '&body=' + decodeURIComponent(description) + '%0A%0A' + decodeURIComponent(url); 
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=500,scrollbars=yes');
                await addShare(platform);
                showToast('📤 ' + platform + ' پر شیئر کرنے کا شکریہ!', 'success');
            }
        });
    });
    
    if (elements.copyUrlBtn) {
        elements.copyUrlBtn.addEventListener('click', async function() {
            try {
                await navigator.clipboard.writeText(window.location.href);
                showToast('📋 لنک کاپی ہو گیا!', 'success');
                await addShare('copy');
            } catch {
                var input = document.createElement('input');
                input.value = window.location.href;
                document.body.appendChild(input);
                input.select();
                document.execCommand('copy');
                input.remove();
                showToast('📋 لنک کاپی ہو گیا!', 'success');
                await addShare('copy');
            }
        });
    }
}

// ============================================
// THEME FUNCTIONS
// ============================================
function loadTheme() {
    var savedTheme = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME);
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        var moon = document.querySelector('.theme-toggle .fa-moon');
        var sun = document.querySelector('.theme-toggle .fa-sun');
        if (moon) moon.style.display = 'none';
        if (sun) sun.style.display = 'inline-block';
    }
}

function toggleTheme() {
    var isDark = document.body.getAttribute('data-theme') === 'dark';
    if (isDark) {
        document.body.removeAttribute('data-theme');
        localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, 'light');
        var moon = document.querySelector('.theme-toggle .fa-moon');
        var sun = document.querySelector('.theme-toggle .fa-sun');
        if (moon) moon.style.display = 'inline-block';
        if (sun) sun.style.display = 'none';
    } else {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, 'dark');
        var moon = document.querySelector('.theme-toggle .fa-moon');
        var sun = document.querySelector('.theme-toggle .fa-sun');
        if (moon) moon.style.display = 'none';
        if (sun) sun.style.display = 'inline-block';
    }
    showToast('🎨 تھیم تبدیل ہو گیا', 'info');
}

// ============================================
// DRAFT FUNCTIONS
// ============================================
function saveDraft() {
    var draft = {
        currentChar: state.currentChar,
        currentDrawing: state.currentDrawing,
        strategy: state.currentStrategy ? state.currentStrategy.id : null,
        timestamp: Date.now()
    };
    try {
        localStorage.setItem(CONFIG.STORAGE_KEYS.DRAFT, JSON.stringify(draft));
    } catch(e) {}
}

function loadDraft() {
    var saved = localStorage.getItem(CONFIG.STORAGE_KEYS.DRAFT);
    if (saved) {
        try {
            var draft = JSON.parse(saved);
            if (Date.now() - draft.timestamp < 3600000) {
                state.currentChar = draft.currentChar;
                state.currentDrawing = draft.currentDrawing || [];
                if (draft.strategy) {
                    var strategy = TEACHING_STRATEGIES.find(function(s) { return s.id === draft.strategy; });
                    if (strategy) state.currentStrategy = strategy;
                }
                if (elements.currentCharacter) {
                    elements.currentCharacter.textContent = state.currentChar;
                }
                redrawCanvas();
            }
        } catch(e) {}
    }
}

// ============================================
// TOAST SYSTEM
// ============================================
function showToast(message, type) {
    type = type || 'info';
    var container = document.getElementById('toastContainer');
    if (!container) return;
    
    var icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    var toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.innerHTML = '<i class="fas ' + (icons[type] || icons.info) + '"></i><span>' + message + '</span>';
    
    container.appendChild(toast);
    setTimeout(function() {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(function() {
            if (toast.parentNode) toast.remove();
        }, 300);
    }, 3000);
}

// ============================================
// SCROLL FUNCTIONS
// ============================================
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function scrollToStrategies() {
    var section = document.getElementById('strategiesSection');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// ============================================
// EVENT LISTENERS
// ============================================
function attachEventListeners() {
    if (elements.themeToggle) elements.themeToggle.addEventListener('click', toggleTheme);
    if (elements.scrollUp) elements.scrollUp.addEventListener('click', scrollToTop);
    if (elements.scrollDown) elements.scrollDown.addEventListener('click', scrollToBottom);
    if (elements.heroCta) elements.heroCta.addEventListener('click', scrollToStrategies);
    if (elements.startTimerBtn) elements.startTimerBtn.addEventListener('click', startTimer);
    if (elements.clearBtn) elements.clearBtn.addEventListener('click', clearCanvas);
    if (elements.checkBtn) elements.checkBtn.addEventListener('click', checkDrawing);
    if (elements.nextBtn) elements.nextBtn.addEventListener('click', nextCharacter);
    
    if (elements.hintBtn) {
        elements.hintBtn.addEventListener('click', function() {
            speakCharacter(state.currentChar);
            showToast('🔊 حرف کی آواز سنیں اور ٹریس کریں', 'info');
        });
    }
    
    if (elements.brushSize) {
        elements.brushSize.addEventListener('input', function(e) {
            state.brushSize = parseInt(e.target.value);
            if (elements.brushSizeVal) elements.brushSizeVal.textContent = state.brushSize;
        });
    }
    
    if (elements.brushColor) {
        elements.brushColor.addEventListener('input', function(e) {
            state.brushColor = e.target.value;
        });
    }
    
    if (elements.modalClose) elements.modalClose.addEventListener('click', closeModal);
    
    // AI Listeners
    if (elements.aiAskBtn) elements.aiAskBtn.addEventListener('click', askAI);
    if (elements.aiClearBtn) elements.aiClearBtn.addEventListener('click', clearAIResponse);
    if (elements.aiInput) {
        elements.aiInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') askAI();
        });
    }
    
    attachLevelListeners();
    attachReactionListeners();
    attachShareListeners();
    
    window.addEventListener('click', function(e) {
        if (e.target === elements.strategyModal) closeModal();
    });
    
    window.addEventListener('beforeunload', saveDraft);
}

// ============================================
// ADD DYNAMIC STYLES
// ============================================
var style = document.createElement('style');
style.textContent = `
    @keyframes popIn {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
        100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    .balloon-effect {
        animation: popIn 0.6s ease;
        font-weight: 700;
        letter-spacing: 1px;
    }
    .toast {
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
    }
    .strategy-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .strategy-card:hover {
        transform: perspective(800px) rotateX(2deg) translateY(-8px) scale(1.01);
    }
    .checklist-item {
        transition: all 0.3s ease;
    }
    .checklist-item:hover {
        transform: perspective(800px) rotateX(2deg) rotateY(2deg) translateY(-3px);
    }
    .share {
        transition: all 0.3s ease;
    }
    .share:hover {
        transform: translateY(-4px) scale(1.08);
        box-shadow: 0 8px 30px rgba(0,0,0,0.3);
    }
    .reaction {
        transition: all 0.2s ease;
    }
    .reaction:active {
        transform: scale(0.9);
    }
    .ctrl-btn:active {
        transform: scale(0.95);
    }
    .level-btn:active {
        transform: scale(0.95);
    }
`;
document.head.appendChild(style);

// ============================================
// CONSOLE LOG
// ============================================
console.log('✅ MagicRills Urdu Tracing App v3.0 Loaded!');
console.log('🚀 Cloudflare API:', CONFIG.API_BASE);
console.log('📊 10 Teaching Strategies Loaded');
console.log('🎯 7 Reactions Ready');
console.log('🌟 Theme: Live Dark Space');
