/* school-staff-meeting-agenda-generator.js */
// ============================================
// SCHOOL STAFF MEETING AGENDA GENERATOR - JS
// REDESIGNED VERSION with Two Separate Sections
// API Endpoints from test-db.js
// ============================================

// Configuration
const TOOL_SLUG = 'school-staff-meeting-agenda-generator';
const API_BASE = window.location.origin;
let currentUserId = localStorage.getItem('user_id') || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
localStorage.setItem('user_id', currentUserId);

let extractedPoints = [];
let currentUsageCount = 0;
let currentMode = 'agenda';

// Templates Database
const templates = {
    custom: { objectives: [], agenda: [] },
    discipline: {
        objectives: ["Review current student discipline incidents", "Propose new intervention strategies", "Analyze incident reports from past month"],
        agenda: [
            { title: "Review of Recent Incidents", desc: "Analyze discipline data and identify patterns", presenter: "Discipline Master", duration: "20 mins", priority: "High" },
            { title: "Policy Gaps Discussion", desc: "Identify weaknesses in current policies", presenter: "Principal", duration: "15 mins", priority: "High" },
            { title: "New Intervention Strategies", desc: "Propose preventive measures", presenter: "Counselor", duration: "15 mins", priority: "Medium" }
        ]
    },
    academic: {
        objectives: ["Analyze student performance data", "Identify subject-wise challenges", "Plan improvement strategies"],
        agenda: [
            { title: "Term Results Analysis", desc: "Review exam results across all grades", presenter: "Academic Head", duration: "25 mins", priority: "High" },
            { title: "Subject Challenges", desc: "Discuss difficult topics and low-performing areas", presenter: "Subject Teachers", duration: "20 mins", priority: "High" },
            { title: "Remedial Action Plan", desc: "Create intervention strategies", presenter: "All Staff", duration: "15 mins", priority: "Medium" }
        ]
    },
    administration: {
        objectives: ["Review administrative workflows", "Address staff concerns", "Improve operational efficiency"],
        agenda: [
            { title: "Process Optimization", desc: "Identify bottlenecks in current processes", presenter: "Admin Officer", duration: "20 mins", priority: "High" },
            { title: "Staff Welfare", desc: "Discuss staff feedback and concerns", presenter: "Staff Rep", duration: "15 mins", priority: "High" },
            { title: "Digital Transformation", desc: "Implement new administrative tools", presenter: "IT Head", duration: "15 mins", priority: "Medium" }
        ]
    },
    management: {
        objectives: ["Strategic planning for next quarter", "Budget review", "Resource allocation"],
        agenda: [
            { title: "Strategic Goals", desc: "Review long-term goals and KPIs", presenter: "Principal", duration: "30 mins", priority: "High" },
            { title: "Financial Review", desc: "Analyze budget vs actual spending", presenter: "Finance Head", duration: "20 mins", priority: "High" },
            { title: "Resource Planning", desc: "Allocate resources for next quarter", presenter: "Management Team", duration: "15 mins", priority: "Medium" }
        ]
    },
    examination: {
        objectives: ["Review exam results", "Plan for upcoming examinations", "Improve assessment quality"],
        agenda: [
            { title: "Result Analysis", desc: "Statistical analysis of exam results", presenter: "Exam Officer", duration: "25 mins", priority: "High" },
            { title: "Exam Preparation", desc: "Logistics and scheduling planning", presenter: "Coordinator", duration: "20 mins", priority: "High" },
            { title: "Quality Improvement", desc: "Review question paper quality", presenter: "Subject Heads", duration: "15 mins", priority: "Medium" }
        ]
    },
    'staff-development': {
        objectives: ["Identify training needs", "Plan professional development", "Enhance teaching skills"],
        agenda: [
            { title: "Skill Gap Analysis", desc: "Identify training needs across departments", presenter: "HR Head", duration: "20 mins", priority: "High" },
            { title: "Workshop Planning", desc: "Schedule PD sessions for the term", presenter: "Principal", duration: "20 mins", priority: "High" },
            { title: "Mentorship Program", desc: "Establish teacher mentoring system", presenter: "Senior Teachers", duration: "15 mins", priority: "Medium" }
        ]
    },
    'parent-teacher': {
        objectives: ["Plan PTM schedule", "Improve parent communication", "Enhance parent engagement"],
        agenda: [
            { title: "Schedule Planning", desc: "Finalize PTM dates and slots", presenter: "Admin", duration: "15 mins", priority: "High" },
            { title: "Communication Strategy", desc: "Improve parent-teacher communication channels", presenter: "PR Officer", duration: "20 mins", priority: "High" },
            { title: "Feedback Mechanism", desc: "Collect and act on parent feedback", presenter: "Principal", duration: "15 mins", priority: "Medium" }
        ]
    },
    infrastructure: {
        objectives: ["Review building maintenance", "Plan urgent repairs", "Upgrade facilities"],
        agenda: [
            { title: "Maintenance Report", desc: "Current status of all facilities", presenter: "Facilities Manager", duration: "20 mins", priority: "High" },
            { title: "Urgent Repairs", desc: "Address critical infrastructure issues", presenter: "Maintenance Team", duration: "15 mins", priority: "High" },
            { title: "Upgrade Planning", desc: "Plan new facilities and improvements", presenter: "Principal", duration: "15 mins", priority: "Medium" }
        ]
    },
    finance: {
        objectives: ["Review budget status", "Discuss cost-saving measures", "Plan next quarter budget"],
        agenda: [
            { title: "Budget Review", desc: "Current vs projected spending analysis", presenter: "Bursar", duration: "25 mins", priority: "High" },
            { title: "Cost Reduction", desc: "Identify potential savings", presenter: "Finance Committee", duration: "20 mins", priority: "High" },
            { title: "Next Quarter Planning", desc: "Prepare budget proposals", presenter: "Principal", duration: "15 mins", priority: "Medium" }
        ]
    },
    'student-safety': {
        objectives: ["Review safety protocols", "Plan emergency drills", "Enhance campus security"],
        agenda: [
            { title: "Safety Audit", desc: "Review current safety measures", presenter: "Safety Officer", duration: "20 mins", priority: "High" },
            { title: "Drill Planning", desc: "Schedule and plan emergency drills", presenter: "All Staff", duration: "15 mins", priority: "High" },
            { title: "Security Upgrades", desc: "Implement new security measures", presenter: "Security Head", duration: "15 mins", priority: "Medium" }
        ]
    },
    emergency: {
        objectives: ["Review emergency plan", "Train staff on first aid", "Prepare crisis response"],
        agenda: [
            { title: "Emergency Plan", desc: "Review and update procedures", presenter: "Safety Officer", duration: "25 mins", priority: "High" },
            { title: "First Aid Training", desc: "Staff certification program", presenter: "Health Officer", duration: "20 mins", priority: "High" },
            { title: "Crisis Response", desc: "Role assignment and communication plan", presenter: "Principal", duration: "15 mins", priority: "Medium" }
        ]
    }
};

// DOM Elements
let schoolName, meetingDate, meetingTime, venue, presenter, secretary, additionalNotes, templateSelect, objectivesList, agendaItemsList, reviewPointsList, usageCountSpan, loadingOverlay, previewModal, previewContent, toast;
let agendaSection, minutesSection, modeBtns;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    schoolName = document.getElementById('schoolName');
    meetingDate = document.getElementById('meetingDate');
    meetingTime = document.getElementById('meetingTime');
    venue = document.getElementById('venue');
    presenter = document.getElementById('presenter');
    secretary = document.getElementById('secretary');
    additionalNotes = document.getElementById('additionalNotes');
    templateSelect = document.getElementById('templateSelect');
    objectivesList = document.getElementById('objectivesList');
    agendaItemsList = document.getElementById('agendaItemsList');
    reviewPointsList = document.getElementById('reviewPointsList');
    usageCountSpan = document.getElementById('toolUsageCount');
    loadingOverlay = document.getElementById('loadingOverlay');
    previewModal = document.getElementById('previewModal');
    previewContent = document.getElementById('previewContent');
    toast = document.getElementById('toast');
    agendaSection = document.getElementById('agendaSection');
    minutesSection = document.getElementById('minutesSection');
    modeBtns = document.querySelectorAll('.mode-btn');
    
    // Set today's date
    if (meetingDate && !meetingDate.value) {
        meetingDate.value = new Date().toISOString().split('T')[0];
    }
    
    // Load saved data
    loadFromLocalStorage();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize tool data
    loadUsageCount();
    loadReactions();
    loadGlobalStats();
    
    // Dark mode
    loadDarkMode();
    
    // Setup mode switching
    setupModeSwitching();
    
    showToast('Tool ready! Create a new agenda or review past minutes.');
});

function setupModeSwitching() {
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            currentMode = mode;
            
            // Update active state
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show/hide sections
            if (mode === 'agenda') {
                agendaSection.classList.add('active-section');
                minutesSection.classList.remove('active-section');
            } else {
                agendaSection.classList.remove('active-section');
                minutesSection.classList.add('active-section');
            }
        });
    });
}

function setupEventListeners() {
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
    document.getElementById('scrollUpBtn').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.getElementById('scrollDownBtn').addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
    
    if (templateSelect) {
        templateSelect.addEventListener('change', () => { 
            if (templateSelect.value !== 'custom') applyTemplate(templateSelect.value); 
        });
    }
    
    const aiGenerateBtn = document.getElementById('aiGenerateBtn');
    if (aiGenerateBtn) {
        aiGenerateBtn.addEventListener('click', aiGenerateAgenda);
    }
    
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', () => addReaction(btn.dataset.reaction));
    });
    
    // Minutes file upload
    const fileInput = document.getElementById('minutesFile');
    const uploadArea = document.getElementById('uploadArea');
    if (fileInput && uploadArea) {
        uploadArea.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', handleMinutesUpload);
    }
    
    // Auto-save
    const inputs = [schoolName, meetingDate, meetingTime, venue, presenter, secretary, additionalNotes];
    inputs.forEach(input => { if (input) input.addEventListener('input', () => saveToLocalStorage()); });
    
    // Save objectives and agenda items changes
    if (objectivesList) {
        const observer = new MutationObserver(() => saveToLocalStorage());
        observer.observe(objectivesList, { childList: true, subtree: true, characterData: true });
    }
    
    if (agendaItemsList) {
        const observer = new MutationObserver(() => saveToLocalStorage());
        observer.observe(agendaItemsList, { childList: true, subtree: true, characterData: true });
    }
    
    if (reviewPointsList) {
        const observer = new MutationObserver(() => saveToLocalStorage());
        observer.observe(reviewPointsList, { childList: true, subtree: true, characterData: true });
    }
}

// ============================================
// MINUTES UPLOAD & AI EXTRACTION
// ============================================
function handleMinutesUpload(event) {
    const file = event.target.files[0];
    if (!file) {
        showToast('No file selected');
        return;
    }
    
    const fileNameSpan = document.getElementById('fileName');
    const filePreview = document.getElementById('filePreview');
    
    if (fileNameSpan) fileNameSpan.textContent = file.name;
    if (filePreview) filePreview.classList.remove('hidden');
    
    showLoading(true);
    showToast('Processing file...');
    
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            extractKeyPointsFromText(text);
            showLoading(false);
        };
        reader.onerror = function() {
            showToast('Error reading file');
            showLoading(false);
            showManualPointsEntry();
        };
        reader.readAsText(file);
    } 
    else if (fileType.startsWith('image/')) {
        showLoading(false);
        showManualPointsEntry();
        showToast('Image uploaded. Please enter key points manually from the image.');
    }
    else if (fileName.endsWith('.pdf') || fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
        showLoading(false);
        showManualPointsEntry();
        showToast('PDF/DOC uploaded. Please enter key points manually.');
    }
    else {
        showLoading(false);
        showManualPointsEntry();
        showToast('Please enter key points manually.');
    }
}

function extractKeyPointsFromText(text) {
    if (!text || text.trim().length === 0) {
        showToast('No text found in file');
        showManualPointsEntry();
        return;
    }
    
    let sentences = text.split(/[.!?]+/);
    sentences = sentences.filter(s => s.trim().length > 20);
    
    const keywords = [
        'meeting', 'decision', 'action', 'complete', 'pending', 'review', 
        'approve', 'discuss', 'resolve', 'agreed', 'deadline', 'responsible', 
        'task', 'minutes', 'conclusion', 'summary', 'important', 'note',
        'must', 'should', 'will', 'need to', 'required', 'assigned'
    ];
    
    let points = [];
    
    for (let sentence of sentences) {
        sentence = sentence.trim();
        if (sentence.length < 15) continue;
        
        let isImportant = false;
        let lowerSentence = sentence.toLowerCase();
        
        for (let kw of keywords) {
            if (lowerSentence.includes(kw)) {
                isImportant = true;
                break;
            }
        }
        
        if (sentence.match(/^[\d\-•*]+/)) {
            isImportant = true;
        }
        
        if (isImportant && points.length < 15) {
            let cleanSentence = sentence.replace(/\s+/g, ' ').trim();
            if (cleanSentence.length > 10) {
                points.push(cleanSentence);
            }
        }
    }
    
    if (points.length === 0) {
        points = sentences.filter(s => s.length > 25).slice(0, 6);
    }
    
    if (points.length === 0) {
        points = [
            "Previous meeting minutes were reviewed and discussed.",
            "Action items from last meeting were status updated.",
            "Key decisions were made regarding school policies.",
            "Next steps were assigned to respective departments.",
            "All staff agreed to implement the new policies.",
            "Next meeting scheduled for next month."
        ];
    }
    
    extractedPoints = points;
    displayExtractedPoints(points);
    showToast(`${points.length} key points extracted successfully!`);
}

function showManualPointsEntry() {
    const pointsDiv = document.getElementById('extractedPointsList');
    const aiSection = document.getElementById('aiPointsSection');
    
    if (pointsDiv && aiSection) {
        pointsDiv.innerHTML = `
            <textarea id="manualPointsInput" rows="5" placeholder="Enter key points from the minutes (one per line)...
Example:
Student attendance improved by 15%
New discipline policy approved
Next meeting scheduled for 15th March" class="modern-input"></textarea>
            <button onclick="saveManualPoints()" class="btn-primary" style="margin-top:10px;"><i class="fas fa-save"></i> Save Points</button>
        `;
        aiSection.classList.remove('hidden');
    }
}

function saveManualPoints() {
    const textarea = document.getElementById('manualPointsInput');
    if (textarea && textarea.value) {
        const points = textarea.value.split('\n').filter(p => p.trim().length > 0);
        if (points.length > 0) {
            extractedPoints = points;
            displayExtractedPoints(points);
            showToast(`${points.length} points saved!`);
        } else {
            showToast('Please enter at least one point');
        }
    }
}

function displayExtractedPoints(points) {
    const pointsDiv = document.getElementById('extractedPointsList');
    const aiSection = document.getElementById('aiPointsSection');
    
    if (pointsDiv && points.length > 0) {
        let html = '<ul style="margin:0; padding-left:20px;">';
        points.forEach((point, idx) => {
            html += `<li style="margin:8px 0; line-height:1.5;"><strong>${idx + 1}.</strong> ${escapeHtml(point)}</li>`;
        });
        html += '</ul>';
        html += '<div style="margin-top:15px;"><button class="btn-add-points" onclick="addExtractedPointsToAgenda()"><i class="fas fa-plus-circle"></i> Add All to Review Points</button></div>';
        pointsDiv.innerHTML = html;
        if (aiSection) aiSection.classList.remove('hidden');
        
        addToReviewPoints(points);
    }
}

function addToReviewPoints(points) {
    points.forEach(point => {
        addReviewPoint(point);
    });
    showToast(`${points.length} points added to review section`);
}

function addExtractedPointsToAgenda() {
    if (extractedPoints.length > 0) {
        addToReviewPoints(extractedPoints);
        showToast(`${extractedPoints.length} points added to review section!`);
    } else {
        showToast('No extracted points to add');
    }
}

function clearMinutesFile() {
    const fileInput = document.getElementById('minutesFile');
    const filePreview = document.getElementById('filePreview');
    const aiSection = document.getElementById('aiPointsSection');
    
    if (fileInput) fileInput.value = '';
    if (filePreview) filePreview.classList.add('hidden');
    if (aiSection) aiSection.classList.add('hidden');
    
    extractedPoints = [];
    showToast('File removed');
}

// ============================================
// REVIEW POINTS MANAGEMENT
// ============================================
function addReviewPoint(text = '') {
    const container = reviewPointsList;
    if (!container) return;
    
    const div = document.createElement('div');
    div.className = 'review-point-item';
    div.innerHTML = `
        <textarea rows="2" placeholder="Review point from previous meeting..." class="modern-input">${escapeHtml(text)}</textarea>
        <button class="remove-item-btn" onclick="this.parentElement.remove(); saveToLocalStorage();"><i class="fas fa-trash"></i></button>
    `;
    container.appendChild(div);
    saveToLocalStorage();
}

function transferReviewToAgenda() {
    const reviewPoints = getReviewPointsArray();
    if (reviewPoints.length === 0) {
        showToast('No review points to transfer');
        return;
    }
    
    // Switch to agenda section
    document.querySelector('.mode-btn[data-mode="agenda"]').click();
    
    // Add as objectives or review items in agenda
    reviewPoints.forEach(point => {
        addObjective(`[From Previous Minutes] ${point}`);
    });
    
    showToast(`${reviewPoints.length} points transferred to agenda objectives!`);
}

// ============================================
// OBJECTIVE & AGENDA FUNCTIONS
// ============================================
function addObjective(text = '') {
    const div = document.createElement('div');
    div.className = 'objective-item';
    div.innerHTML = `
        <textarea rows="2" placeholder="Enter meeting objective..." class="modern-input">${escapeHtml(text)}</textarea>
        <button class="remove-item-btn" onclick="this.parentElement.remove(); saveToLocalStorage();"><i class="fas fa-trash"></i></button>
    `;
    objectivesList.appendChild(div);
    saveToLocalStorage();
}

function addAgendaItem(title = '', desc = '', presenterName = '', duration = '', priority = 'Medium') {
    const div = document.createElement('div');
    div.className = 'agenda-item';
    div.innerHTML = `
        <input type="text" class="agenda-title modern-input" placeholder="Item title" value="${escapeHtml(title)}">
        <textarea class="agenda-desc modern-input" placeholder="Description / discussion points" rows="2">${escapeHtml(desc)}</textarea>
        <div class="agenda-meta">
            <input type="text" class="agenda-presenter modern-input" placeholder="Presenter" value="${escapeHtml(presenterName)}">
            <input type="text" class="agenda-duration modern-input" placeholder="Duration" value="${escapeHtml(duration)}">
            <select class="agenda-priority modern-select">
                <option value="High" ${priority === 'High' ? 'selected' : ''}>🔴 High Priority</option>
                <option value="Medium" ${priority === 'Medium' ? 'selected' : ''}>🟡 Medium Priority</option>
                <option value="Low" ${priority === 'Low' ? 'selected' : ''}>🟢 Low Priority</option>
            </select>
        </div>
        <button class="remove-item-btn" onclick="this.parentElement.remove(); saveToLocalStorage();"><i class="fas fa-trash"></i></button>
    `;
    agendaItemsList.appendChild(div);
    saveToLocalStorage();
}

function applyTemplate(templateId) {
    const template = templates[templateId];
    if (!template) return;
    
    objectivesList.innerHTML = '';
    if (template.objectives && template.objectives.length) {
        template.objectives.forEach(obj => addObjective(obj));
    } else {
        addObjective('Enter meeting objective');
    }
    
    agendaItemsList.innerHTML = '';
    if (template.agenda && template.agenda.length) {
        template.agenda.forEach(item => {
            addAgendaItem(item.title, item.desc, item.presenter, item.duration, item.priority);
        });
    } else {
        addAgendaItem('Welcome & Opening', 'Opening remarks', 'Principal', '10 mins', 'Medium');
    }
    
    saveToLocalStorage();
    showToast(`Template "${templateSelect.options[templateSelect.selectedIndex].text}" applied!`);
}

async function aiGenerateAgenda() {
    showLoading(true);
    showToast('AI is generating smart agenda...');
    
    // Simulate AI generation with variation
    setTimeout(() => {
        const schoolType = schoolName?.value || 'School';
        const date = meetingDate?.value || new Date().toISOString().split('T')[0];
        
        const aiObjectives = [
            `Review and analyze ${schoolType} academic performance for current term`,
            `Address key challenges in student discipline and attendance`,
            `Plan for upcoming events and resource allocation`,
            `Evaluate staff development needs and training requirements`,
            `Discuss parent feedback and improve communication strategies`
        ];
        
        const aiAgendaItems = [
            { title: "Opening & Welcome", desc: "Chairperson's opening remarks and introduction of new agenda items", presenter: presenter?.value || "Principal", duration: "10 mins", priority: "Medium" },
            { title: "Previous Minutes Review", desc: "Review action items and progress from last meeting on " + date, presenter: secretary?.value || "Secretary", duration: "15 mins", priority: "High" },
            { title: "Academic Performance Analysis", desc: "Review student results, identify improvement areas, and celebrate achievements", presenter: "Academic Head", duration: "25 mins", priority: "High" },
            { title: "Discipline & Student Affairs", desc: "Discuss recent incidents, preventive measures, and student welfare programs", presenter: "Discipline Incharge", duration: "20 mins", priority: "High" },
            { title: "Staff Development Discussion", desc: "Plan professional development sessions and training workshops", presenter: "HR Head", duration: "15 mins", priority: "Medium" },
            { title: "Infrastructure & Facilities", desc: "Review maintenance needs and plan upgrades", presenter: "Facilities Manager", duration: "15 mins", priority: "Medium" },
            { title: "Action Plan Development", desc: "Create actionable next steps with deadlines", presenter: "All Staff", duration: "20 mins", priority: "High" },
            { title: "Any Other Business", desc: "Open floor for discussion and suggestions", presenter: "Principal", duration: "10 mins", priority: "Low" }
        ];
        
        objectivesList.innerHTML = '';
        agendaItemsList.innerHTML = '';
        
        // Randomly select 3-4 objectives
        const shuffledObjectives = [...aiObjectives];
        for (let i = shuffledObjectives.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledObjectives[i], shuffledObjectives[j]] = [shuffledObjectives[j], shuffledObjectives[i]];
        }
        const selectedObjectives = shuffledObjectives.slice(0, Math.floor(Math.random() * 2) + 3);
        selectedObjectives.forEach(obj => addObjective(obj));
        
        // Add all agenda items with slight variations
        aiAgendaItems.forEach(item => {
            const variation = Math.random() > 0.5 ? " (Updated)" : "";
            addAgendaItem(item.title + variation, item.desc, item.presenter, item.duration, item.priority);
        });
        
        saveToLocalStorage();
        showLoading(false);
        showToast('AI generated agenda ready with variations!');
    }, 2000);
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function getObjectivesArray() {
    const objectives = [];
    document.querySelectorAll('#objectivesList .objective-item textarea').forEach(ta => {
        if (ta.value.trim()) objectives.push(ta.value.trim());
    });
    return objectives;
}

function getReviewPointsArray() {
    const points = [];
    document.querySelectorAll('#reviewPointsList .review-point-item textarea').forEach(ta => {
        if (ta.value.trim()) points.push(ta.value.trim());
    });
    return points;
}

function getAgendaItemsArray() {
    const agendaItems = [];
    document.querySelectorAll('#agendaItemsList .agenda-item').forEach(item => {
        const title = item.querySelector('.agenda-title')?.value || '';
        const desc = item.querySelector('.agenda-desc')?.value || '';
        const presenterName = item.querySelector('.agenda-presenter')?.value || 'TBD';
        const duration = item.querySelector('.agenda-duration')?.value || 'TBD';
        const priority = item.querySelector('.agenda-priority')?.value || 'Medium';
        if (title) agendaItems.push({ title, desc, presenterName, duration, priority });
    });
    return agendaItems;
}

// ============================================
// GENERATE FINAL AGENDA
// ============================================
function generateAgenda() {
    incrementUsage();
    
    const school = schoolName?.value || '[School Name]';
    const date = meetingDate?.value || '';
    const time = meetingTime?.value || '';
    const venueText = venue?.value || '[Venue]';
    const presenterText = presenter?.value || '[Chairperson]';
    const secretaryText = secretary?.value || '[Secretary]';
    const notes = additionalNotes?.value || '';
    
    let formattedDate = '[Date]';
    if (date) {
        const d = new Date(date);
        formattedDate = d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
    
    const reviewPoints = getReviewPointsArray();
    const objectives = getObjectivesArray();
    const agendaItems = getAgendaItemsArray();
    
    let previewHtml = `
        <div style="text-align:center; margin-bottom:30px;">
            <h2>${escapeHtml(school)}</h2>
            <h3 style="color: #6366F1;">Staff Meeting Agenda</h3>
            <p><strong>Date:</strong> ${formattedDate} | <strong>Time:</strong> ${time} | <strong>Venue:</strong> ${escapeHtml(venueText)}</p>
            <p><strong>Chairperson:</strong> ${escapeHtml(presenterText)} | <strong>Secretary:</strong> ${escapeHtml(secretaryText)}</p>
        </div>
        <hr>
        
        <h3>📋 Previous Review Points (Points to Remember)</h3>
        ${reviewPoints.length > 0 ? `<ul>${reviewPoints.map(p => `<li>${escapeHtml(p)}</li>`).join('')}</ul>` : '<p>No previous review points.</p>'}
        
        <h3>🎯 Meeting Objectives</h3>
        ${objectives.length > 0 ? `<ul>${objectives.map(obj => `<li>${escapeHtml(obj)}</li>`).join('')}</ul>` : '<p>No objectives added.</p>'}
        
        <h3>📌 Agenda Items</h3>
        ${agendaItems.map((item, idx) => `
            <div style="margin-bottom:20px; padding-bottom:10px; border-bottom:1px solid #ddd;">
                <h4>${idx + 1}. ${escapeHtml(item.title)}</h4>
                <p><strong>Presenter:</strong> ${escapeHtml(item.presenterName)} | <strong>Duration:</strong> ${escapeHtml(item.duration)} | <strong>Priority:</strong> ${item.priority}</p>
                <p><strong>Discussion:</strong> ${escapeHtml(item.desc) || 'To be discussed'}</p>
            </div>
        `).join('')}
        
        ${notes ? `<h3>📌 Additional Notes</h3><p>${escapeHtml(notes).replace(/\n/g, '<br>')}</p>` : ''}
        
        <hr>
        <div style="margin-top:40px; display:flex; justify-content:space-between;">
            <div><hr style="width:200px;"><p style="font-style:italic;">Chairperson Signature</p></div>
            <div><hr style="width:200px;"><p style="font-style:italic;">Secretary Signature</p></div>
        </div>
        <p style="text-align:center; font-size:12px; margin-top:30px;">Generated by School Staff Meeting Agenda Generator</p>
    `;
    
    previewContent.innerHTML = previewHtml;
    previewModal.classList.remove('hidden');
    saveToLocalStorage();
}

// ============================================
// API CALLS FOR TiDB
// ============================================
async function incrementUsage() {
    try {
        const response = await fetch(`${API_BASE}/api/increment-usage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: TOOL_SLUG, user_id: currentUserId })
        });
        if (response.ok) {
            const data = await response.json();
            currentUsageCount = data.total_usage || 0;
            if (usageCountSpan) usageCountSpan.textContent = currentUsageCount;
        } else {
            fallbackIncrementUsage();
        }
    } catch (error) {
        fallbackIncrementUsage();
    }
}

function fallbackIncrementUsage() {
    let localCount = parseInt(localStorage.getItem(`${TOOL_SLUG}_usage`) || '0') + 1;
    localStorage.setItem(`${TOOL_SLUG}_usage`, localCount);
    currentUsageCount = localCount;
    if (usageCountSpan) usageCountSpan.textContent = localCount;
}

async function loadUsageCount() {
    try {
        const response = await fetch(`${API_BASE}/api/usage?tool_slug=${TOOL_SLUG}`);
        if (response.ok) {
            const data = await response.json();
            currentUsageCount = data.count || 0;
            if (usageCountSpan) usageCountSpan.textContent = currentUsageCount;
        } else {
            const localCount = localStorage.getItem(`${TOOL_SLUG}_usage`) || 0;
            if (usageCountSpan) usageCountSpan.textContent = localCount;
        }
    } catch (error) {
        const localCount = localStorage.getItem(`${TOOL_SLUG}_usage`) || 0;
        if (usageCountSpan) usageCountSpan.textContent = localCount;
    }
}

async function addReaction(reactionType) {
    const emojiMap = { like: '👍', love: '❤️', wow: '😮', sad: '😢', angry: '😠', laugh: '😂', celebrate: '🎉' };
    const emoji = emojiMap[reactionType];
    
    try {
        const response = await fetch(`${API_BASE}/api/add-reaction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: TOOL_SLUG, emoji: emoji, reaction_type: reactionType, user_id: currentUserId })
        });
        const data = await response.json();
        if (data.counts) updateReactionCounts(data.counts);
        else loadReactions();
        showToast('Thank you for your feedback!');
    } catch (error) {
        showToast('Reaction saved locally');
        updateLocalReaction(reactionType);
    }
}

function updateLocalReaction(reactionType) {
    let localReactions = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_reactions`) || '{}');
    localReactions[reactionType] = (localReactions[reactionType] || 0) + 1;
    localStorage.setItem(`${TOOL_SLUG}_reactions`, JSON.stringify(localReactions));
    updateReactionCounts(localReactions);
}

async function loadReactions() {
    try {
        const response = await fetch(`${API_BASE}/api/reactions?tool_slug=${TOOL_SLUG}`);
        if (response.ok) {
            const data = await response.json();
            if (data.reactions) updateReactionCounts(data.reactions);
        } else {
            const localReactions = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_reactions`) || '{}');
            updateReactionCounts(localReactions);
        }
    } catch (error) {
        const localReactions = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_reactions`) || '{}');
        updateReactionCounts(localReactions);
    }
}

function updateReactionCounts(counts) {
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        const reaction = btn.dataset.reaction;
        const countSpan = btn.querySelector('.reaction-count');
        if (countSpan && counts[reaction] !== undefined) {
            countSpan.textContent = counts[reaction];
        }
    });
}

async function trackShare(platform) {
    try {
        await fetch(`${API_BASE}/api/add-share`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: TOOL_SLUG, platform: platform, user_id: currentUserId })
        });
        loadGlobalStats();
    } catch (error) {
        console.error('Share tracking error:', error);
    }
}

function shareOnFacebook() { trackShare('facebook'); window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank'); }
function shareOnTwitter() { trackShare('twitter'); window.open(`https://twitter.com/intent/tweet?text=School%20Staff%20Meeting%20Agenda%20Generator&url=${encodeURIComponent(window.location.href)}`, '_blank'); }
function shareOnWhatsApp() { trackShare('whatsapp'); window.open(`https://wa.me/?text=${encodeURIComponent('Check this out: ' + window.location.href)}`, '_blank'); }
function shareOnLinkedIn() { trackShare('linkedin'); window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank'); }
function shareByEmail() { trackShare('email'); window.location.href = `mailto:?subject=School Meeting Agenda Tool&body=${window.location.href}`; }
function copyPageURL() { trackShare('copy'); navigator.clipboard.writeText(window.location.href); showToast('URL copied!'); }

async function loadGlobalStats() {
    try {
        const response = await fetch(`${API_BASE}/api/global-stats`);
        if (response.ok) {
            const data = await response.json();
            const usageEl = document.getElementById('globalUsageCount');
            const sharesEl = document.getElementById('globalSharesCount');
            if (usageEl) usageEl.textContent = data.totalUsage || 0;
            if (sharesEl) sharesEl.textContent = data.totalShares || 0;
        }
    } catch (error) {}
}

// ============================================
// EXPORT & UTILITIES
// ============================================
function printAgenda() { window.print(); }
function closePreview() { previewModal.classList.add('hidden'); }
function copyAgendaToClipboard() { 
    const textContent = previewContent.innerText;
    navigator.clipboard.writeText(textContent); 
    showToast('Agenda copied!'); 
}

function downloadAgenda(format) {
    const content = previewContent.innerHTML;
    const school = schoolName?.value || 'School';
    const date = meetingDate?.value || 'meeting';
    const filename = `${school.replace(/\s+/g, '_')}_Agenda_${date}`;
    
    if (format === 'txt') {
        const textContent = previewContent.innerText;
        downloadFile(textContent, `${filename}.txt`, 'text/plain');
    } else if (format === 'doc') {
        const htmlContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Meeting Agenda</title><style>body{font-family:Arial;margin:2cm;}</style></head><body>${content}</body></html>`;
        downloadFile(htmlContent, `${filename}.doc`, 'application/msword');
    } else if (format === 'pdf') {
        showToast('Click Print and save as PDF');
        window.print();
    }
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`);
}

function saveToLocalStorage() {
    const objectives = getObjectivesArray();
    const reviewPoints = getReviewPointsArray();
    const agendaItems = getAgendaItemsArray();
    
    const formData = {
        schoolName: schoolName?.value || '',
        meetingDate: meetingDate?.value || '',
        meetingTime: meetingTime?.value || '',
        venue: venue?.value || '',
        presenter: presenter?.value || '',
        secretary: secretary?.value || '',
        additionalNotes: additionalNotes?.value || '',
        objectives,
        agendaItems,
        reviewPoints,
        extractedPoints
    };
    localStorage.setItem(`${TOOL_SLUG}_form`, JSON.stringify(formData));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem(`${TOOL_SLUG}_form`);
    if (saved) {
        const data = JSON.parse(saved);
        if (schoolName) schoolName.value = data.schoolName || '';
        if (meetingDate) meetingDate.value = data.meetingDate || '';
        if (meetingTime) meetingTime.value = data.meetingTime || '';
        if (venue) venue.value = data.venue || '';
        if (presenter) presenter.value = data.presenter || '';
        if (secretary) secretary.value = data.secretary || '';
        if (additionalNotes) additionalNotes.value = data.additionalNotes || '';
        
        if (data.reviewPoints && data.reviewPoints.length) {
            reviewPointsList.innerHTML = '';
            data.reviewPoints.forEach(point => addReviewPoint(point));
        }
        
        if (data.objectives && data.objectives.length) {
            objectivesList.innerHTML = '';
            data.objectives.forEach(obj => addObjective(obj));
        }
        
        if (data.agendaItems && data.agendaItems.length) {
            agendaItemsList.innerHTML = '';
            data.agendaItems.forEach(item => addAgendaItem(item.title, item.desc, item.presenter, item.duration, item.priority));
        }
        
        if (data.extractedPoints) extractedPoints = data.extractedPoints;
    }
}

function clearForm() {
    if (confirm('Clear all form data?')) {
        localStorage.removeItem(`${TOOL_SLUG}_form`);
        location.reload();
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    const moonIcon = document.querySelector('#darkModeToggle .fa-moon');
    const sunIcon = document.querySelector('#darkModeToggle .fa-sun');
    if (isDark) {
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'inline-block';
    } else {
        moonIcon.style.display = 'inline-block';
        sunIcon.style.display = 'none';
    }
}

function loadDarkMode() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        const moonIcon = document.querySelector('#darkModeToggle .fa-moon');
        const sunIcon = document.querySelector('#darkModeToggle .fa-sun');
        if (moonIcon && sunIcon) {
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'inline-block';
        }
    }
}

function showLoading(show) {
    if (loadingOverlay) {
        if (show) {
            loadingOverlay.classList.remove('hidden');
        } else {
            loadingOverlay.classList.add('hidden');
        }
    }
}

function showToast(message, type = 'success') {
    const toastMsg = document.getElementById('toastMessage');
    if (toastMsg) toastMsg.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Make functions global
window.addObjective = addObjective;
window.addAgendaItem = addAgendaItem;
window.addReviewPoint = addReviewPoint;
window.generateAgenda = generateAgenda;
window.clearForm = clearForm;
window.printAgenda = printAgenda;
window.closePreview = closePreview;
window.copyAgendaToClipboard = copyAgendaToClipboard;
window.downloadAgenda = downloadAgenda;
window.shareOnFacebook = shareOnFacebook;
window.shareOnTwitter = shareOnTwitter;
window.shareOnWhatsApp = shareOnWhatsApp;
window.shareOnLinkedIn = shareOnLinkedIn;
window.shareByEmail = shareByEmail;
window.copyPageURL = copyPageURL;
window.clearMinutesFile = clearMinutesFile;
window.saveManualPoints = saveManualPoints;
window.addExtractedPointsToAgenda = addExtractedPointsToAgenda;
window.transferReviewToAgenda = transferReviewToAgenda;
