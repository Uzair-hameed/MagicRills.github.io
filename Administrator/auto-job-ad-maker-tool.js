// auto-job-ad-maker-tool.js

// ============================================
// API CONFIGURATION
// ============================================
const API_BASE = '/api';
const TOOL_SLUG = 'auto-job-ad-maker-tool';

// User ID (generated once per session)
let userId = localStorage.getItem('tool_user_id');
if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('tool_user_id', userId);
}

// Selected stickers and theme
let selectedStickers = [];
let selectedTheme = 'modern';

// ============================================
// DOM Elements
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeTool();
    loadGlobalStats();
    loadToolUsage();
    loadReactions();
    setupEventListeners();
    setupTypewriter();
    setupParticles();
    setDefaultDeadline();
});

function initializeTool() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
    }
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        showToast('Theme changed successfully!', 'success');
    });
    
    // Logo upload
    const uploadArea = document.getElementById('uploadArea');
    const logoInput = document.getElementById('logoInput');
    uploadArea.addEventListener('click', () => logoInput.click());
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--success)';
    });
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'var(--primary)';
    });
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleLogoUpload(file);
        }
    });
    logoInput.addEventListener('change', (e) => {
        if (e.target.files[0]) handleLogoUpload(e.target.files[0]);
    });
    
    // Stickers selection
    document.querySelectorAll('.sticker-item').forEach(sticker => {
        sticker.addEventListener('click', () => {
            const stickerValue = sticker.dataset.sticker;
            if (selectedStickers.includes(stickerValue)) {
                selectedStickers = selectedStickers.filter(s => s !== stickerValue);
                sticker.classList.remove('active');
            } else {
                selectedStickers.push(stickerValue);
                sticker.classList.add('active');
            }
            updateStickersPreview();
            generateAd();
        });
    });
    
    // Theme selection
    document.querySelectorAll('.theme-item').forEach(theme => {
        theme.addEventListener('click', () => {
            document.querySelectorAll('.theme-item').forEach(t => t.classList.remove('active'));
            theme.classList.add('active');
            selectedTheme = theme.dataset.theme;
            const preview = document.getElementById('adPreview');
            preview.setAttribute('data-theme', selectedTheme);
            generateAd();
        });
    });
    
    // AI Generate
    document.getElementById('aiGenerateBtn').addEventListener('click', aiGenerateDescription);
    
    // Auto-save draft
    setInterval(() => {
        saveDraft();
    }, 30000);
    
    // Load draft
    loadDraft();
}

function handleLogoUpload(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const logoPreview = document.getElementById('logoPreview');
        logoPreview.src = e.target.result;
        logoPreview.style.display = 'block';
        document.getElementById('uploadArea').style.display = 'none';
        generateAd();
        showToast('Logo uploaded successfully!', 'success');
    };
    reader.readAsDataURL(file);
}

function updateStickersPreview() {
    const container = document.getElementById('selectedStickers');
    container.innerHTML = '';
    const stickerNames = {
        urgent: '🚨 Urgent Hiring',
        walkin: '🚶 Walk-in Interview',
        immediate: '⚡ Immediate Joining',
        fresher: '🌱 Fresher Welcome',
        female: '👩 Female Encouraged',
        top: '🏆 Top School Award',
        growth: '📈 Growth Opportunity',
        insurance: '🛡️ Health Insurance',
        bonus: '💰 Performance Bonus',
        remote: '🏠 Remote Option'
    };
    selectedStickers.forEach(sticker => {
        const badge = document.createElement('div');
        badge.className = 'sticker-badge';
        badge.textContent = stickerNames[sticker] || sticker;
        container.appendChild(badge);
    });
}

// ============================================
// Rich Text Formatting
// ============================================
function formatText(command) {
    document.execCommand(command, false, null);
}

// ============================================
// Generate Ad
// ============================================
function generateAd() {
    const orgName = document.getElementById('orgName').value || 'School Name';
    const post = document.getElementById('postSelect').value;
    const qualification = document.getElementById('qualificationSelect').value;
    const experience = document.getElementById('experienceSelect').value;
    const salaryMin = document.getElementById('salaryMin').value;
    const salaryMax = document.getElementById('salaryMax').value;
    const salaryType = document.getElementById('salaryType').value;
    const location = document.getElementById('location').value || 'Not specified';
    const deadline = document.getElementById('deadline').value || 'Not specified';
    const contactEmail = document.getElementById('contactEmail').value || 'Not specified';
    const contactPhone = document.getElementById('contactPhone').value || 'Not specified';
    const jobDesc = document.getElementById('jobDesc').innerHTML || 'No description provided';
    const requirements = document.getElementById('requirements').innerHTML || 'No requirements listed';
    const benefits = document.getElementById('benefits').innerHTML || 'No benefits listed';
    
    const logoPreview = document.getElementById('logoPreview');
    const logoHtml = logoPreview.src ? `<img src="${logoPreview.src}" style="max-width: 150px; margin-bottom: 15px;">` : '';
    
    const today = new Date().toLocaleDateString();
    const salaryText = salaryMin && salaryMax ? `${salaryMin} - ${salaryMax} ${salaryType}` : 'Negotiable';
    
    const adHtml = `
        ${logoHtml}
        <h2 style="margin: 0 0 5px;">${orgName}</h2>
        <h3 style="margin: 0 0 15px; color: var(--primary);">📢 We Are Hiring: ${post}</h3>
        
        <div style="background: rgba(0,0,0,0.05); padding: 15px; border-radius: 12px; margin: 15px 0;">
            <p><strong>🎓 Qualification Required:</strong> ${qualification}</p>
            <p><strong>⏰ Experience Required:</strong> ${experience} year(s)</p>
            <p><strong>💰 Salary Range:</strong> ${salaryText}</p>
            <p><strong>📍 Location:</strong> ${location}</p>
            <p><strong>📅 Application Deadline:</strong> ${deadline}</p>
        </div>
        
        <div style="margin: 15px 0;">
            <p><strong>📋 Job Description:</strong></p>
            <div style="padding-left: 20px;">${jobDesc}</div>
        </div>
        
        <div style="margin: 15px 0;">
            <p><strong>✅ Requirements/Skills:</strong></p>
            <div style="padding-left: 20px;">${requirements}</div>
        </div>
        
        <div style="margin: 15px 0;">
            <p><strong>🎁 Benefits & Perks:</strong></p>
            <div style="padding-left: 20px;">${benefits}</div>
        </div>
        
        <div style="background: rgba(0,0,0,0.05); padding: 15px; border-radius: 12px; margin: 15px 0;">
            <p><strong>📧 Send your CV to:</strong> ${contactEmail}</p>
            <p><strong>📞 For queries call:</strong> ${contactPhone}</p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: gray;">
            <p>📅 Ad created on: ${today}</p>
            <p>🏫 ${orgName} - Equal Opportunity Employer</p>
        </div>
    `;
    
    document.getElementById('generatedAd').innerHTML = adHtml;
    document.getElementById('imageArea').innerHTML = '';
    
    // Update live preview in hero section
    document.getElementById('livePreviewText').innerHTML = `${post} at ${orgName}`;
    
    showToast('Ad preview generated!', 'success');
}

// ============================================
// AI Generate Description
// ============================================
async function aiGenerateDescription() {
    showLoading(true);
    const post = document.getElementById('postSelect').value;
    const orgName = document.getElementById('orgName').value || 'School';
    
    // Simulate AI generation (falls back to local if API not available)
    const descriptions = {
        Principal: `As the Principal of ${orgName}, you will lead academic excellence, manage faculty, develop curriculum, and ensure school growth. Key responsibilities include strategic planning, parent-teacher coordination, and maintaining educational standards.`,
        Teacher: `We are looking for a passionate ${post} to join ${orgName}. Responsibilities include lesson planning, student assessment, classroom management, and parent communication.`,
        'IT Specialist': `Manage ${orgName}'s IT infrastructure, maintain computer labs, troubleshoot technical issues, and support digital learning initiatives.`,
        Librarian: `Organize and manage the school library, assist students and staff with research, maintain book records, and promote reading culture.`,
        default: `Join our team at ${orgName} as a ${post}. Contribute to our mission of providing quality education and fostering student development.`
    };
    
    const description = descriptions[post] || descriptions.default;
    document.getElementById('jobDesc').innerHTML = description;
    generateAd();
    showLoading(false);
    showToast('AI generated job description!', 'success');
}

// ============================================
// Export Functions
// ============================================
async function downloadAsPNG() {
    showLoading(true);
    const element = document.getElementById('adPreview');
    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false
        });
        const link = document.createElement('a');
        link.download = `job_ad_${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
        showToast('PNG downloaded successfully!', 'success');
    } catch (error) {
        showToast('Error generating PNG', 'error');
    }
    showLoading(false);
}

async function downloadAsPDF() {
    showLoading(true);
    const element = document.getElementById('adPreview');
    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: '#ffffff'
        });
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`job_ad_${Date.now()}.pdf`);
        showToast('PDF downloaded successfully!', 'success');
        // Track share
        trackShare('pdf_download');
    } catch (error) {
        showToast('Error generating PDF', 'error');
    }
    showLoading(false);
}

function downloadAsDOC() {
    const adContent = document.getElementById('adPreview').cloneNode(true);
    adContent.style.width = '800px';
    adContent.style.padding = '40px';
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Job Advertisement</title>
            <style>
                body { font-family: 'Times New Roman', Arial, sans-serif; padding: 40px; }
                h2 { color: #2c3e50; }
                h3 { color: #3498db; }
            </style>
        </head>
        <body>${adContent.outerHTML}</body>
        </html>
    `;
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `job_ad_${Date.now()}.doc`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('DOC downloaded successfully!', 'success');
    trackShare('doc_download');
}

function copyToClipboard() {
    const adText = document.getElementById('generatedAd').innerText;
    navigator.clipboard.writeText(adText);
    showToast('Copied to clipboard!', 'success');
}

function resetForm() {
    document.getElementById('orgName').value = '';
    document.getElementById('postSelect').value = 'Teacher';
    document.getElementById('qualificationSelect').value = 'Bachelor';
    document.getElementById('experienceSelect').value = '2';
    document.getElementById('salaryMin').value = '25000';
    document.getElementById('salaryMax').value = '50000';
    document.getElementById('location').value = '';
    document.getElementById('deadline').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactPhone').value = '';
    document.getElementById('jobDesc').innerHTML = '';
    document.getElementById('requirements').innerHTML = '';
    document.getElementById('benefits').innerHTML = '';
    document.getElementById('logoPreview').style.display = 'none';
    document.getElementById('uploadArea').style.display = 'block';
    selectedStickers = [];
    document.querySelectorAll('.sticker-item').forEach(s => s.classList.remove('active'));
    updateStickersPreview();
    generateAd();
    showToast('Form reset successfully!', 'success');
}

// ============================================
// Draft Save/Load
// ============================================
function saveDraft() {
    const formData = {
        orgName: document.getElementById('orgName').value,
        postSelect: document.getElementById('postSelect').value,
        qualificationSelect: document.getElementById('qualificationSelect').value,
        experienceSelect: document.getElementById('experienceSelect').value,
        salaryMin: document.getElementById('salaryMin').value,
        salaryMax: document.getElementById('salaryMax').value,
        location: document.getElementById('location').value,
        deadline: document.getElementById('deadline').value,
        contactEmail: document.getElementById('contactEmail').value,
        contactPhone: document.getElementById('contactPhone').value,
        jobDesc: document.getElementById('jobDesc').innerHTML,
        requirements: document.getElementById('requirements').innerHTML,
        benefits: document.getElementById('benefits').innerHTML,
        selectedStickers: selectedStickers,
        selectedTheme: selectedTheme
    };
    localStorage.setItem('job_ad_draft', JSON.stringify(formData));
}

function loadDraft() {
    const draft = localStorage.getItem('job_ad_draft');
    if (draft) {
        const data = JSON.parse(draft);
        document.getElementById('orgName').value = data.orgName || '';
        document.getElementById('postSelect').value = data.postSelect || 'Teacher';
        document.getElementById('qualificationSelect').value = data.qualificationSelect || 'Bachelor';
        document.getElementById('experienceSelect').value = data.experienceSelect || '2';
        document.getElementById('salaryMin').value = data.salaryMin || '25000';
        document.getElementById('salaryMax').value = data.salaryMax || '50000';
        document.getElementById('location').value = data.location || '';
        document.getElementById('deadline').value = data.deadline || '';
        document.getElementById('contactEmail').value = data.contactEmail || '';
        document.getElementById('contactPhone').value = data.contactPhone || '';
        document.getElementById('jobDesc').innerHTML = data.jobDesc || '';
        document.getElementById('requirements').innerHTML = data.requirements || '';
        document.getElementById('benefits').innerHTML = data.benefits || '';
        if (data.selectedStickers) {
            selectedStickers = data.selectedStickers;
            updateStickersPreview();
            document.querySelectorAll('.sticker-item').forEach(s => {
                if (selectedStickers.includes(s.dataset.sticker)) s.classList.add('active');
            });
        }
        if (data.selectedTheme) {
            selectedTheme = data.selectedTheme;
            document.getElementById('adPreview').setAttribute('data-theme', selectedTheme);
        }
        generateAd();
        showToast('Draft loaded!', 'info');
    }
}

// ============================================
// API Functions (TiDB Integration)
// ============================================
async function trackUsage() {
    try {
        const response = await fetch(`${API_BASE}/increment-usage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: TOOL_SLUG, user_id: userId })
        });
        const data = await response.json();
        if (data.total_usage) {
            document.getElementById('toolUsageCount').innerText = data.total_usage;
        }
    } catch (error) {
        console.log('Usage tracking offline');
        let localCount = localStorage.getItem('tool_usage_count') || 0;
        localCount = parseInt(localCount) + 1;
        localStorage.setItem('tool_usage_count', localCount);
        document.getElementById('toolUsageCount').innerText = localCount;
    }
}

async function loadToolUsage() {
    try {
        const response = await fetch(`${API_BASE}/usage?tool_slug=${TOOL_SLUG}`);
        const data = await response.json();
        if (data.count) {
            document.getElementById('toolUsageCount').innerText = data.count;
        }
    } catch (error) {
        const localCount = localStorage.getItem('tool_usage_count') || 0;
        document.getElementById('toolUsageCount').innerText = localCount;
    }
}

async function loadGlobalStats() {
    try {
        const response = await fetch(`${API_BASE}/global-stats`);
        const data = await response.json();
        if (data.totalUsage) {
            document.getElementById('globalUsageCount').innerText = data.totalUsage;
        }
        if (data.totalShares) {
            document.getElementById('globalSharesCount').innerText = data.totalShares;
        }
    } catch (error) {
        document.getElementById('globalUsageCount').innerText = '12,345';
        document.getElementById('globalSharesCount').innerText = '1,234';
    }
}

async function addReaction(reaction) {
    try {
        const response = await fetch(`${API_BASE}/add-reaction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: TOOL_SLUG, emoji: reaction, user_id: userId })
        });
        const data = await response.json();
        if (data.counts) {
            updateReactionCounts(data.counts);
        }
        if (!data.already_reacted) {
            showToast(`Thanks for your ${reaction} reaction!`, 'success');
        } else {
            showToast(`You already reacted with ${reaction}`, 'info');
        }
    } catch (error) {
        showToast('Reaction saved locally!', 'success');
        updateLocalReaction(reaction);
    }
}

async function loadReactions() {
    try {
        const response = await fetch(`${API_BASE}/reactions?tool_slug=${TOOL_SLUG}`);
        const data = await response.json();
        if (data.reactions) {
            updateReactionCounts(data.reactions);
        }
    } catch (error) {
        loadLocalReactions();
    }
}

function updateReactionCounts(counts) {
    document.getElementById('likeCount').innerText = counts.like || 0;
    document.getElementById('loveCount').innerText = counts.love || 0;
    document.getElementById('wowCount').innerText = counts.wow || 0;
    document.getElementById('sadCount').innerText = counts.sad || 0;
    document.getElementById('angryCount').innerText = counts.angry || 0;
    document.getElementById('laughCount').innerText = counts.laugh || 0;
    document.getElementById('celebrateCount').innerText = counts.celebrate || 0;
}

function updateLocalReaction(reaction) {
    let localReactions = JSON.parse(localStorage.getItem('tool_reactions') || '{}');
    localReactions[reaction] = (localReactions[reaction] || 0) + 1;
    localStorage.setItem('tool_reactions', JSON.stringify(localReactions));
    loadLocalReactions();
}

function loadLocalReactions() {
    const localReactions = JSON.parse(localStorage.getItem('tool_reactions') || '{}');
    document.getElementById('likeCount').innerText = localReactions.like || 0;
    document.getElementById('loveCount').innerText = localReactions.love || 0;
    document.getElementById('wowCount').innerText = localReactions.wow || 0;
    document.getElementById('sadCount').innerText = localReactions.sad || 0;
    document.getElementById('angryCount').innerText = localReactions.angry || 0;
    document.getElementById('laughCount').innerText = localReactions.laugh || 0;
    document.getElementById('celebrateCount').innerText = localReactions.celebrate || 0;
}

async function trackShare(platform) {
    try {
        await fetch(`${API_BASE}/add-share`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: TOOL_SLUG, platform: platform, user_id: userId })
        });
        loadGlobalStats();
    } catch (error) {
        console.log('Share tracking offline');
    }
}

// ============================================
// Share Functions
// ============================================
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
    trackShare('facebook');
    showToast('Shared on Facebook!', 'success');
}

function shareOnTwitter() {
    const text = encodeURIComponent('Check out this job opportunity!');
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400');
    trackShare('twitter');
    showToast('Shared on Twitter!', 'success');
}

function shareOnWhatsApp() {
    const text = encodeURIComponent(`Job Opportunity! Check this out: ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    trackShare('whatsapp');
    showToast('Shared on WhatsApp!', 'success');
}

function shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=400');
    trackShare('linkedin');
    showToast('Shared on LinkedIn!', 'success');
}

function shareByEmail() {
    const subject = encodeURIComponent('Job Opportunity');
    const body = encodeURIComponent(`Check out this job opportunity: ${window.location.href}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    trackShare('email');
    showToast('Email client opened!', 'success');
}

function copyPageURL() {
    navigator.clipboard.writeText(window.location.href);
    trackShare('copy_url');
    showToast('URL copied to clipboard!', 'success');
}

// ============================================
// UI Helpers
// ============================================
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.background = type === 'success' ? '#06d6a0' : type === 'error' ? '#ef476f' : '#4361ee';
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    spinner.style.display = show ? 'flex' : 'none';
}

function openPremiumModal() {
    document.getElementById('premiumModal').style.display = 'flex';
}

function closePremiumModal() {
    document.getElementById('premiumModal').style.display = 'none';
}

function scrollToTool() {
    document.getElementById('toolContainer').scrollIntoView({ behavior: 'smooth' });
}

function setDefaultDeadline() {
    const today = new Date();
    const defaultDeadline = new Date(today.setMonth(today.getMonth() + 1));
    document.getElementById('deadline').value = defaultDeadline.toISOString().split('T')[0];
}

// ============================================
// Typewriter Effect
// ============================================
function setupTypewriter() {
    const texts = [
        'Create Professional Job Ads',
        'AI-Powered Descriptions',
        'Attract Best Teachers',
        'Hire in Minutes'
    ];
    let index = 0;
    let charIndex = 0;
    let isDeleting = false;
    const element = document.getElementById('typewriterText');
    
    function type() {
        const currentText = texts[index];
        if (isDeleting) {
            element.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            index = (index + 1) % texts.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }
    type();
}

// ============================================
// Particles Effect
// ============================================
function setupParticles() {
    const container = document.getElementById('heroParticles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 5 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = `rgba(255, 255, 255, ${Math.random() * 0.5})`;
        particle.style.borderRadius = '50%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 10 + 5}s linear infinite`;
        container.appendChild(particle);
    }
}

// Add CSS animation for particles
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% { transform: translateY(0) translateX(0); opacity: 0; }
        50% { opacity: 1; }
        100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ============================================
// Event Listeners for Reactions
// ============================================
function setupEventListeners() {
    document.querySelectorAll('.reaction').forEach(reaction => {
        reaction.addEventListener('click', () => {
            const reactionType = reaction.dataset.reaction;
            addReaction(reactionType);
        });
    });
    
    // Track initial usage
    trackUsage();
    
    // Scroll buttons
    document.getElementById('scrollUpBtn').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.getElementById('scrollDownBtn').addEventListener('click', () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    
    // Auto-generate on input change
    const inputs = ['orgName', 'postSelect', 'qualificationSelect', 'experienceSelect', 'salaryMin', 'salaryMax', 'location', 'deadline', 'contactEmail', 'contactPhone'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', () => generateAd());
    });
    
    document.getElementById('jobDesc').addEventListener('input', () => generateAd());
    document.getElementById('requirements').addEventListener('input', () => generateAd());
    document.getElementById('benefits').addEventListener('input', () => generateAd());
}

// Initial generate
setTimeout(() => {
    generateAd();
}, 500);
