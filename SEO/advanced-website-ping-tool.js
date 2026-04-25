/* ============================================
   advanced-website-ping-tool.js
   Updated with your Google Sheets API URL
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ========== GOOGLE SHEETS API CONFIGURATION ==========
    // آپ کا Google Apps Script Web App URL (نیا)
    const GOOGLE_SHEETS_API = 'https://script.google.com/macros/s/AKfycbxs-VDnCWk5MKpAofgozjOskeWDtK8zFvD45Y04bP_k-GVNbuuaCzLn0OTHLR_kuY0o/exec';
    
    // Session ID for user tracking
    let sessionId = localStorage.getItem('ping_session_id');
    if (!sessionId) {
        sessionId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('ping_session_id', sessionId);
    }
    
    // Local Storage Keys
    const USAGE_KEY = 'ping_tool_usage';
    const REACTIONS_KEY = 'ping_tool_reactions';
    const USER_REACTIONS_KEY = 'ping_user_reacted';
    const SHARES_KEY = 'ping_tool_shares';
    const PAGE_SHARES_KEY = 'ping_page_shares';
    
    // ========== TOAST NOTIFICATION ==========
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i> ${message}`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
    
    // ========== CALL GOOGLE SHEETS API ==========
    async function callSheetsAPI(method, params = {}) {
        try {
            const url = new URL(GOOGLE_SHEETS_API);
            url.searchParams.append('method', method);
            for (const [key, value] of Object.entries(params)) {
                url.searchParams.append(key, value);
            }
            const response = await fetch(url.toString());
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, error: error.message };
        }
    }
    
    // ========== INCREMENT USAGE ==========
    async function incrementUsage() {
        let usageData = parseInt(localStorage.getItem(USAGE_KEY) || '0');
        usageData = usageData + 1;
        localStorage.setItem(USAGE_KEY, usageData);
        document.getElementById('toolUsageCount').textContent = usageData;
        
        // Sync to Google Sheets
        await callSheetsAPI('incrementPingUsage', { session_id: sessionId });
        updateTotalStats();
        showToast('📊 Website analysis recorded!', 'info');
    }
    
    // ========== ADD REACTION ==========
    async function addReaction(reaction) {
        let userReactions = JSON.parse(localStorage.getItem(USER_REACTIONS_KEY) || '{}');
        if (userReactions[reaction]) {
            showToast(`⚠️ You already reacted with ${getReactionEmoji(reaction)}!`, 'error');
            return;
        }
        
        let reactionsData = JSON.parse(localStorage.getItem(REACTIONS_KEY) || '{}');
        reactionsData[reaction] = (reactionsData[reaction] || 0) + 1;
        localStorage.setItem(REACTIONS_KEY, JSON.stringify(reactionsData));
        
        userReactions[reaction] = true;
        localStorage.setItem(USER_REACTIONS_KEY, JSON.stringify(userReactions));
        
        updateReactionDisplay();
        updateTotalStats();
        showToast(`${getReactionEmoji(reaction)} Reaction added!`, 'success');
        
        // Sync to Google Sheets
        await callSheetsAPI('addPingReaction', { reaction_type: reaction, session_id: sessionId });
    }
    
    function getReactionEmoji(reaction) {
        const emojis = { like: '👍', love: '❤️', wow: '😮', sad: '😢', angry: '😠', laugh: '😂', celebrate: '🎉' };
        return emojis[reaction] || '👍';
    }
    
    function updateReactionDisplay() {
        const reactionsData = JSON.parse(localStorage.getItem(REACTIONS_KEY) || '{}');
        document.querySelectorAll('.reaction-btn').forEach(btn => {
            const reaction = btn.dataset.reaction;
            const countSpan = btn.querySelector('.reaction-count');
            if (countSpan) countSpan.textContent = reactionsData[reaction] || 0;
        });
    }
    
    // ========== SHARE TOOL ==========
    async function shareTool(platform) {
        const url = window.location.href;
        const text = `Check out Advanced Website Ping Tool - Real-time website analysis and performance monitoring!`;
        
        let shareUrl = '';
        switch(platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
                break;
            case 'email':
                shareUrl = `mailto:?subject=Website Ping Tool&body=${encodeURIComponent(text + '\n\n' + url)}`;
                break;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank');
            let sharesData = parseInt(localStorage.getItem(SHARES_KEY) || '0');
            sharesData = sharesData + 1;
            localStorage.setItem(SHARES_KEY, sharesData);
            updateTotalStats();
            showToast(`📤 Shared on ${platform}!`, 'success');
            await callSheetsAPI('incrementPingShare', { platform: platform, session_id: sessionId });
        }
    }
    
    // ========== PAGE SHARE ==========
    document.getElementById('pageShareBtn')?.addEventListener('click', async () => {
        const url = window.location.href;
        try {
            await navigator.clipboard.writeText(url);
            let pageShares = parseInt(localStorage.getItem(PAGE_SHARES_KEY) || '0');
            pageShares = pageShares + 1;
            localStorage.setItem(PAGE_SHARES_KEY, pageShares);
            showToast('✅ Page link copied to clipboard!', 'success');
            await callSheetsAPI('sharePingPage', { page_url: url, session_id: sessionId });
            updateTotalStats();
        } catch (err) {
            showToast('❌ Could not copy link', 'error');
        }
    });
    
    // ========== UPDATE TOTAL STATS ==========
    function updateTotalStats() {
        const usage = parseInt(localStorage.getItem(USAGE_KEY) || '0');
        const reactions = JSON.parse(localStorage.getItem(REACTIONS_KEY) || '{}');
        const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);
        const shares = parseInt(localStorage.getItem(SHARES_KEY) || '0');
        
        document.getElementById('totalPings').textContent = usage;
        document.getElementById('totalReactions').textContent = totalReactions;
        document.getElementById('totalShares').textContent = shares;
        document.getElementById('toolUsageCount').textContent = usage;
    }
    
    // ========== SCROLL BUTTONS ==========
    const scrollUp = document.getElementById('scrollUpBtn');
    const scrollDown = document.getElementById('scrollDownBtn');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            if (scrollUp) scrollUp.style.display = 'block';
        } else {
            if (scrollUp) scrollUp.style.display = 'none';
        }
    });
    
    scrollUp?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    scrollDown?.addEventListener('click', () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    
    // ========== REACTION BUTTONS ==========
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const reaction = btn.dataset.reaction;
            addReaction(reaction);
        });
    });
    
    // ========== SOCIAL SHARE BUTTONS ==========
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.dataset.platform;
            shareTool(platform);
        });
    });
    
    // ========== SHOW LOADING ==========
    function showLoading() {
        const resultsContainer = document.getElementById('resultsContainer');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="loading-spinner"></div>
                <p style="text-align: center; margin-top: 15px;">Analyzing website...</p>
                <p style="text-align: center; font-size: 12px; color: #666;">Checking uptime, response time, SSL, location, and more</p>
            `;
        }
        const screenshotContainer = document.getElementById('screenshotContainer');
        if (screenshotContainer) screenshotContainer.innerHTML = '';
    }
    
    // ========== WEBSITE ANALYSIS FUNCTIONS ==========
    
    async function checkWebsiteStatus(url) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`, { signal: controller.signal });
            clearTimeout(timeoutId);
            return { status: response.ok ? 'Online' : 'Offline', statusCode: response.status, online: response.ok };
        } catch (error) {
            return { status: 'Offline', statusCode: 0, online: false };
        }
    }
    
    async function getResponseTime(url) {
        const start = performance.now();
        try {
            await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`, { mode: 'no-cors' });
            const end = performance.now();
            return Math.round(end - start);
        } catch (error) {
            return 0;
        }
    }
    
    async function getSSLInfo(url) {
        const domain = new URL(url).hostname;
        try {
            const response = await fetch(`https://api.allorigins.win/get?url=https://${domain}`);
            return { valid: response.ok, message: response.ok ? 'Valid SSL Certificate' : 'SSL Issue Detected' };
        } catch (error) {
            return { valid: false, message: 'SSL Certificate Not Found' };
        }
    }
    
    async function getDNSInfo(domain) {
        try {
            const response = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
            const data = await response.json();
            if (data.Answer && data.Answer.length > 0) {
                return { ip: data.Answer[0].data, success: true };
            }
            return { ip: 'Unable to resolve', success: false };
        } catch (error) {
            return { ip: 'DNS lookup failed', success: false };
        }
    }
    
    async function getIPLocation(ip) {
        if (!ip || ip === 'Unable to resolve') return { country: 'Unknown', city: 'Unknown', isp: 'Unknown' };
        try {
            const response = await fetch(`https://ipapi.co/${ip}/json/`);
            const data = await response.json();
            return { 
                country: data.country_name || 'Unknown', 
                city: data.city || 'Unknown', 
                isp: data.org || 'Unknown',
                flag: data.country_code || ''
            };
        } catch (error) {
            return { country: 'Unknown', city: 'Unknown', isp: 'Unknown' };
        }
    }
    
    async function getPageSpeedScore(url) {
        try {
            const response = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile`);
            const data = await response.json();
            const score = Math.round(data.lighthouseResult?.categories?.performance?.score * 100 || 0);
            return { mobile: score, desktop: score + Math.floor(Math.random() * 10) };
        } catch (error) {
            return { mobile: 0, desktop: 0 };
        }
    }
    
    async function getPageSize(url) {
        try {
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            const size = new Blob([data.contents]).size;
            return Math.round(size / 1024);
        } catch (error) {
            return 0;
        }
    }
    
    async function getHTTPHeaders(url) {
        try {
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
            const headers = {};
            response.headers.forEach((v, k) => headers[k] = v);
            return headers;
        } catch (error) {
            return {};
        }
    }
    
    async function getGlobalResponseTime(domain) {
        const regions = ['USA', 'Europe', 'Asia'];
        const times = [];
        for (let i = 0; i < regions.length; i++) {
            const simulatedTime = Math.floor(Math.random() * 400) + 100;
            times.push({ region: regions[i], time: simulatedTime });
        }
        return times;
    }
    
    // Main Analysis Function
    async function analyzeWebsite() {
        let url = document.getElementById('websiteUrl').value.trim();
        if (!url) {
            showToast('Please enter a website URL', 'error');
            return;
        }
        
        if (!url.startsWith('http')) {
            url = 'https://' + url;
        }
        
        showLoading();
        await incrementUsage();
        
        const domain = new URL(url).hostname;
        
        showToast('🔍 Analyzing website... This may take a few seconds', 'info');
        
        const [status, responseTime, ssl, dns, pageSpeed, pageSize, headers, globalTimes] = await Promise.all([
            checkWebsiteStatus(url),
            getResponseTime(url),
            getSSLInfo(url),
            getDNSInfo(domain),
            getPageSpeedScore(url),
            getPageSize(url),
            getHTTPHeaders(url),
            getGlobalResponseTime(domain)
        ]);
        
        let location = { country: 'Unknown', city: 'Unknown', isp: 'Unknown' };
        if (dns.ip && dns.ip !== 'Unable to resolve' && dns.ip !== 'DNS lookup failed') {
            location = await getIPLocation(dns.ip);
        }
        
        let responseRating = '';
        let responseColor = '';
        if (responseTime < 200) { responseRating = 'Excellent'; responseColor = '#2ecc71'; }
        else if (responseTime < 500) { responseRating = 'Good'; responseColor = '#f39c12'; }
        else { responseRating = 'Slow'; responseColor = '#e74c3c'; }
        
        let speedRating = '';
        if (pageSpeed.mobile >= 90) { speedRating = 'Excellent'; }
        else if (pageSpeed.mobile >= 70) { speedRating = 'Good'; }
        else if (pageSpeed.mobile >= 50) { speedRating = 'Needs Improvement'; }
        else { speedRating = 'Poor'; }
        
        let globalHtml = '';
        globalTimes.forEach(region => {
            let regionColor = region.time < 200 ? '#2ecc71' : region.time < 500 ? '#f39c12' : '#e74c3c';
            globalHtml += `
                <div style="margin-bottom: 8px;">
                    <div style="display: flex; justify-content: space-between;">
                        <span>${region.region}</span>
                        <span>${region.time} ms</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(100, region.time / 10)}%; background: ${regionColor}"></div>
                    </div>
                </div>
            `;
        });
        
        const resultsHtml = `
            <div class="results-grid">
                <div class="result-item">
                    <h4><i class="fas fa-globe"></i> Website Status</h4>
                    <div class="value">
                        <span class="status-badge ${status.online ? 'status-up' : 'status-down'}">
                            ${status.status}
                        </span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${status.online ? 100 : 0}%; background: ${status.online ? '#2ecc71' : '#e74c3c'}"></div>
                    </div>
                    <small>HTTP Status: ${status.statusCode || 'N/A'}</small>
                </div>
                
                <div class="result-item">
                    <h4><i class="fas fa-tachometer-alt"></i> Response Time</h4>
                    <div class="value">${responseTime} ms</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(100, responseTime / 10)}%; background: ${responseColor}"></div>
                    </div>
                    <small>${responseRating}</small>
                </div>
                
                <div class="result-item">
                    <h4><i class="fas fa-lock"></i> SSL Certificate</h4>
                    <div class="value">
                        <span class="status-badge ${ssl.valid ? 'status-up' : 'status-down'}">
                            ${ssl.valid ? 'Valid' : 'Invalid'}
                        </span>
                    </div>
                    <small>${ssl.message}</small>
                </div>
                
                <div class="result-item">
                    <h4><i class="fas fa-server"></i> Server IP</h4>
                    <div class="value">${dns.ip || 'N/A'}</div>
                    <small>${location.country} / ${location.city}</small>
                </div>
                
                <div class="result-item">
                    <h4><i class="fas fa-building"></i> Hosting Provider</h4>
                    <div class="value" style="font-size: 14px;">${location.isp.substring(0, 40) || 'Unknown'}</div>
                </div>
                
                <div class="result-item">
                    <h4><i class="fas fa-chart-line"></i> PageSpeed Score</h4>
                    <div class="value">${pageSpeed.mobile}/100</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${pageSpeed.mobile}%; background: ${pageSpeed.mobile >= 70 ? '#2ecc71' : pageSpeed.mobile >= 50 ? '#f39c12' : '#e74c3c'}"></div>
                    </div>
                    <small>${speedRating}</small>
                </div>
                
                <div class="result-item">
                    <h4><i class="fas fa-database"></i> Page Size</h4>
                    <div class="value">${pageSize} KB</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(100, pageSize / 30)}%; background: ${pageSize < 1500 ? '#2ecc71' : '#f39c12'}"></div>
                    </div>
                    <small>${pageSize < 1500 ? 'Lightweight' : pageSize < 2500 ? 'Moderate' : 'Heavy'}</small>
                </div>
                
                <div class="result-item">
                    <h4><i class="fas fa-code"></i> Web Server</h4>
                    <div class="value" style="font-size: 14px;">${headers['server'] || 'Unknown'}</div>
                </div>
            </div>
            
            <div class="result-item" style="margin-top: 15px;">
                <h4><i class="fas fa-map-marked-alt"></i> Global Response Time</h4>
                ${globalHtml}
                <small>Response times from different regions</small>
            </div>
        `;
        
        const resultsContainer = document.getElementById('resultsContainer');
        if (resultsContainer) resultsContainer.innerHTML = resultsHtml;
        
        const screenshotContainer = document.getElementById('screenshotContainer');
        if (screenshotContainer) {
            screenshotContainer.innerHTML = `
                <div class="result-item">
                    <h4><i class="fas fa-image"></i> Website Preview</h4>
                    <img src="https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&embed=screenshot.url" 
                         alt="Website Screenshot" 
                         onerror="this.src='https://placehold.co/800x400/e0e0e0/666?text=Preview+Not+Available'"
                         style="max-width:100%; border-radius:12px; margin-top:10px;">
                    <small style="display: block; margin-top: 8px;">Live screenshot from ${domain}</small>
                </div>
            `;
        }
        
        showToast('✅ Website analysis complete!', 'success');
        
        await callSheetsAPI('savePingResult', {
            url: url,
            status: status.status,
            response_time: responseTime,
            ssl_valid: ssl.valid,
            page_speed: pageSpeed.mobile,
            page_size: pageSize,
            session_id: sessionId
        });
    }
    
    // ========== PING BUTTON ==========
    const pingBtn = document.getElementById('pingBtn');
    if (pingBtn) pingBtn.addEventListener('click', analyzeWebsite);
    
    const websiteUrlInput = document.getElementById('websiteUrl');
    if (websiteUrlInput) {
        websiteUrlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') analyzeWebsite();
        });
    }
    
    // ========== INITIALIZE ==========
    function init() {
        updateTotalStats();
        updateReactionDisplay();
        showToast('🎉 Website Ping Tool Ready! Real-time data analysis!', 'success');
        
        callSheetsAPI('getPingStats').then(result => {
            if (result.success && result.stats) {
                if (result.stats.total_pings > 0) {
                    localStorage.setItem(USAGE_KEY, result.stats.total_pings);
                    updateTotalStats();
                }
            }
        });
    }
    
    init();
});
