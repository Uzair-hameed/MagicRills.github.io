// Advanced Auto Traffic Generator - Complete Working Version
class TrafficGenerator {
    constructor() {
        this.trafficInterval = null;
        this.metricsInterval = null;
        this.totalVisitors = 0;
        this.currentVisitors = 0;
        this.isPaused = false;
        this.isRunning = false;
        this.currentSpeed = 0;
        this.targetVisitors = 0;
        this.completedVisitors = 0;
        this.startTime = null;
        this.pages = [];
        this.trafficData = {
            countries: {},
            sources: {},
            behavior: {}
        };
        
        // Configuration
        this.countries = {
            us: { name: "United States", flag: "🇺🇸", traffic: 45 },
            gb: { name: "United Kingdom", flag: "🇬🇧", traffic: 15 },
            ca: { name: "Canada", flag: "🇨🇦", traffic: 10 },
            au: { name: "Australia", flag: "🇦🇺", traffic: 8 },
            de: { name: "Germany", flag: "🇩🇪", traffic: 7 },
            fr: { name: "France", flag: "🇫🇷", traffic: 5 },
            in: { name: "India", flag: "🇮🇳", traffic: 10 }
        };

        this.trafficSources = {
            organic: { name: "Organic Search", color: "#4CAF50", percent: 40 },
            social: { name: "Social Media", color: "#2196F3", percent: 25 },
            direct: { name: "Direct", color: "#FF9800", percent: 20 },
            referral: { name: "Referral", color: "#9C27B0", percent: 15 }
        };

        this.samplePages = [
            { path: "/", title: "Homepage", visits: 100 },
            { path: "/products", title: "Products", visits: 75 },
            { path: "/blog", title: "Blog", visits: 60 },
            { path: "/about", title: "About Us", visits: 40 },
            { path: "/contact", title: "Contact", visits: 25 }
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTheme();
        this.initializeCharts();
        this.updateSpeedPreview();
    }

    setupEventListeners() {
        // Theme toggle
        document.getElementById('theme-switcher').addEventListener('click', () => this.toggleTheme());
        
        // URL validation
        document.getElementById('website-url').addEventListener('input', () => this.validateUrl());
        
        // Speed preview
        document.getElementById('traffic-amount').addEventListener('input', () => this.updateSpeedPreview());
        
        // Control buttons
        document.getElementById('start-button').addEventListener('click', () => this.startTraffic());
        document.getElementById('stop-button').addEventListener('click', () => this.stopTraffic());
        document.getElementById('pause-button').addEventListener('click', () => this.togglePause());
        document.getElementById('boost-button').addEventListener('click', () => this.boostTraffic());
        
        // Tab switching
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
    }

    setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeButton(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeButton(newTheme);
    }

    updateThemeButton(theme) {
        const button = document.getElementById('theme-switcher');
        button.textContent = theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode';
    }

    validateUrl() {
        const urlInput = document.getElementById('website-url');
        const url = urlInput.value.trim();
        if (url && !url.startsWith('http')) {
            urlInput.value = 'https://' + url;
        }
    }

    updateSpeedPreview() {
        const amount = parseInt(document.getElementById('traffic-amount').value) || 1000;
        const speed = Math.ceil(amount / 60);
        if (!this.isRunning) {
            document.getElementById('current-speed').textContent = speed;
        }
    }

    validateWebsiteUrl(url) {
        if (!url) return false;
        
        // Basic URL validation
        const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
        return urlPattern.test(url);
    }

    startTraffic() {
        const urlInput = document.getElementById('website-url');
        const trafficAmount = parseInt(document.getElementById('traffic-amount').value);
        const trafficDuration = parseInt(document.getElementById('traffic-duration').value);
        const trafficType = document.getElementById('traffic-type').value;
        const targetCountries = Array.from(document.getElementById('target-countries').selectedOptions)
                                    .map(option => option.value);
        const enableBounce = document.getElementById('enable-bounce').checked;
        const enableAI = document.getElementById('enable-ai').checked;

        const url = urlInput.value.trim();
        
        if (!this.validateWebsiteUrl(url)) {
            this.showError('Please enter a valid website URL (e.g., example.com or https://example.com)');
            return;
        }
        
        if (this.isRunning) {
            this.showError('Traffic generation is already running');
            return;
        }
        
        // Initialize traffic data
        this.totalVisitors = 0;
        this.currentVisitors = 0;
        this.completedVisitors = 0;
        this.isPaused = false;
        this.isRunning = true;
        this.targetVisitors = trafficAmount * trafficDuration;
        this.startTime = new Date();
        
        // Calculate visitors per minute
        this.currentSpeed = Math.ceil(trafficAmount / 60);
        
        // Show results section
        document.getElementById('results-placeholder').classList.add('hidden');
        document.getElementById('results-container').classList.remove('hidden');
        
        // Update UI
        document.getElementById('start-button').disabled = true;
        document.getElementById('pause-button').textContent = '⏸️ Pause';
        
        // Initialize traffic data structures
        this.initializeTrafficData(targetCountries, trafficType, enableAI);
        
        // Start traffic generation
        this.trafficInterval = setInterval(() => this.generateTraffic(), 1000);
        
        // Start animation
        this.startTrafficAnimation();
        
        // Update metrics periodically
        this.metricsInterval = setInterval(() => this.updateMetrics(), 2000);

        this.showSuccess('Traffic generation started successfully!');
    }

    initializeTrafficData(targetCountries, trafficType, enableAI) {
        // Initialize countries
        this.trafficData.countries = {};
        const selectedCountries = targetCountries.includes('all') ? Object.keys(this.countries) : targetCountries;
        
        selectedCountries.forEach(country => {
            if (this.countries[country]) {
                this.trafficData.countries[country] = {
                    ...this.countries[country],
                    count: 0
                };
            }
        });

        // Initialize sources based on traffic type
        this.trafficData.sources = {};
        if (trafficType === 'custom') {
            // Equal distribution for custom
            Object.keys(this.trafficSources).forEach(source => {
                this.trafficData.sources[source] = {
                    ...this.trafficSources[source],
                    count: 0,
                    percentage: 25
                };
            });
        } else {
            // Focus on selected type
            Object.keys(this.trafficSources).forEach(source => {
                const percentage = source === trafficType ? 70 : 10;
                this.trafficData.sources[source] = {
                    ...this.trafficSources[source],
                    count: 0,
                    percentage: percentage
                };
            });
        }

        // Initialize behavior
        this.trafficData.behavior = {
            bounceRate: enableAI ? this.getAIBounceRate(trafficType) : 35,
            avgDuration: enableAI ? this.getAIDuration(trafficType) : 2.5,
            pagesPerVisit: enableAI ? this.getAIPagesPerVisit(trafficType) : 3.2
        };

        // Initialize pages
        this.pages = JSON.parse(JSON.stringify(this.samplePages));
    }

    getAIBounceRate(trafficType) {
        const baseRates = {
            organic: 28,
            social: 45,
            direct: 35,
            referral: 40,
            custom: 37
        };
        return baseRates[trafficType] || 35;
    }

    getAIDuration(trafficType) {
        const baseDurations = {
            organic: 3.2,
            social: 2.1,
            direct: 2.8,
            referral: 2.5,
            custom: 2.7
        };
        return baseDurations[trafficType] || 2.5;
    }

    getAIPagesPerVisit(trafficType) {
        const basePages = {
            organic: 3.8,
            social: 2.5,
            direct: 3.2,
            referral: 2.9,
            custom: 3.1
        };
        return basePages[trafficType] || 3.2;
    }

    generateTraffic() {
        if (this.isPaused || !this.isRunning) return;
        
        const visitorsThisSecond = Math.floor(this.currentSpeed / 60) + (Math.random() < (this.currentSpeed % 60) / 60 ? 1 : 0);
        
        for (let i = 0; i < visitorsThisSecond; i++) {
            if (this.totalVisitors < this.targetVisitors) {
                this.addVisitor();
            } else {
                this.stopTraffic();
                break;
            }
        }
        
        this.updateCounters();
    }

    async addVisitor() {
        if (this.totalVisitors >= this.targetVisitors) return;
        
        this.totalVisitors++;
        this.currentVisitors++;
        
        // Simulate geo location
        const countries = Object.keys(this.trafficData.countries);
        const randomCountry = countries[Math.floor(Math.random() * countries.length)];
        if (this.trafficData.countries[randomCountry]) {
            this.trafficData.countries[randomCountry].count++;
        }
        
        // Assign traffic source
        const sourceTypes = Object.keys(this.trafficData.sources);
        const source = this.getRandomWeighted(sourceTypes, type => this.trafficData.sources[type].percentage);
        this.trafficData.sources[source].count++;
        
        // Simulate visit duration and pages
        const visitDuration = this.randomNormal(this.trafficData.behavior.avgDuration * 60 * 1000, 30 * 1000);
        
        setTimeout(() => {
            this.currentVisitors--;
            this.completedVisitors++;
            this.updateCounters();
            
            // Simulate pages visited (some visitors bounce)
            const willBounce = Math.random() < (this.trafficData.behavior.bounceRate / 100);
            const pagesVisited = willBounce ? 1 : Math.max(1, 
                Math.round(this.randomNormal(this.trafficData.behavior.pagesPerVisit, 0.5)));
            
            for (let i = 0; i < pagesVisited; i++) {
                const totalVisits = this.pages.reduce((sum, page) => sum + page.visits, 1);
                const page = this.getRandomWeighted(this.pages, p => (p.visits + 1) / totalVisits);
                page.visits++;
            }
        }, visitDuration);
    }

    updateCounters() {
        document.getElementById('total-traffic').textContent = this.totalVisitors.toLocaleString();
        document.getElementById('current-speed').textContent = this.currentSpeed;
        
        const progress = (this.completedVisitors / this.targetVisitors) * 100;
        document.getElementById('completion-status').textContent = `${Math.round(progress)}% Complete`;
        document.getElementById('generation-progress').style.width = `${progress}%`;
    }

    updateMetrics() {
        if (!this.isRunning) return;
        
        // Update basic metrics
        document.getElementById('bounce-rate').textContent = `${Math.round(this.trafficData.behavior.bounceRate)}%`;
        document.getElementById('avg-duration').textContent = this.formatDuration(this.trafficData.behavior.avgDuration * 60 * 1000);
        
        this.updateSourcesChart();
        this.updateCountryTraffic();
        this.updatePopularPages();
        this.updateSEOImpact();
        this.updateRealTimeStats();
    }

    updateRealTimeStats() {
        document.getElementById('real-time-visitors').textContent = this.currentVisitors;
        
        const totalPageVisits = this.pages.reduce((sum, page) => sum + page.visits, 0);
        const pagesPerVisit = totalPageVisits / (this.completedVisitors || 1);
        document.getElementById('pages-per-visit').textContent = pagesPerVisit.toFixed(1);
        
        const conversionRate = (this.completedVisitors / (this.totalVisitors || 1)) * 100;
        document.getElementById('conversion-rate').textContent = `${Math.round(conversionRate)}%`;
    }

    updateSourcesChart() {
        const container = document.getElementById('sources-chart');
        const total = Object.values(this.trafficData.sources).reduce((sum, source) => sum + source.count, 1);
        
        container.innerHTML = Object.entries(this.trafficData.sources).map(([key, source]) => {
            const percentage = ((source.count / total) * 100).toFixed(1);
            return `
                <div class="source-item">
                    <div style="color: ${source.color}; font-size: 1.2rem;">${this.getSourceIcon(key)}</div>
                    <div class="source-info">
                        <span>${source.name}</span>
                        <span>${percentage}%</span>
                    </div>
                    <div class="source-bar">
                        <div class="source-fill" style="width: ${percentage}%; background: ${source.color};"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    getSourceIcon(sourceType) {
        const icons = {
            organic: '🔍',
            social: '📱',
            direct: '🎯',
            referral: '🔗'
        };
        return icons[sourceType] || '🌐';
    }

    updateCountryTraffic() {
        const container = document.getElementById('country-list');
        const countries = Object.values(this.trafficData.countries)
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
        
        const total = countries.reduce((sum, country) => sum + country.count, 1);
        
        container.innerHTML = countries.map(country => {
            const percentage = total > 0 ? ((country.count / total) * 100).toFixed(1) : 0;
            return `
                <div class="country-item">
                    <span>${country.flag} ${country.name}</span>
                    <span>${percentage}% (${country.count})</span>
                </div>
            `;
        }).join('');
    }

    updatePopularPages() {
        const container = document.getElementById('popular-pages-list');
        const sortedPages = [...this.pages].sort((a, b) => b.visits - a.visits);
        const totalVisits = sortedPages.reduce((sum, page) => sum + page.visits, 1);
        
        container.innerHTML = sortedPages.map(page => {
            const percentage = totalVisits > 0 ? ((page.visits / totalVisits) * 100).toFixed(1) : 0;
            return `
                <div class="page-item">
                    <span>${page.title}</span>
                    <span>${percentage}% (${page.visits})</span>
                </div>
            `;
        }).join('');
    }

    updateSEOImpact() {
        const progress = (this.completedVisitors / this.targetVisitors) * 100;
        const seoScore = Math.min(100, Math.round(progress * 0.8 + (this.trafficData.behavior.avgDuration * 10)));
        
        document.querySelector('.score-value').textContent = seoScore;
        document.querySelector('.score-circle').style.background = 
            `conic-gradient(var(--primary) ${seoScore}%, var(--border-color) ${seoScore}%)`;
        
        // Update SEO metrics
        const metrics = document.querySelectorAll('.seo-metric .metric-value');
        if (metrics.length >= 3) {
            metrics[0].textContent = `+${Math.round(progress)}%`;
            metrics[1].textContent = `${Math.round(100 - this.trafficData.behavior.bounceRate)}%`;
            metrics[2].textContent = this.formatDuration(this.trafficData.behavior.avgDuration * 60 * 1000);
        }
    }

    stopTraffic() {
        if (this.trafficInterval) {
            clearInterval(this.trafficInterval);
            this.trafficInterval = null;
        }
        if (this.metricsInterval) {
            clearInterval(this.metricsInterval);
            this.metricsInterval = null;
        }
        
        this.isRunning = false;
        this.isPaused = false;
        
        document.getElementById('start-button').disabled = false;
        document.getElementById('pause-button').textContent = '⏸️ Pause';
        
        this.stopTrafficAnimation();
        this.showSuccess('Traffic generation completed successfully!');
    }

    togglePause() {
        if (!this.isRunning) return;
        
        this.isPaused = !this.isPaused;
        const button = document.getElementById('pause-button');
        
        if (this.isPaused) {
            button.textContent = '▶️ Resume';
            this.showWarning('Traffic generation paused');
        } else {
            button.textContent = '⏸️ Pause';
            this.showSuccess('Traffic generation resumed');
        }
    }

    boostTraffic() {
        if (!this.isRunning) return;
        
        this.currentSpeed = Math.min(1000, this.currentSpeed * 1.5);
        this.showSuccess(`Traffic boosted to ${this.currentSpeed} visitors/minute!`);
        
        // Reset boost after 30 seconds
        setTimeout(() => {
            const originalSpeed = Math.ceil(parseInt(document.getElementById('traffic-amount').value) / 60);
            this.currentSpeed = originalSpeed;
        }, 30000);
    }

    startTrafficAnimation() {
        this.stopTrafficAnimation();
        this.animationInterval = setInterval(() => {
            this.createParticle();
        }, 200);
    }

    stopTrafficAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        document.getElementById('traffic-animation').innerHTML = '';
    }

    createParticle() {
        const animation = document.getElementById('traffic-animation');
        const particle = document.createElement('div');
        particle.className = 'traffic-particle';
        
        const size = Math.random() * 8 + 4;
        const left = Math.random() * 100;
        const colors = ['#6a11cb', '#2575fc', '#00d2ff', '#4CAF50', '#FF9800'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.background = color;
        particle.style.animationDuration = `${2 + Math.random() * 2}s`;
        
        animation.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 5000);
    }

    switchTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Remove active class from all tabs
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show selected tab content
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        // Activate selected tab
        document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');
    }

    initializeCharts() {
        this.createSourceChart();
        this.createGeoChart();
        this.createBehaviorChart();
        this.createSEOTab();
    }

    createSourceChart() {
        // Already handled by updateSourcesChart
    }

    createGeoChart() {
        // Already handled by updateCountryTraffic
    }

    createBehaviorChart() {
        // Content will be populated by updatePopularPages
    }

    createSEOTab() {
        // Content is static in HTML, will be updated by updateSEOImpact
    }

    // Utility methods
    getRandomWeighted(items, weightFunction) {
        const weights = items.map(item => weightFunction(item));
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        
        for (let i = 0; i < items.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return items[i];
            }
        }
        
        return items[items.length - 1];
    }

    randomNormal(mean, stdDev) {
        let u = 0, v = 0;
        while(u === 0) u = Math.random();
        while(v === 0) v = Math.random();
        const normal = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return mean + stdDev * normal;
    }

    formatDuration(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showWarning(message) {
        this.showNotification(message, 'warning');
    }

    showNotification(message, type) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
}

// Initialize the traffic generator when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.trafficGenerator = new TrafficGenerator();
});