// AI Integration for Quote Generation

class AIQuoteGenerator {
    constructor() {
        this.apiKey = 'your-openai-api-key'; // Replace with actual API key
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
            this.showToast('Please enter a topic for AI to generate a quote', 'warning');
            return;
        }

        // Show loading
        loadingElement.classList.remove('hidden');

        try {
            const quote = await this.fetchAIQuote(topic);
            this.displayAIQuote(quote);
            this.showToast('AI quote generated successfully!', 'success');
        } catch (error) {
            console.error('Error generating AI quote:', error);
            // Fallback to predefined quotes if API fails
            const fallbackQuote = this.getFallbackQuote(topic);
            this.displayAIQuote(fallbackQuote);
            this.showToast('AI quote generated (using fallback)', 'info');
        } finally {
            loadingElement.classList.add('hidden');
        }
    }

    async fetchAIQuote(topic) {
        // For demo purposes, using a mock response
        // In production, replace with actual OpenAI API call
        
        // Mock API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Enhanced mock responses based on topic with 30 categories
        const mockResponses = {
            motivation: [
                "The journey of a thousand miles begins with a single step. Take that step today.",
                "Your potential is like an ocean. Dive deep and you will discover treasures beyond imagination.",
                "Success is not about being the best. It's about being better than you were yesterday."
            ],
            love: [
                "Love is the silent understanding between two souls that speaks louder than words.",
                "In the garden of life, love is the most beautiful flower that never fades.",
                "True love is not about finding the perfect person, but learning to see an imperfect person perfectly."
            ],
            education: [
                "Education is the compass that navigates the ship of life through the storms of ignorance.",
                "A mind once expanded by knowledge never returns to its original dimensions.",
                "Learning is the only treasure that increases when shared with others."
            ],
            success: [
                "Success is built on the foundation of failures, each one a stepping stone to greatness.",
                "The secret of success is to do common things uncommonly well with relentless consistency.",
                "Your success is determined not by the height you reach, but by the obstacles you overcome to get there."
            ],
            wisdom: [
                "Wisdom is not the accumulation of knowledge, but the understanding of how little we truly know.",
                "The wise person knows that every ending is merely a new beginning in disguise.",
                "True wisdom lies in recognizing patterns where others see only chaos."
            ],
            life: [
                "Life is not about waiting for the storm to pass, but learning to dance in the rain.",
                "The purpose of life is to live it, to taste experience to the utmost, to reach out eagerly and without fear for newer and richer experience.",
                "In the end, it's not the years in your life that count. It's the life in your years."
            ],
            friendship: [
                "Friendship is the golden thread that ties the heart of all the world.",
                "A true friend is someone who knows the song in your heart and can sing it back to you when you have forgotten the words.",
                "Friendship is the only cement that will ever hold the world together."
            ],
            inspiration: [
                "The future belongs to those who believe in the beauty of their dreams.",
                "You are never too old to set another goal or to dream a new dream.",
                "The only limit to our realization of tomorrow will be our doubts of today."
            ],
            leadership: [
                "Leadership is not about being in charge. It is about taking care of those in your charge.",
                "The greatest leader is not necessarily the one who does the greatest things. He is the one that gets the people to do the greatest things.",
                "Innovation distinguishes between a leader and a follower."
            ],
            creativity: [
                "Creativity is intelligence having fun.",
                "The creative adult is the child who survived.",
                "You can't use up creativity. The more you use, the more you have."
            ],
            courage: [
                "Courage is not the absence of fear, but rather the assessment that something else is more important than fear.",
                "It takes courage to grow up and become who you really are.",
                "Courage is the most important of all the virtues because without courage, you can't practice any other virtue consistently."
            ],
            perseverance: [
                "Perseverance is not a long race; it is many short races one after the other.",
                "The difference between a successful person and others is not a lack of strength, not a lack of knowledge, but rather a lack in will.",
                "It does not matter how slowly you go as long as you do not stop."
            ],
            hope: [
                "Hope is being able to see that there is light despite all of the darkness.",
                "We must accept finite disappointment, but never lose infinite hope.",
                "Hope is the thing with feathers that perches in the soul and sings the tune without the words and never stops at all."
            ],
            dreams: [
                "All our dreams can come true, if we have the courage to pursue them.",
                "The future belongs to those who believe in the beauty of their dreams.",
                "Dream big and dare to fail."
            ],
            happiness: [
                "Happiness is not something ready made. It comes from your own actions.",
                "The purpose of our lives is to be happy.",
                "Happiness is when what you think, what you say, and what you do are in harmony."
            ],
            peace: [
                "Peace begins with a smile.",
                "If you want to make peace with your enemy, you have to work with your enemy. Then he becomes your partner.",
                "Inner peace begins the moment you choose not to allow another person or event to control your emotions."
            ],
            kindness: [
                "No act of kindness, no matter how small, is ever wasted.",
                "Kindness is a language which the deaf can hear and the blind can see.",
                "Be kind whenever possible. It is always possible."
            ],
            gratitude: [
                "Gratitude turns what we have into enough, and more.",
                "The roots of all goodness lie in the soil of appreciation for goodness.",
                "Gratitude is the healthiest of all human emotions. The more you express gratitude for what you have, the more likely you will have even more to express gratitude for."
            ],
            faith: [
                "Faith is taking the first step even when you don't see the whole staircase.",
                "Faith is the bird that feels the light when the dawn is still dark.",
                "To one who has faith, no explanation is necessary. To one without faith, no explanation is possible."
            ],
            science: [
                "The most beautiful thing we can experience is the mysterious. It is the source of all true art and science.",
                "Science is not only a disciple of reason but also one of romance and passion.",
                "The good thing about science is that it's true whether or not you believe in it."
            ],
            art: [
                "Art washes away from the soul the dust of everyday life.",
                "Every artist was first an amateur.",
                "Art is the lie that enables us to realize the truth."
            ],
            music: [
                "Music gives a soul to the universe, wings to the mind, flight to the imagination and life to everything.",
                "Where words fail, music speaks.",
                "Music is the shorthand of emotion."
            ],
            nature: [
                "Look deep into nature, and then you will understand everything better.",
                "In every walk with nature one receives far more than he seeks.",
                "The poetry of the earth is never dead."
            ],
            time: [
                "Time is the most valuable thing a man can spend.",
                "The two most powerful warriors are patience and time.",
                "Lost time is never found again."
            ],
            change: [
                "Change is the only constant in life.",
                "The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking.",
                "Progress is impossible without change, and those who cannot change their minds cannot change anything."
            ],
            growth: [
                "The only person you are destined to become is the person you decide to be.",
                "Growth is never by mere chance; it is the result of forces working together.",
                "Personal growth is not a matter of learning new information but of unlearning old limits."
            ],
            knowledge: [
                "Real knowledge is to know the extent of one's ignorance.",
                "The true method of knowledge is experiment.",
                "Knowledge is power."
            ],
            truth: [
                "The truth is rarely pure and never simple.",
                "If you tell the truth, you don't have to remember anything.",
                "Three things cannot be long hidden: the sun, the moon, and the truth."
            ],
            freedom: [
                "Freedom is not worth having if it does not include the freedom to make mistakes.",
                "The only real prison is fear, and the only real freedom is freedom from fear.",
                "For to be free is not merely to cast off one's chains, but to live in a way that respects and enhances the freedom of others."
            ],
            humor: [
                "A day without laughter is a day wasted.",
                "Laughter is the sun that drives winter from the human face.",
                "Humor is mankind's greatest blessing."
            ]
        };

        const category = this.categorizeTopic(topic);
        const quotes = mockResponses[category] || mockResponses.motivation;
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        
        return {
            text: randomQuote,
            author: "AI Generated"
        };
    }

    categorizeTopic(topic) {
        const topics = topic.toLowerCase();
        
        // Enhanced categorization for 30 categories
        const categoryMap = {
            'love': 'love',
            'relationship': 'love',
            'affection': 'love',
            'education': 'education',
            'learn': 'education',
            'study': 'education',
            'school': 'education',
            'success': 'success',
            'achievement': 'success',
            'goal': 'success',
            'wisdom': 'wisdom',
            'knowledge': 'wisdom',
            'philosophy': 'wisdom',
            'life': 'life',
            'living': 'life',
            'existence': 'life',
            'friend': 'friendship',
            'companion': 'friendship',
            'inspiration': 'inspiration',
            'inspire': 'inspiration',
            'leadership': 'leadership',
            'leader': 'leadership',
            'creativity': 'creativity',
            'create': 'creativity',
            'imagination': 'creativity',
            'courage': 'courage',
            'brave': 'courage',
            'perseverance': 'perseverance',
            'persist': 'perseverance',
            'hope': 'hope',
            'optimism': 'hope',
            'dream': 'dreams',
            'aspiration': 'dreams',
            'happiness': 'happiness',
            'joy': 'happiness',
            'peace': 'peace',
            'tranquility': 'peace',
            'kindness': 'kindness',
            'compassion': 'kindness',
            'gratitude': 'gratitude',
            'thankful': 'gratitude',
            'faith': 'faith',
            'belief': 'faith',
            'science': 'science',
            'scientific': 'science',
            'art': 'art',
            'artist': 'art',
            'music': 'music',
            'melody': 'music',
            'nature': 'nature',
            'environment': 'nature',
            'time': 'time',
            'moment': 'time',
            'change': 'change',
            'transform': 'change',
            'growth': 'growth',
            'develop': 'growth',
            'truth': 'truth',
            'honesty': 'truth',
            'freedom': 'freedom',
            'liberty': 'freedom',
            'humor': 'humor',
            'funny': 'humor',
            'laugh': 'humor'
        };

        for (const [keyword, category] of Object.entries(categoryMap)) {
            if (topics.includes(keyword)) {
                return category;
            }
        }

        return 'motivation'; // Default category
    }

    getFallbackQuote(topic) {
        const category = this.categorizeTopic(topic);
        const quotes = {
            motivation: [
                { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
                { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" }
            ],
            love: [
                { text: "Love is friendship that has caught fire.", author: "Ann Landers" },
                { text: "The best love is the kind that awakens the soul.", author: "Nicholas Sparks" }
            ],
            education: [
                { text: "Education is the passport to the future.", author: "Malcolm X" },
                { text: "Learning is a treasure that will follow its owner everywhere.", author: "Chinese Proverb" }
            ],
            success: [
                { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
                { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" }
            ],
            wisdom: [
                { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
                { text: "Knowledge speaks, but wisdom listens.", author: "Jimi Hendrix" }
            ],
            life: [
                { text: "Life is really simple, but we insist on making it complicated.", author: "Confucius" },
                { text: "Life is what we make it, always has been, always will be.", author: "Grandma Moses" }
            ],
            friendship: [
                { text: "A friend is one that knows you as you are, understands where you have been, accepts what you have become, and still, gently allows you to grow.", author: "William Shakespeare" },
                { text: "Friendship is the hardest thing in the world to explain. It's not something you learn in school. But if you haven't learned the meaning of friendship, you really haven't learned anything.", author: "Muhammad Ali" }
            ]
            // Add more fallback quotes for other categories...
        };

        const categoryQuotes = quotes[category] || quotes.motivation;
        return categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
    }

    displayAIQuote(quote) {
        document.getElementById('preview-quote').textContent = `"${quote.text}"`;
        document.getElementById('preview-author').textContent = `- ${quote.author}`;
        
        // Update the poster preview
        if (window.posterGenerator) {
            window.posterGenerator.updatePreview();
        }
    }

    showToast(message, type = 'info') {
        // Use the main app's toast system if available
        if (window.posterGenerator) {
            window.posterGenerator.showToast(message, type);
        } else {
            // Fallback toast
            alert(message);
        }
    }
}

// Make AI generator globally available
document.addEventListener('DOMContentLoaded', function() {
    window.aiQuoteGenerator = new AIQuoteGenerator();
});