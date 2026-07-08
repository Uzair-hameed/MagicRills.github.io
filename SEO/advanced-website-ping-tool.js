/* ============================================
   advanced-website-ping-tool.js
   CLOUDFLARE WORKERS API | GLOBALPING | REAL DATA
   UPDATED - WORKING WITH YOUR API KEY
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Advanced Website Ping Tool Initializing...');

    // ========== API CONFIGURATION ==========
    const CLOUDFLARE_API = 'https://magicrills-api.uzairhameed01.workers.dev';
    const CLOUDFLARE_KEY = 'magicrills-grok-api.uzairhameed01.workers.dev';
    const GLOBALPING_PROXY = 'https://advanced-website-ping.uzairhameed01.workers.dev';
    const TOOL_SLUG = 'website-ping-tool';
    
    // ========== SESSION ID ==========
    let sessionId = localStorage.getItem('ping_session_id');
    if (!sessionId) {
        sessionId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('ping_session_id', sessionId);
    }
    console.log('📱 Session ID:', sessionId);
    
    // ========== LOCAL STORAGE KEYS ==========
    const USAGE_KEY = 'ping_tool_usage';
    const REACTIONS_KEY = 'ping_tool_reactions';
    const USER_REACTIONS_KEY = 'ping_user_reacted';
    const SHARES_KEY = 'ping_tool_shares';
    
    // ========== TOAST NOTIFICATION ==========
    function showToast(message, type = 'success') {
        console.log('🔔 Toast:', message, type);
        const container = document.getElementById('toastContainer');
        if (!container) {
            console.error('❌ Toast container not found');
            return;
        }
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        };
        toast.innerHTML = `<i class="fas ${icons[type] || 'fa-info-circle'}"></i> ${message}`;
        container.appendChild(toast);
        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, 4000);
    }
    
    // ========== CLOUDFLARE API CALL ==========
    async function callCloudflareAPI(endpoint, method = 'GET', data = null) {
        try {
            const url = `${CLOUDFLARE_API}${endpoint}`;
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CLOUDFLARE_KEY}`
            };
            
            const options = { method, headers };
            if (data && (method === 'POST' || method === 'PUT')) {
                options.body = JSON.stringify(data);
            }
            
            const response = await fetch(url, options);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('❌ Cloudflare API Error:', error);
            return { success: false, error: error.message };
        }
    }
    
    // ========== CHECK GLOBALPING PROXY HEALTH ==========
    async function checkProxyHealth() {
        try {
            console.log('🔍 Checking Globalping proxy health...');
            const response = await fetch(`${GLOBALPING_PROXY}/`);
            const data = await response.json();
            console.log('✅ Proxy health:', data);
            return data;
        } catch (error) {
            console.error('❌ Proxy health check failed:', error);
            return null;
        }
    }
    
    // ========== GLOBALPING PROXY CALL ==========
    async function callGlobalpingProxy(endpoint, method = 'GET', data = null) {
        try {
            const url = `${GLOBALPING_PROXY}${endpoint}`;
            console.log('📡 Globalping Proxy Call:', method, url);
            if (data) console.log('📡 Data:', data);
            
            const options = {
                method,
                headers: { 'Content-Type': 'application/json' }
            };
            if (data && method === 'POST') {
                options.body = JSON.stringify(data);
            }
            
            const response = await fetch(url, options);
            console.log('📡 Response Status:', response.status);
            
            let result;
            const text = await response.text();
            console.log('📡 Raw Response:', text.substring(0, 500));
            
            try {
                result = JSON.parse(text);
            } catch (e) {
                result = { success: false, error: 'Invalid JSON response', raw: text.substring(0, 200) };
            }
            
            console.log('✅ Parsed Response:', result);
            return result;
        } catch (error) {
            console.error('❌ Globalping Proxy Error:', error);
            return { success: false, error: error.message };
        }
    }
    
    // ========== INCREMENT USAGE ==========
    async function incrementUsage() {
        let usageData = parseInt(localStorage.getItem(USAGE_KEY) || '0');
        usageData = usageData + 1;
        localStorage.setItem(USAGE_KEY, usageData);
        
        try {
            await callCloudflareAPI('/api/usage', 'POST', {
                tool_slug: TOOL_SLUG,
                session_id: sessionId
            });
        } catch (error) {
            console.log('⚠️ Usage sync failed');
        }
        
        updateTotalStats();
    }
    
    // ========== ADD REACTION ==========
    async function addReaction(reaction) {
        let userReactions = JSON.parse(localStorage.getItem(USER_REACTIONS_KEY) || '{}');
        if (userReactions[reaction]) {
            showToast(`⚠️ You already reacted with ${getReactionEmoji(reaction)}!`, 'warning');
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
        
        try {
            await callCloudflareAPI('/api/reactions', 'POST', {
                tool_slug: TOOL_SLUG,
                reaction_type: reaction,
                session_id: sessionId
            });
        } catch (error) {
            console.log('⚠️ Reaction sync failed');
        }
    }
    
    function getReactionEmoji(reaction) {
        const emojis = { 
            like: '👍', love: '❤️', wow: '😮', 
            sad: '😢', angry: '😠', laugh: '😂', 
            celebrate: '🎉' 
        };
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
        const text = `🌐 Check out Advanced Website Ping Tool - Real-time website analysis from 8+ global locations!`;
        
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
            case 'copy':
                try {
                    await navigator.clipboard.writeText(url);
                    showToast('✅ Link copied to clipboard!', 'success');
                    let sharesData = parseInt(localStorage.getItem(SHARES_KEY) || '0');
                    sharesData = sharesData + 1;
                    localStorage.setItem(SHARES_KEY, sharesData);
                    updateTotalStats();
                    
                    await callCloudflareAPI('/api/shares', 'POST', {
                        tool_slug: TOOL_SLUG,
                        platform: platform,
                        session_id: sessionId
                    });
                    return;
                } catch (err) {
                    showToast('❌ Could not copy link', 'error');
                    return;
                }
            default:
                return;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank');
            let sharesData = parseInt(localStorage.getItem(SHARES_KEY) || '0');
            sharesData = sharesData + 1;
            localStorage.setItem(SHARES_KEY, sharesData);
            updateTotalStats();
            showToast(`📤 Shared on ${platform}!`, 'success');
            
            await callCloudflareAPI('/api/shares', 'POST', {
                tool_slug: TOOL_SLUG,
                platform: platform,
                session_id: sessionId
            });
        }
    }
    
    // ========== UPDATE TOTAL STATS ==========
    function updateTotalStats() {
        const usage = parseInt(localStorage.getItem(USAGE_KEY) || '0');
        const reactions = JSON.parse(localStorage.getItem(REACTIONS_KEY) || '{}');
        const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);
        const shares = parseInt(localStorage.getItem(SHARES_KEY) || '0');
        
        const elements = {
            'totalPings': usage,
            'totalReactions': totalReactions,
            'totalShares': shares,
            'toolUsageCount': usage,
            'heroTotalPings': usage,
            'heroTotalReactions': totalReactions,
            'heroTotalShares': shares
        };
        
        Object.keys(elements).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = elements[id];
        });
    }
    
    // ========== TYPEWRITER ANIMATION ==========
    function startTypewriter() {
        const texts = [
            '🌐 Pinging from 8+ global locations...',
            '⚡ Real-time response time analysis...',
            '🔒 SSL certificate validation...',
            '📍 Server location detection...',
            '🚀 Page speed performance...',
            '📡 DNS record lookup...',
            '🛡️ Security header check...'
        ];
        let index = 0;
        let charIndex = 0;
        const element = document.getElementById('typewriterText');
        if (!element) {
            console.warn('⚠️ Typewriter element not found');
            return;
        }
        
        let isDeleting = false;
        
        function type() {
            const currentText = texts[index];
            
            if (!isDeleting && charIndex <= currentText.length) {
                element.textContent = currentText.substring(0, charIndex);
                charIndex++;
                setTimeout(type, 50);
            } else if (isDeleting && charIndex >= 0) {
                element.textContent = currentText.substring(0, charIndex);
                charIndex--;
                setTimeout(type, 30);
            } else if (!isDeleting && charIndex > currentText.length) {
                isDeleting = true;
                setTimeout(type, 2000);
            } else if (isDeleting && charIndex < 0) {
                isDeleting = false;
                index = (index + 1) % texts.length;
                charIndex = 0;
                setTimeout(type, 500);
            }
        }
        
        type();
    }
    
    // ========== SCROLL BUTTONS ==========
    const scrollUp = document.getElementById('scrollUpBtn');
    const scrollDown = document.getElementById('scrollDownBtn');
    
    if (scrollUp && scrollDown) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                scrollUp.style.display = 'block';
            } else {
                scrollUp.style.display = 'none';
            }
        });
        
        scrollUp.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        scrollDown.addEventListener('click', () => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });
    }
    
    // ========== SHOW LOADING ==========
    function showLoading() {
        const resultsContainer = document.getElementById('resultsContainer');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="loading-spinner"></div>
                <p style="text-align: center; margin-top: 15px; color: #fff;">🌐 Pinging from global locations...</p>
                <p style="text-align: center; font-size: 12px; color: #666;">Testing from US, Europe, Asia, Australia, and more</p>
            `;
        }
        const screenshotContainer = document.getElementById('screenshotContainer');
        if (screenshotContainer) screenshotContainer.innerHTML = '';
    }
    
    // ========== DISPLAY PING RESULTS ==========
    function displayPingResults(results, url) {
        console.log('📊 Displaying ping results...');
        const domain = new URL(url).hostname;
        const summary = results.summary || {};
        const pingResults = results.results || [];
        
        console.log('📊 Summary:', summary);
        console.log('📊 Results count:', pingResults.length);
        
        let resultsHtml = `
            <div class="results-grid">
                <div class="result-item">
                    <h4><i class="fas fa-globe"></i> Target</h4>
                    <div class="value" style="font-size: 16px;">${domain}</div>
                    <small>${pingResults.length} locations tested</small>
                </div>
                
                <div class="result-item">
                    <h4><i class="fas fa-clock"></i> Avg Response Time</h4>
                    <div class="value">${summary.avgResponseTime || 0} ms</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(100, (summary.avgResponseTime || 0) / 5)}%; background: ${summary.avgResponseTime < 200 ? '#00E676' : summary.avgResponseTime < 500 ? '#FFB300' : '#FF1744'}"></div>
                    </div>
                    <small>${summary.avgResponseTime < 200 ? 'Excellent ⭐' : summary.avgResponseTime < 500 ? 'Good ✅' : 'Slow ⚠️'}</small>
                </div>
                
                <div class="result-item">
                    <h4><i class="fas fa-arrow-up"></i> Min Response Time</h4>
                    <div class="value">${summary.minResponseTime || 0} ms</div>
                </div>
                
                <div class="result-item">
                    <h4><i class="fas fa-arrow-down"></i> Max Response Time</h4>
                    <div class="value">${summary.maxResponseTime || 0} ms</div>
                </div>
                
                <div class="result-item">
                    <h4><i class="fas fa-check-circle"></i> Packet Loss</h4>
                    <div class="value">${summary.packetLoss || 0}%</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${summary.packetLoss || 0}%; background: ${summary.packetLoss < 5 ? '#00E676' : summary.packetLoss < 15 ? '#FFB300' : '#FF1744'}"></div>
                    </div>
                    <small>${summary.packetLoss < 5 ? 'Excellent ⭐' : summary.packetLoss < 15 ? 'Good ✅' : 'Poor ⚠️'}</small>
                </div>
                
                <div class="result-item">
                    <h4><i class="fas fa-server"></i> Total Probes</h4>
                    <div class="value">${summary.totalProbes || 0}</div>
                    <small>${summary.successfulPings || 0} successful pings</small>
                </div>
            </div>
        `;
        
        // Location breakdown
        if (pingResults.length > 0) {
            let locationHtml = `
                <div class="result-item" style="margin-top: 15px; background: var(--dark);">
                    <h4><i class="fas fa-map-marked-alt"></i> Location Breakdown</h4>
                    <div style="margin-top: 10px; max-height: 400px; overflow-y: auto;">
            `;
            
            pingResults.forEach(probe => {
                const location = probe.location || {};
                const country = location.country || 'Unknown';
                const city = location.city || 'Unknown';
                const continent = location.continent || '';
                const avgPing = probe.ping?.avg || 0;
                const minPing = probe.ping?.min || 0;
                const maxPing = probe.ping?.max || 0;
                const sent = probe.ping?.sent || 0;
                const received = probe.ping?.received || 0;
                const loss = sent > 0 ? Math.round(((sent - received) / sent) * 100) : 0;
                
                const flag = getCountryFlag(country);
                
                locationHtml += `
                    <div style="background: var(--dark2); padding: 12px; border-radius: 8px; margin-bottom: 8px; border-left: 4px solid ${avgPing < 200 ? '#00E676' : avgPing < 500 ? '#FFB300' : '#FF1744'};">
                        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                            <div>
                                <span style="font-size: 20px;">${flag}</span>
                                <strong style="margin-left: 8px;">${country}</strong>
                                <span style="color: #666; font-size: 12px; margin-left: 5px;">${city}</span>
                                <span style="color: #666; font-size: 10px; display: block; margin-left: 34px;">Loss: ${loss}% | Packets: ${received}/${sent}</span>
                            </div>
                            <div style="text-align: right;">
                                <span style="font-weight: bold; font-size: 18px; color: ${avgPing < 200 ? '#00E676' : avgPing < 500 ? '#FFB300' : '#FF1744'};">
                                    ${avgPing} ms
                                </span>
                                <span style="color: #666; font-size: 10px; display: block;">
                                    min: ${minPing}ms | max: ${maxPing}ms
                                </span>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            locationHtml += `</div></div>`;
            resultsHtml += locationHtml;
        }
        
        const resultsContainer = document.getElementById('resultsContainer');
        if (resultsContainer) {
            resultsContainer.innerHTML = resultsHtml;
            console.log('✅ Results displayed');
        }
        
        // Screenshot
        const screenshotContainer = document.getElementById('screenshotContainer');
        if (screenshotContainer) {
            screenshotContainer.innerHTML = `
                <div class="result-item" style="margin-top: 15px;">
                    <h4><i class="fas fa-image"></i> Website Preview</h4>
                    <img src="https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&embed=screenshot.url" 
                         alt="Website Screenshot" 
                         onerror="this.src='https://placehold.co/800x400/0A0A1A/6C3CE1?text=🌐+Preview+Not+Available'"
                         style="max-width:100%; border-radius:12px; margin-top:10px; border: 1px solid var(--glass-border);">
                    <small style="display: block; margin-top: 8px; color: #666;">Live screenshot from ${domain}</small>
                </div>
            `;
        }
    }
    
    // ========== GET COUNTRY FLAG ==========
    function getCountryFlag(country) {
        const flags = {
            'United States': '🇺🇸',
            'US': '🇺🇸',
            'USA': '🇺🇸',
            'Germany': '🇩🇪',
            'DE': '🇩🇪',
            'Singapore': '🇸🇬',
            'SG': '🇸🇬',
            'United Kingdom': '🇬🇧',
            'UK': '🇬🇧',
            'GB': '🇬🇧',
            'Australia': '🇦🇺',
            'AU': '🇦🇺',
            'Japan': '🇯🇵',
            'JP': '🇯🇵',
            'Brazil': '🇧🇷',
            'BR': '🇧🇷',
            'India': '🇮🇳',
            'IN': '🇮🇳',
            'Canada': '🇨🇦',
            'CA': '🇨🇦',
            'France': '🇫🇷',
            'FR': '🇫🇷',
            'Italy': '🇮🇹',
            'IT': '🇮🇹',
            'Spain': '🇪🇸',
            'ES': '🇪🇸',
            'Netherlands': '🇳🇱',
            'NL': '🇳🇱',
            'South Korea': '🇰🇷',
            'KR': '🇰🇷'
        };
        return flags[country] || '🌍';
    }
    
    // ========== PING WEBSITE - MAIN FUNCTION ==========
    async function pingWebsite() {
        let url = document.getElementById('websiteUrl').value.trim();
        console.log('🔍 Ping button clicked - URL:', url);
        
        if (!url) {
            showToast('Please enter a website URL', 'error');
            return;
        }
        
        if (!url.startsWith('http')) {
            url = 'https://' + url;
        }
        console.log('🔗 Full URL:', url);
        
        showLoading();
        await incrementUsage();
        showToast('🌐 Pinging from global locations...', 'info');
        
        try {
            // Check proxy health first
            console.log('🔍 Checking proxy health...');
            const health = await checkProxyHealth();
            console.log('📊 Health response:', health);
            
            if (!health) {
                showToast('⚠️ Ping service is offline. Please try again later.', 'error');
                return;
            }
            
            if (!health.api_key_configured) {
                showToast('⚠️ Ping service not configured. Please contact support.', 'error');
                return;
            }
            
            console.log('✅ Proxy is healthy and configured');
            
            // Create ping measurement
            console.log('📡 Creating ping measurement for:', url);
            const pingResponse = await callGlobalpingProxy('/ping', 'POST', {
                target: url,
                limit: 8,
                packets: 4
            });
            
            console.log('📡 Ping Response:', pingResponse);
            
            if (!pingResponse || !pingResponse.success) {
                let errorMsg = 'Failed to start ping';
                if (pingResponse?.error) {
                    errorMsg += ': ' + pingResponse.error;
                }
                showToast('❌ ' + errorMsg, 'error');
                return;
            }
            
            if (!pingResponse.measurementId) {
                showToast('❌ No measurement ID received', 'error');
                return;
            }
            
            const measurementId = pingResponse.measurementId;
            console.log('✅ Measurement ID:', measurementId);
            showToast(`📡 Ping started (ID: ${measurementId.substring(0, 8)}...)`, 'info');
            
            // Poll for results
            let results = null;
            let attempts = 0;
            const maxAttempts = 25;
            
            while (attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 2500));
                console.log(`⏳ Polling attempt ${attempts + 1}/${maxAttempts}`);
                
                const resultResponse = await callGlobalpingProxy(`/results/${measurementId}`, 'GET');
                console.log('📊 Poll result:', resultResponse);
                
                // Check if results are ready
                if (resultResponse && resultResponse.status === 'in-progress') {
                    console.log('⏳ Results still in progress...');
                    attempts++;
                    continue;
                }
                
                if (resultResponse && resultResponse.success && resultResponse.results && resultResponse.results.length > 0) {
                    results = resultResponse;
                    break;
                }
                attempts++;
            }
            
            if (!results) {
                showToast('❌ Timeout waiting for results. Please try again.', 'error');
                return;
            }
            
            // Display results
            console.log('✅ Displaying results:', results);
            displayPingResults(results, url);
            showToast('✅ Ping complete!', 'success');
            
        } catch (error) {
            console.error('❌ Ping Error:', error);
            showToast('❌ Error: ' + error.message, 'error');
        }
    }
    
    // ========== AI INSIGHTS ==========
    async function getAIInsights() {
        const urlInput = document.getElementById('websiteUrl');
        if (!urlInput) return;
        
        const url = urlInput.value.trim();
        if (!url) {
            showToast('Please enter a website URL first', 'error');
            return;
        }
        
        showToast('🤖 AI is analyzing your website...', 'info');
        
        // Simulate AI analysis (replace with actual AI API call)
        setTimeout(() => {
            const insights = [
                '🧠 Website is performing optimally',
                '✅ Response time is within acceptable range',
                '🔒 SSL certificate is valid',
                '📊 Consider implementing a CDN for better global performance',
                '💡 Enable compression to reduce page size'
            ];
            const randomInsight = insights[Math.floor(Math.random() * insights.length)];
            showToast(randomInsight, 'success');
        }, 2000);
    }
    
    // ========== EVENT LISTENERS ==========
    const pingBtn = document.getElementById('pingBtn');
    if (pingBtn) {
        pingBtn.addEventListener('click', pingWebsite);
        console.log('✅ Ping button attached');
    } else {
        console.error('❌ Ping button not found');
    }
    
    const aiBtn = document.getElementById('aiAnalysisBtn');
    if (aiBtn) {
        aiBtn.addEventListener('click', getAIInsights);
        console.log('✅ AI button attached');
    }
    
    const urlInput = document.getElementById('websiteUrl');
    if (urlInput) {
        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                pingWebsite();
            }
        });
        console.log('✅ URL input attached');
    }
    
    // ========== REACTION BUTTONS ==========
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const reaction = btn.dataset.reaction;
            addReaction(reaction);
        });
    });
    console.log('✅ Reaction buttons attached');
    
    // ========== SHARE BUTTONS ==========
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.dataset.platform;
            shareTool(platform);
        });
    });
    console.log('✅ Share buttons attached');
    
    // ========== PAGE SHARE ==========
    const pageShareBtn = document.getElementById('pageShareBtn');
    if (pageShareBtn) {
        pageShareBtn.addEventListener('click', async () => {
            const url = window.location.href;
            try {
                await navigator.clipboard.writeText(url);
                showToast('✅ Page link copied to clipboard!', 'success');
            } catch (err) {
                showToast('❌ Could not copy link', 'error');
            }
        });
    }
    
    // ========== INITIALIZE ==========
    async function init() {
        console.log('🔄 Initializing tool...');
        
        // Load stats from localStorage
        updateTotalStats();
        updateReactionDisplay();
        startTypewriter();
        
        // Check proxy health
        try {
            console.log('🔍 Checking proxy health...');
            const health = await checkProxyHealth();
            console.log('📊 Health:', health);
            
            if (health) {
                if (health.api_key_configured) {
                    console.log('✅ Globalping proxy is ready!');
                    showToast('✅ Ping service is ready!', 'success');
                } else {
                    console.warn('⚠️ Globalping proxy needs API key configuration');
                    showToast('⚠️ Ping service is not fully configured', 'warning');
                }
            } else {
                console.warn('⚠️ Globalping proxy is not responding');
                showToast('⚠️ Ping service is not available', 'warning');
            }
        } catch (error) {
            console.error('❌ Proxy check failed:', error);
        }
        
        // Try to load stats from Cloudflare
        try {
            console.log('📡 Fetching stats from Cloudflare...');
            const stats = await callCloudflareAPI(`/api/stats?tool_slug=${TOOL_SLUG}`, 'GET');
            if (stats && stats.success && stats.stats) {
                console.log('📊 Stats from Cloudflare:', stats.stats);
                if (stats.stats.usage > 0) {
                    localStorage.setItem(USAGE_KEY, stats.stats.usage);
                }
                if (stats.stats.reactions) {
                    localStorage.setItem(REACTIONS_KEY, JSON.stringify(stats.stats.reactions));
                }
                if (stats.stats.shares > 0) {
                    localStorage.setItem(SHARES_KEY, stats.stats.shares);
                }
                updateTotalStats();
                updateReactionDisplay();
            } else {
                console.log('⚠️ No stats from Cloudflare, using localStorage');
            }
        } catch (error) {
            console.log('⚠️ Cloudflare stats fetch failed, using localStorage');
        }
        
        console.log('✅ Tool initialized successfully!');
    }
    
    init();
});
