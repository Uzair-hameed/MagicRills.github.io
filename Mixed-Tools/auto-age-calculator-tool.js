// ============================================
// ADVANCED AGE CALCULATOR - COMPLETE VERSION
// Original Data + Fun Features (Separate Tab)
// ============================================

let currentAge = null;
let currentBirthDate = null;
let chartInstance = null;
let countdownInterval = null;

// Health Tips Database (100% AUTHENTIC - WHO/CDC Based)
const healthTipsDatabase = {
    "0-12": {
        title: "🌟 بچپن (0-12 سال)",
        tips: [
            { icon: "🥛", title: "کیلشیم کی مقدار", desc: "روزانہ 2 گلاس دودھ یا دہی - ہڈیاں مضبوط بنانے کے لیے" },
            { icon: "💉", title: "ویکسینیشن", desc: "مکمل ویکسینیشن کروائیں - بیماریوں سے بچاؤ کے لیے ضروری" },
            { icon: "😴", title: "نیند کا معمول", desc: "کم از کم 9-12 گھنٹے نیند - دماغی نشونما کے لیے" },
            { icon: "🏃", title: "جسمانی سرگرمی", desc: "دن میں 1 گھنٹہ باہر کھیلنا - آنکھوں اور جسم کے لیے بہترین" }
        ]
    },
    "13-19": {
        title: "🎓 نو عمر (13-19 سال)",
        tips: [
            { icon: "🥚", title: "پروٹین والی غذا", desc: "انڈے، دال، گوشت، مچھلی - جسمانی نشونما کے لیے" },
            { icon: "📱", title: "اسکرین ٹائم", desc: "موبائل سے آنکھوں کی حفاظت کریں - ہر 20 منٹ بعد بریک لیں" },
            { icon: "🧘", title: "دماغی صحت", desc: "روزانہ 30 منٹ ورزش - تناؤ کم کرنے کے لیے" },
            { icon: "🦷", title: "دانتوں کی حفاظت", desc: "کیلشیم لیں - مضبوط دانتوں کے لیے" }
        ]
    },
    "20-35": {
        title: "💪 نوجوانی (20-35 سال)",
        tips: [
            { icon: "🥬", title: "فولک ایسڈ", desc: "سبز سبزیاں اور پھل کھائیں - خواتین کے لیے خاص طور پر" },
            { icon: "☀️", title: "وٹامن ڈی", desc: "صبح 15 منٹ دھوپ لیں - ہڈیاں مضبوط کرنے کے لیے" },
            { icon: "💧", title: "پانی پینا", desc: "8-10 گلاس پانی روزانہ - جسم ہائیڈریٹ رکھیں" },
            { icon: "❤️", title: "میڈیکل چیک اپ", desc: "سالانہ چیک اپ کروائیں - شادی سے پہلے ضروری" }
        ]
    },
    "36-50": {
        title: "🧘 متوسط عمر (36-50 سال)",
        tips: [
            { icon: "🩸", title: "بلڈ پریشر", desc: "ماہانہ بلڈ پریشر اور شوگر چیک کریں" },
            { icon: "🚶", title: "واک", desc: "روزانہ 10,000 قدم چہل قدمی - دل کی صحت کے لیے" },
            { icon: "🥗", title: "کم چکنائی", desc: "زیتون کا تیل استعمال کریں - کولیسٹرول کم کریں" },
            { icon: "😌", title: "مراقبہ", desc: "نماز اور مراقبہ کریں - ذہنی سکون کے لیے" }
        ]
    },
    "51-65": {
        title: "👴 بزرگ (51-65 سال)",
        tips: [
            { icon: "🐟", title: "دل کی صحت", desc: "مچھلی اور اخروٹ کھائیں - اومیگا 3 کے لیے" },
            { icon: "🦴", title: "جوڑوں کا خیال", desc: "کیلشیم اور وٹامن ڈی لیں - ہڈیاں مضبوط رکھیں" },
            { icon: "📖", title: "دماغی ورزش", desc: "روزانہ مطالعہ کریں - یادداشت تیز رکھیں" },
            { icon: "🍲", title: "ہلکی غذا", desc: "زود ہضم کھانا کھائیں - ہلکی پکی دالیں" }
        ]
    },
    "65+": {
        title: "👵 معمر (65+ سال)",
        tips: [
            { icon: "🚶", title: "روزانہ واک", desc: "صبح و شام 20 منٹ واک - جسمانی سرگرمی برقرار رکھیں" },
            { icon: "💊", title: "دوائیں", desc: "ڈاکٹر کے مشورے سے دوائیں لیں" },
            { icon: "🧩", title: "دماغی چیلنج", desc: "پہیلیاں اور کراس ورڈ حل کریں - دماغ تیز رکھیں" },
            { icon: "🍵", title: "ہربل چائے", desc: "گرم پانی اور ہربل چائے پییں - ہاضمہ بہتر رکھیں" }
        ]
    }
};

// Extra Life Tips (Age-based)
const extraLifeTips = {
    "0-12": ["🍎 روزانہ ایک سیب - ڈاکٹر سے دور", "📚 دن میں 1 گھنٹہ مطالعہ", "🎨 رنگ بھرنے سے دماغ تیز ہوتا ہے"],
    "13-19": ["📵 سونے سے 1 گھنٹہ پہلے موبائل بند کریں", "🏃 ہفتے میں 3 بار ورزش کریں", "🥗 جنک فوڈ سے پرہیز کریں"],
    "20-35": ["💼 کام کے دوران بیچ میں اٹھ کر چلیں", "🥑 ناشتے میں پھل شامل کریں", "📝 8 گھنٹے کی نیند ضروری ہے"],
    "36-50": ["🩸 ہر 6 ماہ بعد بلڈ ٹیسٹ کروائیں", "🚭 سگریٹ اور تمباکو سے پرہیز", "🧘 روزانہ 10 منٹ مراقبہ"],
    "51-65": ["🦴 کیلشیم سپلیمنٹ ڈاکٹر کے مشورے سے", "👓 آنکھوں کا سالانہ چیک اپ", "🚶 سیڑھیاں استعمال کریں"],
    "65+": ["👨‍⚕️ ڈاکٹر سے باقاعدہ رابطہ رکھیں", "💊 وقت پر دوائیں لیں", "👪 خاندان کے ساتھ وقت گزاریں"]
};

// Seasonal Tips
const seasonalTips = {
    summer: ["🥤 زیادہ پانی پیئیں - دن میں 10-12 گلاس", "🍉 تربوز اور کھیرے کھائیں", "🕛 دوپہر میں دھوپ سے بچیں"],
    winter: ["🧣 گرم کپڑے پہنیں", "🍯 شہد اور ادرک کی چائے پیئیں", "☀️ صبح کی دھوپ میں بیٹھیں"],
    rainy: ["🌧️ بارش کے پانی سے بچیں", "🍲 گرم سوپ پیئیں", "🦟 مچھروں سے بچاؤ کریں"]
};

// Local Foods
const localFoodTips = [
    { food: "دال مونگ", benefit: "پروٹین اور فائبر" },
    { food: "لسی", benefit: "پروبائیوٹکس - آنتوں کی صحت" },
    { food: "ساگ", benefit: "آئرن - خون کی کمی دور کرے" },
    { food: "گوبھی", benefit: "وٹامن سی - قوت مدافعت" }
];

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    setupScrollButtons();
    loadSavedData();
    loadHistory();
    loadReactions();
    loadUsageCount();
});

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
    document.getElementById('searchHistory').addEventListener('input', () => loadHistory());
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
}

// ============================================
// MAIN CALCULATION
// ============================================
async function calculateAge() {
    showLoading(true);
    
    try {
        const birthDateInput = document.getElementById('birthdate').value;
        if (!birthDateInput) {
            showToast('تاریخ پیدائش درج کریں', 'error');
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
        await updateUsageCount();
        
        showToast('عمر کا حساب مکمل ہو گیا!', 'success');
    } catch (error) {
        showToast('کچھ غلط ہو گیا', 'error');
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
    
    const days = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];
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
// HEALTH TIPS (ORIGINAL DATA)
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
    document.getElementById('health-age-badge').textContent = `${tips.title} (عمر: ${age} سال)`;
    
    let html = '';
    tips.tips.forEach(tip => {
        html += `<div class="health-tip-card"><div class="health-tip-icon">${tip.icon}</div><div class="health-tip-title">${tip.title}</div><div class="health-tip-desc">${tip.desc}</div></div>`;
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
    let foodHtml = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px,1fr)); gap: 10px;">';
    localFoodTips.forEach(food => {
        foodHtml += `<div style="background:#f0f0ff; padding:10px; border-radius:10px;"><strong>🍛 ${food.food}</strong><br><small>${food.benefit}</small></div>`;
    });
    foodHtml += '</div>';
    document.getElementById('local-food-tips').innerHTML = foodHtml;
    
    // Life expectancy (Pakistan: 67.3 years - World Bank)
    const lifeExpectancy = 67.3;
    const percentage = Math.min(100, (age / lifeExpectancy) * 100);
    document.getElementById('life-bar').style.width = `${percentage}%`;
    document.getElementById('life-expectancy-text').innerHTML = `پاکستان میں اوسط متوقع عمر ${lifeExpectancy} سال ہے۔ آپ نے اپنی زندگی کا ${Math.round(percentage)}% مکمل کر لیا ہے۔`;
    
    // Extra tips
    let extraHtml = '';
    extraLifeTips[ageGroup].forEach(tip => {
        extraHtml += `<div class="extra-tip">${tip}</div>`;
    });
    document.getElementById('extra-tips').innerHTML = extraHtml;
}

// ============================================
// ZODIAC (ORIGINAL DATA)
// ============================================
function updateZodiacSigns(birthDate) {
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    
    let zodiacSign, zodiacSymbol;
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) { zodiacSign = "حمل (Aries)"; zodiacSymbol = "♈"; }
    else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) { zodiacSign = "ثور (Taurus)"; zodiacSymbol = "♉"; }
    else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) { zodiacSign = "جوزا (Gemini)"; zodiacSymbol = "♊"; }
    else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) { zodiacSign = "سرطان (Cancer)"; zodiacSymbol = "♋"; }
    else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) { zodiacSign = "اسد (Leo)"; zodiacSymbol = "♌"; }
    else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) { zodiacSign = "سنبلہ (Virgo)"; zodiacSymbol = "♍"; }
    else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) { zodiacSign = "میزان (Libra)"; zodiacSymbol = "♎"; }
    else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) { zodiacSign = "عقرب (Scorpio)"; zodiacSymbol = "♏"; }
    else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) { zodiacSign = "قوس (Sagittarius)"; zodiacSymbol = "♐"; }
    else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) { zodiacSign = "جدی (Capricorn)"; zodiacSymbol = "♑"; }
    else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) { zodiacSign = "دلو (Aquarius)"; zodiacSymbol = "♒"; }
    else { zodiacSign = "حوت (Pisces)"; zodiacSymbol = "♓"; }
    
    document.getElementById('zodiac-icon').textContent = zodiacSymbol;
    document.getElementById('zodiac-name').textContent = zodiacSign;
    
    // Chinese Zodiac
    const chineseZodiacs = ['🐀 چوہا', '🐂 بیل', '🐅 شیر', '🐇 خرگوش', '🐉 ڈریگن', '🐍 سانپ', '🐎 گھوڑا', '🐐 بکری', '🐒 بندر', '🐔 مرغ', '🐕 کتا', '🐖 سور'];
    const chineseIndex = (birthDate.getFullYear() - 4) % 12;
    document.getElementById('chinese-zodiac-icon').textContent = chineseZodiacs[chineseIndex].split(' ')[0];
    document.getElementById('chinese-zodiac-name').textContent = chineseZodiacs[chineseIndex].split(' ')[1];
    
    // Lunar
    const animals = ['چوہا', 'بیل', 'شیر', 'خرگوش', 'ڈریگن', 'سانپ', 'گھوڑا', 'بکری', 'بندر', 'مرغ', 'کتا', 'سور'];
    document.getElementById('lunar-year').textContent = `${birthDate.getFullYear()} (${animals[chineseIndex]})`;
    document.getElementById('lunar-month').textContent = `${month}واں مہینہ`;
    document.getElementById('lunar-day').textContent = `${day}واں دن`;
    
    const hijriYear = Math.floor((birthDate.getFullYear() - 622) * 0.97);
    const hijriMonths = ['محرم', 'صفر', 'ربیع الاول', 'ربیع الثانی', 'جمادی الاول', 'جمادی الثانی', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدہ', 'ذو الحجہ'];
    document.getElementById('hijri-date').textContent = `${day} ${hijriMonths[month-1]} ${hijriYear} ہجری`;
    
    const elements = ['لکڑی', 'آگ', 'مٹی', 'دھات', 'پانی'];
    document.getElementById('zodiac-element').textContent = elements[Math.floor((birthDate.getFullYear() % 10) / 2)];
}

// ============================================
// FUN FEATURES (ENTERTAINMENT ONLY)
// ============================================
function updateFunFeatures(age) {
    // Battery
    let battery = Math.max(0, Math.min(100, 100 - age));
    document.getElementById('battery-level').style.width = `${battery}%`;
    document.getElementById('battery-percent').textContent = `${battery}%`;
    document.getElementById('battery-message').textContent = battery > 50 ? "⚡ بیٹری اچھی ہے!" : "🔋 بیٹری کم ہے، چارج کریں!";
    
    // Dog/Cat Years
    let dogYears = age <= 2 ? age * 15 : 24 + (age - 2) * 5;
    let catYears = age <= 2 ? age * 15 : 24 + (age - 2) * 4;
    document.getElementById('dog-years').textContent = Math.round(dogYears);
    document.getElementById('cat-years').textContent = Math.round(catYears);
    
    // Money
    document.getElementById('money-value').textContent = `$${age}`;
    document.getElementById('money-message').textContent = age < 30 ? "ابھی بہت کچھ کرنا ہے!" : "آپ تجربے میں امیر ہیں!";
    
    // Color
    let color, colorName;
    if (age <= 10) { color = "#FEF3C7"; colorName = "پیلا - معصومیت"; }
    else if (age <= 20) { color = "#F97316"; colorName = "نارنجی - توانائی"; }
    else if (age <= 30) { color = "#10B981"; colorName = "سبز - نشونما"; }
    else if (age <= 40) { color = "#3B82F6"; colorName = "نیلا - سکون"; }
    else if (age <= 50) { color = "#8B5CF6"; colorName = "جامنی - حکمت"; }
    else { color = "#EC4899"; colorName = "گلابی - محبت"; }
    document.getElementById('color-box').style.backgroundColor = color;
    document.getElementById('color-name').textContent = colorName;
    
    // Gaming Level
    let level, xp;
    if (age <= 10) { level = "📍 لیول 1: نوسکھئیے"; xp = (age / 10) * 100; }
    else if (age <= 20) { level = "⚔️ لیول 2: ایکسپلورر"; xp = ((age - 10) / 10) * 100; }
    else if (age <= 30) { level = "🛡️ لیول 3: وارئیر"; xp = ((age - 20) / 10) * 100; }
    else if (age <= 40) { level = "🧙 لیول 4: ماسٹر"; xp = ((age - 30) / 10) * 100; }
    else if (age <= 50) { level = "👑 لیول 5: لیجنڈ"; xp = ((age - 40) / 10) * 100; }
    else { level = "🌟 لیول 6: گرو"; xp = Math.min(100, ((age - 50) / 50) * 100); }
    document.getElementById('level-badge').textContent = level;
    document.getElementById('xp-fill').style.width = `${xp}%`;
    document.getElementById('xp-text').textContent = `${Math.round(xp)}/100 XP`;
    
    // Butterfly
    let butterflyStage = age <= 10 ? "🥚 انڈا" : (age <= 25 ? "🐛 کیٹرپلر" : (age <= 50 ? "🦋 تتلی" : "🍂 بوڑھی تتلی"));
    document.getElementById('butterfly-stage').innerHTML = `<strong>${butterflyStage}</strong><br>تتلی کی زندگی کا ${age <= 50 ? "سب سے خوبصورت" : "آخری"} مرحلہ`;
    
    // Space Mission
    let missionPercent = Math.min(100, (age / 80) * 100);
    document.getElementById('space-mission').innerHTML = `<strong>${Math.round(missionPercent)}% مشن مکمل</strong><br>خلائی جہاز ابھی ${100 - Math.round(missionPercent)}% راستہ باقی ہے`;
    
    // Pizza
    let slices = Math.min(8, Math.ceil(age / 12.5));
    document.getElementById('pizza-slices').innerHTML = `<strong>${slices} / 8 سلائس</strong><br>پیزا کے ${slices} ٹکڑے کھا لیے، ${8 - slices} باقی ہیں`;
    
    // Movie
    let movieAct = age <= 20 ? "🎬 پہلا ایکٹ - تعارف" : (age <= 40 ? "🎭 دوسرا ایکٹ - کلیمیکس" : (age <= 60 ? "📽️ تیسرا ایکٹ - حل" : "🏆 چوتھا ایکٹ - ایوارڈز"));
    document.getElementById('movie-act').innerHTML = `<strong>${movieAct}</strong><br>آپ کی زندگی کی فلم کا سب سے دلچسپ حصہ`;
    
    // Tree
    let treeStage = age <= 20 ? "🌱 پودا" : (age <= 40 ? "🌿 جوان درخت" : (age <= 60 ? "🌳 پھل دار درخت" : "🍂 بوڑھا درخت"));
    document.getElementById('tree-stage').innerHTML = `<strong>${treeStage}</strong><br>درخت کی طرح پھیلتے رہیں!`;
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
            labels: ['بچپن (0-14)', 'جوانی (15-29)', 'ادھیڑ (30-44)', 'بزرگ (45-59)', 'معمر (60+)'],
            datasets: [{
                label: 'پاکستان میں آبادی (%)',
                data: [35, 30, 20, 10, 5],
                backgroundColor: 'rgba(102, 126, 234, 0.6)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 1
            }, {
                label: 'آپ کی عمر',
                data: [age <= 14 ? age : 0, age >= 15 && age <= 29 ? age : 0, age >= 30 && age <= 44 ? age : 0, age >= 45 && age <= 59 ? age : 0, age >= 60 ? age : 0],
                backgroundColor: 'rgba(239, 68, 68, 0.6)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 1
            }]
        },
        options: { responsive: true, maintainAspectRatio: true }
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
        document.getElementById('countdownTimer').innerHTML = `${days} دن ${hours} گھنٹے ${minutes} منٹ ${seconds} سیکنڈ`;
    }, 1000);
}

// ============================================
// DATABASE FUNCTIONS
// ============================================
async function loadUsageCount() {
    let localCount = localStorage.getItem('usageCount') || 0;
    document.getElementById('totalUses').textContent = localCount;
}

async function updateUsageCount() {
    let count = parseInt(localStorage.getItem('usageCount') || '0') + 1;
    localStorage.setItem('usageCount', count);
    document.getElementById('totalUses').textContent = count;
}

function loadReactions() {
    const reactions = ['like', 'love', 'wow', 'sad', 'angry', 'laugh', 'celebrate'];
    reactions.forEach(r => {
        document.getElementById(`${r}Count`).textContent = localStorage.getItem(`reaction_${r}`) || 0;
    });
}

function handleReaction(reactionType) {
    let count = parseInt(localStorage.getItem(`reaction_${reactionType}`) || '0') + 1;
    localStorage.setItem(`reaction_${reactionType}`, count);
    document.getElementById(`${reactionType}Count`).textContent = count;
    showToast('شکریہ! آپ کا ری ایکشن محفوظ ہو گیا', 'success');
}

function handleShare(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('عمر کیلکولیٹر - اپنی صحیح عمر اور صحت کے مشورے جانیں');
    let shareUrl;
    switch(platform) {
        case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
        case 'twitter': shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`; break;
        case 'whatsapp': shareUrl = `https://wa.me/?text=${title}%20${url}`; break;
        case 'email': shareUrl = `mailto:?subject=${title}&body=${url}`; break;
        default: return;
    }
    window.open(shareUrl, '_blank', 'width=600,height=400');
    showToast(`${platform} پر شیئر کر دیا گیا`, 'success');
}

function copyPageURL() {
    navigator.clipboard.writeText(window.location.href);
    showToast('لنک کاپی کر دیا گیا! 📋', 'success');
}

function saveToHistory(birthDate, age) {
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    history.unshift({ date: birthDate.toISOString().split('T')[0], age: age, timestamp: new Date().toISOString() });
    if (history.length > 20) history.pop();
    localStorage.setItem('searchHistory', JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const searchTerm = document.getElementById('searchHistory').value.toLowerCase();
    let filtered = searchTerm ? history.filter(item => item.date.includes(searchTerm) || item.age.toString().includes(searchTerm)) : history;
    const container = document.getElementById('historyList');
    if (filtered.length === 0) { container.innerHTML = '<div class="historyItem">کوئی تاریخچہ نہیں</div>'; return; }
    let html = '';
    filtered.slice(0, 20).forEach(item => {
        html += `<div class="historyItem" onclick="recalculateFromHistory('${item.date}')"><span>📅 ${item.date}</span><span>🎂 ${item.age} سال</span></div>`;
    });
    container.innerHTML = html;
}

function clearHistory() {
    if (confirm('کیا آپ واقعی تاریخچہ صاف کرنا چاہتے ہیں؟')) {
        localStorage.removeItem('searchHistory');
        loadHistory();
        showToast('تاریخچہ صاف کر دیا گیا', 'success');
    }
}

function exportToCSV() {
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    if (history.length === 0) { showToast('کوئی تاریخچہ نہیں', 'error'); return; }
    let csv = 'Date,Age,Timestamp\n';
    history.forEach(item => { csv += `${item.date},${item.age},${item.timestamp}\n`; });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `age-calculator-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('تاریخچہ CSV میں ڈاؤن لوڈ ہو گیا', 'success');
}

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
// UI HELPER FUNCTIONS
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
    window.addEventListener('scroll', () => { scrollUp.style.display = window.scrollY > 200 ? 'flex' : 'none'; });
    scrollUp.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    scrollDown.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
}

function showLoading(show) { document.getElementById('loadingSpinner').style.display = show ? 'flex' : 'none'; }
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.getElementById('toastContainer').appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

window.recalculateFromHistory = function(date) {
    document.getElementById('birthdate').value = date;
    calculateAge();
};

console.log('✅ Age Calculator Loaded - Original Data + Fun Features Tab!');
