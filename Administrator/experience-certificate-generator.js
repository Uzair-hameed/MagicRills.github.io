/* ============================
   CONFIGURATION
============================ */
const CONFIG = {
    TOOL_SLUG: 'experience-certificate-generator',
    API_BASE: 'https://magicrills-api.uzairhameed01.workers.dev',
    GROK_API: 'https://magicrills-grok-api.uzairhameed01.workers.dev',
    SITE_URL: 'https://magicrills.com/tools/experience-certificate-generator.html'
};

/* ============================
   STATE
============================ */
const state = {
    darkMode: localStorage.getItem('darkMode') === 'true',
    usage: 0,
    reactions: {},
    shares: 0,
    selectedStyle: 'classic',
    zoom: 1,
    experiencePoints: [],
    signatureData: null
};

/* ============================
   DOM REFS
============================ */
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

const DOM = {
    preloader: $('preloader'),
    typewriter: $('typewriter'),
    statUsers: $('statUsers'),
    statCerts: $('statCerts'),
    statReactions: $('statReactions'),
    statShares: $('statShares'),
    shareCount: $('shareCount'),
    totalReactionsBottom: $('totalReactionsBottom'),
    
    empName: $('empName'),
    empCnic: $('empCnic'),
    empCompany: $('empCompany'),
    empDept: $('empDept'),
    empDesignation: $('empDesignation'),
    empStart: $('empStart'),
    empEnd: $('empEnd'),
    expInput: $('expInput'),
    addExpBtn: $('addExpBtn'),
    aiGenBtn: $('aiGenBtn'),
    expList: $('expList'),
    issuerName: $('issuerName'),
    issuerDesignation: $('issuerDesignation'),
    sigUpload: $('sigUpload'),
    sigPreviewMini: $('sigPreviewMini'),
    fontSelect: $('fontSelect'),
    fontSizeSelect: $('fontSizeSelect'),
    layoutSelect: $('layoutSelect'),
    alignSelect: $('alignSelect'),
    styleSelect: $('styleSelect'),
    
    certificate: $('certificate'),
    previewWrap: $('previewWrap'),
    previewName: $('previewName'),
    previewName2: $('previewName2'),
    previewCnic: $('previewCnic'),
    previewCompany: $('previewCompany'),
    previewDept: $('previewDept'),
    previewDesignation: $('previewDesignation'),
    previewStart: $('previewStart'),
    previewEnd: $('previewEnd'),
    previewExpList: $('previewExpList'),
    previewIssuer: $('previewIssuer'),
    previewIssuerTitle: $('previewIssuerTitle'),
    previewSig: $('previewSig'),
    previewDate: $('previewDate'),
    
    generateBtn: $('generateBtn'),
    pdfBtn: $('pdfBtn'),
    docBtn: $('docBtn'),
    txtBtn: $('txtBtn'),
    resetBtn: $('resetBtn'),
    zoomInBtn: $('zoomInBtn'),
    zoomOutBtn: $('zoomOutBtn'),
    fullscreenBtn: $('fullscreenBtn'),
    
    reactionBtns: $$('.r-btn-bottom'),
    shareBtns: $$('.s-btn-bottom'),
    colorMinis: $$('.cp-mini'),
    
    scrollUpBtn: $('scrollUpBtn'),
    scrollDownBtn: $('scrollDownBtn'),
    darkToggle: $('darkToggle'),
    
    toastContainer: $('toastContainer'),
    stylePreviewItems: $$('.style-preview-item')
};

/* ============================
   TYPEWRITER - H3
============================ */
const words = ['Certificates', 'Experience Letters', 'Employee Documents', 'Work Verification'];
let wi = 0, ci = 0, deleting = false;

function typewriter() {
    const w = words[wi];
    if (!deleting) {
        DOM.typewriter.textContent = w.substring(0, ci + 1);
        ci++;
        if (ci === w.length) { deleting = true; setTimeout(typewriter, 2000); return; }
        setTimeout(typewriter, 60);
    } else {
        DOM.typewriter.textContent = w.substring(0, ci - 1);
        ci--;
        if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; setTimeout(typewriter, 500); return; }
        setTimeout(typewriter, 30);
    }
}

/* ============================
   API
============================ */
async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const opts = { method, headers: { 'Content-Type': 'application/json' } };
        if (data) opts.body = JSON.stringify(data);
        const res = await fetch(`${CONFIG.API_BASE}${endpoint}`, opts);
        if (!res.ok) throw new Error('API error');
        return await res.json();
    } catch (e) { console.error('API:', e); return null; }
}

function getUserId() {
    let id = localStorage.getItem('userId');
    if (!id) { id = 'u_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8); localStorage.setItem('userId', id); }
    return id;
}

async function incrementUsage() {
    const res = await apiCall('/api/usage', 'POST', { tool_slug: CONFIG.TOOL_SLUG, user_id: getUserId() });
    if (res) await updateStats();
    else {
        const c = parseInt(localStorage.getItem(`${CONFIG.TOOL_SLUG}_usage`) || '0');
        localStorage.setItem(`${CONFIG.TOOL_SLUG}_usage`, c + 1);
        updateStats();
    }
}

async function updateStats() {
    try {
        const res = await apiCall(`/api/stats?tool_slug=${CONFIG.TOOL_SLUG}`, 'GET');
        if (res) {
            DOM.statUsers.textContent = res.usage || 0;
            DOM.statCerts.textContent = Math.floor((res.usage || 0) * 1.3);
            const tr = Object.values(res.reactions || {}).reduce((a,b) => a + b, 0);
            DOM.statReactions.textContent = tr;
            DOM.totalReactionsBottom.textContent = tr;
            DOM.statShares.textContent = res.shares || 0;
            DOM.shareCount.textContent = res.shares || 0;
            updateReactionsUI(res.reactions || {});
        } else {
            const u = parseInt(localStorage.getItem(`${CONFIG.TOOL_SLUG}_usage`) || '0');
            DOM.statUsers.textContent = u;
            DOM.statCerts.textContent = Math.floor(u * 1.3);
            const r = JSON.parse(localStorage.getItem(`${CONFIG.TOOL_SLUG}_reactions`) || '{}');
            const tr = Object.values(r).reduce((a,b) => a + b, 0);
            DOM.statReactions.textContent = tr;
            DOM.totalReactionsBottom.textContent = tr;
            updateReactionsUI(r);
        }
    } catch (e) { console.error('Stats:', e); }
}

async function addReaction(emoji) {
    const res = await apiCall('/api/reactions', 'POST', {
        tool_slug: CONFIG.TOOL_SLUG,
        emoji: emoji,
        user_id: getUserId()
    });
    if (res) { await updateStats(); showToast(`Reacted ${emoji}`, 'success'); }
    else {
        const r = JSON.parse(localStorage.getItem(`${CONFIG.TOOL_SLUG}_reactions`) || '{}');
        r[emoji] = (r[emoji] || 0) + 1;
        localStorage.setItem(`${CONFIG.TOOL_SLUG}_reactions`, JSON.stringify(r));
        updateStats();
    }
}

function updateReactionsUI(data) {
    DOM.reactionBtns.forEach(btn => {
        const emoji = btn.dataset.emoji;
        const el = document.getElementById(`r2-${emoji}`);
        if (el) el.textContent = data[emoji] || 0;
    });
}

async function recordShare(platform) {
    const res = await apiCall('/api/shares', 'POST', {
        tool_slug: CONFIG.TOOL_SLUG,
        platform: platform,
        user_id: getUserId()
    });
    if (res) await updateStats();
    else {
        const s = parseInt(localStorage.getItem(`${CONFIG.TOOL_SLUG}_shares`) || '0');
        localStorage.setItem(`${CONFIG.TOOL_SLUG}_shares`, s + 1);
        updateStats();
    }
}

/* ============================
   AI GENERATE
============================ */
async function generateAI() {
    const name = DOM.empName.value.trim() || 'Employee';
    const company = DOM.empCompany.value.trim() || 'Company';
    const designation = DOM.empDesignation.value.trim() || 'Position';
    const dept = DOM.empDept.value || 'Department';
    
    showToast('Generating AI description...', 'info');
    DOM.aiGenBtn.disabled = true;
    DOM.aiGenBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    try {
        const res = await fetch(CONFIG.GROK_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: `Generate 3 professional experience points for:
                Name: ${name}, Company: ${company}, Designation: ${designation}, Dept: ${dept}
                Return only 3 bullet points (max 15 words each).`,
                tool: CONFIG.TOOL_SLUG
            })
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data && data.response) {
            const pts = data.response.split('\n').filter(l => l.trim());
            pts.forEach(p => {
                DOM.expInput.value = p.replace(/^[•\-*\d.]+\s*/, '').trim();
                addExperience();
            });
            showToast('AI generated 3 points!', 'success');
        } else throw new Error();
    } catch (e) {
        const fallback = ['Demonstrated leadership and team management', 'Exceeded performance targets', 'Showed problem-solving abilities'];
        fallback.forEach(p => { DOM.expInput.value = p; addExperience(); });
        showToast('Used fallback suggestions', 'info');
    }
    DOM.aiGenBtn.disabled = false;
    DOM.aiGenBtn.innerHTML = '<i class="fas fa-robot"></i> AI Generate';
}

/* ============================
   EXPERIENCE
============================ */
function addExperience() {
    const text = DOM.expInput.value.trim();
    if (!text) { showToast('Enter experience first', 'error'); return; }
    const item = document.createElement('div');
    item.className = 'exp-item';
    item.innerHTML = `<span>${text}</span><button class="del"><i class="fas fa-times"></i></button>`;
    DOM.expList.appendChild(item);
    state.experiencePoints.push(text);
    DOM.expInput.value = '';
    item.querySelector('.del').onclick = () => {
        const t = item.querySelector('span').textContent;
        state.experiencePoints = state.experiencePoints.filter(p => p !== t);
        item.remove();
        updatePreview();
        showToast('Removed', 'info');
    };
    updatePreview();
    showToast('Added!', 'success');
}

/* ============================
   PREVIEW
============================ */
function updatePreview() {
    DOM.previewName.textContent = DOM.empName.value || '[Employee Name]';
    DOM.previewName2.textContent = DOM.empName.value || '[Employee Name]';
    DOM.previewCnic.textContent = DOM.empCnic.value || '[CNIC]';
    DOM.previewCompany.textContent = DOM.empCompany.value || '[Company]';
    DOM.previewDept.textContent = DOM.empDept.value || '[Department]';
    DOM.previewDesignation.textContent = DOM.empDesignation.value || '[Designation]';
    DOM.previewStart.textContent = DOM.empStart.value ? formatDate(DOM.empStart.value) : '[Start]';
    DOM.previewEnd.textContent = DOM.empEnd.value ? formatDate(DOM.empEnd.value) : '[End]';
    DOM.previewIssuer.textContent = DOM.issuerName.value || '[Issuer]';
    DOM.previewIssuerTitle.textContent = DOM.issuerDesignation.value || '[Designation]';
    
    DOM.certificate.style.fontFamily = DOM.fontSelect.value;
    DOM.certificate.style.fontSize = DOM.fontSizeSelect.value;
    applyLayout(DOM.layoutSelect.value);
    applyAlignment(DOM.alignSelect.value);
    
    const pts = document.querySelectorAll('.exp-item span');
    DOM.previewExpList.innerHTML = '';
    if (pts.length) {
        pts.forEach(p => { const li = document.createElement('li'); li.textContent = p.textContent; DOM.previewExpList.appendChild(li); });
    } else {
        DOM.previewExpList.innerHTML = '<li>No experience points added</li>';
    }
}

function formatDate(d) {
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function applyLayout(layout) {
    const c = DOM.certificate;
    switch(layout) {
        case 'compact': c.style.padding = '14mm'; break;
        case 'spacious': c.style.padding = '28mm'; break;
        default: c.style.padding = '20mm';
    }
}

function applyAlignment(align) {
    const details = DOM.certificate.querySelector('.cert-details');
    if (details) details.style.textAlign = align;
}

/* ============================
   STYLES - 15 Styles
============================ */
function applyStyle(style) {
    state.selectedStyle = style;
    const c = DOM.certificate;
    const h1 = c.querySelector('.cert-header h1');
    const borders = c.querySelectorAll('.cert-border');
    const watermark = c.querySelector('.cert-watermark');
    const details = c.querySelectorAll('.cert-details, .cert-name, .date-label, #previewIssuer');
    const muted = c.querySelectorAll('.cert-sub, #previewIssuerTitle, #previewDate');
    const decIcon = c.querySelector('.dec-icon');
    
    // Reset
    c.style.background = 'white';
    c.style.border = 'none';
    c.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)';
    if (h1) h1.style.color = '#2c3e50';
    details.forEach(el => el.style.color = '');
    muted.forEach(el => el.style.color = '');
    watermark.style.opacity = '0.04';
    borders.forEach(d => d.style.opacity = '0.1');
    if (decIcon) decIcon.style.color = '#2c3e50';
    c.style.borderRadius = '0';
    c.style.letterSpacing = 'normal';
    
    const styles = {
        classic: { bg: 'white', border: '1px solid #eee', h1Color: '#2c3e50', decColor: '#2c3e50', borderOpacity: '0.1' },
        modern: { bg: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)', border: '2px solid #667eea', h1Color: '#667eea', decColor: '#667eea', borderOpacity: '0.3' },
        elegant: { bg: '#fdf8f0', border: '3px solid #c9a84c', h1Color: '#c9a84c', decColor: '#c9a84c', borderOpacity: '0.25' },
        corporate: { bg: '#1a1a2e', border: '3px solid #3498db', h1Color: '#3498db', decColor: '#3498db', borderOpacity: '0.3', textColor: 'white', mutedColor: '#b0b0d0' },
        minimal: { bg: 'white', border: '1px solid #e0e0e0', h1Color: '#333', decColor: '#333', borderOpacity: '0.06', watermarkOpacity: '0.02' },
        premium: { bg: 'linear-gradient(135deg, #1a1a2e, #c9a84c)', border: '4px solid #ffd700', h1Color: '#ffd700', decColor: '#ffd700', borderOpacity: '0.3', textColor: 'white', mutedColor: '#d4c8a0' },
        royal: { bg: 'linear-gradient(135deg, #fff5f5, #ffe8e8)', border: '3px solid #e74c3c', h1Color: '#e74c3c', decColor: '#e74c3c', borderOpacity: '0.25' },
        ocean: { bg: 'linear-gradient(135deg, #e8f4f8, #b8d8e8)', border: '3px solid #00b894', h1Color: '#00b894', decColor: '#00b894', borderOpacity: '0.25' },
        forest: { bg: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', border: '3px solid #2ecc71', h1Color: '#2ecc71', decColor: '#2ecc71', borderOpacity: '0.25' },
        sunset: { bg: 'linear-gradient(135deg, #fff3e0, #ffe0b2)', border: '3px solid #f39c12', h1Color: '#f39c12', decColor: '#f39c12', borderOpacity: '0.25' },
        rose: { bg: 'linear-gradient(135deg, #fce4ec, #f8bbd0)', border: '3px solid #e84393', h1Color: '#e84393', decColor: '#e84393', borderOpacity: '0.25' },
        space: { bg: 'linear-gradient(135deg, #0a0a2e, #1a1a4e)', border: '3px solid #6c5ce7', h1Color: '#a29bfe', decColor: '#a29bfe', borderOpacity: '0.3', textColor: '#e9ecef', mutedColor: '#8a8aaa' },
        vintage: { bg: 'linear-gradient(135deg, #f5f0e8, #e8dcc8)', border: '3px solid #8d6e3f', h1Color: '#8d6e3f', decColor: '#8d6e3f', borderOpacity: '0.2', watermarkOpacity: '0.06' },
        neon: { bg: '#0a0a1a', border: '3px solid #6C63FF', h1Color: '#6C63FF', decColor: '#6C63FF', borderOpacity: '0.4', textColor: '#e9ecef', mutedColor: '#8a8aaa', shadow: '0 0 30px rgba(108,99,255,0.15)' },
        glass: { bg: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', h1Color: 'white', decColor: 'white', borderOpacity: '0.3', textColor: 'white', mutedColor: 'rgba(255,255,255,0.6)', backdrop: 'blur(20px)', shadow: '0 8px 32px rgba(0,0,0,0.2)' }
    };
    
    const s = styles[style] || styles.classic;
    
    c.style.background = s.bg;
    c.style.border = s.border;
    if (s.shadow) c.style.boxShadow = s.shadow;
    if (s.backdrop) c.style.backdropFilter = s.backdrop;
    if (s.textColor) details.forEach(el => el.style.color = s.textColor);
    if (s.mutedColor) muted.forEach(el => el.style.color = s.mutedColor);
    if (h1) h1.style.color = s.h1Color;
    if (decIcon) decIcon.style.color = s.decColor;
    if (s.watermarkOpacity) watermark.style.opacity = s.watermarkOpacity;
    borders.forEach(d => d.style.opacity = parseFloat(s.borderOpacity) || 0.1);
}

/* ============================
   COLOR THEME
============================ */
function applyColor(color) {
    const h1 = document.querySelector('.cert-header h1');
    const borders = document.querySelectorAll('.cert-border');
    const dec = document.querySelector('.dec-icon');
    if (h1) h1.style.color = color;
    borders.forEach(d => d.style.borderColor = color);
    if (dec) dec.style.color = color;
}

/* ============================
   SIGNATURE
============================ */
function handleSignature(e) {
    const file = e.target.files[0];
    if (!file || !file.type.match('image.*')) { showToast('Select an image', 'error'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
        DOM.sigPreviewMini.innerHTML = `<img src="${e.target.result}" alt="sig">`;
        DOM.previewSig.innerHTML = `<img src="${e.target.result}" style="max-width:130px;max-height:50px">`;
        state.signatureData = e.target.result;
        showToast('Signature uploaded!', 'success');
    };
    reader.readAsDataURL(file);
}

/* ============================
   ZOOM
============================ */
function zoomIn() { state.zoom = Math.min(state.zoom + 0.1, 1.5); applyZoom(); }
function zoomOut() { state.zoom = Math.max(state.zoom - 0.1, 0.5); applyZoom(); }
function applyZoom() { DOM.certificate.style.transform = `scale(${state.zoom})`; }

/* ============================
   FULLSCREEN
============================ */
function toggleFullscreen() {
    if (!document.fullscreenElement) DOM.previewWrap.requestFullscreen?.();
    else document.exitFullscreen?.();
}

/* ============================
   GENERATE
============================ */
function generate() {
    if (!validateForm()) { showToast('Fill all required fields', 'error'); return; }
    updatePreview();
    DOM.certificate.style.animation = 'none';
    setTimeout(() => DOM.certificate.style.animation = 'fadeIn 0.5s ease', 10);
    incrementUsage();
    showToast('Certificate generated!', 'success');
}

function validateForm() {
    const fields = [DOM.empName, DOM.empCnic, DOM.empCompany, DOM.empDept, DOM.empDesignation, DOM.empStart, DOM.empEnd, DOM.issuerName, DOM.issuerDesignation];
    let ok = true;
    fields.forEach(f => { if (!f.value.trim()) { f.style.borderColor = '#e74c3c'; ok = false; } else { f.style.borderColor = ''; } });
    return ok;
}

/* ============================
   EXPORT
============================ */
function exportPDF() { showToast('PDF export coming soon', 'info'); window.print(); }

function exportDOC() {
    const html = `<html><head><meta charset="utf-8"><style>body{font-family:Arial;padding:20px}</style></head><body><div style="width:210mm;padding:20mm">${DOM.certificate.innerHTML}</div></body></html>`;
    const blob = new Blob([html], { type: 'application/msword;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Certificate_${DOM.empName.value || 'employee'}.doc`;
    link.click();
    showToast('Exported as DOC!', 'success');
}

function exportTXT() {
    const pts = document.querySelectorAll('.exp-item span');
    let text = `=== EXPERIENCE CERTIFICATE ===\n\n`;
    text += `Employee: ${DOM.empName.value}\nCNIC: ${DOM.empCnic.value}\nCompany: ${DOM.empCompany.value}\n`;
    text += `Department: ${DOM.empDept.value}\nDesignation: ${DOM.empDesignation.value}\n`;
    text += `Period: ${DOM.empStart.value} to ${DOM.empEnd.value}\n\n--- Experience ---\n`;
    pts.forEach((p, i) => text += `${i+1}. ${p.textContent}\n`);
    text += `\nIssuer: ${DOM.issuerName.value} (${DOM.issuerDesignation.value})\nDate: ${new Date().toLocaleDateString()}`;
    
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Certificate_${DOM.empName.value || 'employee'}.txt`;
    link.click();
    showToast('Exported as TXT!', 'success');
}

/* ============================
   RESET
============================ */
function resetAll() {
    if (!confirm('Reset everything?')) return;
    document.querySelectorAll('input, select, textarea').forEach(el => { if (el.type !== 'file') el.value = ''; });
    DOM.expList.innerHTML = '';
    DOM.sigPreviewMini.innerHTML = '';
    DOM.previewSig.innerHTML = '<div class="sig-line"></div>';
    state.experiencePoints = [];
    state.signatureData = null;
    DOM.certificate.style.transform = 'scale(1)';
    state.zoom = 1;
    resetPreview();
    showToast('Reset complete', 'info');
}

function resetPreview() {
    DOM.previewName.textContent = '[Employee Name]';
    DOM.previewName2.textContent = '[Employee Name]';
    DOM.previewCnic.textContent = '[CNIC]';
    DOM.previewCompany.textContent = '[Company]';
    DOM.previewDept.textContent = '[Department]';
    DOM.previewDesignation.textContent = '[Designation]';
    DOM.previewStart.textContent = '[Start]';
    DOM.previewEnd.textContent = '[End]';
    DOM.previewIssuer.textContent = '[Issuer]';
    DOM.previewIssuerTitle.textContent = '[Designation]';
    DOM.previewExpList.innerHTML = '<li>Sample responsibility</li><li>Another contribution</li>';
}

/* ============================
   SHARE
============================ */
function share(platform) {
    const url = encodeURIComponent(CONFIG.SITE_URL);
    const text = encodeURIComponent('Check out this Experience Certificate Generator! Create professional certificates with AI. #MagicRills');
    const map = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
        whatsapp: `https://api.whatsapp.com/send?text=${text}%20${url}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        email: `mailto:?subject=Experience Certificate Generator&body=${text}%20${url}`
    };
    if (platform === 'copy') {
        navigator.clipboard.writeText(CONFIG.SITE_URL).then(() => {
            showToast('URL copied!', 'success');
            recordShare('copy');
        });
        return;
    }
    if (map[platform]) { window.open(map[platform], '_blank', 'width=600,height=500'); recordShare(platform); }
}

/* ============================
   TOAST
============================ */
function showToast(msg, type = 'info') {
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${msg}</span><button class="toast-close">&times;</button>`;
    DOM.toastContainer.appendChild(t);
    t.querySelector('.toast-close').onclick = () => { t.classList.add('hide'); setTimeout(() => t.remove(), 300); };
    setTimeout(() => { if (t.parentNode) { t.classList.add('hide'); setTimeout(() => t.remove(), 300); } }, 3000);
}

/* ============================
   DARK MODE
============================ */
function toggleDark() {
    state.darkMode = !state.darkMode;
    document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', state.darkMode);
    DOM.darkToggle.querySelector('i').className = state.darkMode ? 'fas fa-sun' : 'fas fa-moon';
    showToast(state.darkMode ? 'Dark mode' : 'Light mode', 'info');
}

/* ============================
   SCROLL
============================ */
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
function scrollToBottom() { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }

/* ============================
   STYLE PREVIEW GRID
============================ */
function populateStylePreview() {
    const grid = document.getElementById('stylePreviewGrid');
    const styles = [
        { name: 'Classic', style: 'classic' }, { name: 'Modern', style: 'modern' },
        { name: 'Elegant', style: 'elegant' }, { name: 'Corporate', style: 'corporate' },
        { name: 'Minimal', style: 'minimal' }, { name: 'Premium', style: 'premium' },
        { name: 'Royal', style: 'royal' }, { name: 'Ocean', style: 'ocean' },
        { name: 'Forest', style: 'forest' }, { name: 'Sunset', style: 'sunset' },
        { name: 'Rose', style: 'rose' }, { name: 'Space', style: 'space' },
        { name: 'Vintage', style: 'vintage' }, { name: 'Neon', style: 'neon' },
        { name: 'Glass', style: 'glass' }
    ];
    
    grid.innerHTML = '';
    styles.forEach(s => {
        const item = document.createElement('div');
        item.className = 'style-preview-item' + (s.style === state.selectedStyle ? ' active' : '');
        item.dataset.style = s.style;
        item.innerHTML = `
            <div class="spi-preview">
                <div class="spi-inner ${s.style}">
                    <span>CERT</span>
                    <span class="spi-name">John</span>
                    <div class="spi-line"></div>
                    <span class="spi-foot">${s.name}</span>
                </div>
            </div>
            <span class="spi-name">${s.name}</span>
        `;
        item.addEventListener('click', function() {
            document.querySelectorAll('.style-preview-item').forEach(el => el.classList.remove('active'));
            this.classList.add('active');
            DOM.styleSelect.value = this.dataset.style;
            applyStyle(this.dataset.style);
            showToast(`Style: ${this.querySelector('.spi-name').textContent}`, 'success');
        });
        grid.appendChild(item);
    });
}

/* ============================
   EVENT LISTENERS
============================ */
function initEvents() {
    // Form
    ['empName','empCnic','empCompany','empDesignation','issuerName','issuerDesignation'].forEach(id => {
        $(id).addEventListener('input', updatePreview);
    });
    ['empDept','empStart','empEnd','fontSelect','fontSizeSelect','layoutSelect','alignSelect'].forEach(id => {
        $(id).addEventListener('change', updatePreview);
    });
    
    DOM.styleSelect.addEventListener('change', function() {
        document.querySelectorAll('.style-preview-item').forEach(el => el.classList.remove('active'));
        document.querySelector(`.style-preview-item[data-style="${this.value}"]`)?.classList.add('active');
        applyStyle(this.value);
        showToast(`Style: ${this.options[this.selectedIndex].text}`, 'success');
    });
    
    DOM.addExpBtn.addEventListener('click', addExperience);
    DOM.aiGenBtn.addEventListener('click', generateAI);
    DOM.expInput.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addExperience(); } });
    
    // Color Mini
    DOM.colorMinis.forEach(el => {
        el.addEventListener('click', function() {
            DOM.colorMinis.forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            applyColor(this.dataset.color);
        });
    });
    
    // Signature
    DOM.sigUpload.addEventListener('change', handleSignature);
    
    // Buttons
    DOM.generateBtn.addEventListener('click', generate);
    DOM.pdfBtn.addEventListener('click', exportPDF);
    DOM.docBtn.addEventListener('click', exportDOC);
    DOM.txtBtn.addEventListener('click', exportTXT);
    DOM.resetBtn.addEventListener('click', resetAll);
    DOM.zoomInBtn.addEventListener('click', zoomIn);
    DOM.zoomOutBtn.addEventListener('click', zoomOut);
    DOM.fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    // Reactions Bottom
    DOM.reactionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const emoji = this.dataset.emoji;
            this.classList.toggle('active');
            addReaction(emoji);
        });
    });
    
    // Share Bottom
    DOM.shareBtns.forEach(btn => {
        btn.addEventListener('click', function() { share(this.dataset.platform); });
    });
    
    // Floating
    DOM.scrollUpBtn.addEventListener('click', scrollToTop);
    DOM.scrollDownBtn.addEventListener('click', scrollToBottom);
    DOM.darkToggle.addEventListener('click', toggleDark);
    
    // Keyboard
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.key === 'g') generate();
        if (e.ctrlKey && e.key === 'r') resetAll();
    });
}

/* ============================
   LOAD SAMPLE
============================ */
function loadSample() {
    DOM.empName.value = 'Sarah Johnson';
    DOM.empCnic.value = '12345-6789012-3';
    DOM.empCompany.value = 'Global Tech Solutions';
    DOM.empDept.value = 'Information Technology';
    DOM.empDesignation.value = 'Senior Software Engineer';
    DOM.empStart.value = '2020-03-15';
    DOM.empEnd.value = '2023-08-30';
    DOM.issuerName.value = 'Michael Roberts';
    DOM.issuerDesignation.value = 'Head of Technology';
    
    const pts = ['Developed web applications using modern technologies', 'Led a team of 5 developers', 'Improved performance by 40%'];
    pts.forEach(p => { DOM.expInput.value = p; addExperience(); });
    updatePreview();
}

/* ============================
   INIT
============================ */
async function init() {
    if (state.darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        DOM.darkToggle.querySelector('i').className = 'fas fa-sun';
    }
    
    DOM.previewDate.textContent = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    typewriter();
    populateStylePreview();
    
    await updateStats();
    incrementUsage();
    loadSample();
    
    applyStyle('classic');
    DOM.styleSelect.value = 'classic';
    
    initEvents();
    
    setTimeout(() => DOM.preloader.classList.add('hide'), 500);
    setTimeout(() => showToast('Welcome! Create your certificate 🎉', 'success'), 1000);
    
    console.log('✅ Experience Certificate Generator - Crystal 3D Theme loaded');
}

document.addEventListener('DOMContentLoaded', init);
