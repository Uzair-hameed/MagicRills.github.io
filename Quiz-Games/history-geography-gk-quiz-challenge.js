// ==================== CONFIGURATION ====================
const CONFIG = {
    APP_NAME: 'History, Geography & GK Quiz Challenge',
    VERSION: '4.0.0',
    API_BASE: 'https://magicrills-api.uzairhameed01.workers.dev',
    API_KEY: 'magicrills-grok-api.uzairhameed01.workers.dev',
    QUESTIONS_PER_QUIZ: 20,
    TOOL_SLUG: 'history-geography-gk-quiz',
    CATEGORY: 'Quiz-Games'
};

// ==================== GLOBAL STATE ====================
let currentState = {
    subject: 'history',
    level: 1,
    questions: [],
    currentQuestion: 0,
    score: 0,
    totalPoints: 0,
    lives: 3,
    userAnswers: [],
    powerups: { fifty: 3, time: 3, hint: 3, skip: 3 },
    timer: null,
    timeLeft: 60,
    streak: 0,
    weakAreas: {},
    sessionId: null,
    aiGenerated: false,
    toolStats: {
        usage: 0,
        views: 0,
        shares: 0,
        reactions: {}
    }
};

let userReactions = new Set();
let toolUsageCount = 0;
let progressChart = null;
let isDataLoaded = false;

// ==================== TIME LIMITS ====================
const TIME_LIMITS = { 1: 60, 2: 45, 3: 30 };
const POINTS_PER_LEVEL = { 1: 1, 2: 2, 3: 3 };

// ==================== API FUNCTIONS ====================

// Track usage - increments on tool load
async function trackToolUsage() {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/api/usage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': CONFIG.API_KEY
            },
            body: JSON.stringify({
                tool_slug: CONFIG.TOOL_SLUG,
                category: CONFIG.CATEGORY,
                action: 'load'
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            toolUsageCount = data.count || 0;
            updateUsageDisplay(toolUsageCount);
            return data;
        }
    } catch (error) {
        console.warn('API usage tracking failed, using localStorage fallback');
        // Fallback: increment localStorage
        const saved = parseInt(localStorage.getItem(`usage_${CONFIG.TOOL_SLUG}`) || '0');
        const newCount = saved + 1;
        localStorage.setItem(`usage_${CONFIG.TOOL_SLUG}`, newCount);
        toolUsageCount = newCount;
        updateUsageDisplay(toolUsageCount);
    }
}

// Get tool stats from API
async function fetchToolStats() {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/api/stats?tool_slug=${CONFIG.TOOL_SLUG}`, {
            headers: {
                'X-API-Key': CONFIG.API_KEY
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            currentState.toolStats = data;
            updateStatsDisplay(data);
            return data;
        }
    } catch (error) {
        console.warn('Stats fetch failed, using localStorage fallback');
        // Fallback: load from localStorage
        const localStats = {
            usage: parseInt(localStorage.getItem(`usage_${CONFIG.TOOL_SLUG}`) || '0'),
            views: parseInt(localStorage.getItem(`views_${CONFIG.TOOL_SLUG}`) || '0'),
            shares: parseInt(localStorage.getItem(`shares_${CONFIG.TOOL_SLUG}`) || '0'),
            reactions: JSON.parse(localStorage.getItem(`reactions_${CONFIG.TOOL_SLUG}`) || '{}')
        };
        currentState.toolStats = localStats;
        updateStatsDisplay(localStats);
        return localStats;
    }
}

// Track reaction
async function trackReaction(emoji) {
    const userId = localStorage.getItem('userId') || `user_${Date.now()}`;
    localStorage.setItem('userId', userId);
    const reactionKey = `${CONFIG.TOOL_SLUG}_${emoji}_${userId}`;
    
    if (userReactions.has(reactionKey)) {
        showToast(`Already reacted with ${getEmojiName(emoji)}!`, 'warning');
        return;
    }
    
    userReactions.add(reactionKey);
    
    try {
        const response = await fetch(`${CONFIG.API_BASE}/api/reactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': CONFIG.API_KEY
            },
            body: JSON.stringify({
                tool_slug: CONFIG.TOOL_SLUG,
                emoji: emoji,
                user_id: userId
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            updateReactionDisplay(emoji, data.count || 1);
            showToast(`${getEmojiName(emoji)} reaction added!`, 'success');
            return data;
        }
    } catch (error) {
        console.warn('Reaction API failed, using localStorage fallback');
        // Fallback: store in localStorage
        const reactions = JSON.parse(localStorage.getItem(`reactions_${CONFIG.TOOL_SLUG}`) || '{}');
        reactions[emoji] = (reactions[emoji] || 0) + 1;
        localStorage.setItem(`reactions_${CONFIG.TOOL_SLUG}`, JSON.stringify(reactions));
        updateReactionDisplay(emoji, reactions[emoji]);
        showToast(`${getEmojiName(emoji)} reaction added!`, 'success');
    }
}

// Track share
async function trackShare(platform) {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/api/shares`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': CONFIG.API_KEY
            },
            body: JSON.stringify({
                tool_slug: CONFIG.TOOL_SLUG,
                platform: platform,
                share_type: 'quiz'
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            // Update share count display
            const shareCount = data.count || 0;
            document.getElementById('totalSharesCount').textContent = shareCount;
            showToast(`Shared on ${platform}!`, 'success');
            return data;
        }
    } catch (error) {
        console.warn('Share tracking failed, using localStorage fallback');
        const shares = parseInt(localStorage.getItem(`shares_${CONFIG.TOOL_SLUG}`) || '0');
        const newShares = shares + 1;
        localStorage.setItem(`shares_${CONFIG.TOOL_SLUG}`, newShares);
        document.getElementById('totalSharesCount').textContent = newShares;
        showToast(`Shared on ${platform}!`, 'success');
    }
}

// Track view
async function trackView() {
    try {
        // Only track once per session
        if (sessionStorage.getItem(`viewed_${CONFIG.TOOL_SLUG}`)) return;
        sessionStorage.setItem(`viewed_${CONFIG.TOOL_SLUG}`, 'true');
        
        const response = await fetch(`${CONFIG.API_BASE}/api/usage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': CONFIG.API_KEY
            },
            body: JSON.stringify({
                tool_slug: CONFIG.TOOL_SLUG,
                category: CONFIG.CATEGORY,
                action: 'view'
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            document.getElementById('totalViewsCount').textContent = data.views || 0;
        }
    } catch (error) {
        console.warn('View tracking failed');
        const views = parseInt(localStorage.getItem(`views_${CONFIG.TOOL_SLUG}`) || '0');
        const newViews = views + 1;
        localStorage.setItem(`views_${CONFIG.TOOL_SLUG}`, newViews);
        document.getElementById('totalViewsCount').textContent = newViews;
    }
}

// ==================== AI QUESTION GENERATION ====================
async function callGrokAPI(prompt) {
    try {
        const response = await fetch(`https://${CONFIG.API_KEY}/api/grok/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                prompt: prompt,
                model: 'llama-3.1-8b-instant',
                max_tokens: 4000
            })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Grok API error:', error);
        return null;
    }
}

async function generateQuestionsFromAI() {
    showLoading(`🤖 AI is generating ${CONFIG.QUESTIONS_PER_QUIZ} unique ${currentState.subject} questions for Level ${currentState.level}...`);
    
    const subjectNames = { history: 'History', geography: 'Geography', gk: 'General Knowledge' };
    const levelNames = { 1: 'easy', 2: 'average', 3: 'hard' };
    
    let topicHint = '';
    if (currentState.subject === 'history') {
        topicHint = 'Include questions about ancient civilizations, medieval period, world wars, important historical figures, revolutions, and modern history. Make sure questions vary across different time periods and regions.';
    } else if (currentState.subject === 'geography') {
        topicHint = 'Include questions about countries, capitals, rivers, mountains, oceans, climates, natural wonders, population, and physical geography. Cover all continents.';
    } else {
        topicHint = 'Include questions about science, sports, awards, literature, arts, entertainment, technology, current affairs, and world records. Make questions diverse and interesting.';
    }
    
    const prompt = `Generate ${CONFIG.QUESTIONS_PER_QUIZ} unique, diverse multiple choice questions for ${subjectNames[currentState.subject]} at ${levelNames[currentState.level]} difficulty level.

${topicHint}

Requirements:
1. Each question must be completely different from others
2. Cover different subtopics within the subject
3. No repetitive or similar questions
4. All questions must be accurate and educational

For each question provide:
- question: The question text
- options: Array of 4 options (A, B, C, D)
- answer: Index of correct answer (0-3)
- explanation: Detailed explanation (2-3 sentences)
- factoid: Interesting fact related to the question

Return ONLY valid JSON format:
{
  "questions": [
    {
      "question": "text",
      "options": ["A", "B", "C", "D"],
      "answer": 0,
      "explanation": "detailed explanation",
      "factoid": "interesting fact"
    }
  ]
}

Make sure questions are age-appropriate and factually correct.`;

    const result = await callGrokAPI(prompt);
    
    if (result && result.questions && result.questions.length >= 10) {
        hideLoading();
        currentState.aiGenerated = true;
        return result.questions.slice(0, CONFIG.QUESTIONS_PER_QUIZ);
    } else {
        hideLoading();
        showToast('Using high-quality local question bank', 'warning');
        return getLocalQuestions();
    }
}

function getLocalQuestions() {
    const localBanks = {
        history: {
            1: [
                { question: "Which ancient civilization built the Pyramids of Giza?", options: ["Egyptian", "Roman", "Greek", "Mesopotamian"], answer: 0, explanation: "The ancient Egyptians built the Pyramids of Giza as tombs for their pharaohs around 2560 BCE.", factoid: "The Great Pyramid is the only remaining wonder of the ancient world.", points: 1, category: "history" },
                { question: "Who was the first Emperor of China?", options: ["Qin Shi Huang", "Confucius", "Sun Tzu", "Kublai Khan"], answer: 0, explanation: "Qin Shi Huang unified China in 221 BCE and became its first emperor.", factoid: "The Terracotta Army was built to protect him in the afterlife.", points: 1, category: "history" },
                { question: "Which empire was known as 'The Empire on which the sun never sets'?", options: ["British Empire", "Roman Empire", "Ottoman Empire", "Mongol Empire"], answer: 0, explanation: "The British Empire had territories across the globe at its peak.", factoid: "At its height, it controlled nearly 25% of Earth's land surface.", points: 1, category: "history" },
                { question: "Who painted the Mona Lisa?", options: ["Leonardo da Vinci", "Michelangelo", "Raphael", "Van Gogh"], answer: 0, explanation: "Leonardo da Vinci painted the Mona Lisa during the Renaissance period.", factoid: "The painting is displayed at the Louvre Museum in Paris.", points: 1, category: "history" },
                { question: "Which year did World War II end?", options: ["1945", "1944", "1946", "1943"], answer: 0, explanation: "World War II ended in 1945 after the Allied victory.", factoid: "The war resulted in an estimated 70-85 million casualties.", points: 1, category: "history" },
                { question: "Who wrote the Declaration of Independence?", options: ["Thomas Jefferson", "Benjamin Franklin", "John Adams", "George Washington"], answer: 0, explanation: "Thomas Jefferson drafted the Declaration of Independence in 1776.", factoid: "It was adopted on July 4, 1776.", points: 1, category: "history" },
                { question: "Which civilization invented the wheel?", options: ["Mesopotamians", "Egyptians", "Indus Valley", "Chinese"], answer: 0, explanation: "The wheel was invented by the ancient Mesopotamians around 3500 BCE.", factoid: "Early wheels were used for pottery, not transportation.", points: 1, category: "history" },
                { question: "Who was the first President of the United States?", options: ["George Washington", "John Adams", "Thomas Jefferson", "Abraham Lincoln"], answer: 0, explanation: "George Washington served as the first President from 1789 to 1797.", factoid: "He is the only President to be unanimously elected.", points: 1, category: "history" },
                { question: "What was the main cause of World War I?", options: ["Assassination of Archduke Franz Ferdinand", "German invasion of Poland", "Japanese attack on Pearl Harbor", "Cold War tensions"], answer: 0, explanation: "The assassination of Archduke Franz Ferdinand in 1914 triggered World War I.", factoid: "The war lasted from 1914 to 1918.", points: 1, category: "history" },
                { question: "Which ancient Greek city-state was known for its military strength?", options: ["Sparta", "Athens", "Corinth", "Thebes"], answer: 0, explanation: "Sparta was famous for its powerful army and military discipline.", factoid: "Spartan warriors were trained from age 7.", points: 1, category: "history" },
                { question: "Who built the Great Wall of China?", options: ["Qin Dynasty", "Han Dynasty", "Ming Dynasty", "Tang Dynasty"], answer: 0, explanation: "The first walls were built during the Qin Dynasty, but most of the current wall was built during the Ming Dynasty.", factoid: "The wall stretches over 13,000 miles.", points: 1, category: "history" },
                { question: "What was the Renaissance?", options: ["European cultural movement", "Religious war", "Scientific revolution", "Political uprising"], answer: 0, explanation: "The Renaissance was a period of European cultural, artistic, political, and economic rebirth.", factoid: "It began in Italy in the 14th century.", points: 1, category: "history" },
                { question: "Who discovered America?", options: ["Christopher Columbus", "Leif Erikson", "Marco Polo", "Vasco da Gama"], answer: 0, explanation: "Christopher Columbus reached the Americas in 1492, though Viking explorers had visited earlier.", factoid: "He was actually searching for a route to Asia.", points: 1, category: "history" },
                { question: "Which war was fought between the North and South in the United States?", options: ["Civil War", "Revolutionary War", "Spanish-American War", "Korean War"], answer: 0, explanation: "The American Civil War was fought from 1861 to 1865 between the Union and Confederacy.", factoid: "It ended with the surrender of Confederate forces.", points: 1, category: "history" },
                { question: "Who was the last Pharaoh of Egypt?", options: ["Cleopatra VII", "Hatshepsut", "Nefertiti", "Tutankhamun"], answer: 0, explanation: "Cleopatra VII was the last active ruler of the Ptolemaic Kingdom of Egypt.", factoid: "She died in 30 BCE after Egypt became a Roman province.", points: 1, category: "history" },
                { question: "What event started the Cold War?", options: ["Post-WWII tensions", "Korean War", "Vietnam War", "Cuban Missile Crisis"], answer: 0, explanation: "The Cold War began after World War II due to tensions between the US and Soviet Union.", factoid: "It lasted from 1947 to 1991.", points: 1, category: "history" },
                { question: "Who was the first Emperor of Rome?", options: ["Augustus", "Julius Caesar", "Nero", "Trajan"], answer: 0, explanation: "Augustus was the first Roman Emperor, ruling from 27 BCE to 14 CE.", factoid: "He was originally named Octavian.", points: 1, category: "history" },
                { question: "Which city was the capital of the Byzantine Empire?", options: ["Constantinople", "Rome", "Athens", "Alexandria"], answer: 0, explanation: "Constantinople (modern-day Istanbul) was the capital of the Byzantine Empire.", factoid: "It was founded by Constantine the Great in 330 CE.", points: 1, category: "history" },
                { question: "What was the Magna Carta?", options: ["A charter of rights", "A declaration of war", "A religious text", "A trade agreement"], answer: 0, explanation: "The Magna Carta was a charter of liberties signed in 1215 in England.", factoid: "It limited the powers of the king.", points: 1, category: "history" }
            ],
            2: [
                { question: "Who was the longest-reigning British monarch?", options: ["Queen Elizabeth II", "Queen Victoria", "King George III", "King Henry VIII"], answer: 0, explanation: "Queen Elizabeth II reigned for 70 years, the longest in British history.", factoid: "She became queen at age 25 in 1952.", points: 2, category: "history" },
                { question: "Which ancient wonder was located at Alexandria?", options: ["Lighthouse of Alexandria", "Colossus of Rhodes", "Hanging Gardens", "Temple of Artemis"], answer: 0, explanation: "The Lighthouse of Alexandria was one of the Seven Wonders.", factoid: "It was one of the tallest structures of its time.", points: 2, category: "history" },
                { question: "What was the impact of the printing press?", options: ["Mass communication", "Scientific revolution", "Religious reform", "All of the above"], answer: 3, explanation: "The printing press led to mass communication, scientific revolution, and religious reform.", factoid: "It was invented by Johannes Gutenberg in 1440.", points: 2, category: "history" },
                { question: "Who conquered the Mongol Empire after Genghis Khan?", options: ["Kublai Khan", "Batu Khan", "Tamerlane", "Attila"], answer: 0, explanation: "Kublai Khan conquered the Mongol Empire and established the Yuan Dynasty.", factoid: "He was the grandson of Genghis Khan.", points: 2, category: "history" },
                { question: "What was the main cause of the French Revolution?", options: ["Economic hardship and inequality", "Religious conflict", "Foreign invasion", "Royal marriage"], answer: 0, explanation: "The French Revolution was caused by economic hardship, inequality, and political unrest.", factoid: "It began in 1789 with the storming of the Bastille.", points: 2, category: "history" },
                { question: "Who was the first female Prime Minister of the United Kingdom?", options: ["Margaret Thatcher", "Theresa May", "Elizabeth II", "Indira Gandhi"], answer: 0, explanation: "Margaret Thatcher became Prime Minister in 1979, serving until 1990.", factoid: "She was known as the 'Iron Lady'.", points: 2, category: "history" },
                { question: "What was the Berlin Wall?", options: ["A barrier dividing Berlin", "A trade route", "A castle", "A bridge"], answer: 0, explanation: "The Berlin Wall was a barrier dividing East and West Berlin from 1961 to 1989.", factoid: "It fell on November 9, 1989.", points: 2, category: "history" }
            ],
            3: [
                { question: "Who wrote 'The Prince', a political treatise on power?", options: ["Niccolò Machiavelli", "Thomas Hobbes", "John Locke", "Voltaire"], answer: 0, explanation: "Machiavelli wrote 'The Prince' in 1513 as a guide for rulers.", factoid: "The term 'Machiavellian' comes from his philosophies.", points: 3, category: "history" },
                { question: "Which battle is considered the turning point of World War I?", options: ["Battle of Verdun", "Battle of Somme", "Battle of Marne", "Battle of Gallipoli"], answer: 0, explanation: "The Battle of Verdun lasted 10 months and caused massive casualties.", factoid: "It was one of the longest battles in human history.", points: 3, category: "history" },
                { question: "What was the significance of the Treaty of Versailles?", options: ["Ended WWI", "Started WWII", "Formed the UN", "Ended the Cold War"], answer: 0, explanation: "The Treaty of Versailles officially ended World War I in 1919.", factoid: "It imposed heavy reparations on Germany.", points: 3, category: "history" },
                { question: "Who was known as the 'Sun King'?", options: ["Louis XIV", "Louis XVI", "Napoleon", "Charlemagne"], answer: 0, explanation: "Louis XIV of France was known as the 'Sun King' for his power and opulence.", factoid: "He reigned for 72 years, the longest in European history.", points: 3, category: "history" }
            ]
        },
        geography: {
            1: [
                { question: "What is the longest river in the world?", options: ["Nile River", "Amazon River", "Yangtze River", "Mississippi River"], answer: 0, explanation: "The Nile River is approximately 6,650 km (4,130 miles) long.", factoid: "The Nile flows through 11 countries in Africa.", points: 1, category: "geography" },
                { question: "Which is the largest desert in the world?", options: ["Sahara Desert", "Gobi Desert", "Arabian Desert", "Antarctic Desert"], answer: 3, explanation: "The Antarctic Desert is the largest, covering 14 million sq km.", factoid: "Deserts are defined by low rainfall, not temperature.", points: 1, category: "geography" },
                { question: "Which country has the largest population?", options: ["China", "India", "USA", "Indonesia"], answer: 0, explanation: "China has over 1.4 billion people, the world's largest.", factoid: "India is expected to surpass China soon.", points: 1, category: "geography" },
                { question: "What is the capital of Japan?", options: ["Tokyo", "Kyoto", "Osaka", "Yokohama"], answer: 0, explanation: "Tokyo has been the capital of Japan since 1868.", factoid: "Tokyo is the world's most populous metropolitan area.", points: 1, category: "geography" },
                { question: "Which is the largest continent by area?", options: ["Asia", "Africa", "North America", "Europe"], answer: 0, explanation: "Asia is the largest continent, covering about 30% of Earth's land.", factoid: "It is home to over 4.5 billion people.", points: 1, category: "geography" },
                { question: "What is the highest mountain in the world?", options: ["Mount Everest", "K2", "Kangchenjunga", "Lhotse"], answer: 0, explanation: "Mount Everest is 8,848 meters (29,029 feet) high.", factoid: "It is located in the Himalayas on the Nepal-China border.", points: 1, category: "geography" },
                { question: "Which ocean is the largest?", options: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"], answer: 0, explanation: "The Pacific Ocean is the largest and deepest ocean.", factoid: "It covers approximately 63 million square miles.", points: 1, category: "geography" },
                { question: "What is the capital of Australia?", options: ["Canberra", "Sydney", "Melbourne", "Brisbane"], answer: 0, explanation: "Canberra has been the capital of Australia since 1927.", factoid: "It was chosen as a compromise between Sydney and Melbourne.", points: 1, category: "geography" },
                { question: "Which country is known as the 'Land of the Rising Sun'?", options: ["Japan", "China", "South Korea", "Thailand"], answer: 0, explanation: "Japan is known as the 'Land of the Rising Sun'.", factoid: "It is called Nihon or Nippon in Japanese, meaning 'origin of the sun'.", points: 1, category: "geography" },
                { question: "What is the longest river in Europe?", options: ["Volga", "Danube", "Rhine", "Elbe"], answer: 0, explanation: "The Volga River is 3,530 km (2,193 miles) long.", factoid: "It flows through central Russia.", points: 1, category: "geography" },
                { question: "Which country has the most natural lakes?", options: ["Canada", "USA", "Russia", "Brazil"], answer: 0, explanation: "Canada has over 2 million lakes, more than any other country.", factoid: "Great Bear Lake is one of Canada's largest lakes.", points: 1, category: "geography" },
                { question: "What is the capital of Egypt?", options: ["Cairo", "Alexandria", "Luxor", "Giza"], answer: 0, explanation: "Cairo is the capital of Egypt and one of the largest cities in Africa.", factoid: "It is located on the Nile River.", points: 1, category: "geography" },
                { question: "Which is the smallest country in the world?", options: ["Vatican City", "Monaco", "San Marino", "Liechtenstein"], answer: 0, explanation: "Vatican City is the smallest country in the world at 0.44 sq km.", factoid: "It is the headquarters of the Roman Catholic Church.", points: 1, category: "geography" },
                { question: "What is the deepest point in the ocean?", options: ["Mariana Trench", "Puerto Rico Trench", "Java Trench", "South Sandwich Trench"], answer: 0, explanation: "The Mariana Trench reaches depths of about 11,000 meters.", factoid: "Only three people have ever reached the bottom.", points: 1, category: "geography" },
                { question: "Which continent is the driest?", options: ["Antarctica", "Africa", "Australia", "South America"], answer: 0, explanation: "Antarctica is the driest continent with very little precipitation.", factoid: "It is considered a desert despite being covered in ice.", points: 1, category: "geography" }
            ],
            2: [
                { question: "Which country has the most islands?", options: ["Sweden", "Indonesia", "Philippines", "Japan"], answer: 0, explanation: "Sweden has over 267,000 islands, the most of any country.", factoid: "Only about 1,000 of them are inhabited.", points: 2, category: "geography" },
                { question: "What is the capital of Canada?", options: ["Ottawa", "Toronto", "Vancouver", "Montreal"], answer: 0, explanation: "Ottawa is the capital of Canada, located in Ontario.", factoid: "It was chosen as the capital by Queen Victoria.", points: 2, category: "geography" },
                { question: "Which desert is the largest hot desert?", options: ["Sahara", "Arabian", "Kalahari", "Great Victoria"], answer: 0, explanation: "The Sahara Desert is the largest hot desert in the world.", factoid: "It covers most of North Africa.", points: 2, category: "geography" },
                { question: "What is the highest waterfall in the world?", options: ["Angel Falls", "Niagara Falls", "Victoria Falls", "Iguazu Falls"], answer: 0, explanation: "Angel Falls in Venezuela is 979 meters (3,212 feet) high.", factoid: "It is named after pilot Jimmy Angel.", points: 2, category: "geography" }
            ],
            3: [
                { question: "What is the longest mountain range in the world?", options: ["Andes", "Himalayas", "Rocky Mountains", "Alps"], answer: 0, explanation: "The Andes is the longest mountain range, stretching 7,000 km.", factoid: "It runs along the western coast of South America.", points: 3, category: "geography" },
                { question: "Which country has the most active volcanoes?", options: ["Indonesia", "Japan", "USA", "Iceland"], answer: 0, explanation: "Indonesia has the most active volcanoes with over 130.", factoid: "It is part of the Pacific Ring of Fire.", points: 3, category: "geography" },
                { question: "What is the world's largest lake by surface area?", options: ["Caspian Sea", "Lake Superior", "Lake Victoria", "Lake Baikal"], answer: 0, explanation: "The Caspian Sea is the largest lake, covering 371,000 sq km.", factoid: "It is actually a saltwater lake.", points: 3, category: "geography" }
            ]
        },
        gk: {
            1: [
                { question: "Who wrote the national anthem of Pakistan?", options: ["Hafeez Jullundhri", "Allama Iqbal", "Faiz Ahmed Faiz", "Ahmed Faraz"], answer: 0, explanation: "Hafeez Jullundhri wrote the lyrics of the Pakistani national anthem in 1952.", factoid: "The music was composed by Ahmed G. Chagla.", points: 1, category: "gk" },
                { question: "Which is the national sport of Pakistan?", options: ["Field Hockey", "Cricket", "Squash", "Football"], answer: 0, explanation: "Field Hockey is the national sport of Pakistan.", factoid: "Pakistan has won Olympic gold medals in hockey.", points: 1, category: "gk" },
                { question: "What is the chemical symbol for water?", options: ["H2O", "CO2", "NaCl", "HCl"], answer: 0, explanation: "Water is composed of two hydrogen atoms and one oxygen atom.", factoid: "Water covers about 71% of Earth's surface.", points: 1, category: "gk" },
                { question: "Who developed the theory of relativity?", options: ["Albert Einstein", "Isaac Newton", "Stephen Hawking", "Marie Curie"], answer: 0, explanation: "Albert Einstein developed the theory of relativity in the early 20th century.", factoid: "His famous equation is E=mc².", points: 1, category: "gk" },
                { question: "What is the largest organ in the human body?", options: ["Skin", "Liver", "Heart", "Brain"], answer: 0, explanation: "The skin is the largest organ, covering the entire body.", factoid: "It protects us from pathogens and UV radiation.", points: 1, category: "gk" },
                { question: "Which planet is known as the Red Planet?", options: ["Mars", "Jupiter", "Saturn", "Venus"], answer: 0, explanation: "Mars is known as the Red Planet due to its reddish appearance.", factoid: "The red color comes from iron oxide on its surface.", points: 1, category: "gk" },
                { question: "Who painted the Sistine Chapel ceiling?", options: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Donatello"], answer: 0, explanation: "Michelangelo painted the Sistine Chapel ceiling from 1508 to 1512.", factoid: "He painted it lying on his back on scaffolding.", points: 1, category: "gk" },
                { question: "What is the speed of light?", options: ["299,792,458 m/s", "300,000,000 m/s", "299,792,458 km/s", "300,000 km/s"], answer: 0, explanation: "The speed of light in vacuum is 299,792,458 meters per second.", factoid: "It's the fastest speed in the universe.", points: 1, category: "gk" },
                { question: "Who wrote the play 'Romeo and Juliet'?", options: ["William Shakespeare", "Christopher Marlowe", "Ben Jonson", "John Webster"], answer: 0, explanation: "William Shakespeare wrote 'Romeo and Juliet' in the late 16th century.", factoid: "It is one of his most famous tragedies.", points: 1, category: "gk" },
                { question: "What is the tallest animal in the world?", options: ["Giraffe", "Elephant", "Camel", "Horse"], answer: 0, explanation: "The giraffe is the tallest animal, reaching up to 18 feet.", factoid: "Their long necks help them reach high leaves.", points: 1, category: "gk" },
                { question: "What is the currency of Japan?", options: ["Yen", "Won", "Dollar", "Euro"], answer: 0, explanation: "The Japanese yen is the official currency of Japan.", factoid: "It is the third most traded currency in the world.", points: 1, category: "gk" },
                { question: "Who was the first man to walk on the moon?", options: ["Neil Armstrong", "Buzz Aldrin", "John Glenn", "Alan Shepard"], answer: 0, explanation: "Neil Armstrong was the first man to walk on the moon in 1969.", factoid: "His famous words were: 'That's one small step for man, one giant leap for mankind.'", points: 1, category: "gk" },
                { question: "What is the chemical symbol for Gold?", options: ["Au", "Ag", "Fe", "Pb"], answer: 0, explanation: "Au comes from the Latin word 'aurum' meaning gold.", factoid: "Gold is one of the least reactive metals.", points: 1, category: "gk" }
            ],
            2: [
                { question: "Who won the Nobel Peace Prize in 2014?", options: ["Malala Yousafzai", "Kailash Satyarthi", "Barack Obama", "Mother Teresa"], answer: 0, explanation: "Malala Yousafzai won for her activism for female education.", factoid: "She is the youngest Nobel laureate ever.", points: 2, category: "gk" },
                { question: "What is the largest bone in the human body?", options: ["Femur", "Tibia", "Humerus", "Pelvis"], answer: 0, explanation: "The femur is the longest and heaviest bone in the body.", factoid: "It is the strongest bone in the body.", points: 2, category: "gk" },
                { question: "Who invented the telephone?", options: ["Alexander Graham Bell", "Thomas Edison", "Nikola Tesla", "Guglielmo Marconi"], answer: 0, explanation: "Alexander Graham Bell patented the telephone in 1876.", factoid: "He was a Scottish-born inventor.", points: 2, category: "gk" },
                { question: "What is the main gas in Earth's atmosphere?", options: ["Nitrogen", "Oxygen", "Carbon Dioxide", "Argon"], answer: 0, explanation: "Nitrogen makes up about 78% of Earth's atmosphere.", factoid: "Oxygen makes up about 21%.", points: 2, category: "gk" }
            ],
            3: [
                { question: "What is the smallest bone in the human body?", options: ["Stapes", "Malleus", "Incus", "Patella"], answer: 0, explanation: "The stapes is the smallest bone in the human body, located in the ear.", factoid: "It measures about 3 mm in length.", points: 3, category: "gk" },
                { question: "Who discovered penicillin?", options: ["Alexander Fleming", "Louis Pasteur", "Robert Koch", "Joseph Lister"], answer: 0, explanation: "Alexander Fleming discovered penicillin in 1928.", factoid: "It was the first antibiotic discovered.", points: 3, category: "gk" },
                { question: "What is the hardest natural substance?", options: ["Diamond", "Graphite", "Quartz", "Topaz"], answer: 0, explanation: "Diamond is the hardest natural substance in the world.", factoid: "It scores a perfect 10 on the Mohs scale.", points: 3, category: "gk" }
            ]
        }
    };
    
    let questions = localBanks[currentState.subject]?.[currentState.level] || localBanks.history[1];
    const expanded = [...questions];
    while (expanded.length < CONFIG.QUESTIONS_PER_QUIZ) {
        expanded.push(...questions);
    }
    return expanded.slice(0, CONFIG.QUESTIONS_PER_QUIZ);
}

// ==================== UTILITY FUNCTIONS ====================
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function showLoading(message) {
    const overlay = document.getElementById('loadingOverlay');
    document.getElementById('loadingMessage').textContent = message;
    overlay.style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function updateUsageDisplay(count) {
    document.querySelectorAll('.stats-badge, #globalUsageCount').forEach(el => {
        if (el) el.textContent = count.toLocaleString();
    });
}

function updateStatsDisplay(stats) {
    if (stats) {
        document.getElementById('totalUsersCount').textContent = (stats.usage || 0).toLocaleString();
        document.getElementById('totalViewsCount').textContent = (stats.views || 0).toLocaleString();
        document.getElementById('totalSharesCount').textContent = (stats.shares || 0).toLocaleString();
        document.getElementById('heroUsers').textContent = (stats.usage || 0).toLocaleString();
        document.getElementById('heroQuizzes').textContent = (stats.usage || 0).toLocaleString();
        
        // Update reaction counts
        if (stats.reactions) {
            Object.entries(stats.reactions).forEach(([emoji, count]) => {
                const el = document.getElementById(`reaction${emoji.charAt(0).toUpperCase() + emoji.slice(1)}`);
                if (el) el.textContent = count;
            });
        }
    }
}

function updateReactionDisplay(emoji, count) {
    const el = document.getElementById(`reaction${emoji.charAt(0).toUpperCase() + emoji.slice(1)}`);
    if (el) el.textContent = count;
}

function getEmojiName(emoji) {
    const names = { like: '👍', love: '❤️', wow: '😮', sad: '😢', laugh: '😂', celebrate: '🎉', angry: '😡' };
    return names[emoji] || emoji;
}

// ==================== SHARING ====================
function shareQuiz(platform) {
    const url = window.location.href;
    const score = document.getElementById('finalScoreValue')?.textContent || '0';
    const text = `I scored ${score} on the ${currentState.subject} quiz at Level ${currentState.level}! Try it yourself!`;
    
    let shareUrl = '';
    switch(platform) {
        case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`; break;
        case 'twitter': shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`; break;
        case 'whatsapp': shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`; break;
        case 'linkedin': shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`; break;
        case 'email': shareUrl = `mailto:?subject=Quiz Challenge&body=${encodeURIComponent(text + '\n\n' + url)}`; break;
        case 'copy': 
            navigator.clipboard.writeText(url).then(() => {
                showToast('Link copied to clipboard!', 'success');
            });
            return;
    }
    if (shareUrl) {
        window.open(shareUrl, '_blank');
        trackShare(platform);
    }
}

function copyPageUrl() {
    shareQuiz('copy');
}

// ==================== QUIZ FUNCTIONS ====================
async function startQuiz(subject, level) {
    currentState.subject = subject;
    currentState.level = level;
    currentState.currentQuestion = 0;
    currentState.score = 0;
    currentState.totalPoints = 0;
    currentState.lives = 3;
    currentState.userAnswers = [];
    currentState.powerups = { fifty: 3, time: 3, hint: 3, skip: 3 };
    currentState.weakAreas = {};
    currentState.timeLeft = TIME_LIMITS[level];
    
    showLoading('🤖 AI is generating unique questions...');
    
    const questions = await generateQuestionsFromAI();
    currentState.questions = questions;
    
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('levelsContainer').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';
    document.getElementById('resultsContainer').style.display = 'none';
    
    const subjectNames = { history: 'History', geography: 'Geography', gk: 'General Knowledge' };
    const levelNames = { 1: 'Easy', 2: 'Average', 3: 'Hard' };
    document.getElementById('quizSubject').textContent = subjectNames[subject];
    document.getElementById('quizLevel').textContent = levelNames[level];
    document.getElementById('totalQuestions').textContent = currentState.questions.length;
    document.getElementById('livesCount').textContent = currentState.lives;
    document.getElementById('scoreCount').textContent = currentState.score;
    
    loadQuestion();
    startTimer();
    trackToolUsage();
}

function startTimer() {
    if (currentState.timer) clearInterval(currentState.timer);
    currentState.timer = setInterval(() => {
        if (currentState.timeLeft <= 0) {
            clearInterval(currentState.timer);
            handleTimeout();
        } else {
            currentState.timeLeft--;
            document.getElementById('timerDisplay').textContent = currentState.timeLeft;
            if (currentState.timeLeft <= 5) {
                document.getElementById('timerDisplay').style.color = '#ef4444';
                document.getElementById('timerDisplay').style.animation = 'pulse 0.5s infinite';
            }
        }
    }, 1000);
}

function handleTimeout() {
    if (currentState.userAnswers[currentState.currentQuestion] !== undefined) return;
    currentState.lives--;
    document.getElementById('livesCount').textContent = currentState.lives;
    showToast(`⏰ Time's up! -1 life`, 'error');
    
    if (currentState.lives <= 0) {
        endQuiz();
    } else {
        currentState.userAnswers[currentState.currentQuestion] = { selected: -1, correct: false };
        document.getElementById('nextBtn').disabled = false;
    }
}

function loadQuestion() {
    const q = currentState.questions[currentState.currentQuestion];
    document.getElementById('questionText').textContent = q.question;
    document.getElementById('questionPoints').textContent = `+${POINTS_PER_LEVEL[currentState.level]} point${POINTS_PER_LEVEL[currentState.level] > 1 ? 's' : ''}`;
    document.getElementById('questionCategory').textContent = currentState.subject.charAt(0).toUpperCase() + currentState.subject.slice(1);
    document.getElementById('currentQuestionNum').textContent = currentState.currentQuestion + 1;
    document.getElementById('progressFill').style.width = `${((currentState.currentQuestion + 1) / currentState.questions.length) * 100}%`;
    
    const optsContainer = document.getElementById('optionsList');
    optsContainer.innerHTML = '';
    q.options.forEach((opt, idx) => {
        const div = document.createElement('div');
        div.className = 'option';
        div.textContent = `${String.fromCharCode(65 + idx)}. ${opt}`;
        div.onclick = () => selectAnswer(idx);
        optsContainer.appendChild(div);
    });
    
    document.getElementById('explanationBox').style.display = 'none';
    document.getElementById('nextBtn').disabled = true;
    document.getElementById('prevBtn').disabled = currentState.currentQuestion === 0;
    updatePowerupsDisplay();
}

function selectAnswer(selectedIdx) {
    if (currentState.userAnswers[currentState.currentQuestion] !== undefined) return;
    
    const q = currentState.questions[currentState.currentQuestion];
    const isCorrect = (selectedIdx === q.answer);
    
    if (isCorrect) {
        currentState.totalPoints += POINTS_PER_LEVEL[currentState.level];
        currentState.score += 10;
        showToast('✅ Correct!', 'success');
        playSound(true);
    } else {
        currentState.lives--;
        showToast(`❌ Incorrect! Correct: ${String.fromCharCode(65 + q.answer)}`, 'error');
        playSound(false);
        trackWeakArea(q.category || currentState.subject);
    }
    
    currentState.userAnswers[currentState.currentQuestion] = { selected: selectedIdx, correct: isCorrect };
    document.getElementById('livesCount').textContent = currentState.lives;
    document.getElementById('scoreCount').textContent = currentState.score;
    
    const opts = document.querySelectorAll('.option');
    opts.forEach((opt, idx) => {
        if (idx === q.answer) opt.classList.add('correct');
        else if (idx === selectedIdx && !isCorrect) opt.classList.add('incorrect');
        opt.style.pointerEvents = 'none';
    });
    
    document.getElementById('explanationText').textContent = q.explanation;
    document.getElementById('factoidText').textContent = q.factoid || '📚 Keep learning! Every quiz makes you smarter.';
    document.getElementById('explanationBox').style.display = 'block';
    document.getElementById('nextBtn').disabled = false;
    
    if (currentState.lives <= 0) setTimeout(() => endQuiz(), 1500);
}

function trackWeakArea(category) {
    if (!currentState.weakAreas[category]) currentState.weakAreas[category] = 0;
    currentState.weakAreas[category]++;
}

function nextQuestion() {
    if (currentState.currentQuestion + 1 < currentState.questions.length) {
        currentState.currentQuestion++;
        loadQuestion();
    } else {
        endQuiz();
    }
}

function prevQuestion() {
    if (currentState.currentQuestion > 0) {
        currentState.currentQuestion--;
        loadQuestion();
    }
}

function endQuiz() {
    if (currentState.timer) clearInterval(currentState.timer);
    
    const percentage = Math.round((currentState.score / (currentState.questions.length * 10)) * 100);
    const correctCount = currentState.userAnswers.filter(a => a && a.correct).length;
    
    document.getElementById('finalScoreValue').textContent = `${percentage}%`;
    
    let badge = 'Knowledge Explorer 📚';
    if (percentage >= 90) badge = 'Master Historian 🎓🏆';
    else if (percentage >= 75) badge = 'Wisdom Seeker 🌟';
    else if (percentage >= 50) badge = 'Curious Learner ✨';
    document.getElementById('badgeEarned').textContent = badge;
    
    let streak = parseInt(localStorage.getItem('historyStreak') || '0');
    if (percentage >= 60) { streak++; localStorage.setItem('historyStreak', streak); }
    else { streak = 0; localStorage.setItem('historyStreak', '0'); }
    document.getElementById('streakCount').textContent = streak;
    
    const weakList = document.getElementById('weakAreasList');
    weakList.innerHTML = '';
    Object.entries(currentState.weakAreas).slice(0, 5).forEach(([area, count]) => {
        const tag = document.createElement('span');
        tag.className = 'weak-area-tag';
        tag.textContent = `${area}: ${count} mistakes`;
        weakList.appendChild(tag);
    });
    
    updateProgressChart(percentage);
    
    document.getElementById('quizContainer').style.display = 'none';
    document.getElementById('resultsContainer').style.display = 'block';
    if (percentage >= 75) createConfetti();
}

function updateProgressChart(score) {
    const ctx = document.getElementById('progressChart')?.getContext('2d');
    if (!ctx) return;
    if (progressChart) progressChart.destroy();
    progressChart = new Chart(ctx, {
        type: 'line',
        data: { 
            labels: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Current'], 
            datasets: [{ 
                label: 'Your Progress', 
                data: [40, 55, 70, score], 
                borderColor: '#8e44ad', 
                backgroundColor: 'rgba(142,68,173,0.1)', 
                fill: true, 
                tension: 0.4 
            }]
        },
        options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'top' } } }
    });
}

// ==================== POWERUPS ====================
function usePowerup(type) {
    if (currentState.powerups[type] <= 0) { showToast(`No ${type} left!`, 'warning'); return; }
    if (currentState.userAnswers[currentState.currentQuestion] !== undefined) { showToast('Already answered!', 'warning'); return; }
    
    const q = currentState.questions[currentState.currentQuestion];
    currentState.powerups[type]--;
    
    if (type === 'fifty') {
        const wrong = [];
        for (let i = 0; i < q.options.length; i++) if (i !== q.answer) wrong.push(i);
        const toRemove = wrong.slice(0, 2);
        document.querySelectorAll('.option').forEach((opt, idx) => {
            if (toRemove.includes(idx)) opt.style.opacity = '0.4';
        });
        showToast('50/50 used! Two options eliminated.', 'success');
    } else if (type === 'time') {
        if (!isPremium()) { showPremiumModal(); return; }
        currentState.timeLeft += 30;
        showToast('+30 seconds added!', 'success');
    } else if (type === 'hint') {
        if (!isPremium()) { showPremiumModal(); return; }
        showToast(`💡 Hint: ${q.explanation.substring(0, 80)}...`, 'info');
    } else if (type === 'skip') {
        if (currentState.userAnswers[currentState.currentQuestion] !== undefined) return;
        currentState.userAnswers[currentState.currentQuestion] = { selected: -1, correct: false };
        nextQuestion();
        showToast('Question skipped!', 'info');
    }
    updatePowerupsDisplay();
}

function updatePowerupsDisplay() {
    document.querySelectorAll('.powerup-btn').forEach(btn => {
        const type = btn.getAttribute('data-powerup');
        const span = btn.querySelector('.powerup-count');
        if (span && currentState.powerups[type] !== undefined) {
            span.textContent = currentState.powerups[type];
            if (currentState.powerups[type] === 0) btn.disabled = true;
        }
    });
}

// ==================== AUDIO & SPEECH ====================
function readAloud() {
    const q = currentState.questions[currentState.currentQuestion];
    if (!q) return;
    const utterance = new SpeechSynthesisUtterance(q.question);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
}

function startSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window)) { showToast('Speech recognition not supported', 'error'); return; }
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript.toLowerCase();
        const q = currentState.questions[currentState.currentQuestion];
        const correctOption = q.options[q.answer].toLowerCase();
        if (spoken.includes(correctOption) || correctOption.includes(spoken)) {
            selectAnswer(q.answer);
        } else {
            showToast(`You said: "${spoken}". Try again!`, 'error');
        }
    };
    recognition.start();
    showToast('🎤 Listening... Speak your answer', 'info');
}

function playSound(isCorrect) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.frequency.value = isCorrect ? 880 : 440;
        gainNode.gain.value = 0.15;
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.5);
        oscillator.stop(audioCtx.currentTime + 0.5);
    } catch(e) {}
}

function createConfetti() {
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = '-20px';
        confetti.style.borderRadius = '50%';
        confetti.style.zIndex = '1000';
        confetti.style.pointerEvents = 'none';
        confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
    }
}

// ==================== TYPEWRITER EFFECT ====================
function setupTypewriter() {
    const phrases = [
        '🏛️ Explore ancient civilizations',
        '🌍 Master world geography',
        '🧠 Test your general knowledge',
        '📚 Learn something new every day',
        '🏆 Challenge yourself with AI questions'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const el = document.getElementById('typewriterText');
    
    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (!isDeleting) {
            el.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentPhrase.length) {
                setTimeout(() => { isDeleting = true; }, 1500);
            }
            setTimeout(type, 60);
        } else {
            el.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(type, 500);
            } else {
                setTimeout(type, 30);
            }
        }
    }
    
    type();
}

// ==================== UI THEMES ====================
function setupTheme() {
    const saved = localStorage.getItem('theme') || 'light';
    if (saved === 'dark') document.body.setAttribute('data-theme', 'dark');
    document.getElementById('themeToggle').onclick = () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        if (isDark) { document.body.removeAttribute('data-theme'); localStorage.setItem('theme', 'light'); }
        else { document.body.setAttribute('data-theme', 'dark'); localStorage.setItem('theme', 'dark'); }
    };
}

function setupScrollButtons() {
    const up = document.getElementById('scrollUpBtn'), down = document.getElementById('scrollDownBtn');
    window.addEventListener('scroll', () => up.style.display = window.scrollY > 200 ? 'flex' : 'none');
    up.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    down.onclick = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function isPremium() { return localStorage.getItem('isPremium') === 'true'; }
function showPremiumModal() { document.getElementById('premiumModal').style.display = 'flex'; }
function closePremiumModal() { document.getElementById('premiumModal').style.display = 'none'; }

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Subject selection
    document.querySelectorAll('.subject-select-btn').forEach(btn => {
        btn.onclick = (e) => {
            const card = btn.closest('.subject-card');
            const subject = card.getAttribute('data-subject');
            const subjectNames = { history: 'History', geography: 'Geography', gk: 'General Knowledge' };
            document.getElementById('selectedSubjectTitle').textContent = subjectNames[subject];
            currentState.subject = subject;
            document.getElementById('dashboard').style.display = 'none';
            document.getElementById('levelsContainer').style.display = 'block';
        };
    });
    
    // Level selection
    document.querySelectorAll('.level-start-btn').forEach(btn => {
        btn.onclick = (e) => {
            const level = parseInt(btn.closest('.level-card').getAttribute('data-level'));
            startQuiz(currentState.subject, level);
        };
    });
    
    // Back buttons
    document.getElementById('backToDashboardBtn').onclick = () => {
        document.getElementById('levelsContainer').style.display = 'none';
        document.getElementById('dashboard').style.display = 'grid';
    };
    
    // Quiz navigation
    document.getElementById('nextBtn').onclick = nextQuestion;
    document.getElementById('prevBtn').onclick = prevQuestion;
    
    // Powerups
    document.getElementById('fiftyBtn').onclick = () => usePowerup('fifty');
    document.getElementById('timeBtn').onclick = () => usePowerup('time');
    document.getElementById('hintBtn').onclick = () => usePowerup('hint');
    document.getElementById('skipBtn').onclick = () => usePowerup('skip');
    
    // Audio
    document.getElementById('readAloudBtn').onclick = readAloud;
    document.getElementById('speechAnswerBtn').onclick = startSpeechRecognition;
    
    // Results actions
    document.getElementById('tryAgainBtn').onclick = () => startQuiz(currentState.subject, currentState.level);
    document.getElementById('changeLevelBtn').onclick = () => {
        document.getElementById('resultsContainer').style.display = 'none';
        document.getElementById('levelsContainer').style.display = 'block';
    };
    document.getElementById('dashboardReturnBtn').onclick = () => {
        document.getElementById('resultsContainer').style.display = 'none';
        document.getElementById('dashboard').style.display = 'grid';
    };
    
    // Reactions - Main bar
    document.querySelectorAll('.reaction-mini-btn').forEach(btn => {
        btn.onclick = () => trackReaction(btn.getAttribute('data-emoji'));
    });
    
    // Reactions - Results
    document.querySelectorAll('.reaction-emoji').forEach(btn => {
        btn.onclick = () => trackReaction(btn.getAttribute('data-emoji'));
    });
    
    // Share buttons
    document.querySelectorAll('.share-mini-btn').forEach(btn => {
        if (btn.id === 'copyPageUrlBtn') btn.onclick = copyPageUrl;
        else btn.onclick = () => shareQuiz(btn.getAttribute('data-platform'));
    });
    
    // Social icons
    document.querySelectorAll('.social-icon').forEach(btn => {
        btn.onclick = () => shareQuiz(btn.getAttribute('data-platform'));
    });
    
    // Modal
    document.getElementById('closeModalBtn').onclick = closePremiumModal;
    document.getElementById('maybeLaterBtn').onclick = closePremiumModal;
    document.getElementById('upgradeBtn').onclick = () => {
        localStorage.setItem('isPremium', 'true');
        showToast('Premium activated! 🎉', 'success');
        closePremiumModal();
    };
    
    // Stats button
    document.getElementById('statsBtn').onclick = () => {
        showToast(`Total plays: ${toolUsageCount}`, 'info');
    };
}

// ==================== INITIALIZATION ====================
async function init() {
    setupTheme();
    setupScrollButtons();
    setupTypewriter();
    setupEventListeners();
    
    // Track usage on load
    await trackToolUsage();
    await fetchToolStats();
    await trackView();
    
    // Load saved streak
    const savedStreak = localStorage.getItem('historyStreak') || '0';
    document.getElementById('streakCount').textContent = savedStreak;
    document.getElementById('totalQuestionsCount').textContent = '5000+';
    
    // Set hero stats
    document.getElementById('heroQuestions').textContent = '5000+';
    
    showToast('🎓 Welcome to History, Geography & GK Quiz Challenge! AI generates unique questions each time.', 'success');
}

// ==================== STYLES FOR ANIMATIONS ====================
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
    }
    @keyframes pulse {
        0%,100% { opacity: 1; }
        50% { opacity: 0.6; }
    }
    @keyframes blink {
        50% { border-color: transparent; }
    }
    @keyframes float {
        0%,100% { transform: translateY(0px); }
        50% { transform: translateY(-15px); }
    }
    @keyframes float-emoji {
        0%,100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(10deg); }
    }
    @keyframes pulse-icon {
        0%,100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    .typewriter-text {
        display: inline;
        border-right: 3px solid #3b82f6;
        padding-right: 5px;
        animation: blink 0.8s step-end infinite;
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', init);
