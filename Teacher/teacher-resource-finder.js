// ========================================
// TEACHER RESOURCE FINDER - POSTER DESIGNER PRO
// Fully Integrated: TiDB + Vercel + Grok API
// Templates: Dynamic (1-120) | Stickers: 1-104
// ========================================

let canvas = null;
let currentToolSlug = 'teacher-resource-finder';
let userId = localStorage.getItem('userId') || 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
let darkMode = localStorage.getItem('darkMode') === 'true';
let selectedObjectId = null;
let historyStates = [];
let historyIndex = -1;

// Reaction counts
let currentReactions = { like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0 };
let userReacted = { like: false, love: false, wow: false, sad: false, angry: false, laugh: false, celebrate: false };

// ========================================
// GITHUB CONFIGURATION
// ========================================
const GITHUB_BASE = 'https://raw.githubusercontent.com/Uzair-hameed/MagicRills.github.io/main/';
const TEMPLATES_BASE_URL = GITHUB_BASE + 'templates/';
const STICKERS_BASE_URL = GITHUB_BASE + 'stickers/';

// CLOUDFLARE WORKER API (from test-db.js)
const API_BASE = 'https://teacher-resource-finder.uzairhameed01.workers.dev/api';

// ========================================
// TEMPLATE NUMBERS (1 to 120 - Dynamic Discovery)
// Templates aage peeche hain, is liye sab try karenge
// ========================================
const MAX_TEMPLATE_NUMBER = 120;
let loadedTemplatesCount = 0;
let totalTemplatesFound = 0;

// ========================================
// STICKER NUMBERS (1 to 104 - Confirmed)
// ========================================
const TOTAL_STICKERS = 104;

// ========================================
// LOCAL QUOTES DATABASE (Fallback for AI)
// ========================================
const LOCAL_QUOTES = {
    education: [
        { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
        { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
        { text: "Education is not preparation for life; education is life itself.", author: "John Dewey" }
    ],
    love: [
        { text: "Where there is love there is life.", author: "Mahatma Gandhi" },
        { text: "Love is composed of a single soul inhabiting two bodies.", author: "Aristotle" }
    ],
    success: [
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" }
    ],
    islamic: [
        { text: "Indeed, Allah is with those who are patient.", author: "Quran" },
        { text: "The best among you are those who have the best manners and character.", author: "Prophet Muhammad (PBUH)" }
    ],
    default: [
        { text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
        { text: "Design is not just what it looks like and feels like. Design is how it works.", author: "Steve Jobs" }
    ]
};

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('========================================');
    console.log('Teacher Resource Finder - Initializing...');
    console.log('========================================');
    
    initializeCanvas();
    
    if (darkMode) {
        document.body.classList.add('dark-mode');
        const darkBtn = document.getElementById('darkModeBtn');
        if (darkBtn) darkBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    localStorage.setItem('userId', userId);
    
    // Load all components
    await loadAllTemplates();
    await loadAllStickers();
    loadElements();
    loadGradients();
    
    // Load stats from API
    await loadUsageFromAPI();
    await trackUsage();
    await loadReactionsFromAPI();
    await loadStatsFromAPI();
    
    setupEventListeners();
    saveToHistory();
    
    showToast('✨ Teacher Resource Finder Ready!');
});

// ========================================
// FABRIC.JS CANVAS
// ========================================
function initializeCanvas() {
    canvas = new fabric.Canvas('canvas', {
        width: 800,
        height: 1000,
        backgroundColor: '#ffffff',
        preserveObjectStacking: true,
        selection: true
    });
    
    // Welcome message
    const welcomeText = new fabric.Text('Teacher Resource Finder\n\nPoster Designer Pro\n\nClick on templates or stickers to start!\nDrag to move | Click to select | Use corners to resize/rotate', {
        left: 400,
        top: 450,
        fontSize: 18,
        fontFamily: 'Inter',
        fill: '#1e293b',
        textAlign: 'center',
        originX: 'center',
        originY: 'center'
    });
    canvas.add(welcomeText);
    canvas.renderAll();
    
    // Canvas events
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
    canvas.on('object:modified', () => saveToHistory());
    canvas.on('object:added', () => {
        saveToHistory();
        updateLayersList();
    });
    canvas.on('object:removed', () => {
        saveToHistory();
        updateLayersList();
    });
}

// ========================================
// LOAD ALL TEMPLATES (1 to 120 - Dynamic)
// Jo bhi mil jaye, load kar do
// ========================================
async function loadAllTemplates() {
    const grid = document.getElementById('templatesGrid');
    if (!grid) return;
    
    grid.innerHTML = '<div style="text-align:center; padding:20px;"><i class="fas fa-spinner fa-spin"></i> Loading templates (0 found)...</div>';
    
    let foundTemplates = [];
    
    for (let num = 1; num <= MAX_TEMPLATE_NUMBER; num++) {
        try {
            const url = `${TEMPLATES_BASE_URL}template${num}.json`;
            
            const response = await fetch(url);
            if (response.ok) {
                const templateData = await response.json();
                foundTemplates.push({ num, data: templateData });
                console.log(`✅ Template ${num} found`);
            } else {
                // Silent fail - template not found
            }
        } catch (error) {
            // Silent fail
        }
        
        // Update progress every 10 templates
        if (num % 10 === 0) {
            grid.innerHTML = `<div style="text-align:center; padding:20px;"><i class="fas fa-spinner fa-spin"></i> Loading templates (${foundTemplates.length} found so far)...</div>`;
        }
    }
    
    totalTemplatesFound = foundTemplates.length;
    loadedTemplatesCount = totalTemplatesFound;
    
    // Display templates
    grid.innerHTML = '';
    
    if (totalTemplatesFound === 0) {
        grid.innerHTML = '<div style="text-align:center; padding:20px; color: red;">❌ No templates found! Please check GitHub connection.</div>';
        return;
    }
    
    for (const template of foundTemplates) {
        const card = document.createElement('div');
        card.className = 'template-card';
        
        // Try to get preview from template data
        let previewIcon = '🎨';
        let previewColor = 'linear-gradient(135deg, #667eea, #764ba2)';
        
        if (template.data && template.data.objects && template.data.objects[0]) {
            const firstObj = template.data.objects[0];
            if (firstObj.fill) {
                previewColor = typeof firstObj.fill === 'string' ? firstObj.fill : previewColor;
            }
        }
        
        card.innerHTML = `
            <div class="template-preview" style="background: ${previewColor};">
                <span style="font-size: 40px;">${previewIcon}</span>
            </div>
            <div class="template-name">Template ${template.num}</div>
        `;
        
        card.addEventListener('click', () => loadTemplate(template.data, template.num));
        grid.appendChild(card);
    }
    
    console.log(`✅ Total templates loaded: ${totalTemplatesFound}`);
    showToast(`✅ ${totalTemplatesFound} templates loaded!`);
}

function loadTemplate(templateData, templateNum) {
    showLoading(true);
    try {
        // Check if it's valid fabric.js JSON
        if (templateData.objects || templateData.version) {
            canvas.loadFromJSON(templateData, () => {
                canvas.renderAll();
                saveToHistory();
                showToast(`✨ Template ${templateNum} loaded successfully!`);
                showLoading(false);
            }, (err) => {
                console.error('Error loading template:', err);
                createFallbackTemplate(templateNum);
                showLoading(false);
            });
        } else {
            // Create basic template from data
            createBasicTemplate(templateNum, templateData);
            showLoading(false);
        }
    } catch (error) {
        console.error(`Error with template ${templateNum}:`, error);
        createFallbackTemplate(templateNum);
        showLoading(false);
    }
}

function createFallbackTemplate(num) {
    canvas.clear();
    
    const gradient = new fabric.Gradient({
        type: 'linear',
        coords: { x1: 0, y1: 0, x2: canvas.width, y2: canvas.height },
        colorStops: [
            { offset: 0, color: '#2563eb' },
            { offset: 1, color: '#1e293b' }
        ]
    });
    
    canvas.setBackgroundColor(gradient, () => {
        const title = new fabric.Text(`Template ${num}`, {
            left: canvas.width / 2,
            top: canvas.height / 2 - 50,
            fontSize: 36,
            fontFamily: 'Inter',
            fill: '#ffffff',
            textAlign: 'center',
            originX: 'center',
            fontWeight: 'bold'
        });
        
        const subtitle = new fabric.Text('Teacher Resource Finder - Click to edit text', {
            left: canvas.width / 2,
            top: canvas.height / 2 + 30,
            fontSize: 18,
            fontFamily: 'Inter',
            fill: '#cccccc',
            textAlign: 'center',
            originX: 'center'
        });
        
        canvas.add(title, subtitle);
        canvas.renderAll();
        saveToHistory();
        showToast(`✨ Template ${num} loaded!`);
    });
}

function createBasicTemplate(num, data) {
    canvas.clear();
    canvas.setBackgroundColor('#f0f0f0', () => {
        const title = new fabric.Text(data.title || `Template ${num}`, {
            left: canvas.width / 2,
            top: 100,
            fontSize: 32,
            fontFamily: 'Inter',
            fill: '#1e293b',
            textAlign: 'center',
            originX: 'center'
        });
        canvas.add(title);
        canvas.renderAll();
        saveToHistory();
        showToast(`✨ Template ${num} loaded!`);
    });
}

// ========================================
// LOAD ALL STICKERS (1 to 104)
// ========================================
async function loadAllStickers() {
    const stickersContainer = document.getElementById('stickersGrid');
    if (!stickersContainer) return;
    
    stickersContainer.innerHTML = '<div class="stickers-title"><i class="fas fa-smile"></i> Stickers Collection (1-104)</div>';
    const container = document.createElement('div');
    container.className = 'stickers-grid';
    
    let loadedCount = 0;
    
    for (let i = 1; i <= TOTAL_STICKERS; i++) {
        const url = `${STICKERS_BASE_URL}sticker${i}.png.png`;
        
        const div = document.createElement('div');
        div.className = 'sticker-item';
        div.innerHTML = `<div class="sticker-loading"><i class="fas fa-spinner fa-spin"></i></div><span>Sticker ${i}</span>`;
        
        const img = new Image();
        
        img.onload = () => {
            div.innerHTML = `<img src="${url}" alt="Sticker ${i}"><span>Sticker ${i}</span>`;
            div.addEventListener('click', () => addStickerToCanvas(url, i));
            loadedCount++;
        };
        
        img.onerror = () => {
            // Try without double extension
            const fallbackUrl = `${STICKERS_BASE_URL}sticker${i}.png`;
            const fallbackImg = new Image();
            fallbackImg.onload = () => {
                div.innerHTML = `<img src="${fallbackUrl}" alt="Sticker ${i}"><span>Sticker ${i}</span>`;
                div.addEventListener('click', () => addStickerToCanvas(fallbackUrl, i));
                loadedCount++;
            };
            fallbackImg.onerror = () => {
                div.innerHTML = `<div style="font-size: 32px;">🎨</div><span>Sticker ${i}</span>`;
                div.addEventListener('click', () => addEmojiFallback(i));
                loadedCount++;
            };
            fallbackImg.src = fallbackUrl;
        };
        
        img.src = url;
        container.appendChild(div);
    }
    
    stickersContainer.appendChild(container);
    
    setTimeout(() => {
        console.log(`✅ Stickers loaded: ${loadedCount}`);
        showToast(`✅ ${loadedCount} stickers loaded!`);
    }, 3000);
}

function addStickerToCanvas(url, num) {
    showLoading(true);
    fabric.Image.fromURL(url, (img) => {
        if (img) {
            img.scaleToWidth(120);
            img.set({
                left: canvas.width / 2 - 60,
                top: canvas.height / 2 - 60,
                id: 'sticker_' + Date.now()
            });
            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
            saveToHistory();
            showToast(`✅ Sticker ${num} added!`);
        } else {
            addEmojiFallback(num);
        }
        showLoading(false);
    }, () => {
        addEmojiFallback(num);
        showLoading(false);
    });
}

function addEmojiFallback(num) {
    const emojis = ['⭐', '❤️', '🔥', '👑', '🌟', '💎', '🎈', '🎉', '🎁', '🏆', '🌈', '⚡', '☀️', '🌙', '🌸', '🍎', '📚', '✏️', '🔬', '🎨'];
    const emoji = emojis[num % emojis.length];
    const text = new fabric.Text(emoji, {
        left: canvas.width / 2 - 30,
        top: canvas.height / 2 - 30,
        fontSize: 64,
        fontFamily: 'Segoe UI Emoji',
        id: 'sticker_fallback_' + Date.now()
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    saveToHistory();
    showToast(`✅ Sticker ${num} added!`);
}

// ========================================
// ELEMENTS (Shapes, Icons, Frames)
// ========================================
function loadElements() {
    const shapes = [
        { name: 'Square', icon: 'fa-square', type: 'rect', w: 80, h: 80, color: '#2563eb' },
        { name: 'Circle', icon: 'fa-circle', type: 'circle', r: 40, color: '#2563eb' },
        { name: 'Rectangle', icon: 'fa-rectangle-ad', type: 'rect', w: 120, h: 60, color: '#2563eb' },
        { name: 'Triangle', icon: 'fa-triangle-exclamation', type: 'triangle', w: 80, h: 80, color: '#f59e0b' },
        { name: 'Star', icon: 'fa-star', type: 'star', color: '#f59e0b' },
        { name: 'Heart', icon: 'fa-heart', type: 'heart', color: '#ef4444' },
        { name: 'Diamond', icon: 'fa-gem', type: 'diamond', color: '#10b981' }
    ];
    
    const icons = [
        'fa-star', 'fa-heart', 'fa-bell', 'fa-calendar', 'fa-clock',
        'fa-envelope', 'fa-phone', 'fa-user', 'fa-book', 'fa-graduation-cap'
    ];
    
    const frames = [
        { name: 'Basic', style: 'solid', width: 3, color: '#2563eb' },
        { name: 'Dashed', style: 'dashed', width: 2, color: '#ef4444' },
        { name: 'Dotted', style: 'dotted', width: 2, color: '#10b981' }
    ];
    
    const grid = document.getElementById('elementsGrid');
    let currentType = 'shapes';
    
    function renderElements() {
        let html = '';
        if (currentType === 'shapes') {
            html = shapes.map(s => `<div class="element-card" data-shape='${JSON.stringify(s)}'><i class="fas ${s.icon}"></i><span>${s.name}</span></div>`).join('');
        } else if (currentType === 'icons') {
            html = icons.map(i => `<div class="element-card" data-icon="${i}"><i class="fas ${i}"></i><span>Icon</span></div>`).join('');
        } else if (currentType === 'frames') {
            html = frames.map(f => `<div class="element-card" data-frame='${JSON.stringify(f)}'><i class="fas fa-border-all"></i><span>${f.name} Frame</span></div>`).join('');
        }
        grid.innerHTML = html;
        
        document.querySelectorAll('[data-shape]').forEach(el => {
            const shape = JSON.parse(el.dataset.shape);
            el.addEventListener('click', () => addShape(shape));
        });
        document.querySelectorAll('[data-icon]').forEach(el => {
            const icon = el.dataset.icon;
            el.addEventListener('click', () => addIcon(icon));
        });
        document.querySelectorAll('[data-frame]').forEach(el => {
            const frame = JSON.parse(el.dataset.frame);
            el.addEventListener('click', () => addFrame(frame));
        });
    }
    
    renderElements();
    
    document.querySelectorAll('[data-elem-type]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-elem-type]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentType = btn.dataset.elemType;
            renderElements();
        });
    });
}

function addShape(shape) {
    let obj;
    const left = Math.random() * (canvas.width - 200) + 100;
    const top = Math.random() * (canvas.height - 200) + 100;
    
    switch(shape.type) {
        case 'rect':
            obj = new fabric.Rect({ left, top, width: shape.w, height: shape.h, fill: shape.color });
            break;
        case 'circle':
            obj = new fabric.Circle({ left, top, radius: shape.r, fill: shape.color });
            break;
        case 'triangle':
            obj = new fabric.Triangle({ left, top, width: shape.w, height: shape.h, fill: shape.color });
            break;
        case 'star':
            const points = [];
            for (let i = 0; i < 10; i++) {
                const angle = (i * 36 - 90) * Math.PI / 180;
                const radius = i % 2 === 0 ? 40 : 20;
                points.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
            }
            obj = new fabric.Polygon(points, { left, top, fill: shape.color });
            break;
        case 'heart':
            obj = new fabric.Path('M 0,-30 C 20,-50 50,-20 0,30 C -50,-20 -20,-50 0,-30 Z', 
                { left, top, fill: shape.color, scaleX: 0.8, scaleY: 0.8 });
            break;
        case 'diamond':
            obj = new fabric.Polygon([
                { x: 0, y: -30 }, { x: 30, y: 0 }, { x: 0, y: 30 }, { x: -30, y: 0 }
            ], { left, top, fill: shape.color });
            break;
        default:
            obj = new fabric.Rect({ left, top, width: 60, height: 60, fill: '#2563eb' });
    }
    
    obj.id = 'shape_' + Date.now();
    canvas.add(obj);
    canvas.setActiveObject(obj);
    canvas.renderAll();
    saveToHistory();
    showToast(`✅ Added ${shape.name}`);
}

function addIcon(iconClass) {
    const iconMap = {
        'fa-star': '★', 'fa-heart': '❤️', 'fa-bell': '🔔', 'fa-calendar': '📅',
        'fa-clock': '🕐', 'fa-envelope': '✉️', 'fa-phone': '📞', 'fa-user': '👤',
        'fa-book': '📖', 'fa-graduation-cap': '🎓'
    };
    const char = iconMap[iconClass] || '◆';
    const left = Math.random() * (canvas.width - 150) + 100;
    const top = Math.random() * (canvas.height - 150) + 100;
    
    const text = new fabric.Text(char, { 
        left, top, fontSize: 48, fontFamily: 'Segoe UI Emoji', fill: '#2563eb' 
    });
    text.id = 'icon_' + Date.now();
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    saveToHistory();
    showToast('✅ Added icon');
}

function addFrame(frame) {
    const left = Math.random() * (canvas.width - 300) + 150;
    const top = Math.random() * (canvas.height - 300) + 150;
    
    const dashArray = frame.style === 'dashed' ? [10, 5] : frame.style === 'dotted' ? [5, 5] : null;
    
    const rect = new fabric.Rect({
        left, top, width: 200, height: 200,
        fill: 'transparent',
        stroke: frame.color,
        strokeWidth: frame.width,
        strokeDashArray: dashArray
    });
    rect.id = 'frame_' + Date.now();
    canvas.add(rect);
    canvas.renderAll();
    saveToHistory();
    showToast(`✅ Added ${frame.name} frame`);
}

// ========================================
// TEXT CUSTOMIZATION
// ========================================
document.getElementById('addTextBtn')?.addEventListener('click', () => {
    const textValue = document.getElementById('customText')?.value || 'Your Text Here';
    if (!textValue.trim()) return;
    
    const text = new fabric.Text(textValue, {
        left: canvas.width / 2,
        top: canvas.height / 2,
        fontSize: parseInt(document.getElementById('fontSize')?.value) || 32,
        fontFamily: document.getElementById('fontSelect')?.value || 'Inter',
        fill: document.getElementById('textColor')?.value || '#1e293b',
        originX: 'center',
        originY: 'center'
    });
    text.id = 'text_' + Date.now();
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    saveToHistory();
    showToast('✅ Text added');
});

function updateSelectedText() {
    const obj = canvas.getActiveObject();
    if (!obj || obj.type !== 'text') return;
    
    obj.set({
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
    const obj = canvas.getActiveObject();
    if (obj && obj.type === 'text') {
        obj.set('fontWeight', obj.fontWeight === 'bold' ? 'normal' : 'bold');
        canvas.renderAll();
        saveToHistory();
    }
});

document.getElementById('textItalicBtn')?.addEventListener('click', () => {
    const obj = canvas.getActiveObject();
    if (obj && obj.type === 'text') {
        obj.set('fontStyle', obj.fontStyle === 'italic' ? 'normal' : 'italic');
        canvas.renderAll();
        saveToHistory();
    }
});

document.getElementById('textUnderlineBtn')?.addEventListener('click', () => {
    const obj = canvas.getActiveObject();
    if (obj && obj.type === 'text') {
        obj.set('underline', !obj.underline);
        canvas.renderAll();
        saveToHistory();
    }
});

document.querySelectorAll('.align-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const obj = canvas.getActiveObject();
        if (obj && obj.type === 'text') {
            obj.set('textAlign', btn.dataset.align);
            canvas.renderAll();
            saveToHistory();
            showToast(`Text aligned ${btn.dataset.align}`);
        }
    });
});

// ========================================
// BACKGROUND MANAGEMENT
// ========================================
document.getElementById('applyColorBtn')?.addEventListener('click', () => {
    canvas.setBackgroundColor(document.getElementById('bgSolidColor').value, () => canvas.renderAll());
    saveToHistory();
    showToast('Background color applied');
});

document.getElementById('applyImageBtn')?.addEventListener('click', () => {
    const file = document.getElementById('bgImageUpload')?.files[0];
    if (!file) { showToast('Select an image first'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
        fabric.Image.fromURL(ev.target.result, (img) => {
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
            saveToHistory();
            showToast('Background image applied');
        });
    };
    reader.readAsDataURL(file);
});

function loadGradients() {
    const gradients = [
        'linear-gradient(135deg, #667eea, #764ba2)', 'linear-gradient(135deg, #f093fb, #f5576c)',
        'linear-gradient(135deg, #4facfe, #00f2fe)', 'linear-gradient(135deg, #43e97b, #38f9d7)',
        'linear-gradient(135deg, #1e293b, #0f172a)', 'linear-gradient(135deg, #ff6b6b, #c92a2a)',
        'linear-gradient(135deg, #11998e, #38ef7d)', 'linear-gradient(135deg, #f2994a, #f2c94c)'
    ];
    const grid = document.getElementById('gradientsGrid');
    if (grid) {
        grid.innerHTML = gradients.map(g => `<div class="gradient-item" style="background: ${g};" data-gradient="${g}"></div>`).join('');
        document.querySelectorAll('.gradient-item').forEach(item => {
            item.addEventListener('click', () => {
                canvas.setBackgroundColor(item.dataset.gradient, () => canvas.renderAll());
                saveToHistory();
                showToast('Gradient applied');
            });
        });
    }
}

// ========================================
// UPLOAD IMAGE
// ========================================
document.getElementById('uploadImageBtn')?.addEventListener('click', () => {
    const file = document.getElementById('imageUpload')?.files[0];
    if (!file) { showToast('Select an image first'); return; }
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
    if (!file) { showToast('Select a poster to edit'); return; }
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

// ========================================
// AI QUOTE GENERATION (Grok API + Fallback)
// ========================================
document.getElementById('generateQuoteBtn')?.addEventListener('click', async () => {
    const prompt = document.getElementById('aiPrompt')?.value;
    if (!prompt) { showToast('Please enter a topic'); return; }
    
    showLoading(true);
    
    try {
        // Try API first
        const response = await fetch(`${API_BASE}/generate-quote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt, tool_slug: currentToolSlug })
        });
        
        let quoteText = '';
        let quoteAuthor = '';
        
        if (response.ok) {
            const data = await response.json();
            quoteText = data.quote || data.text;
            quoteAuthor = data.author || 'Grok AI';
        } else {
            // Fallback to local quotes
            const fallback = getLocalQuote(prompt);
            quoteText = fallback.text;
            quoteAuthor = fallback.author;
        }
        
        const text = new fabric.Text(`"${quoteText}"\n\n- ${quoteAuthor}`, {
            left: canvas.width / 2,
            top: canvas.height / 2,
            fontSize: 24,
            fontFamily: 'Inter',
            fill: '#1e293b',
            textAlign: 'center',
            originX: 'center',
            originY: 'center',
            id: 'ai_quote_' + Date.now()
        });
        
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
        saveToHistory();
        showToast('✨ AI quote added to canvas!');
        
    } catch (error) {
        console.error('AI Quote error:', error);
        const fallback = getLocalQuote(prompt);
        const text = new fabric.Text(`"${fallback.text}"\n\n- ${fallback.author}`, {
            left: canvas.width / 2,
            top: canvas.height / 2,
            fontSize: 24,
            fontFamily: 'Inter',
            fill: '#1e293b',
            textAlign: 'center',
            originX: 'center',
            originY: 'center',
            id: 'ai_quote_' + Date.now()
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
        saveToHistory();
        showToast('✨ Quote added (offline mode)!');
    } finally {
        showLoading(false);
    }
});

function getLocalQuote(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    let category = 'default';
    
    if (lowerPrompt.includes('education') || lowerPrompt.includes('learn') || lowerPrompt.includes('school')) {
        category = 'education';
    } else if (lowerPrompt.includes('love') || lowerPrompt.includes('heart')) {
        category = 'love';
    } else if (lowerPrompt.includes('success')) {
        category = 'success';
    } else if (lowerPrompt.includes('islamic') || lowerPrompt.includes('allah')) {
        category = 'islamic';
    }
    
    const quotes = LOCAL_QUOTES[category] || LOCAL_QUOTES.default;
    return quotes[Math.floor(Math.random() * quotes.length)];
}

// ========================================
// UNDO / REDO
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
            showToast('↩️ Undo');
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
            showToast('↪️ Redo');
        });
    }
}

// ========================================
// LAYERS MANAGEMENT
// ========================================
function updateLayersList() {
    const objects = canvas.getObjects();
    const layersList = document.getElementById('layersList');
    if (!layersList) return;
    const activeObj = canvas.getActiveObject();
    layersList.innerHTML = objects.map((obj, i) => `
        <div class="layer-item ${obj === activeObj ? 'selected' : ''}" data-index="${i}">
            <i class="fas ${obj.type === 'text' ? 'fa-font' : 'fa-shape'}"></i>
            <span>${obj.type || 'element'} ${i + 1}</span>
        </div>
    `).join('');
    
    document.querySelectorAll('.layer-item').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index);
            canvas.setActiveObject(objects[index]);
            canvas.renderAll();
            updateLayersList();
        });
    });
}

document.getElementById('bringForwardBtn')?.addEventListener('click', () => {
    const obj = canvas.getActiveObject();
    if (obj) canvas.bringForward(obj);
    updateLayersList();
});

document.getElementById('sendBackwardBtn')?.addEventListener('click', () => {
    const obj = canvas.getActiveObject();
    if (obj) canvas.sendBackwards(obj);
    updateLayersList();
});

document.getElementById('deleteSelectedBtn')?.addEventListener('click', () => {
    const obj = canvas.getActiveObject();
    if (obj) {
        canvas.remove(obj);
        selectedObjectId = null;
        updateLayersList();
        saveToHistory();
        showToast('Element deleted');
    }
});

// ========================================
// EXPORT FUNCTIONS
// ========================================
async function exportAs(format) {
    showLoading(true);
    try {
        const dataURL = canvas.toDataURL({ format: format === 'jpg' ? 'jpeg' : 'png', multiplier: 2 });
        if (format === 'png' || format === 'jpg') {
            const link = document.createElement('a');
            link.download = `poster.${format}`;
            link.href = dataURL;
            link.click();
        } else if (format === 'pdf') {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ orientation: canvas.width > canvas.height ? 'landscape' : 'portrait' });
            pdf.addImage(dataURL, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
            pdf.save('poster.pdf');
        }
        showToast(`${format.toUpperCase()} exported!`);
    } catch (error) {
        showToast('Export failed');
    } finally {
        showLoading(false);
    }
}

document.getElementById('exportPNG')?.addEventListener('click', () => exportAs('png'));
document.getElementById('exportJPG')?.addEventListener('click', () => exportAs('jpg'));
document.getElementById('exportPDF')?.addEventListener('click', () => exportAs('pdf'));

// ========================================
// TIDB API INTEGRATION (Usage + Reactions + Shares)
// ========================================
async function loadUsageFromAPI() {
    try {
        const response = await fetch(`${API_BASE}/usage?tool_slug=${currentToolSlug}`);
        if (response.ok) {
            const data = await response.json();
            const usageSpan = document.getElementById('usageCount');
            if (usageSpan) usageSpan.innerText = data.count || 0;
        }
    } catch (error) {
        const count = localStorage.getItem(`${currentToolSlug}_usage`) || '0';
        const usageSpan = document.getElementById('usageCount');
        if (usageSpan) usageSpan.innerText = count;
    }
}

async function trackUsage() {
    try {
        await fetch(`${API_BASE}/increment-usage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: currentToolSlug, user_id: userId })
        });
    } catch (error) {
        let count = parseInt(localStorage.getItem(`${currentToolSlug}_usage`) || '0');
        count++;
        localStorage.setItem(`${currentToolSlug}_usage`, count);
        const usageSpan = document.getElementById('usageCount');
        if (usageSpan) usageSpan.innerText = count;
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

async function addReactionToAPI(reactionType) {
    const emojiMap = { 'like': '👍', 'love': '❤️', 'wow': '😮', 'sad': '😢', 'angry': '😠', 'laugh': '😂', 'celebrate': '🎉' };
    
    if (userReacted[reactionType]) {
        showToast('You already reacted with this emoji');
        return;
    }
    
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
        } else {
            addReactionToLocal(reactionType);
        }
    } catch (error) {
        addReactionToLocal(reactionType);
    }
}

function addReactionToLocal(reactionType) {
    if (userReacted[reactionType]) return;
    userReacted[reactionType] = true;
    currentReactions[reactionType] = (currentReactions[reactionType] || 0) + 1;
    localStorage.setItem(`${currentToolSlug}_reactions`, JSON.stringify(currentReactions));
    updateReactionUI(currentReactions);
    showToast('Reaction added (offline)');
}

function updateReactionUI(reactions) {
    const likeSpan = document.getElementById('likeCount');
    const loveSpan = document.getElementById('loveCount');
    const wowSpan = document.getElementById('wowCount');
    const sadSpan = document.getElementById('sadCount');
    const angrySpan = document.getElementById('angryCount');
    const laughSpan = document.getElementById('laughCount');
    const celebrateSpan = document.getElementById('celebrateCount');
    
    if (likeSpan) likeSpan.innerText = reactions.like || 0;
    if (loveSpan) loveSpan.innerText = reactions.love || 0;
    if (wowSpan) wowSpan.innerText = reactions.wow || 0;
    if (sadSpan) sadSpan.innerText = reactions.sad || 0;
    if (angrySpan) angrySpan.innerText = reactions.angry || 0;
    if (laughSpan) laughSpan.innerText = reactions.laugh || 0;
    if (celebrateSpan) celebrateSpan.innerText = reactions.celebrate || 0;
}

document.querySelectorAll('.reaction-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const reaction = btn.dataset.reaction;
        addReactionToAPI(reaction);
    });
});

// ========================================
// SOCIAL SHARING
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
    if (platform === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    else if (platform === 'twitter') window.open(`https://twitter.com/intent/tweet?text=Check%20out%20this%20poster%20designer!&url=${encodeURIComponent(shareUrl)}`, '_blank');
    else if (platform === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent('Check out this poster designer! ' + shareUrl)}`, '_blank');
    else if (platform === 'linkedin') window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}`, '_blank');
    else if (platform === 'email') window.location.href = `mailto:?subject=Check out this Poster Designer&body=${encodeURIComponent(shareUrl)}`;
    else if (platform === 'copy') { navigator.clipboard.writeText(shareUrl); showToast('Link copied!'); }
    
    showToast('Thanks for sharing!');
}

document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const platform = btn.dataset.platform;
        trackShare(platform);
    });
});

// ========================================
// LOAD STATS FROM API
// ========================================
async function loadStatsFromAPI() {
    try {
        const response = await fetch(`${API_BASE}/stats?tool_slug=${currentToolSlug}`);
        if (response.ok) {
            const data = await response.json();
            document.getElementById('statUsage').innerText = data.totalUsage || 0;
            document.getElementById('statShares').innerText = data.totalShares || 0;
            document.getElementById('statUsers').innerText = data.uniqueUsers || 0;
        }
    } catch (error) {
        console.log('Stats API failed');
    }
}

// ========================================
// UI HELPERS
// ========================================
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function showLoading(show) {
    const modal = document.getElementById('loadingModal');
    if (!modal) return;
    if (show) modal.classList.add('active');
    else modal.classList.remove('active');
}

// ========================================
// DARK MODE
// ========================================
document.getElementById('darkModeBtn')?.addEventListener('click', () => {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode);
    const btn = document.getElementById('darkModeBtn');
    if (btn) btn.innerHTML = darkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    showToast(darkMode ? 'Dark mode on' : 'Light mode on');
});

// ========================================
// SCROLL BUTTONS
// ========================================
document.getElementById('scrollUpBtn')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('scrollDownBtn')?.addEventListener('click', () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
});

// ========================================
// SIDEBAR & PANEL TOGGLES
// ========================================
document.getElementById('toggleSidebarBtn')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.toggle('collapsed');
});

document.getElementById('closeSidebarBtn')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.add('collapsed');
});

document.getElementById('toggleLayersBtn')?.addEventListener('click', () => {
    document.getElementById('layersPanel')?.classList.toggle('collapsed');
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
        const panel = document.getElementById(`${navName}-panel`);
        if (panel) panel.classList.add('active');
    });
});

// Template search
document.getElementById('templateSearch')?.addEventListener('input', (e) => {
    const search = e.target.value.toLowerCase();
    document.querySelectorAll('.template-card').forEach(card => {
        const name = card.querySelector('.template-name')?.innerText.toLowerCase() || '';
        card.style.display = name.includes(search) ? 'flex' : 'none';
    });
});

function setupEventListeners() {
    console.log('✅ All event listeners configured');
}

console.log('========================================');
console.log('🎉 Teacher Resource Finder Ready!');
console.log(`📁 Templates: Dynamic (1-${MAX_TEMPLATE_NUMBER})`);
console.log(`📁 Stickers: 1-${TOTAL_STICKERS}`);
console.log('========================================');
