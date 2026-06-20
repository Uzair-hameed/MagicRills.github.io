/* ============================================
   MORNING ASSEMBLY ROSTER GENERATOR
   Cloudflare Workers API Integration
   API: https://magicrills-api.uzairhameed01.workers.dev
   ============================================ */

const TOOL_SLUG = 'morning-assembly-roster-generator';
const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';

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
const REACTION_TYPES = ['like', 'love', 'wow', 'sad', 'laugh', 'celebrate'];
const STORAGE_KEY = 'morning_assembly_data';

// ============================================
// CLOUDFLARE API CALLS
// ============================================
async function callAPI(endpoint, method = 'POST', data = null) {
    try {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' },
        };
        if (data) options.body = JSON.stringify(data);
        
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// LOCALSTORAGE FALLBACK
// ============================================
function getLocalData() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { usage: 0, reactions: {}, shares: 0, views: 0 };
    } catch { return { usage: 0, reactions: {}, shares: 0, views: 0 }; }
}

function setLocalData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { /* ignore */ }
}

// ============================================
// USAGE COUNTER
// ============================================
async function incrementUsage() {
    try {
        const result = await callAPI('/api/usage', 'POST', {
            tool_slug: TOOL_SLUG,
            user_id: currentUserId
        });
        
        if (result.success) {
            const count = result.usage || result.count || 0;
            updateUsageDisplay(count);
            return count;
        } else {
            // Fallback to localStorage
            const local = getLocalData();
            local.usage = (local.usage || 0) + 1;
            setLocalData(local);
            updateUsageDisplay(local.usage);
            return local.usage;
        }
    } catch (error) {
        // Fallback to localStorage
        const local = getLocalData();
        local.usage = (local.usage || 0) + 1;
        setLocalData(local);
        updateUsageDisplay(local.usage);
        return local.usage;
    }
}

function updateUsageDisplay(count) {
    document.getElementById('toolUsageCount').innerText = count;
    document.getElementById('globalUsageCount').innerText = count;
    document.getElementById('statUsage').innerText = count;
}

// ============================================
// GET TOOL STATS
// ============================================
async function getStats() {
    try {
        const result = await callAPI(`/api/stats?tool_slug=${TOOL_SLUG}`, 'GET');
        
        if (result.success) {
            const stats = result.stats || result;
            document.getElementById('statUsage').innerText = stats.usage || stats.total_usage || 0;
            document.getElementById('statViews').innerText = stats.views || stats.total_views || 0;
            document.getElementById('statReactions').innerText = stats.reactions || stats.total_reactions || 0;
            document.getElementById('statShares').innerText = stats.shares || stats.total_shares || 0;
            
            document.getElementById('globalUsageCount').innerText = stats.usage || stats.total_usage || 0;
            document.getElementById('globalShareCount').innerText = stats.shares || stats.total_shares || 0;
            
            // Update reactions if available
            if (stats.reaction_counts) {
                REACTION_TYPES.forEach(react => {
                    const count = stats.reaction_counts[react] || 0;
                    const span = document.querySelector(`.reaction[data-reaction="${react}"] .reaction-count`);
                    if (span) span.innerText = count;
                });
                const total = Object.values(stats.reaction_counts).reduce((a, b) => a + b, 0);
                document.getElementById('globalReactionCount').innerText = total;
                document.getElementById('statReactions').innerText = total;
            }
            return stats;
        } else {
            // Fallback to localStorage
            const local = getLocalData();
            document.getElementById('statUsage').innerText = local.usage || 0;
            document.getElementById('statViews').innerText = local.views || 0;
            document.getElementById('statReactions').innerText = Object.values(local.reactions || {}).reduce((a, b) => a + b, 0);
            document.getElementById('statShares').innerText = local.shares || 0;
            return local;
        }
    } catch (error) {
        // Fallback to localStorage
        const local = getLocalData();
        document.getElementById('statUsage').innerText = local.usage || 0;
        document.getElementById('statViews').innerText = local.views || 0;
        document.getElementById('statReactions').innerText = Object.values(local.reactions || {}).reduce((a, b) => a + b, 0);
        document.getElementById('statShares').innerText = local.shares || 0;
        return local;
    }
}

// ============================================
// REACTIONS
// ============================================
async function addReaction(reactionType) {
    try {
        const result = await callAPI('/api/reactions', 'POST', {
            tool_slug: TOOL_SLUG,
            emoji: reactionType,
            user_id: currentUserId
        });
        
        if (result.success) {
            showToast(`Thanks for your ${reactionType} reaction! ❤️`, 'success');
            getStats(); // Refresh stats
        } else if (result.already_reacted) {
            showToast('You already reacted with this emoji! 😊', 'warning');
        } else {
            // Fallback: update localStorage
            const local = getLocalData();
            if (!local.reactions) local.reactions = {};
            local.reactions[reactionType] = (local.reactions[reactionType] || 0) + 1;
            setLocalData(local);
            const span = document.querySelector(`.reaction[data-reaction="${reactionType}"] .reaction-count`);
            if (span) span.innerText = local.reactions[reactionType];
            showToast(`Thanks for your ${reactionType} reaction! ❤️`, 'success');
        }
    } catch (error) {
        // Fallback: update localStorage
        const local = getLocalData();
        if (!local.reactions) local.reactions = {};
        local.reactions[reactionType] = (local.reactions[reactionType] || 0) + 1;
        setLocalData(local);
        const span = document.querySelector(`.reaction[data-reaction="${reactionType}"] .reaction-count`);
        if (span) span.innerText = local.reactions[reactionType];
        showToast(`Thanks for your ${reactionType} reaction! ❤️`, 'success');
    }
}

// ============================================
// SHARES
// ============================================
async function addShare(platform) {
    try {
        await callAPI('/api/shares', 'POST', {
            tool_slug: TOOL_SLUG,
            platform: platform,
            user_id: currentUserId
        });
        
        // Update share count in UI
        getStats();
    } catch (error) {
        // Fallback: update localStorage
        const local = getLocalData();
        local.shares = (local.shares || 0) + 1;
        setLocalData(local);
        document.getElementById('globalShareCount').innerText = local.shares;
        document.getElementById('statShares').innerText = local.shares;
    }
}

// ============================================
// AI QUOTE GENERATION
// ============================================
async function generateAIQuote() {
    const theme = document.getElementById('theme').value;
    const quoteText = document.getElementById('aiQuoteText');
    const quoteAuthor = document.getElementById('aiQuoteAuthor');
    
    quoteText.innerHTML = '<div class="spinner" style="width:20px;height:20px;display:inline-block;"></div> Generating...';
    
    try {
        const result = await callAPI('/api/generate-quote', 'POST', {
            prompt: theme,
            topic: theme,
            category: 'education'
        });
        
        if (result.success && result.quote) {
            quoteText.innerHTML = `"${result.quote}"`;
            quoteAuthor.innerHTML = `- ${result.author || 'AI Assistant'}`;
        } else {
            // Fallback quotes
            const fallbackQuotes = [
                { quote: 'Education is the most powerful weapon which you can use to change the world.', author: 'Nelson Mandela' },
                { quote: 'The beautiful thing about learning is that nobody can take it away from you.', author: 'B.B. King' },
                { quote: 'Education is not preparation for life; education is life itself.', author: 'John Dewey' },
                { quote: 'Knowledge is power. Information is liberating. Education is the premise of progress.', author: 'Kofi Annan' }
            ];
            const selected = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
            quoteText.innerHTML = `"${selected.quote}"`;
            quoteAuthor.innerHTML = `- ${selected.author}`;
        }
    } catch (error) {
        // Fallback
        quoteText.innerHTML = `"Education is the most powerful weapon which you can use to change the world."`;
        quoteAuthor.innerHTML = `- Nelson Mandela`;
    }
}

// ============================================
// GENERATE WEEKLY PLAN
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
    
    // Increment usage
    await incrementUsage();
    
    try {
        for (let i = 0; i < WEEK_DAYS.length; i++) {
            const day = WEEK_DAYS[i];
            const group = GROUP_ROTATION[i];
            
            // Define activities
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
            
            // Generate content for each activity
            for (let act of activities) {
                try {
                    const result = await callAPI('/api/generate-quote', 'POST', {
                        prompt: `${theme} - ${act.name} for Grade ${grade} Group ${group}`,
                        topic: theme,
                        category: 'education'
                    });
                    
                    if (result.success && result.quote) {
                        act.content = result.quote;
                    } else {
                        act.content = getFallbackContent(act.type, theme);
                    }
                } catch (e) {
                    act.content = getFallbackContent(act.type, theme);
                }
                // Small delay to avoid rate limiting
                await new Promise(r => setTimeout(r, 200));
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

// Fallback content
function getFallbackContent(type, theme) {
    const fallbacks = {
        quran: `"Indeed, Allah is with those who are patient." (Quran 2:153)\n\nUrdu: "بے شک اللہ صبر کرنے والوں کے ساتھ ہے۔"\n\n💡 ${theme} ke liye sabr aur imaan zaroori hai.`,
        naat: `Ya Nabi Salamun Alaika 🌹\nYa Rasool Salamun Alaika\nYa Habib Salamun Alaika\nSalawat Ullah Alaika`,
        hadith: `RasoolAllah (PBUH) ne farmaya: "Taharat iman ka aadha hissa hai."\n\nSabak: ${theme} ke liye pak saaf rehna zaroori hai.`,
        national: `Pakistan Zindabad! 🇵🇰\nپاکستان زندہ باد!`,
        thought: `💭 "${theme} insani zindagi ki buniyad hai. Jo log is par amal karte hain, woh dunya aur aakhirat mein kamyab hote hain."`,
        speech: `🎤 Muhtaram Ustadan aur Piyare Bacho!\n\nAssalam-o-Alaikum!\n\nAaj ki assembly ka mozu "${theme}" hai. Yeh bohat ahem mozu hai. ${theme} se hamari zindagi behtar hoti hai...`,
        announcement: `📢 Important Announcements:\n1. Tomorrow's schedule will be as per Friday.\n2. All students must wear complete uniform.\n3. Parents' meeting on Saturday.`,
        dua: `🤲 "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina azaban-nar."\n\nUrdu: "اے ہمارے رب! ہمیں دنیا میں بھی بھلائی دے اور آخرت میں بھی بھلائی دے۔"`
    };
    return fallbacks[type] || fallbacks.thought;
}

// Toggle content visibility
window.toggleContent = function(dayId, idx) {
    const contentDiv = document.getElementById(`content-${dayId}-${idx}`);
    const btn = contentDiv.previousElementSibling?.querySelector('.toggle-btn');
    
    if (contentDiv) {
        if (contentDiv.style.display === 'none' || contentDiv.style.display === '') {
            contentDiv.style.display = 'block';
            if (btn) btn.innerHTML = '<i class="fas fa-chevron-up"></i> Hide Content';
        } else {
            contentDiv.style.display = 'none';
            if (btn) btn.innerHTML = '<i class="fas fa-chevron-down"></i> Show Content';
        }
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
    if (!win) {
        showToast('Please allow popups for printing', 'warning');
        return;
    }
    
    win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Weekly Plan - Grade ${grade}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Inter', Arial, sans-serif; margin: 30px; background: white; }
                h1 { color: #2e7d32; text-align: center; font-size: 28px; }
                .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #4caf50; }
                .header p { margin: 5px 0; color: #4a5568; }
                .week-day-card { margin-bottom: 30px; border: 1px solid #ddd; border-radius: 10px; page-break-inside: avoid; }
                .day-header { background: #4caf50; color: white; padding: 12px 16px; display: flex; justify-content: space-between; flex-wrap: wrap; }
                .day-activities { padding: 15px; }
                .activity-row { padding: 8px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 5px; }
                .activity-name { font-weight: 600; flex: 2; }
                .activity-lead { color: #2196f3; flex: 1; }
                .activity-time { color: #ff9800; font-weight: 600; }
                .activity-content { padding: 12px; background: #f5f7fa; margin-top: 8px; border-radius: 8px; display: block !important; }
                .content-text { line-height: 1.7; white-space: pre-line; }
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
            <p style="text-align:center;margin-top:30px;color:#aaa;font-size:12px;">Generated by Morning Assembly Roster Generator | MagicRills.com</p>
        </body>
        </html>
    `);
    win.document.close();
    setTimeout(() => win.print(), 500);
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
    // Reset all to not_started except completed ones
    for (let g in classStatus) {
        if (classStatus[g] !== 'completed') {
            classStatus[g] = 'not_started';
        }
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
// TYPEWRITER ANIMATION
// ============================================
function initTypewriter() {
    const phrases = [
        'Weekly Roster',
        'Group Rotation',
        'Assembly Planner',
        'School Tool',
        'Pakistani Schools'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const element = document.getElementById('typewriterText');
    
    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            element.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let delay = isDeleting ? 30 : 80;
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = 500;
        }
        
        setTimeout(typeEffect, delay);
    }
    
    typeEffect();
}

// ============================================
// UI HELPERS
// ============================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'warning' ? 'fa-exclamation-triangle' : 
                 type === 'error' ? 'fa-times-circle' : 'fa-info-circle';
    const color = type === 'success' ? '#4caf50' : 
                  type === 'warning' ? '#ff9800' : 
                  type === 'error' ? '#f44336' : '#2196f3';
    toast.innerHTML = `<i class="fas ${icon}" style="color:${color};margin-right:10px;"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// SHARE FUNCTIONS
// ============================================
function shareFB() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
    addShare('facebook');
}
function shareTW() {
    window.open(`https://twitter.com/intent/tweet?text=Morning%20Assembly%20Roster%20Generator%20for%20Pakistani%20Schools&url=${encodeURIComponent(window.location.href)}`, '_blank');
    addShare('twitter');
}
function shareWA() {
    window.open(`https://wa.me/?text=${encodeURIComponent('Morning Assembly Roster Generator - ' + window.location.href)}`, '_blank');
    addShare('whatsapp');
}
function shareLI() {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
    addShare('linkedin');
}
function shareEmail() {
    window.location.href = `mailto:?subject=Morning%20Assembly%20Roster%20Generator&body=${encodeURIComponent('Check out this Morning Assembly Roster Generator for Pakistani schools: ' + window.location.href)}`;
    addShare('email');
}
function copyURL() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('URL copied to clipboard!', 'success');
        addShare('copy');
    }).catch(() => {
        // Fallback
        const input = document.createElement('input');
        input.value = window.location.href;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        showToast('URL copied!', 'success');
        addShare('copy');
    });
}

// ============================================
// SCROLL BUTTONS
// ============================================
function initScroll() {
    const up = document.getElementById('scrollUpBtn');
    const down = document.getElementById('scrollDownBtn');
    
    window.addEventListener('scroll', () => {
        up.classList.toggle('visible', window.scrollY > 300);
        down.classList.toggle('visible', window.innerHeight + window.scrollY < document.body.scrollHeight - 100);
    });
    
    up.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    down.onclick = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// ============================================
// DARK MODE
// ============================================
function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    const moon = toggle.querySelector('.fa-moon');
    const sun = toggle.querySelector('.fa-sun');
    
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark');
        moon.style.display = 'none';
        sun.style.display = 'inline';
    }
    
    toggle.onclick = () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('darkMode', isDark);
        moon.style.display = isDark ? 'none' : 'inline';
        sun.style.display = isDark ? 'inline' : 'none';
    };
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    // Set default date
    document.getElementById('startDate').value = new Date().toISOString().split('T')[0];
    
    // Initialize class status
    updateClassStatusGrid();
    
    // Load stats
    await getStats();
    
    // Increment usage on load
    await incrementUsage();
    
    // Typewriter
    initTypewriter();
    
    // Event listeners
    document.getElementById('generateWeeklyPlanBtn').onclick = generateWeeklyPlan;
    document.getElementById('printPlanBtn').onclick = printPlan;
    document.getElementById('completeClassBtn').onclick = completeCurrentClass;
    document.getElementById('generateQuoteBtn').onclick = generateAIQuote;
    
    // Reaction listeners
    document.querySelectorAll('.reaction').forEach(el => {
        el.onclick = () => addReaction(el.dataset.reaction);
        el.onkeydown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                addReaction(el.dataset.reaction);
            }
        };
    });
    
    // Share listeners
    document.querySelector('.share-btn.fb')?.addEventListener('click', shareFB);
    document.querySelector('.share-btn.tw')?.addEventListener('click', shareTW);
    document.querySelector('.share-btn.wa')?.addEventListener('click', shareWA);
    document.querySelector('.share-btn.li')?.addEventListener('click', shareLI);
    document.querySelector('.share-btn.em')?.addEventListener('click', shareEmail);
    document.querySelector('.share-btn.cp')?.addEventListener('click', copyURL);
    
    // Scroll and dark mode
    initScroll();
    initDarkMode();
    
    // Generate initial quote
    generateAIQuote();
    
    showToast('✨ Ready! Select grade and generate weekly plan', 'info');
});

// ============================================
// SERVICE WORKER REGISTRATION (Optional PWA)
// ============================================
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
}
