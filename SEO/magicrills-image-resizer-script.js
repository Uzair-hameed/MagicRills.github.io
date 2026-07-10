/* ========================================
   MagicRills Image Resizer - Complete JavaScript
   Cloudflare Workers API Integration
   Dark Space Theme | 40+ Features
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {

// ===== CONFIG =====
const TOOL_SLUG = 'image-resizer';
const TOOL_NAME = 'MagicRills Image Resizer';
const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';
const API_KEY = 'magicrills-grok-api.uzairhameed01.workers.dev';

// ===== GLOBAL VARIABLES =====
let selectedFiles = [];
let processedImages = [];
let currentRotation = 0;
let currentFlipH = false;
let currentFlipV = false;
let usageCount = 0;
let viewCount = 0;
let shareCount = 0;
let reactionData = { like: 0, love: 0, wow: 0, sad: 0, laugh: 0, celebrate: 0 };

// Settings
let currentSettings = {
    resizeMode: 'percentage',
    percentage: 100,
    width: null,
    height: null,
    fitWidth: null,
    fitHeight: null,
    targetSizeKB: null,
    maintainAspect: true,
    outputFormat: 'original',
    quality: 80,
    addWatermark: false,
    watermarkText: '© MagicRills',
    watermarkPosition: 'bottom-right',
    watermarkOpacity: 50,
    watermarkFontSize: 20,
    filter: 'none',
    brightness: 0,
    contrast: 0,
    blur: 0,
    saturate: 100,
    rotation: 0,
    flipH: false,
    flipV: false,
    batchRename: false
};

// ===== DOM ELEMENTS =====
const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const dropZone = document.getElementById('dropZone');
const fileInfo = document.getElementById('fileInfo');
const fileCountSpan = document.getElementById('fileCount');
const clearFilesBtn = document.getElementById('clearFilesBtn');
const processBtn = document.getElementById('processBtn');
const heroProcessBtn = document.getElementById('heroProcessBtn');
const heroUploadBtn = document.getElementById('heroUploadBtn');
const progressContainer = document.getElementById('progressContainer');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const resultsSection = document.getElementById('resultsSection');
const imageGrid = document.getElementById('imageGrid');
const downloadAllBtn = document.getElementById('downloadAllBtn');
const copyAllBtn = document.getElementById('copyAllBtn');
const printAllBtn = document.getElementById('printAllBtn');
const clearResultsBtn = document.getElementById('clearResultsBtn');
const resultsCount = document.getElementById('resultsCount');
const usageCountSpan = document.getElementById('usageCount');
const heroUsageCount = document.getElementById('heroUsageCount');
const heroViewsCount = document.getElementById('heroViewsCount');
const heroSharesCount = document.getElementById('heroSharesCount');
const pageShareBtn = document.getElementById('pageShareBtn');
const scrollUpBtn = document.getElementById('scrollUpBtn');
const scrollDownBtn = document.getElementById('scrollDownBtn');
const themeToggle = document.getElementById('themeToggle');
const resizeMode = document.getElementById('resizeMode');
const percentageMode = document.getElementById('percentageMode');
const dimensionsMode = document.getElementById('dimensionsMode');
const presetMode = document.getElementById('presetMode');
const widthMode = document.getElementById('widthMode');
const heightMode = document.getElementById('heightMode');
const filesizeMode = document.getElementById('filesizeMode');
const percentageSlider = document.getElementById('percentageSlider');
const percentageValue = document.getElementById('percentageValue');
const targetWidth = document.getElementById('targetWidth');
const targetHeight = document.getElementById('targetHeight');
const maintainAspect = document.getElementById('maintainAspect');
const presetSelect = document.getElementById('presetSelect');
const fitWidth = document.getElementById('fitWidth');
const fitHeight = document.getElementById('fitHeight');
const targetSizeKB = document.getElementById('targetSizeKB');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const qualityGroup = document.getElementById('qualityGroup');
const addWatermark = document.getElementById('addWatermark');
const watermarkDetailOptions = document.getElementById('watermarkDetailOptions');
const watermarkText = document.getElementById('watermarkText');
const watermarkPosition = document.getElementById('watermarkPosition');
const watermarkOpacity = document.getElementById('watermarkOpacity');
const opacityValue = document.getElementById('opacityValue');
const watermarkFontSize = document.getElementById('watermarkFontSize');
const outputFormat = document.getElementById('outputFormat');
const batchRename = document.getElementById('batchRename');
const comparisonSection = document.getElementById('comparisonSection');
const comparisonContainer = document.getElementById('comparisonContainer');
const exifPanel = document.getElementById('exifPanel');
const exifData = document.getElementById('exifData');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');

// Filter elements
const filterBtns = document.querySelectorAll('.filter-btn');
const selectedFilter = document.getElementById('selectedFilter');
const filterDetailOptions = document.getElementById('filterDetailOptions');
const brightnessFilter = document.getElementById('brightnessFilter');
const brightnessVal = document.getElementById('brightnessVal');
const contrastFilter = document.getElementById('contrastFilter');
const contrastVal = document.getElementById('contrastVal');
const blurFilter = document.getElementById('blurFilter');
const blurVal = document.getElementById('blurVal');
const saturateFilter = document.getElementById('saturateFilter');
const saturateVal = document.getElementById('saturateVal');

// Transform elements
const rotateBtns = document.querySelectorAll('[data-rotate]');
const flipBtns = document.querySelectorAll('[data-flip]');

// Tab elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabResize = document.getElementById('tabResize');
const tabFilters = document.getElementById('tabFilters');
const tabTransform = document.getElementById('tabTransform');
const tabWatermark = document.getElementById('tabWatermark');
const tabAI = document.getElementById('tabAI');

// AI elements
const aiActions = document.querySelectorAll('.ai-action');

// Typewriter
const typewriterText = document.getElementById('typewriterText');

// ===== TYPEWRITER EFFECT =====
const typewriterPhrases = [
    'Image Resizer',
    'Image Editor',
    'Batch Processor',
    'Filter Master',
    'AI Enhanced'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typewriterEffect() {
    const currentPhrase = typewriterPhrases[phraseIndex];
    
    if (isDeleting) {
        typewriterText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let speed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentPhrase.length) {
        speed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % typewriterPhrases.length;
        speed = 500;
    }
    
    setTimeout(typewriterEffect, speed);
}

// Start typewriter
if (typewriterText) {
    typewriterEffect();
}

// ===== CLOUDFLARE WORKERS API =====

// Generic API call with fallback
async function callAPI(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            }
        };
        
        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.warn('API call failed, using fallback:', error);
        return null;
    }
}

// ===== API FUNCTIONS =====

// 1. Get Tool Stats
async function getToolStats() {
    try {
        const data = await callAPI(`/api/stats?tool_slug=${TOOL_SLUG}`);
        if (data && data.success) {
            usageCount = data.usage || 0;
            viewCount = data.views || 0;
            shareCount = data.shares || 0;
            if (data.reactions) {
                reactionData = data.reactions;
            }
            updateStatsUI();
            return data;
        }
    } catch (error) {
        console.warn('Failed to fetch stats, using localStorage fallback');
    }
    
    // Fallback to localStorage
    usageCount = parseInt(localStorage.getItem(`${TOOL_SLUG}_usage`) || '0');
    viewCount = parseInt(localStorage.getItem(`${TOOL_SLUG}_views`) || '0');
    shareCount = parseInt(localStorage.getItem(`${TOOL_SLUG}_shares`) || '0');
    
    const savedReactions = localStorage.getItem(`${TOOL_SLUG}_reactions`);
    if (savedReactions) {
        reactionData = JSON.parse(savedReactions);
    }
    
    updateStatsUI();
    return { usage: usageCount, views: viewCount, shares: shareCount, reactions: reactionData };
}

// 2. Increment Usage (called on tool load)
async function incrementUsage() {
    try {
        const data = await callAPI('/api/usage', 'POST', {
            tool_slug: TOOL_SLUG,
            tool_name: TOOL_NAME
        });
        if (data && data.success) {
            usageCount = data.count || usageCount + 1;
            updateStatsUI();
            localStorage.setItem(`${TOOL_SLUG}_usage`, usageCount);
            return data;
        }
    } catch (error) {
        console.warn('Usage increment failed, using localStorage fallback');
    }
    
    // Fallback
    usageCount = parseInt(localStorage.getItem(`${TOOL_SLUG}_usage`) || '0') + 1;
    localStorage.setItem(`${TOOL_SLUG}_usage`, usageCount);
    updateStatsUI();
    return { count: usageCount };
}

// 3. Record View (called on tool load)
async function recordView() {
    try {
        const data = await callAPI('/api/views', 'POST', {
            tool_slug: TOOL_SLUG,
            tool_name: TOOL_NAME
        });
        if (data && data.success) {
            viewCount = data.count || viewCount + 1;
            updateStatsUI();
            localStorage.setItem(`${TOOL_SLUG}_views`, viewCount);
            return data;
        }
    } catch (error) {
        console.warn('View record failed, using localStorage fallback');
    }
    
    // Fallback
    viewCount = parseInt(localStorage.getItem(`${TOOL_SLUG}_views`) || '0') + 1;
    localStorage.setItem(`${TOOL_SLUG}_views`, viewCount);
    updateStatsUI();
    return { count: viewCount };
}

// 4. Record Share
async function recordShare(platform) {
    try {
        const data = await callAPI('/api/shares', 'POST', {
            tool_slug: TOOL_SLUG,
            tool_name: TOOL_NAME,
            platform: platform
        });
        if (data && data.success) {
            shareCount = data.count || shareCount + 1;
            updateStatsUI();
            localStorage.setItem(`${TOOL_SLUG}_shares`, shareCount);
            return data;
        }
    } catch (error) {
        console.warn('Share record failed, using localStorage fallback');
    }
    
    // Fallback
    shareCount = parseInt(localStorage.getItem(`${TOOL_SLUG}_shares`) || '0') + 1;
    localStorage.setItem(`${TOOL_SLUG}_shares`, shareCount);
    updateStatsUI();
    return { count: shareCount };
}

// 5. Add Reaction
async function addReaction(reactionType) {
    try {
        const data = await callAPI('/api/reactions', 'POST', {
            tool_slug: TOOL_SLUG,
            reaction: reactionType
        });
        if (data && data.success) {
            reactionData[reactionType] = data.count || (reactionData[reactionType] || 0) + 1;
            updateReactionUI();
            localStorage.setItem(`${TOOL_SLUG}_reactions`, JSON.stringify(reactionData));
            return data;
        }
    } catch (error) {
        console.warn('Reaction add failed, using localStorage fallback');
    }
    
    // Fallback
    reactionData[reactionType] = (reactionData[reactionType] || 0) + 1;
    updateReactionUI();
    localStorage.setItem(`${TOOL_SLUG}_reactions`, JSON.stringify(reactionData));
    return { count: reactionData[reactionType] };
}

// ===== UI UPDATE FUNCTIONS =====

function updateStatsUI() {
    // Usage
    if (usageCountSpan) usageCountSpan.textContent = usageCount;
    if (heroUsageCount) heroUsageCount.textContent = usageCount;
    
    // Views
    if (heroViewsCount) heroViewsCount.textContent = viewCount;
    
    // Shares
    if (heroSharesCount) heroSharesCount.textContent = shareCount;
}

function updateReactionUI() {
    for (const [reaction, count] of Object.entries(reactionData)) {
        const btn = document.querySelector(`.reaction[data-reaction="${reaction}"]`);
        if (btn) {
            const span = btn.querySelector('.reaction-count');
            if (span) span.textContent = count || 0;
        }
    }
}

// ===== HELPER FUNCTIONS =====

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-info-circle'
    };
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${iconMap[type] || 'fa-info-circle'}"></i> ${message}`;
    container.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) toast.remove();
    }, 3000);
}

function showLoading(show) {
    if (!processBtn) return;
    if (show) {
        processBtn.disabled = true;
        processBtn.innerHTML = '<span style="display:inline-block;width:16px;height:16px;border:2px solid white;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;"></span> Processing...';
    } else {
        processBtn.disabled = false;
        processBtn.innerHTML = '<i class="fas fa-magic"></i> Process Images';
    }
}

// Add spin animation if not exists
if (!document.querySelector('#spinStyle')) {
    const spinStyle = document.createElement('style');
    spinStyle.id = 'spinStyle';
    spinStyle.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(spinStyle);
}

// ===== FILE HANDLING =====

function handleFileSelect(event) {
    selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length === 0) return;
    
    fileInfo.style.display = 'flex';
    fileCountSpan.textContent = selectedFiles.length;
    
    const batchListDiv = document.getElementById('batchListDiv');
    if (batchListDiv) {
        if (selectedFiles.length > 1) {
            batchListDiv.innerHTML = `<div class="batch-list"><i class="fas fa-layer-group"></i> <strong>${selectedFiles.length}</strong> files ready<br><small>Click Process to resize all</small></div>`;
        } else {
            batchListDiv.innerHTML = '';
        }
    }
    
    // Show EXIF for first image
    if (selectedFiles.length > 0) {
        showExifData(selectedFiles[0]);
    }
    
    showToast(selectedFiles.length + ' file(s) selected', 'success');
}

function showExifData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            exifPanel.style.display = 'block';
            exifData.innerHTML = `
                <p><strong>Name:</strong> ${file.name}</p>
                <p><strong>Size:</strong> ${(file.size / 1024).toFixed(2)} KB</p>
                <p><strong>Dimensions:</strong> ${img.width} x ${img.height} px</p>
                <p><strong>Type:</strong> ${file.type || 'Unknown'}</p>
            `;
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function clearFiles() {
    selectedFiles = [];
    fileInfo.style.display = 'none';
    document.getElementById('batchListDiv').innerHTML = '';
    exifPanel.style.display = 'none';
    if (fileInput) fileInput.value = '';
    showToast('Files cleared', 'success');
}

// ===== RESIZE MODE =====

function updateResizeMode() {
    const mode = resizeMode.value;
    
    percentageMode.style.display = 'none';
    dimensionsMode.style.display = 'none';
    presetMode.style.display = 'none';
    widthMode.style.display = 'none';
    heightMode.style.display = 'none';
    filesizeMode.style.display = 'none';
    
    if (mode === 'percentage') percentageMode.style.display = 'block';
    else if (mode === 'dimensions') dimensionsMode.style.display = 'block';
    else if (mode === 'preset') presetMode.style.display = 'block';
    else if (mode === 'width') widthMode.style.display = 'block';
    else if (mode === 'height') heightMode.style.display = 'block';
    else if (mode === 'filesize') filesizeMode.style.display = 'block';
}

function applyPreset() {
    const preset = presetSelect.value;
    const presets = {
        'instagram_post': { width: 1080, height: 1080 },
        'instagram_story': { width: 1080, height: 1920 },
        'facebook_post': { width: 1200, height: 630 },
        'twitter_post': { width: 1600, height: 900 },
        'youtube_thumbnail': { width: 1280, height: 720 },
        'linkedin_post': { width: 1200, height: 627 }
    };
    if (presets[preset]) {
        targetWidth.value = presets[preset].width;
        targetHeight.value = presets[preset].height;
        showToast(`Preset applied: ${preset.replace('_', ' ')}`, 'success');
    }
}

// ===== FORMAT HANDLING =====

function initFormatButtons() {
    document.querySelectorAll('.format-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const format = btn.dataset.format;
            outputFormat.value = format;
            qualityGroup.style.display = (format === 'original') ? 'none' : 'block';
        });
    });
}

// ===== FILTER HANDLING =====

function initFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            selectedFilter.value = filter;
            
            filterDetailOptions.style.display = (filter !== 'none') ? 'block' : 'none';
        });
    });
    
    brightnessFilter.addEventListener('input', () => {
        brightnessVal.textContent = brightnessFilter.value;
    });
    contrastFilter.addEventListener('input', () => {
        contrastVal.textContent = contrastFilter.value;
    });
    blurFilter.addEventListener('input', () => {
        blurVal.textContent = blurFilter.value;
    });
    saturateFilter.addEventListener('input', () => {
        saturateVal.textContent = saturateFilter.value;
    });
}

// ===== TRANSFORM HANDLING =====

function initTransforms() {
    rotateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const angle = parseInt(btn.dataset.rotate);
            currentRotation = (currentRotation + angle) % 360;
            showToast(`Rotated ${angle}°`, 'success');
        });
    });
    
    flipBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.flip === 'horizontal') {
                currentFlipH = !currentFlipH;
                showToast(currentFlipH ? 'Flip Horizontal ON' : 'Flip Horizontal OFF', 'success');
            } else if (btn.dataset.flip === 'vertical') {
                currentFlipV = !currentFlipV;
                showToast(currentFlipV ? 'Flip Vertical ON' : 'Flip Vertical OFF', 'success');
            }
        });
    });
}

// ===== TAB HANDLING =====

function initTabs() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const tab = btn.dataset.tab;
            tabResize.style.display = 'none';
            tabFilters.style.display = 'none';
            tabTransform.style.display = 'none';
            tabWatermark.style.display = 'none';
            if (tabAI) tabAI.style.display = 'none';
            
            if (tab === 'resize') tabResize.style.display = 'block';
            else if (tab === 'filters') tabFilters.style.display = 'block';
            else if (tab === 'transform') tabTransform.style.display = 'block';
            else if (tab === 'watermark') tabWatermark.style.display = 'block';
            else if (tab === 'ai' && tabAI) tabAI.style.display = 'block';
        });
    });
}

// ===== WATERMARK HANDLING =====

function initWatermark() {
    addWatermark.addEventListener('change', () => {
        watermarkDetailOptions.style.display = addWatermark.checked ? 'block' : 'none';
    });
    watermarkOpacity.addEventListener('input', () => {
        opacityValue.textContent = watermarkOpacity.value;
    });
}

// ===== AI HANDLING =====

function initAI() {
    aiActions.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.ai;
            if (selectedFiles.length === 0) {
                showToast('Please upload images first', 'warning');
                return;
            }
            showToast(`AI ${action} feature coming soon!`, 'warning');
        });
    });
}

// ===== GET FILTER STRING =====

function getFilterString() {
    const filters = [];
    const filterType = selectedFilter.value;
    
    if (filterType === 'grayscale') filters.push('grayscale(100%)');
    else if (filterType === 'sepia') filters.push('sepia(100%)');
    else if (filterType === 'invert') filters.push('invert(100%)');
    
    const brightness = parseInt(brightnessFilter.value);
    const contrast = parseInt(contrastFilter.value);
    const blur = parseInt(blurFilter.value);
    const saturate = parseInt(saturateFilter.value);
    
    if (brightness !== 0) filters.push(`brightness(${100 + brightness}%)`);
    if (contrast !== 0) filters.push(`contrast(${100 + contrast}%)`);
    if (blur > 0) filters.push(`blur(${blur}px)`);
    if (saturate !== 100) filters.push(`saturate(${saturate}%)`);
    
    return filters.join(' ');
}

// ===== PROCESS IMAGE =====

async function processImages() {
    if (selectedFiles.length === 0) {
        showToast('Please select images first', 'warning');
        return;
    }
    
    showLoading(true);
    progressContainer.style.display = 'block';
    processedImages = [];
    imageGrid.innerHTML = '';
    
    // Gather all settings
    currentSettings.resizeMode = resizeMode.value;
    currentSettings.percentage = parseInt(percentageSlider.value);
    currentSettings.width = targetWidth.value ? parseInt(targetWidth.value) : null;
    currentSettings.height = targetHeight.value ? parseInt(targetHeight.value) : null;
    currentSettings.fitWidth = fitWidth.value ? parseInt(fitWidth.value) : null;
    currentSettings.fitHeight = fitHeight.value ? parseInt(fitHeight.value) : null;
    currentSettings.targetSizeKB = targetSizeKB.value ? parseInt(targetSizeKB.value) : null;
    currentSettings.maintainAspect = maintainAspect.checked;
    currentSettings.outputFormat = outputFormat.value;
    currentSettings.quality = parseInt(qualitySlider.value);
    currentSettings.addWatermark = addWatermark.checked;
    currentSettings.watermarkText = watermarkText.value;
    currentSettings.watermarkPosition = watermarkPosition.value;
    currentSettings.watermarkOpacity = parseInt(watermarkOpacity.value);
    currentSettings.watermarkFontSize = parseInt(watermarkFontSize.value);
    currentSettings.filter = selectedFilter.value;
    currentSettings.brightness = parseInt(brightnessFilter.value);
    currentSettings.contrast = parseInt(contrastFilter.value);
    currentSettings.blur = parseInt(blurFilter.value);
    currentSettings.saturate = parseInt(saturateFilter.value);
    currentSettings.rotation = currentRotation;
    currentSettings.flipH = currentFlipH;
    currentSettings.flipV = currentFlipV;
    currentSettings.batchRename = batchRename.checked;
    
    for (let i = 0; i < selectedFiles.length; i++) {
        progressFill.style.width = `${(i / selectedFiles.length) * 100}%`;
        progressText.textContent = `Processing ${i + 1} of ${selectedFiles.length}: ${selectedFiles[i].name}`;
        
        try {
            const result = await processSingleImage(selectedFiles[i], i);
            processedImages.push(result);
            addImageToGrid(result, i);
        } catch (error) {
            console.error(error);
            showToast(`Failed to process ${selectedFiles[i].name}`, 'error');
        }
    }
    
    progressFill.style.width = '100%';
    progressText.textContent = `Completed! ${processedImages.length} images processed`;
    resultsSection.style.display = 'block';
    if (resultsCount) resultsCount.textContent = processedImages.length;
    
    // Show comparison
    if (processedImages.length > 0) {
        showComparison();
    }
    
    showLoading(false);
    setTimeout(() => {
        progressContainer.style.display = 'none';
    }, 2000);
}

function processSingleImage(file, index) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                let width = img.width;
                let height = img.height;
                const originalWidth = width;
                const originalHeight = height;
                
                // Calculate new dimensions
                const mode = currentSettings.resizeMode;
                if (mode === 'percentage') {
                    const scale = currentSettings.percentage / 100;
                    width = originalWidth * scale;
                    height = originalHeight * scale;
                } else if (mode === 'dimensions') {
                    width = currentSettings.width || originalWidth;
                    height = currentSettings.height || originalHeight;
                    if (currentSettings.maintainAspect) {
                        const ratio = originalWidth / originalHeight;
                        if (currentSettings.width && !currentSettings.height) {
                            height = width / ratio;
                        } else if (!currentSettings.width && currentSettings.height) {
                            width = height * ratio;
                        }
                    }
                } else if (mode === 'width') {
                    width = currentSettings.fitWidth || originalWidth;
                    height = currentSettings.maintainAspect ? width / (originalWidth / originalHeight) : originalHeight;
                } else if (mode === 'height') {
                    height = currentSettings.fitHeight || originalHeight;
                    width = currentSettings.maintainAspect ? height * (originalWidth / originalHeight) : originalWidth;
                } else if (mode === 'preset') {
                    width = currentSettings.width || originalWidth;
                    height = currentSettings.height || originalHeight;
                }
                
                width = Math.round(width);
                height = Math.round(height);
                
                // Create canvas
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = width;
                canvas.height = height;
                
                // Apply transforms
                ctx.save();
                ctx.translate(width / 2, height / 2);
                
                // Rotation
                if (currentSettings.rotation !== 0) {
                    ctx.rotate(currentSettings.rotation * Math.PI / 180);
                }
                
                // Flip
                let scaleX = currentSettings.flipH ? -1 : 1;
                let scaleY = currentSettings.flipV ? -1 : 1;
                ctx.scale(scaleX, scaleY);
                
                // Apply filter
                ctx.filter = getFilterString();
                
                ctx.drawImage(img, -width / 2, -height / 2, width, height);
                ctx.restore();
                
                // Add watermark
                if (currentSettings.addWatermark && currentSettings.watermarkText) {
                    const fontSize = Math.min(width, height) / (100 / currentSettings.watermarkFontSize);
                    ctx.font = `${fontSize}px Arial`;
                    ctx.fillStyle = `rgba(255, 255, 255, ${currentSettings.watermarkOpacity / 100})`;
                    const text = currentSettings.watermarkText;
                    const textWidth = ctx.measureText(text).width;
                    let x, y;
                    
                    switch(currentSettings.watermarkPosition) {
                        case 'bottom-right': x = width - textWidth - 15; y = height - 15; break;
                        case 'bottom-left': x = 15; y = height - 15; break;
                        case 'top-right': x = width - textWidth - 15; y = fontSize + 10; break;
                        case 'top-left': x = 15; y = fontSize + 10; break;
                        default: x = (width - textWidth) / 2; y = height / 2; break;
                    }
                    ctx.fillText(text, x, y);
                }
                
                // Get format
                let format = currentSettings.outputFormat;
                let mimeType = 'image/jpeg';
                let quality = currentSettings.quality / 100;
                
                if (format === 'original') {
                    const parts = file.type.split('/');
                    format = parts.length > 1 ? parts[1] : 'jpeg';
                }
                if (format === 'png') {
                    mimeType = 'image/png';
                    quality = undefined;
                } else if (format === 'webp') {
                    mimeType = 'image/webp';
                }
                
                canvas.toBlob(blob => {
                    const url = URL.createObjectURL(blob);
                    let filename;
                    if (currentSettings.batchRename) {
                        filename = `image_${index + 1}.${format}`;
                    } else {
                        filename = file.name.replace(/\.[^/.]+$/, '') + `_resized.${format}`;
                    }
                    
                    resolve({
                        url: url,
                        blob: blob,
                        originalName: file.name,
                        filename: filename,
                        originalWidth: originalWidth,
                        originalHeight: originalHeight,
                        newWidth: width,
                        newHeight: height,
                        size: (blob.size / 1024).toFixed(2),
                        format: format
                    });
                }, mimeType, quality);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function addImageToGrid(result, index) {
    const card = document.createElement('div');
    card.className = 'image-card';
    card.innerHTML = `
        <div class="image-preview">
            <img src="${result.url}" alt="${result.filename}">
        </div>
        <div class="image-info">
            <p><span>Original:</span> <span>${result.originalWidth}×${result.originalHeight}</span></p>
            <p><span>Resized:</span> <span>${result.newWidth}×${result.newHeight}</span></p>
            <p><span>Size:</span> <span>${result.size} KB</span></p>
            <p><span>Format:</span> <span>${result.format.toUpperCase()}</span></p>
        </div>
        <div class="image-actions">
            <button class="btn btn-primary download-single" data-index="${index}"><i class="fas fa-download"></i> Download</button>
            <button class="btn btn-outline copy-single" data-index="${index}"><i class="fas fa-copy"></i> Copy</button>
        </div>
    `;
    imageGrid.appendChild(card);
    
    card.querySelector('.download-single').addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = result.url;
        a.download = result.filename;
        a.click();
        showToast('Downloaded!', 'success');
    });
    
    card.querySelector('.copy-single').addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(result.filename);
            showToast('Copied!', 'success');
        } catch (err) {
            showToast('Failed to copy', 'error');
        }
    });
}

function showComparison() {
    if (processedImages.length === 0) return;
    comparisonSection.style.display = 'block';
    comparisonContainer.innerHTML = '';
    
    const firstImage = processedImages[0];
    const compareItem = document.createElement('div');
    compareItem.className = 'comparison-item';
    compareItem.innerHTML = `
        <h4>${firstImage.originalName}</h4>
        <div class="comparison-images">
            <div>
                <p>Original (${firstImage.originalWidth}×${firstImage.originalHeight})</p>
                <img src="${firstImage.url}" style="opacity:0.6">
            </div>
            <div>
                <p>Resized (${firstImage.newWidth}×${firstImage.newHeight})</p>
                <img src="${firstImage.url}">
            </div>
        </div>
    `;
    comparisonContainer.appendChild(compareItem);
}

// ===== DOWNLOAD ALL =====

async function downloadAllImages() {
    if (processedImages.length === 0) return;
    
    if (processedImages.length === 1) {
        const a = document.createElement('a');
        a.href = processedImages[0].url;
        a.download = processedImages[0].filename;
        a.click();
        showToast('Downloaded!', 'success');
        return;
    }
    
    try {
        const zip = new JSZip();
        for (const img of processedImages) {
            zip.file(img.filename, img.blob);
        }
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, 'magicrills-resized-images.zip');
        showToast(`Downloaded ${processedImages.length} images as ZIP`, 'success');
        recordShare('zip_download');
    } catch (error) {
        showToast('Error creating ZIP', 'error');
    }
}

function copyAllImages() {
    const names = processedImages.map(img => img.filename).join('\n');
    navigator.clipboard.writeText(names);
    showToast('Filenames copied!', 'success');
}

function printAllImages() {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>MagicRills - Processed Images</title></head><body>');
    processedImages.forEach(img => {
        printWindow.document.write(`<h3>${img.filename}</h3><img src="${img.url}" style="max-width:100%"><hr>`);
    });
    printWindow.document.write('</body></html>');
    printWindow.print();
}

function clearResults() {
    processedImages.forEach(img => URL.revokeObjectURL(img.url));
    processedImages = [];
    imageGrid.innerHTML = '';
    resultsSection.style.display = 'none';
    comparisonSection.style.display = 'none';
    showToast('Results cleared', 'success');
}

// ===== SOCIAL SHARING =====

async function shareOnPlatform(platform) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Resize your images for free at MagicRills!');
    
    let shareUrl = '';
    if (platform === 'facebook') {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (platform === 'twitter') {
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    } else if (platform === 'linkedin') {
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?u=${url}`;
    } else if (platform === 'whatsapp') {
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
    } else if (platform === 'email') {
        shareUrl = `mailto:?subject=Image Resizer&body=${text}%0A%0A${url}`;
    } else if (platform === 'copy') {
        try {
            await navigator.clipboard.writeText(window.location.href);
            await recordShare('copy_link');
            showToast('Link copied to clipboard!', 'success');
            return;
        } catch (err) {
            showToast('Failed to copy link', 'error');
            return;
        }
    }
    
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

// ===== THEME =====

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    const icon = themeToggle.querySelector('i');
    if (isDark) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

function loadTheme() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        const icon = themeToggle.querySelector('i');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

// ===== MOBILE MENU =====

function initMobileMenu() {
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            const links = document.querySelector('.nav-links');
            if (links) links.classList.toggle('open');
        });
    }
}

// ===== KEYBOARD SHORTCUTS =====

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            if (selectedFiles.length > 0) processImages();
        } else if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            if (processedImages.length > 0) downloadAllImages();
        } else if (e.ctrlKey && e.key === 'z') {
            e.preventDefault();
            currentRotation = 0;
            currentFlipH = false;
            currentFlipV = false;
            showToast('Reset transforms', 'success');
        }
    });
}

// ===== EVENT LISTENERS =====

function initEventListeners() {
    // File upload
    browseBtn.addEventListener('click', () => fileInput.click());
    if (heroUploadBtn) {
        heroUploadBtn.addEventListener('click', () => fileInput.click());
    }
    if (heroProcessBtn) {
        heroProcessBtn.addEventListener('click', () => {
            if (selectedFiles.length === 0) {
                fileInput.click();
            } else {
                processImages();
            }
        });
    }
    fileInput.addEventListener('change', handleFileSelect);
    clearFilesBtn.addEventListener('click', clearFiles);
    processBtn.addEventListener('click', processImages);
    
    // Results
    downloadAllBtn.addEventListener('click', downloadAllImages);
    copyAllBtn.addEventListener('click', copyAllImages);
    printAllBtn.addEventListener('click', printAllImages);
    clearResultsBtn.addEventListener('click', clearResults);
    
    // Share
    pageShareBtn.addEventListener('click', sharePage);
    
    // Theme
    themeToggle.addEventListener('click', toggleTheme);
    
    // Resize mode
    resizeMode.addEventListener('change', updateResizeMode);
    percentageSlider.addEventListener('input', () => {
        percentageValue.textContent = percentageSlider.value;
    });
    presetSelect.addEventListener('change', applyPreset);
    qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = qualitySlider.value;
    });
    
    // Reactions
    document.querySelectorAll('.reaction').forEach(btn => {
        btn.addEventListener('click', () => addReaction(btn.dataset.reaction));
    });
    
    // Share buttons
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', () => shareOnPlatform(btn.dataset.platform));
    });
    
    // Scroll
    window.addEventListener('scroll', () => {
        scrollUpBtn.style.display = window.scrollY > 200 ? 'flex' : 'none';
    });
    scrollUpBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    scrollDownBtn.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
}

// ===== INITIALIZE =====

async function init() {
    // Load theme
    loadTheme();
    
    // Mobile menu
    initMobileMenu();
    
    // Initialize all components
    initEventListeners();
    initFormatButtons();
    initFilters();
    initTransforms();
    initTabs();
    initWatermark();
    initAI();
    initKeyboardShortcuts();
    updateResizeMode();
    
    // Get stats from API
    await getToolStats();
    
    // Increment usage on load
    await incrementUsage();
    
    // Record view
    await recordView();
    
    // Update reaction UI
    updateReactionUI();
    
    showToast('Image Resizer ready! 40+ features available', 'success');
}

// Start the application
init();

}); // End DOMContentLoaded
