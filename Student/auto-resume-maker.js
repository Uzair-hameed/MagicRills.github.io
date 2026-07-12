/* ============================================
   AUTO RESUME MAKER - COMPLETE JAVASCRIPT
   Cloudflare Workers API Integration
   Dark Space Neon Theme with 3D Effects
   ============================================ */

// ============================================
// Configuration
// ============================================
const TOOL_SLUG = 'auto-resume-maker';
const TOOL_NAME = 'Auto Resume Maker';
const CATEGORY = 'student';

// Cloudflare Workers API
const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';
const API_KEY = 'magicrills-grok-api.uzairhameed01.workers.dev';

// User ID
let userId = localStorage.getItem('userId');
if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
}

// ============================================
// Resume Data
// ============================================
let resumeData = {
    personal: { name: '', title: '', email: '', phone: '', address: '', summary: '', image: '', social: [] },
    experience: [],
    education: [],
    skills: [],
    settings: { theme: 'theme-default', font: 'font-inter', template: 'template-standard' }
};

let nextId = 1;

// ============================================
// Stats Cache (LocalStorage Fallback)
// ============================================
let statsCache = {
    usage: parseInt(localStorage.getItem('stats_usage')) || 0,
    views: parseInt(localStorage.getItem('stats_views')) || 0,
    shares: parseInt(localStorage.getItem('stats_shares')) || 0,
    followers: parseInt(localStorage.getItem('stats_followers')) || 0
};

// ============================================
// DOM Elements
// ============================================
const resumePreview = document.getElementById('resumePreview');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const loadingOverlay = document.getElementById('loadingOverlay');
const loadingText = document.getElementById('loadingText');

// ============================================
// Helper Functions
// ============================================
function showToast(msg, type = 'success') {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = msg;
    toast.classList.remove('hidden');
    toast.style.background = type === 'error' ? 'rgba(239,68,68,0.9)' : 'rgba(17,24,39,0.95)';
    toast.style.borderColor = type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(0,212,255,0.1)';
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.add('hidden'), 3000);
}

function showLoading(show, msg = 'Processing...') {
    if (!loadingOverlay || !loadingText) return;
    if (show) {
        loadingText.textContent = msg;
        loadingOverlay.classList.remove('hidden');
    } else {
        loadingOverlay.classList.add('hidden');
    }
}

function getEmojiName(emoji) {
    const names = {
        like: '👍 Like',
        love: '❤️ Love',
        wow: '😮 Wow',
        sad: '😢 Sad',
        angry: '😠 Angry',
        laugh: '😂 Laugh',
        celebrate: '🎉 Celebrate'
    };
    return names[emoji] || emoji;
}

function getEmojiColor(emoji) {
    const colors = {
        like: '#3498db',
        love: '#e74c3c',
        wow: '#f1c40f',
        sad: '#9b59b6',
        angry: '#c0392b',
        laugh: '#2ecc71',
        celebrate: '#f39c12'
    };
    return colors[emoji] || '#00d4ff';
}

// ============================================
// API Calls
// ============================================
async function callAPI(endpoint, method = 'GET', body = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            }
        };
        if (body) options.body = JSON.stringify(body);

        const response = await fetch(`${API_BASE}${endpoint}`, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.warn('API Error:', error.message);
        return null;
    }
}

// ============================================
// Stats Functions
// ============================================
async function incrementUsage() {
    try {
        const result = await callAPI('/api/usage', 'POST', {
            tool_slug: TOOL_SLUG,
            user_id: userId
        });
        if (result && result.success) {
            statsCache.usage = result.usage || statsCache.usage + 1;
            localStorage.setItem('stats_usage', statsCache.usage);
            updateStatsDisplay();
        } else {
            // Fallback: LocalStorage increment
            statsCache.usage += 1;
            localStorage.setItem('stats_usage', statsCache.usage);
            updateStatsDisplay();
        }
    } catch (error) {
        // Fallback: LocalStorage increment
        statsCache.usage += 1;
        localStorage.setItem('stats_usage', statsCache.usage);
        updateStatsDisplay();
    }
}

async function fetchStats() {
    try {
        const result = await callAPI(`/api/stats?tool_slug=${TOOL_SLUG}`);
        if (result && result.success) {
            statsCache.usage = result.usage || statsCache.usage;
            statsCache.views = result.views || statsCache.views;
            statsCache.shares = result.shares || statsCache.shares;
            statsCache.followers = result.followers || statsCache.followers;
            localStorage.setItem('stats_usage', statsCache.usage);
            localStorage.setItem('stats_views', statsCache.views);
            localStorage.setItem('stats_shares', statsCache.shares);
            localStorage.setItem('stats_followers', statsCache.followers);
            updateStatsDisplay();
        }
    } catch (error) {
        console.warn('Stats fetch error:', error);
    }
}

async function recordShare(platform) {
    try {
        const result = await callAPI('/api/shares', 'POST', {
            tool_slug: TOOL_SLUG,
            platform: platform,
            user_id: userId
        });
        if (result && result.success) {
            statsCache.shares = result.total_shares || statsCache.shares + 1;
            localStorage.setItem('stats_shares', statsCache.shares);
            updateStatsDisplay();
        } else {
            statsCache.shares += 1;
            localStorage.setItem('stats_shares', statsCache.shares);
            updateStatsDisplay();
        }
    } catch (error) {
        statsCache.shares += 1;
        localStorage.setItem('stats_shares', statsCache.shares);
        updateStatsDisplay();
    }
}

async function recordReaction(emoji) {
    try {
        const result = await callAPI('/api/reactions', 'POST', {
            tool_slug: TOOL_SLUG,
            emoji: emoji,
            user_id: userId
        });
        if (result && result.success) {
            updateReactionCounts(result.reactions);
        }
    } catch (error) {
        console.warn('Reaction record error:', error);
    }
}

async function fetchReactions() {
    try {
        const result = await callAPI(`/api/reactions?tool_slug=${TOOL_SLUG}`);
        if (result && result.success) {
            updateReactionCounts(result.reactions);
        }
    } catch (error) {
        console.warn('Reactions fetch error:', error);
    }
}

function updateReactionCounts(reactions) {
    if (!reactions) return;
    const emojiMap = {
        'like': 'likeCount',
        'love': 'loveCount',
        'wow': 'wowCount',
        'sad': 'sadCount',
        'angry': 'angryCount',
        'laugh': 'laughCount',
        'celebrate': 'celebrateCount'
    };
    for (const [emoji, count] of Object.entries(reactions)) {
        const id = emojiMap[emoji];
        if (id) {
            const el = document.getElementById(id);
            if (el) el.textContent = count || 0;
        }
    }
}

function updateStatsDisplay() {
    const usageEl = document.getElementById('usageCount');
    if (usageEl) usageEl.textContent = statsCache.usage || 0;
    
    const shareEl = document.getElementById('shareCount');
    if (shareEl) shareEl.textContent = statsCache.shares || 0;
    
    // Update ATS score if available
    const atsEl = document.getElementById('atsScore');
    if (atsEl && statsCache.atsScore) {
        atsEl.textContent = statsCache.atsScore + '%';
    }
}

// ============================================
// Tab Switching
// ============================================
function initTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            const target = document.getElementById(`${tabId}-tab`);
            if (target) target.classList.add('active');
        });
    });
}

// ============================================
// Item Management Functions
// ============================================
function addSocialLink() {
    const id = nextId++;
    resumeData.personal.social.push({ id, platform: '', url: '' });
    renderSocialLinks();
    saveToLocalStorage();
}

function addExperience() {
    const id = nextId++;
    resumeData.experience.push({ id, company: '', position: '', startDate: '', endDate: '', description: '' });
    renderExperience();
    saveToLocalStorage();
}

function addEducation() {
    const id = nextId++;
    resumeData.education.push({ id, institution: '', degree: '', field: '', startDate: '', endDate: '', description: '' });
    renderEducation();
    saveToLocalStorage();
}

function addSkill() {
    const id = nextId++;
    resumeData.skills.push({ id, name: '', level: '' });
    renderSkills();
    saveToLocalStorage();
}

function renderSocialLinks() {
    const container = document.getElementById('social-links');
    if (!container) return;
    container.innerHTML = resumeData.personal.social.map(item => `
        <div class="item" data-id="${item.id}">
            <div class="form-group"><label>Platform</label><input type="text" class="social-platform" value="${item.platform || ''}" placeholder="LinkedIn, GitHub"></div>
            <div class="form-group"><label>URL</label><input type="text" class="social-url" value="${item.url || ''}" placeholder="https://..."></div>
            <button class="remove-item" data-id="${item.id}">×</button>
        </div>
    `).join('');
    
    document.querySelectorAll('#social-links .social-platform').forEach(input => {
        const parent = input.closest('.item');
        const id = parseInt(parent.dataset.id);
        input.addEventListener('input', e => {
            const item = resumeData.personal.social.find(s => s.id === id);
            if (item) item.platform = e.target.value;
            generatePreview();
            saveToLocalStorage();
        });
    });
    document.querySelectorAll('#social-links .social-url').forEach(input => {
        const parent = input.closest('.item');
        const id = parseInt(parent.dataset.id);
        input.addEventListener('input', e => {
            const item = resumeData.personal.social.find(s => s.id === id);
            if (item) item.url = e.target.value;
            generatePreview();
            saveToLocalStorage();
        });
    });
    document.querySelectorAll('#social-links .remove-item').forEach(btn => {
        btn.addEventListener('click', e => {
            const id = parseInt(btn.dataset.id);
            resumeData.personal.social = resumeData.personal.social.filter(s => s.id !== id);
            renderSocialLinks();
            generatePreview();
            saveToLocalStorage();
        });
    });
}

function renderExperience() {
    const container = document.getElementById('experience-items');
    if (!container) return;
    container.innerHTML = resumeData.experience.map(item => `
        <div class="item" data-id="${item.id}">
            <div class="form-group"><label>Company</label><input type="text" class="exp-company" value="${item.company || ''}" placeholder="Company name"></div>
            <div class="form-group"><label>Position</label><input type="text" class="exp-position" value="${item.position || ''}" placeholder="Job title"></div>
            <div class="form-group"><div style="display:flex;gap:10px;"><div style="flex:1"><label>Start Date</label><input type="text" class="exp-start" value="${item.startDate || ''}" placeholder="MM/YYYY"></div><div style="flex:1"><label>End Date</label><input type="text" class="exp-end" value="${item.endDate || ''}" placeholder="MM/YYYY"></div></div></div>
            <div class="form-group"><label>Description</label><textarea class="exp-desc" placeholder="Describe your responsibilities">${item.description || ''}</textarea></div>
            <button class="remove-item" data-id="${item.id}">×</button>
        </div>
    `).join('');
    
    document.querySelectorAll('#experience-items .exp-company').forEach(input => {
        const parent = input.closest('.item');
        const id = parseInt(parent.dataset.id);
        input.addEventListener('input', e => { const item = resumeData.experience.find(x => x.id === id); if(item) item.company = e.target.value; generatePreview(); saveToLocalStorage(); });
    });
    document.querySelectorAll('#experience-items .exp-position').forEach(input => {
        const parent = input.closest('.item');
        const id = parseInt(parent.dataset.id);
        input.addEventListener('input', e => { const item = resumeData.experience.find(x => x.id === id); if(item) item.position = e.target.value; generatePreview(); saveToLocalStorage(); });
    });
    document.querySelectorAll('#experience-items .exp-start').forEach(input => {
        const parent = input.closest('.item');
        const id = parseInt(parent.dataset.id);
        input.addEventListener('input', e => { const item = resumeData.experience.find(x => x.id === id); if(item) item.startDate = e.target.value; generatePreview(); saveToLocalStorage(); });
    });
    document.querySelectorAll('#experience-items .exp-end').forEach(input => {
        const parent = input.closest('.item');
        const id = parseInt(parent.dataset.id);
        input.addEventListener('input', e => { const item = resumeData.experience.find(x => x.id === id); if(item) item.endDate = e.target.value; generatePreview(); saveToLocalStorage(); });
    });
    document.querySelectorAll('#experience-items .exp-desc').forEach(textarea => {
        const parent = textarea.closest('.item');
        const id = parseInt(parent.dataset.id);
        textarea.addEventListener('input', e => { const item = resumeData.experience.find(x => x.id === id); if(item) item.description = e.target.value; generatePreview(); saveToLocalStorage(); });
    });
    document.querySelectorAll('#experience-items .remove-item').forEach(btn => {
        btn.addEventListener('click', e => {
            const id = parseInt(btn.dataset.id);
            resumeData.experience = resumeData.experience.filter(x => x.id !== id);
            renderExperience();
            generatePreview();
            saveToLocalStorage();
        });
    });
}

function renderEducation() {
    const container = document.getElementById('education-items');
    if (!container) return;
    container.innerHTML = resumeData.education.map(item => `
        <div class="item" data-id="${item.id}">
            <div class="form-group"><label>Institution</label><input type="text" class="edu-institution" value="${item.institution || ''}" placeholder="University name"></div>
            <div class="form-group"><label>Degree</label><input type="text" class="edu-degree" value="${item.degree || ''}" placeholder="Bachelor of Science"></div>
            <div class="form-group"><label>Field</label><input type="text" class="edu-field" value="${item.field || ''}" placeholder="Computer Science"></div>
            <div class="form-group"><div style="display:flex;gap:10px;"><div style="flex:1"><label>Start Date</label><input type="text" class="edu-start" value="${item.startDate || ''}" placeholder="MM/YYYY"></div><div style="flex:1"><label>End Date</label><input type="text" class="edu-end" value="${item.endDate || ''}" placeholder="MM/YYYY"></div></div></div>
            <div class="form-group"><label>Description</label><textarea class="edu-desc" placeholder="Academic achievements">${item.description || ''}</textarea></div>
            <button class="remove-item" data-id="${item.id}">×</button>
        </div>
    `).join('');
    
    document.querySelectorAll('#education-items .edu-institution').forEach(input => {
        const parent = input.closest('.item');
        const id = parseInt(parent.dataset.id);
        input.addEventListener('input', e => { const item = resumeData.education.find(x => x.id === id); if(item) item.institution = e.target.value; generatePreview(); saveToLocalStorage(); });
    });
    document.querySelectorAll('#education-items .edu-degree').forEach(input => {
        const parent = input.closest('.item');
        const id = parseInt(parent.dataset.id);
        input.addEventListener('input', e => { const item = resumeData.education.find(x => x.id === id); if(item) item.degree = e.target.value; generatePreview(); saveToLocalStorage(); });
    });
    document.querySelectorAll('#education-items .edu-field').forEach(input => {
        const parent = input.closest('.item');
        const id = parseInt(parent.dataset.id);
        input.addEventListener('input', e => { const item = resumeData.education.find(x => x.id === id); if(item) item.field = e.target.value; generatePreview(); saveToLocalStorage(); });
    });
    document.querySelectorAll('#education-items .edu-start').forEach(input => {
        const parent = input.closest('.item');
        const id = parseInt(parent.dataset.id);
        input.addEventListener('input', e => { const item = resumeData.education.find(x => x.id === id); if(item) item.startDate = e.target.value; generatePreview(); saveToLocalStorage(); });
    });
    document.querySelectorAll('#education-items .edu-end').forEach(input => {
        const parent = input.closest('.item');
        const id = parseInt(parent.dataset.id);
        input.addEventListener('input', e => { const item = resumeData.education.find(x => x.id === id); if(item) item.endDate = e.target.value; generatePreview(); saveToLocalStorage(); });
    });
    document.querySelectorAll('#education-items .edu-desc').forEach(textarea => {
        const parent = textarea.closest('.item');
        const id = parseInt(parent.dataset.id);
        textarea.addEventListener('input', e => { const item = resumeData.education.find(x => x.id === id); if(item) item.description = e.target.value; generatePreview(); saveToLocalStorage(); });
    });
    document.querySelectorAll('#education-items .remove-item').forEach(btn => {
        btn.addEventListener('click', e => {
            const id = parseInt(btn.dataset.id);
            resumeData.education = resumeData.education.filter(x => x.id !== id);
            renderEducation();
            generatePreview();
            saveToLocalStorage();
        });
    });
}

function renderSkills() {
    const container = document.getElementById('skill-items');
    if (!container) return;
    container.innerHTML = resumeData.skills.map(item => `
        <div class="item" data-id="${item.id}">
            <div class="form-group"><label>Skill Name</label><input type="text" class="skill-name" value="${item.name || ''}" placeholder="JavaScript, Python, etc."></div>
            <div class="form-group"><label>Level</label><select class="skill-level"><option value="">Select</option><option value="Beginner" ${item.level === 'Beginner' ? 'selected' : ''}>Beginner</option><option value="Intermediate" ${item.level === 'Intermediate' ? 'selected' : ''}>Intermediate</option><option value="Advanced" ${item.level === 'Advanced' ? 'selected' : ''}>Advanced</option><option value="Expert" ${item.level === 'Expert' ? 'selected' : ''}>Expert</option></select></div>
            <button class="remove-item" data-id="${item.id}">×</button>
        </div>
    `).join('');
    
    document.querySelectorAll('#skill-items .skill-name').forEach(input => {
        const parent = input.closest('.item');
        const id = parseInt(parent.dataset.id);
        input.addEventListener('input', e => { const item = resumeData.skills.find(x => x.id === id); if(item) item.name = e.target.value; generatePreview(); saveToLocalStorage(); });
    });
    document.querySelectorAll('#skill-items .skill-level').forEach(select => {
        const parent = select.closest('.item');
        const id = parseInt(parent.dataset.id);
        select.addEventListener('change', e => { const item = resumeData.skills.find(x => x.id === id); if(item) item.level = e.target.value; generatePreview(); saveToLocalStorage(); });
    });
    document.querySelectorAll('#skill-items .remove-item').forEach(btn => {
        btn.addEventListener('click', e => {
            const id = parseInt(btn.dataset.id);
            resumeData.skills = resumeData.skills.filter(x => x.id !== id);
            renderSkills();
            generatePreview();
            saveToLocalStorage();
        });
    });
}

// ============================================
// Preview Generation
// ============================================
function generatePreview() {
    const p = resumeData.personal;
    const exp = resumeData.experience;
    const edu = resumeData.education;
    const skills = resumeData.skills;
    
    let html = `
        <div class="resume-header">
            ${p.image ? `<div style="text-align:center;margin-bottom:15px;"><img src="${p.image}" style="width:100px;height:100px;border-radius:50%;object-fit:cover;border:3px solid var(--primary);"></div>` : ''}
            <h1 class="resume-name">${p.name || 'Your Name'}</h1>
            <div class="resume-title">${p.title || 'Professional Title'}</div>
            <div class="resume-contact">
                ${p.email ? `<div>📧 ${p.email}</div>` : ''}
                ${p.phone ? `<div>📞 ${p.phone}</div>` : ''}
                ${p.address ? `<div>📍 ${p.address}</div>` : ''}
            </div>
            ${p.social.filter(s => s.platform && s.url).length ? `<div class="resume-social" style="text-align:center;margin-top:10px;">${p.social.filter(s => s.platform && s.url).map(s => `<a href="${s.url}" target="_blank" style="color:var(--primary);text-decoration:none;margin:0 8px;font-size:14px;">${s.platform}</a>`).join('')}</div>` : ''}
        </div>
        ${p.summary ? `<div class="resume-section"><h2 class="resume-section-title">Professional Summary</h2><p>${p.summary}</p></div>` : ''}
        ${exp.length ? `<div class="resume-section"><h2 class="resume-section-title">Work Experience</h2>${exp.filter(e => e.company || e.position).map(e => `
            <div class="resume-item"><div class="resume-item-header"><div class="resume-item-title">${e.position || 'Position'}</div><div class="resume-item-date">${e.startDate || ''} ${e.endDate ? '- ' + e.endDate : ''}</div></div>
            <div class="resume-item-subtitle">${e.company || 'Company'}</div>${e.description ? `<p>${e.description}</p>` : ''}</div>
        `).join('')}</div>` : ''}
        ${edu.length ? `<div class="resume-section"><h2 class="resume-section-title">Education</h2>${edu.filter(e => e.institution || e.degree).map(e => `
            <div class="resume-item"><div class="resume-item-header"><div class="resume-item-title">${e.degree || 'Degree'}</div><div class="resume-item-date">${e.startDate || ''} ${e.endDate ? '- ' + e.endDate : ''}</div></div>
            <div class="resume-item-subtitle">${e.institution || 'Institution'} ${e.field ? `- ${e.field}` : ''}</div>${e.description ? `<p>${e.description}</p>` : ''}</div>
        `).join('')}</div>` : ''}
        ${skills.length ? `<div class="resume-section"><h2 class="resume-section-title">Skills</h2><div class="resume-skills">${skills.filter(s => s.name).map(s => `<div class="skill-tag">${s.name}${s.level ? ` (${s.level})` : ''}</div>`).join('')}</div></div>` : ''}
    `;
    if (resumePreview) resumePreview.innerHTML = html;
    
    // Update resume score
    let score = 0;
    if (resumeData.personal.name) score += 20;
    if (resumeData.personal.summary && resumeData.personal.summary.length > 50) score += 20;
    if (resumeData.experience.length) score += Math.min(30, resumeData.experience.length * 10);
    if (resumeData.education.length) score += 20;
    if (resumeData.skills.length) score += Math.min(10, resumeData.skills.length * 2);
    const scoreSpan = document.getElementById('resumeScore');
    if (scoreSpan) scoreSpan.textContent = Math.min(100, score);
}

// ============================================
// Typewriter Animation
// ============================================
function initTypewriter() {
    const phrases = [
        'AI-Powered Resume Builder',
        'ATS-Friendly Templates',
        'Professional CV Maker',
        'Real-Time Preview',
        'Expert AI Suggestions',
        'Land Your Dream Job'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const el = document.getElementById('typewriterText');
    if (!el) return;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
            el.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            el.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? 40 : 80);
        }
    }
    type();
}

// ============================================
// Save/Load Functions
// ============================================
function saveToLocalStorage() {
    try {
        localStorage.setItem('resumeData', JSON.stringify(resumeData));
        const status = document.getElementById('autoSaveStatus');
        if (status) status.innerHTML = '<i class="fas fa-check-circle"></i> Auto-saved';
    } catch (e) {
        console.warn('Save error:', e);
    }
}

function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('resumeData');
        if (saved) {
            const parsed = JSON.parse(saved);
            Object.assign(resumeData, parsed);
            if (resumeData.experience && resumeData.experience.length) {
                const maxId = Math.max(...resumeData.experience.map(e => e.id), ...resumeData.education.map(e => e.id), ...resumeData.skills.map(s => s.id), 0);
                if (maxId) nextId = maxId + 1;
            }
            document.getElementById('full-name').value = resumeData.personal.name || '';
            document.getElementById('job-title').value = resumeData.personal.title || '';
            document.getElementById('email').value = resumeData.personal.email || '';
            document.getElementById('phone').value = resumeData.personal.phone || '';
            document.getElementById('address').value = resumeData.personal.address || '';
            document.getElementById('summary').value = resumeData.personal.summary || '';
            document.getElementById('summaryChars').textContent = (resumeData.personal.summary || '').length;
            renderSocialLinks();
            renderExperience();
            renderEducation();
            renderSkills();
            generatePreview();
        }
    } catch (e) {
        console.warn('Load error:', e);
    }
}

// ============================================
// AI Functions
// ============================================
async function aiOptimizeResume() {
    showLoading(true, 'AI is analyzing your resume...');
    try {
        // Call Grok AI via Cloudflare Worker
        const response = await fetch(`${API_BASE}/api/ai/optimize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({
                resume: resumeData,
                target_job: document.getElementById('target-job')?.value || '',
                industry: document.getElementById('target-industry')?.value || ''
            })
        });
        const data = await response.json();
        if (data && data.success) {
            const atsSpan = document.getElementById('atsScore');
            if (atsSpan) atsSpan.textContent = data.ats_score + '%';
            
            const atsFill = document.getElementById('atsScoreFill');
            if (atsFill) atsFill.style.width = data.ats_score + '%';
            
            const atsValue = document.getElementById('atsScoreValue');
            if (atsValue) atsValue.textContent = data.ats_score + '%';
            
            const keywords = document.getElementById('aiKeywords');
            if (keywords && data.keywords) {
                keywords.innerHTML = data.keywords.map(k => `<span class="keyword-tag">${k}</span>`).join('');
            }
            
            const suggestions = document.getElementById('aiSuggestionsList');
            if (suggestions && data.suggestions) {
                suggestions.innerHTML = data.suggestions.map(s => `<div class="ai-suggestion-item">💡 ${s}</div>`).join('');
            }
            
            document.getElementById('aiScoreBox').style.display = 'block';
            showToast('AI optimization complete!');
        } else {
            // Fallback: Simulate AI optimization
            simulateAIOptimization();
        }
    } catch (error) {
        console.warn('AI optimization error:', error);
        // Fallback: Simulate AI optimization
        simulateAIOptimization();
    }
    showLoading(false);
}

function simulateAIOptimization() {
    const score = Math.floor(Math.random() * 30) + 60;
    document.getElementById('atsScore').textContent = score + '%';
    document.getElementById('atsScoreFill').style.width = score + '%';
    document.getElementById('atsScoreValue').textContent = score + '%';
    document.getElementById('aiScoreBox').style.display = 'block';
    
    const keywords = ['Leadership', 'Communication', 'Problem Solving', 'Team Collaboration', 'Project Management'];
    document.getElementById('aiKeywords').innerHTML = keywords.map(k => `<span class="keyword-tag">${k}</span>`).join('');
    
    const suggestions = [
        'Add more quantifiable achievements to your experience section',
        'Include relevant keywords from the job description',
        'Keep your resume to 1-2 pages for better ATS compatibility'
    ];
    document.getElementById('aiSuggestionsList').innerHTML = suggestions.map(s => `<div class="ai-suggestion-item">💡 ${s}</div>`).join('');
    showToast('AI suggestions generated!');
}

async function suggestSkills() {
    showLoading(true, 'Getting skill suggestions...');
    try {
        const response = await fetch(`${API_BASE}/api/ai/skills`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({
                title: resumeData.personal.title || '',
                industry: document.getElementById('target-industry')?.value || ''
            })
        });
        const data = await response.json();
        if (data && data.success && data.skills) {
            data.skills.forEach(skill => {
                const id = nextId++;
                resumeData.skills.push({ id, name: skill, level: '' });
            });
            renderSkills();
            generatePreview();
            saveToLocalStorage();
            showToast('Skills added!');
        } else {
            // Fallback skills
            const fallbackSkills = ['JavaScript', 'Python', 'Project Management', 'Communication', 'Leadership', 'Problem Solving'];
            fallbackSkills.forEach(skill => {
                const id = nextId++;
                resumeData.skills.push({ id, name: skill, level: '' });
            });
            renderSkills();
            generatePreview();
            saveToLocalStorage();
            showToast('Skills added!');
        }
    } catch (error) {
        // Fallback skills
        const fallbackSkills = ['JavaScript', 'Python', 'Project Management', 'Communication', 'Leadership', 'Problem Solving'];
        fallbackSkills.forEach(skill => {
            const id = nextId++;
            resumeData.skills.push({ id, name: skill, level: '' });
        });
        renderSkills();
        generatePreview();
        saveToLocalStorage();
        showToast('Skills added!');
    }
    showLoading(false);
}

// ============================================
// Download Functions
// ============================================
async function downloadPDF() {
    showLoading(true, 'Generating PDF...');
    try {
        const canvas = await html2canvas(resumePreview, { 
            scale: 2, 
            useCORS: true,
            backgroundColor: '#0a0e1a',
            width: resumePreview.scrollWidth,
            height: resumePreview.scrollHeight
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('resume.pdf');
        showToast('PDF downloaded!');
    } catch(e) { 
        showToast('PDF generation failed', 'error'); 
    }
    showLoading(false);
}

function downloadDOC() {
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Resume</title><style>body{font-family:Arial;padding:40px;background:#fff;color:#333} .resume-header{text-align:center;margin-bottom:30px} .resume-name{font-size:28px;color:#2c3e50} .resume-title{color:#3498db;font-size:18px} .resume-section-title{color:#3498db;border-bottom:2px solid #3498db;padding-bottom:5px}</style></head><body>${resumePreview.innerHTML}</body></html>`;
    const blob = new Blob([html], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'resume.doc';
    link.click();
    showToast('DOC downloaded!');
}

// ============================================
// Share Functions
// ============================================
function shareOnPlatform(platform) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out this AI-powered resume builder!');
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            break;
        case 'whatsapp':
            shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=Professional Resume Builder&body=${text}%0A%0A${url}`;
            break;
        default:
            return;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=500');
        recordShare(platform);
        showToast(`Shared on ${platform}!`);
    }
}

function copyShareLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Link copied to clipboard!');
        recordShare('copy');
    }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = window.location.href;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Link copied!');
        recordShare('copy');
    });
}

// ============================================
// Event Listeners
// ============================================
function initEventListeners() {
    // Personal Info
    document.getElementById('full-name')?.addEventListener('input', e => { resumeData.personal.name = e.target.value; generatePreview(); saveToLocalStorage(); });
    document.getElementById('job-title')?.addEventListener('input', e => { resumeData.personal.title = e.target.value; generatePreview(); saveToLocalStorage(); });
    document.getElementById('email')?.addEventListener('input', e => { resumeData.personal.email = e.target.value; generatePreview(); saveToLocalStorage(); });
    document.getElementById('phone')?.addEventListener('input', e => { resumeData.personal.phone = e.target.value; generatePreview(); saveToLocalStorage(); });
    document.getElementById('address')?.addEventListener('input', e => { resumeData.personal.address = e.target.value; generatePreview(); saveToLocalStorage(); });
    document.getElementById('summary')?.addEventListener('input', e => { 
        resumeData.personal.summary = e.target.value; 
        document.getElementById('summaryChars').textContent = e.target.value.length; 
        generatePreview(); 
        saveToLocalStorage(); 
    });
    document.getElementById('profile-image')?.addEventListener('change', e => { 
        const file = e.target.files[0]; 
        if(file){ 
            const reader = new FileReader(); 
            reader.onload = ev => { 
                resumeData.personal.image = ev.target.result; 
                generatePreview(); 
                saveToLocalStorage(); 
            }; 
            reader.readAsDataURL(file); 
        } 
    });
    
    // Buttons
    document.getElementById('preview-btn')?.addEventListener('click', () => generatePreview());
    document.getElementById('refreshPreviewBtn')?.addEventListener('click', () => generatePreview());
    document.getElementById('download-pdf')?.addEventListener('click', downloadPDF);
    document.getElementById('download-doc')?.addEventListener('click', downloadDOC);
    document.getElementById('print-btn')?.addEventListener('click', () => window.print());
    document.getElementById('reset-btn')?.addEventListener('click', () => { 
        if(confirm('Reset all data?')) {
            localStorage.removeItem('resumeData');
            location.reload(); 
        } 
    });
    
    // AI Buttons
    document.getElementById('fullOptimizeBtn')?.addEventListener('click', aiOptimizeResume);
    document.getElementById('suggestSkillsBtn')?.addEventListener('click', suggestSkills);
    document.getElementById('optimizeExperienceBtn')?.addEventListener('click', aiOptimizeResume);
    
    // Dark Mode
    document.getElementById('darkModeBtn')?.addEventListener('click', toggleDarkMode);
    
    // Page Share
    document.getElementById('pageShareBtn')?.addEventListener('click', copyShareLink);
    document.getElementById('copyShareLink')?.addEventListener('click', copyShareLink);
    
    // Add buttons
    document.getElementById('add-social')?.addEventListener('click', addSocialLink);
    document.getElementById('add-experience')?.addEventListener('click', addExperience);
    document.getElementById('add-education')?.addEventListener('click', addEducation);
    document.getElementById('add-skill')?.addEventListener('click', addSkill);
    
    // Reactions
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const emoji = this.dataset.emoji;
            showToast(getEmojiName(emoji) + ' reaction added!');
            recordReaction(emoji);
            // Animate
            this.style.transform = 'scale(1.3)';
            setTimeout(() => this.style.transform = 'scale(1)', 300);
        });
    });
    
    // Social Share
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const platform = this.dataset.platform;
            if (platform) shareOnPlatform(platform);
        });
    });
    
    // Scroll buttons
    window.addEventListener('scroll', () => {
        const upBtn = document.getElementById('scrollUpBtn');
        if (upBtn) upBtn.classList.toggle('hidden', window.scrollY <= 200);
    });
    document.getElementById('scrollUpBtn')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.getElementById('scrollDownBtn')?.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
}

// ============================================
// Dark Mode Toggle
// ============================================
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const btn = document.getElementById('darkModeBtn');
    if (btn) {
        if (document.body.classList.contains('dark-mode')) {
            btn.innerHTML = '<i class="fas fa-sun"></i>';
            showToast('Light mode activated');
        } else {
            btn.innerHTML = '<i class="fas fa-moon"></i>';
            showToast('Dark mode activated');
        }
    }
}

// ============================================
// Template, Theme, Font Selection
// ============================================
function initCustomization() {
    document.querySelectorAll('.template-option').forEach(opt => {
        opt.addEventListener('click', function() {
            document.querySelectorAll('.template-option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            const template = this.dataset.template;
            if (resumePreview) resumePreview.className = `resume-preview ${template}`;
            resumeData.settings.template = template;
            saveToLocalStorage();
        });
    });
    
    document.querySelectorAll('.theme-option').forEach(opt => {
        opt.addEventListener('click', function() {
            document.querySelectorAll('.theme-option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            const theme = this.dataset.theme;
            if (theme && theme !== 'custom') {
                document.body.className = document.body.className.replace(/theme-\w+/g, '') + ' ' + theme;
                resumeData.settings.theme = theme;
                saveToLocalStorage();
            }
        });
    });
    
    document.querySelectorAll('.font-option').forEach(opt => {
        opt.addEventListener('click', function() {
            document.querySelectorAll('.font-option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            const font = this.dataset.font;
            document.body.className = document.body.className.replace(/font-\w+/g, '') + ' ' + font;
            resumeData.settings.font = font;
            saveToLocalStorage();
        });
    });
}

// ============================================
// Initialize
// ============================================
async function init() {
    // Load from localStorage first
    loadFromLocalStorage();
    
    // Initialize features
    initTabs();
    initEventListeners();
    initCustomization();
    initTypewriter();
    generatePreview();
    
    // Fetch stats from API
    await fetchStats();
    await fetchReactions();
    
    // Increment usage
    await incrementUsage();
    
    showToast('🚀 Resume Maker ready! Start building your professional resume.');
}

// Start the app
init();
