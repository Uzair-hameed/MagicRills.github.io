// AI Integration for Quote Generation

class AIQuoteGenerator {
    constructor() {
        this.apiKey = 'your-openai-api-key'; // Replace with actual key
        this.baseURL = 'https://api.openai.com/v1/chat/completions';
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('generate-ai-quote').addEventListener('click', () => this.generateAIQuote());
    }

    async generateAIQuote() {
        const topic = document.getElementById('ai-topic').value.trim();
        const loadingElement = document.getElementById('ai-loading');
        
        if (!topic) {
            this.showToast('Please enter a topic', 'warning');
            return;
        }

        loadingElement.classList.remove('hidden');

        try {
            const quote = await this.fetchAIQuote(topic);
            this.displayAIQuote(quote);
            this.showToast('AI quote generated!', 'success');
        } catch (error) {
            console.error('AI Quote Error:', error);
            const fallback = this.getFallbackQuote(topic);
            this.displayAIQuote(fallback);
            this.showToast('Using fallback quote', 'info');
        } finally {
            loadingElement.classList.add('hidden');
        }
    }

    async fetchAIQuote(topic) {
        // Mock API call - replace with actual OpenAI API call
        await new Promise(r => setTimeout(r, 1500));

        const mockQuotes = {
            motivation: [
                { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
                { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" }
            ],
            love: [
                { text: "Love recognizes no barriers. It jumps hurdles, leaps fences, penetrates walls.", author: "Maya Angelou" },
                { text: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn" }
            ],
            education: [
                { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
                { text: "The function of education is to teach one to think intensively and critically.", author: "Martin Luther King Jr." }
            ],
            success: [
                { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
                { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" }
            ],
            life: [
                { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
                { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" }
            ]
        };

        const category = this.categorizeTopic(topic);
        const quotes = mockQuotes[category] || mockQuotes.motivation;
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        
        return randomQuote;
    }

    categorizeTopic(topic) {
        const topicMap = {
            'love': 'love',
            'romance': 'love',
            'relationship': 'love',
            'education': 'education',
            'learning': 'education',
            'teaching': 'education',
            'success': 'success',
            'achievement': 'success',
            'goal': 'success',
            'life': 'life',
            'living': 'life',
            'existence': 'life',
            'motivation': 'motivation',
            'inspiration': 'motivation',
            'encouragement': 'motivation'
        };
        
        const lowerTopic = topic.toLowerCase();
        for (const [key, value] of Object.entries(topicMap)) {
            if (lowerTopic.includes(key)) {
                return value;
            }
        }
        
        return 'motivation';
    }

    getFallbackQuote(topic) {
        const fallbackQuotes = [
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
            { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
            { text: "Stay hungry, stay foolish.", author: "Steve Jobs" }
        ];
        
        return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    }

    displayAIQuote(quote) {
        document.getElementById('preview-quote').textContent = `"${quote.text}"`;
        document.getElementById('preview-author').textContent = `- ${quote.author}`;
        
        // Also update the current design
        if (window.posterGenerator) {
            window.posterGenerator.currentDesign.quote = `"${quote.text}"`;
            window.posterGenerator.currentDesign.author = `- ${quote.author}`;
            window.posterGenerator.updatePreview();
        }
    }

    showToast(message, type) {
        if (window.posterGenerator) {
            window.posterGenerator.showToast(message, type);
        } else {
            alert(message);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.aiQuoteGenerator = new AIQuoteGenerator();
});