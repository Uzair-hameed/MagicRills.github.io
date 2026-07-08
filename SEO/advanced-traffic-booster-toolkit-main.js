/* ============================================
   advanced-traffic-booster-toolkit.js
   Version: 28 Tools + Cloudflare Workers API + AI Integration
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

  // ========== CLOUDFLARE WORKERS API CONFIGURATION ==========
  const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';
  const API_KEY = 'magicrills-grok-api.uzairhameed01.workers.dev';
  
  // Session ID for user tracking
  let sessionId = localStorage.getItem('toolkit_session_id');
  if (!sessionId) {
    sessionId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('toolkit_session_id', sessionId);
  }

  // ========== STORAGE KEYS (Local Fallback) ==========
  const STORAGE_KEYS = {
    USAGE: 'tool_usage_counts',
    REACTIONS: 'tool_reactions',
    USER_REACTIONS: 'user_reacted_tools',
    SHARES: 'tool_share_counts'
  };

  // ========== TOAST NOTIFICATION ==========
  function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      info: 'fa-info-circle',
      warning: 'fa-exclamation-triangle'
    };
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ========== CALL CLOUDFLARE WORKERS API ==========
  async function callAPI(endpoint, method = 'GET', data = null) {
    try {
      const url = `${API_BASE}${endpoint}`;
      const options = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
          'X-Session-ID': sessionId
        }
      };
      if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
      }
      const response = await fetch(url, options);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: error.message };
    }
  }

  // ========== SYNC USAGE WITH CLOUDFLARE WORKERS ==========
  async function syncUsageToSheets(toolId, toolName, toolSlug) {
    try {
      // Increment usage via API
      const result = await callAPI('/api/usage', 'POST', { 
        tool_id: toolId,
        tool_slug: toolSlug,
        tool_name: toolName
      });
      
      if (result.success) {
        // Also update local storage for fallback
        let usageData = JSON.parse(localStorage.getItem(STORAGE_KEYS.USAGE) || '{}');
        usageData[toolId] = (usageData[toolId] || 0) + 1;
        localStorage.setItem(STORAGE_KEYS.USAGE, JSON.stringify(usageData));
        updateUsageDisplay(toolId);
        showToast(`📊 "${toolName}" used!`, 'info');
        await loadTotalStatsFromAPI();
        return true;
      } else {
        // Fallback to local storage if API fails
        let usageData = JSON.parse(localStorage.getItem(STORAGE_KEYS.USAGE) || '{}');
        usageData[toolId] = (usageData[toolId] || 0) + 1;
        localStorage.setItem(STORAGE_KEYS.USAGE, JSON.stringify(usageData));
        updateUsageDisplay(toolId);
        showToast(`📊 "${toolName}" used (offline mode)`, 'info');
        return true;
      }
    } catch (error) {
      // Fallback to local storage
      let usageData = JSON.parse(localStorage.getItem(STORAGE_KEYS.USAGE) || '{}');
      usageData[toolId] = (usageData[toolId] || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.USAGE, JSON.stringify(usageData));
      updateUsageDisplay(toolId);
      showToast(`📊 "${toolName}" used (offline mode)`, 'info');
      return true;
    }
  }

  // ========== SYNC REACTION WITH CLOUDFLARE WORKERS ==========
  async function syncReactionToAPI(toolId, reaction, toolName, toolSlug) {
    try {
      const result = await callAPI('/api/reactions', 'POST', { 
        tool_id: toolId,
        tool_slug: toolSlug,
        reaction_type: reaction,
        session_id: sessionId
      });
      
      if (result.success) {
        // Update local storage
        let reactionsData = JSON.parse(localStorage.getItem(STORAGE_KEYS.REACTIONS) || '{}');
        if (!reactionsData[toolId]) {
          reactionsData[toolId] = { like: 0, love: 0, wow: 0, sad: 0, laugh: 0, celebrate: 0 };
        }
        reactionsData[toolId][reaction] = (reactionsData[toolId][reaction] || 0) + 1;
        localStorage.setItem(STORAGE_KEYS.REACTIONS, JSON.stringify(reactionsData));
        
        // Mark user reaction
        let userReactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_REACTIONS) || '{}');
        userReactions[`${toolId}_${reaction}`] = true;
        localStorage.setItem(STORAGE_KEYS.USER_REACTIONS, JSON.stringify(userReactions));
        
        updateReactionDisplay(toolId, reaction);
        showToast(`${getReactionEmoji(reaction)} Reaction added!`, 'success');
        await loadTotalStatsFromAPI();
        return true;
      } else if (result.already_reacted) {
        showToast(`⚠️ You already reacted with ${getReactionEmoji(reaction)}!`, 'error');
        return false;
      } else {
        // Fallback to local storage
        let reactionsData = JSON.parse(localStorage.getItem(STORAGE_KEYS.REACTIONS) || '{}');
        if (!reactionsData[toolId]) {
          reactionsData[toolId] = { like: 0, love: 0, wow: 0, sad: 0, laugh: 0, celebrate: 0 };
        }
        reactionsData[toolId][reaction] = (reactionsData[toolId][reaction] || 0) + 1;
        localStorage.setItem(STORAGE_KEYS.REACTIONS, JSON.stringify(reactionsData));
        updateReactionDisplay(toolId, reaction);
        showToast(`${getReactionEmoji(reaction)} Reaction added (offline)!`, 'success');
        return true;
      }
    } catch (error) {
      // Fallback to local storage
      let reactionsData = JSON.parse(localStorage.getItem(STORAGE_KEYS.REACTIONS) || '{}');
      if (!reactionsData[toolId]) {
        reactionsData[toolId] = { like: 0, love: 0, wow: 0, sad: 0, laugh: 0, celebrate: 0 };
      }
      reactionsData[toolId][reaction] = (reactionsData[toolId][reaction] || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.REACTIONS, JSON.stringify(reactionsData));
      updateReactionDisplay(toolId, reaction);
      showToast(`${getReactionEmoji(reaction)} Reaction added (offline)!`, 'success');
      return true;
    }
  }

  // ========== SYNC SHARE WITH CLOUDFLARE WORKERS ==========
  async function syncShareToAPI(toolId, platform, toolName, toolSlug) {
    try {
      const result = await callAPI('/api/shares', 'POST', { 
        tool_id: toolId,
        tool_slug: toolSlug,
        platform: platform,
        session_id: sessionId
      });
      
      if (result.success) {
        let sharesData = JSON.parse(localStorage.getItem(STORAGE_KEYS.SHARES) || '{}');
        sharesData[toolId] = (sharesData[toolId] || 0) + 1;
        localStorage.setItem(STORAGE_KEYS.SHARES, JSON.stringify(sharesData));
        showToast(`📤 Shared ${toolName} on ${platform}!`, 'success');
        await loadTotalStatsFromAPI();
      } else {
        let sharesData = JSON.parse(localStorage.getItem(STORAGE_KEYS.SHARES) || '{}');
        sharesData[toolId] = (sharesData[toolId] || 0) + 1;
        localStorage.setItem(STORAGE_KEYS.SHARES, JSON.stringify(sharesData));
        showToast(`📤 Shared ${toolName} on ${platform} (offline)!`, 'success');
      }
    } catch (error) {
      let sharesData = JSON.parse(localStorage.getItem(STORAGE_KEYS.SHARES) || '{}');
      sharesData[toolId] = (sharesData[toolId] || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.SHARES, JSON.stringify(sharesData));
      showToast(`📤 Shared ${toolName} on ${platform} (offline)!`, 'success');
    }
  }

  // ========== LOAD TOTAL STATS FROM API ==========
  async function loadTotalStatsFromAPI() {
    try {
      const result = await callAPI('/api/stats', 'GET');
      
      if (result.success && result.stats) {
        document.getElementById('totalUsageCount').textContent = result.stats.total_usage || 0;
        document.getElementById('totalReactionsCount').textContent = result.stats.total_reactions || 0;
        document.getElementById('totalSharesCount').textContent = result.stats.total_shares || 0;
      } else {
        // Use local stats
        updateTotalStatsFromLocal();
      }
    } catch (error) {
      // Use local stats
      updateTotalStatsFromLocal();
    }
  }

  function updateTotalStatsFromLocal() {
    const usageData = JSON.parse(localStorage.getItem(STORAGE_KEYS.USAGE) || '{}');
    const reactionsData = JSON.parse(localStorage.getItem(STORAGE_KEYS.REACTIONS) || '{}');
    const sharesData = JSON.parse(localStorage.getItem(STORAGE_KEYS.SHARES) || '{}');
    let totalUsage = 0, totalReactions = 0, totalShares = 0;
    Object.values(usageData).forEach(v => totalUsage += v);
    Object.values(reactionsData).forEach(tool => {
      if (tool) Object.values(tool).forEach(v => totalReactions += v);
    });
    Object.values(sharesData).forEach(v => totalShares += v);
    document.getElementById('totalUsageCount').textContent = totalUsage;
    document.getElementById('totalReactionsCount').textContent = totalReactions;
    document.getElementById('totalSharesCount').textContent = totalShares;
  }

  // ========== HELPER FUNCTIONS ==========
  function updateUsageDisplay(toolId) {
    const usageData = JSON.parse(localStorage.getItem(STORAGE_KEYS.USAGE) || '{}');
    const count = usageData[toolId] || 0;
    const usageSpan = document.querySelector(`.tool-card[data-tool-id="${toolId}"] .usage-count`);
    if (usageSpan) usageSpan.textContent = count;
  }

  function updateReactionDisplay(toolId, reaction) {
    const reactionsData = JSON.parse(localStorage.getItem(STORAGE_KEYS.REACTIONS) || '{}');
    const count = reactionsData[toolId]?.[reaction] || 0;
    const container = document.querySelector(`.tool-reactions[data-tool-id="${toolId}"]`);
    if (container) {
      const btn = container.querySelector(`.reaction-btn[data-reaction="${reaction}"]`);
      if (btn) {
        const countSpan = btn.querySelector('.reaction-count');
        if (countSpan) countSpan.textContent = count;
      }
    }
  }

  function getReactionEmoji(reaction) {
    const emojis = { like: '👍', love: '❤️', wow: '😮', sad: '😢', laugh: '😂', celebrate: '🎉' };
    return emojis[reaction] || '👍';
  }

  // ========== TYPEWRITER EFFECT ==========
  function initTypewriter() {
    const phrases = [
      'SEO Analytics 📊',
      'Backlink Finder 🔗',
      'Social Captions 📱',
      'SSL Checker 🔒',
      'DNS Lookup 🌐',
      'PageSpeed Insights ⚡',
      'Content Calendar 📅',
      'Meta Tags Generator 🏷️'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const element = document.getElementById('typewriterText');
    
    function type() {
      const currentPhrase = phrases[phraseIndex];
      
      if (isDeleting) {
        element.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
      } else {
        element.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
      }
      
      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(type, 2000);
        return;
      }
      
      if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, 500);
        return;
      }
      
      setTimeout(type, isDeleting ? 50 : 100);
    }
    
    type();
  }

  // ========== PAGE SHARE BUTTON ==========
  document.getElementById('pageShareBtn')?.addEventListener('click', async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      showToast('✅ Page link copied to clipboard!', 'success');
      // Record page share
      try {
        await callAPI('/api/shares', 'POST', { 
          tool_id: 'page',
          tool_slug: 'page-share',
          platform: 'copy',
          session_id: sessionId
        });
      } catch(e) {}
    } catch (err) {
      showToast('❌ Could not copy link', 'error');
    }
  });

  // ========== USE TOOL BUTTON HANDLERS ==========
  function initUseToolButtons() {
    document.querySelectorAll('.use-tool-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const toolCard = this.closest('.tool-card');
        if (toolCard) {
          const toolId = toolCard.dataset.toolId;
          const toolName = toolCard.dataset.toolName;
          const toolSlug = toolCard.dataset.toolSlug || toolName.toLowerCase().replace(/\s+/g, '-');
          if (toolId) syncUsageToSheets(toolId, toolName, toolSlug);
        }
      });
    });
  }

  // ========== REACTIONS INIT ==========
  function initReactions() {
    document.querySelectorAll('.tool-reactions').forEach(container => {
      const toolId = container.dataset.toolId;
      if (!toolId) return;
      
      let reactionsData = JSON.parse(localStorage.getItem(STORAGE_KEYS.REACTIONS) || '{}');
      if (!reactionsData[toolId]) {
        reactionsData[toolId] = { like: 0, love: 0, wow: 0, sad: 0, laugh: 0, celebrate: 0 };
        localStorage.setItem(STORAGE_KEYS.REACTIONS, JSON.stringify(reactionsData));
      }
      
      const counts = reactionsData[toolId];
      container.querySelectorAll('.reaction-btn').forEach(btn => {
        const reaction = btn.dataset.reaction;
        const countSpan = btn.querySelector('.reaction-count');
        if (countSpan && counts[reaction] !== undefined) {
          countSpan.textContent = counts[reaction];
        }
      });
      
      container.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const reaction = btn.dataset.reaction;
          const toolCard = container.closest('.tool-card');
          const toolName = toolCard?.dataset.toolName || 'Tool';
          const toolSlug = toolCard?.dataset.toolSlug || toolName.toLowerCase().replace(/\s+/g, '-');
          syncReactionToAPI(toolId, reaction, toolName, toolSlug);
        });
      });
    });
  }

  // ========== SOCIAL SHARING INIT ==========
  function initSocialShares() {
    document.querySelectorAll('.tool-social-shares').forEach(container => {
      const toolId = container.dataset.toolId;
      const toolName = container.dataset.toolName;
      const toolSlug = container.closest('.tool-card')?.dataset.toolSlug || toolName?.toLowerCase().replace(/\s+/g, '-') || 'tool';
      
      container.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const platform = btn.dataset.platform;
          
          let shareUrl = '';
          const url = window.location.href;
          const text = `Check out ${toolName} tool on Advanced Traffic Booster Toolkit! 🚀`;
          
          switch(platform) {
            case 'facebook': 
              shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`; 
              break;
            case 'twitter': 
              shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`; 
              break;
            case 'linkedin': 
              shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`; 
              break;
            case 'whatsapp': 
              shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`; 
              break;
            case 'copy': 
              navigator.clipboard.writeText(url);
              showToast('✅ Link copied!', 'success');
              syncShareToAPI(toolId, platform, toolName, toolSlug);
              return;
          }
          
          if (shareUrl) {
            window.open(shareUrl, '_blank');
            syncShareToAPI(toolId, platform, toolName, toolSlug);
          }
        });
      });
    });
  }

  // ========== TAB SWITCHING ==========
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const tabId = tab.dataset.tab;
      tabContents.forEach(content => content.classList.remove('active'));
      document.getElementById(`${tabId}-tab`).classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // ========== SCROLL BUTTONS ==========
  const scrollUpBtn = document.getElementById('scrollUpBtn');
  const scrollDownBtn = document.getElementById('scrollDownBtn');
  
  window.addEventListener('scroll', () => {
    if (scrollUpBtn) {
      if (window.scrollY > 200) scrollUpBtn.style.display = 'block';
      else scrollUpBtn.style.display = 'none';
    }
  });
  
  scrollUpBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  scrollDownBtn?.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));

  // ========== TOOL FUNCTIONS (1-16) ==========
  
  // 1. Ping Builder
  function addLog(containerId, message, type = 'info') {
    const container = document.getElementById(containerId);
    if (!container) return;
    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    entry.textContent = message;
    container.appendChild(entry);
    container.scrollTop = container.scrollHeight;
  }
  
  document.getElementById('startPingBtn')?.addEventListener('click', () => {
    const url = document.getElementById('pingUrl')?.value.trim();
    if (!url) { addLog('pingLog', '❌ Enter URL', 'error'); return; }
    addLog('pingLog', '🚀 Starting ping submission...', 'info');
    const pingServices = [
      `http://pingomatic.com/ping/?blogurl=${encodeURIComponent(url)}`,
      `http://blogsearch.google.com/ping?url=${encodeURIComponent(url)}`,
      `http://rpc.pingomatic.com/`,
      `https://ping.feedburner.com/`
    ];
    pingServices.forEach(service => window.open(service, '_blank'));
    addLog('pingLog', `✅ Opened ${pingServices.length} ping services`, 'success');
  });

  // 2. Social Captions
  document.getElementById('genSocialBtn')?.addEventListener('click', () => {
    const url = document.getElementById('socialUrl')?.value.trim();
    const title = document.getElementById('socialTitle')?.value.trim();
    const desc = document.getElementById('socialDesc')?.value.trim();
    const tags = document.getElementById('socialTags')?.value.trim();
    const image = document.getElementById('socialImage')?.value.trim();
    
    if (!url || !title) { alert('Enter URL and Title'); return; }
    
    const hashtags = tags.split(',').map(t => t.trim()).filter(t => t).map(t => `#${t}`).join(' ');
    const utmUrl = url + (url.includes('?') ? '&' : '?') + 'utm_source=social_toolkit';
    
    const platforms = [
      { name: 'Facebook', emoji: '📘', color: '#3b5998', caption: `${title}\n\n${desc}\n\n${hashtags}\n\n${utmUrl}` },
      { name: 'Twitter', emoji: '🐦', color: '#1da1f2', caption: `${title}\n\n${hashtags}\n\n${utmUrl}`.substring(0, 280) },
      { name: 'LinkedIn', emoji: '🔗', color: '#0077b5', caption: `${title}\n\n${desc}\n\n${hashtags}\n\n${utmUrl}` },
      { name: 'WhatsApp', emoji: '💬', color: '#25d366', caption: `${title} - ${desc} ${utmUrl}` }
    ];
    
    let html = '<div class="social-container">';
    platforms.forEach(p => {
      html += `<div class="result-item"><h3 style="color:white;">${p.emoji} ${p.name}</h3><p style="color:rgba(255,255,255,0.8);">${p.caption.replace(/\n/g, '<br>')}</p>${image ? `<img src="${image}" style="max-width:100%;border-radius:8px;margin-top:10px;" loading="lazy">` : ''}<button class="btn btn-primary copy-caption" data-caption="${p.caption.replace(/"/g, '&quot;')}">Copy ${p.name} Caption</button></div>`;
    });
    html += '</div>';
    document.getElementById('socialResults').innerHTML = html;
    
    document.querySelectorAll('.copy-caption').forEach(btn => {
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(btn.dataset.caption);
        showToast('✅ Caption copied!', 'success');
      });
    });
  });

  // 3. Backlink Finder
  const backlinkDB = {
    general: [
      { name: 'BloggerList', url: 'https://bloggerlist.com/submit/' },
      { name: 'Blogarama', url: 'https://www.blogarama.com/add-your-blog' },
      { name: 'BlogCatalog', url: 'https://blogcatalog.com/submit' }
    ],
    tech: [
      { name: 'Dev.to', url: 'https://dev.to/enter' },
      { name: 'HackerNews', url: 'https://news.ycombinator.com/submit' },
      { name: 'DZone', url: 'https://dzone.com/' }
    ],
    business: [
      { name: 'LinkedIn Articles', url: 'https://www.linkedin.com/pulse/' },
      { name: 'Medium', url: 'https://medium.com/' },
      { name: 'BusinessBlog', url: 'https://www.businessblog.com/' }
    ]
  };
  
  document.getElementById('findBacklinksBtn')?.addEventListener('click', () => {
    const category = document.getElementById('backlinkCat')?.value || 'general';
    const sites = backlinkDB[category] || backlinkDB.general;
    let html = '<h3 style="color:white;">🔗 Free Backlink Sites</h3><div class="checklist-3d">';
    sites.forEach((site, index) => {
      html += `<div class="checklist-item">
        <span class="check-icon">${index + 1}</span>
        <h4>${site.name}</h4>
        <p><a href="${site.url}" target="_blank" class="result-link">${site.url}</a></p>
        <button class="btn btn-primary" style="margin-top:8px;font-size:12px;padding:8px 16px;" onclick="window.open('${site.url}','_blank')">Visit</button>
        <span class="badge-3d">Free</span>
      </div>`;
    });
    html += '</div>';
    document.getElementById('backlinkResults').innerHTML = html;
  });

  // 4. Bulk URL Opener
  document.getElementById('openBulkBtn')?.addEventListener('click', () => {
    const urlsText = document.getElementById('bulkUrls')?.value || '';
    const urls = urlsText.split(/\r?\n/).map(u => u.trim()).filter(u => u && u.startsWith('http'));
    if (urls.length === 0) { alert('Enter valid URLs'); return; }
    urls.forEach(url => window.open(url, '_blank'));
    showToast(`✅ Opened ${urls.length} URLs`, 'success');
  });

  // 5. Hashtag Generator
  const hashtagDB = {
    seo: ['#SEO', '#SEOtips', '#GoogleRanking', '#SEOStrategy', '#ContentSEO', '#KeywordResearch', '#SEOTools', '#SEOAudit'],
    blogging: ['#Blogging', '#Blogger', '#ContentMarketing', '#BlogTips', '#BloggingCommunity', '#WriteBlog', '#BloggingLife'],
    food: ['#Food', '#Foodie', '#Recipe', '#FoodLover', '#Cooking', '#FoodPhotography', '#Delicious', '#HomeCooking']
  };
  
  document.getElementById('genHashtagsBtn')?.addEventListener('click', () => {
    let keyword = document.getElementById('hashtagKeyword')?.value.trim().toLowerCase() || 'seo';
    let hashtags = hashtagDB[keyword] || hashtagDB.seo;
    let html = `<div class="result-item">
      <h3 style="color:white;">Hashtags for "${keyword}"</h3>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin:12px 0;">
        ${hashtags.map(h => `<span class="badge badge-info" style="font-size:14px;padding:6px 14px;">${h}</span>`).join('')}
      </div>
      <button class="btn btn-success" id="copyHashBtn">📋 Copy All</button>
    </div>`;
    document.getElementById('hashtagResults').innerHTML = html;
    document.getElementById('copyHashBtn')?.addEventListener('click', () => {
      navigator.clipboard.writeText(hashtags.join(' '));
      showToast('✅ Hashtags copied!', 'success');
    });
  });

  // 6. Meta Tags Generator
  document.getElementById('genMetaBtn')?.addEventListener('click', () => {
    const title = document.getElementById('metaTitle')?.value.trim();
    if (!title) { alert('Enter title'); return; }
    const desc = document.getElementById('metaDesc')?.value.trim() || '';
    const keywords = document.getElementById('metaKeywords')?.value.trim() || '';
    const image = document.getElementById('metaImage')?.value.trim() || '';
    
    const metaTags = `<!-- Primary Meta Tags -->\n<title>${title}</title>\n<meta name="description" content="${desc}">\n<meta name="keywords" content="${keywords}">\n\n<!-- Open Graph -->\n<meta property="og:title" content="${title}">\n<meta property="og:description" content="${desc}">${image ? `\n<meta property="og:image" content="${image}">` : ''}\n<meta property="og:type" content="website">\n\n<!-- Twitter Card -->\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${title}">\n<meta name="twitter:description" content="${desc}">${image ? `\n<meta name="twitter:image" content="${image}">` : ''}`;
    
    document.getElementById('metaResults').innerHTML = `<div class="result-item"><textarea rows="12" style="width:100%;font-family:monospace;background:rgba(0,0,0,0.3);color:#d4d4d4;border:1px solid var(--glass-border);border-radius:8px;padding:12px;">${metaTags}</textarea><button class="btn btn-success" id="copyMetaBtn">📋 Copy</button></div>`;
    document.getElementById('copyMetaBtn')?.addEventListener('click', () => {
      navigator.clipboard.writeText(metaTags);
      showToast('✅ Meta tags copied!', 'success');
    });
  });

  // 7. Content Calendar
  function loadCalendar() {
    const calendar = JSON.parse(localStorage.getItem('contentCalendar') || '[]');
    if (calendar.length === 0) {
      document.getElementById('calendarList').innerHTML = '<div class="result-item" style="color:rgba(255,255,255,0.5);">No scheduled posts</div>';
      return;
    }
    let html = '<div class="checklist-3d">';
    calendar.forEach((item, index) => {
      html += `<div class="checklist-item">
        <span class="check-icon">📝</span>
        <h4>${item.title}</h4>
        <p>📅 ${item.date}</p>
        <button class="btn btn-danger" style="font-size:12px;padding:6px 14px;" onclick="removeCalendarItem(${index})">Remove</button>
        <span class="badge-3d">Scheduled</span>
      </div>`;
    });
    html += '</div>';
    document.getElementById('calendarList').innerHTML = html;
  }
  
  window.removeCalendarItem = function(index) {
    let calendar = JSON.parse(localStorage.getItem('contentCalendar') || '[]');
    calendar.splice(index, 1);
    localStorage.setItem('contentCalendar', JSON.stringify(calendar));
    loadCalendar();
    showToast('✅ Removed from calendar', 'success');
  };
  
  document.getElementById('addCalendarBtn')?.addEventListener('click', () => {
    const title = document.getElementById('calTitle')?.value.trim();
    const date = document.getElementById('calDate')?.value;
    if (!title || !date) { alert('Enter title and date'); return; }
    let calendar = JSON.parse(localStorage.getItem('contentCalendar') || '[]');
    calendar.push({ title, date });
    localStorage.setItem('contentCalendar', JSON.stringify(calendar));
    loadCalendar();
    document.getElementById('calTitle').value = '';
    document.getElementById('calDate').value = '';
    showToast('✅ Added to calendar', 'success');
  });
  
  document.getElementById('clearCalendarBtn')?.addEventListener('click', () => {
    localStorage.removeItem('contentCalendar');
    loadCalendar();
    showToast('🗑️ Calendar cleared', 'info');
  });
  loadCalendar();

  // 8-16 API Functions
  function showLoading(resultId) {
    const el = document.getElementById(resultId);
    if (el) el.innerHTML = '<div class="loading-spinner-container"><div class="loading-spinner"></div><p style="color:rgba(255,255,255,0.6);">Loading...</p></div>';
  }

  // 8. Redirect Checker
  document.getElementById('checkRedirectBtn')?.addEventListener('click', async () => {
    const url = document.getElementById('redirectUrl')?.value.trim();
    if (!url) { alert('Enter URL'); return; }
    showLoading('redirectResults');
    try {
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      const status = response.status;
      const statusText = response.statusText;
      document.getElementById('redirectResults').innerHTML = `
        <div class="result-item">
          <p style="color:white;">✅ Status: <span class="badge ${status >= 200 && status < 300 ? 'badge-success' : 'badge-danger'}">${status} ${statusText}</span></p>
          <p style="color:rgba(255,255,255,0.7);">URL: <a href="${url}" target="_blank" class="result-link">${url}</a></p>
          ${status >= 300 && status < 400 ? '<p style="color:var(--warning);">⚠️ This URL has a redirect</p>' : ''}
        </div>`;
    } catch {
      document.getElementById('redirectResults').innerHTML = '<div class="result-item"><p style="color:var(--danger);">❌ Error checking redirect</p></div>';
    }
  });

  // 9. Sitemap Validator
  document.getElementById('validateSitemapBtn')?.addEventListener('click', async () => {
    const url = document.getElementById('sitemapUrl')?.value.trim();
    if (!url) { alert('Enter sitemap URL'); return; }
    showLoading('sitemapResults');
    try {
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      const urlCount = (data.contents.match(/<loc>/g) || []).length;
      const isValid = data.contents.includes('<?xml') || data.contents.includes('<urlset');
      document.getElementById('sitemapResults').innerHTML = `
        <div class="result-item">
          <p style="color:white;">${isValid ? '✅' : '❌'} Sitemap ${isValid ? 'Valid' : 'Invalid'}</p>
          <p style="color:rgba(255,255,255,0.7);">📊 URLs Found: <span class="badge badge-info">${urlCount}</span></p>
          ${isValid ? `<p style="color:var(--success);">✅ Sitemap is properly formatted</p>` : `<p style="color:var(--danger);">❌ Sitemap format is invalid</p>`}
        </div>`;
    } catch {
      document.getElementById('sitemapResults').innerHTML = '<div class="result-item"><p style="color:var(--danger);">❌ Invalid sitemap or network error</p></div>';
    }
  });

  // 10. Robots.txt Tester
  document.getElementById('testRobotsBtn')?.addEventListener('click', async () => {
    let domain = document.getElementById('robotsUrl')?.value.trim();
    if (!domain) { alert('Enter URL'); return; }
    domain = domain.replace(/\/$/, '');
    showLoading('robotsResults');
    try {
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(domain + '/robots.txt')}`);
      const data = await response.json();
      const content = data.contents || '';
      const hasDisallow = content.includes('Disallow:');
      const hasAllow = content.includes('Allow:');
      const hasSitemap = content.includes('Sitemap:');
      document.getElementById('robotsResults').innerHTML = `
        <div class="result-item">
          <p style="color:white;">🤖 Robots.txt Found!</p>
          <div style="background:rgba(0,0,0,0.3);padding:12px;border-radius:8px;overflow-x:auto;margin:10px 0;">
            <pre style="color:#d4d4d4;font-size:12px;margin:0;">${content.substring(0, 1500)}${content.length > 1500 ? '\n... (truncated)' : ''}</pre>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px;">
            <span class="badge ${hasDisallow ? 'badge-warning' : 'badge-success'}">${hasDisallow ? '⚠️ Has Disallow' : '✅ No Disallow'}</span>
            <span class="badge ${hasAllow ? 'badge-info' : 'badge-secondary'}">${hasAllow ? '✅ Has Allow' : 'ℹ️ No Allow'}</span>
            <span class="badge ${hasSitemap ? 'badge-success' : 'badge-secondary'}">${hasSitemap ? '✅ Has Sitemap' : 'ℹ️ No Sitemap'}</span>
          </div>
        </div>`;
    } catch {
      document.getElementById('robotsResults').innerHTML = '<div class="result-item"><p style="color:var(--danger);">❌ No robots.txt found or network error</p></div>';
    }
  });

  // 11. SSL Checker
  document.getElementById('checkSslBtn')?.addEventListener('click', async () => {
    const domain = document.getElementById('sslDomain')?.value.trim();
    if (!domain) { alert('Enter domain'); return; }
    showLoading('sslResults');
    try {
      const response = await fetch(`https://api.allorigins.win/get?url=https://${domain}`);
      const isSecure = response.ok && response.status < 400;
      document.getElementById('sslResults').innerHTML = `
        <div class="result-item">
          <p style="color:white;">${isSecure ? '🔒' : '⚠️'} SSL Status for <strong>${domain}</strong></p>
          <p style="color:${isSecure ? 'var(--success)' : 'var(--danger)'};">${isSecure ? '✅ SSL Certificate Active' : '❌ No valid SSL certificate found'}</p>
          <p style="color:rgba(255,255,255,0.6);">🔗 <a href="https://${domain}" target="_blank" class="result-link">https://${domain}</a></p>
          ${isSecure ? '<p style="color:var(--success);">✅ Connection is secure</p>' : '<p style="color:var(--danger);">⚠️ Connection is not secure</p>'}
        </div>`;
    } catch {
      document.getElementById('sslResults').innerHTML = '<div class="result-item"><p style="color:var(--danger);">❌ No SSL certificate found or network error</p></div>';
    }
  });

  // 12. DNS Lookup
  document.getElementById('lookupDnsBtn')?.addEventListener('click', async () => {
    const domain = document.getElementById('dnsDomain')?.value.trim();
    const recordType = document.getElementById('dnsType')?.value || 'A';
    if (!domain) { alert('Enter domain'); return; }
    showLoading('dnsResults');
    try {
      // Using a public DNS API
      const response = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${recordType}`);
      const data = await response.json();
      const records = data.Answer || [];
      document.getElementById('dnsResults').innerHTML = `
        <div class="result-item">
          <p style="color:white;">🌐 DNS ${recordType} Records for <strong>${domain}</strong></p>
          ${records.length > 0 ? records.map(r => `
            <div style="background:rgba(255,255,255,0.03);padding:8px 12px;border-radius:6px;margin:6px 0;border-left:3px solid var(--primary);">
              <span style="color:rgba(255,255,255,0.7);">${r.data}</span>
              <span class="badge badge-info" style="margin-left:10px;">TTL: ${r.TTL}</span>
            </div>
          `).join('') : '<p style="color:rgba(255,255,255,0.5);">No records found</p>'}
        </div>`;
    } catch {
      document.getElementById('dnsResults').innerHTML = '<div class="result-item"><p style="color:var(--danger);">❌ DNS lookup failed</p></div>';
    }
  });

  // 13. HTTP Headers
  document.getElementById('checkHeadersBtn')?.addEventListener('click', async () => {
    const url = document.getElementById('headersUrl')?.value.trim();
    if (!url) { alert('Enter URL'); return; }
    showLoading('headersResults');
    try {
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      const headers = {};
      response.headers.forEach((v, k) => headers[k] = v);
      document.getElementById('headersResults').innerHTML = `
        <div class="result-item">
          <p style="color:white;">📋 HTTP Headers for <a href="${url}" target="_blank" class="result-link">${url}</a></p>
          <div style="background:rgba(0,0,0,0.3);padding:12px;border-radius:8px;overflow-x:auto;margin:10px 0;max-height:300px;overflow-y:auto;">
            <pre style="color:#d4d4d4;font-size:12px;margin:0;">${JSON.stringify(headers, null, 2)}</pre>
          </div>
          <p style="color:rgba(255,255,255,0.6);">Status: <span class="badge ${response.ok ? 'badge-success' : 'badge-danger'}">${response.status} ${response.statusText}</span></p>
        </div>`;
    } catch {
      document.getElementById('headersResults').innerHTML = '<div class="result-item"><p style="color:var(--danger);">❌ Error fetching headers</p></div>';
    }
  });

  // 14. Whois Lookup
  document.getElementById('lookupWhoisBtn')?.addEventListener('click', async () => {
    const domain = document.getElementById('whoisDomain')?.value.trim();
    if (!domain) { alert('Enter domain'); return; }
    showLoading('whoisResults');
    try {
      const response = await fetch(`https://api.devopsclub.cn/api/whoisquery?domain=${domain}`);
      const data = await response.json();
      const info = data.data || {};
      document.getElementById('whoisResults').innerHTML = `
        <div class="result-item">
          <p style="color:white;">📄 Whois Information for <strong>${domain}</strong></p>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0;">
            <div><span style="color:rgba(255,255,255,0.5);">Registrar:</span> <span style="color:white;">${info.registrar || 'N/A'}</span></div>
            <div><span style="color:rgba(255,255,255,0.5);">Created:</span> <span style="color:white;">${info.creation_date || info.creationDate || 'N/A'}</span></div>
            <div><span style="color:rgba(255,255,255,0.5);">Expires:</span> <span style="color:white;">${info.expiration_date || info.expiryDate || 'N/A'}</span></div>
            <div><span style="color:rgba(255,255,255,0.5);">Status:</span> <span class="badge badge-info">${info.status || 'N/A'}</span></div>
          </div>
        </div>`;
    } catch {
      document.getElementById('whoisResults').innerHTML = '<div class="result-item"><p style="color:var(--danger);">❌ Whois lookup failed</p></div>';
    }
  });

  // 15. IP Location
  document.getElementById('lookupIpBtn')?.addEventListener('click', async () => {
    const query = document.getElementById('ipDomain')?.value.trim();
    if (!query) { alert('Enter domain or IP'); return; }
    showLoading('ipResults');
    try {
      const response = await fetch(`https://ipapi.co/${query}/json/`);
      const data = await response.json();
      document.getElementById('ipResults').innerHTML = `
        <div class="result-item">
          <p style="color:white;">📍 IP Location for <strong>${query}</strong></p>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0;">
            <div><span style="color:rgba(255,255,255,0.5);">IP:</span> <span style="color:white;">${data.ip || query}</span></div>
            <div><span style="color:rgba(255,255,255,0.5);">Country:</span> <span style="color:white;">${data.country_name || 'N/A'} ${data.country_code ? `(${data.country_code})` : ''}</span></div>
            <div><span style="color:rgba(255,255,255,0.5);">City:</span> <span style="color:white;">${data.city || 'N/A'}</span></div>
            <div><span style="color:rgba(255,255,255,0.5);">ISP:</span> <span style="color:white;">${data.org || data.isp || 'N/A'}</span></div>
            <div><span style="color:rgba(255,255,255,0.5);">Region:</span> <span style="color:white;">${data.region || 'N/A'}</span></div>
            <div><span style="color:rgba(255,255,255,0.5);">Timezone:</span> <span style="color:white;">${data.timezone || 'N/A'}</span></div>
          </div>
        </div>`;
    } catch {
      document.getElementById('ipResults').innerHTML = '<div class="result-item"><p style="color:var(--danger);">❌ Location lookup failed</p></div>';
    }
  });

  // 16. PageSpeed
  document.getElementById('checkSpeedBtn')?.addEventListener('click', async () => {
    const url = document.getElementById('speedUrl')?.value.trim();
    if (!url) { alert('Enter URL'); return; }
    showLoading('speedResults');
    try {
      const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      const score = (data.lighthouseResult?.categories?.performance?.score * 100) || 0;
      const fcp = data.lighthouseResult?.audits?.['first-contentful-paint']?.displayValue || 'N/A';
      const lcp = data.lighthouseResult?.audits?.['largest-contentful-paint']?.displayValue || 'N/A';
      const tti = data.lighthouseResult?.audits?.['interactive']?.displayValue || 'N/A';
      
      let grade = 'Good';
      let color = 'var(--success)';
      if (score < 50) { grade = 'Poor'; color = 'var(--danger)'; }
      else if (score < 90) { grade = 'Needs Improvement'; color = 'var(--warning)'; }
      
      document.getElementById('speedResults').innerHTML = `
        <div class="result-item">
          <h3 style="color:white;">⚡ PageSpeed Score: <span style="color:${color};">${Math.round(score)}/100</span></h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${score}%;background:linear-gradient(90deg, ${score < 50 ? 'var(--danger)' : score < 90 ? 'var(--warning)' : 'var(--success)'}, var(--primary-light));">${Math.round(score)}%</div></div>
          <p style="color:rgba(255,255,255,0.7);">Grade: <span class="badge ${score < 50 ? 'badge-danger' : score < 90 ? 'badge-warning' : 'badge-success'}">${grade}</span></p>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:10px;">
            <div><span style="color:rgba(255,255,255,0.5);">First Paint:</span> <span style="color:white;">${fcp}</span></div>
            <div><span style="color:rgba(255,255,255,0.5);">Largest Paint:</span> <span style="color:white;">${lcp}</span></div>
            <div><span style="color:rgba(255,255,255,0.5);">Time to Interactive:</span> <span style="color:white;">${tti}</span></div>
          </div>
        </div>`;
    } catch {
      document.getElementById('speedResults').innerHTML = '<div class="result-item"><p style="color:var(--danger);">⚠️ API limit reached or invalid URL</p></div>';
    }
  });

  // ========== AI INTEGRATION (Grok AI) ==========
  async function callAI(prompt) {
    try {
      const response = await callAPI('/api/ai', 'POST', { 
        prompt: prompt,
        session_id: sessionId
      });
      return response;
    } catch (error) {
      console.error('AI Error:', error);
      return { success: false, error: error.message };
    }
  }

  // ========== INITIALIZE ==========
  function init() {
    initTypewriter();
    initUseToolButtons();
    initReactions();
    initSocialShares();
    loadTotalStatsFromAPI();
    showToast('🎉 Toolkit Ready! Live data from Cloudflare Workers!', 'success');
  }
  
  init();

});
