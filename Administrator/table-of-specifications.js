/* ========================================
   TABLE OF SPECIFICATIONS - TiDB INTEGRATED
   59 Features | Full API Integration | Live Database
   ======================================== */

// ========================================
// CONFIGURATION
// ========================================
const API_BASE = '/api'; // Change to your API endpoint (e.g., https://your-api.vercel.app/api)
const TOOL_SLUG = 'table-of-specifications';

// Global State
let currentChapters = [];
let currentItems = [];
let currentRubrics = [];
let currentMarksMatrix = [];
let dbConnected = false;
let userId = null;

// Bloom Levels
const BLOOM_LEVELS = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];
const DIFFICULTY_LEVELS = ['Easy', 'Moderate', 'Hard'];

// Grade Targets
const GRADE_TARGETS = {
    1: { Remember: 50, Understand: 35, Apply: 10, Analyze: 5, Evaluate: 0, Create: 0 },
    2: { Remember: 48, Understand: 36, Apply: 11, Analyze: 5, Evaluate: 0, Create: 0 },
    3: { Remember: 45, Understand: 35, Apply: 15, Analyze: 5, Evaluate: 0, Create: 0 },
    4: { Remember: 40, Understand: 35, Apply: 18, Analyze: 6, Evaluate: 1, Create: 0 },
    5: { Remember: 38, Understand: 34, Apply: 20, Analyze: 7, Evaluate: 1, Create: 0 },
    6: { Remember: 35, Understand: 35, Apply: 20, Analyze: 8, Evaluate: 2, Create: 0 },
    7: { Remember: 30, Understand: 32, Apply: 22, Analyze: 10, Evaluate: 4, Create: 2 },
    8: { Remember: 28, Understand: 30, Apply: 24, Analyze: 11, Evaluate: 5, Create: 2 },
    9: { Remember: 18, Understand: 28, Apply: 28, Analyze: 12, Evaluate: 8, Create: 6 },
    10: { Remember: 15, Understand: 25, Apply: 30, Analyze: 14, Evaluate: 10, Create: 6 }
};

// Question Templates for Variation
const QUESTION_TEMPLATES = {
    Remember: [
        "Define {topic}.", "List the key features of {topic}.", "Identify {topic} from the description.",
        "What is {topic}?", "Name the components of {topic}.", "State the definition of {topic}.",
        "Recall the main points about {topic}.", "Mention the types of {topic}.", 
        "What are the characteristics of {topic}?", "Describe {topic} briefly."
    ],
    Understand: [
        "Explain {topic} in your own words.", "Describe how {topic} works.", "Summarize {topic}.",
        "What is the main idea behind {topic}?", "Give an example of {topic}.", 
        "Compare {topic} with another concept.", "Illustrate {topic} with a diagram.",
        "What does {topic} mean?", "Paraphrase the concept of {topic}.", "Classify different aspects of {topic}."
    ],
    Apply: [
        "How would you use {topic} to solve this problem?", "Demonstrate {topic} in a real scenario.",
        "Calculate {topic} for the given data.", "Apply {topic} to this situation.",
        "Solve this using {topic}.", "Show how {topic} can be implemented.",
        "What would happen if you applied {topic} here?", "Use {topic} to complete the task.",
        "Predict the outcome using {topic}.", "Prepare a solution using {topic}."
    ],
    Analyze: [
        "Compare and contrast {topic} with {relatedTopic}.", "What are the differences between {topic} and {relatedTopic}?",
        "Break down {topic} into its components.", "Analyze the relationship in {topic}.",
        "What patterns can you identify in {topic}?", "Examine the structure of {topic}.",
        "Differentiate between types of {topic}.", "Organize the elements of {topic}.",
        "Infer the conclusion from {topic}.", "Deconstruct {topic} to understand it better."
    ],
    Evaluate: [
        "Evaluate the effectiveness of {topic}.", "Justify why {topic} is important.", "Critique the approach to {topic}.",
        "Assess the value of {topic}.", "Defend your position on {topic}.", "Judge the quality of {topic}.",
        "What is your opinion about {topic}?", "Rank the importance of factors in {topic}.",
        "Verify the claims about {topic}.", "Determine the validity of {topic}."
    ],
    Create: [
        "Design a new approach to {topic}.", "Develop a plan to improve {topic}.", "Invent a solution for {topic}.",
        "Propose an innovative application of {topic}.", "Construct a model of {topic}.", 
        "Formulate a new theory about {topic}.", "Create a project based on {topic}.",
        "What would you design to address {topic}?", "Compose a strategy for {topic}.",
        "Imagine a new way to implement {topic}."
    ]
};

// Bloom Verbs for Classification
const BLOOM_VERBS = {
    Remember: ['define', 'list', 'state', 'recall', 'identify', 'label', 'name', 'match', 'memorize', 'enumerate'],
    Understand: ['explain', 'describe', 'summarize', 'classify', 'illustrate', 'interpret', 'paraphrase', 'discuss'],
    Apply: ['apply', 'solve', 'use', 'compute', 'calculate', 'demonstrate', 'implement', 'perform', 'execute'],
    Analyze: ['analyze', 'compare', 'contrast', 'differentiate', 'infer', 'organize', 'structure', 'examine'],
    Evaluate: ['evaluate', 'judge', 'justify', 'critique', 'assess', 'defend', 'argue', 'appraise'],
    Create: ['create', 'design', 'compose', 'develop', 'formulate', 'construct', 'plan', 'produce']
};

// Rubric Guidelines (Two-line as requested)
const RUBRIC_GUIDELINES = {
    Remember: { 
        what: "Tests basic recall of facts, terms, definitions, and basic concepts. Students must remember previously learned information.", 
        how: "Use MCQs, fill-in-blanks, matching, true/false questions. Focus on key definitions, dates, formulas, and basic terminology." 
    },
    Understand: { 
        what: "Tests comprehension of ideas and ability to explain concepts in own words without necessarily relating to other material.", 
        how: "Ask for summaries, explanations, examples, translations. Use short answer questions, concept maps, or simple descriptions." 
    },
    Apply: { 
        what: "Tests ability to use learned information in new situations, solve problems, and apply concepts practically.", 
        how: "Use problem-solving scenarios, case studies, real-world applications, numerical problems, and practical demonstrations." 
    },
    Analyze: { 
        what: "Tests ability to break down information into parts, find relationships, identify motives, and see patterns.", 
        how: "Ask for comparisons, cause-effect analysis, organization, structured responses, diagrams, and classification tasks." 
    },
    Evaluate: { 
        what: "Tests ability to make judgments based on criteria, justify opinions, critique work, and defend positions.", 
        how: "Use debates, critiques, justifications, reviews, recommendations, and opinion with evidence questions." 
    },
    Create: { 
        what: "Tests ability to produce original work, combine elements in new ways, design solutions, and innovate.", 
        how: "Ask for designs, proposals, plans, projects, inventions, compositions, and innovative solutions to complex problems." 
    }
};

const RUBRIC_LEVELS = {
    Remember: { levels: ['Excellent: 90-100% accurate', 'Good: 75-89% accurate', 'Fair: 60-74% accurate', 'Poor: Below 60%'], criteria: ['Accuracy', 'Completeness', 'Clarity'] },
    Understand: { levels: ['Excellent: Clear, thorough', 'Good: Mostly clear', 'Fair: Basic understanding', 'Poor: Misunderstood'], criteria: ['Explanation', 'Examples', 'Organization'] },
    Apply: { levels: ['Excellent: Correct application', 'Good: Minor errors', 'Fair: Some errors', 'Poor: Incorrect'], criteria: ['Application', 'Procedure', 'Accuracy'] },
    Analyze: { levels: ['Excellent: Thorough analysis', 'Good: Good analysis', 'Fair: Basic analysis', 'Poor: No analysis'], criteria: ['Breakdown', 'Relationships', 'Insight'] },
    Evaluate: { levels: ['Excellent: Strong evaluation', 'Good: Reasonable', 'Fair: Weak', 'Poor: No evaluation'], criteria: ['Criteria', 'Judgment', 'Support'] },
    Create: { levels: ['Excellent: Highly original', 'Good: Original', 'Fair: Somewhat original', 'Poor: Not original'], criteria: ['Originality', 'Feasibility', 'Presentation'] }
};

// ========================================
// HELPER FUNCTIONS
// ========================================

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i> ${message}`;
    const container = document.getElementById('toastContainer');
    if (container) {
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

function showLoading(show) {
    const modal = document.getElementById('loadingModal');
    if (modal) modal.style.display = show ? 'flex' : 'none';
}

function getUserId() {
    if (userId) return userId;
    userId = localStorage.getItem('userId');
    if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('userId', userId);
    }
    return userId;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========================================
// TIDB API CALLS (Fully Integrated)
// ========================================

async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: { 
                'Content-Type': 'application/json',
                'X-User-Id': getUserId()
            }
        };
        if (data) options.body = JSON.stringify(data);
        
        const url = `${API_BASE}${endpoint}`;
        console.log(`API Call: ${method} ${url}`, data);
        
        const response = await fetch(url, options);
        const result = await response.json();
        
        if (!response.ok) {
            console.error('API Error:', result);
            return { success: false, error: result.error || 'API Error' };
        }
        
        return result;
    } catch (error) {
        console.error('Network Error:', error);
        return { success: false, error: error.message, offline: true };
    }
}

// Health Check
async function checkDatabaseHealth() {
    const result = await apiCall('/health', 'GET');
    dbConnected = result.success && result.database === 'connected';
    
    // Update DB status indicator
    let dbIndicator = document.getElementById('dbStatusIndicator');
    if (!dbIndicator) {
        dbIndicator = document.createElement('div');
        dbIndicator.id = 'dbStatusIndicator';
        dbIndicator.className = 'db-status';
        document.body.appendChild(dbIndicator);
    }
    
    if (dbConnected) {
        dbIndicator.className = 'db-status online';
        dbIndicator.innerHTML = '<i class="fas fa-database"></i> TiDB Connected';
    } else {
        dbIndicator.className = 'db-status offline';
        dbIndicator.innerHTML = '<i class="fas fa-database"></i> Offline Mode (Local)';
    }
    
    return dbConnected;
}

// Usage Counter Endpoints
async function incrementUsage() {
    const result = await apiCall(`/${TOOL_SLUG}/usage`, 'POST', {
        tool_slug: TOOL_SLUG,
        user_id: getUserId(),
        session_id: getUserId()
    });
    
    if (result.success) {
        const usageElem = document.getElementById('usageCount');
        if (usageElem) usageElem.textContent = result.total_usage || result.count;
        
        const globalElem = document.getElementById('globalUsageCount');
        if (globalElem && result.total_usage) globalElem.textContent = result.total_usage;
    } else if (result.offline) {
        // Fallback to localStorage if API is offline
        let count = parseInt(localStorage.getItem(`${TOOL_SLUG}_usage`) || '0') + 1;
        localStorage.setItem(`${TOOL_SLUG}_usage`, count);
        const usageElem = document.getElementById('usageCount');
        if (usageElem) usageElem.textContent = count;
    }
    
    return result;
}

async function getUsage() {
    const result = await apiCall(`/${TOOL_SLUG}/usage`, 'GET');
    
    if (result.success) {
        const usageElem = document.getElementById('usageCount');
        if (usageElem) usageElem.textContent = result.count;
    } else if (result.offline) {
        const count = parseInt(localStorage.getItem(`${TOOL_SLUG}_usage`) || '0');
        const usageElem = document.getElementById('usageCount');
        if (usageElem) usageElem.textContent = count;
    }
    
    return result;
}

// Reactions Endpoints
async function addReaction(emoji) {
    const reactionMap = { '👍': 'like', '❤️': 'love', '😮': 'wow', '😢': 'sad', '😠': 'angry', '😂': 'laugh', '🎉': 'celebrate' };
    const reactionType = reactionMap[emoji];
    
    const result = await apiCall(`/${TOOL_SLUG}/reactions`, 'POST', {
        tool_slug: TOOL_SLUG,
        emoji: emoji,
        reaction_type: reactionType,
        user_id: getUserId(),
        session_id: getUserId()
    });
    
    if (result.success) {
        await getReactions();
        showToast(`Added ${emoji} reaction!`);
    } else if (result.already_reacted) {
        showToast('You already reacted with this emoji!', 'warning');
    } else if (result.offline) {
        // Fallback to localStorage
        const reactions = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_reactions`) || '{}');
        const key = `${emoji}_${getUserId()}`;
        if (!reactions[key]) {
            reactions[key] = true;
            localStorage.setItem(`${TOOL_SLUG}_reactions`, JSON.stringify(reactions));
            await getReactions();
            showToast(`Added ${emoji} reaction! (Offline Mode)`);
        } else {
            showToast('You already reacted with this emoji!', 'warning');
        }
    }
    
    return result;
}

async function getReactions() {
    const result = await apiCall(`/${TOOL_SLUG}/reactions`, 'GET');
    
    if (result.success && result.reactions) {
        const reactionMap = { 'like': '👍', 'love': '❤️', 'wow': '😮', 'sad': '😢', 'angry': '😠', 'laugh': '😂', 'celebrate': '🎉' };
        
        Object.entries(reactionMap).forEach(([type, emoji]) => {
            const count = result.reactions[type] || 0;
            const btn = document.querySelector(`.reaction-btn[data-reaction="${emoji}"]`);
            if (btn) {
                const countSpan = btn.querySelector('.reaction-count');
                if (countSpan) countSpan.textContent = count;
            }
        });
        
        // Update total reactions in hero
        const totalReactions = Object.values(result.reactions).reduce((a, b) => a + b, 0);
        const globalReactionElem = document.getElementById('globalReactionCount');
        if (globalReactionElem) globalReactionElem.textContent = totalReactions;
        
    } else if (result.offline) {
        // Fallback to localStorage
        const reactions = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_reactions`) || '{}');
        const counts = { like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0 };
        const emojiMap = { '👍': 'like', '❤️': 'love', '😮': 'wow', '😢': 'sad', '😠': 'angry', '😂': 'laugh', '🎉': 'celebrate' };
        
        Object.keys(reactions).forEach(key => {
            const emoji = key.split('_')[0];
            const type = emojiMap[emoji];
            if (type && counts[type] !== undefined) counts[type]++;
        });
        
        Object.entries(emojiMap).forEach(([emoji, type]) => {
            const btn = document.querySelector(`.reaction-btn[data-reaction="${emoji}"]`);
            if (btn) {
                const countSpan = btn.querySelector('.reaction-count');
                if (countSpan) countSpan.textContent = counts[type];
            }
        });
    }
    
    return result;
}

// Shares Endpoints
async function addShare(platform) {
    const result = await apiCall(`/${TOOL_SLUG}/shares`, 'POST', {
        tool_slug: TOOL_SLUG,
        platform: platform,
        user_id: getUserId()
    });
    
    if (result.success) {
        await getShares();
        showToast(`Shared on ${platform}!`);
    } else if (result.offline) {
        let shares = parseInt(localStorage.getItem(`${TOOL_SLUG}_shares`) || '0') + 1;
        localStorage.setItem(`${TOOL_SLUG}_shares`, shares);
        const sharesElem = document.getElementById('totalSharesCount');
        if (sharesElem) sharesElem.textContent = shares;
        showToast(`Shared on ${platform}! (Offline Mode)`);
    }
    
    return result;
}

async function getShares() {
    const result = await apiCall(`/${TOOL_SLUG}/shares`, 'GET');
    
    if (result.success) {
        const sharesElem = document.getElementById('totalSharesCount');
        if (sharesElem) sharesElem.textContent = result.shares || 0;
    } else if (result.offline) {
        const shares = parseInt(localStorage.getItem(`${TOOL_SLUG}_shares`) || '0');
        const sharesElem = document.getElementById('totalSharesCount');
        if (sharesElem) sharesElem.textContent = shares;
    }
    
    return result;
}

// Stats Endpoint
async function getStats() {
    const result = await apiCall(`/${TOOL_SLUG}/stats`, 'GET');
    
    if (result.success) {
        const usageElem = document.getElementById('usageCount');
        if (usageElem) usageElem.textContent = result.totalUsage || 0;
        
        const sharesElem = document.getElementById('totalSharesCount');
        if (sharesElem) sharesElem.textContent = result.totalShares || 0;
        
        const usersElem = document.getElementById('uniqueUsersCount');
        if (usersElem) usersElem.textContent = result.uniqueUsers || 0;
        
        const globalElem = document.getElementById('globalUsageCount');
        if (globalElem) globalElem.textContent = result.totalUsage || 0;
    }
    
    return result;
}

// ========================================
// BLOOM CLASSIFICATION
// ========================================

function classifyBloom(text) {
    const lowerText = text.toLowerCase();
    let scores = {};
    
    for (const [level, verbs] of Object.entries(BLOOM_VERBS)) {
        scores[level] = 0;
        for (const verb of verbs) {
            if (lowerText.includes(verb)) scores[level]++;
        }
    }
    
    let maxLevel = 'Understand';
    let maxScore = 0;
    for (const [level, score] of Object.entries(scores)) {
        if (score > maxScore) {
            maxScore = score;
            maxLevel = level;
        }
    }
    return maxLevel;
}

// ========================================
// CONTENT PARSING
// ========================================

function parseContent(text) {
    const lines = text.split('\n');
    const chapters = [];
    let currentChapter = null;
    let currentTopic = null;
    
    for (let line of lines) {
        line = line.trim();
        if (!line) continue;
        
        if (line.toLowerCase().startsWith('chapter:') || line.toLowerCase().startsWith('chapter ')) {
            const chapterName = line.replace(/^chapter\s*[:-\s]*/i, '');
            currentChapter = { name: chapterName, topics: [] };
            chapters.push(currentChapter);
            currentTopic = null;
        }
        else if (line.startsWith('-') || line.startsWith('•') || line.toLowerCase().startsWith('topic:')) {
            const topicName = line.replace(/^[-•]\s*|^topic\s*[:-\s]*/i, '');
            if (currentChapter) {
                currentTopic = { name: topicName, subtopics: [] };
                currentChapter.topics.push(currentTopic);
            }
        }
        else if (line.startsWith('>') || line.startsWith('→') || line.startsWith('•')) {
            const subtopicText = line.replace(/^[>→•]\s*/, '');
            if (currentTopic) {
                currentTopic.subtopics.push({ text: subtopicText, bloom: classifyBloom(subtopicText) });
            } else if (currentChapter) {
                currentTopic = { name: 'General', subtopics: [{ text: subtopicText, bloom: classifyBloom(subtopicText) }] };
                currentChapter.topics.push(currentTopic);
            }
        }
        else if (currentChapter && currentTopic) {
            currentTopic.subtopics.push({ text: line, bloom: classifyBloom(line) });
        }
    }
    
    chapters.forEach(ch => {
        if (ch.topics.length === 0) {
            ch.topics.push({ name: 'General', subtopics: [{ text: ch.name, bloom: 'Understand' }] });
        }
    });
    
    return chapters;
}

// ========================================
// ALLOCATION FUNCTIONS
// ========================================

function getBloomTargets() {
    const inputs = document.querySelectorAll('.bloom-input');
    let total = Array.from(inputs).reduce((sum, inp) => sum + (parseInt(inp.value) || 0), 0);
    if (total === 0) total = 100;
    const targets = {};
    inputs.forEach(inp => { targets[inp.dataset.bloom] = (parseInt(inp.value) || 0) / total; });
    return targets;
}

function allocateMarks(chapters, totalMarks, bloomTargets) {
    const weights = chapters.map(ch => ch.topics.reduce((sum, t) => sum + (t.subtopics.length || 1), 0));
    const totalWeight = weights.reduce((a, b) => a + b, 1);
    const marksMatrix = chapters.map(() => Array(BLOOM_LEVELS.length).fill(0));
    
    for (let ci = 0; ci < chapters.length; ci++) {
        for (let bi = 0; bi < BLOOM_LEVELS.length; bi++) {
            const weightRatio = weights[ci] / totalWeight;
            const bloomRatio = bloomTargets[BLOOM_LEVELS[bi]] || 0;
            marksMatrix[ci][bi] = Math.round(totalMarks * weightRatio * bloomRatio);
        }
    }
    
    let currentTotal = marksMatrix.flat().reduce((a, b) => a + b, 0);
    let diff = totalMarks - currentTotal;
    
    for (let ci = 0; ci < chapters.length && diff !== 0; ci++) {
        for (let bi = 0; bi < BLOOM_LEVELS.length && diff !== 0; bi++) {
            if (diff > 0) { marksMatrix[ci][bi]++; diff--; }
            else if (diff < 0 && marksMatrix[ci][bi] > 0) { marksMatrix[ci][bi]--; diff++; }
        }
    }
    return marksMatrix;
}

function generateItems(marksMatrix, chapters) {
    const items = [];
    let itemId = 1;
    
    for (let ci = 0; ci < chapters.length; ci++) {
        const chapter = chapters[ci];
        const topics = chapter.topics;
        
        for (let bi = 0; bi < BLOOM_LEVELS.length; bi++) {
            const marks = marksMatrix[ci][bi];
            const bloomLevel = BLOOM_LEVELS[bi];
            if (marks === 0) continue;
            
            const availableSubtopics = topics.flatMap(t => 
                t.subtopics.map(st => ({ text: st.text, topic: t.name, bloom: st.bloom }))
            );
            const targetSubtopics = availableSubtopics.filter(st => st.bloom === bloomLevel);
            const targetTopic = targetSubtopics.length > 0 ? 
                targetSubtopics[Math.floor(Math.random() * targetSubtopics.length)] : 
                (availableSubtopics.length > 0 ? 
                    availableSubtopics[Math.floor(Math.random() * availableSubtopics.length)] : 
                    { text: chapter.name, topic: topics[0]?.name || chapter.name, bloom: bloomLevel });
            
            const templates = QUESTION_TEMPLATES[bloomLevel] || QUESTION_TEMPLATES.Understand;
            const template = templates[Math.floor(Math.random() * templates.length)];
            
            let relatedTopic = '';
            if (template.includes('{relatedTopic}')) {
                const otherTopics = topics.filter(t => t.name !== targetTopic.topic);
                if (otherTopics.length > 0) {
                    relatedTopic = otherTopics[Math.floor(Math.random() * otherTopics.length)].name;
                } else {
                    relatedTopic = 'another concept';
                }
            }
            
            let questionText = template
                .replace('{topic}', targetTopic.topic || chapter.name)
                .replace('{relatedTopic}', relatedTopic);
            
            let remainingMarks = marks;
            
            // Remember/Understand: MCQ style (1 mark)
            if ((bloomLevel === 'Remember' || bloomLevel === 'Understand') && remainingMarks >= 1) {
                const count = Math.min(remainingMarks, 15);
                for (let i = 0; i < count; i++) {
                    items.push({
                        id: itemId++, chapter: chapter.name, topic: targetTopic.topic,
                        bloom: bloomLevel, type: 'MCQ', marks: 1,
                        question: questionText + (i > 0 ? ` (Variant ${i+1})` : ''),
                        difficulty: 'Easy'
                    });
                }
                remainingMarks -= count;
            }
            
            // Apply/Analyze: Short questions (2-3 marks)
            if ((bloomLevel === 'Apply' || bloomLevel === 'Analyze') && remainingMarks >= 2) {
                const count = Math.min(Math.floor(remainingMarks / 2), 5);
                for (let i = 0; i < count; i++) {
                    items.push({
                        id: itemId++, chapter: chapter.name, topic: targetTopic.topic,
                        bloom: bloomLevel, type: 'Short', marks: 2,
                        question: questionText + ' (Explain briefly)',
                        difficulty: 'Moderate'
                    });
                }
                remainingMarks -= count * 2;
            }
            
            // Evaluate/Create: Essay type (5-10 marks)
            if ((bloomLevel === 'Evaluate' || bloomLevel === 'Create') && remainingMarks >= 5) {
                const markValue = remainingMarks >= 10 ? 10 : remainingMarks >= 5 ? 5 : remainingMarks;
                items.push({
                    id: itemId++, chapter: chapter.name, topic: targetTopic.topic,
                    bloom: bloomLevel, type: markValue >= 10 ? 'Extended' : 'Structured',
                    marks: markValue,
                    question: questionText + ' (Provide detailed answer with examples)',
                    difficulty: 'Hard'
                });
            }
        }
    }
    return items;
}

function generateRubricsFromItems(items) {
    const rubricsByBloom = {};
    items.forEach(item => {
        if (!rubricsByBloom[item.bloom]) rubricsByBloom[item.bloom] = [];
        rubricsByBloom[item.bloom].push(item);
    });
    
    return Object.entries(rubricsByBloom).map(([bloom, bloomItems]) => ({
        bloom: bloom,
        count: bloomItems.length,
        marks: bloomItems.reduce((sum, i) => sum + i.marks, 0),
        guidelines: RUBRIC_GUIDELINES[bloom] || RUBRIC_GUIDELINES.Understand,
        levels: RUBRIC_LEVELS[bloom]?.levels || RUBRIC_LEVELS.Understand.levels,
        criteria: RUBRIC_LEVELS[bloom]?.criteria || RUBRIC_LEVELS.Understand.criteria
    }));
}

// ========================================
// RENDER FUNCTIONS
// ========================================

function renderTOSMatrix(chapters, marksMatrix, items) {
    const container = document.getElementById('tosMatrix');
    if (!container) return;
    
    const colTotals = Array(BLOOM_LEVELS.length).fill(0);
    const rowTotals = marksMatrix.map(row => {
        const sum = row.reduce((a, b) => a + b, 0);
        row.forEach((val, idx) => { colTotals[idx] += val; });
        return sum;
    });
    const totalMarks = rowTotals.reduce((a, b) => a + b, 0);
    
    let html = '<table><thead><tr><th>Chapter / Topic</th>';
    BLOOM_LEVELS.forEach(bloom => {
        const pct = totalMarks > 0 ? Math.round((colTotals[BLOOM_LEVELS.indexOf(bloom)] / totalMarks) * 100) : 0;
        html += `<th>${bloom}<br><small>(${pct}%)</small></th>`;
    });
    html += '<th>Total</th><th>%</th></tr></thead><tbody>';
    
    for (let ci = 0; ci < chapters.length; ci++) {
        const chapter = chapters[ci];
        const rowMarks = marksMatrix[ci];
        const rowTotal = rowTotals[ci];
        const percentage = totalMarks > 0 ? Math.round((rowTotal / totalMarks) * 100) : 0;
        
        html += `<tr style="background: var(--gray-50)"><td><strong>${escapeHtml(chapter.name)}</strong></td>`;
        rowMarks.forEach(marks => { html += `<td>${marks}</td>`; });
        html += `<td><strong>${rowTotal}</strong></td><td>${percentage}%</td></tr>`;
        
        for (const topic of chapter.topics) {
            html += `<tr><td style="padding-left: 20px;">└ ${escapeHtml(topic.name)}</td>`;
            const topicMarks = BLOOM_LEVELS.map((bloom, bi) => {
                const subtopicsWithBloom = topic.subtopics.filter(st => st.bloom === bloom);
                return subtopicsWithBloom.length * (bloom === 'Remember' || bloom === 'Understand' ? 1 : bloom === 'Apply' || bloom === 'Analyze' ? 2 : 4);
            });
            topicMarks.forEach(marks => { html += `<td>${marks || '-'}</td>`; });
            const topicTotal = topicMarks.reduce((a, b) => a + b, 0);
            html += `<td>${topicTotal}</td><td>${totalMarks > 0 ? Math.round((topicTotal / totalMarks) * 100) : 0}%</td></tr>`;
        }
    }
    
    html += `<tr style="background: var(--primary-bg); font-weight: bold;"><td>TOTAL</th>`;
    colTotals.forEach(total => { html += `<th>${total}</th>`; });
    html += `<th>${totalMarks}</th><th>100%</th>`;
    html += '</tbody><table>';
    container.innerHTML = html;
    
    const infoBar = document.getElementById('tosInfo');
    if (infoBar && items.length) {
        const byType = items.reduce((acc, i) => { acc[i.type] = (acc[i.type] || 0) + 1; return acc; }, {});
        const byDifficulty = items.reduce((acc, i) => { acc[i.difficulty] = (acc[i.difficulty] || 0) + 1; return acc; }, {});
        infoBar.innerHTML = `
            <span class="badge"><i class="fas fa-list"></i> ${items.length} Questions</span>
            <span class="badge"><i class="fas fa-star"></i> ${totalMarks} Marks</span>
            <span class="badge"><i class="fas fa-clock"></i> MCQ: ${byType.MCQ || 0} | Short: ${byType.Short || 0} | Structured: ${byType.Structured || 0} | Essay: ${byType.Extended || 0}</span>
            <span class="badge"><i class="fas fa-chart-line"></i> Easy: ${byDifficulty.Easy || 0} | Moderate: ${byDifficulty.Moderate || 0} | Hard: ${byDifficulty.Hard || 0}</span>
            <span class="badge"><i class="fas fa-database"></i> ${dbConnected ? 'Live DB' : 'Local Mode'}</span>
        `;
    }
}

function renderItemsBlueprint(items) {
    const container = document.getElementById('itemsBlueprint');
    if (!container) return;
    
    if (items.length === 0) {
        container.innerHTML = '<div class="placeholder"><i class="fas fa-clipboard-list"></i><p>No items generated yet. Click "Generate ToS" to start.</p></div>';
        return;
    }
    
    let html = '</table><thead><tr><th>#</th><th>Chapter</th><th>Topic</th><th>Bloom Level</th><th>Type</th><th>Marks</th><th>Difficulty</th><th>Question</th></tr></thead><tbody>';
    
    items.forEach((item, idx) => {
        const diffClass = item.difficulty === 'Easy' ? 'difficulty-easy' : (item.difficulty === 'Moderate' ? 'difficulty-moderate' : 'difficulty-hard');
        html += `<tr>
            <td>${idx + 1}</td>
            <td>${escapeHtml(item.chapter)}</td>
            <td>${escapeHtml(item.topic)}</td>
            <td><span class="badge" style="background: var(--primary-bg);">${item.bloom}</span></td>
            <td>${item.type}</td>
            <td>${item.marks}</td>
            <td><span class="${diffClass}">${item.difficulty}</span></td>
            <td style="text-align:left; max-width:300px;">${escapeHtml(item.question)}</td>
        </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

function renderRubrics(rubrics) {
    const container = document.getElementById('rubricsContent');
    if (!container) return;
    
    if (rubrics.length === 0) {
        container.innerHTML = '<div class="placeholder"><i class="fas fa-star"></i><p>Generate ToS to see assessment rubrics.</p></div>';
        return;
    }
    
    let html = '';
    for (const rubric of rubrics) {
        html += `
            <div class="rubric-card">
                <h4><i class="fas fa-chart-line"></i> ${rubric.bloom} Level (${rubric.count} questions, ${rubric.marks} marks)</h4>
                <div class="rubric-guidelines">
                    <div><i class="fas fa-info-circle"></i> <strong>What it means:</strong> ${rubric.guidelines.what}</div>
                    <div style="margin-top: 5px;"><i class="fas fa-lightbulb"></i> <strong>What to do:</strong> ${rubric.guidelines.how}</div>
                </div>
                <p><strong>Criteria:</strong> ${rubric.criteria.join(', ')}</p>
                <div class="rubric-levels">
                    ${rubric.levels.map(level => `<div class="rubric-level"><strong>${level.split(':')[0]}</strong><small>${level.split(':')[1] || ''}</small></div>`).join('')}
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

function showCoverageMessage(message, isWarning = false) {
    const card = document.getElementById('coverageCard');
    const msgSpan = document.getElementById('coverageMessage');
    if (card && msgSpan) {
        card.style.display = 'flex';
        card.style.background = isWarning ? 'var(--warning)' : 'var(--success)';
        msgSpan.textContent = message;
        setTimeout(() => {
            card.style.opacity = '0';
            setTimeout(() => {
                card.style.display = 'none';
                card.style.opacity = '1';
            }, 500);
        }, 4000);
    }
}

// ========================================
// EXPORT FUNCTIONS
// ========================================

function exportToCSV(table, filename) {
    if (!table) return;
    const rows = table.querySelectorAll('tr');
    const csv = Array.from(rows).map(row => 
        Array.from(row.querySelectorAll('th, td')).map(cell => `"${cell.textContent.replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    downloadFile(csv, filename, 'text/csv');
}

function exportToTXT(element, filename, title) {
    if (!element) return;
    let text = title + '\n' + '='.repeat(60) + '\n\n';
    if (element.tagName === 'TABLE') {
        const rows = element.querySelectorAll('tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('th, td');
            const rowText = Array.from(cells).map(cell => cell.textContent.trim()).join(' | ');
            text += rowText + '\n';
            text += '-'.repeat(60) + '\n';
        });
    } else {
        text += element.innerText;
    }
    downloadFile(text, filename, 'text/plain');
}

function exportToDOC(content, filename) {
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${filename}</title><style>body{font-family:Arial,sans-serif;margin:40px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:8px}th{background:#f0f0f0}</style></head><body>${content}</body></html>`;
    downloadFile(html, filename, 'application/msword');
}

async function exportToPDF(element, filename) {
    if (typeof html2pdf === 'undefined') {
        showToast('PDF export library loading... Please try again.', 'warning');
        return;
    }
    const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, letterRendering: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
    };
    try {
        await html2pdf().set(opt).from(element).save();
        showToast('PDF exported successfully!');
    } catch (error) {
        showToast('Error exporting PDF: ' + error.message, 'error');
    }
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast(`Downloaded ${filename}`);
}

// ========================================
// MAIN GENERATION FUNCTION
// ========================================

async function generateToS() {
    const contentInput = document.getElementById('contentInput');
    const content = contentInput ? contentInput.value.trim() : '';
    
    if (!content) {
        showToast('Please enter content or upload a PDF', 'error');
        return;
    }
    
    showLoading(true);
    
    try {
        const chapters = parseContent(content);
        if (chapters.length === 0) {
            showToast('No valid chapters found.', 'error');
            showLoading(false);
            return;
        }
        
        currentChapters = chapters;
        const totalMarksElem = document.getElementById('totalMarks');
        const totalMarks = totalMarksElem ? parseInt(totalMarksElem.value) || 50 : 50;
        const bloomTargets = getBloomTargets();
        const marksMatrix = allocateMarks(chapters, totalMarks, bloomTargets);
        currentMarksMatrix = marksMatrix;
        const items = generateItems(marksMatrix, chapters);
        currentItems = items;
        const rubrics = generateRubricsFromItems(items);
        currentRubrics = rubrics;
        
        renderTOSMatrix(chapters, marksMatrix, items);
        renderItemsBlueprint(items);
        renderRubrics(rubrics);
        
        // Increment usage in TiDB
        await incrementUsage();
        
        showToast(`ToS Generated! ${items.length} questions created. Data saved to TiDB.`, 'success');
        showCoverageMessage(`✓ Successfully generated ${items.length} questions covering ${chapters.length} chapters | Synced with Cloud Database`);
    } catch (error) {
        console.error('Generation error:', error);
        showToast('Error generating ToS: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// ========================================
// INITIALIZATION
// ========================================

function initBloomSliders() {
    const gradeSelect = document.getElementById('gradeSelect');
    const bloomSliders = document.getElementById('bloomSliders');
    const diffSliders = document.getElementById('diffSliders');
    
    if (!gradeSelect || !bloomSliders || !diffSliders) return;
    
    const grade = parseInt(gradeSelect.value);
    const targets = GRADE_TARGETS[grade] || GRADE_TARGETS[9];
    
    bloomSliders.innerHTML = BLOOM_LEVELS.map(bloom => `
        <div class="slider-item">
            <label>${bloom}</label>
            <input type="range" class="bloom-input" data-bloom="${bloom}" min="0" max="100" value="${targets[bloom]}" onchange="window.normalizeBloom()">
            <input type="number" class="bloom-number" data-bloom="${bloom}" value="${targets[bloom]}" style="width:60px;font-size:0.7rem;text-align:center" onchange="window.normalizeBloom()">
        </div>
    `).join('');
    
    diffSliders.innerHTML = DIFFICULTY_LEVELS.map(diff => `
        <div class="slider-item">
            <label>${diff}</label>
            <input type="range" class="diff-input" data-diff="${diff}" min="0" max="100" value="${diff === 'Easy' ? 40 : diff === 'Moderate' ? 40 : 20}" onchange="window.normalizeDiff()">
            <input type="number" class="diff-number" data-diff="${diff}" value="${diff === 'Easy' ? 40 : diff === 'Moderate' ? 40 : 20}" style="width:60px;font-size:0.7rem;text-align:center" onchange="window.normalizeDiff()">
        </div>
    `).join('');
}

window.normalizeBloom = function() {
    const inputs = document.querySelectorAll('.bloom-input');
    let total = Array.from(inputs).reduce((sum, inp) => sum + (parseInt(inp.value) || 0), 0);
    if (total === 0) total = 100;
    inputs.forEach(inp => {
        const percent = Math.round((parseInt(inp.value) || 0) * 100 / total);
        inp.value = percent;
        const numInput = document.querySelector(`.bloom-number[data-bloom="${inp.dataset.bloom}"]`);
        if (numInput) numInput.value = percent;
    });
};

window.normalizeDiff = function() {
    const inputs = document.querySelectorAll('.diff-input');
    let total = Array.from(inputs).reduce((sum, inp) => sum + (parseInt(inp.value) || 0), 0);
    if (total === 0) total = 100;
    inputs.forEach(inp => {
        const percent = Math.round((parseInt(inp.value) || 0) * 100 / total);
        inp.value = percent;
        const numInput = document.querySelector(`.diff-number[data-diff="${inp.dataset.diff}"]`);
        if (numInput) numInput.value = percent;
    });
};

// ========================================
// EVENT LISTENERS
// ========================================

function initEventListeners() {
    // Scroll buttons
    const scrollToTool = document.getElementById('scrollToToolBtn');
    const scrollUp = document.getElementById('scrollUpBtn');
    const scrollDown = document.getElementById('scrollDownBtn');
    const toolContainer = document.getElementById('toolContainer');
    const refreshStatsBtn = document.getElementById('refreshStatsBtn');
    
    if (scrollToTool && toolContainer) {
        scrollToTool.addEventListener('click', () => toolContainer.scrollIntoView({ behavior: 'smooth' }));
    }
    if (scrollUp) {
        scrollUp.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
    if (scrollDown) {
        scrollDown.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
    }
    if (refreshStatsBtn) {
        refreshStatsBtn.addEventListener('click', async () => {
            await getStats();
            await getReactions();
            await getShares();
            showToast('Stats refreshed from TiDB!', 'success');
        });
    }
    
    // Dark mode toggle
    const darkToggle = document.getElementById('darkModeToggle');
    if (darkToggle) {
        darkToggle.addEventListener('click', () => {
            const isDark = document.body.getAttribute('data-theme') === 'dark';
            document.body.setAttribute('data-theme', isDark ? '' : 'dark');
            localStorage.setItem('darkMode', !isDark);
            darkToggle.innerHTML = !isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            showToast(!isDark ? 'Dark mode enabled' : 'Light mode enabled');
        });
    }
    
    // PDF Upload
    const uploadArea = document.getElementById('pdfUploadArea');
    const pdfInput = document.getElementById('pdfFileInput');
    const contentInput = document.getElementById('contentInput');
    
    if (uploadArea && pdfInput) {
        uploadArea.addEventListener('click', () => pdfInput.click());
        pdfInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file && file.type === 'application/pdf') {
                showLoading(true);
                try {
                    const arrayBuffer = await file.arrayBuffer();
                    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                    let fullText = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        fullText += textContent.items.map(item => item.str).join(' ') + '\n';
                    }
                    if (contentInput) contentInput.value = fullText;
                    showToast('PDF extracted successfully!', 'success');
                } catch (error) {
                    showToast('Error reading PDF: ' + error.message, 'error');
                } finally {
                    showLoading(false);
                }
            } else if (file && file.type === 'text/plain') {
                const text = await file.text();
                if (contentInput) contentInput.value = text;
                showToast('Text file loaded!', 'success');
            }
        });
    }
    
    // Generate button
    const generateBtn = document.getElementById('parseContentBtn');
    if (generateBtn) generateBtn.addEventListener('click', generateToS);
    
    // Load example
    const exampleBtn = document.getElementById('loadExampleBtn');
    if (exampleBtn && contentInput) {
        exampleBtn.addEventListener('click', () => {
            contentInput.value = `Chapter: Cell Biology\n- Topic: Cell Organelles\n> Identify nucleus, mitochondria and chloroplasts\n> Explain the function of ribosomes\n- Topic: Cell Membrane\n> Describe diffusion and osmosis with examples\n> Compare passive vs active transport\n\nChapter: Photosynthesis\n- Topic: Light Reactions\n> Differentiate photosystems I and II\n> Justify the role of chlorophyll in light absorption\n\nChapter: Human Body Systems\n- Topic: Circulatory System\n> Solve simple pulse-rate problems\n> Evaluate lifestyle choices affecting heart health`;
            showToast('Example content loaded!', 'success');
        });
    }
    
    // Grade change
    const gradeSelect = document.getElementById('gradeSelect');
    if (gradeSelect) gradeSelect.addEventListener('change', initBloomSliders);
    
    // Reactions
    const reactionsBar = document.getElementById('reactionsBar');
    if (reactionsBar) {
        reactionsBar.querySelectorAll('.reaction-btn').forEach(btn => {
            btn.addEventListener('click', () => addReaction(btn.dataset.reaction));
        });
    }
    
    // Social Share
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=Check%20out%20this%20Table%20of%20Specifications%20tool!`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(window.location.href)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
        email: `mailto:?subject=Table%20of%20Specifications%20Tool&body=${encodeURIComponent(window.location.href)}`
    };
    
    document.querySelectorAll('.share-btn[data-platform]').forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.dataset.platform;
            if (shareUrls[platform]) {
                window.open(shareUrls[platform], '_blank', 'width=600,height=400');
                addShare(platform);
            }
        });
    });
    
    const copyBtn = document.getElementById('copyUrlBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href);
            showToast('URL copied to clipboard!', 'success');
            addShare('copy');
        });
    }
    
    // Export buttons for ToS
    const tosMatrix = document.getElementById('tosMatrix');
    if (document.getElementById('exportTosCsvBtn')) {
        document.getElementById('exportTosCsvBtn').addEventListener('click', () => {
            const table = tosMatrix?.querySelector('table');
            if (table) exportToCSV(table, 'tos_matrix.csv');
        });
    }
    if (document.getElementById('exportTosExcelBtn')) {
        document.getElementById('exportTosExcelBtn').addEventListener('click', () => {
            const table = tosMatrix?.querySelector('table');
            if (table && typeof XLSX !== 'undefined') {
                const ws = XLSX.utils.table_to_sheet(table);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'ToS_Matrix');
                XLSX.writeFile(wb, 'tos_matrix.xlsx');
                showToast('Excel exported!');
            } else if (table) {
                exportToCSV(table, 'tos_matrix.csv');
                showToast('Excel not available, CSV exported instead');
            }
        });
    }
    if (document.getElementById('exportTosTxtBtn')) {
        document.getElementById('exportTosTxtBtn').addEventListener('click', () => {
            const table = tosMatrix?.querySelector('table');
            if (table) exportToTXT(table, 'tos_matrix.txt', 'TABLE OF SPECIFICATIONS');
        });
    }
    if (document.getElementById('exportTosDocBtn')) {
        document.getElementById('exportTosDocBtn').addEventListener('click', () => {
            const table = tosMatrix?.querySelector('table');
            if (table) exportToDOC(table.outerHTML, 'tos_matrix.doc');
        });
    }
    if (document.getElementById('exportTosPdfBtn')) {
        document.getElementById('exportTosPdfBtn').addEventListener('click', () => {
            const wrapper = tosMatrix?.querySelector('.table-wrapper');
            if (wrapper) exportToPDF(wrapper, 'tos_matrix.pdf');
        });
    }
    
    // Export buttons for Items
    const itemsBlueprint = document.getElementById('itemsBlueprint');
    if (document.getElementById('exportItemsCsvBtn')) {
        document.getElementById('exportItemsCsvBtn').addEventListener('click', () => {
            const table = itemsBlueprint?.querySelector('table');
            if (table) exportToCSV(table, 'items_blueprint.csv');
        });
    }
    if (document.getElementById('exportItemsTxtBtn')) {
        document.getElementById('exportItemsTxtBtn').addEventListener('click', () => {
            const table = itemsBlueprint?.querySelector('table');
            if (table) exportToTXT(table, 'items_blueprint.txt', 'QUESTION BLUEPRINT');
        });
    }
    if (document.getElementById('exportItemsDocBtn')) {
        document.getElementById('exportItemsDocBtn').addEventListener('click', () => {
            const table = itemsBlueprint?.querySelector('table');
            if (table) exportToDOC(table.outerHTML, 'items_blueprint.doc');
        });
    }
    if (document.getElementById('exportItemsPdfBtn')) {
        document.getElementById('exportItemsPdfBtn').addEventListener('click', () => {
            const wrapper = itemsBlueprint?.querySelector('.table-wrapper');
            if (wrapper) exportToPDF(wrapper, 'items_blueprint.pdf');
        });
    }
    
    // Rubrics export
    const rubricsBtn = document.getElementById('exportRubricsBtn');
    if (rubricsBtn) {
        rubricsBtn.addEventListener('click', () => {
            const rubricsText = currentRubrics.map(r => 
                `${r.bloom} Level:\n- Questions: ${r.count}\n- Marks: ${r.marks}\n- What it means: ${r.guidelines.what}\n- What to do: ${r.guidelines.how}\n- Criteria: ${r.criteria.join(', ')}\n- Levels: ${r.levels.join(' | ')}\n${'='.repeat(60)}`
            ).join('\n');
            downloadFile(rubricsText, 'rubrics.txt', 'text/plain');
        });
    }
    
    // Print
    const printBtn = document.getElementById('printTosBtn');
    if (printBtn) printBtn.addEventListener('click', () => window.print());
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const activeTab = document.getElementById(tabId);
            if (activeTab) activeTab.classList.add('active');
        });
    });
    
    // Theme switching
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            if (theme === 'dark') {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('darkMode', 'true');
                const darkToggleBtn = document.getElementById('darkModeToggle');
                if (darkToggleBtn) darkToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                document.body.setAttribute('data-theme', theme);
                localStorage.setItem('darkMode', 'false');
                localStorage.setItem('theme', theme);
                const darkToggleBtn = document.getElementById('darkModeToggle');
                if (darkToggleBtn) darkToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            }
            showToast(`${theme} theme applied!`);
        });
    });
}

// ========================================
// INITIALIZE APP
// ========================================

async function init() {
    console.log('Initializing ToS Tool with TiDB Integration...');
    
    initBloomSliders();
    initEventListeners();
    
    // Check database connection
    await checkDatabaseHealth();
    
    // Load all stats from TiDB
    await getStats();
    await getReactions();
    await getShares();
    
    // Apply saved theme
    const savedTheme = localStorage.getItem('theme');
    const isDark = localStorage.getItem('darkMode') === 'true';
    const darkToggleBtn = document.getElementById('darkModeToggle');
    
    if (isDark) {
        document.body.setAttribute('data-theme', 'dark');
        if (darkToggleBtn) darkToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else if (savedTheme && savedTheme !== 'dark') {
        document.body.setAttribute('data-theme', savedTheme);
    }
    
    // Register this tool with TiDB
    await apiCall('/register', 'POST', {
        tool_slug: TOOL_SLUG,
        tool_name: 'Table of Specifications Builder',
        tool_category: 'education'
    });
    
    console.log('ToS Tool initialized successfully with TiDB Cloud Integration!');
    showToast('Connected to TiDB Cloud | Live Database Active', 'success');
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
