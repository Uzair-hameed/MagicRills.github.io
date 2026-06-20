// auto-job-ad-maker-tool.js
// ============================================
// CLOUDFLARE WORKERS API CONFIGURATION
// ============================================
const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';
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
// DOM ELEMENTS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initializeTool();
    loadGlobalStats();
    loadToolUsage();
    loadReactions();
    setupEventListeners();
    setupTypewriter();
    setupParticles();
    setDefaultDeadline();
    // Track usage on load
    trackUsage();
});

function initializeTool() {
    // Theme toggle
    var themeToggle = document.getElementById('themeToggle');
    var savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
    }
    themeToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        showToast('Theme changed successfully!', 'success');
    });
    
    // Logo upload
    var uploadArea = document.getElementById('uploadArea');
    var logoInput = document.getElementById('logoInput');
    uploadArea.addEventListener('click', function() { logoInput.click(); });
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--success)';
    });
    uploadArea.addEventListener('dragleave', function() {
        uploadArea.style.borderColor = 'var(--primary)';
    });
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        var file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleLogoUpload(file);
        }
    });
    logoInput.addEventListener('change', function(e) {
        if (e.target.files[0]) handleLogoUpload(e.target.files[0]);
    });
    
    // Stickers selection
    document.querySelectorAll('.sticker-item').forEach(function(sticker) {
        sticker.addEventListener('click', function() {
            var stickerValue = sticker.dataset.sticker;
            if (selectedStickers.includes(stickerValue)) {
                selectedStickers = selectedStickers.filter(function(s) { return s !== stickerValue; });
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
    document.querySelectorAll('.theme-item').forEach(function(theme) {
        theme.addEventListener('click', function() {
            document.querySelectorAll('.theme-item').forEach(function(t) { t.classList.remove('active'); });
            theme.classList.add('active');
            selectedTheme = theme.dataset.theme;
            var preview = document.getElementById('adPreview');
            preview.setAttribute('data-theme', selectedTheme);
            generateAd();
        });
    });
    
    // AI Generate
    document.getElementById('aiGenerateBtn').addEventListener('click', aiGenerateDescription);
    
    // Auto-save draft
    setInterval(function() {
        saveDraft();
    }, 30000);
    
    // Load draft
    loadDraft();
}

function handleLogoUpload(file) {
    var reader = new FileReader();
    reader.onload = function(e) {
        var logoPreview = document.getElementById('logoPreview');
        logoPreview.src = e.target.result;
        logoPreview.style.display = 'block';
        document.getElementById('uploadArea').style.display = 'none';
        generateAd();
        showToast('Logo uploaded successfully!', 'success');
    };
    reader.readAsDataURL(file);
}

function updateStickersPreview() {
    var container = document.getElementById('selectedStickers');
    container.innerHTML = '';
    var stickerNames = {
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
    selectedStickers.forEach(function(sticker) {
        var badge = document.createElement('div');
        badge.className = 'sticker-badge';
        badge.textContent = stickerNames[sticker] || sticker;
        container.appendChild(badge);
    });
}

// ============================================
// RICH TEXT FORMATTING
// ============================================
function formatText(command) {
    document.execCommand(command, false, null);
}

// ============================================
// GENERATE AD
// ============================================
function generateAd() {
    var orgName = document.getElementById('orgName').value || 'School Name';
    var post = document.getElementById('postSelect').value;
    var qualification = document.getElementById('qualificationSelect').value;
    var experience = document.getElementById('experienceSelect').value;
    var salaryMin = document.getElementById('salaryMin').value;
    var salaryMax = document.getElementById('salaryMax').value;
    var salaryType = document.getElementById('salaryType').value;
    var location = document.getElementById('location').value || 'Not specified';
    var deadline = document.getElementById('deadline').value || 'Not specified';
    var contactEmail = document.getElementById('contactEmail').value || 'Not specified';
    var contactPhone = document.getElementById('contactPhone').value || 'Not specified';
    var jobDesc = document.getElementById('jobDesc').innerHTML || 'No description provided';
    var requirements = document.getElementById('requirements').innerHTML || 'No requirements listed';
    var benefits = document.getElementById('benefits').innerHTML || 'No benefits listed';
    
    var logoPreview = document.getElementById('logoPreview');
    var logoHtml = logoPreview.src ? '<img src="' + logoPreview.src + '" style="max-width: 150px; margin-bottom: 15px; border-radius: 8px;">' : '';
    
    var today = new Date().toLocaleDateString();
    var salaryText = salaryMin && salaryMax ? salaryMin + ' - ' + salaryMax + ' ' + salaryType : 'Negotiable';
    
    var adHtml = `
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
    document.getElementById('livePreviewText').innerHTML = post + ' at ' + orgName;
    
    showToast('Ad preview generated!', 'success');
}

// ============================================
// AI GENERATE DESCRIPTION
// ============================================
async function aiGenerateDescription() {
    showLoading(true);
    var post = document.getElementById('postSelect').value;
    var orgName = document.getElementById('orgName').value || 'School';
    
    // Simulate AI generation (falls back to local if API not available)
    var descriptions = {
        Principal: 'As the Principal of ' + orgName + ', you will lead academic excellence, manage faculty, develop curriculum, and ensure school growth. Key responsibilities include strategic planning, parent-teacher coordination, and maintaining educational standards.',
        'Head Teacher': 'We are seeking an experienced Head Teacher for ' + orgName + '. You will oversee academic programs, mentor teachers, coordinate with parents, and ensure student success.',
        Teacher: 'We are looking for a passionate ' + post + ' to join ' + orgName + '. Responsibilities include lesson planning, student assessment, classroom management, and parent communication.',
        Coordinator: 'Coordinate academic activities at ' + orgName + '. Manage curriculum implementation, teacher training, and student performance tracking.',
        'Admin': 'Manage administrative operations at ' + orgName + '. Handle admissions, staff records, facility management, and parent inquiries.',
        'Assistant Teacher': 'Support lead teachers at ' + orgName + ' in classroom activities, student supervision, and lesson preparation.',
        'IT Specialist': 'Manage ' + orgName + '\'s IT infrastructure, maintain computer labs, troubleshoot technical issues, and support digital learning initiatives.',
        Librarian: 'Organize and manage the school library, assist students and staff with research, maintain book records, and promote reading culture.',
        'HR Manager': 'Lead HR operations at ' + orgName + '. Manage recruitment, staff development, performance reviews, and employee relations.',
        Receptionist: 'Be the first point of contact at ' + orgName + '. Manage calls, visitors, inquiries, and administrative support.',
        Accountant: 'Manage financial operations at ' + orgName + '. Handle budgeting, payroll, fees collection, and financial reporting.',
        'Lab Assistant': 'Support science laboratories at ' + orgName + '. Prepare materials, maintain equipment, and assist teachers during practical sessions.',
        'Sports Coach': 'Lead sports programs at ' + orgName + '. Train students, organize competitions, and promote physical education.',
        Driver: 'Safely transport students and staff for ' + orgName + '. Maintain vehicle, follow routes, and ensure passenger safety.',
        'Security Guard': 'Ensure safety and security at ' + orgName + '. Monitor premises, control access, and respond to emergencies.',
        default: 'Join our team at ' + orgName + ' as a ' + post + '. Contribute to our mission of providing quality education and fostering student development.'
    };
    
    var description = descriptions[post] || descriptions.default;
    document.getElementById('jobDesc').innerHTML = description;
    generateAd();
    showLoading(false);
    showToast('AI generated job description!', 'success');
}

// ============================================
// EXPORT FUNCTIONS
// ============================================
async function downloadAsPNG() {
    showLoading(true);
    var element = document.getElementById('adPreview');
    try {
        var canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false
        });
        var link = document.createElement('a');
        link.download = 'job_ad_' + Date.now() + '.png';
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
    var element = document.getElementById('adPreview');
    try {
        var canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: '#ffffff'
        });
        var imgData = canvas.toDataURL('image/png');
        var { jsPDF } = window.jspdf;
        var pdf = new jsPDF('p', 'mm', 'a4');
        var imgWidth = 210;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('job_ad_' + Date.now() + '.pdf');
        showToast('PDF downloaded successfully!', 'success');
        // Track share
        trackShare('pdf_download');
    } catch (error) {
        showToast('Error generating PDF', 'error');
    }
    showLoading(false);
}

function downloadAsDOC() {
    var adContent = document.getElementById('adPreview').cloneNode(true);
    adContent.style.width = '800px';
    adContent.style.padding = '40px';
    var htmlContent = `
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
    var blob = new Blob([htmlContent], { type: 'application/msword' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'job_ad_' + Date.now() + '.doc';
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('DOC downloaded successfully!', 'success');
    trackShare('doc_download');
}

function copyToClipboard() {
    var adText = document.getElementById('generatedAd').innerText;
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
    document.querySelectorAll('.sticker-item').forEach(function(s) { s.classList.remove('active'); });
    updateStickersPreview();
    generateAd();
    showToast('Form reset successfully!', 'success');
}

// ============================================
// DRAFT SAVE/LOAD
// ============================================
function saveDraft() {
    var formData = {
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
    var draft = localStorage.getItem('job_ad_draft');
    if (draft) {
        var data = JSON.parse(draft);
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
            document.querySelectorAll('.sticker-item').forEach(function(s) {
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
// CLOUDFLARE WORKERS API FUNCTIONS
// ============================================

// 1. POST /api/usage - Usage Counter Increment
async function trackUsage() {
    try {
        var response = await fetch(API_BASE + '/api/usage', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                tool_slug: TOOL_SLUG, 
                user_id: userId 
            })
        });
        
        if (!response.ok) throw new Error('API response not OK');
        
        var data = await response.json();
        if (data.total_usage !== undefined) {
            document.getElementById('toolUsageCount').innerText = data.total_usage;
            // Update global stats too
            updateGlobalStats(data);
        }
        console.log('✅ Usage tracked successfully');
    } catch (error) {
        console.warn('⚠️ Usage tracking failed, using LocalStorage fallback:', error.message);
        // LocalStorage fallback
        var localCount = parseInt(localStorage.getItem('tool_usage_count') || '0');
        localCount += 1;
        localStorage.setItem('tool_usage_count', localCount);
        document.getElementById('toolUsageCount').innerText = localCount;
        // Also update global from localStorage
        updateGlobalStatsFromLocal();
    }
}

// 2. GET /api/stats?tool_slug=:slug - Get Tool Stats
async function loadToolUsage() {
    try {
        var response = await fetch(API_BASE + '/api/stats?tool_slug=' + TOOL_SLUG);
        
        if (!response.ok) throw new Error('API response not OK');
        
        var data = await response.json();
        if (data.usage !== undefined) {
            document.getElementById('toolUsageCount').innerText = data.usage || 0;
        }
        if (data.views !== undefined) {
            document.getElementById('globalUsageCount').innerText = data.views || 0;
        }
        if (data.shares !== undefined) {
            document.getElementById('globalSharesCount').innerText = data.shares || 0;
        }
        if (data.reactions !== undefined) {
            document.getElementById('globalReactionsCount').innerText = data.reactions || 0;
        }
        console.log('✅ Stats loaded successfully');
    } catch (error) {
        console.warn('⚠️ Stats loading failed, using LocalStorage fallback:', error.message);
        loadLocalStats();
    }
}

// 3. POST /api/reactions - Add/Get Reactions
async function addReaction(reaction) {
    try {
        var response = await fetch(API_BASE + '/api/reactions', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                tool_slug: TOOL_SLUG, 
                emoji: reaction, 
                user_id: userId 
            })
        });
        
        if (!response.ok) throw new Error('API response not OK');
        
        var data = await response.json();
        if (data.counts) {
            updateReactionCounts(data.counts);
            // Update global reactions count
            var total = Object.values(data.counts).reduce(function(a, b) { return a + b; }, 0);
            document.getElementById('globalReactionsCount').innerText = total;
        }
        if (!data.already_reacted) {
            showToast('Thanks for your ' + reaction + ' reaction! ❤️', 'success');
        } else {
            showToast('You already reacted with ' + reaction, 'info');
        }
        console.log('✅ Reaction added successfully');
    } catch (error) {
        console.warn('⚠️ Reaction failed, using LocalStorage fallback:', error.message);
        updateLocalReaction(reaction);
        showToast('Reaction saved locally!', 'success');
    }
}

async function loadReactions() {
    try {
        var response = await fetch(API_BASE + '/api/reactions', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                tool_slug: TOOL_SLUG,
                get: true 
            })
        });
        
        if (!response.ok) throw new Error('API response not OK');
        
        var data = await response.json();
        if (data.reactions) {
            updateReactionCounts(data.reactions);
            var total = Object.values(data.reactions).reduce(function(a, b) { return a + b; }, 0);
            document.getElementById('globalReactionsCount').innerText = total;
        }
        console.log('✅ Reactions loaded successfully');
    } catch (error) {
        console.warn('⚠️ Reactions load failed, using LocalStorage fallback:', error.message);
        loadLocalReactions();
    }
}

// 4. POST /api/shares - Record Shares
async function trackShare(platform) {
    try {
        var response = await fetch(API_BASE + '/api/shares', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                tool_slug: TOOL_SLUG, 
                platform: platform, 
                user_id: userId 
            })
        });
        
        if (!response.ok) throw new Error('API response not OK');
        
        var data = await response.json();
        if (data.total_shares !== undefined) {
            document.getElementById('globalSharesCount').innerText = data.total_shares;
        }
        console.log('✅ Share tracked successfully');
    } catch (error) {
        console.warn('⚠️ Share tracking failed:', error.message);
        // LocalStorage fallback for shares
        var localShares = parseInt(localStorage.getItem('tool_shares_count') || '0');
        localShares += 1;
        localStorage.setItem('tool_shares_count', localShares);
        document.getElementById('globalSharesCount').innerText = localShares;
    }
}

// 5. GET /api/stats - Get Global Stats (NO FAKE DATA)
async function loadGlobalStats() {
    try {
        var response = await fetch(API_BASE + '/api/stats?tool_slug=' + TOOL_SLUG);
        
        if (!response.ok) throw new Error('API response not OK');
        
        var data = await response.json();
        
        // Only update if real data exists - show 0 if no data
        if (data.views !== undefined && data.views !== null) {
            document.getElementById('globalUsageCount').innerText = data.views;
            localStorage.setItem('global_usage_count', data.views);
        } else {
            document.getElementById('globalUsageCount').innerText = '0';
        }
        
        if (data.shares !== undefined && data.shares !== null) {
            document.getElementById('globalSharesCount').innerText = data.shares;
            localStorage.setItem('global_shares_count', data.shares);
        } else {
            document.getElementById('globalSharesCount').innerText = '0';
        }
        
        if (data.reactions !== undefined && data.reactions !== null) {
            document.getElementById('globalReactionsCount').innerText = data.reactions;
            localStorage.setItem('global_reactions_count', data.reactions);
        } else {
            document.getElementById('globalReactionsCount').innerText = '0';
        }
        
        console.log('✅ Global stats loaded successfully from Cloudflare API');
    } catch (error) {
        console.warn('⚠️ Global stats API failed - showing 0 until data loads:', error.message);
        // Show 0 instead of fake data
        document.getElementById('globalUsageCount').innerText = '0';
        document.getElementById('globalSharesCount').innerText = '0';
        document.getElementById('globalReactionsCount').innerText = '0';
    }
}

// ============================================
// LOCAL STORAGE FALLBACK FUNCTIONS
// ============================================

function updateGlobalStats(data) {
    if (data.total_usage !== undefined) {
        document.getElementById('globalUsageCount').innerText = data.total_usage;
        localStorage.setItem('global_usage_count', data.total_usage);
    }
    if (data.total_shares !== undefined) {
        document.getElementById('globalSharesCount').innerText = data.total_shares;
        localStorage.setItem('global_shares_count', data.total_shares);
    }
}

function updateGlobalStatsFromLocal() {
    var usage = localStorage.getItem('global_usage_count') || '0';
    var shares = localStorage.getItem('global_shares_count') || '0';
    var reactions = localStorage.getItem('global_reactions_count') || '0';
    document.getElementById('globalUsageCount').innerText = usage;
    document.getElementById('globalSharesCount').innerText = shares;
    document.getElementById('globalReactionsCount').innerText = reactions;
}

function loadLocalStats() {
    var usage = localStorage.getItem('tool_usage_count') || '0';
    document.getElementById('toolUsageCount').innerText = usage;
    updateGlobalStatsFromLocal();
}

function updateReactionCounts(counts) {
    var mapping = {
        'like': 'likeCount',
        'love': 'loveCount',
        'wow': 'wowCount',
        'sad': 'sadCount',
        'laugh': 'laughCount',
        'celebrate': 'celebrateCount'
    };
    
    Object.keys(mapping).forEach(function(key) {
        var element = document.getElementById(mapping[key]);
        if (element) {
            element.innerText = counts[key] || 0;
        }
    });
    
    // Save to localStorage
    localStorage.setItem('tool_reactions', JSON.stringify(counts));
}

function updateLocalReaction(reaction) {
    var localReactions = JSON.parse(localStorage.getItem('tool_reactions') || '{}');
    localReactions[reaction] = (localReactions[reaction] || 0) + 1;
    localStorage.setItem('tool_reactions', JSON.stringify(localReactions));
    
    // Update global reactions count
    var total = Object.values(localReactions).reduce(function(a, b) { return a + b; }, 0);
    localStorage.setItem('global_reactions_count', total);
    document.getElementById('globalReactionsCount').innerText = total;
    
    loadLocalReactions();
}

function loadLocalReactions() {
    var localReactions = JSON.parse(localStorage.getItem('tool_reactions') || '{}');
    var mapping = {
        'like': 'likeCount',
        'love': 'loveCount',
        'wow': 'wowCount',
        'sad': 'sadCount',
        'laugh': 'laughCount',
        'celebrate': 'celebrateCount'
    };
    
    Object.keys(mapping).forEach(function(key) {
        var element = document.getElementById(mapping[key]);
        if (element) {
            element.innerText = localReactions[key] || 0;
        }
    });
    
    // Update global reactions
    var total = Object.values(localReactions).reduce(function(a, b) { return a + b; }, 0);
    document.getElementById('globalReactionsCount').innerText = total || '0';
}

// ============================================
// SHARE FUNCTIONS
// ============================================
function shareOnFacebook() {
    var url = encodeURIComponent(window.location.href);
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank', 'width=600,height=400');
    trackShare('facebook');
    showToast('Shared on Facebook!', 'success');
}

function shareOnTwitter() {
    var text = encodeURIComponent('Check out this job opportunity! 🏫');
    var url = encodeURIComponent(window.location.href);
    window.open('https://twitter.com/intent/tweet?text=' + text + '&url=' + url, '_blank', 'width=600,height=400');
    trackShare('twitter');
    showToast('Shared on Twitter!', 'success');
}

function shareOnWhatsApp() {
    var text = encodeURIComponent('Job Opportunity! Check this out: ' + window.location.href);
    window.open('https://wa.me/?text=' + text, '_blank');
    trackShare('whatsapp');
    showToast('Shared on WhatsApp!', 'success');
}

function shareOnLinkedIn() {
    var url = encodeURIComponent(window.location.href);
    window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + url, '_blank', 'width=600,height=400');
    trackShare('linkedin');
    showToast('Shared on LinkedIn!', 'success');
}

function shareByEmail() {
    var subject = encodeURIComponent('Job Opportunity at School');
    var body = encodeURIComponent('Check out this job opportunity: ' + window.location.href);
    window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
    trackShare('email');
    showToast('Email client opened!', 'success');
}

function copyPageURL() {
    navigator.clipboard.writeText(window.location.href);
    trackShare('copy_url');
    showToast('URL copied to clipboard!', 'success');
}

// ============================================
// UI HELPERS
// ============================================
function showToast(message, type) {
    if (type === undefined) type = 'info';
    var toast = document.getElementById('toast');
    toast.textContent = message;
    if (type === 'success') {
        toast.style.background = '#06d6a0';
    } else if (type === 'error') {
        toast.style.background = '#ef476f';
    } else if (type === 'info') {
        toast.style.background = '#4361ee';
    } else {
        toast.style.background = '#4361ee';
    }
    toast.style.color = 'white';
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(function() {
        toast.classList.remove('show');
    }, 3000);
}

function showLoading(show) {
    var spinner = document.getElementById('loadingSpinner');
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
    var today = new Date();
    var defaultDeadline = new Date(today.setMonth(today.getMonth() + 1));
    document.getElementById('deadline').value = defaultDeadline.toISOString().split('T')[0];
}

// ============================================
// TYPEWRITER EFFECT
// ============================================
function setupTypewriter() {
    var texts = [
        'Create Professional Job Ads',
        'AI-Powered Descriptions',
        'Attract Best Teachers',
        'Hire in Minutes'
    ];
    var index = 0;
    var charIndex = 0;
    var isDeleting = false;
    var element = document.getElementById('typewriterText');
    
    function type() {
        var currentText = texts[index];
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
// PARTICLES EFFECT
// ============================================
function setupParticles() {
    var container = document.getElementById('heroParticles');
    for (var i = 0; i < 50; i++) {
        var particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 5 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = 'rgba(255, 255, 255, ' + Math.random() * 0.5 + ')';
        particle.style.borderRadius = '50%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animation = 'float ' + (Math.random() * 10 + 5) + 's linear infinite';
        container.appendChild(particle);
    }
}

// Add CSS animation for particles
var style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% { transform: translateY(0) translateX(0); opacity: 0; }
        50% { opacity: 1; }
        100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ============================================
// EVENT LISTENERS FOR REACTIONS
// ============================================
function setupEventListeners() {
    document.querySelectorAll('.reaction').forEach(function(reaction) {
        reaction.addEventListener('click', function() {
            var reactionType = reaction.dataset.reaction;
            addReaction(reactionType);
        });
    });
    
    // Scroll buttons
    document.getElementById('scrollUpBtn').addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.getElementById('scrollDownBtn').addEventListener('click', function() {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    
    // Auto-generate on input change
    var inputs = ['orgName', 'postSelect', 'qualificationSelect', 'experienceSelect', 'salaryMin', 'salaryMax', 'location', 'deadline', 'contactEmail', 'contactPhone'];
    inputs.forEach(function(id) {
        var element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', function() { generateAd(); });
            element.addEventListener('change', function() { generateAd(); });
        }
    });
    
    var richEditors = ['jobDesc', 'requirements', 'benefits'];
    richEditors.forEach(function(id) {
        var element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', function() { generateAd(); });
        }
    });
}

// Initial generate
setTimeout(function() {
    generateAd();
}, 500);
