document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const pingButton = document.getElementById('ping-button');
    const websiteUrl = document.getElementById('website-url');
    const resultsContainer = document.getElementById('results-container');
    const statsContainer = document.getElementById('stats-container');
    const checkSpeed = document.getElementById('check-speed');
    const checkTraffic = document.getElementById('check-traffic');
    const checkSecurity = document.getElementById('check-security');
    const themeToggle = document.getElementById('theme-toggle');
    const aiInsights = document.getElementById('ai-insights');
    const insightsContent = document.getElementById('insights-content');
    
    // Theme Toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Check for saved theme or prefer-color-scheme
    if (localStorage.getItem('theme') === 'dark' || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('theme'))) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Ping Website Event Listeners
    pingButton.addEventListener('click', pingWebsite);
    websiteUrl.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            pingWebsite();
        }
    });
    
    // Theme Toggle Function
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
    
    // Main Ping Function
    async function pingWebsite() {
        const url = websiteUrl.value.trim();
        if (!url) {
            showNotification('Please enter a valid website URL', 'error');
            return;
        }
        
        // Normalize URL
        let normalizedUrl = url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            normalizedUrl = 'https://' + url;
        }
        
        // Validate URL format
        try {
            new URL(normalizedUrl);
        } catch (e) {
            showNotification('Please enter a valid website URL', 'error');
            return;
        }
        
        // Show loading state
        pingButton.disabled = true;
        pingButton.innerHTML = '<span class="loading"></span> Pinging...';
        resultsContainer.innerHTML = '<p><span class="loading"></span> Checking website availability...</p>';
        statsContainer.style.display = 'none';
        aiInsights.style.display = 'none';
        
        // Try real API first, then fallback to simulated data
        try {
            await showPingResults(normalizedUrl);
        } catch (error) {
            console.error('Ping error:', error);
            showSimulatedData(normalizedUrl);
        } finally {
            pingButton.disabled = false;
            pingButton.innerHTML = '<i class="fas fa-broadcast-tower"></i> Ping Website';
        }
    }
    
    // Real API Data Fetch Function
    async function fetchRealPageSpeedData(url) {
        try {
            const response = await fetch(`/api/ping?url=${encodeURIComponent(url)}`);
            
            if (!response.ok) {
                throw new Error(`API response error: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                return result.data;
            } else {
                throw new Error(result.error || 'Unknown API error');
            }
        } catch (error) {
            console.log('Real API failed, using simulated data:', error);
            return null;
        }
    }
    
    // Main Results Function
    async function showPingResults(url) {
        const realData = await fetchRealPageSpeedData(url);
        
        if (realData) {
            showRealData(realData, url);
        } else {
            showSimulatedData(url);
        }
    }
    
    // Show Real Data from API
    function showRealData(realData, url) {
        let resultsHtml = `
            <div class="result-item">
                <div class="result-title">Website Status <span class="result-value positive">Online <i class="fas fa-check-circle"></i></span></div>
                <p>Successfully connected to ${url}</p>
            </div>
            
            <div class="result-item">
                <div class="result-title">Performance Score <span class="result-value ${getScoreColor(realData.performance)}">${realData.performance}/100</span></div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${realData.performance}%"></div>
                </div>
                <p>${getPerformanceText(realData.performance)}</p>
            </div>
            
            <div class="result-item">
                <div class="result-title">Accessibility Score <span class="result-value ${getScoreColor(realData.accessibility)}">${realData.accessibility}/100</span></div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${realData.accessibility}%"></div>
                </div>
                <p>${getScoreText(realData.accessibility, 'accessibility')}</p>
            </div>
            
            <div class="result-item">
                <div class="result-title">Best Practices Score <span class="result-value ${getScoreColor(realData.bestPractices)}">${realData.bestPractices}/100</span></div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${realData.bestPractices}%"></div>
                </div>
                <p>${getScoreText(realData.bestPractices, 'best practices')}</p>
            </div>
            
            <div class="result-item">
                <div class="result-title">SEO Score <span class="result-value ${getScoreColor(realData.seo)}">${realData.seo}/100</span></div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${realData.seo}%"></div>
                </div>
                <p>${getScoreText(realData.seo, 'SEO')}</p>
            </div>
        `;

        // Add performance metrics
        resultsHtml += `
            <div class="result-item">
                <div class="result-title">First Contentful Paint <span class="result-value">${realData.firstContentfulPaint}</span></div>
                <p>Time to first content render</p>
            </div>
            
            <div class="result-item">
                <div class="result-title">Largest Contentful Paint <span class="result-value">${realData.largestContentfulPaint}</span></div>
                <p>Time to largest content render</p>
            </div>
            
            <div class="result-item">
                <div class="result-title">Cumulative Layout Shift <span class="result-value">${realData.cumulativeLayoutShift}</span></div>
                <p>Visual stability score</p>
            </div>
        `;

        if (realData.speedIndex !== 'N/A') {
            resultsHtml += `
                <div class="result-item">
                    <div class="result-title">Speed Index <span class="result-value">${realData.speedIndex}</span></div>
                    <p>Overall loading performance</p>
                </div>
            `;
        }

        resultsContainer.innerHTML = resultsHtml;
        
        // Show AI Insights
        showAIInsights(realData, url);
        
        // Animate progress bars
        animateProgressBars();
    }
    
    // Show Simulated Data (Fallback)
    function showSimulatedData(url) {
        const domain = new URL(url).hostname;
        
        // Generate random but realistic results for demonstration
        const isUp = Math.random() > 0.1;
        const responseTime = Math.floor(Math.random() * 800) + 50;
        const serverLocation = getRandomLocation();
        const serverIp = generateRandomIp();
        
        let resultsHtml = `
            <div class="result-item">
                <div class="result-title">Website Status <span class="result-value ${isUp ? 'positive' : 'negative'}">${isUp ? 'Online <i class="fas fa-check-circle"></i>' : 'Offline <i class="fas fa-exclamation-circle"></i>'}</span></div>
                ${!isUp ? '<p>We couldn\'t reach the website. It may be down or blocking our requests.</p>' : ''}
            </div>
        `;
        
        if (isUp) {
            resultsHtml += `
                <div class="result-item">
                    <div class="result-title">Response Time <span class="result-value">${responseTime} ms</span></div>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${Math.min(100, responseTime/10)}%"></div>
                    </div>
                    <p>${responseTime < 200 ? 'Excellent' : responseTime < 500 ? 'Good' : 'Slow'} response time</p>
                </div>
                
                <div class="result-item">
                    <div class="result-title">Server Location <span class="result-value">${serverLocation}</span></div>
                    <p>IP Address: ${serverIp}</p>
                </div>
            `;
            
            // Simulated additional data...
            // (Rest of your existing simulated data code here)
        }
        
        resultsContainer.innerHTML = resultsHtml;
        animateProgressBars();
    }
    
    // Helper Functions
    function getScoreColor(score) {
        if (score >= 90) return 'positive';
        if (score >= 50) return 'neutral';
        return 'negative';
    }
    
    function getPerformanceText(score) {
        if (score >= 90) return 'Excellent performance';
        if (score >= 75) return 'Good performance';
        if (score >= 50) return 'Needs improvement';
        return 'Poor performance';
    }
    
    function getScoreText(score, type) {
        if (score >= 90) return `Excellent ${type}`;
        if (score >= 75) return `Good ${type}`;
        if (score >= 50) return `Average ${type}`;
        return `Poor ${type}`;
    }
    
    function animateProgressBars() {
        setTimeout(() => {
            document.querySelectorAll('.progress').forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
        }, 300);
    }
    
    // Show AI Insights
    function showAIInsights(realData, url) {
        aiInsights.style.display = 'block';
        
        let insightsHtml = '';
        
        // Performance insights
        if (realData.performance < 80) {
            insightsHtml += `
                <div class="insight-item">
                    <h4><i class="fas fa-tachometer-alt"></i> Performance Improvement</h4>
                    <p>Your performance score is ${realData.performance}. Optimize images and reduce JavaScript execution time.</p>
                </div>
            `;
        }
        
        if (realData.accessibility < 80) {
            insightsHtml += `
                <div class="insight-item">
                    <h4><i class="fas fa-universal-access"></i> Accessibility Enhancement</h4>
                    <p>Improve accessibility (score: ${realData.accessibility}) by adding alt texts and proper ARIA labels.</p>
                </div>
            `;
        }
        
        if (realData.seo < 80) {
            insightsHtml += `
                <div class="insight-item">
                    <h4><i class="fas fa-search"></i> SEO Optimization</h4>
                    <p>Your SEO score is ${realData.seo}. Improve meta tags and content structure.</p>
                </div>
            `;
        }
        
        // Positive insights
        if (realData.performance >= 90 && realData.accessibility >= 90) {
            insightsHtml += `
                <div class="insight-item">
                    <h4><i class="fas fa-award"></i> Excellent Website</h4>
                    <p>Your website shows excellent performance and accessibility scores!</p>
                </div>
            `;
        }
        
        if (insightsHtml === '') {
            insightsHtml = `
                <div class="insight-item">
                    <h4><i class="fas fa-info-circle"></i> Good Performance</h4>
                    <p>Your website performance is good. No critical issues detected.</p>
                </div>
            `;
        }
        
        insightsContent.innerHTML = insightsHtml;
    }
    
    // Existing helper functions from your original code
    function getRandomLocation() {
        const locations = [
            'New York, USA', 'London, UK', 'Tokyo, Japan', 
            'Sydney, Australia', 'Frankfurt, Germany', 
            'São Paulo, Brazil', 'Singapore', 'Mumbai, India'
        ];
        return locations[Math.floor(Math.random() * locations.length)];
    }
    
    function generateRandomIp() {
        return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    }
    
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;
        
        // Add styles for notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? 'var(--tertiary)' : 'var(--secondary)'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: var(--shadow);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        
        // Add styles for close button
        notification.querySelector('button').style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            margin-left: 15px;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
});
