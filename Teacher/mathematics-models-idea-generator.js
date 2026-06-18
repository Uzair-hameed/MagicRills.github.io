// ============================================
// MATHEMATICS MODELS IDEA GENERATOR - MAIN JS
// FULLY INTEGRATED WITH GROK AI + TiDB
// ============================================

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    TOOL_SLUG: 'mathematics-models-idea-generator',
    API_BASE: '/api',
    GROK_API_URL: 'https://api.x.ai/v1/chat/completions',
    GROK_API_KEY: '', // Add your xAI API key here
    USE_GROK: true,
    DEFAULT_MODEL: 'grok-2-latest',
    ENABLE_CACHE: true,
    CACHE_DURATION: 7 * 24 * 60 * 60 * 1000
};

// User ID
let currentUserId = localStorage.getItem('userId') || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
localStorage.setItem('userId', currentUserId);

// State
let isDarkMode = localStorage.getItem('darkMode') === 'true';
let reactionsData = { like: 0, love: 0, wow: 0, sad: 0, laugh: 0, celebrate: 0 };
let userReactions = JSON.parse(localStorage.getItem(`${CONFIG.TOOL_SLUG}_user_reactions`) || '{}');
let generatedModels = [];
let currentDraft = null;
let assessmentChart = null;
let isGenerating = false;

// ============================================
// 15 ASSESSMENT CRITERIA
// ============================================

const CRITERIA = [
    { id: 'accuracy', name: 'Mathematical Accuracy', weight: 2.0, maxScore: 10, description: 'Correct application of mathematical concepts' },
    { id: 'understanding', name: 'Conceptual Understanding', weight: 1.5, maxScore: 10, description: 'Depth of understanding of the topic' },
    { id: 'construction', name: 'Model Construction Quality', weight: 1.5, maxScore: 10, description: 'Neatness, durability, and precision' },
    { id: 'creativity', name: 'Creativity & Innovation', weight: 1.5, maxScore: 10, description: 'Original ideas and creative approach' },
    { id: 'presentation', name: 'Presentation & Explanation', weight: 1.0, maxScore: 10, description: 'Clarity and confidence in explaining' },
    { id: 'material', name: 'Material Usage (Low-cost)', weight: 1.0, maxScore: 10, description: 'Effective use of available/recycled materials' },
    { id: 'effort', name: 'Effort & Hard Work', weight: 1.0, maxScore: 10, description: 'Visible effort and dedication' },
    { id: 'originality', name: 'Originality', weight: 1.0, maxScore: 10, description: 'Unique approach and personal touch' },
    { id: 'problemSolving', name: 'Problem Solving Skills', weight: 1.5, maxScore: 10, description: 'Ability to solve related problems' },
    { id: 'application', name: 'Real-World Application', weight: 1.0, maxScore: 10, description: 'Connection to real-life situations' },
    { id: 'collaboration', name: 'Collaboration & Teamwork', weight: 1.0, maxScore: 10, description: 'Working effectively with others' },
    { id: 'timeManagement', name: 'Time Management', weight: 1.0, maxScore: 10, description: 'Submission within deadline' },
    { id: 'documentation', name: 'Documentation & Labels', weight: 1.0, maxScore: 10, description: 'Proper labeling and written work' },
    { id: 'aesthetics', name: 'Aesthetics & Design', weight: 0.5, maxScore: 10, description: 'Visual appeal and design quality' },
    { id: 'functionality', name: 'Functionality & Working', weight: 1.5, maxScore: 10, description: 'Model works as intended' }
];

// ============================================
// DOM ELEMENTS
// ============================================

const DOM = {
    heroUsageCount: document.getElementById('heroUsageCount'),
    themeToggle: document.getElementById('themeToggle'),
    homeBtn: document.getElementById('homeBtn'),
    backBtn: document.getElementById('backBtn'),
    usageCount: document.getElementById('usageCount'),
    educationLevel: document.getElementById('educationLevel'),
    mathCategory: document.getElementById('mathCategory'),
    specificTopic: document.getElementById('specificTopic'),
    complexityLevel: document.getElementById('complexityLevel'),
    modelCount: document.getElementById('modelCount'),
    generateBtn: document.getElementById('generateBtn'),
    randomBtn: document.getElementById('randomBtn'),
    clearBtn: document.getElementById('clearBtn'),
    saveDraftBtn: document.getElementById('saveDraftBtn'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    resultsContainer: document.getElementById('resultsContainer'),
    modelContent: document.getElementById('modelContent'),
    exportPDFBtn: document.getElementById('exportPDFBtn'),
    exportDocBtn: document.getElementById('exportDocBtn'),
    exportTxtBtn: document.getElementById('exportTxtBtn'),
    copyBtn: document.getElementById('copyBtn'),
    reactionsContainer: document.getElementById('reactionsContainer'),
    shareCount: document.getElementById('shareCount'),
    openAssessmentBtn: document.getElementById('openAssessmentBtn'),
    openAssessmentBtn2: document.getElementById('openAssessmentBtn2'),
    assessmentModal: document.getElementById('assessmentModal'),
    assessmentModalBody: document.getElementById('assessmentModalBody'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    premiumModal: document.getElementById('premiumModal'),
    closePremiumModal: document.getElementById('closePremiumModal'),
    scrollUpBtn: document.getElementById('scrollUpBtn'),
    scrollDownBtn: document.getElementById('scrollDownBtn'),
    toastContainer: document.getElementById('toastContainer'),
    floatingNotification: document.getElementById('floatingNotification'),
    notificationText: document.getElementById('notificationText')
};

// ============================================
// TOAST & NOTIFICATIONS
// ============================================

function showToast(message, type = 'info', duration = 3000) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${message}`;
    DOM.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function showFloatingNotification(message, duration = 5000) {
    DOM.notificationText.textContent = message;
    DOM.floatingNotification.style.display = 'flex';
    DOM.floatingNotification.style.opacity = '1';
    
    clearTimeout(DOM.floatingNotification._timeout);
    DOM.floatingNotification._timeout = setTimeout(() => {
        DOM.floatingNotification.style.opacity = '0';
        setTimeout(() => {
            DOM.floatingNotification.style.display = 'none';
        }, 300);
    }, duration);
}

// ============================================
// LOADING
// ============================================

function showLoading() {
    DOM.loadingSpinner.style.display = 'block';
    DOM.resultsContainer.style.display = 'none';
    isGenerating = true;
}

function hideLoading() {
    DOM.loadingSpinner.style.display = 'none';
    DOM.resultsContainer.style.display = 'block';
    isGenerating = false;
}

// ============================================
// API CALLS - TiDB
// ============================================

async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-User-Id': currentUserId
            }
        };
        if (data) options.body = JSON.stringify(data);
        
        const response = await fetch(`${CONFIG.API_BASE}/${CONFIG.TOOL_SLUG}${endpoint}`, options);
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

async function incrementUsage() {
    const result = await apiCall('/usage', 'POST', { user_id: currentUserId });
    if (result && result.total_usage) {
        DOM.usageCount.textContent = result.total_usage;
        if (DOM.heroUsageCount) DOM.heroUsageCount.textContent = result.total_usage;
        return result.total_usage;
    }
    return 0;
}

async function getUsage() {
    const result = await apiCall('/usage', 'GET');
    if (result && result.count) {
        DOM.usageCount.textContent = result.count;
        if (DOM.heroUsageCount) DOM.heroUsageCount.textContent = result.count;
        return result.count;
    }
    return 0;
}

async function addReaction(emoji) {
    if (userReactions[emoji]) {
        showToast('You already reacted with this emoji!', 'info');
        return false;
    }
    
    const result = await apiCall('/reactions', 'POST', { emoji, user_id: currentUserId });
    
    if (result && result.success !== false) {
        userReactions[emoji] = true;
        localStorage.setItem(`${CONFIG.TOOL_SLUG}_user_reactions`, JSON.stringify(userReactions));
        if (result.counts) {
            reactionsData = result.counts;
        }
        updateReactionUI();
        showToast('Thanks for your feedback!', 'success');
        return true;
    }
    
    // Fallback
    if (!userReactions[emoji]) {
        userReactions[emoji] = true;
        localStorage.setItem(`${CONFIG.TOOL_SLUG}_user_reactions`, JSON.stringify(userReactions));
        const emojiMap = { '👍': 'like', '❤️': 'love', '😮': 'wow', '😢': 'sad', '😂': 'laugh', '🎉': 'celebrate' };
        reactionsData[emojiMap[emoji]] = (reactionsData[emojiMap[emoji]] || 0) + 1;
        updateReactionUI();
        showToast('Thanks for your feedback!', 'success');
        return true;
    }
    return false;
}

async function getReactions() {
    const result = await apiCall('/reactions', 'GET');
    if (result && result.reactions) {
        reactionsData = result.reactions;
        updateReactionUI();
        return reactionsData;
    }
    return reactionsData;
}

async function addShare(platform) {
    const result = await apiCall('/shares', 'POST', { platform, user_id: currentUserId });
    if (result && result.success) {
        const current = parseInt(DOM.shareCount.textContent) || 0;
        DOM.shareCount.textContent = current + 1;
        showToast(`Shared on ${platform}!`, 'success');
        return true;
    }
    return false;
}

async function getShares() {
    const result = await apiCall('/shares', 'GET');
    if (result && result.shares) {
        DOM.shareCount.textContent = result.shares;
        return result.shares;
    }
    return 0;
}

// ============================================
// GROK AI - FULL GENERATION
// ============================================

async function generateWithGrok(gradeLevel, category, topic, complexity, count) {
    if (!CONFIG.GROK_API_KEY) {
        console.warn('⚠️ Grok API key not set. Please add your xAI API key.');
        return null;
    }
    
    const gradeLabels = {
        'primary': 'Primary (Grades 1-5) - Young learners, basic concepts',
        'middle': 'Middle (Grades 6-8) - Pre-teens, intermediate concepts',
        'secondary': 'Secondary (Grades 9-10) - Teenagers, advanced concepts',
        'higher-secondary': 'Higher Secondary (Grades 11-12) - Young adults, complex concepts'
    };
    
    const categoryDescriptions = {
        'arithmetic': 'Arithmetic, number sense, basic operations',
        'geometry': 'Geometry, shapes, spatial reasoning',
        'algebra': 'Algebra, equations, patterns',
        'measurement': 'Measurement, units, data handling',
        'fractions': 'Fractions, decimals, percentages',
        'probability': 'Probability, statistics, data analysis',
        'trigonometry': 'Trigonometry, angles, triangles',
        'calculus': 'Calculus, limits, derivatives, integrals'
    };
    
    const complexityDesc = {
        'basic': 'simple models using basic materials, easy to understand',
        'intermediate': 'moderate complexity, some guidance needed',
        'advanced': 'complex models, detailed instructions, requires adult supervision'
    };
    
    const prompt = `Generate ${count} detailed mathematics model ideas for ${gradeLabels[gradeLevel] || gradeLevel}.
    
Category: ${categoryDescriptions[category] || category}
${topic ? `Specific Topic: ${topic}` : 'Choose appropriate topics within the category'}
Complexity: ${complexityDesc[complexity] || 'intermediate'}

For EACH model, provide a COMPLETE and DETAILED response with these sections:

📌 TOPIC: [Clear, engaging title for the model]

💡 CREATIVE IDEAS: [List 4-5 creative variations or approaches for this model]

🎯 LEARNING OBJECTIVES: [List 4-5 specific learning outcomes]

📦 MATERIALS (Low-Cost/No-Cost): 
- List all materials needed
- Provide alternatives for each material
- Mark which items are free/available at home

🔧 STEP-BY-STEP PROCESS:
- Step 1: [Detailed first step]
- Step 2: [Detailed second step]
- Continue for all steps (8-10 steps minimum)
- Include safety tips and warnings where needed

⚖️ MATHEMATICAL PRINCIPLE:
- Explain the core mathematical concept
- Show the formula or theorem
- Explain why this principle works
- Provide a real-world example

📋 SUMMARY OF ASSEMBLY:
- Estimated time: [X] minutes
- Difficulty level: [Easy/Medium/Hard]
- Key tips for success
- Common mistakes to avoid

🎯 EXTENSION ACTIVITIES:
- 2-3 ways to extend the activity
- How to make it more challenging
- Cross-curricular connections

Format each model clearly with emojis and proper headings. Make the content age-appropriate and engaging. Use simple language for primary levels and more technical language for higher levels.`;

    try {
        console.log('🚀 Sending request to Grok AI...');
        
        const response = await fetch(CONFIG.GROK_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CONFIG.GROK_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: CONFIG.DEFAULT_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: `You are a master mathematics educator with 30 years of experience. You specialize in creating engaging, hands-on mathematics models for students of all levels. Your responses are detailed, practical, and inspiring. You always provide complete, actionable information.`
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.8,
                max_tokens: 3000,
                top_p: 0.9
            })
        });
        
        if (!response.ok) {
            const errorData = await response.text();
            console.error('❌ Grok API Error:', response.status, errorData);
            throw new Error(`Grok API returned ${response.status}: ${errorData}`);
        }
        
        const data = await response.json();
        console.log('✅ Grok API response received!');
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content;
        } else {
            throw new Error('Invalid response format from Grok');
        }
        
    } catch (error) {
        console.error('❌ Grok API Error:', error);
        return null;
    }
}

// ============================================
// PARSE AI RESPONSE INTO MODEL CARDS
// ============================================

function parseAIResponseToHtml(content) {
    if (!content) return null;
    
    // Clean up the content
    let html = content;
    
    // Split into models if multiple
    const modelSplit = html.split(/(?=📌 TOPIC:|📌 Model|Model \d+:|Model \d+\.)/i);
    let models = [];
    
    if (modelSplit.length > 1) {
        models = modelSplit.filter(m => m.trim().length > 20);
    } else {
        // Try to find model sections
        const modelRegex = /📌 TOPIC:.*?(?=📌 TOPIC:|$)/gs;
        const matches = html.match(modelRegex);
        if (matches && matches.length > 0) {
            models = matches;
        } else {
            models = [html];
        }
    }
    
    // Build HTML
    let resultHtml = '';
    let modelIndex = 0;
    
    for (let modelText of models) {
        modelIndex++;
        if (modelText.trim().length < 50) continue;
        
        // Extract sections with improved regex
        const sections = {
            topic: modelText.match(/📌 TOPIC:?\s*([^\n]+)/i),
            ideas: modelText.match(/💡 CREATIVE IDEAS:?\s*([\s\S]*?)(?=🎯 LEARNING|📌|$)/i),
            objectives: modelText.match(/🎯 LEARNING OBJECTIVES:?\s*([\s\S]*?)(?=📦 MATERIALS|📌|$)/i),
            materials: modelText.match(/📦 MATERIALS[^:]*:?\s*([\s\S]*?)(?=🔧 STEP-BY-STEP|📌|$)/i),
            process: modelText.match(/🔧 STEP-BY-STEP PROCESS:?\s*([\s\S]*?)(?=⚖️ MATHEMATICAL|📌|$)/i),
            principle: modelText.match(/⚖️ MATHEMATICAL PRINCIPLE:?\s*([\s\S]*?)(?=📋 SUMMARY|🎯 EXTENSION|📌|$)/i),
            summary: modelText.match(/📋 SUMMARY OF ASSEMBLY:?\s*([\s\S]*?)(?=🎯 EXTENSION|📌|$)/i),
            extension: modelText.match(/🎯 EXTENSION ACTIVITIES:?\s*([\s\S]*?)(?=📌|$)/i)
        };
        
        // Clean and format each section
        const cleanSection = (text) => {
            if (!text) return '';
            return text
                .replace(/^[📌💡🎯📦🔧⚖️📋]/g, '')
                .replace(/^\s*[-*•]\s*/gm, '• ')
                .replace(/\n{3,}/g, '\n\n')
                .trim();
        };
        
        const formatList = (text) => {
            if (!text) return '';
            const lines = text.split('\n').filter(l => l.trim());
            if (lines.length === 0) return text;
            let html = '<ul>';
            for (let line of lines) {
                const clean = line.replace(/^[-*•]\s*/, '').trim();
                if (clean) html += `<li>${clean}</li>`;
            }
            html += '</ul>';
            return html;
        };
        
        const topic = sections.topic ? sections.topic[1].trim() : `Model ${modelIndex}`;
        const ideas = cleanSection(sections.ideas ? sections.ideas[1] : '');
        const objectives = cleanSection(sections.objectives ? sections.objectives[1] : '');
        const materials = cleanSection(sections.materials ? sections.materials[1] : '');
        const process = cleanSection(sections.process ? sections.process[1] : '');
        const principle = cleanSection(sections.principle ? sections.principle[1] : '');
        const summary = cleanSection(sections.summary ? sections.summary[1] : '');
        const extension = cleanSection(sections.extension ? sections.extension[1] : '');
        
        resultHtml += `
<div class="model-card" data-model="${modelIndex}">
    <div class="model-title">📌 ${topic}</div>
    
    ${ideas ? `
    <div class="model-section">
        <h5>💡 Creative Ideas</h5>
        ${formatList(ideas)}
    </div>
    ` : ''}
    
    ${objectives ? `
    <div class="model-section">
        <h5>🎯 Learning Objectives</h5>
        ${formatList(objectives)}
    </div>
    ` : ''}
    
    ${materials ? `
    <div class="model-section">
        <h5>📦 Materials (Low-Cost/No-Cost)</h5>
        ${formatList(materials)}
    </div>
    ` : ''}
    
    ${process ? `
    <div class="model-section">
        <h5>🔧 Step-by-Step Process</h5>
        ${formatList(process)}
    </div>
    ` : ''}
    
    ${principle ? `
    <div class="model-section">
        <h5>⚖️ Mathematical Principle</h5>
        ${formatList(principle)}
    </div>
    ` : ''}
    
    ${summary ? `
    <div class="model-section">
        <h5>📋 Summary of Assembly</h5>
        ${formatList(summary)}
    </div>
    ` : ''}
    
    ${extension ? `
    <div class="model-section">
        <h5>🎯 Extension Activities</h5>
        ${formatList(extension)}
    </div>
    ` : ''}
    
    <div class="model-actions">
        <button class="btn-outline model-detail-btn" onclick="showModelDetail(${modelIndex})">
            <i class="fas fa-expand"></i> View Full Details
        </button>
    </div>
</div>
        `;
    }
    
    return resultHtml;
}

// ============================================
// GENERATE MODEL IDEAS - MAIN FUNCTION
// ============================================

async function generateModelIdeas() {
    // Don't generate if already generating
    if (isGenerating) {
        showToast('Already generating, please wait...', 'warning');
        return;
    }
    
    const educationLevel = DOM.educationLevel.value;
    const mathCategory = DOM.mathCategory.value;
    const specificTopic = DOM.specificTopic.value.trim();
    const complexity = DOM.complexityLevel.value;
    const modelCount = parseInt(DOM.modelCount.value) || 3;
    
    if (!educationLevel) {
        showToast('Please select a Grade Level', 'error');
        DOM.educationLevel.focus();
        return;
    }
    
    if (!mathCategory) {
        showToast('Please select a Mathematics Category', 'error');
        DOM.mathCategory.focus();
        return;
    }
    
    showLoading();
    showToast('Generating models with Grok AI...', 'info');
    showFloatingNotification('🧠 AI is creating detailed mathematics models...');
    
    try {
        let content = null;
        
        // Try Grok API
        if (CONFIG.USE_GROK && CONFIG.GROK_API_KEY) {
            content = await generateWithGrok(
                educationLevel,
                mathCategory,
                specificTopic,
                complexity,
                modelCount
            );
        }
        
        // If Grok failed or returned null, use fallback
        if (!content) {
            if (CONFIG.GROK_API_KEY) {
                showToast('⚠️ Grok API failed, using fallback models', 'warning');
            } else {
                showToast('ℹ️ Please add your Grok API key for AI generation', 'info');
            }
            content = generateFallbackModels(educationLevel, mathCategory, specificTopic, complexity, modelCount);
        }
        
        // Parse and display
        const parsedHtml = parseAIResponseToHtml(content);
        if (parsedHtml) {
            DOM.modelContent.innerHTML = parsedHtml;
            DOM.resultsContainer.style.display = 'block';
            await incrementUsage();
            saveDraft();
            showToast('✅ Models generated successfully!', 'success');
            showFloatingNotification('✨ Models ready! Scroll to view details.');
            
            // Scroll to results
            setTimeout(() => {
                DOM.resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 500);
        } else {
            throw new Error('Failed to parse AI response');
        }
        
    } catch (error) {
        console.error('❌ Generation error:', error);
        showToast('Error generating models. Please try again.', 'error');
        
        // Show fallback
        const fallback = generateFallbackModels(educationLevel, mathCategory, specificTopic, complexity, modelCount);
        const parsedFallback = parseAIResponseToHtml(fallback);
        if (parsedFallback) {
            DOM.modelContent.innerHTML = parsedFallback;
            DOM.resultsContainer.style.display = 'block';
        }
    }
    
    hideLoading();
}

// ============================================
// DETAILED FALLBACK MODELS
// ============================================

function generateFallbackModels(level, category, topic, complexity, count) {
    const levelNum = {
        'primary': 1,
        'middle': 2,
        'secondary': 3,
        'higher-secondary': 4
    }[level] || 2;
    
    const levelNames = {
        'primary': 'Primary (Grades 1-5)',
        'middle': 'Middle (Grades 6-8)',
        'secondary': 'Secondary (Grades 9-10)',
        'higher-secondary': 'Higher Secondary (Grades 11-12)'
    };
    
    const categoryNames = {
        'arithmetic': 'Arithmetic & Number Sense',
        'geometry': 'Geometry & Shapes',
        'algebra': 'Algebra & Equations',
        'measurement': 'Measurement & Data',
        'fractions': 'Fractions & Decimals',
        'probability': 'Probability & Statistics',
        'trigonometry': 'Trigonometry',
        'calculus': 'Calculus'
    };
    
    const modelTemplates = {
        'primary': {
            'arithmetic': {
                title: 'Number Line Adventure',
                ideas: '• Create a giant floor number line\n• Use colored beads for counting jumps\n• Make a number line ladder\n• Design a number line race game',
                objectives: '• Understand number sequences from 0 to 100\n• Practice addition and subtraction visually\n• Build number sense and estimation skills\n• Develop counting and skip-counting skills',
                materials: '• Chart paper (free from school)\n• Markers/Colors (Rs. 50)\n• Colored beads or buttons (Rs. 30)\n• String or thread (Rs. 20)\n• Cardboard from old boxes (free)\n• Alternative: Use chalk on the floor',
                process: 'Step 1: Take a large chart paper or cardboard.\nStep 2: Draw a straight line from 0 to 20 (or 50 for advanced).\nStep 3: Mark numbers at equal intervals.\nStep 4: Color-code odd and even numbers.\nStep 5: Use beads to represent numbers.\nStep 6: Practice addition by jumping forward.\nStep 7: Practice subtraction by jumping backward.\nStep 8: Play "Find the number" games.',
                principle: 'The number line represents the order and distance between numbers. Each jump shows addition or subtraction. This visual tool helps students understand that numbers are not just symbols but have position and value.',
                summary: 'A physical number line that students can walk on, jump on, or use with counters. Estimated time: 45 minutes. Difficulty: Easy. Key tip: Start with smaller numbers and gradually increase.'
            },
            'geometry': {
                title: 'Shape City',
                ideas: '• Build a city using 2D shapes\n• Create a shape sorting game\n• Design a shape museum\n• Make shape flashcards with real objects',
                objectives: '• Identify basic 2D shapes (circle, square, triangle, rectangle)\n• Understand shape properties\n• Recognize shapes in the environment\n• Build spatial awareness',
                materials: '• Color paper (Rs. 40)\n• Scissors (Rs. 30)\n• Glue stick (Rs. 20)\n• Cardboard box (free)\n• Old magazines (free)',
                process: 'Step 1: Cut out different shapes from colored paper.\nStep 2: Sort shapes by type.\nStep 3: Create buildings using different shapes.\nStep 4: Label each shape.\nStep 5: Count sides and corners.\nStep 6: Create a shape city on cardboard.\nStep 7: Present the city to the class.',
                principle: 'Shapes are defined by their sides, corners, and angles. Understanding these properties helps identify shapes in the real world.',
                summary: 'A city made of shapes that helps students learn shape properties. Estimated time: 60 minutes. Difficulty: Easy. Key tip: Use real objects to show shapes.'
            }
        },
        'middle': {
            'arithmetic': {
                title: 'Multiplication Machine',
                ideas: '• Create a spinning multiplication wheel\n• Build a multiplication table board\n• Design a multiplication dice game\n• Create a multiplication memory game',
                objectives: '• Master multiplication facts up to 12\n• Understand multiplication as repeated addition\n• Build fluency in multiplication\n• Recognize patterns in multiplication tables',
                materials: '• Cardboard (free)\n• Brad fasteners (Rs. 20)\n• Markers (Rs. 50)\n• Scissors (Rs. 30)\n• Paper plates (Rs. 30)',
                process: 'Step 1: Cut circles from cardboard or use paper plates.\nStep 2: Write numbers around the edge (1-12).\nStep 3: Create a spinning pointer.\nStep 4: Spin and multiply.\nStep 5: Record answers.\nStep 6: Check answers with a calculator.\nStep 7: Practice times tables.\nStep 8: Create a multiplication chart.',
                principle: 'Multiplication is repeated addition. The wheel shows the relationship between multiplication facts and helps visualize patterns.',
                summary: 'An interactive multiplication wheel for practicing times tables. Estimated time: 50 minutes. Difficulty: Easy-Medium. Key tip: Start with smaller tables first.'
            },
            'geometry': {
                title: '3D Shape Explorer',
                ideas: '• Build 3D shapes with toothpicks and clay\n• Create a 3D shape museum\n• Design a shape net collection\n• Build a geodesic dome',
                objectives: '• Identify and construct 3D shapes\n• Understand vertices, edges, and faces\n• Build spatial reasoning\n• Connect 2D nets to 3D shapes',
                materials: '• Toothpicks (Rs. 20)\n• Clay/Play-doh (Rs. 50)\n• Cardboard (free)\n• Scissors (Rs. 30)\n• Ruler (Rs. 20)',
                process: 'Step 1: Choose a 3D shape to build.\nStep 2: Count how many vertices (corners) it has.\nStep 3: Use clay for vertices and toothpicks for edges.\nStep 4: Connect toothpicks with clay balls.\nStep 5: Build the shape.\nStep 6: Count faces, edges, and vertices.\nStep 7: Create a shape net on paper.\nStep 8: Compare with real objects.',
                principle: '3D shapes have length, width, and height. The number of faces, edges, and vertices is fixed for each shape (Euler\'s formula: V - E + F = 2).',
                summary: 'A collection of 3D shapes built from toothpicks and clay. Estimated time: 60 minutes. Difficulty: Medium. Key tip: Start with simple shapes like cubes and pyramids.'
            }
        },
        'secondary': {
            'geometry': {
                title: 'Pythagorean Theorem Visual Proof',
                ideas: '• Create a water displacement proof\n• Build a paper folding proof\n• Design a puzzle proof\n• Make an interactive poster',
                objectives: '• Understand the Pythagorean theorem\n• Visualize the relationship between sides\n• Apply the theorem to real problems\n• Build a physical proof',
                materials: '• Cardboard (free)\n• Ruler (Rs. 20)\n• Scissors (Rs. 30)\n• String (Rs. 20)\n• Water and container (free)',
                process: 'Step 1: Draw a right triangle on cardboard.\nStep 2: Draw squares on each side.\nStep 3: Cut out the squares.\nStep 4: Fill the largest square with water.\nStep 5: Pour into the other two squares.\nStep 6: Observe that the areas match.\nStep 7: Measure and verify.\nStep 8: Create a poster explaining.',
                principle: 'In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides: a² + b² = c². This is one of the most important theorems in mathematics.',
                summary: 'A visual proof of the Pythagorean theorem. Estimated time: 70 minutes. Difficulty: Medium-Hard. Key tip: Use a 3-4-5 triangle for easy calculations.'
            },
            'algebra': {
                title: 'Equation Balance Scale',
                ideas: '• Build a physical balance scale\n• Create an equation card game\n• Design a digital balance app\n• Make a scale using a hanger',
                objectives: '• Understand solving equations\n• Visualize equality\n• Understand variables and constants\n• Practice solving for x',
                materials: '• Cardboard (free)\n• String (Rs. 20)\n• Cups (Rs. 30)\n• Beads/coins (Rs. 20)\n• Ruler (Rs. 20)',
                process: 'Step 1: Build the scale using cardboard.\nStep 2: Attach cups to both sides.\nStep 3: Write equations on cards.\nStep 4: Place variables in cups.\nStep 5: Add constants to balance.\nStep 6: Solve for the variable.\nStep 7: Check the solution.\nStep 8: Create your own equations.',
                principle: 'An equation is balanced like a scale. Whatever you do to one side, you must do to the other to maintain balance. This is the fundamental principle of algebra.',
                summary: 'A working balance scale to solve equations. Estimated time: 60 minutes. Difficulty: Medium. Key tip: Start with simple equations like x + 3 = 7.'
            }
        },
        'higher-secondary': {
            'trigonometry': {
                title: 'Trigonometric Ratio Explorer',
                ideas: '• Build a clinometer\n• Create a unit circle model\n• Design a wave simulator\n• Make a trigonometric identity wheel',
                objectives: '• Understand trigonometric ratios\n• Visualize the unit circle\n• Apply trigonometry in real life\n• Build problem-solving skills',
                materials: '• Protractor (Rs. 30)\n• Straws (Rs. 10)\n• String (Rs. 20)\n• Washers (Rs. 10)\n• Cardboard (free)',
                process: 'Step 1: Create a clinometer using protractor and straw.\nStep 2: Measure angles of elevation.\nStep 3: Calculate heights using trigonometry.\nStep 4: Build a unit circle on cardboard.\nStep 5: Mark sin, cos, tan values.\nStep 6: Create a trig table.\nStep 7: Solve real-world problems.\nStep 8: Present findings.',
                principle: 'Trigonometric ratios relate angles to side lengths in right triangles. The unit circle extends these concepts to all angles. This is fundamental to physics, engineering, and navigation.',
                summary: 'A trigonometric explorer with a clinometer and unit circle. Estimated time: 90 minutes. Difficulty: Hard. Key tip: Practice measuring real heights like buildings and trees.'
            },
            'calculus': {
                title: 'Rate of Change Visualizer',
                ideas: '• Build a slope model\n• Create a derivative visualizer\n• Design an area approximation tool\n• Make a velocity experiment',
                objectives: '• Understand the concept of rate of change\n• Visualize derivatives\n• Understand integration concepts\n• Apply calculus to real problems',
                materials: '• Cardboard (free)\n• Graph paper (Rs. 20)\n• String (Rs. 20)\n• Weights (Rs. 30)\n• Ruler (Rs. 20)',
                process: 'Step 1: Draw a curve on graph paper.\nStep 2: Calculate slopes at different points.\nStep 3: Build a physical slope model.\nStep 4: Measure rate of change.\nStep 5: Approximate area under the curve.\nStep 6: Create a velocity-time graph.\nStep 7: Connect to real motion.\nStep 8: Present the concepts.',
                principle: 'Calculus is the study of change. Derivatives measure instantaneous rate of change, while integrals measure accumulation. These concepts are essential in physics, engineering, and economics.',
                summary: 'A visual and physical model for understanding calculus concepts. Estimated time: 90 minutes. Difficulty: Hard. Key tip: Start with simple linear functions before moving to curves.'
            }
        }
    };
    
    // Get the appropriate templates
    let levelTemplates = modelTemplates[level] || modelTemplates['middle'];
    let categoryTemplates = levelTemplates[category] || levelTemplates['geometry'];
    
    // If specific topic is provided, try to match it
    let matchedTemplate = null;
    if (topic) {
        const topicLower = topic.toLowerCase();
        for (let key in levelTemplates) {
            const template = levelTemplates[key];
            if (template.title && template.title.toLowerCase().includes(topicLower)) {
                matchedTemplate = template;
                break;
            }
        }
    }
    
    // Use matched template or default
    const template = matchedTemplate || categoryTemplates;
    
    // Generate multiple models with variations
    let result = '';
    const modelCount = Math.min(count, 3);
    
    for (let i = 0; i < modelCount; i++) {
        const suffix = i === 0 ? '' : ` ${String.fromCharCode(65 + i)}`; // A, B, C
        const title = i === 0 ? template.title : `${template.title} - Variation ${String.fromCharCode(65 + i)}`;
        
        result += `
📌 TOPIC: ${title}

💡 CREATIVE IDEAS:
${i === 0 ? template.ideas : template.ideas.split('\n').map(line => line + ' (alternative approach)').join('\n')}

🎯 LEARNING OBJECTIVES:
${template.objectives}

📦 MATERIALS (Low-Cost/No-Cost):
${template.materials}
Alternative materials: ${i === 0 ? 'Same as above' : 'Try using recycled materials like plastic bottles, old newspapers, and fabric scraps'}

🔧 STEP-BY-STEP PROCESS:
${template.process}
${i > 0 ? `\nVariation: Try modifying step ${3 + i} to make it more challenging.` : ''}

⚖️ MATHEMATICAL PRINCIPLE:
${template.principle}
${i > 0 ? `\nExtension: Explore how this principle applies in different contexts.` : ''}

📋 SUMMARY OF ASSEMBLY:
${template.summary}
${i > 0 ? `\nChallenge: Try completing the model in less time!` : ''}

🎯 EXTENSION ACTIVITIES:
${i === 0 ? '• Research other applications of this principle\n• Create a video explaining your model\n• Teach someone else how to build it\n• Write a report about the mathematical concept' : '• Compare different approaches\n• Combine with other mathematical concepts\n• Design a more complex version\n• Create a presentation for the class'}

---
`;
    }
    
    return result;
}

// ============================================
// MODEL DETAIL VIEW
// ============================================

function showModelDetail(index) {
    const cards = document.querySelectorAll('.model-card');
    if (cards[index - 1]) {
        cards[index - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
        cards[index - 1].style.borderColor = '#FF6B6B';
        cards[index - 1].style.borderWidth = '3px';
        setTimeout(() => {
            cards[index - 1].style.borderColor = 'var(--baby-orange)';
            cards[index - 1].style.borderWidth = '4px';
        }, 2000);
    }
}

// ============================================
// DISPLAY RESULTS
// ============================================

function displayResults(content) {
    const parsedHtml = parseAIResponseToHtml(content);
    if (parsedHtml) {
        DOM.modelContent.innerHTML = parsedHtml;
        DOM.resultsContainer.style.display = 'block';
        saveDraft();
    } else {
        DOM.modelContent.innerHTML = `
            <div class="model-card" style="text-align:center; padding:3rem;">
                <i class="fas fa-exclamation-triangle" style="font-size:3rem; color:var(--baby-orange);"></i>
                <h3 style="margin:1rem 0;">Unable to parse AI response</h3>
                <p style="color:var(--gray-500);">Please try again or use a different topic.</p>
                <pre style="background:var(--gray-100); padding:1rem; border-radius:0.5rem; margin-top:1rem; text-align:left; max-height:200px; overflow:auto; font-size:0.75rem;">${content.substring(0, 500)}...</pre>
            </div>
        `;
        DOM.resultsContainer.style.display = 'block';
    }
}

// ============================================
// DRAFT SAVE/LOAD
// ============================================

function saveDraft() {
    const content = DOM.modelContent.innerHTML;
    if (content && DOM.resultsContainer.style.display !== 'none') {
        const draft = {
            content,
            timestamp: Date.now(),
            educationLevel: DOM.educationLevel.value,
            mathCategory: DOM.mathCategory.value,
            specificTopic: DOM.specificTopic.value,
            complexityLevel: DOM.complexityLevel.value,
            modelCount: DOM.modelCount.value
        };
        localStorage.setItem(`${CONFIG.TOOL_SLUG}_draft`, JSON.stringify(draft));
        currentDraft = draft;
    }
}

function loadDraft() {
    const saved = localStorage.getItem(`${CONFIG.TOOL_SLUG}_draft`);
    if (saved) {
        try {
            const draft = JSON.parse(saved);
            if (Date.now() - draft.timestamp < 24 * 60 * 60 * 1000) {
                DOM.educationLevel.value = draft.educationLevel || '';
                DOM.mathCategory.value = draft.mathCategory || '';
                DOM.specificTopic.value = draft.specificTopic || '';
                DOM.complexityLevel.value = draft.complexityLevel || 'intermediate';
                DOM.modelCount.value = draft.modelCount || '3';
                if (draft.content) {
                    DOM.modelContent.innerHTML = draft.content;
                    DOM.resultsContainer.style.display = 'block';
                    showToast('📝 Draft loaded from local storage', 'info');
                    return true;
                }
            }
        } catch (e) {
            console.warn('Draft load error:', e);
        }
    }
    return false;
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

function exportToPDF() {
    const content = DOM.modelContent.innerHTML;
    if (!content || DOM.resultsContainer.style.display === 'none') {
        showToast('Generate models first', 'error');
        return;
    }
    
    const element = document.createElement('div');
    element.innerHTML = `
        <div style="padding:2rem; font-family:Inter,sans-serif; max-width:800px; margin:0 auto;">
            <h1 style="text-align:center; color:#FF9F4A; font-size:2rem;">📐 Mathematics Models</h1>
            <p style="text-align:center; color:#666; margin-bottom:2rem;">Generated on ${new Date().toLocaleDateString()}</p>
            ${content}
        </div>
    `;
    document.body.appendChild(element);
    
    html2pdf()
        .set({
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: 'math-models.pdf',
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        })
        .from(element)
        .save()
        .then(() => {
            document.body.removeChild(element);
            showToast('PDF downloaded!', 'success');
        })
        .catch(() => {
            document.body.removeChild(element);
            showToast('Error generating PDF', 'error');
        });
}

function exportToWord() {
    const content = DOM.modelContent.innerHTML;
    if (!content || DOM.resultsContainer.style.display === 'none') {
        showToast('Generate models first', 'error');
        return;
    }
    
    const html = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
    <meta charset="utf-8">
    <title>Mathematics Models</title>
    <style>
        body { font-family: Inter, Arial, sans-serif; padding: 2rem; }
        .model-card { margin-bottom: 2rem; padding: 1.5rem; border-left: 4px solid #FF9F4A; background: #f8f9fa; border-radius: 0.5rem; }
        .model-title { font-size: 1.3rem; font-weight: bold; color: #E67E22; }
        .model-section { margin: 0.75rem 0; }
        .model-section h5 { font-weight: 600; color: #475569; margin-bottom: 0.25rem; }
        ul { padding-left: 1.5rem; }
        li { margin-bottom: 0.25rem; }
        .material-tag { display: inline-block; background: #FFB86C; padding: 0.15rem 0.5rem; border-radius: 1rem; margin: 0.1rem; }
        h1 { text-align: center; color: #FF9F4A; }
        .subtitle { text-align: center; color: #666; margin-bottom: 2rem; }
    </style>
</head>
<body>
    <h1>📐 Mathematics Models</h1>
    <p class="subtitle">Generated on ${new Date().toLocaleDateString()}</p>
    ${content}
</body></html>`;
    
    const blob = new Blob([html], { type: 'application/msword;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'math-models.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    showToast('Word document downloaded!', 'success');
}

function exportToTxt() {
    const content = DOM.modelContent.innerText;
    if (!content || DOM.resultsContainer.style.display === 'none') {
        showToast('Generate models first', 'error');
        return;
    }
    
    const text = `MATHEMATICS MODELS\nGenerated on ${new Date().toLocaleDateString()}\n${'='.repeat(60)}\n\n${content}`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'math-models.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    showToast('TXT file downloaded!', 'success');
}

function copyToClipboard() {
    const content = DOM.modelContent.innerText;
    if (!content || DOM.resultsContainer.style.display === 'none') {
        showToast('Generate models first', 'error');
        return;
    }
    
    navigator.clipboard.writeText(content)
        .then(() => showToast('Copied to clipboard!', 'success'))
        .catch(() => showToast('Failed to copy', 'error'));
}

// ============================================
// REACTIONS UI
// ============================================

function updateReactionUI() {
    const emojiMap = { '👍': 'like', '❤️': 'love', '😮': 'wow', '😢': 'sad', '😂': 'laugh', '🎉': 'celebrate' };
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        const emoji = btn.getAttribute('data-emoji');
        const count = reactionsData[emojiMap[emoji]] || 0;
        const countSpan = btn.querySelector('.reaction-count');
        if (countSpan) countSpan.textContent = count;
        if (userReactions[emoji]) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// ============================================
// ASSESSMENT TOOL
// ============================================

function openAssessmentTool() {
    const modalBody = DOM.assessmentModalBody;
    const topic = DOM.specificTopic.value || 'Mathematics Model';
    const level = DOM.educationLevel.options[DOM.educationLevel.selectedIndex]?.text || 'General';
    
    let criteriaHtml = '<div class="criteria-grid">';
    CRITERIA.forEach((c, idx) => {
        criteriaHtml += `
            <div class="criteria-card">
                <div class="criteria-label">
                    <span><strong>${idx + 1}. ${c.name}</strong> <small>(${c.weight}x)</small></span>
                    <span style="font-size:0.7rem; color:var(--gray-500);">${c.description}</span>
                </div>
                <input type="range" class="criteria-slider" data-criteria="${c.id}" min="0" max="${c.maxScore}" value="7" step="1" style="width:100%;">
                <div style="display:flex; justify-content:space-between; margin-top:5px;">
                    <span style="font-size:0.75rem;">0</span>
                    <input type="number" class="score-input" data-criteria="${c.id}" min="0" max="${c.maxScore}" value="7" style="width:60px; text-align:center; padding:0.25rem; border:2px solid var(--gray-200); border-radius:0.5rem;">
                    <span style="font-size:0.75rem;">${c.maxScore}</span>
                </div>
                <div class="weighted-score" id="weighted-${c.id}">Weighted: 0</div>
            </div>
        `;
    });
    criteriaHtml += '</div>';
    
    modalBody.innerHTML = `
        <div class="assessment-report" id="assessmentReport">
            <div class="report-header" style="text-align:center; margin-bottom:1.5rem; padding-bottom:1rem; border-bottom:2px solid var(--baby-orange);">
                <h2><i class="fas fa-clipboard-list"></i> Comprehensive Student Assessment Report</h2>
                <p>Model: ${topic} | Level: ${level} | Date: ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px,1fr)); gap:1rem; margin-bottom:1.5rem;">
                <div><label style="font-size:0.85rem; font-weight:600;">Student Name:</label> 
                    <input type="text" id="studentName" class="assessment-input" placeholder="Enter student name" style="width:100%; padding:0.5rem; border:2px solid var(--gray-200); border-radius:0.5rem;"></div>
                <div><label style="font-size:0.85rem; font-weight:600;">Roll Number:</label> 
                    <input type="text" id="rollNumber" class="assessment-input" placeholder="Enter roll number" style="width:100%; padding:0.5rem; border:2px solid var(--gray-200); border-radius:0.5rem;"></div>
                <div><label style="font-size:0.85rem; font-weight:600;">Class/Section:</label> 
                    <input type="text" id="classSection" class="assessment-input" placeholder="Class & Section" style="width:100%; padding:0.5rem; border:2px solid var(--gray-200); border-radius:0.5rem;"></div>
            </div>
            
            ${criteriaHtml}
            
            <div class="score-summary" id="scoreSummary"></div>
            
            <div class="chart-container">
                <canvas id="assessmentChart" width="400" height="400"></canvas>
            </div>
            
            <h3 style="margin-top:1.5rem;"><i class="fas fa-trophy" style="color:var(--green);"></i> Strengths</h3>
            <div id="strengthsList"></div>
            
            <h3 style="margin-top:1.5rem;"><i class="fas fa-exclamation-triangle" style="color:var(--red);"></i> Areas for Improvement</h3>
            <div id="weaknessesList"></div>
            
            <h3 style="margin-top:1.5rem;"><i class="fas fa-rocket" style="color:var(--yellow);"></i> Actionable Recommendations</h3>
            <div id="improvementsList"></div>
            
            <div class="teacher-suggestion">
                <h4><i class="fas fa-chalkboard-user"></i> Teacher's Detailed Comments</h4>
                <textarea id="teacherSuggestions" rows="4" class="assessment-textarea" placeholder="Write your personalized feedback, suggestions for parents, and next steps for the student..." style="width:100%; padding:0.75rem; border-radius:0.75rem; border:2px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.1); min-height:100px; resize:vertical;"></textarea>
            </div>
            
            <div class="report-actions">
                <button class="btn-primary" id="calculateAssessmentBtn"><i class="fas fa-calculator"></i> Calculate & Generate Report</button>
                <button class="btn-outline" id="downloadReportBtn"><i class="fas fa-download"></i> Download PDF</button>
                <button class="btn-outline" id="printReportBtn"><i class="fas fa-print"></i> Print</button>
                <button class="btn-outline" id="saveReportBtn"><i class="fas fa-save"></i> Save</button>
            </div>
        </div>
    `;
    
    // Add event listeners
    CRITERIA.forEach(c => {
        const slider = document.querySelector(`.criteria-slider[data-criteria="${c.id}"]`);
        const input = document.querySelector(`.score-input[data-criteria="${c.id}"]`);
        if (slider && input) {
            slider.addEventListener('input', (e) => { input.value = e.target.value; calculateAssessment(); });
            input.addEventListener('input', (e) => { slider.value = e.target.value; calculateAssessment(); });
        }
    });
    
    document.getElementById('calculateAssessmentBtn')?.addEventListener('click', calculateAssessment);
    document.getElementById('downloadReportBtn')?.addEventListener('click', downloadAssessmentReport);
    document.getElementById('printReportBtn')?.addEventListener('click', () => window.print());
    document.getElementById('saveReportBtn')?.addEventListener('click', saveAssessmentReport);
    
    DOM.assessmentModal.classList.add('active');
    calculateAssessment();
}

function calculateAssessment() {
    let totalWeightedScore = 0;
    let totalMaxWeighted = 0;
    let scores = {};
    
    CRITERIA.forEach(c => {
        let score = parseInt(document.querySelector(`.score-input[data-criteria="${c.id}"]`)?.value) || 0;
        let weightedScore = score * c.weight;
        let maxWeighted = c.maxScore * c.weight;
        totalWeightedScore += weightedScore;
        totalMaxWeighted += maxWeighted;
        scores[c.id] = score;
        document.getElementById(`weighted-${c.id}`).innerHTML = `Weighted: ${weightedScore} / ${maxWeighted}`;
    });
    
    let percentage = (totalWeightedScore / totalMaxWeighted) * 100;
    let totalMarks = totalWeightedScore.toFixed(1);
    let maxMarks = totalMaxWeighted;
    
    let grade = 'F', gradeClass = 'grade-F';
    if (percentage >= 95) { grade = 'A+'; gradeClass = 'grade-A-plus'; }
    else if (percentage >= 85) { grade = 'A'; gradeClass = 'grade-A'; }
    else if (percentage >= 75) { grade = 'B+'; gradeClass = 'grade-B'; }
    else if (percentage >= 65) { grade = 'B'; gradeClass = 'grade-B'; }
    else if (percentage >= 55) { grade = 'C'; gradeClass = 'grade-C'; }
    else if (percentage >= 45) { grade = 'D'; gradeClass = 'grade-D'; }
    
    document.getElementById('scoreSummary').innerHTML = `
        <div class="score-circle" style="background: conic-gradient(var(--baby-orange) 0deg ${percentage * 3.6}deg, var(--gray-200) ${percentage * 3.6}deg 360deg);">
            <div class="score-value">${Math.round(percentage)}%</div>
            <div class="score-label">Percentage</div>
        </div>
        <div style="text-align:center;">
            <span class="grade-badge ${gradeClass}">Grade: ${grade}</span>
            <p><strong>Total Score:</strong> ${totalMarks} / ${maxMarks}</p>
            <p><strong>Performance Level:</strong> ${percentage >= 75 ? '🌟 Excellent' : percentage >= 60 ? '👍 Good' : percentage >= 45 ? '📈 Satisfactory' : '📚 Needs Improvement'}</p>
        </div>
    `;
    
    // Strengths, Weaknesses, Improvements
    let strengths = [];
    let weaknesses = [];
    let improvements = [];
    
    CRITERIA.forEach(c => {
        let score = scores[c.id];
        if (score >= 8) strengths.push(`${c.name}: Excellent performance (${score}/10)`);
        else if (score >= 6) strengths.push(`${c.name}: Good effort (${score}/10)`);
        else if (score <= 4) weaknesses.push(`${c.name}: Needs significant improvement (${score}/10) - ${c.description}`);
        else if (score <= 5) weaknesses.push(`${c.name}: Could be better (${score}/10) - Focus on ${c.description.toLowerCase()}`);
    });
    
    CRITERIA.forEach(c => {
        let score = scores[c.id];
        if (score <= 5) {
            const tips = {
                'accuracy': 'Practice more problems related to the mathematical concept. Review fundamentals.',
                'construction': 'Pay more attention to measurements and neatness. Use a ruler for precision.',
                'presentation': 'Prepare key points before presenting. Practice explaining to family members.',
                'material': 'Look for creative recycled materials at home like bottles, boxes, and newspapers.',
                'creativity': 'Think outside the box. Try combining different concepts in new ways.',
                'understanding': 'Review the core concepts. Use online resources or ask the teacher for help.'
            };
            improvements.push(tips[c.id] || `Focus on improving ${c.name}. Review the feedback and try again.`);
        }
    });
    
    if (strengths.length === 0) strengths.push('Student shows basic understanding. Keep working hard!');
    if (weaknesses.length === 0) weaknesses.push('No major weaknesses identified. Student is performing well!');
    if (improvements.length === 0) improvements.push('Continue the good work! Try exploring advanced concepts.');
    
    document.getElementById('strengthsList').innerHTML = strengths.map(s => `<div class="strength-item"><i class="fas fa-star" style="color:var(--green);"></i> ${s}</div>`).join('');
    document.getElementById('weaknessesList').innerHTML = weaknesses.map(w => `<div class="weakness-item"><i class="fas fa-exclamation-circle" style="color:var(--red);"></i> ${w}</div>`).join('');
    document.getElementById('improvementsList').innerHTML = improvements.map(i => `<div class="improvement-item"><i class="fas fa-arrow-up" style="color:var(--yellow);"></i> ${i}</div>`).join('');
    
    // Update chart
    if (assessmentChart) assessmentChart.destroy();
    const ctx = document.getElementById('assessmentChart')?.getContext('2d');
    if (ctx) {
        assessmentChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: CRITERIA.map(c => c.name),
                datasets: [{
                    label: 'Scores (0-10)',
                    data: CRITERIA.map(c => scores[c.id]),
                    backgroundColor: 'rgba(255,159,74,0.2)',
                    borderColor: '#FF9F4A',
                    borderWidth: 2,
                    pointBackgroundColor: '#6DC4E8',
                    pointBorderColor: '#fff',
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: { r: { beginAtZero: true, max: 10, ticks: { stepSize: 2 } } },
                plugins: { tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw}/10` } } }
            }
        });
    }
}

function downloadAssessmentReport() {
    const reportElement = document.getElementById('assessmentReport');
    if (!reportElement) { showToast('Generate report first', 'error'); return; }
    const studentName = document.getElementById('studentName')?.value || 'Student';
    html2pdf()
        .set({ margin: [0.5, 0.5, 0.5, 0.5], filename: `${studentName}_assessment_report.pdf`, html2canvas: { scale: 2 } })
        .from(reportElement)
        .save()
        .then(() => showToast('Report downloaded!', 'success'))
        .catch(() => showToast('Error downloading report', 'error'));
}

function saveAssessmentReport() {
    const studentName = document.getElementById('studentName')?.value || 'Student';
    const reportData = {
        studentName,
        rollNumber: document.getElementById('rollNumber')?.value,
        classSection: document.getElementById('classSection')?.value,
        date: new Date().toISOString(),
        scores: {},
        teacherComments: document.getElementById('teacherSuggestions')?.value || ''
    };
    CRITERIA.forEach(c => {
        reportData.scores[c.id] = parseInt(document.querySelector(`.score-input[data-criteria="${c.id}"]`)?.value) || 0;
    });
    localStorage.setItem(`${CONFIG.TOOL_SLUG}_report_${Date.now()}`, JSON.stringify(reportData));
    showToast('Report saved locally!', 'success');
}

// ============================================
// THEME
// ============================================

function initTheme() {
    if (isDarkMode) {
        document.body.classList.add('dark');
        DOM.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark');
        DOM.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
    initTheme();
    showToast(`${isDarkMode ? 'Dark' : 'Light'} mode activated`, 'info');
}

// ============================================
// RANDOM, CLEAR, DRAFT
// ============================================

function randomTopic() {
    const topics = [
        'Pythagorean Theorem', 'Quadratic Equations', 'Circle Properties', 
        'Trigonometry', 'Linear Equations', 'Probability', 'Fractions',
        'Geometry Proofs', 'Algebraic Expressions', 'Data Analysis',
        'Number Patterns', 'Area and Perimeter', 'Volume and Surface Area',
        'Statistics', 'Coordinate Geometry'
    ];
    const categories = ['geometry', 'algebra', 'arithmetic', 'probability', 'fractions', 'measurement', 'trigonometry'];
    DOM.specificTopic.value = topics[Math.floor(Math.random() * topics.length)];
    DOM.mathCategory.value = categories[Math.floor(Math.random() * categories.length)];
    DOM.educationLevel.value = ['primary', 'middle', 'secondary', 'higher-secondary'][Math.floor(Math.random() * 4)];
    showToast('Random topic selected', 'info');
}

function clearForm() {
    DOM.educationLevel.value = '';
    DOM.mathCategory.value = '';
    DOM.specificTopic.value = '';
    DOM.complexityLevel.value = 'intermediate';
    DOM.modelCount.value = '3';
    DOM.modelContent.innerHTML = '';
    DOM.resultsContainer.style.display = 'none';
    showToast('Form cleared', 'info');
}

// ============================================
// NAVIGATION
// ============================================

function goHome() {
    window.location.href = 'https://magicrills.com';
}

function goBack() {
    window.location.href = 'https://magicrills.com/category-pages/administrator.html';
}

// ============================================
// SCROLL
// ============================================

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// ============================================
// SHARE
// ============================================

function shareOnPlatform(platform) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out these amazing mathematics model ideas! 📐✨');
    
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
        twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
        whatsapp: `https://wa.me/?text=${text}%20${url}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        email: `mailto:?subject=Mathematics%20Models&body=${text}%20${url}`
    };
    
    if (platform === 'copy') {
        navigator.clipboard.writeText(window.location.href)
            .then(() => showToast('Link copied to clipboard!', 'success'))
            .catch(() => showToast('Failed to copy link', 'error'));
        addShare('copy');
        return;
    }
    
    const shareUrl = shareUrls[platform];
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=500');
        addShare(platform);
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    DOM.generateBtn.addEventListener('click', generateModelIdeas);
    DOM.randomBtn.addEventListener('click', randomTopic);
    DOM.clearBtn.addEventListener('click', clearForm);
    DOM.saveDraftBtn.addEventListener('click', () => { saveDraft(); showToast('Draft saved!', 'success'); });
    
    DOM.themeToggle.addEventListener('click', toggleTheme);
    DOM.homeBtn.addEventListener('click', goHome);
    DOM.backBtn.addEventListener('click', goBack);
    DOM.scrollUpBtn.addEventListener('click', scrollToTop);
    DOM.scrollDownBtn.addEventListener('click', scrollToBottom);
    
    DOM.exportPDFBtn.addEventListener('click', exportToPDF);
    DOM.exportDocBtn.addEventListener('click', exportToWord);
    DOM.exportTxtBtn.addEventListener('click', exportToTxt);
    DOM.copyBtn.addEventListener('click', copyToClipboard);
    
    DOM.openAssessmentBtn.addEventListener('click', openAssessmentTool);
    DOM.openAssessmentBtn2.addEventListener('click', openAssessmentTool);
    DOM.closeModalBtn.addEventListener('click', () => DOM.assessmentModal.classList.remove('active'));
    DOM.assessmentModal.addEventListener('click', (e) => {
        if (e.target === DOM.assessmentModal) DOM.assessmentModal.classList.remove('active');
    });
    
    DOM.closePremiumModal.addEventListener('click', () => DOM.premiumModal.classList.remove('active'));
    DOM.premiumModal.addEventListener('click', (e) => {
        if (e.target === DOM.premiumModal) DOM.premiumModal.classList.remove('active');
    });
    
    document.querySelector('.logo')?.addEventListener('dblclick', () => {
        DOM.premiumModal.classList.add('active');
    });
    
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', () => addReaction(btn.getAttribute('data-emoji')));
    });
    
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', () => shareOnPlatform(btn.getAttribute('data-platform')));
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            DOM.assessmentModal.classList.remove('active');
            DOM.premiumModal.classList.remove('active');
        }
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveDraft();
            showToast('Draft saved!', 'success');
        }
        if (e.ctrlKey && e.key === 'Enter') {
            generateModelIdeas();
        }
    });
    
    // Auto-generate on enter in specific topic
    DOM.specificTopic.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            generateModelIdeas();
        }
    });
}

// ============================================
// INITIALIZATION
// ============================================

async function init() {
    initTheme();
    setupEventListeners();
    
    await Promise.all([
        getUsage(),
        getReactions(),
        getShares()
    ]);
    
    if (!loadDraft()) {
        // Auto-generate welcome models
        setTimeout(() => {
            DOM.educationLevel.value = 'middle';
            DOM.mathCategory.value = 'geometry';
            DOM.complexityLevel.value = 'intermediate';
            DOM.modelCount.value = '3';
            generateModelIdeas();
        }, 800);
    }
    
    showFloatingNotification('👋 Welcome! Generate your first mathematics model idea!', 6000);
    showToast('Mathematics Models Generator ready!', 'success');
}

// Start the app
document.addEventListener('DOMContentLoaded', init);

// Expose functions globally
window.generateModelIdeas = generateModelIdeas;
window.openAssessmentTool = openAssessmentTool;
window.showModelDetail = showModelDetail;
