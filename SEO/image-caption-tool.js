// ============================================
// FILE: image-caption-tool.js
// TiDB CONNECTED - Real Database
// ============================================

document.addEventListener('DOMContentLoaded', function() {

    // ========== API CONFIGURATION ==========
    const API_BASE = '/api';
    let sessionId = localStorage.getItem('caption_session');
    if (!sessionId) {
        sessionId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('caption_session', sessionId);
    }

    // ========== DOM ELEMENTS ==========
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const imagePreview = document.getElementById('imagePreview');
    const captionEditor = document.getElementById('captionEditor');
    const generateBtn = document.getElementById('generateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    const downloadPNGBtn = document.getElementById('downloadPNGBtn');
    const downloadJPGBtn = document.getElementById('downloadJPGBtn');
    const copyBtn = document.getElementById('copyBtn');
    const aiCaptionBtn = document.getElementById('aiCaptionBtn');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const adminPanelBtn = document.getElementById('adminPanelBtn');
    const pageShareBtn = document.getElementById('pageShareBtn');
    const outputContainer = document.getElementById('outputContainer');
    const outputContent = document.getElementById('outputContent');

    let uploadedImageData = null;
    let currentFilter = 'none';
    let history = [];
    let historyIndex = -1;

    // ========== TOAST ==========
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

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
            const result = await callAPI('tool-stats', 'GET', { tool_id: 19 });
            if (result.success) {
                document.getElementById('totalCaptions').textContent = result.usage || 0;
                document.getElementById('totalReactions').textContent = result.total_reactions || 0;
                document.getElementById('totalShares').textContent = result.total_shares || 0;
                document.getElementById('toolUsageCount').textContent = result.usage || 0;
                updateReactionDisplay(result.reactions || {});
            }
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    }

    async function incrementUsage() {
        try {
            const result = await callAPI('increment-usage', 'POST', { tool_id: 19 });
            if (result.success) {
                document.getElementById('totalCaptions').textContent = result.total_usage;
                document.getElementById('toolUsageCount').textContent = result.total_usage;
                showToast('Caption generation recorded!');
            }
        } catch (error) {
            showToast('Error recording usage', 'error');
        }
    }

    async function addReactionToTiDB(reaction) {
        try {
            const result = await callAPI('add-reaction', 'POST', { tool_id: 19, reaction_type: reaction });
            if (result.success) {
                showToast(getEmoji(reaction) + ' Reaction added!');
                await loadStats();
                return true;
            } else if (result.already_reacted) {
                showToast('You already reacted with this emoji!', 'error');
                return false;
            }
        } catch (error) {
            showToast('Error adding reaction', 'error');
            return false;
        }
    }

    async function addShareToTiDB(platform) {
        try {
            await callAPI('add-share', 'POST', { tool_id: 19, platform: platform });
            showToast(`Shared on ${platform}!`);
            await loadStats();
        } catch (error) {
            showToast('Error sharing', 'error');
        }
    }

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

    function getEmoji(reaction) {
        const emojis = { like: '👍', love: '❤️', wow: '😮', sad: '😢', angry: '😠', laugh: '😂', celebrate: '🎉' };
        return emojis[reaction] || '👍';
    }

    // ========== REACTIONS ==========
    function initReactions() {
        document.querySelectorAll('.reaction-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const reaction = btn.dataset.reaction;
                await addReactionToTiDB(reaction);
            });
        });
    }

    // ========== SOCIAL SHARES ==========
    function initSocialShares() {
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const platform = btn.dataset.platform;
                const url = window.location.href;
                let shareUrl = '';
                
                switch(platform) {
                    case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`; break;
                    case 'twitter': shareUrl = `https://twitter.com/intent/tweet?text=Image%20Caption%20Tool&url=${encodeURIComponent(url)}`; break;
                    case 'linkedin': shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`; break;
                    case 'whatsapp': shareUrl = `https://wa.me/?text=${encodeURIComponent('Image Caption Tool ' + url)}`; break;
                    case 'email': shareUrl = `mailto:?subject=Image Caption Tool&body=${encodeURIComponent(url)}`; break;
                }
                
                if (shareUrl) {
                    window.open(shareUrl, '_blank');
                    await addShareToTiDB(platform);
                }
            });
        });
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

    // ========== DARK MODE ==========
    darkModeToggle?.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        showToast('Theme changed!');
    });

    // ========== ADMIN PANEL ==========
    adminPanelBtn?.addEventListener('click', async () => {
        const panel = document.getElementById('adminPanel');
        if (panel.style.display === 'none') {
            panel.style.display = 'block';
            const stats = await callAPI('tool-stats', 'GET', { tool_id: 19 });
            document.getElementById('adminStats').innerHTML = `
                <p><strong>Total Captions:</strong> ${stats.usage || 0}</p>
                <p><strong>Total Reactions:</strong> ${stats.total_reactions || 0}</p>
                <p><strong>Total Shares:</strong> ${stats.total_shares || 0}</p>
            `;
            showToast('Admin Panel Opened');
        } else {
            panel.style.display = 'none';
        }
    });

    // ========== IMAGE UPLOAD ==========
    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileUpload);
    uploadArea.addEventListener('dragover', e => e.preventDefault());
    uploadArea.addEventListener('drop', e => {
        e.preventDefault();
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFileUpload();
        }
    });

    function handleFileUpload() {
        const file = fileInput.files[0];
        if (file && file.type.match('image.*')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedImageData = e.target.result;
                imagePreview.src = uploadedImageData;
                imagePreview.style.display = 'block';
                uploadArea.style.display = 'none';
                showToast('Image uploaded!');
            };
            reader.readAsDataURL(file);
        }
    }

    // ========== TEXT FORMATTING ==========
    window.formatText = function(command, value = null) {
        captionEditor.focus();
        if (command === 'foreColor' || command === 'fontSize') {
            document.execCommand(command, false, value);
        } else {
            document.execCommand(command, false, null);
        }
        saveToHistory();
    };

    // ========== HISTORY ==========
    function saveToHistory() {
        const content = captionEditor.innerHTML;
        if (history[historyIndex] !== content) {
            history = history.slice(0, historyIndex + 1);
            history.push(content);
            historyIndex++;
        }
    }

    undoBtn?.addEventListener('click', () => {
        if (historyIndex > 0) {
            historyIndex--;
            captionEditor.innerHTML = history[historyIndex];
        }
    });

    redoBtn?.addEventListener('click', () => {
        if (historyIndex < history.length - 1) {
            historyIndex++;
            captionEditor.innerHTML = history[historyIndex];
        }
    });

    // ========== APPLY FILTER ==========
    function applyFilterToImage(imgSrc, filter, callback) {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.filter = filter;
            ctx.drawImage(img, 0, 0);
            callback(canvas.toDataURL());
        };
        img.src = imgSrc;
    }

    // ========== AI CAPTION ==========
    aiCaptionBtn?.addEventListener('click', () => {
        const aiCaptions = [
            "✨ Life is beautiful! ✨", "💫 Dream big, work hard! 💫",
            "🌟 Make every moment count! 🌟", "💪 Stay positive, work hard! 💪",
            "🎯 Focus on your goals! 🎯", "❤️ Spread love and kindness! ❤️",
            "📸 Capturing memories! 📸", "🌈 Good vibes only! 🌈"
        ];
        const randomCaption = aiCaptions[Math.floor(Math.random() * aiCaptions.length)];
        captionEditor.innerHTML = randomCaption;
        saveToHistory();
        showToast('AI caption generated!');
    });

    // ========== APPLY TEMPLATE ==========
    function applyTemplate(style) {
        const text = captionEditor.innerText || 'Your Caption Here';
        let styledHtml = '';
        switch(style) {
            case 'modern':
                styledHtml = `<div style="font-family: 'Poppins', sans-serif; font-weight: 600; text-align: center; padding: 15px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border-radius: 12px;">${text}</div>`;
                break;
            case 'vintage':
                styledHtml = `<div style="font-family: 'Georgia', serif; font-style: italic; color: #8B7355; text-align: center; padding: 15px; background: #F5F0E8; border: 1px dashed #C4A882;">${text}</div>`;
                break;
            case 'elegant':
                styledHtml = `<div style="font-family: 'Garamond', serif; color: #333; text-align: center; padding: 15px; letter-spacing: 2px; border-bottom: 2px solid #D4AF37;">${text}</div>`;
                break;
            case 'bold':
                styledHtml = `<div style="font-family: 'Impact', sans-serif; color: white; text-align: center; padding: 15px; background: black; text-shadow: 2px 2px 4px #000;">${text}</div>`;
                break;
            case 'minimal':
                styledHtml = `<div style="font-family: 'Helvetica', sans-serif; color: #666; text-align: center; padding: 10px; font-weight: 300; letter-spacing: 1px;">${text}</div>`;
                break;
            case 'fun':
                styledHtml = `<div style="font-family: 'Comic Sans MS', cursive; color: #FF6B6B; text-align: center; padding: 15px; background: #FFF3E0; border-radius: 20px; border: 2px dotted #FFB347;">${text} 🎉</div>`;
                break;
            default:
                styledHtml = `<div style="padding: 10px;">${text}</div>`;
        }
        captionEditor.innerHTML = styledHtml;
        saveToHistory();
        showToast(`Applied ${style} template!`);
    }

    document.querySelectorAll('.template-card').forEach(card => {
        card.addEventListener('click', () => applyTemplate(card.dataset.template));
    });

    // ========== GENERATE CAPTION ==========
    generateBtn?.addEventListener('click', async () => {
        if (!uploadedImageData) {
            showToast('Please upload an image first!', 'error');
            return;
        }
        
        const captionHtml = captionEditor.innerHTML;
        if (!captionHtml.replace(/<[^>]*>/g, '').trim()) {
            showToast('Please enter a caption!', 'error');
            return;
        }
        
        outputContainer.style.display = 'block';
        outputContent.innerHTML = '<div class="spinner"></div>';
        
        let filterValue = 'none';
        switch(currentFilter) {
            case 'grayscale': filterValue = 'grayscale(100%)'; break;
            case 'sepia': filterValue = 'sepia(100%)'; break;
            case 'blur': filterValue = 'blur(2px)'; break;
            case 'brightness': filterValue = 'brightness(1.2)'; break;
            case 'contrast': filterValue = 'contrast(1.5)'; break;
            default: filterValue = 'none';
        }
        
        applyFilterToImage(uploadedImageData, filterValue, (filteredImg) => {
            outputContent.innerHTML = `
                <div style="text-align:center;">
                    <img src="${filteredImg}" style="max-width:100%; border-radius:12px;">
                    <div style="margin-top:15px;">${captionHtml}</div>
                </div>
            `;
            incrementUsage();
            showToast('Caption generated successfully!');
        });
    });

    // ========== FILTERS ==========
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            if (uploadedImageData) {
                let filterValue = 'none';
                switch(currentFilter) {
                    case 'grayscale': filterValue = 'grayscale(100%)'; break;
                    case 'sepia': filterValue = 'sepia(100%)'; break;
                    case 'blur': filterValue = 'blur(2px)'; break;
                    case 'brightness': filterValue = 'brightness(1.2)'; break;
                    case 'contrast': filterValue = 'contrast(1.5)'; break;
                    default: filterValue = 'none';
                }
                applyFilterToImage(uploadedImageData, filterValue, (filteredImg) => {
                    imagePreview.src = filteredImg;
                });
            }
            showToast(`Applied ${currentFilter} filter`);
        });
    });

    // ========== DOWNLOAD FUNCTIONS ==========
    downloadPNGBtn?.addEventListener('click', async () => {
        if (!outputContent.innerHTML || outputContent.innerHTML.includes('spinner')) {
            showToast('Generate caption first!', 'error');
            return;
        }
        const canvas = await html2canvas(outputContent);
        const link = document.createElement('a');
        link.download = 'captioned-image.png';
        link.href = canvas.toDataURL();
        link.click();
        showToast('PNG downloaded!');
    });

    downloadJPGBtn?.addEventListener('click', async () => {
        if (!outputContent.innerHTML || outputContent.innerHTML.includes('spinner')) {
            showToast('Generate caption first!', 'error');
            return;
        }
        const canvas = await html2canvas(outputContent);
        const link = document.createElement('a');
        link.download = 'captioned-image.jpg';
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.click();
        showToast('JPG downloaded!');
    });

    copyBtn?.addEventListener('click', async () => {
        if (!outputContent.innerHTML || outputContent.innerHTML.includes('spinner')) {
            showToast('Generate caption first!', 'error');
            return;
        }
        const canvas = await html2canvas(outputContent);
        canvas.toBlob(blob => {
            navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            showToast('Image copied to clipboard!');
        });
    });

    // ========== CLEAR ALL ==========
    clearBtn?.addEventListener('click', () => {
        fileInput.value = '';
        uploadedImageData = null;
        imagePreview.style.display = 'none';
        uploadArea.style.display = 'flex';
        captionEditor.innerHTML = '';
        outputContainer.style.display = 'none';
        outputContent.innerHTML = '';
        showToast('All cleared!');
    });

    // ========== INITIALIZE ==========
    initReactions();
    initSocialShares();
    loadStats();
    saveToHistory();
    showToast('Image Caption Tool Ready! Connected to TiDB', 'success');
});
