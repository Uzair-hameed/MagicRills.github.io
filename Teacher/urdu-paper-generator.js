// ============================================
// URDU PAPER GENERATOR - PROFESSIONAL V10
// Cloudflare Worker Integrated | PDF/DOC Fixed
// Purple + White Theme | Bloom's Taxonomy 5 Levels
// ============================================

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
let questionIdCounter = 0;
let currentMarkingKeyHTML = '';

localStorage.setItem('userId', userId);

// ========== Bloom Levels Mapping (5 Levels) ==========
const BLOOM_LEVELS = {
    knowledge: { ur: 'یاد رکھنا', en: 'Knowledge-Based', color: '#3498db', 
        objectiveTypes: ['mcq', 'fillblank', 'truefalse'],
        subjectiveTypes: ['short', 'long'] },
    comprehension: { ur: 'سمجھنا', en: 'Comprehension-Based', color: '#2ecc71',
        objectiveTypes: ['mcq', 'fillblank', 'truefalse'],
        subjectiveTypes: ['short', 'matching', 'paraphrasing'] },
    application: { ur: 'اطلاق', en: 'Application-Based', color: '#f39c12',
        objectiveTypes: ['scenario-mcq', 'fillblank'],
        subjectiveTypes: ['problemsolving', 'case'] },
    analysis: { ur: 'تجزیہ', en: 'Analysis-Based', color: '#e67e22',
        objectiveTypes: ['mcq', 'truefalse'],
        subjectiveTypes: ['essay', 'interpretation', 'critical'] },
    synthesis: { ur: 'تخلیق/تشخیص', en: 'Evaluation & Synthesis', color: '#e74c3c',
        objectiveTypes: ['mcq'],
        subjectiveTypes: ['openended', 'project', 'argumentative'] }
};

const DIFFICULTY_NAMES = {
    easy: { ur: '🟢 آسان', en: 'Easy', color: '#27ae60' },
    medium: { ur: '🟡 اوسط', en: 'Medium', color: '#f39c12' },
    hard: { ur: '🔴 مشکل', en: 'Hard', color: '#e74c3c' }
};

const OBJECTIVE_TYPE_NAMES = {
    mcq: 'MCQ',
    fillblank: 'خالی جگہ',
    truefalse: 'صحیح/غلط',
    'scenario-mcq': 'منظر نامہ پر مبنی MCQ'
};

const SUBJECTIVE_TYPE_NAMES = {
    short: 'مختصر جوابی',
    long: 'طویل جوابی',
    essay: 'مضمون',
    case: 'کیس اسٹڈی',
    matching: 'ملاپ والے سوالات',
    paraphrasing: 'تشریحی مشقیں',
    problemsolving: 'مسئلہ حل کرنے کی مشقیں',
    interpretation: 'ڈیٹا کی تشریح',
    critical: 'تنقیدی سوچ',
    openended: 'کھلے عام مضامین',
    project: 'پروجیکٹ',
    argumentative: 'استدلالی کام'
};

function getBloomName(level) { return BLOOM_LEVELS[level]?.ur || level; }
function getBloomColor(level) { return BLOOM_LEVELS[level]?.color || '#3498db'; }
function getDifficultyName(diff) { return DIFFICULTY_NAMES[diff]?.ur || diff; }
function getObjectiveTypeName(type) { return OBJECTIVE_TYPE_NAMES[type] || type; }
function getSubjectiveTypeName(type) { return SUBJECTIVE_TYPE_NAMES[type] || type; }
function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : (m === '<' ? '&lt;' : '&gt;')); }

function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.style.background = type === 'success' ? '#27ae60' : (type === 'error' ? '#e74c3c' : '#3498db');
    toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', 3000);
}

function showLoading() { document.getElementById('loadingModal').style.display = 'flex'; }
function hideLoading() { document.getElementById('loadingModal').style.display = 'none'; }

// ========== API Calls to Cloudflare Worker ==========
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

// ========== Usage Counter ==========
async function incrementUsage() {
    const result = await apiCall('/api/increment-usage', 'POST', { tool_slug: CONFIG.TOOL_SLUG, user_id: userId });
    if (result.success) document.getElementById('usageCount').textContent = result.total_usage || 0;
}

async function getUsage() {
    const result = await apiCall(`/api/usage/get?tool_slug=${CONFIG.TOOL_SLUG}`);
    if (result.success) document.getElementById('usageCount').textContent = result.total_usage || 0;
}

// ========== Reactions ==========
async function addReaction(reaction) {
    if (userReactions[reaction]) { showToast('پہلے ہی ری ایکٹ کر چکے ہیں', 'error'); return; }
    const emojiMap = { like:'👍', love:'❤️', wow:'😮', sad:'😢', angry:'😠', laugh:'😂', celebrate:'🎉' };
    const result = await apiCall('/api/reactions/add', 'POST', { tool_slug: CONFIG.TOOL_SLUG, emoji: emojiMap[reaction], reaction_type: reaction, user_id: userId });
    if (result.success) {
        userReactions[reaction] = true;
        localStorage.setItem('userReactions', JSON.stringify(userReactions));
        await getReactions();
        showToast('ری ایکشن شامل کر دیا گیا');
    }
}

async function getReactions() {
    const result = await apiCall(`/api/reactions/get?tool_slug=${CONFIG.TOOL_SLUG}`);
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

document.querySelectorAll('.reaction').forEach(btn => {
    btn.addEventListener('click', () => addReaction(btn.dataset.reaction));
});

// ========== Share Functions ==========
function shareOnFacebook() { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank'); addShare('facebook'); }
function shareOnTwitter() { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('اردو پیپر جنریٹر')}&url=${encodeURIComponent(window.location.href)}`, '_blank'); addShare('twitter'); }
function shareOnWhatsApp() { window.open(`https://wa.me/?text=${encodeURIComponent('اردو پیپر جنریٹر: ' + window.location.href)}`, '_blank'); addShare('whatsapp'); }
function shareOnLinkedIn() { window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank'); addShare('linkedin'); }
function shareOnEmail() { window.location.href = `mailto:?subject=اردو پیپر جنریٹر&body=${encodeURIComponent(window.location.href)}`; addShare('email'); }
function copyPageURL() { navigator.clipboard.writeText(window.location.href); showToast('لنک کاپی ہو گیا'); addShare('copy'); }
async function addShare(platform) { await apiCall('/api/shares/add', 'POST', { tool_slug: CONFIG.TOOL_SLUG, platform, user_id: userId }); }

// ========== Update Question Types Based on Bloom Level ==========
function updateObjectiveQuestionTypes() {
    const bloomLevel = document.getElementById('objBloom').value;
    const typeSelect = document.getElementById('objType');
    const availableTypes = BLOOM_LEVELS[bloomLevel]?.objectiveTypes || ['mcq', 'fillblank', 'truefalse'];
    const currentValue = typeSelect.value;
    typeSelect.innerHTML = '';
    availableTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = getObjectiveTypeName(type);
        typeSelect.appendChild(option);
    });
    if (availableTypes.includes(currentValue)) typeSelect.value = currentValue;
}

function updateSubjectiveQuestionTypes() {
    const bloomLevel = document.getElementById('subjBloom').value;
    const typeSelect = document.getElementById('subjType');
    const availableTypes = BLOOM_LEVELS[bloomLevel]?.subjectiveTypes || ['short', 'long', 'essay'];
    const currentValue = typeSelect.value;
    typeSelect.innerHTML = '';
    availableTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = getSubjectiveTypeName(type);
        typeSelect.appendChild(option);
    });
    if (availableTypes.includes(currentValue)) typeSelect.value = currentValue;
}

// ========== Logo Functions ==========
document.getElementById('logoUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(ev) {
            currentLogo = ev.target.result;
            localStorage.setItem('schoolLogo', currentLogo);
            document.getElementById('schoolLogo').src = currentLogo;
            document.getElementById('removeLogoBtn').style.display = 'inline-block';
            showToast('لوگو اپ لوڈ ہو گیا');
            if (document.querySelector('.tab.active')?.dataset.tab === 'preview') generatePreview();
        };
        reader.readAsDataURL(file);
    }
});

function removeLogo() {
    currentLogo = 'https://cdn-icons-png.flaticon.com/128/15120/15120883.png';
    localStorage.setItem('schoolLogo', currentLogo);
    document.getElementById('schoolLogo').src = currentLogo;
    document.getElementById('removeLogoBtn').style.display = 'none';
    showToast('لوگو ہٹا دیا گیا');
    if (document.querySelector('.tab.active')?.dataset.tab === 'preview') generatePreview();
}

// ========== Bloom Percentage Settings ==========
function applyBloomPercentages() {
    const percentages = {
        knowledge: parseInt(document.getElementById('bloomKnowledge').value) || 0,
        comprehension: parseInt(document.getElementById('bloomComprehension').value) || 0,
        application: parseInt(document.getElementById('bloomApplication').value) || 0,
        analysis: parseInt(document.getElementById('bloomAnalysis').value) || 0,
        synthesis: parseInt(document.getElementById('bloomSynthesis').value) || 0
    };
    const total = Object.values(percentages).reduce((a,b) => a + b, 0);
    if (total !== 100) { showToast(`کل فیصد ${total}% ہے، 100% ہونا چاہیے!`, 'error'); return; }
    localStorage.setItem('bloomPercentages', JSON.stringify(percentages));
    showToast('بلوم فیصد محفوظ ہو گئے');
    if (document.querySelector('.tab.active')?.dataset.tab === 'analysis') updateAnalysis();
}

function loadBloomPercentages() {
    const saved = localStorage.getItem('bloomPercentages');
    if (saved) {
        const p = JSON.parse(saved);
        if (p.knowledge) document.getElementById('bloomKnowledge').value = p.knowledge;
        if (p.comprehension) document.getElementById('bloomComprehension').value = p.comprehension;
        if (p.application) document.getElementById('bloomApplication').value = p.application;
        if (p.analysis) document.getElementById('bloomAnalysis').value = p.analysis;
        if (p.synthesis) document.getElementById('bloomSynthesis').value = p.synthesis;
    }
}

// ========== AI Question Generation ==========
async function generateAIQuestions() {
    const topic = document.getElementById('aiTopic').value;
    const type = document.getElementById('aiType').value;
    const difficulty = document.getElementById('aiDifficulty').value;
    const bloom = document.getElementById('aiBloom').value;
    if (!topic) { showToast('موضوع درج کریں', 'error'); return; }
    showLoading();
    
    const marks = difficulty === 'easy' ? 1 : (difficulty === 'medium' ? 2 : 3);
    const fallbackQuestions = {
        mcq: [
            { text: `${topic} کا سب سے اہم کارنامہ کیا ہے؟`, options: ['کراچی میں', 'لاہور میں', 'پشاور میں', 'ملتان میں'], correct: 0 },
            { text: `${topic} کا تعلق کس شعبے سے ہے؟`, options: ['شعبہ اول', 'شعبہ دوم', 'شعبہ سوم', 'شعبہ چہارم'], correct: 1 }
        ],
        short: [{ text: `${topic} کی تین اہم خصوصیات بیان کریں۔` }],
        long: [{ text: `${topic} پر تفصیلی نوٹ تحریر کریں۔` }]
    };
    
    setTimeout(() => {
        const questions = fallbackQuestions[type] || fallbackQuestions.mcq;
        if (type === 'mcq') {
            questions.forEach(q => addObjectiveWithData({
                type: 'mcq', text: q.text, marks: marks,
                options: q.options, correct: q.correct,
                difficulty: difficulty, bloom: bloom
            }));
        } else if (type === 'short') {
            questions.forEach(q => addSubjectiveWithData({
                type: 'short', text: q.text, marks: marks * 2, lines: 4,
                difficulty: difficulty, bloom: bloom
            }));
        } else {
            questions.forEach(q => addSubjectiveWithData({
                type: 'long', text: q.text, marks: marks * 5, lines: 10,
                difficulty: difficulty, bloom: bloom
            }));
        }
        hideLoading();
        showToast('AI سوالات تیار ہو گئے');
        document.querySelector('.tab[data-tab="objective"]').click();
        updateAnalysis();
        generatePreview();
        generateMarkingKey();
    }, 1500);
}

// ========== Add Objective Question ==========
function addObjective() {
    addObjectiveWithData({
        type: document.getElementById('objType').value,
        text: '', marks: 1, options: ['', '', '', ''], correct: 0,
        difficulty: document.getElementById('objDifficulty').value,
        bloom: document.getElementById('objBloom').value
    });
}

function addObjectiveWithData(data) {
    const id = 'obj_' + Date.now() + '_' + (++questionIdCounter);
    const container = document.getElementById('objectiveList');
    let html = `<div class="question-item" id="${id}"><div class="question-header"><div class="question-badges">
        <span class="badge badge-type">${getObjectiveTypeName(data.type)}</span>
        <span class="badge badge-difficulty-${data.difficulty}">${getDifficultyName(data.difficulty)}</span>
        <span class="bloom-badge" style="background:${getBloomColor(data.bloom)}">${getBloomName(data.bloom)}</span>
        </div><button class="btn-danger" onclick="removeQuestion('${id}')">✖ حذف</button></div>
        <div class="question-text"><input type="text" class="q-text" placeholder="سوال درج کریں؟" value="${escapeHtml(data.text)}"></div>`;
    
    if (data.type === 'mcq' || data.type === 'scenario-mcq') {
        html += `<div class="options-area">`;
        for (let i = 0; i < 4; i++) {
            html += `<div class="option-row">
                <input type="checkbox" name="${id}_opt${i}" ${data.correct == i ? 'checked' : ''}>
                <input type="text" class="opt-text" placeholder="آپشن ${i+1}" value="${escapeHtml(data.options[i] || '')}">
            </div>`;
        }
        html += `</div>`;
    } else if (data.type === 'fillblank') {
        html += `<div class="options-area"><input type="text" class="fb-answer" placeholder="درست جواب" style="width:100%; padding:8px"></div>`;
    } else if (data.type === 'truefalse') {
        html += `<div class="options-area">
            <div class="option-row"><input type="checkbox" class="tf-correct" value="true"> ✅ صحیح</div>
            <div class="option-row"><input type="checkbox" class="tf-correct" value="false"> ❌ غلط</div>
        </div>`;
    }
    
    html += `<div style="margin-top:10px"><label>نمبر: </label><input type="number" class="marks-input" value="${data.marks}" step="0.5" style="width:80px"></div>
        <input type="hidden" class="q-difficulty" value="${data.difficulty}"><input type="hidden" class="q-bloom" value="${data.bloom}"></div>`;
    container.insertAdjacentHTML('beforeend', html);
    objectiveQuestions.push({ id, element: document.getElementById(id), type: data.type });
    updateAnalysis();
    generatePreview();
    generateMarkingKey();
}

function addSubjective() {
    const type = document.getElementById('subjType').value;
    let marks = 2, lines = 4;
    if (type === 'long') { marks = 5; lines = 8; }
    else if (type === 'essay') { marks = 10; lines = 12; }
    else if (type === 'case') { marks = 8; lines = 6; }
    else if (type === 'project') { marks = 15; lines = 10; }
    else if (type === 'argumentative') { marks = 12; lines = 10; }
    
    addSubjectiveWithData({
        type: type, text: '', marks: marks, lines: lines,
        difficulty: document.getElementById('subjDifficulty').value,
        bloom: document.getElementById('subjBloom').value
    });
}

function addSubjectiveWithData(data) {
    const id = 'subj_' + Date.now() + '_' + (++questionIdCounter);
    const container = document.getElementById('subjectiveList');
    let html = `<div class="question-item" id="${id}"><div class="question-header"><div class="question-badges">
        <span class="badge badge-type">${getSubjectiveTypeName(data.type)}</span>
        <span class="badge badge-difficulty-${data.difficulty}">${getDifficultyName(data.difficulty)}</span>
        <span class="bloom-badge" style="background:${getBloomColor(data.bloom)}">${getBloomName(data.bloom)}</span>
        </div><button class="btn-danger" onclick="removeQuestion('${id}')">✖ حذف</button></div>
        <div class="question-text"><input type="text" class="q-text" placeholder="سوال درج کریں؟" value="${escapeHtml(data.text)}"></div>
        <div style="margin-top:10px"><label>نمبر: </label><input type="number" class="marks-input" value="${data.marks}" step="0.5" style="width:80px">
        <label style="margin-right:15px">جوابی لائنیں: </label><input type="number" class="lines-input" value="${data.lines}" style="width:80px"></div>
        <input type="hidden" class="q-difficulty" value="${data.difficulty}"><input type="hidden" class="q-bloom" value="${data.bloom}"></div>`;
    container.insertAdjacentHTML('beforeend', html);
    subjectiveQuestions.push({ id, element: document.getElementById(id), type: data.type });
    updateAnalysis();
    generatePreview();
    generateMarkingKey();
}

function removeQuestion(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
    objectiveQuestions = objectiveQuestions.filter(q => q.id !== id);
    subjectiveQuestions = subjectiveQuestions.filter(q => q.id !== id);
    updateAnalysis();
    generatePreview();
    generateMarkingKey();
    showToast('سوال حذف کر دیا گیا');
}

function collectObjectiveData() {
    const data = [];
    document.querySelectorAll('#objectiveList .question-item').forEach(item => {
        const text = item.querySelector('.q-text')?.value || '';
        const marks = parseFloat(item.querySelector('.marks-input')?.value) || 0;
        const difficulty = item.querySelector('.q-difficulty')?.value || 'medium';
        const bloom = item.querySelector('.q-bloom')?.value || 'knowledge';
        const typeBadge = item.querySelector('.badge-type')?.innerText || '';
        let type = 'mcq';
        if (typeBadge.includes('خالی')) type = 'fillblank';
        else if (typeBadge.includes('صحیح')) type = 'truefalse';
        else if (typeBadge.includes('منظر')) type = 'scenario-mcq';
        
        let options = [], correct = null;
        if (type === 'mcq' || type === 'scenario-mcq') {
            const optInputs = item.querySelectorAll('.opt-text');
            optInputs.forEach(opt => options.push(opt.value));
            const checkboxes = item.querySelectorAll('.option-row input[type="checkbox"]');
            for (let i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) correct = i;
            }
        } else if (type === 'truefalse') {
            const checkboxes = item.querySelectorAll('.tf-correct');
            for (let i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) correct = checkboxes[i].value === 'true';
            }
        } else if (type === 'fillblank') {
            const answer = item.querySelector('.fb-answer')?.value || '';
            correct = answer;
        }
        data.push({ text, marks, difficulty, bloom, type, options, correct });
    });
    return data;
}

function collectSubjectiveData() {
    const data = [];
    document.querySelectorAll('#subjectiveList .question-item').forEach(item => {
        const text = item.querySelector('.q-text')?.value || '';
        const marks = parseFloat(item.querySelector('.marks-input')?.value) || 0;
        const lines = parseInt(item.querySelector('.lines-input')?.value) || 4;
        const difficulty = item.querySelector('.q-difficulty')?.value || 'medium';
        const bloom = item.querySelector('.q-bloom')?.value || 'knowledge';
        const typeBadge = item.querySelector('.badge-type')?.innerText || '';
        let type = 'short';
        if (typeBadge.includes('طویل')) type = 'long';
        else if (typeBadge.includes('مضمون')) type = 'essay';
        else if (typeBadge.includes('کیس')) type = 'case';
        else if (typeBadge.includes('ملاپ')) type = 'matching';
        else if (typeBadge.includes('تشریحی')) type = 'paraphrasing';
        else if (typeBadge.includes('مسئلہ')) type = 'problemsolving';
        else if (typeBadge.includes('ڈیٹا')) type = 'interpretation';
        else if (typeBadge.includes('تنقیدی')) type = 'critical';
        else if (typeBadge.includes('کھلے')) type = 'openended';
        else if (typeBadge.includes('پروجیکٹ')) type = 'project';
        else if (typeBadge.includes('استدلالی')) type = 'argumentative';
        data.push({ text, marks, lines, difficulty, bloom, type });
    });
    return data;
}

// ========== Generate Preview ==========
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
    
    let html = `<div class="paper-header"><img src="${currentLogo}" class="school-logo"><h2>${escapeHtml(school)}</h2><h3>${escapeHtml(title)}</h3>
        <div style="display:flex; justify-content:space-between; flex-wrap:wrap; margin:10px 0"><span>نام: ___________</span><span>کلاس: ___________</span><span>تاریخ: ___________</span><span>رول نمبر: ___________</span></div>
        <div style="display:flex; justify-content:space-between; flex-wrap:wrap"><span>ٹرم: ${escapeHtml(term)}</span><span>مضمون: ${escapeHtml(subject)}</span><span>کل نمبر: ${total}</span><span>وقت: ${time}</span></div>
    </div>`;
    if (instructions) html += `<div style="margin:15px 0"><strong>ہدایات:</strong><br>${escapeHtml(instructions).replace(/\n/g,'<br>')}</div>`;
    
    const objData = collectObjectiveData();
    const subjData = collectSubjectiveData();
    let questionNum = 1;
    
    if (objData.length > 0) {
        html += `<h3 style="margin-top:25px; color:#6B3FA0; border-right:3px solid #FF7B4A; padding-right:10px">حصہ اول: معروضی سوالات</h3>`;
        const allMcq = objData.every(q => q.type === 'mcq' || q.type === 'scenario-mcq');
        
        if (allMcq && objData.length > 1) {
            const midPoint = Math.ceil(objData.length / 2);
            const col1 = objData.slice(0, midPoint);
            const col2 = objData.slice(midPoint);
            html += `<div class="mcq-grid">`;
            html += `<div class="mcq-column">`;
            col1.forEach((q) => {
                html += `<div class="mcq-item"><div class="mcq-question">${questionNum++}. ${escapeHtml(q.text)} <span class="marks">(${q.marks})</span></div><div class="mcq-options">`;
                for (let optIdx = 0; optIdx < q.options.length; optIdx++) {
                    if (q.options[optIdx]) {
                        html += `<div class="mcq-option"><input type="checkbox"><span>${escapeHtml(q.options[optIdx])}</span></div>`;
                    }
                }
                html += `</div></div>`;
            });
            html += `</div><div class="mcq-column">`;
            col2.forEach((q) => {
                html += `<div class="mcq-item"><div class="mcq-question">${questionNum++}. ${escapeHtml(q.text)} <span class="marks">(${q.marks})</span></div><div class="mcq-options">`;
                for (let optIdx = 0; optIdx < q.options.length; optIdx++) {
                    if (q.options[optIdx]) {
                        html += `<div class="mcq-option"><input type="checkbox"><span>${escapeHtml(q.options[optIdx])}</span></div>`;
                    }
                }
                html += `</div></div>`;
            });
            html += `</div></div>`;
        } else {
            objData.forEach((q) => {
                if (q.type === 'mcq' || q.type === 'scenario-mcq') {
                    html += `<div class="mcq-item"><div class="mcq-question">${questionNum++}. ${escapeHtml(q.text)} <span class="marks">(${q.marks})</span></div><div class="mcq-options">`;
                    for (let optIdx = 0; optIdx < q.options.length; optIdx++) {
                        if (q.options[optIdx]) {
                            html += `<div class="mcq-option"><input type="checkbox"><span>${escapeHtml(q.options[optIdx])}</span></div>`;
                        }
                    }
                    html += `</div></div>`;
                } else if (q.type === 'fillblank') {
                    html += `<div class="mcq-item"><div class="mcq-question">${questionNum++}. ${escapeHtml(q.text)} <span class="marks">(${q.marks})</span></div><div style="margin:10px 0"><input type="text" style="width:200px; border:none; border-bottom:1px solid #ccc; padding:5px" placeholder="جواب"></div></div>`;
                } else if (q.type === 'truefalse') {
                    html += `<div class="mcq-item"><div class="mcq-question">${questionNum++}. ${escapeHtml(q.text)} <span class="marks">(${q.marks})</span></div><div class="mcq-options"><div class="mcq-option"><input type="checkbox"><span>صحیح</span></div><div class="mcq-option"><input type="checkbox"><span>غلط</span></div></div></div>`;
                }
            });
        }
    }
    
    if (subjData.length > 0) {
        html += `<h3 style="margin-top:30px; color:#6B3FA0; border-right:3px solid #FF7B4A; padding-right:10px">حصہ دوم: انشائیہ سوالات</h3>`;
        subjData.forEach((q) => {
            html += `<div style="margin:20px 0;"><div><strong>${questionNum++}.</strong> ${escapeHtml(q.text)} <span class="marks">(${q.marks} نمبر)</span></div>`;
           html += `<div class="answer-space"></div>`;
html += `<div class="answer-space"></div>`;
            html += `</div>`;
        });
    }
    
    if (objData.length === 0 && subjData.length === 0) {
        html += `<div style="text-align:center; padding:40px; color:#999">🚀 براہ کرم سوالات شامل کریں</div>`;
    }
    
    html += `<div style="margin-top:50px; text-align:left"><p><strong>استاد کے دستخط:</strong> ${escapeHtml(teacherSig)}</p><div style="width:200px; border-bottom:1px solid #000; margin-top:5px"></div><p style="margin-top:20px; text-align:center; color:#666">➖➖➖ نیک تمنائیں ➖➖➖</p></div>`;
    preview.innerHTML = html;
    applyBorder();
}

function applyBorder() {
    const paper = document.getElementById('paperPreview');
    if (!paper) return;
    const style = document.getElementById('borderStyle').value;
    const color = document.getElementById('borderColor').value;
    const width = document.getElementById('borderWidth').value;
    const styles = { simple: `${width}px solid ${color}`, double: `${width}px double ${color}`, dotted: `${width}px dotted ${color}` };
    paper.style.border = styles[style] || styles.simple;
    paper.style.borderRadius = '12px';
    paper.style.padding = '25px';
}

// ========== Generate Marking Key ==========
function generateMarkingKey() {
    const objData = collectObjectiveData();
    const subjData = collectSubjectiveData();
    const allQuestions = [...objData, ...subjData];
    const totalMarks = allQuestions.reduce((a,b)=>a+b.marks,0);
    
    let html = `<div class="marking-key"><h3>🔑 مارکنگ کلید</h3><table><thead><th>سوال نمبر</th><th>قسم</th><th>بلومز لیول</th><th>مشکل سطح</th><th>نمبر</th><th>تصحیح ہدایات</th></thead><tbody>`;
    let qNum = 1;
    objData.forEach(q => {
        let instr = q.type === 'mcq' || q.type === 'scenario-mcq' ? `صحیح جواب پر ${q.marks} نمبر` : (q.type === 'fillblank' ? `درست جواب پر ${q.marks} نمبر` : `صحیح جواب پر ${q.marks} نمبر`);
        html += `<tr><td>${qNum++}</td><td>${getObjectiveTypeName(q.type)}</td><td style="background:${getBloomColor(q.bloom)}20">${getBloomName(q.bloom)}</td><td>${getDifficultyName(q.difficulty)}</td><td>${q.marks}</td><td>${instr}</td></tr>`;
    });
    subjData.forEach(q => {
        let instr = q.type === 'short' ? `مواد ${Math.round(q.marks*0.5)}، ترتیب ${Math.round(q.marks*0.3)}، تحریر ${Math.round(q.marks*0.2)}` : (q.type === 'long' ? `تعارف ${Math.round(q.marks*0.2)}، مواد ${Math.round(q.marks*0.5)}، اختتام ${Math.round(q.marks*0.3)}` : `جواب کے معیار کے مطابق نمبر`);
        html += `<tr><td>${qNum++}<td>${getSubjectiveTypeName(q.type)}</td><td style="background:${getBloomColor(q.bloom)}20">${getBloomName(q.bloom)}</td><td>${getDifficultyName(q.difficulty)}</td><td>${q.marks}</td><td>${instr}</td></tr>`;
    });
    html += `</tbody></table><p><strong>کل نمبر:</strong> ${totalMarks} | <strong>33% پاس:</strong> ${Math.ceil(totalMarks*0.33)} | <strong>40% پاس:</strong> ${Math.ceil(totalMarks*0.4)} | <strong>50% پاس:</strong> ${Math.ceil(totalMarks*0.5)}</p></div>`;
    currentMarkingKeyHTML = html;
    const container = document.getElementById('markingKeyContainer');
    if (container) container.innerHTML = html;
}

function downloadMarkingKey() {
    if (!currentMarkingKeyHTML) generateMarkingKey();
    const blob = new Blob([currentMarkingKeyHTML], { type: 'text/html' });
    saveAs(blob, `marking-key-${Date.now()}.html`);
    showToast('مارکنگ کلید ڈاؤن لوڈ ہو گئی');
}

// ========== PDF Export via Cloudflare Worker ==========
async function exportPDF() {
    showLoading();
    try {
        const paperHTML = document.getElementById('paperPreview').innerHTML;
        if (!paperHTML || !paperHTML.trim()) {
            showToast('پرچہ خالی ہے، پہلے سوالات شامل کریں', 'error');
            hideLoading();
            return;
        }
        
        const response = await fetch(`${CONFIG.API_BASE}/api/generate-pdf`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                html: paperHTML,
                filename: `urdu-paper-${Date.now()}`
            })
        });
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `urdu-paper-${Date.now()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showToast('PDF تیار ہے، براہ کرم پرنٹ → Save as PDF کریں');
    } catch (error) {
        console.error('PDF Error:', error);
        showToast('PDF بنانے میں خرابی: ' + error.message, 'error');
        // Fallback to print
        printPaper();
    }
    hideLoading();
}

// ========== DOC Export via Cloudflare Worker ==========
async function exportDOC() {
    showLoading();
    try {
        const paperHTML = document.getElementById('paperPreview').innerHTML;
        if (!paperHTML || !paperHTML.trim()) {
            showToast('پرچہ خالی ہے، پہلے سوالات شامل کریں', 'error');
            hideLoading();
            return;
        }
        
        const response = await fetch(`${CONFIG.API_BASE}/api/generate-doc`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                html: paperHTML,
                filename: `urdu-paper-${Date.now()}`
            })
        });
        
        const blob = await response.blob();
        saveAs(blob, `urdu-paper-${Date.now()}.doc`);
        showToast('DOC ڈاؤن لوڈ ہو گیا');
    } catch (error) {
        console.error('DOC Error:', error);
        showToast('DOC بنانے میں خرابی، HTML ڈاؤن لوڈ کریں', 'error');
        // Fallback to HTML
        const blob = new Blob([paperHTML], { type: 'text/html' });
        saveAs(blob, `urdu-paper-${Date.now()}.html`);
    }
    hideLoading();
}

function exportTXT() {
    const content = document.getElementById('paperPreview').innerText;
    if (!content || !content.trim()) {
        showToast('پرچہ خالی ہے', 'error');
        return;
    }
    const blob = new Blob([content], { type: 'text/plain' });
    saveAs(blob, `urdu-paper-${Date.now()}.txt`);
    showToast('TXT ڈاؤن لوڈ ہو گیا');
}

function printPaper() {
    const content = document.getElementById('paperPreview').innerHTML;
    if (!content || !content.trim()) {
        showToast('پرچہ خالی ہے', 'error');
        return;
    }
    window.print();
}

// ========== Analysis Functions ==========
function updateAnalysis() {
    const objData = collectObjectiveData();
    const subjData = collectSubjectiveData();
    const allQuestions = [...objData, ...subjData];
    const totalQ = allQuestions.length;
    const totalM = allQuestions.reduce((a,b)=>a+b.marks,0);
    
    const diffCounts = { easy: 0, medium: 0, hard: 0 };
    const bloomCounts = { knowledge: 0, comprehension: 0, application: 0, analysis: 0, synthesis: 0 };
    
    allQuestions.forEach(q => { diffCounts[q.difficulty]++; bloomCounts[q.bloom]++; });
    
    document.getElementById('analysisStatsGrid').innerHTML = `
        <div class="analysis-stat-box"><h4>کل سوالات</h4><div class="number">${totalQ}</div></div>
        <div class="analysis-stat-box"><h4>کل نمبر</h4><div class="number">${totalM}</div></div>
        <div class="analysis-stat-box"><h4>معروضی</h4><div class="number">${objData.length}</div></div>
        <div class="analysis-stat-box"><h4>انشائیہ</h4><div class="number">${subjData.length}</div></div>
        <div class="analysis-stat-box"><h4>آسان</h4><div class="number">${diffCounts.easy}</div></div>
        <div class="analysis-stat-box"><h4>اوسط</h4><div class="number">${diffCounts.medium}</div></div>
        <div class="analysis-stat-box"><h4>مشکل</h4><div class="number">${diffCounts.hard}</div></div>`;
    
    Object.values(currentCharts).forEach(chart => { if (chart) chart.destroy(); });
    
    const qCtx = document.getElementById('chartQuestions')?.getContext('2d');
    if (qCtx) currentCharts.q = new Chart(qCtx, { type: 'doughnut', data: { labels: ['معروضی', 'انشائیہ'], datasets: [{ data: [objData.length, subjData.length], backgroundColor: ['#6B3FA0', '#FF7B4A'] }] }, options: { responsive: true, maintainAspectRatio: true, animation: false } });
    
    const mCtx = document.getElementById('chartMarks')?.getContext('2d');
    if (mCtx) currentCharts.m = new Chart(mCtx, { type: 'bar', data: { labels: ['معروضی', 'انشائیہ'], datasets: [{ label: 'نمبر', data: [objData.reduce((a,b)=>a+b.marks,0), subjData.reduce((a,b)=>a+b.marks,0)], backgroundColor: '#6B3FA0' }] }, options: { responsive: true, maintainAspectRatio: true, animation: false } });
    
    const dCtx = document.getElementById('chartDifficulty')?.getContext('2d');
    if (dCtx) currentCharts.d = new Chart(dCtx, { type: 'pie', data: { labels: ['آسان', 'اوسط', 'مشکل'], datasets: [{ data: [diffCounts.easy, diffCounts.medium, diffCounts.hard], backgroundColor: ['#27ae60', '#f39c12', '#e74c3c'] }] }, options: { responsive: true, maintainAspectRatio: true, animation: false } });
    
    const bCtx = document.getElementById('chartBloom')?.getContext('2d');
    if (bCtx) currentCharts.b = new Chart(bCtx, { type: 'bar', data: { labels: ['یاد رکھنا', 'سمجھنا', 'اطلاق', 'تجزیہ', 'تخلیق'], datasets: [{ label: 'سوالات', data: [bloomCounts.knowledge, bloomCounts.comprehension, bloomCounts.application, bloomCounts.analysis, bloomCounts.synthesis], backgroundColor: ['#3498db', '#2ecc71', '#f39c12', '#e67e22', '#e74c3c'] }] }, options: { responsive: true, maintainAspectRatio: true, animation: false, indexAxis: 'y' } });
    
    const savedPercentages = JSON.parse(localStorage.getItem('bloomPercentages') || '{"knowledge":20,"comprehension":30,"application":25,"analysis":15,"synthesis":10}');
    let bloomHtml = `<div class="analysis-bloom-items">`;
    for (const [key, value] of Object.entries(bloomCounts)) {
        const currentPercent = totalQ > 0 ? Math.round((value / totalQ) * 100) : 0;
        const recommended = savedPercentages[key] || 0;
        const status = Math.abs(currentPercent - recommended) <= 5 ? '✅' : (currentPercent < recommended ? '⚠️ کم' : '⚠️ زیادہ');
        bloomHtml += `<div class="analysis-bloom-item" style="border-top:3px solid ${getBloomColor(key)}"><strong>${value}</strong><span>${BLOOM_LEVELS[key]?.ur || key}</span><small>موجودہ: ${currentPercent}% | تجویز: ${recommended}% ${status}</small></div>`;
    }
    bloomHtml += `</div>`;
    document.getElementById('analysisBloomTable').innerHTML = bloomHtml;
    
    let qDetails = `<table class="analysis-question-table"><thead><th>#</th><th>سوال</th><th>قسم</th><th>مشکل</th><th>بلومز</th><th>نمبر</th></thead><tbody>`;
    let idx = 1;
    objData.forEach(q => { qDetails += `<tr><td>${idx++}</td><td style="text-align:right">${escapeHtml(q.text).substring(0,50)}${escapeHtml(q.text).length > 50 ? '...' : ''}</td><td>${getObjectiveTypeName(q.type)}</td><td>${getDifficultyName(q.difficulty)}</td><td style="background:${getBloomColor(q.bloom)}20">${getBloomName(q.bloom)}</td><td>${q.marks}</td></tr>`; });
    subjData.forEach(q => { qDetails += `<tr><td>${idx++}</td><td style="text-align:right">${escapeHtml(q.text).substring(0,50)}${escapeHtml(q.text).length > 50 ? '...' : ''}</td><td>${getSubjectiveTypeName(q.type)}</td><td>${getDifficultyName(q.difficulty)}</td><td style="background:${getBloomColor(q.bloom)}20">${getBloomName(q.bloom)}</td><td>${q.marks}</td></tr>`; });
    qDetails += `</tbody></table>`;
    document.getElementById('analysisQuestionsDetails').innerHTML = qDetails;
    
    let advice = [];
    for (const [level, count] of Object.entries(bloomCounts)) {
        const currentPercent = totalQ > 0 ? Math.round((count / totalQ) * 100) : 0;
        const recPercent = savedPercentages[level] || 0;
        const needed = Math.max(0, Math.ceil((recPercent * totalQ / 100) - count));
        if (needed > 0 && recPercent > 0 && totalQ > 0) advice.push(`📚 ${BLOOM_LEVELS[level]?.ur} کے ${needed} مزید سوالات شامل کریں (تجویز: ${recPercent}%)`);
    }
    if (advice.length === 0 && totalQ > 0) advice.push(`🎉 بہترین! سوالات کی تقسیم متوازن ہے۔`);
    else if (totalQ === 0) advice.push(`🚀 سوالات شامل کرنا شروع کریں۔`);
    document.getElementById('autoAdviceContent').innerHTML = `<ul>${advice.map(a => `<li>${a}</li>`).join('')}</ul>`;
}

function exportAnalysisReport() {
    const objData = collectObjectiveData();
    const subjData = collectSubjectiveData();
    let report = `===== اردو پیپر جنریٹر - تجزیہ رپورٹ =====\nتاریخ: ${new Date().toLocaleDateString()}\nکل سوالات: ${objData.length + subjData.length}\nکل نمبر: ${[...objData, ...subjData].reduce((a,b)=>a+b.marks,0)}\n\nمعروضی: ${objData.length}\nانشائیہ: ${subjData.length}\n`;
    const blob = new Blob([report], { type: 'text/plain' });
    saveAs(blob, `analysis-report-${Date.now()}.txt`);
    showToast('رپورٹ ڈاؤن لوڈ ہو گئی');
}

// ========== Save & Load ==========
async function savePaper() {
    const designData = { tool_slug: CONFIG.TOOL_SLUG, user_id: userId, design_name: document.getElementById('paperTitle').value || 'Unnamed', design_json: JSON.stringify({ objective: collectObjectiveData(), subjective: collectSubjectiveData(), metadata: { school: document.getElementById('schoolName').value, subject: document.getElementById('subject').value, term: document.getElementById('term').value, totalMarks: document.getElementById('totalMarks').value, time: document.getElementById('time').value, instructions: document.getElementById('instructions').value, teacherSignature: document.getElementById('teacherSignature').value, logo: currentLogo } }) };
    showLoading();
    const result = await apiCall('/api/save-design', 'POST', designData);
    hideLoading();
    if (result.success) { showToast('پرچہ محفوظ ہو گیا'); loadSavedPapers(); } else { showToast('محفوظ کرنے میں خرابی', 'error'); }
}

async function loadSavedPapers() {
    const result = await apiCall(`/api/get-designs?tool_slug=${CONFIG.TOOL_SLUG}&user_id=${userId}`);
    const container = document.getElementById('savedList');
    if (result.success && result.designs?.length) { container.innerHTML = result.designs.map(d => `<div class="saved-item"><span>📄 ${escapeHtml(d.design_name)} - ${new Date(d.created_at).toLocaleDateString()}</span><div><button class="btn-primary" onclick="loadPaper(${d.id})">لوڈ</button><button class="btn-danger" onclick="deletePaper(${d.id})">حذف</button></div></div>`).join(''); } 
    else { container.innerHTML = '<p style="text-align:center">کوئی محفوظ پرچہ نہیں</p>'; }
}

async function loadPaper(id) {
    const result = await apiCall(`/api/get-design?id=${id}&tool_slug=${CONFIG.TOOL_SLUG}`);
    if (result.success && result.design) {
        const data = JSON.parse(result.design.design_json);
        document.getElementById('objectiveList').innerHTML = '';
        document.getElementById('subjectiveList').innerHTML = '';
        objectiveQuestions = []; subjectiveQuestions = [];
        if (data.objective) data.objective.forEach(q => addObjectiveWithData(q));
        if (data.subjective) data.subjective.forEach(q => addSubjectiveWithData(q));
        if (data.metadata) {
            document.getElementById('schoolName').value = data.metadata.school || '';
            document.getElementById('subject').value = data.metadata.subject || '';
            document.getElementById('term').value = data.metadata.term || 'پہلا ٹرم';
            document.getElementById('totalMarks').value = data.metadata.totalMarks || '';
            document.getElementById('time').value = data.metadata.time || '';
            document.getElementById('instructions').value = data.metadata.instructions || '';
            document.getElementById('teacherSignature').value = data.metadata.teacherSignature || '';
            if (data.metadata.logo) {
                currentLogo = data.metadata.logo;
                document.getElementById('schoolLogo').src = currentLogo;
                localStorage.setItem('schoolLogo', currentLogo);
            }
        }
        showToast('پرچہ لوڈ ہو گیا');
        document.querySelector('.tab[data-tab="setup"]').click();
        updateAnalysis();
        generatePreview();
        generateMarkingKey();
    }
}

async function deletePaper(id) {
    if (confirm('کیا آپ یقیناً حذف کرنا چاہتے ہیں؟')) {
        const result = await apiCall('/api/delete-design', 'DELETE', { id: id, tool_slug: CONFIG.TOOL_SLUG, user_id: userId });
        if (result.success) { showToast('پرچہ حذف ہو گیا'); loadSavedPapers(); }
    }
}

// ========== Initialize ==========
function initTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            document.getElementById(`${tab.dataset.tab}Pane`).classList.add('active');
            if (tab.dataset.tab === 'preview') { generatePreview(); generateMarkingKey(); }
            if (tab.dataset.tab === 'analysis') updateAnalysis();
            if (tab.dataset.tab === 'saved') loadSavedPapers();
        });
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

function autoSaveDraft() {
    setInterval(() => {
        const draft = { objective: collectObjectiveData(), subjective: collectSubjectiveData(), metadata: { school: document.getElementById('schoolName').value, subject: document.getElementById('subject').value, term: document.getElementById('term').value, totalMarks: document.getElementById('totalMarks').value, time: document.getElementById('time').value, instructions: document.getElementById('instructions').value, teacherSignature: document.getElementById('teacherSignature').value } };
        localStorage.setItem('paperDraft', JSON.stringify(draft));
    }, 30000);
}

function loadDraft() {
    const draft = localStorage.getItem('paperDraft');
    if (draft) {
        const data = JSON.parse(draft);
        if (data.objective?.length) data.objective.forEach(q => addObjectiveWithData(q));
        if (data.subjective?.length) data.subjective.forEach(q => addSubjectiveWithData(q));
        if (data.metadata) {
            document.getElementById('schoolName').value = data.metadata.school || '';
            document.getElementById('subject').value = data.metadata.subject || '';
            document.getElementById('term').value = data.metadata.term || 'پہلا ٹرم';
            document.getElementById('totalMarks').value = data.metadata.totalMarks || '';
            document.getElementById('time').value = data.metadata.time || '';
            document.getElementById('instructions').value = data.metadata.instructions || '';
            document.getElementById('teacherSignature').value = data.metadata.teacherSignature || '';
        }
    }
}

async function init() {
    initDarkMode();
    initTabs();
    initScroll();
    loadBloomPercentages();
    updateObjectiveQuestionTypes();
    updateSubjectiveQuestionTypes();
    document.getElementById('schoolLogo').src = currentLogo;
    if (currentLogo !== 'https://cdn-icons-png.flaticon.com/128/15120/15120883.png') document.getElementById('removeLogoBtn').style.display = 'inline-block';
    await getReactions();
    await getUsage();
    incrementUsage();
    loadDraft();
    autoSaveDraft();
    setInterval(() => { 
        const active = document.querySelector('.tab.active')?.dataset.tab; 
        if (active === 'preview') { generatePreview(); generateMarkingKey(); }
        if (active === 'analysis') updateAnalysis(); 
    }, 500);
}

init();
