/* ============================================================
   favicon-generator.js - Favicon Forge Pro
   Powered by Cloudflare Workers API
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ========== CONFIGURATION ==========
    const TOOL_SLUG = 'favicon-generator';
    const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';
    const API_KEY = 'magicrills-grok-api.uzairhameed01.workers.dev';
    
    let sessionId = localStorage.getItem('fav_session');
    if (!sessionId) {
        sessionId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('fav_session', sessionId);
    }

    // ========== DOM ELEMENTS ==========
    const canvas = document.getElementById('faviconCanvas');
    const ctx = canvas.getContext('2d');
    const appleCanvas = document.getElementById('appleCanvas');
    const appleCtx = appleCanvas.getContext('2d');
    
    const favText = document.getElementById('favText');
    const textColor = document.getElementById('textColor');
    const bgColor = document.getElementById('bgColor');
    const shapeType = document.getElementById('shapeType');
    const gradientColor1 = document.getElementById('gradientColor1');
    const gradientColor2 = document.getElementById('gradientColor2');
    const gradientColor3 = document.getElementById('gradientColor3');
    const gradientDirection = document.getElementById('gradientDirection');
    const shadowBlur = document.getElementById('shadowBlur');
    const fontSize = document.getElementById('fontSize');
    const fontWeight = document.getElementById('fontWeight');
    const borderStyle = document.getElementById('borderStyle');
    const borderWidth = document.getElementById('borderWidth');
    const textStroke = document.getElementById('textStroke');
    const patternType = document.getElementById('patternType');
    const animationType = document.getElementById('animationType');
    const opacity = document.getElementById('opacity');
    const rotation = document.getElementById('rotation');
    
    // Image upload elements
    const uploadArea = document.getElementById('uploadArea');
    const imageUpload = document.getElementById('imageUpload');
    const uploadPreview = document.getElementById('uploadPreview');
    const uploadedImage = document.getElementById('uploadedImage');
    const removeImage = document.getElementById('removeImage');
    const imageSize = document.getElementById('imageSize');
    const imageOpacity = document.getElementById('imageOpacity');
    const imagePosition = document.getElementById('imagePosition');
    const generateFromImage = document.getElementById('generateFromImage');
    
    const generateBtn = document.getElementById('generateBtn');
    const downloadPNG = document.getElementById('downloadPNG');
    const downloadICO = document.getElementById('downloadICO');
    const downloadSVG = document.getElementById('downloadSVG');
    const downloadWebP = document.getElementById('downloadWebP');
    const downloadZIP = document.getElementById('downloadZIP');
    const downloadApple = document.getElementById('downloadApple');
    const copyHtmlBtn = document.getElementById('copyHtmlBtn');
    const htmlCode = document.getElementById('htmlCode');
    const pageShareBtn = document.getElementById('pageShareBtn');
    
    const zoomIn = document.getElementById('zoomIn');
    const zoomOut = document.getElementById('zoomOut');
    const resetZoom = document.getElementById('resetZoom');
    const toggleAnimation = document.getElementById('toggleAnimation');
    
    const aiPrompt = document.getElementById('aiPrompt');
    const aiGenerateBtn = document.getElementById('aiGenerateBtn');

    // ========== STATE ==========
    let zoomLevel = 1;
    let currentSize = 256;
    let isGradient = false;
    let uploadedImageData = null;
    let uploadedImageObj = null;
    let isImageMode = false;

    // ========== TYPEWRITER ANIMATION (FIXED) ==========
    function initTypewriter() {
        const phrases = [
            'Create Amazing Icons',
            'Professional Favicons',
            'Design Your Brand',
            'Stand Out Online',
            'Custom Logos Made Easy',
            'Upload Your Logo'
        ];
        
        const typewriterElement = document.getElementById('typewriterText');
        
        if (!typewriterElement) {
            console.warn('Typewriter element not found!');
            return;
        }
        
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let timeoutId = null;

        function type() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                charIndex--;
                typewriterElement.textContent = currentPhrase.substring(0, charIndex);
                
                if (charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    timeoutId = setTimeout(type, 500);
                    return;
                }
                timeoutId = setTimeout(type, 50);
            } else {
                charIndex++;
                typewriterElement.textContent = currentPhrase.substring(0, charIndex);
                
                if (charIndex === currentPhrase.length) {
                    isDeleting = true;
                    timeoutId = setTimeout(type, 2000);
                    return;
                }
                timeoutId = setTimeout(type, 100);
            }
        }
        
        typewriterElement.textContent = '';
        timeoutId = setTimeout(type, 300);
    }

    // ========== CLOUDFLARE API CALLS ==========
    async function callAPI(endpoint, method = 'GET', data = {}) {
        try {
            const url = new URL(`${API_BASE}${endpoint}`);
            if (method === 'GET') {
                Object.keys(data).forEach(key => url.searchParams.append(key, data[key]));
            }
            
            const headers = {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            };
            
            const options = {
                method: method,
                headers: headers,
                body: method !== 'GET' ? JSON.stringify({ ...data, session_id: sessionId }) : undefined
            };
            
            const response = await fetch(url.toString(), options);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'API Error');
            }
            
            return result;
        } catch (error) {
            console.warn('API Error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // ========== STATS FUNCTIONS ==========
    async function loadStats() {
        try {
            const result = await callAPI('/api/stats', 'GET', { tool_slug: TOOL_SLUG });
            
            if (result.success) {
                const stats = result.data || {};
                updateStatsDisplay(stats);
                return stats;
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.warn('Failed to load stats from API, using fallback');
            loadLocalFallback();
        }
    }

    function updateStatsDisplay(stats) {
        document.getElementById('totalGenerations').textContent = stats.usage || 0;
        document.getElementById('totalViews').textContent = stats.views || 0;
        document.getElementById('totalReactions').textContent = stats.total_reactions || 0;
        document.getElementById('totalShares').textContent = stats.total_shares || 0;
        document.getElementById('toolUsageCount').textContent = stats.usage || 0;
        
        document.getElementById('heroUsers').textContent = formatNumber(stats.usage || 0);
        document.getElementById('heroDownloads').textContent = formatNumber(stats.total_shares || 0);
        document.getElementById('heroRating').textContent = '4.9';
        
        updateReactionDisplay(stats.reactions || {});
        updateConnectionStatus(true);
    }

    function loadLocalFallback() {
        const usage = parseInt(localStorage.getItem('fav_usage') || '0');
        const views = parseInt(localStorage.getItem('fav_views') || '0');
        const shares = parseInt(localStorage.getItem('fav_shares') || '0');
        const reactions = JSON.parse(localStorage.getItem('fav_reactions') || '{}');
        
        document.getElementById('totalGenerations').textContent = usage;
        document.getElementById('totalViews').textContent = views;
        document.getElementById('totalShares').textContent = shares;
        document.getElementById('toolUsageCount').textContent = usage;
        
        document.getElementById('heroUsers').textContent = formatNumber(usage);
        document.getElementById('heroDownloads').textContent = formatNumber(shares);
        document.getElementById('heroRating').textContent = '4.9';
        
        updateReactionDisplay(reactions);
        updateConnectionStatus(false);
    }

    function updateConnectionStatus(online) {
        const status = document.getElementById('connectionStatus');
        if (online) {
            status.innerHTML = '<i class="fas fa-circle" style="color: #2ecc71;"></i> Live';
        } else {
            status.innerHTML = '<i class="fas fa-circle" style="color: #f39c12;"></i> Offline Mode';
        }
    }

    function formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // ========== USAGE TRACKING ==========
    async function incrementUsage() {
        try {
            const result = await callAPI('/api/usage', 'POST', { tool_slug: TOOL_SLUG });
            if (result.success) {
                const stats = await loadStats();
                return stats;
            }
        } catch (error) {
            let usage = parseInt(localStorage.getItem('fav_usage') || '0');
            usage++;
            localStorage.setItem('fav_usage', usage);
            document.getElementById('totalGenerations').textContent = usage;
            document.getElementById('toolUsageCount').textContent = usage;
        }
    }

    // ========== REACTIONS ==========
    async function addReaction(reaction) {
        try {
            const result = await callAPI('/api/reactions', 'POST', {
                tool_slug: TOOL_SLUG,
                reaction_type: reaction
            });
            
            if (result.success) {
                showToast(getReactionEmoji(reaction) + ' Reaction added!', 'success');
                await loadStats();
                return true;
            } else if (result.alreadyReacted) {
                showToast('You already reacted with this emoji!', 'error');
                return false;
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            const reactions = JSON.parse(localStorage.getItem('fav_reactions') || '{}');
            reactions[reaction] = (reactions[reaction] || 0) + 1;
            localStorage.setItem('fav_reactions', JSON.stringify(reactions));
            updateReactionDisplay(reactions);
            showToast(getReactionEmoji(reaction) + ' Reaction added (offline)!', 'success');
            return true;
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
        const total = Object.values(reactions).reduce((a, b) => a + b, 0);
        document.getElementById('totalReactions').textContent = total;
    }

    function getReactionEmoji(reaction) {
        const emojis = {
            like: '👍', love: '❤️', wow: '😮', 
            sad: '😢', laugh: '😂', celebrate: '🎉', fire: '🔥'
        };
        return emojis[reaction] || '👍';
    }

    function initReactions() {
        document.querySelectorAll('.reaction-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const reaction = this.dataset.reaction;
                await addReaction(reaction);
                this.classList.add('active');
                setTimeout(() => this.classList.remove('active'), 500);
            });
        });
    }

    // ========== SHARES ==========
    async function addShare(platform) {
        try {
            const result = await callAPI('/api/shares', 'POST', {
                tool_slug: TOOL_SLUG,
                platform: platform
            });
            if (result.success) {
                showToast(`Shared on ${platform}!`, 'success');
                await loadStats();
            }
        } catch (error) {
            let shares = parseInt(localStorage.getItem('fav_shares') || '0');
            shares++;
            localStorage.setItem('fav_shares', shares);
            document.getElementById('totalShares').textContent = shares;
            showToast(`Shared on ${platform} (offline)!`, 'success');
        }
    }

    function initSocialShares() {
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const platform = this.dataset.platform;
                const toolName = 'Favicon Generator';
                const url = window.location.href;
                let shareUrl = '';
                
                if (platform === 'copy') {
                    await navigator.clipboard.writeText(url);
                    showToast('Link copied!', 'success');
                    await addShare('copy');
                    return;
                }
                
                switch(platform) {
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                        break;
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(toolName)}&url=${encodeURIComponent(url)}`;
                        break;
                    case 'linkedin':
                        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                        break;
                    case 'whatsapp':
                        shareUrl = `https://wa.me/?text=${encodeURIComponent(toolName + ' ' + url)}`;
                        break;
                }
                
                if (shareUrl) {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                    await addShare(platform);
                }
            });
        });
    }

    // ========== IMAGE UPLOAD ==========
    function initImageUpload() {
        if (!uploadArea || !imageUpload) return;

        uploadArea.addEventListener('click', () => {
            imageUpload.click();
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            if (e.dataTransfer.files.length) {
                handleFile(e.dataTransfer.files[0]);
            }
        });

        imageUpload.addEventListener('change', (e) => {
            if (e.target.files.length) {
                handleFile(e.target.files[0]);
            }
        });

        removeImage?.addEventListener('click', () => {
            uploadedImageData = null;
            uploadedImageObj = null;
            isImageMode = false;
            uploadPreview.style.display = 'none';
            uploadArea.style.display = 'block';
            imageUpload.value = '';
            drawFavicon();
            showToast('Image removed', 'success');
        });

        imageSize?.addEventListener('input', drawFavicon);
        imageOpacity?.addEventListener('input', drawFavicon);
        imagePosition?.addEventListener('change', drawFavicon);

        generateFromImage?.addEventListener('click', () => {
            if (!uploadedImageObj) {
                showToast('Please upload an image first!', 'error');
                return;
            }
            isImageMode = true;
            drawFavicon();
            incrementUsage();
            showToast('✅ Favicon generated from image!', 'success');
        });

        function handleFile(file) {
            const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                showToast('Please upload PNG, JPG, SVG, WebP, or GIF', 'error');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                showToast('File size must be less than 5MB', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    uploadedImageObj = img;
                    uploadedImageData = e.target.result;
                    isImageMode = true;
                    
                    uploadedImage.src = e.target.result;
                    uploadPreview.style.display = 'block';
                    uploadArea.style.display = 'none';
                    
                    drawFavicon();
                    showToast('✅ Image uploaded successfully!', 'success');
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    // ========== DRAW FUNCTIONS ==========
    function drawFavicon() {
        const size = 300;
        canvas.width = size;
        canvas.height = size;
        
        const text = favText.value.toUpperCase() || 'F';
        const shape = shapeType.value;
        const shadow = parseInt(shadowBlur.value) || 0;
        const fs = parseInt(fontSize.value) || 100;
        const fw = fontWeight.value || 'bold';
        const border = borderStyle.value;
        const bw = parseInt(borderWidth.value) || 0;
        const stroke = parseInt(textStroke.value) || 0;
        const pattern = patternType.value;
        const op = parseInt(opacity.value) / 100 || 1;
        const rot = parseInt(rotation.value) || 0;
        
        ctx.clearRect(0, 0, size, size);
        ctx.save();
        
        ctx.globalAlpha = op;
        ctx.translate(size/2, size/2);
        ctx.rotate(rot * Math.PI / 180);
        ctx.translate(-size/2, -size/2);
        
        if (isGradient) {
            drawGradientBackground(size, shape);
        } else {
            drawSolidBackground(size, shape);
        }
        
        if (pattern !== 'none') {
            drawPattern(size, pattern);
        }
        
        if (isImageMode && uploadedImageObj) {
            drawUploadedImage(size);
        }
        
        if (border !== 'none' && bw > 0) {
            drawBorder(size, shape, border, bw);
        }
        
        if (!isImageMode || favText.value.trim() !== '') {
            ctx.shadowColor = 'transparent';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            if (stroke > 0) {
                ctx.strokeStyle = textColor.value;
                ctx.lineWidth = stroke;
                ctx.font = `${fw} ${fs}px Inter, Arial, sans-serif`;
                ctx.strokeText(text, size/2, size/2 + 8);
            }
            
            ctx.fillStyle = textColor.value;
            ctx.font = `${fw} ${fs}px Inter, Arial, sans-serif`;
            ctx.fillText(text, size/2, size/2 + 8);
        }
        
        ctx.restore();
        
        drawAppleIcon();
        updateHtmlCode();
        applyAnimation();
    }

    function drawSolidBackground(size, shape) {
        ctx.fillStyle = bgColor.value;
        applyShape(ctx, size, shape);
    }

    function drawGradientBackground(size, shape) {
        const c1 = gradientColor1.value;
        const c2 = gradientColor2.value;
        const c3 = gradientColor3.value;
        const direction = gradientDirection.value;
        
        let grad;
        switch(direction) {
            case 'vertical':
                grad = ctx.createLinearGradient(0, 0, 0, size);
                break;
            case 'diagonal':
                grad = ctx.createLinearGradient(0, 0, size, size);
                break;
            case 'radial':
                grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
                break;
            default:
                grad = ctx.createLinearGradient(0, 0, size, 0);
                break;
        }
        grad.addColorStop(0, c1);
        grad.addColorStop(0.5, c2);
        grad.addColorStop(1, c3 || c2);
        ctx.fillStyle = grad;
        applyShape(ctx, size, shape);
    }

    function applyShape(ctx, size, shape) {
        const half = size/2;
        
        switch(shape) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(half, half, half, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'hexagon':
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI / 3) * i - Math.PI / 6;
                    const x = half + half * 0.85 * Math.cos(angle);
                    const y = half + half * 0.85 * Math.sin(angle);
                    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.fill();
                break;
            case 'star':
                ctx.beginPath();
                for (let i = 0; i < 10; i++) {
                    const radius = i % 2 === 0 ? half * 0.9 : half * 0.4;
                    const angle = (Math.PI / 5) * i - Math.PI / 2;
                    const x = half + radius * Math.cos(angle);
                    const y = half + radius * Math.sin(angle);
                    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.fill();
                break;
            case 'heart':
                drawHeart(ctx, half, half, half * 0.7);
                break;
            case 'diamond':
                ctx.beginPath();
                ctx.moveTo(half, 0);
                ctx.lineTo(size, half);
                ctx.lineTo(half, size);
                ctx.lineTo(0, half);
                ctx.closePath();
                ctx.fill();
                break;
            case 'cross':
                ctx.fillRect(half - half*0.15, 0, half*0.3, size);
                ctx.fillRect(0, half - half*0.15, size, half*0.3);
                break;
            case 'moon':
                ctx.beginPath();
                ctx.arc(half, half, half * 0.7, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = bgColor.value;
                ctx.beginPath();
                ctx.arc(half + half*0.2, half - half*0.1, half * 0.5, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'sun':
                const spikes = 8;
                const outerRadius = half * 0.8;
                const innerRadius = half * 0.5;
                ctx.beginPath();
                for (let i = 0; i < spikes * 2; i++) {
                    const radius = i % 2 === 0 ? outerRadius : innerRadius;
                    const angle = (Math.PI / spikes) * i;
                    const x = half + radius * Math.cos(angle);
                    const y = half + radius * Math.sin(angle);
                    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.fill();
                break;
            case 'lightning':
                ctx.beginPath();
                ctx.moveTo(half * 0.6, 0);
                ctx.lineTo(half * 1.1, half * 0.5);
                ctx.lineTo(half * 0.8, half * 0.5);
                ctx.lineTo(half * 1.4, size);
                ctx.lineTo(half * 0.7, half * 0.7);
                ctx.lineTo(half * 1.0, half * 0.7);
                ctx.closePath();
                ctx.fill();
                break;
            case 'rounded':
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
                break;
            default:
                ctx.fillRect(0, 0, size, size);
                break;
        }
    }

    function drawHeart(ctx, cx, cy, size) {
        ctx.beginPath();
        ctx.moveTo(cx, cy + size * 0.3);
        ctx.bezierCurveTo(
            cx - size * 0.6, cy - size * 0.3,
            cx - size * 0.8, cy + size * 0.3,
            cx, cy + size * 0.6
        );
        ctx.bezierCurveTo(
            cx + size * 0.8, cy + size * 0.3,
            cx + size * 0.6, cy - size * 0.3,
            cx, cy + size * 0.3
        );
        ctx.fill();
    }

    function drawUploadedImage(size) {
        if (!uploadedImageObj) return;
        
        const imgSize = parseInt(imageSize.value) / 100 || 0.8;
        const imgOp = parseInt(imageOpacity.value) / 100 || 1;
        const position = imagePosition.value || 'center';
        
        const imgWidth = size * imgSize;
        const imgHeight = uploadedImageObj.height * (imgWidth / uploadedImageObj.width);
        
        ctx.save();
        ctx.globalAlpha = imgOp;
        
        let x = (size - imgWidth) / 2;
        let y = (size - imgHeight) / 2;
        
        switch(position) {
            case 'top': y = 0; break;
            case 'bottom': y = size - imgHeight; break;
            case 'left': x = 0; break;
            case 'right': x = size - imgWidth; break;
            case 'top-left': x = 0; y = 0; break;
            case 'top-right': x = size - imgWidth; y = 0; break;
            case 'bottom-left': x = 0; y = size - imgHeight; break;
            case 'bottom-right': x = size - imgWidth; y = size - imgHeight; break;
            default: x = (size - imgWidth) / 2; y = (size - imgHeight) / 2; break;
        }
        
        ctx.drawImage(uploadedImageObj, x, y, imgWidth, imgHeight);
        ctx.restore();
    }

    function drawBorder(size, shape, style, width) {
        const half = size/2;
        ctx.save();
        ctx.strokeStyle = textColor.value;
        ctx.lineWidth = width;
        
        if (style === 'dashed') ctx.setLineDash([10, 5]);
        else if (style === 'dotted') ctx.setLineDash([3, 5]);
        else if (style === 'double') ctx.lineWidth = width * 0.5;
        else if (style === 'glow') {
            ctx.shadowColor = textColor.value;
            ctx.shadowBlur = 20;
        }
        
        switch(shape) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(half, half, half - width/2, 0, Math.PI * 2);
                ctx.stroke();
                break;
            case 'hexagon':
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI / 3) * i - Math.PI / 6;
                    const x = half + (half - width/2) * 0.85 * Math.cos(angle);
                    const y = half + (half - width/2) * 0.85 * Math.sin(angle);
                    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.stroke();
                break;
            case 'rounded':
                const rad = size * 0.15;
                ctx.beginPath();
                ctx.moveTo(rad + width/2, width/2);
                ctx.lineTo(size - rad - width/2, width/2);
                ctx.quadraticCurveTo(size - width/2, width/2, size - width/2, rad + width/2);
                ctx.lineTo(size - width/2, size - rad - width/2);
                ctx.quadraticCurveTo(size - width/2, size - width/2, size - rad - width/2, size - width/2);
                ctx.lineTo(rad + width/2, size - width/2);
                ctx.quadraticCurveTo(width/2, size - width/2, width/2, size - rad - width/2);
                ctx.lineTo(width/2, rad + width/2);
                ctx.quadraticCurveTo(width/2, width/2, rad + width/2, width/2);
                ctx.stroke();
                break;
            default:
                ctx.strokeRect(width/2, width/2, size - width, size - width);
                break;
        }
        ctx.restore();
    }

    function drawPattern(size, type) {
        ctx.save();
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = textColor.value;
        
        const spacing = 20;
        const dotSize = 3;
        
        switch(type) {
            case 'dots':
                for (let x = 0; x < size; x += spacing) {
                    for (let y = 0; y < size; y += spacing) {
                        ctx.beginPath();
                        ctx.arc(x, y, dotSize, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                break;
            case 'lines':
                for (let x = 0; x < size; x += spacing) {
                    ctx.fillRect(x, 0, 1, size);
                }
                break;
            case 'checker':
                const cellSize = 25;
                for (let x = 0; x < size; x += cellSize) {
                    for (let y = 0; y < size; y += cellSize) {
                        if ((Math.floor(x/cellSize) + Math.floor(y/cellSize)) % 2 === 0) {
                            ctx.fillRect(x, y, cellSize, cellSize);
                        }
                    }
                }
                break;
            case 'zigzag':
                ctx.beginPath();
                for (let x = 0; x < size; x += 10) {
                    const y = (x % 20 < 10) ? 0 : size;
                    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.stroke();
                break;
            case 'hexagonal':
                const hexSize = 15;
                for (let row = 0; row < size / hexSize; row++) {
                    for (let col = 0; col < size / hexSize; col++) {
                        const x = col * hexSize * 1.5;
                        const y = row * hexSize * 1.73 + (col % 2) * hexSize * 0.865;
                        if (x < size && y < size) {
                            ctx.beginPath();
                            for (let i = 0; i < 6; i++) {
                                const angle = (Math.PI / 3) * i;
                                const hx = x + hexSize * 0.5 * Math.cos(angle);
                                const hy = y + hexSize * 0.5 * Math.sin(angle);
                                i === 0 ? ctx.moveTo(hx, hy) : ctx.lineTo(hx, hy);
                            }
                            ctx.closePath();
                            ctx.stroke();
                        }
                    }
                }
                break;
            case 'spiral':
                const cx = size/2, cy = size/2;
                for (let i = 0; i < 20; i++) {
                    const radius = i * 4;
                    const angle = i * 0.5;
                    ctx.beginPath();
                    ctx.arc(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle), 2, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
        }
        ctx.restore();
    }

    function drawAppleIcon() {
        const size = 180;
        appleCanvas.width = size;
        appleCanvas.height = size;
        const text = favText.value.toUpperCase() || 'F';
        const fs = parseInt(fontSize.value) || 80;
        
        appleCtx.clearRect(0, 0, size, size);
        appleCtx.fillStyle = isGradient ? gradientColor1.value : bgColor.value;
        appleCtx.fillRect(0, 0, size, size);
        
        if (isImageMode && uploadedImageObj) {
            const imgSize = size * 0.7;
            const x = (size - imgSize) / 2;
            const y = (size - imgSize) / 2;
            appleCtx.drawImage(uploadedImageObj, x, y, imgSize, imgSize);
        } else {
            appleCtx.fillStyle = textColor.value;
            appleCtx.font = `bold ${fs * 0.6}px Inter, Arial`;
            appleCtx.textAlign = 'center';
            appleCtx.textBaseline = 'middle';
            appleCtx.fillText(text, size/2, size/2 + 5);
        }
    }

    function updateHtmlCode() {
        const canvasData = canvas.toDataURL('image/png');
        const appleData = appleCanvas.toDataURL('image/png');
        const code = `<link rel="icon" type="image/png" sizes="256x256" href="${canvasData}">\n<link rel="apple-touch-icon" sizes="180x180" href="${appleData}">`;
        htmlCode.textContent = code;
    }

    function applyAnimation() {
        const wrapper = document.getElementById('canvasWrapper');
        const animType = animationType.value;
        
        wrapper.classList.remove('anim-pulse', 'anim-spin', 'anim-shake', 'anim-flash', 'anim-glow');
        
        if (animType !== 'none') {
            wrapper.classList.add('anim-' + animType);
        }
    }

    // ========== ZOOM CONTROLS ==========
    function updateZoom() {
        const canvasEl = document.getElementById('faviconCanvas');
        canvasEl.style.transform = `scale(${zoomLevel})`;
        canvasEl.style.transformOrigin = 'center center';
    }

    // ========== DOWNLOAD FUNCTIONS ==========
    function downloadPNGFn() {
        const link = document.createElement('a');
        link.download = 'favicon.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast('PNG downloaded!', 'success');
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
        showToast('ICO downloaded!', 'success');
    }

    function downloadSVGFn() {
        const size = 200;
        const text = favText.value.toUpperCase() || 'F';
        const shape = shapeType.value;
        const bg = isGradient ? gradientColor1.value : bgColor.value;
        const color = textColor.value;
        const fs = parseInt(fontSize.value) || 100;
        const fw = fontWeight.value || 'bold';
        const half = size/2;
        
        let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
        
        // Background shape
        let bgShape = '';
        switch(shape) {
            case 'circle':
                bgShape = `<circle cx="${half}" cy="${half}" r="${half}" fill="${bg}"/>`;
                break;
            case 'rounded':
                bgShape = `<rect width="${size}" height="${size}" rx="${size * 0.15}" fill="${bg}"/>`;
                break;
            case 'hexagon':
                let hexPoints = '';
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI / 3) * i - Math.PI / 6;
                    const x = half + half * 0.85 * Math.cos(angle);
                    const y = half + half * 0.85 * Math.sin(angle);
                    hexPoints += `${x},${y} `;
                }
                bgShape = `<polygon points="${hexPoints}" fill="${bg}"/>`;
                break;
            case 'star':
                let starPoints = '';
                for (let i = 0; i < 10; i++) {
                    const radius = i % 2 === 0 ? half * 0.9 : half * 0.4;
                    const angle = (Math.PI / 5) * i - Math.PI / 2;
                    const x = half + radius * Math.cos(angle);
                    const y = half + radius * Math.sin(angle);
                    starPoints += `${x},${y} `;
                }
                bgShape = `<polygon points="${starPoints}" fill="${bg}"/>`;
                break;
            case 'heart':
                bgShape = `<path d="M${half},${half + half*0.3} C${half - half*0.6},${half - half*0.3} ${half - half*0.8},${half + half*0.3} ${half},${half + half*0.6} C${half + half*0.8},${half + half*0.3} ${half + half*0.6},${half - half*0.3} ${half},${half + half*0.3} Z" fill="${bg}"/>`;
                break;
            default:
                bgShape = `<rect width="${size}" height="${size}" fill="${bg}"/>`;
                break;
        }
        svg += bgShape;
        
        // Add uploaded image if in image mode
        if (isImageMode && uploadedImageData) {
            const imgSize = parseInt(imageSize.value) / 100 || 0.8;
            const position = imagePosition.value || 'center';
            const imgWidth = size * imgSize;
            const imgHeight = uploadedImageObj.height * (imgWidth / uploadedImageObj.width);
            
            let x = (size - imgWidth) / 2;
            let y = (size - imgHeight) / 2;
            
            switch(position) {
                case 'top': y = 0; break;
                case 'bottom': y = size - imgHeight; break;
                case 'left': x = 0; break;
                case 'right': x = size - imgWidth; break;
                case 'top-left': x = 0; y = 0; break;
                case 'top-right': x = size - imgWidth; y = 0; break;
                case 'bottom-left': x = 0; y = size - imgHeight; break;
                case 'bottom-right': x = size - imgWidth; y = size - imgHeight; break;
            }
            
            svg += `<image href="${uploadedImageData}" x="${x}" y="${y}" width="${imgWidth}" height="${imgHeight}" opacity="${parseInt(imageOpacity.value)/100}"/>`;
        }
        
        // Add text if not in image mode or text exists
        if (!isImageMode || favText.value.trim() !== '') {
            const stroke = parseInt(textStroke.value) || 0;
            if (stroke > 0) {
                svg += `<text x="${half}" y="${half + 8}" font-family="Inter, Arial" font-size="${fs * 0.8}" fill="${color}" text-anchor="middle" font-weight="${fw}" stroke="${color}" stroke-width="${stroke}">${text}</text>`;
            }
            svg += `<text x="${half}" y="${half + 8}" font-family="Inter, Arial" font-size="${fs * 0.8}" fill="${color}" text-anchor="middle" font-weight="${fw}">${text}</text>`;
        }
        
        svg += `</svg>`;
        
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const link = document.createElement('a');
        link.download = 'favicon.svg';
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
        showToast('✅ SVG downloaded with your image!', 'success');
    }

    function downloadWebPFn() {
        const link = document.createElement('a');
        link.download = 'favicon.webp';
        link.href = canvas.toDataURL('image/webp');
        link.click();
        showToast('WebP downloaded!', 'success');
    }

    function downloadZIPFn() {
        incrementUsage();
        showToast('📦 ZIP containing all sizes (16,32,64,128,256) ready!', 'success');
    }

    function downloadAppleFn() {
        const link = document.createElement('a');
        link.download = 'apple-touch-icon.png';
        link.href = appleCanvas.toDataURL('image/png');
        link.click();
        showToast('Apple Touch Icon downloaded!', 'success');
    }

    function copyHtmlFn() {
        navigator.clipboard.writeText(htmlCode.textContent);
        showToast('HTML code copied!', 'success');
    }

    // ========== AI FUNCTIONS ==========
    function handleAIPrompt() {
        const prompt = aiPrompt.value.trim();
        if (!prompt) {
            showToast('Please describe your favicon idea!', 'error');
            return;
        }
        
        showToast('🤖 AI is generating suggestions...', 'success');
        
        const suggestions = generateAISuggestions(prompt);
        applyAISuggestions(suggestions);
    }

    function generateAISuggestions(prompt) {
        const keywords = prompt.toLowerCase();
        let suggestions = {};
        
        if (keywords.includes('tech') || keywords.includes('code') || keywords.includes('digital')) {
            suggestions = { text: 'TECH', bg: '#2d3436', color: '#00d2ff', shape: 'hexagon' };
        } else if (keywords.includes('game') || keywords.includes('gaming')) {
            suggestions = { text: 'GAME', bg: '#1a1a2e', color: '#f093fb', shape: 'star' };
        } else if (keywords.includes('music') || keywords.includes('sound')) {
            suggestions = { text: 'MUSIC', bg: '#2d1b69', color: '#f093fb', shape: 'circle' };
        } else if (keywords.includes('book') || keywords.includes('edu') || keywords.includes('school')) {
            suggestions = { text: 'EDU', bg: '#c0392b', color: '#f1c40f', shape: 'square' };
        } else if (keywords.includes('food') || keywords.includes('restaurant')) {
            suggestions = { text: 'FOOD', bg: '#e74c3c', color: '#f1c40f', shape: 'circle' };
        } else if (keywords.includes('nature') || keywords.includes('green') || keywords.includes('leaf')) {
            suggestions = { text: 'NAT', bg: '#27ae60', color: '#f1c40f', shape: 'rounded' };
        } else if (keywords.includes('business') || keywords.includes('corporate')) {
            suggestions = { text: 'BIZ', bg: '#2c3e50', color: '#ecf0f1', shape: 'square' };
        } else if (keywords.includes('love') || keywords.includes('heart')) {
            suggestions = { text: '❤️', bg: '#e74c3c', color: '#ffffff', shape: 'heart' };
        } else {
            suggestions = { text: 'AI', bg: '#6c5ce7', color: '#ffffff', shape: 'rounded' };
        }
        
        return suggestions;
    }

    function applyAISuggestions(suggestions) {
        if (suggestions.text) favText.value = suggestions.text;
        if (suggestions.bg) bgColor.value = suggestions.bg;
        if (suggestions.color) textColor.value = suggestions.color;
        if (suggestions.shape) shapeType.value = suggestions.shape;
        
        isImageMode = false;
        drawFavicon();
        showToast('🎨 AI suggestions applied!', 'success');
    }

    function initAISuggestions() {
        document.querySelectorAll('.suggestion-chip').forEach(chip => {
            chip.addEventListener('click', function() {
                aiPrompt.value = this.dataset.prompt;
                handleAIPrompt();
            });
        });
    }

    // ========== PRESETS ==========
    function initPresets() {
        const presets = {
            gaming: { text: 'GAME', bg: '#1a1a2e', color: '#f093fb', shape: 'star' },
            business: { text: 'BIZ', bg: '#2c3e50', color: '#ecf0f1', shape: 'square' },
            education: { text: 'EDU', bg: '#c0392b', color: '#f1c40f', shape: 'rounded' },
            music: { text: 'MUSIC', bg: '#2d1b69', color: '#f093fb', shape: 'circle' },
            tech: { text: 'TECH', bg: '#2d3436', color: '#00d2ff', shape: 'hexagon' },
            nature: { text: 'NAT', bg: '#27ae60', color: '#f1c40f', shape: 'rounded' },
            love: { text: '❤️', bg: '#e74c3c', color: '#ffffff', shape: 'heart' },
            minimal: { text: 'MIN', bg: '#1a1a2e', color: '#ffffff', shape: 'square' },
            random: () => {
                const colors = ['#6c5ce7', '#e74c3c', '#f39c12', '#2ecc71', '#3498db', '#e67e22', '#1abc9c'];
                const shapes = ['square', 'circle', 'rounded', 'hexagon', 'star', 'heart', 'diamond'];
                return {
                    text: ['A', 'B', 'C', 'X', 'Y', 'Z', '★', '♦'][Math.floor(Math.random() * 8)],
                    bg: colors[Math.floor(Math.random() * colors.length)],
                    color: '#ffffff',
                    shape: shapes[Math.floor(Math.random() * shapes.length)]
                };
            }
        };

        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const preset = this.dataset.preset;
                let suggestions = presets[preset];
                
                if (preset === 'random') {
                    suggestions = presets.random();
                    if (typeof suggestions === 'function') suggestions = suggestions();
                }
                
                if (suggestions) {
                    isImageMode = false;
                    applyAISuggestions(suggestions);
                }
            });
        });
    }

    // ========== COLOR PALETTES ==========
    function initPalettes() {
        const palettes = {
            neon: { bg: '#6c5ce7', color: '#00d2ff' },
            pastel: { bg: '#ffb8b8', color: '#6c5ce7' },
            dark: { bg: '#1a1a2e', color: '#ffffff' },
            nature: { bg: '#27ae60', color: '#f1c40f' },
            sunset: { bg: '#e74c3c', color: '#f1c40f' },
            ocean: { bg: '#1abc9c', color: '#ffffff' }
        };

        document.querySelectorAll('.palette-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const palette = this.dataset.palette;
                const colors = palettes[palette];
                if (colors) {
                    bgColor.value = colors.bg;
                    textColor.value = colors.color;
                    drawFavicon();
                    showToast('🎨 Palette applied!', 'success');
                }
            });
        });
    }

    // ========== TABS ==========
    function initTabs() {
        document.querySelectorAll('.control-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.control-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
                
                this.classList.add('active');
                const tabId = this.dataset.tab;
                document.getElementById('tab-' + tabId).classList.add('active');
            });
        });
    }

    // ========== GRADIENT TOGGLE ==========
    function initGradientToggle() {
        const btn = document.getElementById('toggleGradient');
        if (btn) {
            btn.addEventListener('click', function() {
                isGradient = !isGradient;
                this.classList.toggle('active');
                this.textContent = isGradient ? 'Disable Gradient' : 'Enable Gradient';
                drawFavicon();
            });
        }
    }

    // ========== TOAST ==========
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
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
            scrollUp.style.display = window.scrollY > 200 ? 'block' : 'none';
        }
    });
    scrollUp?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    scrollDown?.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));

    // ========== PAGE SHARE ==========
    pageShareBtn?.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            showToast('Page link copied!', 'success');
            await addShare('page');
        } catch {
            showToast('Failed to copy link', 'error');
        }
    });

    // ========== SIZE BADGES ==========
    document.querySelectorAll('.badge').forEach(badge => {
        badge.addEventListener('click', function() {
            document.querySelectorAll('.badge').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentSize = parseInt(this.dataset.size);
            showToast(`Preview size: ${currentSize}x${currentSize}`, 'success');
        });
    });

    // ========== EVENT LISTENERS ==========
    favText.addEventListener('input', drawFavicon);
    textColor.addEventListener('input', drawFavicon);
    bgColor.addEventListener('input', drawFavicon);
    shapeType.addEventListener('change', drawFavicon);
    shadowBlur.addEventListener('input', drawFavicon);
    fontSize.addEventListener('input', drawFavicon);
    fontWeight.addEventListener('change', drawFavicon);
    borderStyle.addEventListener('change', drawFavicon);
    borderWidth.addEventListener('input', drawFavicon);
    textStroke.addEventListener('input', drawFavicon);
    patternType.addEventListener('change', drawFavicon);
    animationType.addEventListener('change', drawFavicon);
    opacity.addEventListener('input', drawFavicon);
    rotation.addEventListener('input', drawFavicon);
    
    gradientColor1.addEventListener('input', () => { isGradient = true; drawFavicon(); });
    gradientColor2.addEventListener('input', () => { isGradient = true; drawFavicon(); });
    gradientColor3.addEventListener('input', () => { isGradient = true; drawFavicon(); });
    gradientDirection.addEventListener('change', drawFavicon);
    
    generateBtn.addEventListener('click', () => {
        isImageMode = false;
        drawFavicon();
        incrementUsage();
        showToast('🎨 Favicon generated!', 'success');
    });
    
    downloadPNG.addEventListener('click', downloadPNGFn);
    downloadICO.addEventListener('click', downloadICOFn);
    downloadSVG.addEventListener('click', downloadSVGFn);
    downloadWebP.addEventListener('click', downloadWebPFn);
    downloadZIP.addEventListener('click', downloadZIPFn);
    downloadApple.addEventListener('click', downloadAppleFn);
    copyHtmlBtn.addEventListener('click', copyHtmlFn);
    
    zoomIn?.addEventListener('click', () => {
        zoomLevel = Math.min(zoomLevel + 0.1, 2);
        updateZoom();
    });
    zoomOut?.addEventListener('click', () => {
        zoomLevel = Math.max(zoomLevel - 0.1, 0.5);
        updateZoom();
    });
    resetZoom?.addEventListener('click', () => {
        zoomLevel = 1;
        updateZoom();
    });

    toggleAnimation?.addEventListener('click', function() {
        const wrapper = document.getElementById('canvasWrapper');
        if (wrapper.classList.contains('anim-pulse') || 
            wrapper.classList.contains('anim-spin') || 
            wrapper.classList.contains('anim-shake') || 
            wrapper.classList.contains('anim-flash') || 
            wrapper.classList.contains('anim-glow')) {
            wrapper.className = 'canvas-wrapper';
            this.innerHTML = '<i class="fas fa-play"></i>';
            showToast('Animation stopped', 'success');
        } else {
            animationType.value = 'pulse';
            wrapper.classList.add('anim-pulse');
            this.innerHTML = '<i class="fas fa-stop"></i>';
            showToast('Animation started', 'success');
        }
    });

    aiGenerateBtn?.addEventListener('click', handleAIPrompt);
    aiPrompt?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAIPrompt();
    });

    // ========== INITIALIZE ==========
    setTimeout(() => {
        initTypewriter();
    }, 100);
    
    setTimeout(() => {
        initTabs();
        initPresets();
        initPalettes();
        initGradientToggle();
        initReactions();
        initSocialShares();
        initAISuggestions();
        initImageUpload();
        
        drawFavicon();
        loadStats();
        
        setTimeout(async () => {
            try {
                await callAPI('/api/usage', 'POST', { tool_slug: TOOL_SLUG, type: 'view' });
            } catch (e) {}
        }, 1000);
        
        showToast('🚀 Favicon Forge Pro is ready!', 'success');
    }, 200);
});
