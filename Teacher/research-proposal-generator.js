// research-proposal-generator.js
let stats = { proposals: 0, time: 0, exports: 0, ai: 0 };
const elements = {};
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY'; // Replace with your key

document.addEventListener('DOMContentLoaded', () => {
  cacheElements(); 
  loadSettings(); 
  setupEvents(); 
  updateStats(); 
  setupDraggablePanel(); 
  loadAIPanelPosition(); 
  showWelcomeMessage();
});

function cacheElements() {
  elements.topic = document.getElementById('researchTopic');
  elements.area = document.getElementById('researchArea');
  elements.industry = document.getElementById('industry');
  elements.terms = document.getElementById('keyTerms');
  elements.method = document.getElementById('methodology');
  elements.output = document.getElementById('proposalOutput');
  elements.exportOptions = document.getElementById('exportOptions');
  elements.aiPanel = document.getElementById('aiAssistantPanel');
  elements.aiHeader = elements.aiPanel.querySelector('.ai-panel-header');
  elements.aiContent = document.getElementById('aiSuggestionsContent');
  elements.aiToggle = document.getElementById('aiAssistToggle');
  elements.closeBtn = document.getElementById('closeAiPanel');
  elements.progressBar = document.getElementById('progressBar');
  elements.progressFill = document.getElementById('progressFill');
  elements.progressText = document.getElementById('progressText');
}

function loadSettings() {
  const saved = localStorage.getItem('rpStats');
  if (saved) stats = JSON.parse(saved);
  const theme = localStorage.getItem('rpTheme');
  if (theme === 'dark') toggleTheme(true);
  const ai = localStorage.getItem('rpAI');
  if (ai !== null) elements.aiToggle.checked = ai === 'true';
}

function setupEvents() {
  document.getElementById('generateProposalBtn').onclick = generateWithAI;
  document.getElementById('exportPdfBtn').onclick = () => window.exportToPDF();
  document.getElementById('exportWordBtn').onclick = () => window.exportToWord();
  document.getElementById('copyBtn').onclick = copyToClipboard;
  document.getElementById('saveBtn').onclick = saveHTML;
  document.getElementById('exportMdBtn').onclick = exportMarkdown;
  document.getElementById('exportStatsBtn').onclick = exportStatsCSV;
  document.getElementById('themeToggle').onclick = () => toggleTheme();
  document.getElementById('generateTermsBtn').onclick = generateTermsWithAI;
  document.getElementById('saveTemplateBtn').onclick = saveTemplate;
  document.getElementById('loadTemplateBtn').onclick = loadTemplate;
  document.getElementById('printPreviewBtn').onclick = () => window.print();
  elements.closeBtn.onclick = () => elements.aiPanel.style.display = 'none';
  document.getElementById('helpBtn').onclick = showHelp;
  document.getElementById('addLiteratureBtn').onclick = addLiterature;

  document.querySelectorAll('.platform-btn').forEach(btn => {
    btn.onclick = () => openPlatform(btn.dataset.platform);
  });

  elements.topic.oninput = elements.area.oninput = debounce(suggestWithAI, 800);
  elements.aiToggle.onchange = () => localStorage.setItem('rpAI', elements.aiToggle.checked);
}

function generateWithAI() {
  const topic = elements.topic.value.trim();
  const area = elements.area.value.trim();
  if (!topic || !area) return notify('Fill Topic & Field', 'error');

  showLoading(true); 
  elements.progressBar.classList.remove('hidden');
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    elements.progressFill.style.width = progress + '%';
    elements.progressText.textContent = progress + '%';
    if (progress >= 100) clearInterval(interval);
  }, 300);

  setTimeout(async () => {
    try {
      const prompt = `Write a professional research proposal on "${topic}" in the field of "${area}". Include abstract, background, problem statement, objectives, methodology, and key terms. Use formal academic tone.`;
      const aiResponse = await fetchAIResponse(prompt);
      elements.output.innerHTML = formatProposal(aiResponse, topic, area);
      elements.exportOptions.classList.remove('hidden');
      stats.proposals++; 
      stats.time += 3; 
      updateStats(); 
      saveStats();
      notify('AI Proposal Generated!');
    } catch (e) {
      elements.output.innerHTML = renderProposal(topic, area);
      notify('AI failed, using template', 'error');
    } finally {
      showLoading(false); 
      elements.progressBar.classList.add('hidden');
      elements.progressFill.style.width = '0%'; 
      elements.progressText.textContent = '0%';
    }
  }, 3000);
}

async function fetchAIResponse(prompt) {
  if (!OPENAI_API_KEY.includes('sk-')) throw new Error('No API key');
  
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${OPENAI_API_KEY}` 
    },
    body: JSON.stringify({ 
      model: 'gpt-3.5-turbo', 
      messages: [{ role: 'user', content: prompt }], 
      max_tokens: 1000 
    })
  });
  
  const data = await res.json();
  return data.choices[0].message.content;
}

function formatProposal(aiResponse, topic, area) {
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  return `
    <div class="proposal-modern">
      <h1 class="proposal-main-title">RESEARCH PROPOSAL</h1>
      <h2 class="proposal-subtitle">${topic}</h2>
      <p class="proposal-date">Generated: ${date}</p>
      <div class="proposal-content">
        ${aiResponse.replace(/\n/g, '</p><p>').replace(/<p><\/p>/g, '')}
      </div>
    </div>`;
}

function renderProposal(topic, area) {
  const industry = elements.industry.value.trim() || 'stakeholders';
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const terms = elements.terms.value.split('\n').filter(t => t.trim());
  const method = getMethodText(elements.method.value);

  return `
    <div class="proposal-modern">
      <h1 class="proposal-main-title">RESEARCH PROPOSAL</h1>
      <h2 class="proposal-subtitle">${topic}</h2>
      <p class="proposal-date">Generated: ${date}</p>
      
      <h3 class="proposal-title">ABSTRACT</h3>
      <p>This study investigates <strong>${topic.toLowerCase()}</strong> in <strong>${area}</strong> to address current gaps and provide insights for the <strong>${industry}</strong> sector.</p>
      
      <h3 class="proposal-title">BACKGROUND</h3>
      <p>The field of ${area} has seen significant developments in recent years, yet there remains a need for comprehensive research on ${topic}.</p>
      
      <h3 class="proposal-title">METHODOLOGY</h3>
      <p>This study uses a <strong>${method.txt}</strong> approach with data collected via <strong>${method.collect}</strong>.</p>
      
      ${terms.length ? `<h3 class="proposal-title">KEY TERMS</h3><ul>${terms.map(t => `<li>${t}</li>`).join('')}</ul>` : ''}
      
      <h3 class="proposal-title">EXPECTED OUTCOMES</h3>
      <p>The research aims to provide valuable insights and practical recommendations for professionals in ${area}.</p>
    </div>`;
}

function getMethodText(m) {
  const map = { 
    quantitative: { txt: 'quantitative', collect: 'surveys' }, 
    qualitative: { txt: 'qualitative', collect: 'interviews' }, 
    mixed: { txt: 'mixed-methods', collect: 'surveys & interviews' }, 
    experimental: { txt: 'experimental', collect: 'trials' }, 
    'case-study': { txt: 'case study', collect: 'documents' } 
  };
  return map[m] || map.mixed;
}

function notify(msg, type = 'success') {
  const n = document.getElementById('notification');
  n.textContent = msg; 
  n.className = `notification ${type} show`;
  setTimeout(() => n.className = 'notification', 3000);
}

function showLoading(show) {
  document.getElementById('loadingOverlay').classList.toggle('show', show);
}

function updateStats() {
  document.getElementById('proposalsCount').textContent = stats.proposals;
  document.getElementById('timeSaved').textContent = stats.time;
  document.getElementById('exportsCount').textContent = stats.exports;
  document.getElementById('aiSuggestions').textContent = stats.ai;
}

function saveStats() { 
  localStorage.setItem('rpStats', JSON.stringify(stats)); 
}

function toggleTheme(forceDark = false) {
  const body = document.body;
  const isDark = forceDark || body.classList.contains('light-theme');
  
  if (isDark) {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
    localStorage.setItem('rpTheme', 'dark');
    document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
    localStorage.setItem('rpTheme', 'light');
    document.getElementById('themeToggle').innerHTML = '<i class="fas fa-moon"></i>';
  }
}

function copyToClipboard() {
  const output = elements.output;
  if (output.querySelector('.placeholder-content')) {
    notify('Generate proposal first', 'error');
    return;
  }

  const text = output.innerText || output.textContent;
  navigator.clipboard.writeText(text).then(() => {
    notify('Copied to clipboard!');
  }).catch(() => {
    notify('Copy failed', 'error');
  });
}

function saveHTML() {
  const output = elements.output;
  if (output.querySelector('.placeholder-content')) {
    notify('Generate proposal first', 'error');
    return;
  }

  const content = output.innerHTML;
  const blob = new Blob([content], { type: 'text/html' });
  saveAs(blob, `research_proposal_${Date.now()}.html`);
  notify('HTML saved!');
}

function exportMarkdown() {
  const output = elements.output;
  if (output.querySelector('.placeholder-content')) {
    notify('Generate proposal first', 'error');
    return;
  }

  let markdown = `# Research Proposal\n\n`;
  markdown += `## ${document.getElementById('researchTopic').value}\n\n`;
  
  const elementsToConvert = output.querySelectorAll('h1, h2, h3, p, li, strong');
  elementsToConvert.forEach(el => {
    if (el.tagName === 'H1') markdown += `# ${el.textContent}\n\n`;
    else if (el.tagName === 'H2') markdown += `## ${el.textContent}\n\n`;
    else if (el.tagName === 'H3') markdown += `### ${el.textContent}\n\n`;
    else if (el.tagName === 'P') markdown += `${el.textContent}\n\n`;
    else if (el.tagName === 'LI') markdown += `- ${el.textContent}\n`;
    else if (el.tagName === 'STRONG') markdown += `**${el.textContent}**`;
  });

  const blob = new Blob([markdown], { type: 'text/markdown' });
  saveAs(blob, `research_proposal_${Date.now()}.md`);
  notify('Markdown exported!');
}

function exportStatsCSV() {
  const csv = `Statistic,Value\nProposals Generated,${stats.proposals}\nHours Saved,${stats.time}\nExports,${stats.exports}\nAI Suggestions,${stats.ai}`;
  const blob = new Blob([csv], { type: 'text/csv' });
  saveAs(blob, 'research_proposal_stats.csv');
  notify('Stats exported!');
}

function generateTermsWithAI() {
  const topic = elements.topic.value.trim();
  const area = elements.area.value.trim();
  
  if (!topic || !area) {
    notify('Enter topic and field first', 'error');
    return;
  }

  showLoading(true);
  
  setTimeout(() => {
    const sampleTerms = [
      `${topic} - Main research subject`,
      `${area} - Primary field`,
      'Methodology - Research approach',
      'Data Analysis - Examination of collected data',
      'Literature Review - Previous research analysis'
    ];
    
    elements.terms.value = sampleTerms.join('\n');
    showLoading(false);
    notify('AI terms generated!');
    stats.ai++;
    updateStats();
    saveStats();
  }, 1500);
}

function suggestWithAI() {
  if (!elements.aiToggle.checked) return;

  const topic = elements.topic.value.trim();
  const area = elements.area.value.trim();
  
  if (!topic && !area) {
    elements.aiContent.innerHTML = `<div class="welcome-message"><i class="fas fa-robot"></i><p>Start typing for AI suggestions!</p></div>`;
    return;
  }

  elements.aiPanel.style.display = 'block';
  
  const suggestions = [];
  if (topic) suggestions.push(`Consider focusing on specific aspects of "${topic}"`);
  if (area) suggestions.push(`Look into recent developments in ${area}`);
  if (topic && area) suggestions.push(`Combine ${topic} with emerging trends in ${area}`);
  
  elements.aiContent.innerHTML = suggestions.map(s => 
    `<div class="suggestion-item">${s}</div>`
  ).join('');
  
  stats.ai += suggestions.length;
  updateStats();
  saveStats();
}

function saveTemplate() {
  const template = {
    topic: elements.topic.value,
    area: elements.area.value,
    industry: elements.industry.value,
    terms: elements.terms.value,
    method: elements.method.value,
    style: document.getElementById('templateSelect').value
  };
  
  localStorage.setItem('rpTemplate', JSON.stringify(template));
  notify('Template saved!');
}

function loadTemplate() {
  const saved = localStorage.getItem('rpTemplate');
  if (!saved) return notify('No saved template', 'error');
  
  const template = JSON.parse(saved);
  elements.topic.value = template.topic || '';
  elements.area.value = template.area || '';
  elements.industry.value = template.industry || '';
  elements.terms.value = template.terms || '';
  elements.method.value = template.method || '';
  document.getElementById('templateSelect').value = template.style || 'modern';
  
  notify('Template loaded!');
}

function openPlatform(platform) {
  const topic = elements.topic.value.trim();
  const area = elements.area.value.trim();
  const query = encodeURIComponent(`${topic} ${area}`);
  
  const urls = {
    scholar: `https://scholar.google.com/scholar?q=${query}`,
    arxiv: `https://arxiv.org/search/?query=${query}&searchtype=all&source=header`,
    pubmed: `https://pubmed.ncbi.nlm.nih.gov/?term=${query}`
  };
  
  window.open(urls[platform], '_blank');
  notify(`Opening ${platform}...`);
}

function addLiterature() {
  const output = elements.output;
  if (output.querySelector('.placeholder-content')) {
    notify('Generate proposal first', 'error');
    return;
  }
  
  const litSection = document.createElement('div');
  litSection.innerHTML = `
    <h3 class="proposal-title">LITERATURE REVIEW</h3>
    <p>Key references from online databases will be integrated here based on your search terms.</p>
    <ul>
      <li>Sample reference from Google Scholar</li>
      <li>Recent paper from arXiv</li>
      <li>PubMed article related to your topic</li>
    </ul>
  `;
  
  output.appendChild(litSection);
  notify('Literature section added!');
}

function showHelp() {
  alert(`Research Proposal Generator Help:

1. Fill in Topic and Field (required)
2. Add optional details like sector, key terms
3. Click "Generate with AI" for AI-powered proposal
4. Use AI Assistant for real-time suggestions
5. Export as PDF, Word, or other formats
6. Save templates for future use

All data is stored locally in your browser.`);
}

function showWelcomeMessage() {
  setTimeout(() => {
    notify('Welcome! Fill in details to generate your research proposal.');
  }, 1000);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => { clearTimeout(timeout); func(...args); };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function setupDraggablePanel() {
  let isDragging = false;
  let currentX; let currentY; let initialX; let initialY; let xOffset = 0; let yOffset = 0;

  elements.aiHeader.addEventListener('mousedown', dragStart);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', dragEnd);

  function dragStart(e) {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
    
    if (e.target === elements.aiHeader || e.target.closest('.ai-panel-header')) {
      isDragging = true;
      elements.aiPanel.classList.add('dragging');
    }
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      xOffset = currentX;
      yOffset = currentY;
      setTranslate(currentX, currentY, elements.aiPanel);
    }
  }

  function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
    elements.aiPanel.classList.remove('dragging');
    saveAIPanelPosition();
  }

  function setTranslate(xPos, yPos, el) {
    el.style.left = xPos + 'px';
    el.style.top = yPos + 'px';
  }
}

function saveAIPanelPosition() {
  const pos = { left: elements.aiPanel.style.left, top: elements.aiPanel.style.top };
  localStorage.setItem('aiPanelPos', JSON.stringify(pos));
}

function loadAIPanelPosition() {
  const saved = localStorage.getItem('aiPanelPos');
  if (saved) {
    const pos = JSON.parse(saved);
    elements.aiPanel.style.left = pos.left || 'auto';
    elements.aiPanel.style.top = pos.top || 'auto';
  }
}