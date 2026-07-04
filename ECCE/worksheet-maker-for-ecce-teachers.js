// ============================================================
// CONFIGURATION
// ============================================================
const BASE_URL = "https://raw.githubusercontent.com/Uzair-hameed/MagicRills.github.io/main/ECCE/ecce-work-sheet-images/";
const TOOL_SLUG = "ecce-worksheet-maker";
const TOOL_NAME = "ECCE Worksheet Maker Pro";

// ============================================================
// IMAGE DATABASE
// ============================================================
const IMAGE_DB = {
    alphabet: ["letter A.png", "letter B.png", "Letter C.png", "letter D.png", "letter E.png", "letter F.png",
        "letter G.png", "letter H.png", "letter I.png", "letter J.png", "letter K.png", "letter L.png",
        "letter M.png", "letter N.png", "letter O.png", "letter P.png", "letter Q.png", "letter R.png",
        "letter S.png", "letter T.png", "letter U.png", "letter V.png", "letter W.png", "letter X.png",
        "letter Y.png", "letter Z.png"
    ],
    animals: ["cat.png", "dog1.png", "elephant.png", "lion.png", "tiger1.png", "monkey.png", "rabbit.png",
        "fox.png", "giraffe.png", "crocodile1.png", "bufalo.png", "donkey.png", "wolf1.png", "leopard.png"
    ],
    birds: ["crow.png", "parrot.png", "sparrow.png", "owl.png", "pigeon.png", "cuckoo.png", "falcon.png"],
    body: ["eyes.png", "nose.png", "ear.png", "leg.png", "arm.png", "hair.png", "foot.png", "finger.png",
        "lips.png", "neck.png", "tooth.png"
    ],
    foods: ["rice.png", "chapati.png", "chicken.png", "eggs.png", "samosa.png", "salt.png", "sugar.jpg.png",
        "cardamom.jpg.png"
    ],
    fruits: ["apple.png", "mango.png", "strawberry.png", "apricot.png", "plum.png", "peach.png",
        "cherry.jpg.png", "dates.jpg.png", "jamun.png", "jujube.png", "persimmon.png"
    ],
    vegetables: ["carrot.png", "tomato.png", "potato.png", "cucumber.png", "spinach.png", "cabbage.png",
        "onion1.png", "chilli.png", "beet-root.png", "bitter-gourd.png", "pumpkin.png", "radish.png"
    ],
    transportation: ["car.png", "bus.png", "train.png", "bike.png", "boat.png", "ship.png",
        "airplane-clipart-7.png", "truck.png", "van.png", "cycle.png"
    ],
    numbers: ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png", "9.png", "10.png",
        "11.png", "12.png", "13.png", "14.png", "15.png", "16.png", "17.png", "18.png", "19.png", "20.png"
    ],
    shapes: ["circle.png", "square.png", "triangle.png", "rectangle.png", "star.png", "heart.png",
        "diamond.png", "hexagon.png", "pentagon.png"
    ],
    occupations: ["doctor.png", "teacher.png", "farmer.png", "pilot.png", "nurse.png", "army.png", "tailor.png",
        "potter.png", "barber.png", "lawyer.png"
    ],
    insects: ["ant.png", "butterfuly.png.png", "caterpiller.png", "cockroach.png", "honey-bee.png",
        "mosquito.png", "worm.png", "beetle.png", "dragon-fly.png"
    ],
    "sea-animals": ["fish.png", "whale.png", "dolphin.png", "crab.png", "octopus.png", "jellyfish.png"],
    reptiles: ["snake.png", "frog.png", "tortoise.png", "lizard.png.png", "monitor.png"],
    pots: ["plate.png.png", "spoon.png.png", "glass.png.png", "knife.png.png", "bag.jpg.png", "bottol.jpg.png"],
    mixed: ["clock.png", "moon.png", "star.png", "heart.png", "cloud.png", "fire.png", "phone.png",
        "umbrella.png", "TV.png", "bulb.png", "calculator.png"
    ]
};

const CATEGORY_ICONS = {
    alphabet: '🔤',
    animals: '🐾',
    birds: '🦜',
    body: '🧠',
    foods: '🍕',
    fruits: '🍎',
    vegetables: '🥕',
    transportation: '🚗',
    numbers: '🔢',
    shapes: '⬛',
    occupations: '👨‍🏫',
    insects: '🐜',
    'sea-animals': '🐠',
    reptiles: '🐍',
    pots: '🍳',
    mixed: '📦'
};

// ============================================================
// STATE
// ============================================================
let currentId = 0;
let selectedElements = [];
let clipboard = null;
let history = [];
let historyIndex = -1;
let currentZoom = 1;
let currentPage = 1;
let pageCount = 1;
let gridEnabled = false;
let snapEnabled = false;
let rulerEnabled = false;
let drawingEnabled = false;
let eraserEnabled = false;
let gridSize = 20;
let elementCounter = 0;
let currentCategory = 'mixed';
let aspectRatioLocked = false;
let isDrawing = false;
let drawingContext = null;
let drawingCanvas = null;

// ============================================================
// DOM REFS
// ============================================================
const pagesContainer = document.getElementById('pagesContainer');
const pageSelect = document.getElementById('pageSelect');
const pageInfo = document.getElementById('pageInfo');
const zoomLevel = document.getElementById('zoomLevel');
const selectedCountSpan = document.getElementById('selectedCount');
const galleryGrid = document.getElementById('galleryGrid');
const galleryCategories = document.getElementById('galleryCategories');
const gallerySidebar = document.getElementById('gallerySidebar');
const propertiesPanel = document.getElementById('propertiesPanel');
const contextMenu = document.getElementById('contextMenu');
const toastContainer = document.getElementById('toastContainer');

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    initPages();
    saveToHistory();
    updateZoom();
    setupToolbarTabs();
    setupReactions();
    setupShares();
    setupKeyboardShortcuts();
    setupContextMenu();
    setupUpload();
    setupGalleryCategories();
    loadGallery('mixed');
    setupTypewriter();
    setupPropertyUpdates();
    trackUsage();
    showToast('✨ Welcome to ECCE Worksheet Maker Pro v3!', 'success');
});

// ============================================================
// PAGES
// ============================================================
function initPages() {
    pageCount = 1;
    currentPage = 1;
    pagesContainer.innerHTML = '';
    addNewPage(1);
    updatePageSelect();
}

function addNewPage(num) {
    const page = document.createElement('div');
    page.id = `page${num}`;
    page.className = `a4-canvas ${num === currentPage ? 'active-page' : ''}`;
    page.innerHTML =
        `<div class="canvas-inner"><div class="default-message"><i class="fas fa-hand-pointer"></i><span>Page ${num} - Click images from gallery</span></div></div>`;
    pagesContainer.appendChild(page);
    setTimeout(() => attachElementEvents(), 100);
}

function addPage() {
    pageCount++;
    addNewPage(pageCount);
    currentPage = pageCount;
    updatePageSelect();
    switchToPage(currentPage);
    saveToHistory();
    showToast(`Page ${pageCount} added`, 'success');
}

function removePage() {
    if (pageCount > 1) {
        const el = document.getElementById(`page${pageCount}`);
        if (el) el.remove();
        pageCount--;
        if (currentPage > pageCount) currentPage = pageCount;
        updatePageSelect();
        switchToPage(currentPage);
        saveToHistory();
        showToast('Page removed', 'info');
    } else {
        showToast('Cannot remove last page', 'error');
    }
}

function duplicatePage() {
    const currentCanvas = getCurrentCanvas();
    if (!currentCanvas) return;
    const html = currentCanvas.innerHTML;
    pageCount++;
    const newPage = document.createElement('div');
    newPage.id = `page${pageCount}`;
    newPage.className = 'a4-canvas';
    newPage.innerHTML = `<div class="canvas-inner">${html}</div>`;
    pagesContainer.appendChild(newPage);
    currentPage = pageCount;
    updatePageSelect();
    switchToPage(currentPage);
    saveToHistory();
    showToast('Page duplicated!', 'success');
}

function updatePageSelect() {
    pageSelect.innerHTML = '';
    for (let i = 1; i <= pageCount; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `Page ${i}`;
        if (i === currentPage) opt.selected = true;
        pageSelect.appendChild(opt);
    }
    pageInfo.textContent = `${currentPage}/${pageCount}`;
}

function switchToPage(num) {
    currentPage = num;
    document.querySelectorAll('.a4-canvas').forEach((p, i) => {
        p.classList.toggle('active-page', i + 1 === num);
    });
    updatePageSelect();
    updateLayersList();
    attachElementEvents();
}

pageSelect?.addEventListener('change', (e) => switchToPage(parseInt(e.target.value)));

function getCurrentCanvas() {
    const p = document.getElementById(`page${currentPage}`);
    return p?.querySelector('.canvas-inner');
}

// ============================================================
// HISTORY
// ============================================================
function saveToHistory() {
    const canvas = getCurrentCanvas();
    if (!canvas) return;
    history = history.slice(0, historyIndex + 1);
    history.push(canvas.innerHTML);
    historyIndex++;
    if (history.length > 50) history.shift();
}

function undoAction() {
    if (historyIndex > 0) {
        historyIndex--;
        const canvas = getCurrentCanvas();
        if (canvas) {
            canvas.innerHTML = history[historyIndex];
            selectedElements = [];
            updateSelectedCount();
            attachElementEvents();
            showToast('Undo', 'info');
        }
    } else showToast('Nothing to undo', 'info');
}

function redoAction() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        const canvas = getCurrentCanvas();
        if (canvas) {
            canvas.innerHTML = history[historyIndex];
            selectedElements = [];
            updateSelectedCount();
            attachElementEvents();
            showToast('Redo', 'info');
        }
    } else showToast('Nothing to redo', 'info');
}

// ============================================================
// ELEMENTS
// ============================================================
function removeDefaultMessage(canvas) {
    const msg = canvas.querySelector('.default-message');
    if (msg) msg.remove();
}

function getRandomPosition() {
    const canvas = getCurrentCanvas();
    const w = canvas?.clientWidth || 800;
    const h = canvas?.clientHeight || 1100;
    return { x: 30 + Math.random() * (w - 200), y: 30 + Math.random() * (h - 200) };
}

function addElementToPage(fn, ...args) {
    saveToHistory();
    const canvas = getCurrentCanvas();
    if (!canvas) return;
    removeDefaultMessage(canvas);
    fn(canvas, ...args);
    attachElementEvents();
    updateLayersList();
    updatePropertiesPanel();
}

function createElement(canvas, html, x, y, w, h) {
    const id = currentId++;
    const div = document.createElement('div');
    div.className = 'canvas-element';
    div.id = `elem-${id}`;
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
    if (w) div.style.width = `${w}px`;
    if (h) div.style.height = `${h}px`;
    div.innerHTML = html + `<div class="resize-handle"></div>`;
    canvas.appendChild(div);
    elementCounter++;
    if (snapEnabled && gridEnabled) snapToGrid(div);
    return div;
}

// ---- IMAGE ----
function addImageElement(canvas, src, x, y, w = 120, h = 120) {
    createElement(canvas, `<img src="${src}" alt="image" loading="lazy" onerror="this.src='https://via.placeholder.com/120x120?text=?'">`,
        x, y, w, h);
}

function addImageFromGallery(src) {
    const pos = getRandomPosition();
    addElementToPage(addImageElement, src, pos.x, pos.y, 140, 140);
    showToast('Image added!', 'success');
    trackUsage();
}

// ---- TEXT ----
function addText() {
    const input = document.getElementById('newText');
    const text = input?.value || 'Sample Text';
    const pos = getRandomPosition();
    const font = document.getElementById('fontSelect')?.value || 'Arial';
    const size = document.getElementById('fontSizeSelect')?.value || 16;
    const color = document.getElementById('textColor')?.value || '#1a1a2e';
    addElementToPage((canvas, x, y) => {
        createElement(canvas,
            `<span class="element-text" style="font-family:${font};font-size:${size}px;color:${color};">${text}</span>`,
            x, y);
    }, pos.x, pos.y);
    if (input) input.value = '';
    showToast('Text added!', 'success');
}

// ---- SHAPES ----
function addShape(type) {
    const pos = getRandomPosition();
    const shapeStyles = {
        line: 'width:150px;height:2px;background:#333;',
        dotted: 'width:150px;height:2px;border-top:2px dotted #333;',
        box: 'border:2px solid #333;width:100px;height:100px;',
        circle: 'border-radius:50%;border:2px solid #333;width:80px;height:80px;',
        triangle: 'width:0;height:0;border-left:40px solid transparent;border-right:40px solid transparent;border-bottom:60px solid #333;background:transparent;',
        star: 'clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);background:#333;width:80px;height:80px;'
    };
    addElementToPage((canvas, x, y) => {
        const id = currentId++;
        const div = document.createElement('div');
        div.className = 'canvas-element';
        div.id = `elem-${id}`;
        div.style.left = `${x}px`;
        div.style.top = `${y}px`;
        const style = shapeStyles[type] || shapeStyles.box;
        style.split(';').forEach(s => {
            if (s.trim()) {
                const [prop, val] = s.split(':');
                if (prop && val) div.style[prop.trim()] = val.trim();
            }
        });
        div.innerHTML += `<div class="resize-handle"></div>`;
        canvas.appendChild(div);
        elementCounter++;
    }, pos.x, pos.y);
    showToast(`${type} added!`, 'success');
}

// ---- TRACING ----
function addTracing() {
    const pos = getRandomPosition();
    addElementToPage((canvas, x, y) => {
        createElement(canvas,
            `<span class="element-text" style="font-size:20px;color:#999;">__________</span>`, x, y, 200, 40);
    }, pos.x, pos.y);
    showToast('Tracing lines added!', 'success');
}

function addHandwriting() {
    const pos = getRandomPosition();
    addElementToPage((canvas, x, y) => {
        const id = currentId++;
        const div = document.createElement('div');
        div.className = 'canvas-element';
        div.id = `elem-${id}`;
        div.style.left = `${x}px`;
        div.style.top = `${y}px`;
        div.style.width = '300px';
        div.style.height = '120px';
        let html = '';
        for (let i = 0; i < 4; i++) {
            const top = i * 30;
            html +=
                `<div style="position:absolute;left:0;right:0;top:${top}px;border-top:2px solid #333;"></div>`;
            html +=
                `<div style="position:absolute;left:0;right:0;top:${top + 15}px;border-top:2px dotted #999;"></div>`;
        }
        div.innerHTML = html + `<div class="resize-handle"></div>`;
        canvas.appendChild(div);
        elementCounter++;
    }, pos.x, pos.y);
    showToast('Handwriting lines added!', 'success');
}

function addGraphPaper() {
    const pos = getRandomPosition();
    addElementToPage((canvas, x, y) => {
        const id = currentId++;
        const div = document.createElement('div');
        div.className = 'canvas-element';
        div.id = `elem-${id}`;
        div.style.left = `${x}px`;
        div.style.top = `${y}px`;
        div.style.width = '250px';
        div.style.height = '250px';
        div.style.background = '#fff';
        div.style.border = '1px solid #ccc';
        let html =
            '<div style="width:100%;height:100%;display:grid;grid-template-columns:repeat(10,1fr);grid-template-rows:repeat(10,1fr);">';
        for (let i = 0; i < 100; i++) {
            html += `<div style="border:1px solid #e5e7eb;"></div>`;
        }
        html += '</div><div class="resize-handle"></div>';
        div.innerHTML = html;
        canvas.appendChild(div);
        elementCounter++;
    }, pos.x, pos.y);
    showToast('Graph paper added!', 'success');
}

// ---- MATH ----
function addMath(type) {
    const pos = getRandomPosition();
    addElementToPage((canvas, x, y) => {
        const id = currentId++;
        const div = document.createElement('div');
        div.className = 'canvas-element';
        div.id = `elem-${id}`;
        div.style.left = `${x}px`;
        div.style.top = `${y}px`;
        div.style.width = '200px';
        div.style.minHeight = '60px';
        div.style.padding = '12px';
        div.style.background = '#f8fafc';
        div.style.borderRadius = '10px';
        div.style.border = '2px solid var(--border)';

        let content = '';
        if (type === 'addition') {
            const a = Math.floor(Math.random() * 10) + 1;
            const b = Math.floor(Math.random() * 10) + 1;
            content =
                `<div style="font-size:20px;font-weight:700;text-align:center;">${a} + ${b} = <input type="text" class="math-answer" placeholder="?" style="width:50px;text-align:center;font-size:18px;border:2px solid var(--border);border-radius:6px;padding:4px;"></div>`;
        } else if (type === 'subtraction') {
            let a = Math.floor(Math.random() * 10) + 1;
            let b = Math.floor(Math.random() * a) + 1;
            content =
                `<div style="font-size:20px;font-weight:700;text-align:center;">${a} - ${b} = <input type="text" class="math-answer" placeholder="?" style="width:50px;text-align:center;font-size:18px;border:2px solid var(--border);border-radius:6px;padding:4px;"></div>`;
        } else {
            content =
                `<div style="font-size:14px;font-weight:600;text-align:center;">Number Line:<br>1___2___3___4___5___6___7___8___9___10</div>`;
        }
        div.innerHTML = content + `<div class="resize-handle"></div>`;
        canvas.appendChild(div);
        elementCounter++;
    }, pos.x, pos.y);
    showToast(`Math ${type} added!`, 'success');
}

// ---- ACTIVITIES ----
function addWordBank() {
    const pos = getRandomPosition();
    addElementToPage((canvas, x, y) => {
        const id = currentId++;
        const div = document.createElement('div');
        div.className = 'canvas-element';
        div.id = `elem-${id}`;
        div.style.left = `${x}px`;
        div.style.top = `${y}px`;
        div.style.width = '250px';
        div.style.minHeight = '80px';
        div.style.padding = '12px';
        div.style.background = '#fefce8';
        div.style.border = '2px solid #fef08a';
        div.style.borderRadius = '12px';
        const words = ['Apple', 'Cat', 'Dog', 'Sun', 'Bird', 'Fish', 'Star', 'Moon'];
        const wordHtml = words.map(w =>
            `<span style="display:inline-block;background:#e0e7ff;padding:4px 14px;margin:3px;border-radius:20px;cursor:pointer;font-size:12px;font-weight:600;">${w}</span>`
        ).join('');
        div.innerHTML =
            `<div><strong>📚 Word Bank:</strong><br>${wordHtml}</div><div class="resize-handle"></div>`;
        canvas.appendChild(div);
        elementCounter++;
    }, pos.x, pos.y);
    showToast('Word Bank added!', 'success');
}

function addColorByNumber() {
    const pos = getRandomPosition();
    addElementToPage((canvas, x, y) => {
        const id = currentId++;
        const div = document.createElement('div');
        div.className = 'canvas-element';
        div.id = `elem-${id}`;
        div.style.left = `${x}px`;
        div.style.top = `${y}px`;
        div.style.width = '280px';
        div.style.padding = '12px';
        div.style.background = '#f8fafc';
        div.style.borderRadius = '12px';
        div.style.border = '2px solid var(--border)';
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#ff9ff3', '#54a0ff'];
        let html = '<div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;">';
        colors.forEach((c, i) => {
            html +=
                `<div style="text-align:center;width:60px;"><div style="width:40px;height:40px;background:${c};border-radius:8px;border:2px solid var(--border);margin:0 auto;"></div><div style="font-size:12px;font-weight:600;margin-top:4px;">${i+1}</div></div>`;
        });
        html += '</div><div class="resize-handle"></div>';
        div.innerHTML = html;
        canvas.appendChild(div);
        elementCounter++;
    }, pos.x, pos.y);
    showToast('Color by Number added!', 'success');
}

function addMatching() {
    showToast('Matching feature coming soon!', 'info');
}

function addConnectDots() {
    showToast('Connect Dots coming soon!', 'info');
}

function addContainer() {
    const pos = getRandomPosition();
    addElementToPage((canvas, x, y) => {
        const id = currentId++;
        const div = document.createElement('div');
        div.className = 'canvas-element';
        div.id = `elem-${id}`;
        div.style.left = `${x}px`;
        div.style.top = `${y}px`;
        div.style.width = '200px';
        div.style.height = '150px';
        div.style.border = '3px dashed var(--primary)';
        div.style.borderRadius = '12px';
        div.style.background = 'rgba(99,102,241,0.05)';
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'center';
        div.style.color = 'var(--text-light)';
        div.style.fontSize = '12px';
        div.innerHTML = `📦 Container<br><small>Drop elements here</small><div class="resize-handle"></div>`;
        canvas.appendChild(div);
        elementCounter++;
    }, pos.x, pos.y);
    showToast('Container added!', 'success');
}

function addLabel() {
    const pos = getRandomPosition();
    addElementToPage((canvas, x, y) => {
        const id = currentId++;
        const div = document.createElement('div');
        div.className = 'canvas-element';
        div.id = `elem-${id}`;
        div.style.left = `${x}px`;
        div.style.top = `${y}px`;
        div.style.padding = '8px 16px';
        div.style.background = 'var(--primary)';
        div.style.color = 'white';
        div.style.borderRadius = '8px';
        div.style.fontSize = '14px';
        div.style.fontWeight = '600';
        div.style.boxShadow = '0 2px 10px rgba(99,102,241,0.2)';
        div.innerHTML = `📌 Label <div class="resize-handle"></div>`;
        canvas.appendChild(div);
        elementCounter++;
    }, pos.x, pos.y);
    showToast('Label added!', 'success');
}

// ---- ASSESSMENT ----
function addMCQ() {
    const pos = getRandomPosition();
    addElementToPage((canvas, x, y) => {
        const id = currentId++;
        const div = document.createElement('div');
        div.className = 'canvas-element';
        div.id = `elem-${id}`;
        div.style.left = `${x}px`;
        div.style.top = `${y}px`;
        div.style.width = '240px';
        div.style.padding = '12px';
        div.style.background = '#f8fafc';
        div.style.borderRadius = '12px';
        div.style.border = '2px solid var(--border)';
        const options = ['A', 'B', 'C', 'D'];
        const optHtml = options.map(o =>
            `<div style="margin:6px 0;display:flex;align-items:center;gap:8px;"><input type="radio" name="mcq_${id}" class="mcq-option" style="width:16px;height:16px;"> Option ${o}</div>`
        ).join('');
        div.innerHTML =
            `<div><strong>❓ Question:</strong><br>${optHtml}</div><div class="resize-handle"></div>`;
        canvas.appendChild(div);
        elementCounter++;
    }, pos.x, pos.y);
    showToast('MCQ added!', 'success');
}

function addFillBlank() {
    const pos = getRandomPosition();
    addElementToPage((canvas, x, y) => {
        const id = currentId++;
        const div = document.createElement('div');
        div.className = 'canvas-element';
        div.id = `elem-${id}`;
        div.style.left = `${x}px`;
        div.style.top = `${y}px`;
        div.style.width = '240px';
        div.style.padding = '12px';
        div.style.background = '#f8fafc';
        div.style.borderRadius = '12px';
        div.style.border = '2px solid var(--border)';
        div.innerHTML =
            `<div style="font-size:14px;">The cat is _____ the table.<br><input type="text" placeholder="Write your answer..." style="width:100%;margin-top:10px;padding:8px;border:2px solid var(--border);border-radius:8px;font-size:14px;"></div><div class="resize-handle"></div>`;
        canvas.appendChild(div);
        elementCounter++;
    }, pos.x, pos.y);
    showToast('Fill in the Blank added!', 'success');
}

function addTrueFalse() {
    showToast('True/False feature coming soon!', 'info');
}

function addStudentName() {
    const pos = getRandomPosition();
    addElementToPage((canvas, x, y) => {
        createElement(canvas,
            `<span class="element-text" style="font-size:14px;font-weight:600;">👤 Name: ________________</span>`,
            x, y);
    }, pos.x, pos.y);
    showToast('Name field added!', 'success');
}

function addDateField() {
    const pos = getRandomPosition();
    addElementToPage((canvas, x, y) => {
        createElement(canvas,
            `<span class="element-text" style="font-size:14px;font-weight:600;">📅 Date: ________________</span>`,
            x, y);
    }, pos.x, pos.y);
    showToast('Date field added!', 'success');
}

// ============================================================
// SELECTION
// ============================================================
function selectElement(el) {
    if (!el) return;
    if (el.classList.contains('selected')) {
        el.classList.remove('selected');
        selectedElements = selectedElements.filter(e => e !== el);
    } else {
        if (!window.event?.ctrlKey && !window.event?.metaKey) {
            selectedElements.forEach(e => e.classList.remove('selected'));
            selectedElements = [];
        }
        el.classList.add('selected');
        selectedElements.push(el);
    }
    updateSelectedCount();
    updatePropertiesPanel();
}

function updateSelectedCount() {
    const canvas = getCurrentCanvas();
    if (!canvas) return;
    selectedElements = Array.from(canvas.querySelectorAll('.canvas-element.selected'));
    if (selectedCountSpan) selectedCountSpan.textContent = selectedElements.length;
    updatePropertiesPanel();
}

function selectAll() {
    const canvas = getCurrentCanvas();
    if (!canvas) return;
    canvas.querySelectorAll('.canvas-element').forEach(el => el.classList.add('selected'));
    updateSelectedCount();
    showToast('All elements selected', 'info');
}

function deselectAll() {
    document.querySelectorAll('.canvas-element.selected').forEach(el => el.classList.remove('selected'));
    selectedElements = [];
    updateSelectedCount();
}

// ============================================================
// DRAG & RESIZE
// ============================================================
function attachElementEvents() {
    document.querySelectorAll('.canvas-element').forEach(el => {
        if (!el._eventsAttached) {
            el.addEventListener('mousedown', (e) => {
                if (e.target.closest('.resize-handle')) return;
                if (e.target.tagName === 'INPUT') return;
                selectElement(el);
            });
            makeDraggable(el);
            if (el.querySelector('.resize-handle')) makeResizable(el);
            el._eventsAttached = true;
        }
    });
}

function makeDraggable(el) {
    let dragging = false,
        startX, startY, left, top;
    el.addEventListener('mousedown', (e) => {
        if (e.target.closest('.resize-handle')) return;
        if (e.target.tagName === 'INPUT') return;
        if (e.button !== 0) return;
        dragging = true;
        startX = e.clientX;
        startY = e.clientY;
        left = parseInt(el.style.left) || 0;
        top = parseInt(el.style.top) || 0;
        el.style.cursor = 'grabbing';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        let nx = left + (e.clientX - startX);
        let ny = top + (e.clientY - startY);
        if (snapEnabled && gridEnabled) {
            nx = Math.round(nx / gridSize) * gridSize;
            ny = Math.round(ny / gridSize) * gridSize;
        }
        el.style.left = `${Math.max(0, nx)}px`;
        el.style.top = `${Math.max(0, ny)}px`;
        updatePropertiesPanel();
    });

    document.addEventListener('mouseup', () => {
        if (dragging) {
            dragging = false;
            el.style.cursor = 'move';
            saveToHistory();
        }
    });
}

function makeResizable(el) {
    const handle = el.querySelector('.resize-handle');
    if (!handle) return;
    let resizing = false,
        startX, startY, w, h, aspectRatio;

    handle.addEventListener('mousedown', (e) => {
        resizing = true;
        startX = e.clientX;
        startY = e.clientY;
        w = parseInt(el.style.width) || 100;
        h = parseInt(el.style.height) || 100;
        aspectRatio = w / h;
        e.stopPropagation();
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!resizing) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        let nw = Math.max(30, w + dx);
        let nh = Math.max(30, h + dy);
        if (e.shiftKey || aspectRatioLocked) {
            nh = nw / aspectRatio;
        }
        el.style.width = `${nw}px`;
        el.style.height = `${nh}px`;
        updatePropertiesPanel();
    });

    document.addEventListener('mouseup', () => {
        if (resizing) {
            resizing = false;
            saveToHistory();
        }
    });
}

function snapToGrid(el) {
    let left = parseInt(el.style.left) || 0;
    let top = parseInt(el.style.top) || 0;
    el.style.left = `${Math.round(left / gridSize) * gridSize}px`;
    el.style.top = `${Math.round(top / gridSize) * gridSize}px`;
}

// ============================================================
// PROPERTIES PANEL
// ============================================================
function toggleProperties() {
    propertiesPanel.classList.toggle('open');
}

function updatePropertiesPanel() {
    if (!selectedElements.length) {
        document.getElementById('propX').value = 0;
        document.getElementById('propY').value = 0;
        document.getElementById('propW').value = 100;
        document.getElementById('propH').value = 100;
        return;
    }
    const el = selectedElements[0];
    document.getElementById('propX').value = parseInt(el.style.left) || 0;
    document.getElementById('propY').value = parseInt(el.style.top) || 0;
    document.getElementById('propW').value = parseInt(el.style.width) || 100;
    document.getElementById('propH').value = parseInt(el.style.height) || 100;
    const rotate = parseFloat(el.style.transform?.replace(/[^0-9.]/g, '') || 0);
    document.getElementById('propRotate').value = rotate;
    document.getElementById('propRotateVal').textContent = `${Math.round(rotate)}°`;
    const opacity = parseFloat(el.style.opacity || 1) * 100;
    document.getElementById('propOpacity').value = opacity;
    document.getElementById('propOpacityVal').textContent = `${Math.round(opacity)}%`;
    const textEl = el.querySelector('.element-text');
    if (textEl) {
        document.getElementById('propFont').value = textEl.style.fontFamily || 'Arial';
        document.getElementById('propColor').value = textEl.style.color || '#000000';
        document.getElementById('propFontSize').value = parseInt(textEl.style.fontSize) || 16;
    }
}

function updateProperty(prop) {
    if (!selectedElements.length) return;
    const el = selectedElements[0];
    switch (prop) {
        case 'x':
            el.style.left = `${document.getElementById('propX').value}px`;
            break;
        case 'y':
            el.style.top = `${document.getElementById('propY').value}px`;
            break;
        case 'w':
            el.style.width = `${document.getElementById('propW').value}px`;
            break;
        case 'h':
            el.style.height = `${document.getElementById('propH').value}px`;
            break;
        case 'rotate':
            const rotate = document.getElementById('propRotate').value;
            document.getElementById('propRotateVal').textContent = `${Math.round(rotate)}°`;
            el.style.transform = `rotate(${rotate}deg)`;
            break;
        case 'opacity':
            const opacity = document.getElementById('propOpacity').value / 100;
            document.getElementById('propOpacityVal').textContent = `${Math.round(opacity * 100)}%`;
            el.style.opacity = opacity;
            break;
        case 'font':
            const textEl = el.querySelector('.element-text');
            if (textEl) textEl.style.fontFamily = document.getElementById('propFont').value;
            break;
        case 'color':
            const textEl2 = el.querySelector('.element-text');
            if (textEl2) textEl2.style.color = document.getElementById('propColor').value;
            break;
        case 'fontSize':
            const textEl3 = el.querySelector('.element-text');
            if (textEl3) textEl3.style.fontSize = `${document.getElementById('propFontSize').value}px`;
            break;
    }
    saveToHistory();
}

function setupPropertyUpdates() {
    ['propX', 'propY', 'propW', 'propH'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', () => updateProperty(id.replace('prop', '')
        .toLowerCase()));
    });
}

function lockAspectRatio() {
    aspectRatioLocked = !aspectRatioLocked;
    showToast(aspectRatioLocked ? 'Aspect ratio locked' : 'Aspect ratio unlocked', 'info');
}

// ============================================================
// GALLERY
// ============================================================
function setupGalleryCategories() {
    const cats = Object.keys(IMAGE_DB);
    galleryCategories.innerHTML = '';
    cats.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `gallery-cat-btn ${cat === currentCategory ? 'active' : ''}`;
        btn.textContent = `${CATEGORY_ICONS[cat] || '📁'} ${cat.replace('-', ' ')}`;
        btn.dataset.cat = cat;
        btn.onclick = () => {
            currentCategory = cat;
            document.querySelectorAll('.gallery-cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadGallery(cat);
        };
        galleryCategories.appendChild(btn);
    });
}

function loadGallery(category) {
    const images = IMAGE_DB[category] || [];
    galleryGrid.innerHTML = '';
    if (!images.length) {
        galleryGrid.innerHTML =
            `<div class="gallery-empty"><i class="fas fa-folder-open"></i> No images in this category</div>`;
        return;
    }
    images.forEach(img => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        const imgUrl = `${BASE_URL}${category}/${encodeURIComponent(img)}`;
        item.innerHTML = `
            <div class="loading-spinner"><i class="fas fa-spinner"></i></div>
            <img src="${imgUrl}" alt="${img}" onload="this.previousElementSibling.style.display='none'" onerror="this.style.display='none';this.previousElementSibling.innerHTML='<i class=\\'fas fa-exclamation-circle\\' style=\\'color:#ef4444;\\'></i>'">
            <span class="item-label">${img.replace(/\.[^/.]+$/, '').slice(0,12)}</span>
        `;
        item.onclick = () => addImageFromGallery(imgUrl);
        galleryGrid.appendChild(item);
    });
}

function filterGallery() {
    const query = document.getElementById('gallerySearch').value.toLowerCase();
    document.querySelectorAll('.gallery-item').forEach(item => {
        const label = item.querySelector('.item-label')?.textContent?.toLowerCase() || '';
        item.style.display = label.includes(query) ? '' : 'none';
    });
}

function toggleGallery() {
    gallerySidebar.classList.toggle('open');
    if (gallerySidebar.classList.contains('open')) {
        loadGallery(currentCategory);
    }
}

// ---- UPLOAD ----
function setupUpload() {
    document.getElementById('desktopUpload')?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const pos = getRandomPosition();
                addElementToPage(addImageElement, event.target.result, pos.x, pos.y, 150, 150);
                showToast('Image uploaded!', 'success');
            };
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    });
}

// ============================================================
// ZOOM
// ============================================================
function updateZoom() {
    const container = pagesContainer;
    if (container) {
        container.style.transform = `scale(${currentZoom})`;
        container.style.transformOrigin = 'top center';
        zoomLevel.textContent = `${Math.round(currentZoom * 100)}%`;
    }
}

function zoomIn() {
    if (currentZoom < 1.5) { currentZoom += 0.1;
        updateZoom(); }
}

function zoomOut() {
    if (currentZoom > 0.5) { currentZoom -= 0.1;
        updateZoom(); }
}

function zoomReset() { currentZoom = 1;
    updateZoom(); }

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
    } else {
        document.exitFullscreen().catch(() => {});
    }
}

// ============================================================
// GRID & SNAP
// ============================================================
function toggleGrid() {
    gridEnabled = !gridEnabled;
    const canvas = getCurrentCanvas();
    if (!canvas) return;
    const existing = canvas.querySelector('.grid-lines');
    if (gridEnabled && !existing) {
        const g = document.createElement('div');
        g.className = 'grid-lines';
        const w = canvas.clientWidth || 800;
        for (let i = 0; i < w + 500; i += gridSize) {
            const v = document.createElement('div');
            v.className = 'grid-line-v';
            v.style.left = `${i}px`;
            g.appendChild(v);
        }
        for (let i = 0; i < 1000; i += gridSize) {
            const h = document.createElement('div');
            h.className = 'grid-line-h';
            h.style.top = `${i}px`;
            g.appendChild(h);
        }
        canvas.appendChild(g);
        showToast('Grid enabled', 'success');
    } else if (!gridEnabled && existing) {
        existing.remove();
        showToast('Grid disabled', 'info');
    }
}

function toggleSnap() {
    snapEnabled = !snapEnabled;
    showToast(snapEnabled ? 'Snap enabled' : 'Snap disabled', 'info');
}

// ============================================================
// RULER
// ============================================================
function toggleRuler() {
    rulerEnabled = !rulerEnabled;
    const canvas = getCurrentCanvas();
    if (!canvas) return;
    let ruler = canvas.querySelector('.ruler-overlay');
    if (rulerEnabled && !ruler) {
        ruler = document.createElement('div');
        ruler.className = 'ruler-overlay';

        const hRuler = document.createElement('div');
        hRuler.className = 'ruler-horizontal';
        for (let i = 0; i < canvas.clientWidth; i += 50) {
            const mark = document.createElement('span');
            mark.textContent = i + 'px';
            hRuler.appendChild(mark);
        }

        const vRuler = document.createElement('div');
        vRuler.className = 'ruler-vertical';
        for (let i = 0; i < canvas.clientHeight; i += 50) {
            const mark = document.createElement('span');
            mark.textContent = i + 'px';
            vRuler.appendChild(mark);
        }

        ruler.appendChild(hRuler);
        ruler.appendChild(vRuler);
        canvas.appendChild(ruler);
        showToast('Ruler shown', 'info');
    } else if (!rulerEnabled && ruler) {
        ruler.remove();
        showToast('Ruler hidden', 'info');
    }
}

// ============================================================
// STYLING
// ============================================================
function applyBold() {
    selectedElements.forEach(el => {
        const t = el.querySelector('.element-text');
        if (t) t.style.fontWeight = t.style.fontWeight === 'bold' ? 'normal' : 'bold';
    });
}

function applyItalic() {
    selectedElements.forEach(el => {
        const t = el.querySelector('.element-text');
        if (t) t.style.fontStyle = t.style.fontStyle === 'italic' ? 'normal' : 'italic';
    });
}

function applyUnderline() {
    selectedElements.forEach(el => {
        const t = el.querySelector('.element-text');
        if (t) t.style.textDecoration = t.style.textDecoration === 'underline' ? 'none' : 'underline';
    });
}

function applyTextShadow() {
    selectedElements.forEach(el => {
        const t = el.querySelector('.element-text');
        if (t) {
            t.style.textShadow = t.style.textShadow ? 'none' : '2px 2px 4px rgba(0,0,0,0.2)';
        }
    });
    showToast('Text shadow toggled', 'info');
}

function applyHighlight() {
    selectedElements.forEach(el => {
        const t = el.querySelector('.element-text');
        if (t) {
            t.style.background = t.style.background ? 'transparent' : 'rgba(251,191,36,0.3)';
            t.style.padding = t.style.background ? '0 4px' : '0';
            t.style.borderRadius = '4px';
        }
    });
    showToast('Highlight toggled', 'info');
}

function applyBorder() {
    selectedElements.forEach(el => {
        const currentBorder = el.style.border;
        if (!currentBorder || currentBorder === 'none') {
            el.style.border = '3px solid var(--primary)';
            el.style.borderRadius = '8px';
            el.style.padding = '4px';
        } else {
            el.style.border = 'none';
            el.style.borderRadius = '0';
            el.style.padding = '0';
        }
    });
    showToast('Border toggled', 'info');
}

function applyShadow() {
    selectedElements.forEach(el => {
        el.style.boxShadow = el.style.boxShadow ? 'none' : '0 4px 20px rgba(0,0,0,0.15)';
    });
    showToast('Shadow toggled', 'info');
}

function changeBackground() {
    const canvas = getCurrentCanvas();
    if (canvas) {
        const color = prompt('Enter background color (hex, e.g., #f0f0f0):', '#ffffff');
        if (color) {
            canvas.style.background = color;
            showToast('Background color changed', 'success');
        }
    }
}

// ============================================================
// DRAWING
// ============================================================
function toggleDrawing() {
    drawingEnabled = !drawingEnabled;
    if (drawingEnabled) {
        eraserEnabled = false;
        createDrawingLayer();
        showToast('Drawing mode enabled', 'info');
    } else {
        showToast('Drawing mode disabled', 'info');
    }
}

function toggleEraser() {
    eraserEnabled = !eraserEnabled;
    if (eraserEnabled) {
        drawingEnabled = false;
        showToast('Eraser mode enabled', 'info');
    } else {
        showToast('Eraser mode disabled', 'info');
    }
}

function createDrawingLayer() {
    const canvas = getCurrentCanvas();
    if (!canvas) return;
    // Remove existing drawing canvas
    const existing = canvas.querySelector('.drawing-layer');
    if (existing) existing.remove();

    const drawCanvas = document.createElement('canvas');
    drawCanvas.className = 'drawing-layer';
    drawCanvas.style.position = 'absolute';
    drawCanvas.style.top = '0';
    drawCanvas.style.left = '0';
    drawCanvas.style.width = '100%';
    drawCanvas.style.height = '100%';
    drawCanvas.style.pointerEvents = 'none';
    drawCanvas.style.zIndex = '999';
    canvas.appendChild(drawCanvas);

    // Setup drawing
    const ctx = drawCanvas.getContext('2d');
    drawCanvas.width = canvas.clientWidth;
    drawCanvas.height = canvas.clientHeight;

    let isDrawing = false;
    let lastX, lastY;

    drawCanvas.style.pointerEvents = 'auto';

    drawCanvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const rect = drawCanvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
    });

    drawCanvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        const rect = drawCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const color = document.getElementById('drawColor')?.value || '#000000';
        const size = parseInt(document.getElementById('drawSize')?.value || 4);

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = eraserEnabled ? '#ffffff' : color;
        ctx.lineWidth = eraserEnabled ? size * 3 : size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        lastX = x;
        lastY = y;
    });

    drawCanvas.addEventListener('mouseup', () => { isDrawing = false; });
    drawCanvas.addEventListener('mouseleave', () => { isDrawing = false; });
}

function clearDrawing() {
    const canvas = getCurrentCanvas();
    if (!canvas) return;
    const drawCanvas = canvas.querySelector('.drawing-layer');
    if (drawCanvas) {
        const ctx = drawCanvas.getContext('2d');
        ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
        showToast('Drawing cleared', 'success');
    }
}

// ============================================================
// ARRANGE
// ============================================================
function bringFront() {
    selectedElements.forEach(el => el.style.zIndex = Date.now());
    showToast('Brought to front', 'success');
}

function sendBack() {
    selectedElements.forEach(el => el.style.zIndex = -Date.now());
    showToast('Sent to back', 'success');
}

function alignLeft() {
    if (!selectedElements.length) return;
    const minL = Math.min(...selectedElements.map(el => parseInt(el.style.left) || 0));
    selectedElements.forEach(el => el.style.left = `${minL}px`);
    showToast('Aligned left', 'success');
}

function alignCenter() {
    if (!selectedElements.length) return;
    const canvas = getCurrentCanvas();
    if (!canvas) return;
    const cx = canvas.clientWidth / 2;
    selectedElements.forEach(el => {
        const w = parseInt(el.style.width) || 100;
        el.style.left = `${cx - w/2}px`;
    });
    showToast('Aligned center', 'success');
}

function alignRight() {
    if (!selectedElements.length) return;
    const maxR = Math.max(...selectedElements.map(el => (parseInt(el.style.left) || 0) + (parseInt(el.style.width) ||
    100)));
    selectedElements.forEach(el => {
        const w = parseInt(el.style.width) || 100;
        el.style.left = `${maxR - w}px`;
    });
    showToast('Aligned right', 'success');
}

function distributeElements() {
    if (selectedElements.length < 3) { showToast('Select at least 3 elements', 'error'); return; }
    const sorted = [...selectedElements].sort((a, b) => (parseInt(a.style.left) || 0) - (parseInt(b.style.left) ||
    0));
    const first = parseInt(sorted[0].style.left) || 0;
    const last = parseInt(sorted[sorted.length - 1].style.left) || 0;
    const spacing = (last - first) / (sorted.length - 1);
    sorted.forEach((el, i) => {
        el.style.left = `${first + (i * spacing)}px`;
    });
    showToast('Distributed evenly', 'success');
}

function groupElements() {
    if (selectedElements.length < 2) { showToast('Select at least 2 elements', 'error'); return; }
    const canvas = getCurrentCanvas();
    if (!canvas) return;
    const groupId = 'group_' + Date.now();
    const groupDiv = document.createElement('div');
    groupDiv.className = 'canvas-element group';
    groupDiv.id = groupId;
    const minL = Math.min(...selectedElements.map(el => parseInt(el.style.left) || 0));
    const minT = Math.min(...selectedElements.map(el => parseInt(el.style.top) || 0));
    const maxR = Math.max(...selectedElements.map(el => (parseInt(el.style.left) || 0) + (parseInt(el.style.width) ||
    100)));
    const maxB = Math.max(...selectedElements.map(el => (parseInt(el.style.top) || 0) + (parseInt(el.style.height) ||
    100)));
    groupDiv.style.left = `${minL}px`;
    groupDiv.style.top = `${minT}px`;
    groupDiv.style.width = `${maxR - minL}px`;
    groupDiv.style.height = `${maxB - minT}px`;
    groupDiv.style.border = '2px dashed var(--primary)';
    groupDiv.style.borderRadius = '8px';
    groupDiv.style.background = 'rgba(99,102,241,0.03)';
    groupDiv.style.pointerEvents = 'none';

    selectedElements.forEach(el => {
        el.style.left = `${(parseInt(el.style.left) || 0) - minL}px`;
        el.style.top = `${(parseInt(el.style.top) || 0) - minT}px`;
        groupDiv.appendChild(el);
    });
    canvas.appendChild(groupDiv);
    selectedElements = [groupDiv];
    updateSelectedCount();
    updateLayersList();
    showToast('Grouped', 'success');
}

function ungroupElements() {
    const groups = document.querySelectorAll('.group');
    if (!groups.length) { showToast('No group selected', 'error'); return; }
    groups.forEach(group => {
        const parent = group.parentElement;
        const children = Array.from(group.children);
        const left = parseInt(group.style.left) || 0;
        const top = parseInt(group.style.top) || 0;
        children.forEach(el => {
            el.style.left = `${(parseInt(el.style.left) || 0) + left}px`;
            el.style.top = `${(parseInt(el.style.top) || 0) + top}px`;
            parent.insertBefore(el, group);
        });
        group.remove();
    });
    updateLayersList();
    showToast('Ungrouped', 'success');
}

function rotateElements() {
    if (!selectedElements.length) { showToast('No element selected', 'error'); return; }
    selectedElements.forEach(el => {
        const currentRotate = parseFloat(el.style.transform?.replace(/[^0-9.]/g, '') || 0);
        el.style.transform = `rotate(${currentRotate + 15}deg)`;
    });
    showToast('Rotated 15°', 'success');
}

function duplicateSelected() {
    if (!selectedElements.length) { showToast('No element selected', 'error'); return; }
    saveToHistory();
    const canvas = getCurrentCanvas();
    if (!canvas) return;
    const toDuplicate = [...selectedElements];
    toDuplicate.forEach(el => {
        const clone = el.cloneNode(true);
        const id = currentId++;
        clone.id = `elem-${id}`;
        let l = parseInt(clone.style.left) || 50;
        let t = parseInt(clone.style.top) || 50;
        clone.style.left = `${l + 30}px`;
        clone.style.top = `${t + 30}px`;
        clone.classList.remove('selected');
        canvas.appendChild(clone);
    });
    attachElementEvents();
    updateLayersList();
    showToast('Duplicated', 'success');
}

function deleteSelected() {
    if (!selectedElements.length) { showToast('No element selected', 'error'); return; }
    saveToHistory();
    selectedElements.forEach(el => el.remove());
    selectedElements = [];
    updateSelectedCount();
    updateLayersList();
    showToast('Deleted', 'success');
}

// ============================================================
// COPY/PASTE
// ============================================================
function copySelected() {
    if (!selectedElements.length) { showToast('No element selected', 'error'); return; }
    const temp = document.createElement('div');
    selectedElements.forEach(el => temp.appendChild(el.cloneNode(true)));
    clipboard = temp.innerHTML;
    showToast(`Copied ${selectedElements.length} element(s)`, 'success');
}

function pasteSelected() {
    if (!clipboard) { showToast('Nothing to paste', 'error'); return; }
    saveToHistory();
    const canvas = getCurrentCanvas();
    if (!canvas) return;
    const temp = document.createElement('div');
    temp.innerHTML = clipboard;
    Array.from(temp.children).forEach(el => {
        const id = currentId++;
        const newEl = el.cloneNode(true);
        newEl.id = `elem-${id}`;
        let l = parseInt(newEl.style.left) || 50;
        let t = parseInt(newEl.style.top) || 50;
        newEl.style.left = `${l + 20 + Math.random() * 20}px`;
        newEl.style.top = `${t + 20 + Math.random() * 20}px`;
        canvas.appendChild(newEl);
    });
    attachElementEvents();
    updateLayersList();
    showToast('Pasted', 'success');
}

// ============================================================
// LAYERS
// ============================================================
function updateLayersList() {
    // Simple layer update - can be expanded
}

// ============================================================
// ASSESSMENT
// ============================================================
function gradeAssessment() {
    const canvas = getCurrentCanvas();
    if (!canvas) return;
    const mcqs = canvas.querySelectorAll('.mcq-option:checked');
    const blanks = canvas.querySelectorAll('.math-answer');
    let score = mcqs.length + blanks.length;
    showModal('📊 Assessment Results', `
        <p><strong>MCQs Attempted:</strong> ${mcqs.length}</p>
        <p><strong>Fill Blanks:</strong> ${blanks.length}</p>
        <p><strong>Total Score:</strong> ${score} points</p>
        <hr>
        <p style="color:var(--success);">🎉 Great job! Keep practicing!</p>
    `, 'Close');
}

function generateAnswerKey() {
    showToast('Answer key generated!', 'success');
}

// ============================================================
// AI FUNCTIONS
// ============================================================
function aiGenerate() {
    const input = document.getElementById('aiPrompt');
    if (!input || !input.value.trim()) { showToast('Enter a prompt', 'error'); return; }
    showToast('AI generating...', 'info');
    setTimeout(() => {
        const pos = getRandomPosition();
        addElementToPage(addTextElement, `✨ AI: ${input.value}`, pos.x, pos.y);
        showToast('AI generated!', 'success');
    }, 800);
}

function aiSuggest() {
    const suggestions = [
        'Create a worksheet about fruits with tracing',
        'Design a number recognition worksheet for numbers 1-10',
        'Make an alphabet tracing worksheet for letter A',
        'Create a color by number activity with animals',
        'Design a math worksheet with addition problems',
        'Make a word bank worksheet with animal names'
    ];
    const random = suggestions[Math.floor(Math.random() * suggestions.length)];
    document.getElementById('aiPrompt').value = random;
    showToast('💡 Suggestion: ' + random, 'info');
}

function aiImprove() {
    if (!selectedElements.length) { showToast('Select an element to improve', 'error'); return; }
    showToast('✨ Improving...', 'info');
    selectedElements.forEach(el => {
        el.style.boxShadow = '0 4px 20px rgba(99,102,241,0.15)';
        el.style.border = '2px solid var(--primary)';
        el.style.borderRadius = '8px';
        el.style.padding = '4px';
    });
    showToast('✨ Improved!', 'success');
}

function aiTranslate() {
    showToast('🌐 Translation feature coming soon!', 'info');
}

// ============================================================
// EXPORT
// ============================================================
async function exportPDF() {
    const el = document.getElementById(`page${currentPage}`);
    if (!el) return;
    showToast('Generating PDF...', 'info');
    try {
        const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#fff', useCORS: true });
        const img = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
        const w = 210;
        const h = (canvas.height * w) / canvas.width;
        pdf.addImage(img, 'PNG', 0, 0, w, h);
        pdf.save('worksheet.pdf');
        showToast('PDF downloaded!', 'success');
    } catch (e) {
        showToast('Use Print instead', 'error');
    }
}

function exportWord() {
    const el = document.getElementById(`page${currentPage}`);
    if (!el) return;
    const html =
        `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Worksheet</title><style>body{padding:1cm;font-family:Arial;}</style></head><body>${el.cloneNode(true).innerHTML}</body></html>`;
    const blob = new Blob([html], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'worksheet.doc';
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('Word downloaded!', 'success');
}

function exportPNG() {
    const el = document.getElementById(`page${currentPage}`);
    if (!el) return;
    html2canvas(el, { scale: 2, backgroundColor: '#fff', useCORS: true }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'worksheet.png';
        link.href = canvas.toDataURL();
        link.click();
        showToast('PNG downloaded!', 'success');
    });
}

// ============================================================
// SAVE/LOAD
// ============================================================
function saveWorksheet() {
    const pages = [];
    document.querySelectorAll('.a4-canvas').forEach(p => pages.push(p.innerHTML));
    localStorage.setItem('ecce_worksheet_v3', JSON.stringify({ pages, version: '3.0', timestamp: new Date()
            .toISOString() }));
    showToast('Worksheet saved!', 'success');
}

function loadWorksheet() {
    const data = localStorage.getItem('ecce_worksheet_v3');
    if (!data) { showToast('No saved worksheet', 'error'); return; }
    const saved = JSON.parse(data);
    pagesContainer.innerHTML = '';
    saved.pages.forEach((html, i) => {
        const p = document.createElement('div');
        p.id = `page${i+1}`;
        p.className = `a4-canvas ${i+1 === currentPage ? 'active-page' : ''}`;
        p.innerHTML = html;
        pagesContainer.appendChild(p);
    });
    pageCount = saved.pages.length;
    updatePageSelect();
    saveToHistory();
    attachElementEvents();
    showToast('Worksheet loaded!', 'success');
}

function newWorksheet() {
    if (confirm('Start a new worksheet? All unsaved changes will be lost.')) {
        initPages();
        saveToHistory();
        showToast('New worksheet created', 'success');
    }
}

function shareWorksheet() {
    if (navigator.share) {
        navigator.share({
            title: TOOL_NAME,
            text: 'Check out this amazing ECCE worksheet maker!',
            url: window.location.href
        }).catch(() => {});
    } else {
        navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard!', 'success');
    }
}

// ============================================================
// TOAST
// ============================================================
function showToast(msg, type = 'info') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle' };
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${msg}`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================================
// MODAL
// ============================================================
function showModal(title, body, confirmText = 'Confirm') {
    const overlay = document.getElementById('modalOverlay');
    const titleEl = document.getElementById('modalTitle');
    const bodyEl = document.getElementById('modalBody');
    const confirmBtn = document.getElementById('modalConfirmBtn');

    titleEl.textContent = title;
    bodyEl.innerHTML = body;
    confirmBtn.textContent = confirmText;
    overlay.classList.add('show');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('show');
}

// ============================================================
// TOOLBAR TABS
// ============================================================
function setupToolbarTabs() {
    document.querySelectorAll('.toolbar-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.toolbar-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const group = tab.dataset.tab;
            document.querySelectorAll('.toolbar-group').forEach(g => g.classList.remove('active'));
            document.querySelector(`.toolbar-group[data-group="${group}"]`)?.classList.add('active');
        });
    });
}

// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Z = Undo
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
            e.preventDefault();
            undoAction();
        }
        // Ctrl/Cmd + Y = Redo
        if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
            e.preventDefault();
            redoAction();
        }
        // Ctrl/Cmd + C = Copy
        if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
            e.preventDefault();
            copySelected();
        }
        // Ctrl/Cmd + V = Paste
        if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
            e.preventDefault();
            pasteSelected();
        }
        // Ctrl/Cmd + D = Duplicate
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            duplicateSelected();
        }
        // Ctrl/Cmd + A = Select All
        if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
            e.preventDefault();
            selectAll();
        }
        // Delete/Backspace = Delete
        if (e.key === 'Delete' || e.key === 'Backspace') {
            if (selectedElements.length) {
                e.preventDefault();
                deleteSelected();
            }
        }
        // Escape = Deselect All
        if (e.key === 'Escape') {
            deselectAll();
            closeModal();
            contextMenu.classList.remove('show');
        }
        // Ctrl/Cmd + S = Save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveWorksheet();
        }
    });
}

// ============================================================
// CONTEXT MENU
// ============================================================
function setupContextMenu() {
    const canvas = document.querySelector('.canvas-area');
    if (!canvas) return;

    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const menu = document.getElementById('contextMenu');
        menu.style.left = `${e.clientX}px`;
        menu.style.top = `${e.clientY}px`;
        menu.classList.add('show');
    });

    document.addEventListener('click', () => {
        contextMenu.classList.remove('show');
    });
}

// ============================================================
// REACTIONS
// ============================================================
function setupReactions() {
    document.querySelectorAll('.reaction-item').forEach(item => {
        item.addEventListener('click', () => {
            if (item.classList.contains('active')) return;
            item.classList.add('active');
            const count = item.querySelector('.count');
            count.textContent = parseInt(count.textContent) + 1;
            showToast(`Thanks for the ${item.dataset.reaction}! ❤️`, 'success');
        });
    });
}

// ============================================================
// SHARES
// ============================================================
function setupShares() {
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.dataset.platform;
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(TOOL_NAME);
            const shareUrls = {
                facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
                twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
                linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
                whatsapp: `https://wa.me/?text=${title}%20${url}`,
                copy: null
            };
            if (platform === 'copy') {
                navigator.clipboard.writeText(window.location.href);
                showToast('Link copied!', 'success');
                return;
            }
            if (shareUrls[platform]) {
                window.open(shareUrls[platform], '_blank', 'width=600,height=400');
                showToast(`Shared on ${platform}!`, 'success');
            }
        });
    });
}

// ============================================================
// TYPEWRITER
// ============================================================
function setupTypewriter() {
    const el = document.getElementById('typewriterText');
    if (!el) return;
    const phrases = ['📝 Design custom worksheets', '🔤 Alphabet & Tracing', '🔢 Numbers & Math',
        '🐾 Animals & Nature', '🎨 Creative & Fun', '📚 Educational Activities'
    ];
    let i = 0,
        j = 0,
        isDeleting = false;

    function type() {
        const current = phrases[i];
        if (isDeleting) {
            el.textContent = current.substring(0, j--);
            if (j < 0) { isDeleting = false;
                i = (i + 1) % phrases.length;
                setTimeout(type, 500); return; }
        } else {
            el.textContent = current.substring(0, j++);
            if (j > current.length) { isDeleting = true;
                setTimeout(type, 1500); return; }
        }
        setTimeout(type, isDeleting ? 40 : 70);
    }
    type();
}

// ============================================================
// USAGE TRACKING
// ============================================================
function trackUsage() {
    const stats = JSON.parse(localStorage.getItem('ecce_stats') || '{"usage":0,"views":0,"shares":0,"followers":0}');
    stats.usage = (stats.usage || 0) + 1;
    stats.views = (stats.views || 0) + 1;
    localStorage.setItem('ecce_stats', JSON.stringify(stats));
    updateStatsUI(stats);
}

function updateStatsUI(stats) {
    document.getElementById('usageCount').textContent = stats.usage || 0;
    document.getElementById('viewCount').textContent = stats.views || 0;
    document.getElementById('shareCount').textContent = stats.shares || 0;
    document.getElementById('followerCount').textContent = stats.followers || 0;
}
