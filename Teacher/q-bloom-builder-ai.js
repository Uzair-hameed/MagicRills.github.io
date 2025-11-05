// Q Bloom Builder - AI Integration and Enhancement

class QBloomAI {
    constructor() {
        this.apiEndpoints = {
            openAI: 'https://api.openai.com/v1/chat/completions',
            huggingFace: 'https://api-inference.huggingface.co/models',
            localAI: '/api/analyze' // For local AI integration
        };
        this.isAIAvailable = false;
        this.initializeAI();
    }

    initializeAI() {
        // Check for available AI services
        this.checkAIAvailability();
        
        // Setup AI enhancement features
        this.setupAIFeatures();
        
        console.log('Q Bloom AI Initialized 🤖');
    }

    checkAIAvailability() {
        // Check if any AI service is available
        const availableServices = [];
        
        // Check for OpenAI API key in environment (in real implementation)
        if (typeof process !== 'undefined' && process.env?.OPENAI_API_KEY) {
            availableServices.push('openai');
        }
        
        // Check for Hugging Face token
        if (typeof process !== 'undefined' && process.env?.HUGGING_FACE_TOKEN) {
            availableServices.push('huggingface');
        }
        
        // Always available: local rule-based AI
        availableServices.push('local');
        
        this.isAIAvailable = availableServices.length > 0;
        console.log(`Available AI services: ${availableServices.join(', ')}`);
    }

    setupAIFeatures() {
        // Add AI enhancement buttons and features
        this.addAIControls();
        this.setupAIAutoDetect();
    }

    addAIControls() {
        // AI controls are already in the HTML
        // Additional AI features can be added here
    }

    setupAIAutoDetect() {
        // Auto-detect question types and suggest improvements
        const input = document.getElementById('questionInput');
        input.addEventListener('blur', () => {
            this.suggestQuestionImprovements();
        });
    }

    // Main AI enhancement function
    async enhanceWithAI() {
        const inputText = document.getElementById('questionInput').value.trim();
        
        if (!inputText) {
            showNotification('Please enter some questions to enhance with AI.', 'warning');
            return;
        }

        showNotification('AI is enhancing your questions...', 'info');
        
        try {
            const enhancedQuestions = await this.processWithAI(inputText);
            document.getElementById('questionInput').value = enhancedQuestions;
            updateCharacterCount();
            updateQuestionCount();
            showNotification('Questions enhanced with AI!', 'success');
        } catch (error) {
            console.error('AI Enhancement failed:', error);
            showNotification('AI enhancement failed. Using local enhancement instead.', 'warning');
            this.enhanceLocally(inputText);
        }
    }

    async processWithAI(text) {
        // Try different AI services in order
        try {
            return await this.enhanceWithLocalAI(text);
        } catch (error) {
            console.warn('Local AI failed, trying rule-based enhancement');
            return this.enhanceWithRules(text);
        }
    }

    async enhanceWithLocalAI(text) {
        // Simulate AI processing with local rules
        return new Promise((resolve) => {
            setTimeout(() => {
                const enhanced = this.applyAIEnhancementRules(text);
                resolve(enhanced);
            }, 1000);
        });
    }

    applyAIEnhancementRules(text) {
        const questions = text.split('\n').filter(q => q.trim());
        const enhancedQuestions = questions.map(question => {
            return this.enhanceSingleQuestion(question);
        });
        
        return enhancedQuestions.join('\n');
    }

    enhanceSingleQuestion(question) {
        let enhanced = question.trim();
        
        // Ensure question ends with proper punctuation
        if (!enhanced.endsWith('?') && !enhanced.endsWith('.') && !enhanced.endsWith('!')) {
            enhanced += '?';
        }
        
        // Capitalize first letter
        enhanced = enhanced.charAt(0).toUpperCase() + enhanced.slice(1);
        
        // Add Bloom's level suggestions
        const level = classifyQuestion(enhanced);
        if (level) {
            // For lower levels, suggest higher-order alternatives
            if (level === 'remember' || level === 'understand') {
                enhanced += `\n// AI Suggestion: Consider rephrasing as ${this.getHigherOrderSuggestion(enhanced, level)}`;
            }
        }
        
        return enhanced;
    }

    getHigherOrderSuggestion(question, currentLevel) {
        const suggestions = {
            remember: [
                "an analysis question: 'Analyze the factors that influence...'",
                "an evaluation question: 'Evaluate the effectiveness of...'",
                "a creation question: 'Design a solution for...'"
            ],
            understand: [
                "an application question: 'Apply this concept to a real-world scenario...'",
                "an analysis question: 'Compare and contrast different perspectives on...'",
                "an evaluation question: 'Critique the argument that...'"
            ]
        };
        
        const levelSuggestions = suggestions[currentLevel] || [];
        return levelSuggestions[Math.floor(Math.random() * levelSuggestions.length)];
    }

    enhanceLocally(text) {
        const questions = text.split('\n').filter(q => q.trim());
        const enhancedQuestions = questions.map(question => {
            return this.applyLocalEnhancement(question);
        });
        
        document.getElementById('questionInput').value = enhancedQuestions.join('\n');
        updateCharacterCount();
        updateQuestionCount();
        showNotification('Questions enhanced with local AI rules!', 'success');
    }

    applyLocalEnhancement(question) {
        // Simple rule-based enhancements
        let enhanced = question.trim();
        
        // Add question mark if missing
        if (!enhanced.endsWith('?') && enhanced.length > 0) {
            enhanced += '?';
        }
        
        // Improve question phrasing
        enhanced = this.improvePhrasing(enhanced);
        
        return enhanced;
    }

    improvePhrasing(question) {
        // Simple phrasing improvements
        const improvements = {
            "what is": "What is",
            "how to": "How can one",
            "can you": "How would you",
            "tell me": "Explain",
            "give me": "Provide"
        };
        
        let improved = question.toLowerCase();
        
        for (const [from, to] of Object.entries(improvements)) {
            if (improved.startsWith(from)) {
                improved = to + improved.slice(from.length);
                break;
            }
        }
        
        // Capitalize first letter
        return improved.charAt(0).toUpperCase() + improved.slice(1);
    }

    async suggestQuestionImprovements() {
        const input = document.getElementById('questionInput');
        const text = input.value.trim();
        
        if (!text || text.length < 10) return;
        
        // Show AI thinking indicator
        this.showAIThinking();
        
        try {
            const suggestions = await this.generateAISuggestions(text);
            this.displayAISuggestions(suggestions);
        } catch (error) {
            console.warn('AI suggestions failed:', error);
        }
    }

    async generateAISuggestions(text) {
        // Simulate AI suggestion generation
        return new Promise((resolve) => {
            setTimeout(() => {
                const questions = text.split('\n').filter(q => q.trim().length > 0);
                const suggestions = {
                    distribution: this.analyzeDistribution(questions),
                    improvements: this.generateImprovementSuggestions(questions),
                    missingLevels: this.findMissingLevels(questions)
                };
                resolve(suggestions);
            }, 1500);
        });
    }

    analyzeDistribution(questions) {
        const distribution = {
            remember: 0,
            understand: 0,
            apply: 0,
            analyze: 0,
            evaluate: 0,
            create: 0
        };
        
        questions.forEach(question => {
            const level = classifyQuestion(question);
            if (level && distribution[level] !== undefined) {
                distribution[level]++;
            }
        });
        
        return distribution;
    }

    generateImprovementSuggestions(questions) {
        const suggestions = [];
        const distribution = this.analyzeDistribution(questions);
        const total = questions.length;
        
        if (total === 0) return suggestions;
        
        // Check for balance
        const lowerOrder = distribution.remember + distribution.understand;
        const higherOrder = distribution.analyze + distribution.evaluate + distribution.create;
        
        if (lowerOrder > higherOrder * 2) {
            suggestions.push("Your questions are heavily weighted toward lower-order thinking. Consider adding more analysis, evaluation, and creation questions.");
        }
        
        if (distribution.create === 0) {
            suggestions.push("No 'Create' level questions detected. Add questions that require designing, inventing, or producing original work.");
        }
        
        if (distribution.analyze < total * 0.2) {
            suggestions.push("Limited analytical questions. Include more 'Analyze' level questions to develop critical thinking skills.");
        }
        
        return suggestions;
    }

    findMissingLevels(questions) {
        const distribution = this.analyzeDistribution(questions);
        const missing = [];
        
        for (const level in distribution) {
            if (distribution[level] === 0) {
                missing.push(level);
            }
        }
        
        return missing;
    }

    showAIThinking() {
        // Add AI thinking indicator to the input
        const inputContainer = document.querySelector('.input-container');
        let indicator = inputContainer.querySelector('.ai-thinking-indicator');
        
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'ai-thinking-indicator';
            indicator.innerHTML = '🤖 AI is thinking...';
            indicator.style.cssText = `
                position: absolute;
                bottom: -25px;
                right: 10px;
                font-size: 0.8rem;
                color: var(--primary-color);
                background: var(--surface-color);
                padding: 5px 10px;
                border-radius: 15px;
                border: 1px solid var(--primary-color);
            `;
            inputContainer.style.position = 'relative';
            inputContainer.appendChild(indicator);
        }
    }

    hideAIThinking() {
        const indicator = document.querySelector('.ai-thinking-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    displayAISuggestions(suggestions) {
        this.hideAIThinking();
        
        const recommendationsElement = document.getElementById('aiRecommendations');
        const contentElement = recommendationsElement.querySelector('.recommendations-content');
        
        let html = '<p><strong>AI Analysis Suggestions:</strong></p>';
        
        if (suggestions.improvements.length > 0) {
            html += '<ul style="margin-top: 10px;">';
            suggestions.improvements.forEach(improvement => {
                html += `<li>${improvement}</li>`;
            });
            html += '</ul>';
        }
        
        if (suggestions.missingLevels.length > 0) {
            html += `<p style="margin-top: 10px;"><strong>Missing Bloom's Levels:</strong> ${suggestions.missingLevels.map(level => capitalizeFirst(level)).join(', ')}</p>`;
        }
        
        // Add distribution overview
        const total = Object.values(suggestions.distribution).reduce((a, b) => a + b, 0);
        if (total > 0) {
            html += `<div style="margin-top: 15px; padding: 10px; background: rgba(52, 152, 219, 0.1); border-radius: 8px;">
                <small>📊 <strong>Distribution:</strong> Remember (${suggestions.distribution.remember}), 
                Understand (${suggestions.distribution.understand}), 
                Apply (${suggestions.distribution.apply}), 
                Analyze (${suggestions.distribution.analyze}), 
                Evaluate (${suggestions.distribution.evaluate}), 
                Create (${suggestions.distribution.create})</small>
            </div>`;
        }
        
        contentElement.innerHTML = html;
        
        // Highlight the AI recommendations section
        recommendationsElement.style.animation = 'pulse 2s ease';
        setTimeout(() => {
            recommendationsElement.style.animation = '';
        }, 2000);
    }

    // Advanced AI question generation
    async generateQuestionsByLevel(level, topic, count = 5) {
        showNotification(`Generating ${count} ${level} level questions about ${topic}...`, 'info');
        
        try {
            const questions = await this.generateQuestionsWithAI(level, topic, count);
            this.displayGeneratedQuestions(questions, level, topic);
        } catch (error) {
            console.error('Question generation failed:', error);
            this.generateQuestionsWithRules(level, topic, count);
        }
    }

    async generateQuestionsWithAI(level, topic, count) {
        // Simulate AI question generation
        return new Promise((resolve) => {
            setTimeout(() => {
                const questions = this.generateTemplateQuestions(level, topic, count);
                resolve(questions);
            }, 2000);
        });
    }

    generateTemplateQuestions(level, topic, count) {
        const templates = {
            remember: [
                `What is the definition of ${topic}?`,
                `List three key facts about ${topic}.`,
                `Who are the main figures associated with ${topic}?`,
                `When did ${topic} become significant?`,
                `Where does ${topic} typically occur?`
            ],
            understand: [
                `Explain how ${topic} works in simple terms.`,
                `Describe the process of ${topic}.`,
                `Compare ${topic} with a similar concept.`,
                `What is the main purpose of ${topic}?`,
                `Summarize the key points about ${topic}.`
            ],
            apply: [
                `How would you use ${topic} in a real-world situation?`,
                `Solve this problem using ${topic}: [problem description]`,
                `Demonstrate ${topic} with a practical example.`,
                `Apply the principles of ${topic} to this scenario.`,
                `Calculate [something] using ${topic}.`
            ],
            analyze: [
                `Analyze the relationship between ${topic} and [related concept].`,
                `What are the underlying causes of ${topic}?`,
                `Break down ${topic} into its main components.`,
                `How does ${topic} affect [another factor]?`,
                `What patterns can you identify in ${topic}?`
            ],
            evaluate: [
                `Evaluate the effectiveness of ${topic}.`,
                `What are the strengths and weaknesses of ${topic}?`,
                `Defend your position on ${topic}.`,
                `Which approach to ${topic} is better and why?`,
                `Critique the implementation of ${topic}.`
            ],
            create: [
                `Design a new system based on ${topic}.`,
                `Create a solution that improves ${topic}.`,
                `Develop a plan for implementing ${topic}.`,
                `Propose an innovative use for ${topic}.`,
                `Invent a new method related to ${topic}.`
            ]
        };
        
        const levelTemplates = templates[level] || templates.remember;
        const questions = [];
        
        for (let i = 0; i < count && i < levelTemplates.length; i++) {
            questions.push(levelTemplates[i]);
        }
        
        return questions;
    }

    displayGeneratedQuestions(questions, level, topic) {
        const modal = this.createQuestionModal(questions, level, topic);
        document.body.appendChild(modal);
        
        // Show modal with animation
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.modal-content').style.transform = 'scale(1)';
        }, 100);
    }

    createQuestionModal(questions, level, topic) {
        const modal = document.createElement('div');
        modal.className = 'ai-questions-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div class="modal-content" style="
                background: var(--surface-color);
                padding: 30px;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                transform: scale(0.7);
                transition: transform 0.3s ease;
            ">
                <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 20px;">
                    <h3>🤖 AI Generated Questions</h3>
                    <button onclick="this.closest('.ai-questions-modal').remove()" style="
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        cursor: pointer;
                        color: var(--text-secondary);
                    ">×</button>
                </div>
                <p><strong>Level:</strong> ${capitalizeFirst(level)} | <strong>Topic:</strong> ${topic}</p>
                <div style="margin: 20px 0;">
                    ${questions.map((q, i) => `
                        <div style="
                            padding: 10px;
                            margin: 10px 0;
                            background: var(--background-color);
                            border-radius: 8px;
                            border-left: 4px solid ${Q_BLOOM_BUILDER_CONFIG.colors[level]};
                        ">
                            ${i + 1}. ${q}
                        </div>
                    `).join('')}
                </div>
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button onclick="this.closest('.ai-questions-modal').remove()" class="btn secondary">Close</button>
                    <button onclick="addGeneratedQuestions(['${questions.join("','")}'])" class="btn primary">Add to Input</button>
                </div>
            </div>
        `;
        
        return modal;
    }
}

// Global AI instance
let qBloomAI;

// Initialize AI when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    qBloomAI = new QBloomAI();
});

// Global function for AI enhancement
function enhanceWithAI() {
    if (qBloomAI) {
        qBloomAI.enhanceWithAI();
    } else {
        showNotification('AI system is still initializing. Please try again.', 'warning');
    }
}

// Function to add generated questions to input
function addGeneratedQuestions(questions) {
    const input = document.getElementById('questionInput');
    const currentValue = input.value.trim();
    const newQuestions = questions.join('\n');
    
    if (currentValue) {
        input.value = currentValue + '\n\n' + newQuestions;
    } else {
        input.value = newQuestions;
    }
    
    updateCharacterCount();
    updateQuestionCount();
    
    // Close modal
    const modal = document.querySelector('.ai-questions-modal');
    if (modal) {
        modal.remove();
    }
    
    showNotification('Questions added to input!', 'success');
}

// AI question generation by level
function generateQuestions(level, topic) {
    if (qBloomAI) {
        const count = parseInt(prompt('How many questions would you like to generate?', '5')) || 5;
        qBloomAI.generateQuestionsByLevel(level, topic, count);
    }
}