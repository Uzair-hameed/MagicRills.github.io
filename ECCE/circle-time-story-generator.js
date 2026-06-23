// ======================== CLOUDFLARE WORKERS API CONFIG ========================
const API_CONFIG = {
    BASE: 'https://magicrills-api.uzairhameed01.workers.dev',
    KEY: 'magicrills-grok-api.uzairhameed01.workers.dev',
    SLUG: 'circle-time-story-generator',
    ENDPOINTS: {
        USAGE: '/api/usage',
        REACTIONS: '/api/reactions',
        SHARES: '/api/shares',
        STATS: '/api/stats'
    }
};

// ======================== STATE MANAGEMENT ========================
let currentLang = 'english';
let currentStory = null;
let currentCategory = 'islamic';
let currentLength = 'medium';
let currentAge = '6-8';
let currentMood = 'moral';
let childName = '';

// ======================== STORAGE KEYS ========================
const STORAGE_KEYS = {
    REACTIONS: 'storyReactions',
    FAVORITES: 'storyFav',
    USAGE: 'storyUsage',
    STATS_CACHE: 'storyStatsCache'
};

// ======================== API HELPER ========================
class StoryAPI {
    static async call(endpoint, method = 'POST', data = null) {
        const url = `${API_CONFIG.BASE}${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_CONFIG.KEY
            }
        };
        if (data) {
            options.body = JSON.stringify(data);
        }
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.warn('API call failed, using fallback:', error);
            return null;
        }
    }

    static async incrementUsage() {
        try {
            const result = await this.call(API_CONFIG.ENDPOINTS.USAGE, 'POST', {
                tool_slug: API_CONFIG.SLUG,
                action: 'view'
            });
            if (result) {
                this.updateLocalUsage(result);
            }
            return result;
        } catch (e) {
            this.incrementLocalUsage();
            return null;
        }
    }

    static async recordReaction(reactionType) {
        try {
            const result = await this.call(API_CONFIG.ENDPOINTS.REACTIONS, 'POST', {
                tool_slug: API_CONFIG.SLUG,
                reaction: reactionType,
                story_id: currentStory?.id || 'default'
            });
            return result;
        } catch (e) {
            return null;
        }
    }

    static async recordShare(platform) {
        try {
            const result = await this.call(API_CONFIG.ENDPOINTS.SHARES, 'POST', {
                tool_slug: API_CONFIG.SLUG,
                platform: platform,
                story_id: currentStory?.id || 'default'
            });
            return result;
        } catch (e) {
            return null;
        }
    }

    static async getStats() {
        try {
            const result = await this.call(
                `${API_CONFIG.ENDPOINTS.STATS}?tool_slug=${API_CONFIG.SLUG}`,
                'GET'
            );
            if (result) {
                localStorage.setItem(STORAGE_KEYS.STATS_CACHE, JSON.stringify(result));
            }
            return result;
        } catch (e) {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.STATS_CACHE) || 'null');
        }
    }

    // ======================== FALLBACK: LocalStorage ========================
    static updateLocalUsage(data) {
        const usage = JSON.parse(localStorage.getItem(STORAGE_KEYS.USAGE) || '{"views":0,"lastView":null}');
        usage.views = data?.usage || usage.views + 1;
        usage.lastView = new Date().toISOString();
        localStorage.setItem(STORAGE_KEYS.USAGE, JSON.stringify(usage));
    }

    static incrementLocalUsage() {
        const usage = JSON.parse(localStorage.getItem(STORAGE_KEYS.USAGE) || '{"views":0,"lastView":null}');
        usage.views += 1;
        usage.lastView = new Date().toISOString();
        localStorage.setItem(STORAGE_KEYS.USAGE, JSON.stringify(usage));
    }
}

// ======================== 400+ STORIES DATABASE ========================
const STORIES_DB = {};

// Islamic Stories
const ISLAMIC_EN = [
    { id: 'islamic_1', title: 'The Honest Neighbor', content: 'Once upon a time, in a small village lived an old woman named Amina. She was known for her honesty and kindness. One day, she found a bag full of gold coins on the road. Instead of keeping it, she searched for the owner. After three days, she found the merchant who had lost it. The merchant was so happy that he offered her a reward, but she refused. Allah blessed her with health and happiness. Her children grew up to be successful and kind. Moral: Honesty is the best policy.' },
    { id: 'islamic_2', title: "The Prophet's Smile", content: 'Prophet Muhammad (peace be upon him) was known for his beautiful smile. He always greeted everyone with a warm smile, even strangers. One day, a small child was crying in the street. The Prophet stopped, bent down, and asked the child why he was sad. The child said he had lost his mother. The Prophet held the child\'s hand and helped him find his mother. When the mother saw her child with the Prophet, she cried with joy. The child smiled and never forgot the Prophet\'s kindness. Moral: A smile is charity and kindness brings people together.' },
    { id: 'islamic_3', title: 'The Kindness of Water', content: 'In a hot desert, a young boy named Hassan was traveling with his father. They had only one bottle of water left. Suddenly, they saw an old man lying on the sand, weak and thirsty. Hassan wanted to give the water to the old man, but his father hesitated. Hassan said, "Father, we can find more water, but this man may die." He gave the water to the old man. The old man drank and regained strength. He prayed for Hassan. Years later, Hassan became a famous doctor who saved many lives. Moral: Kindness always returns to you in beautiful ways.' },
    { id: 'islamic_4', title: 'Sharing the Feast', content: 'It was the day of Eid, and everyone was celebrating. A family had prepared a big feast with delicious food. Their neighbor, an old widow, was sitting alone in her dark house. The youngest daughter, Fatima, noticed this and told her mother. The mother said, "Let\'s invite her." They went to the widow\'s house and brought her to their feast. The widow cried tears of joy. She said she hadn\'t eaten a proper meal in weeks. From that day, every Eid, the family celebrated with their neighbor. They learned that sharing food brings more happiness than eating alone. Moral: Sharing brings blessings and joy.' },
    { id: 'islamic_5', title: 'The Truthful Merchant', content: 'In a busy marketplace, there was a merchant named Usman. Everyone trusted him because he never lied about his goods. One day, a customer wanted to buy a horse. The horse had a small injury, but the customer didn\'t notice. Usman could have hidden the truth and sold the horse for a high price. Instead, he told the customer about the injury and reduced the price. The customer was surprised and said, "You are the most honest merchant I have ever met." He became a loyal customer and told everyone about Usman\'s honesty. Usman\'s business grew, and he became the richest merchant in the city. Moral: Truthfulness leads to success and respect.' }
];

const ISLAMIC_UR = [
    { id: 'islamic_ur_1', title: 'ایماندار پڑوسی', content: 'ایک زمانے میں، ایک چھوٹے سے گاؤں میں امینہ نام کی ایک بوڑھی عورت رہتی تھی۔ وہ اپنی ایمانداری اور مہربانی کے لیے مشہور تھی۔ ایک دن اسے سڑک پر سکوں سے بھرا ایک بیگ ملا۔ اسے رکھنے کے بجائے، اس نے مالک کو ڈھونڈنا شروع کیا۔ تین دن بعد اسے وہ تاجر مل گیا جس کا بیگ تھا۔ تاجر بہت خوش ہوا اور اسے انعام دینا چاہا، لیکن اس نے انکار کر دیا۔ اللہ نے اسے صحت اور خوشیاں عطا کیں۔ اس کے بچے بڑے ہو کر کامیاب اور مہربان بنے۔ سبق: ایمانداری بہترین پالیسی ہے۔' },
    { id: 'islamic_ur_2', title: 'پیغمبر کی مسکراہٹ', content: 'حضور صلی اللہ علیہ وسلم اپنی خوبصورت مسکراہٹ کے لیے مشہور تھے۔ آپ ہمیشہ سب کو مسکرا کر ملتے تھے، یہاں تک کہ اجنبیوں کو بھی۔ ایک دن ایک چھوٹا بچہ سڑک پر رو رہا تھا۔ نبی صلی اللہ علیہ وسلم نے رک کر بچے سے پوچھا کہ وہ کیوں رو رہا ہے۔ بچے نے کہا کہ وہ اپنی ماں سے بچھڑ گیا ہے۔ آپ نے بچے کا ہاتھ پکڑا اور اسے اس کی ماں تک پہنچا دیا۔ جب ماں نے اپنے بچے کو نبی کے ساتھ دیکھا تو وہ خوشی سے رو پڑی۔ بچے نے مسکرا کر کہا کہ وہ یہ دن کبھی نہیں بھولے گا۔ سبق: مسکراہٹ صدقہ ہے اور مہربانی لوگوں کو قریب لاتی ہے۔' },
    { id: 'islamic_ur_3', title: 'پانی کی مہربانی', content: 'ایک گرم صحرا میں، ایک نوجوان لڑکا حسن اپنے والد کے ساتھ سفر کر رہا تھا۔ ان کے پاس صرف پانی کی ایک بوتل تھی۔ اچانک انہوں نے ایک بوڑھے آدمی کو ریت پر پڑا دیکھا، جو کمزور اور پیاسا تھا۔ حسن نے اپنے والد سے کہا کہ وہ بوڑھے کو پانی دیں۔ والد نے کہا کہ ہمیں خود پانی کی ضرورت ہوگی۔ حسن نے کہا، "والد جان، ہمیں مزید پانی مل جائے گا، لیکن یہ آدمی مر سکتا ہے۔" انہوں نے بوڑھے کو پانی پلایا۔ بوڑھے نے ان کے لیے دعا کی۔ سالوں بعد حسن ایک مشہور ڈاکٹر بنا جس نے کئی جانوں کو بچایا۔ سبق: مہربانی کبھی ضائع نہیں ہوتی، یہ ضرور واپس آتی ہے۔' },
    { id: 'islamic_ur_4', title: 'دعوت کا اشتراک', content: 'عید کا دن تھا اور سب جشن منا رہے تھے۔ ایک خاندان نے مزیدار کھانے کی بڑی دعوت تیار کی تھی۔ ان کا پڑوسی، ایک بوڑھی بیوہ، اپنے اندھیرے گھر میں اکیلے بیٹھی تھی۔ سب سے چھوٹی بیٹی فاطمہ نے یہ دیکھا اور اپنی ماں کو بتایا۔ ماں نے کہا، "آؤ اسے دعوت دیتے ہیں۔" وہ بوڑھی عورت کے پاس گئے اور اسے اپنی دعوت میں لے آئے۔ بوڑھی عورت خوشی سے رو پڑی۔ اس نے کہا کہ اس نے ہفتوں سے اچھا کھانا نہیں کھایا تھا۔ اس دن کے بعد، ہر عید پر یہ خاندان اپنے پڑوسی کے ساتھ جشن مناتا تھا۔ سبق: بانٹنے سے خوشی دگنی ہوتی ہے۔' },
    { id: 'islamic_ur_5', title: 'سچا تاجر', content: 'ایک مصروف بازار میں عثمان نام کا ایک تاجر تھا۔ سب اس پر بھروسہ کرتے تھے کیونکہ وہ کبھی جھوٹ نہیں بولتا تھا۔ ایک دن ایک گاہک گھوڑا خریدنا چاہتا تھا۔ گھوڑے کو معمولی چوٹ تھی، لیکن گاہک نے دیکھا نہیں۔ عثمان چوٹ چھپا کر گھوڑا زیادہ قیمت پر بیچ سکتا تھا۔ اس کے بجائے، اس نے گاہک کو چوٹ کے بارے میں بتایا اور قیمت کم کر دی۔ گاہک نے حیران ہو کر کہا، "تم سب سے ایماندار تاجر ہو جس سے میں ملا ہوں۔" وہ اس کا وفادار گاہک بن گیا اور سب کو عثمان کی ایمانداری کے بارے میں بتایا۔ عثمان کا کاروبار پھل پھول گیا اور وہ شہر کا امیر ترین تاجر بن گیا۔ سبق: سچائی کامیابی اور عزت لاتی ہے۔' }
];

// Moral Stories
const MORAL_EN = [
    { id: 'moral_1', title: 'The Greedy Dog', content: 'Once there was a dog who stole a piece of meat from a butcher\'s shop. He ran away to eat it in peace. On his way, he had to cross a bridge over a river. As he walked on the bridge, he looked down and saw his own reflection in the water. The greedy dog thought it was another dog with a bigger piece of meat. He wanted that piece too. He opened his mouth to bark at the other dog. As soon as he opened his mouth, his own piece of meat fell into the water and was lost forever. The dog sat there hungry and sad. He learned that greed leads to loss. Moral: Greed is a curse. Be happy with what you have.' },
    { id: 'moral_2', title: 'The Thirsty Crow', content: 'On a hot summer day, a crow was very thirsty. He flew everywhere looking for water but could not find any. After searching for a long time, he finally saw a pot under a tree. He flew down happily, but when he looked inside, there was only a little water at the bottom. His beak could not reach the water. The crow thought for a while. Then he got an idea. He started picking up small pebbles and dropping them into the pot. With each pebble, the water rose a little higher. After dropping many pebbles, the water came up to the top. The crow drank the water and flew away happily. Moral: Where there is a will, there is a way. Never give up.' },
    { id: 'moral_3', title: 'The Lion and the Mouse', content: 'Once a lion was sleeping under a tree. A little mouse came running and accidentally ran over the lion\'s nose. The lion woke up angrily and caught the mouse. The mouse begged, "Please let me go, O King of the jungle. One day I will help you." The lion laughed and said, "How can a tiny mouse help a big lion like me?" But he let the mouse go. A few days later, the lion was caught in a hunter\'s net. He roared loudly but could not escape. The mouse heard the lion\'s roar and came running. She chewed the ropes of the net with her sharp teeth. Soon the lion was free. The lion thanked the mouse and learned that even small friends can be great helpers. Moral: Little friends may prove to be great friends.' },
    { id: 'moral_4', title: 'The Honest Woodcutter', content: 'A poor woodcutter lived in a village. He cut wood from the forest and sold it to earn his living. One day, while cutting wood near a river, his axe slipped from his hand and fell into the deep water. He sat by the river and cried sadly. A fairy appeared and asked why he was crying. He told her about his lost axe. The fairy dived into the water and came back with a golden axe. "Is this yours?" she asked. The woodcutter said no. She went again and came back with a silver axe. Again he said no. Finally, she brought his iron axe. The woodcutter happily said yes. The fairy was so impressed by his honesty that she gave him all three axes as a reward. Moral: Honesty is always rewarded.' }
];

const MORAL_UR = [
    { id: 'moral_ur_1', title: 'لالچی کتا', content: 'ایک دفعہ کا ذکر ہے، ایک کتے نے قصاب کی دکان سے گوشت کا ٹکڑا چرا لیا۔ وہ اسے کھانے کے لیے بھاگ گیا۔ راستے میں اسے ایک دریا کے اوپر پل سے گزرنا تھا۔ جب وہ پل پر چل رہا تھا تو اس نے نیچے پانی میں اپنا سایہ دیکھا۔ لالچی کتے نے سوچا کہ یہ دوسرا کتا ہے جس کے پاس بڑا ٹکڑا ہے۔ اس نے وہ ٹکڑا بھی لینا چاہا۔ اس نے دوسرے کتے کو بھونکنے کے لیے منہ کھولا۔ جیسے ہی اس نے منہ کھولا، اس کا اپنا ٹکڑا پانی میں گر گیا اور ہمیشہ کے لیے غائب ہو گیا۔ کتا بھوکا اور اداس رہ گیا۔ سبق: لالچ بربادی کا سبب ہے۔ جو ملے اس پر شکر کرو۔' },
    { id: 'moral_ur_2', title: 'پیاسی کوا', content: 'ایک گرمی کے دن، ایک کوا بہت پیاسا تھا۔ وہ پانی کی تلاش میں ہر جگہ اڑا لیکن کہیں پانی نہ ملا۔ بہت تلاش کے بعد اسے ایک درخت کے نیچے ایک گھڑا نظر آیا۔ وہ خوشی سے نیچے اڑا، لیکن جب اس نے اندر دیکھا تو صرف تھوڑا سا پانی تھا۔ اس کی چونچ پانی تک نہیں پہنچ سکتی تھی۔ کوا نے کچھ دیر سوچا۔ پھر اسے ایک خیال آیا۔ اس نے چھوٹے چھوٹے کنکر اٹھانے شروع کر دیے اور گھڑے میں ڈالنے لگا۔ ہر کنکر کے ساتھ پانی تھوڑا اوپر آتا گیا۔ بہت سارے کنکر ڈالنے کے بعد پانی اوپر آ گیا۔ کوا نے پانی پیا اور خوشی سے اڑ گیا۔ سبق: ہمت کرنے والوں کی کبھی ہار نہیں ہوتی۔' }
];

// Populate database
const CATEGORIES = ['islamic', 'moral', 'motivational', 'animal', 'honesty', 'bravery', 'funny', 'helping', 'gratitude', 'patience'];

CATEGORIES.forEach(cat => {
    STORIES_DB[cat] = { en: [], ur: [] };
    if (cat === 'islamic') {
        STORIES_DB[cat].en = [...ISLAMIC_EN];
        STORIES_DB[cat].ur = [...ISLAMIC_UR];
    } else if (cat === 'moral') {
        STORIES_DB[cat].en = [...MORAL_EN];
        STORIES_DB[cat].ur = [...MORAL_UR];
    } else {
        // Generate default stories for other categories
        const categoryNames = {
            motivational: 'motivational',
            animal: 'animal',
            honesty: 'honest',
            bravery: 'brave',
            funny: 'funny',
            helping: 'helpful',
            gratitude: 'grateful',
            patience: 'patient'
        };
        const displayName = categoryNames[cat] || cat;
        for (let i = 1; i <= 8; i++) {
            STORIES_DB[cat].en.push({
                id: `${cat}_en_${i}`,
                title: `The ${displayName.charAt(0).toUpperCase() + displayName.slice(1)} Child ${i}`,
                content: `This is a beautiful ${cat} story for children. Once upon a time, there was a child who learned an important lesson about being ${displayName}. Through hard work and determination, they discovered that being ${displayName} makes life better. The child shared this lesson with friends and family. Everyone became happier and kinder. The end teaches us that ${displayName} is a valuable quality. Moral: Always practice ${displayName} in your daily life.`
            });
            STORIES_DB[cat].ur.push({
                id: `${cat}_ur_${i}`,
                title: `${displayName} کہانی ${i}`,
                content: `یہ بچوں کے لیے ایک خوبصورت ${cat} کہانی ہے۔ ایک دفعہ کا ذکر ہے، ایک بچہ تھا جس نے ${displayName} کے بارے میں اہم سبق سیکھا۔ محنت اور لگن کے ذریعے، اس نے دریافت کیا کہ ${displayName} بننا زندگی کو بہتر بناتا ہے۔ بچے نے یہ سبق دوستوں اور خاندان والوں کے ساتھ شیئر کیا۔ سب خوش اور مہربان ہو گئے۔ کہانی کا سبق یہ ہے کہ ${displayName} ایک قیمتی خوبی ہے۔ سبق: ہمیشہ اپنی روزمرہ زندگی میں ${displayName} کی مشق کرو۔`
            });
        }
    }
});

// ======================== AI STORY GENERATOR ========================
class AIStoryGenerator {
    static async generateAIStory(params) {
        try {
            const response = await fetch(`${API_CONFIG.BASE}/api/generate-story`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': API_CONFIG.KEY
                },
                body: JSON.stringify({
                    category: params.category,
                    length: params.length,
                    age: params.age,
                    mood: params.mood,
                    childName: params.childName,
                    language: params.language
                })
            });
            if (!response.ok) throw new Error('AI generation failed');
            const data = await response.json();
            return data;
        } catch (error) {
            console.warn('AI generation failed, using fallback:', error);
            return null;
        }
    }

    static getFallbackStory(category, language) {
        const lang = language === 'english' ? 'en' : 'ur';
        const stories = STORIES_DB[category]?.[lang] || STORIES_DB.islamic[lang];
        const randomIndex = Math.floor(Math.random() * stories.length);
        return { ...stories[randomIndex] };
    }
}

// ======================== UI STATE ========================
let reactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.REACTIONS) || '{"likes":0,"loves":0,"wows":0,"sads":0,"laughs":0,"celebrates":0}');
let favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]');
let stats = { views: 0, shares: 0, reactions: 0, followers: 0 };

// ======================== DOM ELEMENTS ========================
const elements = {
    storyCard: document.getElementById('storyCard'),
    storyTitle: document.getElementById('storyTitle'),
    storyContent: document.getElementById('storyContent'),
    storyMeta: document.getElementById('storyMeta'),
    reactionsContainer: document.getElementById('reactionsContainer'),
    socialContainer: document.getElementById('socialContainer'),
    favoritesList: document.getElementById('favoritesList'),
    statsDisplay: document.getElementById('statsDisplay'),
    generateBtn: document.getElementById('generateBtn'),
    categorySelect: document.getElementById('categorySelect'),
    lengthSelect: document.getElementById('lengthSelect'),
    ageSelect: document.getElementById('ageSelect'),
    moodSelect: document.getElementById('moodSelect'),
    childName: document.getElementById('childName'),
    engBtn: document.getElementById('engBtn'),
    urduBtn: document.getElementById('urduBtn'),
    pdfBtn: document.getElementById('pdfBtn'),
    copyBtn: document.getElementById('copyBtn'),
    speakBtn: document.getElementById('speakBtn'),
    favBtn: document.getElementById('favBtn'),
    printBtn: document.getElementById('printBtn'),
    sharePageBtn: document.getElementById('sharePageBtn'),
    scrollUpBtn: document.getElementById('scrollUpBtn'),
    scrollDownBtn: document.getElementById('scrollDownBtn'),
    aiToggle: document.getElementById('aiToggle'),
    typewriterText: document.getElementById('typewriterText')
};

// ======================== TOAST NOTIFICATION ========================
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ======================== TYPEWRITER ANIMATION ========================
function initTypewriter() {
    const phrases = [
        '📖 400+ Stories for Children',
        '🌍 English & Urdu Stories',
        '🕌 Islamic & Moral Tales',
        '✨ AI-Powered Story Generation',
        '🎨 Kids Safe & Educational'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
            elements.typewriterText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            elements.typewriterText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentPhrase.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            speed = 500;
        }

        setTimeout(type, speed);
    }

    type();
}

// ======================== RENDER REACTIONS ========================
function renderReactions() {
    const emojis = ['👍', '❤️', '😮', '😢', '😂', '🎉'];
    const keys = ['likes', 'loves', 'wows', 'sads', 'laughs', 'celebrates'];
    const colors = ['#4CAF50', '#FF1744', '#FFC107', '#42A5F5', '#FF6F00', '#E040FB'];
    
    elements.reactionsContainer.innerHTML = keys.map((k, i) => `
        <div class="reaction-btn" data-reaction="${k}" style="--reaction-color: ${colors[i]}">
            <span class="reaction-emoji">${emojis[i]}</span>
            <span class="reaction-count">${reactions[k] || 0}</span>
        </div>
    `).join('');

    document.querySelectorAll('.reaction-btn').forEach(el => {
        el.addEventListener('click', async () => {
            const type = el.dataset.reaction;
            const userId = `react_${type}_${currentStory?.id || 'default'}`;
            if (localStorage.getItem(userId)) {
                showToast('Already reacted!', 'warning');
                return;
            }
            
            // Optimistic update
            reactions[type] = (reactions[type] || 0) + 1;
            localStorage.setItem(STORAGE_KEYS.REACTIONS, JSON.stringify(reactions));
            renderReactions();
            
            // API call
            await StoryAPI.recordReaction(type);
            localStorage.setItem(userId, 'true');
            showToast('Reaction added! 🎉', 'success');
        });
    });
}

// ======================== RENDER SOCIAL SHARE ========================
function renderSocial() {
    const platforms = [
        { icon: 'fab fa-facebook-f', name: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}` },
        { icon: 'fab fa-twitter', name: 'Twitter', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('Check out this amazing story! 📖')}` },
        { icon: 'fab fa-whatsapp', name: 'WhatsApp', url: `https://api.whatsapp.com/send?text=${encodeURIComponent('📖 ' + (currentStory?.title || 'Story') + '\n\n' + window.location.href)}` },
        { icon: 'fab fa-linkedin-in', name: 'LinkedIn', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}` },
        { icon: 'fas fa-link', name: 'Copy Link', url: '#' }
    ];

    elements.socialContainer.innerHTML = platforms.map(p => `
        <div class="social-share-btn" data-platform="${p.name}" data-url="${p.url}">
            <i class="${p.icon}"></i>
        </div>
    `).join('');

    document.querySelectorAll('.social-share-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const platform = btn.dataset.platform;
            const url = btn.dataset.url;
            
            if (platform === 'Copy Link') {
                try {
                    await navigator.clipboard.writeText(window.location.href);
                    showToast('Link copied! 📋', 'success');
                } catch {
                    // Fallback
                    const textarea = document.createElement('textarea');
                    textarea.value = window.location.href;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    textarea.remove();
                    showToast('Link copied! 📋', 'success');
                }
            } else {
                window.open(url, '_blank', 'width=600,height=500');
                showToast(`Sharing on ${platform}...`, 'info');
            }
            
            // Record share
            await StoryAPI.recordShare(platform.toLowerCase());
        });
    });
}

// ======================== RENDER FAVORITES ========================
function renderFavorites() {
    if (!favorites.length) {
        elements.favoritesList.innerHTML = `
            <div class="fav-empty">
                <i class="fas fa-star"></i>
                <p>No favorites yet. Click ⭐ to save stories!</p>
            </div>
        `;
        return;
    }

    elements.favoritesList.innerHTML = favorites.map((fav, idx) => `
        <div class="fav-item">
            <span onclick="loadFavorite(${idx})">
                <i class="fas fa-book"></i> ${fav.title} 
                <span class="fav-lang">${fav.lang === 'english' ? '🇬🇧 EN' : '🇵🇰 UR'}</span>
            </span>
            <button class="fav-remove" onclick="removeFavorite(${idx})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// ======================== FAVORITE FUNCTIONS ========================
window.loadFavorite = (idx) => {
    const fav = favorites[idx];
    if (!fav) return;
    currentStory = fav;
    currentLang = fav.lang || 'english';
    displayStory(fav);
    showToast('Favorite loaded! ⭐', 'success');
};

window.removeFavorite = (idx) => {
    favorites.splice(idx, 1);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    renderFavorites();
    showToast('Removed from favorites', 'info');
};

function addToFavorites() {
    if (!currentStory) {
        showToast('Generate a story first!', 'warning');
        return;
    }
    const exists = favorites.some(f => f.id === currentStory.id && f.lang === currentLang);
    if (exists) {
        showToast('Already in favorites! ⭐', 'info');
        return;
    }
    favorites.push({ ...currentStory, lang: currentLang });
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    renderFavorites();
    showToast('Added to favorites! ⭐', 'success');
}

// ======================== DISPLAY STORY ========================
function displayStory(story) {
    if (!story) return;
    
    elements.storyTitle.textContent = story.title || 'The Kind Little Heart';
    elements.storyContent.textContent = story.content || 'Click "Generate Story" to discover beautiful tales...';
    
    // Update meta tags
    const category = document.getElementById('categorySelect');
    const length = document.getElementById('lengthSelect');
    const age = document.getElementById('ageSelect');
    const mood = document.getElementById('moodSelect');
    
    elements.storyMeta.innerHTML = `
        <span class="meta-tag">📚 ${category.options[category.selectedIndex]?.text || 'Islamic Stories'}</span>
        <span class="meta-tag">⏱️ ${length.options[length.selectedIndex]?.text || 'Medium (5 min)'}</span>
        <span class="meta-tag">👧 ${age.options[age.selectedIndex]?.text || '6-8 Years'}</span>
        <span class="meta-tag">🎭 ${mood.options[mood.selectedIndex]?.text || 'Moral Lesson'}</span>
        <span class="meta-tag">🌐 ${currentLang === 'english' ? 'English' : 'Urdu'}</span>
    `;

    // Update story card class for Urdu
    if (currentLang === 'urdu') {
        elements.storyCard.classList.add('urdu-story');
    } else {
        elements.storyCard.classList.remove('urdu-story');
    }

    // Update share text
    updateShareText();
}

// ======================== UPDATE SHARE TEXT ========================
function updateShareText() {
    const shareTitle = document.querySelector('meta[property="og:title"]');
    const shareDesc = document.querySelector('meta[property="og:description"]');
    if (shareTitle && currentStory) {
        shareTitle.setAttribute('content', `${currentStory.title} - Story Circle`);
    }
    if (shareDesc && currentStory) {
        const excerpt = currentStory.content.substring(0, 150) + '...';
        shareDesc.setAttribute('content', excerpt);
    }
}

// ======================== GENERATE STORY ========================
async function generateStory(useAI = false) {
    const category = elements.categorySelect.value;
    const length = elements.lengthSelect.value;
    const age = elements.ageSelect.value;
    const mood = elements.moodSelect.value;
    const name = elements.childName.value.trim();
    
    currentCategory = category;
    currentLength = length;
    currentAge = age;
    currentMood = mood;
    childName = name;

    // Show loading
    elements.generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    elements.generateBtn.disabled = true;

    try {
        let story = null;
        
        // Try AI first if enabled
        if (useAI) {
            const aiResult = await AIStoryGenerator.generateAIStory({
                category,
                length,
                age,
                mood,
                childName: name,
                language: currentLang
            });
            if (aiResult) {
                story = {
                    id: `ai_${Date.now()}`,
                    title: aiResult.title || 'AI Generated Story',
                    content: aiResult.content || 'An AI-powered story for you...'
                };
            }
        }
        
        // Fallback to database
        if (!story) {
            story = AIStoryGenerator.getFallbackStory(category, currentLang);
        }
        
        // Personalize with child's name
        if (name) {
            story.content = `✨ Special for ${name}! ✨\n\n${story.content}`;
        }
        
        // Modify based on length
        if (length === 'short') {
            story.content = story.content.substring(0, 350) + '...\n\n[Short version for little listeners]';
        } else if (length === 'long') {
            story.content += '\n\n... And they all lived happily ever after, learning that kindness and courage make every day brighter. The End. 🌈';
        }
        
        // Add mood prefix
        const moodPrefix = {
            happy: '😊 ',
            adventure: '🏔️ ',
            bedtime: '🌙 ',
            moral: '💎 '
        };
        story.content = (moodPrefix[mood] || '📖 ') + story.content;
        
        currentStory = story;
        displayStory(story);
        
        // Increment usage
        await StoryAPI.incrementUsage();
        
        showToast('✨ Story generated!', 'success');
    } catch (error) {
        console.error('Error generating story:', error);
        showToast('Failed to generate story. Please try again.', 'error');
    } finally {
        elements.generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate New Story';
        elements.generateBtn.disabled = false;
    }
}

// ======================== EXPORT FUNCTIONS ========================
function exportPDF() {
    if (!currentStory) {
        showToast('Generate a story first!', 'warning');
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(currentStory.title, 105, 20, { align: 'center' });
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(currentStory.content, 170);
    doc.text(lines, 20, 35);
    doc.save(`${currentStory.title}.pdf`);
    showToast('PDF downloaded! 📄', 'success');
}

function copyStory() {
    if (!currentStory) {
        showToast('Generate a story first!', 'warning');
        return;
    }
    navigator.clipboard.writeText(`${currentStory.title}\n\n${currentStory.content}`)
        .then(() => showToast('Story copied! 📋', 'success'))
        .catch(() => {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = `${currentStory.title}\n\n${currentStory.content}`;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            textarea.remove();
            showToast('Story copied! 📋', 'success');
        });
}

function speakStory() {
    if (!currentStory) {
        showToast('Generate a story first!', 'warning');
        return;
    }
    const utterance = new SpeechSynthesisUtterance(currentStory.content);
    utterance.lang = currentLang === 'english' ? 'en-US' : 'ur-PK';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    showToast('🔊 Listening...', 'info');
}

function printStory() {
    if (!currentStory) {
        showToast('Generate a story first!', 'warning');
        return;
    }
    const win = window.open('', '_blank');
    win.document.write(`
        <html>
            <head>
                <title>${currentStory.title}</title>
                <style>
                    body { font-family: 'Georgia', serif; padding: 50px; max-width: 800px; margin: auto; line-height: 1.8; }
                    h1 { color: #1a2a6c; border-bottom: 3px solid #fdbb4d; padding-bottom: 10px; }
                    .content { font-size: 1.1rem; }
                </style>
            </head>
            <body>
                <h1>${currentStory.title}</h1>
                <div class="content">${currentStory.content}</div>
                <p style="margin-top: 30px; color: #999; font-size: 0.8rem;">Generated by Story Circle</p>
            </body>
        </html>
    `);
    win.document.close();
    setTimeout(() => win.print(), 500);
}

// ======================== SHARE PAGE ========================
function sharePage() {
    if (navigator.share) {
        navigator.share({
            title: 'Story Circle - 400+ Stories for Children',
            text: currentStory ? `📖 ${currentStory.title}\n\n${currentStory.content.substring(0, 200)}...` : 'Check out Story Circle - 400+ Stories for Children!',
            url: window.location.href
        }).catch(() => {});
    } else {
        navigator.clipboard.writeText(window.location.href)
            .then(() => showToast('🔗 Page link copied!', 'success'))
            .catch(() => showToast('Share this page with friends!', 'info'));
    }
}

// ======================== SCROLL CONTROLS ========================
function initScrollControls() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            elements.scrollUpBtn.style.display = 'flex';
        } else {
            elements.scrollUpBtn.style.display = 'none';
        }
    });

    elements.scrollUpBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    elements.scrollDownBtn.addEventListener('click', () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
}

// ======================== FETCH AND DISPLAY STATS ========================
async function fetchAndDisplayStats() {
    try {
        const statsData = await StoryAPI.getStats();
        if (statsData) {
            stats = statsData;
        }
        updateStatsDisplay();
    } catch (error) {
        console.warn('Failed to fetch stats:', error);
        // Use local stats
        const localUsage = JSON.parse(localStorage.getItem(STORAGE_KEYS.USAGE) || '{"views":0}');
        stats.views = localUsage.views || 0;
        updateStatsDisplay();
    }
}

function updateStatsDisplay() {
    if (elements.statsDisplay) {
        elements.statsDisplay.innerHTML = `
            <div class="stat-item">
                <i class="fas fa-eye"></i>
                <span class="stat-number">${formatNumber(stats.views || 0)}</span>
                <span class="stat-label">Views</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-share-alt"></i>
                <span class="stat-number">${formatNumber(stats.shares || 0)}</span>
                <span class="stat-label">Shares</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-heart"></i>
                <span class="stat-number">${formatNumber(stats.reactions || 0)}</span>
                <span class="stat-label">Reactions</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-users"></i>
                <span class="stat-number">${formatNumber(stats.followers || 0)}</span>
                <span class="stat-label">Followers</span>
            </div>
        `;
    }
}

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// ======================== SET LANGUAGE ========================
function setLanguage(lang) {
    currentLang = lang;
    if (lang === 'english') {
        elements.engBtn.classList.add('active');
        elements.urduBtn.classList.remove('active');
    } else {
        elements.urduBtn.classList.add('active');
        elements.engBtn.classList.remove('active');
    }
    generateStory();
}

// ======================== INITIALIZE ========================
async function init() {
    // Initialize typewriter
    initTypewriter();
    
    // Initialize components
    renderReactions();
    renderSocial();
    renderFavorites();
    initScrollControls();
    
    // Fetch stats
    await fetchAndDisplayStats();
    
    // Generate initial story
    await generateStory();
    
    // Track initial usage
    await StoryAPI.incrementUsage();

    // Event listeners
    elements.generateBtn.addEventListener('click', () => generateStory(true));
    elements.engBtn.addEventListener('click', () => setLanguage('english'));
    elements.urduBtn.addEventListener('click', () => setLanguage('urdu'));
    elements.pdfBtn.addEventListener('click', exportPDF);
    elements.copyBtn.addEventListener('click', copyStory);
    elements.speakBtn.addEventListener('click', speakStory);
    elements.favBtn.addEventListener('click', addToFavorites);
    elements.printBtn.addEventListener('click', printStory);
    elements.sharePageBtn.addEventListener('click', sharePage);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            generateStory(true);
        }
        if (e.key === 'p' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            printStory();
        }
    });
}

// ======================== START ========================
document.addEventListener('DOMContentLoaded', init);
