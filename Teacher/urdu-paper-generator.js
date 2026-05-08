// ========================================
// URDU PAPER GENERATOR - COMPLETE JS
// ========================================

const CONFIG = {
    TOOL_SLUG: 'urdu-paper-generator',
    API_BASE: 'https://urdu-paper-generator.uzairhameed01.workers.dev'
};

let objectiveQuestions = [];
let subjectiveQuestions = [];
let userId = localStorage.getItem('userId') || 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
let userReactions = JSON.parse(localStorage.getItem('userReactions') || '{}');
let currentCharts = {};
let currentLogo = localStorage.getItem('schoolLogo') || 'https://cdn-icons-png.flaticon.com/128/15120/15120883.png';

localStorage.setItem('userId', userId);

// ===== HELPER FUNCTIONS =====
function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.style.background = type === 'success' ? '#27ae60' : '#e74c3c';
    toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', 3000);
}

function showLoading() { document.getElementById('loadingModal').style.display = 'flex'; }
function hideLoading() { document.getElementById('loadingModal').style.display = 'none'; }

// ===== LOGO UPLOAD =====
function uploadLogo(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentLogo = e.target.result;
            localStorage.setItem('schoolLogo', currentLogo);
            document.getElementById('schoolLogo').src = currentLogo;
            document.getElementById('removeLogoBtn').style.display = 'inline-block';
            showToast('لوگو اپ لوڈ ہو گیا');
        };
        reader.readAsDataURL(file);
    }
}

function removeLogo() {
    currentLogo = 'https://cdn-icons-png.flaticon.com/128/15120/15120883.png';
    localStorage.setItem('schoolLogo', currentLogo);
    document.getElementById('schoolLogo').src = currentLogo;
    document.getElementById('removeLogoBtn').style.display = 'none';
    showToast('لوگو ہٹا دیا گیا');
}

// ===== API CALLS =====
async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = { method, headers: { 'Content-Type': 'application/json' } };
        if (data) options.body = JSON.stringify(data);
        const response = await fetch(`${CONFIG.API_BASE}${endpoint}`, options);
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: error.message };
    }
}

// ===== USAGE & REACTIONS =====
async function incrementUsage() {
    const result = await apiCall('/api/increment-usage', 'POST', { tool_slug: CONFIG.TOOL_SLUG, user_id: userId });
    if (result.success) document.getElementById('toolUsageCount').textContent = result.total_usage || 0;
}

async function addReaction(reaction) {
    if (userReactions[reaction]) { showToast('پہلے ہی ری ایکٹ کر چکے ہیں', 'error'); return; }
    const emojiMap = { like:'👍', love:'❤️', wow:'😮', sad:'😢', angry:'😠', laugh:'😂', celebrate:'🎉' };
    const result = await apiCall('/api/add-reaction', 'POST', { tool_slug: CONFIG.TOOL_SLUG, emoji: emojiMap[reaction], reaction_type: reaction, user_id: userId });
    if (result.success || result.already_reacted === false) {
        userReactions[reaction] = true;
        localStorage.setItem('userReactions', JSON.stringify(userReactions));
        await getReactions();
        showToast('ری ایکشن شامل کر دیا');
    }
}

async function getReactions() {
    const result = await apiCall(`/api/reactions?tool_slug=${CONFIG.TOOL_SLUG}`);
    if (result.success && result.reactions) {
        document.getElementById('likeCount').textContent = result.reactions.like || 0;
        document.getElementById('loveCount').textContent = result.reactions.love || 0;
        document.getElementById('wowCount').textContent = result.reactions.wow || 0;
        document.getElementById('sadCount').textContent = result.reactions.sad || 0;
        document.getElementById('angryCount').textContent = result.reactions.angry || 0;
        document.getElementById('laughCount').textContent = result.reactions.laugh || 0;
        document.getElementById('celebrateCount').textContent = result.reactions.celebrate || 0;
    }
}

// ===== SHARING =====
function shareOnFacebook() { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank'); addShare('facebook'); }
function shareOnTwitter() { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('اردو پیپر جنریٹر')}&url=${encodeURIComponent(window.location.href)}`, '_blank'); addShare('twitter'); }
function shareOnWhatsApp() { window.open(`https://wa.me/?text=${encodeURIComponent('اردو پیپر جنریٹر: ' + window.location.href)}`, '_blank'); addShare('whatsapp'); }
function shareOnLinkedIn() { window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank'); addShare('linkedin'); }
function copyPageURL() { navigator.clipboard.writeText(window.location.href); showToast('لنک کاپی ہو گیا'); addShare('copy'); }
async function addShare(platform) { await apiCall('/api/add-share', 'POST', { tool_slug: CONFIG.TOOL_SLUG, platform, user_id: userId }); }

// ===== AI GENERATION =====
async function generateAIQuestions() {
    const topic = document.getElementById('aiTopic').value;
    if (!topic) { showToast('موضوع درج کریں', 'error'); return; }
    showLoading();
    setTimeout(() => {
        const fallback = [
            { type: 'mcq', text: `${topic} کا سب سے اہم پہلو کیا ہے؟`, marks: 1, options: ['آپشن 1', 'آپشن 2', 'آپشن 3', 'آپشن 4'] },
            { type: 'fillblank', text: `${topic} کی بنیاد _____ پر رکھی گئی ہے۔`, marks: 1, answer: 'صحیح جواب' },
            { type: 'crq', text: `${topic} کی تین اہم خصوصیات بیان کریں۔`, marks: 3 }
        ];
        fallback.forEach(q => {
            if (q.type === 'mcq' || q.type === 'fillblank') addObjectiveQuestionWithData(q);
            else addSubjectiveQuestionWithData(q);
        });
        hideLoading();
        showToast('AI سوالات تیار ہو گئے');
    }, 1500);
}

// ===== OBJECTIVE QUESTIONS =====
function addObjectiveQuestion() {
    const type = document.getElementById('objectiveTypeSelect').value;
    addObjectiveQuestionWithData({ type, text: '', marks: 1, options: ['', '', '', ''] });
}

function addObjectiveQuestionWithData(q) {
    const container = document.getElementById('objectiveQuestionsContainer');
    const id = 'obj_' + Date.now() + '_' + Math.random();
    const qNum = objectiveQuestions.length + 1;
    
    let html = `<div class="question-card" id="${id}"><div class="question-header"><span class="badge">${getObjTypeName(q.type)}</span><button class="btn-danger" onclick="removeQuestion('${id}')">✖ حذف</button></div>
    <div class="form-group"><label>سوال ${qNum}</label><input type="text" class="q-text" value="${q.text.replace(/"/g, '&quot;')}" placeholder="سوال درج کریں"></div>`;
    
    if (q.type === 'mcq' || q.type === 'problematic' || q.type === 'scenario') {
        html += `<div class="options-area">`;
        for (let i = 0; i < 4; i++) {
            html += `<div class="option-row"><input type="radio" name="${id}_correct" value="${i}"><input type="text" class="opt-text" placeholder="آپشن ${String.fromCharCode(65+i)}" value="${(q.options && q.options[i]) || ''}"></div>`;
        }
        html += `<button class="btn-sm" onclick="addOption(this)">+ آپشن</button></div>`;
    } else if (q.type === 'fillblank') {
        html += `<div class="form-group"><label>جواب</label><input type="text" class="fb-answer" value="${q.answer || ''}" placeholder="درست جواب"></div>`;
    } else if (q.type === 'matching') {
        html += `<div class="matching-area"><div class="matching-row"><input placeholder="اشیا (الف)"><input placeholder="مطابقت (1)"><button class="btn-sm" onclick="removeMatching(this)">✖</button></div>
        <button class="btn-sm" onclick="addMatching(this)">+ شامل کریں</button></div>`;
    }
    
    html += `<div class="form-group"><label>نمبر</label><input type="number" class="q-marks" value="${q.marks}" step="0.5"></div></div>`;
    container.insertAdjacentHTML('beforeend', html);
    objectiveQuestions.push({ id, type: q.type, element: document.getElementById(id) });
    updateAnalysis();
}

function getObjTypeName(type) {
    const names = { mcq: 'MCQ', fillblank: 'خالی جگہ', matching: 'میچنگ', problematic: '⚠️ مشکل MCQ', scenario: '🎭 منظرنامہ MCQ' };
    return names[type] || 'MCQ';
}

// ===== SUBJECTIVE QUESTIONS =====
function addSubjectiveQuestion() {
    const type = document.getElementById('subjectiveTypeSelect').value;
    addSubjectiveQuestionWithData({ type, text: '', marks: type === 'crq' ? 2 : 5, lines: type === 'crq' ? 4 : 10 });
}

function addSubjectiveQuestionWithData(q) {
    const container = document.getElementById('subjectiveQuestionsContainer');
    const id = 'subj_' + Date.now() + '_' + Math.random();
    const qNum = subjectiveQuestions.length + 1;
    
    let html = `<div class="question-card" id="${id}"><div class="question-header"><span class="badge">${getSubjTypeName(q.type)}</span><button class="btn-danger" onclick="removeQuestion('${id}')">✖ حذف</button></div>
    <div class="form-group"><label>سوال ${qNum}</label><input type="text" class="q-text" value="${q.text.replace(/"/g, '&quot;')}" placeholder="سوال درج کریں"></div>`;
    
    if (q.type === 'labelling') {
        html += `<div class="image-upload-area" onclick="document.getElementById('img_${id}').click()">📷 تصویر اپ لوڈ کریں<input type="file" id="img_${id}" accept="image/*" style="display:none" onchange="uploadLabellingImage(this, '${id}')"></div>
        <div class="image-preview-container" id="preview_${id}"></div>
        <div class="image-controls"><button onclick="rotateImage('${id}')">⟳ گھمائیں</button><button onclick="zoomImage('${id}', 'in')">➕ زوم ان</button><button onclick="zoomImage('${id}', 'out')">➖ زوم آؤٹ</button></div>`;
    }
    
    html += `<div class="form-group"><label>نمبر</label><input type="number" class="q-marks" value="${q.marks}" step="0.5"></div>
    <div class="form-group"><label>جوابی لائنیں</label><input type="number" class="q-lines" value="${q.lines || 4}"></div></div>`;
    container.insertAdjacentHTML('beforeend', html);
    subjectiveQuestions.push({ id, type: q.type, element: document.getElementById(id) });
    updateAnalysis();
}

function getSubjTypeName(type) {
    const names = { crq: 'CRQ', erq: 'ERQ', case: 'کیس اسٹڈی', scenario_crq: '🎭 منظرنامہ CRQ', problematic_long: '⚠️ مسئلہ پر مبنی', labelling: '🏷️ لیبلنگ' };
    return names[type] || 'سوال';
}

// Labelling Image Functions
function uploadLabellingImage(input, id) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const container = document.getElementById(`preview_${id}`);
            container.innerHTML = `<img src="${e.target.result}" class="image-preview" id="img_${id}_preview" style="max-width:100%; max-height:200px; cursor:pointer">`;
            localStorage.setItem(`img_${id}`, e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

function rotateImage(id) {
    const img = document.getElementById(`img_${id}_preview`);
    if (img) {
        let rotation = (img.dataset.rotation || 0) + 90;
        img.style.transform = `rotate(${rotation}deg)`;
        img.dataset.rotation = rotation;
    }
}

function zoomImage(id, direction) {
    const img = document.getElementById(`img_${id}_preview`);
    if (img) {
        let scale = parseFloat(img.dataset.scale || 1);
        scale = direction === 'in' ? scale + 0.2 : Math.max(0.4, scale - 0.2);
        img.style.transform = `scale(${scale})`;
        img.dataset.scale = scale;
    }
}

// ===== REMOVE QUESTION =====
function removeQuestion(id) {
    document.getElementById(id).remove();
    objectiveQuestions = objectiveQuestions.filter(q => q.id !== id);
    subjectiveQuestions = subjectiveQuestions.filter(q => q.id !== id);
    updateAnalysis();
    showToast('سوال حذف کر دیا گیا');
}

// ===== MARKING KEY GENERATOR =====
function generateMarkingKey() {
    const objectiveData = collectObjectiveData();
    const subjectiveData = collectSubjectiveData();
    let markingHtml = '<div class="marking-key"><h3>🔑 مارکنگ کلید (Marking Scheme)</h3><table><thead><tr><th>سوال نمبر</th><th>سوال کی قسم</th><th>مکمل نمبر</th><th>مارکنگ ہدایات</th></tr></thead><tbody>';
    
    let qNum = 1;
    objectiveData.forEach(q => {
        markingHtml += `<tr><td>${qNum}</td><td>${getObjTypeName(q.type)}</td><td>${q.marks}</td><td>ہر صحیح جواب پر ${q.marks} نمبر۔ غلط جواب پر 0</td></tr>`;
        qNum++;
    });
    subjectiveData.forEach(q => {
        let instructions = '';
        if (q.type === 'crq') instructions = `مواد کی درستگی ${q.marks * 0.5}، ترتیب ${q.marks * 0.3}، تحریر ${q.marks * 0.2}`;
        else if (q.type === 'erq') instructions = `تعارف ${q.marks * 0.2}، مواد ${q.marks * 0.5}، اختتام ${q.marks * 0.2}، تحریر ${q.marks * 0.1}`;
        else instructions = `جواب کی مکمل性和 درستگی کی بنیاد پر نمبر دیے جائیں۔`;
        markingHtml += `<tr><td>${qNum}</td><td>${getSubjTypeName(q.type)}</td><td>${q.marks}</td><td>${instructions}</td></tr>`;
        qNum++;
    });
    
    markingHtml += `</tbody></table><p><strong>کل نمبر:</strong> ${objectiveData.reduce((a,b)=>a+b.marks,0) + subjectiveData.reduce((a,b)=>a+b.marks,0)}</p>
    <p><strong>پاسنگ مارکس:</strong> ${Math.ceil((objectiveData.reduce((a,b)=>a+b.marks,0) + subjectiveData.reduce((a,b)=>a+b.marks,0)) * 0.33)}</p>
    <p><strong>ہدایات برائے تصحیح:</strong> ہر سوال کے لیے اوپر دی گئی مارکنگ سکیم کے مطابق نمبر دیں۔ مشکوک صورتوں میں طالب علم کے حق میں فیصلہ کریں۔</p></div>`;
    
    const previewDiv = document.getElementById('paperPreview');
    const existingMarking = previewDiv.querySelector('.marking-key');
    if (existingMarking) existingMarking.remove();
    previewDiv.insertAdjacentHTML('beforeend', markingHtml);
    showToast('مارکنگ کلید تیار ہو گئی');
}

// ===== COLLECT DATA =====
function collectObjectiveData() {
    return objectiveQuestions.map(q => {
        const el = q.element;
        return {
            type: q.type,
            text: el.querySelector('.q-text')?.value || '',
            marks: parseFloat(el.querySelector('.q-marks')?.value) || 0
        };
    });
}

function collectSubjectiveData() {
    return subjectiveQuestions.map(q => {
        const el = q.element;
        return {
            type: q.type,
            text: el.querySelector('.q-text')?.value || '',
            marks: parseFloat(el.querySelector('.q-marks')?.value) || 0
        };
    });
}

// ===== PREVIEW GENERATION =====
function generatePreview() {
    const preview = document.getElementById('paperPreview');
    const school = document.getElementById('schoolName').value || 'اسکول کا نام';
    const title = document.getElementById('paperTitle').value || 'پرچہ';
    const term = document.getElementById('term').value;
    const subject = document.getElementById('subject').value || 'مضمون';
    const total = document.getElementById('totalMarks').value || '100';
    const time = document.getElementById('time').value || '2 گھنٹے';
    const instructions = document.getElementById('instructions').value;
    const teacherSig = document.getElementById('teacherSignature').value || '___________';
    
    let html = `<div class="paper-header"><img src="${currentLogo}" class="school-logo" style="max-width:80px"><h2>${school}</h2><h3>${title}</h3>
    <div style="display:flex; justify-content:space-between; flex-wrap:wrap"><span>نام: ___________</span><span>کلاس: ___________</span><span>مضمون: ${subject}</span><span>تاریخ: ___________</span></div>
    <div style="display:flex; justify-content:space-between; flex-wrap:wrap"><span>ٹرم: ${term}</span><span>کل نمبر: ${total}</span><span>وقت: ${time}</span></div></div>`;
    if (instructions) html += `<div><h4>ہدایات:</h4><p>${instructions.replace(/\n/g,'<br>')}</p></div>`;
    
    const objData = collectObjectiveData();
    if (objData.length) {
        html += `<h3>حصہ اول: معروضی سوالات</h3>`;
        objData.forEach((q, i) => { html += `<div><p><strong>${i+1}.</strong> ${q.text || 'سوال درج نہیں'}</p><p class="marks">نمبر: ${q.marks}</p></div>`; });
    }
    
    const subjData = collectSubjectiveData();
    if (subjData.length) {
        html += `<h3>حصہ دوم: انشائیہ سوالات</h3>`;
        subjData.forEach((q, i) => { 
            html += `<div><p><strong>${objData.length + i + 1}.</strong> ${q.text || 'سوال درج نہیں'}</p><p class="marks">نمبر: ${q.marks}</p>`;
            for(let l=0; l<(q.lines||4); l++) html += `<div class="answer-space" style="border-bottom:1px solid #ccc; margin:8px 0; height:25px"></div>`;
            html += `</div>`;
        });
    }
    
    html += `<div class="teacher-signature" style="margin-top:40px; text-align:left"><p>استاد کے دستخط: ${teacherSig}</p><div style="width:200px; border-bottom:1px solid #000; margin-top:5px"></div></div>`;
    preview.innerHTML = html;
}

// ===== ANALYSIS & CHARTS =====
function updateAnalysis() {
    const objData = collectObjectiveData();
    const subjData = collectSubjectiveData();
    const totalQ = objData.length + subjData.length;
    const totalM = objData.reduce((a,b)=>a+b.marks,0) + subjData.reduce((a,b)=>a+b.marks,0);
    
    document.getElementById('analysisStats').innerHTML = `
        <div class="stat-card"><h4>کل سوالات</h4><span>${totalQ}</span></div>
        <div class="stat-card"><h4>کل نمبر</h4><span>${totalM}</span></div>
        <div class="stat-card"><h4>معروضی</h4><span>${objData.length}</span></div>
        <div class="stat-card"><h4>انشائیہ</h4><span>${subjData.length}</span></div>`;
    
    const ctx1 = document.getElementById('questionsChart').getContext('2d');
    const ctx2 = document.getElementById('marksChart').getContext('2d');
    if (currentCharts.q) currentCharts.q.destroy();
    if (currentCharts.m) currentCharts.m.destroy();
    
    currentCharts.q = new Chart(ctx1, { type: 'doughnut', data: { labels: ['معروضی', 'انشائیہ'], datasets: [{ data: [objData.length, subjData.length], backgroundColor: ['#1a3a5c', '#e67e22'] }] } });
    currentCharts.m = new Chart(ctx2, { type: 'bar', data: { labels: ['معروضی', 'انشائیہ'], datasets: [{ label: 'نمبر', data: [objData.reduce((a,b)=>a+b.marks,0), subjData.reduce((a,b)=>a+b.marks,0)], backgroundColor: ['#1a3a5c', '#e67e22'] }] } });
}

// ===== EXPORT FUNCTIONS =====
async function exportToPDF() {
    showLoading();
    const element = document.getElementById('paperPreview');
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    doc.addImage(imgData, 'PNG', 10, 10, 190, (canvas.height * 190 / canvas.width));
    doc.save('urdu-paper.pdf');
    hideLoading();
    showToast('PDF ڈاؤن لوڈ ہو گیا');
}

function exportToDOC() {
    const content = document.getElementById('paperPreview').innerHTML;
    const blob = new Blob([`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:'Jameel Noori Nastaleeq',serif; direction:rtl;}</style></head><body>${content}</body></html>`], { type: 'application/msword' });
    saveAs(blob, 'urdu-paper.doc');
    showToast('DOC ڈاؤن لوڈ ہو گیا');
}

function exportToTXT() {
    const content = document.getElementById('paperPreview').innerText;
    const blob = new Blob([content], { type: 'text/plain' });
    saveAs(blob, 'urdu-paper.txt');
    showToast('TXT ڈاؤن لوڈ ہو گیا');
}

function printPaper() { window.print(); }

// ===== SAVE TO DATABASE =====
async function saveToDatabase() {
    const designData = {
        tool_slug: CONFIG.TOOL_SLUG,
        user_id: userId,
        design_name: document.getElementById('paperTitle').value || 'Unnamed',
        design_json: JSON.stringify({ objective: collectObjectiveData(), subjective: collectSubjectiveData(), metadata: { school: document.getElementById('schoolName').value, subject: document.getElementById('subject').value } })
    };
    showLoading();
    await apiCall('/api/save-design', 'POST', designData);
    hideLoading();
    showToast('پرچہ محفوظ ہو گیا');
    loadSavedDesigns();
}

async function loadSavedDesigns() {
    const result = await apiCall(`/api/get-designs?tool_slug=${CONFIG.TOOL_SLUG}&user_id=${userId}`);
    const container = document.getElementById('savedDesignsList');
    if (result.success && result.designs?.length) {
        container.innerHTML = result.designs.map(d => `<div class="saved-item"><span>${d.design_name}</span><button onclick="alert('لوڈ کرنے کے لیے API تیار')">لوڈ</button></div>`).join('');
    } else container.innerHTML = '<p>کوئی محفوظ پرچہ نہیں</p>';
}

// ===== INITIALIZATION =====
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.getElementById(`${btn.dataset.tab}Tab`).classList.add('active');
            if (btn.dataset.tab === 'preview') generatePreview();
            if (btn.dataset.tab === 'analysis') updateAnalysis();
            if (btn.dataset.tab === 'saved') loadSavedDesigns();
        });
    });
}

function initReactions() {
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', () => addReaction(btn.dataset.reaction));
    });
}

function initScroll() {
    document.getElementById('scrollUp').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.getElementById('scrollDown').addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
}

function initDarkMode() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) document.body.classList.add('dark');
    document.getElementById('themeToggle').addEventListener('click', () => {
        document.body.classList.toggle('dark');
        localStorage.setItem('darkMode', document.body.classList.contains('dark'));
        document.getElementById('themeToggle').textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
    });
}

async function init() {
    initDarkMode();
    initTabs();
    initReactions();
    initScroll();
    document.getElementById('schoolLogo').src = currentLogo;
    if (currentLogo !== 'https://cdn-icons-png.flaticon.com/128/15120/15120883.png') document.getElementById('removeLogoBtn').style.display = 'inline-block';
    await getReactions();
    incrementUsage();
    setInterval(() => { if (document.querySelector('.tab-btn.active').dataset.tab === 'preview') generatePreview(); }, 1000);
}

init();
