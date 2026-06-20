// ========================================
// Civil Servant Leave Rules 1986 Dashboard
// Complete JavaScript with Cloudflare Workers API
// ========================================

// ========================================
// CONFIGURATION
// ========================================
const TOOL_SLUG = 'civil-servant-leave-rules';
const TOOL_NAME = 'Civil Servant Leave Rules 1986';
const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';

// User ID for tracking
let userId = localStorage.getItem('userId');
if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
}

// Favorites array
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Reminders array
let reminders = JSON.parse(localStorage.getItem('reminders')) || [];

// Font size preference
let fontSize = parseInt(localStorage.getItem('fontSize')) || 16;
document.body.style.fontSize = fontSize + 'px';

// ========================================
// TOAST & LOADING FUNCTIONS
// ========================================

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.toggle('active', show);
    }
}

// ========================================
// CLOUDFLARE WORKERS API FUNCTIONS
// ========================================

async function apiCall(endpoint, method = 'GET', data = null) {
    const url = `${API_BASE}${endpoint}`;
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'X-User-ID': userId,
        }
    };
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return { success: true, data: result };
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: error.message };
    }
}

// 1. POST /api/usage - Usage Counter Increment
async function incrementUsage() {
    try {
        const response = await apiCall('/api/usage', 'POST', {
            tool_slug: TOOL_SLUG,
            tool_name: TOOL_NAME,
            user_id: userId
        });
        
        if (response.success && response.data) {
            const count = response.data.total_usage || 0;
            document.getElementById('totalUsageCount').innerText = count;
            document.getElementById('globalUsageCount').innerText = response.data.total_global || count;
            localStorage.setItem(`${TOOL_SLUG}_usage`, count);
            return count;
        }
    } catch (e) {
        console.log('API usage increment failed, using localStorage fallback');
    }
    
    // Fallback: LocalStorage
    let localCount = parseInt(localStorage.getItem(`${TOOL_SLUG}_usage`) || 0) + 1;
    localStorage.setItem(`${TOOL_SLUG}_usage`, localCount);
    document.getElementById('totalUsageCount').innerText = localCount;
    return localCount;
}

// 2. POST /api/reactions - Add/Get Reactions
async function getReactions() {
    try {
        const response = await apiCall('/api/reactions', 'POST', {
            tool_slug: TOOL_SLUG,
            action: 'get'
        });
        
        if (response.success && response.data) {
            const reactions = response.data.reactions || {};
            document.getElementById('reactionLike').innerText = reactions.like || 0;
            document.getElementById('reactionLove').innerText = reactions.love || 0;
            document.getElementById('reactionWow').innerText = reactions.wow || 0;
            document.getElementById('reactionSad').innerText = reactions.sad || 0;
            document.getElementById('reactionAngry').innerText = reactions.angry || 0;
            document.getElementById('reactionLaugh').innerText = reactions.laugh || 0;
            document.getElementById('reactionCelebrate').innerText = reactions.celebrate || 0;
            
            const total = Object.values(reactions).reduce((a, b) => a + b, 0);
            document.getElementById('totalReactionsCount').innerText = total;
            localStorage.setItem(`${TOOL_SLUG}_reactions`, JSON.stringify(reactions));
            return reactions;
        }
    } catch (e) {
        console.log('Get reactions failed, using localStorage fallback');
    }
    
    // Fallback: LocalStorage
    const reactions = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_reactions`)) || {};
    document.getElementById('reactionLike').innerText = reactions.like || 0;
    document.getElementById('reactionLove').innerText = reactions.love || 0;
    document.getElementById('reactionWow').innerText = reactions.wow || 0;
    document.getElementById('reactionSad').innerText = reactions.sad || 0;
    document.getElementById('reactionAngry').innerText = reactions.angry || 0;
    document.getElementById('reactionLaugh').innerText = reactions.laugh || 0;
    document.getElementById('reactionCelebrate').innerText = reactions.celebrate || 0;
    const total = Object.values(reactions).reduce((a, b) => a + b, 0);
    document.getElementById('totalReactionsCount').innerText = total;
    return reactions;
}

async function addReaction(emoji, reactionType) {
    showLoading(true);
    try {
        const response = await apiCall('/api/reactions', 'POST', {
            tool_slug: TOOL_SLUG,
            tool_name: TOOL_NAME,
            reaction_type: reactionType,
            emoji: emoji,
            user_id: userId,
            action: 'add'
        });
        
        if (response.success) {
            await getReactions();
            showToast(`Thanks for your ${reactionType} reaction! ❤️`, 'success');
            showLoading(false);
            return true;
        } else if (response.data && response.data.already_reacted) {
            showToast(`You already reacted with ${emoji}`, 'warning');
            showLoading(false);
            return false;
        }
    } catch (e) {
        console.log('Add reaction failed, using localStorage fallback');
    }
    
    // Fallback: LocalStorage
    let reactions = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_reactions`)) || {};
    let userReactions = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_user_reactions`)) || {};
    
    if (userReactions[reactionType]) {
        showToast(`You already reacted with ${emoji}`, 'warning');
        showLoading(false);
        return false;
    }
    
    userReactions[reactionType] = true;
    reactions[reactionType] = (reactions[reactionType] || 0) + 1;
    localStorage.setItem(`${TOOL_SLUG}_reactions`, JSON.stringify(reactions));
    localStorage.setItem(`${TOOL_SLUG}_user_reactions`, JSON.stringify(userReactions));
    await getReactions();
    showToast(`Thanks for your ${reactionType} reaction! ❤️`, 'success');
    showLoading(false);
    return true;
}

// 3. POST /api/shares - Record Shares
async function addShare(platform) {
    try {
        const response = await apiCall('/api/shares', 'POST', {
            tool_slug: TOOL_SLUG,
            tool_name: TOOL_NAME,
            platform: platform,
            user_id: userId
        });
        
        if (response.success) {
            const count = response.data.total_shares || 0;
            document.getElementById('shareCountDisplay').innerText = count;
            document.getElementById('totalSharesCount').innerText = count;
            localStorage.setItem(`${TOOL_SLUG}_shares`, count);
            showToast(`Shared on ${platform}! 🎉`, 'success');
            return count;
        }
    } catch (e) {
        console.log('Add share failed, using localStorage fallback');
    }
    
    // Fallback: LocalStorage
    let shareCount = parseInt(localStorage.getItem(`${TOOL_SLUG}_shares`) || 0) + 1;
    localStorage.setItem(`${TOOL_SLUG}_shares`, shareCount);
    document.getElementById('shareCountDisplay').innerText = shareCount;
    document.getElementById('totalSharesCount').innerText = shareCount;
    showToast(`Shared on ${platform}! 🎉`, 'success');
    return shareCount;
}

// 4. GET /api/stats?tool_slug=:slug - Get Tool Stats
async function getToolStats() {
    try {
        const response = await apiCall(`/api/stats?tool_slug=${TOOL_SLUG}`, 'GET');
        
        if (response.success && response.data) {
            const stats = response.data;
            document.getElementById('totalUsageCount').innerText = stats.usage || 0;
            document.getElementById('globalUsageCount').innerText = stats.views || 0;
            document.getElementById('totalReactionsCount').innerText = stats.reactions || 0;
            document.getElementById('totalSharesCount').innerText = stats.shares || 0;
            
            // Save to localStorage as fallback
            localStorage.setItem(`${TOOL_SLUG}_stats`, JSON.stringify(stats));
            return stats;
        }
    } catch (e) {
        console.log('Get stats failed, using localStorage fallback');
    }
    
    // Fallback: LocalStorage
    const stats = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_stats`)) || {};
    document.getElementById('totalUsageCount').innerText = stats.usage || localStorage.getItem(`${TOOL_SLUG}_usage`) || 0;
    document.getElementById('globalUsageCount').innerText = stats.views || 0;
    document.getElementById('totalReactionsCount').innerText = stats.reactions || 0;
    document.getElementById('totalSharesCount').innerText = stats.shares || localStorage.getItem(`${TOOL_SLUG}_shares`) || 0;
    return stats;
}

// ========================================
// LEAVE RULES DATA (18+ Complete Rules)
// ========================================
const leaveRules = {
    earnedLeave: {
        title: "Earned Leave (LAP)",
        icon: "fa-calendar-alt",
        badge: "primary",
        category: "Regular Leave",
        shortDesc: "Accrued leave based on service duration. 4 days/month for non-vacation depts. Max 120/180 days at once.",
        fullContent: `<div class="rule-content"><h3>📊 Earned Leave (LAP) - مکمل تفصیلات</h3><h4>🎯 حساب کتاب اور جمع ہونے کی شرح:</h4><ul><li><strong>غیر ویکیشن ڈیپارٹمنٹس:</strong> 4 دن فی کیلنڈر مہینہ</li><li><strong>ویکیشن ڈیپارٹمنٹس - مکمل ویکیشن:</strong> 1 دن فی کیلنڈر مہینہ</li><li><strong>ویکیشن ڈیپارٹمنٹس - جزوی ویکیشن:</strong> 1 دن فی مہینہ + غیر استعمال شدہ ویکیشن کا تناسب</li><li>جمع شدہ چھٹی کی کوئی زیادہ سے زیادہ حد نہیں</li></ul><h4>✅ گرانٹ کی زیادہ سے زیادہ مدت:</h4><ul><li><strong>بغیر میڈیکل سرٹیفکیٹ:</strong> 120 دن</li><li><strong>میڈیکل سرٹیفکیٹ کے ساتھ:</strong> 180 دن</li><li><strong>پوری سروس میں میڈیکل سرٹیفکیٹ پر کل:</strong> 365 دن</li></ul></div>`
    },
    halfPayLeave: {
        title: "Half Pay Leave (LHAP)",
        icon: "fa-chart-line",
        badge: "primary",
        category: "Regular Leave",
        shortDesc: "20 days per completed year of service. Two days half pay = one day full pay debit.",
        fullContent: `<div class="rule-content"><h3>📉 Half Pay Leave (LHAP)</h3><ul><li><strong>شرح:</strong> 20 دن فی مکمل سال سروس</li><li><strong>تبدیلی کا فارمولا:</strong> 2 دن ہاف پے = 1 دن فل پے ڈیبٹ</li><li><strong>زیادہ سے زیادہ ایک ساتھ:</strong> 120 دن</li><li>جب Earned Leave ختم ہو جائے تو دی جاتی ہے</li></ul></div>`
    },
    lprLeave: {
        title: "Leave Preparatory to Retirement",
        icon: "fa-calendar-check",
        badge: "success",
        category: "Financial Benefit",
        shortDesc: "Encash up to 365 days leave before retirement. Option available 15 months before superannuation.",
        fullContent: `<div class="rule-content"><h3>💰 Leave Preparatory to Retirement (LPR)</h3><ul><li><strong>اہلیت:</strong> ریٹائرمنٹ سے 15 ماہ پہلے یا 30 سال سروس مکمل ہونے پر</li><li><strong>زیادہ سے زیادہ انکیشمنٹ:</strong> 365 دن</li><li>صرف Senior Post Allowance شامل ہوگی</li><li>موت کی صورت میں خاندان کو باقی رقم ملے گی</li></ul></div>`
    },
    maternityLeave: {
        title: "Maternity Leave",
        icon: "fa-baby",
        badge: "success",
        category: "Special Benefit",
        shortDesc: "90 days full pay for female civil servants. Not debited from leave account.",
        fullContent: `<div class="rule-content"><h3>👶 Maternity Leave</h3><ul><li>خواتین سرکاری ملازمین کو <strong>90 دن</strong> کی میٹرنیٹی لیو فل پے پر</li><li>باقاعدہ لیو اکاؤنٹ سے ڈیبٹ نہیں ہوتی</li><li>90 دن سے زائد کی چھٹی دیگر لیو ٹائپس میں شمار ہوگی</li><li>میٹرنیٹی لیو کی درخواست میں وجوہات بتانے کی ضرورت نہیں</li></ul></div>`
    },
    specialLeave: {
        title: "Special Leave (Bereavement)",
        icon: "fa-heart",
        badge: "danger",
        category: "Emergency",
        shortDesc: "180 days full pay for female civil servants on death of husband.",
        fullContent: `<div class="rule-content"><h3>💔 Special Leave (Bereavement)</h3><ul><li>خواتین ملازمین کو شوہر کی وفات پر <strong>180 دن</strong> کی اسپیشل لیو فل پے پر</li><li>باقاعدہ لیو اکاؤنٹ سے ڈیبٹ نہیں ہوتی</li><li>ڈیتھ سرٹیفکیٹ جمع کرانا ضروری ہے</li></ul></div>`
    },
    disabilityLeave: {
        title: "Disability Leave",
        icon: "fa-wheelchair",
        badge: "warning",
        category: "Medical",
        shortDesc: "720 days max (180 full pay + 540 half pay) for work-related disability.",
        fullContent: `<div class="rule-content"><h3>🩺 Disability Leave</h3><ul><li><strong>کل زیادہ سے زیادہ مدت:</strong> 720 دن فی واقعہ</li><li><strong>فل پے پر:</strong> پہلے 180 دن</li><li><strong>ہاف پے پر:</strong> بقیہ 540 دن</li><li>معذوری کا ڈیوٹی سے تعلق ہونا ضروری ہے</li></ul></div>`
    },
    quarantineLeave: {
        title: "Quarantine Leave",
        icon: "fa-shield-virus",
        badge: "warning",
        category: "Medical",
        shortDesc: "As per medical officer recommendation. Not debited from leave account.",
        fullContent: `<div class="rule-content"><h3>🦠 Quarantine Leave</h3><ul><li>مجاز میڈیکل آفیسر کی تجویز کردہ مدت کے لیے</li><li>باقاعدہ لیو اکاؤنٹ سے ڈیبٹ نہیں ہوتی</li><li>اس چھٹی کے دوران ملازم ڈیوٹی پر تصور کیا جائے گا</li><li>مکمل تنخواہ دی جائے گی</li></ul></div>`
    },
    extraordinaryLeave: {
        title: "Extraordinary Leave (EOL)",
        icon: "fa-calendar-times",
        badge: "warning",
        category: "Special",
        shortDesc: "Without pay. Up to 5 years (10+ years service) or 2 years (less than 10 years).",
        fullContent: `<div class="rule-content"><h3>⏰ Extraordinary Leave</h3><ul><li>بغیر تنخواہ کی چھٹی</li><li>10+ سال سروس: زیادہ سے زیادہ 5 سال ایک ساتھ</li><li>10 سال سے کم سروس: زیادہ سے زیادہ 2 سال</li><li>صوابدیدی - منتظم کی مرضی</li></ul></div>`
    },
    leaveNotDue: {
        title: "Leave Not Due (LND)",
        icon: "fa-calendar-plus",
        badge: "danger",
        category: "Emergency",
        shortDesc: "Advance leave when no balance. Max 365 days service, 90 days first 5 years.",
        fullContent: `<div class="rule-content"><h3>📅 Leave Not Due</h3><ul><li>پوری سروس میں زیادہ سے زیادہ: 365 دن</li><li>پہلے 5 سال میں زیادہ سے زیادہ: 90 دن</li><li>شرط: ملازم کے ڈیوٹی پر واپس آنے کے امکانات ہوں</li></ul></div>`
    },
    recreationLeave: {
        title: "Recreation Leave",
        icon: "fa-umbrella-beach",
        badge: "primary",
        category: "Regular",
        shortDesc: "15 days leave (10 days debited). Available in non-vacation departments.",
        fullContent: `<div class="rule-content"><h3>🏖️ Recreation Leave</h3><ul><li>15 دن کی چھٹی، صرف 10 دن ڈیبٹ ہوتے ہیں</li><li>صرف غیر ویکیشن ڈیپارٹمنٹس میں دستیاب</li><li>پوری 15 دن ایک ساتھ لی جا سکتی ہے</li></ul></div>`
    },
    leaveExPakistan: {
        title: "Leave Ex-Pakistan",
        icon: "fa-plane",
        badge: "primary",
        category: "Regular",
        shortDesc: "Maximum 120 days at a time for leave spent outside Pakistan.",
        fullContent: `<div class="rule-content"><h3>✈️ Leave Ex-Pakistan</h3><ul><li>زیادہ سے زیادہ 120 دن ایک ساتھ</li><li>مکمل تنخواہ</li><li>قبل از وقت اجازت ضروری</li></ul></div>`
    },
    hospitalLeave: {
        title: "Hospital Leave",
        icon: "fa-hospital",
        badge: "warning",
        category: "Medical",
        shortDesc: "Medical treatment leave as per medical certificate.",
        fullContent: `<div class="rule-content"><h3>🏥 Hospital Leave</h3><ul><li>مقصد: طبی علاج</li><li>مدت: میڈیکل سرٹیفکیٹ کے مطابق</li><li>انکار نہیں کیا جا سکتا اگر میڈیکل طور پر ضروری ہو</li></ul></div>`
    },
    departmentalLeave: {
        title: "Departmental Leave",
        icon: "fa-building",
        badge: "primary",
        category: "Special",
        shortDesc: "Special leave for Survey of Pakistan employees, Grade 1-9.",
        fullContent: `<div class="rule-content"><h3>📐 Departmental Leave</h3><ul><li>دائرہ کار: صرف Survey of Pakistan</li><li>گریڈ: 1 سے 9</li><li>شرائط: محکمانہ قواعد کے مطابق</li></ul></div>`
    },
    seamanSickLeave: {
        title: "Sick Leave (Seaman)",
        icon: "fa-ship",
        badge: "warning",
        category: "Medical",
        shortDesc: "Maximum 45 days sick leave for government vessel employees.",
        fullContent: `<div class="rule-content"><h3>⚓ Sick Leave for Seamen</h3><ul><li>دائرہ کار: سرکاری بحری جہازوں پر کام کرنے والے</li><li>زیادہ سے زیادہ مدت: 45 دن</li><li>مکمل تنخواہ</li></ul></div>`
    },
    medicalCertificateLeave: {
        title: "Leave on Medical Certificate",
        icon: "fa-file-medical",
        badge: "warning",
        category: "Medical",
        shortDesc: "Cannot be refused. As per medical officer's recommendation.",
        fullContent: `<div class="rule-content"><h3>📋 Leave on Medical Certificate</h3><ul><li>میڈیکل سرٹیفکیٹ پیش کرنے پر چھٹی دی جائے گی</li><li>انکار نہیں کیا جا سکتا</li><li>واپسی پر فٹنس سرٹیفکیٹ درکار</li></ul></div>`
    },
    abolitionLeave: {
        title: "Leave on Abolition of Post",
        icon: "fa-building-circle-xmark",
        badge: "danger",
        category: "Emergency",
        shortDesc: "All due leave granted when post is abolished. Post extended for leave duration.",
        fullContent: `<div class="rule-content"><h3>🏢 Leave on Abolition of Post</h3><ul><li>جب عہدہ ختم کر دیا جائے تو تمام بقایا چھٹی دی جائے گی</li><li>عہدہ کی توسیع: چھٹی کی مدت کے لیے</li><li>حد: سپرینیویشن کی عمر تک</li></ul></div>`
    },
    studyLeave: {
        title: "Study Leave",
        icon: "fa-graduation-cap",
        badge: "success",
        category: "Special",
        shortDesc: "Maximum 2 years for higher education. Full pay first year, half pay second.",
        fullContent: `<div class="rule-content"><h3>🎓 Study Leave</h3><ul><li>زیادہ سے زیادہ مدت: 2 سال پوری سروس میں</li><li>پہلا سال: فل پے</li><li>دوسرا سال: ہاف پے</li><li>واپسی پر سروس کا بونڈ لازمی</li></ul></div>`
    },
    casualLeave: {
        title: "Casual Leave",
        icon: "fa-coffee",
        badge: "primary",
        category: "Regular",
        shortDesc: "10 days per year. Not accumulative.",
        fullContent: `<div class="rule-content"><h3>☕ Casual Leave</h3><ul><li>10 دن فی کیلنڈر سال</li><li>جمع نہیں ہوتی (اگلے سال منتقل نہیں)</li><li>قبل از وقت اجازت ضروری</li></ul></div>`
    }
};

// ========================================
// RENDER RULES GRID
// ========================================

function renderRulesGrid() {
    const grid = document.getElementById('rulesGrid');
    if (!grid) return;
    
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const filterBadge = document.getElementById('filterBadge')?.value || 'all';
    const sortBy = document.getElementById('sortRules')?.value || 'default';
    
    let rules = Object.entries(leaveRules).map(([key, rule]) => ({ key, ...rule }));
    
    if (searchTerm) {
        rules = rules.filter(r => 
            r.title.toLowerCase().includes(searchTerm) || 
            r.shortDesc.toLowerCase().includes(searchTerm)
        );
    }
    if (filterBadge !== 'all') {
        rules = rules.filter(r => r.badge === filterBadge);
    }
    if (sortBy === 'az') rules.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === 'za') rules.sort((a, b) => b.title.localeCompare(a.title));
    
    grid.innerHTML = rules.map(rule => `
        <div class="card" data-key="${rule.key}">
            <div class="card-header">
                <i class="fas ${rule.icon}"></i>
                <h3>${rule.title}</h3>
            </div>
            <div class="card-body">
                <p>${rule.shortDesc}</p>
            </div>
            <div class="card-footer">
                <span class="badge badge-${rule.badge}">${rule.category}</span>
                <button class="view-btn" onclick="openModal('${rule.key}')">View Details →</button>
            </div>
        </div>
    `).join('');
}

// ========================================
// MODAL FUNCTIONS
// ========================================

function openModal(key) {
    const rule = leaveRules[key];
    if (!rule) return;
    
    document.getElementById('modalTitle').innerText = rule.title;
    document.getElementById('modalBody').innerHTML = rule.fullContent;
    document.getElementById('ruleModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('ruleModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ========================================
// SHARE FUNCTIONS
// ========================================

function shareFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
    addShare('Facebook');
}

function shareTwitter() {
    window.open(`https://twitter.com/intent/tweet?text=Check%20out%20Civil%20Servant%20Leave%20Rules%201986%20Dashboard&url=${encodeURIComponent(window.location.href)}`, '_blank');
    addShare('Twitter');
}

function shareWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, '_blank');
    addShare('WhatsApp');
}

function shareLinkedIn() {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
    addShare('LinkedIn');
}

async function copyPageUrl() {
    try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('URL copied to clipboard! 📋', 'success');
        addShare('Copy');
    } catch (err) {
        showToast('Failed to copy URL', 'error');
    }
}

// ========================================
// THEME FUNCTIONS
// ========================================

function toggleDarkMode() {
    const body = document.body;
    const isDark = body.getAttribute('data-theme') === 'dark';
    body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    showToast(isDark ? 'Light mode activated ☀️' : 'Dark mode activated 🌙');
}

function toggleHighContrast() {
    const body = document.body;
    const isHC = body.getAttribute('data-theme') === 'high-contrast';
    body.setAttribute('data-theme', isHC ? (localStorage.getItem('theme') || 'light') : 'high-contrast');
    showToast(isHC ? 'High contrast mode off' : 'High contrast mode on 🔍');
}

function adjustFontSize() {
    fontSize = fontSize >= 20 ? 14 : fontSize + 2;
    document.body.style.fontSize = fontSize + 'px';
    localStorage.setItem('fontSize', fontSize);
    showToast(`Font size: ${fontSize}px 🔤`);
}

// ========================================
// SCROLL FUNCTIONS
// ========================================

function scrollUp() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollDown() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// ========================================
// CALCULATOR FUNCTION
// ========================================

function calculateLeave() {
    const years = parseInt(document.getElementById('calcServiceYears')?.value) || 0;
    const months = parseInt(document.getElementById('calcServiceMonths')?.value) || 0;
    const totalMonths = (years * 12) + months;
    const leaveType = document.getElementById('calcLeaveType')?.value || 'earned';
    const deptType = document.getElementById('calcDeptType')?.value || 'non-vacation';
    const medical = document.getElementById('calcMedical')?.value || 'no';

    let result = { days: 0, maxAtOnce: 0, notes: '' };

    switch(leaveType) {
        case 'earned':
            let rate = 4;
            if (deptType === 'vacation-full') rate = 1;
            else if (deptType === 'vacation-part') rate = 1.5;
            else if (deptType === 'vacation-none') rate = 4;
            result.days = Math.floor(totalMonths * rate);
            result.maxAtOnce = medical === 'yes' ? 180 : 120;
            result.notes = `Earned Leave accrues at ${rate} days/month. Total: ${result.days} days.`;
            break;
        case 'halfpay':
            result.days = years * 20;
            result.maxAtOnce = 120;
            result.notes = `Half Pay Leave: ${result.days} days. 2:1 commutation ratio.`;
            break;
        case 'lpr':
            result.days = Math.min(365, Math.floor(totalMonths * 4));
            result.maxAtOnce = 365;
            result.notes = `LPR: Up to 365 days encashment available.`;
            break;
        case 'maternity':
            result.days = 90;
            result.maxAtOnce = 90;
            result.notes = `Maternity Leave: 90 days full pay. Female civil servants only.`;
            break;
        case 'special':
            result.days = 180;
            result.maxAtOnce = 180;
            result.notes = `Special Leave: 180 days on husband's death. Female only.`;
            break;
        case 'disability':
            result.days = 720;
            result.maxAtOnce = 720;
            result.notes = `Disability Leave: 720 days total (180 full + 540 half pay).`;
            break;
        case 'quarantine':
            result.days = 'As per medical officer';
            result.maxAtOnce = 'Variable';
            result.notes = `Quarantine Leave: As per medical recommendation. Not debited.`;
            break;
        case 'extraordinary':
            result.days = years >= 10 ? 1825 : 730;
            result.maxAtOnce = years >= 10 ? 1825 : 730;
            result.notes = `Extraordinary Leave: Without pay. ${years >= 10 ? 'Up to 5 years' : 'Up to 2 years'}.`;
            break;
        case 'notdue':
            result.days = Math.min(365, Math.floor(totalMonths * 4));
            result.maxAtOnce = years < 5 ? Math.min(90, result.days) : result.days;
            result.notes = `Leave Not Due: Max 365 days service, 90 days in first 5 years.`;
            break;
        case 'recreation':
            result.days = 15;
            result.maxAtOnce = 15;
            result.notes = `Recreation Leave: 15 days (only 10 days debited).`;
            break;
        case 'expakistan':
            result.days = 120;
            result.maxAtOnce = 120;
            result.notes = `Leave Ex-Pakistan: Max 120 days at a time.`;
            break;
        case 'hospital':
            result.days = 'As per medical certificate';
            result.maxAtOnce = 'Variable';
            result.notes = `Hospital Leave: As per medical recommendation. Cannot be refused.`;
            break;
        case 'departmental':
            result.days = 'As per departmental rules';
            result.maxAtOnce = 'Variable';
            result.notes = `Departmental Leave: Special for Survey of Pakistan.`;
            break;
        case 'seaman':
            result.days = 45;
            result.maxAtOnce = 45;
            result.notes = `Sick Leave: Max 45 days for government vessel employees.`;
            break;
        case 'medicalcert':
            result.days = 'As per medical certificate';
            result.maxAtOnce = 'Variable';
            result.notes = `Leave on Medical Certificate: Cannot be refused.`;
            break;
        case 'abolition':
            result.days = 'All due leave';
            result.maxAtOnce = 'All accrued';
            result.notes = `Leave on Abolition of Post: All due leave granted.`;
            break;
        case 'study':
            result.days = 730;
            result.maxAtOnce = 730;
            result.notes = `Study Leave: Max 2 years. First year full pay, second half.`;
            break;
        case 'casual':
            result.days = 10;
            result.maxAtOnce = 10;
            result.notes = `Casual Leave: 10 days/year. Not accumulative.`;
            break;
        default:
            result.days = 0;
            result.notes = 'Select a leave type to calculate';
    }

    const resultDiv = document.getElementById('universalResult');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <h3><i class="fas fa-chart-line"></i> Calculation Result</h3>
            <p><strong>Leave Type:</strong> ${document.getElementById('calcLeaveType')?.options[document.getElementById('calcLeaveType')?.selectedIndex]?.text || 'N/A'}</p>
            <p><strong>Service:</strong> ${years} years ${months} months (${totalMonths} months)</p>
            <p><strong>Total Entitlement:</strong> ${result.days} ${typeof result.days === 'number' ? 'days' : ''}</p>
            <p><strong>Maximum at Once:</strong> ${result.maxAtOnce} ${typeof result.maxAtOnce === 'number' ? 'days' : ''}</p>
            <p><strong>Notes:</strong> ${result.notes}</p>
            <hr><p><small>Based on Civil Servant Leave Rules 1986 (Govt. of Pakistan)</small></p>
        `;
    }
}

// ========================================
// TYPEWRITER ANIMATION
// ========================================

function initTypewriter() {
    const element = document.getElementById('typewriterText');
    if (!element) return;
    
    const words = [
        '📋 18+ Leave Types',
        '📊 Smart Calculator',
        '📈 Live Dashboard',
        '🎯 Complete Guide',
        '🇵🇰 Govt. of Pakistan',
        '📅 Est. 1986'
    ];
    
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;
    
    function type() {
        if (isWaiting) return;
        
        const currentWord = words[wordIndex];
        const currentText = currentWord.substring(0, charIndex);
        element.textContent = currentText;
        
        if (!isDeleting && charIndex < currentWord.length) {
            charIndex++;
            setTimeout(type, 80 + Math.random() * 40);
        } else if (isDeleting && charIndex > 0) {
            charIndex--;
            setTimeout(type, 40 + Math.random() * 30);
        } else if (!isDeleting && charIndex === currentWord.length) {
            isWaiting = true;
            setTimeout(() => {
                isWaiting = false;
                isDeleting = true;
                type();
            }, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, 500);
        }
    }
    
    type();
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', async () => {
    // Load theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) document.body.setAttribute('data-theme', savedTheme);
    
    // Load stats from API
    await getToolStats();
    await getReactions();
    await incrementUsage();
    
    // Render rules
    renderRulesGrid();
    
    // Initialize typewriter animation
    initTypewriter();
    
    // Set share count
    const shares = localStorage.getItem(`${TOOL_SLUG}_shares`) || 0;
    document.getElementById('shareCountDisplay').innerText = shares;
    document.getElementById('totalSharesCount').innerText = shares;
    
    // ========================================
    // EVENT LISTENERS
    // ========================================
    
    // Search and filter
    document.getElementById('searchInput')?.addEventListener('input', renderRulesGrid);
    document.getElementById('filterBadge')?.addEventListener('change', renderRulesGrid);
    document.getElementById('sortRules')?.addEventListener('change', renderRulesGrid);
    
    // Theme buttons
    document.getElementById('darkModeToggle')?.addEventListener('click', toggleDarkMode);
    document.getElementById('highContrastToggle')?.addEventListener('click', toggleHighContrast);
    document.getElementById('fontSizeBtn')?.addEventListener('click', adjustFontSize);
    
    // Scroll buttons
    document.getElementById('scrollUpBtn')?.addEventListener('click', scrollUp);
    document.getElementById('scrollDownBtn')?.addEventListener('click', scrollDown);
    
    // Calculator
    document.getElementById('calculateUniversalBtn')?.addEventListener('click', calculateLeave);
    
    // Reactions
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const reaction = btn.dataset.reaction;
            const emojiMap = {
                like: '👍', love: '❤️', wow: '😮',
                sad: '😢', angry: '😠', laugh: '😂', celebrate: '🎉'
            };
            addReaction(emojiMap[reaction], reaction);
        });
    });
    
    // Share buttons
    document.querySelector('.share-btn.facebook')?.addEventListener('click', shareFacebook);
    document.querySelector('.share-btn.twitter')?.addEventListener('click', shareTwitter);
    document.querySelector('.share-btn.whatsapp')?.addEventListener('click', shareWhatsApp);
    document.querySelector('.share-btn.linkedin')?.addEventListener('click', shareLinkedIn);
    document.querySelector('.share-btn.copy-url')?.addEventListener('click', copyPageUrl);
    
    // Modal close
    document.querySelector('.close-btn')?.addEventListener('click', closeModal);
    document.getElementById('ruleModal')?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeModal();
    });
    
    showToast('Civil Servant Leave Rules 1986 Dashboard Loaded! 🎉', 'success');
});

// Global exports
window.openModal = openModal;
window.closeModal = closeModal;
window.calculateLeave = calculateLeave;
