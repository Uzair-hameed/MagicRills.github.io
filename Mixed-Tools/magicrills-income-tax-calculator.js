// ============================================
// MAGICRILLS INCOME TAX CALCULATOR - COMPLETE VERSION
// 50+ FEATURES WITH TiDB INTEGRATION
// ============================================

const TOOL_SLUG = 'magicrills-income-tax-calculator';
const API_BASE_URL = window.location.origin;

// Tax Slabs Database (2020-2025)
const taxSlabsHistory = {
    2025: [
        { min: 0, max: 600000, rate: 0, fixed: 0 },
        { min: 600001, max: 1200000, rate: 0.01, fixed: 0 },
        { min: 1200001, max: 2200000, rate: 0.11, fixed: 6000 },
        { min: 2200001, max: 3200000, rate: 0.23, fixed: 116000 },
        { min: 3200001, max: 4100000, rate: 0.30, fixed: 346000 },
        { min: 4100001, max: Infinity, rate: 0.35, fixed: 616000 }
    ],
    2024: [
        { min: 0, max: 600000, rate: 0, fixed: 0 },
        { min: 600001, max: 1200000, rate: 0.02, fixed: 0 },
        { min: 1200001, max: 2400000, rate: 0.12, fixed: 12000 },
        { min: 2400001, max: 3600000, rate: 0.22, fixed: 156000 },
        { min: 3600001, max: 4800000, rate: 0.27, fixed: 420000 },
        { min: 4800001, max: Infinity, rate: 0.30, fixed: 744000 }
    ],
    2023: [
        { min: 0, max: 500000, rate: 0, fixed: 0 },
        { min: 500001, max: 1000000, rate: 0.02, fixed: 0 },
        { min: 1000001, max: 2000000, rate: 0.10, fixed: 10000 },
        { min: 2000001, max: 3000000, rate: 0.18, fixed: 110000 },
        { min: 3000001, max: 4000000, rate: 0.22, fixed: 290000 },
        { min: 4000001, max: Infinity, rate: 0.25, fixed: 510000 }
    ],
    2022: [
        { min: 0, max: 400000, rate: 0, fixed: 0 },
        { min: 400001, max: 800000, rate: 0.02, fixed: 0 },
        { min: 800001, max: 1800000, rate: 0.08, fixed: 8000 },
        { min: 1800001, max: 2800000, rate: 0.15, fixed: 88000 },
        { min: 2800001, max: 3800000, rate: 0.20, fixed: 238000 },
        { min: 3800001, max: Infinity, rate: 0.23, fixed: 438000 }
    ]
};

// Provincial Tax Rates (additional)
const provincialTax = {
    punjab: { rate: 0, name: 'Punjab' },
    sindh: { rate: 0.01, name: 'Sindh' },
    kpk: { rate: 0.005, name: 'Khyber Pakhtunkhwa' },
    balochistan: { rate: 0, name: 'Balochistan' }
};

// Withholding Tax Rates
const withholdingRates = {
    mobile: 0.15,
    bankProfit: 0.10,
    property: 0.02
};

// Global variables
let taxChart = null;
let currentYear = 2025;
let userReactions = {};

// ============================================
// TiDB API FUNCTIONS
// ============================================

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
        }
    } catch (error) {
        let localCount = localStorage.getItem(`${TOOL_SLUG}_usage`) || 0;
        document.getElementById('usedCount').innerText = localCount;
    }
}

async function getToolStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/tool/stats?slug=${TOOL_SLUG}`);
        if (response.ok) {
            const data = await response.json();
            document.getElementById('usedCount').innerText = data.usageCount || 0;
            document.getElementById('shareCount').innerText = data.shareCount || 0;
            if (data.reactions) updateReactionCounts(data.reactions);
        }
    } catch (error) {
        loadLocalStats();
    }
}

async function addReaction(emojiType) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/tool/reaction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toolSlug: TOOL_SLUG, emojiType })
        });
        if (response.ok) {
            const data = await response.json();
            updateReactionCounts(data.reactions);
            showToast(`You reacted with ${emojiType}!`, 'success');
        } else if (response.status === 409) {
            showToast('You already reacted with this emoji!', 'info');
        }
    } catch (error) {
        incrementLocalReaction(emojiType);
    }
}

async function trackShare(platform) {
    try {
        await fetch(`${API_BASE_URL}/api/tool/share`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toolSlug: TOOL_SLUG, shareType: platform })
        });
    } catch (error) {}
}

function updateReactionCounts(reactions) {
    const emojis = ['like', 'love', 'wow', 'sad', 'angry', 'laugh', 'celebrate'];
    emojis.forEach(emoji => {
        const el = document.getElementById(`${emoji}Count`);
        if (el && reactions[emoji]) el.innerText = reactions[emoji];
    });
}

function incrementLocalReaction(emojiType) {
    let reactions = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_reactions`) || '{}');
    reactions[emojiType] = (reactions[emojiType] || 0) + 1;
    localStorage.setItem(`${TOOL_SLUG}_reactions`, JSON.stringify(reactions));
    updateReactionCounts(reactions);
}

function loadLocalStats() {
    document.getElementById('usedCount').innerText = localStorage.getItem(`${TOOL_SLUG}_usage`) || 0;
    document.getElementById('shareCount').innerText = localStorage.getItem(`${TOOL_SLUG}_shares`) || 0;
    const reactions = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_reactions`) || '{}');
    updateReactionCounts(reactions);
}

// ============================================
// TAX CALCULATION FUNCTIONS
// ============================================

function calculateIncomeTax(income, year = 2025) {
    const slabs = taxSlabsHistory[year] || taxSlabsHistory[2025];
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
    // Get basic income
    const type = document.getElementById('incomeType').value;
    let amount = parseFloat(document.getElementById('incomeAmount').value) || 0;
    let annualIncome = type === 'monthly' ? amount * 12 : amount;
    
    // Add multiple income sources
    const businessIncome = parseFloat(document.getElementById('businessIncome').value) || 0;
    const rentalIncome = parseFloat(document.getElementById('rentalIncome').value) || 0;
    const capitalGains = parseFloat(document.getElementById('capitalGains').value) || 0;
    const freelanceIncome = parseFloat(document.getElementById('freelanceIncome').value) || 0;
    
    annualIncome += businessIncome + rentalIncome + capitalGains + freelanceIncome;
    
    // Calculate deductions
    const zakat = parseFloat(document.getElementById('zakatDeduction').value) || 0;
    const insurance = parseFloat(document.getElementById('insuranceDeduction').value) || 0;
    const pf = parseFloat(document.getElementById('pfDeduction').value) || 0;
    const donations = parseFloat(document.getElementById('donationDeduction').value) || 0;
    const health = parseFloat(document.getElementById('healthDeduction').value) || 0;
    const education = parseFloat(document.getElementById('educationDeduction').value) || 0;
    
    const totalDeductions = zakat + insurance + pf + donations + health + education;
    const taxableIncome = Math.max(0, annualIncome - totalDeductions);
    
    // Calculate federal tax
    const federalTax = calculateIncomeTax(taxableIncome, currentYear);
    
    // Calculate provincial tax
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
        effectiveRate: (totalTax / annualIncome) * 100
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
    
    // Summary Alert
    document.getElementById('summaryAlert').innerHTML = `
        <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
            <span><strong>Annual Income:</strong> PKR ${formatNumber(tax.annualIncome)}</span>
            <span><strong>Taxable Income:</strong> PKR ${formatNumber(tax.taxableIncome)}</span>
            <span><strong>Total Tax:</strong> PKR ${formatNumber(tax.totalTax)}</span>
            <span><strong>Net Annual:</strong> PKR ${formatNumber(tax.annualIncome - tax.totalTax)}</span>
        </div>
        <div class="mt-2"><strong>Effective Tax Rate:</strong> ${tax.effectiveRate.toFixed(2)}%</div>
    `;
    
    // Breakdown Table
    const breakdown = [
        { desc: 'Gross Annual Income', amount: tax.annualIncome },
        { desc: 'Total Deductions (Zakat, PF, Insurance, etc.)', amount: tax.totalDeductions },
        { desc: 'Taxable Income', amount: tax.taxableIncome },
        { desc: 'Federal Income Tax', amount: tax.federalTax },
        { desc: `Provincial Tax (${provincialTax[document.getElementById('province').value]?.name || 'None'})`, amount: tax.provincialTax },
        { desc: 'Total Annual Tax', amount: tax.totalTax },
        { desc: 'Net Annual Income After Tax', amount: tax.annualIncome - tax.totalTax },
        { desc: 'Gross Monthly Income', amount: monthlyIncome },
        { desc: 'Monthly Tax Deduction', amount: monthlyTax },
        { desc: 'Net Monthly Income After Tax', amount: netMonthly }
    ];
    
    document.getElementById('breakdownTable').innerHTML = breakdown.map(item => 
        `<tr><td>${item.desc}</td><td>PKR ${formatNumber(item.amount)}</td></tr>`
    ).join('');
    
    // Monthly Breakdown
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    document.getElementById('monthlyBreakdown').innerHTML = months.map(month => `
        <tr><td>${month}</td><td>PKR ${formatNumber(monthlyIncome)}</td><td>PKR ${formatNumber(monthlyTax)}</td><td>PKR ${formatNumber(netMonthly)}</td></tr>
    `).join('');
    
    // Update Chart
    updateChart(tax.totalTax, tax.annualIncome - tax.totalTax);
    
    // Update Recommendations
    updateRecommendations(tax);
    
    // Update Year Comparison
    updateYearComparison();
    
    // Update Refund Estimator
    updateRefundEstimator(tax.totalTax);
    
    // Show results
    document.getElementById('results').classList.remove('hidden');
}

function updateChart(tax, netIncome) {
    const ctx = document.getElementById('taxChart').getContext('2d');
    if (taxChart) taxChart.destroy();
    
    taxChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Tax Paid', 'Net Income'],
            datasets: [{
                data: [tax, netIncome],
                backgroundColor: ['#dc3545', '#28a745'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: { callbacks: { label: (ctx) => `${ctx.label}: PKR ${formatNumber(ctx.raw)} (${((ctx.raw / (tax + netIncome)) * 100).toFixed(1)}%)` } }
            }
        }
    });
}

function updateRecommendations(tax) {
    const recDiv = document.getElementById('recommendations');
    let recommendations = [];
    
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
    
    recDiv.innerHTML = recommendations.map(rec => `<div class="mt-2">${rec}</div>`).join('');
}

function updateYearComparison() {
    const compareYear = parseInt(document.getElementById('compareYear').value);
    const currentIncome = parseFloat(document.getElementById('incomeAmount').value) || 0;
    const type = document.getElementById('incomeType').value;
    const annualIncome = type === 'monthly' ? currentIncome * 12 : currentIncome;
    
    const currentTax = calculateIncomeTax(annualIncome, 2025);
    const compareTax = calculateIncomeTax(annualIncome, compareYear);
    const difference = currentTax - compareTax;
    
    const comparisonDiv = document.getElementById('yearComparison');
    const comparisonTable = document.getElementById('comparisonTable');
    
    comparisonDiv.classList.remove('hidden');
    comparisonTable.innerHTML = `
        <table class="table">
            <tr><th>Year</th><th>Tax Amount</th><th>Difference</th></tr>
            <tr><td>2025-26</td><td>PKR ${formatNumber(currentTax)}</td><td rowspan="2">${difference > 0 ? '+' : ''}PKR ${formatNumber(Math.abs(difference))}</td></tr>
            <tr><td>${compareYear}-${compareYear+1}</td><td>PKR ${formatNumber(compareTax)}</td></tr>
        </table>
    `;
}

function updateRefundEstimator(calculatedTax) {
    const taxPaid = parseFloat(document.getElementById('taxPaid').value) || 0;
    const refund = Math.max(0, taxPaid - calculatedTax);
    const due = Math.max(0, calculatedTax - taxPaid);
    
    const refundDiv = document.getElementById('refundResult');
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
    
    document.getElementById('withholdingResult').innerHTML = `
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
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tax Calculation');
    XLSX.writeFile(wb, `tax_calculation_${new Date().toISOString().slice(0,10)}.xlsx`);
    showToast('Excel file downloaded!', 'success');
}

function generateSalarySlip() {
    const tax = calculateTotalTax();
    const monthlyIncome = tax.annualIncome / 12;
    const monthlyTax = tax.totalTax / 12;
    const netMonthly = monthlyIncome - monthlyTax;
    
    const slipHtml = `
        <div style="padding: 20px; font-family: Arial;">
            <h2 style="text-align: center;">SALARY SLIP</h2>
            <div style="border: 1px solid #ccc; padding: 15px;">
                <p><strong>Month:</strong> ${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                <p><strong>Basic Salary:</strong> PKR ${formatNumber(monthlyIncome)}</p>
                <p><strong>Tax Deduction:</strong> PKR ${formatNumber(monthlyTax)}</p>
                <hr>
                <p><strong>Net Salary:</strong> PKR ${formatNumber(netMonthly)}</p>
            </div>
        </div>
    `;
    
    const win = window.open();
    win.document.write(slipHtml);
    win.document.close();
    showToast('Salary slip generated!', 'success');
}

function saveCalculation() {
    const tax = calculateTotalTax();
    const calculation = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        income: document.getElementById('incomeAmount').value,
        tax: tax.totalTax,
        netIncome: tax.annualIncome - tax.totalTax
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
    
    if (saved.length === 0) {
        container.innerHTML = '<p class="text-muted">No saved calculations</p>';
        return;
    }
    
    container.innerHTML = saved.map(calc => `
        <div class="saved-item" style="background: #f8f9fa; padding: 8px; margin-bottom: 5px; border-radius: 8px;">
            <small>${calc.date}</small><br>
            <strong>Income:</strong> PKR ${formatNumber(calc.income)}<br>
            <strong>Tax:</strong> PKR ${formatNumber(calc.tax)}
        </div>
    `).join('');
}

// ============================================
// SHARE FUNCTIONS
// ============================================

function shareOnFacebook() { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank'); trackShare('facebook'); showToast('Shared!', 'success'); }
function shareOnTwitter() { window.open(`https://twitter.com/intent/tweet?text=Check%20out%20this%20Income%20Tax%20Calculator&url=${encodeURIComponent(window.location.href)}`, '_blank'); trackShare('twitter'); showToast('Shared!', 'success'); }
function shareOnLinkedIn() { window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank'); trackShare('linkedin'); showToast('Shared!', 'success'); }
function shareOnWhatsApp() { window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, '_blank'); trackShare('whatsapp'); showToast('Shared!', 'success'); }
function shareByEmail() { window.location.href = `mailto:?subject=Income Tax Calculator&body=${encodeURIComponent(window.location.href)}`; trackShare('email'); showToast('Email opened!', 'info'); }
async function copyPageLink() { await navigator.clipboard.writeText(window.location.href); trackShare('copy'); showToast('Link copied!', 'success'); }

function showToast(message, type) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function setupScrollButtons() {
    const upBtn = document.getElementById('scrollUpBtn');
    const downBtn = document.getElementById('scrollDownBtn');
    
    window.addEventListener('scroll', () => {
        upBtn.style.display = window.scrollY > 200 ? 'flex' : 'none';
    });
    
    upBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    downBtn.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
}

function formatNumber(num) {
    return Math.round(num).toLocaleString('en-PK');
}

// ============================================
// EVENT LISTENERS & INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Load stats
    getToolStats();
    trackToolUsage();
    
    // Setup event listeners
    document.getElementById('calculateBtn').addEventListener('click', () => {
        calculateTotalTax();
        displayResults();
        trackToolUsage();
    });
    
    document.getElementById('compareYear').addEventListener('change', (e) => {
        currentYear = parseInt(e.target.value);
        updateTaxSlabsTable();
        displayResults();
    });
    
    document.getElementById('calcWithholdingBtn').addEventListener('click', calculateWithholdingTax);
    document.getElementById('exportPdfBtn').addEventListener('click', exportToPDF);
    document.getElementById('exportExcelBtn').addEventListener('click', exportToExcel);
    document.getElementById('salarySlipBtn').addEventListener('click', generateSalarySlip);
    document.getElementById('saveCalcBtn').addEventListener('click', saveCalculation);
    
    // Income input real-time
    document.getElementById('incomeAmount').addEventListener('input', () => {
        calculateTotalTax();
        displayResults();
    });
    
    // Deduction inputs
    const deductionInputs = ['zakatDeduction', 'insuranceDeduction', 'pfDeduction', 'donationDeduction', 'healthDeduction', 'educationDeduction'];
    deductionInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', () => { calculateTotalTax(); displayResults(); });
    });
    
    // Income sources
    const sourceInputs = ['businessIncome', 'rentalIncome', 'capitalGains', 'freelanceIncome'];
    sourceInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', () => { calculateTotalTax(); displayResults(); });
    });
    
    // Province and family status
    document.getElementById('province').addEventListener('change', () => { calculateTotalTax(); displayResults(); });
    document.getElementById('familyStatus').addEventListener('change', () => { calculateTotalTax(); displayResults(); });
    document.getElementById('taxPaid').addEventListener('input', () => { const tax = calculateTotalTax(); updateRefundEstimator(tax.totalTax); });
    document.getElementById('raisePercent').addEventListener('input', () => { const inc = calculateWithIncrement(); document.getElementById('comparisonTable').innerHTML = `<tr><td>Current Tax:</td><td>PKR ${formatNumber(inc.currentTax)}</td></tr><tr><td>New Tax after ${document.getElementById('raisePercent').value}% raise:</td><td>PKR ${formatNumber(inc.newTax)}</td></tr>`; });
    
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
    
    // Scroll buttons
    setupScrollButtons();
    
    // Initial calculations
    updateTaxSlabsTable();
    calculateTotalTax();
    displayResults();
    displaySavedCalculations();
    
    showToast('Welcome to Advanced Income Tax Calculator!', 'success');
});
