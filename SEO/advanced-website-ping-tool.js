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
    function pingWebsite() {
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
        
        // Simulate ping and other checks with timeout
        setTimeout(() => {
            showPingResults(normalizedUrl);
            pingButton.disabled = false;
            pingButton.innerHTML = '<i class="fas fa-broadcast-tower"></i> Ping Website';
        }, 2000);
    }
    
    // Display Results
    function showPingResults(url) {
        const domain = new URL(url).hostname;
        
        // Generate random but realistic results for demonstration
        const isUp = Math.random() > 0.1; // 90% chance site is up
        const responseTime = Math.floor(Math.random() * 800) + 50; // 50-850ms
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
            
            if (checkSpeed.checked) {
                const loadTime = Math.floor(Math.random() * 3000) + 500; // 500-3500ms
                const pageSize = Math.floor(Math.random() * 3500) + 500; // 500-4000KB
                const requests = Math.floor(Math.random() * 120) + 10; // 10-130 requests
                
                resultsHtml += `
                    <div class="result-item">
                        <div class="result-title">Page Load Time <span class="result-value ${loadTime < 1500 ? 'positive' : loadTime < 2500 ? 'neutral' : 'negative'}">${loadTime} ms</span></div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${Math.min(100, loadTime/50)}%"></div>
                        </div>
                        <p>${loadTime < 1500 ? 'Fast' : loadTime < 2500 ? 'Average' : 'Slow'} loading time</p>
                    </div>
                    
                    <div class="result-item">
                        <div class="result-title">Page Size <span class="result-value ${pageSize < 1500 ? 'positive' : pageSize < 2500 ? 'neutral' : 'negative'}">${pageSize} KB</span></div>
                        <p>${pageSize < 1500 ? 'Lightweight' : pageSize < 2500 ? 'Moderate' : 'Heavy'} page size</p>
                    </div>
                    
                    <div class="result-item">
                        <div class="result-title">HTTP Requests <span class="result-value ${requests < 50 ? 'positive' : requests < 80 ? 'neutral' : 'negative'}">${requests}</span></div>
                        <p>${requests < 50 ? 'Few' : requests < 80 ? 'Moderate' : 'Many'} requests needed to load the page</p>
                    </div>
                `;
            }
            
            if (checkSecurity.checked) {
                const hasSSL = Math.random() > 0.2; // 80% chance site has SSL
                const securityScore = Math.floor(Math.random() * 40) + 60; // 60-100 score
                
                resultsHtml += `
                    <div class="result-item">
                        <div class="result-title">SSL Certificate <span class="result-value ${hasSSL ? 'positive' : 'negative'}">${hasSSL ? 'Valid <i class="fas fa-lock"></i>' : 'Invalid <i class="fas fa-lock-open"></i>'}</span></div>
                        <p>${hasSSL ? 'Your connection to this website is secure.' : 'This website does not have a valid SSL certificate.'}</p>
                    </div>
                    
                    <div class="result-item">
                        <div class="result-title">Security Score <span class="result-value ${securityScore > 80 ? 'positive' : securityScore > 60 ? 'neutral' : 'negative'}">${securityScore}/100</span></div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${securityScore}%"></div>
                        </div>
                        <p>${securityScore > 80 ? 'Good' : securityScore > 60 ? 'Average' : 'Poor'} security rating</p>
                    </div>
                `;
            }
            
            if (checkTraffic.checked) {
                // Show traffic stats
                statsContainer.style.display = 'flex';
                
                // Generate random traffic data
                const activeUsers = Math.floor(Math.random() * 500) + 50;
                const dailyVisitors = Math.floor(Math.random() * 10000) + 1000;
                const organicClicks = Math.floor(Math.random() * 5000) + 500;
                const bounceRate = Math.floor(Math.random() * 50) + 30;
                
                document.getElementById('active-users').textContent = activeUsers.toLocaleString();
                document.getElementById('daily-visitors').textContent = dailyVisitors.toLocaleString();
                document.getElementById('organic-clicks').textContent = organicClicks.toLocaleString();
                document.getElementById('bounce-rate').textContent = bounceRate + '%';
                
                // Update world map visualization
                updateWorldMap();
                
                // Show AI insights
                showAIInsights(url, responseTime, loadTime, pageSize, requests, securityScore);
            }
        }
        
        resultsContainer.innerHTML = resultsHtml;
        
        // Animate progress bars
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
    function showAIInsights(url, responseTime, loadTime, pageSize, requests, securityScore) {
        aiInsights.style.display = 'block';
        
        let insightsHtml = '';
        
        // Performance insights
        if (responseTime > 500) {
            insightsHtml += `
                <div class="insight-item">
                    <h4><i class="fas fa-tachometer-alt"></i> Performance Issue</h4>
                    <p>Your server response time is high. Consider using a CDN or optimizing your server configuration.</p>
                </div>
            `;
        }
        
        if (loadTime > 2000) {
            insightsHtml += `
                <div class="insight-item">
                    <h4><i class="fas fa-hourglass-half"></i> Slow Page Load</h4>
                    <p>Your page takes too long to load. Optimize images, minimize CSS/JS, and leverage browser caching.</p>
                </div>
            `;
        }
        
        if (pageSize > 2500) {
            insightsHtml += `
                <div class="insight-item">
                    <h4><i class="fas fa-weight-hanging"></i> Heavy Page</h4>
                    <p>Your page size is large. Compress images and remove unused code to improve loading speed.</p>
                </div>
            `;
        }
        
        if (requests > 80) {
            insightsHtml += `
                <div class="insight-item">
                    <h4><i class="fas fa-network-wired"></i> Too Many Requests</h4>
                    <p>Your page makes many HTTP requests. Combine files where possible to reduce request count.</p>
                </div>
            `;
        }
        
        if (securityScore < 80) {
            insightsHtml += `
                <div class="insight-item">
                    <h4><i class="fas fa-shield-alt"></i> Security Recommendations</h4>
                    <p>Consider implementing additional security headers and regularly updating your software.</p>
                </div>
            `;
        }
        
        // Positive insights
        if (responseTime < 200 && loadTime < 1500 && pageSize < 1500) {
            insightsHtml += `
                <div class="insight-item">
                    <h4><i class="fas fa-award"></i> Excellent Performance</h4>
                    <p>Your website demonstrates excellent performance metrics. Keep up the good work!</p>
                </div>
            `;
        }
        
        if (insightsHtml === '') {
            insightsHtml = `
                <div class="insight-item">
                    <h4><i class="fas fa-info-circle"></i> Good Performance</h4>
                    <p>Your website performance is within acceptable ranges. No critical issues detected.</p>
                </div>
            `;
        }
        
        insightsContent.innerHTML = insightsHtml;
    }
    
    // Helper Functions
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
    
    function updateWorldMap() {
        const mapElement = document.getElementById('world-map');
        mapElement.innerHTML = '';
        
        // Create a simple world map visualization
        const countries = [
            {name: 'USA', value: Math.floor(Math.random() * 100) + 50},
            {name: 'UK', value: Math.floor(Math.random() * 80) + 30},
            {name: 'Germany', value: Math.floor(Math.random() * 70) + 20},
            {name: 'Japan', value: Math.floor(Math.random() * 60) + 20},
            {name: 'India', value: Math.floor(Math.random() * 90) + 40},
            {name: 'Brazil', value: Math.floor(Math.random() * 50) + 15},
            {name: 'Australia', value: Math.floor(Math.random() * 40) + 10},
            {name: 'Canada', value: Math.floor(Math.random() * 45) + 15}
        ];
        
        let trafficHtml = `
            <div style="width: 100%;">
                <h4 style="text-align: center; margin-bottom: 20px;">Traffic by Country</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px;">
        `;
        
        countries.forEach(country => {
            const percentage = Math.round((country.value / 300) * 100);
            trafficHtml += `
                <div style="background: var(--card-bg); padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-weight: 600;">${country.name}</span>
                        <span>${percentage}%</span>
                    </div>
                    <div style="background: var(--gray-light); height: 10px; border-radius: 5px;">
                        <div style="background: linear-gradient(90deg, var(--primary), var(--secondary)); width: ${percentage}%; height: 100%; border-radius: 5px;"></div>
                    </div>
                </div>
            `;
        });
        
        trafficHtml += '</div></div>';
        mapElement.innerHTML = trafficHtml;
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