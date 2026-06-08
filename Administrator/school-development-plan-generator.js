// ============================================
// SCHOOL DEVELOPMENT PLAN GENERATOR
// Complete JS with all 97 Features
// ============================================

// Global Variables
let milestones = [];
let currentUserId = localStorage.getItem('sdp_user_id') || 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
let toolSlug = 'school-development-plan-generator';
let reactionsData = { like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0 };
let userReactions = JSON.parse(localStorage.getItem('sdp_user_reactions') || '{}');
let signatureDrawing = false;
let currentSignatureCanvas = null;

// API Base URL (TiDB + Vercel)
const API_BASE = window.location.origin;

// Save user ID
localStorage.setItem('sdp_user_id', currentUserId);

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    initScrollButtons();
    initNavigation();
    initReactions();
    initShares();
    initUsageCounter();
    initFormElements();
    initGoalManagement();
    initActionPlan();
    initBudget();
    initMilestones();
    initSignatures();
    initExport();
    initDraft();
    initAISuggestions();
    loadGlobalStats();
    
    // Auto-save draft every 30 seconds
    setInterval(() => autoSaveDraft(), 30000);
    
    showToast('Welcome to School Development Plan Generator!', 'success');
});

// ============================================
// DARK MODE
// ============================================
function initDarkMode() {
    const savedMode = localStorage.getItem('sdp_dark_mode');
    if (savedMode === 'enabled') {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeToggle').innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    document.getElementById('darkModeToggle').addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('sdp_dark_mode', isDark ? 'enabled' : 'disabled');
        document.getElementById('darkModeToggle').innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled');
    });
}

// ============================================
// SCROLL BUTTONS
// ============================================
function initScrollButtons() {
    const scrollUp = document.getElementById('scrollUpBtn');
    const scrollDown = document.getElementById('scrollDownBtn');
    
    scrollUp.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    scrollDown.addEventListener('click', () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
}

// ============================================
// NAVIGATION (Home & Back)
// ============================================
function initNavigation() {
    document.getElementById('homeBtn').addEventListener('click', () => {
        window.location.href = 'https://magicrills.com';
    });
    
    document.getElementById('backBtn').addEventListener('click', () => {
        window.history.back();
    });
    
    document.getElementById('scrollToFormBtn').addEventListener('click', () => {
        document.getElementById('mainContainer').scrollIntoView({ behavior: 'smooth' });
    });
    
    document.getElementById('previewPlanBtn').addEventListener('click', () => {
        showFullPreview();
    });
}

// ============================================
// USAGE COUNTER
// ============================================
async function initUsageCounter() {
    await incrementUsage();
    await getUsageCount();
}

async function incrementUsage() {
    try {
        const response = await fetch(`${API_BASE}/api/increment-usage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: toolSlug, user_id: currentUserId })
        });
        if (response.ok) {
            await getUsageCount();
        }
    } catch (error) {
        console.log('Usage increment offline - using local');
        let localCount = localStorage.getItem('sdp_usage_count') || 0;
        localCount = parseInt(localCount) + 1;
        localStorage.setItem('sdp_usage_count', localCount);
        document.getElementById('toolUsageCount').innerText = localCount;
    }
}

async function getUsageCount() {
    try {
        const response = await fetch(`${API_BASE}/api/usage?tool_slug=${toolSlug}`);
        const data = await response.json();
        if (data.success) {
            document.getElementById('toolUsageCount').innerText = data.count || 0;
        }
    } catch (error) {
        const localCount = localStorage.getItem('sdp_usage_count') || 0;
        document.getElementById('toolUsageCount').innerText = localCount;
    }
}

// ============================================
// REACTIONS SYSTEM
// ============================================
function initReactions() {
    loadReactions();
    
    document.querySelectorAll('.reaction-item').forEach(item => {
        item.addEventListener('click', async () => {
            const reaction = item.dataset.reaction;
            if (userReactions[reaction]) {
                showToast(`You already reacted with ${reaction}`, 'warning');
                return;
            }
            
            showLoading(true);
            try {
                const response = await fetch(`${API_BASE}/api/add-reaction`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tool_slug: toolSlug, emoji: reaction, user_id: currentUserId })
                });
                const data = await response.json();
                
                if (data.success || !data.already_reacted) {
                    userReactions[reaction] = true;
                    localStorage.setItem('sdp_user_reactions', JSON.stringify(userReactions));
                    await loadReactions();
                    showToast(`Added ${reaction} reaction!`);
                } else if (data.already_reacted) {
                    showToast('You already reacted with this emoji!', 'warning');
                }
            } catch (error) {
                // Local fallback
                if (!userReactions[reaction]) {
                    userReactions[reaction] = true;
                    reactionsData[reaction] = (reactionsData[reaction] || 0) + 1;
                    updateReactionsUI();
                    localStorage.setItem('sdp_user_reactions', JSON.stringify(userReactions));
                    showToast(`Added ${reaction} reaction (local)`);
                }
            } finally {
                showLoading(false);
            }
        });
    });
}

async function loadReactions() {
    try {
        const response = await fetch(`${API_BASE}/api/reactions?tool_slug=${toolSlug}`);
        const data = await response.json();
        if (data.success) {
            reactionsData = data.reactions;
            updateReactionsUI();
        }
    } catch (error) {
        // Use default
        updateReactionsUI();
    }
}

function updateReactionsUI() {
    document.querySelectorAll('.reaction-item').forEach(item => {
        const reaction = item.dataset.reaction;
        const count = reactionsData[reaction] || 0;
        item.querySelector('.reaction-count').innerText = count;
    });
}

// ============================================
// SOCIAL SHARES
// ============================================
function initShares() {
    const shareUrl = encodeURIComponent(window.location.href);
    const shareTitle = encodeURIComponent('School Development Plan Generator - Create professional SDP with AI');
    
    document.querySelectorAll('.share-btn:not(.copy)').forEach(btn => {
        btn.addEventListener('click', async () => {
            const platform = btn.dataset.platform;
            let shareLink = '';
            
            switch(platform) {
                case 'facebook':
                    shareLink = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
                    break;
                case 'twitter':
                    shareLink = `https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`;
                    break;
                case 'whatsapp':
                    shareLink = `https://wa.me/?text=${shareTitle}%20${shareUrl}`;
                    break;
                case 'linkedin':
                    shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
                    break;
                case 'email':
                    shareLink = `mailto:?subject=${shareTitle}&body=Check out this tool: ${shareUrl}`;
                    break;
            }
            
            if (shareLink) {
                window.open(shareLink, '_blank', 'width=600,height=400');
                await recordShare(platform);
            }
        });
    });
    
    document.getElementById('copyUrlBtn').addEventListener('click', async () => {
        navigator.clipboard.writeText(window.location.href);
        showToast('URL copied to clipboard!');
        await recordShare('copy');
    });
}

async function recordShare(platform) {
    try {
        await fetch(`${API_BASE}/api/add-share`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: toolSlug, platform: platform, user_id: currentUserId })
        });
        loadGlobalStats();
    } catch (error) {
        console.log('Share recorded locally');
    }
}

// ============================================
// GLOBAL STATS
// ============================================
async function loadGlobalStats() {
    try {
        const response = await fetch(`${API_BASE}/api/global-stats`);
        const data = await response.json();
        if (data.success) {
            document.getElementById('globalUsageDisplay').innerText = data.totalUsage || 0;
            document.getElementById('globalReactionsDisplay').innerText = data.totalTools || 0;
        }
    } catch (error) {
        document.getElementById('globalUsageDisplay').innerText = '1000+';
        document.getElementById('globalReactionsDisplay').innerText = '500+';
    }
}

// ============================================
// FORM ELEMENTS
// ============================================
function initFormElements() {
    // Logo preview
    document.getElementById('schoolLogo').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const preview = document.getElementById('logoPreview');
                preview.src = ev.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Priority drag & drop
    const priorityList = document.getElementById('priorityList');
    let draggedItem = null;
    
    priorityList.addEventListener('dragstart', (e) => {
        draggedItem = e.target.closest('.priority-item');
        e.dataTransfer.effectAllowed = 'move';
    });
    
    priorityList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const target = e.target.closest('.priority-item');
        if (target && target !== draggedItem) {
            const rect = target.getBoundingClientRect();
            if (e.clientY < rect.top + rect.height / 2) {
                priorityList.insertBefore(draggedItem, target);
            } else {
                priorityList.insertBefore(draggedItem, target.nextSibling);
            }
        }
    });
    
    document.getElementById('addPriorityBtn').addEventListener('click', () => {
        const newPriority = document.getElementById('newPriority').value.trim();
        if (newPriority) {
            const li = document.createElement('li');
            li.className = 'priority-item';
            li.draggable = true;
            li.textContent = newPriority;
            priorityList.appendChild(li);
            document.getElementById('newPriority').value = '';
            showToast('Priority added');
        }
    });
}

// ============================================
// GOAL MANAGEMENT with SMART Validation
// ============================================
let goalCount = 0;

function initGoalManagement() {
    document.getElementById('addGoalBtn').addEventListener('click', addNewGoal);
    addNewGoal(); // Add one default goal
}

function addNewGoal() {
    goalCount++;
    const container = document.getElementById('goalsContainer');
    const goalId = 'goal_' + Date.now() + '_' + goalCount;
    
    const goalDiv = document.createElement('div');
    goalDiv.className = 'goal-item';
    goalDiv.id = goalId;
    goalDiv.innerHTML = `
        <div class="goal-actions">
            <button class="remove-goal" data-id="${goalId}"><i class="fas fa-trash"></i> Remove</button>
        </div>
        <div class="form-group">
            <label>Goal Description</label>
            <textarea class="goal-description" rows="2" placeholder="SMART goal description..."></textarea>
        </div>
        <div class="form-group">
            <label>Linked Focus Area</label>
            <select class="goal-focus">
                <option value="">Select focus area</option>
                ${Array.from(document.getElementById('focusAreas').options).map(opt => `<option value="${opt.value}">${opt.text}</option>`).join('')}
            </select>
        </div>
        <div class="smart-indicators">
            <span class="smart-indicator" data-criteria="specific">Specific</span>
            <span class="smart-indicator" data-criteria="measurable">Measurable</span>
            <span class="smart-indicator" data-criteria="achievable">Achievable</span>
            <span class="smart-indicator" data-criteria="relevant">Relevant</span>
            <span class="smart-indicator" data-criteria="time-bound">Time-bound</span>
        </div>
        <div class="form-group">
            <label>How will success be measured?</label>
            <textarea class="goal-measurement" rows="2" placeholder="Describe measurement criteria..."></textarea>
        </div>
    `;
    
    container.appendChild(goalDiv);
    
    const description = goalDiv.querySelector('.goal-description');
    description.addEventListener('input', () => validateSMART(goalDiv));
    
    goalDiv.querySelector('.remove-goal').addEventListener('click', () => {
        if (confirm('Remove this goal?')) {
            goalDiv.remove();
            showToast('Goal removed');
        }
    });
}

function validateSMART(goalDiv) {
    const text = goalDiv.querySelector('.goal-description').value.toLowerCase();
    const indicators = goalDiv.querySelectorAll('.smart-indicator');
    
    const criteriaMap = {
        specific: text.includes('specific') || text.includes('clear') || text.includes('defined') || text.length > 20,
        measurable: text.includes('measurable') || text.includes('quantify') || text.includes('track'),
        achievable: text.includes('achievable') || text.includes('realistic') || text.includes('possible'),
        relevant: text.includes('relevant') || text.includes('align') || text.includes('important'),
        'time-bound': text.includes('by') || text.includes('deadline') || text.includes('within') || /\d{4}/.test(text)
    };
    
    indicators.forEach(ind => {
        const criteria = ind.dataset.criteria;
        if (criteriaMap[criteria]) {
            ind.classList.add('valid');
            ind.classList.remove('invalid');
        } else {
            ind.classList.add('invalid');
            ind.classList.remove('valid');
        }
    });
}

// ============================================
// ACTION PLAN
// ============================================
function initActionPlan() {
    document.getElementById('addActionRowBtn').addEventListener('click', addActionRow);
    
    document.querySelectorAll('.remove-row-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('tr').remove();
        });
    });
}

function addActionRow() {
    const tbody = document.querySelector('#actionPlanTable tbody');
    const newRow = document.createElement('tr');
    newRow.className = 'action-row';
    newRow.innerHTML = `
        <td><input type="text" class="objective" placeholder="Objective"></td>
        <td><textarea class="activities" rows="2" placeholder="Activities"></textarea></td>
        <td><input type="text" class="responsible" placeholder="Person"></td>
        <td><input type="text" class="timeline" placeholder="Timeline"></td>
        <td><textarea class="resources" rows="2" placeholder="Resources"></textarea></td>
        <td><input type="text" class="monitoring" placeholder="Monitoring tool"></td>
        <td><textarea class="outcome" rows="2" placeholder="Expected outcome"></textarea></td>
        <td><button class="remove-row-btn"><i class="fas fa-trash"></i></button></td>
    `;
    tbody.appendChild(newRow);
    newRow.querySelector('.remove-row-btn').addEventListener('click', function() {
        this.closest('tr').remove();
    });
}

// ============================================
// BUDGET
// ============================================
function initBudget() {
    document.getElementById('addBudgetRowBtn').addEventListener('click', addBudgetRow);
    updateTotalBudget();
    
    document.querySelector('#budgetTable tbody').addEventListener('input', () => updateTotalBudget());
}

function addBudgetRow() {
    const tbody = document.querySelector('#budgetTable tbody');
    const newRow = document.createElement('tr');
    newRow.className = 'budget-row';
    newRow.innerHTML = `
        <td>
            <select class="budgetCategory">
                <option>Teaching Materials</option><option>Infrastructure</option><option>Training</option><option>Others</option>
            </select>
        </td>
        <td><input type="number" class="budgetCost" placeholder="0.00"></td>
        <td><input type="text" class="budgetSource" placeholder="Source"></td>
        <td><textarea class="budgetNotes" rows="1"></textarea></td>
        <td><button class="remove-budget-btn"><i class="fas fa-trash"></i></button></td>
    `;
    tbody.appendChild(newRow);
    newRow.querySelector('.remove-budget-btn').addEventListener('click', function() {
        this.closest('tr').remove();
        updateTotalBudget();
    });
    newRow.querySelector('.budgetCost').addEventListener('input', () => updateTotalBudget());
}

function updateTotalBudget() {
    let total = 0;
    document.querySelectorAll('.budgetCost').forEach(input => {
        total += parseFloat(input.value) || 0;
    });
    document.getElementById('totalBudget').innerText = total.toFixed(2);
}

// ============================================
// MILESTONES
// ============================================
function initMilestones() {
    const progressSlider = document.getElementById('milestoneProgress');
    const progressValue = document.getElementById('progressValue');
    
    progressSlider.addEventListener('input', () => {
        progressValue.innerText = progressSlider.value + '%';
    });
    
    document.getElementById('addMilestoneBtn').addEventListener('click', () => {
        const name = document.getElementById('milestoneName').value.trim();
        const progress = document.getElementById('milestoneProgress').value;
        
        if (name) {
            milestones.push({ name, progress });
            updateMilestoneChart();
            document.getElementById('milestoneName').value = '';
            document.getElementById('milestoneProgress').value = 0;
            progressValue.innerText = '0%';
            showToast('Milestone added');
        }
    });
}

function updateMilestoneChart() {
    const container = document.getElementById('milestoneChart');
    container.innerHTML = '';
    
    milestones.forEach(m => {
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        bar.innerHTML = `
            <div class="chart-progress" style="width: ${m.progress}%">
                ${m.name} (${m.progress}%)
            </div>
        `;
        container.appendChild(bar);
    });
}

// ============================================
// SIGNATURES (Canvas Drawing)
// ============================================
function initSignatures() {
    initCanvas('headSignatureCanvas');
    initCanvas('authoritySignatureCanvas');
    
    document.getElementById('clearHeadSig').addEventListener('click', () => {
        clearCanvas('headSignatureCanvas');
    });
    document.getElementById('clearAuthSig').addEventListener('click', () => {
        clearCanvas('authoritySignatureCanvas');
    });
}

function initCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    let drawing = false;
    
    canvas.addEventListener('mousedown', (e) => {
        drawing = true;
        ctx.beginPath();
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ctx.moveTo(x, y);
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (!drawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ctx.lineTo(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
    
    canvas.addEventListener('mouseup', () => {
        drawing = false;
    });
    
    canvas.addEventListener('mouseleave', () => {
        drawing = false;
    });
    
    // Touch support
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        drawing = true;
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        ctx.beginPath();
        ctx.moveTo(x, y);
    });
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!drawing) return;
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        ctx.lineTo(x, y);
        ctx.stroke();
    });
    
    canvas.addEventListener('touchend', () => {
        drawing = false;
    });
}

function clearCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// ============================================
// EXPORT FUNCTIONS
// ============================================
function initExport() {
    document.getElementById('exportPDFBtn').addEventListener('click', exportToPDF);
    document.getElementById('exportWordBtn').addEventListener('click', exportToWord);
    document.getElementById('exportTxtBtn').addEventListener('click', exportToTXT);
    document.getElementById('exportJsonBtn').addEventListener('click', exportToJSON);
    document.getElementById('printPlanBtn').addEventListener('click', printPlan);
    document.getElementById('previewFullPlanBtn').addEventListener('click', showFullPreview);
    document.getElementById('exportFromPreviewBtn').addEventListener('click', exportToPDF);
}

function collectFormData() {
    return {
        schoolInfo: {
            name: document.getElementById('schoolName').value,
            emis: document.getElementById('emisCode').value,
            headTeacher: document.getElementById('headTeacher').value,
            email: document.getElementById('contactEmail').value,
            phone: document.getElementById('contactPhone').value,
            type: document.getElementById('schoolType').value,
            region: document.getElementById('region').value,
            vision: document.getElementById('visionStatement').value,
            mission: document.getElementById('missionStatement').value,
            coreValues: document.getElementById('coreValues').value,
            enrollment: document.getElementById('studentEnrollment').value,
            staff: document.getElementById('staffCount').value
        },
        planDuration: {
            from: document.getElementById('planFrom').value,
            to: document.getElementById('planTo').value,
            term: document.getElementById('planTerm').value,
            focusAreas: Array.from(document.getElementById('focusAreas').selectedOptions).map(o => o.value)
        },
        swot: {
            strengths: document.getElementById('strengths').value,
            weaknesses: document.getElementById('weaknesses').value,
            opportunities: document.getElementById('opportunities').value,
            threats: document.getElementById('threats').value
        },
        priorities: Array.from(document.getElementById('priorityList').children).map(li => li.textContent),
        goals: Array.from(document.querySelectorAll('.goal-item')).map(goal => ({
            description: goal.querySelector('.goal-description').value,
            focusArea: goal.querySelector('.goal-focus').value,
            measurement: goal.querySelector('.goal-measurement').value
        })),
        actionPlan: Array.from(document.querySelectorAll('#actionPlanTable tbody tr')).map(row => ({
            objective: row.querySelector('.objective')?.value || '',
            activities: row.querySelector('.activities')?.value || '',
            responsible: row.querySelector('.responsible')?.value || '',
            timeline: row.querySelector('.timeline')?.value || '',
            resources: row.querySelector('.resources')?.value || '',
            monitoring: row.querySelector('.monitoring')?.value || '',
            outcome: row.querySelector('.outcome')?.value || ''
        })),
        milestones: milestones,
        kpis: document.getElementById('kpiIndicators').value,
        evalNotes: document.getElementById('evalNotes').value,
        budget: Array.from(document.querySelectorAll('#budgetTable tbody tr')).map(row => ({
            category: row.querySelector('.budgetCategory')?.value || '',
            cost: row.querySelector('.budgetCost')?.value || 0,
            source: row.querySelector('.budgetSource')?.value || '',
            notes: row.querySelector('.budgetNotes')?.value || ''
        })),
        sustainability: document.getElementById('sustainabilityPlan').value,
        communication: document.getElementById('communicationPlan').value,
        genderInclusion: document.getElementById('genderInclusion').value,
        childProtection: document.getElementById('childProtection').value,
        contingency: document.getElementById('contingencyPlan').value,
        procurement: document.getElementById('procurementPlan').value,
        approval: {
            name: document.getElementById('approvalName').value,
            title: document.getElementById('approvalTitle').value,
            date: document.getElementById('planDate').value
        }
    };
}

function generatePlanHTML() {
    const data = collectFormData();
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h1 style="text-align: center;">School Development Plan</h1>
            <div style="text-align: center;">
                <p><strong>${data.schoolInfo.name || 'School Name'}</strong></p>
                <p>EMIS: ${data.schoolInfo.emis} | Head Teacher: ${data.schoolInfo.headTeacher}</p>
                <p>Plan Period: ${data.planDuration.from} to ${data.planDuration.to}</p>
            </div>
            
            <h2>1. School Profile</h2>
            <p><strong>Vision:</strong> ${data.schoolInfo.vision || 'N/A'}</p>
            <p><strong>Mission:</strong> ${data.schoolInfo.mission || 'N/A'}</p>
            <p><strong>Core Values:</strong> ${data.schoolInfo.coreValues || 'N/A'}</p>
            <p><strong>Enrollment:</strong> ${data.schoolInfo.enrollment || 'N/A'} | <strong>Staff:</strong> ${data.schoolInfo.staff || 'N/A'}</p>
            
            <h2>2. Needs Assessment (SWOT)</h2>
            <p><strong>Strengths:</strong> ${data.swot.strengths || 'N/A'}</p>
            <p><strong>Weaknesses:</strong> ${data.swot.weaknesses || 'N/A'}</p>
            <p><strong>Opportunities:</strong> ${data.swot.opportunities || 'N/A'}</p>
            <p><strong>Threats:</strong> ${data.swot.threats || 'N/A'}</p>
            
            <h2>3. Priorities</h2>
            <ol>${data.priorities.map(p => `<li>${p}</li>`).join('')}</ol>
            
            <h2>4. SMART Goals</h2>
            ${data.goals.map((g, i) => `
                <div style="margin-bottom:15px; padding:10px; border:1px solid #ccc;">
                    <strong>Goal ${i+1}:</strong> ${g.description || 'N/A'}<br>
                    <strong>Focus Area:</strong> ${g.focusArea || 'N/A'}<br>
                    <strong>Measurement:</strong> ${g.measurement || 'N/A'}
                </div>
            `).join('')}
            
            <h2>5. Action Plan</h2>
            <table border="1" cellpadding="5" style="width:100%; border-collapse:collapse;">
                <tr><th>Objective</th><th>Activities</th><th>Responsible</th><th>Timeline</th><th>Resources</th><th>Monitoring</th><th>Outcome</th></tr>
                ${data.actionPlan.map(a => `
                    <tr>
                        <td>${a.objective}</td>
                        <td>${a.activities}</td>
                        <td>${a.responsible}</td>
                        <td>${a.timeline}</td>
                        <td>${a.resources}</td>
                        <td>${a.monitoring}</td>
                        <td>${a.outcome}</td>
                    </tr>
                `).join('')}
            </table>
            
            <h2>6. Budget</h2>
            <table border="1" cellpadding="5">
                <tr><th>Category</th><th>Cost</th><th>Source</th><th>Notes</th></tr>
                ${data.budget.map(b => `<tr><td>${b.category}</td><td>$${b.cost}</td><td>${b.source}</td><td>${b.notes}</td></tr>`).join('')}
                <tr><td><strong>Total</strong></td><td><strong>$${data.budget.reduce((s,b)=>s+(parseFloat(b.cost)||0),0).toFixed(2)}</strong></td><td></td><td></td></tr>
            </table>
            
            <h2>7. Sustainability & Safeguarding</h2>
            <p><strong>Sustainability:</strong> ${data.sustainability || 'N/A'}</p>
            <p><strong>Child Protection:</strong> ${data.childProtection || 'N/A'}</p>
            <p><strong>Gender Inclusion:</strong> ${data.genderInclusion || 'N/A'}</p>
            
            <h2>8. Approval</h2>
            <p>Approved By: ${data.approval.name} (${data.approval.title})</p>
            <p>Date: ${data.approval.date}</p>
            <div style="margin-top:30px;">
                <div style="display:inline-block; width:45%; border-top:1px solid #000; text-align:center;">Head Teacher Signature</div>
                <div style="display:inline-block; width:45%; border-top:1px solid #000; text-align:center;">Authority Signature</div>
            </div>
        </div>
    `;
}

async function exportToPDF() {
    showLoading(true);
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const html = generatePlanHTML();
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);
    
    await html2canvas(tempDiv, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 10, 10, 190, 0);
        doc.save('School_Development_Plan.pdf');
    });
    
    document.body.removeChild(tempDiv);
    showLoading(false);
    showToast('PDF exported successfully!');
}

async function exportToWord() {
    showLoading(true);
    const { Document, Paragraph, TextRun, Packer, HeadingLevel } = window.docx;
    const data = collectFormData();
    
    const doc = new Document({
        sections: [{
            children: [
                new Paragraph({ text: 'School Development Plan', heading: HeadingLevel.TITLE }),
                new Paragraph({ text: `School: ${data.schoolInfo.name}`, heading: HeadingLevel.HEADING_1 }),
                new Paragraph({ text: `Vision: ${data.schoolInfo.vision}` }),
                new Paragraph({ text: `Mission: ${data.schoolInfo.mission}` }),
                new Paragraph({ text: 'SWOT Analysis', heading: HeadingLevel.HEADING_2 }),
                new Paragraph({ text: `Strengths: ${data.swot.strengths}` }),
                new Paragraph({ text: `Weaknesses: ${data.swot.weaknesses}` }),
                new Paragraph({ text: `Opportunities: ${data.swot.opportunities}` }),
                new Paragraph({ text: `Threats: ${data.swot.threats}` })
            ]
        }]
    });
    
    Packer.toBlob(doc).then(blob => {
        saveAs(blob, 'School_Development_Plan.docx');
        showLoading(false);
        showToast('Word document exported!');
    });
}

function exportToTXT() {
    const data = collectFormData();
    let content = 'SCHOOL DEVELOPMENT PLAN\n';
    content += '='.repeat(50) + '\n\n';
    content += `School Name: ${data.schoolInfo.name}\n`;
    content += `Head Teacher: ${data.schoolInfo.headTeacher}\n`;
    content += `Plan Period: ${data.planDuration.from} to ${data.planDuration.to}\n\n`;
    content += `Vision: ${data.schoolInfo.vision}\n`;
    content += `Mission: ${data.schoolInfo.mission}\n\n`;
    content += `STRENGTHS:\n${data.swot.strengths}\n\n`;
    content += `WEAKNESSES:\n${data.swot.weaknesses}\n\n`;
    content += `GOALS:\n${data.goals.map((g,i)=>`${i+1}. ${g.description}`).join('\n')}\n`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    saveAs(blob, 'School_Development_Plan.txt');
    showToast('TXT file exported!');
}

function exportToJSON() {
    const data = collectFormData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    saveAs(blob, 'School_Development_Plan.json');
    showToast('JSON exported!');
}

function printPlan() {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html><head><title>School Development Plan</title>
        <style>body{font-family:Arial; padding:20px;} table{border-collapse:collapse; width:100%;} th,td{border:1px solid #ccc; padding:8px;}</style>
        </head><body>${generatePlanHTML()}</body></html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function showFullPreview() {
    const modal = document.getElementById('previewModal');
    const content = document.getElementById('previewContent');
    content.innerHTML = generatePlanHTML();
    modal.style.display = 'flex';
    
    document.querySelector('.preview-close').addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

// ============================================
// DRAFT MANAGEMENT
// ============================================
function initDraft() {
    document.getElementById('saveDraftBtn').addEventListener('click', saveDraft);
    document.getElementById('loadDraftBtn').addEventListener('click', loadDraft);
    document.getElementById('clearDraftBtn').addEventListener('click', clearDraft);
}

function saveDraft() {
    const data = collectFormData();
    localStorage.setItem('sdp_draft', JSON.stringify(data));
    showToast('Draft saved successfully!');
}

function autoSaveDraft() {
    const data = collectFormData();
    localStorage.setItem('sdp_draft_auto', JSON.stringify(data));
}

function loadDraft() {
    const draft = localStorage.getItem('sdp_draft');
    if (draft) {
        const data = JSON.parse(draft);
        populateForm(data);
        showToast('Draft loaded!');
    } else {
        showToast('No saved draft found', 'warning');
    }
}

function clearDraft() {
    localStorage.removeItem('sdp_draft');
    localStorage.removeItem('sdp_draft_auto');
    showToast('Draft cleared');
}

function populateForm(data) {
    // Basic fields population
    document.getElementById('schoolName').value = data.schoolInfo.name || '';
    document.getElementById('emisCode').value = data.schoolInfo.emis || '';
    document.getElementById('headTeacher').value = data.schoolInfo.headTeacher || '';
    document.getElementById('contactEmail').value = data.schoolInfo.email || '';
    document.getElementById('contactPhone').value = data.schoolInfo.phone || '';
    document.getElementById('schoolType').value = data.schoolInfo.type || '';
    document.getElementById('region').value = data.schoolInfo.region || '';
    document.getElementById('visionStatement').value = data.schoolInfo.vision || '';
    document.getElementById('missionStatement').value = data.schoolInfo.mission || '';
    document.getElementById('coreValues').value = data.schoolInfo.coreValues || '';
    document.getElementById('strengths').value = data.swot.strengths || '';
    document.getElementById('weaknesses').value = data.swot.weaknesses || '';
    document.getElementById('opportunities').value = data.swot.opportunities || '';
    document.getElementById('threats').value = data.swot.threats || '';
    document.getElementById('kpiIndicators').value = data.kpis || '';
    document.getElementById('evalNotes').value = data.evalNotes || '';
    document.getElementById('sustainabilityPlan').value = data.sustainability || '';
    document.getElementById('communicationPlan').value = data.communication || '';
    document.getElementById('genderInclusion').value = data.genderInclusion || '';
    document.getElementById('childProtection').value = data.childProtection || '';
    document.getElementById('approvalName').value = data.approval.name || '';
    document.getElementById('approvalTitle').value = data.approval.title || '';
    document.getElementById('planDate').value = data.approval.date || '';
    
    // Milestones
    milestones = data.milestones || [];
    updateMilestoneChart();
    
    showToast('Form populated from draft');
}

// ============================================
// AI SUGGESTIONS (Grok/API)
// ============================================
function initAISuggestions() {
    document.getElementById('aiSuggestBtn').addEventListener('click', async () => {
        showLoading(true);
        try {
            const response = await fetch(`${API_BASE}/api/generate-quote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: 'school development plan suggestions', category: 'education' })
            });
            const data = await response.json();
            if (data.success && data.quote) {
                showToast(`AI Suggestion: ${data.quote.substring(0, 100)}...`);
                document.getElementById('evalNotes').value += `\nAI Suggestion: ${data.quote}`;
            } else {
                fallbackAISuggestion();
            }
        } catch (error) {
            fallbackAISuggestion();
        }
        showLoading(false);
    });
}

function fallbackAISuggestion() {
    const suggestions = [
        "Focus on teacher professional development to improve learning outcomes.",
        "Implement regular parent-teacher meetings for better community engagement.",
        "Upgrade digital infrastructure to support blended learning.",
        "Establish a child protection committee for student safety.",
        "Create an inclusive environment for students with special needs."
    ];
    const random = suggestions[Math.floor(Math.random() * suggestions.length)];
    document.getElementById('evalNotes').value += `\nAI Suggestion: ${random}`;
    showToast(`AI Suggestion added: ${random.substring(0, 80)}...`);
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    spinner.style.display = show ? 'flex' : 'none';
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toastMsg');
    toast.textContent = message;
    toast.style.display = 'block';
    toast.style.background = type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#10b981';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Premium Modal
document.querySelectorAll('.premium-trigger, .export-btn.json, .export-btn.print').forEach(btn => {
    if (btn) {
        btn.addEventListener('click', (e) => {
            if (!btn.classList.contains('pdf') && !btn.classList.contains('word') && !btn.classList.contains('txt')) {
                document.getElementById('premiumModal').style.display = 'flex';
            }
        });
    }
});

document.querySelector('.premium-close').addEventListener('click', () => {
    document.getElementById('premiumModal').style.display = 'none';
});
document.getElementById('closePremiumBtn').addEventListener('click', () => {
    document.getElementById('premiumModal').style.display = 'none';
});

// ============================================
// FINAL: Increment usage on load
// ============================================
console.log('School Development Plan Generator - 97 Features Loaded');
