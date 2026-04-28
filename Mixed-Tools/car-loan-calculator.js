// ============================================
// CAR LOAN CALCULATOR - TIDB INTEGRATED VERSION
// ============================================

// Tool Configuration
const TOOL_SLUG = 'car-loan-calculator';
const API_BASE_URL = window.location.origin; // Vercel deployment URL

// Car Models Database
const carModels = {
    toyota: ['Corolla 1.6', 'Corolla 1.8', 'Yaris 1.3', 'Yaris 1.5', 'Fortuner 2.7', 'Fortuner 2.8', 'Hilux Revo', 'Camry', 'Prius', 'Land Cruiser 300'],
    honda: ['Civic 1.5 Turbo', 'Civic RS', 'City 1.2', 'City 1.5', 'BR-V', 'Accord', 'Vezel'],
    suzuki: ['Mehran', 'Cultus', 'Wagon R', 'Alto', 'Swift', 'Jimny', 'Every'],
    hyundai: ['Tucson 2.0', 'Santa Fe', 'Elantra', 'Sonata', 'Accent'],
    kia: ['Sportage FWD', 'Sportage AWD', 'Picanto', 'Sorento', 'Stonic', 'Carnival'],
    mg: ['HS 1.5T', 'HS PHEV', 'ZS', 'MG 5', 'MG 4'],
    audi: ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7', 'e-tron'],
    bmw: ['3 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'i4'],
    mercedes: ['A-Class', 'C-Class', 'E-Class', 'GLA', 'GLC', 'GLE', 'EQS']
};

// Bank Rates Database
const bankRates = {
    hbl: { rate: 13.5, minDown: 20, name: 'HBL', processingFee: 1.0 },
    ubl: { rate: 14.0, minDown: 25, name: 'UBL', processingFee: 1.2 },
    mcb: { rate: 13.0, minDown: 20, name: 'MCB', processingFee: 0.8 },
    alfalah: { rate: 12.5, minDown: 15, name: 'Alfalah', processingFee: 1.0 },
    meezan: { rate: 15.0, minDown: 30, name: 'Meezan', processingFee: 1.5 },
    askari: { rate: 14.5, minDown: 25, name: 'Askari', processingFee: 1.0 },
    soneri: { rate: 13.75, minDown: 20, name: 'Soneri', processingFee: 0.9 },
    standard: { rate: 12.0, minDown: 30, name: 'Standard Chartered', processingFee: 1.2 },
    faysal: { rate: 14.25, minDown: 20, name: 'Faysal', processingFee: 1.0 },
    bankislami: { rate: 15.5, minDown: 25, name: 'BankIslami', processingFee: 1.3 }
};

// City Tax Rates
const regTaxRates = {
    lahore: 8,
    karachi: 7,
    islamabad: 6,
    rawalpindi: 6.5,
    other: 5
};

// Global Variables
let currentChart = null;
let currentBarChart = null;
let monthlyData = [];
let userReactions = {};

// ============================================
// TIDB API FUNCTIONS
// ============================================

// Track tool usage (called when user clicks Calculate)
async function trackToolUsage() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/tool/usage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toolSlug: TOOL_SLUG })
        });
        
        if (response.ok) {
            const data = await response.json();
            document.getElementById('usedCount').innerText = data.totalCount || 0;
            showToast('Tool usage recorded!', 'success');
        }
    } catch (error) {
        console.error('Error tracking usage:', error);
        // Fallback: increment locally
        incrementLocalUsage();
    }
}

// Get tool stats (usage count + reactions + shares)
async function getToolStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/tool/stats?slug=${TOOL_SLUG}`);
        if (response.ok) {
            const data = await response.json();
            document.getElementById('usedCount').innerText = data.usageCount || 0;
            document.getElementById('shareCount').innerText = data.shareCount || 0;
            
            // Update reaction counts
            if (data.reactions) {
                updateReactionCounts(data.reactions);
            }
        }
    } catch (error) {
        console.error('Error fetching stats:', error);
        loadLocalStats();
    }
}

// Add reaction to tool
async function addReaction(emojiType) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/tool/reaction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                toolSlug: TOOL_SLUG, 
                emojiType: emojiType 
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            updateReactionCounts(data.reactions);
            showToast(`You reacted with ${getEmojiName(emojiType)}!`, 'success');
            
            // Highlight the clicked button
            highlightReactionButton(emojiType);
        } else if (response.status === 409) {
            showToast('You already reacted with this emoji!', 'info');
        }
    } catch (error) {
        console.error('Error adding reaction:', error);
        // Local fallback
        incrementLocalReaction(emojiType);
    }
}

// Track share
async function trackShare(platform) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/tool/share`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                toolSlug: TOOL_SLUG, 
                shareType: platform 
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            document.getElementById('shareCount').innerText = data.totalCount || 0;
        }
    } catch (error) {
        console.error('Error tracking share:', error);
    }
}

// ============================================
// UI UPDATE FUNCTIONS
// ============================================

function updateReactionCounts(reactions) {
    if (reactions.like) document.getElementById('likeCount').innerText = reactions.like;
    if (reactions.love) document.getElementById('loveCount').innerText = reactions.love;
    if (reactions.wow) document.getElementById('wowCount').innerText = reactions.wow;
    if (reactions.sad) document.getElementById('sadCount').innerText = reactions.sad;
    if (reactions.angry) document.getElementById('angryCount').innerText = reactions.angry;
    if (reactions.laugh) document.getElementById('laughCount').innerText = reactions.laugh;
    if (reactions.celebrate) document.getElementById('celebrateCount').innerText = reactions.celebrate;
}

function highlightReactionButton(emojiType) {
    const buttons = document.querySelectorAll('.reaction-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.emoji === emojiType) {
            btn.classList.add('active');
            setTimeout(() => btn.classList.remove('active'), 1000);
        }
    });
}

function getEmojiName(emojiType) {
    const names = {
        like: '👍 Like',
        love: '❤️ Love',
        wow: '😮 Wow',
        sad: '😢 Sad',
        angry: '😠 Angry',
        laugh: '😂 Laugh',
        celebrate: '🎉 Celebrate'
    };
    return names[emojiType] || emojiType;
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
    toast.innerHTML = `<span>${icon}</span> ${message}`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Local fallback functions
function incrementLocalUsage() {
    let localCount = localStorage.getItem(`${TOOL_SLUG}_usage`) || 0;
    localCount = parseInt(localCount) + 1;
    localStorage.setItem(`${TOOL_SLUG}_usage`, localCount);
    document.getElementById('usedCount').innerText = localCount;
}

function incrementLocalReaction(emojiType) {
    let reactions = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_reactions`) || '{}');
    reactions[emojiType] = (reactions[emojiType] || 0) + 1;
    localStorage.setItem(`${TOOL_SLUG}_reactions`, JSON.stringify(reactions));
    updateReactionCounts(reactions);
}

function loadLocalStats() {
    const usage = localStorage.getItem(`${TOOL_SLUG}_usage`) || 0;
    const reactions = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_reactions`) || '{}');
    const shares = localStorage.getItem(`${TOOL_SLUG}_shares`) || 0;
    
    document.getElementById('usedCount').innerText = usage;
    document.getElementById('shareCount').innerText = shares;
    updateReactionCounts(reactions);
}

// ============================================
// SHARE FUNCTIONS
// ============================================

function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
    trackShare('facebook');
    showToast('Shared on Facebook!', 'success');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out this Car Loan Calculator!');
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400');
    trackShare('twitter');
    showToast('Shared on Twitter!', 'success');
}

function shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=400');
    trackShare('linkedin');
    showToast('Shared on LinkedIn!', 'success');
}

function shareOnWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://wa.me/?text=${url}`, '_blank');
    trackShare('whatsapp');
    showToast('Shared on WhatsApp!', 'success');
}

function shareByEmail() {
    const subject = encodeURIComponent('Car Loan Calculator Tool');
    const body = encodeURIComponent(`Check out this useful tool: ${window.location.href}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    trackShare('email');
    showToast('Email client opened!', 'info');
}

async function copyPageLink() {
    try {
        await navigator.clipboard.writeText(window.location.href);
        trackShare('copy');
        showToast('Link copied to clipboard!', 'success');
    } catch (err) {
        showToast('Failed to copy link', 'error');
    }
}

// ============================================
// SCROLL BUTTON FUNCTIONS
// ============================================

function setupScrollButtons() {
    const scrollUpBtn = document.getElementById('scrollUpBtn');
    const scrollDownBtn = document.getElementById('scrollDownBtn');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            scrollUpBtn.style.display = 'flex';
        } else {
            scrollUpBtn.style.display = 'none';
        }
    });
    
    scrollUpBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    scrollDownBtn.addEventListener('click', () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
}

// ============================================
// CALCULATION FUNCTIONS
// ============================================

function updateCarModels() {
    const brand = document.getElementById('carBrand').value;
    const modelSelect = document.getElementById('carModel');
    modelSelect.innerHTML = '<option value="">Select Model</option>';
    if (brand && carModels[brand]) {
        carModels[brand].forEach(model => {
            const option = document.createElement('option');
            option.value = model.toLowerCase().replace(/\s+/g, '-');
            option.textContent = model;
            modelSelect.appendChild(option);
        });
    }
}

function syncPriceInput() {
    const slider = document.getElementById('carPriceSlider');
    const input = document.getElementById('carPrice');
    input.value = slider.value;
    calculateLoan();
}

function syncPriceSlider() {
    const slider = document.getElementById('carPriceSlider');
    const input = document.getElementById('carPrice');
    slider.value = input.value;
    calculateLoan();
}

function updateDownPaymentUI() {
    const type = document.getElementById('downPaymentType').value;
    const label = document.getElementById('downPaymentLabel');
    const slider = document.getElementById('downPaymentSlider');
    const input = document.getElementById('downPaymentValue');
    
    if (type === 'percentage') {
        label.innerHTML = '<i class="fas fa-percent"></i> Down Payment (%)';
        slider.min = 0;
        slider.max = 50;
        slider.step = 1;
        if (!input.value || input.value > 50) input.value = 20;
        slider.value = input.value;
    } else {
        label.innerHTML = '<i class="fas fa-rupee-sign"></i> Down Payment (PKR)';
        slider.min = 0;
        slider.max = 5000000;
        slider.step = 10000;
        if (!input.value || input.value > 5000000) input.value = 500000;
        slider.value = input.value;
    }
    calculateLoan();
}

function syncDownPaymentInput() {
    const slider = document.getElementById('downPaymentSlider');
    const input = document.getElementById('downPaymentValue');
    input.value = slider.value;
    calculateLoan();
}

function syncDownPaymentSlider() {
    const slider = document.getElementById('downPaymentSlider');
    const input = document.getElementById('downPaymentValue');
    slider.value = input.value;
    calculateLoan();
}

function updateBankRate() {
    const bank = document.getElementById('bank').value;
    const rateInput = document.getElementById('interestRate');
    const downInput = document.getElementById('downPaymentValue');
    
    if (bank && bankRates[bank]) {
        rateInput.value = bankRates[bank].rate;
        if (bankRates[bank].minDown && document.getElementById('downPaymentType').value === 'percentage') {
            downInput.value = bankRates[bank].minDown;
            updateDownPaymentUI();
        }
    }
    calculateLoan();
}

function updateLoanTermOptions() {
    const carType = document.getElementById('carType').value;
    const loanTerm = document.getElementById('loanTerm');
    loanTerm.innerHTML = '';
    
    const maxYears = carType === 'used' ? 5 : 7;
    for (let i = 1; i <= maxYears; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i + ' Year' + (i > 1 ? 's' : '');
        if (i === 5) option.selected = true;
        loanTerm.appendChild(option);
    }
    calculateLoan();
}

function calculateLoan() {
    const carPrice = parseFloat(document.getElementById('carPrice').value);
    if (isNaN(carPrice) || carPrice <= 0) return;
    
    let downPayment;
    const downPaymentType = document.getElementById('downPaymentType').value;
    const downPaymentValue = parseFloat(document.getElementById('downPaymentValue').value);
    
    if (downPaymentType === 'percentage') {
        downPayment = carPrice * (downPaymentValue / 100);
    } else {
        downPayment = downPaymentValue;
    }
    if (isNaN(downPayment)) downPayment = 0;
    if (downPayment > carPrice) downPayment = carPrice;
    
    const processingFee = carPrice * 0.01;
    const insurance = carPrice * 0.02;
    const regCity = document.getElementById('regCity').value;
    const regTax = carPrice * (regTaxRates[regCity] / 100);
    
    const loanAmount = carPrice - downPayment;
    const termYears = parseInt(document.getElementById('loanTerm').value);
    const annualRate = parseFloat(document.getElementById('interestRate').value) / 100;
    
    const monthlyRate = annualRate / 12;
    const termMonths = termYears * 12;
    
    let monthlyPayment;
    if (monthlyRate === 0) {
        monthlyPayment = loanAmount / termMonths;
    } else {
        monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
    }
    
    const totalPayment = monthlyPayment * termMonths;
    const totalInterest = totalPayment - loanAmount;
    
    calculateAmortization(loanAmount, annualRate, termYears, monthlyPayment);
    
    document.getElementById('resultCarPrice').innerHTML = `PKR ${formatNumber(carPrice)}`;
    document.getElementById('resultDownPayment').innerHTML = `PKR ${formatNumber(downPayment)}`;
    document.getElementById('resultProcessingFee').innerHTML = `PKR ${formatNumber(processingFee)}`;
    document.getElementById('resultInsurance').innerHTML = `PKR ${formatNumber(insurance)}`;
    document.getElementById('resultTotalInterest').innerHTML = `PKR ${formatNumber(totalInterest)}`;
    document.getElementById('resultTotalPayment').innerHTML = `PKR ${formatNumber(totalPayment + processingFee + insurance + regTax)}`;
    document.getElementById('resultMonthlyPayment').innerHTML = `PKR ${formatNumber(monthlyPayment)}`;
    
    updateCharts(loanAmount, totalInterest);
}

function calculateAmortization(loanAmount, annualRate, termYears, monthlyPayment) {
    const monthlyRate = annualRate / 12;
    const termMonths = termYears * 12;
    let balance = loanAmount;
    let amortization = [];
    let yearlyPrincipal = 0;
    let yearlyInterest = 0;
    monthlyData = [];
    
    for (let month = 1; month <= termMonths; month++) {
        const interest = balance * monthlyRate;
        let principal = monthlyPayment - interest;
        if (principal > balance) principal = balance;
        balance -= principal;
        
        yearlyPrincipal += principal;
        yearlyInterest += interest;
        monthlyData.push({ month, principal, interest, balance: Math.max(0, balance) });
        
        if (month % 12 === 0 || month === termMonths) {
            const year = Math.ceil(month / 12);
            amortization.push({
                year,
                principal: yearlyPrincipal,
                interest: yearlyInterest,
                balance: Math.max(0, balance)
            });
            yearlyPrincipal = 0;
            yearlyInterest = 0;
        }
        
        if (balance <= 0) break;
    }
    
    displayAmortization(amortization);
}

function displayAmortization(amortization) {
    const tbody = document.getElementById('paymentTableBody');
    tbody.innerHTML = '';
    
    amortization.forEach(item => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = `Year ${item.year}`;
        row.insertCell(1).textContent = `PKR ${formatNumber(item.principal)}`;
        row.insertCell(2).textContent = `PKR ${formatNumber(item.interest)}`;
        row.insertCell(3).textContent = `PKR ${formatNumber(item.balance)}`;
    });
}

function updateCharts(principal, interest) {
    const ctx1 = document.getElementById('pieChart').getContext('2d');
    if (currentChart) currentChart.destroy();
    currentChart = new Chart(ctx1, {
        type: 'pie',
        data: {
            labels: ['Principal Amount', 'Total Interest'],
            datasets: [{
                data: [principal, interest],
                backgroundColor: ['#10b981', '#ef4444'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'bottom' } }
        }
    });
    
    const ctx2 = document.getElementById('barChart').getContext('2d');
    if (currentBarChart) currentBarChart.destroy();
    currentBarChart = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
            datasets: [
                { label: 'Principal Paid', data: [principal * 0.15, principal * 0.17, principal * 0.19, principal * 0.22, principal * 0.27], backgroundColor: '#10b981' },
                { label: 'Interest Paid', data: [interest * 0.3, interest * 0.25, interest * 0.2, interest * 0.15, interest * 0.1], backgroundColor: '#ef4444' }
            ]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'bottom' } },
            scales: { y: { beginAtZero: true, ticks: { callback: v => 'PKR ' + (v / 1000) + 'k' } } }
        }
    });
}

function formatNumber(num) {
    if (isNaN(num)) return '0';
    return Math.round(num).toLocaleString('en-PK');
}

// ============================================
// EVENT LISTENERS & INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Load tool stats from TiDB
    getToolStats();
    
    // Setup event listeners
    document.getElementById('carBrand').addEventListener('change', updateCarModels);
    document.getElementById('carPriceSlider').addEventListener('input', syncPriceInput);
    document.getElementById('carPrice').addEventListener('input', syncPriceSlider);
    document.getElementById('downPaymentType').addEventListener('change', updateDownPaymentUI);
    document.getElementById('downPaymentSlider').addEventListener('input', syncDownPaymentInput);
    document.getElementById('downPaymentValue').addEventListener('input', syncDownPaymentSlider);
    document.getElementById('bank').addEventListener('change', updateBankRate);
    document.getElementById('carType').addEventListener('change', updateLoanTermOptions);
    document.getElementById('calculateBtn').addEventListener('click', calculateLoan);
    
    // Reaction buttons
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', () => addReaction(btn.dataset.emoji));
    });
    
    // Share buttons
    document.querySelector('.share-btn.facebook').addEventListener('click', shareOnFacebook);
    document.querySelector('.share-btn.twitter').addEventListener('click', shareOnTwitter);
    document.querySelector('.share-btn.linkedin').addEventListener('click', shareOnLinkedIn);
    document.querySelector('.share-btn.whatsapp').addEventListener('click', shareOnWhatsApp);
    document.querySelector('.share-btn.email').addEventListener('click', shareByEmail);
    document.querySelector('.share-btn.copy-link').addEventListener('click', copyPageLink);
    
    // Scroll buttons
    setupScrollButtons();
    
    // Initial calculation
    calculateLoan();
    
    showToast('Welcome! Calculate your car loan easily.', 'info');
});
