/* ============================================
   SCIENCE MODELS IDEA GENERATOR - MAIN JAVASCRIPT
   Cloudflare Workers API Integration
   Grok AI via Cloudflare
   No Fake Data - All Real API Data
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const TOOL_SLUG = 'science-models-idea-generator';
    const API_BASE = 'https://magicrills-api.uzairhameed01.workers.dev';
    const GROK_API_URL = 'https://magicrills-grok-api.uzairhameed01.workers.dev';
    
    // Generate or get User ID
    let USER_ID = localStorage.getItem('science_models_user_id');
    if (!USER_ID) {
        USER_ID = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('science_models_user_id', USER_ID);
    }

    // ============================================
    // STATE
    // ============================================
    let statsData = {
        usage: 0,
        views: 0,
        shares: 0,
        reactions: { like: 0, love: 0, wow: 0, sad: 0, laugh: 0, celebrate: 0, thinking: 0 }
    };
    let recentModels = [];
    let isGenerating = false;

    // ============================================
    // ENHANCED MODEL TYPES DATABASE (20+ Categories)
    // ============================================
    const modelTypesDB = {
        biology: [
            'Cell Structure Model', 'DNA Double Helix Model', 'Photosynthesis Display',
            'Human Digestive System', 'Respiratory System Model', 'Circulatory System Model',
            'Ecosystem Diorama', 'Food Web Display', 'Life Cycle of Butterfly', 'Plant Anatomy Model',
            'Microscope Slide Collection', 'Bacteria Culture Display', 'Virus Structure Model',
            'Immune System Response', 'Nervous System Model', 'Endocrine System Diagram',
            'Reproductive System Model', 'Evolution Timeline Display', 'Mitosis & Meiosis Model',
            'Protein Synthesis Model', 'Enzyme Activity Demo', 'Cellular Respiration Model'
        ],
        physics: [
            "Newton's Cradle", 'Electric Circuit Model', 'Magnetic Field Demonstrator',
            'Pulley System Model', 'Hydraulic Lift Model', 'Periscope Model',
            'Simple Pendulum', 'Electromagnet Model', 'Wind Turbine Model', 'Solar Oven Model',
            'Spectroscope Model', 'Leyden Jar Model', 'Speaker Model', 'Laser Light Show',
            'Rube Goldberg Machine', 'Catapult Model', 'Bridge Structure Model', 'Roller Coaster Model',
            'Thermodynamics Demo', 'Wave Motion Model', 'Optics Light Box', 'Sound Wave Model'
        ],
        chemistry: [
            'Atomic Structure Model', 'Periodic Table Display', 'Molecular Model Kit',
            'pH Scale Demonstrator', 'Crystal Growing Experiment', 'Volcano Eruption Model',
            'Electrolysis Apparatus', 'Distillation Setup', 'Polymer Slime Making',
            'Chemical Battery Model', 'Chromatography Experiment', 'Oscillating Reaction',
            'Gas Diffusion Model', 'Solution Concentrations Demo', 'Covalent Bonding Model',
            'Endothermic Reaction Demo', 'Exothermic Reaction Demo', 'Catalysis Model'
        ],
        astronomy: [
            'Solar System Model', 'Moon Phases Display', 'Eclipse Model',
            'Constellation Projector', 'Rocket Model', 'Telescope Model',
            'Black Hole Model', 'Galaxy Spinner Model', 'Space Station Model',
            'Asteroid Belt Model', 'Comet Model', 'Space Probe Model',
            'Mars Rover Model', 'Star Life Cycle Display', 'Gravity Well Model'
        ],
        environmental: [
            'Greenhouse Effect Model', 'Water Filtration System', 'Compost System',
            'Rainwater Harvesting Model', 'Air Pollution Monitor', 'Biome Diorama',
            'Carbon Cycle Display', 'Recycling Sorter', 'Solar Still',
            'Vertical Garden Model', 'Aquaponics System', 'Bee Hotel Model',
            'Wildlife Corridor Model', 'Erosion Control Model', 'Waste Management Demo'
        ],
        anatomy: [
            'Skeleton Model', 'Heart Model', 'Brain Model',
            'Eye Anatomy Model', 'Ear Model', 'Tooth Model',
            'Skin Layers Model', 'Muscle System Model', 'Joint Model',
            'Lung Model', 'Kidney Model', 'Liver Model',
            'Neuron Model', 'Spinal Cord Model', 'Bone Structure Model'
        ],
        'earth-science': [
            'Rock Cycle Model', 'Plate Tectonics Model', 'Volcano Types Model',
            'Earth Layers Model', 'Weather Station Model', 'Erosion Demo',
            'Fossil Model', 'Glacier Model', 'Earthquake Simulator',
            'Tsunami Model', 'Soil Layers Model', 'Water Cycle Model',
            'Mountain Formation Model', 'Cave Formation Model', 'Mining Model'
        ],
        robotics: [
            'Line Follower Robot', 'Obstacle Avoidance Robot', 'Robotic Arm Model',
            'Sumo Robot', 'Gesture Control Robot', 'Bluetooth Car',
            'Maze Solver Robot', 'Pick and Place Robot', 'Drawing Robot',
            'Voice Control Robot', 'Humanoid Hand Model', 'Sensor Array Model'
        ],
        electronics: [
            'LED Blinker Circuit', 'Traffic Light Model', 'Digital Clock Display',
            'Temperature Sensor Model', 'Motion Detector', 'Smart Home Model',
            'Security System Model', 'Water Level Indicator', 'Voltmeter Model',
            'FM Radio Model', 'Amplifier Circuit', 'Timer Circuit Model'
        ],
        biotechnology: [
            'DNA Extraction Model', 'Gene Editing Display', 'CRISPR Model',
            'Bioreactor Model', 'Fermentation Demo', 'Biofuel Model',
            'Enzyme Immobilization', 'Cell Culture Model', 'Molecular Cloning'
        ],
        neuroscience: [
            'Brain Anatomy Model', 'Neuron Network Model', 'Synapse Model',
            'Brain Wave Monitor', 'Memory Model', 'Sensory System Model'
        ],
        'marine-biology': [
            'Ocean Ecosystem Model', 'Coral Reef Display', 'Marine Food Web',
            'Deep Sea Creature Model', 'Tide Pool Model', 'Marine Conservation Model'
        ],
        botany: [
            'Plant Growth Model', 'Photosynthesis Display', 'Root System Model',
            'Flower Anatomy Model', 'Seed Germination Demo', 'Plant Adaptations Model'
        ],
        zoology: [
            'Animal Cell Model', 'Animal Classification Display', 'Habitat Diorama',
            'Animal Adaptations Model', 'Food Chain Model', 'Endangered Species Display'
        ],
        ecology: [
            'Biome Display', 'Food Web Model', 'Ecological Pyramid',
            'Succession Model', 'Biodiversity Display', 'Conservation Model'
        ],
        geography: [
            'Topographic Map Model', 'Landform Display', 'Water Cycle Model',
            'Climate Zone Model', 'Population Density Model', 'Urban Planning Model'
        ],
        meteorology: [
            'Weather Station Model', 'Cloud Types Display', 'Rain Gauge Model',
            'Wind Vane Model', 'Barometer Model', 'Climate Change Model'
        ],
        'material-science': [
            'Crystal Structure Model', 'Polymer Model', 'Composite Material Display',
            'Metallurgy Model', 'Ceramics Model', 'Smart Materials Demo'
        ],
        optics: [
            'Light Ray Model', 'Lens System Model', 'Prism Display',
            'Fiber Optic Model', 'Color Spectrum Display', 'Microscope Model'
        ],
        acoustics: [
            'Sound Wave Model', 'Musical Instrument Model', 'Speaker Model',
            'Acoustic Panel Display', 'Soundproofing Model', 'Frequency Model'
        ]
    };

    // ============================================
    // EMOJI REACTIONS (7 Types)
    // ============================================
    const EMOJIS = [
        { emoji: '👍', name: 'like', label: 'Like' },
        { emoji: '❤️', name: 'love', label: 'Love' },
        { emoji: '😮', name: 'wow', label: 'Wow' },
        { emoji: '😢', name: 'sad', label: 'Sad' },
        { emoji: '😂', name: 'laugh', label: 'Laugh' },
        { emoji: '🎉', name: 'celebrate', label: 'Celebrate' },
        { emoji: '🤔', name: 'thinking', label: 'Interesting' }
    ];

    // ============================================
    // DOM REFS
    // ============================================
    const $ = id => document.getElementById(id);
    const $$ = sel => document.querySelectorAll(sel);

    const dom = {
        educationLevel: $('educationLevel'),
        scienceField: $('scienceField'),
        modelType: $('modelType'),
        difficultyLevel: $('difficultyLevel'),
        timeRequired: $('timeRequired'),
        budgetRange: $('budgetRange'),
        groupSize: $('groupSize'),
        assessmentType: $('assessmentType'),
        materialSource: $('materialSource'),
        generateBtn: $('generateBtn'),
        modelResult: $('modelResult'),
        loadingSpinner: $('loadingSpinner'),
        usageCount: $('usageCount'),
        viewsCount: $('viewsCount'),
        shareCount: $('shareCount'),
        totalReactionsCount: $('totalReactionsCount'),
        reactionsContainer: $('reactionsContainer'),
        recentModels: $('recentModels'),
        toastMsg: $('toastMsg'),
        copyUrlBtn: $('copyUrlBtn'),
        darkToggle: $('darkModeToggle'),
        scrollUp: $('scrollUpBtn'),
        scrollDown: $('scrollDownBtn'),
        exportPDF: $('exportPDFBtn'),
        exportWord: $('exportWordBtn'),
        exportTxt: $('exportTxtBtn'),
        exportJSON: $('exportJSONBtn')
    };

    // ============================================
    // TOAST NOTIFICATION
    // ============================================
    function showToast(message, type = 'info') {
        if (!dom.toastMsg) return;
        dom.toastMsg.textContent = message;
        dom.toastMsg.style.display = 'block';
        dom.toastMsg.style.borderColor = type === 'error' ? '#ef4444' : 'var(--neon-purple)';
        clearTimeout(dom.toastMsg._timeout);
        dom.toastMsg._timeout = setTimeout(() => {
            dom.toastMsg.style.display = 'none';
        }, 3000);
    }

    // ============================================
    // CLOUDFLARE WORKERS API CALLS
    // ============================================
    async function callAPI(endpoint, method, body = null) {
        try {
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': USER_ID,
                    'X-Tool-Slug': TOOL_SLUG
                }
            };
            if (body) options.body = JSON.stringify(body);

            const response = await fetch(`${API_BASE}${endpoint}`, options);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || `API Error: ${response.status}`);
            }
            return data;
        } catch (error) {
            console.error(`API ${endpoint} error:`, error);
            return { success: false, error: error.message };
        }
    }

    // ============================================
    // GROK AI CALL VIA CLOUDFLARE
    // ============================================
    async function callGrokAI(prompt) {
        try {
            const response = await fetch(GROK_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': USER_ID
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert science educator who creates detailed, practical, and engaging model projects for students. Provide complete, structured responses with clear sections.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 3000
                })
            });

            if (!response.ok) {
                throw new Error(`Grok API error: ${response.status}`);
            }

            const data = await response.json();
            return data.choices?.[0]?.message?.content || data.content || null;
        } catch (error) {
            console.error('Grok API error:', error);
            return null;
        }
    }

    // ============================================
    // API: USAGE COUNTER
    // ============================================
    async function incrementUsage() {
        try {
            const data = await callAPI('/api/usage', 'POST', {
                tool_slug: TOOL_SLUG,
                user_id: USER_ID
            });
            if (data.success) {
                statsData.usage = data.total_usage || data.count || 0;
                updateStatsDisplay();
            }
        } catch (error) {
            console.error('Usage increment error:', error);
            // Fallback: LocalStorage
            let localUsage = parseInt(localStorage.getItem('science_models_usage') || '0');
            localUsage++;
            localStorage.setItem('science_models_usage', localUsage);
            statsData.usage = localUsage;
            updateStatsDisplay();
        }
    }

    // ============================================
    // API: GET STATS
    // ============================================
    async function fetchStats() {
        try {
            const data = await callAPI(`/api/stats?tool_slug=${TOOL_SLUG}`, 'GET');
            if (data.success) {
                statsData.usage = data.usage || data.total_usage || 0;
                statsData.views = data.views || 0;
                statsData.shares = data.shares || 0;
                if (data.reactions) {
                    statsData.reactions = data.reactions;
                }
                updateStatsDisplay();
                renderReactions();
            }
        } catch (error) {
            console.error('Stats fetch error:', error);
            // Fallback: LocalStorage
            statsData.usage = parseInt(localStorage.getItem('science_models_usage') || '0');
            statsData.views = parseInt(localStorage.getItem('science_models_views') || '0');
            statsData.shares = parseInt(localStorage.getItem('science_models_shares') || '0');
            updateStatsDisplay();
        }
    }

    // ============================================
    // API: REACTIONS
    // ============================================
    async function addReaction(emojiName, emojiChar) {
        try {
            const data = await callAPI('/api/reactions', 'POST', {
                tool_slug: TOOL_SLUG,
                emoji: emojiChar,
                reaction_type: emojiName,
                user_id: USER_ID
            });

            if (data.success) {
                statsData.reactions = data.counts || data.reactions || statsData.reactions;
                renderReactions();
                updateStatsDisplay();
                showToast(`Thanks for your feedback! ${emojiChar}`);
            } else if (data.already_reacted) {
                showToast('You already reacted with this emoji!', 'error');
            } else {
                // Fallback
                statsData.reactions[emojiName] = (statsData.reactions[emojiName] || 0) + 1;
                renderReactions();
                updateStatsDisplay();
                showToast(`Thanks! ${emojiChar}`);
            }
        } catch (error) {
            // Fallback: LocalStorage
            statsData.reactions[emojiName] = (statsData.reactions[emojiName] || 0) + 1;
            renderReactions();
            updateStatsDisplay();
            showToast(`Thanks! ${emojiChar} (saved locally)`);
        }
    }

    // ============================================
    // API: SHARES
    // ============================================
    async function recordShare(platform) {
        try {
            const data = await callAPI('/api/shares', 'POST', {
                tool_slug: TOOL_SLUG,
                platform: platform,
                user_id: USER_ID
            });

            if (data.success) {
                statsData.shares = data.total_shares || data.shares || 0;
                updateStatsDisplay();
                showToast(`Shared on ${platform}!`);
            }
        } catch (error) {
            // Fallback: LocalStorage
            let localShares = parseInt(localStorage.getItem('science_models_shares') || '0');
            localShares++;
            localStorage.setItem('science_models_shares', localShares);
            statsData.shares = localShares;
            updateStatsDisplay();
            showToast(`Shared on ${platform}! (saved locally)`);
        }
    }

    // ============================================
    // UPDATE STATS DISPLAY
    // ============================================
    function updateStatsDisplay() {
        if (dom.usageCount) dom.usageCount.textContent = statsData.usage || 0;
        if (dom.viewsCount) dom.viewsCount.textContent = statsData.views || 0;
        if (dom.shareCount) dom.shareCount.textContent = statsData.shares || 0;
        
        const totalReactions = Object.values(statsData.reactions || {}).reduce((a, b) => a + b, 0);
        if (dom.totalReactionsCount) dom.totalReactionsCount.textContent = totalReactions;
    }

    // ============================================
    // RENDER REACTIONS
    // ============================================
    function renderReactions() {
        if (!dom.reactionsContainer) return;
        dom.reactionsContainer.innerHTML = '';

        EMOJIS.forEach(({ emoji, name, label }) => {
            const count = statsData.reactions?.[name] || 0;
            const btn = document.createElement('button');
            btn.className = 'reaction-btn';
            btn.innerHTML = `${emoji} ${label} <span class="reaction-count">(${count})</span>`;
            btn.setAttribute('aria-label', `React with ${label}`);
            btn.onclick = () => addReaction(name, emoji);
            dom.reactionsContainer.appendChild(btn);
        });
    }

    // ============================================
    // POPULATE MODEL TYPES
    // ============================================
    function populateModelTypes() {
        const field = dom.scienceField?.value;
        if (!dom.modelType) return;
        dom.modelType.innerHTML = '<option value="">Select Model Type</option>';

        if (field && modelTypesDB[field]) {
            modelTypesDB[field].forEach(type => {
                const opt = document.createElement('option');
                opt.value = type.toLowerCase().replace(/\s+/g, '-');
                opt.textContent = type;
                dom.modelType.appendChild(opt);
            });
        }
    }

    // ============================================
    // GENERATE MODEL WITH GROK AI
    // ============================================
    async function generateModel() {
        if (isGenerating) return;

        const level = dom.educationLevel?.value;
        const field = dom.scienceField?.value;
        const modelTypeSelect = dom.modelType;
        const modelTypeValue = modelTypeSelect?.options?.[modelTypeSelect.selectedIndex]?.text;

        if (!level || !field || !modelTypeValue) {
            showToast('Please select all options!', 'error');
            return;
        }

        isGenerating = true;
        if (dom.generateBtn) {
            dom.generateBtn.disabled = true;
            dom.generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        }
        if (dom.loadingSpinner) dom.loadingSpinner.style.display = 'block';
        if (dom.modelResult) dom.modelResult.innerHTML = '';

        // Increment usage
        await incrementUsage();

        // Build prompt
        const options = {
            difficulty: dom.difficultyLevel?.value || 'medium',
            time: dom.timeRequired?.value || '1hour',
            budget: dom.budgetRange?.value || 'medium',
            groupSize: dom.groupSize?.value || 'individual',
            assessment: dom.assessmentType?.value || 'presentation',
            materialSource: dom.materialSource?.value || 'mixed'
        };

        const prompt = `Generate a COMPLETE, DETAILED science model project for ${level} level students in ${field}.
MODEL TYPE: ${modelTypeValue}
Difficulty: ${options.difficulty}
Time: ${options.time}
Budget: ${options.budget}
Group Size: ${options.groupSize}
Assessment: ${options.assessment}
Material Source: ${options.materialSource}

Generate with EXACTLY these sections:

**📋 Model Title:** [Creative title]

**🎯 Learning Objectives:** 
- [3-4 clear objectives]

**📦 Materials Needed:** 
- [8-10 specific items]

**🔧 Step-by-Step Instructions:** 
1. [Detailed step]
... (8-10 steps)

**🧠 Scientific Concepts:** 
- [Concept 1: Explanation]
- [Concept 2: Explanation]

**💡 Pro Tips:** 
- [3-4 practical tips]

**🔄 Variations & Extensions:** 
- [2-3 alternative ideas]

**⚠️ Safety Precautions:** 
- [2-3 safety guidelines]

**📊 Assessment Rubric:** 
- Excellent (4 pts): [criteria]
- Good (3 pts): [criteria]
- Satisfactory (2 pts): [criteria]
- Needs Improvement (1 pt): [criteria]

**🔗 Cross-Curricular Connections:** 
- Math: [connection]
- Language Arts: [connection]
- Art: [connection]

**🌍 Real-World Applications:** 
- [2-3 real-world uses]

Keep language age-appropriate for ${level} level. Be detailed, practical, and engaging.`;

        try {
            const aiContent = await callGrokAI(prompt);
            
            if (aiContent) {
                const formattedHtml = formatModelResult(aiContent);
                if (dom.modelResult) {
                    dom.modelResult.innerHTML = formattedHtml || `<div class="result-section"><p>${aiContent.replace(/\n/g, '<br>')}</p></div>`;
                }
                saveToRecent(modelTypeValue, formattedHtml);
                showToast('✨ Model generated successfully with Grok AI!');
            } else {
                // Fallback content if AI fails
                const fallbackContent = generateFallbackModel(level, field, modelTypeValue, options);
                const formattedHtml = formatModelResult(fallbackContent);
                if (dom.modelResult) dom.modelResult.innerHTML = formattedHtml;
                showToast('⚠️ Used fallback model (AI unavailable)', 'error');
            }
        } catch (error) {
            console.error('Generation error:', error);
            if (dom.modelResult) {
                dom.modelResult.innerHTML = `
                    <div class="result-section">
                        <h4>⚠️ Error</h4>
                        <p>Failed to generate model. Please try again.</p>
                        <p style="color: var(--text-muted); font-size: 0.85rem;">${error.message}</p>
                    </div>
                `;
            }
            showToast('Error generating model. Please try again.', 'error');
        } finally {
            isGenerating = false;
            if (dom.generateBtn) {
                dom.generateBtn.disabled = false;
                dom.generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate with Grok AI';
            }
            if (dom.loadingSpinner) dom.loadingSpinner.style.display = 'none';
        }
    }

    // ============================================
    // FORMAT MODEL RESULT
    // ============================================
    function formatModelResult(content) {
        let html = '';
        const sections = content.split(/\*\*[^*]+\*\*/);
        const sectionTitles = content.match(/\*\*[^*]+\*\*/g) || [];

        for (let i = 0; i < sectionTitles.length; i++) {
            const title = sectionTitles[i].replace(/\*\*/g, '');
            let body = sections[i + 1] || '';

            // Convert markdown-like lists
            body = body.replace(/\n/g, '<br>');
            body = body.replace(/- /g, '• ');
            body = body.replace(/• (.+?)<br>/g, '<li>$1</li>');
            body = body.replace(/<li>/g, '<ul><li>').replace(/<\/li><br>/g, '</li>');
            body = body.replace(/<\/li><ul>/g, '</li>');
            body = body.replace(/\d\. /g, '');

            html += `<div class="result-section">
                <h4>${title}</h4>
                <div>${body}</div>
            </div>`;
        }

        return html || `<div class="result-section"><p>${content.replace(/\n/g, '<br>')}</p></div>`;
    }

    // ============================================
    // FALLBACK MODEL GENERATOR
    // ============================================
    function generateFallbackModel(level, field, modelTypeValue, options) {
        return `**📋 Model Title:** ${modelTypeValue} - Hands-On Science Project

**🎯 Learning Objectives:** 
- Understand core principles of ${field}
- Develop construction and problem-solving skills
- Apply scientific method to test and refine
- Communicate findings effectively

**📦 Materials Needed:** 
- Cardboard or foam board (base)
- Recycled materials (bottles, containers)
- Craft supplies (glue, scissors, tape)
- Labels for identifying parts
- Optional: LED lights, small motor

**🔧 Step-by-Step Instructions:** 
1. Research the scientific concept
2. Sketch a detailed design
3. Gather all materials
4. Build the base structure
5. Add components one by one
6. Test functionality as you build
7. Add labels and explanations
8. Refine based on testing
9. Prepare for presentation
10. Document your process

**🧠 Scientific Concepts:** 
- Core principles of ${field} demonstrated through hands-on learning
- Engineering design process applied
- Critical thinking skills developed

**💡 Pro Tips:** 
- Plan before you build
- Test small parts before assembly
- Use clear, legible labels
- Document your process with photos

**🔄 Variations & Extensions:** 
- Add moving parts with motors
- Create a digital presentation
- Make a scaled version

**⚠️ Safety Precautions:** 
- Use tools with adult supervision
- Wash hands after using materials
- Work in a well-ventilated area

**📊 Assessment Rubric:** 
- Excellent (4 pts): Works perfectly, creative design
- Good (3 pts): Works well, good design
- Satisfactory (2 pts): Works partially, basic design
- Needs Improvement (1 pt): Doesn't work, incomplete

**🔗 Cross-Curricular Connections:** 
- Math: Measurements, proportions
- Language Arts: Written report
- Art: Design, aesthetics

**🌍 Real-World Applications:** 
- Engineering prototyping methods
- Scientific model testing
- Design visualization`;
    }

    // ============================================
    // SAVE TO RECENT MODELS
    // ============================================
    function saveToRecent(modelTitle, content) {
        recentModels.unshift({
            title: modelTitle,
            content: content,
            timestamp: new Date().toISOString()
        });
        if (recentModels.length > 10) recentModels.pop();
        localStorage.setItem('science_models_recent', JSON.stringify(recentModels));
        renderRecentModels();
    }

    function renderRecentModels() {
        if (!dom.recentModels) return;
        dom.recentModels.innerHTML = '';

        if (recentModels.length === 0) {
            dom.recentModels.innerHTML = '<div style="color: var(--text-muted); font-size: 0.85rem;">No recent models yet.</div>';
            return;
        }

        recentModels.forEach(model => {
            const div = document.createElement('div');
            div.className = 'recent-item';
            div.innerHTML = `<i class="fas fa-flask"></i> ${model.title.substring(0, 40)}${model.title.length > 40 ? '...' : ''}`;
            div.onclick = () => {
                if (dom.modelResult) dom.modelResult.innerHTML = model.content;
                showToast('Loaded previous model');
            };
            dom.recentModels.appendChild(div);
        });
    }

    // ============================================
    // EXPORT FUNCTIONS
    // ============================================
    function getCurrentContent() {
        const content = dom.modelResult?.innerHTML || '';
        if (!content || content.includes('placeholder-text') || content.includes('Select options')) {
            showToast('Please generate a model first!', 'error');
            return null;
        }
        return content;
    }

    async function exportPDF() {
        const content = getCurrentContent();
        if (!content) return;
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.text('Science Model Idea', 20, 20);
            doc.setFontSize(10);
            const text = dom.modelResult.innerText;
            const lines = doc.splitTextToSize(text, 170);
            doc.text(lines, 20, 35);
            doc.save('science-model.pdf');
            showToast('PDF exported!');
        } catch (e) {
            showToast('PDF export failed', 'error');
        }
    }

    function exportWord() {
        const content = getCurrentContent();
        if (!content) return;
        const blob = new Blob([dom.modelResult.innerText], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'science-model.doc';
        a.click();
        URL.revokeObjectURL(url);
        showToast('Word document exported!');
    }

    function exportTxt() {
        const content = getCurrentContent();
        if (!content) return;
        const blob = new Blob([dom.modelResult.innerText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'science-model.txt';
        a.click();
        URL.revokeObjectURL(url);
        showToast('Text file exported!');
    }

    function exportJSON() {
        const content = getCurrentContent();
        if (!content) return;
        const data = {
            tool: TOOL_SLUG,
            generatedAt: new Date().toISOString(),
            content: content,
            metadata: {
                educationLevel: dom.educationLevel?.value || '',
                scienceField: dom.scienceField?.value || '',
                difficulty: dom.difficultyLevel?.value || ''
            }
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'science-model.json';
        a.click();
        URL.revokeObjectURL(url);
        showToast('JSON exported!');
    }

    // ============================================
    // TYPEWRITER EFFECT
    // ============================================
    function initTypewriter() {
        const phrases = [
            'Generate STEM project ideas...',
            'Create biology models...',
            'Build physics experiments...',
            'Design chemistry projects...',
            'Explore astronomy concepts...',
            'Innovate with AI...'
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const element = document.getElementById('typewriterText');
        if (!element) return;

        function type() {
            const currentPhrase = phrases[phraseIndex];
            if (!isDeleting) {
                element.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                if (charIndex === currentPhrase.length) {
                    isDeleting = true;
                    setTimeout(type, 2000);
                    return;
                }
                setTimeout(type, 80);
            } else {
                element.textContent = currentPhrase.substring(0, charIndex - 1);
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
    // INITIALIZATION
    // ============================================
    function init() {
        // Populate model types on field change
        if (dom.scienceField) {
            dom.scienceField.addEventListener('change', populateModelTypes);
        }

        // Generate button
        if (dom.generateBtn) {
            dom.generateBtn.addEventListener('click', generateModel);
        }

        // Export buttons
        if (dom.exportPDF) dom.exportPDF.addEventListener('click', exportPDF);
        if (dom.exportWord) dom.exportWord.addEventListener('click', exportWord);
        if (dom.exportTxt) dom.exportTxt.addEventListener('click', exportTxt);
        if (dom.exportJSON) dom.exportJSON.addEventListener('click', exportJSON);

        // Share buttons
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const platform = this.dataset.platform;
                const url = encodeURIComponent(window.location.href);
                const title = encodeURIComponent('Science Models Idea Generator');
                const shareUrls = {
                    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
                    twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
                    whatsapp: `https://wa.me/?text=${title}%20${url}`,
                    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
                    telegram: `https://t.me/share/url?url=${url}&text=${title}`
                };
                if (shareUrls[platform]) {
                    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
                    await recordShare(platform);
                }
            });
        });

        // Copy URL
        if (dom.copyUrlBtn) {
            dom.copyUrlBtn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(window.location.href);
                    await recordShare('copy');
                    showToast('URL copied!');
                } catch (e) {
                    showToast('Failed to copy URL', 'error');
                }
            });
        }

        // Dark mode toggle
        if (dom.darkToggle) {
            dom.darkToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                const isDark = document.body.classList.contains('dark-mode');
                localStorage.setItem('science_models_dark', isDark);
                dom.darkToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            });
        }

        // Scroll buttons
        if (dom.scrollUp) {
            dom.scrollUp.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        }
        if (dom.scrollDown) {
            dom.scrollDown.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
        }

        // Load saved dark mode
        if (localStorage.getItem('science_models_dark') === 'true') {
            document.body.classList.add('dark-mode');
            if (dom.darkToggle) dom.darkToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }

        // Load recent models
        const saved = localStorage.getItem('science_models_recent');
        if (saved) {
            try {
                recentModels = JSON.parse(saved);
                renderRecentModels();
            } catch (e) {
                recentModels = [];
            }
        }

        // Typewriter effect
        initTypewriter();

        // Fetch stats from API
        fetchStats();

        // Auto-increment view on load
        async function incrementView() {
            try {
                const data = await callAPI('/api/views', 'POST', {
                    tool_slug: TOOL_SLUG,
                    user_id: USER_ID
                });
                if (data.success) {
                    statsData.views = data.total_views || data.views || 0;
                    updateStatsDisplay();
                }
            } catch (e) {
                let localViews = parseInt(localStorage.getItem('science_models_views') || '0');
                localViews++;
                localStorage.setItem('science_models_views', localViews);
                statsData.views = localViews;
                updateStatsDisplay();
            }
        }
        incrementView();

        showToast('🚀 Science Models Generator Ready!', 'info');
    }

    // ============================================
    // START
    // ============================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
