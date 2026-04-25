/* ============================================
   FILE: blog-post-to-ad-converter.js
   Blog to Ad Converter Pro - TiDB CONNECTED
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ========== API CONFIGURATION ==========
    const API_BASE = '/api';
    let sessionId = localStorage.getItem('blog_converter_session');
    if (!sessionId) {
        sessionId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('blog_converter_session', sessionId);
    }
    
    let brandColor = localStorage.getItem('blog_brand_color') || '#4361ee';
    
    // DOM Elements
    const blogTitle = document.getElementById('blogTitle');
    const blogContent = document.getElementById('blogContent');
    const adTemplate = document.getElementById('adTemplate');
    const platformSelect = document.getElementById('platformSelect');
    const generateBtn = document.getElementById('generateBtn');
    const adCanvas = document.getElementById('adCanvas');
    const toolUsageCount = document.getElementById('toolUsageCount');
    const totalConversions = document.getElementById('totalConversions');
    const totalReactions = document.getElementById('totalReactions');
    const totalShares = document.getElementById('totalShares');
    
    // ========== TOAST NOTIFICATION ==========
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
    
    // ========== TIDB API CALLS ==========
    
    // 1. Get Tool Usage Stats
    async function getToolStats(toolId = 17) {
        try {
            const response = await fetch(`${API_BASE}/tool-stats?tool_id=${toolId}`);
            const data = await response.json();
            if (data.success) {
                return data;
            }
            return { usage: 0, reactions: { like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0 }, shares: 0 };
        } catch (error) {
            console.error('Error fetching stats:', error);
            return { usage: 0, reactions: {}, shares: 0 };
        }
    }
    
    // 2. Increment Usage Counter
    async function incrementUsage(toolId = 17) {
        try {
            const response = await fetch(`${API_BASE}/increment-usage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tool_id: toolId, session_id: sessionId })
            });
            const data = await response.json();
            if (data.success) {
                updateUsageDisplay(data.total_usage || 0);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error incrementing usage:', error);
            return false;
        }
    }
    
    // 3. Add Reaction
    async function addReaction(toolId, reactionType) {
        try {
            const response = await fetch(`${API_BASE}/add-reaction`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    tool_id: toolId, 
                    reaction_type: reactionType, 
                    session_id: sessionId 
                })
            });
            const data = await response.json();
            if (data.success) {
                updateReactionDisplay(toolId);
                return true;
            } else if (data.already_reacted) {
                showToast(`You already reacted with ${getReactionEmoji(reactionType)}!`, 'error');
                return false;
            }
            return false;
        } catch (error) {
            console.error('Error adding reaction:', error);
            return false;
        }
    }
    
    // 4. Add Share
    async function addShare(toolId, platform) {
        try {
            const response = await fetch(`${API_BASE}/add-share`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tool_id: toolId, platform: platform, session_id: sessionId })
            });
            const data = await response.json();
            if (data.success) {
                updateShareDisplay();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error adding share:', error);
            return false;
        }
    }
    
    // 5. Get All Stats
    async function loadAllStats() {
        try {
            const response = await fetch(`${API_BASE}/all-stats?tool_id=17`);
            const data = await response.json();
            if (data.success) {
                updateUsageDisplay(data.usage || 0);
                updateReactionDisplay(17, data.reactions);
                updateShareDisplay(data.shares || 0);
                return data;
            }
        } catch (error) {
            console.error('Error loading stats:', error);
            loadFromLocalFallback();
        }
    }
    
    // ========== DISPLAY UPDATE FUNCTIONS ==========
    function updateUsageDisplay(usage) {
        if (toolUsageCount) toolUsageCount.textContent = usage;
        if (totalConversions) totalConversions.textContent = usage;
        localStorage.setItem('blog_converter_usage', usage);
    }
    
    function updateReactionDisplay(toolId, reactions = null) {
        const reactionsContainer = document.querySelector('.tool-reactions');
        if (!reactionsContainer) return;
        
        if (reactions) {
            reactionsContainer.querySelectorAll('.reaction-btn').forEach(btn => {
                const reaction = btn.dataset.reaction;
                const countSpan = btn.querySelector('.reaction-count');
                if (countSpan && reactions[reaction] !== undefined) {
                    countSpan.textContent = reactions[reaction];
                }
            });
            let total = Object.values(reactions).reduce((a, b) => a + b, 0);
            if (totalReactions) totalReactions.textContent = total;
            localStorage.setItem('blog_converter_reactions', JSON.stringify(reactions));
        } else {
            // Load from localStorage fallback
            const saved = JSON.parse(localStorage.getItem('blog_converter_reactions') || '{}');
            reactionsContainer.querySelectorAll('.reaction-btn').forEach(btn => {
                const reaction = btn.dataset.reaction;
                const countSpan = btn.querySelector('.reaction-count');
                if (countSpan && saved[reaction] !== undefined) {
                    countSpan.textContent = saved[reaction];
                }
            });
        }
    }
    
    function updateShareDisplay(shares = null) {
        if (shares !== null) {
            if (totalShares) totalShares.textContent = shares;
            localStorage.setItem('blog_converter_shares', shares);
        } else {
            const saved = localStorage.getItem('blog_converter_shares') || '0';
            if (totalShares) totalShares.textContent = saved;
        }
    }
    
    function loadFromLocalFallback() {
        const usage = localStorage.getItem('blog_converter_usage') || '0';
        const reactions = JSON.parse(localStorage.getItem('blog_converter_reactions') || '{}');
        const shares = localStorage.getItem('blog_converter_shares') || '0';
        
        updateUsageDisplay(parseInt(usage));
        updateReactionDisplay(17, reactions);
        updateShareDisplay(parseInt(shares));
    }
    
    // ========== REACTIONS EVENT HANDLERS ==========
    function initReactions() {
        const reactionsContainer = document.querySelector('.tool-reactions');
        if (!reactionsContainer) return;
        
        reactionsContainer.querySelectorAll('.reaction-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const reaction = btn.dataset.reaction;
                const success = await addReaction(17, reaction);
                if (success) {
                    showToast(`${getReactionEmoji(reaction)} Reaction added!`);
                    await loadAllStats();
                }
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
                const toolName = 'Blog to Ad Converter';
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
                    await addShare(17, platform);
                    showToast(`Shared on ${platform}!`);
                    await loadAllStats();
                }
            });
        });
    }
    
    // ========== PAGE SHARE ==========
    document.getElementById('pageShareBtn')?.addEventListener('click', async () => {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Page link copied!');
    });
    
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
    
    // ========== BRAND COLOR ==========
    window.setBrandColor = function(color) {
        brandColor = color;
        localStorage.setItem('blog_brand_color', color);
        renderAd();
        showToast(`Brand color set!`);
    };
    
    // ========== TEXT FORMATTING ==========
    window.formatText = function(type) {
        const textarea = document.getElementById('blogContent');
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = textarea.value.substring(start, end);
        let formatted = '';
        
        switch(type) {
            case 'bold': formatted = `**${selected}**`; break;
            case 'italic': formatted = `*${selected}*`; break;
            case 'underline': formatted = `__${selected}__`; break;
            case 'h1': formatted = `# ${selected}`; break;
            case 'h2': formatted = `## ${selected}`; break;
            default: formatted = selected;
        }
        
        textarea.value = textarea.value.substring(0, start) + formatted + textarea.value.substring(end);
        textarea.focus();
    };
    
    // ========== AI ENHANCEMENTS ==========
    window.enhanceContent = function(type) {
        const content = document.getElementById('blogContent')?.value || '';
        let enhanced = content;
        
        switch(type) {
            case 'summarize':
                enhanced = content.split('.').slice(0, 2).join('.') + '...';
                break;
            case 'hashtags':
                const words = content.split(' ').filter(w => w.length > 5).slice(0, 5);
                enhanced = content + '\n\n' + words.map(w => `#${w.toLowerCase()}`).join(' ');
                break;
            case 'cta':
                enhanced = content + '\n\n👉 Like and share if you found this helpful!';
                break;
            case 'headlines':
                enhanced = content.replace(/^.*$/gm, line => `🔥 ${line}`);
                break;
        }
        
        if (document.getElementById('blogContent')) {
            document.getElementById('blogContent').value = enhanced;
        }
        showToast(`AI enhancement applied!`);
    };
    
    // ========== RENDER AD ==========
    function wrapText(ctx, text, maxWidth, fontSize) {
        ctx.font = `${fontSize}px Inter`;
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0] || '';
        
        for (let i = 1; i < words.length; i++) {
            const width = ctx.measureText(currentLine + ' ' + words[i]).width;
            if (width < maxWidth) {
                currentLine += ' ' + words[i];
            } else {
                lines.push(currentLine);
                currentLine = words[i];
            }
        }
        lines.push(currentLine);
        return lines;
    }
    
    async function renderAd() {
        if (!adCanvas) return;
        
        const title = blogTitle?.value || 'Your Ad Title';
        const content = blogContent?.value || 'Your amazing content here';
        const template = adTemplate?.value || 'modern';
        const platform = platformSelect?.value || 'facebook';
        
        let width, height;
        switch(platform) {
            case 'facebook': width = 1200; height = 630; break;
            case 'instagram': width = 1080; height = 1080; break;
            case 'twitter': width = 1200; height = 675; break;
            case 'story': width = 1080; height = 1920; break;
            default: width = 800; height = 600;
        }
        
        adCanvas.width = width;
        adCanvas.height = height;
        const ctx = adCanvas.getContext('2d');
        
        // Background
        if (template === 'modern') {
            const grad = ctx.createLinearGradient(0, 0, width, height);
            grad.addColorStop(0, brandColor);
            grad.addColorStop(1, '#764ba2');
            ctx.fillStyle = grad;
        } else if (template === 'minimal') {
            ctx.fillStyle = '#ffffff';
        } else if (template === 'bold') {
            ctx.fillStyle = brandColor;
        } else {
            ctx.fillStyle = '#1a1a2e';
        }
        ctx.fillRect(0, 0, width, height);
        
        // Title
        ctx.fillStyle = (template === 'minimal' || template === 'professional') ? '#333' : '#ffffff';
        ctx.font = `bold ${Math.floor(width / 15)}px Inter`;
        ctx.textAlign = 'center';
        const titleLines = wrapText(ctx, title, width * 0.8, width / 15);
        let y = height * 0.25;
        titleLines.slice(0, 2).forEach(line => {
            ctx.fillText(line, width / 2, y);
            y += width / 12;
        });
        
        // Content
        ctx.font = `${Math.floor(width / 28)}px Inter`;
        const contentLines = wrapText(ctx, content.substring(0, 200), width * 0.8, width / 28);
        let contentY = y + 40;
        contentLines.slice(0, 4).forEach(line => {
            ctx.fillText(line, width / 2, contentY);
            contentY += width / 20;
        });
        
        // CTA Button
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(width / 2 - 100, height - 100, 200, 50);
        ctx.fillStyle = brandColor;
        ctx.font = `bold ${Math.floor(width / 30)}px Inter`;
        ctx.fillText('Learn More →', width / 2, height - 65);
    }
    
    // ========== GENERATE AD ==========
    async function generateAd() {
        await incrementUsage(17);
        await renderAd();
        showToast('Ad generated successfully!');
    }
    
    generateBtn?.addEventListener('click', generateAd);
    
    // ========== DOWNLOAD ==========
    window.downloadAd = function(format) {
        if (!adCanvas) return;
        const link = document.createElement('a');
        const mime = format === 'png' ? 'image/png' : 'image/jpeg';
        link.download = `ad.${format}`;
        link.href = adCanvas.toDataURL(mime);
        link.click();
        showToast(`Downloaded as ${format.toUpperCase()}`);
    };
    
    window.copyAdToClipboard = function() {
        if (!adCanvas) return;
        adCanvas.toBlob(blob => {
            navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            showToast('Image copied to clipboard!');
        });
    };
    
    window.previewForPlatform = function(platform) {
        if (platformSelect) platformSelect.value = platform;
        renderAd();
        showToast(`Previewing ${platform} size`);
    };
    
    // ========== AUTO-SAVE INPUTS ==========
    function autoSave() {
        const title = blogTitle?.value || '';
        const content = blogContent?.value || '';
        localStorage.setItem('blog_converter_title', title);
        localStorage.setItem('blog_converter_content', content);
    }
    
    blogTitle?.addEventListener('input', () => { autoSave(); renderAd(); });
    blogContent?.addEventListener('input', () => { autoSave(); renderAd(); });
    adTemplate?.addEventListener('change', () => renderAd());
    platformSelect?.addEventListener('change', () => renderAd());
    
    function loadSavedInputs() {
        const savedTitle = localStorage.getItem('blog_converter_title');
        const savedContent = localStorage.getItem('blog_converter_content');
        if (savedTitle && blogTitle) blogTitle.value = savedTitle;
        if (savedContent && blogContent) blogContent.value = savedContent;
    }
    
    // ========== INITIALIZE ==========
    async function init() {
        loadSavedInputs();
        initReactions();
        initSocialShares();
        await loadAllStats();
        await renderAd();
        showToast('🎉 Blog to Ad Converter Ready! Live data from TiDB!', 'success');
    }
    
    init();
    
    // Add CSS for format buttons if not present
    const style = document.createElement('style');
    style.textContent = `
        .format-btn, .btn-ai {
            background: white;
            border: 1px solid #ddd;
            padding: 8px 12px;
            border-radius: 8px;
            cursor: pointer;
            margin: 2px;
            transition: all 0.3s;
        }
        .format-btn:hover, .btn-ai:hover {
            background: #667eea;
            color: white;
            border-color: #667eea;
        }
        .ai-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;
        }
        .btn-block {
            width: 100%;
        }
        .preview-thumbs {
            display: flex;
            gap: 15px;
            margin-top: 15px;
            flex-wrap: wrap;
        }
        .preview-thumb {
            background: #f0f0f0;
            padding: 10px 15px;
            border-radius: 50px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s;
        }
        .preview-thumb:hover {
            background: #667eea;
            color: white;
        }
    `;
    document.head.appendChild(style);
});
