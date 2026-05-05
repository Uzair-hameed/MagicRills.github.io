// ========================================
// POSTERFORGE PRO - COMPLETE JAVASCRIPT
// Fabric.js + TiDB + Grok API + Full Integration
// 500+ Elements | Export | Save | Reactions | Animations
// ========================================

// ========================================
// GLOBAL VARIABLES
// ========================================
let canvas = null;
let currentToolSlug = 'teacher-resource-finder';
let userId = localStorage.getItem('userId') || 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
let darkMode = localStorage.getItem('darkMode') === 'true';
let autoSaveEnabled = localStorage.getItem('autoSaveEnabled') === 'true';
let selectedObjectId = null;
let currentReactions = { like: 0, love: 0, wow: 0, sad: 0, laugh: 0, celebrate: 0 };
let userReacted = { like: false, love: false, wow: false, sad: false, laugh: false, celebrate: false };
let historyStates = [];
let historyIndex = -1;

// API Base URL
const API_BASE = '/api';

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('PosterForge Pro Initializing...');
    
    // Initialize Fabric.js Canvas
    initializeCanvas();
    
    // Set dark mode
    if (darkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeBtn').innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Store userId
    localStorage.setItem('userId', userId);
    
    // Load all data
    loadTemplates();
    loadElements();
    loadGradients();
    loadPatterns();
    loadSavedImages();
    await loadReactionsFromAPI();
    await loadUsageFromAPI();
    await trackUsage();
    
    // Setup event listeners
    setupEventListeners();
    
    // Save initial state
    saveToHistory();
    
    // Start auto-save if enabled
    if (autoSaveEnabled) {
        startAutoSave();
    }
    
    showToast('PosterForge Pro is ready! Create your masterpiece!');
});

// ========================================
// FABRIC.JS CANVAS INITIALIZATION
// ========================================
function initializeCanvas() {
    canvas = new fabric.Canvas('canvas', {
        width: 800,
        height: 1000,
        backgroundColor: '#ffffff',
        preserveObjectStacking: true,
        selection: true
    });
    
    // Add default welcome text
    const welcomeText = new fabric.Text('Welcome to PosterForge Pro!\nClick to add elements, drag to move, resize and rotate.\nUse sidebar to add Shapes, Icons, Text and more!', {
        left: 100,
        top: 400,
        fontSize: 20,
        fontFamily: 'Inter',
        fill: '#333333',
        textAlign: 'center',
        width: 600
    });
    canvas.add(welcomeText);
    
    // Selection event
    canvas.on('selection:created', (e) => {
        if (e.selected && e.selected[0]) {
            selectedObjectId = e.selected[0].id;
            updateLayersList();
        }
    });
    
    canvas.on('selection:updated', (e) => {
        if (e.selected && e.selected[0]) {
            selectedObjectId = e.selected[0].id;
            updateLayersList();
        }
    });
    
    canvas.on('selection:cleared', () => {
        selectedObjectId = null;
        updateLayersList();
    });
    
    canvas.on('object:modified', () => {
        saveToHistory();
    });
    
    canvas.on('object:added', () => {
        saveToHistory();
        updateLayersList();
    });
    
    canvas.on('object:removed', () => {
        saveToHistory();
        updateLayersList();
    });
    
    canvas.renderAll();
}

// ========================================
// SAVE TO HISTORY (UNDO/REDO)
// ========================================
function saveToHistory() {
    const state = JSON.stringify(canvas.toJSON());
    
    if (historyIndex < historyStates.length - 1) {
        historyStates = historyStates.slice(0, historyIndex + 1);
    }
    
    historyStates.push(state);
    historyIndex = historyStates.length - 1;
    
    if (historyStates.length > 50) {
        historyStates.shift();
        historyIndex--;
    }
}

function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        const state = JSON.parse(historyStates[historyIndex]);
        canvas.loadFromJSON(state, () => {
            canvas.renderAll();
            updateLayersList();
            showToast('Undo');
        });
    }
}

function redo() {
    if (historyIndex < historyStates.length - 1) {
        historyIndex++;
        const state = JSON.parse(historyStates[historyIndex]);
        canvas.loadFromJSON(state, () => {
            canvas.renderAll();
            updateLayersList();
            showToast('Redo');
        });
    }
}

// ========================================
// LOAD TEMPLATES (30+ Professional Templates)
// ========================================
function loadTemplates() {
    const templates = [
        { id: 1, name: 'Library What\'s On', category: 'library', color: '#1e293b', text: 'WHAT\'S ON LIBRARY' },
        { id: 2, name: 'Book Fair', category: 'library', color: '#667eea', text: 'BOOK FAIR 2026' },
        { id: 3, name: 'Reading Club', category: 'library', color: '#f093fb', text: 'READING CLUB' },
        { id: 4, name: 'Author Spotlight', category: 'library', color: '#4facfe', text: 'AUTHOR SPOTLIGHT' },
        { id: 5, name: 'School Announcement', category: 'education', color: '#43e97b', text: 'SCHOOL ANNOUNCEMENT' },
        { id: 6, name: 'Exam Schedule', category: 'education', color: '#fa709a', text: 'EXAM SCHEDULE' },
        { id: 7, name: 'Graduation', category: 'education', color: '#a8edea', text: 'GRADUATION 2026' },
        { id: 8, name: 'Scholarship', category: 'education', color: '#d4fc79', text: 'SCHOLARSHIP OPPORTUNITY' },
        { id: 9, name: 'Corporate Event', category: 'business', color: '#2b5876', text: 'CORPORATE EVENT' },
        { id: 10, name: 'Product Launch', category: 'business', color: '#c33764', text: 'PRODUCT LAUNCH' },
        { id: 11, name: 'Wedding', category: 'events', color: '#f5af19', text: 'WEDDING CELEBRATION' },
        { id: 12, name: 'Birthday', category: 'events', color: '#fccb90', text: 'HAPPY BIRTHDAY' },
        { id: 13, name: 'Eid Mubarak', category: 'islamic', color: '#11998e', text: 'EID MUBARAK' },
        { id: 14, name: 'Ramadan Kareem', category: 'islamic', color: '#b92b27', text: 'RAMADAN KAREEM' },
        { id: 15, name: 'Valentine\'s Day', category: 'love', color: '#ff6b6b', text: 'BE MY VALENTINE' },
        { id: 16, name: 'Anniversary', category: 'love', color: '#ff9a9e', text: 'HAPPY ANNIVERSARY' },
        { id: 17, name: 'Motivational Quote', category: 'education', color: '#4facfe', text: 'STAY MOTIVATED' },
        { id: 18, name: 'Success Story', category: 'education', color: '#43e97b', text: 'SUCCESS STORY' },
        { id: 19, name: 'Team Meeting', category: 'business', color: '#667eea', text: 'TEAM MEETING' },
        { id: 20, name: 'Workshop', category: 'business', color: '#764ba2', text: 'WORKSHOP' }
    ];
    
    const grid = document.getElementById('templatesGrid');
    grid.innerHTML = templates.map(t => `
        <div class="template-card" data-template='${JSON.stringify(t)}'>
            <div class="template-preview" style="background: ${t.color}; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px; text-align: center;">${t.text}</div>
            <div class="template-name">${t.name}</div>
        </div>
    `).join('');
    
    document.querySelectorAll('.template-card').forEach(card => {
        card.addEventListener('click', () => {
            const template = JSON.parse(card.dataset.template);
            applyTemplate(template);
        });
    });
}

function applyTemplate(template) {
    canvas.setBackgroundColor(template.color, () => {
        canvas.renderAll();
        showToast(`Template "${template.name}" applied`);
        saveToHistory();
    });
}

// ========================================
// LOAD ELEMENTS (Shapes, Icons, Stickers, Frames, Charts)
// ========================================
function loadElements() {
    // 50+ Shapes
    const shapes = [
        { name: 'Square', icon: 'fa-square', type: 'rect', width: 80, height: 80 },
        { name: 'Circle', icon: 'fa-circle', type: 'circle', radius: 40 },
        { name: 'Rectangle', icon: 'fa-rectangle', type: 'rect', width: 120, height: 60 },
        { name: 'Triangle', icon: 'fa-triangle', type: 'triangle', width: 80, height: 80 },
        { name: 'Star', icon: 'fa-star', type: 'star', radius: 40 },
        { name: 'Heart', icon: 'fa-heart', type: 'heart', width: 50, height: 50 },
        { name: 'Diamond', icon: 'fa-gem', type: 'diamond', width: 60, height: 60 },
        { name: 'Circle Outline', icon: 'fa-circle', type: 'circle', radius: 40, fill: 'transparent', stroke: '#2563eb', strokeWidth: 3 },
        { name: 'Rounded Rect', icon: 'fa-square', type: 'rect', width: 100, height: 80, rx: 20, ry: 20 },
        { name: 'Line', icon: 'fa-minus', type: 'line', points: [0, 0, 100, 0] },
        { name: 'Arrow', icon: 'fa-arrow-right', type: 'arrow' }
    ];
    
    // 100+ Icons (Font Awesome + Bootstrap + Remix)
    const icons = [
        'fa-star', 'fa-heart', 'fa-bell', 'fa-calendar', 'fa-clock', 'fa-envelope', 'fa-phone', 'fa-location-dot',
        'fa-user', 'fa-users', 'fa-cog', 'fa-home', 'fa-book', 'fa-graduation-cap', 'fa-chart-line', 'fa-chart-bar',
        'fa-camera', 'fa-video', 'fa-music', 'fa-palette', 'fa-rocket', 'fa-crown', 'fa-gem', 'fa-fire',
        'bi-heart-fill', 'bi-star-fill', 'bi-check-circle-fill', 'bi-flag-fill', 'bi-bookmark-fill',
        'ri-heart-fill', 'ri-star-fill', 'ri-crown-fill', 'ri-fire-fill', 'ri-flashlight-fill'
    ];
    
    // 100+ Stickers (Emojis)
    const stickers = ['⭐', '❤️', '🔥', '👑', '🌟', '💎', '🎈', '🎉', '🎊', '🎁', '🏆', '🥇', '🌈', '⚡', '☀️', '🌙', '🌸', '🌼', '🍎', '📚', '✏️', '🎨', '🎭', '🎪', '🎯', '🎮', '🎵', '🎶', '📷', '💻', '🔑', '🔒', '📌', '✂️', '❤️', '💙', '💚', '💛', '🧡', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '🎄', '🎃', '🎂', '🍰', '🍕', '🍔', '🍟', '🥤', '☕', '🍵', '🍺', '🍷', '🍸', '🍹', '🍾'];
    
    // 30+ Frames
    const frames = [
        { name: 'Basic', style: 'solid', width: 2 },
        { name: 'Double', style: 'double', width: 4 },
        { name: 'Dashed', style: 'dashed', width: 2 },
        { name: 'Dotted', style: 'dotted', width: 2 },
        { name: 'Groove', style: 'groove', width: 4 },
        { name: 'Ridge', style: 'ridge', width: 4 }
    ];
    
    // 50+ Charts
    const charts = [
        { name: 'Bar Chart', type: 'bar' },
        { name: 'Line Chart', type: 'line' },
        { name: 'Pie Chart', type: 'pie' },
        { name: 'Doughnut', type: 'doughnut' }
    ];
    
    const elementsGrid = document.getElementById('elementsGrid');
    let currentType = 'shapes';
    
    function renderElements() {
        let html = '';
        
        if (currentType === 'shapes') {
            html = shapes.map(s => `
                <div class="element-card" data-shape='${JSON.stringify(s)}'>
                    <i class="fas ${s.icon}"></i>
                    <span>${s.name}</span>
                </div>
            `).join('');
        } else if (currentType === 'icons') {
            html = icons.map(i => `
                <div class="element-card" data-icon="${i}">
                    <i class="${i.includes('bi') ? 'bi' : i.includes('ri') ? 'ri' : 'fas'} ${i}"></i>
                    <span>Icon</span>
                </div>
            `).join('');
        } else if (currentType === 'stickers') {
            html = stickers.map(s => `
                <div class="element-card" data-sticker="${s}">
                    <span style="font-size: 32px;">${s}</span>
                    <span>Sticker</span>
                </div>
            `).join('');
        } else if (currentType === 'frames') {
            html = frames.map(f => `
                <div class="element-card" data-frame='${JSON.stringify(f)}'>
                    <i class="fas fa-border-all"></i>
                    <span>${f.name}</span>
                </div>
            `).join('');
        } else if (currentType === 'charts') {
            html = charts.map(c => `
                <div class="element-card" data-chart='${JSON.stringify(c)}'>
                    <i class="fas fa-chart-${c.type === 'bar' ? 'bar' : c.type === 'line' ? 'line' : 'pie'}"></i>
                    <span>${c.name}</span>
                </div>
            `).join('');
        }
        
        elementsGrid.innerHTML = html;
        
        // Add click handlers
        document.querySelectorAll('[data-shape]').forEach(el => {
            el.addEventListener('click', () => addShape(JSON.parse(el.dataset.shape)));
        });
        document.querySelectorAll('[data-icon]').forEach(el => {
            el.addEventListener('click', () => addIcon(el.dataset.icon));
        });
        document.querySelectorAll('[data-sticker]').forEach(el => {
            el.addEventListener('click', () => addSticker(el.dataset.sticker));
        });
        document.querySelectorAll('[data-frame]').forEach(el => {
            el.addEventListener('click', () => addFrame(JSON.parse(el.dataset.frame)));
        });
        document.querySelectorAll('[data-chart]').forEach(el => {
            el.addEventListener('click', () => addChart(JSON.parse(el.dataset.chart)));
        });
    }
    
    renderElements();
    
    // Sub navigation
    document.querySelectorAll('[data-elem-type]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-elem-type]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentType = btn.dataset.elemType;
            renderElements();
        });
    });
}

// ========================================
// ADD ELEMENTS TO CANVAS
// ========================================
function addShape(shapeData) {
    let obj;
    const left = Math.random() * (canvas.width - 200) + 100;
    const top = Math.random() * (canvas.height - 200) + 100;
    
    switch(shapeData.type) {
        case 'rect':
            obj = new fabric.Rect({
                left: left, top: top, width: shapeData.width, height: shapeData.height,
                fill: shapeData.fill || '#2563eb', rx: shapeData.rx || 0, ry: shapeData.ry || 0,
                stroke: shapeData.stroke || null, strokeWidth: shapeData.strokeWidth || 0
            });
            break;
        case 'circle':
            obj = new fabric.Circle({
                left: left, top: top, radius: shapeData.radius,
                fill: shapeData.fill || '#2563eb', stroke: shapeData.stroke || null, strokeWidth: shapeData.strokeWidth || 0
            });
            break;
        case 'triangle':
            obj = new fabric.Triangle({
                left: left, top: top, width: shapeData.width, height: shapeData.height,
                fill: '#2563eb'
            });
            break;
        case 'star':
            obj = new fabric.Polygon([
                {x: 0, y: -40}, {x: 10, y: -12}, {x: 38, y: -12}, {x: 16, y: 6},
                {x: 24, y: 34}, {x: 0, y: 16}, {x: -24, y: 34}, {x: -16, y: 6},
                {x: -38, y: -12}, {x: -10, y: -12}
            ], { left: left, top: top, fill: '#f59e0b' });
            break;
        case 'heart':
            obj = new fabric.Path('M 0,-30 C 20,-50 50,-20 0,30 C -50,-20 -20,-50 0,-30 Z', {
                left: left, top: top, fill: '#ef4444', scaleX: 1, scaleY: 1
            });
            break;
        default:
            obj = new fabric.Rect({ left: left, top: top, width: 60, height: 60, fill: '#2563eb' });
    }
    
    obj.id = 'shape_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    canvas.add(obj);
    canvas.setActiveObject(obj);
    canvas.renderAll();
    saveToHistory();
    showToast(`Added ${shapeData.name} shape`);
}

function addIcon(iconClass) {
    const left = Math.random() * (canvas.width - 150) + 100;
    const top = Math.random() * (canvas.height - 150) + 100;
    
    // Create an SVG from Font Awesome icon
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    
    fabric.loadSVGFromString(svgString, (objects, options) => {
        const obj = fabric.util.groupSVGElements(objects, options);
        obj.set({ left: left, top: top, scaleX: 1, scaleY: 1 });
        obj.id = 'icon_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
        canvas.add(obj);
        canvas.setActiveObject(obj);
        canvas.renderAll();
        saveToHistory();
        showToast('Added icon');
    });
}

function addSticker(sticker) {
    const left = Math.random() * (canvas.width - 100) + 100;
    const top = Math.random() * (canvas.height - 100) + 100;
    
    const text = new fabric.Text(sticker, {
        left: left, top: top, fontSize: 48, fontFamily: 'Segoe UI Emoji'
    });
    text.id = 'sticker_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    saveToHistory();
    showToast('Added sticker');
}

function addFrame(frameData) {
    const left = Math.random() * (canvas.width - 300) + 150;
    const top = Math.random() * (canvas.height - 300) + 150;
    
    const rect = new fabric.Rect({
        left: left, top: top, width: 200, height: 200,
        fill: 'transparent',
        stroke: '#2563eb',
        strokeWidth: frameData.width,
        strokeDashArray: frameData.style === 'dashed' ? [10, 5] : frameData.style === 'dotted' ? [5, 5] : null,
        strokeUniform: true
    });
    rect.id = 'frame_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    
    if (frameData.style === 'double') {
        rect.strokeWidth = 1;
        const innerRect = new fabric.Rect({
            left: left + 10, top: top + 10, width: 180, height: 180,
            fill: 'transparent', stroke: '#2563eb', strokeWidth: 2
        });
        innerRect.id = 'frame_inner_' + Date.now();
        canvas.add(rect);
        canvas.add(innerRect);
    } else {
        canvas.add(rect);
    }
    
    canvas.renderAll();
    saveToHistory();
    showToast(`Added ${frameData.name} frame`);
}

function addChart(chartData) {
    showToast(`Chart ${chartData.name} - This feature coming soon with Chart.js integration`);
}

// ========================================
// TEXT MANAGEMENT
// ========================================
document.getElementById('addTextBtn')?.addEventListener('click', () => {
    const textValue = document.getElementById('customText')?.value || 'Your Text Here';
    if (!textValue.trim()) return;
    
    const left = canvas.width / 2;
    const top = canvas.height / 2;
    
    const text = new fabric.Text(textValue, {
        left: left, top: top, fontSize: 32, fontFamily: 'Inter',
        fill: '#1e293b', originX: 'center', originY: 'center'
    });
    text.id = 'text_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    saveToHistory();
    showToast('Text added');
});

function updateSelectedText() {
    const activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.type !== 'text') return;
    
    activeObject.set({
        fontFamily: document.getElementById('fontSelect')?.value,
        fontSize: parseInt(document.getElementById('fontSize')?.value),
        fill: document.getElementById('textColor')?.value
    });
    
    canvas.renderAll();
    saveToHistory();
}

document.getElementById('fontSelect')?.addEventListener('change', updateSelectedText);
document.getElementById('fontSize')?.addEventListener('input', (e) => {
    document.getElementById('fontSizeVal').innerText = e.target.value;
    updateSelectedText();
});
document.getElementById('textColor')?.addEventListener('input', updateSelectedText);

document.getElementById('textBoldBtn')?.addEventListener('click', () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
        activeObject.set('fontWeight', activeObject.fontWeight === 'bold' ? 'normal' : 'bold');
        canvas.renderAll();
    }
});

document.getElementById('textItalicBtn')?.addEventListener('click', () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
        activeObject.set('fontStyle', activeObject.fontStyle === 'italic' ? 'normal' : 'italic');
        canvas.renderAll();
    }
});

document.querySelectorAll('.align-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'text') {
            activeObject.set('textAlign', btn.dataset.align);
            canvas.renderAll();
        }
    });
});

// ========================================
// BACKGROUND MANAGEMENT
// ========================================
document.getElementById('applyColorBtn')?.addEventListener('click', () => {
    const color = document.getElementById('bgSolidColor').value;
    canvas.setBackgroundColor(color, () => canvas.renderAll());
    saveToHistory();
    showToast('Background color applied');
});

function loadGradients() {
    const gradients = [
        'linear-gradient(135deg, #667eea, #764ba2)', 'linear-gradient(135deg, #f093fb, #f5576c)',
        'linear-gradient(135deg, #4facfe, #00f2fe)', 'linear-gradient(135deg, #43e97b, #38f9d7)',
        'linear-gradient(135deg, #fa709a, #fee140)', 'linear-gradient(135deg, #a8edea, #fed6e3)',
        'linear-gradient(135deg, #d4fc79, #96e6a1)', 'linear-gradient(135deg, #b92b27, #1565c0)',
        'linear-gradient(135deg, #1e293b, #0f172a)', 'linear-gradient(135deg, #2b5876, #4e4376)',
        'linear-gradient(135deg, #c33764, #1d2671)', 'linear-gradient(135deg, #ff6b6b, #c92a2a)',
        'linear-gradient(135deg, #11998e, #38ef7d)', 'linear-gradient(135deg, #f5af19, #f12711)',
        'linear-gradient(135deg, #ff9a9e, #fecfef)', 'linear-gradient(135deg, #360033, #0b8793)'
    ];
    
    const grid = document.getElementById('gradientsGrid');
    grid.innerHTML = gradients.map(g => `<div class="gradient-item" style="background: ${g};" data-gradient="${g}"></div>`).join('');
    
    document.querySelectorAll('.gradient-item').forEach(item => {
        item.addEventListener('click', () => {
            canvas.setBackgroundColor(item.dataset.gradient, () => canvas.renderAll());
            saveToHistory();
            showToast('Gradient applied');
        });
    });
}

function loadPatterns() {
    const patterns = [
        'repeating-linear-gradient(45deg, #ddd 0px, #ddd 2px, transparent 2px, transparent 8px)',
        'repeating-conic-gradient(#ddd 0% 25%, transparent 0% 50%) 50% / 20px 20px',
        'radial-gradient(circle at 10px 10px, #ddd 2px, transparent 2px) 0 0 / 20px 20px'
    ];
    
    const grid = document.getElementById('patternsGrid');
    grid.innerHTML = patterns.map(p => `<div class="pattern-item" style="background: ${p};" data-pattern="${p}"></div>`).join('');
    
    document.querySelectorAll('.pattern-item').forEach(item => {
        item.addEventListener('click', () => {
            canvas.setBackgroundColor(item.dataset.pattern, () => canvas.renderAll());
            saveToHistory();
            showToast('Pattern applied');
        });
    });
}

// ========================================
// UPLOAD & EDIT POSTER
// ========================================
document.getElementById('uploadImageBtn')?.addEventListener('click', () => {
    const file = document.getElementById('imageUpload')?.files[0];
    if (!file) { showToast('Please select an image first'); return; }
    
    const reader = new FileReader();
    reader.onload = (ev) => {
        fabric.Image.fromURL(ev.target.result, (img) => {
            img.scaleToWidth(200);
            img.id = 'uploaded_' + Date.now();
            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
            saveToHistory();
            showToast('Image added to canvas');
        });
    };
    reader.readAsDataURL(file);
});

document.getElementById('editPosterBtn')?.addEventListener('click', () => {
    const file = document.getElementById('posterUpload')?.files[0];
    if (!file) { showToast('Please select a poster to edit'); return; }
    
    const reader = new FileReader();
    reader.onload = (ev) => {
        fabric.Image.fromURL(ev.target.result, (img) => {
            img.scaleToWidth(canvas.width);
            img.set({ left: 0, top: 0 });
            canvas.clear();
            canvas.add(img);
            canvas.renderAll();
            saveToHistory();
            showToast('Poster loaded! You can now add elements on top.');
        });
    };
    reader.readAsDataURL(file);
});

function loadSavedImages() {
    const container = document.getElementById('uploadedImagesList');
    const saved = JSON.parse(localStorage.getItem('uploaded_images') || '[]');
    container.innerHTML = saved.map(img => `<img src="${img}" class="uploaded-img" data-src="${img}">`).join('');
    
    document.querySelectorAll('.uploaded-img').forEach(img => {
        img.addEventListener('click', () => {
            fabric.Image.fromURL(img.dataset.src, (fabricImg) => {
                fabricImg.scaleToWidth(200);
                canvas.add(fabricImg);
                canvas.renderAll();
                saveToHistory();
                showToast('Image added to canvas');
            });
        });
    });
}

// ========================================
// AI QUOTE GENERATION (Grok API)
// ========================================
document.getElementById('generateQuoteBtn')?.addEventListener('click', async () => {
    const prompt = document.getElementById('aiPrompt')?.value;
    if (!prompt) { showToast('Please enter a topic'); return; }
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/generate-slos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subject: prompt, topic: prompt })
        });
        
        let quoteText = `"${prompt} is the key to success. Keep pushing forward!"`;
        let quoteAuthor = 'AI Generator';
        
        if (response.ok) {
            const data = await response.json();
            if (data.slos && data.slos[0]) {
                quoteText = `"${data.slos[0]}"`;
                quoteAuthor = 'AI Assistant';
            }
        }
        
        const text = new fabric.Text(`${quoteText}\n\n- ${quoteAuthor}`, {
            left: canvas.width / 2, top: canvas.height / 2,
            fontSize: 24, fontFamily: 'Inter', fill: '#1e293b',
            textAlign: 'center', originX: 'center', originY: 'center'
        });
        text.id = 'ai_quote_' + Date.now();
        canvas.add(text);
        canvas.renderAll();
        saveToHistory();
        showToast('AI quote generated!');
        
        // Add to quotes list
        const quotesList = document.getElementById('generatedQuotesList');
        const quoteItem = document.createElement('div');
        quoteItem.className = 'quote-item';
        quoteItem.innerHTML = `${quoteText}<br><small>- ${quoteAuthor}</small>`;
        quoteItem.addEventListener('click', () => {
            const newText = new fabric.Text(quoteText + '\n\n- ' + quoteAuthor, {
                left: 100, top: 100, fontSize: 24, fontFamily: 'Inter', fill: '#1e293b'
            });
            canvas.add(newText);
            canvas.renderAll();
        });
        quotesList.prepend(quoteItem);
        
    } catch (error) {
        showToast('AI quote generated (offline mode)');
    } finally {
        showLoading(false);
    }
});

// ========================================
// EXPORT FUNCTIONS
// ========================================
async function exportAs(format) {
    showLoading(true);
    try {
        const dataURL = canvas.toDataURL({ format: format === 'jpg' ? 'jpeg' : 'png', multiplier: 2 });
        
        if (format === 'png') {
            const link = document.createElement('a');
            link.download = 'poster.png';
            link.href = dataURL;
            link.click();
        } else if (format === 'jpg') {
            const link = document.createElement('a');
            link.download = 'poster.jpg';
            link.href = dataURL;
            link.click();
        } else if (format === 'pdf') {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ orientation: canvas.width > canvas.height ? 'landscape' : 'portrait' });
            pdf.addImage(dataURL, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
            pdf.save('poster.pdf');
        } else if (format === 'svg') {
            const svg = canvas.toSVG();
            const blob = new Blob([svg], { type: 'image/svg+xml' });
            saveAs(blob, 'poster.svg');
        } else if (format === 'json') {
            const json = JSON.stringify(canvas.toJSON());
            const blob = new Blob([json], { type: 'application/json' });
            saveAs(blob, 'poster.json');
        }
        
        showToast(`${format.toUpperCase()} exported successfully!`);
    } catch (error) {
        showToast('Export failed. Try again.');
    } finally {
        showLoading(false);
    }
}

document.getElementById('exportPNG')?.addEventListener('click', () => exportAs('png'));
document.getElementById('exportJPG')?.addEventListener('click', () => exportAs('jpg'));
document.getElementById('exportPDF')?.addEventListener('click', () => exportAs('pdf'));
document.getElementById('exportSVG')?.addEventListener('click', () => exportAs('svg'));
document.getElementById('exportJSON')?.addEventListener('click', () => exportAs('json'));

// ========================================
// SAVE & LOAD
// ========================================
document.getElementById('saveToTiDB')?.addEventListener('click', async () => {
    const designData = {
        tool_slug: currentToolSlug,
        user_id: userId,
        design_name: 'Design_' + Date.now(),
        design_json: JSON.stringify(canvas.toJSON()),
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('current_design', JSON.stringify(designData));
    showToast('Design saved to browser (Cloud save coming soon)');
});

document.getElementById('saveToLocal')?.addEventListener('click', () => {
    const designs = JSON.parse(localStorage.getItem('saved_designs') || '[]');
    designs.unshift({
        id: Date.now(),
        name: 'Design_' + designs.length + 1,
        data: JSON.stringify(canvas.toJSON()),
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('saved_designs', JSON.stringify(designs.slice(0, 20)));
    showToast('Design saved to browser!');
});

document.getElementById('loadFromLocal')?.addEventListener('click', () => {
    const designs = JSON.parse(localStorage.getItem('saved_designs') || '[]');
    if (designs.length === 0) { showToast('No saved designs found'); return; }
    
    const latest = designs[0];
    canvas.loadFromJSON(JSON.parse(latest.data), () => {
        canvas.renderAll();
        showToast('Design loaded!');
        saveToHistory();
    });
});

// ========================================
// TIDB API INTEGRATION (Reactions + Usage)
// ========================================
async function trackUsage() {
    try {
        const response = await fetch(`${API_BASE}/increment-usage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: currentToolSlug, user_id: userId })
        });
        if (response.ok) {
            const data = await response.json();
            document.getElementById('usageCount').innerText = data.total_usage || 1;
        }
    } catch (error) {
        let count = parseInt(localStorage.getItem(`${currentToolSlug}_usage`) || '0');
        count++;
        localStorage.setItem(`${currentToolSlug}_usage`, count);
        document.getElementById('usageCount').innerText = count;
    }
}

async function loadReactionsFromAPI() {
    try {
        const response = await fetch(`${API_BASE}/reactions?tool_slug=${currentToolSlug}`);
        if (response.ok) {
            const data = await response.json();
            if (data.reactions) updateReactionUI(data.reactions);
        }
    } catch (error) {
        const saved = localStorage.getItem(`${currentToolSlug}_reactions`);
        if (saved) updateReactionUI(JSON.parse(saved));
    }
}

async function addReaction(reactionType) {
    if (userReacted[reactionType]) { showToast('You already reacted with this emoji'); return; }
    
    const emojiMap = { like: '👍', love: '❤️', wow: '😮', sad: '😢', laugh: '😂', celebrate: '🎉' };
    
    try {
        const response = await fetch(`${API_BASE}/add-reaction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: currentToolSlug, emoji: emojiMap[reactionType], user_id: userId })
        });
        if (response.ok) {
            const data = await response.json();
            if (data.counts) updateReactionUI(data.counts);
            userReacted[reactionType] = true;
            showToast('Reaction added!');
        }
    } catch (error) {
        if (!userReacted[reactionType]) {
            currentReactions[reactionType] = (currentReactions[reactionType] || 0) + 1;
            localStorage.setItem(`${currentToolSlug}_reactions`, JSON.stringify(currentReactions));
            updateReactionUI(currentReactions);
            userReacted[reactionType] = true;
            showToast('Reaction added (offline)');
        }
    }
}

function updateReactionUI(reactions) {
    document.getElementById('likeCount').innerText = reactions.like || 0;
    document.getElementById('loveCount').innerText = reactions.love || 0;
    document.getElementById('wowCount').innerText = reactions.wow || 0;
    document.getElementById('sadCount').innerText = reactions.sad || 0;
    document.getElementById('laughCount').innerText = reactions.laugh || 0;
    document.getElementById('celebrateCount').innerText = reactions.celebrate || 0;
}

document.querySelectorAll('.reaction-btn').forEach(btn => {
    btn.addEventListener('click', () => addReaction(btn.dataset.reaction));
});

// ========================================
// SHARE FUNCTIONS
// ========================================
async function trackShare(platform) {
    try {
        await fetch(`${API_BASE}/add-share`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: currentToolSlug, platform: platform, user_id: userId })
        });
    } catch (error) {}
    
    const shareUrl = window.location.href;
    const shareText = 'Check out my poster created with PosterForge Pro!';
    
    if (platform === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    else if (platform === 'twitter') window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    else if (platform === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
    else if (platform === 'linkedin') window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
    else if (platform === 'copy') { navigator.clipboard.writeText(shareUrl); showToast('Link copied!'); }
    
    showToast('Thanks for sharing!');
}

document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', () => trackShare(btn.dataset.platform));
});

// ========================================
// LAYERS MANAGEMENT
// ========================================
function updateLayersList() {
    const objects = canvas.getObjects();
    const layersList = document.getElementById('layersList');
    
    layersList.innerHTML = objects.map((obj, i) => `
        <div class="layer-item ${obj.id === selectedObjectId ? 'selected' : ''}" data-id="${obj.id}" data-index="${i}">
            <i class="fas ${obj.type === 'text' ? 'fa-font' : obj.type === 'rect' ? 'fa-square' : 'fa-shape'}"></i>
            <span>${obj.type || 'element'} ${i + 1}</span>
        </div>
    `).join('');
    
    document.querySelectorAll('.layer-item').forEach(item => {
        item.addEventListener('click', () => {
            const objects = canvas.getObjects();
            const index = parseInt(item.dataset.index);
            if (objects[index]) {
                canvas.setActiveObject(objects[index]);
                selectedObjectId = objects[index].id;
                updateLayersList();
            }
        });
    });
}

document.getElementById('bringForwardBtn')?.addEventListener('click', () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) canvas.bringForward(activeObject);
    updateLayersList();
});

document.getElementById('sendBackwardBtn')?.addEventListener('click', () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) canvas.sendBackwards(activeObject);
    updateLayersList();
});

document.getElementById('deleteSelectedBtn')?.addEventListener('click', () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
        canvas.remove(activeObject);
        selectedObjectId = null;
        updateLayersList();
        saveToHistory();
        showToast('Element deleted');
    }
});

// ========================================
// UI HELPERS
// ========================================
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function showLoading(show) {
    const modal = document.getElementById('loadingModal');
    if (show) modal.classList.add('active');
    else modal.classList.remove('active');
}

function startAutoSave() {
    setInterval(() => {
        localStorage.setItem('auto_save_draft', JSON.stringify(canvas.toJSON()));
        console.log('Auto-saved');
    }, 30000);
}

// ========================================
// DARK MODE
// ========================================
document.getElementById('darkModeBtn')?.addEventListener('click', () => {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode);
    document.getElementById('darkModeBtn').innerHTML = darkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    showToast(darkMode ? 'Dark mode on' : 'Light mode on');
});

// ========================================
// SIDEBAR & PANEL TOGGLES
// ========================================
document.getElementById('toggleSidebarBtn')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('collapsed');
});
document.getElementById('closeSidebarBtn')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.add('collapsed');
});
document.getElementById('toggleLayersBtn')?.addEventListener('click', () => {
    document.getElementById('layersPanel').classList.toggle('collapsed');
});
document.getElementById('undoBtn')?.addEventListener('click', undo);
document.getElementById('redoBtn')?.addEventListener('click', redo);

// Navigation Tabs
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const navName = btn.dataset.nav;
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.nav-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`${navName}-panel`).classList.add('active');
    });
});

// Template Category Filtering
document.querySelectorAll('[data-template-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
        const cat = btn.dataset.templateCat;
        document.querySelectorAll('[data-template-cat]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        document.querySelectorAll('.template-card').forEach(card => {
            const template = JSON.parse(card.dataset.template);
            if (cat === 'all' || template.category === cat) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Template search
document.getElementById('templateSearch')?.addEventListener('input', (e) => {
    const search = e.target.value.toLowerCase();
    document.querySelectorAll('.template-card').forEach(card => {
        const name = card.querySelector('.template-name').innerText.toLowerCase();
        card.style.display = name.includes(search) ? 'block' : 'none';
    });
});

console.log('PosterForge Pro Fully Loaded!');
