// ========================================
// POSTERFORGE PRO - COMPLETE JAVASCRIPT
// FULLY INTEGRATED: TiDB + Vercel + Grok API + Reactions + Usage Counter
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

const GITHUB_BASE = 'https://raw.githubusercontent.com/Uzair-hameed/MagicRills.github.io/main/';
const TEMPLATES_BASE_URL = GITHUB_BASE + 'templates/';
const STICKERS_BASE_URL = GITHUB_BASE + 'stickers/';
const TOTAL_TEMPLATES = 115;
const TOTAL_STICKERS = 100;
const API_BASE = '/api';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('PosterForge Pro Initializing...');
    initializeCanvas();
    
    if (darkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeBtn').innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    localStorage.setItem('userId', userId);
    
    await loadAllTemplates();
    await loadAllStickers();
    loadElements();
    loadGradients();
    loadSavedImages();
    await loadUsageFromAPI();
    await trackUsage();
    await loadReactionsFromAPI();
    setupEventListeners();
    saveToHistory();
    showToast('✨ PosterForge Pro Ready!');
});

function initializeCanvas() {
    canvas = new fabric.Canvas('canvas', {
        width: 800, height: 1000, backgroundColor: '#ffffff',
        preserveObjectStacking: true, selection: true
    });
    
    canvas.add(new fabric.Text('Welcome to PosterForge Pro!\n\n✨ Click on templates or stickers to get started!\nDrag to move | Click to select | Resize from corners', {
        left: 400, top: 450, fontSize: 18, fontFamily: 'Inter', fill: '#1e293b',
        textAlign: 'center', originX: 'center', originY: 'center'
    }));
    canvas.renderAll();
    
    canvas.on('selection:created', (e) => { if (e.selected && e.selected[0]) { selectedObjectId = e.selected[0].id; updateLayersList(); } });
    canvas.on('selection:updated', (e) => { if (e.selected && e.selected[0]) { selectedObjectId = e.selected[0].id; updateLayersList(); } });
    canvas.on('selection:cleared', () => { selectedObjectId = null; updateLayersList(); });
    canvas.on('object:modified', () => saveToHistory());
    canvas.on('object:added', () => { saveToHistory(); updateLayersList(); });
    canvas.on('object:removed', () => { saveToHistory(); updateLayersList(); });
}

async function loadAllTemplates() {
    const grid = document.getElementById('templatesGrid');
    if (!grid) return;
    
    grid.innerHTML = '<div style="text-align:center; padding:20px;">⏳ Scanning templates...</div>';
    const existingTemplates = [];
    
    for (let i = 1; i <= TOTAL_TEMPLATES; i++) {
        try {
            const res = await fetch(`${TEMPLATES_BASE_URL}template${i}.json`, { method: 'HEAD' });
            if (res.ok) existingTemplates.push(i);
        } catch(e) {}
        if (i % 20 === 0) await new Promise(r => setTimeout(r, 10));
    }
    
    if (existingTemplates.length === 0) {
        grid.innerHTML = '<div style="text-align:center; padding:20px; color: red;">❌ No templates found!</div>';
        return;
    }
    
    grid.innerHTML = '';
    for (const num of existingTemplates) {
        try {
            const res = await fetch(`${TEMPLATES_BASE_URL}template${num}.json`);
            const data = await res.json();
            const card = document.createElement('div');
            card.className = 'template-card';
            card.innerHTML = `
                <div class="template-preview"><i class="fas fa-palette"></i></div>
                <div class="template-name">Template ${num}</div>
            `;
            card.addEventListener('click', () => {
                canvas.loadFromJSON(data, () => { canvas.renderAll(); saveToHistory(); showToast(`✨ Template ${num} loaded!`); });
            });
            grid.appendChild(card);
        } catch(e) {}
    }
    showToast(`✅ ${existingTemplates.length} templates loaded!`);
}

async function loadAllStickers() {
    const stickersGrid = document.getElementById('stickersGrid');
    if (!stickersGrid) return;
    
    stickersGrid.innerHTML = '<div class="stickers-title"><i class="fas fa-smile"></i> My Stickers</div>';
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(4, 1fr)';
    container.style.gap = '12px';
    
    let loaded = 0, total = 0;
    for (let i = 1; i <= TOTAL_STICKERS; i++) {
        const url = `${STICKERS_BASE_URL}sticker${i}.png.png`;
        const img = new Image();
        img.onload = () => {
            const div = document.createElement('div');
            div.className = 'sticker-item';
            div.innerHTML = `<img src="${url}" style="width:100%;"><span>Sticker ${i}</span>`;
            div.addEventListener('click', () => addStickerToCanvas(url, i));
            container.appendChild(div);
            loaded++;
            if (loaded === total || (loaded === 0 && i === TOTAL_STICKERS)) {
                stickersGrid.appendChild(container);
            }
        };
        img.src = url;
        total++;
    }
    setTimeout(() => stickersGrid.appendChild(container), 2000);
}

function addStickerToCanvas(url, num) {
    fabric.Image.fromURL(url, (img) => {
        img.scaleToWidth(120);
        img.set({ left: canvas.width/2 - 60, top: canvas.height/2 - 60 });
        canvas.add(img);
        canvas.renderAll();
        saveToHistory();
        showToast(`✅ Sticker ${num} added!`);
    });
}

function loadElements() {
    const shapes = [
        { name: 'Square', icon: 'fa-square', type: 'rect', w: 80, h: 80 },
        { name: 'Circle', icon: 'fa-circle', type: 'circle', r: 40 },
        { name: 'Rectangle', icon: 'fa-rectangle', type: 'rect', w: 120, h: 60 },
        { name: 'Triangle', icon: 'fa-triangle', type: 'triangle', w: 80, h: 80 },
        { name: 'Star', icon: 'fa-star', type: 'star' },
        { name: 'Heart', icon: 'fa-heart', type: 'heart' }
    ];
    const icons = ['fa-star', 'fa-heart', 'fa-bell', 'fa-calendar', 'fa-clock', 'fa-user', 'fa-book'];
    const emojis = ['⭐', '❤️', '🔥', '👑', '🌟', '💎', '🎈', '🎉', '🏆', '🌈'];
    const frames = [{ name: 'Basic', style: 'solid', w: 2 }, { name: 'Dashed', style: 'dashed', w: 2 }];
    
    const grid = document.getElementById('elementsGrid');
    let type = 'shapes';
    
    function render() {
        let html = '';
        if (type === 'shapes') {
            html = shapes.map(s => `<div class="element-card" data-shape='${JSON.stringify(s)}'><i class="fas ${s.icon}"></i><span>${s.name}</span></div>`).join('');
        } else if (type === 'icons') {
            html = icons.map(i => `<div class="element-card" data-icon="${i}"><i class="fas ${i}"></i><span>Icon</span></div>`).join('');
        } else if (type === 'stickers') {
            html = emojis.map(e => `<div class="element-card" data-sticker="${e}"><span style="font-size:28px;">${e}</span><span>Sticker</span></div>`).join('');
        } else {
            html = frames.map(f => `<div class="element-card" data-frame='${JSON.stringify(f)}'><i class="fas fa-border-all"></i><span>${f.name}</span></div>`).join('');
        }
        grid.innerHTML = html;
        
        document.querySelectorAll('[data-shape]').forEach(el => addShape(JSON.parse(el.dataset.shape)));
        document.querySelectorAll('[data-icon]').forEach(el => addIcon(el.dataset.icon));
        document.querySelectorAll('[data-sticker]').forEach(el => addEmoji(el.dataset.sticker));
        document.querySelectorAll('[data-frame]').forEach(el => addFrame(JSON.parse(el.dataset.frame)));
    }
    
    function addShape(s) {
        el.addEventListener('click', () => {
            let obj;
            if (s.type === 'rect') obj = new fabric.Rect({ left: 100, top: 100, width: s.w, height: s.h, fill: '#2563eb' });
            else if (s.type === 'circle') obj = new fabric.Circle({ left: 100, top: 100, radius: s.r, fill: '#2563eb' });
            else if (s.type === 'triangle') obj = new fabric.Triangle({ left: 100, top: 100, width: s.w, height: s.h, fill: '#2563eb' });
            else if (s.type === 'star') {
                const pts = [];
                for (let i = 0; i < 10; i++) {
                    const a = (i * 36 - 90) * Math.PI/180;
                    const r = i%2===0 ? 40 : 20;
                    pts.push({ x: Math.cos(a)*r, y: Math.sin(a)*r });
                }
                obj = new fabric.Polygon(pts, { left: 100, top: 100, fill: '#f59e0b' });
            } else if (s.type === 'heart') {
                obj = new fabric.Path('M 0,-30 C 20,-50 50,-20 0,30 C -50,-20 -20,-50 0,-30 Z', { left: 100, top: 100, fill: '#ef4444', scaleX: 0.8, scaleY: 0.8 });
            }
            if (obj) { canvas.add(obj); canvas.renderAll(); saveToHistory(); showToast(`✅ ${s.name} added`); }
        });
    }
    
    function addIcon(c) {
        el.addEventListener('click', () => {
            const map = { 'fa-star':'★', 'fa-heart':'❤️', 'fa-bell':'🔔', 'fa-calendar':'📅', 'fa-clock':'🕐', 'fa-user':'👤', 'fa-book':'📖' };
            const t = new fabric.Text(map[c] || '◆', { left: 100, top: 100, fontSize: 48, fill: '#2563eb' });
            canvas.add(t); canvas.renderAll(); saveToHistory(); showToast('✅ Icon added');
        });
    }
    
    function addEmoji(e) {
        el.addEventListener('click', () => {
            const t = new fabric.Text(e, { left: 100, top: 100, fontSize: 48 });
            canvas.add(t); canvas.renderAll(); saveToHistory(); showToast('✅ Sticker added');
        });
    }
    
    function addFrame(f) {
        el.addEventListener('click', () => {
            const r = new fabric.Rect({ left: 100, top: 100, width: 200, height: 200, fill: 'transparent', stroke: '#2563eb', strokeWidth: f.w, strokeDashArray: f.style==='dashed'?[10,5]:null });
            canvas.add(r); canvas.renderAll(); saveToHistory(); showToast(`✅ ${f.name} frame added`);
        });
    }
    
    render();
    document.querySelectorAll('[data-elem-type]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-elem-type]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            type = btn.dataset.elemType;
            render();
        });
    });
}

document.getElementById('addTextBtn')?.addEventListener('click', () => {
    const val = document.getElementById('customText')?.value || 'Your Text';
    if (!val.trim()) return;
    const t = new fabric.Text(val, { left: canvas.width/2, top: canvas.height/2, fontSize: 32, fontFamily: 'Inter', fill: '#1e293b', originX: 'center', originY: 'center' });
    canvas.add(t); canvas.setActiveObject(t); canvas.renderAll(); saveToHistory(); showToast('✅ Text added');
});

function updateSelectedText() {
    const obj = canvas.getActiveObject();
    if (obj && obj.type === 'text') {
        obj.set({
            fontFamily: document.getElementById('fontSelect')?.value,
            fontSize: parseInt(document.getElementById('fontSize')?.value),
            fill: document.getElementById('textColor')?.value
        });
        canvas.renderAll();
        saveToHistory();
    }
}

document.getElementById('fontSelect')?.addEventListener('change', updateSelectedText);
document.getElementById('fontSize')?.addEventListener('input', (e) => {
    document.getElementById('fontSizeVal').innerText = e.target.value;
    updateSelectedText();
});
document.getElementById('textColor')?.addEventListener('input', updateSelectedText);
document.getElementById('textBoldBtn')?.addEventListener('click', () => {
    const obj = canvas.getActiveObject();
    if (obj && obj.type === 'text') obj.set('fontWeight', obj.fontWeight === 'bold' ? 'normal' : 'bold');
    canvas.renderAll();
});
document.getElementById('applyColorBtn')?.addEventListener('click', () => {
    canvas.setBackgroundColor(document.getElementById('bgSolidColor').value, () => canvas.renderAll());
    saveToHistory();
    showToast('Background color applied');
});

function loadGradients() {
    const gradients = [
        'linear-gradient(135deg, #667eea, #764ba2)', 'linear-gradient(135deg, #f093fb, #f5576c)',
        'linear-gradient(135deg, #4facfe, #00f2fe)', 'linear-gradient(135deg, #43e97b, #38f9d7)',
        'linear-gradient(135deg, #1e293b, #0f172a)', 'linear-gradient(135deg, #ff6b6b, #c92a2a)',
        'linear-gradient(135deg, #11998e, #38ef7d)'
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

document.getElementById('uploadImageBtn')?.addEventListener('click', () => {
    const file = document.getElementById('imageUpload')?.files[0];
    if (!file) { showToast('Select an image first'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
        fabric.Image.fromURL(e.target.result, (img) => {
            img.scaleToWidth(200);
            canvas.add(img);
            canvas.renderAll();
            saveToHistory();
            showToast('Image added');
        });
    };
    reader.readAsDataURL(file);
});

function loadSavedImages() {
    const container = document.getElementById('uploadedImagesList');
    if (!container) return;
    const saved = JSON.parse(localStorage.getItem('uploaded_images') || '[]');
    container.innerHTML = saved.map(img => `<img src="${img}" class="uploaded-img">`).join('');
}

function saveToHistory() {
    const state = JSON.stringify(canvas.toJSON());
    if (historyIndex < historyStates.length - 1) historyStates = historyStates.slice(0, historyIndex + 1);
    historyStates.push(state);
    historyIndex = historyStates.length - 1;
    if (historyStates.length > 50) { historyStates.shift(); historyIndex--; }
}

function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        canvas.loadFromJSON(JSON.parse(historyStates[historyIndex]), () => { canvas.renderAll(); updateLayersList(); showToast('↩️ Undo'); });
    }
}

function redo() {
    if (historyIndex < historyStates.length - 1) {
        historyIndex++;
        canvas.loadFromJSON(JSON.parse(historyStates[historyIndex]), () => { canvas.renderAll(); updateLayersList(); showToast('↪️ Redo'); });
    }
}

function updateLayersList() {
    const objs = canvas.getObjects();
    const list = document.getElementById('layersList');
    if (!list) return;
    const active = canvas.getActiveObject();
    list.innerHTML = objs.map((o, i) => `<div class="layer-item ${o === active ? 'selected' : ''}" data-index="${i}"><i class="fas ${o.type === 'text' ? 'fa-font' : 'fa-shape'}"></i><span>${o.type || 'element'} ${i+1}</span></div>`).join('');
    document.querySelectorAll('.layer-item').forEach(item => {
        item.addEventListener('click', () => {
            canvas.setActiveObject(objs[parseInt(item.dataset.index)]);
            canvas.renderAll();
            updateLayersList();
        });
    });
}

document.getElementById('bringForwardBtn')?.addEventListener('click', () => { const o = canvas.getActiveObject(); if (o) canvas.bringForward(o); updateLayersList(); });
document.getElementById('sendBackwardBtn')?.addEventListener('click', () => { const o = canvas.getActiveObject(); if (o) canvas.sendBackwards(o); updateLayersList(); });
document.getElementById('deleteSelectedBtn')?.addEventListener('click', () => { const o = canvas.getActiveObject(); if (o) { canvas.remove(o); updateLayersList(); saveToHistory(); showToast('Element deleted'); } });
document.getElementById('undoBtn')?.addEventListener('click', undo);
document.getElementById('redoBtn')?.addEventListener('click', redo);

document.getElementById('generateQuoteBtn')?.addEventListener('click', async () => {
    const prompt = document.getElementById('aiPrompt')?.value;
    if (!prompt) { showToast('Enter a topic'); return; }
    showLoading(true);
    try {
        const res = await fetch(`${API_BASE}/generate-slos`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subject: prompt, topic: prompt })
        });
        let quote = `"${prompt} is the key to success. Keep pushing forward!" - AI Generator`;
        if (res.ok) {
            const data = await res.json();
            if (data.slos && data.slos[0]) quote = `"${data.slos[0]}" - AI Assistant`;
        }
        const t = new fabric.Text(quote, { left: canvas.width/2, top: canvas.height/2, fontSize: 24, fontFamily: 'Inter', textAlign: 'center', originX: 'center', originY: 'center' });
        canvas.add(t); canvas.renderAll(); saveToHistory(); showToast('✨ AI quote generated!');
    } catch(e) { showToast('AI quote generated (offline)'); }
    finally { showLoading(false); }
});

async function exportAs(f) {
    showLoading(true);
    try {
        const d = canvas.toDataURL({ format: f === 'jpg' ? 'jpeg' : 'png', multiplier: 2 });
        if (f === 'png' || f === 'jpg') { const a = document.createElement('a'); a.download = `poster.${f}`; a.href = d; a.click(); }
        else if (f === 'pdf') {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ orientation: canvas.width > canvas.height ? 'landscape' : 'portrait' });
            pdf.addImage(d, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
            pdf.save('poster.pdf');
        }
        showToast(`${f.toUpperCase()} exported!`);
    } catch(e) { showToast('Export failed'); }
    finally { showLoading(false); }
}

document.getElementById('exportPNG')?.addEventListener('click', () => exportAs('png'));
document.getElementById('exportJPG')?.addEventListener('click', () => exportAs('jpg'));
document.getElementById('exportPDF')?.addEventListener('click', () => exportAs('pdf'));

document.getElementById('saveToLocal')?.addEventListener('click', () => {
    const designs = JSON.parse(localStorage.getItem('saved_designs') || '[]');
    designs.unshift({ id: Date.now(), data: JSON.stringify(canvas.toJSON()) });
    localStorage.setItem('saved_designs', JSON.stringify(designs.slice(0, 20)));
    showToast('Design saved to browser!');
});

document.getElementById('loadFromLocal')?.addEventListener('click', () => {
    const designs = JSON.parse(localStorage.getItem('saved_designs') || '[]');
    if (designs.length === 0) { showToast('No saved designs'); return; }
    canvas.loadFromJSON(JSON.parse(designs[0].data), () => { canvas.renderAll(); updateLayersList(); saveToHistory(); showToast('Design loaded!'); });
});

async function loadUsageFromAPI() {
    try {
        const res = await fetch(`${API_BASE}/usage?tool_slug=${currentToolSlug}`);
        if (res.ok) { const d = await res.json(); document.getElementById('usageCount').innerText = d.count || 0; }
    } catch(e) { const c = localStorage.getItem(`${currentToolSlug}_usage`) || '0'; document.getElementById('usageCount').innerText = c; }
}
async function trackUsage() {
    try { await fetch(`${API_BASE}/increment-usage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tool_slug: currentToolSlug, user_id: userId }) }); }
    catch(e) { let c = parseInt(localStorage.getItem(`${currentToolSlug}_usage`) || '0'); c++; localStorage.setItem(`${currentToolSlug}_usage`, c); document.getElementById('usageCount').innerText = c; }
}
async function loadReactionsFromAPI() {
    try {
        const res = await fetch(`${API_BASE}/reactions?tool_slug=${currentToolSlug}`);
        if (res.ok) { const d = await res.json(); if (d.reactions) updateReactionUI(d.reactions); }
    } catch(e) { const s = localStorage.getItem(`${currentToolSlug}_reactions`); if (s) updateReactionUI(JSON.parse(s)); }
}
async function addReactionToAPI(type) {
    const map = { like:'👍', love:'❤️', wow:'😮', sad:'😢', laugh:'😂', celebrate:'🎉' };
    try {
        const res = await fetch(`${API_BASE}/add-reaction`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tool_slug: currentToolSlug, emoji: map[type], user_id: userId }) });
        if (res.ok) { const d = await res.json(); if (d.counts) updateReactionUI(d.counts); showToast('Reaction added!'); }
        else addReactionToLocal(type);
    } catch(e) { addReactionToLocal(type); }
}
function addReactionToLocal(type) {
    if (userReacted[type]) { showToast('Already reacted'); return; }
    userReacted[type] = true;
    currentReactions[type] = (currentReactions[type] || 0) + 1;
    localStorage.setItem(`${currentToolSlug}_reactions`, JSON.stringify(currentReactions));
    updateReactionUI(currentReactions);
    showToast('Reaction added (offline)');
}
function updateReactionUI(r) {
    document.getElementById('likeCount').innerText = r.like || 0;
    document.getElementById('loveCount').innerText = r.love || 0;
    document.getElementById('wowCount').innerText = r.wow || 0;
    document.getElementById('sadCount').innerText = r.sad || 0;
    document.getElementById('laughCount').innerText = r.laugh || 0;
    document.getElementById('celebrateCount').innerText = r.celebrate || 0;
}
document.querySelectorAll('.reaction-btn').forEach(btn => {
    btn.addEventListener('click', () => addReactionToAPI(btn.dataset.reaction));
});
async function trackShare(platform) {
    try { await fetch(`${API_BASE}/add-share`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tool_slug: currentToolSlug, platform, user_id: userId }) }); } catch(e) {}
    const url = window.location.href;
    if (platform === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    else if (platform === 'twitter') window.open(`https://twitter.com/intent/tweet?text=Check%20out%20my%20poster!&url=${encodeURIComponent(url)}`, '_blank');
    else if (platform === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent('Check out my poster! ' + url)}`, '_blank');
    else if (platform === 'copy') { navigator.clipboard.writeText(url); showToast('Link copied!'); }
    showToast('Thanks for sharing!');
}
document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', () => trackShare(btn.dataset.platform));
});

function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.innerText = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}
function showLoading(show) {
    const m = document.getElementById('loadingModal');
    if (!m) return;
    if (show) m.classList.add('active');
    else m.classList.remove('active');
}

document.getElementById('toggleSidebarBtn')?.addEventListener('click', () => document.getElementById('sidebar')?.classList.toggle('collapsed'));
document.getElementById('closeSidebarBtn')?.addEventListener('click', () => document.getElementById('sidebar')?.classList.add('collapsed'));
document.getElementById('toggleLayersBtn')?.addEventListener('click', () => document.getElementById('layersPanel')?.classList.toggle('collapsed'));
document.getElementById('darkModeBtn')?.addEventListener('click', () => {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode);
    const btn = document.getElementById('darkModeBtn');
    if (btn) btn.innerHTML = darkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    showToast(darkMode ? 'Dark mode on' : 'Light mode on');
});
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const nav = btn.dataset.nav;
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.nav-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`${nav}-panel`)?.classList.add('active');
    });
});
document.getElementById('templateSearch')?.addEventListener('input', (e) => {
    const s = e.target.value.toLowerCase();
    document.querySelectorAll('.template-card').forEach(c => {
        const n = c.querySelector('.template-name')?.innerText.toLowerCase() || '';
        c.style.display = n.includes(s) ? 'block' : 'none';
    });
});

function setupEventListeners() { console.log('✅ Event listeners ready'); }
console.log('🎉 PosterForge Pro Fully Loaded!');
