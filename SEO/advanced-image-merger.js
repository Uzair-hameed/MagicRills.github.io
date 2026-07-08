/* ========================================
   Advanced Image Merger - Complete JavaScript
   MagicRills.com
   Cloudflare Workers API Integration
   ======================================== */

// ========== CONFIGURATION ==========
const CONFIG = {
    API_BASE: 'https://magicrills-api.uzairhameed01.workers.dev',
    API_KEY: 'magicrills-grok-api.uzairhameed01.workers.dev',
    TOOL_SLUG: 'image-merger',
    TOOL_NAME: 'Advanced Image Merger',
    CATEGORY: 'Mixed-Tools',
    BACK_URL: 'https://magicrills.com/category-pages/mixed-tools.html',
    HOME_URL: 'https://magicrills.com'
};

// ========== STORAGE KEYS ==========
const STORAGE = {
    USAGE: 'magicrills_image_merger_usage',
    REACTIONS: 'magicrills_image_merger_reactions',
    SHARES: 'magicrills_image_merger_shares',
    STATS: 'magicrills_image_merger_stats'
};

// ========== GLOBAL STATE ==========
let images = [null, null];
let canvas = document.getElementById('finalCanvas');
let ctx = canvas.getContext('2d');
let textStyles = {
    bold1: false, italic1: false, underline1: false,
    bold2: false, italic2: false, underline2: false
};
let captionPositions = {1: 'bottom-center', 2: 'bottom-center'};
let reactionStates = {};
let statsCache = null;

// ========== DOM REFS ==========
const $ = (id) => document.getElementById(id);
const imageUpload1 = $('imageUpload1');
const imageUpload2 = $('imageUpload2');
const preview1 = $('preview1');
const preview2 = $('preview2');
const mergeBtn = $('mergeBtn');
const downloadBtn = $('downloadBtn');
const clearBtn = $('clearBtn');
const spacingInput = $('spacing');
const spacingValue = $('spacingValue');

// ========== API HELPER ==========
async function callAPI(endpoint, method = 'GET', body = null) {
    const url = `${CONFIG.API_BASE}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        'X-API-Key': CONFIG.API_KEY
    };
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);
    
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return { ok: response.ok, status: response.status, data };
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        return { ok: false, status: 0, data: null, error: error.message };
    }
}

// ========== TOAST SYSTEM ==========
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '<i class="fas fa-check-circle"></i>',
        error: '<i class="fas fa-exclamation-circle"></i>',
        info: '<i class="fas fa-info-circle"></i>'
    };
    
    toast.innerHTML = `
        ${icons[type] || icons.info}
        <div class="toast-content">${message}</div>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ========== SCROLL BUTTONS ==========
const scrollTopBtn = document.getElementById('scrollTopBtn');
const scrollBottomBtn = document.getElementById('scrollBottomBtn');

window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 200);
});

scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

scrollBottomBtn?.addEventListener('click', () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
});

// ========== NAVIGATION ==========
document.getElementById('backBtn')?.addEventListener('click', () => {
    window.location.href = CONFIG.BACK_URL;
});

document.getElementById('homeBtn')?.addEventListener('click', () => {
    window.location.href = CONFIG.HOME_URL;
});

// ========== COPY LINK ==========
document.getElementById('copyPageLink')?.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard!', 'success');
        await recordShare('copy-link');
    } catch (err) {
        showToast('Failed to copy link', 'error');
    }
});

// ========== SOCIAL SHARE ==========
document.querySelectorAll('.social-icon[data-platform]').forEach(btn => {
    btn.addEventListener('click', async () => {
        const platform = btn.dataset.platform;
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent('Advanced Image Merger - Merge images with captions');
        
        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
            whatsapp: `https://wa.me/?text=${title}%20${url}`,
            email: `mailto:?subject=${title}&body=${url}`
        };
        
        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
            await recordShare(platform);
            showToast(`Shared on ${platform}!`, 'success');
        }
    });
});

// ========== RECORD SHARE ==========
async function recordShare(platform) {
    const endpoint = '/api/shares';
    const body = {
        tool_slug: CONFIG.TOOL_SLUG,
        platform: platform,
        page_url: window.location.href
    };
    
    try {
        const result = await callAPI(endpoint, 'POST', body);
        if (result.ok) {
            updateLocalStats('shares', 1);
            await loadStats();
        } else {
            // Fallback: localStorage
            updateLocalStats('shares', 1);
        }
    } catch (error) {
        console.error('Share recording error:', error);
        updateLocalStats('shares', 1);
    }
}

// ========== LOCAL STORAGE FALLBACK ==========
function getLocalStats() {
    try {
        const data = localStorage.getItem(STORAGE.STATS);
        return data ? JSON.parse(data) : { usage: 0, views: 0, shares: 0, followers: 0 };
    } catch { return { usage: 0, views: 0, shares: 0, followers: 0 }; }
}

function updateLocalStats(key, value) {
    try {
        const stats = getLocalStats();
        stats[key] = (stats[key] || 0) + value;
        localStorage.setItem(STORAGE.STATS, JSON.stringify(stats));
        updateStatsUI(stats);
    } catch (error) {
        console.error('Local stats update error:', error);
    }
}

function updateStatsUI(stats) {
    document.getElementById('usageCount').textContent = stats.usage || 0;
    document.getElementById('viewCount').textContent = stats.views || 0;
    document.getElementById('shareCount').textContent = stats.shares || 0;
    document.getElementById('followerCount').textContent = stats.followers || 0;
}

// ========== LOAD STATS ==========
async function loadStats() {
    const endpoint = `/api/stats?tool_slug=${CONFIG.TOOL_SLUG}`;
    
    try {
        const result = await callAPI(endpoint, 'GET');
        if (result.ok && result.data) {
            statsCache = result.data;
            const stats = {
                usage: result.data.usage_count || 0,
                views: result.data.view_count || 0,
                shares: result.data.share_count || 0,
                followers: result.data.follower_count || 0
            };
            updateStatsUI(stats);
            // Also update local cache
            localStorage.setItem(STORAGE.STATS, JSON.stringify(stats));
        } else {
            // Fallback to localStorage
            const localStats = getLocalStats();
            updateStatsUI(localStats);
        }
    } catch (error) {
        console.error('Load stats error:', error);
        const localStats = getLocalStats();
        updateStatsUI(localStats);
    }
}

// ========== TRACK USAGE ==========
async function trackUsage() {
    const endpoint = '/api/usage';
    const body = {
        tool_slug: CONFIG.TOOL_SLUG,
        tool_name: CONFIG.TOOL_NAME,
        category: CONFIG.CATEGORY
    };
    
    try {
        const result = await callAPI(endpoint, 'POST', body);
        if (result.ok && result.data) {
            updateLocalStats('usage', 1);
            await loadStats();
        } else {
            updateLocalStats('usage', 1);
        }
    } catch (error) {
        console.error('Usage tracking error:', error);
        updateLocalStats('usage', 1);
    }
}

// ========== TRACK VIEW ==========
async function trackView() {
    // Only track once per session
    if (sessionStorage.getItem('magicrills_view_tracked')) return;
    sessionStorage.setItem('magicrills_view_tracked', 'true');
    
    const endpoint = '/api/usage';
    const body = {
        tool_slug: CONFIG.TOOL_SLUG,
        tool_name: CONFIG.TOOL_NAME,
        category: CONFIG.CATEGORY,
        type: 'view'
    };
    
    try {
        const result = await callAPI(endpoint, 'POST', body);
        if (result.ok && result.data) {
            updateLocalStats('views', 1);
            await loadStats();
        } else {
            updateLocalStats('views', 1);
        }
    } catch (error) {
        console.error('View tracking error:', error);
        updateLocalStats('views', 1);
    }
}

// ========== LOAD REACTIONS ==========
async function loadReactions() {
    const endpoint = `/api/reactions?tool_slug=${CONFIG.TOOL_SLUG}`;
    
    try {
        const result = await callAPI(endpoint, 'GET');
        if (result.ok && result.data) {
            const reactions = result.data;
            for (const [key, count] of Object.entries(reactions)) {
                const el = document.getElementById(`${key}Count`);
                if (el) el.textContent = count;
            }
            // Cache reactions
            localStorage.setItem(STORAGE.REACTIONS, JSON.stringify(reactions));
        } else {
            // Fallback to localStorage
            try {
                const cached = JSON.parse(localStorage.getItem(STORAGE.REACTIONS) || '{}');
                for (const [key, count] of Object.entries(cached)) {
                    const el = document.getElementById(`${key}Count`);
                    if (el) el.textContent = count;
                }
            } catch {}
        }
    } catch (error) {
        console.error('Load reactions error:', error);
    }
}

// ========== ADD REACTION ==========
async function addReaction(reactionType) {
    const endpoint = '/api/reactions';
    const body = {
        tool_slug: CONFIG.TOOL_SLUG,
        reaction_type: reactionType
    };
    
    // Optimistic update
    const countEl = document.getElementById(`${reactionType}Count`);
    const currentCount = parseInt(countEl?.textContent || '0');
    if (countEl) countEl.textContent = currentCount + 1;
    
    try {
        const result = await callAPI(endpoint, 'POST', body);
        if (result.ok && result.data) {
            const count = result.data.count || 0;
            if (countEl) countEl.textContent = count;
            showToast(`Reaction added! 👍`, 'success');
            
            // Update cache
            try {
                const cached = JSON.parse(localStorage.getItem(STORAGE.REACTIONS) || '{}');
                cached[reactionType] = count;
                localStorage.setItem(STORAGE.REACTIONS, JSON.stringify(cached));
            } catch {}
        } else if (result.status === 409) {
            // Already reacted
            if (countEl) countEl.textContent = currentCount;
            showToast(`You already reacted with ${reactionType}!`, 'info');
        } else {
            // Revert optimistic update
            if (countEl) countEl.textContent = currentCount;
            showToast('Failed to add reaction', 'error');
        }
    } catch (error) {
        console.error('Add reaction error:', error);
        // Revert optimistic update
        if (countEl) countEl.textContent = currentCount;
        showToast('Failed to add reaction', 'error');
    }
}

// ========== REACTION BUTTON LISTENERS ==========
document.querySelectorAll('.reaction-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const reaction = btn.dataset.reaction;
        if (reaction) addReaction(reaction);
    });
});

// ========== IMAGE LOAD ==========
function loadImage(e, index) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    const preview = document.getElementById(`preview${index + 1}`);
    preview.innerHTML = '<div class="loading"></div><span>Loading...</span>';
    
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            images[index] = img;
            preview.innerHTML = '';
            const previewImg = document.createElement('img');
            previewImg.src = event.target.result;
            preview.appendChild(previewImg);
            showToast(`Image ${index + 1} loaded successfully!`, 'success');
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

imageUpload1?.addEventListener('change', (e) => loadImage(e, 0));
imageUpload2?.addEventListener('change', (e) => loadImage(e, 1));

// ========== PREVIEW CLICK TO UPLOAD ==========
preview1?.addEventListener('click', () => imageUpload1?.click());
preview2?.addEventListener('click', () => imageUpload2?.click());

// ========== STYLE TOGGLE ==========
function toggleStyle(styleId) {
    textStyles[styleId] = !textStyles[styleId];
    const btn = document.getElementById(styleId);
    if (btn) btn.classList.toggle('active');
}

document.querySelectorAll('.style-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const styleId = btn.id;
        if (styleId) toggleStyle(styleId);
    });
});

// ========== CAPTION POSITION ==========
function setCaptionPos(btn, imgNum) {
    const pos = btn.getAttribute('data-pos');
    captionPositions[imgNum] = pos;
    
    const container = btn.parentElement;
    container.querySelectorAll('.pos-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

document.querySelectorAll('.caption-position').forEach(container => {
    const imgNum = container.getAttribute('data-img');
    container.querySelectorAll('.pos-btn').forEach(btn => {
        btn.addEventListener('click', () => setCaptionPos(btn, imgNum));
    });
});

// ========== SPACING DISPLAY ==========
spacingInput?.addEventListener('input', () => {
    spacingValue.textContent = spacingInput.value + 'px';
});

// ========== APPLY CROP ==========
function applyCrop(img, ratio) {
    if (ratio === 'none') return img;
    
    const ratios = {'1:1': 1, '4:3': 4/3, '16:9': 16/9, '3:4': 3/4};
    const targetRatio = ratios[ratio];
    const c = document.createElement('canvas');
    const cx = c.getContext('2d');
    const imgRatio = img.width / img.height;
    
    let sx = 0, sy = 0, sw = img.width, sh = img.height;
    
    if ((ratio === '3:4' && imgRatio > targetRatio) || (ratio !== '3:4' && imgRatio > targetRatio)) {
        sw = img.height * targetRatio;
        sx = (img.width - sw) / 2;
    } else if ((ratio === '3:4' && imgRatio < targetRatio) || (ratio !== '3:4' && imgRatio < targetRatio)) {
        sh = img.width / targetRatio;
        sy = (img.height - sh) / 2;
    }
    
    c.width = ratio === '3:4' ? img.height * targetRatio : img.width;
    c.height = ratio === '3:4' ? img.height : img.width / targetRatio;
    cx.drawImage(img, sx, sy, sw, sh, 0, 0, c.width, c.height);
    
    const newImg = new Image();
    newImg.src = c.toDataURL();
    return newImg;
}

// ========== RESIZE IMAGE ==========
function resizeImage(img, width, height) {
    const c = document.createElement('canvas');
    c.width = width;
    c.height = height;
    const cx = c.getContext('2d');
    cx.drawImage(img, 0, 0, width, height);
    const newImg = new Image();
    newImg.src = c.toDataURL();
    return newImg;
}

// ========== APPLY FILTER ==========
function applyFilter(cx, canvas, filter) {
    const imageData = cx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    if (filter === 'grayscale') {
        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;
            data[i + 1] = avg;
            data[i + 2] = avg;
        }
    } else if (filter === 'sepia') {
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2];
            data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
            data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
            data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
        }
    } else if (filter === 'brightness') {
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.2);
            data[i + 1] = Math.min(255, data[i + 1] * 1.2);
            data[i + 2] = Math.min(255, data[i + 2] * 1.2);
        }
    } else if (filter === 'contrast') {
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, 128 + (data[i] - 128) * 1.5);
            data[i + 1] = Math.min(255, 128 + (data[i + 1] - 128) * 1.5);
            data[i + 2] = Math.min(255, 128 + (data[i + 2] - 128) * 1.5);
        }
    } else if (filter === 'invert') {
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
        }
    }
    
    cx.putImageData(imageData, 0, 0);
}

// ========== DRAW IMAGE WITH BORDER ==========
function drawImageWithBorder(img, filter, borderStyle, borderColor, x, y) {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    tempCtx.drawImage(img, 0, 0);
    
    if (filter !== 'none') {
        applyFilter(tempCtx, tempCanvas, filter);
    }
    
    if (borderStyle !== 'none') {
        tempCtx.strokeStyle = borderColor;
        tempCtx.lineWidth = 3;
        
        if (borderStyle === 'dashed') {
            tempCtx.setLineDash([8, 8]);
        } else if (borderStyle === 'shadow') {
            tempCtx.shadowColor = 'rgba(0,0,0,0.5)';
            tempCtx.shadowBlur = 10;
            tempCtx.shadowOffsetX = 5;
            tempCtx.shadowOffsetY = 5;
        }
        
        tempCtx.strokeRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        if (borderStyle === 'shadow') {
            tempCtx.shadowColor = 'transparent';
        }
    }
    
    ctx.drawImage(tempCanvas, x, y);
}

// ========== DRAW CAPTION ==========
function drawCaption(imgNum, imgWidth, imgHeight, offsetX, offsetY) {
    const caption = document.getElementById(`caption${imgNum}`).value;
    if (!caption) return;
    
    const fontFamily = document.getElementById(`font${imgNum}`).value;
    const fontSize = parseInt(document.getElementById(`size${imgNum}`).value);
    const color = document.getElementById(`color${imgNum}`).value;
    const textBgColor = document.getElementById(`textBgColor${imgNum}`).value;
    const textBgOpacity = parseFloat(document.getElementById(`textBgOpacity${imgNum}`)?.value || 0.7);
    const bold = textStyles[`bold${imgNum}`];
    const italic = textStyles[`italic${imgNum}`];
    const underline = textStyles[`underline${imgNum}`];
    const pos = captionPositions[imgNum];
    
    let fontStyle = '';
    if (bold) fontStyle += 'bold ';
    if (italic) fontStyle += 'italic ';
    fontStyle += `${fontSize}px ${fontFamily}`;
    
    ctx.font = fontStyle;
    ctx.fillStyle = color;
    
    const textMetrics = ctx.measureText(caption);
    const textWidth = textMetrics.width;
    
    let x, y, textAlign, textBaseline;
    
    switch(pos) {
        case 'top-left':
            x = offsetX + 15;
            y = offsetY + fontSize + 10;
            textAlign = 'left';
            textBaseline = 'top';
            break;
        case 'top-center':
            x = offsetX + imgWidth / 2;
            y = offsetY + fontSize + 10;
            textAlign = 'center';
            textBaseline = 'top';
            break;
        case 'top-right':
            x = offsetX + imgWidth - 15;
            y = offsetY + fontSize + 10;
            textAlign = 'right';
            textBaseline = 'top';
            break;
        case 'middle-left':
            x = offsetX + 15;
            y = offsetY + imgHeight / 2;
            textAlign = 'left';
            textBaseline = 'middle';
            break;
        case 'middle-right':
            x = offsetX + imgWidth - 15;
            y = offsetY + imgHeight / 2;
            textAlign = 'right';
            textBaseline = 'middle';
            break;
        case 'bottom-left':
            x = offsetX + 15;
            y = offsetY + imgHeight - 10;
            textAlign = 'left';
            textBaseline = 'bottom';
            break;
        case 'bottom-center':
            x = offsetX + imgWidth / 2;
            y = offsetY + imgHeight - 10;
            textAlign = 'center';
            textBaseline = 'bottom';
            break;
        case 'bottom-right':
            x = offsetX + imgWidth - 15;
            y = offsetY + imgHeight - 10;
            textAlign = 'right';
            textBaseline = 'bottom';
            break;
        default:
            x = offsetX + imgWidth / 2;
            y = offsetY + imgHeight - 10;
            textAlign = 'center';
            textBaseline = 'bottom';
    }
    
    // Draw background with opacity
    if (textBgColor !== '#ffffff00') {
        const padding = 8;
        const bgHeight = fontSize + padding * 2;
        let bgY = y;
        
        if (textBaseline === 'top') {
            bgY = y - padding;
        } else if (textBaseline === 'middle') {
            bgY = y - fontSize/2 - padding;
        } else if (textBaseline === 'bottom') {
            bgY = y - fontSize - padding;
        }
        
        ctx.save();
        ctx.globalAlpha = textBgOpacity;
        ctx.fillStyle = textBgColor;
        
        if (textAlign === 'left') {
            ctx.fillRect(x - padding, bgY, textWidth + padding * 2, bgHeight);
        } else if (textAlign === 'center') {
            ctx.fillRect(x - textWidth/2 - padding, bgY, textWidth + padding * 2, bgHeight);
        } else if (textAlign === 'right') {
            ctx.fillRect(x - textWidth - padding, bgY, textWidth + padding * 2, bgHeight);
        }
        
        ctx.restore();
    }
    
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.fillStyle = color;
    ctx.fillText(caption, x, y);
    
    // Draw underline
    if (underline) {
        const underlineY = y + 3;
        let underlineX1 = x, underlineX2 = x;
        
        if (textAlign === 'left') {
            underlineX1 = x;
            underlineX2 = x + textWidth;
        } else if (textAlign === 'center') {
            underlineX1 = x - textWidth/2;
            underlineX2 = x + textWidth/2;
        } else if (textAlign === 'right') {
            underlineX1 = x - textWidth;
            underlineX2 = x;
        }
        
        ctx.beginPath();
        ctx.moveTo(underlineX1, underlineY);
        ctx.lineTo(underlineX2, underlineY);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

// ========== MERGE IMAGES ==========
async function mergeImages() {
    if (!images[0] || !images[1]) {
        showToast('Please upload both images first!', 'error');
        return;
    }
    
    // Track usage when merge is performed
    await trackUsage();
    
    const layout = document.querySelector("input[name='layout']:checked").value;
    const ratio = document.getElementById('cropRatio').value;
    const bgColor = document.getElementById('bgColor').value;
    const filter = document.getElementById('imageFilter').value;
    const borderStyle = document.getElementById('imageBorder').value;
    const borderColor = document.getElementById('borderColor').value;
    const spacing = parseInt(document.getElementById('spacing').value);
    const equalSize = document.getElementById('equalSize').checked;
    
    let img1 = applyCrop(images[0], ratio);
    let img2 = applyCrop(images[1], ratio);
    let width, height;
    
    if (equalSize) {
        const maxWidth = Math.max(img1.width, img2.width);
        const maxHeight = Math.max(img1.height, img2.height);
        img1 = resizeImage(img1, maxWidth, maxHeight);
        img2 = resizeImage(img2, maxWidth, maxHeight);
    }
    
    if (layout === 'horizontal') {
        width = img1.width + img2.width + spacing;
        height = Math.max(img1.height, img2.height);
    } else {
        width = Math.max(img1.width, img2.width);
        height = img1.height + img2.height + spacing;
    }
    
    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    
    if (layout === 'horizontal') {
        drawImageWithBorder(img1, filter, borderStyle, borderColor, 0, (height - img1.height) / 2);
        drawImageWithBorder(img2, filter, borderStyle, borderColor, img1.width + spacing, (height - img2.height) / 2);
        drawCaption(1, img1.width, img1.height, 0, (height - img1.height) / 2);
        drawCaption(2, img2.width, img2.height, img1.width + spacing, (height - img2.height) / 2);
    } else {
        drawImageWithBorder(img1, filter, borderStyle, borderColor, (width - img1.width) / 2, 0);
        drawImageWithBorder(img2, filter, borderStyle, borderColor, (width - img2.width) / 2, img1.height + spacing);
        drawCaption(1, img1.width, img1.height, (width - img1.width) / 2, 0);
        drawCaption(2, img2.width, img2.height, (width - img2.width) / 2, img1.height + spacing);
    }
    
    downloadBtn.disabled = false;
    showToast('Images merged successfully!', 'success');
}

// ========== DOWNLOAD IMAGE ==========
function downloadImage() {
    const link = document.createElement('a');
    link.download = `merged-image-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Image downloaded successfully!', 'success');
}

// ========== CLEAR ALL ==========
function clearAll() {
    images = [null, null];
    
    preview1.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><span>Click to upload image</span>';
    preview2.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><span>Click to upload image</span>';
    
    imageUpload1.value = '';
    imageUpload2.value = '';
    
    document.getElementById('caption1').value = '';
    document.getElementById('caption2').value = '';
    
    textStyles = {
        bold1: false, italic1: false, underline1: false,
        bold2: false, italic2: false, underline2: false
    };
    document.querySelectorAll('.style-btn').forEach(btn => btn.classList.remove('active'));
    
    captionPositions = {1: 'bottom-center', 2: 'bottom-center'};
    document.querySelectorAll('.pos-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-pos') === 'bottom-center') {
            btn.classList.add('active');
        }
    });
    
    document.getElementById('textBgColor1').value = '#1a2332';
    document.getElementById('textBgColor2').value = '#1a2332';
    if (document.getElementById('textBgOpacity1')) document.getElementById('textBgOpacity1').value = 0.7;
    if (document.getElementById('textBgOpacity2')) document.getElementById('textBgOpacity2').value = 0.7;
    
    document.getElementById('layoutHorizontal').checked = true;
    spacingInput.value = 10;
    spacingValue.textContent = '10px';
    document.getElementById('equalSize').checked = true;
    document.getElementById('cropRatio').value = 'none';
    document.getElementById('bgColor').value = '#0a0e17';
    document.getElementById('imageFilter').value = 'none';
    document.getElementById('imageBorder').value = 'none';
    document.getElementById('borderColor').value = '#00d4ff';
    
    document.getElementById('font1').value = 'Arial';
    document.getElementById('font2').value = 'Arial';
    document.getElementById('size1').value = '24';
    document.getElementById('size2').value = '24';
    document.getElementById('color1').value = '#ffffff';
    document.getElementById('color2').value = '#ffffff';
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = 0;
    canvas.height = 0;
    
    downloadBtn.disabled = true;
    showToast('All data cleared!', 'info');
}

// ========== EVENT LISTENERS ==========
mergeBtn?.addEventListener('click', mergeImages);
downloadBtn?.addEventListener('click', downloadImage);
clearBtn?.addEventListener('click', clearAll);

// ========== INITIALIZE ==========
async function init() {
    // Load stats from API
    await loadStats();
    
    // Load reactions from API
    await loadReactions();
    
    // Track view (once per session)
    await trackView();
    
    showToast('Welcome to Advanced Image Merger! 🎨', 'info');
}

// Run initialization
init();

// ========== EXPOSE FOR DEBUGGING ==========
if (typeof window !== 'undefined') {
    window.__tool = {
        CONFIG,
        images,
        stats: getLocalStats,
        trackUsage,
        addReaction,
        loadStats,
        loadReactions
    };
}
