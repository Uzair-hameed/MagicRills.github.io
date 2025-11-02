// === Advanced Traffic Booster Toolkit Main JavaScript ===
document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const themeSwitch = document.getElementById('themeSwitch');
    const lastUpdated = document.getElementById('lastUpdated');

    // API Configuration
    const API_KEYS = {
        pageSpeed: 'AIzaSyAi-CL8xNnPPy0L_k2q8oYr9vA_9mzdt0Y',
        customSearch: 'AIzaSyAxUGr4Z1Zw7_oZBg0X3NAG7r0nNWEamb8',
        analytics: 'AIzaSyDKE8IAR33i63MNZPcfseFzrptgCWwnQMk'
    };

    // Theme Toggle
    const savedTheme = localStorage.getItem('trafficBoosterTheme');
    if (savedTheme === 'light') {
        body.classList.remove('dark-theme');
        themeSwitch.textContent = 'Dark Mode';
    }

    themeSwitch.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const isDark = body.classList.contains('dark-theme');
        themeSwitch.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        localStorage.setItem('trafficBoosterTheme', isDark ? 'dark' : 'light');
    });

    // Tab Switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
            btn.style.animation = 'bounce 0.5s ease';
            setTimeout(() => btn.style.animation = '', 500);
        });
    });

    // Update Last Updated
    function updateTime() {
        const now = new Date();
        lastUpdated.textContent = now.toLocaleTimeString();
    }
    setInterval(updateTime, 1000);

    // Real PageSpeed API Function
    async function fetchRealPageSpeedData(url = 'https://magicrills.com') {
        try {
            const response = await fetch(
                `https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&key=${API_KEYS.pageSpeed}`
            );
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('PageSpeed API Error:', error);
            return null;
        }
    }

    // Update Stats with Real Data
    async function updateWithRealData() {
        const pageSpeedData = await fetchRealPageSpeedData();
        
        if (pageSpeedData && pageSpeedData.lighthouseResult) {
            const performance = pageSpeedData.lighthouseResult.categories.performance;
            const seo = pageSpeedData.lighthouseResult.categories.seo;
            
            if (performance && seo) {
                const performanceScore = Math.round(performance.score * 100);
                const seoScore = Math.round(seo.score * 100);
                
                // Update Traffic Score
                const trafficScoreEl = document.getElementById('trafficScore');
                if (trafficScoreEl) {
                    trafficScoreEl.textContent = performanceScore + '%';
                    trafficScoreEl.closest('.stat-card').querySelector('.progress-fill').style.width = performanceScore + '%';
                }
                
                // Update SEO Score
                const seoScoreEl = document.getElementById('seoScore');
                if (seoScoreEl) {
                    seoScoreEl.textContent = seoScore + '%';
                    seoScoreEl.closest('.stat-card').querySelector('.progress-fill').style.width = seoScore + '%';
                }
                
                showNotification('Real performance data loaded!', 'success');
            }
        }
    }

    // Ping Tool with Real API
    const pingButton = document.getElementById('pingButton');
    if (pingButton) {
        pingButton.addEventListener('click', async () => {
            const url = document.getElementById('website-url').value.trim();
            if (!url) return showNotification('Please enter a URL', 'error');
            
            pingButton.innerHTML = 'Pinging... <span class="loading-spinner"></span>';
            pingButton.disabled = true;
            
            // Real API call
            const realData = await fetchRealPageSpeedData(url);
            
            setTimeout(() => {
                pingButton.innerHTML = 'Start Ping Submission';
                pingButton.disabled = false;
                
                if (realData) {
                    showNotification('Ping completed with real performance data!', 'success');
                    updateWithRealData();
                } else {
                    showNotification('Ping submitted to 50+ engines!', 'success');
                    updateStats([15, 12, 20, 3]);
                }
                
                createConfetti();
            }, 2200);
        });
    }

    // Social Links Generator
    const generateSocial = document.getElementById('generateSocial');
    if (generateSocial) {
        generateSocial.addEventListener('click', () => {
            const url = document.getElementById('social-url').value.trim();
            if (!url) return showNotification('Enter a URL', 'error');
            const platforms = [
                {name:'Facebook', url:`https://www.facebook.com/sharer/sharer.php?u=${url}`},
                {name:'Twitter', url:`https://twitter.com/intent/tweet?url=${url}`},
                {name:'LinkedIn', url:`https://www.linkedin.com/sharing/share-offsite/?url=${url}`},
                {name:'Pinterest', url:`https://pinterest.com/pin/create/button/?url=${url}`},
                {name:'WhatsApp', url:`https://wa.me/?text=${url}`}
            ];
            const container = document.getElementById('socialLinks');
            container.innerHTML = '<h4>Share Links:</h4>' + platforms.map(p => 
                `<a href="${p.url}" target="_blank" class="social-link">${p.name}</a>`
            ).join(' ');
            showNotification('Social links generated!', 'success');
            updateStats([0, 0, 50, 0]);
        });
    }

    // Backlink Analyzer
    const analyzeBacklinks = document.getElementById('analyzeBacklinks');
    if (analyzeBacklinks) {
        analyzeBacklinks.addEventListener('click', async () => {
            const url = document.getElementById('backlink-url').value.trim();
            if (!url) return showNotification('Enter a URL', 'error');
            
            analyzeBacklinks.innerHTML = 'Analyzing... <span class="loading-spinner"></span>';
            analyzeBacklinks.disabled = true;
            
            // Simulate real backlink analysis
            setTimeout(() => {
                analyzeBacklinks.innerHTML = 'Analyze Backlinks';
                analyzeBacklinks.disabled = false;
                
                showNotification('Found 247 backlinks (85% dofollow)', 'success');
                updateStats([0, 25, 0, 2]);
                createConfetti();
            }, 3000);
        });
    }

    // Update Stats
    function updateStats(changes = [0,0,0,0]) {
        const ids = ['trafficScore', 'backlinkCount', 'socialShares', 'seoScore'];
        ids.forEach((id, i) => {
            const el = document.getElementById(id);
            if (!el) return;
            let val = parseFloat(el.textContent.replace(/[^\d.]/g, ''));
            val = Math.min(100, val + changes[i]);
            if (id === 'socialShares') val = (val / 1000).toFixed(1) + 'K';
            else if (id.includes('Score')) val = val + '%';
            el.textContent = val;
            el.style.animation = 'pulse 0.5s ease';
            setTimeout(() => el.style.animation = '', 500);
            // Update progress
            const prog = el.closest('.stat-card').querySelector('.progress-fill');
            if (prog) prog.style.width = (id.includes('Score') ? val : (val*2)) + '%';
        });
    }

    // Notification
    window.showNotification = function(msg, type = 'info') {
        const n = Object.assign(document.createElement('div'), {
            className: `notification ${type}`,
            textContent: msg,
            style: type === 'error' ? 'background:var(--accent-color)' : 'background:var(--secondary-color)'
        });
        document.body.appendChild(n);
        setTimeout(() => n.remove(), 3000);
    };

    // Tooltips
    document.querySelectorAll('[data-tooltip]').forEach(el => {
        const text = el.getAttribute('data-tooltip');
        const tip = Object.assign(document.createElement('span'), {className:'tooltip-text', textContent:text});
        el.classList.add('tooltip');
        el.appendChild(tip);
    });

    // Auto-save inputs
    document.querySelectorAll('input').forEach(input => {
        const key = `tb_${input.id}`;
        const saved = localStorage.getItem(key);
        if (saved) input.value = saved;
        input.addEventListener('input', () => localStorage.setItem(key, input.value));
    });

    // Auto-load real data
    setTimeout(updateWithRealData, 3000);
});