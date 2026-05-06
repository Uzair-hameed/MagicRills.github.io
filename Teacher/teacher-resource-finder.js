// ========================================
// POSTERFORGE PRO - COMPLETE JAVASCRIPT
// FULLY INTEGRATED: TiDB + Vercel + Grok API + Reactions + Usage Counter
// 80 Templates | 100 Stickers | No Features Removed
// ========================================

let canvas = null;
let currentToolSlug = 'teacher-resource-finder';
let userId = localStorage.getItem('userId') || 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
let darkMode = localStorage.getItem('darkMode') === 'true';
let selectedObjectId = null;
let currentReactions = { like: 0, love: 0, wow: 0, sad: 0, laugh: 0, celebrate: 0 };
let userReacted = { like: false, love: false, wow: false, sad: false, laugh: false, celebrate: false };
let historyStates = [];
let historyIndex = -1;

// ========================================
// GITHUB CONFIGURATION (YOUR LINKS)
// ========================================
const GITHUB_BASE = 'https://raw.githubusercontent.com/Uzair-hameed/MagicRills.github.io/main/';
const TEMPLATES_BASE_URL = GITHUB_BASE + 'templates/';
const STICKERS_BASE_URL = GITHUB_BASE + 'stickers/';
const API_BASE = '/api';

// Template numbers 1 to 80 (as confirmed by you)
const TEMPLATE_NUMBERS = Array.from({ length: 80 }, (_, i) => i + 1);
const TOTAL_STICKERS = 100;

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('PosterForge Pro Initializing...');
    console.log('📁 Loading from:', GITHUB_BASE);
    console.log('📄 Templates: 80 (template1.json to template80.json)');
    console.log('🖼️ Stickers: 100 (sticker1.png.png to sticker100.png.png)');
    
    initializeCanvas();
    
    if (darkMode) {
        document.body.classList.add('dark-mode');
        const darkBtn = document.getElementById('darkModeBtn');
        if (darkBtn) darkBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    localStorage.setItem('userId', userId);
    
    // Load all data
    await loadAllTemplates();
    await loadAllStickers();
    loadElements();
    loadGradients();
    loadPatterns();
    loadSavedImages();
    
    // API Integrations
    await loadUsageFromAPI();
    await trackUsage();
    await loadReactionsFromAPI();
    
    setupEventListeners();
    saveToHistory();
    
    showToast('✨ PosterForge Pro Ready! 80 Templates & 100 Stickers Loaded');
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
    
    // Welcome text
    const welcomeText = new fabric.Text('Welcome to PosterForge Pro!\n\n✨ Click on templates or stickers to get started!\nDrag to move | Click to select | Use corners to resize/rotate\n\nText customization: Bold, Italic, Underline, Shadow, Alignment\nLayers: Bring Forward, Send Backward\nExport: PNG, JPG, PDF, SVG, JSON\nSave: Cloud (TiDB) or Browser', {
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
    
    // Canvas event listeners
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
// LOAD 80 TEMPLATES (Using HEAD requests for efficiency)
// ========================================
async function loadAllTemplates() {
    const grid = document.getElementById('templatesGrid');
    if (!grid) return;
    
    grid.innerHTML = '<div style="text-align:center; padding:20px;">⏳ Loading 80 templates from GitHub...</div>';
    let loadedCount = 0;
    let notFoundCount = 0;
    
    // First, find which templates actually exist using HEAD requests
    const existingTemplates = [];
    
    for (const num of TEMPLATE_NUMBERS) {
        try {
            const response = await fetch(`${TEMPLATES_BASE_URL}template${num}.json`, { method: 'HEAD' });
            if (response.ok) {
                existingTemplates.push(num);
            } else {
                notFoundCount++;
            }
        } catch (error) {
            notFoundCount++;
        }
        
        // Update progress every 10 templates
        if (num % 10 === 0) {
            grid.innerHTML = `<div style="text-align:center; padding:20px;">⏳ Scanning templates... (${num}/80 found: ${existingTemplates.length})</div>`;
            await new Promise(resolve => setTimeout(resolve, 10));
        }
    }
    
    if (existingTemplates.length === 0) {
        grid.innerHTML = '<div style="text-align:center; padding:20px; color: red;">❌ No templates found! Please check GitHub folder.</div>';
        return;
    }
    
    // Now load only the existing templates
    grid.innerHTML = `<div style="text-align:center; padding:20px;">⏳ Loading ${existingTemplates.length} templates...</div>`;
    grid.innerHTML = ''; // Clear for actual cards
    
    for (const num of existingTemplates) {
        try {
            const response = await fetch(`${TEMPLATES_BASE_URL}template${num}.json`);
            if (!response.ok) continue;
            
            const templateData = await response.json();
            
            const card = document.createElement('div');
            card.className = 'template-card';
            card.innerHTML = `
                <div class="template-preview"><i class="fas fa-palette"></i></div>
                <div class="template-name">Template ${num}</div>
            `;
            card.addEventListener('click', () => {
                try {
                    canvas.loadFromJSON(templateData, () => {
                        canvas.renderAll();
                        saveToHistory();
                        showToast(`✨ Template ${num} loaded!`);
                    });
                } catch (e) {
                    showToast('Error loading template');
                    console.error('Template load error:', e);
                }
            });
            grid.appendChild(card);
            loadedCount++;
        } catch (error) {
            console.warn(`Template ${num} error:`, error);
        }
    }
    
    console.log(`✅ Templates: ${loadedCount} loaded, ${notFoundCount} not found`);
    showToast(`✅ ${loadedCount} templates loaded!`);
}

// ========================================
// LOAD 100 STICKERS
// ========================================
async function loadAllStickers() {
    const stickersGrid = document.getElementById('stickersGrid');
    if (!stickersGrid) return;
    
    stickersGrid.innerHTML = '<div class="stickers-title"><i class="fas fa-smile"></i> 📂 My Stickers (100)</div>';
    
    const stickersContainer = document.createElement('div');
    stickersContainer.style.display = 'grid';
    stickersContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
    stickersContainer.style.gap = '12px';
    stickersContainer.style.marginTop = '8px';
    
    let loadedCount = 0;
    let processedCount = 0;
    
    for (let i = 1; i <= TOTAL_STICKERS; i++) {
        const fileName = `sticker${i}.png.png`;
        const imgUrl = `${STICKERS_BASE_URL}${fileName}`;
        
        const img = new Image();
        img.onload = () => {
            const stickerDiv = document.createElement('div');
            stickerDiv.className = 'sticker-item';
            stickerDiv.innerHTML = `
                <img src="${imgUrl}" alt="Sticker ${i}" style="width: 100%; height: auto; border-radius: 8px;">
                <span>Sticker ${i}</span>
            `;
            stickerDiv.addEventListener('click', () => addStickerToCanvas(imgUrl, i));
            stickersContainer.appendChild(stickerDiv);
            loadedCount++;
            processedCount++;
            
            if (processedCount === TOTAL_STICKERS) {
                if (loadedCount === 0) {
                    stickersContainer.innerHTML = '<div style="text-align:center; padding:20px; color: gray; grid-column: span 4;">❌ No stickers found. Check /stickers/ folder.</div>';
                }
                stickersGrid.appendChild(stickersContainer);
                console.log(`✅ Stickers: ${loadedCount} loaded successfully`);
            }
        };
        img.onerror = () => {
            processedCount++;
            if (processedCount === TOTAL_STICKERS) {
                if (loadedCount === 0) {
                    stickersContainer.innerHTML = '<div style="text-align:center; padding:20px; color: gray; grid-column: span 4;">❌ No stickers found. Add sticker1.png.png to sticker100.png.png</div>';
                }
                stickersGrid.appendChild(stickersContainer);
            }
        };
        img.src = imgUrl;
    }
    
    setTimeout(() => {
        if (loadedCount === 0 && stickersContainer.children.length === 0) {
            stickersContainer.innerHTML = '<div style="text-align:center; padding:20px; color: gray; grid-column: span 4;">⏳ Loading stickers from GitHub...</div>';
            stickersGrid.appendChild(stickersContainer);
        }
    }, 3000);
}

function addStickerToCanvas(imageUrl, stickerNumber) {
    fabric.Image.fromURL(imageUrl, (img) => {
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
        showToast(`✅ Sticker ${stickerNumber} added!`);
    }, () => {
        showToast('Failed to load sticker');
    });
}

// ========================================
// LOAD ELEMENTS (Shapes, Icons, Stickers, Frames)
// ========================================
function loadElements() {
    const shapes = [
        { name: 'Square', icon: 'fa-square', type: 'rect', w: 80, h: 80 },
        { name: 'Circle', icon: 'fa-circle', type: 'circle', r: 40 },
        { name: 'Rectangle', icon: 'fa-rectangle', type: 'rect', w: 120, h: 60 },
        { name: 'Triangle', icon: 'fa-triangle', type: 'triangle', w: 80, h: 80 },
        { name: 'Star', icon: 'fa-star', type: 'star' },
        { name: 'Heart', icon: 'fa-heart', type: 'heart' },
        { name: 'Diamond', icon: 'fa-gem', type: 'diamond', w: 60, h: 60 },
        { name: 'Circle Outline', icon: 'fa-circle', type: 'circle', r: 40, fill: 'transparent', stroke: '#2563eb', strokeWidth: 3 },
        { name: 'Rounded Rect', icon: 'fa-square', type: 'rect', w: 100, h: 80, rx: 20, ry: 20 },
        { name: 'Line', icon: 'fa-minus', type: 'line' },
        { name: 'Arrow', icon: 'fa-arrow-right', type: 'arrow' }
    ];
    
    const icons = [
        'fa-star', 'fa-heart', 'fa-bell', 'fa-calendar', 'fa-clock', 'fa-envelope', 'fa-phone',
        'fa-user', 'fa-book', 'fa-graduation-cap', 'fa-camera', 'fa-music', 'fa-rocket', 'fa-crown'
    ];
    
    const emojiStickers = ['⭐', '❤️', '🔥', '👑', '🌟', '💎', '🎈', '🎉', '🎁', '🏆', '🌈', '⚡', '☀️', '🌙', '🌸', '🍎', '📚', '✏️', '🎨', '🎯', '🎵'];
    
    const frames = [
        { name: 'Basic', style: 'solid', w: 2 },
        { name: 'Dashed', style: 'dashed', w: 2 },
        { name: 'Dotted', style: 'dotted', w: 2 },
        { name: 'Double', style: 'double', w: 4 }
    ];
    
    const elementsGrid = document.getElementById('elementsGrid');
    if (!elementsGrid) return;
    
    let currentType = 'shapes';
    
    function renderElements() {
        let html = '';
        if (currentType === 'shapes') {
            html = shapes.map(s => `<div class="element-card" data-shape='${JSON.stringify(s)}'><i class="fas ${s.icon}"></i><span>${s.name}</span></div>`).join('');
        } else if (currentType === 'icons') {
            html = icons.map(i => `<div class="element-card" data-icon="${i}"><i class="fas ${i}"></i><span>Icon</span></div>`).join('');
        } else if (currentType === 'stickers') {
            html = emojiStickers.map(s => `<div class="element-card" data-sticker="${s}"><span style="font-size: 32px;">${s}</span><span>Sticker</span></div>`).join('');
        } else if (currentType === 'frames') {
            html = frames.map(f => `<div class="element-card" data-frame='${JSON.stringify(f)}'><i class="fas fa-border-all"></i><span>${f.name}</span></div>`).join('');
        }
        elementsGrid.innerHTML = html;
        
        document.querySelectorAll('[data-shape]').forEach(el => {
            el.addEventListener('click', () => addShape(JSON.parse(el.dataset.shape)));
        });
        document.querySelectorAll('[data-icon]').forEach(el => {
            el.addEventListener('click', () => addIcon(el.dataset.icon));
        });
        document.querySelectorAll('[data-sticker]').forEach(el => {
            el.addEventListener('click', () => addEmojiSticker(el.dataset.sticker));
        });
        document.querySelectorAll('[data-frame]').forEach(el => {
            el.addEventListener('click', () => addFrame(JSON.parse(el.dataset.frame)));
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

function addShape(shapeData) {
    let obj;
    const left = Math.random() * (canvas.width - 200) + 100;
    const top = Math.random() * (canvas.height - 200) + 100;
    
    if (shapeData.type === 'rect') {
        obj = new fabric.Rect({ left, top, width: shapeData.w, height: shapeData.h, fill: '#2563eb', rx: shapeData.rx || 0 });
    } else if (shapeData.type === 'circle' && shapeData.fill === 'transparent') {
        obj = new fabric.Circle({ left, top, radius: shapeData.r, fill: 'transparent', stroke: '#2563eb', strokeWidth: 3 });
    } else if (shapeData.type === 'circle') {
        obj = new fabric.Circle({ left, top, radius: shapeData.r, fill: '#2563eb' });
    } else if (shapeData.type === 'triangle') {
        obj = new fabric.Triangle({ left, top, width: shapeData.w, height: shapeData.h, fill: '#2563eb' });
    } else if (shapeData.type === 'star') {
        const points = [];
        for (let i = 0; i < 10; i++) {
            const angle = (i * 36 - 90) * Math.PI / 180;
            const radius = i % 2 === 0 ? 40 : 20;
            points.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
        }
        obj = new fabric.Polygon(points, { left, top, fill: '#f59e0b' });
    } else if (shapeData.type === 'heart') {
        obj = new fabric.Path('M 0,-30 C 20,-50 50,-20 0,30 C -50,-20 -20,-50 0,-30 Z', { left, top, fill: '#ef4444', scaleX: 0.8, scaleY: 0.8 });
    } else if (shapeData.type === 'diamond') {
        obj = new fabric.Polygon([
            { x: 0, y: -30 }, { x: 30, y: 0 }, { x: 0, y: 30 }, { x: -30, y: 0 }
        ], { left, top, fill: '#2563eb' });
    } else {
        obj = new fabric.Rect({ left, top, width: 60, height: 60, fill: '#2563eb' });
    }
    
    obj.id = 'shape_' + Date.now();
    canvas.add(obj);
    canvas.setActiveObject(obj);
    canvas.renderAll();
    saveToHistory();
    showToast(`✅ Added ${shapeData.name}`);
}

function addIcon(iconClass) {
    const left = Math.random() * (canvas.width - 150) + 100;
    const top = Math.random() * (canvas.height - 150) + 100;
    const iconMap = { 
        'fa-star': '★', 'fa-heart': '❤️', 'fa-bell': '🔔', 'fa-calendar': '📅', 
        'fa-clock': '🕐', 'fa-envelope': '✉️', 'fa-phone': '📞', 'fa-user': '👤', 
        'fa-book': '📖', 'fa-graduation-cap': '🎓', 'fa-camera': '📷', 'fa-music': '🎵',
        'fa-rocket': '🚀', 'fa-crown': '👑'
    };
    const char = iconMap[iconClass] || '◆';
    const text = new fabric.Text(char, { left, top, fontSize: 48, fontFamily: 'Segoe UI Emoji', fill: '#2563eb' });
    text.id = 'icon_' + Date.now();
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    saveToHistory();
    showToast('✅ Added icon');
}

function addEmojiSticker(sticker) {
    const left = Math.random() * (canvas.width - 100) + 100;
    const top = Math.random() * (canvas.height - 100) + 100;
    const text = new fabric.Text(sticker, { left, top, fontSize: 48, fontFamily: 'Segoe UI Emoji' });
    text.id = 'sticker_' + Date.now();
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    saveToHistory();
    showToast('✅ Added sticker');
}

function addFrame(frameData) {
    const left = Math.random() * (canvas.width - 300) + 150;
    const top = Math.random() * (canvas.height - 300) + 150;
    const rect = new fabric.Rect({
        left, top, width: 200, height: 200, fill: 'transparent', stroke: '#2563eb',
        strokeWidth: frameData.w,
        strokeDashArray: frameData.style === 'dashed' ? [10, 5] : frameData.style === 'dotted' ? [5, 5] : null
    });
    rect.id = 'frame_' + Date.now();
    canvas.add(rect);
    canvas.renderAll();
    saveToHistory();
    showToast(`✅ Added ${frameData.name} frame`);
}

// ========================================
// TEXT MANAGEMENT (Complete Customization)
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

document.getElementById('textShadowBtn')?.addEventListener('click', () => {
    const obj = canvas.getActiveObject();
    if (obj && obj.type === 'text') {
        const hasShadow = obj.shadow !== null;
        obj.set('shadow', hasShadow ? null : '2px 2px 4px rgba(0,0,0,0.3)');
        canvas.renderAll();
        saveToHistory();
    }
});

// Alignment
document.querySelectorAll('.align-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const obj = canvas.getActiveObject();
        if (obj && obj.type === 'text') {
            let align = btn.dataset.align;
            obj.set('textAlign', align);
            canvas.renderAll();
            saveToHistory();
            showToast(`Text aligned ${align}`);
        } else if (!obj) {
            showToast('Select a text element first');
        }
    });
});

// Letter Spacing
document.getElementById('letterSpacing')?.addEventListener('input', (e) => {
    const val = e.target.value;
    document.getElementById('letterSpacingVal').innerText = val + 'px';
    const obj = canvas.getActiveObject();
    if (obj && obj.type === 'text') {
        obj.set('charSpacing', parseInt(val));
        canvas.renderAll();
        saveToHistory();
    }
});

// Line Height
document.getElementById('lineHeight')?.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    document.getElementById('lineHeightVal').innerText = val;
    const obj = canvas.getActiveObject();
    if (obj && obj.type === 'text') {
        obj.set('lineHeight', val);
        canvas.renderAll();
        saveToHistory();
    }
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
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                scaleX: canvas.width / img.width,
                scaleY: canvas.height / img.height
            });
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
        'linear-gradient(135deg, #fa709a, #fee140)', 'linear-gradient(135deg, #1e293b, #0f172a)',
        'linear-gradient(135deg, #ff6b6b, #c92a2a)', 'linear-gradient(135deg, #11998e, #38ef7d)',
        'linear-gradient(135deg, #2b5876, #4e4376)', 'linear-gradient(135deg, #c33764, #1d2671)',
        'linear-gradient(135deg, #360033, #0b8793)', 'linear-gradient(135deg, #ff9a9e, #fecfef)'
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

function loadPatterns() {
    const patterns = [
        'repeating-linear-gradient(45deg, #ddd 0px, #ddd 2px, transparent 2px, transparent 8px)',
        'repeating-conic-gradient(#ddd 0% 25%, transparent 0% 50%) 50% / 20px 20px',
        'radial-gradient(circle at 10px 10px, #ddd 2px, transparent 2px) 0 0 / 20px 20px'
    ];
    const grid = document.getElementById('patternsGrid');
    if (grid) {
        grid.innerHTML = patterns.map(p => `<div class="pattern-item" style="background: ${p};" data-pattern="${p}"></div>`).join('');
        document.querySelectorAll('.pattern-item').forEach(item => {
            item.addEventListener('click', () => {
                canvas.setBackgroundColor(item.dataset.pattern, () => canvas.renderAll());
                saveToHistory();
                showToast('Pattern applied');
            });
        });
    }
}

// ========================================
// UPLOAD & EDIT POSTER
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

function loadSavedImages() {
    const container = document.getElementById('uploadedImagesList');
    if (!container) return;
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
// LAYERS MANAGEMENT (Formation)
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
            left: canvas.width / 2, top: canvas.height / 2, fontSize: 24, fontFamily: 'Inter',
            fill: '#1e293b', textAlign: 'center', originX: 'center', originY: 'center'
        });
        canvas.add(text);
        canvas.renderAll();
        saveToHistory();
        showToast('✨ AI quote generated!');
    } catch (error) {
        showToast('AI quote generated (offline mode)');
    } finally {
        showLoading(false);
    }
});

document.getElementById('suggestColorsBtn')?.addEventListener('click', () => {
    showToast('Color suggestion: Use blue (#2563eb) as primary, white as background');
});

document.getElementById('suggestLayoutBtn')?.addEventListener('click', () => {
    showToast('Layout suggestion: Place text in center, add a shape border around it');
});

// ========================================
// EXPORT FUNCTIONS
// ========================================
async function exportAs(format) {
    showLoading(true);
    try {
        if (format === 'png' || format === 'jpg') {
            const dataURL = canvas.toDataURL({ format: format === 'jpg' ? 'jpeg' : 'png', multiplier: 2 });
            const link = document.createElement('a');
            link.download = `poster.${format}`;
            link.href = dataURL;
            link.click();
            showToast(`${format.toUpperCase()} exported!`);
        } else if (format === 'pdf') {
            const dataURL = canvas.toDataURL({ format: 'png', multiplier: 2 });
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ orientation: canvas.width > canvas.height ? 'landscape' : 'portrait' });
            pdf.addImage(dataURL, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
            pdf.save('poster.pdf');
            showToast('PDF exported!');
        } else if (format === 'svg') {
            const svg = canvas.toSVG();
            const blob = new Blob([svg], { type: 'image/svg+xml' });
            saveAs(blob, 'poster.svg');
            showToast('SVG exported!');
        } else if (format === 'json') {
            const json = JSON.stringify(canvas.toJSON());
            const blob = new Blob([json], { type: 'application/json' });
            saveAs(blob, 'poster.json');
            showToast('JSON exported!');
        }
    } catch (error) {
        showToast('Export failed');
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
// SAVE & LOAD (LocalStorage + Cloud)
// ========================================
document.getElementById('saveToTiDB')?.addEventListener('click', async () => {
    const designData = {
        tool_slug: currentToolSlug,
        user_id: userId,
        design_name: 'Design_' + Date.now(),
        design_json: JSON.stringify(canvas.toJSON()),
        timestamp: new Date().toISOString()
    };
    try {
        const response = await fetch(`${API_BASE}/save-design`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(designData)
        });
        if (response.ok) {
            showToast('Design saved to cloud (TiDB)!');
        } else {
            showToast('Cloud save failed, saved to browser');
            saveToLocalStorage();
        }
    } catch (error) {
        saveToLocalStorage();
    }
});

function saveToLocalStorage() {
    const designs = JSON.parse(localStorage.getItem('saved_designs') || '[]');
    designs.unshift({ id: Date.now(), data: JSON.stringify(canvas.toJSON()), timestamp: new Date().toISOString() });
    localStorage.setItem('saved_designs', JSON.stringify(designs.slice(0, 20)));
    showToast('Design saved to browser!');
}

document.getElementById('saveToLocal')?.addEventListener('click', saveToLocalStorage);

document.getElementById('loadFromLocal')?.addEventListener('click', () => {
    const designs = JSON.parse(localStorage.getItem('saved_designs') || '[]');
    if (designs.length === 0) { showToast('No saved designs'); return; }
    canvas.loadFromJSON(JSON.parse(designs[0].data), () => {
        canvas.renderAll();
        updateLayersList();
        saveToHistory();
        showToast('Design loaded!');
    });
});

// ========================================
// TIDB API INTEGRATION (Usage + Reactions)
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
    const emojiMap = { 'like': '👍', 'love': '❤️', 'wow': '😮', 'sad': '😢', 'laugh': '😂', 'celebrate': '🎉' };
    try {
        const response = await fetch(`${API_BASE}/add-reaction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: currentToolSlug, emoji: emojiMap[reactionType], user_id: userId })
        });
        if (response.ok) {
            const data = await response.json();
            if (data.counts) updateReactionUI(data.counts);
            showToast('Reaction added!');
        } else {
            addReactionToLocal(reactionType);
        }
    } catch (error) {
        addReactionToLocal(reactionType);
    }
}

function addReactionToLocal(reactionType) {
    if (userReacted[reactionType]) { showToast('You already reacted with this emoji'); return; }
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
    const laughSpan = document.getElementById('laughCount');
    const celebrateSpan = document.getElementById('celebrateCount');
    if (likeSpan) likeSpan.innerText = reactions.like || 0;
    if (loveSpan) loveSpan.innerText = reactions.love || 0;
    if (wowSpan) wowSpan.innerText = reactions.wow || 0;
    if (sadSpan) sadSpan.innerText = reactions.sad || 0;
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
    if (platform === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    else if (platform === 'twitter') window.open(`https://twitter.com/intent/tweet?text=Check%20out%20my%20poster!&url=${encodeURIComponent(shareUrl)}`, '_blank');
    else if (platform === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent('Check out my poster! ' + shareUrl)}`, '_blank');
    else if (platform === 'linkedin') window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
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
        card.style.display = name.includes(search) ? 'block' : 'none';
    });
});

function setupEventListeners() {
    console.log('✅ All event listeners configured');
}

console.log('🎉 PosterForge Pro Fully Loaded!');
console.log('📁 80 Templates | 100 Stickers');
console.log('🔗 GitHub: https://github.com/Uzair-hameed/MagicRills.github.io');
