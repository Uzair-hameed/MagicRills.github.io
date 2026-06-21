// ============================================
// SCHOOL DEVELOPMENT PLAN GENERATOR
// Updated with Cloudflare Workers API
// ============================================

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    API_BASE: 'https://magicrills-api.uzairhameed01.workers.dev',
    API_KEY: 'magicrills-grok-api.uzairhameed01.workers.dev',
    TOOL_SLUG: 'school-development-plan-generator',
    TOOL_NAME: 'School Development Plan Generator',
    CATEGORY: 'Teacher'
};

// ============================================
// GLOBAL VARIABLES
// ============================================
let milestones = [];
let currentUserId = localStorage.getItem('sdp_user_id') || 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
let reactionsData = { like: 0, love: 0, wow: 0, sad: 0, laugh: 0, celebrate: 0 };
let userReactions = JSON.parse(localStorage.getItem('sdp_user_reactions') || '{}');
let signatureDrawing = false;
let currentSignatureCanvas = null;
let toolStats = { usage: 0, views: 0, shares: 0, followers: 0 };
let isOffline = false;

// Save user ID
localStorage.setItem('sdp_user_id', currentUserId);

// ============================================
// API HELPER FUNCTIONS
// ============================================
async function apiCall(endpoint, options = {}) {
    const url = `${CONFIG.API_BASE}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        'X-API-Key': CONFIG.API_KEY,
        ...options.headers
    };

    try {
        const response = await fetch(url, { ...options, headers });
        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.warn('API call failed, using fallback:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// LOCAL STORAGE FALLBACK
// ============================================
function getLocalData(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(`sdp_${key}`);
        return data ? JSON.parse(data) : defaultValue;
    } catch {
        return defaultValue;
    }
}

function setLocalData(key, value) {
    try {
        localStorage.setItem(`sdp_${key}`, JSON.stringify(value));
    } catch (e) {
        console.warn('Failed to save to localStorage:', e);
    }
}

// ============================================
// 1. USAGE COUNTER (Cloudflare API)
// ============================================
async function initUsageCounter() {
    // Increment usage on load
    await incrementUsage();
    await getUsageCount();
    await getToolStats();
}

async function incrementUsage() {
    const result = await apiCall('/api/usage', {
        method: 'POST',
        body: JSON.stringify({ 
            tool_slug: CONFIG.TOOL_SLUG, 
            user_id: currentUserId 
        })
    });

    if (!result.success) {
        // Local fallback
        let localCount = getLocalData('usage_count', 0);
        localCount = parseInt(localCount) + 1;
        setLocalData('usage_count', localCount);
        document.getElementById('toolUsageCount').innerText = localCount;
        isOffline = true;
    } else {
        isOffline = false;
    }
}

async function getUsageCount() {
    const result = await apiCall(`/api/stats?tool_slug=${CONFIG.TOOL_SLUG}`);
    
    if (result.success && result.data) {
        const stats = result.data;
        document.getElementById('toolUsageCount').innerText = stats.usage || 0;
        document.getElementById('globalUsageDisplay').innerText = stats.usage || 0;
        document.getElementById('globalReactionsDisplay').innerText = stats.views || 0;
        document.getElementById('globalSharesDisplay').innerText = stats.shares || 0;
        toolStats = stats;
    } else {
        // Local fallback
        const localCount = getLocalData('usage_count', 0);
        document.getElementById('toolUsageCount').innerText = localCount;
        document.getElementById('globalUsageDisplay').innerText = localCount;
    }
}

async function getToolStats() {
    const result = await apiCall(`/api/stats?tool_slug=${CONFIG.TOOL_SLUG}`);
    
    if (result.success && result.data) {
        toolStats = result.data;
        updateDashboardStats(result.data);
    } else {
        // Local fallback
        const stats = getLocalData('tool_stats', { usage: 0, views: 0, shares: 0, followers: 0 });
        toolStats = stats;
        updateDashboardStats(stats);
    }
}

function updateDashboardStats(stats) {
    document.getElementById('statUsage').innerText = stats.usage || 0;
    document.getElementById('statViews').innerText = stats.views || 0;
    document.getElementById('statShares').innerText = stats.shares || 0;
    document.getElementById('statFollowers').innerText = stats.followers || 0;
}

// ============================================
// 2. REACTIONS SYSTEM (Cloudflare API)
// ============================================
function initReactions() {
    loadReactions();
    
    document.querySelectorAll('.reaction-item').forEach(item => {
        item.addEventListener('click', async () => {
            const reaction = item.dataset.reaction;
            
            // Check if user already reacted
            if (userReactions[reaction]) {
                showToast(`You already reacted with ${getReactionEmoji(reaction)}`, 'warning');
                return;
            }
            
            showLoading(true);
            
            const result = await apiCall('/api/reactions', {
                method: 'POST',
                body: JSON.stringify({ 
                    tool_slug: CONFIG.TOOL_SLUG, 
                    emoji: reaction, 
                    user_id: currentUserId 
                })
            });

            if (result.success) {
                userReactions[reaction] = true;
                setLocalData('user_reactions', userReactions);
                await loadReactions();
                showToast(`Added ${getReactionEmoji(reaction)} reaction!`, 'success');
            } else {
                // Local fallback
                if (!userReactions[reaction]) {
                    userReactions[reaction] = true;
                    reactionsData[reaction] = (reactionsData[reaction] || 0) + 1;
                    updateReactionsUI();
                    setLocalData('user_reactions', userReactions);
                    setLocalData('reactions_data', reactionsData);
                    showToast(`Added ${getReactionEmoji(reaction)} (offline mode)`, 'warning');
                }
            }
            
            showLoading(false);
        });
    });
}

async function loadReactions() {
    const result = await apiCall(`/api/reactions?tool_slug=${CONFIG.TOOL_SLUG}`);
    
    if (result.success && result.data) {
        reactionsData = result.data;
        updateReactionsUI();
    } else {
        // Local fallback
        const localData = getLocalData('reactions_data', { like: 0, love: 0, wow: 0, sad: 0, laugh: 0, celebrate: 0 });
        reactionsData = localData;
        updateReactionsUI();
    }
}

function updateReactionsUI() {
    const emojiMap = {
        like: '👍',
        love: '❤️',
        wow: '😮',
        sad: '😢',
        laugh: '😂',
        celebrate: '🎉'
    };

    document.querySelectorAll('.reaction-item').forEach(item => {
        const reaction = item.dataset.reaction;
        const count = reactionsData[reaction] || 0;
        const emoji = emojiMap[reaction] || '👍';
        item.querySelector('.reaction-emoji').innerHTML = emoji;
        item.querySelector('.reaction-count').innerText = count;
    });
}

function getReactionEmoji(reaction) {
    const map = {
        like: '👍',
        love: '❤️',
        wow: '😮',
        sad: '😢',
        laugh: '😂',
        celebrate: '🎉'
    };
    return map[reaction] || reaction;
}

// ============================================
// 3. SOCIAL SHARES (Cloudflare API)
// ============================================
function initShares() {
    const shareUrl = encodeURIComponent(window.location.href);
    const shareTitle = encodeURIComponent(`${CONFIG.TOOL_NAME} - Create professional SDP with AI`);
    
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
        try {
            await navigator.clipboard.writeText(window.location.href);
            showToast('URL copied to clipboard!', 'success');
            await recordShare('copy');
        } catch {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = window.location.href;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast('URL copied to clipboard!', 'success');
            await recordShare('copy');
        }
    });
}

async function recordShare(platform) {
    const result = await apiCall('/api/shares', {
        method: 'POST',
        body: JSON.stringify({ 
            tool_slug: CONFIG.TOOL_SLUG, 
            platform: platform, 
            user_id: currentUserId 
        })
    });

    if (result.success) {
        await getToolStats();
    } else {
        // Local fallback
        let shares = getLocalData('shares', 0);
        shares = parseInt(shares) + 1;
        setLocalData('shares', shares);
        toolStats.shares = shares;
        updateDashboardStats(toolStats);
    }
}

// ============================================
// 4. DASHBOARD STATS
// ============================================
function updateDashboardStats(stats) {
    document.getElementById('statUsage').innerText = stats.usage || 0;
    document.getElementById('statViews').innerText = stats.views || 0;
    document.getElementById('statShares').innerText = stats.shares || 0;
    document.getElementById('statFollowers').innerText = stats.followers || 0;
}

// ============================================
// 5. TYPEWRITER ANIMATION
// ============================================
function initTypewriter() {
    const phrases = [
        'Create Professional School Development Plans',
        'AI-Powered Educational Planning',
        'SMART Goals & SWOT Analysis',
        'Data-Driven School Improvement',
        'Complete SDP in Minutes'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const element = document.getElementById('typewriterText');
    
    if (!element) return;
    
    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            element.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let speed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            speed = 500;
        }
        
        setTimeout(type, speed);
    }
    
    type();
}

// ============================================
// 6. DARK MODE TOGGLE (REMOVED)
// ============================================
// Dark mode toggle removed as per request

// ============================================
// 7. SCROLL BUTTONS
// ============================================
function initScrollButtons() {
    const scrollUp = document.getElementById('scrollUpBtn');
    const scrollDown = document.getElementById('scrollDownBtn');
    
    if (scrollUp) {
        scrollUp.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    if (scrollDown) {
        scrollDown.addEventListener('click', () => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });
    }
}

// ============================================
// 8. NAVIGATION
// ============================================
function initNavigation() {
    const homeBtn = document.getElementById('homeBtn');
    const backBtn = document.getElementById('backBtn');
    const scrollToFormBtn = document.getElementById('scrollToFormBtn');
    const previewPlanBtn = document.getElementById('previewPlanBtn');
    
    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            window.location.href = 'https://magicrills.com';
        });
    }
    
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.history.back();
        });
    }
    
    if (scrollToFormBtn) {
        scrollToFormBtn.addEventListener('click', () => {
            document.getElementById('mainContainer')?.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    if (previewPlanBtn) {
        previewPlanBtn.addEventListener('click', () => {
            showFullPreview();
        });
    }
}

// ============================================
// 9. FORM ELEMENTS
// ============================================
function initFormElements() {
    // Logo preview
    const logoInput = document.getElementById('schoolLogo');
    if (logoInput) {
        logoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const preview = document.getElementById('logoPreview');
                    if (preview) {
                        preview.src = ev.target.result;
                        preview.style.display = 'block';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Priority drag & drop
    const priorityList = document.getElementById('priorityList');
    let draggedItem = null;
    
    if (priorityList) {
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
    }
    
    const addPriorityBtn = document.getElementById('addPriorityBtn');
    if (addPriorityBtn) {
        addPriorityBtn.addEventListener('click', () => {
            const input = document.getElementById('newPriority');
            const newPriority = input?.value.trim();
            if (newPriority && priorityList) {
                const li = document.createElement('li');
                li.className = 'priority-item';
                li.draggable = true;
                li.textContent = newPriority;
                priorityList.appendChild(li);
                if (input) input.value = '';
                showToast('Priority added', 'success');
            }
        });
    }
}

// ============================================
// 10. GOAL MANAGEMENT
// ============================================
let goalCount = 0;

function initGoalManagement() {
    const addGoalBtn = document.getElementById('addGoalBtn');
    if (addGoalBtn) {
        addGoalBtn.addEventListener('click', addNewGoal);
    }
    addNewGoal();
}

function addNewGoal() {
    goalCount++;
    const container = document.getElementById('goalsContainer');
    if (!container) return;
    
    const goalId = 'goal_' + Date.now() + '_' + goalCount;
    
    const focusOptions = Array.from(document.getElementById('focusAreas')?.options || [])
        .map(opt => `<option value="${opt.value}">${opt.text}</option>`)
        .join('');
    
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
                ${focusOptions}
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
    if (description) {
        description.addEventListener('input', () => validateSMART(goalDiv));
    }
    
    const removeBtn = goalDiv.querySelector('.remove-goal');
    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            if (confirm('Remove this goal?')) {
                goalDiv.remove();
                showToast('Goal removed', 'info');
            }
        });
    }
}

function validateSMART(goalDiv) {
    const text = goalDiv.querySelector('.goal-description')?.value.toLowerCase() || '';
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
// 11. ACTION PLAN
// ============================================
function initActionPlan() {
    const addBtn = document.getElementById('addActionRowBtn');
    if (addBtn) {
        addBtn.addEventListener('click', addActionRow);
    }
    
    document.querySelectorAll('.remove-row-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('tr').remove();
        });
    });
}

function addActionRow() {
    const tbody = document.querySelector('#actionPlanTable tbody');
    if (!tbody) return;
    
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
    
    const removeBtn = newRow.querySelector('.remove-row-btn');
    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            this.closest('tr').remove();
        });
    }
}

// ============================================
// 12. BUDGET
// ============================================
function initBudget() {
    const addBtn = document.getElementById('addBudgetRowBtn');
    if (addBtn) {
        addBtn.addEventListener('click', addBudgetRow);
    }
    updateTotalBudget();
    
    const tbody = document.querySelector('#budgetTable tbody');
    if (tbody) {
        tbody.addEventListener('input', () => updateTotalBudget());
    }
}

function addBudgetRow() {
    const tbody = document.querySelector('#budgetTable tbody');
    if (!tbody) return;
    
    const newRow = document.createElement('tr');
    newRow.className = 'budget-row';
    newRow.innerHTML = `
        <td>
            <select class="budgetCategory">
                <option>Teaching Materials</option>
                <option>Infrastructure</option>
                <option>Training</option>
                <option>Others</option>
            </select>
        </td>
        <td><input type="number" class="budgetCost" placeholder="0.00"></td>
        <td><input type="text" class="budgetSource" placeholder="Source"></td>
        <td><textarea class="budgetNotes" rows="1"></textarea></td>
        <td><button class="remove-budget-btn"><i class="fas fa-trash"></i></button></td>
    `;
    tbody.appendChild(newRow);
    
    const removeBtn = newRow.querySelector('.remove-budget-btn');
    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            this.closest('tr').remove();
            updateTotalBudget();
        });
    }
    
    const costInput = newRow.querySelector('.budgetCost');
    if (costInput) {
        costInput.addEventListener('input', () => updateTotalBudget());
    }
}

function updateTotalBudget() {
    let total = 0;
    document.querySelectorAll('.budgetCost').forEach(input => {
        total += parseFloat(input.value) || 0;
    });
    const totalEl = document.getElementById('totalBudget');
    if (totalEl) {
        totalEl.innerText = total.toFixed(2);
    }
}

// ============================================
// 13. MILESTONES
// ============================================
function initMilestones() {
    const progressSlider = document.getElementById('milestoneProgress');
    const progressValue = document.getElementById('progressValue');
    
    if (progressSlider && progressValue) {
        progressSlider.addEventListener('input', () => {
            progressValue.innerText = progressSlider.value + '%';
        });
    }
    
    const addBtn = document.getElementById('addMilestoneBtn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const name = document.getElementById('milestoneName')?.value.trim();
            const progress = document.getElementById('milestoneProgress')?.value || 0;
            
            if (name) {
                milestones.push({ name, progress });
                updateMilestoneChart();
                const nameInput = document.getElementById('milestoneName');
                if (nameInput) nameInput.value = '';
                const slider = document.getElementById('milestoneProgress');
                if (slider) slider.value = 0;
                if (progressValue) progressValue.innerText = '0%';
                showToast('Milestone added', 'success');
            }
        });
    }
}

function updateMilestoneChart() {
    const container = document.getElementById('milestoneChart');
    if (!container) return;
    
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
// 14. SIGNATURES
// ============================================
function initSignatures() {
    initCanvas('headSignatureCanvas');
    initCanvas('authoritySignatureCanvas');
    
    const clearHead = document.getElementById('clearHeadSig');
    const clearAuth = document.getElementById('clearAuthSig');
    
    if (clearHead) {
        clearHead.addEventListener('click', () => {
            clearCanvas('headSignatureCanvas');
        });
    }
    if (clearAuth) {
        clearAuth.addEventListener('click', () => {
            clearCanvas('authoritySignatureCanvas');
        });
    }
}

function initCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
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
        ctx.strokeStyle = '#fff';
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
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// ============================================
// 15. EXPORT FUNCTIONS
// ============================================
function initExport() {
    const pdfBtn = document.getElementById('exportPDFBtn');
    const wordBtn = document.getElementById('exportWordBtn');
    const txtBtn = document.getElementById('exportTxtBtn');
    const jsonBtn = document.getElementById('exportJsonBtn');
    const printBtn = document.getElementById('printPlanBtn');
    const previewBtn = document.getElementById('previewFullPlanBtn');
    const exportFromPreview = document.getElementById('exportFromPreviewBtn');
    
    if (pdfBtn) pdfBtn.addEventListener('click', exportToPDF);
    if (wordBtn) wordBtn.addEventListener('click', exportToWord);
    if (txtBtn) txtBtn.addEventListener('click', exportToTXT);
    if (jsonBtn) jsonBtn.addEventListener('click', exportToJSON);
    if (printBtn) printBtn.addEventListener('click', printPlan);
    if (previewBtn) previewBtn.addEventListener('click', showFullPreview);
    if (exportFromPreview) exportFromPreview.addEventListener('click', exportToPDF);
}

function collectFormData() {
    return {
        schoolInfo: {
            name: document.getElementById('schoolName')?.value || '',
            emis: document.getElementById('emisCode')?.value || '',
            headTeacher: document.getElementById('headTeacher')?.value || '',
            email: document.getElementById('contactEmail')?.value || '',
            phone: document.getElementById('contactPhone')?.value || '',
            type: document.getElementById('schoolType')?.value || '',
            region: document.getElementById('region')?.value || '',
            vision: document.getElementById('visionStatement')?.value || '',
            mission: document.getElementById('missionStatement')?.value || '',
            coreValues: document.getElementById('coreValues')?.value || '',
            enrollment: document.getElementById('studentEnrollment')?.value || '',
            staff: document.getElementById('staffCount')?.value || ''
        },
        planDuration: {
            from: document.getElementById('planFrom')?.value || '',
            to: document.getElementById('planTo')?.value || '',
            term: document.getElementById('planTerm')?.value || '',
            focusAreas: Array.from(document.getElementById('focusAreas')?.selectedOptions || []).map(o => o.value)
        },
        swot: {
            strengths: document.getElementById('strengths')?.value || '',
            weaknesses: document.getElementById('weaknesses')?.value || '',
            opportunities: document.getElementById('opportunities')?.value || '',
            threats: document.getElementById('threats')?.value || ''
        },
        priorities: Array.from(document.querySelectorAll('#priorityList .priority-item') || []).map(li => li.textContent),
        goals: Array.from(document.querySelectorAll('.goal-item') || []).map(goal => ({
            description: goal.querySelector('.goal-description')?.value || '',
            focusArea: goal.querySelector('.goal-focus')?.value || '',
            measurement: goal.querySelector('.goal-measurement')?.value || ''
        })),
        actionPlan: Array.from(document.querySelectorAll('#actionPlanTable tbody tr') || []).map(row => ({
            objective: row.querySelector('.objective')?.value || '',
            activities: row.querySelector('.activities')?.value || '',
            responsible: row.querySelector('.responsible')?.value || '',
            timeline: row.querySelector('.timeline')?.value || '',
            resources: row.querySelector('.resources')?.value || '',
            monitoring: row.querySelector('.monitoring')?.value || '',
            outcome: row.querySelector('.outcome')?.value || ''
        })),
        milestones: milestones,
        kpis: document.getElementById('kpiIndicators')?.value || '',
        evalNotes: document.getElementById('evalNotes')?.value || '',
        budget: Array.from(document.querySelectorAll('#budgetTable tbody tr') || []).map(row => ({
            category: row.querySelector('.budgetCategory')?.value || '',
            cost: row.querySelector('.budgetCost')?.value || 0,
            source: row.querySelector('.budgetSource')?.value || '',
            notes: row.querySelector('.budgetNotes')?.value || ''
        })),
        sustainability: document.getElementById('sustainabilityPlan')?.value || '',
        communication: document.getElementById('communicationPlan')?.value || '',
        genderInclusion: document.getElementById('genderInclusion')?.value || '',
        childProtection: document.getElementById('childProtection')?.value || '',
        contingency: document.getElementById('contingencyPlan')?.value || '',
        procurement: document.getElementById('procurementPlan')?.value || '',
        approval: {
            name: document.getElementById('approvalName')?.value || '',
            title: document.getElementById('approvalTitle')?.value || '',
            date: document.getElementById('planDate')?.value || ''
        }
    };
}

function generatePlanHTML() {
    const data = collectFormData();
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #0a0a1a; color: #e0e0e0;">
            <h1 style="text-align: center; color: #00f5ff; text-shadow: 0 0 20px rgba(0,245,255,0.5);">School Development Plan</h1>
            <div style="text-align: center; border-bottom: 2px solid #00f5ff; padding-bottom: 20px;">
                <p><strong style="color: #00f5ff;">${data.schoolInfo.name || 'School Name'}</strong></p>
                <p>EMIS: ${data.schoolInfo.emis} | Head Teacher: ${data.schoolInfo.headTeacher}</p>
                <p>Plan Period: ${data.planDuration.from} to ${data.planDuration.to}</p>
            </div>
            
            <h2 style="color: #ff6bff; text-shadow: 0 0 15px rgba(255,107,255,0.3);">1. School Profile</h2>
            <p><strong style="color: #00f5ff;">Vision:</strong> ${data.schoolInfo.vision || 'N/A'}</p>
            <p><strong style="color: #00f5ff;">Mission:</strong> ${data.schoolInfo.mission || 'N/A'}</p>
            <p><strong style="color: #00f5ff;">Core Values:</strong> ${data.schoolInfo.coreValues || 'N/A'}</p>
            <p><strong style="color: #00f5ff;">Enrollment:</strong> ${data.schoolInfo.enrollment || 'N/A'} | <strong style="color: #00f5ff;">Staff:</strong> ${data.schoolInfo.staff || 'N/A'}</p>
            
            <h2 style="color: #ff6bff; text-shadow: 0 0 15px rgba(255,107,255,0.3);">2. Needs Assessment (SWOT)</h2>
            <p><strong style="color: #00f5ff;">Strengths:</strong> ${data.swot.strengths || 'N/A'}</p>
            <p><strong style="color: #00f5ff;">Weaknesses:</strong> ${data.swot.weaknesses || 'N/A'}</p>
            <p><strong style="color: #00f5ff;">Opportunities:</strong> ${data.swot.opportunities || 'N/A'}</p>
            <p><strong style="color: #00f5ff;">Threats:</strong> ${data.swot.threats || 'N/A'}</p>
            
            <h2 style="color: #ff6bff; text-shadow: 0 0 15px rgba(255,107,255,0.3);">3. Priorities</h2>
            <ol>${data.priorities.map(p => `<li>${p}</li>`).join('')}</ol>
            
            <h2 style="color: #ff6bff; text-shadow: 0 0 15px rgba(255,107,255,0.3);">4. SMART Goals</h2>
            ${data.goals.map((g, i) => `
                <div style="margin-bottom:15px; padding:10px; border:1px solid #333; border-radius:8px; background: rgba(0,245,255,0.05);">
                    <strong style="color: #00f5ff;">Goal ${i+1}:</strong> ${g.description || 'N/A'}<br>
                    <strong style="color: #ff6bff;">Focus Area:</strong> ${g.focusArea || 'N/A'}<br>
                    <strong style="color: #ff6bff;">Measurement:</strong> ${g.measurement || 'N/A'}
                </div>
            `).join('')}
            
            <h2 style="color: #ff6bff; text-shadow: 0 0 15px rgba(255,107,255,0.3);">5. Action Plan</h2>
            <table border="1" cellpadding="5" style="width:100%; border-collapse:collapse; border-color: #333;">
                <tr style="background: rgba(0,245,255,0.1);"><th style="color: #00f5ff;">Objective</th><th style="color: #00f5ff;">Activities</th><th style="color: #00f5ff;">Responsible</th><th style="color: #00f5ff;">Timeline</th><th style="color: #00f5ff;">Resources</th><th style="color: #00f5ff;">Monitoring</th><th style="color: #00f5ff;">Outcome</th></tr>
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
            
            <h2 style="color: #ff6bff; text-shadow: 0 0 15px rgba(255,107,255,0.3);">6. Budget</h2>
            <table border="1" cellpadding="5" style="border-color: #333;">
                <tr style="background: rgba(0,245,255,0.1);"><th style="color: #00f5ff;">Category</th><th style="color: #00f5ff;">Cost</th><th style="color: #00f5ff;">Source</th><th style="color: #00f5ff;">Notes</th></tr>
                ${data.budget.map(b => `<tr><td>${b.category}</td><td>$${b.cost}</td><td>${b.source}</td><td>${b.notes}</td></tr>`).join('')}
                <tr><td><strong style="color: #ff6bff;">Total</strong></td><td><strong style="color: #00f5ff;">$${data.budget.reduce((s,b)=>s+(parseFloat(b.cost)||0),0).toFixed(2)}</strong></td><td></td><td></td></tr>
            </table>
            
            <h2 style="color: #ff6bff; text-shadow: 0 0 15px rgba(255,107,255,0.3);">7. Sustainability & Safeguarding</h2>
            <p><strong style="color: #00f5ff;">Sustainability:</strong> ${data.sustainability || 'N/A'}</p>
            <p><strong style="color: #00f5ff;">Child Protection:</strong> ${data.childProtection || 'N/A'}</p>
            <p><strong style="color: #00f5ff;">Gender Inclusion:</strong> ${data.genderInclusion || 'N/A'}</p>
            
            <h2 style="color: #ff6bff; text-shadow: 0 0 15px rgba(255,107,255,0.3);">8. Approval</h2>
            <p>Approved By: ${data.approval.name} (${data.approval.title})</p>
            <p>Date: ${data.approval.date}</p>
            <div style="margin-top:30px; display:flex; justify-content:space-between;">
                <div style="width:45%; border-top:2px solid #00f5ff; text-align:center; padding-top:10px; color: #00f5ff;">Head Teacher Signature</div>
                <div style="width:45%; border-top:2px solid #ff6bff; text-align:center; padding-top:10px; color: #ff6bff;">Authority Signature</div>
            </div>
        </div>
    `;
}

async function exportToPDF() {
    showLoading(true);
    try {
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
        showToast('PDF exported successfully!', 'success');
    } catch (error) {
        showToast('Error exporting PDF', 'error');
    }
    showLoading(false);
}

async function exportToWord() {
    showLoading(true);
    try {
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
            showToast('Word document exported!', 'success');
        });
    } catch (error) {
        showToast('Error exporting Word', 'error');
        showLoading(false);
    }
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
    showToast('TXT file exported!', 'success');
}

function exportToJSON() {
    const data = collectFormData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    saveAs(blob, 'School_Development_Plan.json');
    showToast('JSON exported!', 'success');
}

function printPlan() {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html><head><title>School Development Plan</title>
        <style>body{font-family:Arial; padding:20px; background:#0a0a1a; color:#e0e0e0;} table{border-collapse:collapse; width:100%;} th,td{border:1px solid #333; padding:8px;} h1{color:#00f5ff;} h2{color:#ff6bff;}</style>
        </head><body>${generatePlanHTML()}</body></html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function showFullPreview() {
    const modal = document.getElementById('previewModal');
    const content = document.getElementById('previewContent');
    if (modal && content) {
        content.innerHTML = generatePlanHTML();
        modal.style.display = 'flex';
        
        const closeBtn = document.querySelector('.preview-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

// ============================================
// 16. DRAFT MANAGEMENT
// ============================================
function initDraft() {
    const saveBtn = document.getElementById('saveDraftBtn');
    const loadBtn = document.getElementById('loadDraftBtn');
    const clearBtn = document.getElementById('clearDraftBtn');
    
    if (saveBtn) saveBtn.addEventListener('click', saveDraft);
    if (loadBtn) loadBtn.addEventListener('click', loadDraft);
    if (clearBtn) clearBtn.addEventListener('click', clearDraft);
}

function saveDraft() {
    const data = collectFormData();
    setLocalData('draft', data);
    showToast('Draft saved successfully!', 'success');
}

function autoSaveDraft() {
    const data = collectFormData();
    setLocalData('draft_auto', data);
}

function loadDraft() {
    const draft = getLocalData('draft');
    if (draft) {
        populateForm(draft);
        showToast('Draft loaded!', 'success');
    } else {
        showToast('No saved draft found', 'warning');
    }
}

function clearDraft() {
    localStorage.removeItem('sdp_draft');
    localStorage.removeItem('sdp_draft_auto');
    showToast('Draft cleared', 'info');
}

function populateForm(data) {
    // Basic fields population
    const fields = {
        schoolName: data.schoolInfo?.name,
        emisCode: data.schoolInfo?.emis,
        headTeacher: data.schoolInfo?.headTeacher,
        contactEmail: data.schoolInfo?.email,
        contactPhone: data.schoolInfo?.phone,
        schoolType: data.schoolInfo?.type,
        region: data.schoolInfo?.region,
        visionStatement: data.schoolInfo?.vision,
        missionStatement: data.schoolInfo?.mission,
        coreValues: data.schoolInfo?.coreValues,
        strengths: data.swot?.strengths,
        weaknesses: data.swot?.weaknesses,
        opportunities: data.swot?.opportunities,
        threats: data.swot?.threats,
        kpiIndicators: data.kpis,
        evalNotes: data.evalNotes,
        sustainabilityPlan: data.sustainability,
        communicationPlan: data.communication,
        genderInclusion: data.genderInclusion,
        childProtection: data.childProtection,
        approvalName: data.approval?.name,
        approvalTitle: data.approval?.title,
        planDate: data.approval?.date
    };
    
    Object.entries(fields).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el && value !== undefined && value !== null) {
            el.value = value;
        }
    });
    
    // Milestones
    if (data.milestones) {
        milestones = data.milestones;
        updateMilestoneChart();
    }
    
    showToast('Form populated from draft', 'success');
}

// ============================================
// 17. AI SUGGESTIONS
// ============================================
function initAISuggestions() {
    const aiBtn = document.getElementById('aiSuggestBtn');
    if (aiBtn) {
        aiBtn.addEventListener('click', async () => {
            showLoading(true);
            try {
                const result = await apiCall('/api/generate-quote', {
                    method: 'POST',
                    body: JSON.stringify({ 
                        prompt: 'school development plan suggestions', 
                        category: 'education' 
                    })
                });
                
                if (result.success && result.data?.quote) {
                    const evalNotes = document.getElementById('evalNotes');
                    if (evalNotes) {
                        evalNotes.value += `\nAI Suggestion: ${result.data.quote}`;
                    }
                    showToast(`AI Suggestion added!`, 'success');
                } else {
                    fallbackAISuggestion();
                }
            } catch (error) {
                fallbackAISuggestion();
            }
            showLoading(false);
        });
    }
}

function fallbackAISuggestion() {
    const suggestions = [
        "Focus on teacher professional development to improve learning outcomes.",
        "Implement regular parent-teacher meetings for better community engagement.",
        "Upgrade digital infrastructure to support blended learning.",
        "Establish a child protection committee for student safety.",
        "Create an inclusive environment for students with special needs.",
        "Develop a comprehensive monitoring and evaluation framework.",
        "Integrate technology in classroom teaching and learning.",
        "Strengthen community partnerships for sustainable development."
    ];
    const random = suggestions[Math.floor(Math.random() * suggestions.length)];
    const evalNotes = document.getElementById('evalNotes');
    if (evalNotes) {
        evalNotes.value += `\nAI Suggestion: ${random}`;
    }
    showToast(`AI Suggestion added: ${random.substring(0, 80)}...`, 'info');
}

// ============================================
// 18. HELPER FUNCTIONS
// ============================================
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = show ? 'flex' : 'none';
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toastMsg');
    if (!toast) return;
    
    toast.textContent = message;
    toast.style.display = 'block';
    
    const colors = {
        success: 'linear-gradient(135deg, #00f5ff, #00d4ff)',
        error: 'linear-gradient(135deg, #ff4757, #ff6b81)',
        warning: 'linear-gradient(135deg, #ffa502, #ffbe76)',
        info: 'linear-gradient(135deg, #7c5cfc, #a29bfe)'
    };
    
    toast.style.background = colors[type] || colors.success;
    toast.style.color = '#0a0a1a';
    toast.style.fontWeight = '600';
    toast.style.boxShadow = '0 0 30px rgba(0,245,255,0.3)';
    
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// ============================================
// 19. PREMIUM MODAL
// ============================================
function initPremiumModal() {
    const modal = document.getElementById('premiumModal');
    const closeBtn = document.querySelector('.premium-close');
    const closeBtn2 = document.getElementById('closePremiumBtn');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (modal) modal.style.display = 'none';
        });
    }
    if (closeBtn2) {
        closeBtn2.addEventListener('click', () => {
            if (modal) modal.style.display = 'none';
        });
    }
    if (modal) {
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

// ============================================
// 20. INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initTypewriter();
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
    initPremiumModal();
    
    // Auto-save draft every 30 seconds
    setInterval(() => autoSaveDraft(), 30000);
    
    // Show welcome
    setTimeout(() => {
        showToast('🚀 Welcome to School Development Plan Generator!', 'success');
    }, 500);
    
    console.log('✅ School Development Plan Generator - Updated with Cloudflare API');
    console.log('🔧 Tool Slug:', CONFIG.TOOL_SLUG);
    console.log('📊 API Base:', CONFIG.API_BASE);
});
