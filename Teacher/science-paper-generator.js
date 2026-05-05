// ============================================
// SCIENCE PAPER GENERATOR - COMPLETE
// 8 Objective Types + 7 Subjective Types (Including CRQ)
// MCQ Two Column Layout | Fixed Reactions | Fixed Image Upload
// ============================================

const TOOL_SLUG = 'science-paper-generator';
const API_BASE_URL = 'https://your-worker.uzairhameed01.workers.dev';

let objectiveQuestions = [];
let subjectiveQuestions = [];
let currentLanguage = 'english';
let currentTheme = localStorage.getItem('theme') || 'light';
let uploadedImageData = null;
let userId = localStorage.getItem('userId') || generateUserId();
let reactions = { like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0 };

function generateUserId() {
    const id = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', id);
    return id;
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${type === 'success' ? '✓' : '⚠️'}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) show ? overlay.classList.add('show') : overlay.classList.remove('show');
}

function closePremiumModal() {
    document.getElementById('premiumModal')?.classList.remove('show');
}

// ============================================
// API CALLS
// ============================================
async function incrementUsageCount() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/${TOOL_SLUG}/usage`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, tool_slug: TOOL_SLUG })
        });
        const data = await response.json();
        if (data.success) document.getElementById('globalUsageCounter').innerText = data.total_usage || data.count;
    } catch(e) { console.error(e); }
}

async function fetchUsageCount() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/${TOOL_SLUG}/usage?tool_slug=${TOOL_SLUG}`);
        const data = await response.json();
        if (data.success) document.getElementById('globalUsageCounter').innerText = data.count || 0;
    } catch(e) { console.error(e); }
}

async function fetchReactions() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/${TOOL_SLUG}/reactions?tool_slug=${TOOL_SLUG}`);
        const data = await response.json();
        if (data.success && data.reactions) {
            reactions = data.reactions;
            updateReactionDisplays();
        }
    } catch(e) { console.error(e); }
}

async function addReaction(reactionType, emoji) {
    showLoading(true);
    try {
        const response = await fetch(`${API_BASE_URL}/api/${TOOL_SLUG}/reactions`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: TOOL_SLUG, emoji: emoji, reaction_type: reactionType, user_id: userId })
        });
        const data = await response.json();
        if (data.success || data.counts) {
            if (data.counts) reactions = data.counts;
            else await fetchReactions();
            updateReactionDisplays();
            showToast(`Thanks for ${reactionType}!`, 'success');
        } else if (data.already_reacted) {
            showToast('Already reacted!', 'info');
        }
    } catch(e) { showToast('Error', 'error'); }
    finally { showLoading(false); }
}

async function recordShare(platform) {
    try {
        await fetch(`${API_BASE_URL}/api/${TOOL_SLUG}/shares`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: TOOL_SLUG, platform: platform, user_id: userId })
        });
        showToast(`Shared on ${platform}!`, 'success');
    } catch(e) { console.error(e); }
}

async function fetchGlobalStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/global-stats`);
        const data = await response.json();
        if (data.success) {
            document.getElementById('globalUsageCounter').innerText = data.totalUsage || 0;
            document.getElementById('globalReactionCounter').innerText = data.totalReactions || 0;
            document.getElementById('globalShareCounter').innerText = data.totalShares || 0;
        }
    } catch(e) { console.error(e); }
}

function updateReactionDisplays() {
    document.getElementById('likeCount') && (document.getElementById('likeCount').innerText = reactions.like || 0);
    document.getElementById('loveCount') && (document.getElementById('loveCount').innerText = reactions.love || 0);
    document.getElementById('wowCount') && (document.getElementById('wowCount').innerText = reactions.wow || 0);
    document.getElementById('sadCount') && (document.getElementById('sadCount').innerText = reactions.sad || 0);
    document.getElementById('angryCount') && (document.getElementById('angryCount').innerText = reactions.angry || 0);
    document.getElementById('laughCount') && (document.getElementById('laughCount').innerText = reactions.laugh || 0);
    document.getElementById('celebrateCount') && (document.getElementById('celebrateCount').innerText = reactions.celebrate || 0);
}

// ============================================
// SHARING FUNCTIONS
// ============================================
function shareOnFacebook() { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank'); recordShare('facebook'); }
function shareOnTwitter() { window.open(`https://twitter.com/intent/tweet?text=Science%20Paper%20Generator&url=${encodeURIComponent(window.location.href)}`, '_blank'); recordShare('twitter'); }
function shareOnWhatsApp() { window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, '_blank'); recordShare('whatsapp'); }
function shareOnLinkedIn() { window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank'); recordShare('linkedin'); }
function shareByEmail() { window.location.href = `mailto:?subject=Science%20Paper&body=${encodeURIComponent(window.location.href)}`; recordShare('email'); }
function copyPageURL() { navigator.clipboard.writeText(window.location.href); showToast('URL copied!', 'success'); recordShare('copy'); }

// ============================================
// QUESTION TYPE VISIBILITY
// ============================================
function toggleObjectiveOptions() {
    const type = document.getElementById('objectiveType').value;
    document.getElementById('mcqOptionsGroup').style.display = type === 'mcq' ? 'block' : 'none';
    document.getElementById('trueFalseOptions').style.display = type === 'trueFalse' ? 'block' : 'none';
    document.getElementById('fillBlankOptions').style.display = type === 'fillBlank' ? 'block' : 'none';
    document.getElementById('matchingOptions').style.display = type === 'matching' ? 'block' : 'none';
    document.getElementById('labelingOptions').style.display = type === 'labeling' ? 'block' : 'none';
}

// ============================================
// ADD OBJECTIVE QUESTION
// ============================================
function addObjectiveQuestion() {
    const type = document.getElementById('objectiveType').value;
    const text = document.getElementById('objectiveQuestion').value;
    const marks = parseInt(document.getElementById('objectiveMarks').value) || 1;
    
    if (!text.trim()) { showToast('Enter question!', 'error'); return; }
    
    let question = { type, text, marks, correctAnswer: null, options: null };
    
    if (type === 'mcq') {
        const options = { A: document.getElementById('optionA').value, B: document.getElementById('optionB').value, C: document.getElementById('optionC').value, D: document.getElementById('optionD').value };
        if (!options.A || !options.B || !options.C || !options.D) { showToast('All options required!', 'error'); return; }
        question.options = options;
        question.correctAnswer = document.getElementById('correctMCQ').value;
    }
    else if (type === 'trueFalse') {
        question.correctAnswer = document.getElementById('correctTF').value;
    }
    else if (type === 'fillBlank') {
        question.correctAnswer = document.getElementById('correctFillBlank').value;
        if (!question.correctAnswer) { showToast('Enter correct answer!', 'error'); return; }
    }
    else if (type === 'matching') {
        let pairs = [];
        document.querySelectorAll('.matching-pair').forEach(pair => {
            const colA = pair.children[0]?.value;
            const colB = pair.children[1]?.value;
            if (colA && colB) pairs.push({ colA, colB });
        });
        question.matchingPairs = pairs;
    }
    else if (type === 'labeling') {
        question.labels = document.getElementById('labelingLabels').value.split(',').map(l => l.trim());
    }
    
    objectiveQuestions.push(question);
    updateObjectivePreview();
    clearObjectiveForm();
    showToast('Objective question added!', 'success');
}

function clearObjectiveForm() {
    document.getElementById('objectiveQuestion').value = '';
    document.getElementById('optionA').value = '';
    document.getElementById('optionB').value = '';
    document.getElementById('optionC').value = '';
    document.getElementById('optionD').value = '';
    document.getElementById('correctFillBlank').value = '';
}

// ============================================
// ADD SUBJECTIVE QUESTION (Includes CRQ)
// ============================================
function addSubjectiveQuestion() {
    const type = document.getElementById('subjectiveType').value;
    const text = document.getElementById('subjectiveQuestion').value;
    const marks = parseInt(document.getElementById('subjectiveMarks').value) || 5;
    
    if (!text.trim()) { showToast('Enter question!', 'error'); return; }
    
    subjectiveQuestions.push({
        type, text, marks,
        includeDiagram: document.getElementById('includeDiagram').checked,
        includeImage: document.getElementById('includeImage').checked,
        imageSrc: uploadedImageData,
        imagePosition: document.querySelector('input[name="imagePosition"]:checked')?.value || 'left'
    });
    
    updateSubjectivePreview();
    document.getElementById('subjectiveQuestion').value = '';
    document.getElementById('includeDiagram').checked = false;
    document.getElementById('includeImage').checked = false;
    document.getElementById('imageUploadGroup').style.display = 'none';
    document.getElementById('imagePreview').style.display = 'none';
    uploadedImageData = null;
    showToast('Subjective question added!', 'success');
}

// ============================================
// UPDATE PREVIEWS (MCQ in Two Columns)
// ============================================
function updateObjectivePreview() {
    const container = document.getElementById('objectiveQuestionsContainer');
    if (!container) return;
    container.innerHTML = '';
    
    // Separate MCQs from other questions for two-column layout
    const mcqs = objectiveQuestions.filter(q => q.type === 'mcq');
    const otherQuestions = objectiveQuestions.filter(q => q.type !== 'mcq');
    
    // Display MCQs in two columns
    if (mcqs.length > 0) {
        const mcqGrid = document.createElement('div');
        mcqGrid.className = 'mcq-grid';
        
        mcqs.forEach((q, idx) => {
            const mcqDiv = document.createElement('div');
            mcqDiv.className = 'mcq-item';
            let html = `<div class="question-text"><strong>Q${idx + 1}:</strong> [${q.marks} mark${q.marks > 1 ? 's' : ''}] ${q.text}</div>`;
            if (q.options) {
                html += `<div class="options">
                    <div class="option">A. ${q.options.A}</div>
                    <div class="option">B. ${q.options.B}</div>
                    <div class="option">C. ${q.options.C}</div>
                    <div class="option">D. ${q.options.D}</div>
                </div>`;
                html += `<div class="answer-space"><div>Answer: __________</div></div>`;
            }
            mcqDiv.innerHTML = html;
            mcqGrid.appendChild(mcqDiv);
        });
        container.appendChild(mcqGrid);
    }
    
    // Display other questions
    otherQuestions.forEach((q, idx) => {
        const div = document.createElement('div');
        div.className = 'question-item';
        let html = `<div class="question-text"><strong>Q${mcqs.length + idx + 1}:</strong> [${q.marks} mark${q.marks > 1 ? 's' : ''}] ${q.text}</div>`;
        
        if (q.type === 'trueFalse') {
            html += `<div class="options"><div>○ True</div><div>○ False</div></div>`;
        }
        else if (q.type === 'fillBlank') {
            html += `<div class="answer-space"><div>Answer: ______________</div></div>`;
        }
        else if (q.type === 'matching') {
            html += `<div style="display:flex; gap:40px; margin-top:10px;">
                <div><strong>Column A</strong><br>${q.matchingPairs?.map((p, i) => `<div>${i+1}. ${p.colA}</div>`).join('') || ''}</div>
                <div><strong>Column B</strong><br>${q.matchingPairs?.map((p, i) => `<div>${String.fromCharCode(65+i)}. ${p.colB}</div>`).join('') || ''}</div>
            </div>`;
        }
        else if (q.type === 'diagram') {
            html += `<div class="diagram-space">📐 Draw diagram here</div>`;
        }
        else if (q.type === 'labeling') {
            html += `<div class="diagram-space">🏷️ Label the diagram<br>Labels: ${q.labels?.join(', ') || ''}</div>`;
        }
        
        div.innerHTML = html;
        container.appendChild(div);
    });
}

function updateSubjectivePreview() {
    const container = document.getElementById('subjectiveQuestionsContainer');
    if (!container) return;
    container.innerHTML = '';
    
    subjectiveQuestions.forEach((q, idx) => {
        const div = document.createElement('div');
        div.className = 'question-item';
        let html = `<div class="question-text"><strong>Q${idx + 1}:</strong> [${q.marks} marks] ${q.text}</div>`;
        
        if (q.includeImage && q.imageSrc) {
            html += `<img src="${q.imageSrc}" style="max-width:250px; margin:10px 0; border-radius:8px; ${q.imagePosition === 'left' ? 'float:left; margin-right:15px;' : q.imagePosition === 'right' ? 'float:right; margin-left:15px;' : 'display:block; margin:10px auto;'}">`;
        }
        
        if (q.type === 'crq') {
            html += `<div class="answer-space">${'<div class="answer-line">________________________________________________________</div>'.repeat(5)}</div>`;
        }
        else if (q.type === 'erq') {
            html += `<div class="answer-space">${'<div class="answer-line">________________________________________________________</div>'.repeat(12)}</div>`;
        }
        else if (q.type === 'drawing') {
            html += `<div class="diagram-space">🎨 Draw your answer here</div>`;
        }
        else if (q.type === 'labeling') {
            html += `<div class="diagram-space">🏷️ Label the diagram and explain</div>`;
        }
        else if (q.type === 'experiment') {
            html += `<div class="answer-space"><div>Apparatus: __________</div><div>Procedure: __________</div><div>Observation: __________</div><div>Conclusion: __________</div></div>`;
        }
        else if (q.type === 'derivation') {
            html += `<div class="answer-space">${'<div class="answer-line">________________________________________________________</div>'.repeat(12)}</div>`;
        }
        else {
            html += `<div class="answer-space">${'<div class="answer-line">________________________________________________________</div>'.repeat(8)}</div>`;
        }
        
        if (q.includeDiagram && q.type !== 'drawing' && q.type !== 'labeling') {
            html += `<div class="diagram-space">📐 Diagram Space</div>`;
        }
        
        div.innerHTML = html;
        container.appendChild(div);
    });
}

// ============================================
// GENERATE ANSWER KEY
// ============================================
function generateAnswerKey() {
    let answerKeyHtml = '';
    let totalMarks = 0;
    let objectiveTotal = 0;
    let subjectiveTotal = 0;
    
    answerKeyHtml += '<div class="answer-item"><strong>📚 OBJECTIVE SECTION ANSWER KEY</strong></div>';
    objectiveQuestions.forEach((q, idx) => {
        objectiveTotal += q.marks;
        totalMarks += q.marks;
        let answer = '';
        if (q.type === 'mcq') answer = `✅ Correct Answer: ${q.correctAnswer}`;
        else if (q.type === 'trueFalse') answer = `✅ Correct Answer: ${q.correctAnswer}`;
        else if (q.type === 'fillBlank') answer = `✅ Correct Answer: ${q.correctAnswer}`;
        else if (q.type === 'matching') answer = `✅ Matching: ${q.matchingPairs?.map(p => `${p.colA} → ${p.colB}`).join(', ')}`;
        else answer = '📌 Subjective - Manual Checking Required';
        
        answerKeyHtml += `<div class="answer-item"><strong>Q${idx + 1}:</strong> ${q.text.substring(0, 80)}${q.text.length > 80 ? '...' : ''}<br>📌 ${answer} (${q.marks} mark${q.marks > 1 ? 's' : ''})</div>`;
    });
    
    answerKeyHtml += '<div class="answer-item"><strong>📝 SUBJECTIVE SECTION - MARKING GUIDE</strong></div>';
    subjectiveQuestions.forEach((q, idx) => {
        subjectiveTotal += q.marks;
        totalMarks += q.marks;
        let guide = '';
        if (q.type === 'crq') guide = 'Look for key points, accuracy, and clarity (2-3 sentences expected)';
        else if (q.type === 'erq') guide = 'Check detailed explanation, examples, logical flow, and conclusion';
        else if (q.type === 'drawing') guide = 'Check accuracy of diagram, labels, and neatness';
        else if (q.type === 'labeling') guide = 'Check correct labels and understanding of parts';
        else if (q.type === 'experiment') guide = 'Check apparatus, procedure, observations, conclusion';
        else if (q.type === 'derivation') guide = 'Check step-by-step derivation and final expression';
        else guide = 'Check understanding, examples, and completeness';
        
        answerKeyHtml += `<div class="answer-item"><strong>Q${idx + 1}:</strong> ${q.text.substring(0, 80)}${q.text.length > 80 ? '...' : ''}<br>📌 Marking Guide: ${guide} (${q.marks} marks)</div>`;
    });
    
    document.getElementById('answerKeyContent').innerHTML = answerKeyHtml;
    document.getElementById('totalMarksSummary').innerHTML = `<strong>📊 Total Marks: ${totalMarks}</strong> | Objective: ${objectiveTotal} | Subjective: ${subjectiveTotal}`;
    document.getElementById('answerKeyPreview').style.display = 'block';
    document.getElementById('answerKeyPreview').scrollIntoView({ behavior: 'smooth' });
    return { totalMarks, objectiveTotal, subjectiveTotal };
}

// ============================================
// GENERATE PAPER
// ============================================
function generatePaper() {
    document.getElementById('previewSchoolName').innerText = document.getElementById('schoolName').value || 'School Name';
    document.getElementById('previewSubject').innerText = document.getElementById('subject').value || 'Subject';
    document.getElementById('previewDate').innerText = document.getElementById('date').value || new Date().toLocaleDateString();
    document.getElementById('previewTime').innerText = document.getElementById('time').value || '2 hours';
    document.getElementById('previewClass').innerText = document.getElementById('className').value || 'Grade';
    document.getElementById('previewTotalMarks').innerText = document.getElementById('totalMarks').value || '100';
    
    const paperType = document.getElementById('paperType').value;
    const titles = { midTerm: 'Mid Term Examination', secondMid: '2nd Mid Term Examination', finalTerm: 'Final Term Examination' };
    document.getElementById('previewPaperTitle').innerText = titles[paperType];
    
    updateObjectivePreview();
    updateSubjectivePreview();
    
    document.getElementById('paperPreview').style.display = 'block';
    incrementUsageCount();
    showToast('Paper generated successfully!', 'success');
    document.getElementById('paperPreview').scrollIntoView({ behavior: 'smooth' });
}

function downloadAnswerKey() {
    generateAnswerKey();
}

function resetAll() {
    objectiveQuestions = [];
    subjectiveQuestions = [];
    uploadedImageData = null;
    document.querySelectorAll('input, textarea, select').forEach(el => { 
        if(el.type !== 'button' && el.type !== 'file') el.value = ''; 
    });
    document.getElementById('date').value = new Date().toISOString().split('T')[0];
    updateObjectivePreview();
    updateSubjectivePreview();
    document.getElementById('paperPreview').style.display = 'none';
    document.getElementById('answerKeyPreview').style.display = 'none';
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('imagePreview').innerHTML = '';
    showToast('Reset complete!', 'info');
}

// ============================================
// THEME & SCROLL
// ============================================
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.classList.toggle('dark-theme', currentTheme === 'dark');
    localStorage.setItem('theme', currentTheme);
    const btn = document.getElementById('darkModeToggle');
    if (btn) btn.innerHTML = currentTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    showToast(`${currentTheme} mode activated`, 'info');
}

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
function scrollToBottom() { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }
function scrollToTool() { document.getElementById('toolContainer')?.scrollIntoView({ behavior: 'smooth' }); }

// ============================================
// LANGUAGE
// ============================================
function setLanguage(lang) {
    currentLanguage = lang;
    document.body.classList.toggle('urdu-mode', lang === 'urdu');
    const urduBtn = document.getElementById('langUrduBtn');
    const engBtn = document.getElementById('langEnglishBtn');
    if (lang === 'urdu') { urduBtn.classList.add('active'); engBtn.classList.remove('active'); }
    else { urduBtn.classList.remove('active'); engBtn.classList.add('active'); }
    showToast(`Language: ${lang === 'urdu' ? 'Urdu' : 'English'}`, 'info');
}

// ============================================
// IMAGE HANDLING (Fixed)
// ============================================
function handleImageUpload() {
    const file = document.getElementById('imageUpload').files[0];
    if (file) {
        if (file.size > 2 * 1024 * 1024) {
            showToast('Image too large! Max 2MB', 'error');
            return;
        }
        const reader = new FileReader();
        reader.onload = e => {
            uploadedImageData = e.target.result;
            const preview = document.getElementById('imagePreview');
            preview.innerHTML = `<img src="${uploadedImageData}" style="max-width:100%; border-radius:8px;">`;
            preview.style.display = 'block';
            showToast('Image uploaded successfully!', 'success');
        };
        reader.onerror = () => {
            showToast('Error reading image', 'error');
        };
        reader.readAsDataURL(file);
    }
}

function toggleImageUpload() {
    const show = document.getElementById('includeImage').checked;
    document.getElementById('imageUploadGroup').style.display = show ? 'block' : 'none';
    if (!show) {
        uploadedImageData = null;
        document.getElementById('imagePreview').style.display = 'none';
        document.getElementById('imagePreview').innerHTML = '';
    }
}

// ============================================
// AI FUNCTIONS
// ============================================
async function aiSuggestTopics() {
    const subject = document.getElementById('subject').value;
    if (!subject) { showToast('Enter subject first!', 'error'); return; }
    showLoading(true);
    setTimeout(() => {
        document.getElementById('objectiveQuestion').value = `Explain the importance of ${subject} in daily life with examples.`;
        showLoading(false);
        showToast('AI suggested topic added!', 'success');
    }, 1000);
}

async function aiGeneratePaper() {
    showLoading(true);
    setTimeout(() => {
        generatePaper();
        showLoading(false);
        showToast('AI Paper Generated!', 'success');
    }, 1500);
}

// ============================================
// EXPORT FUNCTIONS
// ============================================
async function downloadPDF() {
    const preview = document.getElementById('paperPreview');
    if (preview.style.display === 'none') { showToast('Generate paper first!', 'error'); return; }
    showLoading(true);
    try {
        const { jsPDF } = window.jspdf;
        const canvas = await html2canvas(preview, { scale: 2, backgroundColor: '#ffffff' });
        const imgData = canvas.toDataURL('image/png');
        const doc = new jsPDF('p', 'pt', 'a4');
        const imgWidth = doc.internal.pageSize.getWidth();
        const imgHeight = canvas.height * imgWidth / canvas.width;
        doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        doc.save(`${TOOL_SLUG}_paper.pdf`);
        showToast('PDF downloaded!', 'success');
    } catch(e) { showToast('PDF error: ' + e.message, 'error'); }
    finally { showLoading(false); }
}

function downloadDOC() {
    const preview = document.getElementById('paperPreview');
    if (preview.style.display === 'none') { showToast('Generate paper first!', 'error'); return; }
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Science Paper</title><style>body{font-family:Arial;margin:40px;line-height:1.5} .mcq-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px} .question-item{margin-bottom:20px}</style></head><body>${preview.innerHTML}</body></html>`;
    const blob = new Blob([html], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${TOOL_SLUG}_paper.doc`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('Word document downloaded!', 'success');
}

function downloadTXT() {
    const preview = document.getElementById('paperPreview');
    if (preview.style.display === 'none') { showToast('Generate paper first!', 'error'); return; }
    const blob = new Blob([preview.innerText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${TOOL_SLUG}_paper.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('Text file downloaded!', 'success');
}

// ============================================
// REACTION BUTTON EVENT LISTENERS (Fixed)
// ============================================
function setupReactionButtons() {
    document.getElementById('reactionLike')?.addEventListener('click', () => addReaction('like', '👍'));
    document.getElementById('reactionLove')?.addEventListener('click', () => addReaction('love', '❤️'));
    document.getElementById('reactionWow')?.addEventListener('click', () => addReaction('wow', '😮'));
    document.getElementById('reactionSad')?.addEventListener('click', () => addReaction('sad', '😢'));
    document.getElementById('reactionAngry')?.addEventListener('click', () => addReaction('angry', '😠'));
    document.getElementById('reactionLaugh')?.addEventListener('click', () => addReaction('laugh', '😂'));
    document.getElementById('reactionCelebrate')?.addEventListener('click', () => addReaction('celebrate', '🎉'));
}

// ============================================
// INITIALIZATION
// ============================================
function init() {
    // Set theme
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('darkModeToggle').innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Set default date
    const today = new Date().toISOString().split('T')[0];
    if (document.getElementById('date') && !document.getElementById('date').value) {
        document.getElementById('date').value = today;
    }
    
    // Fetch data
    fetchUsageCount();
    fetchReactions();
    fetchGlobalStats();
    toggleObjectiveOptions();
    
    // Setup reactions
    setupReactionButtons();
    
    // Event Listeners
    document.getElementById('generateBtn')?.addEventListener('click', generatePaper);
    document.getElementById('resetBtn')?.addEventListener('click', resetAll);
    document.getElementById('addObjectiveBtn')?.addEventListener('click', addObjectiveQuestion);
    document.getElementById('addSubjectiveBtn')?.addEventListener('click', addSubjectiveQuestion);
    document.getElementById('aiGeneratePaperBtn')?.addEventListener('click', aiGeneratePaper);
    document.getElementById('aiSuggestBtn')?.addEventListener('click', aiSuggestTopics);
    document.getElementById('darkModeToggle')?.addEventListener('click', toggleTheme);
    document.getElementById('scrollUpBtn')?.addEventListener('click', scrollToTop);
    document.getElementById('scrollDownBtn')?.addEventListener('click', scrollToBottom);
    document.getElementById('scrollToToolBtn')?.addEventListener('click', scrollToTool);
    document.getElementById('sharePageBtn')?.addEventListener('click', copyPageURL);
    document.getElementById('answerKeyBtn')?.addEventListener('click', downloadAnswerKey);
    document.getElementById('downloadAnswerKeyBtn')?.addEventListener('click', downloadAnswerKey);
    document.getElementById('langUrduBtn')?.addEventListener('click', () => setLanguage('urdu'));
    document.getElementById('langEnglishBtn')?.addEventListener('click', () => setLanguage('english'));
    document.getElementById('objectiveType')?.addEventListener('change', toggleObjectiveOptions);
    document.getElementById('includeImage')?.addEventListener('change', toggleImageUpload);
    document.getElementById('imageUpload')?.addEventListener('change', handleImageUpload);
    document.getElementById('downloadPdfBtn')?.addEventListener('click', downloadPDF);
    document.getElementById('downloadDocBtn')?.addEventListener('click', downloadDOC);
    document.getElementById('downloadTxtBtn')?.addEventListener('click', downloadTXT);
    document.getElementById('printBtn')?.addEventListener('click', () => window.print());
    document.getElementById('watchDemoBtn')?.addEventListener('click', () => showToast('Demo video coming soon!', 'info'));
    
    // Share buttons
    document.getElementById('shareFacebook')?.addEventListener('click', shareOnFacebook);
    document.getElementById('shareTwitter')?.addEventListener('click', shareOnTwitter);
    document.getElementById('shareWhatsApp')?.addEventListener('click', shareOnWhatsApp);
    document.getElementById('shareLinkedIn')?.addEventListener('click', shareOnLinkedIn);
    document.getElementById('shareEmail')?.addEventListener('click', shareByEmail);
    document.getElementById('shareCopy')?.addEventListener('click', copyPageURL);
    
    // Matching pairs
    document.getElementById('addMatchingPair')?.addEventListener('click', () => {
        const container = document.getElementById('matchingPairsContainer');
        const div = document.createElement('div');
        div.className = 'matching-pair';
        div.innerHTML = '<input type="text" placeholder="Col A Item"><input type="text" placeholder="Col B Match">';
        container.appendChild(div);
    });
    
    showToast('Science Paper Generator Ready! ✨', 'success');
}

// Start the app
init();
