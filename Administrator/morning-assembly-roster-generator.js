/* ============================================
   MORNING ASSEMBLY ROSTER GENERATOR
   Uses existing test-db.js endpoints
   Grok API, TiDB, Vercel - Fully Integrated
   ============================================ */

const TOOL_SLUG = 'morning-assembly-roster-generator';
let currentUserId = localStorage.getItem('user_id') || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
localStorage.setItem('user_id', currentUserId);

const WEEK_DAYS = [
    { name: 'Monday', key: 'monday' },
    { name: 'Tuesday', key: 'tuesday' },
    { name: 'Wednesday', key: 'wednesday' },
    { name: 'Thursday', key: 'thursday' },
    { name: 'Friday', key: 'friday' },
    { name: 'Saturday', key: 'saturday' }
];

const GROUP_ROTATION = ['A', 'B', 'C', 'D', 'A', 'B'];

// ============================================
// API CALLS (Using existing test-db.js endpoints)
// ============================================
async function callAPI(endpoint, method = 'GET', data = null) {
    try {
        const options = { method, headers: { 'Content-Type': 'application/json' } };
        if (data) options.body = JSON.stringify(data);
        const response = await fetch(`/api${endpoint}`, options);
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: error.message };
    }
}

// Usage Counter
async function incrementUsage() {
    const result = await callAPI('/increment-usage', 'POST', { tool_slug: TOOL_SLUG, user_id: currentUserId });
    if (result.success) {
        document.getElementById('toolUsageCount').innerText = result.total_usage || '0';
        document.getElementById('globalUsageCount').innerText = result.total_usage || '0';
    }
}

async function getUsage() {
    const result = await callAPI(`/usage?tool_slug=${TOOL_SLUG}`);
    if (result.success) {
        document.getElementById('toolUsageCount').innerText = result.count || '0';
        document.getElementById('globalUsageCount').innerText = result.count || '0';
    }
}

// Reactions
async function addReaction(reactionType) {
    const result = await callAPI('/add-reaction', 'POST', { 
        tool_slug: TOOL_SLUG, 
        emoji: reactionType, 
        user_id: currentUserId 
    });
    if (result.success) {
        showToast(`Thanks for your ${reactionType} reaction!`, 'success');
        getReactions();
    } else if (result.already_reacted) {
        showToast('You already reacted with this emoji!', 'warning');
    }
}

async function getReactions() {
    const result = await callAPI(`/reactions?tool_slug=${TOOL_SLUG}`);
    if (result.success && result.reactions) {
        const reactions = ['like', 'love', 'wow', 'sad', 'angry', 'laugh', 'celebrate'];
        let total = 0;
        reactions.forEach(react => {
            const count = result.reactions[react] || 0;
            total += count;
            const span = document.querySelector(`.reaction[data-reaction="${react}"] .reaction-count`);
            if (span) span.innerText = count;
        });
        document.getElementById('globalReactionCount').innerText = total;
    }
}

// Shares
async function addShare(platform) {
    await callAPI('/add-share', 'POST', { tool_slug: TOOL_SLUG, platform, user_id: currentUserId });
}

// AI Quote - Uses existing test-db.js /api/generate-quote endpoint
async function generateAIQuote() {
    const theme = document.getElementById('theme').value;
    const quoteText = document.getElementById('aiQuoteText');
    const quoteAuthor = document.getElementById('aiQuoteAuthor');
    
    quoteText.innerHTML = '<div class="spinner" style="width:20px;height:20px;"></div> Generating...';
    
    const result = await callAPI('/generate-quote', 'POST', { 
        prompt: theme, 
        topic: theme, 
        category: 'education' 
    });
    
    if (result.success && result.quote) {
        quoteText.innerHTML = `"${result.quote}"`;
        quoteAuthor.innerHTML = `- ${result.author || 'AI Assistant'}`;
    } else {
        // Fallback from test-db.js QUOTE_DATABASE
        quoteText.innerHTML = `"Education is the most powerful weapon which you can use to change the world."`;
        quoteAuthor.innerHTML = `- Nelson Mandela`;
    }
}

// ============================================
// GENERATE WEEKLY PLAN WITH CONTENT
// ============================================
async function generateWeeklyPlan() {
    const grade = document.getElementById('gradeSelect').value;
    const week = document.getElementById('weekSelect').value;
    const theme = document.getElementById('theme').value;
    
    if (!grade) {
        showToast('Please select a grade first', 'warning');
        return;
    }
    
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = 'flex';
    
    const container = document.getElementById('weeklyPlanContainer');
    container.innerHTML = '';
    
    // Increment usage when generating plan
    await incrementUsage();
    
    try {
        for (let i = 0; i < WEEK_DAYS.length; i++) {
            const day = WEEK_DAYS[i];
            const group = GROUP_ROTATION[i];
            
            // Define activities for this day
            const activities = [
                { order: 1, name: "📖 Recitation from Holy Quran", leadBy: "Student with good Tajweed", time: "4 min", type: "quran" },
                { order: 2, name: "🌹 Naat-e-Rasool-e-Maqbool", leadBy: "School Naat Khawan", time: "3 min", type: "naat" },
                { order: 3, name: "📚 Hadith of the Day", leadBy: "Islamic Studies Teacher", time: "3 min", type: "hadith" },
                { order: 4, name: "🇵🇰 Pakistani National Anthem", leadBy: "Whole Assembly", time: "1.5 min", type: "national" },
                { order: 5, name: "💭 Thought of the Day", leadBy: "Student Captain", time: "2 min", type: "thought" },
                { order: 6, name: "🎤 Speech on Theme", leadBy: "Head of Department", time: "5 min", type: "speech" },
                { order: 7, name: "📢 Announcements", leadBy: "Student Council President", time: "3 min", type: "announcement" },
                { order: 8, name: "🤲 Dua for Success", leadBy: "School Prefect", time: "2 min", type: "dua" }
            ];
            
            // Generate content for each activity using AI quote endpoint
            for (let act of activities) {
                const result = await callAPI('/generate-quote', 'POST', {
                    prompt: `${theme} - ${act.name} for Grade ${grade} Group ${group}`,
                    topic: theme,
                    category: 'education'
                });
                
                if (result.success && result.quote) {
                    act.content = result.quote;
                } else {
                    act.content = getFallbackContent(act.type, theme);
                }
                // Small delay to avoid rate limiting
                await new Promise(r => setTimeout(r, 300));
            }
            
            // Build day card
            const dayCard = document.createElement('div');
            dayCard.className = 'week-day-card';
            dayCard.innerHTML = `
                <div class="day-header">
                    <span><i class="fas fa-calendar-day"></i> ${day.name}</span>
                    <span><i class="fas fa-users"></i> Group ${group}</span>
                    <span><i class="fas fa-clock"></i> ${document.getElementById('totalTime').value} min</span>
                </div>
                <div class="day-activities" id="day-${day.key}">
                    ${activities.map((act, idx) => `
                        <div class="activity-row">
                            <span class="activity-name">${act.order}. ${act.name}</span>
                            <span class="activity-lead"><i class="fas fa-user-check"></i> ${act.leadBy}</span>
                            <span class="activity-time">${act.time}</span>
                            <button class="toggle-btn" onclick="toggleContent('day-${day.key}', ${idx})">
                                <i class="fas fa-chevron-down"></i> Show Content
                            </button>
                        </div>
                        <div id="content-day-${day.key}-${idx}" class="activity-content" style="display:none;">
                            <div class="content-text">${act.content || 'Content will be generated...'}</div>
                        </div>
                    `).join('')}
                </div>
            `;
            container.appendChild(dayCard);
        }
        
        showToast(`✅ Weekly plan generated for Grade ${grade}, Week ${week}!`, 'success');
        
    } catch (error) {
        console.error('Generation error:', error);
        showToast('Error generating plan. Please try again.', 'error');
    } finally {
        overlay.style.display = 'none';
    }
}

// Fallback content (matches test-db.js QUOTE_DATABASE)
function getFallbackContent(type, theme) {
    const fallbacks = {
        quran: `"Indeed, Allah is with those who are patient." (Quran 2:153)\n\nUrdu: "بے شک اللہ صبر کرنے والوں کے ساتھ ہے۔"\n\n💡 ${theme} ke liye sabr aur imaan zaroori hai.`,
        naat: `Ya Nabi Salamun Alaika 🌹\nYa Rasool Salamun Alaika\nYa Habib Salamun Alaika\nSalawat Ullah Alaika`,
        hadith: `RasoolAllah (PBUH) ne farmaya: "Taharat iman ka aadha hissa hai."\n\nSabak: ${theme} ke liye pak saaf rehna zaroori hai.`,
        national: `Pakistan Zindabad! 🇵🇰\n让我们一起为巴基斯坦的繁荣而努力。`,
        thought: `💭 "${theme} insani zindagi ki buniyad hai. Jo log is par amal karte hain, woh dunya aur aakhirat mein kamyab hote hain."`,
        speech: `🎤 Muhtaram Ustadan aur Piyare Bacho!\n\nAssalam-o-Alaikum!\n\nAaj ki assembly ka mozu "${theme}" hai. Yeh bohat ahem mozu hai. ${theme} se hamari zindagi behtar hoti hai...`,
        announcement: `📢 Important Announcements:\n1. Tomorrow's schedule will be as per Friday.\n2. All students must wear complete uniform.`,
        dua: `🤲 "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina azaban-nar."\n\nUrdu: "اے ہمارے رب! ہمیں دنیا میں بھی بھلائی دے اور آخرت میں بھی بھلائی دے۔"`
    };
    return fallbacks[type] || fallbacks.thought;
}

// Toggle content visibility
window.toggleContent = function(dayId, idx) {
    const contentDiv = document.getElementById(`content-${dayId}-${idx}`);
    const btn = contentDiv.previousElementSibling.querySelector('.toggle-btn');
    
    if (contentDiv.style.display === 'none') {
        contentDiv.style.display = 'block';
        btn.innerHTML = '<i class="fas fa-chevron-up"></i> Hide Content';
    } else {
        contentDiv.style.display = 'none';
        btn.innerHTML = '<i class="fas fa-chevron-down"></i> Show Content';
    }
};

// Print / PDF
function printPlan() {
    const printContent = document.getElementById('weeklyPlanContainer').innerHTML;
    const schoolName = document.getElementById('schoolName').value;
    const theme = document.getElementById('theme').value;
    const grade = document.getElementById('gradeSelect').value;
    const week = document.getElementById('weekSelect').value;
    
    const win = window.open('', '_blank');
    win.document.write(`
        <html>
        <head>
            <title>Weekly Plan - Grade ${grade}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 30px; }
                h1 { color: #2e7d32; text-align: center; }
                .header { text-align: center; margin-bottom: 30px; }
                .week-day-card { margin-bottom: 30px; border: 1px solid #ddd; border-radius: 10px; page-break-inside: avoid; }
                .day-header { background: #4caf50; color: white; padding: 12px; display: flex; justify-content: space-between; }
                .day-activities { padding: 15px; }
                .activity-row { padding: 8px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; }
                .activity-content { padding: 15px; background: #f5f5f5; margin-top: 10px; display: block !important; }
                .toggle-btn { display: none; }
                @media print { .week-day-card { break-inside: avoid; } }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Morning Assembly Weekly Plan</h1>
                <p><strong>School:</strong> ${schoolName}</p>
                <p><strong>Grade:</strong> ${grade} | <strong>Week:</strong> ${week}</p>
                <p><strong>Theme:</strong> ${theme}</p>
                <p><strong>Group Rotation:</strong> Mon→A, Tue→B, Wed→C, Thu→D, Fri→A, Sat→B</p>
            </div>
            ${printContent}
        </body>
        </html>
    `);
    win.document.close();
    win.print();
}

// ============================================
// CLASS STATUS MANAGEMENT
// ============================================
let classStatus = JSON.parse(localStorage.getItem('classStatus')) || {
    2: 'not_started', 3: 'not_started', 4: 'not_started', 5: 'not_started',
    6: 'not_started', 7: 'not_started', 8: 'not_started', 9: 'not_started', 10: 'not_started'
};

function updateClassStatusGrid() {
    const grid = document.getElementById('classStatusGrid');
    if (!grid) return;
    grid.innerHTML = '';
    for (let g = 2; g <= 10; g++) {
        const status = classStatus[g] || 'not_started';
        grid.innerHTML += `
            <div class="class-card ${status}" onclick="selectGrade(${g})">
                <i class="fas ${status === 'completed' ? 'fa-check-circle' : status === 'active' ? 'fa-play-circle' : 'fa-clock'}"></i>
                <span>Grade ${g}</span>
                <small>${status === 'completed' ? 'Done' : status === 'active' ? 'Active' : 'Pending'}</small>
            </div>
        `;
    }
}

window.selectGrade = function(grade) {
    document.getElementById('gradeSelect').value = grade;
    for (let g in classStatus) {
        classStatus[g] = classStatus[g] === 'completed' ? 'completed' : 'not_started';
    }
    classStatus[grade] = 'active';
    localStorage.setItem('classStatus', JSON.stringify(classStatus));
    updateClassStatusGrid();
    showToast(`Grade ${grade} selected`, 'info');
};

function completeCurrentClass() {
    const current = document.getElementById('gradeSelect').value;
    if (!current) { showToast('Select a grade first', 'warning'); return; }
    classStatus[current] = 'completed';
    localStorage.setItem('classStatus', JSON.stringify(classStatus));
    updateClassStatusGrid();
    const next = Object.keys(classStatus).find(g => classStatus[g] === 'not_started');
    if (next) {
        document.getElementById('gradeSelect').value = next;
        classStatus[next] = 'active';
        localStorage.setItem('classStatus', JSON.stringify(classStatus));
        updateClassStatusGrid();
        showToast(`Grade ${current} completed! Now Grade ${next}`, 'success');
    } else {
        showToast('🎉 All classes completed! Great job!', 'success');
    }
}

// ============================================
// UI HELPERS
// ============================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}" style="color:${type === 'success' ? '#4caf50' : '#2196f3'}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Share functions
function shareFB() { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank'); addShare('facebook'); }
function shareTW() { window.open(`https://twitter.com/intent/tweet?text=Morning Assembly Roster&url=${encodeURIComponent(window.location.href)}`, '_blank'); addShare('twitter'); }
function shareWA() { window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, '_blank'); addShare('whatsapp'); }
function shareLI() { window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank'); addShare('linkedin'); }
function shareEmail() { window.location.href = `mailto:?subject=Morning Assembly Roster&body=${encodeURIComponent(window.location.href)}`; addShare('email'); }
function copyURL() { navigator.clipboard.writeText(window.location.href); showToast('URL copied!', 'success'); addShare('copy'); }

// Scroll buttons
function initScroll() {
    const up = document.getElementById('scrollUpBtn'), down = document.getElementById('scrollDownBtn');
    window.addEventListener('scroll', () => {
        up.classList.toggle('visible', window.scrollY > 300);
        down.classList.toggle('visible', window.innerHeight + window.scrollY < document.body.scrollHeight - 100);
    });
    up.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    down.onclick = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    if (localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark');
    toggle.onclick = () => {
        document.body.classList.toggle('dark');
        localStorage.setItem('darkMode', document.body.classList.contains('dark'));
    };
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startDate').value = new Date().toISOString().split('T')[0];
    updateClassStatusGrid();
    getUsage();
    getReactions();
    
    document.getElementById('generateWeeklyPlanBtn').onclick = generateWeeklyPlan;
    document.getElementById('printPlanBtn').onclick = printPlan;
    document.getElementById('completeClassBtn').onclick = completeCurrentClass;
    document.getElementById('generateQuoteBtn').onclick = generateAIQuote;
    
    document.querySelectorAll('.reaction').forEach(el => {
        el.onclick = () => addReaction(el.dataset.reaction);
    });
    
    document.querySelector('.share-btn.fb')?.addEventListener('click', shareFB);
    document.querySelector('.share-btn.tw')?.addEventListener('click', shareTW);
    document.querySelector('.share-btn.wa')?.addEventListener('click', shareWA);
    document.querySelector('.share-btn.li')?.addEventListener('click', shareLI);
    document.querySelector('.share-btn.em')?.addEventListener('click', shareEmail);
    document.querySelector('.share-btn.cp')?.addEventListener('click', copyURL);
    
    initScroll();
    initDarkMode();
    
    showToast('✨ Ready! Select grade and generate weekly plan', 'info');
});
