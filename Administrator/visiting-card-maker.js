/**
 * ==============================================
 * VISITING CARD MAKER PRO - COMPLETE JAVASCRIPT
 * All Features | Cloudflare API | LocalStorage Fallback
 * ==============================================
 */

// ==============================================
// CONFIGURATION
// ==============================================
const CONFIG = {
    TOOL_NAME: 'Visiting Card Maker Pro',
    TOOL_SLUG: 'visiting-card-maker',
    API_BASE: 'https://magicrills-api.uzairhameed01.workers.dev',
    API_KEY: 'magicrills-grok-api.uzairhameed01.workers.dev',
    STORAGE_KEY: 'vcm_draft_v3',
    THEME_KEY: 'vcm_theme_v3',
    REACTIONS_KEY: 'vcm_reactions_v3',
    USER_KEY: 'vcm_user_id',
    LOCAL_USAGE_KEY: 'vcm_local_usage',
};

// ==============================================
// STATE MANAGEMENT
// ==============================================
const state = {
    usage: 0,
    reactions: { '👍': 0, '❤️': 0, '😮': 0, '😢': 0, '😂': 0, '🎉': 0, '🔥': 0 },
    shares: 0,
    isFlipped: false,
    rotation: 0,
    isDark: true,
    currentPanel: 'personal',
    zoomLevel: 1,
    isPremium: false,
    cardData: {},
    isLoading: false,
};

// ==============================================
// DOM REFS
// ==============================================
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const DOM = {
    toast: $('#toast'),
    loading: $('#loadingOverlay'),
    loadingFill: $('#loadingFill'),
    premiumModal: $('#premiumModal'),
    modalClose: $('#modalClose'),
    helpBtn: $('#helpBtn'),

    themeToggle: $('#themeToggle'),
    menuToggle: $('#menuToggle'),
    sidebar: $('#sidebar'),

    heroUsage: $('#heroUsage'),
    heroReactions: $('#heroReactions'),
    heroShares: $('#heroShares'),

    typewriter: $('#typewriterText'),

    startBtn: $('#startBtn'),
    templatesBtn: $('#templatesBtn'),
    homeNav: $('#homeNav'),
    backNav: $('#backNav'),

    sidebarItems: $$('.sidebar-item[data-panel]'),
    exportItems: $$('.sidebar-item[data-export]'),
    shareItems: $$('.sidebar-item[data-share]'),
    shareBtns: $$('.share-btn'),

    panels: $$('.panel'),

    // Personal
    fullName: $('#fullName'),
    jobTitle: $('#jobTitle'),
    company: $('#company'),
    email: $('#email'),
    phone: $('#phone'),
    phone2: $('#phone2'),
    address: $('#address'),
    website: $('#website'),
    social: $('#social'),
    tagline: $('#tagline'),

    // Style
    templateSelect: $('#templateSelect'),
    colorPalette: $('#colorPalette'),
    colorSwatches: $$('.color-swatch'),
    bgSelect: $('#bgSelect'),
    cornerRadius: $('#cornerRadius'),
    cornerRadiusVal: $('#cornerRadiusVal'),
    shadowIntensity: $('#shadowIntensity'),
    shadowIntensityVal: $('#shadowIntensityVal'),

    // Fonts
    nameFont: $('#nameFont'),
    nameSize: $('#nameSize'),
    nameSizeVal: $('#nameSizeVal'),
    nameWeight: $('#nameWeight'),
    titleFont: $('#titleFont'),
    titleSize: $('#titleSize'),
    titleSizeVal: $('#titleSizeVal'),
    titleWeight: $('#titleWeight'),
    alignBtns: $$('.align-btn'),
    textColor: $('#textColor'),
    textOpacity: $('#textOpacity'),
    textOpacityVal: $('#textOpacityVal'),

    // Images
    logoUpload: $('#logoUpload'),
    logoInput: $('#logoInput'),
    profileUpload: $('#profileUpload'),
    profileInput: $('#profileInput'),
    bgImageUpload: $('#bgImageUpload'),
    bgImageInput: $('#bgImageInput'),
    qrLink: $('#qrLink'),
    layoutOpts: $$('.layout-opt'),

    // Preview
    cardView: $('#cardView'),
    previewLogo: $('#previewLogo'),
    previewName: $('#previewName'),
    previewTitle: $('#previewTitle'),
    previewTagline: $('#previewTagline'),
    previewPhone: $('#previewPhone'),
    previewEmail: $('#previewEmail'),
    previewCompany: $('#previewCompany'),
    previewCompanyBack: $('#previewCompanyBack'),
    previewAddress: $('#previewAddress'),
    previewWebsite: $('#previewWebsite'),
    previewSocial: $('#previewSocial'),
    cardBody: $('#cardBody'),
    qrPlaceholder: $('#qrPlaceholder'),

    flipBtn: $('#flipBtn'),
    rotateBtn: $('#rotateBtn'),
    resetBtn: $('#resetBtn'),
    zoomInBtn: $('#zoomInBtn'),

    // Export
    expPdf: $('#expPdf'),
    expWord: $('#expWord'),
    expPng: $('#expPng'),
    expJpeg: $('#expJpeg'),
    expTxt: $('#expTxt'),

    // Reactions
    reactionPills: $$('.reaction-pill'),
    reactionCounts: {
        '👍': $('#r-👍'),
        '❤️': $('#r-❤️'),
        '😮': $('#r-😮'),
        '😢': $('#r-😢'),
        '😂': $('#r-😂'),
        '🎉': $('#r-🎉'),
        '🔥': $('#r-🔥'),
    },

    // Scroll
    scrollUp: $('#scrollUp'),
    scrollDown: $('#scrollDown'),

    // Hero Floating
    fcName: $('#fcName'),
    fcTitle: $('#fcTitle'),
    fcCompany: $('#fcCompany'),
};

// ==============================================
// USER ID
// ==============================================
function getUserId() {
    let id = localStorage.getItem(CONFIG.USER_KEY);
    if (!id) {
        id = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem(CONFIG.USER_KEY, id);
    }
    return id;
}

// ==============================================
// TOAST NOTIFICATIONS
// ==============================================
function showToast(message, type = 'info') {
    DOM.toast.textContent = message;
    DOM.toast.className = 'toast show ' + type;
    clearTimeout(DOM.toast._timer);
    DOM.toast._timer = setTimeout(() => {
        DOM.toast.classList.remove('show');
    }, 3500);
}

// ==============================================
// LOADING OVERLAY
// ==============================================
function showLoading(show, progress = 0) {
    DOM.loading.classList.toggle('active', show);
    if (DOM.loadingFill) {
        DOM.loadingFill.style.width = progress + '%';
    }
}

// ==============================================
// API SERVICE
// ==============================================
const API = {
    async request(endpoint, body = null) {
        const opts = {
            method: body ? 'POST' : 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': CONFIG.API_KEY,
            },
            mode: 'cors',
        };
        if (body) opts.body = JSON.stringify(body);

        try {
            const res = await fetch(CONFIG.API_BASE + endpoint, opts);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return await res.json();
        } catch (e) {
            console.warn('API Fallback:', e.message);
            return null;
        }
    },

    async incrementUsage() {
        const data = await this.request('/api/usage', {
            tool_slug: CONFIG.TOOL_SLUG,
            user_id: getUserId(),
        });
        if (data?.success) {
            state.usage = data.count || 0;
            this.updateUI();
        }
        return data;
    },

    async addReaction(emoji) {
        const data = await this.request('/api/reactions', {
            tool_slug: CONFIG.TOOL_SLUG,
            emoji: emoji,
            user_id: getUserId(),
        });
        if (data?.success && data.reactions) {
            state.reactions = data.reactions;
            this.updateUI();
        }
        return data;
    },

    async recordShare(platform) {
        const data = await this.request('/api/shares', {
            tool_slug: CONFIG.TOOL_SLUG,
            platform: platform,
            user_id: getUserId(),
        });
        if (data?.success) {
            state.shares = data.count || 0;
            this.updateUI();
        }
        return data;
    },

    async getStats() {
        const data = await this.request(`/api/stats?tool_slug=${CONFIG.TOOL_SLUG}`);
        if (data?.success) {
            state.usage = data.usage || 0;
            state.shares = data.shares || 0;
            if (data.reactions) state.reactions = data.reactions;
            this.updateUI();
        }
        return data;
    },

    updateUI() {
        const totalReactions = Object.values(state.reactions).reduce((a, b) => a + b, 0);
        DOM.heroUsage.textContent = state.usage || 0;
        DOM.heroReactions.textContent = totalReactions || 0;
        DOM.heroShares.textContent = state.shares || 0;

        Object.keys(state.reactions).forEach(k => {
            if (DOM.reactionCounts[k]) {
                DOM.reactionCounts[k].textContent = state.reactions[k] || 0;
            }
        });
    }
};

// ==============================================
// TYPEWRITER ANIMATION
// ==============================================
const phrases = [
    'AI-Powered Business Cards',
    '15+ Professional Templates',
    'Real-Time Live Preview',
    'Export to PDF, PNG, Word',
    'Custom Colors & Fonts',
    'Share with the World',
    'Free & Easy to Use'
];
let pi = 0,
    ci = 0,
    deleting = false;

function typewriter() {
    const cur = phrases[pi];
    if (!deleting) {
        DOM.typewriter.textContent = cur.substring(0, ci + 1);
        ci++;
        if (ci === cur.length) {
            setTimeout(() => {
                deleting = true;
                setTimeout(typewriter, 500);
            }, 2000);
            return;
        }
    } else {
        DOM.typewriter.textContent = cur.substring(0, ci);
        ci--;
        if (ci < 0) {
            deleting = false;
            pi = (pi + 1) % phrases.length;
            setTimeout(typewriter, 400);
            return;
        }
    }
    setTimeout(typewriter, deleting ? 30 : 60);
}

// ==============================================
// THEME MANAGEMENT
// ==============================================
function applyTheme(isDark) {
    state.isDark = isDark;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    DOM.themeToggle.querySelector('i').className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    localStorage.setItem(CONFIG.THEME_KEY, isDark ? 'dark' : 'light');
}

function toggleTheme() {
    applyTheme(!state.isDark);
}

function initTheme() {
    const saved = localStorage.getItem(CONFIG.THEME_KEY);
    applyTheme(saved !== 'light');
}

// ==============================================
// PANEL SWITCHING
// ==============================================
function switchPanel(id) {
    state.currentPanel = id;
    DOM.panels.forEach(p => p.classList.remove('active'));
    const target = document.getElementById('panel-' + id);
    if (target) target.classList.add('active');

    DOM.sidebarItems.forEach(item => {
        item.classList.toggle('active', item.dataset.panel === id);
    });

    // Close mobile sidebar
    DOM.sidebar.classList.remove('open');
}

// ==============================================
// CARD PREVIEW UPDATE
// ==============================================
function updateCard() {
    const name = DOM.fullName.value || 'Your Name';
    const title = DOM.jobTitle.value || 'Job Title';
    const company = DOM.company.value || 'Company Name';
    const email = DOM.email.value || 'your@email.com';
    const phone = DOM.phone.value || '+1 234 567 890';
    const address = DOM.address.value || '123 Main St, City';
    const website = DOM.website.value || 'www.company.com';
    const social = DOM.social.value || '@username';
    const tagline = DOM.tagline.value || '';

    // Update preview
    DOM.previewName.textContent = name;
    DOM.previewTitle.textContent = title;
    DOM.previewTagline.textContent = tagline;
    DOM.previewCompany.textContent = company;
    DOM.previewCompanyBack.textContent = company;
    DOM.previewPhone.textContent = phone;
    DOM.previewEmail.textContent = email;
    DOM.previewAddress.textContent = address;
    DOM.previewWebsite.textContent = website;
    DOM.previewSocial.textContent = social;

    // Update hero floating card
    DOM.fcName.textContent = name;
    DOM.fcTitle.textContent = title;
    DOM.fcCompany.textContent = company;

    // Fonts
    DOM.previewName.style.fontFamily = DOM.nameFont.value;
    DOM.previewName.style.fontSize = DOM.nameSize.value + 'px';
    DOM.previewName.style.fontWeight = DOM.nameWeight.value;
    DOM.previewTitle.style.fontFamily = DOM.titleFont.value;
    DOM.previewTitle.style.fontSize = DOM.titleSize.value + 'px';
    DOM.previewTitle.style.fontWeight = DOM.titleWeight.value;

    // Alignment
    const alignBtn = document.querySelector('.align-btn.active');
    if (alignBtn) {
        DOM.cardBody.style.textAlign = alignBtn.dataset.align;
    }

    // Text Color & Opacity
    const color = DOM.textColor.value;
    const opacity = parseFloat(DOM.textOpacity.value);
    DOM.previewName.style.color = color;
    DOM.previewTitle.style.color = color;
    DOM.previewTagline.style.color = color;
    DOM.previewCompany.style.color = color;
    DOM.previewCompanyBack.style.color = color;
    DOM.previewName.style.opacity = opacity;
    DOM.previewTitle.style.opacity = opacity;
    DOM.previewTagline.style.opacity = opacity;
    DOM.previewCompany.style.opacity = opacity;
    DOM.previewCompanyBack.style.opacity = opacity;

    // Color Scheme
    const activeColor = document.querySelector('.color-swatch.active');
    if (activeColor) {
        const primaryColor = activeColor.dataset.color;
        document.documentElement.style.setProperty('--primary', primaryColor);
        document.querySelectorAll('.card-badge-c, .card-contact-c i, .card-footer-c').forEach(el => {
            if (el.tagName === 'I') el.style.color = primaryColor;
            else if (el.classList.contains('card-badge-c')) el.style.background = primaryColor;
        });
    }

    // Template
    applyTemplate(DOM.templateSelect.value);

    // Background
    applyBackground(DOM.bgSelect.value);

    // Corner Radius
    const radius = DOM.cornerRadius.value;
    DOM.cornerRadiusVal.textContent = radius + 'px';
    document.querySelectorAll('.card-face').forEach(el => {
        el.style.borderRadius = radius + 'px';
    });

    // Shadow
    const shadow = DOM.shadowIntensity.value;
    DOM.shadowIntensityVal.textContent = shadow + 'px';
    document.querySelectorAll('.card-face').forEach(el => {
        el.style.boxShadow = `0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.3)`;
    });

    // QR Code
    updateQR();

    // Save draft
    saveDraft();
}

// ==============================================
// TEMPLATE APPLY
// ==============================================
function applyTemplate(tpl) {
    const front = document.querySelector('.card-face.front');
    const back = document.querySelector('.card-face.back');

    const styles = {
        modern: 'linear-gradient(135deg, #6C3CE1, #00D4FF)',
        classic: '#F5F5F5',
        elegant: 'linear-gradient(135deg, #f093fb, #f5576c)',
        creative: 'linear-gradient(135deg, #4facfe, #00f2fe)',
        minimal: '#FFFFFF',
        corporate: 'linear-gradient(135deg, #2c3e50, #3498db)',
        professional: '#2c3e50',
        business: 'linear-gradient(135deg, #434343, #000000)',
        luxury: 'linear-gradient(135deg, #8B7500, #CDAD00)',
        tech: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
        artistic: 'linear-gradient(135deg, #ff9a9e, #fecfef)',
        vintage: '#f7e7ce',
        bold: 'linear-gradient(135deg, #ff416c, #ff4b2b)',
        gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
        geometric: 'linear-gradient(135deg, #a8edea, #fed6e3)',
    };

    const bg = styles[tpl] || styles.modern;
    front.style.background = bg;
    back.style.background = typeof bg === 'string' && bg.includes('gradient') ?
        bg.replace('135deg', '225deg') :
        bg;

    const darkTemplates = ['modern', 'elegant', 'creative', 'corporate', 'professional', 'business', 'luxury', 'tech',
        'bold', 'gradient'
    ];
    const isDark = darkTemplates.includes(tpl);
    const tc = isDark ? '#FFFFFF' : '#1A1A2E';
    front.style.color = tc;
    DOM.textColor.value = tc;
}

// ==============================================
// BACKGROUND APPLY
// ==============================================
function applyBackground(bg) {
    const front = document.querySelector('.card-face.front');
    switch (bg) {
        case 'none':
            front.style.backgroundImage = 'none';
            break;
        case 'texture':
            front.style.backgroundImage =
                'repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 5px, rgba(255,255,255,0.02) 5px, rgba(255,255,255,0.02) 10px)';
            break;
        case 'pattern':
            front.style.backgroundImage =
                'radial-gradient(circle at 20px 20px, rgba(255,255,255,0.05) 2px, transparent 2px), radial-gradient(circle at 60px 60px, rgba(255,255,255,0.05) 2px, transparent 2px)';
            front.style.backgroundSize = '80px 80px';
            break;
        case 'gradient-bg':
            front.style.backgroundImage = 'linear-gradient(135deg, var(--primary), var(--secondary))';
            break;
        case 'dark':
            front.style.backgroundImage = 'none';
            front.style.background = '#0B0A1A';
            break;
        case 'light':
            front.style.backgroundImage = 'none';
            front.style.background = '#F5F3FF';
            break;
        default:
            front.style.backgroundImage = 'none';
    }
}

// ==============================================
// QR CODE UPDATE
// ==============================================
function updateQR() {
    const link = DOM.qrLink.value || 'https://magicrills.com';
    const placeholder = DOM.qrPlaceholder;
    if (link) {
        // Generate simple QR representation
        placeholder.innerHTML = `<i class="fas fa-qrcode" style="font-size:28px;color:var(--primary);"></i>`;
        placeholder.title = 'QR: ' + link;
    } else {
        placeholder.innerHTML = `<i class="fas fa-qrcode" style="font-size:28px;color:var(--text-muted);"></i>`;
    }
}

// ==============================================
// DRAFT SAVE/LOAD
// ==============================================
function saveDraft() {
    try {
        const data = {
            fullName: DOM.fullName.value,
            jobTitle: DOM.jobTitle.value,
            company: DOM.company.value,
            email: DOM.email.value,
            phone: DOM.phone.value,
            phone2: DOM.phone2.value,
            address: DOM.address.value,
            website: DOM.website.value,
            social: DOM.social.value,
            tagline: DOM.tagline.value,
            template: DOM.templateSelect.value,
            bg: DOM.bgSelect.value,
            nameFont: DOM.nameFont.value,
            nameSize: DOM.nameSize.value,
            nameWeight: DOM.nameWeight.value,
            titleFont: DOM.titleFont.value,
            titleSize: DOM.titleSize.value,
            titleWeight: DOM.titleWeight.value,
            textColor: DOM.textColor.value,
            textOpacity: DOM.textOpacity.value,
            align: document.querySelector('.align-btn.active')?.dataset?.align || 'left',
            color: document.querySelector('.color-swatch.active')?.dataset?.color || '#6C3CE1',
            cornerRadius: DOM.cornerRadius.value,
            shadowIntensity: DOM.shadowIntensity.value,
            qrLink: DOM.qrLink.value,
        };
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
    } catch (e) { /* ignore */ }
}

function loadDraft() {
    try {
        const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (!raw) return;
        const d = JSON.parse(raw);

        const fields = ['fullName', 'jobTitle', 'company', 'email', 'phone', 'phone2', 'address', 'website', 'social',
            'tagline', 'template', 'bg', 'nameFont', 'nameSize', 'nameWeight', 'titleFont', 'titleSize', 'titleWeight',
            'textColor', 'textOpacity', 'cornerRadius', 'shadowIntensity', 'qrLink'
        ];
        fields.forEach(f => {
            if (d[f] !== undefined) {
                const el = document.getElementById(f);
                if (el) {
                    if (el.type === 'range') el.value = d[f];
                    else if (el.tagName === 'SELECT') el.value = d[f];
                    else el.value = d[f];
                }
            }
        });

        if (d.color) {
            DOM.colorSwatches.forEach(el => {
                el.classList.toggle('active', el.dataset.color === d.color);
            });
        }
        if (d.align) {
            DOM.alignBtns.forEach(el => {
                el.classList.toggle('active', el.dataset.align === d.align);
            });
        }

        // Update displays
        DOM.nameSizeVal.textContent = DOM.nameSize.value + 'px';
        DOM.titleSizeVal.textContent = DOM.titleSize.value + 'px';
        DOM.cornerRadiusVal.textContent = DOM.cornerRadius.value + 'px';
        DOM.shadowIntensityVal.textContent = DOM.shadowIntensity.value + 'px';
        DOM.textOpacityVal.textContent = Math.round(parseFloat(DOM.textOpacity.value) * 100) + '%';

        updateCard();
    } catch (e) { /* ignore */ }
}

// ==============================================
// EXPORT FUNCTIONS
// ==============================================
async function exportFile(type) {
    showLoading(true, 10);
    try {
        DOM.cardView.classList.remove('flipped');
        await new Promise(r => setTimeout(r, 100));
        showLoading(true, 30);

        const el = document.querySelector('.card-face.front');
        const canvas = await html2canvas(el, {
            scale: 3,
            backgroundColor: null,
            useCORS: true,
            logging: false,
        });
        showLoading(true, 60);

        if (type === 'png') {
            const link = document.createElement('a');
            link.download = 'visiting-card.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            showToast('PNG exported successfully!', 'success');
        } else if (type === 'jpeg') {
            const link = document.createElement('a');
            link.download = 'visiting-card.jpg';
            link.href = canvas.toDataURL('image/jpeg', 0.92);
            link.click();
            showToast('JPEG exported successfully!', 'success');
        } else if (type === 'pdf') {
            if (typeof jspdf === 'undefined') throw new Error('PDF library not loaded');
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');

            const img = canvas.toDataURL('image/jpeg', 0.9);
            pdf.addImage(img, 'JPEG', 10, 10, 85, 55);

            // Back side
            DOM.cardView.classList.add('flipped');
            await new Promise(r => setTimeout(r, 300));
            const backCanvas = await html2canvas(document.querySelector('.card-face.back'), {
                scale: 3,
                backgroundColor: null,
                useCORS: true,
                logging: false,
            });
            const backImg = backCanvas.toDataURL('image/jpeg', 0.9);
            pdf.addPage();
            pdf.addImage(backImg, 'JPEG', 10, 10, 85, 55);
            pdf.save('visiting-card.pdf');
            DOM.cardView.classList.remove('flipped');
            showToast('PDF exported successfully!', 'success');
        } else if (type === 'word') {
            const data = getCardData();
            const html = `
                <html><head><meta charset="UTF-8"><title>Visiting Card</title>
                <style>body{font-family:Arial;padding:20px}.card{width:85mm;height:55mm;border:1px solid #ccc;padding:15px;margin:10px;display:inline-block;border-radius:12px}
                .name{font-size:20px;font-weight:bold}.title{font-size:14px;color:#666}.contact{font-size:12px;margin:3px 0}.company{font-size:14px;font-weight:bold;margin-top:10px}
                </style></head><body>
                <div class="card">
                    <div class="name">${data.name}</div>
                    <div class="title">${data.title}</div>
                    <div class="contact">📞 ${data.phone}</div>
                    <div class="contact">📧 ${data.email}</div>
                    <div class="company">${data.company}</div>
                    <div style="font-size:11px;color:#999;margin-top:8px;">${data.address}</div>
                </div>
                </body></html>
            `;
            const blob = new Blob([html], { type: 'application/msword' });
            const link = document.createElement('a');
            link.download = 'visiting-card.doc';
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);
            showToast('Word document exported!', 'success');
        } else if (type === 'txt') {
            const data = getCardData();
            const txt = `
========================================
VISITING CARD
========================================
Name:       ${data.name}
Title:      ${data.title}
Company:    ${data.company}
Email:      ${data.email}
Phone:      ${data.phone}
Address:    ${data.address}
Website:    ${data.website}
Social:     ${data.social}
========================================
Generated:  ${new Date().toLocaleString()}
========================================
            `;
            const blob = new Blob([txt], { type: 'text/plain' });
            const link = document.createElement('a');
            link.download = 'visiting-card.txt';
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);
            showToast('TXT exported!', 'success');
        } else if (type === 'svg') {
            // Simple SVG export
            const data = getCardData();
            const svg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
                    <rect width="300" height="200" rx="12" fill="#6C3CE1"/>
                    <text x="20" y="60" font-family="Arial" font-size="24" font-weight="bold" fill="white">${data.name}</text>
                    <text x="20" y="90" font-family="Arial" font-size="14" fill="rgba(255,255,255,0.8)">${data.title}</text>
                    <text x="20" y="115" font-family="Arial" font-size="12" fill="rgba(255,255,255,0.6)">${data.company}</text>
                    <text x="20" y="140" font-family="Arial" font-size="11" fill="rgba(255,255,255,0.5)">📞 ${data.phone}</text>
                    <text x="20" y="160" font-family="Arial" font-size="11" fill="rgba(255,255,255,0.5)">📧 ${data.email}</text>
                </svg>
            `;
            const blob = new Blob([svg], { type: 'image/svg+xml' });
            const link = document.createElement('a');
            link.download = 'visiting-card.svg';
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);
            showToast('SVG exported!', 'success');
        }

        await API.recordShare(type + '-export');
    } catch (e) {
        console.error('Export Error:', e);
        showToast('Export failed: ' + e.message, 'error');
    }
    showLoading(false, 100);
}

function getCardData() {
    return {
        name: DOM.fullName.value || 'Your Name',
        title: DOM.jobTitle.value || 'Job Title',
        company: DOM.company.value || 'Company Name',
        email: DOM.email.value || 'your@email.com',
        phone: DOM.phone.value || '+1 234 567 890',
        address: DOM.address.value || '123 Main St',
        website: DOM.website.value || 'www.company.com',
        social: DOM.social.value || '@username',
        tagline: DOM.tagline.value || '',
    };
}

// ==============================================
// SHARE FUNCTION
// ==============================================
async function handleShare(platform) {
    const url = window.location.href;
    const text = 'Check out this Visiting Card Maker Pro! Create professional business cards with AI.';

    let shareUrl = '';
    switch (platform) {
        case 'facebook':
            shareUrl =
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
            break;
        case 'twitter':
            shareUrl =
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&via=magicrills`;
            break;
        case 'whatsapp':
            shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
            break;
        case 'linkedin':
            shareUrl =
                `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`;
            break;
        case 'email':
            shareUrl =
                `mailto:?subject=Visiting Card Maker Pro&body=${encodeURIComponent(text + '\n\n' + url + '\n\nCreate your own card for free!')}`;
            break;
        case 'pinterest':
            shareUrl =
                `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`;
            break;
        case 'copy':
            try {
                await navigator.clipboard.writeText(url);
                showToast('URL copied to clipboard!', 'success');
                await API.recordShare('copy');
                return;
            } catch (e) {
                const inp = document.createElement('input');
                inp.value = url;
                document.body.appendChild(inp);
                inp.select();
                document.execCommand('copy');
                inp.remove();
                showToast('URL copied!', 'success');
                await API.recordShare('copy');
                return;
            }
        default:
            return;
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        await API.recordShare(platform);
        showToast('Shared on ' + platform + '!', 'success');
    }
}

// ==============================================
// REACTIONS
// ==============================================
async function handleReaction(emoji) {
    const pill = document.querySelector(`.reaction-pill[data-emoji="${emoji}"]`);
    if (pill) {
        pill.style.transform = 'scale(1.3)';
        setTimeout(() => { pill.style.transform = 'scale(1)'; }, 300);
    }

    const result = await API.addReaction(emoji);
    if (!result || !result.success) {
        // Local fallback
        state.reactions[emoji] = (state.reactions[emoji] || 0) + 1;
        API.updateUI();
        try {
            const saved = JSON.parse(localStorage.getItem(CONFIG.REACTIONS_KEY) || '{}');
            saved[emoji] = (saved[emoji] || 0) + 1;
            localStorage.setItem(CONFIG.REACTIONS_KEY, JSON.stringify(saved));
        } catch (e) { /* ignore */ }
    }
    showToast(`Reacted with ${emoji}!`, 'info');
}

// ==============================================
// LOAD LOCAL REACTIONS (Fallback)
// ==============================================
function loadLocalReactions() {
    try {
        const saved = JSON.parse(localStorage.getItem(CONFIG.REACTIONS_KEY) || '{}');
        Object.keys(saved).forEach(k => {
            if (state.reactions[k] !== undefined) {
                state.reactions[k] = (state.reactions[k] || 0) + saved[k];
            }
        });
        API.updateUI();
    } catch (e) { /* ignore */ }
}

// ==============================================
// SCROLL BUTTONS
// ==============================================
function handleScroll() {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    DOM.scrollUp.classList.toggle('visible', scrollY > 200);
    DOM.scrollDown.classList.toggle('visible', scrollY < maxScroll - 200);
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToBottom() {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
}

// ==============================================
// CARD CONTROLS
// ==============================================
function flipCard() {
    state.isFlipped = !state.isFlipped;
    DOM.cardView.classList.toggle('flipped', state.isFlipped);
}

function rotateCard() {
    state.rotation = (state.rotation + 90) % 360;
    DOM.cardView.style.transform = `rotate(${state.rotation}deg)`;
}

function resetCard() {
    state.isFlipped = false;
    state.rotation = 0;
    state.zoomLevel = 1;
    DOM.cardView.classList.remove('flipped');
    DOM.cardView.style.transform = 'rotate(0deg)';
    DOM.cardView.style.transform = 'scale(1)';
}

function zoomCard() {
    state.zoomLevel = state.zoomLevel === 1 ? 1.5 : state.zoomLevel === 1.5 ? 2 : 1;
    DOM.cardView.style.transform = `rotate(${state.rotation}deg) scale(${state.zoomLevel})`;
}

// ==============================================
// EVENT LISTENERS
// ==============================================
function initEventListeners() {
    // Theme
    DOM.themeToggle.addEventListener('click', toggleTheme);

    // Help / Premium
    DOM.helpBtn.addEventListener('click', () => {
        DOM.premiumModal.classList.add('active');
    });
    DOM.modalClose.addEventListener('click', () => {
        DOM.premiumModal.classList.remove('active');
    });
    DOM.premiumModal.addEventListener('click', (e) => {
        if (e.target === DOM.premiumModal) DOM.premiumModal.classList.remove('active');
    });

    // Menu toggle
    DOM.menuToggle.addEventListener('click', () => {
        DOM.sidebar.classList.toggle('open');
    });

    // Sidebar panel
    DOM.sidebarItems.forEach(item => {
        item.addEventListener('click', () => switchPanel(item.dataset.panel));
    });

    // Export from sidebar
    DOM.exportItems.forEach(item => {
        item.addEventListener('click', () => exportFile(item.dataset.export));
    });

    // Share from sidebar
    DOM.shareItems.forEach(item => {
        item.addEventListener('click', () => handleShare(item.dataset.share));
    });

    // Share buttons
    DOM.shareBtns.forEach(btn => {
        btn.addEventListener('click', () => handleShare(btn.dataset.share));
    });

    // Navigation
    DOM.homeNav.addEventListener('click', () => window.open('https://magicrills.com', '_blank'));
    DOM.backNav.addEventListener('click', () => window.open(
        'https://magicrills.com/category-pages/administrator.html', '_blank'));

    // Form inputs
    document.querySelectorAll('#personal-panel input, #personal-panel textarea').forEach(el => {
        el.addEventListener('input', updateCard);
    });

    // Template
    DOM.templateSelect.addEventListener('change', updateCard);

    // Colors
    DOM.colorSwatches.forEach(el => {
        el.addEventListener('click', function() {
            DOM.colorSwatches.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            updateCard();
        });
    });

    // Background
    DOM.bgSelect.addEventListener('change', updateCard);

    // Fonts
    DOM.nameFont.addEventListener('change', updateCard);
    DOM.titleFont.addEventListener('change', updateCard);
    DOM.nameWeight.addEventListener('change', updateCard);
    DOM.titleWeight.addEventListener('change', updateCard);

    DOM.nameSize.addEventListener('input', function() {
        DOM.nameSizeVal.textContent = this.value + 'px';
        updateCard();
    });
    DOM.titleSize.addEventListener('input', function() {
        DOM.titleSizeVal.textContent = this.value + 'px';
        updateCard();
    });

    // Alignment
    DOM.alignBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            DOM.alignBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updateCard();
        });
    });

    // Text color & opacity
    DOM.textColor.addEventListener('input', updateCard);
    DOM.textOpacity.addEventListener('input', function() {
        DOM.textOpacityVal.textContent = Math.round(parseFloat(this.value) * 100) + '%';
        updateCard();
    });

    // Corner radius
    DOM.cornerRadius.addEventListener('input', function() {
        DOM.cornerRadiusVal.textContent = this.value + 'px';
        updateCard();
    });

    // Shadow intensity
    DOM.shadowIntensity.addEventListener('input', function() {
        DOM.shadowIntensityVal.textContent = this.value + 'px';
        updateCard();
    });

    // QR Link
    DOM.qrLink.addEventListener('input', updateCard);

    // Uploads
    DOM.logoUpload.addEventListener('click', () => DOM.logoInput.click());
    DOM.logoInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const r = new FileReader();
            r.onload = function(ev) {
                DOM.previewLogo.src = ev.target.result;
                DOM.previewLogo.style.display = 'block';
                DOM.logoUpload.querySelector('h4').textContent = '✅ Logo Uploaded';
                showToast('Logo uploaded successfully!', 'success');
            };
            r.readAsDataURL(this.files[0]);
        }
    });

    DOM.profileUpload.addEventListener('click', () => DOM.profileInput.click());
    DOM.profileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            DOM.profileUpload.querySelector('h4').textContent = '✅ Profile Uploaded';
            showToast('Profile image uploaded!', 'success');
        }
    });

    DOM.bgImageUpload.addEventListener('click', () => DOM.bgImageInput.click());
    DOM.bgImageInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const r = new FileReader();
            r.onload = function(ev) {
                document.querySelector('.card-face.front').style.backgroundImage = `url(${ev.target.result})`;
                document.querySelector('.card-face.front').style.backgroundSize = 'cover';
                DOM.bgImageUpload.querySelector('h4').textContent = '✅ BG Image Set';
                showToast('Background image uploaded!', 'success');
            };
            r.readAsDataURL(this.files[0]);
        }
    });

    // Layout options
    DOM.layoutOpts.forEach(el => {
        el.addEventListener('click', function() {
            DOM.layoutOpts.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Card controls
    DOM.flipBtn.addEventListener('click', flipCard);
    DOM.rotateBtn.addEventListener('click', rotateCard);
    DOM.resetBtn.addEventListener('click', resetCard);
    DOM.zoomInBtn.addEventListener('click', zoomCard);

    // Export buttons
    DOM.expPdf.addEventListener('click', () => exportFile('pdf'));
    DOM.expWord.addEventListener('click', () => exportFile('word'));
    DOM.expPng.addEventListener('click', () => exportFile('png'));
    DOM.expJpeg.addEventListener('click', () => exportFile('jpeg'));
    DOM.expTxt.addEventListener('click', () => exportFile('txt'));

    // Reactions
    DOM.reactionPills.forEach(pill => {
        pill.addEventListener('click', () => handleReaction(pill.dataset.emoji));
    });

    // Scroll
    window.addEventListener('scroll', handleScroll);
    DOM.scrollUp.addEventListener('click', scrollToTop);
    DOM.scrollDown.addEventListener('click', scrollToBottom);

    // Hero buttons
    DOM.startBtn.addEventListener('click', () => {
        document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
    });
    DOM.templatesBtn.addEventListener('click', () => {
        switchPanel('style');
        document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
    });
}

// ==============================================
// INITIALIZATION
// ==============================================
async function initApp() {
    // Theme
    initTheme();

    // Load draft
    loadDraft();

    // Load local reactions
    loadLocalReactions();

    // Typewriter
    typewriter();

    // Event listeners
    initEventListeners();

    // Initial update
    updateCard();

    // Handle scroll
    handleScroll();

    // Get stats from API
    try {
        const stats = await API.getStats();
        if (stats && stats.success) {
            state.usage = stats.usage || 0;
            state.shares = stats.shares || 0;
            if (stats.reactions) state.reactions = stats.reactions;
            API.updateUI();
        } else {
            // Local fallback
            const localUsage = parseInt(localStorage.getItem(CONFIG.LOCAL_USAGE_KEY) || '0');
            state.usage = localUsage;
            API.updateUI();
        }
    } catch (e) {
        const localUsage = parseInt(localStorage.getItem(CONFIG.LOCAL_USAGE_KEY) || '0');
        state.usage = localUsage;
        API.updateUI();
    }

    // Increment usage
    try {
        await API.incrementUsage();
        const localUsage = parseInt(localStorage.getItem(CONFIG.LOCAL_USAGE_KEY) || '0');
        localStorage.setItem(CONFIG.LOCAL_USAGE_KEY, String(localUsage + 1));
    } catch (e) {
        const localUsage = parseInt(localStorage.getItem(CONFIG.LOCAL_USAGE_KEY) || '0');
        localStorage.setItem(CONFIG.LOCAL_USAGE_KEY, String(localUsage + 1));
        state.usage = localUsage + 1;
        API.updateUI();
    }

    // Welcome toast
    setTimeout(() => {
        showToast('🎨 Welcome to CardCraft Pro!', 'success');
    }, 800);
}

// ==============================================
// START
// ==============================================
document.addEventListener('DOMContentLoaded', initApp);
