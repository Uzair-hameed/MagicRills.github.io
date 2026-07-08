// ============================================
// Car Age Calculator Pakistan - Main JavaScript
// Cloudflare Workers API Integration v3.0
// ============================================

// ============================================
// TOOL CONFIGURATION
// ============================================
const TOOL_CONFIG = {
    name: 'Car Age Calculator Pakistan',
    slug: 'car-age-calculator-pakistan',
    category: 'Mixed-Tools',
    apiBase: 'https://magicrills-api.uzairhameed01.workers.dev',
    apiKey: 'magicrills-grok-api.uzairhameed01.workers.dev'
};

const TOOL_ID = TOOL_CONFIG.slug;
let currentUserId = localStorage.getItem('car_calc_user_id') || 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
localStorage.setItem('car_calc_user_id', currentUserId);

// ============================================
// CAR MODELS DATABASE
// ============================================
const carModels = {
    Toyota: ["Corolla 1.3L", "Corolla 1.6L", "Corolla 1.8L", "Camry", "Hilux", "Fortuner", "Prius", "Land Cruiser", "Prado", "Yaris 1.3L", "Yaris 1.5L"],
    Honda: ["Civic 1.5L", "Civic 1.8L", "City 1.2L", "City 1.5L", "Accord", "BR-V", "Vezel", "N-WGN", "Fit"],
    Suzuki: ["Alto 660cc", "Alto 1.0L", "Cultus", "Wagon R", "Swift", "Jimny", "Baleno", "Every"],
    Hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Accent", "i10", "i20", "Grand Starex"],
    Kia: ["Sportage", "Picanto", "Cerato", "Sorento", "Carnival", "Stonic", "Rio"],
    Nissan: ["Sunny", "March", "X-Trail", "Juke", "Note", "Tiida"],
    Mitsubishi: ["Lancer", "Pajero", "Mirage", "Outlander", "ASX"],
    Mercedes: ["A-Class", "C-Class", "E-Class", "S-Class", "GLA", "GLC"],
    BMW: ["1 Series", "3 Series", "5 Series", "7 Series", "X1", "X3", "X5"],
    Audi: ["A3", "A4", "A6", "A8", "Q3", "Q5", "Q7"]
};

// ============================================
// AI INTEGRATION
// ============================================
async function getAIAnalysis(carData) {
    try {
        const response = await fetch(`${TOOL_CONFIG.apiBase}/api/ai/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': TOOL_CONFIG.apiKey
            },
            body: JSON.stringify({
                tool: TOOL_CONFIG.slug,
                data: carData,
                query: `Analyze this car's value in Pakistan market: ${JSON.stringify(carData)}`
            })
        });
        
        if (!response.ok) throw new Error('AI service unavailable');
        const data = await response.json();
        return data.analysis || getFallbackAnalysis(carData);
    } catch (error) {
        console.warn('AI analysis failed, using fallback:', error);
        return getFallbackAnalysis(carData);
    }
}

function getFallbackAnalysis(carData) {
    const { make, model, year, value, age } = carData;
    let recommendation = '';
    let insights = [];
    
    if (age <= 3) {
        recommendation = '🌟 Excellent investment! This car has minimal depreciation.';
        insights = ['Low depreciation rate', 'High demand in market', 'Easy to resell'];
    } else if (age <= 5) {
        recommendation = '👍 Good value! Sweet spot for buying used.';
        insights = ['Optimal value for money', 'Reliable performance', 'Moderate depreciation'];
    } else if (age <= 7) {
        recommendation = '⚠️ Fair price. Negotiate well for best deal.';
        insights = ['Check maintenance history', 'Higher wear and tear', 'Consider additional costs'];
    } else {
        recommendation = '🔧 Older vehicle. Get thorough inspection done.';
        insights = ['Significant depreciation', 'Higher maintenance costs', 'Check spare parts availability'];
    }
    
    return {
        recommendation,
        insights,
        marketTrend: `${make} ${model} holds ${value > 2000000 ? 'strong' : 'moderate'} resale value in Pakistan.`,
        estimatedValue: value
    };
}

// ============================================
// CLOUDFLARE API - USAGE COUNTER
// ============================================
async function incrementUsage() {
    try {
        const hasUsed = localStorage.getItem(`${TOOL_ID}_used`);
        if (hasUsed) return;

        const response = await fetch(`${TOOL_CONFIG.apiBase}/api/usage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': TOOL_CONFIG.apiKey
            },
            body: JSON.stringify({
                tool_slug: TOOL_CONFIG.slug,
                tool_name: TOOL_CONFIG.name,
                category: TOOL_CONFIG.category,
                user_id: currentUserId
            })
        });

        if (response.ok) {
            localStorage.setItem(`${TOOL_ID}_used`, 'true');
            const data = await response.json();
            updateUsageDisplay(data.count || 0);
            return data;
        }
    } catch (error) {
        console.warn('API usage increment failed, using localStorage:', error);
        // Fallback: localStorage
        let count = parseInt(localStorage.getItem(`${TOOL_ID}_count`) || '0');
        count++;
        localStorage.setItem(`${TOOL_ID}_count`, count);
        localStorage.setItem(`${TOOL_ID}_used`, 'true');
        updateUsageDisplay(count);
        return { count };
    }
}

// ============================================
// CLOUDFLARE API - REACTIONS
// ============================================
async function addReaction(emoji) {
    try {
        const userReactions = JSON.parse(localStorage.getItem(`${TOOL_ID}_reactions`) || '{}');
        if (userReactions[emoji]) {
            showToast(`You already reacted with ${emoji}`, 'error');
            return;
        }

        const response = await fetch(`${TOOL_CONFIG.apiBase}/api/reactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': TOOL_CONFIG.apiKey
            },
            body: JSON.stringify({
                tool_slug: TOOL_CONFIG.slug,
                emoji: emoji,
                user_id: currentUserId
            })
        });

        if (response.ok) {
            userReactions[emoji] = true;
            localStorage.setItem(`${TOOL_ID}_reactions`, JSON.stringify(userReactions));
            const data = await response.json();
            updateReactionDisplay(emoji, data.count || 0);
            showToast(`${emoji} reaction added!`, 'success');
        }
    } catch (error) {
        console.warn('API reaction failed, using localStorage:', error);
        // Fallback: localStorage
        const userReactions = JSON.parse(localStorage.getItem(`${TOOL_ID}_reactions`) || '{}');
        if (userReactions[emoji]) {
            showToast(`You already reacted with ${emoji}`, 'error');
            return;
        }
        userReactions[emoji] = true;
        localStorage.setItem(`${TOOL_ID}_reactions`, JSON.stringify(userReactions));
        let count = parseInt(localStorage.getItem(`${TOOL_ID}_reaction_${emoji}`) || '0');
        count++;
        localStorage.setItem(`${TOOL_ID}_reaction_${emoji}`, count);
        updateReactionDisplay(emoji, count);
        showToast(`${emoji} reaction added!`, 'success');
    }
}

// ============================================
// CLOUDFLARE API - SHARES
// ============================================
async function recordShare(platform) {
    try {
        const response = await fetch(`${TOOL_CONFIG.apiBase}/api/shares`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': TOOL_CONFIG.apiKey
            },
            body: JSON.stringify({
                tool_slug: TOOL_CONFIG.slug,
                platform: platform,
                user_id: currentUserId
            })
        });

        if (response.ok) {
            const data = await response.json();
            updateShareDisplay(platform, data.count || 0);
            showToast(`Shared on ${platform}!`, 'success');
        }
    } catch (error) {
        console.warn('API share recording failed, using localStorage:', error);
        // Fallback: localStorage
        let count = parseInt(localStorage.getItem(`${TOOL_ID}_share_${platform}`) || '0');
        count++;
        localStorage.setItem(`${TOOL_ID}_share_${platform}`, count);
        updateShareDisplay(platform, count);
        showToast(`Shared on ${platform}!`, 'success');
    }
}

// ============================================
// CLOUDFLARE API - GET STATS
// ============================================
async function loadStats() {
    try {
        const response = await fetch(`${TOOL_CONFIG.apiBase}/api/stats?tool_slug=${TOOL_CONFIG.slug}`, {
            headers: {
                'X-API-Key': TOOL_CONFIG.apiKey
            }
        });

        if (response.ok) {
            const data = await response.json();
            updateStatsDisplay(data);
            return data;
        }
    } catch (error) {
        console.warn('API stats loading failed, using localStorage:', error);
        // Fallback: localStorage
        const stats = {
            usage: parseInt(localStorage.getItem(`${TOOL_ID}_count`) || '0'),
            views: parseInt(localStorage.getItem(`${TOOL_ID}_views`) || '0'),
            shares: getTotalShares(),
            reactions: getTotalReactions()
        };
        updateStatsDisplay(stats);
        return stats;
    }
}

function getTotalShares() {
    let total = 0;
    ['facebook', 'twitter', 'whatsapp', 'linkedin', 'email', 'copy'].forEach(platform => {
        total += parseInt(localStorage.getItem(`${TOOL_ID}_share_${platform}`) || '0');
    });
    return total;
}

function getTotalReactions() {
    let total = 0;
    ['👍', '❤️', '😮', '😢', '😂', '🎉'].forEach(emoji => {
        total += parseInt(localStorage.getItem(`${TOOL_ID}_reaction_${emoji}`) || '0');
    });
    return total;
}

// ============================================
// UI UPDATE FUNCTIONS
// ============================================
function updateUsageDisplay(count) {
    const usageSpan = document.getElementById('usageCount');
    if (usageSpan) usageSpan.textContent = count.toLocaleString();
}

function updateReactionDisplay(emoji, count) {
    const countSpan = document.getElementById(`count-${emoji}`);
    if (countSpan) countSpan.textContent = count;
}

function updateShareDisplay(platform, count) {
    const shareSpan = document.getElementById(`share-${platform}-count`);
    if (shareSpan) shareSpan.textContent = count;
}

function updateStatsDisplay(stats) {
    const statsContainer = document.getElementById('statsContainer');
    if (!statsContainer) return;
    
    statsContainer.innerHTML = `
        <div class="stat-item">
            <i class="fas fa-users"></i>
            <span class="stat-number">${(stats.usage || 0).toLocaleString()}</span>
            <span class="stat-label">Total Users</span>
        </div>
        <div class="stat-item">
            <i class="fas fa-eye"></i>
            <span class="stat-number">${(stats.views || 0).toLocaleString()}</span>
            <span class="stat-label">Total Views</span>
        </div>
        <div class="stat-item">
            <i class="fas fa-share-alt"></i>
            <span class="stat-number">${(stats.shares || 0).toLocaleString()}</span>
            <span class="stat-label">Total Shares</span>
        </div>
        <div class="stat-item">
            <i class="fas fa-heart"></i>
            <span class="stat-number">${(stats.reactions || 0).toLocaleString()}</span>
            <span class="stat-label">Reactions</span>
        </div>
    `;
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ============================================
// LOADING SPINNER
// ============================================
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.style.display = show ? 'flex' : 'none';
}

// ============================================
// POPULATE YEARS
// ============================================
function populateYears() {
    const currentYear = new Date().getFullYear();
    const yearSelect = document.getElementById('manufactureYear');
    if (!yearSelect) return;
    
    yearSelect.innerHTML = '<option value="">Select Year</option>';
    for (let year = currentYear; year >= 1980; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

// ============================================
// UPDATE MODELS
// ============================================
function updateModels() {
    const make = document.getElementById('carMake').value;
    const modelSelect = document.getElementById('carModel');
    if (!modelSelect) return;
    
    modelSelect.innerHTML = '<option value="">Select Model</option>';
    if (make && carModels[make]) {
        carModels[make].forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            modelSelect.appendChild(option);
        });
    }
}

// ============================================
// MAIN CALCULATION WITH AI
// ============================================
async function calculateCarValue() {
    const make = document.getElementById('carMake').value;
    const model = document.getElementById('carModel').value;
    const manufactureYear = parseInt(document.getElementById('manufactureYear').value);
    const mileage = parseInt(document.getElementById('mileage').value);
    const condition = document.getElementById('condition').value;
    const city = document.getElementById('city').value;
    const fuelType = document.getElementById('fuelType').value;
    const owners = document.getElementById('owners').value;
    const accidentHistory = document.getElementById('accidentHistory').value;
    const originalPrice = parseFloat(document.getElementById('originalPrice').value);
    
    if (!make || !model || !manufactureYear || !originalPrice) {
        showToast('Please fill all required fields', 'error');
        return;
    }
    
    showLoading(true);
    
    try {
        const currentYear = new Date().getFullYear();
        const carAge = currentYear - manufactureYear;
        
        // Base depreciation
        let depreciationRate = 0.2;
        if (carAge >= 1 && carAge <= 3) depreciationRate = 0.35;
        else if (carAge >= 4 && carAge <= 5) depreciationRate = 0.5;
        else if (carAge >= 6 && carAge <= 7) depreciationRate = 0.65;
        else if (carAge >= 8 && carAge <= 10) depreciationRate = 0.8;
        else if (carAge > 10) depreciationRate = 0.9;
        
        let currentValue = originalPrice * (1 - depreciationRate);
        
        // Adjustments
        if (mileage > 100000) currentValue *= 0.9;
        else if (mileage > 50000) currentValue *= 0.95;
        else if (mileage < 20000) currentValue *= 1.05;
        
        if (condition === 'excellent') currentValue *= 1.1;
        else if (condition === 'verygood') currentValue *= 1.05;
        else if (condition === 'average') currentValue *= 0.9;
        else if (condition === 'poor') currentValue *= 0.8;
        
        if (city === 'karachi') currentValue *= 0.95;
        else if (city === 'islamabad') currentValue *= 1.05;
        else if (city === 'other') currentValue *= 0.97;
        
        if (fuelType === 'diesel') currentValue *= 1.08;
        else if (fuelType === 'cng') currentValue *= 0.95;
        
        if (owners == 2) currentValue *= 0.95;
        else if (owners == 3) currentValue *= 0.9;
        else if (owners >= 4) currentValue *= 0.85;
        
        if (accidentHistory === 'minor') currentValue *= 0.9;
        else if (accidentHistory === 'major') currentValue *= 0.75;
        
        currentValue = Math.round(currentValue);
        
        // Get AI Analysis
        const aiAnalysis = await getAIAnalysis({
            make, model, year: manufactureYear, value: currentValue, age: carAge
        });
        
        // Display Results
        const resultDiv = document.getElementById('result');
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <h3><i class="fas fa-chart-line"></i> Calculation Results</h3>
            <div style="display: grid; gap: 15px;">
                <div class="result-grid">
                    <div><strong>Car:</strong> ${make} ${model}</div>
                    <div><strong>Age:</strong> ${carAge} years (${manufactureYear})</div>
                    <div><strong>Depreciation Rate:</strong> ${(depreciationRate * 100).toFixed(0)}%</div>
                    <div><strong>Mileage:</strong> ${mileage.toLocaleString()} km</div>
                </div>
                <div class="value-display">
                    <p class="value-label">Estimated Current Value</p>
                    <p class="value-amount">PKR ${currentValue.toLocaleString()}</p>
                    <p class="value-percent">${(currentValue/originalPrice*100).toFixed(0)}% of original</p>
                </div>
                <div class="ai-analysis">
                    <h4><i class="fas fa-robot"></i> AI Market Analysis</h4>
                    <p class="ai-recommendation">${aiAnalysis.recommendation}</p>
                    <ul class="ai-insights">
                        ${aiAnalysis.insights.map(i => `<li><i class="fas fa-check-circle"></i> ${i}</li>`).join('')}
                    </ul>
                    <p class="ai-trend">${aiAnalysis.marketTrend}</p>
                </div>
            </div>
        `;
        
        // Track usage
        await incrementUsage();
        showToast('Calculation completed with AI analysis!', 'success');
    } catch (error) {
        console.error('Calculation error:', error);
        showToast('Error calculating value. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// ============================================
// EMI CALCULATOR
// ============================================
function calculateEMI() {
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const rate = parseFloat(document.getElementById('interestRate').value);
    const tenure = parseInt(document.getElementById('tenure').value);
    
    if (!loanAmount || loanAmount <= 0) {
        showToast('Please enter loan amount', 'error');
        return;
    }
    
    const monthlyRate = rate / 100 / 12;
    const months = tenure * 12;
    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - loanAmount;
    
    const emiResult = document.getElementById('emiResult');
    emiResult.style.display = 'block';
    emiResult.innerHTML = `
        <p>Monthly Installment: <strong>PKR ${emi.toLocaleString(undefined, {maximumFractionDigits:0})}</strong></p>
        <p>Total Interest: PKR ${totalInterest.toLocaleString(undefined, {maximumFractionDigits:0})}</p>
        <p>Total Payment: PKR ${totalPayment.toLocaleString(undefined, {maximumFractionDigits:0})}</p>
    `;
}

// ============================================
// COMPARE CARS
// ============================================
function compareCars() {
    const make1 = document.getElementById('compareMake1').value;
    const model1 = document.getElementById('compareModel1').value;
    const year1 = parseInt(document.getElementById('compareYear1').value);
    const price1 = parseFloat(document.getElementById('comparePrice1').value);
    
    const make2 = document.getElementById('compareMake2').value;
    const model2 = document.getElementById('compareModel2').value;
    const year2 = parseInt(document.getElementById('compareYear2').value);
    const price2 = parseFloat(document.getElementById('comparePrice2').value);
    
    if (!make1 || !model1 || !year1 || !price1 || !make2 || !model2 || !year2 || !price2) {
        showToast('Please fill all comparison fields', 'error');
        return;
    }
    
    const currentYear = new Date().getFullYear();
    const age1 = currentYear - year1;
    const age2 = currentYear - year2;
    const value1 = price1 * (1 - Math.min(0.9, age1 * 0.08));
    const value2 = price2 * (1 - Math.min(0.9, age2 * 0.08));
    const better = value1 > value2 ? 'Car 1' : 'Car 2';
    
    const compareResult = document.getElementById('compareResult');
    compareResult.style.display = 'block';
    compareResult.innerHTML = `
        <h3>Comparison Result</h3>
        <div class="compare-result-grid">
            <div class="compare-result-item ${value1 > value2 ? 'winner' : ''}">
                <strong>${make1} ${model1}</strong><br>
                Age: ${age1} years<br>
                Value: PKR ${Math.round(value1).toLocaleString()}
                ${value1 > value2 ? '<span class="badge-winner">🏆 Winner</span>' : ''}
            </div>
            <div class="compare-result-item ${value2 > value1 ? 'winner' : ''}">
                <strong>${make2} ${model2}</strong><br>
                Age: ${age2} years<br>
                Value: PKR ${Math.round(value2).toLocaleString()}
                ${value2 > value1 ? '<span class="badge-winner">🏆 Winner</span>' : ''}
            </div>
        </div>
        <div class="compare-verdict">
            <strong>Verdict:</strong> ${better} has better resale value!
        </div>
    `;
}

// ============================================
// SHARE FUNCTIONS
// ============================================
function shareTool(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Car Age Calculator Pakistan - Get Your Car\'s Current Value');
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook': 
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; 
            break;
        case 'twitter': 
            shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`; 
            break;
        case 'linkedin': 
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?u=${url}`; 
            break;
        case 'whatsapp': 
            shareUrl = `https://wa.me/?text=${title}%20${url}`; 
            break;
        case 'email': 
            shareUrl = `mailto:?subject=${title}&body=Check this: ${url}`; 
            break;
        case 'copy':
            navigator.clipboard.writeText(window.location.href).then(() => {
                showToast('Link copied to clipboard!', 'success');
            }).catch(() => {
                showToast('Failed to copy link', 'error');
            });
            return;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        recordShare(platform);
    }
}

// ============================================
// TAB NAVIGATION
// ============================================
function showTab(event, tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

// ============================================
// TYPEWRITER ANIMATION
// ============================================
function initTypewriter() {
    const elements = document.querySelectorAll('.typewriter-text');
    elements.forEach(el => {
        const text = el.getAttribute('data-text') || el.textContent;
        el.textContent = '';
        let i = 0;
        const speed = parseInt(el.getAttribute('data-speed')) || 50;
        
        function type() {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    });
}

// ============================================
// SCROLL BUTTONS
// ============================================
function setupScrollButtons() {
    const scrollUp = document.getElementById('scrollUpBtn');
    const scrollDown = document.getElementById('scrollDownBtn');
    
    if (scrollUp) {
        scrollUp.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    if (scrollDown) {
        scrollDown.addEventListener('click', function() {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });
    }
    
    window.addEventListener('scroll', function() {
        if (scrollUp) {
            scrollUp.style.display = window.scrollY > 200 ? 'flex' : 'none';
        }
    });
}

// ============================================
// MILEAGE SLIDER
// ============================================
function setupMileageSlider() {
    const mileageSlider = document.getElementById('mileage');
    const mileageValue = document.getElementById('mileageValue');
    
    if (mileageSlider && mileageValue) {
        mileageSlider.addEventListener('input', function() {
            mileageValue.textContent = parseInt(this.value).toLocaleString() + ' km';
        });
    }
}

// ============================================
// COMPARE MODELS SETUP
// ============================================
function setupCompareModels() {
    const compareMake1 = document.getElementById('compareMake1');
    const compareMake2 = document.getElementById('compareMake2');
    const compareModel1 = document.getElementById('compareModel1');
    const compareModel2 = document.getElementById('compareModel2');
    
    if (compareMake1) {
        compareMake1.addEventListener('change', function() {
            compareModel1.innerHTML = '<option value="">Select Model</option>';
            if (compareMake1.value && carModels[compareMake1.value]) {
                carModels[compareMake1.value].forEach(function(model) {
                    const option = document.createElement('option');
                    option.value = model;
                    option.textContent = model;
                    compareModel1.appendChild(option);
                });
            }
        });
    }
    
    if (compareMake2) {
        compareMake2.addEventListener('change', function() {
            compareModel2.innerHTML = '<option value="">Select Model</option>';
            if (compareMake2.value && carModels[compareMake2.value]) {
                carModels[compareMake2.value].forEach(function(model) {
                    const option = document.createElement('option');
                    option.value = model;
                    option.textContent = model;
                    compareModel2.appendChild(option);
                });
            }
        });
    }
}

// ============================================
// EVENT LISTENERS SETUP
// ============================================
function setupEventListeners() {
    const pageShareBtn = document.getElementById('pageShareBtn');
    if (pageShareBtn) {
        pageShareBtn.addEventListener('click', () => shareTool('copy'));
    }
    
    const carMake = document.getElementById('carMake');
    if (carMake) {
        carMake.addEventListener('change', updateModels);
    }
    
    const reactionBtns = document.querySelectorAll('.reaction-btn');
    reactionBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            addReaction(btn.getAttribute('data-emoji'));
        });
    });
    
    const socialBtns = document.querySelectorAll('.social-btn');
    socialBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            shareTool(btn.getAttribute('data-platform'));
        });
    });
}

// ============================================
// LOAD REACTION COUNTS
// ============================================
function loadReactionCounts() {
    const emojis = ['👍', '❤️', '😮', '😢', '😂', '🎉'];
    emojis.forEach(function(emoji) {
        const count = localStorage.getItem(`${TOOL_ID}_reaction_${emoji}`) || 0;
        const countSpan = document.getElementById(`count-${emoji}`);
        if (countSpan) countSpan.textContent = count;
    });
}

// ============================================
// INITIALIZATION
// ============================================
async function init() {
    populateYears();
    setupScrollButtons();
    setupMileageSlider();
    setupCompareModels();
    setupEventListeners();
    loadReactionCounts();
    initTypewriter();
    
    // Load stats from API or localStorage
    await loadStats();
    
    // Track view
    let views = parseInt(localStorage.getItem(`${TOOL_ID}_views`) || '0');
    views++;
    localStorage.setItem(`${TOOL_ID}_views`, views);
    
    showToast('Welcome to Car Age Calculator Pakistan! 🚗', 'info');
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', init);
