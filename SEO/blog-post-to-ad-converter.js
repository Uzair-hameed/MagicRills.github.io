/* ============================================
   FILE: blog-post-to-ad-converter.js
   Blog to Ad Converter Pro - FINAL
   With AllOrigins.win + Multiple Proxy Support
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ==========================================
    // ===== CONFIGURATION =====
    // ==========================================
    
    const TOOL_NAME = 'Blog to Ad Converter';
    const TOOL_SLUG = 'blog-to-ad-converter';
    const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';
    const API_KEY = 'magicrills-grok-api.uzairhameed01.workers.dev';
    
    let sessionId = localStorage.getItem('blog_converter_session');
    if (!sessionId) {
        sessionId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('blog_converter_session', sessionId);
    }
    
    let brandColor = localStorage.getItem('blog_brand_color') || '#6C63FF';
    let adStyle = 'full';
    let detectedLanguage = 'english';
    let currentPlatform = 'facebook';
    let currentTemplate = 'modern';
    
    // Text editing states
    let textState = {
        bold: false,
        italic: false,
        underline: false,
        fontSize: 16,
        color: '#ffffff',
        align: 'center'
    };
    
    let fetchedImageUrl = null;
    let fetchedTitle = null;
    
    // ==========================================
    // ===== DOM ELEMENTS =====
    // ==========================================
    
    const blogTitle = document.getElementById('blogTitle');
    const blogContent = document.getElementById('blogContent');
    const postUrl = document.getElementById('postUrl');
    const fetchUrlBtn = document.getElementById('fetchUrlBtn');
    const urlPreview = document.getElementById('urlPreview');
    const adTemplate = document.getElementById('adTemplate');
    const platformSelect = document.getElementById('platformSelect');
    const adStyleSelect = document.getElementById('adStyleSelect');
    const generateBtn = document.getElementById('generateBtn');
    const adDesign = document.getElementById('adDesign');
    const outputContainer = document.getElementById('outputContainer');
    const toolUsageCount = document.getElementById('toolUsageCount');
    const totalConversions = document.getElementById('totalConversions');
    const totalReactions = document.getElementById('totalReactions');
    const totalShares = document.getElementById('totalShares');
    const totalViews = document.getElementById('totalViews');
    const detectedLangEl = document.getElementById('detectedLanguage');
    const adInfoText = document.getElementById('adInfoText');
    
    // Text editing elements
    const boldBtn = document.getElementById('boldBtn');
    const italicBtn = document.getElementById('italicBtn');
    const underlineBtn = document.getElementById('underlineBtn');
    const fontSizeRange = document.getElementById('fontSizeRange');
    const fontSizeLabel = document.getElementById('fontSizeLabel');
    const textColorPicker = document.getElementById('textColorPicker');
    const alignLeftBtn = document.getElementById('alignLeftBtn');
    const alignCenterBtn = document.getElementById('alignCenterBtn');
    const alignRightBtn = document.getElementById('alignRightBtn');
    
    // Copy buttons
    const copyHeadlineBtn = document.getElementById('copyHeadlineBtn');
    const copyBodyBtn = document.getElementById('copyBodyBtn');
    const copyAllBtn = document.getElementById('copyAllBtn');
    const copyUrlBtn = document.getElementById('copyUrlBtn');
    
    // ==========================================
    // ===== LANGUAGE DETECTION =====
    // ==========================================
    
    function detectLanguage(text) {
        if (!text || text.trim().length === 0) return 'english';
        if (/[\u0600-\u06FF]/.test(text)) {
            if (/[\u0679\u067E\u0686\u0688\u0691\u06A9\u06AF\u06BE\u06C1\u06CC]/.test(text)) {
                return 'urdu';
            }
            return 'arabic';
        }
        if (/[\u0621-\u064A]/.test(text)) {
            return 'arabic';
        }
        return 'english';
    }
    
    function updateLanguageBadge(lang) {
        if (!detectedLangEl) return;
        const labels = { urdu: '🇵🇰 Urdu', arabic: '🇸🇦 Arabic', english: '🇬🇧 English' };
        const classes = { urdu: 'urdu', arabic: 'arabic', english: 'english' };
        detectedLangEl.className = `lang-badge ${classes[lang] || 'english'}`;
        detectedLangEl.innerHTML = `<i class="fas fa-globe"></i> Detected: ${labels[lang] || 'English'}`;
    }
    
    // ==========================================
    // ===== TEXT PROCESSING =====
    // ==========================================
    
    function splitSentences(text, language) {
        let separators;
        if (language === 'urdu') {
            separators = /[۔!؟]+/;
        } else if (language === 'arabic') {
            separators = /[.!؟]+/;
        } else {
            separators = /[.!?]+/;
        }
        return text.split(separators).filter(s => s.trim().length > 0);
    }
    
    function extractKeyPoints(text, language, maxPoints = 6) {
        const sentences = splitSentences(text, language);
        const filtered = sentences.filter(s => {
            const words = s.trim().split(/\s+/).length;
            return words > 4 && words < 30;
        });
        return filtered.slice(0, maxPoints).map(s => s.trim());
    }
    
    function generateHeadline(title, text, language) {
        if (title && title.trim().length > 0) {
            return title.trim();
        }
        const sentences = splitSentences(text, language);
        if (sentences.length > 0 && sentences[0].trim().length > 5) {
            return sentences[0].trim();
        }
        return language === 'urdu' ? 'شاندار مواد!' : 'Amazing Content!';
    }
    
    function generateHashtags(text, language, count = 5) {
        const words = text.split(/\s+/).filter(w => w.length > 3);
        const unique = [...new Set(words)];
        const shuffled = unique.sort(() => 0.5 - Math.random());
        const tags = shuffled.slice(0, count).map(w => {
            const clean = w.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '').toLowerCase();
            return clean.length > 0 ? '#' + clean : '';
        });
        return tags.filter(t => t.length > 1);
    }
    
    function generateCTA(language, style) {
        const ctas = {
            urdu: {
                full: 'مکمل آرٹیکل پڑھیں →',
                keypoints: 'اہم نکات دیکھیں →',
                headline: '🔥 مزید جاننے کے لیے کلک کریں →',
                cta: 'آج ہی شروع کریں →',
                quote: 'اس اقتباس کو شیئر کریں →',
                story: 'پوری کہانی پڑھیں →',
                question: 'جواب جانیں →',
                statistics: 'مکمل اعداد و شمار دیکھیں →',
                comparison: 'موازنہ دیکھیں →',
                testimonial: 'مزید تجربات پڑھیں →',
                urgent: 'ابھی کارروائی کریں →',
                educational: 'مزید سیکھیں →',
                inspirational: 'متاثر ہوں →',
                'problem-solution': 'حل جانیں →',
                list: 'مکمل لسٹ دیکھیں →'
            },
            english: {
                full: 'Read Full Article →',
                keypoints: 'See Key Points →',
                headline: '🔥 Click to Learn More →',
                cta: 'Get Started Today →',
                quote: 'Share This Quote →',
                story: 'Read Full Story →',
                question: 'Find the Answer →',
                statistics: 'View Full Statistics →',
                comparison: 'See Comparison →',
                testimonial: 'Read More Testimonials →',
                urgent: 'Take Action Now →',
                educational: 'Learn More →',
                inspirational: 'Get Inspired →',
                'problem-solution': 'Find the Solution →',
                list: 'View Full List →'
            }
        };
        const langCt = ctas[language] || ctas.english;
        return langCt[style] || langCt.full;
    }
    
    function processArticle(title, content, style, language) {
        const result = {
            headline: generateHeadline(title, content, language),
            body: '',
            keyPoints: [],
            cta: generateCTA(language, style),
            hashtags: generateHashtags(content, language, 5),
            quote: '',
            stats: [],
            comparison: [],
            list: []
        };
        
        const sentences = splitSentences(content, language);
        const keyPoints = extractKeyPoints(content, language, 6);
        
        switch(style) {
            case 'full':
                result.body = sentences.slice(0, 5).join('. ') + '.';
                result.keyPoints = keyPoints.slice(0, 4);
                break;
            case 'keypoints':
                result.keyPoints = keyPoints.slice(0, 6);
                result.body = result.keyPoints.join('  ');
                break;
            case 'headline':
                result.headline = '🔥 ' + result.headline;
                result.body = sentences.slice(0, 3).join('. ') + '.';
                break;
            case 'cta':
                result.headline = title || (language === 'urdu' ? 'خصوصی پیشکش!' : 'Special Offer!');
                result.body = sentences.slice(0, 2).join('. ') + '.';
                break;
            case 'quote':
                const longSentences = sentences.filter(s => s.split(/\s+/).length > 8);
                result.quote = longSentences.length > 0 ? longSentences[0] : sentences[0] || content.slice(0, 100);
                result.body = result.quote;
                break;
            case 'story':
                result.headline = '📖 ' + (title || (language === 'urdu' ? 'ایک دلچسپ کہانی' : 'An Interesting Story'));
                result.body = sentences.slice(0, 4).join('. ') + '...';
                break;
            case 'question':
                const qSentences = sentences.filter(s => s.includes('؟') || s.includes('?'));
                result.headline = qSentences.length > 0 ? qSentences[0] : (language === 'urdu' ? 'کیا آپ جانتے ہیں؟' : 'Did You Know?');
                result.body = sentences.slice(0, 3).join('. ') + '.';
                break;
            case 'statistics':
                const numSentences = sentences.filter(s => /\d+/.test(s));
                result.headline = title || (language === 'urdu' ? 'اعداد و شمار میں حقیقت' : 'Facts in Numbers');
                result.body = numSentences.slice(0, 4).join('. ') + '.';
                result.stats = numSentences.slice(0, 3);
                break;
            case 'comparison':
                result.headline = title || (language === 'urdu' ? 'موازنہ' : 'Comparison');
                const pairs = sentences.slice(0, 4);
                result.comparison = pairs;
                result.body = pairs.join('  ');
                break;
            case 'testimonial':
                result.headline = '⭐ ' + (title || (language === 'urdu' ? 'لوگ کیا کہتے ہیں' : 'What People Say'));
                const testSentences = sentences.filter(s => s.includes('میں') || s.includes('I'));
                result.body = testSentences.length > 0 ? testSentences[0] : sentences[0] || content.slice(0, 100);
                break;
            case 'urgent':
                result.headline = '🚨 ' + (title || (language === 'urdu' ? 'فوری کارروائی کی ضرورت!' : 'Urgent Action Needed!'));
                result.body = sentences.slice(0, 3).join('. ') + '.';
                result.cta = language === 'urdu' ? 'ابھی کلک کریں →' : 'Click Now →';
                break;
            case 'educational':
                result.headline = '🎓 ' + (title || (language === 'urdu' ? 'تعلیمی مواد' : 'Educational Content'));
                result.body = sentences.slice(0, 4).join('. ') + '.';
                result.keyPoints = keyPoints.slice(0, 3);
                break;
            case 'inspirational':
                const inspPrefix = ['🌟', '✨', '💪', '🔥'];
                result.headline = inspPrefix[Math.floor(Math.random() * inspPrefix.length)] + ' ' + (title || (language === 'urdu' ? 'متاثر کن پیغام' : 'Inspiring Message'));
                result.body = sentences.slice(0, 3).join('. ') + '.';
                break;
            case 'problem-solution':
                result.headline = '🔧 ' + (title || (language === 'urdu' ? 'مسئلہ اور حل' : 'Problem & Solution'));
                const probSent = sentences.slice(0, 2);
                result.body = probSent.join('. ') + '.';
                result.keyPoints = keyPoints.slice(0, 3);
                break;
            case 'list':
                result.headline = '📋 ' + (title || (language === 'urdu' ? 'اہم نکات' : 'Key Points'));
                result.list = keyPoints.slice(0, 6);
                result.body = result.list.map((p, i) => `${i+1}. ${p}`).join('  ');
                break;
            default:
                result.body = sentences.slice(0, 4).join('. ') + '.';
                result.keyPoints = keyPoints.slice(0, 3);
        }
        
        return result;
    }
    
    // ==========================================
    // ===== URL FETCH - MULTIPLE PROXY SUPPORT =====
    // ==========================================
    
    async function fetchUrlWithAllOrigins(url) {
        if (!url || !url.startsWith('http')) {
            showToast('Please enter a valid URL (e.g., https://example.com)', 'error');
            return;
        }
        
        fetchUrlBtn.classList.add('loading');
        fetchUrlBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Fetching...';
        
        // ===== Try multiple proxies =====
        const proxies = [
            `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
            `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
            `https://cors-anywhere.herokuapp.com/${url}`,
            `https://api.thingproxy.com/fetch/${url}`
        ];
        
        let html = null;
        let usedProxy = '';
        
        for (const proxy of proxies) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000);
                
                const response = await fetch(proxy, {
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (response.ok) {
                    const contentType = response.headers.get('content-type') || '';
                    if (contentType.includes('json')) {
                        const data = await response.json();
                        html = data.contents || data.response || data;
                    } else {
                        html = await response.text();
                    }
                    usedProxy = proxy;
                    break;
                }
            } catch (e) {
                console.log('Proxy failed:', proxy, e.message);
                continue;
            }
        }
        
        if (!html) {
            showToast('Unable to fetch URL. Please try again.', 'error');
            fetchUrlBtn.classList.remove('loading');
            fetchUrlBtn.innerHTML = '<i class="fas fa-cloud-download-alt"></i> Fetch';
            return;
        }
        
        try {
            // ===== Extract Image =====
            let imageUrl = null;
            const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
            if (ogMatch && ogMatch[1]) {
                imageUrl = ogMatch[1];
            }
            
            if (!imageUrl) {
                const twMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);
                if (twMatch && twMatch[1]) {
                    imageUrl = twMatch[1];
                }
            }
            
            if (!imageUrl) {
                const imgMatch = html.match(/<img[^>]*src=["']([^"']+)["'][^>]*>/i);
                if (imgMatch && imgMatch[1]) {
                    imageUrl = imgMatch[1];
                    if (imageUrl.startsWith('/')) {
                        const baseUrl = new URL(url);
                        imageUrl = baseUrl.origin + imageUrl;
                    } else if (imageUrl.startsWith('//')) {
                        imageUrl = 'https:' + imageUrl;
                    }
                }
            }
            
            // ===== Extract Title =====
            let title = null;
            const titleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
            if (titleMatch && titleMatch[1]) {
                title = titleMatch[1];
            }
            if (!title) {
                const twTitleMatch = html.match(/<meta[^>]*name=["']twitter:title["'][^>]*content=["']([^"']+)["']/i);
                if (twTitleMatch && twTitleMatch[1]) {
                    title = twTitleMatch[1];
                }
            }
            if (!title) {
                const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
                if (h1Match && h1Match[1]) {
                    title = h1Match[1];
                }
            }
            
            if (imageUrl) {
                fetchedImageUrl = imageUrl;
                fetchedTitle = title;
                
                urlPreview.style.display = 'block';
                urlPreview.innerHTML = `
                    <div class="result-card">
                        <img src="${imageUrl}" alt="Preview" onerror="this.style.display='none'" />
                        <div class="info">
                            <p>${title || 'Image Fetched'}</p>
                            <small>${url}</small>
                        </div>
                        <button class="remove-btn" onclick="removeFetchedImage()"><i class="fas fa-times"></i> Remove</button>
                    </div>
                `;
                
                if (title && !blogTitle.value) {
                    blogTitle.value = title;
                }
                
                showToast('✅ Image fetched successfully!', 'success');
            } else {
                showToast('No image found in this URL', 'error');
                urlPreview.style.display = 'none';
            }
        } catch (error) {
            console.error('Error parsing HTML:', error);
            showToast('Error parsing content', 'error');
            urlPreview.style.display = 'none';
        } finally {
            fetchUrlBtn.classList.remove('loading');
            fetchUrlBtn.innerHTML = '<i class="fas fa-cloud-download-alt"></i> Fetch';
            renderAd();
        }
    }
    
    window.removeFetchedImage = function() {
        fetchedImageUrl = null;
        fetchedTitle = null;
        urlPreview.style.display = 'none';
        renderAd();
        showToast('Image removed', 'success');
    };
    
    fetchUrlBtn?.addEventListener('click', () => {
        fetchUrlWithAllOrigins(postUrl.value);
    });
    
    postUrl?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            fetchUrlWithAllOrigins(postUrl.value);
        }
    });
    
    // ==========================================
    // ===== TOAST NOTIFICATION =====
    // ==========================================
    
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
    
    // ==========================================
    // ===== COPY TEXT FUNCTIONS =====
    // ==========================================
    
    function getCurrentAdText() {
        const title = blogTitle?.value || '';
        const content = blogContent?.value || '';
        const style = adStyleSelect?.value || 'full';
        const processed = processArticle(title, content, style, detectedLanguage);
        return {
            headline: processed.headline,
            body: processed.body,
            full: `${processed.headline}\n\n${processed.body}\n\n${processed.cta}\n\n${processed.hashtags.join(' ')}`,
            url: postUrl?.value || ''
        };
    }
    
    async function copyText(text, label) {
        try {
            await navigator.clipboard.writeText(text);
            showToast(`✅ ${label} copied!`, 'success');
        } catch (error) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            textarea.remove();
            showToast(`✅ ${label} copied!`, 'success');
        }
    }
    
    copyHeadlineBtn?.addEventListener('click', () => {
        const text = getCurrentAdText();
        copyText(text.headline, 'Headline');
    });
    
    copyBodyBtn?.addEventListener('click', () => {
        const text = getCurrentAdText();
        copyText(text.body, 'Body');
    });
    
    copyAllBtn?.addEventListener('click', () => {
        const text = getCurrentAdText();
        copyText(text.full, 'All Text');
    });
    
    copyUrlBtn?.addEventListener('click', () => {
        const text = getCurrentAdText();
        if (text.url) {
            copyText(text.url, 'URL');
        } else {
            showToast('No URL to copy', 'error');
        }
    });
    
    // ==========================================
    // ===== TEXT EDITING FUNCTIONS =====
    // ==========================================
    
    function toggleBold() {
        textState.bold = !textState.bold;
        boldBtn.classList.toggle('active');
        renderAd();
    }
    
    function toggleItalic() {
        textState.italic = !textState.italic;
        italicBtn.classList.toggle('active');
        renderAd();
    }
    
    function toggleUnderline() {
        textState.underline = !textState.underline;
        underlineBtn.classList.toggle('active');
        renderAd();
    }
    
    function setAlign(align) {
        textState.align = align;
        [alignLeftBtn, alignCenterBtn, alignRightBtn].forEach(btn => btn.classList.remove('active'));
        if (align === 'left') alignLeftBtn.classList.add('active');
        else if (align === 'center') alignCenterBtn.classList.add('active');
        else if (align === 'right') alignRightBtn.classList.add('active');
        renderAd();
    }
    
    boldBtn?.addEventListener('click', toggleBold);
    italicBtn?.addEventListener('click', toggleItalic);
    underlineBtn?.addEventListener('click', toggleUnderline);
    alignLeftBtn?.addEventListener('click', () => setAlign('left'));
    alignCenterBtn?.addEventListener('click', () => setAlign('center'));
    alignRightBtn?.addEventListener('click', () => setAlign('right'));
    
    fontSizeRange?.addEventListener('input', function() {
        textState.fontSize = parseInt(this.value);
        fontSizeLabel.textContent = this.value;
        renderAd();
    });
    
    textColorPicker?.addEventListener('input', function() {
        textState.color = this.value;
        renderAd();
    });
    
    // ==========================================
    // ===== CLOUDFLARE API CALLS =====
    // ==========================================
    
    async function incrementUsage() {
        try {
            const response = await fetch(`${API_BASE}/api/usage`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-API-Key': API_KEY
                },
                body: JSON.stringify({ 
                    tool_slug: TOOL_SLUG,
                    session_id: sessionId 
                })
            });
            const data = await response.json();
            if (data.success) {
                updateUsageDisplay(data.total_usage || 0);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error incrementing usage:', error);
            const fallback = parseInt(localStorage.getItem('blog_converter_usage') || '0') + 1;
            updateUsageDisplay(fallback);
            return false;
        }
    }
    
    async function addReaction(reactionType) {
        try {
            const response = await fetch(`${API_BASE}/api/reactions`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-API-Key': API_KEY
                },
                body: JSON.stringify({ 
                    tool_slug: TOOL_SLUG,
                    reaction_type: reactionType,
                    session_id: sessionId 
                })
            });
            const data = await response.json();
            if (data.success) {
                updateReactionDisplay(data.reactions || {});
                return true;
            } else if (data.already_reacted) {
                showToast(`You already reacted with ${getReactionEmoji(reactionType)}!`, 'error');
                return false;
            }
            return false;
        } catch (error) {
            console.error('Error adding reaction:', error);
            const saved = JSON.parse(localStorage.getItem('blog_converter_reactions') || '{}');
            saved[reactionType] = (saved[reactionType] || 0) + 1;
            updateReactionDisplay(saved);
            return true;
        }
    }
    
    async function addShare(platform) {
        try {
            const response = await fetch(`${API_BASE}/api/shares`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-API-Key': API_KEY
                },
                body: JSON.stringify({ 
                    tool_slug: TOOL_SLUG,
                    platform: platform,
                    session_id: sessionId 
                })
            });
            const data = await response.json();
            if (data.success) {
                updateShareDisplay(data.total_shares || 0);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error adding share:', error);
            const fallback = parseInt(localStorage.getItem('blog_converter_shares') || '0') + 1;
            updateShareDisplay(fallback);
            return false;
        }
    }
    
    async function getStats() {
        try {
            const response = await fetch(`${API_BASE}/api/stats?tool_slug=${TOOL_SLUG}`, {
                headers: { 'X-API-Key': API_KEY }
            });
            const data = await response.json();
            if (data.success) {
                updateUsageDisplay(data.usage || 0);
                updateReactionDisplay(data.reactions || {});
                updateShareDisplay(data.shares || 0);
                updateViewDisplay(data.views || 0);
                return data;
            }
            return null;
        } catch (error) {
            console.error('Error getting stats:', error);
            loadFromLocalFallback();
            return null;
        }
    }
    
    // ==========================================
    // ===== DISPLAY UPDATE FUNCTIONS =====
    // ==========================================
    
    function updateUsageDisplay(usage) {
        const count = parseInt(usage) || 0;
        if (toolUsageCount) toolUsageCount.textContent = count;
        if (totalConversions) totalConversions.textContent = count;
        localStorage.setItem('blog_converter_usage', count);
    }
    
    function updateReactionDisplay(reactions) {
        if (!reactions || typeof reactions !== 'object') return;
        document.querySelectorAll('.reaction-btn').forEach(btn => {
            const reaction = btn.dataset.reaction;
            const countSpan = btn.querySelector('.reaction-count');
            if (countSpan && reactions[reaction] !== undefined) {
                countSpan.textContent = reactions[reaction];
            }
        });
        const total = Object.values(reactions).reduce((a, b) => a + b, 0);
        if (totalReactions) totalReactions.textContent = total;
        localStorage.setItem('blog_converter_reactions', JSON.stringify(reactions));
    }
    
    function updateShareDisplay(shares) {
        const count = parseInt(shares) || 0;
        if (totalShares) totalShares.textContent = count;
        localStorage.setItem('blog_converter_shares', count);
    }
    
    function updateViewDisplay(views) {
        const count = parseInt(views) || 0;
        if (totalViews) totalViews.textContent = count;
        localStorage.setItem('blog_converter_views', count);
    }
    
    function loadFromLocalFallback() {
        const usage = parseInt(localStorage.getItem('blog_converter_usage') || '0');
        const reactions = JSON.parse(localStorage.getItem('blog_converter_reactions') || '{}');
        const shares = parseInt(localStorage.getItem('blog_converter_shares') || '0');
        const views = parseInt(localStorage.getItem('blog_converter_views') || '0');
        updateUsageDisplay(usage);
        updateReactionDisplay(reactions);
        updateShareDisplay(shares);
        updateViewDisplay(views);
    }
    
    function getReactionEmoji(reaction) {
        const emojis = { like: '👍', love: '❤️', wow: '😮', sad: '😢', angry: '😠', laugh: '😂', celebrate: '🎉' };
        return emojis[reaction] || '👍';
    }
    
    // ==========================================
    // ===== REACTIONS EVENT =====
    // ==========================================
    
    function initReactions() {
        document.querySelectorAll('.reaction-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const reaction = this.dataset.reaction;
                const success = await addReaction(reaction);
                if (success) {
                    showToast(`${getReactionEmoji(reaction)} Reaction added!`);
                }
            });
        });
    }
    
    // ==========================================
    // ===== SOCIAL SHARES =====
    // ==========================================
    
    function initSocialShares() {
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const platform = this.dataset.platform;
                const url = window.location.href;
                let shareUrl = '';
                
                if (platform === 'copy') {
                    await navigator.clipboard.writeText(url);
                    showToast('Link copied to clipboard!');
                    await addShare('copy');
                    return;
                }
                
                switch(platform) {
                    case 'facebook': 
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`; 
                        break;
                    case 'twitter': 
                        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(TOOL_NAME)}&url=${encodeURIComponent(url)}`; 
                        break;
                    case 'linkedin': 
                        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`; 
                        break;
                    case 'whatsapp': 
                        shareUrl = `https://wa.me/?text=${encodeURIComponent(TOOL_NAME + ' ' + url)}`; 
                        break;
                    case 'email': 
                        shareUrl = `mailto:?subject=${encodeURIComponent(TOOL_NAME)}&body=${encodeURIComponent(url)}`; 
                        break;
                }
                
                if (shareUrl) {
                    window.open(shareUrl, '_blank');
                    await addShare(platform);
                    showToast(`Shared on ${platform}!`);
                }
            });
        });
    }
    
    // ==========================================
    // ===== PAGE SHARE =====
    // ==========================================
    
    document.getElementById('pageShareBtn')?.addEventListener('click', async () => {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Page link copied!');
    });
    
    // ==========================================
    // ===== SCROLL BUTTONS =====
    // ==========================================
    
    const scrollUp = document.getElementById('scrollUpBtn');
    const scrollDown = document.getElementById('scrollDownBtn');
    
    window.addEventListener('scroll', () => {
        if (scrollUp) {
            scrollUp.style.display = window.scrollY > 200 ? 'block' : 'none';
        }
    });
    
    scrollUp?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    scrollDown?.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
    
    // ==========================================
    // ===== BRAND COLOR =====
    // ==========================================
    
    window.setBrandColor = function(color) {
        brandColor = color;
        localStorage.setItem('blog_brand_color', color);
        document.querySelectorAll('.color-option').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.color-option').forEach(el => {
            const bg = el.style.background || el.style.backgroundColor;
            if (bg === color || bg === color.replace('#', '')) {
                el.classList.add('active');
            }
        });
        renderAd();
        showToast('Brand color updated!');
    };
    
    // ==========================================
    // ===== AD STYLE SELECTION (Dropdown) =====
    // ==========================================
    
    adStyleSelect?.addEventListener('change', function() {
        adStyle = this.value;
        renderAd();
    });
    
    // ==========================================
    // ===== RENDER AD (HTML/CSS) =====
    // ==========================================
    
    function renderAd() {
        const title = blogTitle?.value || '';
        const content = blogContent?.value || '';
        
        if (!content.trim()) {
            adDesign.innerHTML = `
                <div style="padding:60px 30px; text-align:center; color:var(--text-secondary);">
                    <i class="fas fa-file-alt" style="font-size:3rem; margin-bottom:15px; opacity:0.3;"></i>
                    <p>Paste your article content or enter URL above to generate an ad.</p>
                    <p style="font-size:0.9rem; margin-top:8px;">Supports Urdu, English & Arabic</p>
                </div>
            `;
            return;
        }
        
        // Detect language
        detectedLanguage = detectLanguage(content || title);
        updateLanguageBadge(detectedLanguage);
        
        currentTemplate = adTemplate?.value || 'modern';
        currentPlatform = platformSelect?.value || 'facebook';
        adStyle = adStyleSelect?.value || 'full';
        
        // Get platform dimensions
        let aspectRatio;
        switch(currentPlatform) {
            case 'facebook': aspectRatio = '1.91:1'; break;
            case 'instagram': aspectRatio = '1:1'; break;
            case 'twitter': aspectRatio = '16:9'; break;
            case 'story': aspectRatio = '9:16'; break;
            case 'linkedin': aspectRatio = '1.91:1'; break;
            case 'youtube': aspectRatio = '16:9'; break;
            case 'pinterest': aspectRatio = '2:3'; break;
            case 'tiktok': aspectRatio = '9:16'; break;
            case 'email': aspectRatio = '3:1'; break;
            case 'blog': aspectRatio = '3:1'; break;
            default: aspectRatio = '4:3';
        }
        
        // Process article
        const processed = processArticle(title, content, adStyle, detectedLanguage);
        
        // Build HTML ad
        const isUrdu = detectedLanguage === 'urdu';
        const isArabic = detectedLanguage === 'arabic';
        const langClass = isUrdu ? 'urdu' : isArabic ? 'arabic' : 'english';
        
        // Template styles
        let bgStyle = '';
        let textColor = textState.color || '#ffffff';
        let ctaColor = brandColor;
        
        switch(currentTemplate) {
            case 'modern':
                bgStyle = `background: linear-gradient(135deg, ${brandColor}, #7C3AED, #1a1a2e);`;
                break;
            case 'minimal':
                bgStyle = 'background: #ffffff;';
                textColor = textState.color === '#ffffff' ? '#1a1a2e' : textState.color;
                break;
            case 'bold':
                bgStyle = `background: radial-gradient(circle at center, ${brandColor}, #1a1a2e);`;
                break;
            case 'professional':
                bgStyle = 'background: #0a0a1a;';
                break;
            case 'glass':
                bgStyle = 'background: rgba(10,10,26,0.85); backdrop-filter: blur(20px);';
                break;
            case 'gradient':
                bgStyle = `background: linear-gradient(135deg, #6C63FF, ${brandColor}, #FF6584, #FFD700);`;
                break;
            case 'dark-neon':
                bgStyle = `background: linear-gradient(135deg, #0a0a1a, ${brandColor}44, #0a0a1a);`;
                textColor = textState.color || '#00ff88';
                break;
            case 'pastel':
                bgStyle = `background: linear-gradient(135deg, #fce4ec, #f3e5f5, #e8eaf6);`;
                textColor = textState.color === '#ffffff' ? '#4a148c' : textState.color;
                break;
            case 'retro':
                bgStyle = `background: linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb);`;
                break;
            case 'magazine':
                bgStyle = `background: #ffffff; border: 4px solid ${brandColor};`;
                textColor = textState.color === '#ffffff' ? '#1a1a2e' : textState.color;
                break;
            case 'luxury':
                bgStyle = `background: linear-gradient(135deg, #1a1a2e, #2d2d44, #1a1a2e);`;
                textColor = textState.color || '#ffd700';
                break;
            default:
                bgStyle = `background: linear-gradient(135deg, ${brandColor}, #1a1a2e);`;
        }
        
        // Get font style
        const fontWeight = textState.bold ? 'bold' : 'normal';
        const fontStyleStr = textState.italic ? 'italic' : 'normal';
        const textDecoration = textState.underline ? 'underline' : 'none';
        const align = textState.align === 'left' ? 'left' : textState.align === 'right' ? 'right' : 'center';
        
        // Build key points HTML
        let keyPointsHTML = '';
        if ((adStyle === 'keypoints' || adStyle === 'list' || adStyle === 'educational' || adStyle === 'problem-solution') && processed.keyPoints.length > 0) {
            const points = adStyle === 'list' ? processed.list : processed.keyPoints;
            keyPointsHTML = `<div class="ad-keypoints ${langClass}" style="text-align:${align};">`;
            (points || []).slice(0, 6).forEach((point, idx) => {
                const prefix = adStyle === 'list' ? `${idx+1}.` : '•';
                keyPointsHTML += `<div class="kp-item ${langClass}">${prefix} ${point}</div>`;
            });
            keyPointsHTML += `</div>`;
        }
        
        // Build body HTML
        let bodyHTML = '';
        if (adStyle === 'quote') {
            bodyHTML = `<div class="ad-body ${langClass}" style="font-style:italic; text-align:${align};">"${processed.body}"</div>`;
        } else if (adStyle === 'keypoints' || adStyle === 'list') {
            bodyHTML = keyPointsHTML;
        } else if (adStyle === 'statistics' && processed.stats.length > 0) {
            bodyHTML = `<div class="ad-body ${langClass}" style="text-align:${align}; font-weight:bold;">${processed.stats.join(' | ')}</div>`;
        } else {
            bodyHTML = `<div class="ad-body ${langClass}" style="text-align:${align};">${processed.body}</div>`;
        }
        
        // Build hashtags HTML
        let hashtagsHTML = '';
        if (processed.hashtags && processed.hashtags.length > 0) {
            hashtagsHTML = `<div class="ad-hashtags ${langClass}" style="text-align:${align};">${processed.hashtags.join(' ')}</div>`;
        }
        
        // Build URL HTML
        let urlHTML = '';
        if (postUrl.value) {
            urlHTML = `<div class="ad-url ${langClass}" style="text-align:${align};">🔗 ${postUrl.value}</div>`;
        }
        
        // Build image HTML
        let imageHTML = '';
        if (fetchedImageUrl) {
            imageHTML = `<div class="ad-image"><img src="${fetchedImageUrl}" alt="Post Image" onerror="this.style.display='none'" /></div>`;
        }
        
        // Build ad HTML
        const adHTML = `
            <div class="ad-preview" style="${bgStyle} color: ${textColor}; padding: 40px 35px; min-height: 300px; position: relative; overflow: hidden; width: 100%; border-radius: 12px;">
                <div class="ad-bg-decoration d1"></div>
                <div class="ad-bg-decoration d2"></div>
                
                ${imageHTML}
                
                <div class="ad-headline ${langClass}" style="font-size: ${textState.fontSize + 8}px; font-weight: ${fontWeight}; font-style: ${fontStyleStr}; text-decoration: ${textDecoration}; text-align: ${align}; margin-bottom: 15px; position: relative; z-index: 1;">
                    ${processed.headline}
                </div>
                
                ${bodyHTML}
                
                <div class="ad-cta ${langClass}" style="display: inline-block; padding: ${isUrdu ? '14px 40px' : '12px 35px'}; border-radius: 50px; font-weight: 700; font-size: ${isUrdu ? '1.3rem' : isArabic ? '1.2rem' : '1.1rem'}; border: none; cursor: default; position: relative; z-index: 1; align-self: center; margin-top: 10px; background: ${ctaColor}; color: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
                    ${processed.cta}
                </div>
                
                ${urlHTML}
                ${hashtagsHTML}
            </div>
        `;
        
        adDesign.innerHTML = adHTML;
        
        // Update info text
        const langNames = { urdu: 'Urdu', arabic: 'Arabic', english: 'English' };
        const styleNames = {
            full: 'Full Article', keypoints: 'Key Points', headline: 'Headline Focus',
            cta: 'CTA Focus', quote: 'Quote', story: 'Story', question: 'Question',
            statistics: 'Statistics', comparison: 'Comparison', testimonial: 'Testimonial',
            urgent: 'Urgent', educational: 'Educational', inspirational: 'Inspirational',
            'problem-solution': 'Problem-Solution', list: 'List'
        };
        if (adInfoText) {
            adInfoText.textContent = `Detected: ${langNames[detectedLanguage] || 'English'} | Style: ${styleNames[adStyle] || adStyle} | Platform: ${currentPlatform} (${aspectRatio})`;
        }
    }
    
    // ==========================================
    // ===== GENERATE AD =====
    // ==========================================
    
    async function generateAd() {
        const content = blogContent?.value || '';
        if (!content.trim()) {
            showToast('Please paste some article content first!', 'error');
            return;
        }
        
        await incrementUsage();
        renderAd();
        showToast('✨ Ad generated successfully!');
    }
    
    generateBtn?.addEventListener('click', generateAd);
    
    // ==========================================
    // ===== DOWNLOAD FUNCTIONS (html2canvas) =====
    // ==========================================
    
    async function downloadAd(format) {
        const adElement = adDesign.querySelector('.ad-preview');
        if (!adElement) {
            showToast('Please generate an ad first!', 'error');
            return;
        }
        
        try {
            const canvas = await html2canvas(adElement, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                logging: false,
                width: adElement.scrollWidth,
                height: adElement.scrollHeight
            });
            
            const link = document.createElement('a');
            const mime = format === 'png' ? 'image/png' : 'image/jpeg';
            link.download = `ad.${format}`;
            link.href = canvas.toDataURL(mime, 0.95);
            link.click();
            showToast(`Downloaded as ${format.toUpperCase()}`);
        } catch (error) {
            console.error('Error downloading ad:', error);
            showToast('Error downloading ad. Please try again.', 'error');
        }
    }
    
    async function copyAdToClipboard() {
        const adElement = adDesign.querySelector('.ad-preview');
        if (!adElement) {
            showToast('Please generate an ad first!', 'error');
            return;
        }
        
        try {
            const canvas = await html2canvas(adElement, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                logging: false
            });
            
            canvas.toBlob(blob => {
                navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                showToast('Image copied to clipboard!');
            });
        } catch (error) {
            console.error('Error copying ad:', error);
            showToast('Error copying ad. Please try again.', 'error');
        }
    }
    
    document.getElementById('downloadPngBtn')?.addEventListener('click', () => downloadAd('png'));
    document.getElementById('downloadJpgBtn')?.addEventListener('click', () => downloadAd('jpg'));
    document.getElementById('copyImageBtn')?.addEventListener('click', copyAdToClipboard);
    
    // ==========================================
    // ===== AUTO-SAVE INPUTS =====
    // ==========================================
    
    function autoSave() {
        localStorage.setItem('blog_converter_title', blogTitle?.value || '');
        localStorage.setItem('blog_converter_content', blogContent?.value || '');
        localStorage.setItem('blog_converter_url', postUrl?.value || '');
    }
    
    blogTitle?.addEventListener('input', () => { autoSave(); renderAd(); });
    blogContent?.addEventListener('input', () => { 
        autoSave(); 
        const lang = detectLanguage(blogContent.value);
        updateLanguageBadge(lang);
        renderAd();
    });
    postUrl?.addEventListener('input', autoSave);
    adTemplate?.addEventListener('change', renderAd);
    platformSelect?.addEventListener('change', renderAd);
    adStyleSelect?.addEventListener('change', renderAd);
    
    function loadSavedInputs() {
        const savedTitle = localStorage.getItem('blog_converter_title');
        const savedContent = localStorage.getItem('blog_converter_content');
        const savedUrl = localStorage.getItem('blog_converter_url');
        if (savedTitle && blogTitle) blogTitle.value = savedTitle;
        if (savedContent && blogContent) blogContent.value = savedContent;
        if (savedUrl && postUrl) postUrl.value = savedUrl;
    }
    
    // ==========================================
    // ===== TYPEWRITER ANIMATION =====
    // ==========================================
    
    function initTypewriter() {
        const element = document.getElementById('typewriterText');
        if (!element) return;
        const texts = [
            'Stunning Social Media Ad',
            'Professional Brand Ad',
            'Viral Content Ad',
            'Engaging Post Ad',
            'Beautiful Ad Design',
            'Professional Article Ad'
        ];
        let index = 0;
        
        setInterval(() => {
            element.classList.remove('typewriter-text');
            void element.offsetWidth;
            element.textContent = texts[index % texts.length];
            element.classList.add('typewriter-text');
            index++;
        }, 4000);
    }
    
    // ==========================================
    // ===== INITIALIZE =====
    // ==========================================
    
    async function init() {
        loadSavedInputs();
        initReactions();
        initSocialShares();
        initTypewriter();
        
        textColorPicker.value = '#ffffff';
        
        await getStats();
        await incrementUsage();
        
        const content = blogContent?.value || '';
        detectedLanguage = detectLanguage(content);
        updateLanguageBadge(detectedLanguage);
        
        renderAd();
        showToast('🚀 Blog to Ad Converter Pro Ready!', 'success');
    }
    
    init();
});
