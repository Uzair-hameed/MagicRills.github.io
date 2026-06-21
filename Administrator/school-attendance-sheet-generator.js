// ============================================
// SMART ATTENDANCE SYSTEM - MAIN JAVASCRIPT
// CLOUDFLARE WORKERS API INTEGRATION
// ============================================

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    API_BASE: 'https://magicrills-api.uzairhameed01.workers.dev',
    API_KEY: 'magicrills-grok-api.uzairhameed01.workers.dev',
    TOOL_SLUG: 'school-attendance-sheet-generator',
    TOOL_NAME: 'Smart Attendance System',
    CATEGORY: 'Administrator'
};

// ============================================
// GLOBAL VARIABLES
// ============================================
let students = [];
let schoolLogo = null;
let pieChart = null;
let lineChart = null;
let totalUsage = 0;
let userReactions = {};
let toolStats = {
    usage: 0,
    views: 0,
    shares: 0,
    followers: 0
};
let isApiAvailable = true;
let usageIncremented = false;

// ============================================
// DOM ELEMENTS (Cached for performance)
// ============================================
const gradeSelect = document.getElementById('gradeSelect');
const sectionSelect = document.getElementById('sectionSelect');
const datePicker = document.getElementById('datePicker');
const studentTableBody = document.getElementById('studentTableBody');
const cumulativeTableBody = document.getElementById('cumulativeTableBody');

// ============================================
// API CALLS - CLOUDFLARE WORKERS
// ============================================
async function callApi(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': CONFIG.API_KEY
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(`${CONFIG.API_BASE}${endpoint}`, options);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.warn('API call failed, using fallback:', error);
        isApiAvailable = false;
        return null;
    }
}

// ============================================
// USAGE COUNTER - Cloudflare API
// ============================================
async function incrementUsage() {
    if (usageIncremented) return;
    
    try {
        const result = await callApi('/api/usage', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            tool_name: CONFIG.TOOL_NAME,
            category: CONFIG.CATEGORY
        });
        
        if (result && result.success) {
            totalUsage = result.usage_count || 0;
            usageIncremented = true;
            localStorage.setItem('totalUsage', totalUsage);
            updateUsageDisplay();
        } else {
            // Fallback to localStorage
            totalUsage = parseInt(localStorage.getItem('totalUsage') || '0') + 1;
            localStorage.setItem('totalUsage', totalUsage);
            usageIncremented = true;
            updateUsageDisplay();
        }
    } catch (error) {
        console.warn('Usage increment fallback:', error);
        totalUsage = parseInt(localStorage.getItem('totalUsage') || '0') + 1;
        localStorage.setItem('totalUsage', totalUsage);
        usageIncremented = true;
        updateUsageDisplay();
    }
}

function updateUsageDisplay() {
    document.getElementById('toolUsageCount').textContent = totalUsage || 0;
    document.getElementById('globalUsageCount').textContent = totalUsage || 0;
}

// ============================================
// TOOL STATS - Cloudflare API
// ============================================
async function fetchToolStats() {
    try {
        const result = await callApi(`/api/stats?tool_slug=${CONFIG.TOOL_SLUG}`, 'GET');
        
        if (result && result.success) {
            toolStats = result.data || toolStats;
            updateStatsDisplay();
            // Save to localStorage as fallback
            localStorage.setItem('toolStats', JSON.stringify(toolStats));
        } else {
            // Fallback to localStorage
            const savedStats = localStorage.getItem('toolStats');
            if (savedStats) {
                toolStats = JSON.parse(savedStats);
                updateStatsDisplay();
            }
        }
    } catch (error) {
        console.warn('Stats fetch fallback:', error);
        const savedStats = localStorage.getItem('toolStats');
        if (savedStats) {
            toolStats = JSON.parse(savedStats);
            updateStatsDisplay();
        }
    }
}

function updateStatsDisplay() {
    // Update dashboard stats in UI
    const statElements = {
        'totalStudents': students.length,
        'presentCount': getTodayPresent(),
        'absentCount': getTodayAbsent(),
        'leaveCount': getTodayLeave(),
        'attPercent': getTodayPercent()
    };
    
    // Update any stat cards that show tool stats
    document.querySelectorAll('.stat-card .value').forEach(el => {
        const label = el.closest('.stat-card')?.querySelector('.label')?.textContent;
        if (label === 'Total Students') el.textContent = students.length;
        else if (label === 'Present Today') el.textContent = getTodayPresent();
        else if (label === 'Absent') el.textContent = getTodayAbsent();
        else if (label === 'On Leave') el.textContent = getTodayLeave();
        else if (label === 'Attendance Rate') el.textContent = getTodayPercent() + '%';
    });
}

function getTodayPresent() {
    const date = datePicker.value;
    return students.filter(s => s.attendance[date] === 'Present').length;
}

function getTodayAbsent() {
    const date = datePicker.value;
    return students.filter(s => s.attendance[date] === 'Absent').length;
}

function getTodayLeave() {
    const date = datePicker.value;
    return students.filter(s => s.attendance[date] === 'Leave').length;
}

function getTodayPercent() {
    const date = datePicker.value;
    const present = getTodayPresent();
    const total = students.length;
    return total > 0 ? Math.round((present / total) * 100) : 0;
}

// ============================================
// REACTIONS SYSTEM - Cloudflare API
// ============================================
async function loadReactions() {
    try {
        // Try to get reactions from API first
        const result = await callApi('/api/reactions', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            action: 'get'
        });
        
        if (result && result.success) {
            const reactions = result.reactions || {};
            updateReactionCounts(reactions);
            localStorage.setItem('reactions', JSON.stringify(reactions));
        } else {
            // Fallback to localStorage
            const reactions = JSON.parse(localStorage.getItem('reactions') || '{"like":0,"love":0,"wow":0,"sad":0,"laugh":0,"celebrate":0}');
            updateReactionCounts(reactions);
        }
    } catch (error) {
        console.warn('Reactions load fallback:', error);
        const reactions = JSON.parse(localStorage.getItem('reactions') || '{"like":0,"love":0,"wow":0,"sad":0,"laugh":0,"celebrate":0}');
        updateReactionCounts(reactions);
    }
    
    // Setup reaction event listeners
    document.querySelectorAll('.reaction').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.reaction;
            addReaction(type);
        });
    });
}

async function addReaction(type) {
    // Check if user already reacted
    userReactions = JSON.parse(localStorage.getItem('userReactions') || '{}');
    if (userReactions[type]) {
        showToast('You already reacted with this emoji', 'info');
        return;
    }
    
    try {
        const result = await callApi('/api/reactions', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            reaction: type,
            action: 'add'
        });
        
        if (result && result.success) {
            const reactions = result.reactions || {};
            updateReactionCounts(reactions);
            localStorage.setItem('reactions', JSON.stringify(reactions));
            
            userReactions[type] = true;
            localStorage.setItem('userReactions', JSON.stringify(userReactions));
            showToast('Thank you for your feedback!', 'success');
        } else {
            // Fallback to localStorage
            const reactions = JSON.parse(localStorage.getItem('reactions') || '{"like":0,"love":0,"wow":0,"sad":0,"laugh":0,"celebrate":0}');
            reactions[type] = (reactions[type] || 0) + 1;
            localStorage.setItem('reactions', JSON.stringify(reactions));
            updateReactionCounts(reactions);
            
            userReactions[type] = true;
            localStorage.setItem('userReactions', JSON.stringify(userReactions));
            showToast('Thank you for your feedback!', 'success');
        }
    } catch (error) {
        console.warn('Reaction add fallback:', error);
        const reactions = JSON.parse(localStorage.getItem('reactions') || '{"like":0,"love":0,"wow":0,"sad":0,"laugh":0,"celebrate":0}');
        reactions[type] = (reactions[type] || 0) + 1;
        localStorage.setItem('reactions', JSON.stringify(reactions));
        updateReactionCounts(reactions);
        
        userReactions[type] = true;
        localStorage.setItem('userReactions', JSON.stringify(userReactions));
        showToast('Thank you for your feedback!', 'success');
    }
}

function updateReactionCounts(reactions) {
    document.getElementById('likeCount').textContent = reactions.like || 0;
    document.getElementById('loveCount').textContent = reactions.love || 0;
    document.getElementById('wowCount').textContent = reactions.wow || 0;
    document.getElementById('sadCount').textContent = reactions.sad || 0;
    document.getElementById('laughCount').textContent = reactions.laugh || 0;
    document.getElementById('celebrateCount').textContent = reactions.celebrate || 0;
}

// ============================================
// SHARE TRACKING - Cloudflare API
// ============================================
async function recordShare(platform) {
    try {
        const result = await callApi('/api/shares', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            platform: platform
        });
        
        if (result && result.success) {
            toolStats.shares = result.shares_count || 0;
            localStorage.setItem('toolStats', JSON.stringify(toolStats));
        }
    } catch (error) {
        console.warn('Share tracking fallback:', error);
        toolStats.shares = (toolStats.shares || 0) + 1;
        localStorage.setItem('toolStats', JSON.stringify(toolStats));
    }
}

// ============================================
// SOCIAL SHARING (Updated with tracking)
// ============================================
function shareOnFacebook() {
    recordShare('facebook');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
}

function shareOnTwitter() {
    recordShare('twitter');
    window.open(`https://twitter.com/intent/tweet?text=Check out this Smart Attendance System!&url=${encodeURIComponent(window.location.href)}`, '_blank');
}

function shareOnWhatsApp() {
    recordShare('whatsapp');
    window.open(`https://wa.me/?text=${encodeURIComponent('Smart Attendance System - ' + window.location.href)}`, '_blank');
}

function shareOnLinkedIn() {
    recordShare('linkedin');
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
}

function copyPageURL() {
    recordShare('copy');
    navigator.clipboard.writeText(window.location.href);
    showToast('URL copied to clipboard!', 'success');
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    datePicker.value = today;
    
    // Load data from localStorage first (fast)
    loadFromLocalStorage();
    
    // Initialize UI
    loadClassData();
    updateStats();
    initCharts();
    updateUsageDisplay();
    setupTheme();
    setupSearch();
    setupEventListeners();
    
    // Load reactions
    loadReactions();
    
    // Fetch tool stats from API
    fetchToolStats();
    
    // Increment usage (only once per load)
    incrementUsage();
    
    showToast('Welcome to Smart Attendance System!', 'success');
});

function setupEventListeners() {
    datePicker.addEventListener('change', () => { loadClassData(); updateStats(); });
    gradeSelect.addEventListener('change', () => loadClassData());
    sectionSelect.addEventListener('change', () => loadClassData());
    
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('searchInput').addEventListener('keyup', searchStudent);
}

function scrollToApp() {
    document.getElementById('mainApp').scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// LOCAL STORAGE (Fallback)
// ============================================
function saveToLocalStorage() {
    localStorage.setItem('attendanceData', JSON.stringify(students));
    if (schoolLogo) localStorage.setItem('schoolLogo', schoolLogo);
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('attendanceData');
    if (saved) students = JSON.parse(saved);
    
    const savedLogo = localStorage.getItem('schoolLogo');
    if (savedLogo) {
        schoolLogo = savedLogo;
        document.getElementById('logoPreview').src = schoolLogo;
    }
}

// ============================================
// THEME - Dark Space + Neon
// ============================================
function setupTheme() {
    const isDark = localStorage.getItem('darkMode') !== 'false';
    if (isDark) {
        document.body.classList.add('dark-mode');
        document.querySelector('#themeToggle i').className = 'fas fa-sun';
    } else {
        document.body.classList.remove('dark-mode');
        document.querySelector('#themeToggle i').className = 'fas fa-moon';
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    const icon = document.querySelector('#themeToggle i');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled', 'info');
}

// ============================================
// SCROLL BUTTONS
// ============================================
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// ============================================
// TOAST & LOADING
// ============================================
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.background = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#1e293b';
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

function showLoading(show) {
    const loader = document.getElementById('loading');
    show ? loader.classList.remove('hidden') : loader.classList.add('hidden');
}

// ============================================
// STUDENT MANAGEMENT
// ============================================
function addStudent() {
    const name = document.getElementById('studentName').value.trim();
    const grade = gradeSelect.value;
    const section = sectionSelect.value;
    
    if (!name) {
        showToast('Please enter student name', 'error');
        return;
    }
    
    const existing = students.find(s => s.name.toLowerCase() === name.toLowerCase() && s.grade === grade && s.class === section);
    if (existing) {
        showToast('Student already exists in this class', 'error');
        return;
    }
    
    const classStudents = students.filter(s => s.grade === grade && s.class === section);
    const rollNo = classStudents.length > 0 ? Math.max(...classStudents.map(s => s.rollNo)) + 1 : 1;
    
    students.push({
        id: Date.now().toString(),
        rollNo: rollNo,
        name: name,
        grade: grade,
        class: section,
        attendance: {},
        createdAt: new Date().toISOString()
    });
    
    saveToLocalStorage();
    loadClassData();
    updateStats();
    document.getElementById('studentName').value = '';
    showToast(`Student ${name} added successfully`, 'success');
    incrementUsage();
}

function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        const student = students.find(s => s.id === id);
        students = students.filter(s => s.id !== id);
        saveToLocalStorage();
        loadClassData();
        updateStats();
        showToast(`Student ${student?.name} deleted`, 'success');
    }
}

function loadClassData() {
    const grade = gradeSelect.value;
    const section = sectionSelect.value;
    const date = datePicker.value;
    
    const classStudents = students.filter(s => s.grade === grade && s.class === section).sort((a, b) => a.rollNo - b.rollNo);
    
    if (classStudents.length === 0) {
        studentTableBody.innerHTML = '<tr><td colspan="6" class="empty-state"><i class="fas fa-users-slash"></i>No students found<br><small>Click "Add Student" to add students to this class</small></td></tr>';
        updateTabulationDisplay(0, 0, 0, 0);
        updateCharts(0, 0, 0);
        return;
    }
    
    studentTableBody.innerHTML = '';
    classStudents.forEach(s => {
        const status = s.attendance[date] || '';
        let statusHtml = '';
        if (status === 'Present') statusHtml = '<span class="status-present" onclick="changeStatus(\'' + s.id + '\')">Present</span>';
        else if (status === 'Absent') statusHtml = '<span class="status-absent" onclick="changeStatus(\'' + s.id + '\')">Absent</span>';
        else if (status === 'Leave') statusHtml = '<span class="status-leave" onclick="changeStatus(\'' + s.id + '\')">Leave</span>';
        else statusHtml = '<span class="empty-status" onclick="changeStatus(\'' + s.id + '\')">Click to mark</span>';
        
        studentTableBody.innerHTML += `
            <tr>
                <td>${s.rollNo}</td>
                <td><strong>${escapeHtml(s.name)}</strong></td>
                <td>${s.grade}</td>
                <td>${s.class}</td>
                <td>${statusHtml}</td>
                <td><button class="delete-btn" onclick="deleteStudent('${s.id}')"><i class="fas fa-trash"></i></button></td>
            </tr>
        `;
    });
    
    // Update tabulation
    const present = classStudents.filter(s => s.attendance[date] === 'Present').length;
    const absent = classStudents.filter(s => s.attendance[date] === 'Absent').length;
    const leave = classStudents.filter(s => s.attendance[date] === 'Leave').length;
    const total = classStudents.length;
    updateTabulationDisplay(total, present, absent, leave);
    updateCharts(present, absent, leave);
    
    // Load cumulative report
    loadCumulativeReport();
}

function changeStatus(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    const date = datePicker.value;
    const current = student.attendance[date] || '';
    let newStatus;
    if (!current || current === 'Absent') newStatus = 'Present';
    else if (current === 'Present') newStatus = 'Leave';
    else newStatus = 'Absent';
    
    student.attendance[date] = newStatus;
    saveToLocalStorage();
    loadClassData();
    updateStats();
    showToast(`${student.name} marked as ${newStatus}`, 'success');
    incrementUsage();
}

function searchStudent() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const rows = studentTableBody.querySelectorAll('tr');
    rows.forEach(row => {
        const name = row.cells[1]?.textContent.toLowerCase() || '';
        row.style.display = name.includes(term) ? '' : 'none';
    });
}

function setupSearch() {
    // Search is already set up in event listeners
}

// ============================================
// STATS & TABULATION
// ============================================
function updateStats() {
    const total = students.length;
    const grade = gradeSelect.value;
    const section = sectionSelect.value;
    const date = datePicker.value;
    
    const classStudents = students.filter(s => s.grade === grade && s.class === section);
    const present = classStudents.filter(s => s.attendance[date] === 'Present').length;
    const absent = classStudents.filter(s => s.attendance[date] === 'Absent').length;
    const leave = classStudents.filter(s => s.attendance[date] === 'Leave').length;
    const percent = classStudents.length > 0 ? Math.round((present / classStudents.length) * 100) : 0;
    
    document.getElementById('totalStudents').textContent = total;
    document.getElementById('presentCount').textContent = present;
    document.getElementById('absentCount').textContent = absent;
    document.getElementById('leaveCount').textContent = leave;
    document.getElementById('attPercent').textContent = `${percent}%`;
}

function updateTabulationDisplay(total, present, absent, leave) {
    const percent = total > 0 ? Math.round((present / total) * 100) : 0;
    document.getElementById('tabTotal').textContent = total;
    document.getElementById('tabPresent').textContent = present;
    document.getElementById('tabAbsent').textContent = absent;
    document.getElementById('tabLeave').textContent = leave;
    document.getElementById('tabPercent').textContent = `${percent}%`;
}

// ============================================
// CHARTS
// ============================================
function initCharts() {
    const ctx1 = document.getElementById('pieChart').getContext('2d');
    const ctx2 = document.getElementById('lineChart').getContext('2d');
    
    pieChart = new Chart(ctx1, {
        type: 'doughnut',
        data: {
            labels: ['Present', 'Absent', 'Leave'],
            datasets: [{ data: [0, 0, 0], backgroundColor: ['#10b981', '#ef4444', '#f59e0b'], borderWidth: 0 }]
        },
        options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'bottom' } } }
    });
    
    lineChart = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [{ label: 'Attendance %', data: [0, 0, 0, 0, 0, 0], borderColor: '#4f46e5', backgroundColor: 'rgba(79,70,229,0.1)', tension: 0.4, fill: true }]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true, max: 100, title: { display: true, text: 'Percentage (%)' } } } }
    });
}

function updateCharts(present, absent, leave) {
    if (pieChart) {
        pieChart.data.datasets[0].data = [present, absent, leave];
        pieChart.update();
    }
    
    // Update weekly trend
    const grade = gradeSelect.value;
    const section = sectionSelect.value;
    const classStudents = students.filter(s => s.grade === grade && s.class === section);
    const weeklyData = [];
    
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const p = classStudents.filter(s => s.attendance[dateStr] === 'Present').length;
        const percent = classStudents.length > 0 ? (p / classStudents.length) * 100 : 0;
        weeklyData.push(Math.round(percent));
    }
    
    if (lineChart) {
        lineChart.data.datasets[0].data = weeklyData;
        lineChart.update();
    }
}

// ============================================
// CUMULATIVE REPORT
// ============================================
function loadCumulativeReport() {
    const date = datePicker.value;
    const grades = ['PG', 'KG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    const sections = ['A', 'B', 'C', 'D'];
    let report = [];
    let totalStudents = 0, totalPresent = 0, totalAbsent = 0, totalLeave = 0;
    
    grades.forEach(grade => {
        sections.forEach(section => {
            const classStudents = students.filter(s => s.grade === grade && s.class === section);
            if (classStudents.length === 0) return;
            
            const present = classStudents.filter(s => s.attendance[date] === 'Present').length;
            const absent = classStudents.filter(s => s.attendance[date] === 'Absent').length;
            const leave = classStudents.filter(s => s.attendance[date] === 'Leave').length;
            const total = classStudents.length;
            const percent = total > 0 ? Math.round((present / total) * 100) : 0;
            
            report.push({ grade, section, total, present, absent, leave, percent });
            totalStudents += total;
            totalPresent += present;
            totalAbsent += absent;
            totalLeave += leave;
        });
    });
    
    // Update summary
    document.getElementById('totalClasses').textContent = report.length;
    document.getElementById('totalStudentsAll').textContent = totalStudents;
    document.getElementById('totalPresentAll').textContent = totalPresent;
    document.getElementById('totalAbsentAll').textContent = totalAbsent;
    document.getElementById('totalLeaveAll').textContent = totalLeave;
    document.getElementById('overallPercent').textContent = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) + '%' : '0%';
    
    if (report.length === 0) {
        cumulativeTableBody.innerHTML = '<tr><td colspan="9" class="empty-state">No data available for selected date</td></tr>';
        return;
    }
    
    cumulativeTableBody.innerHTML = '';
    report.forEach((r, i) => {
        let percentClass = 'percent-high';
        if (r.percent < 75) percentClass = 'percent-low';
        else if (r.percent < 85) percentClass = 'percent-medium';
        
        cumulativeTableBody.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td><strong>Grade ${r.grade}</strong></td>
                <td>Section ${r.section}</td>
                <td>${r.total}</td>
                <td style="color:#10b981; font-weight:bold">${r.present}</td>
                <td style="color:#ef4444; font-weight:bold">${r.absent}</td>
                <td style="color:#f59e0b; font-weight:bold">${r.leave}</td>
                <td><span class="percent-badge ${percentClass}">${r.percent}%</span></td>
                <td><div class="status-bar"><div class="status-bar-fill" style="width:${r.percent}%"></div></div></td>
            </tr>
        `;
    });
}

function exportCumulativeReport() {
    const date = datePicker.value;
    const rows = cumulativeTableBody.querySelectorAll('tr');
    
    if (rows.length === 0 || rows[0].cells.length < 8) {
        showToast('No data to export', 'error');
        return;
    }
    
    const excelData = [['#', 'Grade', 'Section', 'Total Students', 'Present', 'Absent', 'Leave', 'Attendance %']];
    
    rows.forEach((row, idx) => {
        const cells = row.cells;
        if (cells.length >= 8) {
            excelData.push([
                idx + 1,
                cells[1]?.textContent || '',
                cells[2]?.textContent || '',
                cells[3]?.textContent || '',
                cells[4]?.textContent || '',
                cells[5]?.textContent || '',
                cells[6]?.textContent || '',
                cells[7]?.textContent || ''
            ]);
        }
    });
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, `Cumulative_Report_${date}`);
    XLSX.writeFile(wb, `Cumulative_Report_${date}.xlsx`);
    showToast('Cumulative report exported', 'success');
}

// ============================================
// EXPORT FUNCTIONS
// ============================================
function exportToCSV() {
    const grade = gradeSelect.value;
    const section = sectionSelect.value;
    const date = datePicker.value;
    const classStudents = students.filter(s => s.grade === grade && s.class === section);
    
    let csv = 'Roll No,Student Name,Grade,Section,Status\n';
    classStudents.forEach(s => {
        csv += `${s.rollNo},${s.name},${s.grade},${s.class},${s.attendance[date] || 'Not Marked'}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    saveAs(blob, `Attendance_${grade}_${section}_${date}.csv`);
    showToast('CSV exported', 'success');
}

function exportToExcel() {
    const grade = gradeSelect.value;
    const section = sectionSelect.value;
    const date = datePicker.value;
    const classStudents = students.filter(s => s.grade === grade && s.class === section);
    
    const excelData = [['Roll No', 'Student Name', 'Grade', 'Section', 'Status']];
    classStudents.forEach(s => {
        excelData.push([s.rollNo, s.name, s.grade, s.class, s.attendance[date] || 'Not Marked']);
    });
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    XLSX.writeFile(wb, `Attendance_${grade}_${section}_${date}.xlsx`);
    showToast('Excel exported', 'success');
}

function exportToPDF() {
    const grade = gradeSelect.value;
    const section = sectionSelect.value;
    const date = datePicker.value;
    const classStudents = students.filter(s => s.grade === grade && s.class === section);
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Attendance Report', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Grade: ${grade} - Section: ${section}`, 20, 40);
    doc.text(`Date: ${date}`, 20, 50);
    doc.text(`Total Students: ${classStudents.length}`, 20, 60);
    
    let y = 80;
    doc.setFontSize(10);
    doc.text('Roll No', 20, y);
    doc.text('Name', 50, y);
    doc.text('Status', 150, y);
    y += 10;
    
    classStudents.forEach(s => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(s.rollNo.toString(), 20, y);
        doc.text(s.name.substring(0, 30), 50, y);
        doc.text(s.attendance[date] || 'Not Marked', 150, y);
        y += 8;
    });
    
    doc.save(`Attendance_${grade}_${section}_${date}.pdf`);
    showToast('PDF exported', 'success');
}

function importCSV() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            const rows = event.target.result.split('\n').slice(1);
            let count = 0;
            rows.forEach(row => {
                const cols = row.split(',');
                if (cols.length >= 2 && cols[1] && cols[1] !== 'Student Name') {
                    const existing = students.find(s => s.name === cols[1]);
                    if (!existing) {
                        students.push({
                            id: Date.now().toString() + count,
                            rollNo: students.length + 1,
                            name: cols[1],
                            grade: cols[2] || '1',
                            class: cols[3] || 'A',
                            attendance: {},
                            createdAt: new Date().toISOString()
                        });
                        count++;
                    }
                }
            });
            saveToLocalStorage();
            loadClassData();
            updateStats();
            showToast(`Imported ${count} students`, 'success');
        };
        reader.readAsText(file);
    };
    input.click();
}

function generateMonthlyReport() {
    const grade = gradeSelect.value;
    const section = sectionSelect.value;
    const monthYear = prompt('Enter month and year (MM/YYYY):', new Date().toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' }));
    if (!monthYear) return;
    
    const [month, year] = monthYear.split('/');
    const daysInMonth = new Date(year, month, 0).getDate();
    const classStudents = students.filter(s => s.grade === grade && s.class === section);
    
    if (classStudents.length === 0) {
        showToast('No students in this class', 'error');
        return;
    }
    
    const excelData = [['Roll No', 'Student Name']];
    for (let i = 1; i <= daysInMonth; i++) excelData[0].push(`${i}/${month}`);
    excelData[0].push('Present', 'Absent', 'Leave', 'Attendance %');
    
    classStudents.forEach(s => {
        const row = [s.rollNo, s.name];
        let present = 0, absent = 0, leave = 0;
        for (let i = 1; i <= daysInMonth; i++) {
            const date = `${year}-${month.padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
            const status = s.attendance[date] || '';
            row.push(status === 'Present' ? 'P' : status === 'Absent' ? 'A' : status === 'Leave' ? 'L' : '-');
            if (status === 'Present') present++;
            else if (status === 'Absent') absent++;
            else if (status === 'Leave') leave++;
        }
        const total = present + absent + leave;
        const percent = total > 0 ? Math.round((present / total) * 100) : 0;
        row.push(present, absent, leave, `${percent}%`);
        excelData.push(row);
    });
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, `Monthly_Report_${month}_${year}`);
    XLSX.writeFile(wb, `Monthly_Report_${grade}_${section}_${month}_${year}.xlsx`);
    showToast('Monthly report generated', 'success');
}

// ============================================
// AI QUOTE GENERATION
// ============================================
const quotes = [
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
    { text: "Education is not preparation for life; education is life itself.", author: "John Dewey" },
    { text: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle" },
    { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
    { text: "The only person who is educated is the one who has learned how to learn and change.", author: "Carl Rogers" },
    { text: "Intelligence plus character - that is the goal of true education.", author: "Martin Luther King Jr." },
    { text: "The purpose of education is to replace an empty mind with an open one.", author: "Malcolm Forbes" }
];

function generateAIQuote() {
    const modal = document.getElementById('aiModal');
    modal.classList.remove('hidden');
    
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('aiQuoteText').textContent = `"${random.text}"`;
    document.getElementById('aiQuoteAuthor').textContent = `— ${random.author}`;
}

function closeModal() {
    document.getElementById('aiModal').classList.add('hidden');
}

// ============================================
// LOGO UPLOAD
// ============================================
document.getElementById('logoUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            schoolLogo = event.target.result;
            document.getElementById('logoPreview').src = schoolLogo;
            saveToLocalStorage();
            showToast('Logo uploaded successfully', 'success');
        };
        reader.readAsDataURL(file);
    }
});

// ============================================
// UTILITIES
// ============================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initial load
loadCumulativeReport();
showToast('System ready!', 'success');
