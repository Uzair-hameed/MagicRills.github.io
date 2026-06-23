/**
 * ============================================
 * CREATIVE ART ECCE TEACHER IDEA GENERATOR
 * Cloudflare Workers API Integration
 * ============================================
 */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    API_BASE: 'https://magicrills-api.uzairhameed01.workers.dev',
    API_KEY: 'magicrills-grok-api.uzairhameed01.workers.dev',
    TOOL_SLUG: 'creative-art-ecce-teacher-idea',
    TOOL_NAME: 'Creative Art ECCE Teacher Idea',
    CATEGORY: 'ECCE'
};

// ============================================
// STATE
// ============================================
let activityDatabase = [];
let currentGeneratedIdeas = [];
let selectedIdeaIndices = new Set();
let statsCache = null;
let isInitialized = false;

// Dropdown state
const dropdowns = {
    goals: { options: [], selected: [] },
    materials: { options: [], selected: [] },
    type: { options: [], selected: [] },
    theme: { options: [], selected: [] }
};

// ============================================
// DOM REFS
// ============================================
const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);

const DOM = {
    toast: $('toastMsg'),
    scrollUp: $('scrollUpBtn'),
    scrollDown: $('scrollDownBtn'),
    filtersContainer: $('filtersContainer'),
    generateBtn: $('generateBtn'),
    surpriseBtn: $('surpriseBtn'),
    resetBtn: $('resetBtn'),
    heroGenerateBtn: $('heroGenerateBtn'),
    heroSurpriseBtn: $('heroSurpriseBtn'),
    ideasGrid: $('ideasGrid'),
    ideaCount: $('ideaCount'),
    exportPanel: $('exportPanel'),
    selectedIdeasList: $('selectedIdeasList'),
    selectedCount: $('selectedCount'),
    exportPDFBtn: $('exportPDFBtn'),
    exportDOCBtn: $('exportDOCBtn'),
    printSelectedBtn: $('printSelectedBtn'),
    statViews: $('statViews'),
    statUsage: $('statUsage'),
    statShares: $('statShares'),
    statFollowers: $('statFollowers'),
    typewriterText: $('typewriterText'),
    viewAllBtn: $('viewAllBtn')
};

// ============================================
// TOAST SYSTEM
// ============================================
function showToast(message, icon = '✨') {
    if (!DOM.toast) return;
    DOM.toast.innerHTML = `<i class="fas fa-${icon === '✨' ? 'sparkles' : 'info-circle'}"></i> ${message}`;
    DOM.toast.classList.add('show');
    clearTimeout(DOM.toast._timer);
    DOM.toast._timer = setTimeout(() => {
        DOM.toast.classList.remove('show');
    }, 3000);
}

// ============================================
// API CALLS
// ============================================
async function apiCall(endpoint, method = 'GET', data = null) {
    const url = `${CONFIG.API_BASE}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        'X-API-Key': CONFIG.API_KEY
    };
    const options = { method, headers };
    if (data) options.body = JSON.stringify(data);

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.warn('API call failed, using fallback:', error.message);
        return null;
    }
}

// ============================================
// STATS FUNCTIONS
// ============================================
async function fetchStats() {
    try {
        const result = await apiCall(`/api/stats?tool_slug=${CONFIG.TOOL_SLUG}`);
        if (result && result.success) {
            statsCache = result.data;
            updateStatsUI(statsCache);
            return statsCache;
        }
    } catch (e) {
        console.warn('Stats fetch failed, using localStorage fallback');
    }
    // LocalStorage fallback
    const localStats = JSON.parse(localStorage.getItem('toolStats') || '{}');
    const toolStats = localStats[CONFIG.TOOL_SLUG] || { usage: 0, shares: 0, reactions: {} };
    updateStatsUI(toolStats);
    return toolStats;
}

function updateStatsUI(stats) {
    if (DOM.statViews) DOM.statViews.textContent = stats.views || stats.usage || 0;
    if (DOM.statUsage) DOM.statUsage.textContent = stats.usage || 0;
    if (DOM.statShares) DOM.statShares.textContent = stats.shares || 0;
    if (DOM.statFollowers) DOM.statFollowers.textContent = stats.followers || 0;
}

async function incrementUsage() {
    try {
        const result = await apiCall('/api/usage', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG
        });
        if (result && result.success) {
            showToast('Activity recorded! +1 use', '📊');
            await fetchStats();
            return result.data;
        }
    } catch (e) {
        // LocalStorage fallback
        const localStats = JSON.parse(localStorage.getItem('toolStats') || '{}');
        if (!localStats[CONFIG.TOOL_SLUG]) {
            localStats[CONFIG.TOOL_SLUG] = { usage: 0, shares: 0, reactions: {} };
        }
        localStats[CONFIG.TOOL_SLUG].usage = (localStats[CONFIG.TOOL_SLUG].usage || 0) + 1;
        localStorage.setItem('toolStats', JSON.stringify(localStats));
        showToast('Activity recorded! (offline)', '📊');
        await fetchStats();
    }
}

async function addReaction(toolId, emoji) {
    try {
        const result = await apiCall('/api/reactions', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            tool_id: toolId,
            reaction: emoji
        });
        if (result && result.success) {
            showToast(`Reaction ${emoji} added!`, '❤️');
            return result.data;
        }
    } catch (e) {
        // LocalStorage fallback
        const localStats = JSON.parse(localStorage.getItem('toolStats') || '{}');
        if (!localStats[CONFIG.TOOL_SLUG]) {
            localStats[CONFIG.TOOL_SLUG] = { usage: 0, shares: 0, reactions: {} };
        }
        if (!localStats[CONFIG.TOOL_SLUG].reactions) {
            localStats[CONFIG.TOOL_SLUG].reactions = {};
        }
        localStats[CONFIG.TOOL_SLUG].reactions[emoji] = (localStats[CONFIG.TOOL_SLUG].reactions[emoji] || 0) + 1;
        localStorage.setItem('toolStats', JSON.stringify(localStats));
        showToast(`Reaction ${emoji} added! (offline)`, '❤️');
        return localStats[CONFIG.TOOL_SLUG].reactions;
    }
}

async function incrementShare(toolId) {
    try {
        const result = await apiCall('/api/shares', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            tool_id: toolId
        });
        if (result && result.success) {
            showToast('Shared successfully!', '🔗');
            await fetchStats();
            return result.data;
        }
    } catch (e) {
        // LocalStorage fallback
        const localStats = JSON.parse(localStorage.getItem('toolStats') || '{}');
        if (!localStats[CONFIG.TOOL_SLUG]) {
            localStats[CONFIG.TOOL_SLUG] = { usage: 0, shares: 0, reactions: {} };
        }
        localStats[CONFIG.TOOL_SLUG].shares = (localStats[CONFIG.TOOL_SLUG].shares || 0) + 1;
        localStorage.setItem('toolStats', JSON.stringify(localStats));
        showToast('Shared! (offline)', '🔗');
        await fetchStats();
    }
}

function getToolReactions(toolId) {
    const localStats = JSON.parse(localStorage.getItem('toolStats') || '{}');
    if (localStats[CONFIG.TOOL_SLUG] && localStats[CONFIG.TOOL_SLUG].reactions) {
        return localStats[CONFIG.TOOL_SLUG].reactions;
    }
    return {};
}

function getToolUsage(toolId) {
    const localStats = JSON.parse(localStorage.getItem('toolStats') || '{}');
    if (localStats[CONFIG.TOOL_SLUG]) {
        return localStats[CONFIG.TOOL_SLUG].usage || 0;
    }
    return 0;
}

function getToolShares(toolId) {
    const localStats = JSON.parse(localStorage.getItem('toolStats') || '{}');
    if (localStats[CONFIG.TOOL_SLUG]) {
        return localStats[CONFIG.TOOL_SLUG].shares || 0;
    }
    return 0;
}

// ============================================
// ACTIVITY DATABASE
// ============================================
function initializeDatabase() {
    const baseActivities = [
        { id: "leaf-texture-rubbings", name: "Leaf Texture Rubbings", materials: "Leaves, crayons, paper, tape", steps: ["Nature walk collect leaves.", "Place leaves under paper.", "Crayon rubbing sideways.", "Overlap colors.", "Discuss patterns."], outcome: "Fine motor & observation.", display: ["Nature Wall", "Seasonal Flip Book", "Science Corner", "Collaborative Forest", "Take-home card"], goals: ["fine-motor", "sensory", "observation"], type: ["individual"], theme: ["nature", "seasons"] },
        { id: "emotion-paper-plate-masks", name: "Emotion Paper Plate Masks", materials: "Paper plates, paints, yarn, craft sticks, mirrors", steps: ["Show emotion cards.", "Look in mirrors.", "Paint plate emotion.", "Add handle.", "Role-play."], outcome: "Emotional vocabulary.", display: ["Feelings Theatre", "Photo Gallery", "Calm Down Corner", "Bulletin Board", "Family Night"], goals: ["emotional-regulation", "social", "self-expression"], type: ["individual", "group"], theme: ["emotions", "my-body"] },
        { id: "bottle-cap-mosaic", name: "Bottle Cap Mosaic Art", materials: "Bottle caps, glue, cardboard", steps: ["Sort colors", "Sketch design", "Glue caps", "Fill gaps", "Display"], outcome: "Color sorting, cooperation", display: ["Group Mural", "Entrance Display", "Math Center", "Earth Day", "Yearbook"], goals: ["color-recognition", "pattern-recognition", "collaboration"], type: ["group"], theme: ["community"] },
        { id: "rainbow-handprint", name: "Rainbow Handprint Collage", materials: "Washable paints, paper", steps: ["Rainbow song", "Handprint arc", "All colors", "Clouds", "Team cheer"], outcome: "Collaboration", display: ["Classroom Entrance", "Unity Photo", "Open House", "Class Book", "Diversity"], goals: ["color-recognition", "collaboration", "social"], type: ["group"], theme: ["colors", "friendship"] },
        { id: "nature-crowns", name: "Nature Crowns", materials: "Cardboard, leaves, flowers", steps: ["Measure head", "Arrange", "Glue", "Dry", "Parade"], outcome: "Creativity, fine motor", display: ["Dress-up", "Seasonal Tree", "Parade Photos", "Home", "Theater"], goals: ["creativity", "fine-motor", "imagination"], type: ["individual"], theme: ["nature"] },
        { id: "spaghetti-painting", name: "Spaghetti Painting", materials: "Cooked spaghetti, paint", steps: ["Setup station", "Dip spaghetti", "Drape lines", "Twirl", "Compare textures"], outcome: "Sensory, cause-effect", display: ["Sensory Wall", "Process Art Book", "Restaurant Play", "Texture Study", "Gift Wrap"], goals: ["sensory", "creativity", "cause-effect"], type: ["sensory-play"], theme: ["food"] },
        { id: "recycled-robot", name: "Recycled Robot Sculpture", materials: "Boxes, bottle caps, foil", steps: ["Gather recyclables", "Design robot", "Glue", "Foil wrap", "Name robot"], outcome: "Problem-solving", display: ["STEM Corner", "Robot Portraits", "Story Starter", "Class Voting", "Eco-Exhibit"], goals: ["problem-solving", "creativity", "spatial-awareness"], type: ["individual"], theme: ["space"] },
        { id: "coffee-filter-butterflies", name: "Coffee Filter Butterflies", materials: "Filters, markers, spray bottle", steps: ["Color filter", "Spray water", "Dry", "Pinch with clothespin", "Fluff wings"], outcome: "Color theory", display: ["Flying Mobile", "Garden Bulletin", "Life Cycle Board", "Puppet Theater", "Spring Gift"], goals: ["color-recognition", "observation", "fine-motor"], type: ["individual"], theme: ["animals"] },
        { id: "salt-dough-ornaments", name: "Salt Dough Ornaments", materials: "Flour, salt, water, paint", steps: ["Mix dough", "Cut shapes", "Make hole", "Bake", "Paint & ribbon"], outcome: "Sensory, fine motor", display: ["Seasonal Tree", "Family Gift", "Memory Wall", "Texture Table", "Holiday Book"], goals: ["sensory", "fine-motor", "hand-eye-coordination"], type: ["individual"], theme: ["festivals"] },
        { id: "fingerprint-caterpillars", name: "Fingerprint Caterpillars", materials: "Stamp pad, paper, markers", steps: ["Fingerprint demo", "5-6 circles", "Add legs", "Googly eyes", "Count segments"], outcome: "Counting practice", display: ["Number Line", "Counting Book", "Math Corner", "Nature Board", "Take-home"], goals: ["counting", "fine-motor", "creativity"], type: ["individual"], theme: ["animals"] },
        { id: "paper-bag-puppets", name: "Paper Bag Puppets", materials: "Paper bags, yarn, glue", steps: ["Show puppet mechanism", "Decorate face", "Add hair", "Create script", "Perform show"], outcome: "Language & social", display: ["Puppet Theater", "Show Photos", "Story Corner", "Performance Award", "Home Show"], goals: ["language-development", "social", "self-expression"], type: ["group"], theme: ["fairy-tales"] }
    ];

    // Expand to 20+ activities
    activityDatabase = [...baseActivities];
    const variants = ['Creative', 'Colorful', 'Sensory', 'Group', 'Outdoor', 'Musical', 'Story', 'Seasonal', 'Cultural', 'Eco'];
    for (let i = 0; i < 10; i++) {
        const base = baseActivities[i % baseActivities.length];
        activityDatabase.push({
            ...base,
            id: `${base.id}_${i}`,
            name: `${variants[i % variants.length]} ${base.name}`,
            goals: [...base.goals, ...(i % 2 === 0 ? ['creativity'] : ['collaboration'])]
        });
    }

    // Build dropdown options
    const allGoals = new Set();
    const allMaterials = new Set(['paper', 'natural', 'recycled', 'fabric', 'paint', 'clay', 'food-items', 'sensory-base', 'wood', 'yarn']);
    const allTypes = new Set(['individual', 'group', 'display', 'outdoor', 'sensory-play']);
    const allThemes = new Set(['seasons', 'animals', 'nature', 'festivals', 'emotions', 'community', 'transportation', 'food', 'ocean', 'space', 'fairy-tales', 'family', 'friendship', 'colors', 'my-body', 'plants', 'weather', 'celebration', 'dinosaurs', 'underwater']);

    activityDatabase.forEach(act => {
        act.goals.forEach(g => allGoals.add(g));
        act.theme.forEach(t => allThemes.add(t));
    });

    dropdowns.goals.options = Array.from(allGoals).sort();
    dropdowns.materials.options = Array.from(allMaterials).sort();
    dropdowns.type.options = Array.from(allTypes).sort();
    dropdowns.theme.options = Array.from(allThemes).sort();
}

// ============================================
// FILTERS UI
// ============================================
function renderFilters() {
    const container = DOM.filtersContainer;
    container.innerHTML = '';

    for (const [key, cfg] of Object.entries(dropdowns)) {
        const div = document.createElement('div');
        div.className = 'dropdown-group';
        div.innerHTML = `
            <label>${key.toUpperCase()}</label>
            <div class="multi-select" id="${key}-dropdown">
                <div class="select-button">Select ${key} ▼</div>
                <div class="dropdown-content" id="${key}-options"></div>
            </div>
            <div class="selected-tags" id="${key}-tags"></div>
        `;
        container.appendChild(div);

        const optsDiv = document.getElementById(`${key}-options`);
        optsDiv.innerHTML = cfg.options.map(opt =>
            `<div class="dropdown-option">
                <input type="checkbox" value="${opt}" id="${key}_${opt}">
                <label for="${key}_${opt}">${opt.replace(/-/g, ' ')}</label>
            </div>`
        ).join('');

        optsDiv.querySelectorAll('input').forEach(cb => {
            cb.addEventListener('change', (e) => {
                const val = e.target.value;
                if (cb.checked) {
                    if (!dropdowns[key].selected.includes(val)) {
                        dropdowns[key].selected.push(val);
                    }
                } else {
                    dropdowns[key].selected = dropdowns[key].selected.filter(v => v !== val);
                }
                updateTags(key);
            });
        });

        const btn = document.querySelector(`#${key}-dropdown .select-button`);
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.dropdown-content').forEach(d => d.classList.remove('show'));
            optsDiv.classList.toggle('show');
            document.querySelector(`#${key}-dropdown`).classList.toggle('open');
        });

        updateTags(key);
    }

    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-content').forEach(d => d.classList.remove('show'));
        document.querySelectorAll('.multi-select').forEach(d => d.classList.remove('open'));
    });
}

function updateTags(key) {
    const tagsDiv = document.getElementById(`${key}-tags`);
    if (!tagsDiv) return;
    tagsDiv.innerHTML = dropdowns[key].selected.map(val =>
        `<span class="tag">${val.replace(/-/g, ' ')}<span class="tag-remove" data-key="${key}" data-value="${val}">×</span></span>`
    ).join('');

    document.querySelectorAll('.tag-remove').forEach(rm => {
        rm.addEventListener('click', (e) => {
            const k = rm.dataset.key;
            const val = rm.dataset.value;
            dropdowns[k].selected = dropdowns[k].selected.filter(v => v !== val);
            const cb = document.querySelector(`#${k}-options input[value="${val}"]`);
            if (cb) cb.checked = false;
            updateTags(k);
        });
    });
}

// ============================================
// FILTER LOGIC
// ============================================
function filterActivities() {
    return activityDatabase.filter(act => {
        if (dropdowns.goals.selected.length &&
            !dropdowns.goals.selected.some(g => act.goals.includes(g))) return false;
        if (dropdowns.materials.selected.length &&
            !dropdowns.materials.selected.some(m => act.materials.toLowerCase().includes(m))) return false;
        if (dropdowns.type.selected.length &&
            !dropdowns.type.selected.some(t => act.type.includes(t))) return false;
        if (dropdowns.theme.selected.length &&
            !dropdowns.theme.selected.some(th => act.theme.includes(th))) return false;
        return true;
    });
}

// ============================================
// DISPLAY IDEAS
// ============================================
function displayIdeas(ideas) {
    const grid = DOM.ideasGrid;
    if (!ideas || !ideas.length) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-paint-brush"></i>
                <h3>No activities found</h3>
                <p>Try adjusting your filters or generate new ideas</p>
            </div>
        `;
        DOM.ideaCount.textContent = '0 activities';
        return;
    }

    grid.innerHTML = ideas.map((idea, idx) => {
        const reactions = getToolReactions(idea.id);
        const usageCount = getToolUsage(idea.id);
        const shareCount = getToolShares(idea.id);

        const reactionEmojis = { '👍': 'Like', '❤️': 'Love', '😮': 'Wow', '😢': 'Sad', '😂': 'Laugh', '🎉': 'Celebrate' };
        const reactionColors = {
            '👍': '#34d399', '❤️': '#ec4899', '😮': '#f59e0b',
            '😢': '#60a5fa', '😂': '#fbbf24', '🎉': '#a855f7'
        };

        return `
            <div class="idea-card" data-tool-id="${idea.id}" data-index="${idx}">
                <div class="card-header">
                    <h3>🎨 ${idea.name}</h3>
                    <div class="card-badges">
                        ${idea.goals.slice(0, 3).map(g => `<span class="card-badge">🎯 ${g.replace(/-/g, ' ')}</span>`).join('')}
                    </div>
                </div>
                <div class="card-body">
                    <div class="detail-block">
                        <strong>🧰 Materials</strong>
                        <p>${idea.materials}</p>
                    </div>
                    <div class="detail-block">
                        <strong>📋 Teaching Process</strong>
                        <ol>${idea.steps.map(s => `<li>${s}</li>`).join('')}</ol>
                    </div>
                    <div class="detail-block">
                        <strong>🎯 Outcome</strong>
                        <p>${idea.outcome}</p>
                    </div>
                    <div class="detail-block">
                        <strong>🖼️ Display Ideas</strong>
                        <ul>${idea.display.map(d => `<li>${d}</li>`).join('')}</ul>
                    </div>

                    <div class="tool-footer">
                        <div class="reactions">
                            ${Object.entries(reactionEmojis).map(([emoji, label]) => `
                                <button class="reaction-btn" data-emoji="${emoji}" data-tool-id="${idea.id}" style="border-color: ${reactionColors[emoji] || 'var(--border-color)'}">
                                    ${emoji} <span class="reaction-count">${reactions[emoji] || 0}</span>
                                </button>
                            `).join('')}
                        </div>
                        <div class="social-icons">
                            <i class="fab fa-facebook-f social-icon" data-share="fb" data-tool-id="${idea.id}"></i>
                            <i class="fab fa-twitter social-icon" data-share="tw" data-tool-id="${idea.id}"></i>
                            <i class="fab fa-linkedin-in social-icon" data-share="li" data-tool-id="${idea.id}"></i>
                            <i class="fab fa-whatsapp social-icon" data-share="wa" data-tool-id="${idea.id}"></i>
                            <i class="fas fa-copy social-icon" data-share="copy" data-tool-id="${idea.id}"></i>
                        </div>
                    </div>

                    <div class="card-actions">
                        <span class="usage-counter">📊 Used ${usageCount} times</span>
                        <span class="share-counter">🔗 Shared ${shareCount}</span>
                        <button class="tool-use-btn" data-tool-id="${idea.id}">Use This</button>
                        <button class="select-idea" data-idx="${idx}">✓ Select</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Attach events
    attachCardEvents();
    DOM.ideaCount.textContent = `${ideas.length} activities`;
}

function attachCardEvents() {
    // Use Tool buttons
    document.querySelectorAll('.tool-use-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const toolId = btn.dataset.toolId;
            await incrementUsage();
            // Update UI
            const card = btn.closest('.idea-card');
            const usageSpan = card.querySelector('.usage-counter');
            const newCount = getToolUsage(toolId);
            if (usageSpan) usageSpan.textContent = `📊 Used ${newCount} times`;
            showToast('Tool usage recorded!', '📊');
        });
    });

    // Reaction buttons
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const emoji = btn.dataset.emoji;
            const toolId = btn.dataset.toolId;
            await addReaction(toolId, emoji);
            // Update UI
            const countSpan = btn.querySelector('.reaction-count');
            const reactions = getToolReactions(toolId);
            if (countSpan) countSpan.textContent = reactions[emoji] || 0;
        });
    });

    // Share buttons
    document.querySelectorAll('.social-icon').forEach(icon => {
        icon.addEventListener('click', async (e) => {
            e.stopPropagation();
            const toolId = icon.dataset.toolId;
            const shareType = icon.dataset.share;
            const shareUrl = encodeURIComponent(window.location.href + '?tool=' + toolId);

            let shareLink = '';
            if (shareType === 'fb') shareLink = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
            else if (shareType === 'tw') shareLink = `https://twitter.com/intent/tweet?url=${shareUrl}&text=Check out this ECCE art idea!`;
            else if (shareType === 'li') shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
            else if (shareType === 'wa') shareLink = `https://api.whatsapp.com/send?text=${shareUrl}`;
            else if (shareType === 'copy') {
                try {
                    await navigator.clipboard.writeText(window.location.href + '?tool=' + toolId);
                    showToast('Link copied!', '📋');
                } catch {
                    showToast('Press Ctrl+C to copy', '📋');
                }
                await incrementShare(toolId);
                const card = icon.closest('.idea-card');
                const shareSpan = card.querySelector('.share-counter');
                if (shareSpan) shareSpan.textContent = `🔗 Shared ${getToolShares(toolId)}`;
                return;
            }

            if (shareLink) {
                window.open(shareLink, '_blank', 'width=600,height=400');
                await incrementShare(toolId);
                const card = icon.closest('.idea-card');
                const shareSpan = card.querySelector('.share-counter');
                if (shareSpan) shareSpan.textContent = `🔗 Shared ${getToolShares(toolId)}`;
            }
        });
    });

    // Select buttons
    document.querySelectorAll('.select-idea').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.dataset.idx);
            if (selectedIdeaIndices.has(idx)) {
                selectedIdeaIndices.delete(idx);
                btn.classList.remove('selected');
                btn.textContent = '✓ Select';
            } else {
                selectedIdeaIndices.add(idx);
                btn.classList.add('selected');
                btn.textContent = '✔ Selected';
            }
            updateExportPanel();
        });
    });
}

// ============================================
// GENERATE FUNCTIONS
// ============================================
function generateIdeas() {
    currentGeneratedIdeas = filterActivities();
    displayIdeas(currentGeneratedIdeas);
    selectedIdeaIndices.clear();
    DOM.exportPanel.classList.remove('show');
    showToast(`Generated ${currentGeneratedIdeas.length} ideas`, '✨');
}

function surpriseMe() {
    if (!activityDatabase.length) return;
    const random = [activityDatabase[Math.floor(Math.random() * activityDatabase.length)]];
    currentGeneratedIdeas = random;
    displayIdeas(currentGeneratedIdeas);
    selectedIdeaIndices.clear();
    DOM.exportPanel.classList.remove('show');
    showToast('Surprise idea generated!', '🎲');
}

function resetAll() {
    for (const key of ['goals', 'materials', 'type', 'theme']) {
        dropdowns[key].selected = [];
        document.querySelectorAll(`#${key}-options input`).forEach(cb => cb.checked = false);
        updateTags(key);
    }
    currentGeneratedIdeas = [];
    selectedIdeaIndices.clear();
    DOM.ideasGrid.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-wand-magic-sparkles"></i>
            <h3>Ready to create!</h3>
            <p>Select filters and click "Generate Ideas"</p>
        </div>
    `;
    DOM.ideaCount.textContent = '0 activities';
    DOM.exportPanel.classList.remove('show');
    showToast('Reset complete!', '🔄');
}

// ============================================
// EXPORT FUNCTIONS
// ============================================
function updateExportPanel() {
    const panel = DOM.exportPanel;
    const listDiv = DOM.selectedIdeasList;
    const countSpan = DOM.selectedCount;

    if (selectedIdeaIndices.size === 0) {
        panel.classList.remove('show');
        return;
    }

    const selected = Array.from(selectedIdeaIndices)
        .map(idx => currentGeneratedIdeas[idx])
        .filter(Boolean);

    if (!selected.length) {
        panel.classList.remove('show');
        return;
    }

    listDiv.innerHTML = selected.map(idea =>
        `<div class="selected-item">
            <h4>🎨 ${idea.name}</h4>
            <p><strong>Materials:</strong> ${idea.materials}</p>
            <p><strong>Outcome:</strong> ${idea.outcome}</p>
            <p><strong>Displays:</strong> ${idea.display.slice(0, 3).join(' • ')}</p>
        </div>`
    ).join('');

    countSpan.textContent = `${selected.length} selected`;
    panel.classList.add('show');
}

function exportToPDF() {
    const selected = Array.from(selectedIdeaIndices)
        .map(idx => currentGeneratedIdeas[idx])
        .filter(Boolean);
    if (!selected.length) { showToast('Please select activities first', '⚠️'); return; }

    const content = document.createElement('div');
    content.style.cssText = 'padding: 30px; font-family: Arial, sans-serif;';
    content.innerHTML = `
        <h1 style="color: #40e0d0; font-size: 28px;">🎨 ECCE Art Activities</h1>
        <p style="color: #666; margin-bottom: 20px;">Generated by MagicRills</p>
        <hr style="border-color: #eee;">
    `;
    selected.forEach(act => {
        content.innerHTML += `
            <div style="margin: 20px 0; padding: 16px; background: #f8f9fa; border-radius: 8px;">
                <h2 style="color: #1a1a2e; font-size: 20px;">${act.name}</h2>
                <p><strong>Materials:</strong> ${act.materials}</p>
                <p><strong>Steps:</strong></p>
                <ol>${act.steps.map(s => `<li>${s}</li>`).join('')}</ol>
                <p><strong>Outcome:</strong> ${act.outcome}</p>
                <p><strong>Display Ideas:</strong></p>
                <ul>${act.display.map(d => `<li>${d}</li>`).join('')}</ul>
            </div>
        `;
    });

    html2pdf()
        .set({ margin: 10, filename: 'ECCE_Art_Activities.pdf', image: { type: 'jpeg', quality: 0.98 } })
        .from(content)
        .save()
        .then(() => showToast('PDF exported!', '📄'))
        .catch(() => showToast('PDF export failed', '❌'));
}

function exportToDOC() {
    const selected = Array.from(selectedIdeaIndices)
        .map(idx => currentGeneratedIdeas[idx])
        .filter(Boolean);
    if (!selected.length) { showToast('Please select activities first', '⚠️'); return; }

    let html = `<html><head><meta charset="UTF-8"><title>ECCE Art Activities</title></head><body>`;
    html += `<h1>🎨 ECCE Art Activities</h1><p>Generated by MagicRills</p><hr>`;
    selected.forEach(act => {
        html += `
            <div style="margin: 20px 0;">
                <h2>${act.name}</h2>
                <p><b>Materials:</b> ${act.materials}</p>
                <p><b>Steps:</b></p>
                <ol>${act.steps.map(s => `<li>${s}</li>`).join('')}</ol>
                <p><b>Outcome:</b> ${act.outcome}</p>
                <p><b>Display Ideas:</b></p>
                <ul>${act.display.map(d => `<li>${d}</li>`).join('')}</ul>
                <hr>
            </div>
        `;
    });
    html += `</body></html>`;

    const blob = new Blob([html], { type: 'application/msword' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ECCE_Art_Activities.doc';
    a.click();
    URL.revokeObjectURL(blob);
    showToast('DOC exported!', '📝');
}

function printSelected() {
    const selected = Array.from(selectedIdeaIndices)
        .map(idx => currentGeneratedIdeas[idx])
        .filter(Boolean);
    if (!selected.length) { showToast('Please select activities first', '⚠️'); return; }

    const w = window.open('', '_blank', 'width=800,height=600');
    if (!w) { showToast('Please allow popups', '⚠️'); return; }

    w.document.write(`
        <html><head><title>ECCE Art Activities</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #1a1a2e; }
            h1 { color: #40e0d0; }
            .activity { margin: 20px 0; padding: 16px; background: #f8f9fa; border-radius: 8px; }
            hr { border-color: #eee; }
            @media print { .no-print { display: none; } }
        </style>
        </head><body>
        <h1>🎨 ECCE Art Activities</h1>
        <p>Generated by MagicRills</p>
        <hr>
    `);
    selected.forEach(act => {
        w.document.write(`
            <div class="activity">
                <h2>${act.name}</h2>
                <p><strong>Materials:</strong> ${act.materials}</p>
                <p><strong>Steps:</strong></p>
                <ol>${act.steps.map(s => `<li>${s}</li>`).join('')}</ol>
                <p><strong>Outcome:</strong> ${act.outcome}</p>
                <p><strong>Display Ideas:</strong></p>
                <ul>${act.display.map(d => `<li>${d}</li>`).join('')}</ul>
            </div>
        `);
    });
    w.document.write(`<p class="no-print"><button onclick="window.print()">Print</button></p></body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 500);
}

// ============================================
// TYPEWRITER EFFECT
// ============================================
function initTypewriter() {
    const phrases = [
        'Create Art Activities for ECCE',
        '20+ Learning Goals & Themes',
        'AI-Powered Suggestions',
        'Engage Young Learners',
        'Creative Teaching Made Easy'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const element = DOM.typewriterText;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
            element.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            setTimeout(() => { isDeleting = true; }, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }

        const speed = isDeleting ? 50 : 80;
        setTimeout(type, speed);
    }

    type();
}

// ============================================
// SCROLL BUTTONS
// ============================================
function initScrollButtons() {
    const scrollUp = DOM.scrollUp;
    const scrollDown = DOM.scrollDown;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollUp.classList.remove('hidden');
        } else {
            scrollUp.classList.add('hidden');
        }
    });

    scrollUp.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    scrollDown.addEventListener('click', () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
}

// ============================================
// INITIALIZATION
// ============================================
async function init() {
    if (isInitialized) return;

    try {
        // Initialize data
        initializeDatabase();

        // Render UI
        renderFilters();

        // Fetch stats
        await fetchStats();

        // Increment usage on load
        await incrementUsage();

        // Typewriter
        initTypewriter();

        // Scroll buttons
        initScrollButtons();

        // Event listeners
        DOM.generateBtn.addEventListener('click', generateIdeas);
        DOM.heroGenerateBtn.addEventListener('click', generateIdeas);
        DOM.surpriseBtn.addEventListener('click', surpriseMe);
        DOM.heroSurpriseBtn.addEventListener('click', surpriseMe);
        DOM.resetBtn.addEventListener('click', resetAll);

        DOM.exportPDFBtn.addEventListener('click', exportToPDF);
        DOM.exportDOCBtn.addEventListener('click', exportToDOC);
        DOM.printSelectedBtn.addEventListener('click', printSelected);

        // Show empty state
        resetAll();

        isInitialized = true;
        console.log('🎨 ECCE Art Tool initialized successfully!');
    } catch (error) {
        console.error('Initialization error:', error);
        showToast('Error loading tool. Please refresh.', '❌');
    }
}

// ============================================
// PAGE SHARE BUTTON (Add to Hero)
// ============================================
function addPageShareButton() {
    const heroActions = document.querySelector('.hero-actions');
    if (!heroActions) return;

    const shareBtn = document.createElement('button');
    shareBtn.className = 'hero-btn secondary';
    shareBtn.innerHTML = '<i class="fas fa-share-alt"></i> Share';
    shareBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            showToast('Link copied to clipboard!', '📋');
        } catch {
            showToast('Press Ctrl+C to copy link', '📋');
        }
    });
    heroActions.appendChild(shareBtn);
}

// ============================================
// START APP
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    init().then(() => {
        addPageShareButton();
    });
});

// ============================================
// ERROR HANDLING
// ============================================
window.addEventListener('error', (e) => {
    console.error('Global error:', e.message);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled rejection:', e.reason);
});

console.log('🚀 ECCE Art Tool loaded');
