/**
 * ============================================
 * AGE CALCULATOR PRO - COMPLETE VERSION
 * Cloudflare Workers API Integration
 * Dark Theme + AI-Powered Features
 * ============================================
 */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    API_BASE: 'https://magicrills-api.uzairhameed01.workers.dev',
    API_KEY: 'magicrills-grok-api.uzairhameed01.workers.dev',
    TOOL_SLUG: 'age-calculator-pro',
    TOOL_NAME: 'Age Calculator Pro',
    CATEGORY: 'Mixed-Tools'
};

// ============================================
// STATE
// ============================================
let currentAge = null;
let currentBirthDate = null;
let chartInstance = null;
let countdownInterval = null;

// ============================================
// HEALTH TIPS DATABASE
// ============================================
const healthTipsDatabase = {
    "0-12": {
        title: "🌟 Childhood (0-12 years)",
        tips: [
            { icon: "🥛", title: "Calcium Intake", desc: "2 glasses of milk or yogurt daily - for strong bones" },
            { icon: "💉", title: "Vaccination", desc: "Complete vaccination - essential for disease prevention" },
            { icon: "😴", title: "Sleep Routine", desc: "9-12 hours of sleep - for brain development" },
            { icon: "🏃", title: "Physical Activity", desc: "1 hour of outdoor play - for eyes and body" }
        ]
    },
    "13-19": {
        title: "🎓 Teenage (13-19 years)",
        tips: [
            { icon: "🥚", title: "Protein Diet", desc: "Eggs, lentils, meat, fish - for growth" },
            { icon: "📱", title: "Screen Time", desc: "Protect eyes from mobile - take breaks every 20 min" },
            { icon: "🧘", title: "Mental Health", desc: "30 min exercise daily - reduce stress" },
            { icon: "🦷", title: "Dental Care", desc: "Calcium for strong teeth" }
        ]
    },
    "20-35": {
        title: "💪 Young Adult (20-35 years)",
        tips: [
            { icon: "🥬", title: "Folic Acid", desc: "Eat green vegetables and fruits - especially for women" },
            { icon: "☀️", title: "Vitamin D", desc: "15 minutes of morning sunlight - for bones" },
            { icon: "💧", title: "Hydration", desc: "8-10 glasses of water daily" },
            { icon: "❤️", title: "Medical Checkup", desc: "Annual checkup - essential before marriage" }
        ]
    },
    "36-50": {
        title: "🧘 Middle Age (36-50 years)",
        tips: [
            { icon: "🩸", title: "Blood Pressure", desc: "Monthly BP and sugar check" },
            { icon: "🚶", title: "Walking", desc: "10,000 steps daily - for heart health" },
            { icon: "🥗", title: "Low Fat", desc: "Use olive oil - reduce cholesterol" },
            { icon: "😌", title: "Meditation", desc: "Prayer and meditation - for peace" }
        ]
    },
    "51-65": {
        title: "👴 Senior (51-65 years)",
        tips: [
            { icon: "🐟", title: "Heart Health", desc: "Fish and walnuts - for Omega 3" },
            { icon: "🦴", title: "Bone Care", desc: "Calcium and Vitamin D - for bones" },
            { icon: "📖", title: "Brain Exercise", desc: "Daily reading - keep memory sharp" },
            { icon: "🍲", title: "Light Diet", desc: "Easily digestible food" }
        ]
    },
    "65+": {
        title: "👵 Elderly (65+ years)",
        tips: [
            { icon: "🚶", title: "Daily Walk", desc: "20 min walk morning and evening" },
            { icon: "💊", title: "Medication", desc: "Take medicines as per doctor's advice" },
            { icon: "🧩", title: "Brain Challenge", desc: "Puzzles and crosswords - keep mind sharp" },
            { icon: "🍵", title: "Herbal Tea", desc: "Warm water and herbal tea - for digestion" }
        ]
    }
};

// Extra Life Tips
const extraLifeTips = {
    "0-12": ["🍎 Apple a day keeps the doctor away", "📚 1 hour of study daily", "🎨 Coloring improves brain"],
    "13-19": ["📵 No phone 1 hour before sleep", "🏃 Exercise 3 times a week", "🥗 Avoid junk food"],
    "20-35": ["💼 Walk during work breaks", "🥑 Add fruits to breakfast", "📝 8 hours sleep essential"],
    "36-50": ["🩸 Blood test every 6 months", "🚭 No smoking or tobacco", "🧘 10 min meditation daily"],
    "51-65": ["🦴 Calcium supplements as prescribed", "👓 Annual eye checkup", "🚶 Use stairs"],
    "65+": ["👨‍⚕️ Regular doctor visits", "💊 Take medicines on time", "👪 Spend time with family"]
};

// Seasonal Tips
const seasonalTips = {
    summer: ["🥤 Drink more water - 10-12 glasses", "🍉 Eat watermelon and cucumber", "🕛 Avoid sun at noon"],
    winter: ["🧣 Wear warm clothes", "🍯 Ginger and honey tea", "☀️ Sit in morning sunlight"],
    rainy: ["🌧️ Avoid rain water", "🍲 Hot soup", "🦟 Protect from mosquitoes"]
};

// Local Foods
const localFoodTips = [
    { food: "Lentils (Dal)", benefit: "Protein and fiber" },
    { food: "Buttermilk (Lassi)", benefit: "Probiotics - gut health" },
    { food: "Greens (Saag)", benefit: "Iron - prevent anemia" },
    { food: "Cauliflower (Gobhi)", benefit: "Vitamin C - immunity" }
];

// Zodiac Traits
const zodiacTraits = {
    "Aries": "Bold, ambitious, confident",
    "Taurus": "Reliable, patient, practical",
    "Gemini": "Adaptable, outgoing, intelligent",
    "Cancer": "Loyal, emotional, intuitive",
    "Leo": "Creative, passionate, generous",
    "Virgo": "Analytical, kind, hardworking",
    "Libra": "Diplomatic, graceful, social",
    "Scorpio": "Brave, resourceful, passionate",
    "Sagittarius": "Optimistic, adventurous, funny",
    "Capricorn": "Responsible, disciplined, self-control",
    "Aquarius": "Progressive, original, independent",
    "Pisces": "Compassionate, artistic, intuitive"
};

const chineseTraits = {
    "Rat": "Quick-witted, resourceful, versatile",
    "Ox": "Diligent, dependable, strong",
    "Tiger": "Brave, confident, competitive",
    "Rabbit": "Gentle, quiet, elegant",
    "Dragon": "Confident, intelligent, enthusiastic",
    "Snake": "Wise, mysterious, intuitive",
    "Horse": "Energetic, independent, free-spirited",
    "Goat": "Creative, calm, gentle",
    "Monkey": "Clever, witty, inventive",
    "Rooster": "Observant, hardworking, courageous",
    "Dog": "Loyal, honest, kind",
    "Pig": "Generous, compassionate, diligent"
};

// ============================================
// CLOUDFLARE API FUNCTIONS
// ============================================

/**
 * API Call with error handling and localStorage fallback
 */
async function callAPI(endpoint, method = 'GET', data = null) {
    const url = `${CONFIG.API_BASE}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        'X-API-Key': CONFIG.API_KEY,
        'X-Tool-Slug': CONFIG.TOOL_SLUG
    };

    const options = {
        method,
        headers,
        credentials: 'include'
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.warn('API call failed, using localStorage fallback:', error);
        return null;
    }
}

/**
 * Increment usage count
 */
async function incrementUsage() {
    try {
        const result = await callAPI('/api/usage', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            tool_name: CONFIG.TOOL_NAME,
            category: CONFIG.CATEGORY
        });
        if (result && result.success) {
            localStorage.setItem('usageCount', result.usage || '0');
            updateUsageDisplay(result.usage);
        }
        return result;
    } catch (error) {
        console.warn('Usage increment failed, using localStorage');
        let count = parseInt(localStorage.getItem('usageCount') || '0') + 1;
        localStorage.setItem('usageCount', count);
        updateUsageDisplay(count);
        return null;
    }
}

/**
 * Record a reaction
 */
async function recordReaction(reactionType) {
    try {
        const result = await callAPI('/api/reactions', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            reaction: reactionType,
            value: 1
        });
        if (result) {
            loadReactions();
        }
        return result;
    } catch (error) {
        console.warn('Reaction record failed, using localStorage');
        let count = parseInt(localStorage.getItem(`reaction_${reactionType}`) || '0') + 1;
        localStorage.setItem(`reaction_${reactionType}`, count);
        document.getElementById(`${reactionType}Count`).textContent = count;
        return null;
    }
}

/**
 * Record a share
 */
async function recordShare(platform) {
    try {
        const result = await callAPI('/api/shares', 'POST', {
            tool_slug: CONFIG.TOOL_SLUG,
            platform: platform
        });
        if (result) {
            loadStats();
        }
        return result;
    } catch (error) {
        console.warn('Share record failed, using localStorage');
        let count = parseInt(localStorage.getItem('shareCount') || '0') + 1;
        localStorage.setItem('shareCount', count);
        updateShareDisplay(count);
        return null;
    }
}

/**
 * Get tool statistics
 */
async function loadStats() {
    try {
        const result = await callAPI(`/api/stats?tool_slug=${CONFIG.TOOL_SLUG}`, 'GET');
        if (result && result.success) {
            updateStatsDisplay(result.data);
            // Store in localStorage as fallback
            localStorage.setItem('stats_usage', result.data.usage || '0');
            localStorage.setItem('stats_views', result.data.views || '0');
            localStorage.setItem('stats_shares', result.data.shares || '0');
            localStorage.setItem('stats_reactions', result.data.reactions || '0');
        } else {
            // Use localStorage fallback
            loadStatsFromLocalStorage();
        }
    } catch (error) {
        console.warn('Stats load failed, using localStorage fallback');
        loadStatsFromLocalStorage();
    }
}

/**
 * Load stats from localStorage as fallback
 */
function loadStatsFromLocalStorage() {
    const stats = {
        usage: localStorage.getItem('usageCount') || '0',
        views: localStorage.getItem('stats_views') || '0',
        shares: localStorage.getItem('shareCount') || '0',
        reactions: localStorage.getItem('totalReactions') || '0'
    };
    updateStatsDisplay(stats);
}

/**
 * Update stats display
 */
function updateStatsDisplay(stats) {
    if (stats.usage) {
        document.getElementById('totalUses').textContent = stats.usage;
        document.getElementById('hero-usage').textContent = stats.usage;
    }
    if (stats.views) {
        document.getElementById('totalViews').textContent = stats.views;
    }
    if (stats.shares) {
        document.getElementById('totalShares').textContent = stats.shares;
        document.getElementById('hero-shares').textContent = stats.shares;
    }
    if (stats.reactions) {
        document.getElementById('totalReactions').textContent = stats.reactions;
        document.getElementById('hero-reactions').textContent = stats.reactions;
    }
}

/**
 * Update usage display
 */
function updateUsageDisplay(count) {
    document.getElementById('totalUses').textContent = count || '0';
    document.getElementById('hero-usage').textContent = count || '0';
}

/**
 * Update share display
 */
function updateShareDisplay(count) {
    document.getElementById('totalShares').textContent = count || '0';
    document.getElementById('hero-shares').textContent = count || '0';
}

// ============================================
// TYPEWRITER EFFECT
// ============================================
function initTypewriter() {
    const phrases = [
        '🎂 Calculate your exact age',
        '💚 Get AI-powered health tips',
        '⭐ Discover your zodiac sign',
        '🎉 Explore fun age facts',
        '📊 Track your life journey'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const element = document.getElementById('typewriter-text');

    function type() {
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
            element.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            setTimeout(() => { isDeleting = true; }, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }

        const speed = isDeleting ? 50 : 100;
        setTimeout(type, speed);
    }

    type();
}

// ============================================
// MAIN CALCULATION
// ============================================
async function calculateAge() {
    showLoading(true);

    try {
        const birthDateInput = document.getElementById('birthdate').value;
        if (!birthDateInput) {
            showToast('Please enter your date of birth', 'error');
            showLoading(false);
            return;
        }

        currentBirthDate = new Date(birthDateInput);
        const birthTimeInput = document.getElementById('birthtime').value;
        if (birthTimeInput) {
            const [hours, minutes] = birthTimeInput.split(':');
            currentBirthDate.setHours(parseInt(hours), parseInt(minutes));
        }

        const now = new Date();
        const ageInMillis = now - currentBirthDate;
        currentAge = Math.floor(ageInMillis / (1000 * 60 * 60 * 24 * 365.25));

        // Update all sections
        updateAgeResults(currentAge, currentBirthDate, now);
        updateTimeUnits(ageInMillis);
        updateZodiacSigns(currentBirthDate);
        updateHealthTips(currentAge);
        updateFunFeatures(currentAge);
        updateChart(currentAge);
        startCountdown(currentBirthDate);

        document.getElementById('results-section').style.display = 'block';
        await saveToHistory(currentBirthDate, currentAge);
        await incrementUsage();

        // Scroll to results
        document.getElementById('results-section').scrollIntoView({ behavior: 'smooth', block: 'start' });

        showToast('Age calculated successfully! 🎉', 'success');
    } catch (error) {
        console.error('Calculation error:', error);
        showToast('Something went wrong. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// ============================================
// AGE RESULTS
// ============================================
function updateAgeResults(age, birthDate, now) {
    document.getElementById('age-result').textContent = age;

    const nextBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBirthday < now) nextBirthday.setFullYear(now.getFullYear() + 1);
    const daysLeft = Math.ceil((nextBirthday - now) / (1000 * 60 * 60 * 24));
    document.getElementById('next-birthday-result').textContent = daysLeft;

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    document.getElementById('birthday-day-result').textContent = days[birthDate.getDay()];

    const daysLived = Math.floor((now - birthDate) / (1000 * 60 * 60 * 24));
    document.getElementById('life-duration-result').textContent = daysLived.toLocaleString();
}

function updateTimeUnits(ageInMillis) {
    const seconds = Math.floor(ageInMillis / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30.44);

    document.getElementById('months-lived').textContent = months.toLocaleString();
    document.getElementById('weeks-lived').textContent = weeks.toLocaleString();
    document.getElementById('days-lived').textContent = days.toLocaleString();
    document.getElementById('hours-lived').textContent = hours.toLocaleString();
    document.getElementById('minutes-lived').textContent = minutes.toLocaleString();
    document.getElementById('seconds-lived').textContent = seconds.toLocaleString();
}

// ============================================
// HEALTH TIPS
// ============================================
function updateHealthTips(age) {
    let ageGroup;
    if (age <= 12) ageGroup = "0-12";
    else if (age <= 19) ageGroup = "13-19";
    else if (age <= 35) ageGroup = "20-35";
    else if (age <= 50) ageGroup = "36-50";
    else if (age <= 65) ageGroup = "51-65";
    else ageGroup = "65+";

    const tips = healthTipsDatabase[ageGroup];
    document.getElementById('health-age-badge').textContent = `${tips.title} (Age: ${age} years)`;

    let html = '';
    tips.tips.forEach(tip => {
        html += `
            <div class="health-tip-card">
                <div class="health-tip-icon">${tip.icon}</div>
                <div class="health-tip-title">${tip.title}</div>
                <div class="health-tip-desc">${tip.desc}</div>
            </div>
        `;
    });
    document.getElementById('health-tips-grid').innerHTML = html;

    // Seasonal tips
    const month = new Date().getMonth();
    let season = (month >= 2 && month <= 4) ? 'summer' : ((month >= 5 && month <= 8) ? 'rainy' : 'winter');
    let seasonHtml = '<ul>';
    seasonalTips[season].forEach(tip => { seasonHtml += `<li>${tip}</li>`; });
    seasonHtml += '</ul>';
    document.getElementById('seasonal-tips').innerHTML = seasonHtml;

    // Local food tips
    let foodHtml = '';
    localFoodTips.forEach(food => {
        foodHtml += `
            <div class="local-food-item">
                <strong>🍛 ${food.food}</strong>
                <small>${food.benefit}</small>
            </div>
        `;
    });
    document.getElementById('local-food-tips').innerHTML = foodHtml;

    // Life expectancy
    const lifeExpectancy = 73.4; // Global average
    const percentage = Math.min(100, (age / lifeExpectancy) * 100);
    document.getElementById('life-bar').style.width = `${percentage}%`;
    document.getElementById('life-expectancy-text').innerHTML = 
        `The global average life expectancy is ${lifeExpectancy} years. You have completed ${Math.round(percentage)}% of your life journey.`;

    // Extra tips
    let extraHtml = '';
    extraLifeTips[ageGroup].forEach(tip => {
        extraHtml += `<div class="extra-tip">${tip}</div>`;
    });
    document.getElementById('extra-tips').innerHTML = extraHtml;
}

// ============================================
// ZODIAC
// ============================================
function updateZodiacSigns(birthDate) {
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();

    let zodiacSign, zodiacSymbol, zodiacDates;
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) { 
        zodiacSign = "Aries"; zodiacSymbol = "♈"; zodiacDates = "Mar 21 - Apr 19"; 
    } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) { 
        zodiacSign = "Taurus"; zodiacSymbol = "♉"; zodiacDates = "Apr 20 - May 20"; 
    } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) { 
        zodiacSign = "Gemini"; zodiacSymbol = "♊"; zodiacDates = "May 21 - Jun 20"; 
    } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) { 
        zodiacSign = "Cancer"; zodiacSymbol = "♋"; zodiacDates = "Jun 21 - Jul 22"; 
    } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) { 
        zodiacSign = "Leo"; zodiacSymbol = "♌"; zodiacDates = "Jul 23 - Aug 22"; 
    } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) { 
        zodiacSign = "Virgo"; zodiacSymbol = "♍"; zodiacDates = "Aug 23 - Sep 22"; 
    } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) { 
        zodiacSign = "Libra"; zodiacSymbol = "♎"; zodiacDates = "Sep 23 - Oct 22"; 
    } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) { 
        zodiacSign = "Scorpio"; zodiacSymbol = "♏"; zodiacDates = "Oct 23 - Nov 21"; 
    } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) { 
        zodiacSign = "Sagittarius"; zodiacSymbol = "♐"; zodiacDates = "Nov 22 - Dec 21"; 
    } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) { 
        zodiacSign = "Capricorn"; zodiacSymbol = "♑"; zodiacDates = "Dec 22 - Jan 19"; 
    } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) { 
        zodiacSign = "Aquarius"; zodiacSymbol = "♒"; zodiacDates = "Jan 20 - Feb 18"; 
    } else { 
        zodiacSign = "Pisces"; zodiacSymbol = "♓"; zodiacDates = "Feb 19 - Mar 20"; 
    }

    document.getElementById('zodiac-icon').textContent = zodiacSymbol;
    document.getElementById('zodiac-name').textContent = zodiacSign;
    document.getElementById('zodiac-dates').textContent = zodiacDates;
    document.getElementById('zodiac-traits').textContent = zodiacTraits[zodiacSign] || '';

    // Chinese Zodiac
    const chineseZodiacs = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
    const chineseEmojis = ['🐀', '🐂', '🐅', '🐇', '🐉', '🐍', '🐎', '🐐', '🐒', '🐔', '🐕', '🐖'];
    const chineseIndex = (birthDate.getFullYear() - 4) % 12;
    const chineseName = chineseZodiacs[chineseIndex < 0 ? chineseIndex + 12 : chineseIndex];
    const chineseEmoji = chineseEmojis[chineseIndex < 0 ? chineseIndex + 12 : chineseIndex];
    
    document.getElementById('chinese-zodiac-icon').textContent = chineseEmoji;
    document.getElementById('chinese-zodiac-name').textContent = chineseName;
    document.getElementById('chinese-zodiac-years').textContent = `Year of the ${chineseName}`;
    document.getElementById('chinese-zodiac-traits').textContent = chineseTraits[chineseName] || '';

    // Lunar
    document.getElementById('lunar-year').textContent = `${birthDate.getFullYear()} (${chineseName})`;
    document.getElementById('lunar-month').textContent = `${month}th Month`;
    document.getElementById('lunar-day').textContent = `${day}th Day`;

    const hijriYear = Math.floor((birthDate.getFullYear() - 622) * 0.97);
    const hijriMonths = ['Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban', 'Ramadan', 'Shawwal', 'Dhu al-Qadah', 'Dhu al-Hijjah'];
    document.getElementById('hijri-date').textContent = `${day} ${hijriMonths[month-1]} ${hijriYear} AH`;

    const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    document.getElementById('zodiac-element').textContent = elements[Math.floor((birthDate.getFullYear() % 10) / 2)];
}

// ============================================
// FUN FEATURES
// ============================================
function updateFunFeatures(age) {
    // Battery
    let battery = Math.max(0, Math.min(100, 100 - age));
    document.getElementById('battery-level').style.width = `${battery}%`;
    document.getElementById('battery-percent').textContent = `${battery}%`;
    document.getElementById('battery-message').textContent = battery > 50 ? "⚡ Battery is good!" : "🔋 Battery is low, charge up!";

    // Dog/Cat Years
    let dogYears = age <= 2 ? age * 15 : 24 + (age - 2) * 5;
    let catYears = age <= 2 ? age * 15 : 24 + (age - 2) * 4;
    document.getElementById('dog-years').textContent = Math.round(dogYears);
    document.getElementById('cat-years').textContent = Math.round(catYears);

    // Money
    document.getElementById('money-value').textContent = `$${age}`;
    document.getElementById('money-message').textContent = age < 30 ? "Still young, much to achieve!" : "You're rich in experience!";

    // Color
    let color, colorName;
    if (age <= 10) { color = "#FEF3C7"; colorName = "Yellow - Innocence"; }
    else if (age <= 20) { color = "#F97316"; colorName = "Orange - Energy"; }
    else if (age <= 30) { color = "#10B981"; colorName = "Green - Growth"; }
    else if (age <= 40) { color = "#3B82F6"; colorName = "Blue - Calm"; }
    else if (age <= 50) { color = "#8B5CF6"; colorName = "Purple - Wisdom"; }
    else { color = "#EC4899"; colorName = "Pink - Love"; }
    document.getElementById('color-box').style.backgroundColor = color;
    document.getElementById('color-name').textContent = colorName;

    // Gaming Level
    let level, xp;
    if (age <= 10) { level = "📍 Level 1: Beginner"; xp = (age / 10) * 100; }
    else if (age <= 20) { level = "⚔️ Level 2: Explorer"; xp = ((age - 10) / 10) * 100; }
    else if (age <= 30) { level = "🛡️ Level 3: Warrior"; xp = ((age - 20) / 10) * 100; }
    else if (age <= 40) { level = "🧙 Level 4: Master"; xp = ((age - 30) / 10) * 100; }
    else if (age <= 50) { level = "👑 Level 5: Legend"; xp = ((age - 40) / 10) * 100; }
    else { level = "🌟 Level 6: Guru"; xp = Math.min(100, ((age - 50) / 50) * 100); }
    document.getElementById('level-badge').textContent = level;
    document.getElementById('xp-fill').style.width = `${xp}%`;
    document.getElementById('xp-text').textContent = `${Math.round(xp)}/100 XP`;

    // Butterfly
    let butterflyStage = age <= 10 ? "🥚 Egg" : (age <= 25 ? "🐛 Caterpillar" : (age <= 50 ? "🦋 Butterfly" : "🍂 Old Butterfly"));
    document.getElementById('butterfly-stage').innerHTML = `<strong>${butterflyStage}</strong><br>${age <= 50 ? "Most beautiful" : "Final"} stage of butterfly life`;

    // Space Mission
    let missionPercent = Math.min(100, (age / 80) * 100);
    document.getElementById('space-mission').innerHTML = `<strong>${Math.round(missionPercent)}% Mission Complete</strong><br>${100 - Math.round(missionPercent)}% journey remaining`;

    // Pizza
    let slices = Math.min(8, Math.ceil(age / 12.5));
    document.getElementById('pizza-slices').innerHTML = `<strong>${slices} / 8 Slices</strong><br>${slices} slices eaten, ${8 - slices} remaining`;

    // Movie
    let movieAct = age <= 20 ? "🎬 Act 1 - Introduction" : (age <= 40 ? "🎭 Act 2 - Climax" : (age <= 60 ? "📽️ Act 3 - Resolution" : "🏆 Act 4 - Awards"));
    document.getElementById('movie-act').innerHTML = `<strong>${movieAct}</strong><br>Most exciting part of your life's movie`;

    // Tree
    let treeStage = age <= 20 ? "🌱 Sapling" : (age <= 40 ? "🌿 Young Tree" : (age <= 60 ? "🌳 Fruitful Tree" : "🍂 Old Tree"));
    document.getElementById('tree-stage').innerHTML = `<strong>${treeStage}</strong><br>Keep growing like a tree!`;
}

// ============================================
// CHART & COUNTDOWN
// ============================================
function updateChart(age) {
    const ctx = document.getElementById('ageChart').getContext('2d');
    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Childhood (0-14)', 'Youth (15-29)', 'Middle (30-44)', 'Senior (45-59)', 'Elderly (60+)'],
            datasets: [{
                label: 'Population Distribution (%)',
                data: [25, 28, 22, 15, 10],
                backgroundColor: 'rgba(0, 210, 255, 0.6)',
                borderColor: 'rgba(0, 210, 255, 1)',
                borderWidth: 2,
                borderRadius: 8
            }, {
                label: 'Your Age',
                data: [
                    age <= 14 ? age : 0,
                    age >= 15 && age <= 29 ? age : 0,
                    age >= 30 && age <= 44 ? age : 0,
                    age >= 45 && age <= 59 ? age : 0,
                    age >= 60 ? age : 0
                ],
                backgroundColor: 'rgba(239, 68, 68, 0.6)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#a0b4c8',
                        font: { size: 12 }
                    }
                }
            },
            scales: {
                y: {
                    ticks: { color: '#6b7f93' },
                    grid: { color: 'rgba(42, 58, 80, 0.3)' }
                },
                x: {
                    ticks: { color: '#6b7f93' },
                    grid: { color: 'rgba(42, 58, 80, 0.3)' }
                }
            }
        }
    });
}

function startCountdown(birthDate) {
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        const now = new Date();
        const next = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        if (next < now) next.setFullYear(now.getFullYear() + 1);
        const diff = next - now;
        const days = Math.floor(diff / (1000*60*60*24));
        const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
        const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
        const seconds = Math.floor((diff % (1000*60)) / 1000);
        document.getElementById('countdownTimer').innerHTML = 
            `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
}

// ============================================
// REACTIONS
// ============================================
function loadReactions() {
    const reactions = ['like', 'love', 'wow', 'sad', 'angry', 'laugh', 'celebrate'];
    let total = 0;
    reactions.forEach(r => {
        const count = parseInt(localStorage.getItem(`reaction_${r}`) || '0');
        document.getElementById(`${r}Count`).textContent = count;
        total += count;
    });
    localStorage.setItem('totalReactions', total);
    document.getElementById('totalReactions').textContent = total;
    document.getElementById('hero-reactions').textContent = total;
}

async function handleReaction(reactionType) {
    // Update UI immediately
    let count = parseInt(localStorage.getItem(`reaction_${reactionType}`) || '0') + 1;
    localStorage.setItem(`reaction_${reactionType}`, count);
    document.getElementById(`${reactionType}Count`).textContent = count;

    // Update total
    let total = parseInt(localStorage.getItem('totalReactions') || '0') + 1;
    localStorage.setItem('totalReactions', total);
    document.getElementById('totalReactions').textContent = total;
    document.getElementById('hero-reactions').textContent = total;

    // Add active class for animation
    const btn = document.querySelector(`.reaction[data-r="${reactionType}"]`);
    btn.classList.add(`active-${reactionType}`);
    setTimeout(() => btn.classList.remove(`active-${reactionType}`), 500);

    // Send to API
    await recordReaction(reactionType);

    showToast(`Thanks for your reaction! 🎉`, 'success');
}

// ============================================
// SHARE
// ============================================
async function handleShare(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Age Calculator Pro - Calculate your exact age, health tips & more!');
    let shareUrl;

    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${title}%20${url}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=${title}&body=Check out this amazing Age Calculator: ${url}`;
            break;
        default:
            return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=500');

    // Record share
    await recordShare(platform);

    // Update share count
    let count = parseInt(localStorage.getItem('shareCount') || '0') + 1;
    localStorage.setItem('shareCount', count);
    document.getElementById('totalShares').textContent = count;
    document.getElementById('hero-shares').textContent = count;

    showToast(`Shared on ${platform.charAt(0).toUpperCase() + platform.slice(1)}! 📤`, 'success');
}

function copyPageURL() {
    const url = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
            showToast('Link copied to clipboard! 📋', 'success');
        }).catch(() => {
            fallbackCopy(url);
        });
    } else {
        fallbackCopy(url);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        showToast('Link copied to clipboard! 📋', 'success');
    } catch (e) {
        showToast('Failed to copy link', 'error');
    }
    document.body.removeChild(textarea);
}

// ============================================
// HISTORY
// ============================================
async function saveToHistory(birthDate, age) {
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    history.unshift({ 
        date: birthDate.toISOString().split('T')[0], 
        age: age, 
        timestamp: new Date().toISOString() 
    });
    if (history.length > 50) history.pop();
    localStorage.setItem('searchHistory', JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const searchTerm = document.getElementById('searchHistory').value.toLowerCase();
    let filtered = searchTerm ? 
        history.filter(item => item.date.includes(searchTerm) || item.age.toString().includes(searchTerm)) : 
        history;

    const container = document.getElementById('historyList');
    if (filtered.length === 0) {
        container.innerHTML = '<div class="historyItem">No history found</div>';
        return;
    }

    let html = '';
    filtered.slice(0, 30).forEach(item => {
        html += `
            <div class="historyItem" onclick="recalculateFromHistory('${item.date}')">
                <span class="h-date">📅 ${item.date}</span>
                <span class="h-age">🎂 ${item.age} years</span>
            </div>
        `;
    });
    container.innerHTML = html;
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all history?')) {
        localStorage.removeItem('searchHistory');
        loadHistory();
        showToast('History cleared! 🗑️', 'success');
    }
}

function exportToCSV() {
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    if (history.length === 0) {
        showToast('No history to export', 'error');
        return;
    }

    let csv = 'Date,Age,Timestamp\n';
    history.forEach(item => {
        csv += `${item.date},${item.age},${item.timestamp}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `age-calculator-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('History exported as CSV! 📥', 'success');
}

// ============================================
// SAVED DATA
// ============================================
function loadSavedData() {
    const savedDate = localStorage.getItem('savedBirthDate');
    if (savedDate) document.getElementById('birthdate').value = savedDate;
    
    document.getElementById('birthdate').addEventListener('change', (e) => {
        localStorage.setItem('savedBirthDate', e.target.value);
    });
    
    document.getElementById('birthtime').addEventListener('change', (e) => {
        localStorage.setItem('savedBirthTime', e.target.value);
    });
}

// ============================================
// UI HELPERS
// ============================================
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
}

function setupScrollButtons() {
    const scrollUp = document.getElementById('scrollUp');
    const scrollDown = document.getElementById('scrollDown');

    window.addEventListener('scroll', () => {
        scrollUp.style.display = window.scrollY > 200 ? 'flex' : 'none';
    });

    scrollUp.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    scrollDown.addEventListener('click', () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
}

function showLoading(show) {
    document.getElementById('loadingSpinner').style.display = show ? 'flex' : 'none';
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Recalculate from history
window.recalculateFromHistory = function(date) {
    document.getElementById('birthdate').value = date;
    calculateAge();
};

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    document.getElementById('calculateBtn').addEventListener('click', calculateAge);
    
    document.querySelectorAll('.reaction').forEach(btn => {
        btn.addEventListener('click', () => handleReaction(btn.dataset.r));
    });
    
    document.querySelectorAll('.shareBtn[data-platform]').forEach(btn => {
        btn.addEventListener('click', () => handleShare(btn.dataset.platform));
    });
    
    document.getElementById('copyUrl').addEventListener('click', copyPageURL);
    document.getElementById('clearHistory').addEventListener('click', clearHistory);
    document.getElementById('exportCSV').addEventListener('click', exportToCSV);
    document.getElementById('searchHistory').addEventListener('input', loadHistory);
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Enter key to calculate
    document.getElementById('birthdate').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') calculateAge();
    });
    document.getElementById('birthtime').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') calculateAge();
    });
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Setup
    setupEventListeners();
    setupScrollButtons();
    loadSavedData();
    
    // Load data
    loadHistory();
    loadReactions();
    loadStats();
    initTypewriter();
    
    // Auto-calculate if date is saved
    const savedDate = localStorage.getItem('savedBirthDate');
    if (savedDate) {
        setTimeout(calculateAge, 500);
    }

    console.log('✅ Age Calculator Pro loaded successfully!');
    console.log(`📊 Tool: ${CONFIG.TOOL_NAME}`);
    console.log(`🔗 API: ${CONFIG.API_BASE}`);
});
