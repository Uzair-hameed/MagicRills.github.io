/**
 * Circle Time Song Generator - Main JavaScript
 * Cloudflare Workers API Integration + AI Song Generation
 * Version: 2.0.0
 */

(function() {
    'use strict';

    // ============================================================
    // CONFIGURATION
    // ============================================================
    const CONFIG = {
        TOOL_SLUG: 'circle-time-song-generator',
        TOOL_NAME: 'Circle Time Song Generator',
        CATEGORY: 'ECCE',
        API_BASE: 'https://magicrills-api.uzairhameed01.workers.dev',
        API_KEY: 'magicrills-grok-api.uzairhameed01.workers.dev',
        EMOJIS: ['👍', '❤️', '😮', '😢', '😂', '🎉', '⭐']
    };

    // ============================================================
    // STATE
    // ============================================================
    const state = {
        usageCount: 0,
        shareCount: 0,
        followersCount: 0,
        reactions: { '👍': 0, '❤️': 0, '😮': 0, '😢': 0, '😂': 0, '🎉': 0, '⭐': 0 },
        userReactions: {},
        currentSong: {},
        isGenerating: false
    };

    // ============================================================
    // DOM REFS
    // ============================================================
    const DOM = {
        usageCount: document.getElementById('usageCount'),
        heroUsage: document.getElementById('heroUsage'),
        totalReactionsSpan: document.getElementById('totalReactionsSpan'),
        shareCountDisplay: document.getElementById('shareCountDisplay'),
        shareCountDisplay2: document.getElementById('shareCountDisplay2'),
        followersCount: document.getElementById('followersCount'),
        heroReactions: document.getElementById('heroReactions'),
        heroShares: document.getElementById('heroShares'),
        heroFollowers: document.getElementById('heroFollowers'),
        reactionsContainer: document.getElementById('reactionsContainer'),
        songOutput: document.getElementById('songOutput'),
        songTitle: document.getElementById('songTitle'),
        generateBtn: document.getElementById('generateBtn'),
        listenBtn: document.getElementById('listenBtn'),
        saveFavBtn: document.getElementById('saveFavBtn'),
        deleteFavBtn: document.getElementById('deleteFavBtn'),
        favSelect: document.getElementById('favSelect'),
        pdfBtn: document.getElementById('pdfBtn'),
        wordBtn: document.getElementById('wordBtn'),
        copyBtn: document.getElementById('copyBtn'),
        printBtn: document.getElementById('printBtn'),
        pageShareBtn: document.getElementById('pageShareBtn'),
        scrollUpBtn: document.getElementById('scrollUpBtn'),
        scrollDownBtn: document.getElementById('scrollDownBtn'),
        language: document.getElementById('language'),
        category: document.getElementById('category'),
        topic: document.getElementById('topic'),
        tune: document.getElementById('tune'),
        customLine: document.getElementById('customLine'),
        typewriterText: document.getElementById('typewriterText')
    };

    // ============================================================
    // TYPEWRITER ANIMATION
    // ============================================================
    const typewriterPhrases = [
        'educational songs',
        'circle time fun',
        'learning melodies',
        'Urdu nursery rhymes',
        'English kids songs',
        'ECCE activities',
        'classroom music'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typewriterEffect() {
        const currentPhrase = typewriterPhrases[phraseIndex];
        if (isDeleting) {
            charIndex--;
            DOM.typewriterText.textContent = currentPhrase.substring(0, charIndex);
            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % typewriterPhrases.length;
                setTimeout(typewriterEffect, 400);
            } else {
                setTimeout(typewriterEffect, 30);
            }
        } else {
            charIndex++;
            DOM.typewriterText.textContent = currentPhrase.substring(0, charIndex);
            if (charIndex === currentPhrase.length) {
                isDeleting = true;
                setTimeout(typewriterEffect, 2000);
            } else {
                setTimeout(typewriterEffect, 60);
            }
        }
    }

    // ============================================================
    // TOAST SYSTEM
    // ============================================================
    function showToast(message, type = 'success') {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icons = {
            success: 'fa-check-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle',
            error: 'fa-times-circle'
        };
        toast.innerHTML = `
            <span class="toast-icon"><i class="fas ${icons[type] || icons.info}"></i></span>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);
        setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3000);
    }

    // ============================================================
    // API CALLS
    // ============================================================
    async function callAPI(endpoint, method = 'POST', data = null) {
        const url = `${CONFIG.API_BASE}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            'X-API-Key': CONFIG.API_KEY
        };
        const options = { method, headers };
        if (data) options.body = JSON.stringify(data);

        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.warn('API call failed, using localStorage fallback:', error);
            return null;
        }
    }

    // ============================================================
    // STORAGE HELPERS
    // ============================================================
    function getLocal(key, def) {
        try {
            const val = localStorage.getItem(`cts_${CONFIG.TOOL_SLUG}_${key}`);
            return val ? JSON.parse(val) : def;
        } catch { return def; }
    }

    function setLocal(key, val) {
        try {
            localStorage.setItem(`cts_${CONFIG.TOOL_SLUG}_${key}`, JSON.stringify(val));
        } catch {}
    }

    // ============================================================
    // LOAD STATS
    // ============================================================
    async function loadStats() {
        // Try API first
        try {
            const result = await callAPI(`/api/stats?tool_slug=${CONFIG.TOOL_SLUG}`, 'GET');
            if (result && result.success) {
                state.usageCount = result.data.usage || 0;
                state.shareCount = result.data.shares || 0;
                state.followersCount = result.data.followers || 0;
                if (result.data.reactions) {
                    Object.keys(result.data.reactions).forEach(key => {
                        if (state.reactions[key] !== undefined) {
                            state.reactions[key] = result.data.reactions[key];
                        }
                    });
                }
                updateAllUI();
                return;
            }
        } catch (e) { /* fallback to localStorage */ }

        // Fallback: localStorage
        state.usageCount = getLocal('usage', 0);
        state.shareCount = getLocal('shares', 0);
        state.followersCount = getLocal('followers', 0);
        const savedReactions = getLocal('reactions', null);
        if (savedReactions) {
            Object.keys(savedReactions).forEach(key => {
                if (state.reactions[key] !== undefined) {
                    state.reactions[key] = savedReactions[key];
                }
            });
        }
        state.userReactions = getLocal('userReactions', {});
        updateAllUI();
    }

    // ============================================================
    // UPDATE UI
    // ============================================================
    function updateAllUI() {
        // Usage
        DOM.usageCount.textContent = state.usageCount;
        DOM.heroUsage.textContent = state.usageCount;

        // Reactions total
        const totalReactions = Object.values(state.reactions).reduce((a, b) => a + b, 0);
        DOM.totalReactionsSpan.textContent = totalReactions;
        DOM.heroReactions.textContent = totalReactions;

        // Shares
        DOM.shareCountDisplay.textContent = state.shareCount;
        DOM.shareCountDisplay2.textContent = state.shareCount;
        DOM.heroShares.textContent = state.shareCount;

        // Followers
        DOM.followersCount.textContent = state.followersCount;
        DOM.heroFollowers.textContent = state.followersCount;

        // Reactions UI
        renderReactions();
    }

    // ============================================================
    // RENDER REACTIONS
    // ============================================================
    function renderReactions() {
        const activeClassMap = {
            '👍': 'active-like',
            '❤️': 'active-love',
            '😮': 'active-wow',
            '😢': 'active-sad',
            '😂': 'active-laugh',
            '🎉': 'active-party',
            '⭐': 'active-star'
        };

        DOM.reactionsContainer.innerHTML = CONFIG.EMOJIS.map(emoji => {
            const count = state.reactions[emoji] || 0;
            const isActive = state.userReactions[emoji] || false;
            const activeClass = isActive ? activeClassMap[emoji] || '' : '';
            return `
                <button class="reaction-btn ${activeClass}" data-emoji="${emoji}">
                    <span class="emoji">${emoji}</span>
                    <span class="count">${count}</span>
                </button>
            `;
        }).join('');

        // Bind events
        DOM.reactionsContainer.querySelectorAll('.reaction-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const emoji = this.dataset.emoji;
                handleReaction(emoji);
            });
        });
    }

    // ============================================================
    // HANDLE REACTION
    // ============================================================
    async function handleReaction(emoji) {
        if (state.userReactions[emoji]) {
            showToast(`You already reacted with ${emoji}`, 'info');
            return;
        }

        // Update local
        state.userReactions[emoji] = true;
        state.reactions[emoji] = (state.reactions[emoji] || 0) + 1;

        // Save local
        setLocal('reactions', state.reactions);
        setLocal('userReactions', state.userReactions);

        // Update UI
        updateAllUI();
        showToast(`Reaction ${emoji} added!`, 'success');

        // Try API
        try {
            await callAPI('/api/reactions', 'POST', {
                tool_slug: CONFIG.TOOL_SLUG,
                emoji: emoji,
                action: 'add'
            });
        } catch (e) {
            console.warn('Reaction API failed, but saved locally');
        }
    }

    // ============================================================
    // INCREMENT USAGE
    // ============================================================
    async function incrementUsage() {
        state.usageCount++;
        setLocal('usage', state.usageCount);
        updateAllUI();

        try {
            await callAPI('/api/usage', 'POST', {
                tool_slug: CONFIG.TOOL_SLUG,
                action: 'increment'
            });
        } catch (e) {
            console.warn('Usage API failed, but saved locally');
        }
    }

    // ============================================================
    // INCREMENT SHARE
    // ============================================================
    async function incrementShare() {
        state.shareCount++;
        setLocal('shares', state.shareCount);
        updateAllUI();

        try {
            await callAPI('/api/shares', 'POST', {
                tool_slug: CONFIG.TOOL_SLUG,
                action: 'increment'
            });
        } catch (e) {
            console.warn('Share API failed, but saved locally');
        }
    }

    // ============================================================
    // SONG DATA
    // ============================================================
    const categoriesList = [
        'Alphabet', 'Phonics', 'Digraph', 'Vowel Sounds', 'Trigraph',
        'Sight Words', 'Counting', 'Shapes', 'Colors', 'Days of Week',
        'Months', 'Fruits', 'Vegetables', 'Animals', 'Body Parts',
        'Emotions', 'Weather', 'Transportation', 'Actions', 'Hygiene',
        'Family', 'Opposites'
    ];

    const topicsData = {
        'Animals': ['Lion', 'Elephant', 'Cat', 'Dog', 'Bird', 'Fish'],
        'Body Parts': ['Eyes', 'Nose', 'Hands', 'Ears', 'Mouth', 'Feet'],
        'Emotions': ['Happy', 'Sad', 'Angry', 'Excited', 'Scared', 'Calm'],
        'Weather': ['Sunny', 'Rainy', 'Cloudy', 'Snowy', 'Windy'],
        'Transportation': ['Car', 'Bus', 'Train', 'Bicycle', 'Plane', 'Boat'],
        'Actions': ['Run', 'Jump', 'Clap', 'Dance', 'Skip', 'Hop'],
        'Hygiene': ['Wash Hands', 'Brush Teeth', 'Take Bath', 'Comb Hair'],
        'Family': ['Mother', 'Father', 'Brother', 'Sister', 'Grandma', 'Grandpa'],
        'Opposites': ['Big/Small', 'Hot/Cold', 'Fast/Slow', 'Day/Night'],
        'Alphabet': ['A', 'B', 'C', 'D', 'E', 'F'],
        'Phonics': ['C', 'SH', 'TH', 'CH', 'PH', 'WH'],
        'Digraph': ['CH', 'SH', 'TH', 'WH', 'PH'],
        'Vowel Sounds': ['A', 'E', 'I', 'O', 'U'],
        'Trigraph': ['IGH', 'TCH', 'DGE', 'EAR'],
        'Sight Words': ['THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT'],
        'Counting': ['1-5', '1-10', '1-20', '10-1'],
        'Shapes': ['Circle', 'Square', 'Triangle', 'Star', 'Heart'],
        'Colors': ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        'Days of Week': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        'Months': ['January', 'May', 'September', 'December'],
        'Fruits': ['Apple', 'Banana', 'Orange', 'Mango', 'Grapes'],
        'Vegetables': ['Carrot', 'Tomato', 'Potato', 'Onion', 'Spinach']
    };

    // ============================================================
    // POPULATE CATEGORIES & TOPICS
    // ============================================================
    function populateCategories() {
        DOM.category.innerHTML = categoriesList.map(c =>
            `<option value="${c}">${c}</option>`
        ).join('');
        DOM.category.addEventListener('change', populateTopics);
        populateTopics();
    }

    function populateTopics() {
        const cat = DOM.category.value;
        const topics = topicsData[cat] || ['Explore', 'Learn', 'Sing'];
        DOM.topic.innerHTML = topics.map(t =>
            `<option value="${t}">${t}</option>`
        ).join('');
    }

    // ============================================================
    // AI GENERATE SONG
    // ============================================================
    async function generateSong() {
        if (state.isGenerating) return;

        const lang = DOM.language.value;
        const category = DOM.category.value;
        const topic = DOM.topic.value;
        const tune = DOM.tune.value.trim();
        const custom = DOM.customLine.value.trim();

        // Show loading
        state.isGenerating = true;
        DOM.generateBtn.disabled = true;
        DOM.generateBtn.innerHTML = '<span class="loader"></span> Generating...';
        DOM.songOutput.innerHTML = '<div style="text-align:center;padding:40px;"><span class="loader"></span><p style="margin-top:16px;color:var(--text-muted);">AI is composing your song...</p></div>';

        try {
            // Try API first for AI generation
            const result = await callAPI('/api/generate-song', 'POST', {
                tool_slug: CONFIG.TOOL_SLUG,
                language: lang,
                category: category,
                topic: topic,
                tune: tune,
                custom_line: custom
            });

            let songText = '';
            if (result && result.success && result.data.song) {
                songText = result.data.song;
            } else {
                // Fallback: local generation
                songText = generateLocalSong(lang, category, topic, tune, custom);
            }

            // Update UI
            const displayText = songText.replace(/\n/g, '<br>');
            DOM.songOutput.innerHTML = displayText;
            DOM.songTitle.textContent = `${category} - ${topic} Song`;

            if (lang === 'urdu') {
                DOM.songOutput.classList.add('urdu-text');
            } else {
                DOM.songOutput.classList.remove('urdu-text');
            }

            state.currentSong = { lang, category, topic, tune, custom, songText };

            // Increment usage
            await incrementUsage();
            showToast('✨ Song generated successfully!', 'success');

        } catch (error) {
            console.error('Generation error:', error);
            // Fallback to local
            const songText = generateLocalSong(lang, category, topic, tune, custom);
            const displayText = songText.replace(/\n/g, '<br>');
            DOM.songOutput.innerHTML = displayText;
            DOM.songTitle.textContent = `${category} - ${topic} Song`;
            state.currentSong = { lang, category, topic, tune, custom, songText };
            await incrementUsage();
            showToast('✨ Song generated (offline mode)', 'info');
        }

        state.isGenerating = false;
        DOM.generateBtn.disabled = false;
        DOM.generateBtn.innerHTML = '<i class="fas fa-magic"></i> AI Generate';
    }

    // ============================================================
    // LOCAL SONG GENERATOR (Fallback)
    // ============================================================
    function generateLocalSong(lang, category, topic, tune, custom) {
        let base = `🎵 ${category} - ${topic} Song 🎵\n\n`;
        
        const templates = {
            english: [
                `Let's sing about ${topic} today,\nClap your hands and shout hooray!\nLearning is fun, come along,\nWith a happy circle time song!`,
                `${topic}, ${topic}, what do you say?\nWe will learn and sing and play!\nCircle time is so much fun,\nFor everyone, everyone!`,
                `Hello friends, let's sing a song,\nAbout ${topic} all day long!\nJoin the circle, hold my hand,\nLearning together is so grand!`
            ],
            urdu: [
                `🎵 ${topic} کا گیت 🎵\n\nآؤ مل کر گائیں، سب خوشیاں منائیں،\n${topic} کے بارے میں ہم سب سکھائیں!\nحلقہ بنا کر بیٹھیں، ہاتھ تھامے،\nمل جل کر ہم سب خوشیاں منائیں!`,
                `🍎 ${topic}، ${topic}، کیا کہتے ہو؟\nہم سیکھیں گے اور گائیں گے اور کھیلیں گے!\nحلقہ وقت بہت مزہ ہے،\nسب کے لیے، سب کے لیے!`,
                `دوستو آؤ گیت گائیں، ${topic} کے بارے میں سکھائیں!\nحلقہ میں شامل ہوں، میرا ہاتھ تھامیں،\nمل جل کر سیکھنا بہت اچھا ہے!`
            ],
            spanish: [
                `🎵 Canción de ${topic} 🎵\n\nCantemos sobre ${topic} hoy,\n¡Aplaude y grita hurra!\nAprender es divertido, ven conmigo,\n¡Con una canción de círculo feliz!`,
                `Hola amigos, cantemos una canción,\n¡Sobre ${topic} todo el día!\nÚnete al círculo, toma mi mano,\n¡Aprender juntos es tan grandioso!`
            ],
            french: [
                `🎵 Chanson de ${topic} 🎵\n\nChantons sur ${topic} aujourd'hui,\nApplaudissez et criez hourra !\nApprendre est amusant, venez avec moi,\nAvec une chanson de cercle heureuse !`
            ]
        };

        const langTemplates = templates[lang] || templates.english;
        const randomTemplate = langTemplates[Math.floor(Math.random() * langTemplates.length)];
        base += randomTemplate;

        if (tune) {
            base = `♪ Sur l'air de: ${tune} ♪\n\n${base}`;
        }
        if (custom) {
            base += `\n\n✏️ ${custom}`;
        }

        return base;
    }

    // ============================================================
    // LISTEN (Text-to-Speech)
    // ============================================================
    function listenSong() {
        const text = DOM.songOutput.textContent || DOM.songOutput.innerText;
        if (!text || text.includes('Choose options') || text.includes('AI is composing')) {
            showToast('Please generate a song first!', 'warning');
            return;
        }

        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
            const utter = new SpeechSynthesisUtterance(text);
            const lang = DOM.language.value;
            const langMap = {
                'english': 'en-US',
                'urdu': 'ur-PK',
                'spanish': 'es-ES',
                'french': 'fr-FR'
            };
            utter.lang = langMap[lang] || 'en-US';
            utter.rate = 0.9;
            utter.pitch = 1.1;
            speechSynthesis.speak(utter);
            showToast('🔊 Listening...', 'info');
        } else {
            showToast('Speech synthesis not supported', 'error');
        }
    }

    // ============================================================
    // FAVORITES
    // ============================================================
    function saveFavorite() {
        if (!state.currentSong.songText) {
            showToast('Generate a song first!', 'warning');
            return;
        }
        let favs = getLocal('favorites', []);
        favs.push({ ...state.currentSong, savedAt: Date.now() });
        setLocal('favorites', favs);
        loadFavDropdown();
        showToast('⭐ Saved to favorites!', 'success');
    }

    function loadFavDropdown() {
        const favs = getLocal('favorites', []);
        DOM.favSelect.innerHTML = '<option value="">-- Load Favorite --</option>' +
            favs.map((f, i) => `<option value="${i}">${f.category || 'Song'} - ${f.topic || ''}</option>`).join('');
    }

    function loadFavorite(index) {
        const favs = getLocal('favorites', []);
        if (favs[index]) {
            const f = favs[index];
            DOM.language.value = f.lang || 'english';
            DOM.category.value = f.category || '';
            populateTopics();
            setTimeout(() => {
                DOM.topic.value = f.topic || '';
                DOM.tune.value = f.tune || '';
                DOM.customLine.value = f.custom || '';
                // Regenerate song from favorite data
                const songText = f.songText || generateLocalSong(f.lang, f.category, f.topic, f.tune, f.custom);
                DOM.songOutput.innerHTML = songText.replace(/\n/g, '<br>');
                DOM.songTitle.textContent = `${f.category} - ${f.topic} Song`;
                state.currentSong = f;
                if (f.lang === 'urdu') {
                    DOM.songOutput.classList.add('urdu-text');
                } else {
                    DOM.songOutput.classList.remove('urdu-text');
                }
                showToast('📂 Favorite loaded!', 'success');
            }, 50);
        }
    }

    function deleteAllFavs() {
        setLocal('favorites', []);
        loadFavDropdown();
        showToast('🗑️ All favorites removed', 'warning');
    }

    // ============================================================
    // EXPORT FUNCTIONS
    // ============================================================
    function exportPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const title = DOM.songTitle.textContent;
        const content = DOM.songOutput.textContent || DOM.songOutput.innerText;
        doc.setFontSize(18);
        doc.text(title, 105, 20, { align: 'center' });
        doc.setFontSize(11);
        doc.text(doc.splitTextToSize(content, 180), 15, 35);
        doc.save('song.pdf');
        showToast('📄 PDF exported!', 'success');
    }

    function exportWord() {
        const title = DOM.songTitle.textContent;
        const content = DOM.songOutput.textContent || DOM.songOutput.innerText;
        const html = `<html><head><meta charset="UTF-8"></head><body>
            <h1>${title}</h1>
            <pre style="font-family: inherit; white-space: pre-wrap;">${content}</pre>
        </body></html>`;
        const blob = new Blob([html], { type: 'application/msword;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'song.doc';
        a.click();
        URL.revokeObjectURL(a.href);
        showToast('📄 Word exported!', 'success');
    }

    function copySong() {
        const text = DOM.songOutput.textContent || DOM.songOutput.innerText;
        if (!text || text.includes('Choose options')) {
            showToast('Generate a song first!', 'warning');
            return;
        }
        navigator.clipboard.writeText(text).then(() => {
            showToast('📋 Copied to clipboard!', 'success');
        }).catch(() => {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            textarea.remove();
            showToast('📋 Copied to clipboard!', 'success');
        });
    }

    function printSong() {
        window.print();
    }

    // ============================================================
    // SHARE FUNCTIONS
    // ============================================================
    function shareTool(platform) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent('Circle Time Song Generator - ECCE Tool');
        let shareLink = '';
        switch(platform) {
            case 'facebook':
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'twitter':
                shareLink = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                break;
            case 'linkedin':
                shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
            case 'whatsapp':
                shareLink = `https://wa.me/?text=${title}%20${url}`;
                break;
            case 'email':
                shareLink = `mailto:?subject=${title}&body=Check%20out%20this%20tool%20${url}`;
                break;
        }
        if (shareLink) {
            window.open(shareLink, '_blank', 'width=600,height=400');
            incrementShare();
            showToast(`📤 Shared on ${platform}!`, 'success');
        }
    }

    function copyPageUrl() {
        navigator.clipboard.writeText(window.location.href).then(() => {
            incrementShare();
            showToast('🔗 Page link copied!', 'success');
        }).catch(() => {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = window.location.href;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            textarea.remove();
            incrementShare();
            showToast('🔗 Page link copied!', 'success');
        });
    }

    // ============================================================
    // SCROLL BUTTONS
    // ============================================================
    function initScrollButtons() {
        DOM.scrollUpBtn.style.display = 'none';
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                DOM.scrollUpBtn.style.display = 'flex';
            } else {
                DOM.scrollUpBtn.style.display = 'none';
            }
        });

        DOM.scrollUpBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        DOM.scrollDownBtn.addEventListener('click', () => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });
    }

    // ============================================================
    // BIND EVENTS
    // ============================================================
    function bindEvents() {
        DOM.generateBtn.addEventListener('click', generateSong);
        DOM.listenBtn.addEventListener('click', listenSong);
        DOM.saveFavBtn.addEventListener('click', saveFavorite);
        DOM.deleteFavBtn.addEventListener('click', deleteAllFavs);
        DOM.favSelect.addEventListener('change', (e) => {
            if (e.target.value !== '') {
                loadFavorite(parseInt(e.target.value));
            }
        });
        DOM.pdfBtn.addEventListener('click', exportPDF);
        DOM.wordBtn.addEventListener('click', exportWord);
        DOM.copyBtn.addEventListener('click', copySong);
        DOM.printBtn.addEventListener('click', printSong);
        DOM.pageShareBtn.addEventListener('click', copyPageUrl);
        DOM.language.addEventListener('change', generateSong);

        // Social share buttons
        document.querySelectorAll('.social-icon[data-platform]').forEach(el => {
            el.addEventListener('click', (e) => {
                const platform = el.dataset.platform;
                shareTool(platform);
            });
        });
    }

    // ============================================================
    // INITIALIZATION
    // ============================================================
    async function init() {
        console.log(`🚀 ${CONFIG.TOOL_NAME} initialized`);
        console.log(`📦 Tool Slug: ${CONFIG.TOOL_SLUG}`);
        console.log(`📁 Category: ${CONFIG.CATEGORY}`);
        console.log(`🔗 API Base: ${CONFIG.API_BASE}`);

        // Start typewriter
        typewriterEffect();

        // Populate categories
        populateCategories();

        // Load stats
        await loadStats();

        // Load favorites
        loadFavDropdown();

        // Bind events
        bindEvents();

        // Init scroll buttons
        initScrollButtons();

        // Generate initial song
        await generateSong();

        console.log('✅ Tool ready!');
    }

    // Start the app
    document.addEventListener('DOMContentLoaded', init);

})();
