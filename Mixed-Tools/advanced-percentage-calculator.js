// ===== CONFIGURATION =====
const CONFIG = {
    API_BASE: 'https://magicrills-api.uzairhameed01.workers.dev',
    API_KEY: 'magicrills-grok-api.uzairhameed01.workers.dev',
    TOOL_SLUG: 'percentage-calculator',
    TOOL_NAME: 'Advanced Percentage Calculator',
    CATEGORY: 'Mixed-Tools'
};

// ===== STORAGE =====
let totalUses = parseInt(localStorage.getItem('totalUses')) || 0;
let history = JSON.parse(localStorage.getItem('history')) || [];
let reactions = JSON.parse(localStorage.getItem('reactions')) || {
    like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0
};
let stats = {
    views: 0,
    uses: 0,
    shares: 0,
    followers: 0
};

// ===== TOAST =====
function showToast(msg, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ===== API CALLS =====
async function callAPI(endpoint, method = 'GET', data = null) {
    try {
        const url = `${CONFIG.API_BASE}${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': CONFIG.API_KEY
            }
        };
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.warn('API call failed, using localStorage:', error);
        return null;
    }
}

// ===== INCREMENT USAGE =====
async function incrementUsage() {
    try {
        const result = await callAPI('/api/usage', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            tool_name: CONFIG.TOOL_NAME,
            category: CONFIG.CATEGORY
        });
        
        if (result && result.success) {
            totalUses = result.total_uses || totalUses + 1;
            localStorage.setItem('totalUses', totalUses);
            updateStatsUI();
        } else {
            // Fallback: local increment
            totalUses++;
            localStorage.setItem('totalUses', totalUses);
            updateStatsUI();
        }
    } catch (error) {
        // Fallback: local increment
        totalUses++;
        localStorage.setItem('totalUses', totalUses);
        updateStatsUI();
    }
}

// ===== GET STATS =====
async function fetchStats() {
    try {
        const result = await callAPI(`/api/stats?tool_slug=${CONFIG.TOOL_SLUG}`);
        if (result && result.success) {
            stats.views = result.views || 0;
            stats.uses = result.uses || 0;
            stats.shares = result.shares || 0;
            stats.followers = result.followers || 0;
            updateStatsUI();
        }
    } catch (error) {
        console.warn('Failed to fetch stats:', error);
    }
}

// ===== REACTIONS =====
async function addReaction(type) {
    try {
        const result = await callAPI('/api/reactions', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            reaction_type: type
        });
        
        if (result && result.success) {
            reactions = result.reactions || reactions;
            localStorage.setItem('reactions', JSON.stringify(reactions));
            updateStatsUI();
            showToast(`Thanks for your ${type} reaction! 🎉`);
        } else {
            // Fallback: local update
            reactions[type] = (reactions[type] || 0) + 1;
            localStorage.setItem('reactions', JSON.stringify(reactions));
            updateStatsUI();
            showToast(`Thanks for your ${type} reaction! 🎉`);
        }
    } catch (error) {
        // Fallback: local update
        reactions[type] = (reactions[type] || 0) + 1;
        localStorage.setItem('reactions', JSON.stringify(reactions));
        updateStatsUI();
        showToast(`Thanks for your ${type} reaction! 🎉`);
    }
}

// ===== RECORD SHARE =====
async function recordShare(platform) {
    try {
        const result = await callAPI('/api/shares', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            platform: platform
        });
        
        if (result && result.success) {
            stats.shares = result.total_shares || stats.shares + 1;
            updateStatsUI();
        } else {
            stats.shares++;
            updateStatsUI();
        }
    } catch (error) {
        stats.shares++;
        updateStatsUI();
    }
}

// ===== UPDATE UI =====
function updateStatsUI() {
    // Hero stats
    document.getElementById('statUsage').textContent = totalUses || stats.uses || 0;
    document.getElementById('statViews').textContent = stats.views || 0;
    document.getElementById('statShares').textContent = stats.shares || 0;
    document.getElementById('statFollowers').textContent = stats.followers || 0;
    
    // Dashboard stats
    document.getElementById('dashViews').textContent = stats.views || 0;
    document.getElementById('dashUses').textContent = totalUses || stats.uses || 0;
    document.getElementById('dashShares').textContent = stats.shares || 0;
    
    const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);
    document.getElementById('dashReactions').textContent = totalReactions;
    
    // Reaction counts
    document.getElementById('likeCount').textContent = reactions.like || 0;
    document.getElementById('loveCount').textContent = reactions.love || 0;
    document.getElementById('wowCount').textContent = reactions.wow || 0;
    document.getElementById('sadCount').textContent = reactions.sad || 0;
    document.getElementById('angryCount').textContent = reactions.angry || 0;
    document.getElementById('laughCount').textContent = reactions.laugh || 0;
    document.getElementById('celebrateCount').textContent = reactions.celebrate || 0;
}

// ===== HISTORY =====
function addToHistory(type, text, result) {
    history.unshift({
        id: Date.now(),
        type: type,
        text: text,
        result: result,
        time: new Date().toLocaleTimeString()
    });
    if (history.length > 50) history.pop();
    localStorage.setItem('history', JSON.stringify(history));
    renderHistory();
    incrementUsage();
}

function renderHistory() {
    const search = document.getElementById('searchHistory')?.value.toLowerCase() || '';
    const filtered = history.filter(h => 
        h.text.toLowerCase().includes(search) || 
        h.type.toLowerCase().includes(search)
    );
    const container = document.getElementById('historyList');
    if (!container) return;
    
    if (filtered.length === 0) {
        container.innerHTML = `<div class="history-empty">No calculations yet. Start using the tool!</div>`;
        return;
    }
    
    container.innerHTML = filtered.map(h => `
        <div class="historyItem" onclick="showToast('${h.text} = ${h.result}')">
            <span>
                <span class="h-type">${h.type}</span>
                <span class="h-text">${h.text}</span>
            </span>
            <span class="h-result">${h.result}</span>
        </div>
    `).join('');
}

function clearHistory() {
    if (confirm('Clear all calculation history?')) {
        history = [];
        localStorage.setItem('history', JSON.stringify(history));
        renderHistory();
        showToast('History cleared');
    }
}

function exportHistory() {
    if (history.length === 0) {
        showToast('No history to export');
        return;
    }
    const csv = 'Type,Calculation,Result,Time\n' + 
        history.map(h => `"${h.type}","${h.text}","${h.result}","${h.time}"`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `history_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(blob);
    showToast('History exported successfully!');
}

// ===== TYPEWRITER EFFECT =====
function initTypewriter() {
    const phrases = [
        'Calculator',
        'Discount Tool',
        'Tax Calculator',
        'GST Calculator',
        'EMI Calculator',
        'BMI Calculator',
        'Profit Margin',
        'Financial Tool'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const element = document.getElementById('typewriter-text');
    
    function type() {
        if (!element) return;
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            element.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            setTimeout(() => { isDeleting = true; }, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }
        
        const speed = isDeleting ? 50 : 100;
        setTimeout(type, speed);
    }
    
    type();
}

// ===== CHECKLIST =====
function initChecklist() {
    const tools = [
        '#1 Basic Percentage', '#2 What Percent', '#3 Percentage Change',
        '#4 Increase by %', '#5 Decrease by %', '#6 Reverse %',
        '#7 Discount', '#8 Tax', '#9 GST', '#10 VAT',
        '#11 Tip', '#12 Markup', '#13 Markdown', '#14 Profit Margin',
        '#15 ROI', '#16 CAGR', '#17 Salary Increase', '#18 EMI',
        '#19 Home Loan', '#20 Car Loan', '#21 Education Loan',
        '#22 Personal Loan', '#23 Compound Interest', '#24 SIP',
        '#25 FD', '#26 RD', '#27 BMI', '#28 Exam %',
        '#29 Fraction to %', '#30 Percentage Point', '#31 Multiple %',
        '#32 Range %', '#33 Finder', '#34 Compare', '#35 Profit/Loss',
        '#36 Simple Interest', '#37 XIRR', '#38 Wealth', '#39 Inflation',
        '#40 Future Value', '#41 Present Value', '#42 Loan Balance',
        '#43 Credit Card Interest', '#44 Dividend Yield', '#45 EPS',
        '#46 P/E Ratio'
    ];
    
    const grid = document.getElementById('checklistGrid');
    if (!grid) return;
    
    grid.innerHTML = tools.map((name, i) => `
        <div class="checklist-item" onclick="document.getElementById('toolMenu').selectedIndex = ${i}; document.getElementById('toolMenu').dispatchEvent(new Event('change'));">
            <span class="check-icon">${i + 1}</span>
            <span>${name}</span>
        </div>
    `).join('');
}

// ===== ALL 46 TOOLS =====
const tools = [
    // 0: Basic Percentage
    { html: `<div class="tool-card"><h2>🔢 What is X% of Y?</h2><div class="inputGroup"><input type="number" id="a" value="10" placeholder="X %"><span>% of</span><input type="number" id="b" value="200" placeholder="Y"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">Result: <span id="result">20.00</span></div></div>`,
      calc: () => { let a=parseFloat(document.getElementById('a').value)||0, b=parseFloat(document.getElementById('b').value)||0, res=(a/100)*b; document.getElementById('result').innerText=res.toFixed(2); addToHistory('Basic %', `${a}% of ${b}`, res.toFixed(2)); } },
    // 1: What Percent
    { html: `<div class="tool-card"><h2>❓ A is what % of B?</h2><div class="inputGroup"><input type="number" id="a" value="50" placeholder="A"><span>is what % of</span><input type="number" id="b" value="200" placeholder="B"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">Result: <span id="result">25.00</span>%</div></div>`,
      calc: () => { let a=parseFloat(document.getElementById('a').value)||0, b=parseFloat(document.getElementById('b').value)||1, res=(a/b)*100; document.getElementById('result').innerText=res.toFixed(2); addToHistory('What %', `${a} is what % of ${b}`, res.toFixed(2)+'%'); } },
    // 2: Percentage Change
    { html: `<div class="tool-card"><h2>📈 Percentage Change</h2><div class="inputGroup"><input type="number" id="a" value="100" placeholder="Old Value"><span>to</span><input type="number" id="b" value="120" placeholder="New Value"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">Change: <span id="result">20.00</span>%</div><div class="smallText">Difference: <span id="diff">20.00</span></div></div>`,
      calc: () => { let o=parseFloat(document.getElementById('a').value)||0, n=parseFloat(document.getElementById('b').value)||0, d=n-o, res=o===0?0:(d/o)*100; document.getElementById('result').innerText=res.toFixed(2); document.getElementById('diff').innerText=d.toFixed(2); addToHistory('% Change', `${o} to ${n}`, res.toFixed(2)+'%'); } },
    // 3: Increase
    { html: `<div class="tool-card"><h2>⬆️ Increase by %</h2><div class="inputGroup"><input type="number" id="a" value="100" placeholder="Original"><span>increase by</span><input type="number" id="b" value="10" placeholder="%"></div><button class="btnCalc btnSuccess" id="calcBtn"><i class="fas fa-plus"></i> Increase</button><div class="resultArea">New Value: <span id="result">110.00</span></div><div class="smallText">Difference: <span id="diff">10.00</span></div></div>`,
      calc: () => { let v=parseFloat(document.getElementById('a').value)||0, p=parseFloat(document.getElementById('b').value)||0, c=(p/100)*v, res=v+c; document.getElementById('result').innerText=res.toFixed(2); document.getElementById('diff').innerText=c.toFixed(2); addToHistory('Increase', `${v} + ${p}%`, res.toFixed(2)); } },
    // 4: Decrease
    { html: `<div class="tool-card"><h2>⬇️ Decrease by %</h2><div class="inputGroup"><input type="number" id="a" value="100" placeholder="Original"><span>decrease by</span><input type="number" id="b" value="10" placeholder="%"></div><button class="btnCalc btnDanger" id="calcBtn"><i class="fas fa-minus"></i> Decrease</button><div class="resultArea">New Value: <span id="result">90.00</span></div><div class="smallText">Difference: <span id="diff">10.00</span></div></div>`,
      calc: () => { let v=parseFloat(document.getElementById('a').value)||0, p=parseFloat(document.getElementById('b').value)||0, c=(p/100)*v, res=v-c; document.getElementById('result').innerText=res.toFixed(2); document.getElementById('diff').innerText=c.toFixed(2); addToHistory('Decrease', `${v} - ${p}%`, res.toFixed(2)); } },
    // 5: Reverse Percentage
    { html: `<div class="tool-card"><h2>🔄 Reverse Percentage</h2><div class="inputGroup"><input type="number" id="a" value="110" placeholder="Final Amount"><span>after</span><input type="number" id="b" value="10" placeholder="%"></div><div class="btnGroup"><button class="btnCalc btnSuccess" id="incBtn"><i class="fas fa-arrow-up"></i> After Increase</button><button class="btnCalc btnDanger" id="decBtn"><i class="fas fa-arrow-down"></i> After Decrease</button></div><div class="resultArea">Original: <span id="result">100.00</span></div><div class="smallText">Difference: <span id="diff">10.00</span></div></div>`,
      calcInc: () => { let f=parseFloat(document.getElementById('a').value)||0, p=parseFloat(document.getElementById('b').value)||0, o=f/(1+(p/100)), d=f-o; document.getElementById('result').innerText=o.toFixed(2); document.getElementById('diff').innerText=d.toFixed(2); addToHistory('Reverse Inc', `${f} after ${p}% increase`, o.toFixed(2)); },
      calcDec: () => { let f=parseFloat(document.getElementById('a').value)||0, p=parseFloat(document.getElementById('b').value)||0, o=f/(1-(p/100)), d=o-f; document.getElementById('result').innerText=o.toFixed(2); document.getElementById('diff').innerText=d.toFixed(2); addToHistory('Reverse Dec', `${f} after ${p}% decrease`, o.toFixed(2)); } },
    // 6: Discount
    { html: `<div class="tool-card"><h2>🏷️ Discount Calculator</h2><div class="inputGroup"><input type="number" id="a" value="100" placeholder="Price"><span>-</span><input type="number" id="b" value="20" placeholder="Discount %"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">You Pay: $<span id="result">80.00</span></div><div class="smallText">You Save: $<span id="diff">20.00</span></div></div>`,
      calc: () => { let p=parseFloat(document.getElementById('a').value)||0, d=parseFloat(document.getElementById('b').value)||0, s=(d/100)*p, res=p-s; document.getElementById('result').innerText=res.toFixed(2); document.getElementById('diff').innerText=s.toFixed(2); addToHistory('Discount', `$${p} - ${d}%`, `$${res.toFixed(2)}`); } },
    // 7: Tax
    { html: `<div class="tool-card"><h2>📄 Tax Calculator</h2><div class="inputGroup"><input type="number" id="a" value="100" placeholder="Price"><span>+</span><input type="number" id="b" value="13" placeholder="Tax %"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">Total: $<span id="result">113.00</span></div><div class="smallText">Tax: $<span id="diff">13.00</span></div></div>`,
      calc: () => { let p=parseFloat(document.getElementById('a').value)||0, t=parseFloat(document.getElementById('b').value)||0, tax=(t/100)*p, res=p+tax; document.getElementById('result').innerText=res.toFixed(2); document.getElementById('diff').innerText=tax.toFixed(2); addToHistory('Tax', `$${p} + ${t}%`, `$${res.toFixed(2)}`); } },
    // 8: GST
    { html: `<div class="tool-card"><h2>💰 GST Calculator</h2><div class="inputGroup"><input type="number" id="a" value="1000" placeholder="Amount"><span>+</span><input type="number" id="b" value="18" placeholder="GST %"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">GST: $<span id="diff">180.00</span></div><div class="smallText">Total: $<span id="result">1180.00</span></div></div>`,
      calc: () => { let a=parseFloat(document.getElementById('a').value)||0, g=parseFloat(document.getElementById('b').value)||0, gst=(g/100)*a, res=a+gst; document.getElementById('result').innerText=res.toFixed(2); document.getElementById('diff').innerText=gst.toFixed(2); addToHistory('GST', `$${a} + ${g}% GST`, `$${res.toFixed(2)}`); } },
    // 9: VAT
    { html: `<div class="tool-card"><h2>🧾 VAT Calculator</h2><div class="inputGroup"><input type="number" id="a" value="1000" placeholder="Amount"><span>+</span><input type="number" id="b" value="15" placeholder="VAT %"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">VAT: $<span id="diff">150.00</span></div><div class="smallText">Total: $<span id="result">1150.00</span></div></div>`,
      calc: () => { let a=parseFloat(document.getElementById('a').value)||0, v=parseFloat(document.getElementById('b').value)||0, vat=(v/100)*a, res=a+vat; document.getElementById('result').innerText=res.toFixed(2); document.getElementById('diff').innerText=vat.toFixed(2); addToHistory('VAT', `$${a} + ${v}% VAT`, `$${res.toFixed(2)}`); } },
    // 10: Tip
    { html: `<div class="tool-card"><h2>🍽️ Tip Calculator</h2><div class="inputGroup"><input type="number" id="a" value="50" placeholder="Bill"><input type="number" id="b" value="15" placeholder="Tip %"><input type="number" id="c" value="2" placeholder="People"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">Tip: $<span id="diff">7.50</span></div><div class="smallText">Per Person: $<span id="result">28.75</span></div></div>`,
      calc: () => { let b=parseFloat(document.getElementById('a').value)||0, p=parseFloat(document.getElementById('b').value)||0, pe=parseFloat(document.getElementById('c').value)||1, tip=(p/100)*b, total=b+tip, pp=total/pe; document.getElementById('result').innerText=pp.toFixed(2); document.getElementById('diff').innerText=tip.toFixed(2); addToHistory('Tip', `$${b} bill, ${p}% tip, ${pe} people`, `$${pp.toFixed(2)}/person`); } },
    // 11: Markup
    { html: `<div class="tool-card"><h2>📈 Markup Calculator</h2><div class="inputGroup"><input type="number" id="a" value="100" placeholder="Cost"><input type="number" id="b" value="25" placeholder="Markup %"></div><button class="btnCalc btnSuccess" id="calcBtn"><i class="fas fa-plus"></i> Markup</button><div class="resultArea">Selling: $<span id="result">125.00</span></div><div class="smallText">Profit: $<span id="diff">25.00</span></div></div>`,
      calc: () => { let c=parseFloat(document.getElementById('a').value)||0, p=parseFloat(document.getElementById('b').value)||0, profit=(p/100)*c, res=c+profit; document.getElementById('result').innerText=res.toFixed(2); document.getElementById('diff').innerText=profit.toFixed(2); addToHistory('Markup', `$${c} + ${p}%`, `$${res.toFixed(2)}`); } },
    // 12: Markdown
    { html: `<div class="tool-card"><h2>📉 Markdown Calculator</h2><div class="inputGroup"><input type="number" id="a" value="100" placeholder="Cost"><input type="number" id="b" value="25" placeholder="Markdown %"></div><button class="btnCalc btnDanger" id="calcBtn"><i class="fas fa-minus"></i> Markdown</button><div class="resultArea">Selling: $<span id="result">75.00</span></div><div class="smallText">Loss: $<span id="diff">25.00</span></div></div>`,
      calc: () => { let c=parseFloat(document.getElementById('a').value)||0, p=parseFloat(document.getElementById('b').value)||0, loss=(p/100)*c, res=c-loss; document.getElementById('result').innerText=res.toFixed(2); document.getElementById('diff').innerText=loss.toFixed(2); addToHistory('Markdown', `$${c} - ${p}%`, `$${res.toFixed(2)}`); } },
    // 13: Profit Margin
    { html: `<div class="tool-card"><h2>💹 Profit Margin</h2><div class="inputGroup"><input type="number" id="a" value="100" placeholder="Cost"><input type="number" id="b" value="125" placeholder="Price"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">Profit: $<span id="diff">25.00</span></div><div class="smallText">Margin: <span id="result">20.00</span>%</div></div>`,
      calc: () => { let c=parseFloat(document.getElementById('a').value)||0, p=parseFloat(document.getElementById('b').value)||0, profit=p-c, margin=profit===0?0:(profit/p)*100; document.getElementById('result').innerText=margin.toFixed(2); document.getElementById('diff').innerText=profit.toFixed(2); addToHistory('Profit Margin', `Cost $${c}, Price $${p}`, `${margin.toFixed(2)}% margin`); } },
    // 14: ROI
    { html: `<div class="tool-card"><h2>💵 ROI Calculator</h2><div class="inputGroup"><input type="number" id="a" value="1000" placeholder="Investment"><input type="number" id="b" value="1200" placeholder="Return"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">ROI: <span id="result">20.00</span>%</div></div>`,
      calc: () => { let inv=parseFloat(document.getElementById('a').value)||0, ret=parseFloat(document.getElementById('b').value)||0, roi=((ret-inv)/inv)*100; document.getElementById('result').innerText=roi.toFixed(2); addToHistory('ROI', `$${inv} to $${ret}`, `${roi.toFixed(2)}%`); } },
    // 15: CAGR
    { html: `<div class="tool-card"><h2>📊 CAGR Calculator</h2><div class="inputGroup"><input type="number" id="a" value="1000" placeholder="Start"><input type="number" id="b" value="2000" placeholder="End"><input type="number" id="c" value="5" placeholder="Years"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">CAGR: <span id="result">14.87</span>%</div></div>`,
      calc: () => { let s=parseFloat(document.getElementById('a').value)||0, e=parseFloat(document.getElementById('b').value)||0, y=parseFloat(document.getElementById('c').value)||1, cagr=(Math.pow(e/s,1/y)-1)*100; document.getElementById('result').innerText=cagr.toFixed(2); addToHistory('CAGR', `$${s} to $${e} in ${y}y`, `${cagr.toFixed(2)}%`); } },
    // 16: Salary Increase
    { html: `<div class="tool-card"><h2>💼 Salary Increase</h2><div class="inputGroup"><input type="number" id="a" value="50000" placeholder="Current"><input type="number" id="b" value="10" placeholder="% per year"><input type="number" id="c" value="5" placeholder="Years"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">Future: $<span id="result">80525.50</span></div><div class="smallText">Increase: $<span id="diff">30525.50</span></div></div>`,
      calc: () => { let c=parseFloat(document.getElementById('a').value)||0, r=parseFloat(document.getElementById('b').value)||0, y=parseFloat(document.getElementById('c').value)||1, f=c*Math.pow(1+(r/100),y), inc=f-c; document.getElementById('result').innerText=f.toFixed(2); document.getElementById('diff').innerText=inc.toFixed(2); addToHistory('Salary', `$${c} + ${r}% for ${y}y`, `$${f.toFixed(2)}`); } },
    // 17: EMI
    { html: `<div class="tool-card"><h2>🏦 EMI Calculator</h2><div class="inputGroup"><input type="number" id="a" value="10000" placeholder="Loan"><input type="number" id="b" value="10" placeholder="Rate %"><input type="number" id="c" value="12" placeholder="Months"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">EMI: $<span id="result">879.16</span>/month</div><div class="smallText">Interest: $<span id="diff">549.92</span></div></div>`,
      calc: () => { let l=parseFloat(document.getElementById('a').value)||0, r=parseFloat(document.getElementById('b').value)||0, m=parseFloat(document.getElementById('c').value)||1, mr=r/12/100, emi=mr===0?l/m:l*mr*Math.pow(1+mr,m)/(Math.pow(1+mr,m)-1); let total=emi*m, interest=total-l; document.getElementById('result').innerText=emi.toFixed(2); document.getElementById('diff').innerText=interest.toFixed(2); addToHistory('EMI', `$${l} @ ${r}% for ${m}m`, `$${emi.toFixed(2)}/month`); } },
    // 18: Home Loan
    { html: `<div class="tool-card"><h2>🏠 Home Loan EMI</h2><div class="inputGroup"><input type="number" id="a" value="5000000" placeholder="Amount"><input type="number" id="b" value="8.5" placeholder="Rate %"><input type="number" id="c" value="20" placeholder="Years"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">EMI: ₹<span id="result">43391.00</span>/month</div></div>`,
      calc: () => { let a=parseFloat(document.getElementById('a').value)||0, r=parseFloat(document.getElementById('b').value)||0, y=parseFloat(document.getElementById('c').value)||1, m=y*12, mr=r/12/100, emi=mr===0?a/m:a*mr*Math.pow(1+mr,m)/(Math.pow(1+mr,m)-1); document.getElementById('result').innerText=emi.toFixed(2); addToHistory('Home Loan', `₹${a} @ ${r}% for ${y}y`, `₹${emi.toFixed(2)}/month`); } },
    // 19: Car Loan
    { html: `<div class="tool-card"><h2>🚗 Car Loan EMI</h2><div class="inputGroup"><input type="number" id="a" value="1000000" placeholder="Amount"><input type="number" id="b" value="9" placeholder="Rate %"><input type="number" id="c" value="5" placeholder="Years"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">EMI: ₹<span id="result">20758.00</span>/month</div></div>`,
      calc: () => { let a=parseFloat(document.getElementById('a').value)||0, r=parseFloat(document.getElementById('b').value)||0, y=parseFloat(document.getElementById('c').value)||1, m=y*12, mr=r/12/100, emi=mr===0?a/m:a*mr*Math.pow(1+mr,m)/(Math.pow(1+mr,m)-1); document.getElementById('result').innerText=emi.toFixed(2); addToHistory('Car Loan', `₹${a} @ ${r}% for ${y}y`, `₹${emi.toFixed(2)}/month`); } },
    // 20: Education Loan
    { html: `<div class="tool-card"><h2>🎓 Education Loan EMI</h2><div class="inputGroup"><input type="number" id="a" value="1500000" placeholder="Amount"><input type="number" id="b" value="10" placeholder="Rate %"><input type="number" id="c" value="10" placeholder="Years"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">EMI: ₹<span id="result">19823.00</span>/month</div></div>`,
      calc: () => { let a=parseFloat(document.getElementById('a').value)||0, r=parseFloat(document.getElementById('b').value)||0, y=parseFloat(document.getElementById('c').value)||1, m=y*12, mr=r/12/100, emi=mr===0?a/m:a*mr*Math.pow(1+mr,m)/(Math.pow(1+mr,m)-1); document.getElementById('result').innerText=emi.toFixed(2); addToHistory('Education Loan', `₹${a} @ ${r}% for ${y}y`, `₹${emi.toFixed(2)}/month`); } },
    // 21: Personal Loan
    { html: `<div class="tool-card"><h2>💳 Personal Loan EMI</h2><div class="inputGroup"><input type="number" id="a" value="500000" placeholder="Amount"><input type="number" id="b" value="12" placeholder="Rate %"><input type="number" id="c" value="3" placeholder="Years"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">EMI: ₹<span id="result">16607.00</span>/month</div></div>`,
      calc: () => { let a=parseFloat(document.getElementById('a').value)||0, r=parseFloat(document.getElementById('b').value)||0, y=parseFloat(document.getElementById('c').value)||1, m=y*12, mr=r/12/100, emi=mr===0?a/m:a*mr*Math.pow(1+mr,m)/(Math.pow(1+mr,m)-1); document.getElementById('result').innerText=emi.toFixed(2); addToHistory('Personal Loan', `₹${a} @ ${r}% for ${y}y`, `₹${emi.toFixed(2)}/month`); } },
    // 22: Compound Interest
    { html: `<div class="tool-card"><h2>📈 Compound Interest</h2><div class="inputGroup"><input type="number" id="a" value="1000" placeholder="Principal"><input type="number" id="b" value="8" placeholder="Rate %"><input type="number" id="c" value="5" placeholder="Years"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">Future: $<span id="result">1469.33</span></div><div class="smallText">Interest: $<span id="diff">469.33</span></div></div>`,
      calc: () => { let p=parseFloat(document.getElementById('a').value)||0, r=parseFloat(document.getElementById('b').value)||0, y=parseFloat(document.getElementById('c').value)||1, f=p*Math.pow(1+(r/100),y), i=f-p; document.getElementById('result').innerText=f.toFixed(2); document.getElementById('diff').innerText=i.toFixed(2); addToHistory('Compound', `$${p} @ ${r}% for ${y}y`, `$${f.toFixed(2)}`); } },
    // 23: SIP
    { html: `<div class="tool-card"><h2>💰 SIP Calculator</h2><div class="inputGroup"><input type="number" id="a" value="5000" placeholder="Monthly"><input type="number" id="b" value="12" placeholder="Return %"><input type="number" id="c" value="10" placeholder="Years"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">Future: ₹<span id="result">1161697.00</span></div></div>`,
      calc: () => { let m=parseFloat(document.getElementById('a').value)||0, r=parseFloat(document.getElementById('b').value)||0, y=parseFloat(document.getElementById('c').value)||1, months=y*12, mr=r/12/100, f=m*((Math.pow(1+mr,months)-1)/mr)*(1+mr); document.getElementById('result').innerText=f.toFixed(2); addToHistory('SIP', `₹${m}/month @ ${r}% for ${y}y`, `₹${f.toFixed(2)}`); } },
    // 24: FD
    { html: `<div class="tool-card"><h2>🏦 FD Calculator</h2><div class="inputGroup"><input type="number" id="a" value="50000" placeholder="Principal"><input type="number" id="b" value="7" placeholder="Rate %"><input type="number" id="c" value="5" placeholder="Years"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">Maturity: ₹<span id="result">70127.00</span></div></div>`,
      calc: () => { let p=parseFloat(document.getElementById('a').value)||0, r=parseFloat(document.getElementById('b').value)||0, y=parseFloat(document.getElementById('c').value)||1, m=p*Math.pow(1+(r/100),y); document.getElementById('result').innerText=m.toFixed(2); addToHistory('FD', `₹${p} @ ${r}% for ${y}y`, `₹${m.toFixed(2)}`); } },
    // 25: RD
    { html: `<div class="tool-card"><h2>📅 RD Calculator</h2><div class="inputGroup"><input type="number" id="a" value="5000" placeholder="Monthly"><input type="number" id="b" value="7" placeholder="Rate %"><input type="number" id="c" value="5" placeholder="Years"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">Maturity: ₹<span id="result">359000.00</span></div></div>`,
      calc: () => { let m=parseFloat(document.getElementById('a').value)||0, r=parseFloat(document.getElementById('b').value)||0, y=parseFloat(document.getElementById('c').value)||1, months=y*12, mr=r/12/100, maturity=m*((Math.pow(1+mr,months)-1)/mr); document.getElementById('result').innerText=maturity.toFixed(2); addToHistory('RD', `₹${m}/month @ ${r}% for ${y}y`, `₹${maturity.toFixed(2)}`); } },
    // 26: BMI
    { html: `<div class="tool-card"><h2>❤️ BMI Calculator</h2><div class="inputGroup"><input type="number" id="a" value="70" placeholder="Weight (kg)"><input type="number" id="b" value="170" placeholder="Height (cm)"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">BMI: <span id="result">24.22</span></div><div class="smallText">Category: <span id="diff">Normal weight</span></div></div>`,
      calc: () => { let w=parseFloat(document.getElementById('a').value)||0, h=parseFloat(document.getElementById('b').value)||100, hm=h/100, bmi=w/(hm*hm), cat=bmi<18.5?'Underweight':bmi<25?'Normal weight':bmi<30?'Overweight':'Obese'; document.getElementById('result').innerText=bmi.toFixed(2); document.getElementById('diff').innerText=cat; addToHistory('BMI', `${w}kg, ${h}cm`, `${bmi.toFixed(2)} (${cat})`); } },
    // 27: Exam
    { html: `<div class="tool-card"><h2>🎓 Exam Percentage</h2><div class="inputGroup"><input type="number" id="a" value="85" placeholder="Obtained"><input type="number" id="b" value="100" placeholder="Total"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">Percentage: <span id="result">85.00</span>%</div><div class="smallText">Grade: <span id="diff">A</span></div></div>`,
      calc: () => { let o=parseFloat(document.getElementById('a').value)||0, t=parseFloat(document.getElementById('b').value)||1, pct=(o/t)*100, grade=pct>=90?'A+':pct>=80?'A':pct>=70?'B':pct>=60?'C':pct>=50?'D':'F'; document.getElementById('result').innerText=pct.toFixed(2); document.getElementById('diff').innerText=grade; addToHistory('Exam', `${o}/${t}`, `${pct.toFixed(2)}% (${grade})`); } },
    // 28: Fraction
    { html: `<div class="tool-card"><h2>🔢 Fraction to %</h2><div class="inputGroup"><input type="number" id="a" value="3" placeholder="Numerator"><span>/</span><input type="number" id="b" value="4" placeholder="Denominator"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">Percentage: <span id="result">75.00</span>%</div><div class="smallText">Decimal: <span id="diff">0.75</span></div></div>`,
      calc: () => { let n=parseFloat(document.getElementById('a').value)||0, d=parseFloat(document.getElementById('b').value)||1, pct=(n/d)*100, dec=n/d; document.getElementById('result').innerText=pct.toFixed(2); document.getElementById('diff').innerText=dec.toFixed(4); addToHistory('Fraction', `${n}/${d}`, `${pct.toFixed(2)}%`); } },
    // 29: Percentage Point
    { html: `<div class="tool-card"><h2>📍 Percentage Point</h2><div class="inputGroup"><input type="number" id="a" value="25" placeholder="First %"><span>to</span><input type="number" id="b" value="30" placeholder="Second %"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">Difference: <span id="result">5.00</span> pp</div></div>`,
      calc: () => { let f=parseFloat(document.getElementById('a').value)||0, s=parseFloat(document.getElementById('b').value)||0, diff=Math.abs(f-s); document.getElementById('result').innerText=diff.toFixed(2); addToHistory('Point Diff', `${f}% to ${s}%`, `${diff.toFixed(2)} pp`); } },
    // 30: Multiple %
    { html: `<div class="tool-card"><h2>🔁 Multiple Percentages</h2><div class="inputGroup"><input type="number" id="a" value="100" placeholder="Start"><span>+</span><input type="number" id="b" value="10" placeholder="First %"><span>then</span><input type="number" id="c" value="5" placeholder="Second %"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">Final: <span id="result">115.50</span></div></div>`,
      calc: () => { let s=parseFloat(document.getElementById('a').value)||0, f=parseFloat(document.getElementById('b').value)||0, sec=parseFloat(document.getElementById('c').value)||0, res=s*(1+f/100)*(1+sec/100); document.getElementById('result').innerText=res.toFixed(2); addToHistory('Multiple %', `${s} +${f}% then +${sec}%`, res.toFixed(2)); } },
    // 31: Range %
    { html: `<div class="tool-card"><h2>📊 Range Percentage</h2><div class="inputGroup"><input type="number" id="a" value="100" placeholder="Value"><span>between</span><input type="number" id="b" value="50" placeholder="Min"><span>and</span><input type="number" id="c" value="150" placeholder="Max"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">Percentage: <span id="result">50.00</span>%</div></div>`,
      calc: () => { let v=parseFloat(document.getElementById('a').value)||0, min=parseFloat(document.getElementById('b').value)||0, max=parseFloat(document.getElementById('c').value)||min+1, pct=((v-min)/(max-min))*100; document.getElementById('result').innerText=pct.toFixed(2); addToHistory('Range %', `${v} in [${min},${max}]`, `${pct.toFixed(2)}%`); } },
    // 32: Finder
    { html: `<div class="tool-card"><h2>🔍 Percentage Finder</h2><div class="inputGroup"><input type="number" id="a" value="75" placeholder="Target %"><span>between</span><input type="number" id="b" value="0" placeholder="Min"><span>and</span><input type="number" id="c" value="100" placeholder="Max"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">Value: <span id="result">75.00</span></div></div>`,
      calc: () => { let t=parseFloat(document.getElementById('a').value)||0, min=parseFloat(document.getElementById('b').value)||0, max=parseFloat(document.getElementById('c').value)||100, val=min+((t/100)*(max-min)); document.getElementById('result').innerText=val.toFixed(2); addToHistory('Finder', `${t}% between ${min} and ${max}`, val.toFixed(2)); } },
    // 33: Compare
    { html: `<div class="tool-card"><h2>⚖️ Compare Percentages</h2><div class="inputGroup"><input type="number" id="a" value="200" placeholder="Val1"><span>of</span><input type="number" id="b" value="25" placeholder="%1"><span>vs</span><input type="number" id="c" value="150" placeholder="Val2"><span>of</span><input type="number" id="d" value="30" placeholder="%2"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">Result1: <span id="r1">50.00</span> | Result2: <span id="r2">45.00</span></div><div class="smallText">Winner: <span id="winner">Result 1</span></div></div>`,
      calc: () => { let v1=parseFloat(document.getElementById('a').value)||0, p1=parseFloat(document.getElementById('b').value)||0, v2=parseFloat(document.getElementById('c').value)||0, p2=parseFloat(document.getElementById('d').value)||0, r1=(p1/100)*v1, r2=(p2/100)*v2; document.getElementById('r1').innerText=r1.toFixed(2); document.getElementById('r2').innerText=r2.toFixed(2); let winner=r1>r2?'Result 1':r2>r1?'Result 2':'Equal'; document.getElementById('winner').innerText=winner; addToHistory('Compare', `${p1}% of ${v1} vs ${p2}% of ${v2}`, winner); } },
    // 34: Profit/Loss
    { html: `<div class="tool-card"><h2>💸 Profit/Loss</h2><div class="inputGroup"><input type="number" id="a" value="100" placeholder="Cost Price"><input type="number" id="b" value="120" placeholder="Selling Price"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">Profit/Loss: $<span id="result">20.00</span></div><div class="smallText">Percentage: <span id="diff">16.67</span>%</div></div>`,
      calc: () => { let cp=parseFloat(document.getElementById('a').value)||0, sp=parseFloat(document.getElementById('b').value)||0, pl=sp-cp, pct=cp===0?0:(pl/cp)*100; document.getElementById('result').innerText=pl.toFixed(2); document.getElementById('diff').innerText=Math.abs(pct).toFixed(2)+'%'; addToHistory('Profit/Loss', `CP $${cp}, SP $${sp}`, pl>=0?`Profit $${pl}`:`Loss $${Math.abs(pl)}`); } },
    // 35: Simple Interest
    { html: `<div class="tool-card"><h2>💹 Simple Interest</h2><div class="inputGroup"><input type="number" id="a" value="10000" placeholder="Principal"><input type="number" id="b" value="10" placeholder="Rate %"><input type="number" id="c" value="5" placeholder="Years"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">Interest: $<span id="result">5000.00</span></div><div class="smallText">Total: $<span id="diff">15000.00</span></div></div>`,
      calc: () => { let p=parseFloat(document.getElementById('a').value)||0, r=parseFloat(document.getElementById('b').value)||0, y=parseFloat(document.getElementById('c').value)||1, si=(p*r*y)/100, total=p+si; document.getElementById('result').innerText=si.toFixed(2); document.getElementById('diff').innerText=total.toFixed(2); addToHistory('Simple Interest', `$${p} @ ${r}% for ${y}y`, `$${si.toFixed(2)} interest`); } },
    // 36: XIRR
    { html: `<div class="tool-card"><h2>📈 XIRR Calculator</h2><div class="inputGroup"><input type="number" id="a" value="1000" placeholder="Investment"><input type="number" id="b" value="2000" placeholder="Return"><input type="number" id="c" value="3" placeholder="Years"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">XIRR: <span id="result">26.00</span>%</div></div>`,
      calc: () => { let inv=parseFloat(document.getElementById('a').value)||0, ret=parseFloat(document.getElementById('b').value)||0, y=parseFloat(document.getElementById('c').value)||1, xirr=(Math.pow(ret/inv,1/y)-1)*100; document.getElementById('result').innerText=xirr.toFixed(2); addToHistory('XIRR', `$${inv} to $${ret} in ${y}y`, `${xirr.toFixed(2)}%`); } },
    // 37: Wealth Calculator
    { html: `<div class="tool-card"><h2>💰 Wealth Calculator</h2><div class="inputGroup"><input type="number" id="a" value="10000" placeholder="Monthly Investment"><input type="number" id="b" value="12" placeholder="Return %"><input type="number" id="c" value="20" placeholder="Years"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">Wealth: ₹<span id="result">9990000.00</span></div></div>`,
      calc: () => { let m=parseFloat(document.getElementById('a').value)||0, r=parseFloat(document.getElementById('b').value)||0, y=parseFloat(document.getElementById('c').value)||1, months=y*12, mr=r/12/100, wealth=m*((Math.pow(1+mr,months)-1)/mr)*(1+mr); document.getElementById('result').innerText=wealth.toFixed(2); addToHistory('Wealth', `₹${m}/month @ ${r}% for ${y}y`, `₹${wealth.toFixed(2)}`); } },
    // 38: Inflation
    { html: `<div class="tool-card"><h2>📊 Inflation Calculator</h2><div class="inputGroup"><input type="number" id="a" value="10000" placeholder="Amount"><input type="number" id="b" value="6" placeholder="Inflation %"><input type="number" id="c" value="10" placeholder="Years"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">Future Value: <span id="result">17908.48</span></div></div>`,
      calc: () => { let a=parseFloat(document.getElementById('a').value)||0, i=parseFloat(document.getElementById('b').value)||0, y=parseFloat(document.getElementById('c').value)||1, fv=a*Math.pow(1+(i/100),y); document.getElementById('result').innerText=fv.toFixed(2); addToHistory('Inflation', `$${a} @ ${i}% inflation for ${y}y`, `$${fv.toFixed(2)}`); } },
    // 39: Future Value
    { html: `<div class="tool-card"><h2>💵 Future Value</h2><div class="inputGroup"><input type="number" id="a" value="10000" placeholder="Present Value"><input type="number" id="b" value="10" placeholder="Rate %"><input type="number" id="c" value="5" placeholder="Years"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">Future Value: $<span id="result">16105.10</span></div></div>`,
      calc: () => { let pv=parseFloat(document.getElementById('a').value)||0, r=parseFloat(document.getElementById('b').value)||0, y=parseFloat(document.getElementById('c').value)||1, fv=pv*Math.pow(1+(r/100),y); document.getElementById('result').innerText=fv.toFixed(2); addToHistory('Future Value', `$${pv} @ ${r}% for ${y}y`, `$${fv.toFixed(2)}`); } },
    // 40: Present Value
    { html: `<div class="tool-card"><h2>📉 Present Value</h2><div class="inputGroup"><input type="number" id="a" value="16105" placeholder="Future Value"><input type="number" id="b" value="10" placeholder="Rate %"><input type="number" id="c" value="5" placeholder="Years"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">Present Value: $<span id="result">10000.00</span></div></div>`,
      calc: () => { let fv=parseFloat(document.getElementById('a').value)||0, r=parseFloat(document.getElementById('b').value)||0, y=parseFloat(document.getElementById('c').value)||1, pv=fv/Math.pow(1+(r/100),y); document.getElementById('result').innerText=pv.toFixed(2); addToHistory('Present Value', `$${fv} @ ${r}% discount for ${y}y`, `$${pv.toFixed(2)}`); } },
    // 41: Loan Balance
    { html: `<div class="tool-card"><h2>🏦 Loan Balance</h2><div class="inputGroup"><input type="number" id="a" value="100000" placeholder="Loan Amount"><input type="number" id="b" value="12" placeholder="Total Months"><input type="number" id="c" value="6" placeholder="Months Paid"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">Remaining Balance: $<span id="result">50000.00</span></div></div>`,
      calc: () => { let l=parseFloat(document.getElementById('a').value)||0, tm=parseFloat(document.getElementById('b').value)||1, mp=parseFloat(document.getElementById('c').value)||0, emi=l/tm, paid=emi*mp, balance=l-paid; document.getElementById('result').innerText=balance.toFixed(2); addToHistory('Loan Balance', `$${l} loan, ${mp}/${tm} months paid`, `$${balance.toFixed(2)}`); } },
    // 42: Credit Card Interest
    { html: `<div class="tool-card"><h2>💳 Credit Card Interest</h2><div class="inputGroup"><input type="number" id="a" value="50000" placeholder="Due Amount"><input type="number" id="b" value="36" placeholder="Annual %"><input type="number" id="c" value="30" placeholder="Days"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">Interest: ₹<span id="result">1479.45</span></div></div>`,
      calc: () => { let a=parseFloat(document.getElementById('a').value)||0, r=parseFloat(document.getElementById('b').value)||0, d=parseFloat(document.getElementById('c').value)||0, interest=a*(r/100)*(d/365); document.getElementById('result').innerText=interest.toFixed(2); addToHistory('CC Interest', `₹${a} @ ${r}% for ${d} days`, `₹${interest.toFixed(2)}`); } },
    // 43: Dividend Yield
    { html: `<div class="tool-card"><h2>📊 Dividend Yield</h2><div class="inputGroup"><input type="number" id="a" value="10" placeholder="Dividend/share"><input type="number" id="b" value="500" placeholder="Price/share"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">Dividend Yield: <span id="result">2.00</span>%</div></div>`,
      calc: () => { let d=parseFloat(document.getElementById('a').value)||0, p=parseFloat(document.getElementById('b').value)||1, yield=(d/p)*100; document.getElementById('result').innerText=yield.toFixed(2); addToHistory('Dividend Yield', `₹${d} dividend on ₹${p} share`, `${yield.toFixed(2)}%`); } },
    // 44: EPS
    { html: `<div class="tool-card"><h2>💹 Earnings Per Share</h2><div class="inputGroup"><input type="number" id="a" value="1000000" placeholder="Net Profit"><input type="number" id="b" value="100000" placeholder="Shares"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">EPS: ₹<span id="result">10.00</span></div></div>`,
      calc: () => { let profit=parseFloat(document.getElementById('a').value)||0, shares=parseFloat(document.getElementById('b').value)||1, eps=profit/shares; document.getElementById('result').innerText=eps.toFixed(2); addToHistory('EPS', `₹${profit} profit, ${shares} shares`, `₹${eps.toFixed(2)}`); } },
    // 45: P/E Ratio
    { html: `<div class="tool-card"><h2>📈 Price to Earnings</h2><div class="inputGroup"><input type="number" id="a" value="500" placeholder="Price/share"><input type="number" id="b" value="10" placeholder="EPS"></div><button class="btnCalc" id="calcBtn"><i class="fas fa-calculator"></i> Calculate</button><div class="resultArea">P/E Ratio: <span id="result">50.00</span></div></div>`,
      calc: () => { let price=parseFloat(document.getElementById('a').value)||0, eps=parseFloat(document.getElementById('b').value)||1, pe=price/eps; document.getElementById('result').innerText=pe.toFixed(2); addToHistory('P/E Ratio', `₹${price} price, ₹${eps} EPS`, `${pe.toFixed(2)}`); } }
];

let currentIndex = 0;

// ===== RENDER TOOL =====
function renderTool(index) {
    const tool = tools[index];
    if (!tool) return;
    
    const container = document.getElementById('toolContainer');
    container.innerHTML = tool.html;
    
    // Update checklist active state
    document.querySelectorAll('.checklist-item').forEach((el, i) => {
        el.classList.toggle('active', i === index);
    });
    
    if (index === 5) {
        const incBtn = document.getElementById('incBtn');
        const decBtn = document.getElementById('decBtn');
        if (incBtn) incBtn.onclick = tool.calcInc;
        if (decBtn) decBtn.onclick = tool.calcDec;
    } else {
        const calcBtn = document.getElementById('calcBtn');
        if (calcBtn) calcBtn.onclick = tool.calc;
        if (calcBtn && tool.calc) setTimeout(() => tool.calc(), 50);
    }
}

// ===== POPULATE DROPDOWN =====
function populateDropdown() {
    const menu = document.getElementById('toolMenu');
    if (!menu) return;
    
    const toolNames = [
        '1. Basic Percentage', '2. What Percent', '3. Percentage Change',
        '4. Increase by %', '5. Decrease by %', '6. Reverse %',
        '7. Discount', '8. Tax', '9. GST', '10. VAT',
        '11. Tip', '12. Markup', '13. Markdown', '14. Profit Margin',
        '15. ROI', '16. CAGR', '17. Salary Increase', '18. EMI',
        '19. Home Loan', '20. Car Loan', '21. Education Loan',
        '22. Personal Loan', '23. Compound Interest', '24. SIP',
        '25. FD', '26. RD', '27. BMI', '28. Exam %',
        '29. Fraction to %', '30. Percentage Point', '31. Multiple %',
        '32. Range %', '33. Finder', '34. Compare', '35. Profit/Loss',
        '36. Simple Interest', '37. XIRR', '38. Wealth', '39. Inflation',
        '40. Future Value', '41. Present Value', '42. Loan Balance',
        '43. Credit Card Interest', '44. Dividend Yield', '45. EPS',
        '46. P/E Ratio'
    ];
    
    menu.innerHTML = toolNames.map((name, i) => 
        `<option value="${i}">${name}</option>`
    ).join('');
}

// ===== SHARE =====
function shareTool(platform) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out this Advanced Percentage Calculator with 46+ tools!');
    let shareUrl = '';
    
    switch(platform) {
        case 'fb': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
        case 'tw': shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`; break;
        case 'wa': shareUrl = `https://wa.me/?text=${text}%20${url}`; break;
        case 'li': shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`; break;
        case 'copy':
            navigator.clipboard.writeText(window.location.href).then(() => {
                showToast('Link copied to clipboard! 📋');
            }).catch(() => {
                showToast('Failed to copy link');
            });
            return;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=500');
        recordShare(platform);
        showToast(`Shared on ${platform}! 🎉`);
    }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    // Populate dropdown
    populateDropdown();
    
    // Populate checklist
    initChecklist();
    
    // Init typewriter
    initTypewriter();
    
    // Tool menu change
    const menu = document.getElementById('toolMenu');
    if (menu) {
        menu.addEventListener('change', (e) => {
            currentIndex = parseInt(e.target.value);
            renderTool(currentIndex);
        });
    }
    
    // History actions
    document.getElementById('clearHistory')?.addEventListener('click', clearHistory);
    document.getElementById('exportCSV')?.addEventListener('click', exportHistory);
    document.getElementById('searchHistory')?.addEventListener('input', renderHistory);
    
    // Scroll buttons
    document.getElementById('scrollUp')?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.getElementById('scrollDown')?.addEventListener('click', () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    
    // Reactions
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-r');
            addReaction(type);
        });
    });
    
    // Share buttons
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.getAttribute('data-s');
            shareTool(platform);
        });
    });
    
    // Load stats from API
    fetchStats();
    
    // Update UI with local data
    updateStatsUI();
    
    // Render history
    renderHistory();
    
    // Render first tool
    renderTool(0);
    
    // Track view
    if (!sessionStorage.getItem('view_tracked')) {
        sessionStorage.setItem('view_tracked', 'true');
        // View is tracked via stats API on load
    }
});

// ===== EXPOSE GLOBALLY =====
window.showToast = showToast;
window.addReaction = addReaction;
window.shareTool = shareTool;
window.renderTool = renderTool;
window.clearHistory = clearHistory;
window.exportHistory = exportHistory;
