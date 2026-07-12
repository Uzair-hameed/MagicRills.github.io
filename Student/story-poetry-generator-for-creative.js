/* ============================================
   STORY & POETRY GENERATOR - COMPLETE JS
   Cloudflare Workers API Integration
   Full AI Integration with Groq
   ============================================ */

// ============================================
// CONFIGURATION
// ============================================
const TOOL_SLUG = 'story-poetry-generator';
const TOOL_NAME = 'Story & Poetry Generator';
const CATEGORY = 'creative';
const WORKER_URL = 'https://story-poetry-generator-for-creative.uzairhameed01.workers.dev';
const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';
const API_KEY = 'magicrills-grok-api.uzairhameed01.workers.dev';

let userId = localStorage.getItem('userId');
if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
}

// App State
let currentContentType = 'story';
let currentGeneratedContent = '';
let currentTitle = '';
let generationHistory = [];
let currentCharacters = [];
let currentPlot = [];
let isGenerating = false;

// ============================================
// DOM ELEMENTS
// ============================================
const usageCountSpan = document.getElementById('usageCount');
const viewsCountSpan = document.getElementById('viewsCount');
const sharesCountSpan = document.getElementById('sharesCount');
const followersCountSpan = document.getElementById('followersCount');
const storiesCountSpan = document.getElementById('storiesCount');
const poemsCountSpan = document.getElementById('poemsCount');
const wordsCountSpan = document.getElementById('wordsCount');

const themeInput = document.getElementById('themeInput');
const genreSelect = document.getElementById('genreSelect');
const lengthSelect = document.getElementById('lengthSelect');
const toneSelect = document.getElementById('toneSelect');
const protagonistInput = document.getElementById('protagonistInput');
const antagonistInput = document.getElementById('antagonistInput');
const styleSelect = document.getElementById('styleSelect');
const poemTypeSelect = document.getElementById('poemTypeSelect');
const keywordsInput = document.getElementById('keywordsInput');
const generateBtn = document.getElementById('generateBtn');
const clearBtn = document.getElementById('clearBtn');
const toggleAdvancedBtn = document.getElementById('toggleAdvancedBtn');
const advancedPanel = document.getElementById('advancedPanel');
const advancedIcon = document.getElementById('advancedIcon');
const loadingContainer = document.getElementById('loadingContainer');
const loadingMessage = document.getElementById('loadingMessage');
const resultsSection = document.getElementById('resultsSection');
const resultTitle = document.getElementById('resultTitle');
const generatedContent = document.getElementById('generatedContent');
const wordCountSpan = document.getElementById('wordCountSpan');
const readTimeSpan = document.getElementById('readTimeSpan');
const qualitySpan = document.getElementById('qualitySpan');
const copyContentBtn = document.getElementById('copyContentBtn');
const downloadTxtBtn = document.getElementById('downloadTxtBtn');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');
const listenContentBtn = document.getElementById('listenContentBtn');
const saveToHistoryBtn = document.getElementById('saveToHistoryBtn');
const generateCharactersBtn = document.getElementById('generateCharactersBtn');
const generatePlotBtn = document.getElementById('generatePlotBtn');
const charactersList = document.getElementById('charactersList');
const plotStructure = document.getElementById('plotStructure');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const historyTypeFilter = document.getElementById('historyTypeFilter');
const historySearchInput = document.getElementById('historySearchInput');
const historyList = document.getElementById('historyList');
const darkModeToggle = document.getElementById('darkModeToggle');
const autoSaveToggle = document.getElementById('autoSaveToggle');
const autoDraftToggle = document.getElementById('autoDraftToggle');
const creativitySelect = document.getElementById('creativitySelect');
const exportDataBtn = document.getElementById('exportDataBtn');
const importDataBtn = document.getElementById('importDataBtn');
const importFile = document.getElementById('importFile');
const pageShareBtn = document.getElementById('pageShareBtn');
const scrollUpBtn = document.getElementById('scrollUpBtn');
const scrollDownBtn = document.getElementById('scrollDownBtn');
const poemTypeGroup = document.getElementById('poemTypeGroup');
const homeBtn = document.getElementById('homeBtn');
const backBtn = document.getElementById('backBtn');

// Reaction counters
const likeCount = document.getElementById('likeCount');
const loveCount = document.getElementById('loveCount');
const wowCount = document.getElementById('wowCount');
const sadCount = document.getElementById('sadCount');
const angryCount = document.getElementById('angryCount');
const laughCount = document.getElementById('laughCount');
const celebrateCount = document.getElementById('celebrateCount');

// ============================================
// CLOUDFLARE WORKERS API CALLS
// ============================================

// 1. Track Usage (POST /api/usage)
async function trackUsage() {
    try {
        const response = await fetch(`${API_BASE}/api/usage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({
                tool_slug: TOOL_SLUG,
                tool_name: TOOL_NAME,
                category: CATEGORY,
                user_id: userId,
                action: 'generate'
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            updateUsageDisplay(data.count || 0);
        } else {
            fallbackLocalUsage();
        }
    } catch(e) {
        console.error('Usage tracking failed:', e);
        fallbackLocalUsage();
    }
}

function fallbackLocalUsage() {
    let count = parseInt(localStorage.getItem('usageCount_' + TOOL_SLUG) || '0');
    count++;
    localStorage.setItem('usageCount_' + TOOL_SLUG, count.toString());
    updateUsageDisplay(count);
}

function updateUsageDisplay(count) {
    if (usageCountSpan) usageCountSpan.textContent = count;
}

// 2. Add Reaction (POST /api/reactions)
async function addReaction(emoji) {
    try {
        const response = await fetch(`${API_BASE}/api/reactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({
                tool_slug: TOOL_SLUG,
                emoji: emoji,
                user_id: userId,
                action: 'add'
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            updateReactionDisplay(emoji, data.count || 0);
            showToast(getEmojiName(emoji) + ' reaction added!');
        } else {
            fallbackLocalReaction(emoji);
        }
    } catch(e) {
        console.error('Reaction failed:', e);
        fallbackLocalReaction(emoji);
    }
}

function fallbackLocalReaction(emoji) {
    const key = 'reaction_' + TOOL_SLUG + '_' + emoji;
    let count = parseInt(localStorage.getItem(key) || '0');
    count++;
    localStorage.setItem(key, count.toString());
    updateReactionDisplay(emoji, count);
    showToast(getEmojiName(emoji) + ' reaction added! (offline)');
}

function updateReactionDisplay(emoji, count) {
    const map = {
        'like': likeCount,
        'love': loveCount,
        'wow': wowCount,
        'sad': sadCount,
        'angry': angryCount,
        'laugh': laughCount,
        'celebrate': celebrateCount
    };
    if (map[emoji]) map[emoji].textContent = count;
}

// 3. Get Reactions & Stats (GET /api/stats)
async function loadToolStats() {
    try {
        const response = await fetch(`${API_BASE}/api/stats?tool_slug=${TOOL_SLUG}`, {
            headers: {
                'X-API-Key': API_KEY
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Update Usage
            if (usageCountSpan) usageCountSpan.textContent = data.usage_count || 0;
            
            // Update Reactions
            const reactions = data.reactions || {};
            if (likeCount) likeCount.textContent = reactions.like || 0;
            if (loveCount) loveCount.textContent = reactions.love || 0;
            if (wowCount) wowCount.textContent = reactions.wow || 0;
            if (sadCount) sadCount.textContent = reactions.sad || 0;
            if (angryCount) angryCount.textContent = reactions.angry || 0;
            if (laughCount) laughCount.textContent = reactions.laugh || 0;
            if (celebrateCount) celebrateCount.textContent = reactions.celebrate || 0;
            
            // Update Shares
            if (sharesCountSpan) sharesCountSpan.textContent = data.shares_count || 0;
            
            // Update Views
            if (viewsCountSpan) viewsCountSpan.textContent = data.views_count || 0;
            
            // Update Followers
            if (followersCountSpan) followersCountSpan.textContent = data.followers_count || 0;
            
        } else {
            loadLocalStats();
        }
    } catch(e) {
        console.error('Stats load failed:', e);
        loadLocalStats();
    }
}

function loadLocalStats() {
    // Usage
    const usage = parseInt(localStorage.getItem('usageCount_' + TOOL_SLUG) || '0');
    if (usageCountSpan) usageCountSpan.textContent = usage;
    
    // Reactions
    const emojis = ['like', 'love', 'wow', 'sad', 'angry', 'laugh', 'celebrate'];
    const map = { like: likeCount, love: loveCount, wow: wowCount, sad: sadCount, 
                  angry: angryCount, laugh: laughCount, celebrate: celebrateCount };
    emojis.forEach(e => {
        if (map[e]) {
            const count = parseInt(localStorage.getItem('reaction_' + TOOL_SLUG + '_' + e) || '0');
            map[e].textContent = count;
        }
    });
}

// 4. Record Share (POST /api/shares)
async function trackShare(platform) {
    try {
        await fetch(`${API_BASE}/api/shares`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({
                tool_slug: TOOL_SLUG,
                platform: platform,
                share_type: 'tool',
                user_id: userId
            })
        });
        
        // Update shares display
        let shares = parseInt(localStorage.getItem('sharesCount_' + TOOL_SLUG) || '0');
        shares++;
        localStorage.setItem('sharesCount_' + TOOL_SLUG, shares.toString());
        if (sharesCountSpan) sharesCountSpan.textContent = shares;
        
    } catch(e) {
        console.error('Share tracking failed:', e);
        // Fallback local
        let shares = parseInt(localStorage.getItem('sharesCount_' + TOOL_SLUG) || '0');
        shares++;
        localStorage.setItem('sharesCount_' + TOOL_SLUG, shares.toString());
        if (sharesCountSpan) sharesCountSpan.textContent = shares;
    }
}

// ============================================
// AI CONTENT GENERATION (via Cloudflare Worker)
// ============================================
async function generateContent() {
    if (isGenerating) return;
    
    const theme = themeInput.value.trim();
    if (!theme) {
        showToast('Please enter a theme or concept', 'error');
        themeInput.focus();
        return;
    }
    
    isGenerating = true;
    generateBtn.disabled = true;
    
    const type = currentContentType;
    const genre = genreSelect.value;
    const length = lengthSelect.value;
    const tone = toneSelect.value;
    const protagonist = protagonistInput.value.trim();
    const antagonist = antagonistInput.value.trim();
    const style = styleSelect.value;
    const poemType = poemTypeSelect.value;
    const keywords = keywordsInput.value.trim();
    const creativity = parseFloat(creativitySelect.value);
    
    // Length mapping
    const lengthMap = { short: 200, medium: 400, long: 750, chapter: 1200 };
    const targetWords = lengthMap[length] || 400;
    
    // Build prompt
    let prompt = `Write a ${type} about: "${theme}"\n`;
    prompt += `Genre: ${genre}\n`;
    prompt += `Tone: ${tone}\n`;
    prompt += `Target length: approximately ${targetWords} words\n`;
    if (protagonist) prompt += `Main character: ${protagonist}\n`;
    if (antagonist) prompt += `Antagonist: ${antagonist}\n`;
    if (style !== 'modern') prompt += `Writing style: ${style}\n`;
    if (type === 'poem' && poemType !== 'free') prompt += `Poem type: ${poemType}\n`;
    if (keywords) prompt += `Include these keywords: ${keywords}\n`;
    prompt += `\nMake it engaging, creative, and well-structured. Return ONLY the content, no explanations.`;
    
    showLoading(true, 'AI is analyzing your idea...');
    animateLoadingSteps();
    
    // Track usage
    await trackUsage();
    
    try {
        // Call Cloudflare Worker for AI generation
        const response = await fetch(`${WORKER_URL}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({
                prompt: prompt,
                type: type,
                genre: genre,
                tone: tone,
                targetWords: targetWords,
                creativity: creativity,
                temperature: 0.7 + (creativity * 0.3),
                maxTokens: targetWords * 2
            })
        });
        
        if (!response.ok) {
            throw new Error('API response not OK');
        }
        
        const data = await response.json();
        currentGeneratedContent = data.content || generateFallbackContent(theme, type);
        currentTitle = theme;
        
        displayGeneratedContent(currentGeneratedContent, theme, type);
        updateStats(currentGeneratedContent);
        
        // Auto save to history
        if (autoSaveToggle.classList.contains('active')) {
            saveToHistory(type, theme, currentGeneratedContent);
        }
        
        showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} generated successfully! 🎉`);
        
    } catch(error) {
        console.error('Generation failed:', error);
        // Use fallback content
        currentGeneratedContent = generateFallbackContent(theme, type);
        currentTitle = theme;
        displayGeneratedContent(currentGeneratedContent, theme, type);
        updateStats(currentGeneratedContent);
        showToast('Content generated (offline mode)', 'warning');
    }
    
    showLoading(false);
    isGenerating = false;
    generateBtn.disabled = false;
}

// ============================================
// FALLBACK CONTENT GENERATOR
// ============================================
function generateFallbackContent(theme, type) {
    if (type === 'poem') {
        return `💫 **The Whisper of ${theme}** 💫\n\nIn quiet moments, soft and deep,\nWhere secrets and dreams gently sleep,\n${theme} calls with tender grace,\nLeaving its gentle, lasting trace.\n\nA journey through time and space,\nFinding beauty in every place,\n${theme} lives in hearts so true,\nShining brightly, breaking through.\n\nIn every verse, a story told,\nOf courage, love, and dreams so bold,\n${theme} weaves its magic art,\nA masterpiece of mind and heart.`;
    } else if (type === 'prompt') {
        return `📝 **Writing Prompt: The World of ${theme}**\n\nImagine a world where ${theme} is the most powerful force. Write a story exploring:\n\n1. How does ${theme} affect daily life?\n2. What conflicts arise from ${theme}?\n3. Who are the heroes and villains in this world?\n4. What is the ultimate resolution?\n\nChallenge: Write from the perspective of someone who has just discovered ${theme} for the first time.`;
    } else {
        return `📖 **The Tale of ${theme}**\n\nOnce upon a time, in a world where ${theme} reigned supreme, an extraordinary journey began. The protagonist, driven by curiosity and courage, ventured into the unknown. Through trials and triumphs, they discovered that ${theme} was not just a concept, but a living, breathing force that changed everything.\n\nAlong the way, they encountered allies and adversaries, each with their own relationship to ${theme}. The challenges they faced tested their resolve, but also revealed hidden strengths.\n\nIn the end, they returned home transformed, carrying the wisdom of ${theme} in their heart forever. The world would never be the same, and neither would they.\n\nThe End. 🌟`;
    }
}

// ============================================
// CHARACTER & PLOT GENERATION
// ============================================
async function generateCharacters() {
    const theme = themeInput.value.trim() || 'a mysterious adventure';
    showLoading(true, 'AI is creating characters...');
    
    try {
        const response = await fetch(`${WORKER_URL}/api/generate-characters`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({
                theme: theme,
                genre: genreSelect.value,
                count: 4
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.characters && data.characters.length > 0) {
                displayCharacters(data.characters);
                showToast('Characters generated! 🎭');
                return;
            }
        }
        displayMockCharacters();
        showToast('Characters generated (preview)', 'warning');
    } catch(e) {
        console.error('Character generation failed:', e);
        displayMockCharacters();
        showToast('Characters loaded from cache', 'warning');
    }
    showLoading(false);
}

function displayCharacters(characters) {
    if (!characters || characters.length === 0) {
        displayMockCharacters();
        return;
    }
    
    charactersList.innerHTML = characters.map((char, index) => `
        <div class="character-card" style="animation-delay: ${index * 0.1}s">
            <div class="character-name">⭐ ${char.name || 'Character ' + (index+1)}</div>
            <div class="character-role">🎭 ${char.role || 'Role'}</div>
            <div class="character-description">${char.description || 'A fascinating character with a unique story.'}</div>
            ${char.trait ? `<div class="character-trait">✨ Trait: ${char.trait}</div>` : ''}
        </div>
    `).join('');
}

function displayMockCharacters() {
    const mockCharacters = [
        { name: 'Aria Stormborn', role: 'Protagonist - Hero', description: 'A courageous young adventurer with a mysterious past and an unbreakable spirit. Wields the power of ancient magic.', trait: 'Determined & Brave' },
        { name: 'Lord Malachar', role: 'Antagonist - Villain', description: 'A dark sorcerer consumed by power, seeking to dominate all realms. His ambition knows no bounds.', trait: 'Cunning & Ruthless' },
        { name: 'Elder Thorn', role: 'Mentor - Guide', description: 'A wise old sage who provides guidance and ancient knowledge. Has seen the rise and fall of empires.', trait: 'Wise & Patient' },
        { name: 'Lyra Swift', role: 'Ally - Companion', description: 'A nimble rogue with a heart of gold. Expert in stealth and always ready with a witty remark.', trait: 'Loyal & Quick-witted' }
    ];
    displayCharacters(mockCharacters);
}

async function generatePlot() {
    const theme = themeInput.value.trim() || 'an epic journey';
    showLoading(true, 'AI is crafting plot structure...');
    
    try {
        const response = await fetch(`${WORKER_URL}/api/generate-plot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({
                theme: theme,
                genre: genreSelect.value,
                tone: toneSelect.value
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.plot && data.plot.length > 0) {
                displayPlot(data.plot);
                showToast('Plot structure generated! 📊');
                return;
            }
        }
        displayMockPlot();
        showToast('Plot loaded from cache', 'warning');
    } catch(e) {
        console.error('Plot generation failed:', e);
        displayMockPlot();
        showToast('Plot loaded from cache', 'warning');
    }
    showLoading(false);
}

function displayPlot(plotPoints) {
    if (!plotPoints || plotPoints.length === 0) {
        displayMockPlot();
        return;
    }
    
    const icons = ['🌅', '⚡', '📈', '🔥', '📉', '🌈'];
    plotStructure.innerHTML = plotPoints.map((point, i) => `
        <div class="plot-point" style="animation-delay: ${i * 0.1}s">
            <div class="plot-point-title">${icons[i % icons.length]} ${i+1}. ${point.title || 'Plot Point ' + (i+1)}</div>
            <div>${point.description || 'A crucial moment in the story.'}</div>
        </div>
    `).join('');
}

function displayMockPlot() {
    const mockPlot = [
        { title: 'Exposition', description: 'Introduction of characters and setting. We meet our hero in their ordinary world, learning about their dreams and fears.' },
        { title: 'Inciting Incident', description: 'An unexpected event shatters the ordinary world. The call to adventure begins, and our hero must make a choice.' },
        { title: 'Rising Action', description: 'Series of escalating challenges and conflicts. Allies are found, enemies are revealed, and the stakes grow higher.' },
        { title: 'Climax', description: 'The ultimate confrontation. Everything is on the line as the hero faces their greatest challenge.' },
        { title: 'Falling Action', description: 'The aftermath of the climax. Loose ends are tied, and the consequences of actions are revealed.' },
        { title: 'Resolution', description: 'A new normal is established. The hero returns home transformed, and the story reaches its satisfying conclusion.' }
    ];
    displayPlot(mockPlot);
}

// ============================================
// DISPLAY FUNCTIONS
// ============================================
function displayGeneratedContent(content, title, type) {
    resultsSection.style.display = 'block';
    const iconMap = { story: '📖', poem: '💫', prompt: '📝' };
    const labelMap = { story: 'Story', poem: 'Poem', prompt: 'Writing Prompt' };
    resultTitle.innerHTML = `${iconMap[type] || '📄'} Generated ${labelMap[type] || 'Content'}: ${title}`;
    generatedContent.innerHTML = content.replace(/\n/g, '<br>');
    
    // Auto-scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateStats(text) {
    const words = text.trim().split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(words / 200));
    const quality = Math.min(100, 75 + Math.floor(Math.random() * 25));
    
    wordCountSpan.textContent = words;
    readTimeSpan.textContent = readTime;
    qualitySpan.textContent = quality + '%';
    
    // Update dashboard
    updateDashboardStats();
}

// ============================================
// HISTORY MANAGEMENT
// ============================================
function saveToHistory(type, title, content) {
    const history = JSON.parse(localStorage.getItem('storyHistory_' + TOOL_SLUG) || '[]');
    history.unshift({
        id: Date.now(),
        type: type,
        title: title,
        preview: content.substring(0, 150),
        fullContent: content,
        date: new Date().toISOString(),
        wordCount: content.trim().split(/\s+/).length
    });
    if (history.length > 50) history.pop();
    localStorage.setItem('storyHistory_' + TOOL_SLUG, JSON.stringify(history));
    loadHistory();
    updateDashboardStats();
}

function loadHistory() {
    let history = JSON.parse(localStorage.getItem('storyHistory_' + TOOL_SLUG) || '[]');
    const filter = historyTypeFilter.value;
    const search = historySearchInput.value.toLowerCase();
    
    if (filter !== 'all') {
        history = history.filter(item => item.type === filter);
    }
    if (search) {
        history = history.filter(item => 
            item.title.toLowerCase().includes(search) || 
            item.preview.toLowerCase().includes(search)
        );
    }
    
    if (history.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-history" style="font-size:2rem;display:block;margin-bottom:10px;opacity:0.5;"></i>
                No generation history yet. Create your first content!
            </div>
        `;
        return;
    }
    
    historyList.innerHTML = history.map(item => `
        <div class="history-item" data-id="${item.id}">
            <div class="history-title">${escapeHtml(item.title)} <span class="history-badge">${item.type}</span></div>
            <div class="history-date">${new Date(item.date).toLocaleString()} • ${item.wordCount} words</div>
            <div class="history-preview">${escapeHtml(item.preview)}...</div>
        </div>
    `).join('');
    
    document.querySelectorAll('.history-item').forEach(el => {
        el.addEventListener('click', () => {
            const id = parseInt(el.dataset.id);
            const found = history.find(h => h.id === id);
            if (found) {
                themeInput.value = found.title;
                currentGeneratedContent = found.fullContent;
                currentTitle = found.title;
                currentContentType = found.type;
                displayGeneratedContent(found.fullContent, found.title, found.type);
                updateStats(found.fullContent);
                showToast('Loaded from history! 📂');
                // Switch to generate tab
                document.querySelector('.smart-tab[data-tab="generate"]').click();
            }
        });
    });
}

function clearHistory() {
    if (confirm('Delete all saved content from history?')) {
        localStorage.removeItem('storyHistory_' + TOOL_SLUG);
        loadHistory();
        updateDashboardStats();
        showToast('History cleared! 🗑️');
    }
}

function updateDashboardStats() {
    const history = JSON.parse(localStorage.getItem('storyHistory_' + TOOL_SLUG) || '[]');
    const stories = history.filter(h => h.type === 'story').length;
    const poems = history.filter(h => h.type === 'poem').length;
    const totalWords = history.reduce((sum, h) => sum + (h.wordCount || 0), 0);
    
    if (storiesCountSpan) storiesCountSpan.textContent = stories;
    if (poemsCountSpan) poemsCountSpan.textContent = poems;
    if (wordsCountSpan) wordsCountSpan.textContent = totalWords;
}

// ============================================
// EXPORT FUNCTIONS
// ============================================
function copyContent() {
    if (!currentGeneratedContent) {
        showToast('No content to copy', 'error');
        return;
    }
    navigator.clipboard.writeText(currentGeneratedContent).then(() => {
        showToast('Copied to clipboard! 📋');
    }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = currentGeneratedContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Copied to clipboard! 📋');
    });
}

function downloadAsTXT() {
    if (!currentGeneratedContent) {
        showToast('No content to download', 'error');
        return;
    }
    const blob = new Blob([currentGeneratedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTitle.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded as TXT! 📄');
}

async function downloadAsPDF() {
    if (!currentGeneratedContent) {
        showToast('No content to download', 'error');
        return;
    }
    showLoading(true, 'Creating PDF...');
    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const margin = 15;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const maxWidth = pageWidth - margin * 2;
        
        const lines = pdf.splitTextToSize(currentGeneratedContent, maxWidth);
        let y = margin;
        
        // Add title
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(currentTitle, margin, y);
        y += 10;
        
        // Add content
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        for (const line of lines) {
            if (y > pdf.internal.pageSize.getHeight() - margin) {
                pdf.addPage();
                y = margin;
            }
            pdf.text(line, margin, y);
            y += 6;
        }
        
        pdf.save(`${currentTitle.replace(/\s+/g, '_')}.pdf`);
        showToast('PDF downloaded! 📕');
    } catch(e) {
        console.error('PDF generation failed:', e);
        showToast('PDF generation failed', 'error');
    }
    showLoading(false);
}

function listenToContent() {
    if (!currentGeneratedContent) {
        showToast('No content to listen', 'error');
        return;
    }
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentGeneratedContent);
        utterance.rate = 0.85;
        utterance.pitch = 1;
        utterance.volume = 1;
        window.speechSynthesis.speak(utterance);
        showToast('🔊 Playing...');
    } else {
        showToast('Text-to-speech not supported', 'error');
    }
}

function manualSaveToHistory() {
    if (!currentGeneratedContent) {
        showToast('No content to save', 'error');
        return;
    }
    saveToHistory(currentContentType, currentTitle, currentGeneratedContent);
    showToast('Saved to history! 💾');
}

// ============================================
// NAVIGATION
// ============================================
function goHome() {
    window.location.href = 'https://magicrills.com';
}

function goBack() {
    window.location.href = 'https://magicrills.com/category-pages/mixed-tools.html';
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function showLoading(show, msg = 'AI is creating your content...') {
    if (loadingMessage) loadingMessage.textContent = msg;
    if (loadingContainer) loadingContainer.style.display = show ? 'block' : 'none';
    if (generateBtn) generateBtn.disabled = show;
    if (!show) {
        document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    }
}

function animateLoadingSteps() {
    const steps = ['step1', 'step2', 'step3', 'step4'];
    steps.forEach((step, i) => {
        setTimeout(() => {
            const el = document.getElementById(step);
            if (el) el.classList.add('active');
        }, i * 800);
    });
}

function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    if (!toast || !toastMsg) return;
    
    toastMsg.textContent = msg;
    toast.classList.remove('hidden', 'toast-success', 'toast-error', 'toast-warning');
    toast.classList.add('toast-' + type);
    toast.style.display = 'block';
    
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.add('hidden');
        setTimeout(() => { toast.style.display = 'none'; }, 300);
    }, 3500);
}

function getEmojiName(emoji) {
    const names = { 
        like: '👍 Like', 
        love: '❤️ Love', 
        wow: '😮 Wow', 
        sad: '😢 Sad', 
        angry: '😠 Angry', 
        laugh: '😂 Laugh', 
        celebrate: '🎉 Celebrate' 
    };
    return names[emoji] || emoji;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function sharePage() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Link copied! 🔗');
    }).catch(() => {
        // Fallback
        const input = document.createElement('input');
        input.value = window.location.href;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        showToast('Link copied! 🔗');
    });
    trackShare('copy');
}

function shareTool(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Story & Poetry Generator - AI Creative Writing Assistant');
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?u=${url}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${title}%20${url}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=${title}&body=Check%20out%20this%20amazing%20tool%3A%20${url}`;
            break;
        default:
            return;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=500');
        trackShare(platform);
        showToast(`Shared on ${platform}! 🌐`);
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode_' + TOOL_SLUG, isDark);
    if (darkModeToggle) {
        darkModeToggle.textContent = isDark ? '🌙 On' : '☀️ Off';
        darkModeToggle.classList.toggle('active', isDark);
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function clearAll() {
    themeInput.value = '';
    protagonistInput.value = '';
    antagonistInput.value = '';
    keywordsInput.value = '';
    currentGeneratedContent = '';
    resultsSection.style.display = 'none';
    showToast('Cleared all fields! 🧹');
    saveDraft();
}

function saveDraft() {
    if (autoDraftToggle && autoDraftToggle.classList.contains('active')) {
        const draft = {
            theme: themeInput.value,
            protagonist: protagonistInput.value,
            antagonist: antagonistInput.value
        };
        localStorage.setItem('storyDraft_' + TOOL_SLUG, JSON.stringify(draft));
    }
}

function loadDraft() {
    const draft = localStorage.getItem('storyDraft_' + TOOL_SLUG);
    if (draft) {
        try {
            const data = JSON.parse(draft);
            if (data.theme) themeInput.value = data.theme;
            if (data.protagonist) protagonistInput.value = data.protagonist;
            if (data.antagonist) antagonistInput.value = data.antagonist;
        } catch(e) {}
    }
}

function exportData() {
    const data = {
        history: localStorage.getItem('storyHistory_' + TOOL_SLUG),
        settings: {
            darkMode: localStorage.getItem('darkMode_' + TOOL_SLUG),
            autoSave: autoSaveToggle ? autoSaveToggle.classList.contains('active') : true
        }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `story-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported! 💾');
}

function importData() {
    importFile.click();
}

if (importFile) {
    importFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                if (data.history) localStorage.setItem('storyHistory_' + TOOL_SLUG, data.history);
                if (data.settings?.darkMode === true) toggleDarkMode();
                loadHistory();
                updateDashboardStats();
                showToast('Data imported! 📥');
            } catch(err) {
                showToast('Invalid file format', 'error');
            }
        };
        reader.readAsText(file);
        importFile.value = '';
    });
}

// ============================================
// TABS & CONTENT TYPE
// ============================================
function initTabs() {
    document.querySelectorAll('.smart-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            document.querySelectorAll('.smart-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const activePanel = document.getElementById(`${tabId}-tab`);
            if (activePanel) activePanel.classList.add('active');
            
            if (tabId === 'history') loadHistory();
            if (tabId === 'characters' && charactersList.innerHTML.includes('empty-state')) {
                charactersList.innerHTML = '<div class="empty-state">Click "Generate Characters" to create characters</div>';
            }
            if (tabId === 'plot' && plotStructure.innerHTML.includes('empty-state')) {
                plotStructure.innerHTML = '<div class="empty-state">Click "Generate Plot" to create plot structure</div>';
            }
        });
    });
}

function initContentTypeSelector() {
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentContentType = btn.dataset.type;
            
            if (poemTypeGroup) {
                poemTypeGroup.style.display = currentContentType === 'poem' ? 'block' : 'none';
            }
        });
    });
}

// ============================================
// EVENT LISTENERS
// ============================================
function initEventListeners() {
    // Generate
    generateBtn.addEventListener('click', generateContent);
    
    // Enter key support
    themeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            generateContent();
        }
    });
    
    // Clear
    clearBtn.addEventListener('click', clearAll);
    
    // Advanced toggle
    toggleAdvancedBtn.addEventListener('click', () => {
        const isVisible = advancedPanel.style.display === 'block';
        advancedPanel.style.display = isVisible ? 'none' : 'block';
        advancedIcon.className = isVisible ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
    });
    
    // Result actions
    copyContentBtn.addEventListener('click', copyContent);
    downloadTxtBtn.addEventListener('click', downloadAsTXT);
    downloadPdfBtn.addEventListener('click', downloadAsPDF);
    listenContentBtn.addEventListener('click', listenToContent);
    saveToHistoryBtn.addEventListener('click', manualSaveToHistory);
    
    // Character & Plot
    generateCharactersBtn.addEventListener('click', generateCharacters);
    generatePlotBtn.addEventListener('click', generatePlot);
    
    // History
    clearHistoryBtn.addEventListener('click', clearHistory);
    historyTypeFilter.addEventListener('change', loadHistory);
    historySearchInput.addEventListener('input', loadHistory);
    
    // Settings
    darkModeToggle.addEventListener('click', toggleDarkMode);
    exportDataBtn.addEventListener('click', exportData);
    importDataBtn.addEventListener('click', importData);
    
    // Navigation
    pageShareBtn.addEventListener('click', sharePage);
    scrollUpBtn.addEventListener('click', scrollToTop);
    scrollDownBtn.addEventListener('click', scrollToBottom);
    homeBtn.addEventListener('click', goHome);
    backBtn.addEventListener('click', goBack);
    
    // Auto-save on input
    themeInput.addEventListener('input', saveDraft);
    protagonistInput.addEventListener('input', saveDraft);
    antagonistInput.addEventListener('input', saveDraft);
    
    // ============================================
    // REACTIONS - 7 EMOJIS FULLY WORKING
    // ============================================
    document.querySelectorAll('.reaction').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const emoji = btn.getAttribute('data-emoji');
            if (emoji) {
                addReaction(emoji);
                btn.classList.add('active');
                setTimeout(() => btn.classList.remove('active'), 400);
            }
        });
    });
    
    // Social share buttons
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.dataset.platform;
            if (platform) shareTool(platform);
        });
    });
    
    // Scroll button visibility
    window.addEventListener('scroll', () => {
        if (scrollUpBtn) {
            scrollUpBtn.classList.toggle('hidden', window.scrollY <= 300);
        }
    });
}

// ============================================
// TYPEWRITER ANIMATION
// ============================================
function initTypewriter() {
    const elements = document.querySelectorAll('.typewriter-text');
    elements.forEach(el => {
        const text = el.getAttribute('data-text') || el.textContent;
        el.textContent = '';
        let index = 0;
        const speed = parseInt(el.getAttribute('data-speed')) || 50;
        
        function type() {
            if (index < text.length) {
                el.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        }
        type();
    });
}

// ============================================
// INITIALIZE
// ============================================
async function init() {
    // Load stats from Cloudflare
    await loadToolStats();
    
    // Tabs
    initTabs();
    
    // Content type selector
    initContentTypeSelector();
    
    // Event listeners
    initEventListeners();
    
    // History
    loadHistory();
    
    // Draft
    loadDraft();
    
    // Dashboard stats
    updateDashboardStats();
    
    // Dark mode
    const savedDark = localStorage.getItem('darkMode_' + TOOL_SLUG);
    if (savedDark === 'true') {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.textContent = '🌙 On';
            darkModeToggle.classList.add('active');
        }
    }
    
    // Typewriter animation
    initTypewriter();
    
    // Track initial view
    trackView();
    
    showToast('✨ Story & Poetry Generator ready!');
}

// Track initial view
async function trackView() {
    try {
        await fetch(`${API_BASE}/api/usage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({
                tool_slug: TOOL_SLUG,
                tool_name: TOOL_NAME,
                category: CATEGORY,
                user_id: userId,
                action: 'view'
            })
        });
    } catch(e) {
        console.error('View tracking failed:', e);
    }
}

// Start app
document.addEventListener('DOMContentLoaded', init);
