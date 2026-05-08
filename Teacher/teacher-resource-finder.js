// ========================================
// TEACHER RESOURCE FINDER - POSTER DESIGNER PRO
// COMPLETE REWRITE - FIXED TEMPLATE ISSUE
// Templates: 1-36 | Stickers: 1-104
// ========================================

let canvas = null;
let currentToolSlug = 'teacher-resource-finder';
let userId = localStorage.getItem('userId') || 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
let darkMode = localStorage.getItem('darkMode') === 'true';
let selectedObjectId = null;
let historyStates = [];
let historyIndex = -1;
let templateCache = {};

// Reaction counts
let currentReactions = { like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0 };
let userReacted = { like: false, love: false, wow: false, sad: false, angry: false, laugh: false, celebrate: false };

// ========================================
// GITHUB CONFIGURATION
// ========================================
const GITHUB_BASE = 'https://raw.githubusercontent.com/Uzair-hameed/MagicRills.github.io/main/';
const TEMPLATES_BASE_URL = GITHUB_BASE + 'templates/';
const STICKERS_BASE_URL = GITHUB_BASE + 'stickers/';
const API_BASE = 'https://teacher-resource-finder.uzairhameed01.workers.dev/api';

// Template range (1 to 36 only)
const TEMPLATE_START = 1;
const TEMPLATE_END = 36;

// ========================================
// BEAUTIFUL TEMPLATE DESIGNS (Fallback)
// In case JSON doesn't have proper format
// ========================================
const BEAUTIFUL_TEMPLATES = {
    1: { name: "Education Poster", bg: "linear-gradient(135deg, #667eea, #764ba2)", icon: "📚", textColor: "#ffffff" },
    2: { name: "Event Flyer", bg: "linear-gradient(135deg, #f093fb, #f5576c)", icon: "🎉", textColor: "#ffffff" },
    3: { name: "Business Banner", bg: "linear-gradient(135deg, #4facfe, #00f2fe)", icon: "💼", textColor: "#ffffff" },
    4: { name: "Motivational Quote", bg: "linear-gradient(135deg, #43e97b, #38f9d7)", icon: "💪", textColor: "#1e293b" },
    5: { name: "Birthday Celebration", bg: "linear-gradient(135deg, #fa709a, #fee140)", icon: "🎂", textColor: "#1e293b" },
    6: { name: "Wedding Invitation", bg: "linear-gradient(135deg, #f8c291, #e77f67)", icon: "💍", textColor: "#ffffff" },
    7: { name: "Science Fair", bg: "linear-gradient(135deg, #00b894, #00cec9)", icon: "🔬", textColor: "#ffffff" },
    8: { name: "Library Event", bg: "linear-gradient(135deg, #2c3e50, #3498db)", icon: "📖", textColor: "#ffffff" },
    9: { name: "Sports Day", bg: "linear-gradient(135deg, #ff6b6b, #c92a2a)", icon: "⚽", textColor: "#ffffff" },
    10: { name: "Art Exhibition", bg: "linear-gradient(135deg, #a8edea, #fed6e3)", icon: "🎨", textColor: "#1e293b" },
    11: { name: "Music Concert", bg: "linear-gradient(135deg, #ff9a9e, #fecfef)", icon: "🎵", textColor: "#1e293b" },
    12: { name: "Islamic Event", bg: "linear-gradient(135deg, #11998e, #38ef7d)", icon: "🕌", textColor: "#ffffff" },
    13: { name: "Tech Conference", bg: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)", icon: "💻", textColor: "#ffffff" },
    14: { name: "Health & Wellness", bg: "linear-gradient(135deg, #84fab0, #8fd3f4)", icon: "🧘", textColor: "#1e293b" },
    15: { name: "Charity Fundraiser", bg: "linear-gradient(135deg, #ffecd2, #fcb69f)", icon: "🤝", textColor: "#1e293b" },
    16: { name: "Career Fair", bg: "linear-gradient(135deg, #ddd6f3, #faaca8)", icon: "💼", textColor: "#1e293b" },
    17: { name: "Cultural Festival", bg: "linear-gradient(135deg, #ffdde1, #ee9ca7)", icon: "🎭", textColor: "#1e293b" },
    18: { name: "Environmental Day", bg: "linear-gradient(135deg, #a8e6cf, #d4edf5)", icon: "🌍", textColor: "#1e293b" },
    19: { name: "Eid Mubarak", bg: "linear-gradient(135deg, #f5af19, #f12711)", icon: "⭐", textColor: "#ffffff" },
    20: { name: "New Year Party", bg: "linear-gradient(135deg, #1a2980, #26d0ce)", icon: "🎆", textColor: "#ffffff" },
    21: { name: "Sale Banner", bg: "linear-gradient(135deg, #ff0844, #ffb199)", icon: "💰", textColor: "#ffffff" },
    22: { name: "Product Launch", bg: "linear-gradient(135deg, #00c6fb, #005bea)", icon: "🚀", textColor: "#ffffff" },
    23: { name: "Webinar Invite", bg: "linear-gradient(135deg, #6a11cb, #2575fc)", icon: "🎥", textColor: "#ffffff" },
    24: { name: "Workshop", bg: "linear-gradient(135deg, #ff7e5f, #feb47b)", icon: "🛠️", textColor: "#ffffff" },
    25: { name: "Award Ceremony", bg: "linear-gradient(135deg, #f7971e, #ffd200)", icon: "🏆", textColor: "#1e293b" },
    26: { name: "Graduation", bg: "linear-gradient(135deg, #134e5e, #71b280)", icon: "🎓", textColor: "#ffffff" },
    27: { name: "Valentine's Day", bg: "linear-gradient(135deg, #ff6b6b, #c92a2a)", icon: "❤️", textColor: "#ffffff" },
    28: { name: "Ramadan Kareem", bg: "linear-gradient(135deg, #2c3e50, #3498db)", icon: "🌙", textColor: "#ffffff" },
    29: { name: "Back to School", bg: "linear-gradient(135deg, #fa8bff, #2bd2ff)", icon: "🏫", textColor: "#ffffff" },
    30: { name: "Summer Camp", bg: "linear-gradient(135deg, #ffe259, #ffa751)", icon: "☀️", textColor: "#1e293b" },
    31: { name: "Winter Festival", bg: "linear-gradient(135deg, #e0eafc, #cfdef3)", icon: "❄️", textColor: "#1e293b" },
    32: { name: "Spring Celebration", bg: "linear-gradient(135deg, #d4fc79, #96e6a1)", icon: "🌸", textColor: "#1e293b" },
    33: { name: "Autumn Harvest", bg: "linear-gradient(135deg, #f6d365, #fda085)", icon: "🍂", textColor: "#1e293b" },
    34: { name: "Fashion Show", bg: "linear-gradient(135deg, #e96443, #904e95)", icon: "👗", textColor: "#ffffff" },
    35: { name: "Film Festival", bg: "linear-gradient(135deg, #000000, #434343)", icon: "🎬", textColor: "#ffffff" },
    36: { name: "Community Meetup", bg: "linear-gradient(135deg, #5ee7df, #b490ca)", icon: "👥", textColor: "#1e293b" }
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
    
    await loadAllTemplates();
    await loadAllStickers();
    loadElements();
    loadGradients();
    await loadUsageFromAPI();
    await trackUsage();
    await loadReactionsFromAPI();
    await loadStatsFromAPI();
    
    setupEventListeners();
    saveToHistory();
    
    showToast('✨ Teacher Resource Finder Ready! 36 Templates Loaded');
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
    
    canvas.on('selection:created', () => updateLayersList());
    canvas.on('selection:updated', () => updateLayersList());
    canvas.on('selection:cleared', () => updateLayersList());
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
// LOAD ALL TEMPLATES (1 to 36)
// ========================================
async function loadAllTemplates() {
    const grid = document.getElementById('templatesGrid');
    if (!grid) return;
    
    grid.innerHTML = '<div style="text-align:center; padding:20px;"><i class="fas fa-spinner fa-spin"></i> Loading 36 templates...</div>';
    
    let loadedCount = 0;
    
    for (let num = TEMPLATE_START; num <= TEMPLATE_END; num++) {
        const templateInfo = BEAUTIFUL_TEMPLATES[num] || { name: `Template ${num}`, bg: "linear-gradient(135deg, #667eea, #764ba2)", icon: "🎨", textColor: "#ffffff" };
        
        const card = document.createElement('div');
        card.className = 'template-card';
        
        const previewDiv = document.createElement('div');
        previewDiv.className = 'template-preview';
        previewDiv.style.background = templateInfo.bg;
        previewDiv.innerHTML = `<span style="font-size: 48px;">${templateInfo.icon}</span>`;
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'template-name';
        nameDiv.innerText = `Template ${num}: ${templateInfo.name}`;
        
        card.appendChild(previewDiv);
        card.appendChild(nameDiv);
        
        // Try to load actual template from GitHub
        try {
            const url = `${TEMPLATES_BASE_URL}template${num}.json`;
            const response = await fetch(url);
            
            if (response.ok) {
                const templateData = await response.json();
                templateCache[num] = templateData;
                console.log(`✅ Template ${num} loaded from GitHub`);
                
                // Try to generate real thumbnail
                generateThumbnailFromData(templateData, previewDiv, num);
            } else {
                console.log(`⚠️ Template ${num} not on GitHub, using beautiful fallback`);
                templateCache[num] = null;
            }
        } catch (error) {
            console.log(`⚠️ Template ${num} fetch error, using fallback`);
            templateCache[num] = null;
        }
        
        card.addEventListener('click', () => loadTemplate(num));
        grid.appendChild(card);
        loadedCount++;
    }
    
    console.log(`✅ ${loadedCount} templates loaded!`);
    showToast(`✅ ${loadedCount} templates ready!`);
}

// Generate thumbnail from template data
function generateThumbnailFromData(templateData, previewDiv, num) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 200;
    tempCanvas.height = 150;
    const tempFabric = new fabric.Canvas(tempCanvas);
    
    try {
        if (templateData && templateData.objects && Array.isArray(templateData.objects)) {
            tempFabric.loadFromJSON(templateData, () => {
                tempFabric.renderAll();
                const thumbnailURL = tempFabric.toDataURL({ format: 'png', multiplier: 0.5 });
                previewDiv.style.backgroundImage = `url(${thumbnailURL})`;
                previewDiv.style.backgroundSize = 'cover';
                previewDiv.style.backgroundPosition = 'center';
                previewDiv.innerHTML = '';
                tempFabric.dispose();
            });
        }
    } catch(e) {
        console.log(`Thumbnail generation failed for template ${num}`);
        tempFabric.dispose();
    }
}

// Load template on canvas
function loadTemplate(num) {
    showLoading(true);
    
    const templateInfo = BEAUTIFUL_TEMPLATES[num] || { 
        name: `Template ${num}`, 
        bg: "linear-gradient(135deg, #667eea, #764ba2)", 
        icon: "🎨", 
        textColor: "#ffffff" 
    };
    
    // Clear canvas first
    canvas.clear();
    
    // Apply gradient background
    canvas.setBackgroundColor(templateInfo.bg, () => {
        
        // Add decorative elements based on template
        addDecorativeElements(num, templateInfo);
        
        // Add title
        const title = new fabric.Text(templateInfo.name, {
            left: canvas.width / 2,
            top: 120,
            fontSize: 42,
            fontFamily: 'Inter',
            fill: templateInfo.textColor,
            textAlign: 'center',
            originX: 'center',
            fontWeight: 'bold',
            shadow: '0 2px 10px rgba(0,0,0,0.2)'
        });
        
        // Add subtitle
        const subtitle = new fabric.Text('Edit this text by double clicking', {
            left: canvas.width / 2,
            top: 200,
            fontSize: 18,
            fontFamily: 'Inter',
            fill: templateInfo.textColor,
            textAlign: 'center',
            originX: 'center',
            opacity: 0.8
        });
        
        // Add instruction
        const instruction = new fabric.Text('✨ Click to edit | Add stickers from sidebar | Drag to move', {
            left: canvas.width / 2,
            top: canvas.height - 80,
            fontSize: 14,
            fontFamily: 'Inter',
            fill: templateInfo.textColor,
            textAlign: 'center',
            originX: 'center',
            opacity: 0.6
        });
        
        canvas.add(title, subtitle, instruction);
        canvas.renderAll();
        
        // Try to load actual template JSON if available
        if (templateCache[num]) {
            try {
                canvas.loadFromJSON(templateCache[num], () => {
                    canvas.renderAll();
                    saveToHistory();
                    showToast(`✨ Template ${num}: ${templateInfo.name} loaded!`);
                    showLoading(false);
                }, () => {
                    showToast(`✨ Template ${num}: ${templateInfo.name} loaded!`);
                    showLoading(false);
                });
            } catch(e) {
                showToast(`✨ Template ${num}: ${templateInfo.name} loaded!`);
                showLoading(false);
            }
        } else {
            showToast(`✨ Template ${num}: ${templateInfo.name} loaded!`);
            showLoading(false);
        }
        
        saveToHistory();
    });
}

// Add decorative elements based on template type
function addDecorativeElements(num, info) {
    const icon = info.icon;
    
    // Add large background icon
    const bgIcon = new fabric.Text(icon, {
        left: canvas.width - 80,
        top: canvas.height - 100,
        fontSize: 120,
        opacity: 0.15,
        fontFamily: 'Segoe UI Emoji'
    });
    canvas.add(bgIcon);
    
    // Add corner decorations based on template number
    if (num % 2 === 0) {
        // Add stars in corners
        const star = new fabric.Text('✦', {
            left: 30,
            top: 30,
            fontSize: 24,
            fill: info.textColor,
            opacity: 0.4
        });
        canvas.add(star);
        
        const star2 = new fabric.Text('✦', {
            left: canvas.width - 50,
            top: canvas.height - 60,
            fontSize: 24,
            fill: info.textColor,
            opacity: 0.4
        });
        canvas.add(star2);
    } else {
        // Add dots in corners
        const dot = new fabric.Circle({
            left: 30,
            top: 30,
            radius: 5,
            fill: info.textColor,
            opacity: 0.3
        });
        canvas.add(dot);
        
        const dot2 = new fabric.Circle({
            left: canvas.width - 45,
            top: canvas.height - 55,
            radius: 5,
            fill: info.textColor,
            opacity: 0.3
        });
        canvas.add(dot2);
    }
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
    const emojiList = ['⭐', '❤️', '🔥', '👑', '🌟', '💎', '🎈', '🎉', '🎁', '🏆', '🌈', '⚡', '☀️', '🌙', '🌸', '🍎', '📚', '✏️', '🔬', '🎨', '💻', '📱', '💡', '🔑', '💪', '🧠', '🤝', '✨', '📖', '🎯', '🏅', '🎪', '🎭', '🎵', '🎸', '🏀', '⚽', '🏈', '🎮', '🧩'];
    
    for (let i = 1; i <= 104; i++) {
        const div = document.createElement('div');
        div.className = 'sticker-item';
        const emoji = emojiList[i % emojiList.length];
        
        const url = `${STICKERS_BASE_URL}sticker${i}.png.png`;
        const img = new Image();
        
        img.onload = () => {
            div.innerHTML = `<img src="${url}" alt="Sticker ${i}" style="width: 100%; height: 60px; object-fit: contain;"><span>Sticker ${i}</span>`;
            div.addEventListener('click', () => addStickerToCanvas(url, i));
            loadedCount++;
        };
        
        img.onerror = () => {
            const fallbackUrl = `${STICKERS_BASE_URL}sticker${i}.png`;
            const fallbackImg = new Image();
            fallbackImg.onload = () => {
                div.innerHTML = `<img src="${fallbackUrl}" alt="Sticker ${i}" style="width: 100%; height: 60px; object-fit: contain;"><span>Sticker ${i}</span>`;
                div.addEventListener('click', () => addStickerToCanvas(fallbackUrl, i));
                loadedCount++;
            };
            fallbackImg.onerror = () => {
                div.innerHTML = `<span style="font-size: 48px;">${emoji}</span><span>Sticker ${i}</span>`;
                div.addEventListener('click', () => addEmojiSticker(emoji, i));
                loadedCount++;
            };
            fallbackImg.src = fallbackUrl;
        };
        
        img.src = url;
        container.appendChild(div);
    }
    
    stickersContainer.appendChild(container);
    setTimeout(() => showToast(`✅ ${loadedCount} stickers loaded!`), 3000);
}

function addStickerToCanvas(url, num) {
    showLoading(true);
    fabric.Image.fromURL(url, (img) => {
        if (img) {
            img.scaleToWidth(120);
            img.set({ left: canvas.width / 2 - 60, top: canvas.height / 2 - 60, id: 'sticker_' + Date.now() });
            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
            saveToHistory();
            showToast(`✅ Sticker ${num} added!`);
        } else {
            addEmojiSticker('🎨', num);
        }
        showLoading(false);
    }, () => {
        addEmojiSticker('🎨', num);
        showLoading(false);
    });
}

function addEmojiSticker(emoji, num) {
    const text = new fabric.Text(emoji, {
        left: canvas.width / 2 - 30, top: canvas.height / 2 - 30,
        fontSize: 64, fontFamily: 'Segoe UI Emoji',
        id: 'sticker_emoji_' + Date.now()
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
    
    const icons = ['fa-star', 'fa-heart', 'fa-bell', 'fa-calendar', 'fa-clock', 'fa-envelope', 'fa-phone', 'fa-user', 'fa-book', 'fa-graduation-cap'];
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
        case 'rect': obj = new fabric.Rect({ left, top, width: shape.w, height: shape.h, fill: shape.color }); break;
        case 'circle': obj = new fabric.Circle({ left, top, radius: shape.r, fill: shape.color }); break;
        case 'triangle': obj = new fabric.Triangle({ left, top, width: shape.w, height: shape.h, fill: shape.color }); break;
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
            obj = new fabric.Path('M 0,-30 C 20,-50 50,-20 0,30 C -50,-20 -20,-50 0,-30 Z', { left, top, fill: shape.color, scaleX: 0.8, scaleY: 0.8 });
            break;
        case 'diamond':
            obj = new fabric.Polygon([{ x: 0, y: -30 }, { x: 30, y: 0 }, { x: 0, y: 30 }, { x: -30, y: 0 }], { left, top, fill: shape.color });
            break;
        default: obj = new fabric.Rect({ left, top, width: 60, height: 60, fill: '#2563eb' });
    }
    
    obj.id = 'shape_' + Date.now();
    canvas.add(obj);
    canvas.setActiveObject(obj);
    canvas.renderAll();
    saveToHistory();
    showToast(`✅ Added ${shape.name}`);
}

function addIcon(iconClass) {
    const iconMap = { 'fa-star': '★', 'fa-heart': '❤️', 'fa-bell': '🔔', 'fa-calendar': '📅', 'fa-clock': '🕐', 'fa-envelope': '✉️', 'fa-phone': '📞', 'fa-user': '👤', 'fa-book': '📖', 'fa-graduation-cap': '🎓' };
    const char = iconMap[iconClass] || '◆';
    const left = Math.random() * (canvas.width - 150) + 100;
    const top = Math.random() * (canvas.height - 150) + 100;
    const text = new fabric.Text(char, { left, top, fontSize: 48, fontFamily: 'Segoe UI Emoji', fill: '#2563eb' });
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
    const rect = new fabric.Rect({ left, top, width: 200, height: 200, fill: 'transparent', stroke: frame.color, strokeWidth: frame.width, strokeDashArray: dashArray });
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
        left: canvas.width / 2, top: canvas.height / 2,
        fontSize: parseInt(document.getElementById('fontSize')?.value) || 32,
        fontFamily: document.getElementById('fontSelect')?.value || 'Inter',
        fill: document.getElementById('textColor')?.value || '#1e293b',
        originX: 'center', originY: 'center'
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
    obj.set({ fontFamily: document.getElementById('fontSelect')?.value, fontSize: parseInt(document.getElementById('fontSize')?.value), fill: document.getElementById('textColor')?.value });
    canvas.renderAll();
    saveToHistory();
}

document.getElementById('fontSelect')?.addEventListener('change', updateSelectedText);
document.getElementById('fontSize')?.addEventListener('input', (e) => { document.getElementById('fontSizeVal').innerText = e.target.value; updateSelectedText(); });
document.getElementById('textColor')?.addEventListener('input', updateSelectedText);
document.getElementById('textBoldBtn')?.addEventListener('click', () => { const obj = canvas.getActiveObject(); if (obj && obj.type === 'text') { obj.set('fontWeight', obj.fontWeight === 'bold' ? 'normal' : 'bold'); canvas.renderAll(); saveToHistory(); } });
document.getElementById('textItalicBtn')?.addEventListener('click', () => { const obj = canvas.getActiveObject(); if (obj && obj.type === 'text') { obj.set('fontStyle', obj.fontStyle === 'italic' ? 'normal' : 'italic'); canvas.renderAll(); saveToHistory(); } });
document.getElementById('textUnderlineBtn')?.addEventListener('click', () => { const obj = canvas.getActiveObject(); if (obj && obj.type === 'text') { obj.set('underline', !obj.underline); canvas.renderAll(); saveToHistory(); } });
document.querySelectorAll('.align-btn').forEach(btn => { btn.addEventListener('click', () => { const obj = canvas.getActiveObject(); if (obj && obj.type === 'text') { obj.set('textAlign', btn.dataset.align); canvas.renderAll(); saveToHistory(); showToast(`Text aligned ${btn.dataset.align}`); } }); });

// ========================================
// BACKGROUND MANAGEMENT
// ========================================
document.getElementById('applyColorBtn')?.addEventListener('click', () => { canvas.setBackgroundColor(document.getElementById('bgSolidColor').value, () => canvas.renderAll()); saveToHistory(); showToast('Background color applied'); });
document.getElementById('applyImageBtn')?.addEventListener('click', () => { const file = document.getElementById('bgImageUpload')?.files[0]; if (!file) { showToast('Select an image first'); return; } const reader = new FileReader(); reader.onload = (ev) => { fabric.Image.fromURL(ev.target.result, (img) => { canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas)); saveToHistory(); showToast('Background image applied'); }); }; reader.readAsDataURL(file); });

function loadGradients() {
    const gradients = ['linear-gradient(135deg, #667eea, #764ba2)', 'linear-gradient(135deg, #f093fb, #f5576c)', 'linear-gradient(135deg, #4facfe, #00f2fe)', 'linear-gradient(135deg, #43e97b, #38f9d7)', 'linear-gradient(135deg, #1e293b, #0f172a)', 'linear-gradient(135deg, #ff6b6b, #c92a2a)', 'linear-gradient(135deg, #11998e, #38ef7d)'];
    const grid = document.getElementById('gradientsGrid');
    if (grid) {
        grid.innerHTML = gradients.map(g => `<div class="gradient-item" style="background: ${g};" data-gradient="${g}"></div>`).join('');
        document.querySelectorAll('.gradient-item').forEach(item => { item.addEventListener('click', () => { canvas.setBackgroundColor(item.dataset.gradient, () => canvas.renderAll()); saveToHistory(); showToast('Gradient applied'); }); });
    }
}

// ========================================
// UPLOAD IMAGE
// ========================================
document.getElementById('uploadImageBtn')?.addEventListener('click', () => { const file = document.getElementById('imageUpload')?.files[0]; if (!file) { showToast('Select an image first'); return; } const reader = new FileReader(); reader.onload = (ev) => { fabric.Image.fromURL(ev.target.result, (img) => { img.scaleToWidth(200); img.id = 'uploaded_' + Date.now(); canvas.add(img); canvas.setActiveObject(img); canvas.renderAll(); saveToHistory(); showToast('Image added to canvas'); }); }; reader.readAsDataURL(file); });
document.getElementById('editPosterBtn')?.addEventListener('click', () => { const file = document.getElementById('posterUpload')?.files[0]; if (!file) { showToast('Select a poster to edit'); return; } const reader = new FileReader(); reader.onload = (ev) => { fabric.Image.fromURL(ev.target.result, (img) => { img.scaleToWidth(canvas.width); img.set({ left: 0, top: 0 }); canvas.clear(); canvas.add(img); canvas.renderAll(); saveToHistory(); showToast('Poster loaded!'); }); }; reader.readAsDataURL(file); });

// ========================================
// AI QUOTE GENERATION
// ========================================
const LOCAL_QUOTES = { education: [{ text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" }], love: [{ text: "Where there is love there is life.", author: "Mahatma Gandhi" }], success: [{ text: "Success is not final, failure is not fatal.", author: "Winston Churchill" }], default: [{ text: "Creativity is intelligence having fun.", author: "Albert Einstein" }] };

document.getElementById('generateQuoteBtn')?.addEventListener('click', async () => {
    const prompt = document.getElementById('aiPrompt')?.value;
    if (!prompt) { showToast('Please enter a topic'); return; }
    showLoading(true);
    try {
        const response = await fetch(`${API_BASE}/generate-quote`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: prompt, tool_slug: currentToolSlug }) });
        let quoteText = '', quoteAuthor = '';
        if (response.ok) { const data = await response.json(); quoteText = data.quote || data.text; quoteAuthor = data.author || 'Grok AI'; }
        else { const fallback = getLocalQuote(prompt); quoteText = fallback.text; quoteAuthor = fallback.author; }
        const text = new fabric.Text(`"${quoteText}"\n\n- ${quoteAuthor}`, { left: canvas.width / 2, top: canvas.height / 2, fontSize: 24, fontFamily: 'Inter', fill: '#1e293b', textAlign: 'center', originX: 'center', originY: 'center', id: 'ai_quote_' + Date.now() });
        canvas.add(text); canvas.setActiveObject(text); canvas.renderAll(); saveToHistory(); showToast('✨ AI quote added!');
    } catch (error) { const fallback = getLocalQuote(prompt); const text = new fabric.Text(`"${fallback.text}"\n\n- ${fallback.author}`, { left: canvas.width / 2, top: canvas.height / 2, fontSize: 24, fontFamily: 'Inter', fill: '#1e293b', textAlign: 'center', originX: 'center', originY: 'center' }); canvas.add(text); canvas.renderAll(); saveToHistory(); showToast('✨ Quote added!'); }
    finally { showLoading(false); }
});

function getLocalQuote(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    let category = 'default';
    if (lowerPrompt.includes('education')) category = 'education';
    else if (lowerPrompt.includes('love')) category = 'love';
    else if (lowerPrompt.includes('success')) category = 'success';
    const quotes = LOCAL_QUOTES[category] || LOCAL_QUOTES.default;
    return quotes[Math.floor(Math.random() * quotes.length)];
}

// ========================================
// UNDO / REDO
// ========================================
function saveToHistory() {
    const state = JSON.stringify(canvas.toJSON());
    if (historyIndex < historyStates.length - 1) historyStates = historyStates.slice(0, historyIndex + 1);
    historyStates.push(state);
    historyIndex = historyStates.length - 1;
    if (historyStates.length > 50) { historyStates.shift(); historyIndex--; }
}

function undo() { if (historyIndex > 0) { historyIndex--; const state = JSON.parse(historyStates[historyIndex]); canvas.loadFromJSON(state, () => { canvas.renderAll(); updateLayersList(); showToast('↩️ Undo'); }); } }
function redo() { if (historyIndex < historyStates.length - 1) { historyIndex++; const state = JSON.parse(historyStates[historyIndex]); canvas.loadFromJSON(state, () => { canvas.renderAll(); updateLayersList(); showToast('↪️ Redo'); }); } }

// ========================================
// LAYERS MANAGEMENT
// ========================================
function updateLayersList() {
    const objects = canvas.getObjects();
    const layersList = document.getElementById('layersList');
    if (!layersList) return;
    const activeObj = canvas.getActiveObject();
    layersList.innerHTML = objects.map((obj, i) => `<div class="layer-item ${obj === activeObj ? 'selected' : ''}" data-index="${i}"><i class="fas ${obj.type === 'text' ? 'fa-font' : 'fa-shape'}"></i><span>${obj.type || 'element'} ${i + 1}</span></div>`).join('');
    document.querySelectorAll('.layer-item').forEach(item => { item.addEventListener('click', () => { const index = parseInt(item.dataset.index); canvas.setActiveObject(objects[index]); canvas.renderAll(); updateLayersList(); }); });
}

document.getElementById('bringForwardBtn')?.addEventListener('click', () => { const obj = canvas.getActiveObject(); if (obj) canvas.bringForward(obj); updateLayersList(); });
document.getElementById('sendBackwardBtn')?.addEventListener('click', () => { const obj = canvas.getActiveObject(); if (obj) canvas.sendBackwards(obj); updateLayersList(); });
document.getElementById('deleteSelectedBtn')?.addEventListener('click', () => { const obj = canvas.getActiveObject(); if (obj) { canvas.remove(obj); selectedObjectId = null; updateLayersList(); saveToHistory(); showToast('Element deleted'); } });

// ========================================
// EXPORT FUNCTIONS
// ========================================
async function exportAs(format) {
    showLoading(true);
    try {
        const dataURL = canvas.toDataURL({ format: format === 'jpg' ? 'jpeg' : 'png', multiplier: 2 });
        if (format === 'png' || format === 'jpg') { const link = document.createElement('a'); link.download = `poster.${format}`; link.href = dataURL; link.click(); }
        else if (format === 'pdf') { const { jsPDF } = window.jspdf; const pdf = new jsPDF({ orientation: canvas.width > canvas.height ? 'landscape' : 'portrait' }); pdf.addImage(dataURL, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight()); pdf.save('poster.pdf'); }
        showToast(`${format.toUpperCase()} exported!`);
    } catch (error) { showToast('Export failed'); }
    finally { showLoading(false); }
}
document.getElementById('exportPNG')?.addEventListener('click', () => exportAs('png'));
document.getElementById('exportJPG')?.addEventListener('click', () => exportAs('jpg'));
document.getElementById('exportPDF')?.addEventListener('click', () => exportAs('pdf'));

// ========================================
// API INTEGRATIONS
// ========================================
async function loadUsageFromAPI() { try { const response = await fetch(`${API_BASE}/usage?tool_slug=${currentToolSlug}`); if (response.ok) { const data = await response.json(); const usageSpan = document.getElementById('usageCount'); if (usageSpan) usageSpan.innerText = data.count || 0; } } catch (error) { const count = localStorage.getItem(`${currentToolSlug}_usage`) || '0'; const usageSpan = document.getElementById('usageCount'); if (usageSpan) usageSpan.innerText = count; } }
async function trackUsage() { try { await fetch(`${API_BASE}/increment-usage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tool_slug: currentToolSlug, user_id: userId }) }); } catch (error) { let count = parseInt(localStorage.getItem(`${currentToolSlug}_usage`) || '0'); count++; localStorage.setItem(`${currentToolSlug}_usage`, count); const usageSpan = document.getElementById('usageCount'); if (usageSpan) usageSpan.innerText = count; } }
async function loadReactionsFromAPI() { try { const response = await fetch(`${API_BASE}/reactions?tool_slug=${currentToolSlug}`); if (response.ok) { const data = await response.json(); if (data.reactions) updateReactionUI(data.reactions); } } catch (error) { const saved = localStorage.getItem(`${currentToolSlug}_reactions`); if (saved) updateReactionUI(JSON.parse(saved)); } }
async function addReactionToAPI(reactionType) { const emojiMap = { 'like': '👍', 'love': '❤️', 'wow': '😮', 'sad': '😢', 'angry': '😠', 'laugh': '😂', 'celebrate': '🎉' }; if (userReacted[reactionType]) { showToast('You already reacted with this emoji'); return; } try { const response = await fetch(`${API_BASE}/add-reaction`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tool_slug: currentToolSlug, emoji: emojiMap[reactionType], user_id: userId }) }); if (response.ok) { const data = await response.json(); if (data.counts) updateReactionUI(data.counts); userReacted[reactionType] = true; showToast('Reaction added!'); } else { addReactionToLocal(reactionType); } } catch (error) { addReactionToLocal(reactionType); } }
function addReactionToLocal(reactionType) { if (userReacted[reactionType]) return; userReacted[reactionType] = true; currentReactions[reactionType] = (currentReactions[reactionType] || 0) + 1; localStorage.setItem(`${currentToolSlug}_reactions`, JSON.stringify(currentReactions)); updateReactionUI(currentReactions); showToast('Reaction added (offline)'); }
function updateReactionUI(reactions) { document.getElementById('likeCount') && (document.getElementById('likeCount').innerText = reactions.like || 0); document.getElementById('loveCount') && (document.getElementById('loveCount').innerText = reactions.love || 0); document.getElementById('wowCount') && (document.getElementById('wowCount').innerText = reactions.wow || 0); document.getElementById('sadCount') && (document.getElementById('sadCount').innerText = reactions.sad || 0); document.getElementById('angryCount') && (document.getElementById('angryCount').innerText = reactions.angry || 0); document.getElementById('laughCount') && (document.getElementById('laughCount').innerText = reactions.laugh || 0); document.getElementById('celebrateCount') && (document.getElementById('celebrateCount').innerText = reactions.celebrate || 0); }
document.querySelectorAll('.reaction-btn').forEach(btn => { btn.addEventListener('click', () => { const reaction = btn.dataset.reaction; addReactionToAPI(reaction); }); });

// ========================================
// SOCIAL SHARING
// ========================================
async function trackShare(platform) { try { await fetch(`${API_BASE}/add-share`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tool_slug: currentToolSlug, platform: platform, user_id: userId }) }); } catch (error) {} const shareUrl = window.location.href; if (platform === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank'); else if (platform === 'twitter') window.open(`https://twitter.com/intent/tweet?text=Check%20out%20this%20poster!&url=${encodeURIComponent(shareUrl)}`, '_blank'); else if (platform === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent('Check out this poster! ' + shareUrl)}`, '_blank'); else if (platform === 'linkedin') window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}`, '_blank'); else if (platform === 'email') window.location.href = `mailto:?subject=Check out this Poster&body=${encodeURIComponent(shareUrl)}`; else if (platform === 'copy') { navigator.clipboard.writeText(shareUrl); showToast('Link copied!'); } showToast('Thanks for sharing!'); }
document.querySelectorAll('.share-btn').forEach(btn => { btn.addEventListener('click', () => { const platform = btn.dataset.platform; trackShare(platform); }); });

async function loadStatsFromAPI() { try { const response = await fetch(`${API_BASE}/stats?tool_slug=${currentToolSlug}`); if (response.ok) { const data = await response.json(); document.getElementById('statUsage') && (document.getElementById('statUsage').innerText = data.totalUsage || 0); document.getElementById('statShares') && (document.getElementById('statShares').innerText = data.totalShares || 0); document.getElementById('statUsers') && (document.getElementById('statUsers').innerText = data.uniqueUsers || 0); } } catch (error) { console.log('Stats API failed'); } }

// ========================================
// UI HELPERS
// ========================================
function showToast(message) { const toast = document.getElementById('toast'); if (!toast) return; toast.innerText = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3000); }
function showLoading(show) { const modal = document.getElementById('loadingModal'); if (!modal) return; if (show) modal.classList.add('active'); else modal.classList.remove('active'); }

// ========================================
// DARK MODE
// ========================================
document.getElementById('darkModeBtn')?.addEventListener('click', () => { darkMode = !darkMode; document.body.classList.toggle('dark-mode', darkMode); localStorage.setItem('darkMode', darkMode); const btn = document.getElementById('darkModeBtn'); if (btn) btn.innerHTML = darkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>'; showToast(darkMode ? 'Dark mode on' : 'Light mode on'); });

// ========================================
// SCROLL BUTTONS
// ========================================
document.getElementById('scrollUpBtn')?.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
document.getElementById('scrollDownBtn')?.addEventListener('click', () => { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); });

// ========================================
// SIDEBAR & PANEL TOGGLES
// ========================================
document.getElementById('toggleSidebarBtn')?.addEventListener('click', () => { document.getElementById('sidebar')?.classList.toggle('collapsed'); });
document.getElementById('closeSidebarBtn')?.addEventListener('click', () => { document.getElementById('sidebar')?.classList.add('collapsed'); });
document.getElementById('toggleLayersBtn')?.addEventListener('click', () => { document.getElementById('layersPanel')?.classList.toggle('collapsed'); });
document.getElementById('undoBtn')?.addEventListener('click', undo);
document.getElementById('redoBtn')?.addEventListener('click', redo);

// Navigation Tabs
document.querySelectorAll('.nav-btn').forEach(btn => { btn.addEventListener('click', () => { const navName = btn.dataset.nav; document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active')); document.querySelectorAll('.nav-panel').forEach(p => p.classList.remove('active')); btn.classList.add('active'); const panel = document.getElementById(`${navName}-panel`); if (panel) panel.classList.add('active'); }); });

// Template search
document.getElementById('templateSearch')?.addEventListener('input', (e) => { const search = e.target.value.toLowerCase(); document.querySelectorAll('.template-card').forEach(card => { const name = card.querySelector('.template-name')?.innerText.toLowerCase() || ''; card.style.display = name.includes(search) ? 'flex' : 'none'; }); });

function setupEventListeners() { console.log('✅ All event listeners configured'); }

console.log('========================================');
console.log('🎉 Teacher Resource Finder Ready!');
console.log('📁 Templates: 1-36');
console.log('📁 Stickers: 1-104');
console.log('========================================');
