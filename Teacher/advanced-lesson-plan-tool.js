/* ========================================
   Advanced Lesson Planner Tool JavaScript
   Vercel API Endpoints Integration
   ======================================== */

// ========================================
// Global Variables
// ========================================
let savedPlans = JSON.parse(localStorage.getItem('lessonPlans')) || [];
let currentUser = localStorage.getItem('userId') || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
let reactionStates = JSON.parse(localStorage.getItem('reactionStates')) || {};
const toolSlug = 'advanced-lesson-planner';
const API_BASE = '/api'; // Vercel Serverless Functions

if (!localStorage.getItem('userId')) {
    localStorage.setItem('userId', currentUser);
}

// Activity Database
const activitySuggestions = {
    general: {
        Lecture: ["Mini-lecture with key points", "Interactive lecture with Q&A", "Guest speaker presentation"],
        Demonstration: ["Live demonstration by teacher", "Video demonstration", "Step-by-step modeling"],
        Discussion: ["Think-pair-share activity", "Whole class discussion", "Socratic seminar"],
        "Group Work": ["Jigsaw activity", "Collaborative problem solving", "Group project work"],
        "Problem Solving": ["Case study analysis", "Real-world problem application", "Brainstorming solutions"],
        "Inquiry-based": ["Guided research activity", "Question formulation technique", "Hypothesis testing"],
        "Project-based": ["Project planning session", "Project work time", "Project presentations"],
        "Flipped": ["Video viewing with notes", "Online discussion forum", "Application activities"]
    },
    mathematics: {
        Lecture: ["Explain key formulas", "Demonstrate problem-solving techniques", "Present mathematical proofs"],
        Demonstration: ["Show step-by-step solutions", "Use manipulatives to demonstrate", "Model problem-solving"],
        Discussion: ["Discuss different solution methods", "Analyze common mistakes", "Debate mathematical concepts"],
        "Group Work": ["Collaborative problem solving", "Peer teaching activities", "Group whiteboard work"],
        "Problem Solving": ["Word problem analysis", "Real-world math applications", "Challenge problems"]
    },
    science: {
        Lecture: ["Explain scientific principles", "Present case studies", "Discuss current research"],
        Demonstration: ["Science experiment demo", "Model scientific processes", "Show equipment use"],
        Discussion: ["Debate ethical issues", "Discuss experimental results", "Analyze scientific claims"],
        "Group Work": ["Lab experiments", "Research projects", "Data analysis teams"]
    },
    english: {
        Lecture: ["Literary analysis lecture", "Grammar rules explanation", "Writing techniques presentation"],
        Demonstration: ["Model writing process", "Show annotation techniques", "Demonstrate presentation skills"],
        Discussion: ["Book club discussion", "Literary analysis debate", "Peer review sessions"]
    },
    history: {
        Lecture: ["Historical context presentation", "Primary source analysis", "Timeline of events"],
        Demonstration: ["Reenact historical events", "Show archival footage", "Demonstrate research methods"],
        Discussion: ["Debate historical interpretations", "Discuss cause and effect", "Analyze bias in sources"]
    }
};

// ========================================
// DOM Ready Initialization
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initializeTool();
});

async function initializeTool() {
    setDefaultDate();
    loadThemePreference();
    loadDraftFromLocalStorage();
    renderSavedPlans();
    renderTemplates();
    attachEventListeners();
    await loadGlobalUsageCount();
    await loadReactionsFromAPI();
    await loadShareCountFromAPI();
    await loadStats();
    setupAutoSave();
    setupScrollButtons();
    showToast('Welcome to Lesson Planner Pro!', 'success');
}

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('lesson-date');
    if (dateInput) dateInput.value = today;
}

function loadThemePreference() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

function loadDraftFromLocalStorage() {
    const draft = localStorage.getItem(`${toolSlug}_draft`);
    if (draft) {
        const data = JSON.parse(draft);
        restoreFormData(data);
        showToast('Draft restored', 'info');
    }
}

function setupAutoSave() {
    setInterval(() => {
        const formData = collectFormData();
        localStorage.setItem(`${toolSlug}_draft`, JSON.stringify(formData));
    }, 30000);
}

function setupScrollButtons() {
    const scrollUp = document.getElementById('scroll-up');
    const scrollDown = document.getElementById('scroll-down');
    
    window.addEventListener('scroll', () => {
        if (scrollUp) scrollUp.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });
    
    if (scrollUp) scrollUp.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    if (scrollDown) scrollDown.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
}

function attachEventListeners() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
    
    const searchInput = document.getElementById('search-saved-plans');
    if (searchInput) searchInput.addEventListener('input', (e) => filterSavedPlans(e.target.value));
    
    const templateFilter = document.getElementById('template-filter');
    if (templateFilter) templateFilter.addEventListener('change', (e) => filterTemplates(e.target.value));
    
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', () => addReaction(btn.dataset.emoji));
    });
    
    const modalClose = document.getElementById('premium-modal-close');
    const premiumCancel = document.getElementById('premium-cancel');
    if (modalClose) modalClose.addEventListener('click', () => closePremiumModal());
    if (premiumCancel) premiumCancel.addEventListener('click', () => closePremiumModal());
}

// ========================================
// Theme Functions
// ========================================
function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-sun"></i>';
    }
    showToast(`${isDark ? 'Light' : 'Dark'} mode activated`, 'success');
}

// ========================================
// Tab Functions
// ========================================
function switchTab(tabId) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    const activeTab = document.querySelector(`.tab[data-tab="${tabId}"]`);
    if (activeTab) activeTab.classList.add('active');
    
    const activeContent = document.getElementById(tabId);
    if (activeContent) activeContent.classList.add('active');
    
    if (tabId === 'analytics-tab') {
        loadAnalyticsCharts();
    }
}

// ========================================
// Form Management Functions
// ========================================
function addResource() {
    const container = document.getElementById('resources-container');
    const div = document.createElement('div');
    div.className = 'resource-item';
    div.innerHTML = `
        <input type="text" placeholder="e.g., Textbook page 45, Whiteboard">
        <button class="remove-btn" onclick="removeResource(this)"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(div);
}

function removeResource(btn) {
    const container = document.getElementById('resources-container');
    if (container.children.length > 1) {
        btn.parentElement.remove();
    } else {
        btn.parentElement.querySelector('input').value = '';
    }
}

function addSLO() {
    const container = document.getElementById('slo-container');
    const div = document.createElement('div');
    div.className = 'resource-item';
    div.innerHTML = `
        <input type="text" placeholder="e.g., Understand the concept of fractions">
        <button class="remove-btn" onclick="removeSLO(this)"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(div);
}

function removeSLO(btn) {
    const container = document.getElementById('slo-container');
    if (container.children.length > 1) {
        btn.parentElement.remove();
    } else {
        btn.parentElement.querySelector('input').value = '';
    }
}

function addActivity() {
    const container = document.getElementById('activities-container');
    const div = document.createElement('div');
    div.className = 'activity-item';
    div.innerHTML = `
        <input type="text" placeholder="e.g., Warm-up exercise, Group discussion">
        <button class="remove-btn" onclick="removeActivity(this)"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(div);
}

function removeActivity(btn) {
    const container = document.getElementById('activities-container');
    if (container.children.length > 1) {
        btn.parentElement.remove();
    } else {
        btn.parentElement.querySelector('input').value = '';
    }
}

function getCheckedMethodologies() {
    const checkboxes = document.querySelectorAll('input[name="methodology"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

function collectFormData() {
    return {
        date: document.getElementById('lesson-date')?.value || '',
        day: document.getElementById('day')?.value || '',
        className: document.getElementById('class')?.value || '',
        subject: document.getElementById('subject')?.value || '',
        topic: document.getElementById('topic')?.value || '',
        duration: document.getElementById('duration')?.value || '',
        resources: getInputValues('resources-container'),
        slos: getInputValues('slo-container'),
        methodologies: getCheckedMethodologies(),
        methodologyNotes: document.getElementById('methodology-notes')?.value || '',
        activities: getInputValues('activities-container'),
        feedback: document.getElementById('feedback')?.value || '',
        rating: document.querySelector('input[name="rating"]:checked')?.value || '',
        hometask: document.getElementById('hometask')?.value || ''
    };
}

function getInputValues(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return [];
    const inputs = container.querySelectorAll('input');
    return Array.from(inputs).map(input => input.value.trim()).filter(v => v);
}

function restoreFormData(data) {
    if (data.date) document.getElementById('lesson-date').value = data.date;
    if (data.day) document.getElementById('day').value = data.day;
    if (data.className) document.getElementById('class').value = data.className;
    if (data.subject) document.getElementById('subject').value = data.subject;
    if (data.topic) document.getElementById('topic').value = data.topic;
    if (data.duration) document.getElementById('duration').value = data.duration;
    if (data.methodologyNotes) document.getElementById('methodology-notes').value = data.methodologyNotes;
    if (data.feedback) document.getElementById('feedback').value = data.feedback;
    if (data.hometask) document.getElementById('hometask').value = data.hometask;
    if (data.rating) {
        const radio = document.querySelector(`input[name="rating"][value="${data.rating}"]`);
        if (radio) radio.checked = true;
    }
    
    setInputValues('resources-container', data.resources || []);
    setInputValues('slo-container', data.slos || []);
    setInputValues('activities-container', data.activities || []);
    
    document.querySelectorAll('input[name="methodology"]').forEach(cb => {
        cb.checked = data.methodologies?.includes(cb.value) || false;
    });
}

function setInputValues(containerId, values) {
    const container = document.getElementById(containerId);
    if (!container || !values.length) return;
    
    const inputs = container.querySelectorAll('input');
    values.forEach((value, index) => {
        if (inputs[index]) {
            inputs[index].value = value;
        } else {
            if (containerId === 'resources-container') addResource();
            else if (containerId === 'slo-container') addSLO();
            else if (containerId === 'activities-container') addActivity();
            const newInputs = container.querySelectorAll('input');
            if (newInputs[index]) newInputs[index].value = value;
        }
    });
}

// ========================================
// AI Functions (Grok API via Vercel)
// ========================================
async function generateAISLOs() {
    const subject = document.getElementById('subject')?.value;
    const topic = document.getElementById('topic')?.value || subject;
    const grade = document.getElementById('class')?.value;
    
    if (!subject) {
        showToast('Please enter subject first', 'warning');
        return;
    }
    
    showLoading(true, 'AI is generating learning outcomes...');
    
    try {
        const response = await fetch(`${API_BASE}/generate-slos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subject, topic, grade })
        });
        
        const data = await response.json();
        
        if (data.success && data.slos) {
            setInputValues('slo-container', data.slos);
            showToast('SLOs generated successfully!', 'success');
            await incrementUsage();
        } else {
            generateLocalSLOs(subject);
        }
    } catch (error) {
        console.error('AI Error:', error);
        generateLocalSLOs(subject);
    } finally {
        showLoading(false);
    }
}

function generateLocalSLOs(subject) {
    const defaultSLOs = {
        mathematics: [
            "Understand and apply mathematical concepts",
            "Solve problems using appropriate strategies",
            "Communicate mathematical reasoning clearly",
            "Make connections between mathematical ideas"
        ],
        science: [
            "Demonstrate understanding of scientific concepts",
            "Apply scientific method to solve problems",
            "Analyze and interpret data effectively",
            "Communicate scientific findings clearly"
        ],
        english: [
            "Read and comprehend grade-level texts",
            "Write clearly and effectively for different purposes",
            "Demonstrate understanding of grammar and vocabulary",
            "Participate effectively in discussions"
        ],
        default: [
            "Demonstrate understanding of key concepts",
            "Apply knowledge to solve real-world problems",
            "Communicate ideas effectively",
            "Collaborate with peers to achieve learning goals"
        ]
    };
    
    let slos = defaultSLOs.default;
    for (const [key, value] of Object.entries(defaultSLOs)) {
        if (subject.toLowerCase().includes(key)) {
            slos = value;
            break;
        }
    }
    
    setInputValues('slo-container', slos);
    showToast('SLOs generated from local database', 'info');
}

async function generateActivitiesWithAI() {
    const subject = document.getElementById('subject')?.value;
    const methodologies = getCheckedMethodologies();
    
    if (!subject) {
        showToast('Please enter subject first', 'warning');
        return;
    }
    
    if (methodologies.length === 0) {
        showToast('Please select at least one teaching methodology', 'warning');
        return;
    }
    
    showLoading(true, 'AI is generating activities...');
    
    try {
        const response = await fetch(`${API_BASE}/generate-activities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subject, methodologies })
        });
        
        const data = await response.json();
        
        if (data.success && data.activities) {
            setInputValues('activities-container', data.activities);
            showToast('Activities generated successfully!', 'success');
        } else {
            generateLocalActivities(subject, methodologies);
        }
    } catch (error) {
        console.error('AI Error:', error);
        generateLocalActivities(subject, methodologies);
    } finally {
        showLoading(false);
    }
}

function generateLocalActivities(subject, methodologies) {
    let subjectKey = 'general';
    if (subject.includes('math')) subjectKey = 'mathematics';
    else if (subject.includes('science')) subjectKey = 'science';
    else if (subject.includes('english')) subjectKey = 'english';
    else if (subject.includes('history')) subjectKey = 'history';
    
    const allActivities = [];
    methodologies.forEach(method => {
        const activities = activitySuggestions[subjectKey]?.[method] || activitySuggestions.general[method];
        if (activities) {
            allActivities.push(...activities.slice(0, 2));
        }
    });
    
    if (allActivities.length > 0) {
        setInputValues('activities-container', allActivities.slice(0, 5));
        showToast('Activities generated from local database', 'info');
    } else {
        showToast('No activities found. Please add manually.', 'warning');
    }
}

async function generateFullLessonWithAI() {
    const formData = collectFormData();
    
    if (!formData.subject) {
        showToast('Please fill subject first', 'warning');
        return;
    }
    
    showLoading(true, 'AI is creating your complete lesson plan...');
    
    try {
        const response = await fetch(`${API_BASE}/generate-full-lesson`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            if (data.slos) setInputValues('slo-container', data.slos);
            if (data.activities) setInputValues('activities-container', data.activities);
            if (data.resources) setInputValues('resources-container', data.resources);
            if (data.methodologyNotes) document.getElementById('methodology-notes').value = data.methodologyNotes;
            if (data.hometask) document.getElementById('hometask').value = data.hometask;
            
            generatePlan();
            showToast('Complete lesson plan generated!', 'success');
            await incrementUsage();
        } else {
            showToast('AI generation failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('AI Error:', error);
        showToast('Failed to generate. Check your connection.', 'error');
    } finally {
        showLoading(false);
    }
}

// ========================================
// Generate Plan Preview
// ========================================
function generatePlan() {
    const formData = collectFormData();
    
    const formattedDate = formData.date ? new Date(formData.date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    }) : '';
    
    let html = `
        <div class="generated-plan">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: var(--primary);">${formData.subject || 'Lesson'} Lesson Plan</h1>
                <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin-top: 10px;">
                    <span><i class="fas fa-calendar"></i> ${formattedDate} (${formData.day || 'TBA'})</span>
                    <span><i class="fas fa-users"></i> ${formData.className || 'Class TBA'}</span>
                    ${formData.duration ? `<span><i class="fas fa-clock"></i> ${formData.duration} min</span>` : ''}
                </div>
            </div>
    `;
    
    if (formData.resources.length) {
        html += `
            <div style="margin-bottom: 25px;">
                <h2 style="color: var(--primary); margin-bottom: 10px;"><i class="fas fa-boxes"></i> Resources</h2>
                <ul style="margin-left: 20px;">${formData.resources.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
            </div>
        `;
    }
    
    if (formData.slos.length) {
        html += `
            <div style="margin-bottom: 25px;">
                <h2 style="color: var(--primary); margin-bottom: 10px;"><i class="fas fa-bullseye"></i> Learning Outcomes</h2>
                <ul style="margin-left: 20px;">${formData.slos.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul>
            </div>
        `;
    }
    
    if (formData.methodologies.length || formData.methodologyNotes) {
        html += `
            <div style="margin-bottom: 25px;">
                <h2 style="color: var(--primary); margin-bottom: 10px;"><i class="fas fa-chalkboard"></i> Teaching Methodology</h2>
                <p><strong>Strategies:</strong> ${formData.methodologies.join(', ') || 'Not specified'}</p>
                ${formData.methodologyNotes ? `<p>${escapeHtml(formData.methodologyNotes)}</p>` : ''}
            </div>
        `;
    }
    
    if (formData.activities.length) {
        html += `
            <div style="margin-bottom: 25px;">
                <h2 style="color: var(--primary); margin-bottom: 10px;"><i class="fas fa-tasks"></i> Activities</h2>
                <ol style="margin-left: 20px;">${formData.activities.map(a => `<li>${escapeHtml(a)}</li>`).join('')}</ol>
            </div>
        `;
    }
    
    if (formData.hometask) {
        html += `
            <div style="margin-bottom: 25px;">
                <h2 style="color: var(--primary); margin-bottom: 10px;"><i class="fas fa-home"></i> Hometask</h2>
                <p>${escapeHtml(formData.hometask)}</p>
            </div>
        `;
    }
    
    if (formData.feedback || formData.rating) {
        html += `
            <div style="margin-bottom: 25px;">
                <h2 style="color: var(--primary); margin-bottom: 10px;"><i class="fas fa-clipboard-list"></i> Assessment</h2>
                ${formData.rating ? `<p><strong>Effectiveness:</strong> ${formData.rating}</p>` : ''}
                ${formData.feedback ? `<p>${escapeHtml(formData.feedback)}</p>` : ''}
            </div>
        `;
    }
    
    html += `</div>`;
    
    document.getElementById('preview-content').innerHTML = html;
    document.getElementById('preview-section').scrollIntoView({ behavior: 'smooth' });
}

// ========================================
// Save, Load, Delete Plans
// ========================================
function savePlan() {
    generatePlan();
    
    const formData = collectFormData();
    const previewHTML = document.getElementById('preview-content').innerHTML;
    
    const plan = {
        id: Date.now(),
        title: `${formData.subject || 'Untitled'} - ${formData.className || 'Class'}`,
        date: formData.date,
        day: formData.day,
        className: formData.className,
        subject: formData.subject,
        duration: formData.duration,
        resources: formData.resources,
        slos: formData.slos,
        methodologies: formData.methodologies,
        methodologyNotes: formData.methodologyNotes,
        activities: formData.activities,
        feedback: formData.feedback,
        rating: formData.rating,
        hometask: formData.hometask,
        previewHTML: previewHTML,
        timestamp: new Date().toISOString()
    };
    
    savedPlans.unshift(plan);
    localStorage.setItem('lessonPlans', JSON.stringify(savedPlans));
    renderSavedPlans();
    
    document.getElementById('saved-count').innerText = savedPlans.length;
    
    showToast('Lesson plan saved successfully!', 'success');
    localStorage.removeItem(`${toolSlug}_draft`);
    incrementUsage();
}

function renderSavedPlans() {
    const container = document.getElementById('saved-plans-container');
    if (!container) return;
    
    if (savedPlans.length === 0) {
        container.innerHTML = `
            <div class="empty-state glass-effect">
                <i class="fas fa-folder-open"></i>
                <p>No saved lesson plans yet</p>
                <button class="btn btn-primary" onclick="document.querySelector('[data-tab=\\'create-tab\\']').click()">
                    Create Your First Plan
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = savedPlans.map(plan => `
        <div class="plan-card glass-effect" data-id="${plan.id}">
            <h3><i class="fas fa-book"></i> ${escapeHtml(plan.title)}</h3>
            <p><i class="fas fa-calendar"></i> ${new Date(plan.timestamp).toLocaleString()}</p>
            <div class="plan-actions">
                <button class="btn btn-primary" onclick="loadPlan(${plan.id})"><i class="fas fa-eye"></i> View</button>
                <button class="btn btn-danger" onclick="deletePlan(${plan.id})"><i class="fas fa-trash"></i> Delete</button>
            </div>
        </div>
    `).join('');
    
    document.getElementById('saved-count').innerText = savedPlans.length;
}

function loadPlan(id) {
    const plan = savedPlans.find(p => p.id === id);
    if (!plan) return;
    
    restoreFormData(plan);
    document.getElementById('preview-content').innerHTML = plan.previewHTML || '<p>Preview not available</p>';
    
    switchTab('create-tab');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Loaded: ${plan.title}`, 'success');
}

function deletePlan(id) {
    if (confirm('Are you sure you want to delete this lesson plan?')) {
        savedPlans = savedPlans.filter(p => p.id !== id);
        localStorage.setItem('lessonPlans', JSON.stringify(savedPlans));
        renderSavedPlans();
        showToast('Plan deleted successfully', 'success');
    }
}

function filterSavedPlans(searchTerm) {
    const filtered = savedPlans.filter(plan => 
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const container = document.getElementById('saved-plans-container');
    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-search"></i><p>No matching plans found</p></div>`;
    } else {
        container.innerHTML = filtered.map(plan => `
            <div class="plan-card glass-effect">
                <h3>${escapeHtml(plan.title)}</h3>
                <p>${new Date(plan.timestamp).toLocaleString()}</p>
                <div class="plan-actions">
                    <button class="btn btn-primary" onclick="loadPlan(${plan.id})">View</button>
                    <button class="btn btn-danger" onclick="deletePlan(${plan.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }
}

// ========================================
// Templates
// ========================================
function renderTemplates() {
    const templates = [
        { name: "Mathematics - Fractions", subject: "Mathematics", grade: "Grade 4", duration: "45 min", category: "mathematics",
          slos: ["Understand what fractions represent", "Identify numerator and denominator", "Compare fractions"],
          activities: ["Fraction pizza activity", "Fraction wall construction", "Fraction comparison game"] },
        { name: "Science - Photosynthesis", subject: "Science", grade: "Grade 6", duration: "50 min", category: "science",
          slos: ["Explain the process of photosynthesis", "Identify parts of a plant involved", "Understand importance of sunlight"],
          activities: ["Leaf observation experiment", "Photosynthesis diagram drawing", "Role-play activity"] },
        { name: "English - Past Tense", subject: "English", grade: "Grade 5", duration: "40 min", category: "english",
          slos: ["Identify past tense verbs", "Convert present to past tense", "Use past tense in sentences"],
          activities: ["Verb sorting game", "Story completion activity", "Past tense bingo"] },
        { name: "History - Ancient Egypt", subject: "History", grade: "Grade 7", duration: "55 min", category: "history",
          slos: ["Describe ancient Egyptian civilization", "Explain the importance of the Nile", "Identify key pharaohs"],
          activities: ["Timeline creation", "Pyramid building simulation", "Hieroglyphics writing"] }
    ];
    
    const container = document.getElementById('templates-container');
    if (!container) return;
    
    container.innerHTML = templates.map((template, index) => `
        <div class="template-card glass-effect" data-category="${template.category}" onclick="loadTemplate(${index})">
            <h3><i class="fas fa-copy"></i> ${template.name}</h3>
            <p><i class="fas fa-book"></i> ${template.subject} | ${template.grade}</p>
            <p><i class="fas fa-clock"></i> ${template.duration}</p>
            <button class="btn btn-primary" style="margin-top: 12px; width: 100%;">Use Template</button>
        </div>
    `).join('');
}

function filterTemplates(category) {
    const templates = document.querySelectorAll('.template-card');
    templates.forEach(template => {
        if (category === 'all' || template.dataset.category === category) {
            template.style.display = 'block';
        } else {
            template.style.display = 'none';
        }
    });
}

function loadTemplate(index) {
    const templates = [
        { subject: "Mathematics", className: "Grade 4", topic: "Fractions", duration: "45",
          slos: ["Understand what fractions represent", "Identify numerator and denominator", "Compare fractions with same denominator"],
          activities: ["Fraction pizza activity", "Fraction wall construction", "Fraction comparison game"] },
        { subject: "Science", className: "Grade 6", topic: "Photosynthesis", duration: "50",
          slos: ["Explain the process of photosynthesis", "Identify the parts of a plant involved", "Understand the importance of sunlight"],
          activities: ["Leaf observation experiment", "Photosynthesis diagram drawing", "Role-play activity"] },
        { subject: "English", className: "Grade 5", topic: "Past Tense", duration: "40",
          slos: ["Identify past tense verbs", "Convert present tense to past tense", "Use past tense in sentences"],
          activities: ["Verb sorting game", "Story completion activity", "Past tense bingo"] },
        { subject: "History", className: "Grade 7", topic: "Ancient Egypt", duration: "55",
          slos: ["Describe ancient Egyptian civilization", "Explain the importance of the Nile", "Identify key pharaohs"],
          activities: ["Timeline creation", "Pyramid building simulation", "Hieroglyphics writing"] }
    ];
    
    const template = templates[index];
    if (template) {
        document.getElementById('subject').value = template.subject;
        document.getElementById('class').value = template.className;
        document.getElementById('topic').value = template.topic;
        document.getElementById('duration').value = template.duration;
        
        if (template.slos) setInputValues('slo-container', template.slos);
        if (template.activities) setInputValues('activities-container', template.activities);
        
        switchTab('create-tab');
        showToast(`Template "${template.subject}" loaded`, 'success');
    }
}

// ========================================
// Export Functions
// ========================================
async function downloadPDF() {
    const previewContent = document.getElementById('preview-content');
    
    showLoading(true, 'Generating PDF...');
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(20);
        const subject = document.getElementById('subject')?.value || 'Lesson Plan';
        doc.text(subject + ' Lesson Plan', 105, 20, { align: 'center' });
        
        const text = previewContent.innerText;
        const splitText = doc.splitTextToSize(text, 180);
        doc.text(splitText, 15, 40);
        
        doc.save(`${subject.replace(/ /g, '_')}_Lesson_Plan.pdf`);
        showToast('PDF downloaded successfully!', 'success');
        await incrementShare('pdf');
    } catch (error) {
        console.error('PDF Error:', error);
        showToast('Failed to generate PDF', 'error');
    } finally {
        showLoading(false);
    }
}

function printPlan() {
    const previewHTML = document.getElementById('preview-content').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html><head><title>Lesson Plan</title>
        <style>body { font-family: Arial, sans-serif; padding: 40px; }</style>
        </head><body>${previewHTML}</body></html>
    `);
    printWindow.document.close();
    printWindow.print();
    showToast('Print dialog opened', 'success');
}

function exportDoc() {
    const previewHTML = document.getElementById('preview-content').innerHTML;
    const subject = document.getElementById('subject')?.value || 'Lesson_Plan';
    const blob = new Blob([`
        <!DOCTYPE html>
        <html><head><meta charset="UTF-8"><title>${subject} Lesson Plan</title></head>
        <body>${previewHTML}</body></html>
    `], { type: 'application/msword' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${subject.replace(/ /g, '_')}_Lesson_Plan.doc`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('DOC file downloaded', 'success');
}

function exportTXT() {
    const text = document.getElementById('preview-content').innerText;
    const subject = document.getElementById('subject')?.value || 'Lesson_Plan';
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${subject.replace(/ /g, '_')}_Lesson_Plan.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('TXT file downloaded', 'success');
}

// ========================================
// Clear Form
// ========================================
function clearForm() {
    if (confirm('Are you sure you want to clear all form data?')) {
        document.getElementById('lesson-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('day').value = '';
        document.getElementById('class').value = '';
        document.getElementById('subject').value = '';
        document.getElementById('topic').value = '';
        document.getElementById('duration').value = '';
        document.getElementById('methodology-notes').value = '';
        document.getElementById('feedback').value = '';
        document.getElementById('hometask').value = '';
        
        document.querySelectorAll('input[name="methodology"]').forEach(cb => cb.checked = false);
        document.querySelectorAll('input[name="rating"]').forEach(rb => rb.checked = false);
        
        setInputValues('resources-container', []);
        setInputValues('slo-container', []);
        setInputValues('activities-container', []);
        
        document.getElementById('preview-content').innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-alt"></i>
                <p>Your lesson plan preview will appear here</p>
            </div>
        `;
        
        localStorage.removeItem(`${toolSlug}_draft`);
        showToast('Form cleared', 'info');
    }
}

// ========================================
// API Functions (Vercel Serverless - TiDB Connected)
// ========================================
async function incrementUsage() {
    try {
        const response = await fetch(`${API_BASE}/increment-usage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toolSlug, userId: currentUser })
        });
        const data = await response.json();
        if (data.success) {
            await loadGlobalUsageCount();
        }
    } catch (error) {
        console.error('Usage increment error:', error);
        let localCount = localStorage.getItem(`${toolSlug}_local_count`) || 0;
        localCount++;
        localStorage.setItem(`${toolSlug}_local_count`, localCount);
        document.getElementById('global-usage-count').innerText = localCount;
    }
}

async function loadGlobalUsageCount() {
    try {
        const response = await fetch(`${API_BASE}/get-usage?toolSlug=${toolSlug}`);
        const data = await response.json();
        if (data.success && data.count !== undefined) {
            document.getElementById('global-usage-count').innerText = data.count;
        } else {
            const localCount = localStorage.getItem(`${toolSlug}_local_count`) || 0;
            document.getElementById('global-usage-count').innerText = localCount;
        }
    } catch (error) {
        console.error('Load usage error:', error);
        const localCount = localStorage.getItem(`${toolSlug}_local_count`) || 0;
        document.getElementById('global-usage-count').innerText = localCount;
    }
}

async function addReaction(emoji) {
    const userId = currentUser;
    const reactionKey = `${toolSlug}_${emoji}_${userId}`;
    
    if (reactionStates[reactionKey]) {
        showToast('You already reacted with this emoji!', 'warning');
        return;
    }
    
    showLoading(true, 'Saving your reaction...');
    
    try {
        const response = await fetch(`${API_BASE}/add-reaction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toolSlug, emoji, userId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            reactionStates[reactionKey] = true;
            localStorage.setItem('reactionStates', JSON.stringify(reactionStates));
            await loadReactionsFromAPI();
            showToast(`Thanks for your feedback!`, 'success');
        } else {
            throw new Error('Failed to save');
        }
    } catch (error) {
        console.error('Reaction error:', error);
        reactionStates[reactionKey] = true;
        localStorage.setItem('reactionStates', JSON.stringify(reactionStates));
        
        let localCounts = JSON.parse(localStorage.getItem(`${toolSlug}_reactions`) || '{}');
        localCounts[emoji] = (localCounts[emoji] || 0) + 1;
        localStorage.setItem(`${toolSlug}_reactions`, JSON.stringify(localCounts));
        updateReactionCounts(localCounts);
        showToast(`Thanks for your feedback! (Saved locally)`, 'success');
    } finally {
        showLoading(false);
    }
}

async function loadReactionsFromAPI() {
    try {
        const response = await fetch(`${API_BASE}/get-reactions?toolSlug=${toolSlug}`);
        const data = await response.json();
        
        if (data.success && data.reactions) {
            updateReactionCounts(data.reactions);
        } else {
            const localCounts = JSON.parse(localStorage.getItem(`${toolSlug}_reactions`) || '{}');
            updateReactionCounts(localCounts);
        }
    } catch (error) {
        console.error('Load reactions error:', error);
        const localCounts = JSON.parse(localStorage.getItem(`${toolSlug}_reactions`) || '{}');
        updateReactionCounts(localCounts);
    }
}

function updateReactionCounts(counts) {
    for (const [emoji, count] of Object.entries(counts)) {
        const countElement = document.getElementById(`reaction-count-${emoji}`);
        if (countElement) countElement.innerText = count;
    }
}

async function incrementShare(platform) {
    try {
        const response = await fetch(`${API_BASE}/add-share`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toolSlug, platform, userId: currentUser })
        });
        await response.json();
        await loadShareCountFromAPI();
    } catch (error) {
        console.error('Share increment error:', error);
        let localShares = localStorage.getItem(`${toolSlug}_shares`) || 0;
        localShares++;
        localStorage.setItem(`${toolSlug}_shares`, localShares);
        document.getElementById('share-count').innerText = `${localShares} shares`;
    }
}

async function loadShareCountFromAPI() {
    try {
        const response = await fetch(`${API_BASE}/get-shares?toolSlug=${toolSlug}`);
        const data = await response.json();
        
        if (data.success && data.count !== undefined) {
            document.getElementById('share-count').innerText = `${data.count} shares`;
        } else {
            const localShares = localStorage.getItem(`${toolSlug}_shares`) || 0;
            document.getElementById('share-count').innerText = `${localShares} shares`;
        }
    } catch (error) {
        console.error('Load shares error:', error);
        const localShares = localStorage.getItem(`${toolSlug}_shares`) || 0;
        document.getElementById('share-count').innerText = `${localShares} shares`;
    }
}

async function loadStats() {
    try {
        const response = await fetch(`${API_BASE}/get-stats?toolSlug=${toolSlug}`);
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('total-lessons-count').innerText = data.totalLessons || savedPlans.length;
            document.getElementById('total-shares-count').innerText = data.totalShares || 0;
            document.getElementById('avg-rating').innerText = data.avgRating || '4.8';
        } else {
            document.getElementById('total-lessons-count').innerText = savedPlans.length;
        }
    } catch (error) {
        console.error('Load stats error:', error);
        document.getElementById('total-lessons-count').innerText = savedPlans.length;
    }
}

// ========================================
// Share Functions
// ========================================
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
    incrementShare('facebook');
}

function shareOnTwitter() {
    const text = encodeURIComponent('Check out this Advanced Lesson Planner Tool!');
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400');
    incrementShare('twitter');
}

function shareOnWhatsApp() {
    const text = encodeURIComponent('Check out this Advanced Lesson Planner Tool! ');
    const url = encodeURIComponent(window.location.href);
    window.open(`https://wa.me/?text=${text}${url}`, '_blank');
    incrementShare('whatsapp');
}

function shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=400');
    incrementShare('linkedin');
}

function copyPageURL() {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link copied to clipboard!', 'success');
    incrementShare('copy');
}

// ========================================
// Analytics Functions
// ========================================
function loadAnalyticsCharts() {
    // Weekly activity data
    const weeklyData = [12, 19, 15, 17, 14, 22, 18];
    const methodologyData = {
        Lecture: 45,
        Demonstration: 30,
        Discussion: 50,
        "Group Work": 35,
        "Problem Solving": 25
    };
    
    // You can integrate Chart.js or any charting library here
    // For now, showing sample data
    const topLessonsList = document.getElementById('top-lessons-list');
    if (topLessonsList) {
        topLessonsList.innerHTML = `
            <div class="top-lesson-item">📊 Fractions Lesson - 45 sessions</div>
            <div class="top-lesson-item">🔬 Photosynthesis - 38 sessions</div>
            <div class="top-lesson-item">📝 Past Tense - 32 sessions</div>
            <div class="top-lesson-item">🏛️ Ancient Egypt - 28 sessions</div>
        `;
    }
    
    const monthlySummary = document.getElementById('monthly-summary');
    if (monthlySummary) {
        monthlySummary.innerHTML = `
            <div>📅 Total Lessons: ${savedPlans.length}</div>
            <div>⭐ Average Rating: 4.8/5</div>
            <div>📈 Growth: +15% this month</div>
            <div>🎯 Most Active: Wednesday</div>
        `;
    }
}

function showStats() {
    switchTab('analytics-tab');
    showToast('Analytics dashboard loaded', 'success');
}

function showPerformance() {
    showToast('Performance metrics loading...', 'info');
}

function exportAnalytics() {
    const data = {
        totalLessons: savedPlans.length,
        totalShares: document.getElementById('share-count')?.innerText || '0',
        timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_${toolSlug}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Analytics exported', 'success');
}

function createNewPlan() {
    clearForm();
    switchTab('create-tab');
    showToast('New plan created', 'success');
}

function openTemplateGallery() {
    switchTab('templates-tab');
    showToast('Template gallery opened', 'success');
}

function importPlan() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const plan = JSON.parse(event.target.result);
                if (plan.subject) {
                    restoreFormData(plan);
                    showToast('Plan imported successfully', 'success');
                }
            } catch (error) {
                showToast('Invalid file format', 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function exportAllPlans() {
    const blob = new Blob([JSON.stringify(savedPlans, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all_plans_${toolSlug}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('All plans exported', 'success');
}

function openNotificationsSettings() {
    showToast('Notifications settings coming soon', 'info');
}

function manageAPIKeys() {
    showToast('API settings coming soon', 'info');
}

function openPremiumModal() {
    const modal = document.getElementById('premium-modal');
    if (modal) modal.style.display = 'flex';
}

function closePremiumModal() {
    const modal = document.getElementById('premium-modal');
    if (modal) modal.style.display = 'none';
}

// ========================================
// UI Helper Functions
// ========================================
function showLoading(show, message = 'Processing...') {
    const overlay = document.getElementById('loading-overlay');
    const loadingText = document.getElementById('loading-text');
    if (overlay) {
        overlay.style.display = show ? 'flex' : 'none';
        if (loadingText && message) loadingText.innerText = message;
    }
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    else if (type === 'error') icon = '❌';
    else if (type === 'warning') icon = '⚠️';
    
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========================================
// Add slideOut animation
// ========================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ========================================
// Export global functions
// ========================================
window.addResource = addResource;
window.removeResource = removeResource;
window.addSLO = addSLO;
window.removeSLO = removeSLO;
window.addActivity = addActivity;
window.removeActivity = removeActivity;
window.generatePlan = generatePlan;
window.savePlan = savePlan;
window.loadPlan = loadPlan;
window.deletePlan = deletePlan;
window.clearForm = clearForm;
window.downloadPDF = downloadPDF;
window.printPlan = printPlan;
window.exportDoc = exportDoc;
window.exportTXT = exportTXT;
window.generateAISLOs = generateAISLOs;
window.generateActivitiesWithAI = generateActivitiesWithAI;
window.generateFullLessonWithAI = generateFullLessonWithAI;
window.loadTemplate = loadTemplate;
window.shareOnFacebook = shareOnFacebook;
window.shareOnTwitter = shareOnTwitter;
window.shareOnWhatsApp = shareOnWhatsApp;
window.shareOnLinkedIn = shareOnLinkedIn;
window.copyPageURL = copyPageURL;
window.openPremiumModal = openPremiumModal;
window.closePremiumModal = closePremiumModal;
window.showStats = showStats;
window.showPerformance = showPerformance;
window.exportAnalytics = exportAnalytics;
window.createNewPlan = createNewPlan;
window.openTemplateGallery = openTemplateGallery;
window.importPlan = importPlan;
window.exportAllPlans = exportAllPlans;
window.openNotificationsSettings = openNotificationsSettings;
window.manageAPIKeys = manageAPIKeys;
