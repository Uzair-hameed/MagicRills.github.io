/* favicon-generator.js - TiDB Connected */

document.addEventListener('DOMContentLoaded', function() {

    // ========== API CONFIGURATION ==========
    const API_BASE = '/api';
    let sessionId = localStorage.getItem('fav_session');
    if (!sessionId) {
        sessionId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('fav_session', sessionId);
    }

    // DOM Elements
    const canvas = document.getElementById('faviconCanvas');
    const ctx = canvas.getContext('2d');
    const appleCanvas = document.getElementById('appleCanvas');
    const appleCtx = appleCanvas.getContext('2d');
    const favText = document.getElementById('favText');
    const textColor = document.getElementById('textColor');
    const bgColor = document.getElementById('bgColor');
    const shapeType = document.getElementById('shapeType');
    const generateBtn = document.getElementById('generateBtn');
    const downloadPNG = document.getElementById('downloadPNG');
    const downloadICO = document.getElementById('downloadICO');
    const downloadZIP = document.getElementById('downloadZIP');
    const downloadApple = document.getElementById('downloadApple');
    const copyHtmlBtn = document.getElementById('copyHtmlBtn');
    const htmlCode = document.getElementById('htmlCode');
    const pageShareBtn = document.getElementById('pageShareBtn');

    // ========== TIDB API CALLS ==========
    
    async function callAPI(endpoint, method = 'GET', data = {}) {
        try {
            const url = new URL(`${API_BASE}/${endpoint}`);
            if (method === 'GET') {
                Object.keys(data).forEach(key => url.searchParams.append(key, data[key]));
            }
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: method === 'POST' ? JSON.stringify({ ...data, session_id: sessionId }) : undefined
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, error: error.message };
        }
    }

    async function loadStats() {
        try {
            const result = await callAPI('tool-stats', 'GET', { tool_id: 18 });
            if (result.success) {
                document.getElementById('totalGenerations').textContent = result.usage || 0;
                document.getElementById('totalReactions').textContent = result.total_reactions || 0;
                document.getElementById('totalShares').textContent = result.total_shares || 0;
                document.getElementById('toolUsageCount').textContent = result.usage || 0;
                updateReactionDisplay(result.reactions || {});
            }
        } catch (error) {
            console.error('Failed to load stats:', error);
            loadLocalFallback();
        }
    }

    function loadLocalFallback() {
        const usage = localStorage.getItem('fav_usage') || '0';
        const reactions = JSON.parse(localStorage.getItem('fav_reactions') || '{}');
        const shares = localStorage.getItem('fav_shares') || '0';
        document.getElementById('totalGenerations').textContent = usage;
        document.getElementById('toolUsageCount').textContent = usage;
        document.getElementById('totalShares').textContent = shares;
        updateReactionDisplay(reactions);
    }

    async function incrementUsage() {
        try {
            const result = await callAPI('increment-usage', 'POST', { tool_id: 18 });
            if (result.success) {
                document.getElementById('totalGenerations').textContent = result.total_usage;
                document.getElementById('toolUsageCount').textContent = result.total_usage;
                showToast('Generation recorded!');
            }
        } catch (error) {
            let usage = parseInt(localStorage.getItem('fav_usage') || '0');
            usage++;
            localStorage.setItem('fav_usage', usage);
            document.getElementById('totalGenerations').textContent = usage;
            document.getElementById('toolUsageCount').textContent = usage;
            showToast('Generation recorded (offline mode)');
        }
    }

    async function addReactionToTiDB(reaction) {
        try {
            const result = await callAPI('add-reaction', 'POST', { tool_id: 18, reaction_type: reaction });
            if (result.success) {
                showToast(getReactionEmoji(reaction) + ' Reaction added!');
                await loadStats();
                return true;
            } else if (result.already_reacted) {
                showToast('You already reacted with this emoji!', 'error');
                return false;
            }
        } catch (error) {
            showToast(getReactionEmoji(reaction) + ' Reaction added (offline)!');
            return true;
        }
    }

    async function addShareToTiDB(platform) {
        try {
            await callAPI('add-share', 'POST', { tool_id: 18, platform: platform });
            showToast(`Shared on ${platform}!`);
            await loadStats();
        } catch (error) {
            let shares = parseInt(localStorage.getItem('fav_shares') || '0');
            shares++;
            localStorage.setItem('fav_shares', shares);
            showToast(`Shared on ${platform} (offline)!`);
        }
    }

    // ========== DRAW FUNCTIONS ==========
    function drawFavicon() {
        const size = 200;
        canvas.width = size;
        canvas.height = size;
        
        const text = favText.value.toUpperCase() || 'F';
        const shape = shapeType.value;
        let bg = bgColor.value;
        let textCol = textColor.value;
        
        ctx.clearRect(0, 0, size, size);
        ctx.fillStyle = bg;
        
        if (shape === 'circle') {
            ctx.beginPath();
            ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
            ctx.fill();
        } else if (shape === 'rounded') {
            const radius = size * 0.15;
            ctx.beginPath();
            ctx.moveTo(radius, 0);
            ctx.lineTo(size - radius, 0);
            ctx.quadraticCurveTo(size, 0, size, radius);
            ctx.lineTo(size, size - radius);
            ctx.quadraticCurveTo(size, size, size - radius, size);
            ctx.lineTo(radius, size);
            ctx.quadraticCurveTo(0, size, 0, size - radius);
            ctx.lineTo(0, radius);
            ctx.quadraticCurveTo(0, 0, radius, 0);
            ctx.fill();
        } else {
            ctx.fillRect(0, 0, size, size);
        }
        
        ctx.fillStyle = textCol;
        ctx.font = `bold ${size * 0.45}px Inter, Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, size/2, size/2);
        
        drawAppleIcon();
        updateHtmlCode();
    }

    function drawAppleIcon() {
        const size = 180;
        appleCanvas.width = size;
        appleCanvas.height = size;
        const text = favText.value.toUpperCase() || 'F';
        
        appleCtx.clearRect(0, 0, size, size);
        appleCtx.fillStyle = bgColor.value;
        appleCtx.fillRect(0, 0, size, size);
        appleCtx.fillStyle = textColor.value;
        appleCtx.font = `bold ${size * 0.4}px Inter, Arial`;
        appleCtx.textAlign = 'center';
        appleCtx.textBaseline = 'middle';
        appleCtx.fillText(text, size/2, size/2);
    }

    function updateHtmlCode() {
        const canvasData = canvas.toDataURL('image/png');
        const appleData = appleCanvas.toDataURL('image/png');
        const code = `<link rel="icon" type="image/png" sizes="256x256" href="${canvasData}">\n<link rel="apple-touch-icon" sizes="180x180" href="${appleData}">`;
        htmlCode.textContent = code;
    }

    // ========== REACTIONS UI ==========
    function updateReactionDisplay(reactions) {
        document.querySelectorAll('.reaction-btn').forEach(btn => {
            const reaction = btn.dataset.reaction;
            const countSpan = btn.querySelector('.reaction-count');
            if (countSpan && reactions[reaction] !== undefined) {
                countSpan.textContent = reactions[reaction];
            }
        });
        let total = Object.values(reactions).reduce((a, b) => a + b, 0);
        document.getElementById('totalReactions').textContent = total;
    }

    function initReactions() {
        document.querySelectorAll('.reaction-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const reaction = btn.dataset.reaction;
                await addReactionToTiDB(reaction);
            });
        });
    }

    function getReactionEmoji(reaction) {
        const emojis = { like: '👍', love: '❤️', wow: '😮', sad: '😢', angry: '😠', laugh: '😂', celebrate: '🎉' };
        return emojis[reaction] || '👍';
    }

    // ========== SOCIAL SHARES ==========
    function initSocialShares() {
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const platform = btn.dataset.platform;
                const toolName = 'Favicon Generator';
                const url = window.location.href;
                let shareUrl = '';
                
                switch(platform) {
                    case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`; break;
                    case 'twitter': shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(toolName)}&url=${encodeURIComponent(url)}`; break;
                    case 'linkedin': shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`; break;
                    case 'whatsapp': shareUrl = `https://wa.me/?text=${encodeURIComponent(toolName + ' ' + url)}`; break;
                    case 'email': shareUrl = `mailto:?subject=${encodeURIComponent(toolName)}&body=${encodeURIComponent(url)}`; break;
                }
                
                if (shareUrl) {
                    window.open(shareUrl, '_blank');
                    await addShareToTiDB(platform);
                }
            });
        });
    }

    // ========== DOWNLOAD FUNCTIONS ==========
    function downloadPNGFn() {
        const link = document.createElement('a');
        link.download = 'favicon.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast('PNG downloaded!');
    }

    function downloadICOFn() {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 32;
        tempCanvas.height = 32;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(canvas, 0, 0, 32, 32);
        const link = document.createElement('a');
        link.download = 'favicon.ico';
        link.href = tempCanvas.toDataURL('image/x-icon');
        link.click();
        showToast('ICO downloaded!');
    }

    function downloadZIPFn() {
        incrementUsage();
        showToast('ZIP containing all sizes (16,32,64,128,256) would be downloaded here.');
    }

    function downloadAppleFn() {
        const link = document.createElement('a');
        link.download = 'apple-touch-icon.png';
        link.href = appleCanvas.toDataURL('image/png');
        link.click();
        showToast('Apple Touch Icon downloaded!');
    }

    function copyHtmlFn() {
        navigator.clipboard.writeText(htmlCode.textContent);
        showToast('HTML code copied!');
    }

    // ========== TOAST ==========
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // ========== SCROLL BUTTONS ==========
    const scrollUp = document.getElementById('scrollUpBtn');
    const scrollDown = document.getElementById('scrollDownBtn');
    
    window.addEventListener('scroll', () => {
        if (scrollUp) {
            if (window.scrollY > 200) scrollUp.style.display = 'block';
            else scrollUp.style.display = 'none';
        }
    });
    scrollUp?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    scrollDown?.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));

    // ========== PAGE SHARE ==========
    pageShareBtn?.addEventListener('click', async () => {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Page link copied!');
    });

    // ========== EVENT LISTENERS ==========
    favText.addEventListener('input', drawFavicon);
    textColor.addEventListener('input', drawFavicon);
    bgColor.addEventListener('input', drawFavicon);
    shapeType.addEventListener('change', drawFavicon);
    generateBtn.addEventListener('click', () => {
        drawFavicon();
        incrementUsage();
        showToast('Favicon generated!');
    });
    downloadPNG.addEventListener('click', downloadPNGFn);
    downloadICO.addEventListener('click', downloadICOFn);
    downloadZIP.addEventListener('click', downloadZIPFn);
    downloadApple.addEventListener('click', downloadAppleFn);
    copyHtmlBtn.addEventListener('click', copyHtmlFn);

    // ========== INITIALIZE ==========
    drawFavicon();
    initReactions();
    initSocialShares();
    loadStats();
    showToast('Favicon Generator Ready! Connected to TiDB', 'success');
});
