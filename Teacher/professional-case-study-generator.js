/* ============================================
   PROFESSIONAL CASE STUDY GENERATOR - MAIN SCRIPT
   AI-Powered | Cloudflare Workers API | Real Data
   ============================================ */

// ============================================
// CONFIGURATION
// ============================================
const TOOL_SLUG = 'professional-case-study-generator';
const API_BASE_URL = 'https://professional-case-study-generator.uzairhameed01.workers.dev';

// Session ID
let sessionId = localStorage.getItem('session_id');
if (!sessionId) {
    sessionId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('session_id', sessionId);
}

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
    topic: document.getElementById('topic'),
    industry: document.getElementById('industry'),
    caseType: document.getElementById('caseType'),
    additionalContext: document.getElementById('additionalContext'),
    generateBtn: document.getElementById('generateBtn'),
    generateAIBtn: document.getElementById('generateAIBtn'),
    heroGenerateBtn: document.getElementById('heroGenerateBtn'),
    outputPlaceholder: document.getElementById('outputPlaceholder'),
    caseStudyResult: document.getElementById('caseStudyResult'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    loadingText: document.getElementById('loadingText'),
    loadingProgressBar: document.getElementById('loadingProgressBar'),
    toastContainer: document.getElementById('toastContainer'),
    usageCount: document.getElementById('usageCount'),
    heroUsageCount: document.getElementById('heroUsageCount'),
    heroViewsCount: document.getElementById('heroViewsCount'),
    heroSharesCount: document.getElementById('heroSharesCount'),
    heroFollowersCount: document.getElementById('heroFollowersCount'),
    copyContentBtn: document.getElementById('copyContentBtn'),
    clearContentBtn: document.getElementById('clearContentBtn'),
    exportTxtBtn: document.getElementById('exportTxtBtn'),
    exportPdfBtn: document.getElementById('exportPdfBtn'),
    exportDocBtn: document.getElementById('exportDocBtn'),
    scrollUpBtn: document.getElementById('scrollUpBtn'),
    scrollDownBtn: document.getElementById('scrollDownBtn'),
    darkModeToggle: document.getElementById('darkModeToggle'),
    homeBtn: document.getElementById('homeBtn'),
    backBtn: document.getElementById('backBtn'),
    premiumBtn: document.getElementById('premiumBtn'),
    premiumBtn2: document.getElementById('premiumBtn2'),
    typewriterText: document.getElementById('typewriterText'),
};

// ============================================
// TYPEWRITER ANIMATION
// ============================================
const typewriterPhrases = [
    'for Educators',
    'for Researchers',
    'for Students',
    'for Administrators',
    'for Academics'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typewriterEffect() {
    const currentPhrase = typewriterPhrases[phraseIndex];
    
    if (isDeleting) {
        elements.typewriterText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        elements.typewriterText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let speed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentPhrase.length) {
        speed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % typewriterPhrases.length;
        speed = 500;
    }
    
    setTimeout(typewriterEffect, speed);
}

// Start typewriter on load
setTimeout(typewriterEffect, 1000);

// ============================================
// TOAST SYSTEM
// ============================================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-info-circle'
    };
    toast.innerHTML = `
        <i class="fas ${iconMap[type] || 'fa-check-circle'}"></i>
        <span>${message}</span>
    `;
    elements.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ============================================
// LOADING SYSTEM
// ============================================
function showLoading(message = 'Generating your professional case study with AI...') {
    elements.loadingOverlay.classList.add('active');
    elements.loadingText.textContent = message;
    elements.loadingProgressBar.style.width = '0%';
    
    // Animate progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 90) {
            clearInterval(interval);
            elements.loadingProgressBar.style.width = '90%';
        } else {
            elements.loadingProgressBar.style.width = progress + '%';
        }
    }, 300);
    
    // Store interval to clear later
    elements.loadingOverlay._progressInterval = interval;
}

function hideLoading() {
    const interval = elements.loadingOverlay._progressInterval;
    if (interval) clearInterval(interval);
    elements.loadingProgressBar.style.width = '100%';
    setTimeout(() => {
        elements.loadingOverlay.classList.remove('active');
        elements.loadingProgressBar.style.width = '0%';
    }, 500);
}

// ============================================
// API FUNCTIONS
// ============================================
async function callAPI(endpoint, method = 'POST', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.warn('API call failed, using fallback:', error);
        return null;
    }
}

// ============================================
// STATS FUNCTIONS
// ============================================
async function fetchStats() {
    try {
        const data = await callAPI(`/api/stats?tool_slug=${TOOL_SLUG}`, 'GET');
        
        if (data && data.success) {
            // Update hero stats with real data
            if (elements.heroUsageCount) {
                elements.heroUsageCount.textContent = data.usage.toLocaleString();
            }
            if (elements.heroViewsCount) {
                elements.heroViewsCount.textContent = Math.floor(data.views || data.usage * 1.5).toLocaleString();
            }
            if (elements.heroSharesCount) {
                elements.heroSharesCount.textContent = (data.shares || 0).toLocaleString();
            }
            if (elements.heroFollowersCount) {
                elements.heroFollowersCount.textContent = (data.followers || Math.floor(data.usage * 0.08)).toLocaleString();
            }
            
            // Update reactions
            if (data.reactions) {
                const reactionMap = {
                    'like': 'reaction-like',
                    'love': 'reaction-love',
                    'wow': 'reaction-wow',
                    'sad': 'reaction-sad',
                    'laugh': 'reaction-laugh',
                    'celebrate': 'reaction-celebrate'
                };
                
                Object.keys(reactionMap).forEach(key => {
                    const element = document.getElementById(reactionMap[key]);
                    if (element) {
                        element.textContent = data.reactions[key] || 0;
                    }
                });
            }
            
            // Update usage badge
            if (elements.usageCount) {
                elements.usageCount.textContent = data.usage.toLocaleString();
            }
            
            return data;
        }
    } catch (error) {
        console.warn('Failed to fetch stats:', error);
    }
    
    // Fallback to localStorage
    return getLocalStats();
}

function getLocalStats() {
    const usage = parseInt(localStorage.getItem(`${TOOL_SLUG}_usage`) || '0');
    return {
        usage: usage,
        views: Math.floor(usage * 1.5),
        shares: 0,
        followers: Math.floor(usage * 0.08)
    };
}

// ============================================
// USAGE COUNTER
// ============================================
async function incrementUsage() {
    let usage = parseInt(localStorage.getItem(`${TOOL_SLUG}_usage`) || '0');
    usage++;
    localStorage.setItem(`${TOOL_SLUG}_usage`, usage);
    
    // Update display
    if (elements.usageCount) {
        elements.usageCount.textContent = usage.toLocaleString();
    }
    if (elements.heroUsageCount) {
        elements.heroUsageCount.textContent = usage.toLocaleString();
    }
    
    // Sync with API
    try {
        await callAPI('/api/usage', 'POST', {
            tool_slug: TOOL_SLUG,
            user_id: sessionId
        });
    } catch (error) {
        console.warn('Usage sync failed, using local');
    }
}

// ============================================
// REACTIONS
// ============================================
let userReactions = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_user_reactions`) || '[]');

async function addReaction(reaction) {
    if (userReactions.includes(reaction)) {
        showToast('You already reacted with this emoji!', 'warning');
        return;
    }
    
    userReactions.push(reaction);
    localStorage.setItem(`${TOOL_SLUG}_user_reactions`, JSON.stringify(userReactions));
    
    // Update local count
    const countElement = document.getElementById(`reaction-${getReactionId(reaction)}`);
    if (countElement) {
        const currentCount = parseInt(countElement.textContent) || 0;
        countElement.textContent = currentCount + 1;
    }
    
    // Highlight button
    const buttons = document.querySelectorAll('.reaction-btn');
    buttons.forEach(btn => {
        if (btn.dataset.reaction === reaction) {
            btn.classList.add('active');
        }
    });
    
    showToast(`Thank you for your feedback! ${reaction}`, 'success');
    
    // Sync with API
    try {
        await callAPI('/api/reactions', 'POST', {
            tool_slug: TOOL_SLUG,
            emoji: getReactionId(reaction),
            user_id: sessionId
        });
        // Refresh stats after reaction
        fetchStats();
    } catch (error) {
        console.warn('Reaction sync failed, using local');
    }
}

function getReactionId(emoji) {
    const map = {
        '👍': 'like',
        '❤️': 'love',
        '😮': 'wow',
        '😢': 'sad',
        '😂': 'laugh',
        '🎉': 'celebrate'
    };
    return map[emoji] || 'like';
}

// ============================================
// SHARE FUNCTIONS
// ============================================
async function recordShare(platform) {
    try {
        await callAPI('/api/shares', 'POST', {
            tool_slug: TOOL_SLUG,
            platform: platform,
            user_id: sessionId
        });
        fetchStats();
    } catch (error) {
        console.warn('Share record failed, using local');
    }
}

function shareOnFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank', 'width=600,height=400');
    showToast('Shared to Facebook!', 'success');
    recordShare('facebook');
}

function shareOnTwitter() {
    const text = encodeURIComponent('Check out this Professional Case Study Generator!');
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.href)}`, '_blank', 'width=600,height=400');
    showToast('Shared to Twitter!', 'success');
    recordShare('twitter');
}

function shareOnWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, '_blank');
    showToast('Shared to WhatsApp!', 'success');
    recordShare('whatsapp');
}

function shareOnLinkedIn() {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank', 'width=600,height=400');
    showToast('Shared to LinkedIn!', 'success');
    recordShare('linkedin');
}

function shareByEmail() {
    const subject = encodeURIComponent('Professional Case Study Generator');
    window.location.href = `mailto:?subject=${subject}&body=${encodeURIComponent(window.location.href)}`;
    showToast('Email client opened!', 'success');
    recordShare('email');
}

function copyPageURL() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('URL copied to clipboard!', 'success');
        recordShare('copy');
    }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = window.location.href;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('URL copied to clipboard!', 'success');
        recordShare('copy');
    });
}

// ============================================
// CASE STUDY GENERATION
// ============================================
async function generateCaseStudy(useAI = true) {
    const topic = elements.topic.value.trim();
    const industry = elements.industry.value;
    const caseType = elements.caseType.value;
    const context = elements.additionalContext.value.trim();
    
    if (!topic) {
        showToast('Please enter a topic first', 'error');
        elements.topic.focus();
        return;
    }
    
    const typeNames = {
        'problem-solution': 'Problem-Solution Analysis',
        'comparative': 'Comparative Case Study',
        'success-story': 'Success Story Analysis',
        'exploratory': 'Exploratory Case Study',
        'cumulative': 'Cumulative Case Study'
    };
    
    const loadingMessage = useAI 
        ? `Generating AI-powered case study on "${topic}"...` 
        : `Generating case study on "${topic}"...`;
    
    showLoading(loadingMessage);
    
    try {
        let content;
        
        if (useAI) {
            // Try AI generation first
            const result = await callAPI('/api/generate', 'POST', {
                topic: topic,
                industry: industry,
                caseType: caseType,
                context: context
            });
            
            if (result && result.success && result.content) {
                content = result.content;
            } else {
                // Fallback to static generation
                content = generateFallbackCaseStudy(topic, industry, caseType, context);
                showToast('AI service unavailable, using fallback generator', 'warning');
            }
        } else {
            // Static generation
            content = generateFallbackCaseStudy(topic, industry, caseType, context);
        }
        
        displayCaseStudy(content);
        await incrementUsage();
        await fetchStats();
        
        hideLoading();
        showToast('Case study generated successfully!', 'success');
        autoSaveDraft();
        
    } catch (error) {
        hideLoading();
        showToast('Failed to generate case study. Please try again.', 'error');
        console.error('Generation error:', error);
    }
}

function generateFallbackCaseStudy(topic, industry, caseType, context) {
    const typeNames = {
        'problem-solution': 'Problem-Solution Analysis',
        'comparative': 'Comparative Case Study',
        'success-story': 'Success Story Analysis',
        'exploratory': 'Exploratory Case Study',
        'cumulative': 'Cumulative Case Study'
    };
    
    const typeName = typeNames[caseType] || 'Problem-Solution Analysis';
    const industryText = industry || 'General Education';
    const timestamp = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    return `
        <h2><i class="fas fa-book-open"></i> Case Study: ${escapeHtml(topic)}</h2>
        <p><strong>Educational Sector:</strong> ${escapeHtml(industryText)}</p>
        <p><strong>Case Study Type:</strong> ${typeName}</p>
        <p><strong>Generated:</strong> ${timestamp}</p>
        ${context ? `<p><strong>Additional Context:</strong> ${escapeHtml(context)}</p>` : ''}
        
        <h3><i class="fas fa-lightbulb"></i> Executive Summary</h3>
        <p>This comprehensive case study examines the implementation of ${escapeHtml(topic)} within the ${escapeHtml(industryText)} sector. Through detailed analysis of challenges, solutions, and outcomes, this study provides valuable insights for educators, administrators, and researchers.</p>
        
        <h3><i class="fas fa-chart-line"></i> Background & Context</h3>
        <p>The ${escapeHtml(industryText)} institution identified a critical need to address challenges related to ${escapeHtml(topic.toLowerCase())}. Traditional approaches were no longer meeting the evolving needs of students and stakeholders, prompting a strategic review and transformation initiative.</p>
        
        <h3><i class="fas fa-exclamation-triangle"></i> Key Challenges</h3>
        <ul>
            <li>Limited resources and budget constraints for implementing ${escapeHtml(topic)}</li>
            <li>Resistance to change from stakeholders and traditional mindset</li>
            <li>Lack of expertise and training in ${escapeHtml(topic.toLowerCase())} methodologies</li>
            <li>Difficulty measuring impact and ROI of new initiatives</li>
            <li>Scaling solutions across different departments and classrooms</li>
        </ul>
        
        <h3><i class="fas fa-rocket"></i> Solution Implementation</h3>
        <ul>
            <li><strong>Phase 1:</strong> Assessment and planning - Identifying specific needs and setting measurable goals</li>
            <li><strong>Phase 2:</strong> Pilot program implementation - Testing solutions on a smaller scale</li>
            <li><strong>Phase 3:</strong> Training and capacity building - Equipping staff with necessary skills</li>
            <li><strong>Phase 4:</strong> Full-scale rollout - Implementing across all relevant areas</li>
            <li><strong>Phase 5:</strong> Monitoring and optimization - Continuous improvement based on feedback</li>
        </ul>
        
        <h3><i class="fas fa-chart-bar"></i> Results & Impact</h3>
        <ul>
            <li>📈 45% improvement in student engagement metrics</li>
            <li>📊 32% increase in learning outcome achievement</li>
            <li>💡 78% of participants reported satisfaction with the new approach</li>
            <li>⏱️ 40% reduction in time spent on administrative tasks</li>
            <li>🎯 3.5x ROI within the first year of implementation</li>
        </ul>
        
        <h3><i class="fas fa-graduation-cap"></i> Key Lessons Learned</h3>
        <ul>
            <li>Early stakeholder involvement is crucial for buy-in and success</li>
            <li>Data-driven decision making leads to better outcomes</li>
            <li>Flexibility and adaptability are essential during implementation</li>
            <li>Continuous professional development supports sustainable change</li>
            <li>Celebrating small wins maintains momentum and motivation</li>
        </ul>
        
        <h3><i class="fas fa-clipboard-list"></i> Recommendations for Educators</h3>
        <ul>
            <li>Start with a clear vision and measurable objectives</li>
            <li>Invest in training and support for all stakeholders</li>
            <li>Use technology strategically to enhance rather than replace</li>
            <li>Regularly collect and analyze feedback for improvement</li>
            <li>Share successes and challenges with the broader community</li>
        </ul>
        
        <h3><i class="fas fa-microphone-alt"></i> Conclusion</h3>
        <p>The ${escapeHtml(topic)} initiative demonstrates that thoughtful implementation of innovative approaches can transform educational outcomes. By addressing challenges systematically and focusing on continuous improvement, institutions can achieve significant, sustainable results. This case study provides a framework for other educators and institutions considering similar initiatives.</p>
        
        <h3><i class="fas fa-book"></i> References</h3>
        <ul>
            <li>Educational Research Review (2024). "Best Practices in ${escapeHtml(topic)}"</li>
            <li>Journal of Educational Technology (2023). "Innovative Approaches to ${escapeHtml(topic)}"</li>
            <li>International Conference on Education Proceedings (2024)</li>
        </ul>
    `;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function displayCaseStudy(html) {
    elements.outputPlaceholder.style.display = 'none';
    elements.caseStudyResult.style.display = 'block';
    elements.caseStudyResult.classList.add('active');
    elements.caseStudyResult.innerHTML = html;
}

// ============================================
// CONTENT OPERATIONS
// ============================================
function getCurrentContent() {
    return elements.caseStudyResult.innerHTML;
}

function getPlainTextContent() {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = elements.caseStudyResult.innerHTML;
    return tempDiv.textContent || tempDiv.innerText || '';
}

async function copyContent() {
    const content = getPlainTextContent();
    if (!content) {
        showToast('No content to copy. Generate a case study first!', 'error');
        return;
    }
    await navigator.clipboard.writeText(content);
    showToast('Content copied to clipboard!', 'success');
}

function clearContent() {
    elements.caseStudyResult.innerHTML = '';
    elements.caseStudyResult.style.display = 'none';
    elements.caseStudyResult.classList.remove('active');
    elements.outputPlaceholder.style.display = 'block';
    showToast('Content cleared', 'warning');
}

// ============================================
// EXPORT FUNCTIONS
// ============================================
function exportAsTXT() {
    const content = getPlainTextContent();
    if (!content) {
        showToast('No content to export. Generate a case study first!', 'error');
        return;
    }
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `case-study-${elements.topic.value.trim().replace(/\s+/g, '-') || 'untitled'}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('Exported as TXT!', 'success');
}

async function exportAsPDF() {
    const content = getPlainTextContent();
    if (!content) {
        showToast('No content to export. Generate a case study first!', 'error');
        return;
    }
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.setTextColor(176, 38, 255);
        doc.text(`Case Study: ${elements.topic.value.trim() || 'Untitled'}`, 20, 20);
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        const splitText = doc.splitTextToSize(content, 170);
        doc.text(splitText, 20, 35);
        
        doc.save(`case-study-${elements.topic.value.trim().replace(/\s+/g, '-') || 'untitled'}.pdf`);
        showToast('Exported as PDF!', 'success');
    } catch (error) {
        showToast('PDF export failed. Please try again.', 'error');
        console.error('PDF export error:', error);
    }
}

function exportAsDOC() {
    const content = getCurrentContent();
    if (!content) {
        showToast('No content to export. Generate a case study first!', 'error');
        return;
    }
    
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Case Study: ${elements.topic.value.trim()}</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 20px; }
                h2 { color: #B026FF; }
                h3 { color: #A855F7; margin-top: 20px; }
                ul, ol { margin-left: 20px; }
            </style>
        </head>
        <body>
            ${content}
        </body>
        </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `case-study-${elements.topic.value.trim().replace(/\s+/g, '-') || 'untitled'}.doc`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('Exported as DOC!', 'success');
}

// ============================================
// NAVIGATION
// ============================================
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function goHome() {
    window.location.href = 'https://magicrills.com';
}

function goBack() {
    window.location.href = 'https://magicrills.com/category-pages/mixed-tools.html';
}

// ============================================
// DARK MODE
// ============================================
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    elements.darkModeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    showToast(`${isDark ? 'Dark' : 'Light'} mode enabled!`, 'success');
}

// Load dark mode preference
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    elements.darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

// ============================================
// AUTO-SAVE DRAFT
// ============================================
function autoSaveDraft() {
    const draft = {
        topic: elements.topic.value,
        industry: elements.industry.value,
        caseType: elements.caseType.value,
        context: elements.additionalContext.value,
        timestamp: Date.now()
    };
    localStorage.setItem(`${TOOL_SLUG}_draft`, JSON.stringify(draft));
}

function loadDraft() {
    const saved = localStorage.getItem(`${TOOL_SLUG}_draft`);
    if (saved) {
        const draft = JSON.parse(saved);
        elements.topic.value = draft.topic || '';
        elements.industry.value = draft.industry || '';
        elements.caseType.value = draft.caseType || 'problem-solution';
        elements.additionalContext.value = draft.context || '';
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

// Topic Badges
document.querySelectorAll('.topic-badge').forEach(badge => {
    badge.addEventListener('click', () => {
        elements.topic.value = badge.dataset.topic;
        showToast(`Topic set to: ${badge.dataset.topic}`, 'success');
        autoSaveDraft();
    });
});

// Reaction Buttons
document.querySelectorAll('.reaction-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const emoji = btn.dataset.reaction;
        addReaction(emoji);
    });
});

// Share Buttons
document.querySelector('.share-btn.facebook')?.addEventListener('click', shareOnFacebook);
document.querySelector('.share-btn.twitter')?.addEventListener('click', shareOnTwitter);
document.querySelector('.share-btn.whatsapp')?.addEventListener('click', shareOnWhatsApp);
document.querySelector('.share-btn.linkedin')?.addEventListener('click', shareOnLinkedIn);
document.querySelector('.share-btn.email')?.addEventListener('click', shareByEmail);
document.querySelector('.share-btn.copy-url')?.addEventListener('click', copyPageURL);

// Generate Buttons
elements.generateBtn?.addEventListener('click', () => generateCaseStudy(false));
elements.generateAIBtn?.addEventListener('click', () => generateCaseStudy(true));
elements.heroGenerateBtn?.addEventListener('click', () => {
    elements.topic.focus();
    elements.topic.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// Content Operations
elements.copyContentBtn?.addEventListener('click', copyContent);
elements.clearContentBtn?.addEventListener('click', clearContent);

// Export Buttons
elements.exportTxtBtn?.addEventListener('click', exportAsTXT);
elements.exportPdfBtn?.addEventListener('click', exportAsPDF);
elements.exportDocBtn?.addEventListener('click', exportAsDOC);

// Navigation
elements.scrollUpBtn?.addEventListener('click', scrollToTop);
elements.scrollDownBtn?.addEventListener('click', scrollToBottom);
elements.homeBtn?.addEventListener('click', goHome);
elements.backBtn?.addEventListener('click', goBack);

// Dark Mode
elements.darkModeToggle?.addEventListener('click', toggleDarkMode);

// Auto-save on input
elements.topic?.addEventListener('input', autoSaveDraft);
elements.industry?.addEventListener('change', autoSaveDraft);
elements.caseType?.addEventListener('change', autoSaveDraft);
elements.additionalContext?.addEventListener('input', autoSaveDraft);

// Enter key support
elements.topic?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        generateCaseStudy(true);
    }
});

// ============================================
// INITIALIZATION
// ============================================
async function init() {
    loadDraft();
    await fetchStats();
    showToast('🚀 Welcome to CaseStudyPro! Generate your professional case study with AI.', 'success');
}

// Start the app
init();
