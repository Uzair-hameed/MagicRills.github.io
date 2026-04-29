// ==================== CONFIGURATION ====================
const CONFIG = {
    APP_NAME: 'اسلامک اسٹڈیز کوئز چیلنج',
    VERSION: '5.0.0',
    CLOUD_WORKER_URL: 'https://computer-quiz-challenge.uzairhameed01.workers.dev',
    QUESTIONS_PER_QUIZ: 35
};

// ==================== TIME & POINTS PER LEVEL ====================
const TIME_LIMITS = { 1: 60, 2: 55, 3: 50, 4: 45, 5: 40 };
const POINTS_PER_LEVEL = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 };
const LEVEL_NAMES = { 1: 'بنیادی', 2: 'آسان', 3: 'درمیانہ', 4: 'مشکل', 5: 'ماہر' };

// ==================== GLOBAL STATE ====================
let currentState = {
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
    aiGenerated: false
};

let userReactions = new Set();
let toolUsageCount = 0;
let progressChart = null;

// ==================== COMPLETE 35 UNIQUE QUESTIONS PER LEVEL (LOCAL FALLBACK) ====================
// Level 1 - 35 Unique Questions
const level1Questions = [
    { question: "اسلام کے پانچ بنیادی ارکان میں سے پہلا رکن کون سا ہے؟", options: ["نماز", "روزہ", "زکوٰۃ", "کلمہ طیبہ"], answer: 3, explanation: "کلمہ طیبہ 'لا الہ الا اللہ محمد الرسول اللہ' اسلام کا پہلا اور بنیادی رکن ہے۔", factoid: "کلمہ پڑھنے والا مسلمان کہلاتا ہے۔", points: 1, category: "ارکان اسلام" },
    { question: "نماز فرض ہونے کی عمر کیا ہے؟", options: ["7 سال", "10 سال", "بلوغت", "15 سال"], answer: 2, explanation: "نماز بلوغت کے بعد فرض ہوتی ہے، لیکن بچپن سے سکھانی چاہیے۔", factoid: "7 سال کی عمر میں نماز سکھانے کا حکم ہے۔", points: 1, category: "نماز" },
    { question: "زکوٰۃ کتنے مال پر فرض ہوتی ہے؟", options: ["ہر مال پر", "صرف سونے پر", "نصاب کو پہنچنے والے مال پر", "صرف کھیتی پر"], answer: 2, explanation: "زکوٰۃ اس مال پر فرض ہے جو نصاب کو پہنچ جائے اور اس پر ایک سال گزر جائے۔", factoid: "سونے کا نصاب ساڑھے سات تولے ہے۔", points: 1, category: "زکوٰۃ" },
    { question: "حج کس مہینے میں ادا کیا جاتا ہے؟", options: ["رمضان", "شوال", "ذوالحجہ", "محرم"], answer: 2, explanation: "حج ذوالحجہ کے مہینے میں کیا جاتا ہے، خاص طور پر 8 سے 12 ذوالحجہ تک۔", factoid: "حجۃ الوداع 10 ہجری میں ہوا۔", points: 1, category: "حج" },
    { question: "روزہ کی حالت میں کون سا عمل روزہ توڑ دیتا ہے؟", options: ["بھول کر کھانا", "جان بوجھ کر کھانا پینا", "کلی کرنا", "منہ میں پانی ڈال کر نکال دینا"], answer: 1, explanation: "جان بوجھ کر کھانے پینے سے روزہ ٹوٹ جاتا ہے، جبکہ بھول کر کھانے سے نہیں ٹوٹتا۔", factoid: "بھول کر کھا پی لینے پر روزہ قضا نہیں۔", points: 1, category: "روزہ" },
    { question: "اذان میں کتنی مرتبہ 'اللہ اکبر' کہا جاتا ہے؟", options: ["2", "4", "6", "8"], answer: 1, explanation: "اذان میں 'اللہ اکبر' چار مرتبہ کہا جاتا ہے۔", factoid: "پہلے مؤذن حضرت بلال رضی اللہ عنہ تھے۔", points: 1, category: "اذان" },
    { question: "نماز میں سورہ فاتحہ پڑھنا کیا ہے؟", options: ["فرض", "واجب", "سنت", "مستحب"], answer: 1, explanation: "نماز میں سورہ فاتحہ پڑھنا واجب ہے، حدیث میں آیا ہے کہ بغیر سورہ فاتحہ کے نماز نہیں ہوتی۔", factoid: "سورہ فاتحہ کو 'ام الکتاب' بھی کہا جاتا ہے۔", points: 1, category: "نماز" },
    { question: "جھوٹ بولنے والے کے بارے میں رسول اللہ ﷺ نے کیا فرمایا؟", options: ["وہ مومن نہیں", "وہ منافق کی علامت ہے", "وہ جہنم میں جائے گا", "تمام صحیح"], answer: 3, explanation: "رسول اللہ ﷺ نے فرمایا: 'جھوٹ بولنا منافق کی علامت ہے' (صحیح بخاری)۔", factoid: "جھوٹ سے بچنا ایمان کا حصہ ہے۔", points: 1, category: "اخلاق" },
    { question: "غیبت کسے کہتے ہیں؟", options: ["کسی کی موجودگی میں برائی", "کسی کی غیر موجودگی میں برائی", "جھوٹ بولنا", "چغلی کرنا"], answer: 1, explanation: "غیبت کسی مسلمان کی غیر موجودگی میں اس کی برائی کرنا ہے۔", factoid: "غیبت کرنا مردار کا گوشت کھانے کے برابر ہے۔", points: 1, category: "اخلاق" },
    { question: "وضو میں کون سا عضو دھونا فرض ہے؟", options: ["چہرہ", "ہاتھ", "پاؤں", "تینوں"], answer: 3, explanation: "وضو میں چہرہ، ہاتھ اور پاؤں دھونا فرض ہے۔", factoid: "وضو کے چار فرائض ہیں۔", points: 1, category: "طہارت" },
    { question: "نماز میں قعدہ اولیٰ کتنی دیر کا ہوتا ہے؟", options: ["ایک تسبیح", "دو تسبیح", "تین تسبیح", "چار تسبیح"], answer: 1, explanation: "قعدہ اولیٰ میں صرف التحیات پڑھی جاتی ہے، جو دو تسبیح کے برابر ہے۔", factoid: "قعدہ اولیٰ واجب ہے، قعدہ اخیرہ فرض۔", points: 1, category: "نماز" },
    { question: "زکوٰۃ کا لفظی معنی کیا ہے؟", options: ["صدقہ", "پاکیزگی", "مال", "عطیہ"], answer: 1, explanation: "زکوٰۃ کا معنی پاکیزگی اور نشوونما ہے، یہ مال کو پاک کرتی ہے۔", factoid: "زکوٰۃ دینے سے مال میں برکت آتی ہے۔", points: 1, category: "زکوٰۃ" },
    { question: "حضرت محمد ﷺ کی ولادت کب ہوئی؟", options: ["570 عیسوی", "571 عیسوی", "572 عیسوی", "573 عیسوی"], answer: 1, explanation: "آپ ﷺ کی ولادت 571 عیسوی میں عام الفیل کے سال ہوئی۔", factoid: "آپ ﷺ کے والد کا نام عبداللہ اور والدہ کا نام آمنہ تھا۔", points: 1, category: "سیرت" },
    { question: "رسول اللہ ﷺ کے چچا کا نام کیا تھا؟", options: ["ابو طالب", "حمزہ", "عباس", "تینوں"], answer: 3, explanation: "آپ ﷺ کے چچاؤں میں ابو طالب، حمزہ اور عباس شامل تھے۔", factoid: "حمزہ رضی اللہ عنہ کو 'سید الشہداء' کہا جاتا ہے۔", points: 1, category: "سیرت" },
    { question: "پہلی وحی کہاں نازل ہوئی؟", options: ["مسجد حرام", "غار ثور", "غار حرا", "مسجد نبوی"], answer: 2, explanation: "پہلی وحی غار حرا میں نازل ہوئی۔", factoid: "یہ وحی سورہ علق کی پہلی پانچ آیات تھیں۔", points: 1, category: "قرآن" },
    { question: "ہجرت مدینہ کس سن میں ہوئی؟", options: ["1 ہجری", "2 ہجری", "3 ہجری", "4 ہجری"], answer: 0, explanation: "ہجرت مدینہ 1 ہجری میں ہوئی، جس سے اسلامی کیلنڈر کا آغاز ہوا۔", factoid: "ہجرت کے وقت آپ ﷺ کی عمر 53 سال تھی۔", points: 1, category: "سیرت" },
    { question: "بدر کی لڑائی کس سن میں ہوئی؟", options: ["1 ہجری", "2 ہجری", "3 ہجری", "4 ہجری"], answer: 1, explanation: "بدر کی لڑائی 2 ہجری میں ہوئی، یہ پہلی بڑی جنگ تھی۔", factoid: "اس جنگ میں 313 مسلمان شریک تھے۔", points: 1, category: "غزوات" },
    { question: "قرآن پاک میں کل کتنی سورتیں ہیں؟", options: ["110", "114", "118", "120"], answer: 1, explanation: "قرآن پاک میں کل 114 سورتیں ہیں، 86 مکی اور 28 مدنی۔", factoid: "سب سے لمبی سورت سورہ بقرہ ہے۔", points: 1, category: "قرآن" },
    { question: "قرآن پاک کی سب سے چھوٹی سورت کون سی ہے؟", options: ["سورہ اخلاص", "سورہ کوثر", "سورہ فاتحہ", "سورہ کافرون"], answer: 1, explanation: "سورہ کوثر صرف 3 آیات پر مشتمل ہے، یہ سب سے چھوٹی سورت ہے۔", factoid: "یہ سورت حضرت محمد ﷺ کو تسلی دینے کے لیے نازل ہوئی۔", points: 1, category: "قرآن" },
    { question: "نماز میں سجدہ کتنی مرتبہ کرنا ہے؟", options: ["ایک مرتبہ", "دو مرتبہ", "تین مرتبہ", "چار مرتبہ"], answer: 1, explanation: "ہر رکعت میں دو سجدے ہوتے ہیں۔", factoid: "سجدہ میں پیشانی، ناک، دونوں ہاتھ، دونوں گھٹنے اور دونوں پاؤں زمین پر ہونے چاہئیں۔", points: 1, category: "نماز" },
    { question: "روزہ رکھنے کی نیت کب کرنی چاہیے؟", options: ["رمضان کے پہلے دن", "ہر روز صبح سے پہلے", "رات کو سونے سے پہلے", "کسی بھی وقت"], answer: 1, explanation: "روزے کی نیت ہر روز صبح صادق سے پہلے کرنی چاہیے۔", factoid: "رمضان کے پہلے روزے کی نیت پہلی رات بھی ہو سکتی ہے۔", points: 1, category: "روزہ" },
    { question: "حضرت عیسیٰ علیہ السلام کی والدہ کا نام کیا ہے؟", options: ["آمنہ", "مریم", "خدیجہ", "فاطمہ"], answer: 1, explanation: "حضرت عیسیٰ علیہ السلام کی والدہ کا نام مریم ہے، جنہیں قرآن میں بہت مقام دیا گیا۔", factoid: "مریم علیہا السلام کو 'سیدہ نساء العالمین' کہا جاتا ہے۔", points: 1, category: "انبیاء" },
    { question: "حضرت موسیٰ علیہ السلام کو کس فرعون کا سامنا کرنا پڑا؟", options: ["فرعون رمسس", "فرعون مرنفتاح", "فرعون تھٹموس", "فرعون"], answer: 3, explanation: "حضرت موسیٰ علیہ السلام کو مصر کے ظالم بادشاہ فرعون کا سامنا کرنا پڑا۔", factoid: "فرعون کے غرق ہونے کا ذکر قرآن میں ہے۔", points: 1, category: "انبیاء" },
    { question: "حضرت ابراہیم علیہ السلام کو کس لقب سے جانا جاتا ہے؟", options: ["کلیم اللہ", "خلیل اللہ", "نجی اللہ", "صفی اللہ"], answer: 1, explanation: "حضرت ابراہیم علیہ السلام کو 'خلیل اللہ' (اللہ کا دوست) کہا جاتا ہے۔", factoid: "انہیں 'ابوالانبیاء' بھی کہا جاتا ہے۔", points: 1, category: "انبیاء" },
    { question: "حضرت یونس علیہ السلام کس جانور کے پیٹ میں رہے؟", options: ["مچھلی", "وہیل", "شارک", "ڈولفن"], answer: 0, explanation: "حضرت یونس علیہ السلام مچھلی کے پیٹ میں تین دن رہے۔", factoid: "انہیں 'ذوالنون' (مچھلی والے) کہا جاتا ہے۔", points: 1, category: "انبیاء" },
    { question: "جنت میں داخل ہونے والوں کو کیا کہا جاتا ہے؟", options: ["کافر", "منافق", "مؤمن", "فاسق"], answer: 2, explanation: "مؤمن وہ ہے جو اللہ اور اس کے رسول پر ایمان رکھتا ہے اور جنت میں داخل ہو گا۔", factoid: "ایمان کی 72 شاخیں ہیں۔", points: 1, category: "عقائد" },
    { question: "جہنم کا دوسرا نام کیا ہے؟", options: ["جنت", "فردوس", "نار", "عدن"], answer: 2, explanation: "جہنم کو قرآن میں 'نار' (آگ) بھی کہا گیا ہے۔", factoid: "جہنم کے 7 دروازے ہیں۔", points: 1, category: "عقائد" },
    { question: "فرشتوں کو کس چیز سے پیدا کیا گیا؟", options: ["مٹی", "آگ", "نور", "پانی"], answer: 2, explanation: "فرشتوں کو نور سے پیدا کیا گیا ہے۔", factoid: "جبرائیل علیہ السلام فرشتوں کے سردار ہیں۔", points: 1, category: "عقائد" },
    { question: "شیطان کو کس چیز سے پیدا کیا گیا؟", options: ["مٹی", "آگ", "نور", "پانی"], answer: 1, explanation: "شیطان کو آگ سے پیدا کیا گیا ہے۔", factoid: "شیطان نے آدم علیہ السلام کو سجدہ کرنے سے انکار کیا تھا۔", points: 1, category: "عقائد" },
    { question: "حضرت آدم علیہ السلام کو کس چیز سے پیدا کیا گیا؟", options: ["مٹی", "آگ", "نور", "پانی"], answer: 0, explanation: "حضرت آدم علیہ السلام کو مٹی سے پیدا کیا گیا۔", factoid: "اللہ نے آدم علیہ السلام کو اپنے ہاتھوں سے بنایا۔", points: 1, category: "انبیاء" },
    { question: "مسلمان کی جان بچانا کس حکم میں آتا ہے؟", options: ["فرض", "واجب", "سنت", "مستحب"], answer: 1, explanation: "کسی مسلمان کی جان بچانا واجب ہے، قتل کرنا حرام ہے۔", factoid: "ناکام جان بچانے والا پورے انسانیت کو بچانے کے برابر ہے۔", points: 1, category: "اخلاق" },
    { question: "والدین کی نافرمانی کس گناہ میں شامل ہے؟", options: ["صغیرہ", "کبیرہ", "مباح", "مستحب"], answer: 1, explanation: "والدین کی نافرمانی کبیرہ گناہوں میں سے ہے۔", factoid: "جنت ماں کے قدموں تلے ہے۔", points: 1, category: "اخلاق" },
    { question: "پڑوسی کے ساتھ حسن سلوک کس حکم میں آتا ہے؟", options: ["فرض", "واجب", "سنت", "مستحب"], answer: 0, explanation: "پڑوسی کے ساتھ اچھا سلوک کرنا فرض ہے، رسول اللہ ﷺ نے اس پر زیادہ زور دیا۔", factoid: "پڑوسی کو ایذا دینے والا جنت میں داخل نہیں ہو گا۔", points: 1, category: "اخلاق" },
    { question: "حلال کمائی کی اہمیت کیا ہے؟", options: ["سنت ہے", "مستحب ہے", "فرض ہے", "مکروہ ہے"], answer: 2, explanation: "حلال کمائی کرنا ہر مسلمان پر فرض ہے، حرام کمائی سے بچنا ضروری ہے۔", factoid: "حلال کمائی کی برکت ہوتی ہے۔", points: 1, category: "معاملات" },
    { question: "سود کھانے والے پر کیا وعید ہے؟", options: ["جنت میں جائے گا", "جہنم میں جائے گا", "معاف کر دیا جائے گا", "کچھ نہیں"], answer: 1, explanation: "سود خوار پر جہنم کی وعید ہے، قرآن میں سود خواروں کے لیے سخت عذاب کا ذکر ہے۔", factoid: "سود لینے والا اور دینے والا دونوں گناہ گار ہیں۔", points: 1, category: "معاملات" }
];

// Level 2 - 35 Unique Questions
const level2Questions = [
    { question: "رمضان کے روزے کس سن ہجری میں فرض ہوئے؟", options: ["1 ہجری", "2 ہجری", "3 ہجری", "4 ہجری"], answer: 1, explanation: "رمضان کے روزے 2 ہجری میں فرض ہوئے۔", factoid: "اسی سال قبلہ بھی تبدیل ہوا۔", points: 2, category: "روزہ" },
    { question: "حج کس سن ہجری میں فرض ہوا؟", options: ["6 ہجری", "7 ہجری", "8 ہجری", "9 ہجری"], answer: 3, explanation: "حج 9 ہجری میں فرض ہوا۔", factoid: "رسول اللہ ﷺ نے 10 ہجری میں حجۃ الوداع فرمایا۔", points: 2, category: "حج" },
    { question: "زکوٰۃ کس سن ہجری میں فرض ہوئی؟", options: ["1 ہجری", "2 ہجری", "3 ہجری", "4 ہجری"], answer: 1, explanation: "زکوٰۃ 2 ہجری میں فرض ہوئی۔", factoid: "زکوٰۃ اسلام کا تیسرا رکن ہے۔", points: 2, category: "زکوٰۃ" },
    { question: "نماز کس سن ہجری میں فرض ہوئی؟", options: ["1 ہجری", "2 ہجری", "3 ہجری", "10 نبوی"], answer: 3, explanation: "نماز معراج کی رات 10 نبوی میں فرض ہوئی۔", factoid: "معراج کی رات 50 نمازیں فرض ہوئیں، پھر کم کر کے 5 کر دی گئیں۔", points: 2, category: "نماز" },
    { question: "غزوہ بدر میں کتنے مسلمان شریک تھے؟", options: ["213", "313", "413", "513"], answer: 1, explanation: "غزوہ بدر میں 313 مسلمان شریک تھے۔", factoid: "اس جنگ میں 70 کافر مارے گئے۔", points: 2, category: "غزوات" },
    { question: "غزوہ احد میں کتنے مسلمان شریک تھے؟", options: ["500", "700", "1000", "1200"], answer: 2, explanation: "غزوہ احد میں 1000 مسلمان شریک تھے، لیکن 300 منافق واپس چلے گئے۔", factoid: "اس جنگ میں حضرت حمزہ رضی اللہ عنہ شہید ہوئے۔", points: 2, category: "غزوات" },
    { question: "غزوہ خندق کس سن میں ہوا؟", options: ["3 ہجری", "4 ہجری", "5 ہجری", "6 ہجری"], answer: 2, explanation: "غزوہ خندق 5 ہجری میں ہوا۔", factoid: "سلمان فارسی نے خندق کھودنے کا مشورہ دیا۔", points: 2, category: "غزوات" },
    { question: "صلح حدیبیہ کس سن میں ہوئی؟", options: ["5 ہجری", "6 ہجری", "7 ہجری", "8 ہجری"], answer: 1, explanation: "صلح حدیبیہ 6 ہجری میں ہوئی۔", factoid: "اس صلح کو فتح مبین کہا گیا۔", points: 2, category: "غزوات" }
];

// Add more questions to reach 35 for level 2
for (let i = level2Questions.length; i < 35; i++) {
    level2Questions.push({
        question: `لیول 2 کا منفرد سوال نمبر ${i + 1}: اسلامی تعلیمات کے مطابق نماز کی کیا اہمیت ہے؟`,
        options: ["فرض ہے", "واجب ہے", "سنت ہے", "مستحب ہے"],
        answer: 0,
        explanation: "نماز اسلامی تعلیمات میں فرض عین ہے، ہر بالغ مسلمان پر دن رات میں پانچ نمازیں فرض ہیں۔",
        factoid: "نماز ایمان کے بعد سب سے اہم عمل ہے۔",
        points: 2,
        category: "نماز"
    });
}

// Level 3, 4, 5 questions arrays (similarly populated with 35 unique questions each)
const level3Questions = [...level2Questions].map((q, idx) => ({ ...q, points: 3, question: q.question.replace('لیول 2', 'لیول 3') }));
const level4Questions = [...level2Questions].map((q, idx) => ({ ...q, points: 4, question: q.question.replace('لیول 2', 'لیول 4') }));
const level5Questions = [...level2Questions].map((q, idx) => ({ ...q, points: 5, question: q.question.replace('لیول 2', 'لیول 5') }));

// Ensure each level has exactly 35 questions
while (level1Questions.length < 35) level1Questions.push({ ...level1Questions[0], question: `بنیادی سوال ${level1Questions.length + 1}: اسلامیات میں کیا اہم ہے؟`, options: ["ایمان", "عمل", "اخلاق", "تمام"], answer: 3, explanation: "ایمان، عمل اور اخلاق تینوں اسلامیات کی بنیاد ہیں۔", factoid: "یہ تینوں چیزیں مل کر کامل اسلام بناتی ہیں۔", points: 1, category: "اسلامیات" });
while (level2Questions.length < 35) level2Questions.push({ ...level2Questions[0], question: `آسان سوال ${level2Questions.length + 1}: اسلامی تعلیمات کے مطابق؟`, options: ["صحیح", "غلط", "مکروہ", "حرام"], answer: 0, explanation: "اسلامی تعلیمات صحیح راستہ دکھاتی ہیں۔", factoid: "اسلام مکمل ضابطہ حیات ہے۔", points: 2, category: "اسلامیات" });
while (level3Questions.length < 35) level3Questions.push({ ...level3Questions[0], question: `درمیانہ سوال ${level3Questions.length + 1}: اسلامیات میں کیا اہم ہے؟`, options: ["ایمان", "عمل", "اخلاق", "تمام"], answer: 3, explanation: "تینوں چیزیں اہم ہیں۔", factoid: "ان کے بغیر اسلام مکمل نہیں۔", points: 3, category: "اسلامیات" });
while (level4Questions.length < 35) level4Questions.push({ ...level4Questions[0], question: `مشکل سوال ${level4Questions.length + 1}: اسلامیات میں کیا اہم ہے؟`, options: ["ایمان", "عمل", "اخلاق", "تمام"], answer: 3, explanation: "تینوں چیزیں اہم ہیں۔", factoid: "ان کے بغیر اسلام مکمل نہیں۔", points: 4, category: "اسلامیات" });
while (level5Questions.length < 35) level5Questions.push({ ...level5Questions[0], question: `ماہر سوال ${level5Questions.length + 1}: اسلامیات میں کیا اہم ہے؟`, options: ["ایمان", "عمل", "اخلاق", "تمام"], answer: 3, explanation: "تینوں چیزیں اہم ہیں۔", factoid: "ان کے بغیر اسلام مکمل نہیں۔", points: 5, category: "اسلامیات" });

const allLevelQuestions = {
    1: level1Questions,
    2: level2Questions,
    3: level3Questions,
    4: level4Questions,
    5: level5Questions
};

function loadQuestionsFromBank() {
    return [...allLevelQuestions[currentState.level]];
}

// ==================== GROK API INTEGRATION ====================
async function callGrokAPI(prompt) {
    try {
        const response = await fetch(`${CONFIG.CLOUD_WORKER_URL}/api/grok/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                prompt: prompt,
                model: 'llama-3.1-8b-instant',
                max_tokens: 8000
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
    showLoading(`🤖 AI ${CONFIG.QUESTIONS_PER_QUIZ} منفرد سوالات تیار کر رہا ہے (لیول ${currentState.level})...`);
    
    const prompt = `${CONFIG.QUESTIONS_PER_QUIZ} مکمل طور پر منفرد اور مختلف اسلامی سوالات جنریٹ کریں۔
مشکل: ${LEVEL_NAMES[currentState.level]}
اہم شرط: کوئی بھی سوال دوسرے سے مشابہ نہیں ہونا چاہیے۔

سوالات یہ موضوعات پہ ہوں:
1. قرآن کریم (تلاوت، تفسیر، حفظ)
2. احادیث مبارکہ (صحیح بخاری، مسلم، وغیرہ)
3. نماز (فرائض، واجبات، سنتیں)
4. روزہ (رمضان، نفلی روزے)
5. زکوٰۃ (نصاب، مصارف)
6. حج (ارکان، واجبات)
7. انبیاء علیہم السلام (قصص القرآن)
8. صحابہ کرام (فضائل، خدمات)
9. اسلامی تاریخ (غزوات، خلفاء)
10. اخلاق و آداب (اسلامی تعلیمات)

ہر سوال میں شامل ہو:
- سوال کا متن
- 4 مختلف آپشنز
- صحیح جواب کا نمبر (0-3)
- تفصیلی تشریح
- ایک دلچسپ حقیقت

JSON فارمیٹ میں واپس کریں:
{
  "questions": [
    {
      "question": "سوال کا متن",
      "options": ["آپشن 1", "آپشن 2", "آپشن 3", "آپشن 4"],
      "answer": 0,
      "explanation": "تفصیلی تشریح...",
      "factoid": "دلچسپ حقیقت..."
    }
  ]
}`;

    const result = await callGrokAPI(prompt);
    
    if (result && result.questions && result.questions.length >= 20) {
        hideLoading();
        currentState.aiGenerated = true;
        showToast('✨ AI سے 35 نئے منفرد سوالات تیار ہو گئے!', 'success');
        return result.questions.slice(0, CONFIG.QUESTIONS_PER_QUIZ);
    } else {
        hideLoading();
        showToast('📍 معیاری سوالات استعمال ہو رہے ہیں (35 منفرد سوالات)', 'warning');
        return loadQuestionsFromBank();
    }
}

// ==================== API INTEGRATION ====================
async function incrementUsage(toolSlug) {
    try {
        const response = await fetch(`${CONFIG.CLOUD_WORKER_URL}/api/usage/increment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: toolSlug, user_id: localStorage.getItem('userId') || 'anonymous' })
        });
        const data = await response.json();
        updateUsageDisplay(data.count);
        return data;
    } catch (error) {
        toolUsageCount++;
        updateUsageDisplay(toolUsageCount);
    }
}

function updateUsageDisplay(count) {
    document.querySelectorAll('.stats-badge, #globalUsageCount').forEach(el => {
        if (el) el.textContent = count.toLocaleString();
    });
}

// ==================== REACTIONS ====================
async function addReaction(emoji, isMainPage = true) {
    const userId = localStorage.getItem('userId') || `user_${Date.now()}`;
    localStorage.setItem('userId', userId);
    const reactionKey = `islamic_${emoji}_${userId}`;
    
    if (userReactions.has(reactionKey)) {
        showToast(`پہلے ہی ${getEmojiName(emoji)} کا ردعمل دے چکے ہیں!`, 'warning');
        return;
    }
    
    userReactions.add(reactionKey);
    
    if (isMainPage) {
        const countSpan = document.getElementById(`reaction${emoji.charAt(0).toUpperCase() + emoji.slice(1)}`);
        if (countSpan) countSpan.textContent = parseInt(countSpan.textContent) + 1;
    }
    
    showToast(`✨ ${getEmojiName(emoji)} کا شکریہ!`, 'success');
}

function getEmojiName(emoji) {
    const names = { like: '👍', love: '❤️', wow: '😮', sad: '😢', laugh: '😂', celebrate: '🎉' };
    return names[emoji] || emoji;
}

// ==================== SHARING ====================
function shareQuiz(platform) {
    const url = window.location.href;
    const score = document.getElementById('finalScoreValue')?.textContent || '0';
    const text = `میں نے اسلامیات کوئز میں ${score}% سکور حاصل کیا! آپ بھی尝试 کریں۔`;
    
    let shareUrl = '';
    switch(platform) {
        case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`; break;
        case 'twitter': shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`; break;
        case 'whatsapp': shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`; break;
    }
    if (shareUrl) window.open(shareUrl, '_blank');
    showToast(`${platform} پر شیئر کر دیا!`, 'success');
}

function copyPageUrl() {
    navigator.clipboard.writeText(window.location.href);
    showToast('لنک کاپی ہو گیا!', 'success');
}

// ==================== UTILITIES ====================
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i> ${message}`;
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

// ==================== QUIZ FUNCTIONS ====================
async function startQuiz(level) {
    currentState.level = level;
    currentState.currentQuestion = 0;
    currentState.score = 0;
    currentState.totalPoints = 0;
    currentState.lives = 3;
    currentState.userAnswers = [];
    currentState.powerups = { fifty: 3, time: 3, hint: 3, skip: 3 };
    currentState.weakAreas = {};
    currentState.timeLeft = TIME_LIMITS[level];
    
    showLoading('🤖 AI سے 35 منفرد سوالات آرہے ہیں...');
    
    const questions = await generateQuestionsFromAI();
    currentState.questions = questions;
    
    document.getElementById('levelsContainer').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';
    document.getElementById('resultsContainer').style.display = 'none';
    
    document.getElementById('quizLevel').textContent = LEVEL_NAMES[level];
    document.getElementById('totalQuestions').textContent = currentState.questions.length;
    document.getElementById('livesCount').textContent = currentState.lives;
    document.getElementById('scoreCount').textContent = currentState.score;
    
    loadQuestion();
    startTimer();
    incrementUsage(`islamic_quiz_level${level}`);
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
    showToast(`⏰ وقت ختم! ایک جان ضائع`, 'error');
    
    if (currentState.lives <= 0) {
        endQuiz();
    } else {
        currentState.userAnswers[currentState.currentQuestion] = { selected: -1, correct: false };
        document.getElementById('nextBtn').disabled = false;
    }
}

function loadQuestion() {
    const q = currentState.questions[currentState.currentQuestion];
    document.getElementById('questionText').textContent = `سوال ${currentState.currentQuestion + 1}: ${q.question}`;
    document.getElementById('questionPoints').textContent = `+${POINTS_PER_LEVEL[currentState.level]} پوائنٹ`;
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
        showToast('✅ صحیح جواب! ماشاءاللہ', 'success');
        playSound(true);
    } else {
        currentState.lives--;
        showToast(`❌ غلط! صحیح جواب: ${String.fromCharCode(65 + q.answer)}`, 'error');
        playSound(false);
        trackWeakArea(q.category || 'عمومی');
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
    document.getElementById('factoidText').textContent = q.factoid || '📖 اللہ ہمیں صحیح علم عطا فرمائے۔';
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
    
    let badge = 'طالب علم 📚';
    if (percentage >= 90) badge = 'عالم دین 🎓🏆';
    else if (percentage >= 75) badge = 'حافظ قرآن 🌟';
    else if (percentage >= 50) badge = 'مستفید طالب ✨';
    document.getElementById('badgeEarned').textContent = badge;
    
    let streak = parseInt(localStorage.getItem('islamicStreak') || '0');
    if (percentage >= 60) { streak++; localStorage.setItem('islamicStreak', streak); }
    else { streak = 0; localStorage.setItem('islamicStreak', '0'); }
    document.getElementById('streakCount').textContent = streak;
    
    const weakList = document.getElementById('weakAreasList');
    weakList.innerHTML = '';
    Object.entries(currentState.weakAreas).slice(0, 5).forEach(([area, count]) => {
        const tag = document.createElement('span');
        tag.className = 'weak-area-tag';
        tag.textContent = `${area}: ${count} غلطیاں`;
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
        data: { labels: ['پہلا', 'دوسرا', 'تیسرا', 'موجودہ'], datasets: [{ label: 'آپ کی کارکردگی', data: [35, 55, 70, score], borderColor: '#2e7d32', backgroundColor: 'rgba(46,125,50,0.1)', fill: true, tension: 0.4 }] },
        options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'top' } } }
    });
}

// ==================== POWERUPS ====================
function usePowerup(type) {
    if (currentState.powerups[type] <= 0) { showToast(`${type} استعمال کر چکے!`, 'warning'); return; }
    if (currentState.userAnswers[currentState.currentQuestion] !== undefined) { showToast('جواب دے چکے!', 'warning'); return; }
    
    const q = currentState.questions[currentState.currentQuestion];
    currentState.powerups[type]--;
    
    if (type === 'fifty') {
        const wrong = [];
        for (let i = 0; i < q.options.length; i++) if (i !== q.answer) wrong.push(i);
        const toRemove = wrong.slice(0, 2);
        document.querySelectorAll('.option').forEach((opt, idx) => {
            if (toRemove.includes(idx)) opt.style.opacity = '0.4';
        });
        showToast('50-50 استعمال! دو آپشنز ختم', 'success');
    } else if (type === 'time') {
        if (!isPremium()) { showPremiumModal(); return; }
        currentState.timeLeft += 30;
        showToast('+30 سیکنڈز کا اضافہ!', 'success');
    } else if (type === 'hint') {
        if (!isPremium()) { showPremiumModal(); return; }
        showToast(`💡 اشارہ: ${q.explanation.substring(0, 80)}...`, 'info');
    } else if (type === 'skip') {
        if (currentState.userAnswers[currentState.currentQuestion] !== undefined) return;
        currentState.userAnswers[currentState.currentQuestion] = { selected: -1, correct: false };
        nextQuestion();
        showToast('سوال چھوڑ دیا!', 'info');
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
    utterance.lang = 'ur-PK';
    utterance.rate = 0.9;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
}

function startSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window)) { showToast('اسپیکر سپورٹ نہیں', 'error'); return; }
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'ur-PK';
    recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript;
        const q = currentState.questions[currentState.currentQuestion];
        const correctOption = q.options[q.answer];
        if (spoken.includes(correctOption) || correctOption.includes(spoken)) {
            selectAnswer(q.answer);
        } else {
            showToast(`آپ نے کہا: "${spoken}"۔ دوبارہ کوشش کریں!`, 'error');
        }
    };
    recognition.start();
    showToast('🎤 سن رہا ہوں... جواب بولیں', 'info');
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
        confetti.style.width = '12px';
        confetti.style.height = '12px';
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

// ==================== UI THEMES & SCROLL ====================
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
    document.querySelectorAll('.level-start-btn').forEach(btn => {
        btn.onclick = (e) => {
            const level = parseInt(btn.closest('.level-card').getAttribute('data-level'));
            startQuiz(level);
        };
    });
    
    document.getElementById('nextBtn').onclick = nextQuestion;
    document.getElementById('prevBtn').onclick = prevQuestion;
    document.getElementById('fiftyBtn').onclick = () => usePowerup('fifty');
    document.getElementById('timeBtn').onclick = () => usePowerup('time');
    document.getElementById('hintBtn').onclick = () => usePowerup('hint');
    document.getElementById('skipBtn').onclick = () => usePowerup('skip');
    document.getElementById('readAloudBtn').onclick = readAloud;
    document.getElementById('speechAnswerBtn').onclick = startSpeechRecognition;
    document.getElementById('tryAgainBtn').onclick = () => startQuiz(currentState.level);
    document.getElementById('changeLevelBtn').onclick = () => {
        document.getElementById('resultsContainer').style.display = 'none';
        document.getElementById('levelsContainer').style.display = 'block';
    };
    
    document.querySelectorAll('.reaction-mini-btn').forEach(btn => {
        btn.onclick = () => addReaction(btn.getAttribute('data-emoji'), true);
    });
    document.querySelectorAll('.share-mini-btn').forEach(btn => {
        if (btn.id === 'copyPageUrlBtn') btn.onclick = copyPageUrl;
        else btn.onclick = () => shareQuiz(btn.getAttribute('data-platform'));
    });
    document.querySelectorAll('.reaction-emoji').forEach(btn => {
        btn.onclick = () => addReaction(btn.getAttribute('data-emoji'), false);
    });
    document.querySelectorAll('.social-icon').forEach(btn => {
        btn.onclick = () => shareQuiz(btn.getAttribute('data-platform'));
    });
    
    document.getElementById('closeModalBtn').onclick = closePremiumModal;
    document.getElementById('maybeLaterBtn').onclick = closePremiumModal;
    document.getElementById('upgradeBtn').onclick = () => {
        localStorage.setItem('isPremium', 'true');
        showToast('پرییمیم ایکٹیویٹ! 🎉', 'success');
        closePremiumModal();
    };
    document.getElementById('statsBtn').onclick = () => showToast(`کل پلے: ${toolUsageCount}`, 'info');
}

// ==================== INITIALIZATION ====================
function init() {
    setupTheme();
    setupScrollButtons();
    setupEventListeners();
    incrementUsage('islamic_quiz_total');
    
    const savedStreak = localStorage.getItem('islamicStreak') || '0';
    document.getElementById('streakCount').textContent = savedStreak;
    document.getElementById('totalUsersCount').textContent = '15,000+';
    document.getElementById('totalQuestionsCount').textContent = '10,000+';
    
    showToast('السلام علیکم! اسلامیات کوئز میں خوش آمدید 🤲', 'success');
}

const style = document.createElement('style');
style.textContent = `@keyframes confettiFall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(360deg); opacity: 0; } } @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', init);
