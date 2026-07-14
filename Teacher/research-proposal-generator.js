// ============================================
// RESEARCH PROPOSAL GENERATOR - CLOUDFLARE API VERSION
// Professional Academic Tool | MagicRills API Integration
// ============================================

// ============================================
// CONFIGURATION - ✅ UPDATED WITH YOUR WORKER URL
// ============================================
const CONFIG = {
    TOOL_NAME: 'Research Proposal Generator',
    TOOL_SLUG: 'research-proposal-generator',
    CATEGORY: 'Mixed-Tools',
    API_BASE: 'https://research-proposal-generator.uzairhameed01.workers.dev', // ← Your Worker URL
    API_KEY: '', // Not required for now
    VERSION: '2.0.0'
};

console.log('🚀 ' + CONFIG.TOOL_NAME + ' v' + CONFIG.VERSION);
console.log('🌐 API: ' + CONFIG.API_BASE);

// ============================================
// STATE MANAGEMENT
// ============================================
let state = {
    usageCount: 0,
    globalUsage: 0,
    sharesCount: 0,
    followersCount: 0,
    reactions: {
        like: 0,
        love: 0,
        wow: 0,
        sad: 0,
        angry: 0,
        laugh: 0,
        celebrate: 0
    },
    isGenerating: false,
    hasGenerated: false,
    currentProposal: null,
    apiAvailable: true
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', async function() {
    console.log('📚 ' + CONFIG.TOOL_NAME + ' v' + CONFIG.VERSION + ' loaded');
    console.log('🔧 Tool Slug: ' + CONFIG.TOOL_SLUG);
    console.log('📊 Category: ' + CONFIG.CATEGORY);
    
    // Create space background
    createSpaceBackground();
    
    // Check API health first
    await checkAPIHealth();
    
    // Load all data from API
    await loadAllData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup reactions
    setupReactions();
    
    // Setup scroll button
    setupScrollButton();
    
    // Load theme
    loadTheme();
    
    // Show welcome message
    showToast('✨ ' + CONFIG.TOOL_NAME + ' is ready!', 'success');
    console.log('💡 Tip: Press Ctrl+Enter to generate proposal');
});

// ============================================
// CHECK API HEALTH
// ============================================
async function checkAPIHealth() {
    try {
        const response = await fetch(CONFIG.API_BASE + '/api/health');
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API Health: ' + data.status + ' | v' + data.version);
            state.apiAvailable = true;
        } else {
            console.warn('⚠️ API Health check failed, using localStorage fallback');
            state.apiAvailable = false;
        }
    } catch (error) {
        console.warn('⚠️ API not available, using localStorage fallback');
        state.apiAvailable = false;
    }
}

// ============================================
// SPACE BACKGROUND
// ============================================
function createSpaceBackground() {
    const container = document.getElementById('spaceBg');
    if (!container) return;
    
    const starCount = 150;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = (Math.random() * 2 + 1) + 'px';
        star.style.height = star.style.width;
        star.style.setProperty('--duration', (Math.random() * 3 + 2) + 's');
        star.style.animationDelay = (Math.random() * 5) + 's';
        container.appendChild(star);
    }
}

// ============================================
// API FUNCTIONS
// ============================================
async function callAPI(endpoint, method = 'GET', body = null) {
    if (!state.apiAvailable) {
        console.warn('⚠️ API not available, using fallback');
        return null;
    }
    
    const url = CONFIG.API_BASE + endpoint;
    const headers = {
        'Content-Type': 'application/json'
    };
    
    const options = {
        method: method,
        headers: headers
    };
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        state.apiAvailable = false;
        return null;
    }
}

// ============================================
// LOAD ALL DATA FROM API
// ============================================
async function loadAllData() {
    try {
        // 1. Get tool stats
        const stats = await callAPI(`/api/stats?tool_slug=${CONFIG.TOOL_SLUG}`);
        
        if (stats) {
            state.globalUsage = stats.usage_count || 0;
            state.sharesCount = stats.shares_count || 0;
            state.followersCount = stats.followers_count || 0;
            
            // Update UI
            document.getElementById('globalUsage').innerText = formatNumber(state.globalUsage);
            document.getElementById('totalShares').innerText = formatNumber(state.sharesCount);
            document.getElementById('totalFollowers').innerText = formatNumber(state.followersCount);
            
            console.log('📊 Stats loaded:', stats);
        } else {
            // Fallback to localStorage
            loadFromLocalStorage();
        }
        
        // 2. Get reactions
        const reactionsData = await callAPI(`/api/reactions?tool_slug=${CONFIG.TOOL_SLUG}`);
        if (reactionsData && reactionsData.reactions) {
            state.reactions = reactionsData.reactions;
            updateReactionUI();
            console.log('❤️ Reactions loaded:', state.reactions);
        } else {
            // Fallback: load reactions from localStorage
            loadReactionsFromLocalStorage();
        }
        
        // 3. Increment usage for this tool
        await incrementUsage();
        
        // 4. Load local draft
        loadDraft();
        
        // 5. Load saved proposal
        loadSavedProposal();
        
    } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to localStorage
        loadFromLocalStorage();
    }
}

// ============================================
// INCREMENT USAGE
// ============================================
async function incrementUsage() {
    try {
        const result = await callAPI('/api/usage', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG
        });
        
        if (result) {
            state.usageCount = result.usage_count || 1;
            document.getElementById('toolUsage').innerText = formatNumber(state.usageCount);
            
            if (result.global_usage) {
                state.globalUsage = result.global_usage;
                document.getElementById('globalUsage').innerText = formatNumber(state.globalUsage);
            }
            console.log('📈 Usage incremented:', state.usageCount);
        }
    } catch (error) {
        console.error('Error incrementing usage:', error);
        // Fallback: increment local
        let localUsage = localStorage.getItem(`${CONFIG.TOOL_SLUG}_usage`);
        localUsage = localUsage ? parseInt(localUsage) + 1 : 1;
        localStorage.setItem(`${CONFIG.TOOL_SLUG}_usage`, localUsage);
        document.getElementById('toolUsage').innerText = formatNumber(localUsage);
    }
}

// ============================================
// REACTIONS
// ============================================
function setupReactions() {
    const buttons = document.querySelectorAll('.reaction-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            const reactionType = this.getAttribute('data-reaction');
            const emoji = this.getAttribute('data-emoji');
            handleReaction(reactionType, emoji);
        });
    });
}

async function handleReaction(reactionType, emoji) {
    try {
        const result = await callAPI('/api/reactions', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            reaction_type: reactionType
        });
        
        if (result && result.reactions) {
            state.reactions = result.reactions;
            updateReactionUI();
            showToast(`Thanks for your ${reactionType} reaction! ${emoji}`, 'success');
            console.log('❤️ Reaction added:', reactionType, state.reactions);
        } else {
            // Fallback: increment local
            addReactionLocal(reactionType);
        }
    } catch (error) {
        console.error('Error adding reaction:', error);
        // Fallback: increment local
        addReactionLocal(reactionType);
    }
}

function addReactionLocal(reactionType) {
    const count = localStorage.getItem(`${CONFIG.TOOL_SLUG}_reaction_${reactionType}`);
    const newCount = count ? parseInt(count) + 1 : 1;
    localStorage.setItem(`${CONFIG.TOOL_SLUG}_reaction_${reactionType}`, newCount);
    state.reactions[reactionType] = newCount;
    updateReactionUI();
    showToast(`Thanks for your ${reactionType} reaction!`, 'success');
}

function updateReactionUI() {
    const reactionMap = {
        like: 'reactionLike',
        love: 'reactionLove',
        wow: 'reactionWow',
        sad: 'reactionSad',
        angry: 'reactionAngry',
        laugh: 'reactionLaugh',
        celebrate: 'reactionCelebrate'
    };
    
    for (const [key, elementId] of Object.entries(reactionMap)) {
        const el = document.getElementById(elementId);
        if (el) {
            el.innerText = state.reactions[key] || 0;
        }
    }
}

function loadReactionsFromLocalStorage() {
    const reactionKeys = ['like', 'love', 'wow', 'sad', 'angry', 'laugh', 'celebrate'];
    reactionKeys.forEach(key => {
        const count = localStorage.getItem(`${CONFIG.TOOL_SLUG}_reaction_${key}`);
        state.reactions[key] = count ? parseInt(count) : 0;
    });
    updateReactionUI();
}

// ============================================
// SHARE FUNCTIONS
// ============================================
async function recordShare(platform) {
    try {
        const result = await callAPI('/api/shares', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            platform: platform
        });
        
        if (result) {
            state.sharesCount++;
            document.getElementById('totalShares').innerText = formatNumber(state.sharesCount);
        }
    } catch (error) {
        console.error('Error recording share:', error);
        // Fallback: increment local
        let shares = localStorage.getItem(`${CONFIG.TOOL_SLUG}_shares`);
        shares = shares ? parseInt(shares) + 1 : 1;
        localStorage.setItem(`${CONFIG.TOOL_SLUG}_shares`, shares);
        document.getElementById('totalShares').innerText = formatNumber(shares);
    }
}

function shareOnFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank', 'width=600,height=400');
    recordShare('facebook');
    showToast('Shared on Facebook!', 'success');
}

function shareOnTwitter() {
    window.open(`https://twitter.com/intent/tweet?text=Check%20out%20this%20Research%20Proposal%20Generator!%20📚&url=${encodeURIComponent(window.location.href)}`, '_blank', 'width=600,height=400');
    recordShare('twitter');
    showToast('Shared on Twitter!', 'success');
}

function shareOnWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent('Check out this Research Proposal Generator: ' + window.location.href)}`, '_blank');
    recordShare('whatsapp');
    showToast('Shared on WhatsApp!', 'success');
}

function shareOnLinkedIn() {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank', 'width=600,height=400');
    recordShare('linkedin');
    showToast('Shared on LinkedIn!', 'success');
}

function shareOnEmail() {
    window.location.href = `mailto:?subject=Research Proposal Generator&body=Check out this amazing tool: ${window.location.href}`;
    recordShare('email');
    showToast('Email client opened!', 'success');
}

async function copyPageURL() {
    try {
        await navigator.clipboard.writeText(window.location.href);
        recordShare('copy');
        showToast('URL copied to clipboard! 📋', 'success');
    } catch (error) {
        showToast('Failed to copy URL', 'error');
    }
}

// ============================================
// PROPOSAL GENERATION
// ============================================
function setupEventListeners() {
    document.getElementById('generateBtn').addEventListener('click', generateProposal);
    document.getElementById('aiGenerateBtn').addEventListener('click', generateWithAI);
    document.getElementById('exportPDF').addEventListener('click', exportAsPDF);
    document.getElementById('exportDOC').addEventListener('click', exportAsDOC);
    document.getElementById('exportTXT').addEventListener('click', exportAsTXT);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('scrollToTop').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Share buttons
    document.getElementById('shareFB').addEventListener('click', shareOnFacebook);
    document.getElementById('shareTW').addEventListener('click', shareOnTwitter);
    document.getElementById('shareWA').addEventListener('click', shareOnWhatsApp);
    document.getElementById('shareLI').addEventListener('click', shareOnLinkedIn);
    document.getElementById('shareEmail').addEventListener('click', shareOnEmail);
    document.getElementById('copyURL').addEventListener('click', copyPageURL);
    
    // Modal close buttons
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    document.getElementById('closeModalBtn2').addEventListener('click', closeModal);
    
    // Auto-save on input
    const inputs = ['researchTopic', 'researchArea', 'industry', 'keyTerms', 'methodology', 'sampleSize'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', saveDraft);
    });
}

function generateProposal() {
    const topic = document.getElementById('researchTopic').value.trim();
    const area = document.getElementById('researchArea').value.trim();
    
    if (!topic || !area) {
        showToast('Please fill in Research Topic and Research Area', 'error');
        return;
    }
    
    if (state.isGenerating) return;
    state.isGenerating = true;
    showLoading(true);
    
    try {
        const industry = document.getElementById('industry').value.trim();
        const keyTerms = document.getElementById('keyTerms').value.trim();
        const methodology = document.getElementById('methodology').value;
        const sampleSize = document.getElementById('sampleSize').value.trim();
        
        const proposalHTML = buildProposalHTML(topic, area, industry, keyTerms, methodology, sampleSize);
        
        document.getElementById('proposalViewer').innerHTML = proposalHTML;
        document.getElementById('exportGroup').style.display = 'flex';
        state.hasGenerated = true;
        
        // Save to localStorage
        localStorage.setItem(`${CONFIG.TOOL_SLUG}_last_proposal`, JSON.stringify({
            content: proposalHTML,
            timestamp: Date.now()
        }));
        
        showToast('✅ Research proposal generated successfully!', 'success');
    } catch (error) {
        console.error('Error generating proposal:', error);
        showToast('Error generating proposal. Please try again.', 'error');
    } finally {
        state.isGenerating = false;
        showLoading(false);
    }
}

async function generateWithAI() {
    const topic = document.getElementById('researchTopic').value.trim();
    const area = document.getElementById('researchArea').value.trim();
    
    if (!topic || !area) {
        showToast('Please fill in Research Topic and Research Area', 'error');
        return;
    }
    
    if (state.isGenerating) return;
    state.isGenerating = true;
    showLoading(true);
    showToast('🤖 AI is generating your proposal...', 'info');
    
    try {
        const industry = document.getElementById('industry').value.trim();
        const keyTerms = document.getElementById('keyTerms').value.trim();
        const methodology = document.getElementById('methodology').value;
        const sampleSize = document.getElementById('sampleSize').value.trim();
        
        // Call AI API
        const result = await callAPI('/api/generate-proposal', 'POST', {
            topic: topic,
            area: area,
            industry: industry,
            keyTerms: keyTerms,
            methodology: methodology,
            sampleSize: sampleSize
        });
        
        if (result && result.success) {
            document.getElementById('proposalViewer').innerHTML = result.content;
            document.getElementById('exportGroup').style.display = 'flex';
            state.hasGenerated = true;
            
            localStorage.setItem(`${CONFIG.TOOL_SLUG}_last_proposal`, JSON.stringify({
                content: result.content,
                timestamp: Date.now(),
                ai_generated: true
            }));
            
            showToast('🎉 AI-generated proposal ready!', 'success');
        } else {
            // Fallback to template
            const fallbackHTML = buildProposalHTML(topic, area, industry, keyTerms, methodology, sampleSize);
            document.getElementById('proposalViewer').innerHTML = fallbackHTML;
            document.getElementById('exportGroup').style.display = 'flex';
            state.hasGenerated = true;
            
            localStorage.setItem(`${CONFIG.TOOL_SLUG}_last_proposal`, JSON.stringify({
                content: fallbackHTML,
                timestamp: Date.now()
            }));
            
            showToast('✅ Proposal generated (AI service unavailable, used template)', 'info');
        }
    } catch (error) {
        console.error('AI generation error:', error);
        // Fallback to template
        const fallbackHTML = buildProposalHTML(topic, area, industry, keyTerms, methodology, sampleSize);
        document.getElementById('proposalViewer').innerHTML = fallbackHTML;
        document.getElementById('exportGroup').style.display = 'flex';
        state.hasGenerated = true;
        
        localStorage.setItem(`${CONFIG.TOOL_SLUG}_last_proposal`, JSON.stringify({
            content: fallbackHTML,
            timestamp: Date.now()
        }));
        
        showToast('✅ Proposal generated (AI service unavailable, used template)', 'info');
    } finally {
        state.isGenerating = false;
        showLoading(false);
    }
}

// ============================================
// BUILD PROPOSAL HTML (APA 7th Edition)
// ============================================
function buildProposalHTML(topic, area, industry, keyTerms, methodology, sampleSize) {
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const termsList = keyTerms ? keyTerms.split('\n').filter(t => t.trim()) : [];
    
    return `
        <div class="proposal-content">
            <h1>${escapeHTML(topic)}</h1>
            <p style="text-align: center; margin-bottom: 30px; color: var(--text-secondary);">
                A Research Proposal Submitted to the Department of ${escapeHTML(area)}<br>
                Date: ${date}
            </p>
            
            <h2>ABSTRACT</h2>
            <p>This research proposal investigates ${escapeHTML(topic)} within the field of ${escapeHTML(area)}. ${industry ? `Focusing on the ${escapeHTML(industry)} industry,` : ''} this study aims to address critical gaps in current knowledge and practice. The research employs ${escapeHTML(methodology || 'Mixed Methods')} methodology with ${escapeHTML(sampleSize || 'an appropriate')} sample size to ensure validity and reliability of findings.</p>
            
            <h2>BACKGROUND OF THE STUDY</h2>
            <p>The area of ${escapeHTML(area)} has witnessed significant developments in recent years. ${industry ? `Particularly in the ${escapeHTML(industry)} sector,` : ''} there is an urgent need to understand ${escapeHTML(topic.toLowerCase())}. Current literature suggests that this topic has far-reaching implications for both theory and practice.</p>
            
            <h2>PROBLEM STATEMENT</h2>
            <p>The central problem addressed by this research is the limited understanding of ${escapeHTML(topic.toLowerCase())} in ${escapeHTML(area)}. Despite its growing importance, there exists a significant knowledge gap regarding effective approaches, implementation strategies, and measurable outcomes. This study seeks to bridge this gap through systematic investigation.</p>
            
            <h2>RESEARCH AIMS AND OBJECTIVES</h2>
            <p><strong>Primary Aim:</strong> To examine ${escapeHTML(topic.toLowerCase())} and its implications for ${escapeHTML(industry || area)}.</p>
            <p><strong>Specific Objectives:</strong></p>
            <ul>
                <li>To analyze the current state of ${escapeHTML(topic.toLowerCase())}</li>
                <li>To identify key factors influencing ${escapeHTML(topic.toLowerCase())}</li>
                <li>To evaluate existing approaches and their effectiveness</li>
                <li>To develop evidence-based recommendations</li>
                <li>To contribute theoretical insights to the field of ${escapeHTML(area)}</li>
            </ul>
            
            <h2>RESEARCH QUESTIONS</h2>
            <ol>
                <li>What are the key characteristics and components of ${escapeHTML(topic.toLowerCase())}?</li>
                <li>How does ${escapeHTML(topic.toLowerCase())} impact outcomes in ${escapeHTML(industry || area)}?</li>
                <li>What challenges exist in implementing ${escapeHTML(topic.toLowerCase())} solutions?</li>
                <li>What strategies can optimize benefits of ${escapeHTML(topic.toLowerCase())}?</li>
            </ol>
            
            <h2>LITERATURE REVIEW</h2>
            <p>The literature review will examine existing research on ${escapeHTML(topic.toLowerCase())}, focusing on theoretical frameworks, empirical studies, and identified gaps. Key areas include conceptual definitions, measurement approaches, and documented outcomes across different contexts.</p>
            
            <h2>RESEARCH METHODOLOGY</h2>
            <p><strong>Research Approach:</strong> ${escapeHTML(methodology || 'Mixed Methods')} research design</p>
            <p><strong>Sampling Technique:</strong> Stratified random sampling to ensure representation</p>
            <p><strong>Sample Size:</strong> ${escapeHTML(sampleSize || '200 participants (calculated using power analysis)')}</p>
            <p><strong>Data Collection:</strong> Mixed methods including surveys, semi-structured interviews, and document analysis</p>
            <p><strong>Data Analysis:</strong> Statistical analysis for quantitative data, thematic analysis for qualitative data</p>
            <p><strong>Ethical Considerations:</strong> Informed consent, confidentiality, anonymity, and ethical approval from Institutional Review Board (IRB)</p>
            
            ${termsList.length ? `
            <h2>OPERATIONAL DEFINITIONS</h2>
            <ul>
                ${termsList.map(term => `<li>${escapeHTML(term)}</li>`).join('')}
            </ul>
            ` : ''}
            
            <h2>SCOPE AND SIGNIFICANCE</h2>
            <p><strong>Scope:</strong> This study focuses on ${escapeHTML(industry || area)} with particular attention to ${escapeHTML(topic.toLowerCase())}.</p>
            <p><strong>Significance:</strong> This research will contribute to academic knowledge and practical applications. Findings will benefit practitioners, policymakers, and researchers.</p>
            
            <h2>LIMITATIONS</h2>
            <ul>
                <li>The study is limited to ${escapeHTML(industry || area)}, affecting generalizability</li>
                <li>Time and resource constraints may limit depth of investigation</li>
                <li>Cross-sectional nature limits causal inferences</li>
            </ul>
            
            <h2>PROPOSED TIMELINE</h2>
            <ul>
                <li><strong>Months 1-2:</strong> Literature Review and Methodology Development</li>
                <li><strong>Months 3-4:</strong> Data Collection</li>
                <li><strong>Months 5-6:</strong> Data Analysis and Interpretation</li>
                <li><strong>Month 7:</strong> Thesis Writing and Submission</li>
            </ul>
            
            <h2>CONCLUSION</h2>
            <p>This research proposal outlines a comprehensive investigation into ${escapeHTML(topic.toLowerCase())}. The findings will provide valuable insights for ${escapeHTML(area)} and contribute to advancing knowledge in this critical area.</p>
            
            <h2>REFERENCES</h2>
            <p>A complete reference list will be provided in APA 7th Edition format upon completion of the research.</p>
            
            <hr>
            <p style="text-align: center; font-size: 0.8rem; color: var(--text-muted); margin-top: 30px;">
                Generated by Research Proposal Generator | ${CONFIG.TOOL_NAME} v${CONFIG.VERSION}
            </p>
        </div>
    `;
}

// ============================================
// EXPORT FUNCTIONS
// ============================================
async function exportAsPDF() {
    const element = document.getElementById('proposalViewer');
    if (!element.innerHTML || element.innerHTML.includes('No Proposal Generated')) {
        showToast('Please generate a proposal first', 'error');
        return;
    }
    
    showToast('Generating PDF... 📑', 'info');
    
    try {
        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: `research_proposal_${Date.now()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        await html2pdf().set(opt).from(element).save();
        showToast('PDF exported successfully! ✅', 'success');
    } catch (error) {
        console.error('PDF export error:', error);
        showToast('Error generating PDF', 'error');
    }
}

function exportAsDOC() {
    const content = document.getElementById('proposalViewer');
    if (!content.innerHTML || content.innerHTML.includes('No Proposal Generated')) {
        showToast('Please generate a proposal first', 'error');
        return;
    }
    
    const html = `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Research Proposal</title>
        <style>
            body { font-family: 'Times New Roman', Arial, sans-serif; margin: 1in; line-height: 1.6; }
            h1 { color: #4f46e5; text-align: center; }
            h2 { color: #4f46e5; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 20px; }
        </style>
    </head>
    <body>${content.innerHTML}</body>
    </html>`;
    
    const blob = new Blob([html], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `research_proposal_${Date.now()}.doc`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('Word document exported! 📝', 'success');
}

function exportAsTXT() {
    const content = document.getElementById('proposalViewer');
    if (!content.innerHTML || content.innerHTML.includes('No Proposal Generated')) {
        showToast('Please generate a proposal first', 'error');
        return;
    }
    
    const text = content.innerText;
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `research_proposal_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('Text file exported! 📄', 'success');
}

// ============================================
// DARK MODE THEME
// ============================================
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        document.getElementById('themeToggle').innerHTML = '🌙 Dark Mode';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('themeToggle').innerHTML = '☀️ Light Mode';
    }
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        document.getElementById('themeToggle').innerHTML = '🌙 Dark Mode';
        showToast('Light mode activated', 'info');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        document.getElementById('themeToggle').innerHTML = '☀️ Light Mode';
        showToast('Dark mode activated', 'info');
    }
}

// ============================================
// LOCAL STORAGE FALLBACK
// ============================================
function loadFromLocalStorage() {
    console.log('📦 Loading data from localStorage fallback');
    
    // Load usage
    let toolUsage = localStorage.getItem(`${CONFIG.TOOL_SLUG}_usage`);
    toolUsage = toolUsage ? parseInt(toolUsage) : 0;
    document.getElementById('toolUsage').innerText = formatNumber(toolUsage);
    
    // Load shares
    let totalShares = localStorage.getItem(`${CONFIG.TOOL_SLUG}_shares`);
    totalShares = totalShares ? parseInt(totalShares) : 0;
    document.getElementById('totalShares').innerText = formatNumber(totalShares);
    
    // Load followers (simulated)
    let followers = localStorage.getItem(`${CONFIG.TOOL_SLUG}_followers`);
    followers = followers ? parseInt(followers) : 42;
    document.getElementById('totalFollowers').innerText = formatNumber(followers);
    
    // Load global usage (simulated)
    let globalUsage = localStorage.getItem(`${CONFIG.TOOL_SLUG}_global_usage`);
    globalUsage = globalUsage ? parseInt(globalUsage) : 1247;
    document.getElementById('globalUsage').innerText = formatNumber(globalUsage);
    
    // Load reactions
    loadReactionsFromLocalStorage();
}

function saveDraft() {
    const draft = {
        topic: document.getElementById('researchTopic').value,
        area: document.getElementById('researchArea').value,
        industry: document.getElementById('industry').value,
        keyTerms: document.getElementById('keyTerms').value,
        methodology: document.getElementById('methodology').value,
        sampleSize: document.getElementById('sampleSize').value,
        timestamp: Date.now()
    };
    localStorage.setItem(`${CONFIG.TOOL_SLUG}_draft`, JSON.stringify(draft));
}

function loadDraft() {
    const saved = localStorage.getItem(`${CONFIG.TOOL_SLUG}_draft`);
    if (saved) {
        const draft = JSON.parse(saved);
        if (draft.topic) {
            document.getElementById('researchTopic').value = draft.topic || '';
            document.getElementById('researchArea').value = draft.area || '';
            document.getElementById('industry').value = draft.industry || '';
            document.getElementById('keyTerms').value = draft.keyTerms || '';
            document.getElementById('methodology').value = draft.methodology || 'Mixed Methods';
            document.getElementById('sampleSize').value = draft.sampleSize || '';
        }
    }
}

function loadSavedProposal() {
    const saved = localStorage.getItem(`${CONFIG.TOOL_SLUG}_last_proposal`);
    if (saved) {
        const data = JSON.parse(saved);
        if (data.content && data.timestamp > Date.now() - 86400000) {
            document.getElementById('proposalViewer').innerHTML = data.content;
            document.getElementById('exportGroup').style.display = 'flex';
            state.hasGenerated = true;
        }
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    const generateBtn = document.getElementById('generateBtn');
    const aiBtn = document.getElementById('aiGenerateBtn');
    
    if (show) {
        spinner.classList.remove('hidden');
        generateBtn.disabled = true;
        aiBtn.disabled = true;
    } else {
        spinner.classList.add('hidden');
        generateBtn.disabled = false;
        aiBtn.disabled = false;
    }
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function escapeHTML(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function setupScrollButton() {
    window.addEventListener('scroll', function() {
        const scrollBtn = document.getElementById('scrollToTop');
        if (scrollBtn) {
            if (window.scrollY > 300) {
                scrollBtn.style.display = 'flex';
            } else {
                scrollBtn.style.display = 'none';
            }
        }
    });
}

function openModal() {
    const modal = document.getElementById('premiumModal');
    if (modal) modal.classList.remove('hidden');
}

function closeModal() {
    const modal = document.getElementById('premiumModal');
    if (modal) modal.classList.add('hidden');
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', function(e) {
    // Ctrl+Enter to generate
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        const btn = document.getElementById('generateBtn');
        if (btn && !btn.disabled) {
            generateProposal();
        }
    }
    // Escape to close modal
    if (e.key === 'Escape') {
        closeModal();
    }
});

// ============================================
// CONSOLE WELCOME
// ============================================
console.log('📚 %c' + CONFIG.TOOL_NAME + ' v' + CONFIG.VERSION, 'font-size:20px; font-weight:bold; color:#00d4ff;');
console.log('🔧 Tool: ' + CONFIG.TOOL_NAME);
console.log('📊 Category: ' + CONFIG.CATEGORY);
console.log('🌐 API: ' + CONFIG.API_BASE);
console.log('💡 Tip: Press Ctrl+Enter to generate proposal');
console.log('✨ ' + CONFIG.TOOL_NAME + ' is ready!');
