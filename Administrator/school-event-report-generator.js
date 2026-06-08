// ============================================
// SCHOOL EVENT REPORT GENERATOR - COMPLETE JS
// FULLY EDITABLE: All pages, footer, TOC, content, banner
// Banner Fit Options (Cover/Contain/Fill) | Crop | Rotate
// No content mixing between pages
// ============================================

// ---------- GLOBAL STATE ----------
let pages = [];
let usage = parseInt(localStorage.getItem('school_event_usage') || '0');
let shares = parseInt(localStorage.getItem('school_event_shares') || '0');
let reactions = {
  like: 0, love: 0, wow: 0, sad: 0, angry: 0, laugh: 0, celebrate: 0
};

// Cropper variables
let currentCropper = null;
let currentImageCallback = null;

// ---------- HELPER FUNCTIONS ----------
function showToast(message, duration = 2000) {
  let toast = document.getElementById('toastMsg');
  if (!toast) return;
  toast.innerText = message;
  toast.style.opacity = '1';
  setTimeout(() => {
    toast.style.opacity = '0';
  }, duration);
}

function saveStats() {
  localStorage.setItem('school_event_usage', usage);
  localStorage.setItem('school_event_shares', shares);
  localStorage.setItem('school_event_reactions', JSON.stringify(reactions));
}

function incrementUsage() {
  usage++;
  saveStats();
}

function recordShare(platform) {
  shares++;
  saveStats();
  showToast(`✓ Shared on ${platform}`);
}

function recordReaction(type) {
  if (reactions[type] !== undefined) {
    reactions[type]++;
    updateReactionsUI();
    saveStats();
    showToast(`✓ ${type} reaction added`);
  }
}

function updateReactionsUI() {
  const reactionTypes = ['like', 'love', 'wow', 'sad', 'angry', 'laugh', 'celebrate'];
  const btns = document.querySelectorAll('.reaction-btn');
  btns.forEach((btn, idx) => {
    if (reactionTypes[idx]) {
      let emoji = btn.innerHTML.split(' ')[0];
      btn.innerHTML = `${emoji} ${reactions[reactionTypes[idx]]}`;
    }
  });
}

// Load saved reactions
let savedReacts = localStorage.getItem('school_event_reactions');
if (savedReacts) {
  try {
    let parsed = JSON.parse(savedReacts);
    reactions = { ...reactions, ...parsed };
  } catch(e) {}
}

// ---------- ESCAPE HTML ----------
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// ---------- INITIALIZE PAGES ----------
function initPages() {
  pages = [
    {
      id: 'p1',
      type: 'cover',
      title: 'Spring Fest 2026',
      subtitle: 'Annual Cultural & Sports Gala',
      date: 'March 15-17, 2026',
      venue: 'Grand School Auditorium, Main Campus',
      schoolName: 'The Smart School System',
      bannerImg: null,
      bannerFit: 'cover',
      bgColor: '#ffffff',
      footerLeft: 'School Event Report',
      footerCenter: 'Spring Fest 2026',
      footerRight: 'Page 1'
    },
    {
      id: 'p2',
      type: 'toc',
      title: 'Table of Contents',
      items: ['Introduction', 'Day 1 - Opening Ceremony', 'Day 2 - Sports Competitions', 'Day 3 - Cultural Show', 'Closing Ceremony'],
      bannerImg: null,
      bannerFit: 'cover',
      bgColor: '#ffffff',
      footerLeft: 'Contents',
      footerCenter: 'School Event Report 2026',
      footerRight: 'Page 2'
    },
    {
      id: 'p3',
      type: 'section',
      title: 'Introduction',
      date: '',
      content: '<h1>Event Overview</h1><p>The Annual School Event 2026 was organized with great enthusiasm and participation from students, teachers, and parents. The three-day event showcased the talent, creativity, and sportsmanship of our students.</p><h2>Key Highlights</h2><p>The festival began with a colorful opening ceremony featuring a march past by students, lighting of the ceremonial torch, and inspiring speeches by the principal and chief guest.</p><h3>Participation</h3><p>Over 500 students participated in various cultural and sports activities throughout the event.</p>',
      images: [],
      bannerImg: null,
      bannerFit: 'cover',
      bgColor: '#ffffff',
      footerLeft: 'Introduction',
      footerCenter: 'School Event Report 2026',
      footerRight: 'Page 3'
    },
    {
      id: 'p4',
      type: 'section',
      title: 'Day 1 - Opening Ceremony',
      date: 'March 15, 2026',
      content: '<p>The opening ceremony was held at 9:00 AM in the main auditorium. The event commenced with the recitation of the Holy Quran followed by the national anthem.</p><p>Chief Guest Mr. Ahmed Hassan, Director of Education, inaugurated the event by lighting the ceremonial lamp. The principal welcomed all guests and participants.</p><p>Students presented a spectacular welcome performance including a patriotic tableau and musical performance.</p>',
      images: [],
      bannerImg: null,
      bannerFit: 'cover',
      bgColor: '#ffffff',
      footerLeft: 'Day 1',
      footerCenter: 'School Event Report 2026',
      footerRight: 'Page 4'
    },
    {
      id: 'p5',
      type: 'section',
      title: 'Day 2 - Sports Competitions',
      date: 'March 16, 2026',
      content: '<p>The second day was dedicated to sports competitions. Various events including 100m sprint, relay races, long jump, high jump, and tug of war were organized.</p><p>The sports events promoted teamwork, discipline, and healthy competition among students. Parents and teachers cheered for the participants.</p><p>The highlight of the day was the teachers vs students friendly cricket match which ended with students winning by 5 runs.</p>',
      images: [],
      bannerImg: null,
      bannerFit: 'cover',
      bgColor: '#ffffff',
      footerLeft: 'Day 2',
      footerCenter: 'School Event Report 2026',
      footerRight: 'Page 5'
    },
    {
      id: 'p6',
      type: 'section',
      title: 'Day 3 - Cultural Show & Awards',
      date: 'March 17, 2026',
      content: '<p>The final day featured a grand cultural show including music performances, drama presentations, and art exhibitions by students.</p><p>Awards and certificates were distributed to winners of various competitions. The "Best Student Performer" award was given to multiple outstanding students.</p><p>Parents appreciated the efforts of teachers and students in making the event memorable.</p>',
      images: [],
      bannerImg: null,
      bannerFit: 'cover',
      bgColor: '#ffffff',
      footerLeft: 'Day 3',
      footerCenter: 'School Event Report 2026',
      footerRight: 'Page 6'
    },
    {
      id: 'p7',
      type: 'section',
      title: 'Closing Ceremony',
      date: '',
      content: '<p>The closing ceremony was held in the evening of March 17, 2026. Distinguished guests including parents and community members attended the ceremony.</p><p>The principal delivered the closing remarks and thanked all teachers, staff, and volunteers for making the event successful.</p><p>The event ended with a grand fireworks display and a group photograph of all participants.</p><p style="margin-top:20px; padding-top:15px; border-top:1px solid #e2e8f0;"><strong>Contact Information:</strong><br>📞 +92 300 1234567<br>✉️ info@smartschool.edu<br>🌐 www.smartschool.edu</p>',
      images: [],
      bannerImg: null,
      bannerFit: 'cover',
      bgColor: '#ffffff',
      footerLeft: 'Closing Ceremony',
      footerCenter: 'School Event Report 2026',
      footerRight: 'Page 7'
    }
  ];
}

// ---------- PAGE MANAGEMENT FUNCTIONS ----------
function addNewPage() {
  let newId = 'p' + (pages.length + 1);
  pages.push({
    id: newId,
    type: 'section',
    title: 'New Section',
    date: new Date().toLocaleDateString(),
    content: '<p>Write your section content here. Click to edit and add details about the event.</p>',
    images: [],
    bannerImg: null,
    bannerFit: 'cover',
    bgColor: '#ffffff',
    footerLeft: 'New Section',
    footerCenter: 'School Event Report 2026',
    footerRight: `Page ${pages.length + 1}`
  });
  renderAllPages();
  showToast('✓ New page added');
}

function removePage(pageId) {
  if (pages.length <= 1) {
    showToast('Cannot remove the last page');
    return;
  }
  pages = pages.filter(p => p.id !== pageId);
  renderAllPages();
  showToast('✓ Page removed');
}

// ---------- IMAGE CROPPER FUNCTION ----------
function openCropper(imageUrl, callback) {
  let modal = document.getElementById('cropperModal');
  let img = document.getElementById('cropImage');
  img.src = imageUrl;
  modal.style.display = 'flex';
  
  if (currentCropper) {
    currentCropper.destroy();
  }
  
  currentCropper = new Cropper(img, {
    aspectRatio: NaN,
    viewMode: 1,
    autoCropArea: 0.8,
    movable: true,
    zoomable: true,
    rotatable: true,
    scalable: true
  });
  
  currentImageCallback = callback;
}

// Cropper modal handlers
document.getElementById('applyCropBtn')?.addEventListener('click', () => {
  if (currentCropper) {
    let canvas = currentCropper.getCroppedCanvas();
    let croppedUrl = canvas.toDataURL();
    if (currentImageCallback) {
      currentImageCallback(croppedUrl);
    }
    document.getElementById('cropperModal').style.display = 'none';
    currentCropper.destroy();
    currentCropper = null;
  }
});

document.getElementById('cancelCropBtn')?.addEventListener('click', () => {
  document.getElementById('cropperModal').style.display = 'none';
  if (currentCropper) {
    currentCropper.destroy();
    currentCropper = null;
  }
});

document.getElementById('rotateLeftBtn')?.addEventListener('click', () => {
  if (currentCropper) currentCropper.rotate(-90);
});

document.getElementById('rotateRightBtn')?.addEventListener('click', () => {
  if (currentCropper) currentCropper.rotate(90);
});

document.getElementById('zoomInBtn')?.addEventListener('click', () => {
  if (currentCropper) currentCropper.zoom(0.1);
});

document.getElementById('zoomOutBtn')?.addEventListener('click', () => {
  if (currentCropper) currentCropper.zoom(-0.1);
});

document.getElementById('aspectRatioSelect')?.addEventListener('change', (e) => {
  let val = e.target.value;
  if (!currentCropper) return;
  if (val === 'free') currentCropper.setAspectRatio(NaN);
  else if (val === '1:1') currentCropper.setAspectRatio(1/1);
  else if (val === '4:3') currentCropper.setAspectRatio(4/3);
  else if (val === '16:9') currentCropper.setAspectRatio(16/9);
});

// ---------- IMAGE UPLOAD FUNCTIONS ----------
function uploadBanner(pageId) {
  let input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (ev) => {
    let file = ev.target.files[0];
    if (file) {
      let url = URL.createObjectURL(file);
      openCropper(url, (croppedUrl) => {
        let page = pages.find(p => p.id === pageId);
        if (page) {
          page.bannerImg = croppedUrl;
          renderAllPages();
          showToast('✓ Banner added successfully');
        }
        URL.revokeObjectURL(url);
      });
    }
  };
  input.click();
}

function setBannerFit(pageId, fit) {
  let page = pages.find(p => p.id === pageId);
  if (page) {
    page.bannerFit = fit;
    renderAllPages();
    showToast(`✓ Banner fit: ${fit}`);
  }
}

function addImageToPage(pageId) {
  let page = pages.find(p => p.id === pageId);
  if (page && page.type === 'section') {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (ev) => {
      let file = ev.target.files[0];
      if (file) {
        let url = URL.createObjectURL(file);
        openCropper(url, (croppedUrl) => {
          if (!page.images) page.images = [];
          page.images.push({
            src: croppedUrl,
            caption: `Image ${page.images.length + 1}`,
            rotation: 0,
            borderRadius: 0,
            shadow: false
          });
          renderAllPages();
          showToast('✓ Image added successfully');
          URL.revokeObjectURL(url);
        });
      }
    };
    input.click();
  }
}

// ---------- IMAGE CUSTOMIZATION ----------
function customizeImage(pageId, imgIdx, action, value) {
  let page = pages.find(p => p.id === pageId);
  if (page && page.images && page.images[imgIdx]) {
    switch(action) {
      case 'rotate':
        page.images[imgIdx].rotation = (page.images[imgIdx].rotation || 0) + 90;
        break;
      case 'borderRadius':
        page.images[imgIdx].borderRadius = value;
        break;
      case 'shadow':
        page.images[imgIdx].shadow = !page.images[imgIdx].shadow;
        break;
    }
    renderAllPages();
    showToast('✓ Image customized');
  }
}

// ---------- RICH TEXT EDITOR FUNCTIONS ----------
function formatText(command) {
  document.execCommand(command, false, null);
}

function formatHeading(tag) {
  document.execCommand('formatBlock', false, tag);
}

function formatList(command) {
  document.execCommand(command, false, null);
}

// ---------- RENDER ALL PAGES ----------
function renderAllPages() {
  let container = document.getElementById('pagesContainer');
  if (!container) return;
  container.innerHTML = '';
  
  pages.forEach((page, idx) => {
    let pageDiv = document.createElement('div');
    pageDiv.className = 'report-page';
    pageDiv.setAttribute('data-page-id', page.id);
    pageDiv.style.backgroundColor = page.bgColor;
    
    // Page Controls
    let controlsHtml = `
      <div class="page-controls">
        <button class="page-control-btn" onclick="window.removePage('${page.id}')" title="Remove Page">
          <i class="fas fa-trash-alt" style="color: #ef4444;"></i>
        </button>
      </div>
    `;
    
    // Banner with fit options
    let bannerStyle = '';
    if (page.bannerFit === 'cover') bannerStyle = 'object-fit: cover;';
    else if (page.bannerFit === 'contain') bannerStyle = 'object-fit: contain; background: #f0f0f0;';
    else bannerStyle = 'object-fit: fill;';
    
    let bannerHtml = `
      <div class="page-banner" style="position: relative;">
        ${page.bannerImg ? `<img src="${page.bannerImg}" style="width: 100%; height: 100%; ${bannerStyle}">` : '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:white;"><i class="fas fa-image" style="font-size:2rem;"></i><span style="margin-left:10px;">Click to add banner</span></div>'}
        <div class="banner-fit-controls">
          <button class="banner-fit-btn" onclick="event.stopPropagation(); window.setBannerFit('${page.id}', 'cover')">Cover</button>
          <button class="banner-fit-btn" onclick="event.stopPropagation(); window.setBannerFit('${page.id}', 'contain')">Contain</button>
          <button class="banner-fit-btn" onclick="event.stopPropagation(); window.setBannerFit('${page.id}', 'fill')">Fill</button>
        </div>
        <div class="banner-overlay">
          <button onclick="event.stopPropagation(); window.uploadBanner('${page.id}')"><i class="fas fa-camera"></i> Change Banner</button>
        </div>
      </div>
    `;
    
    let contentHtml = '';
    
    if (page.type === 'cover') {
      contentHtml = `
        <div class="section-content" style="text-align: center; display: flex; flex-direction: column; justify-content: center; min-height: 500px;">
          <h1 contenteditable="true" data-field="title" data-id="${page.id}" style="font-size: 2.5rem; margin-bottom: 15px;">${escapeHtml(page.title)}</h1>
          <h3 contenteditable="true" data-field="subtitle" data-id="${page.id}" style="color: #667eea; margin-bottom: 20px;">${escapeHtml(page.subtitle)}</h3>
          <p contenteditable="true" data-field="date" data-id="${page.id}">📅 ${escapeHtml(page.date)}</p>
          <p contenteditable="true" data-field="venue" data-id="${page.id}">📍 ${escapeHtml(page.venue)}</p>
        </div>
      `;
    } else if (page.type === 'toc') {
      let tocItems = '';
      page.items.forEach((item, i) => {
        tocItems += `
          <div class="toc-item">
            <span contenteditable="true" data-toc-item="${page.id}" data-toc-idx="${i}" style="flex:1;">${escapeHtml(item)}</span>
            <span>${i + 3}</span>
          </div>
        `;
      });
      contentHtml = `
        <div class="section-header">
          <div class="section-title" contenteditable="true" data-field="title" data-id="${page.id}" style="font-size: 1.8rem;">${escapeHtml(page.title)}</div>
        </div>
        <div class="section-content">
          ${tocItems}
        </div>
      `;
    } else {
      // Section page
      let imagesHtml = '';
      if (page.images && page.images.length > 0) {
        page.images.forEach((img, imgIdx) => {
          let imgStyle = `
            transform: rotate(${img.rotation || 0}deg);
            border-radius: ${img.borderRadius || 0}px;
            ${img.shadow ? 'box-shadow: 0 4px 12px rgba(0,0,0,0.2);' : ''}
          `;
          imagesHtml += `
            <div class="image-text-block">
              <div class="image-block">
                <div class="image-frame" style="min-height: 160px; position: relative;">
                  <img src="${img.src}" style="width: 100%; height: 100%; object-fit: cover; ${imgStyle}">
                  <div class="image-overlay">
                    <button onclick="window.customizeImage('${page.id}', ${imgIdx}, 'rotate')"><i class="fas fa-undo-alt"></i> Rotate</button>
                    <button onclick="window.customizeImage('${page.id}', ${imgIdx}, 'borderRadius', 10)"><i class="fas fa-border-all"></i> Round</button>
                    <button onclick="window.customizeImage('${page.id}', ${imgIdx}, 'shadow')"><i class="fas fa-cloud-sun"></i> Shadow</button>
                  </div>
                </div>
                <input type="text" class="image-caption" data-caption-page="${page.id}" data-caption-idx="${imgIdx}" value="${escapeHtml(img.caption)}" placeholder="Image caption...">
              </div>
              <div class="text-block">
                <div class="report-text" contenteditable="true" data-text-page="${page.id}" data-text-idx="${imgIdx}" style="min-height: 150px;">${imgIdx === 0 ? page.content : ''}</div>
              </div>
            </div>
          `;
        });
      } else {
        imagesHtml = `
          <div class="rich-text-toolbar">
            <button class="rich-btn" onclick="window.formatText('bold')"><b>Bold</b></button>
            <button class="rich-btn" onclick="window.formatText('italic')"><i>Italic</i></button>
            <button class="rich-btn" onclick="window.formatText('underline')"><u>Underline</u></button>
            <button class="rich-btn" onclick="window.formatHeading('h1')">H1</button>
            <button class="rich-btn" onclick="window.formatHeading('h2')">H2</button>
            <button class="rich-btn" onclick="window.formatHeading('h3')">H3</button>
            <button class="rich-btn" onclick="window.formatList('insertUnorderedList')">• Bullet List</button>
            <button class="rich-btn" onclick="window.formatList('insertOrderedList')">1. Number List</button>
          </div>
          <div class="report-text" contenteditable="true" data-text-page="${page.id}" style="min-height: 300px;">${page.content}</div>
        `;
      }
      
      contentHtml = `
        <div class="section-header">
          ${page.date ? `<div class="section-date" contenteditable="true" data-date-field="${page.id}">📅 ${escapeHtml(page.date)}</div>` : ''}
          <div class="section-title" contenteditable="true" data-field="title" data-id="${page.id}">${escapeHtml(page.title)}</div>
        </div>
        <div class="section-content">
          ${imagesHtml}
          <div style="margin-top: 15px;">
            <button class="btn btn-outline" onclick="window.addImageToPage('${page.id}')" style="font-size: 0.8rem;">
              <i class="fas fa-plus-circle"></i> Add Image Block
            </button>
          </div>
        </div>
      `;
    }
    
    // Editable Footer
    let footerHtml = `
      <div class="page-footer">
        <span contenteditable="true" data-footer-left="${page.id}">${escapeHtml(page.footerLeft || page.title)}</span>
        <span contenteditable="true" data-footer-center="${page.id}">${escapeHtml(page.footerCenter || 'School Event Report')}</span>
        <span contenteditable="true" data-footer-right="${page.id}">${escapeHtml(page.footerRight || `Page ${idx + 1}`)}</span>
      </div>
    `;
    
    pageDiv.innerHTML = controlsHtml + bannerHtml + contentHtml + footerHtml;
    container.appendChild(pageDiv);
  });
  
  attachDynamicEvents();
  applyGlobalStyles();
}

// ---------- ATTACH DYNAMIC EVENTS ----------
function attachDynamicEvents() {
  // Editable fields (title, subtitle, date, venue)
  document.querySelectorAll('[data-field]').forEach(el => {
    el.onblur = (e) => {
      let pageId = el.dataset.id;
      let field = el.dataset.field;
      let page = pages.find(p => p.id === pageId);
      if (page) {
        page[field] = el.innerText;
      }
    };
  });
  
  // Editable date field
  document.querySelectorAll('[data-date-field]').forEach(el => {
    el.onblur = (e) => {
      let pageId = el.dataset.dateField;
      let page = pages.find(p => p.id === pageId);
      if (page) {
        page.date = el.innerText.replace('📅 ', '');
      }
    };
  });
  
  // Editable TOC items
  document.querySelectorAll('[data-toc-item]').forEach(el => {
    el.onblur = (e) => {
      let pageId = el.dataset.tocItem;
      let idx = parseInt(el.dataset.tocIdx);
      let page = pages.find(p => p.id === pageId);
      if (page && page.items && page.items[idx]) {
        page.items[idx] = el.innerText;
      }
    };
  });
  
  // Editable text content
  document.querySelectorAll('[data-text-page]').forEach(el => {
    el.oninput = (e) => {
      let pageId = el.dataset.textPage;
      let page = pages.find(p => p.id === pageId);
      if (page) {
        page.content = el.innerHTML;
      }
    };
  });
  
  // Editable captions
  document.querySelectorAll('[data-caption-page]').forEach(inp => {
    inp.onchange = (e) => {
      let pageId = inp.dataset.captionPage;
      let imgIdx = parseInt(inp.dataset.captionIdx);
      let page = pages.find(p => p.id === pageId);
      if (page && page.images && page.images[imgIdx]) {
        page.images[imgIdx].caption = inp.value;
      }
    };
  });
  
  // Editable footer
  document.querySelectorAll('[data-footer-left], [data-footer-center], [data-footer-right]').forEach(el => {
    el.onblur = (e) => {
      let pageId = el.dataset.footerLeft || el.dataset.footerCenter || el.dataset.footerRight;
      let page = pages.find(p => p.id === pageId);
      if (page) {
        if (el.dataset.footerLeft) page.footerLeft = el.innerText;
        if (el.dataset.footerCenter) page.footerCenter = el.innerText;
        if (el.dataset.footerRight) page.footerRight = el.innerText;
      }
    };
  });
}

// ---------- APPLY GLOBAL STYLES ----------
function applyGlobalStyles() {
  let primaryColor = document.getElementById('primaryColor').value;
  let pageBgColor = document.getElementById('pageBgColor').value;
  
  document.querySelectorAll('.section-date, .cover-event').forEach(el => {
    el.style.color = primaryColor;
  });
  
  document.querySelectorAll('.report-page').forEach(page => {
    page.style.backgroundColor = pageBgColor;
  });
  
  document.documentElement.style.setProperty('--primary', primaryColor);
}

// ---------- AUTO SAVE DRAFT ----------
function autoSaveDraft() {
  localStorage.setItem('school_event_pages', JSON.stringify(pages));
}

// ---------- EXPORT FUNCTIONS ----------
async function exportToPDF() {
  showToast('📄 Generating PDF...');
  let element = document.getElementById('reportContainer');
  let opt = {
    margin: [0.5, 0.5, 0.5, 0.5],
    filename: `school-event-report-${Date.now()}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };
  
  try {
    await html2pdf().set(opt).from(element).save();
    showToast('✓ PDF exported successfully');
    incrementUsage();
  } catch (err) {
    showToast('❌ PDF export failed');
    console.error(err);
  }
}

function exportToDOCX() {
  showToast('📝 Creating Word document...');
  let content = document.getElementById('reportContainer').cloneNode(true);
  let style = document.createElement('style');
  style.textContent = `
    .report-page { margin-bottom: 20px; page-break-after: always; width: 100%; }
    .image-frame { border: 1px solid #ccc; min-height: 150px; }
    .btn, .toolbar, .scroll-fixed, .reactions-social, .nav-bar, .page-controls, .rich-text-toolbar, .image-overlay, .banner-fit-controls { display: none; }
    .report-text { background: transparent; }
    .page-footer span { background: transparent; }
  `;
  content.prepend(style);
  
  let html = `<!DOCTYPE html>
  <html>
  <head><meta charset="UTF-8"><title>School Event Report</title></head>
  <body>${content.innerHTML}</body>
  </html>`;
  
  let blob = new Blob([html], { type: 'application/msword' });
  let a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `school-event-report-${Date.now()}.doc`;
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('✓ DOCX exported');
  incrementUsage();
}

function printReport() {
  showToast('🖨️ Preparing print...');
  window.print();
  incrementUsage();
}

// ---------- INITIALIZE APP ----------
function init() {
  // Load saved pages
  let savedPages = localStorage.getItem('school_event_pages');
  if (savedPages) {
    try {
      pages = JSON.parse(savedPages);
    } catch(e) { console.warn(e); }
  }
  
  if (!pages || pages.length === 0) {
    initPages();
  }
  
  renderAllPages();
  updateReactionsUI();
  
  // Auto-save every 30 seconds
  setInterval(() => {
    autoSaveDraft();
  }, 30000);
  
  incrementUsage();
}

// Make functions global for onclick
window.removePage = removePage;
window.uploadBanner = uploadBanner;
window.setBannerFit = setBannerFit;
window.addImageToPage = addImageToPage;
window.customizeImage = customizeImage;
window.formatText = formatText;
window.formatHeading = formatHeading;
window.formatList = formatList;

// ---------- EVENT LISTENERS ----------
document.addEventListener('DOMContentLoaded', () => {
  init();
  
  // Export buttons
  document.getElementById('exportPDFBtn')?.addEventListener('click', exportToPDF);
  document.getElementById('exportDocBtn')?.addEventListener('click', exportToDOCX);
  document.getElementById('printBtn')?.addEventListener('click', printReport);
  document.getElementById('addPageBtn')?.addEventListener('click', addNewPage);
  
  // Dark mode
  document.getElementById('darkModeBtn')?.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('school_darkMode', document.body.classList.contains('dark'));
  });
  if (localStorage.getItem('school_darkMode') === 'true') {
    document.body.classList.add('dark');
  }
  
  // Navigation
  document.getElementById('homeBtn')?.addEventListener('click', () => {
    window.location.href = 'https://magicrills.com';
  });
  document.getElementById('backBtn')?.addEventListener('click', () => {
    window.location.href = 'https://magicrills.com/category-pages/administrator.html';
  });
  
  // Copy URL
  document.getElementById('copyUrlBtn')?.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('✓ Report link copied!');
    recordShare('copy');
  });
  
  // Color pickers
  document.getElementById('primaryColor')?.addEventListener('change', () => applyGlobalStyles());
  document.getElementById('pageBgColor')?.addEventListener('change', () => applyGlobalStyles());
  
  // Font selector
  document.getElementById('fontSelect')?.addEventListener('change', (e) => {
    document.body.style.fontFamily = `${e.target.value}, sans-serif`;
  });
  
  // Social shares
  document.querySelectorAll('[data-share]').forEach(btn => {
    btn.onclick = () => {
      let platform = btn.dataset.share;
      let url = encodeURIComponent(window.location.href);
      let shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?url=${url}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent('Check out this school event report: ' + window.location.href)}`
      };
      if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
      }
      recordShare(platform);
    };
  });
  
  // Reactions
  document.querySelectorAll('.reaction-btn').forEach(btn => {
    btn.onclick = () => {
      let type = btn.dataset.react;
      if (type) recordReaction(type);
    };
  });
  
  // Scroll buttons
  document.getElementById('scrollUp')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.getElementById('scrollDown')?.addEventListener('click', () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  });
});
