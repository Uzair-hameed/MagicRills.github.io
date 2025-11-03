// Urdu Paper Generator - Modern JavaScript
class UrduPaperGenerator {
    constructor() {
        this.objectiveQuestions = [];
        this.subjectiveQuestions = [];
        this.currentTheme = 'light';
        this.fontSize = 'normal';
        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.loadFromLocalStorage();
        this.updateStats();
        this.applyFontFamily();
    }

    setupEventListeners() {
        // Theme Toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Font Size Toggle
        document.getElementById('fontSizeToggle').addEventListener('click', () => {
            this.toggleFontSize();
        });

        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.openTab(e.target.dataset.tab);
            });
        });

        // Auto-save on input changes
        document.querySelectorAll('input, select, textarea').forEach(element => {
            element.addEventListener('input', () => {
                this.saveToLocalStorage();
            });
        });
    }

    applyFontFamily() {
        // Apply Urdu font to all elements
        document.querySelectorAll('body, .paper-preview, .question-preview, .student-info').forEach(el => {
            el.style.fontFamily = "'Jameel Noori Nastaleeq', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        });
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        document.getElementById('themeToggle').textContent = 
            this.currentTheme === 'light' ? '🌙 ڈارک موڈ' : '☀️ لائٹ موڈ';
        this.saveToLocalStorage();
    }

    toggleFontSize() {
        const sizes = ['small', 'normal', 'large', 'x-large'];
        const currentIndex = sizes.indexOf(this.fontSize);
        this.fontSize = sizes[(currentIndex + 1) % sizes.length];
        
        document.body.style.fontSize = {
            'small': '14px',
            'normal': '16px',
            'large': '18px',
            'x-large': '20px'
        }[this.fontSize];

        document.getElementById('fontSizeToggle').textContent = 
            `A${this.fontSize === 'small' ? '⁻' : this.fontSize === 'normal' ? '' : '⁺'} فونٹ سائز`;
        
        this.saveToLocalStorage();
    }

    openTab(tabName) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        // Special handling for preview tab
        if (tabName === 'preview') {
            this.generatePreview();
        }
    }

    // Objective Questions Management
    addObjectiveQuestion(type) {
        const container = document.getElementById('objective-questions-container');
        const questionId = 'obj-q' + Date.now();
        let questionHtml = '';

        switch (type) {
            case 'mcq':
                questionHtml = this.createMCQQuestion(questionId);
                break;
            case 'truefalse':
                questionHtml = this.createTrueFalseQuestion(questionId);
                break;
            case 'fillblank':
                questionHtml = this.createFillBlankQuestion(questionId);
                break;
            case 'matching':
                questionHtml = this.createMatchingQuestion(questionId);
                break;
        }

        container.insertAdjacentHTML('beforeend', questionHtml);
        this.objectiveQuestions.push({
            id: questionId,
            type: type
        });

        this.saveToLocalStorage();
        this.updateStats();
        this.showNotification('سوال کامیابی کے ساتھ شامل کر دیا گیا!');
    }

    createMCQQuestion(questionId) {
        return `
            <div class="question" id="${questionId}">
                <div class="question-header">
                    <span class="question-type">🔘 MCQ سوال</span>
                    <button class="btn-danger" onclick="paperGenerator.removeQuestion('${questionId}', 'objective')">
                        🗑️ حذف کریں
                    </button>
                </div>
                <div class="form-group">
                    <label for="${questionId}-text">سوال:</label>
                    <input type="text" id="${questionId}-text" placeholder="سوال درج کریں">
                </div>
                <div class="form-group">
                    <label>آپشن:</label>
                    <div class="options-container" id="${questionId}-options">
                        <div class="option">
                            <input type="radio" name="${questionId}-correct" value="a" checked>
                            <input type="text" placeholder="آپشن الف">
                        </div>
                        <div class="option">
                            <input type="radio" name="${questionId}-correct" value="b">
                            <input type="text" placeholder="آپشن ب">
                        </div>
                        <div class="option">
                            <input type="radio" name="${questionId}-correct" value="c">
                            <input type="text" placeholder="آپشن ج">
                        </div>
                        <div class="option">
                            <input type="radio" name="${questionId}-correct" value="d">
                            <input type="text" placeholder="آپشن د">
                        </div>
                    </div>
                    <button class="add-option-btn" onclick="paperGenerator.addOption('${questionId}')">
                        ➕ آپشن شامل کریں
                    </button>
                </div>
                <div class="form-group">
                    <label for="${questionId}-marks">نمبر:</label>
                    <input type="number" id="${questionId}-marks" value="1" min="1">
                </div>
            </div>
        `;
    }

    createTrueFalseQuestion(questionId) {
        return `
            <div class="question" id="${questionId}">
                <div class="question-header">
                    <span class="question-type">✅ صحیح/غلط سوال</span>
                    <button class="btn-danger" onclick="paperGenerator.removeQuestion('${questionId}', 'objective')">
                        🗑️ حذف کریں
                    </button>
                </div>
                <div class="form-group">
                    <label for="${questionId}-text">سوال:</label>
                    <input type="text" id="${questionId}-text" placeholder="سوال درج کریں">
                </div>
                <div class="form-group">
                    <label>درست جواب:</label>
                    <div style="display: flex; gap: 2rem;">
                        <label><input type="radio" name="${questionId}-correct" value="true" checked> ✅ صحیح</label>
                        <label><input type="radio" name="${questionId}-correct" value="false"> ❌ غلط</label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="${questionId}-marks">نمبر:</label>
                    <input type="number" id="${questionId}-marks" value="1" min="1">
                </div>
            </div>
        `;
    }

    createFillBlankQuestion(questionId) {
        return `
            <div class="question" id="${questionId}">
                <div class="question-header">
                    <span class="question-type">📝 خالی جگہ سوال</span>
                    <button class="btn-danger" onclick="paperGenerator.removeQuestion('${questionId}', 'objective')">
                        🗑️ حذف کریں
                    </button>
                </div>
                <div class="form-group">
                    <label for="${questionId}-text">سوال:</label>
                    <input type="text" id="${questionId}-text" placeholder="سوال درج کریں (خالی جگہ کے لیے _____ استعمال کریں)">
                </div>
                <div class="form-group">
                    <label for="${questionId}-answer">جواب:</label>
                    <input type="text" id="${questionId}-answer" placeholder="درست جواب درج کریں">
                </div>
                <div class="form-group">
                    <label for="${questionId}-marks">نمبر:</label>
                    <input type="number" id="${questionId}-marks" value="1" min="1">
                </div>
            </div>
        `;
    }

    createMatchingQuestion(questionId) {
        return `
            <div class="question" id="${questionId}">
                <div class="question-header">
                    <span class="question-type">🔗 میچنگ کالم سوال</span>
                    <button class="btn-danger" onclick="paperGenerator.removeQuestion('${questionId}', 'objective')">
                        🗑️ حذف کریں
                    </button>
                </div>
                <div class="form-group">
                    <label for="${questionId}-text">ہدایات:</label>
                    <input type="text" id="${questionId}-text" placeholder="ہدایات درج کریں">
                </div>
                <div class="form-group">
                    <label>اشیا:</label>
                    <div class="matching-items" id="${questionId}-items">
                        <div class="option">
                            <input type="text" placeholder="اشیا (الف)" style="flex: 1;">
                            <input type="text" placeholder="مطابقت (1)" style="flex: 1;">
                            <button class="btn-danger" onclick="paperGenerator.removeMatchingItem(this)">🗑️</button>
                        </div>
                        <div class="option">
                            <input type="text" placeholder="اشیا (ب)" style="flex: 1;">
                            <input type="text" placeholder="مطابقت (2)" style="flex: 1;">
                            <button class="btn-danger" onclick="paperGenerator.removeMatchingItem(this)">🗑️</button>
                        </div>
                    </div>
                    <button class="add-option-btn" onclick="paperGenerator.addMatchingItem('${questionId}')">
                        ➕ اشیا شامل کریں
                    </button>
                </div>
                <div class="form-group">
                    <label for="${questionId}-marks">نمبر:</label>
                    <input type="number" id="${questionId}-marks" value="1" min="1">
                </div>
            </div>
        `;
    }

    addOption(questionId) {
        const optionsContainer = document.getElementById(`${questionId}-options`);
        const optionLetters = ['الف', 'ب', 'ج', 'د', 'ہ', 'و', 'ز', 'ح', 'ط', 'ی'];
        const optionCount = optionsContainer.children.length;
        
        if (optionCount < optionLetters.length) {
            const newOption = document.createElement('div');
            newOption.className = 'option';
            newOption.innerHTML = `
                <input type="radio" name="${questionId}-correct" value="${String.fromCharCode(97 + optionCount)}">
                <input type="text" placeholder="آپشن ${optionLetters[optionCount]}">
            `;
            optionsContainer.appendChild(newOption);
        } else {
            this.showNotification('زیادہ سے زیادہ 10 آپشن شامل کیے جا سکتے ہیں', 'error');
        }
    }

    addMatchingItem(questionId) {
        const itemsContainer = document.getElementById(`${questionId}-items`);
        const itemLetters = ['الف', 'ب', 'ج', 'د', 'ہ', 'و', 'ز', 'ح', 'ط', 'ی'];
        const itemCount = itemsContainer.children.length;
        
        if (itemCount < itemLetters.length) {
            const newItem = document.createElement('div');
            newItem.className = 'option';
            newItem.innerHTML = `
                <input type="text" placeholder="اشیا (${itemLetters[itemCount]})" style="flex: 1;">
                <input type="text" placeholder="مطابقت (${itemCount + 1})" style="flex: 1;">
                <button class="btn-danger" onclick="paperGenerator.removeMatchingItem(this)">🗑️</button>
            `;
            itemsContainer.appendChild(newItem);
        } else {
            this.showNotification('زیادہ سے زیادہ 10 اشیا شامل کی جا سکتی ہیں', 'error');
        }
    }

    removeMatchingItem(button) {
        button.parentElement.remove();
        this.saveToLocalStorage();
    }

    // Subjective Questions Management
    addSubjectiveQuestion(type) {
        const container = document.getElementById('subjective-questions-container');
        const questionId = 'subj-q' + Date.now();
        let questionHtml = '';

        switch (type) {
            case 'short':
                questionHtml = this.createShortQuestion(questionId);
                break;
            case 'long':
                questionHtml = this.createLongQuestion(questionId);
                break;
            case 'comprehension':
                questionHtml = this.createComprehensionQuestion(questionId);
                break;
        }

        container.insertAdjacentHTML('beforeend', questionHtml);
        this.subjectiveQuestions.push({
            id: questionId,
            type: type
        });

        this.saveToLocalStorage();
        this.updateStats();
        this.showNotification('سوال کامیابی کے ساتھ شامل کر دیا گیا!');
    }

    createShortQuestion(questionId) {
        return `
            <div class="question" id="${questionId}">
                <div class="question-header">
                    <span class="question-type">📄 مختصر سوال</span>
                    <button class="btn-danger" onclick="paperGenerator.removeQuestion('${questionId}', 'subjective')">
                        🗑️ حذف کریں
                    </button>
                </div>
                <div class="form-group">
                    <label for="${questionId}-text">سوال:</label>
                    <input type="text" id="${questionId}-text" placeholder="سوال درج کریں">
                </div>
                <div class="form-group">
                    <label for="${questionId}-lines">جواب کے لیے لائنیں:</label>
                    <input type="number" id="${questionId}-lines" value="3" min="1">
                </div>
                <div class="form-group">
                    <label for="${questionId}-marks">نمبر:</label>
                    <input type="number" id="${questionId}-marks" value="2" min="1">
                </div>
            </div>
        `;
    }

    createLongQuestion(questionId) {
        return `
            <div class="question" id="${questionId}">
                <div class="question-header">
                    <span class="question-type">📑 طویل سوال</span>
                    <button class="btn-danger" onclick="paperGenerator.removeQuestion('${questionId}', 'subjective')">
                        🗑️ حذف کریں
                    </button>
                </div>
                <div class="form-group">
                    <label for="${questionId}-text">سوال:</label>
                    <input type="text" id="${questionId}-text" placeholder="سوال درج کریں">
                </div>
                <div class="form-group">
                    <label for="${questionId}-lines">جواب کے لیے لائنیں:</label>
                    <input type="number" id="${questionId}-lines" value="10" min="1">
                </div>
                <div class="form-group">
                    <label for="${questionId}-marks">نمبر:</label>
                    <input type="number" id="${questionId}-marks" value="5" min="1">
                </div>
            </div>
        `;
    }

    createComprehensionQuestion(questionId) {
        return `
            <div class="question" id="${questionId}">
                <div class="question-header">
                    <span class="question-type">📖 تشریحی سوال</span>
                    <button class="btn-danger" onclick="paperGenerator.removeQuestion('${questionId}', 'subjective')">
                        🗑️ حذف کریں
                    </button>
                </div>
                <div class="form-group">
                    <label for="${questionId}-paragraph">پیراگراف:</label>
                    <textarea id="${questionId}-paragraph" placeholder="پیراگراف درج کریں" rows="4"></textarea>
                </div>
                <div class="form-group">
                    <label for="${questionId}-text">سوال:</label>
                    <input type="text" id="${questionId}-text" placeholder="سوال درج کریں">
                </div>
                <div class="form-group">
                    <label for="${questionId}-lines">جواب کے لیے لائنیں:</label>
                    <input type="number" id="${questionId}-lines" value="8" min="1">
                </div>
                <div class="form-group">
                    <label for="${questionId}-marks">نمبر:</label>
                    <input type="number" id="${questionId}-marks" value="5" min="1">
                </div>
            </div>
        `;
    }

    removeQuestion(questionId, type) {
        const questionElement = document.getElementById(questionId);
        if (questionElement) {
            questionElement.remove();
        }
        
        if (type === 'objective') {
            this.objectiveQuestions = this.objectiveQuestions.filter(q => q.id !== questionId);
        } else {
            this.subjectiveQuestions = this.subjectiveQuestions.filter(q => q.id !== questionId);
        }

        this.saveToLocalStorage();
        this.updateStats();
        this.showNotification('سوال کامیابی کے ساتھ حذف کر دیا گیا!');
    }

    // Preview Generation - FIXED VERSION
    generatePreview() {
        const previewContainer = document.getElementById('paper-preview');
        let previewHtml = '';
        
        // Header
        const schoolName = document.getElementById('school-name').value || '_________________________';
        const paperTitle = document.getElementById('paper-title').value || 'پرچہ';
        const term = document.getElementById('term').value || 'پہلا';
        const subject = document.getElementById('subject').value || '__________';
        const totalMarks = document.getElementById('total-marks').value || '_____';
        const time = document.getElementById('time').value || '_____';
        const instructions = document.getElementById('instructions').value || '';
        
        previewHtml += `
            <div class="paper-header urdu-text">
                <div class="paper-title">${schoolName}</div>
                <div class="paper-title">${paperTitle}</div>
                <div class="student-info">
                    <span>نام: ______________</span>
                    <span>کلاس: ___________</span>
                    <span>مضمون: ${subject}</span>
                    <span>تاریخ: __________</span>
                </div>
                <div class="student-info">
                    <span>ٹرم: ${term}</span>
                    <span>کل نمبر: ${totalMarks}</span>
                    <span>وقت: ${time}</span>
                </div>
            </div>
        `;
        
        if (instructions) {
            previewHtml += `
                <div class="instructions urdu-text">
                    <h3>ہدایات:</h3>
                    <p>${instructions.replace(/\n/g, '<br>')}</p>
                </div>
            `;
        }
        
        // Objective Section
        if (this.objectiveQuestions.length > 0) {
            let objectiveTotalMarks = 0;
            previewHtml += `
                <div class="section-header urdu-text">
                    <h2>حصہ معروضی (کل نمبر: _____)</h2>
                    <p>درست جوابات کے گرد دائرہ لگائیں۔</p>
                </div>
            `;
            
            this.objectiveQuestions.forEach((q, index) => {
                const questionElement = document.getElementById(`${q.id}-text`);
                const marksElement = document.getElementById(`${q.id}-marks`);
                
                const questionText = questionElement ? questionElement.value : `سوال نمبر ${index + 1}`;
                const marks = marksElement ? parseInt(marksElement.value) || 1 : 1;
                objectiveTotalMarks += marks;
                
                switch (q.type) {
                    case 'mcq':
                        const optionsContainer = document.getElementById(`${q.id}-options`);
                        let options = [];
                        if (optionsContainer) {
                            options = Array.from(optionsContainer.querySelectorAll('input[type="text"]')).map((opt, i) => {
                                const optionText = opt.value || ['الف', 'ب', 'ج', 'د', 'ہ', 'و', 'ز', 'ح', 'ط', 'ی'][i];
                                return `(${['الف', 'ب', 'ج', 'د', 'ہ', 'و', 'ز', 'ح', 'ط', 'ی'][i]}) ${optionText}`;
                            });
                        }
                        
                        previewHtml += `
                            <div class="question-preview urdu-text">
                                <p><strong>سوال نمبر ${index + 1}:</strong> ${questionText} (${marks} نمبر)</p>
                                <div class="mcq-options">
                                    ${options.map(opt => `<div class="mcq-option">${opt}</div>`).join('')}
                                </div>
                            </div>
                        `;
                        break;
                        
                    case 'truefalse':
                        previewHtml += `
                            <div class="question-preview urdu-text">
                                <p><strong>سوال نمبر ${index + 1}:</strong> ${questionText} (${marks} نمبر)</p>
                                <p>✅ صحیح | ❌ غلط</p>
                            </div>
                        `;
                        break;
                        
                    case 'fillblank':
                        previewHtml += `
                            <div class="question-preview urdu-text">
                                <p><strong>سوال نمبر ${index + 1}:</strong> ${questionText.replace(/_____/g, '__________')} (${marks} نمبر)</p>
                            </div>
                        `;
                        break;
                        
                    case 'matching':
                        const itemsContainer = document.getElementById(`${q.id}-items`);
                        let items = [];
                        if (itemsContainer) {
                            items = Array.from(itemsContainer.querySelectorAll('.option')).map((item, i) => {
                                const inputs = item.querySelectorAll('input[type="text"]');
                                const left = inputs[0] ? inputs[0].value : ['الف', 'ب', 'ج', 'د', 'ہ', 'و', 'ز', 'ح', 'ط', 'ی'][i];
                                const right = inputs[1] ? inputs[1].value : (i + 1);
                                return `(${['الف', 'ب', 'ج', 'د', 'ہ', 'و', 'ز', 'ح', 'ط', 'ی'][i]}) ${left} ________ (${right})`;
                            });
                        }
                        
                        previewHtml += `
                            <div class="question-preview urdu-text">
                                <p><strong>سوال نمبر ${index + 1}:</strong> ${questionText} (${marks} نمبر)</p>
                                ${items.map(item => `<p>${item}</p>`).join('')}
                            </div>
                        `;
                        break;
                }
            });
            
            previewHtml += `<div class="total-marks urdu-text">حصہ معروضی کے کل نمبر: ${objectiveTotalMarks}</div>`;
        }
        
        // Subjective Section
        if (this.subjectiveQuestions.length > 0) {
            let subjectiveTotalMarks = 0;
            previewHtml += `<div class="section-header urdu-text"><h2>حصہ انشائیہ (کل نمبر: _____)</h2></div>`;
            
            this.subjectiveQuestions.forEach((q, index) => {
                const questionElement = document.getElementById(`${q.id}-text`);
                const marksElement = document.getElementById(`${q.id}-marks`);
                const linesElement = document.getElementById(`${q.id}-lines`);
                
                const questionText = questionElement ? questionElement.value : `سوال نمبر ${index + 1 + this.objectiveQuestions.length}`;
                const marks = marksElement ? parseInt(marksElement.value) || 1 : 1;
                const lines = linesElement ? parseInt(linesElement.value) || 3 : 3;
                subjectiveTotalMarks += marks;
                
                switch (q.type) {
                    case 'short':
                        previewHtml += `
                            <div class="question-preview urdu-text">
                                <p><strong>سوال نمبر ${index + 1 + this.objectiveQuestions.length}:</strong> ${questionText} (${marks} نمبر)</p>
                                ${'<div class="answer-space"></div>'.repeat(lines)}
                            </div>
                        `;
                        break;
                        
                    case 'long':
                        previewHtml += `
                            <div class="question-preview urdu-text">
                                <p><strong>سوال نمبر ${index + 1 + this.objectiveQuestions.length}:</strong> ${questionText} (${marks} نمبر)</p>
                                ${'<div class="answer-space"></div>'.repeat(lines)}
                            </div>
                        `;
                        break;
                        
                    case 'comprehension':
                        const paragraphElement = document.getElementById(`${q.id}-paragraph`);
                        const paragraph = paragraphElement ? paragraphElement.value : '';
                        previewHtml += `
                            <div class="question-preview urdu-text">
                                <p><strong>پڑھئیے اور جواب دیں:</strong></p>
                                <p>${paragraph.replace(/\n/g, '<br>')}</p>
                                <p><strong>سوال نمبر ${index + 1 + this.objectiveQuestions.length}:</strong> ${questionText} (${marks} نمبر)</p>
                                ${'<div class="answer-space"></div>'.repeat(lines)}
                            </div>
                        `;
                        break;
                }
            });
            
            previewHtml += `<div class="total-marks urdu-text">حصہ انشائیہ کے کل نمبر: ${subjectiveTotalMarks}</div>`;
        }
        
        // Footer
        previewHtml += `
            <div class="total-marks urdu-text">
                <p>کل نمبر: ${totalMarks}</p>
                <p>حاصل کردہ نمبر: _______</p>
            </div>
        `;
        
        previewContainer.innerHTML = previewHtml;
        
        // Apply Urdu font to all preview elements
        this.applyFontFamily();
    }

    // AI Integration
    async generateAIQuestions() {
        this.showLoading(true);
        
        const topic = document.getElementById('ai-topic').value;
        const grade = document.getElementById('ai-grade').value;
        const questionType = document.getElementById('ai-question-type').value;
        const count = document.getElementById('ai-count').value;

        if (!topic) {
            this.showNotification('براہ کرم موضوع درج کریں', 'error');
            this.showLoading(false);
            return;
        }

        try {
            // Simulate AI API call (replace with actual API)
            const questions = await this.simulateAIGeneration(topic, grade, questionType, count);
            this.displayAIResults(questions);
            this.showNotification('AI سوالات کامیابی کے ساتھ جنریٹ ہو گئے!');
        } catch (error) {
            this.showNotification('AI جنریشن میں خرابی', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    simulateAIGeneration(topic, grade, type, count) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const questions = [];
                const types = {
                    'mcq': 'MCQ سوال',
                    'short': 'مختصر سوال',
                    'long': 'طویل سوال',
                    'mixed': 'مخلوط سوال'
                };

                for (let i = 0; i < count; i++) {
                    questions.push({
                        type: types[type],
                        question: `${topic} کے بارے میں سوال نمبر ${i + 1} (جماعت ${grade})`,
                        marks: type === 'mcq' ? 1 : type === 'short' ? 2 : 5
                    });
                }
                resolve(questions);
            }, 2000);
        });
    }

    displayAIResults(questions) {
        const resultsContainer = document.getElementById('ai-results');
        let resultsHtml = '<h3 class="urdu-text">جنریٹ شدہ سوالات:</h3>';
        
        questions.forEach((q, index) => {
            resultsHtml += `
                <div class="question urdu-text">
                    <div class="question-header">
                        <span class="question-type">${q.type}</span>
                        <button class="control-btn" onclick="paperGenerator.addAIQuestion(${index})">
                            ➕ شامل کریں
                        </button>
                    </div>
                    <p><strong>سوال ${index + 1}:</strong> ${q.question}</p>
                    <p><strong>نمبر:</strong> ${q.marks}</p>
                </div>
            `;
        });

        resultsContainer.innerHTML = resultsHtml;
        this.aiGeneratedQuestions = questions;
    }

    addAIQuestion(index) {
        const question = this.aiGeneratedQuestions[index];
        if (question.type.includes('MCQ')) {
            this.addObjectiveQuestion('mcq');
        } else if (question.type.includes('مختصر')) {
            this.addSubjectiveQuestion('short');
        } else {
            this.addSubjectiveQuestion('long');
        }
        
        // Auto-fill the last added question
        const allQuestions = [...this.objectiveQuestions, ...this.subjectiveQuestions];
        const lastQuestion = allQuestions[allQuestions.length - 1];
        if (lastQuestion) {
            const textInput = document.getElementById(`${lastQuestion.id}-text`);
            const marksInput = document.getElementById(`${lastQuestion.id}-marks`);
            if (textInput) textInput.value = question.question;
            if (marksInput) marksInput.value = question.marks;
        }
        
        this.showNotification('سوال کامیابی کے ساتھ شامل کر دیا گیا!');
    }

    // Export Functions
    printPaper() {
        this.generatePreview(); // Ensure preview is updated
        setTimeout(() => {
            window.print();
        }, 100);
    }

    exportToPDF() {
        // Use the PDF exporter from urdu-paper-generator-pdf.js
        if (typeof exportToPDF === 'function') {
            exportToPDF();
        } else {
            this.showNotification('PDF ایکسپورٹر لوڈ نہیں ہو سکا', 'error');
        }
    }

    exportToDOC() {
        // Use the DOC exporter from urdu-paper-generator-doc.js
        if (typeof exportToDOC === 'function') {
            exportToDOC();
        } else {
            this.showNotification('DOC ایکسپورٹر لوڈ نہیں ہو سکا', 'error');
        }
    }

    saveTemplate() {
        const template = {
            schoolName: document.getElementById('school-name').value,
            paperTitle: document.getElementById('paper-title').value,
            subject: document.getElementById('subject').value,
            objectiveQuestions: this.objectiveQuestions,
            subjectiveQuestions: this.subjectiveQuestions
        };
        
        localStorage.setItem('urduPaperTemplate', JSON.stringify(template));
        this.showNotification('ٹیمپلیٹ کامیابی کے ساتھ محفوظ ہو گیا!');
    }

    loadTemplate() {
        const template = localStorage.getItem('urduPaperTemplate');
        if (template) {
            const data = JSON.parse(template);
            document.getElementById('school-name').value = data.schoolName || '';
            document.getElementById('paper-title').value = data.paperTitle || '';
            document.getElementById('subject').value = data.subject || '';
            this.showNotification('ٹیمپلیٹ کامیابی کے ساتھ لوڈ ہو گیا!');
        } else {
            this.showNotification('کوئی محفوظ شدہ ٹیمپلیٹ نہیں ملا', 'error');
        }
    }

    // Utility Functions
    showLoading(show) {
        document.getElementById('loading').style.display = show ? 'flex' : 'none';
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('successNotification');
        notification.querySelector('.notification-text').textContent = message;
        
        if (type === 'error') {
            notification.style.background = 'var(--accent-color)';
        } else {
            notification.style.background = 'var(--secondary-color)';
        }
        
        notification.style.display = 'flex';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    updateStats() {
        const totalQuestions = this.objectiveQuestions.length + this.subjectiveQuestions.length;
        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length > 2) {
            statNumbers[2].textContent = totalQuestions;
        }
    }

    saveToLocalStorage() {
        const data = {
            theme: this.currentTheme,
            fontSize: this.fontSize,
            formData: {
                schoolName: document.getElementById('school-name').value,
                paperTitle: document.getElementById('paper-title').value,
                term: document.getElementById('term').value,
                subject: document.getElementById('subject').value,
                totalMarks: document.getElementById('total-marks').value,
                time: document.getElementById('time').value,
                instructions: document.getElementById('instructions').value
            },
            objectiveQuestions: this.objectiveQuestions,
            subjectiveQuestions: this.subjectiveQuestions
        };
        localStorage.setItem('urduPaperGenerator', JSON.stringify(data));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('urduPaperGenerator');
        if (saved) {
            const data = JSON.parse(saved);
            
            // Load theme and font size
            this.currentTheme = data.theme || 'light';
            this.fontSize = data.fontSize || 'normal';
            document.documentElement.setAttribute('data-theme', this.currentTheme);
            document.body.style.fontSize = {
                'small': '14px',
                'normal': '16px',
                'large': '18px',
                'x-large': '20px'
            }[this.fontSize];
            
            // Update toggle buttons
            document.getElementById('themeToggle').textContent = 
                this.currentTheme === 'light' ? '🌙 ڈارک موڈ' : '☀️ لائٹ موڈ';
            document.getElementById('fontSizeToggle').textContent = 
                `A${this.fontSize === 'small' ? '⁻' : this.fontSize === 'normal' ? '' : '⁺'} فونٹ سائز`;
            
            // Load form data
            if (data.formData) {
                document.getElementById('school-name').value = data.formData.schoolName || '';
                document.getElementById('paper-title').value = data.formData.paperTitle || '';
                document.getElementById('term').value = data.formData.term || 'پہلا';
                document.getElementById('subject').value = data.formData.subject || '';
                document.getElementById('total-marks').value = data.formData.totalMarks || '';
                document.getElementById('time').value = data.formData.time || '';
                document.getElementById('instructions').value = data.formData.instructions || '';
            }
            
            // Load questions
            this.objectiveQuestions = data.objectiveQuestions || [];
            this.subjectiveQuestions = data.subjectiveQuestions || [];
            
            this.showNotification('ڈیٹا کامیابی کے ساتھ لوڈ ہو گیا!');
        }
    }
}

// Initialize the application
const paperGenerator = new UrduPaperGenerator();

// Global functions for HTML onclick handlers
function openTab(tabName) {
    paperGenerator.openTab(tabName);
}

function addObjectiveQuestion(type) {
    paperGenerator.addObjectiveQuestion(type);
}

function addSubjectiveQuestion(type) {
    paperGenerator.addSubjectiveQuestion(type);
}

function generateAIQuestions() {
    paperGenerator.generateAIQuestions();
}

function printPaper() {
    paperGenerator.printPaper();
}

function exportToPDF() {
    paperGenerator.exportToPDF();
}

function exportToDOC() {
    paperGenerator.exportToDOC();
}

function saveTemplate() {
    paperGenerator.saveTemplate();
}

function loadTemplate() {
    paperGenerator.loadTemplate();
}

// Make functions available globally for HTML onclick
window.paperGenerator = paperGenerator;