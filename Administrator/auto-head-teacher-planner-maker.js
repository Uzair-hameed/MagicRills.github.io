// ============================================
// GLOBAL VARIABLES & CONFIGURATION
// ============================================
const TOOL_SLUG = 'auto-head-teacher-planner';
const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev/api';
let currentUsage = 0;
let currentReactions = {
    like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0
};
let userReacted = new Set();
let sessionId = localStorage.getItem('sessionId') || 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
localStorage.setItem('sessionId', sessionId);

// Activities list
const activities = [
    "", "📢 Morning Assembly", "👥 Staff Meeting", "🏛️ Official Visit", "👀 Classroom Observation",
    "📝 Copy Checking Task", "👪 Parent Interaction", "📄 Report Writing", "💼 Administrative Work",
    "🏫 Class Visit", "☕ Break/Free Slot", "🎯 Custom Task", "📚 Lesson Planning", "✏️ Exam Preparation",
    "🏆 Extracurricular Activity", "📊 Data Entry", "🖥️ Computer Lab", "🔬 Science Lab", "📖 Library Period"
];

// ============================================
// API ENDPOINTS (Cloudflare Workers)
// ============================================
async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        };
        if (data) {
            options.body = JSON.stringify(data);
        }
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// USAGE COUNTER FUNCTIONS (Cloudflare API)
// ============================================
async function incrementUsage() {
    try {
        const result = await apiCall('/usage', 'POST', { 
            tool_slug: TOOL_SLUG 
        });
        if (result && result.success) {
            currentUsage = result.count || 0;
            updateUsageDisplay(currentUsage);
            await loadGlobalStats();
        } else {
            // Fallback to local
            let local = parseInt(localStorage.getItem(`${TOOL_SLUG}_usage`) || '0');
            local++;
            localStorage.setItem(`${TOOL_SLUG}_usage`, local);
            currentUsage = local;
            updateUsageDisplay(currentUsage);
        }
        return result;
    } catch (error) {
        console.error('Usage increment error:', error);
        let local = parseInt(localStorage.getItem(`${TOOL_SLUG}_usage`) || '0');
        local++;
        localStorage.setItem(`${TOOL_SLUG}_usage`, local);
        currentUsage = local;
        updateUsageDisplay(currentUsage);
    }
}

async function getUsage() {
    try {
        const result = await apiCall(`/stats?tool_slug=${TOOL_SLUG}`, 'GET');
        if (result && result.success) {
            currentUsage = result.usage || 0;
            updateUsageDisplay(currentUsage);
        } else {
            const local = parseInt(localStorage.getItem(`${TOOL_SLUG}_usage`) || '0');
            currentUsage = local;
            updateUsageDisplay(currentUsage);
        }
    } catch (error) {
        console.error('Get usage error:', error);
        const local = parseInt(localStorage.getItem(`${TOOL_SLUG}_usage`) || '0');
        currentUsage = local;
        updateUsageDisplay(currentUsage);
    }
}

async function loadGlobalStats() {
    try {
        const result = await apiCall(`/stats?tool_slug=${TOOL_SLUG}`, 'GET');
        if (result && result.success) {
            document.getElementById('globalUsageCount').innerText = result.usage || 0;
            // Share count alag se lena hoga
            const shareResult = await apiCall(`/shares?tool_slug=${TOOL_SLUG}`, 'GET');
            if (shareResult && shareResult.success) {
                document.getElementById('globalShareCount').innerText = shareResult.shares || 0;
            }
        }
    } catch (error) {
        console.error('Global stats error:', error);
        document.getElementById('globalUsageCount').innerText = 'N/A';
    }
}

function updateUsageDisplay(count) {
    const usageElements = document.querySelectorAll('.stat-item span');
    if (usageElements[0]) usageElements[0].innerText = count || 0;
}

// ============================================
// REACTIONS FUNCTIONS (Cloudflare API)
// ============================================
async function loadReactions() {
    try {
        const result = await apiCall(`/reactions?tool_slug=${TOOL_SLUG}`, 'GET');
        if (result && result.success && result.reactions) {
            currentReactions = result.reactions;
            updateReactionDisplays();
        } else {
            const local = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_reactions`) || '{"like":0,"love":0,"wow":0,"sad":0,"angry":0,"laugh":0,"celebrate":0}');
            currentReactions = local;
            updateReactionDisplays();
        }
    } catch (error) {
        console.error('Load reactions error:', error);
    }
}

async function addReaction(emoji, reactionType) {
    if (userReacted.has(reactionType)) {
        showToast(`You already reacted with ${emoji}`, 'warning');
        return false;
    }
    
    try {
        const result = await apiCall('/reactions', 'POST', {
            tool_slug: TOOL_SLUG,
            emoji: emoji,
            reaction_type: reactionType
        });
        
        if (result && result.success) {
            userReacted.add(reactionType);
            if (result.reactions) {
                currentReactions = result.reactions;
                updateReactionDisplays();
            }
            showToast(`Thanks for your reaction ${emoji}`, 'success');
            return true;
        } else if (result && result.already_reacted) {
            showToast(`You already reacted with this emoji`, 'info');
            return false;
        } else {
            // Fallback local
            let local = JSON.parse(localStorage.getItem(`${TOOL_SLUG}_reactions`) || '{"like":0,"love":0,"wow":0,"sad":0,"angry":0,"laugh":0,"celebrate":0}');
            local[reactionType] = (local[reactionType] || 0) + 1;
            localStorage.setItem(`${TOOL_SLUG}_reactions`, JSON.stringify(local));
            await loadReactions();
            showToast(`Thanks for your reaction ${emoji}`, 'success');
            return true;
        }
    } catch (error) {
        console.error('Add reaction error:', error);
        showToast('Error adding reaction', 'error');
    }
    return false;
}

function updateReactionDisplays() {
    const mapping = {
        like: 'reactionLike',
        love: 'reactionLove',
        wow: 'reactionWow',
        sad: 'reactionSad',
        angry: 'reactionAngry',
        laugh: 'reactionLaugh',
        celebrate: 'reactionCelebrate'
    };
    
    for (const [key, elementId] of Object.entries(mapping)) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerText = currentReactions[key] || 0;
        }
    }
    
    const totalReactions = Object.values(currentReactions).reduce((a, b) => a + b, 0);
    const globalReactionElem = document.getElementById('globalReactionCount');
    if (globalReactionElem) globalReactionElem.innerText = totalReactions;
}

// ============================================
// SHARE FUNCTIONS (Cloudflare API)
// ============================================
async function trackShare(platform) {
    try {
        const result = await apiCall('/shares', 'POST', {
            tool_slug: TOOL_SLUG,
            platform: platform
        });
        if (result && result.success) {
            updateShareCount();
            showToast(`Shared on ${platform}!`, 'success');
        }
    } catch (error) {
        console.error('Track share error:', error);
    }
}

async function updateShareCount() {
    try {
        const result = await apiCall(`/shares?tool_slug=${TOOL_SLUG}`, 'GET');
        if (result && result.success) {
            const shareElem = document.getElementById('shareCount');
            if (shareElem) shareElem.innerText = `${result.shares || 0} shares`;
        } else {
            const shareElem = document.getElementById('shareCount');
            if (shareElem) shareElem.innerText = `0 shares`;
        }
    } catch (error) {
        console.error('Update share count error:', error);
        const shareElem = document.getElementById('shareCount');
        if (shareElem) shareElem.innerText = `0 shares`;
    }
}

function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
    trackShare('facebook');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out this Auto Head Teacher Weekly Planner with AI features!');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
    trackShare('twitter');
}

function shareOnWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://wa.me/?text=${url}`, '_blank', 'width=600,height=400');
    trackShare('whatsapp');
}

function shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=400');
    trackShare('linkedin');
}

function shareByEmail() {
    const subject = encodeURIComponent('Auto Head Teacher Weekly Planner');
    const body = encodeURIComponent(`Check out this amazing tool: ${window.location.href}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    trackShare('email');
}

function copyPageUrl() {
    navigator.clipboard.writeText(window.location.href);
    showToast('URL copied to clipboard!', 'success');
    trackShare('copy');
}

// ============================================
// EXPORT FUNCTIONS (MULTIPLE OPTIONS)
// ============================================

// Get current planner data as HTML table
function getPlannerHTML() {
    const schoolName = document.getElementById('schoolName').value || 'Untitled School';
    const headName = document.getElementById('headName').value || 'Head Teacher';
    const dateRange = document.getElementById('dateRange').value || new Date().toLocaleDateString();
    const remarks = document.getElementById('remarks').value || 'No remarks';
    const academicTerm = document.getElementById('academicTerm').value || 'Term 1';
    
    const periodsCount = parseInt(document.getElementById('periodsCount').value) || 8;
    const daysSelect = document.getElementById('daysSelect');
    const selectedDays = Array.from(daysSelect.selectedOptions).map(opt => opt.value);
    
    let tableHTML = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1>${schoolName}</h1>
                <h2>Weekly Planner</h2>
                <p><strong>Head Teacher:</strong> ${headName}</p>
                <p><strong>Term:</strong> ${academicTerm}</p>
                <p><strong>Date:</strong> ${dateRange}</p>
            </div>
            <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #4361ee; color: white;">
                        <th>Day</th>`;
    
    for (let i = 1; i <= periodsCount; i++) {
        tableHTML += `<th>Period ${i}</th>`;
    }
    tableHTML += `</tr></thead><tbody>`;
    
    for (let day of selectedDays) {
        tableHTML += `<tr><td><strong>${day}</strong></td>`;
        for (let i = 1; i <= periodsCount; i++) {
            const select = document.getElementById(`${day}_P${i}`);
            const customInput = document.getElementById(`${day}_P${i}_custom`);
            let value = select ? select.value : "";
            if (value === "🎯 Custom Task" && customInput) {
                value = customInput.value || "Custom Task";
            }
            tableHTML += `<td>${value || "-"}</td>`;
        }
        tableHTML += `</tr>`;
    }
    
    tableHTML += `
                </tbody>
            </table>
            <div style="margin-top: 30px; padding: 15px; background-color: #f0f0f0; border-radius: 5px;">
                <h3>Remarks:</h3>
                <p>${remarks}</p>
                <hr>
                <p style="font-size: 12px; color: #666;">Generated by Auto Head Teacher Weekly Planner - ${new Date().toLocaleString()}</p>
            </div>
        </div>
    `;
    
    return tableHTML;
}

// Get planner data as plain text
function getPlannerText() {
    const schoolName = document.getElementById('schoolName').value || 'Untitled School';
    const headName = document.getElementById('headName').value || 'Head Teacher';
    const dateRange = document.getElementById('dateRange').value || new Date().toLocaleDateString();
    const remarks = document.getElementById('remarks').value || 'No remarks';
    const academicTerm = document.getElementById('academicTerm').value || 'Term 1';
    
    const periodsCount = parseInt(document.getElementById('periodsCount').value) || 8;
    const daysSelect = document.getElementById('daysSelect');
    const selectedDays = Array.from(daysSelect.selectedOptions).map(opt => opt.value);
    
    let text = `${"=".repeat(60)}\n`;
    text += `${schoolName.toUpperCase()}\n`;
    text += `WEEKLY PLANNER\n`;
    text += `${"=".repeat(60)}\n\n`;
    text += `Head Teacher: ${headName}\n`;
    text += `Term: ${academicTerm}\n`;
    text += `Date: ${dateRange}\n`;
    text += `${"-".repeat(60)}\n\n`;
    
    // Header
    text += `Day\t\t`;
    for (let i = 1; i <= periodsCount; i++) {
        text += `P${i}\t`;
    }
    text += `\n${"-".repeat(60)}\n`;
    
    // Data
    for (let day of selectedDays) {
        text += `${day}\t`;
        for (let i = 1; i <= periodsCount; i++) {
            const select = document.getElementById(`${day}_P${i}`);
            const customInput = document.getElementById(`${day}_P${i}_custom`);
            let value = select ? select.value : "";
            if (value === "🎯 Custom Task" && customInput) {
                value = customInput.value || "Custom";
            }
            value = value.substring(0, 15) || "-";
            text += `${value}\t`;
        }
        text += `\n`;
    }
    
    text += `\n${"-".repeat(60)}\n`;
    text += `REMARKS:\n${remarks}\n`;
    text += `${"-".repeat(60)}\n`;
    text += `Generated: ${new Date().toLocaleString()}\n`;
    text += `Tool: Auto Head Teacher Weekly Planner\n`;
    
    return text;
}

// Get planner data as CSV
function getPlannerCSV() {
    const schoolName = document.getElementById('schoolName').value || 'Untitled School';
    const headName = document.getElementById('headName').value || 'Head Teacher';
    const dateRange = document.getElementById('dateRange').value || new Date().toLocaleDateString();
    const remarks = document.getElementById('remarks').value || 'No remarks';
    const academicTerm = document.getElementById('academicTerm').value || 'Term 1';
    
    const periodsCount = parseInt(document.getElementById('periodsCount').value) || 8;
    const daysSelect = document.getElementById('daysSelect');
    const selectedDays = Array.from(daysSelect.selectedOptions).map(opt => opt.value);
    
    let csv = [];
    
    // Header info
    csv.push(`"School Name","${schoolName.replace(/"/g, '""')}"`);
    csv.push(`"Head Teacher","${headName.replace(/"/g, '""')}"`);
    csv.push(`"Term","${academicTerm.replace(/"/g, '""')}"`);
    csv.push(`"Date Range","${dateRange.replace(/"/g, '""')}"`);
    csv.push(``);
    
    // Column headers
    let headerRow = ['Day'];
    for (let i = 1; i <= periodsCount; i++) {
        headerRow.push(`Period ${i}`);
    }
    csv.push(headerRow.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','));
    
    // Data rows
    for (let day of selectedDays) {
        let row = [day];
        for (let i = 1; i <= periodsCount; i++) {
            const select = document.getElementById(`${day}_P${i}`);
            const customInput = document.getElementById(`${day}_P${i}_custom`);
            let value = select ? select.value : "";
            if (value === "🎯 Custom Task" && customInput) {
                value = customInput.value || "Custom Task";
            }
            value = value || "-";
            row.push(`"${value.replace(/"/g, '""')}"`);
        }
        csv.push(row.join(','));
    }
    
    csv.push(``);
    csv.push(`"Remarks","${remarks.replace(/"/g, '""')}"`);
    csv.push(`"Generated Date","${new Date().toLocaleString()}"`);
    
    return csv.join('\n');
}

// Get planner data as JSON
function getPlannerJSON() {
    const schoolName = document.getElementById('schoolName').value || 'Untitled School';
    const headName = document.getElementById('headName').value || 'Head Teacher';
    const dateRange = document.getElementById('dateRange').value || new Date().toLocaleDateString();
    const remarks = document.getElementById('remarks').value || 'No remarks';
    const academicTerm = document.getElementById('academicTerm').value || 'Term 1';
    
    const periodsCount = parseInt(document.getElementById('periodsCount').value) || 8;
    const daysSelect = document.getElementById('daysSelect');
    const selectedDays = Array.from(daysSelect.selectedOptions).map(opt => opt.value);
    
    let plannerData = {};
    
    for (let day of selectedDays) {
        plannerData[day] = {};
        for (let i = 1; i <= periodsCount; i++) {
            const select = document.getElementById(`${day}_P${i}`);
            const customInput = document.getElementById(`${day}_P${i}_custom`);
            let value = select ? select.value : "";
            if (value === "🎯 Custom Task" && customInput) {
                value = customInput.value || "Custom Task";
            }
            plannerData[day][`Period_${i}`] = value || "";
        }
    }
    
    const exportData = {
        metadata: {
            tool: "Auto Head Teacher Weekly Planner",
            school_name: schoolName,
            head_teacher: headName,
            term: academicTerm,
            date_range: dateRange,
            remarks: remarks,
            generated_at: new Date().toISOString(),
            periods_per_day: periodsCount,
            days: selectedDays
        },
        planner: plannerData
    };
    
    return JSON.stringify(exportData, null, 2);
}

// Export to PDF using browser print
async function exportToPDF() {
    showLoading(true);
    try {
        const printContent = getPlannerHTML();
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Weekly Planner Export</title>
                <style>
                    @media print {
                        body { margin: 0; padding: 20px; }
                        button { display: none; }
                    }
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #333; padding: 8px; text-align: center; }
                    th { background-color: #4361ee; color: white; }
                </style>
            </head>
            <body>
                ${printContent}
                <script>
                    window.onload = () => {
                        window.print();
                        setTimeout(() => window.close(), 1000);
                    };
                <\/script>
            </body>
            </html>
        `);
        printWindow.document.close();
        showToast('PDF export initiated!', 'success');
        trackShare('pdf_export');
    } catch (error) {
        console.error('PDF export error:', error);
        showToast('Error exporting PDF', 'error');
    } finally {
        showLoading(false);
    }
}

// Export to DOC (Word)
function exportToDOC() {
    try {
        const htmlContent = getPlannerHTML();
        const blob = new Blob([`
            <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Weekly Planner</title>
                    <style>
                        body { font-family: 'Times New Roman', Arial, sans-serif; margin: 2cm; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #000; padding: 8px; text-align: center; }
                        th { background-color: #4361ee; color: white; }
                    </style>
                </head>
                <body>${htmlContent}</body>
            </html>
        `], { type: 'application/msword' });
        
        const schoolName = document.getElementById('schoolName').value || 'Weekly_Planner';
        const fileName = `${schoolName.replace(/[^a-z0-9]/gi, '_')}_Planner.doc`;
        downloadBlob(blob, fileName);
        showToast('DOC file downloaded!', 'success');
        trackShare('doc_export');
    } catch (error) {
        console.error('DOC export error:', error);
        showToast('Error exporting DOC', 'error');
    }
}

// Export to TXT
function exportToTXT() {
    try {
        const textContent = getPlannerText();
        const blob = new Blob([textContent], { type: 'text/plain' });
        const schoolName = document.getElementById('schoolName').value || 'Weekly_Planner';
        const fileName = `${schoolName.replace(/[^a-z0-9]/gi, '_')}_Planner.txt`;
        downloadBlob(blob, fileName);
        showToast('TXT file downloaded!', 'success');
        trackShare('txt_export');
    } catch (error) {
        console.error('TXT export error:', error);
        showToast('Error exporting TXT', 'error');
    }
}

// Export to CSV
function exportToCSV() {
    try {
        const csvContent = getPlannerCSV();
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const schoolName = document.getElementById('schoolName').value || 'Weekly_Planner';
        const fileName = `${schoolName.replace(/[^a-z0-9]/gi, '_')}_Planner.csv`;
        downloadBlob(blob, fileName);
        showToast('CSV file downloaded!', 'success');
        trackShare('csv_export');
    } catch (error) {
        console.error('CSV export error:', error);
        showToast('Error exporting CSV', 'error');
    }
}

// Export to JSON
function exportToJSON() {
    try {
        const jsonContent = getPlannerJSON();
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const schoolName = document.getElementById('schoolName').value || 'Weekly_Planner';
        const fileName = `${schoolName.replace(/[^a-z0-9]/gi, '_')}_Planner.json`;
        downloadBlob(blob, fileName);
        showToast('JSON file downloaded!', 'success');
        trackShare('json_export');
    } catch (error) {
        console.error('JSON export error:', error);
        showToast('Error exporting JSON', 'error');
    }
}

// Export to Excel (XLSX using CSV format with .xls extension)
function exportToExcel() {
    try {
        const csvContent = getPlannerCSV();
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'application/vnd.ms-excel' });
        const schoolName = document.getElementById('schoolName').value || 'Weekly_Planner';
        const fileName = `${schoolName.replace(/[^a-z0-9]/gi, '_')}_Planner.xls`;
        downloadBlob(blob, fileName);
        showToast('Excel file downloaded!', 'success');
        trackShare('excel_export');
    } catch (error) {
        console.error('Excel export error:', error);
        showToast('Error exporting Excel', 'error');
    }
}

// Helper function to download blob
function downloadBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Create Export Dropdown Menu
function addExportDropdown() {
    const plannerCard = document.getElementById('plannerCard');
    if (!plannerCard) return;
    
    const cardHeader = plannerCard.querySelector('.card-header');
    if (!cardHeader) return;
    
    // Check if export dropdown already exists
    if (document.getElementById('exportDropdownContainer')) return;
    
    const exportContainer = document.createElement('div');
    exportContainer.id = 'exportDropdownContainer';
    exportContainer.className = 'export-dropdown-container';
    exportContainer.style.position = 'relative';
    exportContainer.style.display = 'inline-block';
    
    exportContainer.innerHTML = `
        <button id="exportDropdownBtn" class="btn-icon" style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer;">
            <i class="fas fa-download"></i> Export
        </button>
        <div id="exportDropdownMenu" class="export-dropdown-menu" style="display: none; position: absolute; top: 100%; right: 0; background: var(--card-bg); border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); z-index: 1000; min-width: 180px; overflow: hidden;">
            <button class="export-option" data-export="pdf" style="display: block; width: 100%; padding: 10px 16px; border: none; background: transparent; cursor: pointer; text-align: left; font-size: 14px;">
                <i class="fas fa-file-pdf"></i> Export as PDF
            </button>
            <button class="export-option" data-export="doc" style="display: block; width: 100%; padding: 10px 16px; border: none; background: transparent; cursor: pointer; text-align: left; font-size: 14px;">
                <i class="fas fa-file-word"></i> Export as DOC
            </button>
            <button class="export-option" data-export="txt" style="display: block; width: 100%; padding: 10px 16px; border: none; background: transparent; cursor: pointer; text-align: left; font-size: 14px;">
                <i class="fas fa-file-alt"></i> Export as TXT
            </button>
            <button class="export-option" data-export="csv" style="display: block; width: 100%; padding: 10px 16px; border: none; background: transparent; cursor: pointer; text-align: left; font-size: 14px;">
                <i class="fas fa-file-csv"></i> Export as CSV
            </button>
            <button class="export-option" data-export="json" style="display: block; width: 100%; padding: 10px 16px; border: none; background: transparent; cursor: pointer; text-align: left; font-size: 14px;">
                <i class="fas fa-file-code"></i> Export as JSON
            </button>
            <button class="export-option" data-export="excel" style="display: block; width: 100%; padding: 10px 16px; border: none; background: transparent; cursor: pointer; text-align: left; font-size: 14px;">
                <i class="fas fa-file-excel"></i> Export as Excel
            </button>
        </div>
    `;
    
    cardHeader.appendChild(exportContainer);
    
    // Dropdown toggle
    const dropdownBtn = document.getElementById('exportDropdownBtn');
    const dropdownMenu = document.getElementById('exportDropdownMenu');
    
    dropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = dropdownMenu.style.display === 'block';
        dropdownMenu.style.display = isVisible ? 'none' : 'block';
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!exportContainer.contains(e.target)) {
            dropdownMenu.style.display = 'none';
        }
    });
    
    // Export option handlers
    document.querySelectorAll('.export-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const exportType = btn.dataset.export;
            dropdownMenu.style.display = 'none';
            
            switch(exportType) {
                case 'pdf':
                    exportToPDF();
                    break;
                case 'doc':
                    exportToDOC();
                    break;
                case 'txt':
                    exportToTXT();
                    break;
                case 'csv':
                    exportToCSV();
                    break;
                case 'json':
                    exportToJSON();
                    break;
                case 'excel':
                    exportToExcel();
                    break;
            }
        });
    });
}

// ============================================
// PLANNER GENERATION FUNCTIONS
// ============================================
function generatePlanner() {
    const periodsCount = parseInt(document.getElementById('periodsCount').value) || 8;
    const daysSelect = document.getElementById('daysSelect');
    const selectedDays = Array.from(daysSelect.selectedOptions).map(opt => opt.value);
    const colorTheme = document.getElementById('colorTheme').value;
    
    if (selectedDays.length === 0) {
        showToast('Please select at least one day', 'warning');
        return;
    }
    
    // Apply color theme
    document.body.classList.remove('theme-green', 'theme-purple', 'theme-orange', 'theme-pink');
    if (colorTheme !== 'default') {
        document.body.classList.add(`theme-${colorTheme}`);
    }
    
    let table = `<div class="planner-table-container"><table class="planner-table">`;
    table += `<thead><tr><th>Day</th>`;
    for (let i = 1; i <= periodsCount; i++) {
        table += `<th>Period ${i}<br><small>${getPeriodTime(i)}</small></th>`;
    }
    table += `</tr></thead><tbody>`;
    
    for (let day of selectedDays) {
        table += `<tr><td><strong>${day}</strong></td>`;
        for (let i = 1; i <= periodsCount; i++) {
            const savedValue = localStorage.getItem(`${TOOL_SLUG}_${day}_P${i}`) || "";
            table += `<td>${createActivityDropdown(`${day}_P${i}`, savedValue)}</td>`;
        }
        table += `</tr>`;
    }
    
    table += `</tbody></table></div>`;
    
    const plannerPreview = document.getElementById('plannerPreview');
    plannerPreview.innerHTML = table;
    document.getElementById('plannerCard').style.display = 'block';
    
    incrementUsage();
    saveToLocalStorage();
    showToast('Planner generated successfully!', 'success');
    
    // Add export dropdown after planner is generated
    setTimeout(addExportDropdown, 100);
}

function getPeriodTime(periodNum) {
    const startHour = 8 + Math.floor((periodNum - 1) / 2);
    const startMin = (periodNum - 1) % 2 === 0 ? 0 : 30;
    const endHour = startHour + (startMin === 30 ? 0 : 1);
    const endMin = startMin === 30 ? 0 : 30;
    return `${startHour}:${startMin.toString().padStart(2,'0')} - ${endHour}:${endMin.toString().padStart(2,'0')}`;
}

function createActivityDropdown(id, selectedValue) {
    let html = `<select id="${id}" class="activity-select" onchange="toggleCustom(this)">`;
    for (let act of activities) {
        const selected = selectedValue === act ? 'selected' : '';
        html += `<option value="${act}" ${selected}>${act || 'Select Activity'}</option>`;
    }
    html += `</select>`;
    html += `<input type="text" id="${id}_custom" class="custom-input" placeholder="Enter custom activity..." style="display:none; margin-top:5px;" value="${selectedValue && !activities.includes(selectedValue) ? selectedValue : ''}">`;
    return html;
}

window.toggleCustom = function(select) {
    const customInput = document.getElementById(select.id + "_custom");
    if (select.value === "🎯 Custom Task") {
        customInput.style.display = "block";
    } else {
        customInput.style.display = "none";
    }
}

function saveToLocalStorage() {
    const schoolName = document.getElementById('schoolName').value;
    const headName = document.getElementById('headName').value;
    const dateRange = document.getElementById('dateRange').value;
    const remarks = document.getElementById('remarks').value;
    const academicTerm = document.getElementById('academicTerm').value;
    const periodsCount = document.getElementById('periodsCount').value;
    
    localStorage.setItem(`${TOOL_SLUG}_schoolName`, schoolName);
    localStorage.setItem(`${TOOL_SLUG}_headName`, headName);
    localStorage.setItem(`${TOOL_SLUG}_dateRange`, dateRange);
    localStorage.setItem(`${TOOL_SLUG}_remarks`, remarks);
    localStorage.setItem(`${TOOL_SLUG}_academicTerm`, academicTerm);
    localStorage.setItem(`${TOOL_SLUG}_periodsCount`, periodsCount);
    
    // Save all activity selections
    const daysSelect = document.getElementById('daysSelect');
    const selectedDays = Array.from(daysSelect.selectedOptions).map(opt => opt.value);
    for (let day of selectedDays) {
        const periodsCountVal = parseInt(periodsCount);
        for (let i = 1; i <= periodsCountVal; i++) {
            const select = document.getElementById(`${day}_P${i}`);
            if (select) {
                localStorage.setItem(`${TOOL_SLUG}_${day}_P${i}`, select.value);
            }
        }
    }
    
    const autoSaveStatus = document.getElementById('autoSaveStatus');
    if (autoSaveStatus) {
        autoSaveStatus.innerHTML = '💾 Saved!';
        setTimeout(() => {
            autoSaveStatus.innerHTML = '💾 Auto-saving...';
        }, 2000);
    }
}

function loadFromLocalStorage() {
    const savedSchool = localStorage.getItem(`${TOOL_SLUG}_schoolName`);
    const savedHead = localStorage.getItem(`${TOOL_SLUG}_headName`);
    const savedDate = localStorage.getItem(`${TOOL_SLUG}_dateRange`);
    const savedRemarks = localStorage.getItem(`${TOOL_SLUG}_remarks`);
    const savedTerm = localStorage.getItem(`${TOOL_SLUG}_academicTerm`);
    const savedPeriods = localStorage.getItem(`${TOOL_SLUG}_periodsCount`);
    
    if (savedSchool) document.getElementById('schoolName').value = savedSchool;
    if (savedHead) document.getElementById('headName').value = savedHead;
    if (savedDate) document.getElementById('dateRange').value = savedDate;
    if (savedRemarks) document.getElementById('remarks').value = savedRemarks;
    if (savedTerm) document.getElementById('academicTerm').value = savedTerm;
    if (savedPeriods) document.getElementById('periodsCount').value = savedPeriods;
}

function clearAllPlanner() {
    if (confirm('Are you sure you want to clear all planner data?')) {
        // Clear localStorage items
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(TOOL_SLUG)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        document.getElementById('schoolName').value = '';
        document.getElementById('headName').value = '';
        document.getElementById('dateRange').value = '';
        document.getElementById('remarks').value = '';
        document.getElementById('academicTerm').value = 'Term 1';
        
        // Clear dropdown selections in planner
        const plannerPreview = document.getElementById('plannerPreview');
        if (plannerPreview) {
            const selects = plannerPreview.querySelectorAll('select');
            selects.forEach(select => {
                select.selectedIndex = 0;
            });
        }
        
        showToast('All data cleared!', 'info');
        generatePlanner(); // Refresh planner
    }
}

function resetToDefault() {
    if (confirm('Reset to default settings?')) {
        document.getElementById('periodsCount').value = '8';
        document.getElementById('colorTheme').value = 'default';
        document.body.classList.remove('theme-green', 'theme-purple', 'theme-orange', 'theme-pink');
        showToast('Reset to default settings', 'success');
        generatePlanner();
    }
}

// ============================================
// AI QUOTE GENERATION (Cloudflare API)
// ============================================
async function generateAIQuote(category = 'education') {
    const quoteText = document.getElementById('aiQuoteText');
    const quoteAuthor = document.getElementById('aiQuoteAuthor');
    
    quoteText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating quote...';
    
    try {
        const result = await apiCall('/generate-quote', 'POST', {
            prompt: category,
            topic: category,
            category: category,
            tool_slug: TOOL_SLUG
        });
        
        if (result && result.success && result.quote) {
            quoteText.innerHTML = `"${result.quote}"`;
            quoteAuthor.innerHTML = `- ${result.author || 'AI Assistant'}`;
        } else {
            throw new Error('API failed');
        }
    } catch (error) {
        // Fallback quotes
        const fallbackQuotes = {
            education: { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
            motivation: { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            wisdom: { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" },
            islamic: { text: "Indeed, Allah is with those who are patient.", author: "Quran" }
        };
        const quote = fallbackQuotes[category] || fallbackQuotes.education;
        quoteText.innerHTML = `"${quote.text}"`;
        quoteAuthor.innerHTML = `- ${quote.author}`;
    }
}

// ============================================
// UI/UX FUNCTIONS
// ============================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    toast.innerHTML = `${icons[type] || 'ℹ️'} ${message}`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showFloatingNotification(message) {
    const notification = document.getElementById('floatingNotification');
    const span = notification.querySelector('span');
    span.innerText = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = show ? 'flex' : 'none';
    }
}

function showPremiumModal() {
    const modal = document.getElementById('premiumModal');
    modal.classList.add('show');
}

function closePremiumModal() {
    const modal = document.getElementById('premiumModal');
    modal.classList.remove('show');
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    
    const moonIcon = document.querySelector('.dark-mode-toggle .fa-moon');
    const sunIcon = document.querySelector('.dark-mode-toggle .fa-sun');
    if (moonIcon && sunIcon) {
        if (isDark) {
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'inline-block';
        } else {
            moonIcon.style.display = 'inline-block';
            sunIcon.style.display = 'none';
        }
    }
    showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled', 'success');
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function scrollToPlanner() {
    document.querySelector('.controls-card').scrollIntoView({ behavior: 'smooth' });
}

function printPlanner() {
    const printContent = getPlannerHTML();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Weekly Planner Print</title>
            <style>
                @media print {
                    body { margin: 0; padding: 20px; }
                }
                body { font-family: Arial, sans-serif; padding: 20px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #333; padding: 8px; text-align: center; }
                th { background-color: #4361ee; color: white; }
            </style>
        </head>
        <body>${printContent}</body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
    showToast('Print dialog opened', 'success');
}

// ============================================
// AUTO-SAVE DRAFT
// ============================================
let autoSaveInterval;
function startAutoSave() {
    autoSaveInterval = setInterval(() => {
        saveToLocalStorage();
    }, 30000);
}

// ============================================
// EVENT LISTENERS
// ============================================
function initEventListeners() {
    document.getElementById('generatePlannerBtn').addEventListener('click', generatePlanner);
    document.getElementById('clearPlannerBtn').addEventListener('click', clearAllPlanner);
    document.getElementById('resetToDefaultBtn').addEventListener('click', resetToDefault);
    document.getElementById('printPlannerBtn').addEventListener('click', printPlanner);
    document.getElementById('refreshPlannerBtn').addEventListener('click', generatePlanner);
    document.getElementById('aiSuggestBtn').addEventListener('click', () => generateAIQuote('education'));
    document.getElementById('refreshQuoteBtn').addEventListener('click', () => generateAIQuote('education'));
    
    // Theme change
    document.getElementById('colorTheme').addEventListener('change', generatePlanner);
    document.getElementById('periodsCount').addEventListener('change', generatePlanner);
    
    // Auto-save on input
    const inputs = ['schoolName', 'headName', 'dateRange', 'remarks', 'academicTerm', 'periodsCount'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', saveToLocalStorage);
        }
    });
    
    // Reaction listeners
    document.querySelectorAll('.reaction-item').forEach(item => {
        item.addEventListener('click', () => {
            const emoji = item.dataset.emoji;
            const reaction = item.dataset.reaction;
            addReaction(emoji, reaction);
        });
    });
    
    // Share listeners
    const shareFacebook = document.querySelector('.share-btn.facebook');
    const shareTwitter = document.querySelector('.share-btn.twitter');
    const shareWhatsapp = document.querySelector('.share-btn.whatsapp');
    const shareLinkedin = document.querySelector('.share-btn.linkedin');
    const shareEmail = document.querySelector('.share-btn.email');
    const shareCopy = document.querySelector('.share-btn.copy-url');
    
    if (shareFacebook) shareFacebook.addEventListener('click', shareOnFacebook);
    if (shareTwitter) shareTwitter.addEventListener('click', shareOnTwitter);
    if (shareWhatsapp) shareWhatsapp.addEventListener('click', shareOnWhatsApp);
    if (shareLinkedin) shareLinkedin.addEventListener('click', shareOnLinkedIn);
    if (shareEmail) shareEmail.addEventListener('click', shareByEmail);
    if (shareCopy) shareCopy.addEventListener('click', copyPageUrl);
    
    // Scroll buttons
    const scrollUp = document.getElementById('scrollUpBtn');
    const scrollDown = document.getElementById('scrollDownBtn');
    if (scrollUp) scrollUp.addEventListener('click', scrollToTop);
    if (scrollDown) scrollDown.addEventListener('click', scrollToBottom);
    
    // Dark mode toggle
    const darkToggle = document.getElementById('darkModeToggle');
    if (darkToggle) darkToggle.addEventListener('click', toggleDarkMode);
    
    // Quote category buttons
    document.querySelectorAll('.quote-cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            generateAIQuote(category);
        });
    });
    
    // Modal close
    const modalClose = document.querySelector('.premium-modal-close');
    const premiumModal = document.getElementById('premiumModal');
    if (modalClose) modalClose.addEventListener('click', closePremiumModal);
    if (premiumModal) {
        premiumModal.addEventListener('click', (e) => {
            if (e.target === premiumModal) closePremiumModal();
        });
    }
}

// ============================================
// INITIALIZATION
// ============================================
async function init() {
    loadFromLocalStorage();
    generatePlanner();
    startAutoSave();
    initEventListeners();
    
    // Load data from APIs
    await Promise.all([
        getUsage(),
        loadReactions(),
        updateShareCount(),
        loadGlobalStats(),
        generateAIQuote('education')
    ]);
    
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) toggleDarkMode();
    
    showFloatingNotification('Welcome to Auto Head Teacher Planner!');
    showToast('Tool ready! Start planning your week.', 'success');
}

// Start the app
init();
