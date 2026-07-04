/* ============================================
   FINE MOTOR SKILLS ACTIVITY PLANNER - JS
   Professional | Filter-Based Generation
   ============================================ */

const CONFIG = {
    API_BASE: 'https://magicrills-api.uzairhameed01.workers.dev',
    API_KEY: 'magicrills-grok-api.uzairhameed01.workers.dev',
    TOOL_SLUG: 'fine-motor-skills-activity-planner',
    TOOL_NAME: 'Fine Motor Skills Activity Planner'
};

// ========== STATE ==========
let favorites = JSON.parse(localStorage.getItem('favs')) || [];
let completed = JSON.parse(localStorage.getItem('completedActs')) || [];
let usageCounts = JSON.parse(localStorage.getItem('usageCounts')) || {};
let reactionsData = JSON.parse(localStorage.getItem('reactionsData')) || {};
let toolShares = JSON.parse(localStorage.getItem('toolShares')) || {};
let currentActivitiesList = [];

// ========== ACTIVITY DATABASE (52 Activities) ==========
const activitiesDB = [
    { id: 1, title: "🧸 Playdough Exploration", ageRange: "1-2", skillLevel: "beginner", timeRequired: 8, resources: ["playdough", "rolling pin"], activityType: "indoor", description: "Squishing and rolling dough builds hand strength.", benefits: "Hand strength, sensory integration", process: "1️⃣ Show child how to squeeze playdough.\n2️⃣ Roll into a ball using both hands.\n3️⃣ Flatten with palm.\n4️⃣ Poke fingers to make holes.\n5️⃣ Roll into snake shape.", suggestions: "Use scented dough. Add plastic animals.", guidelines: "Supervise mouthing. Use edible dough if needed." },
    { id: 2, title: "🎨 Finger Painting Fun", ageRange: "1-2", skillLevel: "beginner", timeRequired: 10, resources: ["paint", "paper", "apron"], activityType: "indoor", description: "Finger painting develops sensory awareness.", benefits: "Sensory, finger isolation", process: "1️⃣ Squeeze paint on paper.\n2️⃣ Spread with whole hand.\n3️⃣ Use one finger to draw lines.\n4️⃣ Make dots with fingertip.\n5️⃣ Smudge with palm.", suggestions: "Add sand for texture. Use pudding paint.", guidelines: "Use washable paint. Cover workspace." },
    { id: 3, title: "🧩 Chunky Puzzle", ageRange: "1-2", skillLevel: "beginner", timeRequired: 5, resources: ["puzzles"], activityType: "indoor", description: "Large knob puzzles develop grasping.", benefits: "Pincer grasp, problem solving", process: "1️⃣ Remove all pieces.\n2️⃣ Show matching piece to slot.\n3️⃣ Guide hand to place piece.\n4️⃣ Encourage independent placement.\n5️⃣ Celebrate each success.", suggestions: "Talk about animal sounds.", guidelines: "Avoid small pieces. Supervise always." },
    { id: 4, title: "🔵 Playdough Shapes", ageRange: "3-4", skillLevel: "beginner", timeRequired: 12, resources: ["playdough", "cookie cutters", "rolling pin"], activityType: "indoor", description: "Cutting shapes strengthens hand muscles.", benefits: "Hand strength, dexterity", process: "1️⃣ Roll dough flat.\n2️⃣ Press cookie cutter firmly.\n3️⃣ Remove excess dough.\n4️⃣ Pop out shape.\n5️⃣ Create a scene with shapes.", suggestions: "Use alphabet cutters.", guidelines: "Non-toxic dough only." },
    { id: 5, title: "✂️ Beginning Scissor Snips", ageRange: "3-4", skillLevel: "beginner", timeRequired: 10, resources: ["safety scissors", "paper strips"], activityType: "indoor", description: "Snip paper to build cutting skills.", benefits: "Bilateral coordination", process: "1️⃣ Hold scissors correctly.\n2️⃣ Practice opening/closing.\n3️⃣ Snip edge of paper strip.\n4️⃣ Make fringes.\n5️⃣ Collect snips for collage.", suggestions: "Use playdough to snip first.", guidelines: "Always use safety scissors." },
    { id: 6, title: "🧵 Lacing Beads", ageRange: "3-4", skillLevel: "intermediate", timeRequired: 15, resources: ["beads", "string"], activityType: "indoor", description: "Thread beads to improve eye-hand coordination.", benefits: "Pincer grasp, focus", process: "1️⃣ Tie knot at string end.\n2️⃣ Hold bead with left hand.\n3️⃣ Push string through hole.\n4️⃣ Pull string through.\n5️⃣ Add next bead.", suggestions: "Create color patterns.", guidelines: "Use large beads. Supervise choking." },
    { id: 7, title: "🧱 Building Block Tower", ageRange: "3-4", skillLevel: "beginner", timeRequired: 10, resources: ["blocks", "lego duplo"], activityType: "indoor", description: "Stacking blocks develops hand control.", benefits: "Hand-eye coordination", process: "1️⃣ Select blocks.\n2️⃣ Place one on top.\n3️⃣ Align edges carefully.\n4️⃣ Add third block.\n5️⃣ Create a tall tower.", suggestions: "Build bridges. Sort by color.", guidelines: "Ensure stability. Avoid tall towers." },
    { id: 8, title: "🎨 Sticker Lines", ageRange: "3-4", skillLevel: "beginner", timeRequired: 8, resources: ["stickers", "paper"], activityType: "indoor", description: "Peel and stick stickers along lines.", benefits: "Pincer grasp, precision", process: "1️⃣ Draw a line on paper.\n2️⃣ Peel sticker off sheet.\n3️⃣ Place sticker on line.\n4️⃣ Press firmly.\n5️⃣ Continue until line is filled.", suggestions: "Use themed stickers.", guidelines: "Help with peeling." },
    { id: 9, title: "✂️ Cutting Curves", ageRange: "4-5", skillLevel: "intermediate", timeRequired: 12, resources: ["scissors", "paper with wavy lines"], activityType: "indoor", description: "Cut along curved lines for advanced scissor skills.", benefits: "Visual motor integration", process: "1️⃣ Draw wavy line on paper.\n2️⃣ Hold scissors correctly.\n3️⃣ Follow line slowly.\n4️⃣ Turn paper as needed.\n5️⃣ Cut out complete shape.", suggestions: "Use cardstock.", guidelines: "Supervise closely." },
    { id: 10, title: "🧴 Tweezer Pom-Pom Transfer", ageRange: "4-5", skillLevel: "intermediate", timeRequired: 12, resources: ["tweezers", "pom-poms", "ice tray"], activityType: "indoor", description: "Use tweezers to move pom-poms.", benefits: "Fine motor precision", process: "1️⃣ Place pom-poms in left bowl.\n2️⃣ Hold tweezers like pencil.\n3️⃣ Squeeze to pick up.\n4️⃣ Move to ice tray slot.\n5️⃣ Release and repeat.", suggestions: "Time the activity.", guidelines: "Use plastic tweezers." },
    { id: 11, title: "💧 Water Pouring", ageRange: "4-5", skillLevel: "intermediate", timeRequired: 10, resources: ["pitcher", "cups", "tray", "sponge"], activityType: "indoor", description: "Pour water to develop wrist control.", benefits: "Wrist stability, concentration", process: "1️⃣ Fill pitcher halfway.\n2️⃣ Hold with both hands.\n3️⃣ Tilt slowly over cup.\n4️⃣ Stop when cup is full.\n5️⃣ Wipe spills with sponge.", suggestions: "Add food coloring.", guidelines: "Use tray to catch spills." },
    { id: 12, title: "🧵 Sewing Cards", ageRange: "4-5", skillLevel: "intermediate", timeRequired: 15, resources: ["lacing cards", "string"], activityType: "indoor", description: "Lace string through holes.", benefits: "Bilateral coordination", process: "1️⃣ Tie string to first hole.\n2️⃣ Push up through next hole.\n3️⃣ Pull string through.\n4️⃣ Continue in and out.\n5️⃣ Finish with a bow.", suggestions: "Make own cards.", guidelines: "Laminate for reuse." },
    { id: 13, title: "🧩 12-Piece Puzzle", ageRange: "5-6", skillLevel: "intermediate", timeRequired: 15, resources: ["jigsaw puzzles"], activityType: "indoor", description: "Complete jigsaw puzzle.", benefits: "Spatial reasoning", process: "1️⃣ Spread pieces face up.\n2️⃣ Find edge pieces first.\n3️⃣ Connect matching colors.\n4️⃣ Build frame.\n5️⃣ Fill center pieces.", suggestions: "Use picture guide.", guidelines: "Age-appropriate piece count." },
    { id: 14, title: "✍️ Sand Writing", ageRange: "5-6", skillLevel: "intermediate", timeRequired: 12, resources: ["sand", "tray", "stick"], activityType: "indoor", description: "Write letters in sand.", benefits: "Pre-writing, sensory", process: "1️⃣ Fill tray with sand.\n2️⃣ Smooth surface.\n3️⃣ Use finger to draw letter.\n4️⃣ Erase and retry.\n5️⃣ Write simple words.", suggestions: "Use colored sand.", guidelines: "Supervise sand play." },
    { id: 15, title: "🔧 Clay Sculpting", ageRange: "5-6", skillLevel: "advanced", timeRequired: 25, resources: ["clay", "clay tools"], activityType: "indoor", description: "Shape clay into animals.", benefits: "Hand strength, creativity", process: "1️⃣ Knead clay to soften.\n2️⃣ Roll into ball.\n3️⃣ Pinch ears and tail.\n4️⃣ Use tools for details.\n5️⃣ Let air dry.", suggestions: "Paint when dry.", guidelines: "Use air-dry clay." },
    { id: 16, title: "🖇️ Clothespin Drop", ageRange: "5-6", skillLevel: "beginner", timeRequired: 8, resources: ["clothespins", "jar"], activityType: "indoor", description: "Drop clothespins into jar.", benefits: "Hand strength", process: "1️⃣ Hold clothespin.\n2️⃣ Position over jar.\n3️⃣ Open fingers to drop.\n4️⃣ Count each drop.\n5️⃣ Empty and repeat.", suggestions: "Use different sized jars.", guidelines: "Use plastic clothespins." },
    { id: 17, title: "📄 Origami Basic", ageRange: "6-8", skillLevel: "advanced", timeRequired: 20, resources: ["origami paper", "instructions"], activityType: "indoor", description: "Fold paper into shapes.", benefits: "Bilateral coordination", process: "1️⃣ Start with square paper.\n2️⃣ Fold in half diagonally.\n3️⃣ Crease firmly.\n4️⃣ Fold corners to center.\n5️⃣ Complete simple crane.", suggestions: "Watch video tutorials.", guidelines: "Help with complex folds." },
    { id: 18, title: "🔩 Nuts and Bolts", ageRange: "6-8", skillLevel: "advanced", timeRequired: 15, resources: ["nuts", "bolts"], activityType: "indoor", description: "Screw nuts onto bolts.", benefits: "Wrist rotation", process: "1️⃣ Hold bolt in one hand.\n2️⃣ Pick nut with other.\n3️⃣ Align threads.\n4️⃣ Twist to screw on.\n5️⃣ Tighten appropriately.", suggestions: "Use different sizes.", guidelines: "Use large hardware." },
    { id: 19, title: "🏀 Outdoor Chalk Drawing", ageRange: "5-8", skillLevel: "beginner", timeRequired: 15, resources: ["sidewalk chalk", "outdoor pavement"], activityType: "outdoor", description: "Draw large shapes with chalk.", benefits: "Gross & fine motor", process: "1️⃣ Choose chalk color.\n2️⃣ Draw large circle.\n3️⃣ Add details with fingers.\n4️⃣ Write letters.\n5️⃣ Create hopscotch.", suggestions: "Trace shadows.", guidelines: "Supervise outdoor play." },
    { id: 20, title: "🌿 Leaf Threading", ageRange: "4-6", skillLevel: "intermediate", timeRequired: 12, resources: ["leaves", "hole punch", "string"], activityType: "outdoor", description: "Punch holes and thread leaves.", benefits: "Precision", process: "1️⃣ Collect fallen leaves.\n2️⃣ Punch hole in each leaf.\n3️⃣ Thread string through holes.\n4️⃣ Make leaf garland.\n5️⃣ Hang outdoors.", suggestions: "Use different leaf shapes.", guidelines: "Avoid poisonous plants." }
];

// Generate additional activities (21-52)
for (let i = 21; i <= 52; i++) {
    let ageOpt = i % 4 === 0 ? "7-8" : i % 3 === 0 ? "5-6" : i % 2 === 0 ? "3-4" : "1-2";
    let skillOpt = i < 30 ? "beginner" : i < 42 ? "intermediate" : "advanced";
    let typeOpt = i % 5 === 0 ? "outdoor" : "indoor";
    activitiesDB.push({
        id: i,
        title: `🎯 Activity ${i}`,
        ageRange: ageOpt,
        skillLevel: skillOpt,
        timeRequired: 10 + (i % 25),
        resources: ["paper", "scissors", "glue", "markers"],
        activityType: typeOpt,
        description: `Fine motor activity for ${ageOpt} years, ${skillOpt} level.`,
        benefits: "Hand strength, coordination",
        process: "1️⃣ Gather materials.\n2️⃣ Demonstrate technique.\n3️⃣ Child attempts independently.\n4️⃣ Offer guidance.\n5️⃣ Clean up together.",
        suggestions: "Use positive reinforcement.",
        guidelines: "Supervise always."
    });
}
const activities = activitiesDB;
const allResources = ["playdough", "puzzles", "scissors", "paper", "beads", "string", "paint", "clay", "tweezers", "pom-poms", "blocks", "stickers", "cookie cutters", "rolling pin", "sand", "chalk", "leaves", "hole punch", "clothespins", "origami paper", "nuts and bolts", "pitcher", "cups", "tray", "sponge", "lacing cards", "markers", "glue", "safety scissors", "cardstock"];

// ========== TOAST ==========
function showToast(msg, type = "success") {
    if (typeof Toastify !== 'undefined') {
        Toastify({
            text: msg,
            duration: 2000,
            gravity: "top",
            position: "right",
            style: {
                background: type === "success" ? "#2ecc71" : type === "error" ? "#ef4444" : "#3b82f6",
                borderRadius: "50px",
                color: "#080c18",
                fontWeight: "600",
                fontSize: "0.85rem"
            }
        }).showToast();
    }
}

// ========== API ==========
async function apiCall(endpoint, method = 'POST', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': CONFIG.API_KEY
            }
        };
        if (data) options.body = JSON.stringify(data);
        const response = await fetch(`${CONFIG.API_BASE}${endpoint}`, options);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.warn('API call failed:', error);
        return null;
    }
}

async function trackToolView() {
    try {
        const result = await apiCall('/api/usage', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            tool_name: CONFIG.TOOL_NAME
        });
        if (result) updateStats(result);
    } catch (e) {}
}

async function fetchStats() {
    try {
        const result = await apiCall(`/api/stats?tool_slug=${CONFIG.TOOL_SLUG}`, 'GET');
        if (result) updateStats(result);
    } catch (e) {}
}

function updateStats(stats) {
    if (!stats) return;
    document.getElementById('heroUsage').textContent = stats.usage_count || 0;
    document.getElementById('heroViews').textContent = stats.view_count || 0;
    document.getElementById('heroShares').textContent = stats.share_count || 0;
    document.getElementById('statUsage').textContent = stats.usage_count || 0;
    document.getElementById('statShares').textContent = stats.share_count || 0;
}

async function recordShare(activityId = null) {
    const data = { tool_slug: CONFIG.TOOL_SLUG, tool_name: CONFIG.TOOL_NAME };
    if (activityId) data.activity_id = activityId;
    try {
        const result = await apiCall('/api/shares', 'POST', data);
        if (result) fetchStats();
        else fallbackShare(activityId);
    } catch (e) { fallbackShare(activityId); }
}

function fallbackShare(activityId) {
    if (activityId) {
        toolShares[activityId] = (toolShares[activityId] || 0) + 1;
        localStorage.setItem('toolShares', JSON.stringify(toolShares));
    }
    fetchStats();
}

async function recordReaction(activityId, emoji) {
    const data = { tool_slug: CONFIG.TOOL_SLUG, activity_id: activityId, reaction_type: emoji };
    try {
        const result = await apiCall('/api/reactions', 'POST', data);
        if (result) saveReactionLocal(activityId, emoji);
    } catch (e) { saveReactionLocal(activityId, emoji); }
}

function saveReactionLocal(activityId, emoji) {
    if (!reactionsData[activityId]) {
        reactionsData[activityId] = { counts: { "👍": 0, "❤️": 0, "😮": 0, "😢": 0, "😂": 0, "🎉": 0 }, userMap: {} };
    }
    const userId = localStorage.getItem('userId') || 'local_user';
    if (!reactionsData[activityId].userMap[userId]) reactionsData[activityId].userMap[userId] = [];
    if (!reactionsData[activityId].userMap[userId].includes(emoji)) {
        reactionsData[activityId].userMap[userId].push(emoji);
        reactionsData[activityId].counts[emoji] = (reactionsData[activityId].counts[emoji] || 0) + 1;
        localStorage.setItem('reactionsData', JSON.stringify(reactionsData));
    }
}

async function recordUsage(activityId) {
    const data = { tool_slug: CONFIG.TOOL_SLUG, tool_name: CONFIG.TOOL_NAME, activity_id: activityId };
    try {
        const result = await apiCall('/api/usage', 'POST', data);
        if (result) {
            usageCounts[activityId] = (usageCounts[activityId] || 0) + 1;
            localStorage.setItem('usageCounts', JSON.stringify(usageCounts));
            fetchStats();
            renderCards(currentActivitiesList);
            showToast(`✅ Used ${usageCounts[activityId]} times`);
        } else {
            usageCounts[activityId] = (usageCounts[activityId] || 0) + 1;
            localStorage.setItem('usageCounts', JSON.stringify(usageCounts));
            renderCards(currentActivitiesList);
            showToast(`✅ Used ${usageCounts[activityId]} times`);
        }
    } catch (e) {
        usageCounts[activityId] = (usageCounts[activityId] || 0) + 1;
        localStorage.setItem('usageCounts', JSON.stringify(usageCounts));
        renderCards(currentActivitiesList);
        showToast(`✅ Used ${usageCounts[activityId]} times`);
    }
}

// ========== UI ==========
function updateStatsUI() {
    document.getElementById('statFavorites').textContent = favorites.length;
    document.getElementById('statCompleted').textContent = completed.length;
    const totalUsage = Object.values(usageCounts).reduce((a, b) => a + b, 0);
    document.getElementById('statUsage').textContent = totalUsage || 0;
}

function saveAll() {
    localStorage.setItem('favs', JSON.stringify(favorites));
    localStorage.setItem('completedActs', JSON.stringify(completed));
    localStorage.setItem('usageCounts', JSON.stringify(usageCounts));
    localStorage.setItem('reactionsData', JSON.stringify(reactionsData));
    localStorage.setItem('toolShares', JSON.stringify(toolShares));
    updateStatsUI();
}

function addReaction(toolId, emoji) {
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
        localStorage.setItem('userId', userId);
    }
    if (!reactionsData[toolId]) {
        reactionsData[toolId] = { counts: { "👍": 0, "❤️": 0, "😮": 0, "😢": 0, "😂": 0, "🎉": 0 }, userMap: {} };
    }
    if (reactionsData[toolId].userMap[userId] && reactionsData[toolId].userMap[userId].includes(emoji)) {
        showToast(`⚠️ Already used ${emoji}`, 'error');
        return;
    }
    if (!reactionsData[toolId].userMap[userId]) reactionsData[toolId].userMap[userId] = [];
    reactionsData[toolId].userMap[userId].push(emoji);
    reactionsData[toolId].counts[emoji] = (reactionsData[toolId].counts[emoji] || 0) + 1;
    saveAll();
    recordReaction(toolId, emoji);
    renderCards(currentActivitiesList);
    showToast(`✅ ${emoji} added!`);
}

function handleSocialShare(platform, toolId, title) {
    const url = `${window.location.origin}${window.location.pathname}?tool=${toolId}`;
    const text = encodeURIComponent(`Check out: ${title} from Fine Motor Skills Planner!`);
    let shareUrl = '';
    switch (platform) {
        case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`; break;
        case 'twitter': shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`; break;
        case 'linkedin': shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`; break;
        case 'whatsapp': shareUrl = `https://api.whatsapp.com/send?text=${text}%20${encodeURIComponent(url)}`; break;
        case 'email': shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${text}%0A${encodeURIComponent(url)}`; break;
        default: return;
    }
    window.open(shareUrl, '_blank', 'width=600,height=500');
    recordShare(toolId);
    showToast(`✅ Shared on ${platform}!`);
}

// ========== FILTER ==========
function filterActivities() {
    const ageVal = document.getElementById('ageRange').value;
    const skillVal = document.getElementById('skillLevel').value;
    const timeVal = document.getElementById('timeReq').value;
    const typeVal = document.getElementById('activityType').value;
    const selectedResources = Array.from(document.getElementById('resourcesMulti').selectedOptions).map(opt => opt.value);

    let filtered = [...activities];
    if (ageVal !== 'all') {
        const [minA, maxA] = ageVal.split('-').map(Number);
        filtered = filtered.filter(a => {
            const [aa, ab] = a.ageRange.split('-').map(Number);
            return aa >= minA && ab <= maxA;
        });
    }
    if (skillVal !== 'all') filtered = filtered.filter(a => a.skillLevel === skillVal);
    if (timeVal !== 'all') filtered = filtered.filter(a => a.timeRequired <= parseInt(timeVal));
    if (typeVal !== 'all') filtered = filtered.filter(a => a.activityType === typeVal);
    if (selectedResources.length) {
        filtered = filtered.filter(a => selectedResources.every(res => a.resources.includes(res)));
    }
    return filtered;
}

// ========== RENDER ==========
function renderCards(acts) {
    const container = document.getElementById('resultsContainer');
    if (!container) return;

    // Update filter count
    document.getElementById('filterCount').textContent = `${acts.length} activities`;

    if (!acts || !acts.length) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔍</div>
                <h3>No Activities Found</h3>
                <p>Try adjusting your filters or click <strong>"Reset"</strong> to see all activities.</p>
                <button class="btn btn-primary" onclick="document.getElementById('resetFiltersBtn').click()">
                    <i class="fas fa-undo"></i> Reset Filters
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = acts.map(act => {
        const isFav = favorites.includes(act.id);
        const isComp = completed.includes(act.id);
        const usage = usageCounts[act.id] || 0;
        const reactCounts = reactionsData[act.id]?.counts || { "👍": 0, "❤️": 0, "😮": 0, "😢": 0, "😂": 0, "🎉": 0 };
        const shareCnt = toolShares[act.id] || 0;
        const processHTML = act.process.split('\n').map(line => `<p>${line}</p>`).join('');
        const suggestionsHTML = act.suggestions.split('\n').map(line => `<p>💡 ${line}</p>`).join('');
        const guidelinesHTML = act.guidelines.split('\n').map(line => `<p>⚠️ ${line}</p>`).join('');

        return `<div class="activity-card" data-id="${act.id}">
            <div class="card-header">
                <h3>${act.title}</h3>
                <button class="favorite-btn" data-id="${act.id}">${isFav ? '⭐' : '☆'}</button>
            </div>
            <div class="card-body">
                <p><strong>📖</strong> ${act.description}</p>
                <p><strong>✨</strong> ${act.benefits}</p>
                <div><strong>🧰</strong> ${act.resources.map(r => `<span class="resource-tag">${r}</span>`).join('')}</div>
                <div class="step-box"><strong>📋 Process</strong> ${processHTML}</div>
                <div class="step-box" style="border-left-color:#8b5cf6;"><strong>💡 Suggestions</strong> ${suggestionsHTML}</div>
                <div class="step-box" style="border-left-color:#ef4444;"><strong>⚠️ Safety</strong> ${guidelinesHTML}</div>
                <div class="complete-checkbox">
                    <input type="checkbox" id="comp-${act.id}" ${isComp ? 'checked' : ''}>
                    <label>✅ Mark Completed</label>
                    <span class="usage-badge"><i class="fas fa-chart-line"></i> ${usage} uses</span>
                </div>
                <div class="reactions-bar">
                    ${Object.entries(reactCounts).map(([emoji, cnt]) => 
                        `<button class="reaction-btn" data-emoji="${emoji}" data-id="${act.id}">${emoji} ${cnt}</button>`
                    ).join('')}
                </div>
                <div class="social-icons">
                    <i class="fab fa-facebook social-icon" data-platform="facebook" data-id="${act.id}" data-title="${act.title}"></i>
                    <i class="fab fa-twitter social-icon" data-platform="twitter" data-id="${act.id}" data-title="${act.title}"></i>
                    <i class="fab fa-linkedin social-icon" data-platform="linkedin" data-id="${act.id}" data-title="${act.title}"></i>
                    <i class="fab fa-whatsapp social-icon" data-platform="whatsapp" data-id="${act.id}" data-title="${act.title}"></i>
                    <i class="fas fa-envelope social-icon" data-platform="email" data-id="${act.id}" data-title="${act.title}"></i>
                    <span style="color:var(--text-muted);font-size:0.75rem;">🔁 ${shareCnt}</span>
                </div>
                <div class="download-section-center">
                    <button class="btn btn-primary download-btn" data-id="${act.id}" data-format="pdf"><i class="fas fa-file-pdf"></i> PDF</button>
                    <button class="btn btn-secondary download-btn" data-id="${act.id}" data-format="doc"><i class="fas fa-file-word"></i> DOC</button>
                    <button class="btn btn-outline download-btn" data-id="${act.id}" data-format="text"><i class="fas fa-save"></i> Text</button>
                </div>
                <button class="use-tool-btn" data-id="${act.id}">🛠️ Use Tool (+1)</button>
            </div>
            <div class="card-footer">
                <span>📅 ${act.ageRange} yrs</span>
                <span>⏱️ ${act.timeRequired} min</span>
                <span>⭐ ${act.skillLevel}</span>
                <span>🏠 ${act.activityType}</span>
            </div>
        </div>`;
    }).join('');

    attachEvents();
}

// ========== EVENTS ==========
function attachEvents() {
    // Favorites
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.dataset.id);
            if (favorites.includes(id)) {
                favorites = favorites.filter(f => f !== id);
                showToast('⭐ Removed', 'error');
            } else {
                favorites.push(id);
                showToast('⭐ Added!');
            }
            saveAll();
            renderCards(currentActivitiesList);
        });
    });

    // Complete
    document.querySelectorAll('.complete-checkbox input').forEach(cb => {
        cb.addEventListener('change', function() {
            const id = parseInt(this.id.split('-')[1]);
            if (this.checked) {
                if (!completed.includes(id)) completed.push(id);
                showToast('✅ Completed!');
            } else {
                completed = completed.filter(c => c !== id);
                showToast('↩️ Unmarked', 'error');
            }
            saveAll();
            renderCards(currentActivitiesList);
        });
    });

    // Reactions
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            addReaction(parseInt(this.dataset.id), this.dataset.emoji);
        });
    });

    // Social
    document.querySelectorAll('.social-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            handleSocialShare(this.dataset.platform, parseInt(this.dataset.id), this.dataset.title);
        });
    });

    // Use Tool
    document.querySelectorAll('.use-tool-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            recordUsage(parseInt(this.dataset.id));
        });
    });

    // Download
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const act = activities.find(a => a.id === parseInt(this.dataset.id));
            if (!act) return;
            const format = this.dataset.format;
            if (format === 'pdf') exportPDF(act);
            else if (format === 'doc') exportDOC(act);
            else if (format === 'text') exportText(act);
        });
    });
}

// ========== EXPORTS ==========
function exportPDF(act) {
    try {
        if (typeof window.jspdf === 'undefined') { showToast('⚠️ PDF library not loaded', 'error'); return; }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(16); doc.setTextColor(46, 204, 113); doc.text(act.title, 14, 20);
        doc.setFontSize(10); doc.setTextColor(200, 200, 200);
        doc.text(`Age: ${act.ageRange} | Skill: ${act.skillLevel} | Time: ${act.timeRequired}min`, 14, 30);
        doc.text(act.description, 14, 42);
        doc.text('Process:', 14, 54);
        let y = 62;
        act.process.split('\n').forEach(line => { doc.text(line, 18, y); y += 5; });
        doc.save(`${act.title.replace(/[^a-z0-9]/gi, '_')}.pdf`);
        showToast('✅ PDF Saved!');
    } catch (e) { showToast('⚠️ Error', 'error'); }
}

function exportDOC(act) {
    try {
        const html = `<html><head><meta charset="UTF-8"><title>${act.title}</title>
        <style>body{font-family:Arial;max-width:800px;margin:40px;background:#080c18;color:#e8edf5;}h1{color:#2ecc71;}</style>
        </head><body><h1>${act.title}</h1>
        <p><strong>Age:</strong> ${act.ageRange} | <strong>Skill:</strong> ${act.skillLevel} | <strong>Time:</strong> ${act.timeRequired}min</p>
        <h2>Description</h2><p>${act.description}</p>
        <h2>Benefits</h2><p>${act.benefits}</p>
        <h2>Process</h2><pre>${act.process}</pre>
        <h2>Suggestions</h2><pre>${act.suggestions}</pre>
        <h2>Guidelines</h2><pre>${act.guidelines}</pre>
        </body></html>`;
        const blob = new Blob([html], { type: "application/msword" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${act.title.replace(/[^a-z0-9]/gi, '_')}.doc`;
        link.click();
        showToast('✅ DOC Saved!');
    } catch (e) { showToast('⚠️ Error', 'error'); }
}

function exportText(act) {
    try {
        const content = `${act.title}\n${'='.repeat(act.title.length)}\nAge: ${act.ageRange} | Skill: ${act.skillLevel} | Time: ${act.timeRequired}min\n\nDescription: ${act.description}\n\nBenefits: ${act.benefits}\n\nProcess:\n${act.process}\n\nSuggestions:\n${act.suggestions}\n\nGuidelines:\n${act.guidelines}`;
        const blob = new Blob([content], { type: "text/plain" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${act.title.replace(/[^a-z0-9]/gi, '_')}.txt`;
        link.click();
        showToast('✅ Text Saved!');
    } catch (e) { showToast('⚠️ Error', 'error'); }
}

// ========== GENERATE & RESET ==========
function generateOnDemand() {
    const filtered = filterActivities();
    currentActivitiesList = filtered;
    renderCards(filtered);
    document.getElementById('filterFeedback').innerHTML = `✅ Generated ${filtered.length} activities`;
    if (filtered.length) {
        showToast(`✅ ${filtered.length} activities generated!`);
    } else {
        showToast('⚠️ No matches, adjust filters', 'error');
    }
}

function resetAllFilters() {
    document.getElementById('ageRange').value = 'all';
    document.getElementById('skillLevel').value = 'all';
    document.getElementById('timeReq').value = 'all';
    document.getElementById('activityType').value = 'all';
    document.getElementById('resourcesMulti').selectedIndex = -1;
    document.getElementById('filterFeedback').innerHTML = '✨ Select filters and click Generate';
    generateOnDemand();
    showToast('🔄 Reset complete');
}

function randomSuggestion() {
    const rand = activities[Math.floor(Math.random() * activities.length)];
    document.getElementById('suggestionText').textContent = `${rand.title} (${rand.ageRange})`;
    showToast(`✨ Try: ${rand.title}`);
}

// ========== TYPEWRITER ==========
function typewriterEffect() {
    const phrases = ['Skills Planner', 'Teacher Toolkit', '50+ Activities', 'Ages 1-8'];
    let phraseIndex = 0, charIndex = 0;
    const element = document.getElementById('typewriterText');
    if (!element) return;
    let isDeleting = false;

    function type() {
        const current = phrases[phraseIndex];
        if (!isDeleting) {
            element.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === current.length) { isDeleting = true; setTimeout(type, 2000); return; }
            setTimeout(type, 80);
        } else {
            element.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; setTimeout(type, 400); return; }
            setTimeout(type, 40);
        }
    }
    type();
}

// ========== POPULATE RESOURCES ==========
function populateResources() {
    const select = document.getElementById('resourcesMulti');
    if (!select) return;
    allResources.forEach(res => {
        const opt = document.createElement('option');
        opt.value = res;
        opt.textContent = res.charAt(0).toUpperCase() + res.slice(1);
        select.appendChild(opt);
    });
}

// ========== SCROLL ==========
function initScroll() {
    const up = document.getElementById('scrollUpBtn');
    const down = document.getElementById('scrollDownBtn');
    window.addEventListener('scroll', function() {
        if (up) up.style.display = window.scrollY > 200 ? 'flex' : 'none';
    });
    if (up) up.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    if (down) down.onclick = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// ========== INIT ==========
async function init() {
    console.log('🚀 Initializing Fine Motor Skills Activity Planner...');
    console.log(`📊 ${activities.length} activities loaded`);

    populateResources();
    typewriterEffect();
    initScroll();

    // Event listeners
    document.getElementById('generateBtn').addEventListener('click', generateOnDemand);
    document.getElementById('resetFiltersBtn').addEventListener('click', resetAllFilters);
    document.getElementById('randomSuggestionBtn').addEventListener('click', randomSuggestion);

    // Track view
    await trackToolView();
    await fetchStats();
    updateStatsUI();

    // Show empty state
    document.getElementById('filterFeedback').innerHTML = '✨ Select filters and click Generate';
    renderCards([]);

    console.log('✅ Ready - waiting for user to generate');
}

// ========== START ==========
document.addEventListener('DOMContentLoaded', init);
