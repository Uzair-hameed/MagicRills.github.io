// ========== COMPLETE ECCE WORKSHEET MAKER WITH ALL FEATURES ==========

const BASE_URL = "https://raw.githubusercontent.com/Uzair-hameed/MagicRills.github.io/main/ECCE/ecce-work-sheet-images/";

// Complete 16 Categories Image Database
const IMAGE_DB = {
    alphabet: ["letter A.png","letter B.png","Letter C.png","letter D.png","letter E.png","letter F.png","letter G.png","letter H.png","letter I.png","letter J.png","letter K.png","letter L.png","letter M.png","letter N.png","letter O.png","letter P.png","letter Q.png","letter R.png","letter S.png","letter T.png","letter U.png","letter V.png","letter W.png","letter X.png","letter Y.png","letter Z.png"],
    animals: ["cat.png","dog1.png","elephant.png","lion.png","tiger1.png","monkey.png","rabbit.png","fox.png","giraffe.png","crocodile1.png","bufalo.png","donkey.png","wolf1.png","leopard.png"],
    birds: ["crow.png","parrot.png","sparrow.png","owl.png","pigeon.png","cuckoo.png","falcon.png"],
    body: ["eyes.png","nose.png","ear.png","leg.png","arm.png","hair.png","foot.png","finger.png","lips.png","neck.png","tooth.png"],
    foods: ["rice.png","chapati.png","chicken.png","eggs.png","samosa.png","salt.png","sugar.jpg.png","cardamom.jpg.png"],
    fruits: ["apple.png","mango.png","strawberry.png","apricot.png","plum.png","peach.png","cherry.jpg.png","dates.jpg.png","jamun.png","jujube.png","persimmon.png"],
    vegetables: ["carrot.png","tomato.png","potato.png","cucumber.png","spinach.png","cabbage.png","onion1.png","chilli.png","beet-root.png","bitter-gourd.png","pumpkin.png","radish.png"],
    transportation: ["car.png","bus.png","train.png","bike.png","boat.png","ship.png","airplane-clipart-7.png","truck.png","van.png","cycle.png"],
    numbers: ["1.png","2.png","3.png","4.png","5.png","6.png","7.png","8.png","9.png","10.png","11.png","12.png","13.png","14.png","15.png","16.png","17.png","18.png","19.png","20.png"],
    shapes: ["circle.png","square.png","triangle.png","rectangle.png","star.png","heart.png","diamond.png","hexagon.png","pentagon.png"],
    occupations: ["doctor.png","teacher.png","farmer.png","pilot.png","nurse.png","army.png","tailor.png","potter.png","barber.png","lawyer.png"],
    insects: ["ant.png","butterfuly.png.png","caterpiller.png","cockroach.png","honey-bee.png","mosquito.png","worm.png","beetle.png","dragon-fly.png"],
    "sea-animals": ["fish.png","whale.png","dolphin.png","crab.png","octopus.png","jellyfish.png"],
    reptiles: ["snake.png","frog.png","tortoise.png","lizard.png.png","monitor.png"],
    pots: ["plate.png.png","spoon.png.png","glass.png.png","knife.png.png","bag.jpg.png","bottol.jpg.png"],
    mixed: ["clock.png","moon.png","star.png","heart.png","cloud.png","fire.png","phone.png","umbrella.png","TV.png","bulb.png","calculator.png"]
};

// State variables
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
let gridSize = 20;

// Stats for the tool
let toolUsageCount = 0;
let toolReactions = {
    like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0
};
let userReactions = new Set();
let toolShareCount = 0;

// DOM Elements
const pagesContainer = document.getElementById("pagesContainer");
const pageSelect = document.getElementById("pageSelect");
const pageInfo = document.getElementById("pageInfo");
const canvasWrapper = document.getElementById("canvasWrapper");
const zoomLevel = document.getElementById("zoomLevel");
const selectedCountSpan = document.getElementById("selectedCount");
const layersPanel = document.getElementById("layersPanel");
const assessmentPanel = document.getElementById("assessmentPanel");
const toastContainer = document.getElementById("toastContainer");
const loadingSpinner = document.getElementById("loadingSpinner");
const scrollUpBtn = document.getElementById("scrollUpBtn");
const scrollDownBtn = document.getElementById("scrollDownBtn");

// ========== TOAST NOTIFICATIONS ==========
function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========== LOADING SPINNER ==========
function showLoading() {
    loadingSpinner.style.display = "flex";
}

function hideLoading() {
    loadingSpinner.style.display = "none";
}

// ========== USAGE TRACKER (Feature 1) ==========
async function trackUsage() {
    try {
        // Get user IP or generate unique ID
        let userId = localStorage.getItem("userId");
        if (!userId) {
            userId = "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
            localStorage.setItem("userId", userId);
        }
        
        // Check if already used today
        const lastUsed = localStorage.getItem("lastUsed");
        const today = new Date().toDateString();
        
        if (lastUsed !== today) {
            toolUsageCount++;
            localStorage.setItem("lastUsed", today);
            localStorage.setItem("toolUsageCount", toolUsageCount);
            document.getElementById("usageCount").textContent = toolUsageCount;
            showToast(`Tool used ${toolUsageCount} times!`, "success");
            
            // Save to local storage for now (will sync with API later)
            saveStatsToLocal();
        }
    } catch (error) {
        console.error("Usage tracking error:", error);
    }
}

// ========== REACTIONS (Feature 2) ==========
function setupReactions() {
    const reactionItems = document.querySelectorAll(".reaction-item");
    const userId = getUserId();
    
    // Load saved reactions
    loadReactionsFromLocal();
    
    reactionItems.forEach(item => {
        const reactionType = item.dataset.reaction;
        
        // Check if user already reacted
        const reactedKey = `reacted_${reactionType}_${userId}`;
        if (localStorage.getItem(reactedKey)) {
            item.classList.add("active");
        }
        
        item.addEventListener("click", async () => {
            const isActive = item.classList.contains("active");
            
            if (!isActive) {
                // Add reaction
                item.classList.add("active");
                toolReactions[reactionType]++;
                updateReactionCount(reactionType, toolReactions[reactionType]);
                localStorage.setItem(`reacted_${reactionType}_${userId}`, "true");
                saveReactionsToLocal();
                showToast(`Thanks for your ${getReactionName(reactionType)} reaction! 🎉`, "success");
                
                // Update total reactions
                const totalReactions = Object.values(toolReactions).reduce((a,b) => a + b, 0);
                document.getElementById("totalReactions").textContent = totalReactions;
            }
        });
    });
}

function getReactionName(type) {
    const names = {
        like: "Like", love: "Love", wow: "Wow", sad: "Sad", angry: "Angry", laugh: "Laugh", celebrate: "Celebrate"
    };
    return names[type] || type;
}

function updateReactionCount(type, count) {
    const element = document.getElementById(`${type}Count`);
    if (element) element.textContent = count;
}

function loadReactionsFromLocal() {
    const saved = localStorage.getItem("toolReactions");
    if (saved) {
        toolReactions = JSON.parse(saved);
        for (const [type, count] of Object.entries(toolReactions)) {
            updateReactionCount(type, count);
        }
    }
}

function saveReactionsToLocal() {
    localStorage.setItem("toolReactions", JSON.stringify(toolReactions));
}

// ========== SOCIAL SHARE (Feature 3) ==========
function setupSocialShares() {
    const shareBtns = document.querySelectorAll(".share-btn");
    const toolUrl = encodeURIComponent(window.location.href);
    const toolTitle = encodeURIComponent("ECCE Worksheet Maker - Create Custom Worksheets");
    
    shareBtns.forEach(btn => {
        btn.addEventListener("click", async () => {
            const platform = btn.dataset.platform;
            let shareUrl = "";
            
            switch(platform) {
                case "facebook":
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${toolUrl}`;
                    break;
                case "twitter":
                    shareUrl = `https://twitter.com/intent/tweet?text=${toolTitle}&url=${toolUrl}`;
                    break;
                case "linkedin":
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${toolUrl}`;
                    break;
                case "whatsapp":
                    shareUrl = `https://wa.me/?text=${toolTitle}%20${toolUrl}`;
                    break;
                case "email":
                    shareUrl = `mailto:?subject=${toolTitle}&body=Check out this tool: ${toolUrl}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, "_blank", "width=600,height=400");
                toolShareCount++;
                document.getElementById("totalShares").textContent = toolShareCount;
                localStorage.setItem("toolShareCount", toolShareCount);
                showToast(`Shared on ${platform}! 🎉`, "success");
                saveStatsToLocal();
            }
        });
    });
}

// ========== PAGE SHARE BUTTON (Feature 4) ==========
function setupPageShare() {
    const sharePageBtn = document.getElementById("sharePageBtn");
    if (sharePageBtn) {
        sharePageBtn.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(window.location.href);
                toolShareCount++;
                document.getElementById("totalShares").textContent = toolShareCount;
                localStorage.setItem("toolShareCount", toolShareCount);
                saveStatsToLocal();
                showToast("✅ Page link copied to clipboard!", "success");
            } catch (err) {
                showToast("Failed to copy link", "error");
            }
        });
    }
}

// ========== SCROLL BUTTONS (Feature 5) ==========
function setupScrollButtons() {
    // Scroll Down button
    scrollDownBtn.addEventListener("click", () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
        });
    });
    
    // Scroll Up button (initially hidden)
    scrollUpBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
    
    // Show/hide up button based on scroll position
    window.addEventListener("scroll", () => {
        if (window.scrollY > 200) {
            scrollUpBtn.style.display = "flex";
        } else {
            scrollUpBtn.style.display = "none";
        }
    });
}

// ========== HELPER FUNCTIONS ==========
function getUserId() {
    let userId = localStorage.getItem("userId");
    if (!userId) {
        userId = "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
        localStorage.setItem("userId", userId);
    }
    return userId;
}

function saveStatsToLocal() {
    const stats = {
        usageCount: toolUsageCount,
        shareCount: toolShareCount,
        reactions: toolReactions,
        lastUpdated: new Date().toISOString()
    };
    localStorage.setItem("ecceWorksheetStats", JSON.stringify(stats));
}

function loadStatsFromLocal() {
    const saved = localStorage.getItem("ecceWorksheetStats");
    if (saved) {
        const stats = JSON.parse(saved);
        toolUsageCount = stats.usageCount || 0;
        toolShareCount = stats.shareCount || 0;
        if (stats.reactions) toolReactions = stats.reactions;
        
        document.getElementById("usageCount").textContent = toolUsageCount;
        document.getElementById("totalShares").textContent = toolShareCount;
        
        for (const [type, count] of Object.entries(toolReactions)) {
            updateReactionCount(type, count);
        }
        
        const totalReactions = Object.values(toolReactions).reduce((a,b) => a + b, 0);
        document.getElementById("totalReactions").textContent = totalReactions;
    }
}

// ========== INITIALIZE PAGES ==========
function initPages() {
    pageCount = 1;
    currentPage = 1;
    pagesContainer.innerHTML = '';
    addNewPage(1);
    updatePageSelect();
}

function addNewPage(pageNum) {
    const page = document.createElement("div");
    page.id = `page${pageNum}`;
    page.className = `a4-canvas ${pageNum === currentPage ? 'active-page' : ''}`;
    page.innerHTML = `<div class="canvas-inner"><div class="default-message"><i class="fas fa-hand-pointer"></i> Page ${pageNum} - Drag images to design</div></div>`;
    pagesContainer.appendChild(page);
}

function addPage() {
    pageCount++;
    addNewPage(pageCount);
    currentPage = pageCount;
    updatePageSelect();
    switchToPage(currentPage);
    saveToHistory();
    showToast(`Page ${pageCount} added`, "success");
}

function removePage() {
    if (pageCount > 1) {
        document.getElementById(`page${pageCount}`).remove();
        pageCount--;
        if (currentPage > pageCount) currentPage = pageCount;
        updatePageSelect();
        switchToPage(currentPage);
        saveToHistory();
        showToast(`Page ${pageCount + 1} removed`, "info");
    } else {
        showToast("Cannot remove the last page", "error");
    }
}

function updatePageSelect() {
    pageSelect.innerHTML = '';
    for (let i = 1; i <= pageCount; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = `Page ${i}`;
        if (i === currentPage) option.selected = true;
        pageSelect.appendChild(option);
    }
    pageInfo.textContent = `Page ${currentPage}/${pageCount}`;
}

function switchToPage(pageNum) {
    currentPage = pageNum;
    document.querySelectorAll('.a4-canvas').forEach((page, idx) => {
        if (idx + 1 === pageNum) {
            page.classList.add('active-page');
        } else {
            page.classList.remove('active-page');
        }
    });
    updatePageSelect();
    updateLayersList();
}

function getCurrentCanvas() {
    return document.getElementById(`page${currentPage}`).querySelector('.canvas-inner');
}

// ========== HISTORY (Undo/Redo) ==========
function saveToHistory() {
    const state = getCurrentCanvas().innerHTML;
    history = history.slice(0, historyIndex + 1);
    history.push(state);
    historyIndex++;
    if (history.length > 50) history.shift();
}

function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        getCurrentCanvas().innerHTML = history[historyIndex];
        selectedElements = [];
        updateSelectedCount();
        showToast("Undo successful", "info");
    } else {
        showToast("Nothing to undo", "info");
    }
}

function redo() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        getCurrentCanvas().innerHTML = history[historyIndex];
        selectedElements = [];
        updateSelectedCount();
        showToast("Redo successful", "info");
    } else {
        showToast("Nothing to redo", "info");
    }
}

// ========== ELEMENT MANAGEMENT ==========
function addElementToPage(createFn, ...args) {
    saveToHistory();
    removeDefaultMessage(getCurrentCanvas());
    createFn(getCurrentCanvas(), ...args);
}

function removeDefaultMessage(canvas) {
    const msg = canvas.querySelector(".default-message");
    if (msg) msg.remove();
}

function addImageElement(canvas, src, x, y, w, h) {
    const id = currentId++;
    const div = document.createElement("div");
    div.className = "canvas-element";
    div.id = `elem-${id}`;
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
    div.style.width = `${w}px`;
    div.style.height = `${h}px`;
    div.innerHTML = `<img src="${src}" alt="element"><div class="resize-handle"></div>`;
    div.onclick = (e) => { e.stopPropagation(); selectElement(div); };
    makeDraggable(div);
    makeResizable(div);
    canvas.appendChild(div);
    addToLayers(div);
    if (gridEnabled && snapEnabled) snapToGrid(div);
}

function addTextElement(canvas, text, x, y) {
    const id = currentId++;
    const div = document.createElement("div");
    div.className = "canvas-element";
    div.id = `elem-${id}`;
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
    div.innerHTML = `<span class="element-text" style="font-family:${fontSelect.value}; font-size:${fontSizeSelect.value}px; color:${textColor.value};">${text}</span><div class="resize-handle"></div>`;
    div.onclick = (e) => { e.stopPropagation(); selectElement(div); };
    makeDraggable(div);
    canvas.appendChild(div);
    addToLayers(div);
}

function addShape(canvas, type, x, y) {
    const id = currentId++;
    const div = document.createElement("div");
    div.className = "canvas-element";
    div.id = `elem-${id}`;
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
    
    if (type === "line") {
        div.style.width = "150px";
        div.style.height = "2px";
        div.style.backgroundColor = "#333";
    } else if (type === "dotted") {
        div.style.width = "150px";
        div.style.height = "2px";
        div.style.borderTop = "2px dotted #333";
    } else if (type === "box") {
        div.style.width = "100px";
        div.style.height = "100px";
        div.style.border = "2px solid #333";
    } else if (type === "circle") {
        div.style.width = "80px";
        div.style.height = "80px";
        div.style.borderRadius = "50%";
        div.style.border = "2px solid #333";
    } else if (type === "tracing") {
        div.style.width = "200px";
        div.style.height = "40px";
        div.style.borderBottom = "2px dotted #999";
        div.innerHTML = `<span class="element-text" style="font-size:20px;">__________</span><div class="resize-handle"></div>`;
    }
    
    if (type !== "tracing") div.innerHTML += `<div class="resize-handle"></div>`;
    div.onclick = (e) => { e.stopPropagation(); selectElement(div); };
    makeDraggable(div);
    if (type !== "tracing") makeResizable(div);
    canvas.appendChild(div);
    addToLayers(div);
}

function addMathEquation(canvas, type, x, y) {
    const id = currentId++;
    const div = document.createElement("div");
    div.className = "canvas-element math-equation";
    div.id = `elem-${id}`;
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
    div.style.width = "200px";
    div.style.height = "80px";
    
    if (type === "addition") {
        div.innerHTML = `<div class="math-equation">${Math.floor(Math.random()*10)+1} + ${Math.floor(Math.random()*10)+1} = <input type="text" class="math-answer" placeholder="?"></div><div class="resize-handle"></div>`;
    } else if (type === "subtraction") {
        let a = Math.floor(Math.random()*10)+1;
        let b = Math.floor(Math.random()*a)+1;
        div.innerHTML = `<div class="math-equation">${a} - ${b} = <input type="text" class="math-answer" placeholder="?"></div><div class="resize-handle"></div>`;
    } else if (type === "numberline") {
        div.innerHTML = `<div class="math-equation">Number Line:<br>1___2___3___4___5___6___7___8___9___10</div><div class="resize-handle"></div>`;
    }
    
    div.onclick = (e) => { e.stopPropagation(); selectElement(div); };
    makeDraggable(div);
    canvas.appendChild(div);
    addToLayers(div);
}

function addWordBank(canvas, x, y) {
    const id = currentId++;
    const div = document.createElement("div");
    div.className = "canvas-element word-bank";
    div.id = `elem-${id}`;
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
    div.style.width = "250px";
    div.style.minHeight = "100px";
    div.innerHTML = `<div class="word-bank"><strong>📚 Word Bank:</strong><br><span class="word-item">Apple</span> <span class="word-item">Cat</span> <span class="word-item">Dog</span> <span class="word-item">Sun</span></div><div class="resize-handle"></div>`;
    div.onclick = (e) => { e.stopPropagation(); selectElement(div); };
    makeDraggable(div);
    canvas.appendChild(div);
    addToLayers(div);
}

function addColorByNumber(canvas, x, y) {
    const id = currentId++;
    const div = document.createElement("div");
    div.className = "canvas-element color-by-number";
    div.id = `elem-${id}`;
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
    div.style.width = "300px";
    div.innerHTML = `<div class="color-by-number">
        <div class="color-number-item"><div class="color-box" style="background:#ff6b6b;"></div><div>1</div></div>
        <div class="color-number-item"><div class="color-box" style="background:#4ecdc4;"></div><div>2</div></div>
        <div class="color-number-item"><div class="color-box" style="background:#45b7d1;"></div><div>3</div></div>
        <div class="color-number-item"><div class="color-box" style="background:#f9ca24;"></div><div>4</div></div>
    </div><div class="resize-handle"></div>`;
    div.onclick = (e) => { e.stopPropagation(); selectElement(div); };
    makeDraggable(div);
    canvas.appendChild(div);
    addToLayers(div);
}

function addMcq(canvas, x, y) {
    const id = currentId++;
    const div = document.createElement("div");
    div.className = "canvas-element";
    div.id = `elem-${id}`;
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
    div.style.width = "250px";
    div.innerHTML = `<div><strong>❓ Question:</strong> What is this?<br>
        <div class="mcq-option"><input type="radio" name="mcq_${id}"> Option A</div>
        <div class="mcq-option"><input type="radio" name="mcq_${id}"> Option B</div>
        <div class="mcq-option"><input type="radio" name="mcq_${id}"> Option C</div>
    </div><div class="resize-handle"></div>`;
    div.onclick = (e) => { e.stopPropagation(); selectElement(div); };
    makeDraggable(div);
    canvas.appendChild(div);
    addToLayers(div);
}

function addFillBlank(canvas, x, y) {
    const id = currentId++;
    const div = document.createElement("div");
    div.className = "canvas-element";
    div.id = `elem-${id}`;
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
    div.style.width = "250px";
    div.innerHTML = `<div>The cat is _____ the table.<br><input type="text" placeholder="Write your answer..." style="width:120px; margin-top:8px; padding:6px; border:1px solid #ddd; border-radius:8px;"></div><div class="resize-handle"></div>`;
    div.onclick = (e) => { e.stopPropagation(); selectElement(div); };
    makeDraggable(div);
    canvas.appendChild(div);
    addToLayers(div);
}

// ========== SELECTION HANDLING ==========
function selectElement(el) {
    if (el.classList.contains("selected")) {
        el.classList.remove("selected");
        selectedElements = selectedElements.filter(e => e !== el);
    } else {
        // Deselect others if not holding Ctrl
        if (!event.ctrlKey) {
            selectedElements.forEach(e => e.classList.remove("selected"));
            selectedElements = [];
        }
        el.classList.add("selected");
        selectedElements.push(el);
    }
    updateSelectedCount();
}

function updateSelectedCount() {
    selectedElements = Array.from(getCurrentCanvas().querySelectorAll(".canvas-element.selected"));
    selectedCountSpan.textContent = selectedElements.length;
}

// ========== DRAG AND RESIZE ==========
function makeDraggable(el) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;
    
    el.addEventListener("mousedown", (e) => {
        if (e.target.classList && e.target.classList.contains("resize-handle")) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = parseInt(el.style.left);
        initialTop = parseInt(el.style.top);
        e.preventDefault();
    });
    
    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            let newLeft = initialLeft + dx;
            let newTop = initialTop + dy;
            if (snapEnabled && gridEnabled) {
                newLeft = Math.round(newLeft / gridSize) * gridSize;
                newTop = Math.round(newTop / gridSize) * gridSize;
            }
            el.style.left = `${newLeft}px`;
            el.style.top = `${newTop}px`;
        }
    });
    
    document.addEventListener("mouseup", () => { isDragging = false; });
}

function makeResizable(el) {
    const handle = el.querySelector(".resize-handle");
    if (!handle) return;
    
    let isResizing = false;
    let startX, startW, startH;
    
    handle.addEventListener("mousedown", (e) => {
        isResizing = true;
        startX = e.clientX;
        startW = parseInt(el.style.width);
        startH = parseInt(el.style.height);
        e.stopPropagation();
        e.preventDefault();
    });
    
    document.addEventListener("mousemove", (e) => {
        if (isResizing) {
            const dx = e.clientX - startX;
            const newW = Math.max(30, startW + dx);
            el.style.width = `${newW}px`;
            el.style.height = `${newW * (startH/startW)}px`;
        }
    });
    
    document.addEventListener("mouseup", () => { isResizing = false; });
}

// ========== GRID SYSTEM ==========
function toggleGrid() {
    gridEnabled = !gridEnabled;
    const canvas = getCurrentCanvas();
    const existingGrid = canvas.querySelector('.grid-lines');
    if (gridEnabled && !existingGrid) {
        const gridDiv = document.createElement('div');
        gridDiv.className = 'grid-lines';
        const canvasWidth = canvas.clientWidth;
        for (let i = 0; i < canvasWidth + 500; i += gridSize) {
            const vLine = document.createElement('div');
            vLine.className = 'grid-line-v';
            vLine.style.left = `${i}px`;
            gridDiv.appendChild(vLine);
        }
        for (let i = 0; i < 1000; i += gridSize) {
            const hLine = document.createElement('div');
            hLine.className = 'grid-line-h';
            hLine.style.top = `${i}px`;
            gridDiv.appendChild(hLine);
        }
        canvas.appendChild(gridDiv);
        showToast("Grid enabled", "success");
    } else if (!gridEnabled && existingGrid) {
        existingGrid.remove();
        showToast("Grid disabled", "info");
    }
}

function toggleSnap() {
    snapEnabled = !snapEnabled;
    showToast(snapEnabled ? "Snap to grid enabled" : "Snap to grid disabled", "info");
}

function snapToGrid(el) {
    let left = parseInt(el.style.left);
    let top = parseInt(el.style.top);
    el.style.left = `${Math.round(left / gridSize) * gridSize}px`;
    el.style.top = `${Math.round(top / gridSize) * gridSize}px`;
}

// ========== LAYERS MANAGEMENT ==========
function updateLayersList() {
    const layersList = document.getElementById("layersList");
    const elements = getCurrentCanvas().querySelectorAll(".canvas-element");
    layersList.innerHTML = '';
    elements.forEach((el, idx) => {
        const layerDiv = document.createElement("div");
        layerDiv.className = "layer-item";
        const type = el.querySelector('img') ? '🖼️ Image' : (el.querySelector('.element-text') ? '📝 Text' : '📐 Shape');
        layerDiv.innerHTML = `<span>${type} ${idx+1}</span><span>${parseInt(el.style.left) || 0}x, ${parseInt(el.style.top) || 0}y</span>`;
        layerDiv.onclick = () => selectElement(el);
        layersList.appendChild(layerDiv);
    });
}

function addToLayers(el) {
    updateLayersList();
}

// ========== TEMPLATES ==========
function applyTemplate(templateName) {
    const canvas = getCurrentCanvas();
    canvas.innerHTML = '';
    removeDefaultMessage(canvas);
    
    if (templateName === 'alphabet_a') {
        addImageElement(canvas, `${BASE_URL}alphabet/letter%20A.png`, 50, 50, 150, 150);
        addTextElement(canvas, 'Trace the letter A', 50, 230, 150, 30);
        addShape(canvas, 'tracing', 50, 280, 200, 40);
    } else if (templateName === 'number_1') {
        addImageElement(canvas, `${BASE_URL}numbers/1.png`, 50, 50, 120, 120);
        addTextElement(canvas, 'Count: 1', 50, 200, 150, 30);
        addTextElement(canvas, 'Draw 1 apple', 50, 250, 150, 30);
    } else if (templateName === 'shape_circle') {
        addShape(canvas, 'circle', 50, 50, 100, 100);
        addTextElement(canvas, 'Color the circle red', 50, 180, 200, 30);
    } else if (templateName === 'alphabet_b') {
        addImageElement(canvas, `${BASE_URL}alphabet/letter%20B.png`, 50, 50, 150, 150);
        addTextElement(canvas, 'Trace the letter B', 50, 230, 150, 30);
        addShape(canvas, 'tracing', 50, 280, 200, 40);
    } else if (templateName === 'number_10') {
        addImageElement(canvas, `${BASE_URL}numbers/10.png`, 50, 50, 120, 120);
        addTextElement(canvas, 'Count to 10', 50, 200, 150, 30);
    } else if (templateName === 'shape_square') {
        addShape(canvas, 'box', 50, 50, 100, 100);
        addTextElement(canvas, 'Color the square blue', 50, 180, 200, 30);
    }
    saveToHistory();
    showToast(`Template "${templateName}" applied`, "success");
}

// ========== ASSESSMENT/GRADING ==========
function gradeAssessment() {
    const results = [];
    const mcqs = getCurrentCanvas().querySelectorAll('.mcq-option input:checked');
    const fillBlanks = getCurrentCanvas().querySelectorAll('.math-answer');
    
    results.push(`<strong>📊 Assessment Results:</strong><br>`);
    results.push(`✅ MCQs Attempted: ${mcqs.length}<br>`);
    results.push(`📝 Fill Blanks: ${fillBlanks.length}<br>`);
    results.push(`📈 Total Score: ${mcqs.length + fillBlanks.length} points<br>`);
    results.push(`<hr><small>Great job! Keep practicing! 🎉</small>`);
    
    document.getElementById('assessmentResults').innerHTML = results.join('');
    assessmentPanel.style.display = 'block';
    showToast("Assessment complete!", "success");
}

// ========== IMAGE UPLOAD ==========
document.getElementById("uploadImageBtn")?.addEventListener("click", () => {
    document.getElementById("desktopUpload").click();
});

document.getElementById("desktopUpload")?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const pos = getRandomPosition();
            addElementToPage(addImageElement, event.target.result, pos.x, pos.y, 150, 150);
            showToast("Image uploaded successfully!", "success");
        };
        reader.readAsDataURL(file);
    }
});

// ========== WATERMARK ==========
function addWatermark() {
    const canvas = getCurrentCanvas();
    const existingWm = canvas.querySelector('.watermark');
    if (existingWm) existingWm.remove();
    const watermark = document.createElement('div');
    watermark.className = 'watermark';
    watermark.style.position = 'absolute';
    watermark.style.bottom = '10px';
    watermark.style.right = '10px';
    watermark.style.opacity = '0.3';
    watermark.style.fontSize = '12px';
    watermark.style.color = '#999';
    watermark.innerHTML = '🏫 Made with MagicRills';
    canvas.appendChild(watermark);
    showToast("Watermark added", "success");
}

// ========== HELPER FUNCTIONS ==========
function getRandomPosition() {
    return { x: 30 + Math.random() * 400, y: 30 + Math.random() * 500 };
}

// ========== IMAGE LIBRARY ==========
let libraryVisible = false;
const categorySelect = document.getElementById("categorySelect");
const imageLibrary = document.getElementById("imageLibrary");

categorySelect?.addEventListener("click", (e) => {
    e.stopPropagation();
    libraryVisible = !libraryVisible;
    if (libraryVisible) {
        loadImageLibrary();
        imageLibrary.classList.add("show");
    } else {
        imageLibrary.classList.remove("show");
    }
});

document.addEventListener("click", (e) => {
    if (imageLibrary && !imageLibrary.contains(e.target) && e.target !== categorySelect) {
        imageLibrary.classList.remove("show");
        libraryVisible = false;
    }
});

function loadImageLibrary() {
    const category = categorySelect.value;
    const images = IMAGE_DB[category] || [];
    imageLibrary.innerHTML = "";
    images.forEach(img => {
        const div = document.createElement("div");
        div.className = "lib-img";
        div.innerHTML = `<img src="${BASE_URL}${category}/${encodeURIComponent(img)}" onerror="this.src='https://via.placeholder.com/50'"><span>${img.substring(0,8)}</span>`;
        div.onclick = () => {
            const pos = getRandomPosition();
            addElementToPage(addImageElement, `${BASE_URL}${category}/${encodeURIComponent(img)}`, pos.x, pos.y, 120, 120);
            imageLibrary.classList.remove("show");
            libraryVisible = false;
            trackUsage(); // Track usage when image is added
        };
        imageLibrary.appendChild(div);
    });
}

// ========== ZOOM FUNCTIONALITY ==========
function updateZoom() {
    const worksheetCanvas = document.querySelector(".pages-container");
    if (worksheetCanvas) {
        worksheetCanvas.style.transform = `scale(${currentZoom})`;
        worksheetCanvas.style.transformOrigin = "top center";
        zoomLevel.textContent = `${Math.round(currentZoom * 100)}%`;
    }
}

// ========== SAVE/LOAD FUNCTIONS ==========
function saveWorksheet() {
    const pages = [];
    document.querySelectorAll('.a4-canvas').forEach((page, idx) => {
        pages.push(page.innerHTML);
    });
    const data = { pages, version: "2.0", timestamp: new Date().toISOString() };
    localStorage.setItem("ecce_worksheet", JSON.stringify(data));
    showToast("Worksheet saved successfully!", "success");
}

function loadWorksheet() {
    const data = localStorage.getItem("ecce_worksheet");
    if (data) {
        const saved = JSON.parse(data);
        pagesContainer.innerHTML = '';
        saved.pages.forEach((pageHtml, idx) => {
            const page = document.createElement("div");
            page.id = `page${idx+1}`;
            page.className = `a4-canvas ${idx+1 === currentPage ? 'active-page' : ''}`;
            page.innerHTML = pageHtml;
            pagesContainer.appendChild(page);
        });
        pageCount = saved.pages.length;
        updatePageSelect();
        saveToHistory();
        showToast("Worksheet loaded successfully!", "success");
    } else {
        showToast("No saved worksheet found", "error");
    }
}

// ========== COPY/PASTE/DELETE ==========
function copySelected() {
    if (selectedElements.length) {
        const tempDiv = document.createElement("div");
        selectedElements.forEach(el => {
            tempDiv.appendChild(el.cloneNode(true));
        });
        clipboard = tempDiv.innerHTML;
        showToast(`Copied ${selectedElements.length} element(s)`, "success");
    } else {
        showToast("No element selected", "error");
    }
}

function pasteSelected() {
    if (clipboard) {
        saveToHistory();
        const temp = document.createElement("div");
        temp.innerHTML = clipboard;
        const elements = temp.children;
        Array.from(elements).forEach(el => {
            const id = currentId++;
            const newEl = el.cloneNode(true);
            newEl.id = `elem-${id}`;
            let left = parseInt(newEl.style.left) || 50;
            let top = parseInt(newEl.style.top) || 50;
            newEl.style.left = `${left + 20}px`;
            newEl.style.top = `${top + 20}px`;
            getCurrentCanvas().appendChild(newEl);
            makeDraggable(newEl);
            if (newEl.querySelector(".resize-handle")) makeResizable(newEl);
            addToLayers(newEl);
        });
        showToast("Pasted successfully", "success");
    } else {
        showToast("Nothing to paste", "error");
    }
}

function deleteSelected() {
    if (selectedElements.length) {
        saveToHistory();
        selectedElements.forEach(el => el.remove());
        selectedElements = [];
        updateSelectedCount();
        updateLayersList();
        showToast("Deleted selected element(s)", "success");
    } else {
        showToast("No element selected", "error");
    }
}

// ========== ALIGNMENT ==========
function alignLeft() {
    if (selectedElements.length) {
        let minLeft = Math.min(...selectedElements.map(el => parseInt(el.style.left) || 0));
        selectedElements.forEach(el => el.style.left = `${minLeft}px`);
        showToast("Aligned left", "success");
    }
}

function alignCenter() {
    if (selectedElements.length) {
        let centerX = (getCurrentCanvas().clientWidth / 2);
        selectedElements.forEach(el => {
            let width = parseInt(el.style.width) || 100;
            el.style.left = `${centerX - width/2}px`;
        });
        showToast("Aligned center", "success");
    }
}

function alignRight() {
    if (selectedElements.length) {
        let maxRight = Math.max(...selectedElements.map(el => (parseInt(el.style.left) || 0) + (parseInt(el.style.width) || 100)));
        selectedElements.forEach(el => {
            let width = parseInt(el.style.width) || 100;
            el.style.left = `${maxRight - width}px`;
        });
        showToast("Aligned right", "success");
    }
}

// ========== FORMATTING ==========
function applyBold() {
    selectedElements.forEach(el => {
        const text = el.querySelector(".element-text");
        if (text) text.style.fontWeight = "bold";
    });
    showToast("Applied bold", "success");
}

function applyItalic() {
    selectedElements.forEach(el => {
        const text = el.querySelector(".element-text");
        if (text) text.style.fontStyle = "italic";
    });
    showToast("Applied italic", "success");
}

function applyUnderline() {
    selectedElements.forEach(el => {
        const text = el.querySelector(".element-text");
        if (text) text.style.textDecoration = "underline";
    });
    showToast("Applied underline", "success");
}

// ========== Z-INDEX ==========
function bringToFront() {
    selectedElements.forEach(el => el.style.zIndex = Date.now());
    showToast("Brought to front", "success");
}

function sendToBack() {
    selectedElements.forEach(el => el.style.zIndex = -Date.now());
    showToast("Sent to back", "success");
}

// ========== EXPORT FUNCTIONS ==========
async function downloadPDF() {
    showLoading();
    const element = document.getElementById(`page${currentPage}`);
    try {
        const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
        const imgData = canvas.toDataURL("image/png");
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save("worksheet.pdf");
        showToast("PDF downloaded!", "success");
    } catch(e) {
        showToast("Use Print instead", "error");
    }
    hideLoading();
}

function downloadWord() {
    const content = document.getElementById(`page${currentPage}`).cloneNode(true);
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Worksheet</title><style>body{padding:1cm; font-family:Arial;}</style></head><body>${content.innerHTML}</body></html>`;
    const blob = new Blob([html], { type: "application/msword" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "worksheet.doc";
    link.click();
    URL.revokeObjectURL(link.href);
    showToast("Word document downloaded!", "success");
}

function downloadPNG() {
    const element = document.getElementById(`page${currentPage}`);
    html2canvas(element, { scale: 2, backgroundColor: "#ffffff", useCORS: true }).then(canvas => {
        const link = document.createElement("a");
        link.download = "worksheet.png";
        link.href = canvas.toDataURL();
        link.click();
        showToast("PNG image downloaded!", "success");
    });
}

function downloadSVG() {
    const element = document.getElementById(`page${currentPage}`).cloneNode(true);
    const html = element.outerHTML;
    const blob = new Blob([html], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "worksheet.svg";
    link.click();
    URL.revokeObjectURL(link.href);
    showToast("SVG downloaded!", "success");
}

// ========== EVENT LISTENERS SETUP ==========
function setupEventListeners() {
    // File operations
    document.getElementById("newBtn")?.addEventListener("click", () => {
        if (confirm("Start a new worksheet? Unsaved changes will be lost!")) {
            initPages();
            saveToHistory();
            showToast("New worksheet created", "success");
        }
    });
    document.getElementById("saveBtn")?.addEventListener("click", saveWorksheet);
    document.getElementById("loadBtn")?.addEventListener("click", loadWorksheet);
    document.getElementById("undoBtn")?.addEventListener("click", undo);
    document.getElementById("redoBtn")?.addEventListener("click", redo);
    document.getElementById("printBtn")?.addEventListener("click", () => window.print());
    document.getElementById("addPageBtn")?.addEventListener("click", addPage);
    document.getElementById("removePageBtn")?.addEventListener("click", removePage);
    pageSelect?.addEventListener("change", (e) => switchToPage(parseInt(e.target.value)));
    
    // Grid & Layers
    document.getElementById("toggleGridBtn")?.addEventListener("click", toggleGrid);
    document.getElementById("toggleSnapBtn")?.addEventListener("click", toggleSnap);
    document.getElementById("showLayersBtn")?.addEventListener("click", () => {
        layersPanel.classList.toggle("show");
        updateLayersList();
    });
    document.getElementById("closeLayersBtn")?.addEventListener("click", () => layersPanel.classList.remove("show"));
    
    // Assessment
    document.getElementById("gradeBtn")?.addEventListener("click", gradeAssessment);
    document.getElementById("closeAssessmentBtn")?.addEventListener("click", () => assessmentPanel.style.display = "none");
    
    // Templates
    const templateSelect = document.getElementById("templateSelect");
    templateSelect?.addEventListener("change", (e) => {
        if (e.target.value) {
            applyTemplate(e.target.value);
            e.target.value = "";
        }
    });
    
    // Add elements
    document.getElementById("addTextBtn")?.addEventListener("click", () => {
        const text = document.getElementById("newText")?.value || "Sample Text";
        const pos = getRandomPosition();
        addElementToPage(addTextElement, text, pos.x, pos.y);
    });
    document.getElementById("addLineBtn")?.addEventListener("click", () => {
        const pos = getRandomPosition();
        addElementToPage(addShape, "line", pos.x, pos.y);
    });
    document.getElementById("addDottedBtn")?.addEventListener("click", () => {
        const pos = getRandomPosition();
        addElementToPage(addShape, "dotted", pos.x, pos.y);
    });
    document.getElementById("addBoxBtn")?.addEventListener("click", () => {
        const pos = getRandomPosition();
        addElementToPage(addShape, "box", pos.x, pos.y);
    });
    document.getElementById("addCircleBtn")?.addEventListener("click", () => {
        const pos = getRandomPosition();
        addElementToPage(addShape, "circle", pos.x, pos.y);
    });
    document.getElementById("addTracingBtn")?.addEventListener("click", () => {
        const pos = getRandomPosition();
        addElementToPage(addShape, "tracing", pos.x, pos.y);
    });
    document.getElementById("addMathBtn")?.addEventListener("click", () => {
        const pos = getRandomPosition();
        addElementToPage(addMathEquation, "addition", pos.x, pos.y);
    });
    document.getElementById("addSubtractBtn")?.addEventListener("click", () => {
        const pos = getRandomPosition();
        addElementToPage(addMathEquation, "subtraction", pos.x, pos.y);
    });
    document.getElementById("addNumberLineBtn")?.addEventListener("click", () => {
        const pos = getRandomPosition();
        addElementToPage(addMathEquation, "numberline", pos.x, pos.y);
    });
    document.getElementById("addWordBankBtn")?.addEventListener("click", () => {
        const pos = getRandomPosition();
        addElementToPage(addWordBank, pos.x, pos.y);
    });
    document.getElementById("addColorByNumberBtn")?.addEventListener("click", () => {
        const pos = getRandomPosition();
        addElementToPage(addColorByNumber, pos.x, pos.y);
    });
    document.getElementById("addMcqBtn")?.addEventListener("click", () => {
        const pos = getRandomPosition();
        addElementToPage(addMcq, pos.x, pos.y);
    });
    document.getElementById("addFillBlankBtn")?.addEventListener("click", () => {
        const pos = getRandomPosition();
        addElementToPage(addFillBlank, pos.x, pos.y);
    });
    document.getElementById("addWatermarkBtn")?.addEventListener("click", addWatermark);
    
    // Edit operations
    document.getElementById("copyBtn")?.addEventListener("click", copySelected);
    document.getElementById("pasteBtn")?.addEventListener("click", pasteSelected);
    document.getElementById("deleteBtn")?.addEventListener("click", deleteSelected);
    document.getElementById("bringFrontBtn")?.addEventListener("click", bringToFront);
    document.getElementById("sendBackBtn")?.addEventListener("click", sendToBack);
    document.getElementById("alignLeftBtn")?.addEventListener("click", alignLeft);
    document.getElementById("alignCenterBtn")?.addEventListener("click", alignCenter);
    document.getElementById("alignRightBtn")?.addEventListener("click", alignRight);
    
    // Formatting
    document.getElementById("boldBtn")?.addEventListener("click", applyBold);
    document.getElementById("italicBtn")?.addEventListener("click", applyItalic);
    document.getElementById("underlineBtn")?.addEventListener("click", applyUnderline);
    
    const fontSelect = document.getElementById("fontSelect");
    const fontSizeSelect = document.getElementById("fontSizeSelect");
    const textColor = document.getElementById("textColor");
    
    fontSelect?.addEventListener("change", () => {
        selectedElements.forEach(el => {
            const text = el.querySelector(".element-text");
            if (text) text.style.fontFamily = fontSelect.value;
        });
    });
    fontSizeSelect?.addEventListener("change", () => {
        selectedElements.forEach(el => {
            const text = el.querySelector(".element-text");
            if (text) text.style.fontSize = `${fontSizeSelect.value}px`;
        });
    });
    textColor?.addEventListener("input", () => {
        selectedElements.forEach(el => {
            const text = el.querySelector(".element-text");
            if (text) text.style.color = textColor.value;
        });
    });
    
    // Zoom
    document.getElementById("zoomInBtn")?.addEventListener("click", () => {
        if (currentZoom < 1.5) { currentZoom += 0.1; updateZoom(); }
    });
    document.getElementById("zoomOutBtn")?.addEventListener("click", () => {
        if (currentZoom > 0.5) { currentZoom -= 0.1; updateZoom(); }
    });
    document.getElementById("zoomResetBtn")?.addEventListener("click", () => { currentZoom = 1; updateZoom(); });
    
    // Export
    document.getElementById("pdfBtn")?.addEventListener("click", downloadPDF);
    document.getElementById("wordBtn")?.addEventListener("click", downloadWord);
    document.getElementById("pngBtn")?.addEventListener("click", downloadPNG);
    document.getElementById("svgBtn")?.addEventListener("click", downloadSVG);
}

// ========== INITIALIZATION ==========
function init() {
    initPages();
    saveToHistory();
    updateZoom();
    loadStatsFromLocal();
    setupReactions();
    setupSocialShares();
    setupPageShare();
    setupScrollButtons();
    setupEventListeners();
    showToast("✨ Welcome to ECCE Worksheet Maker! ✨", "success");
    
    // Track initial page view
    trackUsage();
}

// Start the app
init();
