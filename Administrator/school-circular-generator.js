// ============================================
// SCHOOL CIRCULAR GENERATOR - MAIN JAVASCRIPT
// Features: Cloudflare Workers API | 7 Reactions | Share Buttons | Stats Dashboard
// ============================================

// ============================================
// GLOBAL VARIABLES
// ============================================
let logoDataUrl = '';
let signatureDataUrl = '';
let circularsGenerated = 0;
let toolSlug = 'school-circular-generator';
let userId = localStorage.getItem('userId') || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
localStorage.setItem('userId', userId);
let currentStyle = 'classic';

// ============================================
// CLOUDFLARE WORKERS API CONFIGURATION
// ============================================
const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';
const API_KEY = 'magicrills-grok-api.uzairhameed01.workers.dev';

// Helper: Get headers for API requests
function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
    };
}

// ============================================
// TYPEWRITER ANIMATION
// ============================================
function initTypewriter() {
    const phrases = [
        '📝 PTM Circulars',
        '🌴 Holiday Notices',
        '📋 Exam Schedules',
        '🎉 School Events',
        '💰 Fee Reminders',
        '🏆 Result Declarations',
        '⚽ Sports Days',
        '🚌 School Trips',
        '👔 Staff Meetings',
        '📖 Admissions',
        '🎓 Workshops',
        '⏰ Timing Changes'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typewriterElement = document.getElementById('typewriterText');
    
    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (!isDeleting) {
            // Typing
            typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentPhrase.length) {
                isDeleting = true;
                setTimeout(type, 2000);
                return;
            }
            setTimeout(type, 80);
        } else {
            // Deleting
            typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(type, 500);
                return;
            }
            setTimeout(type, 40);
        }
    }
    
    type();
}

// ============================================
// TEMPLATES DATABASE (13 Templates)
// ============================================
const templates = {
    ptm: `<div class="circular-point"><i class="fas fa-star"></i><div>It is to be informed that PTM (Parent's Teacher Meeting) for <strong>Playgroup (P.G)</strong> to class <strong>Tenth (10th)</strong> will be held on [Date].</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>Parents are requested to come and collect their child's report and result.</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>The meeting must be attended by both parents.</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>Parents are requested to follow SOP's during school hours.</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>Timings for PTM 8:30 a.m. to 12:30 p.m. (Punctuality will be highly appreciated)</div></div>
<p style="margin-top: 20px;">For any query please contact school office.</p>`,
    
    holiday: `<div class="circular-point"><i class="fas fa-star"></i><div>This is to inform you that the school will remain closed from <strong>[Start Date]</strong> to <strong>[End Date]</strong> on account of [Occasion].</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>All academic activities will resume normally from [Resume Date].</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>Students are advised to complete their holiday homework during this period.</div></div>
<p style="margin-top: 20px;">Wishing you a joyful holiday!</p>`,
    
    exam: `<div class="circular-point"><i class="fas fa-star"></i><div>This is to inform you that the <strong>[Exam Name]</strong> will commence from [Start Date].</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>The detailed date sheet is attached with this circular for your reference.</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>All students are required to bring their admit cards to the examination hall.</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>Regular classes will remain suspended during examination days.</div></div>
<p style="margin-top: 20px;">We wish all students the very best for their exams!</p>`,
    
    event: `<div class="circular-point"><i class="fas fa-star"></i><div>We are delighted to inform you that our school is organizing <strong>[Event Name]</strong> on [Date] at [Time].</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>The event will include exciting activities and competitions.</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>All students are encouraged to participate actively in the event.</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>Parents are cordially invited to attend the event.</div></div>
<p style="margin-top: 20px;">For further details, please contact the school office.</p>`,
    
    fee: `<div class="circular-point"><i class="fas fa-star"></i><div>This is to remind you that the fee for the month of [Month] is due on [Due Date].</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>Please ensure timely payment to avoid late fee charges.</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>Fee can be paid through cash, bank transfer, or online payment methods.</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>Please bring the fee receipt for verification after payment.</div></div>
<p style="margin-top: 20px;">For any fee-related queries, please contact the accounts office.</p>`,
    
    result: `<div class="circular-point"><i class="fas fa-trophy"></i><div>This is to announce that the <strong>[Exam Name]</strong> results will be declared on [Date].</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>Result cards will be distributed during the parent-teacher meeting.</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>Students who secure top positions will be awarded certificates.</div></div>
<p style="margin-top: 20px;">Congratulations to all successful students!</p>`,
    
    sports: `<div class="circular-point"><i class="fas fa-futbol"></i><div>Annual Sports Day will be held on [Date] at [Time].</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>Events include races, relays, tug of war, and many more.</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>All students must wear their sports uniform.</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>Parents are welcome to cheer for their children.</div></div>
<p style="margin-top: 20px;">Let the games begin!</p>`,
    
    trip: `<div class="circular-point"><i class="fas fa-bus"></i><div>School is organizing an educational trip to <strong>[Destination]</strong> on [Date].</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>Permission slips must be submitted by [Due Date].</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>Students must carry packed lunch and water bottles.</div></div>
<p style="margin-top: 20px;">Learning beyond classrooms!</p>`,
    
    staff: `<div class="circular-point"><i class="fas fa-users"></i><div>There will be an urgent staff meeting on [Date] at [Time] in the staff room.</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>Attendance is mandatory for all teaching and non-teaching staff.</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>Agenda will be shared via email.</div></div>
<p style="margin-top: 20px;">Your punctuality is appreciated.</p>`,
    
    admission: `<div class="circular-point"><i class="fas fa-door-open"></i><div>Admissions are now open for the academic year [Year].</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>Limited seats available on first-come-first-served basis.</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>Registration forms can be collected from the school office.</div></div>
<p style="margin-top: 20px;">Admission forms deadline: [Deadline]</p>`,
    
    workshop: `<div class="circular-point"><i class="fas fa-chalkboard-teacher"></i><div>A <strong>[Workshop Name]</strong> workshop will be conducted on [Date].</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>All students of classes [Classes] are required to attend.</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>Registration is mandatory by [Due Date].</div></div>
<p style="margin-top: 20px;">Enhance your skills!</p>`,
    
    emergency: `<div class="circular-point"><i class="fas fa-exclamation-triangle"></i><div>Due to unforeseen circumstances, the school will remain closed on [Date].</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>All scheduled activities are postponed until further notice.</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>Updates will be shared via SMS and WhatsApp.</div></div>
<p style="margin-top: 20px;">Stay safe and follow school instructions.</p>`,
    
    timing: `<div class="circular-point"><i class="fas fa-clock"></i><div>This is to inform you that the school timings are being changed effective from [Effective Date].</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div><strong>New Timings:</strong> Morning Shift: 8:00 AM to 1:00 PM | Evening Shift: 1:30 PM to 6:00 PM</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>All students must report to school according to their respective shift timings.</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>Transport service timings will also be adjusted accordingly.</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>Parents are requested to ensure their children follow the new schedule.</div></div>
<p style="margin-top: 20px;">For any inconvenience, we regret. Your cooperation is highly appreciated.</p>`
};

// ============================================
// HELPER FUNCTIONS
// ============================================
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.backgroundColor = isError ? '#dc3545' : '#28a745';
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
}

function generateCircularNumber() {
    const now = new Date();
    const month = now.toLocaleString('default', { month: 'short' }).toUpperCase();
    const year = now.getFullYear();
    const randomNum = Math.floor(Math.random() * 900) + 100;
    return `CIR/${month}/${year}/${randomNum}`;
}

// ============================================
// DESIGN STYLE FUNCTIONS
// ============================================
function applyDesignStyle(style) {
    currentStyle = style;
    const previewContainer = document.getElementById('previewContainer');
    previewContainer.classList.remove('style-classic', 'style-modern', 'style-formal', 'style-colorful', 'style-minimal');
    previewContainer.classList.add(`style-${style}`);
    
    const title = document.getElementById('previewTitle');
    const header = document.querySelector('.circular-header');
    
    if (style === 'modern') {
        title.style.background = 'linear-gradient(135deg, var(--primary), var(--accent))';
        title.style.webkitBackgroundClip = 'text';
        title.style.backgroundClip = 'text';
        title.style.color = 'transparent';
    } else if (style === 'formal') {
        title.style.background = 'none';
        title.style.color = '#1e293b';
        if (header) header.style.borderBottom = '1px solid #333';
    } else if (style === 'colorful') {
        title.style.background = 'none';
        title.style.color = '#d35400';
    } else {
        title.style.background = 'none';
        title.style.color = '#1e293b';
        if (header && style === 'classic') header.style.borderBottom = '2px solid var(--primary)';
    }
}

// ============================================
// CLOUDFLARE WORKERS API CALLS
// ============================================

// 1. POST /api/usage - Usage Counter Increment
async function incrementUsage() {
    try {
        const response = await fetch(`${API_BASE}/api/usage`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ tool_slug: toolSlug, user_id: userId })
        });
        const data = await response.json();
        if (data.success && data.total_usage) {
            document.getElementById('toolUsageCount').innerText = data.total_usage;
            document.getElementById('globalUsageCount').innerText = data.total_usage;
        }
        return data;
    } catch (error) {
        // Fallback: LocalStorage
        let localUsage = parseInt(localStorage.getItem(`${toolSlug}_usage`) || '0') + 1;
        localStorage.setItem(`${toolSlug}_usage`, localUsage);
        document.getElementById('toolUsageCount').innerText = localUsage;
        document.getElementById('globalUsageCount').innerText = localUsage;
        return { total_usage: localUsage };
    }
}

async function getUsage() {
    try {
        const response = await fetch(`${API_BASE}/api/stats?tool_slug=${toolSlug}`, {
            method: 'GET',
            headers: getHeaders()
        });
        const data = await response.json();
        if (data.success) {
            document.getElementById('toolUsageCount').innerText = data.usage || 0;
            document.getElementById('globalUsageCount').innerText = data.usage || 0;
            document.getElementById('shareCountDisplay').innerText = data.shares || 0;
            document.getElementById('globalShareCount').innerText = data.shares || 0;
        }
    } catch (error) {
        // Fallback: LocalStorage
        let localUsage = localStorage.getItem(`${toolSlug}_usage`) || '0';
        document.getElementById('toolUsageCount').innerText = localUsage;
        document.getElementById('globalUsageCount').innerText = localUsage;
        let shares = localStorage.getItem(`${toolSlug}_shares`) || '0';
        document.getElementById('shareCountDisplay').innerText = shares;
        document.getElementById('globalShareCount').innerText = shares;
    }
}

// 2. POST /api/reactions - Add/Get Reactions
async function addReaction(reactionType) {
    const emojiMap = { like: '👍', love: '❤️', wow: '😮', sad: '😢', angry: '😠', laugh: '😂', celebrate: '🎉' };
    const emoji = emojiMap[reactionType];
    
    try {
        const response = await fetch(`${API_BASE}/api/reactions`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ tool_slug: toolSlug, emoji: emoji, reaction_type: reactionType, user_id: userId })
        });
        const data = await response.json();
        if (data.success) {
            updateReactionCounts(data.counts);
            showToast(`Thank you for your ${reactionType} reaction!`);
        } else if (data.already_reacted) {
            showToast(`You already reacted with ${reactionType}`, true);
        }
    } catch (error) {
        // Fallback: LocalStorage
        updateLocalReactions(reactionType);
        showToast('Reaction saved locally!', false);
    }
}

async function getReactions() {
    try {
        const response = await fetch(`${API_BASE}/api/reactions?tool_slug=${toolSlug}`, {
            method: 'GET',
            headers: getHeaders()
        });
        const data = await response.json();
        if (data.success) {
            updateReactionCounts(data.reactions);
            updateGlobalReactionTotal(data.reactions);
        }
    } catch (error) {
        loadLocalReactions();
    }
}

function updateReactionCounts(counts) {
    const reactionIds = ['likeCount', 'loveCount', 'wowCount', 'sadCount', 'angryCount', 'laughCount', 'celebrateCount'];
    const reactionKeys = ['like', 'love', 'wow', 'sad', 'angry', 'laugh', 'celebrate'];
    
    reactionKeys.forEach((key, index) => {
        const element = document.getElementById(reactionIds[index]);
        if (element) element.innerText = counts[key] || 0;
    });
}

function updateGlobalReactionTotal(counts) {
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    document.getElementById('globalReactionCount').innerText = total;
}

function updateLocalReactions(reactionType) {
    let reactions = JSON.parse(localStorage.getItem(`${toolSlug}_reactions`) || '{}');
    reactions[reactionType] = (reactions[reactionType] || 0) + 1;
    localStorage.setItem(`${toolSlug}_reactions`, JSON.stringify(reactions));
    loadLocalReactions();
}

function loadLocalReactions() {
    const reactions = JSON.parse(localStorage.getItem(`${toolSlug}_reactions`) || '{"like":0,"love":0,"wow":0,"sad":0,"angry":0,"laugh":0,"celebrate":0}');
    updateReactionCounts(reactions);
    const total = Object.values(reactions).reduce((a, b) => a + b, 0);
    document.getElementById('globalReactionCount').innerText = total;
}

// 3. POST /api/shares - Record Shares
async function addShare(platform) {
    try {
        const response = await fetch(`${API_BASE}/api/shares`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ tool_slug: toolSlug, platform: platform, user_id: userId })
        });
        const data = await response.json();
        if (data.success) {
            updateShareCount();
            showToast(`Shared on ${platform}!`);
        }
    } catch (error) {
        // Fallback: LocalStorage
        let shares = parseInt(localStorage.getItem(`${toolSlug}_shares`) || '0') + 1;
        localStorage.setItem(`${toolSlug}_shares`, shares);
        document.getElementById('shareCountDisplay').innerText = shares;
        document.getElementById('globalShareCount').innerText = shares;
        showToast(`Shared on ${platform} (saved locally)!`);
    }
}

async function updateShareCount() {
    try {
        const response = await fetch(`${API_BASE}/api/stats?tool_slug=${toolSlug}`, {
            method: 'GET',
            headers: getHeaders()
        });
        const data = await response.json();
        if (data.success) {
            document.getElementById('shareCountDisplay').innerText = data.shares || 0;
            document.getElementById('globalShareCount').innerText = data.shares || 0;
        }
    } catch (error) {
        let shares = localStorage.getItem(`${toolSlug}_shares`) || '0';
        document.getElementById('shareCountDisplay').innerText = shares;
        document.getElementById('globalShareCount').innerText = shares;
    }
}

// ============================================
// AI CONTENT GENERATION (Grok API via Cloudflare)
// ============================================
async function generateAIContent(prompt) {
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'block';
    
    try {
        const response = await fetch(`${API_BASE}/api/generate`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ prompt: prompt, tool_slug: toolSlug })
        });
        const data = await response.json();
        
        if (data.success && data.content) {
            const aiContent = `<div class="circular-point"><i class="fas fa-star"></i><div>${data.content}</div></div>
            <p style="margin-top: 15px;"><em>- AI Generated</em></p>`;
            document.getElementById('editor').innerHTML = aiContent;
            document.getElementById('previewBody').innerHTML = aiContent;
            showToast('AI content generated successfully!');
        } else {
            // Fallback content
            const fallbackContent = `<div class="circular-point"><i class="fas fa-star"></i><div>${prompt || 'Important announcement'} for all students and parents.</div></div>
            <div class="circular-point"><i class="fas fa-star"></i><div>Please ensure compliance with the instructions mentioned above.</div></div>
            <div class="circular-point"><i class="fas fa-star"></i><div>For any queries, please contact the school office.</div></div>
            <p style="margin-top: 20px;">Thank you for your cooperation.</p>`;
            document.getElementById('editor').innerHTML = fallbackContent;
            document.getElementById('previewBody').innerHTML = fallbackContent;
            showToast('AI generated fallback content');
        }
    } catch (error) {
        // Fallback content
        const fallbackContent = `<div class="circular-point"><i class="fas fa-star"></i><div>${prompt || 'Important school announcement'} regarding upcoming events.</div></div>
        <div class="circular-point"><i class="fas fa-star"></i><div>All parents and students are requested to take note.</div></div>
        <div class="circular-point"><i class="fas fa-star"></i><div>For further details, contact the school administration.</div></div>
        <p style="margin-top: 20px;">Thank you for your understanding.</p>`;
        document.getElementById('editor').innerHTML = fallbackContent;
        document.getElementById('previewBody').innerHTML = fallbackContent;
        showToast('AI service unavailable. Using fallback content.', true);
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

// ============================================
// PREVIEW UPDATE FUNCTION
// ============================================
function updatePreview() {
    const schoolName = document.getElementById('schoolName').value || 'THE EDUCATORS ALI MUSA CAMPUS GOJRA';
    const schoolAddress = document.getElementById('schoolAddress').value || '';
    const schoolContact = document.getElementById('schoolContact').value || 'Ph# 0546-599338';
    const title = document.getElementById('circularTitle').value || 'CIRCULAR';
    const issueDate = formatDate(document.getElementById('issueDate').value) || formatDate(new Date());
    
    const signatorySelect = document.getElementById('signatory');
    const customSignatory = document.getElementById('customSignatory');
    const signatory = signatorySelect.value === 'Custom' ? customSignatory.value : signatorySelect.value;
    
    document.getElementById('previewSchoolName').textContent = schoolName;
    document.getElementById('previewSchoolAddress').textContent = schoolAddress;
    document.getElementById('previewSchoolContact').textContent = schoolContact;
    document.getElementById('previewTitle').textContent = title;
    document.getElementById('previewNumber').textContent = document.getElementById('circularNumber').value;
    document.getElementById('previewIssueDate').textContent = `Date: ${issueDate}`;
    document.getElementById('previewSignatory').textContent = signatory || 'School Head';
    
    const previewLogo = document.getElementById('previewLogo');
    if (logoDataUrl) {
        previewLogo.src = logoDataUrl;
        previewLogo.style.display = 'block';
    } else {
        previewLogo.style.display = 'none';
    }
    
    const previewSignature = document.getElementById('previewSignature');
    if (signatureDataUrl) {
        previewSignature.src = signatureDataUrl;
        previewSignature.style.display = 'block';
    } else {
        previewSignature.style.display = 'none';
    }
}

// ============================================
// DRAFT FUNCTIONS
// ============================================
function saveDraft() {
    const draft = {
        schoolName: document.getElementById('schoolName').value,
        schoolAddress: document.getElementById('schoolAddress').value,
        schoolContact: document.getElementById('schoolContact').value,
        title: document.getElementById('circularTitle').value,
        circularNumber: document.getElementById('circularNumber').value,
        issueDate: document.getElementById('issueDate').value,
        eventDate: document.getElementById('eventDate').value,
        content: document.getElementById('editor').innerHTML,
        signatory: document.getElementById('signatory').value,
        customSignatory: document.getElementById('customSignatory').value,
        logo: logoDataUrl,
        signature: signatureDataUrl,
        style: currentStyle
    };
    localStorage.setItem('circularDraft', JSON.stringify(draft));
    showToast('Draft saved successfully!');
}

function loadDraft() {
    const draft = localStorage.getItem('circularDraft');
    if (!draft) {
        showToast('No draft found', true);
        return;
    }
    try {
        const parsed = JSON.parse(draft);
        document.getElementById('schoolName').value = parsed.schoolName || '';
        document.getElementById('schoolAddress').value = parsed.schoolAddress || '';
        document.getElementById('schoolContact').value = parsed.schoolContact || '';
        document.getElementById('circularTitle').value = parsed.title || '';
        document.getElementById('circularNumber').value = parsed.circularNumber || generateCircularNumber();
        document.getElementById('issueDate').value = parsed.issueDate || '';
        document.getElementById('eventDate').value = parsed.eventDate || '';
        document.getElementById('editor').innerHTML = parsed.content || '';
        document.getElementById('signatory').value = parsed.signatory || 'Principal';
        document.getElementById('customSignatory').value = parsed.customSignatory || '';
        
        if (parsed.signatory === 'Custom') {
            document.getElementById('customSignatoryContainer').style.display = 'block';
        }
        
        logoDataUrl = parsed.logo || '';
        signatureDataUrl = parsed.signature || '';
        
        if (logoDataUrl) {
            document.getElementById('logoPreview').src = logoDataUrl;
            document.getElementById('logoPreview').style.display = 'block';
        }
        if (signatureDataUrl) {
            document.getElementById('signaturePreview').src = signatureDataUrl;
            document.getElementById('signaturePreview').style.display = 'block';
        }
        
        if (parsed.style) {
            applyDesignStyle(parsed.style);
            document.querySelectorAll('.style-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-style') === parsed.style) {
                    btn.classList.add('active');
                }
            });
        }
        
        document.getElementById('previewBody').innerHTML = parsed.content || '';
        updatePreview();
        showToast('Draft loaded successfully!');
    } catch (e) {
        showToast('Error loading draft', true);
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================
function downloadDOC() {
    const htmlContent = `<!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"><title>${document.getElementById('circularTitle').value || 'Circular'}</title>
    <style>body{font-family:'Times New Roman',serif;padding:40px} .circular-header{text-align:center} .school-name{font-size:22px;font-weight:bold} .circular-title{font-size:24px;font-weight:bold}</style>
    </head>
    <body>${document.getElementById('previewContainer').innerHTML}</body>
    </html>`;
    
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${document.getElementById('circularTitle').value || 'circular'}.doc`;
    link.click();
    showToast('DOC downloaded!');
    addShare('doc_download');
}

function downloadPDF() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'block';
    
    html2canvas(document.getElementById('previewContainer'), { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${document.getElementById('circularTitle').value || 'circular'}.pdf`);
        loadingSpinner.style.display = 'none';
        showToast('PDF downloaded!');
        addShare('pdf_download');
    }).catch(() => {
        loadingSpinner.style.display = 'none';
        showToast('PDF generation failed', true);
    });
}

function downloadTXT() {
    const text = document.getElementById('previewContainer').innerText;
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${document.getElementById('circularTitle').value || 'circular'}.txt`;
    link.click();
    showToast('TXT downloaded!');
    addShare('txt_download');
}

function copyToClipboard() {
    const range = document.createRange();
    range.selectNode(document.getElementById('previewContainer'));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    showToast('Copied to clipboard!');
}

// ============================================
// SOCIAL SHARING
// ============================================
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
    addShare('facebook');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out this Professional School Circular Generator!');
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400');
    addShare('twitter');
}

function shareOnWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://wa.me/?text=${url}`, '_blank', 'width=600,height=400');
    addShare('whatsapp');
}

function shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=400');
    addShare('linkedin');
}

function shareByEmail() {
    const subject = encodeURIComponent('School Circular Generator Tool');
    const body = encodeURIComponent(`Check out this amazing tool: ${window.location.href}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    addShare('email');
}

function copyPageUrl() {
    navigator.clipboard.writeText(window.location.href);
    showToast('URL copied to clipboard!');
    addShare('copy_url');
}

// ============================================
// DARK/LIGHT MODE
// ============================================
function initDarkMode() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    const toggleBtn = document.getElementById('darkModeToggle');
    const icon = toggleBtn.querySelector('i');
    if (savedTheme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

function toggleDarkMode() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const icon = document.querySelector('#darkModeToggle i');
    if (newTheme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
    showToast(`${newTheme === 'dark' ? 'Dark' : 'Light'} mode activated!`);
}

// ============================================
// SCROLL FUNCTIONS
// ============================================
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function scrollToTool() {
    document.querySelector('.dashboard').scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// TEMPLATE HANDLER
// ============================================
function applyTemplate() {
    const select = document.getElementById('templateSelect');
    const templateKey = select.value;
    const templateContent = templates[templateKey];
    if (templateContent) {
        document.getElementById('editor').innerHTML = templateContent;
        document.getElementById('previewBody').innerHTML = templateContent;
        showToast(`Template "${select.options[select.selectedIndex].text}" applied!`);
    }
}

// ============================================
// GENERATE CIRCULAR
// ============================================
function generateCircular() {
    const schoolName = document.getElementById('schoolName').value;
    if (!schoolName) {
        showToast('Please enter school name', true);
        return;
    }
    
    document.getElementById('circularNumber').value = generateCircularNumber();
    document.getElementById('previewBody').innerHTML = document.getElementById('editor').innerHTML;
    updatePreview();
    
    circularsGenerated++;
    localStorage.setItem('circularCount', circularsGenerated);
    document.getElementById('circularCount').innerText = circularsGenerated;
    
    incrementUsage();
    showToast('Circular generated successfully!');
}

// ============================================
// MODAL FUNCTIONS
// ============================================
function showAIModal() {
    document.getElementById('aiModal').style.display = 'flex';
}

function closeAIModal() {
    document.getElementById('aiModal').style.display = 'none';
    document.getElementById('aiPrompt').value = '';
}

async function submitAIPrompt() {
    const prompt = document.getElementById('aiPrompt').value;
    if (!prompt) {
        showToast('Please describe what circular you want', true);
        return;
    }
    closeAIModal();
    await generateAIContent(prompt);
}

function showPremiumModal() {
    document.getElementById('premiumModal').style.display = 'flex';
}

function closePremiumModal() {
    document.getElementById('premiumModal').style.display = 'none';
}

// ============================================
// EVENT LISTENERS SETUP
// ============================================
function setupEventListeners() {
    // Toolbar buttons
    document.querySelectorAll('.toolbar button').forEach(btn => {
        btn.addEventListener('click', () => {
            const command = btn.getAttribute('data-command');
            document.execCommand(command, false, null);
            document.getElementById('editor').focus();
        });
    });
    
    // Signatory
    document.getElementById('signatory').addEventListener('change', () => {
        const isCustom = document.getElementById('signatory').value === 'Custom';
        document.getElementById('customSignatoryContainer').style.display = isCustom ? 'block' : 'none';
        updatePreview();
    });
    document.getElementById('customSignatory').addEventListener('input', updatePreview);
    
    // Form inputs
    ['schoolName', 'schoolAddress', 'schoolContact', 'circularTitle', 'issueDate', 'eventDate'].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.addEventListener('input', updatePreview);
    });
    
    // Editor
    document.getElementById('editor').addEventListener('input', () => {
        document.getElementById('previewBody').innerHTML = document.getElementById('editor').innerHTML;
    });
    
    // Logo upload
    document.getElementById('logoUpload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                logoDataUrl = event.target.result;
                document.getElementById('logoPreview').src = logoDataUrl;
                document.getElementById('logoPreview').style.display = 'block';
                updatePreview();
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Signature upload
    document.getElementById('signatureUpload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                signatureDataUrl = event.target.result;
                document.getElementById('signaturePreview').src = signatureDataUrl;
                document.getElementById('signaturePreview').style.display = 'block';
                updatePreview();
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Buttons
    document.getElementById('generateBtn').addEventListener('click', generateCircular);
    document.getElementById('saveDraftBtn').addEventListener('click', saveDraft);
    document.getElementById('loadDraftBtn').addEventListener('click', loadDraft);
    document.getElementById('printBtn').addEventListener('click', () => window.print());
    document.getElementById('pdfBtn').addEventListener('click', downloadPDF);
    document.getElementById('docBtn').addEventListener('click', downloadDOC);
    document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
    document.getElementById('downloadTxtBtn').addEventListener('click', downloadTXT);
    document.getElementById('aiGenerateBtn').addEventListener('click', showAIModal);
    
    // Template select
    document.getElementById('templateSelect').addEventListener('change', applyTemplate);
    
    // Reactions
    document.querySelectorAll('.reaction').forEach(el => {
        el.addEventListener('click', () => {
            const reaction = el.getAttribute('data-reaction');
            addReaction(reaction);
        });
    });
    
    // Share buttons
    document.querySelector('.share-btn.facebook')?.addEventListener('click', shareOnFacebook);
    document.querySelector('.share-btn.twitter')?.addEventListener('click', shareOnTwitter);
    document.querySelector('.share-btn.whatsapp')?.addEventListener('click', shareOnWhatsApp);
    document.querySelector('.share-btn.linkedin')?.addEventListener('click', shareOnLinkedIn);
    document.querySelector('.share-btn.email')?.addEventListener('click', shareByEmail);
    document.getElementById('copyUrlBtn')?.addEventListener('click', copyPageUrl);
    
    // Floating buttons
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
    document.getElementById('scrollUpBtn').addEventListener('click', scrollToTop);
    document.getElementById('scrollDownBtn').addEventListener('click', scrollToBottom);
    document.getElementById('scrollToToolBtn')?.addEventListener('click', scrollToTool);
    
    // Design style buttons
    document.querySelectorAll('.style-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const style = btn.getAttribute('data-style');
            applyDesignStyle(style);
            showToast(`${style.charAt(0).toUpperCase() + style.slice(1)} style applied!`);
        });
    });
    
    // Modal controls
    document.querySelectorAll('.modal-close').forEach(close => {
        close.addEventListener('click', () => {
            document.getElementById('aiModal').style.display = 'none';
            document.getElementById('premiumModal').style.display = 'none';
        });
    });
    document.getElementById('aiSubmitBtn')?.addEventListener('click', submitAIPrompt);
    document.getElementById('aiCancelBtn')?.addEventListener('click', closeAIModal);
    document.getElementById('demoBtn')?.addEventListener('click', showPremiumModal);
    document.getElementById('closeModalBtn')?.addEventListener('click', closePremiumModal);
    
    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('aiModal')) closeAIModal();
        if (e.target === document.getElementById('premiumModal')) closePremiumModal();
    });
}

// ============================================
// INITIALIZATION
// ============================================
async function init() {
    // Start Typewriter Animation
    initTypewriter();
    
    // Set initial values
    document.getElementById('circularNumber').value = generateCircularNumber();
    document.getElementById('issueDate').valueAsDate = new Date();
    
    // Load counts
    const savedCount = localStorage.getItem('circularCount') || '0';
    circularsGenerated = parseInt(savedCount);
    document.getElementById('circularCount').innerText = circularsGenerated;
    
    // Load editor default content
    const defaultContent = `<div class="circular-point"><i class="fas fa-star"></i><div>It is to be informed that PTM (Parent's Teacher Meeting) for <strong>Playgroup (P.G)</strong> to class <strong>Tenth (10th)</strong> will be held on Saturday, 19th September 2020.</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>Parents are requested to come and collect their child's report and result.</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>The meeting must be attended by both the parent.</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>Parents are requested to follow SOP's during school hours.</div></div>
<div class="circular-point"><i class="fas fa-star"></i><div>Timings for PTM 8:30 a.m. to 12:30 p.m. (Punctuality will be highly appreciated)</div></div>
<p style="margin-top: 20px;">For any query please contact school office.</p>`;
    
    document.getElementById('editor').innerHTML = defaultContent;
    document.getElementById('previewBody').innerHTML = defaultContent;
    
    // Fetch data from Cloudflare API
    await getUsage();
    await getReactions();
    await updateShareCount();
    
    // Initialize dark mode
    initDarkMode();
    
    // Initialize design style
    applyDesignStyle('classic');
    
    // Setup event listeners
    setupEventListeners();
    
    // Update preview
    updatePreview();
    
    showToast('School Circular Generator Ready!');
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
