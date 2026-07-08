// ============================================
// INCOME TAX CALCULATOR - COMPLETE VERSION
// WITH CLOUDFLARE WORKERS API INTEGRATION
// UPDATED FOR FY 2026-27
// ============================================

// ============================================
// CONFIGURATION
// ============================================
const TOOL_SLUG = 'income-tax-calculator';
const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';
const API_KEY = 'magicrills-grok-api.uzairhameed01.workers.dev';

// ============================================
// TAX SLABS DATABASE (2022-2027)
// ============================================
const taxSlabsHistory = {
    // FY 2026-27 - NEW SLABS (Current)
    2027: [
        { min: 0, max: 600000, rate: 0, fixed: 0 },
        { min: 600001, max: 1200000, rate: 0.01, fixed: 0 },
        { min: 1200001, max: 2200000, rate: 0.11, fixed: 6000 },
        { min: 2200001, max: 3200000, rate: 0.20, fixed: 116000 },
        { min: 3200001, max: 4100000, rate: 0.25, fixed: 316000 },
        { min: 4100001, max: 5600000, rate: 0.29, fixed: 541000 },
        { min: 5600001, max: 7000000, rate: 0.32, fixed: 976000 },
        { min: 7000001, max: Infinity, rate: 0.35, fixed: 1424000 }
    ],
    // FY 2025-26 (Previous)
    2026: [
        { min: 0, max: 600000, rate: 0, fixed: 0 },
        { min: 600001, max: 1200000, rate: 0.01, fixed: 0 },
        { min: 1200001, max: 2200000, rate: 0.11, fixed: 6000 },
        { min: 2200001, max: 3200000, rate: 0.23, fixed: 116000 },
        { min: 3200001, max: 4100000, rate: 0.30, fixed: 346000 },
        { min: 4100001, max: Infinity, rate: 0.35, fixed: 616000 }
    ],
    // FY 2024-25
    2025: [
        { min: 0, max: 600000, rate: 0, fixed: 0 },
        { min: 600001, max: 1200000, rate: 0.02, fixed: 0 },
        { min: 1200001, max: 2400000, rate: 0.12, fixed: 12000 },
        { min: 2400001, max: 3600000, rate: 0.22, fixed: 156000 },
        { min: 3600001, max: 4800000, rate: 0.27, fixed: 420000 },
        { min: 4800001, max: Infinity, rate: 0.30, fixed: 744000 }
    ],
    // FY 2023-24
    2024: [
        { min: 0, max: 500000, rate: 0, fixed: 0 },
        { min: 500001, max: 1000000, rate: 0.02, fixed: 0 },
        { min: 1000001, max: 2000000, rate: 0.10, fixed: 10000 },
        { min: 2000001, max: 3000000, rate: 0.18, fixed: 110000 },
        { min: 3000001, max: 4000000, rate: 0.22, fixed: 290000 },
        { min: 4000001, max: Infinity, rate: 0.25, fixed: 510000 }
    ],
    // FY 2022-23
    2023: [
        { min: 0, max: 400000, rate: 0, fixed: 0 },
        { min: 400001, max: 800000, rate: 0.02, fixed: 0 },
        { min: 800001, max: 1800000, rate: 0.08, fixed: 8000 },
        { min: 1800001, max: 2800000, rate: 0.15, fixed: 88000 },
        { min: 2800001, max: 3800000, rate: 0.20, fixed: 238000 },
        { min: 3800001, max: Infinity, rate: 0.23, fixed: 438000 }
    ]
};

// ============================================
// PROVINCIAL TAX RATES
// ============================================
const provincialTax = {
    punjab: { rate: 0, name: 'Punjab' },
    sindh: { rate: 0.01, name: 'Sindh' },
    kpk: { rate: 0.005, name: 'Khyber Pakhtunkhwa' },
    balochistan: { rate: 0, name: 'Balochistan' }
};

// ============================================
// WITHHOLDING TAX RATES
// ============================================
const withholdingRates = {
    mobile: 0.15,
    bankProfit: 0.10,
    property: 0.02
};

// ============================================
// GLOBAL VARIABLES
// ============================================
let taxChart = null;
let currentYear = 2027; // Default to 2026-27
let userReactions = {};
let isChatOpen = false;
let toolStats = { usageCount: 0, shareCount: 0, reactions: {} };

// ============================================
// TYPEWRITER ANIMATION
// ============================================
function initTypewriter() {
    const words = ['Accurate', 'Fast', 'Smart', 'Reliable', '2026-27'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const element = document.getElementById('typewriterText');
    if (!element) return;
    
    function type() {
        const currentWord = words[wordIndex];
        if (isDeleting) {
            element.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            setTimeout(type, 2000);
            return;
        }
        
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, 500);
            return;
        }
        
        setTimeout(type, isDeleting ? 50 : 100);
    }
    
    type();
}

// ============================================
// CLOUDFLARE API FUNCTIONS
// ============================================

async function callAPI(endpoint, method = 'POST', body = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            }
        };
        if (body) options.body = JSON.stringify(body);
        
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.warn('API call failed:', error);
        return null;
    }
}

async function trackToolUsage() {
    try {
        const data = await callAPI('/api/usage', 'POST', { tool_slug: TOOL_SLUG });
        if (data && data.success) {
            const countEl = document.getElementById('usedCount');
            if (countEl) countEl.innerText = data.usage_count || 0;
            
            const heroUsageEl = document.querySelector('.hero-stat .stat-value');
            if (heroUsageEl) heroUsageEl.innerText = data.usage_count || 0;
            
            localStorage.setItem(`${TOOL_SLUG}_usage`, data.usage_count || 0);
        } else {
            fallbackUsage();
        }
    } catch (error) {
        fallbackUsage();
    }
}

function fallbackUsage() {
    let count = parseInt(localStorage.getItem(`${TOOL_SLUG}_usage`)) || 0;
    count++;
    localStorage.setItem(`${TOOL_SLUG}_usage`, count);
    const countEl = document.getElementById('usedCount');
    if (countEl) countEl.innerText = count;
    const heroUsageEl = document.querySelector('.hero-stat .stat-value');
    if (heroUsageEl) heroUsageEl.innerText = count;
}

async function getToolStats() {
    try {
        const data = await callAPI(`/api/stats?tool_slug=${TOOL_SLUG}`, 'GET');
        if (data && data.success) {
            toolStats = data.stats || {};
            
            const stats = data.stats || {};
            document.querySelectorAll('.hero-stat').forEach((el, index) => {
                const valueEl = el.querySelector('.stat-value');
                if (!valueEl) return;
                if (index === 0) valueEl.innerText = stats.usage_count || 0;
                else if (index === 1) valueEl.innerText = stats.views || 0;
                else if (index === 2) valueEl.innerText = stats.shares || 0;
                else if (index === 3) valueEl.innerText = stats.followers || 0;
            });
            
            if (stats.reactions) updateReactionCounts(stats.reactions);
            if (stats.shares) document.getElementById('shareCount').innerText = stats.shares;
            
            localStorage.setItem(`${TOOL_SLUG}_stats`, JSON.stringify(stats));
        } else {
            loadLocalStats();
        }
    } catch (error) {
        loadLocalStats();
    }
}

function loadLocalStats() {
    const saved = localStorage.getItem(`${TOOL_SLUG}_stats`);
    if (saved) {
        try {
            const stats = JSON.parse(saved);
            document.querySelectorAll('.hero-stat').forEach((el, index) => {
                const valueEl = el.querySelector('.stat-value');
                if (!valueEl) return;
                if (index === 0) valueEl.innerText = stats.usage_count || 0;
                else if (index === 1) valueEl.innerText = stats.views || 0;
                else if (index === 2) valueEl.innerText = stats.shares || 0;
                else if (index === 3) valueEl.innerText = stats.followers || 0;
            });
            if (stats.reactions) updateReactionCounts(stats.reactions);
            if (stats.shares) document.getElementById('shareCount').innerText = stats.shares;
        } catch (e) {}
    }
}

async function addReaction(emojiType) {
    try {
        const data = await callAPI('/api/reactions', 'POST', { 
            tool_slug: TOOL_SLUG, 
            emoji_type: emojiType 
        });
        if (data && data.success) {
            if (data.reactions) updateReactionCounts(data.reactions);
            showToast(`You reacted with ${getEmojiIcon(emojiType)}!`, 'success');
            return;
        }
        if (data && data.message) {
            showToast(data.message, 'info');
            return;
        }
        fallbackReaction(emojiType);
    } catch (error) {
        fallbackReaction(emojiType);
    }
}

function fallbackReaction(emojiType) {
    let reactions = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_reactions`) || '{}');
    reactions[emojiType] = (reactions[emojiType] || 0) + 1;
    localStorage.setItem(`${TOOL_SLUG}_reactions`, JSON.stringify(reactions));
    updateReactionCounts(reactions);
    showToast(`You reacted with ${getEmojiIcon(emojiType)}!`, 'success');
}

function getEmojiIcon(type) {
    const map = {
        like: '👍', love: '❤️', wow: '😮', 
        sad: '😢', angry: '😡', laugh: '😂', celebrate: '🎉'
    };
    return map[type] || '👍';
}

async function trackShare(platform) {
    try {
        const data = await callAPI('/api/shares', 'POST', {
            tool_slug: TOOL_SLUG,
            share_type: platform
        });
        if (data && data.success) {
            const shareCount = document.getElementById('shareCount');
            if (shareCount) shareCount.innerText = data.total_shares || 0;
            const heroShareEl = document.querySelectorAll('.hero-stat')[2]?.querySelector('.stat-value');
            if (heroShareEl) heroShareEl.innerText = data.total_shares || 0;
        }
    } catch (error) {
        let shares = parseInt(localStorage.getItem(`${TOOL_SLUG}_shares`)) || 0;
        shares++;
        localStorage.setItem(`${TOOL_SLUG}_shares`, shares);
        const shareCount = document.getElementById('shareCount');
        if (shareCount) shareCount.innerText = shares;
    }
}

function updateReactionCounts(reactions) {
    const emojis = ['like', 'love', 'wow', 'sad', 'angry', 'laugh', 'celebrate'];
    emojis.forEach(emoji => {
        const el = document.getElementById(`${emoji}Count`);
        if (el && reactions[emoji] !== undefined) {
            el.innerText = reactions[emoji];
        }
    });
}

// ============================================
// TAX CALCULATION FUNCTIONS
// ============================================

function calculateIncomeTax(income, year = 2027) {
    const slabs = taxSlabsHistory[year] || taxSlabsHistory[2027];
    for (const slab of slabs) {
        if (income <= slab.max) {
            if (income <= slab.min) return 0;
            const taxable = income - slab.min;
            return slab.fixed + (taxable * slab.rate);
        }
    }
    return 0;
}

function calculateTotalTax() {
    const type = document.getElementById('incomeType').value;
    let amount = parseFloat(document.getElementById('incomeAmount').value) || 0;
    let annualIncome = type === 'monthly' ? amount * 12 : amount;
    
    const businessIncome = parseFloat(document.getElementById('businessIncome').value) || 0;
    const rentalIncome = parseFloat(document.getElementById('rentalIncome').value) || 0;
    const capitalGains = parseFloat(document.getElementById('capitalGains').value) || 0;
    const freelanceIncome = parseFloat(document.getElementById('freelanceIncome').value) || 0;
    
    annualIncome += businessIncome + rentalIncome + capitalGains + freelanceIncome;
    
    const zakat = parseFloat(document.getElementById('zakatDeduction').value) || 0;
    const insurance = parseFloat(document.getElementById('insuranceDeduction').value) || 0;
    const pf = parseFloat(document.getElementById('pfDeduction').value) || 0;
    const donations = parseFloat(document.getElementById('donationDeduction').value) || 0;
    const health = parseFloat(document.getElementById('healthDeduction').value) || 0;
    const education = parseFloat(document.getElementById('educationDeduction').value) || 0;
    
    const totalDeductions = zakat + insurance + pf + donations + health + education;
    const taxableIncome = Math.max(0, annualIncome - totalDeductions);
    
    const federalTax = calculateIncomeTax(taxableIncome, currentYear);
    
    const province = document.getElementById('province').value;
    const provincialTaxRate = provincialTax[province]?.rate || 0;
    const provincialTaxAmount = federalTax * provincialTaxRate;
    
    const totalTax = federalTax + provincialTaxAmount;
    
    return {
        annualIncome,
        taxableIncome,
        totalDeductions,
        federalTax,
        provincialTax: provincialTaxAmount,
        totalTax,
        effectiveRate: (totalTax / annualIncome) * 100,
        monthlyTax: (totalTax / 12)
    };
}

function calculateWithIncrement() {
    const raisePercent = parseFloat(document.getElementById('raisePercent').value) || 0;
    const raiseYears = parseFloat(document.getElementById('raiseYears').value) || 1;
    const currentIncome = parseFloat(document.getElementById('incomeAmount').value) || 0;
    const type = document.getElementById('incomeType').value;
    let annualIncome = type === 'monthly' ? currentIncome * 12 : currentIncome;
    
    const newIncome = annualIncome * Math.pow(1 + (raisePercent / 100), raiseYears);
    const newTax = calculateIncomeTax(newIncome, currentYear);
    
    return { newIncome, newTax, currentTax: calculateIncomeTax(annualIncome, currentYear) };
}

// ============================================
// UI UPDATE FUNCTIONS
// ============================================

function updateTaxSlabsTable() {
    const slabs = taxSlabsHistory[currentYear];
    const tbody = document.getElementById('taxSlabsTable');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    slabs.forEach(slab => {
        const row = tbody.insertRow();
        const range = slab.max === Infinity ? `Above ${formatNumber(slab.min)}` : `${formatNumber(slab.min)} - ${formatNumber(slab.max)}`;
        row.insertCell(0).textContent = range;
        row.insertCell(1).textContent = slab.rate === 0 ? '0%' : `${slab.rate * 100}%`;
    });
}

function displayResults() {
    const tax = calculateTotalTax();
    const monthlyIncome = tax.annualIncome / 12;
    const monthlyTax = tax.totalTax / 12;
    const netMonthly = monthlyIncome - monthlyTax;
    const netAnnual = tax.annualIncome - tax.totalTax;
    
    // Tax Savings Message
    const alertEl = document.getElementById('summaryAlert');
    if (alertEl) {
        const savings = tax.annualIncome - netAnnual;
        alertEl.innerHTML = `
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
                <span><strong>Annual Income:</strong> PKR ${formatNumber(tax.annualIncome)}</span>
                <span><strong>Taxable Income:</strong> PKR ${formatNumber(tax.taxableIncome)}</span>
                <span><strong>Total Tax:</strong> PKR ${formatNumber(tax.totalTax)}</span>
                <span><strong>Net Annual:</strong> PKR ${formatNumber(netAnnual)}</span>
                <span><strong>Monthly Tax:</strong> PKR ${formatNumber(monthlyTax)}</span>
                <span><strong>Net Monthly:</strong> PKR ${formatNumber(netMonthly)}</span>
            </div>
            <div class="mt-2" style="display: flex; gap: 20px; flex-wrap: wrap;">
                <span><strong>Effective Tax Rate:</strong> ${tax.effectiveRate.toFixed(2)}%</span>
                <span style="color: var(--success);"><strong>💰 Tax Savings:</strong> PKR ${formatNumber(savings)}</span>
            </div>
            <div style="margin-top: 8px; font-size: 13px; color: var(--text-muted);">
                <i class="fas fa-info-circle"></i> Based on FY 2026-27 tax slabs. Maximum rate 35% applies above PKR 7,000,000.
            </div>
        `;
    }
    
    const breakdown = [
        { desc: 'Gross Annual Income', amount: tax.annualIncome },
        { desc: 'Total Deductions (Zakat, PF, Insurance, etc.)', amount: tax.totalDeductions },
        { desc: 'Taxable Income', amount: tax.taxableIncome },
        { desc: 'Federal Income Tax', amount: tax.federalTax },
        { desc: `Provincial Tax (${provincialTax[document.getElementById('province').value]?.name || 'None'})`, amount: tax.provincialTax },
        { desc: 'Total Annual Tax', amount: tax.totalTax },
        { desc: 'Net Annual Income After Tax', amount: netAnnual },
        { desc: 'Gross Monthly Income', amount: monthlyIncome },
        { desc: 'Monthly Tax Deduction', amount: monthlyTax },
        { desc: 'Net Monthly Income After Tax', amount: netMonthly }
    ];
    
    const breakEl = document.getElementById('breakdownTable');
    if (breakEl) {
        breakEl.innerHTML = breakdown.map(item => 
            `<tr><td>${item.desc}</td><td>PKR ${formatNumber(item.amount)}</td></tr>`
        ).join('');
    }
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthEl = document.getElementById('monthlyBreakdown');
    if (monthEl) {
        monthEl.innerHTML = months.map(month => `
            <tr><td>${month}</td><td>PKR ${formatNumber(monthlyIncome)}</td><td>PKR ${formatNumber(monthlyTax)}</td><td>PKR ${formatNumber(netMonthly)}</td></tr>
        `).join('');
    }
    
    updateChart(tax.totalTax, netAnnual);
    updateRecommendations(tax);
    updateYearComparison();
    updateRefundEstimator(tax.totalTax);
    
    const resultsEl = document.getElementById('results');
    if (resultsEl) resultsEl.classList.remove('hidden');
}

function updateChart(tax, netIncome) {
    const ctx = document.getElementById('taxChart');
    if (!ctx) return;
    const context = ctx.getContext('2d');
    if (taxChart) taxChart.destroy();
    
    taxChart = new Chart(context, {
        type: 'doughnut',
        data: {
            labels: ['Tax Paid', 'Net Income'],
            datasets: [{
                data: [tax, netIncome],
                backgroundColor: ['#FF6B6B', '#00D2FF'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    position: 'bottom',
                    labels: { color: '#ffffff' }
                },
                tooltip: { 
                    callbacks: { 
                        label: (ctx) => `${ctx.label}: PKR ${formatNumber(ctx.raw)} (${((ctx.raw / (tax + netIncome)) * 100).toFixed(1)}%)` 
                    }
                }
            }
        }
    });
}

function updateRecommendations(tax) {
    const recDiv = document.getElementById('recommendations');
    if (!recDiv) return;
    let recommendations = [];
    
    // Tax saving recommendations based on 2026-27
    if (tax.effectiveRate > 20) {
        recommendations.push('<i class="fas fa-piggy-bank"></i> Consider increasing your PF contribution to reduce taxable income');
    }
    if (tax.totalDeductions < 500000) {
        recommendations.push('<i class="fas fa-hand-holding-heart"></i> Donations to approved charities are 100% tax deductible');
    }
    if (!document.getElementById('healthDeduction').value || parseFloat(document.getElementById('healthDeduction').value) < 50000) {
        recommendations.push('<i class="fas fa-heartbeat"></i> Health insurance premiums up to PKR 50,000 are tax deductible');
    }
    recommendations.push('<i class="fas fa-graduation-cap"></i> Education expenses for children are tax deductible');
    recommendations.push('<i class="fas fa-home"></i> House building loan interest is deductible under Section 63');
    
    // 2026-27 specific recommendations
    recommendations.push('<i class="fas fa-bullhorn"></i> <strong>New for 2026-27:</strong> Maximum tax rate of 35% now applies only above PKR 7,000,000');
    recommendations.push('<i class="fas fa-check-circle"></i> <strong>Relief:</strong> Section 7E (deemed income tax on property) has been abolished');
    
    recDiv.innerHTML = recommendations.map(rec => `<div class="mt-2">${rec}</div>`).join('');
}

function updateYearComparison() {
    const compareYear = parseInt(document.getElementById('compareYear').value);
    const currentIncome = parseFloat(document.getElementById('incomeAmount').value) || 0;
    const type = document.getElementById('incomeType').value;
    const annualIncome = type === 'monthly' ? currentIncome * 12 : currentIncome;
    
    const currentTax = calculateIncomeTax(annualIncome, 2027);
    const compareTax = calculateIncomeTax(annualIncome, compareYear);
    const difference = currentTax - compareTax;
    const savings = compareTax - currentTax;
    
    const compDiv = document.getElementById('yearComparison');
    const compTable = document.getElementById('comparisonTable');
    if (!compDiv || !compTable) return;
    
    const yearLabel = compareYear === 2027 ? '2026-27 (Current)' : `${compareYear}-${String(compareYear+1).slice(2)}`;
    
    compDiv.classList.remove('hidden');
    compTable.innerHTML = `
        <table class="table">
            <tr><th>Year</th><th>Tax Amount</th><th>Difference</th></tr>
            <tr><td>2026-27 (New)</td><td>PKR ${formatNumber(currentTax)}</td>
                <td rowspan="2" style="${savings > 0 ? 'color: var(--success);' : 'color: var(--danger);'}">
                    ${savings > 0 ? '⬇️ Saved PKR ' + formatNumber(savings) : '⬆️ Extra PKR ' + formatNumber(Math.abs(savings))}
                </td>
            </tr>
            <tr><td>${yearLabel}</td><td>PKR ${formatNumber(compareTax)}</td></tr>
        </table>
        ${savings > 0 ? '<div style="color: var(--success); font-weight: 600; margin-top: 8px;">🎉 You save PKR ' + formatNumber(savings) + ' with new 2026-27 slabs!</div>' : ''}
    `;
}

function updateRefundEstimator(calculatedTax) {
    const taxPaid = parseFloat(document.getElementById('taxPaid').value) || 0;
    const refund = Math.max(0, taxPaid - calculatedTax);
    const due = Math.max(0, calculatedTax - taxPaid);
    
    const refundDiv = document.getElementById('refundResult');
    if (!refundDiv) return;
    if (refund > 0) {
        refundDiv.innerHTML = `<i class="fas fa-money-bill-wave"></i> You may get a refund of PKR ${formatNumber(refund)}`;
        refundDiv.className = 'alert alert-success';
    } else if (due > 0) {
        refundDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> You still owe PKR ${formatNumber(due)} in taxes`;
        refundDiv.className = 'alert alert-danger';
    } else {
        refundDiv.innerHTML = `<i class="fas fa-check-circle"></i> Your tax is fully paid!`;
        refundDiv.className = 'alert alert-info';
    }
}

function calculateWithholdingTax() {
    const mobileBill = parseFloat(document.getElementById('mobileBill').value) || 0;
    const bankProfit = parseFloat(document.getElementById('bankProfit').value) || 0;
    const propertyValue = parseFloat(document.getElementById('propertyValue').value) || 0;
    
    const mobileTax = mobileBill * 12 * withholdingRates.mobile;
    const bankTax = bankProfit * withholdingRates.bankProfit;
    const propertyTax = propertyValue * withholdingRates.property;
    
    const total = mobileTax + bankTax + propertyTax;
    
    const resultEl = document.getElementById('withholdingResult');
    if (!resultEl) return;
    resultEl.innerHTML = `
        <div class="small">Mobile Tax (Annual): PKR ${formatNumber(mobileTax)}</div>
        <div class="small">Bank Profit Tax: PKR ${formatNumber(bankTax)}</div>
        <div class="small">Property Tax: PKR ${formatNumber(propertyTax)}</div>
        <div class="mt-2"><strong>Total Withholding Tax: PKR ${formatNumber(total)}</strong></div>
    `;
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

function exportToPDF() {
    showToast('PDF Export - Use Print > Save as PDF', 'info');
    window.print();
}

function exportToExcel() {
    const tax = calculateTotalTax();
    const data = [
        ['Description', 'Amount (PKR)'],
        ['Gross Annual Income', tax.annualIncome],
        ['Total Deductions', tax.totalDeductions],
        ['Taxable Income', tax.taxableIncome],
        ['Federal Income Tax', tax.federalTax],
        ['Provincial Tax', tax.provincialTax],
        ['Total Annual Tax', tax.totalTax],
        ['Net Annual Income', tax.annualIncome - tax.totalTax],
        ['Monthly Income', tax.annualIncome / 12],
        ['Monthly Tax', tax.totalTax / 12]
    ];
    
    if (typeof XLSX !== 'undefined') {
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Tax Calculation 2026-27');
        XLSX.writeFile(wb, `tax_calculation_2026-27_${new Date().toISOString().slice(0,10)}.xlsx`);
        showToast('Excel file downloaded!', 'success');
    } else {
        showToast('Excel library not loaded', 'error');
    }
}

function generateSalarySlip() {
    const tax = calculateTotalTax();
    const monthlyIncome = tax.annualIncome / 12;
    const monthlyTax = tax.totalTax / 12;
    const netMonthly = monthlyIncome - monthlyTax;
    
    const slipHtml = `
        <!DOCTYPE html>
        <html><head><title>Salary Slip 2026-27</title>
        <style>body{font-family:Arial;padding:20px;background:#fff;color:#333;}
        .slip{max-width:600px;margin:auto;border:1px solid #ddd;padding:30px;border-radius:12px;}
        h2{text-align:center;color:#6C63FF;}.row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;}
        .total{font-weight:bold;font-size:18px;border-top:2px solid #6C63FF;padding-top:15px;margin-top:10px;}
        .highlight{color:#6C63FF;font-weight:600;}
</style></head><body>
<div class="slip">
    <h2>🧾 SALARY SLIP - FY 2026-27</h2>
    <p style="text-align:center;color:#666;">${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
    <div class="row"><span>Basic Salary</span><span>PKR ${formatNumber(monthlyIncome)}</span></div>
    <div class="row"><span>Tax Deduction</span><span style="color:#e74c3c;">- PKR ${formatNumber(monthlyTax)}</span></div>
    <div class="row total"><span>Net Salary</span><span>PKR ${formatNumber(netMonthly)}</span></div>
    <p style="text-align:center;color:#666;font-size:12px;margin-top:20px;">
        Generated by Magicrills Tax Calculator 2026-27 | Tax-free limit: PKR 600,000
    </p>
</div>
</body></html>
`;

const win = window.open();
if (win) {
    win.document.write(slipHtml);
    win.document.close();
    showToast('Salary slip generated!', 'success');
}
}

function saveCalculation() {
const tax = calculateTotalTax();
const calculation = {
    id: Date.now(),
    date: new Date().toLocaleString(),
    income: document.getElementById('incomeAmount').value,
    tax: tax.totalTax,
    netIncome: tax.annualIncome - tax.totalTax,
    year: '2026-27'
};

let saved = JSON.parse(localStorage.getItem('taxCalculations') || '[]');
saved.unshift(calculation);
if (saved.length > 5) saved = saved.slice(0, 5);
localStorage.setItem('taxCalculations', JSON.stringify(saved));
displaySavedCalculations();
showToast('Calculation saved!', 'success');
}

function displaySavedCalculations() {
const saved = JSON.parse(localStorage.getItem('taxCalculations') || '[]');
const container = document.getElementById('savedCalculations');
if (!container) return;

if (saved.length === 0) {
    container.innerHTML = '<p class="text-muted" style="color: var(--text-muted);">No saved calculations</p>';
    return;
}

container.innerHTML = saved.map(calc => `
    <div style="background: var(--bg-input); padding: 10px; margin-bottom: 6px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
        <small style="color: var(--text-muted);">${calc.date} (${calc.year || '2026-27'})</small><br>
        <strong>Income:</strong> PKR ${formatNumber(calc.income)}<br>
        <strong>Tax:</strong> PKR ${formatNumber(calc.tax)}<br>
        <strong>Net:</strong> PKR ${formatNumber(calc.netIncome)}
    </div>
`).join('');
}

// ============================================
// SHARE FUNCTIONS
// ============================================

function shareOnFacebook() { 
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out this Income Tax Calculator for Pakistan FY 2026-27!');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank'); 
    trackShare('facebook'); 
    showToast('Shared on Facebook!', 'success'); 
}

function shareOnTwitter() { 
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Calculate your income tax for Pakistan FY 2026-27 with this free tool!');
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank'); 
    trackShare('twitter'); 
    showToast('Shared on Twitter!', 'success'); 
}

function shareOnLinkedIn() { 
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank'); 
    trackShare('linkedin'); 
    showToast('Shared on LinkedIn!', 'success'); 
}

function shareOnWhatsApp() { 
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Income Tax Calculator Pakistan 2026-27 - ');
    window.open(`https://wa.me/?text=${text}${url}`, '_blank'); 
    trackShare('whatsapp'); 
    showToast('Shared on WhatsApp!', 'success'); 
}

function shareByEmail() { 
    const subject = encodeURIComponent('Income Tax Calculator - Pakistan FY 2026-27');
    const body = encodeURIComponent(`Check out this Income Tax Calculator for Pakistan FY 2026-27:\n\n${window.location.href}\n\nCalculate your tax liability instantly!`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`; 
    trackShare('email'); 
    showToast('Email opened!', 'info'); 
}

async function copyPageLink() { 
    try {
        await navigator.clipboard.writeText(window.location.href);
        trackShare('copy');
        showToast('Link copied to clipboard!', 'success');
    } catch {
        const input = document.createElement('input');
        input.value = window.location.href;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        trackShare('copy');
        showToast('Link copied to clipboard!', 'success');
    }
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// AI CHAT FUNCTIONS
// ============================================

function toggleAIChat() {
    const container = document.getElementById('aiChatContainer');
    if (!container) return;
    isChatOpen = !isChatOpen;
    container.classList.toggle('open', isChatOpen);
}

async function sendAIMessage() {
    const input = document.getElementById('aiChatInput');
    const messages = document.getElementById('aiChatMessages');
    if (!input || !messages) return;
    
    const question = input.value.trim();
    if (!question) return;
    
    const userMsg = document.createElement('div');
    userMsg.className = 'ai-chat-message user';
    userMsg.textContent = question;
    messages.appendChild(userMsg);
    input.value = '';
    messages.scrollTop = messages.scrollHeight;
    
    const typing = document.createElement('div');
    typing.className = 'ai-chat-message ai';
    typing.textContent = 'Thinking...';
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;
    
    try {
        const lower = question.toLowerCase();
        let response = '';
        
        // 2026-27 specific responses
        if (lower.includes('2026') || lower.includes('2027') || lower.includes('new slab')) {
            response = 'For FY 2026-27, the tax slabs are: 0-600k (0%), 600k-1.2M (1%), 1.2M-2.2M (11%), 2.2M-3.2M (20%), 3.2M-4.1M (25%), 4.1M-5.6M (29%), 5.6M-7M (32%), above 7M (35%). Maximum rate now applies above 7M (up from 4.1M).';
        } else if (lower.includes('slab') || lower.includes('rate')) {
            response = 'The 2026-27 tax slabs offer significant relief: 35% maximum rate now applies above PKR 7,000,000 (up from PKR 4.1M). Rates: 0%, 1%, 11%, 20%, 25%, 29%, 32%, 35%.';
        } else if (lower.includes('deduction') || lower.includes('save')) {
            response = 'You can save tax through Zakat, Life Insurance, Provident Fund, Donations (100% deductible), Health Insurance (up to 50k), and Education expenses. Section 7E has been abolished for 2026-27.';
        } else if (lower.includes('province') || lower.includes('provincial')) {
            response = 'Provincial tax rates: Punjab (0%), Sindh (1%), KPK (0.5%), Balochistan (0%). These apply on top of federal tax.';
        } else if (lower.includes('withholding')) {
            response = 'Withholding tax rates: Mobile (15%), Bank Profit (10%), Property (2%). Section 7E (deemed property tax) has been abolished for 2026-27.';
        } else if (lower.includes('salary') || lower.includes('income')) {
            response = 'Enter your monthly or annual income. The tax-free limit is PKR 600,000 annually (PKR 50,000/month). Use the deductions section to reduce taxable income.';
        } else if (lower.includes('refund') || lower.includes('pay')) {
            response = 'Use the Tax Refund Estimator with your tax already paid. If you overpaid, you\'ll get a refund. The new 2026-27 slabs may result in lower taxes for many!';
        } else if (lower.includes('super tax') || lower.includes('surcharge')) {
            response = 'Good news! The surcharge above PKR 10M has been eliminated for 2026-27. Super Tax has also been reduced and rationalized.';
        } else {
            response = 'I\'m here to help with tax questions! Ask about: 2026-27 slabs, deductions, provincial taxes, withholding tax, salary calculations, or the new relief measures.';
        }
        
        typing.textContent = response;
        typing.classList.add('ai');
        messages.scrollTop = messages.scrollHeight;
    } catch (error) {
        typing.textContent = 'Sorry, I had trouble processing that. Please try again.';
    }
}

// ============================================
// SCROLL BUTTONS
// ============================================

function setupScrollButtons() {
    const upBtn = document.getElementById('scrollUpBtn');
    const downBtn = document.getElementById('scrollDownBtn');
    if (!upBtn || !downBtn) return;
    
    window.addEventListener('scroll', () => {
        upBtn.style.display = window.scrollY > 200 ? 'flex' : 'none';
    });
    
    upBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    downBtn.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
}

// ============================================
// FORMAT HELPERS
// ============================================

function formatNumber(num) {
    if (isNaN(num)) return '0';
    return Math.round(num).toLocaleString('en-PK');
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize typewriter
    initTypewriter();
    
    // Load stats
    getToolStats();
    trackToolUsage();
    
    // Setup event listeners
    const calcBtn = document.getElementById('calculateBtn');
    if (calcBtn) {
        calcBtn.addEventListener('click', () => {
            calculateTotalTax();
            displayResults();
            trackToolUsage();
        });
    }
    
    const compareYear = document.getElementById('compareYear');
    if (compareYear) {
        compareYear.addEventListener('change', (e) => {
            currentYear = parseInt(e.target.value);
            updateTaxSlabsTable();
            displayResults();
        });
    }
    
    const withBtn = document.getElementById('calcWithholdingBtn');
    if (withBtn) {
        withBtn.addEventListener('click', calculateWithholdingTax);
    }
    
    const pdfBtn = document.getElementById('exportPdfBtn');
    if (pdfBtn) pdfBtn.addEventListener('click', exportToPDF);
    
    const excelBtn = document.getElementById('exportExcelBtn');
    if (excelBtn) excelBtn.addEventListener('click', exportToExcel);
    
    const slipBtn = document.getElementById('salarySlipBtn');
    if (slipBtn) slipBtn.addEventListener('click', generateSalarySlip);
    
    const saveBtn = document.getElementById('saveCalcBtn');
    if (saveBtn) saveBtn.addEventListener('click', saveCalculation);
    
    // Income input real-time
    const incomeAmt = document.getElementById('incomeAmount');
    if (incomeAmt) {
        incomeAmt.addEventListener('input', () => {
            calculateTotalTax();
            displayResults();
        });
    }
    
    // Deduction inputs
    const deductionInputs = ['zakatDeduction', 'insuranceDeduction', 'pfDeduction', 'donationDeduction', 'healthDeduction', 'educationDeduction'];
    deductionInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => { calculateTotalTax(); displayResults(); });
        }
    });
    
    // Income sources
    const sourceInputs = ['businessIncome', 'rentalIncome', 'capitalGains', 'freelanceIncome'];
    sourceInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => { calculateTotalTax(); displayResults(); });
        }
    });
    
    // Province and family status
    const provinceEl = document.getElementById('province');
    if (provinceEl) {
        provinceEl.addEventListener('change', () => { calculateTotalTax(); displayResults(); });
    }
    
    const familyEl = document.getElementById('familyStatus');
    if (familyEl) {
        familyEl.addEventListener('change', () => { calculateTotalTax(); displayResults(); });
    }
    
    const taxPaidEl = document.getElementById('taxPaid');
    if (taxPaidEl) {
        taxPaidEl.addEventListener('input', () => { const tax = calculateTotalTax(); updateRefundEstimator(tax.totalTax); });
    }
    
    const raiseEl = document.getElementById('raisePercent');
    if (raiseEl) {
        raiseEl.addEventListener('input', () => {
            const inc = calculateWithIncrement();
            const compTable = document.getElementById('comparisonTable');
            if (compTable) {
                compTable.innerHTML = `
                    <tr><td>Current Tax (2026-27):</td><td>PKR ${formatNumber(inc.currentTax)}</td></tr>
                    <tr><td>New Tax after ${document.getElementById('raisePercent').value}% raise:</td><td>PKR ${formatNumber(inc.newTax)}</td></tr>
                `;
            }
        });
    }
    
    // Reactions
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', () => addReaction(btn.dataset.emoji));
    });
    
    // Share buttons
    document.querySelector('.share-btn.facebook')?.addEventListener('click', shareOnFacebook);
    document.querySelector('.share-btn.twitter')?.addEventListener('click', shareOnTwitter);
    document.querySelector('.share-btn.linkedin')?.addEventListener('click', shareOnLinkedIn);
    document.querySelector('.share-btn.whatsapp')?.addEventListener('click', shareOnWhatsApp);
    document.querySelector('.share-btn.email')?.addEventListener('click', shareByEmail);
    document.querySelector('.share-btn.copy-link')?.addEventListener('click', copyPageLink);
    
    // AI Chat
    const chatToggle = document.getElementById('aiChatToggle');
    if (chatToggle) chatToggle.addEventListener('click', toggleAIChat);
    
    const chatClose = document.getElementById('aiChatClose');
    if (chatClose) chatClose.addEventListener('click', toggleAIChat);
    
    const chatSend = document.getElementById('aiChatSend');
    if (chatSend) chatSend.addEventListener('click', sendAIMessage);
    
    const chatInput = document.getElementById('aiChatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendAIMessage();
        });
    }
    
    // Scroll buttons
    setupScrollButtons();
    
    // Initial calculations
    updateTaxSlabsTable();
    calculateTotalTax();
    displayResults();
    displaySavedCalculations();
    
    showToast('Welcome to Magicrills Income Tax Calculator 2026-27!', 'success');
});
