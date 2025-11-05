// Main Application Class
class PlagiarismParaphrasingTool {
    constructor() {
        this.currentTone = 'formal';
        this.totalChecks = 0;
        this.timeSaved = 0;
        this.isDarkMode = false;
        this.paraphraseHistory = [];
        this.currentText = '';
        this.paraphrasedText = '';
        
        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.loadFromLocalStorage();
        this.updateStats();
        this.checkAPIStatus();
        this.setupAnimations();
        
        // Add sample text for demo
        this.addSampleText();
    }

    setupEventListeners() {
        // Mode Toggle
        document.getElementById('modeToggle').addEventListener('click', () => this.toggleDarkMode());
        
        // Text Input
        document.getElementById('inputText').addEventListener('input', (e) => {
            this.currentText = e.target.value;
            this.updateWordCount();
        });

        // Main Actions
        document.getElementById('checkPlagiarism').addEventListener('click', () => this.checkPlagiarism());
        document.getElementById('paraphraseText').addEventListener('click', () => this.paraphraseText());
        document.getElementById('improveText').addEventListener('click', () => this.improveWriting());
        document.getElementById('clearText').addEventListener('click', () => this.clearText());

        // Output Actions
        document.getElementById('copyParaphrased').addEventListener('click', () => this.copyParaphrasedText());
        document.getElementById('speakText').addEventListener('click', () => this.speakText());
        document.getElementById('useParaphrased').addEventListener('click', () => this.useParaphrasedText());
        document.getElementById('regenerateParaphrase').addEventListener('click', () => this.paraphraseText());
        document.getElementById('toneSelector').addEventListener('click', () => this.openToneModal());

        // Modal
        document.querySelector('.close-modal').addEventListener('click', () => this.closeToneModal());
        document.querySelectorAll('.tone-option').forEach(option => {
            option.addEventListener('click', (e) => this.selectTone(e.currentTarget));
        });

        // Report Actions
        document.getElementById('downloadReport').addEventListener('click', () => this.downloadReport());
        document.getElementById('shareReport').addEventListener('click', () => this.shareReport());
        document.getElementById('detailedReport').addEventListener('click', () => this.showDetailedReport());

        // Close modal when clicking outside
        document.getElementById('toneModal').addEventListener('click', (e) => {
            if (e.target.id === 'toneModal') this.closeToneModal();
        });
    }

    setupAnimations() {
        // Initialize progress circles
        this.initializeProgressCircles();
        
        // Add scroll animations
        this.setupScrollAnimations();
        
        // Setup typing effects
        this.setupTypingEffects();
    }

    initializeProgressCircles() {
        const circles = document.querySelectorAll('.progress-ring-circle');
        circles.forEach(circle => {
            const radius = circle.r.baseVal.value;
            const circumference = radius * 2 * Math.PI;
            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = circumference;
        });
    }

    setProgress(circle, percent) {
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        const offset = circumference - (percent / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }

    updateWordCount() {
        const text = document.getElementById('inputText').value;
        const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
        document.getElementById('currentWordCount').textContent = wordCount;
    }

    async checkPlagiarism() {
        const text = this.currentText.trim();
        if (!text) {
            this.showNotification('Please enter some text to check for plagiarism.', 'warning');
            return;
        }

        if (text.split(/\s+/).length < 10) {
            this.showNotification('Please enter at least 10 words for accurate plagiarism detection.', 'warning');
            return;
        }

        this.showLoading('plagiarismLoading');
        this.hideElement('plagiarismReport');

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Generate mock plagiarism results
            const results = this.generateMockPlagiarismResults(text);
            
            this.displayPlagiarismResults(results);
            this.totalChecks++;
            this.timeSaved += 30; // 30 minutes saved per check
            this.updateStats();
            this.saveToLocalStorage();
            
            this.showNotification('Plagiarism check completed successfully!', 'success');
        } catch (error) {
            this.showNotification('Error checking plagiarism. Please try again.', 'error');
            console.error('Plagiarism check error:', error);
        } finally {
            this.hideLoading('plagiarismLoading');
        }
    }

    generateMockPlagiarismResults(text) {
        const words = text.split(/\s+/);
        const totalWords = words.length;
        
        // Generate random but realistic results
        const directMatch = Math.floor(Math.random() * 20) + 5; // 5-25%
        const paraphrased = Math.floor(Math.random() * 30) + 10; // 10-40%
        const original = 100 - directMatch - paraphrased;
        
        const similarityScore = Math.floor((directMatch + paraphrased * 0.5) * 100) / 100;
        
        // Create highlighted text with plagiarism markers
        let highlightedText = '';
        let i = 0;
        
        while (i < words.length) {
            const chunkSize = Math.floor(Math.random() * 5) + 1; // 1-5 word chunks
            const isPlagiarized = Math.random() < 0.3; // 30% chance of plagiarism
            const chunk = words.slice(i, i + chunkSize).join(' ');
            
            if (isPlagiarized) {
                highlightedText += `<span class="highlight plagiarism" title="Potential plagiarism detected">${chunk}</span> `;
            } else {
                highlightedText += `<span>${chunk}</span> `;
            }
            
            i += chunkSize;
        }
        
        return {
            similarityScore,
            directMatch,
            paraphrased,
            original,
            highlightedText,
            sources: this.generateMockSources()
        };
    }

    generateMockSources() {
        const sources = [];
        const sourceTitles = [
            "Academic Research Paper on Machine Learning",
            "Wikipedia Article on Artificial Intelligence",
            "Medium Blog Post about NLP",
            "ResearchGate Publication",
            "University Lecture Notes",
            "Technical Documentation",
            "Online Course Material",
            "Scientific Journal Article"
        ];
        
        for (let i = 0; i < 3; i++) {
            sources.push({
                title: sourceTitles[Math.floor(Math.random() * sourceTitles.length)],
                url: `https://example.com/source-${i + 1}`,
                similarity: Math.floor(Math.random() * 20) + 5,
                matchedText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            });
        }
        
        return sources;
    }

    displayPlagiarismResults(results) {
        // Update similarity score
        document.getElementById('similarityScore').textContent = `${results.similarityScore}%`;
        
        // Animate progress circle
        const circle = document.querySelector('.progress-ring-circle');
        this.setProgress(circle, results.similarityScore);
        
        // Update score breakdown
        this.animateProgressBars(results);
        
        // Display highlighted text
        document.getElementById('highlightedText').innerHTML = results.highlightedText;
        
        // Update status badge
        const statusBadge = document.getElementById('plagiarismStatus');
        statusBadge.textContent = results.similarityScore < 15 ? 'Excellent' : 
                                 results.similarityScore < 30 ? 'Good' : 
                                 results.similarityScore < 50 ? 'Fair' : 'Poor';
        
        statusBadge.style.background = results.similarityScore < 15 ? 'var(--gradient-success)' :
                                      results.similarityScore < 30 ? 'var(--gradient-warning)' :
                                      'var(--gradient-danger)';
        
        this.showElement('plagiarismReport');
    }

    animateProgressBars(results) {
        const progressBars = document.querySelectorAll('.progress-fill');
        
        setTimeout(() => {
            progressBars[0].style.width = `${results.directMatch}%`;
            progressBars[0].style.background = 'var(--gradient-danger)';
        }, 100);
        
        setTimeout(() => {
            progressBars[1].style.width = `${results.paraphrased}%`;
            progressBars[1].style.background = 'var(--gradient-warning)';
        }, 300);
        
        setTimeout(() => {
            progressBars[2].style.width = `${results.original}%`;
            progressBars[2].style.background = 'var(--gradient-success)';
        }, 500);
    }

    async paraphraseText() {
        const text = this.currentText.trim();
        if (!text) {
            this.showNotification('Please enter some text to paraphrase.', 'warning');
            return;
        }

        this.showLoading('paraphraseLoading');
        this.hideElement('paraphrasedOutput');

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Generate mock paraphrased text
            const paraphrasedText = this.generateMockParaphrasedText(text);
            
            this.displayParaphrasedText(paraphrasedText);
            this.paraphraseHistory.push({
                original: text,
                paraphrased: paraphrasedText,
                tone: this.currentTone,
                timestamp: new Date()
            });
            
            this.showNotification('Text paraphrased successfully!', 'success');
        } catch (error) {
            this.showNotification('Error paraphrasing text. Please try again.', 'error');
            console.error('Paraphrase error:', error);
        } finally {
            this.hideLoading('paraphraseLoading');
        }
    }

    generateMockParaphrasedText(text) {
        // Simple word replacement for demo purposes
        const synonyms = {
            'the': ['this', 'that', 'our'],
            'is': ['represents', 'signifies', 'constitutes'],
            'and': ['as well as', 'together with', 'along with'],
            'of': ['belonging to', 'from', 'pertaining to'],
            'to': ['toward', 'in order to', 'for the purpose of'],
            'in': ['within', 'inside', 'during'],
            'for': ['on behalf of', 'in favor of', 'considering'],
            'with': ['alongside', 'accompanied by', 'using'],
            'on': ['upon', 'atop', 'regarding'],
            'at': ['by', 'near', 'adjacent to'],
            'by': ['via', 'through', 'using'],
            'from': ['originating from', 'starting at', 'since'],
            'as': ['like', 'in the capacity of', 'while'],
            'but': ['however', 'nevertheless', 'on the other hand'],
            'or': ['alternatively', 'otherwise', 'if not'],
            'if': ['provided that', 'on condition that', 'assuming'],
            'because': ['due to the fact that', 'since', 'as a result of'],
            'when': ['at the time that', 'while', 'during'],
            'where': ['in which', 'at which', 'wherein'],
            'how': ['the manner in which', 'the way that', 'by what means'],
            'very': ['extremely', 'exceptionally', 'remarkably'],
            'good': ['excellent', 'superb', 'outstanding'],
            'bad': ['poor', 'inferior', 'substandard'],
            'big': ['large', 'substantial', 'considerable'],
            'small': ['tiny', 'minute', 'compact'],
            'important': ['crucial', 'vital', 'essential'],
            'interesting': ['fascinating', 'compelling', 'intriguing'],
            'different': ['distinct', 'diverse', 'varied']
        };

        let words = text.split(/\s+/);
        let paraphrasedWords = words.map(word => {
            const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
            if (synonyms[cleanWord] && Math.random() < 0.3) {
                const synonymList = synonyms[cleanWord];
                return synonymList[Math.floor(Math.random() * synonymList.length)];
            }
            return word;
        });

        // Apply tone-specific modifications
        paraphrasedWords = this.applyToneModifications(paraphrasedWords);

        return paraphrasedWords.join(' ');
    }

    applyToneModifications(words) {
        switch (this.currentTone) {
            case 'formal':
                return words.map(word => {
                    if (word === 'can\'t') return 'cannot';
                    if (word === 'won\'t') return 'will not';
                    if (word === 'don\'t') return 'do not';
                    return word;
                });
            case 'academic':
                return words.map(word => {
                    const academicTerms = {
                        'show': 'demonstrate',
                        'tell': 'explain',
                        'get': 'obtain',
                        'make': 'construct',
                        'think': 'hypothesize',
                        'see': 'observe'
                    };
                    return academicTerms[word] || word;
                });
            case 'creative':
                return words.map(word => {
                    if (Math.random() < 0.1) {
                        return `*${word}*`;
                    }
                    return word;
                });
            default:
                return words;
        }
    }

    displayParaphrasedText(text) {
        document.getElementById('paraphrasedText').textContent = text;
        this.paraphrasedText = text;
        
        // Update word count and uniqueness
        const wordCount = text.split(/\s+/).length;
        const uniquenessScore = Math.floor(Math.random() * 30) + 70; // 70-100%
        
        document.getElementById('outputWordCount').textContent = wordCount;
        document.getElementById('uniquenessScore').textContent = `${uniquenessScore}%`;
        
        this.showElement('paraphrasedOutput');
    }

    improveWriting() {
        if (!this.currentText.trim()) {
            this.showNotification('Please enter some text to improve.', 'warning');
            return;
        }
        
        // For demo purposes, this will just paraphrase with academic tone
        this.currentTone = 'academic';
        this.paraphraseText();
        this.showNotification('Writing improvement applied with academic tone!', 'success');
    }

    copyParaphrasedText() {
        if (!this.paraphrasedText) {
            this.showNotification('No paraphrased text to copy.', 'warning');
            return;
        }

        navigator.clipboard.writeText(this.paraphrasedText)
            .then(() => {
                this.showNotification('Text copied to clipboard!', 'success');
            })
            .catch(() => {
                this.showNotification('Failed to copy text.', 'error');
            });
    }

    speakText() {
        if (!this.paraphrasedText) {
            this.showNotification('No text to read aloud.', 'warning');
            return;
        }

        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(this.paraphrasedText);
            utterance.rate = 0.8;
            utterance.pitch = 1;
            speechSynthesis.speak(utterance);
            this.showNotification('Reading text aloud...', 'info');
        } else {
            this.showNotification('Text-to-speech not supported in your browser.', 'warning');
        }
    }

    useParaphrasedText() {
        if (!this.paraphrasedText) {
            this.showNotification('No paraphrased text to use.', 'warning');
            return;
        }

        document.getElementById('inputText').value = this.paraphrasedText;
        this.currentText = this.paraphrasedText;
        this.updateWordCount();
        this.showNotification('Paraphrased text applied to input!', 'success');
    }

    openToneModal() {
        document.getElementById('toneModal').style.display = 'block';
        
        // Highlight current tone
        document.querySelectorAll('.tone-option').forEach(option => {
            option.classList.remove('active');
            if (option.dataset.tone === this.currentTone) {
                option.classList.add('active');
            }
        });
    }

    closeToneModal() {
        document.getElementById('toneModal').style.display = 'none';
    }

    selectTone(option) {
        this.currentTone = option.dataset.tone;
        
        // Update active state
        document.querySelectorAll('.tone-option').forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        
        this.closeToneModal();
        this.showNotification(`Tone set to ${this.currentTone}`, 'success');
        
        // Rephrase with new tone if there's text
        if (this.currentText.trim()) {
            this.paraphraseText();
        }
    }

    clearText() {
        document.getElementById('inputText').value = '';
        this.currentText = '';
        this.updateWordCount();
        this.hideElement('plagiarismReport');
        this.hideElement('paraphrasedOutput');
        this.showNotification('Text cleared!', 'info');
    }

    downloadReport() {
        this.showNotification('Downloading plagiarism report...', 'info');
        // In a real implementation, this would generate and download a PDF
        setTimeout(() => {
            this.showNotification('Report downloaded successfully!', 'success');
        }, 1500);
    }

    shareReport() {
        if (navigator.share) {
            navigator.share({
                title: 'Plagiarism Report',
                text: 'Check out my plagiarism analysis report!',
                url: window.location.href
            }).then(() => {
                this.showNotification('Report shared successfully!', 'success');
            }).catch(() => {
                this.showNotification('Share cancelled.', 'info');
            });
        } else {
            this.showNotification('Web Share API not supported in your browser.', 'warning');
        }
    }

    showDetailedReport() {
        this.showNotification('Opening detailed analysis report...', 'info');
        // In a real implementation, this would show a detailed modal with charts
    }

    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        document.body.classList.toggle('dark-mode', this.isDarkMode);
        
        const toggleBtn = document.getElementById('modeToggle');
        const icon = toggleBtn.querySelector('i');
        const text = toggleBtn.querySelector('span');
        
        if (this.isDarkMode) {
            icon.className = 'fas fa-sun';
            text.textContent = 'Light Mode';
        } else {
            icon.className = 'fas fa-moon';
            text.textContent = 'Dark Mode';
        }
        
        this.saveToLocalStorage();
        this.showNotification(`${this.isDarkMode ? 'Dark' : 'Light'} mode activated`, 'success');
    }

    updateStats() {
        document.getElementById('totalChecks').textContent = this.totalChecks;
        document.getElementById('timeSaved').textContent = `${Math.floor(this.timeSaved / 60)}h`;
        
        // Calculate average similarity (mock data)
        const avgSimilarity = this.totalChecks > 0 ? Math.floor(Math.random() * 30) + 10 : 0;
        document.getElementById('avgSimilarity').textContent = `${avgSimilarity}%`;
    }

    checkAPIStatus() {
        // Simulate API status check
        setTimeout(() => {
            const statusBadge = document.getElementById('apiStatusBadge');
            statusBadge.innerHTML = '<i class="fas fa-wifi"></i> API Connected';
            statusBadge.style.background = 'var(--success)';
        }, 1000);
    }

    showLoading(elementId) {
        document.getElementById(elementId).style.display = 'block';
    }

    hideLoading(elementId) {
        document.getElementById(elementId).style.display = 'none';
    }

    showElement(elementId) {
        document.getElementById(elementId).style.display = 'block';
    }

    hideElement(elementId) {
        document.getElementById(elementId).style.display = 'none';
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notificationText');
        
        notificationText.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all cards and stats
        document.querySelectorAll('.card, .stat-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    setupTypingEffects() {
        // Add typing effect to header
        const logoText = document.querySelector('.logo span:first-child');
        const originalText = logoText.textContent;
        logoText.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                logoText.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing after a delay
        setTimeout(typeWriter, 1000);
    }

    addSampleText() {
        const sampleText = `Artificial intelligence is transforming the way we live and work. Machine learning algorithms can now process vast amounts of data and identify patterns that were previously invisible to humans. This technology is being applied in various fields including healthcare, finance, and education.

Natural language processing enables computers to understand and generate human language. This has led to the development of advanced chatbots, translation services, and content generation tools. The potential applications of AI are limitless and continue to expand as technology advances.

However, with these advancements come important ethical considerations. We must ensure that AI systems are developed and deployed responsibly, with proper safeguards against bias and misuse. The future of AI depends on our ability to balance innovation with ethical responsibility.`;

        // Add sample text after a delay if no user input
        setTimeout(() => {
            if (!this.currentText.trim()) {
                document.getElementById('inputText').value = sampleText;
                this.currentText = sampleText;
                this.updateWordCount();
            }
        }, 2000);
    }

    downloadSampleText() {
        const sampleText = `Artificial intelligence is transforming the way we live and work. Machine learning algorithms can now process vast amounts of data and identify patterns that were previously invisible to humans. This technology is being applied in various fields including healthcare, finance, and education.

Natural language processing enables computers to understand and generate human language. This has led to the development of advanced chatbots, translation services, and content generation tools. The potential applications of AI are limitless and continue to expand as technology advances.

However, with these advancements come important ethical considerations. We must ensure that AI systems are developed and deployed responsibly, with proper safeguards against bias and misuse. The future of AI depends on our ability to balance innovation with ethical responsibility.`;

        const blob = new Blob([sampleText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sample-text.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Sample text downloaded!', 'success');
    }

    saveToLocalStorage() {
        const data = {
            totalChecks: this.totalChecks,
            timeSaved: this.timeSaved,
            isDarkMode: this.isDarkMode,
            currentTone: this.currentTone,
            paraphraseHistory: this.paraphraseHistory
        };
        localStorage.setItem('plagiarismToolData', JSON.stringify(data));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('plagiarismToolData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.totalChecks = data.totalChecks || 0;
                this.timeSaved = data.timeSaved || 0;
                this.isDarkMode = data.isDarkMode || false;
                this.currentTone = data.currentTone || 'formal';
                this.paraphraseHistory = data.paraphraseHistory || [];
                
                // Apply dark mode if saved
                if (this.isDarkMode) {
                    document.body.classList.add('dark-mode');
                    const toggleBtn = document.getElementById('modeToggle');
                    const icon = toggleBtn.querySelector('i');
                    const text = toggleBtn.querySelector('span');
                    icon.className = 'fas fa-sun';
                    text.textContent = 'Light Mode';
                }
            } catch (e) {
                console.error('Error loading saved data:', e);
            }
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PlagiarismParaphrasingTool();
});

// Add service worker for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}