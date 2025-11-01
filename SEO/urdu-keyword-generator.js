// Urdu Keyword Generator - Main JavaScript
class UrduKeywordGenerator {
    constructor() {
        this.totalGenerated = 0;
        this.currentKeywords = [];
        this.isDarkMode = false;
        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.loadTrendingTopics();
        this.loadAISuggestions();
        this.loadFromLocalStorage();
        this.applyTheme();
    }

    setupEventListeners() {
        // تھیم سوئچر
        document.getElementById('urdu-keyword-generator-dark-mode-toggle')
            .addEventListener('click', () => this.toggleTheme());

        // جنریٹ بٹن
        document.getElementById('urdu-keyword-generator-generate-btn')
            .addEventListener('click', () => this.generateKeywords());

        // ایکشن بٹنز
        document.getElementById('urdu-keyword-generator-copy-btn')
            .addEventListener('click', () => this.copyKeywords());

        document.getElementById('urdu-keyword-generator-save-btn')
            .addEventListener('click', () => this.saveKeywords());

        // ڈاؤن لوڈ بٹنز
        document.getElementById('urdu-keyword-generator-download-txt')
            .addEventListener('click', () => this.downloadTXT());

        document.getElementById('urdu-keyword-generator-download-doc')
            .addEventListener('click', () => this.downloadDOC());

        document.getElementById('urdu-keyword-generator-download-pdf')
            .addEventListener('click', () => this.downloadPDF());

        // ان پٹ ایونٹس
        document.getElementById('urdu-keyword-generator-topic')
            .addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.generateKeywords();
            });
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        this.applyTheme();
        this.saveToLocalStorage();
    }

    applyTheme() {
        const theme = this.isDarkMode ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        
        const themeBtn = document.getElementById('urdu-keyword-generator-dark-mode-toggle');
        themeBtn.innerHTML = this.isDarkMode ? 
            '<span class="urdu-keyword-generator-theme-icon">☀️</span> لائٹ موڈ' :
            '<span class="urdu-keyword-generator-theme-icon">🌙</span> ڈارک موڈ';
    }

    async generateKeywords() {
        const topic = document.getElementById('urdu-keyword-generator-topic').value.trim();
        const description = document.getElementById('urdu-keyword-generator-description').value.trim();
        const keywordType = document.getElementById('urdu-keyword-generator-keyword-type').value;
        const creativity = parseInt(document.getElementById('urdu-keyword-generator-creativity').value);

        if (!topic) {
            this.showNotification('براہ کرم ایک موضوع درج کریں', 'error');
            return;
        }

        this.showLoading(true);

        try {
            // مصنوعی تاخیر (AI اثر کے لیے)
            await new Promise(resolve => setTimeout(resolve, 1500));

            const keywords = this.processKeywords(topic, description, keywordType, creativity);
            this.displayKeywords(keywords);
            this.updateStats();
            this.showNotification('کلیدی الفاظ کامیابی سے جنریٹ ہوگئے!', 'success');
            
        } catch (error) {
            this.showNotification('جنریٹ کرنے میں مسئلہ ہوا', 'error');
            console.error('Keyword generation error:', error);
        } finally {
            this.showLoading(false);
        }
    }

    processKeywords(topic, description, type, creativity) {
        let keywords = [];
        const templates = UrduKeywordGeneratorData.keywordTemplates;

        // بنیادی ٹیمپلیٹس سے کلیدی الفاظ
        if (type === 'general' || type === 'all') {
            keywords = keywords.concat(
                templates.general.map(t => this.applyCreativity(t.replace('{}', topic), creativity))
            );
        }

        if (type === 'long-tail' || type === 'all') {
            keywords = keywords.concat(
                templates.longTail.map(t => this.applyCreativity(t.replace('{}', topic), creativity))
            );
        }

        if (type === 'questions' || type === 'all') {
            keywords = keywords.concat(
                templates.questions.map(t => this.applyCreativity(t.replace('{}', topic), creativity))
            );
        }

        // AI تخلیقی الفاظ
        if (creativity > 5) {
            const aiKeywords = this.generateAICreativeKeywords(topic, creativity);
            keywords = keywords.concat(aiKeywords);
        }

        // تفصیل سے اضافی الفاظ
        if (description) {
            const descKeywords = this.generateDescriptionKeywords(topic, description);
            keywords = keywords.concat(descKeywords);
        }

        // مکس اور محدود کریں
        return this.shuffleArray(keywords).slice(0, 20 + creativity);
    }

    applyCreativity(keyword, creativity) {
        if (creativity <= 5) return keyword;

        const modifiers = UrduKeywordGeneratorData.creativityModifiers;
        const randomModifier = modifiers[Math.floor(Math.random() * modifiers.length)];
        
        return creativity > 8 ? 
            `${keyword} ${randomModifier}` : 
            keyword;
    }

    generateAICreativeKeywords(topic, creativity) {
        const aiTemplates = [
            `2024 میں ${topic} کے رجحانات`,
            `${topic} کا مستقبل`,
            `${topic} سے پیسہ کمانے کے طریقے`,
            `${topic} کے بارے میں انکشافات`,
            `${topic} کی مکمل گائیڈ`,
            `${topic} کے حیرت انگیز حقائق`,
            `${topic} کا آخری نسخہ`,
            `${topic} کے راز`
        ];

        return aiTemplates.map(template => template);
    }

    generateDescriptionKeywords(topic, description) {
        const words = description.split(' ').filter(word => word.length > 3);
        if (words.length === 0) return [];

        return [
            `${topic} ${words.slice(0, 2).join(' ')}`,
            `${words[0]} کے ساتھ ${topic}`,
            `${topic} اور ${words[0]} کا تعلق`
        ];
    }

    displayKeywords(keywords) {
        const container = document.getElementById('urdu-keyword-generator-keywords-container');
        container.innerHTML = '';

        keywords.forEach((keyword, index) => {
            const keywordElement = document.createElement('div');
            keywordElement.className = 'urdu-keyword-generator-keyword urdu-keyword-generator-fade-in';
            keywordElement.textContent = keyword;
            keywordElement.style.animationDelay = `${index * 0.1}s`;
            
            keywordElement.addEventListener('click', () => {
                this.copySingleKeyword(keyword);
            });

            container.appendChild(keywordElement);
        });

        this.currentKeywords = keywords;
        document.getElementById('urdu-keyword-generator-results-section').style.display = 'block';
    }

    copyKeywords() {
        const text = this.currentKeywords.join('\n');
        this.copyToClipboard(text, 'تمام کلیدی الفاظ کاپی ہوگئے!');
    }

    copySingleKeyword(keyword) {
        this.copyToClipboard(keyword, 'کلیدی لفظ کاپی ہوگیا!');
    }

    async copyToClipboard(text, successMessage) {
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification(successMessage, 'success');
        } catch (err) {
            // فال بیک طریقہ
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showNotification(successMessage, 'success');
        }
    }

    saveKeywords() {
        const topic = document.getElementById('urdu-keyword-generator-topic').value;
        const savedKeywords = JSON.parse(localStorage.getItem('urdu-keyword-generator-saved') || '[]');
        
        const saveData = {
            id: Date.now(),
            topic: topic,
            keywords: this.currentKeywords,
            timestamp: new Date().toLocaleString('ur-PK'),
            type: document.getElementById('urdu-keyword-generator-keyword-type').value
        };

        savedKeywords.unshift(saveData);
        localStorage.setItem('urdu-keyword-generator-saved', JSON.stringify(savedKeywords));
        
        this.showNotification('کلیدی الفاظ محفوظ ہوگئے!', 'success');
    }

    downloadTXT() {
        const content = this.currentKeywords.join('\n');
        this.downloadFile(content, 'urdu-keywords.txt', 'text/plain');
    }

    downloadDOC() {
        const content = `
            <html>
            <head>
                <meta charset="UTF-8">
                <title>اردو کلیدی الفاظ</title>
                <style>
                    body { font-family: 'Jameel Noori Nastaleeq', Tahoma; direction: rtl; text-align: right; }
                    h1 { color: #1a5276; }
                    .keyword { background: #eaf2f8; padding: 8px 12px; margin: 5px; display: inline-block; border-radius: 5px; }
                </style>
            </head>
            <body>
                <h1>تجاویز کردہ کلیدی الفاظ</h1>
                <p>موضوع: ${document.getElementById('urdu-keyword-generator-topic').value}</p>
                <p>تاریخ: ${new Date().toLocaleDateString('ur-PK')}</p>
                <div>
                    ${this.currentKeywords.map(kw => `<span class="keyword">${kw}</span>`).join(' ')}
                </div>
            </body>
            </html>
        `;
        this.downloadFile(content, 'urdu-keywords.doc', 'application/msword');
    }

    downloadPDF() {
        // PDF جنریشن کے لیے سادہ طریقہ
        const content = `
            اردو کلیدی الفاظ - تجاویز
            موضوع: ${document.getElementById('urdu-keyword-generator-topic').value}
            تاریخ: ${new Date().toLocaleDateString('ur-PK')}
            
            کلیدی الفاظ:
            ${this.currentKeywords.join('\n• ')}
        `;
        this.downloadFile(content, 'urdu-keywords.pdf', 'application/pdf');
    }

    downloadFile(content, fileName, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);

        this.showNotification(`${fileName} ڈاؤن لوڈ ہوگیا!`, 'success');
    }

    loadTrendingTopics() {
        const container = document.getElementById('urdu-keyword-generator-trending-topics-container');
        const topics = UrduKeywordGeneratorData.trendingTopics;

        container.innerHTML = '';
        topics.forEach(topic => {
            const topicElement = document.createElement('div');
            topicElement.className = 'urdu-keyword-generator-trending-topic';
            topicElement.textContent = topic;
            topicElement.addEventListener('click', () => {
                document.getElementById('urdu-keyword-generator-topic').value = topic;
                this.showNotification('موضوع خودکار طریقے سے شامل ہوگیا', 'info');
            });
            container.appendChild(topicElement);
        });
    }

    loadAISuggestions() {
        const container = document.getElementById('urdu-keyword-generator-ai-suggestions-container');
        const suggestions = UrduKeywordGeneratorData.aiSuggestions;

        container.innerHTML = '';
        suggestions.forEach(suggestion => {
            const card = document.createElement('div');
            card.className = 'urdu-keyword-generator-ai-card';
            card.innerHTML = `
                <h3>${suggestion.title}</h3>
                <p>${suggestion.content}</p>
            `;
            container.appendChild(card);
        });
    }

    updateStats() {
        this.totalGenerated += this.currentKeywords.length;
        document.getElementById('urdu-keyword-generator-total-generated').textContent = this.totalGenerated;
    }

    showLoading(show) {
        const loading = document.getElementById('urdu-keyword-generator-loading');
        loading.style.display = show ? 'flex' : 'none';
    }

    showNotification(message, type) {
        // سادہ نوٹیفکیشن سسٹم
        const notification = document.createElement('div');
        notification.className = `urdu-keyword-generator-notification urdu-keyword-generator-notification-${type}`;
        notification.textContent = message;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '8px',
            zIndex: '10000',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'urdu-keyword-generator-fadeIn 0.3s reverse';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('urdu-keyword-generator-data');
        if (saved) {
            const data = JSON.parse(saved);
            this.totalGenerated = data.totalGenerated || 0;
            this.isDarkMode = data.isDarkMode || false;
        }
    }

    saveToLocalStorage() {
        const data = {
            totalGenerated: this.totalGenerated,
            isDarkMode: this.isDarkMode
        };
        localStorage.setItem('urdu-keyword-generator-data', JSON.stringify(data));
    }
}

// ایپ شروع کریں جب صفحہ لوڈ ہو
document.addEventListener('DOMContentLoaded', () => {
    window.urduKeywordGenerator = new UrduKeywordGenerator();
});