// ============================================
// MAGICRILLS - اردو کلیدی الفاظ جنریٹر
// ورژن 10.0 - صرف ریئل ڈیٹا (کوئی فیک نہیں)
// ============================================

(function() {
    'use strict';

    // ===== CONFIGURATION =====
    const CONFIG = {
        TOOL_SLUG: 'urdu-keyword-generator',
        WORKER_URL: 'https://urdu-key-word-gen.uzairhameed01.workers.dev'
    };

    // ===== DOM ELEMENTS =====
    const DOM = {
        topicInput: document.getElementById('topicInput'),
        generateBtn: document.getElementById('generateBtn'),
        keywordsContainer: document.getElementById('keywordsContainer'),
        questionsContainer: document.getElementById('questionsContainer'),
        trendingContainer: document.getElementById('trendingContainer'),
        lsiContainer: document.getElementById('lsiContainer'),
        totalSpan: document.getElementById('totalKeywordsSpan'),
        resultRange: document.getElementById('resultRange'),
        resultCountValue: document.getElementById('resultCountValue'),
        copyAllBtn: document.getElementById('copyAllBtn'),
        downloadTxtBtn: document.getElementById('downloadTxtBtn'),
        downloadCsvBtn: document.getElementById('downloadCsvBtn'),
        downloadJsonBtn: document.getElementById('downloadJsonBtn'),
        clearResultsBtn: document.getElementById('clearResultsBtn'),
        usageDisplay: document.getElementById('usageCountDisplay'),
        sharePageBtn: document.getElementById('sharePageBtn'),
        scrollUpBtn: document.getElementById('scrollUpBtn'),
        scrollDownBtn: document.getElementById('scrollDownBtn'),
        toastDiv: document.getElementById('toastMessage'),
        filterBtns: document.querySelectorAll('.filter-btn'),
        tabBtns: document.querySelectorAll('.tab-btn'),
        reactionBtns: document.querySelectorAll('.reaction-btn'),
        socialBtns: document.querySelectorAll('.social-btn'),
        typewriterElement: document.getElementById('typewriter')
    };

    // ===== STATE =====
    let currentKeywords = [];
    let currentQuestions = [];
    let currentLSI = [];
    let currentTrending = [];
    let currentFilter = 'all';
    let usageCount = 0;
    let reactions = { like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0 };

    // =============================================
    // TYPEWRITER ANIMATION
    // =============================================
    const typewriterPhrases = [
        '🔍 ریئل ٹائم کلیدی الفاظ',
        '📊 گوگل سے براہ راست ڈیٹا',
        '🚀 SEO کو بہتر بنائیں',
        '🎯 درست اور متعلقہ الفاظ',
        '💡 نیا آئیڈیا حاصل کریں'
    ];
    let typewriterIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typewriterEffect() {
        const currentPhrase = typewriterPhrases[typewriterIndex];
        if (isDeleting) {
            DOM.typewriterElement.textContent = currentPhrase.substring(0, charIndex--);
            if (charIndex < 0) {
                isDeleting = false;
                typewriterIndex = (typewriterIndex + 1) % typewriterPhrases.length;
                setTimeout(typewriterEffect, 500);
                return;
            }
            setTimeout(typewriterEffect, 50);
        } else {
            DOM.typewriterElement.textContent = currentPhrase.substring(0, charIndex++);
            if (charIndex > currentPhrase.length) {
                isDeleting = true;
                setTimeout(typewriterEffect, 2000);
                return;
            }
            setTimeout(typewriterEffect, 100);
        }
    }

    // =============================================
    // DECODE URDU TEXT
    // =============================================
    function decodeUrduText(text) {
        if (!text) return text;
        try {
            let decoded = text;
            while (decoded.includes('%')) {
                decoded = decodeURIComponent(decoded);
            }
            return decoded;
        } catch (e) {
            try {
                return decodeURIComponent(escape(text));
            } catch (e2) {
                return text;
            }
        }
    }

    function decodeArray(arr) {
        if (!arr || !Array.isArray(arr)) return [];
        return arr.map(item => decodeUrduText(item));
    }

    // =============================================
    // TOAST
    // =============================================
    function showToast(msg, type = 'success') {
        DOM.toastDiv.style.display = 'block';
        DOM.toastDiv.innerHTML = msg;
        DOM.toastDiv.style.borderColor = type === 'success' ? '#667eea' : '#ff6b6b';
        clearTimeout(DOM.toastDiv._timeout);
        DOM.toastDiv._timeout = setTimeout(() => {
            DOM.toastDiv.style.display = 'none';
        }, 3000);
    }

    // =============================================
    // WORKER API CALL
    // =============================================
    async function fetchFromWorker(query) {
        try {
            const response = await fetch(`${CONFIG.WORKER_URL}?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Worker API error');
            return await response.json();
        } catch (error) {
            console.error('Worker API error:', error);
            return null;
        }
    }

    // =============================================
    // GENERATE KEYWORDS - صرف ریئل ڈیٹا
    // =============================================
    async function generateKeywords() {
        const topic = DOM.topicInput.value.trim();
        if (!topic) {
            showToast('براہ کرم موضوع درج کریں', 'error');
            return;
        }

        showLoading(true);
        await incrementUsage();

        try {
            const data = await fetchFromWorker(topic);

            if (data && data.success) {
                // صرف ریئل ڈیٹا
                currentKeywords = decodeArray(data.keywords);
                currentQuestions = decodeArray(data.questions);
                currentLSI = decodeArray(data.lsi_keywords);
                currentTrending = data.trending_topics || [];

                // ڈسپلے کریں
                applyFilter();
                displayQuestions(currentQuestions);
                displayLSI(currentLSI);
                displayTrendingTopics(currentTrending);

                const source = data.source || 'Google Autocomplete';
                showToast(`${currentKeywords.length} کلیدی الفاظ مل گئے! (${source})`);
            } else {
                // اگر API فیل ہو تو صرف خالی ڈیٹا دکھائیں، فیک نہیں
                currentKeywords = [];
                currentQuestions = [];
                currentLSI = [];
                currentTrending = [];
                
                applyFilter();
                displayQuestions(currentQuestions);
                displayLSI(currentLSI);
                displayTrendingTopics(currentTrending);
                
                showToast('ڈیٹا حاصل کرنے میں خرابی، دوبارہ کوشش کریں', 'error');
            }

            showLoading(false);

        } catch (error) {
            console.error('Generation error:', error);
            showLoading(false);
            showToast('ڈیٹا حاصل کرنے میں خرابی، دوبارہ کوشش کریں', 'error');
        }
    }

    // =============================================
    // DISPLAY FUNCTIONS
    // =============================================
    function applyFilter() {
        let filtered = [...currentKeywords];
        if (currentFilter === 'paa') {
            filtered = filtered.filter(k => k.includes('؟') || k.includes('?'));
        } else if (currentFilter === 'question') {
            filtered = filtered.filter(k => k.includes('کیا') || k.includes('کیسے') || k.includes('کب') || k.includes('کیوں'));
        } else if (currentFilter === 'lsi') {
            filtered = filtered.filter(k => !k.includes('؟') && !k.includes('?'));
        }
        displayKeywords(filtered);
        if (DOM.totalSpan) DOM.totalSpan.innerText = filtered.length;
    }

    function displayKeywords(keywords) {
        if (!keywords || keywords.length === 0) {
            DOM.keywordsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <p>کوئی کلیدی الفاظ نہیں ملے</p>
                </div>
            `;
            return;
        }

        DOM.keywordsContainer.innerHTML = keywords.map(k => {
            const safeKeyword = k.replace(/'/g, "\\'").replace(/"/g, '&quot;');
            return `
                <div class="keyword-item" onclick="window.copyToClipboard('${safeKeyword}')">
                    ${k}
                    <i class="fas fa-copy"></i>
                </div>
            `;
        }).join('');
    }

    function displayQuestions(questions) {
        if (!questions || questions.length === 0) {
            DOM.questionsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-question-circle"></i>
                    <p>کوئی سوالات نہیں ملے</p>
                </div>
            `;
            return;
        }

        DOM.questionsContainer.innerHTML = questions.map(q => `
            <div class="question-item">
                <i class="fas fa-question-circle" style="color:#667eea; margin-left:10px;"></i>
                ${q}
            </div>
        `).join('');
    }

    function displayLSI(lsi) {
        if (!lsi || lsi.length === 0) {
            DOM.lsiContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-link"></i>
                    <p>کوئی LSI الفاظ نہیں ملے</p>
                </div>
            `;
            return;
        }

        DOM.lsiContainer.innerHTML = lsi.map(l => `
            <div class="lsi-item" onclick="window.copyToClipboard('${l.replace(/'/g, "\\'")}')">
                ${l}
                <i class="fas fa-copy"></i>
            </div>
        `).join('');
    }

    // =============================================
    // ڈسپلے ٹرینڈنگ - صرف ریئل ڈیٹا
    // =============================================
    function displayTrendingTopics(trending) {
        if (!trending || trending.length === 0) {
            DOM.trendingContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-chart-line"></i>
                    <p>کوئی ٹرینڈنگ ٹاپکس نہیں ملے</p>
                </div>
            `;
            return;
        }

        DOM.trendingContainer.innerHTML = trending.map(t => `
            <div class="trending-item">
                <div class="trending-rank">${t.rank}</div>
                <div class="trending-title">${t.title}</div>
            </div>
        `).join('');
    }

    // =============================================
    // COPY & DOWNLOAD
    // =============================================
    window.copyToClipboard = function(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showToast('کاپی ہو گیا!');
            }).catch(() => {
                fallbackCopy(text);
            });
        } else {
            fallbackCopy(text);
        }
    };

    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast('کاپی ہو گیا!');
        } catch (e) {
            showToast('کاپی نہیں ہو سکا', 'error');
        }
        document.body.removeChild(textarea);
    }

    function copyAllKeywords() {
        if (!currentKeywords || currentKeywords.length === 0) {
            showToast('کوئی کلیدی الفاظ نہیں ہیں', 'error');
            return;
        }
        window.copyToClipboard(currentKeywords.join('\n'));
    }

    function downloadTXT() {
        if (!currentKeywords || currentKeywords.length === 0) {
            showToast('کوئی کلیدی الفاظ نہیں ہیں', 'error');
            return;
        }
        const blob = new Blob([currentKeywords.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'keywords.txt';
        a.click();
        URL.revokeObjectURL(url);
        showToast('ٹیکسٹ فائل ڈاؤن لوڈ ہو گئی!');
    }

    function downloadCSV() {
        if (!currentKeywords || currentKeywords.length === 0) {
            showToast('کوئی کلیدی الفاظ نہیں ہیں', 'error');
            return;
        }
        let content = 'Keyword,Type\n';
        content += currentKeywords.map(k => `"${k}",Keyword`).join('\n');
        const blob = new Blob([content], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'keywords.csv';
        a.click();
        URL.revokeObjectURL(url);
        showToast('CSV فائل ڈاؤن لوڈ ہو گئی!');
    }

    function downloadJSON() {
        if (!currentKeywords || currentKeywords.length === 0) {
            showToast('کوئی کلیدی الفاظ نہیں ہیں', 'error');
            return;
        }
        const data = {
            topic: DOM.topicInput.value,
            keywords: currentKeywords,
            questions: currentQuestions,
            lsi: currentLSI,
            trending: currentTrending,
            timestamp: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'keywords.json';
        a.click();
        URL.revokeObjectURL(url);
        showToast('JSON فائل ڈاؤن لوڈ ہو گئی!');
    }

    function clearResults() {
        currentKeywords = [];
        currentQuestions = [];
        currentLSI = [];
        currentTrending = [];
        
        DOM.keywordsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <p>اوپر موضوع لکھیں اور جنریٹ کریں</p>
            </div>
        `;
        DOM.questionsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-question-circle"></i>
                <p>سوالات یہاں دکھیں گے</p>
            </div>
        `;
        DOM.lsiContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-link"></i>
                <p>LSI الفاظ یہاں ہوں گے</p>
            </div>
        `;
        DOM.trendingContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-chart-line"></i>
                <p>ٹرینڈنگ ٹاپکس یہاں ہوں گے</p>
            </div>
        `;
        if (DOM.totalSpan) DOM.totalSpan.innerText = '0';
        showToast('نتائج صاف کر دیے گئے');
    }

    // =============================================
    // LOADING
    // =============================================
    function showLoading(show) {
        if (show) {
            DOM.generateBtn.disabled = true;
            DOM.generateBtn.innerHTML = '<span class="spinner"></span> پروسیسنگ...';
            DOM.keywordsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-spinner fa-pulse"></i>
                    <p>ریئل ڈیٹا لا رہے ہیں...</p>
                </div>
            `;
        } else {
            DOM.generateBtn.disabled = false;
            DOM.generateBtn.innerHTML = '<i class="fas fa-magic"></i> جنریٹ کریں';
        }
    }

    // =============================================
    // USAGE (localStorage)
    // =============================================
    async function incrementUsage() {
        usageCount = parseInt(localStorage.getItem(`${CONFIG.TOOL_SLUG}_usage`)) || 0;
        usageCount++;
        localStorage.setItem(`${CONFIG.TOOL_SLUG}_usage`, usageCount);
        if (DOM.usageDisplay) DOM.usageDisplay.innerText = usageCount;
        return true;
    }

    // =============================================
    // REACTIONS (localStorage)
    // =============================================
    function fetchReactions() {
        const saved = localStorage.getItem(`${CONFIG.TOOL_SLUG}_reactions`);
        if (saved) {
            reactions = JSON.parse(saved);
            updateReactionUI();
        }
    }

    function addReaction(type) {
        if (reactions[type] !== undefined) {
            reactions[type]++;
            updateReactionUI();
            localStorage.setItem(`${CONFIG.TOOL_SLUG}_reactions`, JSON.stringify(reactions));
            showToast('ری ایکشن شامل کر لیا گیا!');
        }
    }

    function updateReactionUI() {
        DOM.reactionBtns.forEach(btn => {
            const type = btn.dataset.reaction;
            if (reactions[type] !== undefined) {
                const span = btn.querySelector('span');
                if (span) span.innerText = reactions[type];
            }
        });
    }

    // =============================================
    // SHARE
    // =============================================
    function shareOnPlatform(platform) {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent('اردو کلیدی الفاظ جنریٹر - ریئل ٹائم ڈیٹا');
        let shareUrl = '';

        switch(platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${text}%20${url}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?u=${url}`;
                break;
            case 'email':
                shareUrl = `mailto:?subject=اردو کلیدی الفاظ جنریٹر&body=${text}%0A%0A${url}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
            showToast(`${platform} پر شیئر کیا گیا!`);
        }
    }

    function sharePageLink() {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(window.location.href).then(() => {
                showToast('لنک کاپی ہو گیا!');
            }).catch(() => {
                fallbackCopy(window.location.href);
            });
        } else {
            fallbackCopy(window.location.href);
        }
    }

    // =============================================
    // TABS
    // =============================================
    function switchTab(tabId) {
        document.querySelectorAll('.panel').forEach(panel => {
            panel.classList.remove('active');
        });
        const panel = document.getElementById(tabId + 'Panel');
        if (panel) panel.classList.add('active');

        DOM.tabBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabId) {
                btn.classList.add('active');
            }
        });
    }

    // =============================================
    // FILTERS
    // =============================================
    function setFilter(type) {
        DOM.filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === type) {
                btn.classList.add('active');
            }
        });
        currentFilter = type;
        if (currentKeywords.length > 0) {
            applyFilter();
        }
    }

    // =============================================
    // BIND EVENTS
    // =============================================
    function bindEvents() {
        DOM.generateBtn.addEventListener('click', generateKeywords);
        DOM.clearResultsBtn.addEventListener('click', clearResults);
        DOM.copyAllBtn.addEventListener('click', copyAllKeywords);
        DOM.downloadTxtBtn.addEventListener('click', downloadTXT);
        DOM.downloadCsvBtn.addEventListener('click', downloadCSV);
        DOM.downloadJsonBtn.addEventListener('click', downloadJSON);
        DOM.sharePageBtn.addEventListener('click', sharePageLink);

        DOM.resultRange.addEventListener('input', function() {
            if (DOM.resultCountValue) DOM.resultCountValue.innerText = this.value;
            if (currentKeywords.length > 0) applyFilter();
        });

        DOM.scrollUpBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        DOM.scrollDownBtn.addEventListener('click', () => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });

        window.addEventListener('scroll', function() {
            DOM.scrollUpBtn.style.display = window.scrollY > 200 ? 'flex' : 'none';
        });

        DOM.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.tab));
        });

        DOM.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => setFilter(btn.dataset.filter));
        });

        DOM.reactionBtns.forEach(btn => {
            btn.addEventListener('click', () => addReaction(btn.dataset.reaction));
        });

        DOM.socialBtns.forEach(btn => {
            btn.addEventListener('click', () => shareOnPlatform(btn.dataset.platform));
        });

        DOM.topicInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                generateKeywords();
            }
        });
    }

    // =============================================
    // INIT
    // =============================================
    async function init() {
        bindEvents();
        typewriterEffect();

        fetchReactions();

        const savedUsage = localStorage.getItem(`${CONFIG.TOOL_SLUG}_usage`);
        if (savedUsage) {
            usageCount = parseInt(savedUsage);
            if (DOM.usageDisplay) DOM.usageDisplay.innerText = usageCount;
        }

        DOM.topicInput.value = 'صحت';
        setTimeout(generateKeywords, 500);

        showToast('اردو کلیدی الفاظ جنریٹر تیار ہے! (ریئل ڈیٹا)');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
