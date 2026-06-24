// ============================================================
// ECCE OBSERVATION TOOL - CLOUDFLARE WORKERS API INTEGRATION
// ============================================================

// ============================================================
// TOOL CONFIGURATION
// ============================================================
const TOOL_CONFIG = {
    id: 'ecce-observation-tool',
    name: 'ECCE Student Observation Tool',
    slug: 'ecce-observation-tool',
    category: 'ECCE',
    apiBase: 'https://magicrills-api.uzairhameed01.workers.dev',
    apiKey: 'magicrills-grok-api.uzairhameed01.workers.dev'
};

// ============================================================
// LOCAL STORAGE KEYS
// ============================================================
const STORAGE_KEYS = {
    USAGE: 'magicrills_usage_' + TOOL_CONFIG.slug,
    REACTIONS: 'magicrills_reactions_' + TOOL_CONFIG.slug,
    SHARES: 'magicrills_shares_' + TOOL_CONFIG.slug,
    STUDENTS: 'ecce_students_list',
    SESSION: 'ecce_current_session',
    USER_ID: 'magicrills_user_id'
};

// ============================================================
// CLOUDFLARE API CLASS
// ============================================================
class CloudflareAPI {
    constructor() {
        this.baseUrl = TOOL_CONFIG.apiBase;
        this.apiKey = TOOL_CONFIG.apiKey;
        this.toolSlug = TOOL_CONFIG.slug;
        this.isOnline = navigator.onLine;
        
        window.addEventListener('online', () => { 
            this.isOnline = true;
            console.log('🟢 Online - API Available');
        });
        window.addEventListener('offline', () => { 
            this.isOnline = false;
            console.warn('🔴 Offline - Using LocalStorage Fallback');
        });
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey,
            'X-Tool-Slug': this.toolSlug
        };

        const config = {
            ...options,
            headers: { ...headers, ...options.headers }
        };

        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.warn('⚠️ API request failed, using fallback:', error.message);
            return null;
        }
    }

    // POST /api/usage - Increment Usage
    async incrementUsage() {
        if (!this.isOnline) {
            console.warn('📴 Offline: Usage increment saved locally');
            return null;
        }
        return this.request('/api/usage', {
            method: 'POST',
            body: JSON.stringify({ tool_slug: this.toolSlug })
        });
    }

    // GET /api/stats?tool_slug=:slug - Get Tool Stats
    async getStats() {
        if (!this.isOnline) {
            console.warn('📴 Offline: Using local stats');
            return null;
        }
        return this.request(`/api/stats?tool_slug=${this.toolSlug}`);
    }

    // POST /api/reactions - Add Reaction
    async addReaction(reaction) {
        if (!this.isOnline) {
            console.warn('📴 Offline: Reaction saved locally');
            return null;
        }
        return this.request('/api/reactions', {
            method: 'POST',
            body: JSON.stringify({ 
                tool_slug: this.toolSlug, 
                reaction: reaction 
            })
        });
    }

    // POST /api/shares - Record Share
    async recordShare(platform) {
        if (!this.isOnline) {
            console.warn('📴 Offline: Share recorded locally');
            return null;
        }
        return this.request('/api/shares', {
            method: 'POST',
            body: JSON.stringify({ 
                tool_slug: this.toolSlug, 
                platform: platform 
            })
        });
    }
}

// ============================================================
// TOOL MANAGER CLASS
// ============================================================
class ToolManager {
    constructor() {
        this.api = new CloudflareAPI();
        this.userId = this.getUserId();
        this.studentsList = [];
        this.stats = {
            usage: 0,
            views: 0,
            shares: 0,
            followers: 0
        };
        this.init();
    }

    getUserId() {
        let userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
        }
        return userId;
    }

    init() {
        this.initLocalStorage();
        this.loadStudentsList();
        this.loadSession();
        this.updateUsageDisplay();
        this.updateReactionsDisplay();
        this.updateStatsDisplay();
        this.setupEventListeners();
        this.setupTypewriter();
        this.incrementUsage();
        this.syncStats();
    }

    initLocalStorage() {
        // Usage
        if (!localStorage.getItem(STORAGE_KEYS.USAGE)) {
            localStorage.setItem(STORAGE_KEYS.USAGE, JSON.stringify({ 
                count: 0, 
                lastUpdated: new Date().toISOString() 
            }));
        }
        
        // Reactions
        if (!localStorage.getItem(STORAGE_KEYS.REACTIONS)) {
            localStorage.setItem(STORAGE_KEYS.REACTIONS, JSON.stringify({
                like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0,
                userReactions: {}
            }));
        }
        
        // Shares
        if (!localStorage.getItem(STORAGE_KEYS.SHARES)) {
            localStorage.setItem(STORAGE_KEYS.SHARES, JSON.stringify({ 
                count: 0, 
                lastShared: null,
                platforms: {}
            }));
        }
    }

    // ============================================================
    // USAGE
    // ============================================================
    async incrementUsage() {
        // Local update
        const usageData = JSON.parse(localStorage.getItem(STORAGE_KEYS.USAGE));
        usageData.count++;
        usageData.lastUpdated = new Date().toISOString();
        localStorage.setItem(STORAGE_KEYS.USAGE, JSON.stringify(usageData));
        this.updateUsageDisplay();

        // API sync
        const result = await this.api.incrementUsage();
        if (result) {
            console.log('✅ Usage synced with API');
        }
    }

    updateUsageDisplay() {
        const usageData = JSON.parse(localStorage.getItem(STORAGE_KEYS.USAGE));
        document.getElementById('usageCount').textContent = usageData.count;
        document.getElementById('statUsage').textContent = usageData.count;
    }

    // ============================================================
    // REACTIONS
    // ============================================================
    getReactionEmoji(reaction) {
        const emojis = { 
            like: '👍', love: '❤️', wow: '😮', 
            sad: '😢', angry: '😠', laugh: '😂', celebrate: '🎉' 
        };
        return emojis[reaction] || '👍';
    }

    async addReaction(reaction) {
        const reactionsData = JSON.parse(localStorage.getItem(STORAGE_KEYS.REACTIONS));
        
        // Check if user already reacted
        if (!reactionsData.userReactions[this.userId]) {
            reactionsData.userReactions[this.userId] = [];
        }
        
        if (reactionsData.userReactions[this.userId].includes(reaction)) {
            this.showToast(`You already reacted with ${this.getReactionEmoji(reaction)}!`, 'info');
            return false;
        }
        
        // Local update
        reactionsData.userReactions[this.userId].push(reaction);
        reactionsData[reaction]++;
        localStorage.setItem(STORAGE_KEYS.REACTIONS, JSON.stringify(reactionsData));
        this.updateReactionsDisplay();
        this.showToast(`${this.getReactionEmoji(reaction)} Reaction added!`, 'success');

        // API sync
        const result = await this.api.addReaction(reaction);
        if (result) {
            console.log('✅ Reaction synced with API');
        }
        
        return true;
    }

    updateReactionsDisplay() {
        const reactionsData = JSON.parse(localStorage.getItem(STORAGE_KEYS.REACTIONS));
        document.getElementById('reaction-like').textContent = reactionsData.like;
        document.getElementById('reaction-love').textContent = reactionsData.love;
        document.getElementById('reaction-wow').textContent = reactionsData.wow;
        document.getElementById('reaction-sad').textContent = reactionsData.sad;
        document.getElementById('reaction-angry').textContent = reactionsData.angry;
        document.getElementById('reaction-laugh').textContent = reactionsData.laugh;
        document.getElementById('reaction-celebrate').textContent = reactionsData.celebrate;
    }

    // ============================================================
    // SHARES
    // ============================================================
    async shareOnPlatform(platform) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        let shareUrl = '';
        
        switch(platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${title}%20${url}`;
                break;
            case 'email':
                shareUrl = `mailto:?subject=${title}&body=Check%20out%20this%20tool%3A%20${url}`;
                break;
            default:
                return;
        }
        
        // Local update
        const sharesData = JSON.parse(localStorage.getItem(STORAGE_KEYS.SHARES));
        sharesData.count++;
        sharesData.lastShared = new Date().toISOString();
        if (!sharesData.platforms) sharesData.platforms = {};
        sharesData.platforms[platform] = (sharesData.platforms[platform] || 0) + 1;
        localStorage.setItem(STORAGE_KEYS.SHARES, JSON.stringify(sharesData));
        this.updateStatsDisplay();
        this.showToast(`📤 Shared on ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`, 'success');

        // API sync
        const result = await this.api.recordShare(platform);
        if (result) {
            console.log('✅ Share synced with API');
        }
        
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }

    async copyPageUrl() {
        try {
            await navigator.clipboard.writeText(window.location.href);
            
            // Local update
            const sharesData = JSON.parse(localStorage.getItem(STORAGE_KEYS.SHARES));
            sharesData.count++;
            sharesData.lastShared = new Date().toISOString();
            if (!sharesData.platforms) sharesData.platforms = {};
            sharesData.platforms['copy'] = (sharesData.platforms['copy'] || 0) + 1;
            localStorage.setItem(STORAGE_KEYS.SHARES, JSON.stringify(sharesData));
            this.updateStatsDisplay();
            this.showToast('🔗 Link copied to clipboard!', 'success');

            // API sync
            const result = await this.api.recordShare('copy');
            if (result) {
                console.log('✅ Share (copy) synced with API');
            }
        } catch {
            this.showToast('Failed to copy link', 'error');
        }
    }

    // ============================================================
    // STATS
    // ============================================================
    async syncStats() {
        const result = await this.api.getStats();
        if (result && result.data) {
            // Update with real API data
            this.stats = {
                usage: result.data.usage || 0,
                views: result.data.views || 0,
                shares: result.data.shares || 0,
                followers: result.data.followers || 0
            };
            this.updateStatsDisplay();
        } else {
            // Fallback: Use local data
            const usageData = JSON.parse(localStorage.getItem(STORAGE_KEYS.USAGE));
            const sharesData = JSON.parse(localStorage.getItem(STORAGE_KEYS.SHARES));
            const reactionsData = JSON.parse(localStorage.getItem(STORAGE_KEYS.REACTIONS));
            
            this.stats = {
                usage: usageData.count || 0,
                views: usageData.count || 0,
                shares: sharesData.count || 0,
                followers: Object.keys(reactionsData.userReactions || {}).length || 0
            };
            this.updateStatsDisplay();
        }
    }

    updateStatsDisplay() {
        document.getElementById('statUsage').textContent = this.stats.usage || 0;
        document.getElementById('statViews').textContent = this.stats.views || 0;
        document.getElementById('statShares').textContent = this.stats.shares || 0;
        document.getElementById('statFollowers').textContent = this.stats.followers || 0;
    }

    // ============================================================
    // TYPEWRITER ANIMATION
    // ============================================================
    setupTypewriter() {
        const phrases = [
            'Early Childhood Education',
            'Student Progress Tracking',
            'Learning Assessment',
            'Child Development',
            'ECCE Excellence'
        ];
        
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typewriterElement = document.getElementById('typewriterText');
        
        if (!typewriterElement) return;
        
        const type = () => {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typeSpeed = isDeleting ? 40 : 80;
            
            if (!isDeleting && charIndex === currentPhrase.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500;
            }
            
            setTimeout(type, typeSpeed);
        };
        
        type();
    }

    // ============================================================
    // TOAST NOTIFICATIONS
    // ============================================================
    showToast(message, type = 'success') {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#3b82f6',
            warning: '#f59e0b'
        };
        
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: ${colors[type] || colors.success};
            color: white;
            padding: 14px 28px;
            border-radius: 9999px;
            font-weight: 600;
            font-size: 14px;
            z-index: 99999;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            animation: slideInRight 0.4s ease;
            max-width: 400px;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // ============================================================
    // STUDENT MANAGEMENT
    // ============================================================
    loadStudentsList() {
        const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
        this.studentsList = saved ? JSON.parse(saved) : [];
        this.updateStudentSelect();
    }

    saveStudentsList() {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(this.studentsList));
    }

    updateStudentSelect() {
        const select = document.getElementById('studentSelect');
        if (!select) return;
        
        select.innerHTML = '<option value="">-- Select a Student Profile --</option>';
        this.studentsList.forEach((student, idx) => {
            select.innerHTML += `<option value="${idx}">${student.childName || 'Unnamed'} (${student.regNumber || 'No ID'})</option>`;
        });
        select.innerHTML += '<option value="new">+ Create New Student Profile</option>';
    }

    loadSelectedStudent() {
        const val = document.getElementById('studentSelect').value;
        if (val === 'new') {
            this.resetForm();
            return;
        }
        if (val !== '') {
            this.loadDataToForm(this.studentsList[parseInt(val)]);
            this.showToast('📂 Profile loaded!', 'success');
        }
    }

    saveAsNewStudent() {
        const data = this.collectFormData();
        if (!data.childName) {
            this.showToast('Please enter child name', 'error');
            return;
        }
        this.studentsList.push(data);
        this.saveStudentsList();
        this.updateStudentSelect();
        this.showToast('💾 Student profile saved!', 'success');
    }

    deleteSelectedStudent() {
        const val = document.getElementById('studentSelect').value;
        if (val === '' || val === 'new') return;
        if (confirm('Delete this student profile?')) {
            this.studentsList.splice(parseInt(val), 1);
            this.saveStudentsList();
            this.updateStudentSelect();
            this.resetForm();
            this.showToast('🗑️ Profile deleted', 'success');
        }
    }

    // ============================================================
    // FORM MANAGEMENT
    // ============================================================
    collectFormData() {
        const data = {
            school: document.getElementById('school')?.value || '',
            class: document.getElementById('class')?.value || '',
            term: document.getElementById('term')?.value || '',
            childName: document.getElementById('childName')?.value || '',
            fatherName: document.getElementById('fatherName')?.value || '',
            age: document.getElementById('age')?.value || '',
            regNumber: document.getElementById('regNumber')?.value || '',
            teacherName: document.getElementById('teacherName')?.value || '',
            workingDays: document.getElementById('workingDays')?.value || '',
            daysAttended: document.getElementById('daysAttended')?.value || '',
            attendancePercentage: document.getElementById('attendancePercentage')?.value || '',
            fromDate: document.getElementById('fromDate')?.value || '',
            toDate: document.getElementById('toDate')?.value || '',
            reportDate: document.getElementById('reportDate')?.value || new Date().toISOString().split('T')[0],
            remarks: {
                remark1: document.getElementById('remark1')?.value || '',
                remark2: document.getElementById('remark2')?.value || '',
                remark3: document.getElementById('remark3')?.value || '',
                remark4: document.getElementById('remark4')?.value || '',
                remark5: document.getElementById('remark5')?.value || '',
                remark6: document.getElementById('remark6')?.value || '',
                remark7: document.getElementById('remark7')?.value || '',
                general: document.getElementById('generalRemarks')?.value || ''
            },
            percentages: {},
            performance: {}
        };

        // Calculate percentages
        for (let i = 1; i <= 7; i++) {
            const selects = document.querySelectorAll(`.performance-select[data-section="${i}"]`);
            const scores = { NI: 0, E: 25, D: 50, S: 100 };
            let weightedSum = 0;
            selects.forEach(select => weightedSum += scores[select.value] || 0);
            data.percentages[i] = selects.length > 0 ? Math.round(weightedSum / selects.length) : 0;
        }

        // Collect performance values
        document.querySelectorAll('.performance-select').forEach((select, idx) => {
            data.performance[`select-${idx}`] = select.value;
        });

        return data;
    }

    loadDataToForm(data) {
        if (!data) return;
        
        document.getElementById('class').value = data.class || '';
        document.getElementById('term').value = data.term || '';
        document.getElementById('childName').value = data.childName || '';
        document.getElementById('fatherName').value = data.fatherName || '';
        document.getElementById('age').value = data.age || '';
        document.getElementById('regNumber').value = data.regNumber || '';
        document.getElementById('teacherName').value = data.teacherName || '';
        document.getElementById('workingDays').value = data.workingDays || '';
        document.getElementById('daysAttended').value = data.daysAttended || '';
        document.getElementById('fromDate').value = data.fromDate || '';
        document.getElementById('toDate').value = data.toDate || '';
        document.getElementById('reportDate').value = data.reportDate || '';
        
        if (data.remarks) {
            document.getElementById('remark1').value = data.remarks.remark1 || '';
            document.getElementById('remark2').value = data.remarks.remark2 || '';
            document.getElementById('remark3').value = data.remarks.remark3 || '';
            document.getElementById('remark4').value = data.remarks.remark4 || '';
            document.getElementById('remark5').value = data.remarks.remark5 || '';
            document.getElementById('remark6').value = data.remarks.remark6 || '';
            document.getElementById('remark7').value = data.remarks.remark7 || '';
            document.getElementById('generalRemarks').value = data.remarks.general || '';
        }
        
        if (data.performance) {
            document.querySelectorAll('.performance-select').forEach((select, idx) => {
                if (data.performance[`select-${idx}`]) {
                    select.value = data.performance[`select-${idx}`];
                    this.updateSelectColor(select);
                }
            });
        }
        
        this.calculateAttendance();
        this.calculateProgress();
    }

    saveCurrentProgress() {
        const data = this.collectFormData();
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(data));
        this.showToast('💾 Progress saved!', 'success');
    }

    loadSession() {
        const saved = localStorage.getItem(STORAGE_KEYS.SESSION);
        if (saved) {
            this.loadDataToForm(JSON.parse(saved));
        }
    }

    resetForm() {
        if (!confirm('Reset all data?')) return;
        
        document.querySelectorAll('input:not(#school), textarea, select').forEach(el => {
            if (el.id !== 'school') el.value = '';
        });
        
        document.querySelectorAll('.performance-select').forEach(select => {
            select.value = 'NI';
            this.updateSelectColor(select);
        });
        
        this.calculateProgress();
        this.showToast('🔄 Form reset', 'info');
    }

    // ============================================================
    // ASSESSMENT HELPERS
    // ============================================================
    updateSelectColor(select) {
        select.classList.remove('NI', 'E', 'D', 'S');
        if (select.value) select.classList.add(select.value);
    }

    calculateProgress() {
        for (let s = 1; s <= 7; s++) {
            const selects = document.querySelectorAll(`.performance-select[data-section="${s}"]`);
            const scores = { NI: 0, E: 25, D: 50, S: 100 };
            let weightedSum = 0;
            selects.forEach(select => weightedSum += scores[select.value] || 0);
            const percentage = selects.length > 0 ? Math.round(weightedSum / selects.length) : 0;
            
            const progressEl = document.getElementById(`progress-${s}`);
            const progressBar = document.getElementById(`progress-bar-${s}`);
            if (progressEl) progressEl.textContent = percentage + '%';
            if (progressBar) progressBar.style.width = percentage + '%';
        }
    }

    calculateAttendance() {
        const workingDays = parseInt(document.getElementById('workingDays').value) || 0;
        const daysAttended = parseInt(document.getElementById('daysAttended').value) || 0;
        if (workingDays > 0) {
            document.getElementById('attendancePercentage').value = Math.round((daysAttended / workingDays) * 100) + '%';
        } else {
            document.getElementById('attendancePercentage').value = '';
        }
    }

    // ============================================================
    // REPORT GENERATION
    // ============================================================
    generateAISummary(data) {
        const childName = data.childName || 'The student';
        const avg = Math.round([
            data.percentages[1] || 0,
            data.percentages[2] || 0,
            data.percentages[3] || 0,
            data.percentages[4] || 0,
            data.percentages[5] || 0,
            data.percentages[6] || 0,
            data.percentages[7] || 0
        ].reduce((a, b) => a + b, 0) / 7);

        let summary = `${childName} `;
        if (avg >= 70) {
            summary += `demonstrates secure development across all learning domains (Overall: ${avg}%). `;
        } else if (avg >= 50) {
            summary += `shows developing skills with steady progress (Overall: ${avg}%). `;
        } else {
            summary += `is building foundational skills (Overall: ${avg}%). `;
        }
        summary += `Attendance: ${data.attendancePercentage || 'N/A'}. `;
        if (data.remarks?.general) {
            summary += `Notes: ${data.remarks.general.substring(0, 150)}`;
        }
        return summary;
    }

    generateReportCardHTML(data) {
        const getLevel = (s) => {
            if (s >= 75) return 'Secure';
            if (s >= 50) return 'Developing';
            if (s >= 25) return 'Emerging';
            return 'Not Introduced';
        };

        const domains = [
            'Personal, Social & Emotional',
            'Language & Literacy',
            'Mathematical Concepts',
            'Health & Safety',
            'Physical Development',
            'Creative Arts',
            'World Around Us'
        ];

        return `
        <div style="max-width:1200px;margin:0 auto;padding:40px;font-family:'Segoe UI',Arial;background:white;color:#1a2332;">
            <div style="text-align:center;border-bottom:3px solid #3b82f6;padding-bottom:20px;margin-bottom:30px;">
                <h1 style="font-size:28px;color:#1a2332;">${data.school || 'ABC School'}</h1>
                <h2 style="font-size:22px;color:#3b82f6;">ECCE Progress Report</h2>
            </div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;background:#f8f9fa;padding:20px;border-radius:10px;margin-bottom:30px;">
                <div><strong>Child:</strong> ${data.childName}</div>
                <div><strong>Father:</strong> ${data.fatherName}</div>
                <div><strong>Age:</strong> ${data.age}</div>
                <div><strong>Class:</strong> ${data.class}</div>
                <div><strong>Term:</strong> ${data.term}</div>
                <div><strong>Reg #:</strong> ${data.regNumber}</div>
                <div><strong>Teacher:</strong> ${data.teacherName}</div>
                <div><strong>Period:</strong> ${data.fromDate} to ${data.toDate}</div>
                <div><strong>Attendance:</strong> ${data.attendancePercentage}</div>
            </div>
            <table style="width:100%;border-collapse:collapse;margin-bottom:30px;">
                <thead>
                    <tr style="background:#3b82f6;color:white;">
                        <th style="padding:12px;text-align:left;">Domain</th>
                        <th style="padding:12px;text-align:center;">Score</th>
                        <th style="padding:12px;text-align:center;">Level</th>
                    </tr>
                </thead>
                <tbody>
                    ${domains.map((name, i) => {
                        const score = data.percentages[i+1] || 0;
                        return `
                        <tr style="border-bottom:1px solid #e5e7eb;">
                            <td style="padding:12px;">${name}</td>
                            <td style="padding:12px;text-align:center;">${score}%</td>
                            <td style="padding:12px;text-align:center;">${getLevel(score)}</td>
                        </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
            <div style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:white;padding:20px;border-radius:10px;margin:20px 0;">
                <h3 style="margin-bottom:10px;">📊 AI Summary</h3>
                <p>${this.generateAISummary(data)}</p>
            </div>
            <div style="margin-top:50px;display:grid;grid-template-columns:repeat(3,1fr);gap:30px;text-align:center;padding-top:20px;border-top:2px solid #e5e7eb;">
                <div>
                    <div style="border-top:2px solid #1a2332;padding-top:10px;">Class Teacher</div>
                    <div style="margin-top:8px;">${data.teacherName}</div>
                </div>
                <div>
                    <div style="border-top:2px solid #1a2332;padding-top:10px;">Principal</div>
                    <div style="margin-top:8px;">_____________</div>
                </div>
                <div>
                    <div style="border-top:2px solid #1a2332;padding-top:10px;">Parent</div>
                    <div style="margin-top:8px;">_____________</div>
                </div>
            </div>
            <div style="text-align:center;margin-top:30px;font-size:12px;color:#94a3b8;">
                Generated by MagicRills ECCE Observation Tool | ${new Date().toLocaleDateString()}
            </div>
        </div>`;
    }

    generatePDFReport() {
        const data = this.collectFormData();
        if (!data.childName) {
            this.showToast('Please enter child name', 'error');
            return;
        }

        this.showLoading(true, 'Preparing PDF...');
        
        const tempContainer = document.createElement('div');
        tempContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            background: white;
            padding: 30px;
            z-index: -1;
        `;
        tempContainer.innerHTML = this.generateReportCardHTML(data);
        document.body.appendChild(tempContainer);

        setTimeout(() => {
            html2pdf()
                .set({
                    margin: 0.5,
                    filename: `ECCE_Report_${data.childName}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
                })
                .from(tempContainer)
                .save()
                .then(() => {
                    document.body.removeChild(tempContainer);
                    this.showLoading(false);
                    this.showToast('📄 PDF Downloaded!', 'success');
                });
        }, 500);
    }

    downloadAsWord() {
        const data = this.collectFormData();
        if (!data.childName) {
            this.showToast('Please enter child name', 'error');
            return;
        }

        const blob = new Blob([this.generateReportCardHTML(data)], {
            type: 'application/msword'
        });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `ECCE_Report_${data.childName}.doc`;
        link.click();
        URL.revokeObjectURL(link.href);
        this.showToast('📝 Word document downloaded!', 'success');
    }

    exportToExcel() {
        const data = this.collectFormData();
        const excelData = [{
            'Child Name': data.childName,
            'Father Name': data.fatherName,
            'Class': data.class,
            'Term': data.term,
            'Attendance': data.attendancePercentage,
            'Personal & Social': data.percentages[1] + '%',
            'Language & Literacy': data.percentages[2] + '%',
            'Mathematical Concepts': data.percentages[3] + '%',
            'Health & Safety': data.percentages[4] + '%',
            'Physical Development': data.percentages[5] + '%',
            'Creative Arts': data.percentages[6] + '%',
            'World Around Us': data.percentages[7] + '%'
        }];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(excelData), 'ECCE Report');
        XLSX.writeFile(wb, `ECCE_Report_${data.childName}.xlsx`);
        this.showToast('📊 Excel exported!', 'success');
    }

    // ============================================================
    // LOADING OVERLAY
    // ============================================================
    showLoading(show, text = 'Processing...') {
        const loading = document.getElementById('loading');
        const loadingText = document.getElementById('loadingText');
        if (loading) loading.style.display = show ? 'flex' : 'none';
        if (loadingText && text) loadingText.textContent = text;
    }

    // ============================================================
    // EVENT LISTENERS
    // ============================================================
    setupEventListeners() {
        // Attendance calculation
        document.getElementById('workingDays')?.addEventListener('input', () => this.calculateAttendance());
        document.getElementById('daysAttended')?.addEventListener('input', () => this.calculateAttendance());

        // Performance select change
        document.querySelectorAll('.performance-select').forEach(select => {
            select.addEventListener('change', () => {
                this.updateSelectColor(select);
                this.calculateProgress();
            });
        });

        // Buttons
        document.getElementById('saveProgressBtn')?.addEventListener('click', () => this.saveCurrentProgress());
        document.getElementById('exportExcelBtn')?.addEventListener('click', () => this.exportToExcel());
        document.getElementById('downloadPDFBtn')?.addEventListener('click', () => this.generatePDFReport());
        document.getElementById('downloadWordBtn')?.addEventListener('click', () => this.downloadAsWord());
        document.getElementById('resetFormBtn')?.addEventListener('click', () => this.resetForm());
        document.getElementById('loadStudentBtn')?.addEventListener('click', () => this.loadSelectedStudent());
        document.getElementById('saveAsNewBtn')?.addEventListener('click', () => this.saveAsNewStudent());
        document.getElementById('deleteStudentBtn')?.addEventListener('click', () => this.deleteSelectedStudent());
        document.getElementById('pageShareBtn')?.addEventListener('click', () => this.copyPageUrl());

        // Reactions
        document.querySelectorAll('.reaction-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.addReaction(btn.dataset.reaction);
            });
        });

        // Social Share
        document.querySelectorAll('.share-icon').forEach(btn => {
            btn.addEventListener('click', () => {
                this.shareOnPlatform(btn.dataset.share);
            });
        });

        // Scroll buttons
        const scrollUpBtn = document.getElementById('scrollUpBtn');
        const scrollDownBtn = document.getElementById('scrollDownBtn');

        scrollDownBtn?.addEventListener('click', () => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });

        scrollUpBtn?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                scrollUpBtn.style.display = 'flex';
            } else {
                scrollUpBtn.style.display = 'none';
            }
        });
    }
}

// ============================================================
// POPULATE ASSESSMENT SECTIONS
// ============================================================
function populateAssessmentSections() {
    const assessmentData = {
        section1: { 
            title: "Step A: Personal, Social, and Emotional Development", 
            items: [
                "Identifies occasions when she/he feels happy, sad, scared, loved, angry, excited and bored",
                "Chooses and talks about an activity/work that she/he enjoys doing the most in class",
                "Expresses likes and dislikes and talks about strengths",
                "Demonstrates how to dress up",
                "Demonstrates eating habits",
                "Demonstrates proper posture while walking, talking and sitting",
                "Takes care of his/her and others' belongings",
                "Asks for help when needed",
                "Demonstrates problem solving skills while participating in different activities",
                "Works cooperatively, shares materials and ideas with peers, teachers, and others",
                "Recognizes historical and cultural places"
            ] 
        },
        section2: { 
            title: "Step B: Language and Literacy", 
            items: [
                "Listens attentively in small and large groups",
                "Shares views in small and large groups about everyday events and special occasions",
                "Responds to others in appropriate verbal and non-verbal ways",
                "Shares her/his experiences and feelings using complete sentences",
                "Responds to and verbally expresses feelings (joy, sorrow, wonder, anger)",
                "Waits for her/his turn to speak and does not interrupt others",
                "Initiates conversations with peers and adults",
                "Recognises letters with her/his initial sounds",
                "Recognises and differentiates between sounds in the environment",
                "Understands and follows instructions",
                "Uses correct pronunciation"
            ],
            readingItems: [
                "Holds, opens and turns pages of a book with care",
                "Enjoys skimming/scanning through age appropriate books",
                "Predicts the story by looking at the cover page",
                "Predicts what comes next in stories",
                "Asks open ended questions about the story",
                "Repeats simple repetitive sequences in stories",
                "Tells a simple story by looking at pictures",
                "Retells a favourite story in correct sequence",
                "Differentiates between parts of a book (cover, title, end)",
                "Knows that some books tell stories and others give information",
                "Knows that Urdu is read from right to left",
                "Knows that English is read from left to right",
                "Recognises her/his name in print (English)",
                "Recognises her/his name in print (Urdu)",
                "Recognises letters of the English alphabet"
            ],
            writingItems: [
                "Makes marks and scribbles to communicate meaning",
                "Uses English letters in writing to communicate meaning",
                "Uses Urdu letters in writing to communicate meaning",
                "Draws pictures to communicate meaning",
                "Holds writing tools properly with comfortable grip",
                "Colours a simple picture keeping within designated space",
                "Traces, copies, draws and colours different shapes",
                "Traces and draws different lines and simple patterns",
                "Traces, copies and writes letters of Urdu alphabet",
                "Traces, copies and writes letters of English alphabet",
                "Writes own name in English with appropriate case",
                "Writes own name in Urdu",
                "Writes a word or sentence while describing a picture"
            ] 
        },
        section3: { 
            title: "Step C: Basic Mathematical Concepts", 
            items: [
                "Recognises, names and differentiates between colours",
                "Differentiates objects based on size, weight, length, width, texture",
                "Matches and compares objects",
                "Sorts and groups objects",
                "Observes, identifies and extends patterns with concrete materials",
                "Observes, identifies and extends picture/symbol patterns",
                "Identifies and differentiates between broad and narrow",
                "Identifies and differentiates between some and all",
                "Identifies and differentiates between more, less and equal",
                "Identifies and differentiates between half and full",
                "Creates own patterns and explains them",
                "Identifies the 'odd one out' and explains answer"
            ],
            shapesItems: [
                "Recognises, names, draws 2D shapes and explains features",
                "Recognises, names, draws 3D shapes and explains features",
                "Identifies shapes in the environment",
                "Draws objects using various shapes",
                "Describes position and order using position words"
            ],
            measurementItems: [
                "Describes and compares objects using measurement attributes",
                "Observes objects and estimates weight and length",
                "Verifies estimations using simple tools",
                "Recognises informal time units",
                "Sequences events in time and anticipates events"
            ],
            numberItems: [
                "Understands one-to-one correspondence",
                "Counts up to 50 orally",
                "Uses numbers to represent quantities in daily life",
                "Compares quantities of objects",
                "Demonstrates understanding of concept of zero",
                "Identifies and writes numerals from 0-50",
                "Sequences numerals correctly from 0-50",
                "Identifies which numeral represents bigger/smaller quantity",
                "Identifies ordinal numbers up to ten"
            ] 
        },
        section4: { 
            title: "Step D: Health, Hygiene and Safety", 
            items: [
                "Demonstrates understanding of private body parts (good/bad touch)",
                "Understands to report inappropriate touching to parents/teacher",
                "Understands not to talk to or go with strangers",
                "Explores ways of dealing with issues through role play",
                "Understands how to cross a road carefully",
                "Recognises and follows basic safety rules",
                "Expresses needs and feelings (hungry, thirsty, toilet)",
                "Keeps self safe and knows what to do in emergency"
            ] 
        },
        section5: { 
            title: "Step E: Physical Development", 
            items: [
                "Moves in various ways (running, jumping, skipping, hopping)",
                "Climbs, balances, walks on straight/curved/zigzag lines",
                "Moves through spaces with consideration of others",
                "Shows respect for others' personal space while playing",
                "Handles materials safely with control and confidence",
                "Manipulates small objects with ease",
                "Differentiates between smells (good, bad, strong, fruity)",
                "Differentiates between tastes (sweet, bitter, salty, sour)",
                "Differentiates between textures (smooth, rough, soft, hard)"
            ] 
        },
        section6: { 
            title: "Step F: Creative Arts", 
            items: [
                "Holds crayon, pencil, brush, scissors with safe use",
                "Uses variety of mediums to express thoughts and feelings",
                "Practices art work using technology",
                "Shares ideas for creating objects from low/no cost material",
                "Uses art techniques (drawing, colouring, collage, printing)",
                "Produces sound patterns/rhythms by counting beats",
                "Explores sounds made by various musical instruments",
                "Performs poems with actions",
                "Explores and enacts a variety of roles"
            ] 
        },
        section7: { 
            title: "Step G: World Around Us", 
            items: [
                "Recognizes pictures, objects and events in daily life",
                "Describes focus concept/theme using relevant terms",
                "Groups pictures, objects related to concept and explains",
                "Compares pictures, objects related to concept",
                "Uses non-standard units to record observations",
                "Makes predictions about the focus concept/theme",
                "Explores answers using variety of resources",
                "Handles materials carefully while exploring",
                "Demonstrates care while handling materials"
            ] 
        }
    };

    const container = document.getElementById('assessmentSections');
    if (!container) return;
    container.innerHTML = '';

    for (let i = 1; i <= 7; i++) {
        const section = assessmentData[`section${i}`];
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'assessment-section';
        
        let html = `<div class="section-title">${section.title}</div>`;
        html += `<table class="assessment-table"><thead><tr><th width="70%">Assessment Focus</th><th width="30%">Performance</th></tr></thead><tbody>`;
        
        section.items.forEach((item, idx) => {
            html += `<tr><td>${item}</td><td><select class="performance-select" data-section="${i}" data-item="${i}-${idx}"><option value="NI">NI</option><option value="E">E</option><option value="D">D</option><option value="S">S</option></select></td></tr>`;
        });
        
        if (section.readingItems) {
            html += `</tbody></table><h3 style="margin-top:20px;color:var(--text-secondary);">📖 Reading Skills</h3><table class="assessment-table"><thead><tr><th width="70%">Assessment Focus</th><th width="30%">Performance</th></tr></thead><tbody>`;
            section.readingItems.forEach((item, idx) => {
                html += `<tr><td>${item}</td><td><select class="performance-select" data-section="${i}" data-item="${i}-reading-${idx}"><option value="NI">NI</option><option value="E">E</option><option value="D">D</option><option value="S">S</option></select></td></tr>`;
            });
        }
        
        if (section.writingItems) {
            html += `</tbody></table><h3 style="margin-top:20px;color:var(--text-secondary);">✏️ Writing Skills</h3><table class="assessment-table"><thead><tr><th width="70%">Assessment Focus</th><th width="30%">Performance</th></tr></thead><tbody>`;
            section.writingItems.forEach((item, idx) => {
                html += `<tr><td>${item}</td><td><select class="performance-select" data-section="${i}" data-item="${i}-writing-${idx}"><option value="NI">NI</option><option value="E">E</option><option value="D">D</option><option value="S">S</option></select></td></tr>`;
            });
        }
        
        if (section.shapesItems) {
            html += `</tbody></table><h3 style="margin-top:20px;color:var(--text-secondary);">🔷 Shapes and Position</h3><table class="assessment-table"><thead><tr><th width="70%">Assessment Focus</th><th width="30%">Performance</th></tr></thead><tbody>`;
            section.shapesItems.forEach((item, idx) => {
                html += `<tr><td>${item}</td><td><select class="performance-select" data-section="${i}" data-item="${i}-shapes-${idx}"><option value="NI">NI</option><option value="E">E</option><option value="D">D</option><option value="S">S</option></select></td></tr>`;
            });
        }
        
        if (section.measurementItems) {
            html += `</tbody></table><h3 style="margin-top:20px;color:var(--text-secondary);">📏 Measurement</h3><table class="assessment-table"><thead><tr><th width="70%">Assessment Focus</th><th width="30%">Performance</th></tr></thead><tbody>`;
            section.measurementItems.forEach((item, idx) => {
                html += `<tr><td>${item}</td><td><select class="performance-select" data-section="${i}" data-item="${i}-measure-${idx}"><option value="NI">NI</option><option value="E">E</option><option value="D">D</option><option value="S">S</option></select></td></tr>`;
            });
        }
        
        if (section.numberItems) {
            html += `</tbody></table><h3 style="margin-top:20px;color:var(--text-secondary);">🔢 Quantity, Counting and Number Operations</h3><table class="assessment-table"><thead><tr><th width="70%">Assessment Focus</th><th width="30%">Performance</th></tr></thead><tbody>`;
            section.numberItems.forEach((item, idx) => {
                html += `<tr><td>${item}</td><td><select class="performance-select" data-section="${i}" data-item="${i}-number-${idx}"><option value="NI">NI</option><option value="E">E</option><option value="D">D</option><option value="S">S</option></select></td></tr>`;
            });
        }
        
        html += '</tbody></table>';
        sectionDiv.innerHTML = html;
        container.appendChild(sectionDiv);
    }

    // Initialize select colors
    document.querySelectorAll('.performance-select').forEach(select => {
        const tool = new ToolManager();
        tool.updateSelectColor(select);
    });
}

// ============================================================
// CREATE PROGRESS BARS
// ============================================================
function createProgressBars() {
    const container = document.getElementById('progressBars');
    if (!container) return;
    
    const domains = [
        'Personal, Social, and Emotional Development',
        'Language and Literacy',
        'Basic Mathematical Concepts',
        'Health Hygiene and Safety',
        'Physical Development',
        'Creative Arts',
        'World Around Us'
    ];
    
    container.innerHTML = '';
    for (let i = 1; i <= 7; i++) {
        container.innerHTML += `
            <div class="progress-item">
                <div class="progress-label">
                    <span>${domains[i-1]}</span>
                    <span id="progress-${i}">0%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" id="progress-bar-${i}" style="width:0%"></div>
                </div>
            </div>
        `;
    }
}

// ============================================================
// INITIALIZE APPLICATION
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    // Add animation keyframes to head
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Populate assessment sections
    populateAssessmentSections();
    
    // Create progress bars
    createProgressBars();
    
    // Initialize tool manager
    const tool = new ToolManager();
    
    // Make tool globally accessible for debugging
    window.toolManager = tool;
});
