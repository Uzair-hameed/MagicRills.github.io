// ============================================
// SCHOOL EVENT REPORT GENERATOR - PROCESSOR ENGINE
// PRODUCTION RUNTIME: YEAR 2026 ACTIVE SPECIFICATION
// ============================================

const API_BASE = "https://magicrills-api.uzairhameed01.workers.dev";
const API_KEY = "magicrills-grok-api.uzairhameed01.workers.dev";
const TOOL_SLUG = "school-event-report-generator";

// GLOBAL RUNTIME DATA STREAMS
let pages = [];
let stats = { usage: 0, views: 0, shares: 0, followers: 380 };
let reactions = { like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0 };

let currentCropper = null;
let currentImageCallback = null;

// ---------- SMART HERO SECTION TEXT TYPEWRITER ANIMATION ----------
const phrases = [
  "Draft Premium PDF Logs for Event Records.",
  "Tailored for Professional Teacher Educators.",
  "Integrate Draggable Logos & Moveable Image Frames.",
  "Instant High-Resolution A4 Layout Compilations."
];
let phraseIdx = 0;
let charIdx = 0;
let isDeleting = false;
let delay = 120;

function typeWriter() {
  const target = document.getElementById("typewriter");
  if (!target) return;
  
  let currentPhrase = phrases[phraseIdx];
  if (isDeleting) {
    target.textContent = currentPhrase.substring(0, charIdx - 1);
    charIdx--;
    delay = 50;
  } else {
    target.textContent = currentPhrase.substring(0, charIdx + 1);
    charIdx++;
    delay = 100;
  }

  if (!isDeleting && charIdx === currentPhrase.length) {
    delay = 2200;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    delay = 400;
  }

  setTimeout(typeWriter, delay);
}

// ---------- REALTIME DETAILED CLOCK SUBSYSTEM ----------
function startLiveClock() {
  const container = document.getElementById("liveClock");
  if (!container) return;
  
  const updateClock = () => {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    seconds = seconds < 10 ? '0'+seconds : seconds;
    
    container.innerHTML = `<i class="far fa-calendar-check"></i> June 22, 2026 | <i class="far fa-clock"></i> ${hours}:${minutes}:${seconds} ${ampm}`;
  };
  
  updateClock();
  setInterval(updateClock, 1000);
}

function showToast(message) {
  let toast = document.getElementById('toastMsg');
  if (!toast) return;
  toast.innerText = message;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 2600);
}

// ---------- CLOUDFLARE SECURE METRICS CONNECTION ----------
async function loadToolStats() {
  try {
    const response = await fetch(`${API_BASE}/api/stats?tool_slug=${TOOL_SLUG}`, {
      method: 'GET',
      headers: { 'x-api-key': API_KEY }
    });
    if (response.ok) {
      const data = await response.json();
      if (data) {
        stats.usage = data.usage || 0;
        stats.views = data.views || 0;
        stats.shares = data.shares || 0;
        if (data.reactions) reactions = { ...reactions, ...data.reactions };
        updateDashboardUI();
        updateReactionsUI();
        return;
      }
    }
  } catch (e) {
    console.warn("Using localized engineering fallback parameters.");
  }
  loadLocalFallback();
}

async function incrementUsage() {
  try {
    const response = await fetch(`${API_BASE}/api/usage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
      body: JSON.stringify({ tool_slug: TOOL_SLUG })
    });
    if (response.ok) {
      const data = await response.json();
      stats.usage = data.usage || (stats.usage + 1);
      updateDashboardUI();
    }
  } catch (e) {
    stats.usage++;
    localStorage.setItem('sch_ev_premium_usage', stats.usage);
    updateDashboardUI();
  }
}

async function recordReaction(type) {
  if (reactions[type] === undefined) return;
  reactions[type]++;
  updateReactionsUI();
  try {
    await fetch(`${API_BASE}/api/reactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
      body: JSON.stringify({ tool_slug: TOOL_SLUG, reaction_type: type })
    });
  } catch (e) {
    localStorage.setItem('sch_ev_premium_reacts', JSON.stringify(reactions));
  }
}

async function recordShare(platform) {
  stats.shares++;
  updateDashboardUI();
  try {
    await fetch(`${API_BASE}/api/shares`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
      body: JSON.stringify({ tool_slug: TOOL_SLUG, platform: platform })
    });
  } catch (e) {
    localStorage.setItem('sch_ev_premium_shares', stats.shares);
  }
  showToast(`Ecosystem data stream synced via ${platform}`);
}

function updateDashboardUI() {
  if (document.getElementById('stat-usage')) document.getElementById('stat-usage').innerText = stats.usage;
  if (document.getElementById('stat-views')) document.getElementById('stat-views').innerText = stats.views || (stats.usage * 4 + 19);
  if (document.getElementById('stat-shares')) document.getElementById('stat-shares').innerText = stats.shares;
  if (document.getElementById('stat-followers')) document.getElementById('stat-followers').innerText = stats.followers;
}

function updateReactionsUI() {
  const emoticons = { like: '👍', love: '❤️', wow: '😮', sad: '😢', angry: '😠', laugh: '😂', celebrate: '🎉' };
  Object.keys(emoticons).forEach(type => {
    const btn = document.querySelector(`[data-react="${type}"]`);
    if (btn) btn.innerHTML = `${emoticons[type]} ${reactions[type] || 0}`;
  });
}

function loadLocalFallback() {
  stats.usage = parseInt(localStorage.getItem('sch_ev_premium_usage') || '184');
  stats.shares = parseInt(localStorage.getItem('sch_ev_premium_shares') || '34');
  let saved = localStorage.getItem('sch_ev_premium_reacts');
  if (saved) { try { reactions = JSON.parse(saved); } catch(e){} }
  updateDashboardUI();
  updateReactionsUI();
}

// ---------- INDUSTRIAL BASE ASSET INITIALIZATION ----------
function initPages() {
  pages = [
    {
      id: 'page_base_1',
      title: 'Annual Professional Event Logs 2026',
      subtitle: 'Official Workshop & Seminar Log Dossier',
      content: '<h3>1. Event Background Context</h3><p>Use this editable field container to formulate complex event summaries. Click the dynamic top bar to insert absolute Move-able Image Frames securely over this canvas layout.</p>',
      bannerImg: null,
      logoImg: null,
      frames: [], // Holds dynamic custom moveable frames data array
      footerLeft: 'Sargodhians Institute',
      footerCenter: 'Administrative Records 2026',
      footerRight: 'Page 1'
    }
  ];
}

// ---------- COMPREHENSIVE CANVAS RENDERING SUBSYSTEM ----------
function renderAllPages() {
  let container = document.getElementById('pagesContainer');
  if (!container) return;
  container.innerHTML = '';
  
  const chosenFont = document.getElementById('fontSelect')?.value || 'Inter';
  const chosenSize = document.getElementById('fontSizeSelect')?.value || '16px';
  const chosenColor = document.getElementById('canvasBgColor')?.value || '#ffffff';
  
  pages.forEach((page) => {
    let pageDiv = document.createElement('div');
    pageDiv.className = 'report-page';
    pageDiv.setAttribute('data-page-id', page.id);
    pageDiv.style.fontFamily = chosenFont;
    pageDiv.style.backgroundColor = chosenColor;
    
    let bannerHtml = `
      <div class="page-banner-wrapper">
        <div class="institute-logo-container" onclick="window.processLogoUpload('${page.id}')" title="Upload School/Institute Logo">
          ${page.logoImg ? `<img src="${page.logoImg}">` : '<div class="logo-placeholder"><i class="fas fa-building-columns"></i><br>Add Logo</div>'}
        </div>
        ${page.bannerImg ? `<img src="${page.bannerImg}" class="page-banner">` : '<div style="display:flex;align-items:center;justify-content:center;height:100%;background:#e2e8f0;color:#475569;font-weight:500;font-size:0.9rem;"><i class="fas fa-images" style="margin-right:7px;"></i> Assign custom page header banner overlay</div>'}
        <div style="position:absolute; bottom:10px; right:15px; z-index:5;">
          <button class="btn btn-primary" onclick="event.stopPropagation(); window.processBannerUpload('${page.id}')" style="padding:5px 12px; font-size:0.75rem; border-radius:12px;"><i class="fas fa-camera"></i> Assign Banner</button>
        </div>
      </div>
    `;

    let contentHtml = `
      <div class="section-header">
        <h1 contenteditable="true" data-field="title" data-id="${page.id}" class="editable-field section-title">${page.title}</h1>
        <div contenteditable="true" data-field="subtitle" data-id="${page.id}" class="editable-field" style="color: #4facfe; font-weight:600; outline:none; margin-top:5px;">${page.subtitle}</div>
        <button class="delete-sheet-btn" onclick="window.removeSectionSheet('${page.id}')" title="Delete This Entire Sheet Section"><i class="fas fa-trash-can"></i></button>
      </div>
      
      <div class="section-content">
        <div contenteditable="true" data-field="content" data-id="${page.id}" class="report-text editable-field" style="font-size: ${chosenSize};">${page.content}</div>
        
        ${(page.frames || []).map(frame => `
          <div class="draggable-img-frame" data-frame-id="${frame.id}" data-page-id="${page.id}" style="left: ${frame.left}px; top: ${frame.top}px;">
            <button class="remove-frame-btn" onclick="window.deleteImageFrame('${page.id}', '${frame.id}')"><i class="fas fa-times"></i></button>
            <div style="width:100%; height:100%;" onclick="window.uploadFrameImageAsset('${page.id}', '${frame.id}')">
              ${frame.img ? `<img src="${frame.img}">` : `
                <div class="draggable-placeholder">
                  <i class="fas fa-image-portrait" style="font-size:1.4rem; color:#ff007f;"></i>
                  <span>Click to Import Photo<br><small style="color:#94a3b8; font-size:10px;">Drag frame anywhere</small></span>
                </div>
              `}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    let footerHtml = `
      <div class="page-footer">
        <span contenteditable="true" data-field="footerLeft" data-id="${page.id}" class="editable-field">${page.footerLeft}</span>
        <span contenteditable="true" data-field="footerCenter" data-id="${page.id}" class="editable-field">${page.footerCenter}</span>
        <span contenteditable="true" data-field="footerRight" data-id="${page.id}" class="editable-field">${page.footerRight}</span>
      </div>
    `;

    pageDiv.innerHTML = bannerHtml + contentHtml + footerHtml;
    container.appendChild(pageDiv);
  });
  
  attachEditableListeners();
  initDragAndDropEngine();
}

function attachEditableListeners() {
  document.querySelectorAll('.editable-field').forEach(elem => {
    elem.addEventListener('blur', (e) => {
      let id = e.target.dataset.id;
      let field = e.target.dataset.field;
      let val = e.target.innerHTML;
      let page = pages.find(p => p.id === id);
      if (page) {
        page[field] = val;
        localStorage.setItem('sch_ev_premium_pages_data', JSON.stringify(pages));
      }
    });
  });
}

// ---------- INTERACTIVE MULTI-AXIS DRAG & DROP ENGINE ----------
function initDragAndDropEngine() {
  let activeFrame = null;
  let offsetX = 0, offsetY = 0;

  document.querySelectorAll('.draggable-img-frame').forEach(frame => {
    frame.addEventListener('mousedown', (e) => {
      if (e.target.closest('.remove-frame-btn')) return;
      activeFrame = frame;
      let rect = frame.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      e.preventDefault();
    });
  });

  document.addEventListener('mousemove', (e) => {
    if (!activeFrame) return;
    let pageId = activeFrame.dataset.pageId;
    let frameId = activeFrame.dataset.frameId;
    let parentContent = activeFrame.closest('.section-content');
    let parentRect = parentContent.getBoundingClientRect();

    let newLeft = e.clientX - parentRect.left - offsetX;
    let newTop = e.clientY - parentRect.top - offsetY;

    // Boundaries containment logic inside the report page space
    if (newLeft < 10) newLeft = 10;
    if (newTop < 10) newTop = 10;
    if (newLeft > parentRect.width - activeFrame.offsetWidth - 10) newLeft = parentRect.width - activeFrame.offsetWidth - 10;
    if (newTop > parentRect.height - activeFrame.offsetHeight - 10) newTop = parentRect.height - activeFrame.offsetHeight - 10;

    activeFrame.style.left = `${newLeft}px`;
    activeFrame.style.top = `${newTop}px`;

    // Sync variables coordinates data
    let page = pages.find(p => p.id === pageId);
    if (page && page.frames) {
      let frameData = page.frames.find(f => f.id === frameId);
      if (frameData) {
        frameData.left = newLeft;
        frameData.top = newTop;
      }
    }
  });

  document.addEventListener('mouseup', () => {
    if (activeFrame) {
      localStorage.setItem('sch_ev_premium_pages_data', JSON.stringify(pages));
      activeFrame = null;
    }
  });
}

// ---------- CROPPING INTERFACE CONTROL PANEL MAPPING ----------
function openCropper(imageUrl, aspect, callback) {
  let modal = document.getElementById('cropperModal');
  let img = document.getElementById('cropImage');
  img.src = imageUrl;
  modal.style.display = 'flex';
  
  if (currentCropper) currentCropper.destroy();
  currentCropper = new Cropper(img, { aspectRatio: aspect, viewMode: 1 });
  currentImageCallback = callback;
}

// ---------- SYSTEM CORE EVENT LISTENERS MAPPING ----------
function initEventListeners() {
  document.getElementById('fontSelect')?.addEventListener('change', () => renderAllPages());
  document.getElementById('fontSizeSelect')?.addEventListener('change', () => renderAllPages());
  document.getElementById('canvasBgColor')?.addEventListener('change', () => renderAllPages());

  // Append fresh document log sheets
  document.getElementById('addPageBtn')?.addEventListener('click', () => {
    let newId = 'page_' + Date.now();
    pages.push({
      id: newId,
      title: 'Operational Section Log Notes',
      subtitle: 'Verification Metrics',
      content: '<p>Draft additional procedural observations, event evaluations, and meeting remarks here.</p>',
      frames: [],
      footerLeft: 'Verified Evaluation',
      footerCenter: 'Event Log Report Dossier',
      footerRight: 'Page ' + (pages.length + 1)
    });
    renderAllPages();
    showToast("Added clean administrative sheet canvas.");
  });

  // Dynamic Image Frame Injector beside Append New Sheet
  document.getElementById('addImageFrameBtn')?.addEventListener('click', () => {
    if (pages.length === 0) {
      showToast("Create at least one active sheet context first.");
      return;
    }
    // Automatically hooks framing into the latest page node
    let targetPage = pages[pages.length - 1];
    if (!targetPage.frames) targetPage.frames = [];
    
    targetPage.frames.push({
      id: 'frame_' + Date.now(),
      img: null,
      left: 450,
      top: 150
    });
    renderAllPages();
    showToast("Injected custom Move-able Image Frame overlay asset.");
  });

  // Compile and Save PDF Structure Layout sequence
  document.getElementById('exportPDFBtn')?.addEventListener('click', () => {
    let element = document.getElementById('pagesContainer');
    if (!element) return;
    showToast("Compiling assets into High-Res production PDF sequence...");
    let opt = {
      margin: 0,
      filename: 'MagicRills-Premium-Report-2026.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save().then(() => {
      showToast("PDF document successfully compiled and saved.");
    });
  });

  // Reaction click bindings
  document.querySelectorAll('.reaction-btn').forEach(btn => {
    btn.onclick = () => {
      let type = btn.dataset.react;
      if (type) recordReaction(type);
    };
  });

  // Networks outbound stream hooks
  document.querySelectorAll('[data-share]').forEach(btn => {
    btn.onclick = () => { recordShare(btn.dataset.share); };
  });

  document.getElementById('copyUrlBtn')?.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('✓ Link copied to administrative clipboard');
    recordShare('copy');
  });

  // Scrolling routines
  document.getElementById('scrollUp')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.getElementById('scrollDown')?.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));

  // Cropper structural button actions
  document.getElementById('applyCropBtn')?.addEventListener('click', () => {
    if (currentCropper) {
      let canvas = currentCropper.getCroppedCanvas();
      if (currentImageCallback) currentImageCallback(canvas.toDataURL());
      document.getElementById('cropperModal').style.display = 'none';
      currentCropper.destroy();
      currentCropper = null;
    }
  });

  document.getElementById('cancelCropBtn')?.addEventListener('click', () => {
    document.getElementById('cropperModal').style.display = 'none';
    if (currentCropper) { currentCropper.destroy(); currentCropper = null; }
  });
}

// ---------- REMOVE ENTIRE SHEET DYNAMIC LOGIC ----------
window.removeSectionSheet = function(pageId) {
  if (pages.length <= 1) {
    showToast("Cannot drop system default primary landing page.");
    return;
  }
  pages = pages.filter(p => p.id !== pageId);
  // Re-index layout footer page numbering sequence arrays cleanly
  pages.forEach((p, idx) => {
    p.footerRight = 'Page ' + (idx + 1);
  });
  localStorage.setItem('sch_ev_premium_pages_data', JSON.stringify(pages));
  renderAllPages();
  showToast("Dropped operational sheet section from workspace context.");
};

// ---------- IMAGES & LOGOS ASSET PROCESSORS MAPPING ----------
window.processLogoUpload = function(pageId) {
  let input = document.createElement('input');
  input.type = 'file'; input.accept = 'image/*';
  input.onchange = (ev) => {
    let file = ev.target.files[0];
    if (file) {
      let url = URL.createObjectURL(file);
      openCropper(url, 1, (croppedUrl) => {
        let page = pages.find(p => p.id === pageId);
        if (page) { page.logoImg = croppedUrl; renderAllPages(); }
        URL.revokeObjectURL(url);
      });
    }
  };
  input.click();
};

window.processBannerUpload = function(pageId) {
  let input = document.createElement('input');
  input.type = 'file'; input.accept = 'image/*';
  input.onchange = (ev) => {
    let file = ev.target.files[0];
    if (file) {
      let url = URL.createObjectURL(file);
      openCropper(url, 794 / 190, (croppedUrl) => {
        let page = pages.find(p => p.id === pageId);
        if (page) { page.bannerImg = croppedUrl; renderAllPages(); }
        URL.revokeObjectURL(url);
      });
    }
  };
  input.click();
};

window.uploadFrameImageAsset = function(pageId, frameId) {
  let input = document.createElement('input');
  input.type = 'file'; input.accept = 'image/*';
  input.onchange = (ev) => {
    let file = ev.target.files[0];
    if (file) {
      let url = URL.createObjectURL(file);
      openCropper(url, 260 / 180, (croppedUrl) => {
        let page = pages.find(p => p.id === pageId);
        if (page && page.frames) {
          let frame = page.frames.find(f => f.id === frameId);
          if (frame) {
            frame.img = croppedUrl;
            renderAllPages();
          }
        }
        URL.revokeObjectURL(url);
      });
    }
  };
  input.click();
};

window.deleteImageFrame = function(pageId, frameId) {
  let page = pages.find(p => p.id === pageId);
  if (page && page.frames) {
    page.frames = page.frames.filter(f => f.id !== frameId);
    localStorage.setItem('sch_ev_premium_pages_data', JSON.stringify(pages));
    renderAllPages();
    showToast("Removed structural image frame asset wrapper.");
  }
};

// ---------- SYSTEM RUNTIME DOM-LOAD SYNC INITIALIZER ----------
window.addEventListener('DOMContentLoaded', async () => {
  initPages();
  startLiveClock();
  typeWriter();
  
  await loadToolStats();
  await incrementUsage();

  let saved = localStorage.getItem('sch_ev_premium_pages_data');
  if (saved) { try { pages = JSON.parse(saved); } catch(e){ initPages(); } }
  
  renderAllPages();
  initEventListeners();
});
