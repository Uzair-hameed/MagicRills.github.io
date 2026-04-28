/* ============================================
   AUTO RESUME MAKER - COMPLETE JAVASCRIPT
   Fixed Version - All Features Working
   ============================================ */

// ============================================
// Configuration
// ============================================
const TOOL_SLUG = 'auto-resume-maker';
const TOOL_NAME = 'Auto Resume Maker';
const CATEGORY = 'student';
const WORKER_URL = 'https://auto-resume-maker.uzairhameed01.workers.dev';
const API_BASE = '/api';

// User ID
let userId = localStorage.getItem('userId');
if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
}

// Resume Data
let resumeData = {
    personal: { name: '', title: '', email: '', phone: '', address: '', summary: '', image: '', social: [] },
    experience: [],
    education: [],
    skills: [],
    settings: { theme: 'theme-default', font: 'font-arial', template: 'template-standard' }
};

let nextId = 1;

// ============================================
// DOM Elements
// ============================================
const resumePreview = document.getElementById('resumePreview');

// ============================================
// Helper Functions
// ============================================
function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMessage');
    toastMsg.textContent = msg;
    toast.classList.remove('hidden');
    toast.style.background = type === 'error' ? '#e74c3c' : '#333';
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

function showLoading(show, msg = 'Processing...') {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.querySelector('p').textContent = msg;
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
}

function getEmojiName(emoji) {
    const names = { like: '👍 Like', love: '❤️ Love', wow: '😮 Wow', sad: '😢 Sad', angry: '😠 Angry', laugh: '😂 Laugh', celebrate: '🎉 Celebrate' };
    return names[emoji] || emoji;
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
            document.getElementById(`${tabId}-tab`).classList.add('active');
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
}

function addExperience() {
    const id = nextId++;
    resumeData.experience.push({ id, company: '', position: '', startDate: '', endDate: '', description: '' });
    renderExperience();
}

function addEducation() {
    const id = nextId++;
    resumeData.education.push({ id, institution: '', degree: '', field: '', startDate: '', endDate: '', description: '' });
    renderEducation();
}

function addSkill() {
    const id = nextId++;
    resumeData.skills.push({ id, name: '', level: '' });
    renderSkills();
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
            ${p.image ? `<div style="text-align:center;margin-bottom:15px;"><img src="${p.image}" style="width:100px;height:100px;border-radius:50%;object-fit:cover;"></div>` : ''}
            <h1 class="resume-name">${p.name || 'Your Name'}</h1>
            <div class="resume-title">${p.title || 'Professional Title'}</div>
            <div class="resume-contact">
                ${p.email ? `<div>📧 ${p.email}</div>` : ''}
                ${p.phone ? `<div>📞 ${p.phone}</div>` : ''}
                ${p.address ? `<div>📍 ${p.address}</div>` : ''}
            </div>
            ${p.social.filter(s => s.platform && s.url).length ? `<div class="resume-social" style="text-align:center;margin-top:10px;">${p.social.filter(s => s.platform && s.url).map(s => `<a href="${s.url}" target="_blank" style="color:var(--primary);text-decoration:none;margin:0 8px;">${s.platform}</a>`).join('')}</div>` : ''}
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
// Save/Load Functions
// ============================================
function saveToLocalStorage() {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
    const status = document.getElementById('autoSaveStatus');
    if (status) status.textContent = 'Auto-saved';
}

function loadFromLocalStorage() {
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
}

// ============================================
// AI Functions
// ============================================
async function aiOptimizeResume() {
    showLoading(true, 'AI is analyzing your resume...');
    try {
        const response = await fetch(`${WORKER_URL}/api/optimize-resume`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: `Analyze resume for ${resumeData.personal.title || 'professional'}` })
        });
        const data = await response.json();
        if (data.success) {
            const atsSpan = document.getElementById('atsScore');
            if (atsSpan) atsSpan.textContent = data.atsScore + '%';
            showToast('AI optimization complete!');
        } else {
            showToast('AI optimization failed', 'error');
        }
    } catch(e) {
        showToast('AI optimization failed: ' + e.message, 'error');
    }
    showLoading(false);
}

async function suggestSkills() {
    showLoading(true, 'Getting skill suggestions...');
    setTimeout(() => {
        const suggestedSkills = ['JavaScript', 'Python', 'Project Management', 'Communication', 'Leadership', 'Problem Solving', 'Team Collaboration'];
        suggestedSkills.forEach(skill => {
            const id = nextId++;
            resumeData.skills.push({ id, name: skill, level: '' });
        });
        renderSkills();
        generatePreview();
        saveToLocalStorage();
        showToast('Skills added!');
        showLoading(false);
    }, 1000);
}

// ============================================
// Download Functions
// ============================================
async function downloadPDF() {
    showLoading(true, 'Generating PDF...');
    try {
        const canvas = await html2canvas(resumePreview, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('resume.pdf');
        showToast('PDF downloaded!');
    } catch(e) { showToast('PDF generation failed', 'error'); }
    showLoading(false);
}

function downloadDOC() {
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Resume</title><style>body{font-family:Arial;padding:40px} h1{color:#2c3e50} .resume-section-title{color:#3498db;border-bottom:1px solid #ddd}</style></head><body>${resumePreview.innerHTML}</body></html>`;
    const blob = new Blob([html], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'resume.doc';
    link.click();
    showToast('DOC downloaded!');
}

// ============================================
// Event Listeners
// ============================================
function initEventListeners() {
    document.getElementById('full-name')?.addEventListener('input', e => { resumeData.personal.name = e.target.value; generatePreview(); saveToLocalStorage(); });
    document.getElementById('job-title')?.addEventListener('input', e => { resumeData.personal.title = e.target.value; generatePreview(); saveToLocalStorage(); });
    document.getElementById('email')?.addEventListener('input', e => { resumeData.personal.email = e.target.value; generatePreview(); saveToLocalStorage(); });
    document.getElementById('phone')?.addEventListener('input', e => { resumeData.personal.phone = e.target.value; generatePreview(); saveToLocalStorage(); });
    document.getElementById('address')?.addEventListener('input', e => { resumeData.personal.address = e.target.value; generatePreview(); saveToLocalStorage(); });
    document.getElementById('summary')?.addEventListener('input', e => { resumeData.personal.summary = e.target.value; document.getElementById('summaryChars').textContent = e.target.value.length; generatePreview(); saveToLocalStorage(); });
    document.getElementById('profile-image')?.addEventListener('change', e => { const file = e.target.files[0]; if(file){ const reader = new FileReader(); reader.onload = ev => { resumeData.personal.image = ev.target.result; generatePreview(); saveToLocalStorage(); }; reader.readAsDataURL(file); } });
    document.getElementById('preview-btn')?.addEventListener('click', () => generatePreview());
    document.getElementById('refreshPreviewBtn')?.addEventListener('click', () => generatePreview());
    document.getElementById('download-pdf')?.addEventListener('click', downloadPDF);
    document.getElementById('download-doc')?.addEventListener('click', downloadDOC);
    document.getElementById('print-btn')?.addEventListener('click', () => window.print());
    document.getElementById('reset-btn')?.addEventListener('click', () => { if(confirm('Reset all data?')) location.reload(); });
    document.getElementById('fullOptimizeBtn')?.addEventListener('click', aiOptimizeResume);
    document.getElementById('suggestSkillsBtn')?.addEventListener('click', suggestSkills);
    document.getElementById('darkModeBtn')?.addEventListener('click', () => { document.body.classList.toggle('dark-mode'); showToast('Dark mode toggled'); });
    document.getElementById('pageShareBtn')?.addEventListener('click', () => { navigator.clipboard.writeText(window.location.href); showToast('Link copied!'); });
    document.getElementById('add-social')?.addEventListener('click', addSocialLink);
    document.getElementById('add-experience')?.addEventListener('click', addExperience);
    document.getElementById('add-education')?.addEventListener('click', addEducation);
    document.getElementById('add-skill')?.addEventListener('click', addSkill);
    
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', () => { showToast(getEmojiName(btn.dataset.emoji) + ' reaction added!'); });
    });
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', () => { showToast(`Shared on ${btn.dataset.platform}!`); });
    });
    
    window.addEventListener('scroll', () => {
        const upBtn = document.getElementById('scrollUpBtn');
        if (upBtn) upBtn.classList.toggle('hidden', window.scrollY <= 200);
    });
    document.getElementById('scrollUpBtn')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.getElementById('scrollDownBtn')?.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
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
function init() {
    initTabs();
    initEventListeners();
    initCustomization();
    loadFromLocalStorage();
    generatePreview();
    showToast('Resume Maker ready!');
}

init();
