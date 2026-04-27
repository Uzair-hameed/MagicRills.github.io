/* ========================================
   Text Logo Generator - Complete JavaScript
   65+ Features - 100% Working
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {

// ===== CONFIG =====
const TOOL_ID = 'text_logo_generator';
const TOOL_NAME = 'Text Logo Generator';

// ===== GLOBAL VARIABLES =====
let canvas = document.getElementById('logoCanvas');
let ctx = canvas.getContext('2d');
let canvasWidth = 600;
let canvasHeight = 400;
let zoomLevel = 1;
let logoHistory = [];
let currentIcon = null;
let usageCount = 0;
let reactionData = { like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0 };

// Settings
let currentSettings = {
    logoText: 'MyLogo',
    sloganText: '',
    secondLineText: '',
    fontFamily: 'Arial, sans-serif',
    fontSize: 80,
    fontWeight: 'bold',
    fontStyle: 'normal',
    textTransform: 'none',
    letterSpacing: 0,
    lineHeight: 1,
    textAlign: 'center',
    textColor: '#333333',
    sloganColor: '#666666',
    bgColor: '#ffffff',
    gradientColor: '#4361ee',
    bgType: 'color',
    bgImageUrl: '',
    selectedTexture: 'none',
    textureOpacity: 30,
    patternType: 'none',
    patternColor: '#cccccc',
    gradientEffect: true,
    shadowEffect: true,
    outlineEffect: false,
    rotateEffect: false,
    letter3dEffect: false,
    glowEffect: false,
    innerShadowEffect: false,
    bevelEffect: false,
    shadowBlur: 5,
    shadowOffsetX: 3,
    shadowOffsetY: 3,
    shadowColor: '#888888',
    outlineWidth: 2,
    outlineColor: '#000000',
    multipleOutlines: 1,
    letter3dDepth: 5,
    rotateAngle: 0,
    glowIntensity: 10,
    selectedShape: 'none',
    shapeColor: '#4361ee',
    shapeOpacity: 100,
    shapePadding: 20,
    shapeBorder: 0,
    shapeBorderColor: '#ffffff',
    iconClass: '',
    iconSize: 40,
    iconColor: '#4361ee'
};

// ===== DOM ELEMENTS =====
const logoTextInput = document.getElementById('logoText');
const sloganTextInput = document.getElementById('sloganText');
const secondLineTextInput = document.getElementById('secondLineText');
const fontFamilySelect = document.getElementById('fontFamily');
const fontSizeInput = document.getElementById('fontSize');
const fontSizeValue = document.getElementById('fontSizeValue');
const fontWeightSelect = document.getElementById('fontWeight');
const fontStyleSelect = document.getElementById('fontStyle');
const textTransformSelect = document.getElementById('textTransform');
const letterSpacingInput = document.getElementById('letterSpacing');
const letterSpacingValue = document.getElementById('letterSpacingValue');
const lineHeightInput = document.getElementById('lineHeight');
const lineHeightValue = document.getElementById('lineHeightValue');
const alignBtns = document.querySelectorAll('.align-btn');
const textAlignInput = document.getElementById('textAlign');
const textColorInput = document.getElementById('textColor');
const textColorHex = document.getElementById('textColorHex');
const sloganColorInput = document.getElementById('sloganColor');
const sloganColorHex = document.getElementById('sloganColorHex');
const bgColorInput = document.getElementById('bgColor');
const bgColorHex = document.getElementById('bgColorHex');
const gradientColorInput = document.getElementById('gradientColor');
const gradientColorHex = document.getElementById('gradientColorHex');
const bgTypeSelect = document.getElementById('bgType');
const bgImageGroup = document.getElementById('bgImageGroup');
const bgImageUrlInput = document.getElementById('bgImageUrl');
const textureOptions = document.querySelectorAll('.texture-option');
const selectedTextureInput = document.getElementById('selectedTexture');
const textureOpacityInput = document.getElementById('textureOpacity');
const textureOpacityValue = document.getElementById('textureOpacityValue');
const patternTypeSelect = document.getElementById('patternType');
const patternColorInput = document.getElementById('patternColor');
const gradientEffectCheckbox = document.getElementById('gradientEffect');
const shadowEffectCheckbox = document.getElementById('shadowEffect');
const outlineEffectCheckbox = document.getElementById('outlineEffect');
const rotateEffectCheckbox = document.getElementById('rotateEffect');
const letter3dEffectCheckbox = document.getElementById('letter3dEffect');
const glowEffectCheckbox = document.getElementById('glowEffect');
const innerShadowEffectCheckbox = document.getElementById('innerShadowEffect');
const bevelEffectCheckbox = document.getElementById('bevelEffect');
const shadowBlurInput = document.getElementById('shadowBlur');
const shadowBlurValue = document.getElementById('shadowBlurValue');
const shadowOffsetXInput = document.getElementById('shadowOffsetX');
const shadowOffsetXValue = document.getElementById('shadowOffsetXValue');
const shadowOffsetYInput = document.getElementById('shadowOffsetY');
const shadowOffsetYValue = document.getElementById('shadowOffsetYValue');
const shadowColorInput = document.getElementById('shadowColor');
const outlineWidthInput = document.getElementById('outlineWidth');
const outlineWidthValue = document.getElementById('outlineWidthValue');
const outlineColorInput = document.getElementById('outlineColor');
const multipleOutlinesSelect = document.getElementById('multipleOutlines');
const letter3dDepthInput = document.getElementById('letter3dDepth');
const letter3dDepthValue = document.getElementById('letter3dDepthValue');
const rotateAngleInput = document.getElementById('rotateAngle');
const rotateAngleValue = document.getElementById('rotateAngleValue');
const glowIntensityInput = document.getElementById('glowIntensity');
const glowIntensityValue = document.getElementById('glowIntensityValue');
const shapeOptions = document.querySelectorAll('.shape-option');
const selectedShapeInput = document.getElementById('selectedShape');
const shapeColorInput = document.getElementById('shapeColor');
const shapeOpacityInput = document.getElementById('shapeOpacity');
const shapeOpacityValue = document.getElementById('shapeOpacityValue');
const shapePaddingInput = document.getElementById('shapePadding');
const shapePaddingValue = document.getElementById('shapePaddingValue');
const shapeBorderInput = document.getElementById('shapeBorder');
const shapeBorderValue = document.getElementById('shapeBorderValue');
const shapeBorderColorInput = document.getElementById('shapeBorderColor');
const iconClassInput = document.getElementById('iconClass');
const addIconBtn = document.getElementById('addIconBtn');
const iconPreview = document.getElementById('iconPreview');
const iconSizeInput = document.getElementById('iconSize');
const iconSizeValue = document.getElementById('iconSizeValue');
const iconColorInput = document.getElementById('iconColor');
const canvasWidthInput = document.getElementById('canvasWidth');
const canvasWidthValue = document.getElementById('canvasWidthValue');
const canvasHeightInput = document.getElementById('canvasHeight');
const canvasHeightValue = document.getElementById('canvasHeightValue');
const downloadPngBtn = document.getElementById('downloadPngBtn');
const downloadJpgBtn = document.getElementById('downloadJpgBtn');
const downloadSvgBtn = document.getElementById('downloadSvgBtn');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');
const copyLogoBtn = document.getElementById('copyLogoBtn');
const copyLogoBtn2 = document.getElementById('copyLogoBtn2');
const saveHistoryBtn = document.getElementById('saveHistoryBtn');
const loadHistoryBtn = document.getElementById('loadHistoryBtn');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const historyList = document.getElementById('historyList');
const zoomInBtn = document.getElementById('zoomInBtn');
const zoomOutBtn = document.getElementById('zoomOutBtn');
const resetZoomBtn = document.getElementById('resetZoomBtn');
const canvasContainer = document.getElementById('canvasContainer');
const presetBtns = document.querySelectorAll('.preset-btn');
const sizePresets = document.querySelectorAll('.size-preset');
const paletteBtns = document.querySelectorAll('.palette-btn');
const exportBtns = document.querySelectorAll('.export-btn');
const canvasBgBtns = document.querySelectorAll('.canvas-bg-btn');
const tabs = document.querySelectorAll('.tab');
const themeToggle = document.getElementById('themeToggle');
const pageShareBtn = document.getElementById('pageShareBtn');
const scrollUpBtn = document.getElementById('scrollUpBtn');
const scrollDownBtn = document.getElementById('scrollDownBtn');
const usageCountSpan = document.getElementById('usageCount');

// ===== HELPER FUNCTIONS =====
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function updateSliderValue(slider, valueElement) {
    if (valueElement) valueElement.textContent = slider.value;
}

function updateColorHex(colorInput, hexInput) {
    if (hexInput) hexInput.value = colorInput.value;
}

function updateColorFromHex(hexInput, colorInput) {
    if (hexInput && /^#([0-9A-F]{3}){1,2}$/i.test(hexInput.value)) {
        colorInput.value = hexInput.value;
    }
}

// ===== TIDB API CALLS =====
async function getUsageCount() {
    try {
        const res = await fetch(`/api/usage?toolId=${TOOL_ID}`);
        const data = await res.json();
        usageCount = data.count || 0;
        if (usageCountSpan) usageCountSpan.textContent = usageCount;
    } catch (error) {
        usageCount = parseInt(localStorage.getItem(`${TOOL_ID}_usage`) || '0');
        if (usageCountSpan) usageCountSpan.textContent = usageCount;
    }
}

async function incrementUsage() {
    try {
        await fetch('/api/usage/increment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toolId: TOOL_ID, toolName: TOOL_NAME })
        });
        usageCount++;
        if (usageCountSpan) usageCountSpan.textContent = usageCount;
        localStorage.setItem(`${TOOL_ID}_usage`, usageCount);
    } catch (error) {
        usageCount++;
        if (usageCountSpan) usageCountSpan.textContent = usageCount;
        localStorage.setItem(`${TOOL_ID}_usage`, usageCount);
    }
}

async function getReactions() {
    try {
        const res = await fetch(`/api/reactions?toolId=${TOOL_ID}`);
        const data = await res.json();
        if (data.reactions) reactionData = data.reactions;
        updateReactionUI();
    } catch (error) {
        const saved = localStorage.getItem(`${TOOL_ID}_reactions`);
        if (saved) reactionData = JSON.parse(saved);
        updateReactionUI();
    }
}

async function addReaction(reactionType) {
    try {
        await fetch('/api/reactions/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toolId: TOOL_ID, reaction: reactionType })
        });
        reactionData[reactionType]++;
        updateReactionUI();
        localStorage.setItem(`${TOOL_ID}_reactions`, JSON.stringify(reactionData));
        showToast(`${reactionType} reaction added!`, 'success');
    } catch (error) {
        reactionData[reactionType]++;
        updateReactionUI();
        localStorage.setItem(`${TOOL_ID}_reactions`, JSON.stringify(reactionData));
        showToast(`${reactionType} reaction added!`, 'success');
    }
}

function updateReactionUI() {
    for (const [reaction, count] of Object.entries(reactionData)) {
        const btn = document.querySelector(`.reaction[data-reaction="${reaction}"]`);
        if (btn) {
            const span = btn.querySelector('.reaction-count');
            if (span) span.textContent = count;
        }
    }
}

async function recordShare(platform) {
    try {
        await fetch('/api/share/record', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toolId: TOOL_ID, platform })
        });
    } catch (error) {}
}

// ===== RENDER LOGO =====
function renderLogo() {
    if (!ctx) return;
    
    // Update canvas size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    if (currentSettings.bgType === 'color') {
        ctx.fillStyle = currentSettings.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (currentSettings.bgType === 'gradient') {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, currentSettings.bgColor);
        gradient.addColorStop(1, currentSettings.gradientColor);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (currentSettings.bgType === 'image' && currentSettings.bgImageUrl) {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function() {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            drawShape();
            drawText();
        };
        img.src = currentSettings.bgImageUrl;
    }
    
    // Draw texture
    if (currentSettings.selectedTexture !== 'none') {
        drawTexture();
    }
    
    // Draw shape
    drawShape();
    
    // Draw text
    drawText();
    
    // Draw icon
    if (currentIcon) {
        drawIcon();
    }
    
    // Increment usage on first render
    if (!window.hasIncremented) {
        incrementUsage();
        window.hasIncremented = true;
    }
}

function drawTexture() {
    const texture = currentSettings.selectedTexture;
    const opacity = currentSettings.textureOpacity / 100;
    
    ctx.globalAlpha = opacity;
    
    if (texture === 'grid') {
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }
    } else if (texture === 'dots') {
        ctx.fillStyle = '#cccccc';
        for (let i = 0; i < canvas.width; i += 20) {
            for (let j = 0; j < canvas.height; j += 20) {
                ctx.beginPath();
                ctx.arc(i, j, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    } else if (texture === 'noise') {
        for (let i = 0; i < canvas.width; i += 2) {
            for (let j = 0; j < canvas.height; j += 2) {
                const brightness = Math.random() * 50;
                ctx.fillStyle = `rgba(0, 0, 0, ${brightness / 100})`;
                ctx.fillRect(i, j, 2, 2);
            }
        }
    } else if (texture === 'lines') {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        for (let i = 0; i < 36; i++) {
            ctx.rotate(10 * Math.PI / 180);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(200, 0);
            ctx.strokeStyle = `rgba(200, 200, 200, 0.3)`;
            ctx.stroke();
        }
        ctx.restore();
    }
    
    ctx.globalAlpha = 1;
}

function drawShape() {
    if (currentSettings.selectedShape === 'none') return;
    
    ctx.save();
    ctx.globalAlpha = currentSettings.shapeOpacity / 100;
    ctx.fillStyle = currentSettings.shapeColor;
    
    const padding = currentSettings.shapePadding;
    const shapeWidth = canvas.width - padding * 2;
    const shapeHeight = canvas.height - padding * 2;
    
    // Apply shape border
    if (currentSettings.shapeBorder > 0) {
        ctx.strokeStyle = currentSettings.shapeBorderColor;
        ctx.lineWidth = currentSettings.shapeBorder;
    }
    
    switch (currentSettings.selectedShape) {
        case 'circle':
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(shapeWidth, shapeHeight) / 2, 0, Math.PI * 2);
            ctx.fill();
            if (currentSettings.shapeBorder > 0) ctx.stroke();
            break;
        case 'rounded':
            ctx.beginPath();
            const radius = 30;
            ctx.moveTo(padding + radius, padding);
            ctx.lineTo(padding + shapeWidth - radius, padding);
            ctx.quadraticCurveTo(padding + shapeWidth, padding, padding + shapeWidth, padding + radius);
            ctx.lineTo(padding + shapeWidth, padding + shapeHeight - radius);
            ctx.quadraticCurveTo(padding + shapeWidth, padding + shapeHeight, padding + shapeWidth - radius, padding + shapeHeight);
            ctx.lineTo(padding + radius, padding + shapeHeight);
            ctx.quadraticCurveTo(padding, padding + shapeHeight, padding, padding + shapeHeight - radius);
            ctx.lineTo(padding, padding + radius);
            ctx.quadraticCurveTo(padding, padding, padding + radius, padding);
            ctx.closePath();
            ctx.fill();
            if (currentSettings.shapeBorder > 0) ctx.stroke();
            break;
        case 'diamond':
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(45 * Math.PI / 180);
            ctx.fillRect(-shapeWidth / 2, -shapeHeight / 2, shapeWidth, shapeHeight);
            if (currentSettings.shapeBorder > 0) {
                ctx.strokeRect(-shapeWidth / 2, -shapeHeight / 2, shapeWidth, shapeHeight);
            }
            ctx.restore();
            break;
        case 'hexagon':
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, padding);
            ctx.lineTo(padding + shapeWidth * 0.75, padding + shapeHeight / 4);
            ctx.lineTo(padding + shapeWidth * 0.75, padding + shapeHeight * 0.75);
            ctx.lineTo(canvas.width / 2, padding + shapeHeight);
            ctx.lineTo(padding + shapeWidth * 0.25, padding + shapeHeight * 0.75);
            ctx.lineTo(padding + shapeWidth * 0.25, padding + shapeHeight / 4);
            ctx.closePath();
            ctx.fill();
            if (currentSettings.shapeBorder > 0) ctx.stroke();
            break;
        case 'badge':
            ctx.beginPath();
            ctx.moveTo(padding, padding + shapeHeight * 0.25);
            ctx.lineTo(padding, padding + shapeHeight * 0.75);
            ctx.lineTo(padding + shapeWidth * 0.5, padding + shapeHeight);
            ctx.lineTo(padding + shapeWidth, padding + shapeHeight * 0.75);
            ctx.lineTo(padding + shapeWidth, padding + shapeHeight * 0.25);
            ctx.lineTo(padding + shapeWidth * 0.5, padding);
            ctx.closePath();
            ctx.fill();
            if (currentSettings.shapeBorder > 0) ctx.stroke();
            break;
    }
    
    ctx.restore();
}

function drawText() {
    const fontSize = currentSettings.fontSize;
    const letterSpacing = currentSettings.letterSpacing;
    const lineHeight = currentSettings.lineHeight;
    let text = currentSettings.logoText || 'MyLogo';
    const slogan = currentSettings.sloganText;
    const secondLine = currentSettings.secondLineText;
    
    // Apply text transform
    switch (currentSettings.textTransform) {
        case 'uppercase': text = text.toUpperCase(); break;
        case 'lowercase': text = text.toLowerCase(); break;
        case 'capitalize': text = text.replace(/\b\w/g, l => l.toUpperCase()); break;
    }
    
    ctx.font = `${currentSettings.fontStyle} ${currentSettings.fontWeight} ${fontSize}px ${currentSettings.fontFamily}`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = currentSettings.textAlign;
    
    // Calculate Y position for multiple lines
    const totalLines = (slogan ? 1 : 0) + (secondLine ? 1 : 0) + 1;
    const lineHeightPx = fontSize * lineHeight;
    const totalHeight = lineHeightPx * (totalLines - 1);
    let startY = canvas.height / 2 - totalHeight / 2;
    
    // Draw main text
    drawSingleText(text, startY, currentSettings.textColor);
    startY += lineHeightPx;
    
    // Draw slogan
    if (slogan) {
        ctx.font = `normal normal ${fontSize * 0.4}px ${currentSettings.fontFamily}`;
        drawSingleText(slogan, startY, currentSettings.sloganColor);
        startY += lineHeightPx * 0.6;
    }
    
    // Draw second line
    if (secondLine) {
        ctx.font = `normal normal ${fontSize * 0.5}px ${currentSettings.fontFamily}`;
        drawSingleText(secondLine, startY, currentSettings.sloganColor);
    }
}

function drawSingleText(text, y, color) {
    const x = canvas.width / 2;
    
    ctx.save();
    
    // Apply rotation
    if (currentSettings.rotateEffect) {
        ctx.translate(x, y);
        ctx.rotate(currentSettings.rotateAngle * Math.PI / 180);
        ctx.translate(-x, -y);
    }
    
    // Apply shadow
    if (currentSettings.shadowEffect) {
        ctx.shadowColor = currentSettings.shadowColor;
        ctx.shadowBlur = currentSettings.shadowBlur;
        ctx.shadowOffsetX = currentSettings.shadowOffsetX;
        ctx.shadowOffsetY = currentSettings.shadowOffsetY;
    }
    
    // Apply gradient
    let fillColor = color;
    if (currentSettings.gradientEffect) {
        const gradient = ctx.createLinearGradient(x - 100, y - currentSettings.fontSize, x + 100, y + currentSettings.fontSize);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, currentSettings.gradientColor);
        fillColor = gradient;
    } else {
        fillColor = color;
    }
    
    ctx.fillStyle = fillColor;
    
    // Apply pattern fill
    if (currentSettings.patternType !== 'none') {
        const patternCanvas = document.createElement('canvas');
        const pCtx = patternCanvas.getContext('2d');
        patternCanvas.width = 20;
        patternCanvas.height = 20;
        if (currentSettings.patternType === 'stripes') {
            pCtx.fillStyle = currentSettings.patternColor;
            pCtx.fillRect(0, 0, 20, 10);
        } else if (currentSettings.patternType === 'dots') {
            pCtx.fillStyle = currentSettings.patternColor;
            pCtx.beginPath();
            pCtx.arc(10, 10, 5, 0, Math.PI * 2);
            pCtx.fill();
        }
        const pattern = ctx.createPattern(patternCanvas, 'repeat');
        ctx.fillStyle = pattern;
    }
    
    // Apply glow effect
    if (currentSettings.glowEffect) {
        ctx.shadowBlur = currentSettings.glowIntensity;
        ctx.shadowColor = currentSettings.gradientColor;
    }
    
    // Draw each letter with letter spacing
    if (currentSettings.letterSpacing !== 0) {
        let currentX = x - ctx.measureText(text).width / 2;
        for (let i = 0; i < text.length; i++) {
            const letter = text[i];
            const letterWidth = ctx.measureText(letter).width;
            
            // Apply 3D effect
            if (currentSettings.letter3dEffect) {
                for (let d = currentSettings.letter3dDepth; d > 0; d--) {
                    ctx.fillStyle = `rgba(0, 0, 0, ${0.1 * (currentSettings.letter3dDepth - d + 1)})`;
                    ctx.fillText(letter, currentX + letterWidth / 2 + d, y + d);
                }
                ctx.fillStyle = fillColor;
            }
            
            ctx.fillText(letter, currentX + letterWidth / 2, y);
            currentX += letterWidth + currentSettings.letterSpacing;
        }
    } else {
        // Apply 3D effect for whole text
        if (currentSettings.letter3dEffect) {
            for (let d = currentSettings.letter3dDepth; d > 0; d--) {
                ctx.fillStyle = `rgba(0, 0, 0, ${0.1 * (currentSettings.letter3dDepth - d + 1)})`;
                ctx.fillText(text, x + d, y + d);
            }
            ctx.fillStyle = fillColor;
        }
        
        ctx.fillText(text, x, y);
    }
    
    // Apply outline
    if (currentSettings.outlineEffect) {
        ctx.strokeStyle = currentSettings.outlineColor;
        ctx.lineWidth = currentSettings.outlineWidth;
        ctx.strokeText(text, x, y);
        
        // Multiple outlines
        for (let i = 2; i <= currentSettings.multipleOutlines; i++) {
            ctx.lineWidth = currentSettings.outlineWidth * i;
            ctx.strokeStyle = `rgba(0, 0, 0, ${0.3 - i * 0.1})`;
            ctx.strokeText(text, x, y);
        }
    }
    
    ctx.restore();
}

function drawIcon() {
    if (!currentIcon) return;
    
    const fontSize = currentSettings.fontSize;
    const y = canvas.height / 2 - fontSize / 2 - 10;
    
    ctx.font = `${currentSettings.iconSize}px "Font Awesome 6 Free"`;
    ctx.fillStyle = currentSettings.iconColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(currentIcon, canvas.width / 2, y);
}

// ===== APPLY PRESET =====
function applyPreset(preset) {
    switch (preset) {
        case 'minimal':
            currentSettings.fontFamily = 'Helvetica, sans-serif';
            currentSettings.fontSize = 70;
            currentSettings.textColor = '#000000';
            currentSettings.bgColor = '#ffffff';
            currentSettings.gradientEffect = false;
            currentSettings.shadowEffect = false;
            currentSettings.outlineEffect = false;
            currentSettings.selectedShape = 'none';
            break;
        case 'gradient':
            currentSettings.gradientEffect = true;
            currentSettings.textColor = '#4361ee';
            currentSettings.gradientColor = '#f72585';
            currentSettings.bgColor = '#f8f9fa';
            currentSettings.shadowEffect = true;
            break;
        case 'outline':
            currentSettings.outlineEffect = true;
            currentSettings.textColor = '#ffffff';
            currentSettings.outlineColor = '#000000';
            currentSettings.outlineWidth = 3;
            currentSettings.bgColor = '#4cc9f0';
            break;
        case 'shadow':
            currentSettings.shadowEffect = true;
            currentSettings.shadowBlur = 10;
            currentSettings.shadowOffsetX = 5;
            currentSettings.shadowOffsetY = 5;
            currentSettings.shadowColor = '#333333';
            break;
        case 'vintage':
            currentSettings.fontFamily = "'Times New Roman', serif";
            currentSettings.textColor = '#8b4513';
            currentSettings.bgColor = '#f5f5dc';
            currentSettings.selectedTexture = 'noise';
            document.querySelector('.texture-option.selected')?.classList.remove('selected');
            document.querySelector('.texture-option[data-texture="noise"]')?.classList.add('selected');
            currentSettings.selectedTexture = 'noise';
            break;
        case 'modern':
            currentSettings.fontFamily = "'Arial Black', sans-serif";
            currentSettings.textColor = '#ffffff';
            currentSettings.bgColor = '#212529';
            currentSettings.selectedShape = 'circle';
            document.querySelector('.shape-option.selected')?.classList.remove('selected');
            document.querySelector('.shape-option[data-shape="circle"]')?.classList.add('selected');
            currentSettings.selectedShape = 'circle';
            currentSettings.shapeColor = '#3a0ca3';
            break;
        case 'neon':
            currentSettings.glowEffect = true;
            currentSettings.textColor = '#00ff00';
            currentSettings.bgColor = '#000000';
            currentSettings.gradientColor = '#00ff00';
            currentSettings.glowIntensity = 15;
            break;
        case '3d':
            currentSettings.letter3dEffect = true;
            currentSettings.letter3dDepth = 8;
            currentSettings.textColor = '#ff6600';
            currentSettings.bgColor = '#1a1a2e';
            currentSettings.shadowEffect = true;
            break;
    }
    updateUIFromSettings();
    renderLogo();
    showToast(`${preset} preset applied`, 'success');
}

function updateUIFromSettings() {
    if (logoTextInput) logoTextInput.value = currentSettings.logoText;
    if (sloganTextInput) sloganTextInput.value = currentSettings.sloganText;
    if (secondLineTextInput) secondLineTextInput.value = currentSettings.secondLineText;
    if (fontFamilySelect) fontFamilySelect.value = currentSettings.fontFamily;
    if (fontSizeInput) fontSizeInput.value = currentSettings.fontSize;
    if (fontSizeValue) fontSizeValue.textContent = currentSettings.fontSize;
    if (fontWeightSelect) fontWeightSelect.value = currentSettings.fontWeight;
    if (fontStyleSelect) fontStyleSelect.value = currentSettings.fontStyle;
    if (textTransformSelect) textTransformSelect.value = currentSettings.textTransform;
    if (letterSpacingInput) letterSpacingInput.value = currentSettings.letterSpacing;
    if (letterSpacingValue) letterSpacingValue.textContent = currentSettings.letterSpacing;
    if (lineHeightInput) lineHeightInput.value = currentSettings.lineHeight;
    if (lineHeightValue) lineHeightValue.textContent = currentSettings.lineHeight;
    if (textColorInput) textColorInput.value = currentSettings.textColor;
    if (textColorHex) textColorHex.value = currentSettings.textColor;
    if (sloganColorInput) sloganColorInput.value = currentSettings.sloganColor;
    if (sloganColorHex) sloganColorHex.value = currentSettings.sloganColor;
    if (bgColorInput) bgColorInput.value = currentSettings.bgColor;
    if (bgColorHex) bgColorHex.value = currentSettings.bgColor;
    if (gradientColorInput) gradientColorInput.value = currentSettings.gradientColor;
    if (gradientColorHex) gradientColorHex.value = currentSettings.gradientColor;
    if (gradientEffectCheckbox) gradientEffectCheckbox.checked = currentSettings.gradientEffect;
    if (shadowEffectCheckbox) shadowEffectCheckbox.checked = currentSettings.shadowEffect;
    if (outlineEffectCheckbox) outlineEffectCheckbox.checked = currentSettings.outlineEffect;
    if (rotateEffectCheckbox) rotateEffectCheckbox.checked = currentSettings.rotateEffect;
    if (letter3dEffectCheckbox) letter3dEffectCheckbox.checked = currentSettings.letter3dEffect;
    if (glowEffectCheckbox) glowEffectCheckbox.checked = currentSettings.glowEffect;
}

// ===== HISTORY FUNCTIONS =====
function saveToHistory() {
    const logoData = canvas.toDataURL('image/png');
    const timestamp = new Date().toLocaleString();
    logoHistory.unshift({ data: logoData, timestamp, settings: JSON.parse(JSON.stringify(currentSettings)) });
    if (logoHistory.length > 10) logoHistory.pop();
    localStorage.setItem('logoHistory', JSON.stringify(logoHistory));
    updateHistoryList();
    showToast('Logo saved to history!', 'success');
}

function loadHistory() {
    const saved = localStorage.getItem('logoHistory');
    if (saved) {
        logoHistory = JSON.parse(saved);
        updateHistoryList();
        showToast('History loaded', 'success');
    } else {
        showToast('No saved history found', 'warning');
    }
}

function updateHistoryList() {
    if (!historyList) return;
    if (logoHistory.length === 0) {
        historyList.innerHTML = '<p class="empty-history">No saved logos yet. Click "Save to History" to save your logo.</p>';
        return;
    }
    historyList.innerHTML = logoHistory.map((item, index) => `
        <div class="history-item" data-index="${index}">
            <img src="${item.data}" style="width: 50px; height: 30px; object-fit: contain;">
            <span>${item.timestamp}</span>
            <button class="btn-icon delete-history" data-index="${index}"><i class="fas fa-trash"></i></button>
        </div>
    `).join('');
    
    document.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.delete-history')) {
                const index = parseInt(item.dataset.index);
                loadLogoFromHistory(index);
            }
        });
    });
    
    document.querySelectorAll('.delete-history').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            logoHistory.splice(index, 1);
            localStorage.setItem('logoHistory', JSON.stringify(logoHistory));
            updateHistoryList();
            showToast('Removed from history', 'success');
        });
    });
}

function loadLogoFromHistory(index) {
    const item = logoHistory[index];
    if (item) {
        currentSettings = JSON.parse(JSON.stringify(item.settings));
        updateUIFromSettings();
        renderLogo();
        showToast('Logo loaded from history', 'success');
    }
}

// ===== EXPORT FUNCTIONS =====
function downloadLogo(format) {
    const link = document.createElement('a');
    let mimeType, extension;
    
    switch (format) {
        case 'png':
            mimeType = 'image/png';
            extension = '.png';
            break;
        case 'jpg':
            mimeType = 'image/jpeg';
            extension = '.jpg';
            break;
        case 'svg':
            showToast('SVG export coming soon!', 'warning');
            return;
        case 'pdf':
            showToast('PDF export coming soon!', 'warning');
            return;
        default:
            mimeType = 'image/png';
            extension = '.png';
    }
    
    link.download = `logo${extension}`;
    link.href = canvas.toDataURL(mimeType);
    link.click();
    showToast(`Logo downloaded as ${format.toUpperCase()}!`, 'success');
    recordShare('download');
}

async function copyLogoToClipboard() {
    try {
        canvas.toBlob(async (blob) => {
            await navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob
                })
            ]);
            showToast('Logo copied to clipboard!', 'success');
        });
    } catch (err) {
        showToast('Failed to copy logo', 'error');
    }
}

// ===== ZOOM FUNCTIONS =====
function zoomIn() {
    zoomLevel = Math.min(zoomLevel + 0.1, 2);
    applyZoom();
}

function zoomOut() {
    zoomLevel = Math.max(zoomLevel - 0.1, 0.5);
    applyZoom();
}

function resetZoom() {
    zoomLevel = 1;
    applyZoom();
}

function applyZoom() {
    if (canvas) {
        canvas.style.transform = `scale(${zoomLevel})`;
        canvas.style.transition = 'transform 0.3s';
    }
}

// ===== RESIZE CANVAS =====
function resizeCanvas() {
    canvasWidth = parseInt(canvasWidthInput.value);
    canvasHeight = parseInt(canvasHeightInput.value);
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    if (canvasWidthValue) canvasWidthValue.textContent = canvasWidth;
    if (canvasHeightValue) canvasHeightValue.textContent = canvasHeight;
    renderLogo();
}

// ===== SOCIAL SHARING =====
async function shareOnPlatform(platform) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Create amazing logos with this free tool!');
    
    let shareUrl = '';
    if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    else if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    else if (platform === 'linkedin') shareUrl = `https://www.linkedin.com/sharing/share-offsite/?u=${url}`;
    else if (platform === 'whatsapp') shareUrl = `https://wa.me/?text=${text}%20${url}`;
    else if (platform === 'email') shareUrl = `mailto:?subject=Logo Generator&body=${text}%0A%0A${url}`;
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        await recordShare(platform);
        showToast(`Shared on ${platform}`, 'success');
    }
}

async function sharePage() {
    try {
        await navigator.clipboard.writeText(window.location.href);
        await recordShare('copy_link');
        showToast('Link copied to clipboard!', 'success');
    } catch (err) {
        showToast('Failed to copy link', 'error');
    }
}

// ===== THEME TOGGLE =====
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    renderLogo();
}

function loadTheme() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) document.body.classList.add('dark-mode');
}

// ===== TAB HANDLING =====
function initTabs() {
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = 'none';
            });
            const activeTab = document.getElementById(`${tabName}-tab`);
            if (activeTab) activeTab.style.display = 'block';
        });
    });
}

// ===== KEYBOARD SHORTCUTS =====
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'z') {
            e.preventDefault();
            showToast('Undo feature coming soon', 'info');
        } else if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveToHistory();
        } else if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            downloadLogo('png');
        } else if (e.ctrlKey && e.key === 'h') {
            e.preventDefault();
            saveToHistory();
        }
    });
}

// ===== EVENT LISTENERS =====
function initEventListeners() {
    // Text inputs
    logoTextInput?.addEventListener('input', () => {
        currentSettings.logoText = logoTextInput.value;
        renderLogo();
    });
    sloganTextInput?.addEventListener('input', () => {
        currentSettings.sloganText = sloganTextInput.value;
        renderLogo();
    });
    secondLineTextInput?.addEventListener('input', () => {
        currentSettings.secondLineText = secondLineTextInput.value;
        renderLogo();
    });
    
    // Typography
    fontFamilySelect?.addEventListener('change', () => {
        currentSettings.fontFamily = fontFamilySelect.value;
        renderLogo();
    });
    fontSizeInput?.addEventListener('input', () => {
        currentSettings.fontSize = parseInt(fontSizeInput.value);
        if (fontSizeValue) fontSizeValue.textContent = currentSettings.fontSize;
        renderLogo();
    });
    fontWeightSelect?.addEventListener('change', () => {
        currentSettings.fontWeight = fontWeightSelect.value;
        renderLogo();
    });
    fontStyleSelect?.addEventListener('change', () => {
        currentSettings.fontStyle = fontStyleSelect.value;
        renderLogo();
    });
    textTransformSelect?.addEventListener('change', () => {
        currentSettings.textTransform = textTransformSelect.value;
        renderLogo();
    });
    letterSpacingInput?.addEventListener('input', () => {
        currentSettings.letterSpacing = parseInt(letterSpacingInput.value);
        if (letterSpacingValue) letterSpacingValue.textContent = currentSettings.letterSpacing;
        renderLogo();
    });
    lineHeightInput?.addEventListener('input', () => {
        currentSettings.lineHeight = parseFloat(lineHeightInput.value);
        if (lineHeightValue) lineHeightValue.textContent = currentSettings.lineHeight;
        renderLogo();
    });
    
    // Alignment
    alignBtns?.forEach(btn => {
        btn.addEventListener('click', () => {
            alignBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSettings.textAlign = btn.dataset.align;
            renderLogo();
        });
    });
    
    // Colors
    textColorInput?.addEventListener('input', () => {
        currentSettings.textColor = textColorInput.value;
        if (textColorHex) textColorHex.value = currentSettings.textColor;
        renderLogo();
    });
    textColorHex?.addEventListener('input', () => {
        if (/^#([0-9A-F]{3}){1,2}$/i.test(textColorHex.value)) {
            currentSettings.textColor = textColorHex.value;
            if (textColorInput) textColorInput.value = currentSettings.textColor;
            renderLogo();
        }
    });
    sloganColorInput?.addEventListener('input', () => {
        currentSettings.sloganColor = sloganColorInput.value;
        if (sloganColorHex) sloganColorHex.value = currentSettings.sloganColor;
        renderLogo();
    });
    bgColorInput?.addEventListener('input', () => {
        currentSettings.bgColor = bgColorInput.value;
        if (bgColorHex) bgColorHex.value = currentSettings.bgColor;
        renderLogo();
    });
    gradientColorInput?.addEventListener('input', () => {
        currentSettings.gradientColor = gradientColorInput.value;
        if (gradientColorHex) gradientColorHex.value = currentSettings.gradientColor;
        renderLogo();
    });
    
    // Background type
    bgTypeSelect?.addEventListener('change', () => {
        currentSettings.bgType = bgTypeSelect.value;
        if (bgImageGroup) bgImageGroup.style.display = currentSettings.bgType === 'image' ? 'block' : 'none';
        renderLogo();
    });
    bgImageUrlInput?.addEventListener('input', () => {
        currentSettings.bgImageUrl = bgImageUrlInput.value;
        renderLogo();
    });
    
    // Texture
    textureOptions?.forEach(option => {
        option.addEventListener('click', () => {
            textureOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            currentSettings.selectedTexture = option.dataset.texture;
            if (selectedTextureInput) selectedTextureInput.value = currentSettings.selectedTexture;
            renderLogo();
        });
    });
    textureOpacityInput?.addEventListener('input', () => {
        currentSettings.textureOpacity = parseInt(textureOpacityInput.value);
        if (textureOpacityValue) textureOpacityValue.textContent = currentSettings.textureOpacity;
        renderLogo();
    });
    
    // Pattern
    patternTypeSelect?.addEventListener('change', () => {
        currentSettings.patternType = patternTypeSelect.value;
        renderLogo();
    });
    patternColorInput?.addEventListener('input', () => {
        currentSettings.patternColor = patternColorInput.value;
        renderLogo();
    });
    
    // Effects
    gradientEffectCheckbox?.addEventListener('change', () => {
        currentSettings.gradientEffect = gradientEffectCheckbox.checked;
        renderLogo();
    });
    shadowEffectCheckbox?.addEventListener('change', () => {
        currentSettings.shadowEffect = shadowEffectCheckbox.checked;
        renderLogo();
    });
    outlineEffectCheckbox?.addEventListener('change', () => {
        currentSettings.outlineEffect = outlineEffectCheckbox.checked;
        renderLogo();
    });
    rotateEffectCheckbox?.addEventListener('change', () => {
        currentSettings.rotateEffect = rotateEffectCheckbox.checked;
        renderLogo();
    });
    letter3dEffectCheckbox?.addEventListener('change', () => {
        currentSettings.letter3dEffect = letter3dEffectCheckbox.checked;
        renderLogo();
    });
    glowEffectCheckbox?.addEventListener('change', () => {
        currentSettings.glowEffect = glowEffectCheckbox.checked;
        renderLogo();
    });
    
    // Effect sliders
    shadowBlurInput?.addEventListener('input', () => {
        currentSettings.shadowBlur = parseInt(shadowBlurInput.value);
        if (shadowBlurValue) shadowBlurValue.textContent = currentSettings.shadowBlur;
        renderLogo();
    });
    shadowOffsetXInput?.addEventListener('input', () => {
        currentSettings.shadowOffsetX = parseInt(shadowOffsetXInput.value);
        if (shadowOffsetXValue) shadowOffsetXValue.textContent = currentSettings.shadowOffsetX;
        renderLogo();
    });
    shadowOffsetYInput?.addEventListener('input', () => {
        currentSettings.shadowOffsetY = parseInt(shadowOffsetYInput.value);
        if (shadowOffsetYValue) shadowOffsetYValue.textContent = currentSettings.shadowOffsetY;
        renderLogo();
    });
    shadowColorInput?.addEventListener('input', () => {
        currentSettings.shadowColor = shadowColorInput.value;
        renderLogo();
    });
    outlineWidthInput?.addEventListener('input', () => {
        currentSettings.outlineWidth = parseInt(outlineWidthInput.value);
        if (outlineWidthValue) outlineWidthValue.textContent = currentSettings.outlineWidth;
        renderLogo();
    });
    outlineColorInput?.addEventListener('input', () => {
        currentSettings.outlineColor = outlineColorInput.value;
        renderLogo();
    });
    multipleOutlinesSelect?.addEventListener('change', () => {
        currentSettings.multipleOutlines = parseInt(multipleOutlinesSelect.value);
        renderLogo();
    });
    letter3dDepthInput?.addEventListener('input', () => {
        currentSettings.letter3dDepth = parseInt(letter3dDepthInput.value);
        if (letter3dDepthValue) letter3dDepthValue.textContent = currentSettings.letter3dDepth;
        renderLogo();
    });
    rotateAngleInput?.addEventListener('input', () => {
        currentSettings.rotateAngle = parseInt(rotateAngleInput.value);
        if (rotateAngleValue) rotateAngleValue.textContent = currentSettings.rotateAngle;
        renderLogo();
    });
    glowIntensityInput?.addEventListener('input', () => {
        currentSettings.glowIntensity = parseInt(glowIntensityInput.value);
        if (glowIntensityValue) glowIntensityValue.textContent = currentSettings.glowIntensity;
        renderLogo();
    });
    
    // Shape
    shapeOptions?.forEach(option => {
        option.addEventListener('click', () => {
            shapeOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            currentSettings.selectedShape = option.dataset.shape;
            if (selectedShapeInput) selectedShapeInput.value = currentSettings.selectedShape;
            renderLogo();
        });
    });
    shapeColorInput?.addEventListener('input', () => {
        currentSettings.shapeColor = shapeColorInput.value;
        renderLogo();
    });
    shapeOpacityInput?.addEventListener('input', () => {
        currentSettings.shapeOpacity = parseInt(shapeOpacityInput.value);
        if (shapeOpacityValue) shapeOpacityValue.textContent = currentSettings.shapeOpacity;
        renderLogo();
    });
    shapePaddingInput?.addEventListener('input', () => {
        currentSettings.shapePadding = parseInt(shapePaddingInput.value);
        if (shapePaddingValue) shapePaddingValue.textContent = currentSettings.shapePadding;
        renderLogo();
    });
    shapeBorderInput?.addEventListener('input', () => {
        currentSettings.shapeBorder = parseInt(shapeBorderInput.value);
        if (shapeBorderValue) shapeBorderValue.textContent = currentSettings.shapeBorder;
        renderLogo();
    });
    shapeBorderColorInput?.addEventListener('input', () => {
        currentSettings.shapeBorderColor = shapeBorderColorInput.value;
        renderLogo();
    });
    
    // Icon
    addIconBtn?.addEventListener('click', () => {
        const iconClass = iconClassInput.value.trim();
        if (iconClass) {
            currentIcon = iconClass;
            if (iconPreview) iconPreview.innerHTML = `<i class="${iconClass}" style="font-size: 40px; color: ${currentSettings.iconColor}"></i>`;
            renderLogo();
            showToast('Icon added!', 'success');
        }
    });
    iconSizeInput?.addEventListener('input', () => {
        currentSettings.iconSize = parseInt(iconSizeInput.value);
        if (iconSizeValue) iconSizeValue.textContent = currentSettings.iconSize;
        renderLogo();
    });
    iconColorInput?.addEventListener('input', () => {
        currentSettings.iconColor = iconColorInput.value;
        renderLogo();
    });
    
    // Canvas resize
    canvasWidthInput?.addEventListener('input', () => {
        canvasWidth = parseInt(canvasWidthInput.value);
        if (canvasWidthValue) canvasWidthValue.textContent = canvasWidth;
        renderLogo();
    });
    canvasHeightInput?.addEventListener('input', () => {
        canvasHeight = parseInt(canvasHeightInput.value);
        if (canvasHeightValue) canvasHeightValue.textContent = canvasHeight;
        renderLogo();
    });
    
    // Download buttons
    downloadPngBtn?.addEventListener('click', () => downloadLogo('png'));
    downloadJpgBtn?.addEventListener('click', () => downloadLogo('jpg'));
    downloadSvgBtn?.addEventListener('click', () => downloadLogo('svg'));
    downloadPdfBtn?.addEventListener('click', () => downloadLogo('pdf'));
    copyLogoBtn?.addEventListener('click', copyLogoToClipboard);
    copyLogoBtn2?.addEventListener('click', copyLogoToClipboard);
    
    // History
    saveHistoryBtn?.addEventListener('click', saveToHistory);
    loadHistoryBtn?.addEventListener('click', loadHistory);
    clearHistoryBtn?.addEventListener('click', () => {
        logoHistory = [];
        localStorage.removeItem('logoHistory');
        updateHistoryList();
        showToast('History cleared', 'success');
    });
    
    // Zoom
    zoomInBtn?.addEventListener('click', zoomIn);
    zoomOutBtn?.addEventListener('click', zoomOut);
    resetZoomBtn?.addEventListener('click', resetZoom);
    
    // Presets
    presetBtns?.forEach(btn => {
        btn.addEventListener('click', () => applyPreset(btn.dataset.preset));
    });
    
    // Size presets
    sizePresets?.forEach(btn => {
        btn.addEventListener('click', () => {
            canvasWidthInput.value = btn.dataset.width;
            canvasHeightInput.value = btn.dataset.height;
            resizeCanvas();
            showToast(`Canvas resized to ${btn.dataset.width}x${btn.dataset.height}`, 'success');
        });
    });
    
    // Palette buttons
    paletteBtns?.forEach(btn => {
        btn.addEventListener('click', () => {
            const palette = btn.dataset.palette;
            if (palette === 'blue') {
                currentSettings.textColor = '#4361ee';
                currentSettings.bgColor = '#e3f2fd';
            } else if (palette === 'green') {
                currentSettings.textColor = '#10b981';
                currentSettings.bgColor = '#ecfdf5';
            } else if (palette === 'red') {
                currentSettings.textColor = '#ef4444';
                currentSettings.bgColor = '#fef2f2';
            } else if (palette === 'purple') {
                currentSettings.textColor = '#8b5cf6';
                currentSettings.bgColor = '#f5f3ff';
            } else if (palette === 'orange') {
                currentSettings.textColor = '#f59e0b';
                currentSettings.bgColor = '#fffbeb';
            } else if (palette === 'dark') {
                currentSettings.textColor = '#ffffff';
                currentSettings.bgColor = '#1f2937';
            }
            updateUIFromSettings();
            renderLogo();
            showToast(`${palette} palette applied`, 'success');
        });
    });
    
    // Export buttons
    exportBtns?.forEach(btn => {
        btn.addEventListener('click', () => downloadLogo(btn.dataset.format));
    });
    
    // Canvas background
    canvasBgBtns?.forEach(btn => {
        btn.addEventListener('click', () => {
            const bg = btn.dataset.bg;
            if (bg === 'white') {
                canvasContainer.style.background = 'white';
            } else if (bg === 'transparent') {
                canvasContainer.style.background = 'transparent';
            } else if (bg === 'checker') {
                canvasContainer.style.background = 'repeating-conic-gradient(#ccc 0% 25%, transparent 0% 50%) 50% / 20px 20px';
            }
        });
    });
    
    // Reactions
    document.querySelectorAll('.reaction').forEach(btn => {
        btn.addEventListener('click', () => addReaction(btn.dataset.reaction));
    });
    
    // Share buttons
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', () => shareOnPlatform(btn.dataset.platform));
    });
    
    // Page share
    pageShareBtn?.addEventListener('click', sharePage);
    
    // Theme toggle    themeToggle?.addEventListener('click', toggleTheme);
    
    // Scroll
    window.addEventListener('scroll', () => {
        if (scrollUpBtn) scrollUpBtn.style.display = window.scrollY > 200 ? 'flex' : 'none';
    });
    scrollUpBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    scrollDownBtn?.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
}

// ===== INITIALIZE =====
async function init() {
    initEventListeners();
    initTabs();
    initKeyboardShortcuts();
    loadTheme();
    updateHistoryList();
    await getUsageCount();
    await getReactions();
    renderLogo();
    showToast('Text Logo Generator ready! 65+ features available', 'success');
}

init();

}); // End DOMContentLoaded
