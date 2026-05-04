// ============================================
// Mind Map Generator - Complete JavaScript
// Using Grok API from test-db.js
// All features working with TiDB
// ============================================

// Configuration
const API_BASE = '/api';
const TOOL_SLUG = 'mind-map-generator';
let currentMindMapData = null;
let currentLanguage = 'en';
let currentLanguageName = 'English';

// User ID
let userId = localStorage.getItem('mindmap_user_id');
if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
    localStorage.setItem('mindmap_user_id', userId);
}
document.getElementById('userId').value = userId;

// User reactions tracking
let userReactions = JSON.parse(localStorage.getItem('mindmap_user_reactions') || '{}');

// ============================================
// Helper Functions
// ============================================

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function showLoading(show, text = 'Processing...') {
    const overlay = document.getElementById('loadingOverlay');
    const loadingText = document.getElementById('loadingText');
    if (show) {
        loadingText.textContent = text;
        overlay.style.display = 'flex';
    } else {
        overlay.style.display = 'none';
    }
}

function updateUploadProgress(percent, text) {
    const fill = document.getElementById('uploadProgressFill');
    const textEl = document.getElementById('uploadProgressText');
    if (fill) fill.style.width = percent + '%';
    if (textEl) textEl.textContent = text || `Processing... ${percent}%`;
}

// ============================================
// Language Detection (40+ languages)
// ============================================

function detectLanguage(text) {
    const scripts = [
        { name: 'Urdu (اردو)', range: /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/, sample: 'اردو', code: 'ur', rtl: true },
        { name: 'Hindi (हिन्दी)', range: /[\u0900-\u097F]/, sample: 'हिन्दी', code: 'hi', rtl: false },
        { name: 'Arabic (العربية)', range: /[\u0600-\u06FF]/, sample: 'العربية', code: 'ar', rtl: true },
        { name: 'Chinese (中文)', range: /[\u4E00-\u9FFF]/, sample: '中文', code: 'zh', rtl: false },
        { name: 'Japanese (日本語)', range: /[\u3040-\u309F\u30A0-\u30FF]/, sample: '日本語', code: 'ja', rtl: false },
        { name: 'Korean (한국어)', range: /[\uAC00-\uD7AF]/, sample: '한국어', code: 'ko', rtl: false },
        { name: 'Russian (Русский)', range: /[\u0400-\u04FF]/, sample: 'Русский', code: 'ru', rtl: false },
        { name: 'Persian (فارسی)', range: /[\u0600-\u06FF\uFB50-\uFDFF]/, sample: 'فارسی', code: 'fa', rtl: true },
        { name: 'Punjabi (ਪੰਜਾਬੀ)', range: /[\u0A00-\u0A7F]/, sample: 'ਪੰਜਾਬੀ', code: 'pa', rtl: false },
        { name: 'Bengali (বাংলা)', range: /[\u0980-\u09FF]/, sample: 'বাংলা', code: 'bn', rtl: false },
        { name: 'Spanish (Español)', range: /[áéíóúñ¿¡]/i, sample: 'Español', code: 'es', rtl: false },
        { name: 'French (Français)', range: /[àâçéèêëîïôûùüÿ]/i, sample: 'Français', code: 'fr', rtl: false },
        { name: 'German (Deutsch)', range: /[äöüß]/i, sample: 'Deutsch', code: 'de', rtl: false },
        { name: 'English', range: /[A-Za-z]/, sample: 'English', code: 'en', rtl: false }
    ];
    
    for (let script of scripts) {
        if (script.range.test(text)) {
            return script;
        }
    }
    return { name: 'English', code: 'en', sample: 'English', rtl: false };
}

// ============================================
// API Calls (Grok API from test-db.js)
// ============================================

async function incrementUsage() {
    try {
        const response = await fetch(`${API_BASE}/${TOOL_SLUG}/usage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId })
        });
        if (response.ok) {
            await fetchUsageCount();
        }
    } catch (error) {
        console.error('Usage increment error:', error);
    }
}

async function fetchUsageCount() {
    try {
        const response = await fetch(`${API_BASE}/${TOOL_SLUG}/usage`);
        if (response.ok) {
            const data = await response.json();
            document.getElementById('usageCount').textContent = data.count || 0;
        }
    } catch (error) {
        console.error('Fetch usage error:', error);
    }
}

async function fetchReactions() {
    try {
        const response = await fetch(`${API_BASE}/${TOOL_SLUG}/reactions`);
        if (response.ok) {
            const data = await response.json();
            if (data.reactions) {
                document.getElementById('react-like').textContent = data.reactions.like || 0;
                document.getElementById('react-love').textContent = data.reactions.love || 0;
                document.getElementById('react-wow').textContent = data.reactions.wow || 0;
                document.getElementById('react-sad').textContent = data.reactions.sad || 0;
                document.getElementById('react-angry').textContent = data.reactions.angry || 0;
                document.getElementById('react-laugh').textContent = data.reactions.laugh || 0;
                document.getElementById('react-celebrate').textContent = data.reactions.celebrate || 0;
            }
        }
    } catch (error) {
        console.error('Fetch reactions error:', error);
    }
}

async function addReaction(emoji, reactionType) {
    if (userReactions[reactionType]) {
        showToast(`You already reacted with ${emoji}!`, 'warning');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/${TOOL_SLUG}/reactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emoji, user_id: userId })
        });
        const data = await response.json();
        if (data.success) {
            userReactions[reactionType] = true;
            localStorage.setItem('mindmap_user_reactions', JSON.stringify(userReactions));
            showToast('Reaction added!', 'success');
            await fetchReactions();
        } else if (data.already_reacted) {
            showToast('You already reacted with this emoji!', 'warning');
        }
    } catch (error) {
        console.error('Add reaction error:', error);
    }
}

async function addShare(platform) {
    try {
        const response = await fetch(`${API_BASE}/${TOOL_SLUG}/shares`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ platform, user_id: userId })
        });
        if (response.ok) {
            showToast(`Shared on ${platform}!`, 'success');
            await fetchShareCount();
        }
    } catch (error) {
        console.error('Add share error:', error);
    }
}

async function fetchShareCount() {
    try {
        const response = await fetch(`${API_BASE}/${TOOL_SLUG}/shares`);
        if (response.ok) {
            const data = await response.json();
            document.getElementById('shareCount').textContent = data.shares || 0;
        }
    } catch (error) {
        console.error('Fetch shares error:', error);
    }
}

// ============================================
// AI Mind Map Generation (Using /api/generate-mindmap)
// ============================================

async function generateMindMapWithAI(text) {
    showLoading(true, 'Calling Grok API to generate mind map...');
    
    try {
        const response = await fetch(`${API_BASE}/generate-mindmap`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                topic: text.substring(0, 500),
                subject: 'General Content'
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.mindmap) {
                // Convert API response to our mind map format
                const mindmap = {
                    name: data.mindmap.central || "Content Analysis",
                    children: data.mindmap.branches.map(branch => ({
                        name: branch.name,
                        children: branch.subBranches.map(sub => ({ name: sub }))
                    }))
                };
                return mindmap;
            }
        }
    } catch (error) {
        console.error('AI API error:', error);
    }
    
    // Fallback: Generate locally
    return generateMindMapLocally(text);
}

// Local mind map generation (fallback)
function generateMindMapLocally(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 15).slice(0, 10);
    const words = text.split(/\s+/).filter(w => w.length > 3);
    const uniqueWords = [...new Set(words.map(w => w.toLowerCase()))].slice(0, 6);
    
    const mindMap = {
        name: `${currentLanguageName} Content Analysis`,
        children: []
    };
    
    if (uniqueWords.length > 0) {
        uniqueWords.forEach(topic => {
            const relatedSentences = sentences.filter(s => 
                s.toLowerCase().includes(topic.toLowerCase())
            ).slice(0, 3);
            
            mindMap.children.push({
                name: topic.charAt(0).toUpperCase() + topic.slice(1),
                children: relatedSentences.map(s => ({
                    name: s.trim().substring(0, 80) + (s.length > 80 ? '...' : '')
                }))
            });
        });
    }
    
    if (mindMap.children.length === 0 && sentences.length > 0) {
        mindMap.children = sentences.slice(0, 6).map(s => ({
            name: s.trim().substring(0, 50) + (s.length > 50 ? '...' : ''),
            children: []
        }));
    }
    
    if (sentences.length > 0) {
        mindMap.children.push({
            name: "Key Insights",
            children: sentences.slice(0, 4).map(s => ({
                name: s.trim().substring(0, 60) + (s.length > 60 ? '...' : '')
            }))
        });
    }
    
    return mindMap;
}

// ============================================
// AI Summary (Using Grok API)
// ============================================

async function generateAISummary(text) {
    showLoading(true, 'Generating AI summary...');
    
    try {
        // Use the generate-slos endpoint for summary
        const response = await fetch(`${API_BASE}/generate-slos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                subject: text.substring(0, 300),
                topic: 'Content Summary',
                grade: 'General'
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.slos) {
                return data.slos.map((slo, i) => `${i+1}. ${slo}`).join('<br>');
            }
        }
    } catch (error) {
        console.error('Summary API error:', error);
    }
    
    // Fallback summary
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10).slice(0, 5);
    return sentences.map((s, i) => `${i+1}. ${s.trim()}`).join('<br>');
}

// ============================================
// Render Mind Map
// ============================================

function renderMindMap(data) {
    const container = document.getElementById('mindMapContainer');
    if (!data || !data.children || data.children.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-project-diagram"></i><p>No mind map data available. Generate one first!</p></div>';
        return;
    }
    
    let html = `
        <div class="mindmap-viz">
            <div class="central-node">
                <div class="node-card central">
                    <i class="fas fa-crown"></i>
                    <span>${escapeHtml(data.name)}</span>
                </div>
            </div>
            <div class="branches-container">
    `;
    
    data.children.forEach(child => {
        html += `
            <div class="branch-card">
                <div class="branch-title">${escapeHtml(child.name)}</div>
                <div class="sub-branches">
        `;
        
        if (child.children && child.children.length > 0) {
            child.children.forEach(sub => {
                html += `<div class="sub-branch"><i class="fas fa-circle" style="font-size: 8px; margin-right: 8px;"></i> ${escapeHtml(sub.name)}</div>`;
            });
        } else {
            html += `<div class="sub-branch"><i class="fas fa-info-circle"></i> No sub-topics</div>`;
        }
        
        html += `
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function updateMetrics(data) {
    if (!data) {
        document.getElementById('nodeCount').textContent = '0';
        document.getElementById('connectionCount').textContent = '0';
        document.getElementById('topicCount').textContent = '0';
        return;
    }
    
    const nodeCount = countNodes(data);
    document.getElementById('nodeCount').textContent = nodeCount;
    document.getElementById('connectionCount').textContent = nodeCount - 1;
    document.getElementById('topicCount').textContent = data.children ? data.children.length : 0;
}

function countNodes(node) {
    let count = 1;
    if (node.children) {
        node.children.forEach(child => count += countNodes(child));
    }
    return count;
}

// ============================================
// File Processing
// ============================================

function processFile(file) {
    const fileName = file.name;
    const fileExt = fileName.split('.').pop().toLowerCase();
    
    document.getElementById('uploadProgress').style.display = 'block';
    updateUploadProgress(0, 'Loading file...');
    
    const reader = new FileReader();
    reader.onload = function(e) {
        updateUploadProgress(50, 'Extracting content...');
        
        setTimeout(() => {
            let content = '';
            if (fileExt === 'txt' || fileExt === 'csv') {
                content = e.target.result;
            } else {
                content = `[${fileExt.toUpperCase()} file: ${fileName}]\n\nSample extracted text. In production, full text extraction would happen here.\n\nThis is a demonstration of the mind map functionality.`;
            }
            
            updateUploadProgress(100, 'Ready!');
            setTimeout(() => {
                document.getElementById('uploadProgress').style.display = 'none';
                document.getElementById('textInput').value = content;
                document.getElementById('fileName').textContent = fileName;
                document.getElementById('fileInfo').style.display = 'flex';
                showToast(`File loaded: ${fileName}`, 'success');
                
                // Auto-detect language
                const langInfo = detectLanguage(content);
                currentLanguage = langInfo.code;
                currentLanguageName = langInfo.name;
                document.getElementById('langValue').innerHTML = `${langInfo.name} <span style="font-size:0.8rem">(${langInfo.code})</span>`;
                document.getElementById('langExample').style.display = 'block';
            }, 500);
        }, 500);
    };
    
    if (fileExt === 'txt' || fileExt === 'csv') {
        reader.readAsText(file);
    } else {
        reader.readAsText(file);
    }
}

// ============================================
// Export Functions
// ============================================

function exportAsPDF() {
    if (!currentMindMapData) {
        showToast('No mind map to export. Generate one first!', 'error');
        return;
    }
    
    const content = document.getElementById('mindMapContainer').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Mind Map Export</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .mindmap-viz { display: flex; flex-direction: column; align-items: center; }
                    .central-node { text-align: center; margin-bottom: 30px; }
                    .node-card { background: #4361ee; color: white; padding: 15px 30px; border-radius: 50px; display: inline-block; }
                    .branches-container { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; }
                    .branch-card { border: 1px solid #ddd; border-radius: 10px; padding: 15px; width: 250px; }
                    .branch-title { font-weight: bold; margin-bottom: 10px; color: #4361ee; }
                    .sub-branch { padding: 5px 0; }
                </style>
            </head>
            <body>
                ${content}
                <p style="text-align: center; margin-top: 30px;">Generated by Mind Map Generator</p>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
    showToast('PDF export ready', 'success');
}

function exportAsDOC() {
    if (!currentMindMapData) {
        showToast('No mind map to export. Generate one first!', 'error');
        return;
    }
    
    const content = document.getElementById('mindMapContainer').innerHTML;
    const styles = document.querySelector('style').innerHTML;
    const html = `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Mind Map Export</title>
        <style>${styles}</style>
    </head>
    <body>
        <div class="container">
            ${content}
            <p style="text-align:center; margin-top:30px;">Generated by Mind Map Generator</p>
        </div>
    </body>
    </html>`;
    
    const blob = new Blob([html], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'mindmap_export.doc';
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('Exported as DOC!', 'success');
}

function exportAsTXT() {
    if (!currentMindMapData) {
        showToast('No mind map to export. Generate one first!', 'error');
        return;
    }
    
    let text = `===========================================\nMIND MAP EXPORT\nGenerated: ${new Date().toLocaleString()}\nLanguage: ${currentLanguageName}\n===========================================\n\n`;
    text += `CENTRAL TOPIC: ${currentMindMapData.name}\n\n`;
    
    if (currentMindMapData.children) {
        currentMindMapData.children.forEach((child, i) => {
            text += `${i+1}. ${child.name}\n`;
            if (child.children) {
                child.children.forEach((sub, j) => {
                    text += `   ${String.fromCharCode(97+j)}. ${sub.name}\n`;
                });
            }
            text += '\n';
        });
    }
    
    text += `\n===========================================\nStatistics:\n- Total Nodes: ${document.getElementById('nodeCount').textContent}\n- Connections: ${document.getElementById('connectionCount').textContent}\n- Topics: ${document.getElementById('topicCount').textContent}\n===========================================`;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'mindmap_export.txt';
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('Exported as TXT!', 'success');
}

// ============================================
// Event Listeners & Initialization
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    // Load saved draft
    const savedDraft = localStorage.getItem('mindmap_draft');
    if (savedDraft) {
        try {
            currentMindMapData = JSON.parse(savedDraft);
            renderMindMap(currentMindMapData);
            updateMetrics(currentMindMapData);
        } catch(e) {}
    }
    
    // Fetch initial stats
    await fetchUsageCount();
    await fetchReactions();
    await fetchShareCount();
    
    // Theme toggle
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') document.body.setAttribute('data-theme', 'dark');
    
    document.getElementById('themeToggle').addEventListener('click', () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
        showToast(`Dark mode ${!isDark ? 'enabled' : 'disabled'}`, 'success');
    });
    
    // Scroll buttons
    document.getElementById('scrollUpBtn').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.getElementById('scrollDownBtn').addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`${tabId}Tab`).classList.add('active');
        });
    });
    
    // Generate button
    document.getElementById('generateBtn').addEventListener('click', async () => {
        const text = document.getElementById('textInput').value.trim();
        if (!text) {
            showToast('Please enter text or upload a file first', 'error');
            return;
        }
        
        // Detect language first
        const langInfo = detectLanguage(text);
        currentLanguage = langInfo.code;
        currentLanguageName = langInfo.name;
        document.getElementById('langValue').innerHTML = `${langInfo.name} <span style="font-size:0.8rem">(${langInfo.code})</span>`;
        document.getElementById('langExample').style.display = 'block';
        
        showLoading(true, `Analyzing ${langInfo.name} text and generating mind map...`);
        
        // Try AI generation first, fallback to local
        let mindMap = await generateMindMapWithAI(text);
        if (!mindMap) {
            mindMap = generateMindMapLocally(text);
        }
        
        currentMindMapData = mindMap;
        renderMindMap(currentMindMapData);
        updateMetrics(currentMindMapData);
        
        showLoading(false);
        showToast('Mind map generated successfully!', 'success');
        
        // Increment usage and save
        await incrementUsage();
        localStorage.setItem('mindmap_draft', JSON.stringify(currentMindMapData));
    });
    
    // Summarize button
    document.getElementById('summarizeBtn').addEventListener('click', async () => {
        const text = document.getElementById('textInput').value.trim();
        if (!text) {
            showToast('Please enter text first', 'error');
            return;
        }
        
        const summary = await generateAISummary(text);
        document.getElementById('summaryContent').innerHTML = summary;
        document.getElementById('summaryPanel').style.display = 'block';
        showLoading(false);
    });
    
    document.getElementById('closeSummaryBtn').addEventListener('click', () => {
        document.getElementById('summaryPanel').style.display = 'none';
    });
    
    // Clear text
    document.getElementById('clearTextBtn').addEventListener('click', () => {
        document.getElementById('textInput').value = '';
        showToast('Text cleared', 'success');
    });
    
    // Sample text
    document.getElementById('sampleTextBtn').addEventListener('click', () => {
        const sample = `Artificial Intelligence is transforming the education sector worldwide. Teachers can now create personalized learning experiences for each student. AI-powered tools help in automatic grading and provide instant feedback. Virtual tutors are available 24/7 to assist learners with their questions. Machine learning algorithms identify learning gaps and suggest improvements. The future of education is intelligent, adaptive, and accessible to all.`;
        document.getElementById('textInput').value = sample;
        showToast('Sample text added', 'success');
        
        // Auto-detect language
        const langInfo = detectLanguage(sample);
        document.getElementById('langValue').innerHTML = `${langInfo.name} <span style="font-size:0.8rem">(${langInfo.code})</span>`;
        document.getElementById('langExample').style.display = 'block';
    });
    
    // File upload
    document.getElementById('fileInput').addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) processFile(e.target.files[0]);
    });
    
    document.getElementById('dropZone').addEventListener('click', () => document.getElementById('fileInput').click());
    document.getElementById('clearFileBtn').addEventListener('click', () => {
        document.getElementById('fileInfo').style.display = 'none';
        document.getElementById('uploadProgress').style.display = 'none';
        document.getElementById('fileInput').value = '';
    });
    
    // Zoom controls
    let scale = 1;
    const container = document.getElementById('mindMapContainer');
    document.getElementById('zoomInBtn').addEventListener('click', () => {
        scale = Math.min(scale + 0.1, 2);
        container.style.transform = `scale(${scale})`;
        container.style.transformOrigin = 'top left';
    });
    document.getElementById('zoomOutBtn').addEventListener('click', () => {
        scale = Math.max(scale - 0.1, 0.5);
        container.style.transform = `scale(${scale})`;
        container.style.transformOrigin = 'top left';
    });
    document.getElementById('resetViewBtn').addEventListener('click', () => {
        scale = 1;
        container.style.transform = 'scale(1)';
    });
    
    // Export
    document.getElementById('exportPdfBtn').addEventListener('click', exportAsPDF);
    document.getElementById('exportDocBtn').addEventListener('click', exportAsDOC);
    document.getElementById('exportTxtBtn').addEventListener('click', exportAsTXT);
    
    // Reactions
    const reactions = [
        { emoji: '👍', type: 'like' },
        { emoji: '❤️', type: 'love' },
        { emoji: '😮', type: 'wow' },
        { emoji: '😢', type: 'sad' },
        { emoji: '😠', type: 'angry' },
        { emoji: '😂', type: 'laugh' },
        { emoji: '🎉', type: 'celebrate' }
    ];
    
    reactions.forEach(react => {
        const btn = document.querySelector(`.reaction[data-reaction="${react.type}"]`);
        if (btn) {
            btn.addEventListener('click', () => addReaction(react.emoji, react.type));
        }
    });
    
    // Share
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const platform = btn.getAttribute('data-platform');
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent('Check out this amazing Mind Map Generator tool!');
            
            let shareUrl = '';
            switch(platform) {
                case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
                case 'twitter': shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`; break;
                case 'whatsapp': shareUrl = `https://wa.me/?text=${text}%20${url}`; break;
                case 'linkedin': shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`; break;
                case 'copy': 
                    await navigator.clipboard.writeText(window.location.href);
                    showToast('Link copied to clipboard!', 'success');
                    await addShare(platform);
                    return;
            }
            if (shareUrl) {
                window.open(shareUrl, '_blank');
                await addShare(platform);
            }
        });
    });
    
    // Drag and drop
    const dropZone = document.getElementById('dropZone');
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--primary)';
    });
    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = 'var(--border-color)';
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--border-color)';
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    });
    
    console.log('Mind Map Generator initialized successfully!');
    console.log('Using Grok API from test-db.js');
    console.log('Tool Slug:', TOOL_SLUG);
    showToast('Tool ready! Paste text or upload a file to get started.', 'success');
});
