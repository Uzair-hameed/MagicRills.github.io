// ============================================
// FILE: image-caption-tool.js
// CLOUDFLARE WORKERS API - Magic Rills
// ============================================

document.addEventListener('DOMContentLoaded', function() {

    // ========== API CONFIGURATION ==========
    const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';
    const TOOL_SLUG = 'image-caption-tool';
    const TOOL_ID = 19;
    
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
    const downloadWebPBtn = document.getElementById('downloadWebPBtn');
    const copyBtn = document.getElementById('copyBtn');
    const aiCaptionBtn = document.getElementById('aiCaptionBtn');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const adminPanelBtn = document.getElementById('adminPanelBtn');
    const closeAdminBtn = document.getElementById('closeAdminBtn');
    const pageShareBtn = document.getElementById('pageShareBtn');
    const outputContainer = document.getElementById('outputContainer');
    const outputContent = document.getElementById('outputContent');

    let uploadedImageData = null;
    let currentFilter = 'none';
    let history = [];
    let historyIndex = -1;
    let currentFont = 'english';
    let isGenerating = false;

    // ========== TYPEWRITER EFFECT ==========
    const typewriterTexts = [
        '✨ Urdu Support ✨',
        '📸 AI Powered',
        '🎨 Beautiful Designs',
        '🚀 Real-time',
        '💫 Professional'
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typewriterElement = document.getElementById('typewriterText');

    function typeWriter() {
        const currentText = typewriterTexts[textIndex];
        if (isDeleting) {
            typewriterElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentText.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typewriterTexts.length;
            speed = 500;
        }

        setTimeout(typeWriter, speed);
    }
    typeWriter();

    // ========== TOAST SYSTEM ==========
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icon = type === 'success' ? 'fa-check-circle' : 
                     type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
        toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ========== CLOUDFLARE API CALLS ==========
    async function callAPI(endpoint, method = 'GET', data = {}) {
        try {
            const url = `${API_BASE}${endpoint}`;
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-Id': sessionId,
                    'X-Tool-Slug': TOOL_SLUG
                }
            };
            if (method === 'POST' && Object.keys(data).length > 0) {
                options.body = JSON.stringify(data);
            }
            const response = await fetch(url, options);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, error: error.message };
        }
    }

    // ========== LOAD STATS FROM API ==========
    async function loadStats() {
        try {
            // Try to get from API first
            const result = await callAPI(`/api/stats?tool_slug=${TOOL_SLUG}`, 'GET');
            
            if (result.success && result.data) {
                const stats = result.data;
                updateStatsUI(stats);
                // Save to localStorage as fallback
                localStorage.setItem('caption_tool_stats', JSON.stringify(stats));
                return stats;
            } else {
                // Fallback: use localStorage
                const cached = localStorage.getItem('caption_tool_stats');
                if (cached) {
                    const stats = JSON.parse(cached);
                    updateStatsUI(stats);
                    return stats;
                }
            }
        } catch (error) {
            console.error('Failed to load stats:', error);
            // Try localStorage fallback
            const cached = localStorage.getItem('caption_tool_stats');
            if (cached) {
                const stats = JSON.parse(cached);
                updateStatsUI(stats);
                return stats;
            }
        }
        return null;
    }

    function updateStatsUI(stats) {
        document.getElementById('totalUsage').textContent = stats.total_usage || 0;
        document.getElementById('totalReactions').textContent = stats.total_reactions || 0;
        document.getElementById('totalShares').textContent = stats.total_shares || 0;
        document.getElementById('totalFollowers').textContent = stats.total_followers || 0;
        document.getElementById('toolUsageCount').textContent = stats.total_usage || 0;
        
        // Admin stats
        document.getElementById('adminUsage').textContent = stats.total_usage || 0;
        document.getElementById('adminReactions').textContent = stats.total_reactions || 0;
        document.getElementById('adminShares').textContent = stats.total_shares || 0;
        document.getElementById('adminFollowers').textContent = stats.total_followers || 0;
        
        // Update reactions
        if (stats.reactions) {
            updateReactionDisplay(stats.reactions);
        }
    }

    // ========== INCREMENT USAGE ==========
    async function incrementUsage() {
        try {
            const result = await callAPI('/api/usage', 'POST', { 
                tool_slug: TOOL_SLUG,
                tool_id: TOOL_ID
            });
            if (result.success) {
                await loadStats();
                return true;
            }
        } catch (error) {
            console.error('Usage increment error:', error);
        }
        // Fallback: increment locally
        const cached = localStorage.getItem('caption_tool_stats');
        if (cached) {
            const stats = JSON.parse(cached);
            stats.total_usage = (stats.total_usage || 0) + 1;
            localStorage.setItem('caption_tool_stats', JSON.stringify(stats));
            updateStatsUI(stats);
        }
        return false;
    }

    // ========== ADD REACTION ==========
    async function addReaction(reaction) {
        try {
            const result = await callAPI('/api/reactions', 'POST', {
                tool_slug: TOOL_SLUG,
                tool_id: TOOL_ID,
                reaction_type: reaction
            });
            if (result.success) {
                showToast(getEmoji(reaction) + ' Reaction added!');
                await loadStats();
                return true;
            } else if (result.already_reacted) {
                showToast('You already reacted with this emoji!', 'error');
                return false;
            }
        } catch (error) {
            console.error('Reaction error:', error);
            // Fallback: local reaction
            const cached = localStorage.getItem('caption_tool_stats');
            if (cached) {
                const stats = JSON.parse(cached);
                if (!stats.reactions) stats.reactions = {};
                stats.reactions[reaction] = (stats.reactions[reaction] || 0) + 1;
                stats.total_reactions = (stats.total_reactions || 0) + 1;
                localStorage.setItem('caption_tool_stats', JSON.stringify(stats));
                updateStatsUI(stats);
                showToast(getEmoji(reaction) + ' Reaction added (offline)!');
                return true;
            }
        }
        return false;
    }

    // ========== ADD SHARE ==========
    async function addShare(platform) {
        try {
            const result = await callAPI('/api/shares', 'POST', {
                tool_slug: TOOL_SLUG,
                tool_id: TOOL_ID,
                platform: platform
            });
            if (result.success) {
                showToast(`Shared on ${platform}!`);
                await loadStats();
                return true;
            }
        } catch (error) {
            console.error('Share error:', error);
            // Fallback: local share
            const cached = localStorage.getItem('caption_tool_stats');
            if (cached) {
                const stats = JSON.parse(cached);
                stats.total_shares = (stats.total_shares || 0) + 1;
                localStorage.setItem('caption_tool_stats', JSON.stringify(stats));
                updateStatsUI(stats);
                showToast(`Shared on ${platform} (offline)!`);
                return true;
            }
        }
        return false;
    }

    function getEmoji(reaction) {
        const emojis = { 
            like: '👍', love: '❤️', wow: '😮', sad: '😢', 
            laugh: '😂', celebrate: '🎉', fire: '🔥' 
        };
        return emojis[reaction] || '👍';
    }

    function updateReactionDisplay(reactions) {
        document.querySelectorAll('.reaction-btn').forEach(btn => {
            const reaction = btn.dataset.reaction;
            const countSpan = btn.querySelector('.reaction-count');
            if (countSpan && reactions[reaction] !== undefined) {
                countSpan.textContent = reactions[reaction];
            }
        });
    }

    // ========== REACTIONS INIT ==========
    function initReactions() {
        document.querySelectorAll('.reaction-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const reaction = btn.dataset.reaction;
                await addReaction(reaction);
            });
        });
    }

    // ========== SOCIAL SHARES INIT ==========
    function initSocialShares() {
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const platform = btn.dataset.platform;
                const url = window.location.href;
                let shareUrl = '';
                
                if (platform === 'copy') {
                    await navigator.clipboard.writeText(url);
                    showToast('Link copied!');
                    await addShare('copy');
                    return;
                }
                
                switch(platform) {
                    case 'facebook': 
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`; 
                        break;
                    case 'twitter': 
                        shareUrl = `https://twitter.com/intent/tweet?text=Image%20Caption%20Tool%20Pro&url=${encodeURIComponent(url)}`; 
                        break;
                    case 'linkedin': 
                        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`; 
                        break;
                    case 'whatsapp': 
                        shareUrl = `https://wa.me/?text=${encodeURIComponent('Image Caption Tool Pro ' + url)}`; 
                        break;
                }
                
                if (shareUrl) {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                    await addShare(platform);
                }
            });
        });
    }

    // ========== SCROLL BUTTONS ==========
    const scrollUp = document.getElementById('scrollUpBtn');
    const scrollDown = document.getElementById('scrollDownBtn');
    
    window.addEventListener('scroll', () => {
        if (scrollUp) {
            scrollUp.style.display = window.scrollY > 200 ? 'block' : 'none';
        }
    });
    scrollUp?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    scrollDown?.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));

    // ========== PAGE SHARE ==========
    pageShareBtn?.addEventListener('click', async () => {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Page link copied!');
        await addShare('page');
    });

    // ========== DARK MODE ==========
    darkModeToggle?.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = darkModeToggle.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.className = 'fas fa-sun';
            showToast('Light mode activated');
        } else {
            icon.className = 'fas fa-moon';
            showToast('Dark mode activated');
        }
    });

    // ========== ADMIN PANEL ==========
    adminPanelBtn?.addEventListener('click', async () => {
        const panel = document.getElementById('adminPanel');
        if (panel.style.display === 'none') {
            panel.style.display = 'block';
            await loadStats();
            showToast('Admin Panel Opened');
        } else {
            panel.style.display = 'none';
        }
    });

    closeAdminBtn?.addEventListener('click', () => {
        document.getElementById('adminPanel').style.display = 'none';
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
                showToast('Image uploaded successfully!');
            };
            reader.readAsDataURL(file);
        } else {
            showToast('Please select a valid image file', 'error');
        }
    }

    // ========== FONT TOGGLES ==========
    window.toggleUrduFont = function() {
        currentFont = 'urdu';
        captionEditor.classList.add('urdu-text');
        captionEditor.style.fontFamily = "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'Urdu Nastaliq', serif";
        captionEditor.style.direction = 'rtl';
        captionEditor.style.textAlign = 'right';
        showToast('اردو فونٹ فعال کر دیا گیا');
        document.getElementById('urduToggle').style.background = 'linear-gradient(135deg, #00d4ff, #7b2ffc)';
        document.getElementById('urduToggle').style.color = 'white';
        document.getElementById('englishToggle').style.background = 'rgba(255,255,255,0.05)';
        document.getElementById('englishToggle').style.color = 'rgba(255,255,255,0.7)';
    };

    window.toggleEnglishFont = function() {
        currentFont = 'english';
        captionEditor.classList.remove('urdu-text');
        captionEditor.style.fontFamily = 'Inter, sans-serif';
        captionEditor.style.direction = 'ltr';
        captionEditor.style.textAlign = 'left';
        showToast('English font activated');
        document.getElementById('englishToggle').style.background = 'linear-gradient(135deg, #00d4ff, #7b2ffc)';
        document.getElementById('englishToggle').style.color = 'white';
        document.getElementById('urduToggle').style.background = 'rgba(255,255,255,0.05)';
        document.getElementById('urduToggle').style.color = 'rgba(255,255,255,0.7)';
    };

    // ========== TEXT FORMATTING ==========
    window.formatText = function(command, value = null) {
        captionEditor.focus();
        try {
            if (command === 'foreColor' || command === 'fontSize' || command === 'fontName') {
                document.execCommand(command, false, value);
            } else {
                document.execCommand(command, false, null);
            }
            saveToHistory();
        } catch (e) {
            console.error('Format error:', e);
        }
    };

    // ========== TEXT STYLES ==========
    window.applyTextStyle = function(style) {
        const text = captionEditor.innerText || 'Your Caption';
        let styledHtml = '';
        
        switch(style) {
            case 'neon':
                styledHtml = `<span style="color: #00d4ff; text-shadow: 0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 40px #7b2ffc, 0 0 80px #7b2ffc;">${text}</span>`;
                break;
            case 'shadow':
                styledHtml = `<span style="color: white; text-shadow: 2px 2px 4px #000, 4px 4px 8px rgba(0,0,0,0.5);">${text}</span>`;
                break;
            case 'glow':
                styledHtml = `<span style="color: #ff6b6b; text-shadow: 0 0 10px #ff6b6b, 0 0 20px #ff6b6b, 0 0 40px #ff6b6b;">${text}</span>`;
                break;
            case 'gradient':
                styledHtml = `<span style="background: linear-gradient(135deg, #00d4ff, #7b2ffc, #ff6b6b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${text}</span>`;
                break;
            case 'outline':
                styledHtml = `<span style="color: white; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;">${text}</span>`;
                break;
            default:
                styledHtml = text;
        }
        captionEditor.innerHTML = styledHtml;
        saveToHistory();
        showToast(`Applied ${style} style!`);
    };

    // ========== HISTORY ==========
    function saveToHistory() {
        const content = captionEditor.innerHTML;
        if (history[historyIndex] !== content) {
            history = history.slice(0, historyIndex + 1);
            history.push(content);
            historyIndex++;
            if (history.length > 50) {
                history.shift();
                historyIndex--;
            }
        }
    }

    undoBtn?.addEventListener('click', () => {
        if (historyIndex > 0) {
            historyIndex--;
            captionEditor.innerHTML = history[historyIndex];
        } else {
            showToast('Nothing to undo', 'error');
        }
    });

    redoBtn?.addEventListener('click', () => {
        if (historyIndex < history.length - 1) {
            historyIndex++;
            captionEditor.innerHTML = history[historyIndex];
        } else {
            showToast('Nothing to redo', 'error');
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
            
            let filterValue = 'none';
            switch(filter) {
                case 'grayscale': filterValue = 'grayscale(100%)'; break;
                case 'sepia': filterValue = 'sepia(100%)'; break;
                case 'blur': filterValue = 'blur(2px)'; break;
                case 'brightness': filterValue = 'brightness(1.2)'; break;
                case 'contrast': filterValue = 'contrast(1.5)'; break;
                default: filterValue = 'none';
            }
            ctx.filter = filterValue;
            ctx.drawImage(img, 0, 0);
            callback(canvas.toDataURL());
        };
        img.onerror = function() {
            showToast('Error processing image', 'error');
            callback(imgSrc);
        };
        img.src = imgSrc;
    }

    // ========== FILTERS ==========
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            if (uploadedImageData) {
                applyFilterToImage(uploadedImageData, currentFilter, (filteredImg) => {
                    imagePreview.src = filteredImg;
                });
                showToast(`Applied ${currentFilter} filter`);
            }
        });
    });

    // ========== AI CAPTION GENERATOR ==========
    aiCaptionBtn?.addEventListener('click', () => {
        const aiCaptions = [
            "✨ Life is beautiful! Make every moment count. ✨",
            "💫 Dream big, work hard, stay focused! 💫",
            "🌟 Make every moment count! 🌟",
            "💪 Stay positive, work hard, make it happen! 💪",
            "🎯 Focus on your goals and never give up! 🎯",
            "❤️ Spread love and kindness everywhere! ❤️",
            "📸 Capturing memories that last forever! 📸",
            "🌈 Good vibes only! Stay blessed! 🌈",
            "🚀 Success is not final, failure is not fatal! 🚀",
            "💎 You are capable of amazing things! 💎",
            "🌟 Be the best version of yourself! 🌟",
            "✨ خوبصورت زندگی، خوبصورت لمحات ✨",
            "💫 جینے کا انداز بدلو، کامیابی آئے گی 💫",
            "❤️ محبت پھیلاؤ، خوشیاں بانٹو ❤️"
        ];
        const randomCaption = aiCaptions[Math.floor(Math.random() * aiCaptions.length)];
        captionEditor.innerHTML = randomCaption;
        saveToHistory();
        showToast('✨ AI caption generated!');
        
        // Auto-detect Urdu
        if (/[\u0600-\u06FF]/.test(randomCaption)) {
            toggleUrduFont();
        }
    });

    // ========== APPLY TEMPLATE ==========
    function applyTemplate(style) {
        const text = captionEditor.innerText || 'Your Caption Here';
        let styledHtml = '';
        
        switch(style) {
            case 'modern':
                styledHtml = `<div style="font-family: 'Poppins', sans-serif; font-weight: 600; text-align: center; padding: 15px; background: linear-gradient(135deg, #00d4ff, #7b2ffc); color: white; border-radius: 12px;">${text}</div>`;
                break;
            case 'vintage':
                styledHtml = `<div style="font-family: 'Georgia', serif; font-style: italic; color: #d4a373; text-align: center; padding: 15px; background: #1a1a2e; border: 1px solid #d4a373;">${text}</div>`;
                break;
            case 'elegant':
                styledHtml = `<div style="font-family: 'Garamond', serif; color: #ffd700; text-align: center; padding: 15px; letter-spacing: 3px; border-bottom: 2px solid #ffd700;">${text}</div>`;
                break;
            case 'bold':
                styledHtml = `<div style="font-family: 'Impact', sans-serif; color: white; text-align: center; padding: 15px; background: linear-gradient(135deg, #000, #1a1a2e); text-shadow: 2px 2px 4px #000;">${text}</div>`;
                break;
            case 'minimal':
                styledHtml = `<div style="font-family: 'Helvetica', sans-serif; color: #aaa; text-align: center; padding: 10px; font-weight: 300; letter-spacing: 2px;">${text}</div>`;
                break;
            case 'fun':
                styledHtml = `<div style="font-family: 'Comic Sans MS', cursive; color: #ff6b6b; text-align: center; padding: 15px; background: rgba(255,107,107,0.1); border-radius: 20px; border: 2px dotted #ff6b6b;">${text} 🎉</div>`;
                break;
            case 'urdu-classic':
                styledHtml = `<div style="font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif; direction: rtl; text-align: center; padding: 20px; background: linear-gradient(135deg, #1a1a2e, #16213e); color: #ffd700; font-size: 24px; border: 1px solid #ffd700;">${text}</div>`;
                break;
            case 'neon':
                styledHtml = `<div style="font-family: 'Inter', sans-serif; text-align: center; padding: 15px; color: #00d4ff; text-shadow: 0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 40px #7b2ffc;">${text}</div>`;
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
        if (isGenerating) return;
        
        if (!uploadedImageData) {
            showToast('Please upload an image first!', 'error');
            return;
        }
        
        const captionHtml = captionEditor.innerHTML;
        if (!captionHtml.replace(/<[^>]*>/g, '').trim()) {
            showToast('Please enter a caption!', 'error');
            return;
        }
        
        isGenerating = true;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        
        outputContainer.style.display = 'block';
        outputContent.innerHTML = '<div class="spinner"></div>';
        
        setTimeout(() => {
            applyFilterToImage(uploadedImageData, currentFilter, (filteredImg) => {
                let displayCaption = captionHtml;
                // Check if Urdu text
                if (/[\u0600-\u06FF]/.test(captionHtml)) {
                    displayCaption = `<div class="urdu-text" style="direction: rtl; text-align: center;">${captionHtml}</div>`;
                }
                
                outputContent.innerHTML = `
                    <div style="text-align:center; max-width: 100%;">
                        <img src="${filteredImg}" style="max-width:100%; border-radius:12px; border: 1px solid rgba(255,255,255,0.05);">
                        <div style="margin-top:15px; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 12px;">${displayCaption}</div>
                    </div>
                `;
                
                generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate';
                isGenerating = false;
                incrementUsage();
                showToast('✅ Caption generated successfully!');
            });
        }, 500);
    });

    // ========== DOWNLOAD FUNCTIONS ==========
    async function downloadImage(format) {
        if (!outputContent.innerHTML || outputContent.innerHTML.includes('spinner')) {
            showToast('Generate caption first!', 'error');
            return;
        }
        try {
            const canvas = await html2canvas(outputContent, {
                backgroundColor: '#0a0a1a',
                scale: 2,
                useCORS: true,
                allowTaint: true
            });
            const link = document.createElement('a');
            const ext = format === 'png' ? 'png' : format === 'jpg' ? 'jpg' : 'webp';
            const mimeType = format === 'png' ? 'image/png' : format === 'jpg' ? 'image/jpeg' : 'image/webp';
            const quality = format === 'jpg' ? 0.9 : format === 'webp' ? 0.8 : 1;
            link.download = `captioned-image.${ext}`;
            link.href = canvas.toDataURL(mimeType, quality);
            link.click();
            showToast(`${format.toUpperCase()} downloaded!`);
        } catch (error) {
            console.error('Download error:', error);
            showToast('Error downloading image', 'error');
        }
    }

    downloadPNGBtn?.addEventListener('click', () => downloadImage('png'));
    downloadJPGBtn?.addEventListener('click', () => downloadImage('jpg'));
    downloadWebPBtn?.addEventListener('click', () => downloadImage('webp'));

    copyBtn?.addEventListener('click', async () => {
        if (!outputContent.innerHTML || outputContent.innerHTML.includes('spinner')) {
            showToast('Generate caption first!', 'error');
            return;
        }
        try {
            const canvas = await html2canvas(outputContent, {
                backgroundColor: '#0a0a1a',
                scale: 2,
                useCORS: true,
                allowTaint: true
            });
            canvas.toBlob(blob => {
                navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]);
                showToast('Image copied to clipboard!');
            });
        } catch (error) {
            console.error('Copy error:', error);
            showToast('Error copying image', 'error');
        }
    });

    // ========== CLEAR ALL ==========
    clearBtn?.addEventListener('click', () => {
        fileInput.value = '';
        uploadedImageData = null;
        imagePreview.style.display = 'none';
        imagePreview.src = '';
        uploadArea.style.display = 'flex';
        captionEditor.innerHTML = '';
        outputContainer.style.display = 'none';
        outputContent.innerHTML = '';
        history = [];
        historyIndex = -1;
        showToast('All cleared!');
    });

    // ========== KEYBOARD SHORTCUTS ==========
    document.addEventListener('keydown', (e) => {
        // Ctrl+Enter to generate
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            generateBtn?.click();
        }
        // Ctrl+Z for undo
        if (e.ctrlKey && e.key === 'z') {
            e.preventDefault();
            undoBtn?.click();
        }
        // Ctrl+Y for redo
        if (e.ctrlKey && e.key === 'y') {
            e.preventDefault();
            redoBtn?.click();
        }
    });

    // ========== AUTOMATIC USAGE ON LOAD ==========
    async function initialize() {
        // Load stats
        await loadStats();
        
        // Increment usage on load
        await incrementUsage();
        
        // Initialize history
        saveToHistory();
        
        // Set default font
        toggleEnglishFont();
        
        showToast('🚀 Image Caption Tool Pro Ready!');
        console.log('🔧 Tool connected to Cloudflare Workers API');
        console.log(`📊 Tool Slug: ${TOOL_SLUG}`);
        console.log(`🆔 Session ID: ${sessionId}`);
    }

    // ========== INITIALIZE ALL ==========
    initReactions();
    initSocialShares();
    initialize();

    // ========== ERROR HANDLING ==========
    window.addEventListener('unhandledrejection', function(event) {
        console.error('Unhandled Promise Rejection:', event.reason);
        showToast('Something went wrong. Please try again.', 'error');
    });

    // ========== SERVICE WORKER REGISTRATION ==========
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            console.log('Service worker registration skipped');
        });
    }

});
